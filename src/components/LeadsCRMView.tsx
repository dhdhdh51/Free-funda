import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Sparkles,
  Phone,
  Mail,
  Building,
  MapPin,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Loader2,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  List
} from 'lucide-react';
import { Business, Lead } from '../types';

interface LeadsCRMViewProps {
  business: Business;
  leads: Lead[];
  onAddLead: (leadData: Partial<Lead>) => void;
  onUpdateStatus: (leadId: string, status: string) => void;
  onQualifyLead: (leadId: string) => Promise<void>;
  isQualifying: boolean;
}

export const LeadsCRMView: React.FC<LeadsCRMViewProps> = ({
  business,
  leads,
  onAddLead,
  onUpdateStatus,
  onQualifyLead,
  isQualifying,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] || null);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Lead Form State
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newReq, setNewReq] = useState('');
  const [newBudget, setNewBudget] = useState('₹50,000');
  const [newVal, setNewVal] = useState('50000');
  const [newLoc, setNewLoc] = useState('Mumbai, India');

  const filteredLeads = leads.filter((lead) => {
    const matchSearch =
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'ALL' || lead.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const statuses = ['New Inquiry', 'Contacted', 'Qualified', 'Proposal Sent', 'Won'];

  const handleCopyDraft = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName) return;
    onAddLead({
      firstName: newFirstName,
      lastName: newLastName,
      email: newEmail,
      phone: newPhone,
      companyName: newCompany,
      requirement: newReq,
      budget: newBudget,
      estimatedValue: Number(newVal) || 25000,
      location: newLoc,
      status: 'New Inquiry',
    });
    setShowAddModal(false);
    // Reset
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewPhone('');
    setNewCompany('');
    setNewReq('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" /> CRM Lead Pipeline
          </h1>
          <p className="text-xs text-slate-400">
            Multi-stage sales pipeline with real-time Gemini AI qualification and automated scoring
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Kanban View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search leads by name, company, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Pipeline Stages</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Pipeline + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Kanban or Table */}
        <div className="lg:col-span-2">
          {viewMode === 'kanban' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {statuses.map((status) => {
                const stageLeads = filteredLeads.filter((l) => l.status === status);
                return (
                  <div
                    key={status}
                    className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col min-h-[300px]"
                  >
                    <div className="flex items-center justify-between mb-3 px-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                        <span className="font-semibold text-slate-200 text-xs">{status}</span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        {stageLeads.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 flex-1">
                      {stageLeads.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            selectedLead?.id === lead.id
                              ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
                              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-semibold text-xs text-slate-100">
                              {lead.firstName} {lead.lastName}
                            </div>
                            {lead.aiScore ? (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" /> {lead.aiScore}
                              </span>
                            ) : (
                              <span className="text-[9px] text-slate-500">Unscored</span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                            <Building className="w-3 h-3 text-slate-500" /> {lead.companyName}
                          </div>

                          <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                            {lead.requirement}
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                            <span>{business.currencySymbol}{lead.estimatedValue.toLocaleString()}</span>
                            <span>{lead.location}</span>
                          </div>
                        </div>
                      ))}

                      {stageLeads.length === 0 && (
                        <div className="h-24 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-600 text-xs">
                          No leads in stage
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Lead / Company</th>
                    <th className="p-3">Requirement</th>
                    <th className="p-3">Estimated Value</th>
                    <th className="p-3">AI Score</th>
                    <th className="p-3">Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`hover:bg-slate-800/60 cursor-pointer transition-colors ${
                        selectedLead?.id === lead.id ? 'bg-indigo-950/30' : ''
                      }`}
                    >
                      <td className="p-3">
                        <div className="font-semibold text-slate-100">{lead.firstName} {lead.lastName}</div>
                        <div className="text-[11px] text-slate-400">{lead.companyName}</div>
                      </td>
                      <td className="p-3 max-w-[200px] truncate text-slate-400">
                        {lead.requirement}
                      </td>
                      <td className="p-3 font-mono font-medium text-slate-200">
                        {business.currencySymbol}{lead.estimatedValue.toLocaleString()}
                      </td>
                      <td className="p-3">
                        {lead.aiScore ? (
                          <span className="font-bold text-emerald-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> {lead.aiScore}/100
                          </span>
                        ) : (
                          <span className="text-slate-500">Pending</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right 1 Col: AI Lead Intelligence & Details Drawer */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 space-y-5">
          {selectedLead ? (
            <>
              <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    {selectedLead.firstName} {selectedLead.lastName}
                  </h3>
                  <div className="text-xs text-indigo-400 font-medium">{selectedLead.companyName}</div>
                </div>

                <select
                  value={selectedLead.status}
                  onChange={(e) => onUpdateStatus(selectedLead.id, e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-1 focus:outline-none focus:border-indigo-500"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* AI Lead Qualification Card */}
              <div className="bg-gradient-to-br from-indigo-950/50 to-slate-950 border border-indigo-900/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                    <Sparkles className="w-4 h-4 text-indigo-400" /> AI Lead Intelligence
                  </div>

                  <button
                    onClick={() => onQualifyLead(selectedLead.id)}
                    disabled={isQualifying}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[11px] font-semibold flex items-center gap-1 shadow transition-all"
                  >
                    {isQualifying ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" /> Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" /> Qualify with AI
                      </>
                    )}
                  </button>
                </div>

                {selectedLead.aiScore ? (
                  <div className="space-y-2.5 text-xs">
                    <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      <div>
                        <div className="text-[10px] text-slate-400">Quality Score</div>
                        <div className="text-sm font-bold text-emerald-400 font-mono">
                          {selectedLead.aiScore}/100
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Buying Intent</div>
                        <div className="text-sm font-bold text-indigo-300">
                          {selectedLead.aiIntent || 'High'} ({selectedLead.aiBuyingProbability || '85%'})
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold text-slate-300 mb-1">
                        Recommended Next Action:
                      </div>
                      <p className="text-slate-400 text-xs bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                        {selectedLead.aiRecommendedAction}
                      </p>
                    </div>

                    {selectedLead.aiSuggestedResponse && (
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1">
                          <span>AI Suggested Response Draft:</span>
                          <button
                            onClick={() => handleCopyDraft(selectedLead.aiSuggestedResponse || '')}
                            className="text-indigo-400 hover:text-indigo-300 text-[10px] flex items-center gap-1"
                          >
                            {copiedDraft ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            {copiedDraft ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <div className="text-slate-400 text-[11px] bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/90 whitespace-pre-wrap">
                          {selectedLead.aiSuggestedResponse}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-slate-400 mb-2">
                      Run real-time Gemini AI analysis to evaluate buying intent, score priority, and draft customized follow-up emails.
                    </p>
                  </div>
                )}
              </div>

              {/* Lead Information Info List */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedLead.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedLead.phone || 'No phone provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedLead.location || 'India'}</span>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 text-[11px] block mb-1">Requirement:</span>
                  <p className="text-slate-200 text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    {selectedLead.requirement}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select a lead from the pipeline to view details and AI insights.
            </div>
          )}
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New CRM Lead</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    placeholder="e.g. Suresh"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    placeholder="e.g. Patil"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Patil Logistics"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Estimated Value ({business.currencySymbol})</label>
                  <input
                    type="number"
                    value={newVal}
                    onChange={(e) => setNewVal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="suresh@patillogistics.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Requirement Details</label>
                <textarea
                  rows={3}
                  value={newReq}
                  onChange={(e) => setNewReq(e.target.value)}
                  placeholder="Describe the lead inquiry or service required..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Save Lead to CRM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
