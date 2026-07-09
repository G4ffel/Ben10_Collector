/**
 * modal-wishlist-move.js
 * Modal de Mover Alien a Colección (#moveToCollectionModal)
 * Incluye carga de errores de validación automática.
 * Extraído de wishlist.js para tenerlo como archivo independiente.
 */
document.addEventListener('DOMContentLoaded', () => {
  const moveModal = document.getElementById('moveToCollectionModal');
  const closeMoveBtnX = document.getElementById('moveToCollectionCloseX');
  const cancelMoveBtn = document.getElementById('moveToCollectionCancel');
  const moveForm = document.getElementById('moveToCollectionForm');

  const moveToCollectionTitle = document.getElementById('moveToCollectionTitle');
  const displayAlienSerie = document.getElementById('displayAlienSerie');
  const moveAlienNombreVal = document.getElementById('moveAlienNombreVal');
  const moveAlienSerieVal = document.getElementById('moveAlienSerieVal');

  const moveAlienImgWrap = document.getElementById('moveAlienImgWrap');
  const moveImageInput = document.getElementById('moveFileImage');
  const moveFileChosenName = document.getElementById('moveFileChosenName');
  const imageUploadPlaceholder = document.getElementById('imageUploadPlaceholder');
  const moveAlienPreviewImg = document.getElementById('moveAlienPreviewImg');
  const filenameOverlay = document.getElementById('filenameOverlay');

  // ── Click en wrapper → seleccionar archivo ────────────────────────────────
  if (moveAlienImgWrap && moveImageInput) {
    moveAlienImgWrap.addEventListener('click', () => moveImageInput.click());
  }

  // ── Reset preview ─────────────────────────────────────────────────────────
  const resetImagePreview = () => {
    if (moveAlienPreviewImg) { moveAlienPreviewImg.src = ''; moveAlienPreviewImg.style.display = 'none'; }
    if (imageUploadPlaceholder) imageUploadPlaceholder.style.display = 'flex';
    if (filenameOverlay) filenameOverlay.style.display = 'none';
    if (moveFileChosenName) moveFileChosenName.textContent = 'Sin archivo';
  };

  // ── Preview de imagen nueva ───────────────────────────────────────────────
  if (moveImageInput) {
    moveImageInput.addEventListener('change', () => {
      if (moveImageInput.files && moveImageInput.files.length > 0) {
        const file = moveImageInput.files[0];
        if (moveFileChosenName) moveFileChosenName.textContent = file.name;
        if (filenameOverlay) filenameOverlay.style.display = 'block';
        const reader = new FileReader();
        reader.onload = (e) => {
          if (moveAlienPreviewImg) { moveAlienPreviewImg.src = e.target.result; moveAlienPreviewImg.style.display = 'block'; }
          if (imageUploadPlaceholder) imageUploadPlaceholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
      } else {
        resetImagePreview();
      }
    });
  }

  // ── Abrir modal ────────────────────────────────────────────────────────────
  const openMoveModal = (btn) => {
    if (!moveModal) return;
    const id = btn.getAttribute('data-id');
    const nombre = btn.getAttribute('data-nombre');
    const serie = btn.getAttribute('data-serie');
    const precio = btn.getAttribute('data-precio') || '0';
    const fecha = btn.getAttribute('data-fecha') || '';
    const estado = btn.getAttribute('data-estado') || 'excelente';
    const marca = btn.getAttribute('data-marca') || 'original';
    const tamano = btn.getAttribute('data-tamano') || 'mediano';
    const subcategoria = btn.getAttribute('data-subcategoria') || '';
    const imagenUrl = btn.getAttribute('data-imagen') || '';

    if (moveToCollectionTitle) moveToCollectionTitle.textContent = 'DETALLE DE ' + nombre.toUpperCase();
    if (displayAlienSerie) displayAlienSerie.textContent = serie;
    if (moveAlienNombreVal) moveAlienNombreVal.value = nombre;
    if (moveAlienSerieVal) moveAlienSerieVal.value = serie;
    if (moveForm) moveForm.action = `/wishlist/mover/${id}/`;

    const precioField = document.getElementById('id_precio');
    const fechaField = document.getElementById('id_fecha_adquisicion');
    const estadoField = document.getElementById('id_estado');
    const marcaField = document.getElementById('id_marca');
    const tamanoField = document.getElementById('id_tamano');
    const subcategoriaField = document.getElementById('id_subcategoria');

    if (precioField) precioField.value = precio;
    if (fechaField) fechaField.value = fecha;
    if (estadoField) estadoField.value = estado;
    if (marcaField) marcaField.value = marca;
    if (tamanoField) tamanoField.value = tamano;
    if (subcategoriaField) subcategoriaField.value = subcategoria;

    if (imagenUrl) {
      if (moveAlienPreviewImg) { moveAlienPreviewImg.src = imagenUrl; moveAlienPreviewImg.style.display = 'block'; }
      if (imageUploadPlaceholder) imageUploadPlaceholder.style.display = 'none';
      if (filenameOverlay) filenameOverlay.style.display = 'block';
      if (moveFileChosenName) moveFileChosenName.textContent = 'Imagen desde wishlist';
    } else {
      resetImagePreview();
    }

    moveModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // ── Cerrar modal ──────────────────────────────────────────────────────────
  const closeMoveModal = () => {
    if (moveModal) {
      moveModal.classList.remove('active');
      document.body.style.overflow = '';
      if (moveForm) moveForm.reset();
      resetImagePreview();
    }
  };

  document.querySelectorAll('.move-to-collection-btn').forEach(btn => {
    btn.addEventListener('click', () => openMoveModal(btn));
  });

  if (closeMoveBtnX) closeMoveBtnX.addEventListener('click', closeMoveModal);
  if (cancelMoveBtn) cancelMoveBtn.addEventListener('click', closeMoveModal);
  const moveOverlay = document.getElementById('moveToCollectionOverlay');
  if (moveOverlay) moveOverlay.addEventListener('click', closeMoveModal);

  // ── Cargar errores de validación automáticamente ──────────────────────────
  const errorMarker = document.getElementById('error-moving-id-marker');
  if (errorMarker) {
    const errorId = errorMarker.getAttribute('data-id');
    const matchedBtn = document.querySelector(`.wishlist-card[data-id="${errorId}"] .move-to-collection-btn`);
    if (matchedBtn) openMoveModal(matchedBtn);
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMoveModal(); });
});
