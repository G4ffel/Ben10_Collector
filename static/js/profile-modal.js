document.addEventListener('DOMContentLoaded', () => {
  const pModal = document.getElementById('profileModal');
  const openPBtn = document.getElementById('openProfileBtn');
  const overlayP = document.getElementById('profileModalOverlay');

  const viewCard = document.getElementById('profileViewCard');
  const closeProfile = document.getElementById('closeProfileBtn');

  // Elementos del panel lateral de configuración
  const avatarPickerSection = document.getElementById('avatarPickerSection');
  const subPanelAvatar = document.getElementById('subPanelAvatar');
  const subPanelData = document.getElementById('subPanelData');

  // Triggers
  const triggerAvatarPickBtn = document.getElementById('triggerAvatarPickBtn');
  const switchToEdit = document.getElementById('switchToEditBtn');

  // Formularios e Inputs
  const quickAvatarOptions = document.querySelectorAll('.avatar-option-quick');
  const quickAvatarInput = document.getElementById('quickAvatarInput');
  const quickAvatarForm = document.getElementById('quickAvatarForm');
  const quickDataForm = document.getElementById('quickDataForm');

  const openProfileModal = () => {
    if (viewCard) viewCard.style.display = 'flex';
    if (avatarPickerSection) avatarPickerSection.style.display = 'none';
    if (pModal) pModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const closeProfileModal = () => {
    if (pModal) pModal.style.display = 'none';
    document.body.style.overflow = '';
  };

  // Control del fallback para los slots de la galería de aliens favoritos
  document.querySelectorAll('.perfil-gallery-slot img').forEach(img => {
    if (img.complete) {
      if (img.naturalWidth > 0) {
        img.parentElement.classList.add('has-img');
      }
    }
    img.onload = () => {
      img.parentElement.classList.add('has-img');
    };
  });

  if (openPBtn) openPBtn.addEventListener('click', openProfileModal);
  if (closeProfile) closeProfile.addEventListener('click', closeProfileModal);
  if (overlayP) overlayP.addEventListener('click', closeProfileModal);

  // Cerrar panel lateral (para botones ✕)
  document.querySelectorAll('.close-picker-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (avatarPickerSection) avatarPickerSection.style.display = 'none';
    });
  });

  // Abrir Sub-panel de Avatares (al clickear la foto)
  if (triggerAvatarPickBtn) {
    triggerAvatarPickBtn.addEventListener('click', () => {
      if (subPanelData) subPanelData.style.display = 'none';
      if (subPanelFavFigures) subPanelFavFigures.style.display = 'none';
      if (subPanelAvatar) subPanelAvatar.style.display = 'flex';
      if (avatarPickerSection) avatarPickerSection.style.display = 'flex';
    });
  }

  // Abrir Sub-panel de Datos (al clickear el engranaje)
  if (switchToEdit) {
    switchToEdit.addEventListener('click', () => {
      if (subPanelAvatar) subPanelAvatar.style.display = 'none';
      if (subPanelFavFigures) subPanelFavFigures.style.display = 'none';
      if (subPanelData) subPanelData.style.display = 'flex';
      if (avatarPickerSection) avatarPickerSection.style.display = 'flex';
    });
  }

  // Selección instantánea de avatar (AJAX sin refresco de pantalla)
  if (quickAvatarOptions && quickAvatarInput && quickAvatarForm) {
    quickAvatarOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const selectedVal = opt.getAttribute('data-quick-val');

        quickAvatarOptions.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');

        quickAvatarInput.value = selectedVal;

        // Sincronizar en el formulario de datos para persistencia de otros cambios
        if (quickDataForm) {
          const formAvatarHidden = quickDataForm.querySelector('input[name="avatar"]');
          if (formAvatarHidden) formAvatarHidden.value = selectedVal;
        }

        const formData = new FormData(quickAvatarForm);
        fetch(quickAvatarForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
          .then(res => {
            if (res.ok) {
              const avatarMap = {
                'icon1': '/media/icon/017fb5a61c2e3d7c884717549a991708.jpg',
                'icon2': '/media/icon/3ac3f32d4297ec19f726dc17c2d59067.jpg',
                'icon3': '/media/icon/GCUGerJWUAAaIYi.jpg',
                'icon4': '/media/icon/ben-gooppng.png',
                'icon5': '/media/icon/da92536834d09f7e083f5edccab9c04a.jpg'
              };
              const newUrl = avatarMap[selectedVal] || avatarMap['icon1'];

              document.querySelectorAll('.perfil-avatar-circle-large img').forEach(img => {
                img.src = newUrl;
              });
              document.querySelectorAll('.nav-profile-avatar-img').forEach(img => {
                img.src = newUrl;
              });
            }
          })
          .catch(err => console.error('Error al actualizar el avatar:', err));
      });
    });
  }

  // Formulario de Datos por AJAX (sin refresco de pantalla)
  if (quickDataForm) {
    quickDataForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(quickDataForm);
      fetch(quickDataForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
        .then(res => {
          if (res.ok) {
            const nombre = formData.get('nombre');
            const rangoVal = formData.get('rango');
            const omnitrixVal = formData.get('omnitrix_favorito');
            const alienVal = formData.get('alien_favorito');

            // Mapeo de rangos a etiquetas
            const rangoLabels = {
              'recluta': 'Recluta Plomero',
              'cadete': 'Cadete de la Academia',
              'elite': 'Plomero de élite',
              'magister': 'Magister Plomero',
              'omni': 'Portador del Omnitrix',
              'protector': 'Protector de la Tierra',
              'heroe': 'Héroe del Cosmos'
            };

            // Mapeo de rangos a clases CSS de color
            const rangoClasses = {
              'recluta': 'rango-novato',
              'cadete': 'rango-novato',
              'elite': 'rango-elite',
              'magister': 'rango-elite',
              'omni': 'rango-omni',
              'protector': 'rango-omni',
              'heroe': 'rango-omni'
            };

            // Actualizar datos del modal de inmediato
            const domName = document.getElementById('domProfileName');
            const domRango = document.getElementById('domProfileRango');
            const domAlien = document.getElementById('domProfileAlien');
            const domReloj = document.getElementById('domProfileReloj');

            if (domName) domName.textContent = nombre;
            if (domRango) {
              domRango.textContent = rangoLabels[rangoVal] || rangoVal;
              // Actualizar clases de color del rango
              domRango.className = `rango-badge ${rangoClasses[rangoVal] || 'rango-novato'}`;
            }
            if (domAlien) domAlien.textContent = alienVal;
            if (domReloj) domReloj.textContent = omnitrixVal;

            // Actualizar el nombre en el navbar también
            document.querySelectorAll('.nav-profile-name').forEach(el => {
              el.textContent = nombre;
            });

            // Sincronizar campos en el formulario oculto de avatares
            if (quickAvatarForm) {
              const avatarHiddenNombre = quickAvatarForm.querySelector('input[name="nombre"]');
              const avatarHiddenAlien = quickAvatarForm.querySelector('input[name="alien_favorito"]');
              const avatarHiddenReloj = quickAvatarForm.querySelector('input[name="omnitrix_favorito"]');
              const avatarHiddenRango = quickAvatarForm.querySelector('input[name="rango"]');

              if (avatarHiddenNombre) avatarHiddenNombre.value = nombre;
              if (avatarHiddenAlien) avatarHiddenAlien.value = alienVal;
              if (avatarHiddenReloj) avatarHiddenReloj.value = omnitrixVal;
              if (avatarHiddenRango) avatarHiddenRango.value = rangoVal;
            }

            // Ocultar el panel de configuración
            if (avatarPickerSection) avatarPickerSection.style.display = 'none';
          }
        })
        .catch(err => console.error('Error al actualizar datos:', err));
    });
  }

  // --- LÓGICA DE SELECCIÓN DE FIGURAS FAVORITAS EN LOS slots ---
  const subPanelFavFigures = document.getElementById('subPanelFavFigures');
  const favFiguresLoading = document.getElementById('favFiguresLoading');
  const favFiguresEmpty = document.getElementById('favFiguresEmpty');
  const favFiguresSelectorGrid = document.getElementById('favFiguresSelectorGrid');
  const quickFavFiguresForm = document.getElementById('quickFavFiguresForm');
  const quickFavFiguresInput = document.getElementById('quickFavFiguresInput');

  let activeSlotIndex = null;

  document.querySelectorAll('.perfil-gallery-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      activeSlotIndex = parseInt(slot.getAttribute('data-slot-index'));

      // Ocultar otros paneles y mostrar el de figuras favoritas
      if (subPanelAvatar) subPanelAvatar.style.display = 'none';
      if (subPanelData) subPanelData.style.display = 'none';
      if (subPanelFavFigures) subPanelFavFigures.style.display = 'flex';
      if (avatarPickerSection) avatarPickerSection.style.display = 'flex';

      // Mostrar cargando
      if (favFiguresLoading) favFiguresLoading.style.display = 'block';
      if (favFiguresSelectorGrid) favFiguresSelectorGrid.style.display = 'none';
      if (favFiguresEmpty) favFiguresEmpty.style.display = 'none';

      // Cargar figuras dinámicamente desde el endpoint API
      fetch('/api/figuras/')
        .then(res => res.json())
        .then(data => {
          if (favFiguresLoading) favFiguresLoading.style.display = 'none';

          if (!data.figuras || data.figuras.length === 0) {
            if (favFiguresEmpty) favFiguresEmpty.style.display = 'block';
            if (favFiguresSelectorGrid) {
              favFiguresSelectorGrid.style.display = 'grid';
              favFiguresSelectorGrid.innerHTML = '';
              // Recrear botón vaciar
              const removeBtn = createRemoveButton();
              favFiguresSelectorGrid.appendChild(removeBtn);
            }
            return;
          }

          if (favFiguresSelectorGrid) {
            favFiguresSelectorGrid.style.display = 'grid';
            favFiguresSelectorGrid.innerHTML = '';

            // Botón vaciar al inicio
            const removeBtn = createRemoveButton();
            favFiguresSelectorGrid.appendChild(removeBtn);

            data.figuras.forEach(fig => {
              const opt = document.createElement('div');
              opt.className = 'avatar-option-quick';
              opt.setAttribute('data-fig-id', fig.id);
              opt.setAttribute('title', `${fig.nombre} (${fig.serie})`);

              // Estilos en línea para evitar caché de CSS
              opt.style.borderRadius = '50%';
              opt.style.overflow = 'hidden';
              opt.style.position = 'relative';
              opt.style.boxSizing = 'border-box';

              const img = document.createElement('img');
              img.src = fig.imagen_url;
              img.alt = fig.nombre;
              img.style.position = 'absolute';
              img.style.top = '0';
              img.style.left = '0';
              img.style.width = '100%';
              img.style.height = '100%';
              img.style.objectFit = 'cover';

              opt.appendChild(img);
              favFiguresSelectorGrid.appendChild(opt);

              opt.addEventListener('click', () => {
                selectFavFigureForSlot(fig.id, fig.imagen_url, fig.nombre);
              });
            });
          }
        })
        .catch(err => {
          console.error('Error al cargar figuras:', err);
          if (favFiguresLoading) favFiguresLoading.style.display = 'none';
        });
    });
  });

  function createRemoveButton() {
    const btn = document.createElement('div');
    btn.className = 'avatar-option-quick remove-fav-fig-btn';
    btn.setAttribute('data-fig-id', 'None');
    btn.setAttribute('title', 'Vaciar espacio');

    // Estilos en línea para evitar caché de CSS
    btn.style.borderRadius = '50%';
    btn.style.overflow = 'hidden';
    btn.style.position = 'relative';
    btn.style.boxSizing = 'border-box';
    btn.style.border = '1px dashed rgba(255, 0, 0, 0.3)';
    btn.style.background = 'rgba(255, 0, 0, 0.04)';
    btn.style.display = 'flex';
    btn.style.flexDirection = 'column';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.textAlign = 'center';
    btn.style.cursor = 'pointer';

    const span = document.createElement('span');
    span.style.fontFamily = 'var(--font-display)';
    span.style.fontSize = '0.7rem';
    span.style.color = 'rgba(255, 0, 0, 0.7)';
    span.style.fontWeight = 'bold';
    span.textContent = '✕ VACIAR';

    btn.appendChild(span);
    btn.addEventListener('click', () => {
      selectFavFigureForSlot('None', '', 'Slot Vacío');
    });
    return btn;
  }

  function selectFavFigureForSlot(figId, imageUrl, figName) {
    let currentVal = (quickFavFiguresInput && quickFavFiguresInput.value) || '';
    let parts = currentVal.split(',');
    while (parts.length < 5) {
      parts.push('None');
    }
    
    parts[activeSlotIndex] = figId.toString();
    const newVal = parts.join(',');
    
    if (quickFavFiguresInput) quickFavFiguresInput.value = newVal;
    
    // Sincronizar en otros formularios ocultos
    if (quickAvatarForm) {
      let formFavHidden = quickAvatarForm.querySelector('input[name="fav_figuras"]');
      if (!formFavHidden) {
        formFavHidden = document.createElement('input');
        formFavHidden.type = 'hidden';
        formFavHidden.name = 'fav_figuras';
        quickAvatarForm.appendChild(formFavHidden);
      }
      formFavHidden.value = newVal;
    }
    if (quickDataForm) {
      let formFavHidden = quickDataForm.querySelector('input[name="fav_figuras"]');
      if (!formFavHidden) {
        formFavHidden = document.createElement('input');
        formFavHidden.type = 'hidden';
        formFavHidden.name = 'fav_figuras';
        quickDataForm.appendChild(formFavHidden);
      }
      formFavHidden.value = newVal;
    }

    if (quickFavFiguresForm) {
      const formData = new FormData(quickFavFiguresForm);
      fetch(quickFavFiguresForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
        .then(res => {
          if (res.ok) {
            // Actualizar el DOM del slot clickeado
            const slots = document.querySelectorAll(`.perfil-gallery-slot[data-slot-index="${activeSlotIndex}"]`);
            slots.forEach(slot => {
              const img = slot.querySelector('img');
              if (figId === 'None') {
                if (img) {
                  img.src = '';
                  img.style.display = 'none';
                }
                slot.classList.remove('has-img');
                slot.setAttribute('title', 'Slot Vacío');
              } else {
                if (img) {
                  img.src = imageUrl;
                  img.style.display = 'block';
                }
                slot.classList.add('has-img');
                slot.setAttribute('title', figName);
              }
            });
            
            if (avatarPickerSection) avatarPickerSection.style.display = 'none';
          }
        })
        .catch(err => console.error('Error al actualizar figura favorita:', err));
    }
  }
});

// Función global para abrir el panel de configuración de perfil
window.openPerfilEditPanel = function () {
  const ap = document.getElementById('avatarPickerSection');
  const spA = document.getElementById('subPanelAvatar');
  const spD = document.getElementById('subPanelData');
  const spF = document.getElementById('subPanelFavFigures');
  const pm = document.getElementById('profileModal');

  if (pm && pm.style.display !== 'flex') {
    pm.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  if (ap) ap.style.display = 'flex';
  if (spA) spA.style.display = 'none';
  if (spF) spF.style.display = 'none';
  if (spD) spD.style.display = 'flex';
};
