/* Narrador de Impacto — Kit Instagram: crescer (extrair e recriar gancho, reaproveitar, perfil 360)
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
.kg-area b{font-size:14.5px; text-transform:capitalize}
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

  /* ---------- parsers ---------- */
  const parseGancho = r => {
    if (!r || typeof r !== 'object') return null;
    const gancho = X.str(r.gancho, 400);
    const recriados = X.arr(r.recriados, 3, o => {
      if (typeof o === 'string') o = { texto: o };
      if (!o || typeof o !== 'object') return null;
      const texto = X.str(o.texto, 400);
      if (!texto) return null;
      return { texto, superficie: supNorm(o.superficie, 'reel'), formula: formNorm(o.formula), angulo: X.str(o.angulo, 300), porque: X.str(o.porque, 300) };
    });
    if (!gancho || !recriados.length) return null;
    const en = r.entrega && typeof r.entrega === 'object' ? r.entrega : {};
    return {
      gancho, formula: formNorm(r.formula), objetivo: objNorm(r.objetivo) || 'salvamentos',
      porque: X.str(r.porque, 500), mecanismo: X.str(r.mecanismo, 300), molde: X.str(r.molde, 400),
      entrega: { transformacao: X.str(en.transformacao, 400), comoSuperar: X.str(en.comoSuperar, 500) },
      recriados, cuidado: X.str(r.cuidado, 400)
    };
  };
  const parseReap = r => {
    if (!r || typeof r !== 'object') return null;
    const ideiaCentral = X.str(r.ideiaCentral, 400);
    const ganchos = X.arr(r.ganchos, 3, y => X.str(typeof y === 'object' && y ? y.texto : y, 300));
    const pontos = X.arr(r.pontos, 8, y => X.str(typeof y === 'object' && y ? y.texto : y, 400));
    if (!ideiaCentral || !ganchos.length || !pontos.length) return null;
    return {
      ideiaCentral, transformacao: X.str(r.transformacao, 400), ganchos, pontos,
      remover: X.arr(r.remover, 8, y => X.str(typeof y === 'object' && y ? [y.o, y.oque, y.texto, y.porque].filter(Boolean).join(': ') : y, 300)),
      destino: supNorm(r.destino, 'carrossel'), porqueDestino: X.str(r.porqueDestino, 300),
      formatoReel: X.str(r.formatoReel, 40).toLowerCase()
    };
  };
  const AREAS = ['foto', 'nome', 'handle', 'bio', 'link', 'categoria', 'destaques', 'grid', 'fixados'];
  const areaNorm = v => { const s = semAcento(v); return AREAS.find(a => s.includes(a)) || (s.includes('@') ? 'handle' : s.includes('fix') || s.includes('pin') ? 'fixados' : s.includes('destaq') || s.includes('highlight') ? 'destaques' : ''); };
  const parsePerfil = r => {
    if (!r || typeof r !== 'object') return null;
    const itens = X.arr(r.itens, 9, o => {
      if (!o || typeof o !== 'object') return null;
      const area = areaNorm(o.area);
      if (!area) return null;
      return { area, nota: X.num(o.nota, 0, 10), diagnostico: X.str(o.diagnostico, 400), acao: X.str(o.acao, 400) };
    });
    const bios = X.arr(r.bios, 3, o => {
      if (typeof o === 'string') o = { texto: o };
      if (!o || typeof o !== 'object') return null;
      const texto = X.str(o.texto, 400);
      if (!texto) return null;
      const n = grafemas(texto);
      return { texto, porque: X.str(o.porque, 300), chars: n, bad: n > 150 };
    });
    const nota = X.num(r.nota, 0, 100);
    if (nota == null || (!itens.length && !bios.length)) return null;
    const nome = X.str(r.nome, 120);
    const nomeChars = grafemas(nome);
    return {
      nota, resumo: X.str(r.resumo, 400), porQueSeguir: X.str(r.porQueSeguir, 300), itens,
      nome, nomeChars, nomeBad: nomeChars > 64, bios,
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
    init: () => ({ texto: '', viralId: '', superficie: 'reel', origem: '' }),
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
        ${X.h.campo({ path: p + '.viralId', label: 'Viral salvo', tipo: 'select', opcoes: opV, value: v ? v.id : '', help: virais.length ? 'Escolha um viral da tela Virais ou cole o texto abaixo.' : 'Você ainda não tem virais salvos. Cole o texto abaixo.' })}
        ${X.h.campo({ path: p + '.texto', label: v ? 'Texto extra (opcional)' : 'Texto do viral', tipo: 'textarea', rows: 5, placeholder: 'Cole a legenda, a transcrição, a primeira linha ou o que aparece escrito no primeiro frame.' })}
        <div class="field"><span>Onde vai usar</span>${X.h.seg(p + '.superficie', [['reel', 'Reel'], ['carrossel', 'Carrossel'], ['legenda', 'Legenda']])}</div>
        <button type="button" class="btn primary" data-a="x-kg-gancho-gerar" ${desab(S)}>${ic('anzol', 'sm')} Extrair e recriar</button>
        <p class="kit-hint">A IA não copia a frase do original: ela pega a função psicológica e recria no seu assunto.</p>
      </section>`;
      let saida;
      if (S.busy) saida = X.h.ocupado('Lendo o gancho e recriando no seu nicho. Leva de 15 segundos a 1 minuto.') + `<button type="button" class="btn sm" data-a="x-parar" data-t="gancho">${ic('stop', 'sm')} Parar</button>`;
      else if (!S.res) saida = X.h.erro(S.err) + X.h.vazio('O raio-x do gancho aparece aqui.', 'Você recebe a fórmula, o porquê de funcionar, um molde em branco, como entregar mais valor que o original e 3 ganchos recriados pra levar direto pro Reel, carrossel ou legenda.');
      else saida = X.h.erro(S.err) + ganchoOut(S.res);
      return `<div class="kit">${entrada}<section class="kit-out kg-out">${saida}</section></div>`;
    }
  });
  function ganchoOut(r) {
    const valor = (r.entrega.transformacao ? `<div class="vrow"><span class="k">Antes → depois do original</span><p>${esc(r.entrega.transformacao)}</p></div>` : '')
      + (r.mecanismo ? `<div class="vrow"><span class="k">Gatilho</span><p>${esc(r.mecanismo)}</p></div>` : '')
      + (r.entrega.comoSuperar ? `<div class="vrow seg"><span class="k">Como a sua versão entrega mais</span><p>${esc(r.entrega.comoSuperar)}</p></div>` : '');
    const ideias = r.recriados.map((g, i) => `<div class="idea ${i === 0 ? 'idea-best' : ''}">
        <div class="top"><span class="tag mono">${esc(g.superficie)}</span>${g.formula ? `<span class="tag">${esc(formNome(g.formula))}</span>` : ''}${i === 0 ? '<span class="tag amber">Mais forte</span>' : ''}</div>
        <q>${esc(g.texto)}</q>
        ${g.angulo ? `<p class="muted" style="margin:0 0 4px">${esc(g.angulo)}</p>` : ''}
        ${g.porque ? `<p class="kit-hint">${esc(g.porque)}</p>` : ''}
        <div class="kit-row" style="margin-top:10px">
          <button type="button" class="btn sm primary" data-a="x-kg-g-reel" data-i="${i}">${ic('estudio', 'sm')} Roteiro de Reel</button>
          <button type="button" class="btn sm" data-a="x-kg-g-car" data-i="${i}">${ic('carrossel', 'sm')} Carrossel</button>
          <button type="button" class="btn sm" data-a="x-kg-g-leg" data-i="${i}">${ic('legenda', 'sm')} Legenda</button>
          ${X.h.copiar(g.texto, 'Copiar')}
        </div></div>`).join('');
    return `<div class="card kit-sec">
        <div class="kit-row"><h3 class="grow">Gancho do original</h3>${r.formula ? `<span class="tag">${esc(formNome(r.formula))}</span>` : ''}<span class="tag mono">${esc(OBJ_NOME[r.objetivo] || r.objetivo)}</span></div>
        <div class="decision"><q class="mq">${esc(r.gancho)}</q></div>
        ${r.porque ? `<p style="margin:0">${esc(r.porque)}</p>` : ''}
      </div>
      ${r.molde ? `<div class="card kit-sec"><h3>Molde em branco</h3><pre class="kit-pre kg-molde">${esc(r.molde)}</pre><div class="kit-row">${X.h.copiar(r.molde, 'Copiar molde')}</div></div>` : ''}
      ${valor ? `<div class="card kit-sec"><h3>Valor que transforma</h3><div class="valor">${valor}</div></div>` : ''}
      <div class="card kit-sec"><h3>Recriados no seu nicho</h3><div class="ideas kg-ideas">${ideias}</div>
        <div class="kit-row"><button type="button" class="btn sm primary" data-a="x-kg-gancho-salvar">${ic('check', 'sm')} Salvar</button></div></div>
      ${r.cuidado ? `<div class="card kit-sec"><h3>O que não copiar</h3><p style="margin:0">${esc(r.cuidado)}</p></div>` : ''}`;
  }
  X.action('x-kg-gancho-gerar', () => {
    const S = X.toolState('gancho');
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
    const prompt = [
      X.ctxPerfil({ semGravacao: sup !== 'reel' }),
      blocoF(),
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
3. Se duas servirem, desempate pelo objetivo principal e pela superfície. Se nenhuma encaixar, descreva a estrutura e escolha a mais próxima.
4. Objetivo principal pelo fechamento: lista, método, passo a passo → salvamentos; verdade contrária ou mito derrubado → compartilhamentos; cena, pergunta, confissão → comentarios; prova de transformação, "segue pra..." → seguidores.
5. Molde em branco: o esqueleto da fórmula com {lacunas} nomeadas pro assunto do criador. Sem os vícios do original (travessão demais, palavra de IA, parede de hashtags, isca de engajamento).`,
      `═══ TAREFA: EXTRAIR O GANCHO E RECRIAR NO NICHO DO CRIADOR ═══
${fonte}

Superfície em que o criador vai usar: ${sup}.
Recrie no nicho do criador: mesma função psicológica, nunca a frase do original. Cada versão promete um ganho concreto que o criador consegue entregar (pelo DNA e pela verdade do perfil). Nada de número inventado: quando depender de dado dele, use [PREENCHER: o quê].
- Exatamente 3 ganchos recriados, com fórmulas variadas quando fizer sentido; o primeiro é o mais forte.
- Gancho de legenda cabe nos primeiros 125 caracteres. Gancho de Reel se fala em até 3 segundos.
- "comoSuperar": como a versão do criador entrega MAIS valor que o original (mais aplicável, mais específica, mais digna de mandar pra alguém), e por que seguir o perfil faz sentido depois.
- "cuidado": o que não copiar (frase, tema alheio, promessa que ele não cumpre, vícios).
- Linguagem de conversa, sem cara de IA, sem travessão.`
    ].filter(Boolean).join('\n\n') + fimJSON(`{"gancho": "o gancho identificado", "formula": "contraria", "objetivo": "compartilhamentos", "porque": "por que funciona (1–2 frases)", "mecanismo": "o gatilho psicológico", "molde": "Todo mundo diz {conselho comum}. Eu faço {o contrário} e {resultado}.", "entrega": {"transformacao": "o antes → depois que o original provoca", "comoSuperar": "como a versão do criador entrega mais valor"}, "recriados": [{"texto": "gancho novo completo", "superficie": "reel", "formula": "contraria", "angulo": "do que trata o post, 1 frase", "porque": "1 frase"}, {"texto": "...", "superficie": "reel", "formula": "numero", "angulo": "...", "porque": "..."}, {"texto": "...", "superficie": "reel", "formula": "cena", "angulo": "...", "porque": "..."}], "cuidado": "o que não copiar"}`);
    S.fonteTxt = v ? baseViral(v) || corta(txt, 3000) : corta(txt, 3000);
    S.fonteViral = v ? v.id : '';
    X.rodar(S, prompt, parseGancho, { tier: 'complex' });
  });
  const origemGancho = S => S.origem || (viral(S.fonteViral) ? 'Viral ' + (viral(S.fonteViral).handle || '') : 'texto colado');
  const recriado = el => { const S = X.toolState('gancho'); const g = S.res && S.res.recriados[Number(el.dataset.i) || 0]; return g ? { S, g } : null; };
  X.action('x-kg-g-reel', el => {
    const o = recriado(el); if (!o) return;
    const { S, g } = o, r = S.res;
    const v = viral(S.fonteViral);
    X.paraEstudio({
      gancho: g.texto, assunto: g.angulo + (r.entrega.comoSuperar ? ' — ' + r.entrega.comoSuperar : ''),
      objetivo: OBJ_ESTUDIO[r.objetivo], why: `Gancho recriado a partir de ${origemGancho(S)}.`,
      modelo: v && v.analise ? modeloDe(v) : null
    });
  });
  X.action('x-kg-g-car', el => {
    const o = recriado(el); if (!o) return;
    const { S, g } = o, r = S.res;
    X.abrirFerramenta('carrossel', { tema: g.angulo || g.texto, gancho: g.texto, objetivo: r.objetivo, formula: ['lista', 'antesdepois', 'mito', 'framework'].includes(g.formula) ? g.formula : 'auto', base: corta(S.fonteTxt || '', 3000), origem: origemGancho(S) });
  });
  X.action('x-kg-g-leg', el => {
    const o = recriado(el); if (!o) return;
    const { S, g } = o, r = S.res;
    X.abrirFerramenta('legenda', { assunto: g.angulo || g.texto, gancho: g.texto, objetivo: r.objetivo, tipo: 'imagem', origem: origemGancho(S) });
  });
  X.action('x-kg-gancho-salvar', () => {
    const S = X.toolState('gancho'); if (!S.res) return;
    X.salvar('pecas', { tipo: 'gancho', titulo: X.str(S.res.recriados[0].texto, 80) || 'Gancho', form: { viralId: S.fonteViral || '', superficie: S.superficie, origem: origemGancho(S) }, res: S.res });
    salvo('Gancho salvo.');
  });

  /* =====================================================================
     2) REAPROVEITAR
     ===================================================================== */
  const ORIGENS = [['linkedin', 'LinkedIn'], ['blog', 'Blog'], ['youtube', 'YouTube'], ['x', 'X'], ['outro', 'Outro']];
  const origemNome = id => (ORIGENS.find(o => o[0] === id) || [id, id || 'outra rede'])[1];
  X.tool({
    id: 'reaproveitar', nome: 'Reaproveitar', icone: 'reciclar', ordem: 60,
    resumo: 'Transforma um post de outra rede em carrossel, legenda ou Reel nativo do Instagram.',
    init: () => ({ texto: '', origem: 'linkedin', destino: 'carrossel', escolhido: 0 }),
    render(S) {
      const p = 'kit.tools.reaproveitar';
      const entrada = `<section class="card kit-in">
        <h2>Reaproveitar</h2>
        <p class="lead">Mantém a ideia e os fatos do que você já escreveu e refaz a entrega pro Instagram: gancho novo antes do "mais", ritmo de feed e nada que denuncie outra rede.</p>
        <div class="field"><span>De onde vem</span>${X.h.seg(p + '.origem', ORIGENS)}</div>
        ${X.h.campo({ path: p + '.texto', label: 'Texto original', tipo: 'textarea', rows: 9, placeholder: 'Cole o post, o artigo, o roteiro do vídeo ou a thread.', help: 'Até uns 8.000 caracteres. O que passar disso é cortado.' })}
        <div class="field"><span>Vira</span>${X.h.seg(p + '.destino', [['carrossel', 'Carrossel'], ['legenda', 'Legenda'], ['reel', 'Reel']])}</div>
        <button type="button" class="btn primary" data-a="x-kg-reap-gerar" ${desab(S)}>${ic('reciclar', 'sm')} Adaptar pro Instagram</button>
      </section>`;
      let saida;
      if (S.busy) saida = X.h.ocupado('Tirando a espinha do texto e refazendo o gancho. Leva de 15 segundos a 1 minuto.') + `<button type="button" class="btn sm" data-a="x-parar" data-t="reaproveitar">${ic('stop', 'sm')} Parar</button>`;
      else if (!S.res) saida = X.h.erro(S.err) + X.h.vazio('A adaptação aparece aqui.', 'Você recebe a ideia central, a transformação pro público do Instagram, 3 ganchos pra dobra, os pontos na ordem e o que tirar. Depois é um clique pro carrossel, a legenda ou o roteiro do Reel.');
      else saida = X.h.erro(S.err) + reapOut(S, S.res);
      return `<div class="kit">${entrada}<section class="kit-out kg-out">${saida}</section></div>`;
    }
  });
  function reapOut(S, r) {
    const esc0 = Math.min(Math.max(Number(S.escolhido) || 0, 0), r.ganchos.length - 1);
    const dn = { carrossel: 'Montar o carrossel', legenda: 'Escrever a legenda', reel: 'Levar pro Estúdio' }[r.destino];
    const di = { carrossel: 'carrossel', legenda: 'legenda', reel: 'estudio' }[r.destino];
    return `<div class="card kit-sec">
        <div class="kit-row"><h3 class="grow">Ideia central</h3><span class="tag mono">${esc(origemNome(S.resOrigem))} → ${esc(r.destino)}</span></div>
        <div class="decision"><b>${esc(r.ideiaCentral)}</b></div>
        ${r.transformacao ? `<div class="valor"><div class="vrow seg"><span class="k">Antes → depois pro seu público</span><p>${esc(r.transformacao)}</p></div></div>` : ''}
      </div>
      <div class="card kit-sec"><h3>Gancho pra dobra</h3><p class="kit-hint">Escolha um. Ele vai junto pro próximo passo.</p>
        <div class="kg-gs">${r.ganchos.map((g, i) => `<div class="kg-g ${i === esc0 ? 'on' : ''}"><span>${esc(g)}</span>${i === esc0 ? '<span class="tag amber">Escolhido</span>' : `<button type="button" class="btn xs" data-a="x-kg-reap-usar" data-i="${i}">Usar este</button>`}</div>`).join('')}</div>
      </div>
      <div class="card kit-sec"><h3>Pontos na ordem</h3><ol class="list">${r.pontos.map(x => `<li>${esc(x)}</li>`).join('')}</ol></div>
      ${r.remover.length ? `<div class="card kit-sec"><h3>Tirar</h3>${X.h.lista(r.remover, 'warnlist')}</div>` : ''}
      <div class="card kit-sec">${r.porqueDestino ? `<p style="margin:0">${esc(r.porqueDestino)}</p>` : ''}
        <div class="kit-row"><button type="button" class="btn primary" data-a="x-kg-reap-seguir">${ic(di, 'sm')} ${esc(dn)}</button>
        ${X.h.copiar(r.ganchos[esc0], 'Copiar gancho')}
        <button type="button" class="btn sm" data-a="x-kg-reap-salvar">${ic('check', 'sm')} Salvar</button></div>
      </div>`;
  }
  X.action('x-kg-reap-gerar', () => {
    const S = X.toolState('reaproveitar');
    const txt = X.str(S.texto);
    if (txt.length < 40) { S.err = 'Cole o texto original (pelo menos um parágrafo) pra adaptar.'; X.refresh(); return; }
    const de = origemNome(S.origem), pra = supNorm(S.destino, 'carrossel');
    const a = A();
    const fmts = pra === 'reel' && a ? X.formatosLista() : '';
    const prompt = [
      X.ctxPerfil({ semGravacao: pra !== 'reel' }),
      kb('reaproveitar'), blocoF(pra), pra === 'carrossel' ? kb('carrossel') : pra === 'legenda' ? kb('legenda') : '',
      `═══ TAREFA: REAPROVEITAR CONTEÚDO DE ${de.toUpperCase()} NO INSTAGRAM (${pra}) ═══
TEXTO ORIGINAL:
"""
${corta(txt, 8000)}
"""
Regras:
- Isto transforma, não inventa. Mantenha a ideia, os fatos e os números do original; não acrescente número, caso ou resultado. Se faltar algo, [PREENCHER: o quê].
- Tire a espinha: a afirmação, a história ou o número que vale manter. Corte a enrolação de ligação.
- Re-gancho: o gancho do original quase nunca serve. Escreva 3 ganchos novos que se sustentam sozinhos antes da dobra de 125 caracteres, com fórmulas diferentes.
- Tire os artefatos de outra plataforma e liste em "remover" com o porquê: @ do X, "link na bio" de lá, "comente abaixo" do LinkedIn, numeração de thread, hashtags erradas ou em parede, "se inscreva", referências a "thread", "newsletter", "artigo", "como escrevi no LinkedIn".
- Mantenha a voz do criador (DNA e tom acima).
- Pontos: de 3 a 8, na ordem em que entram no post, cada um uma ideia só, com o ganho na frente.
- Destino pedido: ${pra}. Se outro destino servir muito melhor, diga em "porqueDestino", mas mantenha "${pra}" no campo destino.
${pra === 'reel' ? `- Escolha o formato de Reel do app que mais serve (formatoReel = um destes ids):\n${fmts}` : '- formatoReel: deixe vazio.'}`
    ].filter(Boolean).join('\n\n') + fimJSON(`{"ideiaCentral": "1 frase", "transformacao": "antes → depois pro público do Instagram", "ganchos": ["gancho 1", "gancho 2", "gancho 3"], "pontos": ["ponto 1", "ponto 2", "ponto 3"], "remover": ["\\"link na bio\\" do LinkedIn: lá o link fica no post"], "destino": "${pra}", "porqueDestino": "1 frase", "formatoReel": "${pra === 'reel' ? 'lista' : ''}"}`);
    S.escolhido = 0; S.resOrigem = S.origem; S.resTexto = corta(txt, 3000);
    X.rodar(S, prompt, r => { const o = parseReap(r); if (o) o.destino = pra; return o; }, { tier: 'complex' });
  });
  X.action('x-kg-reap-usar', el => { const S = X.toolState('reaproveitar'); S.escolhido = Number(el.dataset.i) || 0; X.refresh(); });
  X.action('x-kg-reap-seguir', () => {
    const S = X.toolState('reaproveitar'); const r = S.res; if (!r) return;
    const g = r.ganchos[Math.min(Number(S.escolhido) || 0, r.ganchos.length - 1)];
    const de = origemNome(S.resOrigem);
    if (r.destino === 'carrossel') X.abrirFerramenta('carrossel', { tema: r.ideiaCentral, gancho: g, base: S.resTexto || '', origem: 'Reaproveitado de ' + de });
    else if (r.destino === 'legenda') X.abrirFerramenta('legenda', { assunto: r.ideiaCentral, gancho: g, base: r.pontos.join('\n'), tipo: 'imagem', origem: 'Reaproveitado de ' + de });
    else X.paraEstudio({ assunto: r.ideiaCentral + (r.transformacao ? ' — ' + r.transformacao : ''), gancho: g, formatoId: r.formatoReel, obs: 'Pontos do conteúdo original, na ordem:\n- ' + r.pontos.join('\n- '), why: `Reaproveitado de ${de}.` });
  });
  X.action('x-kg-reap-salvar', () => {
    const S = X.toolState('reaproveitar'); if (!S.res) return;
    X.salvar('pecas', { tipo: 'reaproveitar', titulo: X.str(S.res.ideiaCentral, 80) || 'Reaproveitado', form: { origem: S.resOrigem, destino: S.res.destino, escolhido: S.escolhido }, res: S.res });
    salvo('Adaptação salva.');
  });

  /* =====================================================================
     3) PERFIL 360
     ===================================================================== */
  X.tool({
    id: 'perfil', nome: 'Perfil 360', icone: 'perfil', ordem: 70,
    resumo: 'Audita foto, nome, bio, link, destaques, grid e fixados pra quem chega querer seguir.',
    init: () => ({ categoria: '', link: '', destaques: '', fixados: '', grid: '', foto: '', objetivo: 'seguidores' }),
    render(S) {
      const p = 'kit.tools.perfil';
      const pf = prof();
      const tem = [pf.nome, pf.nicho, pf.publico].filter(Boolean).length;
      const entrada = `<section class="card kit-in">
        <h2>Perfil 360</h2>
        <p class="lead">A decisão de seguir acontece no topo do perfil: em 3 segundos a pessoa precisa entender o que ganha seguindo. Aqui você vê o que trava isso e recebe o texto pronto.</p>
        ${tem < 2 ? `<div class="errnote warn">${ic('alert', 'sm')}<span>Preencha nome, nicho e público na tela Perfil: a auditoria fica muito melhor.</span></div>` : `<p class="kit-hint">Usando o Perfil: ${esc([pf.nome, pf.handle, pf.nicho].filter(Boolean).join(' · '))}${pf.bio ? ' · bio atual incluída' : ''}.</p>`}
        <div class="field"><span>Objetivo do perfil</span>${X.h.seg(p + '.objetivo', [['seguidores', 'Seguidores'], ['clientes', 'Clientes'], ['autoridade', 'Autoridade']])}</div>
        ${X.h.campo({ path: p + '.foto', label: 'Como é a foto', placeholder: 'Ex.: rosto de perto, fundo claro, sorrindo' })}
        ${X.h.campo({ path: p + '.categoria', label: 'Categoria', placeholder: 'Ex.: Advogado(a), Criador de conteúdo digital' })}
        ${X.h.campo({ path: p + '.link', label: 'Link da bio', placeholder: 'Ex.: link do WhatsApp, página de agenda' })}
        ${X.h.campo({ path: p + '.destaques', label: 'Destaques (um por linha)', tipo: 'textarea', rows: 3 })}
        ${X.h.campo({ path: p + '.fixados', label: 'Posts fixados', tipo: 'textarea', rows: 3, placeholder: 'Descreva os até 3 posts fixados' })}
        ${X.h.campo({ path: p + '.grid', label: 'Grid', tipo: 'textarea', rows: 4, placeholder: 'Descreva os 9 primeiros posts' })}
        <button type="button" class="btn primary" data-a="x-kg-perfil-gerar" ${desab(S)}>${ic('perfil', 'sm')} Auditar perfil</button>
      </section>`;
      let saida;
      if (S.busy) saida = X.h.ocupado('Auditando as 9 partes do perfil. Leva de 15 segundos a 1 minuto.') + `<button type="button" class="btn sm" data-a="x-parar" data-t="perfil">${ic('stop', 'sm')} Parar</button>`;
      else if (!S.res) saida = X.h.erro(S.err) + X.h.vazio('A auditoria do perfil aparece aqui.', 'Você recebe uma nota, o motivo pra seguir que o topo precisa passar, o diagnóstico de cada parte, campo Nome e bios prontas pra usar, destaques, fixados e as 3 primeiras ações.');
      else saida = X.h.erro(S.err) + perfilOut(S.res);
      return `<div class="kit">${entrada}<section class="kit-out kg-out">${saida}</section></div>`;
    }
  });
  function perfilOut(r) {
    const itens = r.itens.map(it => `<div class="kg-area"><div class="kg-ah"><b>${esc(it.area)}</b>${it.nota != null ? `<span class="tag mono">${it.nota}/10</span>` : ''}</div>
        ${it.nota != null ? `<div class="kg-bar ${barCls(it.nota, 10)}"><i style="width:${it.nota * 10}%"></i></div>` : ''}
        ${it.diagnostico ? `<p class="kg-diag">${esc(it.diagnostico)}</p>` : ''}${it.acao ? `<p class="kg-acao"><b>Fazer:</b> ${esc(it.acao)}</p>` : ''}</div>`).join('');
    const bios = r.bios.map((b, i) => `<div class="kg-bio"><pre>${esc(b.texto)}</pre>
        <div class="kit-row"><span class="tag mono ${b.bad ? 'bad' : 'good'}">${b.chars}/150</span>${b.bad ? '<small>Passa de 150: corte antes de usar.</small>' : ''}</div>
        ${b.porque ? `<small>${esc(b.porque)}</small>` : ''}
        <div class="kit-row">${X.h.copiar(b.texto, 'Copiar')}<button type="button" class="btn xs" data-a="x-kg-perfil-bio" data-i="${i}" ${b.bad ? 'disabled' : ''}>${ic('check', 'sm')} Usar no Perfil</button></div></div>`).join('');
    return `<div class="card kit-sec">
        <div class="kg-top"><span class="kit-score">${r.nota}<small>/100</small></span><div>${r.resumo ? `<p style="margin:0">${esc(r.resumo)}</p>` : ''}</div></div>
        ${r.porQueSeguir ? `<div class="decision"><span class="eyebrow">O topo precisa dizer</span><b>${esc(r.porQueSeguir)}</b></div>` : ''}
      </div>
      ${r.prioridades.length ? `<div class="card kit-sec"><h3>Faça primeiro</h3><ol class="list">${r.prioridades.map(x => `<li>${esc(x)}</li>`).join('')}</ol></div>` : ''}
      ${r.nome ? `<div class="card kit-sec"><h3>Campo Nome</h3><div class="kg-bio"><pre>${esc(r.nome)}</pre>
        <div class="kit-row"><span class="tag mono ${r.nomeBad ? 'bad' : 'good'}">${r.nomeChars}/64</span><small>É o campo que a busca do Instagram lê. Leva uma palavra que o seu público digita.</small></div>
        <div class="kit-row">${X.h.copiar(r.nome, 'Copiar')}<button type="button" class="btn xs" data-a="x-kg-perfil-nome" ${r.nomeBad ? 'disabled' : ''}>${ic('check', 'sm')} Usar no Perfil</button></div></div></div>` : ''}
      ${bios ? `<div class="card kit-sec"><h3>Bios</h3>${bios}</div>` : ''}
      ${itens ? `<div class="card kit-sec"><h3>Parte por parte</h3><div class="kg-areas">${itens}</div></div>` : ''}
      ${r.destaques.length ? `<div class="card kit-sec"><h3>Destaques</h3><div class="kg-dest">${r.destaques.map(d => `<div><b>${esc(d.nome)}</b>${d.longo ? '<span class="tag warn">nome longo</span> ' : ''}${esc(d.conteudo)}</div>`).join('')}</div></div>` : ''}
      ${r.fixados.length ? `<div class="card kit-sec"><h3>Fixados</h3><div class="kg-areas">${r.fixados.map(f => `<div class="kg-area"><b>${esc(f.post)}</b>${f.porque ? `<p class="kg-diag">${esc(f.porque)}</p>` : ''}</div>`).join('')}</div></div>` : ''}
      <div class="card kit-sec"><div class="kit-row"><button type="button" class="btn sm primary" data-a="x-kg-perfil-salvar">${ic('check', 'sm')} Salvar auditoria</button></div></div>`;
  }
  X.action('x-kg-perfil-gerar', () => {
    const S = X.toolState('perfil');
    const p = prof();
    const L = (k, v) => (X.str(v) ? `${k}: ${X.str(v, 1500)}` : `${k}: (não informado)`);
    const obj = { seguidores: 'ganhar seguidores', clientes: 'conseguir clientes', autoridade: 'construir autoridade' }[S.objetivo] || 'ganhar seguidores';
    const prompt = [
      X.ctxPerfil({ semGravacao: true }),
      kb('perfil'),
      `═══ TAREFA: AUDITORIA 360 DO PERFIL ═══
A decisão de seguir acontece no topo do perfil: em 3 segundos a pessoa precisa entender o que ganha seguindo. Teste do topo: lendo só foto, Nome, bio, link e a 1ª linha do grid, um estranho saberia pra quem é e ia querer seguir?
Objetivo do perfil: ${obj}.

O PERFIL HOJE:
${[L('Nome', p.nome), L('Apelido', p.apelido), L('@', p.handle), L('Campo Nome atual', p.nomeCampo), L('Nicho', p.nicho), L('Posicionamento', p.posicionamento), L('Público', p.publico), L('Promessa', p.promessa), L('Credencial real', p.credencial), L('Ofertas', p.ofertas), L('Bio atual', p.bio), L('Palavras proibidas', p.proibidos), L('Permitido', p.permitidos), L('Foto', S.foto), L('Categoria', S.categoria), L('Link da bio', S.link), L('Destaques', S.destaques), L('Fixados', S.fixados), L('Grid (9 primeiros posts)', S.grid)].join('\n')}

Avalie as 9 partes (foto, nome, handle, bio, link, categoria, destaques, grid, fixados) com nota 0–10. Parte "não informada": diga o que conferir e dê nota com cautela.
Regras:
- Campo Nome: nome real + a palavra que o público digita na busca, no máximo 64 caracteres (ideal até 30, pra não cortar).
- Bio: até 150 caracteres contando emojis e quebras de linha. Fórmula: o que quem segue ganha + do que você fala + uma prova real. Começa pelo ganho de quem lê, não pelo cargo. Sem "Ajudo X a Y" genérico, sem fileira de emoji, no máximo 1 emoji âncora. 3 opções diferentes.
- Nada de título, número ou prova que o criador não tem (use só a credencial real; se faltar, [PREENCHER: o quê]). Nada de promessa de resultado.${p.regulado ? ' Perfil de profissão regulada: respeite as regras do conselho, sem promessa e sem captação.' : ''}
- Link: um só, ligado ao objetivo.
- Destaques: 4 a 6, na ordem da próxima pergunta de quem chega (Comece aqui, Prova, Oferta, Dúvidas, Sobre), nome com até 15 caracteres.
- Fixados: até 3, cada um uma prova do que a pessoa vai ganhar seguindo (o que mais performou, a oferta, o "pra quem é").
- Grid: avaliado como conjunto (leitura rápida, visual consistente, mostra variedade).
- "porQueSeguir": a frase que o topo do perfil precisa comunicar.
- "prioridades": as 3 ações de maior impacto, em ordem.`
    ].filter(Boolean).join('\n\n') + fimJSON(`{"nota": 72, "resumo": "1–2 frases", "porQueSeguir": "a frase que o topo do perfil precisa comunicar", "itens": [{"area": "bio", "nota": 6, "diagnostico": "...", "acao": "o que fazer"}], "nome": "Ana Souza | Direito do Consumidor", "bios": [{"texto": "até 150 caracteres", "porque": "..."}], "destaques": [{"nome": "Comece aqui", "conteudo": "o que entra"}], "fixados": [{"post": "qual post fixar ou criar", "porque": "..."}], "prioridades": ["ação 1", "ação 2", "ação 3"]}`);
    X.rodar(S, prompt, parsePerfil, { tier: 'complex' });
  });
  const gravaPerfil = (campo, valor, msg) => {
    const a = A(); if (!a || !valor) return;
    a.st.profile[campo] = valor;
    try { a.Store.saveEstado(); } catch (e) { }
    a.toast(msg, 'good');
  };
  X.action('x-kg-perfil-bio', el => { const S = X.toolState('perfil'); const b = S.res && S.res.bios[Number(el.dataset.i) || 0]; if (b && !b.bad) gravaPerfil('bio', b.texto, 'Bio gravada no Perfil.'); });
  X.action('x-kg-perfil-nome', () => { const S = X.toolState('perfil'); if (S.res && S.res.nome && !S.res.nomeBad) gravaPerfil('nomeCampo', S.res.nome, 'Campo Nome gravado no Perfil.'); });
  X.action('x-kg-perfil-salvar', () => {
    const S = X.toolState('perfil'); if (!S.res) return;
    X.salvar('pecas', { tipo: 'perfil', titulo: `Perfil 360 · nota ${S.res.nota}`, form: { categoria: S.categoria, link: S.link, destaques: S.destaques, fixados: S.fixados, grid: S.grid, foto: S.foto, objetivo: S.objetivo }, res: S.res });
    salvo('Auditoria salva.');
  });

  /* =====================================================================
     4) TELA VIRAIS
     ===================================================================== */
  X.hook('viraisToolbar', () => `<button type="button" class="btn" data-a="x-kg-gancho">${ic('anzol', 'sm')} Extrair gancho de um viral</button>`);
  X.action('x-kg-gancho', () => X.abrirFerramenta('gancho', { origem: 'Virais' }));
  X.hook('viralExtra', v => {
    if (!v) return '';
    const An = v.analise;
    const sup = An && An.entrega && An.entrega.comoSuperar;
    const reel = An && An.modelagem ? `<button type="button" class="btn sm primary" data-a="modelar" data-i="-1">${ic('estudio', 'sm')} Roteiro de Reel</button>` : `<button type="button" class="btn sm primary" data-a="x-kg-viral-reel">${ic('estudio', 'sm')} Roteiro de Reel</button>`;
    return `<div class="blk kg-viral"><div class="blk-h"><h3>Recriar este viral</h3></div>
      <p>Modelar é copiar a estrutura e entregar mais valor no seu nicho.</p>
      ${sup ? `<p class="kg-sup"><b>Como superar:</b> ${esc(sup)}</p>` : ''}
      <div class="kit-row">${reel}
        <button type="button" class="btn sm" data-a="x-kg-viral-car">${ic('carrossel', 'sm')} Carrossel</button>
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
    X.paraEstudio({ assunto: X.str(v.titulo, 300) || corta(X.str(v.roteiro), 400), gancho: '', why: `Recriando o viral de ${v.handle || 'outro perfil'}: mesma estrutura, mais valor, no seu nicho.`, obs: v.roteiro ? 'Roteiro do viral de referência (modele a estrutura, não copie frases):\n' + corta(v.roteiro, 900) : '' });
  });
  X.action('x-kg-viral-car', () => {
    const v = viralModal(); if (!v) return;
    const mo = (v.analise && v.analise.modelagem) || {};
    X.abrirFerramenta('carrossel', { tema: mo.angulo || v.titulo || '', gancho: typeof mo.gancho === 'string' ? mo.gancho : '', base: baseViral(v), objetivo: objViral(v), origem: 'Viral ' + (v.handle || '') });
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
