import React from 'react';
import {
  Users,
  Sparkles,
  TrendingUp,
  FileCheck,
  Bot,
  Zap,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Plus,
  ChevronRight
} from 'lucide-react';
import { Business, Lead, Proposal } from '../types';

interface DashboardViewProps {
  business: Business;
  leads: Lead[];
  proposals: Proposal[];
  onNavigate: (view: string) => void;
  onOpenNewLead: () => void;
  onOpenQuickAI: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  business,
  leads,
  proposals,
  onNavigate,
  onOpenNewLead,
  onOpenQuickAI,
}) => {
  const totalPipeline = leads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);
  const qualifiedLeads = leads.filter((l) => l.status === 'Qualified' || (l.aiScore && l.aiScore >= 75));
  const avgAiScore = leads.length
    ? Math.round(leads.reduce((acc, l) => acc + (l.aiScore || 70), 0) / leads.length)
    : 85;

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> BharatAI Business OS v1.0
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {business.name}
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl">
              {business.about || 'AI automation platform for lead generation, CRM pipelines, and multi-tenant management.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNewLead}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Lead
            </button>
            <button
              onClick={onOpenQuickAI}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Bot className="w-4 h-4 text-indigo-400" /> Ask AI Assistant
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Pipeline</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            {business.currencySymbol}{totalPipeline.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +18.4%
            </span>
            <span>vs previous month</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Leads</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            {leads.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-indigo-400 font-semibold">{qualifiedLeads.length} Qualified</span>
            <span>by Gemini AI</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">AI Intent Score</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            {avgAiScore}<span className="text-sm font-normal text-slate-400">/100</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-purple-400 font-semibold">High Intent</span>
            <span>buying probability</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Proposals & Quotes</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            {proposals.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-amber-400 font-semibold">100% Generated</span>
            <span>with Gemini AI</span>
          </div>
        </div>
      </div>

      {/* Main Grid: CRM Pipeline Preview & AI Assistant Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Leads with AI Scoring */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100">Recent CRM Inquiries & AI Scores</h2>
              <p className="text-xs text-slate-400">Real-time leads scored and qualified via backend AI</p>
            </div>
            <button
              onClick={() => onNavigate('crm')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              View All Pipeline <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {leads.slice(0, 4).map((lead) => (
              <div
                key={lead.id}
                onClick={() => onNavigate('crm')}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {lead.firstName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200 text-xs sm:text-sm">
                        {lead.firstName} {lead.lastName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {lead.companyName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {lead.requirement}
                    </p>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {business.currencySymbol}{lead.estimatedValue?.toLocaleString()} • {lead.location}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-1.5">
                  {lead.aiScore ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                      <Sparkles className="w-3 h-3 text-emerald-400" /> {lead.aiScore}/100 Score
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">Unqualified</span>
                  )}
                  <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                    lead.status === 'Qualified' ? 'bg-indigo-900/60 text-indigo-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick AI Tools & Architecture Overview */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-100 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" /> Instant AI Generators
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('proposals')}
                className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-600/40 text-xs transition-all group"
              >
                <div className="font-semibold text-slate-200 group-hover:text-indigo-300">Generate Client Proposal</div>
                <div className="text-[11px] text-slate-400">Creates scope, deliverables, timeline & pricing with Gemini.</div>
              </button>

              <button
                onClick={() => onNavigate('marketing')}
                className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-600/40 text-xs transition-all group"
              >
                <div className="font-semibold text-slate-200 group-hover:text-indigo-300">Social Media & SEO Suite</div>
                <div className="text-[11px] text-slate-400">Generate LinkedIn posts, hashtags & SEO articles.</div>
              </button>

              <button
                onClick={() => onNavigate('chatbot')}
                className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-600/40 text-xs transition-all group"
              >
                <div className="font-semibold text-slate-200 group-hover:text-indigo-300">Website Chatbot Widget</div>
                <div className="text-[11px] text-slate-400">Configure 24/7 lead capture bot for client websites.</div>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/40 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> Production Architecture
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Multi-tenant native PHP 8.2 backend with PDO MySQL 8 schema, session security, and cPanel deployment files.
            </p>
            <button
              onClick={() => onNavigate('source-code')}
              className="w-full py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 text-indigo-200 text-xs font-semibold transition-all text-center block"
            >
              Inspect DDL & PHP Source Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
