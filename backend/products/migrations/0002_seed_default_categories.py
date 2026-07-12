from django.db import migrations


DEFAULT_CATEGORIES = [
    'Abarrotes',
    'Lacteos',
    'Limpieza',
    'Higiene',
    'Conservas',
]


def seed_default_categories(apps, schema_editor):
    Categoria = apps.get_model('products', 'Categoria')

    for name in DEFAULT_CATEGORIES:
        Categoria.objects.get_or_create(nombre=name)


def remove_default_categories(apps, schema_editor):
    Categoria = apps.get_model('products', 'Categoria')
    Categoria.objects.filter(nombre__in=DEFAULT_CATEGORIES).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_default_categories, remove_default_categories),
    ]
