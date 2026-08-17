<?php
/**
 * BharatAI Business OS - Direct API Endpoint: /api/auth/login.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../app/helpers/ResponseHelper.php';
require_once __DIR__ . '/../../app/helpers/ValidationHelper.php';
require_once __DIR__ . '/../../app/models/User.php';
require_once __DIR__ . '/../../app/models/Business.php';
require_once __DIR__ . '/../../app/controllers/AuthController.php';

use App\Controllers\AuthController;

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$auth = new AuthController();
$auth->login($input);
