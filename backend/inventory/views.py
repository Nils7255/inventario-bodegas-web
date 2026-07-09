from django.db import transaction
from rest_framework import filters, serializers, viewsets

from inventory.models import MovimientoInventario
from inventory.serializers import MovimientoInventarioSerializer


def _stock_delta(movimiento):
    if movimiento.tipo == MovimientoInventario.TIPO_ENTRADA:
        return movimiento.cantidad
    if movimiento.tipo == MovimientoInventario.TIPO_SALIDA:
        return -movimiento.cantidad
    return movimiento.cantidad - movimiento.producto.stock_actual


def _aplicar_movimiento(movimiento):
    producto = movimiento.producto
    nuevo_stock = producto.stock_actual + _stock_delta(movimiento)
    if nuevo_stock < 0:
        raise serializers.ValidationError({'cantidad': 'La salida supera el stock disponible.'})
    producto.stock_actual = nuevo_stock
    producto.save(update_fields=['stock_actual'])


def _revertir_movimiento(movimiento):
    producto = movimiento.producto
    if movimiento.tipo == MovimientoInventario.TIPO_ENTRADA:
        nuevo_stock = producto.stock_actual - movimiento.cantidad
    elif movimiento.tipo == MovimientoInventario.TIPO_SALIDA:
        nuevo_stock = producto.stock_actual + movimiento.cantidad
    else:
        return

    if nuevo_stock < 0:
        raise serializers.ValidationError({'cantidad': 'No se puede revertir el movimiento sin dejar stock negativo.'})
    producto.stock_actual = nuevo_stock
    producto.save(update_fields=['stock_actual'])


class MovimientoInventarioViewSet(viewsets.ModelViewSet):
    queryset = MovimientoInventario.objects.select_related('producto', 'proveedor', 'usuario').all()
    serializer_class = MovimientoInventarioSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['producto__nombre', 'proveedor__nombre', 'usuario__nombre', 'tipo']
    ordering_fields = ['fecha', 'tipo', 'cantidad']

    @transaction.atomic
    def perform_create(self, serializer):
        movimiento = serializer.save(usuario=self.request.user)
        _aplicar_movimiento(movimiento)

    @transaction.atomic
    def perform_update(self, serializer):
        movimiento_anterior = self.get_object()
        _revertir_movimiento(movimiento_anterior)
        movimiento = serializer.save(usuario=self.request.user)
        _aplicar_movimiento(movimiento)

    @transaction.atomic
    def perform_destroy(self, instance):
        _revertir_movimiento(instance)
        instance.delete()
