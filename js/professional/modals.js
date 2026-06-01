// modals.js – abertura/fechamento de modais
'use strict';

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) { console.warn(`[modals] #${modalId} não encontrado`); return; }
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('active');
  // Só restaura o scroll se não houver outros modais abertos
  if (!document.querySelector('.modal-overlay.active')) {
    document.body.style.overflow = '';
  }
}

// Fecha ao clicar no overlay (fora do conteúdo)
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('active')) {
    const id = e.target.id;
    if (id) closeModal(id);
    else {
      e.target.classList.remove('active');
      if (!document.querySelector('.modal-overlay.active')) {
        document.body.style.overflow = '';
      }
    }
  }
});

// Fecha com Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active');
    });
    if (!document.querySelector('.modal-overlay.active')) {
      document.body.style.overflow = '';
    }
  }
});