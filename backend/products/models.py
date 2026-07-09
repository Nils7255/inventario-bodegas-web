from django.db import models


class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True, verbose_name='nombre')

    class Meta:
        verbose_name = 'categoria'
        verbose_name_plural = 'categorias'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    nombre = models.CharField(max_length=150, verbose_name='nombre')
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name='productos')
    unidad_medida = models.CharField(max_length=50, verbose_name='unidad de medida')
    precio_compra = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='precio de compra')
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='precio de venta')
    stock_actual = models.PositiveIntegerField(default=0, verbose_name='stock actual')
    stock_minimo = models.PositiveIntegerField(default=0, verbose_name='stock minimo')

    class Meta:
        verbose_name = 'producto'
        verbose_name_plural = 'productos'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre
