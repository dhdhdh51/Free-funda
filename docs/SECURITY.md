# BharatAI Business OS - Security Architecture & Hardening Guide

## 1. Core Principles
BharatAI Business OS is built for enterprise-grade security on Apache / cPanel / VPS / Cloud environments.

### Key Protections
- **SQL Injection Prevention:** 100% of database interactions are written with PDO prepared statements with strict parameter binding.
- **Cross-Site Scripting (XSS):** All user-supplied inputs and outputs are sanitized using `htmlspecialchars(..., ENT_QUOTES, 'UTF-8')`.
- **Cross-Site Request Forgery (CSRF):** Synchronizer Token Pattern with cryptographically secure session-bound tokens (`random_bytes(32)`).
- **Authentication & Password Hashing:** Uses standard `password_hash()` with `PASSWORD_BCRYPT` (Cost 12) and `password_verify()`.
- **Session Security:**
  - `session.cookie_httponly = 1`
  - `session.use_only_cookies = 1`
  - `session.cookie_samesite = 'Lax'`
  - `session.cookie_secure = 1` (automatically active on HTTPS)
- **Multi-Tenant Data Isolation:** Every query enforces `WHERE business_id = :business_id` verified via server-side session or authenticated API Bearer tokens.
- **File Upload Security:** Uploaded files stored outside direct web execution paths, validated MIME types, randomized UUID filenames.

## 2. API Security & Rate Limiting
- Rate limiting middleware throttles excessive requests (default 100 req/minute per IP/API token).
- API keys utilize HMAC-SHA256 signatures for webhook verification.
