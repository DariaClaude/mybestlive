<?php
/**
 * Пасека Ермакова — приём заявок с сайта и отправка через SMTP Яндекса.
 * PHP 8+ · PHPMailer 6.9 · без сторонних API и сервисов.
 */

declare(strict_types=1);

date_default_timezone_set('Europe/Moscow');
header('Content-Type: application/json; charset=UTF-8');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

/* ── Единый ответ клиенту ── */
function respond(bool $ok, string $message, int $code = 200): void
{
    http_response_code($code);
    echo json_encode(['success' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

/* ── 1. Только POST ── */
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(false, 'Метод не разрешён', 405);
}

/* ── 2. Honeypot от спам-ботов: поле должно оставаться пустым ── */
if (!empty($_POST['website'])) {
    // Отвечаем «успешно», чтобы бот не подбирал обход.
    respond(true, 'OK');
}

/* ── 3. Сбор и очистка полей ── */
$clean = static fn(string $v): string => trim(strip_tags($v));

$name    = isset($_POST['name'])    ? $clean((string) $_POST['name'])    : '';
$phone   = isset($_POST['phone'])   ? $clean((string) $_POST['phone'])   : '';
$product = isset($_POST['product']) ? $clean((string) $_POST['product']) : '';
$comment = isset($_POST['comment']) ? $clean((string) $_POST['comment']) : '';

/* ── 4. Обязательные поля ── */
if ($name === '' || $phone === '') {
    respond(false, 'Заполните имя и телефон', 422);
}

/* ── 5. Проверка корректности телефона: 10–15 цифр ── */
$digits = preg_replace('/\D+/', '', $phone);
if ($digits === null || strlen($digits) < 10 || strlen($digits) > 15) {
    respond(false, 'Некорректный телефон', 422);
}

/* ── 6. Метаданные заявки ── */
$dateStr = date('d.m.Y');
$timeStr = date('H:i');

$ip = $_SERVER['REMOTE_ADDR'] ?? '—';
if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
}
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '—';

/* ── 7. Тема письма: «Заявка с сайта ДД.ММ.ГГГГ ЧЧ:ММ» ── */
$subject = "Заявка с сайта {$dateStr} {$timeStr}";

/* ── 8. Экранирование для HTML-письма ── */
$e = static fn(string $s): string => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');

$rows = [
    ['👤', 'Имя клиента',     $e($name)],
    ['📞', 'Телефон',         $e($phone)],
    ['🍯', 'Что интересует',  $e($product !== '' ? $product : '—')],
    ['💬', 'Комментарий',     $comment !== '' ? nl2br($e($comment)) : '—'],
    ['📅', 'Дата отправки',   $e($dateStr)],
    ['🕐', 'Время отправки',  $e($timeStr)],
    ['🌐', 'IP посетителя',   $e($ip)],
    ['🖥', 'User-Agent',      $e($ua)],
];

$rowsHtml = '';
foreach ($rows as [$icon, $label, $value]) {
    $rowsHtml .= '
        <tr>
            <td style="padding:14px 18px;border-bottom:1px solid #F0E4CC;font-size:14px;color:#7A5C3C;font-weight:600;white-space:nowrap;vertical-align:top;width:180px;">'
                . $icon . '&nbsp; ' . $label . '</td>
            <td style="padding:14px 18px;border-bottom:1px solid #F0E4CC;font-size:15px;color:#2C1A09;vertical-align:top;">'
                . $value . '</td>
        </tr>';
}

$body = '<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#FFFCF5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFCF5;padding:28px 12px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid rgba(200,135,10,0.18);font-family:Arial,Helvetica,sans-serif;">

      <tr>
        <td style="background:linear-gradient(135deg,#C8870A,#A36A05);padding:30px 32px;">
          <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#FEF3DC;font-weight:700;">Пасека Ермакова</div>
          <div style="font-size:24px;color:#ffffff;font-weight:700;margin-top:6px;">🐝 Новая заявка с сайта</div>
        </td>
      </tr>

      <tr>
        <td style="padding:24px 32px 8px;">
          <p style="margin:0 0 4px;font-size:15px;color:#3D2410;">Поступила новая заявка от клиента:</p>
        </td>
      </tr>

      <tr>
        <td style="padding:8px 24px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFDF8;border:1px solid #F0E4CC;border-radius:12px;overflow:hidden;">'
            . $rowsHtml . '
          </table>
        </td>
      </tr>

      <tr>
        <td style="background:#160D03;padding:20px 32px;text-align:center;">
          <div style="font-size:13px;color:rgba(255,255,255,0.55);">Письмо сформировано автоматически сайтом Пасеки Ермакова</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.30);margin-top:4px;">' . $e($dateStr) . ' · ' . $e($timeStr) . '</div>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>';

/* ── 9. Текстовая версия письма ── */
$altBody =
    "Новая заявка с сайта\n" .
    "Имя: {$name}\n" .
    "Телефон: {$phone}\n" .
    "Что интересует: " . ($product !== '' ? $product : '—') . "\n" .
    "Комментарий: " . ($comment !== '' ? $comment : '—') . "\n" .
    "Дата: {$dateStr}\n" .
    "Время: {$timeStr}\n" .
    "IP: {$ip}\n" .
    "User-Agent: {$ua}\n";

/* ── 10. Куда приходят заявки (не менять — это получатели) ── */
$recipients = [
    'schmel20232020@yandex.ru',
    'zakaz@med-ermakova.ru',
];

/* ── 11. Отправители-резерв: два независимых Яндекс-ящика.
        Основной — medermakova, при его отказе — order-paseka-ermakova.
        Поле «От кого» у каждого совпадает с его же ящиком (иначе сервер отклонит). ── */
$senders = [
    [
        'label'    => 'Yandex-1',
        'host'     => 'smtp.yandex.ru',
        'username' => 'medermakova@yandex.ru',
        'password' => 'heshyapdlfedthiy',
        'from'     => 'medermakova@yandex.ru',
    ],
    [
        'label'    => 'Yandex-2',
        'host'     => 'smtp.yandex.ru',
        'username' => 'order-paseka-ermakova@yandex.ru',
        'password' => 'tkfsplcuywknotjr',
        'from'     => 'order-paseka-ermakova@yandex.ru',
    ],
];

/* Порты каждого отправителя: 465 (SSL), затем 587 (STARTTLS) как запасной. */
$ports = [
    [PHPMailer::ENCRYPTION_SMTPS,    465],
    [PHPMailer::ENCRYPTION_STARTTLS, 587],
];

/* ── 12. Отправка с перебором: отправитель × порт. Первая удача — выходим. ── */
$lastError = '';
foreach ($senders as $s) {
    foreach ($ports as [$secure, $port]) {
        try {
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host       = $s['host'];
            $mail->SMTPAuth   = true;
            $mail->Username   = $s['username'];
            $mail->Password   = $s['password'];
            $mail->SMTPSecure = $secure;
            $mail->Port       = $port;
            $mail->Timeout    = 12;

            $mail->CharSet  = 'UTF-8';
            $mail->Encoding = 'base64';
            $mail->XMailer  = ' '; // не раскрывать PHPMailer в заголовках (меньше спам-очков)

            $mail->setFrom($s['from'], 'Пасека Ермакова');
            foreach ($recipients as $rcpt) {
                $mail->addAddress($rcpt);
            }
            $mail->addReplyTo($s['from'], 'Пасека Ермакова');

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $body;
            $mail->AltBody = $altBody;

            $mail->send();
            respond(true, 'Заявка отправлена'); // успех — выходим сразу
        } catch (Exception $ex) {
            $lastError = "{$s['label']} :{$port} — " . ($mail->ErrorInfo ?: $ex->getMessage());
            error_log('Пасека Ермакова — ' . $lastError);
        }
    }
}

/* ── 13. Ни один отправитель не сработал — сохраняем заявку, чтобы не потерять лид ── */
$backup = __DIR__ . '/leads-backup.php';
if (!is_file($backup)) {
    // Файл-заглушка: при открытии из браузера отдаёт 404, данные видны только в файловом менеджере.
    file_put_contents($backup, "<?php http_response_code(404); die(); ?>\n");
}
$line = sprintf(
    "[%s %s] Имя: %s | Телефон: %s | Интерес: %s | Комментарий: %s | IP: %s | Ошибка: %s\n",
    $dateStr, $timeStr, $name, $phone,
    ($product !== '' ? $product : '—'),
    str_replace(["\r", "\n"], ' ', ($comment !== '' ? $comment : '—')),
    $ip, $lastError
);
@file_put_contents($backup, $line, FILE_APPEND | LOCK_EX);

error_log('Пасека Ермакова — все отправители отказали, заявка сохранена в leads-backup.php: ' . $lastError);
respond(false, 'Не удалось отправить заявку', 500);
