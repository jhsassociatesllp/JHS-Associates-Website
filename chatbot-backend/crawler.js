/**
 * crawler.js
 * ----------
 * Reads your website's sitemap.xml, visits every page with a headless
 * browser (the site is a JS-rendered SPA, so plain HTML fetch returns an
 * empty shell), extracts the meaningful text, splits it into chunks,
 * embeds each chunk with OpenAI, and saves everything into index.json.
 *
 * Run manually:      node crawler.js
 * Run on a schedule:  a nightly cron job / GitHub Action / Render cron
 *                      job calling `node crawler.js` keeps index.json fresh
 *                      automatically — no manual editing required.
 */

require("dotenv").config();
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const xml2js = require("xml2js");
const fs = require("fs");
const crypto = require("crypto");
const puppeteer = require("puppeteer");
const { OpenAI } = require("openai");
const pinecone = require("./lib/pinecone");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_dev" });
const SITEMAP_URL = process.env.SITE_SITEMAP_URL;
const OUTPUT_FILE = "./index.json";

// Tags to strip before reading page text — nav/footer/script noise, not content.
const STRIP_SELECTORS = "script, style, noscript, nav, footer, header, svg, form, .disclaimer-backdrop";

function getContentHash(text) {
  return crypto.createHash("md5").update(text || "").digest("hex");
}

function makeVectorId(prefix, key) {
  const hash = crypto.createHash("md5").update(key).digest("hex");
  return `${prefix}_${hash}`;
}

// ---- helpers ---------------------------------------------------------

async function getSitemapUrls(sitemapUrl) {
  let xml = "";
  try {
    const res = await fetch(sitemapUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/xml,text/xml,*/*",
        "Accept-Encoding": "identity",
      },
    });
    xml = await res.text();
  } catch (err) {
    console.warn(`node-fetch failed for ${sitemapUrl} (${err.message}), fetching via Puppeteer...`);
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    try {
      const page = await browser.newPage();
      await page.goto(sitemapUrl, { waitUntil: "networkidle0" });
      xml = await page.content();
    } finally {
      await browser.close();
    }
  }

  const parsed = await xml2js.parseStringPromise(xml);

  if (parsed.sitemapindex) {
    const subSitemaps = parsed.sitemapindex.sitemap.map((s) => s.loc[0]);
    let all = [];
    for (const sm of subSitemaps) all = all.concat(await getSitemapUrls(sm));
    return all;
  }
  return parsed.urlset.url.map((u) => u.loc[0]);
}

function extractPageText($) {
  $(STRIP_SELECTORS).remove();
  const title = $("title").text().trim();
  const text = $("body").text().replace(/\s+/g, " ").trim();
  return { title, text };
}

function extractTeamMembers($, pageUrl) {
  const members = [];
  $(".partner-card").each((_, el) => {
    const card = $(el);
    const name = card.find(".partner-card__name").text().trim();
    if (!name) return;
    const creds = card.find(".partner-card__creds").text().trim();
    const location = card.find(".partner-card__location span").text().trim();
    const role = card.find(".partner-card__role").text().trim();
    const desc = card.find(".partner-card__desc").text().trim();
    const sectors = card
      .find(".partner-card__sector-tag")
      .map((_, tag) => $(tag).text().trim())
      .get()
      .join(", ");
    const linkedin = card.find("a.partner-card__social").attr("href") || pageUrl;

    const text = `${name}, ${creds}${location ? ", " + location : ""}${role ? ", " + role : ""}. ${desc}${sectors ? " Specialisations: " + sectors + "." : ""}`.trim();
    members.push({ url: pageUrl, linkedin, pageUrl, title: name, text, name, creds, location, role });
  });
  return members;
}

function extractSectorExperts($, pageUrl) {
  const heading = $("h1, h2, h3")
    .filter((_, el) => /specialist/i.test($(el).text()))
    .first()
    .text()
    .trim();
  const topic = heading.replace(/^meet\s+our\s+/i, "").replace(/\s+specialists?$/i, "").trim() || $("title").text().trim();

  const experts = [];
  $(".se-expert-card").each((_, el) => {
    const card = $(el);
    const name = card.find(".se-expert-card__name").text().trim();
    if (!name) return;
    const creds = card.find(".se-expert-card__creds").text().trim();
    const location = card.find(".se-expert-card__location").text().trim();
    const linkedin = card.find("a.se-expert-card__linkedin").attr("href") || pageUrl;
    const text = `${name}${creds ? ", " + creds : ""}${location ? ", " + location : ""} is one of our specialists for ${topic}.`;
    experts.push({ url: pageUrl, linkedin, pageUrl, title: name, text, name, creds, location, topic });
  });
  return experts;
}

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
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}

/**
 * Crawls and processes a single page URL (used by Tier 1 Webhooks & main crawler loop)
 */
async function crawlPageByUrl(url, browserInstance = null) {
  const ownBrowser = !browserInstance;
  const browser = browserInstance || (await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    protocolTimeout: 60000,
  }));

  const pageItems = [];
  const pineconeVectors = [];

  try {
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
      const html = await page.content();
      const $ = cheerio.load(html);
      const { title, text } = extractPageText($);
      if (!text || text.length < 40) return { items: [], pineconeVectors: [], hash: "" };

      const contentHash = getContentHash(text);
      const chunks = chunkText(text);

      for (const chunk of chunks) {
        const embedding = await embed(chunk);
        const item = { url, title, text: chunk, embedding, contentHash, source: "website" };
        pageItems.push(item);

        pineconeVectors.push({
          id: makeVectorId("web", url + chunk),
          values: embedding,
          metadata: { url, title, text: chunk, source: "website", contentHash },
        });
      }

      const teamMembers = extractTeamMembers($, url);
      for (const member of teamMembers) {
        const embedding = await embed(member.text);
        const item = { ...member, embedding, contentHash, source: "team" };
        pageItems.push(item);

        pineconeVectors.push({
          id: makeVectorId("team", url + member.name),
          values: embedding,
          metadata: { url, title: member.name, text: member.text, source: "team", creds: member.creds || "", location: member.location || "", contentHash },
        });
      }

      const sectorExperts = extractSectorExperts($, url);
      for (const expert of sectorExperts) {
        const embedding = await embed(expert.text);
        const item = { ...expert, embedding, contentHash, source: "sector-specialist" };
        pageItems.push(item);

        pineconeVectors.push({
          id: makeVectorId("expert", url + expert.name + expert.topic),
          values: embedding,
          metadata: { url, title: expert.name, text: expert.text, source: "sector-specialist", contentHash },
        });
      }

      if (pinecone.isPineconeEnabled() && pineconeVectors.length > 0) {
        await pinecone.upsertVectors(pineconeVectors);
      }

      return { items: pageItems, pineconeVectors, hash: contentHash, title };
    } finally {
      await page.close();
    }
  } finally {
    if (ownBrowser) await browser.close();
  }
}

// Load existing index cache for incremental hashing comparison
function loadExistingIndexMap() {
  const map = new Map();
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8"));
      for (const item of data) {
        if (!map.has(item.url)) {
          map.set(item.url, { hash: item.contentHash || "", items: [] });
        }
        map.get(item.url).items.push(item);
      }
    } catch (e) {
      console.warn("Could not parse existing index.json for incremental check:", e.message);
    }
  }
  return map;
}

// ---- main crawl --------------------------------------------------------

async function run() {
  if (!SITEMAP_URL) throw new Error("Set SITE_SITEMAP_URL in .env");
  console.log("Reading sitemap:", SITEMAP_URL);
  const urls = await getSitemapUrls(SITEMAP_URL);
  console.log(`Found ${urls.length} pages.`);

  const existingMap = loadExistingIndexMap();
  const index = [];
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    protocolTimeout: 60000,
  });

  let skippedCount = 0;
  let reindexedCount = 0;

  try {
    for (const url of urls) {
      try {
        const pageResult = await crawlPageByUrl(url, browser);
        if (pageResult.items && pageResult.items.length > 0) {
          index.push(...pageResult.items);
          reindexedCount++;
          console.log(`Indexed (${pageResult.items.length} items): ${url}`);
        }
      } catch (err) {
        // Fallback to existing items if page fetch fails
        if (existingMap.has(url)) {
          index.push(...existingMap.get(url).items);
          skippedCount++;
          console.log(`Preserved existing index for ${url} (fetch error: ${err.message})`);
        } else {
          console.warn(`Skipped ${url}: ${err.message}`);
        }
      }
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index));
  console.log(`\nDone. Reindexed: ${reindexedCount}, Preserved: ${skippedCount}. Wrote ${index.length} chunks to ${OUTPUT_FILE}`);
}

if (require.main === module) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { crawlPageByUrl, run, getSitemapUrls };

