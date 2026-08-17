<?php
/**
 * BharatAI Business OS - Public Website Chatbot Widget Endpoint: /api/chat/widget.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../app/helpers/ResponseHelper.php';
require_once __DIR__ . '/../../app/models/Business.php';
require_once __DIR__ . '/../../app/models/Lead.php';
require_once __DIR__ . '/../../app/services/AIService.php';
require_once __DIR__ . '/../../app/services/KnowledgeBaseService.php';
require_once __DIR__ . '/../../app/controllers/ChatbotController.php';

use App\Controllers\ChatbotController;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$controller = new ChatbotController();
$controller->handlePublicMessage($input);
