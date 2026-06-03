import fs from 'fs';
const SOURCE = './data/coracao/pt.json';
const TARGET_LANGS = ['en', 'zh', 'fr', 'ja', 'ko'];
const API = 'https://translate.astian.org/translate';

async function translateText(text, target) {
  if (!text || target === 'pt') return text;
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source: 'pt', target, format: 'text' })
  });
  const data = await res.json();
  return data.translatedText || text;
}

async function translateCena(cena, target) {
  const clone = { ...cena };
  if (clone.text) clone.text = await translateText(clone.text, target);
  if (clone.content) clone.content = await translateText(clone.content, target);
  if (Array.isArray(clone.lines)) {
    clone.lines = await Promise.all(clone.lines.map(l => translateText(l, target)));
  }
  if (Array.isArray(clone.items)) {
    clone.items = await Promise.all(clone.items.map(i => 
      typeof i === 'string' ? translateText(i, target) : translateCena(i, target)
    ));
  }
  return clone;
}

async function translateChapter(chap, target) {
  const newChap = { ...chap };
  newChap.titulo = await translateText(chap.titulo, target);
  newChap.cenas = [];
  for (const cena of chap.cenas) {
    newChap.cenas.push(await translateCena(cena, target));
  }
  return newChap;
}

async function main() {
  const original = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
  for (const lang of TARGET_LANGS) {
    console.log(`Traduzindo para ${lang}...`);
    const translated = { ...original };
    translated.capitulos = [];
    for (const chap of original.capitulos) {
      translated.capitulos.push(await translateChapter(chap, lang));
      console.log(`  Capítulo ${chap.num} concluído`);
    }
    fs.writeFileSync(`./data/coracao/${lang}.json`, JSON.stringify(translated, null, 2));
    console.log(`Salvo: ${lang}.json`);
  }
}

main().catch(console.error);