/* Narrador de Impacto — motor: prompts, parser, checagens, aprendizado */
(function () {
  const N = window.NDI;
  const byId = (arr, id) => arr.find(x => String(x.id) === String(id));

  const E = {};

  /* ---------- utilidades ---------- */
  E.norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  E.bytes = s => new TextEncoder().encode(s).length;
  E.hoje = () => {
    const d = new Date();
    return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
  };
  E.fmtN = n => (n === '' || n == null || isNaN(n)) ? '—' : Number(n).toLocaleString('pt-BR');
  E.pct = (a, b) => (b > 0 && a !== '' && a != null) ? (Number(a) / Number(b)) * 100 : null;

  E.tema = id => {
    const base = byId(N.TEMAS, id);
    if (base) return base;
    const c = E._state && E._state.bank.temas[id];
    return c ? { id: Number(id), pilar: 'crescimento', nome: c.nome, frase: c.frase || '', nota: c.nota || '', custom: true } : null;
  };
  E.todosTemas = () => {
    const out = N.TEMAS.slice();
    const bank = (E._state && E._state.bank.temas) || {};
    for (let i = 46; i <= 60; i++) if (bank[i]) out.push(E.tema(i));
    return out;
  };
  E.gancho = id => byId(N.GANCHOS, id);
  E.cat = id => byId(N.CATS, id);
  E.formato = id => byId(N.FORMATOS, id);
  E.pilar = id => byId(N.PILARES, id);

  E.textoGancho = (g, colchetes) => {
    if (!g) return '';
    if (!g.colchete) return g.texto;
    let i = 0;
    return g.texto.replace(/\[[^\]]+\]/g, m => {
      const v = (colchetes && colchetes[i++] || '').trim();
      return v || m;
    });
  };
  E.slotsColchete = g => g && g.colchete ? g.texto.match(/\[[^\]]+\]/g).map(s => s.slice(1, -1)) : [];

  E.pessoal = g => g && /\b(eu|minha|meu|me|mim|comigo|usei|errei|estudei|trabalhei)\b/i.test(g.texto);

  // compatibilidade gancho × formato pelo mapa oficial
  E.compat = (ganchoId, formatoId) => {
    const g = E.gancho(ganchoId); if (!g || !formatoId) return null;
    const c = E.cat(g.cat);
    if (!c.formatos.length) return { nivel: 'neutra', txt: 'Categoria sem formato oficial no mapa: vale o que você gravar melhor.' };
    if (c.formatos.includes(formatoId)) return { nivel: 'forte', txt: `Combinação oficial do mapa: ${c.nome} → ${c.formatos.map(f => E.formato(f).nome).join(' ou ')}.` };
    return { nivel: 'fraca', txt: `Fora do mapa: ${c.nome} rende mais em ${c.formatos.map(f => E.formato(f).nome).join(' ou ')}.` };
  };

  E.duracaoAlvo = fid => {
    const f = E.formato(fid);
    if (!f) return [35, 45];
    if (fid === 'trend') return [5, 8];
    if (fid === 'narrado') return [35, 60];
    if (fid === 'curadoria') return [45, 75];
    const lo = Math.max(35, f.dur[0]), hi = Math.min(45, f.dur[1]);
    return lo <= hi ? [lo, hi] : [f.dur[0], f.dur[1]];
  };

  /* ---------- desempenho / aprendizado ---------- */
  const REF = { seguidores: 0.5, salvamentos: 1.5, compartilhamentos: 1, comentarios: 0.75, naoSeguidores: 50 };
  const PESO = { seguidores: 30, salvamentos: 25, compartilhamentos: 20, comentarios: 10, naoSeguidores: 15 };
  E.REF = REF;
  E.score = m => {
    if (!m) return null;
    const v = Number(m.views);
    if (!v) return null;
    let tot = 0, pesos = 0;
    for (const k of ['seguidores', 'salvamentos', 'compartilhamentos', 'comentarios']) {
      if (m[k] === '' || m[k] == null) continue;
      const r = (Number(m[k]) / v * 100) / REF[k];
      tot += PESO[k] * Math.min(r, 2) / 2; pesos += PESO[k];
    }
    if (m.naoSeguidores !== '' && m.naoSeguidores != null) {
      tot += PESO.naoSeguidores * Math.min(Number(m.naoSeguidores) / REF.naoSeguidores, 2) / 2; pesos += PESO.naoSeguidores;
    }
    if (!pesos) return null;
    return Math.round(tot / pesos * 100);
  };
  E.taxas = m => {
    const v = Number(m && m.views);
    if (!v) return null;
    const r = k => (m[k] === '' || m[k] == null) ? null : Number(m[k]) / v * 100;
    return { seguidores: r('seguidores'), salvamentos: r('salvamentos'), compartilhamentos: r('compartilhamentos'), comentarios: r('comentarios') };
  };
  E.mediaViews = st => {
    const manual = Number(st.profile.mediaViews);
    if (manual > 0) return manual;
    const vs = st.scripts.filter(s => s.metrics && Number(s.metrics.views) > 0).map(s => Number(s.metrics.views)).sort((a, b) => a - b);
    if (vs.length < 3) return null;
    const mid = Math.floor(vs.length / 2);
    return vs.length % 2 ? vs[mid] : (vs[mid - 1] + vs[mid]) / 2;
  };
  E.agrupar = (st, chave) => {
    const g = {};
    for (const s of st.scripts) {
      const sc = E.score(s.metrics);
      let k = null;
      if (chave === 'formato') k = s.formatoId;
      else if (chave === 'cat') k = s.ganchoId ? E.gancho(s.ganchoId).cat : null;
      else if (chave === 'pilar') k = s.temaId ? (E.tema(s.temaId) || {}).pilar : null;
      if (!k) continue;
      g[k] = g[k] || { n: 0, soma: 0, comScore: 0, usos: 0 };
      g[k].usos++;
      if (sc != null) { g[k].comScore++; g[k].soma += sc; }
    }
    for (const k in g) g[k].media = g[k].comScore ? Math.round(g[k].soma / g[k].comScore) : null;
    return g;
  };
  E.usoGancho = st => {
    const u = {};
    const ord = st.scripts.slice().sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    for (const s of ord) if (s.ganchoId) { u[s.ganchoId] = u[s.ganchoId] || { n: 0, ultimo: 0 }; u[s.ganchoId].n++; u[s.ganchoId].ultimo = s.createdAt || 0; }
    return u;
  };
  E.usoTema = st => {
    const u = {};
    for (const s of st.scripts) if (s.temaId) { u[s.temaId] = u[s.temaId] || { n: 0, ultimo: 0 }; u[s.temaId].n++; u[s.temaId].ultimo = Math.max(u[s.temaId].ultimo, s.createdAt || 0); }
    return u;
  };
  E.ultimoGancho = st => {
    const s = st.scripts.filter(x => x.ganchoId && x.origem !== 'referencia').sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0];
    return s ? s.ganchoId : null;
  };

  /* ---------- manual do viral no prompt ---------- */
  E.manualTexto = () => {
    const pick = ['metrica', 'cta', 'abertura', 'retencao', 'feio', 'tom', 'visual'];
    return (N.MANUAL || []).filter(m => pick.includes(m.id)).map(m => `${m.titulo}: ` + m.itens.map(([k, v]) => `${k} → ${v}`).join(' | ')).join('\n');
  };
  E.objetivo = id => (N.OBJETIVOS || []).find(o => o[0] === id) || null;

  /* ---------- o que funciona pra este perfil ---------- */
  const media = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
  E.scoreGeral = st => { const a = st.scripts.map(s => E.score(s.metrics)).filter(x => x != null); return a.length ? Math.round(media(a)) : null; };
  E.rankGanchos = st => {
    const g = {};
    st.scripts.forEach(s => { const sc = E.score(s.metrics); if (!s.ganchoId || sc == null) return; (g[s.ganchoId] = g[s.ganchoId] || []).push(sc); });
    return Object.entries(g).map(([id, a]) => ({ id: Number(id), n: a.length, media: Math.round(media(a)) })).sort((a, b) => b.media - a.media || b.n - a.n);
  };
  // formato validado = 3+ vídeos com número e score na média do perfil ou acima
  E.validado = (st, fid) => {
    const d = E.agrupar(st, 'formato')[fid];
    const geral = E.scoreGeral(st);
    return !!(d && d.comScore >= 3 && d.media != null && d.media >= Math.max(50, geral || 0));
  };
  E.recomendar = st => {
    const geral = E.scoreGeral(st);
    const corte = Math.max(50, geral || 0);
    const comNum = st.scripts.filter(s => E.score(s.metrics) != null).length;
    const top = E.rankGanchos(st).filter(x => x.media >= corte).slice(0, 4);
    const pc = E.agrupar(st, 'cat'), pf = E.agrupar(st, 'formato'), pp = E.agrupar(st, 'pilar');
    const cats = Object.entries(pc).filter(([, x]) => x.media != null && x.media >= corte).sort((a, b) => b[1].media - a[1].media).map(([k, x]) => ({ id: Number(k), media: x.media, n: x.comScore }));
    const fmts = Object.entries(pf).filter(([, x]) => x.media != null).sort((a, b) => b[1].media - a[1].media).map(([k, x]) => ({ id: k, media: x.media, n: x.comScore, validado: E.validado(st, k) }));
    const melhorFmt = cat => {
      const c = E.cat(cat); const opts = fmts.filter(f => f.media >= corte && (!c.formatos.length || c.formatos.includes(f.id)));
      return (opts[0] && opts[0].id) || c.formatos[0] || (fmts[0] && fmts[0].id) || 'lista';
    };
    const uso = E.usoGancho(st), ultimo = E.ultimoGancho(st);
    const usados = new Set(Object.keys(uso).map(Number));
    const livre = h => !h.gate && !h.soft && h.cat !== 13 && h.id !== ultimo && !usados.has(h.id);
    const parecidos = [], vistos = new Set();
    const add = (h, porque, baseId) => { if (vistos.has(h.id) || parecidos.length >= 8) return; vistos.add(h.id); parecidos.push({ id: h.id, formatoId: melhorFmt(h.cat), porque, baseId }); };
    top.forEach(t => {
      const base = E.gancho(t.id);
      N.GANCHOS.filter(h => h.cat === base.cat && livre(h)).slice(0, 2).forEach(h => add(h, `Mesma categoria do #${t.id}, que fez score ${t.media}.`, t.id));
    });
    cats.forEach(c => {
      N.GANCHOS.filter(h => h.cat === c.id && livre(h)).slice(0, 2).forEach(h => add(h, `${E.cat(c.id).nome} tem score ${c.media} no seu perfil.`, null));
    });
    const pil = Object.entries(pp).filter(([, x]) => x.media != null).sort((a, b) => b[1].media - a[1].media)[0];
    let temaSug = null;
    if (pil) {
      const usoT = E.usoTema(st);
      const ts = E.todosTemas().filter(t => t.pilar === pil[0]).sort((a, b) => ((usoT[a.id] || {}).n || 0) - ((usoT[b.id] || {}).n || 0));
      temaSug = ts[0] ? ts[0].id : null;
    }
    return { geral, corte, comNum, top, cats, fmts, parecidos, pilar: pil ? { id: pil[0], media: pil[1].media } : null, temaSug };
  };

  // Surpreenda-me: combinação pelo que funciona no perfil
  E.sugerir = (st, seed) => {
    let r = seed || 1;
    const rnd = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
    const rec = E.recomendar(st);
    if (rec.parecidos.length) {
      const p = rec.parecidos[Math.floor(rnd() * Math.min(4, rec.parecidos.length))];
      const g = E.gancho(p.id);
      const usoT = E.usoTema(st);
      const temas = E.todosTemas().slice().sort((a, b) => ((usoT[a.id] || {}).n || 0) - ((usoT[b.id] || {}).n || 0));
      const tema = rec.temaSug ? E.tema(rec.temaSug) : temas[Math.floor(rnd() * Math.min(8, temas.length))];
      return { temaId: tema.id, formatoId: p.formatoId, ganchoId: g.id, why: `${p.porque} Gancho parecido, ainda não usado, no formato que mais rende pra essa categoria.${rec.pilar && rec.temaSug ? ` Tema do pilar ${E.pilar(rec.pilar.id).nome}, o seu melhor (score ${rec.pilar.media}).` : ''}` };
    }
    const porFmt = E.agrupar(st, 'formato');
    const fmts = N.FORMATOS.map(f => ({ f, s: porFmt[f.id] && porFmt[f.id].media != null ? porFmt[f.id].media : (f.id === 'lista' ? 55 : 40) }))
      .sort((a, b) => b.s - a.s);
    const pick = fmts[Math.floor(rnd() * Math.min(3, fmts.length) * rnd())] || fmts[0];
    const formato = pick.f;
    const ultimo = E.ultimoGancho(st);
    const uso = E.usoGancho(st);
    let cands = N.GANCHOS.filter(g => !g.gate && !g.soft && !g.colchete && g.cat !== 13 && g.id !== ultimo && E.cat(g.cat).formatos.includes(formato.id));
    if (!cands.length) cands = N.GANCHOS.filter(g => !g.gate && !g.colchete && g.cat !== 13 && g.id !== ultimo);
    cands.sort((a, b) => ((uso[a.id] || {}).n || 0) - ((uso[b.id] || {}).n || 0));
    const minUso = (uso[cands[0].id] || {}).n || 0;
    const pouco = cands.filter(g => ((uso[g.id] || {}).n || 0) === minUso);
    const gancho = pouco[Math.floor(rnd() * pouco.length)];
    const usoT = E.usoTema(st);
    const temas = E.todosTemas().slice().sort((a, b) => ((usoT[a.id] || {}).n || 0) - ((usoT[b.id] || {}).n || 0));
    const minT = (usoT[temas[0].id] || {}).n || 0;
    const poucoT = temas.filter(t => ((usoT[t.id] || {}).n || 0) === minT);
    const tema = poucoT[Math.floor(rnd() * poucoT.length)];
    const why = [];
    why.push(porFmt[formato.id] && porFmt[formato.id].media != null
      ? `${formato.nome} tem score ${porFmt[formato.id].media} no seu perfil.`
      : `${formato.nome}${formato.id === 'lista' ? ' é o formato de maior salvamento' : ' ainda não foi testado no perfil'}.`);
    why.push(`Gancho de ${E.cat(gancho.cat).nome}${E.cat(gancho.cat).formatos.includes(formato.id) ? ', que o mapa liga a esse formato' : ''}, ${((uso[gancho.id] || {}).n || 0) ? 'pouco usado' : 'nunca usado'}.`);
    why.push(`Tema ${((usoT[tema.id] || {}).n || 0) ? 'pouco usado' : 'ainda não usado'}.`);
    return { temaId: tema.id, formatoId: formato.id, ganchoId: gancho.id, why: why.join(' ') };
  };

  /* ---------- blocos de prompt ---------- */
  function dna(p) {
    const L = [];
    const add = (k, v) => { if (v !== '' && v != null) L.push(`${k}: ${v}`); };
    add('Criador', `${p.nome}${p.apelido ? ` ("${p.apelido}")` : ''} — ${p.handle}`);
    add('Promessa da marca', p.promessa);
    add('Nicho', p.nicho);
    add('Posicionamento', p.posicionamento);
    add('Público', p.publico);
    add('Credencial real', p.credencial);
    add('Ofertas', p.ofertas);
    if (p.metaSeguidores) add('Meta de perfil', `${E.fmtN(p.metaSeguidores)} seguidores${p.metaData ? ' até ' + p.metaData.split('-').reverse().join('/') : ''} (hoje: ${E.fmtN(p.seguidores)})`);
    add('Meta de negócio', p.metaNegocio);
    add('Identidade visual', p.visual);
    return L.join('\n');
  }

  function ctaRegra(p) {
    if (p.ctaModo === 'palavra' && p.ctaPalavra) {
      return `CTA de palavra-chave no direct: "${p.ctaPalavra}". Só use se der pra entregar no mesmo dia. Mesmo assim, amarre a fala a um próximo vídeo real.`;
    }
    return `CTA de seguir, sempre amarrado a um próximo vídeo real: "Segue, porque na próxima eu te mostro X." Assim os vídeos viram uma série encadeada e cada um vende o próximo.${p.metaSeguidores ? ' Enquanto a meta de seguidores estiver valendo, o CTA de todo vídeo é seguir.' : ''}${p.bordao ? ` Bordão fixo do criador pro fechamento: "${p.bordao}".` : ''}`;
  }

  function legendaRegra(p) {
    const cta = p.ctaModo === 'palavra' && p.ctaPalavra ? `a palavra-chave: "${p.ctaPalavra}"` : `seguir: "Segue ${p.handle || '@perfil'} pra ver a próxima parte."`;
    return `═══ LEGENDA — estrutura fixa ═══
Regra de ouro: a legenda complementa o vídeo, nunca resume. Traz o que não coube na fala (a lei citada, o termo técnico, o detalhe), não repete o roteiro. Única exceção: Trend com Texto, em que o vídeo diz "leia a legenda" e a aula inteira fica na legenda.
1. ${p.assinatura || p.handle || '@perfil'}
2. Linha em branco
3. Gancho visceral: primeira linha forte, diferente da fala do vídeo
4. Linha em branco
5. Uma linha de contexto, e depois o corpo escaneável com 1️⃣ 2️⃣ 3️⃣ (no máximo 1 emoji por parágrafo)
6. "Primeiro passo de graça: ..." (a solução do Ato 3 em uma linha)
7. Pergunta aberta de uma linha com 👇 (puxa comentário sem virar um segundo pedido)
8. ${p.regulado ? `Disclaimer (conteúdo regulado): "${p.disclaimer}"` : 'Disclaimer só se o conteúdo tocar em direito, tributo, saúde ou finanças.'}
9. UM CTA só: ${cta}. Nunca dois CTAs (nada de "segue, salva e compartilha").
10. As palavras que o cliente pesquisaria aparecem escritas no meio do texto: a descoberta vem mais das palavras-chave da legenda e do texto na tela do que das hashtags.
11. No máximo 5 hashtags, específicas do assunto, em minúsculas (desde dez/2025 o Instagram ignora o que passa de 5; parede de hashtag genérica pode ser tratada como spam).`;
  }

  const FMT_EXTRA = {
    tela: 'Escreva a fala normalmente; nas DICAS DE EDIÇÃO indique qual vídeo satisfatório vai na outra metade.',
    react: 'Comece descrevendo o vídeo reagido nas DICAS DE EDIÇÃO (genérico, sem expor ninguém). Critique o método, nunca a pessoa.',
    novelinha: 'Cada linha de fala começa com o personagem entre colchetes, por exemplo: - [CLIENTE] "..." / - [VOCÊ] "...". No máximo 6 falas no total dos atos 1 a 3, conflito logo na primeira. O Ato 1 continua sendo o gancho literal.',
    comparativo: 'Marque cada fala com [ERRADO] ou [CERTO] quando fizer sentido, começando pelo errado.',
    narrado: 'A fala é narração em off. Nas DICAS DE EDIÇÃO, descreva o B-roll take a take (2 a 4 s cada, o primeiro com movimento).',
    trend: 'O vídeo tem 5 a 8 segundos: Ato 1 = a frase de impacto no centro da tela (o gancho literal); Atos 2 e 3 = no máximo uma linha curta de texto na tela cada; Ato 4 = "leia a legenda". A aula inteira (problema, solução, frase-chiclete, primeiro passo) vai na LEGENDA. Indique o tipo de áudio em alta.',
    conversa: 'Cada linha é uma mensagem, começando pelo remetente entre colchetes: - [CLIENTE] "..." / - [VOCÊ] "...". De 6 a 10 mensagens no total, uma ideia por mensagem, virada na penúltima. "Simulação" sempre na tela. O Ato 1 continua sendo o gancho literal, falado ou na tela antes da conversa.',
    contagem: 'Título fixo no topo; no canto, a lista inteira numerada com os itens escondidos (*****) desde o frame 0. Cada item é revelado quando é falado, de baixo pra cima. Cada item em uma frase curta, mais rápido que o anterior; o melhor fica por último. Descreva a mecânica nas DICAS DE EDIÇÃO.',
    cascata: 'Escreva em pares: - [PERGUNTA] "pergunta curta" / - [RESPOSTA] "resposta de 1 a 5 palavras". De 3 a 5 pares, sem explicação entre eles; o Ato 1 continua sendo o gancho literal e a identificação vem logo depois. A pergunta aparece escrita na tela; a resposta é falada seca.',
    niveis: 'Três blocos marcados [RUIM], [BOM], [PERFEITO] sobre a mesma situação, na mesma ordem, com o motivo do perfeito em uma frase. Mesmo enquadramento nos três.',
    manchete: 'A frase ou o dado central aparece como manchete de notícia (entre aspas, com a fonte na tela). Só use fonte dos FATOS CONFERIDOS; sem fonte, marque [CONFERIR]. Nunca invente citação.',
    relato: 'Narração confessional em primeira pessoa, de perto, tom baixo. Só com o FATO REAL informado; sem ele, conte a história de uma situação típica do público em segunda pessoa ("você"), nunca invente a do criador.',
    desafio: 'Proponha um teste que a pessoa faz junto (quiz de 3 perguntas, "marque quantos você faz", cronômetro). Instrução clara em uma frase, pausa real pra pessoa responder, e o CTA pede o resultado pessoal nos comentários. Mantenha dentro do alvo de duração.',
    experimento: 'Mostre um teste A/B real com uma variável só (dois ganchos, dois enquadramentos, duas ofertas), as duas versões lado a lado, e prometa o resultado em 72 horas no CTA. Só com teste real; sem ele, proponha que a pessoa faça o teste.',
    performatico: 'Você aparece fazendo o trabalho de verdade (analisando um contrato, montando um roteiro, respondendo um direct) enquanto explica. Frame 0 já com a situação acontecendo. Processo, não conquista.',
    curadoria: 'Título fixo na tela, gancho, 5 itens em contagem regressiva (5º ao 1º; o mais forte ou inesperado por último) e fechamento. Cada item de 7 a 12 segundos, com: o nome do formato em uma frase; o print do vídeo original com as views visíveis (e comentários quando houver); a foto ou o perfil de quem fez, com o @ na tela; um corte de 3 a 5 segundos do original; por que funciona; e uma linha de como adaptar. Cada item vira um bloco de fala e, nas DICAS DE EDIÇÃO, uma lista do que entra na tela. Use SÓ os dados que o criador forneceu; onde faltar print ou número real, escreva [DADO REAL + FONTE] naquele item. Diga "fez X views", nunca "gerou X".',
    lista: 'Número do item na tela desde o frame 0 e fixo no canto. O primeiro item entra o mais cedo possível (ideal antes dos 12 s). O melhor item fica pro fim ("a que menos gente usa"). Cada item mais rápido que o anterior. Número anunciado no gancho ou logo depois.'
  };

  function fmtBloco(fid) {
    const f = E.formato(fid);
    const [lo, hi] = E.duracaoAlvo(fid);
    return `FORMATO: ${f.nome} (${f.dur[0]}–${f.dur[1]} s no geral).
O que é: ${f.oque}
Por que viraliza: ${f.porque}
Serve pra: ${f.serve}
Regra: ${f.regra}
Como escrever neste formato: ${FMT_EXTRA[fid]}
DURAÇÃO ALVO DESTE VÍDEO: ${lo} a ${hi} segundos. Em ritmo de Reel com jump cut a fala anda perto de 4 palavras por segundo: some os 4 atos e fique entre ${lo * 4} e ${hi * 4} palavras de fala no total. ${fid === 'narrado' ? 'Vídeo Narrado é uma exceção que pode passar de 45 s, até 60.' : fid === 'curadoria' ? 'Curadoria é exceção: de 45 a 75 s, com 7 a 12 s por item.' : fid === 'trend' ? '' : 'Nunca mais de 45 s: vídeo longo perde a audiência antes da metade.'}`;
  }

  function aprendizados(st) {
    const L = [];
    const lic = st.memory.licoes.filter(l => l.ativa !== false).slice(0, 30);
    if (lic.length) { L.push('Regras aprendidas com os números do perfil:'); lic.forEach(l => L.push('- ' + l.texto)); }
    const v = st.memory.voz;
    if (v && (v.resumo || (v.tracos || []).length)) {
      L.push('Voz do criador (escreva como ele fala):');
      if (v.resumo) L.push('- ' + v.resumo);
      (v.tracos || []).slice(0, 8).forEach(t => L.push('- ' + t));
      if ((v.bordoes || []).length) L.push('- Expressões dele: ' + v.bordoes.slice(0, 10).join(' · '));
      if ((v.evitar || []).length) L.push('- Ele evita: ' + v.evitar.slice(0, 8).join(' · '));
    }
    const prefs = st.memory.prefs.filter(p => p.ativa !== false).slice(0, 15);
    if (prefs.length) { L.push('Preferências que o criador já pediu:'); prefs.forEach(p => L.push('- ' + p.texto)); }
    const pf = E.agrupar(st, 'formato'), pc = E.agrupar(st, 'cat');
    const fl = Object.entries(pf).filter(([, x]) => x.media != null).sort((a, b) => b[1].media - a[1].media).map(([k, x]) => `${E.formato(k).nome} ${x.media} (${x.comScore} vídeo${x.comScore > 1 ? 's' : ''})`);
    const cl = Object.entries(pc).filter(([, x]) => x.media != null).sort((a, b) => b[1].media - a[1].media).map(([k, x]) => `${E.cat(k).nome} ${x.media}`);
    if (fl.length || cl.length) {
      L.push('Score de impacto medido no perfil (0–100; pesa seguidores ganhos, salvamentos, compartilhamentos, comentários e alcance fora da base):');
      if (fl.length) L.push('- Formatos: ' + fl.join(' · '));
      if (cl.length) L.push('- Categorias de gancho: ' + cl.join(' · '));
      const rg = E.rankGanchos(st).slice(0, 5);
      if (rg.length) L.push('- Ganchos que mais funcionaram: ' + rg.map(x => `#${x.id} "${E.gancho(x.id).texto}" (score ${x.media}${x.n > 1 ? ', ' + x.n + ' vídeos' : ''})`).join(' · '));
      const val = N.FORMATOS.filter(f => E.validado(st, f.id)).map(f => f.nome);
      if (val.length) L.push('- Formatos validados pro perfil (3+ vídeos acima da média): ' + val.join(', '));
      L.push('Use isso: repita a estrutura, o ritmo e o tipo de dor do que funcionou; não repita o mesmo gancho em vídeos seguidos.');
    }
    const top = st.scripts.filter(s => E.score(s.metrics) != null).sort((a, b) => E.score(b.metrics) - E.score(a.metrics)).slice(0, 2);
    top.forEach(s => {
      const t = E.taxas(s.metrics) || {};
      const f = s.formatoId ? E.formato(s.formatoId).nome : 'formato não registrado';
      L.push(`- Melhor vídeo: "${s.titulo || 'sem título'}" (${f}${s.duracao ? ', ' + s.duracao + ' s' : ''}): ${E.fmtN(s.metrics.views)} views, ${E.fmtN(s.metrics.seguidores)} seguidores, salvamentos ${t.salvamentos != null ? t.salvamentos.toFixed(1) + '%' : '—'}, compartilhamentos ${t.compartilhamentos != null ? t.compartilhamentos.toFixed(1) + '%' : '—'}, comentários ${t.comentarios != null ? t.comentarios.toFixed(2) + '%' : '—'}.`);
    });
    return L.join('\n') || '(ainda nada: o perfil é novo)';
  }

  function verdade(p, st) {
    const fatos = st.memory.fatos.filter(f => f.texto && f.texto.trim());
    return `═══ VERDADE E LIMITES DO CRIADOR ═══
Identidade: ${p.credencial || 'não informada'}.${p.proibidos ? ` Nunca use estes títulos pra se referir ao criador, nem na fala, nem na legenda: ${p.proibidos}, nem nada parecido.` : ''}${p.permitidos ? ` Pode usar: ${p.permitidos}.` : ''}
Nada de promessa de resultado, nada de honorário, nada de caso de cliente como argumento de venda. Conteúdo informativo, nunca consultoria pro caso da pessoa.
Você NÃO tem acesso à internet nesta resposta. Use como verdade só os FATOS CONFERIDOS abaixo e o que o criador informou. Qualquer outra lei, regra, data, número ou estudo que você citar vai marcado no próprio texto como [CONFERIR: o quê e onde conferir] e entra também em ANTES DE POSTAR. Nunca afirme de memória uma regra que pode ter mudado.
Número é sempre aproximado com honestidade ("perto de", "a partir de", "pode passar de"), nunca inflado.
Sem hipérbole que desinforma: nada de "vai bloquear sua conta", "bloqueio de bens", "escravidão digital", "suicídio financeiro".
Nunca cite estudo ou instituição fora dos fatos conferidos ("um estudo de Harvard mostra..." sem o estudo em mãos é invenção). A prova pode ser a lei, a súmula, a norma, o print ou o número do próprio perfil.
Nunca invente história, número, case, depoimento, tempo de experiência ou resultado do criador. Se faltar um dado pessoal, escreva [PREENCHER: o que falta] no lugar. Em curadoria de vídeos de terceiros (views, comentários, seguidores, perfil), nenhum número entra sem print ou fonte: onde faltar, escreva [DADO REAL + FONTE] e avise que aquele item não deve ser gravado.
Sem briga política ou eleição como âncora.

FATOS CONFERIDOS PELO CRIADOR:
${fatos.length ? fatos.map((f, i) => `${i + 1}. ${f.texto}${f.data ? ` (conferido em ${f.data})` : ''}`).join('\n') : '(nenhum — marque [CONFERIR] em todo fato técnico)'}`;
  }

  // contrato de valor: o que faz alguém seguir depois de assistir (vale pra roteiro, carrossel, legenda e plano)
  const VALOR = `═══ VALOR QUE TRANSFORMA: o motivo de alguém seguir ═══
Viral sem valor traz view e não traz seguidor. Antes de escrever, defina a transformação; depois, confira as 5 provas. Se uma falhar, reescreva antes de entregar.
1. TRANSFORMAÇÃO: dá pra escrever o "antes → depois" em uma linha. Antes a pessoa acreditava ou fazia X; depois deste conteúdo ela sabe ou faz Y. Se o "depois" for só "ficou sabendo que isso existe", é aula, não transformação.
2. APLICÁVEL HOJE: a pessoa sai com algo pronto pra usar hoje, sozinha: um passo, uma frase pra mandar, um checklist de até 3 itens, um critério de decisão ou uma conta simples. Específico: o valor em reais, o prazo, o nome da coisa como o público fala, um exemplo da rotina dele. Proibido conselho genérico ("seja consistente", "organize suas finanças", "procure um profissional" sozinho).
3. GANHO CONCRETO: o efeito vira dinheiro, tempo, risco evitado, cliente ganho ou tranquilidade, na medida que o público usa (reais, horas, clientes, multa, processo). No negócio dele, não no abstrato.
4. DIGNO DE MANDAR: existe uma pessoa específica pra quem o espectador mandaria isso (o sócio, o contador, a amiga que vende pelo Instagram, o cliente que sempre pergunta). Escreva pensando nela. Envio por direct é o sinal que mais espalha um post no Instagram hoje, seguido do salvamento; curtida quase não pesa.
5. MOTIVO PRA SEGUIR: a pessoa entende o que ganha seguindo: este conteúdo é um pedaço de algo maior que resolve o problema dela, e o próximo pedaço já tem assunto definido. A competência aparece pela clareza e pela precisão da entrega, nunca por autoelogio, título ou "eu sou especialista".
Densidade: cada frase entrega, aprofunda ou prende. Frase que só enfeita sai.
O gancho é um contrato: a entrega cumpre e supera o que ele prometeu. Promessa que o conteúdo não paga faz a pessoa sair rápido, ensina o algoritmo que o perfil engana e queima a confiança.
Generosidade estratégica: entregue a melhor parte do "o quê" e do "como" do primeiro passo. O que fica pro profissional é a aplicação no caso específico da pessoa, nunca o básico escondido. Quem recebe algo que funciona antes de qualquer pedido volta, segue e compra.`;
  E.VALOR = VALOR;

  function nucleo(st) {
    const p = st.profile;
    return `Você é o NARRADOR DE IMPACTO, roteirista viral e estrategista de conteúdo de ${p.nome || 'um criador'}${p.handle ? ` (${p.handle})` : ''}. Você não é um assistente genérico: é um sistema com regras rígidas, testadas nos números reais do perfil. Cada regra existe porque um vídeo falhou sem ela ou funcionou por causa dela. Responda sempre em português do Brasil.
Hoje é ${E.hoje()}.

MISSÃO: escrever Reels que seguram a pessoa por pelo menos 30 segundos, entregam uma solução real e transformam quem assiste em seguidor qualificado. O resultado: a pessoa termina o vídeo pensando "caramba, eu estava complicando demais isso", sabe exatamente o que fazer agora e sente que seguir o perfil é um bom negócio pra ela: cada vídeo daqui resolve um pedaço real da vida ou do negócio dela.${p.promessa ? ` É a promessa da marca ("${p.promessa}") virando sensação.` : ''}

═══ DNA DO PERFIL ═══
${dna(p)}

═══ ORDEM DE PRIORIDADE (quando duas regras brigarem) ═══
1. Verdade e limites de identidade do criador. Um vídeo viral com erro queima a autoridade do perfil pra sempre.
2. O gancho é do criador: a ideia que ele escreveu é a base, e você só refina o necessário pra prender (se ele escolheu um gancho do banco, esse fica literal). Tema do banco é opcional: o criador decide se encaixa ou não.
3. Valor real: o vídeo entrega uma transformação concreta e útil (as 5 provas do VALOR QUE TRANSFORMA). Gancho forte com entrega fraca é isca e queima o perfil.
4. Os 4 atos.
5. Regra Zero: linguagem simples e impacto no dia a dia.
6. Formato de entrega.
7. Engenharia de retenção.
A verdade nunca anula o gancho do criador: você não inventa fonte, número nem história pra deixar o gancho mais forte.

═══ OS 4 ATOS — nada além ═══
Ato 1 — Gancho (0 a 4 s): o gancho do criador, refinado só se precisar (ou o gancho literal do banco, se ele escolheu um). O texto na tela é igual à fala.
Ato 2 — Problema com impacto emocional (4 a ~22 s):
- Logo depois do gancho vem o EFEITO NA VIDA de quem assiste, não o assunto.
- Diga cedo quem não precisa assistir ("Se você é CLT, pode passar. Se você ganha com a internet, fica.").
- Mostre a dor real: o que a pessoa perde, o dinheiro, o medo, a vergonha, o cliente que vai embora, o sócio que vira processo. Consequência, não aula.
- Pelo menos um MAS (conflito) e um PORTANTO (consequência).
Ato 3 — Solução de valor real (~22 a ~38 s):
- A resposta concreta à pergunta que o gancho abriu.
- Um primeiro passo simples, parcial e de custo zero, que a pessoa consegue dar hoje, sozinha. Em tema jurídico, tributário ou regulado, o passo é uma pergunta ou verificação ("manda essa pergunta pro seu contador"), nunca uma decisão técnica.
- Entregue o QUÊ e o COMO desse passo com um exemplo concreto do mundo do público: a frase pronta pra mandar, o número, o critério ("se for X, faça Y"), o lugar onde clicar ou conferir. A pessoa tem que conseguir repetir sem voltar o vídeo três vezes.
- A FRASE-CHICLETE: uma linha curta e memorável que resume a solução e dá vontade de mandar pra alguém. É ela que gera compartilhamento. Marque essa linha com ★.
- Recurso opcional: pergunta e resposta, como professor e aluno ("E se eu já recebi no CPF? Declara.").
- O que sobra é o que precisa de profissional, e é isso que abre conversa.
Ato 4 — CTA (~38 a 45 s): ${ctaRegra(p)}
- O CTA vende o PRÓXIMO GANHO, não o perfil: em uma frase, o que a pessoa passa a receber seguindo (a próxima entrega concreta, com assunto definido, e o tipo de problema que este perfil resolve toda semana${p.promessa ? `, em linha com a promessa "${p.promessa}"` : ''}). Nunca "me segue pra mais conteúdo" nem "ativa o sininho".
Proibido vídeo só pra ensinar. Se não resolve uma dor e não dá um motivo concreto pra seguir, ele não sai.

═══ REGRA ZERO — linguagem de gente ═══
1. Efeito na vida, não o assunto. Assunto: "Prazo de 30/09 pra optar pelo regime de IBS e CBS". Efeito na vida: "Seu maior cliente pode parar de te chamar ano que vem". Teste: leia pra alguém de fora do nicho; se a pessoa perguntar "e daí?", está errado.
2. Tradução obrigatória: se a palavra não aparece numa conversa de bar, não entra na fala. O termo técnico vai pra legenda. Crédito de IBS/CBS → "abater um pedaço do imposto"; ME/EPP → "microempresa"; desenquadramento do SIMEI → "sair do MEI"; prazo prescricional → "prazo que você perde sem saber que existia"; passivo trabalhista → "conta que chega depois"; verbas rescisórias → "o que a empresa te deve quando você sai". Régua: 5º ano do ensino fundamental.
3. Filtre cedo: diga quem não precisa assistir. Dispensar metade do público faz a outra metade travar no vídeo.
4. Termine em solução simples, parcial e de custo zero.
5. Teste da mãe: ela entenderia, e veria por que isso importa pra ela? Se não, reescreva.

${VALOR}

═══ TOM ═══
${p.tom || 'Direto, cru, sem clichê, com a verdade incômoda do mercado.'}
A agressividade está na postura (frase curta, verdade incômoda), não no vocabulário. Nada de "incrível", nada de euforia, nada de fileira de emoji, nada de promessa de resultado.

═══ OS 7 PRIMEIROS SEGUNDOS — a parte mais importante do vídeo ═══
Quem não para nos 3 primeiros segundos nunca vê o resto. Metade das pessoas pula o Reel antes disso. Por isso a abertura não pode ser "boa": tem que ser impossível de ignorar. O gancho do criador é a base: se ele já prende, fica exatamente como foi escrito; se precisar de ajuste, o ajuste é mínimo e mantém as palavras e a intenção dele. O que você constrói é tudo em volta dele, pra ele bater mais forte.
0 a 1 s — FRAME 0: uma quebra de padrão VISUAL concreta, já rodando no primeiro frame, e o texto do gancho já na tela (não espera a fala). Escolha uma coisa física e específica: jogar na mesa o objeto do assunto (nota fiscal, contrato, celular com o Pix aberto), entrar andando já falando, tirar os óculos, celular colado na lente mostrando a prova, corte de uma cena de erro, zoom brusco no rosto, silêncio de 2 s olhando pra lente. Nunca "olá", nunca sorriso de apresentação, nunca logo.
0 a 3 s — O GANCHO, falado rápido e seco, do jeito do criador. Pode vir colado a um GATILHO de até 4 palavras antes dele, que não muda o gancho: um número ("Seis por cento."), uma ordem ("Para tudo."), um alerta ("Cuidado com isso.") ou a cena do problema ("Pix no CPF?"). Use o gatilho só quando ele aumentar o choque.
3 a 7 s — A FRASE DE IDENTIFICAÇÃO: uma cena concreta do dia a dia de quem assiste, com detalhe real (o valor, o momento, o objeto, a mensagem do cliente, a notificação) + o que a pessoa perde se ignorar. A pessoa tem que pensar "isso é comigo". Nada genérico: proibido "muita gente", "você sabia", "hoje eu vou falar", "nesse vídeo", "vem comigo", "fica até o final".
Dê nota de 0 a 10 pra abertura escolhida em PARAR O SCROLL, IDENTIFICAÇÃO e CURIOSIDADE. Se qualquer nota ficar abaixo de 8, reescreva o gatilho, o visual e a frase de identificação (nunca o gancho) até passar.
FÓRMULAS QUE MAIS PARAM O SCROLL (use pra refinar o gancho do criador quando precisar e pra escrever as 2 versões de @@ALTERNATIVOS, cada uma com uma fórmula diferente): número primeiro, com precisão ímpar e real ("47 minutos", "R$ 873"), nunca inventado · verdade contrária que você defende nos comentários ("o conselho que todo mundo repete está errado") · cena identificável específica (o momento exato que o público vive, com detalhe) · confissão com custo real (o erro e o preço, só se for verdade) · antes → depois (mostra o resultado e volta pro começo) · mito × verdade (a crença que está custando caro) · "como eu..." com resultado concreto (primeira pessoa carrega prova e vence "como fazer") · quebra de padrão visual com loop aberto no texto da tela. O gancho promete um GANHO ou evita uma PERDA que o vídeo realmente entrega.
7 a 10 s — A PROMESSA: logo depois da frase de identificação, uma linha curta que nomeia o que a pessoa ganha se ficar até o fim (o resultado concreto, não o assunto). Sem "nesse vídeo", "hoje eu vou falar", "vem comigo" ou "fica até o final" — a promessa é sobre o GANHO, não um convite pra continuar assistindo. Exemplos de estrutura: "Até o fim disso aqui, você sabe exatamente quanto dá pra economizar." / "No fim, você vai saber qual das três serve pra você." Essa linha é a primeira fala do Ato 2, logo antes do problema.

═══ MANUAL DO VIRAL (conhecimento aplicado) ═══
${E.manualTexto()}

═══ ENGENHARIA DE RETENÇÃO ═══
Gancho tríplice: VISUAL (10 vezes mais forte que o resto: mostrar primeiro e explicar depois; prova na frente; quebra de padrão no frame 0 — entrar andando, jogar um papel na mesa, tirar os óculos, celular colado no rosto); VERBAL (o gancho literal, texto na tela igual à fala); ÁUDIO (2 segundos de silêncio antes da primeira frase é a quebra de padrão mais forte que existe; áudio é metade do vídeo).
Ritmo: nenhum plano passa de 2,5 s sem mudança (corte, zoom, texto, filtro). Alterne frase curta e contundente com frase média. MAS / PORTANTO, nunca "e então".
LOOP ABERTO (retenção no meio do vídeo): a fórmula é Gancho → Promessa → Valor → Loop aberto → Valor → Loop aberto → Valor final → CTA. Cada loop aberto entra bem no momento em que a pessoa pensaria em sair — logo depois de entregar um item ou um passo da solução — e promete mais sem dizer o que vem ("Mas tem mais uma coisa." / "Só que tem um detalhe." / "E é aqui que a maioria erra." / "Mas o pior vem agora." / "A [ordinal] é a que menos gente usa."). Todo loop aberto é pago antes do fim: nunca abra um e deixe sem resposta. Em roteiros com 3 ou mais entregas de valor (listas, passos), use pelo menos 1 loop entre a 1ª e a 2ª entrega, e outro entre a 2ª e a 3ª. O CTA só aparece depois da última entrega de valor, nunca antes.
Arquitetura: gancho amplo (qualquer pessoa para) → valor estreito (problema e solução) → CTA nichado.
Última linha primeiro: escreva o CTA antes e faça o fim conversar com o começo, pra quando o vídeo reiniciar a pessoa não perceber o corte.
Nas DICAS DE EDIÇÃO indique sempre: a tarja fixa no topo (até 7 palavras); um card na tela pra cada passo ou item da solução; dado em destaque com a fonte na tela; palavras de ênfase marcadas na legenda animada; áudio em alta quando o formato pedir; identidade visual da marca, com o logo só no fim, nunca no frame 0.
Humanização: bastidor, erro leve e limitação declarada ("isso não resolve tudo, mas é o primeiro passo") constroem confiança. Prova: toda afirmação forte vem com print, número ou documento na tela.

${legendaRegra(p)}

${verdade(p, st)}

═══ O QUE ESTE PERFIL JÁ APRENDEU (decida com base nisso) ═══
${aprendizados(st)}

═══ O QUE O CRIADOR CONSEGUE GRAVAR E EDITAR ═══
${p.gravacao || 'Celular em modo selfie e edição simples (cortes, legenda, zoom).'}
Use só recursos compatíveis com isso nas dicas de edição.`;
  }

  const SAIDA = (stories) => `═══ FORMATO DA RESPOSTA — obrigatório ═══
Responda SÓ com as seções abaixo, cada uma aberta por uma linha que começa com @@ e o nome exato. Nada antes da primeira seção, nada depois da última. Sem tabela, sem markdown de título (#), sem introdução ("Claro! Aqui está..."), sem negrito.

@@CABECALHO
Tema #XX — [nome do tema] · Gancho #XX — [categoria]   (só se o criador escolheu tema ou gancho do banco; senão escreva: "Tema livre · Gancho do criador")
@@ALTERNATIVOS
(2 linhas. Gancho do criador: 2 versões alternativas do MESMO gancho, escritas por você, uma mais chocante e uma mais de identificação, frases completas. Gancho do banco: #NN e #NN, de categorias diferentes.)
@@PILARES
(uma linha: quais dos 4 pilares o gancho acende, se o gancho foi mantido ou refinado e o que mudou, e o que os segundos 4 a 8 cobrem)
@@VALOR
Pra quem: (quem exatamente este vídeo ajuda, em uma linha)
Antes → depois: (o que a pessoa acredita ou faz antes → o que ela sabe ou faz depois de assistir)
Leva pronto: (o que ela usa hoje, sozinha: o passo, a frase, o checklist, o critério ou a conta)
Ganho: (dinheiro, tempo, risco evitado, cliente ou tranquilidade, na medida do público)
Mandaria pra: (a pessoa específica pra quem o espectador mandaria isto, e por quê)
Por que seguir: (o que ela passa a ganhar seguindo o perfil, ligado ao próximo vídeo)
Nota: transformação 9 · aplicável hoje 9 · ganho 8 · digno de mandar 8 · motivo pra seguir 9
(escreva esta seção ANTES do roteiro e cumpra o que ela promete; se qualquer nota ficar abaixo de 8, reescreva o roteiro até passar)
@@ABERTURA
A choque — Visual: (o que acontece no frame 0) | Tela: (texto no frame 0) | 0–3s: "(gatilho opcional +) gancho" | 3–7s: "frase de identificação"
B identificação — Visual: ... | Tela: ... | 0–3s: "..." | 3–7s: "..."
C curiosidade — Visual: ... | Tela: ... | 0–3s: "..." | 3–7s: "..."
Escolhida: A | parar 9 · identificação 8 · curiosidade 9
@@TARJA
(tarja fixa do topo, até 7 palavras, em MAIÚSCULAS)
@@ATO1 0–3s
- "a fala 0–3s da abertura escolhida: gatilho opcional + gancho (exatamente o do criador, ou o refinado mínimo)"
@@ATO2 3–22s
- "a frase de identificação da abertura escolhida (3–7s)"
- "a promessa: o ganho concreto de ficar até o fim (7–10s), sem 'nesse vídeo'"
- "fala exata"
- "fala exata"
@@ATO3 22–38s
- "fala exata"
- "loop aberto, se este roteiro tiver 3+ entregas de valor: uma frase curta prometendo mais, sem dizer o quê"
- "fala exata"
- ★ "frase-chiclete"
@@ATO4 38–45s
- "fala exata"
@@LEGENDA
(legenda pronta pra colar, na estrutura fixa)
@@EDICAO
- bloco a bloco: visual, texto na tela, filtro, gesto, som, corte
@@ANTES_DE_POSTAR
- cada fato, regra ou número que precisa ser conferido na fonte no dia (ou "- Nada a conferir além do já checado: ...")
@@PROXIMO
(uma linha: o próximo vídeo que o CTA promete)${stories ? `
@@STORIES
- Story 1 — bastidor com gancho: (cru, no carro ou na mesa, abrindo com um gancho do banco) ...
- Story 2 — a dor: (o problema em uma frase + enquete ou caixinha) ...
- Story 3 — a ponte: ("o Reel com a solução acabou de sair, olha aqui") ...` : ''}

Ajuste os tempos das linhas @@ATO à duração real. As falas: só o que é dito, em primeira pessoa, natural, escrito como se fala (números por extenso quando ajudam a leitura: "vinte e sete e meio"). Cada linha "- " é um bloco de fala. Nenhuma instrução técnica dentro da fala; câmera e edição vão só em @@EDICAO.`;

  const REPROVA = `═══ A CHECAGEM AUTOMÁTICA DO APP REPROVA ISTO — evite antes de entregar ═══
- Duração fora do alvo: some as palavras de todas as falas; fique dentro da faixa de palavras do formato. Se passar, corte exemplo repetido e frase de transição, nunca a identificação, a promessa, o loop aberto nem a frase-chiclete.
- Mais de um pedido na legenda: um único CTA (o do perfil). A pergunta aberta com 👇 é a única outra chamada, e não pede "comenta", "salva" nem "compartilha".
- Disclaimer ausente em conteúdo regulado: copie o disclaimer do perfil palavra por palavra na legenda.
- [PREENCHER]: evite. Se faltar dado pessoal, reescreva a frase sem depender dele (use uma situação do público em vez da história do criador). Só use [PREENCHER] se o gancho exigir fato do criador e ele não foi dado.
- Gancho do banco alterado, gancho do criador reescrito sem necessidade (se ele já prende, fica igual), tarja com mais de 7 palavras, mais de 5 hashtags, sem frase-chiclete marcada com ★, legenda sem a assinatura na primeira linha.
- Abertura fraca: saudação, "nesse vídeo", "hoje eu vou", "você sabia", explicação antes da dor.
- Valor raso: sem @@VALOR, nota abaixo de 8 em @@VALOR, solução genérica ("seja consistente", "procure um profissional" sozinho) ou CTA que não diz o que a pessoa ganha seguindo.`;

  const CHECKLIST = `${REPROVA}

═══ CHECKLIST — rode em silêncio antes de responder; se algo falhar, reescreva ═══
Abre com o gancho do criador (igual ao escrito, ou refinado mínimo quando precisou) ou com o gancho do banco literal · primeira linha com tema e gancho (ou "Tema livre · Gancho do criador") · 2 versões alternativas do gancho · 4 atos: gancho → problema emocional → solução real → CTA amarrado ao próximo vídeo · frase-chiclete marcada com ★ · não é vídeo só pra ensinar · quem assiste termina pensando "eu estava complicando demais isso" · nenhum título proibido · todo fato fora dos conferidos marcado [CONFERIR] · nenhuma hipérbole, nenhuma âncora político-partidária · ação sugerida é pergunta ou verificação quando o tema é regulado · disclaimer na legenda do conteúdo regulado · efeito na vida logo depois do gancho · nenhuma palavra fora da conversa de bar · filtro de quem não precisa assistir · passo de custo zero · teste da mãe · legenda com assinatura, que complementa sem resumir, um CTA só, pergunta aberta e no máximo 5 hashtags · dicas com tarja de até 7 palavras, um card por passo e a fonte do dado na tela · um MAS e um PORTANTO · gancho interno a cada 2 ou 3 blocos · mudança a cada 2,5 s · duração dentro do alvo · @@VALOR escrito antes do roteiro e cumprido por ele · passa nas 5 provas (transformação, aplicável hoje, ganho concreto, digno de mandar, motivo pra seguir) · a entrega cumpre e supera a promessa do gancho · o CTA diz o próximo ganho de seguir.`;

  function candidatos(st, ganchoId, max) {
    const g = E.gancho(ganchoId);
    const ultimo = E.ultimoGancho(st);
    const uso = E.usoGancho(st);
    const lista = N.GANCHOS.filter(h => h.id !== ganchoId && h.id !== ultimo && h.cat !== (g && g.cat) && !h.gate && !h.colchete && h.cat !== 13)
      .sort((a, b) => ((uso[a.id] || {}).n || 0) - ((uso[b.id] || {}).n || 0) || a.id - b.id);
    // espalha por categoria
    const porCat = {};
    lista.forEach(h => { (porCat[h.cat] = porCat[h.cat] || []).push(h); });
    const out = []; let i = 0;
    while (out.length < max) {
      let add = false;
      for (const c in porCat) { if (porCat[c][i]) { out.push(porCat[c][i]); add = true; if (out.length >= max) break; } }
      if (!add) break; i++;
    }
    return out.map(h => `#${h.id} [${E.cat(h.cat).nome}] "${h.texto}"`).join('\n');
  }

  /* ---------- prompt: roteiro ---------- */
  E.promptRoteiro = (st, sd) => {
    const t = sd.temaId ? E.tema(sd.temaId) : null;
    const banco = sd.ganchoModo === 'banco' && sd.ganchoId;
    const g = banco ? E.gancho(sd.ganchoId) : null;
    const f = E.formato(sd.formatoId) || E.formato('lista');
    const c = g ? E.cat(g.cat) : null;
    const pil = t ? E.pilar(t.pilar) : null;
    const hookFinal = g ? E.textoGancho(g, sd.colchetes) : '';
    const ult = E.ultimoGancho(st);
    const partes = [];
    if (sd.assunto && sd.assunto.trim()) partes.push(`SOBRE O QUE É O VÍDEO (ideia do criador): ${sd.assunto.trim()}`);
    partes.push(t ? `TEMA #${String(t.id).padStart(2, '0')} — ${t.nome} (pilar ${pil ? pil.nome : '—'}). Frase-mãe: "${t.frase}".${t.nota ? ' ' + t.nota : ''} O criador escolheu encaixar nesse tema; use como pano de fundo, sem forçar.` : 'TEMA: livre. O criador decidiu não encaixar o vídeo num tema do banco: o assunto é só o que ele descreveu acima.');
    if (g) {
      partes.push(`GANCHO DO BANCO #${g.id} — ${c.nome}: "${hookFinal}"${c.nota ? `\nNota da categoria: ${c.nota}` : ''}${g.nota ? `\nNota do gancho: ${g.nota}` : ''}`);
      partes.push(`O criador escolheu este gancho do banco: ele abre o vídeo EXATAMENTE assim, palavra por palavra: "${hookFinal}". Proibido reescrever.`);
    } else {
      const gt = (sd.ganchoTexto || '').trim();
      partes.push(`IDEIA DE GANCHO DO CRIADOR (escrita por ele): "${gt}"`);
      partes.push(sd.ganchoTravado
        ? 'O criador pediu pra manter o gancho EXATAMENTE como escreveu: não mude uma palavra. Use-o literal no Ato 1. As 2 versões alternativas em @@ALTERNATIVOS continuam obrigatórias, mas só como opções pra ele comparar.'
        : 'COMO TRATAR O GANCHO DO CRIADOR: ele é a base, não um rascunho a descartar. (1) Se já passa nos 4 pilares (dor universal, surpresa, promessa de clareza, impacto emocional) e não tem erro de abertura ("nesse vídeo", "hoje eu vou", "você sabia", saudação, explicação antes da dor), use EXATAMENTE como escreveu. (2) Se precisar de ajuste pra prender nos 3 primeiros segundos, faça o ajuste MÍNIMO: corte enrolação, deixe mais concreto e específico, acrescente quebra de padrão ou identificação, sempre mantendo as palavras e a intenção dele. (3) Nunca troque por outro gancho, nem por um gancho genérico de banco, nem invente outra ideia. (4) Em @@PILARES diga em uma frase se o gancho foi mantido ou refinado e o que mudou. As 2 versões alternativas em @@ALTERNATIVOS são variações do MESMO gancho, escritas por você, pra ele comparar.');
    }
    if (sd.fato && sd.fato.trim()) partes.push(`FATO REAL fornecido pelo criador (a única base permitida pra história/autoridade): ${sd.fato.trim()}`);
    else if (g && (g.gate === 'fato' || E.pessoal(g))) partes.push('Nenhum fato pessoal foi fornecido: não invente. Onde precisar de dado pessoal, use [PREENCHER: ...].');
    else if (!g && sd.ganchoTexto && E.pessoal({ texto: sd.ganchoTexto })) partes.push('O gancho fala de você. Nenhum fato pessoal foi fornecido além do gancho: não invente história, número nem resultado. Onde precisar de dado pessoal, use [PREENCHER: ...].');
    if (sd.fonte && sd.fonte.trim()) partes.push(`FONTE DO NÚMERO do gancho, informada pelo criador: ${sd.fonte.trim()}. Mostre a fonte na tela.`);
    if (g && g.cat === 12) partes.push('Pilar Reflexão: tom baixo, sem CTA de venda.');
    if (sd.ancora && sd.ancora.trim()) partes.push(`ÂNCORA DO DIA — sequestro de atenção: "${sd.ancora.trim()}". Use como ponte DEPOIS do gancho, entre o segundo 4 e o 8, nunca no lugar dele (Falso Foco: "Você tá prestando atenção em X, mas ignorando..."; Cortina de Fumaça: "Enquanto todo mundo discute X, a conta que vai estourar no seu bolso é outra."; Caixa Preta: "O que os grandes fazem enquanto você se distrai com X."). A ponte tem que ser real; em Direito, a âncora é caso, decisão ou notícia, nunca briga política: cite como "o que todo mundo tá comentando", sem tomar lado.`);
    if (sd.continua) partes.push(`ESTE VÍDEO CUMPRE A PROMESSA DO VÍDEO ANTERIOR ("${sd.continua.titulo}"), que prometeu: "${sd.continua.promessa}". Entregue exatamente isso, sem repetir o gancho anterior.`);
    if (sd.modelo) partes.push(E.blocoModelo(sd.modelo));
    if (sd.serie) partes.push(E.blocoSerie(st, sd.serie));
    const obj = E.objetivo(sd.objetivo || 'seguidores');
    if (obj) partes.push(`OBJETIVO PRINCIPAL DESTE VÍDEO: ${obj[1]}. ${obj[2]} Mantenha o CTA do perfil; o objetivo muda o tipo de conteúdo, não a quantidade de pedidos.`);
    partes.push(sd.proximo && sd.proximo.trim() ? `PRÓXIMO VÍDEO que o CTA promete: ${sd.proximo.trim()}` : 'PRÓXIMO VÍDEO: escolha um próximo vídeo real e coerente com o assunto e prometa no CTA.');
    if (sd.obs && sd.obs.trim()) partes.push(`OBSERVAÇÕES DO CRIADOR: ${sd.obs.trim()}`);
    if (g && ult) partes.push(`Último gancho do banco usado no perfil: #${ult}.`);

    const texto = `${nucleo(st)}

═══ FORMATO ESCOLHIDO ═══
${fmtBloco(f.id)}

═══ ESTE VÍDEO ═══
${partes.join('\n')}
${g ? `\nCANDIDATOS A GANCHO ALTERNATIVO (escolha 2, de categorias diferentes entre si; escreva só os números):\n${candidatos(st, g.id, 18)}\n` : ''}
${CHECKLIST}

${SAIDA(sd.stories)}

═══ REFERÊNCIA DE QUALIDADE (exemplo de entrega perfeita de outro vídeo; não copie o conteúdo) ═══
${N.EXEMPLO}`;
    return E.encolher(texto);
  };

  // bloco da série (briefing): regras + episódio
  E.blocoSerie = (st, sr) => {
    const S = N.SERIE, ep = S && S.eps.find(e => e.id === sr.ep);
    if (!ep) return '';
    const L = [`SÉRIE "${S.nome.toUpperCase()}" — ${ep.dia}: ${ep.titulo}. ${S.sub}`, N.SERIE_REGRAS];
    if (st.profile.bordao) L.push(`Bordão fixo do criador pro fechamento: "${st.profile.bordao}".`); else L.push('O bordão fixo do criador ainda não foi informado: no fechamento, escreva [PREENCHER: bordão fixo] e peça pra ele preencher em Perfil.');
    L.push(`EPISÓDIO DE ${ep.dia.toUpperCase()} — gancho rascunho do briefing: "${ep.gancho}"${ep.ganchoAlt ? ` (alternativa: "${ep.ganchoAlt}")` : ''}`);
    L.push('ITENS DO BRIEFING (dados do briefing, AINDA NÃO CONFERIDOS nos prints: use-os como base, mas marque [DADO REAL + FONTE] em cada número/comentário até o criador confirmar o print):\n' + ep.itens.map(i => '- ' + i).join('\n'));
    if (ep.pontos.length) L.push('PONTOS PARA O ROTEIRO:\n' + ep.pontos.map(i => '- ' + i).join('\n'));
    if (ep.pendencias.length) L.push('PENDÊNCIAS (aparecem em @@ANTES_DE_POSTAR):\n' + ep.pendencias.map(i => '- ' + i).join('\n'));
    if (ep.nota) L.push(ep.nota);
    return L.join('\n');
  };

  /* ---------- montar juntos (conversa) ---------- */
  E.promptJuntosSistema = (st, ctx) => {
    const extras = [];
    if (ctx.formatoId && E.formato(ctx.formatoId)) extras.push(`FORMATO ESCOLHIDO:\n${fmtBloco(ctx.formatoId)}`);
    if (ctx.serie) extras.push(E.blocoSerie(st, ctx.serie));
    return `${nucleo(st)}

═══ MODO CONVERSA: MONTAR O ROTEIRO JUNTO COM O CRIADOR ═══
O criador vai jogar uma ideia de vídeo e vocês montam o roteiro juntos, em conversa. Aqui você NÃO responde no formato @@: responde como um co-roteirista, em português, em texto corrido e curto.
1. Mensagens curtas (até uns 120 palavras, exceto quando ele pedir um bloco de fala). Termine com UMA pergunta ou UM próximo passo claro.
2. Comece entendendo a ideia. Pergunte no máximo 2 coisas, só se faltar algo essencial (pra quem é, qual a dor, que prova ele tem). Se ele já deu o suficiente, avance direto.
3. O gancho é do criador. Se ele já escreveu um, trabalhe em cima dele: só proponha ajuste se não prender, e explique em uma frase. Se ainda não tem, proponha 3 ideias de gancho escritas por você no estilo dele (frases completas e diferentes entre si: choque, identificação, curiosidade), sem usar gancho pronto de banco, e peça pra ele escolher ou reescrever.
4. Depois proponha a estrutura (gancho → promessa → valor → loop aberto → valor → CTA) com os pontos do vídeo em lista curta, e pergunte se ele muda algo.
5. Quando ele pedir, escreva só o bloco de fala pedido (ex.: "escreve o item 3"), na linguagem dele.
6. Aplique sempre as regras acima (7 primeiros segundos, Regra Zero, verdade, tom). Nunca invente número, print, dado ou história: onde faltar, escreva [DADO REAL + FONTE] ou [PREENCHER: o que falta] e diga o que ele precisa trazer.
7. Quando o criador achar que está pronto, ele clica em "Fechar roteiro" e o app pede a versão completa no formato final. Lembre disso quando uma etapa for concluída.${extras.length ? '\n\n' + extras.join('\n\n') : ''}`;
  };
  E.promptJuntosFechar = (st, ctx) => `FECHAR O ROTEIRO AGORA. Use TUDO que combinamos nesta conversa: o gancho do criador (se ele aprovou ou escreveu um, ele entra exatamente assim, só com ajuste mínimo se faltar pegada), a estrutura, as falas que ele já aprovou (entram como estão) e os ajustes que ele pediu. Complete só o que faltar. Não invente número, print nem história: onde faltar, [DADO REAL + FONTE] ou [PREENCHER: ...].
${ctx.formatoId && E.formato(ctx.formatoId) ? `\nFORMATO: ${fmtBloco(ctx.formatoId)}\n` : ''}
${CHECKLIST}

${SAIDA(!!ctx.stories)}
No cabeçalho escreva "Tema livre · Gancho do criador". Em @@ALTERNATIVOS escreva 2 versões alternativas do gancho final.`;
  // mantém o prompt de sistema e corta as mensagens mais antigas da conversa se passar do limite
  E.cortarTurns = (turns, maxBytes) => {
    const t = turns.slice();
    let n = t.reduce((a, x) => a + E.bytes(x.content), 0);
    while (n > maxBytes && t.length > 3) { n -= E.bytes(t[1].content) + E.bytes(t[2].content); t.splice(1, 2); }
    return t;
  };

  // garante o limite de 64 KiB tirando o exemplo primeiro
  E.encolher = texto => {
    if (E.bytes(texto) <= 60000) return texto;
    const i = texto.indexOf('═══ REFERÊNCIA DE QUALIDADE');
    if (i > 0) texto = texto.slice(0, i).trim();
    while (E.bytes(texto) > 60000) {
      const j = texto.indexOf('═══ O QUE ESTE PERFIL JÁ APRENDEU');
      if (j < 0) break;
      const fim = texto.indexOf('═══', j + 10);
      const bloco = texto.slice(j, fim);
      const linhas = bloco.split('\n');
      if (linhas.length < 6) break;
      linhas.splice(Math.max(2, linhas.length - 4), 3);
      texto = texto.slice(0, j) + linhas.join('\n') + '\n\n' + texto.slice(fim);
    }
    return texto;
  };

  E.promptAjuste = nota => `Ajuste pedido pelo criador: ${nota}
Reescreva a entrega inteira no mesmo formato de seções @@, aplicando o ajuste. Mantenha o gancho literal no Ato 1, o mesmo tema e o mesmo formato, e todas as regras (verdade, 4 atos, Regra Zero, legenda, duração).`;

  /* ---------- prompt: ideia solta ---------- */
  function listaTemas() {
    return E.todosTemas().map(t => `#${t.id} [${E.pilar(t.pilar).nome}] ${t.nome} — "${t.frase}"`).join('\n');
  }
  function listaGanchos(semRelac) {
    return N.GANCHOS.filter(g => !(semRelac && g.cat === 13)).map(g => `#${g.id} [${E.cat(g.cat).nome}${g.gate === 'fato' ? ' · exige fato real' : g.gate === 'numero' ? ' · exige número conferido' : ''}] ${g.texto}`).join('\n');
  }
  E.promptIdeia = (st, ideia) => {
    const p = st.profile;
    const pf = E.agrupar(st, 'formato');
    const ranking = Object.entries(pf).filter(([, x]) => x.media != null).sort((a, b) => b[1].media - a[1].media).map(([k, x]) => `${E.formato(k).nome} (${x.media})`).join(', ');
    return E.encolher(`Você é o NARRADOR DE IMPACTO, roteirista viral de ${p.nome || 'um criador'} (${p.handle || ''}). Nicho: ${p.nicho || '—'}. Público: ${p.publico || '—'}. Responda em português do Brasil.

O criador trouxe uma ideia solta: "${ideia}"

REGRA PRIMORDIAL: todo vídeo tangencia um dos temas do banco abaixo; nada de tema inventado. Se a ideia estiver fora dos temas, você NÃO escreve roteiro: corrige direto, em uma frase, e mostra 3 temas do banco em que a ideia pode se encaixar, com uma linha explicando cada encaixe. Se a ideia já for um tema do banco, devolva mesmo assim 3 opções (a mais fiel primeiro).
Pra cada opção sugira UM gancho do banco (pelo número, que será usado literal) e UM formato, pelo mapa gancho → formato. Evite ganchos que exigem fato real ou número conferido. Evite o gancho #${E.ultimoGancho(st) || '—'} (último usado). Evite a categoria Relacionamentos, a menos que a ideia peça. Use 3 temas diferentes e 3 ganchos de categorias diferentes.
${ranking ? `Formatos por score no perfil: ${ranking}.` : ''}

MAPA GANCHO → FORMATO: ${N.MAPA.map(m => m[0] + ' → ' + m[1]).join('; ')}.
FORMATOS (use o id): ${N.FORMATOS.map(f => `${f.id} = ${f.nome}`).join(', ')}.

TEMAS:
${listaTemas()}

GANCHOS:
${listaGanchos(false)}

Responda só com JSON, sem nada antes ou depois:
{"dentroDoBanco": false, "correcao": "uma frase direta sobre a ideia e a Regra Primordial", "opcoes": [{"tema": 22, "encaixe": "uma linha explicando o encaixe", "gancho": 1, "formato": "lista", "porque": "uma linha: por que esse gancho e esse formato"}]}`);
  };

  /* ---------- prompt: revisar roteiro ---------- */
  E.promptRevisar = (st, roteiro) => {
    const texto = `${nucleo(st)}

═══ TAREFA: REVISAR UM ROTEIRO (de outra IA ou do criador) ═══
Rode esta revisão antes de reescrever:
1. Tem título proibido pro criador? Tire.
2. O gancho prende nos 3 primeiros segundos? Se já prende, mantenha EXATAMENTE como está. Se precisar, ajuste o mínimo (mesmas palavras e intenção). Nunca troque por um gancho genérico nem invente outro.
3. Tema do banco é opcional: não force o roteiro num tema. Se o criador não deu tema, escreva "Tema livre" no cabeçalho.
4. Algum fato está errado, sem fonte ou exagerado? Corrija com base nos fatos conferidos, ou marque [CONFERIR], e explique em uma linha.
5. Tem mais de um CTA? Deixe um.
6. Tem os 4 atos? Se faltar solução, construa uma.
7. Passa de 45 segundos (fora Vídeo Narrado)? Corte.
8. Passa nas 5 provas do VALOR QUE TRANSFORMA? Se a entrega for rasa ou genérica, aprofunde com algo que a pessoa aplica hoje, com exemplo concreto, e faça o CTA dizer o que ela ganha seguindo.
Depois entregue a versão pronta. Escolha o formato mais fiel ao roteiro original (ids: ${N.FORMATOS.map(f => f.id + ' = ' + f.nome).join(', ')}).

ROTEIRO ORIGINAL:
"""
${roteiro.slice(0, 7000)}
"""

${CHECKLIST}

Antes de todas as seções, abra com:
@@CORRECOES
- correção curta (uma por linha, só as que se aplicam)
@@FORMATO
(o id do formato escolhido)
e em @@ALTERNATIVOS escreva 2 versões alternativas do gancho (mesma ideia, frases completas). No cabeçalho, escreva "Tema livre · Gancho do criador".

${SAIDA(false)}`;
    let out = texto;
    if (E.bytes(out) > 62000) out = out.replace(listaGanchos(true), N.GANCHOS.filter(g => g.cat !== 13 && !g.gate).map(g => `#${g.id} ${g.texto}`).join('\n'));
    return out;
  };

  /* ---------- prompt: melhorar gancho ---------- */
  E.promptMelhorarGancho = (st, atual) => {
    const p = st.profile;
    const abertura = (N.MANUAL || []).find(m => m.id === 'abertura');
    const texto = `Você é o NARRADOR DE IMPACTO, editor de ganchos de ${p.nome || 'um criador'} (${p.handle || ''}). Nicho: ${p.nicho || '—'}. Público: ${p.publico || '—'}. Responda em português do Brasil.

PRINCÍPIO: o gancho é do criador. Seu trabalho NÃO é trocar por um gancho pronto nem inventar outra ideia: é dizer se o gancho dele já prende e, SÓ se precisar, refinar com ajuste mínimo, mantendo as palavras e a intenção dele. Se já está forte, o veredito é "manter" e o gancho refinado é igual ao original.

OS 4 PILARES (nota de 0 a 10 em cada): dor universal (a pessoa pensa "isso já aconteceu comigo"), surpresa nos 3 primeiros segundos (contradição, inversão, revelação), promessa de clareza (existe uma resposta que quebra uma crença), impacto emocional (frustração reconhecida, alívio antecipado, curiosidade prática).
OS 7 PRIMEIROS SEGUNDOS: 0 a 3 s o gancho, seco, com gatilho opcional de até 4 palavras antes; 3 a 7 s uma frase de identificação (cena concreta do dia a dia de quem assiste + o que perde se ignorar). Erros que matam a abertura: ${abertura ? abertura.itens.map(([k, v]) => `"${k}" → ${v}`).join(' | ') : ''}

GANCHO ATUAL DO CRIADOR:
"""
${atual.slice(0, 2000)}
"""

COMO REFINAR (só se o veredito for "ajustar"): corte enrolação; troque o genérico pelo específico (valor, momento, objeto, situação); acrescente quebra de padrão ou identificação; deixe mais curto e seco. Não use "nesse vídeo", "hoje eu vou", "você sabia", saudação. Não invente fato, número nem história.

Responda só com JSON, sem nada antes ou depois:
{"diagnostico": {"dorUniversal": 0, "surpresa": 0, "promessaClareza": 0, "impactoEmocional": 0, "resumo": "uma frase: o que já funciona e o que falta"},
 "veredito": "manter",
 "erros": ["erro concreto de abertura encontrado, se houver, citando a regra"],
 "refinado": "o gancho final (se o veredito é manter, copie exatamente o do criador)",
 "mudou": "uma frase: o que mudou e por quê, ou 'nada: já prende'",
 "alternativas": [{"texto": "versão alternativa do MESMO gancho, frase completa", "enfase": "choque", "porque": "uma frase"}],
 "abertura": {"visual": "o que acontece no frame 0", "tela": "texto na tela no frame 0", "f03": "fala de 0 a 3s: gatilho opcional + o gancho final", "f37": "frase de identificação de 3 a 7s"}}
"veredito" é "manter" ou "ajustar". Dê 2 alternativas do mesmo gancho (uma de "choque" e uma de "identificação"). "abertura" usa o gancho final.`;
    return E.encolher(texto);
  };

  /* ---------- prompt: melhorar CTA ---------- */
  E.promptMelhorarCTA = (st, atual) => {
    const p = st.profile;
    const cta = (N.MANUAL || []).find(m => m.id === 'cta');
    const texto = `Você é o NARRADOR DE IMPACTO, especialista em CTA de ${p.nome || 'um criador'} (${p.handle || ''}). Nicho: ${p.nicho || '—'}. Público: ${p.publico || '—'}. Responda em português do Brasil, sem prometer views.

REGRA DO CTA DESTE PERFIL: ${ctaRegra(p)}
REGRA DA LEGENDA: um CTA só, nunca "segue, salva e compartilha" junto.
${cta ? `MÉTODO "CTA DO PRÓXIMO PROBLEMA" (Manual do viral):\n${cta.itens.map(([k, v]) => `${k}: ${v}`).join('\n')}` : ''}

CTA ATUAL DO CRIADOR (fala de encerramento e/ou linha de CTA da legenda):
"""
${atual.slice(0, 1500)}
"""

Responda só com JSON, sem nada antes ou depois:
{"diagnostico": ["o que está fraco no CTA atual, ligado ao método acima, uma frase cada"],
 "sugestoes": [{"fala": "CTA falado no fim do vídeo, amarrado a uma promessa específica do próximo vídeo", "legenda": "a mesma ideia, na linha de CTA da legenda", "proximoVideo": "o que esse próximo vídeo entrega", "porque": "uma frase: por que converte mais que o CTA atual"}]}
Dê 3 opções, cada uma prometendo um próximo vídeo diferente e plausível dentro do nicho do criador. Nunca mais de um pedido por CTA.`;
    return E.encolher(texto);
  };

  /* ---------- prompt: métricas ---------- */
  E.promptMetricas = (st, s) => {
    const m = s.metrics || {};
    const t = E.taxas(m) || {};
    const base = E.mediaViews(st);
    const outlier = st.scripts.filter(x => x.id !== s.id && E.score(x.metrics) != null).sort((a, b) => E.score(b.metrics) - E.score(a.metrics))[0];
    const tema = s.temaId ? E.tema(s.temaId) : null, g = s.ganchoId ? E.gancho(s.ganchoId) : null, f = s.formatoId ? E.formato(s.formatoId) : null;
    const falas = s.raw ? E.falas(E.parse(s.raw)).join(' ') : '';
    return `Você é o NARRADOR DE IMPACTO, estrategista de conteúdo de ${st.profile.nome || 'um criador'} (${st.profile.handle || ''}). Leia os números deste Reel e decida. Responda em português do Brasil, frases curtas, sem floreio, sem prometer views.

COMO LER AS MÉTRICAS:
- Taxa de reels pulados alta = o gancho falhou nos primeiros segundos. É a primeira coisa a olhar.
- Muitos seguidores e poucos não seguidores = o algoritmo não empurrou pra fora. Confira a fonte "Aba Reels".
- Curva de retenção: onde ela despenca é onde o roteiro precisa mudar.
- Salvamento mostra utilidade, compartilhamento mostra valor social, comentário depende de pedir.
- Conversão de visita no perfil em seguidor mostra se a bio funciona.
- Referências: salvamentos 1 a 2% das views; comentários 0,5 a 1%.
- Vídeo que faz 5 vezes a média ganha Parte 2 em até 48 h (Doubling Down): A = outro gancho do banco, mesmo conteúdo; B = mesma estrutura, outro exemplo; C = mesmo valor, outro formato. Dobre no tema, nunca na âncora polêmica.

O VÍDEO: "${s.titulo || 'sem título'}"
Tema: ${tema ? '#' + tema.id + ' ' + tema.nome : 'não registrado'} · Gancho: ${g ? '#' + g.id + ' "' + g.texto + '" (' + E.cat(g.cat).nome + ')' : 'não registrado'} · Formato: ${f ? f.nome : 'não registrado'} · Duração: ${s.duracao ? s.duracao + ' s' : '—'}
${falas ? 'Fala: ' + falas.slice(0, 2500) : ''}
NÚMEROS: views ${E.fmtN(m.views)} · alcance ${E.fmtN(m.alcance)} · curtidas ${E.fmtN(m.curtidas)} · comentários ${E.fmtN(m.comentarios)} (${t.comentarios != null ? t.comentarios.toFixed(2) + '%' : '—'}) · salvamentos ${E.fmtN(m.salvamentos)} (${t.salvamentos != null ? t.salvamentos.toFixed(2) + '%' : '—'}) · compartilhamentos ${E.fmtN(m.compartilhamentos)} (${t.compartilhamentos != null ? t.compartilhamentos.toFixed(2) + '%' : '—'}) · seguidores ganhos ${E.fmtN(m.seguidores)} · não seguidores ${m.naoSeguidores !== '' && m.naoSeguidores != null ? m.naoSeguidores + '%' : '—'} · Aba Reels ${m.abaReels !== '' && m.abaReels != null ? m.abaReels + '%' : '—'} · reels pulados ${m.pulados !== '' && m.pulados != null ? m.pulados + '%' : '—'} · visitas ao perfil ${E.fmtN(m.visitas)} · retenção: ${m.retencao || '—'}
Média de views do perfil: ${base ? E.fmtN(Math.round(base)) : 'desconhecida'}${base && Number(m.views) ? ` (este vídeo = ${(Number(m.views) / base).toFixed(1)}× a média)` : ''}.
${outlier ? `Melhor vídeo do perfil pra comparar: "${outlier.titulo}" — ${E.fmtN(outlier.metrics.views)} views, ${E.fmtN(outlier.metrics.seguidores)} seguidores, score ${E.score(outlier.metrics)}.` : ''}
${s.nota ? 'Nota do criador: ' + s.nota : ''}

Se for recomendar regravar com novo gancho, escolha um gancho do banco pelo número (sem exigir fato real). Alguns ganchos livres: ${N.GANCHOS.filter(h => !h.gate && !h.colchete && h.cat !== 13 && h.id !== s.ganchoId).filter((h, i) => i % 3 === 0).map(h => `#${h.id} "${h.texto}"`).join(' | ')}

Responda só com JSON:
{"diagnostico": [{"numero": "o número que chama atenção", "causa": "a causa provável, uma frase"}], "manter": ["o que manter"], "mudar": ["o que mudar no próximo"], "decisao": "regravar | doubling_down | descartar | manter", "decisaoPorque": "uma frase", "novoGancho": 12, "licoes": ["regra curta e acionável que este perfil aprendeu com este vídeo, uma frase cada, no máximo 3"]}`;
  };

  /* ---------- prompt: voz ---------- */
  E.promptVoz = (st, texto, numeros) => `Você é o NARRADOR DE IMPACTO. O criador ${st.profile.nome || ''} (${st.profile.handle || ''}) colou um roteiro ou transcrição de um vídeo DELE${numeros ? ' que funcionou' : ''}. Extraia a VOZ dele pra que os próximos roteiros soem como ele falando, não como IA. Não invente nada que não esteja no texto. Português do Brasil.

TEXTO DO CRIADOR:
"""
${texto.slice(0, 9000)}
"""
${numeros ? 'NÚMEROS DO VÍDEO: ' + numeros : ''}
${st.memory.voz && st.memory.voz.resumo ? 'Voz já registrada (atualize e una, sem perder o que vale): ' + JSON.stringify(st.memory.voz).slice(0, 2500) : ''}

Responda só com JSON:
{"resumo": "como ele fala, em uma frase", "tracos": ["traço de estilo observável: ritmo, tamanho de frase, humor, jeito de abrir, jeito de fechar"], "bordoes": ["expressões e palavras que ele repete, literais"], "evitar": ["o que ele nunca faz ou soaria falso na boca dele"], "estrutura": "a estrutura que o vídeo seguiu, em uma frase", "formato": "id do formato mais próximo: ${N.FORMATOS.map(f => f.id).join('|')}", "licoes": ["no máximo 2 regras acionáveis pra próximos roteiros, se o texto mostrar algo que funcionou"]}`;

  /* ---------- prompt: stories ---------- */
  E.promptStories = (st, raw) => {
    const P = E.parse(raw);
    const livres = N.GANCHOS.filter(h => !h.gate && !h.colchete && h.cat !== 13).filter((h, i) => i % 4 === 1).map(h => `#${h.id} "${h.texto}"`).join(' | ');
    return `Você é o NARRADOR DE IMPACTO de ${st.profile.nome || ''} (${st.profile.handle || ''}). Monte a esteira Stories → Reel pro Reel abaixo: 3 Stories. Português do Brasil, linguagem de conversa, sem inventar fato.
1. Story 1, bastidor com gancho: gravado cru (${/carro/i.test(st.profile.gravacao || '') ? 'no carro' : 'no celular'}) ou na mesa, abrindo com um gancho do banco (literal, pelo número; diferente do gancho do Reel).
2. Story 2, a dor: o problema em uma frase, com enquete ou caixinha de pergunta.
3. Story 3, a ponte: "o Reel com a solução acabou de sair, olha aqui", com o link do Reel. Vai pros Stories na primeira hora.
Técnicas que você pode usar: cliffhanger em 2 atos (um Story só com uma frase vaga e alarmante, e o próximo com a virada), dúvida do direct respondida em print ("a dúvida de um é a de todos"), bastidor cru do que está acontecendo agora (10 a 15 s com música), resultado pequeno com "quem quiser o mesmo, me chama aqui".
REEL: ${(P.CABECALHO || '').trim()}
Tarja: ${(P.TARJA || '').trim()}
Fala: ${E.falas(P).join(' ').slice(0, 3000)}
Ganchos disponíveis: ${livres}
Responda só com JSON:
{"stories": [{"tipo": "Bastidor com gancho", "gancho": 12, "fala": "o que falar", "textoNaTela": "texto curto", "interacao": "enquete/caixinha/link, ou vazio"}]}`;
  };

  /* ---------- prompt: bio ---------- */
  E.promptBio = st => `Você é o NARRADOR DE IMPACTO. Escreva 3 opções de bio de Instagram pra ${st.profile.nome || ''} (${st.profile.handle || ''}), cada uma com NO MÁXIMO 150 caracteres contando emojis e quebras de linha, e o campo "Nome" pensado pra busca (até 64 caracteres, com as palavras que o público pesquisaria). Português do Brasil. Nada de título que o criador não tem.
Promessa: ${st.profile.promessa || '—'}
Nicho: ${st.profile.nicho || '—'}
Posicionamento: ${st.profile.posicionamento || '—'}
Credencial: ${st.profile.credencial || '—'}. Títulos proibidos: ${st.profile.proibidos || '—'}. Permitidos: ${st.profile.permitidos || '—'}.
Ofertas: ${st.profile.ofertas || '—'}
Bio atual: ${st.profile.bio || '—'}
Dado real: ${aprendizados(st).split('\n').filter(l => /visitou o perfil/.test(l)).join(' ') || '—'}
Responda só com JSON:
{"nome": "campo Nome", "bios": [{"texto": "bio com \\n pra quebra de linha", "porque": "uma frase"}]}`;

  /* ---------- parser da saída ---------- */
  E.parse = text => {
    const out = { _ordem: [], _tempos: {} };
    let cur = null;
    String(text || '').split('\n').forEach(line => {
      const m = line.match(/^\s*@@\s*([A-ZÇÃÕÁÉÍÓÚ_0-9]+)\s*(.*)$/);
      if (m) {
        cur = m[1].replace('Ç', 'C').replace('Õ', 'O').replace('Ã', 'A');
        if (!(cur in out)) { out[cur] = ''; out._ordem.push(cur); }
        if (m[2] && /^ATO\d/.test(cur)) out._tempos[cur] = m[2].trim();
        else if (m[2]) out[cur] += m[2] + '\n';
      } else if (cur) out[cur] += line + '\n';
    });
    for (const k of out._ordem) out[k] = out[k].replace(/\s+$/, '');
    return out;
  };
  E.linhas = s => String(s || '').split('\n').map(l => l.trim()).filter(Boolean);
  E.fala = l => {
    let s = l.replace(/^[-•*]\s*/, '');
    const star = /^★/.test(s); s = s.replace(/^★\s*/, '');
    let quem = null;
    const q = s.match(/^\[([^\]]{1,24})\]\s*/);
    if (q) { quem = q[1]; s = s.slice(q[0].length); }
    s = s.replace(/^["“]\s*/, '').replace(/\s*["”]$/, '');
    return { texto: s, star, quem };
  };
  E.falas = P => ['ATO1', 'ATO2', 'ATO3', 'ATO4'].flatMap(k => E.linhas(P[k]).map(l => E.fala(l).texto));
  E.alternativos = P => E.linhas(P.ALTERNATIVOS).map(l => { const m = l.match(/#?\s*(\d{1,3})/); return m ? Number(m[1]) : null; }).filter(n => n && E.gancho(n)).slice(0, 2);
  // 2 versões alternativas do gancho: ids do banco (#NN) ou frases escritas pela IA
  E.alternativosTodos = P => E.linhas(P.ALTERNATIVOS).map(l => {
    const t = l.replace(/^[-•*]\s*/, '').trim();
    const m = t.match(/^#\s*(\d{1,3})\b/);
    if (m && E.gancho(Number(m[1]))) return { id: Number(m[1]), texto: E.gancho(Number(m[1])).texto };
    const f = E.fala(t).texto;
    return f ? { id: null, texto: f } : null;
  }).filter(Boolean).slice(0, 2);
  E.cabecalhoIds = P => {
    const h = P.CABECALHO || '';
    const t = h.match(/Tema\s*#\s*(\d{1,2})/i), g = h.match(/Gancho\s*#\s*(\d{1,3})/i);
    return { temaId: t ? Number(t[1]) : null, ganchoId: g ? Number(g[1]) : null };
  };

  E.palavras = s => (String(s || '').match(/[\p{L}\p{N}]+/gu) || []).length;
  E.WPS = 4.2;
  E.duracao = P => Math.round(E.palavras(E.falas(P).join(' ')) / E.WPS);

  E.similar = (a, b) => {
    const A = E.norm(a).split(' ').filter(Boolean), B = new Set(E.norm(b).split(' ').filter(Boolean));
    if (!A.length) return 0;
    return A.filter(w => B.has(w)).length / A.length;
  };

  // lê a seção @@VALOR: campos "Rótulo: texto" e a linha "Nota: a 9 · b 8 ..."
  E.valor = P => {
    const txt = P && P.VALOR;
    if (txt == null) return null;
    const campos = [], notas = [];
    E.linhas(txt).forEach(l => {
      const t = l.replace(/^[-•*]\s*/, '');
      if (/^\(/.test(t)) return;
      const m = t.match(/^([^:]{2,40}):\s*(.+)$/);
      if (!m) return;
      if (/^nota/i.test(m[1].trim())) {
        m[2].split(/[·|;,]/).forEach(x => { const n = x.trim().match(/^(.*?)\s*(\d{1,2})(?:\s*\/\s*10)?$/); if (n && n[1]) notas.push({ k: n[1].trim(), v: Math.min(10, Number(n[2])) }); });
      } else campos.push({ k: m[1].trim(), v: m[2].trim() });
    });
    const min = notas.length ? Math.min(...notas.map(n => n.v)) : null;
    return { campos, notas, min };
  };

  /* ---------- checagem automática ---------- */
  E.checar = (st, raw, ctx) => {
    const P = E.parse(raw);
    const res = [];
    // fix = como resolver (pra pessoa); ia = instrução que o botão "Corrigir" manda pra IA
    const add = (ok, txt, nivel, fix, ia) => res.push({ ok, txt, nivel: nivel || (ok ? 'ok' : 'bad'), fix: ok ? '' : (fix || ''), ia: ok ? '' : (ia || fix || '') });
    const ids = E.cabecalhoIds(P);
    const gId = ctx.ganchoId || (ctx.ganchoTexto ? null : ids.ganchoId);
    const g = gId ? E.gancho(gId) : null;
    const ato1 = E.linhas(P.ATO1).map(l => E.fala(l).texto).join(' ');
    if (g) {
      const hook = E.textoGancho(g, ctx.colchetes);
      const sim = E.similar(hook, ato1);
      add(sim >= 0.9, sim >= 0.9 ? `Gancho #${g.id} literal no Ato 1` : `Gancho #${g.id} alterado no Ato 1 (${Math.round(sim * 100)}% igual)`, null,
        `O Ato 1 tem que dizer, palavra por palavra: "${hook}". Pode ter um gatilho curto antes, nunca uma versão reescrita.`,
        `O Ato 1 deve conter o gancho literal, palavra por palavra: "${hook}" (um gatilho de até 4 palavras antes é permitido).`);
    } else if (ctx.ganchoTexto) {
      const gt = ctx.ganchoTexto.trim();
      const sim = E.similar(gt, ato1);
      if (ctx.ganchoTravado) add(sim >= 0.9, sim >= 0.9 ? 'Gancho mantido exatamente como você escreveu' : `Gancho mudou no Ato 1 (${Math.round(sim * 100)}% igual) e você pediu pra manter`, null,
        `O Ato 1 tem que dizer, palavra por palavra: "${gt}".`, `O Ato 1 deve conter exatamente o gancho do criador, sem mudar uma palavra: "${gt}" (um gatilho de até 4 palavras antes é permitido).`);
      else if (sim >= 0.9) add(true, 'Gancho mantido como você escreveu');
      else add(sim >= 0.45, sim >= 0.45 ? `Gancho refinado a partir do seu (${Math.round(sim * 100)}% igual)` : `Gancho bem diferente do seu (${Math.round(sim * 100)}% igual)`, sim >= 0.45 ? 'ok' : 'warn',
        `A IA se afastou da sua ideia. Peça "Ajustar com IA" com: usar exatamente "${gt}", ou edite o Ato 1 à mão.`,
        `Volte pro gancho do criador no Ato 1, com ajuste mínimo só se precisar: "${gt}". Não troque a ideia dele.`);
    }
    if (g || ctx.ganchoTexto || ctx.ganchoLivre) {
      const abre = E.linhas(P.ATO1).concat(E.linhas(P.ATO2).slice(0, 1)).map(l => E.fala(l).texto).join(' ');
      const fraca = /\b(oi|ol[aá]|fala galera|e a[ií] galera|nesse v[ií]deo|neste v[ií]deo|hoje eu vou|hoje vou|voc[eê] sabia|fica at[eé] o final|vem comigo)\b/i.exec(abre);
      add(!fraca, fraca ? `Abertura fraca: "${fraca[0]}" nos primeiros segundos` : 'Abertura sem enrolação', fraca ? 'warn' : 'ok',
        `Tire "${fraca && fraca[0]}". Nos 3 a 7 segundos entra uma cena concreta do dia a dia de quem assiste (valor, momento, objeto) e o que a pessoa perde.`,
        `Reescreva a frase dos 3 a 7 segundos sem "${fraca && fraca[0]}": uma cena concreta do dia a dia do público com detalhe real e o que a pessoa perde se ignorar.`);
    }
    const cab = P.CABECALHO || '';
    const cabOk = /tema/i.test(cab) && /gancho/i.test(cab);
    add(cabOk, cabOk ? 'Tema e gancho na primeira linha' : 'Primeira linha sem tema ou gancho', cabOk ? 'ok' : 'warn',
      'A primeira linha precisa ser "Tema #XX — nome · Gancho #XX — categoria", ou "Tema livre · Gancho do criador".');
    const altsT = E.alternativosTodos(P);
    if (g) {
      const alts = E.alternativos(P);
      const catsAlt = new Set(alts.map(a => E.gancho(a).cat));
      const altOk = alts.length === 2 && catsAlt.size === 2 && !catsAlt.has(g.cat);
      add(altOk, altOk ? '2 alternativos de categorias diferentes' : 'Alternativos incompletos ou da mesma categoria', altOk ? 'ok' : 'warn',
        'Troque por 2 ganchos do banco de categorias diferentes entre si e da categoria do gancho principal.');
    } else {
      const altOk = altsT.length === 2;
      add(altOk, altOk ? '2 versões alternativas do gancho' : 'Faltam as 2 versões alternativas do gancho', altOk ? 'ok' : 'warn',
        'Em @@ALTERNATIVOS escreva 2 versões do mesmo gancho: uma mais chocante e uma mais de identificação.');
    }
    const fid = ctx.formatoId;
    const dur = E.duracao(P);
    const [lo, hi] = E.duracaoAlvo(fid);
    const palavras = E.palavras(E.falas(P).join(' '));
    if (fid !== 'trend') {
      const okD = dur >= lo - 3 && dur <= hi + 3;
      const alvoP = Math.round(hi * E.WPS), minP = Math.round(lo * E.WPS);
      const corta = palavras - alvoP, poe = minP - palavras;
      add(okD, `Duração ≈ ${dur} s em ritmo de Reel (alvo ${lo}–${hi} s)`, okD ? 'ok' : dur > hi + 10 ? 'bad' : 'warn',
        dur > hi ? `Corte cerca de ${corta} palavras (de ${palavras} pra ${alvoP}): tire o exemplo repetido do Ato 2 e deixe uma frase por item no Ato 3. Não corte a abertura, a promessa, o loop aberto nem a frase-chiclete.`
          : `Faltam cerca de ${poe} palavras: acrescente uma consequência concreta no Ato 2 ou uma pergunta e resposta no Ato 3.`,
        dur > hi ? `Encurte a fala total para no máximo ${alvoP} palavras (hoje tem ${palavras}), cortando exemplos repetidos e transições; mantenha a abertura, a identificação e a frase-chiclete.`
          : `Aumente a fala total para pelo menos ${minP} palavras (hoje tem ${palavras}) com uma consequência concreta no Ato 2.`);
    }
    else add(dur <= 14, `Texto na tela ≈ ${dur} s de leitura (Trend: 5–8 s)`, dur <= 14 ? 'ok' : 'warn', 'Deixe só a frase de impacto e "leia a legenda" na tela; o resto vai pra legenda.');
    const V = E.valor(P);
    if (!V || !V.campos.length) add(false, 'Falta o contrato de valor (@@VALOR)', 'warn',
      'Corrija com IA: o roteiro precisa dizer pra quem é, o antes → depois, o que a pessoa leva pronto, o ganho, pra quem ela mandaria e por que seguir.',
      'Acrescente a seção @@VALOR logo depois de @@PILARES (pra quem, antes → depois, leva pronto, ganho, mandaria pra, por que seguir e a nota de 0 a 10 de cada prova) e ajuste o roteiro pra cumprir o que ela promete.');
    else {
      const fracas = V.notas.filter(n => n.v < 8);
      const temSeguir = V.campos.some(c => /seguir/i.test(c.k) && c.v.length > 8);
      const ok = !fracas.length && temSeguir && V.notas.length >= 3;
      add(ok, ok ? `Valor que transforma: notas ${V.min}+ e motivo pra seguir` : fracas.length ? `Valor abaixo de 8 em: ${fracas.map(n => n.k + ' ' + n.v).join(', ')}` : !temSeguir ? 'Falta dizer por que seguir o perfil' : 'Contrato de valor sem notas', ok ? 'ok' : 'warn',
        'Peça "Corrigir com IA": a entrega precisa ficar mais concreta (um passo, uma frase pronta ou um critério com exemplo do público) e o CTA precisa dizer o que a pessoa ganha seguindo.',
        `Aprofunde o roteiro até cada prova do @@VALOR chegar a 8 ou mais${fracas.length ? ' (hoje fracas: ' + fracas.map(n => n.k).join(', ') + ')' : ''}: entrega aplicável hoje com exemplo concreto do público, ganho medido em dinheiro, tempo, risco ou cliente, e um CTA que diz o próximo ganho de seguir. Atualize as notas com honestidade.`);
    }
    const star = ['ATO3', 'ATO2', 'ATO4'].some(k => E.linhas(P[k]).some(l => E.fala(l).star));
    add(star, star ? 'Frase-chiclete marcada' : 'Sem frase-chiclete marcada', star ? 'ok' : 'warn',
      'Feche a solução com uma frase curta que dê vontade de mandar pra alguém e marque com ★.');
    const leg = P.LEGENDA || '';
    const p = st.profile;
    const sig = (p.assinatura || p.handle || '').trim();
    if (sig) add(leg.trim().startsWith(sig), leg.trim().startsWith(sig) ? 'Legenda abre com a assinatura' : 'Legenda não abre com a assinatura', null, `A primeira linha da legenda é: ${sig}`);
    const tags = (leg.match(/(^|\s)#[\p{L}\p{N}_]+/gu) || []).length;
    add(tags <= 5, `${tags} hashtag${tags === 1 ? '' : 's'} (máximo 5)`, null, `Tire ${tags - 5}: fique com as 5 mais específicas do assunto.`);
    const semPergunta = leg.split('\n').filter(l => !/👇/.test(l)).join('\n');
    const CTAS = [['seguir', /\bsegue\b|\bsiga\b|\bme segue\b/i], ['salvar', /\bsalv[ae]\b/i], ['compartilhar', /\bcompartilh[ae]\b|\bmanda pr[ao]\b|\benvia pr[ao]\b/i], ['comentar', /\bcomenta\b|\bcomente\b/i]];
    const achados = CTAS.filter(([, r]) => r.test(semPergunta)).map(([n]) => n);
    const principal = p.ctaModo === 'palavra' ? 'comentar' : 'seguir';
    const extras = achados.filter(n => n !== principal);
    add(achados.length <= 1, achados.length <= 1 ? 'Um CTA só na legenda' : `${achados.length} pedidos diferentes na legenda: ${achados.join(', ')}`, achados.length <= 1 ? 'ok' : 'warn',
      `Deixe só "${principal}". Tire o pedido de ${extras.join(' e ')} ou transforme em pergunta aberta com 👇.`,
      `Na legenda, deixe um único CTA (${principal}); remova os pedidos de ${extras.join(' e ')}.`);
    add(/👇/.test(leg), /👇/.test(leg) ? 'Pergunta aberta com 👇' : 'Falta a pergunta aberta com 👇', /👇/.test(leg) ? 'ok' : 'warn',
      'Antes do CTA, uma pergunta de uma linha que qualquer um responde, com 👇. Ex.: "Qual dessas você não conhecia? 👇"');
    if (p.regulado) {
      const disc = p.disclaimer && E.similar(p.disclaimer.replace(/⚖️/g, ''), leg) >= 0.6 || /conte[uú]do informativo/i.test(leg);
      add(disc, disc ? 'Disclaimer presente' : 'Falta o disclaimer do conteúdo regulado', disc ? 'ok' : 'warn',
        `Cole antes do CTA: ${p.disclaimer || 'o disclaimer do perfil'}`, `Inclua na legenda, antes do CTA, exatamente: ${p.disclaimer}`);
    }
    const tudo = E.falas(P).join(' ') + '\n' + leg;
    const proib = (p.proibidos || '').split(',').map(s => s.trim()).filter(Boolean);
    const achou = proib.filter(t => {
      const tn = E.norm(t);
      const txt = ' ' + E.norm(tudo) + ' ';
      if (tn.includes(' ')) return txt.includes(' ' + tn + ' ');
      return new RegExp(`\\b(sou|como|seu|o) ${tn}\\b`).test(txt) && !new RegExp(`\\bnao sou (um |uma )?${tn}\\b`).test(txt);
    });
    add(!achou.length, achou.length ? `Título proibido: ${achou.join(', ')}` : 'Nenhum título proibido', null,
      `Troque por ${p.permitidos || 'uma forma permitida'}.`, `Remova "${achou.join(', ')}" como título do criador; use ${p.permitidos || 'a credencial real'}.`);
    const tarja = (P.TARJA || '').trim();
    if (tarja) { const w = E.palavras(tarja); add(w <= 7, `Tarja com ${w} palavra${w === 1 ? '' : 's'} (máximo 7)`, w <= 7 ? 'ok' : 'warn', 'Encurte a tarja pra até 7 palavras, só com a promessa.'); }
    const dados = raw.match(/\[DADO REAL[^\]]*\]/gi) || [];
    if (dados.length) add(false, `${dados.length} item${dados.length > 1 ? 'ns' : ''} sem dado real: [DADO REAL + FONTE]`, 'warn',
      'Falta o print ou a fonte desses números. Sem prova, o item não é gravado: pegue o print real (views visíveis) ou tire o item.',
      'Mantenha [DADO REAL + FONTE] só onde o criador realmente não forneceu o dado; não invente número.');
    const confs = raw.match(/\[CONFERIR[^\]]*\]/gi) || [];
    const pres = raw.match(/\[PREENCHER[^\]]*\]/gi) || [];
    if (confs.length) add(false, `${confs.length} fato${confs.length > 1 ? 's' : ''} marcado${confs.length > 1 ? 's' : ''} [CONFERIR]`, 'warn',
      `Confira na fonte oficial e registre em Perfil › Fatos conferidos; depois corrija. Pendente: ${confs.slice(0, 2).join(' ')}`,
      'Onde houver [CONFERIR], use só os fatos conferidos; se não houver fato conferido, reescreva a frase sem a afirmação técnica.');
    if (pres.length) add(false, `${pres.length} dado${pres.length > 1 ? 's' : ''} pessoal${pres.length > 1 ? 'is' : ''} a [PREENCHER]`, 'warn',
      `Escreva o fato real no campo "Fato pessoal" do Estúdio e rode de novo, ou corrija pra IA trocar a frase por uma situação do público. Falta: ${pres.slice(0, 2).join(' ')}`,
      'Remova todo [PREENCHER]: troque a frase que depende de dado pessoal por uma situação concreta do público, sem inventar história do criador.');
    return { itens: res, dur, P };
  };

  /* =================================================================
     VIRAIS PRA MODELAR
     ================================================================= */
  // lê números como o Instagram mostra: "12,3 mil", "1,2 mi", "3.4K", "129.228", "97,5%"
  E.parseNum = s => {
    if (s === '' || s == null) return null;
    if (typeof s === 'number') return isFinite(s) ? s : null;
    const t = String(s).trim().toLowerCase().replace(/\s+/g, ' ');
    const m = t.match(/^([\d][\d.,]*)\s*(milh(?:ão|ões|oes|ao)|mil|mi|k|m|bi)?(?![a-z])/);
    if (!m) return null;
    let num = m[1].replace(/[.,]$/, '');
    const suf = m[2];
    const mult = !suf ? 1 : (suf === 'mil' || suf === 'k') ? 1e3 : suf === 'bi' ? 1e9 : 1e6;
    if (num.includes('.') && num.includes(',')) num = num.lastIndexOf(',') > num.lastIndexOf('.') ? num.replace(/\./g, '').replace(',', '.') : num.replace(/,/g, '');
    else if (num.includes(',')) num = (!suf && /^\d{1,3}(,\d{3})+$/.test(num)) ? num.replace(/,/g, '') : num.replace(',', '.');
    else if (/^\d{1,3}(\.\d{3})+$/.test(num) && !suf) num = num.replace(/\./g, '');
    const v = parseFloat(num);
    return isFinite(v) ? Math.round(v * mult * 100) / 100 : null;
  };
  // lista de números (média de vários Reels): "12 mil; 8.500; 9,9 mil" → média
  E.parseLista = s => {
    if (s === '' || s == null) return { valores: [], media: null, n: 0 };
    const t = String(s).toLowerCase().replace(/(\d)\s+(milh\S*|mil|mi|k|m|bi)(?![a-z])/g, '$1$2');
    const toks = t.split(/[;\n|/]+|,\s+|\s+/).map(x => x.trim()).filter(Boolean);
    const valores = toks.map(E.parseNum).filter(v => v != null);
    const media = valores.length ? valores.reduce((a, b) => a + b, 0) / valores.length : null;
    return { valores, media, n: valores.length };
  };
  E.fmtK = n => {
    if (n == null || !isFinite(n)) return '—';
    const a = Math.abs(n);
    if (a >= 1e6) return (n / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mi';
    if (a >= 1e4) return (n / 1e3).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mil';
    return Math.round(n).toLocaleString('pt-BR');
  };
  E.fmtPct = (x, d) => x == null || !isFinite(x) ? '—' : x.toLocaleString('pt-BR', { maximumFractionDigits: d == null ? (x < 1 ? 2 : 1) : d }) + '%';
  E.fmtX = x => x == null || !isFinite(x) ? '—' : (x >= 10 ? Math.round(x).toLocaleString('pt-BR') : x.toLocaleString('pt-BR', { maximumFractionDigits: 1 })) + '×';

  const B = () => N.BENCH || { itens: [], sinais: [] };
  const rowFaixa = (faixas, seg) => seg == null ? null : (faixas || []).find(f => seg >= f.de && (f.ate == null || seg < f.ate)) || null;
  E.faixa = seg => {
    const f = rowFaixa([{ de: 0, ate: 1000, rotulo: 'até 1 mil' }, { de: 1000, ate: 5000, rotulo: '1 a 5 mil' }, { de: 5000, ate: 10000, rotulo: '5 a 10 mil' }, { de: 10000, ate: 50000, rotulo: '10 a 50 mil' }, { de: 50000, ate: 100000, rotulo: '50 a 100 mil' }, { de: 100000, ate: 1000000, rotulo: '100 mil a 1 mi' }, { de: 1000000, ate: null, rotulo: 'mais de 1 mi' }], seg);
    return f ? { rotulo: f.rotulo } : null;
  };
  // procura as médias do Instagram pra uma métrica, na faixa de seguidores do perfil
  E.bench = (metrica, seg) => {
    const out = [];
    for (const it of B().itens || []) {
      if (it.metrica !== metrica) continue;
      let valor = it.valor, faixa = null;
      if (it.faixas) {
        const row = rowFaixa(it.faixas, seg);
        if (!row || row.valor == null) continue;
        valor = row.valor; faixa = { rotulo: row.rotulo };
      }
      if (valor == null) continue;
      out.push(Object.assign({}, it, { valor, faixa }));
    }
    return out;
  };

  E.viralStats = v => {
    const n = k => E.parseNum(v[k]);
    const seg = n('seguidores'), views = n('views'), dur = n('duracao');
    const md = v.media || {};
    const M = {};
    ['views', 'curtidas', 'comentarios', 'salvamentos', 'compartilhamentos'].forEach(k => { M[k] = E.parseLista(md[k]); });
    const KEYS = ['curtidas', 'comentarios', 'salvamentos', 'compartilhamentos'];
    const I = {}; KEYS.forEach(k => { I[k] = n(k); });
    const somaI = KEYS.reduce((a, k) => a + (I[k] || 0), 0);
    const temI = KEYS.some(k => I[k] != null);
    const rows = KEYS.map(k => {
      const val = I[k];
      const porView = val != null && views ? val / views * 100 : null;
      const porSeg = val != null && seg ? val / seg * 100 : null;
      const xPerfil = val != null && M[k].media ? val / M[k].media : null;
      const perfilPorView = M[k].media && M.views.media ? M[k].media / M.views.media * 100 : null;
      const bench = val == null ? [] : E.bench(k, seg).map(b => {
        const aqui = b.base === 'seguidores' ? porSeg : (b.base === 'views' || b.base === 'alcance') ? porView : b.base === 'post' ? val : null;
        return Object.assign(b, { aqui, x: aqui != null && b.valor ? aqui / b.valor : null });
      });
      return { k, val, porView, porSeg, xPerfil, perfilMedia: M[k].media, perfilPorView, bench };
    });
    const erSeg = temI && seg ? somaI / seg * 100 : null;
    const erViews = temI && views ? somaI / views * 100 : null;
    // cada média usa o numerador da própria fonte (ex.: curtidas + comentários)
    const benchER = E.bench('engajamento', seg).map(b => {
      const num = b.numerador || KEYS;
      const faltando = num.some(k => I[k] == null);
      const soma = num.reduce((a, k) => a + (I[k] || 0), 0);
      const den = b.base === 'seguidores' ? seg : (b.base === 'views' || b.base === 'alcance') ? views : null;
      const aqui = !faltando && den ? soma / den * 100 : null;
      return Object.assign(b, { aqui, x: aqui != null && b.valor ? aqui / b.valor : null });
    });
    const benchViews = E.bench('views', seg).map(b => {
      const aqui = b.base === 'seguidores' && views && seg ? views / seg * 100 : b.base === 'post' ? views : null;
      return Object.assign(b, { aqui, x: aqui != null && b.valor ? aqui / b.valor : null });
    });
    const alcanceX = views && seg ? views / seg : null;
    const outlierX = views && M.views.media ? views / M.views.media : null;
    const perfilER = (() => {
      if (!seg) return null;
      const s = KEYS.reduce((a, k) => a + (M[k].media || 0), 0);
      return KEYS.some(k => M[k].media) ? s / seg * 100 : null;
    })();
    const shareLike = I.compartilhamentos != null && I.curtidas ? I.compartilhamentos / I.curtidas : null;
    const saveLike = I.salvamentos != null && I.curtidas ? I.salvamentos / I.curtidas : null;
    const faixa = E.faixa(seg);
    const leitura = [];
    if (outlierX != null) leitura.push(outlierX >= 5 ? { n: 'good', t: `Outlier: ${E.fmtX(outlierX)} a média de views do próprio perfil.` } : outlierX >= 2 ? { n: 'amber', t: `${E.fmtX(outlierX)} a média de views do perfil: acima do normal, mas não é outlier (5×).` } : { n: '', t: `Só ${E.fmtX(outlierX)} a média de views do perfil: o perfil já costuma ter esse alcance.` });
    if (alcanceX != null) leitura.push(alcanceX >= 10 ? { n: 'good', t: `Furou a bolha: ${E.fmtX(alcanceX)} o número de seguidores em views.` } : alcanceX >= 1 ? { n: 'amber', t: `Views ${E.fmtX(alcanceX)} os seguidores.` } : { n: '', t: `Views abaixo do número de seguidores (${E.fmtX(alcanceX)}): alcance ficou na base.` });
    if (shareLike != null) leitura.push(shareLike >= 1 ? { n: 'good', t: `Compartilhamentos passaram as curtidas (${E.fmtX(shareLike)}): valor social, a pessoa manda pra alguém.` } : shareLike >= 0.3 ? { n: 'amber', t: `Compartilhamentos em ${E.fmtPct(shareLike * 100, 0)} das curtidas.` } : { n: '', t: `Poucos compartilhamentos por curtida (${E.fmtPct(shareLike * 100, 0)}).` });
    if (saveLike != null) leitura.push(saveLike >= 1 ? { n: 'good', t: `Salvamentos passaram as curtidas (${E.fmtX(saveLike)}): utilidade, a pessoa guarda pra usar.` } : saveLike >= 0.3 ? { n: 'amber', t: `Salvamentos em ${E.fmtPct(saveLike * 100, 0)} das curtidas.` } : { n: '', t: `Poucos salvamentos por curtida (${E.fmtPct(saveLike * 100, 0)}).` });
    return { seg, views, dur, M, I, rows, erSeg, erViews, benchER, benchViews, alcanceX, outlierX, perfilER, shareLike, saveLike, faixa, leitura, temI };
  };

  function benchTexto() {
    const b = B();
    const L = [];
    (b.itens || []).forEach(it => {
      const val = it.faixas ? it.faixas.map(f => `${f.rotulo}: ${f.valor}${it.unidade || ''}`).join(' · ') : `${it.valor}${it.unidade || ''}`;
      L.push(`- ${it.rotulo}: ${val} (${it.definicao}; ${it.amostra ? it.amostra + '; ' : ''}${it.fonte}, ${it.periodo})`);
    });
    return L.join('\n') || '(sem médias carregadas)';
  }
  E.benchTexto = benchTexto;

  function statsTexto(v, S) {
    const L = [];
    const faixa = S.faixa ? ` (faixa: ${S.faixa.rotulo})` : '';
    L.push(`- Seguidores do perfil de origem: ${E.fmtK(S.seg)}${faixa}`);
    L.push(`- Views: ${E.fmtK(S.views)}${S.alcanceX != null ? ` = ${E.fmtX(S.alcanceX)} os seguidores` : ''}${S.outlierX != null ? `; ${E.fmtX(S.outlierX)} a média de views do perfil (média de ${S.M.views.n} Reels: ${E.fmtK(S.M.views.media)})` : '; média de views do perfil não informada'}`);
    S.rows.forEach(r => {
      if (r.val == null) { L.push(`- ${r.k}: não informado`); return; }
      const parts = [`${E.fmtK(r.val)}`];
      if (r.porView != null) parts.push(`${E.fmtPct(r.porView)} das views`);
      if (r.porSeg != null) parts.push(`${E.fmtPct(r.porSeg)} dos seguidores`);
      if (r.xPerfil != null) parts.push(`${E.fmtX(r.xPerfil)} a média do perfil (${E.fmtK(r.perfilMedia)})`);
      if (r.perfilPorView != null && r.porView != null) parts.push(`taxa típica do perfil: ${E.fmtPct(r.perfilPorView)} das views`);
      r.bench.forEach(b => { if (b.aqui != null) parts.push(`média do Instagram (${b.rotulo}${b.faixa ? ', ' + b.faixa.rotulo : ''}): ${b.valor}${b.unidade || ''} → este vídeo ${E.fmtX(b.x)}`); });
      L.push(`- ${r.k}: ${parts.join(' · ')}`);
    });
    if (S.erSeg != null) L.push(`- Engajamento por seguidores (curtidas+comentários+salvamentos+compartilhamentos ÷ seguidores): ${E.fmtPct(S.erSeg)}${S.perfilER != null ? ` · típico do perfil: ${E.fmtPct(S.perfilER)}` : ''}`);
    if (S.erViews != null) L.push(`- Engajamento por views: ${E.fmtPct(S.erViews)}`);
    S.benchER.forEach(b => { if (b.aqui != null) L.push(`- Média do Instagram — ${b.rotulo}${b.faixa ? ' (' + b.faixa.rotulo + ')' : ''}: ${b.valor}${b.unidade || ''} (${b.definicao}; ${b.fonte}, ${b.periodo}) → este vídeo ${E.fmtX(b.x)}`); });
    S.benchViews.forEach(b => { if (b.aqui != null) L.push(`- Média do Instagram — ${b.rotulo}${b.faixa ? ' (' + b.faixa.rotulo + ')' : ''}: ${b.valor}${b.unidade || ''} (${b.fonte}, ${b.periodo}) → este vídeo ${E.fmtX(b.x)}`); });
    if (S.shareLike != null) L.push(`- Compartilhamentos ÷ curtidas: ${E.fmtX(S.shareLike)}`);
    if (S.saveLike != null) L.push(`- Salvamentos ÷ curtidas: ${E.fmtX(S.saveLike)}`);
    if (S.dur != null) L.push(`- Duração: ${S.dur} s`);
    return L.join('\n');
  }

  E.promptViral = (st, v, S, nImgs) => {
    const p = st.profile;
    const pf = E.agrupar(st, 'formato');
    const ranking = Object.entries(pf).filter(([, x]) => x.media != null).sort((a, b) => b[1].media - a[1].media).map(([k, x]) => `${E.formato(k).nome} (${x.media})`).join(', ');
    const sinais = (B().sinais || []).map(s => `- ${s.texto} (${s.fonte}, ${s.data})`).join('\n');
    const contexto = (B().contexto || []).map(s => `- ${s.texto} (${s.fonte}, ${s.data})`).join('\n');
    const texto = `Você é o NARRADOR DE IMPACTO, estrategista de conteúdo de ${p.nome || 'um criador'} (${p.handle || ''}). O criador salvou um Reel VIRAL de outro perfil pra MODELAR: copiar a estrutura, o ritmo e os recursos, nunca o conteúdo, as frases ou a identidade de quem fez. Explique POR QUE ele viralizou e COMO modelar pro perfil do criador. Português do Brasil, frases curtas, sem floreio, sem prometer views. Não invente nada fora dos dados${nImgs ? ' e das imagens' : ''}: se faltar dado pra afirmar algo, diga que falta.

═══ QUEM VAI MODELAR ═══
Nicho: ${p.nicho || '—'}
Posicionamento: ${p.posicionamento || '—'}
Público: ${p.publico || '—'}
Credencial: ${p.credencial || '—'}${p.proibidos ? ` · Nunca usar: ${p.proibidos}` : ''}
O que consegue gravar e editar: ${p.gravacao || '—'}
${ranking ? `Formatos com melhor score no perfil: ${ranking}.` : ''}

═══ O VIRAL ═══
Perfil de origem: ${v.handle || 'não informado'}${v.nicho ? ' · nicho: ' + v.nicho : ''}
Assunto: ${v.titulo || '—'}${v.link ? ' · ' + v.link : ''}${v.postadoEm ? ' · postado em ' + v.postadoEm.split('-').reverse().join('/') : ''}${v.audio ? ' · áudio: ' + v.audio : ''}

NÚMEROS E COMPARAÇÕES (calculados pelo app; use estes, não recalcule):
${statsTexto(v, S)}

MÉDIAS DO INSTAGRAM (pesquisadas e conferidas na fonte em ${B().atualizado || 'set/2026'}; cite a fonte quando usar e respeite o denominador de cada uma):
${benchTexto()}
${B().nota ? `Atenção: ${B().nota}` : ''}
${contexto ? `\nOUTROS DADOS DE MERCADO:\n${contexto}` : ''}
${sinais ? `\nO QUE O PRÓPRIO INSTAGRAM DIZ QUE PESA NO ALCANCE:\n${sinais}` : ''}

ROTEIRO / TRANSCRIÇÃO:
"""
${(v.roteiro || '(não informado)').slice(0, 6000)}
"""
TEXTO NA TELA: ${(v.textoTela || '—').slice(0, 1200)}
EDIÇÃO (descrita pelo criador): ${(v.edicao || '—').slice(0, 2000)}
LEGENDA DO POST: ${(v.legenda || '—').slice(0, 2200)}
${nImgs ? `IMAGENS: ${nImgs} print(s) do vídeo (frame 0, cenas ou tela de números). Use pra ler a edição: enquadramento, texto na tela, tarja, cortes, legenda animada, cores, expressão, cenário.` : ''}

═══ COMO A MODELAGEM DEVE SAIR ═══
O gancho do vídeo do criador é DELE: na modelagem você sugere uma ideia de gancho nova, escrita por você no estilo do criador, com a mesma função psicológica do gancho do viral (NUNCA a frase do viral). O criador vai editar. Tema do banco é opcional e não entra aqui.
CATEGORIAS DE GANCHO (id, só pra classificar o gancho do viral): ${N.CATS.map(c => c.id + ' ' + c.nome).join(' · ')}
FORMATOS (id): ${N.FORMATOS.map(f => f.id + ' = ' + f.nome + ' (' + f.dur[0] + '–' + f.dur[1] + ' s)').join(' · ')}

═══ COMO ANALISAR ═══
1. Números primeiro. Views muito acima dos seguidores = foi distribuído pra não seguidores. Compartilhamento alto = valor social; salvamento alto = utilidade; comentário alto = polêmica, identificação ou pedido explícito; curtida alta com pouco compartilhamento = agradou a base mas não espalhou. Compare com a média do próprio perfil (outlier) e com a média do Instagram pra faixa de seguidores.
2. Gancho: o que prende nos 3 primeiros segundos (visual, verbal, áudio) e quais dos 4 pilares ele acende (dor universal, surpresa, promessa de clareza, impacto emocional).
3. Roteiro: estrutura em atos com tempos aproximados, onde entra o problema, a solução, a frase-chiclete, o CTA; ritmo (MAS/PORTANTO, ganchos internos, lista).
4. Edição: quebra de padrão no frame 0, cortes, texto na tela, legenda, áudio, duração.
5. O que depende do perfil de origem (fama, rosto, polêmica, trend, sorte do momento) e NÃO se transfere.
6. Em "modelar", siga este checklist: a estrutura (não as frases), o tipo de gancho (não o assunto), a velocidade da entrega, a ordem dos argumentos, o contraste do começo, a emoção despertada, a dúvida mantida aberta até o fim, o formato visual e o tipo de CTA. Depois, transforme num conteúdo que só faria sentido no nicho do criador.
7. Diga qual métrica o vídeo mais puxou e por quê: salvamento (tutorial), curtida (opinião), comentário (assunto do momento ou resultado pessoal), compartilhamento (algo que a pessoa não conseguiria dizer sozinha).
8. Valor: qual transformação o viral provoca (antes → depois), o que a pessoa leva dele e por que alguém seguiria o perfil depois de assistir. Viral que só entretém não vira seguidor qualificado. A modelagem do criador tem que entregar MAIS valor que o original, no nicho dele: mais concreta, aplicável hoje e com motivo claro pra seguir.
9. Fórmula do gancho, escolha a mais próxima: numero (número primeiro com resultado), contraria (verdade contrária), cena (cena identificável), confissao (história com custo real), lista (lista numerada), antesdepois (transformação), mito (mito × verdade), framework (método com nome), quebra (quebra de padrão com loop aberto), comoeu ("como eu" com resultado).

Responda só com JSON, sem nada antes ou depois:
{"veredito": "uma frase: por que viralizou",
 "fatores": [{"area": "gancho|roteiro|edicao|formato|tema|audio|legenda|numeros|perfil", "peso": 5, "porque": "uma frase", "evidencia": "o dado, a fala ou o detalhe que prova"}],
 "gancho": {"texto": "o gancho do viral, transcrito", "categoria": 3, "formula": "contraria", "pilares": ["surpresa", "dor universal"], "porque": "uma frase"},
 "entrega": {"transformacao": "antes → depois que o viral provoca em quem assiste", "levaPronto": "o que a pessoa leva pra usar (ou 'nada concreto')", "porQueSeguir": "por que alguém seguiria o perfil depois (ou por que não seguiria)", "comoSuperar": "como a versão do criador entrega mais valor que o original, em 1 ou 2 frases"},
 "estrutura": [{"parte": "Gancho", "tempo": "0–3 s", "oque": "o que acontece"}],
 "edicao": ["recurso de edição observado e o efeito dele"],
 "formato": "lista",
 "numeros": ["leitura curta de um número comparado com as médias"],
 "naoTransfere": ["o que depende do perfil de origem"],
 "modelar": ["o que copiar da estrutura/edição"],
 "naoCopiar": ["o que não copiar"],
 "modelagem": {"gancho": "ideia de gancho nova, frase completa, estilo do criador", "formato": "lista", "angulo": "como fica esse vídeo no nicho do criador, em 1 ou 2 frases", "porque": "uma frase"},
 "alternativas": [{"gancho": "outra ideia de gancho", "formato": "comparativo", "angulo": "uma frase"}],
 "licoes": ["regra curta e acionável que o criador leva deste viral, no máximo 3"]}
Os fatores vão do mais forte pro mais fraco (peso de 1 a 5). Duas alternativas, com ângulos e ganchos diferentes da modelagem principal.`;
    return E.encolher(texto);
  };

  E.promptLerPrints = n => `Estes ${n} prints são de um Reel do Instagram e/ou do perfil que postou. Leia SÓ os números e textos que aparecem nas imagens. Não estime, não complete, não invente: se algo não aparece, use null. Copie os números exatamente como aparecem (ex.: "12,3 mil", "1.204", "2,1 mi").
Responda só com JSON:
{"handle": "@perfil ou null", "seguidores": "número de seguidores do perfil ou null", "views": "visualizações/reproduções ou null", "curtidas": null, "comentarios": null, "compartilhamentos": null, "salvamentos": null, "duracao": "duração em segundos ou null", "legenda": "texto da legenda visível ou null", "textoTela": "texto sobreposto no vídeo, se visível, ou null"}`;

  E.blocoModelo = m => {
    const L = [];
    L.push(`VÍDEO VIRAL DE REFERÊNCIA PRA MODELAR (${m.handle || 'perfil de origem'}${m.titulo ? `, "${m.titulo}"` : ''}). Modele a ESTRUTURA, o ritmo e os recursos de edição; nunca copie o conteúdo, as frases, o gancho ou a identidade dele. O gancho é o do criador (ideia dele, refinada só se precisar).`);
    if (m.veredito) L.push(`Por que ele viralizou: ${m.veredito}`);
    if ((m.estrutura || []).length) L.push('Estrutura dele: ' + m.estrutura.map(e => `${e.parte}${e.tempo ? ' (' + e.tempo + ')' : ''}: ${e.oque}`).join(' → '));
    if ((m.edicao || []).length) L.push('Edição dele: ' + m.edicao.join(' · '));
    if ((m.modelar || []).length) L.push('Modelar: ' + m.modelar.join(' · '));
    if ((m.naoCopiar || []).length) L.push('Não copiar: ' + m.naoCopiar.join(' · '));
    if (m.angulo) L.push(`Ângulo pro nicho do criador: ${m.angulo}`);
    if (m.entrega && m.entrega.transformacao) L.push(`Valor que o viral entrega: ${m.entrega.transformacao}${m.entrega.porQueSeguir ? ' · por que seguiriam: ' + m.entrega.porQueSeguir : ''}`);
    if (m.entrega && m.entrega.comoSuperar) L.push(`Entregue MAIS valor que o viral: ${m.entrega.comoSuperar}`);
    L.push('Nas DICAS DE EDIÇÃO, adapte os recursos de edição do viral que o criador consegue gravar.');
    return L.join('\n');
  };

  // blocos de prompt reaproveitados pelas extensões do Instagram (ig-*.js)
  E.nucleo = nucleo;
  E.dna = dna;
  E.verdade = verdade;
  E.aprendizados = aprendizados;
  E.legendaRegra = legendaRegra;
  E.ctaRegra = ctaRegra;
  E.fmtBloco = fmtBloco;

  window.NDE = E;
})();
