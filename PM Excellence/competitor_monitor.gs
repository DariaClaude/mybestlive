// ================================================================
// КОНКУРЕНТ-МОНИТОР — Ежедневный дайджест в Telegram
// Платформа: Google Apps Script | Запуск: 09:00 МСК ежедневно
// Мониторит: BaseLine, Айбим, IBCON, Проектная практика, PM Soft
// v2.0 — прямой парсинг Telegram, без rsshub.app
// ================================================================

const MON = {
  TG_TOKEN:      '8643049824:AAFLJ8FNCikRATkSgUS1YafZX86Iaph8KHY',
  TG_CHAT:       '514283583',
  FETCH_TIMEOUT: 8,
  FIRST_RUN_FROM: new Date('2026-05-01T00:00:00+03:00'),

  COMPETITORS: [
    {
      name:     'BaseLine',
      icon:     '🔵',
      rss:      'https://base-line.ru/feed/',
      telegram: 'baseline_ru'
    },
    {
      name:     'Айбим',
      icon:     '🟢',
      site:     'https://bim-info.ru',
      newsPath: '/novosti/',
      youtube:  'https://www.youtube.com/feeds/videos.xml?channel_id=UCaCYh-fGm95FPgTzQC_3C_w',
      telegram: null
    },
    {
      name:     'IBCON',
      icon:     '🟠',
      rss:      'https://ibcon.ru/feed/',
      telegram: 'ibcon_ru'
    },
    {
      name:     'Пр.практика',
      icon:     '🟣',
      rss:      'https://pmpractice.ru/feed/',
      telegram: 'pmpractice'
    },
    {
      name:     'PM Soft',
      icon:     '🔴',
      rss:      'https://pmsoft.ru/feed/',
      telegram: 'pmsoftpro'
    }
  ]
};

// ================================================================
// ОСНОВНАЯ ФУНКЦИЯ — запускается триггером в 09:00 МСК
// ================================================================

function runDailyMonitor() {
  const props   = PropertiesService.getScriptProperties();
  const seenRaw = props.getProperty('SEEN_IDS');
  const seen    = seenRaw ? new Set(JSON.parse(seenRaw)) : new Set();

  const isFirstRun = !props.getProperty('FIRST_RUN_DONE');
  const cutoff = isFirstRun
    ? MON.FIRST_RUN_FROM
    : new Date(Date.now() - 25 * 3600 * 1000);

  const periodLabel = isFirstRun
    ? '1–7 мая 2026'
    : Utilities.formatDate(new Date(Date.now() - 24 * 3600 * 1000), 'Europe/Moscow', 'dd.MM.yyyy');

  const isoDate = Utilities.formatDate(
    new Date(Date.now() - 24 * 3600 * 1000), 'Europe/Moscow', 'yyyy-MM-dd'
  );

  const results = {};
  MON.COMPETITORS.forEach(c => { results[c.name] = { icon: c.icon, items: [] }; });

  MON.COMPETITORS.forEach(comp => {
    // RSS сайта
    if (comp.rss) {
      fetchRss(comp.rss, cutoff, seen).forEach(it => {
        results[comp.name].items.push({ label: 'Сайт', ...it });
        seen.add(it.id);
      });
      Utilities.sleep(300);
    }

    // HTML-парсинг сайта (для тех, у кого нет RSS)
    if (comp.site) {
      const isoYesterday = Utilities.formatDate(
        new Date(Date.now() - 24 * 3600 * 1000), 'Europe/Moscow', 'yyyy-MM-dd'
      );
      checkSiteHTML(comp.site, comp.newsPath, isoYesterday).forEach(it => {
        const id = 'html_' + it.url;
        if (seen.has(id)) return;
        results[comp.name].items.push({ label: 'Сайт', id: id, title: it.text, link: it.url });
        seen.add(id);
      });
      Utilities.sleep(300);
    }

    // YouTube (только с реальным channel_id)
    if (comp.youtube) {
      fetchRss(comp.youtube, cutoff, seen).forEach(it => {
        results[comp.name].items.push({ label: 'YouTube', ...it });
        seen.add(it.id);
      });
      Utilities.sleep(300);
    }

    // Telegram — прямой парсинг (без rsshub.app)
    if (comp.telegram) {
      checkTelegram(comp.telegram, isoDate).forEach(it => {
        const id = 'tg_' + it.url;
        if (seen.has(id)) return;
        results[comp.name].items.push({ label: 'Telegram', id: id, title: it.text, link: it.url });
        seen.add(id);
      });
      Utilities.sleep(300);
    }
  });

  // Формируем сообщение
  const lines = [];
  let totalNew = 0;

  MON.COMPETITORS.forEach(comp => {
    const data = results[comp.name];
    if (data.items.length === 0) {
      lines.push('\n' + data.icon + ' *' + comp.name + '*: нет активности');
    } else {
      totalNew += data.items.length;
      lines.push('\n' + data.icon + ' *' + comp.name + '* — ' + data.items.length + ' новых:');
      data.items.slice(0, 5).forEach(it => {
        const title = it.title.length > 80 ? it.title.slice(0, 80) + '…' : it.title;
        lines.push('   • [' + it.label + '] [' + title + '](' + it.link + ')');
      });
      if (data.items.length > 5) lines.push('   _...ещё ' + (data.items.length - 5) + '_');
    }
  });

  const now    = Utilities.formatDate(new Date(), 'Europe/Moscow', 'dd.MM.yyyy HH:mm');
  const header = '📡 *Дайджест конкурентов PM Excellence* | ' + periodLabel + '\n'
               + '_Сформирован: ' + now + ' МСК | Новых: ' + totalNew + '_';

  sendTelegram(header + lines.join('\n'));

  props.setProperty('SEEN_IDS', JSON.stringify([...seen].slice(-5000)));
  props.setProperty('FIRST_RUN_DONE', 'true');
  Logger.log('✅ Готово. Новых: ' + totalNew);
}

// ================================================================
// ПРЯМОЙ ПАРСИНГ TELEGRAM (как в RM Group monitor)
// ================================================================

function checkTelegram(channelName, isoDate) {
  try {
    const resp = UrlFetchApp.fetch('https://t.me/s/' + channelName, {
      muteHttpExceptions: true,
      deadline: 6,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' }
    });
    if (resp.getResponseCode() !== 200) return [];

    const html   = resp.getContentText();
    const blocks = html.split('<div class="tgme_widget_message_wrap');
    const items  = [];

    for (let i = 1; i < blocks.length; i++) {
      const block = blocks[i];
      if (block.indexOf('datetime="' + isoDate) === -1) continue;

      const postIdMatch = block.match(/data-post="([^"]+)"/);
      const postUrl = postIdMatch
        ? 'https://t.me/' + postIdMatch[1]
        : 'https://t.me/' + channelName;

      const textMatch = block.match(/class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/);
      if (!textMatch) continue;

      let text = cleanHtml(textMatch[1]);
      text = text.replace(/https?:\/\/\S+/gi, '').replace(/\s+/g, ' ').trim();
      if (text.length < 15) continue;

      items.push({ text: text.substring(0, 400), url: postUrl });
    }
    return items;
  } catch (e) {
    Logger.log('TG error [' + channelName + ']: ' + e.toString());
    return [];
  }
}

function cleanHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '').replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ').trim();
}

// ================================================================
// HTML-ПАРСИНГ САЙТА (для сайтов без RSS)
// ================================================================

function checkSiteHTML(baseUrl, newsPath, isoDate) {
  try {
    const resp = UrlFetchApp.fetch(baseUrl + (newsPath || '/'), {
      muteHttpExceptions: true,
      followRedirects: true,
      deadline: 6,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' }
    });
    if (resp.getResponseCode() !== 200) return [];

    let html = resp.getContentText();
    html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<style[\s\S]*?<\/style>/gi, '');

    const results = [];

    // Метод 1: <time datetime="YYYY-MM-DD">
    const timeRe = new RegExp('<time[^>]+datetime="' + isoDate + '[^"]*"', 'gi');
    let m;
    while ((m = timeRe.exec(html)) !== null) {
      const before   = html.substring(Math.max(0, m.index - 2000), m.index);
      const hMatch   = before.match(/<(?:h[1-4]|a)[^>]*>([\s\S]*?)<\/(?:h[1-4]|a)>(?:(?!<(?:h[1-4]|a)).)*$/i);
      const lnkMatch = before.match(/href="([^"]+)"[^>]*>[^<]*$/i);
      if (hMatch) {
        const text = cleanHtml(hMatch[0]);
        if (text.length > 15) {
          const postUrl = lnkMatch && lnkMatch[1].indexOf('http') === 0 ? lnkMatch[1] : baseUrl;
          results.push({ text: text.substring(0, 300), url: postUrl });
        }
      }
    }

    // Метод 2: ссылки с датой в URL (/2026/05/ или /2026-05-)
    if (results.length === 0) {
      const yearSlash = isoDate.substring(0, 4) + '\\/' + isoDate.substring(5, 7);
      const yearDash  = isoDate.substring(0, 7);
      const linkRe    = new RegExp(
        '<a\\s+[^>]*href="([^"]*(?:' + yearSlash + '|' + yearDash + ')[^"]*)"[^>]*>([\\s\\S]*?)<\\/a>', 'gi'
      );
      let lm;
      while ((lm = linkRe.exec(html)) !== null) {
        const linkText = cleanHtml(lm[2]);
        if (linkText.length > 20 && linkText.trim().split(/\s+/).length >= 4) {
          const fullUrl = lm[1].indexOf('http') === 0 ? lm[1] : baseUrl + lm[1];
          results.push({ text: linkText.substring(0, 300), url: fullUrl });
        }
      }
    }

    // Убираем дубли
    const unique = [];
    results.forEach(r => {
      if (!unique.some(u => u.url === r.url || u.text === r.text)) unique.push(r);
    });
    return unique.slice(0, 5);

  } catch (e) {
    Logger.log('HTML error [' + baseUrl + ']: ' + e.toString());
    return [];
  }
}

// ================================================================
// RSS / ATOM ПАРСЕР
// ================================================================

function fetchRss(url, cutoff, seen) {
  try {
    const resp = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      followRedirects: true,
      deadline: MON.FETCH_TIMEOUT
    });
    if (resp.getResponseCode() !== 200) return [];

    const text = resp.getContentText();
    if (!text || text.trim().length === 0) return [];

    let doc;
    try { doc = XmlService.parse(text); }
    catch (xmlErr) { Logger.log('XML error [' + url + ']: ' + xmlErr.message); return []; }

    const root    = doc.getRootElement();
    const ns      = root.getNamespace();
    const isAtom  = root.getName() === 'feed';
    const entries = isAtom
      ? root.getChildren('entry', ns)
      : (root.getChild('channel') ? root.getChild('channel').getChildren('item') : []);

    const results = [];
    entries.forEach(entry => {
      try {
        const id = isAtom
          ? getXmlText(entry, 'id', ns)
          : (getXmlText(entry, 'guid') || getXmlText(entry, 'link'));
        const title   = isAtom ? getXmlText(entry, 'title', ns) : getXmlText(entry, 'title');
        const link    = isAtom
          ? (entry.getChild('link', ns) ? entry.getChild('link', ns).getAttribute('href').getValue() : '')
          : getXmlText(entry, 'link');
        const dateStr = isAtom
          ? (getXmlText(entry, 'updated', ns) || getXmlText(entry, 'published', ns))
          : getXmlText(entry, 'pubDate');

        if (!id || !title || seen.has(id)) return;
        if (dateStr && new Date(dateStr) < cutoff) return;

        results.push({ id, title: title.trim(), link: link.trim() });
      } catch (e) {}
    });

    return results;
  } catch (e) {
    Logger.log('RSS error [' + url + ']: ' + e.message);
    return [];
  }
}

function getXmlText(el, tag, ns) {
  const child = ns ? el.getChild(tag, ns) : el.getChild(tag);
  return child ? child.getText() : '';
}

// ================================================================
// ОТПРАВКА В TELEGRAM
// ================================================================

function sendTelegram(text) {
  const resp = UrlFetchApp.fetch(
    'https://api.telegram.org/bot' + MON.TG_TOKEN + '/sendMessage',
    {
      method:      'post',
      contentType: 'application/json',
      payload:     JSON.stringify({
        chat_id:                  MON.TG_CHAT,
        text:                     text,
        parse_mode:               'Markdown',
        disable_web_page_preview: true
      }),
      muteHttpExceptions: true,
      deadline: 15
    }
  );
  if (resp.getResponseCode() !== 200) Logger.log('Telegram error: ' + resp.getContentText());
}

// ================================================================
// НАСТРОЙКА ТРИГГЕРА — запустить ОДИН РАЗ вручную
// ================================================================

function setupMonitorTrigger() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'runDailyMonitor')
    .forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('runDailyMonitor')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .inTimezone('Europe/Moscow')
    .create();

  Logger.log('✅ Триггер установлен: ежедневно в 09:00 МСК');
}

// ================================================================
// ТЕСТ — сбрасывает SEEN_IDS и запускает мониторинг
// ================================================================

function testMonitor() {
  PropertiesService.getScriptProperties().deleteAllProperties();
  runDailyMonitor();
}