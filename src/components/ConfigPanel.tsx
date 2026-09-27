import React from 'react';
import {
  Key,
  Folder,
  Search,
  Filter,
  Layers,
  FileCheck,
  Shield,
  RotateCcw,
  Sparkles,
  Info,
  Share2,
  FolderSymlink
} from 'lucide-react';
import { ScriptConfig, AuthType, OrganizeStrategy, DuplicateStrategy } from '../types';
import { REGEX_PRESETS } from '../data/mockData';

interface ConfigPanelProps {
  config: ScriptConfig;
  onChange: (updated: Partial<ScriptConfig>) => void;
  onReset: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange, onReset }) => {
  const handleFolderIdChange = (value: string) => {
    const match = value.match(/folders\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      onChange({ folderId: match[1] });
    } else {
      onChange({ folderId: value });
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-400" />
            Script Configuration
          </h2>
          <p className="text-xs text-slate-400">
            Customize parameters and live-generate your Python script
          </p>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition"
          title="Reset to default settings"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Authentication Method */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5 text-amber-400" />
          Authentication Flow
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              id: 'oauth',
              name: 'OAuth 2.0 (Desktop)',
              desc: 'Browser popup login with credentials.json. Best for personal/work user accounts.',
            },
            {
              id: 'service_account',
              name: 'Service Account',
              desc: 'Uses service_account.json. Best for background cron jobs, servers & CI/CD.',
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange({ authType: item.id as AuthType })}
              className={`p-3 rounded-xl text-left border transition ${
                config.authType === item.id
                  ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-sm ring-1 ring-amber-500/30'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-950/70'
              }`}
            >
              <div className="text-xs font-bold text-amber-300">{item.name}</div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {item.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Google Drive Locations (My Drive, Shared with Me, Shortcuts, Shared Drives) */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Folder className="w-3.5 h-3.5 text-amber-400" />
          Search Locations &amp; Sources
        </label>

        <div className="space-y-2.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.includeSharedWithMe}
              onChange={(e) => onChange({ includeSharedWithMe: e.target.checked })}
              className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-xs text-blue-300 font-medium flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              Include "Shared with me" files (<code className="text-slate-400 text-[10px]">sharedWithMe = true</code>)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.resolveShortcuts}
              onChange={(e) => onChange({ resolveShortcuts: e.target.checked })}
              className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-xs text-purple-300 font-medium flex items-center gap-1.5">
              <FolderSymlink className="w-3.5 h-3.5" />
              Search inside Shortcut Folders (<code className="text-slate-400 text-[10px]">targetId</code> resolution)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.includeSharedDrives}
              onChange={(e) => onChange({ includeSharedDrives: e.target.checked })}
              className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5" />
              Include Shared Drives / Team Drives (<code className="text-slate-400 text-[10px]">supportsAllDrives=True</code>)
            </span>
          </label>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">
            Target Drive Folder ID (Optional, leave blank to search all)
          </label>
          <input
            type="text"
            value={config.folderId}
            onChange={(e) => handleFolderIdChange(e.target.value)}
            placeholder="Entire Drive &amp; Shared Files"
            className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>
      </div>

      {/* 3. Input Spreadsheet & Batch Size */}
      <div className="space-y-4 pt-2 border-t border-slate-800/80">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">
              Input Sheet Path
            </label>
            <input
              type="text"
              value={config.sheetFilePath}
              onChange={(e) => onChange({ sheetFilePath: e.target.value })}
              placeholder="invoices_input.xlsx"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">
              Files per ZIP Batch
            </label>
            <input
              type="number"
              min="1"
              max="500"
              value={config.batchSize}
              onChange={(e) => onChange({ batchSize: parseInt(e.target.value) || 50 })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1">
            Local Output Folder
          </label>
          <input
            type="text"
            value={config.outputDir}
            onChange={(e) => onChange({ outputDir: e.target.value })}
            placeholder="./downloaded_invoices"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1">
            Folder Organization Structure (in ZIP/Output)
          </label>
          <select
            value={config.folderStructure}
            onChange={(e) => onChange({ folderStructure: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 focus:outline-none focus:border-amber-500 font-sans cursor-pointer"
          >
            <option value="supplier_only">Supplier Name only (e.g. "Supplier/260403 489201.pdf")</option>
            <option value="flat">Flat (No subfolders) (e.g. "260403 489201.pdf")</option>
            <option value="date_only">Date Folder only (e.g. "2026-04-03/260403 489201.pdf")</option>
            <option value="doctype_only">Document Type Folder only (e.g. "Invoices/260403 489201.pdf")</option>
            <option value="supplier_date_doctype">Supplier / Date / Document Type</option>
            <option value="date_supplier_doctype">Date / Supplier / Document Type</option>
            <option value="doctype_supplier_date">Document Type / Supplier / Date</option>
            <option value="doctype_date_supplier">Document Type / Date / Supplier</option>
          </select>
        </div>
      </div>

      {/* 4. Rate Limiter & Throttle Protection */}
      <div className="space-y-4 pt-2 border-t border-slate-800/80">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              API Rate Limiter Configuration
            </label>
            <span className="text-[11px] font-mono text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {config.rateLimitDelaySec.toFixed(1)}s delay
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
            Adds a controlled pause (<code className="text-amber-300">time.sleep</code>) between file downloads to avoid triggering Google Drive's HTTP 429 'User Rate Limit Exceeded' quota limits.
          </p>

          {/* Slider & Presets */}
          <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={config.rateLimitDelaySec}
                onChange={(e) => onChange({ rateLimitDelaySec: parseFloat(e.target.value) || 0 })}
                className="flex-1 accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-300 w-12 text-right">
                {config.rateLimitDelaySec.toFixed(1)}s
              </span>
            </div>

            {/* Quick Preset Buttons */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[
                { label: '0s (Burst)', val: 0 },
                { label: '0.5s (Fast)', val: 0.5 },
                { label: '1.0s (Rec)', val: 1.0 },
                { label: '2.5s (Safe)', val: 2.5 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onChange({ rateLimitDelaySec: preset.val })}
                  className={`py-1 px-1.5 rounded-lg text-[10px] font-mono text-center border transition ${
                    Math.abs(config.rateLimitDelaySec - preset.val) < 0.05
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.enableJitter}
                  onChange={(e) => onChange({ enableJitter: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-[11px] text-slate-300">
                  Randomize delay ±15% (Jitter) to prevent synchronized bursts
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
