<?php
/**
 * BharatAI Business OS - KnowledgeSource Model
 */

declare(strict_types=1);

namespace App\Models;

use Database;
use PDO;

class KnowledgeSource {
    public static function getByBusiness(int $businessId): array {
        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT * FROM knowledge_sources WHERE business_id = :business_id AND deleted_at IS NULL ORDER BY id DESC");
        $stmt->execute(['business_id' => $businessId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function create(array $data, int $businessId): int {
        $db = Database::getInstance();
        $stmt = $db->prepare("
            INSERT INTO knowledge_sources (
                business_id, title, type, content, chunk_count, is_active, created_at, updated_at
            ) VALUES (
                :business_id, :title, :type, :content, :chunk_count, 1, NOW(), NOW()
            )
        ");
        $chunkCount = (int)ceil(strlen($data['content'] ?? '') / 200);
        $stmt->execute([
            'business_id' => $businessId,
            'title' => $data['title'],
            'type' => $data['type'] ?? 'manual_text',
            'content' => $data['content'] ?? '',
            'chunk_count' => max(1, $chunkCount),
        ]);
        return (int)$db->lastInsertId();
    }
}
