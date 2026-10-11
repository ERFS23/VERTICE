/* Narrador de Impacto — Kit Instagram: crescer (extrair e recriar gancho, reaproveitar, revisar perfil)
   Adapta as skills ig-hook-extractor, ig-repurposer e ig-profile-optimizer.
   Também liga a tela Virais ao Kit ("Recriar este viral").
   Carrega ANTES do app.js: no topo só registra; window.NDA é lido na hora do uso. */
(function () {
  const X = window.NDX;
  if (!X) return;
  const esc = s => X.esc(s);
  const ic = (n, c) => X.ic(n, c);
  const A = () => window.NDA;
  const K = () => X.K || {};

  /* ---------- CSS ---------- */
  X.css(`
.kg-out .valor{grid-template-columns:repeat(2, minmax(0,1fr))}
.kg-ideas{display:flex; flex-direction:column; gap:12px}
.kg-ideas .idea{min-width:0}
.kg-ideas .idea q{overflow-wrap:anywhere}
.kg-molde{font-family:var(--f-mono); font-size:13.5px}
.kg-gs{display:flex; flex-direction:column; gap:8px}
.kg-g{display:grid; grid-template-columns:minmax(0,1fr) auto; gap:10px; align-items:center; border:1px solid var(--line); border-radius:12px; padding:10px 12px; background:var(--bg2); min-width:0}
.kg-g span{min-width:0; overflow-wrap:anywhere; font-size:14.5px}
.kg-g.on{border-color:var(--amber-line); background:var(--amber-soft)}
.kg-areas{display:flex; flex-direction:column; gap:10px}
.kg-area{border:1px solid var(--line); border-radius:12px; padding:12px 14px; background:var(--bg2); display:flex; flex-direction:column; gap:6px; min-width:0}
.kg-area .kg-ah{display:grid; grid-template-columns:minmax(0,1fr) auto; gap:10px; align-items:center}
.kg-area b{font-size:14.5px}
.kg-area p{margin:0; font-size:13.5px; line-height:1.45; overflow-wrap:anywhere}
.kg-area .kg-acao{color:var(--ink)}
.kg-area .kg-diag{color:var(--ink2)}
.kg-bar{height:6px; border-radius:6px; background:var(--line); overflow:hidden}
.kg-bar i{display:block; height:100%; background:var(--amber)}
.kg-bar.good i{background:var(--good)} .kg-bar.bad i{background:var(--bad)}
.kg-bio{border:1px solid var(--line); border-radius:12px; padding:12px 14px; background:var(--bg2); display:flex; flex-direction:column; gap:8px; min-width:0}
.kg-bio pre{margin:0; white-space:pre-wrap; overflow-wrap:anywhere; font-family:var(--f-body); font-size:15px; line-height:1.5}
.kg-bio small{color:var(--ink3); font-size:12.5px}
.kg-top{display:grid; grid-template-columns:auto minmax(0,1fr); gap:16px; align-items:center}
.kg-top > *{min-width:0}
.kg-dest{display:grid; grid-template-columns:repeat(auto-fill, minmax(150px, 1fr)); gap:10px}
.kg-dest > div{border:1px solid var(--line); border-radius:12px; padding:10px 12px; background:var(--bg2); min-width:0; overflow-wrap:anywhere; font-size:13.5px}
.kg-dest b{display:block; font-size:14px; margin-bottom:2px}
.kg-viral p{margin:0 0 10px; font-size:13.5px; color:var(--ink2)}
.kg-viral .kg-sup{margin:0 0 10px; padding:10px 12px; border-radius:12px; border:1px solid var(--amber-line); background:var(--amber-soft); color:var(--ink); font-size:14px}
@media (max-width: 520px){ .kg-out .valor{grid-template-columns:minmax(0,1fr)} .kg-top{grid-template-columns:minmax(0,1fr)} .kg-dest{grid-template-columns:minmax(0,1fr)} }
`);

  /* ---------- auxiliares ---------- */
  const OBJ_IDS = ['salvamentos', 'compartilhamentos', 'comentarios', 'seguidores'];
  const OBJ_NOME = { salvamentos: 'Salvamentos', compartilhamentos: 'Compartilhamentos', comentarios: 'Comentários', seguidores: 'Seguidores' };
  const OBJ_ESTUDIO = { salvamentos: 'salvamento', compartilhamentos: 'compartilhamento', comentarios: 'comentario', seguidores: 'seguidores' };
  const semAcento = s => String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const objNorm = v => {
    const s = semAcento(v);
    if (OBJ_IDS.includes(s)) return s;
    if (/salv|save/.test(s)) return 'salvamentos';
    if (/compart|share|envi/.test(s)) return 'compartilhamentos';
    if (/coment/.test(s)) return 'comentarios';
    if (/segui|follow/.test(s)) return 'seguidores';
    return '';
  };
  const FORM_IDS = ['numero', 'contraria', 'cena', 'confissao', 'lista', 'antesdepois', 'mito', 'framework', 'quebra', 'comoeu'];
  const FORM_PAD = { numero: 'Número primeiro', contraria: 'Verdade contrária', cena: 'Cena que todo mundo viveu', confissao: 'Confissão', lista: 'Lista', antesdepois: 'Antes e depois', mito: 'Mito × verdade', framework: 'Framework', quebra: 'Quebra de padrão', comoeu: 'Como eu fiz' };
  const formNorm = v => { const s = semAcento(v).replace(/[^a-z]/g, ''); return FORM_IDS.includes(s) ? s : ''; };
  const formNome = id => { const f = typeof K().formula === 'function' ? K().formula(id) : null; return (f && f.nome) || FORM_PAD[id] || id || ''; };
  const SUPS = ['reel', 'carrossel', 'legenda'];
  const supNorm = (v, pad) => { const s = semAcento(v); return SUPS.find(x => s.includes(x)) || (s.includes('carousel') ? 'carrossel' : s.includes('caption') ? 'legenda' : pad || ''); };
  const kb = nome => (typeof K()[nome] === 'string' ? K()[nome] : '');
  const blocoF = sup => (typeof K().blocoFormulas === 'function' ? K().blocoFormulas(sup) : '');
  const prof = () => (A() && A().st.profile) || {};
  const desab = S => (S.busy || !A() || A().ui.ai !== 'on' ? 'disabled' : '');
  const origemTag = S => (S.origem ? `<div><span class="tag amber">Veio de: ${esc(S.origem)}</span></div>` : '');
  const fimJSON = ex => `\n\nResponda só com JSON, sem texto antes ou depois, exatamente neste formato:\n${ex}`;
  const salvo = msg => { const a = A(); if (a) a.toast(msg || 'Salvo no Kit.', 'good'); };
  const corta = (s, n) => { s = String(s == null ? '' : s); return s.length > n ? s.slice(0, n) + '\n[...texto cortado]' : s; };
  const grafemas = s => { const a = A(); try { if (a && typeof a.grafemas === 'function') return a.grafemas(String(s || '')); } catch (e) { } return X.graf ? X.graf(String(s || '')) : [...String(s || '')].length; };
  const viral = id => { const a = A(); if (!a || !id) return null; return (a.viralById && a.viralById(id)) || (a.st.virais || []).find(v => v.id === id) || null; };
  const baseViral = v => corta([v.roteiro, v.textoTela, v.legenda].map(x => X.str(x)).filter(Boolean).join('\n\n'), 3000);
  // mesmo objeto que o app monta em modelar()
  const modeloDe = v => {
    if (!v || !v.analise) return null;
    const An = v.analise, o = An.modelagem || {};
    return { id: v.id, handle: v.handle, titulo: v.titulo, veredito: An.veredito, estrutura: An.estrutura, edicao: An.edicao, modelar: An.modelar, naoCopiar: An.naoCopiar, angulo: o.angulo, entrega: An.entrega || null };
  };
  const barCls = (n, max) => (n >= max * 0.7 ? 'good' : n < max * 0.4 ? 'bad' : '');
  // regra 4 do CONTRATO: a 1ª linha da legenda é a assinatura; o gancho vem depois de uma linha em branco
  // e os dois juntos cabem nos 125 primeiros caracteres
  const assinatura = () => { const p = prof(); return X.str(p.assinatura || p.handle || ''); };
  const limGancho = () => { const ass = assinatura(); return ass ? Math.max(40, 125 - grafemas(ass) - 2) : 125; };
  const regraDobra = lim => { const ass = assinatura(); return ass ? `a 1ª linha da legenda é a assinatura "${ass}"; o gancho vem logo depois (com uma linha em branco) e precisa caber em ${lim} caracteres pra aparecer inteiro antes do "mais"` : `o gancho precisa caber em ${lim} caracteres pra aparecer inteiro antes do "mais"`; };
  const contaTag = (texto, lim) => { const n = grafemas(texto); return `<span class="tag mono ${n > lim ? 'bad' : 'good'}">${n}/${lim}</span>${n > lim ? '<small class="faint">Passa do "mais": encurte.</small>' : ''}`; };
  const pendente = t => /\[(PREENCHER|CONFERIR)/i.test(String(t || ''));
  const hl = t => { const a = A(); return a && typeof a.hl === 'function' ? a.hl(t) : esc(t); };
  // peças salvas desta ferramenta: lista no fim do card de entrada
  const salvosHTML = tipo => {
    let ps = [];
    try { ps = (X.pecas(tipo) || []).slice(0, 8); } catch (e) { ps = []; }
    if (!ps.length) return '';
    return `<div class="kit-sec"><div class="eyebrow">Salvos</div><div class="kit-hist">${ps.map(p => `<div class="rec-row"><button type="button" class="btn ghost sm" style="justify-content:flex-start; text-align:left; white-space:normal; height:auto; min-width:0; overflow-wrap:anywhere" data-a="x-kg-abrir" data-id="${esc(p.id)}">${esc(p.titulo || 'Sem título')}</button><button type="button" class="btn xs danger" data-a="x-del-peca" data-id="${esc(p.id)}">Apagar</button></div>`).join('')}</div></div>`;
  };
  // salva (ou atualiza, se a mesma geração já foi salva) e avisa onde achar
  const salvarPeca = (S, item, msg) => {
    let ant = null;
    try { ant = S.salvoId ? (X.pecas() || []).find(x => x.id === S.salvoId) : null; } catch (e) { ant = null; }
    if (ant) { item.id = ant.id; item.createdAt = ant.createdAt; }
    const it = X.salvar('pecas', item);
    S.salvoId = it ? it.id : null;
    salvo(msg + ' Fica na lista Salvos, abaixo do formulário desta ferramenta.');
    X.refresh();
  };
  X.action('x-kg-abrir', el => {
    let p = null;
    try { p = (X.pecas() || []).find(x => x.id === el.dataset.id); } catch (e) { p = null; }
    if (!p || !['gancho', 'reaproveitar', 'perfil'].includes(p.tipo)) return;
    X.abrirFerramenta(p.tipo, Object.assign({}, p.form || {}, p.meta || {}, { res: p.res, salvoId: p.id, err: '' }));
  });

  /* ---------- parsers ---------- */
  const PARTES = ['gancho', 'contexto', 'virada', 'passo', 'prova', 'fechamento'];
  const parseGancho = (r, supPedida) => {
    if (!r || typeof r !== 'object') return null;
    const gancho = X.str(r.gancho, 400);
    const supF = supPedida ? supNorm(supPedida, 'reel') : '';
    const recriados = X.arr(r.recriados, 3, o => {
      if (typeof o === 'string') o = { texto: o };
      if (!o || typeof o !== 'object') return null;
      const texto = X.str(o.texto, 400);
      if (!texto) return null;
      return {
        texto, superficie: supF || supNorm(o.superficie, 'reel'), formula: formNorm(o.formula), objetivo: objNorm(o.objetivo),
        angulo: X.str(o.angulo, 300), depois: X.str(o.depois, 300), levaPronto: X.str(o.levaPronto, 300), porque: X.str(o.porque, 300)
      };
    });
    if (!gancho || !recriados.length) return null;
    const en = r.entrega && typeof r.entrega === 'object' ? r.entrega : {};
    const conf = semAcento(r.confianca);
    const f1 = formNorm(r.formula), f2 = formNorm(r.formula2);
    return {
      gancho, formula: f1, formula2: f2 && f2 !== f1 ? f2 : '', confianca: ['alta', 'media', 'baixa'].includes(conf) ? conf : '',
      objetivo: objNorm(r.objetivo) || 'salvamentos',
      porque: X.str(r.porque, 500), mecanismo: X.str(r.mecanismo, 300), molde: X.str(r.molde, 400),
      estrutura: X.arr(r.estrutura, 6, o => {
        if (typeof o === 'string') o = { oque: o };
        if (!o || typeof o !== 'object') return null;
        const oque = X.str(o.oque || o.texto, 300);
        if (!oque) return null;
        const pt = semAcento(o.parte);
        return { parte: PARTES.find(x => pt.includes(x)) || X.str(o.parte, 30), oque };
      }),
      fechamento: X.str(r.fechamento, 300),
      entrega: { transformacao: X.str(en.transformacao, 400), comoSuperar: X.str(en.comoSuperar, 500), porQueSeguir: X.str(en.porQueSeguir, 300) },
      recriados, cuidado: X.str(r.cuidado, 400)
    };
  };
  // ganchos do Reaproveitar: { texto, formula } (aceita string pura, inclusive de peça antiga)
  const gObj = y => (typeof y === 'string' ? { texto: y, formula: '' } : y && typeof y === 'object' ? { texto: X.str(y.texto, 300), formula: formNorm(y.formula) } : { texto: '', formula: '' });
  const parseReap = r => {
    if (!r || typeof r !== 'object') return null;
    const ideiaCentral = X.str(r.ideiaCentral, 400);
    const ganchos = X.arr(r.ganchos, 3, y => { const g = gObj(y); g.texto = X.str(g.texto, 300); return g.texto ? g : null; });
    const pontos = X.arr(r.pontos, 8, y => X.str(typeof y === 'object' && y ? y.texto : y, 400));
    if (!ideiaCentral || !ganchos.length || !pontos.length) return null;
    return {
      ideiaCentral, transformacao: X.str(r.transformacao, 400), ganchos, pontos,
      levaPronto: X.arr(r.levaPronto, 3, y => X.str(typeof y === 'object' && y ? y.texto : y, 300)).concat(typeof r.levaPronto === 'string' && X.str(r.levaPronto) ? [X.str(r.levaPronto, 300)] : []),
      proximo: X.str(r.proximo, 300), objetivo: objNorm(r.objetivo), midia: X.str(r.midia, 300),
      remover: X.arr(r.remover, 8, y => X.str(typeof y === 'object' && y ? [y.o, y.oque, y.texto, y.porque].filter(Boolean).join(': ') : y, 300)),
      destino: supNorm(r.destino, 'carrossel'), porqueDestino: X.str(r.porqueDestino, 300),
      formatoReel: X.str(r.formatoReel, 40).toLowerCase()
    };
  };
  const AREAS = ['foto', 'nome', 'handle', 'bio', 'link', 'categoria', 'destaques', 'grid', 'fixados'];
  const AREA_NOME = { foto: 'Foto', nome: 'Campo Nome', handle: '@ do perfil', bio: 'Bio', link: 'Link', categoria: 'Categoria', destaques: 'Destaques', grid: 'Grade', fixados: 'Fixados' };
  const areaNorm = v => { const s = semAcento(v); return AREAS.find(a => s.includes(a)) || (s.includes('@') ? 'handle' : s.includes('grade') ? 'grid' : s.includes('fix') || s.includes('pin') ? 'fixados' : s.includes('destaq') || s.includes('highlight') ? 'destaques' : ''); };
  const NOME_MAX = 30;
  const parsePerfil = r => {
    if (!r || typeof r !== 'object') return null;
    const itens = X.arr(r.itens, 9, o => {
      if (!o || typeof o !== 'object') return null;
      const area = areaNorm(o.area);
      if (!area) return null;
      const nota = X.num(o.nota, 0, 10);
      const depois = X.str(o.depois || o.acao, 400);
      return { area, nota, status: nota == null ? '' : nota >= 7 ? 'passa' : nota >= 4 ? 'ajustar' : 'reprova', diagnostico: X.str(o.diagnostico, 400), antes: X.str(o.antes, 300), depois, pendente: pendente(depois) };
    });
    const bios = X.arr(r.bios, 3, o => {
      if (typeof o === 'string') o = { texto: o };
      if (!o || typeof o !== 'object') return null;
      const texto = X.str(o.texto, 400);
      if (!texto) return null;
      const n = grafemas(texto);
      return { texto, porque: X.str(o.porque, 300), chars: n, bad: n > 150, pendente: pendente(texto) };
    });
    const nota = X.num(r.nota, 0, 100);
    if (nota == null || (!itens.length && !bios.length)) return null;
    const nome = X.str(r.nome, 120);
    const nomeChars = grafemas(nome);
    return {
      nota, resumo: X.str(r.resumo, 400), porQueSeguir: X.str(r.porQueSeguir, 300), itens,
      nome, nomeChars, nomeBad: nomeChars > NOME_MAX, nomePendente: pendente(nome), bios,
      destaques: X.arr(r.destaques, 6, o => { if (!o || typeof o !== 'object') return null; const nome = X.str(o.nome, 40); return nome ? { nome, conteudo: X.str(o.conteudo, 300), longo: grafemas(nome) > 15 } : null; }),
      fixados: X.arr(r.fixados, 3, o => { if (typeof o === 'string') o = { post: o }; if (!o || typeof o !== 'object') return null; const post = X.str(o.post, 300); return post ? { post, porque: X.str(o.porque, 300) } : null; }),
      prioridades: X.arr(r.prioridades, 3, y => X.str(y, 300))
    };
  };
  X.kg = { parseGancho, parseReap, parsePerfil };

  /* =====================================================================
     1) EXTRAIR E RECRIAR GANCHO
     ===================================================================== */
  X.tool({
    id: 'gancho', nome: 'Extrair e recriar', icone: 'anzol', ordem: 10,
    resumo: 'Descobre por que o gancho de um viral prende e recria 3 versões no seu nicho.',
    init: () => ({ texto: '', viralId: '', superficie: 'reel', origem: '', salvoId: null }),
    render(S) {
      const p = 'kit.tools.gancho';
      const a = A();
      const virais = (a && a.st.virais) || [];
      const opV = [['', 'Colar texto']].concat(virais.map(v => [v.id, [v.handle, v.titulo].filter(Boolean).join(' · ') || 'Viral sem título']));
      const v = viral(S.viralId);
      const entrada = `<section class="card kit-in">
        <h2>Extrair e recriar</h2>
        <p class="lead">Descubra por que o gancho de um viral faz a pessoa parar e receba 3 versões no seu nicho, com a mesma força e um ganho que você consegue entregar.</p>
        ${origemTag(S)}
        <div class="field"><span>Viral de referência</span>
          <div class="kg-vlist" role="listbox" aria-label="Virais salvos">
            <button type="button" class="kg-vitem ${!v ? 'on' : ''}" data-a="x-kg-pick-viral" data-id="" aria-selected="${!v}"><span class="kg-vph">${ic('legenda', 'sm')}</span><span class="kg-vtx"><b>Colar texto</b><small>legenda, transcrição ou 1ª linha</small></span></button>
            ${virais.map(x => `<button type="button" class="kg-vitem ${v && v.id === x.id ? 'on' : ''}" data-a="x-kg-pick-viral" data-id="${esc(x.id)}" aria-selected="${!!(v && v.id === x.id)}">${a.vThumb ? a.vThumb(x, 'kg-vth') : ''}<span class="kg-vtx"><b>${esc(x.titulo || 'Sem título')}</b><small>${esc([x.handle, x.views ? x.views + ' views' : '', x.analise ? 'analisado' : 'sem análise', ((a.viralFrames || {})[x.id] || []).length ? 'com vídeo' : ''].filter(Boolean).join(' · '))}</small></span></button>`).join('')}
          </div>
          <small>${virais.length ? 'Os virais que você adiciona na tela Virais aparecem aqui. Com análise e vídeo, a recriação fica mais precisa.' : 'Você ainda não tem virais salvos.'}</small>
          <div class="kit-row"><button type="button" class="btn xs" data-a="add-viral">${ic('plus', 'sm')} Adicionar viral</button><button type="button" class="btn xs ghost" data-a="nav" data-v="virais">Abrir Virais</button></div>
        </div>
        ${X.h.campo({ path: p + '.texto', label: v ? 'Texto extra (opcional)' : 'Texto do viral', tipo: 'textarea', rows: 5, placeholder: 'Cole a legenda, a transcrição, a primeira linha ou o que aparece escrito no primeiro frame.' })}
        <div class="field"><span>Onde vai usar</span>${X.h.seg(p + '.superficie', [['reel', 'Reel'], ['carrossel', 'Carrossel'], ['legenda', 'Legenda']])}</div>
        <button type="button" class="btn primary" data-a="x-kg-gancho-gerar" ${desab(S)}>${ic('anzol', 'sm')} Extrair e recriar</button>
        <p class="kit-hint">A IA não copia a frase do original: ela entende por que faz a pessoa parar e usa isso no seu assunto.</p>
        ${salvosHTML('gancho')}
      </section>`;
      let saida;
      if (S.busy) saida = X.h.ocupado('Lendo o gancho e recriando no seu nicho. Leva de 15 segundos a 1 minuto.') + `<button type="button" class="btn sm" data-a="x-parar" data-t="gancho">${ic('stop', 'sm')} Parar</button>`;
      else if (!S.res) saida = X.h.erro(S.err) + X.h.vazio('O raio-x do gancho aparece aqui.', 'Você recebe a fórmula, o porquê de funcionar, como o original é montado, um molde em branco, como entregar mais valor que o original e 3 ganchos recriados. Cada um vira roteiro no Estúdio, carrossel ou legenda com um clique.');
      else saida = X.h.erro(S.err) + ganchoOut(S.res);
      return `<div class="kit">${entrada}<section class="kit-out kg-out">${saida}</section></div>`;
    }
  });
  // trocar o viral do select muda o rótulo do campo de texto: re-renderiza
  X.watch(path => { if (path === 'kit.tools.gancho.viralId') X.refresh(); });
  X.action('x-kg-pick-viral', el => { const S = X.toolState('gancho'); S.viralId = el.dataset.id || ''; S.origem = S.viralId ? 'Virais' : ''; const v = viral(S.viralId); if (v && v.tipo === 'carrossel') S.superficie = 'carrossel'; X.refresh(); });
  X.css(`.kg-vlist{display:flex; flex-direction:column; gap:6px; max-height:340px; overflow:auto; padding:2px}
.kg-vitem{display:flex; gap:10px; align-items:center; text-align:left; padding:8px; border:1px solid var(--line); border-radius:12px; background:var(--bg2); color:var(--ink); min-width:0}
.kg-vitem:hover{border-color:var(--amber-line)}
.kg-vitem.on{border-color:var(--amber-line); background:var(--amber-soft)}
.kg-vth,.kg-vph{width:36px; aspect-ratio:9/16; border-radius:7px; object-fit:cover; flex-shrink:0; display:grid; place-items:center; background:var(--panel2); border:1px solid var(--line2); color:var(--ink3)}
.kg-vth span{font-size:16px}
.kg-vtx{display:flex; flex-direction:column; min-width:0}
.kg-vtx b{font-size:13.5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.kg-vtx small{font-size:11.5px; color:var(--ink3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap}`);
  const CONF_NOME = { alta: 'confiança alta', media: 'confiança média', baixa: 'confiança baixa' };
  const frase = s => String(s || '').trim().replace(/[\s.;:]+$/, '');
  const junta = arr => arr.map(frase).filter(Boolean).join('. ');
  const estruturaTxt = r => [(r.estrutura || []).length ? 'Como o original é montado (modele a estrutura, não as frases):\n- ' + r.estrutura.map(e => `${e.parte}: ${e.oque}`).join('\n- ') : '', r.fechamento ? 'O que no fim ganha o salvamento, o envio ou o seguir: ' + r.fechamento : ''].filter(Boolean).join('\n');
  function ganchoOut(r) {
    const lim = limGancho();
    const en = r.entrega || {};
    const valor = (en.transformacao ? `<div class="vrow"><span class="k">Antes → depois do original</span><p>${esc(en.transformacao)}</p></div>` : '')
      + (r.mecanismo ? `<div class="vrow"><span class="k">Por que faz parar</span><p>${esc(r.mecanismo)}</p></div>` : '')
      + (en.comoSuperar ? `<div class="vrow seg"><span class="k">Como a sua versão entrega mais</span><p>${esc(en.comoSuperar)}</p></div>` : '')
      + (en.porQueSeguir ? `<div class="vrow"><span class="k">Por que seguir depois</span><p>${esc(en.porQueSeguir)}</p></div>` : '');
    const ideias = r.recriados.map((g, i) => `<div class="idea ${i === 0 ? 'idea-best' : ''}">
        <div class="top"><span class="tag mono">${esc(g.superficie)}</span>${g.formula ? `<span class="tag">${esc(formNome(g.formula))}</span>` : ''}${g.objetivo ? `<span class="tag mono">${esc(OBJ_NOME[g.objetivo] || g.objetivo)}</span>` : ''}${i === 0 ? '<span class="tag amber">Mais forte</span>' : ''}</div>
        <q>${hl(g.texto)}</q>
        ${g.superficie === 'legenda' ? `<div class="kit-row">${contaTag(g.texto, lim)}</div>` : ''}
        ${g.angulo ? `<p class="muted" style="margin:0 0 4px">${esc(g.angulo)}</p>` : ''}
        ${g.levaPronto ? `<p style="margin:0 0 4px"><b>Leva pronto:</b> ${hl(g.levaPronto)}</p>` : ''}
        ${g.depois ? `<p style="margin:0 0 4px"><b>Depois do post:</b> ${esc(g.depois)}</p>` : ''}
        ${g.porque ? `<p class="kit-hint">${esc(g.porque)}</p>` : ''}
        <div class="kit-row" style="margin-top:10px">
          <button type="button" class="btn sm primary" data-a="x-kg-g-reel" data-i="${i}">${ic('estudio', 'sm')} Roteiro de Reel</button>
          <button type="button" class="btn sm" data-a="x-kg-g-car" data-i="${i}">${ic('carrossel', 'sm')} Carrossel</button>
          <button type="button" class="btn sm" data-a="x-kg-g-leg" data-i="${i}">${ic('legenda', 'sm')} Legenda</button>
          ${X.h.copiar(g.texto, 'Copiar')}
        </div></div>`).join('');
    const estrutura = (r.estrutura || []).length || r.fechamento
      ? `<div class="card kit-sec"><h3>Como o original é montado</h3>${(r.estrutura || []).length ? `<ol class="list">${r.estrutura.map(e => `<li><b>${esc(e.parte)}:</b> ${esc(e.oque)}</li>`).join('')}</ol>` : ''}${r.fechamento ? `<p style="margin:0"><b>O que ganha o salvamento, o envio ou o seguir:</b> ${esc(r.fechamento)}</p>` : ''}</div>` : '';
    return `<div class="card kit-sec">
        <div class="kit-row"><h3 class="grow">Gancho do original</h3>${r.formula ? `<span class="tag">${esc(formNome(r.formula))}</span>` : ''}${r.formula2 ? `<span class="tag">ou ${esc(formNome(r.formula2))}</span>` : ''}${r.confianca ? `<span class="tag mono">${esc(CONF_NOME[r.confianca])}</span>` : ''}<span class="tag mono">${esc(OBJ_NOME[r.objetivo] || r.objetivo)}</span></div>
        <div class="decision"><q class="mq">${esc(r.gancho)}</q></div>
        ${r.porque ? `<p style="margin:0">${esc(r.porque)}</p>` : ''}
      </div>
      ${estrutura}
      ${r.molde ? `<div class="card kit-sec"><h3>Molde em branco</h3><pre class="kit-pre kg-molde">${esc(r.molde)}</pre><div class="kit-row">${X.h.copiar(r.molde, 'Copiar molde')}</div></div>` : ''}
      ${valor ? `<div class="card kit-sec"><h3>Valor que transforma</h3><div class="valor">${valor}</div></div>` : ''}
      <div class="card kit-sec"><h3>Recriados no seu nicho</h3><div class="ideas kg-ideas">${ideias}</div>
        <div class="kit-row"><button type="button" class="btn sm primary" data-a="x-kg-gancho-salvar">${ic('check', 'sm')} Salvar</button></div></div>
      ${r.cuidado ? `<div class="card kit-sec"><h3>O que não copiar</h3><p style="margin:0">${esc(r.cuidado)}</p></div>` : ''}`;
  }
  const FORM_SUP = { reel: ['quebra', 'comoeu', 'contraria'], carrossel: ['lista', 'mito', 'antesdepois'], legenda: ['numero', 'contraria', 'cena'] };
  X.action('x-kg-gancho-gerar', () => {
    const S = X.toolState('gancho');
    if (S.busy) return;
    const v = viral(S.viralId);
    const txt = X.str(S.texto);
    if (!v && !txt) { S.err = 'Escolha um viral salvo ou cole o texto do viral (legenda, transcrição ou primeira linha).'; X.refresh(); return; }
    let fonte = '';
    if (v) {
      const An = v.analise;
      const nums = [v.views && `views: ${v.views}`, v.seguidores && `seguidores do perfil: ${v.seguidores}`, v.curtidas && `curtidas: ${v.curtidas}`, v.compartilhamentos && `compartilhamentos: ${v.compartilhamentos}`, v.salvamentos && `salvamentos: ${v.salvamentos}`].filter(Boolean).join(' · ');
      fonte = [`VIRAL SALVO: "${X.str(v.titulo, 200)}"${v.handle ? ` de ${X.str(v.handle, 60)}` : ''}${v.nicho ? ` · nicho: ${X.str(v.nicho, 100)}` : ''}`,
        nums ? `Números: ${nums}` : '',
        v.roteiro ? `Roteiro / transcrição:\n"""\n${corta(v.roteiro, 4000)}\n"""` : '',
        v.textoTela ? `Texto na tela: ${corta(v.textoTela, 800)}` : '',
        v.legenda ? `Legenda:\n"""\n${corta(v.legenda, 2200)}\n"""` : '',
        An ? `Análise que o app já fez deste viral:\n- Veredito: ${X.str(An.veredito, 600)}${An.gancho ? `\n- Gancho: "${X.str(An.gancho.texto, 300)}" (${X.str(An.gancho.categoria || An.gancho.formula, 60)}): ${X.str(An.gancho.porque, 400)}` : ''}${An.entrega ? `\n- Entrega: ${[An.entrega.transformacao, An.entrega.levaPronto, An.entrega.porQueSeguir, An.entrega.comoSuperar].filter(Boolean).map(x => X.str(x, 300)).join(' | ')}` : ''}${(An.estrutura || []).length ? `\n- Estrutura: ${An.estrutura.slice(0, 8).map(e => `${X.str(e.parte, 40)} (${X.str(e.tempo, 20)}): ${X.str(e.oque, 160)}`).join(' / ')}` : ''}` : '',
        txt ? `Texto extra colado pelo criador:\n"""\n${corta(txt, 3000)}\n"""` : ''].filter(Boolean).join('\n');
    } else fonte = `TEXTO DO VIRAL (legenda, transcrição, primeira linha ou frame 0):\n"""\n${corta(txt, 6000)}\n"""`;
    const sup = supNorm(S.superficie, 'reel');
    const lim = limGancho();
    const fs = FORM_SUP[sup];
    const prompt = [
      X.ctxPerfil({ semGravacao: sup !== 'reel' }),
      blocoF(sup),
      `═══ COMO CLASSIFICAR O GANCHO ═══
1. Veja a superfície: legenda (primeiros ~125 caracteres), carrossel (slide 1 + estrutura) ou Reel (primeiros 1 a 3 segundos: fala + texto na tela).
2. Ache a fórmula pelo esqueleto:
- número preciso + promessa de "como" → numero
- afirmação seca que contraria o conselho comum → contraria
- momento específico que todo mundo viveu, sem preparação → cena
- marcador de tempo em 1ª pessoa + custo ou surpresa admitido → confissao
- slide 1 promete N itens, um por slide → lista
- mostra o depois e em seguida o antes, corpo em passos → antesdepois
- pares "mito" / "verdade" → mito
- nomeia um método e resume num slide → framework
- Reel que abre com quebra de padrão ou loop aberto, sem introdução → quebra
- "como eu consegui X em Y" + passos → comoeu
3. Se duas servirem, desempate pelo objetivo principal e pela superfície e informe a segunda em "formula2". Diga a "confianca" (alta, media ou baixa). Se nenhuma encaixar, descreva a estrutura, escolha a mais próxima e marque confianca baixa.
4. Objetivo principal pelo fechamento: lista, método, passo a passo → salvamentos; verdade contrária ou mito derrubado → compartilhamentos; cena, pergunta, confissão → comentarios; prova de transformação, "segue pra..." → seguidores.
5. Raio-x do corpo: de 3 a 6 partes na ordem do original (gancho, contexto, virada, passo, prova, fechamento), cada uma com o que acontece em 1 frase; e o "fechamento": o que no final ganha o salvamento, o envio ou o seguir.
6. Molde em branco: o esqueleto da fórmula com {lacunas} nomeadas pro assunto do criador. Sem os vícios do original (travessão demais, palavra de IA, parede de hashtags, isca de engajamento, gancho que só faz sentido depois do "mais").`,
      `═══ TAREFA: EXTRAIR O GANCHO E RECRIAR NO NICHO DO CRIADOR ═══
${fonte}

Superfície em que o criador vai usar: ${sup}.
Recrie no nicho do criador: mesma função psicológica, nunca a frase do original. Cada versão promete um ganho concreto que o criador consegue entregar (pelo DNA e pela verdade do perfil). Nada de número inventado: quando depender de dado dele, use [PREENCHER: o quê].
- Exatamente 3 ganchos recriados, todos pra ${sup}: "superficie" = "${sup}" nos 3. Prefira as fórmulas que nascem em ${sup}; use uma de outra superfície só se a ideia pedir. Fórmulas variadas quando fizer sentido; o primeiro é o mais forte.
- ${sup === 'legenda' ? `Gancho de legenda: ${regraDobra(lim)}.` : sup === 'carrossel' ? 'Gancho de carrossel é o slide 1: até 12 palavras, que decidem o arraste em menos de um segundo.' : 'Gancho de Reel se fala em até 3 segundos e combina com o texto na tela.'}
- Cada recriado diz o "objetivo" que ele busca (pela fórmula e pelo fechamento), o "depois" (o que a pessoa sabe ou faz depois do post, 1 frase) e o "levaPronto" (o passo, a frase ou o critério que ela usa hoje).
- Gancho só entra se o post consegue pagar a promessa com algo aplicável hoje. Se não consegue, troque o gancho, não aumente a promessa. Nada de isca ("comenta SIM", "marca 3 amigos").
- "comoSuperar": como a versão do criador entrega MAIS valor que o original (mais aplicável, mais específica, mais digna de mandar pra alguém).
- "porQueSeguir": o próximo pedaço que o perfil entrega depois deste post, com assunto definido (é o motivo pra seguir).
- "cuidado": o que não copiar (frase, tema alheio, promessa que ele não cumpre, vícios).
- Linguagem de conversa, sem cara de IA, sem travessão.`
    ].filter(Boolean).join('\n\n') + fimJSON(`{"gancho": "o gancho identificado", "formula": "contraria", "formula2": "", "confianca": "alta", "objetivo": "compartilhamentos", "porque": "por que funciona (1–2 frases)", "mecanismo": "o gatilho psicológico", "estrutura": [{"parte": "gancho", "oque": "o que acontece, 1 frase"}, {"parte": "virada", "oque": "..."}, {"parte": "fechamento", "oque": "..."}], "fechamento": "o que no final ganha o salvamento, o envio ou o seguir", "molde": "Todo mundo diz {conselho comum}. Eu faço {o contrário} e {resultado}.", "entrega": {"transformacao": "o antes → depois que o original provoca", "comoSuperar": "como a versão do criador entrega mais valor", "porQueSeguir": "o próximo assunto que o perfil entrega"}, "recriados": [{"texto": "gancho novo completo", "superficie": "${sup}", "formula": "${fs[0]}", "objetivo": "salvamentos", "angulo": "do que trata o post, 1 frase", "depois": "o que a pessoa sabe ou faz depois", "levaPronto": "o passo que ela usa hoje", "porque": "1 frase"}, {"texto": "...", "superficie": "${sup}", "formula": "${fs[1]}", "objetivo": "...", "angulo": "...", "depois": "...", "levaPronto": "...", "porque": "..."}, {"texto": "...", "superficie": "${sup}", "formula": "${fs[2]}", "objetivo": "...", "angulo": "...", "depois": "...", "levaPronto": "...", "porque": "..."}], "cuidado": "o que não copiar"}`);
    // metadados da geração: só valem se a resposta vier boa (falha ou Parar mantém o resultado anterior coerente)
    const ft = corta([v ? baseViral(v) : '', txt].filter(Boolean).join('\n\n'), 3000);
    const fv = v ? v.id : '';
    const og = v ? 'Viral ' + (v.handle || X.str(v.titulo, 40) || '') : (S.origem || 'texto colado');
    const IM = v && A().imagensDoViral ? A().imagensDoViral(v.id) : { imgs: [], txt: '' };
    const promptF = IM.imgs.length ? prompt + `\n\nIMAGENS ANEXADAS: ${IM.txt}. Use pra ver o frame 0, o texto na tela e a montagem dos primeiros segundos do original.` : prompt;
    X.rodar(S, promptF, r => {
      const o = parseGancho(r, sup);
      if (o) { S.fonteTxt = ft; S.fonteViral = fv; S.resOrigemG = og; S.salvoId = null; }
      return o;
    }, { tier: 'complex', images: IM.imgs });
  });
  const origemGancho = S => S.resOrigemG || (viral(S.fonteViral) ? 'Viral ' + (viral(S.fonteViral).handle || '') : (S.origem || 'texto colado'));
  const recriado = el => { const S = X.toolState('gancho'); const g = S.res && S.res.recriados[Number(el.dataset.i) || 0]; return g ? { S, g } : null; };
  X.action('x-kg-g-reel', el => {
    const o = recriado(el); if (!o) return;
    const { S, g } = o, r = S.res, en = r.entrega || {};
    const v = viral(S.fonteViral);
    X.paraEstudio({
      gancho: g.texto,
      assunto: junta([g.angulo || g.texto, g.levaPronto && 'A pessoa leva pronto: ' + g.levaPronto, en.comoSuperar && 'Como entregar mais: ' + en.comoSuperar]),
      objetivo: OBJ_ESTUDIO[g.objetivo || r.objetivo], proximo: en.porQueSeguir || '',
      obs: estruturaTxt(r), why: `Gancho recriado a partir de ${origemGancho(S)}.`,
      modelo: v && v.analise ? modeloDe(v) : null
    });
  });
  X.action('x-kg-g-car', el => {
    const o = recriado(el); if (!o) return;
    const { S, g } = o, r = S.res;
    const base = [estruturaTxt(r), S.fonteTxt ? 'Texto do original (só a estrutura, não copie frases):\n' + S.fonteTxt : ''].filter(Boolean).join('\n\n');
    X.abrirFerramenta('carrossel', { tema: junta([g.angulo || g.texto, g.levaPronto && 'Leva pronto: ' + g.levaPronto]), gancho: g.texto, objetivo: g.objetivo || r.objetivo, formula: ['lista', 'antesdepois', 'mito', 'framework'].includes(g.formula) ? g.formula : 'auto', base, origem: origemGancho(S) });
  });
  X.action('x-kg-g-leg', el => {
    const o = recriado(el); if (!o) return;
    const { S, g } = o, r = S.res, en = r.entrega || {};
    // o post ainda não existe: o que ele entrega vai no assunto; base vazia pra não herdar texto de outro uso
    X.abrirFerramenta('legenda', {
      assunto: junta([g.angulo || g.texto, g.levaPronto && 'Leva pronto: ' + g.levaPronto, g.depois && 'Depois do post: ' + g.depois, en.comoSuperar && 'Como entregar mais: ' + en.comoSuperar]),
      gancho: g.texto, objetivo: g.objetivo || r.objetivo, tipo: { reel: 'reel', carrossel: 'carrossel', legenda: 'imagem' }[g.superficie] || 'imagem', base: '', origem: origemGancho(S)
    });
  });
  X.action('x-kg-gancho-salvar', () => {
    const S = X.toolState('gancho'); if (!S.res) return;
    salvarPeca(S, { tipo: 'gancho', titulo: X.str(S.res.recriados[0].texto, 80) || 'Gancho', form: { viralId: S.fonteViral || '', superficie: S.superficie, origem: S.origem || '', texto: '' }, meta: { fonteViral: S.fonteViral || '', fonteTxt: S.fonteTxt || '', resOrigemG: origemGancho(S) }, res: S.res }, 'Gancho salvo.');
  });

  /* =====================================================================
     2) REAPROVEITAR
     ===================================================================== */
  const ORIGENS = [['linkedin', 'LinkedIn'], ['blog', 'Blog'], ['youtube', 'YouTube'], ['x', 'X'], ['outro', 'Outro']];
  const origemNome = id => (ORIGENS.find(o => o[0] === id) || [id, id || 'outra rede'])[1];
  X.tool({
    id: 'reaproveitar', nome: 'Reaproveitar', icone: 'reciclar', ordem: 60,
    resumo: 'Transforma um post de outra rede em carrossel, legenda ou Reel nativo do Instagram.',
    init: () => ({ texto: '', origem: 'linkedin', destino: 'carrossel', escolhido: 0, salvoId: null }),
    render(S) {
      const p = 'kit.tools.reaproveitar';
      const entrada = `<section class="card kit-in">
        <h2>Reaproveitar</h2>
        <p class="lead">Mantém a ideia e os fatos do que você já escreveu e refaz pro Instagram: primeira linha nova que funciona antes do "mais", frases curtas e nada que denuncie outra rede.</p>
        <div class="field"><span>De onde vem</span>${X.h.seg(p + '.origem', ORIGENS)}</div>
        ${X.h.campo({ path: p + '.texto', label: 'Texto original', tipo: 'textarea', rows: 9, placeholder: 'Cole o post, o artigo, o roteiro do vídeo ou a thread.', help: 'Até uns 8.000 caracteres. O que passar disso é cortado.' })}
        <div class="field"><span>Vai virar</span>${X.h.seg(p + '.destino', [['carrossel', 'Carrossel'], ['legenda', 'Legenda'], ['reel', 'Reel']])}</div>
        <button type="button" class="btn primary" data-a="x-kg-reap-gerar" ${desab(S)}>${ic('reciclar', 'sm')} Adaptar pro Instagram</button>
        ${salvosHTML('reaproveitar')}
      </section>`;
      let saida;
      if (S.busy) saida = X.h.ocupado('Tirando a espinha do texto e refazendo o gancho. Leva de 15 segundos a 1 minuto.') + `<button type="button" class="btn sm" data-a="x-parar" data-t="reaproveitar">${ic('stop', 'sm')} Parar</button>`;
      else if (!S.res) saida = X.h.erro(S.err) + X.h.vazio('A adaptação aparece aqui.', 'Você recebe a ideia central, a transformação pro público do Instagram, 3 opções de primeira linha (antes do "mais"), os pontos na ordem, o que a pessoa leva pronto e o que tirar. Depois é um clique pro carrossel, a legenda ou o roteiro do Reel no Estúdio.');
      else saida = X.h.erro(S.err) + reapOut(S, S.res);
      return `<div class="kit">${entrada}<section class="kit-out kg-out">${saida}</section></div>`;
    }
  });
  const ganchosDe = r => (r.ganchos || []).map(gObj).filter(g => g.texto);
  function reapOut(S, r) {
    const gs = ganchosDe(r);
    const esc0 = Math.min(Math.max(Number(S.escolhido) || 0, 0), Math.max(gs.length - 1, 0));
    const dn = { carrossel: 'Montar o carrossel', legenda: 'Escrever a legenda', reel: 'Levar pro Estúdio' }[r.destino];
    const di = { carrossel: 'carrossel', legenda: 'legenda', reel: 'estudio' }[r.destino];
    const lim = limGancho();
    const conta = r.destino !== 'reel';
    const leva = r.levaPronto || [];
    return `<div class="card kit-sec">
        <div class="kit-row"><h3 class="grow">Ideia central</h3>${r.objetivo ? `<span class="tag mono">${esc(OBJ_NOME[r.objetivo] || r.objetivo)}</span>` : ''}<span class="tag mono">${esc(origemNome(S.resOrigem))} → ${esc(r.destino)}</span></div>
        <div class="decision"><b>${esc(r.ideiaCentral)}</b></div>
        ${r.transformacao ? `<div class="valor"><div class="vrow seg"><span class="k">Antes → depois pro seu público</span><p>${esc(r.transformacao)}</p></div></div>` : ''}
      </div>
      <div class="card kit-sec"><h3>Primeira linha (antes do "mais")</h3><p class="kit-hint">Escolha uma. Ela vai junto pro próximo passo.${conta && assinatura() ? ` A assinatura ocupa o começo da legenda: sobram ${lim} caracteres.` : ''}</p>
        <div class="kg-gs">${gs.map((g, i) => `<div class="kg-g ${i === esc0 ? 'on' : ''}"><span>${hl(g.texto)}${g.formula || conta ? `<span class="kit-row" style="margin-top:4px">${g.formula ? `<span class="tag">${esc(formNome(g.formula))}</span>` : ''}${conta ? contaTag(g.texto, lim) : ''}</span>` : ''}</span>${i === esc0 ? '<span class="tag amber">Escolhido</span>' : `<button type="button" class="btn xs" data-a="x-kg-reap-usar" data-i="${i}">Usar este</button>`}</div>`).join('')}</div>
      </div>
      <div class="card kit-sec"><h3>Pontos na ordem</h3><ol class="list">${r.pontos.map(x => `<li>${hl(x)}</li>`).join('')}</ol></div>
      ${leva.length || r.proximo ? `<div class="card kit-sec"><h3>O que a pessoa ganha</h3>${leva.length ? `<p style="margin:0"><b>Leva pronto:</b></p><ul class="list">${leva.map(x => `<li>${hl(x)}</li>`).join('')}</ul>` : ''}${r.proximo ? `<p style="margin:0"><b>Próximo post (motivo pra seguir):</b> ${esc(r.proximo)}</p>` : ''}</div>` : ''}
      ${r.remover.length ? `<div class="card kit-sec"><h3>Tirar do texto (marcas da outra rede)</h3>${X.h.lista(r.remover, 'warnlist')}</div>` : ''}
      <div class="card kit-sec">${r.porqueDestino ? `<p style="margin:0">${esc(r.porqueDestino)}</p>` : ''}
        ${r.midia ? `<p class="kit-hint">Você vai precisar de: ${esc(r.midia)}. O Instagram não publica só texto.</p>` : ''}
        <div class="kit-row"><button type="button" class="btn primary" data-a="x-kg-reap-seguir">${ic(di, 'sm')} ${esc(dn)}</button>
        ${gs[esc0] ? X.h.copiar(gs[esc0].texto, 'Copiar primeira linha') : ''}
        <button type="button" class="btn sm" data-a="x-kg-reap-salvar">${ic('check', 'sm')} Salvar</button></div>
      </div>`;
  }
  X.action('x-kg-reap-gerar', () => {
    const S = X.toolState('reaproveitar');
    if (S.busy) return;
    const txt = X.str(S.texto);
    if (txt.length < 40) { S.err = 'Cole o texto original (pelo menos um parágrafo) pra adaptar.'; X.refresh(); return; }
    const org = S.origem;
    const de = origemNome(org), pra = supNorm(S.destino, 'carrossel');
    const a = A();
    const fmts = pra === 'reel' && a ? X.formatosLista() : '';
    const lim = limGancho();
    const prompt = [
      X.ctxPerfil({ semGravacao: pra !== 'reel' }),
      kb('reaproveitar'), blocoF(pra), pra === 'carrossel' ? kb('carrossel') : pra === 'legenda' ? kb('legenda') : '',
      `═══ TAREFA: REAPROVEITAR CONTEÚDO DE ${de.toUpperCase()} NO INSTAGRAM (${pra}) ═══
TEXTO ORIGINAL:
"""
${corta(txt, 8000)}
"""
Regras:
- Isto transforma, não inventa. Mantenha a ideia, os fatos e os números do original; não acrescente número, caso ou resultado (nem valor em reais que o original não traz). Se faltar algo, [PREENCHER: o quê].
- Tire a espinha: a afirmação, a história ou o número que vale manter. Corte a enrolação de ligação.
- Re-gancho: o gancho do original quase nunca serve. Escreva 3 ganchos novos, com fórmulas diferentes (informe o id da fórmula de cada um), que se sustentam sozinhos${pra === 'reel' ? ' e se falam em até 3 segundos' : `: ${regraDobra(lim)}`}.
- Tire os artefatos de outra plataforma e liste em "remover" com o porquê: @ do X, "link nos comentários" do LinkedIn, "comente abaixo", numeração de thread (1/7), hashtags erradas ou em parede, "se inscreva", referências a "thread", "newsletter", "artigo", "como escrevi no LinkedIn".
- Mantenha a voz do criador (DNA e tom acima).
- Pontos: de 3 a 8, na ordem em que entram no post, cada um uma ideia só, com o ganho na frente. O último ponto é o ganho prático, não um resumo.
- "levaPronto": o passo, a frase ou o checklist (até 3 itens) que a pessoa usa hoje, tirado do original. Se o original não tem, monte a partir da ideia dele, sem número novo; onde precisar de dado, [PREENCHER: o quê].
- "proximo": o assunto do próximo post que continua este (é o motivo pra seguir).
- "objetivo": o objetivo principal (salvamentos, compartilhamentos, comentarios ou seguidores) pela natureza do conteúdo.
- "midia": diga qual imagem, slides ou vídeo o criador precisa ter; sem mídia o post não sai.
- Hashtags ficam pra ferramenta de hashtags: não liste aqui.
- Destino pedido: ${pra}. Se outro destino servir muito melhor, diga em "porqueDestino", mas mantenha "${pra}" no campo destino.
${pra === 'reel' ? `- Escolha o formato de Reel do app que mais serve (formatoReel = um destes ids):\n${fmts}` : '- formatoReel: deixe vazio.'}`
    ].filter(Boolean).join('\n\n') + fimJSON(`{"ideiaCentral": "1 frase", "transformacao": "antes → depois pro público do Instagram", "objetivo": "salvamentos", "ganchos": [{"texto": "gancho 1", "formula": "lista"}, {"texto": "gancho 2", "formula": "contraria"}, {"texto": "gancho 3", "formula": "cena"}], "pontos": ["ponto 1", "ponto 2", "ponto 3"], "levaPronto": ["passo que a pessoa usa hoje"], "proximo": "assunto do próximo post", "midia": "o que o criador precisa ter: foto, slides ou vídeo", "remover": ["\\"link nos comentários\\" do LinkedIn: no Instagram link na legenda não clica", "numeração 1/7 do fio do X: no carrossel cada slide já é um ponto"], "destino": "${pra}", "porqueDestino": "1 frase", "formatoReel": "${pra === 'reel' ? 'lista' : ''}"}`);
    // metadados só valem se a resposta vier boa (falha ou Parar mantém o resultado anterior coerente)
    const rt = corta(txt, 6000);
    X.rodar(S, prompt, r => {
      const o = parseReap(r);
      if (o) { o.destino = pra; S.escolhido = 0; S.resOrigem = org; S.resTexto = rt; S.salvoId = null; }
      return o;
    }, { tier: 'complex' });
  });
  X.action('x-kg-reap-usar', el => { const S = X.toolState('reaproveitar'); S.escolhido = Number(el.dataset.i) || 0; X.refresh(); });
  X.action('x-kg-reap-seguir', () => {
    const S = X.toolState('reaproveitar'); const r = S.res; if (!r) return;
    const gs = ganchosDe(r);
    const g = (gs[Math.min(Number(S.escolhido) || 0, gs.length - 1)] || {}).texto || '';
    const de = origemNome(S.resOrigem);
    const obj = r.objetivo || 'salvamentos';
    const leva = r.levaPronto || [];
    if (r.destino === 'carrossel') {
      const base = ['Ideia central: ' + r.ideiaCentral, r.transformacao && 'Antes e depois: ' + r.transformacao, 'Pontos na ordem (um por slide):\n- ' + r.pontos.join('\n- '), leva.length && 'A pessoa leva pronto:\n- ' + leva.join('\n- '), r.proximo && 'Próximo post (motivo pra seguir): ' + r.proximo, r.remover.length && 'Não use: ' + r.remover.join('; '), S.resTexto && 'Trecho do original (só pra conferir fatos):\n' + S.resTexto].filter(Boolean).join('\n\n');
      X.abrirFerramenta('carrossel', { tema: r.ideiaCentral, gancho: g, objetivo: obj, formula: 'auto', base, origem: 'Reaproveitado de ' + de });
    } else if (r.destino === 'legenda') {
      X.abrirFerramenta('legenda', { assunto: r.ideiaCentral, gancho: g, objetivo: obj, base: [r.pontos.join('\n'), leva.length && 'Leva pronto: ' + leva.join('; '), r.proximo && 'Próximo post: ' + r.proximo].filter(Boolean).join('\n'), tipo: 'imagem', origem: 'Reaproveitado de ' + de });
    } else {
      X.paraEstudio({
        assunto: junta([r.ideiaCentral, r.transformacao && 'Antes e depois: ' + r.transformacao]), gancho: g, formatoId: r.formatoReel, objetivo: OBJ_ESTUDIO[obj], proximo: r.proximo || '',
        obs: ['Pontos do conteúdo original, na ordem:\n- ' + r.pontos.join('\n- '), leva.length ? 'Leva pronto: ' + leva.join('; ') : ''].filter(Boolean).join('\n'), why: `Reaproveitado de ${de}.`
      });
    }
  });
  X.action('x-kg-reap-salvar', () => {
    const S = X.toolState('reaproveitar'); if (!S.res) return;
    salvarPeca(S, { tipo: 'reaproveitar', titulo: X.str(S.res.ideiaCentral, 80) || 'Reaproveitado', form: { origem: S.resOrigem, destino: S.res.destino, escolhido: S.escolhido }, meta: { resOrigem: S.resOrigem, resTexto: S.resTexto || '' }, res: S.res }, 'Adaptação salva.');
  });

  /* =====================================================================
     3) REVISAR PERFIL
     ===================================================================== */
  X.tool({
    id: 'perfil', nome: 'Revisar perfil', icone: 'perfil', ordem: 70,
    resumo: 'Revisa foto, nome, bio, link, destaques, grade e fixados pra quem chega querer seguir.',
    init: () => ({ categoria: '', link: '', destaques: '', fixados: '', grid: '', foto: '', objetivo: 'seguidores', salvoId: null }),
    render(S) {
      const p = 'kit.tools.perfil';
      const pf = prof();
      const tem = [pf.nome, pf.nicho, pf.publico].filter(Boolean).length;
      const entrada = `<section class="card kit-in">
        <h2>Revisar perfil</h2>
        <p class="lead">A decisão de seguir acontece no topo do perfil: em 3 segundos a pessoa precisa entender o que ganha seguindo. Aqui você vê o que trava isso e recebe o texto pronto.</p>
        ${tem < 2 ? `<div class="errnote warn">${ic('alert', 'sm')}<span>Preencha nome, nicho e público na tela Perfil: a revisão fica muito melhor.</span><button type="button" class="btn xs" data-a="nav" data-v="perfil">Abrir Perfil</button></div>` : `<p class="kit-hint">Usando o Perfil: ${esc([pf.nome, pf.handle, pf.nicho].filter(Boolean).join(' · '))}${pf.bio ? ' · bio atual incluída' : ''}.</p>`}
        <div class="field"><span>Objetivo do perfil</span>${X.h.seg(p + '.objetivo', [['seguidores', 'Seguidores'], ['produto', 'Vender produto'], ['clientes', 'Clientes'], ['autoridade', 'Autoridade']])}</div>
        ${X.h.campo({ path: p + '.foto', label: 'Como é a foto', placeholder: 'Ex.: rosto de perto, fundo claro, sorrindo' })}
        ${X.h.campo({ path: p + '.categoria', label: 'Categoria', placeholder: 'Ex.: Advogado(a), Criador de conteúdo digital' })}
        ${X.h.campo({ path: p + '.link', label: 'Link da bio', placeholder: 'Ex.: link do WhatsApp, página de agenda' })}
        ${X.h.campo({ path: p + '.destaques', label: 'Destaques (um por linha)', tipo: 'textarea', rows: 3 })}
        ${X.h.campo({ path: p + '.fixados', label: 'Posts fixados', tipo: 'textarea', rows: 3, placeholder: 'Descreva os até 3 posts fixados' })}
        ${X.h.campo({ path: p + '.grid', label: 'Grade (9 primeiros posts)', tipo: 'textarea', rows: 4, placeholder: 'Descreva os 9 primeiros posts' })}
        <button type="button" class="btn primary" data-a="x-kg-perfil-gerar" ${desab(S)}>${ic('perfil', 'sm')} Revisar perfil</button>
        ${salvosHTML('perfil')}
      </section>`;
      let saida;
      if (S.busy) saida = X.h.ocupado('Revisando as 9 partes do perfil. Leva de 15 segundos a 1 minuto.') + `<button type="button" class="btn sm" data-a="x-parar" data-t="perfil">${ic('stop', 'sm')} Parar</button>`;
      else if (!S.res) saida = X.h.erro(S.err) + X.h.vazio('A revisão do perfil aparece aqui.', 'Você recebe uma nota, o motivo pra seguir que o topo precisa passar, o diagnóstico de cada parte com o texto pronto pra trocar, campo Nome e bios prontas pra usar, destaques, fixados e as 3 primeiras ações.');
      else saida = X.h.erro(S.err) + perfilOut(S.res);
      return `<div class="kit">${entrada}<section class="kit-out kg-out">${saida}</section></div>`;
    }
  });
  const STATUS_TAG = { passa: 'good', ajustar: 'warn', reprova: 'bad' };
  const desfazerBtn = (r, campo, rotulo) => (r.anterior && Object.prototype.hasOwnProperty.call(r.anterior, campo) ? `<button type="button" class="btn xs ghost" data-a="x-kg-perfil-desfazer" data-c="${esc(campo)}">Voltar ${esc(rotulo)} anterior</button>` : '');
  function perfilOut(r) {
    const itens = r.itens.map(it => {
      const depois = it.depois || it.acao || '';
      return `<div class="kg-area"><div class="kg-ah"><b>${esc(AREA_NOME[it.area] || it.area)}</b><span class="kit-row">${it.status ? `<span class="tag ${STATUS_TAG[it.status] || ''}">${esc(it.status)}</span>` : ''}${it.nota != null ? `<span class="tag mono">${it.nota}/10</span>` : ''}</span></div>
        ${it.nota != null ? `<div class="kg-bar ${barCls(it.nota, 10)}"><i style="width:${it.nota * 10}%"></i></div>` : ''}
        ${it.diagnostico ? `<p class="kg-diag">${esc(it.diagnostico)}</p>` : ''}
        ${it.antes ? `<p class="kg-diag">Hoje: ${esc(it.antes)}</p>` : ''}
        ${depois ? `<p class="kg-acao"><strong>Trocar por:</strong> ${hl(depois)}</p><div class="kit-row">${X.h.copiar(depois, 'Copiar')}</div>` : ''}</div>`;
    }).join('');
    const bios = r.bios.map((b, i) => {
      const trava = b.bad || b.pendente;
      return `<div class="kg-bio"><pre>${hl(b.texto)}</pre>
        <div class="kit-row"><span class="tag mono ${b.bad ? 'bad' : 'good'}">${b.chars}/150</span>${b.bad ? '<small>Passa de 150: corte antes de usar.</small>' : ''}${b.pendente ? '<small>Complete o [PREENCHER] antes de usar.</small>' : ''}</div>
        ${b.porque ? `<small>${esc(b.porque)}</small>` : ''}
        <div class="kit-row">${X.h.copiar(b.texto, 'Copiar')}<button type="button" class="btn xs" data-a="x-kg-perfil-bio" data-i="${i}" ${trava ? 'disabled' : ''}>${ic('check', 'sm')} Usar no Perfil</button></div></div>`;
    }).join('');
    const nomeTrava = r.nomeBad || r.nomePendente;
    return `<div class="card kit-sec">
        <div class="kg-top"><span class="kit-score">${r.nota}<small>/100</small></span><div>${r.resumo ? `<p style="margin:0">${esc(r.resumo)}</p>` : ''}</div></div>
        ${r.porQueSeguir ? `<div class="decision"><span class="eyebrow">O topo precisa dizer</span><b>${esc(r.porQueSeguir)}</b></div>` : ''}
      </div>
      ${r.prioridades.length ? `<div class="card kit-sec"><h3>Faça primeiro</h3><ol class="list">${r.prioridades.map(x => `<li>${esc(x)}</li>`).join('')}</ol></div>` : ''}
      ${r.nome ? `<div class="card kit-sec"><h3>Campo Nome</h3><div class="kg-bio"><pre>${hl(r.nome)}</pre>
        <div class="kit-row"><span class="tag mono ${r.nomeBad ? 'bad' : 'good'}">${r.nomeChars}/${NOME_MAX}</span>${r.nomeBad ? `<small>Passa de ${NOME_MAX}: encurte antes de usar.</small>` : ''}${r.nomePendente ? '<small>Complete o [PREENCHER] antes de usar.</small>' : ''}<small>É o campo que a busca do Instagram lê. Leva uma palavra que o seu público digita.</small></div>
        <div class="kit-row">${X.h.copiar(r.nome, 'Copiar')}<button type="button" class="btn xs" data-a="x-kg-perfil-nome" ${nomeTrava ? 'disabled' : ''}>${ic('check', 'sm')} Usar no Perfil</button>${desfazerBtn(r, 'nomeCampo', 'ao Campo Nome')}</div></div></div>` : ''}
      ${bios ? `<div class="card kit-sec"><h3>Bios</h3>${bios}${desfazerBtn(r, 'bio', 'pra bio') ? `<div class="kit-row">${desfazerBtn(r, 'bio', 'pra bio')}</div>` : ''}</div>` : ''}
      ${itens ? `<div class="card kit-sec"><h3>Parte por parte</h3><div class="kg-areas">${itens}</div></div>` : ''}
      ${r.destaques.length ? `<div class="card kit-sec"><h3>Destaques</h3><div class="kg-dest">${r.destaques.map(d => `<div><b>${esc(d.nome)}</b>${d.longo ? '<span class="tag warn">nome longo</span> ' : ''}${esc(d.conteudo)}</div>`).join('')}</div></div>` : ''}
      ${r.fixados.length ? `<div class="card kit-sec"><h3>Fixados</h3><div class="kg-areas">${r.fixados.map(f => `<div class="kg-area"><p class="kg-acao"><strong>${hl(f.post)}</strong></p>${f.porque ? `<p class="kg-diag">${esc(f.porque)}</p>` : ''}</div>`).join('')}</div></div>` : ''}
      <div class="card kit-sec"><div class="kit-row"><button type="button" class="btn sm primary" data-a="x-kg-perfil-salvar">${ic('check', 'sm')} Salvar revisão</button></div></div>`;
  }
  X.action('x-kg-perfil-gerar', () => {
    const S = X.toolState('perfil');
    if (S.busy) return;
    const p = prof();
    const L = (k, v) => (X.str(v) ? `${k}: ${X.str(v, 1500)}` : `${k}: (não informado)`);
    const obj = { seguidores: 'ganhar seguidores', produto: 'vender um produto', clientes: 'conseguir clientes', autoridade: 'construir autoridade' }[S.objetivo] || 'ganhar seguidores';
    let desemp = '';
    try { desemp = X.desempenho(); } catch (e) { desemp = ''; }
    const prompt = [
      X.ctxPerfil({ semGravacao: true }),
      kb('perfil'),
      desemp ? `═══ O QUE JÁ FUNCIONOU NO PERFIL ═══\n${desemp}\nEscolha os fixados entre estes; se nenhum servir, diga qual post criar e marque [PREENCHER: post].` : '',
      `═══ TAREFA: REVISÃO DO PERFIL EM 9 PARTES ═══
A decisão de seguir acontece no topo do perfil: em 3 segundos a pessoa precisa entender o que ganha seguindo. Teste do topo: lendo só foto, Nome, bio, link e a 1ª linha da grade, um estranho saberia pra quem é e ia querer seguir?
Objetivo do perfil: ${obj}.

O PERFIL HOJE:
${[L('Nome', p.nome), L('Apelido', p.apelido), L('@', p.handle), L('Campo Nome atual', p.nomeCampo), L('Nicho', p.nicho), L('Posicionamento', p.posicionamento), L('Público', p.publico), L('Promessa', p.promessa), L('Credencial real', p.credencial), L('Ofertas', p.ofertas), L('Bio atual', p.bio), L('Títulos que NUNCA podem ser usados pro criador', p.proibidos), L('Títulos permitidos', p.permitidos), L('Foto', S.foto), L('Categoria', S.categoria), L('Link da bio', S.link), L('Destaques', S.destaques), L('Fixados', S.fixados), L('Grade (9 primeiros posts)', S.grid)].join('\n')}

Avalie as 9 partes (foto, nome, handle, bio, link, categoria, destaques, grid, fixados) com nota 0–10. Use a nota 0–10 em vez de passa/ajustar/reprova (7+ passa, 4–6 ajustar, até 3 reprova). Toda parte com nota até 6 tem "depois" pronto pra copiar (o texto ou a escolha que entra no lugar) e "antes" (como está hoje, ou "não informado"). Parte "não informada": diga o que conferir e dê nota com cautela.
Regras:
- Campo Nome: nome real + a palavra que o público digita na busca, em até 30 caracteres (passou disso, corta na tela do celular).
- Bio: até 150 caracteres contando emojis e quebras de linha. Fórmula: o que quem segue ganha + do que você fala + uma prova real. Começa pelo ganho de quem lê, não pelo cargo. Sem "Ajudo X a Y" genérico, sem fileira de emoji, no máximo 1 emoji âncora. 3 opções diferentes.
- Nada de título, número ou prova que o criador não tem (use só a credencial real; se faltar, [PREENCHER: o quê]). Nada de promessa de resultado.${p.regulado ? ' Perfil de profissão regulada: respeite as regras do conselho, sem promessa e sem captação.' : ''}
- Link: um só, ligado ao objetivo.
- Destaques: 4 a 6, na ordem da próxima pergunta de quem chega (Comece aqui, Prova, Oferta, Dúvidas, Sobre), nome com até 15 caracteres.
- Fixados: até 3, cada um uma prova do que a pessoa vai ganhar seguindo (o que mais performou, a oferta, o "pra quem é").
- Grade: avaliada como conjunto (leitura rápida, visual consistente, mostra variedade).
- "porQueSeguir": a frase que o topo do perfil precisa comunicar.
- "prioridades": as 3 ações de maior impacto, em ordem.`
    ].filter(Boolean).join('\n\n') + fimJSON(`{"nota": 72, "resumo": "1–2 frases", "porQueSeguir": "a frase que o topo do perfil precisa comunicar", "itens": [{"area": "bio", "nota": 6, "diagnostico": "...", "antes": "como está hoje (ou 'não informado')", "depois": "o texto ou a escolha pronta pra usar"}], "nome": "Ana Souza | Advogada", "bios": [{"texto": "até 150 caracteres", "porque": "..."}], "destaques": [{"nome": "Comece aqui", "conteudo": "o que entra"}], "fixados": [{"post": "qual post fixar ou criar", "porque": "..."}], "prioridades": ["ação 1", "ação 2", "ação 3"]}`);
    X.rodar(S, prompt, r => { const o = parsePerfil(r); if (o) S.salvoId = null; return o; }, { tier: 'complex' });
  });
  // grava no Perfil guardando o valor anterior no resultado (botão "Voltar ... anterior")
  const gravaPerfil = (S, campo, valor, msg) => {
    const a = A(); if (!a || !valor || !S.res) return;
    const antes = a.st.profile[campo] == null ? '' : a.st.profile[campo];
    if (antes === valor) { a.toast('O Perfil já está com este texto.'); return; }
    S.res.anterior = Object.assign({}, S.res.anterior || {});
    if (!Object.prototype.hasOwnProperty.call(S.res.anterior, campo)) S.res.anterior[campo] = antes;
    a.st.profile[campo] = valor;
    try { a.Store.saveEstado(); } catch (e) { }
    a.toast(msg, 'good');
    X.refresh();
  };
  X.action('x-kg-perfil-bio', el => { const S = X.toolState('perfil'); const b = S.res && S.res.bios[Number(el.dataset.i) || 0]; if (b && !b.bad && !pendente(b.texto)) gravaPerfil(S, 'bio', b.texto, 'Bio trocada no Perfil. Se quiser a anterior de volta, use "Voltar pra bio anterior".'); });
  X.action('x-kg-perfil-nome', () => { const S = X.toolState('perfil'); if (S.res && S.res.nome && !S.res.nomeBad && !pendente(S.res.nome)) gravaPerfil(S, 'nomeCampo', S.res.nome, 'Campo Nome trocado no Perfil. Se quiser o anterior de volta, use "Voltar ao Campo Nome anterior".'); });
  X.action('x-kg-perfil-desfazer', el => {
    const S = X.toolState('perfil'); const a = A(); const c = el.dataset.c;
    if (!a || !S.res || !S.res.anterior || !['bio', 'nomeCampo'].includes(c) || !Object.prototype.hasOwnProperty.call(S.res.anterior, c)) return;
    a.st.profile[c] = S.res.anterior[c];
    const ant = Object.assign({}, S.res.anterior); delete ant[c]; S.res.anterior = ant;
    try { a.Store.saveEstado(); } catch (e) { }
    a.toast(c === 'bio' ? 'Bio anterior de volta no Perfil.' : 'Campo Nome anterior de volta no Perfil.', 'good');
    X.refresh();
  });
  X.action('x-kg-perfil-salvar', () => {
    const S = X.toolState('perfil'); if (!S.res) return;
    salvarPeca(S, { tipo: 'perfil', titulo: `Revisão do perfil · nota ${S.res.nota}`, form: { categoria: S.categoria, link: S.link, destaques: S.destaques, fixados: S.fixados, grid: S.grid, foto: S.foto, objetivo: S.objetivo }, res: Object.assign({}, S.res, { anterior: undefined }) }, 'Revisão salva.');
  });

  /* =====================================================================
     4) TELA VIRAIS
     ===================================================================== */
  X.hook('viraisToolbar', () => `<button type="button" class="btn" data-a="x-kg-gancho">${ic('anzol', 'sm')} Extrair gancho de um viral</button>`);
  X.action('x-kg-gancho', () => X.abrirFerramenta('gancho', { origem: '', viralId: '' }));
  X.hook('viralExtra', v => {
    if (!v) return '';
    const An = v.analise;
    const sup = An && An.entrega && An.entrega.comoSuperar;
    const reel = An && An.modelagem ? `<button type="button" class="btn sm primary" data-a="modelar" data-i="-1">${ic('estudio', 'sm')} Roteiro de Reel</button>` : `<button type="button" class="btn sm primary" data-a="x-kg-viral-reel">${ic('estudio', 'sm')} Roteiro de Reel</button>`;
    return `<div class="blk kg-viral"><div class="blk-h"><h3>Recriar este viral</h3></div>
      <p>Modelar é copiar a estrutura e entregar mais valor no seu nicho.${v.tipo === 'carrossel' ? ' Replique como carrossel ou transforme em Reel.' : ' Recrie como Reel ou transforme em carrossel.'}</p>
      ${sup ? `<p class="kg-sup"><b>Como superar:</b> ${esc(sup)}</p>` : ''}
      <div class="kit-row">${v.tipo === 'carrossel' ? `<button type="button" class="btn sm primary" data-a="x-kg-viral-car">${ic('carrossel', 'sm')} Replicar carrossel</button>${reel.replace('btn sm primary', 'btn sm').replace('Roteiro de Reel', 'Virar Reel')}` : `${reel}
        <button type="button" class="btn sm" data-a="x-kg-viral-car">${ic('carrossel', 'sm')} Virar carrossel</button>`}
        <button type="button" class="btn sm" data-a="x-kg-viral-leg">${ic('legenda', 'sm')} Legenda</button>
        <button type="button" class="btn sm ghost" data-a="x-kg-viral-gancho">${ic('anzol', 'sm')} Extrair o gancho</button></div>
    </div>`;
  });
  const viralModal = () => { const a = A(); const m = a && a.ui.modal; return m && m.type === 'viral' ? viral(m.id) : null; };
  const objViral = v => {
    const An = v.analise || {};
    const s = semAcento([An.formato, (An.gancho || {}).categoria, (An.gancho || {}).formula].join(' '));
    if (/lista|passo|framework|metodo|tutorial/.test(s)) return 'salvamentos';
    return 'compartilhamentos';
  };
  X.action('x-kg-viral-reel', () => {
    const v = viralModal(); if (!v) return;
    const car = v.tipo === 'carrossel';
    const est = (v.analise && v.analise.estrutura) || [];
    const slides = car ? [est.length ? est.map(e => `${e.parte}: ${e.oque}`).join('\n') : '', X.str(v.roteiro)].filter(Boolean).join('\n') : '';
    X.paraEstudio({ assunto: X.str(v.titulo, 300) || corta(X.str(v.roteiro), 400), gancho: '', formatoId: car ? 'lista' : undefined, why: car ? `Transformando o carrossel viral de ${v.handle || 'outro perfil'} em Reel: cada slide vira um bloco de fala, a capa vira o gancho.` : `Recriando o viral de ${v.handle || 'outro perfil'}: mesma estrutura, mais valor, no seu nicho.`, obs: car ? 'Carrossel viral de referência. Transforme a sequência em Reel (capa = gancho falado e na tela, um slide = um bloco curto, resumo = frase-chiclete). Modele a estrutura, não copie frases:\n' + corta(slides, 1500) : v.roteiro ? 'Roteiro do viral de referência (modele a estrutura, não copie frases):\n' + corta(v.roteiro, 900) : '' });
  });
  X.action('x-kg-viral-car', () => {
    const v = viralModal(); if (!v) return;
    const mo = (v.analise && v.analise.modelagem) || {};
    const est = (v.analise && v.analise.estrutura) || [];
    const base = v.tipo === 'carrossel' && est.length ? corta('Slides do carrossel viral (modele a sequência, não copie frases):\n' + est.map(e => `${e.parte}: ${e.oque}`).join('\n') + '\n\n' + baseViral(v), 3000) : baseViral(v);
    const nSl = v.tipo === 'carrossel' && est.length ? Math.max(5, Math.min(10, est.length)) : 7;
    X.abrirFerramenta('carrossel', { tema: mo.angulo || v.titulo || '', gancho: typeof mo.gancho === 'string' ? mo.gancho : '', base, objetivo: objViral(v), formula: 'auto', slides: nSl, origem: (v.tipo === 'carrossel' ? 'Carrossel viral ' : 'Viral ') + (v.handle || '') });
  });
  X.action('x-kg-viral-leg', () => {
    const v = viralModal(); if (!v) return;
    const mo = (v.analise && v.analise.modelagem) || {};
    X.abrirFerramenta('legenda', { assunto: mo.angulo || v.titulo || '', gancho: typeof mo.gancho === 'string' ? mo.gancho : '', base: baseViral(v), objetivo: objViral(v), tipo: 'reel', origem: 'Viral ' + (v.handle || '') });
  });
  X.action('x-kg-viral-gancho', () => {
    const v = viralModal(); if (!v) return;
    X.abrirFerramenta('gancho', { viralId: v.id, texto: '', origem: 'Viral ' + (v.handle || '') });
  });
})();
