// starsCanvas.js – Campo estelar com estrelas de 4 pontas e cintilação
export function initStarsCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) {
    console.warn('[starsCanvas] #hero-canvas não encontrado');
    return;
  }
  const ctx = canvas.getContext('2d');
  let width, height;
  let bgStars = [];
  let spikes = [];
  let shoots = [];
  let shootTimer = 0;
  let shootInterval = 2500;
  let animationId = null;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    buildStars();
  }

  function buildStars() {
    const count = Math.floor((width * height) / 6000);
    bgStars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 0.8 + 0.2,
      base: Math.random() * 0.5 + 0.1,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.003,
    }));
    const SPIKE_COUNT = 28;
    spikes = Array.from({ length: SPIKE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 6 + 2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.012 + 0.005,
      hue: Math.random() < 0.5 ? 240 : 0,
      sat: Math.random() < 0.5 ? Math.floor(Math.random() * 30) : 0,
    }));
  }

  function spawnShoot() {
    const edge = Math.random();
    let x, y, angle;
    if (edge < 0.5) {
      x = Math.random() * width;
      y = 0;
      angle = Math.PI / 6 + Math.random() * (Math.PI / 3);
    } else {
      x = 0;
      y = Math.random() * (height * 0.6);
      angle = Math.random() * (Math.PI / 5);
    }
    shoots.push({
      x, y, angle,
      len: Math.random() * 120 + 60,
      speed: Math.random() * 8 + 5,
      life: 1.0,
      decay: Math.random() * 0.018 + 0.012,
      width: Math.random() * 1.2 + 0.4,
    });
  }

  function drawSpike(x, y, size, opacity, hue, sat) {
    const color = `hsla(${hue},${sat}%,92%,${opacity})`;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 2.5);
    grad.addColorStop(0, `hsla(${hue},${sat}%,100%,${opacity * 0.25})`);
    grad.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.save();
    ctx.translate(x, y);
    for (let i = 0; i < 2; i++) {
      ctx.rotate(i * Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(size * 0.12, -size * 0.12, size * 0.35, 0);
      ctx.quadraticCurveTo(size * 0.12, size * 0.12, 0, size);
      ctx.quadraticCurveTo(-size * 0.12, size * 0.12, -size * 0.35, 0);
      ctx.quadraticCurveTo(-size * 0.12, -size * 0.12, 0, -size);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
    ctx.restore();
    ctx.beginPath();
    ctx.arc(x, y, size * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(0,0%,100%,${opacity})`;
    ctx.fill();
  }

  let lastTimestamp = 0;
  function draw(ts) {
    const dt = Math.min(100, ts - lastTimestamp);
    lastTimestamp = ts;
    ctx.clearRect(0, 0, width, height);
    // Estrelas de fundo
    bgStars.forEach(s => {
      s.phase += s.speed;
      const op = s.base + s.base * 0.6 * Math.sin(s.phase);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,220,255,${op})`;
      ctx.fill();
    });
    // Estrelas de 4 pontas
    spikes.forEach(s => {
      s.phase += s.speed;
      const t = (Math.sin(s.phase) + 1) / 2;
      const op = 0.08 + t * 0.85;
      const sz = s.size * (0.7 + t * 0.3);
      drawSpike(s.x, s.y, sz, op, s.hue, s.sat);
    });
    // Tiros
    shootTimer += dt;
    if (shootTimer > shootInterval) {
      spawnShoot();
      shootTimer = 0;
      shootInterval = Math.random() * 2500 + 2500;
    }
    shoots = shoots.filter(s => s.life > 0);
    shoots.forEach(s => {
      const tailX = s.x - Math.cos(s.angle) * s.len;
      const tailY = s.y - Math.sin(s.angle) * s.len;
      const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.6, `rgba(200,200,255,${s.life * 0.4})`);
      grad.addColorStop(1, `rgba(255,255,255,${s.life * 0.9})`);
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = s.width;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.width * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.life * 0.9})`;
      ctx.fill();
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.life -= s.decay;
    });
    animationId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(draw);
  });
  resize();
  animationId = requestAnimationFrame(draw);
  console.log('[starsCanvas] Inicializado');
}