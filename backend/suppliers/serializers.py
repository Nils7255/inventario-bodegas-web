from rest_framework import serializers

from suppliers.models import Proveedor


class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = [
            'id',
            'nombre',
            'contacto',
            'telefono',
            'correo',
            'direccion',
            'condiciones_pago',
            'activo',
        ]
