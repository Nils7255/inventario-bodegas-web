from django.urls import include, path
from rest_framework.routers import DefaultRouter

from suppliers.views import ProveedorViewSet

router = DefaultRouter()
router.register('proveedores', ProveedorViewSet, basename='proveedor')

urlpatterns = [
    path('', include(router.urls)),
]
