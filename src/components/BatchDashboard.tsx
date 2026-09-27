import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RefreshCw,
  Archive,
  Download,
  Terminal,
  Clock,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Trash2,
  ArrowDown,
  Layers,
  FileText,
  FileSpreadsheet,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { BatchZipItem, SheetInvoiceRow } from '../types';

export interface BatchLogEntry {
  id: string;
  timestamp: string;
  batchNum: number;
  level: 'info' | 'download' | 'ratelimit' | 'zip' | 'success' | 'warn';
  message: string;
  filename?: string;
  fileSize?: string;
}

interface BatchDashboardProps {
  isProcessing: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
  onStartProcessing: () => void;
  currentBatchNum: number;
  totalBatches: number;
  batchProgress: { current: number; total: number };
  overallProgress: { current: number; total: number };
  currentActiveFile: { name: string; inv: string; supplier: string; size: string } | null;
  rateLimitDelaySec: number;
  onUpdateRateLimit: (delay: number) => void;
  isRateLimiting: boolean;
  rateLimitCountdown: number;
  batchLogs: BatchLogEntry[];
  onClearLogs: () => void;
  onSaveLogs?: () => void;
  onExportAuditCsv?: () => void;
  completedZips: BatchZipItem[];
  onDownloadZip: (zip: BatchZipItem) => void;
  onDownloadAllZips: () => void;
  onDownloadAllAsPdfs?: () => void;
}

export const BatchDashboard: React.FC<BatchDashboardProps> = ({
  isProcessing,
  isPaused,
  onTogglePause,
  onStartProcessing,
  currentBatchNum,
  totalBatches,
  batchProgress,
  overallProgress,
  currentActiveFile,
  rateLimitDelaySec,
  onUpdateRateLimit,
  isRateLimiting,
  rateLimitCountdown,
  batchLogs,
  onClearLogs,
  onSaveLogs,
  onExportAuditCsv,
  completedZips,
  onDownloadZip,
  onDownloadAllZips,
  onDownloadAllAsPdfs,
}) => {
  const [logFilter, setLogFilter] = useState<'all' | 'download' | 'ratelimit' | 'zip'>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const [copiedLog, setCopiedLog] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new logs arrive
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [batchLogs, autoScroll]);

  // Copy batch logs
  const handleCopyLogs = () => {
    const text = batchLogs
      .map((l) => `[${l.timestamp}] [BATCH ${l.batchNum}] [${l.level.toUpperCase()}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  // Filter logs for current view
  const filteredLogs = batchLogs.filter((l) => {
    if (logFilter === 'all') return true;
    if (logFilter === 'download') return l.level === 'download' || l.level === 'success';
    if (logFilter === 'ratelimit') return l.level === 'ratelimit';
    if (logFilter === 'zip') return l.level === 'zip';
    return true;
  });

  const batchPercent =
    batchProgress.total > 0
      ? Math.min(100, Math.round((batchProgress.current / batchProgress.total) * 100))
      : 0;

  const overallPercent =
    overallProgress.total > 0
      ? Math.min(100, Math.round((overallProgress.current / overallProgress.total) * 100))
      : 0;

  const filesRemaining = Math.max(0, overallProgress.total - overallProgress.current);
  const remainingTimeSeconds = filesRemaining * rateLimitDelaySec;

  const formatTimeRemaining = (sec: number): string => {
    if (sec <= 0) return '0s';
    if (sec < 60) return `${Math.ceil(sec)}s`;
    const mins = Math.floor(sec / 60);
    const remainingSecs = Math.round(sec % 60);
    return `${mins}m ${remainingSecs}s`;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Real-Time Batch Harvest Dashboard
                </h3>
                {isProcessing ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {isPaused
                      ? 'PAUSED'
                      : isRateLimiting
                      ? `RATE LIMITING (${rateLimitCountdown.toFixed(1)}s)`
                      : `PROCESSING BATCH ${currentBatchNum}/${totalBatches}`}
                  </span>
                ) : overallProgress.current > 0 && overallProgress.current === overallProgress.total ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ALL BATCHES COMPLETE
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-400">
                    STANDBY
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Displays live file streaming progress, rate-limit throttling, and batch-isolated log stream.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Rate Limit Slider */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Rate Limiter Quick Dial */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-slate-400 font-medium">Rate Delay:</span>
            <input
              type="range"
              min="0"
              max="3"
              step="0.2"
              value={rateLimitDelaySec}
              onChange={(e) => onUpdateRateLimit(parseFloat(e.target.value) || 0)}
              className="w-20 accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-amber-300 w-9 text-right">
              {rateLimitDelaySec.toFixed(1)}s
            </span>
          </div>

          {/* Pause / Resume Button */}
          {isProcessing ? (
            <button
              onClick={onTogglePause}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow ${
                isPaused
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
              }`}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {onDownloadAllAsPdfs && (
                <button
                  onClick={onDownloadAllAsPdfs}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition active:scale-95 cursor-pointer"
                  title="Download all matched items directly as individual PDF files"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download All as PDFs (Direct)</span>
                </button>
              )}
              <button
                onClick={onStartProcessing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Batch Harvest</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Progress Indicators Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1: Current Active Batch Progress */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Current Batch #{currentBatchNum || 1} Progress
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300">
              {batchProgress.current} / {batchProgress.total} files ({batchPercent}%)
            </span>
          </div>

          {/* Batch Bar */}
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 h-full rounded-full transition-all duration-300 shadow-sm shadow-amber-500/50"
              style={{ width: `${batchPercent}%` }}
            />
          </div>

          {/* Active File Banner */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
            <div className="truncate flex-1 pr-2">
              {currentActiveFile ? (
                <span className="text-slate-200">
                  <span className="text-amber-400 font-semibold">Active:</span> {currentActiveFile.name}
                </span>
              ) : (
                <span className="text-slate-500 italic">Waiting for next batch file...</span>
              )}
            </div>
            {isRateLimiting && (
              <span className="text-amber-400 font-bold flex items-center gap-1 flex-shrink-0">
                <Clock className="w-3 h-3 animate-spin" />
                Wait: {rateLimitCountdown.toFixed(1)}s
              </span>
            )}
          </div>
        </div>

        {/* Column 2: Overall Total Progress */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Overall Total Progress
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {overallProgress.current} / {overallProgress.total} files ({overallPercent}%)
            </span>
          </div>

          {/* Overall Bar */}
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300 shadow-sm shadow-emerald-500/50"
              style={{ width: `${overallPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>
              Batches Completed: <strong className="text-white">{completedZips.length}</strong> of {totalBatches}
            </span>
            <span className="text-slate-500 font-mono">
              Remaining: {Math.max(0, overallProgress.total - overallProgress.current)} files
            </span>
          </div>
        </div>

        {/* Column 3: Projected Completion Time Remaining */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Time Remaining Estimator
              </span>
            </div>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-semibold font-sans">
              ETA Active
            </span>
          </div>

          <div className="py-2.5 flex flex-col items-center justify-center text-center">
            {isProcessing ? (
              <>
                <span className="text-3xl font-mono font-black text-amber-400 tracking-tight">
                  {formatTimeRemaining(remainingTimeSeconds)}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-mono">
                  Projected completion time
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl font-mono font-extrabold text-slate-500">
                  {overallProgress.current === overallProgress.total && overallProgress.total > 0 ? (
                    <span className="text-emerald-400">COMPLETED</span>
                  ) : (
                    "STANDBY"
                  )}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-mono">
                  {overallProgress.current === overallProgress.total && overallProgress.total > 0 ? "Job finished successfully" : "Start harvester to compute"}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
            <span>
              Remaining: <strong className="text-white font-mono">{filesRemaining}</strong> files
            </span>
            <span className="text-slate-500 font-mono text-[10px]">
              Speed: {(1 / (rateLimitDelaySec || 0.1)).toFixed(1)} f/s
            </span>
          </div>
        </div>
      </div>

      {/* 3. Live Batch Log Window */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[340px]">
        {/* Terminal Header & Filter Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span className="font-mono font-bold text-slate-200">
              Active Batch #{currentBatchNum || 1} Log Stream
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              {filteredLogs.length} events
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1">
            {(['all', 'download', 'ratelimit', 'zip'] as const).map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setLogFilter(filterKey)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition ${
                  logFilter === filterKey
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {filterKey === 'all'
                  ? 'All Logs'
                  : filterKey === 'download'
                  ? 'Downloads'
                  : filterKey === 'ratelimit'
                  ? 'Rate Limiter'
                  : 'ZIP Events'}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`text-[10px] font-mono px-2 py-1 rounded transition border ${
                autoScroll
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              Auto-Scroll: {autoScroll ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={handleCopyLogs}
              className="text-[10px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition flex items-center gap-1 border border-slate-700"
              title="Copy batch logs to clipboard"
            >
              {copiedLog ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedLog ? 'Copied' : 'Copy'}</span>
            </button>

            {onSaveLogs && (
              <button
                onClick={onSaveLogs}
                className="text-[10px] font-mono text-amber-300 hover:text-amber-200 px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 transition flex items-center gap-1 border border-amber-500/30"
                title="Save & Export log window content as .txt file"
              >
                <Download className="w-3 h-3" />
                <span>Save Logs</span>
              </button>
            )}

            {onExportAuditCsv && (
              <button
                onClick={onExportAuditCsv}
                className="text-[10px] font-mono text-emerald-300 hover:text-emerald-200 px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 transition flex items-center gap-1 border border-emerald-500/30"
                title="Export session audit log of successes and failures as downloadable CSV"
              >
                <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
                <span>Audit CSV</span>
              </button>
            )}

            <button
              onClick={onClearLogs}
              className="text-[10px] font-mono text-slate-500 hover:text-rose-400 px-2 py-1 rounded transition"
              title="Clear logs"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div
          ref={logContainerRef}
          className="flex-1 p-3.5 overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-300 space-y-1 bg-slate-950"
        >
          {filteredLogs.length === 0 ? (
            <div className="text-slate-500 italic py-16 text-center">
              No logs for the current batch yet. Click "Start Batch Harvest" to stream live download events.
            </div>
          ) : (
            filteredLogs.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-start gap-2 hover:bg-slate-900/60 p-0.5 rounded transition ${
                  entry.level === 'ratelimit'
                    ? 'text-amber-300/90'
                    : entry.level === 'success'
                    ? 'text-emerald-400 font-semibold'
                    : entry.level === 'zip'
                    ? 'text-cyan-300 font-bold'
                    : entry.level === 'warn'
                    ? 'text-rose-400 font-semibold'
                    : 'text-slate-300'
                }`}
              >
                <span className="text-slate-600 select-none flex-shrink-0">[{entry.timestamp}]</span>
                <span
                  className={`text-[9px] uppercase px-1 py-0.2 rounded font-bold flex-shrink-0 ${
                    entry.level === 'ratelimit'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : entry.level === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : entry.level === 'zip'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {entry.level}
                </span>
                <span className="break-all">{entry.message}</span>
              </div>
            ))
          )}
        </div>

        {/* Terminal Footer Bar */}
        <div className="bg-slate-900/60 border-t border-slate-800/80 px-4 py-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Google Drive API v3 Stream &bull; Rate Throttling Active</span>
          </div>
          <div>Batch Size: 50 files/ZIP</div>
        </div>
      </div>

      {/* 4. Ready Batch ZIPs Carousel */}
      {completedZips.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Completed 50-File ZIP Archives ({completedZips.length})
              </h4>
            </div>
            {completedZips.length > 1 && (
              <button
                onClick={onDownloadAllZips}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download All ({completedZips.length} ZIPs)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {completedZips.map((zip) => (
              <div
                key={zip.batchNumber}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-md"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-emerald-400">
                      Batch #{zip.batchNumber}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      (Files {zip.startIdx}–{zip.endIdx})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono truncate mt-0.5" title={zip.filename}>
                    {zip.filename}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {zip.totalFiles} files &bull; {zip.zipBlob ? `${(zip.zipBlob.size / (1024 * 1024)).toFixed(2)} MB` : ''}
                  </div>
                </div>

                <button
                  onClick={() => onDownloadZip(zip)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow transition flex-shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ZIP</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
