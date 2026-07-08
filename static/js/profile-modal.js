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
    if (avatarPickerSection) avatarPickerSection.classList.remove('open');
    if (pModal) {
      pModal.classList.remove('ready');
      pModal.style.display = 'flex';
      setTimeout(() => {
        pModal.classList.add('ready');
      }, 50);
    }
    document.body.style.overflow = 'hidden';
  };

  const closeProfileModal = () => {
    if (pModal) {
      pModal.style.display = 'none';
      pModal.classList.remove('ready');
    }
    if (avatarPickerSection) avatarPickerSection.classList.remove('open');
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
      if (avatarPickerSection) avatarPickerSection.classList.remove('open');
    });
  });

  const switchToBanner = document.getElementById('switchToBannerBtn');
  const subPanelBanner = document.getElementById('subPanelBanner');

  // Abrir Sub-panel de Avatares (al clickear la foto)
  if (triggerAvatarPickBtn) {
    triggerAvatarPickBtn.addEventListener('click', () => {
      if (subPanelData) subPanelData.style.display = 'none';
      if (subPanelFavFigures) subPanelFavFigures.style.display = 'none';
      if (subPanelBanner) subPanelBanner.style.display = 'none';
      if (subPanelAvatar) subPanelAvatar.style.display = 'flex';
      if (avatarPickerSection) avatarPickerSection.classList.add('open');
    });
  }

  // Abrir Sub-panel de Datos (al clickear el engranaje)
  if (switchToEdit) {
    switchToEdit.addEventListener('click', () => {
      if (subPanelAvatar) subPanelAvatar.style.display = 'none';
      if (subPanelFavFigures) subPanelFavFigures.style.display = 'none';
      if (subPanelBanner) subPanelBanner.style.display = 'none';
      if (subPanelData) subPanelData.style.display = 'flex';
      if (avatarPickerSection) avatarPickerSection.classList.add('open');
    });
  }

  // Abrir Sub-panel de Banner (al clickear el lápiz)
  if (switchToBanner) {
    switchToBanner.addEventListener('click', () => {
      if (subPanelAvatar) subPanelAvatar.style.display = 'none';
      if (subPanelFavFigures) subPanelFavFigures.style.display = 'none';
      if (subPanelData) subPanelData.style.display = 'none';
      if (subPanelBanner) subPanelBanner.style.display = 'flex';
      if (avatarPickerSection) avatarPickerSection.classList.add('open');
    });
  }

  // Selección instantánea de banner (AJAX sin refresco de pantalla)
  const quickBannerOptions = document.querySelectorAll('.banner-option-quick');
  const quickBannerInput = document.getElementById('quickBannerInput');
  const quickBannerForm = document.getElementById('quickBannerForm');

  if (quickBannerOptions && quickBannerInput && quickBannerForm) {
    quickBannerOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const selectedVal = opt.getAttribute('data-quick-val');

        quickBannerOptions.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');

        quickBannerInput.value = selectedVal;

        // Sincronizar en otros formularios del perfil
        document.querySelectorAll('input[name="banner"]').forEach(inp => {
          inp.value = selectedVal;
        });

        const formData = new FormData(quickBannerForm);
        fetch(quickBannerForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
          .then(res => {
            if (res.ok) {
              const newUrl = `/media/banner/${selectedVal}`;
              document.querySelectorAll('.profile-banner-bg img').forEach(img => {
                img.src = newUrl;
              });
            }
          })
          .catch(err => console.error('Error al actualizar banner:', err));
      });
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
                'ben_clasico': '/media/icon/Ben-Clasico.jpg',
                'ben_af': '/media/icon/Ben-AF.jpg',
                'ben_ov': '/media/icon/Ben-OV.jpg',
                'ralph': '/media/icon/ralph.png',
                'alien_x': '/media/icon/Alien-X.jpg',
                'fantasmatico': '/media/icon/Fantasmatico.jpg',
                'fuego': '/media/icon/Fuego.webp',
                'goop': '/media/icon/Goop.png',
                'ultra_t': '/media/icon/Ultra-T.jpg',
                'ben_10k': '/media/icon/ben-10mil.jpg',
                'ben_10k_2': '/media/icon/ben-10mil-2.jpg',
                'ben_10k_3': '/media/icon/ben-10mil-3.jpg'
              };
              const newUrl = avatarMap[selectedVal] || avatarMap['ben_clasico'];

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
            if (avatarPickerSection) avatarPickerSection.classList.remove('open');
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
      if (avatarPickerSection) avatarPickerSection.classList.add('open');

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
              favFiguresSelectorGrid.style.display = 'flex';
              favFiguresSelectorGrid.innerHTML = '';
              // Recrear botón vaciar
              const removeBtn = createRemoveButton();
              favFiguresSelectorGrid.appendChild(removeBtn);
            }
            return;
          }

          if (favFiguresSelectorGrid) {
            favFiguresSelectorGrid.style.display = 'flex';
            favFiguresSelectorGrid.innerHTML = '';

            // Agrupar figuras por serie
            const groups = {
              'Ben 10': [],
              'Ben 10 Alien Force': [],
              'Ben 10 Omniverse': []
            };

            data.figuras.forEach(fig => {
              if (groups[fig.serie]) {
                groups[fig.serie].push(fig);
              } else {
                groups[fig.serie] = [fig];
              }
            });

            for (const [serieName, figures] of Object.entries(groups)) {
              if (figures.length === 0) continue;

              // Cabecera de la serie
              let displayName = serieName.toUpperCase();
              if (displayName === 'BEN 10') {
                displayName = 'BEN 10 CLÁSICO';
              }

              const header = document.createElement('h4');
              header.textContent = displayName;
              header.style.fontFamily = 'var(--font-display)';
              header.style.fontSize = '0.7rem';
              header.style.color = 'var(--green-primary)';
              header.style.letterSpacing = '1.5px';
              header.style.margin = '16px 0 8px 0';
              header.style.borderBottom = '1px solid rgba(0, 255, 65, 0.15)';
              header.style.paddingBottom = '4px';
              header.style.textShadow = '0 0 5px var(--green-glow)';
              header.style.width = '100%';

              favFiguresSelectorGrid.appendChild(header);

              // Grid de figuras para esta serie
              const grid = document.createElement('div');
              grid.style.display = 'grid';
              grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
              grid.style.justifyItems = 'center';
              grid.style.gap = '14px';
              grid.style.width = '100%';

              figures.forEach(fig => {
                const opt = document.createElement('div');
                opt.className = 'avatar-option-quick';
                opt.setAttribute('data-fig-id', fig.id);
                opt.setAttribute('title', `${fig.nombre} (${fig.serie})`);

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
                grid.appendChild(opt);

                opt.addEventListener('click', () => {
                  selectFavFigureForSlot(fig.id, fig.imagen_url, fig.nombre);
                });
              });

              favFiguresSelectorGrid.appendChild(grid);
            }

            // Botón vaciar al final
            const removeBtn = createRemoveButton();
            removeBtn.style.marginTop = '18px';
            removeBtn.style.marginBottom = '6px';
            favFiguresSelectorGrid.appendChild(removeBtn);
          }
        })
        .catch(err => {
          console.error('Error al cargar figuras:', err);
          if (favFiguresLoading) favFiguresLoading.style.display = 'none';
        });
    });
  });

  function createRemoveButton() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'remove-fav-fig-btn';
    btn.setAttribute('data-fig-id', 'None');
    btn.setAttribute('title', 'Vaciar espacio');

    // Estilos de botón HUD completo
    btn.style.width = '100%';
    btn.style.background = 'rgba(255, 77, 77, 0.05)';
    btn.style.border = '1px dashed rgba(255, 77, 77, 0.3)';
    btn.style.borderRadius = '8px';
    btn.style.padding = '10px';
    btn.style.marginBottom = '12px';
    btn.style.color = '#ff6666';
    btn.style.fontFamily = 'var(--font-display)';
    btn.style.fontSize = '0.7rem';
    btn.style.letterSpacing = '1px';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.gap = '8px';
    btn.style.cursor = 'pointer';
    btn.style.transition = 'all 0.2s ease';
    btn.style.outline = 'none';
    btn.style.boxSizing = 'border-box';

    // Hover events
    btn.addEventListener('mouseenter', () => {
      btn.style.background = 'rgba(255, 77, 77, 0.12)';
      btn.style.borderColor = 'rgba(255, 77, 77, 0.6)';
      btn.style.color = '#ff8888';
      btn.style.boxShadow = '0 0 10px rgba(255, 77, 77, 0.2)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'rgba(255, 77, 77, 0.05)';
      btn.style.borderColor = 'rgba(255, 77, 77, 0.3)';
      btn.style.color = '#ff6666';
      btn.style.boxShadow = 'none';
    });

    btn.textContent = '✕ VACIAR RANURA SELECCIONADA';

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
            
            if (avatarPickerSection) avatarPickerSection.classList.remove('open');
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
  const spB = document.getElementById('subPanelBanner');
  const pm = document.getElementById('profileModal');

  if (pm && pm.style.display !== 'flex') {
    pm.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  if (ap) ap.classList.add('open');
  if (spA) spA.style.display = 'none';
  if (spF) spF.style.display = 'none';
  if (spB) spB.style.display = 'none';
  if (spD) spD.style.display = 'flex';
};

// Función global para abrir el selector de banner
window.openBannerPickerPanel = function () {
  const ap = document.getElementById('avatarPickerSection');
  const spA = document.getElementById('subPanelAvatar');
  const spD = document.getElementById('subPanelData');
  const spF = document.getElementById('subPanelFavFigures');
  const spB = document.getElementById('subPanelBanner');
  const pm = document.getElementById('profileModal');

  if (pm && pm.style.display !== 'flex') {
    pm.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  if (ap) ap.classList.add('open');
  if (spA) spA.style.display = 'none';
  if (spD) spD.style.display = 'none';
  if (spF) spF.style.display = 'none';
  if (spB) spB.style.display = 'flex';
};
