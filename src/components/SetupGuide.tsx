import React, { useState } from 'react';
import {
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Key,
  ShieldCheck,
  Server,
  FileCode,
  Terminal,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

export const SetupGuide: React.FC = () => {
  const [guideTab, setGuideTab] = useState<'oauth' | 'service_account' | 'troubleshoot'>('oauth');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Selector Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Google Cloud Credentials &amp; Setup Guide
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Follow these simple steps to obtain your <code className="text-amber-300">credentials.json</code> or <code className="text-amber-300">service_account.json</code> file from Google Cloud Console.
            </p>
          </div>

          {/* Guide Tabs */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setGuideTab('oauth')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                guideTab === 'oauth'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>OAuth 2.0 (Desktop)</span>
            </button>

            <button
              onClick={() => setGuideTab('service_account')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                guideTab === 'service_account'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Service Account</span>
            </button>

            <button
              onClick={() => setGuideTab('troubleshoot')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                guideTab === 'troubleshoot'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Troubleshooting</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guide Content: OAuth 2.0 */}
      {guideTab === 'oauth' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold border border-amber-500/30">
                  1
                </span>
                OAuth 2.0 Desktop Setup (Recommended)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Allows your Python script to prompt a browser login once, and securely save access in <code className="text-amber-300">token.json</code>.
              </p>
            </div>
            <a
              href="https://console.cloud.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium underline"
            >
              <span>Open Google Cloud Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1 */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-[11px] font-mono">1</span>
                Create Project &amp; Enable API
              </div>
              <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Log in to <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">Google Cloud Console</a>.</li>
                <li>Create a new project (e.g. <strong>"Invoice-Automation"</strong>).</li>
                <li>In search bar, type <strong>"Google Drive API"</strong>.</li>
                <li>Click <strong>Enable</strong> on the Google Drive API page.</li>
              </ol>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-[11px] font-mono">2</span>
                OAuth Consent Screen
              </div>
              <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Go to <strong>APIs &amp; Services &gt; OAuth consent screen</strong>.</li>
                <li>Select User Type: <strong>External</strong> (or Internal for Workspace).</li>
                <li>Fill App Name (e.g. <em>Invoice Harvester</em>) and your user email.</li>
                <li>
                  <strong className="text-amber-300">Crucial:</strong> Under <strong>Test users</strong>, click <em>+ Add Users</em> and enter your own Google email!
                </li>
              </ol>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-[11px] font-mono">3</span>
                Create OAuth Client ID
              </div>
              <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Go to <strong>APIs &amp; Services &gt; Credentials</strong>.</li>
                <li>Click <strong>+ CREATE CREDENTIALS &gt; OAuth client ID</strong>.</li>
                <li>Set Application type to: <strong className="text-amber-300">Desktop app</strong>.</li>
                <li>Click <strong>Create</strong>.</li>
              </ol>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-[11px] font-mono">4</span>
                Download credentials.json
              </div>
              <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Click the <strong>Download JSON</strong> icon next to your client ID.</li>
                <li>Rename the downloaded file to exactly: <code className="text-amber-300 font-mono">credentials.json</code>.</li>
                <li>Place it in the same directory as <code className="text-slate-200 font-mono">download_invoices.py</code>.</li>
              </ol>
            </div>
          </div>

          {/* Quick Terminal Verification */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Run the Script in Terminal</span>
              </div>
              <button
                onClick={() => handleCopy("pip install -r requirements.txt\npython3 download_invoices.py", "cmd-oauth")}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedKey === 'cmd-oauth' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'cmd-oauth' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="font-mono text-xs text-amber-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800 overflow-x-auto">
              pip install -r requirements.txt{'\n'}python3 download_invoices.py
            </pre>
          </div>
        </div>
      )}

      {/* Guide Content: Service Account */}
      {guideTab === 'service_account' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-amber-400" />
              Service Account Setup (Headless &amp; Cron Jobs)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Best for running on automated cloud servers, Docker containers, or recurring cron jobs with zero user interaction.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-400">Step 1: Create Service Account</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                In Google Cloud Console, navigate to <strong>IAM &amp; Admin &gt; Service Accounts</strong>. Click <strong>+ Create Service Account</strong>. Name it <code className="text-amber-300">invoice-downloader</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-400">Step 2: Generate JSON Key</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Click on the newly created service account, navigate to the <strong>Keys</strong> tab, click <strong>Add Key &gt; Create New Key &gt; JSON</strong>. Save this file as <code className="text-amber-300">service_account.json</code> in your project directory.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Step 3: IMPORTANT - Share Google Drive Folder with the Service Account
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Service Accounts have their own private empty drive. To allow it to see your invoices:
                <br />
                1. Copy the service account email (e.g. <code className="text-amber-300 font-mono text-[11px]">invoice-downloader@project-id.iam.gserviceaccount.com</code>).
                <br />
                2. Open your Google Drive in browser, right-click the folder containing your invoices, click <strong>Share</strong>, paste the service account email, and grant <strong>Viewer</strong> access!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Guide Content: Troubleshooting */}
      {guideTab === 'troubleshoot' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              Frequently Encountered Issues &amp; Fixes
            </h3>
          </div>

          <div className="space-y-4">
            {/* Issue 1 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                "Access blocked: App has not completed the Google verification process"
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Fix:</strong> When creating the OAuth Consent screen in Google Cloud Console, your app is in "Testing" mode. You MUST add your personal Google account email to the <strong>Test Users</strong> list under <em>OAuth consent screen &gt; Test users</em>.
              </p>
            </div>

            {/* Issue 2 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                "HttpError 403: The user has not granted the app read access"
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Fix:</strong> Your existing <code className="text-slate-200">token.json</code> might have been authorized with an older, insufficient scope. Delete the <code className="text-amber-300">token.json</code> file and run the script again to re-authenticate with the read-only Drive scope.
              </p>
            </div>

            {/* Issue 3 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-blue-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                "No files found even though invoices exist in Google Drive"
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Fix:</strong> Google Drive query <code className="text-slate-200">name contains 'invoice'</code> does prefix matching. If your files are named <code className="text-slate-200">INV-2024-01.pdf</code>, change the search term to <code className="text-amber-300">INV</code>, or leave the search term blank to scan all non-folder files and rely strictly on your regex!
              </p>
            </div>

            {/* Issue 4 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-purple-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                "Cannot download Google Sheets / Google Docs directly"
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Fix:</strong> Native Google Docs and Google Sheets do not have a raw binary file representation. The generated script automatically calls <code className="text-purple-300 font-mono">service.files().export_media()</code> to convert Sheets to Excel/PDF and Docs to PDF.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
