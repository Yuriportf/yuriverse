// carouselGallery.js – carrossel de fotos da galeria
'use strict';

export function initCarouselGallery() {
  const track        = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');

  if (!track)         { console.error('[carouselGallery] #carouselTrack não encontrado');  return; }
  if (!dotsContainer) { console.error('[carouselGallery] #carouselDots não encontrado');   return; }

  const images = [
    'assets/imagens/carrossel/galera.jpeg',
    'assets/imagens/carrossel/saopaulo.jpeg',
    'assets/imagens/carrossel/vista.jpeg',
    'assets/imagens/carrossel/coisas.jpeg',
    'assets/imagens/carrossel/leque.jpeg',
    'assets/imagens/carrossel/homi.jpeg',
    'assets/imagens/carrossel/lesao.jpeg',
  ];

  const GAP = 20;
  let currentIndex = 0;
  let autoTimer    = null;

  // Monta os slides
  track.innerHTML = images.map((src, idx) => `
    <div class="carousel-slide">
      <img src="${src}" alt="Foto ${idx + 1}" loading="lazy">
      <div class="slide-overlay"></div>
    </div>
  `).join('');

  let slides = track.querySelectorAll('.carousel-slide');

  // ── helpers ───────────────────────────────────────────────────────────────
  function getSlidesPerView() {
    const w = window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 768)  return 2;
    return 1;
  }

  function getMaxIndex() {
    return Math.max(0, slides.length - getSlidesPerView());
  }

  function applyTransform() {
    if (!slides.length) return;
    const slideWidth = slides[0].offsetWidth;
    track.style.transform = `translateX(-${currentIndex * (slideWidth + GAP)}px)`;
    updateButtons();
  }

  function updateButtons() {
    const maxIdx     = getMaxIndex();
    const disablePrev = currentIndex <= 0;
    const disableNext = currentIndex >= maxIdx;
    ['carouselPrev', 'carouselPrevMobile'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.disabled = disablePrev;
    });
    ['carouselNext', 'carouselNextMobile'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.disabled = disableNext;
    });
  }

  function renderDots(activeIndex) {
    dotsContainer.innerHTML = '';
    images.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'carousel-dot' + (i === activeIndex ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
    applyTransform();
    renderDots(currentIndex);
    startAuto();            // reinicia o timer
  }

  function next() {
    goToSlide(currentIndex < getMaxIndex() ? currentIndex + 1 : 0);
  }

  function startAuto() {
    if (autoTimer) clearInterval(autoTimer);
    if (slides.length <= getSlidesPerView()) return;
    autoTimer = setInterval(() => {
      goToSlide(currentIndex < getMaxIndex() ? currentIndex + 1 : 0);
    }, 5000);
  }

  // ── eventos ───────────────────────────────────────────────────────────────
  document.getElementById('carouselPrev')?.addEventListener('click', () => goToSlide(currentIndex - 1));
  document.getElementById('carouselNext')?.addEventListener('click', next);
  document.getElementById('carouselPrevMobile')?.addEventListener('click', () => goToSlide(currentIndex - 1));
  document.getElementById('carouselNextMobile')?.addEventListener('click', next);

  window.addEventListener('resize', () => {
    slides = track.querySelectorAll('.carousel-slide');
    applyTransform();
    renderDots(currentIndex);
  });

  // ── init ──────────────────────────────────────────────────────────────────
  renderDots(0);
  applyTransform();
  startAuto();

  console.log(`[carouselGallery] ${images.length} imagens carregadas`);
}