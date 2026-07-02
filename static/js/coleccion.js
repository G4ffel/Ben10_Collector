document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('omniFormModal');
  const openAddBtn = document.getElementById('openAddModalBtn');
  const closeBtnX = document.getElementById('modalFormCloseX');
  const cancelBtn = document.getElementById('modalFormCancel');
  const form = document.getElementById('omniFigureForm');
  const formTitle = document.getElementById('modalFormTitle');
  const imageHint = document.getElementById('imageHint');
  const imageInput = document.querySelector('input[type="file"]');

  // Campos del formulario
  const nombreInput = document.querySelector('[name="nombre"]');
  const precioInput = document.querySelector('[name="precio"]');
  const fechaInput = document.querySelector('[name="fecha_adquisicion"]');
  const serieSelect = document.querySelector('select[name="serie"]');
  const fileChosenName = document.getElementById('fileChosenName');
  const autocompleteInput = document.getElementById('alienAutocompleteInput');
  const autocompleteList = document.getElementById('alienAutocompleteList');

  // Relación de aliens por serie
  const aliensPorSerie = {
    'Ben 10': ['Bestia', 'Cuatrobrazos', 'Materia Gris', 'XLR8', 'Ultra-T', 'Diamante', 'Insectoide', 'Acuático', 'Fantasmático', 'Cannonbolt', 'Fuego'],
    'Ben 10 Alien Force': ['Goop', 'Fuego Pantanoso', 'Piedra', 'Frío', 'Humungosaurio', 'Cerebrón', 'Jetray', 'Mono Araña', 'Eco Eco', 'Alien X'],
    'Ben 10 Omniverse': [] // En Omniverse se permiten todos
  };

  const renderAutocompleteList = (serieSelectedValue, searchQuery = '') => {
    if (!nombreInput || !autocompleteList) return;
    const permitidos = aliensPorSerie[serieSelectedValue] || [];
    const query = searchQuery.toLowerCase().trim();

    autocompleteList.innerHTML = ''; // Limpiar lista
    let primerVisible = null;
    let valorActualValido = false;

    // Leemos las opciones del select nativo de Django para generar los li
    Array.from(nombreInput.options).forEach(option => {
      const alienName = option.value;
      const perteneceSerie = (serieSelectedValue === 'Ben 10 Omniverse') || permitidos.includes(alienName);
      const coincideBusqueda = alienName.toLowerCase().includes(query);

      if (perteneceSerie && coincideBusqueda) {
        const li = document.createElement('li');
        li.textContent = alienName;
        li.addEventListener('click', () => {
          if (autocompleteInput) autocompleteInput.value = alienName;
          nombreInput.value = alienName; // Sincroniza al select oculto de Django
          autocompleteList.style.display = 'none';
        });
        autocompleteList.appendChild(li);

        if (!primerVisible) primerVisible = alienName;
        if (alienName === nombreInput.value) valorActualValido = true;
      }
    });

    // Si el valor seleccionado en el select nativo no es válido en esta serie/filtro, lo actualizamos al primero válido
    if (!valorActualValido && primerVisible) {
      nombreInput.value = primerVisible;
      if (document.activeElement !== autocompleteInput && autocompleteInput) {
        autocompleteInput.value = primerVisible;
      }
    }
  };

  // Control del dropdown autocomplete
  if (autocompleteInput) {
    autocompleteInput.addEventListener('focus', () => {
      autocompleteList.style.display = 'block';
      renderAutocompleteList(serieSelect.value, autocompleteInput.value);
    });

    autocompleteInput.addEventListener('input', (e) => {
      renderAutocompleteList(serieSelect.value, e.target.value);
    });
  }

  // Cerrar dropdown al hacer click fuera
  document.addEventListener('click', (e) => {
    if (autocompleteInput && autocompleteList && !autocompleteInput.contains(e.target) && !autocompleteList.contains(e.target)) {
      autocompleteList.style.display = 'none';
    }
  });

  // Escuchar cambios en la serie
  if (serieSelect) {
    serieSelect.addEventListener('change', () => {
      if (autocompleteInput) autocompleteInput.value = ''; // Limpiar buscador al cambiar serie
      renderAutocompleteList(serieSelect.value, '');
    });
  }

  // Escuchar cambios en la selección de archivo
  if (imageInput && fileChosenName) {
    imageInput.addEventListener('change', () => {
      if (imageInput.files && imageInput.files.length > 0) {
        fileChosenName.textContent = `${imageInput.files[0].name}`;
      } else {
        fileChosenName.textContent = "Sin archivos seleccionados";
      }
    });
  }

  const openModal = () => {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Si la serie está seleccionada, actualizamos el buscador de inmediato
      if (serieSelect) {
        renderAutocompleteList(serieSelect.value, '');
        // Sincronizar el input de autocomplete con el select nativo
        if (autocompleteInput) autocompleteInput.value = nombreInput.value;
      }
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (form) form.reset();
      if (imageHint) imageHint.style.display = 'none';
      if (imageInput) imageInput.required = true;
      if (fileChosenName) fileChosenName.textContent = "Sin archivos seleccionados";
    }
  };

  if (openAddBtn) {
    openAddBtn.addEventListener('click', () => {
      if (formTitle) formTitle.textContent = "AÑADIR NUEVA FIGURA";
      if (form) form.action = "/coleccion/"; // URL de creación
      closeModal();
      openModal();
    });
  }

  if (closeBtnX) closeBtnX.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // Cerrar haciendo click en el overlay
  const overlay = document.getElementById('modalFormOverlay');
  if (overlay) overlay.addEventListener('click', closeModal);

  // Abrir modal para editar
  document.querySelectorAll('.edit-figure-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const nombre = btn.getAttribute('data-nombre');
      const precio = btn.getAttribute('data-precio');
      const fecha = btn.getAttribute('data-fecha');
      const serie = btn.getAttribute('data-serie');

      if (formTitle) formTitle.textContent = "EDITAR FIGURA";
      if (form) form.action = `/coleccion/editar/${id}/`;

      if (nombreInput) nombreInput.value = nombre;
      if (autocompleteInput) autocompleteInput.value = nombre;
      if (precioInput) precioInput.value = precio;
      if (fechaInput) fechaInput.value = fecha;
      if (serieSelect) {
        serieSelect.value = serie;
        renderAutocompleteList(serieSelect.value, '');
      }

      // Al editar, la imagen es opcional (se mantiene la existente)
      if (imageInput) imageInput.required = false;
      if (imageHint) imageHint.style.display = 'block';
      if (fileChosenName) fileChosenName.textContent = "Mantener imagen actual";

      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // ESC para cerrar
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Abrir modal de edición automáticamente si se pasa el parámetro ?editar=ID por GET (desde el Dashboard)
  const urlParams = new URLSearchParams(window.location.search);
  const editarId = urlParams.get('editar');
  if (editarId) {
    const targetBtn = document.querySelector(`.edit-figure-btn[data-id="${editarId}"]`);
    if (targetBtn) {
      setTimeout(() => {
        targetBtn.click();
      }, 150);
    }
  }
});
