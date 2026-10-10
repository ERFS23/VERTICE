// Converte um .srt (ex.: legenda automática do CapCut) em captions.json [{t,s,e}].
// Uso: node scripts/srt-to-captions.mjs legenda.srt > public/projects/<projeto>/captions.json
import fs from 'node:fs';
const sec = (ts) => {
  const [h, m, rest] = ts.split(':');
  return +h * 3600 + +m * 60 + parseFloat(rest.replace(',', '.'));
};
const out = fs
  .readFileSync(process.argv[2], 'utf8')
  .replace(/\r/g, '')
  .split(/\n\n+/)
  .map((b) => b.split('\n'))
  .filter((l) => l.length >= 3 && l[1].includes('-->'))
  .map((l) => {
    const [a, b] = l[1].split('-->').map((x) => sec(x.trim()));
    return {t: l.slice(2).join(' ').trim(), s: +a.toFixed(2), e: +b.toFixed(2)};
  });
console.log(JSON.stringify(out));
