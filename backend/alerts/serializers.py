from rest_framework import serializers

from alerts.models import Alerta


class AlertaSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    stock_actual = serializers.IntegerField(source='producto.stock_actual', read_only=True)
    stock_minimo = serializers.IntegerField(source='producto.stock_minimo', read_only=True)

    class Meta:
        model = Alerta
        fields = [
            'id',
            'producto',
            'producto_nombre',
            'stock_actual',
            'stock_minimo',
            'fecha',
            'atendida',
            'dias_estimados_agotamiento',
        ]
