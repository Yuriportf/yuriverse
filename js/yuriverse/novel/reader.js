// reader.js – leitor com suporte a múltiplos idiomas e controles de música
import { $ } from '../../shared/dom.js';
import { renderBloco } from './chapterRenderer.js';

let overlay, containerBody, chapNumSpan, chapTitleSpan, prevBtn, nextBtn;
let currentChapterIndex = 0;
let fullChapters = [];
let chapters = [];
let currentLang = 'pt';

const SUPPORTED_LANGS = [
  { code: 'pt', name: 'Português' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'fr', name: 'Français' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' }
];

export async function initReader() {
  overlay = $('pageReaderOverlay');
  if (!overlay) return;

  currentLang = localStorage.getItem('yuri_novel_lang') || 'pt';
  await loadNovelData(currentLang);

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

  createLangSelector();
  createMusicControls(); // integração com o player
  console.log('[reader] Inicializado');
}

function normalizeScene(scene) {
  return {
    type: scene.type || scene.tipo,
    text: scene.text || scene.conteudo,
    character: scene.character || scene.personagem
  };
}

function normalizeChapter(chapter) {
  const num = chapter.num || chapter.number;
  const titulo = chapter.titulo || chapter.title;
  const status = chapter.status === 'available' ? 'disponivel' : (chapter.status || 'disponivel');
  const rawScenes = chapter.cenas || chapter.scenes || [];
  const scenes = rawScenes.map(normalizeScene);
  return { num, titulo, status, cenas: scenes };
}

async function loadNovelData(lang) {
  try {
    const response = await fetch(`/data/coracao/coracao-digital-${lang}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error('JSON inválido');
    }

    let rawChapters = data.capitulos || data.chapters;
    if (!rawChapters || !Array.isArray(rawChapters) || rawChapters.length === 0) {
      throw new Error('Nenhum capítulo encontrado');
    }

    fullChapters = rawChapters.map(ch => normalizeChapter(ch));
    chapters = fullChapters.filter(c => c.status === 'disponivel');
    console.log(`✅ Novel carregada: ${lang} – ${chapters.length} capítulos disponíveis`);
    window.fullChaptersList = fullChapters;
    return true;
  } catch (err) {
    console.warn(`⚠️ Falha ao carregar ${lang}:`, err.message);
    if (lang !== 'pt') {
      const ptOk = await loadNovelData('pt');
      if (ptOk) {
        currentLang = 'pt';
        localStorage.setItem('yuri_novel_lang', 'pt');
        showToast('📖 Idioma indisponível. Exibindo português.', 3000);
        return true;
      }
    }
    fullChapters = [{
      num: 1,
      titulo: "🔧 Manutenção",
      status: "disponivel",
      cenas: [{ type: "descricao", text: "Conteúdo em manutenção. Tente novamente mais tarde." }]
    }];
    chapters = fullChapters;
    showToast('🔧 Biblioteca em manutenção – arquivos JSON não encontrados', 5000);
    return false;
  }
}

function createLangSelector() {
  let nav = $('#readerNav');
  if (!nav) {
    nav = document.querySelector('.reader-nav');
    if (!nav) {
      console.warn('[reader] Nenhum elemento #readerNav ou .reader-nav encontrado');
      return;
    }
  }
  if ($('#readerLangSelector')) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'readerLangSelector';
  wrapper.className = 'reader-lang-selector';
  wrapper.innerHTML = `
    <button class="reader-lang-btn">🌐 ${currentLang.toUpperCase()}</button>
    <ul class="reader-lang-dropdown">
      ${SUPPORTED_LANGS.map(l => `<li data-lang="${l.code}">${l.name}</li>`).join('')}
    </ul>
  `;

  const settingsDiv = nav.querySelector('.reader-settings');
  const nextButton = $('#readerNextBtn');
  if (settingsDiv && nextButton) {
    nav.insertBefore(wrapper, nextButton);
  } else {
    nav.appendChild(wrapper);
  }

  const btn = wrapper.querySelector('.reader-lang-btn');
  const dropdown = wrapper.querySelector('.reader-lang-dropdown');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const settingsPanel = document.getElementById('readerSettingsPanel');
    if (settingsPanel) settingsPanel.style.display = 'none';
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });

  dropdown.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', async (e) => {
      e.stopPropagation();
      const newLang = li.dataset.lang;
      if (newLang === currentLang) {
        dropdown.style.display = 'none';
        return;
      }
      const previousLang = currentLang;
      const previousBtnText = btn.textContent;
      const previousChapters = [...chapters];
      const previousIndex = currentChapterIndex;
      const success = await loadNovelData(newLang);
      if (success) {
        currentLang = newLang;
        localStorage.setItem('yuri_novel_lang', newLang);
        btn.textContent = `🌐 ${newLang.toUpperCase()}`;
        const currentChapterNum = chapters[currentChapterIndex]?.num;
        if (currentChapterNum) {
          const newIndex = chapters.findIndex(c => c.num === currentChapterNum);
          currentChapterIndex = newIndex !== -1 ? newIndex : 0;
        } else {
          currentChapterIndex = 0;
        }
        renderCurrentChapter();
      } else {
        showToast('📖 This language is under maintenance. Please try again later.', 4000);
        currentLang = previousLang;
        btn.textContent = previousBtnText;
        localStorage.setItem('yuri_novel_lang', previousLang);
        chapters = previousChapters;
        currentChapterIndex = previousIndex;
        fullChapters = window.fullChaptersList || fullChapters;
        renderCurrentChapter();
      }
      dropdown.style.display = 'none';
    });
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) dropdown.style.display = 'none';
  });
}

// ==================== CONTROLES DE MÚSICA ====================
function createMusicControls() {
  const nav = $('#readerNav') || document.querySelector('.reader-nav');
  if (!nav) {
    console.warn('[reader] Navegação não encontrada para inserir controles de música');
    return;
  }
  if ($('#readerMusicControls')) return;

  // Aguarda a API do player estar disponível
  let attempts = 0;
  function initControls() {
    if (window.playerAPI && typeof window.playerAPI.togglePlayPause === 'function') {
      buildControls();
    } else if (attempts < 30) {
      attempts++;
      setTimeout(initControls, 100);
    } else {
      console.warn('[reader] API do player não encontrada, controles de música não serão criados');
    }
  }

  function buildControls() {
    const musicDiv = document.createElement('div');
    musicDiv.id = 'readerMusicControls';
    musicDiv.className = 'reader-music-controls';
    musicDiv.innerHTML = `
      <button class="music-prev" title="Anterior">⏮</button>
      <button class="music-playpause" title="Play/Pause">▶</button>
      <button class="music-next" title="Próximo">⏭</button>
      <span class="music-track-name">Carregando...</span>
    `;

    const langSelector = $('#readerLangSelector');
    if (langSelector) {
      nav.insertBefore(musicDiv, langSelector);
    } else {
      nav.appendChild(musicDiv);
    }

    const playPauseBtn = musicDiv.querySelector('.music-playpause');
    const prevBtnCtrl = musicDiv.querySelector('.music-prev');
    const nextBtnCtrl = musicDiv.querySelector('.music-next');
    const trackNameSpan = musicDiv.querySelector('.music-track-name');

    function updateUI() {
      if (!window.playerAPI) return;
      const track = window.playerAPI.getCurrentTrack ? window.playerAPI.getCurrentTrack() : null;
      trackNameSpan.textContent = track?.title || '--';
      const isPlaying = window.playerAPI.isPlaying ? window.playerAPI.isPlaying() : false;
      playPauseBtn.textContent = isPlaying ? '⏸' : '▶';
    }

    playPauseBtn.addEventListener('click', () => {
      window.playerAPI.togglePlayPause?.();
      setTimeout(updateUI, 50);
    });
    prevBtnCtrl.addEventListener('click', () => {
      window.playerAPI.prev?.();
      setTimeout(updateUI, 100);
    });
    nextBtnCtrl.addEventListener('click', () => {
      window.playerAPI.next?.();
      setTimeout(updateUI, 100);
    });

    setInterval(updateUI, 500);
    updateUI();
  }

  initControls();
}

// ==================== RENDERIZAÇÃO ====================
export function openChapterReader(chapterIndex) {
  if (!overlay) return;
  if (!chapters.length) {
    renderMaintenanceMessage();
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
  if (!ch) {
    renderMaintenanceMessage();
    return;
  }
  if (chapNumSpan) chapNumSpan.textContent = `CAP. ${ch.num}`;
  if (chapTitleSpan) chapTitleSpan.textContent = ch.titulo;
  if (containerBody) {
    containerBody.innerHTML = '';
    if (ch.cenas && ch.cenas.length > 0) {
      ch.cenas.forEach(bloco => {
        const el = renderBloco(bloco);
        if (el) containerBody.appendChild(el);
      });
    } else {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'reader-maintenance-message';
      msgDiv.style.cssText = 'text-align:center;padding:3rem;color:var(--ghost)';
      msgDiv.innerHTML = '<p>✨ Chapter under maintenance ✨</p><p style="font-size:0.8rem;margin-top:1rem">This chapter is being updated. Please come back soon.</p>';
      containerBody.appendChild(msgDiv);
    }
  }
  if (prevBtn) prevBtn.classList.toggle('disabled', currentChapterIndex === 0);
  if (nextBtn) nextBtn.classList.toggle('disabled', currentChapterIndex === chapters.length - 1);
  if (window.applyReaderStyles) window.applyReaderStyles();
}

function renderMaintenanceMessage() {
  if (chapNumSpan) chapNumSpan.textContent = 'CAP. --';
  if (chapTitleSpan) chapTitleSpan.textContent = 'Under Maintenance';
  if (containerBody) {
    containerBody.innerHTML = `
      <div class="reader-maintenance-card" style="text-align:center;padding:3rem;background:var(--void-panel);border-radius:12px;margin:2rem;border:1px solid var(--stripe-2)">
        <p>🔧 Library under maintenance</p>
        <p style="font-size:0.8rem;margin-top:1rem">We are preparing new chapters and translations.<br>Please check back soon!</p>
      </div>
    `;
  }
  if (prevBtn) prevBtn.classList.add('disabled');
  if (nextBtn) nextBtn.classList.add('disabled');
  if (window.applyReaderStyles) window.applyReaderStyles();
}

function showToast(msg, duration = 3000) {
  const existing = document.querySelector('.reader-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'reader-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}