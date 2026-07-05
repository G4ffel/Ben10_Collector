document.addEventListener('DOMContentLoaded', () => {
  // === MODAL AGREGAR ALIEN A WISHLIST ===
  const addModal = document.getElementById('wishlistAddModal');
  const openAddBtn = document.getElementById('openAddWishlistBtn');
  const closeAddBtnX = document.getElementById('wishlistAddCloseX');
  const cancelAddBtn = document.getElementById('wishlistAddCancel');
  const addForm = document.querySelector('#wishlistAddModal form');

  // Autocomplete inputs
  const autocompleteInput = document.getElementById('wishlistAlienInput');
  const autocompleteList = document.getElementById('wishlistAlienList');
  const nombreSelect = document.querySelector('#wishlistAddModal select[name="nombre"]');
  const serieSelect = document.querySelector('#wishlistAddModal select[name="serie"]');

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
  }

  const renderAutocompleteList = (serieSelectedValue, searchQuery = '') => {
    if (!nombreSelect || !autocompleteList) return;
    const permitidos = aliensPorSerie[serieSelectedValue] || [];
    const query = searchQuery.toLowerCase().trim();

    autocompleteList.innerHTML = '';
    let primerVisible = null;
    let valorActualValido = false;

    // Map objects to names
    const permitidosNombres = permitidos.map(a => typeof a === 'string' ? a : a.nombre);

    Array.from(nombreSelect.options).forEach(option => {
      const alienName = option.value;
      const perteneceSerie = (permitidosNombres.length === 0) || permitidosNombres.includes(alienName);
      const coincideBusqueda = alienName.toLowerCase().includes(query);

      if (perteneceSerie && coincideBusqueda) {
        const li = document.createElement('li');
        li.textContent = alienName;

        const matchObj = permitidos.find(a => (typeof a === 'object' && a.nombre === alienName));
        const defaultImgUrl = matchObj ? matchObj.imagen_url : '/media/omnitrix/Ben_10_Omnitrix.png';

        li.addEventListener('click', () => {
          if (autocompleteInput) autocompleteInput.value = alienName;
          nombreSelect.value = alienName;
          autocompleteList.style.display = 'none';

          const previewImg = document.getElementById('wishlistAddAlienPreviewImg');
          if (previewImg) {
            previewImg.src = defaultImgUrl;
            if (defaultImgUrl !== '/media/omnitrix/Ben_10_Omnitrix.png') {
              previewImg.style.animation = 'none';
              previewImg.style.width = '100%';
              previewImg.style.height = '100%';
              previewImg.style.objectFit = 'contain';
              previewImg.style.padding = '20px';
            } else {
              previewImg.style.animation = 'omni-spin 25s linear infinite';
              previewImg.style.width = '100px';
              previewImg.style.height = '100px';
              previewImg.style.padding = '0';
            }
          }
        });
        autocompleteList.appendChild(li);

        if (!primerVisible) primerVisible = alienName;
        if (alienName === nombreSelect.value) valorActualValido = true;
      }
    });

    if (!valorActualValido && primerVisible) {
      nombreSelect.value = primerVisible;
      if (document.activeElement !== autocompleteInput && autocompleteInput) {
        autocompleteInput.value = primerVisible;
      }
    }

    const currentName = nombreSelect.value;
    const matchObj = permitidos.find(a => (typeof a === 'object' && a.nombre === currentName));
    const defaultImgUrl = matchObj ? matchObj.imagen_url : '/media/omnitrix/Ben_10_Omnitrix.png';
    const previewImg = document.getElementById('wishlistAddAlienPreviewImg');
    if (previewImg) {
      previewImg.src = defaultImgUrl;
      if (defaultImgUrl !== '/media/omnitrix/Ben_10_Omnitrix.png') {
        previewImg.style.animation = 'none';
        previewImg.style.width = '100%';
        previewImg.style.height = '100%';
        previewImg.style.objectFit = 'contain';
        previewImg.style.padding = '20px';
      } else {
        previewImg.style.animation = 'omni-spin 25s linear infinite';
        previewImg.style.width = '100px';
        previewImg.style.height = '100px';
        previewImg.style.padding = '0';
      }
    }
  };

  if (autocompleteInput) {
    const showOptions = () => {
      autocompleteList.style.display = 'block';
      renderAutocompleteList(serieSelect.value, '');
    };
    autocompleteInput.addEventListener('focus', showOptions);
    autocompleteInput.addEventListener('click', showOptions);
    autocompleteInput.addEventListener('input', (e) => {
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

  // === CUSTOM SELECT FOR SERIE DE ORIGEN ===
  const customSerieSelect = document.getElementById('wishlistCustomSerieSelect');
  const customSerieTrigger = document.getElementById('wishlistCustomSerieTrigger');
  const customSerieOptions = document.getElementById('wishlistCustomSerieOptions');
  const customSerieText = document.getElementById('wishlistCustomSerieText');

  if (customSerieTrigger && customSerieOptions) {
    customSerieTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = customSerieOptions.style.display === 'block';
      customSerieOptions.style.display = isVisible ? 'none' : 'block';
    });

    customSerieOptions.querySelectorAll('li').forEach(option => {
      option.addEventListener('click', (e) => {
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

  const addModalTitle = document.getElementById('wishlistAddModalTitle');
  const addSubmitBtn = document.getElementById('wishlistAddSubmitBtn');
  const wishlistAddForm = document.getElementById('wishlistAddForm');

  const openAddModal = () => {
    if (addModal) {
      if (addModalTitle) addModalTitle.textContent = "AGREGAR ALIEN A WISHLIST";
      if (addSubmitBtn) addSubmitBtn.textContent = "AÑADIR A WISHLIST";
      if (wishlistAddForm) wishlistAddForm.action = "/wishlist/add/";
      
      addModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      if (serieSelect) {
        if (customSerieText) customSerieText.textContent = serieSelect.value;
        renderAutocompleteList(serieSelect.value, '');
        if (autocompleteInput) autocompleteInput.value = nombreSelect.value;
      }
    }
  };

  const closeAddModal = () => {
    if (addModal) {
      addModal.classList.remove('active');
      document.body.style.overflow = '';
      if (addForm) addForm.reset();
      if (customSerieText && serieSelect) customSerieText.textContent = serieSelect.value;
    }
  };

  if (openAddBtn) openAddBtn.addEventListener('click', openAddModal);
  if (closeAddBtnX) closeAddBtnX.addEventListener('click', closeAddModal);
  if (cancelAddBtn) cancelAddBtn.addEventListener('click', closeAddModal);
  const addOverlay = document.getElementById('wishlistAddOverlay');
  if (addOverlay) addOverlay.addEventListener('click', closeAddModal);

  // === MODAL CONFIGURAR Y EDITAR EN WISHLIST ===
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
  const editDisplayAlienSerie = document.getElementById('editDisplayAlienSerie');
  const editAlienNombreVal = document.getElementById('editAlienNombreVal');
  const editAlienSerieVal = document.getElementById('editAlienSerieVal');
  const editTitle = document.getElementById('wishlistEditTitle');

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

    if (editForm) {
      editForm.action = `/wishlist/edit/${id}/`;
    }

    if (editAlienNombreVal) editAlienNombreVal.value = nombre;
    if (editAlienSerieVal) editAlienSerieVal.value = serie;
    if (editTitle) editTitle.textContent = `DETALLE DE ${nombre.toUpperCase()}`;
    if (editDisplayAlienSerie) editDisplayAlienSerie.textContent = serie;

    // Set form fields
    const precioField = document.getElementById('edit_id_precio');
    const fechaField = document.getElementById('edit_id_fecha_adquisicion');
    const estadoField = document.getElementById('edit_id_estado');
    const marcaField = document.getElementById('edit_id_marca');
    const tamanoField = document.getElementById('edit_id_tamano');
    const subcategoriaField = document.getElementById('edit_id_subcategoria');

    if (precioField) precioField.value = precio;
    if (fechaField) fechaField.value = fecha;
    if (estadoField) estadoField.value = estado;
    if (marcaField) marcaField.value = marca;
    if (tamanoField) tamanoField.value = tamano;
    if (subcategoriaField) subcategoriaField.value = subcategoria;

    // Setup image preview
    if (imagenUrl) {
      if (editAlienPreviewImg) {
        editAlienPreviewImg.src = imagenUrl;
        editAlienPreviewImg.style.display = 'block';
      }
      if (editImageUploadPlaceholder) editImageUploadPlaceholder.style.display = 'none';
      if (editFilenameOverlay) editFilenameOverlay.style.display = 'block';
      if (editFileChosenName) editFileChosenName.textContent = "Imagen actual cargada";
    } else {
      if (editAlienPreviewImg) {
        editAlienPreviewImg.src = '';
        editAlienPreviewImg.style.display = 'none';
      }
      if (editImageUploadPlaceholder) editImageUploadPlaceholder.style.display = 'flex';
      if (editFilenameOverlay) editFilenameOverlay.style.display = 'none';
      if (editFileChosenName) editFileChosenName.textContent = "Sin archivo";
    }

    if (editModal) {
      editModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

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

  if (editAlienImgWrap && editFileImage) {
    editAlienImgWrap.addEventListener('click', () => {
      editFileImage.click();
    });
  }

  if (editFileImage) {
    editFileImage.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (editFileChosenName) {
          editFileChosenName.textContent = file.name;
        }
        if (editFilenameOverlay) {
          editFilenameOverlay.style.display = 'block';
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
          if (editAlienPreviewImg) {
            editAlienPreviewImg.src = event.target.result;
            editAlienPreviewImg.style.display = 'block';
          }
          if (editImageUploadPlaceholder) {
            editImageUploadPlaceholder.style.display = 'none';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Bind click to edit buttons
  document.querySelectorAll('.edit-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openEditModal(btn);
    });
  });


  // === MODAL CONFIGURAR Y MOVER A LA COLECCION ===
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

  // Trigger file click when clicking the wrapper card
  if (moveAlienImgWrap && moveImageInput) {
    moveAlienImgWrap.addEventListener('click', () => {
      moveImageInput.click();
    });
  }

  // Handle image selection and show live preview
  if (moveImageInput) {
    moveImageInput.addEventListener('change', () => {
      if (moveImageInput.files && moveImageInput.files.length > 0) {
        const file = moveImageInput.files[0];
        
        if (moveFileChosenName) moveFileChosenName.textContent = file.name;
        if (filenameOverlay) filenameOverlay.style.display = 'block';
        
        // Read file content for live preview
        const reader = new FileReader();
        reader.onload = (e) => {
          if (moveAlienPreviewImg) {
            moveAlienPreviewImg.src = e.target.result;
            moveAlienPreviewImg.style.display = 'block';
          }
          if (imageUploadPlaceholder) {
            imageUploadPlaceholder.style.display = 'none';
          }
        };
        reader.readAsDataURL(file);
      } else {
        resetImagePreview();
      }
    });
  }

  const resetImagePreview = () => {
    if (moveAlienPreviewImg) {
      moveAlienPreviewImg.src = '';
      moveAlienPreviewImg.style.display = 'none';
    }
    if (imageUploadPlaceholder) {
      imageUploadPlaceholder.style.display = 'flex';
    }
    if (filenameOverlay) {
      filenameOverlay.style.display = 'none';
    }
    if (moveFileChosenName) {
      moveFileChosenName.textContent = "Sin archivo";
    }
  };

  const openMoveModal = (btn) => {
    if (moveModal) {
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

      if (moveToCollectionTitle) moveToCollectionTitle.textContent = "DETALLE DE " + nombre.toUpperCase();
      if (displayAlienSerie) displayAlienSerie.textContent = serie;
      if (moveAlienNombreVal) moveAlienNombreVal.value = nombre;
      if (moveAlienSerieVal) moveAlienSerieVal.value = serie;

      if (moveForm) {
        moveForm.action = `/wishlist/mover/${id}/`;
      }

      // Prefill fields
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

      // Image preview
      if (imagenUrl) {
        if (moveAlienPreviewImg) {
          moveAlienPreviewImg.src = imagenUrl;
          moveAlienPreviewImg.style.display = 'block';
        }
        if (imageUploadPlaceholder) imageUploadPlaceholder.style.display = 'none';
        if (filenameOverlay) filenameOverlay.style.display = 'block';
        if (moveFileChosenName) moveFileChosenName.textContent = "Imagen desde wishlist";
      } else {
        resetImagePreview();
      }

      moveModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeMoveModal = () => {
    if (moveModal) {
      moveModal.classList.remove('active');
      document.body.style.overflow = '';
      if (moveForm) moveForm.reset();
      resetImagePreview();
    }
  };

  document.querySelectorAll('.move-to-collection-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openMoveModal(btn);
    });
  });

  if (closeMoveBtnX) closeMoveBtnX.addEventListener('click', closeMoveModal);
  if (cancelMoveBtn) cancelMoveBtn.addEventListener('click', closeMoveModal);
  const moveOverlay = document.getElementById('moveToCollectionOverlay');
  if (moveOverlay) moveOverlay.addEventListener('click', closeMoveModal);

  // === CARGAR ERRORES DE VALIDACION AUTOMATICAMENTE ===
  const errorMarker = document.getElementById('error-moving-id-marker');
  if (errorMarker) {
    const errorId = errorMarker.getAttribute('data-id');
    const matchedBtn = document.querySelector(`.wishlist-card[data-id="${errorId}"] .move-to-collection-btn`);
    if (matchedBtn) {
      openMoveModal(matchedBtn);
    }
  }
});
