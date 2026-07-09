from django.urls import include, path
from rest_framework.routers import DefaultRouter

from alerts.views import AlertaViewSet

router = DefaultRouter()
router.register('alertas', AlertaViewSet, basename='alerta')

urlpatterns = [
    path('', include(router.urls)),
]
