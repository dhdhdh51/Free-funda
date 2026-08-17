<?php
/**
 * BharatAI Business OS - Authentication & Tenant Security Middleware
 */

declare(strict_types=1);

require_once __DIR__ . '/../helpers/ResponseHelper.php';

class AuthMiddleware {
    public static function authenticate(): array {
        // 1. Check Session
        if (!empty($_SESSION['user_id'])) {
            return [
                'user_id' => (int)$_SESSION['user_id'],
                'role_id' => (int)($_SESSION['role_id'] ?? 3),
                'email'   => (string)($_SESSION['email'] ?? ''),
                'name'    => (string)($_SESSION['name'] ?? '')
            ];
        }

        // 2. Check Bearer Token (Authorization Header)
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
            // Verify token against database api_keys or user sessions
            $db = Database::getConnection();
            $stmt = $db->prepare("SELECT u.id, u.role_id, u.email, u.first_name, u.last_name FROM users u WHERE u.remember_token = :token AND u.status = 'active' LIMIT 1");
            $stmt->execute(['token' => $token]);
            $user = $stmt->fetch();
            if ($user) {
                return [
                    'user_id' => (int)$user['id'],
                    'role_id' => (int)$user['role_id'],
                    'email'   => (string)$user['email'],
                    'name'    => trim($user['first_name'] . ' ' . ($user['last_name'] ?? ''))
                ];
            }
        }

        ResponseHelper::unauthorized('Authentication required to access this endpoint.');
        exit;
    }

    public static function requireAdmin(): array {
        $user = self::authenticate();
        if ($user['role_id'] > 2) {
            ResponseHelper::forbidden('Super admin or Administrator access required.');
            exit;
        }
        return $user;
    }
}

class TenantMiddleware {
    public static function verifyBusinessAccess(int $userId, int $businessId): array {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            SELECT b.*, bm.role as member_role, bm.custom_permissions
            FROM businesses b
            LEFT JOIN business_members bm ON b.id = bm.business_id AND bm.user_id = :user_id
            WHERE b.id = :biz_id AND b.deleted_at IS NULL AND (b.owner_user_id = :user_id_owner OR bm.status = 'active')
            LIMIT 1
        ");
        $stmt->execute([
            'user_id' => $userId,
            'user_id_owner' => $userId,
            'biz_id'  => $businessId
        ]);
        $business = $stmt->fetch();

        if (!$business) {
            ResponseHelper::forbidden('You do not have authorization to access data for this business.');
            exit;
        }

        return $business;
    }
}
