from rest_framework import serializers


class ReceiptUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()


class ItemParsedSerializer(serializers.Serializer):
    description = serializers.CharField(allow_blank=True)
    quantity = serializers.CharField(allow_blank=True)
    unit_cost = serializers.CharField(allow_blank=True)
    line_total = serializers.CharField(allow_blank=True)


class SellerParsedSerializer(serializers.Serializer):
    registered_business_name = serializers.CharField(allow_blank=True)
    business_address = serializers.CharField(allow_blank=True)
    tin = serializers.CharField(allow_blank=True)
    vat_status = serializers.CharField(allow_blank=True)


class BuyerParsedSerializer(serializers.Serializer):
    buyer_name = serializers.CharField(allow_blank=True)
    buyer_address = serializers.CharField(allow_blank=True)
    buyer_tin = serializers.CharField(allow_blank=True)


class ReceiptParsedSerializer(serializers.Serializer):
    receipt_type = serializers.CharField(allow_blank=True)
    serial_number = serializers.CharField(allow_blank=True)
    transaction_date = serializers.CharField(allow_blank=True)
    gross_sales = serializers.CharField(allow_blank=True)
    vatable_sales = serializers.CharField(allow_blank=True)
    vat_amount = serializers.CharField(allow_blank=True)
    vat_exempt_sales = serializers.CharField(allow_blank=True)
    zero_rated_sales = serializers.CharField(allow_blank=True)
    total_amount_due = serializers.CharField(allow_blank=True)


class PrinterParsedSerializer(serializers.Serializer):
    authority_to_print_number = serializers.CharField(allow_blank=True)
    printer_name = serializers.CharField(allow_blank=True)
    printer_tin = serializers.CharField(allow_blank=True)
    printer_address = serializers.CharField(allow_blank=True)
    atp_issue_date = serializers.CharField(allow_blank=True)
    bir_permit_number = serializers.CharField(allow_blank=True)
    serial_start = serializers.CharField(allow_blank=True)
    serial_end = serializers.CharField(allow_blank=True)


class CategorySuggestionSerializer(serializers.Serializer):
    id = serializers.IntegerField(allow_null=True)
    name = serializers.CharField()


class OCRResultSerializer(serializers.Serializer):
    seller = SellerParsedSerializer()
    buyer = BuyerParsedSerializer()
    receipt = ReceiptParsedSerializer()
    items = ItemParsedSerializer(many=True)
    printer = PrinterParsedSerializer()
    suggested_category = CategorySuggestionSerializer()
    raw_text = serializers.CharField()
    confidence = serializers.FloatField()