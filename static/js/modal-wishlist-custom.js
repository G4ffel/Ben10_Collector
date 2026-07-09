/**
 * modal-wishlist-custom.js
 * Modal de Alien Personalizado en Wishlist (#wishlistCustomModal)
 * Extraído de wishlist.js para tenerlo como archivo independiente.
 */
document.addEventListener('DOMContentLoaded', () => {
  const customModal = document.getElementById('wishlistCustomModal');
  const openCustomBtn = document.getElementById('openCustomWishlistBtn');
  const closeCustomBtnX = document.getElementById('wishlistCustomFormCloseX');
  const cancelCustomBtn = document.getElementById('wishlistCustomFormCancel');
  
  const customPreviewImgWrap = document.getElementById('wishlistCustomAlienPreviewImgWrap');
  const customFileInput = document.querySelector('#wishlistCustomModal input[type="file"]');
  const customFileChosenName = document.getElementById('wishlistCustomFileChosenName');
  
  const previewFull = document.getElementById('wishlistCustomPreviewFull');
  const placeholder = document.getElementById('wishlistCustomImageUploadPlaceholder');
  const filenameOverlay = document.getElementById('wishlistCustomFilenameOverlay');

  // ── Abrir / Cerrar modal ───────────────────────────────────────────────────
  const openCustomModal = () => {
    if (customModal) {
      customModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeCustomModal = () => {
    if (customModal) {
      customModal.classList.remove('active');
      document.body.style.overflow = '';
      const customForm = document.querySelector('#wishlistCustomModal form');
      if (customForm) customForm.reset();

      // Reset preview states
      if (previewFull) {
        previewFull.src = '';
        previewFull.style.display = 'none';
      }
      if (placeholder) {
        placeholder.style.display = 'flex';
      }
      if (filenameOverlay) {
        filenameOverlay.style.display = 'none';
      }
      if (customFileChosenName) {
        customFileChosenName.textContent = 'Sin archivo';
      }
    }
  };

  if (openCustomBtn) openCustomBtn.addEventListener('click', openCustomModal);
  if (closeCustomBtnX) closeCustomBtnX.addEventListener('click', closeCustomModal);
  if (cancelCustomBtn) cancelCustomBtn.addEventListener('click', closeCustomModal);
  const customOverlay = document.getElementById('wishlistCustomOverlay');
  if (customOverlay) customOverlay.addEventListener('click', closeCustomModal);

  // ── Click en el holograma para disparar selector de archivos ─────────────
  if (customPreviewImgWrap && customFileInput) {
    customPreviewImgWrap.addEventListener('click', () => {
      customFileInput.click();
    });
  }

  // ── Preview de imagen seleccionada ────────────────────────────────────────
  if (customFileInput) {
    customFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (customFileChosenName) customFileChosenName.textContent = file.name;
        if (filenameOverlay) filenameOverlay.style.display = 'block';
        
        const reader = new FileReader();
        reader.onload = (event) => {
          if (previewFull) {
            previewFull.src = event.target.result;
            previewFull.style.display = 'block';
          }
          if (placeholder) {
            placeholder.style.display = 'none';
          }
        };
        reader.readAsDataURL(file);
      } else {
        // Reset preview if cancelled
        if (previewFull) {
          previewFull.src = '';
          previewFull.style.display = 'none';
        }
        if (placeholder) {
          placeholder.style.display = 'flex';
        }
        if (filenameOverlay) {
          filenameOverlay.style.display = 'none';
        }
        if (customFileChosenName) {
          customFileChosenName.textContent = 'Sin archivo';
        }
      }
    });
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCustomModal(); });

  // Auto-open modal if there are validation errors
  const errorMarker = document.getElementById('custom-wishlist-error-marker');
  if (errorMarker) {
    openCustomModal();
  }
});
