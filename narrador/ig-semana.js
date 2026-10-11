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
  const PAPEIS = { educativo: 'Educativo', historia: 'História', conexao: 'Conexão', oferta: 'Oferta' };
  const FORM_CARROSSEL = ['lista', 'antesdepois', 'mito', 'framework'];
  const LEVADO = { estudio: 'Roteiro no Estúdio', carrossel: 'Carrossel no Kit', legenda: 'Legenda no Kit', hashtags: 'Hashtags no Kit' };

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
  // segunda-feira da semana de uma data (qualquer dia escolhido no campo vira a segunda daquela semana)
  const segundaDe = d => somaDias(d, -((d.getDay() + 6) % 7));
  const inicioSeg = s => { const d = deIso(s); return d ? segundaDe(d) : null; };
  const semAcento = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  // "Terça-feira", "terca", "TER", "3ª-feira", "3a feira" -> 1; número solto "1".."7" conta a partir da segunda ("1" = segunda, "3" = quarta)
  const diaIdx = v => {
    const s = semAcento(typeof v === 'number' ? String(v) : v);
    if (!s) return -1;
    const pref = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
    for (let i = 0; i < 7; i++) if (s.startsWith(pref[i])) return i;
    const en = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    for (let i = 0; i < 7; i++) if (s.startsWith(en[i])) return i;
    // ordinal de "feira": 2ª = segunda ... 6ª = sexta
    const o = /^([2-6])\s*(?:[ªº]|a\b|o\b)?\s*-?\s*(feira)?/.exec(s);
    if (o && (o[2] || /^[2-6]\s*[ªº]/.test(s) || /^[2-6]\s*a\b/.test(s))) return +o[1] - 2;
    const m = /^dia\s*(\d)$|^(\d)$/.exec(s);
    if (m) { const n = +(m[1] || m[2]); if (n >= 1 && n <= 7) return n - 1; }
    return -1;
  };
  const dataDoDia = (inicio, idx) => { const d = inicioSeg(inicio); return d ? somaDias(d, idx) : null; };
  const intervalo = inicio => { const d = inicioSeg(inicio); return d ? `${ddmm(d)} a ${ddmm(somaDias(d, 6))}` : ''; };

  /* ---------- estado ---------- */
  const formPadrao = () => {
    const N = A() && A().N;
    return {
      foco: '', objetivo: 'seguidores',
      pilares: N ? N.PILARES.filter(p => !p.pendente).map(p => p.id) : [],
      posts: 5, formatos: ['reel', 'carrossel'], stories: true,
      inicio: iso(proximaSegunda()), oferta: '', obs: '', virais: []
    };
  };
  const W = () => {
    if (!X.state.semana) X.state.semana = { form: formPadrao(), planoId: null, busy: false, err: '', ctl: null, iniciado: false, cards: {}, delArm: null, formAberto: false };
    return X.state.semana;
  };
  X.onReset.push(() => { delete X.state.semana; });
  // só planos inteiros: um item quebrado (backup editado, versão antiga) não derruba a tela
  const planos = () => (((A() && A().st.planos) || [])).filter(p => p && p.tipo === 'semana' && p.res && Array.isArray(p.res.dias) && p.res.dias.length);
  const planoAberto = () => { const S = W(); return S.planoId ? planos().find(p => p.id === S.planoId) || null : null; };
  const viraisAnalisados = () => (((A() && A().st.virais) || [])).filter(v => v && v.analise);
  const viralDe = id => { const a = A(); return id && a && typeof a.viralById === 'function' ? a.viralById(id) || null : null; };

  /* ---------- normalizador ---------- */
  const K = () => X.K || {};
  const formulaOk = id => { const f = K().formula; return !!(id && typeof f === 'function' && f(id)); };
  const pilarOk = id => { const N = A() && A().N; return !!(id && N && N.PILARES.some(p => p.id === id)); };
  const formatoOk = id => { const E = A() && A().E; return !!(id && E && E.formato(id)); };
  const normTipo = t => { const s = semAcento(t); if (/stor/.test(s)) return ''; if (/reel|video/.test(s)) return 'reel'; if (/carross|carousel/.test(s)) return 'carrossel'; if (/imag|foto|post|single/.test(s)) return 'imagem'; return ''; };
  const normObj = o => { const s = semAcento(o); if (s.startsWith('seg')) return 'seguidores'; if (s.startsWith('salv')) return 'salvamentos'; if (s.startsWith('compart') || s.startsWith('envio')) return 'compartilhamentos'; if (s.startsWith('coment')) return 'comentarios'; return ''; };
  const normPapel = o => { const s = semAcento(o); if (s.startsWith('educ')) return 'educativo'; if (s.startsWith('hist')) return 'historia'; if (s.startsWith('conex')) return 'conexao'; if (s.startsWith('ofert') || s.startsWith('venda')) return 'oferta'; return ''; };
  const normHora = h => { const m = /(\d{1,2})\s*[:h]\s*(\d{2})?/.exec(String(h || '')); if (!m) return ''; const H = +m[1], M = +(m[2] || 0); return H < 24 && M < 60 ? `${pad(H)}:${pad(M)}` : ''; };
  const GANCHO_LONGO = 220;

  // permitidos: tipos que o criador marcou; item fora deles (ou story, ou tipo desconhecido) é descartado
  const normItem = (x, objPadrao, permitidos) => {
    if (!x || typeof x !== 'object') return null;
    const gancho = X.str(x.gancho, 600);
    const d = diaIdx(x.dia);
    if (!gancho || d < 0) return null;
    const tipo = normTipo(x.tipo);
    if (!tipo || (Array.isArray(permitidos) && permitidos.length && !permitidos.includes(tipo))) return null;
    const vid = X.str(x.viralId, 80);
    return {
      d, tipo,
      pilar: pilarOk(x.pilar) ? x.pilar : '',
      papel: normPapel(x.papel),
      objetivo: normObj(x.objetivo) || objPadrao || 'salvamentos',
      formula: formulaOk(x.formula) ? x.formula : '',
      formato: tipo === 'reel' && formatoOk(x.formato) ? x.formato : '',
      horario: normHora(x.horario),
      titulo: X.str(x.titulo, 90) || gancho.slice(0, 60),
      gancho,
      angulo: X.str(x.angulo, 400),
      entrega: X.str(x.entrega, 300),
      antesDepois: X.str(x.antesDepois, 300),
      ganho: X.str(x.ganho, 300),
      mandariaPara: X.str(x.mandariaPara, 200),
      cta: X.str(x.cta, 300),
      ponte: X.str(x.ponte, 300),
      stories: X.str(x.stories, 300),
      viralId: vid && viralDe(vid) ? vid : ''
    };
  };
  // form: { formatos, stories } do pedido (restringe tipos e zera stories quando o criador não faz)
  const normalizar = (r, objPadrao, form) => {
    if (!r || typeof r !== 'object') return null;
    const f = form || {};
    const semStories = f.stories === false;
    const brutos = Array.isArray(r.dias) ? r.dias : Array.isArray(r.posts) ? r.posts : [];
    const porDia = {};
    const itens = [];
    brutos.map(x => normItem(x, objPadrao, f.formatos)).filter(Boolean).sort((a, b) => a.d - b.d).forEach(it => {
      if (semStories) it.stories = '';
      porDia[it.d] = (porDia[it.d] || 0) + 1;
      if (porDia[it.d] <= 2) itens.push(it);
    });
    const dias = itens.slice(0, 7);
    if (!dias.length) return null;
    return {
      serie: X.str(r.serie, 60), fio: X.str(r.fio, 300), porQueSeguir: X.str(r.porQueSeguir, 400), meta: X.str(r.meta, 300),
      dias, storiesSemana: semStories ? '' : X.str(r.storiesSemana, 500), equilibrio: X.str(r.equilibrio, 400),
      avisos: X.arr(r.avisos, 6, y => X.str(y, 240))
    };
  };

  /* ---------- checagens locais (sem IA) ---------- */
  const MARCA = /\[(PREENCHER|CONFERIR)/i;
  const CAMPOS_TXT = ['titulo', 'gancho', 'angulo', 'entrega', 'antesDepois', 'ganho', 'mandariaPara', 'cta', 'ponte', 'stories'];
  // avisos calculados na hora (valem também depois de refazer um post)
  const avisosAuto = r => {
    const out = [];
    (r.dias || []).forEach(it => {
      if (CAMPOS_TXT.some(k => MARCA.test(it[k] || ''))) out.push(`${cap(DIAS[it.d])}: tem [PREENCHER] ou [CONFERIR] pra resolver antes de gravar.`);
      if ((it.gancho || '').length > GANCHO_LONGO) out.push(`Gancho de ${DIAS[it.d]} está longo (${it.gancho.length} caracteres): encurte antes de gravar.`);
    });
    return out;
  };
  const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
  // checagem de equilíbrio da semana (o que a skill pede marcar), calculada dos posts
  const checar = (r, f) => {
    const dias = r.dias || [], n = dias.length, out = [];
    const forms = (f && Array.isArray(f.formatos) && f.formatos.length) ? f.formatos : ['reel', 'carrossel'];
    const conta = k => dias.reduce((m, it) => { if (it[k]) m[it[k]] = (m[it[k]] || 0) + 1; return m; }, {});
    const tipos = conta('tipo'), fs = conta('formula'), pils = conta('pilar'), paps = conta('papel'), objs = conta('objetivo');
    const ultimo = (k, v) => { for (let i = n - 1; i >= 0; i--) if (dias[i][k] === v) return i; return -1; };
    const qual = i => i >= 0 ? ` Refaça o post de ${DIAS[dias[i].d]}.` : '';
    const minTipo = n >= 4 ? 2 : 1;
    if (forms.includes('reel') && (tipos.reel || 0) < minTipo) out.push(`${tipos.reel || 0} Reel na semana: o ideal é ${minTipo} ou mais, porque é o Reel que chega a gente nova.`);
    if (forms.includes('carrossel') && (tipos.carrossel || 0) < minTipo) out.push(`${tipos.carrossel || 0} carrossel na semana: o ideal é ${minTipo} ou mais, porque é o que mais ganha salvamento.`);
    const minSalv = n >= 6 ? 3 : n >= 4 ? 2 : 1, minEnv = n >= 6 ? 2 : 1;
    if ((objs.salvamentos || 0) < minSalv) out.push(`${objs.salvamentos || 0} post${objs.salvamentos === 1 ? '' : 's'} de salvamento: o ideal é ${minSalv} ou mais.`);
    if (n >= 4 && (objs.compartilhamentos || 0) < minEnv) out.push(`${objs.compartilhamentos || 0} post de envio: o ideal é ${minEnv} ou mais (envio é o sinal que mais espalha).`);
    if (n >= 4 && !(objs.seguidores || 0) && !(objs.comentarios || 0)) out.push('Nenhum post de seguidor ou de comentário: a semana não tem quem converta a visita em seguidor.');
    Object.keys(fs).forEach(id => { if (fs[id] > 2) out.push(`Fórmula "${formulaNome(id) || id}" usada ${fs[id]} vezes: troque uma.${qual(ultimo('formula', id))}`); });
    const pilsPedidos = (f && Array.isArray(f.pilares)) ? f.pilares.length : 0;
    if (n >= 3 && pilsPedidos !== 1) Object.keys(pils).forEach(id => { if (pils[id] / n > 0.5) out.push(`Pilar ${pilarNome(id) || id} em ${pils[id]} de ${n} posts: passa de 50%.${qual(ultimo('pilar', id))}`); });
    if (n >= 3) Object.keys(paps).forEach(id => { if (id !== 'oferta' && paps[id] / n > 0.5) out.push(`Papel ${PAPEIS[id]} em ${paps[id]} de ${n} posts: passa de 50%.${qual(ultimo('papel', id))}`); });
    if ((paps.oferta || 0) > 2) out.push(`${paps.oferta} posts de oferta: o limite é 2, oferta demais enterra o alcance.${qual(ultimo('papel', 'oferta'))}`);
    if (n >= 4 && Object.keys(paps).length && !paps.historia) out.push('Nenhum post de história em 1ª pessoa: gente segue gente. Troque um post por um bastidor real seu.');
    return out;
  };

  /* ---------- prompt ---------- */
  const ITEM_EX = `{"dia": "segunda", "tipo": "reel|carrossel|imagem", "pilar": "<id>", "papel": "educativo|historia|conexao|oferta", "objetivo": "seguidores|salvamentos|compartilhamentos|comentarios", "formula": "<id da fórmula>", "formato": "<formatoId, só reel>", "horario": "12:30", "titulo": "título interno curto", "gancho": "uma frase só, no tamanho da superfície", "angulo": "1 ou 2 frases", "entrega": "o que a pessoa leva pronto", "antesDepois": "antes a pessoa achava ou fazia X → depois sabe ou faz Y", "ganho": "o efeito em reais, horas, risco evitado ou cliente", "mandariaPara": "a pessoa específica pra quem o espectador mandaria", "cta": "UM pedido final, amarrado ao próximo post", "ponte": "o assunto do próximo post e como este puxa ele", "stories": "o que vai nos stories do dia (enquete, caixinha, bastidor)", "viralId": "<id do viral recriado ou vazio>"}`;
  const EXEMPLO = `{"serie": "nome curto da série, até 4 palavras, pra tarja e capa", "fio": "a série ou arco da semana em 1 frase", "porQueSeguir": "o que quem acompanhar a semana inteira ganha até domingo", "meta": "passar a soma de salvamentos + envios da semana anterior; sem histórico no DESEMPENHO REAL, diga que esta semana vira a base. Nunca invente número", "dias": [${ITEM_EX}], "storiesSemana": "cadência dos stories", "equilibrio": "leitura do equilíbrio entre os 4 objetivos e os papéis, e o que ficou de fora e por quê", "avisos": ["o que conferir antes de postar"]}`;

  const txt = x => typeof x === 'string' ? x : (x && (x.texto || x.text || x.frase)) || '';
  const viralBloco = v => {
    const a = v.analise || {}, m = a.modelagem || {}, g = a.gancho || {};
    const fmt = a.formato && A().E.formato(a.formato) ? A().E.formato(a.formato).nome : (a.formato || '-');
    return `VIRAL PRA RECRIAR [${v.id}] ${v.handle || 'perfil'} "${X.str(v.titulo, 80)}": gancho "${X.str(g.texto, 200)}" · fórmula ${g.formula || '-'} · formato ${fmt} · modelagem: gancho ${X.str(txt(m.gancho), 200) || '-'}, ângulo ${X.str(m.angulo, 200) || '-'}, porque ${X.str(m.porque, 200) || '-'} · não copiar: ${X.arr(a.naoCopiar, 4, y => X.str(y, 120)).join('; ') || 'frases, roteiro e dados do viral'}`;
  };
  const viraisDoForm = f => (Array.isArray(f.virais) ? f.virais : []).map(viralDe).filter(v => v && v.analise).slice(0, 3);

  const formTexto = f => {
    const N = A().N;
    const pil = (f.pilares || []).map(id => (N.PILARES.find(p => p.id === id) || {}).nome || id).join(', ');
    const vs = viraisDoForm(f);
    return [
      `Foco da semana (o que a pessoa deve aprender ou resolver): ${f.foco || '(livre: escolha o tema mais útil pro público agora)'}`,
      `Objetivo principal: ${OBJ_NOME[f.objetivo] || f.objetivo}`,
      `Pilares a incluir: ${pil || 'todos'} (use estes ids: ${(f.pilares || []).join(', ') || 'qualquer'})`,
      `Posts no feed: ${f.posts} na semana`,
      `Formatos disponíveis (só estes): ${(f.formatos || []).map(t => TIPOS[t]).join(', ') || 'Reels'}`,
      `Stories diários: ${f.stories ? 'sim' : 'não'}`,
      `Início da semana: segunda-feira ${f.inicio}`,
      f.oferta ? `Oferta ou lançamento da semana: ${f.oferta}` : 'Oferta ou lançamento: nenhuma (não force venda)',
      f.obs ? `Observações do criador: ${f.obs}` : '',
      vs.length ? vs.map(viralBloco).join('\n') : ''
    ].filter(Boolean).join('\n');
  };

  const base = () => {
    const k = K(), a = A(), p = a.st.profile || {};
    const E = a.E || {};
    return [
      X.ctxPerfil(),
      k.plano || '', k.sinais || '',
      typeof k.blocoFormulas === 'function' ? k.blocoFormulas() : '',
      typeof E.ctaRegra === 'function' ? `═══ CTA DO PERFIL ═══\n${E.ctaRegra(p)}` : '',
      p.regulado ? `═══ CONTEÚDO REGULADO ═══\nEste perfil fala de tema regulado. Em todo post, "entrega" é uma pergunta pra fazer ao profissional, um documento pra conferir ou um sinal de alerta, nunca uma decisão técnica pro caso da pessoa. O ângulo nunca promete resultado.${p.disclaimer ? ` Em "avisos", lembre que a legenda leva o disclaimer do perfil: "${p.disclaimer}".` : ' Em "avisos", lembre que a legenda leva o disclaimer do perfil.'}` : '',
      `═══ DESEMPENHO REAL DO PERFIL ═══\n${X.desempenho()}`,
      `═══ FORMATOS DE REEL DO APP (use o id em "formato") ═══\n${X.formatosLista()}`,
      `═══ PILARES (use o id em "pilar") ═══\n${X.pilaresLista()}`
    ].filter(Boolean).join('\n\n');
  };

  const regras = () => {
    const p = A().st.profile || {};
    const ass = String(p.assinatura || p.handle || '');
    const limImg = Math.max(60, 125 - ass.length - 2);
    return `═══ REGRAS DO PLANO ═══
- A semana é uma SÉRIE com fio condutor e um nome curto ("serie") que vai na capa ou na tarja de todos os posts. Quem acompanhar de segunda a domingo termina com um problema resolvido de verdade. Diga em "porQueSeguir" o que essa pessoa ganha até domingo.
- Cada post entrega uma transformação concreta: em "entrega", o que a pessoa leva PRONTO e aplica hoje (lista, modelo de mensagem, frase pronta, checklist de até 3 itens ou critério pra decidir; em tema regulado, pergunta ou verificação). Nada de conteúdo genérico ou "dicas" vagas.
- Antes de responder, confira cada post nas 5 provas do VALOR QUE TRANSFORMA. Se "antesDepois" disser só "ficou sabendo", ou se "mandariaPara" for genérico ("amigos", "quem precisa"), reescreva o post. "ganho" fala em reais, horas, risco evitado ou cliente, sem número inventado.
- Um CTA por post ("cta"), amarrado ao próximo capítulo, seguindo o CTA DO PERFIL. Sem isca de engajamento ("comenta SIM", "marca 3 amigos", "curte se concorda").
- Cada post puxa o próximo ("ponte"): o assunto definido do próximo post, a parte 2, o erro que vem depois. O último post fecha o arco e diz o que vem na próxima semana.
- Cada post tem um "papel" (educativo, historia, conexao, oferta). Pelo menos 1 post de história real em 1ª pessoa; nela, o fato vivido que você não tem vira [PREENCHER: a história real], nunca uma história inventada. No máximo 2 de oferta.
- Um objetivo principal por post. Equilibre os 4 objetivos (seguidores, salvamentos, compartilhamentos, comentários), com mais peso no objetivo principal informado.
- Prioridade quando as metas de mix não cabem no número de posts: 1) só os formatos que o criador marcou; 2) o objetivo principal informado; 3) pelo menos 2 de salvamento e 1 de envio; 4) o resto do equilíbrio. Diga em "equilibrio" o que ficou de fora e por quê.
- Cada post usa uma fórmula de gancho (id da lista de fórmulas), nenhuma mais de 2 vezes na semana, e traz o gancho ESCRITO por extenso, no estilo e no tom do criador, como ele falaria. Sem inventar número, caso, história ou resultado: quando depender de dado do criador, escreva [PREENCHER: o quê].
- "gancho" é uma frase só. Reel: o que se fala nos 3 primeiros segundos (até ~15 palavras). Carrossel: o texto do slide 1 (até ~12 palavras). Imagem: a primeira linha da legenda, que tem que caber em ${limImg} caracteres, porque a assinatura vem antes.
- Nenhum número de meta, alcance ou resultado esperado. Número que depender de dado do perfil vira [PREENCHER: soma de salvamentos + envios da semana passada].
- Formatos e ganchos que já funcionaram no perfil (desempenho real acima) têm prioridade.
- Se houver VIRAL PRA RECRIAR, pelo menos 1 post da semana recria cada um: mantém a mecânica (fórmula, estrutura, formato) e troca assunto, exemplo e números pelos do criador. Nunca copia frase, roteiro nem dado do viral. Coloque o id dele em "viralId"; nos outros posts, "viralId" fica "".
- Nunca repita o assunto dos roteiros recentes.
- "tipo" é só reel, carrossel ou imagem, e só entre os formatos disponíveis. Story não é post do feed: vai no campo "stories".
- Reels levam o id do formato do app em "formato". Carrossel e imagem deixam "formato" vazio.
- Use só os pilares pedidos.
- Horário sugerido em HH:MM, horário de Brasília. Avise em "avisos" que o horário deve ser conferido nos Insights do perfil.
- Se houver oferta, no máximo 1 ou 2 posts falam dela, e só depois de entregar valor.
- Dia em português ("segunda", "terça", ..., "domingo"). Até 2 posts no mesmo dia, só se fizer sentido.`;
  };

  const promptPlano = f => [
    base(), regras(),
    `═══ PEDIDO DO CRIADOR ═══\n${formTexto(f)}`,
    `Monte o plano com exatamente ${f.posts} posts no feed${f.stories ? ' e stories em todos os dias (no campo "stories" de cada post e em "storiesSemana")' : '. O criador não vai fazer stories nesta semana: deixe "stories" e "storiesSemana" como ""'}.\n\nResponda só com JSON, sem texto antes ou depois, neste formato exato:\n${EXEMPLO}`
  ].join('\n\n');

  const resumoPlano = res => res.dias.map(it => `${DIAS[it.d]} · ${it.tipo} · pilar ${it.pilar || '-'} · papel ${it.papel || '-'} · fórmula ${it.formula || '-'} · objetivo ${it.objetivo} · ${it.titulo}: "${it.gancho}" (leva pronto: ${it.entrega})`).join('\n');

  const promptRefazer = (P, i) => {
    const it = P.res.dias[i];
    const f = P.form || {};
    const tipos = (f.formatos && f.formatos.length) ? f.formatos : ['reel', 'carrossel'];
    return [
      base(), regras(),
      `═══ PLANO ATUAL DA SEMANA ═══\n${P.res.serie ? `Série: ${P.res.serie}\n` : ''}Fio: ${P.res.fio}\nPor que seguir: ${P.res.porQueSeguir}\n${resumoPlano(P.res)}`,
      `═══ PEDIDO DO CRIADOR ═══\n${formTexto(f)}`,
      `Refaça SÓ o post de ${DIAS[it.d]} ("${it.titulo}"). Mesmo dia, de preferência o mesmo tipo (${it.tipo}); se outro tipo entre ${tipos.join(', ')} servir melhor à série, pode trocar. Tem que ser DIFERENTE do atual (outro ângulo e outro gancho), manter o fio condutor e continuar ligando o post anterior ao próximo. Mantenha o equilíbrio da semana: não use fórmula que já aparece 2 vezes nos outros posts e não passe de 2 posts de oferta.${f.stories === false ? ' O criador não faz stories nesta semana: deixe "stories" como "".' : ''}\n\nResponda só com JSON, sem texto antes ou depois, com UM item neste formato exato:\n${ITEM_EX.replace('"dia": "segunda"', `"dia": "${DIAS[it.d]}"`)}`
    ].join('\n\n');
  };

  /* ---------- CSS ---------- */
  X.css(`
.wk{display:grid; grid-template-columns:minmax(300px,380px) minmax(0,1fr); gap:24px; align-items:start}
.wk.top{grid-template-columns:minmax(0,1fr)}
.wk.top .kit-in{position:static}
.wk-board{min-width:0; display:flex; flex-direction:column; gap:16px}
.wk-head{padding:18px; display:flex; flex-direction:column; gap:10px}
.wk-head h3{margin:0; font-family:var(--f-disp); font-weight:800; font-size:22px; text-transform:uppercase; letter-spacing:.03em; line-height:1.05; overflow-wrap:anywhere}
.wk-head p{margin:0; font-size:14px; line-height:1.5; color:var(--ink2); overflow-wrap:anywhere}
.wk-head p b{color:var(--ink)}
.wk-head .kit-row > .eyebrow.grow{min-width:min(100%,240px)}
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
  const hl = s => A().hl(s);

  const formHTML = (S, compacto) => {
    const N = A().N;
    const ia = X.prontoIA();
    const vs = viraisAnalisados();
    return `<aside class="card kit-in">
      <div><div class="eyebrow">Plano da semana</div><h2>${compacto ? 'Novo plano' : 'Monte a semana'}</h2></div>
      <p class="lead">Uma semana com fio condutor: cada post resolve um pedaço do mesmo problema e puxa o próximo. Quem acompanha termina a semana com algo resolvido, e por isso segue.</p>
      ${X.h.campo({ path: 'semana.form.foco', label: 'Foco da semana', tipo: 'textarea', rows: 3, max: 600, placeholder: 'O que você quer que a pessoa aprenda ou resolva nesta semana', help: 'Quanto mais concreto, melhor o plano. Em branco, a IA escolhe o tema mais útil agora.' })}
      <div class="field"><span>Objetivo principal</span>${X.h.seg('semana.form.objetivo', OBJS)}</div>
      <div class="field"><span>Pilares a incluir</span>${X.h.multi('semana.form.pilares', N.PILARES.map(p => [p.id, p.nome]))}</div>
      <div class="field"><span>Posts no feed na semana</span>${X.h.seg('semana.form.posts', [3, 4, 5, 6, 7].map(n => [String(n), String(n)]), String(S.form.posts))}</div>
      <div class="field"><span>Formatos que você consegue fazer</span>${X.h.multi('semana.form.formatos', [['reel', 'Reels'], ['carrossel', 'Carrossel'], ['imagem', 'Imagem']])}</div>
      ${vs.length ? `<div class="field"><span>Virais pra recriar nesta semana (opcional)</span>${X.h.multi('semana.form.virais', vs.slice(0, 12).map(v => [v.id, `${v.handle || 'perfil'} · ${String(v.titulo || '').slice(0, 40)}`]))}<small>A semana recria a mecânica do viral com o seu assunto, sem copiar frase nem dado.</small></div>` : ''}
      ${X.h.campo({ path: 'semana.form.stories', label: 'Stories todos os dias', tipo: 'check' })}
      ${X.h.campo({ path: 'semana.form.inicio', label: 'Início da semana (segunda-feira)', tipo: 'date', help: 'Pode escolher qualquer dia: o plano começa na segunda-feira daquela semana.' })}
      ${X.h.campo({ path: 'semana.form.oferta', label: 'Oferta ou lançamento da semana (opcional)', max: 300, placeholder: 'Ex.: abertura de turma na quinta' })}
      ${X.h.campo({ path: 'semana.form.obs', label: 'Observações (opcional)', tipo: 'textarea', rows: 2, max: 1200, placeholder: 'Ex.: quarta não consigo gravar; quero testar carrossel' })}
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
      const foco = String(p.foco || '').slice(0, 60);
      return `<div class="rec-row"><button type="button" class="lnk" data-a="x-wk-abrir" data-id="${esc(p.id)}">${p.id === S.planoId ? '<b>' : ''}Semana de ${esc(intervalo(p.inicio))}${foco ? ' · ' + esc(foco) : ''}${p.id === S.planoId ? '</b>' : ''}<small>${p.res.dias.length} posts · ${feitos} postado${feitos === 1 ? '' : 's'}</small></button>
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
        <li>Cada post com dia, horário, formato, papel, objetivo, fórmula e o gancho já escrito no seu tom.</li>
        <li>O que a pessoa leva pronto de cada post, o antes e depois, pra quem ela mandaria e como ele puxa o próximo.</li>
        <li>Botões pra roteirizar o Reel no Estúdio, montar o carrossel, escrever a legenda e escolher hashtags no Kit.</li>
      </ul>
      <p class="kit-hint">Escreva o foco da semana e toque em Gerar plano da semana.</p>
    </div>`;

  const cardHTML = (P, it, i) => {
    const S = W();
    const C = S.cards[P.id + ':' + i] || {};
    const d = dataDoDia(P.inicio, it.d);
    const feito = !!(P.feitos || {})[i];
    const levado = (P.levados || {})[i];
    const fn = formulaNome(it.formula);
    const v = it.viralId ? viralDe(it.viralId) : null;
    const btns = [];
    if (it.tipo === 'reel') btns.push(`<button type="button" class="btn xs primary" data-a="x-wk-estudio" data-i="${i}">${ic('estudio', 'sm')} Roteirizar no Estúdio</button>`);
    if (it.tipo === 'carrossel') btns.push(`<button type="button" class="btn xs primary" data-a="x-wk-carrossel" data-i="${i}">${ic('carrossel', 'sm')} Montar carrossel</button>`);
    btns.push(`<button type="button" class="btn xs" data-a="x-wk-legenda" data-i="${i}">${ic('legenda', 'sm')} Escrever legenda</button>`);
    btns.push(`<button type="button" class="btn xs ghost" data-a="x-wk-hashtags" data-i="${i}">${ic('hashtag', 'sm')} Escolher hashtags</button>`);
    btns.push(X.h.copiar(it.gancho, 'Copiar gancho', 'ghost'));
    btns.push(C.busy ? `<button type="button" class="btn xs" data-a="x-wk-refazer-parar" data-i="${i}">${ic('stop', 'sm')} Refazendo… parar</button>`
      : `<button type="button" class="btn xs ghost" data-a="x-wk-refazer" data-i="${i}" ${X.prontoIA() ? '' : 'disabled'}>${ic('shuffle', 'sm')} Refazer este post</button>`);
    const sub = 'class="faint" style="font-size:12.5px"';
    return `<article class="card wk-card ${feito ? 'feito' : ''}">
      <div class="top"><span class="dia">${esc(DIAS_CURTO[it.d])} ${d ? ddmm(d) : ''}</span>${it.horario ? `<span class="tag mono">${esc(it.horario)}</span>` : ''}<span class="tag">${esc(TIPOS[it.tipo] || it.tipo)}</span><span class="tag amber">${esc(OBJ_NOME[it.objetivo] || '')}</span>${it.papel ? `<span class="tag">${esc(PAPEIS[it.papel])}</span>` : ''}${levado ? `<span class="tag good">${esc(LEVADO[levado] || 'Em andamento')}</span>` : ''}</div>
      <div class="top">${it.pilar ? `<span class="wk-pdot" style="background:var(--p-${esc(it.pilar)})"></span><span ${sub}>${esc(pilarNome(it.pilar))}</span>` : ''}${fn ? `<span ${sub}>· ${esc(fn)}</span>` : ''}${it.formato ? `<span ${sub}>· ${esc(A().fmtName(it.formato))}</span>` : ''}</div>
      <h4>${esc(it.titulo)}</h4>
      <q class="mq">${hl(it.gancho)}</q>
      ${v ? `<p><b>Recria:</b> ${esc(v.handle || 'viral')}${v.titulo ? ` · ${esc(String(v.titulo).slice(0, 50))}` : ''}</p>` : ''}
      ${it.angulo ? `<p>${hl(it.angulo)}</p>` : ''}
      ${it.entrega ? `<p><b>Leva pronto:</b> ${hl(it.entrega)}</p>` : ''}
      ${it.antesDepois ? `<p><b>Antes → depois:</b> ${hl(it.antesDepois)}</p>` : ''}
      ${it.ganho ? `<p><b>Ganho:</b> ${hl(it.ganho)}</p>` : ''}
      ${it.mandariaPara ? `<p><b>Manda pra:</b> ${hl(it.mandariaPara)}</p>` : ''}
      ${it.cta ? `<p><b>Pedido final:</b> ${hl(it.cta)}</p>` : ''}
      ${it.ponte ? `<p><b>Puxa o próximo:</b> ${hl(it.ponte)}</p>` : ''}
      ${it.stories ? `<p><b>Stories:</b> ${hl(it.stories)}</p>` : ''}
      <button type="button" class="chip ${feito ? 'on' : ''}" style="align-self:flex-start" data-a="x-wk-feito" data-i="${i}" aria-pressed="${feito}">${ic(feito ? 'check' : 'plus', 'sm')} ${feito ? 'Postado' : 'Marcar como postado'}</button>
      ${X.h.erro(C.err)}
      <div class="acts">${btns.join('')}</div>
    </article>`;
  };

  const quadroHTML = P => {
    const r = P.res;
    const cont = {}; OBJS.forEach(([k]) => { cont[k] = 0; });
    r.dias.forEach(it => { cont[it.objetivo] = (cont[it.objetivo] || 0) + 1; });
    const chk = checar(r, P.form);
    const avisos = (Array.isArray(r.avisos) ? r.avisos : []).concat(avisosAuto(r));
    return `<div class="card wk-head">
        <div class="kit-row"><div class="eyebrow grow">${r.serie ? esc(r.serie) + ' · ' : ''}Semana de ${esc(intervalo(P.inicio))} · ${r.dias.length} posts</div>
          <button type="button" class="btn xs" data-a="x-wk-copiar">${ic('copy', 'sm')} Copiar plano</button>
          <button type="button" class="btn xs ghost" data-a="x-wk-novo">${ic('plus', 'sm')} Novo plano</button></div>
        <h3>${esc(r.fio || P.foco || 'Plano da semana')}</h3>
        ${r.porQueSeguir ? `<p><b>Por que seguir:</b> ${hl(r.porQueSeguir)}</p>` : ''}
        ${r.meta ? `<p><b>Meta da semana:</b> ${hl(r.meta)}</p>` : ''}
        <div class="rates">${OBJS.map(([k, n]) => `<span class="tag mono ${k === P.objetivo ? 'amber' : ''}">${esc(n)} ${cont[k]}</span>`).join('')}</div>
        <div class="eyebrow">Equilíbrio da semana</div>
        ${chk.length ? X.h.lista(chk, 'warnlist') : '<p>Mix de formatos, objetivos, fórmulas, pilares e papéis dentro do recomendado.</p>'}
        ${r.equilibrio ? `<p>${hl(r.equilibrio)}</p>` : ''}
        ${r.storiesSemana ? `<p><b>Stories:</b> ${hl(r.storiesSemana)}</p>` : ''}
      </div>
      <div class="wk-grid">${r.dias.map((it, i) => cardHTML(P, it, i)).join('')}</div>
      ${avisos.length ? `<div class="card wk-head"><div class="eyebrow">Antes de postar, confira</div>${X.h.lista(avisos, 'warnlist')}</div>` : ''}`;
  };

  const textoPlano = P => {
    const r = P.res;
    const L = [`PLANO DA SEMANA · ${intervalo(P.inicio)}`, r.serie ? `Série: ${r.serie}` : '', P.foco ? `Foco: ${P.foco}` : '', r.fio ? `Fio condutor: ${r.fio}` : '', r.porQueSeguir ? `Por que seguir: ${r.porQueSeguir}` : '', r.meta ? `Meta: ${r.meta}` : '', ''];
    r.dias.forEach((it, i) => {
      const d = dataDoDia(P.inicio, it.d);
      L.push(`${DIAS[it.d].toUpperCase()} ${d ? ddmm(d) : ''}${it.horario ? ' · ' + it.horario : ''} · ${TIPOS[it.tipo] || it.tipo} · ${OBJ_NOME[it.objetivo] || ''}${it.papel ? ' · ' + PAPEIS[it.papel] : ''}${(P.feitos || {})[i] ? ' · POSTADO' : ''}`);
      L.push(`${it.titulo}`);
      L.push(`Gancho: ${it.gancho}`);
      if (it.angulo) L.push(`Ângulo: ${it.angulo}`);
      if (it.entrega) L.push(`Leva pronto: ${it.entrega}`);
      if (it.antesDepois) L.push(`Antes → depois: ${it.antesDepois}`);
      if (it.ganho) L.push(`Ganho: ${it.ganho}`);
      if (it.mandariaPara) L.push(`Manda pra: ${it.mandariaPara}`);
      if (it.cta) L.push(`Pedido final: ${it.cta}`);
      if (it.ponte) L.push(`Puxa o próximo: ${it.ponte}`);
      if (it.stories) L.push(`Stories: ${it.stories}`);
      L.push('');
    });
    if (r.storiesSemana) L.push(`Stories da semana: ${r.storiesSemana}`);
    const chk = checar(r, P.form);
    if (chk.length) L.push('Equilíbrio:\n' + chk.map(a => '- ' + a).join('\n'));
    if (r.equilibrio) L.push(`Equilíbrio (leitura da IA): ${r.equilibrio}`);
    const avisos = (Array.isArray(r.avisos) ? r.avisos : []).concat(avisosAuto(r));
    if (avisos.length) L.push('Conferir:\n' + avisos.map(a => '- ' + a).join('\n'));
    return L.filter((x, i, a) => !(x === '' && a[i - 1] === '')).join('\n').trim();
  };

  /* ---------- tela ---------- */
  X.view('semana', {
    nome: 'Semana', after: 'estudio',
    count: () => { try { return planos().length || null; } catch (e) { return null; } },
    render() {
      const S = W();
      // abre o plano mais recente uma vez; só marca como feito quando há plano
      // (o 1º render do app roda antes do Store carregar o localStorage/nuvem)
      if (!S.iniciado) {
        const ps = planos().slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        if (ps.length) { S.iniciado = true; if (!S.planoId) S.planoId = ps[0].id; }
      }
      const P = planoAberto();
      if (S.planoId && !P) S.planoId = null;
      const aberto = S.formAberto || S.busy || !!S.err;
      return `<div class="vh"><div><div class="eyebrow">Plano de postagens</div><h1>Sua <em>semana</em></h1>
        <p>Uma semana em série: cada post entrega algo pronto pra usar e puxa o próximo, e quem acompanha percebe que seguir o perfil vale a pena.</p></div></div>
        <div class="wk ${P ? 'top' : ''}">
          ${P ? '' : formHTML(S, false)}
          <section class="wk-board">${P ? quadroHTML(P) + `<details class="card wk-more" style="padding:14px 18px"${aberto ? ' open' : ''}><summary class="eyebrow" style="cursor:pointer">Gerar outro plano ou abrir um salvo</summary><div style="margin-top:12px">${formHTML(S, true)}</div></details>` : vazioHTML()}</section>
        </div>`;
    },
    // guarda se o painel do formulário está aberto, pra um re-render não fechá-lo
    mount(m) {
      const d = m && m.querySelector && m.querySelector('details.wk-more');
      if (d) d.addEventListener('toggle', () => { W().formAberto = d.open; });
    }
  });

  /* ---------- ações ---------- */
  X.action('x-wk-gerar', async () => {
    const S = W();
    if (S.busy || !X.prontoIA()) return;
    const f = S.form;
    f.posts = X.num(f.posts, 3, 7) || 5;
    const d0 = deIso(f.inicio);
    f.inicio = iso(d0 ? segundaDe(d0) : proximaSegunda());
    if (!(f.formatos || []).length) f.formatos = ['reel'];
    f.foco = X.str(f.foco, 600); f.oferta = X.str(f.oferta, 300); f.obs = X.str(f.obs, 1200);
    f.virais = viraisDoForm(f).map(v => v.id);
    S.busy = true; S.err = ''; S.ctl = new AbortController(); X.refresh();
    try {
      const r = await X.ia(promptPlano(f), { tier: 'complex', signal: S.ctl.signal });
      const res = normalizar(r, f.objetivo, f);
      if (!res) throw { msg: 'A IA não devolveu um plano que dê pra ler. Toque em Gerar plano da semana de novo; se repetir, escreva um foco mais curto e concreto.' };
      const plano = X.salvar('planos', { tipo: 'semana', inicio: f.inicio, foco: X.str(f.foco, 300), objetivo: f.objetivo, pilares: (f.pilares || []).slice(), form: JSON.parse(JSON.stringify(f)), res, feitos: {}, levados: {} });
      S.planoId = plano && plano.id;
      S.formAberto = false;
      A().toast('Plano da semana salvo.', 'good');
    } catch (e) {
      if (!(e && e.code === 'cancelled')) S.err = (e && e.msg) || 'Não deu certo agora. Tente de novo.';
    } finally { S.busy = false; S.ctl = null; X.refresh(); }
  });
  X.action('x-wk-parar', () => X.parar(W()));
  X.action('x-wk-abrir', el => { const S = W(); S.planoId = el.dataset.id; S.formAberto = false; X.refresh(); window.scrollTo(0, 0); });
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
  // marca no plano que o post foi levado pra outra ferramenta (a tag aparece no card)
  const levar = (o, onde) => { o.P.levados = o.P.levados || {}; o.P.levados[o.i] = onde; X.salvar('planos', o.P); };
  // texto de referência do post pra próxima ferramenta (sem travessão)
  const baseDo = it => [
    it.angulo ? 'Ângulo: ' + it.angulo : '',
    it.entrega ? 'Leva pronto: ' + it.entrega : '',
    it.antesDepois ? 'Antes → depois: ' + it.antesDepois : '',
    it.ganho ? 'Ganho: ' + it.ganho : '',
    it.mandariaPara ? 'Pra quem a pessoa mandaria: ' + it.mandariaPara : '',
    it.cta ? 'Pedido final: ' + it.cta : '',
    it.ponte ? 'Próximo post (amarre o CTA nele): ' + it.ponte : ''
  ].filter(Boolean).join('\n');
  X.action('x-wk-feito', el => {
    const o = item(el); if (!o) return;
    o.P.feitos = o.P.feitos || {};
    o.P.feitos[o.i] = !o.P.feitos[o.i];
    X.salvar('planos', o.P); X.refresh();
  });
  X.action('x-wk-estudio', el => {
    const o = item(el); if (!o) return;
    const prox = o.P.res.dias[o.i + 1];
    const v = o.it.viralId ? viralDe(o.it.viralId) : null;
    const an = v && v.analise;
    const modelo = an ? { id: v.id, handle: v.handle, titulo: v.titulo, veredito: an.veredito, estrutura: an.estrutura, edicao: an.edicao, modelar: an.modelar, naoCopiar: an.naoCopiar, angulo: (an.modelagem || {}).angulo || o.it.angulo, entrega: an.entrega || null } : null;
    levar(o, 'estudio');
    X.paraEstudio({
      assunto: [o.it.titulo, o.it.angulo, o.it.entrega ? 'Leva pronto: ' + o.it.entrega : '', o.it.antesDepois ? 'Antes → depois: ' + o.it.antesDepois : ''].filter(Boolean).join('. '),
      gancho: o.it.gancho, formatoId: o.it.formato, objetivo: OBJ_ESTUDIO[o.it.objetivo],
      proximo: prox ? `${prox.titulo}: ${prox.gancho}` : o.it.ponte,
      obs: ['Plano da semana: ' + (o.P.res.fio || o.P.foco || ''), o.P.res.serie ? `Série: ${o.P.res.serie}. Use na tarja.` : '', o.it.cta ? 'Pedido final: ' + o.it.cta : '', o.it.mandariaPara ? 'Pra quem a pessoa mandaria: ' + o.it.mandariaPara : ''].filter(Boolean).join('\n'),
      why: `Post de ${DIAS[o.it.d]} do plano da semana.`,
      modelo
    });
  });
  X.action('x-wk-carrossel', el => {
    const o = item(el); if (!o) return;
    levar(o, 'carrossel');
    X.abrirFerramenta('carrossel', { tema: o.it.titulo, objetivo: o.it.objetivo, formula: FORM_CARROSSEL.includes(o.it.formula) ? o.it.formula : 'auto', gancho: o.it.gancho, slides: 7, base: baseDo(o.it), origem: 'Plano da semana · ' + DIAS[o.it.d] });
  });
  X.action('x-wk-legenda', el => {
    const o = item(el); if (!o) return;
    levar(o, 'legenda');
    X.abrirFerramenta('legenda', { assunto: o.it.titulo, tipo: o.it.tipo, objetivo: o.it.objetivo, gancho: o.it.gancho, base: baseDo(o.it), origem: 'Plano da semana · ' + DIAS[o.it.d] });
  });
  X.action('x-wk-hashtags', el => {
    const o = item(el); if (!o) return;
    levar(o, 'hashtags');
    X.abrirFerramenta('hashtags', { assunto: o.it.titulo, base: [o.it.gancho, baseDo(o.it)].filter(Boolean).join('\n'), origem: 'Plano da semana · ' + DIAS[o.it.d] });
  });
  X.action('x-wk-refazer', async el => {
    const o = item(el); if (!o || !X.prontoIA()) return;
    const S = W(), key = o.P.id + ':' + o.i;
    if (S.cards[key] && S.cards[key].busy) return;
    const C = S.cards[key] = { busy: true, err: '', ctl: new AbortController() };
    X.refresh();
    try {
      let r = await X.ia(promptRefazer(o.P, o.i), { tier: 'default', signal: C.ctl.signal });
      if (r && Array.isArray(r.dias)) r = r.dias[0];
      if (r && typeof r === 'object') r.dia = DIAS[o.it.d]; // o dia é sempre o do post refeito
      const f = o.P.form || {};
      const novo = normItem(r, o.it.objetivo, f.formatos);
      if (!novo) throw { msg: 'A IA não devolveu um post que dê pra ler. Toque em Refazer este post de novo.' };
      novo.d = o.it.d;
      if (f.stories === false) novo.stories = '';
      o.P.res.dias[o.i] = novo;
      if (o.P.feitos) delete o.P.feitos[o.i];
      if (o.P.levados) delete o.P.levados[o.i];
      X.salvar('planos', o.P);
      A().toast('Post refeito.', 'good');
    } catch (e) {
      if (!(e && e.code === 'cancelled')) C.err = (e && e.msg) || 'Não deu certo agora. Tente de novo.';
    } finally { C.busy = false; C.ctl = null; X.refresh(); }
  });
  X.action('x-wk-refazer-parar', el => { const P = planoAberto(); const C = P && W().cards[P.id + ':' + el.dataset.i]; if (C) X.parar(C); });

  // para testes em Node
  X._semana = { normalizar, normItem, diaIdx, proximaSegunda, segundaDe, dataDoDia, iso, deIso, intervalo, textoPlano, checar, avisosAuto, promptPlano, promptRefazer, quadroHTML };
})();
