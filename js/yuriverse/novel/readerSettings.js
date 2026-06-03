// readerSettings.js – painel de configurações com prévia ao vivo e select de cores
export function initReaderSettings() {
  const settingsBtn = document.getElementById('readerSettingsBtn');
  const settingsPanel = document.getElementById('readerSettingsPanel');
  if (!settingsBtn || !settingsPanel) return;

  const bgSelect = document.getElementById('readerBgTheme');
  const textColorSelect = document.getElementById('readerTextColor');
  const fontSelect = document.getElementById('readerFontFamily');
  const applyBtn = document.getElementById('applyReaderSettings');
  const resetBtn = document.getElementById('resetReaderSettings');

  const STORAGE_KEYS = {
    bgColor: 'reader_bgColor',
    textColor: 'reader_textColor',
    fontFamily: 'reader_fontFamily'
  };

  const defaults = {
    bgColor: '#0c0c14',
    textColor: '#c0c0d8',
    fontFamily: "'Noto Sans JP', 'Inter', sans-serif"
  };

  function previewStyles(bgColor, textColor, fontFamily) {
    const readerBody = document.getElementById('readerBody');
    if (!readerBody) return;

    readerBody.style.backgroundColor = bgColor;
    readerBody.style.color = textColor;
    readerBody.style.fontFamily = fontFamily;

    const allElements = readerBody.querySelectorAll('*');
    allElements.forEach(el => {
      const preserve = el.classList && (
        el.classList.contains('personagem') ||
        el.classList.contains('violet') ||
        el.tagName === 'A' ||
        el.tagName === 'STRONG' ||
        el.tagName === 'EM' ||
        el.classList.contains('reader-code') ||
        el.classList.contains('reader-loc')
      );
      if (!preserve) el.style.color = textColor;

      if (!el.classList.contains('reader-dialogo') &&
          !el.classList.contains('reader-pensamento') &&
          !el.classList.contains('reader-suspense') &&
          !el.classList.contains('reader-loc')) {
        el.style.backgroundColor = 'transparent';
      }
    });

    const specialBlocks = readerBody.querySelectorAll('.reader-dialogo, .reader-pensamento, .reader-suspense, .reader-loc');
    specialBlocks.forEach(el => {
      el.style.backgroundColor = 'rgba(0,0,0,0.3)';
    });
  }

  function applySavedStyles() {
    const bgColor = localStorage.getItem(STORAGE_KEYS.bgColor) || defaults.bgColor;
    const textColor = localStorage.getItem(STORAGE_KEYS.textColor) || defaults.textColor;
    const fontFamily = localStorage.getItem(STORAGE_KEYS.fontFamily) || defaults.fontFamily;
    previewStyles(bgColor, textColor, fontFamily);
  }

  function saveAndApply() {
    const bgColor = bgSelect.value;
    const textColor = textColorSelect.value;
    const fontFamily = fontSelect.value;
    localStorage.setItem(STORAGE_KEYS.bgColor, bgColor);
    localStorage.setItem(STORAGE_KEYS.textColor, textColor);
    localStorage.setItem(STORAGE_KEYS.fontFamily, fontFamily);
    previewStyles(bgColor, textColor, fontFamily);
    settingsPanel.style.display = 'none';
  }

  function loadSettingsToControls() {
    const savedBg = localStorage.getItem(STORAGE_KEYS.bgColor);
    const savedText = localStorage.getItem(STORAGE_KEYS.textColor);
    const savedFont = localStorage.getItem(STORAGE_KEYS.fontFamily);
    if (bgSelect) bgSelect.value = savedBg || defaults.bgColor;
    if (textColorSelect) textColorSelect.value = savedText || defaults.textColor;
    if (fontSelect) fontSelect.value = savedFont || defaults.fontFamily;
  }

  function resetSettings() {
    localStorage.removeItem(STORAGE_KEYS.bgColor);
    localStorage.removeItem(STORAGE_KEYS.textColor);
    localStorage.removeItem(STORAGE_KEYS.fontFamily);
    loadSettingsToControls();
    saveAndApply();
  }

  function bindPreviewEvents() {
    const previewUpdate = () => {
      const bgColor = bgSelect.value;
      const textColor = textColorSelect.value;
      const fontFamily = fontSelect.value;
      previewStyles(bgColor, textColor, fontFamily);
    };
    bgSelect?.addEventListener('change', previewUpdate);
    textColorSelect?.addEventListener('change', previewUpdate);
    fontSelect?.addEventListener('change', previewUpdate);
  }

  applyBtn?.addEventListener('click', saveAndApply);
  resetBtn?.addEventListener('click', resetSettings);

  // Exclusão mútua: ao abrir configurações, fecha o dropdown de idioma
  settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const langDropdown = document.querySelector('.reader-lang-dropdown');
    if (langDropdown) langDropdown.style.display = 'none';
    const isVisible = settingsPanel.style.display === 'block';
    if (!isVisible) {
      loadSettingsToControls();
      applySavedStyles();
      settingsPanel.style.display = 'block';
    } else {
      settingsPanel.style.display = 'none';
    }
  });

  document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
      settingsPanel.style.display = 'none';
    }
  });

  applySavedStyles();
  bindPreviewEvents();

  window.applyReaderStyles = applySavedStyles;
}