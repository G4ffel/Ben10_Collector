from django.db import models

class Figura(models.Model):
    SERIE_CHOICES = [
        ('Ben 10', 'Ben 10'),
        ('Ben 10 Alien Force', 'Ben 10 Alien Force'),
        ('Ben 10 Omniverse', 'Ben 10 Omniverse'),
    ]

    ALIEN_CHOICES = [
        # Ben 10 (Clásico)
        ('Bestia', 'Bestia'),
        ('Cuatrobrazos', 'Cuatrobrazos'),
        ('Materia Gris', 'Materia Gris'),
        ('XLR8', 'XLR8'),
        ('Ultra-T', 'Ultra-T'),
        ('Diamante', 'Diamante'),
        ('Insectoide', 'Insectoide'),
        ('Acuático', 'Acuático'),
        ('Fantasmático', 'Fantasmático'),
        ('Cannonbolt', 'Cannonbolt'),
        ('Fuego', 'Fuego'),
        
        # Ben 10 Alien Force (FA)
        ('Goop', 'Goop'),
        ('Fuego Pantanoso', 'Fuego Pantanoso'),
        ('Piedra', 'Piedra'),
        ('Frío', 'Frío'),
        ('Humungosaurio', 'Humungosaurio'),
        ('Cerebrón', 'Cerebrón'),
        ('Jetray', 'Jetray'),
        ('Mono Araña', 'Mono Araña'),
        ('Eco Eco', 'Eco Eco'),
        ('Alien X', 'Alien X'),
    ]

    nombre = models.CharField(
        max_length=100, 
        choices=ALIEN_CHOICES, 
        default='Fuego',
        verbose_name="Nombre del Alien"
    )
    precio = models.IntegerField(verbose_name="Precio (CLP)")
    imagen = models.FileField(upload_to='figuras/', verbose_name="Imagen de la Figura")
    fecha_adquisicion = models.DateField(verbose_name="Fecha de Adquisición")
    serie = models.CharField(
        max_length=50, 
        choices=SERIE_CHOICES, 
        default='Ben 10',
        verbose_name="Serie de origen"
    )

    class Meta:
        verbose_name = "Figura"
        verbose_name_plural = "Figuras"
        ordering = ['-fecha_adquisicion']

    def __str__(self):
        return f"{self.nombre} ({self.serie})"


class Perfil(models.Model):
    AVATAR_CHOICES = [
        ('icon1', 'Icono 1 (Ben Clásico)'),
        ('icon2', 'Icono 2 (Ben FA)'),
        ('icon3', 'Icono 3 (Ben Omniverse)'),
        ('icon4', 'Icono 4 (Gooppng)'),
        ('icon5', 'Icono 5 (Alien)'),
    ]
    OMNITRIX_CHOICES = [
        ('Clásico', 'Omnitrix Clásico'),
        ('Ultimatrix', 'Ultimatrix'),
        ('Omniverse', 'Omnitrix Omniverse'),
        ('Biomnitrix', 'Biomnitrix'),
    ]
    RANGO_CHOICES = [
        ('recluta', 'Recluta Plomero'),
        ('cadete', 'Cadete de la Academia'),
        ('elite', 'Plomero de Élite'),
        ('magister', 'Magister Plomero'),
        ('omni', 'Portador del Omnitrix'),
        ('protector', 'Protector de la Tierra'),
        ('heroe', 'Héroe del Cosmos'),
    ]
    
    nombre = models.CharField(max_length=100, default='Ben Tennyson', verbose_name="Nombre de Coleccionista")
    alien_favorito = models.CharField(max_length=100, default='Fuego', verbose_name="Alien Favorito")
    omnitrix_favorito = models.CharField(max_length=50, choices=OMNITRIX_CHOICES, default='Clásico', verbose_name="Omnitrix Favorito")
    avatar = models.CharField(max_length=50, choices=AVATAR_CHOICES, default='icon1', verbose_name="Avatar del Fanático")
    rango = models.CharField(max_length=50, choices=RANGO_CHOICES, default='recluta', verbose_name="Rango del Coleccionista")

    @property
    def avatar_url(self):
        mapping = {
            'icon1': '/media/icon/017fb5a61c2e3d7c884717549a991708.jpg',
            'icon2': '/media/icon/3ac3f32d4297ec19f726dc17c2d59067.jpg',
            'icon3': '/media/icon/GCUGerJWUAAaIYi.jpg',
            'icon4': '/media/icon/ben-gooppng.png',
            'icon5': '/media/icon/da92536834d09f7e083f5edccab9c04a.jpg',
        }
        return mapping.get(self.avatar, '/media/icon/017fb5a61c2e3d7c884717549a991708.jpg')

    class Meta:
        verbose_name = "Perfil de Fanático"
        verbose_name_plural = "Perfiles de Fanáticos"

    def __str__(self):
        return self.nombre

