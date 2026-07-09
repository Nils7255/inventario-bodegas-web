from rest_framework import serializers


class ResumenInventarioSerializer(serializers.Serializer):
    productos = serializers.IntegerField()
    proveedores_activos = serializers.IntegerField()
    movimientos = serializers.IntegerField()
    alertas_pendientes = serializers.IntegerField()
    productos_stock_bajo = serializers.IntegerField()
