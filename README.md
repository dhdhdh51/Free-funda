# BharatAI Business OS

> **AI-Powered Business Automation Platform & Multi-Tenant Operating System for SMBs, Agencies, and Enterprises.**

BharatAI Business OS provides a unified, production-ready software suite featuring CRM lead pipelines, AI lead qualification, business knowledge base, website chatbots, proposal & quotation builders, invoicing, workflow automations, and multi-tenant agency management.

---

## Key Features

- **Multi-Tenant Architecture**: Strict workspace isolation for businesses and agency accounts.
- **AI Provider Router**: Unified fallback across Google Gemini, OpenAI, and Anthropic with token tracking and cost analytics.
- **AI Lead Qualification**: Instant lead scoring (0-100), intent analysis, buying probability calculation, and suggested response drafting.
- **AI Business Assistant**: Context-aware assistant connected to business knowledge sources and FAQs.
- **Website Chatbot Builder**: Embeddable JavaScript widget with lead capture, customizable styling, and live simulation.
- **Proposal & Quotation Engine**: AI-generated proposals with itemized breakdown, tax/discount calculation, and print-ready layouts.
- **Automations & Cron Jobs**: Asynchronous trigger engine for welcome sequences, follow-ups, and webhook dispatching.
- **Subscription & Usage Limits**: Tiered plans (Free, Growth, Scale, Agency) with server-enforced AI credit and lead quotas.
- **PHP 8.2+ & MySQL 8+ Core**: Designed for 1-click deployment to cPanel, Apache shared hosting, or AWS EC2.

---

## Directory Structure

```
├── /app/
│   ├── config/          # Database, app constants & security settings
│   ├── controllers/     # MVC & API controllers
│   ├── helpers/         # Response, sanitization & security helpers
│   ├── middleware/      # Auth, tenant & role permission guards
│   ├── models/          # Entity models
│   └── services/        # AI router, CRM, Mailer & Payment abstractions
├── /api/                # REST API entry points
├── /cron/               # CLI & HTTP cron task runners
├── /database/
│   ├── schema.sql       # Complete MySQL 8.0+ DDL with indexes & FKs
│   └── seed_demo.sql    # Default roles, plans, providers & templates
├── /docs/               # Architecture, cPanel, AWS & API reference
├── /public/             # Static web assets & public uploads
├── .env.example         # Environment template
├── .htaccess            # Apache security & URL rewrites
├── config.php           # PDO connection & env loader
├── index.php            # Root router & health dispatcher
└── server.ts            # Full-stack Node/Express preview & live AI runner
```

---

## Deployment Instructions

Refer to the complete guides in `/docs`:
- **cPanel Deployment:** [docs/CPANEL_DEPLOYMENT.md](docs/CPANEL_DEPLOYMENT.md)
- **AWS EC2 / RDS Deployment:** [docs/AWS_DEPLOYMENT.md](docs/AWS_DEPLOYMENT.md)
- **API Documentation:** [docs/API.md](docs/API.md)
- **Security Guide:** [docs/SECURITY.md](docs/SECURITY.md)
