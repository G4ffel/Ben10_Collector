/**
 * modal-figure.js
 * Modal de Añadir / Editar figura de colección (#omniFormModal)
 * Extraído de coleccion.js para tenerlo como archivo independiente.
 */
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('omniFormModal');
  const openAddBtn = document.getElementById('openAddModalBtn');
  const closeBtnX = document.getElementById('modalFormCloseX');
  const cancelBtn = document.getElementById('modalFormCancel');
  const form = document.getElementById('omniFigureForm');
  const formTitle = document.getElementById('modalFormTitle');
  const imageHint = document.getElementById('imageHint');
  const imageInput = document.querySelector('#omniFigureForm input[type="file"]');

  const nombreInput = document.getElementById('id_nombre') || document.querySelector('#omniFigureForm [name="nombre"]');
  const precioInput = document.querySelector('#omniFigureForm [name="precio"]');
  const fechaInput = document.querySelector('#omniFigureForm [name="fecha_adquisicion"]');
  const serieSelect = document.querySelector('#omniFigureForm select[name="serie"]');
  const fileChosenName = document.getElementById('fileChosenName');

  // ── Datos de aliens por serie ──────────────────────────────────────────────
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
      console.error('Error parsing aliens JSON data:', e);
    }
  } else if (window.aliensPorSerieDb) {
    aliensPorSerie = window.aliensPorSerieDb;
  }

  // ── Filtrar select de nombre según serie ───────────────────────────────────
  const filterNombreSelect = (serieSelectedValue) => {
    if (!nombreInput) return;
    const permitidos = aliensPorSerie[serieSelectedValue] || [];
    const permitidosNombres = permitidos.map(a => typeof a === 'string' ? a : a.nombre);

    let firstVisible = null;
    let currentValueValid = false;

    Array.from(nombreInput.options).forEach(option => {
      const alienName = option.value;
      if (!alienName) return;
      const perteneceSerie = (permitidosNombres.length === 0) || permitidosNombres.some(p => p.toLowerCase().trim() === alienName.toLowerCase().trim());

      if (perteneceSerie) {
        option.style.display = '';
        option.disabled = false;
        if (!firstVisible) firstVisible = alienName;
        if (alienName === nombreInput.value) currentValueValid = true;
      } else {
        option.style.display = 'none';
        option.disabled = true;
      }
    });

    if (!currentValueValid && firstVisible) {
      nombreInput.value = firstVisible;
    }

    updateAlienPreview(serieSelectedValue, nombreInput.value);
  };

  // ── Preview del alien seleccionado ─────────────────────────────────────────
  const updateAlienPreview = (serieValue, alienName) => {
    // Si ya hay un archivo seleccionado por el usuario, no sobrescribir su preview
    if (imageInput && imageInput.files && imageInput.files.length > 0) return;

    const permitidos = aliensPorSerie[serieValue] || [];
    const matchObj = permitidos.find(a => (typeof a === 'object' && a.nombre.toLowerCase().trim() === alienName.toLowerCase().trim()));
    const defaultImgUrl = matchObj ? matchObj.imagen_url : '/media/omnitrix/Ben_10_Omnitrix.png';

    const previewFull = document.getElementById('figureAddPreviewFull');
    const placeholder = document.getElementById('figureAddImageUploadPlaceholder');
    const previewText = document.getElementById('figureAddAlienPreviewText');
    const filenameOverlay = document.getElementById('figureAddFilenameOverlay');

    if (defaultImgUrl !== '/media/omnitrix/Ben_10_Omnitrix.png') {
      // Mostrar imagen del alien sin márgenes
      if (previewFull) {
        previewFull.src = defaultImgUrl;
        previewFull.style.display = 'block';
      }
      if (placeholder) placeholder.style.display = 'none';
      if (filenameOverlay) filenameOverlay.style.display = 'block';
      if (fileChosenName) {
        // Si el formulario es de edición y no se ha cambiado la imagen, mostrar "Imagen actual"
        if (formTitle && formTitle.textContent.includes('DETALLE')) {
          fileChosenName.textContent = 'Imagen actual';
        } else {
          fileChosenName.textContent = 'Imagen de Base de Datos';
        }
      }
    } else {
      // Volver al Omnitrix girando
      if (previewFull) {
        previewFull.src = '';
        previewFull.style.display = 'none';
      }
      if (placeholder) placeholder.style.display = 'flex';
      if (previewText) previewText.style.display = 'block';
      if (filenameOverlay) filenameOverlay.style.display = 'none';
    }
  };

  if (nombreInput) {
    nombreInput.addEventListener('change', () => {
      if (serieSelect) updateAlienPreview(serieSelect.value, nombreInput.value);
    });
  }

  if (serieSelect) {
    serieSelect.addEventListener('change', () => {
      filterNombreSelect(serieSelect.value);
    });
  }

  // ── Click en wrapper abre selector de archivo ──────────────────────────────
  const previewImgWrap = document.getElementById('figureAddAlienPreviewImgWrap');
  if (previewImgWrap && imageInput) {
    previewImgWrap.addEventListener('click', () => {
      imageInput.click();
    });
  }

  // ── Cambio de archivo → preview full-bleed ─────────────────────────────────
  if (imageInput && fileChosenName) {
    imageInput.addEventListener('change', () => {
      const filenameOverlay = document.getElementById('figureAddFilenameOverlay');
      if (imageInput.files && imageInput.files.length > 0) {
        const file = imageInput.files[0];
        fileChosenName.textContent = `${file.name}`;
        if (filenameOverlay) filenameOverlay.style.display = 'block';
        if (imageHint) imageHint.style.display = 'none';

        const reader = new FileReader();
        reader.onload = (e) => {
          const previewFull = document.getElementById('figureAddPreviewFull');
          const placeholder = document.getElementById('figureAddImageUploadPlaceholder');
          if (previewFull) {
            previewFull.src = e.target.result;
            previewFull.style.display = 'block';
          }
          if (placeholder) placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
      } else {
        if (formTitle && formTitle.textContent.includes('DETALLE')) {
          fileChosenName.textContent = 'Mantener imagen actual';
          if (filenameOverlay) filenameOverlay.style.display = 'block';
          if (imageHint) imageHint.style.display = 'block';
        } else {
          fileChosenName.textContent = 'Sin archivos seleccionados';
          if (filenameOverlay) filenameOverlay.style.display = 'none';
          if (imageHint) imageHint.style.display = 'none';
        }
      }
    });
  }

  // ── Abrir / Cerrar modal ───────────────────────────────────────────────────
  const openModal = () => {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (serieSelect) filterNombreSelect(serieSelect.value);
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (form) form.reset();
      if (imageHint) imageHint.style.display = 'none';
      if (imageInput) imageInput.required = false;
      if (fileChosenName) fileChosenName.textContent = 'Sin archivos seleccionados';

      const filenameOverlay = document.getElementById('figureAddFilenameOverlay');
      if (filenameOverlay) filenameOverlay.style.display = 'none';

      const previewFull = document.getElementById('figureAddPreviewFull');
      const placeholder = document.getElementById('figureAddImageUploadPlaceholder');
      if (previewFull) {
        previewFull.src = '';
        previewFull.style.display = 'none';
      }
      if (placeholder) placeholder.style.display = 'flex';
      const previewText = document.getElementById('figureAddAlienPreviewText');
      if (previewText) previewText.style.display = 'block';
    }
  };

  if (openAddBtn) {
    openAddBtn.addEventListener('click', () => {
      if (formTitle) formTitle.textContent = 'AÑADIR NUEVA FIGURA';
      if (form) form.action = '/coleccion/';

      const formSerieBox = document.getElementById('formSerieBox');
      const formNombreBox = document.getElementById('formNombreBox');
      const formSerieReadOnlyBox = document.getElementById('formSerieReadOnlyBox');
      if (formSerieBox) formSerieBox.style.display = 'flex';
      if (formNombreBox) formNombreBox.style.display = 'flex';
      if (formSerieReadOnlyBox) formSerieReadOnlyBox.style.display = 'none';

      closeModal();
      openModal();
    });
  }

  if (closeBtnX) closeBtnX.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  const overlay = document.getElementById('modalFormOverlay');
  if (overlay) overlay.addEventListener('click', closeModal);

  // ── Abrir en modo editar ───────────────────────────────────────────────────
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.edit-figure-btn');
    if (btn) {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      const nombre = btn.getAttribute('data-nombre');
      const precio = btn.getAttribute('data-precio');
      const fecha = btn.getAttribute('data-fecha');
      const serie = btn.getAttribute('data-serie');
      const estado = btn.getAttribute('data-estado');
      const marca = btn.getAttribute('data-marca');
      const tamano = btn.getAttribute('data-tamano');

      const figureCard = btn.closest('.figure-card-omni');
      const imgEl = figureCard ? figureCard.querySelector('.figure-img-wrap img') : null;
      const imagenUrl = btn.getAttribute('data-imagen') || (imgEl ? imgEl.src : '');

      if (formTitle) formTitle.textContent = `DETALLE DE ${nombre.toUpperCase()}`;
      if (form) form.action = `/coleccion/editar/${id}/`;

      const formSerieBox = document.getElementById('formSerieBox');
      const formNombreBox = document.getElementById('formNombreBox');
      const formSerieReadOnlyBox = document.getElementById('formSerieReadOnlyBox');
      const formSerieReadOnlyText = document.getElementById('formSerieReadOnlyText');
      if (formSerieBox) formSerieBox.style.display = 'none';
      if (formNombreBox) formNombreBox.style.display = 'none';
      if (formSerieReadOnlyBox) formSerieReadOnlyBox.style.display = 'flex';
      if (formSerieReadOnlyText) formSerieReadOnlyText.textContent = serie;

      if (precioInput) precioInput.value = precio;
      if (fechaInput) fechaInput.value = fecha;
      if (serieSelect) {
        serieSelect.value = serie;
        filterNombreSelect(serieSelect.value);
      }
      if (nombreInput) nombreInput.value = nombre;

      const estadoSelect = document.querySelector('select[name="estado"]');
      const marcaSelect = document.querySelector('select[name="marca"]');
      const tamanoSelect = document.querySelector('select[name="tamano"]');
      const subcategoriaSelect = document.querySelector('select[name="subcategoria"]');
      const subcategoria = btn.getAttribute('data-subcategoria');

      if (estadoSelect) estadoSelect.value = estado;
      if (marcaSelect) marcaSelect.value = marca;
      if (tamanoSelect) tamanoSelect.value = tamano;
      if (subcategoriaSelect) subcategoriaSelect.value = subcategoria || '';

      const previewFull = document.getElementById('figureAddPreviewFull');
      const placeholder = document.getElementById('figureAddImageUploadPlaceholder');
      if (previewFull && imagenUrl) {
        previewFull.src = imagenUrl;
        previewFull.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
      }

      if (imageInput) imageInput.required = false;
      if (imageHint) imageHint.style.display = 'block';
      if (fileChosenName) fileChosenName.textContent = 'Mantener imagen actual';
      const filenameOverlay = document.getElementById('figureAddFilenameOverlay');
      if (filenameOverlay) filenameOverlay.style.display = 'block';

      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  });

  // ── ESC para cerrar ────────────────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // ── Abrir edición desde URL ?editar=ID ────────────────────────────────────
  const urlParams = new URLSearchParams(window.location.search);
  const editarId = urlParams.get('editar');
  if (editarId) {
    const targetBtn = document.querySelector(`.edit-figure-btn[data-id="${editarId}"]`);
    if (targetBtn) {
      setTimeout(() => targetBtn.click(), 150);
    }
  }
});
