# BharatAI Business OS - cPanel & Shared Hosting Deployment Guide

This guide details the exact step-by-step procedure to deploy **BharatAI Business OS** on standard cPanel, Apache shared hosting, or DirectAdmin.

---

## 1. Prerequisites Checklist
- cPanel account with PHP 8.2 or 8.3 support
- MySQL 8.0+ or MariaDB 10.5+
- Active domain / subdomain configured (with SSL Certificate)
- Required PHP Extensions: `pdo_mysql`, `curl`, `mbstring`, `openssl`, `json`, `fileinfo`

---

## 2. Step-by-Step Installation

### Step 1: Create the MySQL Database & User
1. Log into your **cPanel** dashboard.
2. Under the **Databases** section, click **MySQL® Database Wizard**.
3. Create a database (e.g., `cpaneluser_bharatai`).
4. Create a database user (e.g., `cpaneluser_dbuser`) with a strong password.
5. Grant **ALL PRIVILEGES** to the user on this database.

### Step 2: Import the Database Schema
1. In cPanel, open **phpMyAdmin**.
2. Select your newly created database from the left sidebar.
3. Click the **Import** tab in the top menu.
4. Choose `/database/schema.sql` from your project package and click **Import**.
5. *(Optional)* If you want initial demo templates and roles, import `/database/seed_demo.sql`.

### Step 3: Upload Project Files
1. Open **File Manager** in cPanel.
2. Navigate to your target directory (`public_html` for main domain, or `public_html/app` for a subdomain).
3. Upload and extract the project ZIP package.

### Step 4: Configure Environment (`.env`)
1. In File Manager, ensure hidden dotfiles are visible (Settings > Show Hidden Files).
2. Copy `.env.example` to `.env`.
3. Open and edit `.env` with your real production details:
   ```ini
   APP_ENV=production
   APP_URL=https://yourdomain.com
   DB_HOST=localhost
   DB_DATABASE=cpaneluser_bharatai
   DB_USERNAME=cpaneluser_dbuser
   DB_PASSWORD=your_actual_db_password
   GEMINI_API_KEY=your_google_gemini_key
   OPENAI_API_KEY=your_openai_key
   SMTP_HOST=smtp.mailgun.org
   SMTP_USERNAME=your_smtp_user
   SMTP_PASSWORD=your_smtp_password
   CRON_SECRET_KEY=your_random_secret_string
   ```

### Step 5: Configure Directory Permissions
Ensure write permissions (`chmod 755` or `775`) on:
- `/storage`
- `/storage/logs`
- `/public/uploads`

### Step 6: Configure cPanel Cron Jobs
In cPanel > **Cron Jobs**, add these recurring jobs:

| Interval | Command | Purpose |
| :--- | :--- | :--- |
| `*/5 * * * *` | `/usr/local/bin/php /home/cpaneluser/public_html/cron/run_automations.php >/dev/null 2>&1` | Processes automated rules & lead notifications |
| `0 0 * * *` | `/usr/local/bin/php /home/cpaneluser/public_html/cron/cleanup_logs.php >/dev/null 2>&1` | Daily log rotation & session cleanup |

---

## 3. Verification & Troubleshooting
- **API Health Check:** Visit `https://yourdomain.com/api/v1/health`
- **Error Logs:** Check `/storage/logs/app_error.log` if any unexpected behavior occurs.
