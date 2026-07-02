/* ================================================
   BEN 10 | OMNITRIX UNIVERSE - JavaScript
   ================================================ */

// ===== DATA =====
const ALIENS = [
  {
    name: 'Heatblast',
    icon: '🔥',
    type: 'PIRONYITA',
    typeColor: '#ff4500',
    power: 'Control del fuego y plasma a temperaturas extremas',
    desc: 'Un ser hecho de roca volcánica y fuego. Puede crear y controlar llamas y plasma, y volar mediante propulsión.'
  },
  {
    name: 'Wildmutt',
    icon: '🦊',
    type: 'VULPINITRIX',
    typeColor: '#ff8800',
    power: 'Super olfato, agilidad y fuerza animal',
    desc: 'Sin ojos ni boca visible, usa el olfato y sonar para detectar todo a su alrededor con precisión extrema.'
  },
  {
    name: 'Diamondhead',
    icon: '💎',
    type: 'PETROSAPIEN',
    typeColor: '#00ccff',
    power: 'Cuerpo de cristal indestructible y proyectiles',
    desc: 'Su cuerpo está compuesto de cristal multifacético ultraresistente. Puede disparar fragmentos y crear escudos.'
  },
  {
    name: 'XLR8',
    icon: '⚡',
    type: 'KINECELERAN',
    typeColor: '#0066ff',
    power: 'Velocidad extrema superior a 800 km/h',
    desc: 'Corredora alienígena con velocidades supersónicas. Su cola actúa como ancla y puede cambiar de dirección instantáneamente.'
  },
  {
    name: 'Grey Matter',
    icon: '🧠',
    type: 'GALVÁNICO',
    typeColor: '#888888',
    power: 'Inteligencia sobrehumana y habilidad técnica',
    desc: 'Pequeño alien gris con el intelecto más avanzado del universo. Puede analizar y reparar cualquier máquina.'
  },
  {
    name: 'Cuatro Brazos',
    icon: '💪',
    type: 'TETRAMANDO',
    typeColor: '#cc0000',
    power: 'Fuerza descomunal y cuatro brazos poderosos',
    desc: 'El más fuerte de los aliens originales. Sus cuatro brazos pueden levantar estructuras enteras y crear ondas de choque.'
  },
  {
    name: 'Stinkfly',
    icon: '🦟',
    type: 'LEPIDÓPTERO',
    typeColor: '#aacc00',
    power: 'Vuelo, fluidos tóxicos y visión nocturna',
    desc: 'Insecto alienígena capaz de volar a gran velocidad y disparar fluidos tóxicos y viscosos por sus ojos y cola.'
  },
  {
    name: 'Ripjaws',
    icon: '🦈',
    type: 'PISCCISS VOLANN',
    typeColor: '#004488',
    power: 'Mandíbulas de acero y velocidad acuática',
    desc: 'Un depredador acuático con mandíbulas capaces de morder cualquier material. En tierra puede caminar con sus aletas.'
  },
  {
    name: 'Upgrade',
    icon: '🤖',
    type: 'GALVÁNICO MECAMORFO',
    typeColor: '#009933',
    power: 'Fusión con máquinas y control tecnológico',
    desc: 'Puede fusionarse con cualquier aparato tecnológico y mejorarlo exponencialmente. Es un fluido nanomecánico.'
  },
  {
    name: 'Ghostfreak',
    icon: '👻',
    type: 'ECTONURITA',
    typeColor: '#7700cc',
    power: 'Intangibilidad, posesión e invisibilidad',
    desc: 'Un ser espectral que puede atravesar paredes, volverse invisible y poseer el cuerpo de otros seres vivos.'
  }
];

// ===== PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
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

// ===== ALIEN CARDS =====
function renderAliens() {
  const grid = document.getElementById('aliensGrid');
  if (!grid) return;

  ALIENS.forEach((alien, i) => {
    const card = document.createElement('div');
    card.classList.add('alien-card');
    card.style.animationDelay = i * 0.08 + 's';
    card.innerHTML = `
      <span class="alien-card-icon">${alien.icon}</span>
      <div class="alien-card-name">${alien.name.toUpperCase()}</div>
      <div class="alien-card-type" style="background:${alien.typeColor}22; color:${alien.typeColor}; border: 1px solid ${alien.typeColor}44;">${alien.type}</div>
      <p class="alien-card-power">${alien.power}</p>
      <span class="alien-card-transform">▶ TRANSFORMAR</span>
    `;
    card.addEventListener('click', () => openModal(alien));
    grid.appendChild(card);
  });
}

// ===== MODAL =====
function openModal(alien) {
  const modal = document.getElementById('transformModal');
  const icon = document.getElementById('modalIcon');
  const alienName = document.getElementById('modalAlien');
  const desc = document.getElementById('modalDesc');

  icon.textContent = alien.icon;
  alienName.textContent = alien.name.toUpperCase();
  desc.textContent = alien.desc;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Flash effect
  document.body.style.transition = 'background 0.1s';
  document.body.style.background = 'rgba(0, 255, 65, 0.15)';
  setTimeout(() => {
    document.body.style.background = '';
  }, 200);
}

function closeModal() {
  const modal = document.getElementById('transformModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== NAVBAR SCROLL =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

// ===== HAMBURGER =====
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
      navLinks.classList.remove('open');
    }
  });
}

// ===== OMNITRIX TEXT CYCLER =====
function cycleOmnitrixText() {
  const el = document.getElementById('omniText');
  if (!el) return;

  const names = ALIENS.map(a => a.name.toUpperCase());
  let index = 0;

  setInterval(() => {
    index = (index + 1) % names.length;
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = names[index];
      el.style.opacity = '1';
    }, 300);
  }, 2500);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.alien-card, .power-card, .episode-card, .feature-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  const animObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.alien-card, .power-card, .episode-card, .feature-item').forEach(el => {
    animObserver.observe(el);
  });
}

// ===== CTA BUTTON =====
function initCTA() {
  const ctaFormBtn = document.getElementById('ctaFormBtn');
  const emailInput = document.getElementById('emailInput');

  if (ctaFormBtn && emailInput) {
    ctaFormBtn.addEventListener('click', () => {
      const email = emailInput.value.trim();
      if (!email || !email.includes('@')) {
        emailInput.style.borderColor = '#ff4444';
        emailInput.placeholder = 'Introduce un email válido';
        setTimeout(() => {
          emailInput.style.borderColor = '';
          emailInput.placeholder = 'tu@email.com';
        }, 2000);
        return;
      }
      ctaFormBtn.textContent = '✓ ¡BIENVENIDO AL UNIVERSO!';
      ctaFormBtn.style.background = '#00cc33';
      emailInput.value = '';
      setTimeout(() => {
        ctaFormBtn.textContent = 'UNIRME AL UNIVERSO';
        ctaFormBtn.style.background = '';
      }, 4000);
    });
  }

  // Nav CTA opens modal with random alien
  const navCta = document.getElementById('ctaBtn');
  if (navCta) {
    navCta.addEventListener('click', () => {
      const randomAlien = ALIENS[Math.floor(Math.random() * ALIENS.length)];
      openModal(randomAlien);
    });
  }
}

// ===== POWER BARS ANIMATION =====
function initPowerBars() {
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.bar-fill');
        bars.forEach((bar, i) => {
          bar.style.animationDelay = i * 0.15 + 's';
          bar.style.animationPlayState = 'running';
        });
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.power-card').forEach(card => {
    const bars = card.querySelectorAll('.bar-fill');
    bars.forEach(bar => {
      bar.style.animationPlayState = 'paused';
    });
    barObserver.observe(card);
  });
}

// ===== HERO ALIEN SVG CYCLE =====
function cycleHeroAlien() {
  const alienIcons = ['🔥', '💎', '⚡', '💪', '🤖', '👻', '🦊', '🦈', '🦟', '🧠'];
  const svgEl = document.querySelector('.alien-svg');
  if (!svgEl) return;

  // Just pulse the SVG with class changes
  let idx = 0;
  const emojiEl = document.createElement('span');
  emojiEl.style.cssText = 'font-size: 3rem; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); transition: opacity 0.4s;';
  emojiEl.textContent = alienIcons[0];
  svgEl.parentElement.appendChild(emojiEl);
  svgEl.style.display = 'none';

  setInterval(() => {
    idx = (idx + 1) % alienIcons.length;
    emojiEl.style.opacity = '0';
    setTimeout(() => {
      emojiEl.textContent = alienIcons[idx];
      emojiEl.style.opacity = '1';
    }, 400);
  }, 2000);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  renderAliens();
  initNavbar();
  initHamburger();
  cycleOmnitrixText();
  initScrollAnimations();
  initCTA();
  initPowerBars();
  cycleHeroAlien();

  // Modal close events
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', closeModal);

  // Keyboard close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Smooth scroll for all internal links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  console.log('%c🟢 BEN 10 - OMNITRIX UNIVERSE LOADED', 'color: #00ff41; font-size: 16px; font-weight: bold; background: #001a00; padding: 8px 16px; border-radius: 4px;');
});
