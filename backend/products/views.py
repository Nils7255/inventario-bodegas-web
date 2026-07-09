from rest_framework import filters, viewsets

from products.models import Categoria, Producto
from products.serializers import CategoriaSerializer, ProductoSerializer


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre']
    ordering_fields = ['nombre']


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.select_related('categoria').all()
    serializer_class = ProductoSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'categoria__nombre']
    ordering_fields = ['nombre', 'stock_actual', 'stock_minimo', 'precio_venta']
