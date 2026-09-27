/**
 * Invoice Filename Normalization and Verification Utilities
 * 
 * Strict Specification:
 * Format: "YYMMDD <INV NUMBER BUT ONLY DIGITS> <ref>.pdf"
 *     or: "YYMMDD <INV NUMBER BUT ONLY DIGITS>.pdf"
 * 
 * Constraints:
 * - NO DASH (-), NO SLASH (/ or \), NO UNDERSCORE (_), NO HASH (#), OR ANY OTHER SPECIAL CHARACTER OTHER THAN SPACE
 * - Invoice number contains ONLY DIGITS (\d+)
 * - Date contains strictly 6 numeric digits YYMMDD (e.g. 260403 for 2026-04-03)
 * - Reference (if present) contains ONLY alphanumeric characters and spaces
 * - Each file is stored inside the supplier's folder named by supplier
 */

export interface FormattedInvoiceMeta {
  rawFilename: string;
  formattedFilename: string;
  dateDigits: string;
  invoiceDigits: string;
  cleanReference: string;
  isValid: boolean;
  supplierFolder: string;
}

/**
 * Strips all non-digit characters from an invoice number string.
 * e.g. "INV-489201/A" -> "489201"
 */
export function extractInvoiceDigitsOnly(rawInvoice: string | number): string {
  if (rawInvoice === undefined || rawInvoice === null) return '';
  let str = String(rawInvoice).trim();
  // Strip Excel floating point artifacts like 489201.0
  if (str.endsWith('.0')) {
    str = str.slice(0, -2);
  }
  return str.replace(/\D/g, '');
}

/**
 * Cleans a reference string to strictly remove dashes, slashes, and any special characters other than space.
 * Only alphanumeric characters (a-z, A-Z, 0-9) and single spaces are allowed.
 * e.g. "REF-9942/X#1" -> "REF 9942 X 1"
 */
export function sanitizeReferenceString(rawRef: string | number | undefined | null): string {
  if (!rawRef) return '';
  const str = String(rawRef);
  // Replace any character that is NOT a letter, number, or space with a space
  const noSpecialChars = str.replace(/[^a-zA-Z0-9\s]/g, ' ');
  // Collapse multiple spaces into a single space and trim
  return noSpecialChars.replace(/\s+/g, ' ').trim();
}

/**
 * Cleans a date input to extract strictly 6 digits YYMMDD.
 * e.g. "2026-04-03" -> "260403"
 * e.g. "20260403"   -> "260403"
 * e.g. "260403"     -> "260403"
 */
export function sanitizeDateDigits(rawDate: string | number | Date | undefined | null): string {
  if (!rawDate) {
    const now = new Date();
    const y = String(now.getFullYear()).slice(-2);
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}${m}${d}`;
  }

  if (rawDate instanceof Date) {
    const y = String(rawDate.getFullYear()).slice(-2);
    const m = String(rawDate.getMonth() + 1).padStart(2, '0');
    const d = String(rawDate.getDate()).padStart(2, '0');
    return `${y}${m}${d}`;
  }

  const str = String(rawDate).trim();
  const digitsOnly = str.replace(/\D/g, '');
  if (digitsOnly.length === 8) {
    // Convert YYYYMMDD (e.g. 20260403) -> YYMMDD (260403)
    return digitsOnly.slice(2, 8);
  }
  if (digitsOnly.length >= 6) {
    return digitsOnly.slice(0, 6);
  }
  // Fallback to 6 digits padded
  return digitsOnly.padEnd(6, '0');
}

/**
 * Generates the strictly compliant invoice filename:
 * "YYMMDD <INV NUMBER BUT ONLY DIGITS> <ref>.pdf" or "YYMMDD <INV NUMBER BUT ONLY DIGITS>.pdf"
 * NO DASH / OR ANY OTHER SPECIAL CHARACTER OTHER THAN SPACE
 */
export function buildStrictInvoiceFilename(
  dateInput: string | number | Date | undefined | null,
  rawInvoice: string | number,
  rawReference?: string | number | null
): string {
  const dateStr = sanitizeDateDigits(dateInput);
  const invDigits = extractInvoiceDigitsOnly(rawInvoice);
  const refClean = sanitizeReferenceString(rawReference);

  if (refClean) {
    return `${dateStr} ${invDigits} ${refClean}.pdf`;
  }
  return `${dateStr} ${invDigits}.pdf`;
}

/**
 * Sanitizes a supplier folder name for safe filesystem and ZIP path storage,
 * preserving spaces and supplier identity while stripping illegal filesystem path characters.
 */
export function sanitizeSupplierFolderName(supplierName: string): string {
  const clean = (supplierName || 'Unknown Supplier')
    .replace(/[/\\:*?"<>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return clean || 'Unknown Supplier';
}

/**
 * Regex strictly matching:
 * ^(\d{6})\s+(\d+)(?:\s+([a-zA-Z0-9 ]+))?\.pdf$
 */
export const STRICT_INVOICE_REGEX = /^(\d{6})\s+(\d+)(?:\s+([a-zA-Z0-9 ]+))?\.pdf$/i;

/**
 * Parses and verifies if a filename strictly obeys the format:
 * YYMMDD <INV NUMBER BUT ONLY DIGITS> [ref].pdf
 */
export function parseAndValidateInvoiceFilename(filename: string): {
  isValid: boolean;
  dateDigits?: string;
  invoiceDigits?: string;
  reference?: string;
} {
  const match = STRICT_INVOICE_REGEX.exec(filename.trim());
  if (!match) {
    return { isValid: false };
  }

  return {
    isValid: true,
    dateDigits: match[1],
    invoiceDigits: match[2],
    reference: match[3] ? match[3].trim() : undefined,
  };
}

/**
 * Detects the document type based on keywords in the filename or invoice number.
 */
export function detectDocType(filename: string, invoiceNumber: string = ''): 'Invoices' | 'Credit Notes' | 'Receipts' {
  const combined = `${filename} ${invoiceNumber}`.toLowerCase();
  if (combined.includes('credit') || combined.includes('crn') || combined.includes('cn') || combined.includes('refund') || combined.includes('creditnote')) {
    return 'Credit Notes';
  }
  if (combined.includes('receipt') || combined.includes('rcp') || combined.includes('rec') || combined.includes('payment')) {
    return 'Receipts';
  }
  return 'Invoices';
}

/**
 * Formats date digits YYMMDD into YYYY-MM-DD for directory names.
 */
export function formatDateFolder(dateDigits: string): string {
  const clean = dateDigits.replace(/\D/g, '');
  if (clean.length === 6) {
    const yy = clean.slice(0, 2);
    const mm = clean.slice(2, 4);
    const dd = clean.slice(4, 6);
    return `20${yy}-${mm}-${dd}`;
  }
  if (clean.length === 8) {
    const yyyy = clean.slice(0, 4);
    const mm = clean.slice(4, 6);
    const dd = clean.slice(6, 8);
    return `${yyyy}-${mm}-${dd}`;
  }
  return dateDigits || 'No Date';
}

/**
 * Generates the full ZIP archive path for a file according to the selected FolderStructureType.
 */
export function buildNestedFolderPath(
  structure: string,
  supplierName: string,
  dateDigits: string,
  filename: string,
  invoiceNumber: string = ''
): string {
  const sFolder = sanitizeSupplierFolderName(supplierName);
  const dFolder = formatDateFolder(dateDigits);
  const docType = detectDocType(filename, invoiceNumber);

  switch (structure) {
    case 'flat':
      return filename;
    case 'date_only':
      return `${dFolder}/${filename}`;
    case 'doctype_only':
      return `${docType}/${filename}`;
    case 'supplier_only':
      return `${sFolder}/${filename}`;
    case 'supplier_date_doctype':
      return `${sFolder}/${dFolder}/${docType}/${filename}`;
    case 'date_supplier_doctype':
      return `${dFolder}/${sFolder}/${docType}/${filename}`;
    case 'doctype_supplier_date':
      return `${docType}/${sFolder}/${dFolder}/${filename}`;
    case 'doctype_date_supplier':
      return `${docType}/${dFolder}/${sFolder}/${filename}`;
    default:
      return `${sFolder}/${filename}`;
  }
}

