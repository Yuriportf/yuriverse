// =============================================================
// YURIVERSE — profissional.js  (Dawn FM / Chrome & Silver)
// Animação: campo estelar com estrelas de 4 pontas cintilantes
// =============================================================

const header         = document.getElementById('header');
const mobileToggle   = document.getElementById('mobile-toggle');
const headerNav      = document.getElementById('header-nav');
const scrollProgress = document.getElementById('scroll-progress');
const backToTop      = document.getElementById('back-to-top');
const heroCanvas     = document.getElementById('hero-canvas');
const rotatingWordEl = document.getElementById('rotating-word');

let lastScroll = 0;

// ── MENU MOBILE ────────────────────────────────────────────
mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('active');
  headerNav.classList.toggle('open');
  document.body.style.overflow = headerNav.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.header-nav .nav-link').forEach(link => {
  link.addEventListener('click', e => {
    const section = link.getAttribute('data-section');
    if (section) { e.preventDefault(); scrollToSection(section); }
    closeMobileMenu();
  });
});

function closeMobileMenu() {
  mobileToggle.classList.remove('active');
  headerNav.classList.remove('open');
  document.body.style.overflow = '';
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMobileMenu();
});

// ── SCROLL HELPERS ─────────────────────────────────────────
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateActiveLink() {
  const scrollY = window.pageYOffset;
  document.querySelectorAll('section[id]').forEach(section => {
    const top = section.offsetTop - 110;
    const id  = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + section.offsetHeight) {
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-section') === id);
      });
    }
  });
}

function updateHeader() {
  const cur = window.pageYOffset;
  header.classList.toggle('scrolled', cur > 80);
  header.classList.toggle('hidden', cur > lastScroll && cur > 300);
  lastScroll = cur;
}

function updateProgress() {
  const doc = document.documentElement;
  scrollProgress.style.width = ((window.pageYOffset / (doc.scrollHeight - doc.clientHeight)) * 100) + '%';
}

function toggleBackToTop() {
  backToTop.classList.toggle('visible', window.pageYOffset > 300);
}

window.addEventListener('scroll', () => {
  updateActiveLink();
  updateHeader();
  updateProgress();
  toggleBackToTop();
});

// ── CANVAS — campo estelar chrome/silver ───────────────────
// Estrelas estáticas de fundo + estrelas de 4 pontas cintilantes
// + raios de luz ocasionais (shooting stars) — paleta prata/branco
function initParticles() {
  const ctx = heroCanvas.getContext('2d');

  function resize() {
    heroCanvas.width  = window.innerWidth;
    heroCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => {
    resize();
    buildStars();
  });

  // ── Estrelas de fundo (pontos fixos, só opacity pulsa) ──
  let bgStars = [];
  function buildStars() {
    const count = Math.floor((heroCanvas.width * heroCanvas.height) / 6000);
    bgStars = Array.from({ length: count }, () => ({
      x:       Math.random() * heroCanvas.width,
      y:       Math.random() * heroCanvas.height,
      r:       Math.random() * 0.8 + 0.2,
      base:    Math.random() * 0.5 + 0.1,   // opacidade base
      phase:   Math.random() * Math.PI * 2,
      speed:   Math.random() * 0.008 + 0.003,
    }));
  }
  buildStars();

  // ── Estrelas de 4 pontas cintilantes ───────────────────
  const SPIKE_COUNT = 28;
  const spikes = Array.from({ length: SPIKE_COUNT }, () => ({
    x:       Math.random() * heroCanvas.width,
    y:       Math.random() * heroCanvas.height,
    size:    Math.random() * 6 + 2,         // tamanho da estrela
    phase:   Math.random() * Math.PI * 2,
    speed:   Math.random() * 0.012 + 0.005,
    // tons entre branco puro e prata azulada
    hue:     Math.random() < 0.5 ? 240 : 0,
    sat:     Math.random() < 0.5 ? Math.floor(Math.random() * 30) : 0,
  }));

  // ── Shooting stars ──────────────────────────────────────
  let shoots = [];
  function spawnShoot() {
    const edge = Math.random();
    let x, y, angle;
    if (edge < 0.5) {
      x = Math.random() * heroCanvas.width;
      y = 0;
      angle = (Math.PI / 6) + Math.random() * (Math.PI / 3); // cai para baixo
    } else {
      x = 0;
      y = Math.random() * (heroCanvas.height * 0.6);
      angle = Math.random() * (Math.PI / 5);                  // vai para direita
    }
    shoots.push({
      x, y, angle,
      len:    Math.random() * 120 + 60,
      speed:  Math.random() * 8 + 5,
      life:   1.0,
      decay:  Math.random() * 0.018 + 0.012,
      width:  Math.random() * 1.2 + 0.4,
    });
  }

  // Lança um shooting star a cada 2.5–5s
  let shootTimer = 0;
  let shootInterval = Math.random() * 2500 + 2500;

  // ── Desenha estrela de 4 pontas ─────────────────────────
  function drawSpike(ctx, x, y, size, opacity, hue, sat) {
    const color = `hsla(${hue},${sat}%,92%,${opacity})`;
    const glow  = `hsla(${hue},${sat}%,100%,${opacity * 0.3})`;

    // Halo suave
    const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 2.5);
    grad.addColorStop(0, `hsla(${hue},${sat}%,100%,${opacity * 0.25})`);
    grad.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // 4 pontas (cruz de losangos)
    ctx.save();
    ctx.translate(x, y);
    for (let i = 0; i < 2; i++) {
      ctx.rotate(i * Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(size * 0.12, -size * 0.12, size * 0.35, 0);
      ctx.quadraticCurveTo(size * 0.12,  size * 0.12, 0,  size);
      ctx.quadraticCurveTo(-size * 0.12, size * 0.12, -size * 0.35, 0);
      ctx.quadraticCurveTo(-size * 0.12, -size * 0.12, 0, -size);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
    ctx.restore();

    // Ponto central brilhante
    ctx.beginPath();
    ctx.arc(x, y, size * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(0,0%,100%,${opacity})`;
    ctx.fill();
  }

  // ── Loop principal ──────────────────────────────────────
  let last = 0;
  function draw(ts) {
    const dt = ts - last;
    last = ts;

    ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

    // Estrelas de fundo
    bgStars.forEach(s => {
      s.phase += s.speed;
      const op = s.base + s.base * 0.6 * Math.sin(s.phase);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,220,255,${op})`;
      ctx.fill();
    });

    // Estrelas de 4 pontas
    spikes.forEach(s => {
      s.phase += s.speed;
      const t  = (Math.sin(s.phase) + 1) / 2;    // 0..1 suave
      const op = 0.08 + t * 0.85;                 // varia de quase invisível a brilhante
      const sz = s.size * (0.7 + t * 0.3);
      drawSpike(ctx, s.x, s.y, sz, op, s.hue, s.sat);
    });

    // Shooting stars
    shootTimer += dt;
    if (shootTimer > shootInterval) {
      spawnShoot();
      shootTimer = 0;
      shootInterval = Math.random() * 2500 + 2500;
    }

    shoots = shoots.filter(s => s.life > 0);
    shoots.forEach(s => {
      const tailX = s.x - Math.cos(s.angle) * s.len;
      const tailY = s.y - Math.sin(s.angle) * s.len;

      const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.6, `rgba(200,200,255,${s.life * 0.4})`);
      grad.addColorStop(1,   `rgba(255,255,255,${s.life * 0.9})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = s.width;
      ctx.lineCap     = 'round';
      ctx.stroke();

      // Faísca na ponta
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.width * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.life * 0.9})`;
      ctx.fill();

      s.x    += Math.cos(s.angle) * s.speed;
      s.y    += Math.sin(s.angle) * s.speed;
      s.life -= s.decay;
    });

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

// ── TYPING EFFECT ──────────────────────────────────────────
function initTypingEffect() {
  const words = ['desenvolvedor', 'criativo', 'aprendiz', 'entusiasta de tecnologia'];
  let wi = 0, ci = 0, deleting = false;
  const TTYPE = 120, TDEL = 55, PAUSE = 1600;

  function type() {
    const w = words[wi];
    if (!deleting) {
      rotatingWordEl.textContent = w.substring(0, ci + 1);
      ci++;
      if (ci === w.length) { deleting = true; setTimeout(type, PAUSE); return; }
    } else {
      rotatingWordEl.textContent = w.substring(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? TDEL : TTYPE);
  }
  type();
}

// ── MODAIS ─────────────────────────────────────────────────
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add('active');
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.remove('active');
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
  }
});

// ── MODAL BIBLIOTECA ───────────────────────────────────────
const openLibraryBtn = document.getElementById('openLibrary');
if (openLibraryBtn) {
  openLibraryBtn.addEventListener('click', e => {
    e.preventDefault();
    openModal('libraryModal');
  });
}

// ── CARROSSEL ──────────────────────────────────────────────
function initCarousel() {
  const track   = document.querySelector('.carousel-track');
  const wrapper = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsEl  = document.getElementById('carouselDots');

  if (!track || !wrapper) return;

  const slides = Array.from(track.querySelectorAll('.carousel-slide'));
  let current  = 0;

  function getSlidesPerView() {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 2;
    return 3;
  }

  function totalPages() {
    return Math.ceil(slides.length / getSlidesPerView());
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    for (let i = 0; i < totalPages(); i++) {
      const btn = document.createElement('button');
      btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      btn.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(btn);
    }
  }

  function updateDots() {
    dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(page) {
    current = Math.max(0, Math.min(page, totalPages() - 1));
    const slideW = slides[0].getBoundingClientRect().width + 16;
    track.style.transform = `translateX(-${current * getSlidesPerView() * slideW}px)`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= totalPages() - 1;
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  window.addEventListener('resize', () => { buildDots(); goTo(0); });

  buildDots();
  goTo(0);

  let startX = 0;
  wrapper.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  wrapper.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });
}

// ── SKIP INTRO ─────────────────────────────────────────────
function setSkipIntro() {
  sessionStorage.setItem('skipIntro', 'true');
}

function initSkipIntroOnExit() {
  const origin = window.location.origin;
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href') || '';
    let abs = href;
    try { abs = new URL(href, origin).href; } catch(e) {}
    const isIndex =
      href === '/' || href === '/index.html' || href === 'index.html' ||
      href === '.' || href === './' ||
      abs === origin + '/' || abs === origin + '/index.html' || abs.endsWith('/index.html');
    const isYuriverseText = link.textContent.trim().toLowerCase() === 'yuriverse';
    if (isIndex || isYuriverseText) link.addEventListener('click', setSkipIntro);
  });
  const logo = document.querySelector('.logo');
  if (logo) logo.addEventListener('click', setSkipIntro);
  window.addEventListener('pageshow', event => { if (event.persisted) setSkipIntro(); });
  window.addEventListener('beforeunload', setSkipIntro);
}

// ── INIT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTypingEffect();
  initCarousel();
  updateActiveLink();
  initSkipIntroOnExit();
});