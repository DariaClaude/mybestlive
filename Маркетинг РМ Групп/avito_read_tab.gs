/**
 * АВИТО — War Room READ Tab
 * ─────────────────────────────────────────────────────────────
 * Создаёт / обновляет лист READ на ПЕРВОЙ позиции.
 * Копирует в него данные текущей недели (последний период по дате).
 *
 * КАК УСТАНОВИТЬ:
 *   1. Открыть таблицу Авито:
 *      https://docs.google.com/spreadsheets/d/1D_sbEPzHKgEpiZwQwJv6cE7Ug7rcrL5RUZNS9I6ukhA
 *   2. Расширения → Apps Script
 *   3. Вставить этот код целиком, нажать "Сохранить"
 *   4. Выбрать функцию updateReadTab → нажать "Выполнить"
 *   5. Разрешить доступ к таблице (один раз)
 *
 * КАК ИСПОЛЬЗОВАТЬ КАЖДУЮ НЕДЕЛЮ:
 *   • После того как аналитик заполнил новую вкладку (вида 29.06-05.07) —
 *     запустить эту функцию. Она найдёт последнюю вкладку автоматически.
 *   • READ переедет на первую позицию.
 *   • Claude прочитает READ через MCP и заполнит War Room.
 */

function updateReadTab() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Найти лист с последним периодом
  var latestSheet = findLatestPeriodSheet(ss);
  if (!latestSheet) {
    Browser.msgBox('❌ Лист с периодом не найден.\n\nПроверьте, что вкладки называются в формате ДД.ММ-ДД.ММ\n(например: 29.06-05.07)');
    return;
  }

  // 2. Получить или создать лист READ
  var readSheet = ss.getSheetByName('READ');
  if (!readSheet) {
    readSheet = ss.insertSheet('READ', 0);
  } else {
    readSheet.clear();
  }

  // 3. Прочитать данные из листа текущего периода
  var data = latestSheet.getDataRange().getValues();

  // Проекты War Room (Инвентаризация и Курьеры — в приоритете)
  var warRoomList = [
    'Инвентаризация', 'Курьеры', 'ЛЕНТА КРД', 'ЛЕНТА КЗН', 'МАГНИТ КРД',
    'Ростикс', 'ЛЕНТА ЧЛБ', 'Лукойл', 'Пальмира'
  ];

  // Спецблоки с отдельными данными
  var specialKeywords = ['УРБАН ДИКСИ', 'ЧЛБ ОБ', 'КЗН ОБ'];

  var output = [];

  // Строка-заголовок
  output.push(['=== Авито War Room: ' + latestSheet.getName() + ' ===', '', '', '', '', '', '', '', '', '']);

  // Найти строку с заголовками колонок (содержит "Регион" или "план"/"факт")
  var headerRowIdx = -1;
  for (var i = 0; i < Math.min(15, data.length); i++) {
    var joined = data[i].join(' ').toLowerCase();
    if (joined.indexOf('регион') !== -1 || (joined.indexOf('план') !== -1 && joined.indexOf('факт') !== -1)) {
      headerRowIdx = i;
      break;
    }
  }

  if (headerRowIdx >= 0) {
    output.push(data[headerRowIdx]);
    if (headerRowIdx + 1 < data.length) {
      output.push(data[headerRowIdx + 1]); // подзаголовок (план/факт)
    }
  }

  // Найти строки War Room проектов
  var addedProjects = {};
  for (var w = 0; w < warRoomList.length; w++) {
    var keyword = warRoomList[w].toLowerCase();
    for (var i = 0; i < data.length; i++) {
      var cell = String(data[i][0]).trim().toLowerCase();
      if (cell.indexOf(keyword) !== -1 && !addedProjects[cell]) {
        // Проверить, что строка содержит данные (не пустая)
        var hasData = false;
        for (var c = 1; c < data[i].length; c++) {
          var v = data[i][c];
          if (v !== '' && v !== null && v !== undefined && v !== 0) {
            hasData = true;
            break;
          }
        }
        if (hasData) {
          output.push(data[i]);
          addedProjects[cell] = true;
          break;
        }
      }
    }
  }

  // Разделитель
  output.push(['', '', '', '', '', '', '', '', '', '']);
  output.push(['=== Спецобъекты ===', '', '', '', '', '', '', '', '', '']);

  // Найти блоки УРБАН ДИКСИ, ЧЛБ ОБ, КЗН ОБ
  var specialAdded = {};
  for (var i = 0; i < data.length; i++) {
    var rowStr = data[i].join(' ');
    for (var s = 0; s < specialKeywords.length; s++) {
      if (rowStr.indexOf(specialKeywords[s]) !== -1 && !specialAdded[specialKeywords[s]]) {
        output.push(data[i]);
        // Добавить следующие 4 строки (данные блока)
        for (var next = 1; next <= 4 && (i + next) < data.length; next++) {
          var nextRow = data[i + next];
          if (nextRow.join('').trim() !== '') {
            output.push(nextRow);
          }
        }
        output.push(['', '', '', '', '', '', '', '', '', '']);
        specialAdded[specialKeywords[s]] = true;
        break;
      }
    }
  }

  // 4. Записать output в READ
  if (output.length > 0) {
    var numCols = 0;
    for (var r = 0; r < output.length; r++) {
      if (output[r].length > numCols) numCols = output[r].length;
    }
    for (var r = 0; r < output.length; r++) {
      while (output[r].length < numCols) output[r].push('');
    }
    readSheet.getRange(1, 1, output.length, numCols).setValues(output);
  }

  // 5. READ → первая позиция
  ss.setActiveSheet(readSheet);
  ss.moveActiveSheet(1);

  Browser.msgBox('✅ READ обновлён из листа: ' + latestSheet.getName() + '\nСтрок: ' + output.length + '\n\nТеперь Claude прочитает данные автоматически.');
}

/**
 * Найти лист с наибольшей (последней) датой начала периода.
 * Ожидаемый формат названия вкладки: ДД.ММ-ДД.ММ (например, 29.06-05.07)
 */
function findLatestPeriodSheet(ss) {
  var sheets = ss.getSheets();
  var latestDate = null;
  var latestSheet = null;
  var today = new Date();
  var currentYear = today.getFullYear();

  for (var i = 0; i < sheets.length; i++) {
    var name = sheets[i].getName().trim();
    if (name === 'READ') continue;

    // Парсим дату начала периода: ДД.ММ в начале названия
    var match = name.match(/^(\d{1,2})\.(\d{2})/);
    if (match) {
      var day = parseInt(match[1]);
      var month = parseInt(match[2]) - 1; // 0-based
      var sheetDate = new Date(currentYear, month, day);

      if (!latestDate || sheetDate > latestDate) {
        latestDate = sheetDate;
        latestSheet = sheets[i];
      }
    }
  }

  return latestSheet;
}
