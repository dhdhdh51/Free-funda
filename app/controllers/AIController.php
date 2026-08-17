<?php
/**
 * BharatAI Business OS - AI Service Controller
 */

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\ResponseHelper;
use App\Services\AIService;
use App\Services\KnowledgeBaseService;
use App\Models\Business;

class AIController {
    protected AIService $aiService;
    protected KnowledgeBaseService $kbService;

    public function __construct() {
        $this->aiService = new AIService();
        $this->kbService = new KnowledgeBaseService();
    }

    public function assistantChat(int $businessId, array $data): void {
        $message = trim((string)($data['message'] ?? ''));
        if ($message === '') {
            ResponseHelper::error('Message prompt cannot be empty.', 422);
            return;
        }

        $biz = Business::findById($businessId);
        $kbContext = $this->kbService->searchContext($businessId, $message);

        $systemPrompt = "You are the autonomous AI Business Assistant for '{$biz['name']}'.
Business Summary: {$biz['about']}
Unique Value: {$biz['usp']}
Company Knowledge Context:
{$kbContext}

Answer accurately, authoritatively, and concisely. If asked to draft quotes or emails, provide ready-to-use professional templates.";

        $result = $this->aiService->generateText("{$systemPrompt}\n\nUser Request: {$message}", [
            'business_id' => $businessId,
            'feature' => 'business_assistant'
        ]);

        ResponseHelper::success([
            'reply' => $result['content'],
            'model' => $result['model'],
            'provider' => $result['provider'],
            'tokens' => $result['tokens'],
        ], 'AI response generated.');
    }

    public function generateMarketingContent(int $businessId, array $data): void {
        $toolType = $data['toolType'] ?? 'social';
        $topic = $data['topic'] ?? '';
        $platform = $data['platform'] ?? 'LinkedIn';
        $tone = $data['tone'] ?? 'Professional';

        $prompt = match ($toolType) {
            'seo' => "Generate a complete SEO Article Outline with target keyword '{$topic}'. Include: Catchy H1 SEO Title, Meta Description (155 chars), 5 Structured Headings (H2/H3), Key takeaway summary, and 3 FAQ questions with answers.",
            'review' => "Write 3 professional customer review reply variations (1. Highly Appreciative, 2. Constructive / Solution-Oriented, 3. Short & Warm) for this customer review: '{$topic}'.",
            default => "Write a high-converting, engagement-optimized {$platform} post about: '{$topic}' with tone '{$tone}'. Include emojis, relevant hashtags, hook line, and strong call to action.",
        };

        $result = $this->aiService->generateText($prompt, [
            'business_id' => $businessId,
            'feature' => 'marketing_suite'
        ]);

        ResponseHelper::success([
            'content' => $result['content'],
            'tool_type' => $toolType,
            'platform' => $platform
        ], 'Marketing copy generated.');
    }
}
