# Website Content Chatbot (Website + MongoDB)

An auto-updating chatbot that answers using your website's content AND
your MongoDB database, together. Runs on your OpenAI API key.

---

## SABSE ZAROORI: exactly kaha kya daalna hai

Sab kuch ek hi jagah daalna hai — `.env` file me. Kahi aur code me
password/URL type karne ki zaroorat nahi.

### Step 1 — `.env` file banao

```bash
cp .env.example .env
```

### Step 2 — `.env` file kholo aur yeh 5 cheezein bharo:

```
OPENAI_API_KEY=            ← apni OpenAI key yahan (platform.openai.com/api-keys)

SITE_SITEMAP_URL=          ← apni website ka sitemap yahan
                              example: https://jhsassociates.in/sitemap.xml

MONGO_URI=                 ← apna MongoDB connection string yahan
                              example: mongodb+srv://user:pass@cluster.mongodb.net
MONGO_DB_NAME=              ← apne database ka naam yahan (bina URL ke, sirf naam)
MONGO_COLLECTION=           ← jis collection me tumhare records hai, uska naam

PORT=3001                   ← isko waisa hi rehne do
ALLOWED_ORIGIN=             ← apni website ka domain yahan (security ke liye)
```

**Bas itna hi.** Iske baad kahi bhi URL ya password type karne ki zaroorat
nahi — poora system yahi `.env` file padhta hai.

**IMPORTANT:** `.env` file ko kabhi bhi GitHub par push mat karna, kabhi
chat/email me share mat karna. Yeh already `.gitignore` me hai, isliye
`git add` karne par bhi yeh upload nahi hogi — jaisa hona chahiye.

---

## Poora setup, step by step

### 1. Node.js install karo
https://nodejs.org (LTS version le lena). Check karo: `node -v`

### 2. Dependencies install karo
```bash
cd website-chatbot
npm install
```

### 3. `.env` bharo
Upar wala section dekho — 5 cheezein bharni hai.

### 4. Website ko padho (crawl)
```bash
npm run crawl
```
Yeh tumhari poori website padh lega (sitemap ke through) aur `index.json`
naam ki file bana dega — yehi chatbot ki "knowledge" hai.

### 5. MongoDB ko bhi jodo
Pehle ek baar apne MongoDB me jaake dekh lo ek record kaisa dikhta hai
(field names kya hai — jaise `name`, `bio`, `sector`, `profileUrl`).

Agar tumhare field names alag hai, toh `ingest-extra.js` file kholo aur
`buildTextFromRecord()` function me apne real field names daal do
(comments already likhe hai file me, samajhna easy hoga).

Fir chalao:
```bash
npm run crawl:extra
```
Yeh MongoDB se data uthake, website wale `index.json` me hi jod dega —
ek hi jagah, dono sources.

### 6. Server chalao
```bash
npm start
```
`http://localhost:3001` par chalega.

### 7. Test karo
`http://localhost:3001/demo.html` kholo, chat bubble pe click karo, kuch
bhi poocho jo tumhari website ya MongoDB me ho.

### 8. Real website pe lagao
Isko kahi bhi deploy karo (Render, Railway, apna server) — deploy karne
ke baad tumhe ek live URL milega, jaise `https://chatbot.tumhari-site.com`.

Apni asli website ke code me, `</body>` se pehle, yeh ek line daal do:
```html
<script src="https://chatbot.tumhari-site.com/widget.js"
        data-api="https://chatbot.tumhari-site.com/api/chat"></script>
```
Bas itna hi change website ke side pe karna hai.

### 9. Hamesha up-to-date rakhne ke liye
`npm run crawl` aur `npm run crawl:extra` ko schedule kar do (raat me
ek baar chalne ke liye) — cron job ya jo bhi hosting use kar rahe ho
uska scheduler feature. Iske baad kabhi manually kuch update nahi karna
padega.

---

## Files kya kaam karte hai

| File | Kaam |
|---|---|
| `crawler.js` | Website padhta hai (sitemap se) |
| `ingest-extra.js` | MongoDB padhta hai |
| `server.js` | Backend — questions ka jawab yahi deta hai |
| `public/widget.js` | Chat bubble jo website pe dikhega |
| `public/demo.html` | Test karne ke liye page |

## Cost kam rakhne ke liye already built-in hai

- Chota AI model (`gpt-4o-mini`) — sasta, kaafi accha
- Embeddings sirf crawl ke time banti hai, har question pe nahi
- Repeat questions cache se turant answer hoti hai (dobara AI call nahi)
- Ek visitor 1 minute me max 15 messages bhej sakta hai (abuse se bachne ke liye)

## Agar kuch galat lage

- Chatbot galat jawab de raha ho → `server.js` me `SYSTEM_PROMPT` check karo
- MongoDB se data nahi aa raha → ek baar apne DB me field names check karo,
  `ingest-extra.js` me `buildTextFromRecord()` update karo
- Naye pages/records nahi dikh rahe → `npm run crawl` / `npm run crawl:extra`
  dobara chalao (ya schedule set karo taaki automatic ho jaaye)
