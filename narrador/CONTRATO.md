# Contrato das extensões do Instagram (ig-*.js)

App: **Narrador de Impacto** — artifact do claude.ai (HTML + JS puro, sem build, sem libs).
Arquivos: `index.html` (CSS + ordem dos scripts), `data.js` (banco: window.NDI), `engine.js` (prompts e cálculos: window.NDE),
`ig-base.js` (registro + helpers: window.NDX), `ig-saber.js`, `ig-semana.js`, `ig-kit-conteudo.js`, `ig-kit-crescer.js`, `app.js` (UI principal; expõe window.NDA).

Ordem de carga: data.js → engine.js → ig-base.js → ig-saber.js → ig-semana.js → ig-kit-conteudo.js → ig-kit-crescer.js → app.js.
**As extensões rodam ANTES do app.js.** No topo do arquivo só registre coisas (X.view, X.tool, X.action, X.modal, X.hook, X.K...).
Tudo que precisa do app (estado, IA, render, toast) é lido de `window.NDA` NA HORA DO USO (dentro de render/ações), nunca no topo.

Cada arquivo é um IIFE: `(function () { const X = window.NDX; ... })();` — sem `import`, sem módulos, sem dependências externas.
Português do Brasil em toda a interface e nos prompts. Use os componentes e classes CSS que já existem (ver abaixo) antes de criar CSS novo;
se precisar de CSS, use `X.css(\`...\`)` com prefixo de classe próprio do arquivo (`wk-` semana, `kc-` kit-conteudo, `kg-` kit-crescer) e SÓ tokens de cor (`var(--ink)`, `var(--panel)` etc.), nunca cor literal.
Funciona em 400px de largura sem rolagem horizontal; tema claro e escuro via tokens.

## Ponte do app: `window.NDA` (disponível depois que o app.js carrega)
- `st` (getter: estado atual — sempre leia `NDA.st` de novo, ele é trocado em import/zerar): `{ profile, memory, bank, scripts, virais, planos, pecas, meta }`
  - `profile`: nome, apelido, handle, assinatura, promessa, nicho, posicionamento, publico, credencial, proibidos, permitidos, ofertas, ctaModo ('seguir'|'palavra'), ctaPalavra, bordao, seguidores, metaSeguidores, metaData, metaNegocio, tom, gravacao, visual, bio, nomeCampo, regulado (bool), disclaimer, mediaViews
  - `virais[]`: { id, handle, titulo, nicho, link, seguidores, views, curtidas, comentarios, compartilhamentos, salvamentos, duracao, postadoEm, audio, roteiro, textoTela, edicao, legenda, thumb, analise?: { veredito, fatores[], gancho{texto, categoria, formula, pilares[], porque}, entrega{transformacao, levaPronto, porQueSeguir, comoSuperar}, estrutura[{parte,tempo,oque}], edicao[], formato, numeros[], naoTransfere[], modelar[], naoCopiar[], modelagem{gancho,formato,angulo,porque}, alternativas[], licoes[] } }
  - `scripts[]`: roteiros { id, titulo, raw, formatoId, temaId, ganchoId, ganchoTexto, status, metrics, origem, createdAt }
  - `planos[]` (coleção nova): planos semanais. `pecas[]` (coleção nova): peças do Kit ({ id, tipo, titulo, createdAt, ... }).
- `ui` (ui.view, ui.modal, ui.ai: 'on'|'off'|'wait', ui.studio)
- `E` (engine): `E.hoje()`, `E.formato(id)`, `E.tema(id)`, `E.pilar(id)`, `E.objetivo(id)`, `E.agrupar`, `E.rankGanchos`, `E.scoreGeral`,
  `E.dna(profile)`, `E.verdade(profile, st)`, `E.aprendizados(st)`, `E.legendaRegra(profile)`, `E.ctaRegra(profile)`, `E.fmtBloco(formatoId)`,
  `E.VALOR` (texto: as 5 provas do valor que transforma), `E.nucleo(st)` (prompt mestre de roteiro, GRANDE: ~35 KB — não use em ferramentas; use `X.ctxPerfil()`),
  `E.parseNum("12,3 mil")`, `E.fmtK`, `E.fmtN`, `E.norm`.
- `N` (banco): `N.FORMATOS` [{id, nome, dur:[min,max], oque, porque, serve, regra}], `N.PILARES` [{id, nome}], `N.OBJETIVOS` [[id, nome, desc]], `N.TEMAS`, `N.GANCHOS`, `N.CATS`.
- `Store.saveItem('planos'|'pecas', item)`, `Store.delItem(col, id)` — use os helpers `X.salvar` / `X.apagar` em vez disso.
- `sample` (getter: IA do claude.ai ou null) — use `X.ia` / `X.rodar`, nunca direto.
- Helpers: `esc`, `ic(nome, 'sm')`, `toast(msg, 'good'|'warn'|'bad')`, `copy(texto, rotulo)`, `render()`, `renderModal()`, `closeModal()`, `go(view)`, `sheetHead(titulo, extraHTML)`, `newId(prefixo)`, `grafemas`, `hl(texto)` (escapa e destaca [CONFERIR]/[PREENCHER]), `fmtName(formatoId)`, `viralById(id)`, `scriptById(id)`, `vThumb(v)`.
- Ações existentes úteis: `data-a="copiar-txt" data-txt="..."` (copia), `data-a="nav" data-v="estudio"` (navega), `data-a="fechar"` (fecha modal), `data-a="modelar" data-i="-1"` (no modal do viral: modela no Estúdio).

## Registro: `window.NDX` (= X), definido em ig-base.js — LEIA ig-base.js
- `X.view(id, { nome, after, render() -> html, count?() , mount?(mainEl) })` — tela nova na navegação (já existe 'kit').
- `X.tool({ id, nome, icone, resumo, ordem, init?() -> estado inicial, render(S) -> html })` — ferramenta na tela Kit. `S` é o estado da ferramenta (`X.toolState(id)`), com `S.busy`, `S.err`, `S.res`, `S.ctl` controlados por `X.rodar`.
- `X.action('x-nome', (el, e) => {})` — SEMPRE prefixo `x-` + prefixo do arquivo (ex.: `x-wk-gerar`, `x-kc-car-gerar`, `x-kg-gancho-gerar`). Clique em `[data-a="x-..."]` chama a função.
- `X.modal('tipo', fn(M) -> html, { wide })` — modal; abra com `NDA.ui.modal = { type: 'tipo', ... }; NDA.renderModal()`. O html começa com `NDA.sheetHead(...)` e o corpo vai em `<div class="sheet-b">`.
- `X.hook('viraisToolbar', () => html)` — botões na barra da tela Virais. `X.hook('viralExtra', (v, M) => html)` — bloco no fim do modal de um viral.
- Campos: `data-bind="x.caminho"` grava em `X.state` (ex.: `x.kit.tools.carrossel.tema` grava em `X.state.kit.tools.carrossel.tema`; o estado de uma ferramenta do Kit fica em `X.state.kit.tools[id]`, que é o MESMO objeto `S`). Use `X.h.campo({ path, label, tipo:'text'|'textarea'|'select'|'num'|'date'|'check', opcoes, placeholder, help, rows })`.
  Digitar NÃO re-renderiza (bom: não perde o foco). Pra atualizar algo ao vivo (contador), use `X.watch((path, val, el) => {...})` e mexa só no elemento.
- `X.h.seg(path, opcoes)` (escolha única, re-renderiza), `X.h.multi(path, opcoes)` (multi, array), `X.h.copiar(texto, rotulo)`, `X.h.ocupado(msg, 'x-parar-action')`, `X.h.erro(msg)`, `X.h.vazio(titulo, texto)`, `X.h.lista(arr)`, `X.h.semIA()`, `X.h.contagem(texto)`, `X.h.dobra(legenda)` (mostra a dobra dos 125 caracteres).
- IA: `await X.rodar(S, prompt, parse, { tier: 'default'|'complex'|'quick' })` — liga S.busy, chama a IA (JSON), roda `parse(resposta)` (retorne null se inválido → erro amigável), grava `S.res`, re-renderiza. Pare com `X.parar(S)` (ação pronta: `data-a="x-parar" data-t="<id da ferramenta>"`). Para fora do Kit, use `X.ia(prompt, opts)` direto (rejeita `{ msg, code }`; `code === 'cancelled'` = parado pelo usuário, não mostre erro).
  O prompt é UMA string (máx. ~60 KB). Sempre peça "Responda só com JSON" + o formato exato com exemplo. A IA NÃO tem internet: nunca prometa dado em tempo real; número que precise de fonte sai marcado [CONFERIR].
- Contexto: `X.ctxPerfil({ semAprendizados?, semVerdade?, semGravacao? })` — bloco padrão (DNA, tom, VALOR, verdade, aprendizados, gravação). Comece todo prompt com ele. `X.desempenho()` — resumo dos números reais (formatos/ganchos com melhor score, virais analisados, roteiros recentes, lições). `X.formatosLista()`, `X.pilaresLista()`.
- Normalizar JSON: `X.str(x, max)`, `X.arr(x, n, map)`, `X.num(x, lo, hi)`.
- Salvar: `X.salvar('pecas'|'planos', item)` (gera id/createdAt, grava no estado e na nuvem), `X.apagar(col, id)`, `X.pecas(tipo)`. Ação pronta: `data-a="x-del-peca" data-id`.
  Itens salvos são JSON puro (sem funções, sem Blob), pequenos (< 50 KB).
- Navegação entre ferramentas: `X.abrirFerramenta('carrossel', { ...preset do estado })` abre a ferramenta do Kit já preenchida.
  `X.paraEstudio({ assunto, gancho, formatoId, objetivo, proximo, obs, why, modelo })` leva uma ideia pro Estúdio (roteiro de Reel completo, com o contrato de valor).
- `X.auditar(texto)` → `{ chars, hashtags, emojis, travessoes, palavras, itens:[{nivel:'good'|'warn'|'bad', txt, dica}], nota }` (auditoria local sem IA).
- `X.refresh()` re-renderiza a tela/modal das extensões. `X.onReset.push(fn)` limpa estado próprio quando o usuário zera tudo.

## Conhecimento: `X.K` (escrito por ig-saber.js; os outros arquivos LEEM — use `(X.K.algo || '')` defensivo)
- `X.K.formulas`: array de 10 `{ id, nome, superficie: 'legenda'|'carrossel'|'reel'|'qualquer', objetivos: ['salvamentos'|'compartilhamentos'|'comentarios'|'seguidores'], molde, exemplo, porque, cuidado }`
  ids FIXOS: `numero`, `contraria`, `cena`, `confissao`, `lista`, `antesdepois`, `mito`, `framework`, `quebra`, `comoeu`.
- `X.K.formula(id)` → item ou null. `X.K.blocoFormulas(superficie?)` → texto pronto pra prompt.
- `X.K.objetivos`: `{ salvamentos, compartilhamentos, comentarios, seguidores }` → `{ nome, comoGanha, formulas: [ids] }`.
- Blocos de texto pra prompt (strings em PT-BR, cada uma com título ═══ ... ═══): `X.K.sinais` (o que o Instagram mede em 2026 e o que derruba alcance), `X.K.legenda` (regras de legenda: 125 caracteres, corpo escaneável, 1 CTA, 3–5 hashtags, emojis), `X.K.carrossel` (arquitetura de slides), `X.K.hashtags` (tamanhos nicho/médio/amplo e mix), `X.K.plano` (pilares de conteúdo, mix semanal, cadência, horários pro público brasileiro), `X.K.perfil` (auditoria de perfil), `X.K.reaproveitar` (adaptar LinkedIn/blog/YouTube/X pro Instagram), `X.K.humanizarRegras` (o que tira a cara de IA de um texto em português).
- `X.K.humanizar.vicios`: array extra de `{ nome, re: RegExp, dica }` (vícios de IA em português) que `X.auditar` usa.

## Regras do produto (valem pra todas as ferramentas)
1. Verdade: nada de número, história, depoimento ou resultado inventado. Onde faltar, `[PREENCHER: o quê]`; fato técnico fora dos fatos conferidos → `[CONFERIR: o quê]`.
2. Valor que transforma (E.VALOR): toda peça tem antes → depois, algo aplicável hoje, ganho concreto, é digna de mandar pra alguém e dá motivo pra seguir.
3. Um CTA por peça, sem isca de engajamento ("comenta SIM", "marca 3 amigos"). Máximo 5 hashtags. 0 a 3 emojis com intenção. Travessão no máximo 1 a cada 100 palavras.
4. A legenda segue a estrutura do perfil (`E.legendaRegra(profile)`: assinatura na 1ª linha etc.) E o gancho tem que caber nos primeiros 125 caracteres junto com a assinatura.
5. Conteúdo regulado (`profile.regulado`): disclaimer do perfil na legenda; passo sugerido é pergunta/verificação, nunca decisão técnica.
6. Copy de interface: verbo que diz o que acontece ("Gerar carrossel", "Levar pro Estúdio"), erros que dizem como resolver. Sem emoji como marcador de seção.

## Classes CSS que já existem (index.html) — reuse
Layout de tela: `.vh` (cabeçalho: `<div class="vh"><div><div class="eyebrow">..</div><h1>Texto <em>destaque</em></h1><p>..</p></div><div class="toolbar">..</div></div>`), `.kit` (2 colunas: `.kit-in` card de entrada sticky + `.kit-out` saída), `.kit-sec`, `.kit-row`, `.kit-pre`, `.kit-hint`, `.kit-empty`, `.kit-audit .it`, `.kit-score`, `.kit-hist`.
Átomos: `.btn` (+ `.primary .ghost .sm .xs .danger .icon-btn`), `.chip` (+ `.on`), `.tag` (+ `.good .warn .bad .amber .mono`), `.seg`, `.field`, `.check`, `.card`, `.eyebrow`, `.muted`, `.faint`, `.mono`, `.disp`, `.empty`, `.toolbar`, `.rail`, `.rates`.
Blocos: `.blk` + `.blk-h h3`, `.list` (+ `.corr .warnlist`), `.analysis` + `h5`, `.decision b`, `.nextcard`, `.ideas .idea .idea-best`, `.modelcard`, `q.mq`, `.rec .rec-row .num`, `.story`, `.storycards`, `.valor .vrow .k` (+ `.seg` destaque), `.errnote`, `.thinking .scan .tip`, `.legenda` (pre), `.fixbox`.
Cores: `--bg --bg2 --panel --panel2 --raise --line --line2 --ink --ink2 --ink3 --amber --amber-text --amber-soft --amber-line --good --good-soft --warn --warn-soft --bad --bad-soft`; pilares: `--p-direito --p-empreendedorismo --p-vendas --p-crescimento`.
Fontes: `--f-disp` (títulos caixa-alta condensados), `--f-body`, `--f-mono`.

## Campos de estado das ferramentas (presets de `X.abrirFerramenta(id, preset)`) — NOMES FIXOS
Quem abre uma ferramenta de outro arquivo só usa estes campos. Objetivos válidos: `'salvamentos' | 'compartilhamentos' | 'comentarios' | 'seguidores'`.
- `carrossel` (ig-kit-conteudo.js): `tema` (assunto/ideia), `objetivo`, `formula` (`'auto'|'lista'|'antesdepois'|'mito'|'framework'`), `slides` (número 5–10), `gancho` (ideia de gancho, opcional), `base` (texto de referência pra recriar: viral, roteiro, post de outra rede; opcional), `origem` (rótulo curto de onde veio, opcional, ex.: "Viral @perfil", "Plano da semana · terça").
- `legenda` (ig-kit-conteudo.js): `assunto`, `tipo` (`'reel'|'imagem'|'carrossel'`), `objetivo`, `gancho` (opcional), `base` (roteiro/texto do post, opcional), `origem`.
- `hashtags` (ig-kit-conteudo.js): `assunto`, `base` (legenda/roteiro opcional), `origem`.
- `humanizar` (ig-kit-conteudo.js): `texto`, `tipo` (`'legenda'|'slide'|'roteiro'|'bio'`), `origem`.
- `gancho` (ig-kit-crescer.js): `texto` (legenda/transcrição/primeira linha do viral colada), `viralId` (id de `st.virais`, opcional), `superficie` (`'reel'|'carrossel'|'legenda'`), `origem`.
- `reaproveitar` (ig-kit-crescer.js): `texto`, `origem` (`'linkedin'|'blog'|'youtube'|'x'|'outro'`), `destino` (`'carrossel'|'legenda'|'reel'`).
- `perfil` (ig-kit-crescer.js): sem preset obrigatório (lê `st.profile`); campos próprios livres.
Ordem das abas no Kit (`ordem`): gancho 10 · carrossel 20 · legenda 30 · hashtags 40 · humanizar 50 · reaproveitar 60 · perfil 70.
Tela Semana (ig-semana.js): `X.view('semana', { nome: 'Semana', after: 'estudio', ... })`; estado em `X.state.semana`.
