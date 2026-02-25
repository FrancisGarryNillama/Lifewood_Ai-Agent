const DATE_PATTERNS = [
  /\b\d{4}[/-]\d{1,2}[/-]\d{1,2}\b/,
  /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/,
  /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{1,2},?\s+\d{2,4}\b/i,
];

const AMOUNT_PATTERNS = [
  /\b(?:grand\s*total|total\s*amount|amount\s*due|total)\s*[:-]?\s*(?:php|ph[p]?|₱|\$)?\s*([0-9][0-9,]*(?:\.[0-9]{2})?)/i,
  /(?:php|ph[p]?|₱|\$)\s*([0-9][0-9,]*(?:\.[0-9]{2})?)/i,
  /\b([0-9][0-9,]*\.[0-9]{2})\b/,
];

const TYPE_RULES = [
  { type: 'Meals', keywords: ['restaurant', 'cafe', 'coffee', 'food', 'meal', 'dining', 'snack'] },
  { type: 'Travel', keywords: ['taxi', 'grab', 'uber', 'bus', 'train', 'flight', 'airline', 'transport'] },
  { type: 'Fuel', keywords: ['fuel', 'gasoline', 'diesel', 'petrol', 'shell', 'caltex', 'petron'] },
  { type: 'Office Supplies', keywords: ['paper', 'printer', 'stapler', 'office', 'stationery', 'supply'] },
  { type: 'Utilities', keywords: ['electric', 'water', 'internet', 'utility', 'billing', 'telecom'] },
  { type: 'Accommodation', keywords: ['hotel', 'inn', 'lodging', 'airbnb'] },
];

function normalizeText(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(normalizeText).join(' ');
  if (typeof value === 'object') {
    const textFields = [
      value.raw_text,
      value.text,
      value.ocr_text,
      value.content,
      value.description,
      value.subject_description,
      value.vendor_name,
      value.merchant_name,
      value.file_name,
    ];
    return textFields.filter(Boolean).join(' ');
  }
  return String(value);
}

function parseDate(rawText, fallbackDate) {
  for (const pattern of DATE_PATTERNS) {
    const match = rawText.match(pattern);
    if (match?.[0]) return match[0];
  }
  return fallbackDate;
}

function parseReceiptNumber(rawText, item, idx) {
  const explicit = item?.receipt_no || item?.receipt_number || item?.receiptNumber || item?.invoice_no;
  if (explicit) return String(explicit);

  const labeled = rawText.match(
    /\b(?:receipt(?:\s*(?:no|number|#))?|invoice(?:\s*(?:no|#))?|ref(?:erence)?(?:\s*(?:no|#))?)\s*[:#-]?\s*([A-Z0-9-]{4,})/i
  );
  if (labeled?.[1]) return labeled[1].toUpperCase();

  const fallback = rawText.match(/\b[A-Z]{2,}-?\d{2,}\b/);
  if (fallback?.[0]) return fallback[0].toUpperCase();

  return `RCP-${Date.now()}-${idx + 1}`;
}

function parseAmount(rawText, item) {
  const explicit = item?.amount ?? item?.total_amount ?? item?.total ?? item?.grand_total;
  if (explicit !== undefined && explicit !== null && explicit !== '') {
    const value = Number(String(explicit).replace(/[^0-9.]/g, ''));
    if (!Number.isNaN(value) && value > 0) return value;
  }

  for (const pattern of AMOUNT_PATTERNS) {
    const match = rawText.match(pattern);
    if (match?.[1]) {
      const value = Number(match[1].replace(/,/g, ''));
      if (!Number.isNaN(value) && value > 0) return value;
    }
  }

  return null;
}

function classifyExpense(rawText, item) {
  const explicit = item?.expense_type || item?.category || item?.type;
  if (explicit) return String(explicit);

  const content = rawText.toLowerCase();
  for (const rule of TYPE_RULES) {
    if (rule.keywords.some((keyword) => content.includes(keyword))) {
      return rule.type;
    }
  }
  return 'Other';
}

export function parseExpenseReceiptsFromOcr(payload, userName = '') {
  const source = payload?.ocr_results || payload?.results || payload?.receipts || [];
  if (!Array.isArray(source)) return [];

  const today = new Date().toISOString().slice(0, 10);

  return source.map((item, idx) => {
    const rawText = normalizeText(item);
    const date = parseDate(rawText, today);
    const receiptNo = parseReceiptNumber(rawText, item, idx);
    const amount = parseAmount(rawText, item);
    const expenseType = classifyExpense(rawText, item);

    return {
      rowId: `receipt-${receiptNo}-${idx}`,
      receiptNo,
      date,
      amount,
      amountLabel: amount !== null ? `PHP ${amount.toFixed(2)}` : 'N/A',
      expenseType,
      name: item?.employee_name || item?.applicant_name || userName || 'Unknown Employee',
      status: item?.status || 'Parsed',
      sourceText: rawText,
    };
  });
}
