<?php
/**
 * BharatAI Business OS - Standalone PHP Dashboard View
 */

declare(strict_types=1);
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../app/models/Business.php';
require_once __DIR__ . '/../app/models/Lead.php';
require_once __DIR__ . '/../app/models/User.php';

$userId = $_SESSION['user_id'] ?? 1;
$user = \App\Models\User::findById((int)$userId) ?? [
    'name' => 'Demo Administrator',
    'email' => 'admin@bharatai.os',
    'role' => 'BUSINESS_OWNER'
];

$businessId = $_SESSION['current_business_id'] ?? 1;
$biz = \App\Models\Business::findById((int)$businessId) ?? [
    'id' => 1,
    'name' => 'Acme Digital Agency',
    'plan' => 'Growth Pro',
    'credits_used' => 42800,
    'credits_limit' => 250000,
];

$leads = \App\Models\Lead::getByBusiness((int)$businessId);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - BharatAI Business OS</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">
    <!-- Top Nav -->
    <header class="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">B</div>
            <div class="font-bold text-slate-100"><?= htmlspecialchars($biz['name']) ?></div>
            <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50"><?= htmlspecialchars($biz['plan']) ?></span>
        </div>
        <div class="flex items-center gap-4 text-xs">
            <span class="text-slate-400">Welcome, <strong class="text-slate-200"><?= htmlspecialchars($user['name']) ?></strong></span>
            <a href="/auth/login.php" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">Logout</a>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div class="text-xs text-slate-400">Total Leads</div>
                <div class="text-2xl font-bold text-slate-100 mt-1"><?= count($leads) ?></div>
            </div>
            <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div class="text-xs text-slate-400">AI Credits Balance</div>
                <div class="text-2xl font-bold text-indigo-400 mt-1"><?= number_format($biz['credits_limit'] - $biz['credits_used']) ?></div>
            </div>
            <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div class="text-xs text-slate-400">Conversion Rate</div>
                <div class="text-2xl font-bold text-emerald-400 mt-1">28.4%</div>
            </div>
            <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div class="text-xs text-slate-400">Server Architecture</div>
                <div class="text-sm font-semibold text-slate-200 mt-2">PHP 8.2 + MySQL 8</div>
            </div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 class="text-base font-bold text-slate-100 mb-4">Recent CRM Inquiries & Leads</h2>
            <?php if (empty($leads)): ?>
                <div class="p-8 text-center text-slate-400 text-sm">No leads recorded in MySQL database yet.</div>
            <?php else: ?>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-slate-950/60 text-slate-400 uppercase tracking-wider">
                            <tr>
                                <th class="p-3">Name</th>
                                <th class="p-3">Company</th>
                                <th class="p-3">Status</th>
                                <th class="p-3">Budget</th>
                                <th class="p-3">AI Score</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800">
                            <?php foreach ($leads as $l): ?>
                                <tr>
                                    <td class="p-3 font-semibold text-slate-200"><?= htmlspecialchars($l['first_name'] . ' ' . ($l['last_name'] ?? '')) ?></td>
                                    <td class="p-3 text-slate-300"><?= htmlspecialchars($l['company_name'] ?? '-') ?></td>
                                    <td class="p-3"><span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><?= htmlspecialchars($l['status']) ?></span></td>
                                    <td class="p-3 text-slate-300"><?= htmlspecialchars($l['budget'] ?? '₹1,00,000') ?></td>
                                    <td class="p-3 text-indigo-400 font-bold"><?= htmlspecialchars((string)($l['ai_score'] ?? 85)) ?> / 100</td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    </main>
</body>
</html>
