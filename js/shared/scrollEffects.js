// scrollEffects.js - Efeitos de scroll (scroll progress, back to top, reveal sections)

export function initScrollProgress(barId) {
  const bar = document.getElementById(barId);
  if (!bar) {
    console.warn(`[scrollEffects] Elemento "${barId}" não encontrado`);
    return;
  }
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = `${progress}%`;
  });
}

export function initBackToTop(btnId, threshold = 400) {
  const btn = document.getElementById(btnId);
  if (!btn) {
    console.warn(`[scrollEffects] Elemento "${btnId}" não encontrado`);
    return;
  }
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > threshold);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

export function initScrollReveal(selector = '.reveal-section', options = { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) {
    // Apenas retorna silenciosamente – não é um erro, apenas não há elementos para animar
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, options);
  elements.forEach(el => observer.observe(el));
}