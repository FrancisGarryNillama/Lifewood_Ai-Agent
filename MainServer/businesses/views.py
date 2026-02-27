from rest_framework import viewsets
from .models import Seller
from .serializers import SellerSerializer

class SellerViewSet(viewsets.ModelViewSet):
    queryset = Seller.objects.all()
    serializer_class = SellerSerializer