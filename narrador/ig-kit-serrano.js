/* Narrador de Impacto — ferramentas do Kit vindas das skills do Claude do criador
   (lista-ranking-serrano, react-print-serrano, corte-viral). Carrega antes do app.js. */
(function () {
  const X = window.NDX; if (!X) return;
  const A = () => window.NDA;
  const esc = X.esc, ic = (n, c) => X.ic(n, c);
  const fimJSON = ex => `\n\nResponda só com JSON, sem texto antes ou depois, exatamente neste formato:\n${ex}`;
  const corta = (s, n) => { s = String(s == null ? '' : s); return s.length > n ? s.slice(0, n) + '\n[...texto cortado]' : s; };
  const desab = () => (X.prontoIA() ? '' : 'disabled');
  const hl = t => { const a = A(); return a && a.hl ? a.hl(t) : esc(t); };
  const parar = id => `<button type="button" class="btn sm" data-a="x-parar" data-t="${id}">${ic('stop', 'sm')} Parar</button>`;
  const origemTag = S => S.origem ? `<div class="kit-row"><span class="tag amber">Veio de: ${esc(S.origem)}</span></div>` : '';
  const salvar = (S, item, msg) => {
    const ant = S.salvoId ? (X.pecas() || []).find(x => x.id === S.salvoId) : null;
    if (ant) { item.id = ant.id; item.createdAt = ant.createdAt; }
    const it = X.salvar('pecas', item); S.salvoId = it ? it.id : null;
    A().toast(msg || 'Salvo no Kit.'); X.refresh();
  };
  const salvosHTML = (tipo, acao) => {
    const ps = X.pecas(tipo).slice(0, 8);
    if (!ps.length) return '';
    return `<div class="kit-sec"><div class="eyebrow">Salvos</div><div class="kit-hist">${ps.map(p => `<div class="rec-row"><button type="button" class="btn xs ghost" style="justify-content:flex-start; white-space:normal; text-align:left; height:auto; padding:6px 8px" data-a="${acao}" data-id="${esc(p.id)}">${esc(p.titulo || 'Sem título')}</button><button type="button" class="btn xs icon-btn ghost" data-a="x-del-peca" data-id="${esc(p.id)}" aria-label="Apagar">${ic('trash', 'sm')}</button></div>`).join('')}</div></div>`;
  };
  const abrirSalvo = id => el => {
    const p = (X.pecas() || []).find(x => x.id === el.dataset.id); if (!p) return;
    const S = X.toolState(id); Object.assign(S, p.form || {}); S.res = p.res; S.err = ''; S.salvoId = p.id; X.refresh();
  };
  const perfil = () => A().st.profile;
  // lente do perfil: o que qualifica o seguidor (nicho + posicionamento + credencial)
  const lente = () => { const p = perfil(); return [p.nicho && `Nicho: ${p.nicho}`, p.posicionamento && `Posicionamento: ${X.str(p.posicionamento, 500)}`, p.credencial && `Credencial real: ${X.str(p.credencial, 300)}`, p.ofertas && `Ofertas (funil): ${X.str(p.ofertas, 500)}`, p.publico && `Público que compra: ${X.str(p.publico, 400)}`].filter(Boolean).join('\n'); };

  /* =====================================================================
     1) LISTA RANKING (skill lista-ranking-serrano)
     ===================================================================== */
  const LISTA_REGRAS = `═══ LISTA RANKING: A MECÂNICA (não negociável) ═══
Reel de lista em contagem regressiva, 45 a 90 s, feito pra salvamento, envio e comentário com palavra-chave (o comentário vira lead no direct).
1. Assinatura visual: close fechado, energia alta, UM objeto na mão o tempo todo (celular com a tela virada pra câmera, caderno, o livro quando for lista de livros), fundo neutro e sempre o mesmo.
2. Dois textos na tela: fixo no topo, o título-fórmula com UMA palavra em CAIXA ALTA; logo abaixo, o item atual ("3º lugar: ...") que troca a cada item.
3. Gancho verbal de DESAFIO ou de INIMIGO COMUM (0–5 s): "Faz isso hoje e eu duvido que você não consiga X." / "Coloca isso agora e tenta resistir." / "[N] coisas que [público] deveria saber, mas ninguém ensina porque [instituição] esconde."
4. Autoridade em UMA frase (5–12 s) pela lente fixa do perfil. Nunca invente dado: sem número real com fonte, a autoridade vira experiência própria marcada [PREENCHER: resultado real do criador] ou fato conferido.
5. Ranking regressivo: cada item = nome + UMA frase de transformação (o que muda na vida da pessoa), nunca resenha; 5 a 7 s por item; o 1º lugar entra com "Mas em 1º lugar..." e é o menos óbvio. Variação de 3 itens: dois bons e o terceiro "o mais perigoso".
6. Palavra-chave dupla: o 1º pedido vem DEPOIS da promessa e da autoridade (~10–15 s), nunca antes do 8º segundo; o 2º no fim. Só com entrega real no mesmo dia (automação de direct ou resposta na mão); sem isso, "o link está na bio".
7. Bordão fixo de saída (o do perfil). Fala com no máximo 220 palavras.
Temas que furam a bolha e qualificam: dor universal E próxima de quem compra, com solução testável hoje. Evite tema saturado com itens óbvios (se for saturado, o item 1 tem que ser inesperado) e tema que atrai só colegas de profissão. Teste da ponte: quem comenta a palavra poderia comprar do perfil?
Títulos-fórmula: "[N] [coisas] para [resultado] sem nem PERCEBER" · "[N] [coisas] que TODO [público] precisa [ação] antes de [marco]" · "A [coisa] que te faz [resultado] em menos de [tempo]" · "[N] frases que [pessoa] NUNCA ESQUECE" / "que DESTROEM [algo]" · "Os [N] [itens] que [mercado] ESCONDE".
Leitura de números: muita view e pouco comentário = palavra fraca; muito comentário e pouco seguidor = a lente não apareceu; pulados nos 3 s = desafio fraco ou título saturado; queda no meio = itens longos ou óbvios.`;
  X.tool({
    id: 'lista', nome: 'Lista ranking', icone: 'layers', ordem: 22,
    resumo: 'Reel de lista em contagem regressiva com desafio no gancho e palavra-chave que vira lead.',
    init: () => ({ tema: '', palavra: '', entrega: '', itens: '5', origem: '', salvoId: null }),
    render(S) {
      const p = 'kit.tools.lista', pf = perfil();
      const entrada = `<section class="card kit-in">
        <h2>Lista ranking</h2>
        <p class="lead">Reel de 45 a 90 s em contagem regressiva: desafio no gancho, autoridade em uma frase, um item por bloco e a palavra-chave que transforma comentário em lead no direct.</p>
        ${origemTag(S)}
        ${X.h.campo({ path: p + '.tema', label: 'Tema da lista (vazio = a IA sugere 5)', tipo: 'textarea', rows: 3, placeholder: 'Ex.: cláusulas que todo criador precisa ter antes de fechar a primeira publi' })}
        <div class="field"><span>Quantos itens</span>${X.h.seg(p + '.itens', [['3', '3 (com o "mais perigoso")'], ['5', '5']])}</div>
        ${X.h.campo({ path: p + '.palavra', label: 'Palavra-chave do comentário', placeholder: pf.ctaPalavra ? pf.ctaPalavra : 'Ex.: LISTA, CONTRATO, ROTEIRO', help: 'Só use se der pra entregar no mesmo dia. Vazio = a IA sugere uma ligada ao tema.' })}
        ${X.h.campo({ path: p + '.entrega', label: 'O que a pessoa recebe no direct', placeholder: 'Ex.: a lista com os links; o PDF do Manual do Roteiro Viral' })}
        <button type="button" class="btn primary" data-a="x-ks-lista" ${desab()}>${ic('spark', 'sm')} Gerar lista ranking</button>
        ${salvosHTML('lista', 'x-ks-lista-abrir')}
      </section>`;
      let saida;
      if (S.busy) saida = X.h.ocupado('Montando a lista, o roteiro em tabela, a legenda e a mensagem do direct.') + parar('lista');
      else if (!S.res) saida = X.h.erro(S.err) + X.h.vazio('O roteiro da lista aparece aqui.', 'Você recebe 3 títulos com a palavra em CAIXA ALTA, o roteiro em tabela (tempo, fala, texto do topo, texto do item, ação), a legenda, a mensagem automática do direct e um corte curto de 15 s pra testar alcance.');
      else saida = X.h.erro(S.err) + listaOut(S.res);
      return `<div class="kit">${entrada}<section class="kit-out">${saida}</section></div>`;
    }
  });
  function parseLista(r) {
    if (!r || typeof r !== 'object') return null;
    const linhas = X.arr(r.roteiro, 30, x => x && typeof x === 'object' ? { tempo: X.str(x.tempo, 20), fala: X.str(x.fala, 400), topo: X.str(x.topo, 120), item: X.str(x.item, 120), acao: X.str(x.acao, 200) } : null).filter(x => x && x.fala);
    if (!linhas.length) return null;
    return {
      sugestoes: X.arr(r.sugestoes, 5, x => x && typeof x === 'object' ? { titulo: X.str(x.titulo, 160), palavra: X.str(x.palavra, 30), porque: X.str(x.porque, 300) } : null).filter(x => x && x.titulo),
      titulos: X.arr(r.titulos, 3, x => X.str(x, 160)), tema: X.str(r.tema, 200), palavra: X.str(r.palavra, 30), autoridade: X.str(r.autoridade, 400),
      roteiro: linhas, legenda: X.str(r.legenda, 2200), dm: X.str(r.dm, 1200), curto: X.str(r.curto, 800), avisos: X.arr(r.avisos, 6)
    };
  }
  const roteiroTxt = r => r.roteiro.map(l => `${l.tempo ? '[' + l.tempo + '] ' : ''}${l.fala}${l.topo ? `\n  topo: ${l.topo}` : ''}${l.item ? `\n  item: ${l.item}` : ''}${l.acao ? `\n  ação: ${l.acao}` : ''}`).join('\n');
  function listaOut(r) {
    const tabela = `<div class="cmp-wrap"><table class="cmp"><thead><tr><th>Tempo</th><th>Fala</th><th>Texto no topo</th><th>Texto do item</th><th>Ação ou objeto</th></tr></thead><tbody>${r.roteiro.map(l => `<tr><td class="mono">${esc(l.tempo)}</td><td>${hl(l.fala)}</td><td>${esc(l.topo)}</td><td>${esc(l.item)}</td><td class="faint">${esc(l.acao)}</td></tr>`).join('')}</tbody></table></div>`;
    return `${r.sugestoes.length ? `<div class="card kit-sec"><h3>Temas sugeridos</h3><ul class="list">${r.sugestoes.map((x, i) => `<li><b>${esc(x.titulo)}</b>${x.palavra ? ` <span class="tag amber">${esc(x.palavra)}</span>` : ''}${i === 0 ? ' <span class="tag good">gravar primeiro</span>' : ''}<br><span class="faint">${esc(x.porque)}</span></li>`).join('')}</ul></div>` : ''}
      <div class="card kit-sec"><div class="kit-row"><h3 class="grow">Título na tela</h3>${r.palavra ? `<span class="tag amber">palavra: ${esc(r.palavra)}</span>` : ''}</div>
        ${r.titulos.map(t => `<div class="kit-row"><q class="mq grow" style="margin:0">${esc(t)}</q>${X.h.copiar(t, 'Copiar')}</div>`).join('')}
        ${r.autoridade ? `<p style="margin:0"><b>Autoridade:</b> ${hl(r.autoridade)}</p>` : ''}</div>
      <div class="card kit-sec"><div class="kit-row"><h3 class="grow">Roteiro</h3>${X.h.copiar(roteiroTxt(r), 'Copiar roteiro')}</div>${tabela}</div>
      ${r.legenda ? `<div class="card kit-sec"><div class="kit-row"><h3 class="grow">Legenda</h3>${X.h.copiar(r.legenda, 'Copiar')}</div>${X.h.dobra(r.legenda)}${X.h.contagem(r.legenda)}</div>` : ''}
      ${r.dm ? `<div class="card kit-sec"><div class="kit-row"><h3 class="grow">Mensagem automática do direct</h3>${X.h.copiar(r.dm, 'Copiar')}</div><pre class="kit-pre">${esc(r.dm)}</pre></div>` : ''}
      ${r.curto ? `<div class="card kit-sec"><h3>Corte curto de 15 s</h3><p style="margin:0">${hl(r.curto)}</p></div>` : ''}
      ${r.avisos.length ? `<div class="card kit-sec"><h3>Antes de gravar</h3>${X.h.lista(r.avisos, 'warnlist')}</div>` : ''}
      <div class="kit-row"><button type="button" class="btn sm primary" data-a="x-ks-lista-estudio">${ic('estudio', 'sm')} Levar pro Estúdio</button><button type="button" class="btn sm" data-a="x-ks-lista-salvar">${ic('check', 'sm')} Salvar</button></div>`;
  }
  X.action('x-ks-lista', () => {
    const S = X.toolState('lista'), pf = perfil();
    const tema = X.str(S.tema, 800), n = S.itens === '3' ? 3 : 5;
    const palavra = X.str(S.palavra, 30) || X.str(pf.ctaPalavra, 60);
    const prompt = [X.ctxPerfil(), LISTA_REGRAS,
      `═══ A LENTE FIXA DO PERFIL (o que qualifica o seguidor) ═══\n${lente() || '(perfil sem nicho preenchido: use o público do DNA)'}${pf.bordao ? `\nBordão fixo do criador: "${pf.bordao}".` : '\nO criador ainda não tem bordão fixo: sugira 3 opções curtas no campo "avisos" e use [PREENCHER: bordão] no fechamento.'}`,
      `═══ TAREFA ═══
${tema ? `Tema: ${tema}` : 'O criador não trouxe tema: sugira 5 temas em "sugestoes" (título-fórmula, palavra-chave e por que fura a bolha qualificando), escolha o primeiro e escreva o roteiro dele.'}
Itens: ${n}${n === 3 ? ' (dois bons e o terceiro "o mais perigoso")' : ', do 5º ao 1º'}.
Palavra-chave: ${palavra ? `"${palavra}"` : 'sugira uma ligada ao tema'}. Entrega no direct: ${X.str(S.entrega, 300) || '[PREENCHER: o que a pessoa recebe ao comentar]'}.
Roteiro em linhas de tabela na ordem do vídeo: 0–5 s desafio ou inimigo comum; 5–12 s autoridade; ~12 s 1º pedido da palavra; um bloco por item; fechamento com "o segredo é [modo de usar]", 2º pedido da palavra e o bordão. Itens reais e verificáveis: nenhum livro, app, lei ou dado inventado; o que precisar de confirmação vai marcado [CONFERIR: o quê].
Legenda: uma frase pessoal curta, a palavra-chave repetida, 3 a 5 hashtags do tema (respeite a estrutura de legenda do perfil quando houver assinatura).
"dm": a mensagem automática que a pessoa recebe ao comentar: entrega, uma pergunta de qualificação (ex.: "você já vende algo online?") e o próximo degrau do funil (pelas ofertas do perfil).
"curto": um corte de 15 s do mesmo tema (só o item 1 ou uma reação) pra testar alcance.`].join('\n\n') + fimJSON(`{"sugestoes": [{"titulo": "...", "palavra": "LISTA", "porque": "..."}], "tema": "o tema usado", "titulos": ["5 cláusulas que TODO criador precisa ter antes da primeira publi", "...", "..."], "palavra": "CONTRATO", "autoridade": "a frase de autoridade", "roteiro": [{"tempo": "0–5s", "fala": "...", "topo": "título fixo", "item": "", "acao": "celular na mão, olhos arregalados"}], "legenda": "...", "dm": "...", "curto": "...", "avisos": ["..."]}`);
    X.rodar(S, prompt, r => { const o = parseLista(r); if (o) S.salvoId = null; return o; }, { tier: 'complex' });
  });
  X.action('x-ks-lista-salvar', () => { const S = X.toolState('lista'); if (!S.res) return; salvar(S, { tipo: 'lista', titulo: S.res.titulos[0] || S.res.tema || 'Lista ranking', form: { tema: S.tema, palavra: S.palavra, entrega: S.entrega, itens: S.itens }, res: S.res }, 'Lista salva.'); });
  X.action('x-ks-lista-abrir', abrirSalvo('lista'));
  X.action('x-ks-lista-estudio', () => {
    const S = X.toolState('lista'), r = S.res; if (!r) return;
    X.paraEstudio({ assunto: (r.titulos[0] || r.tema) + (r.palavra ? ` · palavra-chave ${r.palavra}` : ''), gancho: r.roteiro[0] ? r.roteiro[0].fala : '', formatoId: 'contagem', objetivo: 'salvamento', obs: 'Roteiro da Lista ranking (mantenha a mecânica: desafio, autoridade em 1 frase, palavra-chave depois dos 8 s e no fim, 1º lugar menos óbvio):\n' + corta(roteiroTxt(r), 4000), why: 'Lista ranking do Kit.' });
  });

  /* =====================================================================
     2) REACT DE PRINT (skill react-print-serrano)
     ===================================================================== */
  const REACT_REGRAS = `═══ REACT DE PRINT: A MECÂNICA (não negociável) ═══
Reel de 6 a 15 s (ideal 6–10) reagindo a um print real, pra ser descoberto fora da bolha e trazer quem pode comprar.
1. O contexto vai no print: manchete, fala, conversa, placar ou post fixo no terço de cima, rosto embaixo. Zero segundos explicando o assunto.
2. A emoção vem no frame 0: o pico já no primeiro frame (choque com mão na boca, deboche, indignação, "eu avisei"). Nada de sorriso morno, gaguejo ou "cara, então...".
3. Uma opinião só: toma um lado, não dá aula, não faz lista.
4. Corte seco: acaba na última palavra forte, ou no meio da frase, pro loop recomeçar.
5. Três versões por assunto, com aberturas diferentes: A choque ("Como que alguém...?"), B veredito ("Nessa ele acertou." / "Isso vai quebrar muito criador."), C deboche ou identificação.
6. O pedido de ação fica FORA da fala, só na legenda.
Formatos: F1 manchete + indignação · F2 fala de figura pública · F3 conversa absurda (só print real e público; simulação é dita como simulação) · F4 resultado ou placar · F5 hipótese provocativa (o mais arriscado: punchline nos 3 primeiros segundos, máximo 15 s). Comece por F1 e F2.
A PONTE: assunto de nicho já qualifica; assunto amplo termina em UMA frase que liga a vender, conteúdo, marca ou dinheiro (a ponte é a punchline, não uma explicação; se precisar de mais de uma frase, o assunto não serve). Quando o print envolve regra, lei, golpe, direito autoral, marca ou tributo, o veredito sai com a autoridade da credencial real do criador, sem aula e sem prometer resultado.
Evite: polêmica partidária sem ponte, tragédia, ataque a pessoa privada, dados de terceiros visíveis no print (borrar nomes e números).
Leitura: pulados acima de 40% = frame 0 ou 1ª frase falhou; views sem seguidores = a ponte não conectou.`;
  X.tool({
    id: 'react', nome: 'React de print', icone: 'flip', ordem: 24,
    resumo: 'Reels de 6 a 15 s reagindo a um print real, em 3 versões, com ponte pro seu nicho.',
    init: () => ({ assunto: '', fonte: '', img: null, imgUrl: '', origem: '', salvoId: null }),
    render(S) {
      const p = 'kit.tools.react', a = A();
      const podeImg = a && a.ui.imgMax > 0;
      const entrada = `<section class="card kit-in">
        <h2>React de print</h2>
        <p class="lead">Um assunto quente vira 3 Reels de 6 a 15 s pra gravar numa sessão só: print no topo, emoção no frame 0, uma opinião e a ponte pro seu nicho.</p>
        ${origemTag(S)}
        <div class="field"><span>Print (manchete, fala, conversa pública, placar)</span>
          <div class="files">${S.imgUrl ? `<div class="fprev" style="width:110px; aspect-ratio:auto"><img src="${esc(S.imgUrl)}" alt="Print"><button class="btn xs icon-btn" data-a="x-ks-react-rmimg" aria-label="Tirar print">${ic('x', 'sm')}</button></div>` : `<label class="fadd" for="ks-react-img" style="width:110px; aspect-ratio:auto; height:110px">${ic('upload')}<span>Subir print</span></label>`}<input type="file" id="ks-react-img" accept="image/png,image/jpeg,image/webp" hidden></div>
          <small>${podeImg ? 'A IA lê o print. Borre nomes e números de pessoas privadas antes de postar.' : 'Esta visualização não envia imagem pra IA: descreva o print abaixo.'}</small></div>
        ${X.h.campo({ path: p + '.assunto', label: 'O que diz o print / o assunto', tipo: 'textarea', rows: 4, placeholder: 'Cole a manchete, a fala ou descreva o print. Ex.: "Meta muda regra de alcance pra contas que repostam vídeo"' })}
        ${X.h.campo({ path: p + '.fonte', label: 'Fonte (onde saiu)', placeholder: 'Ex.: g1, 10/10/2026', help: 'Só print e notícia reais, com fonte. A IA não confere notícia: você confere.' })}
        <button type="button" class="btn primary" data-a="x-ks-react" ${desab()}>${ic('spark', 'sm')} Gerar 3 versões</button>
        ${salvosHTML('react', 'x-ks-react-abrir')}
      </section>`;
      let saida;
      if (S.busy) saida = X.h.ocupado('Classificando o print e escrevendo as 3 versões.') + parar('react');
      else if (!S.res) saida = X.h.erro(S.err) + X.h.vazio('As 3 versões aparecem aqui.', 'Formato (F1 a F5), o lado que o vídeo toma, a ponte pro seu nicho e, pra cada versão, o frame 0 exato, a fala de 15 a 35 palavras, a duração e onde cortar. Mais o recorte do print e a legenda com o pedido de ação.');
      else saida = X.h.erro(S.err) + reactOut(S.res);
      return `<div class="kit">${entrada}<section class="kit-out">${saida}</section></div>`;
    }
  });
  X.onChangeEvent(e => {
    if (!e.target || e.target.id !== 'ks-react-img') return false;
    const f = e.target.files && e.target.files[0]; e.target.value = '';
    if (!f || !/^image\//.test(f.type)) return true;
    const S = X.toolState('react');
    if (S.imgUrl) { try { URL.revokeObjectURL(S.imgUrl); } catch (er) { } }
    S.img = f; S.imgUrl = URL.createObjectURL(f); X.refresh();
    return true;
  });
  X.action('x-ks-react-rmimg', () => { const S = X.toolState('react'); if (S.imgUrl) { try { URL.revokeObjectURL(S.imgUrl); } catch (e) { } } S.img = null; S.imgUrl = ''; X.refresh(); });
  function parseReact(r) {
    if (!r || typeof r !== 'object') return null;
    const vs = X.arr(r.versoes, 3, x => x && typeof x === 'object' ? { abertura: X.str(x.abertura, 30), frame0: X.str(x.frame0, 300), fala: X.str(x.fala, 400), duracao: X.str(x.duracao, 20), final: X.str(x.final, 200) } : null).filter(x => x && x.fala);
    if (!vs.length) return null;
    const leg = r.legenda && typeof r.legenda === 'object' ? r.legenda : {};
    return { formato: X.str(r.formato, 60), tipo: X.str(r.tipo, 40), lado: X.str(r.lado, 300), ponte: X.str(r.ponte, 300), versoes: vs, recorte: X.str(r.recorte, 400), legenda: [X.str(leg.linha1, 200), X.str(leg.cta, 300)].filter(Boolean).join('\n\n') || X.str(r.legenda, 800), avisos: X.arr(r.avisos, 6), serve: r.serve !== false, porqueNao: X.str(r.porqueNao, 300) };
  }
  function reactOut(r) {
    return `${!r.serve ? `<div class="errnote warn">${ic('alert', 'sm')}<span>Este assunto não é bom pra react: ${esc(r.porqueNao || 'a ponte pro nicho não fecha em uma frase')}.</span></div>` : ''}
      <div class="card kit-sec"><div class="kit-row"><h3 class="grow">Leitura do print</h3>${r.formato ? `<span class="tag amber">${esc(r.formato)}</span>` : ''}${r.tipo ? `<span class="tag">${esc(r.tipo)}</span>` : ''}</div>
        ${r.lado ? `<p style="margin:0"><b>Lado do vídeo:</b> ${esc(r.lado)}</p>` : ''}${r.ponte ? `<p style="margin:0"><b>Ponte pro nicho:</b> ${hl(r.ponte)}</p>` : ''}</div>
      <div class="ideas">${r.versoes.map((v, i) => `<div class="idea ${i === 0 ? 'idea-best' : ''}"><div class="top"><span class="tag mono">Versão ${esc(v.abertura || String.fromCharCode(65 + i))}</span>${v.duracao ? `<span class="tag mono">${esc(v.duracao)}</span>` : ''}</div>
        ${v.frame0 ? `<p style="margin:0 0 6px"><b>Frame 0:</b> ${esc(v.frame0)}</p>` : ''}<q>${hl(v.fala)}</q>${v.final ? `<p class="kit-hint">Corte: ${esc(v.final)}</p>` : ''}
        <div class="kit-row" style="margin-top:8px">${X.h.copiar(v.fala, 'Copiar fala')}<button type="button" class="btn xs" data-a="x-ks-react-estudio" data-i="${i}">${ic('estudio', 'sm')} Levar pro Estúdio</button></div></div>`).join('')}</div>
      ${r.recorte ? `<div class="card kit-sec"><h3>O print na tela</h3><p style="margin:0">${esc(r.recorte)}</p></div>` : ''}
      ${r.legenda ? `<div class="card kit-sec"><div class="kit-row"><h3 class="grow">Legenda</h3>${X.h.copiar(r.legenda, 'Copiar')}</div><pre class="kit-pre">${esc(r.legenda)}</pre></div>` : ''}
      ${r.avisos.length ? `<div class="card kit-sec"><h3>Antes de postar</h3>${X.h.lista(r.avisos, 'warnlist')}</div>` : ''}
      <div class="kit-row"><button type="button" class="btn sm" data-a="x-ks-react-salvar">${ic('check', 'sm')} Salvar</button></div>`;
  }
  X.action('x-ks-react', () => {
    const S = X.toolState('react'), a = A();
    const txt = X.str(S.assunto, 3000);
    const lim = a.ui.imgLim;
    const imgs = S.img && lim && (!lim.maxInputBytes || S.img.size <= lim.maxInputBytes) && (!lim.mediaTypes || lim.mediaTypes.includes(S.img.type)) ? [S.img] : [];
    if (!txt && !imgs.length) { S.err = 'Suba o print ou escreva o que ele diz.'; X.refresh(); return; }
    const pf = perfil();
    const prompt = [X.ctxPerfil({ semAprendizados: true }), REACT_REGRAS,
      `═══ PÚBLICO E LENTE DO PERFIL ═══\n${lente() || '(sem nicho preenchido)'}`,
      `═══ O PRINT ═══\n${imgs.length ? 'A imagem anexada é o print. Leia o que está escrito nela; não invente o que não aparece.\n' : ''}${txt ? `Texto/descrição do criador: ${txt}\n` : ''}Fonte informada: ${X.str(S.fonte, 200) || 'não informada (marque nos avisos: conferir a fonte antes de postar)'}`,
      `═══ TAREFA ═══
Classifique (formato F1–F5, assunto de nicho ou amplo com ponte, o lado que o vídeo toma) e escreva 3 versões (A choque, B veredito, C deboche ou identificação). Cada versão: frame 0 (expressão ou gesto exato), fala completa de 15 a 35 palavras na linguagem falada do público, duração-alvo em segundos (6–15) e onde cortar. A ponte entra como punchline em uma frase, dentro da fala. Nada de CTA na fala.
Legenda: linha 1 = um segundo gancho curto; linha 2 = o pedido de ação (${pf.ctaModo === 'palavra' && pf.ctaPalavra ? `palavra-chave do perfil: ${pf.ctaPalavra}` : `seguir ${pf.handle || 'o perfil'} pra saber antes`}).
Se o assunto não servir (tragédia, partidário sem ponte, pessoa privada, ponte que não fecha em uma frase), diga em "serve": false e "porqueNao", e ainda assim sugira nas versões um ângulo que sirva.`].join('\n\n') + fimJSON(`{"serve": true, "porqueNao": "", "formato": "F1 manchete + indignação", "tipo": "amplo com ponte", "lado": "...", "ponte": "a frase-ponte", "versoes": [{"abertura": "A", "frame0": "mão na boca, olho arregalado", "fala": "...", "duracao": "8 s", "final": "corte seco em 'cliente'"}, {"abertura": "B", "frame0": "...", "fala": "...", "duracao": "...", "final": "..."}, {"abertura": "C", "frame0": "...", "fala": "...", "duracao": "...", "final": "..."}], "recorte": "o que recortar do print e onde posicionar", "legenda": {"linha1": "...", "cta": "..."}, "avisos": ["conferir a fonte", "borrar nomes"]}`);
    X.rodar(S, prompt, r => { const o = parseReact(r); if (o) S.salvoId = null; return o; }, { tier: 'default', images: imgs });
  });
  X.action('x-ks-react-salvar', () => { const S = X.toolState('react'); if (!S.res) return; salvar(S, { tipo: 'react', titulo: X.str(S.assunto, 80) || S.res.versoes[0].fala.slice(0, 80), form: { assunto: S.assunto, fonte: S.fonte }, res: S.res }, 'React salvo.'); });
  X.action('x-ks-react-abrir', abrirSalvo('react'));
  X.action('x-ks-react-estudio', el => {
    const S = X.toolState('react'), r = S.res; if (!r) return;
    const v = r.versoes[Number(el.dataset.i)] || r.versoes[0];
    X.paraEstudio({ assunto: `React de print: ${X.str(S.assunto, 300)}${r.ponte ? ' · ponte: ' + r.ponte : ''}`, gancho: v.fala, formatoId: 'react', objetivo: 'compartilhamento', obs: `Reel de 6 a 15 s, uma opinião, corte seco (${v.final || 'na última palavra forte'}). Frame 0: ${v.frame0}. Print no terço de cima. CTA só na legenda. Fonte: ${X.str(S.fonte, 200) || 'conferir'}.`, why: 'React de print do Kit: mantenha curto, o Estúdio vai sugerir o resto.' });
  });

  /* =====================================================================
     3) ACHAR CORTES (fase 1 da skill corte-viral: só texto)
     ===================================================================== */
  const CORTE_REGRAS = `═══ ACHAR CORTES: REGRAS DA SELEÇÃO (fase MOMENTOS) ═══
Trabalhe só sobre o texto da transcrição. Pra cada candidato, três respostas antes de virar corte: o HOOK (a frase que prende sem contexto, nos primeiros segundos do corte), o DESENVOLVIMENTO (mecanismo, prova ou virada) e o PAYOFF (o que fecha a promessa). Sem as três, não é corte.
Invioláveis: nunca invente palavras que não existem na fonte (cite literal); nunca monte trecho que altere causalidade, intenção ou cronologia; nunca entregue cortes semanticamente duplicados pra aumentar a quantidade; nunca declare "viral garantido" (é estimativa de publicabilidade; o teste real é postar).
O corte funciona fora de contexto: quem nunca viu o vídeo inteiro entende e ganha algo. Prefira trechos com opinião forte, número, história com virada, erro caro, pergunta e resposta. Duração alvo de 20 a 60 s por corte (pela contagem de palavras, ~4 por segundo, quando não houver tempo).
Sem marcação de tempo na transcrição, os tempos são aproximados: diga isso e use a citação da primeira e da última frase como âncora pro corte.`;
  X.tool({
    id: 'cortes', nome: 'Achar cortes', icone: 'scroll', ordem: 65,
    resumo: 'Acha os trechos de um vídeo longo que viram Reels sozinhos: hook, desenvolvimento e payoff.',
    init: () => ({ texto: '', qtd: '5', tipo: 'podcast', origem: '', salvoId: null }),
    render(S) {
      const p = 'kit.tools.cortes';
      const entrada = `<section class="card kit-in">
        <h2>Achar cortes</h2>
        <p class="lead">Cole a transcrição de uma live, podcast, aula ou entrevista. A IA acha os trechos que funcionam fora de contexto, com hook, desenvolvimento e payoff, e diz onde cortar.</p>
        ${origemTag(S)}
        <div class="field"><span>Tipo de vídeo</span>${X.h.seg(p + '.tipo', [['podcast', 'Podcast'], ['live', 'Live'], ['aula', 'Aula'], ['entrevista', 'Entrevista']])}</div>
        ${X.h.campo({ path: p + '.texto', label: 'Transcrição (de preferência com tempo)', tipo: 'textarea', rows: 10, placeholder: '[00:12:31] Fulano: ...\nCom tempo, os cortes saem com início e fim exatos. Sem tempo, saem com a primeira e a última frase.' })}
        <div class="field"><span>Quantos cortes</span>${X.h.seg(p + '.qtd', [['3', '3'], ['5', '5'], ['8', '8']])}</div>
        <button type="button" class="btn primary" data-a="x-ks-cortes" ${desab()}>${ic('spark', 'sm')} Achar cortes</button>
        <p class="kit-hint">O app não corta o vídeo: ele diz o trecho. O corte, o enquadramento 9:16 e a legenda você faz no editor (ou com a skill corte-viral no Claude).</p>
        ${salvosHTML('cortes', 'x-ks-cortes-abrir')}
      </section>`;
      let saida;
      if (S.busy) saida = X.h.ocupado('Lendo a transcrição e escolhendo os trechos.') + parar('cortes');
      else if (!S.res) saida = X.h.erro(S.err) + X.h.vazio('Os cortes aparecem aqui.', 'Cada um com início e fim, título, o hook literal, o desenvolvimento, o payoff, uma nota de força, o texto da tela e os botões pra virar legenda ou ir pro Estúdio.');
      else saida = X.h.erro(S.err) + cortesOut(S.res);
      return `<div class="kit">${entrada}<section class="kit-out">${saida}</section></div>`;
    }
  });
  function parseCortes(r) {
    if (!r || typeof r !== 'object') return null;
    const ms = X.arr(r.momentos, 10, x => x && typeof x === 'object' ? { inicio: X.str(x.inicio, 20), fim: X.str(x.fim, 20), titulo: X.str(x.titulo, 120), hook: X.str(x.hook, 500), desenvolvimento: X.str(x.desenvolvimento, 500), payoff: X.str(x.payoff, 500), porque: X.str(x.porque, 300), tela: X.str(x.tela, 80), nota: X.num(x.nota, 0, 10) } : null).filter(x => x && x.hook);
    if (!ms.length) return null;
    return { momentos: ms, aproximado: !!r.aproximado, avisos: X.arr(r.avisos, 6) };
  }
  function cortesOut(r) {
    return `${r.aproximado ? `<div class="errnote warn">${ic('alert', 'sm')}<span>A transcrição veio sem tempo: os cortes usam a primeira e a última frase como âncora.</span></div>` : ''}
      <div class="ideas">${r.momentos.map((m, i) => `<div class="idea ${i === 0 ? 'idea-best' : ''}"><div class="top"><span class="tag mono">${esc([m.inicio, m.fim].filter(Boolean).join(' → ') || 'corte ' + (i + 1))}</span>${m.nota != null ? `<span class="tag ${m.nota >= 8 ? 'good' : 'amber'} mono">força ${m.nota}/10</span>` : ''}${m.tela ? `<span class="tag">${esc(m.tela)}</span>` : ''}</div>
        <h4>${esc(m.titulo)}</h4>
        <p style="margin:0 0 4px"><b>Hook:</b> “${esc(m.hook)}”</p>${m.desenvolvimento ? `<p style="margin:0 0 4px"><b>Desenvolvimento:</b> ${esc(m.desenvolvimento)}</p>` : ''}${m.payoff ? `<p style="margin:0 0 4px"><b>Payoff:</b> ${esc(m.payoff)}</p>` : ''}${m.porque ? `<p class="kit-hint">${esc(m.porque)}</p>` : ''}
        <div class="kit-row" style="margin-top:8px">${X.h.copiar(`${m.titulo}\n${[m.inicio, m.fim].filter(Boolean).join(' → ')}\nHook: ${m.hook}\nPayoff: ${m.payoff}`, 'Copiar')}<button type="button" class="btn xs" data-a="x-ks-corte-leg" data-i="${i}">${ic('legenda', 'sm')} Legenda</button></div></div>`).join('')}</div>
      ${r.avisos.length ? `<div class="card kit-sec"><h3>Antes de cortar</h3>${X.h.lista(r.avisos, 'warnlist')}</div>` : ''}
      <div class="kit-row"><button type="button" class="btn sm" data-a="x-ks-cortes-salvar">${ic('check', 'sm')} Salvar</button></div>`;
  }
  X.action('x-ks-cortes', () => {
    const S = X.toolState('cortes');
    const txt = X.str(S.texto);
    if (txt.length < 200) { S.err = 'Cole a transcrição (pelo menos alguns minutos de fala).'; X.refresh(); return; }
    const n = Number(S.qtd) || 5;
    const prompt = [X.ctxPerfil({ semAprendizados: true, semVerdade: true }), CORTE_REGRAS,
      `═══ TAREFA ═══\nTipo de vídeo: ${S.tipo}. Ache até ${n} cortes, do mais forte pro mais fraco, que façam sentido pro público do perfil. Cite o hook LITERAL da transcrição. "tela" = texto curto pra tarja do corte (até 6 palavras). "nota" = força de 0 a 10 (honesta).\n\nTRANSCRIÇÃO:\n"""\n${corta(txt, 42000)}\n"""`].join('\n\n') + fimJSON(`{"aproximado": false, "momentos": [{"inicio": "00:12:31", "fim": "00:13:15", "titulo": "...", "hook": "frase literal", "desenvolvimento": "...", "payoff": "...", "porque": "por que funciona fora de contexto", "tela": "TARJA CURTA", "nota": 8}], "avisos": ["..."]}`);
    X.rodar(S, prompt, r => { const o = parseCortes(r); if (o) S.salvoId = null; return o; }, { tier: 'default' });
  });
  X.action('x-ks-cortes-salvar', () => { const S = X.toolState('cortes'); if (!S.res) return; salvar(S, { tipo: 'cortes', titulo: S.res.momentos[0].titulo || 'Cortes', form: { tipo: S.tipo, qtd: S.qtd }, res: S.res }, 'Cortes salvos.'); });
  X.action('x-ks-cortes-abrir', abrirSalvo('cortes'));
  X.action('x-ks-corte-leg', el => {
    const r = X.toolState('cortes').res; if (!r) return;
    const m = r.momentos[Number(el.dataset.i)]; if (!m) return;
    X.abrirFerramenta('legenda', { assunto: m.titulo, tipo: 'reel', objetivo: 'compartilhamentos', gancho: m.hook, base: [m.hook, m.desenvolvimento, m.payoff].filter(Boolean).join('\n'), origem: 'Corte: ' + m.titulo });
  });
})();
