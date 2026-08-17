import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Plus,
  Printer,
  Download,
  CheckCircle,
  Clock,
  Send,
  Loader2,
  DollarSign,
  Building,
  Calendar
} from 'lucide-react';
import { Business, Proposal } from '../types';

interface ProposalsViewProps {
  business: Business;
  proposals: Proposal[];
  onGenerateProposal: (clientName: string, req: string, budget: string) => Promise<void>;
  isGenerating: boolean;
}

export const ProposalsView: React.FC<ProposalsViewProps> = ({
  business,
  proposals,
  onGenerateProposal,
  isGenerating,
}) => {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(proposals[0] || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [requirement, setRequirement] = useState('');
  const [budget, setBudget] = useState('₹1,25,000');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !requirement) return;
    await onGenerateProposal(clientName, requirement, budget);
    setShowCreateModal(false);
    setClientName('');
    setRequirement('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" /> Proposals & Quotations
          </h1>
          <p className="text-xs text-slate-400">
            Generate customized commercial proposals, scopes, deliverables and itemized pricing in seconds
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" /> Generate Proposal with AI
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Proposals List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Generated Client Proposals ({proposals.length})
          </div>

          <div className="space-y-2.5">
            {proposals.map((prop) => (
              <div
                key={prop.id}
                onClick={() => setSelectedProposal(prop)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedProposal?.id === prop.id
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-100 text-xs truncate max-w-[180px]">
                    {prop.clientName}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300">
                    {prop.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-medium line-clamp-1">{prop.title}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
                  <span className="font-mono text-slate-200 font-bold">
                    {business.currencySymbol}{prop.amount?.toLocaleString()}
                  </span>
                  <span>Valid to: {prop.validUntil}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 8 Cols: Proposal View & Print Paper */}
        <div className="lg:col-span-8">
          {selectedProposal ? (
            <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
              {/* Proposal Actions */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>Created: {new Date(selectedProposal.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print / Export PDF
                  </button>
                  <button className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-all">
                    <Send className="w-3.5 h-3.5" /> Send to Client
                  </button>
                </div>
              </div>

              {/* Proposal Paper Layout */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 text-slate-200 text-xs sm:text-sm">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                  <div>
                    <div className="text-xl font-bold text-white tracking-tight">{business.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{business.email} • {business.phone}</div>
                    <div className="text-xs text-slate-400">{business.website}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-wider text-indigo-400 font-bold">Commercial Proposal</div>
                    <div className="text-lg font-bold font-mono text-white mt-1">
                      {business.currencySymbol}{selectedProposal.amount?.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Client Meta */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Prepared For</span>
                  <div className="text-base font-bold text-white">{selectedProposal.clientName}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{selectedProposal.title}</div>
                </div>

                {/* Scope */}
                <div>
                  <h4 className="font-bold text-slate-100 text-sm mb-2">Scope of Work & Objectives</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {selectedProposal.scope}
                  </p>
                </div>

                {/* Deliverables */}
                <div>
                  <h4 className="font-bold text-slate-100 text-sm mb-2">Key Project Deliverables</h4>
                  <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 whitespace-pre-line text-slate-300 text-xs">
                    {selectedProposal.deliverables}
                  </div>
                </div>

                {/* Signoff / Terms */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div>Valid Until: <strong className="text-slate-200">{selectedProposal.validUntil}</strong></div>
                  <div>Status: <strong className="text-emerald-400 capitalize">{selectedProposal.status}</strong></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-500 text-xs">
              No proposal selected. Click "Generate Proposal with AI" to create one.
            </div>
          )}
        </div>
      </div>

      {/* Generate Proposal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Generate Client Proposal with AI</h3>
            </div>
            <form onSubmit={handleGenerate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Client / Company Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Apex Hospital Solutions"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Target Budget</label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. ₹1,50,000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Client Requirements & Desired Outcomes *</label>
                <textarea
                  rows={4}
                  required
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="Describe client requirements (e.g. Need WhatsApp bot, CRM integration, appointment auto-confirmation and doctor schedule sync)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 shadow"
                >
                  {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>{isGenerating ? 'Generating Proposal...' : 'Generate Proposal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
