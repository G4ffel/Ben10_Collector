document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('omniFormModal');
  const openAddBtn = document.getElementById('openAddModalBtn');
  const closeBtnX = document.getElementById('modalFormCloseX');
  const cancelBtn = document.getElementById('modalFormCancel');
  const form = document.getElementById('omniFigureForm');
  const formTitle = document.getElementById('modalFormTitle');
  const imageHint = document.getElementById('imageHint');
  const imageInput = document.querySelector('input[type="file"]');

  // Campos del formulario
  const nombreInput = document.getElementById('id_nombre') || document.querySelector('#omniFigureForm [name="nombre"]');
  const precioInput = document.querySelector('#omniFigureForm [name="precio"]');
  const fechaInput = document.querySelector('#omniFigureForm [name="fecha_adquisicion"]');
  const serieSelect = document.querySelector('#omniFigureForm select[name="serie"]');
  const fileChosenName = document.getElementById('fileChosenName');
  const autocompleteInput = document.getElementById('alienAutocompleteInput');
  const autocompleteList = document.getElementById('alienAutocompleteList');

  // Relación de aliens por serie cargada desde la base de datos
  const aliensPorSerie = window.aliensPorSerieDb || {
    'Ben 10': [],
    'Ben 10 Alien Force': [],
    'Ben 10 Omniverse': []
  };

  const renderAutocompleteList = (serieSelectedValue, searchQuery = '') => {
    if (!nombreInput || !autocompleteList) return;
    const permitidos = aliensPorSerie[serieSelectedValue] || [];
    const query = searchQuery.toLowerCase().trim();

    autocompleteList.innerHTML = ''; // Limpiar lista
    let primerVisible = null;
    let valorActualValido = false;

    // Leemos las opciones del select nativo de Django para generar los li
    Array.from(nombreInput.options).forEach(option => {
      const alienName = option.value;
      const perteneceSerie = (permitidos.length === 0) || permitidos.includes(alienName);
      const coincideBusqueda = alienName.toLowerCase().includes(query);

      if (perteneceSerie && coincideBusqueda) {
        const li = document.createElement('li');
        li.textContent = alienName;
        li.addEventListener('click', () => {
          if (autocompleteInput) autocompleteInput.value = alienName;
          nombreInput.value = alienName; // Sincroniza al select oculto de Django
          autocompleteList.style.display = 'none';
        });
        autocompleteList.appendChild(li);

        if (!primerVisible) primerVisible = alienName;
        if (alienName === nombreInput.value) valorActualValido = true;
      }
    });

    // Si el valor seleccionado en el select nativo no es válido en esta serie/filtro, lo actualizamos al primero válido
    if (!valorActualValido && primerVisible) {
      nombreInput.value = primerVisible;
      if (document.activeElement !== autocompleteInput && autocompleteInput) {
        autocompleteInput.value = primerVisible;
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

  // Escuchar cambios en la selección de archivo
  if (imageInput && fileChosenName) {
    imageInput.addEventListener('change', () => {
      if (imageInput.files && imageInput.files.length > 0) {
        fileChosenName.textContent = `${imageInput.files[0].name}`;
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
      if (imageInput) imageInput.required = true;
      if (fileChosenName) fileChosenName.textContent = "Sin archivos seleccionados";
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

      if (estadoSelect) estadoSelect.value = estado;
      if (marcaSelect) marcaSelect.value = marca;
      if (tamanoSelect) tamanoSelect.value = tamano;

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
