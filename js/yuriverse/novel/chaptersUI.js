import { $ } from '../../shared/dom.js';
import { openChapterReader, openLastChapter } from './reader.js';

export function renderChapters() {
  const grid = $('chaptersGrid');
  if (!grid) return;
  if (!window.fullChaptersList) return;
  const available = window.fullChaptersList.filter(c => c.status === 'disponivel');
  const visible = available.slice(0, 6);

  grid.innerHTML = '';
  visible.forEach((ch, idx) => {
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
  btn.addEventListener('click', () => openLastChapter());
  continueWrapper.appendChild(btn);
  const chaptersBlock = grid.closest('.chapters-block') || grid.parentElement;
  if (chaptersBlock) chaptersBlock.appendChild(continueWrapper);
}   