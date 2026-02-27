from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import Receipt, ExpenseCategory
from .serializers import (
    ReceiptReadSerializer,
    ReceiptCreateSerializer,
    ExpenseCategorySerializer,
)


class ExpenseCategoryViewSet(viewsets.ModelViewSet):
    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer


class ReceiptViewSet(viewsets.ModelViewSet):
    queryset = Receipt.objects.select_related(
        "seller", "buyer", "category"
    ).prefetch_related("items").order_by("-transaction_date")

    def get_serializer_class(self):
        if self.action == "create":
            return ReceiptCreateSerializer
        return ReceiptReadSerializer

    def create(self, request, *args, **kwargs):
        ser = ReceiptCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        receipt = ser.save()
        out = ReceiptReadSerializer(receipt)
        return Response(out.data, status=status.HTTP_201_CREATED)