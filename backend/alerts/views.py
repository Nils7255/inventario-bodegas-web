from django.db import models
from django.utils import timezone
from rest_framework import decorators, filters, response, viewsets

from alerts.models import Alerta
from alerts.serializers import AlertaSerializer
from products.models import Producto


class AlertaViewSet(viewsets.ModelViewSet):
    queryset = Alerta.objects.select_related('producto').all()
    serializer_class = AlertaSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['producto__nombre']
    ordering_fields = ['fecha', 'atendida', 'dias_estimados_agotamiento']

    @decorators.action(detail=False, methods=['post'], url_path='generar-stock-bajo')
    def generar_stock_bajo(self, request):
        productos = Producto.objects.filter(stock_actual__lte=models.F('stock_minimo'))
        creadas = 0

        for producto in productos:
            _, created = Alerta.objects.get_or_create(
                producto=producto,
                atendida=False,
                defaults={'fecha': timezone.now()},
            )
            if created:
                creadas += 1

        return response.Response({'alertas_creadas': creadas})
