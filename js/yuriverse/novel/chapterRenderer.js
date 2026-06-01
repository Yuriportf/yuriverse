// chapterRenderer.js – renderiza blocos de cena para o leitor de novel
'use strict';

/**
 * Recebe um objeto `bloco` e retorna um elemento DOM correspondente.
 * Retorna `null` para tipos desconhecidos.
 *
 * @param {{ type: string, text?: string, personagem?: string }} bloco
 * @returns {HTMLElement|null}
 */
export function renderBloco(bloco) {
  if (!bloco || !bloco.type) return null;

  switch (bloco.type) {

    case 'p': {
      const el = document.createElement('p');
      el.textContent = bloco.text ?? '';
      return el;
    }

    case 'dialogo': {
      const div  = document.createElement('div');
      div.className = 'reader-dialogo';
      const nome = document.createElement('span');
      nome.className   = 'personagem';
      nome.textContent = (bloco.personagem ?? '') + ':';
      const fala = document.createElement('span');
      fala.className   = 'fala';
      fala.textContent = ' ' + (bloco.text ?? '');
      div.appendChild(nome);
      div.appendChild(fala);
      return div;
    }

    case 'pensamento': {
      const el = document.createElement('div');
      el.className   = 'reader-pensamento';
      el.textContent = bloco.text ?? '';
      return el;
    }

    case 'loc': {
      const el = document.createElement('div');
      el.className   = 'reader-loc';
      el.textContent = bloco.text ?? '';
      return el;
    }

    case 'subtitulo': {
      const el = document.createElement('div');
      el.className   = 'reader-subtitulo';
      el.textContent = bloco.text ?? '';
      return el;
    }

    case 'suspense': {
      const el = document.createElement('div');
      el.className   = 'reader-suspense';
      el.textContent = bloco.text ?? '';
      return el;
    }

    case 'separador': {
      const el = document.createElement('div');
      el.className   = 'reader-separador';
      el.textContent = '— ✦ —';
      return el;
    }

    case 'gap': {
      const el = document.createElement('div');
      el.className = 'reader-gap';
      return el;
    }

    default:
      console.warn(`[chapterRenderer] Tipo de bloco desconhecido: "${bloco.type}"`);
      return null;
  }
}