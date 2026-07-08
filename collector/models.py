from django.db import models

def figuras_upload_path(instance, filename):
    if instance.estado_coleccion in ['bodega', 'vendido']:
        return f'bodega/{filename}'
    mapping = {
        'Ben 10': 'ben-10',
        'Ben 10 Alien Force': 'ben-10-alien-force',
        'Ben 10 Omniverse': 'omniverse',
        'Personajes': 'personajes',
        'Villanos': 'villanos'
    }
    folder = mapping.get(instance.serie, 'otros')
    return f'figuras/{folder}/{filename}'

def aliens_db_upload_path(instance, filename):
    mapping = {
        'Ben 10': 'ben-10',
        'Ben 10 Alien Force': 'ben-10-alien-force',
        'Ben 10 Omniverse': 'omniverse',
        'Personajes': 'personajes',
        'Villanos': 'villanos'
    }
    folder = mapping.get(instance.serie_default, 'otros')
    return f'aliens_db/{folder}/{filename}'

class Figura(models.Model):
    SERIE_CHOICES = [
        ('Ben 10', 'Ben 10'),
        ('Ben 10 Alien Force', 'Ben 10 Alien Force'),
        ('Ben 10 Omniverse', 'Ben 10 Omniverse'),
        ('Personajes', 'Personajes'),
        ('Villanos', 'Villanos'),
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

    ESTADO_CHOICES = [
        ('excelente', 'Excelente'),
        ('bueno', 'Bueno'),
        ('medio', 'Medio'),
        ('malo', 'Malo'),
    ]

    MARCA_CHOICES = [
        ('original', 'Original'),
        ('fake', 'Fake'),
        ('bandai', 'Bandai'),
    ]

    TAMANO_CHOICES = [
        ('grande', 'Grande'),
        ('mediano', 'Mediano'),
        ('pequeno', 'Pequeño'),
    ]

    SUBCATEGORIA_CHOICES = [
        ('', 'Ninguna / Estándar'),
        ('Alienígenas Desbloqueados', 'Alienígenas Desbloqueados'),
        ('Supremos', 'Supremos'),
        ('Ultimate Alien', 'Ultimate Alien'),
    ]

    ESTADO_COLECCION_CHOICES = [
        ('coleccion', 'En Colección'),
        ('bodega', 'En Bodega'),
        ('vendido', 'Vendido'),
    ]

    nombre = models.CharField(
        max_length=100, 
        default='Fuego',
        verbose_name="Nombre del Alien"
    )
    precio = models.IntegerField(verbose_name="Precio (CLP)")
    precio_venta = models.IntegerField(verbose_name="Precio de Venta (CLP)", null=True, blank=True)
    imagen = models.FileField(upload_to=figuras_upload_path, blank=True, null=True, verbose_name="Imagen de la Figura")
    fecha_adquisicion = models.DateField(verbose_name="Fecha de Adquisición")
    serie = models.CharField(
        max_length=50, 
        choices=SERIE_CHOICES, 
        default='Ben 10',
        verbose_name="Serie de origen"
    )
    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default='excelente',
        verbose_name="Estado"
    )
    marca = models.CharField(
        max_length=20,
        choices=MARCA_CHOICES,
        default='original',
        verbose_name="Marca"
    )
    tamano = models.CharField(
        max_length=20,
        choices=TAMANO_CHOICES,
        default='mediano',
        verbose_name="Tamaño"
    )
    subcategoria = models.CharField(
        max_length=50,
        choices=SUBCATEGORIA_CHOICES,
        default='',
        blank=True,
        verbose_name="Subcategoría"
    )
    estado_coleccion = models.CharField(
        max_length=20,
        choices=ESTADO_COLECCION_CHOICES,
        default='coleccion',
        verbose_name="Estado de Colección"
    )

    class Meta:
        verbose_name = "Figura"
        verbose_name_plural = "Figuras"
        ordering = ['-fecha_adquisicion']

    def __str__(self):
        return f"{self.nombre} ({self.serie})"


class Alien(models.Model):
    nombre = models.CharField(max_length=100, unique=True, verbose_name="Nombre del Alien")
    serie_default = models.CharField(
        max_length=50, 
        choices=Figura.SERIE_CHOICES, 
        default='Ben 10', 
        verbose_name="Serie de origen por defecto"
    )

    imagen = models.FileField(
        upload_to=aliens_db_upload_path, 
        blank=True, 
        null=True, 
        verbose_name="Imagen por defecto"
    )
    orden_aparicion = models.IntegerField(default=999, verbose_name="Orden de aparición")

    class Meta:
        verbose_name = "Alien"
        verbose_name_plural = "Aliens"
        ordering = ['orden_aparicion', 'nombre']

    def __str__(self):
        return f"{self.nombre} ({self.serie_default})"

    @classmethod
    def seed_default_aliens(cls):
        initial_aliens = [
            # Ben 10 (Clásico)
            ('Fuego', 'Ben 10', 1),
            ('Bestia', 'Ben 10', 2),
            ('Diamante', 'Ben 10', 3),
            ('XLR8', 'Ben 10', 4),
            ('Materia Gris', 'Ben 10', 5),
            ('Cuatrobrazos', 'Ben 10', 6),
            ('Insectoide', 'Ben 10', 7),
            ('Fantasmático', 'Ben 10', 8),
            ('Ultra-T', 'Ben 10', 9),
            ('Acuático', 'Ben 10', 10),
            ('Cannonbolt', 'Ben 10', 11),
            ('Wildvine', 'Ben 10', 12),
            ('Blitzwolfer', 'Ben 10', 13),
            ('Snare-Oh', 'Ben 10', 14),
            ('Frankenstrike', 'Ben 10', 15),
            ('Upchuck', 'Ben 10', 16),
            
            # Ben 10 Alien Force / Ultimate Alien
            ('Fuego Pantanoso', 'Ben 10 Alien Force', 17),
            ('Eco Eco', 'Ben 10 Alien Force', 18),
            ('Humungosaurio', 'Ben 10 Alien Force', 19),
            ('Jetray', 'Ben 10 Alien Force', 20),
            ('Frío', 'Ben 10 Alien Force', 21),
            ('Piedra', 'Ben 10 Alien Force', 22),
            ('Cerebrón', 'Ben 10 Alien Force', 23),
            ('Mono Araña', 'Ben 10 Alien Force', 24),
            ('Goop', 'Ben 10 Alien Force', 25),
            ('Alien X', 'Ben 10 Alien Force', 26),
            ('Lodestar', 'Ben 10 Alien Force', 27),
            ('Rath', 'Ben 10 Alien Force', 28),
            ('Upchuck AF', 'Ben 10 Alien Force', 29),
            ('Nanomech', 'Ben 10 Alien Force', 30),
            ('Amenaza Acuática', 'Ben 10 Alien Force', 31),
            ('Armadillo', 'Ben 10 Alien Force', 32),
            ('Tortutornado', 'Ben 10 Alien Force', 33),
            ('NRG', 'Ben 10 Alien Force', 34),
            ('Clockwork', 'Ben 10 Alien Force', 35),
            ('Ampfibio', 'Ben 10 Alien Force', 36),
            ('Fasttrack', 'Ben 10 Alien Force', 37),
            ('Eatle', 'Ben 10 Alien Force', 38),
            ('Humungosaurio Supremo', 'Ben 10 Alien Force', 39),
            ('Fuego Pantanoso Supremo', 'Ben 10 Alien Force', 40),
            ('Cannonbolt Supremo', 'Ben 10 Alien Force', 41),
            ('Frío Supremo', 'Ben 10 Alien Force', 42),
            ('Mono Araña Supremo', 'Ben 10 Alien Force', 43),
            ('Eco Eco Supremo', 'Ben 10 Alien Force', 44),
            ('Bestia Suprema', 'Ben 10 Alien Force', 45),

            # Ben 10 Omniverse
            ('Bloxx', 'Ben 10 Omniverse', 46),
            ('Feedback', 'Ben 10 Omniverse', 47),
            ('Eatle OV', 'Ben 10 Omniverse', 48),
            ('Crashhopper', 'Ben 10 Omniverse', 49),
            ('Gravattack', 'Ben 10 Omniverse', 50),
            ('Bullfrag', 'Ben 10 Omniverse', 51),
            ('Toepick', 'Ben 10 Omniverse', 52),

            # Personajes
            ('Ben Tennyson', 'Personajes', 53),
            ('Gwen Tennyson', 'Personajes', 54),
            ('Max Tennyson', 'Personajes', 55),
            ('Kevin Levin', 'Personajes', 56),
            ('Tetrax', 'Personajes', 57),

            # Villanos
            ('Vulkanus', 'Villanos', 58),
            ('DNAliens', 'Villanos', 59),
            ('Highbreed', 'Villanos', 60),
        ]
        for name, series, order in initial_aliens:
            alien, created = cls.objects.get_or_create(nombre=name, defaults={'serie_default': series, 'orden_aparicion': order})
            if not created and alien.orden_aparicion != order:
                alien.orden_aparicion = order
                alien.save()


class Perfil(models.Model):
    AVATAR_CHOICES = [
        ('ben_clasico', 'Ben 10 (Clásico)'),
        ('ben_af', 'Ben 10 (Alien Force)'),
        ('ben_ov', 'Ben 10 (Omniverse)'),
        ('ralph', 'Ralph'),
        ('alien_x', 'Alien X'),
        ('fantasmatico', 'Fantasmático'),
        ('fuego', 'Fuego'),
        ('goop', 'Goop'),
        ('ultra_t', 'Ultra T'),
        ('ben_10k', 'Ben 10.000 (Diseño 1)'),
        ('ben_10k_2', 'Ben 10.000 (Diseño 2)'),
        ('ben_10k_3', 'Ben 10.000 (Diseño 3)'),
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
    avatar = models.CharField(max_length=50, choices=AVATAR_CHOICES, default='ben_clasico', verbose_name="Avatar del Fanático")
    rango = models.CharField(max_length=50, choices=RANGO_CHOICES, default='recluta', verbose_name="Rango del Coleccionista")
    banner = models.CharField(max_length=100, default='Alien-x.jpg', verbose_name="Banner de Fondo")
    fav_figuras = models.CharField(max_length=255, default="", blank=True, verbose_name="Figuras Favoritas")

    def get_fav_figuras(self):
        if not self.fav_figuras:
            return [None] * 5
        parts = self.fav_figuras.split(',')
        ids = []
        for x in parts:
            val = x.strip()
            if val and val.isdigit():
                ids.append(int(val))
            else:
                ids.append(None)
        while len(ids) < 5:
            ids.append(None)
        
        figures = []
        for fid in ids[:5]:
            if fid is not None:
                try:
                    figures.append(Figura.objects.get(id=fid))
                except Figura.DoesNotExist:
                    figures.append(None)
            else:
                figures.append(None)
        return figures

    @property
    def avatar_url(self):
        mapping = {
            'ben_clasico': '/media/icon/Ben-Clasico.jpg',
            'ben_af': '/media/icon/Ben-AF.jpg',
            'ben_ov': '/media/icon/Ben-OV.jpg',
            'ralph': '/media/icon/ralph.png',
            'alien_x': '/media/icon/Alien-X.jpg',
            'fantasmatico': '/media/icon/Fantasmatico.jpg',
            'fuego': '/media/icon/Fuego.webp',
            'goop': '/media/icon/Goop.png',
            'ultra_t': '/media/icon/Ultra-T.jpg',
            'ben_10k': '/media/icon/ben-10mil.jpg',
            'ben_10k_2': '/media/icon/ben-10mil-2.jpg',
            'ben_10k_3': '/media/icon/ben-10mil-3.jpg',
        }
        return mapping.get(self.avatar, '/media/icon/Ben-Clasico.jpg')

    @property
    def banner_url(self):
        return f'/media/banner/{self.banner}'

    class Meta:
        verbose_name = "Perfil de Fanático"
        verbose_name_plural = "Perfiles de Fanáticos"

    def __str__(self):
        return self.nombre


class WishlistItem(models.Model):
    nombre = models.CharField(max_length=100, verbose_name="Nombre del Alien")
    serie = models.CharField(
        max_length=50, 
        choices=Figura.SERIE_CHOICES, 
        default='Ben 10',
        verbose_name="Serie de origen"
    )
    precio = models.IntegerField(verbose_name="Precio (CLP)", default=0, blank=True, null=True)
    imagen = models.FileField(upload_to=figuras_upload_path, verbose_name="Imagen de la Figura", blank=True, null=True)
    fecha_adquisicion = models.DateField(verbose_name="Fecha de Adquisición", blank=True, null=True)
    estado = models.CharField(
        max_length=20,
        choices=Figura.ESTADO_CHOICES,
        default='excelente',
        verbose_name="Estado",
        blank=True
    )
    marca = models.CharField(
        max_length=20,
        choices=Figura.MARCA_CHOICES,
        default='original',
        verbose_name="Marca",
        blank=True
    )
    tamano = models.CharField(
        max_length=20,
        choices=Figura.TAMANO_CHOICES,
        default='mediano',
        verbose_name="Tamaño",
        blank=True
    )
    subcategoria = models.CharField(
        max_length=50,
        choices=Figura.SUBCATEGORIA_CHOICES,
        default='',
        blank=True,
        verbose_name="Subcategoría"
    )
    fecha_agregado = models.DateTimeField(auto_now_add=True, verbose_name="Fecha Agregado")

    class Meta:
        verbose_name = "Item de Wishlist"
        verbose_name_plural = "Items de Wishlist"
        ordering = ['-fecha_agregado']

    def __str__(self):
        return f"{self.nombre} ({self.serie}) [Wishlist]"
