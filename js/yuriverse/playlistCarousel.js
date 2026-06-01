// playlistCarousel.js – Carrossel de playlists com botão "OUÇA NO SPOTIFY" em cada slide
export function initPlaylistCarousel() {
    const track = document.getElementById('playlistCarouselTrack');
    const dotsContainer = document.getElementById('playlistCarouselDots');
    const prevBtn = document.getElementById('playlistPrev');
    const nextBtn = document.getElementById('playlistNext');
    const prevMobile = document.getElementById('playlistPrevMobile');
    const nextMobile = document.getElementById('playlistNextMobile');

    if (!track) {
        console.warn('[playlistCarousel] #playlistCarouselTrack não encontrado');
        return;
    }

const playlists = [
  {
    title: "Michael Jackson – Hits",
    embedUrl: "https://open.spotify.com/embed/playlist/1rys5Id1h0XYUimRKneARm?utm_source=generator&theme=0",
    openUrl: "https://open.spotify.com/playlist/1rys5Id1h0XYUimRKneARm"
  },
  
  {
    title: "THE WEEKEND – Favoritas",
    embedUrl: "https://open.spotify.com/embed/playlist/7eA81kRzMeZ31os3GFXhyk?utm_source=generator&theme=0",
    openUrl: "https://open.spotify.com/playlist/7eA81kRzMeZ31os3GFXhyk"
  },

  {
    title: "The Weeknd – Essentials",
    embedUrl: "https://open.spotify.com/embed/playlist/3AbaOq9qEGP0YnEEyh1DQ9?utm_source=generator&theme=0",
    openUrl: "https://open.spotify.com/playlist/3AbaOq9qEGP0YnEEyh1DQ9"
  },
  {
    title: "Foco & Criatividade",
    embedUrl: "https://open.spotify.com/embed/playlist/6rV4q1GWqUKSh7k3s5zIfQ?utm_source=generator&theme=0",
    openUrl: "https://open.spotify.com/playlist/6rV4q1GWqUKSh7k3s5zIfQ"
  },
  {
    title: "Eletrônica Vibes",
    embedUrl: "https://open.spotify.com/embed/playlist/1a4YlN25zQxis1otjopKSv?utm_source=generator&theme=0",
    openUrl: "https://open.spotify.com/playlist/1a4YlN25zQxis1otjopKSv"
  },
  {
    title: "Rock Alternativo",
    embedUrl: "https://open.spotify.com/embed/playlist/5D4nHZLOM4FYlpRwyvqouN?utm_source=generator&theme=0",
    openUrl: "https://open.spotify.com/playlist/5D4nHZLOM4FYlpRwyvqouN"
  },
  {
    title: "Lo-fi para Estudar",
    embedUrl: "https://open.spotify.com/embed/playlist/0fdgVLgsXvCiNPaZIri7lP?utm_source=generator&theme=0",
    openUrl: "https://open.spotify.com/playlist/0fdgVLgsXvCiNPaZIri7lP"
  },
  {
    title: "Indie Playlist",
    embedUrl: "https://open.spotify.com/embed/playlist/1zxB6tnXI08H3vi5hEGwvu?utm_source=generator&theme=0",
    openUrl: "https://open.spotify.com/playlist/1zxB6tnXI08H3vi5hEGwvu"
  }
];

    // Preenche o track com os players e um botão personalizado
    track.innerHTML = playlists.map(p => `
    <div class="playlist-carousel-slide">
      <iframe src="${p.embedUrl}" width="100%" height="352" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
      <div class="playlist-carousel-button-wrapper">
        <a href="${p.openUrl}" target="_blank" rel="noopener noreferrer" class="playlist-spotify-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" fill="currentColor" viewBox="0 0 496 512">
            <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm101 364a15 15 0 01-21 5c-58-35-131-43-217-24a15 15 0 01-7-29c94-20 176-10 241 28a15 15 0 014 20zm30-66a18 18 0 01-24 6c-67-41-169-53-247-29a18 18 0 01-10-34c87-26 198-13 273 34a18 18 0 018 23zm2-65c-80-48-212-52-289-29a20 20 0 01-12-38c86-27 230-23 321 32a20 20 0 01-20 35z"/>
          </svg>
          OUÇA NO SPOTIFY
        </a>
      </div>
    </div>
  `).join('');

    let slides = track.querySelectorAll('.playlist-carousel-slide');
    let current = 0;
    let autoTimer = null;
    const gap = 20;
    let slidesPerView = 1;
    let maxIndex = 0;

    function updateSlidesPerView() {
        const w = window.innerWidth;
        slidesPerView = w >= 1024 ? 2 : 1;
        maxIndex = Math.max(0, slides.length - slidesPerView);
        if (current > maxIndex) current = maxIndex;
        applyTransform();
        updateDots();
        updateButtons();
    }

    function applyTransform() {
        const slideWidth = slides[0]?.offsetWidth || 0;
        track.style.transform = `translateX(-${current * (slideWidth + gap)}px)`;
    }

    function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('span');
            dot.className = 'carousel-dot' + (i === current ? ' active' : '');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateButtons() {
        const disablePrev = current <= 0;
        const disableNext = current >= maxIndex;
        if (prevBtn) prevBtn.disabled = disablePrev;
        if (nextBtn) nextBtn.disabled = disableNext;
        if (prevMobile) prevMobile.disabled = disablePrev;
        if (nextMobile) nextMobile.disabled = disableNext;
    }

    function goTo(index) {
        current = Math.min(maxIndex, Math.max(0, index));
        applyTransform();
        updateDots();
        updateButtons();
        restartAuto();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
        if (autoTimer) clearInterval(autoTimer);
        if (slides.length <= slidesPerView) return;
        autoTimer = setInterval(() => {
            if (current < maxIndex) next();
            else goTo(0);
        }, 8000);
    }
    function restartAuto() { startAuto(); }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevMobile) prevMobile.addEventListener('click', prev);
    if (nextMobile) nextMobile.addEventListener('click', next);

    window.addEventListener('resize', () => {
        slides = track.querySelectorAll('.playlist-carousel-slide');
        updateSlidesPerView();
        goTo(current);
    });

    updateSlidesPerView();
    startAuto();
    console.log('[playlistCarousel] Inicializado com', playlists.length, 'playlists');
}