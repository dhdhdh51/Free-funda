<?php
/**
 * BharatAI Business OS - Knowledge Base & RAG Indexing Service
 */

declare(strict_types=1);

namespace App\Services;

use App\Models\KnowledgeSource;
use Database;
use PDO;

class KnowledgeBaseService {
    public function searchContext(int $businessId, string $query, int $limit = 5): string {
        $db = Database::getInstance();
        $stmt = $db->prepare("
            SELECT title, content FROM knowledge_sources
            WHERE business_id = :business_id AND is_active = 1 AND deleted_at IS NULL
            ORDER BY id DESC LIMIT :limit
        ");
        $stmt->bindValue(':business_id', $businessId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        $sources = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($sources)) {
            return "No custom business documents currently indexed.";
        }

        $contextBlocks = [];
        foreach ($sources as $src) {
            $contextBlocks[] = "--- [Document: {$src['title']}] ---\n" . $src['content'];
        }

        return implode("\n\n", $contextBlocks);
    }
}
