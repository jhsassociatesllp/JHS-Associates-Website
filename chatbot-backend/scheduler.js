/**
 * scheduler.js
 * ------------
 * Keeps index.json fresh automatically, without any OS-level cron job or
 * separate hosting configuration — required by server.js, it periodically
 * re-runs crawler.js (picks up website changes) and then ingest-extra.js
 * (picks up MongoDB changes), one after another, as long as the server
 * process itself stays running. server.js already reloads its in-memory
 * index whenever index.json's contents change (see fs.watchFile in
 * server.js), so a fresh crawl here is all that's needed for new answers to
 * start showing up — no restart required.
 *
 * This is a periodic RE-CHECK, not an instant push notification: neither
 * the website nor this MongoDB deployment (a standalone server, not a
 * replica set) can notify us the moment something changes, so "how often"
 * is a real interval, not "immediately". Configure via .env:
 *
 *   AUTO_REFRESH_HOURS=24     How often to re-crawl (default 24h). Set to
 *                             0 to disable the scheduler entirely.
 *   AUTO_REFRESH_ON_START=1   Also run once immediately on server startup,
 *                             instead of only after the first interval
 *                             elapses (off by default — avoids spending
 *                             OpenAI embedding credits on every restart
 *                             during development).
 */

const { spawn } = require("child_process");
const fs = require("fs");

const LOG_FILE = "./auto-refresh.log";

function log(line) {
  const stamped = `[${new Date().toISOString()}] ${line}\n`;
  process.stdout.write(stamped);
  fs.appendFileSync(LOG_FILE, stamped);
}

// Runs one script to completion, streaming its output into the shared log
// file — same pattern as running `node crawler.js` by hand, just captured
// instead of left on the console.
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath], { cwd: __dirname });
    child.stdout.on("data", (chunk) => fs.appendFileSync(LOG_FILE, chunk));
    child.stderr.on("data", (chunk) => fs.appendFileSync(LOG_FILE, chunk));
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${scriptPath} exited with code ${code}`));
    });
    child.on("error", reject);
  });
}

let refreshInProgress = false;

async function refreshNow() {
  // crawler.js (Puppeteer, ~67 pages) can take several minutes; if a
  // previous run is still going when the next interval fires, skip this
  // tick rather than running two crawls at once against the same
  // index.json file.
  if (refreshInProgress) {
    log("Skipping scheduled refresh — previous run is still in progress.");
    return;
  }
  refreshInProgress = true;
  log("Starting scheduled refresh (website crawl + MongoDB ingest)...");
  try {
    await runScript("./crawler.js");
    await runScript("./ingest-extra.js");
    log("Scheduled refresh complete.");
  } catch (err) {
    log(`Scheduled refresh failed: ${err.message}`);
  } finally {
    refreshInProgress = false;
  }
}

function start() {
  const hours = Number(process.env.AUTO_REFRESH_HOURS ?? 24);
  if (!hours || hours <= 0) {
    log("AUTO_REFRESH_HOURS not set (or 0) — automatic refresh disabled. Re-run crawler.js/ingest-extra.js manually to update.");
    return;
  }

  const intervalMs = hours * 60 * 60 * 1000;
  log(`Automatic refresh enabled — re-crawling website + MongoDB every ${hours} hour(s).`);
  setInterval(refreshNow, intervalMs);

  if (process.env.AUTO_REFRESH_ON_START === "1") {
    refreshNow();
  }
}

module.exports = { start, refreshNow };
