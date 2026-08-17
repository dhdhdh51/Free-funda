<?php
/**
 * BharatAI Business OS - Dynamic Google OAuth Redirector
 * Initiates the Google OAuth consent screen with auto-detected redirect URIs
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../app/helpers/GoogleAuthHelper.php';

use App\Helpers\GoogleAuthHelper;

$config = GoogleAuthHelper::getGoogleConfig();

if (empty($config['client_id'])) {
    // If not configured, show helpful guide
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Google OAuth Setup Required - BharatAI Business OS</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
        <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">!</div>
                <div>
                    <h1 class="text-lg font-bold text-slate-100">Google OAuth Credentials Required</h1>
                    <p class="text-xs text-slate-400">Dynamic Google Sign-In is not configured yet.</p>
                </div>
            </div>

            <div class="p-4 bg-slate-950 border border-slate-800 rounded-xl mb-6 space-y-3 text-xs text-slate-300">
                <p>To enable 1-Click Google Sign-In, enter your Google OAuth credentials in the Admin Panel or in your <code>.env</code> file.</p>
                <div>
                    <strong class="text-amber-400 block mb-1">Auto-Detected Redirect URI for your Google Cloud Console:</strong>
                    <div class="p-2.5 bg-slate-900 border border-slate-700 rounded text-[11px] font-mono text-indigo-300 break-all select-all">
                        <?= htmlspecialchars($config['auto_detected_redirect_uri']) ?>
                    </div>
                </div>
                <p class="text-slate-400 text-[11px]">
                    1. Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" class="text-indigo-400 underline">Google Cloud Console &rarr; Credentials</a><br>
                    2. Create an OAuth 2.0 Client ID (Web Application)<br>
                    3. Add the auto-detected URL above to "Authorized redirect URIs"<br>
                    4. Save the Client ID and Secret in your Admin Panel!
                </p>
            </div>

            <div class="flex items-center justify-end gap-3">
                <a href="/auth/login.php" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold">
                    Back to Login
                </a>
                <a href="/admin/index.php?tab=system" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold">
                    Configure in Admin Panel
                </a>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit;
}

$authUrl = GoogleAuthHelper::getAuthUrl();
header("Location: " . $authUrl);
exit;
