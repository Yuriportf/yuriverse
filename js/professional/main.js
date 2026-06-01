// main.js - Site profissional (com menu mobile, estrelas, carrossel, etc.)
import { initStarsCanvas } from './starsCanvas.js';
import { openModal, closeModal } from './modals.js';
import { initLibrary } from './library.js';
import { initScrollProgress, initBackToTop, initScrollReveal } from '../shared/scrollEffects.js';
import { Carousel } from '../shared/carousel.js';

// Função de scroll suave para as âncoras
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const offset = 80;
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
window.scrollToSection = scrollToSection;

// Função para voltar ao topo (usada no logo)
window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

document.addEventListener('DOMContentLoaded', () => {
  // 1. Canvas com estrelas
  initStarsCanvas();

  // 2. Efeito de digitação no herói
  const rotatingWordEl = document.getElementById('rotating-word');
  if (rotatingWordEl) {
    const words = ['desenvolvedor', 'criativo', 'aprendiz', 'entusiasta de tecnologia'];
    let wi = 0, ci = 0, deleting = false;
    const TTYPE = 120, TDEL = 55, PAUSE = 1600;
    function type() {
      const w = words[wi];
      if (!deleting) {
        rotatingWordEl.textContent = w.substring(0, ci + 1);
        ci++;
        if (ci === w.length) {
          deleting = true;
          setTimeout(type, PAUSE);
          return;
        }
      } else {
        rotatingWordEl.textContent = w.substring(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
        }
      }
      setTimeout(type, deleting ? TDEL : TTYPE);
    }
    type();
  }

  // 3. Biblioteca (carrega JSON e configura botão)
  initLibrary().catch(err => console.warn('Erro ao iniciar biblioteca:', err));

  // 4. Efeitos de scroll
  initScrollProgress('scroll-progress');
  initBackToTop('back-to-top');
  initScrollReveal('.reveal-section');

  // 5. Carrossel de eventos
  const carouselTrack = document.querySelector('.carousel-track');
  if (carouselTrack) {
    const updateSlidesPerView = () => {
      const w = window.innerWidth;
      if (w <= 480) return 1;
      if (w <= 768) return 2;
      return 3;
    };
    let carousel;
    const updateCarouselDots = (index) => {
      const dotsContainer = document.getElementById('carouselDots');
      if (!dotsContainer || !carousel) return;
      const totalPages = Math.ceil(carousel.slides.length / carousel.slidesPerView);
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === index ? ' active' : '');
        dot.addEventListener('click', () => carousel.goTo(i));
        dotsContainer.appendChild(dot);
      }
    };
    carousel = new Carousel('.carousel-track', {
      auto: false,
      gap: 16,
      slidesPerView: updateSlidesPerView(),
      onChange: (index) => updateCarouselDots(index)
    });
    updateCarouselDots(0);
    window.addEventListener('resize', () => {
      const newSpv = updateSlidesPerView();
      carousel.slidesPerView = newSpv;
      carousel.updateDimensions();
      updateCarouselDots(carousel.current);
    });
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    if (prevBtn) prevBtn.addEventListener('click', () => carousel.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => carousel.next());
  } else {
    console.warn('Carrossel não encontrado');
  }

  // 6. MENU MOBILE – CORRIGIDO (usando o ID correto do seu HTML: header-nav)
  const mobileToggle = document.getElementById('mobileToggle');
  const headerNav = document.getElementById('header-nav');   // ← ID correto com hífen
  if (mobileToggle && headerNav) {
    mobileToggle.addEventListener('click', () => {
      headerNav.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      document.body.style.overflow = headerNav.classList.contains('open') ? 'hidden' : '';
    });
    // Fecha o menu ao clicar em um link
    document.querySelectorAll('.header-nav .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        headerNav.classList.remove('open');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  } else {
    console.warn('Menu mobile: elementos #mobileToggle ou #header-nav não encontrados');
  }

  // 7. Header scroll class
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // 8. Funções globais para os modais
  window.openModal = openModal;
  window.closeModal = closeModal;
});