import React, { useState } from 'react';
import {
  Database,
  Plus,
  FileText,
  Globe,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Trash2,
  Search,
  BookOpen
} from 'lucide-react';
import { Business, KnowledgeSource } from '../types';

interface KnowledgeBaseViewProps {
  business: Business;
  sources: KnowledgeSource[];
  onAddSource: (title: string, type: 'manual_text' | 'faq' | 'url', content: string) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  business,
  sources,
  onAddSource,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'manual_text' | 'faq' | 'url'>('manual_text');
  const [newContent, setNewContent] = useState('');
  const [selectedSource, setSelectedSource] = useState<KnowledgeSource | null>(sources[0] || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    onAddSource(newTitle, newType, newContent);
    setShowAddModal(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-400" /> Business Knowledge Base
          </h1>
          <p className="text-xs text-slate-400">
            Index business documents, service FAQs, and company policies to ground AI chatbot & assistant responses
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Knowledge Source
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Knowledge Sources List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Indexed Sources ({sources.length})
          </div>

          <div className="space-y-2.5">
            {sources.map((src) => (
              <div
                key={src.id}
                onClick={() => setSelectedSource(src)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedSource?.id === src.id
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-bold text-slate-100 text-xs truncate max-w-[200px]">
                    {src.title}
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Indexed
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {src.content}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-800/80">
                  <span className="capitalize">{src.type.replace('_', ' ')}</span>
                  <span>{src.chunkCount} Chunks Embedded</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 7 Cols: Source Details & Inspection */}
        <div className="lg:col-span-7">
          {selectedSource ? (
            <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-100">{selectedSource.title}</h3>
                  <div className="text-xs text-indigo-400 capitalize">{selectedSource.type.replace('_', ' ')} Source</div>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-800/60">
                  Status: Ready for AI Retrieval
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">Stored Knowledge Content</span>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[360px] overflow-y-auto">
                  {selectedSource.content}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-500 text-xs">
              Select a knowledge source to view indexed data.
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add Knowledge Source</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Source Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Agency Pricing & SLA Policy"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Type</label>
                <select
                  value={newType}
                  onChange={(e: any) => setNewType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                >
                  <option value="manual_text">Manual Text & Service Description</option>
                  <option value="faq">Frequently Asked Questions (FAQ)</option>
                  <option value="url">Website URL Crawl</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Content / Details *</label>
                <textarea
                  rows={6}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste FAQ questions, service catalog, pricing tiers, or business rules..."
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow"
                >
                  Index & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
