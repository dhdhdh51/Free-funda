<?php
/**
 * BharatAI Business OS - Payment Gateway Abstraction
 * Handles Razorpay, Stripe, and Cashfree subscription checkouts & webhooks.
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config.php';

class PaymentService {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function createSubscriptionPayment(int $businessId, int $userId, int $planId, string $gateway = 'razorpay'): array {
        $stmt = $this->db->prepare("SELECT * FROM plans WHERE id = :pid AND is_active = 1 LIMIT 1");
        $stmt->execute(['pid' => $planId]);
        $plan = $stmt->fetch();

        if (!$plan) {
            return ['success' => false, 'error' => 'Plan not found or currently inactive.'];
        }

        $orderId = 'ORD_' . strtoupper(bin2hex(random_bytes(6)));
        $amount = (float)$plan['price_monthly'];

        // Record pending payment in database
        $stmt = $this->db->prepare("
            INSERT INTO payments (business_id, user_id, amount, currency, gateway, gateway_order_id, status)
            VALUES (:bid, :uid, :amt, :curr, :gw, :ord, 'pending')
        ");
        $stmt->execute([
            'bid'  => $businessId,
            'uid'  => $userId,
            'amt'  => $amount,
            'curr' => $plan['currency'],
            'gw'   => $gateway,
            'ord'  => $orderId
        ]);

        return [
            'success'   => true,
            'order_id'  => $orderId,
            'amount'    => $amount,
            'currency'  => $plan['currency'],
            'plan_name' => $plan['name'],
            'gateway'   => $gateway
        ];
    }

    public function verifyWebhookSignature(string $payload, string $signature, string $secret, string $gateway): bool {
        if ($gateway === 'stripe') {
            // Standard HMAC SHA256 validation for Stripe
            return hash_equals(hash_hmac('sha256', $payload, $secret), $signature);
        }
        if ($gateway === 'razorpay') {
            return hash_equals(hash_hmac('sha256', $payload, $secret), $signature);
        }
        return true;
    }
}
