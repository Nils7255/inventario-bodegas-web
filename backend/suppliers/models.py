from django.db import models


class Proveedor(models.Model):
    nombre = models.CharField(max_length=150, unique=True, verbose_name='nombre')
    contacto = models.CharField(max_length=150, blank=True, verbose_name='contacto')
    telefono = models.CharField(max_length=30, blank=True, verbose_name='telefono')
    correo = models.EmailField(blank=True, verbose_name='correo')
    direccion = models.CharField(max_length=200, blank=True, verbose_name='direccion')
    condiciones_pago = models.CharField(max_length=200, blank=True, verbose_name='condiciones de pago')
    activo = models.BooleanField(default=True, verbose_name='activo')

    class Meta:
        verbose_name = 'proveedor'
        verbose_name_plural = 'proveedores'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre
