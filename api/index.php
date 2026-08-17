<?php
/**
 * BharatAI Business OS - REST API Router & Dispatcher
 */

declare(strict_types=1);

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../app/helpers/ResponseHelper.php';
require_once __DIR__ . '/../app/helpers/SecurityHelper.php';
require_once __DIR__ . '/../app/middleware/AuthMiddleware.php';
require_once __DIR__ . '/../app/services/AIService.php';
require_once __DIR__ . '/../app/services/CRMService.php';

// Set standard JSON headers and CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$endpoint = $_GET['endpoint'] ?? '';
$endpoint = trim($endpoint, '/');
$method = $_SERVER['REQUEST_METHOD'];

// Parse JSON Body
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true) ?? $_POST;

try {
    switch ($endpoint) {
        case 'health':
        case 'v1/health':
            ResponseHelper::success([
                'status' => 'operational',
                'database' => 'connected',
                'app' => APP_NAME,
                'php' => PHP_VERSION,
                'time' => date('c')
            ], 'API system operational');
            break;

        case 'v1/auth/login':
            if ($method !== 'POST') ResponseHelper::error('Method not allowed', [], 405);
            $email = SecurityHelper::sanitizeEmail($input['email'] ?? '');
            $password = $input['password'] ?? '';
            
            $db = Database::getConnection();
            $stmt = $db->prepare("SELECT * FROM users WHERE email = :email AND deleted_at IS NULL LIMIT 1");
            $stmt->execute(['email' => $email]);
            $user = $stmt->fetch();

            if ($user && SecurityHelper::verifyPassword($password, $user['password_hash'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['role_id'] = $user['role_id'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['name'] = $user['first_name'] . ' ' . ($user['last_name'] ?? '');
                
                $token = bin2hex(random_bytes(32));
                $db->prepare("UPDATE users SET remember_token = :token, last_login_at = NOW() WHERE id = :id")->execute(['token' => $token, 'id' => $user['id']]);

                ResponseHelper::success([
                    'token' => $token,
                    'user' => [
                        'id' => $user['id'],
                        'email' => $user['email'],
                        'name' => $_SESSION['name'],
                        'role_id' => $user['role_id']
                    ]
                ], 'Login successful');
            } else {
                ResponseHelper::error('Invalid email or password credentials', [], 401);
            }
            break;

        case 'v1/leads':
            $user = AuthMiddleware::authenticate();
            $crm = new CRMService();
            $bizId = (int)($input['business_id'] ?? $_GET['business_id'] ?? 1);

            if ($method === 'GET') {
                $leads = $crm->getLeads($bizId, $_GET);
                ResponseHelper::success($leads, 'Leads retrieved successfully');
            } elseif ($method === 'POST') {
                $leadId = $crm->createLead($bizId, $input, $user['user_id']);
                ResponseHelper::success(['lead_id' => $leadId], 'Lead created successfully', 201);
            }
            break;

        case 'v1/ai/qualify-lead':
            if ($method !== 'POST') ResponseHelper::error('Method not allowed', [], 405);
            $user = AuthMiddleware::authenticate();
            $ai = new AIService();
            $bizId = (int)($input['business_id'] ?? 1);
            $leadData = $input['lead'] ?? $input;

            $result = $ai->qualifyLead($leadData, $bizId, $user['user_id']);
            if ($result['success']) {
                ResponseHelper::success($result['data'], 'Lead AI qualification complete');
            } else {
                ResponseHelper::error($result['error'] ?? 'AI Qualification failed');
            }
            break;

        case 'v1/ai/generate':
            if ($method !== 'POST') ResponseHelper::error('Method not allowed', [], 405);
            $user = AuthMiddleware::authenticate();
            $ai = new AIService();
            $prompt = $input['prompt'] ?? '';
            $feature = $input['feature'] ?? 'assistant';
            $bizId = (int)($input['business_id'] ?? 1);

            $result = $ai->generate($prompt, $feature, $bizId, $user['user_id'], $input['options'] ?? []);
            if ($result['success']) {
                ResponseHelper::success($result, 'AI Generation successful');
            } else {
                ResponseHelper::error($result['error'] ?? 'AI generation failed');
            }
            break;

        default:
            ResponseHelper::notFound("API endpoint '/api/{$endpoint}' not found.");
            break;
    }
} catch (Throwable $e) {
    if (APP_DEBUG) {
        ResponseHelper::error("API Internal Error: " . $e->getMessage(), ['trace' => $e->getTraceAsString()], 500);
    } else {
        error_log("API Error: " . $e->getMessage());
        ResponseHelper::error("Internal server error occurred.", [], 500);
    }
}
