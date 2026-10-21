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
const fetch = globalThis.fetch || require("node-fetch");
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

// text -> embedding, seeded from the existing index.json so unchanged chunks
// are never re-sent to OpenAI (makes re-runs much faster and cheaper).
const embeddingCache = new Map();

async function embedBatch(texts, retries = 3) {
  const results = new Array(texts.length);
  const missing = [];
  texts.forEach((t, i) => {
    if (embeddingCache.has(t)) results[i] = embeddingCache.get(t);
    else missing.push(i);
  });

  const BATCH = 64;
  for (let start = 0; start < missing.length; start += BATCH) {
    const idxs = missing.slice(start, start + BATCH);
    const input = idxs.map((i) => texts[i]);
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const res = await openai.embeddings.create({ model: "text-embedding-3-small", input });
        res.data.forEach((d, j) => {
          results[idxs[j]] = d.embedding;
          embeddingCache.set(texts[idxs[j]], d.embedding);
        });
        break;
      } catch (err) {
        if (attempt === retries - 1) throw err;
        console.warn(`Embedding API retry ${attempt + 1}/${retries}: ${err.message}`);
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }
  return results;
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

      const teamMembers = extractTeamMembers($, url);
      const sectorExperts = extractSectorExperts($, url);
      const embeddings = await embedBatch([
        ...chunks,
        ...teamMembers.map((m) => m.text),
        ...sectorExperts.map((e) => e.text),
      ]);
      let ei = 0;

      for (const chunk of chunks) {
        const embedding = embeddings[ei++];
        const item = { url, title, text: chunk, embedding, contentHash, source: "website" };
        pageItems.push(item);

        pineconeVectors.push({
          id: makeVectorId("web", url + chunk),
          values: embedding,
          metadata: { url, title, text: chunk, source: "website", contentHash },
        });
      }

      for (const member of teamMembers) {
        const embedding = embeddings[ei++];
        const item = { ...member, embedding, contentHash, source: "team" };
        pageItems.push(item);

        pineconeVectors.push({
          id: makeVectorId("team", url + member.name),
          values: embedding,
          metadata: { url, title: member.name, text: member.text, source: "team", creds: member.creds || "", location: member.location || "", contentHash },
        });
      }

      for (const expert of sectorExperts) {
        const embedding = embeddings[ei++];
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
      await page.close().catch(() => {});
    }
  } finally {
    if (ownBrowser) await browser.close();
  }
}

// Load existing index cache for incremental hashing comparison
// Database content (Articles, Knowledge, ...) is written into index.json by
// ingest-extra.js, not by this crawler. The crawler rebuilds the index from
// scratch, so those entries are held here and written back untouched —
// otherwise every crawl would silently wipe the chatbot's database knowledge
// until the next ingest.
let preservedMongoItems = [];

function loadExistingIndexMap() {
  const map = new Map();
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8"));
      preservedMongoItems = data.filter((item) => item.source === "mongodb");
      for (const item of data) {
        if (item.source === "mongodb") continue;
        if (!map.has(item.url)) {
          map.set(item.url, { hash: item.contentHash || "", items: [] });
        }
        map.get(item.url).items.push(item);
        if (item.text && item.embedding) embeddingCache.set(item.text, item.embedding);
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
  const launchBrowser = () =>
    puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
      protocolTimeout: 60000,
    });
  let browser = await launchBrowser();

  // Chrome can die mid-crawl (memory growth on a long run); once it does, every
  // later page fails with "Connection closed". Restart proactively every N pages
  // and relaunch + retry whenever a page fails because the browser went away.
  const RESTART_EVERY = 5;
  const MAX_ATTEMPTS = 3;
  const isBrowserError = (err) =>
    !browser.connected ||
    /connection closed|target closed|session closed|protocol error|browser has disconnected|not opened/i.test(err.message || "");
  const restartBrowser = async () => {
    await browser.close().catch(() => {});
    browser = await launchBrowser();
    browser.on("disconnected", () => console.warn("Chrome disconnected."));
  };
  browser.on("disconnected", () => console.warn("Chrome disconnected."));

  let skippedCount = 0;
  let reindexedCount = 0;
  let pagesSinceRestart = 0;

  try {
    for (const url of urls) {
      if (pagesSinceRestart >= RESTART_EVERY || !browser.connected) {
        await restartBrowser();
        pagesSinceRestart = 0;
      }
      pagesSinceRestart++;

      let pageResult = null;
      let lastErr = null;
      for (let attempt = 0; attempt < MAX_ATTEMPTS && !pageResult; attempt++) {
        try {
          pageResult = await crawlPageByUrl(url, browser);
        } catch (err) {
          lastErr = err;
          if (isBrowserError(err)) {
            console.warn(`Browser problem at ${url} (attempt ${attempt + 1}/${MAX_ATTEMPTS}): ${err.message}; relaunching`);
            await restartBrowser();
            pagesSinceRestart = 1;
          } else {
            console.warn(`Error at ${url} (attempt ${attempt + 1}/${MAX_ATTEMPTS}): ${err.message}`);
          }
        }
      }

      if (pageResult) {
        if (pageResult.items && pageResult.items.length > 0) {
          index.push(...pageResult.items);
          reindexedCount++;
          console.log(`Indexed (${pageResult.items.length} items): ${url}`);
        }
      } else if (existingMap.has(url)) {
        // Fallback to existing items if page fetch fails
        index.push(...existingMap.get(url).items);
        skippedCount++;
        console.log(`Preserved existing index for ${url} (fetch error: ${lastErr.message})`);
      } else {
        console.warn(`Skipped ${url}: ${lastErr.message}`);
      }

      // Save progress so a crash/Ctrl+C never loses the pages already done.
      // Old entries for not-yet-visited pages are kept so a partial save is never worse than the old index.
      if ((reindexedCount + skippedCount) % 10 === 0) {
        const done = new Set(index.map((i) => i.url));
        const carried = [];
        for (const [u, v] of existingMap) if (!done.has(u)) carried.push(...v.items);
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index.concat(carried, preservedMongoItems)));
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }

  index.push(...preservedMongoItems);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index));
  console.log(`\nDone. Reindexed: ${reindexedCount}, Preserved: ${skippedCount}, Database chunks kept: ${preservedMongoItems.length}. Wrote ${index.length} chunks to ${OUTPUT_FILE}`);
}

if (require.main === module) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { crawlPageByUrl, run, getSitemapUrls };

