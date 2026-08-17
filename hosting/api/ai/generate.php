<?php
/**
 * BharatAI Business OS - Direct API Endpoint: /api/ai/generate.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../app/helpers/ResponseHelper.php';
require_once __DIR__ . '/../../app/middleware/AuthMiddleware.php';
require_once __DIR__ . '/../../app/services/AIService.php';
require_once __DIR__ . '/../../app/services/KnowledgeBaseService.php';
require_once __DIR__ . '/../../app/models/Business.php';
require_once __DIR__ . '/../../app/controllers/AIController.php';

use App\Middleware\AuthMiddleware;
use App\Controllers\AIController;

$auth = AuthMiddleware::authenticate();
$businessId = $auth['business_id'];
$controller = new AIController();

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$action = $_GET['action'] ?? 'chat';

if ($action === 'marketing') {
    $controller->generateMarketingContent($businessId, $input);
} else {
    $controller->assistantChat($businessId, $input);
}
