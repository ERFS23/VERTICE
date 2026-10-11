/* Narrador de Impacto — Kit Instagram: conteúdo (carrossel, legenda, hashtags, humanizar)
   Adapta as skills ig-carousel-planner, ig-caption-writer, ig-hashtag-strategist e ig-humanizer.
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
.kc-slides{display:grid; grid-template-columns:repeat(auto-fill, minmax(170px, 1fr)); gap:12px}
.kc-slide{aspect-ratio:4/5; max-width:100%; min-width:0; border:1px solid var(--line); background:var(--bg2); border-radius:14px; padding:14px; display:flex; flex-direction:column; gap:8px; overflow:hidden}
.kc-slide .eyebrow{font-size:10px}
.kc-slide .kc-st{margin:0; font-family:var(--f-disp); font-weight:800; font-size:19px; line-height:1.05; text-transform:uppercase; letter-spacing:.02em; overflow-wrap:anywhere}
.kc-slide .kc-sx{margin:0; font-size:13px; line-height:1.4; color:var(--ink2); overflow-wrap:anywhere; flex:1; overflow:auto}
.kc-slide .kc-sv{margin:0; font-size:11.5px; line-height:1.35; overflow-wrap:anywhere}
.kc-slide.gancho{border-color:var(--amber-line); background:var(--amber-soft)}
.kc-slide.cta{border-color:var(--line2)}
.kc-alt{display:grid; grid-template-columns:minmax(0,1fr) auto; gap:10px; align-items:center; border:1px solid var(--line); border-radius:12px; padding:10px 12px; background:var(--bg2)}
.kc-alt span{min-width:0; overflow-wrap:anywhere; font-size:14px}
.kc-faixa{display:flex; flex-direction:column; gap:8px; min-width:0}
.kc-tag{display:grid; grid-template-columns:minmax(0,1fr); gap:2px; border:1px solid var(--line); border-radius:12px; padding:10px 12px; background:var(--bg2); min-width:0}
.kc-tag b{font-family:var(--f-mono); font-size:14px; overflow-wrap:anywhere}
.kc-tag small{color:var(--ink3); font-size:12.5px}
.kc-notas{display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:10px}
.kc-notas > div{border:1px solid var(--line); border-radius:12px; padding:12px 14px; background:var(--bg2); min-width:0}
.kc-mud{display:flex; flex-direction:column; gap:8px}
.kc-mud .it{border:1px solid var(--line); border-radius:12px; padding:10px 12px; font-size:13.5px; line-height:1.45; min-width:0; overflow-wrap:anywhere}
.kc-mud del{color:var(--bad)} .kc-mud ins{color:var(--good); text-decoration:none}
.kc-details summary{cursor:pointer; font-size:13.5px; color:var(--ink2)}
.kc-details[open] summary{margin-bottom:8px}
@media (max-width: 520px){ .kc-notas{grid-template-columns:minmax(0,1fr)} .kc-slides{grid-template-columns:minmax(0,1fr)} }
`);

  /* ---------- auxiliares ---------- */
  const OBJ_PAD = [['salvamentos', 'Salvamentos'], ['compartilhamentos', 'Compartilhamentos'], ['comentarios', 'Comentários'], ['seguidores', 'Seguidores']];
  const objOpcoes = () => OBJ_PAD.map(([id, nome]) => [id, ((K().objetivos || {})[id] || {}).nome || nome]);
  const objTexto = id => {
    const o = (K().objetivos || {})[id];
    if (!o) return `Objetivo principal: ${id || 'salvamentos'}.`;
    return `═══ OBJETIVO PRINCIPAL: ${o.nome || id} ═══\n${o.comoGanha || ''}${(o.formulas || []).length ? `\nFórmulas que mais servem a este objetivo: ${o.formulas.join(', ')}` : ''}`;
  };
  const OBJ_IDS = OBJ_PAD.map(o => o[0]);
  const objOk = v => (OBJ_IDS.includes(v) ? v : 'salvamentos');
  const FORM_IDS = ['numero', 'contraria', 'cena', 'confissao', 'lista', 'antesdepois', 'mito', 'framework', 'quebra', 'comoeu'];
  const FORM_PAD = { auto: 'Automática', lista: 'Lista', antesdepois: 'Antes e depois', mito: 'Mito × verdade', framework: 'Framework' };
  const formNome = id => {
    if (id === 'auto') return 'Automática';
    const f = typeof K().formula === 'function' ? K().formula(id) : null;
    return (f && f.nome) || FORM_PAD[id] || id;
  };
  const blocoF = sup => (typeof K().blocoFormulas === 'function' ? K().blocoFormulas(sup) : '');
  const kb = nome => (typeof K()[nome] === 'string' ? K()[nome] : '');
  const prof = () => (A() && A().st.profile) || {};
  const assinatura = p => String((p && (p.assinatura || p.handle)) || '').trim();
  const legRegra = p => { const E = A() && A().E; try { return E && E.legendaRegra ? E.legendaRegra(p) : ''; } catch (e) { return ''; } };
  const desab = S => (S.busy || !A() || A().ui.ai !== 'on' ? 'disabled' : '');
  const origemTag = S => (S.origem ? `<div><span class="tag amber">Veio de: ${esc(S.origem)}</span></div>` : '');
  const ocupado = (msg, id) => `<div class="thinking" style="padding:18px 2px"><div class="scan"></div><div class="tip">${esc(msg)}</div><button type="button" class="btn sm" data-a="x-parar" data-t="${esc(id)}">${ic('stop', 'sm')} Parar</button></div>`;
  const dotList = itens => `<div class="kit-audit">${itens.map(i => `<div class="it"><span class="dot ${esc(i.nivel)}"></span><div>${esc(i.txt)}${i.dica ? `<small>${esc(i.dica)}</small>` : ''}</div></div>`).join('')}</div>`;
  const fimJSON = ex => `\n\nResponda só com JSON, sem texto antes ou depois, exatamente neste formato:\n${ex}`;
  const salvo = msg => { const a = A(); if (a) a.toast(msg || 'Salvo no Kit.', 'good'); };

  /* ---------- normalização de hashtags ---------- */
  const normTag = t => {
    const s = String(t == null ? '' : t).toLowerCase().replace(/[^\p{L}\p{N}_]/gu, '');
    return s ? '#' + s : '';
  };
  const FAIXAS = ['nicho', 'medio', 'amplo'];
  const normFaixa = f => { const s = String(f || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); return FAIXAS.find(x => s.includes(x)) || (s.includes('broad') ? 'amplo' : s.includes('mid') ? 'medio' : 'nicho'); };
  const tagsUnicas = (arr, n, visto) => {
    const out = []; visto = visto || new Set();
    (Array.isArray(arr) ? arr : []).forEach(x => {
      const o = typeof x === 'string' ? { tag: x } : (x || {});
      const tag = normTag(o.tag);
      if (!tag || visto.has(tag) || out.length >= n) return;
      visto.add(tag);
      out.push({ tag, faixa: normFaixa(o.faixa), estimativa: X.str(o.estimativa, 60), porque: X.str(o.porque, 200) });
    });
    return out;
  };

  /* ---------- troca da linha do gancho na legenda ---------- */
  // troca a primeira linha não vazia depois da assinatura (se a 1ª linha for a assinatura)
  const trocarGancho = (legenda, nova, sig) => {
    const L = String(legenda || '').split('\n');
    sig = String(sig || '').trim();
    let i = L.findIndex(l => l.trim());
    if (i < 0) return String(nova || '');
    if (sig && L[i].trim().toLowerCase().startsWith(sig.toLowerCase())) {
      const j = L.findIndex((l, k) => k > i && l.trim());
      if (j < 0) { L.splice(i + 1, 0, '', String(nova || '')); return L.join('\n'); }
      i = j;
    }
    L[i] = String(nova || '').trim();
    return L.join('\n');
  };

  /* ---------- parsers ---------- */
  const PAPEIS = ['gancho', 'valor', 'resumo', 'cta'];
  const parseCarrossel = r => {
    if (!r || typeof r !== 'object') return null;
    const slides = X.arr(r.slides, 10, (s, i) => {
      if (!s || typeof s !== 'object') return null;
      const titulo = X.str(s.titulo, 140), texto = X.str(s.texto, 400);
      if (!titulo && !texto) return null;
      const papel = PAPEIS.includes(String(s.papel || '').toLowerCase()) ? String(s.papel).toLowerCase() : 'valor';
      return { n: 0, papel, titulo, texto, visual: X.str(s.visual, 240) };
    });
    if (slides.length < 3) return null;
    slides.forEach((s, i) => { s.n = i + 1; });
    const v = r.valor && typeof r.valor === 'object' ? r.valor : {};
    const visto = new Set();
    const hashtags = X.arr(r.hashtags, 12, normTag).filter(t => !visto.has(t) && visto.add(t)).slice(0, 5);
    return {
      formula: FORM_IDS.includes(r.formula) ? r.formula : X.str(r.formula, 30),
      objetivo: X.str(r.objetivo, 40), porque: X.str(r.porque, 300),
      valor: { antesDepois: X.str(v.antesDepois, 300), levaPronto: X.str(v.levaPronto, 300), porQueSeguir: X.str(v.porQueSeguir, 300) },
      slides, legenda: X.str(r.legenda, 2200), hashtags, conferir: X.arr(r.conferir, 8, y => X.str(y, 240))
    };
  };
  const parseLegenda = r => {
    if (!r || typeof r !== 'object') return null;
    const legenda = X.str(r.legenda, 2200);
    if (!legenda) return null;
    return {
      legenda, formula: X.str(r.formula, 30),
      primeiras: X.arr(r.primeiras, 3, y => X.str(y, 200)),
      cta: X.str(r.cta, 200), porque: X.str(r.porque, 300), conferir: X.arr(r.conferir, 8, y => X.str(y, 240))
    };
  };
  const parseHashtags = r => {
    if (!r || typeof r !== 'object') return null;
    const visto = new Set();
    const conjunto = tagsUnicas(r.conjunto, 5, visto);
    if (!conjunto.length) return null;
    const reserva = tagsUnicas(r.reserva, 5, visto);
    const evitar = X.arr(r.evitar, 6, x => { const o = typeof x === 'string' ? { tag: x } : (x || {}); const tag = normTag(o.tag); return tag ? { tag, porque: X.str(o.porque, 200) } : null; });
    return { conjunto, reserva, evitar, comoConferir: X.str(r.comoConferir, 300) };
  };
  const parseHumanizar = r => {
    if (!r || typeof r !== 'object') return null;
    const texto = X.str(r.texto, 6000);
    if (!texto) return null;
    const mudancas = X.arr(r.mudancas, 20, m => { if (!m || typeof m !== 'object') return null; const antes = X.str(m.antes, 300), depois = X.str(m.depois, 300); return antes || depois ? { antes, depois, porque: X.str(m.porque, 200) } : null; });
    return { texto, mudancas };
  };
  X.kc = { parseCarrossel, parseLegenda, parseHashtags, parseHumanizar, trocarGancho, normTag };

  /* =====================================================================
     1) CARROSSEL
     ===================================================================== */
  X.tool({
    id: 'carrossel', nome: 'Carrossel', icone: 'carrossel', ordem: 20,
    resumo: 'Roteiro slide a slide que prende no 1º slide e ganha o salvamento no último.',
    init: () => ({ tema: '', objetivo: 'salvamentos', formula: 'auto', slides: 7, gancho: '', base: '', origem: '' }),
    render(S) {
      const p = 'kit.tools.carrossel';
      const slidesOp = [5, 6, 7, 8, 9, 10].map(n => [String(n), n + ' slides']);
      const entrada = `<section class="card kit-in">
        <h2>Carrossel</h2>
        <p class="lead">Do tema ao roteiro de cada slide: o 1º promete e prende, o 2º e o 3º entregam o melhor, o penúltimo vira o resumo que a pessoa salva e o último dá o motivo pra seguir.</p>
        ${origemTag(S)}
        ${X.h.campo({ path: p + '.tema', label: 'Tema ou ideia', tipo: 'textarea', rows: 3, placeholder: 'Ex.: 5 erros que fazem o pequeno negócio pagar imposto a mais' })}
        <div class="field"><span>Objetivo</span>${X.h.seg(p + '.objetivo', objOpcoes())}</div>
        <div class="field"><span>Fórmula</span>${X.h.seg(p + '.formula', ['auto', 'lista', 'antesdepois', 'mito', 'framework'].map(id => [id, formNome(id)]))}</div>
        ${X.h.campo({ path: p + '.slides', label: 'Quantidade de slides', tipo: 'select', opcoes: slidesOp, value: String(S.slides || 7), help: 'Só o que o conteúdo pede. Encher slide pra chegar em 10 faz a pessoa desistir.' })}
        ${X.h.campo({ path: p + '.gancho', label: 'Ideia de gancho (opcional)', placeholder: 'Em branco: a IA escolhe pela fórmula' })}
        <details class="kc-details" ${S.base ? 'open' : ''}><summary>Recriar a partir de um texto</summary>
          ${X.h.campo({ path: p + '.base', label: 'Texto de referência', tipo: 'textarea', rows: 5, placeholder: 'Cole um viral, um roteiro seu ou um post de outra rede. A IA modela a estrutura, sem copiar frases.' })}
        </details>
        <button type="button" class="btn primary" data-a="x-kc-car-gerar" ${desab(S)}>${ic('carrossel', 'sm')} Gerar carrossel</button>
        <p class="kit-hint">Dica: "Copiar slides" serve pra colar no CarrosseIA, que desenha a arte a partir do roteiro.</p>
      </section>`;
      let saida;
      if (S.busy) saida = ocupado('Montando os slides e a legenda. Leva de 20 segundos a 1 minuto.', 'carrossel');
      else if (!S.res) saida = X.h.erro(S.err) + X.h.vazio('O roteiro do carrossel aparece aqui.', 'Você recebe cada slide com título, texto e sugestão visual, o valor que ele entrega, a legenda pronta com a dobra marcada e 3 a 5 hashtags.');
      else saida = X.h.erro(S.err) + carrosselOut(S.res);
      return `<div class="kit">${entrada}<section class="kit-out">${saida}</section></div>`;
    }
  });
  const slidesTxt = r => r.slides.map(s => `Slide ${s.n} — ${s.titulo}\n${s.texto}${s.visual ? `\n[visual: ${s.visual}]` : ''}`).join('\n\n');
  function carrosselOut(r) {
    const v = r.valor;
    const valor = [['Antes → depois', v.antesDepois], ['Leva pronto', v.levaPronto]].filter(x => x[1]).map(([k, t]) => `<div class="vrow"><span class="k">${k}</span><p>${esc(t)}</p></div>`).join('')
      + (v.porQueSeguir ? `<div class="vrow seg"><span class="k">Por que seguir faz sentido</span><p>${esc(v.porQueSeguir)}</p></div>` : '');
    const PN = { gancho: 'Gancho', valor: 'Valor', resumo: 'Resumo salvável', cta: 'Chamada' };
    const slides = r.slides.map(s => `<div class="kc-slide ${esc(s.papel)}"><div class="eyebrow">${s.n} · ${esc(PN[s.papel] || s.papel)}</div><p class="kc-st">${esc(s.titulo)}</p><p class="kc-sx">${esc(s.texto)}</p>${s.visual ? `<p class="kc-sv faint">${esc(s.visual)}</p>` : ''}</div>`).join('');
    const aud = r.legenda ? X.auditar(r.legenda).itens.filter(i => i.nivel !== 'good') : [];
    return `<div class="card kit-sec">
        <div class="kit-row"><h3 class="grow">Carrossel · ${r.slides.length} slides</h3>${r.formula ? `<span class="tag">${esc(formNome(r.formula))}</span>` : ''}${r.objetivo ? `<span class="tag mono">${esc(r.objetivo)}</span>` : ''}</div>
        ${r.porque ? `<p class="kit-hint">${esc(r.porque)}</p>` : ''}
        ${valor ? `<div class="valor">${valor}</div>` : ''}
      </div>
      <div class="card kit-sec"><div class="kc-slides">${slides}</div>
        <div class="kit-row"><button type="button" class="btn sm" data-a="copiar-txt" data-txt="${esc(slidesTxt(r))}">${ic('copy', 'sm')} Copiar slides</button>
        <button type="button" class="btn sm primary" data-a="x-kc-car-salvar">${ic('check', 'sm')} Salvar</button></div>
      </div>
      ${r.legenda ? `<div class="card kit-sec"><h3>Legenda</h3>${X.h.dobra(r.legenda)}${X.h.contagem(r.legenda)}
        ${aud.length ? dotList(aud) : '<p class="kit-hint">A auditoria local não achou problema na legenda.</p>'}
        ${r.hashtags.length ? `<div class="rates">${r.hashtags.map(t => `<span class="tag mono">${esc(t)}</span>`).join('')}</div>` : ''}
        <div class="kit-row"><button type="button" class="btn sm" data-a="copiar-txt" data-txt="${esc(r.legenda)}">${ic('copy', 'sm')} Copiar legenda</button>
        <button type="button" class="btn sm ghost" data-a="x-kc-car-humanizar">${ic('humano', 'sm')} Humanizar legenda</button>
        <button type="button" class="btn sm ghost" data-a="x-kc-car-hashtags">${ic('hashtag', 'sm')} Hashtags</button></div>
      </div>` : ''}
      ${r.conferir.length ? `<div class="card kit-sec"><h3>Conferir antes de postar</h3>${X.h.lista(r.conferir, 'warnlist')}</div>` : ''}`;
  }
  X.action('x-kc-car-gerar', () => {
    const S = X.toolState('carrossel');
    if (!X.str(S.tema) && !X.str(S.base)) { S.err = 'Escreva o tema do carrossel ou cole um texto de referência.'; X.refresh(); return; }
    const p = prof();
    const n = X.num(S.slides, 5, 10) || 7;
    const formula = S.formula && S.formula !== 'auto' ? `Use a fórmula "${S.formula}" (${formNome(S.formula)}).` : 'Escolha a fórmula de carrossel que mais serve ao objetivo (lista, antesdepois, mito ou framework) e diga qual.';
    const prompt = [
      X.ctxPerfil(),
      kb('carrossel'), blocoF('carrossel'), objTexto(objOk(S.objetivo)), legRegra(p), kb('legenda'),
      `═══ TAREFA: ROTEIRO DE CARROSSEL ═══
Tema: ${X.str(S.tema, 1500) || '(tire do texto de referência)'}
${formula}
Quantidade: ${n} slides (pode usar menos se o conteúdo não render ${n}; nunca encha linguiça).
${X.str(S.gancho) ? `Ideia de gancho do criador (respeite a intenção): ${X.str(S.gancho, 300)}` : ''}
${X.str(S.base) ? `TEXTO DE REFERÊNCIA${S.origem ? ` (${S.origem})` : ''}: MODELE a estrutura, o ritmo e o tipo de promessa, sem copiar nenhuma frase. Adapte ao nicho e à verdade deste perfil.\n"""\n${X.str(S.base, 8000)}\n"""` : ''}
Regras:
- Slide 1 promete um ganho concreto e abre um loop (algo que só se resolve passando). Nunca só um título.
- Valor na frente: o ponto mais forte fica no slide 2 ou 3.
- Uma ideia por slide, legível em 2 segundos numa tela 4:5. Título com no máximo 8 palavras; texto com no máximo 35 palavras.
- Penúltimo slide = resumo salvável (a pessoa salva só por ele).
- Último slide = UM CTA só, ligado ao motivo concreto pra seguir o perfil (o que ela ganha nos próximos posts). Nada de "salva, compartilha e segue".
- Cada slide traz uma sugestão visual ou de prova (print, exemplo, número com fonte, foto sua).
- Nada inventado: número, caso ou resultado que faltar vira [PREENCHER: o quê]; fato técnico duvidoso vira [CONFERIR: o quê] e entra em "conferir".
- Sem travessão nos slides; palavras do dia a dia, sem cara de IA.
- A legenda segue a estrutura do perfil, complementa os slides, tem o gancho inteiro antes dos 125 caracteres (contando a assinatura), um CTA e 3 a 5 hashtags no fim.`
    ].filter(Boolean).join('\n\n') + fimJSON(`{"formula": "lista", "objetivo": "salvamentos", "porque": "1 frase sobre por que essa fórmula", "valor": {"antesDepois": "de onde a pessoa sai e onde chega", "levaPronto": "o que ela aplica hoje", "porQueSeguir": "por que seguir o perfil faz sentido depois disso"}, "slides": [{"n": 1, "papel": "gancho", "titulo": "...", "texto": "...", "visual": "..."}, {"n": 2, "papel": "valor", "titulo": "...", "texto": "...", "visual": "..."}, {"n": ${n - 1}, "papel": "resumo", "titulo": "...", "texto": "...", "visual": "..."}, {"n": ${n}, "papel": "cta", "titulo": "...", "texto": "...", "visual": "..."}], "legenda": "legenda pronta", "hashtags": ["#exemplo"], "conferir": ["[CONFERIR] ..."]}`);
    X.rodar(S, prompt, parseCarrossel, { tier: 'complex' });
  });
  X.action('x-kc-car-salvar', () => {
    const S = X.toolState('carrossel'); if (!S.res) return;
    X.salvar('pecas', { tipo: 'carrossel', titulo: (S.res.slides[0] || {}).titulo || X.str(S.tema, 80) || 'Carrossel', form: { tema: S.tema, objetivo: S.objetivo, formula: S.formula, slides: S.slides, gancho: S.gancho, origem: S.origem }, res: S.res });
    salvo('Carrossel salvo.');
  });
  X.action('x-kc-car-humanizar', () => { const S = X.toolState('carrossel'); if (S.res) X.abrirFerramenta('humanizar', { texto: S.res.legenda, tipo: 'legenda', origem: 'Carrossel' }); });
  X.action('x-kc-car-hashtags', () => { const S = X.toolState('carrossel'); if (S.res) X.abrirFerramenta('hashtags', { assunto: S.tema, base: S.res.legenda, origem: 'Carrossel' }); });

  /* =====================================================================
     2) LEGENDA
     ===================================================================== */
  X.tool({
    id: 'legenda', nome: 'Legenda', icone: 'legenda', ordem: 30,
    resumo: 'Gancho inteiro antes do "mais", corpo que complementa o post e um CTA.',
    init: () => ({ assunto: '', tipo: 'reel', objetivo: 'seguidores', gancho: '', base: '', origem: '' }),
    render(S) {
      const p = 'kit.tools.legenda';
      const entrada = `<section class="card kit-in">
        <h2>Legenda</h2>
        <p class="lead">O gancho cabe inteiro antes do "mais", o corpo traz o que não coube no post e fecha com um único pedido.</p>
        ${origemTag(S)}
        ${X.h.campo({ path: p + '.assunto', label: 'Assunto do post', tipo: 'textarea', rows: 2, placeholder: 'Ex.: o erro de contrato que mais faz o MEI perder dinheiro' })}
        <div class="field"><span>Tipo de post</span>${X.h.seg(p + '.tipo', [['reel', 'Reel'], ['imagem', 'Imagem'], ['carrossel', 'Carrossel']])}</div>
        <div class="field"><span>Objetivo</span>${X.h.seg(p + '.objetivo', objOpcoes())}</div>
        ${X.h.campo({ path: p + '.gancho', label: 'Ideia de gancho (opcional)', placeholder: 'Em branco: a IA escolhe a fórmula' })}
        ${X.h.campo({ path: p + '.base', label: 'Roteiro ou texto dos slides (opcional)', tipo: 'textarea', rows: 5, placeholder: 'Cole o roteiro do Reel ou o texto dos slides. A legenda complementa, não repete.' })}
        <button type="button" class="btn primary" data-a="x-kc-leg-gerar" ${desab(S)}>${ic('legenda', 'sm')} Gerar legenda</button>
      </section>`;
      let saida;
      if (S.busy) saida = ocupado('Escrevendo a legenda. Leva de 10 a 40 segundos.', 'legenda');
      else if (!S.res) saida = X.h.erro(S.err) + X.h.vazio('A legenda pronta aparece aqui.', 'Com a dobra dos 125 caracteres marcada, a auditoria sem IA, 3 versões alternativas da primeira linha e o CTA único.');
      else saida = X.h.erro(S.err) + legendaOut(S.res);
      return `<div class="kit">${entrada}<section class="kit-out">${saida}</section></div>`;
    }
  });
  function legendaOut(r) {
    const a = X.auditar(r.legenda);
    return `<div class="card kit-sec">
        <div class="kit-row"><h3 class="grow">Legenda</h3>${r.formula ? `<span class="tag">${esc(formNome(r.formula))}</span>` : ''}<span class="kit-score">${a.nota}<small>/100</small></span></div>
        ${r.porque ? `<p class="kit-hint">${esc(r.porque)}</p>` : ''}
        ${X.h.dobra(r.legenda)}${X.h.contagem(r.legenda)}
        ${r.cta ? `<p class="kit-hint">CTA: ${esc(r.cta)}</p>` : ''}
        <div class="kit-row"><button type="button" class="btn sm" data-a="copiar-txt" data-txt="${esc(r.legenda)}">${ic('copy', 'sm')} Copiar legenda</button>
          <button type="button" class="btn sm primary" data-a="x-kc-leg-salvar">${ic('check', 'sm')} Salvar</button>
          <button type="button" class="btn sm ghost" data-a="x-kc-leg-humanizar">${ic('humano', 'sm')} Humanizar</button>
          <button type="button" class="btn sm ghost" data-a="x-kc-leg-hashtags">${ic('hashtag', 'sm')} Hashtags</button></div>
      </div>
      <div class="card kit-sec"><h3>Auditoria sem IA</h3>${dotList(a.itens)}</div>
      ${r.primeiras.length ? `<div class="card kit-sec"><h3>Outras primeiras linhas</h3><p class="kit-hint">Troca só a linha do gancho (a primeira depois da assinatura).</p>
        ${r.primeiras.map((t, i) => `<div class="kc-alt"><span>${esc(t)}</span><button type="button" class="btn xs" data-a="x-kc-leg-usar" data-i="${i}">Usar esta</button></div>`).join('')}</div>` : ''}
      ${r.conferir.length ? `<div class="card kit-sec"><h3>Conferir antes de postar</h3>${X.h.lista(r.conferir, 'warnlist')}</div>` : ''}`;
  }
  X.action('x-kc-leg-gerar', () => {
    const S = X.toolState('legenda');
    if (!X.str(S.assunto) && !X.str(S.base)) { S.err = 'Escreva o assunto do post ou cole o roteiro.'; X.refresh(); return; }
    const p = prof();
    const sig = assinatura(p);
    const tipoNome = { reel: 'Reel', imagem: 'post de imagem única', carrossel: 'carrossel' }[S.tipo] || 'Reel';
    const prompt = [
      X.ctxPerfil(),
      kb('legenda'), legRegra(p), blocoF('legenda'), kb('sinais').slice(0, 2500), objTexto(objOk(S.objetivo)),
      `═══ TAREFA: LEGENDA DE ${tipoNome.toUpperCase()} ═══
Assunto: ${X.str(S.assunto, 1200) || '(tire do texto do post)'}
${X.str(S.gancho) ? `Ideia de gancho do criador (respeite a intenção): ${X.str(S.gancho, 300)}` : ''}
${X.str(S.base) ? `Texto do post (a legenda COMPLEMENTA, não resume nem repete):\n"""\n${X.str(S.base, 8000)}\n"""` : ''}
Regras:
- ${sig ? `A primeira linha é a assinatura "${sig}". ` : ''}O gancho inteiro cabe nos primeiros 125 caracteres, contando a assinatura e as quebras de linha.
- Corpo escaneável, frases curtas, traz o que não coube no post (detalhe, exemplo, passo extra).
- Um CTA só, sem isca de engajamento. Pergunta aberta específica pra puxar comentário de verdade.
- 3 a 5 hashtags específicas no fim, em minúsculas. De 0 a 3 emojis, com intenção.
- ${p.regulado ? `Conteúdo regulado: inclua o disclaimer "${p.disclaimer || ''}".` : 'Disclaimer só se tocar em direito, tributo, saúde ou finanças.'}
- Nada inventado: o que faltar vira [PREENCHER: o quê]; fato técnico duvidoso vira [CONFERIR: o quê] e entra em "conferir".
- "primeiras" = 3 versões alternativas SÓ da linha do gancho (sem a assinatura), cada uma com fórmula diferente.`
    ].filter(Boolean).join('\n\n') + fimJSON(`{"legenda": "${sig ? sig.replace(/"/g, '') + '\\n\\n' : ''}linha do gancho\\n\\ncorpo...", "formula": "numero", "primeiras": ["versão 1", "versão 2", "versão 3"], "cta": "o CTA usado", "porque": "1 frase", "conferir": []}`);
    X.rodar(S, prompt, parseLegenda, { tier: 'default' });
  });
  X.action('x-kc-leg-usar', el => {
    const S = X.toolState('legenda'); if (!S.res) return;
    const nova = S.res.primeiras[Number(el.dataset.i)]; if (!nova) return;
    S.res.legenda = trocarGancho(S.res.legenda, nova, assinatura(prof()));
    X.refresh();
  });
  X.action('x-kc-leg-salvar', () => {
    const S = X.toolState('legenda'); if (!S.res) return;
    X.salvar('pecas', { tipo: 'legenda', titulo: X.str(S.assunto, 80) || 'Legenda', form: { assunto: S.assunto, tipo: S.tipo, objetivo: S.objetivo, gancho: S.gancho, origem: S.origem }, res: S.res });
    salvo('Legenda salva.');
  });
  X.action('x-kc-leg-humanizar', () => { const S = X.toolState('legenda'); if (S.res) X.abrirFerramenta('humanizar', { texto: S.res.legenda, tipo: 'legenda', origem: 'Legenda' }); });
  X.action('x-kc-leg-hashtags', () => { const S = X.toolState('legenda'); if (S.res) X.abrirFerramenta('hashtags', { assunto: S.assunto, base: S.res.legenda, origem: 'Legenda' }); });

  /* =====================================================================
     3) HASHTAGS
     ===================================================================== */
  X.tool({
    id: 'hashtags', nome: 'Hashtags', icone: 'hashtag', ordem: 40,
    resumo: '3 a 5 hashtags no tamanho em que o seu perfil consegue aparecer.',
    init: () => ({ assunto: '', base: '', origem: '' }),
    render(S) {
      const p = 'kit.tools.hashtags';
      const entrada = `<section class="card kit-in">
        <h2>Hashtags</h2>
        <p class="lead">Em 2026, 3 a 5 hashtags certas valem mais que 30 genéricas. Perfil pequeno aparece nas de nicho; as amplas só dão um rótulo.</p>
        ${origemTag(S)}
        ${X.h.campo({ path: p + '.assunto', label: 'Assunto do post', placeholder: 'Ex.: como separar conta PJ e PF' })}
        ${X.h.campo({ path: p + '.base', label: 'Legenda ou roteiro (opcional)', tipo: 'textarea', rows: 5, placeholder: 'Colar ajuda a IA a escolher hashtags que descrevem o post de verdade.' })}
        <button type="button" class="btn primary" data-a="x-kc-hash-gerar" ${desab(S)}>${ic('hashtag', 'sm')} Escolher hashtags</button>
      </section>`;
      let saida;
      if (S.busy) saida = ocupado('Escolhendo e medindo as hashtags. Leva de 10 a 30 segundos.', 'hashtags');
      else if (!S.res) saida = X.h.erro(S.err) + X.h.vazio('O conjunto de hashtags aparece aqui.', 'De 3 a 5 tags separadas por tamanho (nicho, médio, amplo), uma reserva pra variar entre posts e as que é melhor evitar.');
      else saida = X.h.erro(S.err) + hashtagsOut(S.res);
      return `<div class="kit">${entrada}<section class="kit-out">${saida}</section></div>`;
    }
  });
  const FN = { nicho: 'Nicho (até 50 mil posts)', medio: 'Médio (50 mil a 500 mil)', amplo: 'Amplo (mais de 500 mil)' };
  const tagCard = t => `<div class="kc-tag"><b>${esc(t.tag)}</b>${t.estimativa ? `<small>${esc(t.estimativa)}</small>` : ''}${t.porque ? `<small>${esc(t.porque)}</small>` : ''}</div>`;
  function hashtagsOut(r) {
    const grupos = FAIXAS.map(f => { const ts = r.conjunto.filter(t => t.faixa === f); return ts.length ? `<div class="kc-faixa"><div class="eyebrow">${esc(FN[f])}</div>${ts.map(tagCard).join('')}</div>` : ''; }).join('');
    const linha = r.conjunto.map(t => t.tag).join(' ');
    return `<div class="card kit-sec">
        <div class="kit-row"><h3 class="grow">Conjunto · ${r.conjunto.length}</h3></div>
        <pre class="kit-pre">${esc(linha)}</pre>
        ${grupos}
        <div class="errnote warn">${ic('alert', 'sm')}<span>O app não acessa o Instagram: os tamanhos são estimativas. Confira na busca antes de usar.${r.comoConferir ? ' ' + esc(r.comoConferir) : ''}</span></div>
        <div class="kit-row"><button type="button" class="btn sm" data-a="copiar-txt" data-txt="${esc(linha)}">${ic('copy', 'sm')} Copiar conjunto</button>
          ${r.reserva.length ? `<button type="button" class="btn sm" data-a="copiar-txt" data-txt="${esc(r.reserva.map(t => t.tag).join(' '))}">${ic('copy', 'sm')} Copiar reserva</button>` : ''}
          <button type="button" class="btn sm primary" data-a="x-kc-hash-salvar">${ic('check', 'sm')} Salvar</button></div>
      </div>
      ${r.reserva.length ? `<div class="card kit-sec"><h3>Reserva pra variar</h3><p class="kit-hint">Troque 1 ou 2 de nicho a cada post: o mesmo bloco em todo post parece automação.</p>${r.reserva.map(tagCard).join('')}</div>` : ''}
      ${r.evitar.length ? `<div class="card kit-sec"><h3>Evite</h3><div class="kit-audit">${r.evitar.map(t => `<div class="it"><span class="dot bad"></span><div>${esc(t.tag)}${t.porque ? `<small>${esc(t.porque)}</small>` : ''}</div></div>`).join('')}</div></div>` : ''}`;
  }
  X.action('x-kc-hash-gerar', () => {
    const S = X.toolState('hashtags');
    if (!X.str(S.assunto) && !X.str(S.base)) { S.err = 'Escreva o assunto do post ou cole a legenda.'; X.refresh(); return; }
    const p = prof();
    const prompt = [
      X.ctxPerfil({ semAprendizados: true, semGravacao: true }),
      kb('hashtags'),
      `═══ TAREFA: CONJUNTO DE HASHTAGS ═══
Nicho do perfil: ${p.nicho || '(não informado)'}
Público: ${p.publico || '(não informado)'}
Seguidores: ${p.seguidores || '(não informado)'}
Assunto do post: ${X.str(S.assunto, 600) || '(tire do texto)'}
${X.str(S.base) ? `Texto do post:\n"""\n${X.str(S.base, 5000)}\n"""` : ''}
Regras:
- "conjunto" com 3 a 5 tags: 2 a 3 de nicho (até 50 mil posts), 1 a 2 médias (50 mil a 500 mil), no máximo 1 ampla (só se encaixar).
- Toda tag descreve o post de verdade e está no idioma que o público pesquisa (português do Brasil). Nada popular e fora do assunto.
- Você não tem acesso ao Instagram: "estimativa" é aproximada (ex.: "~30 mil posts") e o criador vai conferir.
- "reserva" com 3 a 5 tags pra rotacionar em outros posts do mesmo tema.
- "evitar": tags genéricas, de isca (#follow4follow, #likeforlike) ou que atraem o público errado.`
    ].filter(Boolean).join('\n\n') + fimJSON(`{"conjunto": [{"tag": "#exemplo", "faixa": "nicho", "estimativa": "~30 mil posts", "porque": "..."}], "reserva": [{"tag": "#outra", "faixa": "medio", "estimativa": "~120 mil posts", "porque": "..."}], "evitar": [{"tag": "#ruim", "porque": "..."}], "comoConferir": "1 frase"}`);
    X.rodar(S, prompt, parseHashtags, { tier: 'default' });
  });
  X.action('x-kc-hash-salvar', () => {
    const S = X.toolState('hashtags'); if (!S.res) return;
    X.salvar('pecas', { tipo: 'hashtags', titulo: X.str(S.assunto, 80) || S.res.conjunto.map(t => t.tag).join(' ').slice(0, 80), form: { assunto: S.assunto, origem: S.origem }, res: S.res });
    salvo('Hashtags salvas.');
  });

  /* =====================================================================
     4) HUMANIZAR
     ===================================================================== */
  X.tool({
    id: 'humanizar', nome: 'Humanizar', icone: 'humano', ordem: 50,
    resumo: 'Tira os vícios de texto de IA sem mudar o que você quis dizer.',
    init: () => ({ texto: '', tipo: 'legenda', origem: '', audit: null }),
    render(S) {
      const p = 'kit.tools.humanizar';
      const entrada = `<section class="card kit-in">
        <h2>Humanizar</h2>
        <p class="lead">Encontra e tira o que soa como texto de IA: palavra de IA, "não é X, é Y", fileira de emoji, travessão demais, pedido de engajamento. O sentido e os fatos ficam.</p>
        ${origemTag(S)}
        ${X.h.campo({ path: p + '.texto', label: 'Texto', tipo: 'textarea', rows: 10, placeholder: 'Cole a legenda, o texto do slide, o roteiro ou a bio.' })}
        <div class="field"><span>O que é</span>${X.h.seg(p + '.tipo', [['legenda', 'Legenda'], ['slide', 'Slide'], ['roteiro', 'Roteiro'], ['bio', 'Bio']])}</div>
        <div class="kit-row">
          <button type="button" class="btn" data-a="x-kc-hum-auditar">${ic('check', 'sm')} Auditar sem IA</button>
          <button type="button" class="btn primary" data-a="x-kc-hum-gerar" ${desab(S)}>${ic('humano', 'sm')} Reescrever sem cara de IA</button>
        </div>
        <p class="kit-hint">Nenhuma reescrita garante passar em detector de IA. O objetivo é soar como você.</p>
      </section>`;
      let saida = X.h.erro(S.err);
      if (S.busy) saida = ocupado('Tirando os vícios do texto. Leva de 10 a 30 segundos.', 'humanizar');
      else if (S.res) saida += humanizarOut(S);
      else if (S.audit) saida += auditOut(S.audit);
      else saida += X.h.vazio('A auditoria e o texto limpo aparecem aqui.', '"Auditar sem IA" dá a nota e os vícios na hora. "Reescrever" devolve o texto limpo, a nota antes e depois e cada trecho trocado.');
      return `<div class="kit">${entrada}<section class="kit-out">${saida}</section></div>`;
    }
  });
  const auditOut = a => `<div class="card kit-sec"><div class="kit-row"><h3 class="grow">Auditoria</h3><span class="kit-score">${a.nota}<small>/100</small></span></div>
    ${X.h.contagem(a.texto)}${dotList(a.itens)}</div>`;
  function humanizarOut(S) {
    const r = S.res;
    const antes = r.antes || X.auditar('');
    const depois = X.auditar(r.texto);
    return `<div class="card kit-sec">
        <h3>Antes × depois</h3>
        <div class="kc-notas"><div><div class="eyebrow">Antes</div><span class="kit-score">${antes.nota}<small>/100</small></span></div><div><div class="eyebrow">Depois</div><span class="kit-score">${depois.nota}<small>/100</small></span></div></div>
        <pre class="kit-pre">${esc(r.texto)}</pre>${X.h.contagem(r.texto)}
        <div class="kit-row"><button type="button" class="btn sm" data-a="copiar-txt" data-txt="${esc(r.texto)}">${ic('copy', 'sm')} Copiar</button>
          <button type="button" class="btn sm ghost" data-a="x-kc-hum-usar">Usar como novo texto</button></div>
      </div>
      ${r.mudancas.length ? `<div class="card kit-sec"><h3>O que mudou</h3><div class="kc-mud">${r.mudancas.map(m => `<div class="it">${m.antes ? `<del>${esc(m.antes)}</del>` : ''}${m.antes && m.depois ? ' → ' : ''}${m.depois ? `<ins>${esc(m.depois)}</ins>` : ''}${m.porque ? `<div class="faint">${esc(m.porque)}</div>` : ''}</div>`).join('')}</div></div>` : ''}
      ${depois.itens.some(i => i.nivel !== 'good') ? `<div class="card kit-sec"><h3>Ainda vale olhar</h3>${dotList(depois.itens.filter(i => i.nivel !== 'good'))}</div>` : ''}`;
  }
  X.action('x-kc-hum-auditar', () => {
    const S = X.toolState('humanizar');
    if (!X.str(S.texto)) { S.err = 'Cole o texto que você quer auditar.'; X.refresh(); return; }
    S.err = ''; S.res = null;
    S.audit = Object.assign(X.auditar(S.texto), { texto: S.texto });
    X.refresh();
  });
  X.action('x-kc-hum-gerar', () => {
    const S = X.toolState('humanizar');
    const original = X.str(S.texto, 6000);
    if (!original) { S.err = 'Cole o texto que você quer reescrever.'; X.refresh(); return; }
    const voz = ((A().st.memory || {}).voz) || null;
    const vozTxt = voz ? `═══ VOZ DO CRIADOR (escreva como ele) ═══\n${voz.resumo || ''}${(voz.tracos || []).length ? '\nTraços: ' + voz.tracos.join('; ') : ''}${(voz.bordoes || []).length ? '\nExpressões dele: ' + voz.bordoes.join('; ') : ''}${(voz.evitar || []).length ? '\nEle evita: ' + voz.evitar.join('; ') : ''}` : '';
    const tipoNome = { legenda: 'legenda de Instagram', slide: 'texto de slide de carrossel (curto, legível em 2 segundos)', roteiro: 'roteiro falado de Reel', bio: 'bio de Instagram (até 150 caracteres)' }[S.tipo] || 'legenda de Instagram';
    const prompt = [
      X.ctxPerfil({ semAprendizados: true, semGravacao: true }),
      kb('humanizarRegras'), vozTxt,
      `═══ TAREFA: TIRAR A CARA DE IA ═══
Tipo de texto: ${tipoNome}.
Regras:
- Mantenha o sentido, os fatos, os números, as marcações [CONFERIR]/[PREENCHER], as hashtags e a assinatura exatamente como estão.
- Não "melhore" o conteúdo nem acrescente ideias: só tire os vícios (palavra de IA, revelação forçada, "não é X, é Y", trio empilhado, frases picadas pra efeito, sinceridade encenada, fileira de emoji, travessão demais, isca de engajamento).
- Não prometa nem tente enganar detector de IA.
- Em "mudancas", liste cada trecho trocado e o vício que saiu.
Texto:
"""
${original}
"""`
    ].filter(Boolean).join('\n\n') + fimJSON(`{"texto": "texto reescrito", "mudancas": [{"antes": "trecho original", "depois": "trecho novo", "porque": "vício removido"}]}`);
    const antes = X.auditar(original);
    S.audit = null;
    X.rodar(S, prompt, r => { const p = parseHumanizar(r); if (p) p.antes = antes; return p; }, { tier: 'default' });
  });
  X.action('x-kc-hum-usar', () => {
    const S = X.toolState('humanizar'); if (!S.res) return;
    S.texto = S.res.texto; S.res = null; S.audit = null; S.err = '';
    X.refresh();
  });
})();
