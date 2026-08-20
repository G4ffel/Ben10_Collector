from django.db import migrations
from django.contrib.auth.hashers import make_password

def assign_existing_data_to_gaffel(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    Figura = apps.get_model('collector', 'Figura')
    WishlistItem = apps.get_model('collector', 'WishlistItem')
    Perfil = apps.get_model('collector', 'Perfil')

    gaffel, created = User.objects.get_or_create(
        username='gaffel',
        defaults={
            'email': 'gaffel@ben10collector.com',
            'is_staff': True,
            'is_superuser': True,
            'password': make_password('gaffel123'),
        }
    )
    if not created:
        gaffel.password = make_password('gaffel123')
        gaffel.is_staff = True
        gaffel.is_superuser = True
        gaffel.save()

    Figura.objects.filter(user__isnull=True).update(user=gaffel)
    WishlistItem.objects.filter(user__isnull=True).update(user=gaffel)

    perfil = Perfil.objects.filter(user__isnull=True).first()
    if perfil:
        perfil.user = gaffel
        perfil.nombre = 'Gaffel'
        perfil.save()
    else:
        Perfil.objects.get_or_create(user=gaffel, defaults={'nombre': 'Gaffel'})

def reverse_assign(apps, schema_editor):
    pass

class Migration(migrations.Migration):
    dependencies = [
        ('collector', '0026_figura_user_perfil_user_wishlistitem_user'),
    ]

    operations = [
        migrations.RunPython(assign_existing_data_to_gaffel, reverse_code=reverse_assign),
    ]
