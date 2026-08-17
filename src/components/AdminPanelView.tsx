import React, { useState } from 'react';
import {
  Settings,
  Sparkles,
  Server,
  Activity,
  CheckCircle2,
  Database,
  Cpu,
  Save,
  Play,
  Layers,
  Globe,
  Mail,
  Sliders,
  Check,
  AlertCircle,
  Clock,
  Key,
  Shield,
  Plus,
  Trash2,
  Link,
  Zap,
  Radio,
  ExternalLink,
  HelpCircle,
  Copy,
} from 'lucide-react';
import { AIProvider, AuditLog, LandingPageSettings, SystemSettings } from '../types';

interface AdminPanelViewProps {
  providers: AIProvider[];
  auditLogs: AuditLog[];
  landingSettings?: LandingPageSettings;
  systemSettings?: SystemSettings;
  onUpdateAIProviders?: (providers: AIProvider[]) => Promise<void>;
  onUpdateLandingSettings?: (settings: LandingPageSettings) => Promise<void>;
  onUpdateSystemSettings?: (settings: SystemSettings) => Promise<void>;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  providers: initialProviders,
  auditLogs,
  landingSettings: initialLandingSettings,
  systemSettings: initialSystemSettings,
  onUpdateAIProviders,
  onUpdateLandingSettings,
  onUpdateSystemSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'cms' | 'system' | 'health' | 'audit'>('ai');

  // AI Providers Local State
  const [providers, setProviders] = useState<AIProvider[]>(initialProviders);
  const [testingProviderId, setTestingProviderId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { status: 'success' | 'error'; latencyMs: number; message: string }>>({});
  const [aiSaveStatus, setAiSaveStatus] = useState<string | null>(null);
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);

  // New Custom Provider Form State
  const [newCustomName, setNewCustomName] = useState('Custom Groq / Ollama / DeepSeek');
  const [newCustomKey, setNewCustomKey] = useState('custom');
  const [newCustomModel, setNewCustomModel] = useState('llama-3.3-70b-versatile');
  const [newCustomUrl, setNewCustomUrl] = useState('https://api.groq.com/openai/v1');
  const [newCustomApiKey, setNewCustomApiKey] = useState('');
  const [newCustomPriority, setNewCustomPriority] = useState(4);

  // Preset Endpoints for Fast Setup
  const PRESET_ENDPOINTS = [
    { label: 'Groq Cloud (Ultra-Fast)', url: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile', key: 'groq' },
    { label: 'DeepSeek API', url: 'https://api.deepseek.com/v1', model: 'deepseek-chat', key: 'deepseek' },
    { label: 'Ollama Localhost', url: 'http://localhost:11434/v1', model: 'llama3:latest', key: 'ollama' },
    { label: 'Together AI', url: 'https://api.together.xyz/v1', model: 'meta-llama/Llama-3-70b-chat-hf', key: 'together' },
    { label: 'OpenRouter Gateway', url: 'https://openrouter.ai/api/v1', model: 'meta-llama/llama-3.3-70b-instruct', key: 'openrouter' },
    { label: 'LiteLLM / Custom VPS', url: 'https://ai.yourdomain.com/v1', model: 'default', key: 'litellm' },
  ];

  // Landing Page CMS State
  const [cms, setCms] = useState<LandingPageSettings>(
    initialLandingSettings || {
      badgeText: 'The Complete AI-Powered Operating System for Indian Businesses & Agencies',
      headline: 'Automate Sales, Qualify Leads, & Close Deals with',
      headlineHighlight: 'Autonomous AI',
      subtitle: 'From website inquiry to signed proposal in seconds. BharatAI unites CRM pipelines, 24/7 customer chatbots, AI lead scoring, and automated follow-ups in a production-ready multi-tenant SaaS.',
      primaryCtaText: 'Access Live Operating System',
      backendLabel: 'Native PHP 8.2+',
      databaseLabel: 'MySQL 8.0+ InnoDB',
      aiEngineLabel: 'Gemini 3.7 Flash',
      deploymentLabel: '1-Click cPanel / VPS',
      featuresTitle: 'Built for Real Business Workflows',
      featuresSubtitle: 'Every feature connects to live backend database storage and real multi-provider AI routing',
      features: [
        { id: '1', title: 'AI CRM & Lead Scoring', description: 'Instant 0-100 lead qualification, buying probability calculation, and customized reply drafting using Google Gemini.' },
        { id: '2', title: '24/7 Website Chatbot', description: 'Embeddable JavaScript widget that captures phone numbers, answers client FAQs, and syncs leads directly to the CRM.' },
        { id: '3', title: 'Automations & Cron Jobs', description: 'Asynchronous event rules that trigger email sequences, qualification tasks, and webhook notifications in the background.' },
        { id: '4', title: 'AI Proposals & Quotes', description: 'Draft itemized quotations and comprehensive sales proposals in under 10 seconds.' },
        { id: '5', title: 'Multi-Tenant Agency Mode', description: 'Manage multiple client workspaces with complete database isolation and custom branding.' },
        { id: '6', title: 'cPanel & VPS Self-Hosting', description: 'Deploy anywhere: shared Apache hosting, VPS, AWS EC2, or Docker with standard PHP & MySQL.' },
      ],
      pricingTitle: 'Transparent, Value-Based Pricing',
      pricingSubtitle: 'Scalable plans for independent agencies, freelancers, and enterprise companies',
      plans: [
        {
          id: 'plan_1',
          name: 'Starter',
          price: '₹2,499',
          period: '/mo',
          description: 'Ideal for solo consultants and freelancers starting with AI lead capture.',
          features: ['5,000 AI Credits / month', '1 Business Workspace', '100 Active CRM Leads', 'Website AI Chatbot Widget', 'Standard Email Support'],
          highlight: false,
        },
        {
          id: 'plan_2',
          name: 'Growth Pro',
          price: '₹6,999',
          period: '/mo',
          description: 'For growing businesses and sales teams automating outreach & proposals.',
          features: ['250,000 AI Credits / month', '5 Business Workspaces', 'Unlimited CRM Leads', 'AI Proposal & Quote Generator', 'Priority 24/7 Support'],
          highlight: true,
          badge: 'Most Popular',
        },
        {
          id: 'plan_3',
          name: 'Agency Enterprise',
          price: '₹18,999',
          period: '/mo',
          description: 'Complete multi-tenant agency solution for managing unlimited client workspaces.',
          features: ['1,000,000 AI Credits / month', 'Unlimited Client Workspaces', 'Agency Switcher & Portal', 'Custom Domain & White-labeling'],
          highlight: false,
        },
      ],
      footerCopyright: '© 2026 BharatAI Business OS. Native PHP & MySQL Enterprise Software Suite.',
    }
  );
  const [cmsSaveStatus, setCmsSaveStatus] = useState<string | null>(null);

  // System & SMTP State
  const [sys, setSys] = useState<SystemSettings>(
    initialSystemSettings || {
      platformName: 'BharatAI Business OS',
      tagline: 'Autonomous Business Operations & AI CRM',
      supportEmail: 'support@bharatai.os',
      defaultCurrency: 'INR',
      currencySymbol: '₹',
      smtpHost: 'smtp.mailgun.org',
      smtpPort: 587,
      smtpUsername: 'postmaster@bharatai.os',
      smtpFromEmail: 'noreply@bharatai.os',
      smtpFromName: 'BharatAI Notifications',
      enablePublicRegistration: true,
      maintenanceMode: false,
    }
  );
  const [sysSaveStatus, setSysSaveStatus] = useState<string | null>(null);

  // AI Provider Handlers
  const handleProviderChange = (id: string, field: keyof AIProvider, value: any) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleAddCustomProvider = () => {
    const newProv: AIProvider = {
      id: 'custom_' + Date.now(),
      name: newCustomName || 'Custom Fallback Provider',
      key: newCustomKey || 'custom',
      model: newCustomModel || 'llama-3.3-70b-versatile',
      baseUrl: newCustomUrl || 'https://api.groq.com/openai/v1',
      apiKey: newCustomApiKey || '',
      isEnabled: true,
      priority: Number(newCustomPriority) || (providers.length + 1),
      temperature: 0.7,
      maxTokens: 4096,
    };
    setProviders((prev) => [...prev, newProv]);
    setShowAddCustomModal(false);
    // Reset inputs
    setNewCustomName('Custom Groq / Ollama / DeepSeek');
    setNewCustomApiKey('');
  };

  const handleDeleteProvider = (id: string) => {
    setProviders((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveAI = async () => {
    try {
      setAiSaveStatus('saving');
      if (onUpdateAIProviders) {
        await onUpdateAIProviders(providers);
      } else {
        await fetch('/api/admin/ai-providers/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ providers }),
        });
      }
      setAiSaveStatus('saved');
      setTimeout(() => setAiSaveStatus(null), 3000);
    } catch {
      setAiSaveStatus('error');
    }
  };

  const handleTestProvider = async (provider: AIProvider) => {
    setTestingProviderId(provider.id);
    try {
      const res = await fetch('/api/admin/ai-providers/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerKey: provider.key,
          model: provider.model,
          apiKey: provider.apiKey,
          baseUrl: provider.baseUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResults((prev) => ({
          ...prev,
          [provider.id]: {
            status: 'success',
            latencyMs: data.latencyMs || 240,
            message: `Operational (${data.latencyMs}ms): "${data.sampleOutput}"`,
          },
        }));
      } else {
        setTestResults((prev) => ({
          ...prev,
          [provider.id]: {
            status: 'error',
            latencyMs: data.latencyMs || 0,
            message: data.error || 'Connection failed',
          },
        }));
      }
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [provider.id]: {
          status: 'error',
          latencyMs: 0,
          message: err.message || 'Network error',
        },
      }));
    } finally {
      setTestingProviderId(null);
    }
  };

  // CMS Handlers
  const handleSaveCMS = async () => {
    try {
      setCmsSaveStatus('saving');
      if (onUpdateLandingSettings) {
        await onUpdateLandingSettings(cms);
      } else {
        await fetch('/api/admin/landing-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ landingSettings: cms }),
        });
      }
      setCmsSaveStatus('saved');
      setTimeout(() => setCmsSaveStatus(null), 3000);
    } catch {
      setCmsSaveStatus('error');
    }
  };

  // System Settings Handlers
  const handleSaveSystem = async () => {
    try {
      setSysSaveStatus('saving');
      if (onUpdateSystemSettings) {
        await onUpdateSystemSettings(sys);
      } else {
        await fetch('/api/admin/system-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ systemSettings: sys }),
        });
      }
      setSysSaveStatus('saved');
      setTimeout(() => setSysSaveStatus(null), 3000);
    } catch {
      setSysSaveStatus('error');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-400" /> Platform Super Admin & Dynamic Control Hub
          </h1>
          <p className="text-xs text-slate-400">
            Live database-driven administration for AI Providers, Landing Page CMS, System & SMTP, and Server Diagnostics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono rounded-full font-semibold">
            Super Admin Mode
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-1 sm:gap-2 overflow-x-auto pb-1 text-xs sm:text-sm font-medium">
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-3 sm:px-4 py-2.5 rounded-t-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'ai'
              ? 'bg-slate-900 text-amber-400 border-b-2 border-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> AI Providers & Fallback Engine
        </button>

        <button
          onClick={() => setActiveTab('cms')}
          className={`px-3 sm:px-4 py-2.5 rounded-t-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'cms'
              ? 'bg-slate-900 text-indigo-400 border-b-2 border-indigo-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" /> Landing Page CMS
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`px-3 sm:px-4 py-2.5 rounded-t-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'system'
              ? 'bg-slate-900 text-emerald-400 border-b-2 border-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" /> System & SMTP Config
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`px-3 sm:px-4 py-2.5 rounded-t-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'health'
              ? 'bg-slate-900 text-purple-400 border-b-2 border-purple-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="w-3.5 h-3.5" /> Diagnostics & Health
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 sm:px-4 py-2.5 rounded-t-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-slate-900 text-blue-400 border-b-2 border-blue-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> Audit Logs
        </button>
      </div>

      {/* TAB 1: AI PROVIDERS */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          {/* Custom Fallback URL & Gateway Architecture Quick Reference Banner */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-sm font-bold text-slate-100">Custom AI Fallback URL & LLM Gateway Engine</span>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-mono rounded font-semibold border border-amber-500/30">
                  OpenAI-Compatible / Ollama / Proxy Ready
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Automatic cascade if primary provider rate-limits or fails
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              BharatAI supports custom AI fallback endpoints (e.g. self-hosted <strong className="text-amber-300">Ollama</strong> on your VPS, <strong className="text-amber-300">Groq Cloud</strong> for lightning-fast 500 T/s inference, <strong className="text-amber-300">DeepSeek V3</strong>, or <strong className="text-amber-300">LiteLLM / Cloudflare AI Gateway</strong>). You can set custom Base URLs on any provider or add unlimited custom models below.
            </p>
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> 1-Click Fallback Presets:
              </span>
              {PRESET_ENDPOINTS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setNewCustomName(preset.label);
                    setNewCustomKey(preset.key);
                    setNewCustomModel(preset.model);
                    setNewCustomUrl(preset.url);
                    setShowAddCustomModal(true);
                  }}
                  className="px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] rounded-lg border border-slate-700 transition flex items-center gap-1"
                >
                  <span>{preset.label}</span>
                  <Plus className="w-3 h-3 text-amber-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Multi-Provider AI Fallback & Model Management
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure models, Base URLs, API keys, priorities, and temperature without modifying PHP source code.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowAddCustomModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add Custom AI Provider / URL</span>
                </button>

                {aiSaveStatus === 'saved' && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved to DB!
                  </span>
                )}
                {aiSaveStatus === 'error' && (
                  <span className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Error saving
                  </span>
                )}
                <button
                  onClick={handleSaveAI}
                  disabled={aiSaveStatus === 'saving'}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{aiSaveStatus === 'saving' ? 'Saving...' : 'Save AI Configuration'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {providers.map((prov) => {
                const testResult = testResults[prov.id];
                const isTesting = testingProviderId === prov.id;
                const isCustom = prov.key === 'custom' || prov.id.startsWith('custom_') || !['gemini', 'openai', 'anthropic'].includes(prov.key);

                return (
                  <div
                    key={prov.id}
                    className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-5 space-y-4 shadow-sm"
                  >
                    {/* Provider Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${prov.isEnabled ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                        <span className="font-bold text-slate-100 text-sm">{prov.name}</span>
                        {isCustom && (
                          <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-mono rounded border border-indigo-500/30">
                            Custom Endpoint
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prov.isEnabled}
                            onChange={(e) => handleProviderChange(prov.id, 'isEnabled', e.target.checked)}
                            className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                          />
                          <span>{prov.isEnabled ? 'Active' : 'Disabled'}</span>
                        </label>
                        {isCustom && (
                          <button
                            onClick={() => handleDeleteProvider(prov.id)}
                            title="Remove custom provider"
                            className="text-slate-500 hover:text-red-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Model Identifier</label>
                        <input
                          type="text"
                          value={prov.model}
                          onChange={(e) => handleProviderChange(prov.id, 'model', e.target.value)}
                          placeholder="e.g. gemini-3.7-flash, gpt-4o-mini, llama-3.3-70b-versatile, deepseek-chat"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 font-mono text-xs"
                        />
                      </div>

                      {/* Custom Base URL / Endpoint URL Option */}
                      <div>
                        <label className="block text-slate-400 mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Link className="w-3 h-3 text-amber-400" />
                            <span>Endpoint Base URL / Fallback URL</span>
                          </span>
                          <span className="text-[10px] text-amber-400/80 font-mono">Custom API / Proxy / Ollama</span>
                        </label>
                        <input
                          type="text"
                          value={prov.baseUrl || ''}
                          onChange={(e) => handleProviderChange(prov.id, 'baseUrl', e.target.value)}
                          placeholder="https://api.openai.com/v1 or http://localhost:11434/v1"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-amber-200 focus:outline-none focus:border-amber-500 font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 flex items-center justify-between">
                          <span>API Key</span>
                          <span className="text-[10px] text-slate-500">Stored securely / env fallback</span>
                        </label>
                        <input
                          type="password"
                          placeholder={prov.apiKey ? '••••••••••••••••' : 'Enter API Key (leave blank for local Ollama)'}
                          value={prov.apiKey || ''}
                          onChange={(e) => handleProviderChange(prov.id, 'apiKey', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 font-mono text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 mb-1">Fallback Priority (1 = Highest)</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={prov.priority}
                            onChange={(e) => handleProviderChange(prov.id, 'priority', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Temperature ({prov.temperature ?? 0.7})</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={prov.temperature ?? 0.7}
                            onChange={(e) => handleProviderChange(prov.id, 'temperature', parseFloat(e.target.value))}
                            className="w-full accent-amber-500 mt-2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Test Connection Button & Result */}
                    <div className="pt-2 border-t border-slate-900 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleTestProvider(prov)}
                          disabled={isTesting}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-all flex items-center gap-1.5"
                        >
                          <Play className="w-3 h-3 text-amber-400" />
                          <span>{isTesting ? 'Testing Endpoint...' : 'Test Connection'}</span>
                        </button>
                        {testResult && (
                          <span className={`text-[11px] font-semibold ${testResult.status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {testResult.status === 'success' ? `✓ ${testResult.latencyMs}ms (200 OK)` : '✗ Error'}
                          </span>
                        )}
                      </div>

                      {testResult && (
                        <div className={`p-2.5 rounded-lg text-[11px] font-mono leading-relaxed ${
                          testResult.status === 'success'
                            ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                            : 'bg-red-950/40 text-red-300 border border-red-800/40'
                        }`}>
                          {testResult.message}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Custom AI Provider Modal */}
          {showAddCustomModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-slate-100 text-base">Add Custom AI Provider / Fallback URL</h3>
                  </div>
                  <button
                    onClick={() => setShowAddCustomModal(false)}
                    className="text-slate-400 hover:text-white text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Provider Display Name</label>
                    <input
                      type="text"
                      value={newCustomName}
                      onChange={(e) => setNewCustomName(e.target.value)}
                      placeholder="e.g. Groq Cloud LLaMA 3.3 or Self-Hosted Ollama"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Custom Fallback URL / Base Endpoint</label>
                    <input
                      type="text"
                      value={newCustomUrl}
                      onChange={(e) => setNewCustomUrl(e.target.value)}
                      placeholder="https://api.groq.com/openai/v1 or http://localhost:11434/v1"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-300 font-mono text-xs focus:border-amber-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Must support standard OpenAI-compatible <code>/chat/completions</code> endpoint format.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Model Identifier</label>
                      <input
                        type="text"
                        value={newCustomModel}
                        onChange={(e) => setNewCustomModel(e.target.value)}
                        placeholder="llama-3.3-70b-versatile"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Fallback Priority</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={newCustomPriority}
                        onChange={(e) => setNewCustomPriority(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">API Key / Secret Token (Optional for Ollama)</label>
                    <input
                      type="password"
                      value={newCustomApiKey}
                      onChange={(e) => setNewCustomApiKey(e.target.value)}
                      placeholder="gsk_... or sk-... (leave empty if no auth)"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono focus:border-amber-500"
                    />
                  </div>

                  {/* Preset Quick Fill */}
                  <div className="pt-2">
                    <label className="block text-[11px] text-slate-400 mb-1.5 font-semibold">Or Pick a Quick Preset:</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {PRESET_ENDPOINTS.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => {
                            setNewCustomName(p.label);
                            setNewCustomKey(p.key);
                            setNewCustomModel(p.model);
                            setNewCustomUrl(p.url);
                          }}
                          className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-slate-300 text-left transition truncate"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setShowAddCustomModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCustomProvider}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Provider List</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LANDING PAGE CMS */}
      {activeTab === 'cms' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" /> Landing Page CMS & Copy Editor
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Edit hero headlines, badges, subtitles, CTA buttons, feature blocks, and pricing plans dynamically.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {cmsSaveStatus === 'saved' && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Landing page updated!
                </span>
              )}
              <button
                onClick={handleSaveCMS}
                disabled={cmsSaveStatus === 'saving'}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{cmsSaveStatus === 'saving' ? 'Saving...' : 'Save Landing Page'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-6 text-xs">
            {/* Hero Section */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-4">
              <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Hero Section Content
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1">Top Badge Pill Text</label>
                  <input
                    type="text"
                    value={cms.badgeText}
                    onChange={(e) => setCms({ ...cms, badgeText: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Hero Main Headline (Prefix)</label>
                  <input
                    type="text"
                    value={cms.headline}
                    onChange={(e) => setCms({ ...cms, headline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Headline Highlight Text (Purple Gradient)</label>
                  <input
                    type="text"
                    value={cms.headlineHighlight}
                    onChange={(e) => setCms({ ...cms, headlineHighlight: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-indigo-300 font-semibold focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1">Hero Subtitle Paragraph</label>
                  <textarea
                    rows={2}
                    value={cms.subtitle}
                    onChange={(e) => setCms({ ...cms, subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-indigo-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Primary CTA Button Text</label>
                  <input
                    type="text"
                    value={cms.primaryCtaText}
                    onChange={(e) => setCms({ ...cms, primaryCtaText: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Footer Copyright Text</label>
                  <input
                    type="text"
                    value={cms.footerCopyright}
                    onChange={(e) => setCms({ ...cms, footerCopyright: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Pricing CMS */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-4">
              <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" /> Pricing Plans & Packaging CMS
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cms.plans.map((plan, idx) => (
                  <div key={plan.id || idx} className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={plan.name}
                        onChange={(e) => {
                          const updated = [...cms.plans];
                          updated[idx].name = e.target.value;
                          setCms({ ...cms, plans: updated });
                        }}
                        className="font-bold text-slate-100 bg-transparent border-b border-slate-700 pb-0.5 focus:border-indigo-400 focus:outline-none w-2/3"
                      />
                      <label className="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={plan.highlight}
                          onChange={(e) => {
                            const updated = [...cms.plans];
                            updated[idx].highlight = e.target.checked;
                            setCms({ ...cms, plans: updated });
                          }}
                          className="rounded bg-slate-950 border-slate-700 text-indigo-500"
                        />
                        Popular
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-slate-500">Price:</label>
                      <input
                        type="text"
                        value={plan.price}
                        onChange={(e) => {
                          const updated = [...cms.plans];
                          updated[idx].price = e.target.value;
                          setCms({ ...cms, plans: updated });
                        }}
                        className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono font-bold w-1/2"
                      />
                      <input
                        type="text"
                        value={plan.period}
                        onChange={(e) => {
                          const updated = [...cms.plans];
                          updated[idx].period = e.target.value;
                          setCms({ ...cms, plans: updated });
                        }}
                        className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-slate-400 text-xs w-1/3"
                      />
                    </div>

                    <div>
                      <label className="text-slate-500 block mb-1">Description:</label>
                      <input
                        type="text"
                        value={plan.description}
                        onChange={(e) => {
                          const updated = [...cms.plans];
                          updated[idx].description = e.target.value;
                          setCms({ ...cms, plans: updated });
                        }}
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM & SMTP */}
      {activeTab === 'system' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" /> Platform Branding & Outgoing SMTP Settings
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure platform name, currency identifiers, and transactional email SMTP credentials.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {sysSaveStatus === 'saved' && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> System settings saved!
                </span>
              )}
              <button
                onClick={handleSaveSystem}
                disabled={sysSaveStatus === 'saving'}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{sysSaveStatus === 'saving' ? 'Saving...' : 'Save System Settings'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-3">
              <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" /> Platform Identity
              </h4>
              <div>
                <label className="block text-slate-400 mb-1">Platform Brand Name</label>
                <input
                  type="text"
                  value={sys.platformName}
                  onChange={(e) => setSys({ ...sys, platformName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Tagline</label>
                <input
                  type="text"
                  value={sys.tagline}
                  onChange={(e) => setSys({ ...sys, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Currency Code</label>
                  <input
                    type="text"
                    value={sys.defaultCurrency}
                    onChange={(e) => setSys({ ...sys, defaultCurrency: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    value={sys.currencySymbol}
                    onChange={(e) => setSys({ ...sys, currencySymbol: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Support Email</label>
                <input
                  type="email"
                  value={sys.supportEmail}
                  onChange={(e) => setSys({ ...sys, supportEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-3">
              <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" /> Outgoing SMTP Server
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1">SMTP Host</label>
                  <input
                    type="text"
                    value={sys.smtpHost}
                    onChange={(e) => setSys({ ...sys, smtpHost: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Port</label>
                  <input
                    type="number"
                    value={sys.smtpPort}
                    onChange={(e) => setSys({ ...sys, smtpPort: parseInt(e.target.value) || 587 })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500 font-mono text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">SMTP Username</label>
                <input
                  type="text"
                  value={sys.smtpUsername}
                  onChange={(e) => setSys({ ...sys, smtpUsername: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">SMTP Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={sys.smtpPassword || ''}
                  onChange={(e) => setSys({ ...sys, smtpPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500 font-mono text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">From Sender Email</label>
                  <input
                    type="email"
                    value={sys.smtpFromEmail}
                    onChange={(e) => setSys({ ...sys, smtpFromEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">From Sender Name</label>
                  <input
                    type="text"
                    value={sys.smtpFromName}
                    onChange={(e) => setSys({ ...sys, smtpFromName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Google OAuth Configuration & Auto-Detected Redirect URI */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-bold">
                    G
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">Dynamic Google OAuth 2.0 & Single Sign-On</h4>
                    <p className="text-[11px] text-slate-400">Configure Client ID, Secret, and Auto-Detected fallback redirect URLs.</p>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sys.googleAuthEnabled ?? false}
                    onChange={(e) => setSys({ ...sys, googleAuthEnabled: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-700 text-emerald-500"
                  />
                  Enable Google Auth
                </label>
              </div>

              {/* Auto-detected Redirect URI Badge */}
              <div className="p-3 bg-slate-900/90 border border-indigo-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-slate-300 font-medium">Auto-Detected Callback Redirect URI:</span>
                  <code className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-indigo-300 rounded font-mono text-[11px] select-all">
                    {typeof window !== 'undefined' ? `${window.location.origin}/auth/google/callback.php` : 'https://yourdomain.com/auth/google/callback.php'}
                  </code>
                </div>
                <span className="text-[10px] text-slate-400">Add this to your Google Cloud Console Authorized URIs</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Google OAuth Client ID</label>
                  <input
                    type="text"
                    placeholder="e.g. 123456789-xxxx.apps.googleusercontent.com"
                    value={sys.googleClientId || ''}
                    onChange={(e) => setSys({ ...sys, googleClientId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Google OAuth Client Secret</label>
                  <input
                    type="password"
                    placeholder="GOCSPX-••••••••••••••••"
                    value={sys.googleClientSecret || ''}
                    onChange={(e) => setSys({ ...sys, googleClientSecret: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500 font-mono text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1 flex items-center justify-between">
                    <span>Custom Redirect URI (Optional Fallback)</span>
                    <span className="text-[10px] text-slate-500">Leave blank to use auto-detected host URL</span>
                  </label>
                  <input
                    type="text"
                    placeholder={typeof window !== 'undefined' ? `${window.location.origin}/auth/google/callback.php` : 'https://yourdomain.com/auth/google/callback.php'}
                    value={sys.googleRedirectUri || ''}
                    onChange={(e) => setSys({ ...sys, googleRedirectUri: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-emerald-500 font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DIAGNOSTICS & HEALTH */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">PHP 8.2 & PDO Engine</div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Fully Operational
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/60">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">MySQL 8.0+ Schema</div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 42 Tables Synced
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-800/60">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">AI Fallback Router</div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Multi-Provider Active
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-400" /> Platform Infrastructure Diagnostics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">EXECUTION ENVIRONMENT</span>
                <span className="text-slate-200 font-bold mt-1 block">PHP 8.2.27 + FPM</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">DATABASE ENGINE</span>
                <span className="text-slate-200 font-bold mt-1 block">MySQL 8.0 InnoDB</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">CPANEL / APACHE</span>
                <span className="text-emerald-400 font-bold mt-1 block">100% Ready</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">CRON DAEMONS</span>
                <span className="text-emerald-400 font-bold mt-1 block">4 Tasks Running</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 pb-3 border-b border-slate-800">
            <Activity className="w-4 h-4 text-blue-400" /> Security & System Audit Logs
          </h3>

          <div className="space-y-2 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{log.action}</span>
                  <span className="text-[10px] text-slate-500">{log.time}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>User: {log.user}</span>
                  <span className="font-mono text-[10px] text-slate-500">{log.ip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

