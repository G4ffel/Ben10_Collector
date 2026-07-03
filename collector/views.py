from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Sum, Avg, Max
from django.core.paginator import Paginator
from .forms import FiguraForm, PerfilForm
from .models import Figura, Perfil, Alien

def coleccion(request):
    if request.method == 'POST':
        form = FiguraForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('coleccion')
    else:
        form = FiguraForm()
    
    figuras_classic = Figura.objects.filter(serie='Ben 10')
    figuras_af = Figura.objects.filter(serie='Ben 10 Alien Force')
    figuras_ov = Figura.objects.filter(serie='Ben 10 Omniverse')
    figuras_villanos = Figura.objects.filter(serie='Villanos')
    figuras_personajes = Figura.objects.filter(serie='Personajes')
    figuras_count = Figura.objects.count()
    aliens = Alien.objects.all().order_by('nombre')

    def get_grouped_figures(queryset):
        grouped = []
        std = queryset.filter(subcategoria='')
        if std.exists():
            grouped.append(('', std))
        for sub_val, sub_label in Figura.SUBCATEGORIA_CHOICES:
            if sub_val == '':
                continue
            sub_qs = queryset.filter(subcategoria=sub_val)
            if sub_qs.exists():
                grouped.append((sub_label, sub_qs))
        return grouped

    figuras_classic_grouped = get_grouped_figures(figuras_classic)
    figuras_af_grouped = get_grouped_figures(figuras_af)
    figuras_ov_grouped = get_grouped_figures(figuras_ov)
    figuras_personajes_grouped = get_grouped_figures(figuras_personajes)
    figuras_villanos_grouped = get_grouped_figures(figuras_villanos)

    figuras_classic_count = figuras_classic.count()
    figuras_af_count = figuras_af.count()
    figuras_ov_count = figuras_ov.count()
    figuras_personajes_count = figuras_personajes.count()
    figuras_villanos_count = figuras_villanos.count()

    aliens_por_serie = {
        'Ben 10': list(aliens.filter(serie_default='Ben 10').values_list('nombre', flat=True)),
        'Ben 10 Alien Force': list(aliens.filter(serie_default='Ben 10 Alien Force').values_list('nombre', flat=True)),
        'Ben 10 Omniverse': list(aliens.filter(serie_default='Ben 10 Omniverse').values_list('nombre', flat=True)),
        'Personajes': list(aliens.filter(serie_default='Personajes').values_list('nombre', flat=True)),
        'Villanos': list(aliens.filter(serie_default='Villanos').values_list('nombre', flat=True)),
    }

    return render(request, 'collector/coleccion.html', {
        'figuras_classic_grouped': figuras_classic_grouped,
        'figuras_af_grouped': figuras_af_grouped,
        'figuras_ov_grouped': figuras_ov_grouped,
        'figuras_villanos_grouped': figuras_villanos_grouped,
        'figuras_personajes_grouped': figuras_personajes_grouped,
        'figuras_classic_count': figuras_classic_count,
        'figuras_af_count': figuras_af_count,
        'figuras_ov_count': figuras_ov_count,
        'figuras_personajes_count': figuras_personajes_count,
        'figuras_villanos_count': figuras_villanos_count,
        'figuras_count': figuras_count,
        'form': form,
        'aliens': aliens,
        'aliens_por_serie': aliens_por_serie
    })

def editar_figura(request, id):
    figura = get_object_or_404(Figura, id=id)
    if request.method == 'POST':
        # Pasamos instance=figura para que actualice el registro existente
        form = FiguraForm(request.POST, request.FILES, instance=figura)
        if form.is_valid():
            form.save()
    return redirect('coleccion')

def dashboard(request):
    if request.method == 'POST':
        # Agregar nuevo alien desde el panel
        alien_nombre = request.POST.get('alien_nombre')
        serie_default = request.POST.get('serie_default', 'Ben 10')
        if alien_nombre:
            Alien.objects.get_or_create(nombre=alien_nombre, defaults={'serie_default': serie_default})
            return redirect(f'/dashboard/?tab=aliens&serie={serie_default}')

    total_figuras = Figura.objects.count()
    valor_total = Figura.objects.aggregate(Sum('precio'))['precio__sum'] or 0
    precio_promedio = Figura.objects.aggregate(Avg('precio'))['precio__avg'] or 0
    precio_maximo = Figura.objects.aggregate(Max('precio'))['precio__max'] or 0

    # Asegurar aliens cargados
    if Alien.objects.count() == 0:
        Alien.seed_default_aliens()

    # Calcular completitud de colecciones únicas basadas en aliens disponibles
    total_posibles_classic = Alien.objects.filter(serie_default='Ben 10').count()
    unicos_classic = Figura.objects.filter(serie='Ben 10').values('nombre').distinct().count()
    completitud_classic = int((unicos_classic / total_posibles_classic) * 100) if total_posibles_classic > 0 else 0
    
    total_posibles_af = Alien.objects.filter(serie_default='Ben 10 Alien Force').count()
    unicos_af = Figura.objects.filter(serie='Ben 10 Alien Force').values('nombre').distinct().count()
    completitud_af = int((unicos_af / total_posibles_af) * 100) if total_posibles_af > 0 else 0

    total_posibles_ov = Alien.objects.filter(serie_default='Ben 10 Omniverse').count()
    unicos_ov = Figura.objects.filter(serie='Ben 10 Omniverse').values('nombre').distinct().count()
    completitud_ov = int((unicos_ov / total_posibles_ov) * 100) if total_posibles_ov > 0 else 0

    total_posibles_villanos = Alien.objects.filter(serie_default='Villanos').count()
    unicos_villanos = Figura.objects.filter(serie='Villanos').values('nombre').distinct().count()
    completitud_villanos = int((unicos_villanos / total_posibles_villanos) * 100) if total_posibles_villanos > 0 else 0

    total_posibles_personajes = Alien.objects.filter(serie_default='Personajes').count()
    unicos_personajes = Figura.objects.filter(serie='Personajes').values('nombre').distinct().count()
    completitud_personajes = int((unicos_personajes / total_posibles_personajes) * 100) if total_posibles_personajes > 0 else 0

    figuras_list = Figura.objects.all().order_by('-precio')
    paginator = Paginator(figuras_list, 10)
    page_number = request.GET.get('page')
    figuras = paginator.get_page(page_number)

    aliens = Alien.objects.all().order_by('nombre')

    return render(request, 'collector/dashboard.html', {
        'total_figuras': total_figuras,
        'valor_total': valor_total,
        'precio_promedio': round(precio_promedio),
        'precio_maximo': precio_maximo,
        'completitud_classic': completitud_classic,
        'total_posibles_classic': total_posibles_classic,
        'unicos_classic': unicos_classic,
        'completitud_af': completitud_af,
        'total_posibles_af': total_posibles_af,
        'unicos_af': unicos_af,
        'completitud_ov': completitud_ov,
        'total_posibles_ov': total_posibles_ov,
        'unicos_ov': unicos_ov,
        'completitud_villanos': completitud_villanos,
        'total_posibles_villanos': total_posibles_villanos,
        'unicos_villanos': unicos_villanos,
        'completitud_personajes': completitud_personajes,
        'total_posibles_personajes': total_posibles_personajes,
        'unicos_personajes': unicos_personajes,
        'figuras': figuras,
        'aliens': aliens,
        'serie_choices': Figura.SERIE_CHOICES,
    })

def eliminar_figura(request, id):
    figura = get_object_or_404(Figura, id=id)
    figura.delete()
    return redirect('dashboard')

def eliminar_alien(request, id):
    alien = get_object_or_404(Alien, id=id)
    serie = alien.serie_default
    alien.delete()
    return redirect(f'/dashboard/?tab=aliens&serie={serie}')

def home(request):
    total_classic = Figura.objects.filter(serie='Ben 10').count()
    total_af = Figura.objects.filter(serie='Ben 10 Alien Force').count()
    total_ov = Figura.objects.filter(serie='Ben 10 Omniverse').count()
    total_figuras = Figura.objects.count()

    return render(request, 'index.html', {
        'total_classic': total_classic,
        'total_af': total_af,
        'total_ov': total_ov,
        'total_figuras': total_figuras,
    })

def editar_perfil(request):
    perfil = Perfil.objects.first()
    if request.method == 'POST':
        form = PerfilForm(request.POST, instance=perfil)
        if form.is_valid():
            form.save()
    return redirect(request.META.get('HTTP_REFERER', 'home'))

from django.http import JsonResponse

def api_figuras(request):
    figuras = Figura.objects.all().order_by('-fecha_adquisicion')
    data = []
    for f in figuras:
        data.append({
            'id': f.id,
            'nombre': f.nombre,
            'imagen_url': f.imagen.url,
            'serie': f.serie,
            'estado': f.estado,
            'marca': f.marca,
            'tamano': f.tamano,
            'estado_display': f.get_estado_display(),
            'marca_display': f.get_marca_display(),
            'tamano_display': f.get_tamano_display()
        })
    return JsonResponse({'figuras': data})




