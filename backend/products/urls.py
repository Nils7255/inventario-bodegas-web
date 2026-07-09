from django.urls import include, path
from rest_framework.routers import DefaultRouter

from products.views import CategoriaViewSet, ProductoViewSet

router = DefaultRouter()
router.register('categorias', CategoriaViewSet, basename='categoria')
router.register('productos', ProductoViewSet, basename='producto')

urlpatterns = [
    path('', include(router.urls)),
]
