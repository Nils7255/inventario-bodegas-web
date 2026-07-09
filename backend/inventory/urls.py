from django.urls import include, path
from rest_framework.routers import DefaultRouter

from inventory.views import MovimientoInventarioViewSet

router = DefaultRouter()
router.register('movimientos', MovimientoInventarioViewSet, basename='movimiento')

urlpatterns = [
    path('', include(router.urls)),
]
