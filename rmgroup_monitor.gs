// ============================================================
// RM GROUP — Мониторинг конкурентов
// Версия 1.0 — с AI-саммари через DeepSeek
// ============================================================

const RMG_SPREADSHEET_ID = '1z49f3iBXx3YrCoQ9p6TRkAX5uqzxNj6uFHO_6lJrD7E';
const RMG_SHEET_GID = 0; // первый лист — уточни если другой
const RMG_TELEGRAM_TOKEN = '8303531456:AAFXjyvqYvDimqYIp3WVf_cAixHNz0JMGuY';
const RMG_RECIPIENTS = [514283583]; // Дарья @daria_vis
const RMG_DEEPSEEK_API_KEY = 'sk-8df7579cc97447638665e7214a58db95';

const RMG_COMPETITORS = [
  {
    name: 'АКМЭ',
    telegram: null,
    site: 'https://www.akmeservices.ru',
    newsPath: '/news/'
  },
  {
    name: 'Алгоритм 24',
    telegram: null,
    site: 'https://algorithm24.ru',
    newsPath: '/'
  },
  {
    name: 'Константа',
    telegram: null,
    site: null, // URL не найден — добавь вручную
    newsPath: null
  },
  {
    name: 'Solution Pro',
    telegram: null,
    site: 'https://s-pro.group',
    newsPath: '/'
  },
  {
    name: 'Qwell',
    telegram: null,
    site: 'https://www.qwell.ru',
    newsPath: '/'
  },
  {
    name: 'Mass Staff',
    telegram: null,
    site: 'https://massstaff.ru',
    newsPath: '/'
  },
  {
    name: 'Leader Team',
    telegram: 'leaderteamclub',
    site: 'https://leaderteam.ru',
    newsPath: '/blog'
  },
  {
    name: 'Эксцельсиор',
    telegram: null,
    site: 'https://exc.ltd',
    newsPath: '/blog'
  },
  {
    name: 'Рабочие руки',
    telegram: null,
    site: null, // URL не найден — добавь вручную
    newsPath: null
  },
  {
    name: 'Ситистафф',
    telegram: null,
    site: 'https://citystaff.ru',
    newsPath: '/'
  },
  {
    name: 'Ventra',
    telegram: null,
    site: 'https://ventra.ru',
    newsPath: '/news'
  },
  {
    name: 'Два колеса',
    telegram: null,
    site: 'https://2klmsk.ru',
    newsPath: '/'
  },
  {
    name: 'Работа — это просто',
    telegram: null,
    site: null, // URL не найден — добавь вручную
    newsPath: null
  }
];

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

function rmgGetDateStr(daysOffset) {
  var d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return Utilities.formatDate(d, 'Europe/Moscow', 'dd.MM.yyyy');
}

function rmgGetISODate(daysOffset) {
  var d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return Utilities.formatDate(d, 'Europe/Moscow', 'yyyy-MM-dd');
}

function rmgCleanHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '')
    .replace(/\s+/g, ' ').trim();
}

function rmgLooksLikeCode(text) {
  var codePatterns = [/cufon\./, /\.replace\(/, /function\s*\(/, /\{.*\}/, /\$\(/, /var\s+\w+\s*=/];
  return codePatterns.some(function(p) { return p.test(text); });
}

function rmgIsRepetitive(text) {
  return [/\s*\|\s*/, /\.\s+/].some(function(sep) {
    var parts = text.split(sep).map(function(p) { return p.trim(); }).filter(function(p) { return p.length > 5; });
    var unique = parts.filter(function(p, i) { return parts.indexOf(p) === i; });
    return parts.length >= 2 && unique.length === 1;
  });
}

// ============================================================
// AI-САММАРИ ЧЕРЕЗ DEEPSEEK
// ============================================================

function rmgSummarizeWithAI(competitorName, rawData) {
  if (!rawData || rawData.trim().length < 10) return 'Активности не выявлено';

  try {
    var prompt =
      'Ты аналитик конкурентной разведки для кадрового агентства RM Group (аутстаффинг и подбор линейного персонала).\n' +
      'Напиши 1-2 предложения — краткое саммари о свежей активности компании-конкурента "' + competitorName + '".\n\n' +
      'Исходные данные:\n' + rawData + '\n\n' +
      'Правила:\n' +
      '- Только факты из данных, на русском, без воды\n' +
      '- Выдели самое важное с точки зрения конкурентной разведки: новые услуги, акции, партнёрства, открытие офисов, изменение позиционирования\n' +
      '- Если данные — технический мусор, навигация или нет смыслового контента — напиши "Активности не выявлено"\n' +
      '- Если данные устаревшие (старше 2 недель) — напиши "Активности не выявлено"';

    var response = UrlFetchApp.fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'post',
      contentType: 'application/json',
      headers: { 'Authorization': 'Bearer ' + RMG_DEEPSEEK_API_KEY },
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
    return 'Активности не выявлено';

  } catch (e) {
    Logger.log('DeepSeek error: ' + e.toString());
    return 'Активности не выявлено';
  }
}

// ============================================================
// МОНИТОРИНГ TELEGRAM-КАНАЛОВ
// ============================================================

function rmgCheckTelegram(channelName, isoDate) {
  try {
    var url = 'https://t.me/s/' + channelName;
    var resp = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      deadline: 10,
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

      var text = rmgCleanHtml(textMatch[1]);
      if (text.length < 15) continue;

      // Убираем URL
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

function rmgCheckSite(siteUrl, newsPath) {
  try {
    var url = siteUrl + (newsPath || '/');
    var resp = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      followRedirects: true,
      deadline: 10,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' }
    });

    if (resp.getResponseCode() !== 200) return null;
    var html = resp.getContentText();

    html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<style[\s\S]*?<\/style>/gi, '');

    var results = [];

    // 1. Свежие заголовки новостей h1/h2/h3 (мин. 4 слова)
    var headMatches = html.match(/<h[123][^>]*>([\s\S]*?)<\/h[123]>/gi) || [];
    headMatches.forEach(function(h) {
      var text = rmgCleanHtml(h);
      var wordCount = text.trim().split(/\s+/).length;
      if (text.length > 20 && text.length < 300 && wordCount >= 4 && !rmgLooksLikeCode(text) && !rmgIsRepetitive(text)) {
        results.push(text);
      }
    });

    // 2. Ссылки-заголовки новостей (мин. 6 слов)
    if (results.length === 0) {
      var linkMatches = html.match(/<a[^>]*>([\s\S]*?)<\/a>/gi) || [];
      linkMatches.forEach(function(a) {
        var text = rmgCleanHtml(a);
        var wordCount = text.trim().split(/\s+/).length;
        if (text.length > 40 && text.length < 200 && wordCount >= 6 && !rmgLooksLikeCode(text) && !rmgIsRepetitive(text)) {
          results.push(text);
        }
      });
    }

    // 3. Параграфы (последний резерв)
    if (results.length === 0) {
      var paraMatches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
      for (var i = 0; i < paraMatches.length; i++) {
        var text = rmgCleanHtml(paraMatches[i]);
        if (text.length > 50 && text.length < 400 && !rmgLooksLikeCode(text) && !rmgIsRepetitive(text)) {
          results.push(text);
          break;
        }
      }
    }

    if (results.length === 0) return null;

    // Дедупликация
    var unique = [];
    results.forEach(function(r) {
      var isDup = unique.some(function(u) {
        return u === r || u.indexOf(r) !== -1 || r.indexOf(u) !== -1;
      });
      if (!isDup) unique.push(r);
    });

    if (unique.length === 0) return null;
    return 'Сайт: ' + unique.slice(0, 4).join(' | ');

  } catch (e) {
    Logger.log('Site error [' + siteUrl + ']: ' + e.toString());
    return null;
  }
}

// ============================================================
// МОНИТОРИНГ НОВОСТЕЙ — Google News RSS
// ============================================================

function rmgCheckGoogleNews(companyName) {
  try {
    var query = encodeURIComponent('"' + companyName + '"');
    var url = 'https://news.google.com/rss/search?q=' + query + '&hl=ru&gl=RU&ceid=RU:ru';
    var resp = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      deadline: 10,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (resp.getResponseCode() !== 200) return null;

    var xml = resp.getContentText();
    var items = xml.match(/<item>([\s\S]*?)<\/item>/gi) || [];
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var yDate = Utilities.formatDate(yesterday, 'Europe/Moscow', 'yyyy-MM-dd');

    var results = [];
    items.forEach(function(item) {
      var titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
      var dateMatch  = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      if (!titleMatch || !dateMatch) return;
      var title = titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim();
      var pubDate = Utilities.formatDate(new Date(dateMatch[1]), 'Europe/Moscow', 'yyyy-MM-dd');
      if (pubDate === yDate && title.length > 10) results.push(title);
    });

    if (results.length === 0) return null;
    return 'Google News: ' + results.slice(0, 3).join(' | ');
  } catch (e) {
    Logger.log('GoogleNews error [' + companyName + ']: ' + e.toString());
    return null;
  }
}

// ============================================================
// ОСНОВНАЯ ФУНКЦИЯ МОНИТОРИНГА — запускается в 6:00 по МСК
// ============================================================

function rmgRunDailyMonitoring() {
  var dateStr = rmgGetDateStr(-1);
  var isoDate = rmgGetISODate(-1);

  Logger.log('=== RM Group мониторинг за ' + dateStr + ' ===');

  var ss = SpreadsheetApp.openById(RMG_SPREADSHEET_ID);
  var sheet = ss.getSheets().find(function(s) { return s.getSheetId() == RMG_SHEET_GID; }) || ss.getActiveSheet();
  var lastRow = sheet.getLastRow();

  // Строим карту: название → строка
  var nameToRow = {};
  for (var r = 2; r <= lastRow; r++) {
    var val = sheet.getRange(r, 2).getValue();
    if (val) nameToRow[val] = r;
  }

  RMG_COMPETITORS.forEach(function(comp) {
    var rawParts = [];

    if (comp.telegram) {
      var tg = rmgCheckTelegram(comp.telegram, isoDate);
      if (tg) rawParts.push(tg);
      Utilities.sleep(1000);
    }

    if (comp.site) {
      var site = rmgCheckSite(comp.site, comp.newsPath);
      if (site) rawParts.push(site);
      Utilities.sleep(800);
    }

    // Google News
    var gNews = rmgCheckGoogleNews(comp.name);
    if (gNews) rawParts.push(gNews);
    Utilities.sleep(300);

    var summary;
    if (rawParts.length === 0) {
      summary = 'Активности не выявлено';
    } else {
      summary = rmgSummarizeWithAI(comp.name, rawParts.join('\n'));
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
        // Храним последние 30 дней (обрезаем старые)
        var allEntries = existing ? [entry].concat(existing.split('\n\n')) : [entry];
        newValue = allEntries.slice(0, 30).join('\n\n');
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

function rmgSendDailyTelegramReport() {
  var ss = SpreadsheetApp.openById(RMG_SPREADSHEET_ID);
  var sheet = ss.getSheets().find(function(s) { return s.getSheetId() == RMG_SHEET_GID; }) || ss.getActiveSheet();

  var yesterday = rmgGetDateStr(-1);
  var today     = rmgGetDateStr(0);
  var lastRow   = sheet.getLastRow();

  var active = [];

  for (var r = 2; r <= lastRow; r++) {
    var name   = sheet.getRange(r, 2).getValue();
    var update = sheet.getRange(r, 10).getValue() || '';

    if (name && update.indexOf(yesterday) !== -1
        && update.indexOf('не выявлено') === -1
        && update.indexOf('не найдено') === -1) {
      var lines = update.split('\n').slice(1, 4).join('\n').trim();
      if (lines) active.push('🔴 <b>' + name + '</b>\n' + lines);
    }
  }

  var text = '📊 <b>Мониторинг конкурентов RM Group</b>\n';
  text += '🗓 Активность за ' + yesterday + ' (отчёт ' + today + ')\n\n';

  if (active.length > 0) {
    text += '🟢 <b>Есть активность (' + active.length + '):</b>\n\n';
    text += active.join('\n\n') + '\n\n';
    text += '⚪️ Остальные конкуренты — без изменений\n\n';
  } else {
    text += '⚪️ Активности у конкурентов не выявлено\n\n';
  }

  text += '📋 <a href="https://docs.google.com/spreadsheets/d/' + RMG_SPREADSHEET_ID + '">Открыть таблицу</a>';

  var url = 'https://api.telegram.org/bot' + RMG_TELEGRAM_TOKEN + '/sendMessage';
  RMG_RECIPIENTS.forEach(function(chatId) {
    UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'HTML' })
    });
  });

  Logger.log('Отчёт отправлен за ' + yesterday);
}

// ============================================================
// ПЕРВОНАЧАЛЬНАЯ НАСТРОЙКА ТАБЛИЦЫ — запустить ОДИН РАЗ
// ============================================================

function rmgSetupSheet() {
  var ss = SpreadsheetApp.openById(RMG_SPREADSHEET_ID);
  var sheet = ss.getSheets().find(function(s) { return s.getSheetId() == RMG_SHEET_GID; }) || ss.getActiveSheet();

  // Заголовки
  var headers = ['#', 'Компания', 'Сайт', 'Telegram', 'VK', 'Статус', 'Город', 'Примечание', 'Доп.', 'Мониторинг (авто)'];
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setBackground('#1A1A2E');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontFamily('Arial');
  headerRange.setFontSize(10);
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 36);

  // Данные конкурентов
  var data = [
    [1,  'АКМЭ',                  'akmeservices.ru',   '',                    '', 'Активен', 'Москва', ''],
    [2,  'Алгоритм 24',           'algorithm24.ru',    '',                    '', 'Активен', 'Москва', ''],
    [3,  'Константа',             '',                  '',                    '', 'Уточнить', '',      'URL не найден'],
    [4,  'Solution Pro',          's-pro.group',       '',                    '', 'Активен', 'Москва', ''],
    [5,  'Qwell',                 'qwell.ru',          '',                    '', 'Активен', 'Москва', ''],
    [6,  'Mass Staff',            'massstaff.ru',      '',                    '', 'Активен', 'Москва', ''],
    [7,  'Leader Team',           'leaderteam.ru',     't.me/leaderteamclub', 'vk.com/leaderteamclub', 'Активен', 'Москва', 'Есть TG-канал'],
    [8,  'Эксцельсиор',          'exc.ltd',           '',                    '', 'Активен', 'Москва', ''],
    [9,  'Рабочие руки',         '',                  '',                    '', 'Уточнить', '',      'URL не найден'],
    [10, 'Ситистафф',            'citystaff.ru',      '',                    '', 'Активен', 'Москва', ''],
    [11, 'Ventra',                'ventra.ru',         '',                    '', 'Активен', 'Москва', ''],
    [12, 'Два колеса',            '2klmsk.ru',         '',                    '', 'Активен', 'Москва', ''],
    [13, 'Работа — это просто',   '',                  '',                    '', 'Уточнить', '',      'URL не найден']
  ];

  for (var i = 0; i < data.length; i++) {
    var row = i + 2;
    var rowData = data[i];
    sheet.getRange(row, 1, 1, 8).setValues([rowData]);

    // Чередование строк
    var bg = (i % 2 === 0) ? '#F8F9FA' : '#FFFFFF';
    sheet.getRange(row, 1, 1, 10).setBackground(bg);

    // Статус "Уточнить" — жёлтый
    if (rowData[5] === 'Уточнить') {
      sheet.getRange(row, 6).setBackground('#FFF3CD');
    }
  }

  // Ширина колонок
  sheet.setColumnWidth(1, 40);   // #
  sheet.setColumnWidth(2, 180);  // Компания
  sheet.setColumnWidth(3, 160);  // Сайт
  sheet.setColumnWidth(4, 160);  // Telegram
  sheet.setColumnWidth(5, 160);  // VK
  sheet.setColumnWidth(6, 90);   // Статус
  sheet.setColumnWidth(7, 100);  // Город
  sheet.setColumnWidth(8, 150);  // Примечание
  sheet.setColumnWidth(9, 50);   // Доп
  sheet.setColumnWidth(10, 360); // Мониторинг

  // Шапка колонки мониторинга
  var monHeader = sheet.getRange(1, 10);
  monHeader.setValue('Мониторинг (авто)');
  monHeader.setBackground('#1A1A2E');
  monHeader.setFontColor('#FFFFFF');

  // Закрепить первую строку
  sheet.setFrozenRows(1);

  Logger.log('Таблица настроена');
}

// ============================================================
// НАСТРОЙКА ТРИГГЕРОВ — запустить ОДИН РАЗ вручную
// ============================================================

function rmgSetupTriggers() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    var fn = t.getHandlerFunction();
    if (fn === 'rmgRunDailyMonitoring' || fn === 'rmgSendDailyTelegramReport') {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger('rmgRunDailyMonitoring')
    .timeBased().everyDays(1).atHour(6).create();

  ScriptApp.newTrigger('rmgSendDailyTelegramReport')
    .timeBased().everyDays(1).atHour(8).create();

  Logger.log('Триггеры настроены: мониторинг 6:00, отчёт 8:00 (Europe/Moscow)');
}

// ============================================================
// ТЕСТОВЫЕ ФУНКЦИИ
// ============================================================

function rmgTestMonitoring() {
  rmgRunDailyMonitoring();
}

function rmgTestReport() {
  rmgSendDailyTelegramReport();
}

function rmgTestOneCompetitor() {
  var result = rmgCheckSite('https://leaderteam.ru', '/blog');
  Logger.log('Leader Team raw: ' + (result || 'ничего не найдено'));
  if (result) Logger.log('AI summary: ' + rmgSummarizeWithAI('Leader Team', result));
}
