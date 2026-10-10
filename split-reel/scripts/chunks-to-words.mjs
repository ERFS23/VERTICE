// Converte legendas por bloco (texto + início/fim) em palavras com tempo interpolado.
// Uso: node scripts/chunks-to-words.mjs entrada.json > words.json
// entrada: [{"t":"O Claude acabou","s":0,"e":0.9}, ...]   (ou um .srt — veja srt-to-words.mjs)
import fs from 'node:fs';
export const toWords = (chunks) =>
  chunks.flatMap(({t, s, e}) => {
    const ws = t.trim().split(/\s+/);
    const total = ws.reduce((a, w) => a + w.length + 2, 0);
    let cur = s;
    return ws.map((w, i) => {
      const d = ((w.length + 2) / total) * (e - s);
      const o = {w, s: +cur.toFixed(2), e: +(cur + d).toFixed(2), ...(i === ws.length - 1 ? {brk: true} : {})};
      cur += d;
      return o;
    });
  });
if (process.argv[2] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  console.log(JSON.stringify(toWords(JSON.parse(fs.readFileSync(process.argv[2], 'utf8')))));
}
