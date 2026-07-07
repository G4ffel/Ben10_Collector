// ===== CUSTOM OMNITRIX CONFIRMATION MODAL SYSTEM =====
document.addEventListener('DOMContentLoaded', () => {
  // 1. Create and inject the modal HTML into the body
  const modalHTML = `
    <div id="omniConfirmModal" class="modal-container" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; align-items: center; justify-content: center; backdrop-filter: blur(12px); background: rgba(0, 0, 0, 0.75); transition: opacity 0.3s ease;">
      <div class="modal-overlay" id="omniConfirmOverlay" style="position: absolute; width: 100%; height: 100%; cursor: pointer;"></div>
      <div class="modal-content-wrapper" style="max-width: 480px; width: 90%; background: var(--dark-2); border: 2px solid var(--green-primary); border-radius: 16px; position: relative; z-index: 10000; box-shadow: 0 0 35px rgba(0, 255, 65, 0.3); display: flex; flex-direction: column; padding: 30px; box-sizing: border-box; text-align: center; gap: 20px; transform: scale(0.9); transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
        
        <!-- HEADER -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
          <div class="omni-radar" style="width: 16px; height: 16px;"></div>
          <h2 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--green-primary); margin: 0; text-transform: uppercase; letter-spacing: 1.5px; text-shadow: 0 0 10px var(--green-glow);">ALERTA DEL SISTEMA</h2>
        </div>

        <!-- MESSAGE -->
        <p id="omniConfirmMessage" style="font-family: var(--font-body); font-size: 0.95rem; color: var(--text-primary); line-height: 1.6; margin: 10px 0 0 0; text-transform: uppercase; letter-spacing: 0.5px;"></p>

        <!-- BUTTONS -->
        <div style="display: flex; gap: 12px; margin-top: 15px; width: 100%;">
          <button type="button" id="omniConfirmCancel" class="bodega-btn bodega-btn-danger" style="flex: 1; height: 36px;">NO</button>
          <button type="button" id="omniConfirmAccept" class="bodega-btn bodega-btn-primary" style="flex: 1; height: 36px; background: linear-gradient(135deg, #00ff41, #00b32c) !important; border: 1px solid #00ff41 !important; color: var(--dark-1) !important; font-weight: bold !important;">SÍ</button>
        </div>
      </div>
    </div>
  `;

  // Inject modal into the DOM
  const wrapper = document.createElement('div');
  wrapper.innerHTML = modalHTML.trim();
  document.body.appendChild(wrapper.firstChild);

  // Get DOM elements
  const modal = document.getElementById('omniConfirmModal');
  const overlay = document.getElementById('omniConfirmOverlay');
  const messageEl = document.getElementById('omniConfirmMessage');
  const acceptBtn = document.getElementById('omniConfirmAccept');
  const cancelBtn = document.getElementById('omniConfirmCancel');
  const contentWrapper = modal.querySelector('.modal-content-wrapper');

  let currentOnAccept = null;
  let currentOnCancel = null;

  // Global show function
  window.showOmniConfirm = (message, onAccept, onCancel) => {
    messageEl.textContent = message;
    currentOnAccept = onAccept;
    currentOnCancel = onCancel;

    // Show modal with animation
    modal.style.display = 'flex';
    modal.style.opacity = '0';
    contentWrapper.style.transform = 'scale(0.85)';
    
    // Force reflow
    modal.offsetHeight;

    modal.style.opacity = '1';
    contentWrapper.style.transform = 'scale(1)';
  };

  const closeModal = (accepted) => {
    modal.style.opacity = '0';
    contentWrapper.style.transform = 'scale(0.85)';
    
    setTimeout(() => {
      modal.style.display = 'none';
      if (accepted && typeof currentOnAccept === 'function') {
        currentOnAccept();
      } else if (!accepted && typeof currentOnCancel === 'function') {
        currentOnCancel();
      }
      currentOnAccept = null;
      currentOnCancel = null;
    }, 200);
  };

  // Event Listeners
  acceptBtn.addEventListener('click', () => closeModal(true));
  cancelBtn.addEventListener('click', () => closeModal(false));
  overlay.addEventListener('click', () => closeModal(false));

  // Esc key closes confirm modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal(false);
    }
  });

  // 2. Global Interception of clicks on elements using custom confirmation attribute
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-confirm]');
    if (trigger) {
      e.preventDefault();
      e.stopPropagation();
      const message = trigger.getAttribute('data-confirm');
      
      window.showOmniConfirm(message, () => {
        // Proceed with original action
        if (trigger.tagName === 'A' && trigger.getAttribute('href')) {
          window.location.href = trigger.getAttribute('href');
        } else if (trigger.type === 'submit') {
          trigger.closest('form').submit();
        } else {
          // If it's a generic button or click-handled item, we temporarily clear the data-confirm, click it, and restore it
          trigger.removeAttribute('data-confirm');
          trigger.click();
          trigger.setAttribute('data-confirm', message);
        }
      });
    }
  }, true); // Use capture phase to intercept before inline or normal event handlers
});
