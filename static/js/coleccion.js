document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('omniFormModal');
  const openAddBtn = document.getElementById('openAddModalBtn');
  const closeBtnX = document.getElementById('modalFormCloseX');
  const cancelBtn = document.getElementById('modalFormCancel');
  const form = document.getElementById('omniFigureForm');
  const formTitle = document.getElementById('modalFormTitle');
  const imageHint = document.getElementById('imageHint');
  const imageInput = document.querySelector('#omniFigureForm input[type="file"]');

  // Campos del formulario
  const nombreInput = document.getElementById('id_nombre') || document.querySelector('#omniFigureForm [name="nombre"]');
  const precioInput = document.querySelector('#omniFigureForm [name="precio"]');
  const fechaInput = document.querySelector('#omniFigureForm [name="fecha_adquisicion"]');
  const serieSelect = document.querySelector('#omniFigureForm select[name="serie"]');
  const fileChosenName = document.getElementById('fileChosenName');
  const autocompleteInput = document.getElementById('alienAutocompleteInput');
  const autocompleteList = document.getElementById('alienAutocompleteList');

  // Relación de aliens por serie cargada desde la base de datos
  let aliensPorSerie = {
    'Ben 10': [],
    'Ben 10 Alien Force': [],
    'Ben 10 Omniverse': [],
    'Personajes': [],
    'Villanos': []
  };

  const aliensDataEl = document.getElementById('aliens-por-serie-data');
  if (aliensDataEl) {
    try {
      aliensPorSerie = JSON.parse(aliensDataEl.textContent);
    } catch (e) {
      console.error("Error parsing aliens JSON data:", e);
    }
  } else if (window.aliensPorSerieDb) {
    aliensPorSerie = window.aliensPorSerieDb;
  }

  const renderAutocompleteList = (serieSelectedValue, searchQuery = '') => {
    if (!nombreInput || !autocompleteList) return;
    const permitidos = aliensPorSerie[serieSelectedValue] || [];
    const query = searchQuery.toLowerCase().trim();

    autocompleteList.innerHTML = ''; // Limpiar lista
    let primerVisible = null;
    let valorActualValido = false;

    // Sincronizar el select nativo de Django si la búsqueda es coincidencia exacta de algún alien permitido
    const exactMatch = permitidos.find(a => (typeof a === 'object' && a.nombre.toLowerCase().trim() === query));
    if (exactMatch) {
      nombreInput.value = exactMatch.nombre;
    }

    // Map objects to names if needed
    const permitidosNombres = permitidos.map(a => typeof a === 'string' ? a : a.nombre);

    // Leemos las opciones del select nativo de Django para generar los li
    Array.from(nombreInput.options).forEach(option => {
      const alienName = option.value;
      const perteneceSerie = (permitidosNombres.length === 0) || permitidosNombres.some(p => p.toLowerCase().trim() === alienName.toLowerCase().trim());
      const coincideBusqueda = alienName.toLowerCase().includes(query);

      if (perteneceSerie && coincideBusqueda) {
        const li = document.createElement('li');
        li.textContent = alienName;
        li.addEventListener('click', () => {
          if (autocompleteInput) autocompleteInput.value = alienName;
          nombreInput.value = alienName; // Sincroniza al select oculto de Django
          autocompleteList.style.display = 'none';

          // Actualizar previsualización al alien seleccionado de la base de datos (tanto al añadir como al editar)
          const matchObj = permitidos.find(a => (typeof a === 'object' && a.nombre.toLowerCase().trim() === alienName.toLowerCase().trim()));
          const defaultImgUrl = matchObj ? matchObj.imagen_url : '/media/omnitrix/Ben_10_Omnitrix.png';
          const previewImg = document.getElementById('figureAddAlienPreviewImg');
          const previewText = document.getElementById('figureAddAlienPreviewText');
          if (previewImg && (!imageInput || !imageInput.files || imageInput.files.length === 0)) {
            previewImg.src = defaultImgUrl;
            if (defaultImgUrl !== '/media/omnitrix/Ben_10_Omnitrix.png') {
              previewImg.style.animation = 'none';
              previewImg.style.width = '100%';
              previewImg.style.height = '100%';
              previewImg.style.objectFit = 'cover';
              previewImg.style.borderRadius = '0';
              previewImg.style.padding = '0';
              previewImg.style.mixBlendMode = 'normal';
              if (previewText) previewText.style.display = 'none';
            } else {
              previewImg.style.animation = 'omni-spin 25s linear infinite';
              previewImg.style.width = '130px';
              previewImg.style.height = '130px';
              previewImg.style.padding = '0';
              previewImg.style.borderRadius = '0';
              previewImg.style.mixBlendMode = 'normal';
              if (previewText) previewText.style.display = 'block';
            }
          }
        });
        autocompleteList.appendChild(li);

        if (!primerVisible) primerVisible = alienName;
        if (alienName.toLowerCase().trim() === nombreInput.value.toLowerCase().trim()) valorActualValido = true;
      }
    });

    // Si el valor seleccionado en el select nativo no es válido en esta serie/filtro, lo actualizamos al primero válido
    if (!valorActualValido && primerVisible) {
      nombreInput.value = primerVisible;
      if (document.activeElement !== autocompleteInput && autocompleteInput) {
        autocompleteInput.value = primerVisible;
      }
    }

    // Actualizar previsualización para el valor actual si estamos añadiendo una figura
    if (nombreInput && formTitle && formTitle.textContent === "AÑADIR NUEVA FIGURA") {
      const currentName = exactMatch ? exactMatch.nombre : nombreInput.value;
      const matchObj = permitidos.find(a => (typeof a === 'object' && a.nombre.toLowerCase().trim() === currentName.toLowerCase().trim()));
      const defaultImgUrl = matchObj ? matchObj.imagen_url : '/media/omnitrix/Ben_10_Omnitrix.png';
      const previewImg = document.getElementById('figureAddAlienPreviewImg');
      const previewText = document.getElementById('figureAddAlienPreviewText');
      if (previewImg && (!imageInput || !imageInput.files || imageInput.files.length === 0)) {
        previewImg.src = defaultImgUrl;
        if (defaultImgUrl !== '/media/omnitrix/Ben_10_Omnitrix.png') {
          previewImg.style.animation = 'none';
          previewImg.style.width = '100%';
          previewImg.style.height = '100%';
          previewImg.style.objectFit = 'cover';
          previewImg.style.borderRadius = '0';
          previewImg.style.padding = '0';
          previewImg.style.mixBlendMode = 'normal';
          if (previewText) previewText.style.display = 'none';
        } else {
          previewImg.style.animation = 'omni-spin 25s linear infinite';
          previewImg.style.width = '130px';
          previewImg.style.height = '130px';
          previewImg.style.padding = '0';
          previewImg.style.borderRadius = '0';
          previewImg.style.mixBlendMode = 'normal';
          if (previewText) previewText.style.display = 'block';
        }
      }
    }
  };

  // Control del dropdown autocomplete
  if (autocompleteInput) {
    const showAllOptions = () => {
      autocompleteList.style.display = 'block';
      renderAutocompleteList(serieSelect.value, ''); // Mostrar todas las opciones de la serie
    };

    autocompleteInput.addEventListener('focus', showAllOptions);
    autocompleteInput.addEventListener('click', showAllOptions);

    autocompleteInput.addEventListener('input', (e) => {
      renderAutocompleteList(serieSelect.value, e.target.value);
    });
  }

  // Cerrar dropdown al hacer click fuera
  document.addEventListener('click', (e) => {
    if (autocompleteInput && autocompleteList && !autocompleteInput.contains(e.target) && !autocompleteList.contains(e.target)) {
      autocompleteList.style.display = 'none';
    }
  });

  // Escuchar cambios en la serie
  if (serieSelect) {
    serieSelect.addEventListener('change', () => {
      if (autocompleteInput) autocompleteInput.value = ''; // Limpiar buscador al cambiar serie
      renderAutocompleteList(serieSelect.value, '');
    });
  }

  // Escuchar cambios en la selección de archivo y actualizar previsualización
  if (imageInput && fileChosenName) {
    imageInput.addEventListener('change', () => {
      if (imageInput.files && imageInput.files.length > 0) {
        const file = imageInput.files[0];
        fileChosenName.textContent = `${file.name}`;
        
        // Cargar previsualización del archivo seleccionado
        const reader = new FileReader();
        reader.onload = (e) => {
          const previewImg = document.getElementById('figureAddAlienPreviewImg');
          const previewText = document.getElementById('figureAddAlienPreviewText');
          if (previewImg) {
            previewImg.src = e.target.result;
            previewImg.style.animation = 'none';
            previewImg.style.width = '100%';
            previewImg.style.height = '100%';
            previewImg.style.objectFit = 'cover';
            previewImg.style.borderRadius = '0';
            previewImg.style.padding = '0';
            previewImg.style.mixBlendMode = 'normal';
            if (previewText) previewText.style.display = 'none';
          }
        };
        reader.readAsDataURL(file);
      } else {
        fileChosenName.textContent = "Sin archivos seleccionados";
      }
    });
  }

  const openModal = () => {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Si la serie está seleccionada, actualizamos el buscador de inmediato
      if (serieSelect) {
        renderAutocompleteList(serieSelect.value, '');
        // Sincronizar el input de autocomplete con el select nativo
        if (autocompleteInput) autocompleteInput.value = nombreInput.value;
      }
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (form) form.reset();
      if (imageHint) imageHint.style.display = 'none';
      if (imageInput) imageInput.required = false;
      if (fileChosenName) fileChosenName.textContent = "Sin archivos seleccionados";

      // Resetear la imagen a Omnitrix girando
      const previewImg = document.getElementById('figureAddAlienPreviewImg');
      const previewText = document.getElementById('figureAddAlienPreviewText');
      if (previewImg) {
        previewImg.src = '/media/omnitrix/Ben_10_Omnitrix.png';
        previewImg.style.animation = 'omni-spin 25s linear infinite';
        previewImg.style.width = '100px';
        previewImg.style.height = '100px';
        previewImg.style.padding = '0';
        previewImg.style.borderRadius = '0';
        previewImg.style.mixBlendMode = 'normal';
        if (previewText) previewText.style.display = 'block';
      }
    }
  };

  if (openAddBtn) {
    openAddBtn.addEventListener('click', () => {
      if (formTitle) formTitle.textContent = "AÑADIR NUEVA FIGURA";
      if (form) form.action = "/coleccion/"; // URL de creación
      closeModal();
      openModal();
    });
  }

  if (closeBtnX) closeBtnX.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // Cerrar haciendo click en el overlay
  const overlay = document.getElementById('modalFormOverlay');
  if (overlay) overlay.addEventListener('click', closeModal);

  // Abrir modal para editar
  document.querySelectorAll('.edit-figure-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const nombre = btn.getAttribute('data-nombre');
      const precio = btn.getAttribute('data-precio');
      const fecha = btn.getAttribute('data-fecha');
      const serie = btn.getAttribute('data-serie');
      const estado = btn.getAttribute('data-estado');
      const marca = btn.getAttribute('data-marca');
      const tamano = btn.getAttribute('data-tamano');

      // Buscar la URL de la imagen en la tarjeta
      const figureCard = btn.closest('.figure-card-omni');
      const imgEl = figureCard ? figureCard.querySelector('.figure-img-wrap img') : null;
      const imagenUrl = imgEl ? imgEl.src : '';

      if (formTitle) formTitle.textContent = "EDITAR FIGURA";
      if (form) form.action = `/coleccion/editar/${id}/`;

      if (nombreInput) nombreInput.value = nombre;
      if (autocompleteInput) autocompleteInput.value = nombre;
      if (precioInput) precioInput.value = precio;
      if (fechaInput) fechaInput.value = fecha;
      if (serieSelect) {
        serieSelect.value = serie;
        renderAutocompleteList(serieSelect.value, '');
      }

      const estadoSelect = document.querySelector('select[name="estado"]');
      const marcaSelect = document.querySelector('select[name="marca"]');
      const tamanoSelect = document.querySelector('select[name="tamano"]');
      const subcategoriaSelect = document.querySelector('select[name="subcategoria"]');
      const subcategoria = btn.getAttribute('data-subcategoria');

      if (estadoSelect) estadoSelect.value = estado;
      if (marcaSelect) marcaSelect.value = marca;
      if (tamanoSelect) tamanoSelect.value = tamano;
      if (subcategoriaSelect) subcategoriaSelect.value = subcategoria || '';

      // Mostrar previsualización de la imagen actual
      const previewImg = document.getElementById('figureAddAlienPreviewImg');
      const previewText = document.getElementById('figureAddAlienPreviewText');
      if (previewImg && imagenUrl) {
        previewImg.src = imagenUrl;
        previewImg.style.animation = 'none';
        previewImg.style.width = '100%';
        previewImg.style.height = '100%';
        previewImg.style.objectFit = 'cover';
        previewImg.style.borderRadius = '0';
        previewImg.style.padding = '0';
        previewImg.style.mixBlendMode = 'normal';
        if (previewText) previewText.style.display = 'none';
      }

      // Al editar, la imagen es opcional (se mantiene la existente)
      if (imageInput) imageInput.required = false;
      if (imageHint) imageHint.style.display = 'block';
      if (fileChosenName) fileChosenName.textContent = "Mantener imagen actual";

      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Modal de Detalle
  const detailModal = document.getElementById('alienDetailModal');
  const detailCloseX = document.getElementById('modalDetailCloseX');
  const detailCloseBtn = document.getElementById('modalDetailCloseBtn');
  const detailOverlay = document.getElementById('modalDetailOverlay');

  const closeDetailModal = () => {
    if (detailModal) {
      detailModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (detailCloseX) detailCloseX.addEventListener('click', closeDetailModal);
  if (detailCloseBtn) detailCloseBtn.addEventListener('click', closeDetailModal);
  if (detailOverlay) detailOverlay.addEventListener('click', closeDetailModal);

  document.querySelectorAll('.figure-card-omni').forEach(card => {
    card.addEventListener('click', (e) => {
      // Si se hizo click en el botón editar, no abrir detalles
      if (e.target.closest('.edit-figure-btn')) return;

      const nombre = card.getAttribute('data-nombre');
      const precio = card.getAttribute('data-precio');
      const fecha = card.getAttribute('data-fecha');
      const serie = card.getAttribute('data-serie');
      const estado = card.getAttribute('data-estado');
      const marca = card.getAttribute('data-marca');
      const tamano = card.getAttribute('data-tamano');
      const subcategoria = card.getAttribute('data-subcategoria');
      const imagen = card.getAttribute('data-imagen');

      // Rellenar modal
      document.getElementById('detailAlienImg').src = imagen;
      document.getElementById('detailAlienImg').alt = nombre;
      document.getElementById('detailModalTitle').textContent = `DETALLE DE ${nombre}`;
      document.getElementById('detailAlienSerie').textContent = serie;
      document.getElementById('detailAlienPrecio').textContent = precio;
      document.getElementById('detailAlienFecha').textContent = fecha;
      document.getElementById('detailAlienEstado').textContent = estado;
      document.getElementById('detailAlienMarca').textContent = marca;
      document.getElementById('detailAlienTamano').textContent = tamano;



      // Personalizar colores según la serie para estética Premium
      const detailHeader = document.getElementById('detailModalHeader');
      const detailTitle = document.getElementById('detailModalTitle');
      const detailRadar = document.getElementById('detailModalRadar');
      const detailCloseBtnX = document.getElementById('modalDetailCloseX');
      const detailContent = document.getElementById('detailModalContent');
      const detailPrecio = document.getElementById('detailAlienPrecio');
      const detailImgWrap = document.getElementById('detailAlienImgWrap');
      const hudBoxes = document.querySelectorAll('.hud-info-box');

      // Resetear clases/estilos previos
      detailContent.style.borderColor = '';
      detailContent.style.boxShadow = '';
      detailTitle.style.color = '';
      detailCloseBtnX.style.color = '';
      detailHeader.style.borderBottomColor = '';
      detailRadar.style.backgroundColor = '';
      detailRadar.style.boxShadow = '';
      detailPrecio.style.color = '';
      detailPrecio.style.textShadow = '';
      detailImgWrap.style.borderColor = '';
      detailImgWrap.style.boxShadow = '';
      hudBoxes.forEach(box => {
        box.style.borderColor = '';
        box.style.background = '';
      });

      if (serie === 'Ben 10') {
        // Verde clásico
        detailContent.style.borderColor = 'var(--green-primary)';
        detailContent.style.boxShadow = '0 0 40px rgba(0, 255, 65, 0.25)';
        detailTitle.style.color = 'var(--green-primary)';
        detailCloseBtnX.style.color = 'var(--green-primary)';
        detailHeader.style.borderBottomColor = 'var(--border-green)';
        detailRadar.style.backgroundColor = 'var(--green-primary)';
        detailRadar.style.boxShadow = '0 0 10px var(--green-primary)';
        detailPrecio.style.color = 'var(--green-primary)';
        detailPrecio.style.textShadow = '0 0 10px var(--green-glow)';
        detailImgWrap.style.borderColor = 'var(--border-green)';
        detailImgWrap.style.boxShadow = '0 0 25px rgba(0, 255, 65, 0.15)';
        hudBoxes.forEach(box => {
          box.style.borderColor = 'rgba(0, 255, 65, 0.15)';
          box.style.background = 'rgba(0, 255, 65, 0.02)';
        });
      } else if (serie === 'Ben 10 Alien Force') {
        // Azul Alien Force
        detailContent.style.borderColor = '#0066ff';
        detailContent.style.boxShadow = '0 0 40px rgba(0, 102, 255, 0.25)';
        detailTitle.style.color = '#00ccff';
        detailCloseBtnX.style.color = '#00ccff';
        detailHeader.style.borderBottomColor = 'rgba(0, 102, 255, 0.25)';
        detailRadar.style.backgroundColor = '#0066ff';
        detailRadar.style.boxShadow = '0 0 10px #0066ff';
        detailPrecio.style.color = '#00ccff';
        detailPrecio.style.textShadow = '0 0 10px rgba(0, 102, 255, 0.5)';
        detailImgWrap.style.borderColor = 'rgba(0, 102, 255, 0.4)';
        detailImgWrap.style.boxShadow = '0 0 25px rgba(0, 102, 255, 0.15)';
        hudBoxes.forEach(box => {
          box.style.borderColor = 'rgba(0, 102, 255, 0.15)';
          box.style.background = 'rgba(0, 102, 255, 0.02)';
        });
      } else if (serie === 'Ben 10 Omniverse') {
        // Morado Omniverse
        detailContent.style.borderColor = '#b400ff';
        detailContent.style.boxShadow = '0 0 40px rgba(180, 0, 255, 0.25)';
        detailTitle.style.color = '#d880ff';
        detailCloseBtnX.style.color = '#d880ff';
        detailHeader.style.borderBottomColor = 'rgba(180, 0, 255, 0.25)';
        detailRadar.style.backgroundColor = '#b400ff';
        detailRadar.style.boxShadow = '0 0 10px #b400ff';
        detailPrecio.style.color = '#d880ff';
        detailPrecio.style.textShadow = '0 0 10px rgba(180, 0, 255, 0.5)';
        detailImgWrap.style.borderColor = 'rgba(180, 0, 255, 0.4)';
        detailImgWrap.style.boxShadow = '0 0 25px rgba(180, 0, 255, 0.15)';
        hudBoxes.forEach(box => {
          box.style.borderColor = 'rgba(180, 0, 255, 0.15)';
          box.style.background = 'rgba(180, 0, 255, 0.02)';
        });
      } else if (serie === 'Villanos') {
        // Rojo Villanos
        detailContent.style.borderColor = '#ff3333';
        detailContent.style.boxShadow = '0 0 40px rgba(255, 51, 51, 0.25)';
        detailTitle.style.color = '#ff3333';
        detailCloseBtnX.style.color = '#ff3333';
        detailHeader.style.borderBottomColor = 'rgba(255, 51, 51, 0.25)';
        detailRadar.style.backgroundColor = '#ff3333';
        detailRadar.style.boxShadow = '0 0 10px #ff3333';
        detailPrecio.style.color = '#ff3333';
        detailPrecio.style.textShadow = '0 0 10px rgba(255, 51, 51, 0.5)';
        detailImgWrap.style.borderColor = 'rgba(255, 51, 51, 0.4)';
        detailImgWrap.style.boxShadow = '0 0 25px rgba(255, 51, 51, 0.15)';
        hudBoxes.forEach(box => {
          box.style.borderColor = 'rgba(255, 51, 51, 0.15)';
          box.style.background = 'rgba(255, 51, 51, 0.02)';
        });
      } else {
        // Amarillo/Dorado Personajes
        detailContent.style.borderColor = '#ffcc00';
        detailContent.style.boxShadow = '0 0 40px rgba(255, 204, 0, 0.25)';
        detailTitle.style.color = '#ffcc00';
        detailCloseBtnX.style.color = '#ffcc00';
        detailHeader.style.borderBottomColor = 'rgba(255, 204, 0, 0.25)';
        detailRadar.style.backgroundColor = '#ffcc00';
        detailRadar.style.boxShadow = '0 0 10px #ffcc00';
        detailPrecio.style.color = '#ffcc00';
        detailPrecio.style.textShadow = '0 0 10px rgba(255, 204, 0, 0.5)';
        detailImgWrap.style.borderColor = 'rgba(255, 204, 0, 0.4)';
        detailImgWrap.style.boxShadow = '0 0 25px rgba(255, 204, 0, 0.15)';
        hudBoxes.forEach(box => {
          box.style.borderColor = 'rgba(255, 204, 0, 0.15)';
          box.style.background = 'rgba(255, 204, 0, 0.02)';
        });
      }

      if (detailModal) {
        detailModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // ESC para cerrar
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      closeDetailModal();
    }
  });

  // Abrir modal de edición automáticamente si se pasa el parámetro ?editar=ID por GET (desde el Dashboard)
  const urlParams = new URLSearchParams(window.location.search);
  const editarId = urlParams.get('editar');
  if (editarId) {
    const targetBtn = document.querySelector(`.edit-figure-btn[data-id="${editarId}"]`);
    if (targetBtn) {
      setTimeout(() => {
        targetBtn.click();
      }, 150);
    }
  }
});
