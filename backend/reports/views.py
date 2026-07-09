from django.db import models
from rest_framework.response import Response
from rest_framework.views import APIView

from alerts.models import Alerta
from inventory.models import MovimientoInventario
from products.models import Producto
from reports.serializers import ResumenInventarioSerializer
from suppliers.models import Proveedor


class ResumenInventarioView(APIView):
    def get(self, request):
        data = {
            'productos': Producto.objects.count(),
            'proveedores_activos': Proveedor.objects.filter(activo=True).count(),
            'movimientos': MovimientoInventario.objects.count(),
            'alertas_pendientes': Alerta.objects.filter(atendida=False).count(),
            'productos_stock_bajo': Producto.objects.filter(stock_actual__lte=models.F('stock_minimo')).count(),
        }
        serializer = ResumenInventarioSerializer(data)
        return Response(serializer.data)
