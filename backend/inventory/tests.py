from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.test import APITestCase

from products.models import Categoria, Producto
from users.models import Rol, Usuario


class MovimientoInventarioAPITests(APITestCase):
    def setUp(self):
        rol = Rol.objects.create(nombre='Administrador')
        self.usuario = Usuario.objects.create(
            nombre='Admin',
            correo='admin@example.com',
            password=make_password('admin12345'),
            rol=rol,
        )
        categoria = Categoria.objects.create(nombre='Abarrotes')
        self.producto = Producto.objects.create(
            nombre='Arroz',
            categoria=categoria,
            unidad_medida='kg',
            precio_compra='3.50',
            precio_venta='4.20',
            stock_minimo=5,
        )
        self.client.force_authenticate(user=self.usuario)

    def test_crear_entrada_actualiza_stock(self):
        response = self.client.post(
            '/api/inventario/movimientos/',
            {
                'producto': self.producto.id,
                'tipo': 'entrada',
                'cantidad': 10,
                'costo_unitario': '3.50',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.producto.refresh_from_db()
        self.assertEqual(self.producto.stock_actual, 10)

    def test_salida_no_permite_stock_negativo(self):
        response = self.client.post(
            '/api/inventario/movimientos/',
            {
                'producto': self.producto.id,
                'tipo': 'salida',
                'cantidad': 1,
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.producto.refresh_from_db()
        self.assertEqual(self.producto.stock_actual, 0)
