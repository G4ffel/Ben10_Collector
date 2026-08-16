document.addEventListener('DOMContentLoaded', () => {

  // === 1. CAMBIO DE VISTA (GRID Y TABLA) ===
  const viewGridBtn = document.getElementById('viewGridBtn');
  const viewTableBtn = document.getElementById('viewTableBtn');
  const alienGridView = document.getElementById('alienGridView');
  const alienTableView = document.getElementById('alienTableView');

  const setViewMode = (mode) => {
    if (mode === 'table') {
      if (alienGridView) alienGridView.style.display = 'none';
      if (alienTableView) alienTableView.style.display = 'block';
      if (viewGridBtn) viewGridBtn.classList.remove('active');
      if (viewTableBtn) viewTableBtn.classList.add('active');
    } else {
      if (alienGridView) alienGridView.style.display = 'grid';
      if (alienTableView) alienTableView.style.display = 'none';
      if (viewGridBtn) viewGridBtn.classList.add('active');
      if (viewTableBtn) viewTableBtn.classList.remove('active');
    }
    localStorage.setItem('alien_view_preference', mode);
  };

  if (viewGridBtn) viewGridBtn.addEventListener('click', () => setViewMode('grid'));
  if (viewTableBtn) viewTableBtn.addEventListener('click', () => setViewMode('table'));

  // Cargar preferencia guardada o grid por defecto
  const savedView = localStorage.getItem('alien_view_preference') || 'grid';
  setViewMode(savedView);


  // === 2. FILTRADO POR SERIE (CHIPS) Y BÚSQUEDA EN TIEMPO REAL ===
  const searchInput = document.getElementById('alienSearchInput');
  const seriesChips = document.querySelectorAll('.series-chip');
  let currentSeriesFilter = 'all';

  const filterAliens = () => {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const alienItems = document.querySelectorAll('.alien-item');

    alienItems.forEach(item => {
      const name = item.getAttribute('data-name') || '';
      const serie = item.getAttribute('data-serie') || '';

      const matchesSearch = query === '' || name.includes(query);
      const matchesSeries = currentSeriesFilter === 'all' || serie === currentSeriesFilter;

      if (matchesSearch && matchesSeries) {
        if (item.tagName === 'TR') {
          item.style.display = 'table-row';
        } else {
          item.style.display = 'flex';
        }
      } else {
        item.style.display = 'none';
      }
    });
  };

  if (searchInput) {
    searchInput.addEventListener('input', filterAliens);
  }

  seriesChips.forEach(chip => {
    chip.addEventListener('click', () => {
      seriesChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentSeriesFilter = chip.getAttribute('data-filter') || 'all';
      filterAliens();
    });
  });


  // === 3. MODAL DE FORMULARIO CON HOLOGRAMA EN VIVO ===
  const alienFormModal = document.getElementById('alienFormModal');
  const openAddBtn = document.getElementById('openAddAlienModalBtn');
  const closeX = document.getElementById('alienFormCloseX');
  const cancelBtn = document.getElementById('alienFormCancelBtn');
  const overlay = document.getElementById('alienFormOverlay');

  const modalTitle = document.getElementById('alienFormModalTitle');
  const submitBtn = document.getElementById('modalSubmitAlienBtn');
  const idInput = document.getElementById('modalAlienIdInput');
  const nombreInput = document.getElementById('modalAlienNombreInput');
  const serieSelect = document.getElementById('modalAlienSerieSelect');
  const imageLabel = document.getElementById('modalAlienImageLabel');
  
  const previewImg = document.getElementById('modalAlienPreviewImg');
  const previewText = document.getElementById('modalAlienPreviewText');

  const openFormModal = (isEdit = false, data = {}) => {
    if (!alienFormModal) return;

    if (isEdit) {
      if (modalTitle) modalTitle.textContent = "EDITAR REGISTRO DE ESPECIE";
      if (submitBtn) submitBtn.textContent = "GUARDAR CAMBIOS";
      if (idInput) idInput.value = data.id || '';
      if (nombreInput) nombreInput.value = data.nombre || '';
      if (serieSelect) serieSelect.value = data.serie || 'Ben 10';
      if (previewText) previewText.textContent = data.nombre ? data.nombre.toUpperCase() : 'ESPECIE';
      if (previewImg) {
        previewImg.src = data.imagen || '/media/omnitrix/Ben_10_Omnitrix.png';
      }
      if (imageLabel) {
        imageLabel.textContent = data.imagen ? "CAMBIAR FOTO" : "SUBIR IMAGEN ALIEN";
      }
    } else {
      if (modalTitle) modalTitle.textContent = "REGISTRAR NUEVA ESPECIE";
      if (submitBtn) submitBtn.textContent = "+ REGISTRAR";
      if (idInput) idInput.value = '';
      if (nombreInput) nombreInput.value = '';
      if (serieSelect) serieSelect.value = 'Ben 10';
      if (previewText) previewText.textContent = "NUEVA ESPECIE";
      if (previewImg) previewImg.src = '/media/omnitrix/Ben_10_Omnitrix.png';
      if (imageLabel) imageLabel.textContent = "SUBIR IMAGEN ALIEN";
    }

    alienFormModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (nombreInput) setTimeout(() => nombreInput.focus(), 100);
  };

  const closeFormModal = () => {
    if (alienFormModal) {
      alienFormModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  if (openAddBtn) openAddBtn.addEventListener('click', () => openFormModal(false));
  if (closeX) closeX.addEventListener('click', closeFormModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeFormModal);
  if (overlay) overlay.addEventListener('click', closeFormModal);

  // Pre-fill modal al presionar "Editar" en tarjetas o tabla
  document.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-alien-db-btn');
    if (editBtn) {
      e.preventDefault();
      const id = editBtn.getAttribute('data-id');
      const nombre = editBtn.getAttribute('data-nombre');
      const serie = editBtn.getAttribute('data-serie');
      const imagen = editBtn.getAttribute('data-imagen');

      openFormModal(true, { id, nombre, serie, imagen });
    }
  });

  // Vista previa de texto en vivo en el Holograma del Modal
  if (nombreInput && previewText) {
    nombreInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      previewText.textContent = val ? val.toUpperCase() : (idInput && idInput.value ? 'EDITAR ESPECIE' : 'NUEVA ESPECIE');
    });
  }


  // === 4. MODAL GALERÍA DE HOLOGRAMAS ===
  const alienGalleryBtn = document.getElementById('openAlienGalleryBtn');
  const alienGalleryModal = document.getElementById('alienGalleryModal');
  const alienGalleryCloseX = document.getElementById('alienGalleryCloseX');
  const alienGalleryOverlay = document.getElementById('alienGalleryOverlay');

  if (alienGalleryBtn && alienGalleryModal) {
    alienGalleryBtn.addEventListener('click', () => {
      alienGalleryModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }

  const closeAlienGalleryModal = () => {
    if (alienGalleryModal) {
      alienGalleryModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  if (alienGalleryCloseX) alienGalleryCloseX.addEventListener('click', closeAlienGalleryModal);
  if (alienGalleryOverlay) alienGalleryOverlay.addEventListener('click', closeAlienGalleryModal);

  // === 5. ZOOM DE IMAGEN EN LA BASE DE DATOS (GRID, TABLA Y GALERÍA) ===
  const zoomModal = document.getElementById('alienGalleryZoomModal');
  const zoomImg = document.getElementById('zoomAlienImg');
  const zoomName = document.getElementById('zoomAlienName');
  const zoomSerie = document.getElementById('zoomAlienSerie');
  const zoomOverlay = document.getElementById('alienGalleryZoomOverlay');
  const zoomContent = document.getElementById('alienGalleryZoomContent');
  const zoomCloseX = document.getElementById('alienGalleryZoomCloseX');
  const zoomImgFrame = document.getElementById('zoomImgFrame');

  const openZoomModal = (nombre, serie, imagenSrc) => {
    if (!zoomModal || !zoomImg || !zoomName || !zoomSerie) return;

    zoomImg.src = imagenSrc || '/media/omnitrix/Ben_10_Omnitrix.png';
    zoomName.textContent = nombre || 'ESPECIE';
    zoomSerie.textContent = serie || 'Ben 10';

    // Determinar estilo de serie
    let color = 'var(--green-primary)';
    let shadow = 'rgba(0, 255, 65, 0.4)';
    let badgeClass = 'serie-classic';

    if (serie === 'Ben 10 Alien Force') {
      color = '#00ccff';
      shadow = 'rgba(0, 204, 255, 0.4)';
      badgeClass = 'serie-af';
    } else if (serie === 'Ben 10 Omniverse') {
      color = '#d880ff';
      shadow = 'rgba(216, 128, 255, 0.4)';
      badgeClass = 'serie-ov';
    } else if (serie === 'Personajes') {
      color = '#ffcc00';
      shadow = 'rgba(255, 204, 0, 0.4)';
      badgeClass = 'serie-personajes';
    } else if (serie === 'Villanos') {
      color = '#ff3333';
      shadow = 'rgba(255, 51, 51, 0.4)';
      badgeClass = 'serie-villanos';
    }

    // Aplicar clase badge de serie
    zoomSerie.className = `figure-serie-badge ${badgeClass}`;

    // Aplicar estilos sci-fi al modal de zoom
    if (zoomContent) {
      zoomContent.style.borderColor = color;
      zoomContent.style.boxShadow = `0 0 50px ${shadow}`;
    }
    zoomName.style.color = color;
    zoomName.style.textShadow = `0 0 12px ${shadow}`;

    if (zoomImgFrame) {
      zoomImgFrame.style.borderColor = color;
      zoomImgFrame.style.boxShadow = `0 0 30px ${shadow}`;
    }

    if (zoomCloseX) {
      zoomCloseX.style.color = color;
    }

    zoomModal.style.display = 'flex';
    setTimeout(() => {
      if (zoomContent) zoomContent.style.transform = 'scale(1)';
    }, 10);
  };

  const closeZoomModal = () => {
    if (zoomModal && zoomContent) {
      zoomContent.style.transform = 'scale(0.9)';
      setTimeout(() => {
        zoomModal.style.display = 'none';
      }, 150);
    }
  };

  if (zoomOverlay) zoomOverlay.addEventListener('click', closeZoomModal);
  if (zoomCloseX) zoomCloseX.addEventListener('click', closeZoomModal);

  // Tecla Escape para cerrar zoom modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && zoomModal && zoomModal.style.display === 'flex') {
      closeZoomModal();
    }
  });

  // Delegación de eventos de clic para tarjetas Grid y filas de Tabla
  document.addEventListener('click', (e) => {
    // Si el clic fue en los botones de editar o eliminar, no abrir zoom
    if (e.target.closest('.edit-alien-db-btn') || e.target.closest('a[href*="eliminar"]') || e.target.closest('.alien-card-actions')) {
      return;
    }

    // Clic en tarjeta Grid
    const card = e.target.closest('.alien-card-omni');
    if (card) {
      const nombre = card.getAttribute('data-nombre-real') || card.querySelector('.alien-card-title')?.textContent?.trim() || '';
      const serie = card.getAttribute('data-serie') || 'Ben 10';
      const imagen = card.getAttribute('data-imagen') || card.querySelector('img')?.src || '';

      if (nombre) {
        openZoomModal(nombre, serie, imagen);
      }
      return;
    }

    // Clic en fila de Tabla
    const row = e.target.closest('tr.table-row-hover');
    if (row) {
      const nombre = row.getAttribute('data-nombre-real') || row.querySelector('td span')?.textContent?.trim() || '';
      const serie = row.getAttribute('data-serie') || 'Ben 10';
      const imagen = row.getAttribute('data-imagen') || row.querySelector('img')?.src || '';

      if (nombre) {
        openZoomModal(nombre, serie, imagen);
      }
      return;
    }
  });

  // Zoom en Hologramas de la Galería
  const holoItems = document.querySelectorAll('.gallery-holo-item');
  holoItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const nombre = item.getAttribute('title');
      const wrapper = item.closest('.gallery-section-wrapper');
      const serie = wrapper ? wrapper.querySelector('h3').textContent.trim() : '';

      if (nombre && img) {
        openZoomModal(nombre, serie, img.src);
      }
    });
  });

  // Inicializar filtro desde parámetro URL ?serie= si existe
  const urlParams = new URLSearchParams(window.location.search);
  const initialSerie = urlParams.get('serie');
  if (initialSerie) {
    const targetChip = Array.from(seriesChips).find(c => c.getAttribute('data-filter') === initialSerie);
    if (targetChip) {
      seriesChips.forEach(c => c.classList.remove('active'));
      targetChip.classList.add('active');
      currentSeriesFilter = initialSerie;
      filterAliens();
    }
  }
});

// Actualiza la vista previa del holograma cuando se selecciona un archivo de foto
function updateModalAlienFileLabel(input) {
  const label = document.getElementById('modalAlienImageLabel');
  const previewImg = document.getElementById('modalAlienPreviewImg');

  if (input.files && input.files[0]) {
    const file = input.files[0];
    if (label) {
      label.textContent = "✓ " + file.name.toUpperCase();
      label.style.borderColor = "var(--green-primary)";
      label.style.color = "var(--dark-1)";
      label.style.background = "linear-gradient(135deg, var(--green-primary), var(--green-mid))";
      label.style.boxShadow = "0 0 15px var(--green-glow)";
    }

    if (previewImg) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  } else {
    if (label) {
      label.textContent = "SUBIR IMAGEN ALIEN";
      label.style.borderColor = "var(--border-green)";
      label.style.color = "var(--green-primary)";
      label.style.background = "var(--dark-3)";
      label.style.boxShadow = "none";
    }
  }
}
