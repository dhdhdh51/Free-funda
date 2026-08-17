<?php
/**
 * BharatAI Business OS - Lead Model
 * Handles CRM Leads, Pipeline, AI Qualifications
 */

declare(strict_types=1);

namespace App\Models;

use Database;
use PDO;

class Lead {
    public static function getByBusiness(int $businessId, array $filters = []): array {
        $db = Database::getInstance();
        $sql = "SELECT * FROM leads WHERE business_id = :business_id AND deleted_at IS NULL";
        $params = ['business_id' => $businessId];

        if (!empty($filters['status'])) {
            $sql .= " AND status = :status";
            $params['status'] = $filters['status'];
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (first_name LIKE :search OR last_name LIKE :search OR email LIKE :search OR company_name LIKE :search)";
            $params['search'] = '%' . $filters['search'] . '%';
        }

        $sql .= " ORDER BY id DESC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function findById(int $id, int $businessId): ?array {
        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT * FROM leads WHERE id = :id AND business_id = :business_id AND deleted_at IS NULL LIMIT 1");
        $stmt->execute(['id' => $id, 'business_id' => $businessId]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        return $res ?: null;
    }

    public static function create(array $data, int $businessId): int {
        $db = Database::getInstance();
        $stmt = $db->prepare("
            INSERT INTO leads (
                business_id, first_name, last_name, email, phone, company_name,
                source, status, priority, estimated_value, requirement, budget, location,
                created_at, updated_at
            ) VALUES (
                :business_id, :first_name, :last_name, :email, :phone, :company_name,
                :source, :status, :priority, :estimated_value, :requirement, :budget, :location,
                NOW(), NOW()
            )
        ");
        $stmt->execute([
            'business_id' => $businessId,
            'first_name' => $data['first_name'] ?? '',
            'last_name' => $data['last_name'] ?? '',
            'email' => strtolower(trim($data['email'] ?? '')),
            'phone' => $data['phone'] ?? '',
            'company_name' => $data['company_name'] ?? '',
            'source' => $data['source'] ?? 'Website Chatbot',
            'status' => $data['status'] ?? 'New Inquiry',
            'priority' => $data['priority'] ?? 'medium',
            'estimated_value' => (float)($data['estimated_value'] ?? 0),
            'requirement' => $data['requirement'] ?? '',
            'budget' => $data['budget'] ?? '',
            'location' => $data['location'] ?? '',
        ]);
        return (int)$db->lastInsertId();
    }

    public static function updateStatus(int $id, int $businessId, string $status): bool {
        $db = Database::getInstance();
        $stmt = $db->prepare("UPDATE leads SET status = :status, updated_at = NOW() WHERE id = :id AND business_id = :business_id");
        return $stmt->execute(['status' => $status, 'id' => $id, 'business_id' => $businessId]);
    }

    public static function saveAIQualification(int $id, int $businessId, array $qual): bool {
        $db = Database::getInstance();
        $stmt = $db->prepare("
            UPDATE leads SET
                ai_score = :ai_score,
                ai_intent = :ai_intent,
                ai_buying_probability = :ai_buying_probability,
                ai_recommended_action = :ai_recommended_action,
                ai_suggested_response = :ai_suggested_response,
                status = 'Qualified',
                updated_at = NOW()
            WHERE id = :id AND business_id = :business_id
        ");
        return $stmt->execute([
            'ai_score' => (int)($qual['score'] ?? 85),
            'ai_intent' => $qual['intent'] ?? 'High',
            'ai_buying_probability' => $qual['buying_probability'] ?? '80%',
            'ai_recommended_action' => $qual['recommended_action'] ?? '',
            'ai_suggested_response' => $qual['suggested_response'] ?? '',
            'id' => $id,
            'business_id' => $businessId,
        ]);
    }
}
