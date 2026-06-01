// readerSettings.js – salva e aplica preferências visuais do leitor (com prévia ao vivo)
export function initReaderSettings() {
  const settingsBtn = document.getElementById('readerSettingsBtn');
  const settingsPanel = document.getElementById('readerSettingsPanel');
  if (!settingsBtn || !settingsPanel) return;

  const bgSelect = document.getElementById('readerBgTheme');
  const textColorPicker = document.getElementById('readerTextColor');
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

  // Função que aplica estilos diretamente (sem tocar no localStorage)
  function previewStyles(bgColor, textColor, fontFamily) {
    const readerBody = document.getElementById('readerBody');
    if (!readerBody) return;

    // Aplica no container principal
    readerBody.style.backgroundColor = bgColor;
    readerBody.style.color = textColor;
    readerBody.style.fontFamily = fontFamily;

    // Força a cor em todos os elementos filhos (exceto links e elementos especiais)
    const allElements = readerBody.querySelectorAll('*');
    allElements.forEach(el => {
      // Preserva cores de elementos que devem manter destaque
      const preserve = el.classList && (
        el.classList.contains('personagem') ||
        el.classList.contains('violet') ||
        el.tagName === 'A' ||
        el.tagName === 'STRONG' ||
        el.tagName === 'EM' ||
        el.classList.contains('reader-code') ||
        el.classList.contains('reader-loc')
      );
      if (!preserve) {
        el.style.color = textColor;
      }
      // Força fundo transparente na maioria dos elementos
      if (!el.classList.contains('reader-dialogo') && 
          !el.classList.contains('reader-pensamento') &&
          !el.classList.contains('reader-suspense') &&
          !el.classList.contains('reader-loc')) {
        el.style.backgroundColor = 'transparent';
      }
    });

    // Ajusta fundo dos blocos especiais (para não ficarem transparentes)
    const dialogos = readerBody.querySelectorAll('.reader-dialogo, .reader-pensamento, .reader-suspense, .reader-loc');
    dialogos.forEach(el => {
      el.style.backgroundColor = `rgba(0,0,0,0.3)`;
    });
  }

  // Função que aplica estilos salvos no localStorage (para carga inicial e reset)
  function applySavedStyles() {
    const bgColor = localStorage.getItem(STORAGE_KEYS.bgColor) || defaults.bgColor;
    const textColor = localStorage.getItem(STORAGE_KEYS.textColor) || defaults.textColor;
    const fontFamily = localStorage.getItem(STORAGE_KEYS.fontFamily) || defaults.fontFamily;
    previewStyles(bgColor, textColor, fontFamily);
  }

  // Salva as preferências atuais dos controles no localStorage e aplica
  function saveAndApply() {
    const bgColor = bgSelect.value;
    const textColor = textColorPicker.value;
    const fontFamily = fontSelect.value;
    localStorage.setItem(STORAGE_KEYS.bgColor, bgColor);
    localStorage.setItem(STORAGE_KEYS.textColor, textColor);
    localStorage.setItem(STORAGE_KEYS.fontFamily, fontFamily);
    previewStyles(bgColor, textColor, fontFamily);
    settingsPanel.style.display = 'none';
  }

  // Carrega valores salvos nos controles
  function loadSettingsToControls() {
    const savedBg = localStorage.getItem(STORAGE_KEYS.bgColor);
    const savedText = localStorage.getItem(STORAGE_KEYS.textColor);
    const savedFont = localStorage.getItem(STORAGE_KEYS.fontFamily);
    if (bgSelect) bgSelect.value = savedBg || defaults.bgColor;
    if (textColorPicker) textColorPicker.value = savedText || defaults.textColor;
    if (fontSelect) fontSelect.value = savedFont || defaults.fontFamily;
  }

  // Restaura padrão e salva
  function resetSettings() {
    localStorage.removeItem(STORAGE_KEYS.bgColor);
    localStorage.removeItem(STORAGE_KEYS.textColor);
    localStorage.removeItem(STORAGE_KEYS.fontFamily);
    loadSettingsToControls();
    // Aplica os valores padrão (que agora estão nos controles)
    saveAndApply(); // reutiliza saveAndApply para aplicar e fechar o painel
  }

  // Evento de prévia ao vivo: ao alterar qualquer controle, aplica imediatamente (sem salvar)
  function bindPreviewEvents() {
    const previewUpdate = () => {
      const bgColor = bgSelect.value;
      const textColor = textColorPicker.value;
      const fontFamily = fontSelect.value;
      previewStyles(bgColor, textColor, fontFamily);
    };
    bgSelect?.addEventListener('change', previewUpdate);
    textColorPicker?.addEventListener('input', previewUpdate); // input para preview contínua
    fontSelect?.addEventListener('change', previewUpdate);
  }

  applyBtn?.addEventListener('click', saveAndApply);
  resetBtn?.addEventListener('click', resetSettings);

  settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = settingsPanel.style.display === 'block';
    if (!isVisible) {
      // Ao abrir o painel, carrega os valores salvos nos controles e aplica o estilo salvo
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

  // Inicializa: aplica estilos salvos, expõe função global e configura prévia ao vivo
  applySavedStyles();
  bindPreviewEvents();
  window.applyReaderStyles = applySavedStyles;
}