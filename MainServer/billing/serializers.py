from rest_framework import serializers
from django.db import transaction
from decimal import Decimal, InvalidOperation
from dateutil import parser as dateutil_parser

from .models import Receipt, ReceiptItem, ExpenseCategory
from businesses.models import Seller
from accounts.models import Buyer
from printing.models import PrinterAccreditation


class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = "__all__"


class ReceiptItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReceiptItem
        fields = ["id", "description", "quantity", "unit_cost", "line_total"]
        read_only_fields = ["line_total"]


class ReceiptReadSerializer(serializers.ModelSerializer):
    items = ReceiptItemSerializer(many=True, read_only=True)
    seller_name = serializers.CharField(
        source="seller.registered_business_name", read_only=True
    )
    buyer_name = serializers.CharField(
        source="buyer.buyer_name", read_only=True, default=""
    )
    category_name = serializers.CharField(
        source="category.name", read_only=True, default=""
    )

    class Meta:
        model = Receipt
        fields = "__all__"


class ReceiptCreateSerializer(serializers.Serializer):
    """
    Accepts the full parsed payload from the frontend review form
    and creates / links all related objects in one transaction.
    """

    # ── seller ──
    seller_name = serializers.CharField()
    seller_address = serializers.CharField(allow_blank=True, default="")
    seller_tin = serializers.CharField(allow_blank=True, default="")
    seller_vat_status = serializers.ChoiceField(
        choices=["VAT", "NON_VAT"], default="NON_VAT"
    )

    # ── buyer ──
    buyer_name = serializers.CharField(allow_blank=True, default="")
    buyer_address = serializers.CharField(allow_blank=True, default="")
    buyer_tin = serializers.CharField(allow_blank=True, default="")

    # ── receipt ──
    receipt_type = serializers.ChoiceField(
        choices=["OFFICIAL_RECEIPT", "SALES_INVOICE"],
        default="OFFICIAL_RECEIPT",
    )
    serial_number = serializers.CharField()
    transaction_date = serializers.CharField()
    gross_sales = serializers.CharField()
    vatable_sales = serializers.CharField(allow_blank=True, default="")
    vat_amount = serializers.CharField(allow_blank=True, default="")
    vat_exempt_sales = serializers.CharField(allow_blank=True, default="")
    zero_rated_sales = serializers.CharField(allow_blank=True, default="")
    total_amount_due = serializers.CharField()

    # ── category ──
    category_id = serializers.IntegerField(required=False, allow_null=True)

    # ── printer (optional) ──
    atp_number = serializers.CharField(allow_blank=True, default="")
    printer_name = serializers.CharField(allow_blank=True, default="")
    printer_tin = serializers.CharField(allow_blank=True, default="")
    printer_address = serializers.CharField(allow_blank=True, default="")
    atp_issue_date = serializers.CharField(allow_blank=True, default="")
    bir_permit_number = serializers.CharField(allow_blank=True, default="")
    serial_start = serializers.CharField(allow_blank=True, default="")
    serial_end = serializers.CharField(allow_blank=True, default="")

    # ── items ──
    items = ReceiptItemSerializer(many=True, required=False)

    # ── raw ──
    raw_ocr_text = serializers.CharField(allow_blank=True, default="")

    # ── image ──
    receipt_image = serializers.ImageField(required=False)

    # helpers
    def _dec(self, val):
        try:
            return Decimal(val.replace(",", ""))
        except (InvalidOperation, AttributeError):
            return Decimal("0.00")

    def _parse_date(self, val):
        try:
            return dateutil_parser.parse(val)
        except Exception:
            from django.utils import timezone
            return timezone.now()

    @transaction.atomic
    def create(self, validated_data):
        d = validated_data
        items_data = d.pop("items", [])

        # ── seller (get or create by TIN) ──
        seller_tin = d["seller_tin"].strip()
        if seller_tin:
            seller, _ = Seller.objects.get_or_create(
                tin=seller_tin,
                defaults={
                    "registered_business_name": d["seller_name"],
                    "business_address": d["seller_address"],
                    "vat_status": d["seller_vat_status"],
                },
            )
        else:
            seller = Seller.objects.create(
                registered_business_name=d["seller_name"],
                business_address=d["seller_address"],
                tin="000-000-000-000",
                vat_status=d["seller_vat_status"],
            )

        # ── buyer ──
        buyer = None
        if d.get("buyer_name"):
            buyer_tin = d.get("buyer_tin", "").strip()
            if buyer_tin:
                buyer, _ = Buyer.objects.get_or_create(
                    buyer_tin=buyer_tin,
                    defaults={
                        "buyer_name": d["buyer_name"],
                        "buyer_address": d.get("buyer_address", ""),
                    },
                )
            else:
                buyer = Buyer.objects.create(
                    buyer_name=d["buyer_name"],
                    buyer_address=d.get("buyer_address", ""),
                )

        # ── category ──
        category = None
        cat_id = d.get("category_id")
        if cat_id:
            try:
                category = ExpenseCategory.objects.get(pk=cat_id)
            except ExpenseCategory.DoesNotExist:
                pass

        # ── printer accreditation (optional) ──
        atp = None
        atp_number = d.get("atp_number", "").strip()
        if atp_number:
            atp_defaults = {
                "printer_name": d.get("printer_name", ""),
                "printer_address": d.get("printer_address", ""),
                "printer_tin": d.get("printer_tin", "000-000-000-000"),
                "bir_permit_number": d.get("bir_permit_number", ""),
                "serial_start": d.get("serial_start", ""),
                "serial_end": d.get("serial_end", ""),
            }
            atp_issue = d.get("atp_issue_date", "").strip()
            if atp_issue:
                try:
                    atp_defaults["atp_issue_date"] = dateutil_parser.parse(
                        atp_issue
                    ).date()
                except Exception:
                    from datetime import date
                    atp_defaults["atp_issue_date"] = date.today()
            else:
                from datetime import date
                atp_defaults["atp_issue_date"] = date.today()

            atp, _ = PrinterAccreditation.objects.get_or_create(
                authority_to_print_number=atp_number,
                defaults=atp_defaults,
            )

        # ── receipt ──
        receipt = Receipt.objects.create(
            seller=seller,
            buyer=buyer,
            category=category,
            receipt_type=d["receipt_type"],
            serial_number=d["serial_number"],
            transaction_date=self._parse_date(d["transaction_date"]),
            gross_sales=self._dec(d["gross_sales"]),
            vatable_sales=self._dec(d.get("vatable_sales", "")),
            vat_amount=self._dec(d.get("vat_amount", "")),
            vat_exempt_sales=self._dec(d.get("vat_exempt_sales", "")),
            zero_rated_sales=self._dec(d.get("zero_rated_sales", "")),
            total_amount_due=self._dec(d["total_amount_due"]),
            atp=atp,
            raw_ocr_text=d.get("raw_ocr_text", ""),
            receipt_image=d.get("receipt_image"),
        )

        # ── items ──
        for item in items_data:
            ReceiptItem.objects.create(
                receipt=receipt,
                description=item.get("description", ""),
                quantity=Decimal(str(item.get("quantity", "1"))),
                unit_cost=Decimal(
                    str(item.get("unit_cost", "0")).replace(",", "")
                ),
            )

        return receipt