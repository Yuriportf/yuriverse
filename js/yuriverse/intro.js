// main.js – versão definitiva para a intro
console.log('main.js carregado');

document.addEventListener('DOMContentLoaded', () => {
  // Elementos
  const introScreen = document.getElementById('introScreen');
  const siteWrapper = document.getElementById('siteWrapper');
  const enterBtn = document.getElementById('enterBtn');
  const audioControl = document.getElementById('audioControl');

  // Função que revela o site
  function revealSite() {
    console.log('revelando site...');
    if (!introScreen || !siteWrapper) return;

    introScreen.classList.add('fade-out');
    setTimeout(() => {
      introScreen.style.display = 'none';
      siteWrapper.classList.add('visible');
      if (audioControl) audioControl.classList.add('visible');
      document.body.classList.remove('intro-active');
      document.body.classList.add('site-visible');
      window.scrollTo(0, 0);
      console.log('site revelado');
    }, 800);
  }

  // Verifica se deve pular intro (vindo do profissional)
  const skip = sessionStorage.getItem('skipIntro') === 'true' || document.referrer.includes('profissional');
  if (skip) {
    // Pula a intro
    if (introScreen) introScreen.style.display = 'none';
    if (siteWrapper) siteWrapper.classList.add('visible');
    if (audioControl) audioControl.classList.add('visible');
    document.body.classList.remove('intro-active');
    document.body.classList.add('site-visible');
    sessionStorage.removeItem('skipIntro');
    console.log('intro pulada');
  } else {
    // Garante que a intro está visível e sem rolagem
    document.body.classList.add('intro-active');
    document.body.classList.remove('site-visible');
    if (enterBtn) {
      enterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        revealSite();
      });
      console.log('botão ENTER configurado');
    } else {
      console.error('Botão #enterBtn não encontrado!');
      // Fallback: revela após 3 segundos
      setTimeout(revealSite, 3000);
    }
  }

  // Resto das inicializações (carrossel, áudio, leitor)
  // ... mantenha o que já funcionava depois que o site estiver visível
});