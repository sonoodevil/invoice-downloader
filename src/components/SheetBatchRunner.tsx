import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Plus,
  Search,
  FileUp,
  FolderOpen
} from 'lucide-react';

interface SheetInvoiceRow {
  id: string;
  supplierName: string;
  invoiceNumber: string;
  reference?: string;
  matchedFile?: string;
  fileSize?: string;
  realFile?: File; // Store the actual uploaded PDF file
}

export const SheetBatchRunner: React.FC = () => {
  const [rows, setRows] = useState<SheetInvoiceRow[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [tableSearchQuery, setTableSearchQuery] = useState<string>('');
  const [isZipping, setIsZipping] = useState(false);

  // Manual input fields for adding rows
  const [manualSupplier, setManualSupplier] = useState('');
  const [manualInvoice, setManualInvoice] = useState('');
  const [manualRef, setManualRef] = useState('');

  // Extract digits only from an invoice string
  const getInvoiceDigits = (val: any): string => {
    if (val === undefined || val === null) return '';
    return String(val).replace(/\D/g, '');
  };

  // Convert bytes to a readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper to re-evaluate matches whenever spreadsheet rows or raw PDF files change
  const updateMatches = (spreadsheetRows: SheetInvoiceRow[], pdfFiles: File[]): SheetInvoiceRow[] => {
    return spreadsheetRows.map((row) => {
      // Look for a PDF file that contains the invoice number in its name
      const matched = pdfFiles.find((f) => {
        const nameLower = f.name.toLowerCase();
        const invStr = row.invoiceNumber;
        return nameLower.endsWith('.pdf') && nameLower.includes(invStr);
      });

      if (matched) {
        return {
          ...row,
          matchedFile: matched.name,
          fileSize: formatFileSize(matched.size),
          realFile: matched,
        };
      } else {
        return {
          ...row,
          matchedFile: undefined,
          fileSize: undefined,
          realFile: undefined,
        };
      }
    });
  };

  // Unified File Input Handler: Accepts PDF files and/or Spreadsheet files
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const pdfs = fileList.filter((f) => f.name.toLowerCase().endsWith('.pdf'));
    const sheets = fileList.filter((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return ext && ['xlsx', 'xls', 'csv'].includes(ext);
    });

    // Update state lists
    const updatedPdfs = [...uploadedFiles, ...pdfs];
    setUploadedFiles(updatedPdfs);

    if (sheets.length > 0) {
      const targetSheet = sheets[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = evt.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          if (!workbook.SheetNames || workbook.SheetNames.length === 0) return;

          const sheetName = workbook.SheetNames[0];
          const rawJson: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

          if (!rawJson.length) return;

          const firstRow = rawJson[0];
          const cols = Object.keys(firstRow);

          const supplierCol = cols.find((c) => /supplier|vendor|company|party|client/i.test(c)) || cols[0];
          const invCol = cols.find((c) => /invoice|inv|number|digit|bill|inv\s*no/i.test(c));
          const refCol = cols.find((c) => /ref|reference|po|order|purchase/i.test(c));

          if (!invCol) {
            alert(`Could not detect Invoice Number column. Found columns: [${cols.join(', ')}]`);
            return;
          }

          const parsedRows: SheetInvoiceRow[] = [];
          rawJson.forEach((row, idx) => {
            const supplier = String(row[supplierCol] || 'Unknown').trim();
            const digits = getInvoiceDigits(row[invCol]);

            if (digits) {
              const rawRef = refCol ? String(row[refCol]).trim() : undefined;
              parsedRows.push({
                id: `row-${Date.now()}-${idx}`,
                supplierName: supplier,
                invoiceNumber: digits,
                reference: rawRef || undefined,
              });
            }
          });

          // Match up immediately with any already uploaded or newly uploaded PDFs
          const completeRows = updateMatches(parsedRows, updatedPdfs);
          setRows(completeRows);
        } catch (err: any) {
          alert(`Error reading sheet: ${err.message || err}`);
        }
      };
      reader.readAsBinaryString(targetSheet);
    } else {
      // If only PDFs were uploaded, refresh matches with current rows
      setRows((prev) => updateMatches(prev, updatedPdfs));
    }

    // Reset input value to allow uploading same file again
    e.target.value = '';
  };

  // Add an invoice record manually
  const handleAddManualRow = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInv = getInvoiceDigits(manualInvoice);
    if (!manualSupplier.trim() || !cleanInv) return;

    const newRow: SheetInvoiceRow = {
      id: `row-${Date.now()}`,
      supplierName: manualSupplier.trim(),
      invoiceNumber: cleanInv,
      reference: manualRef.trim() || undefined,
    };

    const newRows = [newRow, ...rows];
    setRows(updateMatches(newRows, uploadedFiles));
    setManualSupplier('');
    setManualInvoice('');
    setManualRef('');
  };

  // Remove a PDF from upload queue
  const handleRemovePdf = (fileToRemove: File) => {
    const updated = uploadedFiles.filter((f) => f !== fileToRemove);
    setUploadedFiles(updated);
    setRows((prev) => updateMatches(prev, updated));
  };

  // Download ZIP with strictly unmodified real files at the ROOT (no subfolders)
  const handleDownloadFlatZip = async () => {
    const matches = rows.filter((r) => r.realFile !== undefined);
    if (matches.length === 0) {
      alert('No matched PDF files found to package into a ZIP archive.');
      return;
    }

    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Package real, unmodified files exactly as they are directly into the zip root
      matches.forEach((row) => {
        if (row.realFile) {
          zip.file(row.realFile.name, row.realFile);
        }
      });

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `matched_invoices_flat_archive_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Error generating ZIP: ${err.message || err}`);
    } finally {
      setIsZipping(false);
    }
  };

  // Clear everything
  const handleClearAll = () => {
    setRows([]);
    setUploadedFiles([]);
    setTableSearchQuery('');
  };

  // Filter based on search query
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (tableSearchQuery.trim()) {
        const q = tableSearchQuery.trim().toLowerCase();
        const matchesInv = r.invoiceNumber.toLowerCase().includes(q);
        const matchesSupplier = r.supplierName.toLowerCase().includes(q);
        const matchesRef = (r.reference || '').toLowerCase().includes(q);
        const matchesFile = (r.matchedFile || '').toLowerCase().includes(q);
        return matchesInv || matchesSupplier || matchesRef || matchesFile;
      }
      return true;
    });
  }, [rows, tableSearchQuery]);

  // Statistics
  const totalInvoices = rows.length;
  const matchedInvoices = rows.filter((r) => r.realFile !== undefined).length;
  const missingInvoices = totalInvoices - matchedInvoices;

  return (
    <div className="space-y-6">
      
      {/* 1. Unified Upload Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-amber-400" />
              <span>Spreadsheet &amp; Real PDF Matcher</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select your Excel/CSV sheet along with your real PDF files. The app matches them locally without storing or sending your files anywhere.
            </p>
          </div>

          {(rows.length > 0 || uploadedFiles.length > 0) && (
            <button
              onClick={handleClearAll}
              className="text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-3.5 py-2 rounded-xl border border-rose-500/30 transition flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Everything</span>
            </button>
          )}
        </div>

        {/* Drag and Drop Zone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Spreadsheet Upload */}
          <label className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 bg-slate-950/40 cursor-pointer transition-all group text-center">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:scale-105 transition-all">
              <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Select Invoice Sheet (.xlsx / .csv)</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Supplier Name &amp; Invoice columns required</p>
            </div>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelection}
              className="hidden"
            />
          </label>

          {/* Real PDF Upload */}
          <label className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 bg-slate-950/40 cursor-pointer transition-all group text-center">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:scale-105 transition-all">
              <FileUp className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Select/Drop Real PDF Files</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Supports multi-select or drag whole folders</p>
            </div>
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileSelection}
              className="hidden"
            />
          </label>

        </div>
      </div>

      {/* 2. PDF Upload Queue / Tracker Panel */}
      {uploadedFiles.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Loaded Real PDF Files Queue ({uploadedFiles.length})</span>
            </h3>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
              Direct Local Files
            </span>
          </div>

          <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto p-1 bg-slate-950/40 rounded-xl border border-slate-800/80">
            {uploadedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 hover:border-slate-700 transition"
              >
                <span className="truncate max-w-[160px]" title={file.name}>
                  {file.name}
                </span>
                <span className="text-slate-500">({formatFileSize(file.size)})</span>
                <button
                  type="button"
                  onClick={() => handleRemovePdf(file)}
                  className="text-rose-400 hover:text-rose-300 ml-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Real Matching Statistics & Core Actions */}
      {rows.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Stats Bar */}
          <div className="md:col-span-12 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
            <div className="flex flex-wrap items-center gap-4">
              <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center shrink-0">
                <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total in Sheet</span>
                <span className="text-lg font-extrabold text-white font-mono">{totalInvoices}</span>
              </div>

              <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center shrink-0">
                <span className="block text-[10px] text-emerald-500 uppercase font-bold tracking-wider">Matched PDFs</span>
                <span className="text-lg font-extrabold text-emerald-400 font-mono">{matchedInvoices}</span>
              </div>

              <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center shrink-0">
                <span className="block text-[10px] text-rose-500 uppercase font-bold tracking-wider">Missing PDFs</span>
                <span className="text-lg font-extrabold text-rose-400 font-mono">{missingInvoices}</span>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <button
                onClick={handleDownloadFlatZip}
                disabled={isZipping || matchedInvoices === 0}
                className="w-full md:w-auto bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 transition transform active:scale-95 cursor-pointer"
              >
                {isZipping ? (
                  <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                ) : (
                  <Download className="w-4.5 h-4.5 stroke-[2.5]" />
                )}
                <span>Download Matched Real PDFs ZIP (Flat Root)</span>
              </button>
            </div>
          </div>

          {/* Matching Table */}
          <div className="md:col-span-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tableSearchQuery}
                  onChange={(e) => setTableSearchQuery(e.target.value)}
                  placeholder="Search table rows..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Showing {filteredRows.length} rows
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-800/60 rounded-xl bg-slate-950/40 max-h-[400px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold sticky top-0 border-b border-slate-800/85 z-10 text-[9px]">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Supplier Name</th>
                    <th className="py-3 px-4">Invoice Number</th>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Matched Filename (No folders in ZIP)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 font-mono text-[11px]">
                  {filteredRows.map((row, idx) => {
                    const isMatched = row.realFile !== undefined;
                    return (
                      <tr key={row.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="py-3 px-4 text-slate-500 font-sans">{idx + 1}</td>
                        <td className="py-3 px-4 font-sans font-bold text-slate-200">{row.supplierName}</td>
                        <td className="py-3 px-4 text-amber-300 font-bold">{row.invoiceNumber}</td>
                        <td className="py-3 px-4 text-slate-400">{row.reference || '-'}</td>
                        <td className="py-3 px-4 text-slate-300">
                          {isMatched ? (
                            <span className="text-emerald-400">{row.matchedFile}</span>
                          ) : (
                            <span className="text-slate-600">Waiting for PDF upload...</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {isMatched ? (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                              Matched ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold">
                              Missing File
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isMatched && row.realFile ? (
                            <button
                              onClick={() => {
                                if (row.realFile) {
                                  const url = URL.createObjectURL(row.realFile);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = row.realFile.name;
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                  URL.revokeObjectURL(url);
                                }
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition text-[10px] flex items-center gap-1 ml-auto cursor-pointer font-sans"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-600">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. Manual Entry Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Invoice Record Manually</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Add rows directly to the table list to match against your loaded PDF files.
          </p>
        </div>

        <form onSubmit={handleAddManualRow} className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 items-end">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Supplier Name
            </label>
            <input
              type="text"
              required
              value={manualSupplier}
              onChange={(e) => setManualSupplier(e.target.value)}
              placeholder="e.g. Screwfix"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Invoice Number
            </label>
            <input
              type="text"
              required
              value={manualInvoice}
              onChange={(e) => setManualInvoice(e.target.value)}
              placeholder="e.g. 57813"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Reference (Optional)
            </label>
            <input
              type="text"
              value={manualRef}
              onChange={(e) => setManualRef(e.target.value)}
              placeholder="e.g. REF100"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs py-2.5 rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer h-[38px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </form>
      </div>

      {/* Empty State when no data is loaded */}
      {rows.length === 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800/80 mx-auto">
            <FileSpreadsheet className="w-8 h-8 text-slate-500" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-200">No data loaded yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Upload your spreadsheet and drag/select your real invoice PDF files to start matching. No processing is done online; everything stays safe on your device.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
