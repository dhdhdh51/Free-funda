<?php
/**
 * BharatAI Business OS - Native Google OAuth Callback Handler
 * Handles Google Login, auto-provisions user & multi-tenant business workspace if new,
 * and seamlessly redirects to dashboard with session initialization.
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../app/helpers/GoogleAuthHelper.php';
require_once __DIR__ . '/../../app/models/User.php';
require_once __DIR__ . '/../../app/models/Business.php';

use App\Helpers\GoogleAuthHelper;
use App\Models\User;
use App\Models\Business;

$error = null;
$code = $_GET['code'] ?? '';
$state = $_GET['state'] ?? '';

if (empty($code)) {
    $error = $_GET['error'] ?? 'Google authentication was cancelled or no authorization code was returned.';
} else {
    try {
        $googleProfile = GoogleAuthHelper::handleCallback($code);
        if (!$googleProfile || empty($googleProfile['email'])) {
            throw new \Exception('Failed to retrieve verified email from Google profile.');
        }

        $email = $googleProfile['email'];
        $name = $googleProfile['name'] ?: explode('@', $email)[0];
        $avatar = $googleProfile['avatar'] ?? null;

        // Check if user already exists
        $user = User::findByEmail($email);

        if (!$user) {
            // Auto-create user
            $tempPassword = bin2hex(random_bytes(16));
            $userId = User::create([
                'name' => $name,
                'email' => $email,
                'password' => $tempPassword,
                'role' => 'BUSINESS_OWNER',
                'avatar' => $avatar,
            ]);

            // Auto-create primary workspace
            $companyName = ucwords(explode('@', $email)[0]) . ' Workspace';
            $bizId = Business::create([
                'name' => $companyName,
                'business_type' => 'Services',
                'industry' => 'General',
                'plan' => 'Growth Pro',
            ], $userId);

            $user = User::findById($userId);
            $businesses = Business::getUserBusinesses ? Business::getUserBusinesses($userId) : [['id' => $bizId, 'name' => $companyName]];
            $primaryBizId = $bizId;
        } else {
            $userId = (int)$user['id'];
            $businesses = User::getUserBusinesses($userId);
            $primaryBizId = !empty($businesses[0]['id']) ? (int)$businesses[0]['id'] : 1;
        }

        // Set session
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_email'] = $email;
        $_SESSION['user_name'] = $name;
        $_SESSION['user_role'] = $user['role'] ?? 'BUSINESS_OWNER';
        $_SESSION['current_business_id'] = $primaryBizId;
        $_SESSION['auth_provider'] = 'google';
        $_SESSION['avatar'] = $avatar;

        // Redirect to dashboard or home
        header("Location: /dashboard/index.php");
        exit;
    } catch (\Throwable $e) {
        $error = "Google Sign-In Error: " . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Sign-In Status - BharatAI Business OS</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
        <div class="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
        </div>
        <h2 class="text-lg font-bold text-slate-100 mb-2">Google Authentication Notice</h2>
        <p class="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 p-3 rounded-xl mb-6 text-left">
            <?= htmlspecialchars($error ?: 'An unknown error occurred during OAuth handshake.') ?>
        </p>
        <div class="space-y-3">
            <a href="/auth/login.php" class="block w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition">
                Return to Login
            </a>
            <a href="/admin/index.php?tab=system" class="block w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition">
                Configure Google OAuth in Admin Panel
            </a>
        </div>
    </div>
</body>
</html>
