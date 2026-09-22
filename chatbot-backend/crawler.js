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
const puppeteer = require("puppeteer");
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const SITEMAP_URL = process.env.SITE_SITEMAP_URL;
const OUTPUT_FILE = "./index.json";

// Tags to strip before reading page text — nav/footer/script noise, not content.
// .disclaimer-backdrop is the first-visit consent modal that renders on every
// page load (Puppeteer never "accepts" it) — without stripping it, its boilerplate
// text gets indexed on every single page and crowds out real content in retrieval.
const STRIP_SELECTORS = "script, style, noscript, nav, footer, header, svg, form, .disclaimer-backdrop";

// ---- helpers ---------------------------------------------------------

async function getSitemapUrls(sitemapUrl) {
  const res = await fetch(sitemapUrl);
  const xml = await res.text();
  const parsed = await xml2js.parseStringPromise(xml);

  // Handle a sitemap index (a sitemap of sitemaps) by recursing one level
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
  // Collapse whitespace, keep it readable
  const text = $("body").text().replace(/\s+/g, " ").trim();
  return { title, text };
}

// Team/leadership pages render each person as a .partner-card with their own
// LinkedIn link ("Connect"). Pulling these out as their own index entries (one
// person per entry, tagged with that person's own URL) lets the chatbot answer
// with a distinct link per expert instead of one link for the whole page.
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
    // `url` is what gets linked to from the chat widget — point it at this
    // person's own website page (not LinkedIn) so visitors land on our site
    // first and can choose to connect from there. `linkedin` is kept as data
    // in case it's needed later, but isn't used for chatbot links.
    // Structured fields (not just flattened text) so server.js can filter/count
    // exactly by credential — an LLM asked to count/filter a long list from
    // free text is unreliable, so credential lookups are answered in code instead.
    members.push({ url: pageUrl, linkedin, pageUrl, title: name, text, name, creds, location, role });
  });
  return members;
}

// Sector/service pages (e.g. "Meet Our IT System Audit Specialists") list
// their specialists with a completely different card component
// (.se-expert-card) than the main leadership page's .partner-card — no
// role, no bio, no sector tags, just name/creds/location. What actually
// matters here isn't the card's own text (there's nothing in it to match
// against) but WHICH page it appears on: this is the site's own authoritative
// "this person is a real specialist for this exact service" signal, more
// reliable than guessing from a generic bio-word overlap. Tagged with its
// own source ("sector-specialist") rather than "team" so it doesn't get
// double-counted alongside the one canonical bio entry from the leadership
// page in team counts/lists.
function extractSectorExperts($, pageUrl) {
  const heading = $("h1, h2, h3")
    .filter((_, el) => /specialist/i.test($(el).text()))
    .first()
    .text()
    .trim();
  // "Meet Our IT System Audit Specialists" -> "IT System Audit"
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

// Split long page text into ~800-character chunks on sentence boundaries,
// so each embedded piece is small, cheap, and topically focused.
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
    model: "text-embedding-3-small", // cheapest embedding model, plenty accurate for site search
    input: text,
  });
  return res.data[0].embedding;
}

// ---- main crawl --------------------------------------------------------

async function run() {
  if (!SITEMAP_URL) throw new Error("Set SITE_SITEMAP_URL in .env");
  console.log("Reading sitemap:", SITEMAP_URL);
  const urls = await getSitemapUrls(SITEMAP_URL);
  console.log(`Found ${urls.length} pages.`);

  const index = [];
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    protocolTimeout: 60000,
  });

  try {
    for (const url of urls) {
      const page = await browser.newPage();
      try {
        await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
        const html = await page.content();
        const $ = cheerio.load(html);
        const { title, text } = extractPageText($);
        if (!text || text.length < 40) continue; // skip empty/near-empty pages

        const chunks = chunkText(text);
        for (const chunk of chunks) {
          const embedding = await embed(chunk);
          index.push({ url, title, text: chunk, embedding });
        }

        const teamMembers = extractTeamMembers($, url);
        for (const member of teamMembers) {
          const embedding = await embed(member.text);
          index.push({ ...member, embedding, source: "team" });
        }

        const sectorExperts = extractSectorExperts($, url);
        for (const expert of sectorExperts) {
          const embedding = await embed(expert.text);
          index.push({ ...expert, embedding, source: "sector-specialist" });
        }

        console.log(
          `Indexed (${chunks.length} chunks${teamMembers.length ? `, ${teamMembers.length} team members` : ""}${sectorExperts.length ? `, ${sectorExperts.length} sector specialists` : ""}): ${url}`
        );
      } catch (err) {
        console.warn(`Skipped ${url}: ${err.message}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index));
  console.log(`\nDone. Wrote ${index.length} chunks to ${OUTPUT_FILE}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
