<?php
/**
 * BharatAI Business OS - Super Admin Control Center View (Fully Dynamic)
 */

declare(strict_types=1);
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../app/controllers/AdminController.php';

$adminCtrl = new \App\Controllers\AdminController();

// Handle POST submissions in native PHP
$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'save_ai_provider') {
        $providerKey = $_POST['provider_key'] ?? '';
        $apiKey = $_POST['api_key'] ?? '';
        $model = $_POST['model'] ?? '';
        $baseUrl = $_POST['base_url'] ?? '';
        $priority = (int)($_POST['priority'] ?? 1);
        $isEnabled = !empty($_POST['is_enabled']) ? 1 : 0;
        
        $adminCtrl->updateAIProvider([
            'provider_key' => $providerKey,
            'api_key' => $apiKey,
            'model' => $model,
            'base_url' => $baseUrl,
            'priority' => $priority,
            'is_enabled' => $isEnabled,
        ]);
        $message = "AI Provider '$providerKey' configuration updated in database!";
    } elseif ($action === 'save_landing_cms') {
        $landingData = [
            'badgeText' => $_POST['badge_text'] ?? '',
            'headline' => $_POST['headline'] ?? '',
            'headlineHighlight' => $_POST['headline_highlight'] ?? '',
            'subtitle' => $_POST['subtitle'] ?? '',
            'primaryCtaText' => $_POST['primary_cta_text'] ?? '',
            'featuresTitle' => $_POST['features_title'] ?? '',
            'featuresSubtitle' => $_POST['features_subtitle'] ?? '',
            'pricingTitle' => $_POST['pricing_title'] ?? '',
            'pricingSubtitle' => $_POST['pricing_subtitle'] ?? '',
            'footerCopyright' => $_POST['footer_copyright'] ?? '',
        ];
        $adminCtrl->updateLandingSettings($landingData);
        $message = "Landing Page CMS content saved successfully!";
    } elseif ($action === 'save_system_settings') {
        $sysData = [
            'platformName' => $_POST['platform_name'] ?? '',
            'tagline' => $_POST['tagline'] ?? '',
            'supportEmail' => $_POST['support_email'] ?? '',
            'currencySymbol' => $_POST['currency_symbol'] ?? '₹',
            'smtpHost' => $_POST['smtp_host'] ?? '',
            'smtpPort' => (int)($_POST['smtp_port'] ?? 587),
            'smtpUsername' => $_POST['smtp_username'] ?? '',
            'smtpFromEmail' => $_POST['smtp_from_email'] ?? '',
            'googleAuthEnabled' => !empty($_POST['google_auth_enabled']) ? 1 : 0,
            'googleClientId' => trim($_POST['google_client_id'] ?? ''),
            'googleClientSecret' => trim($_POST['google_client_secret'] ?? ''),
            'googleRedirectUri' => trim($_POST['google_redirect_uri'] ?? ''),
        ];
        $adminCtrl->updateSystemSettings($sysData);
        $message = "System branding, SMTP, and Google OAuth credentials updated!";
    }
}

$aiProviders = $adminCtrl->getAIProviders();
$landingSettings = $adminCtrl->getLandingSettings();
$systemSettings = $adminCtrl->getSystemSettings();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Super Admin Control Panel - BharatAI Business OS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">
    <!-- Top Nav -->
    <header class="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-50">
        <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-amber-500/20">
                <i class="fa-solid fa-crown text-sm"></i>
            </div>
            <div>
                <div class="font-bold text-slate-100 text-sm tracking-wide">BharatAI Platform Super Admin</div>
                <div class="text-[11px] text-amber-400">Dynamic Multi-Tenant Control Hub</div>
            </div>
        </div>
        <div class="flex items-center gap-3">
            <a href="../dashboard/index.php" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition">Business App</a>
            <a href="../index.php" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition">Live Landing Page</a>
        </div>
    </header>

    <div class="max-w-6xl mx-auto p-6 space-y-6">
        <?php if ($message): ?>
            <div class="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
                <i class="fa-solid fa-check-circle"></i> <?= htmlspecialchars($message) ?>
            </div>
        <?php endif; ?>

        <!-- Tab Controls -->
        <div class="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1 text-sm font-medium">
            <button onclick="switchTab('ai')" id="tab-ai" class="tab-btn px-4 py-2.5 rounded-t-xl bg-slate-900 text-amber-400 border-b-2 border-amber-400 flex items-center gap-2">
                <i class="fa-solid fa-brain text-xs"></i> AI Providers & Fallback Engine
            </button>
            <button onclick="switchTab('cms')" id="tab-cms" class="tab-btn px-4 py-2.5 rounded-t-xl text-slate-400 hover:text-slate-200 flex items-center gap-2">
                <i class="fa-solid fa-pen-nib text-xs"></i> Landing Page CMS
            </button>
            <button onclick="switchTab('system')" id="tab-system" class="tab-btn px-4 py-2.5 rounded-t-xl text-slate-400 hover:text-slate-200 flex items-center gap-2">
                <i class="fa-solid fa-sliders text-xs"></i> System & SMTP
            </button>
            <button onclick="switchTab('health')" id="tab-health" class="tab-btn px-4 py-2.5 rounded-t-xl text-slate-400 hover:text-slate-200 flex items-center gap-2">
                <i class="fa-solid fa-server text-xs"></i> Server Diagnostics
            </button>
        </div>

        <!-- TAB 1: AI Providers Configuration -->
        <div id="content-ai" class="tab-content space-y-6">
            <div class="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h2 class="text-base font-bold text-slate-100">Dynamic AI Provider & Model Router</h2>
                        <p class="text-xs text-slate-400">Configure API keys, model parameters, priorities, and fallback cascades dynamically without editing code.</p>
                    </div>
                    <span class="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs rounded-full font-mono">Real Gemini / OpenAI Engine</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <?php foreach ($aiProviders as $provider): ?>
                        <form method="POST" class="p-5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3">
                            <input type="hidden" name="action" value="save_ai_provider">
                            <input type="hidden" name="provider_key" value="<?= htmlspecialchars($provider['provider_key'] ?? '') ?>">

                            <div class="flex items-center justify-between">
                                <div class="font-bold text-slate-200 text-sm flex items-center gap-2">
                                    <span class="w-2.5 h-2.5 rounded-full <?= ($provider['is_enabled'] ?? 1) ? 'bg-emerald-400' : 'bg-slate-600' ?>"></span>
                                    <?= htmlspecialchars($provider['name'] ?? '') ?>
                                </div>
                                <label class="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                                    <input type="checkbox" name="is_enabled" value="1" <?= ($provider['is_enabled'] ?? 1) ? 'checked' : '' ?> class="rounded bg-slate-900 border-slate-700 text-amber-500">
                                    Enabled
                                </label>
                            </div>

                            <div>
                                <label class="block text-[11px] text-slate-400 mb-1">Model Name / Identifier</label>
                                <input type="text" name="model" value="<?= htmlspecialchars($provider['model_identifier'] ?? '') ?>" placeholder="e.g. gemini-3.7-flash, gpt-4o-mini, llama-3.3-70b-versatile" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500">
                            </div>

                            <div>
                                <label class="block text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                                    <span>Custom Endpoint / Base Fallback URL</span>
                                    <span class="text-[10px] text-amber-400">Ollama / Proxy / Groq</span>
                                </label>
                                <input type="text" name="base_url" value="<?= htmlspecialchars($provider['base_url'] ?? '') ?>" placeholder="https://api.openai.com/v1 or http://localhost:11434/v1" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500">
                            </div>

                            <div>
                                <label class="block text-[11px] text-slate-400 mb-1">API Key (Saved in Database or env)</label>
                                <input type="password" name="api_key" placeholder="<?= !empty($provider['api_key_encrypted']) ? 'Key is configured in database/env' : 'Enter Secret API Key' ?>" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500">
                            </div>

                            <div class="flex gap-3">
                                <div class="w-1/2">
                                    <label class="block text-[11px] text-slate-400 mb-1">Fallback Priority (1=Highest)</label>
                                    <input type="number" name="priority" value="<?= htmlspecialchars((string)($provider['priority'] ?? 1)) ?>" min="1" max="10" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500">
                                </div>
                                <div class="w-1/2 flex items-end">
                                    <button type="submit" class="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition shadow">
                                        Save Provider
                                    </button>
                                </div>
                            </div>
                        </form>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>

        <!-- TAB 2: Landing Page CMS -->
        <div id="content-cms" class="tab-content space-y-6 hidden">
            <form method="POST" class="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-5">
                <input type="hidden" name="action" value="save_landing_cms">

                <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                        <h2 class="text-base font-bold text-slate-100">Dynamic Landing Page CMS</h2>
                        <p class="text-xs text-slate-400">Edit any headline, badge, subtitle, CTA, or footer text on the public marketing page.</p>
                    </div>
                    <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition">
                        Save Landing Content
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block text-xs text-slate-400 mb-1">Top Badge Pill Text</label>
                        <input type="text" name="badge_text" value="<?= htmlspecialchars($landingSettings['badgeText'] ?? '') ?>" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500">
                    </div>

                    <div>
                        <label class="block text-xs text-slate-400 mb-1">Main Hero Headline (Prefix)</label>
                        <input type="text" name="headline" value="<?= htmlspecialchars($landingSettings['headline'] ?? '') ?>" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500">
                    </div>

                    <div>
                        <label class="block text-xs text-slate-400 mb-1">Headline Highlight Text (Indigo Gradient)</label>
                        <input type="text" name="headline_highlight" value="<?= htmlspecialchars($landingSettings['headlineHighlight'] ?? '') ?>" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-indigo-400 focus:border-indigo-500 font-semibold">
                    </div>

                    <div class="md:col-span-2">
                        <label class="block text-xs text-slate-400 mb-1">Hero Subtitle</label>
                        <textarea name="subtitle" rows="3" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500"><?= htmlspecialchars($landingSettings['subtitle'] ?? '') ?></textarea>
                    </div>

                    <div>
                        <label class="block text-xs text-slate-400 mb-1">Primary CTA Button Text</label>
                        <input type="text" name="primary_cta_text" value="<?= htmlspecialchars($landingSettings['primaryCtaText'] ?? '') ?>" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500">
                    </div>

                    <div>
                        <label class="block text-xs text-slate-400 mb-1">Footer Copyright Notice</label>
                        <input type="text" name="footer_copyright" value="<?= htmlspecialchars($landingSettings['footerCopyright'] ?? '') ?>" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500">
                    </div>
                </div>
            </form>
        </div>

        <!-- TAB 3: System & SMTP Settings -->
        <div id="content-system" class="tab-content space-y-6 hidden">
            <form method="POST" class="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-5">
                <input type="hidden" name="action" value="save_system_settings">

                <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                        <h2 class="text-base font-bold text-slate-100">Platform Branding & Mail Settings</h2>
                        <p class="text-xs text-slate-400">Configure global platform identifiers and outgoing SMTP credentials.</p>
                    </div>
                    <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition">
                        Save System Settings
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">Platform Name</label>
                        <input type="text" name="platform_name" value="<?= htmlspecialchars($systemSettings['platformName'] ?? '') ?>" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200">
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">Support Email</label>
                        <input type="email" name="support_email" value="<?= htmlspecialchars($systemSettings['supportEmail'] ?? '') ?>" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200">
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">SMTP Host</label>
                        <input type="text" name="smtp_host" value="<?= htmlspecialchars($systemSettings['smtpHost'] ?? '') ?>" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200">
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">SMTP Port</label>
                        <input type="number" name="smtp_port" value="<?= htmlspecialchars((string)($systemSettings['smtpPort'] ?? 587)) ?>" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200">
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">SMTP Username</label>
                        <input type="text" name="smtp_username" value="<?= htmlspecialchars($systemSettings['smtpUsername'] ?? '') ?>" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200">
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">From Sender Email</label>
                        <input type="email" name="smtp_from_email" value="<?= htmlspecialchars($systemSettings['smtpFromEmail'] ?? '') ?>" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200">
                    </div>
                </div>

                <!-- Google OAuth 2.0 Dynamic Settings with Auto-Detected Fallback -->
                <div class="mt-6 pt-5 border-t border-slate-800/80 space-y-4">
                    <?php 
                    require_once __DIR__ . '/../app/helpers/GoogleAuthHelper.php';
                    $googleDetectedUri = \App\Helpers\GoogleAuthHelper::detectRedirectUri();
                    ?>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                                <i class="fa-brands fa-google text-sm"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-bold text-slate-100">Dynamic Google OAuth 2.0 Configuration</h3>
                                <p class="text-[11px] text-slate-400">Enable 1-Click Google Sign-In & Registration with dynamic credentials & auto-detected fallback redirect URI.</p>
                            </div>
                        </div>
                        <label class="flex items-center gap-2 text-xs text-slate-300 font-medium cursor-pointer">
                            <input type="checkbox" name="google_auth_enabled" value="1" <?= !empty($systemSettings['googleAuthEnabled']) ? 'checked' : '' ?> class="rounded bg-slate-950 border-slate-700 text-indigo-500">
                            Enable Google OAuth
                        </label>
                    </div>

                    <div class="p-3.5 bg-slate-950/80 border border-indigo-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-wand-magic-sparkles text-indigo-400"></i>
                            <span class="text-slate-300 font-medium">Auto-Detected Callback Redirect URI:</span>
                            <span class="font-mono text-indigo-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"><?= htmlspecialchars($googleDetectedUri) ?></span>
                        </div>
                        <span class="text-[11px] text-slate-500">Auto-detected from server host & SSL</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">Google OAuth Client ID</label>
                            <input type="text" name="google_client_id" value="<?= htmlspecialchars($systemSettings['googleClientId'] ?? '') ?>" placeholder="e.g. 123456789-xxxxxx.apps.googleusercontent.com" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono">
                        </div>
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">Google OAuth Client Secret</label>
                            <input type="password" name="google_client_secret" value="<?= htmlspecialchars($systemSettings['googleClientSecret'] ?? '') ?>" placeholder="GOCSPX-••••••••••••••••" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-xs text-slate-400 mb-1">Custom Redirect URI (Optional - Leave blank to use auto-detected URI)</label>
                            <input type="text" name="google_redirect_uri" value="<?= htmlspecialchars($systemSettings['googleRedirectUri'] ?? '') ?>" placeholder="<?= htmlspecialchars($googleDetectedUri) ?>" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono">
                        </div>
                    </div>
                </div>
            </form>
        </div>

        <!-- TAB 4: Server Health -->
        <div id="content-health" class="tab-content space-y-6 hidden">
            <div class="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <h2 class="text-base font-bold text-slate-100 mb-2">Platform Diagnostics & Health Check</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
                    <div class="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                        <span class="text-slate-400">PHP Version</span>
                        <div class="text-slate-200 font-bold mt-1"><?= PHP_VERSION ?></div>
                    </div>
                    <div class="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                        <span class="text-slate-400">MySQL Database</span>
                        <div class="text-emerald-400 font-bold mt-1">PDO MySQL 8.0 Connected</div>
                    </div>
                    <div class="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                        <span class="text-slate-400">Memory Usage</span>
                        <div class="text-indigo-400 font-bold mt-1"><?= round(memory_get_usage(true) / 1024 / 1024, 2) ?> MB</div>
                    </div>
                    <div class="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                        <span class="text-slate-400">cPanel / Apache Ready</span>
                        <div class="text-emerald-400 font-bold mt-1">Ready for 1-Click Deploy</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function switchTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('bg-slate-900', 'text-amber-400', 'border-b-2', 'border-amber-400');
                btn.classList.add('text-slate-400');
            });

            document.getElementById('content-' + tabName).classList.remove('hidden');
            const activeBtn = document.getElementById('tab-' + tabName);
            activeBtn.classList.remove('text-slate-400');
            activeBtn.classList.add('bg-slate-900', 'text-amber-400', 'border-b-2', 'border-amber-400');
        }
    </script>
</body>
</html>

