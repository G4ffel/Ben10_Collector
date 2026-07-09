/**
 * modal-figure-custom.js
 * Modal de Alien Personalizado en Colección (#figureCustomModal)
 */
document.addEventListener('DOMContentLoaded', () => {
  const customModal = document.getElementById('figureCustomModal');
  const openCustomBtn = document.getElementById('openCustomModalBtn');
  const closeCustomBtnX = document.getElementById('figureCustomFormCloseX');
  const cancelCustomBtn = document.getElementById('figureCustomFormCancel');
  
  const customPreviewImgWrap = document.getElementById('figureCustomAlienPreviewImgWrap');
  const customFileInput = document.querySelector('#figureCustomModal input[type="file"]');
  const customFileChosenName = document.getElementById('figureCustomFileChosenName');
  
  const previewFull = document.getElementById('figureCustomPreviewFull');
  const placeholder = document.getElementById('figureCustomImageUploadPlaceholder');
  const filenameOverlay = document.getElementById('figureCustomFilenameOverlay');

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
      const customForm = document.querySelector('#figureCustomModal form');
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
  const customOverlay = document.getElementById('figureCustomOverlay');
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
});
