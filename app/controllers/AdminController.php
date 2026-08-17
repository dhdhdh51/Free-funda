<?php
/**
 * BharatAI Business OS - Super Admin & System Controller
 */

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\ResponseHelper;
use Database;
use PDO;

class AdminController {
    public function getSystemHealth(): void {
        $db = Database::getInstance();
        $dbStatus = 'connected';
        try {
            $db->query("SELECT 1");
        } catch (\Throwable $e) {
            $dbStatus = 'error: ' . $e->getMessage();
        }

        $info = [
            'php_version' => PHP_VERSION,
            'database_status' => $dbStatus,
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Apache/2.4',
            'memory_usage' => round(memory_get_usage(true) / 1024 / 1024, 2) . ' MB',
            'extensions' => [
                'pdo_mysql' => extension_loaded('pdo_mysql'),
                'curl' => extension_loaded('curl'),
                'json' => extension_loaded('json'),
                'mbstring' => extension_loaded('mbstring'),
                'openssl' => extension_loaded('openssl')
            ],
            'upload_max_filesize' => ini_get('upload_max_filesize'),
            'post_max_size' => ini_get('post_max_size'),
            'execution_time_limit' => ini_get('max_execution_time'),
            'timestamp' => date('c'),
        ];

        ResponseHelper::success($info, 'System health diagnostics OK');
    }

    public function getGlobalStats(): void {
        $db = Database::getInstance();
        $totalUsers = (int)$db->query("SELECT COUNT(*) FROM users WHERE deleted_at IS NULL")->fetchColumn();
        $totalBusinesses = (int)$db->query("SELECT COUNT(*) FROM businesses WHERE deleted_at IS NULL")->fetchColumn();
        $totalLeads = (int)$db->query("SELECT COUNT(*) FROM leads WHERE deleted_at IS NULL")->fetchColumn();
        $totalAiUsage = (int)$db->query("SELECT COALESCE(SUM(credits_used), 0) FROM businesses")->fetchColumn();

        ResponseHelper::success([
            'total_users' => $totalUsers,
            'total_businesses' => $totalBusinesses,
            'total_leads' => $totalLeads,
            'total_ai_credits_consumed' => $totalAiUsage,
            'active_ai_providers' => ['Google Gemini (Primary)', 'OpenAI GPT-4o (Fallback)', 'Anthropic Claude 3.5 (Secondary)'],
        ], 'Global statistics retrieved.');
    }

    /**
     * Get Dynamic AI Providers & Active Models from Database
     */
    public function getAIProviders(): array {
        $db = Database::getInstance();
        try {
            $stmt = $db->query("
                SELECT p.*, m.model_name, m.model_identifier, m.max_tokens, m.default_temperature
                FROM ai_providers p
                LEFT JOIN ai_models m ON m.provider_id = p.id AND m.is_default = 1
                ORDER BY p.priority ASC
            ");
            $providers = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if (!empty($providers)) {
                return $providers;
            }
        } catch (\Throwable $e) {
            // fallback
        }

        return [
            [
                'id' => 1,
                'name' => 'Google Gemini (Primary)',
                'provider_key' => 'gemini',
                'model_identifier' => 'gemini-3.7-flash',
                'base_url' => 'https://generativelanguage.googleapis.com/v1beta',
                'api_key_encrypted' => env('GEMINI_API_KEY') ? 'configured' : '',
                'is_enabled' => 1,
                'priority' => 1,
                'default_temperature' => 0.7,
                'max_tokens' => 4096,
            ],
            [
                'id' => 2,
                'name' => 'OpenAI GPT-4o (Fallback 1)',
                'provider_key' => 'openai',
                'model_identifier' => 'gpt-4o-mini',
                'base_url' => 'https://api.openai.com/v1',
                'api_key_encrypted' => env('OPENAI_API_KEY') ? 'configured' : '',
                'is_enabled' => 1,
                'priority' => 2,
                'default_temperature' => 0.7,
                'max_tokens' => 4096,
            ],
            [
                'id' => 3,
                'name' => 'Anthropic Claude (Fallback 2)',
                'provider_key' => 'anthropic',
                'model_identifier' => 'claude-3-5-sonnet',
                'base_url' => 'https://api.anthropic.com/v1',
                'api_key_encrypted' => env('ANTHROPIC_API_KEY') ? 'configured' : '',
                'is_enabled' => 1,
                'priority' => 3,
                'default_temperature' => 0.7,
                'max_tokens' => 4096,
            ],
            [
                'id' => 4,
                'name' => 'Custom OpenAI-Compatible API',
                'provider_key' => 'custom',
                'model_identifier' => 'llama-3-70b',
                'base_url' => 'https://api.together.xyz/v1',
                'api_key_encrypted' => '',
                'is_enabled' => 0,
                'priority' => 4,
                'default_temperature' => 0.7,
                'max_tokens' => 4096,
            ],
        ];
    }

    /**
     * Update AI Provider from Admin Panel
     */
    public function updateAIProvider(array $data): void {
        $db = Database::getInstance();
        $providerKey = $data['provider_key'] ?? '';
        $apiKey = $data['api_key'] ?? '';
        $model = $data['model'] ?? '';
        $baseUrl = $data['base_url'] ?? '';
        $isEnabled = !empty($data['is_enabled']) ? 1 : 0;
        $priority = (int)($data['priority'] ?? 1);

        if (!$providerKey) {
            ResponseHelper::error('Provider key is required.', 400);
            return;
        }

        try {
            $stmt = $db->prepare("
                INSERT INTO ai_providers (name, provider_key, base_url, api_key_encrypted, is_enabled, priority)
                VALUES (:name, :key, :url, :apiKey, :enabled, :priority)
                ON DUPLICATE KEY UPDATE
                    base_url = VALUES(base_url),
                    api_key_encrypted = IF(VALUES(api_key_encrypted) != '', VALUES(api_key_encrypted), api_key_encrypted),
                    is_enabled = VALUES(is_enabled),
                    priority = VALUES(priority)
            ");
            $stmt->execute([
                'name' => ucfirst($providerKey) . ' AI',
                'key' => $providerKey,
                'url' => $baseUrl,
                'apiKey' => $apiKey,
                'enabled' => $isEnabled,
                'priority' => $priority,
            ]);

            // Also record audit log
            $aStmt = $db->prepare("INSERT INTO admin_logs (admin_user_id, action, target_entity, details) VALUES (1, 'UPDATE_AI_PROVIDER', :key, :details)");
            $aStmt->execute(['key' => $providerKey, 'details' => "Model: $model, Priority: $priority, Enabled: $isEnabled"]);

            ResponseHelper::success(['provider_key' => $providerKey], 'AI Provider settings successfully saved in database.');
        } catch (\Throwable $e) {
            ResponseHelper::error('Failed to update AI Provider: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get Landing Page CMS Content from Database
     */
    public function getLandingSettings(): array {
        $db = Database::getInstance();
        try {
            $stmt = $db->prepare("SELECT setting_value FROM settings WHERE setting_key = 'landing_page_cms'");
            $stmt->execute();
            $val = $stmt->fetchColumn();
            if ($val) {
                $decoded = json_decode($val, true);
                if (is_array($decoded)) {
                    return $decoded;
                }
            }
        } catch (\Throwable $e) {
            // fallback
        }

        return [
            'badgeText' => 'The Complete AI-Powered Operating System for Indian Businesses & Agencies',
            'headline' => 'Automate Sales, Qualify Leads, & Close Deals with',
            'headlineHighlight' => 'Autonomous AI',
            'subtitle' => 'From website inquiry to signed proposal in seconds. BharatAI unites CRM pipelines, 24/7 customer chatbots, AI lead scoring, and automated follow-ups in a production-ready multi-tenant SaaS.',
            'primaryCtaText' => 'Access Live Operating System',
            'backendLabel' => 'Native PHP 8.2+',
            'databaseLabel' => 'MySQL 8.0+ InnoDB',
            'aiEngineLabel' => 'Gemini 3.7 Flash',
            'deploymentLabel' => '1-Click cPanel / VPS',
            'featuresTitle' => 'Built for Real Business Workflows',
            'featuresSubtitle' => 'Every feature connects to live backend database storage and real multi-provider AI routing',
            'pricingTitle' => 'Simple, Transparent Pricing',
            'pricingSubtitle' => 'Scale your business with automated AI workflows and multi-tenant management.',
            'footerCopyright' => '© 2026 BharatAI Business OS. Built for High-Growth Indian SMBs & Agencies.',
        ];
    }

    /**
     * Save Landing Page CMS Content into Database
     */
    public function updateLandingSettings(array $settings): void {
        $db = Database::getInstance();
        $json = json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        try {
            $stmt = $db->prepare("
                INSERT INTO settings (setting_key, setting_value, setting_group)
                VALUES ('landing_page_cms', :val, 'cms')
                ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()
            ");
            $stmt->execute(['val' => $json]);
            ResponseHelper::success(['updated' => true], 'Landing page CMS content successfully saved.');
        } catch (\Throwable $e) {
            ResponseHelper::error('Failed to save landing page settings: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get System and SMTP Settings
     */
    public function getSystemSettings(): array {
        $db = Database::getInstance();
        try {
            $stmt = $db->prepare("SELECT setting_value FROM settings WHERE setting_key = 'system_branding_smtp'");
            $stmt->execute();
            $val = $stmt->fetchColumn();
            if ($val) {
                $decoded = json_decode($val, true);
                if (is_array($decoded)) {
                    return $decoded;
                }
            }
        } catch (\Throwable $e) {
            // fallback
        }

        return [
            'platformName' => 'BharatAI Business OS',
            'tagline' => 'Autonomous Business Operations & AI CRM',
            'supportEmail' => 'support@bharatai.os',
            'defaultCurrency' => 'INR',
            'currencySymbol' => '₹',
            'smtpHost' => 'smtp.mailgun.org',
            'smtpPort' => 587,
            'smtpUsername' => 'postmaster@bharatai.os',
            'smtpFromEmail' => 'noreply@bharatai.os',
            'smtpFromName' => 'BharatAI Notifications',
            'enablePublicRegistration' => true,
            'maintenanceMode' => false,
            'googleAuthEnabled' => (bool)env('GOOGLE_AUTH_ENABLED', false),
            'googleClientId' => env('GOOGLE_CLIENT_ID', ''),
            'googleClientSecret' => env('GOOGLE_CLIENT_SECRET', ''),
            'googleRedirectUri' => env('GOOGLE_REDIRECT_URI', ''),
        ];
    }

    /**
     * Update System & SMTP Settings
     */
    public function updateSystemSettings(array $settings): void {
        $db = Database::getInstance();
        $json = json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        try {
            $stmt = $db->prepare("
                INSERT INTO settings (setting_key, setting_value, setting_group)
                VALUES ('system_branding_smtp', :val, 'system')
                ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()
            ");
            $stmt->execute(['val' => $json]);
            ResponseHelper::success(['updated' => true], 'System & SMTP settings saved.');
        } catch (\Throwable $e) {
            ResponseHelper::error('Failed to save system settings: ' . $e->getMessage(), 500);
        }
    }
}
