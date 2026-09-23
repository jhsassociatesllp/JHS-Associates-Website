(function () {
  if (document.getElementById("jhs-chat-widget-root")) return;

  const styles = `
    #jhs-chat-widget-root { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; z-index: 999999; }
    .jhs-chat-toggle {
      position: fixed; bottom: 24px; right: 24px; width: 60px; height: 60px;
      border-radius: 30px; background: #1e3a8a; color: white; border: none;
      box-shadow: 0 4px 14px rgba(30, 58, 138, 0.4); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, background 0.2s; z-index: 999999;
    }
    .jhs-chat-toggle:hover { transform: scale(1.05); background: #1e40af; }
    .jhs-chat-box {
      position: fixed; bottom: 96px; right: 24px; width: 380px; height: 550px;
      max-width: calc(100vw - 48px); max-height: calc(100vh - 120px);
      background: #ffffff; border-radius: 16px; box-shadow: 0 12px 32px rgba(0,0,0,0.15);
      display: none; flex-direction: column; overflow: hidden; border: 1px solid #e2e8f0; z-index: 999999;
    }
    .jhs-chat-header {
      background: #1e3a8a; color: white; padding: 16px 20px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .jhs-chat-header h3 { margin: 0; font-size: 1.1rem; font-weight: 600; }
    .jhs-chat-header p { margin: 2px 0 0 0; font-size: 0.75rem; opacity: 0.8; }
    .jhs-chat-close { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
    .jhs-chat-body { flex: 1; padding: 16px; overflow-y: auto; background: #f8fafc; display: flex; flex-direction: column; gap: 12px; }
    .jhs-msg { max-width: 85%; padding: 12px 16px; border-radius: 14px; font-size: 0.9rem; line-height: 1.45; word-break: break-word; }
    .jhs-msg-user { background: #1e3a8a; color: white; align-self: flex-end; border-bottom-right-radius: 4px; }
    .jhs-msg-bot { background: white; color: #1e293b; align-self: flex-start; border-bottom-left-radius: 4px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
    .jhs-chat-footer { padding: 12px 16px; background: white; border-top: 1px solid #e2e8f0; display: flex; gap: 8px; }
    .jhs-chat-input { flex: 1; border: 1px solid #cbd5e1; border-radius: 20px; padding: 10px 16px; font-size: 0.9rem; outline: none; }
    .jhs-chat-input:focus { border-color: #1e3a8a; }
    .jhs-chat-send { background: #1e3a8a; color: white; border: none; border-radius: 20px; padding: 10px 18px; font-weight: 600; cursor: pointer; }
    .jhs-chat-send:hover { background: #1e40af; }
    .jhs-link { color: #2563eb; text-decoration: underline; font-weight: 500; }
  `;

  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  const container = document.createElement("div");
  container.id = "jhs-chat-widget-root";
  container.innerHTML = `
    <button class="jhs-chat-toggle" id="jhs-toggle-btn">💬</button>
    <div class="jhs-chat-box" id="jhs-box">
      <div class="jhs-chat-header">
        <div>
          <h3>JHS Assistant</h3>
          <p>Ask about services, offices & experts</p>
        </div>
        <button class="jhs-chat-close" id="jhs-close-btn">&times;</button>
      </div>
      <div class="jhs-chat-body" id="jhs-messages">
        <div class="jhs-msg jhs-msg-bot">Hello! I'm the JHS & Associates virtual assistant. How can I help you today?</div>
      </div>
      <form class="jhs-chat-footer" id="jhs-form">
        <input type="text" class="jhs-chat-input" id="jhs-input" placeholder="Type your question..." autocomplete="off" />
        <button type="submit" class="jhs-chat-send">Send</button>
      </form>
    </div>
  `;
  document.body.appendChild(container);

  const toggleBtn = document.getElementById("jhs-toggle-btn");
  const closeBtn = document.getElementById("jhs-close-btn");
  const chatBox = document.getElementById("jhs-box");
  const form = document.getElementById("jhs-form");
  const input = document.getElementById("jhs-input");
  const messages = document.getElementById("jhs-messages");

  toggleBtn.onclick = () => { chatBox.style.display = chatBox.style.display === "flex" ? "none" : "flex"; };
  closeBtn.onclick = () => { chatBox.style.display = "none"; };

  function appendMessage(role, text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `jhs-msg jhs-msg-${role}`;
    msgDiv.innerHTML = text.replace(/\[\[LINK:\s*([^|]+)\s*\|\s*([^\]]+)\]\]/g, '<a href="$1" target="_blank" class="jhs-link">$2</a>');
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
    return msgDiv;
  }

  form.onsubmit = async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    appendMessage("user", query);
    input.value = "";

    const botMsg = appendMessage("bot", "Thinking...");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) {
        botMsg.textContent = "Sorry, something went wrong. Please try again.";
        return;
      }

      if (res.headers.get("content-type")?.includes("text/event-stream")) {
        botMsg.textContent = "";
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.delta) {
                  fullText += data.delta;
                  botMsg.innerHTML = fullText.replace(/\[\[LINK:\s*([^|]+)\s*\|\s*([^\]]+)\]\]/g, '<a href="$1" target="_blank" class="jhs-link">$2</a>');
                }
              } catch (e) {}
            }
          }
        }
      } else {
        const data = await res.json();
        botMsg.innerHTML = (data.reply || "No answer available.").replace(/\[\[LINK:\s*([^|]+)\s*\|\s*([^\]]+)\]\]/g, '<a href="$1" target="_blank" class="jhs-link">$2</a>');
      }
    } catch (err) {
      botMsg.textContent = "Connection error. Please check your backend server.";
    }
  };
})();
