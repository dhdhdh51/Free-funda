<?php
/**
 * BharatAI Business OS - Direct API Endpoint: /api/leads/index.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../app/helpers/ResponseHelper.php';
require_once __DIR__ . '/../../app/helpers/ValidationHelper.php';
require_once __DIR__ . '/../../app/middleware/AuthMiddleware.php';
require_once __DIR__ . '/../../app/models/Lead.php';
require_once __DIR__ . '/../../app/services/CRMService.php';
require_once __DIR__ . '/../../app/services/AIService.php';
require_once __DIR__ . '/../../app/controllers/LeadController.php';

use App\Middleware\AuthMiddleware;
use App\Controllers\LeadController;

$auth = AuthMiddleware::authenticate();
$businessId = $auth['business_id'];
$controller = new LeadController();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $controller->index($businessId);
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    
    // Check if qualifying action
    if (!empty($_GET['action']) && $_GET['action'] === 'qualify' && !empty($input['lead_id'])) {
        $controller->qualify($businessId, (int)$input['lead_id']);
    } else {
        $controller->store($businessId, $input);
    }
}
