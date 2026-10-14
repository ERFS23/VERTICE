import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {T, W, SPLIT} from '../theme';
import {Word} from '../types';
import {popIn} from '../anim';

type Chunk = {words: Word[]; start: number; end: number};

// Quebra a fala em blocos curtos (2 a 4 palavras), cortando em pontuação e pausas.
export const chunkWords = (words: Word[], maxWords = 4, maxChars = 26): Chunk[] => {
  const chunks: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) chunks.push({words: cur, start: cur[0].s, end: cur[cur.length - 1].e});
    cur = [];
  };
  words.forEach((w, i) => {
    const prev = words[i - 1];
    const len = cur.map((x) => x.w).join(' ').length + w.w.length + 1;
    if (cur.length && (cur.length >= maxWords || len > maxChars || (prev && w.s - prev.e > 0.45))) flush();
    cur.push(w);
    if (w.brk || /[.,!?;:]$/.test(w.w)) flush();
  });
  flush();
  // cada bloco fica na tela até o próximo começar (sem "buracos" curtos)
  chunks.forEach((c, i) => {
    const next = chunks[i + 1];
    c.end = next && next.start - c.end < 0.6 ? next.start : c.end + 0.35;
  });
  return chunks;
};

// Legenda em "pílula" escura sobre a linha divisória. Karaokê de 3 estados:
// palavra futura = cinza, palavra falando agora = rosa, palavra já falada = branca.
type CapProps = {words: Word[]; maxWords?: number; maxChars?: number; top?: number; width?: number; variant?: 'pill' | 'plain'; fontFamily?: string; size?: number; dark?: boolean};
export const Captions: React.FC<CapProps> = ({words, maxWords, maxChars, top, width, variant = 'pill', fontFamily, size, dark = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const chunks = useMemo(() => chunkWords(words, maxWords, maxChars), [words, maxWords, maxChars]);
  const c = chunks.find((x) => t >= x.start && t < x.end);
  if (!c) return null;
  const p = popIn(frame, fps, c.start, 15);
  return (
    <div style={{position: 'absolute', top: top ?? SPLIT - 42, width: width ?? W, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          transform: `scale(${0.85 + 0.15 * p})`,
          opacity: Math.min(1, p * 1.5),
          ...(variant === 'pill'
            ? {background: '#1D1B21', padding: '10px 26px 14px', borderRadius: 6, boxShadow: `6px 6px 0 ${T.pink}, 0 10px 30px rgba(0,0,0,0.6)`, fontFamily: T.sans, fontWeight: 800, fontSize: size ?? 50, letterSpacing: -1}
            : {fontFamily: fontFamily ?? T.sans, textTransform: 'uppercase' as const, fontSize: size ?? 54, textShadow: dark ? '0 4px 24px rgba(0,0,0,.85)' : 'none', letterSpacing: 1}),
          display: 'flex',
          gap: 13,
        }}
      >
        {c.words.map((w, i) => {
          const color = variant === 'plain' ? (t >= w.s ? (dark ? '#fff' : '#0D0D0D') : dark ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.3)') : t >= w.s && t < w.e ? T.pink : t >= w.e ? T.white : T.dim;
          return (
            <span key={i} style={{color}}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
