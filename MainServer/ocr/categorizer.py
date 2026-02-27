"""
Simple keyword matcher that suggests an ExpenseCategory
based on the OCR text.
"""

from billing.models import ExpenseCategory

# Fallback mapping when the DB has no keyword data yet
DEFAULT_RULES = {
    "Office Supplies": [
        "paper", "ink", "toner", "stapler", "folder", "pen",
        "notebook", "office", "stationery",
    ],
    "Utilities": [
        "meralco", "electric", "water", "maynilad", "manila water",
        "utility", "power",
    ],
    "Communication": [
        "globe", "smart", "pldt", "converge", "internet",
        "telecom", "postpaid", "prepaid", "load",
    ],
    "Transportation & Travel": [
        "grab", "taxi", "uber", "fuel", "gas", "petrol",
        "diesel", "shell", "petron", "caltex", "travel",
        "airline", "bus", "toll", "parking",
    ],
    "Meals & Entertainment": [
        "restaurant", "food", "meal", "jollibee", "mcdonalds",
        "mcdonald", "starbucks", "coffee", "catering",
        "dining", "eat", "snack",
    ],
    "Repairs & Maintenance": [
        "repair", "maintenance", "service", "mechanic",
        "plumbing", "electrical", "aircon", "a/c",
    ],
    "Professional Fees": [
        "legal", "accounting", "audit", "consultant",
        "professional fee", "atty", "attorney", "cpa",
    ],
    "Rent": ["rent", "lease", "rental"],
    "Advertising & Promotion": [
        "advertising", "ads", "promo", "marketing",
        "signage", "print ad", "billboard",
    ],
    "Taxes & Licenses": [
        "bir", "business permit", "license", "tax",
        "registration", "clearance", "barangay",
    ],
    "Insurance": ["insurance", "hmo", "health", "premium"],
    "Admin Expense": ["admin", "administrative", "miscellaneous"],
}


def suggest_category(paragraph: str) -> dict:
    """
    Return ``{"id": <int|None>, "name": "<str>"}`` for the best-matching
    expense category.
    """
    text = paragraph.lower()

    # 1. Try DB-stored keywords first
    for cat in ExpenseCategory.objects.all():
        if cat.keywords:
            kws = [k.strip().lower() for k in cat.keywords.split(",") if k.strip()]
            for kw in kws:
                if kw in text:
                    return {"id": cat.id, "name": cat.name}

    # 2. Fallback to hardcoded rules
    for cat_name, kws in DEFAULT_RULES.items():
        for kw in kws:
            if kw in text:
                # try to find the category in DB to get its id
                try:
                    cat = ExpenseCategory.objects.get(name=cat_name)
                    return {"id": cat.id, "name": cat.name}
                except ExpenseCategory.DoesNotExist:
                    return {"id": None, "name": cat_name}

    return {"id": None, "name": "Uncategorized"}