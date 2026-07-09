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

@never_cache
def coleccion(request):
    form = FiguraForm()
    form_custom = FiguraCustomForm()
    
    if request.method == 'POST':
        if 'is_custom' in request.POST:
            form_custom = FiguraCustomForm(request.POST, request.FILES)
            if form_custom.is_valid():
                figura = form_custom.save()
                return redirect('coleccion')
        else:
            form = FiguraForm(request.POST, request.FILES)
            if form.is_valid():
                figura = form.save()
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

    figuras_classic_count = figuras_classic.count()
    figuras_af_count = figuras_af.count()
    figuras_ov_count = figuras_ov.count()
    figuras_personajes_count = figuras_personajes.count()
    figuras_villanos_count = figuras_villanos.count()

    aliens_por_serie = get_aliens_por_serie_data()

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
    if request.method == 'POST':
        # Agregar o editar alien desde el panel
        alien_id = request.POST.get('alien_id')
        alien_nombre = request.POST.get('alien_nombre')
        serie_default = request.POST.get('serie_default', 'Ben 10')
        alien_imagen = request.FILES.get('alien_imagen')

        if alien_id:
            alien = get_object_or_404(Alien, id=alien_id)
            if alien_nombre:
                alien.nombre = alien_nombre
            alien.serie_default = serie_default
            if alien_imagen:
                alien.imagen = alien_imagen
            alien.save()
            return redirect(f'/dashboard/?tab=aliens&serie={serie_default}')
        elif alien_nombre:
            alien, created = Alien.objects.get_or_create(nombre=alien_nombre, defaults={'serie_default': serie_default})
            if alien_imagen:
                alien.imagen = alien_imagen
                alien.save()
            return redirect(f'/dashboard/?tab=aliens&serie={serie_default}')

    total_figuras = Figura.objects.filter(estado_coleccion='coleccion').count()
    valor_total = Figura.objects.filter(estado_coleccion='coleccion').aggregate(Sum('precio'))['precio__sum'] or 0
    precio_promedio = Figura.objects.filter(estado_coleccion='coleccion').aggregate(Avg('precio'))['precio__avg'] or 0
    precio_maximo = Figura.objects.filter(estado_coleccion='coleccion').aggregate(Max('precio'))['precio__max'] or 0

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

    figuras_list = get_ordered_figures_by_series(Figura.objects.filter(estado_coleccion='coleccion'))
    paginator = Paginator(figuras_list, 7)
    page_number = request.GET.get('page')
    figuras = paginator.get_page(page_number)

    # Fetch bodega and sold figures for the dashboard
    figuras_bodega = get_ordered_figures_by_series(Figura.objects.filter(estado_coleccion__in=['bodega', 'vendido']))

    aliens = Alien.objects.all().order_by('orden_aparicion')
    aliens_por_serie = get_aliens_por_serie_data()
    form = FiguraForm()

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

def eliminar_alien(request, id):
    alien = get_object_or_404(Alien, id=id)
    serie = alien.serie_default
    alien.delete()
    return redirect(f'/dashboard/?tab=aliens&serie={serie}')

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
            'imagen_url': f.imagen.url if f.imagen else '/media/omnitrix/Ben_10_Omnitrix.png',
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
            return redirect('wishlist')
        elif 'precio' in request.POST:
            form_wishlist_custom = WishlistCustomForm(request.POST, request.FILES)
            if form_wishlist_custom.is_valid():
                form_wishlist_custom.save()
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
                form_wishlist.save()
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
        
        is_custom = not Alien.objects.filter(nombre=wishlist_item.nombre).exists()
        if is_custom:
            form = FiguraCustomForm(post_data, request.FILES)
        else:
            form = FiguraForm(post_data, request.FILES)
        if form.is_valid():
            figura = form.save(commit=False)
            if not figura.imagen and wishlist_item.imagen:
                figura.imagen = wishlist_item.imagen
            figura.save()
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





