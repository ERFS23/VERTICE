import sys, subprocess, numpy as np, json
f,crop,dur,out=sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4]
w,h=160,90 if crop=='full' else 160
vf=("scale=160:90" if crop=='full' else "crop=720:640:0:0,scale=160:142")
H=90 if crop=='full' else 142
cmd=['ffmpeg','-v','error','-i',f,'-t',dur,'-vf',vf+',fps=30,format=gray','-f','rawvideo','-']
d=np.frombuffer(subprocess.run(cmd,capture_output=True).stdout,dtype=np.uint8).reshape(-1,H,160).astype(np.float32)
df=np.abs(np.diff(d,axis=0)).mean((1,2)); t=(np.arange(len(df))+1)/30
med=np.median(df); mad=np.median(abs(df-med))+1e-6; z=(df-med)/mad
ev=[];last=-9
for i in range(1,len(df)-1):
    if z[i]>6 and df[i]>=df[i-1] and df[i]>=df[i+1] and t[i]-last>0.15: ev.append((round(float(t[i]),2),round(float(z[i]),1))); last=t[i]
json.dump(ev,open(out,'w')); print(len(ev),'visual events;',ev[:25])
