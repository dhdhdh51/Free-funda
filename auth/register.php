<?php
/**
 * BharatAI Business OS - Native PHP Register View
 */

declare(strict_types=1);
require_once __DIR__ . '/../config.php';

$error = null;
$success = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/../app/helpers/ValidationHelper.php';
    require_once __DIR__ . '/../app/models/User.php';
    require_once __DIR__ . '/../app/models/Business.php';

    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $businessName = trim($_POST['business_name'] ?? '');

    if ($name && $email && $password && $businessName) {
        if (\App\Models\User::findByEmail($email)) {
            $error = "Email address already registered.";
        } else {
            try {
                $userId = \App\Models\User::create([
                    'name' => $name,
                    'email' => $email,
                    'password' => $password,
                ]);
                $bizId = \App\Models\Business::create([
                    'name' => $businessName,
                ], $userId);

                $_SESSION['user_id'] = $userId;
                $_SESSION['user_email'] = $email;
                $_SESSION['current_business_id'] = $bizId;
                header("Location: /dashboard/index.php");
                exit;
            } catch (\Throwable $e) {
                $error = "Registration error: " . $e->getMessage();
            }
        }
    } else {
        $error = "Please fill in all required fields.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Account - BharatAI Business OS</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">B</div>
            <div>
                <h1 class="text-xl font-bold">Register Business</h1>
                <p class="text-xs text-slate-400">Launch your AI Business Automation Suite</p>
            </div>
        </div>

        <?php if ($error): ?>
            <div class="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" class="space-y-4">
            <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                <input type="text" name="name" required placeholder="e.g. Rajesh Kumar" class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500">
            </div>
            <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Company / Business Name</label>
                <input type="text" name="business_name" required placeholder="e.g. Apex Digital Solutions" class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500">
            </div>
            <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                <input type="email" name="email" required placeholder="rajesh@apexdigital.in" class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500">
            </div>
            <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input type="password" name="password" required placeholder="••••••••" class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500">
            </div>
            <button type="submit" class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition">
                Create Free Account
            </button>
        </form>

        <div class="relative my-5">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-800"></div></div>
            <div class="relative flex justify-center text-xs"><span class="px-2 bg-slate-900 text-slate-500 font-medium">Or register with</span></div>
        </div>

        <a href="/auth/google/index.php" class="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition">
            <svg class="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
            </svg>
            <span>Register with Google</span>
        </a>

        <div class="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Already have an account? <a href="/auth/login.php" class="text-indigo-400 font-medium hover:underline">Sign In</a>
        </div>
    </div>
</body>
</html>
