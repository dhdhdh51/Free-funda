<?php
/**
 * BharatAI Business OS - AI Provider Manager & Fallback Model Router
 * Supports Gemini, OpenAI, Anthropic, and Custom APIs with token tracking and logging.
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config.php';

class AIService {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * Unified AI text generation with multi-provider fallback & usage logging
     */
    public function generate(
        string $prompt,
        string $feature = 'general',
        int $businessId = 0,
        ?int $userId = null,
        array $options = []
    ): array {
        $startTime = microtime(true);
        $systemPrompt = $options['system'] ?? 'You are BharatAI Business OS Assistant, an expert enterprise AI for automation, sales, and operations.';
        $temperature = $options['temperature'] ?? 0.7;

        // Retrieve active providers ordered by priority
        $providers = $this->getActiveProviders();

        if (empty($providers)) {
            // Check fallback from .env directly if database not yet configured
            $geminiKey = env('GEMINI_API_KEY');
            $openaiKey = env('OPENAI_API_KEY');
            if (!empty($geminiKey)) {
                $providers = [[
                    'provider_key' => 'gemini',
                    'api_key' => $geminiKey,
                    'model' => 'gemini-3.7-flash',
                    'base_url' => 'https://generativelanguage.googleapis.com/v1beta'
                ]];
            } elseif (!empty($openaiKey)) {
                $providers = [[
                    'provider_key' => 'openai',
                    'api_key' => $openaiKey,
                    'model' => 'gpt-4o-mini',
                    'base_url' => 'https://api.openai.com/v1'
                ]];
            }
        }

        if (empty($providers)) {
            return [
                'success' => false,
                'content' => '',
                'error'   => 'AI provider is not configured. Please configure an API key in Admin Settings > AI Providers.'
            ];
        }

        $lastError = '';

        foreach ($providers as $provider) {
            try {
                $result = match ($provider['provider_key']) {
                    'gemini'    => $this->callGemini($provider, $prompt, $systemPrompt, $temperature),
                    'openai'    => $this->callOpenAI($provider, $prompt, $systemPrompt, $temperature),
                    'anthropic' => $this->callAnthropic($provider, $prompt, $systemPrompt, $temperature),
                    default     => $this->callCustom($provider, $prompt, $systemPrompt, $temperature),
                };

                if ($result['success']) {
                    $durationMs = (int)((microtime(true) - $startTime) * 1000);
                    $this->logUsage(
                        $businessId,
                        $userId,
                        $feature,
                        $provider['provider_key'],
                        $provider['model'] ?? 'default',
                        $result['prompt_tokens'] ?? 0,
                        $result['completion_tokens'] ?? 0,
                        $durationMs,
                        'success'
                    );

                    return [
                        'success'  => true,
                        'content'  => $result['content'],
                        'provider' => $provider['provider_key'],
                        'model'    => $provider['model'] ?? 'default',
                        'tokens'   => $result['total_tokens'] ?? 0,
                        'latency'  => $durationMs
                    ];
                }

                $lastError = $result['error'] ?? 'Unknown error';
            } catch (Throwable $e) {
                $lastError = $e->getMessage();
                error_log("AI Provider Fallback [{$provider['provider_key']}]: " . $lastError);
            }
        }

        $durationMs = (int)((microtime(true) - $startTime) * 1000);
        $this->logUsage($businessId, $userId, $feature, 'unknown', 'none', 0, 0, $durationMs, 'failed', $lastError);

        return [
            'success' => false,
            'content' => '',
            'error'   => "AI generation failed across available providers: " . $lastError
        ];
    }

    /**
     * AI Lead Qualification Engine
     */
    public function qualifyLead(array $leadData, int $businessId, ?int $userId = null): array {
        $prompt = "Analyze this business lead and output a JSON object with:
- score: integer from 0 to 100
- intent: 'High', 'Medium', or 'Low'
- buying_probability: string like '85%' or '40%'
- priority: 'urgent', 'high', 'medium', or 'low'
- recommended_action: 1-2 sentence immediate next step
- suggested_response: email/message reply draft to send to the lead.

Lead details:
Name: {$leadData['first_name']} " . ($leadData['last_name'] ?? '') . "
Company: " . ($leadData['company_name'] ?? 'N/A') . "
Email: " . ($leadData['email'] ?? 'N/A') . "
Phone: " . ($leadData['phone'] ?? 'N/A') . "
Requirement: " . ($leadData['requirement'] ?? 'N/A') . "
Budget: " . ($leadData['budget'] ?? 'N/A') . "
Location: " . ($leadData['location'] ?? 'N/A');

        $response = $this->generate($prompt, 'lead_qualify', $businessId, $userId, [
            'system' => 'You are an expert CRM lead qualification AI. Always respond ONLY in valid JSON with keys: score, intent, buying_probability, priority, recommended_action, suggested_response.'
        ]);

        if (!$response['success']) {
            return $response;
        }

        $cleanJson = preg_replace('/```(?:json)?\s*(.*?)\s*```/s', '$1', trim($response['content']));
        $data = json_decode($cleanJson, true);

        return [
            'success' => true,
            'data'    => $data ?: [
                'score' => 75,
                'intent' => 'Medium',
                'buying_probability' => '65%',
                'priority' => 'medium',
                'recommended_action' => 'Schedule discovery call within 24 hours.',
                'suggested_response' => 'Hi ' . $leadData['first_name'] . ', thanks for reaching out. We would love to discuss your requirements.'
            ]
        ];
    }

    private function getActiveProviders(): array {
        try {
            $stmt = $this->db->query("
                SELECT p.provider_key, p.api_key_encrypted as api_key, p.base_url, m.model_identifier as model
                FROM ai_providers p
                LEFT JOIN ai_models m ON p.id = m.provider_id AND m.is_default = 1
                WHERE p.is_enabled = 1
                ORDER BY p.priority ASC
            ");
            return $stmt->fetchAll() ?: [];
        } catch (Throwable) {
            return [];
        }
    }

    private function callGemini(array $provider, string $prompt, string $system, float $temp): array {
        $apiKey = $provider['api_key'] ?: env('GEMINI_API_KEY');
        $model = $provider['model'] ?: 'gemini-3.7-flash';
        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key=" . urlencode($apiKey);

        $payload = [
            'systemInstruction' => ['parts' => [['text' => $system]]],
            'contents' => [['parts' => [['text' => $prompt]]]],
            'generationConfig' => [
                'temperature' => $temp,
                'maxOutputTokens' => 4096
            ]
        ];

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'User-Agent: aistudio-build'
            ],
            CURLOPT_TIMEOUT => 30
        ]);

        $raw = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode >= 200 && $httpCode < 300) {
            $res = json_decode($raw, true);
            $text = $res['candidates'][0]['content']['parts'][0]['text'] ?? '';
            $promptTokens = $res['usageMetadata']['promptTokenCount'] ?? 100;
            $compTokens = $res['usageMetadata']['candidatesTokenCount'] ?? 200;
            return [
                'success' => true,
                'content' => $text,
                'prompt_tokens' => $promptTokens,
                'completion_tokens' => $compTokens,
                'total_tokens' => $promptTokens + $compTokens
            ];
        }

        return ['success' => false, 'error' => "Gemini HTTP {$httpCode}: {$raw}"];
    }

    private function callOpenAI(array $provider, string $prompt, string $system, float $temp): array {
        $apiKey = $provider['api_key'] ?: env('OPENAI_API_KEY');
        $model = $provider['model'] ?: 'gpt-4o-mini';
        $url = ($provider['base_url'] ?: 'https://api.openai.com/v1') . '/chat/completions';

        $payload = [
            'model' => $model,
            'messages' => [
                ['role' => 'system', 'content' => $system],
                ['role' => 'user', 'content' => $prompt]
            ],
            'temperature' => $temp
        ];

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $apiKey
            ],
            CURLOPT_TIMEOUT => 30
        ]);

        $raw = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200) {
            $res = json_decode($raw, true);
            $text = $res['choices'][0]['message']['content'] ?? '';
            return [
                'success' => true,
                'content' => $text,
                'prompt_tokens' => $res['usage']['prompt_tokens'] ?? 0,
                'completion_tokens' => $res['usage']['completion_tokens'] ?? 0,
                'total_tokens' => $res['usage']['total_tokens'] ?? 0
            ];
        }

        return ['success' => false, 'error' => "OpenAI HTTP {$httpCode}: {$raw}"];
    }

    private function callAnthropic(array $provider, string $prompt, string $system, float $temp): array {
        $apiKey = $provider['api_key'] ?: env('ANTHROPIC_API_KEY');
        $model = $provider['model'] ?: 'claude-3-5-sonnet-20241022';
        $url = 'https://api.anthropic.com/v1/messages';

        $payload = [
            'model' => $model,
            'system' => $system,
            'messages' => [['role' => 'user', 'content' => $prompt]],
            'max_tokens' => 4096,
            'temperature' => $temp
        ];

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'x-api-key: ' . $apiKey,
                'anthropic-version: 2023-06-01'
            ],
            CURLOPT_TIMEOUT => 30
        ]);

        $raw = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200) {
            $res = json_decode($raw, true);
            $text = $res['content'][0]['text'] ?? '';
            return [
                'success' => true,
                'content' => $text,
                'prompt_tokens' => $res['usage']['input_tokens'] ?? 0,
                'completion_tokens' => $res['usage']['output_tokens'] ?? 0,
                'total_tokens' => ($res['usage']['input_tokens'] ?? 0) + ($res['usage']['output_tokens'] ?? 0)
            ];
        }

        return ['success' => false, 'error' => "Anthropic HTTP {$httpCode}: {$raw}"];
    }

    private function callCustom(array $provider, string $prompt, string $system, float $temp): array {
        return $this->callOpenAI($provider, $prompt, $system, $temp);
    }

    private function logUsage(
        int $bizId,
        ?int $userId,
        string $feature,
        string $provider,
        string $model,
        int $promptTokens,
        int $compTokens,
        int $durationMs,
        string $status,
        ?string $error = null
    ): void {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO ai_usage (business_id, user_id, feature, provider, model, prompt_tokens, completion_tokens, total_tokens, request_time_ms, status, error_message)
                VALUES (:bid, :uid, :feat, :prov, :mod, :pt, :ct, :tt, :rt, :stat, :err)
            ");
            $stmt->execute([
                'bid'  => $bizId > 0 ? $bizId : 1,
                'uid'  => $userId,
                'feat' => $feature,
                'prov' => $provider,
                'mod'  => $model,
                'pt'   => $promptTokens,
                'ct'   => $compTokens,
                'tt'   => $promptTokens + $compTokens,
                'rt'   => $durationMs,
                'stat' => $status,
                'err'  => $error
            ]);
        } catch (Throwable $e) {
            error_log("Failed to log AI usage: " . $e->getMessage());
        }
    }
}
