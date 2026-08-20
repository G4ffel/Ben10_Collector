from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.cache import never_cache
from django.db.models import Sum, Avg, Max, Subquery, OuterRef, Case, When, Value, IntegerField, F
from django.db.models.functions import Coalesce
from django.core.paginator import Paginator
from .forms import FiguraForm, PerfilForm, WishlistItemForm, WishlistEditForm, WishlistCustomForm, FiguraCustomForm
from .models import Figura, Perfil, Alien, WishlistItem

def get_ordered_figures(queryset):
    alien_order = Subquery(
        Alien.objects.filter(nombre=OuterRef('nombre')).values('orden_aparicion')[:1]
    )
    return queryset.annotate(
        alien_order=Coalesce(alien_order, 999)
    ).order_by('alien_order', 'nombre')

def get_ordered_figures_by_series(queryset):
    series_order = Case(
        When(serie='Ben 10', then=Value(1)),
        When(serie='Ben 10 Alien Force', then=Value(2)),
        When(serie='Ben 10 Omniverse', then=Value(3)),
        When(serie='Personajes', then=Value(4)),
        When(serie='Villanos', then=Value(5)),
        default=Value(99),
        output_field=IntegerField()
    )
    alien_order = Subquery(
        Alien.objects.filter(nombre=OuterRef('nombre')).values('orden_aparicion')[:1]
    )
    return queryset.annotate(
        custom_series_order=series_order,
        alien_order=Coalesce(alien_order, 999)
    ).order_by('custom_series_order', 'alien_order', 'nombre')

def apply_figure_sorting(queryset, sort_key):
    if sort_key == 'serie' or sort_key == 'serie_asc':
        return get_ordered_figures_by_series(queryset)
    elif sort_key == 'serie_desc':
        series_order = Case(
            When(serie='Villanos', then=Value(1)),
            When(serie='Personajes', then=Value(2)),
            When(serie='Ben 10 Omniverse', then=Value(3)),
            When(serie='Ben 10 Alien Force', then=Value(4)),
            When(serie='Ben 10', then=Value(5)),
            default=Value(99),
            output_field=IntegerField()
        )
        alien_order = Subquery(
            Alien.objects.filter(nombre=OuterRef('nombre')).values('orden_aparicion')[:1]
        )
        return queryset.annotate(
            custom_series_order=series_order,
            alien_order=Coalesce(alien_order, 999)
        ).order_by('custom_series_order', 'alien_order', 'nombre')
    elif sort_key == 'precio_desc':
        return queryset.order_by('-precio', 'nombre')
    elif sort_key == 'precio_asc':
        return queryset.order_by('precio', 'nombre')
    elif sort_key == 'fecha_desc':
        return queryset.order_by('-fecha_adquisicion', 'nombre')
    elif sort_key == 'fecha_asc':
        return queryset.order_by('fecha_adquisicion', 'nombre')
    else:
        return get_ordered_figures_by_series(queryset)

def get_aliens_por_serie_data():
    aliens = Alien.objects.all().order_by('orden_aparicion')
    aliens_por_serie = {}
    for s in ['Ben 10', 'Ben 10 Alien Force', 'Ben 10 Omniverse', 'Personajes', 'Villanos']:
        list_aliens = []
        for alien in aliens.filter(serie_default=s):
            img_url = alien.imagen.url if alien.imagen else '/media/omnitrix/Ben_10_Omnitrix.png'
            list_aliens.append({
                'nombre': alien.nombre,
                'imagen_url': img_url
            })
        aliens_por_serie[s] = list_aliens
    return aliens_por_serie

def sync_figure_subcategoria(instance):
    if not getattr(instance, 'subcategoria', '') and getattr(instance, 'nombre', ''):
        alien = Alien.objects.filter(nombre__iexact=instance.nombre.strip()).first()
        if alien and alien.subcategoria:
            instance.subcategoria = alien.subcategoria
            instance.save()

@never_cache
def coleccion(request):
    form = FiguraForm()
    form_custom = FiguraCustomForm()
    
    if request.method == 'POST':
        if 'is_custom' in request.POST:
            form_custom = FiguraCustomForm(request.POST, request.FILES)
            if form_custom.is_valid():
                figura = form_custom.save()
                sync_figure_subcategoria(figura)
                return redirect('coleccion')
        else:
            form = FiguraForm(request.POST, request.FILES)
            if form.is_valid():
                figura = form.save()
                sync_figure_subcategoria(figura)
                return redirect('coleccion')
    
    figuras_classic = get_ordered_figures(Figura.objects.filter(serie='Ben 10', estado_coleccion='coleccion'))
    figuras_af = get_ordered_figures(Figura.objects.filter(serie='Ben 10 Alien Force', estado_coleccion='coleccion'))
    figuras_ov = get_ordered_figures(Figura.objects.filter(serie='Ben 10 Omniverse', estado_coleccion='coleccion'))
    figuras_villanos = get_ordered_figures(Figura.objects.filter(serie='Villanos', estado_coleccion='coleccion'))
    figuras_personajes = get_ordered_figures(Figura.objects.filter(serie='Personajes', estado_coleccion='coleccion'))
    figuras_count = Figura.objects.filter(estado_coleccion='coleccion').count()
    aliens = Alien.objects.all().order_by('orden_aparicion')

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

    # Items de Wishlist para la Vista Combinada (Modo Ojo)
    wishlist_classic = get_ordered_figures(WishlistItem.objects.filter(serie='Ben 10'))
    wishlist_af = get_ordered_figures(WishlistItem.objects.filter(serie='Ben 10 Alien Force'))
    wishlist_ov = get_ordered_figures(WishlistItem.objects.filter(serie='Ben 10 Omniverse'))
    wishlist_villanos = get_ordered_figures(WishlistItem.objects.filter(serie='Villanos'))
    wishlist_personajes = get_ordered_figures(WishlistItem.objects.filter(serie='Personajes'))

    def get_series_combined_data(figuras_qs, wishlist_qs):
        def merge_and_sort(fig_qs, wish_qs):
            items = []
            for f in fig_qs:
                f.is_wishlist = False
                items.append(f)
            for w in wish_qs:
                w.is_wishlist = True
                items.append(w)
            items.sort(key=lambda x: (getattr(x, 'alien_order', 999), getattr(x, 'nombre', ''), getattr(x, 'is_wishlist', False)))
            return items

        combined = []
        std_fig = figuras_qs.filter(subcategoria='')
        std_wish = wishlist_qs.filter(subcategoria='')
        if std_fig.exists() or std_wish.exists():
            merged = merge_and_sort(std_fig, std_wish)
            combined.append(('', merged, std_fig.exists()))

        for sub_val, sub_label in Figura.SUBCATEGORIA_CHOICES:
            if sub_val == '':
                continue
            sub_fig = figuras_qs.filter(subcategoria=sub_val)
            sub_wish = wishlist_qs.filter(subcategoria=sub_val)
            if sub_fig.exists() or sub_wish.exists():
                merged = merge_and_sort(sub_fig, sub_wish)
                combined.append((sub_label, merged, sub_fig.exists()))
        return combined

    classic_combined = get_series_combined_data(figuras_classic, wishlist_classic)
    af_combined = get_series_combined_data(figuras_af, wishlist_af)
    ov_combined = get_series_combined_data(figuras_ov, wishlist_ov)
    personajes_combined = get_series_combined_data(figuras_personajes, wishlist_personajes)
    villanos_combined = get_series_combined_data(figuras_villanos, wishlist_villanos)

    wishlist_count = WishlistItem.objects.count()

    figuras_classic_count = figuras_classic.count()
    figuras_af_count = figuras_af.count()
    figuras_ov_count = figuras_ov.count()
    figuras_personajes_count = figuras_personajes.count()
    figuras_villanos_count = figuras_villanos.count()

    aliens_por_serie = get_aliens_por_serie_data()

    return render(request, 'collector/coleccion.html', {
        'classic_combined': classic_combined,
        'af_combined': af_combined,
        'ov_combined': ov_combined,
        'personajes_combined': personajes_combined,
        'villanos_combined': villanos_combined,
        'wishlist_count': wishlist_count,
        'figuras_classic_count': figuras_classic_count,
        'figuras_af_count': figuras_af_count,
        'figuras_ov_count': figuras_ov_count,
        'figuras_personajes_count': figuras_personajes_count,
        'figuras_villanos_count': figuras_villanos_count,
        'figuras_count': figuras_count,
        'form': form,
        'form_custom': form_custom,
        'aliens': aliens,
        'aliens_por_serie': aliens_por_serie
    })

def editar_figura(request, id):
    figura = get_object_or_404(Figura, id=id)
    referer = request.META.get('HTTP_REFERER', '')
    if request.method == 'POST':
        # Pasamos instance=figura para que actualice el registro existente
        form = FiguraForm(request.POST, request.FILES, instance=figura)
        if form.is_valid():
            form.save()
            if 'dashboard' in referer:
                return redirect('dashboard')
            elif 'bodega' in referer:
                return redirect('bodega')
            return redirect('coleccion')
        else:
            if referer:
                return redirect(referer)
    if 'bodega' in referer:
        return redirect('bodega')
    elif 'dashboard' in referer:
        return redirect('dashboard')
    return redirect('coleccion')

@never_cache
def dashboard(request):
    total_figuras = Figura.objects.filter(estado_coleccion='coleccion').count()
    valor_total = Figura.objects.filter(estado_coleccion='coleccion').aggregate(Sum('precio'))['precio__sum'] or 0
    precio_promedio = Figura.objects.filter(estado_coleccion='coleccion').aggregate(Avg('precio'))['precio__avg'] or 0
    figura_suprema = Figura.objects.filter(estado_coleccion='coleccion').order_by('-precio').first()
    precio_maximo = figura_suprema.precio if figura_suprema else 0

    # Bodega & Ventas Stats
    total_bodega = Figura.objects.filter(estado_coleccion='bodega').count()
    valor_bodega = Figura.objects.filter(estado_coleccion='bodega').aggregate(Sum('precio'))['precio__sum'] or 0
    total_vendidos = Figura.objects.filter(estado_coleccion='vendido').count()
    total_ventas = Figura.objects.filter(estado_coleccion='vendido').aggregate(
        total=Sum(Coalesce('precio_venta', 'precio'))
    )['total'] or 0
    ganancia_total = Figura.objects.filter(estado_coleccion='vendido').aggregate(
        total=Sum(Coalesce('precio_venta', F('precio')) - F('precio'))
    )['total'] or 0

    # Wishlist Stats
    total_wishlist = WishlistItem.objects.count()
    valor_wishlist = WishlistItem.objects.aggregate(Sum('precio'))['precio__sum'] or 0

    # Asegurar aliens cargados
    if Alien.objects.count() == 0:
        Alien.seed_default_aliens()

    # Calcular completitud de colecciones basadas en wishlist + coleccion (Total = Wishlist + Coleccion, Tengo = Coleccion)
    unicos_classic = Figura.objects.filter(serie='Ben 10', estado_coleccion='coleccion').count()
    wishlist_classic_count = WishlistItem.objects.filter(serie='Ben 10').count()
    total_posibles_classic = unicos_classic + wishlist_classic_count
    completitud_classic = int((unicos_classic / total_posibles_classic) * 100) if total_posibles_classic > 0 else 0
    
    unicos_af = Figura.objects.filter(serie='Ben 10 Alien Force', estado_coleccion='coleccion').count()
    wishlist_af_count = WishlistItem.objects.filter(serie='Ben 10 Alien Force').count()
    total_posibles_af = unicos_af + wishlist_af_count
    completitud_af = int((unicos_af / total_posibles_af) * 100) if total_posibles_af > 0 else 0

    unicos_ov = Figura.objects.filter(serie='Ben 10 Omniverse', estado_coleccion='coleccion').count()
    wishlist_ov_count = WishlistItem.objects.filter(serie='Ben 10 Omniverse').count()
    total_posibles_ov = unicos_ov + wishlist_ov_count
    completitud_ov = int((unicos_ov / total_posibles_ov) * 100) if total_posibles_ov > 0 else 0

    unicos_villanos = Figura.objects.filter(serie='Villanos', estado_coleccion='coleccion').count()
    wishlist_villanos_count = WishlistItem.objects.filter(serie='Villanos').count()
    total_posibles_villanos = unicos_villanos + wishlist_villanos_count
    completitud_villanos = int((unicos_villanos / total_posibles_villanos) * 100) if total_posibles_villanos > 0 else 0

    unicos_personajes = Figura.objects.filter(serie='Personajes', estado_coleccion='coleccion').count()
    wishlist_personajes_count = WishlistItem.objects.filter(serie='Personajes').count()
    total_posibles_personajes = unicos_personajes + wishlist_personajes_count
    completitud_personajes = int((unicos_personajes / total_posibles_personajes) * 100) if total_posibles_personajes > 0 else 0

    current_sort = request.GET.get('sort', '')
    
    figuras_qs = Figura.objects.filter(estado_coleccion='coleccion')
    figuras_list = apply_figure_sorting(figuras_qs, current_sort)
    paginator = Paginator(figuras_list, 9)
    page_number = request.GET.get('page')
    figuras = paginator.get_page(page_number)

    figuras_bodega_qs = Figura.objects.filter(estado_coleccion__in=['bodega', 'vendido'])
    figuras_bodega_list = apply_figure_sorting(figuras_bodega_qs, current_sort)
    paginator_bodega = Paginator(figuras_bodega_list, 9)
    page_bodega_number = request.GET.get('page_bodega')
    figuras_bodega = paginator_bodega.get_page(page_bodega_number)

    aliens = Alien.objects.all().order_by('orden_aparicion')
    aliens_por_serie = get_aliens_por_serie_data()
    form = FiguraForm()

    return render(request, 'collector/dashboard.html', {
        'current_sort': current_sort,
        'total_figuras': total_figuras,
        'valor_total': valor_total,
        'precio_promedio': round(precio_promedio),
        'precio_maximo': precio_maximo,
        'figura_suprema': figura_suprema,
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
        'figuras_bodega': figuras_bodega,
        'aliens': aliens,
        'serie_choices': Figura.SERIE_CHOICES,
        'aliens_por_serie': aliens_por_serie,
        'form': form,
        'total_bodega': total_bodega,
        'valor_bodega': valor_bodega,
        'total_vendidos': total_vendidos,
        'total_ventas': total_ventas,
        'ganancia_total': ganancia_total,
        'total_wishlist': total_wishlist,
        'valor_wishlist': valor_wishlist,
    })

def eliminar_figura(request, id):
    figura = get_object_or_404(Figura, id=id)
    figura.delete()
    referer = request.META.get('HTTP_REFERER', '')
    if 'bodega' in referer:
        return redirect('bodega')
    elif 'coleccion' in referer:
        return redirect('coleccion')
    return redirect('dashboard')

@never_cache
def base_de_datos(request):
    if Alien.objects.count() == 0:
        Alien.seed_default_aliens()

    if request.method == 'POST':
        alien_id = request.POST.get('alien_id')
        alien_nombre = request.POST.get('alien_nombre')
        serie_default = request.POST.get('serie_default', 'Ben 10')
        subcategoria = request.POST.get('subcategoria', '')
        alien_imagen = request.FILES.get('alien_imagen')

        if alien_id:
            alien = get_object_or_404(Alien, id=alien_id)
            old_nombre = alien.nombre
            if alien_nombre:
                alien.nombre = alien_nombre
            alien.serie_default = serie_default
            alien.subcategoria = subcategoria
            if alien_imagen:
                alien.imagen = alien_imagen
            alien.save()
            Figura.objects.filter(nombre__iexact=alien.nombre).update(subcategoria=subcategoria)
            if old_nombre != alien.nombre:
                Figura.objects.filter(nombre__iexact=old_nombre).update(subcategoria=subcategoria)
            WishlistItem.objects.filter(nombre__iexact=alien.nombre).update(subcategoria=subcategoria)
            if old_nombre != alien.nombre:
                WishlistItem.objects.filter(nombre__iexact=old_nombre).update(subcategoria=subcategoria)
            return redirect(f'/base-de-datos/?serie={serie_default}')
        elif alien_nombre:
            alien, created = Alien.objects.get_or_create(
                nombre=alien_nombre, 
                defaults={'serie_default': serie_default, 'subcategoria': subcategoria}
            )
            alien.subcategoria = subcategoria
            alien.serie_default = serie_default
            if alien_imagen:
                alien.imagen = alien_imagen
            alien.save()
            Figura.objects.filter(nombre__iexact=alien.nombre).update(subcategoria=subcategoria)
            WishlistItem.objects.filter(nombre__iexact=alien.nombre).update(subcategoria=subcategoria)
            return redirect(f'/base-de-datos/?serie={serie_default}')

    aliens = Alien.objects.all().order_by('orden_aparicion')
    aliens_por_serie = get_aliens_por_serie_data()
    total_aliens = aliens.count()
    total_classic = aliens.filter(serie_default='Ben 10').count()
    total_af = aliens.filter(serie_default='Ben 10 Alien Force').count()
    total_ov = aliens.filter(serie_default='Ben 10 Omniverse').count()
    total_personajes = aliens.filter(serie_default='Personajes').count()
    total_villanos = aliens.filter(serie_default='Villanos').count()
    perfil = Perfil.objects.first()

    return render(request, 'collector/base_de_datos.html', {
        'aliens': aliens,
        'aliens_por_serie': aliens_por_serie,
        'total_aliens': total_aliens,
        'total_classic': total_classic,
        'total_af': total_af,
        'total_ov': total_ov,
        'total_personajes': total_personajes,
        'total_villanos': total_villanos,
        'serie_choices': Figura.SERIE_CHOICES,
        'subcategoria_choices': Figura.SUBCATEGORIA_CHOICES,
        'perfil': perfil,
    })

def eliminar_alien(request, id):
    alien = get_object_or_404(Alien, id=id)
    serie = alien.serie_default
    alien.delete()
    return redirect(f'/base-de-datos/?serie={serie}')

@never_cache
def home(request):
    total_classic = Figura.objects.filter(serie='Ben 10', estado_coleccion='coleccion').count()
    total_af = Figura.objects.filter(serie='Ben 10 Alien Force', estado_coleccion='coleccion').count()
    total_ov = Figura.objects.filter(serie='Ben 10 Omniverse', estado_coleccion='coleccion').count()
    total_figuras = Figura.objects.filter(estado_coleccion='coleccion').count()

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
    figuras = get_ordered_figures_by_series(Figura.objects.filter(estado_coleccion='coleccion'))
    data = []
    for f in figuras:
        data.append({
            'id': f.id,
            'nombre': f.nombre,
            'imagen_url': f.imagen_url,
            'serie': f.serie,
            'estado': f.estado,
            'marca': f.marca,
            'tamano': f.tamano,
            'estado_display': f.get_estado_display(),
            'marca_display': f.get_marca_display(),
            'tamano_display': f.get_tamano_display()
        })
    return JsonResponse({'figuras': data})


@never_cache
def wishlist(request):
    wishlist_items = get_ordered_figures_by_series(WishlistItem.objects.all())
    wishlist_classic = get_ordered_figures(WishlistItem.objects.filter(serie='Ben 10'))
    wishlist_af = get_ordered_figures(WishlistItem.objects.filter(serie='Ben 10 Alien Force'))
    wishlist_ov = get_ordered_figures(WishlistItem.objects.filter(serie='Ben 10 Omniverse'))
    wishlist_villanos = get_ordered_figures(WishlistItem.objects.filter(serie='Villanos'))
    wishlist_personajes = get_ordered_figures(WishlistItem.objects.filter(serie='Personajes'))

    wishlist_sections = []
    if wishlist_classic.exists():
        wishlist_sections.append(('Ben 10 (Clásico)', 'var(--green-primary)', wishlist_classic))
    if wishlist_af.exists():
        wishlist_sections.append(('Ben 10 Alien Force', '#3b82f6', wishlist_af))
    if wishlist_ov.exists():
        wishlist_sections.append(('Ben 10 Omniverse', '#8b5cf6', wishlist_ov))
    if wishlist_personajes.exists():
        wishlist_sections.append(('Personajes', '#eab308', wishlist_personajes))
    if wishlist_villanos.exists():
        wishlist_sections.append(('Villanos', '#ef4444', wishlist_villanos))

    aliens_por_serie = get_aliens_por_serie_data()
    form_wishlist = WishlistItemForm()
    form_figura = FiguraForm()
    form_wishlist_edit = WishlistEditForm()
    form_wishlist_custom = WishlistCustomForm()

    return render(request, 'collector/wishlist.html', {
        'wishlist_items': wishlist_items,
        'wishlist_sections': wishlist_sections,
        'form_wishlist': form_wishlist,
        'form_figura': form_figura,
        'form_wishlist_edit': form_wishlist_edit,
        'form_wishlist_custom': form_wishlist_custom,
        'aliens_por_serie': aliens_por_serie,
    })


def agregar_a_wishlist(request):
    if request.method == 'POST':
        nombres = request.POST.getlist('nombres_multiple')
        serie = request.POST.get('serie')
        
        if nombres and serie:
            for nombre in nombres:
                item = WishlistItem(nombre=nombre, serie=serie)
                item.save()
                sync_figure_subcategoria(item)
            return redirect('wishlist')
        elif 'precio' in request.POST:
            form_wishlist_custom = WishlistCustomForm(request.POST, request.FILES)
            if form_wishlist_custom.is_valid():
                item = form_wishlist_custom.save()
                sync_figure_subcategoria(item)
                return redirect('wishlist')
            else:
                wishlist_items = get_ordered_figures_by_series(WishlistItem.objects.all())
                wishlist_classic = get_ordered_figures(WishlistItem.objects.filter(serie='Ben 10'))
                wishlist_af = get_ordered_figures(WishlistItem.objects.filter(serie='Ben 10 Alien Force'))
                wishlist_ov = get_ordered_figures(WishlistItem.objects.filter(serie='Ben 10 Omniverse'))
                wishlist_villanos = get_ordered_figures(WishlistItem.objects.filter(serie='Villanos'))
                wishlist_personajes = get_ordered_figures(WishlistItem.objects.filter(serie='Personajes'))

                wishlist_sections = []
                if wishlist_classic.exists():
                    wishlist_sections.append(('Ben 10 (Clásico)', 'var(--green-primary)', wishlist_classic))
                if wishlist_af.exists():
                    wishlist_sections.append(('Ben 10 Alien Force', '#3b82f6', wishlist_af))
                if wishlist_ov.exists():
                    wishlist_sections.append(('Ben 10 Omniverse', '#8b5cf6', wishlist_ov))
                if wishlist_personajes.exists():
                    wishlist_sections.append(('Personajes', '#eab308', wishlist_personajes))
                if wishlist_villanos.exists():
                    wishlist_sections.append(('Villanos', '#ef4444', wishlist_villanos))

                aliens_por_serie = get_aliens_por_serie_data()
                form_wishlist = WishlistItemForm()
                form_figura = FiguraForm()
                form_wishlist_edit = WishlistEditForm()

                return render(request, 'collector/wishlist.html', {
                    'wishlist_items': wishlist_items,
                    'wishlist_sections': wishlist_sections,
                    'form_wishlist': form_wishlist,
                    'form_figura': form_figura,
                    'form_wishlist_edit': form_wishlist_edit,
                    'form_wishlist_custom': form_wishlist_custom,
                    'aliens_por_serie': aliens_por_serie,
                })
        else:
            form_wishlist = WishlistItemForm(request.POST)
            if form_wishlist.is_valid():
                item = form_wishlist.save()
                sync_figure_subcategoria(item)
                return redirect('wishlist')
            else:
                wishlist_items = get_ordered_figures_by_series(WishlistItem.objects.all())
                wishlist_classic = get_ordered_figures(WishlistItem.objects.filter(serie='Ben 10'))
                wishlist_af = get_ordered_figures(WishlistItem.objects.filter(serie='Ben 10 Alien Force'))
                wishlist_ov = get_ordered_figures(WishlistItem.objects.filter(serie='Ben 10 Omniverse'))
                wishlist_villanos = get_ordered_figures(WishlistItem.objects.filter(serie='Villanos'))
                wishlist_personajes = get_ordered_figures(WishlistItem.objects.filter(serie='Personajes'))

                wishlist_sections = []
                if wishlist_classic.exists():
                    wishlist_sections.append(('Ben 10 (Clásico)', 'var(--green-primary)', wishlist_classic))
                if wishlist_af.exists():
                    wishlist_sections.append(('Ben 10 Alien Force', '#3b82f6', wishlist_af))
                if wishlist_ov.exists():
                    wishlist_sections.append(('Ben 10 Omniverse', '#8b5cf6', wishlist_ov))
                if wishlist_personajes.exists():
                    wishlist_sections.append(('Personajes', '#eab308', wishlist_personajes))
                if wishlist_villanos.exists():
                    wishlist_sections.append(('Villanos', '#ef4444', wishlist_villanos))

                aliens_por_serie = get_aliens_por_serie_data()
                form_figura = FiguraForm()
                form_wishlist_edit = WishlistEditForm()
                form_wishlist_custom = WishlistCustomForm()

                return render(request, 'collector/wishlist.html', {
                    'wishlist_items': wishlist_items,
                    'wishlist_sections': wishlist_sections,
                    'form_wishlist': form_wishlist,
                    'form_figura': form_figura,
                    'form_wishlist_edit': form_wishlist_edit,
                    'form_wishlist_custom': form_wishlist_custom,
                    'aliens_por_serie': aliens_por_serie,
                })
    return redirect('wishlist')


def eliminar_de_wishlist(request, id):
    item = get_object_or_404(WishlistItem, id=id)
    item.delete()
    return redirect('wishlist')


def editar_wishlist(request, id):
    item = get_object_or_404(WishlistItem, id=id)
    if request.method == 'POST':
        form = WishlistEditForm(request.POST, request.FILES, instance=item)
        if form.is_valid():
            form.save()
    return redirect('wishlist')



def mover_a_coleccion(request, wishlist_id):
    wishlist_item = get_object_or_404(WishlistItem, id=wishlist_id)
    if request.method == 'POST':
        post_data = request.POST.copy()
        post_data['nombre'] = wishlist_item.nombre
        post_data['serie'] = wishlist_item.serie
        
        is_custom = not Alien.objects.filter(nombre__iexact=wishlist_item.nombre.strip()).exists()
        if is_custom:
            form = FiguraCustomForm(post_data, request.FILES)
        else:
            form = FiguraForm(post_data, request.FILES)
        if form.is_valid():
            figura = form.save(commit=False)
            if not figura.imagen and wishlist_item.imagen:
                figura.imagen = wishlist_item.imagen
            if not figura.subcategoria:
                figura.subcategoria = wishlist_item.subcategoria
            figura.save()
            sync_figure_subcategoria(figura)
            wishlist_item.delete()
            return redirect('coleccion')
        else:
            wishlist_items = get_ordered_figures_by_series(WishlistItem.objects.all())
            wishlist_classic = get_ordered_figures(WishlistItem.objects.filter(serie='Ben 10'))
            wishlist_af = get_ordered_figures(WishlistItem.objects.filter(serie='Ben 10 Alien Force'))
            wishlist_ov = get_ordered_figures(WishlistItem.objects.filter(serie='Ben 10 Omniverse'))
            wishlist_villanos = get_ordered_figures(WishlistItem.objects.filter(serie='Villanos'))
            wishlist_personajes = get_ordered_figures(WishlistItem.objects.filter(serie='Personajes'))

            wishlist_sections = []
            if wishlist_classic.exists():
                wishlist_sections.append(('Ben 10 (Clásico)', 'var(--green-primary)', wishlist_classic))
            if wishlist_af.exists():
                wishlist_sections.append(('Ben 10 Alien Force', '#3b82f6', wishlist_af))
            if wishlist_ov.exists():
                wishlist_sections.append(('Ben 10 Omniverse', '#8b5cf6', wishlist_ov))
            if wishlist_personajes.exists():
                wishlist_sections.append(('Personajes', '#eab308', wishlist_personajes))
            if wishlist_villanos.exists():
                wishlist_sections.append(('Villanos', '#ef4444', wishlist_villanos))

            aliens_por_serie = get_aliens_por_serie_data()
            form_wishlist = WishlistItemForm()
            form_wishlist_edit = WishlistEditForm()
            return render(request, 'collector/wishlist.html', {
                'wishlist_items': wishlist_items,
                'wishlist_sections': wishlist_sections,
                'form_wishlist': form_wishlist,
                'form_figura': form,
                'form_wishlist_edit': form_wishlist_edit,
                'aliens_por_serie': aliens_por_serie,
                'error_moving_id': wishlist_id,
            })
    return redirect('wishlist')


@never_cache
def bodega(request):
    if request.method == 'POST':
        form = FiguraForm(request.POST, request.FILES)
        if form.is_valid():
            figura = form.save(commit=False)
            figura.estado_coleccion = 'bodega'
            figura.save()
            return redirect('bodega')
    else:
        form = FiguraForm()

    figuras_bodega = get_ordered_figures_by_series(Figura.objects.filter(estado_coleccion='bodega'))
    figuras_vendidos = get_ordered_figures_by_series(Figura.objects.filter(estado_coleccion='vendido'))
    ganancia_total = Figura.objects.filter(estado_coleccion='vendido').aggregate(
        total=Sum(Coalesce('precio_venta', F('precio')) - F('precio'))
    )['total'] or 0
    valor_bodega = Figura.objects.filter(estado_coleccion='bodega').aggregate(Sum('precio'))['precio__sum'] or 0
    total_ventas = Figura.objects.filter(estado_coleccion='vendido').aggregate(
        total=Sum(Coalesce('precio_venta', 'precio'))
    )['total'] or 0
    aliens_por_serie = get_aliens_por_serie_data()

    return render(request, 'collector/bodega.html', {
        'figuras_bodega': figuras_bodega,
        'figuras_vendidos': figuras_vendidos,
        'ganancia_total': ganancia_total,
        'valor_bodega': valor_bodega,
        'total_ventas': total_ventas,
        'form': form,
        'aliens_por_serie': aliens_por_serie,
    })

def mover_a_bodega(request, id):
    figura = get_object_or_404(Figura, id=id)
    figura.estado_coleccion = 'bodega'
    figura.save()
    referer = request.META.get('HTTP_REFERER', '')
    if 'dashboard' in referer:
        return redirect('dashboard')
    if 'coleccion' in referer:
        return redirect('coleccion')
    return redirect('bodega')

def mover_a_vendido(request, id):
    figura = get_object_or_404(Figura, id=id)
    precio_venta = request.GET.get('precio_venta')
    if precio_venta is not None:
        try:
            figura.precio_venta = int(precio_venta)
        except ValueError:
            figura.precio_venta = figura.precio
    else:
        figura.precio_venta = figura.precio
    figura.estado_coleccion = 'vendido'
    figura.save()
    return redirect('bodega')

def reintegrar_a_coleccion(request, id):
    figura = get_object_or_404(Figura, id=id)
    figura.estado_coleccion = 'coleccion'
    figura.save()
    return redirect('bodega')





