# BharatAI Business OS - AI Providers & Fallback Router Architecture

## Overview
BharatAI Business OS implements an AI provider abstraction layer (`/app/services/AIService.php`) capable of routing requests across multiple models and providers with automated fallback.

### Supported Providers
1. **Google Gemini (Primary)**
   - Models: `gemini-3.7-flash`, `gemini-2.5-flash`, `gemini-1.5-pro`
   - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/...`
   - Optimized for: High-speed lead extraction, autonomous CRM assistant, RAG context answering, proposal drafting.

2. **OpenAI (Fallback Provider 1)**
   - Models: `gpt-4o`, `gpt-4o-mini`
   - Endpoint: `https://api.openai.com/v1/chat/completions`

3. **Anthropic Claude (Fallback Provider 2)**
   - Models: `claude-3-5-sonnet`, `claude-3-haiku`
   - Endpoint: `https://api.anthropic.com/v1/messages`

4. **Custom OpenAI-Compatible API**
   - Supports local models (Ollama, vLLM) or private self-hosted inference servers.

### Automatic Fallback Workflow
When a prompt is dispatched:
1. `AIService` checks tenant credit limits and feature authorization.
2. Dispatches request to Primary Provider (`Google Gemini`).
3. If timeout, rate limit (HTTP 429), or 5xx occurs:
   - Automatically catches exception.
   - Logs warning into `ai_usage` table.
   - Retries request instantly against Fallback Provider (`OpenAI`).
4. Records token usage and deducts tenant quota.
