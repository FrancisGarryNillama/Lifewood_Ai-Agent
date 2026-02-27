from rest_framework import serializers
from .models import Seller, BusinessCompliance


class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = "__all__"


class BusinessComplianceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessCompliance
        fields = "__all__"