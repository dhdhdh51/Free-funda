<?php
/**
 * BharatAI Business OS - Scheduled Email Dispatcher Cron Job
 * Usage: php cron/send_scheduled_emails.php --key=YOUR_CRON_SECRET
 */

declare(strict_types=1);

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../app/services/MailService.php';

$secretKey = env('CRON_SECRET', 'bharatai_cron_secure_key_2026');
$passedKey = $_GET['key'] ?? ($argv[1] ?? '');

if (php_sapi_name() !== 'cli' && $passedKey !== $secretKey) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Unauthorized cron invocation']);
    exit;
}

$db = Database::getInstance();
$stmt = $db->prepare("
    SELECT * FROM email_logs 
    WHERE status = 'pending' 
    ORDER BY id ASC 
    LIMIT 50
");
$stmt->execute();
$queuedEmails = $stmt->fetchAll(PDO::FETCH_ASSOC);

$mailService = new \App\Services\MailService();
$sentCount = 0;

foreach ($queuedEmails as $mail) {
    $success = $mailService->sendEmail(
        $mail['to_email'],
        $mail['subject'],
        $mail['body']
    );
    if ($success) {
        $up = $db->prepare("UPDATE email_logs SET status = 'sent', sent_at = NOW() WHERE id = :id");
        $up->execute(['id' => $mail['id']]);
        $sentCount++;
    }
}

echo json_encode([
    'success' => true,
    'job' => 'send_scheduled_emails',
    'emails_processed' => count($queuedEmails),
    'emails_sent' => $sentCount,
    'timestamp' => date('c'),
]);
