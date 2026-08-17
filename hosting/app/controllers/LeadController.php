<?php
/**
 * BharatAI Business OS - Lead & CRM Controller
 */

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\ResponseHelper;
use App\Helpers\ValidationHelper;
use App\Models\Lead;
use App\Services\CRMService;
use App\Services\AIService;

class LeadController {
    protected CRMService $crmService;
    protected AIService $aiService;

    public function __construct() {
        $this->crmService = new CRMService();
        $this->aiService = new AIService();
    }

    public function index(int $businessId): void {
        $filters = [
            'status' => $_GET['status'] ?? null,
            'search' => $_GET['search'] ?? null,
        ];
        $leads = Lead::getByBusiness($businessId, $filters);
        ResponseHelper::success($leads, 'Leads retrieved successfully.');
    }

    public function store(int $businessId, array $data): void {
        $errors = ValidationHelper::validateRequired($data, ['first_name', 'email']);
        if (!empty($errors)) {
            ResponseHelper::error(implode(', ', $errors), 422);
            return;
        }

        try {
            $leadId = Lead::create($data, $businessId);
            $lead = Lead::findById($leadId, $businessId);
            ResponseHelper::success($lead, 'Lead created successfully.', 201);
        } catch (\Throwable $e) {
            ResponseHelper::error('Failed to create lead: ' . $e->getMessage(), 500);
        }
    }

    public function updateStatus(int $businessId, int $leadId, string $status): void {
        $updated = Lead::updateStatus($leadId, $businessId, $status);
        if ($updated) {
            ResponseHelper::success(['lead_id' => $leadId, 'status' => $status], 'Lead status updated.');
        } else {
            ResponseHelper::error('Failed to update lead or lead not found.', 404);
        }
    }

    public function qualify(int $businessId, int $leadId): void {
        $lead = Lead::findById($leadId, $businessId);
        if (!$lead) {
            ResponseHelper::error('Lead not found.', 404);
            return;
        }

        $qualification = $this->crmService->qualifyLeadWithAI($lead, $businessId);
        Lead::saveAIQualification($leadId, $businessId, $qualification);

        ResponseHelper::success($qualification, 'Lead qualified by AI successfully.');
    }
}
