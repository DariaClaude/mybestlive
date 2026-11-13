// Приём заявок с лендингов вакансий РМ Групп → Google Sheets (через сервисный аккаунт).
// ENV: GOOGLE_SA_KEY (JSON ключа сервисного аккаунта), SHEET_ID, ALLOWED_ORIGINS (через запятую)
const crypto = require("crypto");

const ORIGINS = (process.env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
let tokenCache = { value: null, exp: 0 };

function b64url(buf) { return Buffer.from(buf).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_"); }

async function accessToken() {
  if (tokenCache.value && Date.now() < tokenCache.exp - 60000) return tokenCache.value;
  const key = JSON.parse(process.env.GOOGLE_SA_KEY);
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(JSON.stringify({ iss: key.client_email, scope: "https://www.googleapis.com/auth/spreadsheets", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }));
  const sig = crypto.createSign("RSA-SHA256").update(`${header}.${claims}`).sign(key.private_key);
  const jwt = `${header}.${claims}.${b64url(sig)}`;
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}` });
  const j = await r.json();
  if (!j.access_token) throw new Error("token: " + JSON.stringify(j));
  tokenCache = { value: j.access_token, exp: Date.now() + j.expires_in * 1000 };
  return j.access_token;
}

function normPhone(s) {
  let d = String(s || "").replace(/\D/g, "");
  if (d.length === 10) d = "7" + d;
  if (d.length === 11 && d[0] === "8") d = "7" + d.slice(1);
  return d;
}
function fmtPhone(d) { return `${d[0]} ${d.substr(1, 3)} ${d.substr(4, 3)}-${d.substr(7, 2)}-${d.substr(9, 2)}`; }
function clean(s, n) { return String(s || "").replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim().slice(0, n); }
function mskNow() {
  const d = new Date(Date.now() + 3 * 3600 * 1000);
  const p = n => String(n).padStart(2, "0");
  return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)}.${d.getUTCFullYear()} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`;
}

module.exports = async (req, res) => {
  const origin = req.headers.origin || "";
  if (ORIGINS.length === 0 || ORIGINS.includes(origin)) res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method === "GET") return res.status(200).json({ ok: true, service: "rabota-leads" });
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  let p = req.body || {};
  if (typeof p === "string") p = Object.fromEntries(new URLSearchParams(p));
  if (p.website) return res.status(200).json({ ok: true });                 // honeypot
  const phone = normPhone(p.phone);
  if (phone.length !== 11) return res.status(400).json({ ok: false, error: "bad_phone" });

  const row = [
    mskNow(),
    clean(p.region, 40) || "—",
    clean(p.name, 80) || "—",
    fmtPhone(phone),
    clean(p.vacancy, 120) || "—",
    clean(p.page, 200),
    "Сайт",
    clean(p.utm, 300),
    "", ""                                                                   // ОС менеджера, ФИО менеджера
  ];
  try {
    const t = await accessToken();
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SHEET_ID}/values/${encodeURIComponent("Отклики!A:J")}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
    const r = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }, body: JSON.stringify({ values: [row] }) });
    if (!r.ok) throw new Error("sheets " + r.status + " " + (await r.text()).slice(0, 200));
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: String(e.message || e).slice(0, 200) });
  }
};
