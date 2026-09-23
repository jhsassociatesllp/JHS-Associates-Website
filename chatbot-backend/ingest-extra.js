require("dotenv").config();
const fs = require("fs");
const crypto = require("crypto");
const { MongoClient, ObjectId } = require("mongodb");
const { OpenAI } = require("openai");
const pinecone = require("./lib/pinecone");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_dev", fetch: globalThis.fetch });
const INDEX_FILE = "./index.json";

const PUBLIC_COLLECTIONS = [
  {
    name: "Articles",
    hubUrl: "https://www.jhsassociates.in/articles",
    toRecord: (doc) => ({
      url: doc.pageUrl || null,
      title: doc.title,
      text: [doc.title, doc.author, doc.short_description, doc.content].filter(Boolean).join(". "),
    }),
  },
  {
    name: "Knowledge",
    hubUrl: "https://www.jhsassociates.in/resources",
    toRecord: (doc) => ({
      url: doc.pageUrl || null,
      title: doc.title,
      text: [doc.title, doc.author, doc.short_description, doc.content].filter(Boolean).join(". "),
    }),
  },
  {
    name: "Regulatory",
    hubUrl: "https://www.jhsassociates.in/regulatory",
    toRecord: (doc) => ({
      url: doc.pageUrl || null,
      title: doc.title,
      text: [doc.title, doc.short_description].filter(Boolean).join(". "),
    }),
  },
  {
    name: "WhitePaper",
    hubUrl: "https://www.jhsassociates.in/white-papers",
    toRecord: (doc) => ({
      url: doc.pageUrl || null,
      title: doc.title,
      text: [doc.title, doc.short_description].filter(Boolean).join(". "),
    }),
  },
  {
    name: "Excellencia",
    hubUrl: "https://www.jhsassociates.in/excellencia",
    toRecord: (doc) => ({
      url: doc.button_url || null,
      title: doc.heading,
      text: [doc.heading, doc.short_description].filter(Boolean).join(". "),
    }),
  },
];

function chunkText(text, maxLen = 800) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks = [];
  let current = "";
  for (const s of sentences) {
    if ((current + " " + s).length > maxLen && current) {
      chunks.push(current.trim());
      current = s;
    } else {
      current += " " + s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function embed(text, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await openai.embeddings.create({ model: "text-embedding-3-small", input: text });
      return res.data[0].embedding;
    } catch (err) {
      if (attempt === retries - 1) throw err;
      console.warn(`Embedding API retry ${attempt + 1}/${retries}: ${err.message}`);
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
}

function makeVectorId(collection, docId, chunkIndex) {
  return `mongo_${collection}_${docId}_${chunkIndex}`;
}

async function ingestSingleDoc(collectionName, docId) {
  if (!process.env.MONGO_URI) return false;
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db(process.env.MONGO_DB_NAME);

  const colConfig = PUBLIC_COLLECTIONS.find((c) => c.name.toLowerCase() === collectionName.toLowerCase());
  if (!colConfig) return false;

  let query = { _id: docId };
  if (typeof docId === "string" && docId.length === 24) {
    try { query = { _id: new ObjectId(docId) }; } catch (e) {}
  }

  const doc = await db.collection(colConfig.name).findOne(query);
  await client.close();
  if (!doc) return false;

  const record = colConfig.toRecord(doc);
  if (!record.text || record.text.length < 10) return false;

  const isHubLink = !record.url;
  const url = record.url || colConfig.hubUrl;
  const contentHash = crypto.createHash("md5").update(record.text).digest("hex");
  const chunks = chunkText(record.text);

  const newItems = [];
  const pineconeVectors = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await embed(chunk);
    const item = { url, isHubLink, title: record.title, text: chunk, embedding, source: "mongodb", collection: colConfig.name, docId: String(doc._id), contentHash };
    newItems.push(item);

    pineconeVectors.push({
      id: makeVectorId(colConfig.name, String(doc._id), i),
      values: embedding,
      metadata: { url, title: record.title, text: chunk, source: "mongodb", collection: colConfig.name, isHubLink, contentHash },
    });
  }

  if (pinecone.isPineconeEnabled() && pineconeVectors.length > 0) {
    await pinecone.upsertVectors(pineconeVectors);
  }

  // Update index.json in memory/disk
  if (fs.existsSync(INDEX_FILE)) {
    let index = JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8"));
    index = index.filter((item) => !(item.source === "mongodb" && item.collection === colConfig.name && item.docId === String(doc._id)));
    index.push(...newItems);
    fs.writeFileSync(INDEX_FILE, JSON.stringify(index));
  }

  return true;
}

async function run() {
  if (!process.env.MONGO_URI) {
    console.log("MONGO_URI not set in .env — skipping MongoDB ingest.");
    return;
  }

  console.log("Connecting to MongoDB...");
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db(process.env.MONGO_DB_NAME);

  let index = [];
  if (fs.existsSync(INDEX_FILE)) index = JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8"));
  index = index.filter((item) => item.source !== "mongodb");

  const pineconeVectors = [];

  for (const { name, hubUrl, toRecord } of PUBLIC_COLLECTIONS) {
    const docs = await db.collection(name).find({}).toArray();
    console.log(`${name}: ${docs.length} documents`);

    for (const doc of docs) {
      const record = toRecord(doc);
      if (!record.text || record.text.length < 10) continue;
      const isHubLink = !record.url;
      const url = record.url || hubUrl;
      const contentHash = crypto.createHash("md5").update(record.text).digest("hex");

      const chunks = chunkText(record.text);
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embedding = await embed(chunk);
        index.push({ url, isHubLink, title: record.title, text: chunk, embedding, source: "mongodb", collection: name, docId: String(doc._id), contentHash });

        pineconeVectors.push({
          id: makeVectorId(name, String(doc._id), i),
          values: embedding,
          metadata: { url, title: record.title, text: chunk, source: "mongodb", collection: name, isHubLink, contentHash },
        });
      }
    }
  }

  await client.close();

  if (pinecone.isPineconeEnabled() && pineconeVectors.length > 0) {
    await pinecone.upsertVectors(pineconeVectors);
    console.log(`Upserted ${pineconeVectors.length} MongoDB vectors to Pinecone.`);
  }

  fs.writeFileSync(INDEX_FILE, JSON.stringify(index));
  console.log(`Done. MongoDB records added. Total chunks in index now: ${index.length}`);
}

if (require.main === module) {
  run().catch((err) => {
    console.error("MongoDB ingest failed:", err.message);
    process.exit(1);
  });
}

module.exports = { ingestSingleDoc, run, PUBLIC_COLLECTIONS };

