// library.js – carrega livros do JSON e monta o modal da biblioteca
'use strict';

export async function initLibrary() {
  const openBtn = document.getElementById('openLibrary');
  if (!openBtn) { console.warn('[library] #openLibrary não encontrado'); return; }

  openBtn.addEventListener('click', async () => {
    const modal = document.getElementById('libraryModal');
    if (!modal) { console.warn('[library] #libraryModal não encontrado'); return; }

    // Carrega só quando abrir (lazy)
    if (!modal.dataset.loaded) {
      try {
        const response = await fetch('./data/books.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const books = await response.json();

        const grid = modal.querySelector('.book-cards');
        if (grid) {
          grid.innerHTML = books.map(book => `
            <div class="book-card">
              <img src="${book.cover}" alt="${book.title}" loading="lazy">
              <h3>${book.title}</h3>
              <p>${book.author}</p>
              <a href="${book.pdfUrl}" target="_blank" rel="noopener noreferrer" class="btn-ver-pdf">
                Ver livro completo
              </a>
            </div>
          `).join('');
        }
        modal.dataset.loaded = 'true';
      } catch (err) {
        console.error('[library] Erro ao carregar books.json:', err);
      }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}