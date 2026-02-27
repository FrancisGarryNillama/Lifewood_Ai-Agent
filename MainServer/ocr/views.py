from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import ReceiptUploadSerializer, OCRResultSerializer
from .services import extract_text
from .parser import parse_receipt
from .categorizer import suggest_category


class ReceiptOCRView(APIView):
    """
    POST an image → get back structured parsed receipt data.
    """

    def post(self, request):
        ser = ReceiptUploadSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        image = ser.validated_data["image"]

        # 1. OCR
        ocr = extract_text(image)

        # 2. Parse
        parsed = parse_receipt(ocr["lines"], ocr["paragraph"])

        # 3. Auto-categorise
        cat = suggest_category(ocr["paragraph"])

        payload = {
            **parsed,
            "suggested_category": cat,
            "confidence": ocr["avg_confidence"],
        }

        out = OCRResultSerializer(payload)
        return Response(out.data, status=status.HTTP_200_OK)