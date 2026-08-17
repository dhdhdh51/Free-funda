<?php
/**
 * BharatAI Business OS - Dynamic Google OAuth Helper & Service
 * Supports dynamic configuration, auto-detected fallback redirect URLs, 
 * token verification, user profile extraction, and seamless multi-tenant account provisioning.
 */

declare(strict_types=1);

namespace App\Helpers;

use Database;
use PDO;

class GoogleAuthHelper {
    
    /**
     * Dynamically detect the current base URL and redirect URI fallback
     */
    public static function detectRedirectUri(): string {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || 
                    (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') 
                    ? 'https://' : 'http://';
        
        $host = $_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? 'localhost:3000';
        return rtrim($protocol . $host, '/') . '/auth/google/callback.php';
    }

    /**
     * Get active Google OAuth settings from Database with .env / auto-detected fallbacks
     */
    public static function getGoogleConfig(): array {
        $clientId = env('GOOGLE_CLIENT_ID', '');
        $clientSecret = env('GOOGLE_CLIENT_SECRET', '');
        $redirectUri = env('GOOGLE_REDIRECT_URI', '');
        $enabled = (bool)env('GOOGLE_AUTH_ENABLED', false);

        // Check if database settings override
        try {
            $db = Database::getInstance();
            $stmt = $db->prepare("SELECT setting_value FROM settings WHERE setting_key = 'system_branding_smtp' LIMIT 1");
            $stmt->execute();
            $val = $stmt->fetchColumn();
            if ($val) {
                $decoded = json_decode($val, true);
                if (is_array($decoded)) {
                    if (!empty($decoded['googleClientId'])) {
                        $clientId = $decoded['googleClientId'];
                    }
                    if (!empty($decoded['googleClientSecret'])) {
                        $clientSecret = $decoded['googleClientSecret'];
                    }
                    if (!empty($decoded['googleRedirectUri'])) {
                        $redirectUri = $decoded['googleRedirectUri'];
                    }
                    if (isset($decoded['googleAuthEnabled'])) {
                        $enabled = (bool)$decoded['googleAuthEnabled'];
                    }
                }
            }
        } catch (\Throwable $e) {
            // Use environment or fallback
        }

        // Auto-detect fallback URL if redirect URI is not set or empty
        if (empty($redirectUri)) {
            $redirectUri = self::detectRedirectUri();
        }

        return [
            'enabled' => $enabled || !empty($clientId),
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'redirect_uri' => $redirectUri,
            'auto_detected_redirect_uri' => self::detectRedirectUri(),
        ];
    }

    /**
     * Generate the Google OAuth authorization URL
     */
    public static function getAuthUrl(?string $state = null): string {
        $config = self::getGoogleConfig();
        if (empty($config['client_id'])) {
            return '';
        }

        if (!$state) {
            $state = bin2hex(random_bytes(16));
            $_SESSION['google_oauth_state'] = $state;
        }

        $params = [
            'client_id' => $config['client_id'],
            'redirect_uri' => $config['redirect_uri'],
            'response_type' => 'code',
            'scope' => 'openid email profile',
            'access_type' => 'offline',
            'prompt' => 'select_account',
            'state' => $state,
        ];

        return 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);
    }

    /**
     * Exchange authorization code for access token and fetch user details
     */
    public static function handleCallback(string $code): ?array {
        $config = self::getGoogleConfig();
        if (empty($config['client_id']) || empty($config['client_secret'])) {
            throw new \Exception('Google OAuth Client ID or Secret is not configured.');
        }

        $tokenUrl = 'https://oauth2.googleapis.com/token';
        $postData = http_build_query([
            'code' => $code,
            'client_id' => $config['client_id'],
            'client_secret' => $config['client_secret'],
            'redirect_uri' => $config['redirect_uri'],
            'grant_type' => 'authorization_code',
        ]);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $tokenUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200 || !$response) {
            throw new \Exception('Failed to exchange code with Google OAuth token endpoint.');
        }

        $tokenData = json_decode($response, true);
        if (empty($tokenData['access_token'])) {
            throw new \Exception('No access token returned from Google.');
        }

        // Fetch User Profile from Google UserInfo endpoint
        $userInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
        $ch2 = curl_init();
        curl_setopt($ch2, CURLOPT_URL, $userInfoUrl);
        curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch2, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch2, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $tokenData['access_token'],
            'Accept: application/json'
        ]);
        $userResponse = curl_exec($ch2);
        $userHttpCode = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
        curl_close($ch2);

        if ($userHttpCode !== 200 || !$userResponse) {
            throw new \Exception('Failed to fetch user information from Google.');
        }

        $googleUser = json_decode($userResponse, true);
        if (empty($googleUser['email'])) {
            throw new \Exception('Google user account does not contain a verified email address.');
        }

        return [
            'google_id' => $googleUser['sub'] ?? '',
            'email' => strtolower(trim($googleUser['email'])),
            'name' => $googleUser['name'] ?? explode('@', $googleUser['email'])[0],
            'avatar' => $googleUser['picture'] ?? null,
            'email_verified' => !empty($googleUser['email_verified']),
        ];
    }
}
