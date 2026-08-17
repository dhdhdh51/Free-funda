export interface Business {
  id: string;
  name: string;
  slug: string;
  businessType: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  about: string;
  usp: string;
  plan: string;
  creditsUsed: number;
  creditsLimit: number;
}

export interface Lead {
  id: string;
  businessId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedValue: number;
  requirement: string;
  budget: string;
  location: string;
  aiScore: number | null;
  aiIntent: string | null;
  aiBuyingProbability: string | null;
  aiRecommendedAction: string | null;
  aiSuggestedResponse: string | null;
  createdAt: string;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  lifetimeValue: number;
  status: 'active' | 'inactive' | 'churned';
  createdAt: string;
}

export interface Proposal {
  id: string;
  businessId: string;
  title: string;
  clientName: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  validUntil: string;
  scope: string;
  deliverables: string;
  data?: any;
  createdAt: string;
}

export interface Quotation {
  id: string;
  businessId: string;
  quoteNumber: string;
  customerName: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
  items: Array<{
    name: string;
    qty: number;
    unitPrice: number;
    total: number;
  }>;
  createdAt: string;
}

export interface KnowledgeSource {
  id: string;
  businessId: string;
  title: string;
  type: 'file' | 'url' | 'faq' | 'manual_text';
  status: 'pending' | 'processing' | 'indexed';
  chunkCount: number;
  content: string;
}

export interface AutomationRule {
  id: string;
  businessId: string;
  name: string;
  trigger: string;
  action: string;
  status: 'active' | 'paused';
  runsCount: number;
}

export interface AIProvider {
  id: string;
  name: string;
  key: string;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  isEnabled: boolean;
  priority: number;
  temperature?: number;
  maxTokens?: number;
}

export interface LandingFeature {
  id: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface PricingPlanItem {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlight: boolean;
  badge?: string;
}

export interface LandingPageSettings {
  badgeText: string;
  headline: string;
  headlineHighlight: string;
  subtitle: string;
  primaryCtaText: string;
  metric1Label?: string;
  metric1Value?: string;
  metric2Label?: string;
  metric2Value?: string;
  metric3Label?: string;
  metric3Value?: string;
  metric4Label?: string;
  metric4Value?: string;
  featuresTitle: string;
  featuresSubtitle: string;
  features: LandingFeature[];
  pricingTitle: string;
  pricingSubtitle: string;
  plans: PricingPlanItem[];
  footerCopyright: string;
}

export interface SystemSettings {
  platformName: string;
  tagline: string;
  supportEmail: string;
  defaultCurrency: string;
  currencySymbol: string;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword?: string;
  smtpFromEmail: string;
  smtpFromName: string;
  enablePublicRegistration: boolean;
  maintenanceMode: boolean;
  // Dynamic Google OAuth Credentials & Fallback Detection
  googleAuthEnabled?: boolean;
  googleClientId?: string;
  googleClientSecret?: string;
  googleRedirectUri?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  ip: string;
  time: string;
}
