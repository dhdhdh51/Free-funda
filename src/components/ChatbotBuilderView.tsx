import React, { useState } from 'react';
import {
  MessageSquareCode,
  Sparkles,
  Copy,
  Check,
  Send,
  Loader2,
  Bot,
  Settings2,
  Sliders,
  Eye,
  Code
} from 'lucide-react';
import { Business } from '../types';

interface ChatbotBuilderViewProps {
  business: Business;
}

export const ChatbotBuilderView: React.FC<ChatbotBuilderViewProps> = ({ business }) => {
  const [botName, setBotName] = useState('BharatBot AI');
  const [welcomeMessage, setWelcomeMessage] = useState(
    `Namaste! Welcome to ${business.name}. How can we assist you with our services today?`
  );
  const [primaryColor, setPrimaryColor] = useState('#4f46e5');
  const [requirePhone, setRequirePhone] = useState(true);
  const [requireEmail, setRequireEmail] = useState(true);
  const [tone, setTone] = useState('Professional & Friendly');
  const [copiedCode, setCopiedCode] = useState(false);

  // Live Test Chat State
  const [testChatMessages, setTestChatMessages] = useState<Array<{ role: 'bot' | 'user'; text: string }>>([
    {
      role: 'bot',
      text: welcomeMessage,
    },
  ]);
  const [testInput, setTestInput] = useState('');
  const [isBotThinking, setIsBotThinking] = useState(false);

  const embedScript = `<!-- BharatAI Business OS - Embeddable Website Chatbot Widget -->
<script 
  src="https://yourdomain.com/public/assets/js/chat-widget.js" 
  data-business-id="${business.id}"
  data-primary-color="${primaryColor}"
  data-bot-name="${botName}"
  async>
</script>`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(embedScript);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim() || isBotThinking) return;

    const userText = testInput;
    setTestChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setTestInput('');
    setIsBotThinking(true);

    try {
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          businessId: business.id,
        }),
      });
      const data = await response.json();
      setTestChatMessages((prev) => [
        ...prev,
        { role: 'bot', text: data.reply || "Thank you for reaching out! A representative will contact you shortly." },
      ]);
    } catch (err: any) {
      setTestChatMessages((prev) => [
        ...prev,
        { role: 'bot', text: "Thank you for your message. How can I help you further?" },
      ]);
    } finally {
      setIsBotThinking(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <MessageSquareCode className="w-6 h-6 text-indigo-400" /> Website AI Chatbot Builder
        </h1>
        <p className="text-xs text-slate-400">
          Deploy a 24/7 lead capture and customer inquiry chatbot trained on your business knowledge base
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Customizer & Embed Script */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" /> Chatbot Appearance & Behavior
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Bot Name</label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Brand Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-9 h-9 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-400 mb-1">Welcome Message</label>
              <textarea
                rows={2}
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 resize-none focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-slate-300 block mb-2">Lead Capture Fields</span>
              <div className="flex items-center gap-6 text-xs text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireEmail}
                    onChange={(e) => setRequireEmail(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  <span>Require Email Address</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requirePhone}
                    onChange={(e) => setRequirePhone(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  <span>Require Phone Number</span>
                </label>
              </div>
            </div>
          </div>

          {/* Embed Script Section */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" /> 1-Click Embed Snippet
              </h3>
              <button
                onClick={handleCopyScript}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-all"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Copied to Clipboard' : 'Copy HTML Script'}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Paste this script tag right before the closing <code className="text-indigo-300 font-mono">&lt;/body&gt;</code> tag on WordPress, Shopify, Webflow, or custom PHP sites.
            </p>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-emerald-400 overflow-x-auto">
              {embedScript}
            </pre>
          </div>
        </div>

        {/* Right 5 Cols: Live Interactive Widget Simulator */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 flex flex-col h-[520px] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-100 text-xs">{botName}</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live Interactive Preview
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Website Widget</span>
            </div>

            {/* Chat Simulator Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {testChatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`rounded-2xl px-3.5 py-2 text-xs ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-950 border border-slate-800 text-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isBotThinking && (
                <div className="flex gap-2 max-w-[80%] mr-auto">
                  <div className="rounded-2xl px-3.5 py-2 bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                    <span>Typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Simulated Input */}
            <form onSubmit={handleTestSubmit} className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Type a visitor question to test bot..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!testInput.trim() || isBotThinking}
                className="p-2 rounded-xl text-white disabled:opacity-40 transition-all"
                style={{ backgroundColor: primaryColor }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
