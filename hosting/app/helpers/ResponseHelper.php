<?php
/**
 * BharatAI Business OS - Response & API Formatting Helper
 */

declare(strict_types=1);

class ResponseHelper {
    public static function json(
        bool $success,
        mixed $data = null,
        string $message = '',
        array $errors = [],
        int $statusCode = 200
    ): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
        
        echo json_encode([
            'success' => $success,
            'data'    => $data,
            'message' => $message,
            'errors'  => $errors,
            'meta'    => [
                'timestamp' => time(),
                'version'   => '1.0.0'
            ]
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function success(mixed $data = null, string $message = 'Success', int $statusCode = 200): void {
        self::json(true, $data, $message, [], $statusCode);
    }

    public static function error(string $message = 'An error occurred', array $errors = [], int $statusCode = 400): void {
        self::json(false, null, $message, $errors, $statusCode);
    }

    public static function unauthorized(string $message = 'Unauthorized access'): void {
        self::json(false, null, $message, ['auth' => 'Authentication required or token expired'], 401);
    }

    public static function forbidden(string $message = 'Access forbidden'): void {
        self::json(false, null, $message, ['permission' => 'Insufficient role or tenant permissions'], 403);
    }

    public static function notFound(string $message = 'Resource not found'): void {
        self::json(false, null, $message, [], 404);
    }
}
