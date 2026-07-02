from django import forms
from .models import Figura, Perfil

class FiguraForm(forms.ModelForm):
    class Meta:
        model = Figura
        fields = ['nombre', 'precio', 'imagen', 'fecha_adquisicion', 'serie', 'estado', 'marca', 'tamano']
        widgets = {
            'nombre': forms.Select(attrs={
                'class': 'cta-input custom-input select-custom'
            }),
            'precio': forms.NumberInput(attrs={
                'class': 'cta-input custom-input',
                'placeholder': 'Ej. 15000'
            }),
            'imagen': forms.ClearableFileInput(attrs={
                'class': 'file-input-custom',
                'accept': 'image/*'
            }),
            'fecha_adquisicion': forms.DateInput(attrs={
                'class': 'cta-input custom-input',
                'type': 'date'
            }),
            'serie': forms.Select(attrs={
                'class': 'cta-input custom-input select-custom'
            }),
            'estado': forms.Select(attrs={
                'class': 'cta-input custom-input select-custom'
            }),
            'marca': forms.Select(attrs={
                'class': 'cta-input custom-input select-custom'
            }),
            'tamano': forms.Select(attrs={
                'class': 'cta-input custom-input select-custom'
            })
        }


class PerfilForm(forms.ModelForm):
    class Meta:
        model = Perfil
        fields = ['nombre', 'alien_favorito', 'omnitrix_favorito', 'avatar', 'rango', 'fav_figuras']
        widgets = {
            'nombre': forms.TextInput(attrs={
                'class': 'cta-input custom-input',
                'placeholder': 'Tu nombre de héroe'
            }),
            'alien_favorito': forms.TextInput(attrs={
                'class': 'cta-input custom-input',
                'placeholder': 'Ej. XLR8'
            }),
            'omnitrix_favorito': forms.Select(attrs={
                'class': 'cta-input custom-input select-custom'
            }),
            'avatar': forms.Select(attrs={
                'class': 'cta-input custom-input select-custom'
            }),
            'rango': forms.Select(attrs={
                'class': 'cta-input custom-input select-custom'
            }),
        }


