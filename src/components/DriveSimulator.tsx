import React, { useState, useMemo } from 'react';
import {
  Play,
  CheckCircle2,
  Folder,
  FileText,
  AlertCircle,
  FileCheck,
  RefreshCw,
  Terminal,
  Download
} from 'lucide-react';
import { ScriptConfig, SampleDriveFile } from '../types';
import { INITIAL_SAMPLE_FILES } from '../data/mockData';

interface DriveSimulatorProps {
  config: ScriptConfig;
  onDownloadFile: (filename: string, content: string) => void;
}

export const DriveSimulator: React.FC<DriveSimulatorProps> = ({ config, onDownloadFile }) => {
  const [files] = useState<SampleDriveFile[]>(INITIAL_SAMPLE_FILES);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [downloadedFiles, setDownloadedFiles] = useState<{ name: string; inv: string; path: string; size: string }[]>([]);

  // Compile regex safely
  const regex = useMemo(() => {
    try {
      let pattern = config.regexPattern;
      let flags = 'g';
      if (pattern.startsWith('(?i)')) {
        pattern = pattern.replace('(?i)', '');
        flags += 'i';
      }
      return new RegExp(pattern, flags);
    } catch {
      return null;
    }
  }, [config.regexPattern]);

  // Compute matches
  const matchResults = useMemo(() => {
    if (!regex) return [];

    return files.map((file) => {
      // Check keyword filter first (simulating Drive API query)
      const keywordMatch = config.searchTerm
        ? file.name.toLowerCase().includes(config.searchTerm.toLowerCase())
        : true;

      // Check regex
      regex.lastIndex = 0;
      const regexMatch = regex.exec(file.name);
      const isMatched = keywordMatch && !!regexMatch;
      const extractedInvoice = regexMatch ? (regexMatch[1] || regexMatch[0]) : null;

      // Compute destination path according to organization strategy
      let targetPath = `${config.outputDir}/${file.name}`;
      if (config.organizeBy === 'by_invoice_num' && extractedInvoice) {
        targetPath = `${config.outputDir}/${extractedInvoice}/${file.name}`;
      } else if (config.organizeBy === 'by_year_month') {
        const dt = new Date(file.modifiedTime);
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, '0');
        targetPath = `${config.outputDir}/${y}/${m}/${file.name}`;
      }

      return {
        file,
        keywordMatch,
        regexMatch: !!regexMatch,
        isMatched,
        extractedInvoice,
        targetPath,
      };
    });
  }, [files, config, regex]);

  const matchedItems = matchResults.filter((m) => m.isMatched);

  const runSimulation = () => {
    setIsRunning(true);
    setTerminalLogs([]);
    setDownloadedFiles([]);

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const logs: string[] = [
      `${timestamp} [INFO] Starting Google Drive Invoice Harvester...`,
      `${timestamp} [INFO] Authenticated via ${config.authType.toUpperCase()} flow.`,
      `${timestamp} [INFO] Querying Google Drive API with filter: "trashed = false and name contains '${config.searchTerm}'"`,
      `${timestamp} [INFO] Scanned ${files.length} candidate files from Google Drive.`,
    ];

    setTerminalLogs([...logs]);

    let step = 0;
    const interval = setInterval(() => {
      if (step < matchedItems.length) {
        const item = matchedItems[step];
        const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
        const newLog = `${now} [INFO] [MATCH] Found invoice '${item.extractedInvoice}': ${item.file.name}`;
        const downloadLog = `${now} [INFO] Downloading [${item.extractedInvoice}] -> ${item.targetPath} (100% Complete)`;
        
        setTerminalLogs((prev) => [...prev, newLog, downloadLog]);
        setDownloadedFiles((prev) => [
          ...prev,
          {
            name: item.file.name,
            inv: item.extractedInvoice || 'N/A',
            path: item.targetPath,
            size: item.file.size,
          },
        ]);
        step++;
      } else {
        clearInterval(interval);
        const finalTime = new Date().toISOString().replace('T', ' ').slice(0, 19);
        setTerminalLogs((prev) => [
          ...prev,
          `${finalTime} [INFO] ==============================================================`,
          `${finalTime} [INFO] SUMMARY: Found & processed ${matchedItems.length} invoice(s). Done!`,
          `${finalTime} [INFO] Target destination: ${config.outputDir}`,
        ]);
        setIsRunning(false);
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-amber-400" />
              Drive Execution Simulator &amp; Log Stream
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Preview what your Python script will find and log before running it locally. Test how folder structure and invoice number extraction perform on simulated Google Drive files.
            </p>
          </div>

          <button
            onClick={runSimulation}
            disabled={isRunning}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition ${
              isRunning
                ? 'bg-amber-500/50 text-slate-900 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-95'
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Running Harvest...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Simulated Harvest</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Files in Mock Drive (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Folder className="w-4 h-4 text-amber-400" />
                Simulated Google Drive Files
              </h3>
              <p className="text-xs text-slate-400">
                Evaluation against keyword: <code className="text-amber-300">"{config.searchTerm}"</code> &amp; regex
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                {matchedItems.length} matched invoices
              </span>
            </div>
          </div>

          {/* Files List */}
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {matchResults.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition ${
                  item.isMatched
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className={`w-4 h-4 flex-shrink-0 ${item.isMatched ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className="text-xs font-mono font-medium text-slate-200 truncate select-all">
                        {item.file.name}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-400">
                      <span>Folder: <span className="text-slate-300">{item.file.folderName}</span></span>
                      <span>Size: <span className="text-slate-300">{item.file.size}</span></span>
                    </div>

                    {item.isMatched && (
                      <div className="mt-2 text-[11px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 inline-block">
                        Destination: {item.targetPath}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 text-right">
                    {item.isMatched ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        #{item.extractedInvoice}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-400">
                        Skipped
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Simulated Python Log Stream & Downloaded List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Terminal Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl flex-1 flex flex-col min-h-[280px]">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-slate-300 font-semibold">Python Terminal Output</span>
              </div>
              <span className="text-[10px] text-slate-500">logger.info</span>
            </div>

            <div className="flex-1 overflow-y-auto mt-2 font-mono text-[11px] leading-relaxed text-slate-300 space-y-1 pr-1">
              {terminalLogs.length === 0 ? (
                <div className="text-slate-500 italic py-8 text-center">
                  Click "Run Simulated Harvest" above to view live Python log output.
                </div>
              ) : (
                terminalLogs.map((log, i) => (
                  <div
                    key={i}
                    className={
                      log.includes('[MATCH]')
                        ? 'text-emerald-400 font-semibold'
                        : log.includes('SUMMARY')
                        ? 'text-amber-400 font-bold'
                        : 'text-slate-300'
                    }
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Downloaded Results summary card */}
          {downloadedFiles.length > 0 && (
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  Downloaded Files ({downloadedFiles.length})
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">100% saved</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {downloadedFiles.map((df, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs font-mono bg-slate-950/70 p-2 rounded-lg border border-slate-800"
                  >
                    <span className="truncate text-slate-200">{df.name}</span>
                    <span className="text-emerald-400 text-[11px] font-bold ml-2">
                      #{df.inv}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
