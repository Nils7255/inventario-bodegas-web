from django.urls import path

from reports.views import ResumenInventarioView

urlpatterns = [
    path('resumen/', ResumenInventarioView.as_view(), name='reporte-resumen'),
]
