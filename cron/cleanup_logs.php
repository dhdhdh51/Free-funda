<?php
/**
 * BharatAI Business OS - Database Cleanup & Session Maintenance Cron Job
 */

declare(strict_types=1);
require_once __DIR__ . '/../config.php';

$db = Database::getInstance();

// Delete audit logs older than 90 days
$stmt = $db->prepare("DELETE FROM audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY)");
$stmt->execute();
$logsDeleted = $stmt->rowCount();

// Delete inactive visitor chat sessions older than 30 days
$cStmt = $db->prepare("DELETE FROM chat_sessions WHERE updated_at < DATE_SUB(NOW(), INTERVAL 30 DAY)");
$cStmt->execute();
$sessionsCleaned = $cStmt->rowCount();

echo json_encode([
    'success' => true,
    'job' => 'cleanup_logs',
    'logs_purged' => $logsDeleted,
    'sessions_purged' => $sessionsCleaned,
    'timestamp' => date('c'),
]);
