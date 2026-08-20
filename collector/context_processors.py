from .models import Perfil, Figura
from .forms import PerfilForm
from django.db.models import Sum

def perfil_global(request):
    from .models import Alien
    if Alien.objects.count() == 0:
        Alien.seed_default_aliens()

    if request.user.is_authenticated:
        perfil, _ = Perfil.objects.get_or_create(
            user=request.user,
            defaults={
                'nombre': request.user.username.capitalize(),
                'alien_favorito': 'Fuego',
                'omnitrix_favorito': 'Clásico',
                'avatar': 'ben_clasico',
                'rango': 'recluta'
            }
        )
        user_figuras = Figura.objects.filter(user=request.user)
    else:
        perfil = Perfil.objects.filter(user__isnull=True).first()
        if not perfil:
            perfil = Perfil(
                nombre='Invitado',
                alien_favorito='Fuego',
                omnitrix_favorito='Clásico',
                avatar='ben_clasico',
                rango='recluta'
            )
        user_figuras = Figura.objects.none()

    form_perfil = PerfilForm(instance=perfil) if request.user.is_authenticated else None

    # Calcular estadísticas agregadas
    figuras_count = user_figuras.filter(estado_coleccion='coleccion').count()
    valor_total = user_figuras.filter(estado_coleccion='coleccion').aggregate(Sum('precio'))['precio__sum'] or 0
    aliens_unicos = user_figuras.filter(estado_coleccion='coleccion').values('nombre').distinct().count()

    # Conteos por serie
    count_ben10 = user_figuras.filter(serie='Ben 10', estado_coleccion='coleccion').count()
    count_af    = user_figuras.filter(serie='Ben 10 Alien Force', estado_coleccion='coleccion').count()
    count_ov    = user_figuras.filter(serie='Ben 10 Omniverse', estado_coleccion='coleccion').count()
    count_villanos = user_figuras.filter(serie='Villanos', estado_coleccion='coleccion').count()
    count_personajes = user_figuras.filter(serie='Personajes', estado_coleccion='coleccion').count()

    rango = perfil.get_rango_display()
    
    rango_class_map = {
        'recluta': 'rango-novato',
        'cadete': 'rango-novato',
        'elite': 'rango-elite',
        'magister': 'rango-elite',
        'omni': 'rango-omni',
        'protector': 'rango-omni',
        'heroe': 'rango-omni',
    }
    rango_class = rango_class_map.get(perfil.rango, 'rango-novato')

    aliens_en_db = list(user_figuras.filter(estado_coleccion='coleccion').values_list('nombre', flat=True).distinct())
    
    aliens_predeterminados = [
        "Fuego", "Cuatro Brazos", "Bestia", "XLR8", "Materia Gris", 
        "Ultra T", "Diamante", "Fauces", "Insectoide", "Fantasmático", 
        "Cannonbolt", "Wildvine", "Upchuck", "Muy Grande", "Feedback", 
        "Humungosaurio", "Fuego Pantanoso", "Frío", "Eco Eco", "Rath", "Gloop"
    ]
    todos_los_aliens_raw = list(set(aliens_en_db + aliens_predeterminados))

    alien_orders = {a.nombre: a.orden_aparicion for a in Alien.objects.all()}
    def get_sort_key(name):
        normalized_map = {
            'Cuatro Brazos': 'Cuatrobrazos',
            'Ultra T': 'Ultra-T',
            'Fauces': 'Acuático',
            'Gloop': 'Goop'
        }
        mapped_name = normalized_map.get(name, name)
        return (alien_orders.get(mapped_name, 999), name)

    todos_los_aliens = sorted(todos_los_aliens_raw, key=get_sort_key)

    import os
    from django.conf import settings
    banners_dir = os.path.join(settings.MEDIA_ROOT, 'banner')
    banners_list = []
    if os.path.exists(banners_dir):
        banners_list = [f for f in os.listdir(banners_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.avif'))]
    else:
        banners_list = ['Alien-x.jpg']

    return {
        'perfil': perfil,
        'perfil_form': form_perfil,
        'perfil_rango': rango,
        'perfil_rango_class': rango_class,
        'perfil_figuras_count': figuras_count,
        'perfil_valor_total': valor_total,
        'perfil_aliens_unicos': aliens_unicos,
        'perfil_count_ben10': count_ben10,
        'perfil_count_af': count_af,
        'perfil_count_ov': count_ov,
        'perfil_count_villanos': count_villanos,
        'perfil_count_personajes': count_personajes,
        'todos_los_aliens_list': todos_los_aliens,
        'banners_list': banners_list,
    }

