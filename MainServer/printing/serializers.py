from rest_framework import serializers
from .models import PrinterAccreditation


class PrinterAccreditationSerializer(serializers.ModelSerializer):
    valid_until_date = serializers.DateField(read_only=True)

    class Meta:
        model = PrinterAccreditation
        fields = "__all__"