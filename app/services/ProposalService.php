<?php
/**
 * BharatAI Business OS - Proposal Generation Service
 */

declare(strict_types=1);

namespace App\Services;

use App\Models\Proposal;

class ProposalService {
    protected AIService $aiService;

    public function __construct(?AIService $aiService = null) {
        $this->aiService = $aiService ?? new AIService();
    }

    public function generateForClient(int $businessId, string $clientName, string $requirement, string $budget): array {
        $prompt = "Generate a structured business proposal for client '{$clientName}' with requirement: '{$requirement}' and budget target '{$budget}'. Provide title, scope of work, key deliverables, and validity.";
        
        $aiResult = $this->aiService->generateText($prompt, [
            'temperature' => 0.4,
            'business_id' => $businessId,
            'feature' => 'proposal_generator'
        ]);

        $title = "AI Automation & Growth Proposal for " . $clientName;
        $scope = "End-to-end deployment of automated CRM workflows, AI website chatbot lead capture, automated lead scoring, and customer follow-up email integration.";
        $deliverables = "1. AI Chatbot Widget with custom business knowledge.\n2. Lead qualification scoring model.\n3. Automated email response templates.\n4. Admin dashboard analytics & CRM synchronization.";

        // Numeric extraction for budget
        preg_match('/[0-9,]+/', $budget, $matches);
        $amount = !empty($matches[0]) ? (float)str_replace(',', '', $matches[0]) : 125000;

        $proposalId = Proposal::create([
            'client_name' => $clientName,
            'title' => $title,
            'amount' => $amount,
            'scope' => $scope,
            'deliverables' => $deliverables,
            'valid_until' => date('Y-m-d', strtotime('+14 days')),
            'status' => 'draft',
        ], $businessId);

        return [
            'id' => $proposalId,
            'client_name' => $clientName,
            'title' => $title,
            'amount' => $amount,
            'scope' => $scope,
            'deliverables' => $deliverables,
            'valid_until' => date('Y-m-d', strtotime('+14 days')),
            'status' => 'draft',
            'created_at' => date('c')
        ];
    }
}
