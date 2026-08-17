# BharatAI Business OS - Scheduled Cron Jobs Guide

## Overview of Cron Tasks
BharatAI Business OS provides automated backend daemon jobs for CRM triggers, automated follow-ups, scheduled email dispatching, webhook delivery, and log maintenance.

### Available Scripts
1. `/cron/run_automations.php`
   - Checks CRM leads against active automation rules (e.g. 2-day reminder, qualification auto-assign, manager notifications).
   - Frequency: Every 5 minutes (`*/5 * * * *`).

2. `/cron/send_scheduled_emails.php`
   - Dispatches queued transactional emails and marketing campaigns via configured SMTP.
   - Frequency: Every 2 minutes (`*/2 * * * *`).

3. `/cron/process_webhooks.php`
   - Retries failed webhook events with exponential backoff.
   - Frequency: Every 10 minutes (`*/10 * * * *`).

4. `/cron/cleanup_logs.php`
   - Purges expired visitor sessions and audit logs older than 90 days.
   - Frequency: Daily at midnight (`0 0 * * *`).

## cPanel Cron Configuration
In cPanel > **Cron Jobs**, add:
```bash
# Automation Rules (Every 5 mins)
/usr/local/bin/php /home/yourusername/public_html/cron/run_automations.php --key=YOUR_CRON_SECRET > /dev/null 2>&1

# Scheduled Emails (Every 2 mins)
/usr/local/bin/php /home/yourusername/public_html/cron/send_scheduled_emails.php --key=YOUR_CRON_SECRET > /dev/null 2>&1
```
