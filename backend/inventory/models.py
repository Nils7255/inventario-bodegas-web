from django.db import models


class MovimientoInventario(models.Model):
    TIPO_ENTRADA = 'entrada'
    TIPO_SALIDA = 'salida'
    TIPO_AJUSTE = 'ajuste'

    TIPOS = [
        (TIPO_ENTRADA, 'Entrada'),
        (TIPO_SALIDA, 'Salida'),
        (TIPO_AJUSTE, 'Ajuste'),
    ]

    producto = models.ForeignKey('products.Producto', on_delete=models.PROTECT, related_name='movimientos')
    proveedor = models.ForeignKey(
        'suppliers.Proveedor',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='movimientos',
    )
    usuario = models.ForeignKey('users.Usuario', on_delete=models.PROTECT, related_name='movimientos')
    tipo = models.CharField(max_length=10, choices=TIPOS, verbose_name='tipo')
    cantidad = models.PositiveIntegerField(verbose_name='cantidad')
    fecha = models.DateTimeField(verbose_name='fecha')
    costo_unitario = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='costo unitario',
    )

    class Meta:
        verbose_name = 'movimiento de inventario'
        verbose_name_plural = 'movimientos de inventario'
        ordering = ['-fecha']

    def __str__(self):
        return f'{self.get_tipo_display()} - {self.producto}'
