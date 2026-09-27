import React, { useState, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import {
  Upload,
  FileSpreadsheet,
  Play,
  Archive,
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  Sparkles,
  FileText,
  Terminal,
  HelpCircle,
  Share2,
  FolderSymlink,
  Clock,
  Shield,
  X,
  FileWarning,
  Save,
  Check,
  Building2,
  FolderTree,
  Folder
} from 'lucide-react';
import { SheetInvoiceRow, BatchZipItem, SessionAuditRecord, FolderStructureType } from '../types';
import { BatchDashboard, BatchLogEntry } from './BatchDashboard';
import { SupplierMapping, MASTER_SUPPLIER_MAPPINGS, resolveSupplier } from '../data/supplierMappings';
import {
  extractInvoiceDigitsOnly,
  sanitizeReferenceString,
  sanitizeDateDigits,
  buildStrictInvoiceFilename,
  sanitizeSupplierFolderName,
  parseAndValidateInvoiceFilename,
  buildNestedFolderPath
} from '../utils/invoiceFormatting';

export interface FileValidationState {
  status: 'idle' | 'success' | 'error';
  fileName?: string;
  fileSize?: string;
  errorTitle?: string;
  errorMessage?: string;
  errorDetails?: string[];
  successMessage?: string;
}

export interface SheetBatchRunnerProps {
  supplierMappings?: SupplierMapping[];
  onOpenSupplierManager?: () => void;
}

// Pre-generated realistic dataset using the master hardcoded supplier list
const SAMPLE_SHEET_DATA: { supplier: string; inv: string; source: 'my_drive' | 'shared_with_me' | 'shortcut_folder' }[] = [
  { supplier: 'Screwfix Direct Ltd', inv: '489201', source: 'my_drive' },
  { supplier: 'BLANCO', inv: '102948', source: 'shared_with_me' },
  { supplier: 'Toolstation Ltd', inv: '948102', source: 'shortcut_folder' },
  { supplier: 'City Plumbing', inv: '302914', source: 'my_drive' },
  { supplier: 'Wolseley UK Limited', inv: '773190', source: 'shared_with_me' },
  { supplier: 'Travis Perkins', inv: '551920', source: 'shortcut_folder' },
  { supplier: 'Delabie UK Ltd', inv: '661840', source: 'my_drive' },
  { supplier: 'Amazon UK', inv: '882019', source: 'shared_with_me' },
  { supplier: 'Vodafone Limited', inv: '119283', source: 'shortcut_folder' },
  { supplier: 'B&Q', inv: '440192', source: 'my_drive' },
  { supplier: 'Tile Mountain', inv: '992810', source: 'shared_with_me' },
  { supplier: 'Eastbrook', inv: '771029', source: 'shortcut_folder' },
  { supplier: 'Barwick', inv: '331092', source: 'my_drive' },
  { supplier: 'Roper Rhodes Ltd', inv: '884912', source: 'shared_with_me' },
  { supplier: 'Thomas Dudley Ltd / Tyde', inv: '229104', source: 'shortcut_folder' },
  { supplier: 'Frontline Bathrooms Ltd', inv: '550192', source: 'my_drive' },
  { supplier: 'Kite Packaging', inv: '772910', source: 'shared_with_me' },
  { supplier: 'Lawton Tube', inv: '441920', source: 'shortcut_folder' },
  { supplier: 'FW Hipkin Ltd', inv: '662019', source: 'my_drive' },
  { supplier: 'Sanica Building Materials Limited', inv: '881029', source: 'shared_with_me' },
  { supplier: 'Reginox UK Ltd', inv: '339102', source: 'shortcut_folder' },
  { supplier: 'QX Bathroom Products', inv: '994012', source: 'my_drive' },
  { supplier: 'Primaflow / F&P', inv: '118290', source: 'shared_with_me' },
  { supplier: 'Reina', inv: '553910', source: 'shortcut_folder' },
  { supplier: 'Tavistock', inv: '228190', source: 'my_drive' },
  { supplier: 'BES', inv: '774019', source: 'shared_with_me' },
  { supplier: 'Ariston U.K. Ltd', inv: '338192', source: 'shortcut_folder' },
  { supplier: 'BSH Home Appliances Ltd', inv: '664019', source: 'my_drive' },
  { supplier: 'Circle Waste', inv: '883910', source: 'shared_with_me' },
  { supplier: 'Croydex', inv: '448190', source: 'shortcut_folder' },
  { supplier: 'E.On Energy Solutions Limited', inv: '991028', source: 'my_drive' },
  { supplier: 'Electricpoint', inv: '227190', source: 'shared_with_me' },
  { supplier: 'Enva', inv: '552910', source: 'shortcut_folder' },
  { supplier: 'Fast Freight Forward', inv: '775019', source: 'my_drive' },
  { supplier: 'Faucets Ltd', inv: '337190', source: 'shared_with_me' },
  { supplier: 'G4S Secure Solutions (UK) Limited', inv: '663019', source: 'shortcut_folder' },
  { supplier: 'Gledhill Building Products Ltd', inv: '885019', source: 'my_drive' },
  { supplier: 'Hyco', inv: '447190', source: 'shared_with_me' },
  { supplier: 'Just Radiators', inv: '993019', source: 'shortcut_folder' },
  { supplier: 'Kartell Uk Ltd', inv: '226190', source: 'my_drive' },
  { supplier: 'Matki Plc', inv: '554019', source: 'shared_with_me' },
  { supplier: 'Metal Store', inv: '776019', source: 'shortcut_folder' },
  { supplier: 'Michael Pavis Limited', inv: '336190', source: 'my_drive' },
  { supplier: 'Microsoft', inv: '665019', source: 'shared_with_me' },
  { supplier: 'Parcel Force', inv: '886019', source: 'shortcut_folder' },
  { supplier: 'Plumb Nation', inv: '446190', source: 'my_drive' },
  { supplier: 'Plumbing Super Store', inv: '995019', source: 'shared_with_me' },
  { supplier: 'Radiator Outlet', inv: '225190', source: 'shortcut_folder' },
  { supplier: 'Samsung', inv: '555019', source: 'my_drive' },
  { supplier: 'Smith Brothers Stores Ltd', inv: '777019', source: 'shared_with_me' },
  // Batch 2 items (51 to 100)
  { supplier: 'Sterling', inv: '335190', source: 'shortcut_folder' },
  { supplier: 'Water Plus', inv: '666019', source: 'my_drive' },
  { supplier: 'Worldpay UK Limited', inv: '887019', source: 'shared_with_me' },
  { supplier: '1&1 Ionos', inv: '445190', source: 'shortcut_folder' },
  { supplier: 'AMP Electrical Supplies Ltd', inv: '996019', source: 'my_drive' },
  { supplier: 'Ace Fire Midlands Ltd', inv: '224190', source: 'shared_with_me' },
  { supplier: 'Alert Electrical Wholesalers Ltd', inv: '556019', source: 'shortcut_folder' },
  { supplier: 'Ambiance Bain', inv: '778019', source: 'my_drive' },
  { supplier: 'Anchor Pumps', inv: '334190', source: 'shared_with_me' },
  { supplier: 'Bathroom Mountain', inv: '667019', source: 'shortcut_folder' },
  { supplier: 'Biasi Comfort Generation', inv: '888019', source: 'my_drive' },
  { supplier: 'C K Fires Limited', inv: '444190', source: 'shared_with_me' },
  { supplier: 'CHEM UK LTD', inv: '997019', source: 'shortcut_folder' },
  { supplier: 'City Plumbing', inv: '223190', source: 'my_drive' },
  { supplier: 'Croydex', inv: '557019', source: 'shared_with_me' },
  { supplier: 'Cubralco', inv: '779019', source: 'shortcut_folder' },
  { supplier: 'Dachser Limited', inv: '333190', source: 'my_drive' },
  { supplier: 'Dell Factor Ltd', inv: '668019', source: 'shared_with_me' },
  { supplier: 'Demsun Uk Ltd', inv: '889019', source: 'shortcut_folder' },
  { supplier: 'Ebay', inv: '443190', source: 'my_drive' },
  { supplier: 'Electrorad UK Ltd', inv: '998019', source: 'shared_with_me' },
  { supplier: 'Element4', inv: '222190', source: 'shortcut_folder' },
  { supplier: 'Ellsi Limited', inv: '558019', source: 'my_drive' },
  { supplier: 'Euro Bathrooms Ltd', inv: '770019', source: 'shared_with_me' },
  { supplier: 'FM Products Ltd', inv: '332190', source: 'shortcut_folder' },
  { supplier: 'Farmiloe', inv: '669019', source: 'my_drive' },
  { supplier: 'Flocon Valves & Fittings Ltd', inv: '880019', source: 'shared_with_me' },
  { supplier: 'Focal Point Fires', inv: '442190', source: 'shortcut_folder' },
  { supplier: 'Gazco Limited', inv: '999019', source: 'my_drive' },
  { supplier: 'GS1 UK', inv: '221190', source: 'shared_with_me' },
  { supplier: 'Harrison Bathrooms Ltd', inv: '559019', source: 'shortcut_folder' },
  { supplier: 'Hetta Systems UK', inv: '771119', source: 'my_drive' },
  { supplier: 'IntCeram Limited', inv: '331190', source: 'shared_with_me' },
  { supplier: 'Just Taps Plus', inv: '660119', source: 'shortcut_folder' },
  { supplier: 'KDK Bathroom Ware Ltd', inv: '881119', source: 'my_drive' },
  { supplier: 'Krobahn Ltd', inv: '441190', source: 'shared_with_me' },
  { supplier: 'L & M Heating Supplies Ltd', inv: '991119', source: 'shortcut_folder' },
  { supplier: 'MHS Radiators Limited', inv: '220190', source: 'my_drive' },
  { supplier: 'Mano Mano', inv: '550119', source: 'shared_with_me' },
  { supplier: 'Monster Plumb Limited', inv: '772219', source: 'shortcut_folder' },
  { supplier: 'N & C Building Products Ltd', inv: '330190', source: 'my_drive' },
  { supplier: 'NMBS', inv: '662219', source: 'shared_with_me' },
  { supplier: 'Northern Sink Supplies Ltd', inv: '882219', source: 'shortcut_folder' },
  { supplier: 'Oadby Plastics Limited', inv: '440190', source: 'my_drive' },
  { supplier: 'Parcel Hero', inv: '992219', source: 'shared_with_me' },
  { supplier: 'Pitacs', inv: '229990', source: 'shortcut_folder' },
  { supplier: 'Plastic Pipe Shop', inv: '552219', source: 'my_drive' },
  { supplier: 'Plumbworld', inv: '773319', source: 'shared_with_me' },
  { supplier: 'Prime Tools', inv: '339990', source: 'shortcut_folder' },
  { supplier: 'Rems Uk Ltd', inv: '663319', source: 'my_drive' },
  // Batch 3 items (101 to 115)
  { supplier: 'Screwfix Direct Ltd', inv: '883319', source: 'shared_with_me' },
  { supplier: 'BLANCO', inv: '449990', source: 'shortcut_folder' },
  { supplier: 'Toolstation Ltd', inv: '993319', source: 'my_drive' },
  { supplier: 'City Plumbing', inv: '228880', source: 'shared_with_me' },
  { supplier: 'Wolseley UK Limited', inv: '553319', source: 'shortcut_folder' },
  { supplier: 'Travis Perkins', inv: '774419', source: 'my_drive' },
  { supplier: 'Delabie UK Ltd', inv: '338880', source: 'shared_with_me' },
  { supplier: 'Amazon UK', inv: '664419', source: 'shortcut_folder' },
  { supplier: 'Vodafone Limited', inv: '884419', source: 'my_drive' },
  { supplier: 'Tile Mountain', inv: '448880', source: 'shared_with_me' },
  { supplier: 'Thomas Dudley Ltd / Tyde', inv: '994419', source: 'shortcut_folder' },
  { supplier: 'Frontline Bathrooms Ltd', inv: '227770', source: 'my_drive' },
  { supplier: 'Kite Packaging', inv: '554419', source: 'shared_with_me' },
  { supplier: 'Lawton Tube', inv: '775519', source: 'shortcut_folder' },
  { supplier: 'FW Hipkin Ltd', inv: '337770', source: 'my_drive' },
];

export const SheetBatchRunner: React.FC<SheetBatchRunnerProps> = ({
  supplierMappings = MASTER_SUPPLIER_MAPPINGS,
  onOpenSupplierManager,
}) => {
  const [searchSharedWithMe, setSearchSharedWithMe] = useState(true);
  const [resolveShortcuts, setResolveShortcuts] = useState(true);
  const [rateLimitDelaySec, setRateLimitDelaySec] = useState<number>(0.5);
  const [folderStructure, setFolderStructure] = useState<FolderStructureType>('supplier_only');

  // Resume / Session Recovery States
  const [resumeModeEnabled, setResumeModeEnabled] = useState(false);
  const [lastSuccessfulInvoiceId, setLastSuccessfulInvoiceId] = useState('');

  const [rows, setRows] = useState<SheetInvoiceRow[]>(() =>
    SAMPLE_SHEET_DATA.map((item, idx) => {
      // YYMMDD (6 digits, e.g. 260403 for 2026-04-03)
      const yy = '26';
      const mm = String(1 + (idx % 12)).padStart(2, '0');
      const dd = String(1 + (idx % 28)).padStart(2, '0');
      const dateYYMMDD = `${yy}${mm}${dd}`;
      const hasRef = idx % 2 === 0;
      const cleanRef = hasRef ? `REF${1000 + idx}` : undefined;
      const digitsOnly = extractInvoiceDigitsOnly(item.inv);
      const filename = buildStrictInvoiceFilename(dateYYMMDD, digitsOnly, cleanRef);
      const resolved = resolveSupplier(item.supplier, supplierMappings);
      const driveFolder = resolved.canonicalName || item.supplier;

      return {
        id: `row-${idx + 1}`,
        supplierName: item.supplier,
        canonicalSupplier: resolved.canonicalName,
        driveFolder: driveFolder,
        invoiceNumber: digitsOnly,
        reference: cleanRef,
        matchedFile: filename,
        fileId: `drive-file-id-${idx + 1}`,
        fileSize: `${(1.2 + (idx % 5) * 0.4).toFixed(1)} MB`,
        sourceType: item.source,
        status: 'found',
      };
    })
  );

  const [batchSize] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);

  // Failed downloads list and network error simulation states
  const [failedDownloads, setFailedDownloads] = useState<{
    invoiceNumber: string;
    supplierName: string;
    filename: string;
    errorType: string;
    errorMessage: string;
    timestamp: string;
  }[]>([]);
  const [simulateNetworkErrors, setSimulateNetworkErrors] = useState(false);

  // Session audit records tracking successes, failures, and skipped items for CSV export
  const [sessionAuditRecords, setSessionAuditRecords] = useState<SessionAuditRecord[]>([]);

  // File upload inline validation state
  const [validationState, setValidationState] = useState<FileValidationState>({
    status: 'idle',
  });

  // Tracking states for Dashboard
  const [currentBatchNum, setCurrentBatchNum] = useState<number>(1);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number }>({ current: 0, total: 50 });
  const [overallProgress, setOverallProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [currentActiveFile, setCurrentActiveFile] = useState<{ name: string; inv: string; supplier: string; size: string } | null>(null);

  // Rate limiting visual states
  const [isRateLimiting, setIsRateLimiting] = useState(false);
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);

  // Structured logs for current batch & session
  const [batchLogs, setBatchLogs] = useState<BatchLogEntry[]>([]);
  const [zipBatches, setZipBatches] = useState<BatchZipItem[]>([]);

  // Filter based on toggles
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (r.sourceType === 'shared_with_me' && !searchSharedWithMe) return false;
      if (r.sourceType === 'shortcut_folder' && !resolveShortcuts) return false;
      return true;
    });
  }, [rows, searchSharedWithMe, resolveShortcuts]);

  // Dynamic set of skipped row IDs based on last successful invoice ID
  const skippedRowIds = useMemo(() => {
    if (!resumeModeEnabled || !lastSuccessfulInvoiceId.trim()) return new Set<string>();

    const set = new Set<string>();
    const trimmedId = lastSuccessfulInvoiceId.trim();
    // Find the row with matching invoice number
    const idx = rows.findIndex(r => r.invoiceNumber === trimmedId);
    if (idx !== -1) {
      // Skip all rows up to and including the matched row in sequence
      for (let i = 0; i <= idx; i++) {
        set.add(rows[i].id);
      }
    }
    return set;
  }, [rows, resumeModeEnabled, lastSuccessfulInvoiceId]);

  // Split filtered rows into batches of 50
  const batches = useMemo(() => {
    const matchedOnly = filteredRows.filter((r) => r.status === 'found' && !skippedRowIds.has(r.id));
    const result: { batchNum: number; items: SheetInvoiceRow[]; startIdx: number; endIdx: number }[] = [];
    const total = matchedOnly.length;
    const numBatches = Math.ceil(total / batchSize);

    for (let b = 1; b <= numBatches; b++) {
      const start = (b - 1) * batchSize;
      const end = Math.min(start + batchSize, total);
      result.push({
        batchNum: b,
        items: matchedOnly.slice(start, end),
        startIdx: start + 1,
        endIdx: end,
      });
    }
    return result;
  }, [filteredRows, batchSize, skippedRowIds]);

  const addLog = (
    batchNum: number,
    level: BatchLogEntry['level'],
    message: string,
    filename?: string,
    fileSize?: string
  ) => {
    const timeStr = new Date().toTimeString().slice(0, 8);
    const entry: BatchLogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: timeStr,
      batchNum,
      level,
      message,
      filename,
      fileSize,
    };
    setBatchLogs((prev) => [...prev, entry]);
  };

  const handleTogglePause = () => {
    const nextState = !isPaused;
    setIsPaused(nextState);
    isPausedRef.current = nextState;
    if (nextState) {
      addLog(currentBatchNum, 'warn', 'DOWNLOAD PROCESS PAUSED BY USER');
    } else {
      addLog(currentBatchNum, 'info', 'RESUMING DOWNLOAD PROCESS...');
    }
  };

  // Format file size helper
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // INLINE VALIDATION & FILE UPLOAD HANDLER
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset input value so re-selecting the same file triggers onChange
    e.target.value = '';

    if (!file) return;

    const fileName = file.name;
    const fileSizeStr = formatFileSize(file.size);
    const fileExt = fileName.split('.').pop()?.toLowerCase();

    // 1. Validate File Format Extension
    if (!fileExt || !['xlsx', 'xls', 'csv'].includes(fileExt)) {
      setValidationState({
        status: 'error',
        fileName,
        fileSize: fileSizeStr,
        errorTitle: `Unsupported File Format (.${fileExt || 'unknown'})`,
        errorMessage: `The file "${fileName}" could not be processed because it is not an Excel or CSV spreadsheet.`,
        errorDetails: [
          'Accepted formats are Microsoft Excel (.xlsx, .xls) and Comma-Separated Values (.csv).',
          'If you have a PDF, Word document, or image, please export or convert your invoice table into an Excel or CSV file.',
          'You can also click "Excel Template" above to get a ready-to-use template file.',
        ],
      });
      return;
    }

    // 2. Validate File Size
    if (file.size === 0) {
      setValidationState({
        status: 'error',
        fileName,
        fileSize: fileSizeStr,
        errorTitle: 'Empty File',
        errorMessage: `The uploaded file "${fileName}" contains 0 bytes.`,
        errorDetails: [
          'Please ensure the file was properly saved and has data before uploading.',
        ],
      });
      return;
    }

    // Read and validate spreadsheet structure
    const reader = new FileReader();

    reader.onerror = () => {
      setValidationState({
        status: 'error',
        fileName,
        fileSize: fileSizeStr,
        errorTitle: 'File Read Error',
        errorMessage: `An error occurred while reading "${fileName}". The file may be corrupt or locked by another application.`,
        errorDetails: [
          'Close the spreadsheet in Excel or other programs and try uploading again.',
        ],
      });
    };

    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          setValidationState({
            status: 'error',
            fileName,
            fileSize: fileSizeStr,
            errorTitle: 'Corrupt Spreadsheet Structure',
            errorMessage: `The file "${fileName}" contains no readable worksheets.`,
            errorDetails: ['Ensure the file is a valid workbook generated by Excel, Google Sheets, or LibreOffice.'],
          });
          return;
        }

        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        // 3. Check for empty rows
        if (!rawJson.length) {
          setValidationState({
            status: 'error',
            fileName,
            fileSize: fileSizeStr,
            errorTitle: 'Worksheet Has No Data Rows',
            errorMessage: `Worksheet "${firstSheetName}" in "${fileName}" appears to be blank.`,
            errorDetails: [
              'Ensure your spreadsheet includes a header row followed by invoice records.',
              'Click "Excel Template" above to view the expected format.',
            ],
          });
          return;
        }

        const firstRow = rawJson[0];
        const cols = Object.keys(firstRow);

        // 4. Identify required columns
        const supplierCol = cols.find((c) => /supplier|vendor|company|party|client/i.test(c)) || cols[0];
        const invCol = cols.find((c) => /invoice|inv|number|digit|bill|inv\s*no/i.test(c));
        const refCol = cols.find((c) => /ref|reference|po|order|purchase/i.test(c));
        const dateCol = cols.find((c) => /date|dt|invoice\s*date|bill\s*date/i.test(c));

        if (!invCol) {
          setValidationState({
            status: 'error',
            fileName,
            fileSize: fileSizeStr,
            errorTitle: 'Missing "Invoice Number" Column',
            errorMessage: `Could not identify an invoice number column in "${fileName}".`,
            errorDetails: [
              `Columns detected in sheet: [${cols.map((c) => `"${c}"`).join(', ')}]`,
              'Please ensure at least one column is named "Invoice Number", "Invoice", "Inv #", or "Bill".',
            ],
          });
          return;
        }

        const sources: ('my_drive' | 'shared_with_me' | 'shortcut_folder')[] = [
          'my_drive',
          'shared_with_me',
          'shortcut_folder',
        ];

        const parsedRows: SheetInvoiceRow[] = [];
        let skippedRowsCount = 0;

        rawJson.forEach((row, i) => {
          const rawSupplier = String(row[supplierCol] || 'Unknown').trim();
          const digitsOnly = extractInvoiceDigitsOnly(row[invCol]);

          if (digitsOnly) {
            const rawRef = refCol ? row[refCol] : undefined;
            const cleanRef = sanitizeReferenceString(rawRef);
            const rawDate = dateCol ? row[dateCol] : undefined;
            const cleanDate = sanitizeDateDigits(rawDate);
            const sampleName = buildStrictInvoiceFilename(cleanDate, digitsOnly, cleanRef);
            const resolved = resolveSupplier(rawSupplier, supplierMappings);

            parsedRows.push({
              id: `upload-${i + 1}`,
              supplierName: rawSupplier,
              canonicalSupplier: resolved.canonicalName,
              driveFolder: resolved.canonicalName || rawSupplier,
              invoiceNumber: digitsOnly,
              reference: cleanRef || undefined,
              matchedFile: sampleName,
              fileSize: '1.5 MB',
              sourceType: sources[i % 3],
              status: 'found',
            });
          } else {
            skippedRowsCount++;
          }
        });

        // 5. Verify valid digits exist
        if (parsedRows.length === 0) {
          setValidationState({
            status: 'error',
            fileName,
            fileSize: fileSizeStr,
            errorTitle: 'No Numeric Invoices Extracted',
            errorMessage: `Found column "${invCol}", but none of the ${rawJson.length} rows contained numeric digits.`,
            errorDetails: [
              'Invoice numbers must contain digits (e.g. 489201, 102948).',
              'Check that the invoice column is not blank or populated solely with letters.',
            ],
          });
          return;
        }

        // VALIDATION SUCCESSFUL!
        setRows(parsedRows);
        setZipBatches([]);
        setBatchLogs([]);
        setCurrentBatchNum(1);
        setBatchProgress({ current: 0, total: Math.min(batchSize, parsedRows.length) });
        setOverallProgress({ current: 0, total: parsedRows.length });

        const batchCount = Math.ceil(parsedRows.length / batchSize);
        setValidationState({
          status: 'success',
          fileName,
          fileSize: fileSizeStr,
          successMessage: `Validated successfully! Loaded ${parsedRows.length} invoice entries (${skippedRowsCount > 0 ? `${skippedRowsCount} empty rows skipped; ` : ''}${batchCount} batch${batchCount > 1 ? 'es' : ''} planned).`,
        });

        addLog(1, 'info', `Spreadsheet "${fileName}" (${fileSizeStr}) validated & loaded.`);
        addLog(1, 'info', `Columns mapped -> Supplier: "${supplierCol}", Invoice Number: "${invCol}".`);
        addLog(1, 'info', `Extracted ${parsedRows.length} valid invoice records ready for harvesting.`);
      } catch (err: any) {
        setValidationState({
          status: 'error',
          fileName,
          fileSize: fileSizeStr,
          errorTitle: 'Spreadsheet Parsing Error',
          errorMessage: `Failed to parse file: ${err.message || 'Unknown error'}`,
          errorDetails: [
            'Ensure the file is not corrupted or password-protected.',
            'Try re-saving the file as a clean .xlsx or .csv file.',
          ],
        });
      }
    };

    reader.readAsBinaryString(file);
  };

  const createMockPdfBlob = (invNum: string, supplier: string, filename: string, source: string): Blob => {
    const textContent = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Contents 4 0 R>>endobj\n4 0 obj<</Length 160>>stream\nBT /F1 18 Tf 50 780 Td (INVOICE #${invNum}) Tj ET\nBT /F1 12 Tf 50 750 Td (Supplier: ${supplier}) Tj ET\nBT /F1 10 Tf 50 720 Td (File: ${filename}) Tj ET\nBT /F1 10 Tf 50 690 Td (Source Location: ${source}) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000056 00000 n \n0000000111 00000 n \n0000000212 00000 n \ntrailer<</Size 5/Root 1 0 R>>\nstartxref\n410\n%%EOF`;
    return new Blob([textContent], { type: 'application/pdf' });
  };

  // Sleep helper that honors pause and rate limiting
  const waitDelay = async (seconds: number) => {
    if (seconds <= 0) return;
    setIsRateLimiting(true);
    const intervals = 10;
    const stepDuration = (seconds * 1000) / intervals;

    for (let s = intervals; s >= 1; s--) {
      while (isPausedRef.current) {
        await new Promise((r) => setTimeout(r, 200));
      }
      setRateLimitCountdown((seconds * s) / intervals);
      await new Promise((r) => setTimeout(r, stepDuration));
    }
    setIsRateLimiting(false);
    setRateLimitCountdown(0);
  };

  // SAVE LOGS FEATURE: Export current session logs as .txt file
  const handleSaveLogs = () => {
    const now = new Date();
    const dateFormatted = now.toISOString().replace('T', ' ').slice(0, 19);
    const fileTimestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);

    const logHeader = `================================================================================
GOOGLE DRIVE INVOICE HARVESTER - SESSION LOG EXPORT
================================================================================
Export Date:         ${dateFormatted}
Total Invoice Rows:  ${filteredRows.length}
Configured Batch:    ${batchSize} files per ZIP
Rate Limiter Delay:  ${rateLimitDelaySec.toFixed(1)} seconds per file
Search Scopes:       My Drive, Shared with Me (${searchSharedWithMe ? 'YES' : 'NO'}), Shortcut Folders (${resolveShortcuts ? 'YES' : 'NO'})
Completed ZIPs:      ${zipBatches.length} archive(s)
================================================================================
DETAILED EVENT LOG:
================================================================================\n\n`;

    const logBody =
      batchLogs.length > 0
        ? batchLogs
            .map(
              (l) =>
                `[${l.timestamp}] [BATCH ${String(l.batchNum).padStart(2, '0')}] [${l.level.toUpperCase()}] ${l.message}`
            )
            .join('\n')
        : 'No session events logged.';

    const logSummary = `\n\n================================================================================
END OF LOG EXPORT (${batchLogs.length} events recorded)
================================================================================`;

    const fullContent = logHeader + logBody + logSummary;
    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gdrive_invoice_logs_${fileTimestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // AUDIT CSV EXPORT FEATURE: Export current session's log of successes and failures as downloadable CSV file for external audit
  const handleExportAuditCsv = () => {
    const now = new Date();
    const dateFormatted = now.toISOString().replace('T', ' ').slice(0, 19);
    const fileTimestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);

    const escapeCsv = (val: any): string => {
      if (val === undefined || val === null) return '""';
      const str = String(val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const headers = [
      'Timestamp',
      'Batch_Number',
      'Invoice_Number',
      'Supplier_Name',
      'Filename',
      'Discovery_Source',
      'Audit_Status',
      'File_Size',
      'ZIP_Archive',
      'Error_Code',
      'Error_Message',
      'Audit_Notes'
    ];

    // Map existing sessionAuditRecords
    const auditMap = new Map<string, SessionAuditRecord>();
    sessionAuditRecords.forEach((rec) => {
      auditMap.set(rec.invoiceNumber, rec);
    });

    const rowsData: string[][] = [];

    // Process every single row from the spreadsheet to provide full reconciliation
    filteredRows.forEach((row) => {
      const isSkipped = skippedRowIds.has(row.id);
      const existing = auditMap.get(row.invoiceNumber);

      if (existing) {
        rowsData.push([
          existing.timestamp,
          existing.batchNumber ? `Batch ${String(existing.batchNumber).padStart(2, '0')}` : 'N/A',
          existing.invoiceNumber,
          existing.supplierName,
          existing.filename,
          existing.sourceType,
          existing.status,
          existing.fileSize || 'N/A',
          existing.archiveZip || 'None',
          existing.exceptionType || 'None',
          existing.exceptionMessage || 'None',
          existing.status === 'SUCCESS'
            ? `Successfully downloaded and archived into ${existing.archiveZip || 'batch archive'}`
            : existing.status === 'FAILURE'
            ? `Download failed: ${existing.exceptionType}`
            : 'Skipped via session recovery resume checkpoint'
        ]);
      } else if (isSkipped) {
        rowsData.push([
          dateFormatted,
          'N/A',
          row.invoiceNumber,
          row.supplierName,
          row.matchedFile || `${row.invoiceNumber}.pdf`,
          row.sourceType === 'shared_with_me' ? 'Shared with Me' : row.sourceType === 'shortcut_folder' ? 'Shortcut Folder' : 'My Drive',
          'SKIPPED_RESUME',
          row.fileSize || 'N/A',
          'None',
          'None',
          'None',
          `Skipped due to session resume checkpoint (last completed: #${lastSuccessfulInvoiceId})`
        ]);
      } else {
        rowsData.push([
          dateFormatted,
          'Pending',
          row.invoiceNumber,
          row.supplierName,
          row.matchedFile || `${row.invoiceNumber}.pdf`,
          row.sourceType === 'shared_with_me' ? 'Shared with Me' : row.sourceType === 'shortcut_folder' ? 'Shortcut Folder' : 'My Drive',
          'PENDING',
          row.fileSize || 'N/A',
          'None',
          'None',
          'None',
          'Awaiting harvester download in queue'
        ]);
      }
    });

    const csvContent = [
      headers.map(escapeCsv).join(','),
      ...rowsData.map((r) => r.map(escapeCsv).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session_audit_log_${fileTimestamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const successCount = rowsData.filter((r) => r[6] === 'SUCCESS').length;
    const failCount = rowsData.filter((r) => r[6] === 'FAILURE').length;
    const skipCount = rowsData.filter((r) => r[6] === 'SKIPPED_RESUME').length;

    addLog(
      currentBatchNum,
      'info',
      `Exported external audit CSV (${rowsData.length} records: ${successCount} successes, ${failCount} failures, ${skipCount} skipped) -> session_audit_log_${fileTimestamp}.csv`
    );
  };

  // Main Batch Harvester execution
  const handleRunBatchHarvester = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setIsPaused(false);
    isPausedRef.current = false;
    setZipBatches([]);
    setBatchLogs([]);
    setFailedDownloads([]);
    setSessionAuditRecords([]);

    let failedCount = 0;
    const totalFound = filteredRows.filter((r) => r.status === 'found' && !skippedRowIds.has(r.id)).length;
    const totalSpreadsheetRows = filteredRows.length;
    const initialProcessedCount = skippedRowIds.size;

    setOverallProgress({ current: initialProcessedCount, total: totalSpreadsheetRows });

    // Seed audit records for skipped resume items if applicable
    if (resumeModeEnabled && lastSuccessfulInvoiceId.trim()) {
      const skippedRecords: SessionAuditRecord[] = [];
      filteredRows.forEach((row) => {
        if (skippedRowIds.has(row.id)) {
          skippedRecords.push({
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            invoiceNumber: row.invoiceNumber,
            supplierName: row.supplierName,
            filename: row.matchedFile || `${row.invoiceNumber}.pdf`,
            sourceType:
              row.sourceType === 'shared_with_me'
                ? 'Shared with Me'
                : row.sourceType === 'shortcut_folder'
                ? 'Shortcut Folder'
                : 'My Drive',
            status: 'SKIPPED_RESUME',
            fileSize: row.fileSize || 'N/A',
            archiveZip: 'None',
            exceptionType: 'None',
            exceptionMessage: `Checkpoint resume: Prior session downloaded up to invoice #${lastSuccessfulInvoiceId.trim()}`,
          });
        }
      });
      if (skippedRecords.length > 0) {
        setSessionAuditRecords(skippedRecords);
      }
    }

    addLog(1, 'info', `Initialized Multi-Source Batch Harvester. Processing remaining ${totalFound} files out of ${totalSpreadsheetRows} total spreadsheet rows.`);
    if (resumeModeEnabled && lastSuccessfulInvoiceId.trim()) {
      const skippedCount = skippedRowIds.size;
      if (skippedCount > 0) {
        addLog(1, 'warn', `SESSION RECOVERY ACTIVE: Skipped ${skippedCount} previously processed invoice(s) up to #${lastSuccessfulInvoiceId.trim()}.`);
      } else {
        addLog(1, 'warn', `SESSION RECOVERY ACTIVE: Searched for invoice #${lastSuccessfulInvoiceId.trim()} to resume, but it was not found in the spreadsheet.`);
      }
    }
    addLog(1, 'info', `Search Scopes: My Drive=YES, Shared With Me=${searchSharedWithMe ? 'YES' : 'NO'}, Shortcut Folders=${resolveShortcuts ? 'YES' : 'NO'}`);
    addLog(1, 'info', `Rate Limiter: ${rateLimitDelaySec.toFixed(1)}s delay configured between downloads.`);

    const createdBatches: BatchZipItem[] = [];
    let overallDownloaded = 0;

    for (let bIndex = 0; bIndex < batches.length; bIndex++) {
      const batch = batches[bIndex];
      setCurrentBatchNum(batch.batchNum);
      setBatchProgress({ current: 0, total: batch.items.length });

      const batchZipName = `invoices_batch_${String(batch.batchNum).padStart(2, '0')}_${batch.startIdx}_to_${batch.endIdx}.zip`;
      addLog(batch.batchNum, 'info', `>>> COMMENCING BATCH #${batch.batchNum} (${batch.items.length} files: #${batch.startIdx} to #${batch.endIdx})`);

      const zip = new JSZip();

      for (let i = 0; i < batch.items.length; i++) {
        while (isPausedRef.current) {
          await new Promise((r) => setTimeout(r, 250));
        }

        const item = batch.items[i];
        const filename = item.matchedFile || buildStrictInvoiceFilename('260403', item.invoiceNumber, item.reference);
        const dateDigits = filename.slice(0, 6);
        const zipArchivePath = buildNestedFolderPath(
          folderStructure,
          item.supplierName,
          dateDigits,
          filename,
          item.invoiceNumber
        );

        const sourceLabel =
          item.sourceType === 'shared_with_me'
            ? 'Shared with Me'
            : item.sourceType === 'shortcut_folder'
            ? 'Shortcut Folder'
            : 'My Drive';

        setCurrentActiveFile({
          name: filename,
          inv: item.invoiceNumber,
          supplier: `${item.supplierName} (Path: ${zipArchivePath})`,
          size: item.fileSize || '1.4 MB',
        });

        // 1. Log download initiation
        addLog(
          batch.batchNum,
          'download',
          `[${i + 1}/${batch.items.length}] Downloading ${filename} -> Path in Archive: "${zipArchivePath}" (${sourceLabel})`,
          filename,
          item.fileSize
        );

        // 2. Rate Limiting Pause
        if (rateLimitDelaySec > 0) {
          addLog(
            batch.batchNum,
            'ratelimit',
            `Rate Limiter: waiting ${rateLimitDelaySec.toFixed(1)}s before streaming next file (quota protection)`
          );
          await waitDelay(rateLimitDelaySec);
        } else {
          await new Promise((r) => setTimeout(r, 50));
        }

        // 3. Complete file buffer download or simulate network exception
        const shouldFail = simulateNetworkErrors && ((overallDownloaded + failedCount) % 6 === 2);

        if (shouldFail) {
          failedCount++;
          const errorTypes = [
            { type: 'HTTP 403 (Access Forbidden)', msg: 'Permission Denied. Google Drive file ownership constraints or restricted access policies prevent reading.' },
            { type: 'HTTP 404 (Not Found)', msg: 'File ID not found. The file may have been moved, deleted, or metadata indexing is stale.' },
            { type: 'HTTP 429 (Too Many Requests)', msg: 'User Rate Limit Exceeded. API request burst ceiling has been breached; backoff required.' }
          ];
          const err = errorTypes[(overallDownloaded + failedCount) % errorTypes.length];

          addLog(
            batch.batchNum,
            'warn',
            `❌ DOWNLOAD EXCEPTION: Failed downloading ${filename}. Error: ${err.type} - ${err.msg}`
          );

          setFailedDownloads((prev) => [
            ...prev,
            {
              invoiceNumber: item.invoiceNumber,
              supplierName: item.supplierName,
              filename,
              errorType: err.type,
              errorMessage: err.msg,
              timestamp: new Date().toTimeString().slice(0, 8),
            },
          ]);

          setSessionAuditRecords((prev) => [
            ...prev,
            {
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
              batchNumber: batch.batchNum,
              invoiceNumber: item.invoiceNumber,
              supplierName: item.supplierName,
              filename,
              sourceType: sourceLabel,
              status: 'FAILURE',
              fileSize: item.fileSize || 'N/A',
              archiveZip: 'None',
              exceptionType: err.type,
              exceptionMessage: err.msg,
            },
          ]);

          // Update progress metrics even on failure
          setBatchProgress({ current: i + 1, total: batch.items.length });
          const processedSoFar = initialProcessedCount + overallDownloaded + failedCount;
          setOverallProgress({ current: processedSoFar, total: totalSpreadsheetRows });

          continue; // skip zipping this item
        }

        const blob = createMockPdfBlob(item.invoiceNumber, item.supplierName, filename, sourceLabel);
        // Place invoice into supplier's folder: Supplier_Name/YYMMDD <digits> [ref].pdf
        zip.file(zipArchivePath, blob);

        overallDownloaded++;
        setBatchProgress({ current: i + 1, total: batch.items.length });
        const processedSoFar = initialProcessedCount + overallDownloaded + failedCount;
        setOverallProgress({ current: processedSoFar, total: totalSpreadsheetRows });

        setSessionAuditRecords((prev) => [
          ...prev,
          {
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            batchNumber: batch.batchNum,
            invoiceNumber: item.invoiceNumber,
            supplierName: item.supplierName,
            filename,
            sourceType: sourceLabel,
            status: 'SUCCESS',
            fileSize: item.fileSize || '1.4 MB',
            archiveZip: `${batchZipName} -> ${zipArchivePath}`,
            exceptionType: 'None',
            exceptionMessage: 'None',
          },
        ]);

        addLog(
          batch.batchNum,
          'success',
          `✓ Archived into "${zipArchivePath}" (${i + 1}/${batch.items.length} batch files ready)`
        );
      }

      // Batch finished, package into ZIP
      setCurrentActiveFile(null);
      addLog(
        batch.batchNum,
        'zip',
        `Compressing ${batch.items.length} PDF files into 50-file archive: ${batchZipName}...`
      );

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      const batchItem: BatchZipItem = {
        batchNumber: batch.batchNum,
        startIdx: batch.startIdx,
        endIdx: batch.endIdx,
        totalFiles: batch.items.length,
        filename: batchZipName,
        zipBlob,
        status: 'completed',
      };

      createdBatches.push(batchItem);
      setZipBatches([...createdBatches]);

      addLog(
        batch.batchNum,
        'zip',
        `★ BATCH #${batch.batchNum} COMPLETE: Created ${batchZipName} (${(zipBlob.size / (1024 * 1024)).toFixed(2)} MB)`
      );
    }

    addLog(
      currentBatchNum,
      'success',
      `ALL ${createdBatches.length} BATCHES COMPLETED! Successfully packaged ${totalFound} files.`
    );
    setIsProcessing(false);
    setIsPaused(false);
    isPausedRef.current = false;
  };

  const handleDownloadBatchZip = (batch: BatchZipItem) => {
    if (!batch.zipBlob) return;
    const url = URL.createObjectURL(batch.zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = batch.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllBatches = () => {
    zipBatches.forEach((batch, idx) => {
      setTimeout(() => {
        handleDownloadBatchZip(batch);
      }, idx * 600);
    });
  };

  const handleDownloadAllAsPdfs = () => {
    const matchedOnly = filteredRows.filter((r) => r.status === 'found' && !skippedRowIds.has(r.id));
    if (matchedOnly.length === 0) {
      addLog(currentBatchNum, 'warn', 'No matched invoices found to download as PDFs.');
      return;
    }
    
    addLog(
      currentBatchNum,
      'info',
      `Starting sequential direct download for ${matchedOnly.length} matched PDF files...`
    );

    matchedOnly.forEach((row, idx) => {
      setTimeout(() => {
        const filename = row.matchedFile || buildStrictInvoiceFilename('260403', row.invoiceNumber, row.reference);
        const sourceLabel =
          row.sourceType === 'shared_with_me'
            ? 'Shared with Me'
            : row.sourceType === 'shortcut_folder'
            ? 'Shortcut Folder'
            : 'My Drive';
        const blob = createMockPdfBlob(row.invoiceNumber, row.supplierName, filename, sourceLabel);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        addLog(
          currentBatchNum,
          'success',
          `✓ Successfully downloaded direct PDF: ${filename}`
        );
      }, idx * 400);
    });
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { 'Supplier Name': 'Acme Global', 'Invoice Number': 489201 },
      { 'Supplier Name': 'Nexus Logistics', 'Invoice Number': 102948 },
      { 'Supplier Name': 'Delta Power Systems', 'Invoice Number': 948102 },
      { 'Supplier Name': 'Apex Cloud Corp', 'Invoice Number': 302914 },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
    XLSX.writeFile(wb, 'sample_invoices_input.xlsx');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Multi-Source Toggles */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Archive className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-white">
                Multi-Source Batch Harvester &bull; 50-File ZIP Packs
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Format: <code className="text-amber-300 font-bold">YYMMDD &lt;digits&gt; [ref].pdf</code> (strict spaces only, NO DASH or special characters, e.g. 260403 for 2026-04-03). Every invoice is packaged inside its <strong>supplier's folder</strong> named by supplier!
            </p>

            {/* Source Toggles & Session Resume Recovery */}
            <div className="flex flex-col gap-3.5 mt-3 pt-3 border-t border-slate-800 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={searchSharedWithMe}
                    onChange={(e) => setSearchSharedWithMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5 text-blue-300 font-medium">
                    <Share2 className="w-3.5 h-3.5" />
                    Include "Shared with me" Files
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={resolveShortcuts}
                    onChange={(e) => setResolveShortcuts(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5 text-purple-300 font-medium">
                    <FolderSymlink className="w-3.5 h-3.5" />
                    Resolve &amp; Search Inside Shortcut Folders
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={simulateNetworkErrors}
                    onChange={(e) => setSimulateNetworkErrors(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-rose-500 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5 text-rose-400 font-medium" title="Injects mock network errors to verify the exceptions panel">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Simulate Network Errors (Exceptions testing)
                  </span>
                </label>
              </div>

              {/* Session Resume Control */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 pt-2.5 border-t border-slate-800/40">
                <label className="flex items-center gap-2 cursor-pointer select-none shrink-0">
                  <input
                    type="checkbox"
                    checked={resumeModeEnabled}
                    onChange={(e) => setResumeModeEnabled(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    Enable Session Resume / Skip Processed Files
                  </span>
                </label>

                {resumeModeEnabled && (
                  <div className="flex flex-1 flex-wrap items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-200">
                    <span className="text-slate-400 text-[11px] font-sans">Last Completed Invoice ID:</span>
                    <div className="relative shrink-0 w-36">
                      <input
                        type="text"
                        value={lastSuccessfulInvoiceId}
                        onChange={(e) => setLastSuccessfulInvoiceId(e.target.value)}
                        placeholder="e.g. 102948"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                      />
                      {lastSuccessfulInvoiceId.trim() && (
                        <button
                          onClick={() => setLastSuccessfulInvoiceId('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {lastSuccessfulInvoiceId.trim() && (
                      <div className="text-[11px] font-mono leading-none flex items-center">
                        {skippedRowIds.size > 0 ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                            <Check className="w-3.5 h-3.5" />
                            Ready: Skipping first {skippedRowIds.size} file(s)
                          </span>
                        ) : (
                          <span className="text-rose-400 font-semibold">
                            Invoice number not found
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Folder Structure Control */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 pt-2.5 border-t border-slate-800/40">
                <div className="flex items-center gap-2 shrink-0">
                  <FolderTree className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    ZIP Folder Organization Structure:
                  </span>
                </div>
                <select
                  value={folderStructure}
                  onChange={(e) => setFolderStructure(e.target.value as FolderStructureType)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-amber-300 focus:outline-none focus:border-amber-500 font-sans cursor-pointer max-w-sm"
                >
                  <option value="supplier_only">Supplier Name only (e.g. "Screwfix Direct Ltd/260403 489201.pdf")</option>
                  <option value="flat">Flat (No subfolders) (e.g. "260403 489201.pdf")</option>
                  <option value="date_only">Date Folder only (e.g. "2026-04-03/260403 489201.pdf")</option>
                  <option value="doctype_only">Document Type Folder only (e.g. "Invoices/260403 489201.pdf")</option>
                  <option value="supplier_date_doctype">Supplier / Date / Document Type (e.g. "Screwfix Direct Ltd/2026-04-03/Invoices/...")</option>
                  <option value="date_supplier_doctype">Date / Supplier / Document Type (e.g. "2026-04-03/Screwfix Direct Ltd/Invoices/...")</option>
                  <option value="doctype_supplier_date">Document Type / Supplier / Date (e.g. "Invoices/Screwfix Direct Ltd/2026-04-03/...")</option>
                  <option value="doctype_date_supplier">Document Type / Date / Supplier (e.g. "Invoices/2026-04-03/Screwfix Direct Ltd/...")</option>
                </select>
              </div>

              {/* Supplier Normalization Directory Banner & Link */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-800/40 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Building2 className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <span className="text-slate-200 font-semibold text-xs">
                      Supplier Normalization &amp; Dedicated Folders ({supplierMappings.length} Mapped)
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Invoices are placed inside each supplier's folder in the ZIP. Hardcoded in UI with custom addition and editing.
                    </span>
                  </div>
                </div>

                {onOpenSupplierManager && (
                  <button
                    onClick={onOpenSupplierManager}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0"
                  >
                    <FolderTree className="w-3 h-3" />
                    <span>Edit Suppliers &amp; Add New</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-xl flex items-center gap-1.5 transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Excel Template</span>
            </button>

            <button
              onClick={handleSaveLogs}
              className="text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-2 rounded-xl flex items-center gap-1.5 transition font-semibold"
              title="Save & Export full session log file as .txt"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Save Logs (.txt)</span>
            </button>

            <button
              onClick={handleExportAuditCsv}
              className="text-xs text-emerald-300 hover:text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-2 rounded-xl flex items-center gap-1.5 transition font-semibold"
              title="Export current session log of successes and failures as downloadable CSV file for external audit"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export Audit (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* INLINE VALIDATION NOTIFICATION BANNER */}
      {validationState.status === 'error' && (
        <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-4 sm:p-5 shadow-xl transition-all animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex-shrink-0">
                <FileWarning className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-rose-300">
                    {validationState.errorTitle || 'Spreadsheet Validation Failed'}
                  </h4>
                  {validationState.fileName && (
                    <span className="text-[11px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded">
                      {validationState.fileName} ({validationState.fileSize})
                    </span>
                  )}
                </div>

                <p className="text-xs text-rose-200 leading-relaxed">
                  {validationState.errorMessage}
                </p>

                {validationState.errorDetails && validationState.errorDetails.length > 0 && (
                  <ul className="text-[11px] text-rose-300/80 space-y-1 pt-1 list-disc list-inside">
                    {validationState.errorDetails.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button
              onClick={() => setValidationState({ status: 'idle' })}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
              title="Dismiss warning"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {validationState.status === 'success' && (
        <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-4 shadow-xl transition-all animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-300">
                  Spreadsheet Validated &amp; Ready
                </span>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">
                  {validationState.successMessage}
                </p>
              </div>
            </div>

            <button
              onClick={() => setValidationState({ status: 'idle' })}
              className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Real-Time Download Progress Dashboard Component */}
      <BatchDashboard
        isProcessing={isProcessing}
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
        onStartProcessing={handleRunBatchHarvester}
        currentBatchNum={currentBatchNum}
        totalBatches={batches.length}
        batchProgress={batchProgress}
        overallProgress={overallProgress}
        currentActiveFile={currentActiveFile}
        rateLimitDelaySec={rateLimitDelaySec}
        onUpdateRateLimit={setRateLimitDelaySec}
        isRateLimiting={isRateLimiting}
        rateLimitCountdown={rateLimitCountdown}
        batchLogs={batchLogs}
        onClearLogs={() => setBatchLogs([])}
        onSaveLogs={handleSaveLogs}
        onExportAuditCsv={handleExportAuditCsv}
        completedZips={zipBatches}
        onDownloadZip={handleDownloadBatchZip}
        onDownloadAllZips={handleDownloadAllBatches}
        onDownloadAllAsPdfs={handleDownloadAllAsPdfs}
      />

      {/* 4. Failed Downloads Exception Logging Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              Download Exceptions &amp; Failure Log ({failedDownloads.length} errors)
            </h3>
            <p className="text-xs text-slate-400">
              Captures and displays failed file downloads with specific Google Drive API exception details for easy debugging.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAuditCsv}
              className="text-xs text-emerald-300 hover:text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 font-semibold"
              title="Download CSV audit log of all failures and successes"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Audit CSV</span>
            </button>
            {failedDownloads.length > 0 && (
              <button
                onClick={() => setFailedDownloads([])}
                className="text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-xl transition"
              >
                Clear Exception Log
              </button>
            )}
          </div>
        </div>

        {failedDownloads.length === 0 ? (
          <div className="text-center py-6 bg-slate-950/40 rounded-xl border border-slate-800/60 text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
            <span className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              ✓
            </span>
            <div>
              <p className="font-semibold text-slate-400">Harvester Streams are Healthy</p>
              <p className="text-[11px] text-slate-500 mt-0.5">No file download exceptions recorded in this session.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/60 max-h-[220px] overflow-y-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold sticky top-0 border-b border-slate-800 z-10">
                <tr>
                  <th className="py-2 px-3 text-[10px]">Time</th>
                  <th className="py-2 px-3 text-[10px]">Invoice ID</th>
                  <th className="py-2 px-3 text-[10px]">Supplier</th>
                  <th className="py-2 px-3 text-[10px]">Filename</th>
                  <th className="py-2 px-3 text-[10px]">Exception Type</th>
                  <th className="py-2 px-3 text-[10px]">Debugging Actionable Advice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-[11px]">
                {failedDownloads.map((err, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2 px-3 text-slate-500">{err.timestamp}</td>
                    <td className="py-2 px-3 text-amber-400 font-bold">{err.invoiceNumber}</td>
                    <td className="py-2 px-3 text-slate-300 font-sans">{err.supplierName}</td>
                    <td className="py-2 px-3 text-slate-400 truncate max-w-[150px]" title={err.filename}>{err.filename}</td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                        {err.errorType}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-rose-300/90 font-sans text-xs max-w-[280px]">
                      {err.errorMessage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Input Sheet Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              Input Spreadsheet Invoices ({filteredRows.length} active rows)
            </h3>
            <p className="text-xs text-slate-400">
              Format: <code className="text-amber-300 font-bold">YYMMDD &lt;digits&gt; [ref].pdf</code> (e.g. <code className="text-amber-300">260403 489201 REF9942.pdf</code> or <code className="text-amber-300">260403 489201.pdf</code> &bull; Spaces only, no dash)
            </p>
          </div>

          <label className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold cursor-pointer transition">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Custom Sheet (.xlsx/.csv)</span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Table Preview */}
        <div className="overflow-x-auto max-h-[360px] overflow-y-auto border border-slate-800 rounded-xl bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold sticky top-0 border-b border-slate-800 z-10 text-[10px]">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Sheet Supplier</th>
                <th className="py-2.5 px-3">Drive Supplier Folder</th>
                <th className="py-2.5 px-3">Invoice Digits</th>
                <th className="py-2.5 px-3">Ref</th>
                <th className="py-2.5 px-3">Drive Filename (Spaces Only)</th>
                <th className="py-2.5 px-3">Discovered Via</th>
                <th className="py-2.5 px-3 text-right">Actions / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredRows.map((row, idx) => {
                const isSkipped = skippedRowIds.has(row.id);
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-900/60 transition-all ${
                      isSkipped ? 'opacity-35 select-none bg-slate-950/40 border-slate-900' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-slate-500 font-sans">{idx + 1}</td>
                    
                    {/* Raw Sheet Supplier */}
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-200">
                      {row.supplierName}
                    </td>

                    {/* Normalized Drive Folder */}
                    <td className="py-2.5 px-3 text-purple-300">
                      <div className="flex items-center gap-1.5 font-sans">
                        <Folder className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="truncate max-w-[170px]" title={row.driveFolder || row.supplierName}>
                          {row.driveFolder || row.supplierName}
                        </span>
                      </div>
                    </td>

                    {/* Invoice Digits Only */}
                    <td className="py-2.5 px-3 text-amber-300 font-bold">
                      <div className="flex items-center justify-between group/cell">
                        <span>{row.invoiceNumber}</span>
                        {!isSkipped && (
                          <button
                            onClick={() => {
                              setResumeModeEnabled(true);
                              setLastSuccessfulInvoiceId(row.invoiceNumber);
                            }}
                            className="opacity-0 group-hover/cell:opacity-100 text-[10px] text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md transition font-sans normal-case cursor-pointer"
                            title={`Skip all rows up to and including invoice #${row.invoiceNumber}`}
                          >
                            Resume from here
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Optional Reference without Special Characters */}
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[10px]">
                      {row.reference ? (
                        <span className="text-slate-300">{row.reference}</span>
                      ) : (
                        <span className="text-slate-600 font-sans">-</span>
                      )}
                    </td>

                    {/* Formatted Filename: YYMMDD <digits> [ref].pdf */}
                    <td className="py-2.5 px-3 text-slate-200 truncate max-w-[240px]" title={row.matchedFile}>
                      <span className="font-mono text-emerald-300">{row.matchedFile}</span>
                    </td>

                    {/* Source */}
                    <td className="py-2.5 px-3">
                      {row.sourceType === 'shared_with_me' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-sans font-medium">
                          <Share2 className="w-3 h-3" />
                          Shared with Me
                        </span>
                      ) : row.sourceType === 'shortcut_folder' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 font-sans font-medium">
                          <FolderSymlink className="w-3 h-3" />
                          Shortcut Folder
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-sans">
                          My Drive
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 text-right font-sans">
                      {isSkipped ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700 font-sans font-medium">
                          <Clock className="w-3 h-3 text-slate-500" />
                          Skipped (Resumed)
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => {
                              const filename = row.matchedFile || buildStrictInvoiceFilename('260403', row.invoiceNumber, row.reference);
                              const sourceLabel =
                                row.sourceType === 'shared_with_me'
                                  ? 'Shared with Me'
                                  : row.sourceType === 'shortcut_folder'
                                  ? 'Shortcut Folder'
                                  : 'My Drive';
                              const blob = createMockPdfBlob(row.invoiceNumber, row.supplierName, filename, sourceLabel);
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = filename;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                            }}
                            className="p-1 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition text-[10px] flex items-center gap-1 cursor-pointer font-sans"
                            title="Download this matched PDF directly"
                          >
                            <Download className="w-3 h-3" />
                            <span>PDF</span>
                          </button>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Matched
                          </span>
                        </div>
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
  );
};
