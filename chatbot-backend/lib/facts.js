// Verified company facts answered instantly, before the AI/search path.
// Edit data/company-facts.json to add or change answers.
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "data", "company-facts.json");

function load() {
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, "utf8"));
    return (raw.facts || [])
      .filter((f) => f && f.id && !String(f.id).startsWith("_") && f.answer && Array.isArray(f.patterns))
      .map((f) => ({
        id: f.id,
        answer: f.answer,
        res: f.patterns.map((p) => new RegExp(p, "i")),
      }));
  } catch (err) {
    console.warn("company-facts.json not loaded:", err.message);
    return [];
  }
}

let FACTS = load();

function reloadFacts() {
  FACTS = load();
  return FACTS.length;
}

// Returns the verified answer string for a question, or null.
function matchFact(question) {
  for (const f of FACTS) {
    if (f.res.some((re) => re.test(question))) return f.answer;
  }
  return null;
}

module.exports = { matchFact, reloadFacts };
