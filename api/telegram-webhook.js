// Telegram-webhook для бота «Сводка по отраслям».
// Мгновенно реагирует на /start: приветствие + свежий дайджест из кэша,
// регистрирует подписчика в DariaClaude/digest-bot/subscribers.json.
//
// Переменные окружения (Vercel -> Settings -> Environment Variables):
//   TG_BOT_TOKEN  - токен бота
//   GH_TOKEN      - fine-grained GitHub token c доступом Contents RW только к репозиторию digest-bot
//   WEBHOOK_SECRET - произвольная строка, та же что при setWebhook (защита от чужих запросов)

const BOT = () => `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}`;
const REPO = "DariaClaude/digest-bot";

const WELCOME =
  "👋 Здравствуйте! Это бот «Сводка по отраслям».\n\n" +
  "Каждое утро около 8:00 по Москве я присылаю дайджест новостей о крупных " +
  "и мегапроектах по секторам: автодорожная стройка, нефтегазодобыча, " +
  "агросектор, ж/д стройка и крупное строительство.\n\n" +
  "Маркеры: 👤 кадровые перестановки · 📋 планы проектов · ⚠️ проблемы проектов\n\n" +
  "Вы подписаны. Вот свежий выпуск:";

async function gh(path, options = {}) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.GH_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "digest-webhook",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub ${path}: ${res.status}`);
  return res.json();
}

async function sendMessage(chatId, text) {
  await fetch(`${BOT()}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
}

function decode(b64) {
  return Buffer.from(b64, "base64").toString("utf-8");
}

function encode(str) {
  return Buffer.from(str, "utf-8").toString("base64");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(200).send("ok");

  // Проверка, что запрос действительно от Telegram
  const secret = process.env.WEBHOOK_SECRET;
  if (secret && req.headers["x-telegram-bot-api-secret-token"] !== secret) {
    return res.status(403).send("forbidden");
  }

  try {
    const update = req.body || {};
    const msg = update.message;
    const chat = msg && msg.chat;
    if (!chat || chat.type !== "private") return res.status(200).send("ok");

    const chatId = chat.id;
    const text = (msg.text || "").trim();

    // Список подписчиков
    const subsFile = await gh("/contents/subscribers.json");
    const subs = JSON.parse(decode(subsFile.content));
    const isNew = !subs.subscribers.includes(chatId);

    if (isNew || text === "/start") {
      // Свежий дайджест из кэша
      let digestMessages = [];
      try {
        const cacheFile = await gh("/contents/digest_latest.json");
        digestMessages = JSON.parse(decode(cacheFile.content)).messages || [];
      } catch (e) {
        digestMessages = [];
      }

      await sendMessage(chatId, WELCOME);
      for (const m of digestMessages) await sendMessage(chatId, m);
      if (!digestMessages.length) {
        await sendMessage(
          chatId,
          "Свежий выпуск ещё готовится, он придёт вам с ближайшей утренней рассылкой."
        );
      }
    }

    if (isNew) {
      subs.subscribers.push(chatId);
      subs.subscribers.sort((a, b) => a - b);
      await gh("/contents/subscribers.json", {
        method: "PUT",
        body: JSON.stringify({
          message: `Новый подписчик: ${chatId}`,
          content: encode(JSON.stringify(subs, null, 2)),
          sha: subsFile.sha,
        }),
      });
    }
  } catch (e) {
    console.error("webhook error:", e.message);
  }
  // Telegram всегда должен получить 200, иначе будет повторять запрос
  return res.status(200).send("ok");
}
