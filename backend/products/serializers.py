from rest_framework import serializers

from products.models import Categoria, Producto


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre']


class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)

    class Meta:
        model = Producto
        fields = [
            'id',
            'nombre',
            'categoria',
            'categoria_nombre',
            'unidad_medida',
            'precio_compra',
            'precio_venta',
            'stock_actual',
            'stock_minimo',
        ]
        read_only_fields = ['stock_actual']
