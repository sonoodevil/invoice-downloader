import React, { useState } from 'react';
import { Copy, Check, Download, FileText, Terminal, Code2, BookOpen } from 'lucide-react';
import { ScriptConfig } from '../types';
import { SupplierMapping } from '../data/supplierMappings';
import { generatePythonScript, generateRequirementsTxt, generateReadmeMd } from '../utils/scriptGenerators';

interface CodeViewerProps {
  config: ScriptConfig;
  supplierMappings?: SupplierMapping[];
  onDownloadFile: (filename: string, content: string) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ config, supplierMappings, onDownloadFile }) => {
  const [activeFile, setActiveFile] = useState<'script' | 'requirements' | 'readme' | 'command'>('script');
  const [copied, setCopied] = useState(false);

  const pythonScript = generatePythonScript(config, supplierMappings);
  const requirementsTxt = generateRequirementsTxt(config.authType);
  const readmeMd = generateReadmeMd(config);

  const bashCommand = `# 1. Create a virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: .\\venv\\Scripts\\activate

# 2. Install required Google Drive dependencies
pip install -r requirements.txt

# 3. Ensure credentials.json (or service_account.json) is in this folder

# 4. Run the invoice harvester
python3 download_invoices.py${config.enableDryRun ? ' --dry-run' : ''}
`;

  const getCurrentContent = () => {
    switch (activeFile) {
      case 'script':
        return { name: 'download_invoices.py', content: pythonScript, lang: 'python' };
      case 'requirements':
        return { name: 'requirements.txt', content: requirementsTxt, lang: 'text' };
      case 'readme':
        return { name: 'README.md', content: readmeMd, lang: 'markdown' };
      case 'command':
        return { name: 'terminal_run.sh', content: bashCommand, lang: 'bash' };
    }
  };

  const current = getCurrentContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(current.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    onDownloadFile(current.name, current.content);
  };

  const lines = current.content.split('\n');

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full min-h-[640px]">
      {/* File Tabs & Actions Toolbar */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveFile('script')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              activeFile === 'script'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            download_invoices.py
          </button>

          <button
            onClick={() => setActiveFile('requirements')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              activeFile === 'requirements'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            requirements.txt
          </button>

          <button
            onClick={() => setActiveFile('readme')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              activeFile === 'readme'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            README.md
          </button>

          <button
            onClick={() => setActiveFile('command')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              activeFile === 'command'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            Terminal Commands
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            {lines.length} lines
          </span>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium border border-amber-500/30 transition"
            title={`Download ${current.name}`}
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Code Editor Preview Area */}
      <div className="flex-1 overflow-auto bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-300 selection:bg-amber-500/30 selection:text-amber-100">
        <pre className="grid grid-cols-[auto_1fr] gap-x-4">
          {/* Line Numbers Column */}
          <span className="select-none text-slate-600 text-right pr-2 border-r border-slate-800">
            {lines.map((_, i) => (
              <span key={i} className="block leading-relaxed">
                {i + 1}
              </span>
            ))}
          </span>

          {/* Code Lines with basic keyword coloring */}
          <code className="overflow-x-auto whitespace-pre">
            {lines.map((line, i) => (
              <span key={i} className="block leading-relaxed">
                {formatCodeLine(line)}
              </span>
            ))}
          </code>
        </pre>
      </div>

      {/* Footer Status & One-click download all bundle */}
      <div className="bg-slate-950/90 border-t border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Ready to execute with Python 3.9+</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onDownloadFile('download_invoices.py', pythonScript);
              onDownloadFile('requirements.txt', requirementsTxt);
              onDownloadFile('README.md', readmeMd);
            }}
            className="text-amber-400 hover:text-amber-300 font-medium underline-offset-2 hover:underline"
          >
            Download Complete Project Bundle (.py, requirements, readme)
          </button>
        </div>
      </div>
    </div>
  );
};

// Lightweight client-side token highlighter for clean presentation
function formatCodeLine(line: string): React.ReactNode {
  // Comments
  if (line.trim().startsWith('#')) {
    return <span className="text-slate-500 italic">{line}</span>;
  }
  // Docstrings
  if (line.includes('"""') || line.includes("'''")) {
    return <span className="text-emerald-400/90">{line}</span>;
  }
  // Imports
  if (line.startsWith('import ') || line.startsWith('from ')) {
    return (
      <span>
        <span className="text-amber-400 font-semibold">{line.split(' ')[0]} </span>
        <span className="text-cyan-300">{line.slice(line.split(' ')[0].length + 1)}</span>
      </span>
    );
  }
  // Def & class
  if (line.trim().startsWith('def ') || line.trim().startsWith('class ')) {
    return <span className="text-purple-300 font-semibold">{line}</span>;
  }
  // Return & if/else
  if (
    line.trim().startsWith('return ') ||
    line.trim().startsWith('if ') ||
    line.trim().startsWith('elif ') ||
    line.trim().startsWith('else:') ||
    line.trim().startsWith('while ') ||
    line.trim().startsWith('for ')
  ) {
    return <span className="text-amber-300">{line}</span>;
  }

  return <span>{line}</span>;
}
