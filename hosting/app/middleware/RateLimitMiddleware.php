<?php
/**
 * BharatAI Business OS - API Rate Limiting Middleware
 */

declare(strict_types=1);

namespace App\Middleware;

use App\Helpers\ResponseHelper;

class RateLimitMiddleware {
    public static function check(int $maxRequests = 100, int $windowSeconds = 60): void {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $key = 'ratelimit_' . md5($ip);
        
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $now = time();
        $record = $_SESSION[$key] ?? ['count' => 0, 'start_time' => $now];

        if ($now - $record['start_time'] > $windowSeconds) {
            $record = ['count' => 1, 'start_time' => $now];
        } else {
            $record['count']++;
        }

        $_SESSION[$key] = $record;

        if ($record['count'] > $maxRequests) {
            ResponseHelper::error('Rate limit exceeded. Please wait before making more requests.', 429);
        }
    }
}
