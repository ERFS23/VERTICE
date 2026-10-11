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
.kc-slides{display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 220px), 1fr)); gap:12px}
.kc-slide{min-height:260px; max-width:100%; min-width:0; border:1px solid var(--line); background:var(--bg2); border-radius:14px; padding:14px; display:flex; flex-direction:column; gap:8px; overflow:visible}
.kc-slide .eyebrow{font-size:10px}
.kc-slide .kc-st{margin:0; font-family:var(--f-disp); font-weight:800; font-size:19px; line-height:1.05; text-transform:uppercase; letter-spacing:.02em; overflow-wrap:anywhere}
.kc-slide .kc-sx{margin:0; font-size:13px; line-height:1.4; color:var(--ink2); overflow-wrap:anywhere; flex:1}
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
.kc-abrir{justify-content:flex-start; text-align:left; white-space:normal; height:auto; min-width:0; overflow-wrap:anywhere}
@media (max-width: 520px){ .kc-notas{grid-template-columns:minmax(0,1fr)} .kc-slides{grid-template-columns:minmax(0,1fr)} }
`);

  /* ---------- auxiliares ---------- */
  const OBJ_PAD = [['salvamentos', 'Salvamentos'], ['compartilhamentos', 'Compartilhamentos'], ['comentarios', 'Comentários'], ['seguidores', 'Seguidores']];
  const objOpcoes = () => OBJ_PAD.map(([id, nome]) => [id, ((K().objetivos || {})[id] || {}).nome || nome]);
  const objTexto = id => (typeof K().objetivoTexto === 'function' && K().objetivoTexto(id)) || objTextoLocal(id);
  const objTextoLocal = id => {
    const o = (K().objetivos || {})[id];
    if (!o) return `Objetivo principal: ${id || 'salvamentos'}.`;
    return `═══ OBJETIVO PRINCIPAL: ${o.nome || id} ═══\n${o.comoGanha || ''}${(o.formulas || []).length ? `\nFórmulas que mais servem a este objetivo: ${o.formulas.join(', ')}` : ''}`;
  };
  const OBJ_IDS = OBJ_PAD.map(o => o[0]);
  const objOk = v => (OBJ_IDS.includes(v) ? v : 'salvamentos');
  const FORM_IDS = ['numero', 'contraria', 'cena', 'confissao', 'lista', 'antesdepois', 'mito', 'framework', 'quebra', 'comoeu'];
  const FORM_CAR = ['lista', 'antesdepois', 'mito', 'framework'];
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
  const ctaRegra = p => { const E = A() && A().E; try { return E && E.ctaRegra ? E.ctaRegra(p) : ''; } catch (e) { return ''; } };
  const desab = S => (S.busy || !A() || A().ui.ai !== 'on' ? 'disabled' : '');
  const origemTag = S => (S.origem ? `<div class="kit-row"><span class="tag amber">Veio de: ${esc(S.origem)}</span>${/^Plano da semana/.test(S.origem) ? `<button type="button" class="btn xs ghost" data-a="nav" data-v="semana">Voltar ao plano</button>` : ''}</div>` : '');
  const ocupado = (msg, id) => `<div class="thinking" style="padding:18px 2px"><div class="scan"></div><div class="tip">${esc(msg)}</div><button type="button" class="btn sm" data-a="x-parar" data-t="${esc(id)}">${ic('stop', 'sm')} Parar</button></div>`;
  const dotList = itens => `<div class="kit-audit">${itens.map(i => `<div class="it"><span class="dot ${esc(i.nivel)}"></span><div>${esc(i.txt)}${i.dica ? `<small>${esc(i.dica)}</small>` : ''}</div></div>`).join('')}</div>`;
  const fimJSON = ex => `\n\nResponda só com JSON, sem texto antes ou depois, exatamente neste formato:\n${ex}`;
  const aviso = (msg, tipo) => { const a = A(); if (a) a.toast(msg, tipo || 'good'); };
  // só aceita texto ou número vindo da IA (objeto viraria "[object Object]")
  const txt = (x, max) => (typeof x === 'string' || typeof x === 'number' ? X.str(x, max) : '');
  // de quem é o texto de referência: 'outro' (viral de outro perfil), 'proprio' (conteúdo do criador) ou 'incerto'
  const origemTipo = o => { o = String(o || ''); if (/^reaproveitad/i.test(o)) return 'proprio'; if (/^viral|texto colado/i.test(o)) return 'outro'; return 'incerto'; };
  // caracteres que sobram pro gancho antes do "mais", descontando a assinatura e a linha em branco
  const restoDobra = sig => Math.max(40, 125 - (sig ? X.graf(sig) + 2 : 0));
  // primeira linha com conteúdo depois da assinatura
  const linhaGancho = (legenda, sig) => {
    const L = String(legenda || '').split('\n').map(l => l.trim()).filter(Boolean);
    if (sig && L[0] && L[0].toLowerCase().startsWith(sig.toLowerCase())) return L[1] || '';
    return L[0] || '';
  };
  const valorBloco = v => {
    v = v || {};
    const rows = [['Antes → depois', v.antesDepois], ['Leva pronto', v.levaPronto], ['Ganho', v.ganho], ['Mandaria pra', v.mandariaPra]].filter(x => x[1]).map(([k, t]) => `<div class="vrow"><span class="k">${k}</span><p>${esc(t)}</p></div>`).join('')
      + (v.porQueSeguir ? `<div class="vrow seg"><span class="k">Por que seguir faz sentido</span><p>${esc(v.porQueSeguir)}</p></div>` : '');
    return rows ? `<div class="valor">${rows}</div>` : '';
  };
  const parseValor = v => {
    v = v && typeof v === 'object' ? v : {};
    return { antesDepois: txt(v.antesDepois, 300), levaPronto: txt(v.levaPronto, 300), ganho: txt(v.ganho, 300), mandariaPra: txt(v.mandariaPra, 200), porQueSeguir: txt(v.porQueSeguir, 300) };
  };
  const VALOR_JSON = `"valor": {"antesDepois": "de onde a pessoa sai e onde chega", "levaPronto": "o que ela aplica hoje", "ganho": "em reais, horas, cliente ou risco", "mandariaPra": "pessoa específica", "porQueSeguir": "por que seguir o perfil faz sentido depois disso"}`;
  const reguladoRegra = p => (p.regulado ? '- Conteúdo regulado: o passo aplicável é uma pergunta pra fazer ou uma verificação ("confira no contrato se...", "pergunte ao seu contador se..."), nunca uma decisão técnica pro caso da pessoa. O disclaimer do perfil vai na legenda.' : '');

  /* ---------- peças salvas: lista no fim do formulário ---------- */
  const pecasDe = tipo => { try { return X.pecas(tipo) || []; } catch (e) { return []; } };
  const salvosHTML = tipo => {
    const ps = pecasDe(tipo).slice(0, 8);
    if (!ps.length) return '';
    return `<div class="kit-sec"><div class="eyebrow">Salvos</div><div class="kit-hist">${ps.map(p => `<div class="rec-row"><button type="button" class="btn ghost sm kc-abrir" data-a="x-kc-abrir" data-id="${esc(p.id)}">${esc(p.titulo || 'Sem título')}</button><button type="button" class="btn xs danger" data-a="x-del-peca" data-id="${esc(p.id)}">Apagar</button></div>`).join('')}</div></div>`;
  };
  const salvarPeca = (S, item, msg) => {
    const ant = S.salvoId ? pecasDe().find(x => x.id === S.salvoId) : null;
    if (ant) { item.id = ant.id; item.createdAt = ant.createdAt; }
    const it = X.salvar('pecas', item);
    S.salvoId = it ? it.id : null;
    aviso(msg + ' Fica na lista Salvos, abaixo do formulário.');
    X.refresh();
  };
  X.action('x-kc-abrir', el => {
    const p = pecasDe().find(x => x.id === el.dataset.id);
    if (!p) return;
    X.abrirFerramenta(p.tipo, Object.assign({ base: '', origem: '' }, p.form || {}, { res: p.res, salvoId: p.id, err: '' }));
  });
  // nova geração = peça nova (zera o id salvo só quando a resposta é válida)
  const novo = (S, parse) => r => { const o = parse(r); if (o) S.salvoId = null; return o; };

  /* ---------- normalização de hashtags ---------- */
  const normTag = t => {
    if (typeof t !== 'string' && typeof t !== 'number') return '';
    const s = String(t).toLowerCase().replace(/[^\p{L}\p{N}_]/gu, '');
    return s ? '#' + s : '';
  };
  const FAIXAS = ['nicho', 'medio', 'amplo'];
  const normFaixa = f => { const s = String(typeof f === 'string' ? f : '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); return FAIXAS.find(x => s.includes(x)) || (s.includes('broad') ? 'amplo' : s.includes('mid') ? 'medio' : 'nicho'); };
  const tagsUnicas = (arr, n, visto) => {
    const out = []; visto = visto || new Set();
    (Array.isArray(arr) ? arr : []).forEach(x => {
      const o = typeof x === 'string' ? { tag: x } : (x || {});
      const tag = normTag(o.tag);
      if (!tag || visto.has(tag) || out.length >= n) return;
      visto.add(tag);
      out.push({ tag, faixa: normFaixa(o.faixa), sinal: txt(o.sinal, 200), porque: txt(o.porque, 200) });
    });
    return out;
  };
  const RE_HASH_FIM = /(?:^|\s+)(?:#[\p{L}\p{N}_]+\s*)+$/u;
  const temHashtag = t => /(^|\s)#[\p{L}\p{N}_]+/u.test(String(t || ''));
  // troca (ou acrescenta) o bloco de hashtags do fim da legenda
  const trocarHashtags = (legenda, linha) => {
    const t = String(legenda || '').replace(/\s+$/, '');
    const corpo = t.replace(RE_HASH_FIM, '');
    return corpo ? corpo + '\n\n' + linha : linha;
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

  /* ---------- auditoria local por tipo de texto ---------- */
  // X.auditar segue as regras de legenda; em slide, roteiro e bio tira o que não se aplica
  const FORA_DE_LEGENDA = /^(Os primeiros 125|\d+ caracteres: passa|\d+ hashtags? \(máximo)/;
  const auditarTipo = (texto, tipo) => {
    const a = X.auditar(texto);
    if (!tipo || tipo === 'legenda') return a;
    a.itens = a.itens.filter(i => !FORA_DE_LEGENDA.test(i.txt));
    if (tipo === 'bio') a.itens.unshift({ nivel: a.chars <= 150 ? 'good' : 'bad', txt: `${a.chars} de 150 caracteres`, dica: 'Corte até caber: o Instagram não aceita bio maior.' });
    a.nota = Math.max(0, 100 - a.itens.filter(i => i.nivel === 'warn').length * 8 - a.itens.filter(i => i.nivel === 'bad').length * 18);
    return a;
  };

  /* ---------- parsers ---------- */
  const PAPEIS = ['gancho', 'valor', 'resumo', 'cta'];
  const parseCarrossel = r => {
    if (!r || typeof r !== 'object') return null;
    const slides = X.arr(r.slides, 10, s => {
      if (!s || typeof s !== 'object') return null;
      const titulo = txt(s.titulo, 140), texto = txt(s.texto, 400);
      if (!titulo && !texto) return null;
      const pp = String(typeof s.papel === 'string' ? s.papel : '').toLowerCase();
      return { n: 0, papel: PAPEIS.includes(pp) ? pp : 'valor', titulo, texto, visual: txt(s.visual, 240) };
    });
    if (slides.length < 3) return null;
    slides.forEach((s, i) => { s.n = i + 1; });
    const visto = new Set();
    const hashtags = X.arr(r.hashtags, 12, h => normTag(h && typeof h === 'object' ? h.tag : h)).filter(t => !visto.has(t) && visto.add(t)).slice(0, 5);
    let legenda = txt(r.legenda, 2200);
    if (legenda && hashtags.length && !temHashtag(legenda)) legenda = (legenda + '\n\n' + hashtags.join(' ')).slice(0, 2200);
    const formula = txt(r.formula, 30).toLowerCase();
    return {
      formula: FORM_IDS.includes(formula) ? formula : '',
      objetivo: txt(r.objetivo, 40), porque: txt(r.porque, 300),
      valor: parseValor(r.valor),
      slides, legenda, hashtags, conferir: X.arr(r.conferir, 8, y => txt(y, 240))
    };
  };
  const parseLegenda = r => {
    if (!r || typeof r !== 'object') return null;
    let legenda = txt(r.legenda, 2200);
    if (!legenda) return null;
    const visto = new Set();
    const hashtags = X.arr(r.hashtags, 12, h => normTag(h && typeof h === 'object' ? h.tag : h)).filter(t => !visto.has(t) && visto.add(t)).slice(0, 5);
    if (hashtags.length && !temHashtag(legenda)) legenda = (legenda + '\n\n' + hashtags.join(' ')).slice(0, 2200);
    return {
      legenda, formula: txt(r.formula, 30), valor: parseValor(r.valor), hashtags,
      primeiras: X.arr(r.primeiras, 3, y => txt(y, 200)),
      cta: txt(r.cta, 200), porque: txt(r.porque, 300), conferir: X.arr(r.conferir, 8, y => txt(y, 240))
    };
  };
  const parseHashtags = r => {
    if (!r || typeof r !== 'object') return null;
    const visto = new Set();
    const conjunto = tagsUnicas(r.conjunto, 5, visto);
    if (!conjunto.length) return null;
    const reserva = tagsUnicas(r.reserva, 5, visto);
    const evitar = X.arr(r.evitar, 6, x => { const o = typeof x === 'string' ? { tag: x } : (x || {}); const tag = normTag(o.tag); return tag ? { tag, porque: txt(o.porque, 200) } : null; });
    return { conjunto, reserva, evitar, comoConferir: txt(r.comoConferir, 300) };
  };
  const LEITURAS = ['soa humano', 'misto', 'soa IA'];
  const parseHumanizar = r => {
    if (!r || typeof r !== 'object') return null;
    const texto = txt(r.texto, 6000);
    if (!texto) return null;
    const mudancas = X.arr(r.mudancas, 20, m => { if (!m || typeof m !== 'object') return null; const antes = txt(m.antes, 300), depois = txt(m.depois, 300); return antes || depois ? { antes, depois, porque: txt(m.porque, 200) } : null; });
    const lt = txt(r.leitura, 30).toLowerCase();
    const leitura = LEITURAS.find(l => lt === l.toLowerCase()) || '';
    return { texto, mudancas, pedir: X.arr(r.pedir, 4, y => txt(y, 200)), leitura };
  };
  X.kc = { parseCarrossel, parseLegenda, parseHashtags, parseHumanizar, trocarGancho, trocarHashtags, normTag, auditarTipo, origemTipo };

  /* =====================================================================
     1) CARROSSEL
     ===================================================================== */
  X.tool({
    id: 'carrossel', nome: 'Carrossel', icone: 'carrossel', ordem: 20,
    resumo: 'Roteiro slide a slide: o 1º prende, o 2º e o 3º entregam o melhor e o último vira o resumo que a pessoa salva.',
    init: () => ({ tema: '', objetivo: 'salvamentos', formula: 'auto', slides: 7, gancho: '', base: '', origem: '', salvoId: null }),
    render(S) {
      const p = 'kit.tools.carrossel';
      const slidesOp = [5, 6, 7, 8, 9, 10].map(n => [String(n), n + ' slides']);
      const entrada = `<section class="card kit-in">
        <h2>Carrossel</h2>
        <p class="lead">O 1º slide promete e prende, o 2º e o 3º entregam o melhor, e o último junta tudo num resumo que a pessoa salva, com um único pedido.</p>
        ${origemTag(S)}
        ${X.h.campo({ path: p + '.tema', label: 'Tema ou ideia', tipo: 'textarea', rows: 3, placeholder: 'Ex.: 5 erros que fazem o pequeno negócio pagar imposto a mais' })}
        <div class="field"><span>Objetivo</span>${X.h.seg(p + '.objetivo', objOpcoes())}</div>
        <div class="field"><span>Fórmula</span>${X.h.seg(p + '.formula', ['auto'].concat(FORM_CAR).map(id => [id, formNome(id)]))}</div>
        ${X.h.campo({ path: p + '.slides', label: 'Quantidade de slides', tipo: 'select', opcoes: slidesOp, value: String(S.slides || 7), help: 'Só o que o conteúdo pede. Encher slide pra chegar em 10 faz a pessoa desistir.' })}
        ${X.h.campo({ path: p + '.gancho', label: 'Ideia de gancho (opcional)', placeholder: 'Em branco: a IA escolhe pela fórmula' })}
        <details class="kc-details" ${S.base ? 'open' : ''}><summary>Recriar a partir de um texto</summary>
          ${X.h.campo({ path: p + '.base', label: 'Texto de referência', tipo: 'textarea', rows: 5, placeholder: 'Cole um viral, um roteiro seu ou um post seu de outra rede. De outro perfil: a IA aproveita só a estrutura. Seu: a IA aproveita as suas frases.' })}
          ${S.base && S.origem ? `<button type="button" class="btn xs ghost" data-a="x-set" data-path="${p}.base" data-val="">Limpar texto colado</button>` : ''}
        </details>
        <button type="button" class="btn primary" data-a="x-kc-car-gerar" ${desab(S)}>${ic('carrossel', 'sm')} Gerar carrossel</button>
        ${salvosHTML('carrossel')}
      </section>`;
      let saida;
      if (S.busy) saida = ocupado('Montando os slides e a legenda. Leva de 20 segundos a 1 minuto.', 'carrossel');
      else if (!S.res) saida = X.h.erro(S.err) + X.h.vazio('O roteiro do carrossel aparece aqui.', 'Você recebe cada slide com título, texto e sugestão visual, o valor que ele entrega, a legenda pronta com a dobra marcada e 3 a 5 hashtags.');
      else saida = X.h.erro(S.err) + carrosselOut(S.res);
      return `<div class="kit">${entrada}<section class="kit-out">${saida}</section></div>`;
    }
  });
  // texto pra colar no CarrosseIA: sem travessão e sem a sugestão visual (que viraria texto do card)
  const slidesTxt = (r, comVisual) => r.slides.map(s => `Slide ${s.n}: ${s.titulo}\n${s.texto}${comVisual && s.visual ? `\nImagem: ${s.visual}` : ''}`).join('\n\n');
  function carrosselOut(r) {
    const PN = { gancho: 'Gancho', valor: 'Valor', resumo: 'Resumo', cta: 'Resumo e pedido' };
    const slides = r.slides.map(s => `<div class="kc-slide ${esc(s.papel)}"><div class="eyebrow">${s.n} · ${esc(PN[s.papel] || s.papel)}</div><p class="kc-st">${esc(s.titulo)}</p><p class="kc-sx">${esc(s.texto)}</p>${s.visual ? `<p class="kc-sv faint">${esc(s.visual)}</p>` : ''}</div>`).join('');
    const aud = r.legenda ? X.auditar(r.legenda).itens.filter(i => i.nivel !== 'good') : [];
    const unica = /^melhor como imagem [úu]nica/i.test(r.porque || '');
    return `<div class="card kit-sec">
        <div class="kit-row"><h3 class="grow">Carrossel · ${r.slides.length} slides</h3>${r.formula ? `<span class="tag">${esc(formNome(r.formula))}</span>` : ''}${r.objetivo ? `<span class="tag mono">${esc(r.objetivo)}</span>` : ''}</div>
        ${unica ? `<div class="errnote warn">${ic('alert', 'sm')}<span>${esc(r.porque)}</span></div><div class="kit-row"><button type="button" class="btn sm" data-a="x-kc-car-imagem">${ic('legenda', 'sm')} Fazer legenda de imagem única</button></div>` : (r.porque ? `<p class="kit-hint">${esc(r.porque)}</p>` : '')}
        ${valorBloco(r.valor)}
      </div>
      <div class="card kit-sec"><div class="kc-slides">${slides}</div>
        <div class="kit-row"><button type="button" class="btn sm" data-a="copiar-txt" data-txt="${esc(slidesTxt(r))}">${ic('copy', 'sm')} Copiar slides</button>
        <button type="button" class="btn sm ghost" data-a="copiar-txt" data-txt="${esc(slidesTxt(r, true))}">${ic('copy', 'sm')} Copiar com sugestões visuais</button>
        <button type="button" class="btn sm primary" data-a="x-kc-car-salvar">${ic('check', 'sm')} Salvar</button>
        <button type="button" class="btn sm ghost" data-a="x-kc-car-estudio">${ic('estudio', 'sm')} Transformar em Reel no Estúdio</button></div>
        <p class="kit-hint">Próximo passo: copie os slides e cole no CarrosseIA pra gerar as artes, na mesma ordem.</p>
      </div>
      ${r.legenda ? `<div class="card kit-sec"><h3>Legenda</h3>${X.h.dobra(r.legenda)}${X.h.contagem(r.legenda)}
        ${aud.length ? dotList(aud) : '<p class="kit-hint">A conferência sem IA não achou problema na legenda.</p>'}
        ${r.hashtags.length ? `<div class="rates">${r.hashtags.map(t => `<span class="tag mono">${esc(t)}</span>`).join('')}</div>` : ''}
        <div class="kit-row"><button type="button" class="btn sm" data-a="copiar-txt" data-txt="${esc(r.legenda)}">${ic('copy', 'sm')} Copiar legenda</button>
        <button type="button" class="btn sm ghost" data-a="x-kc-car-humanizar">${ic('humano', 'sm')} Humanizar legenda</button>
        <button type="button" class="btn sm ghost" data-a="x-kc-car-hashtags">${ic('hashtag', 'sm')} Trocar hashtags</button></div>
      </div>` : ''}
      ${r.conferir.length ? `<div class="card kit-sec"><h3>Conferir antes de postar</h3>${X.h.lista(r.conferir, 'warnlist')}</div>` : ''}`;
  }
  X.action('x-kc-car-gerar', () => {
    const S = X.toolState('carrossel');
    if (!X.str(S.tema) && !X.str(S.base)) { S.err = 'Escreva o tema do carrossel ou cole um texto de referência.'; X.refresh(); return; }
    const p = prof();
    const sig = assinatura(p);
    const resto = restoDobra(sig);
    const n = X.num(S.slides, 5, 10) || 7;
    const fOk = FORM_CAR.includes(S.formula) ? S.formula : 'auto';
    const obj = objOk(S.objetivo);
    const formula = fOk !== 'auto' ? `Use a fórmula "${fOk}" (${formNome(fOk)}).` : 'Escolha a fórmula de carrossel que mais serve ao objetivo (lista, antesdepois, mito ou framework) e diga qual.';
    const tb = origemTipo(S.origem);
    const baseInstr = tb === 'proprio'
      ? 'TEXTO DO PRÓPRIO CRIADOR: aproveite as frases e os exemplos dele, ajustando ao formato de slide.'
      : tb === 'outro'
        ? 'TEXTO DE OUTRO PERFIL: modele a estrutura, o ritmo e o tipo de promessa, sem copiar nenhuma frase. Adapte ao nicho e à verdade deste perfil.'
        : 'TEXTO DE REFERÊNCIA: se for claramente do próprio criador (a voz e o assunto dele), aproveite as frases e os exemplos dele, ajustando ao formato de slide. Se for de outro perfil, ou se não der pra saber de quem é, trate como de outro perfil: modele a estrutura, o ritmo e o tipo de promessa, sem copiar nenhuma frase.';
    const prompt = [
      X.ctxPerfil(),
      kb('carrossel'), blocoF('carrossel'), objTexto(obj), legRegra(p), kb('legenda'),
      `═══ TAREFA: ROTEIRO DE CARROSSEL ═══
Tema: ${X.str(S.tema, 1500) || '(tire do texto de referência)'}
${formula}
Quantidade: ${n} slides (pode usar menos se o conteúdo não render ${n}; nunca encha linguiça).
${X.str(S.gancho) ? `Ideia de gancho do criador (respeite a intenção): ${X.str(S.gancho, 300)}` : ''}
${X.str(S.base) ? `${tb !== 'proprio' && kb('recriar') ? kb('recriar') + '\n' : ''}${baseInstr}${S.origem ? ` (Origem: ${S.origem})` : ''}\n"""\n${X.str(S.base, 8000)}\n"""` : ''}
REGRA DO CTA DESTE PERFIL: ${ctaRegra(p) || 'um único pedido por post.'}
Regras:
- Antes de escrever, preencha "valor" e confira as 5 provas do VALOR QUE TRANSFORMA; se uma falhar, reescreva.
- Slide 1: de 6 a 12 palavras, promete um ganho concreto e abre um loop (algo que só se resolve passando). Nunca só um título.
- Valor na frente: o ponto mais forte fica no slide 2 ou 3. Pelo menos um slide entrega algo pronto pra usar hoje.
- Uma ideia por slide, legível em 2 segundos numa tela 4:5. Demais slides: título com até 8 palavras e texto com até 35.
- Último slide = o resumo inteiro num slide só (o que a pessoa salva e printa) + UM pedido conforme o objetivo: salvamentos → "salva pra usar quando {situação}"; compartilhamentos → "manda pra {pessoa específica}"; seguidores ou comentários → seguir, amarrado ao próximo post. Se a regra do CTA deste perfil fixa seguir ou palavra-chave, vale a do perfil, e o salvar ou mandar aparece só como motivo, sem virar segundo pedido. Diga numa linha o assunto do próximo post. Nada de "salva, compartilha e segue".
- O pedido do último slide e o CTA da legenda são O MESMO pedido, com as mesmas palavras.
- Se o tema não rende 4 pontos reais, diga isso em "porque" começando por "Melhor como imagem única:" e entregue mesmo assim o carrossel mais curto possível.
- Cada slide traz uma sugestão visual ou de prova (print, exemplo, número com fonte, foto sua).
- Nada inventado: número, caso ou resultado que faltar vira [PREENCHER: o quê]; fato técnico duvidoso vira [CONFERIR: o quê] e entra em "conferir".
${reguladoRegra(p)}
- Sem travessão no texto dos slides (o app de arte troca por vírgula); palavras do dia a dia, sem cara de IA.
- A legenda segue a estrutura do perfil e complementa os slides. A linha do gancho (logo depois da assinatura) repete a promessa do slide 1 com outras palavras e tem no máximo ${resto} caracteres, pra caber inteira antes do "mais".
- As 3 a 5 hashtags vão no fim do texto da legenda E repetidas, idênticas, em "hashtags".`
    ].filter(Boolean).join('\n\n') + fimJSON(`{"formula": "${fOk !== 'auto' ? fOk : 'lista|antesdepois|mito|framework'}", "objetivo": "${obj}", "porque": "1 frase sobre por que essa fórmula", ${VALOR_JSON}, "slides": [{"n": 1, "papel": "gancho", "titulo": "...", "texto": "...", "visual": "..."}, {"n": 2, "papel": "valor", "titulo": "...", "texto": "...", "visual": "..."}, {"n": ${n}, "papel": "cta", "titulo": "resumo do carrossel", "texto": "os pontos em uma linha cada + o pedido", "visual": "..."}], "legenda": "legenda pronta, com as hashtags no fim", "hashtags": ["#exemplo"], "conferir": ["[CONFERIR] ..."]}`);
    X.rodar(S, prompt, novo(S, parseCarrossel), { tier: 'complex' });
  });
  X.action('x-kc-car-salvar', () => {
    const S = X.toolState('carrossel'); if (!S.res) return;
    salvarPeca(S, { tipo: 'carrossel', titulo: (S.res.slides[0] || {}).titulo || X.str(S.tema, 80) || 'Carrossel', form: { tema: S.tema, objetivo: S.objetivo, formula: S.formula, slides: S.slides, gancho: S.gancho, origem: S.origem }, res: S.res }, 'Carrossel salvo.');
  });
  X.action('x-kc-car-humanizar', () => { const S = X.toolState('carrossel'); if (S.res) X.abrirFerramenta('humanizar', { texto: S.res.legenda, tipo: 'legenda', origem: 'Carrossel', audit: null }); });
  X.action('x-kc-car-hashtags', () => { const S = X.toolState('carrossel'); if (S.res) X.abrirFerramenta('hashtags', { assunto: S.tema, base: S.res.legenda, origem: 'Carrossel' }); });
  X.action('x-kc-car-estudio', () => {
    const S = X.toolState('carrossel'); if (!S.res) return;
    const r = S.res, s1 = r.slides[0] || {};
    X.paraEstudio({ assunto: X.str(S.tema, 600) || s1.titulo, gancho: s1.titulo, objetivo: objOk(S.objetivo), obs: slidesTxt(r), why: 'Vindo do carrossel: mesmo assunto, agora em vídeo.' });
  });
  X.action('x-kc-car-imagem', () => {
    const S = X.toolState('carrossel');
    X.abrirFerramenta('legenda', { assunto: X.str(S.tema) || ((S.res && S.res.slides[0]) || {}).titulo || '', tipo: 'imagem', objetivo: objOk(S.objetivo), gancho: '', base: '', origem: 'Carrossel' });
  });

  /* =====================================================================
     2) LEGENDA
     ===================================================================== */
  X.tool({
    id: 'legenda', nome: 'Legenda', icone: 'legenda', ordem: 30,
    resumo: 'Gancho inteiro antes do "mais", corpo que complementa o post e um único pedido.',
    init: () => ({ assunto: '', tipo: 'reel', objetivo: 'seguidores', gancho: '', base: '', origem: '', salvoId: null }),
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
        ${X.h.campo({ path: p + '.base', label: origemTipo(S.origem) === 'outro' ? 'Texto de referência (de outro perfil)' : 'Roteiro ou texto dos slides (opcional)', tipo: 'textarea', rows: 5, placeholder: 'Cole o roteiro do Reel ou o texto dos slides. A legenda complementa, não repete.' })}
        ${S.base && S.origem ? `<div class="kit-row"><button type="button" class="btn xs ghost" data-a="x-set" data-path="${p}.base" data-val="">Limpar texto colado</button></div>` : ''}
        <button type="button" class="btn primary" data-a="x-kc-leg-gerar" ${desab(S)}>${ic('legenda', 'sm')} Gerar legenda</button>
        ${salvosHTML('legenda')}
      </section>`;
      let saida;
      if (S.busy) saida = ocupado('Escrevendo a legenda. Leva de 10 a 40 segundos.', 'legenda');
      else if (!S.res) saida = X.h.erro(S.err) + X.h.vazio('A legenda pronta aparece aqui.', 'Com a dobra dos 125 caracteres marcada, a conferência sem IA, 3 versões alternativas da primeira linha e o pedido único.');
      else saida = X.h.erro(S.err) + legendaOut(S);
      return `<div class="kit">${entrada}<section class="kit-out">${saida}</section></div>`;
    }
  });
  function legendaOut(S) {
    const r = S.res;
    const a = X.auditar(r.legenda);
    const resto = restoDobra(assinatura(prof()));
    const semRoteiro = S.tipo === 'reel' && !X.str(S.base);
    return `<div class="card kit-sec">
        <div class="kit-row"><h3 class="grow">Legenda</h3>${r.formula ? `<span class="tag">${esc(formNome(r.formula))}</span>` : ''}<span class="kit-score">${a.nota}<small>/100</small></span></div>
        ${r.porque ? `<p class="kit-hint">${esc(r.porque)}</p>` : ''}
        ${X.h.dobra(r.legenda)}${X.h.contagem(r.legenda)}
        ${r.cta ? `<p class="kit-hint">Pedido final: ${esc(r.cta)}</p>` : ''}
        <div class="kit-row"><button type="button" class="btn sm" data-a="copiar-txt" data-txt="${esc(r.legenda)}">${ic('copy', 'sm')} Copiar legenda</button>
          <button type="button" class="btn sm primary" data-a="x-kc-leg-salvar">${ic('check', 'sm')} Salvar</button>
          <button type="button" class="btn sm ghost" data-a="x-kc-leg-humanizar">${ic('humano', 'sm')} Humanizar</button>
          <button type="button" class="btn sm ghost" data-a="x-kc-leg-hashtags">${ic('hashtag', 'sm')} Trocar hashtags</button></div>
        ${semRoteiro ? `<div class="kit-row"><span class="kit-hint grow">Ainda não tem o roteiro do Reel?</span><button type="button" class="btn sm ghost" data-a="x-kc-leg-estudio">${ic('estudio', 'sm')} Levar pro Estúdio</button></div>` : ''}
      </div>
      ${valorBloco(r.valor) ? `<div class="card kit-sec"><h3>O valor do post</h3>${valorBloco(r.valor)}</div>` : ''}
      <div class="card kit-sec"><h3>Conferência sem IA</h3>${dotList(a.itens)}</div>
      ${r.primeiras.length ? `<div class="card kit-sec"><h3>Outras primeiras linhas</h3><p class="kit-hint">Troca só a linha do gancho (a primeira depois da assinatura). Cabem ${resto} caracteres antes do "mais".</p>
        ${r.primeiras.map((t, i) => { const g = X.graf(t); return `<div class="kc-alt"><span>${esc(t)}${g > resto ? ` <span class="tag warn">${g} caract.: passa da dobra</span>` : ''}</span><button type="button" class="btn xs" data-a="x-kc-leg-usar" data-i="${i}">Usar esta</button></div>`; }).join('')}</div>` : ''}
      ${r.conferir.length ? `<div class="card kit-sec"><h3>Conferir antes de postar</h3>${X.h.lista(r.conferir, 'warnlist')}</div>` : ''}`;
  }
  X.action('x-kc-leg-gerar', () => {
    const S = X.toolState('legenda');
    if (!X.str(S.assunto) && !X.str(S.base)) { S.err = 'Escreva o assunto do post ou cole o roteiro.'; X.refresh(); return; }
    const p = prof();
    const sig = assinatura(p);
    const resto = restoDobra(sig);
    const tipoNome = { reel: 'Reel', imagem: 'post de imagem única', carrossel: 'carrossel' }[S.tipo] || 'Reel';
    const deTerceiro = origemTipo(S.origem) === 'outro';
    const baseTxt = X.str(S.base)
      ? `${deTerceiro ? `REFERÊNCIA DE OUTRO PERFIL (${S.origem}): NÃO é o post do criador. Modele só a estrutura, o tipo de promessa e o ritmo, sem copiar nenhuma frase, e escreva a legenda do post que o CRIADOR vai fazer sobre o assunto acima, com a verdade e o nicho dele.` : 'Texto do post do criador (a legenda COMPLEMENTA, não resume nem repete):'}\n"""\n${X.str(S.base, 8000)}\n"""`
      : '';
    const prompt = [
      X.ctxPerfil(),
      kb('legenda'), legRegra(p), blocoF('legenda'), kb('sinais'), objTexto(objOk(S.objetivo)),
      `═══ TAREFA: LEGENDA DE ${tipoNome.toUpperCase()} ═══
Assunto: ${X.str(S.assunto, 1200) || '(tire do texto do post)'}
${X.str(S.gancho) ? `Ideia de gancho do criador (respeite a intenção): ${X.str(S.gancho, 300)}` : ''}
${baseTxt}
Regras:
- Antes de escrever, preencha "valor" e confira as 5 provas do VALOR QUE TRANSFORMA; se uma falhar, reescreva.
- ${sig ? `A primeira linha é a assinatura "${sig}". ` : ''}O gancho (a linha logo depois da assinatura) tem no máximo ${resto} caracteres, pra caber inteiro antes do "mais".
- Corpo escaneável, frases curtas, traz o que não coube no post (detalhe, exemplo, passo extra).
- Um CTA só, sem isca de engajamento. Pergunta aberta específica pra puxar comentário de verdade.
- 3 a 5 hashtags específicas, em minúsculas, no fim do texto da legenda E repetidas, idênticas, em "hashtags". De 0 a 3 emojis, com intenção.
- ${p.regulado ? `Conteúdo regulado: inclua o disclaimer "${p.disclaimer || ''}".` : 'Disclaimer só se tocar em direito, tributo, saúde ou finanças.'}
${reguladoRegra(p)}
- Nada inventado: o que faltar vira [PREENCHER: o quê]; fato técnico duvidoso vira [CONFERIR: o quê] e entra em "conferir".
- "primeiras" = 3 versões SÓ da linha do gancho (sem a assinatura), cada uma com no máximo ${resto} caracteres e fórmula diferente.`
    ].filter(Boolean).join('\n\n') + fimJSON(`{"legenda": "${sig ? sig.replace(/["\\]/g, '') + '\\n\\n' : ''}linha do gancho\\n\\ncorpo...\\n\\n#exemplo", "formula": "id da fórmula usada (numero, contraria, cena, confissao, comoeu...)", ${VALOR_JSON}, "primeiras": ["versão 1", "versão 2", "versão 3"], "cta": "o pedido usado", "hashtags": ["#exemplo"], "porque": "1 frase", "conferir": []}`);
    X.rodar(S, prompt, novo(S, parseLegenda), { tier: 'default' });
  });
  X.action('x-kc-leg-usar', el => {
    const S = X.toolState('legenda'); if (!S.res) return;
    const nova = S.res.primeiras[Number(el.dataset.i)]; if (!nova) return;
    S.res.legenda = trocarGancho(S.res.legenda, nova, assinatura(prof()));
    X.refresh();
  });
  X.action('x-kc-leg-salvar', () => {
    const S = X.toolState('legenda'); if (!S.res) return;
    salvarPeca(S, { tipo: 'legenda', titulo: X.str(S.assunto, 80) || 'Legenda', form: { assunto: S.assunto, tipo: S.tipo, objetivo: S.objetivo, gancho: S.gancho, origem: S.origem }, res: S.res }, 'Legenda salva.');
  });
  X.action('x-kc-leg-humanizar', () => { const S = X.toolState('legenda'); if (S.res) X.abrirFerramenta('humanizar', { texto: S.res.legenda, tipo: 'legenda', origem: 'Legenda', audit: null }); });
  X.action('x-kc-leg-hashtags', () => { const S = X.toolState('legenda'); if (S.res) X.abrirFerramenta('hashtags', { assunto: S.assunto, base: S.res.legenda, origem: 'Legenda' }); });
  X.action('x-kc-leg-estudio', () => {
    const S = X.toolState('legenda'); if (!S.res) return;
    X.paraEstudio({ assunto: X.str(S.assunto, 600), gancho: linhaGancho(S.res.legenda, assinatura(prof())), objetivo: objOk(S.objetivo), why: 'Vindo da legenda: falta o roteiro do Reel.' });
  });

  /* ---------- devolver o resultado pra legenda de origem (Carrossel ou Legenda) ---------- */
  const ORIGEM_ID = { Carrossel: 'carrossel', Legenda: 'legenda' };
  const podeDevolver = S => !!ORIGEM_ID[S.origem];
  const devolver = (S, muda) => {
    const id = ORIGEM_ID[S.origem]; if (!id) return;
    const T = X.toolState(id);
    if (!T.res || !T.res.legenda) { aviso('A legenda de origem não está mais aberta. Copie e cole à mão.', 'warn'); return; }
    muda(T.res);
    X.abrirFerramenta(id);
    aviso('Legenda atualizada. Salve de novo pra guardar a versão nova.');
  };

  /* =====================================================================
     3) HASHTAGS
     ===================================================================== */
  X.tool({
    id: 'hashtags', nome: 'Hashtags', icone: 'hashtag', ordem: 40,
    resumo: '3 a 5 hashtags no tamanho em que o seu perfil consegue aparecer.',
    init: () => ({ assunto: '', base: '', origem: '', salvoId: null }),
    render(S) {
      const p = 'kit.tools.hashtags';
      const entrada = `<section class="card kit-in">
        <h2>Hashtags</h2>
        <p class="lead">Em 2026, 3 a 5 hashtags certas valem mais que 30 genéricas. Perfil pequeno aparece nas de nicho; as amplas só dão um rótulo.</p>
        ${origemTag(S)}
        ${X.h.campo({ path: p + '.assunto', label: 'Assunto do post', placeholder: 'Ex.: como separar conta PJ e PF' })}
        ${X.h.campo({ path: p + '.base', label: 'Legenda ou roteiro (opcional)', tipo: 'textarea', rows: 5, placeholder: 'Colar ajuda a IA a escolher hashtags que descrevem o post de verdade.' })}
        <button type="button" class="btn primary" data-a="x-kc-hash-gerar" ${desab(S)}>${ic('hashtag', 'sm')} Escolher hashtags</button>
        ${salvosHTML('hashtags')}
      </section>`;
      let saida;
      if (S.busy) saida = ocupado('Escolhendo as hashtags. Leva de 10 a 30 segundos.', 'hashtags');
      else if (!S.res) saida = X.h.erro(S.err) + X.h.vazio('O conjunto de hashtags aparece aqui.', 'De 3 a 5 tags separadas por tamanho provável (nicho, médio, amplo), uma reserva pra variar entre posts e as que é melhor evitar.');
      else saida = X.h.erro(S.err) + hashtagsOut(S);
      return `<div class="kit">${entrada}<section class="kit-out">${saida}</section></div>`;
    }
  });
  const FN = { nicho: 'Nicho provável (menos de 50 mil posts)', medio: 'Médio provável (50 mil a 500 mil)', amplo: 'Amplo provável (mais de 500 mil)' };
  const tagCard = t => { const si = t.sinal || t.estimativa; return `<div class="kc-tag"><b>${esc(t.tag)}</b>${si ? `<small>${esc(si)}</small>` : ''}${t.porque ? `<small>${esc(t.porque)}</small>` : ''}</div>`; };
  function hashtagsOut(S) {
    const r = S.res;
    const grupos = FAIXAS.map(f => { const ts = r.conjunto.filter(t => t.faixa === f); return ts.length ? `<div class="kc-faixa"><div class="eyebrow">${esc(FN[f])}</div>${ts.map(tagCard).join('')}</div>` : ''; }).join('');
    const linha = r.conjunto.map(t => t.tag).join(' ');
    return `<div class="card kit-sec">
        <div class="kit-row"><h3 class="grow">Conjunto · ${r.conjunto.length}</h3></div>
        <pre class="kit-pre">${esc(linha)}</pre>
        ${grupos}
        <div class="errnote warn">${ic('alert', 'sm')}<span>O app não acessa o Instagram: o tamanho de cada tag é um palpite pela especificidade. Confira o número de posts na busca antes de usar.${r.comoConferir ? ' ' + esc(r.comoConferir) : ''}</span></div>
        <div class="kit-row">${podeDevolver(S) ? `<button type="button" class="btn sm primary" data-a="x-kc-hash-devolver">${ic('check', 'sm')} Devolver pra legenda</button>` : ''}
          <button type="button" class="btn sm" data-a="copiar-txt" data-txt="${esc(linha)}">${ic('copy', 'sm')} Copiar conjunto</button>
          ${r.reserva.length ? `<button type="button" class="btn sm" data-a="copiar-txt" data-txt="${esc(r.reserva.map(t => t.tag).join(' '))}">${ic('copy', 'sm')} Copiar reserva</button>` : ''}
          <button type="button" class="btn sm ${podeDevolver(S) ? 'ghost' : 'primary'}" data-a="x-kc-hash-salvar">${ic('check', 'sm')} Salvar</button></div>
      </div>
      ${r.reserva.length ? `<div class="card kit-sec"><h3>Reserva pra variar</h3><p class="kit-hint">Troque 1 ou 2 de nicho a cada post: o mesmo bloco em todo post parece automação.</p>${r.reserva.map(tagCard).join('')}</div>` : ''}
      ${r.evitar.length ? `<div class="card kit-sec"><h3>Evite</h3><div class="kit-audit">${r.evitar.map(t => `<div class="it"><span class="dot bad"></span><div>${esc(t.tag)}${t.porque ? `<small>${esc(t.porque)}</small>` : ''}</div></div>`).join('')}</div></div>` : ''}`;
  }
  X.action('x-kc-hash-gerar', () => {
    const S = X.toolState('hashtags');
    if (!X.str(S.assunto) && !X.str(S.base)) { S.err = 'Escreva o assunto do post ou cole a legenda.'; X.refresh(); return; }
    const p = prof();
    let usadas = [];
    try { usadas = [...new Set(pecasDe('hashtags').slice(0, 5).flatMap(x => ((x.res || {}).conjunto || []).map(t => t && t.tag).filter(Boolean)))]; } catch (e) { }
    const prompt = [
      X.ctxPerfil({ semAprendizados: true, semGravacao: true }),
      kb('hashtags'),
      `═══ TAREFA: CONJUNTO DE HASHTAGS ═══
Nicho do perfil: ${p.nicho || '(não informado)'}
Público: ${p.publico || '(não informado)'}
Seguidores: ${p.seguidores || '(não informado)'}
Tags já usadas em posts recentes (troque as de nicho): ${usadas.join(' ') || 'nenhuma'}
Assunto do post: ${X.str(S.assunto, 600) || '(tire do texto)'}
${X.str(S.base) ? `Texto do post:\n"""\n${X.str(S.base, 5000)}\n"""` : ''}
Regras:
- "conjunto" com 3 a 5 tags: 2 a 3 de nicho, 1 a 2 médias, no máximo 1 ampla (só se encaixar).
- Perfil com menos de 10 mil seguidores: 3 de nicho, 1 média e nenhuma ampla.
- Toda tag descreve o post de verdade e está no idioma que o público pesquisa (português do Brasil). Nada popular e fora do assunto.
- Você não tem acesso ao Instagram e NÃO sabe quantos posts cada tag tem. Nunca escreva número de posts. Em "faixa" diga nicho, medio ou amplo pela especificidade; em "sinal", diga em uma linha por que acha isso (ex.: "junta assunto + público, só quem é do meio digitaria").
- "reserva" com 3 a 5 tags pra rotacionar em outros posts do mesmo tema.
- "evitar": tags genéricas, de isca (#follow4follow, #likeforlike) ou que atraem o público errado.`
    ].filter(Boolean).join('\n\n') + fimJSON(`{"conjunto": [{"tag": "#exemplo", "faixa": "nicho", "sinal": "...", "porque": "..."}], "reserva": [{"tag": "#outra", "faixa": "medio", "sinal": "...", "porque": "..."}], "evitar": [{"tag": "#ruim", "porque": "..."}], "comoConferir": "1 frase"}`);
    X.rodar(S, prompt, novo(S, parseHashtags), { tier: 'default' });
  });
  X.action('x-kc-hash-salvar', () => {
    const S = X.toolState('hashtags'); if (!S.res) return;
    salvarPeca(S, { tipo: 'hashtags', titulo: X.str(S.assunto, 80) || S.res.conjunto.map(t => t.tag).join(' ').slice(0, 80), form: { assunto: S.assunto, origem: S.origem }, res: S.res }, 'Hashtags salvas.');
  });
  X.action('x-kc-hash-devolver', () => {
    const S = X.toolState('hashtags'); if (!S.res) return;
    const tags = S.res.conjunto.map(t => t.tag);
    devolver(S, res => { res.legenda = trocarHashtags(res.legenda, tags.join(' ')).slice(0, 2200); if (Array.isArray(res.hashtags)) res.hashtags = tags.slice(); });
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
          <button type="button" class="btn" data-a="x-kc-hum-auditar">${ic('check', 'sm')} Conferir na hora (sem IA)</button>
          <button type="button" class="btn primary" data-a="x-kc-hum-gerar" ${desab(S)}>${ic('humano', 'sm')} Reescrever sem cara de IA</button>
        </div>
        <p class="kit-hint">Nenhuma reescrita garante passar em detector de IA. O objetivo é soar como você.</p>
      </section>`;
      let saida = X.h.erro(S.err);
      if (S.busy) saida = ocupado('Tirando os vícios do texto. Leva de 10 a 30 segundos.', 'humanizar');
      else if (S.res) saida += humanizarOut(S);
      // a conferência só aparece se ainda for do texto que está no campo
      else if (S.audit && S.audit.texto === S.texto) saida += auditOut(S.texto, S.tipo);
      else saida += X.h.vazio('A conferência e o texto limpo aparecem aqui.', '"Conferir na hora" dá a nota e os vícios sem IA. "Reescrever" devolve o texto limpo, a nota antes e depois e cada trecho trocado.');
      return `<div class="kit">${entrada}<section class="kit-out">${saida}</section></div>`;
    }
  });
  const notaHint = tipo => (tipo && tipo !== 'legenda' ? '<p class="kit-hint">As regras só de legenda (dobra dos 125, hashtags, limite de 2.200) não entram neste tipo de texto.</p>' : '');
  const auditOut = (texto, tipo) => {
    const a = auditarTipo(texto, tipo);
    return `<div class="card kit-sec"><div class="kit-row"><h3 class="grow">Nota sem IA</h3><span class="kit-score">${a.nota}<small>/100</small></span></div>
    ${notaHint(tipo)}${X.h.contagem(texto)}${dotList(a.itens)}</div>`;
  };
  function humanizarOut(S) {
    const r = S.res;
    const tipo = r.tipo || S.tipo;
    const antes = r.antes || auditarTipo('', tipo);
    const depois = auditarTipo(r.texto, tipo);
    return `<div class="card kit-sec">
        <div class="kit-row"><h3 class="grow">Antes × depois</h3>${r.leitura ? `<span class="tag ${r.leitura === 'soa humano' ? 'good' : r.leitura === 'misto' ? 'warn' : 'bad'}">Antes: ${esc(r.leitura)}</span>` : ''}</div>
        ${notaHint(tipo)}
        <div class="kc-notas"><div><div class="eyebrow">Antes</div><span class="kit-score">${antes.nota}<small>/100</small></span></div><div><div class="eyebrow">Depois</div><span class="kit-score">${depois.nota}<small>/100</small></span></div></div>
        <pre class="kit-pre">${esc(r.texto)}</pre>${X.h.contagem(r.texto)}
        <div class="kit-row">${podeDevolver(S) ? `<button type="button" class="btn sm primary" data-a="x-kc-hum-devolver">${ic('check', 'sm')} Devolver pra legenda</button>` : ''}
          <button type="button" class="btn sm" data-a="copiar-txt" data-txt="${esc(r.texto)}">${ic('copy', 'sm')} Copiar</button>
          <button type="button" class="btn sm ghost" data-a="x-kc-hum-usar">Usar como novo texto</button></div>
      </div>
      ${(r.pedir || []).length ? `<div class="card kit-sec"><h3>Pra soar mais seu, falta:</h3>${X.h.lista(r.pedir)}</div>` : ''}
      ${r.mudancas.length ? `<div class="card kit-sec"><h3>O que mudou</h3><div class="kc-mud">${r.mudancas.map(m => `<div class="it">${m.antes ? `<del>${esc(m.antes)}</del>` : ''}${m.antes && m.depois ? ' → ' : ''}${m.depois ? `<ins>${esc(m.depois)}</ins>` : ''}${m.porque ? `<div class="faint">${esc(m.porque)}</div>` : ''}</div>`).join('')}</div></div>` : '<div class="card kit-sec"><p class="kit-hint">Nenhum vício encontrado: o texto voltou igual.</p></div>'}
      ${depois.itens.some(i => i.nivel !== 'good') ? `<div class="card kit-sec"><h3>Ainda vale olhar</h3>${dotList(depois.itens.filter(i => i.nivel !== 'good'))}</div>` : ''}`;
  }
  X.action('x-kc-hum-auditar', () => {
    const S = X.toolState('humanizar');
    if (!X.str(S.texto)) { S.err = 'Cole o texto que você quer conferir.'; X.refresh(); return; }
    S.err = ''; S.res = null;
    S.audit = { texto: S.texto };
    X.refresh();
  });
  X.action('x-kc-hum-gerar', () => {
    const S = X.toolState('humanizar');
    const original = X.str(S.texto, 6000);
    if (!original) { S.err = 'Cole o texto que você quer reescrever.'; X.refresh(); return; }
    const voz = ((A().st.memory || {}).voz) || null;
    const vozTxt = voz ? `═══ VOZ DO CRIADOR (escreva como ele) ═══\n${voz.resumo || ''}${(voz.tracos || []).length ? '\nTraços: ' + voz.tracos.join('; ') : ''}${(voz.bordoes || []).length ? '\nExpressões dele: ' + voz.bordoes.join('; ') : ''}${(voz.evitar || []).length ? '\nEle evita: ' + voz.evitar.join('; ') : ''}` : '';
    const tipo = S.tipo;
    const tipoNome = { legenda: 'legenda de Instagram', slide: 'texto de slide de carrossel (curto, legível em 2 segundos)', roteiro: 'roteiro falado de Reel', bio: 'bio de Instagram (até 150 caracteres)' }[tipo] || 'legenda de Instagram';
    const prompt = [
      X.ctxPerfil({ semAprendizados: true, semGravacao: true }),
      kb('humanizarRegras'), vozTxt,
      `═══ TAREFA: TIRAR A CARA DE IA ═══
Tipo de texto: ${tipoNome}.
Regras:
- Mantenha o sentido, os fatos, os números, as marcações [CONFERIR]/[PREENCHER], as hashtags e a assinatura exatamente como estão.
- Não "melhore" o conteúdo nem acrescente ideias: só tire os vícios (palavra de IA, revelação forçada, "não é X, é Y", trio empilhado, frases picadas pra efeito, sinceridade encenada, fileira de emoji, travessão em excesso, isca de engajamento).
- Corrija na proporção do problema: texto limpo recebe 0 a 3 toques; se não achar vício, devolva o texto igual e "mudancas" vazio. Não invente edição pra justificar.
- Travessão: só o que passa de 1 a cada 100 palavras, e vira vírgula, dois-pontos ou quebra de linha, nunca ponto. Não zere os travessões, trios e emojis que são da voz do criador.
- Não insira número, nome, história nem [PREENCHER] no texto; se faltar uma marca humana (número real, caso, opinião), peça em "pedir".
- Em "leitura", diga como o texto ORIGINAL soa: "soa humano", "misto" ou "soa IA".
- Não prometa nem tente enganar detector de IA.
- Em "mudancas", liste cada trecho trocado e o vício que saiu.
Texto:
"""
${original}
"""`
    ].filter(Boolean).join('\n\n') + fimJSON(`{"texto": "texto reescrito", "mudancas": [{"antes": "trecho original", "depois": "trecho novo", "porque": "vício removido"}], "pedir": ["um número real com referência: quanto, de quem, quando"], "leitura": "soa humano|misto|soa IA"}`);
    const antes = auditarTipo(original, tipo);
    S.audit = null;
    X.rodar(S, prompt, r => { const o = parseHumanizar(r); if (o) { o.antes = antes; o.tipo = tipo; } return o; }, { tier: 'default' });
  });
  X.action('x-kc-hum-usar', () => {
    const S = X.toolState('humanizar'); if (!S.res) return;
    S.texto = S.res.texto; S.res = null; S.audit = null; S.err = '';
    X.refresh();
  });
  X.action('x-kc-hum-devolver', () => {
    const S = X.toolState('humanizar'); if (!S.res) return;
    const novoTexto = S.res.texto;
    devolver(S, res => { res.legenda = novoTexto.slice(0, 2200); });
  });
})();
