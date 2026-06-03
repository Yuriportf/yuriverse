import { $ } from '../../shared/dom.js';
import { openChapterReader } from './reader.js';
import { openMural } from './mural.js';   // <-- importe a função do mural

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

  // AGORA chama openMural() em vez de openLastChapter()
  btn.addEventListener('click', () => openMural());

  continueWrapper.appendChild(btn);
  const chaptersBlock = grid.closest('.chapters-block') || grid.parentElement;
  if (chaptersBlock) chaptersBlock.appendChild(continueWrapper);
}

// chapterRenderer.js – renderiza blocos de cena para o leitor de novel
'use strict';

/**
 * Recebe um objeto `bloco` e retorna um elemento DOM correspondente.
 * Retorna `null` para tipos desconhecidos.
 *
 * @param {{ type: string, text?: string, personagem?: string, character?: string, conteudo?: string }} bloco
 * @returns {HTMLElement|null}
 */
export function renderBloco(bloco) {
  if (!bloco || !bloco.type) return null;

  switch (bloco.type) {
    case 'p':
    case 'descricao': {
      const el = document.createElement('p');
      el.textContent = bloco.text ?? bloco.conteudo ?? '';
      return el;
    }
    case 'dialogo': {
      const div = document.createElement('div');
      div.className = 'reader-dialogo';
      const nome = document.createElement('span');
      nome.className = 'personagem';
      nome.textContent = (bloco.personagem ?? bloco.character ?? '') + ':';
      const fala = document.createElement('span');
      fala.className = 'fala';
      fala.textContent = ' ' + (bloco.text ?? bloco.conteudo ?? '');
      div.appendChild(nome);
      div.appendChild(fala);
      return div;
    }
    case 'pensamento': {
      const el = document.createElement('div');
      el.className = 'reader-pensamento';
      el.textContent = bloco.text ?? bloco.conteudo ?? '';
      return el;
    }
    case 'loc': {
      const el = document.createElement('div');
      el.className = 'reader-loc';
      el.textContent = bloco.text ?? bloco.conteudo ?? '';
      return el;
    }
    case 'subtitulo': {
      const el = document.createElement('div');
      el.className = 'reader-subtitulo';
      el.textContent = bloco.text ?? bloco.conteudo ?? '';
      return el;
    }
    case 'suspense': {
      const el = document.createElement('div');
      el.className = 'reader-suspense';
      el.textContent = bloco.text ?? bloco.conteudo ?? '';
      return el;
    }
    case 'separador': {
      const el = document.createElement('div');
      el.className = 'reader-separador';
      el.innerHTML = '— ✦ —';
      return el;
    }
    case 'gap': {
      const el = document.createElement('div');
      el.className = 'reader-gap';
      return el;
    }
    default:
      console.warn(`[chapterRenderer] Tipo de bloco desconhecido: "${bloco.type}"`);
      return null;
  }
}

