/**
 * wishlist.js
 * Lógica de página de wishlist (no-modal).
 * Los modales han sido separados en:
 *   - modal-wishlist-add.js    (wishlistAddModal: Agregar alien)
 *   - modal-wishlist-custom.js (wishlistCustomModal: Alien personalizado)
 *   - modal-wishlist-edit.js   (wishlistEditModal: Editar alien)
 *   - modal-wishlist-move.js   (moveToCollectionModal: Mover a colección)
 */
document.addEventListener('DOMContentLoaded', () => {
  // Hover fluorescent glow effect on placeholder images inside wishlist cards
  document.querySelectorAll('.wishlist-card').forEach(card => {
    const placeholder = card.querySelector('.wishlist-placeholder-img');
    card.addEventListener('mouseenter', () => {
      if (placeholder) {
        placeholder.style.filter = 'none opacity(0.85) drop-shadow(0 0 15px var(--green-primary))';
        placeholder.style.transform = 'scale(1.15) rotate(5deg)';
      }
    });
    card.addEventListener('mouseleave', () => {
      if (placeholder) {
        placeholder.style.filter = 'grayscale(1) opacity(0.2) drop-shadow(0 0 10px rgba(0, 255, 65, 0.15))';
        placeholder.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  });

  // Lógica para descargar foto de wishlist con html2canvas
  const downloadBtn = document.getElementById('downloadWishlistBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const originalOpacity = downloadBtn.style.opacity;
      downloadBtn.disabled = true;
      downloadBtn.style.opacity = '0.5';

      // 1. Obtener todos los elementos de la wishlist del DOM actual
      const items = [];
      document.querySelectorAll('.wishlist-card').forEach(card => {
        const nombre = card.getAttribute('data-nombre');
        const imgEl = card.querySelector('.figure-img-wrap img');
        const imgUrl = imgEl ? imgEl.src : '/media/omnitrix/Ben_10_Omnitrix.png';
        items.push({ nombre, imgUrl });
      });

      if (items.length === 0) {
        alert('No hay elementos en la wishlist para descargar.');
        downloadBtn.disabled = false;
        downloadBtn.style.opacity = originalOpacity;
        return;
      }

      // 2. Crear contenedor temporal fuera de pantalla para el renderizado
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = '850px';
      container.style.padding = '45px';
      container.style.boxSizing = 'border-box';
      // Fondo oscuro cyberpunk con gradiente radial y líneas de escaneo
      container.style.background = 'linear-gradient(rgba(0, 255, 65, 0.02) 50%, rgba(0, 0, 0, 0.3) 50%), radial-gradient(circle at center, #0c210c 0%, #030803 100%)';
      container.style.backgroundSize = '100% 4px, 100% 100%';
      container.style.border = '2px solid #00ff41';
      container.style.borderRadius = '20px';
      container.style.boxShadow = '0 0 50px rgba(0, 255, 65, 0.3)';
      container.style.fontFamily = "'Orbitron', sans-serif";
      container.style.color = '#ffffff';

      // Cabecera del poster
      const header = document.createElement('div');
      header.style.textAlign = 'center';
      header.style.marginBottom = '40px';
      header.style.borderBottom = '1px solid rgba(0, 255, 65, 0.2)';
      header.style.paddingBottom = '20px';
      
      const title = document.createElement('h1');
      title.textContent = 'WISHLIST GALÁCTICA';
      title.style.fontSize = '2.2rem';
      title.style.color = '#00ff41';
      title.style.letterSpacing = '4px';
      title.style.margin = '0 0 8px 0';
      title.style.textShadow = '0 0 15px rgba(0, 255, 65, 0.6)';
      
      const subtitle = document.createElement('p');
      subtitle.textContent = 'BEN 10 COLLECTOR';
      subtitle.style.fontSize = '0.85rem';
      subtitle.style.color = '#a0ffa0';
      subtitle.style.letterSpacing = '3px';
      subtitle.style.margin = '0';
      subtitle.style.opacity = '0.8';

      header.appendChild(title);
      header.appendChild(subtitle);
      container.appendChild(header);

      // Grid de aliens
      const grid = document.createElement('div');
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
      grid.style.gap = '25px';

      items.forEach(item => {
        const itemBox = document.createElement('div');
        itemBox.style.border = '1px solid rgba(0, 255, 65, 0.2)';
        itemBox.style.borderRadius = '14px';
        itemBox.style.padding = '20px';
        itemBox.style.background = 'rgba(5, 12, 5, 0.85)';
        itemBox.style.display = 'flex';
        itemBox.style.flexDirection = 'column';
        itemBox.style.alignItems = 'center';
        itemBox.style.justifyContent = 'center';
        itemBox.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.08)';
        itemBox.style.boxSizing = 'border-box';

        // Caja de imagen
        const imgWrap = document.createElement('div');
        imgWrap.style.width = '100%';
        imgWrap.style.aspectRatio = '1 / 1';
        imgWrap.style.display = 'flex';
        imgWrap.style.alignItems = 'center';
        imgWrap.style.justifyContent = 'center';
        imgWrap.style.overflow = 'hidden';
        imgWrap.style.background = 'radial-gradient(circle, rgba(0, 255, 65, 0.06), transparent 75%)';
        imgWrap.style.marginBottom = '15px';
        imgWrap.style.borderRadius = '10px';

        const img = document.createElement('img');
        img.src = item.imgUrl;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        img.style.objectFit = 'contain';

        imgWrap.appendChild(img);
        itemBox.appendChild(imgWrap);

        // Nombre del alien
        const nameLabel = document.createElement('h3');
        nameLabel.textContent = item.nombre;
        nameLabel.style.fontSize = '1.1rem';
        nameLabel.style.color = '#ffffff';
        nameLabel.style.margin = '0';
        nameLabel.style.textAlign = 'center';
        nameLabel.style.textTransform = 'uppercase';
        nameLabel.style.letterSpacing = '1.5px';
        nameLabel.style.fontFamily = "'Orbitron', sans-serif";
        nameLabel.style.fontWeight = '700';
        nameLabel.style.textShadow = '0 0 8px rgba(255, 255, 255, 0.1)';

        itemBox.appendChild(nameLabel);
        grid.appendChild(itemBox);
      });

      container.appendChild(grid);
      document.body.appendChild(container);

      // Generar canvas
      html2canvas(container, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#030803',
        scale: 2,
        logging: false
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'mi_wishlist_ben10.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Limpiar y restaurar
        document.body.removeChild(container);
        downloadBtn.disabled = false;
        downloadBtn.style.opacity = originalOpacity;
      }).catch(err => {
        console.error('Error al generar la imagen:', err);
        alert('Hubo un error al generar la imagen.');
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
        downloadBtn.disabled = false;
        downloadBtn.style.opacity = originalOpacity;
      });
    });
  }
});
