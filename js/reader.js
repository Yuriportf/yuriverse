/**
 * YURIVERSE — Leitor de Light Novel (reader.js)
 * Depende do objeto global CORACAO_DIGITAL
 */
(function() {
  let overlay, containerBody, chapNumSpan, chapTitleSpan, prevBtn, nextBtn;
  let currentChapterIndex = 0;
  let chapters = [];

  function init() {
    overlay = document.getElementById('pageReaderOverlay');
    if (!overlay) return;

    containerBody = document.getElementById('readerBody');
    chapNumSpan = document.getElementById('readerChapNum');
    chapTitleSpan = document.getElementById('readerChapTitle');
    prevBtn = document.getElementById('readerPrevBtn');
    nextBtn = document.getElementById('readerNextBtn');

    const closeBtn = document.getElementById('readerCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeReader);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) closeReader();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => navigateChapter(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateChapter(1));

    // Carrega capítulos disponíveis
    if (window.CORACAO_DIGITAL && window.CORACAO_DIGITAL.capitulos) {
      chapters = window.CORACAO_DIGITAL.capitulos.filter(cap => cap.status === 'disponivel');
    } else {
      console.warn('CORACAO_DIGITAL não encontrado. Verifique se coracao-digital.js foi carregado.');
    }
  }

  window.openChapterReader = function(chapterIndex) {
    if (!chapters.length || !overlay) return;
    // chapterIndex é o índice no array completo (CORACAO_DIGITAL.capitulos)
    // Precisamos encontrar o índice correspondente no array filtrado 'chapters'
    const fullChapters = window.CORACAO_DIGITAL.capitulos;
    const targetChapter = fullChapters[chapterIndex];
    if (!targetChapter || targetChapter.status !== 'disponivel') return;

    const idxInAvailable = chapters.findIndex(c => c.num === targetChapter.num);
    if (idxInAvailable === -1) return;

    currentChapterIndex = idxInAvailable;
    renderCurrentChapter();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeReader() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateChapter(delta) {
    const newIndex = currentChapterIndex + delta;
    if (newIndex >= 0 && newIndex < chapters.length) {
      currentChapterIndex = newIndex;
      renderCurrentChapter();
      if (containerBody) containerBody.scrollTop = 0;
    }
  }

  function renderCurrentChapter() {
    if (!chapters.length) return;
    const chapter = chapters[currentChapterIndex];
    if (!chapter) return;

    if (chapNumSpan) chapNumSpan.textContent = `CAP. ${chapter.num}`;
    if (chapTitleSpan) chapTitleSpan.textContent = chapter.titulo;

    if (containerBody) {
      containerBody.innerHTML = '';
      if (chapter.cenas && chapter.cenas.length) {
        chapter.cenas.forEach(bloco => {
          const el = renderBloco(bloco);
          if (el) containerBody.appendChild(el);
        });
      } else {
        containerBody.innerHTML = '<p style="text-align:center">✨ Capítulo em breve... ✨</p>';
      }
    }

    if (prevBtn) {
      if (currentChapterIndex === 0) prevBtn.classList.add('disabled');
      else prevBtn.classList.remove('disabled');
    }
    if (nextBtn) {
      if (currentChapterIndex === chapters.length - 1) nextBtn.classList.add('disabled');
      else nextBtn.classList.remove('disabled');
    }
  }

  function renderBloco(bloco) {
    switch (bloco.type) {
      case 'p':
        const p = document.createElement('p');
        p.textContent = bloco.text;
        return p;
      case 'dialogo':
        const div = document.createElement('div');
        div.className = 'reader-dialogo';
        const nome = document.createElement('span');
        nome.className = 'personagem';
        nome.textContent = bloco.personagem + ':';
        const fala = document.createElement('span');
        fala.className = 'fala';
        fala.textContent = ' ' + bloco.text;
        div.appendChild(nome);
        div.appendChild(fala);
        return div;
      case 'pensamento':
        const pens = document.createElement('div');
        pens.className = 'reader-pensamento';
        pens.textContent = bloco.text;
        return pens;
      case 'loc':
        const loc = document.createElement('div');
        loc.className = 'reader-loc';
        loc.textContent = bloco.text;
        return loc;
      case 'subtitulo':
        const sub = document.createElement('div');
        sub.className = 'reader-subtitulo';
        sub.textContent = bloco.text;
        return sub;
      case 'suspense':
        const susp = document.createElement('div');
        susp.className = 'reader-suspense';
        susp.textContent = bloco.text;
        return susp;
      case 'separador':
        const sep = document.createElement('div');
        sep.className = 'reader-separador';
        sep.textContent = '— ✦ —';
        return sep;
      case 'gap':
        const gap = document.createElement('div');
        gap.className = 'reader-gap';
        return gap;
      default:
        return null;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();