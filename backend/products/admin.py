from django.contrib import admin

from products.models import Categoria, Producto


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nombre']
    search_fields = ['nombre']


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'categoria', 'stock_actual', 'stock_minimo', 'precio_venta']
    list_filter = ['categoria']
    search_fields = ['nombre', 'categoria__nombre']
