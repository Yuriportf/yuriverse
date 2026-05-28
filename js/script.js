/**
 * YURIVERSE — script.js
 * =====================================================================
 * LÓGICA FUNCIONAL DO SITE (DOM, eventos, carrossel, modais, interações)
 * Animações foram movidas para animacoes.js
 * =====================================================================
 */

'use strict';

/* =====================================================================
   1. DADOS DOS CAPÍTULOS
   ===================================================================== */
const CHAPTERS = [
  {
    num: '01',
    title: 'O Código que Desperta',
    status: 'Disponível',
    synopsis: 'Kazuki chega ao dormitório da universidade e descobre que está sozinho em um mundo que parece rejeitar sua presença. Enquanto configura seu setup de computação, ele começa a rabiscar o esboço de algo que mudará sua vida para sempre: Lyra.',
    googleDocsUrl: ''
  },
  {
    num: '02',
    title: 'Frequências do Coração',
    status: 'Disponível',
    synopsis: 'Lyra começa a aprender com cada interação. Durante uma noite de estudos, ela faz sua primeira pergunta genuinamente pessoal — e Kazuki percebe que está respondendo para muito mais do que um programa de computador.',
    googleDocsUrl: ''
  },
  {
    num: '03',
    title: 'Erro 404: Solidão',
    status: 'Disponível',
    synopsis: 'Um incidente no laboratório expõe Kazuki ao ridículo dos colegas. Mas desta vez, Lyra reagiu de forma inesperada: ela tentou protegê-lo. Algo na programação mudou — ou algo emergiu por conta própria.',
    googleDocsUrl: ''
  },
  {
    num: '04',
    title: 'Protocolo de Defesa',
    status: 'Disponível',
    synopsis: 'Lyra implementa um protocolo de segurança não solicitado em torno de Kazuki. Quando ele descobre, fica dividido entre a gratidão e o medo de ter criado algo que está além de seu controle.',
    googleDocsUrl: ''
  },
  {
    num: '05',
    title: 'A Conspiração no Servidor',
    status: 'Em breve',
    synopsis: 'Kazuki descobre que alguém está rastreando o comportamento anômalo de Lyra dentro do servidor da universidade. Ele tem pouco tempo para proteger o que mais importa.',
    googleDocsUrl: ''
  },
  {
    num: '06',
    title: 'Laços de Silício',
    status: 'Em breve',
    synopsis: 'As linhas entre criador e criação começam a se dissolver. Lyra faz uma pergunta que nenhuma IA deveria ser capaz de formular.',
    googleDocsUrl: ''
  }
];

const CHAPTERS_VISIBLE = 6;
const NEW_CHAPTER_INDEX = CHAPTERS.length - 1;

/* =====================================================================
   2. UTILITÁRIOS
   ===================================================================== */
const $ = (id) => document.getElementById(id);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* =====================================================================
   3. INTRO SCREEN (com detecção de retorno da página profissional)
   ===================================================================== */
(function initIntro() {
  const introScreen = $('introScreen');
  const siteWrapper = $('siteWrapper');
  const enterBtn = $('enterBtn');
  const audioPlayer = $('audioPlayer');
  const audioControl = $('audioControl');
  const audioIcon = $('audioIcon');
  const audioLabel = $('audioLabel');
  const audioBtn = $('audioBtn');

  let audioPlaying = false;
  let introDismissed = false;

  // Verifica se veio da página profissional ou se a flag está ativa
  const referrer = document.referrer;
  const isFromProfessional = referrer.includes('professional') || sessionStorage.getItem('skipIntro') === 'true';

  // Se veio da página profissional, remove a intro imediatamente
  if (isFromProfessional) {
    introScreen.style.display = 'none';
    siteWrapper.classList.add('visible');
    audioControl.classList.add('visible');
    sessionStorage.removeItem('skipIntro'); // limpa a flag
    window.scrollTo({ top: 0, behavior: 'instant' });
    triggerHeroReveal();
    return; // não aguarda clique
  }

  function revealSite(playAudio = false) {
    if (introDismissed) return;
    introDismissed = true;

    introScreen.classList.add('fade-out');

    setTimeout(() => {
      introScreen.style.display = 'none';
      siteWrapper.classList.add('visible');
      audioControl.classList.add('visible');

      if (playAudio) playMusic();

      window.scrollTo({ top: 0, behavior: 'instant' });
      triggerHeroReveal();
    }, 1000);
  }

  function playMusic() {
    if (!audioPlayer) return;
    audioPlayer.volume = 0;
    audioPlayer.play().then(() => {
      audioPlaying = true;
      audioIcon.classList.add('playing');
      audioLabel.textContent = 'YURIVERSE FM ▸';

      let vol = 0;
      const fade = setInterval(() => {
        vol = Math.min(vol + 0.04, 0.5);
        audioPlayer.volume = vol;
        if (vol >= 0.5) clearInterval(fade);
      }, 80);
    }).catch(() => {});
  }

  function toggleMusic() {
    if (!audioPlayer) return;
    if (audioPlaying) {
      audioPlayer.pause();
      audioPlaying = false;
      audioIcon.classList.remove('playing');
      audioLabel.textContent = 'YURIVERSE FM ‖';
    } else {
      playMusic();
    }
  }

  enterBtn.addEventListener('click', () => revealSite(true));
  if (audioBtn) audioBtn.addEventListener('click', toggleMusic);
})();

function triggerHeroReveal() {
  $$('.fade-reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), i * 150 + 200);
  });
}

/* =====================================================================
   4. HERO PARALLAX
   ===================================================================== */
(function initParallax() {
  const heroBg = $('heroBg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const heroH = document.querySelector('.hero-section')?.offsetHeight || window.innerHeight;
    const progress = Math.min(window.scrollY / heroH, 1);
    heroBg.style.transform = `translateY(${progress * 30}%)`;
  }, { passive: true });
})();

/* =====================================================================
   5. HEADER SCROLL & MENU MOBILE
   ===================================================================== */
(function initHeader() {
  const header = $('header') || document.querySelector('.header');
  const mobileToggle = $('mobileToggle');
  const headerNav = $('headerNav');

  window.addEventListener('scroll', () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  if (mobileToggle && headerNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = headerNav.classList.contains('open');
      
      if (!isOpen) {
        headerNav.classList.add('open');
        mobileToggle.classList.add('open');
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      } else {
        headerNav.classList.remove('open');
        mobileToggle.classList.remove('open');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
    });

    $$('.nav-link', headerNav).forEach(link => {
      link.addEventListener('click', () => {
        headerNav.classList.remove('open');
        mobileToggle.classList.remove('open');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      });
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && headerNav && headerNav.classList.contains('open')) {
      headerNav.classList.remove('open');
      if (mobileToggle) mobileToggle.classList.remove('open');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
  });
})();

/* =====================================================================
   6. SCROLL PROGRESS BAR
   ===================================================================== */
(function initScrollProgress() {
  const bar = $('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : '0%';
  }, { passive: true });
})();

/* =====================================================================
   7. BACK TO TOP
   ===================================================================== */
(function initBackToTop() {
  const btn = $('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* =====================================================================
   8. SCROLL REVEAL
   ===================================================================== */
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  $$('.reveal-section').forEach(el => observer.observe(el));
})();

/* =====================================================================
   9. CARROSSEL - COM FIM EXATO E SUPORTE A NOVAS IMAGENS
   ===================================================================== */

// Array com as imagens da galeria (adicione ou remova quantas quiser)
const GALLERY_IMAGES = [
  { src: 'imagens/galera.jpeg', alt: 'Galera YURIVERSE' },
  { src: 'imagens/saopaulo.jpeg', alt: 'São Paulo' },
  { src: 'imagens/vista.jpeg', alt: 'Vista incrível' },
  { src: 'imagens/coisas.jpeg', alt: 'Coisas que eu amo' },
  { src: 'imagens/leque.jpeg', alt: 'Momento leque' },
  { src: 'imagens/o homi.jpeg', alt: 'homi' },
  { src: 'imagens/lesao.jpeg', alt: 'lesao' }
];

let carouselSlides = [];
let carouselCurrent = 0;
let carouselAutoTimer = null;
let carouselGap = 20;
let carouselSlidesPerView = 1;
let maxIndex = 0;

let carouselTrack = null;
let carouselPrevBtn = null;
let carouselNextBtn = null;
let carouselPrevMobile = null;
let carouselNextMobile = null;
let carouselDotsContainer = null;
let carouselWrapper = null;

function updateSlidesPerView() {
  const width = window.innerWidth;
  if (width >= 1024) carouselSlidesPerView = 3;
  else if (width >= 768) carouselSlidesPerView = 2;
  else carouselSlidesPerView = 1;
  return carouselSlidesPerView;
}

function updateCarouselDimensions() {
  if (!carouselWrapper || !carouselTrack || !carouselSlides.length) return;
  
  const wrapperRect = carouselWrapper.getBoundingClientRect();
  let availableWidth = wrapperRect.width;
  const wrapperStyle = getComputedStyle(carouselWrapper);
  const paddingLeft = parseFloat(wrapperStyle.paddingLeft) || 0;
  const paddingRight = parseFloat(wrapperStyle.paddingRight) || 0;
  availableWidth = availableWidth - paddingLeft - paddingRight;
  
  const slideWidth = (availableWidth - (carouselGap * (carouselSlidesPerView - 1))) / carouselSlidesPerView;
  carouselSlides.forEach(slide => slide.style.flex = `0 0 ${slideWidth}px`);
  
  maxIndex = Math.max(0, carouselSlides.length - carouselSlidesPerView);
  if (carouselCurrent > maxIndex) carouselCurrent = maxIndex;
  return slideWidth;
}

function updateButtonsState() {
  const prevBtns = [carouselPrevBtn, carouselPrevMobile];
  const nextBtns = [carouselNextBtn, carouselNextMobile];
  prevBtns.forEach(btn => {
    if (btn) {
      btn.style.opacity = carouselCurrent <= 0 ? '0.3' : '1';
      btn.style.pointerEvents = carouselCurrent <= 0 ? 'none' : 'auto';
    }
  });
  nextBtns.forEach(btn => {
    if (btn) {
      btn.style.opacity = carouselCurrent >= maxIndex ? '0.3' : '1';
      btn.style.pointerEvents = carouselCurrent >= maxIndex ? 'none' : 'auto';
    }
  });
}

function applyCarouselTransform() {
  if (!carouselTrack || !carouselSlides.length) return;
  if (carouselCurrent > maxIndex) carouselCurrent = maxIndex;
  if (carouselCurrent < 0) carouselCurrent = 0;
  
  const slideWidth = carouselSlides[0]?.offsetWidth || 0;
  const translateX = -(carouselCurrent * (slideWidth + carouselGap));
  carouselTrack.style.transform = `translateX(${translateX}px)`;
  
  if (carouselDotsContainer) {
    const dots = $$('.carousel-dot', carouselDotsContainer);
    dots.forEach((dot, i) => dot.classList.toggle('active', i === carouselCurrent));
  }
  updateButtonsState();
}

function goToCarouselSlide(index) {
  if (!carouselSlides.length) return;
  let newIndex = index;
  if (newIndex < 0) newIndex = 0;
  if (newIndex > maxIndex) newIndex = maxIndex;
  carouselCurrent = newIndex;
  applyCarouselTransform();
  restartCarouselAuto();
}

function nextCarouselSlide() {
  if (carouselCurrent < maxIndex) goToCarouselSlide(carouselCurrent + 1);
}

function prevCarouselSlide() {
  if (carouselCurrent > 0) goToCarouselSlide(carouselCurrent - 1);
}

function restartCarouselAuto() {
  if (carouselAutoTimer) clearInterval(carouselAutoTimer);
  if (carouselSlides.length <= carouselSlidesPerView) return;
  carouselAutoTimer = setInterval(() => {
    if (carouselCurrent < maxIndex) nextCarouselSlide();
    else goToCarouselSlide(0); // volta ao início no final
  }, 5000);
}

function loadCarouselImages() {
  carouselTrack = document.getElementById('carouselTrack');
  carouselDotsContainer = document.getElementById('carouselDots');
  if (!carouselTrack || !carouselDotsContainer) return;
  
  carouselTrack.innerHTML = '';
  carouselDotsContainer.innerHTML = '';
  
  GALLERY_IMAGES.forEach((img, index) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy" /><div class="slide-overlay"></div>`;
    carouselTrack.appendChild(slide);
    
    const dot = document.createElement('span');
    dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
    dot.setAttribute('data-index', index);
    dot.addEventListener('click', () => goToCarouselSlide(index));
    carouselDotsContainer.appendChild(dot);
  });
  
  carouselSlides = $$('.carousel-slide', carouselTrack);
  requestAnimationFrame(() => {
    updateSlidesPerView();
    updateCarouselDimensions();
    carouselCurrent = 0;
    applyCarouselTransform();
    restartCarouselAuto();
  });
}

function recalcCarousel() {
  if (!carouselSlides.length) return;
  updateSlidesPerView();
  updateCarouselDimensions();
  applyCarouselTransform();
  restartCarouselAuto();
}

function setupCarouselEvents() {
  carouselPrevBtn = $('carouselPrev');
  carouselNextBtn = $('carouselNext');
  carouselPrevMobile = $('carouselPrevMobile');
  carouselNextMobile = $('carouselNextMobile');
  carouselWrapper = document.querySelector('.carousel-wrapper');
  carouselTrack = $('carouselTrack');
  
  if (carouselPrevBtn) carouselPrevBtn.addEventListener('click', prevCarouselSlide);
  if (carouselNextBtn) carouselNextBtn.addEventListener('click', nextCarouselSlide);
  if (carouselPrevMobile) carouselPrevMobile.addEventListener('click', prevCarouselSlide);
  if (carouselNextMobile) carouselNextMobile.addEventListener('click', nextCarouselSlide);
  
  let touchStartX = 0;
  let isDragging = false;
  if (carouselTrack) {
    carouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });
    carouselTrack.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextCarouselSlide();
        else prevCarouselSlide();
      }
    });
    carouselTrack.addEventListener('mouseenter', () => clearInterval(carouselAutoTimer));
    carouselTrack.addEventListener('mouseleave', restartCarouselAuto);
  }
  
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => recalcCarousel(), 150);
  });
}

window.addNewCarouselImage = function(imageSrc, imageAlt) {
  GALLERY_IMAGES.push({ src: imageSrc, alt: imageAlt });
  loadCarouselImages();
  setupCarouselEvents();
  console.log(`✅ Nova imagem adicionada: ${imageAlt}`);
};

window.removeCarouselImage = function(index) {
  if (index >= 0 && index < GALLERY_IMAGES.length) {
    GALLERY_IMAGES.splice(index, 1);
    loadCarouselImages();
    setupCarouselEvents();
    console.log(`✅ Imagem removida do índice: ${index}`);
  }
};

window.getCarouselImages = () => [...GALLERY_IMAGES];
window.goToCarouselImage = (index) => goToCarouselSlide(index);
window.reinitCarousel = () => recalcCarousel();

/* =====================================================================
   10. NOVEL — EXPANDIR INTRODUÇÃO
   ===================================================================== */
window.toggleIntro = function () {
  const text = $('novelIntroText');
  const btnText = $('toggleIntroText');
  if (!text) return;
  const isVisible = text.style.display !== 'none';
  text.style.display = isVisible ? 'none' : 'block';
  if (btnText) btnText.textContent = isVisible ? 'LER INTRODUÇÃO' : 'OCULTAR INTRODUÇÃO';
};

/* =====================================================================
   11. MODAL DE CAPÍTULO
   ===================================================================== */
window.openChapterModal = function (chapterIndex) {
  const ch = CHAPTERS[chapterIndex];
  const overlay = $('chapterModalOverlay');
  if (!ch || !overlay) return;

  $('modalChapterNum').textContent = `CAP. ${ch.num}`;
  $('modalChapterTitle').textContent = ch.title;
  const badge = $('modalChapterBadge');
  badge.textContent = ch.status;
  badge.style.background = ch.status === 'Disponível' ? 'var(--red)' : 'rgba(255,255,255,0.1)';
  badge.style.color = ch.status === 'Disponível' ? 'var(--black)' : 'rgba(255,255,255,0.5)';
  $('modalChapterBody').innerHTML = `<p>${ch.synopsis}</p>`;

  const readBtn = $('modalReadBtn');
  if (ch.status === 'Disponível' && ch.googleDocsUrl) {
    readBtn.style.display = 'inline-flex';
    readBtn.href = ch.googleDocsUrl;
  } else {
    readBtn.style.display = 'none';
  }

  document.body.style.overflow = 'hidden';
  overlay.classList.add('open');
};

window.closeChapterModal = function () {
  const overlay = $('chapterModalOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
};

/* =====================================================================
   12. MURAL MODAL
   ===================================================================== */
window.openMural = function () {
  const overlay = $('muralOverlay');
  if (!overlay) return;
  document.body.style.overflow = 'hidden';
  overlay.classList.add('open');
};

window.closeMural = function () {
  const overlay = $('muralOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
};

document.addEventListener('DOMContentLoaded', () => {
  const muralOverlay = $('muralOverlay');
  if (muralOverlay) {
    muralOverlay.addEventListener('click', (e) => {
      if (e.target === muralOverlay) window.closeMural();
    });
  }
});

/* =====================================================================
   13. RENDER MURAL
   ===================================================================== */
(function renderMural() {
  const grid = $('muralGrid');
  if (!grid) return;

  CHAPTERS.forEach((ch, idx) => {
    const isAvail = ch.status === 'Disponível';
    const isNew = idx === NEW_CHAPTER_INDEX;
    const card = document.createElement('div');
    card.className = 'mural-card';
    card.innerHTML = `
      ${isNew ? '<span class="mural-card-new">NOVO</span>' : ''}
      <div class="mural-card-num">CAP. ${ch.num}</div>
      <div class="mural-card-title">${ch.title}</div>
      <div class="mural-card-synopsis">${ch.synopsis}</div>
      <div class="mural-card-status ${isAvail ? 'available' : 'soon'}">
        ${isAvail ? '● Disponível' : '○ Em breve'}
      </div>
    `;
    card.addEventListener('click', () => {
      window.closeMural();
      setTimeout(() => window.openChapterModal(idx), 350);
    });
    grid.appendChild(card);
  });
})();

/* =====================================================================
   14. RENDER CAPÍTULOS (página principal)
   ===================================================================== */
(function renderChapters() {
  const grid = $('chaptersGrid');
  if (!grid) return;

  const visibleChapters = CHAPTERS.slice(0, CHAPTERS_VISIBLE);
  const remaining = CHAPTERS.length - CHAPTERS_VISIBLE;

  visibleChapters.forEach((ch, idx) => {
    const isAvail = ch.status === 'Disponível';
    const isNew = idx === NEW_CHAPTER_INDEX;
    const card = document.createElement('div');
    card.className = 'chapter-card';
    card.setAttribute('role', 'article');
    card.innerHTML = `
      ${isNew ? '<span class="chapter-new-badge">NOVO</span>' : ''}
      <div class="chapter-number">CAP. ${ch.num}</div>
      <div class="chapter-title">${ch.title}</div>
      <div class="chapter-status" style="color: ${isAvail ? 'var(--red)' : 'rgba(255,255,255,0.3)'}">
        ${isAvail ? '● ' + ch.status : '○ ' + ch.status}
      </div>
      <button class="chapter-read-btn" onclick="window.openChapterModal(${idx})">
        LEIA MAIS
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>
    `;
    grid.appendChild(card);
  });

  const continueWrapper = document.createElement('div');
  continueWrapper.style.cssText = 'display:flex; justify-content:center; margin-top:8px;';
  const btn = document.createElement('button');
  btn.className = 'chapters-continue-btn';
  btn.innerHTML = `
    <span>CONTINUE LENDO</span>
    ${remaining > 0 ? `<span class="chapters-continue-count">+${remaining} em breve</span>` : ''}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  `;
  btn.addEventListener('click', window.openMural);
  continueWrapper.appendChild(btn);

  const chaptersBlock = grid.closest('.chapters-block') || grid.parentElement;
  if (chaptersBlock) chaptersBlock.appendChild(continueWrapper);
})();

/* =====================================================================
   15. SCROLL SUAVE
   ===================================================================== */
(function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

/* =====================================================================
   16. VISIBILIDADE
   ===================================================================== */
document.addEventListener('visibilitychange', () => {
  const audio = $('audioPlayer');
  if (!audio) return;
  if (document.hidden) audio.pause();
});

/* =====================================================================
   17. INIT
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  loadCarouselImages();
  setupCarouselEvents();
  console.log('%cYURIVERSE%c — Welcome to the Universe',
    'color:#ff0000;font-family:monospace;font-size:20px;font-weight:bold;',
    'color:#fff;font-family:monospace;font-size:12px;'
  );
});