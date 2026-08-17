<?php
/**
 * BharatAI Business OS - CRM Business Logic Service
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config.php';

class CRMService {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getLeads(int $businessId, array $filters = []): array {
        $sql = "
            SELECT l.*, s.name as status_name, s.color_code as status_color, 
                   CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')) as assigned_user_name,
                   src.name as source_name
            FROM leads l
            LEFT JOIN lead_statuses s ON l.status_id = s.id
            LEFT JOIN users u ON l.assigned_user_id = u.id
            LEFT JOIN lead_sources src ON l.source_id = src.id
            WHERE l.business_id = :biz_id AND l.deleted_at IS NULL
        ";
        $params = ['biz_id' => $businessId];

        if (!empty($filters['status_id'])) {
            $sql .= " AND l.status_id = :status_id";
            $params['status_id'] = $filters['status_id'];
        }
        if (!empty($filters['search'])) {
            $sql .= " AND (l.first_name LIKE :search OR l.company_name LIKE :search OR l.email LIKE :search OR l.phone LIKE :search)";
            $params['search'] = '%' . $filters['search'] . '%';
        }

        $sql .= " ORDER BY l.created_at DESC LIMIT 100";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll() ?: [];
    }

    public function createLead(int $businessId, array $data, ?int $userId = null): int {
        $stmt = $this->db->prepare("
            INSERT INTO leads (business_id, assigned_user_id, first_name, last_name, email, phone, company_name, status_id, priority, estimated_value, requirement, budget, location)
            VALUES (:bid, :uid, :fname, :lname, :email, :phone, :cname, :status, :prio, :val, :req, :bud, :loc)
        ");
        $stmt->execute([
            'bid'    => $businessId,
            'uid'    => $data['assigned_user_id'] ?? $userId,
            'fname'  => $data['first_name'],
            'lname'  => $data['last_name'] ?? null,
            'email'  => $data['email'] ?? null,
            'phone'  => $data['phone'] ?? null,
            'cname'  => $data['company_name'] ?? null,
            'status' => $data['status_id'] ?? 1,
            'prio'   => $data['priority'] ?? 'medium',
            'val'    => $data['estimated_value'] ?? 0.00,
            'req'    => $data['requirement'] ?? null,
            'bud'    => $data['budget'] ?? null,
            'loc'    => $data['location'] ?? null,
        ]);

        $leadId = (int)$this->db->lastInsertId();

        // Record activity
        $this->recordLeadActivity($leadId, $businessId, $userId, 'created', 'Lead created via ' . ($data['source'] ?? 'dashboard'));

        return $leadId;
    }

    public function recordLeadActivity(int $leadId, int $businessId, ?int $userId, string $type, string $desc, ?array $meta = null): void {
        $stmt = $this->db->prepare("
            INSERT INTO lead_activities (lead_id, business_id, user_id, activity_type, description, metadata)
            VALUES (:lid, :bid, :uid, :type, :desc, :meta)
        ");
        $stmt->execute([
            'lid'  => $leadId,
            'bid'  => $businessId,
            'uid'  => $userId,
            'type' => $type,
            'desc' => $desc,
            'meta' => $meta ? json_encode($meta) : null
        ]);
    }
}
