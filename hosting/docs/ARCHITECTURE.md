# BharatAI Business OS - System Architecture

## Architectural Overview
BharatAI Business OS is a high-performance, multi-tenant enterprise software-as-a-service application designed for small businesses, agencies, and growing enterprises.

```
┌─────────────────────────────────────────────────────────┐
│                    Web & Mobile Client                  │
│       React 19 / Modern Tailwind / Embedded Chat Widget │
└────────────────────────────┬────────────────────────────┘
                             │ HTTPS / REST / JSON
┌────────────────────────────▼────────────────────────────┐
│                    Nginx / Apache                       │
│           Security Headers, Rate Limiter, .htaccess     │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│              Native PHP 8.2+ Backend Core               │
│  ┌──────────────────────┬────────────────────────────┐  │
│  │ Auth & RBAC Security │ Multi-Tenant Isolation     │  │
│  ├──────────────────────┼────────────────────────────┤  │
│  │ AI Multi-Provider    │ CRM & Lead Engine          │  │
│  │ Fallback Router      │ Automations & Webhooks     │  │
│  ├──────────────────────┼────────────────────────────┤  │
│  │ Proposals & Invoices │ Mail & Notification Center │  │
│  └──────────────────────┴────────────────────────────┘  │
└────────────────────────────┬────────────────────────────┘
                             │
     ┌───────────────────────┼───────────────────────┐
     ▼                       ▼                       ▼
┌──────────────┐     ┌──────────────┐        ┌──────────────┐
│  MySQL 8.0+  │     │ AI Providers │        │ SMTP / Mail  │
│  (InnoDB /   │     │ Gemini,      │        │ Gateways &   │
│  utf8mb4)    │     │ OpenAI, etc. │        │ Webhooks     │
└──────────────┘     └──────────────┘        └──────────────┘
```

## Core Modules
1. **Multi-Tenancy Engine**: Strict server-enforced `business_id` scoping across all relational tables.
2. **AI Provider Router**: Abstraction layer supporting Google Gemini (`gemini-3.7-flash`), OpenAI (`gpt-4o`), and Anthropic with automatic fallback.
3. **CRM Pipeline & Qualification**: Dynamic lead scoring, intent classification, and next-action recommendation.
4. **Automations & Cron Jobs**: Asynchronous event dispatching for follow-ups, scheduled emails, and webhooks.
5. **Billing & Subscriptions**: Plan tier limits (credits, storage, users) enforced server-side.
