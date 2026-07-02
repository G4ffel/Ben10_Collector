function createGlobalParticles() {
  const container = document.getElementById('global-particles');
  if (!container) return;

  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = '-10px';
    const size = Math.random() * 4 + 1;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    const duration = Math.random() * 8 + 6;
    p.style.animationDuration = duration + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    p.style.opacity = Math.random() * 0.7 + 0.1;
    container.appendChild(p);
  }
}

function initGlobalNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Run immediately to set correct state on load
  handleScroll();

  window.addEventListener('scroll', handleScroll);
}

function initGlobalHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
      navLinks.classList.remove('open');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  createGlobalParticles();
  initGlobalNavbar();
  initGlobalHamburger();
});
