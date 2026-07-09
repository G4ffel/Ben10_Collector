/**
 * modal-wishlist-add.js
 * Modal de Agregar Alien a Wishlist (#wishlistAddModal)
 * Extraído de wishlist.js para tenerlo como archivo independiente.
 */
document.addEventListener('DOMContentLoaded', () => {
  const addModal = document.getElementById('wishlistAddModal');
  const openAddBtn = document.getElementById('openAddWishlistBtn');
  const closeAddBtnX = document.getElementById('wishlistAddCloseX');
  const cancelAddBtn = document.getElementById('wishlistAddCancel');
  const addForm = document.querySelector('#wishlistAddModal form');

  const autocompleteInput = document.getElementById('wishlistAlienInput');
  const autocompleteList = document.getElementById('wishlistAlienList');
  const nombreSelect = document.querySelector('#wishlistAddModal select[name="nombre"]');
  const serieSelect = document.querySelector('#wishlistAddModal select[name="serie"]');

  let aliensPorSerie = {
    'Ben 10': [], 'Ben 10 Alien Force': [],
    'Ben 10 Omniverse': [], 'Personajes': [], 'Villanos': []
  };

  const aliensDataEl = document.getElementById('aliens-por-serie-data');
  if (aliensDataEl) {
    try { aliensPorSerie = JSON.parse(aliensDataEl.textContent); }
    catch (e) { console.error('Error parsing aliens JSON data:', e); }
  }

  let selectedAliens = new Set();

  // ── UI de selección múltiple ──────────────────────────────────────────────
  const updateSelectedAliensUI = () => {
    if (autocompleteInput) {
      if (selectedAliens.size === 0) {
        autocompleteInput.value = '';
      } else if (selectedAliens.size === 1) {
        autocompleteInput.value = Array.from(selectedAliens)[0];
      } else {
        autocompleteInput.value = `${selectedAliens.size} seleccionados (${Array.from(selectedAliens).join(', ')})`;
      }
    }

    let container = document.getElementById('nombresMultipleContainer');
    if (!container && addForm) {
      container = document.createElement('div');
      container.id = 'nombresMultipleContainer';
      container.style.display = 'none';
      addForm.appendChild(container);
    }
    if (container) {
      container.innerHTML = '';
      selectedAliens.forEach(nombre => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'nombres_multiple';
        input.value = nombre;
        container.appendChild(input);
      });
    }

    if (nombreSelect && selectedAliens.size > 0) {
      nombreSelect.value = Array.from(selectedAliens)[0];
    }

    const previewFull = document.getElementById('wishlistAddPreviewFull');
    const placeholder = document.getElementById('wishlistAddAlienPlaceholder');
    const previewText = document.getElementById('wishlistAddAlienPreviewText');

    if (selectedAliens.size > 0) {
      const primerAlien = Array.from(selectedAliens)[0];
      const permitidos = aliensPorSerie[serieSelect.value] || [];
      const matchObj = permitidos.find(a => (typeof a === 'object' && a.nombre === primerAlien));
      const imgUrl = matchObj ? matchObj.imagen_url : '';

      if (imgUrl && previewFull) {
        previewFull.src = imgUrl;
        previewFull.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
      }
    } else {
      if (previewFull) { previewFull.src = ''; previewFull.style.display = 'none'; }
      if (placeholder) placeholder.style.display = 'flex';
      if (previewText) previewText.style.display = 'block';
    }
  };

  // ── Render lista autocomplete ─────────────────────────────────────────────
  const customSerieOptions = document.getElementById('wishlistCustomSerieOptions');

  const renderAutocompleteList = (serieSelectedValue, searchQuery = '') => {
    if (!nombreSelect || !autocompleteList) return;
    const permitidos = aliensPorSerie[serieSelectedValue] || [];
    const query = searchQuery.toLowerCase().trim();
    const permitidosNombres = permitidos.map(a => typeof a === 'string' ? a : a.nombre);

    autocompleteList.innerHTML = '';
    let primerVisible = null;
    let valorActualValido = false;

    Array.from(nombreSelect.options).forEach(option => {
      const alienName = option.value;
      const perteneceSerie = (permitidosNombres.length === 0) || permitidosNombres.includes(alienName);
      const coincideBusqueda = alienName.toLowerCase().includes(query);

      if (perteneceSerie && coincideBusqueda) {
        const li = document.createElement('li');
        li.style.cssText = 'display:flex;align-items:center;padding:10px 16px;cursor:pointer;';

        const check = document.createElement('span');
        check.className = 'hud-checkbox-box';
        check.style.cssText = 'display:inline-block;width:14px;height:14px;border:1px solid var(--border-green);border-radius:3px;margin-right:12px;position:relative;background:var(--dark-3);flex-shrink:0;transition:all 0.2s ease;';

        const dot = document.createElement('span');
        dot.style.cssText = 'position:absolute;top:2px;left:2px;width:8px;height:8px;border-radius:1px;background:var(--green-primary);box-shadow:0 0 5px var(--green-glow);transition:opacity 0.2s ease;';

        if (selectedAliens.has(alienName)) {
          check.style.borderColor = 'var(--green-primary)';
          check.style.background = 'rgba(0, 255, 65, 0.15)';
          dot.style.opacity = '1';
        } else {
          dot.style.opacity = '0';
        }
        check.appendChild(dot);
        li.appendChild(check);

        const textSpan = document.createElement('span');
        textSpan.textContent = alienName;
        li.appendChild(textSpan);

        li.addEventListener('click', (e) => {
          e.stopPropagation();
          if (selectedAliens.has(alienName)) {
            selectedAliens.delete(alienName);
            check.style.borderColor = 'var(--border-green)';
            check.style.background = 'var(--dark-3)';
            dot.style.opacity = '0';
          } else {
            selectedAliens.add(alienName);
            check.style.borderColor = 'var(--green-primary)';
            check.style.background = 'rgba(0, 255, 65, 0.15)';
            dot.style.opacity = '1';
          }
          updateSelectedAliensUI();
        });

        autocompleteList.appendChild(li);
        if (!primerVisible) primerVisible = alienName;
        if (alienName === nombreSelect.value) valorActualValido = true;
      }
    });

    if (!valorActualValido && primerVisible) nombreSelect.value = primerVisible;

    // Solo actualizar preview si no hay aliens seleccionados manualmente
    if (selectedAliens.size === 0) {
      const currentName = nombreSelect.value;
      const permitidosArr = aliensPorSerie[serieSelectedValue] || [];
      const matchObj = permitidosArr.find(a => (typeof a === 'object' && a.nombre === currentName));
      const imgUrl = matchObj ? matchObj.imagen_url : '';

      const previewFull = document.getElementById('wishlistAddPreviewFull');
      const placeholder = document.getElementById('wishlistAddAlienPlaceholder');
      const previewText = document.getElementById('wishlistAddAlienPreviewText');

      if (imgUrl && previewFull) {
        previewFull.src = imgUrl;
        previewFull.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
      } else {
        if (previewFull) { previewFull.src = ''; previewFull.style.display = 'none'; }
        if (placeholder) placeholder.style.display = 'flex';
        if (previewText) previewText.style.display = 'block';
      }
    }
  };

  if (autocompleteInput) {
    const showOptions = () => {
      autocompleteList.style.display = 'block';
      if (customSerieOptions) customSerieOptions.style.display = 'none';
      renderAutocompleteList(serieSelect.value, '');
    };
    autocompleteInput.addEventListener('focus', showOptions);
    autocompleteInput.addEventListener('click', showOptions);
    autocompleteInput.addEventListener('input', (e) => {
      if (customSerieOptions) customSerieOptions.style.display = 'none';
      renderAutocompleteList(serieSelect.value, e.target.value);
    });
  }

  document.addEventListener('click', (e) => {
    if (autocompleteInput && autocompleteList && !autocompleteInput.contains(e.target) && !autocompleteList.contains(e.target)) {
      autocompleteList.style.display = 'none';
    }
  });

  if (serieSelect) {
    serieSelect.addEventListener('change', () => {
      if (autocompleteInput) autocompleteInput.value = '';
      renderAutocompleteList(serieSelect.value, '');
      const customText = document.getElementById('wishlistCustomSerieText');
      if (customText) customText.textContent = serieSelect.value;
    });
  }

  // ── Custom select para Serie ───────────────────────────────────────────────
  const customSerieSelect = document.getElementById('wishlistCustomSerieSelect');
  const customSerieTrigger = document.getElementById('wishlistCustomSerieTrigger');
  const customSerieText = document.getElementById('wishlistCustomSerieText');

  if (customSerieTrigger && customSerieOptions) {
    customSerieTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = customSerieOptions.style.display === 'block';
      customSerieOptions.style.display = isVisible ? 'none' : 'block';
      if (!isVisible && autocompleteList) autocompleteList.style.display = 'none';
    });

    customSerieOptions.querySelectorAll('li').forEach(option => {
      option.addEventListener('click', () => {
        const val = option.getAttribute('data-value');
        if (customSerieText) customSerieText.textContent = val;
        if (serieSelect) {
          serieSelect.value = val;
          serieSelect.dispatchEvent(new Event('change'));
        }
        customSerieOptions.style.display = 'none';
      });
    });

    document.addEventListener('click', (e) => {
      if (customSerieSelect && !customSerieSelect.contains(e.target)) {
        customSerieOptions.style.display = 'none';
      }
    });
  }

  // ── Abrir / Cerrar modal ───────────────────────────────────────────────────
  const addModalTitle = document.getElementById('wishlistAddModalTitle');
  const addSubmitBtn = document.getElementById('wishlistAddSubmitBtn');
  const wishlistAddForm = document.getElementById('wishlistAddForm');

  const openAddModal = () => {
    if (addModal) {
      if (addModalTitle) addModalTitle.textContent = 'AGREGAR ALIEN A WISHLIST';
      if (addSubmitBtn) addSubmitBtn.textContent = 'AÑADIR A WISHLIST';
      if (wishlistAddForm) wishlistAddForm.action = '/wishlist/add/';
      addModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (selectedAliens) { selectedAliens.clear(); updateSelectedAliensUI(); }
      if (serieSelect) {
        if (customSerieText) customSerieText.textContent = serieSelect.value;
        renderAutocompleteList(serieSelect.value, '');
      }
    }
  };

  const closeAddModal = () => {
    if (addModal) {
      addModal.classList.remove('active');
      document.body.style.overflow = '';
      if (addForm) addForm.reset();
      if (customSerieText && serieSelect) customSerieText.textContent = serieSelect.value;
      if (selectedAliens) { selectedAliens.clear(); updateSelectedAliensUI(); }
    }
  };

  if (openAddBtn) openAddBtn.addEventListener('click', openAddModal);
  if (closeAddBtnX) closeAddBtnX.addEventListener('click', closeAddModal);
  if (cancelAddBtn) cancelAddBtn.addEventListener('click', closeAddModal);
  const addOverlay = document.getElementById('wishlistAddOverlay');
  if (addOverlay) addOverlay.addEventListener('click', closeAddModal);

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAddModal(); });
});
