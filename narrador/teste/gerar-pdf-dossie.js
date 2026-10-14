const fs=require('fs'),{execSync}=require('child_process');
const {chromium}=require('/opt/node-tools/node_modules/playwright');
const SRC='/home/user/VERTICE/narrador/dossie-narrador.html', OUT=process.argv[2];
let h=fs.readFileSync(SRC,'utf8');
// TOC entries from nav
const nav=h.match(/<nav class="toc"[\s\S]*?<\/nav>/)[0];
const items=[...nav.matchAll(/href="#(\w+)"><b>(\d+)<\/b>([^<]+)</g)].map(m=>({id:m[1],n:m[2],t:m[3]}));
// eyebrow text per section, used to find the page
for(const it of items){const m=h.match(new RegExp('<section id="'+it.id+'">\\s*<div class="eyebrow">([^<]+)<'));it.eb=m[1].replace(/&amp;/g,'&');}
const diagram=`<div class="dg">
 <div class="dg-col"><div class="dg-b">Virais<small>link, prints, vídeo, slides</small></div><div class="dg-b">Ganchos · Temas · Formatos<small>bancos oficiais</small></div><div class="dg-b">Semana<small>plano da semana</small></div></div>
 <div class="dg-ar">→</div>
 <div class="dg-col"><div class="dg-b">Kit IG<small>10 ferramentas</small></div><div class="dg-b hot">Estúdio<small>roteiro completo</small></div><div class="dg-b">Perfil<small>DNA e memória, entra em todo prompt</small></div></div>
 <div class="dg-ar">→</div>
 <div class="dg-col"><div class="dg-b">Biblioteca<small>números e score</small></div><div class="dg-note">O score volta para o ranking de Ganchos e as lições voltam para o Perfil.</div></div>
</div>`;
h=h.replace(/<pre class="mermaid">[\s\S]*?<\/pre>/,diagram);
function build(pages){
 const rows=items.map(it=>`<li><a href="#${it.id}"><b>${it.n}</b><span>${it.t}</span><i></i><em>${pages?pages[it.id]:''}</em></a></li>`).join('');
 const cover=`<div class="cover">
  <div class="stripes"></div>
  <div class="cv-in">
   <div class="eyebrow">Dossiê técnico e de uso · outubro de 2026</div>
   <h1>Narrador de <em>Impacto</em></h1>
   <p class="lede">Tudo que a ferramenta faz, de onde vem cada função e como reconstruí-la em outro lugar.</p>
   <div class="eyebrow" style="margin-top:34px">Sumário</div>
   <ol class="sum">${rows}</ol>
  </div></div>`;
 let x=h.replace(/<nav class="toc"[\s\S]*?<\/nav>/,cover);
 const css=`<style>
 @page{size:A4;margin:14mm 0 16mm}
 @page:first{margin:0}
 html{-webkit-print-color-adjust:exact;print-color-adjust:exact;background:#0A0C11}
 body{font-size:13.5px}
 .wrap{display:block;max-width:none;padding:0 16mm !important}
 nav.toc{display:none}
 .cover{height:296mm;overflow:hidden;width:210mm;margin:0 0 0 -16mm;position:relative;display:flex;flex-direction:column;break-after:page;background:var(--bg)}
 .cover .stripes{height:16mm;background:repeating-linear-gradient(-45deg,var(--amber) 0 18px,var(--bg) 18px 36px)}
 .cv-in{padding:16mm 18mm 0}
 .cover h1{font-size:76px}.cover .lede{font-size:18px}.cv-in{padding:22mm 18mm 0}
 .sum{list-style:none;padding:0;margin:12px 0 0;columns:2;column-gap:28px}.sum li{break-inside:avoid}
 .sum a{display:flex;align-items:baseline;gap:10px;text-decoration:none;color:var(--ink);padding:7px 0;border-bottom:1px solid var(--line);font-size:15px}
 .sum b{font-family:var(--f-mono);font-weight:400;color:var(--amber);font-size:12px;width:20px}
 .sum i{flex:1}
 .sum em{font-style:normal;font-family:var(--f-mono);color:var(--muted);font-size:12px}
 section{break-before:page;border-top:0;margin-top:0;padding-top:0}
 section:first-of-type{break-before:auto}
 .slate{margin-top:20px}
 h1{font-size:56px} h2{font-size:40px}
 .screen,.box,tr,.sw,.note,.flow li,pre.code,.slate{break-inside:avoid}
 h3,h2,.eyebrow{break-after:avoid}
 table{min-width:0;font-size:12.5px}
 .tbl{overflow:visible}
 .grid2{grid-template-columns:1fr 1fr}
 p,li{max-width:none}
 .dg{display:grid;grid-template-columns:1fr 24px 1fr 24px 1fr;gap:10px;align-items:center;margin-top:14px}
 .dg-col{display:grid;gap:10px}
 .dg-b{border:1px solid var(--line);background:var(--panel);border-radius:10px;padding:10px 12px;font-family:var(--f-disp);font-weight:800;text-transform:uppercase;font-size:19px;line-height:1.05}
 .dg-b small{display:block;font-family:var(--f-body);text-transform:none;font-weight:400;font-size:11.5px;color:var(--muted);margin-top:3px}
 .dg-b.hot{border-color:var(--amber);color:var(--amber)}
 .dg-ar{color:var(--amber);font-size:22px;text-align:center}
 .dg-note{font-size:12px;color:var(--muted)}
 </style>`;
 return '<!doctype html><html lang="pt-BR" data-theme="dark"><head><meta charset="utf-8">'+x.replace('</style>','</style>'+css)+'</html>';
}
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'}).catch(()=>chromium.launch());
 const p=await b.newPage();
 const footer=`<div style="width:100%;font:9px JetBrains Mono,monospace;color:#6E7689;padding:0 16mm;display:flex;justify-content:space-between;-webkit-print-color-adjust:exact"><span>NARRADOR DE IMPACTO · DOSSIÊ</span><span class="pageNumber"></span></div>`;
 const render=async(html,file)=>{await p.setContent(html,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
  await p.pdf({path:file,format:'A4',printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:footer,preferCSSPageSize:true});};
 await render(build(null),'pass1.pdf');
 const n=+execSync('pdfinfo pass1.pdf').toString().match(/Pages:\s+(\d+)/)[1];
 const pages={};
 let pg=2;for(const it of items){for(let i=pg;i<=n;i++){const t=execSync(`pdftotext -f ${i} -l ${i} pass1.pdf -`).toString().replace(/\s+/g,' ').toUpperCase();
  if(t.includes(it.eb.toUpperCase().replace(/\s+/g,' ').slice(0,30))){pages[it.id]=i;pg=i;break;}}}
 console.log(n,JSON.stringify(pages));
 await render(build(pages),OUT); await b.close();
})();
