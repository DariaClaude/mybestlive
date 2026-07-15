// ============================================================
// RM GROUP — Мониторинг конкурентов v2.0
// Платформы: Telegram + Сайты (RSS / HTML)
// Каждый пост включает ссылку на источник
// ============================================================

// ============================================================
// КОНФИГУРАЦИЯ
// ============================================================

const RMG_CONFIG = {
  SPREADSHEET_ID: '1z49f3iBXx3YrCoQ9p6TRkAX5uqzxNj6uFHO_6lJrD7E',
  SHEET_GID:      0,
  TELEGRAM_TOKEN: '8303531456:AAFXjyvqYvDimqYIp3WVf_cAixHNz0JMGuY',
  RECIPIENTS:     [514283583], // Дарья @daria_vis
  DEEPSEEK_KEY:   'sk-8df7579cc97447638665e7214a58db95'
};

// ============================================================
// КОНКУРЕНТЫ — Telegram + сайт
// ============================================================

const RMG_COMPETITORS = [
  {
    name:      'АКМЭ',
    telegram:  null,
    site:      'https://www.akmeservices.ru',
    newsPath:  '/news/'
  },
  {
    name:      'Алгоритм 24',
    telegram:  'algorithm_24',
    site:      'https://algorithm24.ru',
    newsPath:  '/stati/'
  },
  {
    name:      'Константа',
    telegram:  null,
    site:      null,
    newsPath:  null
  },
  {
    name:      'Solution Pro',
    telegram:  null,
    site:      'https://s-pro.group',
    newsPath:  '/'
  },
  {
    name:      'Qwell',
    telegram:  null,
    site:      'https://www.qwell.ru',
    newsPath:  '/'
  },
  {
    name:      'Mass Staff',
    telegram:  'Mass_Staff',
    site:      'https://massstaff.ru',
    newsPath:  '/stati/'
  },
  {
    name:      'Leader Team',
    telegram:  'leaderteamclub',
    site:      'https://leaderteam.ru',
    newsPath:  '/blog'
  },
  {
    name:      'Эксцельсиор',
    telegram:  'excltd',
    site:      'https://exc.ltd',
    newsPath:  '/blog'
  },
  {
    name:      'Рабочие руки',
    telegram:  'rabrukirus',
    telegram2: 'handswork_team',
    site:      'https://russian.works',
    newsPath:  '/'
  },
  {
    name:      'Ситистафф',
    telegram:  'citystaff_msk',
    site:      'https://citystaff.ru',
    newsPath:  '/'
  },
  {
    name:      'Ventra',
    telegram:  'ventrago',
    site:      'https://ventra.ru',
    newsPath:  '/news'
  },
  {
    name:      'Два колеса',
    telegram:  'spartanci_ru',
    site:      'https://2klmsk.ru',
    newsPath:  '/news/'
  },
  {
    name:      'Работа — это просто',
    telegram:  null,
    site:      'https://msto.ru',
    newsPath:  '/'
  }
];

// ============================================================
// УТИЛИТЫ
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
    .replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '').replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ').trim();
}

function rmgLooksLikeCode(text) {
  return [/cufon\./, /\.replace\(/, /function\s*\(/, /\$\(/, /var\s+\w+\s*=/]
    .some(function(p) { return p.test(text); });
}

// ============================================================
// МОНИТОРИНГ TELEGRAM
// ============================================================

function rmgCheckTelegram(channelName, isoDate) {
  try {
    var url  = 'https://t.me/s/' + channelName;
    var resp = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      deadline: 6,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' }
    });
    if (resp.getResponseCode() !== 200) return [];

    var html   = resp.getContentText();
    var blocks = html.split('<div class="tgme_widget_message_wrap');
    var items  = [];

    for (var i = 1; i < blocks.length; i++) {
      var block = blocks[i];
      if (block.indexOf('datetime="' + isoDate) === -1) continue;

      // Прямая ссылка на пост
      var postIdMatch = block.match(/data-post="([^"]+)"/);
      var postUrl = postIdMatch
        ? 'https://t.me/' + postIdMatch[1]
        : 'https://t.me/' + channelName;

      var textMatch = block.match(/class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/);
      if (!textMatch) continue;

      var text = rmgCleanHtml(textMatch[1]);
      text = text.replace(/https?:\/\/\S+/gi, '').replace(/\s+/g, ' ').trim();
      if (text.length < 15) continue;

      items.push({ text: text.substring(0, 400), url: postUrl, source: 'Telegram' });
    }
    return items;
  } catch (e) {
    Logger.log('TG error [' + channelName + ']: ' + e.toString());
    return [];
  }
}

// ============================================================
// МОНИТОРИНГ САЙТОВ — RSS
// ============================================================

function rmgCheckSiteRSS(baseUrl, isoDate) {
  var paths = ['/rss', '/feed', '/feed.xml'];

  for (var i = 0; i < paths.length; i++) {
    try {
      var resp = UrlFetchApp.fetch(baseUrl + paths[i], {
        muteHttpExceptions: true,
        followRedirects: true,
        deadline: 4,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (resp.getResponseCode() !== 200) continue;

      var xml = resp.getContentText();
      if (!xml || xml.indexOf('<') !== 0) continue;

      var entries = xml.match(/<item>([\s\S]*?)<\/item>/gi) ||
                    xml.match(/<entry>([\s\S]*?)<\/entry>/gi) || [];
      if (entries.length === 0) continue;

      var results = [];
      entries.forEach(function(entry) {
        var dateMatch = entry.match(/<pubDate>([\s\S]*?)<\/pubDate>/) ||
                        entry.match(/<updated>([\s\S]*?)<\/updated>/);
        if (!dateMatch) return;
        var pubDate = '';
        try { pubDate = Utilities.formatDate(new Date(dateMatch[1].trim()), 'Europe/Moscow', 'yyyy-MM-dd'); }
        catch(e) { return; }
        if (pubDate !== isoDate) return;

        var titleMatch = entry.match(/<title[^>]*>([\s\S]*?)<\/title>/);
        var linkMatch  = entry.match(/<link[^>]*>([\s\S]*?)<\/link>/) ||
                         entry.match(/<link[^>]+href="([^"]+)"/);
        if (!titleMatch) return;

        var title = titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim();
        var link  = linkMatch ? linkMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : baseUrl;
        if (title.length > 10) results.push({ text: title, url: link, source: 'Сайт (RSS)' });
      });

      if (results.length > 0) return results;
    } catch (e) { /* пробуем следующий путь */ }
  }
  return [];
}

// ============================================================
// МОНИТОРИНГ САЙТОВ — HTML (ищем датированные ссылки)
// ============================================================

function rmgCheckSiteHTML(baseUrl, newsPath, isoDate) {
  try {
    var resp = UrlFetchApp.fetch(baseUrl + (newsPath || '/'), {
      muteHttpExceptions: true,
      followRedirects: true,
      deadline: 6,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' }
    });
    if (resp.getResponseCode() !== 200) return [];

    var html = resp.getContentText();
    html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<style[\s\S]*?<\/style>/gi, '');

    var results = [];

    // Метод 1: <time datetime="YYYY-MM-DD">
    var timeRe = new RegExp('<time[^>]+datetime="' + isoDate + '[^"]*"', 'gi');
    var m;
    while ((m = timeRe.exec(html)) !== null) {
      var before     = html.substring(Math.max(0, m.index - 2000), m.index);
      var hMatch     = before.match(/<(?:h[1-4]|a)[^>]*>([\s\S]*?)<\/(?:h[1-4]|a)>(?:(?!<(?:h[1-4]|a)).)*$/i);
      var lnkMatch   = before.match(/href="([^"]+)"[^>]*>[^<]*$/i);
      if (hMatch) {
        var text = rmgCleanHtml(hMatch[0]);
        if (text.length > 15 && !rmgLooksLikeCode(text)) {
          var postUrl = lnkMatch && lnkMatch[1].indexOf('http') === 0 ? lnkMatch[1] : baseUrl;
          results.push({ text: text.substring(0, 300), url: postUrl, source: 'Сайт' });
        }
      }
    }

    // Метод 2: ссылки с датой в URL (/2026/05/ или /2026-05-)
    if (results.length === 0) {
      var yearSlash = isoDate.substring(0, 4) + '\\/' + isoDate.substring(5, 7);
      var yearDash  = isoDate.substring(0, 7); // "2026-05"
      var linkRe    = new RegExp(
        '<a\\s+[^>]*href="([^"]*(?:' + yearSlash + '|' + yearDash + ')[^"]*)"[^>]*>([\\s\\S]*?)<\\/a>', 'gi'
      );
      var lm;
      while ((lm = linkRe.exec(html)) !== null) {
        var linkText = rmgCleanHtml(lm[2]);
        var words    = linkText.trim().split(/\s+/).length;
        if (linkText.length > 20 && words >= 4 && !rmgLooksLikeCode(linkText)) {
          var fullUrl = lm[1].indexOf('http') === 0 ? lm[1] : baseUrl + lm[1];
          results.push({ text: linkText.substring(0, 300), url: fullUrl, source: 'Сайт' });
        }
      }
    }

    // Убираем дубли
    var unique = [];
    results.forEach(function(r) {
      if (!unique.some(function(u) { return u.url === r.url || u.text === r.text; })) unique.push(r);
    });
    return unique.slice(0, 5);

  } catch (e) {
    Logger.log('Site HTML error [' + baseUrl + ']: ' + e.toString());
    return [];
  }
}

// ============================================================
// AI-САММАРИ ЧЕРЕЗ DEEPSEEK
// ============================================================

function rmgSummarizeWithAI(competitorName, items) {
  if (!items || items.length === 0) return null;

  var rawText = items.map(function(it, idx) {
    return (idx + 1) + '. [' + it.source + '] ' + it.text;
  }).join('\n');

  try {
    var prompt =
      'Ты аналитик конкурентной разведки для кадрового агентства RM Group (аутстаффинг, подбор линейного персонала).\n' +
      'Напиши 1-2 предложения — краткое саммари о свежей активности компании "' + competitorName + '".\n\n' +
      'Данные за вчерашний день:\n' + rawText + '\n\n' +
      'Правила:\n' +
      '- Только факты из данных, на русском, без воды\n' +
      '- Выдели важное: новые услуги, акции, партнёрства, вакансии, изменения позиционирования\n' +
      '- Если данные — технический мусор, навигация или шаблонный контент — напиши "Активности не выявлено"\n' +
      '- Не добавляй ничего от себя';

    var response = UrlFetchApp.fetch('https://api.deepseek.com/v1/chat/completions', {
      method:      'post',
      contentType: 'application/json',
      headers:     { 'Authorization': 'Bearer ' + RMG_CONFIG.DEEPSEEK_KEY },
      payload:     JSON.stringify({
        model:       'deepseek-chat',
        messages:    [{ role: 'user', content: prompt }],
        max_tokens:  200,
        temperature: 0.2
      }),
      muteHttpExceptions: true
    });

    var result = JSON.parse(response.getContentText());
    if (result.choices && result.choices[0]) return result.choices[0].message.content.trim();
    return null;
  } catch (e) {
    Logger.log('DeepSeek error: ' + e.toString());
    return null;
  }
}

// ============================================================
// ЗАПИСЬ В ТАБЛИЦУ
// ============================================================

function rmgWriteToSheet(sheet, nameToRow, compName, dateStr, summary, sourceLinks) {
  var row = nameToRow[compName];
  if (!row) return;

  var cellJ    = sheet.getRange(row, 10);
  var existing = cellJ.getValue() || '';
  var marker   = '📅 ' + dateStr;
  var body     = summary + (sourceLinks.length > 0 ? '\n📎 ' + sourceLinks.join(' | ') : '');
  var entry    = marker + '\n' + body;

  var newValue = entry; // всегда храним только последнюю запись

  cellJ.setValue(newValue);
  cellJ.setWrap(true);
  cellJ.setVerticalAlignment('top');
  cellJ.setFontFamily('Arial');
  cellJ.setFontSize(10);
}

// ============================================================
// ОСНОВНОЙ МОНИТОРИНГ — запускается в 6:00 МСК
// ============================================================

function rmgRunDailyMonitoring() {
  var dateStr = rmgGetDateStr(-1);
  var isoDate = rmgGetISODate(-1);

  Logger.log('=== RM Group мониторинг за ' + dateStr + ' ===');

  var ss      = SpreadsheetApp.openById(RMG_CONFIG.SPREADSHEET_ID);
  var sheet   = ss.getSheets().find(function(s) { return s.getSheetId() == RMG_CONFIG.SHEET_GID; })
                || ss.getActiveSheet();
  var lastRow = sheet.getLastRow();

  var nameToRow = {};
  for (var r = 2; r <= lastRow; r++) {
    var v = sheet.getRange(r, 2).getValue();
    if (v) nameToRow[v] = r;
  }

  RMG_COMPETITORS.forEach(function(comp) {
    var items = [];

    // Telegram (основной канал)
    if (comp.telegram) {
      items = items.concat(rmgCheckTelegram(comp.telegram, isoDate));
      Utilities.sleep(300);
    }
    // Telegram (второй канал, если есть)
    if (comp.telegram2) {
      items = items.concat(rmgCheckTelegram(comp.telegram2, isoDate));
      Utilities.sleep(300);
    }

    // Сайт: сначала RSS, потом HTML
    if (comp.site) {
      var rss = rmgCheckSiteRSS(comp.site, isoDate);
      items   = items.concat(rss.length > 0 ? rss : rmgCheckSiteHTML(comp.site, comp.newsPath, isoDate));
      Utilities.sleep(300);
    }

    // Убираем дубли по URL
    var seen   = {};
    var unique = items.filter(function(it) {
      if (seen[it.url]) return false;
      seen[it.url] = true;
      return true;
    });

    var summary, sourceLinks;
    if (unique.length === 0) {
      summary     = 'Активности не выявлено';
      sourceLinks = [];
    } else {
      var ai  = rmgSummarizeWithAI(comp.name, unique);
      summary = ai || 'Активности не выявлено';
      sourceLinks = summary !== 'Активности не выявлено'
        ? unique.map(function(it) { return it.url; }).slice(0, 3)
        : [];
      Utilities.sleep(400);
    }

    Logger.log(comp.name + ': ' + summary);
    rmgWriteToSheet(sheet, nameToRow, comp.name, dateStr, summary, sourceLinks);
  });

  SpreadsheetApp.flush();
  Logger.log('=== Мониторинг завершён ===');
}

// ============================================================
// ОТПРАВКА ОТЧЁТА В TELEGRAM — запускается в 8:00 МСК
// ============================================================

function rmgSendDailyTelegramReport() {
  var ss        = SpreadsheetApp.openById(RMG_CONFIG.SPREADSHEET_ID);
  var sheet     = ss.getSheets().find(function(s) { return s.getSheetId() == RMG_CONFIG.SHEET_GID; })
                  || ss.getActiveSheet();
  var yesterday = rmgGetDateStr(-1);
  var today     = rmgGetDateStr(0);
  var lastRow   = sheet.getLastRow();
  var active = [];

  for (var r = 2; r <= lastRow; r++) {
    var name   = sheet.getRange(r, 2).getValue();
    var update = sheet.getRange(r, 10).getValue() || '';
    if (!name || update.indexOf(yesterday) === -1) continue;

    var todayEntry = null;
    update.split('\n\n').forEach(function(e) {
      if (e.trim().indexOf('📅 ' + yesterday) === 0) todayEntry = e.trim();
    });
    if (!todayEntry || todayEntry.indexOf('не выявлено') !== -1) continue;

    var lines     = todayEntry.split('\n');
    var summary   = lines.slice(1).filter(function(l) { return l.indexOf('📎') !== 0; }).join(' ').trim();
    var linksLine = lines.find(function(l) { return l.indexOf('📎') === 0; }) || '';
    var linksHtml = '';
    if (linksLine) {
      var urls  = linksLine.replace('📎 ', '').split(' | ');
      linksHtml = '\n' + urls.map(function(u, i) {
        return '<a href="' + u + '">[' + (i + 1) + ']</a>';
      }).join(' ');
    }

    active.push('🔴 <b>' + name + '</b>\n' + summary + linksHtml);
  }

  var text = '📊 <b>Конкуренты RM Group</b> — ' + yesterday + '\n';
  text += '(отчёт от ' + today + ')\n\n';

  if (active.length > 0) {
    text += active.join('\n\n') + '\n\n';
  } else {
    text += '⚪ Активности у конкурентов не выявлено\n\n';
  }

  text += '📋 <a href="https://docs.google.com/spreadsheets/d/' + RMG_CONFIG.SPREADSHEET_ID + '">Открыть таблицу</a>';

  var url = 'https://api.telegram.org/bot' + RMG_CONFIG.TELEGRAM_TOKEN + '/sendMessage';
  RMG_CONFIG.RECIPIENTS.forEach(function(chatId) {
    UrlFetchApp.fetch(url, {
      method:      'post',
      contentType: 'application/json',
      payload:     JSON.stringify({
        chat_id:                  chatId,
        text:                     text,
        parse_mode:               'HTML',
        disable_web_page_preview: true
      })
    });
  });

  Logger.log('Отчёт отправлен за ' + yesterday);
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
    .timeBased().everyDays(1).atHour(6).inTimezone('Europe/Moscow').create();
  ScriptApp.newTrigger('rmgSendDailyTelegramReport')
    .timeBased().everyDays(1).atHour(8).inTimezone('Europe/Moscow').create();
  Logger.log('Триггеры: мониторинг 6:00, отчёт 8:00 МСК');
}

// ============================================================
// ПЕРВОНАЧАЛЬНАЯ НАСТРОЙКА ТАБЛИЦЫ — запустить ОДИН РАЗ
// ============================================================

function rmgSetupSheet() {
  var ss    = SpreadsheetApp.openById(RMG_CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheets().find(function(s) { return s.getSheetId() == RMG_CONFIG.SHEET_GID; })
              || ss.getActiveSheet();

  var headers = ['#', 'Компания', 'Сайт', 'Telegram', 'Статус', 'Город', 'Примечание', '', '', 'Мониторинг (авто)'];
  var hr = sheet.getRange(1, 1, 1, headers.length);
  hr.setValues([headers]);
  hr.setBackground('#1A1A2E').setFontColor('#FFFFFF').setFontFamily('Arial')
    .setFontSize(10).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(1, 36);

  var data = [
    [1,  'АКМЭ',                 'akmeservices.ru',  '',                    'Активен',  'Москва', ''],
    [2,  'Алгоритм 24',          'algorithm24.ru',   't.me/algorithm_24',   'Активен',  'Москва', ''],
    [3,  'Константа',            '',                 '',                    'Уточнить', '',       'Соцсети/сайт не найдены'],
    [4,  'Solution Pro',         's-pro.group',      '',                    'Активен',  'Москва', ''],
    [5,  'Qwell',                'qwell.ru',         '',                    'Активен',  'Москва', ''],
    [6,  'Mass Staff',           'massstaff.ru',     't.me/Mass_Staff',     'Активен',  'Москва', ''],
    [7,  'Leader Team',          'leaderteam.ru',    't.me/leaderteamclub', 'Активен',  'Москва', ''],
    [8,  'Эксцельсиор',         'exc.ltd',           't.me/excltd',         'Активен',  'Москва', ''],
    [9,  'Рабочие руки',        'russian.works',     't.me/rabrukirus',     'Активен',  'Москва', '2-й TG: handswork_team'],
    [10, 'Ситистафф',           'citystaff.ru',      't.me/citystaff_msk',  'Активен',  'Москва', ''],
    [11, 'Ventra',               'ventra.ru',        't.me/ventrago',       'Активен',  'Москва', ''],
    [12, 'Два колеса',           '2klmsk.ru',        't.me/spartanci_ru',   'Активен',  'Москва', ''],
    [13, 'Работа — это просто', 'msto.ru',           '',                    'Активен',  'Москва', '']
  ];

  for (var i = 0; i < data.length; i++) {
    var row = i + 2;
    sheet.getRange(row, 1, 1, 7).setValues([data[i]]);
    sheet.getRange(row, 1, 1, 10).setBackground(i % 2 === 0 ? '#F8F9FA' : '#FFFFFF');
    if (data[i][4] === 'Уточнить') sheet.getRange(row, 5).setBackground('#FFF3CD');
  }

  sheet.setColumnWidth(1,  40);
  sheet.setColumnWidth(2,  180);
  sheet.setColumnWidth(3,  160);
  sheet.setColumnWidth(4,  180);
  sheet.setColumnWidth(5,  90);
  sheet.setColumnWidth(6,  100);
  sheet.setColumnWidth(7,  180);
  sheet.setColumnWidth(10, 380);
  sheet.setFrozenRows(1);

  sheet.getRange(1, 10).setValue('Мониторинг (авто)').setBackground('#1A1A2E').setFontColor('#FFFFFF');
  Logger.log('Таблица настроена');
}

// ============================================================
// ТЕСТОВЫЕ ФУНКЦИИ
// ============================================================

function rmgTestMonitoring()  { rmgRunDailyMonitoring(); }
function rmgTestReport()      { rmgSendDailyTelegramReport(); }

// Проверить одного конкурента — смотреть в логах Apps Script
function rmgTestOneCompetitor() {
  var isoDate = rmgGetISODate(-1);
  var comp    = RMG_COMPETITORS.find(function(c) { return c.name === 'Mass Staff'; });
  if (!comp) { Logger.log('Конкурент не найден'); return; }

  Logger.log('=== Тест: ' + comp.name + ' ===');
  if (comp.telegram) Logger.log('TG: ' + JSON.stringify(rmgCheckTelegram(comp.telegram, isoDate)));
  if (comp.site) {
    var rss = rmgCheckSiteRSS(comp.site, isoDate);
    Logger.log('RSS: ' + JSON.stringify(rss));
    if (rss.length === 0) Logger.log('HTML: ' + JSON.stringify(rmgCheckSiteHTML(comp.site, comp.newsPath, isoDate)));
  }
}