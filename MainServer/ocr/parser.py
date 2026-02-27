"""
Rule-based parser that converts ordered OCR text lines into a
structured dict matching the Django models.

Designed for Philippine BIR-compliant receipts / sales invoices.
"""

import re
from datetime import datetime
from dateutil import parser as dateutil_parser


# ── regex helpers ───────────────────────────────────────────────────
TIN_RE = re.compile(r"(\d{3})[-\s.]?(\d{3})[-\s.]?(\d{3})[-\s.]?(\d{3})")
AMOUNT_RE = re.compile(r"[\d,]+\.\d{2}")
DATE_RE = re.compile(
    r"("
    r"\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4}"
    r"|"
    r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z.]*\s+\d{1,2},?\s+\d{4}"
    r")",
    re.IGNORECASE,
)
SERIAL_RE = re.compile(
    r"(?:No\.?|#|Receipt\s*(?:No|#)\.?)\s*[:\-]?\s*([A-Z0-9\-]+)",
    re.IGNORECASE,
)
ATP_RE = re.compile(
    r"(?:ATP|Authority\s+to\s+Print)\s*(?:No\.?|#)?\s*[:\-]?\s*([A-Z0-9\-]+)",
    re.IGNORECASE,
)
QTY_LINE_RE = re.compile(
    r"^(\d+(?:\.\d+)?)\s+(.+?)\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})$"
)


def _clean_amount(s: str) -> str:
    return s.replace(",", "")


def _find_amount_near(line: str, keyword: str):
    """Return the first decimal amount found on a line containing *keyword*."""
    if keyword.lower() not in line.lower():
        return None
    m = AMOUNT_RE.findall(line)
    return _clean_amount(m[-1]) if m else None


def _find_tin(text: str):
    m = TIN_RE.search(text)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}-{m.group(4)}"
    return None


def _find_date(text: str):
    m = DATE_RE.search(text)
    if m:
        try:
            dt = dateutil_parser.parse(m.group(0), dayfirst=False)
            return dt.isoformat()
        except (ValueError, OverflowError):
            pass
    return None


def _detect_receipt_type(paragraph: str):
    p = paragraph.upper()
    if "SALES INVOICE" in p:
        return "SALES_INVOICE"
    return "OFFICIAL_RECEIPT"


def _detect_vat_status(paragraph: str):
    p = paragraph.upper()
    if "NON-VAT" in p or "NON VAT" in p:
        return "NON_VAT"
    if "VAT REG" in p or "VAT REGISTERED" in p:
        return "VAT"
    return "NON_VAT"


# ── main parser ─────────────────────────────────────────────────────
def parse_receipt(lines: list[str], paragraph: str) -> dict:
    """
    Best-effort extraction.  Returns a dict ready for the frontend
    review form.  Every value is a string or None so it serialises
    cleanly to JSON.
    """

    result = {
        "seller": {
            "registered_business_name": "",
            "business_address": "",
            "tin": "",
            "vat_status": "NON_VAT",
        },
        "buyer": {
            "buyer_name": "",
            "buyer_address": "",
            "buyer_tin": "",
        },
        "receipt": {
            "receipt_type": "OFFICIAL_RECEIPT",
            "serial_number": "",
            "transaction_date": "",
            "gross_sales": "",
            "vatable_sales": "",
            "vat_amount": "",
            "vat_exempt_sales": "",
            "zero_rated_sales": "",
            "total_amount_due": "",
        },
        "items": [],
        "printer": {
            "authority_to_print_number": "",
            "printer_name": "",
            "printer_tin": "",
            "printer_address": "",
            "atp_issue_date": "",
            "bir_permit_number": "",
            "serial_start": "",
            "serial_end": "",
        },
        "raw_text": paragraph,
    }

    if not lines:
        return result

    upper_paragraph = paragraph.upper()

    # ── receipt type ────────────────────────────────────────────────
    result["receipt"]["receipt_type"] = _detect_receipt_type(paragraph)
    result["seller"]["vat_status"] = _detect_vat_status(paragraph)

    # ── seller name: typically the first non-empty line ─────────────
    header_lines = []
    for ln in lines[:6]:
        up = ln.upper().strip()
        if any(
            kw in up
            for kw in [
                "OFFICIAL RECEIPT",
                "SALES INVOICE",
                "OR NO",
                "SI NO",
                "DATE",
                "VAT REG",
                "TIN",
            ]
        ):
            break
        header_lines.append(ln.strip())

    if header_lines:
        result["seller"]["registered_business_name"] = header_lines[0]
        if len(header_lines) > 1:
            result["seller"]["business_address"] = " ".join(header_lines[1:])

    # ── TINs: first TIN → seller, second → buyer, later → printer ──
    all_tins = []
    for ln in lines:
        m = TIN_RE.search(ln)
        if m:
            tin_str = f"{m.group(1)}-{m.group(2)}-{m.group(3)}-{m.group(4)}"
            context = ln.upper()
            all_tins.append((tin_str, context, ln))

    if all_tins:
        result["seller"]["tin"] = all_tins[0][0]
    if len(all_tins) >= 2:
        # second TIN is buyer or printer — use keyword context
        for tin_str, ctx, _ in all_tins[1:]:
            if any(kw in ctx for kw in ["SOLD", "BUYER", "CUSTOMER"]):
                result["buyer"]["buyer_tin"] = tin_str
            elif any(kw in ctx for kw in ["PRINT", "ATP", "ACCREDIT"]):
                result["printer"]["printer_tin"] = tin_str
            else:
                if not result["buyer"]["buyer_tin"]:
                    result["buyer"]["buyer_tin"] = tin_str
                else:
                    result["printer"]["printer_tin"] = tin_str

    # ── serial number ───────────────────────────────────────────────
    for ln in lines:
        m = SERIAL_RE.search(ln)
        if m:
            result["receipt"]["serial_number"] = m.group(1).strip()
            break

    # if still empty, look for a 6-digit number pattern near top
    if not result["receipt"]["serial_number"]:
        for ln in lines[:10]:
            nums = re.findall(r"\b(\d{5,8})\b", ln)
            if nums:
                result["receipt"]["serial_number"] = nums[-1]
                break

    # ── date ────────────────────────────────────────────────────────
    for ln in lines:
        dt = _find_date(ln)
        if dt:
            result["receipt"]["transaction_date"] = dt
            break

    # ── buyer name / address ────────────────────────────────────────
    for i, ln in enumerate(lines):
        up = ln.upper()
        if any(kw in up for kw in ["SOLD TO", "CUSTOMER", "BUYER"]):
            # extract name from this line (after the keyword)
            name_part = re.sub(
                r"(?i)(sold\s*to|customer|buyer)\s*[:\-]?\s*", "", ln
            ).strip()
            if name_part:
                result["buyer"]["buyer_name"] = name_part
            # next line might be address
            if i + 1 < len(lines):
                next_up = lines[i + 1].upper()
                if not any(
                    kw in next_up
                    for kw in ["TIN", "DATE", "QTY", "TOTAL", "VATABLE"]
                ):
                    result["buyer"]["buyer_address"] = lines[i + 1].strip()
            break

    # ── financial summary ───────────────────────────────────────────
    kw_map = {
        "gross_sales": ["GROSS SALES", "GROSS"],
        "vatable_sales": ["VATABLE SALES", "VATABLE"],
        "vat_amount": ["VAT AMOUNT", "VAT AMT", "12%", "OUTPUT TAX"],
        "vat_exempt_sales": ["VAT-EXEMPT", "VAT EXEMPT", "EXEMPT SALES"],
        "zero_rated_sales": ["ZERO-RATED", "ZERO RATED"],
        "total_amount_due": [
            "TOTAL AMOUNT DUE",
            "TOTAL DUE",
            "AMOUNT DUE",
            "TOTAL AMT",
            "GRAND TOTAL",
            "TOTAL SALE",
        ],
    }

    for field, keywords in kw_map.items():
        for ln in lines:
            for kw in keywords:
                val = _find_amount_near(ln, kw)
                if val:
                    result["receipt"][field] = val
                    break
            if result["receipt"][field]:
                break

    # fallback: if total_amount_due empty, use the largest amount found
    if not result["receipt"]["total_amount_due"]:
        all_amounts = AMOUNT_RE.findall(paragraph)
        if all_amounts:
            largest = max(float(_clean_amount(a)) for a in all_amounts)
            result["receipt"]["total_amount_due"] = f"{largest:.2f}"

    # if gross_sales empty, copy total
    if not result["receipt"]["gross_sales"]:
        result["receipt"]["gross_sales"] = result["receipt"]["total_amount_due"]

    # ── line items ──────────────────────────────────────────────────
    for ln in lines:
        m = QTY_LINE_RE.match(ln.strip())
        if m:
            result["items"].append(
                {
                    "quantity": m.group(1),
                    "description": m.group(2).strip(),
                    "unit_cost": _clean_amount(m.group(3)),
                    "line_total": _clean_amount(m.group(4)),
                }
            )

    # ── ATP / printer ──────────────────────────────────────────────
    for ln in lines:
        m = ATP_RE.search(ln)
        if m:
            result["printer"]["authority_to_print_number"] = m.group(1).strip()
            break

    for i, ln in enumerate(lines):
        up = ln.upper()
        if any(kw in up for kw in ["PRINTED BY", "PRINTER"]):
            name_part = re.sub(
                r"(?i)(printed\s*by|printer)\s*[:\-]?\s*", "", ln
            ).strip()
            if name_part:
                result["printer"]["printer_name"] = name_part
            if i + 1 < len(lines):
                result["printer"]["printer_address"] = lines[i + 1].strip()
            break

    # ── ATP date ────────────────────────────────────────────────────
    for ln in lines:
        up = ln.upper()
        if "DATE ISSUED" in up or "ISSUE DATE" in up:
            dt = _find_date(ln)
            if dt:
                result["printer"]["atp_issue_date"] = dt[:10]
            break

    # ── serial range ────────────────────────────────────────────────
    for ln in lines:
        up = ln.upper()
        if "SERIAL" in up and ("RANGE" in up or "-" in ln):
            nums = re.findall(r"\b(\d{4,})\b", ln)
            if len(nums) >= 2:
                result["printer"]["serial_start"] = nums[0]
                result["printer"]["serial_end"] = nums[1]
            break

    return result