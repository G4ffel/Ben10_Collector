/**
 * modal-wishlist-edit.js
 * Modal de Editar Alien en Wishlist (#wishlistEditModal)
 * Extraído de wishlist.js para tenerlo como archivo independiente.
 */
document.addEventListener('DOMContentLoaded', () => {
  const editModal = document.getElementById('wishlistEditModal');
  const closeEditBtnX = document.getElementById('wishlistEditCloseX');
  const cancelEditBtn = document.getElementById('wishlistEditCancel');
  const editForm = document.getElementById('wishlistEditForm');
  const editAlienImgWrap = document.getElementById('editAlienImgWrap');
  const editFileImage = document.getElementById('editFileImage');
  const editAlienPreviewImg = document.getElementById('editAlienPreviewImg');
  const editImageUploadPlaceholder = document.getElementById('editImageUploadPlaceholder');
  const editFilenameOverlay = document.getElementById('editFilenameOverlay');
  const editFileChosenName = document.getElementById('editFileChosenName');
  const editAlienNombreInput = document.getElementById('editAlienNombre');
  const editAlienSerieSelect = document.getElementById('editAlienSerie');
  const editDisplayAlienSerie = document.getElementById('editDisplayAlienSerie');
  const editTitle = document.getElementById('wishlistEditTitle');

  // ── Abrir modal ────────────────────────────────────────────────────────────
  const openEditModal = (btn) => {
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

    if (editForm) editForm.action = `/wishlist/edit/${id}/`;
    if (editAlienNombreInput) editAlienNombreInput.value = nombre;
    if (editAlienSerieSelect) editAlienSerieSelect.value = serie;
    if (editDisplayAlienSerie) editDisplayAlienSerie.textContent = serie;
    if (editTitle) editTitle.textContent = `DETALLE DE ${nombre.toUpperCase()}`;

    const precioField = document.getElementById('editAlienPrecio');
    const fechaField = document.getElementById('editAlienFecha');
    const estadoField = document.getElementById('editAlienEstado');
    const marcaField = document.getElementById('editAlienMarca');
    const tamanoField = document.getElementById('editAlienTamano');
    const subcategoriaField = document.getElementById('editAlienSubcategoria');

    if (precioField) precioField.value = precio;
    if (fechaField) fechaField.value = fecha;
    if (estadoField) estadoField.value = estado;
    if (marcaField) marcaField.value = marca;
    if (tamanoField) tamanoField.value = tamano;
    if (subcategoriaField) subcategoriaField.value = subcategoria;

    if (imagenUrl) {
      if (editAlienPreviewImg) { editAlienPreviewImg.src = imagenUrl; editAlienPreviewImg.style.display = 'block'; }
      if (editImageUploadPlaceholder) editImageUploadPlaceholder.style.display = 'none';
      if (editFilenameOverlay) editFilenameOverlay.style.display = 'block';
      if (editFileChosenName) editFileChosenName.textContent = 'Imagen actual cargada';
    } else {
      if (editAlienPreviewImg) { editAlienPreviewImg.src = ''; editAlienPreviewImg.style.display = 'none'; }
      if (editImageUploadPlaceholder) editImageUploadPlaceholder.style.display = 'flex';
      if (editFilenameOverlay) editFilenameOverlay.style.display = 'none';
      if (editFileChosenName) editFileChosenName.textContent = 'Sin archivo';
    }

    if (editModal) {
      editModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  // ── Cerrar modal ──────────────────────────────────────────────────────────
  const closeEditModal = () => {
    if (editModal) {
      editModal.classList.remove('active');
      document.body.style.overflow = '';
    }
    if (editForm) editForm.reset();
  };

  if (closeEditBtnX) closeEditBtnX.addEventListener('click', closeEditModal);
  if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeEditModal);
  const editOverlay = document.getElementById('wishlistEditOverlay');
  if (editOverlay) editOverlay.addEventListener('click', closeEditModal);

  // ── Click en wrapper → seleccionar archivo ────────────────────────────────
  if (editAlienImgWrap && editFileImage) {
    editAlienImgWrap.addEventListener('click', () => editFileImage.click());
  }

  // ── Preview de imagen nueva ───────────────────────────────────────────────
  if (editFileImage) {
    editFileImage.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (editFileChosenName) editFileChosenName.textContent = file.name;
        if (editFilenameOverlay) editFilenameOverlay.style.display = 'block';
        const reader = new FileReader();
        reader.onload = (event) => {
          if (editAlienPreviewImg) { editAlienPreviewImg.src = event.target.result; editAlienPreviewImg.style.display = 'block'; }
          if (editImageUploadPlaceholder) editImageUploadPlaceholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ── Bind a botones de edición ─────────────────────────────────────────────
  document.querySelectorAll('.edit-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(btn));
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeEditModal(); });
});
