<?php
/**
 * BharatAI Business OS - Core Configuration & Database Bootstrap
 * 100% Native PHP Configuration - Works out of the box on cPanel / Apache / VPS / Shared Hosting
 * No .env file or external dependencies required.
 */

declare(strict_types=1);

if (!defined('BHARATAI_INIT')) {
    define('BHARATAI_INIT', true);
}

// Session security initialization
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_samesite', 'Lax');
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        ini_set('session.cookie_secure', '1');
    }
    session_start();
}

// Auto-detect base application URL dynamically
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || 
            (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') 
            ? 'https://' : 'http://';
$detectedHost = $_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? 'localhost:3000';
$autoAppUrl = rtrim($protocol . $detectedHost, '/');

// Optional helper to load .env if present (non-blocking)
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) continue;
        if (str_contains($line, '=')) {
            [$name, $value] = explode('=', $line, 2);
            $name = trim($name);
            $value = trim(trim($value), '"\'');
            if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
                putenv(sprintf('%s=%s', $name, $value));
                $_ENV[$name] = $value;
                $_SERVER[$name] = $value;
            }
        }
    }
}

// Environment Helper
function env(string $key, mixed $default = null): mixed {
    $value = getenv($key);
    if ($value === false) {
        return $_ENV[$key] ?? $_SERVER[$key] ?? $default;
    }
    return match (strtolower((string)$value)) {
        'true', '(true)' => true,
        'false', '(false)' => false,
        'null', '(null)' => null,
        'empty', '(empty)' => '',
        default => $value,
    };
}

// Native PHP Application Configuration (Edit directly here or manage via Admin UI)
return_config:
define('APP_NAME', env('APP_NAME', 'BharatAI Business OS'));
define('APP_ENV', env('APP_ENV', 'production'));
define('APP_DEBUG', (bool)env('APP_DEBUG', false));
define('APP_URL', rtrim(env('APP_URL', $autoAppUrl), '/'));
define('APP_ROOT', __DIR__);
define('STORAGE_PATH', __DIR__ . '/storage');
define('UPLOAD_PATH', __DIR__ . '/public/uploads');

// Native MySQL Database Configuration
define('DB_HOST', env('DB_HOST', '127.0.0.1'));
define('DB_PORT', env('DB_PORT', '3306'));
define('DB_DATABASE', env('DB_DATABASE', 'bharatai_saas'));
define('DB_USERNAME', env('DB_USERNAME', 'root'));
define('DB_PASSWORD', env('DB_PASSWORD', ''));
define('DB_CHARSET', env('DB_CHARSET', 'utf8mb4'));

// Error Reporting
if (APP_DEBUG) {
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
} else {
    error_reporting(0);
    ini_set('display_errors', '0');
    ini_set('log_errors', '1');
    ini_set('error_log', STORAGE_PATH . '/logs/app_error.log');
}

date_default_timezone_set(env('APP_TIMEZONE', 'Asia/Kolkata'));

/**
 * Database Connection Manager (PDO Singleton)
 */
class Database {
    private static ?PDO $instance = null;

    public static function getInstance(): PDO {
        return self::getConnection();
    }

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $host = DB_HOST;
            $port = DB_PORT;
            $dbname = DB_DATABASE;
            $username = DB_USERNAME;
            $password = DB_PASSWORD;
            $charset = DB_CHARSET;

            $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset={$charset}";

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$charset} COLLATE utf8mb4_unicode_ci"
            ];

            try {
                self::$instance = new PDO($dsn, $username, $password, $options);
            } catch (PDOException $e) {
                if (APP_DEBUG) {
                    die("Database connection failed: " . $e->getMessage());
                } else {
                    error_log("Database Error: " . $e->getMessage());
                    die(json_encode([
                        'success' => false,
                        'message' => 'Service temporarily unavailable. Please verify database connection settings in config.php.'
                    ]));
                }
            }
        }

        return self::$instance;
    }
}
