from django.urls import path
from .views import ReceiptOCRView

urlpatterns = [
    path("extract/", ReceiptOCRView.as_view(), name="ocr-extract"),
]