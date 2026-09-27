import { useState } from 'react';
import { SheetBatchRunner } from './components/SheetBatchRunner';
import { Archive } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-white">
      {/* Streamlined, Clean Title Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/10 border border-amber-400/20">
                <Archive className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Google Drive Invoice ZIP Downloader
                </h1>
                <p className="text-xs text-slate-400">
                  Import sheet, match files, and download flat invoice PDF ZIPs instantly
                </p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                ★ Drive Ready (Read-Only)
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Runner Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <SheetBatchRunner />
      </main>

      {/* Simplified Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Google Drive Invoice ZIP Downloader &bull; Standard Format: YYMMDD &lt;digits&gt; [reference].pdf</span>
          <span className="text-slate-600">&copy; 2026 &bull; Secure Client-Side Harvesting</span>
        </div>
      </footer>
    </div>
  );
}
