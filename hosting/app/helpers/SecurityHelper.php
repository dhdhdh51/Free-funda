<?php
/**
 * BharatAI Business OS - Security & Sanitation Helper
 */

declare(strict_types=1);

class SecurityHelper {
    public static function hashPassword(string $password): string {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    }

    public static function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }

    public static function generateCsrfToken(): string {
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    public static function validateCsrfToken(?string $token): bool {
        if (empty($_SESSION['csrf_token']) || empty($token)) {
            return false;
        }
        return hash_equals($_SESSION['csrf_token'], $token);
    }

    public static function cleanInput(mixed $data): mixed {
        if (is_array($data)) {
            return array_map([self::class, 'cleanInput'], $data);
        }
        if (is_string($data)) {
            return htmlspecialchars(trim($data), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        }
        return $data;
    }

    public static function sanitizeString(string $input): string {
        return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
    }

    public static function sanitizeEmail(string $email): string {
        return filter_var(trim($email), FILTER_SANITIZE_EMAIL) ?: '';
    }

    public static function generateApiKeyPrefix(): string {
        return 'bk_' . substr(bin2hex(random_bytes(6)), 0, 12);
    }

    public static function generateApiSecret(): string {
        return bin2hex(random_bytes(32));
    }

    public static function encrypt(string $data, string $key): string {
        $iv = random_bytes(16);
        $encrypted = openssl_encrypt($data, 'AES-256-CBC', hash('sha256', $key, true), OPENSSL_RAW_DATA, $iv);
        return base64_encode($iv . $encrypted);
    }

    public static function decrypt(string $data, string $key): ?string {
        $data = base64_decode($data);
        if (strlen($data) < 17) {
            return null;
        }
        $iv = substr($data, 0, 16);
        $encrypted = substr($data, 16);
        $decrypted = openssl_decrypt($encrypted, 'AES-256-CBC', hash('sha256', $key, true), OPENSSL_RAW_DATA, $iv);
        return $decrypted === false ? null : $decrypted;
    }
}
