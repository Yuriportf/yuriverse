// audioPlayer.js – player de áudio com fade, playlist, minimizar e início imediato no clique
'use strict';

import { KEY_VOLUME } from '../shared/storage.js';

const TRACKS = [
  { title: "WAKE ME UP – THE WEEKND",                          src: "assets/audio/WAKE ME UP.mp3" },
  { title: "WANNA BE STARTIN' SOMETHIN' – MICHAEL JACKSON",   src: "assets/audio/Michael Jackson - Wanna Be Startin' Somethin' .mp3" },
  { title: "VANISH INTO YOU – LADY GAGA",                      src: "assets/audio/Vanish Into You.mp3" },
  { title: "DON'T STOP THE MUSIC – RIHANNA",                   src: "assets/audio/Don't Stop The Music .mp3" },
  { title: "GET LUCKY – DAFT PUNK ft. PHARRELL WILLIAMS",      src: "assets/audio/Get Lucky .mp3" },
  { title: "I WANT TO KNOW WHAT LOVE IS – FOREIGNER",          src: "assets/audio/I Want To Know What Love Is.mp3" },
  { title: "(I JUST) DIED IN YOUR ARMS – CUTTING CREW",        src: "assets/audio/(I Just) Died In Your Arms.mp3" },
];

export function initAudioPlayer() {
  console.log('[audioPlayer] Inicializando...');
  return new Promise((resolve) => {
    function start() {
      const audio = document.getElementById('audioPlayer');
      if (!audio) {
        setTimeout(start, 100);
        return;
      }

      const el = (id) => document.getElementById(id);
      const playPauseBtn   = el('playPauseBtn');
      const prevBtn        = el('prevTrackBtn');
      const nextBtn        = el('nextTrackBtn');
      const trackLabel     = el('trackNameLabel');
      const playlistBtn    = el('playlistToggleBtn');
      const playlistPanel  = el('playlistPanel');
      const playlistItems  = el('playlistItems');
      const audioIcon      = el('audioIcon');
      const audioControl   = el('audioControl');
      const minimizeBtn    = el('audioMinimizeBtn');
      const audioPill      = el('audioPill');
      const audioPillIcon  = el('audioPillIcon');
      const volumeSlider   = el('volumeSlider');
      const volumeIcon     = el('volumeIcon');

      let currentTrack = 0;
      let isPlaying    = false;
      let fadeTimer    = null;
      let lastVolume   = 0.5;

      // Carrega volume salvo
      try {
        const savedVol = localStorage.getItem(KEY_VOLUME);
        if (savedVol !== null) {
          lastVolume = parseFloat(savedVol);
          if (isNaN(lastVolume)) lastVolume = 0.5;
        }
      } catch(e) {}

      audio.volume = lastVolume;
      if (volumeSlider) {
        volumeSlider.value = lastVolume * 100;
        volumeSlider.style.setProperty('--vol-pct', lastVolume * 100 + '%');
      }

      function setPlayingState(playing) {
        isPlaying = playing;
        audioIcon?.classList.toggle('playing', playing);
        audioPillIcon?.classList.toggle('playing', playing);
      }

      function syncVolumeIcon(vol) {
        if (!volumeIcon) return;
        if (vol === 0)      volumeIcon.textContent = '🔇';
        else if (vol < 0.4) volumeIcon.textContent = '🔈';
        else if (vol < 0.75)volumeIcon.textContent = '🔉';
        else                volumeIcon.textContent = '🔊';
      }

      function renderPlaylist() {
        if (!playlistItems) return;
        playlistItems.innerHTML = '';
        TRACKS.forEach((track, idx) => {
          const item = document.createElement('div');
          item.className = 'playlist-item' + (idx === currentTrack ? ' active' : '');
          item.innerHTML = `
            <span class="playlist-item-num">${String(idx+1).padStart(2,'0')}</span>
            <span class="playlist-item-title">${escapeHtml(track.title)}</span>
            <span class="playlist-item-badge">${idx === currentTrack ? '▶' : ''}</span>
          `;
          item.addEventListener('click', (e) => {
            e.stopPropagation();
            loadTrack(idx, true);
            playlistPanel?.classList.remove('open');
          });
          playlistItems.appendChild(item);
        });
      }

      function escapeHtml(str) {
        return str.replace(/[&<>]/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[m] || m));
      }

      function loadTrack(index, autoPlay) {
        currentTrack = ((index % TRACKS.length) + TRACKS.length) % TRACKS.length;
        audio.src = TRACKS[currentTrack].src;
        audio.load();
        if (trackLabel) trackLabel.textContent = TRACKS[currentTrack].title;
        renderPlaylist();
        if (autoPlay) {
          audio.play().then(() => setPlayingState(true)).catch(e => setPlayingState(false));
        } else {
          setPlayingState(false);
        }
      }

      function clearFade() { if (fadeTimer) { clearInterval(fadeTimer); fadeTimer = null; } }

      function fadeIn() {
        clearFade();
        if (!audio.paused) return;
        audio.volume = 0;
        audio.play().then(() => {
          setPlayingState(true);
          let vol = 0;
          const step = lastVolume / 10;
          fadeTimer = setInterval(() => {
            vol = Math.min(vol + step, lastVolume);
            audio.volume = vol;
            if (vol >= lastVolume) clearFade();
          }, 50);
        }).catch(e => console.warn('[audioPlayer] fadeIn falhou:', e));
      }

      function fadeOut() {
        clearFade();
        if (audio.paused) return;
        const startVol = audio.volume;
        let vol = startVol;
        fadeTimer = setInterval(() => {
          vol = Math.max(vol - 0.05, 0);
          audio.volume = vol;
          if (vol <= 0) {
            clearFade();
            audio.pause();
            audio.volume = lastVolume;
            setPlayingState(false);
          }
        }, 30);
      }

      function togglePlayPause() { audio.paused ? fadeIn() : fadeOut(); }
      function minimizePlayer() {
        audioControl?.classList.add('minimized');
        audioPill?.classList.add('visible');
        playlistPanel?.classList.remove('open');
      }
      function expandPlayer() {
        audioPill?.classList.remove('visible');
        audioControl?.classList.remove('minimized');
      }

      // Eventos
      playPauseBtn?.addEventListener('click', togglePlayPause);
      prevBtn?.addEventListener('click', () => loadTrack(currentTrack - 1, true));
      nextBtn?.addEventListener('click', () => loadTrack(currentTrack + 1, true));
      minimizeBtn?.addEventListener('click', minimizePlayer);
      audioPill?.addEventListener('click', expandPlayer);
      playlistBtn?.addEventListener('click', (e) => { e.stopPropagation(); playlistPanel?.classList.toggle('open'); });
      volumeSlider?.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) / 100;
        audio.volume = val;
        if (val > 0) lastVolume = val;
        syncVolumeIcon(val);
        volumeSlider.style.setProperty('--vol-pct', val*100+'%');
        localStorage.setItem(KEY_VOLUME, val);
      });
      volumeIcon?.addEventListener('click', () => {
        if (audio.volume > 0) {
          lastVolume = audio.volume;
          audio.volume = 0;
          volumeSlider && (volumeSlider.value = 0);
          volumeSlider && volumeSlider.style.setProperty('--vol-pct', '0%');
          syncVolumeIcon(0);
        } else {
          audio.volume = lastVolume;
          volumeSlider && (volumeSlider.value = lastVolume*100);
          volumeSlider && volumeSlider.style.setProperty('--vol-pct', lastVolume*100+'%');
          syncVolumeIcon(lastVolume);
        }
      });
      audio.addEventListener('ended', () => loadTrack(currentTrack + 1, true));
      document.addEventListener('click', (e) => {
        if (playlistPanel && playlistBtn && !playlistPanel.contains(e.target) && e.target !== playlistBtn) {
          playlistPanel.classList.remove('open');
        }
      });

      // Carrega faixa aleatória inicial (não toca ainda)
      const randomIndex = Math.floor(Math.random() * TRACKS.length);
      loadTrack(randomIndex, false);
      syncVolumeIcon(lastVolume);

   // Expõe API completa para outros módulos
window.playerAPI = {
  play: () => { if (audio.paused) fadeIn(); },
  pause: () => { if (!audio.paused) fadeOut(); },
  startImmediately: () => {
    if (audio.paused) {
      audio.play().then(() => {
        setPlayingState(true);
        audio.volume = 0;
        let vol = 0;
        const step = lastVolume / 5;
        const timer = setInterval(() => {
          vol = Math.min(vol + step, lastVolume);
          audio.volume = vol;
          if (vol >= lastVolume) clearInterval(timer);
        }, 30);
      }).catch(e => console.warn('[audioPlayer] startImmediately falhou:', e));
    }
  },
  togglePlayPause: () => togglePlayPause(),
  next: () => loadTrack(currentTrack + 1, true),
  prev: () => loadTrack(currentTrack - 1, true),
  getCurrentTrack: () => ({ title: TRACKS[currentTrack].title, index: currentTrack }),
  isPlaying: () => isPlaying
};
      console.log('[audioPlayer] Inicializado. Faixa aleatória:', TRACKS[randomIndex].title);
      resolve();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
  });
}