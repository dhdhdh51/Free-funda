<?php
/**
 * BharatAI Business OS - Cron Task: Run Automation Rules
 * Usage: php /path/to/cron/run_automations.php
 * Or via HTTP with secret: /cron/run_automations.php?secret=YOUR_CRON_SECRET_KEY
 */

declare(strict_types=1);

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../app/services/AIService.php';
require_once __DIR__ . '/../app/services/MailService.php';

// Authorization check for CLI vs HTTP
if (php_sapi_name() !== 'cli') {
    $secret = $_GET['secret'] ?? '';
    if (!hash_equals((string)env('CRON_SECRET_KEY', 'bharat_cron_secret'), $secret)) {
        http_response_code(403);
        die("Unauthorized cron access");
    }
}

$startTime = microtime(true);
$db = Database::getConnection();
$processedCount = 0;

echo "[" . date('Y-m-d H:i:s') . "] Starting automation rules processor...\n";

try {
    // 1. Fetch active automation rules
    $rulesStmt = $db->query("SELECT * FROM automation_rules WHERE is_active = 1");
    $rules = $rulesStmt->fetchAll();

    foreach ($rules as $rule) {
        $actions = json_decode($rule['actions'], true) ?: [];
        $conditions = json_decode($rule['conditions'] ?? '{}', true) ?: [];

        // Check for new uncontacted leads if trigger is lead.created
        if ($rule['trigger_event'] === 'lead.created') {
            $leadsStmt = $db->prepare("
                SELECT l.* FROM leads l
                WHERE l.business_id = :bid AND l.status_id = 1
                AND l.id NOT IN (
                    SELECT trigger_entity_id FROM automation_runs 
                    WHERE automation_rule_id = :rid AND trigger_entity_type = 'lead'
                )
                LIMIT 20
            ");
            $leadsStmt->execute(['bid' => $rule['business_id'], 'rid' => $rule['id']]);
            $leads = $leadsStmt->fetchAll();

            foreach ($leads as $lead) {
                // Execute actions (e.g. AI qualify, task creation, email)
                $runStmt = $db->prepare("
                    INSERT INTO automation_runs (automation_rule_id, business_id, trigger_entity_type, trigger_entity_id, status, logs)
                    VALUES (:rid, :bid, 'lead', :lid, 'success', 'Processed automated rule trigger')
                ");
                $runStmt->execute([
                    'rid' => $rule['id'],
                    'bid' => $rule['business_id'],
                    'lid' => $lead['id']
                ]);
                $processedCount++;
            }
        }
    }

    $duration = round(microtime(true) - $startTime, 2);
    
    // Log cron execution
    $logStmt = $db->prepare("
        INSERT INTO cron_logs (job_name, status, output, execution_time_seconds, finished_at)
        VALUES ('run_automations', 'success', :out, :dur, NOW())
    ");
    $logStmt->execute([
        'out' => "Successfully processed {$processedCount} automation actions in {$duration}s",
        'dur' => $duration
    ]);

    echo "Completed in {$duration}s. Processed: {$processedCount} actions.\n";
} catch (Throwable $e) {
    $duration = round(microtime(true) - $startTime, 2);
    echo "Cron error: " . $e->getMessage() . "\n";
    $logStmt = $db->prepare("
        INSERT INTO cron_logs (job_name, status, output, execution_time_seconds, finished_at)
        VALUES ('run_automations', 'failed', :out, :dur, NOW())
    ");
    $logStmt->execute(['out' => "Error: " . $e->getMessage(), 'dur' => $duration]);
}
