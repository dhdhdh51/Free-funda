<?php
/**
 * BharatAI Business OS - User Model
 * Native PHP 8.2+ / MySQL PDO
 */

declare(strict_types=1);

namespace App\Models;

use Database;
use PDO;

class User {
    public int $id;
    public string $name;
    public string $email;
    public string $role;
    public ?string $phone = null;
    public ?string $avatar = null;
    public int $isActive = 1;
    public string $createdAt;

    public static function findById(int $id): ?array {
        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT id, name, email, phone, role, is_active, avatar, created_at FROM users WHERE id = :id AND deleted_at IS NULL LIMIT 1");
        $stmt->execute(['id' => $id]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        return $res ?: null;
    }

    public static function findByEmail(string $email): ?array {
        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT * FROM users WHERE email = :email AND deleted_at IS NULL LIMIT 1");
        $stmt->execute(['email' => strtolower(trim($email))]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        return $res ?: null;
    }

    public static function create(array $data): int {
        $db = Database::getInstance();
        $stmt = $db->prepare("
            INSERT INTO users (name, email, password_hash, phone, role, is_active, created_at, updated_at)
            VALUES (:name, :email, :password_hash, :phone, :role, 1, NOW(), NOW())
        ");
        $stmt->execute([
            'name' => $data['name'],
            'email' => strtolower(trim($data['email'])),
            'password_hash' => password_hash($data['password'], PASSWORD_BCRYPT),
            'phone' => $data['phone'] ?? null,
            'role' => $data['role'] ?? 'BUSINESS_OWNER',
        ]);
        return (int)$db->lastInsertId();
    }

    public static function getUserBusinesses(int $userId): array {
        $db = Database::getInstance();
        $stmt = $db->prepare("
            SELECT b.*, bm.role as member_role 
            FROM businesses b
            INNER JOIN business_members bm ON b.id = bm.business_id
            WHERE bm.user_id = :user_id AND b.deleted_at IS NULL
            ORDER BY b.id ASC
        ");
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
