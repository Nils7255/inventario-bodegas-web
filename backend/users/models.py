from django.db import models


class Rol(models.Model):
    nombre = models.CharField(max_length=50, unique=True, verbose_name='nombre')

    class Meta:
        verbose_name = 'rol'
        verbose_name_plural = 'roles'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Usuario(models.Model):
    nombre = models.CharField(max_length=150, verbose_name='nombre')
    correo = models.EmailField(unique=True, verbose_name='correo')
    password = models.CharField(max_length=128, default='', verbose_name='contrasena')
    rol = models.ForeignKey(Rol, on_delete=models.PROTECT, related_name='usuarios')
    activo = models.BooleanField(default=True, verbose_name='activo')

    @property
    def is_authenticated(self):
        return True

    class Meta:
        verbose_name = 'usuario'
        verbose_name_plural = 'usuarios'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre
