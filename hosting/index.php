<?php
/**
 * BharatAI Business OS - Web Entry Point & Dispatcher
 * Compatible with Apache mod_rewrite / cPanel / Shared Hosting
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

// Quick router for PHP requests
$route = $_GET['route'] ?? '';
$route = trim($route, '/');

// If API request, hand over to API router
if (str_starts_with($route, 'api/') || isset($_GET['endpoint'])) {
    require_once __DIR__ . '/api/index.php';
    exit;
}

// In single-page mode or direct web view, provide health check or serve UI assets
if ($route === 'health' || $route === 'api/health') {
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'ok',
        'app' => APP_NAME,
        'version' => '1.0.0',
        'php_version' => PHP_VERSION,
        'timestamp' => date('Y-m-d H:i:s'),
        'timezone' => date_default_timezone_get()
    ]);
    exit;
}

// Serve the web application HTML
if (file_exists(__DIR__ . '/public/index.html')) {
    readfile(__DIR__ . '/public/index.html');
    exit;
}

// Default fallback response
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars(APP_NAME) ?> - AI Business Automation SaaS</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-center p-6">
    <div class="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-6">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <h1 class="text-3xl font-bold tracking-tight text-white mb-2"><?= htmlspecialchars(APP_NAME) ?></h1>
        <p class="text-slate-400 text-sm mb-6">Autonomous Business Operations, AI CRM & Sales Intelligence Platform</p>
        <div class="grid grid-cols-2 gap-4 text-center mb-8 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs">
            <div><span class="text-slate-400 font-medium block">Lead Velocity</span> <span class="text-white font-bold font-mono text-sm">10x Acceleration</span></div>
            <div><span class="text-slate-400 font-medium block">Uptime Guarantee</span> <span class="text-emerald-400 font-bold font-mono text-sm">99.99% SLA</span></div>
        </div>
        <div class="flex items-center justify-center gap-3">
            <a href="/dashboard" class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all">Launch Platform</a>
        </div>
    </div>
</body>
</html>
