from .models import Perfil, Figura
from .forms import PerfilForm
from django.db.models import Sum

def perfil_global(request):
    from .models import Alien
    if Alien.objects.count() == 0:
        Alien.seed_default_aliens()

    # Intentamos obtener el perfil existente, si no, creamos uno por defecto
    perfil = Perfil.objects.first()
    if not perfil:
        perfil = Perfil.objects.create(
            nombre='Ben Tennyson',
            alien_favorito='Fuego',
            omnitrix_favorito='Clásico',
            avatar='icon1',
            rango='recluta'
        )
    
    form_perfil = PerfilForm(instance=perfil)
    
    # Calcular estadísticas agregadas
    figuras_count = Figura.objects.filter(estado_coleccion='coleccion').count()
    valor_total = Figura.objects.filter(estado_coleccion='coleccion').aggregate(Sum('precio'))['precio__sum'] or 0
    aliens_unicos = Figura.objects.filter(estado_coleccion='coleccion').values('nombre').distinct().count()

    # Conteos por serie
    count_ben10 = Figura.objects.filter(serie='Ben 10', estado_coleccion='coleccion').count()
    count_af    = Figura.objects.filter(serie='Ben 10 Alien Force', estado_coleccion='coleccion').count()
    count_ov    = Figura.objects.filter(serie='Ben 10 Omniverse', estado_coleccion='coleccion').count()
    count_villanos = Figura.objects.filter(serie='Villanos', estado_coleccion='coleccion').count()
    count_personajes = Figura.objects.filter(serie='Personajes', estado_coleccion='coleccion').count()

    # Rango editable asignado al perfil
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

    # Obtener todos los aliens únicos registrados de las figuras creadas en DB
    aliens_en_db = list(Figura.objects.filter(estado_coleccion='coleccion').values_list('nombre', flat=True).distinct())
    
    # Lista predeterminada de aliens icónicos de Ben 10 como fallback/iniciales
    aliens_predeterminados = [
        "Fuego", "Cuatro Brazos", "Bestia", "XLR8", "Materia Gris", 
        "Ultra T", "Diamante", "Fauces", "Insectoide", "Fantasmático", 
        "Cannonbolt", "Wildvine", "Upchuck", "Muy Grande", "Feedback", 
        "Humungosaurio", "Fuego Pantanoso", "Frío", "Eco Eco", "Rath", "Gloop"
    ]
    # Unificar
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

