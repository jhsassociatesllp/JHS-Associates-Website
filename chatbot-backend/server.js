/**
 * server.js
 * ---------
 * The only thing the browser talks to. Keeps the OpenAI key private,
 * retrieves only the relevant page chunks for a question, and enforces
 * the "website content only, never the site's tech stack" rules.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const { OpenAI } = require("openai");
const { MongoClient } = require("mongodb");
const pinecone = require("./lib/pinecone");
const crawler = require("./crawler");
const ingestExtra = require("./ingest-extra");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_dev", fetch: globalThis.fetch });

// A "how many articles/whitepapers/..." question is cheap to answer with a
// live count straight from MongoDB — no embeddings needed, just "how many
// documents are in this collection right now". Content there can be added
// or removed between scheduled re-crawls (see scheduler.js), and a stale
// count from the last ingestion snapshot is worse than the small extra
// latency of asking the database directly. Connects once at startup and
// reuses that connection; answerContentCountQuery() below falls back to the
// last-crawled index.json snapshot if this is unset or the DB is briefly
// unreachable, so a live-count hiccup never breaks the feature entirely.
let mongoDb = null;
if (process.env.MONGO_URI) {
  new MongoClient(process.env.MONGO_URI)
    .connect()
    .then((client) => {
      mongoDb = client.db(process.env.MONGO_DB_NAME);
      console.log("Connected to MongoDB for live content counts.");
    })
    .catch((err) => console.warn("MongoDB connection failed — content counts will use the last crawled snapshot instead:", err.message));
}
const path = require("path");
const app = express();
const ALLOWED_ORIGIN = (process.env.ALLOWED_ORIGIN || "").replace(/\/$/, "") || "*";
app.use(express.json());
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.static(path.join(__dirname, "public"))); // serves /widget.js and /demo.html

// This endpoint is a plain HTTP JSON API — CORS above only stops OTHER
// websites' browser JavaScript from calling it, it does nothing to stop a
// direct call from curl, Postman, a mobile app backend, or any other
// non-browser client. Rate limiting alone isn't real access control, so:
// requests from the site's own widget (real browsers send an Origin header
// that matches ALLOWED_ORIGIN automatically — nothing to change in
// widget.js) pass through as before; anyone else needs an API key. Only
// enforced once API_KEY is actually set in .env — unset, this is a no-op,
// so nothing breaks before you're ready to lock it down.
function requireApiKeyForExternalCallers(req, res, next) {
  if (!process.env.API_KEY) return next();
  const origin = (req.headers.origin || "").replace(/\/$/, "");
  if (origin && ALLOWED_ORIGIN !== "*" && origin === ALLOWED_ORIGIN) return next();
  if (req.headers["x-api-key"] === process.env.API_KEY) return next();
  return res.status(401).json({ error: "Missing or invalid API key. Pass it as the 'x-api-key' header." });
}

// Basic abuse protection — also protects your OpenAI bill
app.use(
  "/api/chat",
  requireApiKeyForExternalCallers,
  rateLimit({ windowMs: 60 * 1000, max: 15, message: { error: "Too many requests, slow down." } })
);

// ---- load the content index built by crawler.js ------------------------

let INDEX = [];
// Every URL that actually exists in the crawled/ingested data, rebuilt
// whenever the index reloads. SYSTEM_PROMPT tells the model never to invent
// a URL, but that's a request, not a guarantee — it has been observed
// fabricating a plausible-looking but nonexistent URL (e.g. a made-up
// per-person profile slug when every real team member entry actually shares
// one single URL). Checked in the chat endpoint before any link reaches a
// visitor, since a wrong link is worse than no link.
let KNOWN_URLS = new Set();
// Short all-caps credential codes (FCA, ACA, CISA, ...) found in team members'
// `creds` field, rebuilt whenever the index reloads — see answerCredentialCount().
let CREDENTIAL_VOCAB = new Set();
// Office cities actually present in the team data (Mumbai, Vadodara, ...),
// rebuilt whenever the index reloads — see findLocationInQuestion().
let LOCATION_VOCAB = new Set();
// Individual words pulled from every team member's "Specialisations: ..."
// tag (tax, audit, risk, governance, ...), rebuilt whenever the index
// reloads — see findSectorInQuestion().
let SECTOR_VOCAB = new Set();
// Every domain word the exact-match detectors below key off of (sector
// words, location names, plus a fixed set of role/people words like
// "partners", "council", "board") — used by correctTypos() to fix a single
// mistyped letter anywhere in the question before any detector runs, so one
// typo can't silently disable the detector that depends on that word and
// dump the question onto the unreliable LLM counting path. Rebuilt whenever
// the index reloads.
let TYPO_VOCAB = new Set();
// Maps a page URL to the real specialists the SITE ITSELF lists there (a
// "Meet Our X Specialists" section — see extractSectorExperts in
// crawler.js), rebuilt whenever the index reloads. This is the authoritative
// signal for "who's a genuine specialist for this exact service" — stronger
// than guessing from bio-word overlap (SECTOR_VOCAB), which can both miss a
// real specialist whose personal bio tag doesn't literally contain the word,
// and wrongly include an unrelated person whose bio happens to.
let SECTOR_SPECIALISTS_BY_URL = new Map();

function buildCredentialVocab() {
  const vocab = new Set();
  for (const item of INDEX) {
    if (item.source !== "team" || !item.creds) continue;
    for (const tok of item.creds.split(",")) {
      const clean = tok.trim();
      // 3+ letters only — "CA" alone is excluded on purpose: it's the generic
      // professional title (almost everyone here is "a CA" in casual speech),
      // not a distinguishing credential like FCA/ACA, so treating it as a
      // strict filter would wrongly narrow "who are the CA experts" down to
      // just the one person whose credential string is literally "CA".
      if (/^[A-Z]{3,6}$/.test(clean)) vocab.add(clean);
    }
  }
  return vocab;
}

function buildLocationVocab() {
  const vocab = new Set();
  for (const item of INDEX) {
    if (item.source === "team" && item.location) vocab.add(item.location);
  }
  return vocab;
}

// crawler.js bakes each person's practice-area tags into the flattened
// `text` as "... Specialisations: Tax & Corporate Advisory." rather than
// storing them as their own field — pull that tail back out so it can be
// filtered on, same as creds/location.
function specialisationsOf(item) {
  const m = item.text.match(/Specialisations:\s*(.+?)\.?\s*$/);
  return m ? m[1].toLowerCase() : "";
}

// Whether a sector word actually shows up anywhere in what a visitor can see
// about this person — not just the internal Specialisations tag (used above
// only to build the recognized-word vocabulary). The two frequently
// disagree: e.g. someone's visible bio says "Tax Advisory" but their tag is
// "Direct & Indirect Tax", so a strict tag-only check silently undercounts
// against what's plainly written on the page, which visitors notice and
// (rightly) call wrong. Checking the full text instead keeps the count
// consistent with what's actually shown.
function bioMentions(item, word) {
  return new RegExp(`\\b${word}\\b`, "i").test(item.text);
}

// A "sector-specialist" entry's own url is just the sector page it was
// found on (see extractSectorExperts) — for an actual clickable "Connect"
// button, use that person's real profile url from their one canonical
// "team" entry (the leadership page) instead, falling back to the sector
// page itself if for some reason they have no leadership-page entry.
function teamUrlForName(name) {
  const t = INDEX.find((i) => i.source === "team" && i.name === name);
  return t ? t.url : null;
}

const SECTOR_STOPWORDS = new Set(["and", "for", "the", "of", "in", "on", "services", "specialist", "specialising"]);

function buildSectorVocab() {
  const vocab = new Set();
  for (const item of INDEX) {
    if (item.source !== "team") continue;
    for (const word of specialisationsOf(item).split(/[^a-z]+/)) {
      if (word.length >= 3 && !SECTOR_STOPWORDS.has(word)) vocab.add(word);
    }
  }
  return vocab;
}

// Role/people words that aren't already covered by SECTOR_VOCAB or
// LOCATION_VOCAB but still drive an exact-match detector elsewhere
// (ROLE_SYNONYMS, PEOPLE_QUERY_RE) — see TYPO_VOCAB above.
const FIXED_TYPO_WORDS = ["partner", "partners", "council", "board", "member", "members", "advisory", "leadership"];
function buildTypoVocab() {
  const vocab = new Set(FIXED_TYPO_WORDS);
  for (const w of SECTOR_VOCAB) vocab.add(w);
  for (const loc of LOCATION_VOCAB) vocab.add(loc.toLowerCase());
  return vocab;
}

function loadIndex() {
  if (!fs.existsSync("./index.json")) {
    console.warn("index.json not found — run `npm run crawl` first.");
    return;
  }
  INDEX = JSON.parse(fs.readFileSync("./index.json", "utf-8"));
  KNOWN_URLS = new Set(INDEX.map((item) => item.url).filter(Boolean));
  CREDENTIAL_VOCAB = buildCredentialVocab();
  LOCATION_VOCAB = buildLocationVocab();
  SECTOR_VOCAB = buildSectorVocab();
  TYPO_VOCAB = buildTypoVocab();
  SECTOR_SPECIALISTS_BY_URL = new Map();
  for (const item of INDEX) {
    if (item.source !== "sector-specialist") continue;
    if (!SECTOR_SPECIALISTS_BY_URL.has(item.pageUrl)) SECTOR_SPECIALISTS_BY_URL.set(item.pageUrl, []);
    SECTOR_SPECIALISTS_BY_URL.get(item.pageUrl).push(item);
  }
  console.log(`Loaded ${INDEX.length} indexed chunks.`);
}
loadIndex();
// Re-load automatically if the crawler updates the file while the server runs
fs.watchFile("./index.json", { interval: 60000 }, loadIndex);
// Keeps index.json itself fresh — periodically re-runs the website crawl and
// MongoDB ingest so new/edited content shows up without a manual re-run.
// See scheduler.js for the interval config (AUTO_REFRESH_HOURS in .env).
require("./scheduler").start();

// ---- simple in-memory cache (cost saver for repeated questions) --------

const CACHE = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function cacheGet(key) {
  const hit = CACHE.get(key);
  if (!hit) return null;
  if (Date.now() - hit.time > CACHE_TTL_MS) {
    CACHE.delete(key);
    return null;
  }
  return hit.value;
}
function cacheSet(key, value) {
  CACHE.set(key, { value, time: Date.now() });
}

// ---- retrieval: cosine similarity over the local index ------------------

function cosineSim(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Questions about people/experts need every team member in context, not just
// the top-K most "similar" ones — otherwise counts ("how many FCA experts")
// and lists silently drop people who scored lower on embedding similarity
// even though they're a perfect match. Team member entries are small and few
// (crawler.js pulls one per .partner-card), so including all of them is cheap.
const PEOPLE_QUERY_RE = /\b(expert|experts|partner|partners|team|leadership|staff|who|office|offices|fca|aca|acca|cisa|cma|connect|council|board|member|members)\b/i;

async function retrieveRelevantChunks(question, topK = 8) {
  const embedRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });
  const qVec = embedRes.data[0].embedding;

  if (pinecone.isPineconeEnabled()) {
    try {
      const pMatches = await pinecone.queryVectors(qVec, topK + 4);
      if (pMatches && pMatches.length > 0) {
        const pChunks = pMatches.map((m) => ({
          url: m.metadata.url,
          title: m.metadata.title,
          text: m.metadata.text,
          source: m.metadata.source || "website",
          isHubLink: Boolean(m.metadata.isHubLink),
          score: m.score,
        }));
        const generalP = pChunks.filter((c) => c.source !== "team").slice(0, topK);
        if (PEOPLE_QUERY_RE.test(question) || COUNT_OR_LIST_INTENT_RE.test(question)) {
          const allTeam = INDEX.filter((c) => c.source === "team");
          return [...generalP, ...allTeam];
        }
        const topTeam = INDEX.filter((c) => c.source === "team" && c.score > 0.3).slice(0, 4);
        return [...generalP, ...topTeam];
      }
    } catch (err) {
      console.warn("Pinecone query failed, falling back to local INDEX:", err.message);
    }
  }

  const scored = INDEX.map((item) => ({
    ...item,
    score: cosineSim(qVec, item.embedding),
  }));
  scored.sort((a, b) => b.score - a.score);

  const generalChunks = scored.filter((c) => c.source !== "team").slice(0, topK);

  if (PEOPLE_QUERY_RE.test(question) || COUNT_OR_LIST_INTENT_RE.test(question)) {
    const allTeamMembers = scored.filter((c) => c.source === "team");
    return [...generalChunks, ...allTeamMembers];
  }

  const topTeamMatches = scored.filter((c) => c.source === "team" && c.score > 0.3).slice(0, 4);

  return [...scored.filter((c) => c.source !== "team").slice(0, topK), ...topTeamMatches];
}

// ---- the guardrail system prompt ----------------------------------------

const SYSTEM_PROMPT = `You are the website assistant for this company. Answer visitor questions ONLY using the "CONTEXT" provided below, which comes from the live website.

Rules you must always follow:
- Only use facts present in the CONTEXT. If the answer isn't in the CONTEXT, say you don't have that information — never guess or invent details.
- If asked about how THIS WEBSITE/CHATBOT ITSELF was built — its own tech stack, code, hosting, CMS, or framework (e.g. "what language is this site built in", "is this React", "what database do you use") — politely decline and steer back to services/team/content. Example: "I can help with information about our services and team, not the site's technical setup."
  This is NARROW — it does not cover asking about a SERVICE this company offers that happens to have a tech-sounding name, like "IT Audit", "IT System Audit" (also phrased "IT audit system" — same service, word order varies), "Cybersecurity Assessment", "ERP & Application Controls", "SOC Attestation", or "IT Assurance". Those are real services in the CONTEXT — answer them normally like any other service question. Only decline when the visitor is asking about the chatbot/website's own implementation, not when a service name merely contains a technical word.
- Stay scoped to what was actually asked. If the visitor asks about one specific person, office, sector, or topic, answer only about that one — don't list unrelated others. Only give a full/comprehensive list (e.g. "all our experts", "everyone in Mumbai", "how many X do you have") when the visitor explicitly asks for all of something or asks "how many".
- If the CONTEXT includes a team member whose specialisation genuinely matches a SERVICE/PRACTICE-AREA question (e.g. "explain IT audit", "who handles cybersecurity") — not just any team member, only a real match — end your answer by naming that person as who to connect with for it, with their own [[LINK: ...]] on its own line. Don't force this if no one in the CONTEXT is actually a good match — silence is better than recommending an unrelated person. If MORE THAN ONE team member in the CONTEXT is a genuine match for that same service (some pages list two specialists, not one) — name every one of them, not just the first; don't arbitrarily pick a single person when several are real matches.
  Do NOT do this for a question about an Article/Knowledge piece/Regulatory update/WhitePaper/Excellencia item (i.e. CONTENT, not a service) — even if that content happens to be authored by or mention a team member. The useful next step there is reading the piece itself, not "talk to a person" — just point to the relevant page (Articles/Resources/Regulatory/White Papers/Excellencia) as usual, with no person recommended.
- Whenever you explain, summarize, or answer a question about a specific Article/Knowledge piece/Regulatory update/WhitePaper/Excellencia item using the CONTEXT, always end with a [[LINK: <exact url from context> | <label>]] to that source so the visitor has a way to open the actual page — never leave that kind of answer without a link.
- If asked "how many" of something (e.g. how many FCA experts), state the exact count based on everyone present in the CONTEXT, then list them.
- When listing 3 or fewer people, give a short description for each, then end that person's own mention with [[LINK: <exact url from context> | View Profile]] on its own line before moving to the next person — so each person's description is immediately followed by their own link, not grouped separately at the end.
- When listing MORE than 3 people, keep each one to a single short line (Name — location, one-line specialisation) — no paragraphs, no per-person links — and put exactly ONE [[LINK: ...]] at the very end pointing to the team/leadership page. Never invent a URL that isn't in the CONTEXT — every url must come from the CONTEXT exactly as written (never add a "#" fragment or anything else to it).
- Keep answers concise and conversational — short (2-4 sentences) for a single-topic question; for a requested list, one brief line per item.
- For a longer answer that covers multiple distinct points (e.g. explaining a service/article/whitepaper with several parts), structure it with markdown: "## " for a section heading, "#### " for a smaller sub-heading, and "- " for bullet points — each on its own line. Don't do this for a short, single-point answer; plain sentences are better there.
- Use light markdown even in a short, plain paragraph-style answer, not only in longer structured ones: always wrap a specific person's name in **Name**, and also bold a small number of other genuinely key terms — a service/product name, a regulation, a specific figure or date — with **term**, so a paragraph isn't just an unbroken wall of text. Don't overdo it: bolding most of the sentence defeats the purpose: a couple of bolded terms is far more readable than every noun.
- Some CONTEXT entries are marked "(GENERAL LISTING PAGE — not a page for this specific item, titled "...")". That marked URL is a shared listing page covering many items, not a page for the one specific item you're discussing — still create a [[LINK: ...]] to it (visitors want a clickable way through, even to a listing page), but phrase the surrounding text so it's clear the link leads to the listing rather than that one item directly, e.g. "you can find '<exact title>' on our Articles page [[LINK: <url> | View Articles]]" rather than implying the link opens that specific piece.`;

// ---- deterministic credential count/list (bypasses the LLM) ---------------
// Asking an LLM to count or exhaustively filter a long list from free text is
// unreliable — it drops matches and misreads similar-looking ones (ACA vs FCA).
// "How many FCA experts" has one correct answer computable directly from the
// index, so we answer it in code — instant and always accurate — instead of
// asking GPT to read and count 30+ short bios itself.
function findCredentialInQuestion(message) {
  const upper = message.toUpperCase();
  for (const cred of CREDENTIAL_VOCAB) {
    if (new RegExp(`\\b${cred}\\b`).test(upper)) return cred;
  }
  return null;
}

// Visitors also ask by state/region rather than city ("partners of
// Gujarat") — without this, "Gujarat" matches no known city and (before
// this map existed) silently fell through to every partner nationwide
// instead of just the Vadodara/Rajkot/Ahmedabad/Surat ones. Each entry
// expands to every one of our office cities in that state.
const STATE_TO_CITIES = {
  GUJARAT: ["Vadodara", "Rajkot", "Ahmedabad", "Surat"],
  MAHARASHTRA: ["Mumbai"],
  "WEST BENGAL": ["Kolkata"],
  KARNATAKA: ["Bengaluru"],
  "TAMIL NADU": ["Chennai"],
};

// Standard edit distance — used below to tolerate a one-letter typo (e.g.
// "Gujrat" for "Gujarat") instead of silently missing the place name and
// falling through to the unreliable LLM path for what is actually a clean
// "how many" question.
function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// Self-corrects a single mistyped letter anywhere in the question against
// TYPO_VOCAB (e.g. "partnes" -> "partners", "governace" -> "governance")
// before any of the exact-match detectors below run. Only touches 5+ letter
// words — short words have too many one-edit near-neighbors for a distance-1
// match to mean anything (e.g. "who" is one edit from a dozen unrelated
// words). Applied once at the top of answerTeamListQuery rather than
// duplicated inside each detector.
function correctTypos(message) {
  return message.replace(/[A-Za-z]+/g, (word) => {
    if (word.length < 5) return word;
    const lower = word.toLowerCase();
    if (TYPO_VOCAB.has(lower)) return word;
    for (const v of TYPO_VOCAB) {
      if (Math.abs(v.length - lower.length) <= 1 && levenshtein(lower, v) === 1) return v;
    }
    return word;
  });
}

// Visitors often type a short form instead of the full city/state name
// ("Mum" for Mumbai, "Blr" for Bengaluru, "Bombay"/"Madras"/"Calcutta"/
// "Baroda" as the older names) — these are real, fixed short forms (not
// typos), so an exact word match is used rather than edit distance, which
// wouldn't safely cover a 3-letter form against a 6+ letter city name.
// Deliberately excludes ambiguous 2-letter state codes like "KA" (Karnataka)
// since visitors here often write in Hinglish, where "ka" is an ordinary
// Hindi word ("Ram ka office") — a state-code match there would misfire.
const CITY_ALIASES = {
  MUM: "Mumbai", BOM: "Mumbai", BOMBAY: "Mumbai",
  BLR: "Bengaluru", BNG: "Bengaluru", BANGALORE: "Bengaluru",
  KOL: "Kolkata", CCU: "Kolkata", CALCUTTA: "Kolkata",
  CHN: "Chennai", MADRAS: "Chennai",
  VAD: "Vadodara", BRD: "Vadodara", BARODA: "Vadodara",
  AMD: "Ahmedabad",
  SRT: "Surat",
  DEL: "Delhi",
};
const STATE_ALIASES = { GUJ: "GUJARAT", MH: "MAHARASHTRA", WB: "WEST BENGAL", TN: "TAMIL NADU" };

// Matches a known office city (Mumbai, Vadodara, ...) OR a state that maps
// to one or more of them (Gujarat -> Vadodara/Rajkot/Ahmedabad/Surat)
// mentioned in the question, case-insensitively. Word-boundary so "UAE"
// etc. don't match inside unrelated words. Returns { label, cities } where
// `cities` is what to filter on and `label` is what to show back to the
// visitor (the city name, or the state name they actually typed).
//
// Falls back to a one-typo-tolerant match (edit distance 1, e.g. "Gujrat")
// on individual words of the question so a single dropped/swapped letter
// doesn't bounce an otherwise-clean "how many in <place>" question over to
// the LLM path, which counts unreliably and gave a different (wrong) answer
// than the deterministic path for the exact same question misspelled.
function findLocationInQuestion(message) {
  const upper = message.toUpperCase();
  for (const loc of LOCATION_VOCAB) {
    if (new RegExp(`\\b${loc.toUpperCase()}\\b`).test(upper)) return { label: loc, cities: [loc] };
  }
  for (const [state, cities] of Object.entries(STATE_TO_CITIES)) {
    if (new RegExp(`\\b${state}\\b`).test(upper)) {
      const known = cities.filter((c) => LOCATION_VOCAB.has(c));
      if (known.length) return { label: state.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()), cities: known };
    }
  }
  for (const [alias, city] of Object.entries(CITY_ALIASES)) {
    if (LOCATION_VOCAB.has(city) && new RegExp(`\\b${alias}\\b`).test(upper)) return { label: city, cities: [city] };
  }
  for (const [alias, state] of Object.entries(STATE_ALIASES)) {
    if (new RegExp(`\\b${alias}\\b`).test(upper)) {
      const known = (STATE_TO_CITIES[state] || []).filter((c) => LOCATION_VOCAB.has(c));
      if (known.length) return { label: state.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()), cities: known };
    }
  }

  const words = upper.match(/[A-Z]+/g) || [];
  for (const word of words) {
    if (word.length < 5) continue; // too short for a 1-edit match to be meaningful
    for (const loc of LOCATION_VOCAB) {
      if (levenshtein(word, loc.toUpperCase()) === 1) return { label: loc, cities: [loc] };
    }
    for (const [state, cities] of Object.entries(STATE_TO_CITIES)) {
      if (state.includes(" ")) continue; // multi-word states need exact phrasing
      if (levenshtein(word, state) === 1) {
        const known = cities.filter((c) => LOCATION_VOCAB.has(c));
        if (known.length) return { label: state.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()), cities: known };
      }
    }
  }
  return null;
}

// A place-sounding question ("... in Hyderabad", "which office is ...
// located", "based in ...", "partners of Gujarat") that doesn't match one
// of our known office cities/states (typo, or a place we simply don't
// have) — used to stop the deterministic path from silently falling back
// to "list everyone" just because it couldn't resolve the place name.
//
// Deliberately does NOT include bare "office"/"offices" — those alone don't
// imply an unresolved place the way "located"/"based" do; "how many
// employees in our office" is a perfectly answerable question about the
// whole team, not a place lookup, and including them here previously
// misfired on exactly that phrasing.
const LOCATION_INTENT_WORD_RE = /\b(located|location|based)\b/i;
const LOCATION_INTENT_PREP_RE = /\b(?:in|of|from|at)\s+([a-z]+)\b/i;
// Common words that follow "in/of/from/at" in ordinary phrasing that has
// nothing to do with a place — without excluding these, e.g. "number OF
// COUNT who are not partners" matched as a place reference and wrongly
// deferred an otherwise-answerable question to the unreliable LLM path.
const LOCATION_INTENT_STOPWORDS = new Set(["count", "number", "total", "all", "the", "our", "us", "them", "this", "that", "which"]);

// The specific word that makes this look like an unresolved place reference
// (the word right after "in/of/from/at" — filtered against common non-place
// words), or null if there isn't one. A single source of truth for both
// "does this look like a place reference" (looksLikeUnresolvedLocation) and
// "what word should we name back to the visitor" — previously these were
// two separate, inconsistent extractions, which is exactly how "in our
// office" ended up naming "Our" as if it were a place: the boolean check
// correctly filtered "our" as a stopword, but the SEPARATE extraction used
// to build the reply text didn't apply that same filter.
function unresolvedLocationCandidate(message) {
  const m = message.match(LOCATION_INTENT_PREP_RE);
  if (!m) return null;
  const word = m[1].toLowerCase();
  if (LOCATION_INTENT_STOPWORDS.has(word)) return null;
  // Any recognized sector word ("risk", "audit", ...) or role/people word
  // ("partners", "council", ...) following "in/of/from/at" is just as
  // clearly NOT a place reference, e.g. "who are governance IN RISK" was
  // being misread as an unresolved place even though "risk" had already
  // been correctly resolved as the sector filter — checked dynamically
  // since SECTOR_VOCAB/FIXED_TYPO_WORDS are rebuilt from the live data.
  if (SECTOR_VOCAB.has(word) || FIXED_TYPO_WORDS.includes(word)) return null;
  return word;
}

function looksLikeUnresolvedLocation(message) {
  if (LOCATION_INTENT_WORD_RE.test(message)) return true;
  return unresolvedLocationCandidate(message) !== null;
}

// The site itself distinguishes these three titles (only 25 of 35 team
// members are actually titled "Partner" — the rest are Governance Council
// or Advisory Board) — so "how many partners" must resolve to the role,
// not be treated as a generic synonym for "how many people" the way
// "expert"/"team member" is.
const ROLE_SYNONYMS = [
  // Matches bare "governance" as well as "governance council" — visitors
  // routinely drop "council", and the bare word is ambiguous with the
  // "Governance" specialisation tag some Partners also carry. The named
  // Governance Council team is the far more useful/likely-intended answer
  // here, and matching only the full phrase gave a different, smaller
  // headcount (people whose *hidden* Specialisations tag happens to contain
  // "governance") than what a visitor skimming bios would expect.
  { re: /\bgovernance(?:\s+council)?\b/i, role: "Governance Council" },
  // Matches bare "advisory" too, for the same reason as bare "governance"
  // above — "advisory" is also a specialisation word plenty of ordinary
  // Partners carry (e.g. "Risk Advisory"). Resolving bare "advisory" to the
  // named Advisory Board role here isn't picking one meaning over the
  // other — ROLE_SECTOR_AMBIGUITY below then shows both groups together.
  { re: /\badvisory(?:\s+board(?:\s+members?)?)?\b/i, role: "Advisory Board Member" },
  { re: /\bpartners?\b/i, role: "Partner" },
];
function findRoleInQuestion(message) {
  for (const { re, role } of ROLE_SYNONYMS) {
    if (re.test(message)) return role;
  }
  return null;
}
function roleNoun(role, count) {
  if (role === "Partner") return count === 1 ? "partner" : "partners";
  if (role === "Governance Council") return "Governance Council member" + (count === 1 ? "" : "s");
  if (role === "Advisory Board Member") return "Advisory Board member" + (count === 1 ? "" : "s");
  return count === 1 ? "expert" : "experts";
}

// Both of these named teams share their name with an ordinary specialisation
// word plenty of Partners separately carry (Governance Council / "Risk &
// Governance", Advisory Board / "Risk Advisory" etc.) — see the
// ROLE_SECTOR_AMBIGUITY usage in answerTeamListQuery, which shows both
// groups with their own header plus a closing question instead of silently
// picking one meaning.
const ROLE_SECTOR_AMBIGUITY = {
  "Governance Council": { word: "governance", label: "Risk & Governance", teamShort: "the council" },
  // Unlike "governance" (a genuinely narrow topic — most partners' bios
  // never mention it), "advisory" is effectively what the whole firm does
  // in the broad sense — nearly every partner could fairly be called an
  // "advisory expert" even when their bio never uses that exact word.
  // matchAll: true reflects that: the non-board sense of "advisory" means
  // everyone else on the team, not just the ones whose bio happens to say
  // "advisory" literally (that literal-text version undercounted and looked
  // wrong to anyone comparing against visible bios).
  "Advisory Board Member": { word: "advisory", label: "Advisory", teamShort: "the board", matchAll: true },
};

// Matches a practice-area word (tax, audit, risk, governance, ...) pulled
// from the team's own Specialisations tags. `excludeRe` strips out a
// matched role phrase first so e.g. "governance council" doesn't also fire
// the "governance" sector word.
function findSectorInQuestion(message, excludeRe) {
  const text = excludeRe ? message.replace(excludeRe, "") : message;
  const words = text.toLowerCase().match(/[a-z]+/g) || [];
  for (const w of words) {
    if (SECTOR_VOCAB.has(w)) return w;
  }
  // Tolerate a one-letter typo (e.g. "governace" for "governance") the same
  // way findLocationInQuestion does above — otherwise a single mistyped
  // letter in the one sector word the question hinges on silently defers an
  // otherwise-clean "how many X" question to the unreliable LLM counting
  // path instead of the exact, deterministic count.
  for (const w of words) {
    if (w.length < 5) continue;
    for (const sectorWord of SECTOR_VOCAB) {
      if (levenshtein(w, sectorWord) === 1) return sectorWord;
    }
  }
  return null;
}

// A practice-area-sounding question ("who specialises in cybersecurity")
// that doesn't match one of our known specialisation words — same "don't
// fall back to list everyone" guard as location. Deliberately doesn't
// include a generic "expert(s) in ..." pattern — that phrasing is also how
// people ask about locations ("experts in Mumbai"), so it's left to
// LOCATION_INTENT_RE instead of guessing which one was meant.
const SECTOR_INTENT_RE = /\bspecialis|\bsector\b|\bpractice\b|\bfocus(?:ed)? on\b/i;

// Only take over for "how many" / "list all" style phrasing — a question about
// one specific person that happens to mention a credential (e.g. "does Disha
// Shah have FCA?") should still go to the normal single-answer LLM path below.
const COUNT_OR_LIST_INTENT_RE = /\b(how many|count|list all|list every|all our|all the|everyone|every expert|every partner|full list|who are)\b/i;

// The bit after the role sentence in a team member's flattened `text` (see
// crawler.js) — a short one-line specialisation without re-crawling for it.
function shortDesc(m) {
  const rest = m.text.split(". ").slice(1).join(". ");
  return rest.replace(/\s*Specialisations:.*$/, "").trim();
}

// "CA" in a question means Chartered Accountant — match the FCA/ACA/CA
// designations that actually denote that, not every acronym that happens to
// contain those letters (ACCA is a different body, CISA/CMA/ACS are unrelated
// certifications). Word-boundary matching keeps this from matching inside them.
const CA_SYNONYM_RE = /\bca\b/i;
const CA_CRED_RE = /\b(?:FCA|ACA|CA)\b/i;
// "who are NOT CA" / "experts without FCA" / "excluding" — without this check,
// a negated question matched the same credential and returned the identical
// "who HAS it" list, silently answering the opposite of what was asked.
const NEGATION_RE = /\b(not|non-?[a-z]*|except|excluding|other than|besides|isn't|aren't|don't have|do not have|without)\b/i;

// Returns { intro, items: [{ text, link }], links } for "how many/list all
// experts" style questions — built entirely in code so every item reliably
// gets its own link right below it, instead of depending on the LLM to place
// [[LINK]] markers correctly (which it doesn't do consistently for long lists).
function answerTeamListQuery(rawMessage) {
  if (!COUNT_OR_LIST_INTENT_RE.test(rawMessage)) return null;

  // Strip a trailing "and also .../aur ..." clause that isn't actually about
  // the team before running any filter detection below — otherwise an
  // incidental word overlap in that clause (e.g. "financial" in "financial
  // literacy", which also happens to be a real SECTOR_VOCAB word pulled from
  // some team member's specialisation tag) silently zeroes out an otherwise-
  // correct match and wrongly bounces the whole question to the far less
  // reliable free-form AI path instead of answering with the exact count.
  // answerCompoundContentAddendum (called separately from the endpoint)
  // answers the stripped-off clause on its own.
  let message = correctTypos(splitOffAddendum(rawMessage).core);
  const negated = NEGATION_RE.test(message);
  const cred = findCredentialInQuestion(message);
  const isCASynonym = !cred && CA_SYNONYM_RE.test(message);
  const location = findLocationInQuestion(message);
  const role = findRoleInQuestion(message);
  const roleRe = role && ROLE_SYNONYMS.find((s) => s.role === role).re;
  const sector = findSectorInQuestion(message, roleRe);

  // A generic people noun (expert/partner/team/...) is the usual signal this
  // is a people question, but plenty of real phrasings skip it entirely
  // ("how many advisory in Mumbai", "how many in Vadodara") — if we already
  // resolved a concrete credential/role/sector/location filter, that alone is
  // proof enough this is a people question; only bail out to the LLM when we
  // found neither a people noun nor any concrete filter to work with.
  if (!PEOPLE_QUERY_RE.test(message) && !cred && !isCASynonym && !role && !sector && !location) return null;

  let matches = INDEX.filter((item) => item.source === "team");
  const descriptors = [];

  if (cred) {
    const hasCred = (item) => item.creds && new RegExp(`\\b${cred}\\b`, "i").test(item.creds);
    matches = matches.filter((item) => (negated ? !hasCred(item) : hasCred(item)));
    descriptors.push(`${negated ? "non-" : ""}${cred}`);
  } else if (isCASynonym) {
    // Generic "CA experts" — only people actually holding FCA/ACA/CA, not
    // everyone on the team (many partners hold unrelated credentials like
    // MBA, ACS, CISA, ISO 27001 rather than a Chartered Accountancy one).
    const isCA = (item) => item.creds && CA_CRED_RE.test(item.creds);
    matches = matches.filter((item) => (negated ? !isCA(item) : isCA(item)));
    descriptors.push(negated ? "non-CA" : "CA");
  }

  // Negation on role only applies when it wasn't already spent on the
  // credential filter above (e.g. "not FCA partners" negates the credential,
  // not the role — same "spend negation once" pattern as location below).
  // Previously this ignored `negated` entirely, so "who are NOT partners"
  // silently filtered TO partners and answered the opposite of what was asked.
  const roleNegated = negated && !cred && !isCASynonym;
  if (role) {
    matches = matches.filter((item) => (roleNegated ? item.role !== role : item.role === role));
  }

  if (sector) {
    matches = matches.filter((item) => bioMentions(item, sector));
    descriptors.push(sector);
  }

  // Negation on location only applies when it wasn't already spent on the
  // credential or role filter above (e.g. "not in Mumbai" vs "not FCA, in
  // Mumbai" vs "non-partners in Mumbai").
  const locationNegated = negated && !cred && !isCASynonym && !role;
  if (location) {
    matches = matches.filter((item) =>
      locationNegated ? !location.cities.includes(item.location) : location.cities.includes(item.location)
    );
  }

  // The question sounds like it's asking about a specific place (e.g. "in
  // Hyderabad", "partners of Kerala") that isn't one of our actual offices.
  // Rather than a bare "I don't have that information" (or deferring to the
  // LLM, which has been an inconsistent, sometimes-nonsensical experience
  // here — e.g. recommending an unrelated specialist right after saying we
  // have no one there), say so plainly AND name every place we actually do
  // have people, since that's what the visitor needs next regardless.
  if (!location && looksLikeUnresolvedLocation(message)) {
    const candidate = unresolvedLocationCandidate(message);
    const namedPlace = candidate ? candidate.replace(/\b\w/g, (c) => c.toUpperCase()) : "that location";
    const descLabel = [...descriptors, roleNoun(role, 2)].join(" ");
    const cities = [...LOCATION_VOCAB].sort().join(", ");
    return { intro: `We don't have ${descLabel} in ${namedPlace} — our offices are in: ${cities}.`, items: [], links: [] };
  }
  if (!sector && SECTOR_INTENT_RE.test(message)) return null;

  if (matches.length === 0) return null;

  const noun = roleNegated
    ? `non-${role.toLowerCase()} team member${matches.length === 1 ? "" : "s"}`
    : roleNoun(role, matches.length);
  let label = [...descriptors, noun].join(" ");
  if (location) label += locationNegated ? ` outside ${location.label}` : ` in ${location.label}`;

  // No cap — every match gets shown (the whole team is only 35 people, so the
  // longest possible list still just scrolls, no "and N more" dead end).
  const teamPageUrl = matches[0].pageUrl;
  // Only the person's own name is bolded (**Name**) — widget.js renders that
  // marker as <strong>, nothing else in the line.
  const items = matches.map((m, i) => ({
    text: `${i + 1}. **${m.name}** — ${m.location}, ${m.role}. ${shortDesc(m)}`,
    link: { url: m.url, label: "Connect" },
  }));
  let intro = `We have ${matches.length} ${label}:`;

  const ambiguity = ROLE_SECTOR_AMBIGUITY[role];
  if (ambiguity && !roleNegated) {
    const specMatches = INDEX.filter(
      (item) =>
        item.source === "team" &&
        item.role !== role &&
        (ambiguity.matchAll || bioMentions(item, ambiguity.word)) &&
        (!location || (locationNegated ? !location.cities.includes(item.location) : location.cities.includes(item.location)))
    );
    if (specMatches.length) {
      // Two clearly-labeled groups (each with its own header line, no link)
      // instead of one flat list — so it's obvious which people are the
      // actual named team vs. separately tagged with the specialisation —
      // plus a closing question, since the visitor's original wording
      // didn't actually disambiguate which one they meant.
      const locSuffix = location ? (locationNegated ? ` outside ${location.label}` : ` in ${location.label}`) : "";
      intro = `"${ambiguity.word}" can mean two different things here — here's both:`;
      const roleHeader = { text: `**${role}**${locSuffix} — ${matches.length} member${matches.length === 1 ? "" : "s"}:` };
      // matchAll means this bucket is literally "everyone who isn't on the
      // named team" — NOT people whose bio actually says the word (that's
      // what bioMentions is for, used when !matchAll). Labeling it with
      // ambiguity.label (e.g. "Advisory") here would be misleading: a
      // visitor reading these people's bios would see no mention of that
      // word at all and reasonably call the label wrong, even though the
      // count itself is correct.
      const specHeader = {
        text: ambiguity.matchAll
          ? `**Everyone else**${locSuffix} (not on ${ambiguity.teamShort}) — ${specMatches.length} member${specMatches.length === 1 ? "" : "s"}:`
          : `**${ambiguity.label}**${locSuffix} (a specialisation area, not on ${ambiguity.teamShort}) — ${specMatches.length} member${specMatches.length === 1 ? "" : "s"}:`,
      };
      const specItems = specMatches.map((m, i) => ({
        text: `${i + 1}. **${m.name}** — ${m.location}, ${m.role}. ${shortDesc(m)}`,
        link: { url: m.url, label: "Connect" },
      }));
      const closing = {
        text: ambiguity.matchAll
          ? `Which did you mean — the **${role}** team specifically, or our team more broadly (everyone else)?`
          : `Which did you mean — the **${role}** team, or people who specialise in **${ambiguity.label}**?`,
      };
      return {
        intro,
        items: [roleHeader, ...items, specHeader, ...specItems, closing],
        links: teamPageUrl ? [{ url: teamPageUrl, label: "View Full Team" }] : [],
      };
    }
  }

  return { intro, items, links: teamPageUrl ? [{ url: teamPageUrl, label: "View Full Team" }] : [] };
}

// "How many articles do you have" was going to the LLM path — same
// unreliable-counting problem team questions used to have, except worse:
// the LLM only ever sees a handful of the top-K most similar chunks (each
// article is one of 147, split into several chunks each), not the whole
// collection, so it guessed a number nowhere near the real count (40
// instead of 147). Answered here in code instead, the same way team counts
// are — instant and always exactly right, no guessing.
const CONTENT_TYPE_SYNONYMS = [
  { re: /\barticles?\b/i, collection: "Articles", titleField: "title", noun: "article", hubUrl: "https://www.jhsassociates.in/articles", hubLabel: "View Articles" },
  { re: /\bknowledge\b/i, collection: "Knowledge", titleField: "title", noun: "knowledge piece", hubUrl: "https://www.jhsassociates.in/resources", hubLabel: "View Resources" },
  { re: /\bregulatory\b/i, collection: "Regulatory", titleField: "title", noun: "regulatory update", hubUrl: "https://www.jhsassociates.in/regulatory", hubLabel: "View Regulatory" },
  { re: /\bwhite\s*papers?\b/i, collection: "WhitePaper", titleField: "title", noun: "white paper", hubUrl: "https://www.jhsassociates.in/white-papers", hubLabel: "View White Papers" },
  { re: /\bexcellencia\b/i, collection: "Excellencia", titleField: "heading", noun: "Excellencia item", hubUrl: "https://www.jhsassociates.in/excellencia", hubLabel: "View Excellencia" },
];

// Label for a guaranteed link on a content chunk (see the isContentQuestion
// fallback below) — a hub chunk has no page of its own, so it points to the
// matching collection's listing page instead of a nonexistent per-item URL.
function chunkLinkLabel(chunk) {
  if (chunk.isHubLink) {
    const type = CONTENT_TYPE_SYNONYMS.find((t) => t.collection === chunk.collection);
    return type ? type.hubLabel : "View Page";
  }
  return "Read Full Article";
}
// A compound question ("how many articles AND NAME them") was only ever
// getting the count half answered — the deterministic path claimed the
// whole question just because it matched "how many articles", then
// returned a count-only answer with no titles, silently dropping the
// second half of what was actually asked. Detected here so that half can
// be answered too (a live sample, not the LLM's guess).
const CONTENT_LIST_INTENT_RE = /\b(name|list|which (?:ones|articles|papers|items|updates)|what are|show me|give me)\b/i;

async function answerContentCountQuery(message) {
  if (!COUNT_OR_LIST_INTENT_RE.test(message)) return null;
  const type = CONTENT_TYPE_SYNONYMS.find((t) => t.re.test(message));
  if (!type) return null;
  const wantsNames = CONTENT_LIST_INTENT_RE.test(message);

  async function sampleTitles(limit = 10) {
    if (!mongoDb) return [];
    try {
      const docs = await mongoDb
        .collection(type.collection)
        .find({}, { projection: { [type.titleField]: 1 } })
        .limit(limit)
        .toArray();
      return docs.map((d) => d[type.titleField]).filter(Boolean);
    } catch (err) {
      console.warn(`Sample titles for ${type.collection} failed:`, err.message);
      return [];
    }
  }

  async function buildAnswer(count) {
    const titles = wantsNames ? await sampleTitles() : [];
    const items = titles.map((t, i) => ({ text: `${i + 1}. ${t}` }));
    const intro =
      wantsNames && items.length
        ? `We have ${count} ${type.noun}${count === 1 ? "" : "s"}. Here are ${items.length} of them — see the rest on our ${type.collection === "WhitePaper" ? "White Papers" : type.collection} page:`
        : `We have ${count} ${type.noun}${count === 1 ? "" : "s"}.`;
    return { intro, items, links: [{ url: type.hubUrl, label: type.hubLabel }] };
  }

  // Prefer a LIVE count straight from MongoDB — this collection can gain or
  // lose documents between scheduled re-crawls, and answering from a stale
  // snapshot for a plain "how many do you have right now" question is
  // exactly the kind of wrong-but-confident answer this app keeps needing
  // to route around. Real document count, no chunking artifact to correct
  // for (unlike the index.json fallback below, a live query counts actual
  // documents directly).
  if (mongoDb) {
    try {
      const count = await mongoDb.collection(type.collection).countDocuments({});
      if (count > 0) return await buildAnswer(count);
    } catch (err) {
      console.warn(`Live count for ${type.collection} failed, falling back to the last crawled snapshot:`, err.message);
    }
  }

  // Fallback: the last-ingested snapshot. Each item is chunked into several
  // index entries (long article text split at ~800 chars) — count distinct
  // titles, not chunks, or this would massively overcount instead of
  // undercounting. No live sample titles available in this path (no DB
  // connection), so a "name them" request just gets the count.
  const titles = new Set(
    INDEX.filter((item) => item.source === "mongodb" && item.collection === type.collection).map((item) => item.title)
  );
  if (titles.size === 0) return null;
  return { intro: `We have ${titles.size} ${type.noun}${titles.size === 1 ? "" : "s"}.`, items: [], links: [{ url: type.hubUrl, label: type.hubLabel }] };
}

// The model sometimes writes a plain markdown link `[label](url)` instead of
// our own [[LINK: ...]] marker — widget.js only understands the latter, so
// the former would otherwise show up as literal "[text](url)" text instead
// of a clickable button. Convert any of these into our marker so every link
// the model writes renders as a real, clickable button — including a link
// to a shared listing page, since visitors want something to click through
// to even when it's a listing rather than the one specific item discussed.
function normalizeMarkdownLinks(text) {
  return text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (match, label, url) => `[[LINK: ${url} | ${label}]]`);
}

// Shared by the main streaming answer and the compound-question addendum
// below — pulls [[LINK: url | label]] markers out of a raw completion,
// dedupes by url, drops anything not in KNOWN_URLS (the model has been
// caught inventing a plausible-looking URL that doesn't exist), and strips
// the markers back out of the visible text.
function parseReplyAndLinks(rawText) {
  const raw = normalizeMarkdownLinks(rawText);
  const linkRegex = /\[\[LINK:\s*(.*?)\s*\|\s*(.*?)\]\]/g;
  const rawLinks = [...raw.matchAll(linkRegex)].map((m) => ({ url: m[1], label: m[2] }));
  const seenUrls = new Set();
  const deduped = rawLinks.filter((l) => (seenUrls.has(l.url) ? false : seenUrls.add(l.url)));
  const links = deduped.filter((l) => KNOWN_URLS.has(l.url));
  const reply = raw
    .replace(/\[\[LINK:.*?\]\]/g, "")
    .replace(/\[\[LINK:[\s\S]*$/, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
  return { reply, links };
}

// A compound question mixing a team-list ask with an unrelated content/topic
// ask ("who are the partners of mumbai and also tell me about financial
// literacy") only ever got the team half answered — answerTeamListQuery
// matches on "partners"/"mumbai" and returns instantly via `||` in the
// endpoint below, so the second half was silently dropped instead of being
// answered. This runs only when the team query already matched, and answers
// whatever's left after a conjunction, appended as one more item under the
// team list — same "don't drop half the question" fix as the multi-content-
// type compound handling in answerContentCountQuery, for the team+content mix.
const CONJUNCTION_SPLIT_RE = /\b(?:and also|also|and|aur)\b\s*(.+)$/i;

// Splits a compound question into the "core" clause (used for team-filter
// detection — see answerTeamListQuery) and an unrelated trailing "leftover"
// clause introduced by "and also"/"also"/"and"/"aur", when that leftover is
// substantial and doesn't itself look like another team question (e.g. "...
// and also who are the associates" is a second team question, not content —
// leftover stays null so it's left for the team query itself to handle).
function splitOffAddendum(message) {
  const m = message.match(CONJUNCTION_SPLIT_RE);
  if (!m) return { core: message, leftover: null };
  const leftover = m[1].trim();
  if (leftover.split(/\s+/).length < 2) return { core: message, leftover: null };
  if (PEOPLE_QUERY_RE.test(leftover) || findLocationInQuestion(leftover) || findRoleInQuestion(leftover) || findCredentialInQuestion(leftover)) {
    return { core: message, leftover: null };
  }
  return { core: message.slice(0, m.index).trim(), leftover };
}

async function answerCompoundContentAddendum(message) {
  const { leftover } = splitOffAddendum(message);
  if (!leftover) return null;

  const chunks = await retrieveRelevantChunks(leftover);
  const topGeneralChunk = chunks.find((c) => c.source !== "team");
  // Only answer if the leftover clause actually matches real site content —
  // otherwise stay silent rather than let the model improvise an answer with
  // nothing real in CONTEXT to back it up.
  if (!topGeneralChunk || topGeneralChunk.score < 0.3) return null;

  const context = chunks
    .slice(0, 6)
    .map((c, i) => {
      const sourceLine = c.isHubLink
        ? `Source: ${c.url} (GENERAL LISTING PAGE — not a page for this specific item, titled "${c.title}")`
        : `Source: ${c.url}`;
      return `[${i + 1}] ${sourceLine}\n${c.text}`;
    })
    .join("\n\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 350,
    temperature: 0.3,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `CONTEXT:\n${context}\n\nQUESTION: ${leftover}` },
    ],
  });
  const { reply, links } = parseReplyAndLinks(completion.choices?.[0]?.message?.content || "");
  if (!reply) return null;

  // Same guaranteed-link fallback as the main streaming path below — the
  // model doesn't reliably add its own [[LINK: ...]] for a content answer.
  const isContentQuestion = topGeneralChunk.source === "mongodb";
  if (isContentQuestion && !links.some((l) => l.url === topGeneralChunk.url)) {
    links.push({ url: topGeneralChunk.url, label: chunkLinkLabel(topGeneralChunk) });
  }

  return { text: reply, link: links[0] || null };
}

// ---- Tier 1 Webhook Endpoint for Instant Re-indexing ---------------------

app.post("/api/reindex", requireApiKeyForExternalCallers, async (req, res) => {
  try {
    const { type, url, collection, docId } = req.body;
    if (type === "url" && url) {
      const result = await crawler.crawlPageByUrl(url);
      if (result.items && result.items.length > 0) {
        loadIndex();
        return res.json({ success: true, message: `Reindexed ${result.items.length} chunks for ${url}`, count: result.items.length });
      }
      return res.status(400).json({ error: "Could not extract content from URL" });
    }

    if (type === "mongodb" && collection && docId) {
      const success = await ingestExtra.ingestSingleDoc(collection, docId);
      if (success) {
        loadIndex();
        return res.json({ success: true, message: `Reindexed document ${docId} from collection ${collection}` });
      }
      return res.status(400).json({ error: "Document not found or collection invalid" });
    }

    return res.status(400).json({ error: "Invalid payload. Provide { type: 'url', url } or { type: 'mongodb', collection, docId }" });
  } catch (err) {
    console.error("Reindex error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ---- the chat endpoint ----------------------------------------------------

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing 'message'." });
    }

    const cacheKey = message.trim().toLowerCase();
    const cached = cacheGet(cacheKey);
    if (cached) return res.json({ ...cached, cached: true });

    const teamResult = answerTeamListQuery(message);
    if (teamResult) {
      // If the question also asked about something else besides the team
      // ("... and also tell me about financial literacy"), answer that part
      // too instead of silently dropping it — appended as one more item.
      const addendum = await answerCompoundContentAddendum(message);
      const items = addendum ? [...teamResult.items, { text: addendum.text, link: addendum.link }] : teamResult.items;
      const payload = { reply: teamResult.intro, items, links: teamResult.links, link: teamResult.links[0] || null };
      cacheSet(cacheKey, payload);
      return res.json(payload);
    }

    const contentResult = await answerContentCountQuery(message);
    if (contentResult) {
      const payload = {
        reply: contentResult.intro,
        items: contentResult.items,
        links: contentResult.links,
        link: contentResult.links[0] || null,
      };
      cacheSet(cacheKey, payload);
      return res.json(payload);
    }

    const topChunks = await retrieveRelevantChunks(message);
    const context = topChunks
      .map((c, i) => {
        // isHubLink (set by ingest-extra.js) means this URL is a shared
        // listing page, not a page for this specific item — flagged here so
        // the model never offers it as if clicking through leads to this
        // particular article/whitepaper/etc. (see SYSTEM_PROMPT rule below).
        const sourceLine = c.isHubLink
          ? `Source: ${c.url} (GENERAL LISTING PAGE — not a page for this specific item, titled "${c.title}")`
          : `Source: ${c.url}`;
        return `[${i + 1}] ${sourceLine}\n${c.text}`;
      })
      .join("\n\n");

    // Streamed instead of awaiting the whole completion at once — this is
    // the only slow step in the whole request (the two deterministic paths
    // above return instantly, no OpenAI call at all). Waiting for a full
    // multi-paragraph answer to finish generating before showing anything
    // feels sluggish; streaming lets the widget show words as they arrive,
    // the same way ChatGPT's own UI does, even though the total generation
    // time is unchanged. widget.js reads this as Server-Sent Events and
    // falls back to plain JSON handling for the two paths above, which
    // never reach this branch.
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    if (res.flushHeaders) res.flushHeaders();

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini", // cheap + fast, plenty capable for this
      max_tokens: 600,
      temperature: 0.3,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `CONTEXT:\n${context}\n\nQUESTION: ${message}` },
      ],
    });

    let rawAccumulated = "";
    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content || "";
      if (delta) {
        rawAccumulated += delta;
        res.write(`data: ${JSON.stringify({ delta })}\n\n`);
      }
    }

    let { reply, links } = parseReplyAndLinks(rawAccumulated);

    // SYSTEM_PROMPT asks the model to name and link a genuinely-matching
    // expert for a topic/service question, but that's a request, not a
    // guarantee — it sometimes falls back to a vague, unlinked "talk to our
    // experts" instead of actually naming and linking the one who's in
    // CONTEXT (topTeamMatches in retrieveRelevantChunks already limited this
    // to real topical matches, score > 0.3). If the model didn't already
    // link that same person itself, append it here so the visitor always
    // gets an actual clickable way to reach them, not just a generic phrase.
    //
    // BUT embedding similarity alone isn't reliable enough to gate this on —
    // it has been caught recommending a specialist for questions that have
    // nothing to do with any practice area at all (e.g. "how many years did
    // JHS complete", a plain company-history question, coincidentally
    // scored one person's bio above the threshold). Requiring the visitor's
    // OWN question to mention a real practice-area word ruled that case out,
    // but wasn't enough on its own — the highest embedding-scored team
    // member isn't necessarily the one whose bio actually relates to THAT
    // word (e.g. an article about auditing surfaced someone whose bio is
    // "Cyber Security, GRC, Strategy" — no mention of audit at all). So:
    // find the specific practice-area word in the question, then only
    // recommend a team member from the candidates whose OWN bio contains
    // that same word — not just whoever scored highest overall.
    //
    // Also skip this entirely when the question is really about a piece of
    // CONTENT (an Article/Knowledge/Regulatory/WhitePaper/Excellencia item —
    // source "mongodb") rather than a service — the useful next step there
    // is reading the piece, not "talk to a person", even if it happens to
    // be authored by or mention someone on the team.
    const topGeneralChunk = topChunks.find((c) => c.source !== "team");
    const isContentQuestion = topGeneralChunk && topGeneralChunk.source === "mongodb";

    // Same idea as the specialist-connect guarantee below, but for content:
    // SYSTEM_PROMPT tells the model to always link back to the source page
    // when explaining an Article/Knowledge/Regulatory/WhitePaper/Excellencia
    // item, but that's a request, not a guarantee — it has been caught
    // explaining a topic (e.g. "financial literacy") straight from CONTEXT
    // with no link at all, leaving the visitor no way to actually view the
    // page it came from. If the model didn't already link this source
    // itself, append it here.
    if (isContentQuestion && !links.some((l) => l.url === topGeneralChunk.url)) {
      links.push({ url: topGeneralChunk.url, label: chunkLinkLabel(topGeneralChunk) });
    }

    const sectorWordInQuestion = [...SECTOR_VOCAB].find((word) => message.toLowerCase().includes(word)) || null;

    // If the model's own reply already named specific real team members
    // (e.g. "you can contact Taher Pepermintwala"), those are the people to
    // link — searching independently by sector word below can land on
    // someone completely different who just happens to share the same
    // generic word in their bio. Caught doing exactly that once: the reply
    // correctly named "Taher Pepermintwala" (the actual specialist shown on
    // the real IT System Audit page) but the sector-word search below then
    // appended a "connect with Jagdish Solanki" line for an unrelated
    // person, since his bio also contained whatever generic word got
    // matched first. Trust names the model already committed to in prose
    // over an independent re-derivation that can disagree with them.
    const namedTeamMatches = !isContentQuestion
      ? topChunks.filter(
          (c) => c.source === "team" && new RegExp(`\\b${c.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(reply)
        )
      : [];
    const namedNames = new Set(namedTeamMatches.map((m) => m.name));

    // Authoritative signal first: real specialists the SITE ITSELF lists on
    // the exact page this answer is about (a "Meet Our X Specialists"
    // section — see extractSectorExperts in crawler.js). Stronger than
    // guessing from bio-word overlap below, which can both miss a real
    // specialist whose personal bio tag doesn't literally contain the word
    // (caught missing "Saurabh Shah" on the IT System Audit page — his own
    // bio tag is "Direct & Indirect Tax", nothing to do with IT, yet the
    // site itself lists him as a specialist there) and wrongly include an
    // unrelated person whose bio happens to contain that word.
    const topGeneralUrl = topGeneralChunk && topGeneralChunk.url;
    const pageSpecialists = !isContentQuestion && topGeneralUrl ? SECTOR_SPECIALISTS_BY_URL.get(topGeneralUrl) || [] : [];
    const unnamedPageSpecialists = pageSpecialists
      .filter((p) => !namedNames.has(p.name))
      .map((p) => ({ name: p.name, url: teamUrlForName(p.name) || p.url }));

    // Fallback for pages with no "Meet Our X Specialists" section of their
    // own — anyone else whose bio genuinely mentions the same practice-area
    // word but wasn't already named. Some pages genuinely list two
    // specialists for the same service, and the model doesn't reliably name
    // both even though SYSTEM_PROMPT asks it to.
    const unnamedSectorMatches =
      unnamedPageSpecialists.length === 0 && sectorWordInQuestion && !isContentQuestion
        ? topChunks.filter((c) => c.source === "team" && bioMentions(c, sectorWordInQuestion) && !namedNames.has(c.name))
        : [];

    const unnamedMatches = [...unnamedPageSpecialists, ...unnamedSectorMatches];

    if (unnamedMatches.length) {
      const names = unnamedMatches.map((m) => `**${m.name}**`);
      const namesText = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0];
      const verb = unnamedMatches.length > 1 ? "are" : "is";
      reply += namedTeamMatches.length
        ? `\n\n${namesText} ${verb} also a specialist in this area — feel free to connect with them too.`
        : `\n\nHave more questions? You can connect directly with ${namesText}, our specialist${unnamedMatches.length > 1 ? "s" : ""} in this area.`;
    }

    const bestTeamMatches = [...namedTeamMatches, ...unnamedMatches];
    if (bestTeamMatches.length && !links.some((l) => l.url === bestTeamMatches[0].url)) {
      links.push({ url: bestTeamMatches[0].url, label: "Connect" });
    }

    // `link` (singular) kept for backward compatibility with older widget versions
    const payload = { reply, links, link: links[0] || null };
    cacheSet(cacheKey, payload);
    res.write(`data: ${JSON.stringify({ done: true, ...payload })}\n\n`);
    res.end();
  } catch (err) {
    console.error(err);
    // Streaming may have already started (headers sent) by the time an
    // error hits — can't send a fresh status code at that point, so signal
    // the failure as one more SSE frame instead of a plain JSON error body.
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: "Something went wrong." })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: "Something went wrong." });
    }
  }
});

app.get("/api/health", (req, res) => res.json({ ok: true, indexedChunks: INDEX.length }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Chatbot backend running on port ${PORT}`));
