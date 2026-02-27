from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReceiptViewSet, ExpenseCategoryViewSet

router = DefaultRouter()
router.register(r"receipts", ReceiptViewSet, basename="receipt")
router.register(r"categories", ExpenseCategoryViewSet, basename="category")

urlpatterns = [
    path("", include(router.urls)),
]