import React, { useState } from 'react';
import {
  Share2,
  Sparkles,
  Send,
  Loader2,
  Copy,
  Check,
  Search,
  MessageSquare,
  Globe,
  FileText
} from 'lucide-react';
import { Business } from '../types';

interface MarketingSuiteViewProps {
  business: Business;
}

export const MarketingSuiteView: React.FC<MarketingSuiteViewProps> = ({ business }) => {
  const [activeTab, setActiveTab] = useState<'social' | 'seo' | 'review'>('social');
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('LinkedIn');
  const [tone, setTone] = useState('Professional & High Converting');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    setOutput('');

    try {
      const response = await fetch('/api/ai/generate-marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: activeTab,
          topic,
          platform,
          tone,
        }),
      });
      const data = await response.json();
      setOutput(data.content || 'Content generated successfully.');
    } catch (err: any) {
      setOutput('Generation error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Share2 className="w-6 h-6 text-indigo-400" /> AI Marketing & SEO Content Suite
        </h1>
        <p className="text-xs text-slate-400">
          Generate high-converting social posts, SEO keyword articles, and professional customer review replies
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => { setActiveTab('social'); setOutput(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'social' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Share2 className="w-4 h-4" /> Social Media Posts
        </button>
        <button
          onClick={() => { setActiveTab('seo'); setOutput(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'seo' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-4 h-4" /> SEO Outline & Articles
        </button>
        <button
          onClick={() => { setActiveTab('review'); setOutput(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'review' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Review Reply Assistant
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {activeTab === 'social'
                  ? 'Campaign Topic / Product Promotion *'
                  : activeTab === 'seo'
                  ? 'Target SEO Keyword *'
                  : 'Customer Review Text *'}
              </label>
              <textarea
                rows={4}
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={
                  activeTab === 'social'
                    ? 'e.g. Announcing our new AI CRM automation package with 30% speed boost for local businesses'
                    : activeTab === 'seo'
                    ? 'e.g. best ai automation tools for small business in india'
                    : 'Paste the review: "Great service, but the setup took 2 days longer than expected."'
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 resize-none focus:outline-none focus:border-indigo-500"
              />
            </div>

            {activeTab === 'social' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Twitter / X">Twitter / X</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  >
                    <option value="Professional & High Converting">Professional & High Converting</option>
                    <option value="Exciting & Bold">Exciting & Bold</option>
                    <option value="Educational & Helpful">Educational & Helpful</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 shadow"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isLoading ? 'Generating Content...' : 'Generate with AI'}</span>
            </button>
          </form>
        </div>

        {/* Output Area */}
        <div className="lg:col-span-7 bg-slate-900/95 border border-slate-800 rounded-2xl p-5 flex flex-col min-h-[350px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200">Generated AI Output</span>
            {output && (
              <button
                onClick={handleCopy}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>

          <div className="flex-1 mt-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap overflow-y-auto">
            {output ? (
              output
            ) : (
              <span className="text-slate-500 italic">
                Enter your topic and click Generate to see real-time AI results.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
