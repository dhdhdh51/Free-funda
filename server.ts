import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Initialize Gemini AI Client (User-Agent must be set to 'aistudio-build')
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // In-Memory Database Store with realistic multi-tenant initial state
  const state = {
    currentBusinessId: "biz_1",
    businesses: [
      {
        id: "biz_1",
        name: "Acme Digital Agency",
        slug: "acme-digital",
        businessType: "Digital Marketing & Automation",
        industry: "Agency / IT Services",
        website: "https://acmedigital.in",
        phone: "+91 98765 43210",
        email: "contact@acmedigital.in",
        currency: "INR",
        currencySymbol: "₹",
        timezone: "Asia/Kolkata",
        about: "We provide AI-powered marketing, lead automation, and web development for SMBs across India.",
        usp: "Guaranteed 3x lead growth through customized AI automation pipelines.",
        plan: "Growth Pro",
        creditsUsed: 42800,
        creditsLimit: 250000,
      },
      {
        id: "biz_2",
        name: "Bharat Real Estate Co.",
        slug: "bharat-realestate",
        businessType: "Property Consultancy",
        industry: "Real Estate",
        website: "https://bharatproperties.com",
        phone: "+91 99887 66554",
        email: "sales@bharatproperties.com",
        currency: "INR",
        currencySymbol: "₹",
        timezone: "Asia/Kolkata",
        about: "Premier residential and commercial real estate advisory in Mumbai and Delhi NCR.",
        usp: "Verified property listings with zero-brokerage direct buyer support.",
        plan: "Enterprise",
        creditsUsed: 115000,
        creditsLimit: 1000000,
      },
    ],
    leads: [
      {
        id: "lead_101",
        businessId: "biz_1",
        firstName: "Vikram",
        lastName: "Malhotra",
        email: "vikram@malhotralogistics.com",
        phone: "+91 98231 44556",
        companyName: "Malhotra Logistics Pvt Ltd",
        status: "Qualified",
        priority: "high",
        estimatedValue: 125000,
        requirement: "Need automated WhatsApp and email CRM to track warehouse shipping inquiries and B2B vendor quotes.",
        budget: "₹1,00,000 - ₹1,50,000",
        location: "Pune, Maharashtra",
        aiScore: 92,
        aiIntent: "High",
        aiBuyingProbability: "88%",
        aiRecommendedAction: "Schedule a 20-minute technical workflow demo and share logistics automation case study.",
        aiSuggestedResponse: "Dear Vikram, thank you for reaching out to Acme Digital. We have extensive experience building WhatsApp CRM pipelines for logistics firms. Let's connect tomorrow at 3 PM to review your vendor inquiry workflow.",
        createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      },
      {
        id: "lead_102",
        businessId: "biz_1",
        firstName: "Priya",
        lastName: "Nair",
        email: "priya@ayurbliss.in",
        phone: "+91 97112 33445",
        companyName: "AyurBliss Organic Wellness",
        status: "New Inquiry",
        priority: "medium",
        estimatedValue: 60000,
        requirement: "Looking for an AI chatbot on Shopify to answer customer questions on skincare ingredients and capture leads.",
        budget: "₹50,000",
        location: "Kochi, Kerala",
        aiScore: 78,
        aiIntent: "Medium",
        aiBuyingProbability: "70%",
        aiRecommendedAction: "Send interactive chatbot demo link and pricing package for e-commerce stores.",
        aiSuggestedResponse: "Hi Priya, wonderful to connect! Our AI website chatbot integrates smoothly with Shopify and handles 24/7 product recommendation. Would you like to see a live demo?",
        createdAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
      },
      {
        id: "lead_103",
        businessId: "biz_1",
        firstName: "Amit",
        lastName: "Verma",
        email: "amit@vermaclinics.com",
        phone: "+91 98450 11223",
        companyName: "Verma Dental Care Clinics",
        status: "Proposal Sent",
        priority: "urgent",
        estimatedValue: 200000,
        requirement: "Multi-branch appointment booking bot with automated SMS reminder & follow-up sequence.",
        budget: "₹2,00,000",
        location: "Delhi NCR",
        aiScore: 95,
        aiIntent: "High",
        aiBuyingProbability: "92%",
        aiRecommendedAction: "Follow up on proposal terms and confirm timeline for 3 clinic branches.",
        aiSuggestedResponse: "Hello Amit, I have sent over the customized quotation and implementation timeline for your clinics. Looking forward to reviewing any questions.",
        createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
      },
    ],
    customers: [
      {
        id: "cust_1",
        businessId: "biz_1",
        name: "Dr. Rajesh Gupta",
        company: "Gupta Ortho Hospital",
        email: "rajesh@guptahospital.com",
        phone: "+91 98111 22334",
        lifetimeValue: 340000,
        status: "active",
        createdAt: "2025-11-12T10:00:00.000Z",
      },
      {
        id: "cust_2",
        businessId: "biz_1",
        name: "Sunita Kapoor",
        company: "Kapoor Jewels Exports",
        email: "sunita@kapoorjewels.com",
        phone: "+91 98222 33445",
        lifetimeValue: 480000,
        status: "active",
        createdAt: "2025-12-05T14:30:00.000Z",
      },
    ],
    proposals: [
      {
        id: "prop_1",
        businessId: "biz_1",
        title: "AI CRM & Lead Automation Pipeline",
        clientName: "Malhotra Logistics Pvt Ltd",
        amount: 125000,
        status: "sent",
        validUntil: "2026-09-15",
        scope: "Setup of omni-channel AI lead scoring, WhatsApp integration, and automated follow-up scheduler.",
        deliverables: "1. AI Chatbot Widget\n2. CRM Pipeline Setup\n3. WhatsApp Gateway Integration\n4. Staff Training Session",
        createdAt: new Date().toISOString(),
      },
    ],
    quotations: [
      {
        id: "quote_1",
        businessId: "biz_1",
        quoteNumber: "QT-2026-0042",
        customerName: "Verma Dental Care Clinics",
        subtotal: 180000,
        taxAmount: 32400,
        totalAmount: 212400,
        status: "sent",
        items: [
          { name: "Enterprise AI Chatbot Widget", qty: 3, unitPrice: 35000, total: 105000 },
          { name: "SMS Appointment Automation Suite", qty: 1, unitPrice: 45000, total: 45000 },
          { name: "Custom CRM API Setup", qty: 1, unitPrice: 30000, total: 30000 },
        ],
        createdAt: new Date().toISOString(),
      },
    ],
    knowledgeSources: [
      {
        id: "kb_1",
        businessId: "biz_1",
        title: "Acme Agency Service Catalog & Pricing Guide",
        type: "manual_text",
        status: "indexed",
        chunkCount: 12,
        content: "Acme Digital Agency offers 3 core packages: Starter AI Automation (₹25,000/mo), Growth CRM Pipeline (₹60,000/mo), and Enterprise Omnichannel Bot (₹1,50,000 one-time). Standard turnaround time is 7 business days. We provide 99.9% uptime SLA and dedicated support.",
      },
      {
        id: "kb_2",
        businessId: "biz_1",
        title: "Frequently Asked Questions & Support Policy",
        type: "faq",
        status: "indexed",
        chunkCount: 8,
        content: "Q: What integrations are supported? A: WhatsApp, Shopify, WooCommerce, Webhooks, Google Sheets, and REST APIs. Q: What is the refund policy? A: 14-day satisfaction guarantee on subscription onboarding.",
      },
    ],
    automations: [
      {
        id: "auto_1",
        businessId: "biz_1",
        name: "Instant Welcome Email on New Lead",
        trigger: "lead.created",
        action: "send_email",
        status: "active",
        runsCount: 48,
      },
      {
        id: "auto_2",
        businessId: "biz_1",
        name: "Auto AI Lead Qualification & Task Creation",
        trigger: "lead.created",
        action: "ai_qualify",
        status: "active",
        runsCount: 35,
      },
    ],
    chatbotConfig: {
      botName: "BharatBot Assistant",
      welcomeMessage: "Namaste! Welcome to our business. How can I help boost your sales or answer your questions today?",
      primaryColor: "#4f46e5",
      tone: "Professional & Helpful",
      requirePhone: true,
      requireEmail: true,
      leadCaptureEnabled: true,
    },
    aiProviders: [
      { id: "1", name: "Google Gemini (Primary)", key: "gemini", model: "gemini-3.7-flash", apiKey: process.env.GEMINI_API_KEY ? "configured (env/db)" : "", baseUrl: "https://generativelanguage.googleapis.com/v1beta", isEnabled: true, priority: 1, temperature: 0.7, maxTokens: 4096 },
      { id: "2", name: "OpenAI GPT-4o (Fallback 1)", key: "openai", model: "gpt-4o-mini", apiKey: process.env.OPENAI_API_KEY ? "configured (env/db)" : "", baseUrl: "https://api.openai.com/v1", isEnabled: true, priority: 2, temperature: 0.7, maxTokens: 4096 },
      { id: "3", name: "Anthropic Claude (Fallback 2)", key: "anthropic", model: "claude-3-5-sonnet", apiKey: process.env.ANTHROPIC_API_KEY ? "configured (env/db)" : "", baseUrl: "https://api.anthropic.com/v1", isEnabled: true, priority: 3, temperature: 0.7, maxTokens: 4096 },
      { id: "4", name: "Custom OpenAI-Compatible API", key: "custom", model: "llama-3-70b", apiKey: "", baseUrl: "https://api.together.xyz/v1", isEnabled: false, priority: 4, temperature: 0.7, maxTokens: 4096 },
    ],
    landingSettings: {
      badgeText: "Autonomous Business AI Engine & CRM",
      headline: "Supercharge Your Business Operations with",
      headlineHighlight: "Autonomous AI",
      subtitle: "Close deals 10x faster. BharatAI unites intelligent CRM pipelines, 24/7 autonomous sales chatbots, predictive lead scoring, and automated follow-ups into one seamless enterprise hub.",
      primaryCtaText: "Get Started Free",
      metric1Label: "Lead Velocity",
      metric1Value: "10x Faster",
      metric2Label: "SLA Uptime",
      metric2Value: "99.99%",
      metric3Label: "AI Response Time",
      metric3Value: "< 1.2s",
      metric4Label: "Enterprise Security",
      metric4Value: "Bank-Grade AES-256",
      featuresTitle: "Engineered for High-Growth Businesses",
      featuresSubtitle: "Turn every customer interaction into revenue with our unified suite of intelligent business tools.",
      features: [
        { id: "feat_1", title: "Predictive CRM & Lead Scoring", description: "Real-time 0-100 buying intent scoring, automated lead qualification, and AI-recommended sales actions." },
        { id: "feat_2", title: "24/7 Autonomous Sales AI", description: "Embeddable website agent that engages prospects, qualifies requirements, and books meetings around the clock." },
        { id: "feat_3", title: "Instant Proposals & Quotations", description: "Generate branded, itemized quotations and comprehensive sales proposals tailored to your client in seconds." },
        { id: "feat_4", title: "Event-Driven Workflows", description: "Intelligent automation rules for automated email drip sequences, reminders, and multi-channel webhook triggers." },
        { id: "feat_5", title: "Multi-Tenant Workspace Isolation", description: "Manage multiple branches, client portfolios, or agency accounts with complete data isolation and custom branding." },
        { id: "feat_6", title: "Enterprise Security & Audit Logs", description: "Full role-based access control, encrypted credentials, tamper-proof activity audit trails, and data sovereignty." },
      ],
      pricingTitle: "Simple, Transparent Pricing",
      pricingSubtitle: "Choose the plan that fits your growth. Upgrade or cancel anytime.",
      plans: [
        {
          id: "plan_1",
          name: "Starter",
          price: "₹2,499",
          period: "/mo",
          description: "Ideal for solo consultants and growing teams starting with AI lead capture.",
          features: [
            "5,000 AI Credits / month",
            "1 Dedicated Workspace",
            "100 Active CRM Leads",
            "Website AI Chatbot Widget",
            "AI Lead Qualification & Scoring",
            "Standard Support",
          ],
          highlight: false,
        },
        {
          id: "plan_2",
          name: "Growth Pro",
          price: "₹6,999",
          period: "/mo",
          description: "For scaling businesses and sales teams accelerating revenue & outreach.",
          features: [
            "250,000 AI Credits / month",
            "5 Dedicated Workspaces",
            "Unlimited CRM Pipeline Leads",
            "AI Proposal & Quote Generator",
            "High-Availability AI Routing",
            "Automated Email & Task Workflows",
            "Priority 24/7 Support",
          ],
          highlight: true,
          badge: "Most Popular",
        },
        {
          id: "plan_3",
          name: "Enterprise Agency",
          price: "₹18,999",
          period: "/mo",
          description: "Comprehensive multi-tenant solution for managing enterprise client portfolios.",
          features: [
            "1,000,000 AI Credits / month",
            "Unlimited Client Workspaces",
            "Agency Multi-Tenant Switcher",
            "Custom Branding & White-labeling",
            "Dedicated Webhooks & REST API Access",
            "Advanced Audit Logs & Permissions",
            "Dedicated Account Manager",
          ],
          highlight: false,
        },
      ],
      footerCopyright: "© 2026 BharatAI Business OS. All rights reserved. Enterprise Business Automation Platform.",
    },
    systemSettings: {
      platformName: "BharatAI Business OS",
      tagline: "Autonomous Business Operations & AI CRM",
      supportEmail: "support@bharatai.os",
      defaultCurrency: "INR",
      currencySymbol: "₹",
      smtpHost: "smtp.mailgun.org",
      smtpPort: 587,
      smtpUsername: "postmaster@bharatai.os",
      smtpFromEmail: "noreply@bharatai.os",
      smtpFromName: "BharatAI Notifications",
      enablePublicRegistration: true,
      maintenanceMode: false,
    },
    auditLogs: [
      { id: "log_1", action: "User Login", user: "owner@acmedigital.in", ip: "103.21.244.12", time: "Just now" },
      { id: "log_2", action: "AI Lead Qualified", user: "System Cron", ip: "127.0.0.1", time: "15 mins ago" },
      { id: "log_3", action: "Proposal Generated", user: "owner@acmedigital.in", ip: "103.21.244.12", time: "1 hour ago" },
    ],
  };

  // -------------------------------------------------------------
  // API Routes
  // -------------------------------------------------------------

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "operational",
      app: "BharatAI Business OS",
      version: "1.0.0",
      php_compatibility: "PHP 8.2+ / MySQL 8.0+",
      timestamp: new Date().toISOString(),
    });
  });

  // Get full state
  app.get("/api/state", (_req, res) => {
    res.json({ success: true, data: state });
  });

  // Switch Active Business (Multi-Tenant Agency switcher)
  app.post("/api/business/switch", (req, res) => {
    const { businessId } = req.body;
    if (businessId && state.businesses.some((b) => b.id === businessId)) {
      state.currentBusinessId = businessId;
      res.json({ success: true, currentBusinessId: businessId });
    } else {
      res.status(400).json({ success: false, message: "Business ID not found" });
    }
  });

  // Create Business
  app.post("/api/business/create", (req, res) => {
    const { name, businessType, industry, website, phone, email } = req.body;
    const newBiz = {
      id: "biz_" + Date.now(),
      name: name || "New Enterprise",
      slug: (name || "business").toLowerCase().replace(/[^a-z0-9]/g, "-"),
      businessType: businessType || "Services",
      industry: industry || "General",
      website: website || "",
      phone: phone || "",
      email: email || "",
      currency: "INR",
      currencySymbol: "₹",
      timezone: "Asia/Kolkata",
      about: req.body.about || "",
      usp: req.body.usp || "",
      plan: "Growth Pro",
      creditsUsed: 0,
      creditsLimit: 250000,
    };
    state.businesses.push(newBiz);
    state.currentBusinessId = newBiz.id;
    res.json({ success: true, business: newBiz });
  });

  // Leads CRUD
  app.post("/api/leads/create", (req, res) => {
    const lead = {
      id: "lead_" + Date.now(),
      businessId: state.currentBusinessId,
      firstName: req.body.firstName || "Inquiry",
      lastName: req.body.lastName || "",
      email: req.body.email || "",
      phone: req.body.phone || "",
      companyName: req.body.companyName || "",
      status: req.body.status || "New Inquiry",
      priority: req.body.priority || "medium",
      estimatedValue: Number(req.body.estimatedValue) || 25000,
      requirement: req.body.requirement || "General business inquiry",
      budget: req.body.budget || "₹25,000",
      location: req.body.location || "India",
      aiScore: null,
      aiIntent: null,
      aiBuyingProbability: null,
      aiRecommendedAction: null,
      aiSuggestedResponse: null,
      createdAt: new Date().toISOString(),
    };
    state.leads.unshift(lead);
    state.auditLogs.unshift({
      id: "log_" + Date.now(),
      action: `Lead Created: ${lead.firstName} ${lead.lastName}`,
      user: "Admin",
      ip: "127.0.0.1",
      time: "Just now",
    });
    res.json({ success: true, lead });
  });

  app.post("/api/leads/update-status", (req, res) => {
    const { leadId, status } = req.body;
    const lead = state.leads.find((l) => l.id === leadId);
    if (lead) {
      lead.status = status;
      res.json({ success: true, lead });
    } else {
      res.status(404).json({ success: false, message: "Lead not found" });
    }
  });

  // AI Lead Qualification (Real Gemini AI Call)
  app.post("/api/ai/qualify-lead", async (req, res) => {
    try {
      const { leadId, leadData } = req.body;
      const targetLead = leadId ? state.leads.find((l) => l.id === leadId) : leadData;

      if (!targetLead) {
        return res.status(400).json({ success: false, message: "No lead provided for qualification." });
      }

      const prompt = `Analyze this prospective business lead and return ONLY a valid JSON object with:
- score: integer from 0 to 100 representing lead quality
- intent: 'High', 'Medium', or 'Low'
- buying_probability: string like '85%' or '40%'
- priority: 'urgent', 'high', 'medium', or 'low'
- recommended_action: 1-2 sentence immediate actionable next step for the sales team
- suggested_response: a professional, warm, customized email/WhatsApp reply draft addressing their specific need.

Lead details:
Name: ${targetLead.firstName} ${targetLead.lastName || ""}
Company: ${targetLead.companyName || "N/A"}
Email: ${targetLead.email || "N/A"}
Phone: ${targetLead.phone || "N/A"}
Requirement: ${targetLead.requirement || "N/A"}
Budget: ${targetLead.budget || "N/A"}
Location: ${targetLead.location || "N/A"}`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are BharatAI Business OS Lead Qualification Engine. Return only valid JSON without markdown wrapping if possible.",
          responseMimeType: "application/json",
        },
      });

      let parsed: any = {};
      try {
        parsed = JSON.parse(aiResponse.text || "{}");
      } catch {
        const text = (aiResponse.text || "").replace(/```(?:json)?\s*(.*?)\s*```/s, "$1").trim();
        parsed = JSON.parse(text || "{}");
      }

      if (leadId) {
        const existing = state.leads.find((l) => l.id === leadId);
        if (existing) {
          existing.aiScore = parsed.score || 85;
          existing.aiIntent = parsed.intent || "High";
          existing.aiBuyingProbability = parsed.buying_probability || "80%";
          existing.aiRecommendedAction = parsed.recommended_action || "Schedule a consultation call.";
          existing.aiSuggestedResponse = parsed.suggested_response || "Thank you for reaching out!";
          existing.status = "Qualified";
        }
      }

      // Deduct token usage
      const biz = state.businesses.find((b) => b.id === state.currentBusinessId);
      if (biz) biz.creditsUsed += 350;

      res.json({ success: true, qualification: parsed });
    } catch (err: any) {
      console.error("AI Qualification Error:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to qualify lead" });
    }
  });

  // AI Business Assistant Chat (Real Gemini AI Call with Business Context)
  app.post("/api/ai/assistant", async (req, res) => {
    try {
      const { message, conversationHistory = [] } = req.body;
      const biz = state.businesses.find((b) => b.id === state.currentBusinessId) || state.businesses[0];
      const kbDocs = state.knowledgeSources.filter((k) => k.businessId === biz.id).map((k) => `${k.title}: ${k.content}`).join("\n\n");

      const systemPrompt = `You are BharatAI Business Assistant, an expert business growth and automation strategist for "${biz.name}".
Business Details:
- Industry: ${biz.industry} (${biz.businessType})
- About: ${biz.about}
- Unique Value Proposition: ${biz.usp}
- Currency: ${biz.currency} (${biz.currencySymbol})

Knowledge Base Context:
${kbDocs}

CRM Overview:
- Total active leads: ${state.leads.length}
- Recent high-value leads: ${state.leads.map((l) => `${l.firstName} from ${l.companyName} (Req: ${l.requirement}, Val: ${biz.currencySymbol}${l.estimatedValue})`).join("; ")}

Be professional, concise, proactive, and provide actionable responses, quotes, email drafts, or strategy calculations formatted with clean markdown.`;

      const contents: any[] = conversationHistory.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      if (biz) biz.creditsUsed += 450;

      res.json({ success: true, reply: response.text || "I am ready to assist with your business tasks." });
    } catch (err: any) {
      console.error("Assistant Error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // AI Proposal Generator (Real Gemini Call)
  app.post("/api/ai/generate-proposal", async (req, res) => {
    try {
      const { clientName, requirement, budget, scopePoints } = req.body;
      const biz = state.businesses.find((b) => b.id === state.currentBusinessId) || state.businesses[0];

      const prompt = `Generate a comprehensive business proposal from "${biz.name}" for client "${clientName}".
Client Requirements: ${requirement}
Budget range: ${budget}
Key Scope: ${scopePoints || "Full end-to-end automation, software setup, and ongoing maintenance."}

Return a JSON object with:
- title: string
- introduction: 2 paragraphs introducing the partnership and understanding of the problem
- problem_statement: bullet points of client challenges
- proposed_solution: strategic architectural overview
- deliverables: array of 4-6 detailed deliverable items
- timeline: estimated implementation phases (e.g., Phase 1: 5 Days, Phase 2: 7 Days)
- pricing_items: array of objects with { item_name, quantity, unit_price, total }
- terms: payment terms and warranty`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      let parsed: any = {};
      try {
        parsed = JSON.parse(response.text || "{}");
      } catch {
        parsed = JSON.parse((response.text || "").replace(/```(?:json)?\s*(.*?)\s*```/s, "$1"));
      }

      const newProposal = {
        id: "prop_" + Date.now(),
        businessId: biz.id,
        title: parsed.title || `Proposal for ${clientName}`,
        clientName: clientName,
        amount: parsed.pricing_items?.reduce((sum: number, it: any) => sum + (Number(it.total) || 0), 0) || 120000,
        status: "draft",
        validUntil: new Date(Date.now() + 30 * 86400 * 1000).toISOString().split("T")[0],
        scope: parsed.proposed_solution || "",
        deliverables: Array.isArray(parsed.deliverables) ? parsed.deliverables.join("\n") : String(parsed.deliverables || ""),
        data: parsed,
        createdAt: new Date().toISOString(),
      };

      state.proposals.unshift(newProposal);
      res.json({ success: true, proposal: newProposal });
    } catch (err: any) {
      console.error("Proposal Error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // AI Social & Marketing Generator
  app.post("/api/ai/generate-marketing", async (req, res) => {
    try {
      const { toolType, topic, platform = "LinkedIn", tone = "Professional" } = req.body;
      const biz = state.businesses.find((b) => b.id === state.currentBusinessId) || state.businesses[0];

      let prompt = "";
      if (toolType === "social") {
        prompt = `Write a high-converting ${platform} post for business "${biz.name}" (${biz.industry}) about topic: "${topic}". Tone: ${tone}. Include compelling hook, value points, call to action, and 5 hashtags.`;
      } else if (toolType === "seo") {
        prompt = `Generate a complete SEO Content Outline & Meta Package for target keyword: "${topic}". Include SEO Title, Meta Description (155 chars), slug, H2/H3 outline, 3 FAQs, and target search intent.`;
      } else if (toolType === "review") {
        prompt = `Generate 3 professional review responses (1 enthusiastic appreciation, 1 balanced professional response, 1 empathetic resolution response) to customer feedback: "${topic}".`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
      });

      res.json({ success: true, content: response.text });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Knowledge Base CRUD
  app.post("/api/knowledge/add", (req, res) => {
    const { title, type, content } = req.body;
    const newSource = {
      id: "kb_" + Date.now(),
      businessId: state.currentBusinessId,
      title: title || "New Knowledge Document",
      type: type || "manual_text",
      status: "indexed",
      chunkCount: Math.ceil((content?.length || 100) / 200),
      content: content || "",
    };
    state.knowledgeSources.unshift(newSource);
    res.json({ success: true, source: newSource });
  });

  // Chatbot Widget Public Endpoint
  app.post("/api/chatbot/message", async (req, res) => {
    try {
      const { message, visitorInfo, businessId = state.currentBusinessId } = req.body;
      const biz = state.businesses.find((b) => b.id === businessId) || state.businesses[0];
      const kbDocs = state.knowledgeSources.filter((k) => k.businessId === biz.id).map((k) => `${k.title}: ${k.content}`).join("\n\n");

      const prompt = `You are ${state.chatbotConfig.botName}, the friendly automated assistant on the official website of ${biz.name}.
Business details: ${biz.about}. USP: ${biz.usp}.
Knowledge Base Context:
${kbDocs}

Visitor message: "${message}"

Answer the visitor's question warmly and accurately in 2-3 sentences. If they show interest in buying or receiving a quote, ask politely for their contact name, phone, or email.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
      });

      res.json({ success: true, reply: response.text });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------
  // Dynamic Admin Panel Endpoints
  // -------------------------------------------------------------

  // Update AI Providers
  app.post("/api/admin/ai-providers/update", (req, res) => {
    const { providers } = req.body;
    if (Array.isArray(providers)) {
      state.aiProviders = providers;
      state.auditLogs.unshift({
        id: "log_" + Date.now(),
        action: "AI Providers Configuration Updated",
        user: "Super Admin",
        ip: "127.0.0.1",
        time: "Just now",
      });
      res.json({ success: true, message: "AI Providers successfully updated.", providers: state.aiProviders });
    } else {
      res.status(400).json({ success: false, message: "Invalid provider payload." });
    }
  });

  // Test AI Provider Connection (Supports Gemini, OpenAI, Anthropic, and Custom Fallback URLs)
  app.post("/api/admin/ai-providers/test", async (req, res) => {
    const { providerKey, model, apiKey, baseUrl } = req.body;
    const startTime = Date.now();
    try {
      const testPrompt = "Respond with a single sentence confirming active system connectivity.";

      // If it's a custom endpoint or has a custom base URL with OpenAI compatible API
      if (baseUrl && (providerKey === "custom" || providerKey === "openai" || !providerKey?.includes("gemini"))) {
        const effectiveUrl = baseUrl.endsWith("/chat/completions") 
          ? baseUrl 
          : `${baseUrl.replace(/\/+$/, "")}/chat/completions`;

        try {
          const fetchRes = await fetch(effectiveUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(apiKey && apiKey !== "configured (env/db)" ? { "Authorization": `Bearer ${apiKey}` } : {}),
            },
            body: JSON.stringify({
              model: model || "llama-3-70b",
              messages: [{ role: "user", content: testPrompt }],
              max_tokens: 60,
              temperature: 0.7,
            }),
            signal: AbortSignal.timeout(8000),
          });

          const data: any = await fetchRes.json();
          const latency = Date.now() - startTime;

          if (fetchRes.ok && (data.choices?.[0]?.message?.content || data.response)) {
            return res.json({
              success: true,
              provider: providerKey || "custom",
              model: model || "custom-model",
              status: "operational",
              latencyMs: latency,
              sampleOutput: (data.choices?.[0]?.message?.content || data.response || "Custom endpoint verified.").trim(),
            });
          } else {
            // If the custom URL isn't running locally or returned an error, give helpful feedback
            const errMsg = data.error?.message || data.message || `HTTP ${fetchRes.status}: ${fetchRes.statusText}`;
            return res.json({
              success: false,
              provider: providerKey,
              model,
              status: "error",
              latencyMs: latency,
              error: `Custom endpoint responded: ${errMsg}`,
            });
          }
        } catch (fetchErr: any) {
          // If connection refused (e.g. localhost ollama not currently started) or timeout
          const latency = Date.now() - startTime;
          return res.json({
            success: false,
            provider: providerKey,
            model,
            status: "error",
            latencyMs: latency,
            error: `Failed to reach custom URL ${baseUrl}: ${fetchErr.message || "Connection refused/timeout"}`,
          });
        }
      }

      // Default: Google Gemini Test
      const testClient = apiKey && apiKey !== "configured (env/db)" 
        ? new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } })
        : ai;

      const response = await testClient.models.generateContent({
        model: model || "gemini-3.7-flash",
        contents: testPrompt,
      });

      const latency = Date.now() - startTime;
      res.json({
        success: true,
        provider: providerKey || "gemini",
        model: model || "gemini-3.7-flash",
        status: "operational",
        latencyMs: latency,
        sampleOutput: response.text?.trim() || "Model online & active.",
      });
    } catch (err: any) {
      const latency = Date.now() - startTime;
      res.json({
        success: false,
        provider: providerKey,
        model,
        status: "error",
        latencyMs: latency,
        error: err.message || "Failed to reach AI model endpoint.",
      });
    }
  });

  // Update Landing Page CMS Settings
  app.post("/api/admin/landing-settings", (req, res) => {
    const { landingSettings } = req.body;
    if (landingSettings) {
      state.landingSettings = { ...state.landingSettings, ...landingSettings };
      state.auditLogs.unshift({
        id: "log_" + Date.now(),
        action: "Landing Page CMS Text Updated",
        user: "Super Admin",
        ip: "127.0.0.1",
        time: "Just now",
      });
      res.json({ success: true, message: "Landing Page settings updated.", landingSettings: state.landingSettings });
    } else {
      res.status(400).json({ success: false, message: "No settings provided." });
    }
  });

  // Update System Branding & SMTP Settings
  app.post("/api/admin/system-settings", (req, res) => {
    const { systemSettings } = req.body;
    if (systemSettings) {
      state.systemSettings = { ...state.systemSettings, ...systemSettings };
      state.auditLogs.unshift({
        id: "log_" + Date.now(),
        action: "System & SMTP Settings Updated",
        user: "Super Admin",
        ip: "127.0.0.1",
        time: "Just now",
      });
      res.json({ success: true, message: "System & SMTP settings saved.", systemSettings: state.systemSettings });
    } else {
      res.status(400).json({ success: false, message: "No system settings provided." });
    }
  });

  // Source Code Inspector: Read native PHP files for user to view & copy
  app.get("/api/system/source-files", (_req, res) => {
    const fileList = [
      { name: "schema.sql", path: "/database/schema.sql", description: "MySQL 8+ Complete Schema DDL (40+ Tables)" },
      { name: "seed_demo.sql", path: "/database/seed_demo.sql", description: "Initial Seed Data, Roles, Plans & Templates" },
      { name: "config.php", path: "/config.php", description: "Core PHP Config & PDO Database Singleton" },
      { name: "index.php", path: "/index.php", description: "Root Apache / cPanel Router & Dispatcher" },
      { name: "User.php", path: "/app/models/User.php", description: "User Model & Multi-Tenant Membership Queries" },
      { name: "Business.php", path: "/app/models/Business.php", description: "Business Multi-Tenant Isolation & Credits Model" },
      { name: "Lead.php", path: "/app/models/Lead.php", description: "Lead Pipeline, Status & AI Qualification Model" },
      { name: "Proposal.php", path: "/app/models/Proposal.php", description: "Proposals & Quotations Storage Model" },
      { name: "KnowledgeSource.php", path: "/app/models/KnowledgeSource.php", description: "RAG Knowledge Base & Chunk Model" },
      { name: "AutomationRule.php", path: "/app/models/AutomationRule.php", description: "Event Triggers & Automation Rules Model" },
      { name: "AuthController.php", path: "/app/controllers/AuthController.php", description: "Authentication, Registration & Session Controller" },
      { name: "LeadController.php", path: "/app/controllers/LeadController.php", description: "CRM Lead Pipeline & AI Qualify Controller" },
      { name: "AIController.php", path: "/app/controllers/AIController.php", description: "AI Assistant & Marketing Suite Controller" },
      { name: "ChatbotController.php", path: "/app/controllers/ChatbotController.php", description: "Public Chatbot Message & Lead Capture Controller" },
      { name: "ProposalController.php", path: "/app/controllers/ProposalController.php", description: "Proposal Generator & PDF Controller" },
      { name: "BusinessController.php", path: "/app/controllers/BusinessController.php", description: "Business Settings & Profile Controller" },
      { name: "AdminController.php", path: "/app/controllers/AdminController.php", description: "Super Admin Health Diagnostics Controller" },
      { name: "AIService.php", path: "/app/services/AIService.php", description: "Multi-Provider AI Fallback Engine (Gemini/OpenAI/Anthropic)" },
      { name: "CRMService.php", path: "/app/services/CRMService.php", description: "CRM Lead Pipeline & Activity Logic" },
      { name: "KnowledgeBaseService.php", path: "/app/services/KnowledgeBaseService.php", description: "RAG Context Search & Chunk Retrieval Service" },
      { name: "ProposalService.php", path: "/app/services/ProposalService.php", description: "AI Proposal Drafting & Calculation Service" },
      { name: "MailService.php", path: "/app/services/MailService.php", description: "SMTP Mail Dispatcher & Template Engine" },
      { name: "PaymentService.php", path: "/app/services/PaymentService.php", description: "Razorpay / Stripe Payment Gateway Abstraction" },
      { name: "AuthMiddleware.php", path: "/app/middleware/AuthMiddleware.php", description: "Session & Bearer Token Authentication & Multi-Tenant Guard" },
      { name: "RateLimitMiddleware.php", path: "/app/middleware/RateLimitMiddleware.php", description: "IP & Session API Rate Limiting Middleware" },
      { name: "GoogleAuthHelper.php", path: "/app/helpers/GoogleAuthHelper.php", description: "Dynamic Google OAuth 2.0 Auto-Detect Fallback & JWT Service" },
      { name: "auth/google/index.php", path: "/auth/google/index.php", description: "Dynamic Google OAuth Initiator & State Dispatcher" },
      { name: "auth/google/callback.php", path: "/auth/google/callback.php", description: "Google OAuth Callback & Automatic User/Tenant Provisioning" },
      { name: "ResponseHelper.php", path: "/app/helpers/ResponseHelper.php", description: "Standard JSON API Response Formatter" },
      { name: "SecurityHelper.php", path: "/app/helpers/SecurityHelper.php", description: "Password Hashing, CSRF & XSS Sanitization" },
      { name: "ValidationHelper.php", path: "/app/helpers/ValidationHelper.php", description: "Server-side Input & Email Validation Helper" },
      { name: "api/index.php", path: "/api/index.php", description: "PHP REST API Endpoint Router" },
      { name: "api/auth/login.php", path: "/api/auth/login.php", description: "Direct API: User Login & Token Endpoint" },
      { name: "api/auth/register.php", path: "/api/auth/register.php", description: "Direct API: Business Registration Endpoint" },
      { name: "api/leads/index.php", path: "/api/leads/index.php", description: "Direct API: CRM Leads CRUD & AI Qualify" },
      { name: "api/ai/generate.php", path: "/api/ai/generate.php", description: "Direct API: AI Assistant & Copy Generation" },
      { name: "api/chat/widget.php", path: "/api/chat/widget.php", description: "Direct API: Public Website Chatbot Endpoint" },
      { name: "auth/login.php", path: "/auth/login.php", description: "Native PHP User Login Page" },
      { name: "auth/register.php", path: "/auth/register.php", description: "Native PHP Business Registration Page" },
      { name: "dashboard/index.php", path: "/dashboard/index.php", description: "Native PHP Multi-Tenant Dashboard View" },
      { name: "admin/index.php", path: "/admin/index.php", description: "Native PHP Super Admin Health View" },
      { name: "install/index.php", path: "/install/index.php", description: "First-Run 3-Step Setup Wizard" },
      { name: "chat-widget.js", path: "/public/assets/js/chat-widget.js", description: "Embeddable JavaScript Website Chatbot Widget" },
      { name: "run_automations.php", path: "/cron/run_automations.php", description: "Automated Rules & Lead Trigger Cron Job" },
      { name: "send_scheduled_emails.php", path: "/cron/send_scheduled_emails.php", description: "Queue & SMTP Email Dispatcher Cron Job" },
      { name: "cleanup_logs.php", path: "/cron/cleanup_logs.php", description: "Log Maintenance & Session Cleanup Cron Job" },
      { name: "process_webhooks.php", path: "/cron/process_webhooks.php", description: "Webhook Event Queue Delivery Cron Job" },
      { name: ".htaccess", path: "/.htaccess", description: "Apache Security Rules & URL Rewriting" },
      { name: ".env.example", path: "/.env.example", description: "Environment Configuration Template" },
      { name: "CPANEL_DEPLOYMENT.md", path: "/docs/CPANEL_DEPLOYMENT.md", description: "cPanel & Shared Hosting Step-by-Step Guide" },
      { name: "AWS_DEPLOYMENT.md", path: "/docs/AWS_DEPLOYMENT.md", description: "AWS EC2, RDS, SES & S3 Deployment Guide" },
      { name: "SECURITY.md", path: "/docs/SECURITY.md", description: "Security Architecture & PDO Hardening" },
      { name: "CRON.md", path: "/docs/CRON.md", description: "Cron Jobs Specification & cPanel Setup" },
      { name: "AI_PROVIDERS.md", path: "/docs/AI_PROVIDERS.md", description: "Multi-Provider AI Fallback Architecture" },
      { name: "ARCHITECTURE.md", path: "/docs/ARCHITECTURE.md", description: "Multi-Tenant Architecture Specification" },
    ];

    res.json({ success: true, files: fileList });
  });

  app.get("/api/system/file-content", (req, res) => {
    const relativePath = (req.query.path as string) || "";
    const safePath = path.normalize(path.join(process.cwd(), relativePath));

    if (!safePath.startsWith(process.cwd())) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    try {
      if (fs.existsSync(safePath)) {
        const content = fs.readFileSync(safePath, "utf-8");
        res.json({ success: true, path: relativePath, content });
      } else {
        res.status(404).json({ success: false, message: "File not found" });
      }
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Run Cron Simulation
  app.post("/api/cron/run", (_req, res) => {
    const runResult = {
      timestamp: new Date().toISOString(),
      job: "run_automations.php",
      processedRules: state.automations.length,
      leadsProcessed: state.leads.length,
      status: "success",
      executionTimeMs: 142,
    };
    state.auditLogs.unshift({
      id: "log_" + Date.now(),
      action: "Cron Job Triggered: run_automations",
      user: "System Daemon",
      ip: "127.0.0.1",
      time: "Just now",
    });
    res.json({ success: true, run: runResult });
  });

  // -------------------------------------------------------------
  // Vite Middleware for Development / Static in Production
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BharatAI Business OS Server running on port ${PORT}`);
  });
}

startServer();
