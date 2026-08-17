<?php
/**
 * BharatAI Business OS - Proposal & Quotations Controller
 */

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\ResponseHelper;
use App\Helpers\ValidationHelper;
use App\Models\Proposal;
use App\Services\ProposalService;

class ProposalController {
    protected ProposalService $proposalService;

    public function __construct() {
        $this->proposalService = new ProposalService();
    }

    public function index(int $businessId): void {
        $proposals = Proposal::getByBusiness($businessId);
        ResponseHelper::success($proposals, 'Proposals loaded.');
    }

    public function generate(int $businessId, array $data): void {
        $errors = ValidationHelper::validateRequired($data, ['client_name', 'requirement']);
        if (!empty($errors)) {
            ResponseHelper::error(implode(', ', $errors), 422);
            return;
        }

        try {
            $prop = $this->proposalService->generateForClient(
                $businessId,
                $data['client_name'],
                $data['requirement'],
                $data['budget'] ?? '₹1,00,000'
            );
            ResponseHelper::success($prop, 'Proposal generated successfully.', 201);
        } catch (\Throwable $e) {
            ResponseHelper::error('Failed to generate proposal: ' . $e->getMessage(), 500);
        }
    }
}
