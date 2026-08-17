<?php
/**
 * BharatAI Business OS - Business & Settings Controller
 */

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\ResponseHelper;
use App\Helpers\ValidationHelper;
use App\Models\Business;
use Database;
use PDO;

class BusinessController {
    public function show(int $businessId): void {
        $biz = Business::findById($businessId);
        if (!$biz) {
            ResponseHelper::error('Business not found.', 404);
            return;
        }
        ResponseHelper::success($biz, 'Business profile loaded.');
    }

    public function update(int $businessId, array $data): void {
        $db = Database::getInstance();
        $stmt = $db->prepare("
            UPDATE businesses SET
                name = :name,
                business_type = :business_type,
                industry = :industry,
                website = :website,
                phone = :phone,
                email = :email,
                currency = :currency,
                timezone = :timezone,
                about = :about,
                usp = :usp,
                updated_at = NOW()
            WHERE id = :id AND deleted_at IS NULL
        ");
        $stmt->execute([
            'name' => ValidationHelper::sanitizeString($data['name'] ?? ''),
            'business_type' => $data['business_type'] ?? 'Agency',
            'industry' => $data['industry'] ?? 'General',
            'website' => $data['website'] ?? null,
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'] ?? null,
            'currency' => $data['currency'] ?? 'INR',
            'timezone' => $data['timezone'] ?? 'Asia/Kolkata',
            'about' => $data['about'] ?? '',
            'usp' => $data['usp'] ?? '',
            'id' => $businessId,
        ]);

        ResponseHelper::success(['id' => $businessId], 'Business settings updated.');
    }
}
