<?php
/**
 * BharatAI Business OS - First-Run System Installer
 */

declare(strict_types=1);

$step = $_GET['step'] ?? '1';
$error = null;
$success = null;

$checks = [
    'PHP 8.2+' => version_compare(PHP_VERSION, '8.2.0', '>='),
    'PDO Extension' => extension_loaded('pdo'),
    'PDO MySQL Extension' => extension_loaded('pdo_mysql'),
    'cURL Extension' => extension_loaded('curl'),
    'OpenSSL Extension' => extension_loaded('openssl'),
    'JSON Extension' => extension_loaded('json'),
    'mbstring Extension' => extension_loaded('mbstring'),
    'storage/ directory writable' => is_writable(__DIR__ . '/../storage') || @mkdir(__DIR__ . '/../storage', 0755, true),
];

$allPassed = !in_array(false, $checks, true);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setup Installer - BharatAI Business OS</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-lg">B</div>
            <div>
                <h1 class="text-xl font-bold">BharatAI OS Setup Wizard</h1>
                <p class="text-xs text-slate-400">Step 1 of 3: Server Requirements & Environment</p>
            </div>
        </div>

        <div class="space-y-3 mb-6">
            <?php foreach ($checks as $name => $passed): ?>
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <span class="text-slate-300 font-medium"><?= htmlspecialchars($name) ?></span>
                    <?php if ($passed): ?>
                        <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">Passed ✓</span>
                    <?php else: ?>
                        <span class="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">Missing ✗</span>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 mb-6">
            <strong>Next Step:</strong> Ensure you have imported <code>/database/schema.sql</code> into your MySQL database and configured database credentials in <code>.env</code>.
        </div>

        <a href="/auth/login.php" class="block w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-center text-sm font-semibold transition">
            Continue to Application Login →
        </a>
    </div>
</body>
</html>
