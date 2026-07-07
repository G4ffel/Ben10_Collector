// ===== ACCIONES ESPECÍFICAS DE BODEGA =====
document.addEventListener('DOMContentLoaded', () => {
  const openAddBtn = document.getElementById('openAddModalBtn');
  const form = document.getElementById('omniFigureForm');
  const formTitle = document.getElementById('modalFormTitle');
  
  if (openAddBtn) {
    openAddBtn.addEventListener('click', () => {
      if (formTitle) formTitle.textContent = "REGISTRAR EN BODEGA";
      if (form) form.action = "/bodega/";
    });
  }

  // ===== SELL MODAL CONTROLLER =====
  const sellModal = document.getElementById('sellModal');
  const sellModalOverlay = document.getElementById('sellModalOverlay');
  const sellModalText = document.getElementById('sellModalText');
  const sellPriceInput = document.getElementById('sellPriceInput');
  const sellModalAccept = document.getElementById('sellModalAccept');
  const sellModalCancel = document.getElementById('sellModalCancel');

  let activeSellUrl = '';

  document.querySelectorAll('.sell-figure-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const figureId = btn.getAttribute('data-id');
      const figureNombre = btn.getAttribute('data-nombre');
      const figurePrecio = btn.getAttribute('data-precio');

      activeSellUrl = `/mover-a-vendido/${figureId}/`;
      sellModalText.textContent = `¿Cuál fue el precio de venta final para ${figureNombre}?`;
      sellPriceInput.value = figurePrecio; // Pre-fill with original valuation price

      sellModal.style.display = 'flex';
      sellPriceInput.focus();
    });
  });

  const closeSellModal = () => {
    sellModal.style.display = 'none';
    activeSellUrl = '';
  };

  if (sellModalCancel) sellModalCancel.addEventListener('click', closeSellModal);
  if (sellModalOverlay) sellModalOverlay.addEventListener('click', closeSellModal);

  if (sellModalAccept) {
    sellModalAccept.addEventListener('click', () => {
      const salePrice = sellPriceInput.value || 0;
      window.location.href = `${activeSellUrl}?precio_venta=${salePrice}`;
    });
  }
});
