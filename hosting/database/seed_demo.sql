-- =======================================================
-- BharatAI Business OS - Seed Data & Initial Configuration
-- =======================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Default Roles
INSERT INTO `roles` (`id`, `slug`, `name`, `description`, `is_system`) VALUES
(1, 'super_admin', 'Super Administrator', 'Full platform access and server administration', 1),
(2, 'admin', 'System Administrator', 'Manages system settings, users and AI providers', 1),
(3, 'business_owner', 'Business Owner', 'Full control over their own business workspace', 1),
(4, 'manager', 'Business Manager', 'Can manage leads, customers, campaigns and staff', 1),
(5, 'staff', 'Staff Member', 'Operational access to assigned leads and tasks', 1),
(6, 'agency_owner', 'Agency Owner', 'Can create and manage multiple client businesses', 1),
(7, 'agency_staff', 'Agency Staff', 'Assigned access to specific client businesses', 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 2. Core Permissions
INSERT INTO `permissions` (`id`, `slug`, `name`, `module`, `description`) VALUES
(1, 'users.view', 'View Users', 'Users', 'Can view team members'),
(2, 'users.create', 'Create Users', 'Users', 'Can invite new team members'),
(3, 'users.edit', 'Edit Users', 'Users', 'Can update member roles'),
(4, 'users.delete', 'Delete Users', 'Users', 'Can remove team members'),
(5, 'leads.view', 'View Leads', 'CRM', 'Can view lead pipelines'),
(6, 'leads.create', 'Create Leads', 'CRM', 'Can add new leads'),
(7, 'leads.edit', 'Edit Leads', 'CRM', 'Can update lead records'),
(8, 'leads.delete', 'Delete Leads', 'CRM', 'Can delete lead records'),
(9, 'customers.view', 'View Customers', 'CRM', 'Can view customer directory'),
(10, 'customers.create', 'Create Customers', 'CRM', 'Can add new customers'),
(11, 'ai.use', 'Use AI Features', 'AI', 'Can access AI Assistant and generators'),
(12, 'ai.manage', 'Manage AI Providers', 'AI', 'Can configure API keys and model limits'),
(13, 'billing.view', 'View Billing', 'Billing', 'Can view subscription and invoices'),
(14, 'billing.manage', 'Manage Billing', 'Billing', 'Can upgrade plans and manage payment methods'),
(15, 'settings.manage', 'Manage Settings', 'Settings', 'Can update business settings and branding'),
(16, 'reports.view', 'View Reports', 'Analytics', 'Can view business analytics and dashboards')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 3. Default AI Providers
INSERT INTO `ai_providers` (`id`, `name`, `provider_key`, `base_url`, `is_enabled`, `priority`) VALUES
(1, 'Google Gemini', 'gemini', 'https://generativelanguage.googleapis.com/v1beta', 1, 1),
(2, 'OpenAI', 'openai', 'https://api.openai.com/v1', 1, 2),
(3, 'Anthropic Claude', 'anthropic', 'https://api.anthropic.com/v1', 1, 3),
(4, 'Custom OpenAI-Compatible', 'custom', 'https://api.custom-ai.com/v1', 0, 4)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 4. Default AI Models
INSERT INTO `ai_models` (`id`, `provider_id`, `model_name`, `model_identifier`, `max_tokens`, `default_temperature`, `cost_per_1k_input_tokens`, `cost_per_1k_output_tokens`, `is_default`, `is_active`) VALUES
(1, 1, 'Gemini 3.7 Flash', 'gemini-3.7-flash', 8192, 0.70, 0.00010, 0.00040, 1, 1),
(2, 1, 'Gemini 3.1 Pro', 'gemini-3.1-pro-preview', 16384, 0.70, 0.00125, 0.00500, 0, 1),
(3, 2, 'GPT-4o Mini', 'gpt-4o-mini', 4096, 0.70, 0.00015, 0.00060, 0, 1),
(4, 2, 'GPT-4o', 'gpt-4o', 8192, 0.70, 0.00250, 0.01000, 0, 1),
(5, 3, 'Claude 3.5 Sonnet', 'claude-3-5-sonnet-20241022', 8192, 0.70, 0.00300, 0.01500, 0, 1)
ON DUPLICATE KEY UPDATE `model_name` = VALUES(`model_name`);

-- 5. Default Subscription Plans
INSERT INTO `plans` (`id`, `slug`, `name`, `description`, `price_monthly`, `price_yearly`, `currency`, `ai_credit_limit`, `max_users`, `max_businesses`, `max_leads`, `max_documents`, `is_active`, `is_featured`) VALUES
(1, 'free', 'Starter Free', 'Ideal for solo entrepreneurs and testing automation capabilities', 0.00, 0.00, 'INR', 25000, 1, 1, 50, 5, 1, 0),
(2, 'starter', 'Growth Pro', 'Designed for growing small businesses and professional service providers', 1999.00, 19990.00, 'INR', 250000, 5, 1, 1000, 25, 1, 1),
(3, 'growth', 'Business Scale', 'For established SMBs requiring team CRM, automations, and AI chatbots', 4999.00, 49990.00, 'INR', 1000000, 15, 3, 5000, 100, 1, 0),
(4, 'enterprise', 'Agency & Enterprise', 'Multi-tenant agency control, dedicated white-label, and priority AI routing', 9999.00, 99990.00, 'INR', 5000000, 50, 25, 50000, 500, 1, 0)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 6. Default Lead Statuses
INSERT INTO `lead_statuses` (`id`, `name`, `slug`, `color_code`, `sort_order`, `is_won`, `is_lost`) VALUES
(1, 'New Inquiry', 'new', '#3B82F6', 1, 0, 0),
(2, 'Contacted', 'contacted', '#6366F1', 2, 0, 0),
(3, 'AI Qualified', 'qualified', '#10B981', 3, 0, 0),
(4, 'Proposal Sent', 'proposal_sent', '#F59E0B', 4, 0, 0),
(5, 'In Negotiation', 'negotiation', '#8B5CF6', 5, 0, 0),
(6, 'Closed Won', 'won', '#059669', 6, 1, 0),
(7, 'Lost', 'lost', '#EF4444', 7, 0, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 7. System Email Templates
INSERT INTO `email_templates` (`id`, `name`, `subject`, `body_html`, `template_type`, `variables`) VALUES
(1, 'Welcome & Verify Email', 'Welcome to BharatAI Business OS - Verify Your Account', '<p>Hi {{name}},</p><p>Welcome to <strong>BharatAI Business OS</strong>. Please verify your email by clicking the link below:</p><p><a href="{{verification_link}}">Verify Email Address</a></p><p>Best regards,<br>The BharatAI Team</p>', 'system', '["name", "verification_link"]'),
(2, 'New Lead Welcome Notification', 'Thank you for reaching out to {{business_name}}', '<p>Dear {{lead_name}},</p><p>Thank you for contacting {{business_name}}. We have received your inquiry regarding <strong>{{requirement}}</strong> and our team will get in touch shortly.</p><p>Warm regards,<br>{{business_name}}</p>', 'crm', '["lead_name", "business_name", "requirement"]'),
(3, 'Quotation Sent', 'Quotation #{{quote_number}} from {{business_name}}', '<p>Hello {{customer_name}},</p><p>Please find attached our quotation #<strong>{{quote_number}}</strong> for total amount of {{currency}} {{total_amount}}.</p><p>Valid until: {{expiry_date}}</p><p>Best regards,<br>{{business_name}}</p>', 'billing', '["customer_name", "quote_number", "business_name", "currency", "total_amount", "expiry_date"]')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 8. Core System Settings
INSERT INTO `settings` (`setting_key`, `setting_value`, `setting_group`, `is_encrypted`) VALUES
('site_name', 'BharatAI Business OS', 'general', 0),
('site_tagline', 'AI-Powered Business Automation Platform', 'general', 0),
('default_currency', 'INR', 'localization', 0),
('default_timezone', 'Asia/Kolkata', 'localization', 0),
('allow_registration', '1', 'auth', 0),
('default_trial_days', '14', 'billing', 0),
('max_ai_retry_count', '3', 'ai', 0)
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

SET FOREIGN_KEY_CHECKS = 1;
