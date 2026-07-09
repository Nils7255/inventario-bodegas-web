from django.utils import timezone
from rest_framework import serializers

from inventory.models import MovimientoInventario


class MovimientoInventarioSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    usuario_nombre = serializers.CharField(source='usuario.nombre', read_only=True)

    class Meta:
        model = MovimientoInventario
        fields = [
            'id',
            'producto',
            'producto_nombre',
            'proveedor',
            'proveedor_nombre',
            'usuario',
            'usuario_nombre',
            'tipo',
            'cantidad',
            'fecha',
            'costo_unitario',
        ]
        read_only_fields = ['usuario']
        extra_kwargs = {
            'fecha': {'required': False, 'default': timezone.now},
        }
