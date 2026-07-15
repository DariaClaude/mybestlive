/**
 * Создаёт вкладку "Май 2026" в таблице "Соцсети конкурентов АПРЕЛЬ / LUIS+"
 * Запустить один раз из редактора Apps Script → Run → createMaySheet
 */
function createMaySheet() {
  var ss = SpreadsheetApp.openById('1oPpimp0DoHNmd6cTjBdrHeM2tb-0OsAbEhaGF9Xhmg4');

  // Удалить старую версию листа, если есть
  var existing = ss.getSheetByName('Май 2026');
  if (existing) ss.deleteSheet(existing);

  var sheet = ss.insertSheet('Май 2026');

  // ── ШИРИНЫ КОЛОНОК ─────────────────────────────────
  var colWidths = [40, 160, 140, 140, 100, 130, 100, 130, 100, 130, 100, 140, 380, 220];
  colWidths.forEach(function(w, i) { sheet.setColumnWidth(i + 1, w); });

  // ── ШАПКА ─────────────────────────────────────────
  var headers = [
    '№', 'Конкурент', 'Сайт', 'Telegram',
    'Посты TG май', 'ВКонтакте', 'Посты VK май',
    'YouTube', 'Видео май', 'Другие соцсети',
    'Всего постов май', 'Уровень активности',
    'Ключевые темы мая', 'Упоминание Securika 2026'
  ];

  var hRange = sheet.getRange(1, 1, 1, headers.length);
  hRange.setValues([headers]);
  hRange.setBackground('#1a1a1a');
  hRange.setFontColor('#ffffff');
  hRange.setFontWeight('bold');
  hRange.setFontSize(10);
  hRange.setHorizontalAlignment('center');
  hRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 36);

  // ── ДАННЫЕ — 22 КОНКУРЕНТА ─────────────────────────
  // Колонки: №, Конкурент, Сайт, Telegram, PostsTG, VK, PostsVK,
  //          YouTube, VideoMay, Другие, Всего, Уровень, Темы, Securika
  var data = [
    [1,  'Аргус-Спектр',    'argus-spectr.ru',   '@argus_spectr',
      '~15+', '—', '—', 'StreletzTV', 'Есть', '—', '15+', 'Высокий',
      'Продолжение серии StreletzGPT (ИИ-ассистент); Deco Line — дизайнерская противопожарная продукция; Стрелец-V-ПРО; вебинары по СП 3.13130.2026 и СП 6.13130; итоги участия в Securika (сайт)',
      'Нет (пост-выставочный период)'],

    [2,  'Рубеж (RUBEZH)',   'rubezh.pro',         '@rmc_rubezh',
      '~12', 'vk.com/vpk.rubezh', 'Есть', 'RUBEZH YouTube', 'Есть', 'МАКС', '12+', 'Высокий',
      'Запуск официального канала на платформе МАКС (1 780 просм.) — первый из профильных конкурентов; продолжение серии вебинаров СП 3.13130.2026, СП 6.13130; обновления R-PLATFORMA; обучение по городам',
      'Нет'],

    [3,  'Болид (НВП)',      'bolid.ru',           '@bolid_nvp',
      '~5', '—', '—', 'НВП Болид YouTube', 'Есть', '—', '5+', 'Средний',
      'Итоги Securika 2026: 2 500+ гостей на стенде (28 апр.); семинары по нормам СПЗ; цифровая маркировка «Честный знак»; обновление АРМ «Орион Икс» v1.2.0',
      'Нет (итоги опубл. конец апреля)'],

    [4,  'ДССЛ / TRASSIR',  'dssl.ru',            '@trassir (закрытый)',
      '—', '—', '—', '—', '—', '—', '—', 'Низкий',
      'Технические обновления сайта: TRASSIR Pro v3; PoE-коммутаторы L3; мониторы ECO/PRO — продуктовые релизы без медиа-активности',
      'Нет'],

    [5,  'ISS',              'iss.ru',             '@iss_ru',
      '2', '—', '—', 'ISS YouTube', 'Есть', '—', '2', 'Низкий',
      'SecurOS включён в реестр Минпромторга РФ (573 просм.) — ключевой аргумент для КИИ и госсектора; новый релиз SecurOS 12.1 (558 просм.) — обновление платформы с новой аналитикой',
      'Нет'],

    [6,  'Layta',            'layta.ru',           'Не найден',
      '—', '—', '—', '—', '—', '—', '0', 'Нет',
      'Публичной активности не выявлено', 'Нет'],

    [7,  'МСБ',              '—',                  '—',
      '—', '—', '—', '—', '—', '—', '0', 'Нет',
      'Публичной активности не выявлено', 'Нет'],

    [8,  'Parsec',           'parsec.ru',          '—',
      '—', '—', '—', 'Parsec Academy', '—', 'МАКС', '0', 'Низкий',
      'Parsec запустил резервный канал в МАКС (апрель); технические публикации на сайте; новых постов в мае не выявлено',
      'Нет'],

    [9,  'Эридан',           'eridan.ru',          'Не найден',
      '—', '—', '—', '—', '—', '—', '0', 'Нет',
      'Публичной активности не выявлено', 'Нет'],

    [10, 'ЭТМ',              'etm.ru',             '@etm_company',
      '4+', 'Есть', 'Есть', '—', '—', 'Facebook', '5+', 'Активен',
      'Стабильная контент-активность: электрооборудование, акции, вебинары; профильной тематики пожарной безопасности нет',
      'Нет'],

    [11, 'Русский Свет',     'russvet.ru',         '@russvet_official',
      '4+', '—', '—', '—', '—', 'Instagram', '4+', 'Средний',
      'Акции и спецпредложения; форумы по электромонтажу; региональные мероприятия',
      'Нет'],

    [12, 'Tinko',            'tinko.ru',           'Не найден',
      '—', '—', '—', '—', '—', 'Facebook', '0', 'Нет',
      'Публичной активности не выявлено', 'Нет'],

    [13, 'САТРО-ПАЛАДИН',   'satro-paladin.com',  'Не найден',
      '—', '—', '—', '—', '—', '—', '0', 'Нет',
      'Публичной активности не выявлено', 'Нет'],

    [14, 'ТК РУТЕК',         'rutek-group.ru',     'Не найден',
      '—', '—', '—', '—', '—', '—', '0', 'Нет',
      'Публичной активности не выявлено', 'Нет'],

    [15, 'ДЕАН',             'dean.ru',            'Не найден',
      '—', '—', '—', '—', '—', '—', '0', 'Нет',
      'Публичной активности не выявлено', 'Нет'],

    [16, 'ГАРАНТ (ТД)',      'garantgroup.com',    'Не найден',
      '—', '—', '—', '—', '—', '—', '0', 'Нет',
      'Публичной активности не выявлено', 'Нет'],

    [17, 'Hikvision',        'hikvision.ru',       '@hikvisionrussia (мёртв с 2022)',
      '0', '—', '—', '—', '—', '—', '0', 'Нет',
      'Ушли с рынка РФ. Активности нет', 'Нет'],

    [18, 'Macroscop',        'macroscop.com',      'Не найден',
      '—', '—', '—', 'MACROSCOP YouTube', '—', '—', '0', 'Низкий',
      'Macroscop 4.4 — новая версия с интеграциями Sigur, аналитикой СИЗ; публикации на сайте партнёров',
      'Нет'],

    [19, 'Твинпро',          'twinpro.ru',         'Не найден',
      '—', '—', '—', '—', '—', '—', '0', 'Нет',
      'Публичной активности не выявлено', 'Нет'],

    [20, 'WAGNER',           'wagner-alarm.de',    'Не найден',
      '—', '—', '—', '—', '—', '—', '0', 'Нет',
      'Активности в РФ нет', 'Нет'],

    [21, 'DKC',              'dkc.ru',             '@dkccom',
      '~6', '—', '—', '—', '—', '—', '6+', 'Активен',
      'Клеммы Nuputuk — сертификаты пожарной безопасности (2 060 просм.); щитки Frame × Петрович — партнёрское видео B2C-дистрибьютора (1 880 просм.); продуктовые вебинары; конвенция дилеров',
      'Нет'],

    [22, 'IEK GROUP',        'iek.ru',             '@iek_group_rus',
      '~6', 'vk.com/iek_group', 'Есть', 'IEK YouTube', 'Есть', 'Dzen', '8+', 'Активен',
      'DCDE 2026 Forum — итоги участия (2 320 просм., топ-пост мая); серия вебинаров по электрике для инженерной аудитории (1 800 просм.); активен в TG + ВК + YouTube + Dzen',
      'Нет']
  ];

  var dataRange = sheet.getRange(2, 1, data.length, headers.length);
  dataRange.setValues(data);
  dataRange.setFontSize(10);
  dataRange.setVerticalAlignment('top');
  dataRange.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);

  // Чередование строк
  for (var i = 0; i < data.length; i++) {
    sheet.getRange(i + 2, 1, 1, headers.length)
      .setBackground(i % 2 === 0 ? '#ffffff' : '#f8f8f8');
  }

  // Цвет колонки "Уровень активности" (12)
  var actColors = {
    'Высокий': { bg: '#e8f5e9', fg: '#2e7d32' },
    'Средний':  { bg: '#fff8e1', fg: '#e65100' },
    'Активен':  { bg: '#e3f2fd', fg: '#1565c0' },
    'Низкий':   { bg: '#f3e5f5', fg: '#6a1b9a' },
    'Нет':      { bg: '#f5f5f5', fg: '#999999' }
  };
  for (var i = 0; i < data.length; i++) {
    var level = data[i][11];
    var c = actColors[level] || actColors['Нет'];
    var cell = sheet.getRange(i + 2, 12);
    cell.setBackground(c.bg);
    cell.setFontColor(c.fg);
    cell.setFontWeight('bold');
    cell.setHorizontalAlignment('center');
  }

  // Цвет колонки "Securika" (14)
  for (var i = 0; i < data.length; i++) {
    var sec = data[i][13];
    var cell = sheet.getRange(i + 2, 14);
    if (sec.indexOf('Да') === 0) {
      cell.setBackground('#e8f5e9').setFontColor('#2e7d32');
    } else {
      cell.setBackground('#fce4ec').setFontColor('#c62828');
    }
  }

  // Зафиксировать первую строку
  sheet.setFrozenRows(1);

  // ── РЕЙТИНГ АКТИВНОСТИ ─────────────────────────────
  var rRow = data.length + 3;

  var rt = sheet.getRange(rRow, 1, 1, 7);
  rt.merge();
  rt.setValue('РЕЙТИНГ АКТИВНОСТИ — МАЙ 2026');
  rt.setBackground('#1a1a1a').setFontColor('#ffffff').setFontWeight('bold')
    .setFontSize(11).setHorizontalAlignment('center');

  sheet.getRange(rRow + 1, 1, 1, 7)
    .setValues([['Место', 'Компания', 'Telegram', 'VK', 'YouTube', 'Другие', 'Всего']])
    .setBackground('#f0f0f0').setFontWeight('bold').setFontSize(10).setHorizontalAlignment('center');

  var rating = [
    [1, 'Аргус-Спектр',   '15+ постов', '—',    'Есть', '—',        '15+'],
    [2, 'Рубеж (RUBEZH)', '12+ постов', 'Есть', 'Есть', 'МАКС',     '12+'],
    [3, 'DKC',            '6+ постов',  '—',    '—',    '—',        '6+'],
    [4, 'IEK GROUP',      '6+ постов',  'Есть', 'Есть', 'Dzen',     '8+'],
    [5, 'ЭТМ',            '4+ постов',  'Есть', '—',    'Facebook', '5+'],
    [6, 'Русский Свет',   '4+ постов',  '—',    '—',    'Instagram','4+'],
    [7, 'Болид (НВП)',    '5 постов',   '—',    'Есть', '—',        '5+'],
    [8, 'ISS',            '2 поста',    '—',    'Есть', '—',        '2']
  ];

  var rrRange = sheet.getRange(rRow + 2, 1, rating.length, 7);
  rrRange.setValues(rating);
  rrRange.setFontSize(10).setHorizontalAlignment('center');
  for (var i = 0; i < rating.length; i++) {
    sheet.getRange(rRow + 2 + i, 1, 1, 7)
      .setBackground(i % 2 === 0 ? '#ffffff' : '#f8f8f8');
  }

  // ── ТОП ПОСТОВ ПО ОХВАТУ ───────────────────────────
  var tRow = rRow + rating.length + 4;

  var tt = sheet.getRange(tRow, 1, 1, 7);
  tt.merge();
  tt.setValue('ТОП ПОСТОВ ПО ОХВАТУ — МАЙ 2026');
  tt.setBackground('#1a1a1a').setFontColor('#ffffff').setFontWeight('bold')
    .setFontSize(11).setHorizontalAlignment('center');

  sheet.getRange(tRow + 1, 1, 1, 7)
    .setValues([['Компания', 'Платформа', 'Дата', 'Тема', 'Просмотры', 'Тематика', '★']])
    .setBackground('#f0f0f0').setFontWeight('bold').setFontSize(10).setHorizontalAlignment('center');

  var topPosts = [
    ['IEK GROUP',  'Telegram',      'Май 2026', 'DCDE 2026 Forum — итоги участия',                              '2 320', 'Событие',          '★'],
    ['DKC',        'Telegram',      'Май 2026', 'Клеммы Nuputuk — получены сертификаты пожарной безопасности',  '2 060', 'Продукт',          ''],
    ['IEK GROUP',  'Telegram',      'Май 2026', 'Серия вебинаров по электрике для инженерной аудитории',        '1 800', 'Обучение',         ''],
    ['DKC',        'Telegram',      'Май 2026', 'Партнёрское видео: щитки Frame × сеть Петрович',               '1 880', 'Коллаборация',     ''],
    ['Рубеж',      'МАКС (новый)',  'Май 2026', 'Запуск официального канала на платформе МАКС',                 '1 780', 'Новая платформа',  '★'],
    ['ISS',        'Telegram',      'Май 2026', 'SecurOS включён в реестр Минпромторга РФ',                     '573',   'Продукт / Реестр', ''],
    ['ISS',        'Telegram',      'Май 2026', 'Новый релиз SecurOS 12.1',                                     '558',   'Продукт',          '']
  ];

  var tpRange = sheet.getRange(tRow + 2, 1, topPosts.length, 7);
  tpRange.setValues(topPosts);
  tpRange.setFontSize(10).setVerticalAlignment('middle').setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);

  var viewColors = { 2000: '#e8f5e9', 1500: '#fff8e1', 1000: '#f3e5f5', 0: '#f5f5f5' };
  for (var i = 0; i < topPosts.length; i++) {
    var views = parseInt(topPosts[i][4].replace(/\s/g, ''));
    var bg = views >= 2000 ? '#e8f5e9' : views >= 1500 ? '#fff8e1' : views >= 1000 ? '#f3e5f5' : '#f5f5f5';
    sheet.getRange(tRow + 2 + i, 1, 1, 7).setBackground(bg);
    if (topPosts[i][6] === '★') {
      sheet.getRange(tRow + 2 + i, 7).setFontColor('#e65100').setFontWeight('bold').setFontSize(12);
    }
  }

  // ── ЛЕГЕНДА ПРОСМОТРОВ ─────────────────────────────
  var legRow = tRow + topPosts.length + 3;
  var legendData = [
    ['≥ 2 000 просм.', '#e8f5e9'],
    ['1 500 – 1 999',  '#fff8e1'],
    ['1 000 – 1 499',  '#f3e5f5'],
    ['< 1 000',        '#f5f5f5']
  ];
  sheet.getRange(legRow, 1, 1, 4).merge().setValue('ПРОСМОТРЫ — ЛЕГЕНДА')
    .setBackground('#f0f0f0').setFontWeight('bold').setFontSize(10).setHorizontalAlignment('center');
  legendData.forEach(function(item, i) {
    var r = sheet.getRange(legRow + 1 + i, 1, 1, 4);
    r.merge();
    r.setValue(item[0]);
    r.setBackground(item[1]);
    r.setFontSize(10);
    r.setHorizontalAlignment('center');
  });

  SpreadsheetApp.flush();
  Logger.log('✅ Лист "Май 2026" создан!');
  SpreadsheetApp.getUi().alert('✅ Вкладка «Май 2026» успешно создана!');
}
