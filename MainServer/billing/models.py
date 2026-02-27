from django.db import models
from decimal import Decimal

from businesses.models import Seller
from accounts.models import Buyer
from printing.models import PrinterAccreditation


class ExpenseCategory(models.Model):
    """
    Predefined expense categories following common Philippine BIR
    chart-of-accounts groupings.
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    keywords = models.TextField(
        blank=True,
        help_text="Comma-separated keywords used by the auto-categoriser."
    )

    class Meta:
        verbose_name_plural = "Expense Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Receipt(models.Model):

    OFFICIAL_RECEIPT = "OFFICIAL_RECEIPT"
    SALES_INVOICE = "SALES_INVOICE"

    RECEIPT_TYPE_CHOICES = [
        (OFFICIAL_RECEIPT, "Official Receipt"),
        (SALES_INVOICE, "Sales Invoice"),
    ]

    seller = models.ForeignKey(
        Seller,
        on_delete=models.PROTECT,
        related_name="receipts",
    )
    buyer = models.ForeignKey(
        Buyer,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="receipts",
    )
    category = models.ForeignKey(
        ExpenseCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="receipts",
    )

    receipt_type = models.CharField(max_length=20, choices=RECEIPT_TYPE_CHOICES)
    serial_number = models.CharField(max_length=100)
    transaction_date = models.DateTimeField()

    gross_sales = models.DecimalField(max_digits=15, decimal_places=2)
    vatable_sales = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    vat_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    vat_exempt_sales = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    zero_rated_sales = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    total_amount_due = models.DecimalField(max_digits=15, decimal_places=2)

    atp = models.ForeignKey(
        PrinterAccreditation,
        on_delete=models.PROTECT,
        related_name="receipts",
        null=True,
        blank=True,
    )

    non_vat_disclaimer = models.TextField(
        blank=True,
        null=True,
        default="THIS DOCUMENT IS NOT VALID FOR CLAIM OF INPUT TAX.",
    )

    receipt_image = models.ImageField(
        upload_to="receipts/%Y/%m/",
        null=True,
        blank=True,
    )
    raw_ocr_text = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_vat_registered(self):
        return self.seller.vat_status == Seller.VAT

    def __str__(self):
        return f"{self.serial_number} - {self.seller.registered_business_name}"


class ReceiptItem(models.Model):
    receipt = models.ForeignKey(
        Receipt,
        on_delete=models.CASCADE,
        related_name="items",
    )
    description = models.TextField()
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_cost = models.DecimalField(max_digits=15, decimal_places=2)
    line_total = models.DecimalField(max_digits=15, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.line_total = self.quantity * self.unit_cost
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.description} ({self.receipt.serial_number})"