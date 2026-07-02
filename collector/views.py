from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Sum, Avg, Max
from .forms import FiguraForm, PerfilForm
from .models import Figura, Perfil

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
    figuras_count = Figura.objects.count()

    return render(request, 'collector/coleccion.html', {
        'figuras_classic': figuras_classic,
        'figuras_af': figuras_af,
        'figuras_ov': figuras_ov,
        'figuras_count': figuras_count,
        'form': form
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
    total_figuras = Figura.objects.count()
    valor_total = Figura.objects.aggregate(Sum('precio'))['precio__sum'] or 0
    precio_promedio = Figura.objects.aggregate(Avg('precio'))['precio__avg'] or 0
    precio_maximo = Figura.objects.aggregate(Max('precio'))['precio__max'] or 0

    # Calcular completitud de colecciones únicas por serie
    unicos_classic = Figura.objects.filter(serie='Ben 10').values('nombre').distinct().count()
    completitud_classic = int((unicos_classic / 11) * 100) if unicos_classic > 0 else 0
    
    unicos_af = Figura.objects.filter(serie='Ben 10 Alien Force').values('nombre').distinct().count()
    completitud_af = int((unicos_af / 10) * 100) if unicos_af > 0 else 0

    unicos_ov = Figura.objects.filter(serie='Ben 10 Omniverse').values('nombre').distinct().count()
    completitud_ov = int((unicos_ov / 21) * 100) if unicos_ov > 0 else 0

    figuras = Figura.objects.all()

    return render(request, 'collector/dashboard.html', {
        'total_figuras': total_figuras,
        'valor_total': valor_total,
        'precio_promedio': round(precio_promedio),
        'precio_maximo': precio_maximo,
        'completitud_classic': completitud_classic,
        'completitud_af': completitud_af,
        'completitud_ov': completitud_ov,
        'figuras': figuras,
    })

def eliminar_figura(request, id):
    figura = get_object_or_404(Figura, id=id)
    figura.delete()
    return redirect('dashboard')

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
            'serie': f.serie
        })
    return JsonResponse({'figuras': data})




