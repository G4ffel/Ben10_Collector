// ===== HOMEPAGE CENTRAL HOLOGRAM ALIEN ROTATION =====
document.addEventListener('DOMContentLoaded', () => {
  const centralAliens = [
    '/media/aliens/alien-x.png',
    '/media/aliens/fuego-pantanoso-supremo.png',
    '/media/aliens/goob.png',
    '/media/aliens/fuego.png',
    '/media/aliens/ben-tennyson.png'
  ];

  let currentIndex = 0;
  const centralImg = document.getElementById('centralHoloImg');

  if (centralImg) {
    setInterval(() => {
      currentIndex = (currentIndex + 1) % centralAliens.length;
      const nextAlienImg = centralAliens[currentIndex];

      // Animación de desaparición y escala (efecto glitch de entrada)
      centralImg.style.opacity = '0';
      centralImg.style.transform = 'scale(0.85) translateY(10px)';

      setTimeout(() => {
        // Actualizar imagen manteniendo la sombra verde original
        centralImg.src = nextAlienImg;
        centralImg.style.filter = 'drop-shadow(0 0 45px rgba(0, 255, 65, 0.6))';

        // Ajustar escala y posición específica para Goop (goob.png) para igualar el tamaño
        if (nextAlienImg.includes('goob.png')) {
          centralImg.style.transform = 'scale(1.15) translateY(-9px)';
        } else {
          centralImg.style.transform = 'scale(1) translateY(0)';
        }

        // Animación de aparición
        centralImg.style.opacity = '0.28';
      }, 400);
    }, 4000); // Rotación cada 4 segundos
  }
});
