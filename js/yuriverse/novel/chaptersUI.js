// chaptersUI.js
import { $ } from '../../shared/dom.js';
import { openChapterReader } from './reader.js';

// Função para renderizar os capítulos na página inicial (primeiros 6)
export function renderChapters() {
  const grid = $('chaptersGrid');
  if (!grid) return;
  if (!window.fullChaptersList || !window.fullChaptersList.length) {
    console.warn('[chaptersUI] Aguardando fullChaptersList...');
    setTimeout(() => renderChapters(), 500);
    return;
  }

  const available = window.fullChaptersList.filter(c => c.status === 'disponivel');
  const visible = available.slice(0, 6);
  grid.innerHTML = '';

  visible.forEach((ch) => {
    const isNew = (ch.num === '01');
    const card = document.createElement('div');
    card.className = 'chapter-card';
    card.innerHTML = `
      ${isNew ? '<span class="chapter-new-badge">NOVO</span>' : ''}
      <div class="chapter-number">CAP. ${ch.num}</div>
      <div class="chapter-title">${ch.titulo}</div>
      <div class="chapter-status">● Disponível</div>
      <button class="chapter-read-btn">LEIA MAIS <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
    `;
    const btn = card.querySelector('.chapter-read-btn');
    const originalIndex = window.fullChaptersList.findIndex(c => c.num === ch.num);
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openChapterReader(originalIndex);
    });
    grid.appendChild(card);
  });

  const remaining = available.length - 6;
  const continueWrapper = document.createElement('div');
  continueWrapper.style.cssText = 'display:flex;justify-content:center;margin-top:8px;';
  const btn = document.createElement('button');
  btn.className = 'chapters-continue-btn';
  btn.innerHTML = `<span>CONTINUE LENDO</span>${remaining > 0 ? `<span class="chapters-continue-count">+${remaining} em breve</span>` : ''}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openMural();
  });

  continueWrapper.appendChild(btn);
  const chaptersBlock = grid.closest('.chapters-block') || grid.parentElement;
  if (chaptersBlock) chaptersBlock.appendChild(continueWrapper);
}

// Função para renderizar o mural (todos os capítulos)
function renderMuralGrid() {
  const grid = document.getElementById('muralGrid');
  if (!grid) {
    console.warn('[mural] grid não encontrado');
    return;
  }
  if (!window.fullChaptersList || !window.fullChaptersList.length) {
    grid.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--ghost-deep);">Carregando capítulos...</div>';
    setTimeout(renderMuralGrid, 500);
    return;
  }
  grid.innerHTML = '';
  window.fullChaptersList.forEach((ch, idx) => {
    const isAvail = ch.status === 'disponivel';
    const card = document.createElement('div');
    card.className = 'mural-card';
    card.innerHTML = `
      <div class="mural-card-num">CAP. ${ch.num}</div>
      <div class="mural-card-title">${ch.titulo}</div>
      <div class="mural-card-status ${isAvail ? 'available' : 'soon'}">
        ${isAvail ? '● Disponível' : '○ Em breve'}
      </div>
    `;
    if (isAvail) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        closeMural();
        openChapterReader(idx);
      });
    }
    grid.appendChild(card);
  });
  console.log(`[mural] Renderizados ${window.fullChaptersList.length} capítulos`);
}

// Abrir o mural
function openMural() {
  const overlay = document.getElementById('muralOverlay');
  if (!overlay) {
    console.error('[mural] overlay não encontrado');
    return;
  }
  // Tenta renderizar imediatamente; se não tiver dados, o renderMuralGrid tentará novamente
  renderMuralGrid();
  document.body.style.overflow = 'hidden';
  overlay.classList.add('open');
}

// Fechar o mural
function closeMural() {
  const overlay = document.getElementById('muralOverlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Expor funções globalmente para uso em outros scripts (ex: onclick)
window.openMural = openMural;
window.closeMural = closeMural;

// Inicializa eventos do modal quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('muralModalClose');
  if (closeBtn) closeBtn.addEventListener('click', closeMural);
  const muralOverlay = document.getElementById('muralOverlay');
  if (muralOverlay) {
    muralOverlay.addEventListener('click', (e) => {
      if (e.target === muralOverlay) closeMural();
    });
  }
});