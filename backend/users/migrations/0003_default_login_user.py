from django.contrib.auth.hashers import make_password
from django.db import migrations


def create_default_login_user(apps, schema_editor):
    Rol = apps.get_model('users', 'Rol')
    Usuario = apps.get_model('users', 'Usuario')

    rol, _ = Rol.objects.get_or_create(nombre='Administrador')
    Usuario.objects.update_or_create(
        correo='nilsbran@gmail.com',
        defaults={
            'nombre': 'Nils Bran',
            'password': make_password('nilsbran123'),
            'rol': rol,
            'activo': True,
        },
    )


def remove_default_login_user(apps, schema_editor):
    Usuario = apps.get_model('users', 'Usuario')
    Usuario.objects.filter(correo='nilsbran@gmail.com').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_usuario_password'),
    ]

    operations = [
        migrations.RunPython(create_default_login_user, remove_default_login_user),
    ]
