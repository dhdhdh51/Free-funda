import React from 'react';
import {
  LayoutDashboard,
  Users2,
  Bot,
  Sparkles,
  MessageSquareCode,
  FileText,
  Receipt,
  Database,
  Workflow,
  Share2,
  Settings,
  Code2,
  Building,
  CheckSquare,
  X
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  leadCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  leadCount,
  isOpen,
  onClose,
}) => {
  const navSections = [
    {
      title: 'CORE OS & CRM',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'crm', label: 'Leads & Pipeline', icon: Users2, badge: leadCount },
        { id: 'assistant', label: 'AI Business Assistant', icon: Bot, highlight: true },
        { id: 'qualifier', label: 'AI Lead Qualification', icon: Sparkles },
      ],
    },
    {
      title: 'AI CLIENT TOOLS',
      items: [
        { id: 'chatbot', label: 'Website Chatbot Widget', icon: MessageSquareCode },
        { id: 'proposals', label: 'Proposals & Quotations', icon: FileText },
        { id: 'marketing', label: 'AI Marketing & SEO Suite', icon: Share2 },
        { id: 'knowledge', label: 'Knowledge Base & FAQs', icon: Database },
      ],
    },
    {
      title: 'AUTOMATION & SETTINGS',
      items: [
        { id: 'automations', label: 'Automations & Workflows', icon: Workflow },
        { id: 'admin', label: 'Admin & System Settings', icon: Settings },
      ],
    },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    onClose();
  };

  const navContent = (
    <>
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-600/30 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-100 text-sm tracking-tight flex items-center gap-1.5">
              BharatAI <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 font-semibold border border-indigo-700/50">OS</span>
            </div>
            <div className="text-[11px] text-slate-400">Business Automation SaaS</div>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navSections.map((sec, idx) => (
          <div key={idx}>
            <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              {sec.title}
            </div>
            <div className="space-y-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : item.highlight
                        ? 'text-indigo-300 hover:bg-indigo-950/40 hover:text-indigo-200'
                        : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : typeof item.badge === 'string'
                            ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer Status */}
      <div className="p-3 m-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs shrink-0">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px]">Backend Architecture</span>
          <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
          </span>
        </div>
        <div className="text-[11px] text-slate-300 font-medium">Native PHP 8.2 & MySQL 8</div>
        <div className="text-[10px] text-slate-500 mt-0.5">cPanel / Apache / VPS Compatible</div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex-col h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto select-none hidden md:flex shrink-0">
        {navContent}
      </aside>

      {/* Mobile Slide-out Drawer Overlay & Container */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-out Drawer */}
          <aside className="relative w-72 max-w-[85vw] bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col h-full z-50 animate-in slide-in-from-left duration-200 select-none">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
};
