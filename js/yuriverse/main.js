// main.js – YURIVERSE (sem tradutor)
import { initCarouselGallery } from './carouselGallery.js';
import { initAudioPlayer } from './audioPlayer.js';
import { initReader, openChapterReader, openLastChapter } from './novel/reader.js';
import { renderChapters } from './novel/chaptersUI.js';
import { initPlaylistCarousel } from './playlistCarousel.js';
import { initReaderSettings } from './novel/readerSettings.js';

(function() {
  console.log('🚀 main.js carregado');

  let modulesInitialized = false;

  async function revealSiteAndInit() {
    if (modulesInitialized) return;
    const intro = document.getElementById('introScreen');
    const wrapper = document.getElementById('siteWrapper');
    const audioCtrl = document.getElementById('audioControl');

    if (!intro || !wrapper) return;

    intro.classList.add('fade-out');
    setTimeout(async () => {
      intro.style.display = 'none';
      wrapper.classList.add('visible');
      if (audioCtrl) audioCtrl.classList.add('visible');
      document.body.classList.remove('intro-active');
      document.body.classList.add('site-visible');
      window.scrollTo(0, 0);
      console.log('✅ Site revelado');
      await initModules();
      modulesInitialized = true;

      if (window.playerAPI && typeof window.playerAPI.startImmediately === 'function') {
        window.playerAPI.startImmediately();
        console.log('🎵 Áudio iniciado automaticamente');
      } else if (window.playerAPI && typeof window.playerAPI.play === 'function') {
        window.playerAPI.play();
      }
    }, 800);
  }

  async function initModules() {
    console.log('🔄 Inicializando módulos...');
    try { initCarouselGallery(); } catch(e) { console.warn('Carrossel de fotos:', e); }
    try { await initAudioPlayer(); } catch(e) { console.warn('Player de áudio:', e); }
    try { initPlaylistCarousel(); } catch(e) { console.warn('Carrossel de playlists:', e); }
    try {
      await initReader();
      renderChapters();
      initReaderSettings();
    } catch(e) { console.warn('Leitor / capítulos:', e); }

    window.openChapterReader = openChapterReader;
    window.openLastChapter = openLastChapter;
    window.openMural = () => document.getElementById('muralOverlay')?.classList.add('open');
    window.closeMural = () => document.getElementById('muralOverlay')?.classList.remove('open');

    const toggleNovelIntro = () => {
      const introTextDiv = document.getElementById('novelIntroText');
      const toggleBtnSpan = document.getElementById('toggleIntroText');
      if (introTextDiv && toggleBtnSpan) {
        const isVisible = introTextDiv.style.display !== 'none';
        introTextDiv.style.display = isVisible ? 'none' : 'block';
        toggleBtnSpan.textContent = isVisible ? 'LER INTRODUÇÃO' : 'OCULTAR INTRODUÇÃO';
      }
    };
    window.toggleIntro = toggleNovelIntro;
    const toggleBtn = document.getElementById('toggleIntroBtn');
    if (toggleBtn) {
      toggleBtn.removeEventListener('click', toggleNovelIntro);
      toggleBtn.addEventListener('click', toggleNovelIntro);
    }

    const observer = new IntersectionObserver(e => e.forEach(i => i.isIntersecting && i.target.classList.add('in-view')), { threshold: 0.1 });
    document.querySelectorAll('.reveal-section').forEach(el => observer.observe(el));
    console.log('🎉 Todos os módulos iniciados');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const skip = sessionStorage.getItem('skipIntro') === 'true' || document.referrer.includes('profissional.html');
    if (skip) {
      const intro = document.getElementById('introScreen');
      const wrapper = document.getElementById('siteWrapper');
      const audioCtrl = document.getElementById('audioControl');
      if (intro) intro.style.display = 'none';
      if (wrapper) wrapper.classList.add('visible');
      if (audioCtrl) audioCtrl.classList.add('visible');
      document.body.classList.remove('intro-active');
      document.body.classList.add('site-visible');
      sessionStorage.removeItem('skipIntro');
      initModules().then(() => {
        modulesInitialized = true;
        if (window.playerAPI && typeof window.playerAPI.startImmediately === 'function') {
          window.playerAPI.startImmediately();
          console.log('🎵 Áudio iniciado (modo skip)');
        }
      });
    } else {
      document.body.classList.add('intro-active');
      document.body.classList.remove('site-visible');
      const enterBtn = document.getElementById('enterBtn');
      if (enterBtn) {
        const newBtn = enterBtn.cloneNode(true);
        enterBtn.parentNode.replaceChild(newBtn, enterBtn);
        newBtn.addEventListener('click', (e) => { e.preventDefault(); revealSiteAndInit(); });
        console.log('🔘 Botão ENTER configurado');
      } else {
        console.error('❌ Botão #enterBtn não encontrado');
        setTimeout(revealSiteAndInit, 3000);
      }
    }

    // Scroll progress, back to top, header e menu mobile
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
      window.addEventListener('scroll', () => {
        if (document.getElementById('siteWrapper')?.classList.contains('visible')) {
          const total = document.documentElement.scrollHeight - window.innerHeight;
          progressBar.style.width = total > 0 ? (window.scrollY / total) * 100 + '%' : '0%';
        }
      });
    }
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
      window.addEventListener('scroll', () => {
        if (document.getElementById('siteWrapper')?.classList.contains('visible')) {
          backBtn.classList.toggle('visible', window.scrollY > 400);
        }
      });
      backBtn.addEventListener('click', () => window.scrollTo(0, { behavior: 'smooth' }));
    }
    const mobileToggle = document.getElementById('mobileToggle');
    const headerNav = document.getElementById('headerNav');
    if (mobileToggle && headerNav) {
      mobileToggle.addEventListener('click', () => {
        headerNav.classList.toggle('open');
        mobileToggle.classList.toggle('open');
        document.body.style.overflow = headerNav.classList.contains('open') ? 'hidden' : '';
      });
      document.querySelectorAll('.header-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
          headerNav.classList.remove('open');
          mobileToggle.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }
    const header = document.getElementById('header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (document.getElementById('siteWrapper')?.classList.contains('visible')) {
          header.classList.toggle('scrolled', window.scrollY > 60);
        }
      });
    }
  });
})();