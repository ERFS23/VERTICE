/* Narrador de Impacto — puxar um viral pelo link (conector vidIQ do claude.ai)
   Com o link do Reel e o @: lê o perfil (seguidores, bio), os números do Reel
   (views, curtidas, comentários, duração, data, legenda, capa), a média dos
   outros Reels do perfil e "assiste" o vídeo cena a cena. Depois salva e analisa. */
(function () {
  const X = window.NDX; if (!X) return;
  const A = () => window.NDA;
  const esc = X.esc, ic = (n, c) => X.ic(n, c);
  const SERVER = 'vidlQ';
  const T = { perfil: 'vidiq_ig_profile', reels: 'vidiq_ig_profile_reels', assistir: 'vidiq_watch_shortform_content', job: 'vidiq_job_poll' };
  let mcpP = null;
  const mcp = () => {
    if (!mcpP) mcpP = (async () => { try { return window.claude && window.claude.use ? await window.claude.use('mcp') : null; } catch (e) { return null; } })();
    return mcpP;
  };
  mcp();

  /* ---------- leitura das respostas do vidIQ (texto em markdown) ---------- */
  const num = s => { const A2 = A(); return A2 && A2.E ? A2.E.parseNum(String(s || '').replace(/k$/i, ' mil').replace(/m$/i, ' mi')) : Number(s); };
  const kmil = s => { const t = String(s || '').trim(); const m = t.match(/^([\d.,]+)\s*([KkMm])?$/); if (!m) return t; const n = parseFloat(m[1].replace(/,/g, '')); if (!m[2]) return t.replace(/,/g, ''); return (m[2].toLowerCase() === 'k' ? n * 1e3 : n * 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 0 }); };
  const textoDe = r => {
    if (r == null) return '';
    if (typeof r.payload === 'string') return r.payload;
    const c = (r.content || []).filter(b => b && b.type === 'text').map(b => b.text).join('\n');
    if (c) return c;
    return typeof r.payload === 'object' ? JSON.stringify(r.payload) : String(r.payload || '');
  };
  function lerPerfil(res) {
    const t = textoDe(res);
    const out = { handle: '', nome: '', seguidores: '', posts: '', bio: '' };
    const h = t.match(/##\s*@([A-Za-z0-9._]+)\s*(?:—|-)\s*(.*)/); if (h) { out.handle = '@' + h[1]; out.nome = h[2].trim(); }
    const f = t.match(/([\d.,]+\s*[KkMm]?)\s+followers/); if (f) out.seguidores = kmil(f[1].replace(/\s/g, ''));
    const p = t.match(/([\d.,]+\s*[KkMm]?)\s+posts/); if (p) out.posts = p[1];
    const b = t.match(/>\s*"([\s\S]*?)"\s*$/m) || t.match(/>\s*"([\s\S]*)"/); if (b) out.bio = b[1].trim();
    return out;
  }
  function lerReels(res) {
    const t = textoDe(res);
    const reels = [];
    const re = /###\s*([A-Za-z0-9_-]+)\s*(?:—|-)\s*([^\n]*)\n(?:https?:\/\/\S+\n)?(?:>\s*"([\s\S]*?)"\s*(?=\n###|\n*$))?/g;
    let m;
    while ((m = re.exec(t))) {
      const meta = m[2];
      const g = rx => { const x = meta.match(rx); return x ? x[1] : ''; };
      reels.push({ code: m[1], views: kmil(g(/([\d.,]+[KkMm]?)\s+plays/)), curtidas: kmil(g(/([\d.,]+[KkMm]?)\s+likes/)), comentarios: kmil(g(/([\d.,]+[KkMm]?)\s+comments/)), duracao: g(/(\d+)s\b/), postadoEm: g(/posted\s+(\d{4}-\d{2}-\d{2})/), legenda: (m[3] || '').trim() });
    }
    // capas: blocos de imagem logo depois do texto "Reel CODE — ..."
    const capas = {};
    let atual = null;
    (res && res.content || []).forEach(b => {
      if (!b) return;
      if (b.type === 'text') { const x = String(b.text || '').match(/^Reel\s+([A-Za-z0-9_-]+)\s*(?:—|-)/); atual = x ? x[1] : atual; }
      else if (b.type === 'image' && atual && b.data) { capas[atual] = { data: b.data, mime: b.mimeType || 'image/jpeg' }; atual = null; }
    });
    reels.forEach(r => { r.capa = capas[r.code] || null; });
    return reels;
  }
  const codigoDoLink = url => { const m = String(url || '').match(/instagram\.com\/(?:[A-Za-z0-9._]+\/)?(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i); return m ? { tipo: m[1].toLowerCase() === 'p' ? 'post' : 'reel', code: m[2] } : null; };
  const b64Blob = (b64, mime) => { const bin = atob(b64); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new Blob([u], { type: mime || 'image/jpeg' }); };
  const media = arr => { const v = arr.map(num).filter(x => x != null && isFinite(x) && x > 0); return v.length ? v.map(x => Math.round(x).toLocaleString('pt-BR')).join('; ') : ''; };

  X.link = { lerPerfil, lerReels, codigoDoLink, kmil };
  /* ---------- erros do conector, com o que fazer ---------- */
  function msgErro(e) {
    const c = e && e.code;
    if (c === 'server_not_connected') return 'O vidIQ não está conectado na sua conta. Adicione em claude.ai › Configurações › Conectores e tente de novo.';
    if (c === 'needs_reauth') return 'A conexão com o vidIQ expirou. Reconecte em claude.ai › Configurações › Conectores.';
    if (c === 'not_in_manifest' || c === 'not_granted') return 'Você não liberou o vidIQ pra esta ferramenta. Recarregue a página e permita quando o Claude perguntar.';
    if (c === 'selection_required') return 'Você tem mais de uma conta vidIQ conectada: escolha uma quando o Claude perguntar.';
    if (c === 'blocked_by_policy' || c === 'approval_required') return 'A sua organização bloqueou esta função do vidIQ.';
    if (c === 'tool_error') return 'O vidIQ não conseguiu ler: ' + String(e.message || '').slice(0, 200);
    if (c === 'server_unavailable') return 'O vidIQ não respondeu agora. Tente de novo em instantes.';
    return 'Não deu pra falar com o vidIQ agora (' + (c || 'erro') + '). Tente de novo.';
  }

  /* ---------- o bloco no formulário ---------- */
  X.viralFormLink = M => {
    const L = M.link || {};
    const pronto = !!(window.claude && window.claude.use);
    const passos = (L.passos || []).map(p => `<li class="${p.ok === false ? 'bad' : ''}"><b>${esc(p.t)}</b>${p.d ? `<span>${esc(p.d)}</span>` : ''}</li>`).join('');
    return `<div class="kl-box">
      <div class="kit-row"><b class="grow">Puxar tudo pelo link</b><button type="button" class="btn sm primary" data-a="x-link-puxar" ${L.busy || !pronto ? 'disabled' : ''}>${ic('spark', 'sm')} ${L.busy ? 'Puxando…' : 'Puxar dados e assistir'}</button></div>
      ${(M.draft || {}).tipo === 'carrossel' ? `<p class="kit-hint"><b>Carrossel:</b> o vidIQ traz só o perfil e a média de curtidas e comentários. O conteúdo vem dos prints: suba abaixo os prints dos slides, na ordem, e um print do post mostrando curtidas e comentários. A IA lê cada slide, descreve o carrossel inteiro e preenche os números sozinha.</p>` : ''}
      <p class="kit-hint">Cole o link do Reel e o @ de quem postou. O app usa o seu vidIQ (conector do claude.ai) pra trazer seguidores, views, curtidas, comentários, duração, data, legenda, capa e a média do perfil, e pra assistir o vídeo cena a cena. Depois salva e analisa sozinho. Gasta cerca de 20 créditos do vidIQ por viral. Compartilhamentos e salvamentos o Instagram não mostra pra quem não é o dono.</p>
      ${passos ? `<ul class="fixlist kl-passos">${passos}</ul>` : ''}
      ${L.err ? `<p class="gate-err">${ic('alert', 'sm')}<span>${esc(L.err)}</span></p>` : ''}
    </div>`;
  };
  X.css(`.kl-box{margin-top:12px; padding:12px 14px; border:1px solid var(--amber-line); background:var(--amber-soft); border-radius:12px; display:flex; flex-direction:column; gap:8px}
.kl-box .kit-hint{margin:0}
.kl-passos li{border-left-color:var(--good)} .kl-passos li.bad{border-left-color:var(--bad)}`);

  const passo = (M, t, d, ok) => { M.link.passos.push({ t, d: d || '', ok }); if (A().ui.modal === M) A().renderModal(); };

  X.action('x-link-puxar', async () => {
    const a = A(); const M = a.ui.modal; if (!M || M.type !== 'viral-form') return;
    const d = M.draft;
    M.link = { busy: true, passos: [], err: '' }; a.renderModal();
    const fim = err => { M.link.busy = false; if (err) M.link.err = err; if (a.ui.modal === M) a.renderModal(); };
    const cod = codigoDoLink(d.link);
    if (!cod) return fim('Cole o link completo do post (ex.: https://www.instagram.com/reel/ABC123/).');
    const m = await mcp();
    if (!m) return fim('Esta visualização não acessa os conectores do claude.ai. Abra a ferramenta no claude.ai pra puxar pelo link.');
    if (cod.tipo === 'post' && d.tipo !== 'carrossel') { d.tipo = 'carrossel'; }
    let handle = String(d.handle || '').replace(/^@/, '').trim();
    const call = (tool, input) => m.callTool(SERVER, tool, input);

    // 1) assistir (só Reel; roda em paralelo com o resto)
    const assistir = cod.tipo === 'reel' ? (async () => {
      try {
        const r = await call(T.assistir, { url: `https://www.instagram.com/reel/${cod.code}/`, prompt: 'Descreva cena a cena com os segundos: o que aparece no primeiro frame, a fala exata (transcrição completa), o texto na tela, os cortes, a câmera, o áudio, a prova mostrada e como termina. Diga também quem é o criador (@) se aparecer, o assunto em até 8 palavras e o nicho. Português do Brasil.' });
        const p = r && r.payload; const job = (p && p.mcpJobId) || (String(textoDe(r)).match(/job_[A-Za-z0-9-]+/) || [])[0];
        if (!job) return textoDe(r);
        passo(M, 'Assistindo o vídeo', 'O vidIQ está vendo o Reel cena a cena. Leva de 2 a 15 minutos; pode deixar esta janela aberta.');
        for (let i = 0; i < 150; i++) {
          await new Promise(ok => setTimeout(ok, 6000));
          if (a.ui.modal !== M) return null;
          const q = await call(T.job, { mcpJobId: job });
          const qp = q && q.payload && typeof q.payload === 'object' ? q.payload : (() => { try { return JSON.parse(textoDe(q)); } catch (e) { return {}; } })();
          if (qp.status === 'completed') { const rs = qp.result; return typeof rs === 'string' ? rs : rs && (rs.markdown || rs.walkthrough || rs.text || rs.content) || JSON.stringify(rs || ''); }
          if (qp.status === 'failed' || qp.status === 'expired') throw { code: 'tool_error', message: qp.message || 'o vídeo não pôde ser assistido' };
        }
        throw { code: 'tool_error', message: 'demorou demais' };
      } catch (e) { passo(M, 'Não deu pra assistir o vídeo', msgErro(e) + ' Você ainda pode subir o vídeo ou prints.', false); return null; }
    })() : Promise.resolve(null);

    // 2) perfil e números (precisa do @)
    try {
      if (!handle) {
        passo(M, 'Falta o @ do perfil', 'O link do Reel não diz quem postou. Vou tentar descobrir assistindo o vídeo; se puder, preencha o @ e clique de novo pra trazer seguidores e números.', false);
      } else {
        const [rp, rr] = await Promise.all([call(T.perfil, { handle }).catch(e => ({ __err: e })), call(T.reels, { handle }).catch(e => ({ __err: e }))]);
        if (rp && rp.__err) passo(M, 'Perfil não lido', msgErro(rp.__err), false);
        else {
          const P = lerPerfil(rp);
          if (P.handle) d.handle = P.handle;
          if (P.seguidores) d.seguidores = P.seguidores;
          if (P.bio && !d.nicho) M.bioOrigem = P.bio;
          passo(M, `Perfil ${P.handle || '@' + handle}`, [P.seguidores && P.seguidores + ' seguidores', P.posts && P.posts + ' posts', P.nome].filter(Boolean).join(' · '));
        }
        if (rr && rr.__err) passo(M, 'Reels do perfil não lidos', msgErro(rr.__err), false);
        else if (rr) {
          const rs = lerReels(rr);
          const este = rs.find(r => r.code === cod.code);
          const outros = rs.filter(r => r.code !== cod.code);
          if (este) {
            ['views', 'curtidas', 'comentarios', 'duracao', 'postadoEm', 'legenda'].forEach(k => { if (este[k]) d[k] = este[k]; });
            if (este.capa) {
              try { const blob = b64Blob(este.capa.data, este.capa.mime); const th = await a.thumbFrom(blob); if (th) { d.thumb = th; M.thumbAuto = false; } M.capaBlob = blob; } catch (e) { }
            }
            passo(M, 'Números do Reel', [este.views && este.views + ' views', este.curtidas && este.curtidas + ' curtidas', este.comentarios && este.comentarios + ' comentários', este.duracao && este.duracao + ' s'].filter(Boolean).join(' · '));
          } else if (cod.tipo === 'post') passo(M, 'Carrossel: o vidIQ não lê posts de carrossel', 'Suba os prints dos slides (e um print do post com as curtidas e comentários). A IA lê o texto de cada slide, descreve o carrossel e preenche os números.', false);
          else passo(M, 'Este Reel não está entre os 12 mais recentes do perfil', 'Os números dele não vieram: suba um print da tela do Reel pra completar.', false);
          if (outros.length) {
            d.media = Object.assign({}, d.media || {}, cod.tipo === 'post' ? {} : { views: media(outros.map(r => r.views)) }, { curtidas: media(outros.map(r => r.curtidas)), comentarios: media(outros.map(r => r.comentarios)) });
            passo(M, 'Média do perfil', `${outros.length} Reels recentes usados pra comparar${cod.tipo === 'post' ? ' (curtidas e comentários; carrossel não tem média própria no vidIQ)' : ''}.`);
          }
        }
      }
    } catch (e) { passo(M, 'Erro ao ler o perfil', msgErro(e), false); }
    if (a.ui.modal === M) a.renderModal();

    // 3) espera o vídeo assistido e organiza com a IA
    const vista = await assistir;
    if (a.ui.modal !== M) return;
    if (vista) {
      d.assistido = String(vista).slice(0, 12000);
      passo(M, 'Vídeo assistido', 'A descrição cena a cena vai junto na análise.');
      if (a.sample) {
        try {
          const r = await a.sample.json(`Abaixo está a descrição cena a cena de um Reel do Instagram, feita por uma ferramenta que assistiu o vídeo. Extraia só o que está nela, sem inventar. Português do Brasil.
"""
${d.assistido.slice(0, 9000)}
"""
Responda só com JSON: {"handle": "@ do criador se aparecer, ou null", "titulo": "assunto em até 8 palavras", "nicho": "nicho do perfil, ou null", "transcricao": "a fala completa, na ordem", "textoTela": "os textos que aparecem na tela, na ordem", "edicao": "a edição em 2 ou 3 frases: frame 0, ritmo de corte, recursos", "audio": "Voz original | Áudio em alta (trend) | Narração + música | Música sem voz | null"}`, { modelTier: 'quick', cache: false });
          const ok = x => x != null && String(x).trim() && String(x).trim().toLowerCase() !== 'null';
          if (r && ok(r.handle) && !d.handle) d.handle = String(r.handle).startsWith('@') ? String(r.handle) : '@' + r.handle;
          if (r && ok(r.titulo) && !d.titulo) d.titulo = String(r.titulo).slice(0, 90);
          if (r && ok(r.nicho) && !d.nicho) d.nicho = String(r.nicho).slice(0, 80);
          if (r && ok(r.transcricao) && !d.roteiro) d.roteiro = String(r.transcricao).slice(0, 6000);
          if (r && ok(r.textoTela) && !d.textoTela) d.textoTela = String(r.textoTela).slice(0, 1200);
          if (r && ok(r.edicao) && !d.edicao) d.edicao = String(r.edicao).slice(0, 2000);
          if (r && ok(r.audio) && !d.audio && ['Voz original', 'Áudio em alta (trend)', 'Narração + música', 'Música sem voz'].includes(String(r.audio))) d.audio = String(r.audio);
        } catch (e) { }
      }
    }
    if (!d.nicho && M.bioOrigem) d.nicho = M.bioOrigem.split('\n')[0].slice(0, 80);
    if (!d.titulo) d.titulo = (d.legenda || '').split('\n')[0].slice(0, 80) || 'Viral ' + (d.handle || '');
    // capa como imagem extra da análise (quando não há prints)
    if (M.capaBlob && !(M.files || []).length) { M.files = [M.capaBlob]; M.urls = [URL.createObjectURL(M.capaBlob)]; }
    M.link.busy = false;
    const S = a.E.viralStats(Object.assign({ media: {} }, d));
    const podeAnalisar = S.seg && (S.views || (d.tipo === 'carrossel' && num(d.curtidas)));
    if (podeAnalisar && a.ui.ai === 'on') {
      passo(M, 'Tudo pronto: salvando e analisando', 'Confira os campos depois na edição do viral.');
      a.A['salvar-viral']({ dataset: { analisar: '1' } });
    } else {
      M.link.err = podeAnalisar ? '' : 'Faltou ' + (!S.seg ? 'o número de seguidores' : 'o número de views') + ' pra analisar. Preencha (ou suba um print) e clique em Salvar e analisar.';
      if (a.ui.modal === M) a.renderModal();
    }
  });
})();
