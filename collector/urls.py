from django.urls import path
from . import views

urlpatterns = [
    path('', views.coleccion, name='home'),
    path('login/', views.login_view, name='login'),
    path('registro/', views.registro_view, name='registro'),
    path('logout/', views.logout_view, name='logout'),
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
    path('base-de-datos/', views.base_de_datos, name='base_de_datos'),
    path('bodega/', views.bodega, name='bodega'),
    path('mover-a-bodega/<int:id>/', views.mover_a_bodega, name='mover_a_bodega'),
    path('mover-a-vendido/<int:id>/', views.mover_a_vendido, name='mover_a_vendido'),
    path('reintegrar-a-coleccion/<int:id>/', views.reintegrar_a_coleccion, name='reintegrar_a_coleccion'),
]
