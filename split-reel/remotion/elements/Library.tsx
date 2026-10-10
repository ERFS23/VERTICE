import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {T} from '../theme';
import {El} from '../types';
import {clamp, ease, popIn, rnd} from '../anim';
import {Icon} from './Icon';

type P = {el: El; brandTag: string};
const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {frame, fps, t: frame / fps};
};

const gradText: React.CSSProperties = {background: T.grad, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'};

// ───────────────────────── kinetic: palavra gigante digitada letra a letra; opcional "explodir"
const Kinetic: React.FC<P> = ({el}) => {
  const {frame, fps, t} = useT();
  const text: string = el.text ?? 'Texto';
  const size: number = el.size ?? 150;
  const ex: number | undefined = el.explodeAt;
  return (
    <div style={{display: 'flex', fontFamily: T.sans, fontWeight: 900, fontSize: size, letterSpacing: -4, whiteSpace: 'pre'}}>
      {text.split('').map((ch, i) => {
        const p = popIn(frame, fps, el.at + i * (el.stagger ?? 0.045), 12);
        let x = 0, y = (1 - p) * 60, r = 0, grey = 0;
        if (ex !== undefined && t > ex) {
          const k = ease(frame, fps, ex, ex + 0.7, 0, 1, Easing.in(Easing.quad));
          x = (rnd(i + 1) - 0.5) * 260 * k;
          y += (rnd(i + 7) * 380 + 80) * k;
          r = (rnd(i + 3) - 0.5) * 120 * k;
          grey = Math.min(1, k * 3);
        }
        return (
          <span key={i} style={{display: 'inline-block', opacity: p, transform: `translate(${x}px,${y}px) rotate(${r}deg)`, filter: `blur(${(1 - p) * 8}px)`, ...(grey ? {color: '#9C97A0'} : gradText)}}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

// ───────────────────────── phone: celular com perfil + grid 3x3 de tiles
const Phone: React.FC<P> = ({el}) => {
  const {frame, fps, t} = useT();
  const tiles: {label?: string; icon?: string}[] = el.tiles ?? Array.from({length: 9}, () => ({}));
  const tilesAt: number = el.tilesAt ?? el.at + 0.3;
  const hl: number | undefined = el.highlight;
  const hlAt: number = el.highlightAt ?? 0;
  // troca de conteúdo dos tiles com "flip" em cascata: swap = {at, tiles}
  const swap: {at: number; tiles: {label?: string; icon?: string}[]} | undefined = el.swap;
  return (
    <div style={{width: 300, height: 600, borderRadius: 44, background: '#0B080C', border: `3px solid ${T.pink}`, boxShadow: T.glow(T.pink, 30), padding: '20px 16px', boxSizing: 'border-box', fontFamily: T.sans, color: T.white}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, opacity: 0.8}}>
        <span>9:41</span>
        <span>▮▮▮ ▰</span>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14, fontWeight: 800, fontSize: 19}}>
        <span>{el.handle ?? 'seu_perfil'} ⌄</span>
        <span>＋ ≡</span>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 14}}>
        <div style={{width: 66, height: 66, borderRadius: 33, border: `3px solid ${T.pink}`, display: 'grid', placeItems: 'center'}}>
          <Icon name="user" size={34} color={T.white} />
        </div>
        <div style={{flex: 1}}>
          <div style={{fontWeight: 800, fontSize: 17}}>{el.name ?? 'Você'}</div>
          <div style={{height: 6, background: '#2a252c', borderRadius: 3, marginTop: 8, width: '90%'}} />
          <div style={{height: 6, background: '#2a252c', borderRadius: 3, marginTop: 6, width: '60%'}} />
        </div>
      </div>
      <div style={{marginTop: 14, background: '#221D24', borderRadius: 10, fontSize: 14, fontWeight: 700, textAlign: 'center', padding: '8px 0'}}>{el.button ?? 'Editar perfil'}</div>
      <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 12, paddingBottom: 6, borderBottom: '1px solid #2a252c'}}>
        <Icon name="grid" size={18} color={T.white} />
        <Icon name="play" size={18} color={T.dim} />
        <Icon name="user" size={18} color={T.dim} />
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, marginTop: 6}}>
        {tiles.slice(0, 9).map((tile, i) => {
          const p = popIn(frame, fps, tilesAt + i * 0.06, 12);
          const fl = swap ? interpolate(t, [swap.at + i * 0.05, swap.at + i * 0.05 + 0.3], [0, 1], clamp) : 0;
          const shown = fl >= 0.5 && swap ? swap.tiles[i] ?? {} : tile;
          const flipDeg = fl < 0.5 ? fl * 180 : (fl - 1) * 180;
          const on = hl === i && t >= hlAt && fl === 0;
          const pulse = on ? 1 + 0.08 * Math.sin((t - hlAt) * 10) * Math.exp(-(t - hlAt) * 2) : 1;
          return (
            <div key={i} style={{aspectRatio: '1', background: T.tileGrad(i), display: 'grid', placeItems: 'center', transform: `perspective(400px) rotateY(${flipDeg}deg) scale(${p * pulse})`, opacity: p, boxShadow: on ? `0 0 0 3px #fff, ${T.glow('#fff', 14)}` : 'none', fontWeight: 900, fontSize: 40, color: '#fff'}}>
              {shown.label ?? (shown.icon ? <Icon name={shown.icon} size={34} color="#fff" /> : null)}
            </div>
          );
        })}
      </div>
      <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 18}}>
        {['home', 'search', 'play', 'send', 'user'].map((n) => (
          <Icon key={n} name={n} size={20} color={T.grey} />
        ))}
      </div>
    </div>
  );
};

// ───────────────────────── card: cartão estilo "etiqueta de produto"
const Card: React.FC<P> = ({el}) => {
  const title: string = el.title ?? 'Título';
  const accent: string | undefined = el.accent;
  const parts = accent ? title.split(accent) : [title];
  return (
    <div style={{fontFamily: T.sans}}>
      <div style={{padding: 26, borderRadius: 18, background: T.panel, border: `2px solid ${T.panelBorder}`, boxShadow: T.glow(T.purple, 26)}}>
        <div style={{background: '#EDEBEF', borderRadius: 10, padding: '20px 26px', width: el.width ?? 380}}>
          <div style={{fontFamily: T.mono, fontSize: 17, letterSpacing: 4, color: '#56525A'}}>{(el.eyebrow ?? 'SKILL PACK').toUpperCase()}</div>
          <div style={{fontWeight: 900, fontSize: 40, letterSpacing: -1.5, color: '#111', marginTop: 4, whiteSpace: 'nowrap'}}>
            {accent ? (
              <>
                {parts[0]}
                <span style={gradText}>{accent}</span>
                {parts[1]}
              </>
            ) : (
              title
            )}
          </div>
          {el.sub && <div style={{fontFamily: T.mono, fontSize: 18, color: '#222', marginTop: 14}}>{el.sub}</div>}
          {el.barcode !== false && (
            <div style={{display: 'flex', gap: 3, marginTop: 12, height: 24}}>
              {Array.from({length: 38}, (_, i) => (
                <div key={i} style={{width: rnd(i) > 0.6 ? 4 : 2, background: '#111'}} />
              ))}
            </div>
          )}
        </div>
      </div>
      {el.footnote && <div style={{fontFamily: T.mono, fontSize: 17, letterSpacing: 4, color: T.grey, marginTop: 18, textAlign: 'center'}}>▪ {el.footnote.toUpperCase()}</div>}
    </div>
  );
};

// ───────────────────────── badge: selo estrelado que gira ao entrar, com "raios"
const Badge: React.FC<P> = ({el}) => {
  const {frame, fps} = useT();
  const p = popIn(frame, fps, el.at, 9);
  const burst = interpolate(frame, [el.at * fps, (el.at + 0.5) * fps], [0, 1], clamp);
  const lineOp = interpolate(frame, [el.at * fps, (el.at + 0.12) * fps, (el.at + 0.6) * fps], [0, 1, 0], clamp);
  const pts = Array.from({length: 32}, (_, i) => {
    const a = (i / 32) * Math.PI * 2;
    const r = i % 2 ? 84 : 100;
    return `${100 + r * Math.cos(a)},${100 + r * Math.sin(a)}`;
  }).join(' ');
  return (
    <div style={{position: 'relative', width: 200, height: 200, transform: `rotate(${(1 - p) * -90 - 12}deg)`}}>
      {Array.from({length: 10}, (_, i) => {
        const a = (i / 10) * 360;
        return (
          <div key={i} style={{position: 'absolute', left: 97, top: 100, width: 5, height: 26, borderRadius: 3, background: T.pink, opacity: lineOp, transformOrigin: '2px 0', transform: `rotate(${a}deg) translateY(${100 + burst * 40}px)`}} />
        );
      })}
      <svg width={200} height={200} style={{position: 'absolute', filter: `drop-shadow(0 0 18px ${T.pink})`}}>
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={T.pink} />
            <stop offset="1" stopColor={T.purple} />
          </linearGradient>
        </defs>
        <polygon points={pts} fill="url(#bg)" />
        <circle cx={100} cy={100} r={68} fill="none" stroke="#fff" strokeOpacity={0.5} strokeDasharray="4 6" strokeWidth={2} />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', fontFamily: T.sans, color: '#fff'}}>
        <div>
          <div style={{fontWeight: 900, fontSize: 50, lineHeight: '50px', letterSpacing: -2}}>{el.text ?? '100%'}</div>
          <div style={{fontFamily: T.mono, fontSize: 17, letterSpacing: 4}}>{el.sub ?? 'GRÁTIS'}</div>
        </div>
      </div>
    </div>
  );
};

// ───────────────────────── counter: número grande contando (ex.: 02 → 09 AGENTES)
const Counter: React.FC<P> = ({el}) => {
  const {frame, fps} = useT();
  const v = Math.round(ease(frame, fps, el.at, el.at + (el.duration ?? 0.8), el.from ?? 0, el.to ?? 10, Easing.out(Easing.cubic)));
  return (
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 14}}>
      <span style={{fontFamily: T.sans, fontWeight: 900, fontSize: el.size ?? 120, lineHeight: 1, letterSpacing: -4, ...gradText}}>{String(v).padStart(el.pad ?? 2, '0')}</span>
      {el.label && <span style={{fontFamily: T.mono, fontSize: 24, letterSpacing: 6, color: T.white, paddingBottom: 18}}>{el.label.toUpperCase()}</span>}
    </div>
  );
};

// ───────────────────────── robot: mascote (agente) com leve flutuação
export const RobotSvg: React.FC<{size?: number; color?: string; seed?: number}> = ({size = 120, color = T.pink, seed = 0}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 9 + seed) * 4;
  const blink = (frame + seed * 13) % 90 < 4;
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 80 100" style={{transform: `translateY(${bob}px)`, filter: `drop-shadow(0 0 10px ${color}99)`}}>
      <line x1="40" y1="4" x2="40" y2="14" stroke={color} strokeWidth="3" />
      <circle cx="40" cy="4" r="4" fill={color} />
      <rect x="12" y="14" width="56" height="40" rx="10" fill={color} />
      <rect x="20" y="22" width="40" height="22" rx="6" fill="#16101A" />
      {blink ? (
        <>
          <rect x="27" y="32" width="9" height="2" fill="#fff" />
          <rect x="44" y="32" width="9" height="2" fill="#fff" />
        </>
      ) : (
        <>
          <rect x="27" y="27" width="9" height="11" rx="2" fill="#fff" />
          <rect x="44" y="27" width="9" height="11" rx="2" fill="#fff" />
        </>
      )}
      <rect x="20" y="58" width="40" height="28" rx="6" fill={color} />
      <rect x="28" y="64" width="24" height="9" rx="2" fill="#fff" opacity="0.85" />
      <rect x="6" y="60" width="10" height="20" rx="5" fill={color} />
      <rect x="64" y="60" width="10" height="20" rx="5" fill={color} />
      <rect x="24" y="86" width="10" height="12" rx="3" fill={color} />
      <rect x="46" y="86" width="10" height="12" rx="3" fill={color} />
    </svg>
  );
};
const Robot: React.FC<P> = ({el}) => <RobotSvg size={el.size ?? 120} color={el.color ?? T.pink} seed={el.seed ?? 0} />;

// ───────────────────────── robots: grid de agentes com rótulos aparecendo em sequência
const Robots: React.FC<P> = ({el}) => {
  const {frame, fps} = useT();
  const labels: string[] = el.labels ?? [];
  const count: number = el.count ?? 9;
  const cols: number = el.cols ?? 3;
  return (
    <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, 190px)`, gap: 14, padding: 18, borderRadius: 22, background: T.panel, border: `2px solid ${T.panelBorder}`, boxShadow: T.glow(T.pink, 26)}}>
      {Array.from({length: count}, (_, i) => {
        const p = popIn(frame, fps, el.at + i * (el.stagger ?? 0.07), 11);
        const lp = popIn(frame, fps, (el.labelsAt ?? el.at + 0.8) + i * 0.08, 14);
        const row = Math.floor(i / cols);
        const c = [T.pink, '#D63AA8', T.purple][row % 3];
        return (
          <div key={i} style={{height: 190, borderRadius: 14, border: `2px solid ${c}88`, background: `${c}14`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${p})`, opacity: p}}>
            <RobotSvg size={78} color={c} seed={i} />
            {labels[i] && (
              <div style={{marginTop: 6, fontFamily: T.mono, fontSize: 15, letterSpacing: 2, color: T.white, opacity: lp, display: 'flex', gap: 6, alignItems: 'center'}}>
                <span style={{width: 8, height: 8, borderRadius: 4, background: c}} />
                {labels[i].toUpperCase()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ───────────────────────── terminal: comando digitado letra a letra
const Terminal: React.FC<P> = ({el}) => {
  const {frame, fps, t} = useT();
  const cmd: string = el.command ?? 'npx skills add usuario/repo';
  const n = Math.floor(ease(frame, fps, el.at + 0.2, el.at + 0.2 + (el.typeDur ?? 1.2), 0, cmd.length, Easing.linear));
  const caret = Math.floor(t * 2) % 2 === 0;
  return (
    <div style={{width: el.width ?? 860, borderRadius: 16, background: '#0A070B', border: `2px solid ${T.panelBorder}`, boxShadow: T.glow(T.pink, 22), fontFamily: T.mono, overflow: 'hidden'}}>
      <div style={{display: 'flex', gap: 8, padding: '12px 16px', borderBottom: '1px solid #2a222c'}}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <span key={c} style={{width: 13, height: 13, borderRadius: 7, background: c}} />
        ))}
      </div>
      <div style={{padding: '22px 24px', fontSize: 26, color: T.white, whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>
        <span style={{color: T.pink}}>{el.prompt ?? '$'} </span>
        {cmd.slice(0, n)}
        <span style={{opacity: caret ? 1 : 0, color: T.pink}}>▌</span>
      </div>
      {el.note && <div style={{padding: '0 24px 20px', fontSize: 20, color: T.grey, opacity: n >= cmd.length ? 1 : 0}}>{el.note}</div>}
    </div>
  );
};

// ───────────────────────── checklist: itens marcando ✓ em sequência
const Checklist: React.FC<P> = ({el}) => {
  const {frame, fps} = useT();
  const items: string[] = el.items ?? [];
  return (
    <div style={{width: el.width ?? 520, padding: 26, borderRadius: 18, background: T.panel, border: `2px solid ${T.panelBorder}`, boxShadow: T.glow(T.pink, 22), fontFamily: T.sans}}>
      {el.title && <div style={{fontFamily: T.mono, fontSize: 19, letterSpacing: 4, color: T.pink, marginBottom: 16}}>{el.title.toUpperCase()}</div>}
      {items.map((it, i) => {
        const at = el.at + 0.25 + i * (el.stagger ?? 0.35);
        const p = popIn(frame, fps, at, 14);
        const c = popIn(frame, fps, at + 0.15, 10);
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: i ? 14 : 0, opacity: p, transform: `translateX(${(1 - p) * -30}px)`}}>
            <div style={{width: 34, height: 34, borderRadius: 17, background: T.green, display: 'grid', placeItems: 'center', transform: `scale(${c})`}}>
              <Icon name="check" size={22} color="#fff" stroke={3} />
            </div>
            <span style={{fontSize: 30, fontWeight: 700, color: T.white}}>{it}</span>
          </div>
        );
      })}
    </div>
  );
};

// ───────────────────────── text: texto livre (mono = rótulo técnico; senão headline)
const Text: React.FC<P> = ({el}) => (
  <div style={{fontFamily: el.mono ? T.mono : T.sans, fontWeight: el.mono ? 500 : 900, fontSize: el.size ?? 48, letterSpacing: el.mono ? 4 : -1, color: el.color ?? T.white, textAlign: 'center', whiteSpace: 'pre-line', ...(el.gradient ? gradText : {})}}>{el.text}</div>
);

// ───────────────────────── chip: pílula com ícone ("● TOCANDO O SEU PERFIL")
const Chip: React.FC<P> = ({el}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 22px', borderRadius: 30, background: T.panel, border: `2px solid ${T.panelBorder}`, fontFamily: T.mono, fontSize: 20, letterSpacing: 3, color: T.white, boxShadow: T.glow(T.pink, 14)}}>
    {el.icon ? <Icon name={el.icon} size={24} color={T.pink} /> : <span style={{width: 12, height: 12, borderRadius: 6, background: T.pink}} />}
    {(el.text ?? '').toUpperCase()}
  </div>
);

// ───────────────────────── iconTile: um ícone grande em tile com gradiente
const IconTile: React.FC<P> = ({el}) => (
  <div style={{width: el.size ?? 160, height: el.size ?? 160, borderRadius: 28, background: T.grad, display: 'grid', placeItems: 'center', boxShadow: T.glow(T.pink, 30)}}>
    <Icon name={el.icon ?? 'star'} size={(el.size ?? 160) * 0.5} color="#fff" />
  </div>
);

// ───────────────────────── cursor: seta com etiqueta da marca percorrendo pontos; clique = onda
const Cursor: React.FC<P> = ({el, brandTag}) => {
  const {t} = useT();
  const path: {at: number; x: number; y: number; click?: boolean}[] = el.path ?? [{at: el.at, x: el.x ?? 540, y: el.y ?? 480}];
  let x = path[0].x, y = path[0].y;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1];
    if (t >= a.at && t <= b.at) {
      const k = Easing.inOut(Easing.cubic)((t - a.at) / Math.max(0.001, b.at - a.at));
      x = a.x + (b.x - a.x) * k;
      y = a.y + (b.y - a.y) * k;
    } else if (t > b.at) {
      x = b.x;
      y = b.y;
    }
  }
  const lastClick = [...path].reverse().find((p) => p.click && t >= p.at);
  const ct = lastClick ? t - lastClick.at : 9;
  const press = ct < 0.15 ? 0.85 : 1;
  return (
    <div style={{position: 'absolute', left: x, top: y, pointerEvents: 'none'}}>
      {ct < 0.6 && <div style={{position: 'absolute', left: -40 * (ct / 0.6) * 1.5, top: -40 * (ct / 0.6) * 1.5, width: 80 * (ct / 0.6) * 1.5, height: 80 * (ct / 0.6) * 1.5, borderRadius: '50%', border: `3px solid ${T.white}`, opacity: 1 - ct / 0.6}} />}
      <svg width={38} height={44} viewBox="0 0 19 22" style={{transform: `scale(${press})`, transformOrigin: '0 0', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.6))'}}>
        <path d="M1 1l16 9-7 1.5L6.5 20z" fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', left: 26, top: 34, background: T.tag, color: '#fff', fontFamily: T.sans, fontWeight: 700, fontSize: 19, padding: '4px 10px', borderRadius: 6, whiteSpace: 'nowrap'}}>{el.tag ?? brandTag}</div>
    </div>
  );
};

// ───────────────────────── panel: moldura neon (para montar "cenários" atrás de outros elementos)
const Panel: React.FC<P> = ({el}) => (
  <div style={{width: el.w ?? 900, height: el.h ?? 520, borderRadius: 26, background: 'linear-gradient(180deg,#1A0A16,#0B060A)', border: `2px solid ${T.panelBorder}`, boxShadow: T.glow(T.pink, 30), position: 'relative'}}>
    {el.label && (
      <div style={{position: 'absolute', left: 24, top: 22, display: 'flex', gap: 10, alignItems: 'center', padding: '8px 16px', borderRadius: 10, background: '#1E1220', border: `1px solid ${T.panelBorder}`, fontFamily: T.mono, fontSize: 19, letterSpacing: 3, color: T.white}}>
        {el.icon && <Icon name={el.icon} size={22} color={T.pink} />}
        {el.label.toUpperCase()}
      </div>
    )}
  </div>
);

export const REGISTRY: Record<string, React.FC<P>> = {
  kinetic: Kinetic,
  phone: Phone,
  card: Card,
  badge: Badge,
  counter: Counter,
  robot: Robot,
  robots: Robots,
  terminal: Terminal,
  checklist: Checklist,
  text: Text,
  chip: Chip,
  iconTile: IconTile,
  panel: Panel,
  cursor: Cursor,
};

// Envoltório comum: posiciona pelo centro (x,y), faz o "pop" de entrada e o fade de saída.
// Elementos com animação própria de entrada (kinetic, badge, cursor) pulam o pop.
const SELF_ANIMATED = new Set(['kinetic', 'badge', 'cursor']);
export const Element: React.FC<{el: El; chapterEnd: number; brandTag: string}> = ({el, chapterEnd, brandTag}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const out = el.out ?? chapterEnd;
  if (t < el.at - 0.01 || t > out + 0.01) return null;
  const Comp = REGISTRY[el.type];
  if (!Comp) return null;
  if (el.type === 'cursor') return <Comp el={el} brandTag={brandTag} />;
  const p = SELF_ANIMATED.has(el.type) ? 1 : popIn(frame, fps, el.at);
  const o = interpolate(frame, [(out - 0.2) * fps, out * fps], [1, 0], clamp);
  // deslocamentos animados: moveTo = {at,x?,y?,scale?,dur?} ou uma lista deles (em ordem)
  let x = el.x ?? 540, y = el.y ?? 560, sc = el.scale ?? 1;
  const moves = el.moveTo ? (Array.isArray(el.moveTo) ? el.moveTo : [el.moveTo]) : [];
  for (const m of moves) {
    const k = Easing.inOut(Easing.cubic)(interpolate(t, [m.at, m.at + (m.dur ?? 0.5)], [0, 1], clamp));
    x += ((m.x ?? x) - x) * k;
    y += ((m.y ?? y) - y) * k;
    sc += ((m.scale ?? sc) - sc) * k;
  }
  const s = sc * (0.6 + 0.4 * p) * (1 + (1 - o) * 0.06);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - p) * 30}px) scale(${s})`, opacity: Math.min(p * 1.4, 1) * o}}>
      <Comp el={el} brandTag={brandTag} />
    </div>
  );
};
