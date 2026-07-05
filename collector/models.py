from django.db import models

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

    nombre = models.CharField(
        max_length=100, 
        default='Fuego',
        verbose_name="Nombre del Alien"
    )
    precio = models.IntegerField(verbose_name="Precio (CLP)")
    imagen = models.FileField(upload_to='figuras/', blank=True, null=True, verbose_name="Imagen de la Figura")
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
        upload_to='aliens_db/', 
        blank=True, 
        null=True, 
        verbose_name="Imagen por defecto"
    )

    class Meta:
        verbose_name = "Alien"
        verbose_name_plural = "Aliens"
        ordering = ['nombre']

    def __str__(self):
        return f"{self.nombre} ({self.serie_default})"

    @classmethod
    def seed_default_aliens(cls):
        initial_aliens = [
            ('Bestia', 'Ben 10'),
            ('Cuatrobrazos', 'Ben 10'),
            ('Materia Gris', 'Ben 10'),
            ('XLR8', 'Ben 10'),
            ('Ultra-T', 'Ben 10'),
            ('Diamante', 'Ben 10'),
            ('Insectoide', 'Ben 10'),
            ('Acuático', 'Ben 10'),
            ('Fantasmático', 'Ben 10'),
            ('Cannonbolt', 'Ben 10'),
            ('Fuego', 'Ben 10'),
            
            ('Goop', 'Ben 10 Alien Force'),
            ('Fuego Pantanoso', 'Ben 10 Alien Force'),
            ('Piedra', 'Ben 10 Alien Force'),
            ('Frío', 'Ben 10 Alien Force'),
            ('Humungosaurio', 'Ben 10 Alien Force'),
            ('Cerebrón', 'Ben 10 Alien Force'),
            ('Jetray', 'Ben 10 Alien Force'),
            ('Mono Araña', 'Ben 10 Alien Force'),
            ('Eco Eco', 'Ben 10 Alien Force'),
            ('Alien X', 'Ben 10 Alien Force'),
        ]
        for name, series in initial_aliens:
            cls.objects.get_or_create(nombre=name, defaults={'serie_default': series})


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
    imagen = models.FileField(upload_to='figuras/', verbose_name="Imagen de la Figura", blank=True, null=True)
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
