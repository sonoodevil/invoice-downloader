import { useState, useEffect } from 'react';
import { ScriptConfig } from './types';
import { Header, NavTab } from './components/Header';
import { ConfigPanel } from './components/ConfigPanel';
import { CodeViewer } from './components/CodeViewer';
import { RegexTester } from './components/RegexTester';
import { DriveSimulator } from './components/DriveSimulator';
import { SetupGuide } from './components/SetupGuide';
import { SheetBatchRunner } from './components/SheetBatchRunner';
import { SupplierMappingManager } from './components/SupplierMappingManager';
import { SupplierMapping, MASTER_SUPPLIER_MAPPINGS } from './data/supplierMappings';
import { generatePythonScript } from './utils/scriptGenerators';
import { Archive, FileCode, Shield, Download, FileSpreadsheet, ArrowRight, Building2 } from 'lucide-react';

const STORAGE_KEY_SUPPLIERS = 'gdrive_supplier_mappings_v1';

const DEFAULT_CONFIG: ScriptConfig = {
  authType: 'oauth',
  searchTerm: '',
  regexPattern: '^(\\d{6})\\s+(\\d+)(?:\\s+(.*?))?\\.pdf$',
  folderId: '',
  includeSharedDrives: true,
  includeSharedWithMe: true,
  resolveShortcuts: true,
  outputDir: './downloaded_invoices',
  organizeBy: 'flat',
  duplicateAction: 'skip',
  exportGoogleWorkspace: true,
  maxFiles: 0,
  chunkSizeMB: 5,
  enableLogging: true,
  enableDryRun: false,
  exportSheetsFormat: 'xlsx',
  batchSize: 50,
  sheetFilePath: 'invoices_input.xlsx',
  rateLimitDelaySec: 1.0,
  enableJitter: true,
  resumeModeEnabled: false,
  lastSuccessfulInvoiceId: '',
  folderStructure: 'supplier_only',
};

export default function App() {
  const [config, setConfig] = useState<ScriptConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<NavTab>('direct_runner');
  const [copied, setCopied] = useState(false);

  // Supplier mappings state with localStorage persistence
  const [supplierMappings, setSupplierMappings] = useState<SupplierMapping[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUPPLIERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to read saved supplier mappings, using defaults.', e);
    }
    return MASTER_SUPPLIER_MAPPINGS;
  });

  const handleUpdateMappings = (newMappings: SupplierMapping[]) => {
    setSupplierMappings(newMappings);
    try {
      localStorage.setItem(STORAGE_KEY_SUPPLIERS, JSON.stringify(newMappings));
    } catch (e) {
      console.warn('Failed to save supplier mappings to localStorage', e);
    }
  };

  const handleConfigChange = (updated: Partial<ScriptConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPythonScript = () => {
    const script = generatePythonScript(config, supplierMappings);
    handleDownloadFile('batch_download_invoices_zip.py', script);
  };

  const handleCopyScript = () => {
    const script = generatePythonScript(config, supplierMappings);
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadPy={handleDownloadPythonScript}
        onCopyScript={handleCopyScript}
        copied={copied}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Quick Highlights Bar */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Google Drive Invoice Harvester &bull; Supplier Folder Matcher &bull; 50/ZIP
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                  {supplierMappings.length} Normalized Suppliers
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Format: <code className="text-amber-300 font-semibold">YYMMDD &lt;digits&gt; [ref].pdf</code> (e.g. <code className="text-amber-300">260403 489201.pdf</code> &bull; NO DASH, strictly spaces only). Invoices packaged in each supplier's folder!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setActiveTab('suppliers')}
              className="text-xs text-purple-300 hover:text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Supplier Folders ({supplierMappings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className="text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>View Script</span>
            </button>
            <button
              onClick={handleDownloadPythonScript}
              className="text-xs text-slate-950 bg-amber-500 hover:bg-amber-400 font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .py</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Direct In-App Sheet Runner (50/ZIP) */}
        {activeTab === 'direct_runner' && (
          <SheetBatchRunner
            supplierMappings={supplierMappings}
            onOpenSupplierManager={() => setActiveTab('suppliers')}
          />
        )}

        {/* Tab 2: Supplier Normalization Directory */}
        {activeTab === 'suppliers' && (
          <SupplierMappingManager
            mappings={supplierMappings}
            onUpdateMappings={handleUpdateMappings}
          />
        )}

        {/* Tab 3: Script Generator Studio */}
        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-6">
              <ConfigPanel
                config={config}
                onChange={handleConfigChange}
                onReset={handleReset}
              />
            </div>
            <div className="lg:col-span-7">
              <CodeViewer
                config={config}
                supplierMappings={supplierMappings}
                onDownloadFile={handleDownloadFile}
              />
            </div>
          </div>
        )}

        {/* Tab 4: Regex & Pattern Tester */}
        {activeTab === 'tester' && (
          <RegexTester
            currentPattern={config.regexPattern}
            onApplyPattern={(pattern) => {
              handleConfigChange({ regexPattern: pattern });
              setActiveTab('generator');
            }}
          />
        )}

        {/* Tab 5: Drive Scanner Simulator */}
        {activeTab === 'simulator' && (
          <DriveSimulator
            config={config}
            onDownloadFile={handleDownloadFile}
          />
        )}

        {/* Tab 6: Step-by-Step GCP Guide */}
        {activeTab === 'guide' && <SetupGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GDrive Invoice Batcher &bull; Format: YYMMDD &lt;digits&gt; [reference].pdf</span>
          <span className="text-slate-600">Strictly spaces only &bull; Invoices matched within supplier Drive folders</span>
        </div>
      </footer>
    </div>
  );
}
