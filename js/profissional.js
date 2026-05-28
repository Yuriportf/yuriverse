// =============================================================
// YURIVERSE — profissional.js
// Inclui: partículas, typing, modais sem scroll lock, skipIntro
// =============================================================

// ── ELEMENTOS ──────────────────────────────────────────────
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
    if (section) {
      e.preventDefault();
      scrollToSection(section);
    }
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

// ── ACTIVE LINK ────────────────────────────────────────────
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

// ── HEADER SCROLL ──────────────────────────────────────────
function updateHeader() {
  const cur = window.pageYOffset;
  header.classList.toggle('scrolled', cur > 80);
  header.classList.toggle('hidden', cur > lastScroll && cur > 300);
  lastScroll = cur;
}

// ── PROGRESS BAR ───────────────────────────────────────────
function updateProgress() {
  const doc = document.documentElement;
  scrollProgress.style.width = ((window.pageYOffset / (doc.scrollHeight - doc.clientHeight)) * 100) + '%';
}

// ── BACK TO TOP ────────────────────────────────────────────
function toggleBackToTop() {
  backToTop.classList.toggle('visible', window.pageYOffset > 300);
}

// ── SCROLL EVENT ───────────────────────────────────────────
window.addEventListener('scroll', () => {
  updateActiveLink();
  updateHeader();
  updateProgress();
  toggleBackToTop();
});

// ── CANVAS PARTICLES ───────────────────────────────────────
function initParticles() {
  const ctx = heroCanvas.getContext('2d');

  function resize() {
    heroCanvas.width  = window.innerWidth;
    heroCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 55 }, () => ({
    x:  Math.random() * heroCanvas.width,
    y:  Math.random() * heroCanvas.height,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    r:  Math.random() * 1.8 + 0.6
  }));

  function draw() {
    ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    ctx.fillStyle = 'rgba(255,0,0,0.45)';
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > heroCanvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > heroCanvas.height)  p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
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

// ── MODAIS (sem scroll lock e sem barra interna) ───────────
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add('active');
  // NÃO bloqueamos o scroll da página
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.remove('active');
  // NÃO restauramos overflow (nunca foi alterado)
}

// Fecha ao clicar fora
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });
});

// ── MODAL BIBLIOTECA ───────────────────────────────────────
const openLibraryBtn = document.getElementById('openLibrary');
if (openLibraryBtn) {
  openLibraryBtn.addEventListener('click', e => {
    e.preventDefault();
    openModal('libraryModal');
  });
}

// ── SKIP INTRO ao navegar para o index.html ─────────────────
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
      href === '/' ||
      href === '/index.html' ||
      href === 'index.html' ||
      href === '.' ||
      href === './' ||
      abs === origin + '/' ||
      abs === origin + '/index.html' ||
      abs.endsWith('/index.html');

    const isYuriverseText = link.textContent.trim().toLowerCase() === 'yuriverse';

    if (isIndex || isYuriverseText) {
      link.addEventListener('click', setSkipIntro);
    }
  });

  const logo = document.querySelector('.logo');
  if (logo) logo.addEventListener('click', setSkipIntro);

  // Garante que ao voltar com o botão do navegador a flag seja respeitada
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      setSkipIntro();
    }
  });

  window.addEventListener('beforeunload', setSkipIntro);
}

// ── INIT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTypingEffect();
  updateActiveLink();
  initSkipIntroOnExit();
});