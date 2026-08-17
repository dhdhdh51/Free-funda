import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { LeadsCRMView } from './components/LeadsCRMView';
import { AIAssistantView } from './components/AIAssistantView';
import { ChatbotBuilderView } from './components/ChatbotBuilderView';
import { ProposalsView } from './components/ProposalsView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { AutomationsView } from './components/AutomationsView';
import { MarketingSuiteView } from './components/MarketingSuiteView';
import { AdminPanelView } from './components/AdminPanelView';
import { SourceCodeExplorerView } from './components/SourceCodeExplorerView';
import { MarketingLandingPage } from './components/MarketingLandingPage';
import { Business, Lead, Proposal, KnowledgeSource, AutomationRule, AIProvider, AuditLog, LandingPageSettings, SystemSettings } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [showLanding, setShowLanding] = useState<boolean>(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('biz_1');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>([]);
  const [automations, setAutomations] = useState<AutomationRule[]>([]);
  const [aiProviders, setAiProviders] = useState<AIProvider[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [landingSettings, setLandingSettings] = useState<LandingPageSettings | undefined>(undefined);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | undefined>(undefined);

  const [isQualifying, setIsQualifying] = useState<boolean>(false);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState<boolean>(false);
  const [isRunningCron, setIsRunningCron] = useState<boolean>(false);
  const [cronLogs, setCronLogs] = useState<string[]>([]);
  const [showNewBizModal, setShowNewBizModal] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // New Business Form State
  const [newBizName, setNewBizName] = useState('');
  const [newBizType, setNewBizType] = useState('Digital Agency & Tech');
  const [newBizIndustry, setNewBizIndustry] = useState('Software & Automation');
  const [newBizPhone, setNewBizPhone] = useState('+91 98765 00000');
  const [newBizEmail, setNewBizEmail] = useState('');

  // Fetch initial state from server
  const fetchState = () => {
    fetch('/api/state')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          setBusinesses(d.businesses || []);
          setCurrentBusinessId(d.currentBusinessId || 'biz_1');
          setLeads(d.leads || []);
          setProposals(d.proposals || []);
          setKnowledgeSources(d.knowledgeSources || []);
          setAutomations(d.automations || []);
          setAiProviders(d.aiProviders || []);
          setAuditLogs(d.auditLogs || []);
          if (d.landingSettings) setLandingSettings(d.landingSettings);
          if (d.systemSettings) setSystemSettings(d.systemSettings);
        }
      })
      .catch((err) => console.error('Failed to load server state:', err));
  };

  useEffect(() => {
    fetchState();
  }, []);


  const currentBusiness =
    businesses.find((b) => b.id === currentBusinessId) ||
    businesses[0] || {
      id: 'biz_1',
      name: 'Acme Digital Agency',
      slug: 'acme-digital',
      businessType: 'Agency',
      industry: 'IT & Digital Services',
      website: 'https://acmedigital.in',
      phone: '+91 98765 43210',
      email: 'contact@acmedigital.in',
      currency: 'INR',
      currencySymbol: '₹',
      timezone: 'Asia/Kolkata',
      about: 'AI-powered business marketing and automation services.',
      usp: 'Guaranteed 3x lead growth with customized AI workflows.',
      plan: 'Growth Pro',
      creditsUsed: 42800,
      creditsLimit: 250000,
    };

  const businessLeads = leads.filter((l) => l.businessId === currentBusiness.id);
  const businessProposals = proposals.filter((p) => p.businessId === currentBusiness.id);
  const businessKnowledge = knowledgeSources.filter((k) => k.businessId === currentBusiness.id);
  const businessAutomations = automations.filter((a) => a.businessId === currentBusiness.id);

  // Switch Business Handler
  const handleSwitchBusiness = async (bizId: string) => {
    try {
      const res = await fetch('/api/business/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: bizId }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentBusinessId(bizId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Lead
  const handleAddLead = async (leadData: Partial<Lead>) => {
    try {
      const res = await fetch('/api/leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      const data = await res.json();
      if (data.success && data.lead) {
        setLeads((prev) => [data.lead, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Status
  const handleUpdateStatus = async (leadId: string, status: string) => {
    try {
      const res = await fetch('/api/leads/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, status }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status } : l))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AI Qualify Lead
  const handleQualifyLead = async (leadId: string) => {
    setIsQualifying(true);
    try {
      const res = await fetch('/api/ai/qualify-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      if (data.success && data.qualification) {
        const q = data.qualification;
        setLeads((prev) =>
          prev.map((l) =>
            l.id === leadId
              ? {
                  ...l,
                  aiScore: q.score || 88,
                  aiIntent: q.intent || 'High',
                  aiBuyingProbability: q.buying_probability || '85%',
                  aiRecommendedAction: q.recommended_action || '',
                  aiSuggestedResponse: q.suggested_response || '',
                  status: 'Qualified',
                }
              : l
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsQualifying(false);
    }
  };

  // Generate Proposal
  const handleGenerateProposal = async (cName: string, req: string, bud: string) => {
    setIsGeneratingProposal(true);
    try {
      const res = await fetch('/api/ai/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: cName,
          requirement: req,
          budget: bud,
        }),
      });
      const data = await res.json();
      if (data.success && data.proposal) {
        setProposals((prev) => [data.proposal, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  // Add Knowledge Source
  const handleAddKnowledge = async (title: string, type: 'manual_text' | 'faq' | 'url', content: string) => {
    try {
      const res = await fetch('/api/knowledge/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, content }),
      });
      const data = await res.json();
      if (data.success && data.source) {
        setKnowledgeSources((prev) => [data.source, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger Cron
  const handleTriggerCron = async () => {
    setIsRunningCron(true);
    try {
      const res = await fetch('/api/cron/run', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setCronLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] CRON SUCCESS: Processed ${data.run.processedRules} active automation rules in ${data.run.executionTimeMs}ms`,
          ...prev,
        ]);
      }
    } catch (err: any) {
      setCronLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] CRON ERROR: ${err.message}`,
        ...prev,
      ]);
    } finally {
      setIsRunningCron(false);
    }
  };

  // Create Business
  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName) return;
    try {
      const res = await fetch('/api/business/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBizName,
          businessType: newBizType,
          industry: newBizIndustry,
          phone: newBizPhone,
          email: newBizEmail,
        }),
      });
      const data = await res.json();
      if (data.success && data.business) {
        setBusinesses((prev) => [...prev, data.business]);
        setCurrentBusinessId(data.business.id);
        setShowNewBizModal(false);
        setNewBizName('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update AI Providers
  const handleUpdateAIProviders = async (updatedProviders: AIProvider[]) => {
    const res = await fetch('/api/admin/ai-providers/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ providers: updatedProviders }),
    });
    const data = await res.json();
    if (data.success) {
      setAiProviders(updatedProviders);
    }
  };

  // Update Landing Page Settings
  const handleUpdateLandingSettings = async (settings: LandingPageSettings) => {
    const res = await fetch('/api/admin/landing-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ landingSettings: settings }),
    });
    const data = await res.json();
    if (data.success) {
      setLandingSettings(settings);
    }
  };

  // Update System Settings
  const handleUpdateSystemSettings = async (settings: SystemSettings) => {
    const res = await fetch('/api/admin/system-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemSettings: settings }),
    });
    const data = await res.json();
    if (data.success) {
      setSystemSettings(settings);
    }
  };

  if (showLanding) {
    return (
      <MarketingLandingPage
        onEnterDashboard={() => setShowLanding(false)}
        landingSettings={landingSettings}
        systemSettings={systemSettings}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentBusiness={currentBusiness}
        businesses={businesses}
        onSwitchBusiness={handleSwitchBusiness}
        onOpenNewBusiness={() => setShowNewBizModal(true)}
        onOpenQuickAction={() => setCurrentView('crm')}
        onNavigate={(view) => setCurrentView(view)}
        onShowLanding={() => setShowLanding(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
      />

      <div className="flex flex-1">
        {/* Responsive Sidebar & Mobile Slide-out Drawer */}
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          leadCount={businessLeads.length}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {currentView === 'dashboard' && (
            <DashboardView
              business={currentBusiness}
              leads={businessLeads}
              proposals={businessProposals}
              onNavigate={(v) => setCurrentView(v)}
              onOpenNewLead={() => setCurrentView('crm')}
              onOpenQuickAI={() => setCurrentView('assistant')}
            />
          )}

          {currentView === 'crm' && (
            <LeadsCRMView
              business={currentBusiness}
              leads={businessLeads}
              onAddLead={handleAddLead}
              onUpdateStatus={handleUpdateStatus}
              onQualifyLead={handleQualifyLead}
              isQualifying={isQualifying}
            />
          )}

          {currentView === 'assistant' && <AIAssistantView business={currentBusiness} />}

          {currentView === 'qualifier' && (
            <LeadsCRMView
              business={currentBusiness}
              leads={businessLeads}
              onAddLead={handleAddLead}
              onUpdateStatus={handleUpdateStatus}
              onQualifyLead={handleQualifyLead}
              isQualifying={isQualifying}
            />
          )}

          {currentView === 'chatbot' && <ChatbotBuilderView business={currentBusiness} />}

          {currentView === 'proposals' && (
            <ProposalsView
              business={currentBusiness}
              proposals={businessProposals}
              onGenerateProposal={handleGenerateProposal}
              isGenerating={isGeneratingProposal}
            />
          )}

          {currentView === 'knowledge' && (
            <KnowledgeBaseView
              business={currentBusiness}
              sources={businessKnowledge}
              onAddSource={handleAddKnowledge}
            />
          )}

          {currentView === 'automations' && (
            <AutomationsView
              business={currentBusiness}
              automations={businessAutomations}
              onTriggerCron={handleTriggerCron}
              isRunningCron={isRunningCron}
              cronLogs={cronLogs}
            />
          )}

          {currentView === 'marketing' && <MarketingSuiteView business={currentBusiness} />}

          {currentView === 'admin' && (
            <AdminPanelView
              providers={aiProviders}
              auditLogs={auditLogs}
              landingSettings={landingSettings}
              systemSettings={systemSettings}
              onUpdateAIProviders={handleUpdateAIProviders}
              onUpdateLandingSettings={handleUpdateLandingSettings}
              onUpdateSystemSettings={handleUpdateSystemSettings}
            />
          )}

          {currentView === 'source-code' && <SourceCodeExplorerView />}
        </main>
      </div>


      {/* Add New Business / Tenant Modal */}
      {showNewBizModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Business / Client Workspace</h3>
            <form onSubmit={handleCreateBusiness} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Business / Company Name *</label>
                <input
                  type="text"
                  required
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  placeholder="e.g. Pune Healthcare Systems"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Industry</label>
                <input
                  type="text"
                  value={newBizIndustry}
                  onChange={(e) => setNewBizIndustry(e.target.value)}
                  placeholder="e.g. Healthcare & Clinics"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={newBizEmail}
                    onChange={(e) => setNewBizEmail(e.target.value)}
                    placeholder="contact@punehealth.in"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newBizPhone}
                    onChange={(e) => setNewBizPhone(e.target.value)}
                    placeholder="+91 98765 11223"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewBizModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
