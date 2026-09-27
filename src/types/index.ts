export type AuthType = 'oauth' | 'service_account' | 'pydrive2' | 'cli_full';

export type OrganizeStrategy = 'flat' | 'by_year_month' | 'by_invoice_num';
export type DuplicateStrategy = 'skip' | 'overwrite' | 'rename';

export type FolderStructureType =
  | 'supplier_only'
  | 'flat'
  | 'date_only'
  | 'doctype_only'
  | 'supplier_date_doctype'
  | 'date_supplier_doctype'
  | 'doctype_supplier_date'
  | 'doctype_date_supplier';

export interface ScriptConfig {
  authType: AuthType;
  searchTerm: string;
  regexPattern: string;
  folderId: string;
  includeSharedDrives: boolean;
  includeSharedWithMe: boolean;
  resolveShortcuts: boolean;
  outputDir: string;
  organizeBy: OrganizeStrategy;
  duplicateAction: DuplicateStrategy;
  exportGoogleWorkspace: boolean;
  maxFiles: number;
  chunkSizeMB: number;
  enableLogging: boolean;
  enableDryRun: boolean;
  exportSheetsFormat: 'xlsx' | 'pdf' | 'csv';
  batchSize: number;
  sheetFilePath: string;
  rateLimitDelaySec: number; // Delay in seconds between file downloads to prevent API rate limits
  enableJitter: boolean; // Add random jitter to delay
  resumeModeEnabled?: boolean; // Enable session recovery
  lastSuccessfulInvoiceId?: string; // Last successfully downloaded invoice number
  folderStructure: FolderStructureType; // New folder structure option
}

export interface RegexPreset {
  id: string;
  name: string;
  pattern: string;
  description: string;
  exampleMatch: string;
}

export interface SampleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  modifiedTime: string;
  folderName?: string;
  isGoogleDoc?: boolean;
  sourceType?: 'my_drive' | 'shared_with_me' | 'shortcut_folder' | 'shared_drive';
}

export interface SheetInvoiceRow {
  id: string;
  supplierName: string;
  canonicalSupplier?: string;
  driveFolder?: string;
  invoiceNumber: string; // digits only
  reference?: string; // clean reference without special characters
  matchedFile?: string;
  fileId?: string;
  fileSize?: string;
  sourceType?: 'my_drive' | 'shared_with_me' | 'shortcut_folder' | 'shared_drive';
  status: 'pending' | 'found' | 'not_found' | 'downloaded';
  batchIndex?: number;
}

export interface BatchZipItem {
  batchNumber: number;
  startIdx: number;
  endIdx: number;
  totalFiles: number;
  filename: string;
  zipBlob?: Blob;
  status: 'pending' | 'creating' | 'completed';
}

export interface SessionAuditRecord {
  timestamp: string;
  invoiceNumber: string;
  supplierName: string;
  filename: string;
  sourceType: string;
  batchNumber?: number;
  status: 'SUCCESS' | 'FAILURE' | 'SKIPPED_RESUME' | 'PENDING';
  fileSize?: string;
  archiveZip?: string;
  exceptionType?: string;
  exceptionMessage?: string;
}
