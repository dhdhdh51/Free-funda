<?php
/**
 * BharatAI Business OS - Chatbot Widget Controller
 */

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\Business;
use App\Models\Lead;
use App\Services\AIService;
use App\Services\KnowledgeBaseService;

class ChatbotController {
    protected AIService $aiService;
    protected KnowledgeBaseService $kbService;

    public function __construct() {
        $this->aiService = new AIService();
        $this->kbService = new KnowledgeBaseService();
    }

    public function handlePublicMessage(array $data): void {
        $businessId = (int)($data['business_id'] ?? 1);
        $message = trim((string)($data['message'] ?? ''));
        $visitorInfo = $data['visitor_info'] ?? [];

        if ($message === '') {
            ResponseHelper::error('Message is required', 422);
            return;
        }

        $biz = Business::findById($businessId);
        if (!$biz) {
            ResponseHelper::error('Business not found', 404);
            return;
        }

        // If visitor submitted phone / email in chat, auto-capture as CRM Lead!
        if (!empty($visitorInfo['phone']) || !empty($visitorInfo['email'])) {
            try {
                Lead::create([
                    'first_name' => $visitorInfo['name'] ?? 'Website Visitor',
                    'email' => $visitorInfo['email'] ?? 'visitor@website.com',
                    'phone' => $visitorInfo['phone'] ?? '',
                    'requirement' => "Captured via Chatbot: " . $message,
                    'source' => 'Website Chatbot Widget',
                    'status' => 'New Inquiry',
                ], $businessId);
            } catch (\Throwable $e) {
                // Ignore lead creation failure in public widget
            }
        }

        $kbContext = $this->kbService->searchContext($businessId, $message);
        $prompt = "You are the helpful automated website chatbot for {$biz['name']}.
About: {$biz['about']}
USP: {$biz['usp']}
Company FAQs & Knowledge:
{$kbContext}

Visitor Question: \"{$message}\"

Respond in 2-3 friendly, helpful sentences. If they are asking for pricing or quotes, encourage them to leave their phone number or email.";

        $res = $this->aiService->generateText($prompt, [
            'business_id' => $businessId,
            'feature' => 'website_chatbot'
        ]);

        ResponseHelper::success([
            'reply' => $res['content'],
            'bot_name' => 'BharatAI Bot'
        ], 'Chat response generated.');
    }
}
