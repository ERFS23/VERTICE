"""Valida a mixagem de SFX: sincronia (razão ataque-no-cue / ataque-aleatório), loudness e nível relativo à voz.
Uso (na raiz de split-reel, depois de render + sfx): python3 scripts/audio/sfx-check.py <projeto>"""
import sys, wave, json, subprocess, numpy as np
from scipy.signal import stft
name=sys.argv[1]
def dec(src,dst): subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-vn','-ac','2','-ar','44100',dst],check=True)
def load(f):
    w=wave.open(f); d=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
    return d.reshape(-1,w.getnchannels()).mean(1),w.getframerate()
dec(f'out/{name}.mp4','/tmp/_o.wav'); dec(f'out/{name}-sfx.mp4','/tmp/_m.wav')
cues=json.load(open(f'out/{name}.cues.json')); ev=[c[0] for c in cues if c[1] in ('pop','click','ding','thud','whoosh')]
xo,sr=load('/tmp/_o.wav'); xm,_=load('/tmp/_m.wav'); xs,_=load(f'out/{name}-sfx.wav'); n=min(len(xo),len(xs))
# nível do SFX contra a voz na janela de cada cue (0 a 150 ms depois do disparo), em dB (RMS)
rms=lambda v:20*np.log10(np.sqrt((v**2).mean())+1e-9)
d=[]
for t,nm,g in cues:
    a=int(t*sr); b=a+int(.15*sr)
    if b<=min(len(xo),len(xs)): d.append(rms(xs[a:b])-rms(xo[a:b]))
d=np.array(d); print(f'SFX vs voz na janela do cue: mediana {np.median(d):.1f} dB | p10 {np.percentile(d,10):.1f} | p90 {np.percentile(d,90):.1f} | cues a menos de 12 dB da voz: {100*np.mean(d>-12):.0f}% | acima da voz (mascaram): {100*np.mean(d>0):.0f}%')
for lab,f in (('sem SFX','/tmp/_o.wav'),('com SFX','/tmp/_m.wav')):
    r=subprocess.run(['ffmpeg','-nostats','-i',f,'-af','ebur128=peak=true','-f','null','-'],capture_output=True,text=True).stderr
    print(lab,[l.strip() for l in r.splitlines() if 'I:' in l or 'Peak:' in l][-2:])
pk=lambda v:20*np.log10(np.abs(v).max()+1e-9)
print(f'pico SFX {pk(xs):.1f} dBFS | pico voz {pk(xo):.1f} dBFS | SFX pico fica {pk(xo)-pk(xs):.1f} dB abaixo do pico da voz')
