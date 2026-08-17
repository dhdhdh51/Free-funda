<?php
/**
 * BharatAI Business OS - Business Model
 * Multi-Tenant Data Isolation
 */

declare(strict_types=1);

namespace App\Models;

use Database;
use PDO;

class Business {
    public static function findById(int $id): ?array {
        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT * FROM businesses WHERE id = :id AND deleted_at IS NULL LIMIT 1");
        $stmt->execute(['id' => $id]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        return $res ?: null;
    }

    public static function create(array $data, int $ownerUserId): int {
        $db = Database::getInstance();
        $db->beginTransaction();
        try {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['name'])));
            $stmt = $db->prepare("
                INSERT INTO businesses (name, slug, business_type, industry, website, phone, email, currency, currency_symbol, timezone, about, usp, plan, created_at, updated_at)
                VALUES (:name, :slug, :business_type, :industry, :website, :phone, :email, :currency, :currency_symbol, :timezone, :about, :usp, :plan, NOW(), NOW())
            ");
            $stmt->execute([
                'name' => $data['name'],
                'slug' => $slug . '-' . substr(md5(uniqid()), 0, 4),
                'business_type' => $data['business_type'] ?? 'Agency',
                'industry' => $data['industry'] ?? 'General',
                'website' => $data['website'] ?? null,
                'phone' => $data['phone'] ?? null,
                'email' => $data['email'] ?? null,
                'currency' => $data['currency'] ?? 'INR',
                'currency_symbol' => $data['currency_symbol'] ?? '₹',
                'timezone' => $data['timezone'] ?? 'Asia/Kolkata',
                'about' => $data['about'] ?? '',
                'usp' => $data['usp'] ?? '',
                'plan' => $data['plan'] ?? 'Starter',
            ]);
            $businessId = (int)$db->lastInsertId();

            // Link owner member
            $mStmt = $db->prepare("
                INSERT INTO business_members (business_id, user_id, role, is_active, created_at, updated_at)
                VALUES (:business_id, :user_id, 'BUSINESS_OWNER', 1, NOW(), NOW())
            ");
            $mStmt->execute([
                'business_id' => $businessId,
                'user_id' => $ownerUserId,
            ]);

            $db->commit();
            return $businessId;
        } catch (\Throwable $e) {
            $db->rollBack();
            throw $e;
        }
    }

    public static function updateCreditsUsed(int $businessId, int $creditsToAdd): void {
        $db = Database::getInstance();
        $stmt = $db->prepare("UPDATE businesses SET credits_used = credits_used + :credits WHERE id = :id");
        $stmt->execute(['credits' => $creditsToAdd, 'id' => $businessId]);
    }
}
