from django.contrib import admin

from alerts.models import Alerta


@admin.register(Alerta)
class AlertaAdmin(admin.ModelAdmin):
    list_display = ['producto', 'fecha', 'atendida', 'dias_estimados_agotamiento']
    list_filter = ['atendida', 'fecha']
    search_fields = ['producto__nombre']
