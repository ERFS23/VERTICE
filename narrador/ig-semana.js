/* Narrador de Impacto — tela Semana (plano de postagens da semana)
   Adaptação da skill ig-content-planner: uma semana com fio condutor (série),
   cada post com transformação concreta, gancho escrito e ponte pro próximo. */
(function () {
  const X = window.NDX;
  if (!X) return;
  const esc = X.esc;
  const ic = (n, c) => X.ic(n, c);
  const A = () => window.NDA;

  const DIAS = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'];
  const DIAS_CURTO = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const TIPOS = { reel: 'Reel', carrossel: 'Carrossel', imagem: 'Imagem' };
  const OBJS = [['seguidores', 'Seguidores'], ['salvamentos', 'Salvamentos'], ['compartilhamentos', 'Compartilhamentos'], ['comentarios', 'Comentários']];
  const OBJ_NOME = Object.fromEntries(OBJS);
  const OBJ_ESTUDIO = { salvamentos: 'salvamento', compartilhamentos: 'compartilhamento', comentarios: 'comentario', seguidores: 'seguidores' };
  const FORM_CARROSSEL = ['lista', 'antesdepois', 'mito', 'framework'];

  /* ---------- datas (sempre horário local) ---------- */
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const deIso = s => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '')); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
  const somaDias = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const ddmm = d => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
  // próxima segunda (ou hoje, se hoje for segunda)
  const proximaSegunda = hoje => {
    const h = hoje || new Date();
    const d = new Date(h.getFullYear(), h.getMonth(), h.getDate());
    const dow = d.getDay(); // 0 dom, 1 seg
    return somaDias(d, dow === 1 ? 0 : (8 - dow) % 7 || 7);
  };
  const semAcento = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  // "Terça-feira", "terca", "TER", "3" -> 1
  const diaIdx = v => {
    if (typeof v === 'number' && v >= 0 && v <= 6) return v;
    const s = semAcento(v);
    if (!s) return -1;
    const pref = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
    for (let i = 0; i < 7; i++) if (s.startsWith(pref[i])) return i;
    const en = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    for (let i = 0; i < 7; i++) if (s.startsWith(en[i])) return i;
    const m = /^dia\s*(\d)$|^(\d)$/.exec(s);
    if (m) { const n = +(m[1] || m[2]); if (n >= 1 && n <= 7) return n - 1; }
    return -1;
  };
  const dataDoDia = (inicio, idx) => { const d = deIso(inicio); return d ? somaDias(d, idx) : null; };
  const intervalo = inicio => { const d = deIso(inicio); return d ? `${ddmm(d)} a ${ddmm(somaDias(d, 6))}` : ''; };

  /* ---------- estado ---------- */
  const formPadrao = () => {
    const N = A() && A().N;
    return {
      foco: '', objetivo: 'seguidores',
      pilares: N ? N.PILARES.filter(p => !p.pendente).map(p => p.id) : [],
      posts: 5, formatos: ['reel', 'carrossel'], stories: true,
      inicio: iso(proximaSegunda()), oferta: '', obs: ''
    };
  };
  const W = () => {
    if (!X.state.semana) X.state.semana = { form: formPadrao(), planoId: null, busy: false, err: '', ctl: null, iniciado: false, cards: {}, delArm: null };
    return X.state.semana;
  };
  X.onReset.push(() => { delete X.state.semana; });
  const planos = () => ((A().st.planos) || []).filter(p => p && p.tipo === 'semana');
  const planoAberto = () => { const S = W(); return S.planoId ? planos().find(p => p.id === S.planoId) || null : null; };

  /* ---------- normalizador ---------- */
  const K = () => X.K || {};
  const formulaOk = id => { const f = K().formula; return !!(id && typeof f === 'function' && f(id)); };
  const pilarOk = id => { const N = A() && A().N; return !!(id && N && N.PILARES.some(p => p.id === id)); };
  const formatoOk = id => { const E = A() && A().E; return !!(id && E && E.formato(id)); };
  const normTipo = t => { const s = semAcento(t); if (/reel|video/.test(s)) return 'reel'; if (/carross|carousel/.test(s)) return 'carrossel'; if (/imag|foto|post|single/.test(s)) return 'imagem'; return ''; };
  const normObj = o => { const s = semAcento(o); if (s.startsWith('seg')) return 'seguidores'; if (s.startsWith('salv')) return 'salvamentos'; if (s.startsWith('compart') || s.startsWith('envio')) return 'compartilhamentos'; if (s.startsWith('coment')) return 'comentarios'; return ''; };
  const normHora = h => { const m = /(\d{1,2})\s*[:h]\s*(\d{2})?/.exec(String(h || '')); if (!m) return ''; const H = +m[1], M = +(m[2] || 0); return H < 24 && M < 60 ? `${pad(H)}:${pad(M)}` : ''; };

  const normItem = (x, objPadrao) => {
    if (!x || typeof x !== 'object') return null;
    const gancho = X.str(x.gancho, 300);
    const d = diaIdx(x.dia);
    if (!gancho || d < 0) return null;
    const tipo = normTipo(x.tipo) || 'reel';
    return {
      d, tipo,
      pilar: pilarOk(x.pilar) ? x.pilar : '',
      objetivo: normObj(x.objetivo) || objPadrao || 'salvamentos',
      formula: formulaOk(x.formula) ? x.formula : '',
      formato: tipo === 'reel' && formatoOk(x.formato) ? x.formato : '',
      horario: normHora(x.horario),
      titulo: X.str(x.titulo, 90) || gancho.slice(0, 60),
      gancho,
      angulo: X.str(x.angulo, 400),
      entrega: X.str(x.entrega, 300),
      ponte: X.str(x.ponte, 300),
      stories: X.str(x.stories, 300)
    };
  };
  const normalizar = (r, objPadrao) => {
    if (!r || typeof r !== 'object') return null;
    const brutos = Array.isArray(r.dias) ? r.dias : Array.isArray(r.posts) ? r.posts : [];
    const porDia = {};
    const itens = [];
    brutos.map(x => normItem(x, objPadrao)).filter(Boolean).sort((a, b) => a.d - b.d).forEach(it => {
      porDia[it.d] = (porDia[it.d] || 0) + 1;
      if (porDia[it.d] <= 2) itens.push(it);
    });
    const dias = itens.slice(0, 7);
    if (!dias.length) return null;
    return {
      fio: X.str(r.fio, 300), porQueSeguir: X.str(r.porQueSeguir, 400), meta: X.str(r.meta, 300),
      dias, storiesSemana: X.str(r.storiesSemana, 500), equilibrio: X.str(r.equilibrio, 300),
      avisos: X.arr(r.avisos, 6, y => X.str(y, 240))
    };
  };

  /* ---------- prompt ---------- */
  const EXEMPLO = `{"fio": "a série ou arco da semana em 1 frase", "porQueSeguir": "o que quem acompanhar a semana inteira ganha até domingo", "meta": "meta da semana em salvamentos + envios, 1 frase", "dias": [{"dia": "segunda", "tipo": "reel|carrossel|imagem", "pilar": "<id>", "objetivo": "seguidores|salvamentos|compartilhamentos|comentarios", "formula": "<id da fórmula>", "formato": "<formatoId, só reel>", "horario": "12:30", "titulo": "título interno curto", "gancho": "frase completa", "angulo": "1–2 frases", "entrega": "o que a pessoa leva pronto", "ponte": "como este post puxa o próximo", "stories": "o que vai nos stories do dia (enquete, caixinha, bastidor)"}], "storiesSemana": "cadência dos stories", "equilibrio": "leitura de 1 frase do equilíbrio entre os 4 objetivos", "avisos": ["o que conferir antes de postar"]}`;

  const formTexto = f => {
    const N = A().N;
    const pil = (f.pilares || []).map(id => (N.PILARES.find(p => p.id === id) || {}).nome || id).join(', ');
    return [
      `Foco da semana (o que a pessoa deve aprender ou resolver): ${f.foco || '(livre: escolha o tema mais útil pro público agora)'}`,
      `Objetivo principal: ${OBJ_NOME[f.objetivo] || f.objetivo}`,
      `Pilares a incluir: ${pil || 'todos'} (use estes ids: ${(f.pilares || []).join(', ') || 'qualquer'})`,
      `Posts no feed: ${f.posts} na semana`,
      `Formatos disponíveis: ${(f.formatos || []).map(t => TIPOS[t]).join(', ') || 'Reels'}`,
      `Stories diários: ${f.stories ? 'sim' : 'não'}`,
      `Início da semana: segunda-feira ${f.inicio}`,
      f.oferta ? `Oferta ou lançamento da semana: ${f.oferta}` : 'Oferta ou lançamento: nenhuma (não force venda)',
      f.obs ? `Observações do criador: ${f.obs}` : ''
    ].filter(Boolean).join('\n');
  };

  const base = () => {
    const k = K();
    return [
      X.ctxPerfil(),
      k.plano || '', k.sinais || '',
      typeof k.blocoFormulas === 'function' ? k.blocoFormulas() : '',
      `═══ DESEMPENHO REAL DO PERFIL ═══\n${X.desempenho()}`,
      `═══ FORMATOS DE REEL DO APP (use o id em "formato") ═══\n${X.formatosLista()}`,
      `═══ PILARES (use o id em "pilar") ═══\n${X.pilaresLista()}`
    ].filter(Boolean).join('\n\n');
  };

  const REGRAS = `═══ REGRAS DO PLANO ═══
- A semana é uma SÉRIE com fio condutor: quem acompanhar de segunda a domingo termina com um problema resolvido de verdade. Diga em "porQueSeguir" o que essa pessoa ganha até domingo.
- Cada post entrega uma transformação concreta: em "entrega", o que a pessoa leva PRONTO (lista, modelo, frase, checklist, decisão), aplicável hoje. Nada de conteúdo genérico ou "dicas" vagas.
- Cada post puxa o próximo ("ponte"): uma pergunta aberta, a parte 2, o erro que vem depois. O último post fecha o arco e diz o que vem na próxima semana.
- Um objetivo principal por post. Equilibre os 4 objetivos (seguidores, salvamentos, compartilhamentos, comentários), com mais peso no objetivo principal informado.
- Cada post usa uma fórmula de gancho (id da lista de fórmulas) e traz o gancho ESCRITO por extenso, no estilo e no tom do criador, como ele falaria. Sem inventar número, caso, história ou resultado: quando depender de dado do criador, escreva [PREENCHER: o quê].
- Formatos e ganchos que já funcionaram no perfil (desempenho real acima) têm prioridade.
- Nunca repita o assunto dos roteiros recentes.
- Reels levam o id do formato do app em "formato". Carrossel e imagem deixam "formato" vazio.
- Use só os tipos de post disponíveis e só os pilares pedidos.
- Horário sugerido em HH:MM, horário de Brasília. Avise em "avisos" que o horário deve ser conferido nos Insights do perfil.
- Se houver oferta, no máximo 1 ou 2 posts falam dela, e só depois de entregar valor.
- Dia em português ("segunda", "terça", ..., "domingo"). Até 2 posts no mesmo dia, só se fizer sentido.`;

  const promptPlano = f => [
    base(), REGRAS,
    `═══ PEDIDO DO CRIADOR ═══\n${formTexto(f)}`,
    `Monte o plano com exatamente ${f.posts} posts no feed${f.stories ? ' e stories em todos os dias (no campo "stories" de cada post e em "storiesSemana")' : ''}.\n\nResponda só com JSON, sem texto antes ou depois, neste formato exato:\n${EXEMPLO}`
  ].join('\n\n');

  const resumoPlano = res => res.dias.map(it => `${DIAS[it.d]} · ${it.tipo} · ${it.titulo}: "${it.gancho}" (entrega: ${it.entrega})`).join('\n');

  const promptRefazer = (P, i) => {
    const it = P.res.dias[i];
    const tipos = (P.form && P.form.formatos) || ['reel', 'carrossel'];
    return [
      base(), REGRAS,
      `═══ PLANO ATUAL DA SEMANA ═══\nFio: ${P.res.fio}\nPor que seguir: ${P.res.porQueSeguir}\n${resumoPlano(P.res)}`,
      `═══ PEDIDO DO CRIADOR ═══\n${formTexto(P.form || {})}`,
      `Refaça SÓ o post de ${DIAS[it.d]} ("${it.titulo}"). Mesmo dia, de preferência o mesmo tipo (${it.tipo}); se outro tipo entre ${tipos.join(', ')} servir melhor à série, pode trocar. Tem que ser DIFERENTE do atual (outro ângulo e outro gancho), manter o fio condutor e continuar ligando o post anterior ao próximo.\n\nResponda só com JSON, sem texto antes ou depois, com UM item neste formato exato:\n{"dia": "${DIAS[it.d]}", "tipo": "reel|carrossel|imagem", "pilar": "<id>", "objetivo": "seguidores|salvamentos|compartilhamentos|comentarios", "formula": "<id da fórmula>", "formato": "<formatoId, só reel>", "horario": "12:30", "titulo": "título interno curto", "gancho": "frase completa", "angulo": "1–2 frases", "entrega": "o que a pessoa leva pronto", "ponte": "como este post puxa o próximo", "stories": "o que vai nos stories do dia"}`
    ].join('\n\n');
  };

  /* ---------- CSS ---------- */
  X.css(`
.wk{display:grid; grid-template-columns:minmax(300px,380px) minmax(0,1fr); gap:24px; align-items:start}
.wk.top{grid-template-columns:minmax(0,1fr)}
.wk.top .kit-in{position:static}
.wk-board{min-width:0; display:flex; flex-direction:column; gap:16px}
.wk-head{padding:18px; display:flex; flex-direction:column; gap:10px}
.wk-head h3{margin:0; font-family:var(--f-disp); font-weight:800; font-size:22px; text-transform:uppercase; letter-spacing:.03em; line-height:1.05}
.wk-head p{margin:0; font-size:14px; line-height:1.5; color:var(--ink2); overflow-wrap:anywhere}
.wk-head p b{color:var(--ink)}
.wk-grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(260px,1fr)); gap:14px}
.wk-card{min-width:0; padding:16px; display:flex; flex-direction:column; gap:9px; border-radius:16px}
.wk-card.feito{opacity:.72}
.wk-card .top{display:flex; gap:6px; flex-wrap:wrap; align-items:center}
.wk-card .dia{font-family:var(--f-mono); font-size:12px; color:var(--amber-text); letter-spacing:.06em; text-transform:uppercase}
.wk-card h4{margin:0; font-size:15.5px; line-height:1.3; overflow-wrap:anywhere}
.wk-card p{margin:0; font-size:13.5px; line-height:1.5; color:var(--ink2); overflow-wrap:anywhere}
.wk-card p b{color:var(--ink); font-weight:600}
.wk-card q.mq{overflow-wrap:anywhere}
.wk-card .acts{display:flex; gap:6px; flex-wrap:wrap; margin-top:4px}
.wk-pdot{width:9px; height:9px; border-radius:50%; display:inline-block; background:var(--ink3); flex-shrink:0}
.wk-empty{display:grid; grid-template-columns:repeat(7,minmax(0,1fr)); gap:6px}
.wk-empty div{border:1px dashed var(--line2); border-radius:10px; padding:10px 6px; text-align:center; font-family:var(--f-mono); font-size:11px; color:var(--ink3)}
.wk-hist .rec-row{grid-template-columns:minmax(0,1fr) auto}
.wk-hist .rec-row button.lnk{all:unset; cursor:pointer; min-width:0; overflow-wrap:anywhere}
.wk-hist .rec-row button.lnk:hover{color:var(--amber-text)}
@media (max-width:1180px){ .wk{grid-template-columns:minmax(0,1fr)} .wk .kit-in{position:static} }
@media (max-width:560px){ .wk-grid{grid-template-columns:minmax(0,1fr)} .wk-empty{grid-template-columns:repeat(4,minmax(0,1fr))} }
`);

  /* ---------- HTML ---------- */
  const pilarNome = id => { const p = A().N.PILARES.find(x => x.id === id); return p ? p.nome : ''; };
  const formulaNome = id => { const f = formulaOk(id) ? K().formula(id) : null; return f ? f.nome : ''; };

  const formHTML = (S, compacto) => {
    const N = A().N;
    const ia = X.prontoIA();
    return `<aside class="card kit-in">
      <div><div class="eyebrow">Plano da semana</div><h2>${compacto ? 'Novo plano' : 'Monte a semana'}</h2></div>
      <p class="lead">Uma semana com fio condutor: cada post resolve um pedaço do mesmo problema e puxa o próximo. Quem acompanha termina a semana com algo resolvido, e por isso segue.</p>
      ${X.h.campo({ path: 'semana.form.foco', label: 'Foco da semana', tipo: 'textarea', rows: 3, placeholder: 'O que você quer que a pessoa aprenda ou resolva nesta semana', help: 'Quanto mais concreto, melhor o plano. Em branco, a IA escolhe o tema mais útil agora.' })}
      <div class="field"><span>Objetivo principal</span>${X.h.seg('semana.form.objetivo', OBJS)}</div>
      <div class="field"><span>Pilares a incluir</span>${X.h.multi('semana.form.pilares', N.PILARES.map(p => [p.id, p.nome]))}</div>
      <div class="field"><span>Posts no feed na semana</span>${X.h.seg('semana.form.posts', [3, 4, 5, 6, 7].map(n => [String(n), String(n)]), String(S.form.posts))}</div>
      <div class="field"><span>Formatos que você consegue fazer</span>${X.h.multi('semana.form.formatos', [['reel', 'Reels'], ['carrossel', 'Carrossel'], ['imagem', 'Imagem']])}</div>
      ${X.h.campo({ path: 'semana.form.stories', label: 'Stories todos os dias', tipo: 'check' })}
      ${X.h.campo({ path: 'semana.form.inicio', label: 'Início da semana (segunda-feira)', tipo: 'date' })}
      ${X.h.campo({ path: 'semana.form.oferta', label: 'Oferta ou lançamento da semana (opcional)', placeholder: 'Ex.: abertura de turma na quinta' })}
      ${X.h.campo({ path: 'semana.form.obs', label: 'Observações (opcional)', tipo: 'textarea', rows: 2, placeholder: 'Ex.: quarta não consigo gravar; quero testar carrossel' })}
      ${X.h.semIA()}
      ${S.busy ? X.h.ocupado('Montando a semana: fio condutor, ganchos e o que cada post entrega. Leva de 20 segundos a 1 minuto.', 'x-wk-parar')
        : `<button type="button" class="btn primary" data-a="x-wk-gerar" ${ia ? '' : 'disabled'}>${ic('spark', 'sm')} Gerar plano da semana</button>`}
      ${X.h.erro(S.err)}
      ${histHTML(S)}
    </aside>`;
  };

  const histHTML = S => {
    const ps = planos().slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    if (!ps.length) return '';
    return `<div class="kit-sec"><div class="eyebrow">Planos salvos</div><div class="wk-hist">${ps.map(p => {
      const armed = S.delArm && S.delArm.id === p.id && Date.now() - S.delArm.t < 5000;
      const feitos = Object.values(p.feitos || {}).filter(Boolean).length;
      return `<div class="rec-row"><button type="button" class="lnk" data-a="x-wk-abrir" data-id="${esc(p.id)}">${p.id === S.planoId ? '<b>' : ''}Semana de ${esc(intervalo(p.inicio))}${p.foco ? ' · ' + esc(p.foco.slice(0, 60)) : ''}${p.id === S.planoId ? '</b>' : ''}<small>${(p.res && p.res.dias || []).length} posts · ${feitos} postado${feitos === 1 ? '' : 's'}</small></button>
        <button type="button" class="btn xs ${armed ? 'primary' : 'ghost danger'}" data-a="x-wk-del" data-id="${esc(p.id)}">${ic('trash', 'sm')} ${armed ? 'Confirmar' : 'Apagar'}</button></div>`;
    }).join('')}</div></div>`;
  };

  const vazioHTML = () => `<div class="card wk-head">
      <div class="eyebrow">O que vai aparecer aqui</div>
      <h3>A sua semana, dia a dia</h3>
      <div class="wk-empty">${DIAS_CURTO.map(d => `<div>${d}</div>`).join('')}</div>
      <ul class="list">
        <li>Um fio condutor: a série que liga os posts e faz a pessoa querer ver o próximo.</li>
        <li>O que quem acompanhar a semana inteira ganha até domingo, e a meta de salvamentos e envios.</li>
        <li>Cada post com dia, horário, formato, objetivo, fórmula e o gancho já escrito no seu tom.</li>
        <li>O que a pessoa leva pronto de cada post, e como ele puxa o próximo.</li>
        <li>Botões pra roteirizar o Reel no Estúdio, montar o carrossel e escrever a legenda no Kit.</li>
      </ul>
      <p class="kit-hint">Preencha o foco ao lado e toque em Gerar plano da semana.</p>
    </div>`;

  const cardHTML = (P, it, i) => {
    const S = W();
    const C = S.cards[P.id + ':' + i] || {};
    const d = dataDoDia(P.inicio, it.d);
    const feito = !!(P.feitos || {})[i];
    const fn = formulaNome(it.formula);
    const btns = [];
    if (it.tipo === 'reel') btns.push(`<button type="button" class="btn xs primary" data-a="x-wk-estudio" data-i="${i}">${ic('estudio', 'sm')} Roteirizar no Estúdio</button>`);
    if (it.tipo === 'carrossel') btns.push(`<button type="button" class="btn xs primary" data-a="x-wk-carrossel" data-i="${i}">${ic('carrossel', 'sm')} Montar carrossel</button>`);
    btns.push(`<button type="button" class="btn xs" data-a="x-wk-legenda" data-i="${i}">${ic('legenda', 'sm')} Escrever legenda</button>`);
    btns.push(C.busy ? `<button type="button" class="btn xs" data-a="x-wk-refazer-parar" data-i="${i}">${ic('stop', 'sm')} Refazendo… parar</button>`
      : `<button type="button" class="btn xs ghost" data-a="x-wk-refazer" data-i="${i}" ${X.prontoIA() ? '' : 'disabled'}>${ic('shuffle', 'sm')} Refazer este post</button>`);
    return `<article class="card wk-card ${feito ? 'feito' : ''}">
      <div class="top"><span class="dia">${esc(DIAS_CURTO[it.d])} ${d ? ddmm(d) : ''}</span>${it.horario ? `<span class="tag mono">${esc(it.horario)}</span>` : ''}<span class="tag">${esc(TIPOS[it.tipo])}</span><span class="tag amber">${esc(OBJ_NOME[it.objetivo] || '')}</span></div>
      <div class="top">${it.pilar ? `<span class="wk-pdot" style="background:var(--p-${esc(it.pilar)})"></span><span class="faint" style="font-size:12.5px">${esc(pilarNome(it.pilar))}</span>` : ''}${fn ? `<span class="faint" style="font-size:12.5px">· ${esc(fn)}</span>` : ''}${it.formato ? `<span class="faint" style="font-size:12.5px">· ${esc(A().fmtName(it.formato))}</span>` : ''}</div>
      <h4>${esc(it.titulo)}</h4>
      <q class="mq">${A().hl(it.gancho)}</q>
      ${it.angulo ? `<p>${esc(it.angulo)}</p>` : ''}
      ${it.entrega ? `<p><b>Leva pronto:</b> ${esc(it.entrega)}</p>` : ''}
      ${it.ponte ? `<p><b>Puxa o próximo:</b> ${esc(it.ponte)}</p>` : ''}
      ${it.stories ? `<p><b>Stories:</b> ${esc(it.stories)}</p>` : ''}
      <button type="button" class="chip ${feito ? 'on' : ''}" style="align-self:flex-start" data-a="x-wk-feito" data-i="${i}" aria-pressed="${feito}">${ic(feito ? 'check' : 'plus', 'sm')} ${feito ? 'Postado' : 'Marcar como postado'}</button>
      ${X.h.erro(C.err)}
      <div class="acts">${btns.join('')}</div>
    </article>`;
  };

  const quadroHTML = P => {
    const r = P.res;
    const cont = {}; OBJS.forEach(([k]) => { cont[k] = 0; });
    r.dias.forEach(it => { cont[it.objetivo] = (cont[it.objetivo] || 0) + 1; });
    return `<div class="card wk-head">
        <div class="kit-row"><div class="eyebrow grow">Semana de ${esc(intervalo(P.inicio))} · ${r.dias.length} posts</div>
          <button type="button" class="btn xs" data-a="x-wk-copiar">${ic('copy', 'sm')} Copiar plano</button>
          <button type="button" class="btn xs ghost" data-a="x-wk-novo">${ic('plus', 'sm')} Novo plano</button></div>
        <h3>${esc(r.fio || P.foco || 'Plano da semana')}</h3>
        ${r.porQueSeguir ? `<p><b>Por que seguir:</b> ${esc(r.porQueSeguir)}</p>` : ''}
        ${r.meta ? `<p><b>Meta da semana:</b> ${esc(r.meta)}</p>` : ''}
        <div class="rates">${OBJS.map(([k, n]) => `<span class="tag mono ${k === P.objetivo ? 'amber' : ''}">${esc(n)} ${cont[k]}</span>`).join('')}</div>
        ${r.equilibrio ? `<p>${esc(r.equilibrio)}</p>` : ''}
        ${r.storiesSemana ? `<p><b>Stories:</b> ${esc(r.storiesSemana)}</p>` : ''}
      </div>
      <div class="wk-grid">${r.dias.map((it, i) => cardHTML(P, it, i)).join('')}</div>
      ${r.avisos.length ? `<div class="card wk-head"><div class="eyebrow">Antes de postar, confira</div>${X.h.lista(r.avisos, 'warnlist')}</div>` : ''}`;
  };

  const textoPlano = P => {
    const r = P.res;
    const L = [`PLANO DA SEMANA · ${intervalo(P.inicio)}`, P.foco ? `Foco: ${P.foco}` : '', r.fio ? `Fio condutor: ${r.fio}` : '', r.porQueSeguir ? `Por que seguir: ${r.porQueSeguir}` : '', r.meta ? `Meta: ${r.meta}` : '', ''];
    r.dias.forEach((it, i) => {
      const d = dataDoDia(P.inicio, it.d);
      L.push(`${DIAS[it.d].toUpperCase()} ${d ? ddmm(d) : ''}${it.horario ? ' · ' + it.horario : ''} · ${TIPOS[it.tipo]} · ${OBJ_NOME[it.objetivo] || ''}${(P.feitos || {})[i] ? ' · POSTADO' : ''}`);
      L.push(`${it.titulo}`);
      L.push(`Gancho: ${it.gancho}`);
      if (it.angulo) L.push(`Ângulo: ${it.angulo}`);
      if (it.entrega) L.push(`Leva pronto: ${it.entrega}`);
      if (it.ponte) L.push(`Puxa o próximo: ${it.ponte}`);
      if (it.stories) L.push(`Stories: ${it.stories}`);
      L.push('');
    });
    if (r.storiesSemana) L.push(`Stories da semana: ${r.storiesSemana}`);
    if (r.equilibrio) L.push(`Equilíbrio: ${r.equilibrio}`);
    if (r.avisos.length) L.push('Conferir:\n' + r.avisos.map(a => '- ' + a).join('\n'));
    return L.filter((x, i, a) => !(x === '' && a[i - 1] === '')).join('\n').trim();
  };

  /* ---------- tela ---------- */
  X.view('semana', {
    nome: 'Semana', after: 'estudio',
    count: () => (((A() && A().st.planos) || []).length || null),
    render() {
      const S = W();
      if (!S.iniciado) {
        S.iniciado = true;
        const ps = planos().slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        if (ps.length && !S.planoId) S.planoId = ps[0].id;
      }
      const P = planoAberto();
      if (S.planoId && !P) S.planoId = null;
      return `<div class="vh"><div><div class="eyebrow">Plano de postagens</div><h1>Sua <em>semana</em></h1>
        <p>Uma semana em série: cada post entrega algo pronto pra usar e puxa o próximo, e quem acompanha percebe que seguir o perfil vale a pena.</p></div></div>
        <div class="wk ${P ? 'top' : ''}">
          ${P ? '' : formHTML(S, false)}
          <section class="wk-board">${P ? quadroHTML(P) + `<details class="card" style="padding:14px 18px"><summary class="eyebrow" style="cursor:pointer">Gerar outro plano ou abrir um salvo</summary><div style="margin-top:12px">${formHTML(S, true)}</div></details>` : vazioHTML()}</section>
        </div>`;
    }
  });

  /* ---------- ações ---------- */
  X.action('x-wk-gerar', async () => {
    const S = W();
    if (S.busy || !X.prontoIA()) return;
    const f = S.form;
    f.posts = X.num(f.posts, 3, 7) || 5;
    if (!deIso(f.inicio)) f.inicio = iso(proximaSegunda());
    if (!(f.formatos || []).length) f.formatos = ['reel'];
    S.busy = true; S.err = ''; S.ctl = new AbortController(); X.refresh();
    try {
      const r = await X.ia(promptPlano(f), { tier: 'complex', signal: S.ctl.signal });
      const res = normalizar(r, f.objetivo);
      if (!res) throw { msg: 'A resposta veio sem posts válidos. Toque em Gerar de novo.' };
      const plano = X.salvar('planos', { tipo: 'semana', inicio: f.inicio, foco: X.str(f.foco, 300), objetivo: f.objetivo, pilares: (f.pilares || []).slice(), form: JSON.parse(JSON.stringify(f)), res, feitos: {} });
      S.planoId = plano && plano.id;
      A().toast('Plano da semana salvo.', 'good');
    } catch (e) {
      if (!(e && e.code === 'cancelled')) S.err = (e && e.msg) || 'Não deu certo agora. Tente de novo.';
    } finally { S.busy = false; S.ctl = null; X.refresh(); }
  });
  X.action('x-wk-parar', () => X.parar(W()));
  X.action('x-wk-abrir', el => { W().planoId = el.dataset.id; X.refresh(); window.scrollTo(0, 0); });
  X.action('x-wk-novo', () => { W().planoId = null; X.refresh(); window.scrollTo(0, 0); });
  X.action('x-wk-del', el => {
    const S = W(), id = el.dataset.id;
    if (!(S.delArm && S.delArm.id === id && Date.now() - S.delArm.t < 5000)) { S.delArm = { id, t: Date.now() }; X.refresh(); return; }
    S.delArm = null;
    X.apagar('planos', id);
    if (S.planoId === id) S.planoId = null;
    A().toast('Plano apagado.'); X.refresh();
  });
  X.action('x-wk-copiar', () => { const P = planoAberto(); if (P) A().copy(textoPlano(P), 'Plano'); });
  const item = el => { const P = planoAberto(); const i = +el.dataset.i; return P && P.res.dias[i] ? { P, i, it: P.res.dias[i] } : null; };
  X.action('x-wk-feito', el => {
    const o = item(el); if (!o) return;
    o.P.feitos = o.P.feitos || {};
    o.P.feitos[o.i] = !o.P.feitos[o.i];
    X.salvar('planos', o.P); X.refresh();
  });
  X.action('x-wk-estudio', el => {
    const o = item(el); if (!o) return;
    const prox = o.P.res.dias[o.i + 1];
    X.paraEstudio({
      assunto: [o.it.titulo, o.it.angulo, o.it.entrega ? 'Leva pronto: ' + o.it.entrega : ''].filter(Boolean).join('. '),
      gancho: o.it.gancho, formatoId: o.it.formato, objetivo: OBJ_ESTUDIO[o.it.objetivo],
      proximo: prox ? prox.titulo : '', obs: 'Plano da semana: ' + (o.P.res.fio || o.P.foco || ''),
      why: `Post de ${DIAS[o.it.d]} do plano da semana.`
    });
  });
  X.action('x-wk-carrossel', el => {
    const o = item(el); if (!o) return;
    X.abrirFerramenta('carrossel', { tema: o.it.titulo + (o.it.angulo ? ' — ' + o.it.angulo : ''), objetivo: o.it.objetivo, formula: FORM_CARROSSEL.includes(o.it.formula) ? o.it.formula : 'auto', gancho: o.it.gancho, slides: 7, base: '', origem: 'Plano da semana · ' + DIAS[o.it.d] });
  });
  X.action('x-wk-legenda', el => {
    const o = item(el); if (!o) return;
    X.abrirFerramenta('legenda', { assunto: o.it.titulo + (o.it.entrega ? ' — ' + o.it.entrega : ''), tipo: o.it.tipo, objetivo: o.it.objetivo, gancho: o.it.gancho, origem: 'Plano da semana · ' + DIAS[o.it.d] });
  });
  X.action('x-wk-refazer', async el => {
    const o = item(el); if (!o || !X.prontoIA()) return;
    const S = W(), key = o.P.id + ':' + o.i;
    const C = S.cards[key] = { busy: true, err: '', ctl: new AbortController() };
    X.refresh();
    try {
      let r = await X.ia(promptRefazer(o.P, o.i), { tier: 'default', signal: C.ctl.signal });
      if (r && Array.isArray(r.dias)) r = r.dias[0];
      const novo = normItem(r, o.it.objetivo);
      if (!novo) throw { msg: 'A resposta veio sem um post válido. Tente de novo.' };
      novo.d = o.it.d;
      o.P.res.dias[o.i] = novo;
      if (o.P.feitos) delete o.P.feitos[o.i];
      X.salvar('planos', o.P);
      A().toast('Post refeito.', 'good');
    } catch (e) {
      if (!(e && e.code === 'cancelled')) C.err = (e && e.msg) || 'Não deu certo agora. Tente de novo.';
    } finally { C.busy = false; C.ctl = null; X.refresh(); }
  });
  X.action('x-wk-refazer-parar', el => { const P = planoAberto(); const C = P && W().cards[P.id + ':' + el.dataset.i]; if (C) X.parar(C); });

  // para testes em Node
  X._semana = { normalizar, normItem, diaIdx, proximaSegunda, dataDoDia, iso, deIso, intervalo, textoPlano };
})();
