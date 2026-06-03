// mural.js
import { $ } from '../../shared/dom.js';
import { openChapterReader } from './reader.js';

export function openMural() {
  const overlay = $('muralOverlay');
  if (!overlay) return;
  renderMuralGrid();
  document.body.style.overflow = 'hidden';
  overlay.classList.add('open');
}

export function closeMural() {
  const overlay = $('muralOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function renderMuralGrid() {
  const grid = $('muralGrid');
  if (!grid) return;
  grid.innerHTML = '';
  if (!window.fullChaptersList) return;
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
}