from django.contrib import admin

from suppliers.models import Proveedor


@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'contacto', 'telefono', 'correo', 'activo']
    list_filter = ['activo']
    search_fields = ['nombre', 'contacto', 'correo', 'telefono']
