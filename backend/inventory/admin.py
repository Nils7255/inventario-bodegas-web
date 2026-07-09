from django.contrib import admin

from inventory.models import MovimientoInventario


@admin.register(MovimientoInventario)
class MovimientoInventarioAdmin(admin.ModelAdmin):
    list_display = ['producto', 'tipo', 'cantidad', 'fecha', 'usuario', 'proveedor']
    list_filter = ['tipo', 'fecha']
    search_fields = ['producto__nombre', 'proveedor__nombre', 'usuario__nombre']
