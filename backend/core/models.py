from django.db import models


class ConfiguracionSistema(models.Model):
    clave = models.CharField(max_length=100, unique=True, verbose_name='clave')
    valor = models.CharField(max_length=255, blank=True, verbose_name='valor')

    class Meta:
        verbose_name = 'configuracion del sistema'
        verbose_name_plural = 'configuraciones del sistema'
        ordering = ['clave']

    def __str__(self):
        return self.clave
