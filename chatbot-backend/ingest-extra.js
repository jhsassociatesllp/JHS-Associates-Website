/**
 * ingest-extra.js
 * ----------------
 * Reads records from YOUR MongoDB database and adds them into the same
 * index.json that crawler.js builds from your website — so the chatbot
 * answers from BOTH the website AND your database, together.
 *
 * Only pulls from a fixed whitelist of PUBLIC content collections
 * (see PUBLIC_COLLECTIONS below) — never from collections that hold visitor
 * submissions or personal data (contact_us, proposals, alumni, feedback,
 * career_applications, career_resumes.*, admins, etc.), even if they exist
 * in the same database. This is a public-facing chatbot; those collections
 * contain names/emails/phone numbers that must never be answerable to a
 * random site visitor. If you add a new collection you want indexed, add it
 * to PUBLIC_COLLECTIONS deliberately — don't widen this to "everything".
 *
 * WHERE TO PUT YOUR DETAILS: all in your .env file — MONGO_URI,
 * MONGO_DB_NAME. Nothing else to configure for the connection itself.
 *
 * Run: node ingest-extra.js   (or: npm run crawl:extra)
 */

require("dotenv").config();
const fs = require("fs");
const { MongoClient } = require("mongodb");
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const INDEX_FILE = "./index.json";

// Each entry: which collection, how to turn one document into { url, title,
// text }, verified against real documents in this database (field names
// differ per collection — Articles/Knowledge use "title", Excellencia uses
// "heading"; Regulatory/WhitePaper have no body text, just a title +
// summary backing a PDF). None of these documents carry their own detail-page
// URL, so each links back to that content type's listing page on the site
// (Excellencia is the exception — its own button_url, e.g. a YouTube video,
// is more specific and used instead when present).
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

async function embed(text) {
  const res = await openai.embeddings.create({ model: "text-embedding-3-small", input: text });
  return res.data[0].embedding;
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

  // Load existing index (built by crawler.js) so we ADD to it, not overwrite it
  let index = [];
  if (fs.existsSync(INDEX_FILE)) index = JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8"));

  // Remove previous MongoDB entries so re-running this script updates them
  // instead of duplicating them endlessly
  index = index.filter((item) => item.source !== "mongodb");

  for (const { name, hubUrl, toRecord } of PUBLIC_COLLECTIONS) {
    const docs = await db.collection(name).find({}).toArray();
    console.log(`${name}: ${docs.length} documents`);

    for (const doc of docs) {
      const record = toRecord(doc);
      if (!record.text || record.text.length < 10) continue;
      // Most of these documents have no page of their own on the site (no
      // per-article route exists there yet) — record.url is only set for
      // the few that DO have a genuinely specific link (e.g. Excellencia's
      // own button_url). Everything else falls back to the shared listing
      // page, which is NOT a page for this one item — isHubLink flags that
      // distinction for server.js so it never offers that shared URL as if
      // it were a link to this specific item.
      const isHubLink = !record.url;
      const url = record.url || hubUrl;

      const chunks = chunkText(record.text);
      for (const chunk of chunks) {
        const embedding = await embed(chunk);
        index.push({ url, isHubLink, title: record.title, text: chunk, embedding, source: "mongodb", collection: name });
      }
    }
  }

  await client.close();

  fs.writeFileSync(INDEX_FILE, JSON.stringify(index));
  console.log(`Done. MongoDB records added. Total chunks in index now: ${index.length}`);
}

run().catch((err) => {
  console.error("MongoDB ingest failed:", err.message);
  process.exit(1);
});
