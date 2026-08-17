import React, { useState } from 'react';
import { 
  Building2, 
  ChevronDown, 
  Sparkles, 
  Plus, 
  Bell, 
  Globe, 
  User, 
  LogOut, 
  Check, 
  Layers,
  Code2,
  HelpCircle,
  Menu
} from 'lucide-react';
import { Business } from '../types';

interface NavbarProps {
  currentBusiness: Business;
  businesses: Business[];
  onSwitchBusiness: (bizId: string) => void;
  onOpenNewBusiness: () => void;
  onOpenQuickAction: () => void;
  onNavigate: (view: string) => void;
  onShowLanding: () => void;
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentBusiness,
  businesses,
  onSwitchBusiness,
  onOpenNewBusiness,
  onOpenQuickAction,
  onNavigate,
  onShowLanding,
  onToggleMobileSidebar,
}) => {
  const [bizDropdownOpen, setBizDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const usagePercent = Math.min(
    100,
    Math.round((currentBusiness.creditsUsed / currentBusiness.creditsLimit) * 100)
  );

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-30 px-3 sm:px-4 md:px-6 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Business Tenant Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none md:hidden flex items-center justify-center transition-colors border border-slate-800 active:scale-95"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setBizDropdownOpen(!bizDropdownOpen)}
            className="flex items-center gap-2.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-100 text-sm font-medium transition-all"
          >
            <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
              {currentBusiness.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-semibold text-slate-100 block text-xs md:text-sm leading-tight">
                {currentBusiness.name}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                {currentBusiness.industry || 'Multi-Tenant OS'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </button>

          {/* Tenant Dropdown */}
          {bizDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Switch Business / Agency Client
              </div>
              {businesses.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    onSwitchBusiness(b.id);
                    setBizDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800 text-xs transition-colors ${
                    b.id === currentBusiness.id ? 'bg-indigo-950/40 text-indigo-300 font-semibold' : 'text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="text-slate-100">{b.name}</div>
                      <div className="text-[10px] text-slate-500">{b.plan} • {b.currency}</div>
                    </div>
                  </div>
                  {b.id === currentBusiness.id && <Check className="w-4 h-4 text-indigo-400" />}
                </button>
              ))}

              <div className="border-t border-slate-800 my-1"></div>
              <button
                onClick={() => {
                  onOpenNewBusiness();
                  setBizDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-indigo-400 hover:bg-indigo-950/30 flex items-center gap-2 font-medium"
              >
                <Plus className="w-4 h-4" /> Add New Business / Client
              </button>
            </div>
          )}
        </div>

        {/* Agency Badge */}
        <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
          <Layers className="w-3 h-3" /> Agency Mode Active
        </span>
      </div>

      {/* Right: AI Credits, Quick Action, System Inspector, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Credit Balance Meter */}
        <div 
          onClick={() => onNavigate('admin')}
          className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300 cursor-pointer hover:border-indigo-500/50 transition-all"
          title="AI Tokens & Provider Routing Status"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            AI Credits: <strong className="text-slate-100 font-semibold">{currentBusiness.creditsUsed.toLocaleString()}</strong> / {(currentBusiness.creditsLimit / 1000).toFixed(0)}k
          </span>
          <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${usagePercent}%` }}></div>
          </div>
        </div>

        {/* Marketing Page Switcher */}
        <button
          onClick={onShowLanding}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
          title="View Public Website & Pricing"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Website</span>
        </button>

        {/* Quick Action Button */}
        <button
          onClick={onOpenQuickAction}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quick Action</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50 text-xs">
              <div className="font-semibold text-slate-200 mb-2 flex items-center justify-between">
                <span>Recent System Alerts</span>
                <span className="text-[10px] text-indigo-400 font-normal">Mark all read</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
                  <div className="font-medium text-slate-200">High-Intent Lead Qualified</div>
                  <div className="text-slate-400 text-[11px]">Vikram Malhotra scored 92/100 by Gemini AI.</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
                  <div className="font-medium text-slate-200">Automated Follow-up Sent</div>
                  <div className="text-slate-400 text-[11px]">Welcome sequence dispatched via SMTP.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 text-slate-200 text-xs transition-all"
          >
            <span className="font-semibold hidden lg:inline">Admin User</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center">
              A
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-800">
                <div className="font-semibold text-slate-100">Super Administrator</div>
                <div className="text-[11px] text-slate-400">admin@bharatai.io</div>
              </div>
              <button 
                onClick={() => { onNavigate('admin'); setUserMenuOpen(false); }}
                className="w-full px-3 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-slate-400" /> Admin & System Settings
              </button>
              <button 
                onClick={() => { onNavigate('source-code'); setUserMenuOpen(false); }}
                className="w-full px-3 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2"
              >
                <Code2 className="w-3.5 h-3.5 text-slate-400" /> cPanel Package & DDL
              </button>
              <button 
                onClick={() => { onShowLanding(); setUserMenuOpen(false); }}
                className="w-full px-3 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Product Documentation
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
