from django.urls import path
from . import views

urlpatterns = [
    path('coleccion/', views.coleccion, name='coleccion'),
    path('coleccion/editar/<int:id>/', views.editar_figura, name='editar_figura'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('coleccion/eliminar/<int:id>/', views.eliminar_figura, name='eliminar_figura'),
    path('perfil/editar/', views.editar_perfil, name='editar_perfil'),
    path('api/figuras/', views.api_figuras, name='api_figuras'),
    path('alien/eliminar/<int:id>/', views.eliminar_alien, name='eliminar_alien'),
    path('wishlist/', views.wishlist, name='wishlist'),
    path('wishlist/add/', views.agregar_a_wishlist, name='agregar_a_wishlist'),
    path('wishlist/delete/<int:id>/', views.eliminar_de_wishlist, name='eliminar_de_wishlist'),
    path('wishlist/edit/<int:id>/', views.editar_wishlist, name='editar_wishlist'),
    path('wishlist/mover/<int:wishlist_id>/', views.mover_a_coleccion, name='mover_a_coleccion'),
]
