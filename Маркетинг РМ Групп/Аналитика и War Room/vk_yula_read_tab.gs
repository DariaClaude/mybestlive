/**
 * ВК + Юла — War Room READ Tab
 * ─────────────────────────────────────────────────────────────
 * Создаёт / обновляет лист READ на ПЕРВОЙ позиции.
 * Считает лиды ВК и Юла за последние 10 дней.
 *
 * КАК УСТАНОВИТЬ:
 *   1. Открыть таблицу ВК/Юла:
 *      https://docs.google.com/spreadsheets/d/1Bmn-LhC_QFnRW_84O1vexJkgMlRm1uQV7wNTJ-WD9Mo
 *   2. Расширения → Apps Script
 *   3. Вставить этот код целиком, нажать "Сохранить"
 *   4. Выбрать функцию updateReadTabVK → нажать "Выполнить"
 *   5. Разрешить доступ к таблице (один раз)
 *
 * КАК ИСПОЛЬЗОВАТЬ КАЖДУЮ НЕДЕЛЮ:
 *   • Запустить функцию в начале обновления War Room.
 *   • READ появится первой вкладкой с итоговыми цифрами ВК / Юла.
 *   • Claude прочитает READ через MCP и сразу возьмёт актуальные данные.
 */

function updateReadTabVK() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Найти лист с лидами (ищем заголовок: Источник/Канал + Дата)
  var leadsSheet = findLeadsSheet(ss);
  if (!leadsSheet) {
    Browser.msgBox('❌ Лист с лидами не найден.\n\nУбедитесь, что на одном из листов есть колонки "Источник" (или "Канал") и "Дата".');
    return;
  }

  Logger.log('Читаем лиды из листа: ' + leadsSheet.getName());

  var data = leadsSheet.getDataRange().getValues();
  var headers = data[0];

  // 2. Найти индексы колонок
  var sourceCol = -1, dateCol = -1;
  for (var c = 0; c < headers.length; c++) {
    var h = String(headers[c]).toLowerCase().trim();
    if (h.indexOf('источник') !== -1 || h.indexOf('канал') !== -1 || h === 'channel') sourceCol = c;
    if (h.indexOf('дата') !== -1 || h === 'date') dateCol = c;
  }

  if (sourceCol === -1 || dateCol === -1) {
    var found = [];
    for (var c = 0; c < headers.length; c++) {
      if (headers[c]) found.push('"' + headers[c] + '"');
    }
    Browser.msgBox('❌ Нужные колонки не найдены.\n\nНайденные заголовки: ' + found.join(', '));
    return;
  }

  // 3. Посчитать лиды за последние 10 дней
  var today = new Date();
  var cutoff = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000);
  var currentYear = today.getFullYear();

  var vkCount = 0, yulaCount = 0, unknownCount = 0;
  var recentLeads = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var dateVal = row[dateCol];
    if (!dateVal) continue;

    // Парсим дату
    var leadDate = null;
    if (dateVal instanceof Date) {
      leadDate = dateVal;
    } else {
      var dateStr = String(dateVal).trim();
      var parts = dateStr.split('.');
      if (parts.length >= 2) {
        var d = parseInt(parts[0]);
        var m = parseInt(parts[1]) - 1;
        var y = parts.length >= 3 ? parseInt(parts[2]) : currentYear;
        if (y < 100) y += 2000;
        leadDate = new Date(y, m, d);
      }
    }

    if (!leadDate || isNaN(leadDate.getTime())) continue;

    if (leadDate >= cutoff) {
      recentLeads.push(row);
      var src = String(row[sourceCol]).trim().toLowerCase();

      if (src.indexOf('вк') !== -1 || src.indexOf('вконтакте') !== -1 || src === 'vk') {
        vkCount++;
      } else if (src.indexOf('юла') !== -1 || src.indexOf('yula') !== -1) {
        yulaCount++;
      } else if (src.indexOf('авито') !== -1 || src.indexOf('avito') !== -1) {
        yulaCount++; // Авито-объявления → Юла
      } else {
        unknownCount++;
      }
    }
  }

  var total = vkCount + yulaCount + unknownCount;

  // 4. Получить или создать READ
  var readSheet = ss.getSheetByName('READ');
  if (!readSheet) {
    readSheet = ss.insertSheet('READ', 0);
  } else {
    readSheet.clear();
  }

  // 5. Записать сводку
  var nowStr = Utilities.formatDate(today, 'Europe/Moscow', 'dd.MM.yyyy HH:mm');
  var cutoffStr = Utilities.formatDate(cutoff, 'Europe/Moscow', 'dd.MM.yyyy');

  var summary = [
    ['=== ВК + Юла: лиды за последние 10 дней ===', ''],
    ['Обновлено', nowStr],
    ['Период', cutoffStr + ' — ' + Utilities.formatDate(today, 'Europe/Moscow', 'dd.MM.yyyy')],
    ['', ''],
    ['Канал', 'Лиды'],
    ['ВК',     vkCount],
    ['Юла',    yulaCount],
    ['Прочие', unknownCount],
    ['ИТОГО',  total],
    ['', ''],
    ['--- Список лидов ---', '']
  ];

  readSheet.getRange(1, 1, summary.length, 2).setValues(summary);

  // Список лидов
  if (recentLeads.length > 0) {
    readSheet.getRange(summary.length + 1, 1, 1, headers.length).setValues([headers]);
    readSheet.getRange(summary.length + 2, 1, recentLeads.length, headers.length).setValues(recentLeads);
  }

  // 6. READ → первая позиция
  ss.setActiveSheet(readSheet);
  ss.moveActiveSheet(1);

  Browser.msgBox(
    '✅ ВК: ' + vkCount + ' | Юла: ' + yulaCount + (unknownCount > 0 ? ' | Прочие: ' + unknownCount : '') +
    '\nИтого: ' + total + ' лидов за последние 10 дней\n\n' +
    'READ перемещён на первую вкладку.\nTeперь Claude прочитает данные автоматически.'
  );
}

/**
 * Найти лист с лидами: ищем заголовки "Источник"/"Канал" + "Дата"
 */
function findLeadsSheet(ss) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var name = sheets[i].getName();
    if (name === 'READ') continue;

    var firstRow = sheets[i].getRange(1, 1, 1, 20).getValues()[0];
    var rowStr = firstRow.join(' ').toLowerCase();

    if ((rowStr.indexOf('источник') !== -1 || rowStr.indexOf('канал') !== -1) &&
        rowStr.indexOf('дата') !== -1) {
      return sheets[i];
    }
  }
  return null;
}
