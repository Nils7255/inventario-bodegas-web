from django.db import models


class Alerta(models.Model):
    producto = models.ForeignKey('products.Producto', on_delete=models.CASCADE, related_name='alertas')
    fecha = models.DateTimeField(verbose_name='fecha')
    atendida = models.BooleanField(default=False, verbose_name='atendida')
    dias_estimados_agotamiento = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='dias estimados hasta agotamiento',
    )

    class Meta:
        verbose_name = 'alerta'
        verbose_name_plural = 'alertas'
        ordering = ['-fecha']

    def __str__(self):
        return f'Alerta - {self.producto}'
