<?php
/**
 * BharatAI Business OS - AutomationRule Model
 */

declare(strict_types=1);

namespace App\Models;

use Database;
use PDO;

class AutomationRule {
    public static function getByBusiness(int $businessId): array {
        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT * FROM automation_rules WHERE business_id = :business_id AND is_active = 1 ORDER BY id ASC");
        $stmt->execute(['business_id' => $businessId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function incrementRuns(int $ruleId): void {
        $db = Database::getInstance();
        $stmt = $db->prepare("UPDATE automation_rules SET runs_count = runs_count + 1, last_run_at = NOW() WHERE id = :id");
        $stmt->execute(['id' => $ruleId]);
    }
}
