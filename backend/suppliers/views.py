from rest_framework import filters, viewsets

from suppliers.models import Proveedor
from suppliers.serializers import ProveedorSerializer


class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'contacto', 'correo', 'telefono']
    ordering_fields = ['nombre', 'activo']
