/**
 * YURIVERSE — script.js  (ATUALIZADO)
 * =====================================================================
 * LÓGICA FUNCIONAL DO SITE (DOM, eventos, carrossel, modais, interações)
 * 
 * Novidades nesta versão:
 *  - Música retoma ao voltar de outra página (beforeunload + pageshow)
 *  - Música pausa/retoma ao trocar de aba (visibilitychange)
 *  - Controle de volume com slider + ícone mudo/alto
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
   3. INTRO SCREEN
   ===================================================================== */
(function initIntro() {
  const introScreen = $('introScreen');
  const siteWrapper = $('siteWrapper');
  const enterBtn    = $('enterBtn');
  const audioControl = $('audioControl');

  let introDismissed = false;

  const referrer = document.referrer;
  const isFromProfessional =
    referrer.includes('professional') ||
    sessionStorage.getItem('skipIntro') === 'true';

  if (isFromProfessional) {
    introScreen.style.display = 'none';
    siteWrapper.classList.add('visible');
    audioControl.classList.add('visible');
    sessionStorage.removeItem('skipIntro');
    window.scrollTo({ top: 0, behavior: 'instant' });
    triggerHeroReveal();
    return;
  }

  function revealSite(playAudio = false) {
    if (introDismissed) return;
    introDismissed = true;

    introScreen.classList.add('fade-out');

    setTimeout(() => {
      introScreen.style.display = 'none';
      siteWrapper.classList.add('visible');
      audioControl.classList.add('visible');

      if (playAudio && window.playerAPI) {
        window.playerAPI.startWithFade();
      }

      window.scrollTo({ top: 0, behavior: 'instant' });
      triggerHeroReveal();
    }, 1000);
  }

  enterBtn.addEventListener('click', () => revealSite(true));
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
  const header       = $('header') || document.querySelector('.header');
  const mobileToggle = $('mobileToggle');
  const headerNav    = $('headerNav');

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
        document.body.style.overflow   = 'hidden';
        document.body.style.position   = 'fixed';
        document.body.style.width      = '100%';
      } else {
        headerNav.classList.remove('open');
        mobileToggle.classList.remove('open');
        document.body.style.overflow   = '';
        document.body.style.position   = '';
        document.body.style.width      = '';
      }
    });

    $$('.nav-link', headerNav).forEach(link => {
      link.addEventListener('click', () => {
        headerNav.classList.remove('open');
        mobileToggle.classList.remove('open');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width    = '';
      });
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && headerNav?.classList.contains('open')) {
      headerNav.classList.remove('open');
      if (mobileToggle) mobileToggle.classList.remove('open');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width    = '';
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
   9. CARROSSEL
   ===================================================================== */
const GALLERY_IMAGES = [
  { src: 'assets/imagens/carrossel/galera.jpeg',   alt: 'Galera YURIVERSE' },
  { src: 'assets/imagens/carrossel/saopaulo.jpeg', alt: 'São Paulo' },
  { src: 'assets/imagens/carrossel/vista.jpeg',    alt: 'Vista incrível' },
  { src: 'assets/imagens/carrossel/coisas.jpeg',   alt: 'Coisas que eu amo' },
  { src: 'assets/imagens/carrossel/leque.jpeg',    alt: 'Momento leque' },
  { src: 'assets/imagens/carrossel/homi.jpeg',   alt: 'homi' },
  { src: 'assets/imagens/carrossel/lesao.jpeg',    alt: 'lesao' }
];

let carouselSlides = [];
let carouselCurrent = 0;
let carouselAutoTimer = null;
let carouselGap = 20;
let carouselSlidesPerView = 1;
let maxIndex = 0;

let carouselTrack       = null;
let carouselPrevBtn     = null;
let carouselNextBtn     = null;
let carouselPrevMobile  = null;
let carouselNextMobile  = null;
let carouselDotsContainer = null;
let carouselWrapper     = null;

function updateSlidesPerView() {
  const width = window.innerWidth;
  if (width >= 1024)      carouselSlidesPerView = 3;
  else if (width >= 768)  carouselSlidesPerView = 2;
  else                    carouselSlidesPerView = 1;
  return carouselSlidesPerView;
}

function updateCarouselDimensions() {
  if (!carouselWrapper || !carouselTrack || !carouselSlides.length) return;
  const wrapperRect = carouselWrapper.getBoundingClientRect();
  const wrapperStyle = getComputedStyle(carouselWrapper);
  const paddingLeft  = parseFloat(wrapperStyle.paddingLeft)  || 0;
  const paddingRight = parseFloat(wrapperStyle.paddingRight) || 0;
  const availableWidth = wrapperRect.width - paddingLeft - paddingRight;
  const slideWidth = (availableWidth - (carouselGap * (carouselSlidesPerView - 1))) / carouselSlidesPerView;
  carouselSlides.forEach(slide => slide.style.flex = `0 0 ${slideWidth}px`);
  maxIndex = Math.max(0, carouselSlides.length - carouselSlidesPerView);
  if (carouselCurrent > maxIndex) carouselCurrent = maxIndex;
  return slideWidth;
}

function updateButtonsState() {
  [carouselPrevBtn, carouselPrevMobile].forEach(btn => {
    if (!btn) return;
    btn.style.opacity       = carouselCurrent <= 0 ? '0.3' : '1';
    btn.style.pointerEvents = carouselCurrent <= 0 ? 'none' : 'auto';
  });
  [carouselNextBtn, carouselNextMobile].forEach(btn => {
    if (!btn) return;
    btn.style.opacity       = carouselCurrent >= maxIndex ? '0.3' : '1';
    btn.style.pointerEvents = carouselCurrent >= maxIndex ? 'none' : 'auto';
  });
}

function applyCarouselTransform() {
  if (!carouselTrack || !carouselSlides.length) return;
  carouselCurrent = Math.max(0, Math.min(carouselCurrent, maxIndex));
  const slideWidth = carouselSlides[0]?.offsetWidth || 0;
  carouselTrack.style.transform = `translateX(${-(carouselCurrent * (slideWidth + carouselGap))}px)`;
  if (carouselDotsContainer) {
    $$('.carousel-dot', carouselDotsContainer).forEach((dot, i) =>
      dot.classList.toggle('active', i === carouselCurrent));
  }
  updateButtonsState();
}

function goToCarouselSlide(index) {
  if (!carouselSlides.length) return;
  carouselCurrent = Math.max(0, Math.min(index, maxIndex));
  applyCarouselTransform();
  restartCarouselAuto();
}

function nextCarouselSlide() { if (carouselCurrent < maxIndex) goToCarouselSlide(carouselCurrent + 1); }
function prevCarouselSlide() { if (carouselCurrent > 0)        goToCarouselSlide(carouselCurrent - 1); }

function restartCarouselAuto() {
  if (carouselAutoTimer) clearInterval(carouselAutoTimer);
  if (carouselSlides.length <= carouselSlidesPerView) return;
  carouselAutoTimer = setInterval(() => {
    if (carouselCurrent < maxIndex) nextCarouselSlide();
    else goToCarouselSlide(0);
  }, 5000);
}

function loadCarouselImages() {
  carouselTrack         = $('carouselTrack');
  carouselDotsContainer = $('carouselDots');
  if (!carouselTrack || !carouselDotsContainer) return;

  carouselTrack.innerHTML         = '';
  carouselDotsContainer.innerHTML = '';

  GALLERY_IMAGES.forEach((img, index) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy" /><div class="slide-overlay"></div>`;
    carouselTrack.appendChild(slide);

    const dot = document.createElement('span');
    dot.className = `carousel-dot${index === 0 ? ' active' : ''}`;
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
  carouselPrevBtn    = $('carouselPrev');
  carouselNextBtn    = $('carouselNext');
  carouselPrevMobile = $('carouselPrevMobile');
  carouselNextMobile = $('carouselNextMobile');
  carouselWrapper    = document.querySelector('.carousel-wrapper');
  carouselTrack      = $('carouselTrack');

  if (carouselPrevBtn)    carouselPrevBtn.addEventListener('click', prevCarouselSlide);
  if (carouselNextBtn)    carouselNextBtn.addEventListener('click', nextCarouselSlide);
  if (carouselPrevMobile) carouselPrevMobile.addEventListener('click', prevCarouselSlide);
  if (carouselNextMobile) carouselNextMobile.addEventListener('click', nextCarouselSlide);

  let touchStartX = 0;
  let isDragging  = false;
  if (carouselTrack) {
    carouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      isDragging  = true;
    }, { passive: true });
    carouselTrack.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) diff > 0 ? nextCarouselSlide() : prevCarouselSlide();
    });
    carouselTrack.addEventListener('mouseenter', () => clearInterval(carouselAutoTimer));
    carouselTrack.addEventListener('mouseleave', restartCarouselAuto);
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(recalcCarousel, 150);
  });
}

window.addNewCarouselImage  = (src, alt) => { GALLERY_IMAGES.push({ src, alt }); loadCarouselImages(); setupCarouselEvents(); };
window.removeCarouselImage  = (i) => { if (i >= 0 && i < GALLERY_IMAGES.length) { GALLERY_IMAGES.splice(i, 1); loadCarouselImages(); setupCarouselEvents(); } };
window.getCarouselImages    = () => [...GALLERY_IMAGES];
window.goToCarouselImage    = (i) => goToCarouselSlide(i);
window.reinitCarousel       = () => recalcCarousel();

/* =====================================================================
   10. NOVEL — EXPANDIR INTRODUÇÃO
   ===================================================================== */
window.toggleIntro = function () {
  const text    = $('novelIntroText');
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
  const ch      = CHAPTERS[chapterIndex];
  const overlay = $('chapterModalOverlay');
  if (!ch || !overlay) return;

  $('modalChapterNum').textContent   = `CAP. ${ch.num}`;
  $('modalChapterTitle').textContent = ch.title;
  const badge = $('modalChapterBadge');
  badge.textContent      = ch.status;
  badge.style.background = ch.status === 'Disponível' ? 'var(--red)' : 'rgba(255,255,255,0.1)';
  badge.style.color      = ch.status === 'Disponível' ? 'var(--black)' : 'rgba(255,255,255,0.5)';
  $('modalChapterBody').innerHTML = `<p>${ch.synopsis}</p>`;

  const readBtn = $('modalReadBtn');
  if (ch.status === 'Disponível' && ch.googleDocsUrl) {
    readBtn.style.display = 'inline-flex';
    readBtn.href          = ch.googleDocsUrl;
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
    const isNew   = idx === NEW_CHAPTER_INDEX;
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
   14. RENDER CAPÍTULOS
   ===================================================================== */
(function renderChapters() {
  const grid = $('chaptersGrid');
  if (!grid) return;

  const visibleChapters = CHAPTERS.slice(0, CHAPTERS_VISIBLE);
  const remaining       = CHAPTERS.length - CHAPTERS_VISIBLE;

  visibleChapters.forEach((ch, idx) => {
    const isAvail = ch.status === 'Disponível';
    const isNew   = idx === NEW_CHAPTER_INDEX;
    const card    = document.createElement('div');
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
  continueWrapper.style.cssText = 'display:flex;justify-content:center;margin-top:8px;';
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
    const id     = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
  });
})();

/* =====================================================================
   16. PLAYER DE ÁUDIO — multi-faixa + volume + persistência de sessão
   ===================================================================== */
(function initAudioPlayer() {

  const TRACKS = [
    { title: "WAKE ME UP - THE WEEKND",                                    src: "assets/audio/WAKE ME UP.mp3" },
    { title: "WANNA BE STARTIN' SOMETHIN' - MICHAEL JACKSON",              src: "assets/audio/Michael Jackson - Wanna Be Startin' Somethin' .mp3" },
    { title: "VANISH INTO YOU - LADY GAGA",                                src: "assets/audio/Vanish Into You.mp3" },
    { title: "DON'T STOP THE MUSIC - RIHANNA",                             src: "assets/audio/Don't Stop The Music .mp3" },
    { title: "GET LUCKY - DAFT PUNK ft. PHARRELL WILLIAMS",                src: "assets/audio/Get Lucky .mp3" },
    { title: "I WANT TO KNOW WHAT LOVE IS - FOREIGNER",                    src: "assets/audio/I Want To Know What Love Is.mp3" },
    { title: "(I JUST) DIED IN YOUR ARMS - CUTTING CREW",                  src: "assets/audio/(I Just) Died In Your Arms.mp3" },
  ];

  /* ── Elementos ── */
  const audioPlayer      = $('audioPlayer');
  const playPauseBtn     = $('playPauseBtn');
  const prevTrackBtn     = $('prevTrackBtn');
  const nextTrackBtn     = $('nextTrackBtn');
  const trackNameLabel   = $('trackNameLabel');
  const playlistToggleBtn = $('playlistToggleBtn');
  const playlistPanel    = $('playlistPanel');
  const playlistItems    = $('playlistItems');
  const audioIcon        = $('audioIcon');
  const audioControl     = $('audioControl');
  const audioMinimizeBtn = $('audioMinimizeBtn');
  const audioPill        = $('audioPill');
  const audioPillIcon    = $('audioPillIcon');
  const volumeSlider     = $('volumeSlider');
  const volumeIcon       = $('volumeIcon');

  let currentTrackIndex = 0;
  let isPlaying         = false;
  let fadeInterval      = null;
  let isMinimized       = false;
  let lastVolume        = 0.5;

  /* Chaves de sessão */
  const KEY_PLAYING = 'yuri_audio_playing';
  const KEY_TRACK   = 'yuri_audio_track';
  const KEY_TIME    = 'yuri_audio_time';
  const KEY_VOLUME  = 'yuri_audio_volume';

  /* ── Estado de play/pause ── */
  function setPlayingState(playing) {
    isPlaying = playing;
    if (playing) {
      audioIcon?.classList.add('playing');
      audioPillIcon?.classList.add('playing');
    } else {
      audioIcon?.classList.remove('playing');
      audioPillIcon?.classList.remove('playing');
    }
  }

  /* ── Volume: sincroniza slider e ícone ── */
  function syncVolumeUI(vol) {
    const pct = Math.round(vol * 100);
    if (volumeSlider) {
      volumeSlider.value = pct;
      volumeSlider.style.setProperty('--vol-pct', pct + '%');
    }
    if (volumeIcon) {
      if (vol === 0)       volumeIcon.textContent = '🔇';
      else if (vol < 0.4)  volumeIcon.textContent = '🔈';
      else if (vol < 0.75) volumeIcon.textContent = '🔉';
      else                 volumeIcon.textContent = '🔊';
    }
  }

  /* ── Controle de volume ── */
  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      const vol = Number(volumeSlider.value) / 100;
      audioPlayer.volume = vol;
      if (vol > 0) lastVolume = vol;
      syncVolumeUI(vol);
    });
  }

  if (volumeIcon) {
    volumeIcon.addEventListener('click', () => {
      if (audioPlayer.volume > 0) {
        lastVolume = audioPlayer.volume;
        audioPlayer.volume = 0;
        syncVolumeUI(0);
      } else {
        audioPlayer.volume = lastVolume || 0.5;
        syncVolumeUI(audioPlayer.volume);
      }
    });
  }

  /* ── Playlist UI ── */
  function updateTrackDisplay() {
    if (trackNameLabel) trackNameLabel.textContent = TRACKS[currentTrackIndex].title;
    window._currentTrackIndex = currentTrackIndex; /* para o beforeunload */
    renderPlaylist();
  }

  function renderPlaylist() {
    if (!playlistItems) return;
    playlistItems.innerHTML = '';
    TRACKS.forEach((track, idx) => {
      const item = document.createElement('div');
      item.className = 'playlist-item' + (idx === currentTrackIndex ? ' active' : '');
      item.innerHTML = `
        <span class="playlist-item-num">${String(idx + 1).padStart(2, '0')}</span>
        <span class="playlist-item-title">${track.title}</span>
        <span class="playlist-item-badge">${idx === currentTrackIndex ? '▶' : ''}</span>
      `;
      item.addEventListener('click', () => {
        const wasPlaying = !audioPlayer.paused;
        loadTrack(idx, wasPlaying);
        playlistPanel?.classList.remove('open');
      });
      playlistItems.appendChild(item);
    });
  }

  /* ── Carregar faixa ── */
  function loadTrack(index, autoPlay = false) {
    if (index < 0) index = TRACKS.length - 1;
    if (index >= TRACKS.length) index = 0;
    currentTrackIndex         = index;
    window._currentTrackIndex = index;
    audioPlayer.src           = TRACKS[index].src;
    audioPlayer.load();
    updateTrackDisplay();
    if (autoPlay) {
      audioPlayer.play()
        .then(() => setPlayingState(true))
        .catch(() => setPlayingState(false));
    } else {
      setPlayingState(false);
    }
  }

  /* ── Fade in / out ── */
  function playWithFade(targetVol = 0.5) {
    audioPlayer.volume = 0;
    audioPlayer.play().then(() => {
      setPlayingState(true);
      let vol = 0;
      const step = targetVol / (80 / 20);
      fadeInterval = setInterval(() => {
        vol = Math.min(vol + step, targetVol);
        audioPlayer.volume = vol;
        syncVolumeUI(vol);
        if (vol >= targetVol) { clearInterval(fadeInterval); fadeInterval = null; }
      }, 20);
    }).catch(err => console.warn('Autoplay bloqueado:', err));
  }

  function pauseWithFade() {
    if (!audioPlayer || audioPlayer.paused) return;
    const startVol = audioPlayer.volume;
    let vol = startVol;
    fadeInterval = setInterval(() => {
      vol = Math.max(vol - 0.05, 0);
      audioPlayer.volume = vol;
      syncVolumeUI(vol);
      if (vol <= 0) {
        clearInterval(fadeInterval); fadeInterval = null;
        audioPlayer.pause();
        setPlayingState(false);
        audioPlayer.volume = startVol;
        syncVolumeUI(startVol);
      }
    }, 30);
  }

  function togglePlayPause() {
    if (audioPlayer.paused) playWithFade(lastVolume || 0.5);
    else pauseWithFade();
  }

  /* ── Minimizar / expandir ── */
  function isMobile() { return window.innerWidth <= 768; }

  function minimize() {
    isMinimized = true;
    playlistPanel?.classList.remove('open');
    audioControl.classList.add('minimized');
    setTimeout(() => {
      audioControl.style.pointerEvents = 'none';
      audioPill?.classList.add('visible');
    }, 200);
  }

  function expand() {
    isMinimized = false;
    audioPill?.classList.remove('visible');
    setTimeout(() => {
      audioControl.classList.remove('minimized');
      audioControl.style.pointerEvents = '';
    }, 100);
  }

  if (audioMinimizeBtn) audioMinimizeBtn.addEventListener('click', minimize);
  if (audioPill)        audioPill.addEventListener('click', expand);

  /* ── Eventos de controle ── */
  if (playPauseBtn)     playPauseBtn.addEventListener('click', togglePlayPause);
  if (prevTrackBtn)     prevTrackBtn.addEventListener('click', () => loadTrack(currentTrackIndex - 1, !audioPlayer.paused));
  if (nextTrackBtn)     nextTrackBtn.addEventListener('click', () => loadTrack(currentTrackIndex + 1, !audioPlayer.paused));

  if (playlistToggleBtn) {
    playlistToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playlistPanel?.classList.toggle('open');
    });
  }

  document.addEventListener('click', (e) => {
    if (!playlistPanel || !playlistToggleBtn) return;
    if (!playlistPanel.contains(e.target) && e.target !== playlistToggleBtn) {
      playlistPanel.classList.remove('open');
    }
  });

  audioPlayer.addEventListener('ended', () => loadTrack(currentTrackIndex + 1, true));

  /* ── PERSISTÊNCIA: salva estado ao sair da página ── */
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem(KEY_PLAYING, (!audioPlayer.paused).toString());
    sessionStorage.setItem(KEY_TRACK,   String(currentTrackIndex));
    sessionStorage.setItem(KEY_TIME,    String(audioPlayer.currentTime));
    sessionStorage.setItem(KEY_VOLUME,  String(audioPlayer.volume > 0 ? audioPlayer.volume : lastVolume));
  });

  /* ── PERSISTÊNCIA: restaura ao voltar (pageshow cobre bfcache) ── */
  window.addEventListener('pageshow', () => {
    const wasPlaying  = sessionStorage.getItem(KEY_PLAYING) === 'true';
    const trackIdx    = parseInt(sessionStorage.getItem(KEY_TRACK)   ?? '0', 10);
    const savedTime   = parseFloat(sessionStorage.getItem(KEY_TIME)  ?? '0');
    const savedVolume = parseFloat(sessionStorage.getItem(KEY_VOLUME) ?? '0.5');

    /* Limpa imediatamente para não reutilizar em reload manual */
    sessionStorage.removeItem(KEY_PLAYING);
    sessionStorage.removeItem(KEY_TRACK);
    sessionStorage.removeItem(KEY_TIME);
    sessionStorage.removeItem(KEY_VOLUME);

    if (!wasPlaying) return;

    /* Garante que a intro não bloqueie — só retoma se o site já está visível */
    const tryResume = () => {
      currentTrackIndex         = trackIdx;
      window._currentTrackIndex = trackIdx;
      audioPlayer.volume        = savedVolume;
      lastVolume                = savedVolume;
      syncVolumeUI(savedVolume);
      audioPlayer.src           = TRACKS[trackIdx].src;
      audioPlayer.load();
      updateTrackDisplay();

      audioPlayer.addEventListener('canplay', function resume() {
        audioPlayer.removeEventListener('canplay', resume);
        audioPlayer.currentTime = savedTime;
        audioPlayer.play()
          .then(() => {
            setPlayingState(true);
            if (audioControl) audioControl.classList.add('visible');
          })
          .catch(() => {});
      }, { once: true });
    };

    /* Se o site já está visível (voltou de profissional.html), retoma de imediato */
    if (document.getElementById('siteWrapper')?.classList.contains('visible')) {
      tryResume();
    } else {
      /* Aguarda o botão Enter ser clicado */
      const origReveal = window.playerAPI?.startWithFade;
      window._pendingResume = tryResume;
    }
  });

  /* ── VISIBILIDADE: pausa ao trocar de aba; retoma ao voltar ── */
  let wasPlayingBeforeHide = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      wasPlayingBeforeHide = !audioPlayer.paused;
      if (wasPlayingBeforeHide) audioPlayer.pause();
    } else {
      if (wasPlayingBeforeHide) audioPlayer.play().catch(() => {});
    }
  });

  /* ── Init ── */
  audioPlayer.volume = lastVolume;
  syncVolumeUI(lastVolume);
  loadTrack(0, false);

  /* ── API pública ── */
  window.playerAPI = {
    startWithFade: () => {
      /* Se há retomada pendente de outra página, executa ela */
      if (window._pendingResume) {
        const fn = window._pendingResume;
        window._pendingResume = null;
        fn();
      } else if (audioPlayer.paused) {
        playWithFade(lastVolume || 0.5);
      }
    },
    stop: () => pauseWithFade()
  };

})();

/* =====================================================================
   17. INIT FINAL
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  loadCarouselImages();
  setupCarouselEvents();
  console.log('%cYURIVERSE%c — Welcome to the Universe',
    'color:#ff0000;font-family:monospace;font-size:20px;font-weight:bold;',
    'color:#fff;font-family:monospace;font-size:12px;'
  );
});