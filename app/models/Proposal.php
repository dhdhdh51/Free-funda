<?php
/**
 * BharatAI Business OS - Proposal Model
 */

declare(strict_types=1);

namespace App\Models;

use Database;
use PDO;

class Proposal {
    public static function getByBusiness(int $businessId): array {
        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT * FROM proposals WHERE business_id = :business_id AND deleted_at IS NULL ORDER BY id DESC");
        $stmt->execute(['business_id' => $businessId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function create(array $data, int $businessId): int {
        $db = Database::getInstance();
        $stmt = $db->prepare("
            INSERT INTO proposals (
                business_id, client_name, title, amount, scope, deliverables, valid_until, status, created_at, updated_at
            ) VALUES (
                :business_id, :client_name, :title, :amount, :scope, :deliverables, :valid_until, :status, NOW(), NOW()
            )
        ");
        $stmt->execute([
            'business_id' => $businessId,
            'client_name' => $data['client_name'],
            'title' => $data['title'] ?? 'AI Automation Proposal',
            'amount' => (float)($data['amount'] ?? 0),
            'scope' => $data['scope'] ?? '',
            'deliverables' => $data['deliverables'] ?? '',
            'valid_until' => $data['valid_until'] ?? date('Y-m-d', strtotime('+14 days')),
            'status' => $data['status'] ?? 'draft',
        ]);
        return (int)$db->lastInsertId();
    }
}
