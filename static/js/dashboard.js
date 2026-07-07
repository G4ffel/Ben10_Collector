if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
  // Lógica de scroll inicial en caso de recargas F5 o reloads convencionales
  const scrollKey = 'dashboard_scroll_pos';
  const savedScroll = localStorage.getItem(scrollKey);
  if (savedScroll !== null) {
    window.scrollTo(0, parseInt(savedScroll, 10));
    localStorage.removeItem(scrollKey);
  }

  // Funciones de tabs y filtros usando queries dinámicas
  const selectFiguresTab = () => {
    const tabFiguresBtn = document.getElementById('tabFiguresBtn');
    const tabAliensBtn = document.getElementById('tabAliensBtn');
    const tabFiguresContent = document.getElementById('tabFiguresContent');
    const tabAliensContent = document.getElementById('tabAliensContent');
    if (!tabFiguresBtn || !tabAliensBtn) return;
    
    tabFiguresBtn.style.color = 'var(--green-primary)';
    tabFiguresBtn.style.borderBottomColor = 'var(--green-primary)';
    tabFiguresBtn.style.textShadow = '0 0 8px var(--green-glow)';
    tabFiguresBtn.style.fontWeight = 'bold';
    
    tabAliensBtn.style.color = 'var(--text-muted)';
    tabAliensBtn.style.borderBottomColor = 'transparent';
    tabAliensBtn.style.textShadow = 'none';
    tabAliensBtn.style.fontWeight = 'normal';

    tabFiguresContent.style.display = 'block';
    tabAliensContent.style.display = 'none';
  };

  const selectAliensTab = () => {
    const tabFiguresBtn = document.getElementById('tabFiguresBtn');
    const tabAliensBtn = document.getElementById('tabAliensBtn');
    const tabFiguresContent = document.getElementById('tabFiguresContent');
    const tabAliensContent = document.getElementById('tabAliensContent');
    if (!tabFiguresBtn || !tabAliensBtn) return;

    tabAliensBtn.style.color = 'var(--green-primary)';
    tabAliensBtn.style.borderBottomColor = 'var(--green-primary)';
    tabAliensBtn.style.textShadow = '0 0 8px var(--green-glow)';
    tabAliensBtn.style.fontWeight = 'bold';

    tabFiguresBtn.style.color = 'var(--text-muted)';
    tabFiguresBtn.style.borderBottomColor = 'transparent';
    tabFiguresBtn.style.textShadow = 'none';
    tabFiguresBtn.style.fontWeight = 'normal';

    tabFiguresContent.style.display = 'none';
    tabAliensContent.style.display = 'flex';
  };

  const applyFilter = (serie) => {
    const alienRows = document.querySelectorAll('.alien-row');
    const filterBtns = document.querySelectorAll('.sub-tab-filter');

    alienRows.forEach(row => {
      if (row.getAttribute('data-serie') === serie) {
        row.style.display = 'table-row';
      } else {
        row.style.display = 'none';
      }
    });

    filterBtns.forEach(b => {
      const bFilter = b.getAttribute('data-filter');
      if (bFilter === serie) {
        b.classList.add('active');
        if (bFilter === 'Ben 10') {
          b.style.background = 'rgba(0, 255, 65, 0.08)';
          b.style.borderColor = 'var(--green-primary)';
          b.style.textShadow = '0 0 5px var(--green-glow)';
        } else if (bFilter === 'Ben 10 Alien Force') {
          b.style.background = 'rgba(0, 162, 255, 0.08)';
          b.style.borderColor = '#00ccff';
          b.style.textShadow = '0 0 5px #00ccff';
        } else if (bFilter === 'Ben 10 Omniverse') {
          b.style.background = 'rgba(216, 128, 255, 0.08)';
          b.style.borderColor = '#d880ff';
          b.style.textShadow = '0 0 5px #d880ff';
        } else if (bFilter === 'Villanos') {
          b.style.background = 'rgba(255, 51, 51, 0.08)';
          b.style.borderColor = '#ff3333';
          b.style.textShadow = '0 0 5px #ff3333';
        } else if (bFilter === 'Personajes') {
          b.style.background = 'rgba(255, 204, 0, 0.08)';
          b.style.borderColor = '#ffcc00';
          b.style.textShadow = '0 0 5px #ffcc00';
        }
      } else {
        b.classList.remove('active');
        b.style.background = 'none';
        b.style.textShadow = 'none';
        if (bFilter === 'Ben 10') {
          b.style.borderColor = 'rgba(0, 255, 65, 0.3)';
        } else if (bFilter === 'Ben 10 Alien Force') {
          b.style.borderColor = 'rgba(0, 162, 255, 0.3)';
        } else if (bFilter === 'Ben 10 Omniverse') {
          b.style.borderColor = 'rgba(216, 128, 255, 0.3)';
        } else if (bFilter === 'Villanos') {
          b.style.borderColor = 'rgba(255, 51, 51, 0.3)';
        } else if (bFilter === 'Personajes') {
          b.style.borderColor = 'rgba(255, 204, 0, 0.3)';
        }
      }
    });
  };

  // Función para realizar la carga PJAX y reemplazar componentes de forma asíncrona
  const performPjax = async (url, options = {}) => {
    try {
      const container = document.querySelector('.collection-container');
      if (container) container.style.opacity = '0.75';

      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Error en la petición');
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Reemplazar paneles de estadísticas
      const newStats = doc.querySelector('.hud-stats-grid');
      const oldStats = document.querySelector('.hud-stats-grid');
      if (newStats && oldStats) oldStats.innerHTML = newStats.innerHTML;

      // Reemplazar completitud
      const newProgress = doc.querySelector('.progress-section-omni');
      const oldProgress = document.querySelector('.progress-section-omni');
      if (newProgress && oldProgress) oldProgress.innerHTML = newProgress.innerHTML;

      // Reemplazar consola de gestión
      const newConsole = doc.getElementById('management-console');
      const oldConsole = document.getElementById('management-console');
      if (newConsole && oldConsole) oldConsole.innerHTML = newConsole.innerHTML;

      if (container) container.style.opacity = '1';

      // Sincronizar URL del navegador
      window.history.pushState({}, '', response.url);

      // Re-aplicar estado de tabs activo
      const urlObj = new URL(response.url);
      const activeTab = urlObj.searchParams.get('tab');
      const activeSerie = urlObj.searchParams.get('serie') || 'Ben 10';

      if (activeTab === 'aliens') {
        selectAliensTab();
      } else {
        selectFiguresTab();
      }
      applyFilter(activeSerie);

    } catch (err) {
      console.error('Error PJAX:', err);
      if (options.method === 'POST' && options.form) {
        options.form.submit();
      } else {
        window.location.href = url;
      }
    }
  };

  // Interceptar clicks con delegación de eventos
  document.addEventListener('click', (e) => {
    // 1. Control de pestañas del dashboard
    if (e.target.closest('#tabFiguresBtn')) {
      e.preventDefault();
      selectFiguresTab();
    } else if (e.target.closest('#tabAliensBtn')) {
      e.preventDefault();
      selectAliensTab();
    }

    // 2. Control de filtros de series
    const subTab = e.target.closest('.sub-tab-filter');
    if (subTab) {
      e.preventDefault();
      const filterVal = subTab.getAttribute('data-filter');
      applyFilter(filterVal);
    }

    // 3. Botón de editar Alien
    const editBtn = e.target.closest('.edit-alien-db-btn');
    if (editBtn) {
      e.preventDefault();
      const id = editBtn.getAttribute('data-id');
      const nombre = editBtn.getAttribute('data-nombre');
      const serie = editBtn.getAttribute('data-serie');
      const imagenUrl = editBtn.getAttribute('data-imagen');

      const form = document.querySelector('input[name="alien_nombre"]')?.closest('form');
      if (form) {
        const idInput = document.getElementById('dashboardAlienIdInput');
        if (idInput) idInput.value = id;
        
        const nameInput = form.querySelector('input[name="alien_nombre"]');
        if (nameInput) nameInput.value = nombre;
        
        const serieSelect = form.querySelector('select[name="serie_default"]');
        if (serieSelect) serieSelect.value = serie;

        const submitBtnSpan = form.querySelector('button[type="submit"] span');
        if (submitBtnSpan) submitBtnSpan.textContent = "GUARDAR CAMBIOS";

        const label = document.getElementById('dashboardAlienImageLabel');
        if (label) {
          if (imagenUrl) {
            label.textContent = "CAMBIAR FOTO";
            label.style.borderColor = "var(--green-primary)";
            label.style.color = "var(--green-primary)";
            label.style.background = "rgba(0, 255, 65, 0.08)";
            label.style.boxShadow = "none";
          } else {
            label.textContent = "FOTO ALIEN";
            label.style.borderColor = "var(--border-green)";
            label.style.color = "var(--green-primary)";
            label.style.background = "var(--dark-3)";
            label.style.boxShadow = "none";
          }
        }
      }
      return;
    }

    // 4. Interceptar enlaces de acción (eliminar, paginación, etc.)
    const link = e.target.closest('a');
    if (link) {
      if (link.closest('#navbar')) return;

      const href = link.getAttribute('href');
      if (href) {
        if (href.startsWith('http') && !href.startsWith(window.location.origin)) return;
        if (href.startsWith('#') || href.startsWith('javascript:')) return;

        if (href.includes('eliminar') || href.includes('editar') || href.includes('dashboard') || href.startsWith('?') || href.includes('/dashboard')) {
          const onclickAttr = link.getAttribute('onclick');
          if (onclickAttr && onclickAttr.includes('confirm')) {
            const confirmMsg = onclickAttr.match(/confirm\('([^']+)'\)/);
            if (confirmMsg && !confirm(confirmMsg[1])) {
              e.preventDefault();
              return;
            }
          }
          e.preventDefault();
          performPjax(link.href);
        }
      }
    }
  });

  // Interceptar envíos de formularios en el Dashboard
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('form');
    if (form) {
      const action = form.getAttribute('action') || '';
      if (action.includes('dashboard') || action === '' || action.includes('eliminar') || action.includes('editar')) {
        e.preventDefault();
        const formData = new FormData(form);
        performPjax(form.action || window.location.href, {
          method: 'POST',
          body: formData,
          form: form
        });
      }
    }
  });

  // Inicializar estado del Dashboard desde los parámetros URL iniciales
  const urlParams = new URLSearchParams(window.location.search);
  const activeTab = urlParams.get('tab');
  const activeSerie = urlParams.get('serie') || 'Ben 10';

  if (activeTab === 'aliens') {
    selectAliensTab();
  } else {
    selectFiguresTab();
  }
  applyFilter(activeSerie);
});
