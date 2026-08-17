import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Users2,
  Workflow,
  ArrowRight,
  CheckCircle,
  FileText,
  Building2,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  Lock,
  ChevronDown,
  Calculator,
  Play,
  Check,
  Star,
  Layers,
  BarChart3,
  MessageSquareCode,
  Globe,
  Sliders,
  Award
} from 'lucide-react';
import { LandingPageSettings, SystemSettings } from '../types';

interface MarketingLandingPageProps {
  onEnterDashboard: () => void;
  landingSettings?: LandingPageSettings;
  systemSettings?: SystemSettings;
}

export const MarketingLandingPage: React.FC<MarketingLandingPageProps> = ({
  onEnterDashboard,
  landingSettings,
  systemSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'crm' | 'chatbot' | 'proposal' | 'automation'>('crm');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Interactive ROI Calculator State
  const [monthlyLeads, setMonthlyLeads] = useState<number>(150);
  const [dealValue, setDealValue] = useState<number>(25000);

  const calculatedConversions = Math.round(monthlyLeads * 0.18);
  const recoveredRevenue = calculatedConversions * dealValue;

  const platformTitle = systemSettings?.platformName || 'BharatAI Business OS';

  const faqs = [
    {
      q: 'How does the Autonomous AI Lead Scoring work?',
      a: 'When an inquiry arrives via your website chatbot, contact form, or CRM input, our multi-provider AI engine analyzes lead requirements, budget size, and timeline to generate an instant 0–100 buying score, intent classification, and recommended reply pitch.'
    },
    {
      q: 'Can I embed the 24/7 AI Chatbot on my existing website?',
      a: 'Yes! BharatAI provides a single-line embeddable JavaScript snippet (`<script src="..."></script>`) that connects natively to your WordPress, Shopify, Next.js, or custom HTML site without slowing down page speed.'
    },
    {
      q: 'Can I self-host this on my own cPanel / VPS server?',
      a: 'Yes, BharatAI is built on a 100% native PHP 8.2+ and MySQL InnoDB architecture. You can upload files directly to Apache or cPanel shared hosting with no npm or Node.js runtime required in production.'
    },
    {
      q: 'How does Multi-Tenant Agency Mode work?',
      a: 'Agency owners can create unlimited distinct business workspaces for their clients. Each workspace maintains strictly isolated leads, proposals, knowledge documents, and AI usage metrics with customized branding.'
    },
    {
      q: 'What AI models are supported out-of-the-box?',
      a: 'The platform comes pre-configured with Google Gemini 3.7 Flash, with seamless fallback support for OpenAI GPT-4o, Anthropic Claude 3.5, and any custom OpenAI-compatible endpoint.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans selection:bg-indigo-600 selection:text-white antialiased">
      
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-pink-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Top Floating Glass Navigation */}
      <header className="sticky top-0 z-50 bg-[#070913]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-base sm:text-lg text-white tracking-tight block leading-tight">{platformTitle}</span>
            <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase hidden sm:block">AI Business Automation Platform</span>
          </div>
        </div>

        {/* Desktop Quick Anchor Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#interactive-preview" className="hover:text-white transition-colors">Interactive Demo</a>
          <a href="#roi-calculator" className="hover:text-white transition-colors">ROI Calculator</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onEnterDashboard}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/25 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 max-w-6xl mx-auto text-center z-10">
        
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold mb-6 shadow-lg shadow-indigo-950/50 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>BharatAI OS 2.0 • Autonomous Revenue & Sales Intelligence</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Scale Your Business Revenue with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            Autonomous AI Workflows
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          From first website visit to closed proposal in seconds. BharatAI connects 24/7 sales chatbots, predictive lead scoring, automated follow-ups, and quotation generators into one unified operating system.
        </p>

        {/* Hero Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <button
            onClick={onEnterDashboard}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={onEnterDashboard}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
            <span>Open Live Dashboard</span>
          </button>
        </div>

        {/* Trust Points */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant 1-Minute Setup</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Data Privacy & Security</span>
          </div>
        </div>

        {/* Live Performance Metric Cards */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-center bg-slate-900/60 border border-slate-800/80 p-4 sm:p-5 rounded-2xl backdrop-blur-md shadow-2xl">
          <div className="p-2 sm:p-3">
            <div className="text-xl sm:text-2xl font-black text-white font-mono flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>10x Faster</span>
            </div>
            <span className="text-slate-400 text-xs mt-1 block font-medium">Deal Closing Speed</span>
          </div>

          <div className="p-2 sm:p-3 border-l border-slate-800">
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>94%</span>
            </div>
            <span className="text-slate-400 text-xs mt-1 block font-medium">Lead Score Accuracy</span>
          </div>

          <div className="p-2 sm:p-3 border-l border-slate-800">
            <div className="text-xl sm:text-2xl font-black text-indigo-400 font-mono flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>&lt; 1.2s</span>
            </div>
            <span className="text-slate-400 text-xs mt-1 block font-medium">AI Inference Time</span>
          </div>

          <div className="p-2 sm:p-3 border-l border-slate-800">
            <div className="text-xl sm:text-2xl font-black text-purple-400 font-mono flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>99.99%</span>
            </div>
            <span className="text-slate-400 text-xs mt-1 block font-medium">System SLA Uptime</span>
          </div>
        </div>
      </section>

      {/* Interactive Live Product Sandbox & Simulator */}
      <section id="interactive-preview" className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto z-10 relative">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Interactive Live Preview</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            See the Autonomous Engine in Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Switch between real capabilities to experience how BharatAI automates every touchpoint.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl max-w-2xl mx-auto mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('crm')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'crm' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>AI Lead Scoring</span>
          </button>

          <button
            onClick={() => setActiveTab('chatbot')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'chatbot' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>24/7 Sales Agent</span>
          </button>

          <button
            onClick={() => setActiveTab('proposal')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'proposal' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Instant Proposal</span>
          </button>

          <button
            onClick={() => setActiveTab('automation')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'automation' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Automations</span>
          </button>
        </div>

        {/* Simulated Interactive Display Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-8 shadow-2xl backdrop-blur-md">
          {activeTab === 'crm' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[11px] text-emerald-400 font-mono font-bold uppercase">Live Lead Qualification</span>
                  <h3 className="text-lg font-bold text-white">Rohit Sharma • Nexus Retail Tech</h3>
                  <p className="text-xs text-slate-400">Inquiry: "We need an AI Chatbot and automated CRM pipeline for 8 retail branches in Mumbai."</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-center">
                    <span className="block text-[10px] uppercase font-bold">AI Score</span>
                    <strong className="text-lg font-mono">94 / 100</strong>
                  </div>
                  <div className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400 text-center">
                    <span className="block text-[10px] uppercase font-bold">Priority</span>
                    <strong className="text-sm font-bold">High Intent</strong>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-slate-500 block text-[10px] font-bold">ESTIMATED BUDGET</span>
                  <p className="text-slate-200 font-semibold mt-0.5">₹1,50,000 – ₹2,50,000</p>
                </div>
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-slate-500 block text-[10px] font-bold">BUYING PROBABILITY</span>
                  <p className="text-emerald-400 font-semibold mt-0.5">88% (Urgent Timeline)</p>
                </div>
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-slate-500 block text-[10px] font-bold">RECOMMENDED ACTION</span>
                  <p className="text-indigo-300 font-semibold mt-0.5">Send Multi-Branch AI Proposal</p>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Recommended Pitch Reply:</span>
                </div>
                <p className="text-slate-300 italic text-[11px] leading-relaxed">
                  "Hi Rohit, our multi-tenant AI solution seamlessly unifies retail customer conversations across all 8 branches with centralized lead dispatch and real-time CRM updates. I’ve generated a tailored proposal for your review."
                </p>
              </div>
            </div>
          )}

          {activeTab === 'chatbot' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  AI
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">BharatAI Autonomous Agent</h4>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Live on Client Website • Capturing Leads 24/7
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="p-3 bg-slate-800/90 text-slate-200 rounded-2xl rounded-tl-none">
                    Hello! Welcome to Acme Agency. Looking to automate your sales pipeline or deploy an AI chatbot today?
                  </div>
                </div>

                <div className="flex items-start justify-end gap-2">
                  <div className="p-3 bg-indigo-600 text-white rounded-2xl rounded-tr-none max-w-[80%]">
                    Yes, we want an automated system to follow up on 500+ monthly leads.
                  </div>
                </div>

                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="p-3 bg-slate-800/90 text-slate-200 rounded-2xl rounded-tl-none space-y-2">
                    <p>Awesome! Our system automates SMS and email follow-ups with instant qualification. May I have your official email and phone number to send the starter plan breakdown?</p>
                    <div className="p-2 bg-slate-900 border border-slate-700/80 rounded-lg text-[11px] text-emerald-400 font-mono">
                      ✓ Lead Captured &amp; Dispatched to CRM in Real Time
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'proposal' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[11px] text-indigo-400 font-mono">DOCUMENT #PROP-2026-89</span>
                  <h3 className="text-base font-bold text-white">Automated Enterprise AI Automation Proposal</h3>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold">
                  Ready to Sign
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p><strong>Client:</strong> Horizon Tech Solutions Pvt Ltd</p>
                <p><strong>Scope:</strong> Full multi-tenant CRM deployment, 24/7 customer service AI bot, and custom workflow triggers.</p>
                
                <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between"><span>Core AI Platform (1 Year)</span><span>₹84,000</span></div>
                  <div className="flex justify-between"><span>Multi-Tenant Setup &amp; Training</span><span>₹25,000</span></div>
                  <div className="flex justify-between border-t border-slate-800 pt-1 font-bold text-white"><span>Grand Total (Incl. GST)</span><span className="text-emerald-400">₹1,28,620</span></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'automation' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">1</div>
                  <div>
                    <strong className="text-white block">Trigger: New Website Lead Captured</strong>
                    <span className="text-slate-400 text-[11px]">Fires immediately on new form submit or chat interaction</span>
                  </div>
                </div>
                <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">2</div>
                  <div>
                    <strong className="text-white block">AI Action: Auto-Score &amp; Dispatch Personalized Email</strong>
                    <span className="text-slate-400 text-[11px]">Calculates buyer intent and sends tailored solution deck in 30 seconds</span>
                  </div>
                </div>
                <span className="text-indigo-400 font-mono text-[10px] bg-indigo-500/10 px-2 py-0.5 rounded">Automated</span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">3</div>
                  <div>
                    <strong className="text-white block">Follow-up: 48-Hour Stale Reminder</strong>
                    <span className="text-slate-400 text-[11px]">If no reply, prompts assigned sales manager with suggested call talking points</span>
                  </div>
                </div>
                <span className="text-purple-400 font-mono text-[10px] bg-purple-500/10 px-2 py-0.5 rounded">Cron Managed</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <section id="roi-calculator" className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto z-10 relative">
        <div className="bg-gradient-to-tr from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Revenue Impact Calculator</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Calculate Your Lost Revenue Recovery
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              See how much revenue automated instant lead response and qualification adds to your monthly bottom line.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Monthly Inquiries / Website Leads:</span>
                  <span className="text-indigo-400 font-mono text-sm">{monthlyLeads} leads</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={monthlyLeads}
                  onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Average Deal / Order Value (₹):</span>
                  <span className="text-emerald-400 font-mono text-sm">₹{dealValue.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={dealValue}
                  onChange={(e) => setDealValue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-950/80 border border-indigo-500/30 rounded-2xl text-center space-y-3">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Estimated Monthly Revenue Added</span>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 font-mono">
                + ₹{recoveredRevenue.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-400">
                Based on an average 18% lift in lead-to-opportunity conversions through sub-minute response times.
              </p>
              <button
                onClick={onEnterDashboard}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
              >
                Claim This Revenue Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive Grid */}
      <section id="features" className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto z-10 relative">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Enterprise Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Built for Serious Business Workflows
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Everything your sales and operations team needs to automate customer interactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/70 text-indigo-400 border border-indigo-800/50 flex items-center justify-center">
              <Users2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Predictive AI CRM Pipeline</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Organize leads through customized stages (New, Qualified, Proposal Sent, Won). AI auto-scores buying readiness and recommends exact responses.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/70 text-indigo-400 border border-indigo-800/50 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">24/7 Website AI Chatbot</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deploy embeddable widgets with custom branding, knowledge base grounding, and automatic contact lead capture synchronized with your database.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/70 text-indigo-400 border border-indigo-800/50 flex items-center justify-center">
              <Workflow className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Event-Driven Workflows</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create intelligent rules for instant email notifications, automated follow-up scheduling, and external webhook integrations without writing code.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/70 text-indigo-400 border border-indigo-800/50 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Instant Proposals &amp; Quotes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Draft comprehensive sales proposals and tax-itemized quotations in under 10 seconds, fully branded and ready for client sign-off.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/70 text-indigo-400 border border-indigo-800/50 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Multi-Tenant Agency Mode</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manage dozens of client brands and branch workspaces with complete data isolation, dedicated roles, and consolidated admin monitoring.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/70 text-indigo-400 border border-indigo-800/50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Enterprise Security &amp; Audit Logs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bank-grade session management, tamper-proof activity logging, dynamic OAuth 2.0 single sign-on, and self-hosted data ownership.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto z-10 relative">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Transparent Investment</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Predictable Pricing for Growing Businesses
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            No surprise overages. Upgrade or pause your plan at any time.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-12 h-6 rounded-full bg-slate-800 p-1 relative transition-colors focus:outline-none"
            >
              <div
                className={`w-4 h-4 rounded-full bg-indigo-500 transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1 ${billingCycle === 'annual' ? 'text-white' : 'text-slate-400'}`}>
              Annual
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Starter</h3>
              <p className="text-xs text-slate-400 mt-1">Ideal for solo consultants and founders capturing first leads.</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-black text-white font-mono">
                  {billingCycle === 'annual' ? '₹1,999' : '₹2,499'}
                </span>
                <span className="text-xs text-slate-400">/month</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>5,000 AI Credits / month</span></div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>1 Business Workspace</span></div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>100 Active CRM Leads</span></div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>Website AI Chatbot Widget</span></div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>Standard Email Support</span></div>
              </div>
            </div>

            <button
              onClick={onEnterDashboard}
              className="w-full mt-8 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
            >
              Get Started Free
            </button>
          </div>

          {/* Growth Pro Plan */}
          <div className="rounded-2xl p-6 bg-gradient-to-b from-indigo-950/70 via-slate-900 to-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-600/15 flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wider shadow-md">
              Most Popular
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Growth Pro</h3>
              <p className="text-xs text-slate-400 mt-1">For scaling businesses and sales teams closing high volume.</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-black text-white font-mono">
                  {billingCycle === 'annual' ? '₹5,599' : '₹6,999'}
                </span>
                <span className="text-xs text-slate-400">/month</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span><strong>250,000 AI Credits</strong> / month</span></div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>5 Dedicated Workspaces</span></div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>Unlimited CRM Leads</span></div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>AI Proposal &amp; Quotation Generator</span></div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>Background Cron Automations</span></div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>Priority 24/7 Support</span></div>
              </div>
            </div>

            <button
              onClick={onEnterDashboard}
              className="w-full mt-8 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Enterprise Agency */}
          <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Enterprise Agency</h3>
              <p className="text-xs text-slate-400 mt-1">For digital agencies managing multiple enterprise accounts.</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-black text-white font-mono">
                  {billingCycle === 'annual' ? '₹15,199' : '₹18,999'}
                </span>
                <span className="text-xs text-slate-400">/month</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>1,000,000 AI Credits / month</span></div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>Unlimited Client Workspaces</span></div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>Agency Multi-Tenant Switcher</span></div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>Custom Branding &amp; White-labeling</span></div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>Dedicated Webhook &amp; REST API Keys</span></div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>Dedicated Technical Account Manager</span></div>
              </div>
            </div>

            <button
              onClick={onEnterDashboard}
              className="w-full mt-8 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
            >
              Contact Enterprise Sales
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 sm:py-16 px-4 sm:px-6 max-w-4xl mx-auto z-10 relative">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-slate-800 rounded-2xl bg-slate-900/60 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-4 sm:p-5 text-left font-bold text-sm text-slate-200 flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === index ? 'rotate-180 text-indigo-400' : ''}`}
                />
              </button>
              {openFaq === index && (
                <div className="px-4 sm:px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final High-Impact CTA Banner */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto z-10 relative text-center">
        <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-indigo-900/60 border border-indigo-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Automate Your Business Revenue?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-3">
            Join forward-thinking companies closing deals faster with autonomous AI chatbots, automated scoring, and instant proposals.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={onEnterDashboard}
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-sm font-extrabold shadow-xl transition-all flex items-center gap-2 active:scale-95"
            >
              <span>Launch Live Operating System</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800/80 text-center text-xs text-slate-500 z-10 relative">
        <p>© 2026 {platformTitle}. All rights reserved. Enterprise Business Automation Platform.</p>
      </footer>
    </div>
  );
};
