/**
 * YURIVERSE — animacoes.js
 * 
 * Efeitos refinados:
 * - Chamas elegantes apenas no rodapé da intro (flame foot)
 * - Cortina de névoa na seção hero
 * - Partículas flutuantes no finale
 */

'use strict';

const rnd = (min, max) => Math.random() * (max - min) + min;
const rndI = (min, max) => Math.floor(rnd(min, max));

/* =====================================================================
   CHAMAS NA BASE DA INTRO (FLAME FOOT) - Visual aprimorado
   ===================================================================== */
function initFlameFoot(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Cria um elemento âncora fixo na parte inferior da intro
  let flameContainer = container.querySelector('.flame-foot-container');
  if (!flameContainer) {
    flameContainer = document.createElement('div');
    flameContainer.className = 'flame-foot-container';
    flameContainer.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 180px;
      pointer-events: none;
      z-index: 5;
      overflow: hidden;
    `;
    container.appendChild(flameContainer);
  }

  // Cria partículas de fogo que sobem
  function createFireParticle() {
    const x = rnd(0, 100);
    const size = rnd(12, 28);
    const duration = rnd(1.2, 2.5);
    const delay = rnd(0, 0.5);
    
    // Gradiente de cores quentes (vermelho, laranja, amarelo)
    const hue = rndI(0, 30); // 0 = vermelho, 30 = laranja
    const color = `hsl(${hue}, 100%, 60%)`;
    const glow = `hsl(${hue}, 100%, 70%)`;
    
    const flame = document.createElement('div');
    flame.className = 'fire-particle';
    flame.style.cssText = `
      position: absolute;
      left: ${x}%;
      bottom: -10px;
      width: ${size}px;
      height: ${size * 1.4}px;
      background: radial-gradient(ellipse at 50% 100%, ${color}, ${glow}, transparent);
      border-radius: 50% 50% 30% 30%;
      filter: blur(${size * 0.2}px);
      opacity: 0.85;
      transform-origin: center bottom;
      animation: elegantFlameRise ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards,
                 flameSway ${duration * 0.4}s ease-in-out infinite alternate;
    `;
    flameContainer.appendChild(flame);
    setTimeout(() => flame.remove(), duration * 1000 + 200);
  }

  // Cria uma chama maior e mais dramática (menos frequente)
  function createDramaticFlame() {
    const x = rnd(0, 100);
    const size = rnd(30, 55);
    const duration = rnd(1.8, 3.0);
    const delay = rnd(0, 0.8);
    
    const flame = document.createElement('div');
    flame.className = 'fire-particle-dramatic';
    flame.style.cssText = `
      position: absolute;
      left: ${x}%;
      bottom: -20px;
      width: ${size}px;
      height: ${size * 1.8}px;
      background: radial-gradient(ellipse at 50% 100%, #ff6600, #ff3300, transparent);
      border-radius: 50% 50% 20% 20%;
      filter: blur(${size * 0.15}px);
      opacity: 0.7;
      animation: elegantFlameRise ${duration}s cubic-bezier(0.2, 0.8, 0.4, 1) ${delay}s forwards,
                 flameSway ${duration * 0.3}s ease-in-out infinite alternate;
    `;
    flameContainer.appendChild(flame);
    setTimeout(() => flame.remove(), duration * 1000 + 300);
  }

  // Agenda as partículas
  setInterval(() => {
    if (document.getElementById(containerId) && flameContainer) {
      createFireParticle();
    }
  }, 100);

  setInterval(() => {
    if (document.getElementById(containerId) && flameContainer) {
      createDramaticFlame();
    }
  }, 800);
}

/* =====================================================================
   CORTINA DE NÉVOA PARA O HERO (mantida)
   ===================================================================== */
function initHeroMistCurtain(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const oldLayers = container.querySelectorAll('.mist-curtain-layer');
  oldLayers.forEach(layer => layer.remove());

  const layer1 = document.createElement('div');
  layer1.className = 'mist-curtain-layer';
  layer1.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at 50% 50%, rgba(255, 40, 0, 0.12) 0%, rgba(255, 0, 0, 0.03) 70%, transparent 100%);
    pointer-events: none;
    z-index: 1;
    opacity: 0.15;
    will-change: opacity;
  `;
  container.appendChild(layer1);

  const layer2 = document.createElement('div');
  layer2.className = 'mist-curtain-layer';
  layer2.style.cssText = `
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    background: repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255, 60, 0, 0.05) 40px, rgba(255, 30, 0, 0.1) 80px, transparent 80px);
    filter: blur(20px);
    pointer-events: none;
    z-index: 1;
    opacity: 0.2;
    will-change: transform;
  `;
  container.appendChild(layer2);

  const layer3 = document.createElement('div');
  layer3.className = 'mist-curtain-layer';
  layer3.style.cssText = `
    position: absolute;
    top: -20%;
    left: 0;
    width: 100%;
    height: 140%;
    background: linear-gradient(180deg, transparent, rgba(255, 50, 0, 0.08), transparent);
    filter: blur(30px);
    pointer-events: none;
    z-index: 1;
    opacity: 0.1;
    will-change: opacity;
  `;
  container.appendChild(layer3);

  layer1.style.animation = 'mistPulse 8s ease-in-out infinite';
  layer2.style.animation = 'mistDriftHorizontal 24s linear infinite alternate';
  layer3.style.animation = 'mistPulseSlow 12s ease-in-out infinite';
}

/* =====================================================================
   PARTÍCULAS FINALE
   ===================================================================== */
function initFinaleParticles() {
  const container = document.getElementById('finaleParticles');
  if (!container) return;
  const count = window.innerWidth <= 768 ? 12 : 24;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.className = 'particle-dot';
    dot.style.cssText = `
      left: ${rnd(0, 100)}%;
      width: ${rnd(2, 4)}px;
      height: ${rnd(2, 4)}px;
      --dur: ${rnd(10, 20)}s;
      --delay: -${rnd(0, 12)}s;
      --drift: ${(Math.random() - 0.5) * 80}px;
    `;
    container.appendChild(dot);
  }
}

/* =====================================================================
   INJEÇÃO DOS KEYFRAMES (CSS refinado)
   ===================================================================== */
function injectAnimationStyles() {
  if (document.getElementById('neon-animations')) return;
  const style = document.createElement('style');
  style.id = 'neon-animations';
  style.textContent = `
    @keyframes elegantFlameRise {
      0% {
        transform: translateY(0) scale(0.4);
        opacity: 0;
      }
      15% {
        opacity: 0.9;
      }
      50% {
        transform: translateY(-80px) scale(1);
        opacity: 0.8;
      }
      85% {
        transform: translateY(-180px) scale(0.6);
        opacity: 0.4;
      }
      100% {
        transform: translateY(-260px) scale(0);
        opacity: 0;
      }
    }
    
    @keyframes flameSway {
      0% { transform: translateX(0px) rotate(0deg); }
      100% { transform: translateX(${rnd(-6, 6)}px) rotate(${rnd(-4, 4)}deg); }
    }
    
    @keyframes mistPulse {
      0% { opacity: 0.08; }
      50% { opacity: 0.22; }
      100% { opacity: 0.08; }
    }
    
    @keyframes mistPulseSlow {
      0% { opacity: 0.06; }
      50% { opacity: 0.18; }
      100% { opacity: 0.06; }
    }
    
    @keyframes mistDriftHorizontal {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-6%); }
    }
    
    @keyframes particleFloat {
      0% { transform: translateY(0) translateX(0); opacity: 0; }
      15% { opacity: 0.6; }
      85% { opacity: 0.3; }
      100% { transform: translateY(-85vh) translateX(var(--drift, 0px)); opacity: 0; }
    }
    
    .particle-dot {
      position: absolute;
      border-radius: 50%;
      background: var(--red);
      opacity: 0.4;
      animation: particleFloat var(--dur, 10s) ease-in-out var(--delay, 0s) infinite;
    }
    
    .mist-curtain-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
    }
  `;
  document.head.appendChild(style);
}

/* =====================================================================
   INICIALIZAÇÃO
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  injectAnimationStyles();
  initFlameFoot('introFireworks');       // Chamas apenas no rodapé da intro
  initHeroMistCurtain('heroFireworks');  // Névoa no hero
  initFinaleParticles();                 // Partículas do finale
  console.log('[animacoes.js] Chamas elegantes ativadas (apenas rodapé da intro) + névoa no hero');
});