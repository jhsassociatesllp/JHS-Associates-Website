(function () {
  if (document.getElementById("jhs-chat-widget-root")) return;

  const STORAGE_KEY = "jhs-chat-history-v1";
  const MAX_STORED = 40;
  const SUGGESTIONS = [
    "What services do you offer?",
    "Where are your offices?",
    "Who are the partners?",
    "How can I contact you?",
  ];
  const WELCOME = "Hello! I'm the JHS & Associates virtual assistant. Ask me about our services, offices, experts or latest updates.";

  const styles = `
    #jhs-chat-widget-root { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; z-index: 999999; }
    #jhs-chat-widget-root * { box-sizing: border-box; }
    .jhs-chat-toggle {
      position: fixed; bottom: 24px; right: 24px; width: 60px; height: 60px;
      border-radius: 30px; background: #1e3a8a; color: white; border: none;
      box-shadow: 0 4px 14px rgba(30, 58, 138, 0.4); cursor: pointer; font-size: 26px;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, background 0.2s; z-index: 999999;
    }
    .jhs-chat-toggle:hover { transform: scale(1.05); background: #1e40af; }
    .jhs-chat-box {
      position: fixed; bottom: 96px; right: 24px; width: 400px; height: 600px;
      max-width: calc(100vw - 32px); max-height: calc(100vh - 120px);
      background: #ffffff; border-radius: 16px; box-shadow: 0 12px 32px rgba(0,0,0,0.15);
      display: none; flex-direction: column; overflow: hidden; border: 1px solid #e2e8f0; z-index: 999999;
    }
    .jhs-chat-header {
      background: #1e3a8a; color: #ffffff; padding: 14px 16px 14px 20px;
      display: flex; justify-content: space-between; align-items: center; gap: 8px;
    }
    .jhs-chat-header h3 { margin: 0; font-size: 1.05rem; font-weight: 600; color: #ffffff; }
    .jhs-chat-header p { margin: 2px 0 0 0; font-size: 0.75rem; color: #dbe4ff; }
    .jhs-header-actions { display: flex; align-items: center; gap: 2px; }
    .jhs-icon-btn {
      background: none; border: none; color: #ffffff; cursor: pointer; opacity: 0.85;
      font-size: 1.3rem; line-height: 1; padding: 6px 8px; border-radius: 8px;
    }
    .jhs-icon-btn:hover { opacity: 1; background: rgba(255,255,255,0.15); }
    .jhs-icon-btn:focus-visible, .jhs-chip:focus-visible, .jhs-chat-send:focus-visible { outline: 2px solid #93c5fd; outline-offset: 2px; }
    .jhs-chat-body { flex: 1; padding: 16px; overflow-y: auto; background: #f8fafc; display: flex; flex-direction: column; gap: 12px; scroll-behavior: smooth; }
    .jhs-msg { max-width: 88%; padding: 11px 15px; border-radius: 14px; font-size: 0.9rem; line-height: 1.5; word-break: break-word; }
    .jhs-msg-user { background: #1e3a8a; color: white; align-self: flex-end; border-bottom-right-radius: 4px; }
    .jhs-msg-bot { background: white; color: #1e293b; align-self: flex-start; border-bottom-left-radius: 4px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
    .jhs-msg-error { border-color: #fecaca; background: #fef2f2; color: #991b1b; }
    .jhs-msg strong { font-weight: 650; }
    .jhs-h { font-weight: 650; color: #1e3a8a; margin: 6px 0 2px; }
    .jhs-li { display: flex; gap: 8px; margin: 2px 0; }
    .jhs-li > span { flex: none; min-width: 1.1em; color: #64748b; }
    .jhs-gap { height: 6px; }
    .jhs-person { margin-top: 10px; padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
    .jhs-person-name { font-weight: 700; color: #1e3a8a; font-size: 0.98rem; }
    .jhs-person-meta { font-size: 0.8rem; font-weight: 600; margin-top: 1px; }
    .jhs-person-creds { font-size: 0.76rem; color: #64748b; }
    .jhs-person-desc { font-size: 0.83rem; margin-top: 4px; line-height: 1.4; }
    .jhs-person-email { font-size: 0.83rem; margin-top: 6px; word-break: break-all; }
    .jhs-person-general { font-size: 0.72rem; color: #64748b; word-break: normal; }
    .jhs-btn-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .jhs-btn { background: #1e3a8a; color: #fff !important; text-decoration: none; font-size: 0.78rem; font-weight: 600; padding: 6px 12px; border-radius: 14px; }
    .jhs-btn:hover { background: #1e40af; }
    .jhs-item { margin-top: 8px; }
    .jhs-item-link { margin-left: 6px; font-size: 0.8rem; white-space: nowrap; }
    .jhs-link { color: #2563eb; text-decoration: underline; font-weight: 500; }
    .jhs-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .jhs-chip {
      background: #eff6ff; color: #1e3a8a; border: 1px solid #bfdbfe; border-radius: 16px;
      padding: 6px 12px; font-size: 0.8rem; cursor: pointer; font-family: inherit;
    }
    .jhs-chip:hover { background: #dbeafe; }
    .jhs-retry { margin-top: 8px; }
    .jhs-typing { display: inline-flex; gap: 4px; align-items: center; height: 18px; }
    .jhs-typing span { width: 7px; height: 7px; border-radius: 50%; background: #94a3b8; animation: jhs-bounce 1.2s infinite ease-in-out; }
    .jhs-typing span:nth-child(2) { animation-delay: 0.15s; }
    .jhs-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes jhs-bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-5px); opacity: 1; } }
    .jhs-chat-footer { padding: 12px 16px; background: white; border-top: 1px solid #e2e8f0; display: flex; gap: 8px; }
    .jhs-chat-input { flex: 1; min-width: 0; border: 1px solid #cbd5e1; border-radius: 20px; padding: 10px 16px; font-size: 0.9rem; outline: none; font-family: inherit; }
    .jhs-chat-input:focus { border-color: #1e3a8a; box-shadow: 0 0 0 3px rgba(30,58,138,0.12); }
    .jhs-chat-send { background: #1e3a8a; color: white; border: none; border-radius: 20px; padding: 10px 18px; font-weight: 600; cursor: pointer; font-family: inherit; }
    .jhs-chat-send:hover:not(:disabled) { background: #1e40af; }
    .jhs-chat-send:disabled { opacity: 0.55; cursor: not-allowed; }
    @media (max-width: 480px) {
      .jhs-chat-box { right: 8px; left: 8px; bottom: 88px; width: auto; max-width: none; height: calc(100vh - 110px); }
      .jhs-chat-toggle { right: 16px; bottom: 16px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .jhs-chat-body { scroll-behavior: auto; }
      .jhs-typing span { animation: none; }
    }
  `;

  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  const container = document.createElement("div");
  container.id = "jhs-chat-widget-root";
  container.innerHTML = `
    <button class="jhs-chat-toggle" id="jhs-toggle-btn" aria-label="Open chat" aria-expanded="false">💬</button>
    <div class="jhs-chat-box" id="jhs-box" role="dialog" aria-label="JHS Assistant chat">
      <div class="jhs-chat-header">
        <div>
          <h3>JHS Assistant</h3>
          <p>Ask about services, offices &amp; experts</p>
        </div>
        <div class="jhs-header-actions">
          <button class="jhs-icon-btn" id="jhs-new-btn" aria-label="Start a new chat" title="New chat">&#8635;</button>
          <button class="jhs-icon-btn" id="jhs-close-btn" aria-label="Close chat" title="Close">&times;</button>
        </div>
      </div>
      <div class="jhs-chat-body" id="jhs-messages" aria-live="polite"></div>
      <form class="jhs-chat-footer" id="jhs-form">
        <input type="text" class="jhs-chat-input" id="jhs-input" placeholder="Type your question..." autocomplete="off" maxlength="500" aria-label="Your question" />
        <button type="submit" class="jhs-chat-send" id="jhs-send">Send</button>
      </form>
    </div>
  `;
  document.body.appendChild(container);

  const toggleBtn = document.getElementById("jhs-toggle-btn");
  const closeBtn = document.getElementById("jhs-close-btn");
  const newBtn = document.getElementById("jhs-new-btn");
  const chatBox = document.getElementById("jhs-box");
  const form = document.getElementById("jhs-form");
  const input = document.getElementById("jhs-input");
  const sendBtn = document.getElementById("jhs-send");
  const messages = document.getElementById("jhs-messages");

  let busy = false;
  let history = []; // [{ role: "user" | "bot", data }] — bot data is the API payload

  // ---- formatting ------------------------------------------------------

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function safeUrl(url) {
    return /^https?:\/\//i.test(url) ? url.replace(/"/g, "%22") : "#";
  }
  // The small bit of markup the backend sends: **bold**, [[LINK: url | label]],
  // newlines. An unfinished [[LINK: ... marker (mid-stream) is hidden rather than
  // flashed on screen.
  function inlineFormat(escaped) {
    return escaped
      .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[\[LINK:\s*([^|\]]+?)\s*\|\s*([^\]]+?)\s*\]\]/g, (m, u, l) =>
        `<a href="${safeUrl(u.trim())}" target="_blank" rel="noopener" class="jhs-link">${l}</a>`);
  }
  // Also handles the markdown the model tends to produce: # headings and -/*/1. lists.
  function formatText(text) {
    const lines = escapeHtml(text.replace(/\[\[LINK:(?![^\]]*\]\])[\s\S]*$/, "")).split("\n");
    let out = "";
    lines.forEach((line, i) => {
      let m;
      if ((m = line.match(/^\s*#{1,4}\s+(.*)$/))) out += `<div class="jhs-h">${inlineFormat(m[1])}</div>`;
      else if ((m = line.match(/^\s*[-*•]\s+(.*)$/))) out += `<div class="jhs-li"><span>•</span><div>${inlineFormat(m[1])}</div></div>`;
      else if ((m = line.match(/^\s*(\d+)[.)]\s+(.*)$/))) out += `<div class="jhs-li"><span>${m[1]}.</span><div>${inlineFormat(m[2])}</div></div>`;
      else if (!line.trim()) out += i > 0 && i < lines.length - 1 ? '<div class="jhs-gap"></div>' : "";
      else out += `<div>${inlineFormat(line)}</div>`;
    });
    return out;
  }

  // One team member: name, role · location, credentials, expertise, email and
  // the View Profile / Connect buttons (all built by the backend, lib/people.js).
  function personHtml(p) {
    const meta = [p.role, p.location].filter(Boolean).map(escapeHtml).join(" · ");
    const buttons = (p.actions || [])
      .map((a) => `<a href="${a.url.startsWith("mailto:") ? escapeHtml(a.url) : safeUrl(a.url)}" target="_blank" rel="noopener" class="jhs-btn">${escapeHtml(a.label)}</a>`)
      .join("");
    return (
      `<div class="jhs-person">` +
      `<div class="jhs-person-name">${escapeHtml(p.name)}</div>` +
      (meta ? `<div class="jhs-person-meta">${meta}</div>` : "") +
      (p.creds ? `<div class="jhs-person-creds">${escapeHtml(p.creds)}</div>` : "") +
      (p.expertise ? `<div class="jhs-person-desc">${escapeHtml(p.expertise)}</div>` : "") +
      (p.specialisations ? `<div class="jhs-person-desc"><strong>Specialisations:</strong> ${escapeHtml(p.specialisations)}</div>` : "") +
      `<div class="jhs-person-email">✉ <a class="jhs-link" href="mailto:${escapeHtml(p.email)}">${escapeHtml(p.email)}</a>` +
      (p.emailIsGeneral ? ` <span class="jhs-person-general">(firm's general email)</span>` : "") +
      `</div>` +
      (buttons ? `<div class="jhs-btn-row">${buttons}</div>` : "") +
      `</div>`
    );
  }

  function answerHtml(data) {
    let html = formatText(data.reply || "No answer available.");
    const items = data.items || [];
    for (const item of items) {
      if (item.person) {
        html += personHtml(item.person);
        continue;
      }
      html += `<div class="jhs-item">${formatText(item.text || "")}`;
      if (item.links && item.links.length) {
        html += `<div class="jhs-btn-row">${item.links.map((l) => `<a href="${safeUrl(l.url)}" target="_blank" rel="noopener" class="jhs-btn">${escapeHtml(l.label || "Link")}</a>`).join("")}</div>`;
      } else if (item.link && item.link.url) {
        html += ` <a href="${safeUrl(item.link.url)}" target="_blank" rel="noopener" class="jhs-link jhs-item-link">${escapeHtml(item.link.label || "Link")}</a>`;
      }
      html += "</div>";
    }
    // Contact cards for team members named in an AI-written answer.
    for (const person of data.people || []) html += personHtml(person);
    // Links from a streamed answer that are not already inline in its text.
    if (!items.length) {
      const shown = data.reply || "";
      for (const l of data.links || []) {
        if (l && l.url && !shown.includes(l.url)) {
          html += `<div class="jhs-item"><a href="${safeUrl(l.url)}" target="_blank" rel="noopener" class="jhs-link">${escapeHtml(l.label || l.url)}</a></div>`;
        }
      }
    }
    return html;
  }

  // ---- rendering -------------------------------------------------------

  function scrollToEnd() {
    messages.scrollTop = messages.scrollHeight;
  }

  function addMessage(role, html, extraClass) {
    const div = document.createElement("div");
    div.className = `jhs-msg jhs-msg-${role}${extraClass ? " " + extraClass : ""}`;
    div.innerHTML = html;
    messages.appendChild(div);
    scrollToEnd();
    return div;
  }

  function addChips(parent, labels) {
    const wrap = document.createElement("div");
    wrap.className = "jhs-chips";
    labels.forEach((label) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "jhs-chip";
      b.textContent = label;
      b.onclick = () => ask(label);
      wrap.appendChild(b);
    });
    parent.appendChild(wrap);
  }

  // When the bot asks "Which did you mean — the **A** team, or **B**?", turn
  // the bolded options in that question into one-click answers.
  function followUpChips(data) {
    const all = [...(data.items || []).map((i) => i.text || ""), data.reply || ""];
    const question = all.reverse().find((t) => /which (did you|one|do you)/i.test(t) && t.includes("**"));
    if (!question) return [];
    return [...question.matchAll(/\*\*([^*]+)\*\*/g)].map((m) => m[1].trim()).filter(Boolean).slice(0, 4);
  }

  function renderBot(data, isLast) {
    const div = addMessage("bot", answerHtml(data));
    if (isLast) {
      const chips = followUpChips(data);
      if (chips.length) addChips(div, chips);
    }
    return div;
  }

  function renderWelcome() {
    const div = addMessage("bot", escapeHtml(WELCOME));
    addChips(div, SUGGESTIONS);
  }

  function renderAll() {
    messages.innerHTML = "";
    renderWelcomeOrHistory();
  }

  function renderWelcomeOrHistory() {
    if (!history.length) {
      renderWelcome();
      return;
    }
    addMessage("bot", escapeHtml(WELCOME));
    history.forEach((m, i) => {
      if (m.role === "user") addMessage("user", escapeHtml(m.text));
      else renderBot(m.data, i === history.length - 1);
    });
  }

  // ---- persistence -----------------------------------------------------

  function saveHistory() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_STORED)));
    } catch (e) {}
  }
  function loadHistory() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) history = parsed;
    } catch (e) {
      history = [];
    }
  }

  // ---- talking to the backend ------------------------------------------

  function setBusy(state) {
    busy = state;
    sendBtn.disabled = state;
    input.disabled = state;
    if (!state) input.focus();
  }

  async function readStream(res, botMsg) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";
    let final = null;
    let failed = false;

    const handle = (line) => {
      if (!line.startsWith("data: ")) return;
      let data;
      try { data = JSON.parse(line.slice(6)); } catch (e) { return; }
      if (data.error) failed = true;
      else if (data.done) final = data;
      else if (data.delta) {
        fullText += data.delta;
        botMsg.innerHTML = formatText(fullText);
        scrollToEnd();
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? ""; // keep a possibly half-received line for the next chunk
      lines.forEach(handle);
    }
    if (buffer) handle(buffer);

    if (failed && !fullText) throw new Error("stream error");
    return final || { reply: fullText, links: [] };
  }

  // The last few messages before the one being sent, as plain text — lets the
  // server understand follow-ups ("please mention few names", "her email").
  function botText(d) {
    let t = d.reply || "";
    for (const i of d.items || []) {
      t += " " + (i.person ? `${i.person.name} (${[i.person.role, i.person.location].filter(Boolean).join(", ")})` : i.text || "");
    }
    for (const p of d.people || []) t += " " + p.name;
    return t.trim().slice(0, 500);
  }
  function historyForServer() {
    return history
      .slice(0, -1) // the question being asked is already in `history`
      .slice(-8)
      .map((m) => ({ role: m.role, text: m.role === "user" ? m.text : botText(m.data || {}) }))
      .filter((m) => m.text);
  }

  async function ask(query) {
    query = (query || "").trim();
    if (!query || busy) return;

    // The suggestion chips on older messages are no longer relevant.
    messages.querySelectorAll(".jhs-chips").forEach((c) => c.remove());

    addMessage("user", escapeHtml(query));
    history.push({ role: "user", text: query });
    input.value = "";
    setBusy(true);

    const botMsg = addMessage("bot", '<span class="jhs-typing" aria-label="Assistant is typing"><span></span><span></span><span></span></span>');

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, history: historyForServer() }),
      });

      if (res.status === 429) throw new Error("rate");
      if (!res.ok) throw new Error("http " + res.status);

      let data;
      if ((res.headers.get("content-type") || "").includes("text/event-stream")) {
        data = await readStream(res, botMsg);
      } else {
        data = await res.json();
      }

      botMsg.remove();
      renderBot(data, true);
      history.push({ role: "bot", data });
      saveHistory();
    } catch (err) {
      history.pop(); // drop the unanswered question so a retry doesn't duplicate it
      botMsg.classList.add("jhs-msg-error");
      botMsg.textContent =
        err.message === "rate"
          ? "You're sending messages too quickly. Please wait a moment and try again."
          : err instanceof TypeError
            ? "Can't reach the assistant right now. Please check your connection and try again."
            : "Sorry, something went wrong. Please try again.";
      const retry = document.createElement("button");
      retry.type = "button";
      retry.className = "jhs-chip jhs-retry";
      retry.textContent = "Try again";
      retry.onclick = () => { botMsg.remove(); ask(query); };
      botMsg.appendChild(document.createElement("br"));
      botMsg.appendChild(retry);
    } finally {
      setBusy(false);
      scrollToEnd();
    }
  }

  // ---- wiring ----------------------------------------------------------

  function openChat() {
    chatBox.style.display = "flex";
    toggleBtn.setAttribute("aria-expanded", "true");
    scrollToEnd();
    input.focus();
  }
  function closeChat() {
    chatBox.style.display = "none";
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.focus();
  }

  toggleBtn.onclick = () => (chatBox.style.display === "flex" ? closeChat() : openChat());
  closeBtn.onclick = closeChat;
  newBtn.onclick = () => {
    if (busy) return;
    history = [];
    saveHistory();
    renderAll();
    input.focus();
  };
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && chatBox.style.display === "flex") closeChat();
  });
  form.onsubmit = (e) => {
    e.preventDefault();
    ask(input.value);
  };

  loadHistory();
  renderAll();
})();
