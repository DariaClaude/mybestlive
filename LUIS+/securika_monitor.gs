// ============================================================
// SECURIKA 2026 — Мониторинг конкурентов
// Версия 3.0 — с AI-саммари через DeepSeek
// ============================================================

const SPREADSHEET_ID = '18osrbAdyrdSqRDuyfko8wuOzM__DPoYG93z9M_WdNgg';
const SHEET_GID = 1073707391;
const TELEGRAM_TOKEN = '8653621049:AAHP8JqcPLzDR82CLSjcHiXzf_ek93bjJkU';
const RECIPIENTS = ['514283583', '704072834']; // daria_vis, olga_strela_coach
const DEEPSEEK_API_KEY = 'sk-8df7579cc97447638665e7214a58db95';

// Оставлено для обратной совместимости (не используется в hasKeyword)
const KEYWORDS = [
  'securika', 'секьюрик', 'крокус', 'crocus', 'москва экспо',
  '22 апрел', '23 апрел', '24 апрел'
];

const COMPETITORS_CONFIG = [
  { name: 'Аргус-Спектр',      telegram: 'argus_spectr',    site: 'https://argus-spectr.ru/news/' },
  { name: 'Рубеж (RUBEZH)',     telegram: 'rmc_rubezh',      site: 'https://rubezh.ru/news/' },
  { name: 'Болид (НВП)',        telegram: 'bolid_nvp',        site: 'https://bolid.ru/about/events/events_1273.html' },
  { name: 'ДССЛ/TRASSIR',      telegram: 'trassir',          site: 'https://www.dssl.ru/publications/news/' },
  { name: 'ISS',                telegram: 'iss_ru',           site: 'https://www.issivs.com/news/' },
  { name: 'Layta',              telegram: null,               site: 'https://www.layta.ru/news/' },
  { name: 'МСБ',                telegram: null,               site: null },
  { name: 'Parsec (СКУД)',      telegram: null,               site: 'https://www.parsec.ru/press/' },
  { name: 'Эридан',             telegram: null,               site: 'https://eridan.ru/news/' },
  { name: 'ЭТМ',               telegram: 'etm_company',      site: 'https://www.etm.ru/company/news/' },
  { name: 'Русский Свет',       telegram: null,               site: 'https://russvet.ru/news/' },
  { name: 'Tinko (ТД Тинко)',   telegram: null,               site: 'https://www.tinko.ru/news/' },
  { name: 'САТРО-ПАЛАДИН',     telegram: null,               site: null },
  { name: 'ТК РУТЕК',          telegram: null,               site: null },
  { name: 'ДЕАН',               telegram: null,               site: 'https://dean.ru/news/' },
  { name: 'ГАРАНТ (ТД)',        telegram: null,               site: null },
  { name: 'Hikvision',          telegram: 'hikvisionrussia',  site: 'https://hikvision.ru/news/' },
  { name: 'Macroscop',          telegram: null,               site: 'https://macroscop.com/news/' },
  { name: 'Твинпро (TwinPro)',  telegram: null,               site: 'https://www.twinpro.ru/news/' },
  { name: 'WAGNER',             telegram: null,               site: null },
  { name: 'DKC',                telegram: null,               site: null },
  { name: 'IEK',                telegram: null,               site: null }
];

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

function getDateStr(daysOffset) {
  var d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return Utilities.formatDate(d, 'Europe/Moscow', 'dd.MM.yyyy');
}

function getISODate(daysOffset) {
  var d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return Utilities.formatDate(d, 'Europe/Moscow', 'yyyy-MM-dd');
}

// Ключевые слова, однозначно указывающие на Securika
const CORE_KEYWORDS = [
  'securika', 'секьюрик', 'крокус', 'crocus', 'москва экспо',
  '22 апрел', '23 апрел', '24 апрел'
];

// Слова-усилители: засчитываются только вместе с CORE
const SUPPORT_KEYWORDS = [
  'выставк', 'стенд', 'экспо', 'анонс', 'новинк', 'презентац'
];

function hasKeyword(text) {
  var lower = text.toLowerCase();
  // Если есть прямое упоминание Securika/Крокуса — сразу засчитываем
  if (CORE_KEYWORDS.some(function(kw) { return lower.indexOf(kw) !== -1; })) return true;
  // Если только общие слова (выставка, стенд и т.д.) — не засчитываем
  return false;
}

function cleanHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '')
    .replace(/\s+/g, ' ').trim();
}

function looksLikeCode(text) {
  var codePatterns = [/cufon\./, /\.replace\(/, /function\s*\(/, /\{.*\}/, /\$\(/, /var\s+\w+\s*=/];
  return codePatterns.some(function(p) { return p.test(text); });
}

function isStale2025Content(text) {
  var lower = text.toLowerCase();
  return lower.indexOf('2025') !== -1 && lower.indexOf('2026') === -1;
}

// ============================================================
// AI-САММАРИ ЧЕРЕЗ DEEPSEEK
// ============================================================

function summarizeWithAI(competitorName, rawData) {
  if (!rawData || rawData.trim().length < 10) return 'Активности не выявлено';

  try {
    var prompt = 'Ты аналитик конкурентной разведки. Напиши 1-2 предложения — краткое саммари об активности компании "' +
      competitorName + '" перед выставкой Securika Moscow 2026 (22-24 апреля, Крокус Экспо).\n\n' +
      'Исходные данные:\n' + rawData + '\n\n' +
      'Правила: только факты из данных, на русском, без воды. ' +
      'Данные должны относиться к Securika 2026 (апрель 2026). ' +
      'Если в данных упоминается только Securika 2025 или прошлые годы — напиши "Активности по Securika не выявлено". ' +
      'Если данные не связаны с Securika или выставочной активностью — напиши "Активности по Securika не выявлено".';

    var response = UrlFetchApp.fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'post',
      contentType: 'application/json',
      headers: { 'Authorization': 'Bearer ' + DEEPSEEK_API_KEY },
      payload: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.3
      }),
      muteHttpExceptions: true
    });

    var result = JSON.parse(response.getContentText());
    if (result.choices && result.choices[0]) {
      return result.choices[0].message.content.trim();
    }
    return rawData.substring(0, 200);

  } catch (e) {
    Logger.log('DeepSeek error: ' + e.toString());
    return rawData.substring(0, 200);
  }
}

// ============================================================
// МОНИТОРИНГ TELEGRAM-КАНАЛОВ
// ============================================================

function checkTelegram(channelName, isoDate) {
  try {
    var url = 'https://t.me/s/' + channelName;
    var resp = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' }
    });

    if (resp.getResponseCode() !== 200) return null;
    var html = resp.getContentText();

    var blocks = html.split('<div class="tgme_widget_message_wrap');
    var posts = [];

    for (var i = 1; i < blocks.length; i++) {
      var block = blocks[i];
      if (block.indexOf('datetime="' + isoDate) === -1) continue;

      var textMatch = block.match(/class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/);
      if (!textMatch) continue;

      var text = cleanHtml(textMatch[1]);
      if (text.length < 15) continue;

      // Убираем URL и проверяем, остался ли содержательный текст
      var textNoUrls = text.replace(/https?:\/\/\S+/gi, '').replace(/\s+/g, ' ').trim();
      if (textNoUrls.length < 15) continue;

      posts.push(textNoUrls.substring(0, 500));
    }

    if (posts.length === 0) return null;
    return 'Telegram (' + posts.length + ' пост): ' + posts.join(' | ');

  } catch (e) {
    Logger.log('Telegram error [' + channelName + ']: ' + e.toString());
    return null;
  }
}

// ============================================================
// МОНИТОРИНГ САЙТОВ
// ============================================================

function checkSite(siteUrl) {
  try {
    var resp = UrlFetchApp.fetch(siteUrl, {
      muteHttpExceptions: true,
      followRedirects: true,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' }
    });

    if (resp.getResponseCode() !== 200) return null;
    var html = resp.getContentText();

    // Убираем скрипты и стили до парсинга
    html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<style[\s\S]*?<\/style>/gi, '');

    var results = [];

    // 1. Meta description — часто самое информативное
    var metaMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
    if (metaMatch) {
      var meta = metaMatch[1].trim();
      if (meta.length > 30 && hasKeyword(meta) && !isStale2025Content(meta)) results.push(meta);
    }

    // 2. Заголовки h1/h2/h3 с ключевыми словами
    var headMatches = html.match(/<h[123][^>]*>([\s\S]*?)<\/h[123]>/gi) || [];
    headMatches.forEach(function(h) {
      var text = cleanHtml(h);
      var wordCount = text.trim().split(/\s+/).length;
      if (text.length > 15 && text.length < 250 && wordCount >= 4 && hasKeyword(text) && !looksLikeCode(text) && !isStale2025Content(text)) {
        results.push(text);
      }
    });

    // 3. Ссылки-заголовки новостей (только содержательные — минимум 6 слов)
    if (results.length === 0) {
      var linkMatches = html.match(/<a[^>]*>([\s\S]*?)<\/a>/gi) || [];
      linkMatches.forEach(function(a) {
        var text = cleanHtml(a);
        var wordCount = text.trim().split(/\s+/).length;
        if (text.length > 40 && text.length < 200 && wordCount >= 6 && hasKeyword(text) && !looksLikeCode(text) && !isStale2025Content(text)) {
          results.push(text);
        }
      });
    }

    // 4. Параграфы с ключевыми словами (последний резерв)
    if (results.length === 0) {
      var paraMatches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
      for (var i = 0; i < paraMatches.length; i++) {
        var text = cleanHtml(paraMatches[i]);
        if (text.length > 40 && text.length < 400 && hasKeyword(text) && !looksLikeCode(text) && !isStale2025Content(text)) {
          results.push(text);
          break;
        }
      }
    }

    if (results.length === 0) return null;

    // Дедупликация: убираем одинаковые и почти одинаковые строки
    var unique = [];
    results.forEach(function(r) {
      var isDup = unique.some(function(u) {
        return u === r || u.indexOf(r) !== -1 || r.indexOf(u) !== -1;
      });
      if (!isDup) unique.push(r);
    });

    if (unique.length === 0) return null;
    return 'Сайт: ' + unique.slice(0, 3).join(' | ');

  } catch (e) {
    Logger.log('Site error [' + siteUrl + ']: ' + e.toString());
    return null;
  }
}

// ============================================================
// ПРОВЕРКА ДЕДЛАЙНА — выставка работает 22–24 апреля 2026
// После 24 апреля скрипты автоматически не запускаются
// ============================================================

function isEventActive() {
  var now = new Date();
  var moscowStr = Utilities.formatDate(now, 'Europe/Moscow', 'yyyy-MM-dd');
  var deadline = '2026-04-24';
  if (moscowStr > deadline) {
    Logger.log('⏹ Выставка завершена (' + moscowStr + '). Дедлайн: ' + deadline + '. Скрипт остановлен.');
    return false;
  }
  return true;
}

// ============================================================
// ОСНОВНАЯ ФУНКЦИЯ МОНИТОРИНГА — запускается в 6:00 по МСК
// ============================================================

function runDailyMonitoring() {
  if (!isEventActive()) return;

  var dateStr = getDateStr(-1);
  var isoDate = getISODate(-1);

  Logger.log('=== Мониторинг за ' + dateStr + ' ===');

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheets().find(function(s) { return s.getSheetId() == SHEET_GID; }) || ss.getActiveSheet();
  var lastRow = sheet.getLastRow();

  var nameToRow = {};
  for (var r = 2; r <= lastRow; r++) {
    var val = sheet.getRange(r, 2).getValue();
    if (val) nameToRow[val] = r;
  }

  COMPETITORS_CONFIG.forEach(function(comp) {
    var rawParts = [];

    if (comp.telegram) {
      var tg = checkTelegram(comp.telegram, isoDate);
      if (tg) rawParts.push(tg);
      Utilities.sleep(1000);
    }

    if (comp.site) {
      var site = checkSite(comp.site);
      if (site) rawParts.push(site);
      Utilities.sleep(800);
    }

    var summary;
    if (rawParts.length === 0) {
      summary = 'Активности не выявлено';
    } else {
      // Отправляем в DeepSeek для получения нормального саммари
      summary = summarizeWithAI(comp.name, rawParts.join('\n'));
      Utilities.sleep(500);
    }

    var entry = '📅 ' + dateStr + '\n' + summary;
    Logger.log(comp.name + ': ' + summary);

    var row = nameToRow[comp.name];
    if (row) {
      var cellJ = sheet.getRange(row, 10);
      var existing = cellJ.getValue() || '';
      var dateMarker = '📅 ' + dateStr;
      var newValue;

      if (existing.indexOf(dateMarker) !== -1) {
        var entries = existing.split('\n\n');
        var replaced = entries.map(function(e) {
          return e.trim().indexOf(dateMarker) === 0 ? entry : e;
        });
        newValue = replaced.join('\n\n');
      } else {
        newValue = existing ? entry + '\n\n' + existing : entry;
      }

      cellJ.setValue(newValue);
      cellJ.setWrap(true);
      cellJ.setVerticalAlignment('top');
      cellJ.setFontFamily('Arial');
      cellJ.setFontSize(10);
    }
  });

  Logger.log('=== Мониторинг завершён ===');
}

// ============================================================
// ОТПРАВКА ОТЧЁТА В TELEGRAM — запускается в 8:00 по МСК
// ============================================================

function sendDailyTelegramReport() {
  if (!isEventActive()) return;

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheets().find(function(s) { return s.getSheetId() == SHEET_GID; }) || ss.getActiveSheet();

  var yesterday = getDateStr(-1);
  var today     = getDateStr(0);

  var active = [];
  var lastRow = sheet.getLastRow();

  for (var r = 2; r <= lastRow; r++) {
    var name   = sheet.getRange(r, 2).getValue();
    var update = sheet.getRange(r, 10).getValue() || '';

    if (name && update.indexOf(yesterday) !== -1
        && update.indexOf('не выявлено') === -1
        && update.indexOf('не найдено') === -1) {

      var lines = update.split('\n').slice(1, 5).join('\n').trim();
      if (lines) active.push('🔴 <b>' + name + '</b>\n' + lines);
    }
  }

  var text = '📊 <b>Мониторинг Securika 2026</b>\n';
  text += '🗓 Активность за ' + yesterday + ' (отчёт ' + today + ')\n\n';

  if (active.length > 0) {
    text += '🟢 <b>Есть активность (' + active.length + '):</b>\n\n';
    text += active.join('\n\n') + '\n\n';
    text += '⚪️ Остальные конкуренты — без изменений\n\n';
  } else {
    text += '⚪️ Активности у конкурентов не выявлено\n\n';
  }

  text += '📋 <a href="https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '/edit?gid=' + SHEET_GID + '">Открыть полную таблицу</a>';

  var url = 'https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage';
  RECIPIENTS.forEach(function(chatId) {
    UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'HTML' })
    });
  });

  Logger.log('Отчёт отправлен за ' + yesterday);
}

// ============================================================
// НАСТРОЙКА ТРИГГЕРОВ — запустить ОДИН РАЗ вручную
// ============================================================

function setupTriggers() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    var fn = t.getHandlerFunction();
    if (fn === 'runDailyMonitoring' || fn === 'sendDailyTelegramReport') {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger('runDailyMonitoring')
    .timeBased().everyDays(1).atHour(6).create();

  ScriptApp.newTrigger('sendDailyTelegramReport')
    .timeBased().everyDays(1).atHour(8).create();

  Logger.log('Триггеры настроены: мониторинг в 6:00, отчёт в 8:00 (Europe/Moscow)');
}

// ============================================================
// РУЧНОЙ ВВОД ДАННЫХ ЧЕРЕЗ POST (оставлен для совместимости)
// ============================================================

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheets().find(function(s) { return s.getSheetId() == SHEET_GID; }) || ss.getActiveSheet();
    var date = data.date;
    var updates = data.updates;

    var headerCell = sheet.getRange(1, 10);
    if (!headerCell.getValue()) {
      headerCell.setValue('Обновление (ежедневный мониторинг)');
      headerCell.setBackground('#1A1A2E');
      headerCell.setFontColor('#FFFFFF');
      headerCell.setFontFamily('Arial');
      headerCell.setFontSize(10);
      headerCell.setFontWeight('normal');
      headerCell.setWrap(true);
      headerCell.setVerticalAlignment('middle');
      headerCell.setHorizontalAlignment('center');
      sheet.setColumnWidth(10, 340);
    }

    updates.forEach(function(item) {
      var lastRow = sheet.getLastRow();
      for (var r = 2; r <= lastRow; r++) {
        var cellName = sheet.getRange(r, 2).getValue();
        if (cellName === item.name) {
          var cellJ = sheet.getRange(r, 10);
          var existing = cellJ.getValue() || '';
          var newEntry = '📅 ' + date + '\n' + (item.update || 'Активности не выявлено');
          cellJ.setValue(existing ? newEntry + '\n\n' + existing : newEntry);
          cellJ.setWrap(true);
          cellJ.setVerticalAlignment('top');
          cellJ.setFontFamily('Arial');
          cellJ.setFontSize(10);
          break;
        }
      }
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', updated: updates.length, date: date }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// ТЕСТОВЫЕ ФУНКЦИИ
// ============================================================

function testMonitoring() {
  runDailyMonitoring();
}

function testReport() {
  sendDailyTelegramReport();
}

function testOneChannel() {
  var result = checkTelegram('argus_spectr', getISODate(-1));
  Logger.log('Аргус-Спектр raw: ' + (result || 'ничего не найдено'));
  if (result) Logger.log('AI summary: ' + summarizeWithAI('Аргус-Спектр', result));
}

// ============================================================
// ОЧИСТКА МУСОРА В КОЛОНКЕ J — запустить ОДИН РАЗ вручную
// ============================================================

function cleanupStaleContent() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheets().find(function(s) { return s.getSheetId() == SHEET_GID; }) || ss.getActiveSheet();
  var lastRow = sheet.getLastRow();

  for (var r = 2; r <= lastRow; r++) {
    var cellJ = sheet.getRange(r, 10);
    var value = cellJ.getValue();
    if (!value) continue;

    var name = sheet.getRange(r, 2).getValue();
    var entries = value.split('\n\n');
    var cleaned = [];

    entries.forEach(function(entry) {
      entry = entry.trim();
      if (!entry) return;

      var lines = entry.split('\n');
      var dateLine = lines[0];
      var bodyLines = lines.slice(1).join('\n').trim();

      if (!dateLine.match(/^📅/)) return;

      // Проверка 1: контент только про 2025 без 2026
      if (isStale2025Content(bodyLines)) {
        cleaned.push(dateLine + '\nАктивности не выявлено');
        Logger.log(name + ' [' + dateLine + ']: заменено (данные 2025)');
        return;
      }

      // Проверка 2: повторяющийся текст (мусор типа "X | X | X" или "X. X")
      var isRepetitive = [/\s*\|\s*/, /\.\s+/].some(function(sep) {
        var parts = bodyLines.split(sep).map(function(p) { return p.trim(); }).filter(function(p) { return p.length > 5; });
        var uniqueParts = parts.filter(function(p, i) { return parts.indexOf(p) === i; });
        return parts.length >= 2 && uniqueParts.length === 1;
      });
      if (isRepetitive) {
        cleaned.push(dateLine + '\nАктивности не выявлено');
        Logger.log(name + ' [' + dateLine + ']: заменено (повторяющийся текст)');
        return;
      }

      // Проверка 3: слишком короткий бессмысленный контент (просто название события)
      if (bodyLines.length < 40 && bodyLines.toLowerCase().indexOf('активности') === -1) {
        cleaned.push(dateLine + '\nАктивности не выявлено');
        Logger.log(name + ' [' + dateLine + ']: заменено (слишком короткий контент)');
        return;
      }

      // Проверка 4: нет ни одного ключевого слова Securika в теле записи
      var hasSecurikaRef = CORE_KEYWORDS.some(function(kw) {
        return bodyLines.toLowerCase().indexOf(kw) !== -1;
      });
      var isAlreadyEmpty = bodyLines.toLowerCase().indexOf('активности') !== -1;
      if (!hasSecurikaRef && !isAlreadyEmpty) {
        cleaned.push(dateLine + '\nАктивности не выявлено');
        Logger.log(name + ' [' + dateLine + ']: заменено (нет упоминания Securika)');
        return;
      }

      cleaned.push(entry);
    });

    var newValue = cleaned.join('\n\n');
    if (newValue !== value) {
      cellJ.setValue(newValue);
      cellJ.setWrap(true);
      cellJ.setVerticalAlignment('top');
      cellJ.setFontFamily('Arial');
      cellJ.setFontSize(10);
    }
  }

  Logger.log('=== Очистка мусора завершена ===');
}

// ============================================================
// ОЧИСТКА ДУБЛЕЙ — запустить ОДИН РАЗ вручную
// ============================================================

function cleanupDuplicates() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheets().find(function(s) { return s.getSheetId() == SHEET_GID; }) || ss.getActiveSheet();
  var lastRow = sheet.getLastRow();

  for (var r = 2; r <= lastRow; r++) {
    var cellJ = sheet.getRange(r, 10);
    var value = cellJ.getValue();
    if (!value) continue;

    var entries = value.split('\n\n');
    var byDate = {};
    var dateOrder = [];

    entries.forEach(function(entry) {
      entry = entry.trim();
      if (!entry) return;
      var dateMatch = entry.match(/^📅\s*(\d{2}\.\d{2}\.\d{4})/);
      if (!dateMatch) return;
      var date = dateMatch[1];
      if (!byDate[date]) {
        byDate[date] = entry;
        dateOrder.push(date);
      } else {
        var existing = byDate[date];
        var existingEmpty = existing.indexOf('не выявлено') !== -1 || existing.indexOf('не найдено') !== -1;
        var newEmpty = entry.indexOf('не выявлено') !== -1 || entry.indexOf('не найдено') !== -1;
        if (existingEmpty && !newEmpty) {
          byDate[date] = entry;
        } else if (!existingEmpty && !newEmpty && entry.length > existing.length) {
          byDate[date] = entry;
        }
      }
    });

    var seen = {};
    var uniqueDates = dateOrder.filter(function(d) {
      if (seen[d]) return false;
      seen[d] = true;
      return true;
    });

    uniqueDates.sort(function(a, b) {
      return b.split('.').reverse().join('').localeCompare(a.split('.').reverse().join(''));
    });

    var cleaned = uniqueDates.map(function(d) { return byDate[d]; }).join('\n\n');
    cellJ.setValue(cleaned);
    Logger.log('Строка ' + r + ' готова: ' + uniqueDates.join(', '));
  }

  Logger.log('=== Очистка завершена ===');
}