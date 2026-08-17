<?php
/**
 * BharatAI Business OS - Input Validation Helper
 */

declare(strict_types=1);

namespace App\Helpers;

class ValidationHelper {
    public static function validateEmail(string $email): bool {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public static function validatePhone(string $phone): bool {
        $clean = preg_replace('/[^0-9+]/', '', $phone);
        return strlen($clean) >= 8 && strlen($clean) <= 16;
    }

    public static function sanitizeString(string $input): string {
        return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }

    public static function validateRequired(array $data, array $requiredFields): array {
        $errors = [];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || trim((string)$data[$field]) === '') {
                $errors[] = "Field '{$field}' is required.";
            }
        }
        return $errors;
    }
}
