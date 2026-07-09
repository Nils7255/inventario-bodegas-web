from django.contrib import admin

from users.models import Rol, Usuario


@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ['nombre']
    search_fields = ['nombre']


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'correo', 'rol', 'activo']
    list_filter = ['rol', 'activo']
    search_fields = ['nombre', 'correo']
