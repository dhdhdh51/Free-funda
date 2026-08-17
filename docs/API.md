# BharatAI Business OS - REST API Reference

All requests must use JSON headers (`Content-Type: application/json`).
For authenticated requests, pass `Authorization: Bearer <TOKEN>` or provide session cookies.

### 1. Health Check
`GET /api/v1/health`
Returns system status, database connection, and PHP runtime version.

### 2. Authentication
`POST /api/v1/auth/login`
```json
{
  "email": "owner@acmedesign.com",
  "password": "SecurePassword123"
}
```

### 3. CRM Leads
`GET /api/v1/leads?business_id=1&status_id=1&search=acme`
`POST /api/v1/leads`
```json
{
  "business_id": 1,
  "first_name": "Rahul",
  "last_name": "Sharma",
  "email": "rahul@techstart.in",
  "phone": "+91 98765 43210",
  "company_name": "TechStart Labs",
  "requirement": "Full enterprise automation and AI chatbot setup",
  "budget": "₹1,50,000",
  "location": "Bengaluru, India"
}
```

### 4. AI Lead Qualification
`POST /api/v1/ai/qualify-lead`
Analyzes intent, calculates lead score (0-100), buying probability, and generates response drafts.

### 5. AI Text Generation & Tools
`POST /api/v1/ai/generate`
```json
{
  "business_id": 1,
  "feature": "proposal",
  "prompt": "Create a professional digital marketing and SEO proposal for TechStart Labs"
}
```
