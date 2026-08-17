<?php
/**
 * BharatAI Business OS - Webhook Event Queue Processor
 */

declare(strict_types=1);
require_once __DIR__ . '/../config.php';

$db = Database::getInstance();
$stmt = $db->prepare("
    SELECT wl.*, w.url, w.secret 
    FROM webhook_logs wl
    INNER JOIN webhooks w ON wl.webhook_id = w.id
    WHERE wl.status = 'pending' AND wl.attempts < 3
    LIMIT 25
");
$stmt->execute();
$queue = $stmt->fetchAll(PDO::FETCH_ASSOC);

$processed = 0;
foreach ($queue as $item) {
    $payload = $item['payload'];
    $signature = hash_hmac('sha256', $payload, $item['secret'] ?? 'bharatai_webhook_secret');

    $ch = curl_init($item['url']);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 5,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'X-BharatAI-Signature: ' . $signature,
            'User-Agent: BharatAI-Webhook-Dispatcher/1.0',
        ],
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $newStatus = ($httpCode >= 200 && $httpCode < 300) ? 'delivered' : 'failed';
    $up = $db->prepare("
        UPDATE webhook_logs 
        SET status = :status, attempts = attempts + 1, response_code = :code, response_body = :body, updated_at = NOW() 
        WHERE id = :id
    ");
    $up->execute([
        'status' => $newStatus,
        'code' => $httpCode,
        'body' => substr((string)$response, 0, 500),
        'id' => $item['id']
    ]);
    $processed++;
}

echo json_encode([
    'success' => true,
    'job' => 'process_webhooks',
    'webhooks_processed' => $processed,
    'timestamp' => date('c'),
]);
