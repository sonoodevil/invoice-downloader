import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  HelpCircle,
  ArrowRight,
  Code
} from 'lucide-react';
import { REGEX_PRESETS } from '../data/mockData';

interface RegexTesterProps {
  currentPattern: string;
  onApplyPattern: (pattern: string) => void;
}

export const RegexTester: React.FC<RegexTesterProps> = ({ currentPattern, onApplyPattern }) => {
  const [testPattern, setTestPattern] = useState(currentPattern);
  const [testFiles, setTestFiles] = useState<string[]>([
    '260403 489201 REF9942.pdf',
    '260403 489201.pdf',
    'Invoice_INV-2024-8841.pdf',
    'AcmeCorp_Invoice_#49201.pdf',
    'INV-2024-0091_ClientNexus.xlsx',
    'AWS_Monthly_Bill_INV98231.pdf',
    'Coffee_Shop_Receipt_March.jpg',
    'Google_Cloud_Invoice_IN29482103.pdf',
    'Stripe_Payout_Invoice-202409-44.pdf',
    'Meeting_Notes_Sept_2024.docx',
    'Contractor_Bill_INV-77319_Final.pdf',
    'Draft_Invoice_Template_NoNumber.pdf',
    'Supplier_Factura_FAC-994120.pdf',
    'tax_summary_2023.pdf',
  ]);
  const [newFileName, setNewFileName] = useState('');

  // Synchronize when parent pattern changes
  React.useEffect(() => {
    setTestPattern(currentPattern);
  }, [currentPattern]);

  // Compile regex safely (handle Python's (?i) flag in JavaScript)
  const regexResult = useMemo(() => {
    try {
      let jsPattern = testPattern;
      let flags = 'g';

      if (jsPattern.startsWith('(?i)')) {
        jsPattern = jsPattern.replace('(?i)', '');
        flags += 'i';
      }

      const regex = new RegExp(jsPattern, flags);
      return { regex, error: null };
    } catch (err: any) {
      return { regex: null, error: err.message || 'Invalid regular expression' };
    }
  }, [testPattern]);

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFileName.trim()) {
      setTestFiles([newFileName.trim(), ...testFiles]);
      setNewFileName('');
    }
  };

  const handleRemoveFile = (index: number) => {
    setTestFiles(testFiles.filter((_, i) => i !== index));
  };

  const testFileResults = useMemo(() => {
    if (!regexResult.regex) return [];

    return testFiles.map((filename) => {
      // Reset lastIndex for global regex
      regexResult.regex.lastIndex = 0;
      const match = regexResult.regex.exec(filename);

      if (match) {
        // Group 1 if captured, else group 0
        const extracted = match[1] || match[0];
        return {
          filename,
          isMatch: true,
          extracted,
          matchIndex: match.index,
          matchLength: match[0].length,
        };
      }

      return {
        filename,
        isMatch: false,
        extracted: null,
      };
    });
  }, [testFiles, regexResult]);

  const matchCount = testFileResults.filter((r) => r.isMatch).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Explanation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-white">
                Interactive Regex &amp; Invoice Filename Tester
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Verify how your Python script will identify invoice files and extract their invoice numbers from Google Drive filenames. Test with sample or custom file names.
            </p>
          </div>

          {currentPattern !== testPattern && (
            <button
              onClick={() => onApplyPattern(testPattern)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition"
            >
              <span>Apply to Python Script</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Pattern Input & Presets */}
        <div className="mt-6 space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Regular Expression Pattern</span>
            {regexResult.error ? (
              <span className="text-rose-400 text-xs font-mono font-normal">
                Syntax Error: {regexResult.error}
              </span>
            ) : (
              <span className="text-emerald-400 text-xs font-mono font-normal">
                ✓ Valid Expression
              </span>
            )}
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={testPattern}
              onChange={(e) => setTestPattern(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-amber-300 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              placeholder="r'(?i)(?:INV|INVOICE)[-_ #]*([A-Za-z0-9-]+)'"
            />
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 font-medium">Quick Presets:</span>
            {REGEX_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setTestPattern(p.pattern)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                  testPattern === p.pattern
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-semibold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
                title={p.description}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Test Runner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Test List */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold text-white">Tested Filenames</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                {matchCount} of {testFiles.length} matched
              </span>
            </div>

            <span className="text-xs text-slate-500">
              Capturing group <code className="text-amber-400">group(1)</code>
            </span>
          </div>

          {/* Add custom filename */}
          <form onSubmit={handleAddFile} className="flex gap-2">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Test your own filename (e.g. MyCompany_INV-2024-990.pdf)..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add</span>
            </button>
          </form>

          {/* List of results */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {testFileResults.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                  item.isMatch
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {item.isMatch ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  )}
                  <span className="font-mono text-xs truncate select-all">{item.filename}</span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.isMatch ? (
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      <span className="text-[10px] text-emerald-400 uppercase font-semibold">
                        Invoice #:
                      </span>
                      <span className="font-mono text-xs font-bold text-emerald-300">
                        {item.extracted}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">Ignored</span>
                  )}

                  <button
                    onClick={() => handleRemoveFile(idx)}
                    className="text-slate-600 hover:text-rose-400 p-1 transition"
                    title="Remove from test list"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Regex Guide & Cheat Sheet */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Regex Cheat Sheet</h3>
          </div>

          <div className="space-y-4 text-xs text-slate-300">
            <div>
              <div className="font-mono text-amber-300 font-bold mb-1">(?i)</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Case-insensitive flag. Matches "invoice", "INVOICE", or "Invoice".
              </p>
            </div>

            <div>
              <div className="font-mono text-amber-300 font-bold mb-1">(?:INV|INVOICE)</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Non-capturing group. Matches either "INV" or "INVOICE" without saving it as the extracted result.
              </p>
            </div>

            <div>
              <div className="font-mono text-amber-300 font-bold mb-1">[-_ #]*</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Matches any separator: hyphens, underscores, spaces, or hashes (e.g. <code className="text-slate-200">INV-</code>, <code className="text-slate-200">Invoice_#</code>).
              </p>
            </div>

            <div>
              <div className="font-mono text-emerald-300 font-bold mb-1">([A-Za-z0-9-]+)</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Capturing group 1. Extracts the alphanumeric invoice code as a clean string in Python:
                <br />
                <code className="text-amber-400 font-mono text-[10px]">match.group(1)</code>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Python Code In Action
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300">
                <span className="text-purple-300">match</span> = <span className="text-amber-400">re.search</span>(pattern, filename)
                <br />
                <span className="text-amber-300">if</span> match:
                <br />
                &nbsp;&nbsp;inv_num = match.<span className="text-cyan-300">group</span>(1)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
