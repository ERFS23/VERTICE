import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {T, W, SPLIT} from '../theme';
import {Chapter} from '../types';
import {clamp, popIn} from '../anim';

// Fundo da metade de cima: preto, brilho magenta no topo, grade de pontos e vinheta.
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.85 + 0.15 * Math.sin(frame / 25);
  return (
    <AbsoluteFill style={{background: T.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 45% at 50% 8%, rgba(224,23,127,${0.42 * pulse}) 0%, rgba(120,10,70,0.18) 45%, transparent 75%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.09) 1.2px, transparent 1.2px)',
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 85%)',
        }}
      />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 80% at 50% 45%, transparent 55%, rgba(0,0,0,0.85) 100%)'}} />
    </AbsoluteFill>
  );
};

// Cabeçalho: "• NOME DO CAPÍTULO" à esquerda, "03 / 08" à direita, barra segmentada de progresso.
export const Header: React.FC<{chapters: Chapter[]}> = ({chapters}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  let idx = chapters.findIndex((c) => t >= c.start && t < c.end);
  if (idx < 0) idx = t < (chapters[0]?.start ?? 0) ? 0 : chapters.length - 1;
  const cur = chapters[idx];
  const n = chapters.length;
  const pad = (v: number) => String(v).padStart(2, '0');
  const labelIn = popIn(frame, fps, cur.start, 18);
  return (
    <div style={{position: 'absolute', left: 90, right: 90, top: 160}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: T.mono, fontSize: 24, letterSpacing: 6}}>
        <div style={{color: T.white, display: 'flex', alignItems: 'center', gap: 14, opacity: labelIn, transform: `translateX(${(1 - labelIn) * -20}px)`}}>
          <span style={{width: 11, height: 11, borderRadius: 6, background: T.pink, boxShadow: T.glow(T.pink, 8)}} />
          {cur.label.toUpperCase()}
        </div>
        <div style={{color: T.dim}}>
          {pad(idx + 1)} / {pad(n)}
        </div>
      </div>
      <div style={{display: 'flex', gap: 8, marginTop: 18}}>
        {chapters.map((c, i) => {
          const p = i < idx ? 1 : i > idx ? 0 : interpolate(t, [c.start, c.end], [0, 1], clamp);
          return (
            <div key={i} style={{flex: 1, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.12)', overflow: 'hidden'}}>
              <div style={{width: `${p * 100}%`, height: '100%', background: T.pink, boxShadow: T.glow(T.pink, 6)}} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Título do capítulo: caixa-alta pesada + uma palavra em itálico serifado com gradiente.
export const ChapterTitle: React.FC<{chapter: Chapter}> = ({chapter}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (!chapter.title) return null;
  const at = chapter.titleAt ?? chapter.start;
  const words = chapter.title.text.split(' ');
  return (
    <div style={{position: 'absolute', top: 250, width: W, display: 'flex', justifyContent: 'center', gap: 18, flexWrap: 'wrap'}}>
      {words.map((w, i) => {
        const p = popIn(frame, fps, at + i * 0.09, 14);
        const isAccent = chapter.title!.accent && w.toLowerCase() === chapter.title!.accent.toLowerCase();
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${(1 - p) * 40}px)`,
              fontFamily: isAccent ? T.serif : T.sans,
              fontStyle: isAccent ? 'italic' : 'normal',
              fontWeight: isAccent ? 400 : 900,
              fontSize: isAccent ? 82 : 66,
              lineHeight: '88px',
              letterSpacing: isAccent ? 0 : -1.5,
              textTransform: isAccent ? 'none' : 'uppercase',
              color: T.white,
              ...(isAccent ? {background: T.grad, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', paddingRight: 6} : {}),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// Linha neon que separa as duas metades.
export const Divider: React.FC = () => (
  <div style={{position: 'absolute', top: SPLIT - 2, left: 0, width: W, height: 4, background: T.pink, boxShadow: T.glow(T.pink, 14)}} />
);
