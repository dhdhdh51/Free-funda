<?php
/**
 * BharatAI Business OS - Auth Controller
 */

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\ResponseHelper;
use App\Helpers\ValidationHelper;
use App\Models\User;
use App\Models\Business;
use Database;

class AuthController {
    public function register(array $data): void {
        $errors = ValidationHelper::validateRequired($data, ['name', 'email', 'password', 'business_name']);
        if (!empty($errors)) {
            ResponseHelper::error(implode(', ', $errors), 422);
            return;
        }

        if (!ValidationHelper::validateEmail($data['email'])) {
            ResponseHelper::error('Invalid email format.', 422);
            return;
        }

        if (User::findByEmail($data['email'])) {
            ResponseHelper::error('Email is already registered.', 409);
            return;
        }

        try {
            $userId = User::create([
                'name' => ValidationHelper::sanitizeString($data['name']),
                'email' => $data['email'],
                'password' => $data['password'],
                'phone' => $data['phone'] ?? null,
                'role' => 'BUSINESS_OWNER',
            ]);

            $businessId = Business::create([
                'name' => ValidationHelper::sanitizeString($data['business_name']),
                'business_type' => $data['business_type'] ?? 'Agency',
                'industry' => $data['industry'] ?? 'General',
                'plan' => 'Growth Pro',
            ], $userId);

            $_SESSION['user_id'] = $userId;
            $_SESSION['user_email'] = $data['email'];
            $_SESSION['user_role'] = 'BUSINESS_OWNER';
            $_SESSION['current_business_id'] = $businessId;

            ResponseHelper::success([
                'user_id' => $userId,
                'business_id' => $businessId,
                'message' => 'Registration successful.'
            ], 'User created and business initialized.');
        } catch (\Throwable $e) {
            ResponseHelper::error('Registration failed: ' . $e->getMessage(), 500);
        }
    }

    public function login(array $data): void {
        $errors = ValidationHelper::validateRequired($data, ['email', 'password']);
        if (!empty($errors)) {
            ResponseHelper::error(implode(', ', $errors), 422);
            return;
        }

        $user = User::findByEmail($data['email']);
        if (!$user || !password_verify($data['password'], $user['password_hash'])) {
            ResponseHelper::error('Invalid email or password credentials.', 401);
            return;
        }

        if (empty($user['is_active'])) {
            ResponseHelper::error('Your account is inactive. Please contact support.', 403);
            return;
        }

        $businesses = User::getUserBusinesses((int)$user['id']);
        $primaryBizId = !empty($businesses[0]['id']) ? (int)$businesses[0]['id'] : 1;

        $_SESSION['user_id'] = (int)$user['id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['current_business_id'] = $primaryBizId;

        // Generate token for API use
        $token = bin2hex(random_bytes(32));
        $_SESSION['auth_token'] = $token;

        ResponseHelper::success([
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
            ],
            'businesses' => $businesses,
            'current_business_id' => $primaryBizId
        ], 'Login successful');
    }

    public function logout(): void {
        session_unset();
        session_destroy();
        ResponseHelper::success([], 'Logged out successfully');
    }
}
