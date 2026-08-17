import React, { useState, useEffect } from 'react';
import {
  Code2,
  FileCode,
  Copy,
  Check,
  Download,
  Server,
  Database,
  ShieldCheck,
  FolderOpen,
  Loader2
} from 'lucide-react';

export const SourceCodeExplorerView: React.FC = () => {
  const [files, setFiles] = useState<Array<{ name: string; path: string; description: string }>>([]);
  const [selectedFile, setSelectedFile] = useState<string>('/database/schema.sql');
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/system/source-files')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.files) {
          setFiles(data.files);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedFile) return;
    setIsLoading(true);
    fetch(`/api/system/file-content?path=${encodeURIComponent(selectedFile)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.content !== undefined) {
          setFileContent(data.content);
        } else {
          setFileContent('// File content unavailable');
        }
      })
      .catch((err) => {
        setFileContent('// Failed to load file: ' + err.message);
      })
      .finally(() => setIsLoading(false));
  }, [selectedFile]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.split('/').pop() || 'file.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-6 h-6 text-indigo-400" /> Native PHP & MySQL Production Source Code
          </h1>
          <p className="text-xs text-slate-400">
            Inspect, copy, and export complete production PHP 8.2+ source code, MySQL schema DDL, and cPanel configuration
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Download File
          </button>
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Code' : 'Copy File Content'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: File Explorer Tree */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-indigo-400" /> Project Source Files
          </div>

          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {files.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file.path)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                  selectedFile === file.path
                    ? 'bg-indigo-950/60 border border-indigo-600/50 text-indigo-200 font-semibold'
                    : 'bg-slate-950/50 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${selectedFile === file.path ? 'text-indigo-400' : 'text-slate-500'}`} />
                <div className="truncate">
                  <div className="text-slate-200 truncate">{file.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{file.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 8 Cols: Code Viewer */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col h-[620px] shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-emerald-400 font-bold">{selectedFile}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {selectedFile.endsWith('.sql') ? 'SQL (MySQL 8+)' : selectedFile.endsWith('.php') ? 'PHP 8.2+' : 'Config / Text'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500">{fileContent.split('\n').length} lines</span>
          </div>

          <div className="flex-1 overflow-auto mt-3 font-mono text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-400 mr-2" /> Loading file content...
              </div>
            ) : (
              <pre className="whitespace-pre">{fileContent}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
