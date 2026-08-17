# 🚀 BharatAI Business OS - Direct Hosting Deployment Package

This `hosting/` folder contains the **100% standalone native PHP 8.2+ and MySQL production application**.
It has **zero Node.js/npm runtime dependencies** and is ready to be uploaded directly to any **cPanel, Apache Shared Hosting, Plesk, VPS, or AWS EC2** server.

---

## 📁 Directory Structure Inside this Hosting Package

```text
hosting/
├── app/
│   ├── controllers/      # AI, Lead, Proposal, Auth, Admin & Business Controllers
│   ├── models/           # User, Business, Lead, Proposal, KnowledgeSource, AutomationRule
│   ├── services/         # AIService (Gemini/OpenAI), CRMService, ProposalService, MailService
│   ├── middleware/       # AuthMiddleware, RateLimitMiddleware, CSRF protection
│   └── helpers/          # ResponseHelper, SecurityHelper, ValidationHelper, GoogleAuthHelper
├── api/
│   ├── ai/               # AI generation, intent scoring & proposal endpoints
│   ├── auth/             # API token registration & login endpoints
│   ├── chat/             # 24/7 AI chatbot API & session handler
│   ├── leads/            # CRM Lead intake & qualification endpoints
│   └── index.php         # REST API Router
├── admin/
│   └── index.php         # Admin Control Center (AI routing, users, logs)
├── dashboard/
│   └── index.php         # Business OS Dashboard (CRM, chatbot, proposals, workflows)
├── auth/
│   ├── login.php         # User & Agency Login
│   ├── register.php      # User Onboarding & Registration
│   └── google/           # Google OAuth Callback
├── cron/
│   ├── run_automations.php       # Lead follow-up & automation triggers
│   ├── send_scheduled_emails.php # Queue-based email delivery
│   ├── process_webhooks.php      # Webhook event delivery
│   └── cleanup_logs.php          # Old session and audit log rotation
├── database/
│   ├── schema.sql        # Complete MySQL InnoDB schema (all tables, indexes, relations)
│   └── seed_demo.sql     # Optional starter development demo records
├── install/
│   └── index.php         # Web-based 1-click database & system installer
├── public/
│   └── assets/js/
│       └── chat-widget.js # Embeddable client website AI chatbot script
├── docs/                 # Full API, cPanel, AWS & Security architecture manuals
├── config.php            # Master database, AI keys, and environment configuration
├── index.php             # Main application entry point
├── .htaccess             # Apache URL rewriting & security headers
└── .env.example          # Optional environment variables template
```

---

## ⚡ 3-Step cPanel Deployment Guide

### Step 1: Upload Files
1. Compress all files inside this `hosting/` folder into a `.zip` archive.
2. Log in to your **cPanel File Manager** and open `public_html` (or your subdomain directory).
3. Upload the `.zip` file and click **Extract**.

### Step 2: Create MySQL Database & Import Schema
1. In cPanel, go to **MySQL Databases** and create a new database (e.g. `u123_bharatai`).
2. Create a database user, set a strong password, and assign **ALL PRIVILEGES** to the database.
3. Open **phpMyAdmin**, select your database, click the **Import** tab, and select `database/schema.sql`.

### Step 3: Configure Database Credentials
Edit `config.php` in your File Manager:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'u123_bharatai');
define('DB_USER', 'u123_dbuser');
define('DB_PASS', 'YourStrongPasswordHere');

// Optional: Add your Google Gemini or OpenAI API Key
define('GEMINI_API_KEY', 'your_gemini_api_key');
define('OPENAI_API_KEY', 'your_openai_api_key');
```

---

## 🕒 Cron Jobs Setup in cPanel

In your cPanel **Cron Jobs** menu, add the following cron command running every 5 minutes:
```bash
*/5 * * * * php /home/USERNAME/public_html/cron/run_automations.php >/dev/null 2>&1
```

---

## ✅ Ready to Run!
Visit `https://yourdomain.com/` in your browser to launch your live **BharatAI Business OS**!
