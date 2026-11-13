<?php
/**
 * ВРЕМЕННЫЙ диагностический файл. Показывает реальную причину отказа SMTP
 * с сервера Timeweb. Защищён секретным ключом. После диагностики — УДАЛИТЬ.
 */
declare(strict_types=1);
header('Content-Type: text/plain; charset=UTF-8');

if (($_GET['key'] ?? '') !== 'ermak-diag-2026') {
    http_response_code(403);
    echo 'forbidden';
    exit;
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

echo "PHP: " . PHP_VERSION . "\n";
echo "Сервер IP: " . ($_SERVER['SERVER_ADDR'] ?? '—') . "\n\n";

/* Проверка «сырого» TCP-доступа с сервера к портам Яндекса */
foreach ([465, 587, 25] as $port) {
    $t0 = microtime(true);
    $fp = @fsockopen('smtp.yandex.ru', $port, $errno, $errstr, 8);
    $ms = round((microtime(true) - $t0) * 1000);
    if ($fp) {
        echo "TCP :{$port} — ОТКРЫТ ({$ms} ms)\n";
        fclose($fp);
    } else {
        echo "TCP :{$port} — ЗАКРЫТ/таймаут ({$ms} ms) [{$errno}] {$errstr}\n";
    }
}
echo "\n";

/* Пробная отправка через оба транспорта с полным логом соединения */
$transports = [
    ['SSL 465',      PHPMailer::ENCRYPTION_SMTPS,    465],
    ['STARTTLS 587', PHPMailer::ENCRYPTION_STARTTLS, 587],
];

foreach ($transports as [$name, $secure, $port]) {
    echo "==================== {$name} ====================\n";
    $log  = '';
    $mail = new PHPMailer(true);
    $mail->SMTPDebug   = SMTP::DEBUG_CONNECTION;
    $mail->Debugoutput = function ($str, $level) use (&$log) { $log .= $str . "\n"; };
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.yandex.ru';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'medermakova@yandex.ru';
        $mail->Password   = 'heshyapdlfedthiy';
        $mail->SMTPSecure = $secure;
        $mail->Port       = $port;
        $mail->Timeout    = 15;
        $mail->CharSet    = 'UTF-8';
        $mail->setFrom('medermakova@yandex.ru', 'Diag');
        $mail->addAddress('schmel20232020@yandex.ru');
        $mail->Subject = "SMTP diag {$name}";
        $mail->Body    = "diag {$port}";
        $mail->send();
        echo "РЕЗУЛЬТАТ: УСПЕХ через {$name}\n";
    } catch (Exception $e) {
        echo "РЕЗУЛЬТАТ: ОШИБКА через {$name}\n";
        echo "ErrorInfo: " . $mail->ErrorInfo . "\n";
    }
    /* Маскируем возможные base64-строки авторизации, чтобы пароль не утёк в вывод */
    $safe = preg_replace('/(AUTH\s+(?:LOGIN|PLAIN)[^\n]*)/i', 'AUTH ***', $log);
    $safe = preg_replace('/^[A-Za-z0-9+\/]{20,}={0,2}$/m', '*** (скрыто)', $safe);
    echo "--- лог соединения ---\n" . $safe . "\n\n";
}

echo "Готово. После снятия диагностики удалите этот файл (smtp-diag.php).\n";
