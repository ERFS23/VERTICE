#!/usr/bin/env python3
"""SFX sintetizados + mixagem automática pelos tempos do projeto.

Todos os sons são gerados aqui (ruído filtrado, senoides, envelopes). Não usa nenhuma amostra de terceiros.

  python3 scripts/sfx.py <projeto> [--profile discreto|marcado] [--video out/<projeto>.mp4] [--cues-only]

Lê   public/projects/<projeto>/props.json   (gerado por render.mjs)
Gera out/<projeto>-sfx.wav  e  out/<projeto>.cues.json
Com --video, mixa o SFX no áudio do vídeo e grava out/<projeto>-sfx.mp4 (-14 LUFS, pico -1,5 dBTP, como nas referências).

Requer: numpy, ffmpeg.   (pip install numpy)
"""
import argparse
import json
import math
import subprocess
import wave
from pathlib import Path

import numpy as np

SR = 44100

# Nível do pico de um cue "0 dB" antes da mixagem final, por perfil (dBFS).
# Voz nas referências: picos em ~ -10 dBFS. "discreto" fica ~18 dB abaixo, "marcado" ~8 dB.
PROFILES = {'discreto': -10.0, 'marcado': -3.0}


# ───────────────────────── síntese ─────────────────────────
def _norm(x):
    p = float(np.max(np.abs(x))) or 1.0
    return (x / p).astype(np.float32)


def _t(n):
    return np.arange(n) / SR


def pop(f=620.0, dur=0.14):
    """Bolha curta: seno que cai de pitch + estalo mínimo. Entrada de elemento."""
    n = int(dur * SR); t = _t(n)
    freq = f * np.exp(-t * 18) + f * 0.35
    ph = 2 * np.pi * np.cumsum(freq) / SR
    x = np.sin(ph) * np.exp(-t * 34)
    x[: int(0.002 * SR)] += np.random.default_rng(1).standard_normal(int(0.002 * SR)) * 0.4
    return _norm(x)


def tick(f=2600.0, dur=0.03):
    """Estalo seco e agudo: digitação, cascatas, contadores."""
    n = int(dur * SR); t = _t(n)
    x = np.sin(2 * np.pi * f * t) * np.hanning(n) ** 2 * np.exp(-t * 90)
    return _norm(x)


def click(dur=0.09):
    """Clique de mouse: dois estalos (descida + subida) com um corpo grave curtinho."""
    n = int(dur * SR); x = np.zeros(n)
    a = tick(1900, 0.02); b = tick(2500, 0.018)
    x[: len(a)] += a
    ofs = int(0.055 * SR); x[ofs: ofs + len(b)] += b * 0.7
    t = _t(int(0.025 * SR)); x[: len(t)] += np.sin(2 * np.pi * 170 * t) * np.exp(-t * 120) * 0.6
    return _norm(x)


def ding(f=1320.0, dur=0.5):
    """Sino curto e limpo: check, sucesso, 'inscrito'."""
    n = int(dur * SR); t = _t(n)
    x = (np.sin(2 * np.pi * f * t) + 0.45 * np.sin(2 * np.pi * f * 1.5 * t) + 0.2 * np.sin(2 * np.pi * f * 2.01 * t)) * np.exp(-t * 7)
    x *= np.minimum(1, t / 0.003)
    return _norm(x)


def thud(dur=0.35):
    """Impacto grave: selo, explosão de letras."""
    n = int(dur * SR); t = _t(n)
    freq = 95 * np.exp(-t * 7) + 38
    x = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 11)
    noise = np.random.default_rng(3).standard_normal(n) * np.exp(-t * 60) * 0.25
    return _norm(x + noise)


def sweep(dur=0.45, f0=350.0, f1=5200.0, q=0.22, peak=0.7, seed=0):
    """Whoosh: ruído passado por um filtro ressonante cujo centro varre f0→f1 (use f1<f0 para 'queda').
    Envelope assimétrico: sobe até `peak` da duração e desce suave."""
    n = int(dur * SR); noise = np.random.default_rng(seed).standard_normal(n)
    f = np.geomspace(f0, f1, n)
    g = 2 * np.sin(np.pi * np.minimum(f, SR / 6) / SR)
    lp = bp = 0.0; out = np.empty(n)
    for i in range(n):  # filtro de variável de estado (Chamberlin)
        lp += g[i] * bp
        hp = noise[i] - lp - q * bp
        bp += g[i] * hp
        out[i] = bp
    u = np.linspace(0, 1, n)
    env = np.where(u < peak, (u / peak) ** 2, np.cos((u - peak) / (1 - peak) * np.pi / 2) ** 2)
    return _norm(out * env)


def whoosh(dur=0.45):
    return sweep(dur, 350, 5200)


def fall(dur=0.7):
    return sweep(dur, 4200, 260, peak=0.15)


_CACHE = {}


def synth(name, **kw):
    key = (name, tuple(sorted(kw.items())))
    if key not in _CACHE:
        _CACHE[key] = {'pop': pop, 'tick': tick, 'click': click, 'ding': ding, 'thud': thud, 'whoosh': whoosh, 'fall': fall}[name](**kw)
    return _CACHE[key]


# ───────────────────────── cues a partir do props.json ─────────────────────────
# Cada cue: (tempo_s, som, ganho_dB, kwargs). Ganho é relativo ao nível do perfil.
def cues_split(p):
    """Estilo 1 (9:16, tela dividida): capítulos + elementos."""
    c = []
    for ci, ch in enumerate(p['chapters']):
        if ci > 0:
            c.append((ch['start'] - 0.06, 'whoosh', -2, {'dur': 0.45}))
        if ch.get('title'):
            at = ch.get('titleAt', ch['start'])
            for i, _ in enumerate(ch['title']['text'].split()):
                c.append((at + i * 0.09, 'tick', -12, {'f': 2300 + 150 * i}))
        for el in ch['elements']:
            c += _el_split(el)
    return c


def _el_split(el):
    t, at = el['type'], el['at']
    c = []
    for m in (el['moveTo'] if isinstance(el.get('moveTo'), list) else [el['moveTo']] if el.get('moveTo') else []):
        c.append((m['at'], 'whoosh', -9, {'dur': 0.3}))
    if t == 'kinetic':
        st = el.get('stagger', 0.045)
        for i, ch in enumerate(el.get('text', '')):
            if ch != ' ':
                c.append((at + i * st, 'tick', -13, {'f': 2000 + 90 * i}))
        if el.get('explodeAt') is not None:
            e = el['explodeAt']
            c += [(e, 'thud', -1, {}), (e + 0.05, 'fall', -6, {'dur': 0.7})]
    elif t == 'phone':
        c.append((at, 'pop', -2, {}))
        ta = el.get('tilesAt', at + 0.3)
        for i in range(len(el.get('tiles', [None] * 9))):
            c.append((ta + i * 0.06, 'tick', -11, {'f': 1800 + 140 * i}))
        if el.get('highlight') is not None:
            c.append((el.get('highlightAt', 0), 'click', -3, {}))
        if el.get('swap'):
            s = el['swap']['at']
            c.append((s, 'whoosh', -8, {'dur': 0.35}))
            for i in range(9):
                c.append((s + i * 0.05, 'tick', -12, {'f': 2100 + 120 * i}))
    elif t == 'card':
        c.append((at, 'pop', -3, {'f': 520}))
    elif t == 'badge':
        c += [(at, 'thud', -6, {'dur': 0.25}), (at + 0.04, 'ding', -4, {'f': 1568})]
    elif t == 'counter':
        d = el.get('duration', 0.8); n = abs(el.get('to', 10) - el.get('from', 0))
        k = max(1, min(n, int(d / 0.06)))
        for i in range(k):
            c.append((at + d * (i / k) ** 0.7 * 0.95, 'tick', -14, {'f': 2200 + 40 * i}))
    elif t == 'robot':
        c.append((at, 'pop', -4, {'f': 700}))
    elif t == 'robots':
        st = el.get('stagger', 0.07)
        for i in range(el.get('count', 9)):
            c.append((at + i * st, 'pop', -7, {'f': 520 + 55 * (i % 5)}))
        for i, _ in enumerate(el.get('labels', [])):
            c.append((el.get('labelsAt', at + 0.8) + i * 0.08, 'tick', -15, {'f': 2400}))
    elif t == 'terminal':
        d = el.get('typeDur', 1.2); n = len(el.get('command', ''))
        k = max(1, min(n, int(d / 0.035)))
        for i in range(k):
            c.append((at + 0.2 + d * i / k, 'tick', -13, {'f': 2300 + (i * 97) % 500}))
        c.append((at + 0.2 + d + 0.05, 'ding', -9, {'f': 1760}))
    elif t == 'checklist':
        for i, _ in enumerate(el.get('items', [])):
            a = at + 0.25 + i * el.get('stagger', 0.35)
            c += [(a, 'pop', -8, {}), (a + 0.15, 'ding', -5, {'f': 1320 + 110 * i})]
    elif t in ('chip', 'iconTile', 'panel', 'text'):
        c.append((at, 'pop', -5, {'f': 640}))
    elif t == 'cursor':
        for pt in el.get('path', []):
            if pt.get('click'):
                c.append((pt['at'], 'click', -3, {}))
    return c


def cues_talk(p):
    """Estilo 2 (16:9, talking head): cenas/layouts + itens."""
    c = []
    for si, sc in enumerate(p['scenes']):
        if si > 0:
            c.append((sc['start'] - 0.06, 'whoosh', -2, {'dur': 0.4}))
        if sc.get('head'):
            at = sc['head'].get('at', sc['start'])
            for i, _ in enumerate(sc['head']['text'].split()):
                c.append((at + i * 0.1, 'tick', -12, {'f': 2300 + 150 * i}))
        for it in sc['items']:
            t, at = it['type'], it['at']
            for m in (it['moveTo'] if isinstance(it.get('moveTo'), list) else [it['moveTo']] if it.get('moveTo') else []):
                c.append((m['at'], 'whoosh', -9, {'dur': 0.3}))
            if t in ('tag', 'eyebrow', 'big'):
                c.append((at, 'pop', -4 if t == 'big' else -6, {'f': 560 if t == 'big' else 700}))
            elif t == 'panel':
                c += [(at, 'whoosh', -8, {'dur': 0.3}), (at + 0.05, 'pop', -6, {'f': 480})]
            elif t == 'wave':
                c.append((at, 'whoosh', -3, {'dur': it.get('duration', 1.2)}))
            elif t == 'odometer':
                d = it.get('duration', 1.4); n = abs(it.get('to', 99) - it.get('from', 0))
                k = max(1, min(n, int(d / 0.06)))
                c.append((at, 'pop', -6, {}))
                for i in range(k):
                    c.append((at + d * (i / k) ** 0.6 * 0.95, 'tick', -14, {'f': 2200 + 30 * i}))
            elif t == 'appwindow':
                for i, _ in enumerate(it.get('apps', [])):
                    c.append((at + 0.2 + i * 0.08, 'tick', -11, {'f': 1900 + 130 * i}))
                if it.get('highlight') is not None:
                    c.append((it.get('highlightAt', 0), 'click', -3, {}))
            elif t == 'blocks':
                for i in range(it.get('total', 10)):
                    c.append((at + i * 0.1, 'tick', -12, {'f': 1700 + 110 * i}))
            elif t == 'btn':
                c.append((at, 'pop', -7, {}))
                c += [(it['clickAt'], 'click', -2, {}), (it['clickAt'] + 0.06, 'ding', -5, {'f': 1568})]
            elif t == 'head':
                c.append((at, 'pop', -7, {}))
    return c


# ───────────────────────── mixagem ─────────────────────────
def render_track(cues, dur, base_db):
    n = int((dur + 1.0) * SR); y = np.zeros(n, dtype=np.float32)
    rng = np.random.default_rng(11)
    for tt, name, g, kw in sorted(cues, key=lambda x: x[0]):
        if tt < 0:
            continue
        s = synth(name, **kw)
        i = int(tt * SR)
        if i >= n:
            continue
        gain = 10 ** ((base_db + g + rng.uniform(-1.0, 1.0)) / 20)  # ±1 dB de variação humana
        seg = s[: n - i] * gain
        y[i: i + len(seg)] += seg
    return np.clip(y, -1, 1)


def write_wav(path, y):
    st = np.stack([y, y], 1)
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype('<i2').tobytes())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('project'); ap.add_argument('--profile', default='discreto', choices=PROFILES)
    ap.add_argument('--video'); ap.add_argument('--cues-only', action='store_true')
    a = ap.parse_args()
    props = json.loads(Path(f'public/projects/{a.project}/props.json').read_text())
    cues = cues_split(props) if 'chapters' in props else cues_talk(props)
    ends = [w['e'] for w in props.get('words', [])] + [props.get('durationSec', 0)]
    dur = max(ends)
    Path('out').mkdir(exist_ok=True)
    Path(f'out/{a.project}.cues.json').write_text(json.dumps([[round(t, 3), n, g] for t, n, g, _ in sorted(cues, key=lambda x: x[0])]))
    print(f'{len(cues)} cues, perfil {a.profile} ({PROFILES[a.profile]} dBFS no cue 0 dB)')
    if a.cues_only:
        return
    y = render_track(cues, dur, PROFILES[a.profile])
    wav = Path(f'out/{a.project}-sfx.wav'); write_wav(wav, y)
    if a.video:
        out = f'out/{a.project}-sfx.mp4'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a.video, '-i', str(wav), '-filter_complex',
                        '[0:a][1:a]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=7[a]',
                        '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', out], check=True)
        print('vídeo com SFX:', out)


if __name__ == '__main__':
    main()
