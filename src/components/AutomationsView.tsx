import React, { useState } from 'react';
import {
  Workflow,
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  Mail,
  Zap,
  Loader2,
  Terminal
} from 'lucide-react';
import { Business, AutomationRule } from '../types';

interface AutomationsViewProps {
  business: Business;
  automations: AutomationRule[];
  onTriggerCron: () => Promise<void>;
  isRunningCron: boolean;
  cronLogs: string[];
}

export const AutomationsView: React.FC<AutomationsViewProps> = ({
  business,
  automations,
  onTriggerCron,
  isRunningCron,
  cronLogs,
}) => {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Workflow className="w-6 h-6 text-indigo-400" /> Automation Rules & Background Cron
          </h1>
          <p className="text-xs text-slate-400">
            Event-driven triggers that qualify leads, dispatch follow-ups, and execute cron jobs
          </p>
        </div>

        <button
          onClick={onTriggerCron}
          disabled={isRunningCron}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          {isRunningCron ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          <span>{isRunningCron ? 'Executing Cron Tasks...' : 'Run Cron Daemon'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Active Automation Rules */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Active Workspace Automations
          </div>

          <div className="space-y-3">
            {automations.map((auto) => (
              <div
                key={auto.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-950/70 text-indigo-400 border border-indigo-800/40 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 text-xs sm:text-sm">{auto.name}</div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <span>Trigger: <strong className="text-indigo-300 font-mono">{auto.trigger}</strong></span>
                      <span>•</span>
                      <span>Action: <strong className="text-emerald-400 font-mono">{auto.action}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {auto.status.toUpperCase()}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1.5">{auto.runsCount} executions</div>
                </div>
              </div>
            ))}
          </div>

          {/* cPanel Cron Instructions */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2 text-xs">
            <h4 className="font-bold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" /> Production Cron Command
            </h4>
            <p className="text-slate-400">
              Add this cron job in cPanel to execute automations and scheduled email sequences every 5 minutes:
            </p>
            <pre className="p-3 rounded-xl bg-slate-950 text-[11px] font-mono text-emerald-400 border border-slate-800 overflow-x-auto">
              */5 * * * * /usr/local/bin/php /home/username/public_html/cron/run_automations.php &gt;/dev/null 2&gt;&amp;1
            </pre>
          </div>
        </div>

        {/* Right 5 Cols: Live Execution Console */}
        <div className="lg:col-span-5">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs flex flex-col h-[400px]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Cron Execution Daemon</span>
              </div>
              <span className="text-[10px]">PHP 8.2 CLI</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 text-slate-300 text-[11px]">
              <div>[INFO] Cron daemon initialized on server.</div>
              <div>[INFO] Checking trigger events for business: {business.name}</div>
              {cronLogs.map((log, i) => (
                <div key={i} className="text-emerald-400">
                  {log}
                </div>
              ))}
              {isRunningCron && (
                <div className="text-indigo-400 animate-pulse">
                  [RUNNING] Executing lead qualification & automated email tasks...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
