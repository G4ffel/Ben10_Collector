/**
 * modal-detail.js
 * Modal de Detalle de Figura (#alienDetailModal)
 * Muestra info de la figura y permite eliminarla.
 * Extraído de coleccion.js para tenerlo como archivo independiente.
 */
document.addEventListener('DOMContentLoaded', () => {
  const detailModal = document.getElementById('alienDetailModal');
  const detailCloseX = document.getElementById('modalDetailCloseX');
  const detailCloseBtn = document.getElementById('modalDetailCloseBtn');
  const detailOverlay = document.getElementById('modalDetailOverlay');
  const detailDeleteBtn = document.getElementById('modalDetailDeleteBtn');

  // ── Cerrar modal ──────────────────────────────────────────────────────────
  const closeDetailModal = () => {
    if (detailModal) {
      detailModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (detailCloseX) detailCloseX.addEventListener('click', closeDetailModal);
  if (detailCloseBtn) detailCloseBtn.addEventListener('click', closeDetailModal);
  if (detailOverlay) detailOverlay.addEventListener('click', closeDetailModal);

  // ── Eliminar figura ───────────────────────────────────────────────────────
  if (detailDeleteBtn) {
    detailDeleteBtn.addEventListener('click', () => {
      const id = detailDeleteBtn.getAttribute('data-id');
      if (id) {
        if (confirm('¿Estás seguro de que deseas eliminar esta figura de tu colección? Esta acción no se puede deshacer.')) {
          window.location.href = `/coleccion/eliminar/${id}/`;
        }
      }
    });
  }

  // ── Colores por serie ─────────────────────────────────────────────────────
  const applySerieTheme = (serie) => {
    const detailHeader = document.getElementById('detailModalHeader');
    const detailTitle = document.getElementById('detailModalTitle');
    const detailRadar = document.getElementById('detailModalRadar');
    const detailCloseBtnX = document.getElementById('modalDetailCloseX');
    const detailContent = document.getElementById('detailModalContent');
    const detailPrecio = document.getElementById('detailAlienPrecio');
    const detailImgWrap = document.getElementById('detailAlienImgWrap');
    const hudBoxes = document.querySelectorAll('#alienDetailModal .hud-info-box');

    // Reset
    detailContent.style.borderColor = '';
    detailContent.style.boxShadow = '';
    detailTitle.style.color = '';
    detailCloseBtnX.style.color = '';
    detailHeader.style.borderBottomColor = '';
    detailRadar.style.backgroundColor = '';
    detailRadar.style.boxShadow = '';
    detailPrecio.style.color = '';
    detailPrecio.style.textShadow = '';
    detailImgWrap.style.borderColor = '';
    detailImgWrap.style.boxShadow = '';
    hudBoxes.forEach(box => { box.style.borderColor = ''; box.style.background = ''; });

    const themes = {
      'Ben 10': {
        border: 'var(--green-primary)', shadow: 'rgba(0, 255, 65, 0.25)',
        title: 'var(--green-primary)', radar: 'var(--green-primary)', radarShadow: 'var(--green-primary)',
        precio: 'var(--green-primary)', precioShadow: 'var(--green-glow)',
        imgBorder: 'var(--border-green)', imgShadow: 'rgba(0, 255, 65, 0.15)',
        hudBorder: 'rgba(0, 255, 65, 0.15)', hudBg: 'rgba(0, 255, 65, 0.02)'
      },
      'Ben 10 Alien Force': {
        border: '#0066ff', shadow: 'rgba(0, 102, 255, 0.25)',
        title: '#00ccff', radar: '#0066ff', radarShadow: '#0066ff',
        precio: '#00ccff', precioShadow: 'rgba(0, 102, 255, 0.5)',
        imgBorder: 'rgba(0, 102, 255, 0.4)', imgShadow: 'rgba(0, 102, 255, 0.15)',
        hudBorder: 'rgba(0, 102, 255, 0.15)', hudBg: 'rgba(0, 102, 255, 0.02)'
      },
      'Ben 10 Omniverse': {
        border: '#b400ff', shadow: 'rgba(180, 0, 255, 0.25)',
        title: '#d880ff', radar: '#b400ff', radarShadow: '#b400ff',
        precio: '#d880ff', precioShadow: 'rgba(180, 0, 255, 0.5)',
        imgBorder: 'rgba(180, 0, 255, 0.4)', imgShadow: 'rgba(180, 0, 255, 0.15)',
        hudBorder: 'rgba(180, 0, 255, 0.15)', hudBg: 'rgba(180, 0, 255, 0.02)'
      },
      'Villanos': {
        border: '#ff3333', shadow: 'rgba(255, 51, 51, 0.25)',
        title: '#ff3333', radar: '#ff3333', radarShadow: '#ff3333',
        precio: '#ff3333', precioShadow: 'rgba(255, 51, 51, 0.5)',
        imgBorder: 'rgba(255, 51, 51, 0.4)', imgShadow: 'rgba(255, 51, 51, 0.15)',
        hudBorder: 'rgba(255, 51, 51, 0.15)', hudBg: 'rgba(255, 51, 51, 0.02)'
      }
    };

    const t = themes[serie] || {
      border: '#ffcc00', shadow: 'rgba(255, 204, 0, 0.25)',
      title: '#ffcc00', radar: '#ffcc00', radarShadow: '#ffcc00',
      precio: '#ffcc00', precioShadow: 'rgba(255, 204, 0, 0.5)',
      imgBorder: 'rgba(255, 204, 0, 0.4)', imgShadow: 'rgba(255, 204, 0, 0.15)',
      hudBorder: 'rgba(255, 204, 0, 0.15)', hudBg: 'rgba(255, 204, 0, 0.02)'
    };

    detailContent.style.borderColor = t.border;
    detailContent.style.boxShadow = `0 0 40px ${t.shadow}`;
    detailTitle.style.color = t.title;
    detailCloseBtnX.style.color = t.title;
    detailHeader.style.borderBottomColor = t.shadow;
    detailRadar.style.backgroundColor = t.radar;
    detailRadar.style.boxShadow = `0 0 10px ${t.radarShadow}`;
    detailPrecio.style.color = t.precio;
    detailPrecio.style.textShadow = `0 0 10px ${t.precioShadow}`;
    detailImgWrap.style.borderColor = t.imgBorder;
    detailImgWrap.style.boxShadow = `0 0 25px ${t.imgShadow}`;
    hudBoxes.forEach(box => {
      box.style.borderColor = t.hudBorder;
      box.style.background = t.hudBg;
    });
  };

  // ── Abrir modal al click en tarjeta ───────────────────────────────────────
  document.querySelectorAll('.figure-card-omni').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.edit-figure-btn')) return;

      const id = card.getAttribute('data-id');
      const nombre = card.getAttribute('data-nombre');
      const precio = card.getAttribute('data-precio');
      const fecha = card.getAttribute('data-fecha');
      const serie = card.getAttribute('data-serie');
      const estado = card.getAttribute('data-estado');
      const marca = card.getAttribute('data-marca');
      const tamano = card.getAttribute('data-tamano');
      const imagen = card.getAttribute('data-imagen');

      if (detailDeleteBtn) {
        if (id) {
          detailDeleteBtn.setAttribute('data-id', id);
          detailDeleteBtn.style.display = 'block';
        } else {
          detailDeleteBtn.style.display = 'none';
        }
      }

      document.getElementById('detailAlienImg').src = imagen;
      document.getElementById('detailAlienImg').alt = nombre;
      document.getElementById('detailModalTitle').textContent = `DETALLE DE ${nombre}`;
      document.getElementById('detailAlienSerie').textContent = serie;
      document.getElementById('detailAlienPrecio').textContent = precio;
      document.getElementById('detailAlienFecha').textContent = fecha;
      document.getElementById('detailAlienEstado').textContent = estado;
      document.getElementById('detailAlienMarca').textContent = marca;
      document.getElementById('detailAlienTamano').textContent = tamano;

      applySerieTheme(serie);

      if (detailModal) {
        detailModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // ── ESC para cerrar ───────────────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDetailModal();
  });
});
