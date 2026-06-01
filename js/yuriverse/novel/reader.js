// reader.js – com fallback para dados mockados caso o fetch falhe
import { $ } from '../../shared/dom.js';
import { renderBloco } from './chapterRenderer.js';

let overlay, containerBody, chapNumSpan, chapTitleSpan, prevBtn, nextBtn;
let currentChapterIndex = 0;
let chapters = [];
let fullChapters = [];

export async function initReader() {
  overlay = $('pageReaderOverlay');
  if (!overlay) return;

  // Tenta carregar o JSON
  try {
    const response = await fetch('./data/coracao-digital.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    fullChapters = data.capitulos;
    console.log('✅ JSON carregado com sucesso');
  } catch (err) {
    console.warn('⚠️ Falha ao carregar JSON, usando dados mockados', err);
    // Dados mockados de fallback
    fullChapters = [
      { num: '00', titulo: 'Prólogo: O Começo Simples', status: 'disponivel', cenas: [{ type: 'p', text: 'Conteúdo em breve...' }] },
      { num: '01', titulo: 'O Pulsar do Código', status: 'disponivel', cenas: [] },
      { num: '02', titulo: 'Frequências do Coração', status: 'em_breve', cenas: [] },
    ];
  }

  window.fullChaptersList = fullChapters;
  chapters = fullChapters.filter(c => c.status === 'disponivel');

  containerBody = $('readerBody');
  chapNumSpan = $('readerChapNum');
  chapTitleSpan = $('readerChapTitle');
  prevBtn = $('readerPrevBtn');
  nextBtn = $('readerNextBtn');

  const closeBtn = $('readerCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeReader);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeReader();
  });
  if (prevBtn) prevBtn.addEventListener('click', () => navigateChapter(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateChapter(1));
}

export function openChapterReader(chapterIndex) {
  if (!overlay) return;
  if (!chapters.length) {
    renderEmptyReader();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    return;
  }
  const target = fullChapters[chapterIndex];
  if (!target || target.status !== 'disponivel') return;
  const idx = chapters.findIndex(c => c.num === target.num);
  if (idx === -1) return;
  currentChapterIndex = idx;
  renderCurrentChapter();
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function openLastChapter() {
  if (!chapters.length) return;
  const last = chapters[chapters.length - 1];
  const idx = fullChapters.findIndex(c => c.num === last.num);
  openChapterReader(idx);
}

function closeReader() {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateChapter(delta) {
  const newIdx = currentChapterIndex + delta;
  if (newIdx >= 0 && newIdx < chapters.length) {
    currentChapterIndex = newIdx;
    renderCurrentChapter();
    if (containerBody) containerBody.scrollTop = 0;
  }
}

function renderCurrentChapter() {
  const ch = chapters[currentChapterIndex];
  if (!ch) return;
  if (chapNumSpan) chapNumSpan.textContent = `CAP. ${ch.num}`;
  if (chapTitleSpan) chapTitleSpan.textContent = ch.titulo;
  if (containerBody) {
    containerBody.innerHTML = '';
    if (ch.cenas && ch.cenas.length) {
      ch.cenas.forEach(bloco => {
        const el = renderBloco(bloco);
        if (el) containerBody.appendChild(el);
      });
    } else {
      containerBody.innerHTML = '<p style="text-align:center">✨ Capítulo em breve... ✨</p>';
    }
  }
  if (prevBtn) prevBtn.classList.toggle('disabled', currentChapterIndex === 0);
  if (nextBtn) nextBtn.classList.toggle('disabled', currentChapterIndex === chapters.length - 1);
  
  // 🔥 Aplica os estilos salvos após renderizar o conteúdo
  if (window.applyReaderStyles && typeof window.applyReaderStyles === 'function') {
    window.applyReaderStyles();
  }
}

function renderEmptyReader() {
  if (containerBody) {
    containerBody.innerHTML = '<div style="text-align:center;padding:3rem;"><p>📖 Conteúdo do capítulo em breve.</p></div>';
  }
  if (chapNumSpan) chapNumSpan.textContent = 'CAP. --';
  if (chapTitleSpan) chapTitleSpan.textContent = 'Em breve';
  
  // 🔥 Também aplica estilos no fallback
  if (window.applyReaderStyles && typeof window.applyReaderStyles === 'function') {
    window.applyReaderStyles();
  }
}