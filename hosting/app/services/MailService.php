<?php
/**
 * BharatAI Business OS - SMTP Mailer & Template Rendering Service
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config.php';

class MailService {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function send(
        string $toEmail,
        string $subject,
        string $bodyHtml,
        ?int $businessId = null,
        ?int $templateId = null
    ): bool {
        $status = 'sent';
        $errorDetails = null;

        // In production cPanel / VPS, uses standard mail() or SMTP socket
        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=UTF-8\r\n";
        $headers .= "From: " . env('MAIL_FROM_NAME', 'BharatAI OS') . " <" . env('MAIL_FROM_ADDRESS', 'noreply@bharatai.io') . ">\r\n";
        $headers .= "X-Mailer: BharatAI-PHP-Mailer/1.0\r\n";

        $sent = @mail($toEmail, $subject, $bodyHtml, $headers);
        if (!$sent) {
            $status = 'failed';
            $errorDetails = error_get_last()['message'] ?? 'SMTP dispatch returned false';
        }

        // Log to database
        try {
            $stmt = $this->db->prepare("
                INSERT INTO email_logs (business_id, recipient_email, subject, template_id, status, error_details)
                VALUES (:bid, :to, :sub, :tid, :stat, :err)
            ");
            $stmt->execute([
                'bid'  => $businessId,
                'to'   => $toEmail,
                'sub'  => $subject,
                'tid'  => $templateId,
                'stat' => $status,
                'err'  => $errorDetails
            ]);
        } catch (Throwable $e) {
            error_log("Failed to log email: " . $e->getMessage());
        }

        return $sent;
    }

    public function renderTemplate(string $templateHtml, array $placeholders): string {
        $rendered = $templateHtml;
        foreach ($placeholders as $key => $value) {
            $rendered = str_replace('{{' . $key . '}}', (string)$value, $rendered);
        }
        return $rendered;
    }
}
