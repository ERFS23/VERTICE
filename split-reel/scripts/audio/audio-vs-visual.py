import sys, wave, json, numpy as np
from scipy.signal import stft
def load(f):
    w=wave.open(f); d=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
    return d.reshape(-1,w.getnchannels()).mean(1), w.getframerate()
x,sr=load(sys.argv[1]); ev=json.load(open(sys.argv[2])); name=sys.argv[3]
hop=441; f,t,Z=stft(x,sr,nperseg=2048,noverlap=2048-hop); M=np.abs(Z)
bands={'sub 30-120':(30,120),'low 120-500':(120,500),'mid .5-2k':(500,2000),'hi 2-6k':(2000,6000),'air 6-16k':(6000,16000)}
E={k:np.log1p(M[(f>=a)&(f<b)].sum(0)*20) for k,(a,b) in bands.items()}
def onset(v): return np.maximum(0,np.diff(v,prepend=v[0]))
O={k:onset(v) for k,v in E.items()}
rng=np.random.default_rng(1)
print(name,'eventos visuais:',len(ev))
# janela depois do evento: SFX costuma cair -20ms..+120ms do início visual
def win(o,tt,a=-0.05,b=0.12):
    i0=max(0,int((tt+a)*100)); i1=min(len(o),int((tt+b)*100)+1); return o[i0:i1].max() if i1>i0 else 0
for k in bands:
    o=O[k]; vals=np.array([win(o,e[0]) for e in ev])
    base=np.array([win(o,r) for r in rng.uniform(0.5,len(x)/sr-0.5,2000)])
    print(f'{k:12s} evento p50={np.median(vals):.3f} base p50={np.median(base):.3f} razão={np.median(vals)/np.median(base):.2f}  ',
          f'% eventos acima do p75 da base: {100*np.mean(vals>np.percentile(base,75)):.0f}%  p90: {100*np.mean(vals>np.percentile(base,90)):.0f}%')
# histograma de atraso: do maior onset hi+sub em ±0.4s ao evento
tot=O['hi 2-6k']+O['air 6-16k']+O['sub 30-120']
lags=[]
for e in ev:
    i0=max(0,int((e[0]-0.4)*100)); i1=min(len(tot),int((e[0]+0.4)*100)); j=i0+int(np.argmax(tot[i0:i1])); lags.append((j/100-e[0]))
lags=np.array(lags); print('atraso do pico de ataque vs evento visual (s): mediana',round(float(np.median(lags)),3),'p25',round(float(np.percentile(lags,25)),3),'p75',round(float(np.percentile(lags,75)),3))
h,_=np.histogram(lags,bins=np.arange(-0.4,0.41,0.1)); print('hist -0.4..+0.4 (passo .1):',h.tolist())
# eventos com resposta forte: listar
print('eventos com ataque forte (>p90 da base em hi/air/sub):')
