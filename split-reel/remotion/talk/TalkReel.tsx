import React from 'react';
import {AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {G, TW, TH} from './theme';
import {Scene, TalkProps, TItem} from './types';
import {clamp, popIn, ease, rnd} from '../anim';
import {Icon} from '../elements/Icon';
import {Captions} from '../elements/Captions';

const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {frame, fps, t: frame / fps};
};

// ───────── fundo escuro: brilho verde, grade de pontos e (opcional) grade em perspectiva no chão
const DarkBg: React.FC<{floor?: boolean}> = ({floor}) => (
  <AbsoluteFill style={{background: G.bg}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 55% at 70% 20%, rgba(60,140,10,.35), transparent 70%)'}} />
    <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(124,255,30,.12) 1.4px, transparent 1.4px)', backgroundSize: '44px 44px', maskImage: 'radial-gradient(ellipse 80% 70% at 50% 45%, #000 20%, transparent 80%)'}} />
    {floor && (
      <div style={{position: 'absolute', left: -200, right: -200, bottom: 0, height: 420, transform: 'perspective(500px) rotateX(62deg)', transformOrigin: 'bottom', backgroundImage: 'linear-gradient(rgba(124,255,30,.28) 2px, transparent 2px), linear-gradient(90deg, rgba(124,255,30,.28) 2px, transparent 2px)', backgroundSize: '90px 90px', maskImage: 'linear-gradient(transparent, #000 70%)'}} />
    )}
  </AbsoluteFill>
);

const LightBg: React.FC = () => (
  <AbsoluteFill style={{background: G.light}}>
    <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(0,0,0,.10) 1.4px, transparent 1.4px)', backgroundSize: '40px 40px'}} />
    {[[60, 60], [TW - 60, 60], [60, TH - 60], [TW - 60, TH - 60]].map(([x, y], i) => (
      <div key={i} style={{position: 'absolute', left: x - 8, top: y - 12, fontFamily: G.mono, fontSize: 26, color: G.ink}}>+</div>
    ))}
  </AbsoluteFill>
);

// ───────── rosto
const Face: React.FC<{p: TalkProps; style: React.CSSProperties}> = ({p, style}) => {
  const {fps} = useVideoConfig();
  return (
    <OffthreadVideo src={staticFile(p.video)} startFrom={Math.round((p.videoStart ?? 0) * fps)} style={{objectFit: 'cover', objectPosition: p.objectPosition ?? '50% 35%', ...style}} />
  );
};

// ───────── marca d'água + barra de progresso (sempre presentes)
const Brand: React.FC<{brand: string; dark: boolean; total: number}> = ({brand, dark, total}) => {
  const {t} = useT();
  const col = dark ? G.white : G.ink;
  return (
    <>
      <div style={{position: 'absolute', left: 64, top: 44, fontFamily: G.sans, fontWeight: 800, fontSize: 34, letterSpacing: -1, color: col}}>{brand}</div>
      <div style={{position: 'absolute', left: 64, right: 64, bottom: 40, height: 6}}>
        <div style={{position: 'absolute', inset: 0, borderTop: `3px dashed ${dark ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)'}`, top: 1}} />
        <div style={{position: 'absolute', left: 0, top: -2, height: 7, width: `${Math.min(1, t / total) * 100}%`, background: G.green, borderRadius: 4, boxShadow: dark ? G.glow(8) : 'none'}}>
          <div style={{position: 'absolute', right: -6, top: -3, width: 13, height: 13, borderRadius: 7, background: G.green}} />
        </div>
      </div>
    </>
  );
};

// ───────── título condensado: palavras entram em cascata; `accent` fica verde
const Head: React.FC<{head: NonNullable<Scene['head']>; dark: boolean; at: number; size?: number; x?: number; y?: number; align?: 'left' | 'center'}> = ({head, dark, at, size = 92, x = TW / 2, y = 110, align = 'center'}) => {
  const {frame, fps} = useT();
  const ws = head.text.split(' ');
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: align === 'center' ? 'translateX(-50%)' : undefined, display: 'flex', gap: 22, flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : 'flex-start', width: align === 'center' ? 1500 : 760}}>
      {ws.map((w, i) => {
        const p = popIn(frame, fps, (head.at ?? at) + i * 0.1, 14);
        const acc = head.accent && w.toLowerCase() === head.accent.toLowerCase();
        return (
          <span key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 40}px)`, fontFamily: G.cond, fontSize: size, lineHeight: 1.05, textTransform: 'uppercase', color: acc ? G.green : dark ? G.white : G.ink, textShadow: acc && dark ? G.glow(20) : 'none'}}>{w}</span>
        );
      })}
    </div>
  );
};

// ───────── itens (por cima de qualquer layout)
const Tag: React.FC<{it: TItem; dark: boolean}> = ({it, dark}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderRadius: 30, background: it.solid ? G.green : dark ? 'rgba(10,14,8,.78)' : G.ink, border: `1.5px solid ${it.solid ? G.green : 'rgba(255,255,255,.18)'}`, color: it.solid ? '#000' : G.white, fontFamily: G.sans, fontWeight: 700, fontSize: it.size ?? 30, whiteSpace: 'nowrap'}}>
    {it.icon && <Icon name={it.icon} size={26} color={it.solid ? '#000' : G.green} />}
    {it.text}
  </div>
);

// Rótulo mono pequeno com ponto verde ("• EM PORTUGUÊS")
const Eyebrow: React.FC<{it: TItem; dark: boolean}> = ({it, dark}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: G.mono, fontSize: it.size ?? 22, letterSpacing: 4, color: dark ? G.white : G.ink}}>
    <span style={{width: 11, height: 11, borderRadius: 6, background: G.green, boxShadow: dark ? G.glow(8) : 'none'}} />
    {(it.text ?? '').toUpperCase()}
  </div>
);

// Palavra gigante condensada, com a palavra anterior sumindo/cinza ("CLONE" atrás de "QUALQUER")
const Big: React.FC<{it: TItem}> = ({it}) => {
  const {frame, fps} = useT();
  const p = popIn(frame, fps, it.at, 11);
  return (
    <div style={{fontFamily: G.cond, fontSize: it.size ?? 150, lineHeight: 1, textTransform: 'uppercase', color: it.green ? G.green : G.white, opacity: p * (it.ghost ? 0.28 : 1), transform: `translateY(${(1 - p) * 70}px) scale(${0.9 + 0.1 * p})`, textShadow: it.green ? G.glow(24) : '0 6px 30px rgba(0,0,0,.6)', letterSpacing: 1}}>{it.text}</div>
  );
};

// Contador estilo "odômetro" (1 → 99)
const Odometer: React.FC<{it: TItem}> = ({it}) => {
  const {frame, fps} = useT();
  const v = Math.round(ease(frame, fps, it.at, it.at + (it.duration ?? 1.4), it.from ?? 0, it.to ?? 99, Easing.out(Easing.cubic)));
  return (
    <div style={{width: 250, padding: '16px 22px', borderRadius: 18, background: 'rgba(8,12,6,.82)', border: '1.5px solid rgba(124,255,30,.4)', fontFamily: G.sans, color: G.white, boxShadow: G.glow(14)}}>
      <div style={{fontSize: 24, fontWeight: 700, opacity: 0.8}}>{it.label ?? 'Qualquer app'}</div>
      <div style={{fontFamily: G.cond, fontSize: 110, lineHeight: 1.1, textAlign: 'center', color: G.green}}>{v}</div>
      <div style={{fontFamily: G.mono, fontSize: 16, letterSpacing: 4, textAlign: 'center', opacity: 0.6}}>{(it.sub ?? 'CLONES').toUpperCase()}</div>
    </div>
  );
};

// Janela de app em perspectiva (painel flutuante de "screenshot"). `tilt` = ±graus em Y.
const Panel: React.FC<{it: TItem}> = ({it}) => {
  const {frame, fps} = useT();
  const p = popIn(frame, fps, it.at, 13);
  const w = it.w ?? 380, h = it.h ?? 250;
  const lines = it.lines ?? 7;
  return (
    <div style={{width: w, height: h, borderRadius: 14, background: '#F3F5F0', border: `3px solid ${G.green}`, boxShadow: G.glow(22), transform: `perspective(900px) rotateY(${(it.tilt ?? 18) * p}deg) scale(${0.7 + 0.3 * p})`, opacity: p, overflow: 'hidden'}}>
      <div style={{height: 26, background: '#E4E7DF', display: 'flex', gap: 6, alignItems: 'center', paddingLeft: 12}}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} style={{width: 9, height: 9, borderRadius: 5, background: c}} />)}
      </div>
      <div style={{padding: 18}}>
        {it.title && <div style={{fontFamily: G.sans, fontWeight: 800, fontSize: 24, color: G.ink, marginBottom: 12}}>{it.title}</div>}
        {Array.from({length: lines}, (_, i) => <div key={i} style={{height: 9, borderRadius: 5, background: i % 3 === 0 ? '#C9CEC2' : '#DDE1D7', width: `${55 + rnd(i + 2) * 40}%`, marginTop: 10}} />)}
      </div>
    </div>
  );
};

// Linha tracejada verde que "desenha" uma curva (transição de cena)
const Wave: React.FC<{it: TItem}> = ({it}) => {
  const {frame, fps} = useT();
  const k = ease(frame, fps, it.at, it.at + (it.duration ?? 1.2), 0, 1, Easing.inOut(Easing.cubic));
  return (
    <svg width={TW} height={500} viewBox={`0 0 ${TW} 500`} style={{position: 'absolute', left: 0, top: it.y ?? 520}}>
      <path d={`M-40 300 C 300 ${it.amp ?? 360}, 700 120, 1100 260 S 1700 420, ${TW + 40} 220`} fill="none" stroke={G.green} strokeWidth={12} strokeLinecap="round" strokeDasharray="70 36" pathLength={1000} strokeDashoffset={1000 - 1000 * k} style={{filter: `drop-shadow(0 0 12px ${G.green})`}} />
    </svg>
  );
};

// Janela de app com ícones (layout light): "Um app que chama atenção"
const AppWindow: React.FC<{it: TItem}> = ({it}) => {
  const {frame, fps, t} = useT();
  const items: {icon: string; label: string}[] = it.apps ?? [];
  const hl: number = it.highlight ?? -1;
  return (
    <div style={{width: 560, border: `3px solid ${G.ink}`, borderRadius: 12, background: '#fff', fontFamily: G.mono, overflow: 'hidden'}}>
      <div style={{background: G.ink, color: '#fff', padding: '8px 14px', fontSize: 16, letterSpacing: 3, display: 'flex', gap: 10, alignItems: 'center'}}>
        <span style={{letterSpacing: 4}}>● ● ●</span> {(it.title ?? 'SEU COMPUTADOR').toUpperCase()}
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, padding: 26}}>
        {items.map((a, i) => {
          const p = popIn(frame, fps, it.at + 0.2 + i * 0.08, 13);
          const on = hl === i && t >= (it.highlightAt ?? 0);
          return (
            <div key={i} style={{textAlign: 'center', opacity: p, transform: `scale(${p})`}}>
              <div style={{width: 84, height: 84, margin: '0 auto', borderRadius: 18, background: on ? G.green : G.ink, display: 'grid', placeItems: 'center', boxShadow: on ? `0 0 0 4px ${G.ink}` : 'none'}}>
                <Icon name={a.icon} size={40} color={on ? G.ink : '#fff'} />
              </div>
              <div style={{fontSize: 15, letterSpacing: 2, color: G.ink, marginTop: 8}}>{a.label.toUpperCase()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Grade de blocos que vão acendendo (90% dos serviços)
const Blocks: React.FC<{it: TItem}> = ({it}) => {
  const {frame, fps} = useT();
  const n = it.total ?? 10, on = it.on ?? 9;
  return (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 76px)', gap: 12}}>
      {Array.from({length: n}, (_, i) => {
        const p = popIn(frame, fps, it.at + i * 0.1, 14);
        const lit = i < on;
        return (
          <div key={i} style={{height: 64, borderRadius: 10, background: lit ? G.ink : 'transparent', border: lit ? 'none' : `2px dashed ${G.ink}`, display: 'grid', placeItems: 'center', transform: `scale(${p})`}}>
            {lit && <span style={{width: 9, height: 9, borderRadius: 5, background: G.green}} />}
          </div>
        );
      })}
    </div>
  );
};

// Pílula de botão "Gostei / Inscrever-se" com cursor que clica e vira verde
const ClickBtn: React.FC<{it: TItem}> = ({it}) => {
  const {frame, fps, t} = useT();
  const p = popIn(frame, fps, it.at, 14);
  const done = t >= it.clickAt;
  const press = t >= it.clickAt && t < it.clickAt + 0.15 ? 0.92 : 1;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '12px 26px', borderRadius: 30, background: done ? G.green : 'rgba(12,14,10,.85)', color: done ? '#000' : G.white, border: '1.5px solid rgba(255,255,255,.2)', fontFamily: G.sans, fontWeight: 800, fontSize: 28, opacity: p, transform: `scale(${p * press})`, boxShadow: done ? G.glow(16) : 'none'}}>
      <Icon name={done ? 'check' : it.icon ?? 'star'} size={26} color={done ? '#000' : G.white} />
      {done ? it.doneText ?? it.text : it.text}
    </div>
  );
};

const ITEMS: Record<string, React.FC<{it: TItem; dark: boolean}>> = {
  tag: Tag,
  eyebrow: Eyebrow,
  big: ({it}) => <Big it={it} />,
  odometer: ({it}) => <Odometer it={it} />,
  panel: ({it}) => <Panel it={it} />,
  wave: ({it}) => <Wave it={it} />,
  appwindow: ({it}) => <AppWindow it={it} />,
  blocks: ({it}) => <Blocks it={it} />,
  btn: ({it}) => <ClickBtn it={it} />,
  head: ({it, dark}) => <Head head={{text: it.text, accent: it.accent, at: it.at}} dark={dark} at={it.at} size={it.size} align="left" x={0} y={0} />,
};

const Item: React.FC<{it: TItem; sceneEnd: number; dark: boolean}> = ({it, sceneEnd, dark}) => {
  const {frame, fps, t} = useT();
  const out = it.out ?? sceneEnd;
  if (t < it.at - 0.01 || t > out + 0.01) return null;
  const C = ITEMS[it.type];
  if (!C) return null;
  const p = it.type === 'wave' ? 1 : popIn(frame, fps, it.at, 14);
  const o = interpolate(frame, [(out - 0.18) * fps, out * fps], [1, 0], clamp);
  const moves = it.moveTo ? (Array.isArray(it.moveTo) ? it.moveTo : [it.moveTo]) : [];
  let x = it.x ?? 0, y = it.y ?? 0;
  for (const m of moves) {
    const k = Easing.inOut(Easing.cubic)(interpolate(t, [m.at, m.at + (m.dur ?? 0.5)], [0, 1], clamp));
    x += ((m.x ?? x) - x) * k;
    y += ((m.y ?? y) - y) * k;
  }
  const pos: React.CSSProperties = it.type === 'wave' ? {} : {position: 'absolute', left: x, top: y, transform: `translate(${it.center === false ? '0,0' : '-50%,-50%'}) translateY(${(1 - p) * 24}px) scale(${it.scale ?? 1})`, opacity: Math.min(1, p * 1.4) * o};
  return (
    <div style={pos}>
      <C it={it} dark={dark} />
    </div>
  );
};

// ───────── cenas
const SceneView: React.FC<{sc: Scene; p: TalkProps; total: number}> = ({sc, p, total}) => {
  const {t} = useT();
  if (t < sc.start - 0.05 || t >= sc.end) return null;
  const dark = sc.layout !== 'light';
  const fade = interpolate(t, [sc.start, sc.start + 0.2, sc.end - 0.15, sc.end], [0, 1, 1, 0], clamp);
  const faceIn = (extra: React.CSSProperties) => <Face p={p} style={{position: 'absolute', ...extra}} />;
  const headAt = sc.head?.at ?? sc.start;
  return (
    <AbsoluteFill style={{opacity: sc.layout === 'full' ? 1 : fade}}>
      {sc.layout === 'full' && faceIn({inset: 0, width: TW, height: TH})}
      {sc.layout === 'full' && <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,.45), transparent 22%, transparent 70%, rgba(0,0,0,.55))'}} />}
      {sc.layout === 'stage' && (
        <>
          <DarkBg />
          {sc.head && <Head head={sc.head} dark at={headAt} />}
          <div style={{position: 'absolute', left: TW / 2 - 195, top: 215, width: 390, height: 730, borderRadius: 16, overflow: 'hidden', border: `3px solid ${G.green}`, boxShadow: G.glow(26)}}>{faceIn({inset: 0, width: 390, height: 730})}</div>
        </>
      )}
      {sc.layout === 'canvas' && (
        <>
          <DarkBg floor />
          {sc.head && <Head head={sc.head} dark at={headAt} />}
        </>
      )}
      {sc.layout === 'light' && (
        <>
          <LightBg />
          <div style={{position: 'absolute', left: TW - 640, top: 120, width: 520, height: 840, borderRadius: 18, overflow: 'hidden', border: `4px solid ${G.ink}`, boxShadow: `12px 12px 0 ${G.ink}`}}>{faceIn({inset: 0, width: 520, height: 840})}</div>
          {sc.head && <Head head={sc.head} dark={false} at={headAt} x={120} y={190} align="left" size={84} />}
        </>
      )}
      {sc.layout === 'screen' && (
        <>
          <DarkBg />
          {p.screen && (
            <div style={{position: 'absolute', left: 60, top: 100, width: 1230, height: 820, borderRadius: 14, overflow: 'hidden', border: '2px solid rgba(255,255,255,.18)', boxShadow: G.glow(20)}}>
              <OffthreadVideo src={staticFile(p.screen)} style={{width: '100%', height: '100%', objectFit: 'cover'}} muted />
            </div>
          )}
          <div style={{position: 'absolute', left: 1330, top: 160, width: 530, height: 700, borderRadius: 18, overflow: 'hidden'}}>{faceIn({inset: 0, width: 530, height: 700})}</div>
          <div style={{position: 'absolute', left: 1330, top: 880, width: 530, textAlign: 'center', fontFamily: G.sans, fontWeight: 800, fontSize: 40, color: G.white}}>{p.handle}</div>
        </>
      )}
      {sc.items.map((it, i) => (
        <Item key={i} it={it} sceneEnd={sc.end} dark={dark} />
      ))}
    </AbsoluteFill>
  );
};

export const TalkReel: React.FC<TalkProps> = (p) => {
  const total = Math.max(...p.scenes.map((s) => s.end));
  const {t} = useT();
  const cur = p.scenes.find((s) => t >= s.start && t < s.end) ?? p.scenes[p.scenes.length - 1];
  return (
    <AbsoluteFill style={{background: G.bg}}>
      {/* o rosto fica sempre montado atrás: o áudio vem dele, e as cenas só reposicionam o vídeo por cima */}
      <AbsoluteFill>
        <Face p={p} style={{position: 'absolute', inset: 0, width: TW, height: TH, opacity: 0.001}} />
      </AbsoluteFill>
      {p.scenes.map((s, i) => (
        <SceneView key={i} sc={s} p={p} total={total} />
      ))}
      <Brand brand={p.brand ?? 'vértice'} dark={cur.layout !== 'light'} total={total} />
      <Captions words={p.words} maxWords={3} maxChars={22} variant="plain" dark={cur.layout !== 'light'} fontFamily={G.cond} size={64} top={TH - 190} width={TW} />
    </AbsoluteFill>
  );
};
