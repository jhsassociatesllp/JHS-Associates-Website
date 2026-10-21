/**
 * build-contacts.js
 * -----------------
 * Pulls each person's email + LinkedIn out of the website's city-page source
 * (frontend/src/components/Cities/*.tsx and About Us/Partners.tsx) into
 * data/contacts.json, which server.js uses to put a real email next to every
 * person the chatbot mentions — no guessing/inventing addresses.
 *
 * Run from chatbot-backend/:  node scripts/build-contacts.js
 * Re-run it whenever a city page's partner list changes. Hand edits go in
 * data/contacts.overrides.json (never overwritten by this script).
 */
const fs = require("fs");
const path = require("path");

const FRONTEND = path.join(__dirname, "..", "..", "frontend", "src", "components");
const files = fs
  .readdirSync(path.join(FRONTEND, "Cities"))
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => path.join(FRONTEND, "Cities", f));
files.push(path.join(FRONTEND, "About Us", "Partners.tsx"));

const contacts = {};
for (const file of files) {
  const src = fs.readFileSync(file, "utf-8");
  // Objects can be one line or span several — split the file at every `name:`
  // and read email/linkedin from the text up to the next `name:`. Commented-out
  // (// ...) lines are dropped first so retired people don't come back.
  const code = src
    .split("\n")
    .filter((l) => !/^\s*\/\//.test(l))
    .join("\n");
  const parts = code.split(/\bname:\s*/).slice(1);
  for (const part of parts) {
    const name = (part.match(/^['"]([^'"]+)['"]/) || [])[1];
    if (!name) continue;
    const email = (part.match(/\bemail:\s*['"]([^'"]+)['"]/) || [])[1];
    const linkedin = (part.match(/\blinkedin:\s*['"]([^'"]+)['"]/) || [])[1];
    if (!(email || linkedin)) continue;
    const key = name.trim();
    contacts[key] = {
      ...contacts[key],
      ...(email && { email: email.trim() }),
      ...(linkedin && { linkedin: linkedin.trim() }),
    };
  }
}

const out = path.join(__dirname, "..", "data", "contacts.json");
fs.writeFileSync(out, JSON.stringify(contacts, null, 2));
console.log(`Wrote ${Object.keys(contacts).length} people to ${out}`);
