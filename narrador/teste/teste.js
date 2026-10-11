/* Teste de integração do Narrador de Impacto no Chromium (Playwright para Node).
   Rodar: node /home/user/VERTICE/narrador/teste/teste.js
   Simula o runtime do claude.ai (window.claude.use) com IA controlada pelo teste:
   window.__respostas é a fila de respostas; window.__prompts registra cada prompt recebido. */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const DIR = path.resolve(__dirname, '..');
const URL = 'file://' + path.join(DIR, 'index.html');
const SHOTS = path.join(__dirname, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });
const SO = process.argv.includes('--rapido'); // só desktop claro

const res = { passou: [], falhou: [] };
let grupo = '';
const ok = (cond, msg) => { (cond ? res.passou : res.falhou).push(`[${grupo}] ${msg}`); if (!cond) console.log('  FALHOU:', `[${grupo}]`, msg); };

/* ---------- runtime simulado ---------- */
const INIT = () => {
  const semIA = /[?&]semia=1/.test(location.search);
  window.__respostas = [];
  window.__prompts = [];
  window.__clip = [];
  const prox = (input, opts) => {
    window.__prompts.push({ input: String(input), bytes: new TextEncoder().encode(String(input)).length, tier: opts && opts.modelTier });
    return window.__respostas.shift();
  };
  const espera = (r, opts) => new Promise((ok, no) => {
    if (!r || !r.delay) return ok();
    const t = setTimeout(ok, r.delay);
    if (opts && opts.signal) opts.signal.addEventListener('abort', () => { clearTimeout(t); no({ code: 'cancelled' }); });
  });
  const sample = async (input, opts) => {
    const r = prox(input, opts);
    if (!r) throw { code: 'empty_completion' };
    await espera(r, opts);
    if (r.erro) throw { code: r.erro };
    const text = r.text != null ? r.text : JSON.stringify(r.json);
    if (opts && opts.onText) opts.onText({ text });
    return { text, truncated: false };
  };
  sample.json = async (input, opts) => {
    const r = prox(input, opts);
    if (!r) throw { code: 'invalid_json' };
    await espera(r, opts);
    if (r.erro) throw { code: r.erro };
    return r.json;
  };
  sample.limits = async () => ({ maxPromptBytes: 65536 });
  window.claude = { use: async name => (name === 'sample' ? (semIA ? null : sample) : null) };
  try {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async t => { window.__clip.push(String(t)); } } });
  } catch (e) { }
};

/* ---------- respostas simuladas ---------- */
const VALOR = { antesDepois: 'mistura conta pessoal e da empresa → separa em 2 contas e sabe o pró-labore', levaPronto: 'checklist de 3 itens pra separar hoje', ganho: 'evita pagar imposto sobre dinheiro que não é lucro', mandariaPra: 'o sócio', porQueSeguir: 'amanhã sai o modelo de planilha' };
const PLANO = () => ({
  serie: 'Caixa em ordem', fio: 'Organizar o caixa da empresa em uma semana', porQueSeguir: 'No domingo a pessoa tem o caixa separado e o pró-labore definido.',
  meta: 'Esta semana vira a base: [PREENCHER: soma de salvamentos + envios da semana passada].',
  dias: [
    { dia: 'segunda', tipo: 'reel', pilar: 'empreendedorismo', papel: 'educativo', objetivo: 'salvamentos', formula: 'lista', formato: 'lista', horario: '12:30', titulo: 'Conta PJ separada', gancho: 'Três sinais de que o seu caixa está misturado', angulo: 'Os sinais que mostram mistura de contas.', entrega: 'Checklist de 3 sinais', antesDepois: 'acha que está tudo certo → vê onde mistura', ganho: 'menos imposto sobre dinheiro que não é lucro', mandariaPara: 'o sócio', cta: 'Salva pra conferir hoje', ponte: 'Amanhã: o mito do pró-labore', stories: 'Enquete: você tem conta PJ?', viralId: '' },
    { dia: 'terça', tipo: 'carrossel', pilar: 'empreendedorismo', papel: 'historia', objetivo: 'compartilhamentos', formula: 'mito', formato: '', horario: '18:00', titulo: 'Mito do pró-labore', gancho: 'Pró-labore não é o que sobra no fim do mês', angulo: 'Desfaz o mito.', entrega: 'A regra de cálculo', antesDepois: 'tira o que sobra → define valor fixo', ganho: 'previsibilidade', mandariaPara: 'o contador', cta: 'Manda pro seu contador', ponte: 'Quarta: a planilha', stories: 'Caixinha de dúvidas', viralId: '' },
    { dia: 'quarta', tipo: 'reel', pilar: 'vendas', papel: 'conexao', objetivo: 'comentarios', formula: 'cena', formato: 'lista', horario: '12:30', titulo: 'Planilha de caixa', gancho: 'Você abre o banco e não sabe quanto é seu', angulo: 'A cena de todo dono.', entrega: 'Modelo de planilha', antesDepois: 'confusão → clareza', ganho: '2 horas por mês', mandariaPara: 'quem abriu MEI', cta: 'Comenta qual coluna falta', ponte: 'Quinta: as categorias', stories: 'Bastidor', viralId: '' },
    { dia: 'quinta', tipo: 'carrossel', pilar: 'empreendedorismo', papel: 'educativo', objetivo: 'salvamentos', formula: 'framework', formato: '', horario: '12:00', titulo: 'Categorias de gasto', gancho: 'O método das 4 caixas pro seu dinheiro', angulo: 'Método com nome.', entrega: 'As 4 categorias', antesDepois: 'gasto solto → gasto classificado', ganho: 'enxerga onde corta', mandariaPara: 'a sócia', cta: 'Salva pra montar no fim de semana', ponte: 'Sexta: o fechamento', stories: 'Quiz', viralId: '' },
    { dia: 'sexta', tipo: 'reel', pilar: 'crescimento', papel: 'oferta', objetivo: 'seguidores', formula: 'comoeu', formato: 'lista', horario: '19:00', titulo: 'Fechamento do mês', gancho: 'Como eu fecho o mês em 40 minutos [PREENCHER: tempo real]', angulo: 'Passo a passo.', entrega: 'Roteiro de fechamento', antesDepois: 'fecha no susto → fecha com rotina', ganho: 'tempo', mandariaPara: 'o sócio', cta: 'Segue pra próxima semana', ponte: 'Próxima semana: impostos', stories: 'Caixinha', viralId: '' }
  ],
  storiesSemana: 'Um story por dia com enquete ou caixinha.', equilibrio: 'Mix ok.', avisos: ['Confira o horário nos Insights.']
});
const POST_NOVO = { dia: 'quarta', tipo: 'reel', pilar: 'vendas', papel: 'conexao', objetivo: 'comentarios', formula: 'confissao', formato: 'lista', horario: '13:00', titulo: 'POST REFEITO quarta', gancho: 'Em 2024 eu perdi um mês de caixa por não anotar', angulo: 'Confissão.', entrega: 'A regra', antesDepois: 'a → b', ganho: 'tempo', mandariaPara: 'o sócio', cta: 'Comenta', ponte: 'Quinta', stories: 'Bastidor', viralId: '' };
const CARROSSEL = sig => ({
  formula: 'lista', objetivo: 'salvamentos', porque: 'Lista deixa cada erro num slide.', valor: VALOR,
  slides: [
    { n: 1, papel: 'gancho', titulo: '5 erros que misturam o seu caixa', texto: 'O terceiro quase todo MEI comete.', visual: 'Foto sua com o extrato' },
    { n: 2, papel: 'valor', titulo: 'Pagar conta pessoal no PJ', texto: 'Vira retirada sem registro.', visual: 'Print de extrato' },
    { n: 3, papel: 'valor', titulo: 'Sem pró-labore fixo', texto: 'Você não sabe o que é lucro.', visual: 'Número' },
    { n: 4, papel: 'valor', titulo: 'Sem categoria de gasto', texto: 'Não enxerga onde cortar.', visual: 'Planilha' },
    { n: 5, papel: 'cta', titulo: 'Resumo pra salvar', texto: 'Conta separada, pró-labore fixo, categorias. Salva pra usar no fechamento do mês.', visual: 'Card final' }
  ],
  legenda: `${sig}\n\nO erro que mais mistura o caixa do MEI está no slide 3.\n\nSeparar as contas é o primeiro passo. Salva pra usar no fechamento do mês.\n\n#caixapj #meiorganizado #proladore`,
  hashtags: ['#caixapj', '#meiorganizado', '#proladore'], conferir: ['[CONFERIR] regra do pró-labore']
});
const LEGENDA = sig => ({ legenda: `${sig}\n\nVocê paga imposto sobre dinheiro que nem é lucro.\n\nSepare as contas hoje: abra a conta PJ e defina um pró-labore fixo.\n\nQual parte do seu caixa ainda está misturada?\n\n#caixapj #mei #proladore`, formula: 'numero', valor: VALOR, primeiras: ['Três sinais de caixa misturado', 'O pró-labore não é o que sobra', 'Abra o banco: quanto é seu?'], cta: 'Pergunta aberta', hashtags: ['#caixapj', '#mei', '#proladore'], porque: 'Número na frente.', conferir: [] });
const HASHTAGS = { conjunto: [{ tag: '#caixapj', faixa: 'nicho', sinal: 'assunto + público', porque: 'descreve o post' }, { tag: '#meiorganizado', faixa: 'nicho', sinal: 'específica', porque: 'público' }, { tag: '#financasmei', faixa: 'medio', sinal: 'média', porque: 'tema' }], reserva: [{ tag: '#prolabore', faixa: 'nicho', sinal: 's', porque: 'p' }], evitar: [{ tag: '#follow4follow', porque: 'isca' }], comoConferir: 'Busque a tag no Instagram.' };
const HUMANIZAR = { texto: 'Separe as contas hoje. É o passo que evita imposto sobre dinheiro que não é lucro.', mudancas: [{ antes: 'É crucial potencializar', depois: 'Separe', porque: 'palavra de IA' }], pedir: ['um número real seu'], leitura: 'soa IA' };
const GANCHO = { gancho: 'Ninguém te conta isso sobre o MEI', formula: 'contraria', formula2: 'cena', confianca: 'alta', objetivo: 'compartilhamentos', porque: 'Contraria o senso comum.', mecanismo: 'curiosidade', estrutura: [{ parte: 'gancho', oque: 'afirmação seca' }, { parte: 'virada', oque: 'o porquê' }, { parte: 'fechamento', oque: 'manda pra alguém' }], fechamento: 'pedido de envio', molde: 'Todo mundo diz {conselho}. Eu faço {o contrário}.', entrega: { transformacao: 'acha que MEI não precisa de conta PJ → separa', comoSuperar: 'dar o checklist pronto', porQueSeguir: 'próximo: pró-labore' }, recriados: [{ texto: 'Conta PJ não é luxo de empresa grande', superficie: 'reel', formula: 'contraria', objetivo: 'compartilhamentos', angulo: 'Por que o MEI precisa de conta PJ', depois: 'abre a conta', levaPronto: 'checklist', porque: 'forte' }, { texto: '3 sinais de caixa misturado', superficie: 'reel', formula: 'lista', objetivo: 'salvamentos', angulo: 'sinais', depois: 'confere', levaPronto: 'lista', porque: 'p' }, { texto: 'Abri o banco e não sabia quanto era meu', superficie: 'reel', formula: 'cena', objetivo: 'comentarios', angulo: 'cena', depois: 'separa', levaPronto: 'regra', porque: 'p' }], cuidado: 'Não copie a frase.' };
const REAP = { ideiaCentral: 'MEI precisa separar o caixa pra saber o lucro', transformacao: 'mistura → separa', objetivo: 'salvamentos', ganchos: [{ texto: 'O lucro do seu MEI está escondido no extrato', formula: 'contraria' }, { texto: '3 passos pra separar o caixa', formula: 'lista' }, { texto: 'Abri o extrato e levei um susto', formula: 'cena' }], pontos: ['Abra a conta PJ', 'Defina pró-labore', 'Categorize os gastos'], levaPronto: ['checklist de 3 passos'], proximo: 'pró-labore', midia: 'slides', remover: ['"link nos comentários": não clica no Instagram'], destino: 'carrossel', porqueDestino: 'Lista vira carrossel.', formatoReel: '' };
const PERFIL = { nota: 72, resumo: 'Topo claro, bio genérica.', porQueSeguir: 'Caixa do MEI em ordem sem contador caro.', itens: [{ area: 'bio', nota: 5, diagnostico: 'Começa pelo cargo.', antes: 'Advogado', depois: 'Ajudo seu MEI a sair do caixa misturado' }, { area: 'nome', nota: 8, diagnostico: 'Ok', antes: 'Ana', depois: '' }], nome: 'Ana | Caixa do MEI', bios: [{ texto: 'Caixa do MEI em ordem, sem susto no imposto. Um passo por dia.', porque: 'ganho primeiro' }], destaques: [{ nome: 'Comece aqui', conteudo: 'o básico' }], fixados: [{ post: 'O post de lista', porque: 'mais salvo' }], prioridades: ['Trocar a bio', 'Campo Nome', 'Fixar o post de lista'] };
const ANALISE = { veredito: 'Viralizou porque contraria o conselho comum e dá a regra pronta.', fatores: [{ area: 'gancho', peso: 5, porque: 'Afirmação seca', evidencia: 'primeira frase' }, { area: 'roteiro', peso: 3, porque: 'Lista curta', evidencia: '3 itens' }], gancho: { texto: 'Pare de guardar dinheiro na poupança', categoria: 3, formula: 'contraria', pilares: ['surpresa'], porque: 'contraria' }, entrega: { transformacao: 'guarda na poupança → sabe onde render mais', levaPronto: 'a regra dos 3 lugares', porQueSeguir: 'próximo vídeo compara', comoSuperar: 'dar a conta pronta pro MEI' }, estrutura: [{ parte: 'Gancho', tempo: '0–3 s', oque: 'afirmação' }], edicao: ['corte a cada 2 s'], formato: 'lista', numeros: ['views 20× os seguidores'], naoTransfere: ['fama do perfil'], modelar: ['estrutura em lista'], naoCopiar: ['a frase do gancho'], modelagem: { gancho: 'Pare de pagar conta pessoal no PJ', formato: 'lista', angulo: 'Os 3 erros de caixa', porque: 'mesma função' }, alternativas: [], licoes: ['Gancho contrário com regra pronta'] };

/* ---------- utilidades ---------- */
async function novaPagina(browser, { vp, tema, semIA }) {
  const ctx = await browser.newContext({ viewport: vp, colorScheme: tema });
  await ctx.addInitScript(INIT);
  const page = await ctx.newPage();
  page.setDefaultTimeout(8000);
  page.__erros = [];
  page.on('console', m => { if (m.type() === 'error') { const t = m.text(); if (!/fonts\.(googleapis|gstatic)|net::ERR_|Failed to load resource/i.test(t)) page.__erros.push(t); } });
  page.on('pageerror', e => page.__erros.push('pageerror: ' + e.message));
  await page.emulateMedia({ colorScheme: tema });
  await page.goto(URL + (semIA ? '?semia=1' : ''), { waitUntil: 'load' });
  await page.waitForFunction(s => window.NDA && window.NDA.ui.ai === (s ? 'off' : 'on'), !!semIA);
  return { ctx, page };
}
const vis = (page, sel) => page.locator(sel).locator('visible=true').first();
const clicar = async (page, sel) => { await vis(page, sel).click(); };
const nav = async (page, v) => { await clicar(page, `[data-a="nav"][data-v="${v}"]`); await page.waitForFunction(x => window.NDA.ui.view === x, v); };
const fila = (page, arr) => page.evaluate(a => { window.__respostas.push(...a); }, arr);
const preencher = async (page, id, val) => { await vis(page, '#' + id).fill(val); };
const semRolagemX = page => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
const largura = page => page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
const st = (page, fn, arg) => page.evaluate(fn, arg);
const texto = async (page, sel) => (await page.locator(sel).first().textContent()).trim();
const shot = async (page, nome) => { const f = path.join(SHOTS, nome + '.png'); await page.screenshot({ path: f, fullPage: false }); return f; };
const tela = async (page, nome, combo) => {
  const f = path.join(SHOTS, `${combo}-${nome}.png`);
  await page.waitForTimeout(150);
  await page.screenshot({ path: f, fullPage: true });
  shots.push(f);
};
const shots = [];
const kitAba = async (page, id) => { await clicar(page, `[data-a="x-kit-tab"][data-t="${id}"]`); await page.waitForFunction(i => window.NDX.state.kit.ativo === i, id); };
const errnote = async page => (await page.locator('#main .errnote:not(.warn)').locator('visible=true').count());
const sigDo = page => page.evaluate(() => { const p = window.NDA.st.profile; return String(p.assinatura || p.handle || '').trim(); });

/* ---------- suíte principal ---------- */
async function suite(browser, vp, tema) {
  const combo = `${vp.width}-${tema}`;
  const mobile = vp.width < 500;
  const { ctx, page } = await novaPagina(browser, { vp, tema });
  try {
    /* 1) carga, navegação, telas antigas, rolagem */
    grupo = combo + ' carga';
    const navTxt = await page.locator(mobile ? '#tabbar' : '#side nav').innerText();
    ok(/Semana/.test(navTxt) && /Kit IG/.test(navTxt), 'navegação tem Semana e Kit IG');
    ['Estúdio', 'Virais', 'Ganchos', 'Temas', 'Formatos', 'Biblioteca', 'Perfil'].forEach(n => ok(navTxt.includes(n), `navegação tem ${n}`));
    const ordem = await page.evaluate(() => [...document.querySelectorAll('#side nav [data-v]')].map(b => b.dataset.v));
    ok(ordem.indexOf('semana') === ordem.indexOf('estudio') + 1, 'Semana vem logo depois do Estúdio');
    ok(ordem.indexOf('kit') === ordem.indexOf('virais') + 1, 'Kit IG vem logo depois de Virais');
    const iconSem = await page.evaluate(() => (document.querySelector('#side nav [data-v="semana"] svg') || {}).innerHTML || '');
    ok(iconSem.includes('rect'), 'ícone da Semana desenhado (X.icons.semana)');
    for (const v of ['estudio', 'semana', 'virais', 'kit', 'ganchos', 'temas', 'formatos', 'biblioteca', 'perfil']) {
      await nav(page, v);
      const h = await page.locator('#main').textContent();
      ok(h.trim().length > 50, `tela ${v} renderiza`);
      const L = await largura(page);
      ok(L.sw <= L.iw, `tela ${v} sem rolagem horizontal (${L.sw} <= ${L.iw})`);
    }
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    ok(tema === 'dark' ? !/rgb\(2[0-5]\d, 2[0-5]\d/.test(bg) : /rgb\(2[0-5]\d, 2[0-5]\d/.test(bg), `fundo do body segue o tema ${tema} (${bg})`);

    /* 2) Estúdio */
    grupo = combo + ' estudio';
    await nav(page, 'estudio');
    ok(await page.locator('#out-body h3:has-text("Valor que transforma")').count() > 0, 'roteiro de exemplo mostra "Valor que transforma"');
    await tela(page, 'estudio-exemplo', combo);
    const exemplo = await page.evaluate(() => window.NDI.EXEMPLO);
    const roteiro = exemplo.replace('3 REGRAS PRA PAGAR MENOS IMPOSTO', 'TARJA DO TESTE').replace('Pra quem: dono de empresa', 'Pra quem: TESTE dono de empresa');
    await fila(page, [{ text: roteiro }]);
    await preencher(page, 'st-assunto', 'Por que o MEI precisa separar a conta pessoal da conta da empresa');
    if (await page.locator('#st-gancho').count() === 0) await clicar(page, '[data-a="gancho-modo"][data-m="meu"]');
    await preencher(page, 'st-gancho', 'Seu caixa está misturado e você nem percebeu');
    await clicar(page, '[data-a="gerar"]');
    await page.waitForFunction(() => window.NDA.ui.gen.status === 'done' && !window.NDA.ui.gen.exemplo);
    const out = await page.locator('#out-body').innerText();
    ok(/Valor que transforma/i.test(out) && out.includes('TESTE dono de empresa'), 'roteiro gerado mostra o bloco de valor da resposta');
    ok(await page.locator('#out-body .checks, #out-body .fixbox').count() > 0, 'roteiro gerado mostra a checagem');
    const pr = await page.evaluate(() => window.__prompts[window.__prompts.length - 1]);
    ok(pr && pr.input.includes('VALOR QUE TRANSFORMA') && pr.input.includes('@@VALOR'), 'prompt do roteiro tem "VALOR QUE TRANSFORMA" e "@@VALOR"');
    ok(pr && pr.bytes < 60000, `prompt do roteiro < 60000 bytes (${pr && pr.bytes})`);
    await tela(page, 'estudio-gerado', combo);

    /* 3) Semana */
    grupo = combo + ' semana';
    await nav(page, 'semana');
    await tela(page, 'semana-vazia', combo);
    await preencher(page, 'x-semana-form-foco', 'Organizar o caixa da empresa');
    await preencher(page, 'x-semana-form-inicio', '2026-10-14'); // quarta: o plano tem que começar na segunda 12/10
    await fila(page, [{ json: PLANO() }]);
    await clicar(page, '[data-a="x-wk-gerar"]');
    await page.waitForSelector('.wk-card');
    const dias = (await page.locator('.wk-card .dia').allTextContents()).map(x => x.trim());
    ok(dias.length === 5, `5 cards (${dias.length})`);
    ok(dias[0] === 'Seg 12/10' && dias[1] === 'Ter 13/10' && dias[4] === 'Sex 16/10', `datas certas começando na segunda (${dias.join(', ')})`);
    const prS = await page.evaluate(() => window.__prompts[window.__prompts.length - 1]);
    ok(prS.bytes < 60000, `prompt da semana < 60000 bytes (${prS.bytes})`);
    ok(prS.input.includes('segunda-feira 2026-10-12'), 'prompt da semana usa a segunda-feira certa');
    ok(await semRolagemX(page), 'semana com plano sem rolagem horizontal');
    await tela(page, 'semana-plano', combo);
    await clicar(page, '[data-a="x-wk-feito"][data-i="0"]');
    ok((await texto(page, '[data-a="x-wk-feito"][data-i="0"]')).includes('Postado'), 'marcar como postado');
    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction(() => window.NDA && window.NDA.ui.ai === 'on');
    if (await page.evaluate(() => window.NDA.ui.view) !== 'semana') await nav(page, 'semana');
    await page.waitForSelector('.wk-card');
    ok(await page.locator('.wk-card').count() === 5, 'plano salvo volta depois de recarregar');
    ok(await page.locator('.wk-card').first().evaluate(e => e.classList.contains('feito')), '"Postado" continua marcado depois de recarregar');
    // Roteirizar no Estúdio
    const g0 = PLANO().dias[0].gancho;
    await clicar(page, '[data-a="x-wk-estudio"][data-i="0"]');
    await page.waitForFunction(() => window.NDA.ui.view === 'estudio');
    ok(await vis(page, '#st-gancho').inputValue() === g0, 'Roteirizar no Estúdio leva o gancho');
    ok(await page.evaluate(() => window.NDA.ui.studio.objetivo) === 'salvamento', 'objetivo convertido pro id do Estúdio');
    // Montar carrossel
    await nav(page, 'semana');
    await clicar(page, '[data-a="x-wk-carrossel"][data-i="1"]');
    await page.waitForFunction(() => window.NDA.ui.view === 'kit' && window.NDX.state.kit.ativo === 'carrossel');
    ok(await vis(page, '#x-kit-tools-carrossel-tema').inputValue() === 'Mito do pró-labore', 'Montar carrossel abre o Kit com o tema');
    ok((await page.locator('#main').textContent()).includes('Plano da semana · terça'), 'carrossel mostra de onde veio');
    ok(await page.locator('#main [data-a="nav"][data-v="semana"]').count() === 1, 'carrossel vindo do plano tem "Voltar ao plano"');
    // Refazer este post
    await nav(page, 'semana');
    const antes = await page.locator('.wk-card h4').allInnerTexts();
    await fila(page, [{ json: POST_NOVO }]);
    await clicar(page, '[data-a="x-wk-refazer"][data-i="2"]');
    await page.waitForFunction(() => [...document.querySelectorAll('.wk-card h4')].some(h => h.textContent.includes('POST REFEITO')));
    const depois = await page.locator('.wk-card h4').allInnerTexts();
    ok(depois[2] === 'POST REFEITO quarta' && depois.filter((t, i) => i !== 2).join('|') === antes.filter((t, i) => i !== 2).join('|'), 'Refazer troca só um card');
    ok((await page.locator('.wk-card .dia').nth(2).textContent()).trim() === 'Qua 14/10', 'card refeito mantém o dia');
    // apagar plano (dentro do details)
    await clicar(page, 'details.wk-more > summary');
    await clicar(page, '[data-a="x-wk-del"]');
    ok((await texto(page, '[data-a="x-wk-del"]')).includes('Confirmar'), 'apagar pede confirmação na página');
    ok(await page.locator('.wk-card').count() === 5, 'primeiro clique não apaga');
    await clicar(page, '[data-a="x-wk-del"]');
    await page.waitForFunction(() => !document.querySelector('.wk-card'));
    ok(await st(page, () => window.NDA.st.planos.length) === 0, 'plano apagado');
    // gera de novo pra ficar salvo no backup
    await fila(page, [{ json: PLANO() }]);
    await clicar(page, '[data-a="x-wk-gerar"]');
    await page.waitForSelector('.wk-card');

    /* 4) Kit */
    grupo = combo + ' kit';
    const sig = await sigDo(page);
    await nav(page, 'kit');
    // carrossel
    await kitAba(page, 'carrossel');
    await preencher(page, 'x-kit-tools-carrossel-tema', 'Erros que misturam o caixa do MEI');
    await fila(page, [{ json: CARROSSEL(sig) }]);
    await clicar(page, '[data-a="x-kc-car-gerar"]');
    await page.waitForSelector('.kc-slide');
    ok(await page.locator('.kc-slide').count() === 5, 'carrossel mostra 5 slides');
    ok((await page.locator('#main').textContent()).includes('dobra'), 'legenda do carrossel com a dobra');
    let p = await page.evaluate(() => window.__prompts[window.__prompts.length - 1]);
    ok(p.bytes < 60000, `prompt do carrossel < 60000 bytes (${p.bytes})`);
    ok(p.input.includes('Plano da semana · terça') && p.input.includes('Leva pronto'), 'prompt do carrossel leva a base do plano');
    await clicar(page, '[data-a="copiar-txt"]');
    ok(await page.evaluate(() => window.__clip.length) > 0, 'copiar slides');
    await clicar(page, '[data-a="x-kc-car-salvar"]');
    ok(await st(page, () => window.NDA.st.pecas.filter(x => x.tipo === 'carrossel').length) === 1, 'carrossel salvo');
    ok(await semRolagemX(page), 'carrossel sem rolagem horizontal');
    await tela(page, 'kit-carrossel', combo);
    await kitAba(page, 'legenda');
    await kitAba(page, 'carrossel');
    ok(await page.locator('.kc-slide').count() === 5 && await vis(page, '#x-kit-tools-carrossel-tema').inputValue() === 'Erros que misturam o caixa do MEI', 'trocar de aba e voltar mantém o carrossel');
    // carrossel → humanizar
    await clicar(page, '[data-a="x-kc-car-humanizar"]');
    await page.waitForFunction(() => window.NDX.state.kit.ativo === 'humanizar');
    ok((await vis(page, '#x-kit-tools-humanizar-texto').inputValue()).includes('O erro que mais mistura'), 'Humanizar legenda abre o Humanizar com a legenda');
    // carrossel → hashtags → devolver
    await kitAba(page, 'carrossel');
    await clicar(page, '[data-a="x-kc-car-hashtags"]');
    await page.waitForFunction(() => window.NDX.state.kit.ativo === 'hashtags');
    ok((await vis(page, '#x-kit-tools-hashtags-base').inputValue()).includes('#caixapj'), 'Trocar hashtags abre Hashtags com a legenda');
    await fila(page, [{ json: HASHTAGS }]);
    await clicar(page, '[data-a="x-kc-hash-gerar"]');
    await page.waitForSelector('.kc-tag');
    ok(await page.locator('.kc-tag').count() >= 3, 'hashtags mostram o conjunto');
    await clicar(page, '[data-a="x-kc-hash-salvar"]');
    ok(await st(page, () => window.NDA.st.pecas.filter(x => x.tipo === 'hashtags').length) === 1, 'hashtags salvas');
    await clicar(page, '[data-a="x-kc-hash-devolver"]');
    await page.waitForFunction(() => window.NDX.state.kit.ativo === 'carrossel');
    ok(await st(page, () => window.NDX.state.kit.tools.carrossel.res.legenda.includes('#financasmei')), 'Devolver pra legenda troca as hashtags');
    await tela(page, 'kit-hashtags', combo);
    // legenda
    await kitAba(page, 'legenda');
    await preencher(page, 'x-kit-tools-legenda-assunto', 'Separar conta PJ e PF');
    await fila(page, [{ json: LEGENDA(sig) }]);
    await clicar(page, '[data-a="x-kc-leg-gerar"]');
    await page.waitForSelector('[data-a="x-kc-leg-usar"]');
    await clicar(page, '[data-a="x-kc-leg-usar"][data-i="1"]');
    ok(await st(page, () => window.NDX.state.kit.tools.legenda.res.legenda.includes('O pró-labore não é o que sobra')), 'Usar esta troca a primeira linha');
    await clicar(page, '[data-a="x-kc-leg-salvar"]');
    ok(await st(page, () => window.NDA.st.pecas.filter(x => x.tipo === 'legenda').length) === 1, 'legenda salva');
    await tela(page, 'kit-legenda', combo);
    await clicar(page, '[data-a="x-kc-leg-humanizar"]');
    await page.waitForFunction(() => window.NDX.state.kit.ativo === 'humanizar');
    // humanizar com IA
    await fila(page, [{ json: HUMANIZAR }]);
    await clicar(page, '[data-a="x-kc-hum-gerar"]');
    await page.waitForSelector('.kc-mud');
    ok((await page.locator('#main').textContent()).includes('Antes × depois'), 'humanizar mostra antes × depois');
    await clicar(page, '[data-a="x-kc-hum-devolver"]');
    await page.waitForFunction(() => window.NDX.state.kit.ativo === 'legenda');
    ok(await st(page, () => window.NDX.state.kit.tools.legenda.res.legenda.startsWith('Separe as contas hoje')), 'Devolver do Humanizar volta pra Legenda');
    // humanizar sem IA (auditar)
    await kitAba(page, 'humanizar');
    await clicar(page, '[data-a="x-kc-hum-usar"]');
    await preencher(page, 'x-kit-tools-humanizar-texto', 'É crucial potencializar a sua jornada. Comenta SIM! 🚀🚀🚀🚀');
    await clicar(page, '[data-a="x-kc-hum-auditar"]');
    ok(/nota sem ia/i.test(await page.locator('#main').textContent()) && await page.locator('.kit-audit .dot.warn, .kit-audit .dot.bad').count() > 0, 'Auditar sem IA mostra nota e vícios');
    await tela(page, 'kit-humanizar', combo);
    // gancho
    await kitAba(page, 'gancho');
    await preencher(page, 'x-kit-tools-gancho-texto', 'Pare de guardar dinheiro na poupança. Ninguém te conta isso.');
    await fila(page, [{ json: GANCHO }]);
    await clicar(page, '[data-a="x-kg-gancho-gerar"]');
    await page.waitForSelector('.kg-ideas .idea');
    ok(await page.locator('.kg-ideas .idea').count() === 3, 'gancho mostra 3 recriados');
    p = await page.evaluate(() => window.__prompts[window.__prompts.length - 1]);
    ok(p.bytes < 60000, `prompt do gancho < 60000 bytes (${p.bytes})`);
    await clicar(page, '[data-a="x-kg-gancho-salvar"]');
    ok(await st(page, () => window.NDA.st.pecas.filter(x => x.tipo === 'gancho').length) === 1, 'gancho salvo');
    await tela(page, 'kit-gancho', combo);
    await clicar(page, '[data-a="x-kg-g-car"][data-i="1"]');
    await page.waitForFunction(() => window.NDX.state.kit.ativo === 'carrossel');
    ok(await vis(page, '#x-kit-tools-carrossel-gancho').inputValue() === '3 sinais de caixa misturado', 'gancho → Carrossel preenchido');
    ok(await st(page, () => window.NDX.state.kit.tools.carrossel.res === null), 'carrossel aberto pelo gancho começa sem o resultado antigo');
    await kitAba(page, 'gancho');
    await clicar(page, '[data-a="x-kg-g-leg"][data-i="0"]');
    await page.waitForFunction(() => window.NDX.state.kit.ativo === 'legenda');
    ok(await vis(page, '#x-kit-tools-legenda-gancho').inputValue() === 'Conta PJ não é luxo de empresa grande', 'gancho → Legenda preenchida');
    ok(await vis(page, '#x-kit-tools-legenda-base').inputValue() === '', 'gancho → Legenda sem texto colado antigo');
    await kitAba(page, 'gancho');
    await clicar(page, '[data-a="x-kg-g-reel"][data-i="0"]');
    await page.waitForFunction(() => window.NDA.ui.view === 'estudio');
    ok(await vis(page, '#st-gancho').inputValue() === 'Conta PJ não é luxo de empresa grande', 'gancho → Estúdio');
    ok(await page.evaluate(() => window.NDA.ui.studio.objetivo) === 'compartilhamento', 'gancho → Estúdio com objetivo convertido');
    await nav(page, 'kit');
    // reaproveitar
    await kitAba(page, 'reaproveitar');
    await preencher(page, 'x-kit-tools-reaproveitar-texto', 'No LinkedIn eu escrevi: separar o caixa do MEI é o primeiro passo pra saber o lucro. Link nos comentários. 1/7');
    await fila(page, [{ json: REAP }]);
    await clicar(page, '[data-a="x-kg-reap-gerar"]');
    await page.waitForSelector('.kg-g');
    await clicar(page, '[data-a="x-kg-reap-usar"][data-i="1"]');
    ok(await page.locator('.kg-g.on').innerText().then(t => t.includes('3 passos')), 'Usar este escolhe a primeira linha');
    await clicar(page, '[data-a="x-kg-reap-salvar"]');
    ok(await st(page, () => window.NDA.st.pecas.filter(x => x.tipo === 'reaproveitar').length) === 1, 'reaproveitar salvo');
    await tela(page, 'kit-reaproveitar', combo);
    await clicar(page, '[data-a="x-kg-reap-seguir"]');
    await page.waitForFunction(() => window.NDX.state.kit.ativo === 'carrossel');
    ok(await vis(page, '#x-kit-tools-carrossel-tema').inputValue() === REAP.ideiaCentral && await vis(page, '#x-kit-tools-carrossel-gancho').inputValue() === '3 passos pra separar o caixa', 'Reaproveitar → Carrossel preenchido com a linha escolhida');
    // perfil
    await kitAba(page, 'perfil');
    await preencher(page, 'x-kit-tools-perfil-foto', 'rosto de perto');
    await fila(page, [{ json: PERFIL }]);
    await clicar(page, '[data-a="x-kg-perfil-gerar"]');
    await page.waitForSelector('.kg-area');
    const bioAntes = await st(page, () => window.NDA.st.profile.bio);
    await clicar(page, '[data-a="x-kg-perfil-bio"][data-i="0"]');
    ok(await st(page, () => window.NDA.st.profile.bio) === PERFIL.bios[0].texto, 'Usar no Perfil troca a bio');
    await clicar(page, '[data-a="x-kg-perfil-desfazer"][data-c="bio"]');
    ok(await st(page, () => window.NDA.st.profile.bio) === bioAntes, 'Voltar pra bio anterior');
    await clicar(page, '[data-a="x-kg-perfil-salvar"]');
    ok(await st(page, () => window.NDA.st.pecas.filter(x => x.tipo === 'perfil').length) === 1, 'revisão do perfil salva');
    ok(await semRolagemX(page), 'revisão do perfil sem rolagem horizontal');
    await tela(page, 'kit-perfil', combo);
    // carrossel → Estúdio converte o objetivo (plural do CONTRATO → id do Estúdio)
    await kitAba(page, 'carrossel');
    await clicar(page, '[data-a="x-kc-abrir"]');
    await clicar(page, '[data-a="x-kc-car-estudio"]');
    await page.waitForFunction(() => window.NDA.ui.view === 'estudio');
    const objC = await page.evaluate(() => window.NDA.ui.studio.objetivo + ' / ' + window.NDX.state.kit.tools.carrossel.objetivo);
    ok(/^(\w+) \/ \1s$/.test(objC), 'carrossel → Estúdio leva o objetivo convertido pro singular (' + objC + ')');
    await nav(page, 'kit');
    // auditoria: abertura fraca depois da assinatura
    const aud = await page.evaluate(s => window.NDX.auditar(s + '\n\nOi, gente! Neste post eu vou falar de caixa.\n\nCorpo do texto com conteúdo suficiente.').itens.map(i => i.txt).join('|'), sig);
    ok(/Abertura fraca/.test(aud), 'auditoria acha abertura fraca depois da linha da assinatura');
    const aud2 = await page.evaluate(() => window.NDX.auditar('É importante ressaltar que vale ressaltar isso.').itens.map(i => i.txt).join('|'));
    ok(/Palavra de IA|Conectivo/.test(aud2), 'auditoria acha "é importante ressaltar" / "vale ressaltar"');
    // abrir peça salva
    await kitAba(page, 'carrossel');
    await clicar(page, '[data-a="x-kc-abrir"]');
    ok(await page.locator('.kc-slide').count() === 5, 'abrir carrossel salvo mostra o resultado');
    // copiar em todas as abas não quebra
    for (const t of ['gancho', 'carrossel', 'legenda', 'hashtags', 'humanizar', 'reaproveitar', 'perfil']) {
      await kitAba(page, t);
      const n = await page.locator('#main [data-a="copiar-txt"]').locator('visible=true').count();
      if (n) await clicar(page, '#main [data-a="copiar-txt"]');
      const L = await largura(page);
      ok(L.sw <= L.iw, `aba ${t} sem rolagem horizontal (${L.sw} <= ${L.iw})`);
    }
    // Parar durante geração
    await kitAba(page, 'legenda');
    await fila(page, [{ json: LEGENDA(sig), delay: 6000 }]);
    await clicar(page, '[data-a="x-kc-leg-gerar"]');
    await page.waitForSelector('[data-a="x-parar"][data-t="legenda"]');
    await tela(page, 'kit-ocupado', combo);
    await clicar(page, '[data-a="x-parar"][data-t="legenda"]');
    await page.waitForFunction(() => !window.NDX.state.kit.tools.legenda.busy);
    ok(await errnote(page) === 0 && !(await st(page, () => window.NDX.state.kit.tools.legenda.err)), 'Parar volta ao normal sem erro');
    ok(await vis(page, '[data-a="x-kc-leg-gerar"]').isEnabled(), 'botão Gerar legenda volta habilitado');
    for (const [t, acao] of [['gancho', 'x-kg-gancho-gerar'], ['reaproveitar', 'x-kg-reap-gerar'], ['perfil', 'x-kg-perfil-gerar'], ['carrossel', 'x-kc-car-gerar']]) {
      await kitAba(page, t);
      await fila(page, [{ json: {}, delay: 6000 }]);
      await clicar(page, `[data-a="${acao}"]`);
      await page.waitForSelector(`[data-a="x-parar"][data-t="${t}"]`);
      await clicar(page, `[data-a="x-parar"][data-t="${t}"]`);
      await page.waitForFunction(i => !window.NDX.state.kit.tools[i].busy, t);
      ok(!(await st(page, i => window.NDX.state.kit.tools[i].err, t)), `Parar em ${t} sem erro`);
    }
    // Parar na Semana
    await nav(page, 'semana');
    await fila(page, [{ json: POST_NOVO, delay: 6000 }]);
    await clicar(page, '[data-a="x-wk-refazer"][data-i="0"]');
    await page.waitForSelector('[data-a="x-wk-refazer-parar"]');
    await clicar(page, '[data-a="x-wk-refazer-parar"]');
    await page.waitForSelector('[data-a="x-wk-refazer"][data-i="0"]');
    ok(await page.locator('.wk-card .errnote').count() === 0, 'Parar o Refazer sem erro');
    // todos os prompts < 60000
    const tam = await page.evaluate(() => window.__prompts.map(p => p.bytes));
    ok(tam.every(b => b < 60000), `todos os prompts < 60000 bytes (máx ${Math.max(...tam)})`);

    /* 5) Virais */
    grupo = combo + ' virais';
    await nav(page, 'virais');
    await clicar(page, '[data-a="add-viral"]');
    await preencher(page, 'vf-titulo', 'Poupança não');
    await preencher(page, 'vf-handle', '@financas');
    await preencher(page, 'vf-seguidores', '10 mil');
    await preencher(page, 'vf-views', '200 mil');
    await preencher(page, 'vf-roteiro', 'Pare de guardar dinheiro na poupança. Faça isso.');
    const dr = await page.evaluate(() => JSON.stringify(window.NDA.ui.modal && window.NDA.ui.modal.draft && { s: window.NDA.ui.modal.draft.seguidores, v: window.NDA.ui.modal.draft.views, t: window.NDA.ui.modal.draft.titulo }));
    ok(/"s":"10 mil","v":"200 mil"/.test(dr), 'formulário do viral guarda o que foi digitado ' + dr);
    await fila(page, [{ json: ANALISE }]);
    await clicar(page, '[data-a="salvar-viral"][data-analisar="1"]');
    await page.waitForFunction(() => { const v = window.NDA.st.virais[0]; return v && v.analise; }).catch(async e => { console.log('DBG', await page.evaluate(() => JSON.stringify({ fila: window.__respostas.length, modal: window.NDA.ui.modal && { type: window.NDA.ui.modal.type, err: window.NDA.ui.modal.err, busy: window.NDA.ui.modal.busy }, v: window.NDA.st.virais.length }))); throw e; });
    await page.waitForSelector('.vanalysis');
    const modal = await page.locator('#modal, .sheet').first().textContent().catch(() => '');
    const mtxt = modal || await page.locator('body').textContent();
    ok(mtxt.includes('O valor que ele entrega'), 'análise mostra "O valor que ele entrega"');
    ok(mtxt.includes('Fórmula: Verdade contrária'), 'análise mostra a fórmula');
    ok(mtxt.includes('Recriar este viral'), 'modal mostra "Recriar este viral"');
    for (const a of ['x-kg-viral-car', 'x-kg-viral-leg', 'x-kg-viral-gancho']) ok(await page.locator(`[data-a="${a}"]`).count() === 1, `botão ${a}`);
    ok(await page.locator('.kg-viral [data-a="modelar"]').count() === 1, 'botão Roteiro de Reel modela (há modelagem)');
    const pv = await page.evaluate(() => window.__prompts[window.__prompts.length - 1]);
    ok(pv.bytes < 60000, `prompt do viral < 60000 bytes (${pv.bytes})`);
    ok(await semRolagemX(page), 'modal do viral sem rolagem horizontal');
    await tela(page, 'viral-modal', combo);
    const vid = await st(page, () => window.NDA.st.virais[0].id);
    await clicar(page, '[data-a="x-kg-viral-gancho"]');
    await page.waitForFunction(() => window.NDA.ui.view === 'kit' && window.NDX.state.kit.ativo === 'gancho');
    ok(await page.locator(`.kg-vitem.on[data-id="${vid}"]`).count() === 1 && await page.evaluate(() => window.NDX.toolState('gancho').viralId) === vid, 'Extrair o gancho abre o Kit com o viral escolhido');
    ok(await page.evaluate(() => !window.NDA.ui.modal), 'modal fecha ao ir pro Kit');
    await nav(page, 'virais');
    await clicar(page, '[data-a="x-kg-gancho"]');
    await page.waitForFunction(() => window.NDA.ui.view === 'kit' && window.NDX.state.kit.ativo === 'gancho');
    ok(await page.evaluate(() => window.NDX.toolState('gancho').viralId) === '' && await page.locator('.kg-vitem.on[data-id=""]').count() === 1, 'botão da barra abre o Extrair com viral em branco');
    await nav(page, 'virais');
    await clicar(page, `[data-a="abrir-viral"][data-v="${vid}"]`);
    await clicar(page, '[data-a="x-kg-viral-car"]');
    await page.waitForFunction(() => window.NDX.state.kit.ativo === 'carrossel');
    ok((await vis(page, '#x-kit-tools-carrossel-tema').inputValue()) === 'Os 3 erros de caixa', 'viral → Carrossel com o ângulo');
    await nav(page, 'virais');
    await tela(page, 'virais', combo);

    /* 6) Perfil: exportar, importar, zerar */
    grupo = combo + ' perfil';
    await nav(page, 'perfil');
    await tela(page, 'perfil', combo);
    const nClip = await page.evaluate(() => window.__clip.length);
    await clicar(page, '[data-a="exportar"]');
    await page.waitForFunction(n => window.__clip.length > n, nClip);
    const json = await page.evaluate(() => window.__clip[window.__clip.length - 1]);
    let bk = null; try { bk = JSON.parse(json); } catch (e) { }
    ok(bk && Array.isArray(bk.planos) && bk.planos.length >= 1, 'backup tem planos');
    ok(bk && Array.isArray(bk.pecas) && bk.pecas.length >= 5, `backup tem peças (${bk && bk.pecas && bk.pecas.length})`);
    // zerar
    await clicar(page, '[data-a="zerar"]');
    ok((await texto(page, '[data-a="zerar"]')).includes('Confirmar'), 'Começar do zero pede confirmação');
    await clicar(page, '[data-a="zerar"]');
    ok(await st(page, () => window.NDA.st.planos.length === 0 && window.NDA.st.pecas.length === 0), 'Começar do zero limpa planos e peças');
    await nav(page, 'semana');
    ok(await page.locator('.wk-card').count() === 0, 'Semana vazia depois de zerar');
    await nav(page, 'kit');
    ok(await page.locator('.kc-slide, .kg-area, .kc-tag').count() === 0, 'Kit sem resultado depois de zerar');
    // importar
    await nav(page, 'perfil');
    await page.setInputFiles('#imp-file', { name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(json) });
    await clicar(page, '[data-a="confirmar-import"]');
    ok(await st(page, () => window.NDA.st.planos.length >= 1 && window.NDA.st.pecas.length >= 5), 'Importar traz planos e peças de volta');
    await nav(page, 'semana');
    ok(await page.locator('.wk-card').count() === 5, 'Semana mostra o plano importado');
    await nav(page, 'kit');
    await kitAba(page, 'carrossel');
    ok(await page.locator('[data-a="x-kc-abrir"]').count() >= 1, 'Kit lista o carrossel importado');

    grupo = combo + ' console';
    ok(page.__erros.length === 0, 'sem erro de console: ' + page.__erros.slice(0, 3).join(' | '));
  } catch (e) {
    ok(false, 'exceção: ' + (e && e.message ? e.message.split('\n')[0] + ' @ ' + ((e.stack || '').split('\n').find(l => l.includes('teste.js')) || '').trim() : e));
    try { await page.screenshot({ path: path.join(SHOTS, `ERRO-${combo}-${grupo.replace(/\W+/g, '_')}.png`), fullPage: true }); } catch (er) { }
  }
  await ctx.close();
}

/* ---------- IA indisponível ---------- */
async function suiteSemIA(browser, vp, tema) {
  const combo = `${vp.width}-${tema}`;
  grupo = combo + ' sem IA';
  const { ctx, page } = await novaPagina(browser, { vp, tema, semIA: true });
  try {
    await nav(page, 'semana');
    ok((await page.locator('#main').textContent()).includes('A IA não está disponível'), 'Semana avisa que a IA está indisponível');
    ok(await vis(page, '[data-a="x-wk-gerar"]').isDisabled(), 'Gerar plano desabilitado');
    await nav(page, 'kit');
    const acoes = { gancho: 'x-kg-gancho-gerar', carrossel: 'x-kc-car-gerar', legenda: 'x-kc-leg-gerar', hashtags: 'x-kc-hash-gerar', humanizar: 'x-kc-hum-gerar', reaproveitar: 'x-kg-reap-gerar', perfil: 'x-kg-perfil-gerar' };
    for (const [t, a] of Object.entries(acoes)) {
      await kitAba(page, t);
      ok((await page.locator('#main').textContent()).includes('A IA não está disponível'), `${t} avisa sem IA`);
      ok(await vis(page, `[data-a="${a}"]`).isDisabled(), `${t}: botão de gerar desabilitado`);
    }
    await kitAba(page, 'humanizar');
    await preencher(page, 'x-kit-tools-humanizar-texto', 'Neste post eu vou falar sobre a jornada incrível — e é crucial — de potencializar resultados. Marca 3 amigos!');
    await clicar(page, '[data-a="x-kc-hum-auditar"]');
    ok(/nota sem ia/i.test(await page.locator('#main').textContent()), 'Auditar sem IA funciona sem IA');
    await tela(page, 'kit-sem-ia', combo);
    ok(page.__erros.length === 0, 'sem erro de console sem IA: ' + page.__erros.slice(0, 3).join(' | '));
  } catch (e) { ok(false, 'exceção: ' + (e && e.message ? e.message.split('\n')[0] + ' @ ' + ((e.stack || '').split('\n').find(l => l.includes('teste.js')) || '').trim() : e)); }
  await ctx.close();
}

/* ---------- respostas ruins ---------- */
async function suiteRuins(browser, vp, tema) {
  const combo = `${vp.width}-${tema}`;
  grupo = combo + ' respostas ruins';
  const { ctx, page } = await novaPagina(browser, { vp, tema });
  try {
    await nav(page, 'semana');
    await preencher(page, 'x-semana-form-foco', 'teste');
    for (const r of [{ json: { serie: 'x' } }, { json: 'lixo' }, { json: { dias: [{ dia: 'xyz', gancho: '' }] } }, { erro: 'invalid_json' }]) {
      await fila(page, [r]);
      await clicar(page, '[data-a="x-wk-gerar"]');
      await page.waitForFunction(() => !window.NDX.state.semana.busy && window.NDX.state.semana.err);
      ok((await page.locator('#main .errnote').innerText()).length > 10 && await page.locator('.wk-card').count() === 0, `semana: resposta ruim ${JSON.stringify(r).slice(0, 40)} vira erro amigável`);
    }
    await nav(page, 'kit');
    const casos = [
      ['carrossel', 'x-kit-tools-carrossel-tema', 'x-kc-car-gerar', [{ json: { slides: [{ titulo: 'só um' }] } }, { json: 'lixo' }, { json: [1, 2] }, { json: { slides: [{}, {}, {}, null], legenda: { a: 1 } } }]],
      ['legenda', 'x-kit-tools-legenda-assunto', 'x-kc-leg-gerar', [{ json: { legenda: '' } }, { json: null }, { json: { legenda: { x: 1 } } }]],
      ['hashtags', 'x-kit-tools-hashtags-assunto', 'x-kc-hash-gerar', [{ json: { conjunto: [] } }, { json: { conjunto: ['', null, 5] } }]],
      ['humanizar', 'x-kit-tools-humanizar-texto', 'x-kc-hum-gerar', [{ json: { mudancas: [] } }, { json: 42 }]],
      ['gancho', 'x-kit-tools-gancho-texto', 'x-kg-gancho-gerar', [{ json: { gancho: 'x', recriados: [] } }, { json: { gancho: 'x', recriados: 'abc' } }]],
      ['reaproveitar', 'x-kit-tools-reaproveitar-texto', 'x-kg-reap-gerar', [{ json: { ideiaCentral: 'x', ganchos: [], pontos: [] } }, { json: 'lixo' }]],
      ['perfil', null, 'x-kg-perfil-gerar', [{ json: { nota: 'abc' } }, { json: { nota: 50, itens: [{ area: 'zzz' }], bios: [] } }]]
    ];
    for (const [t, campo, acao, rs] of casos) {
      await kitAba(page, t);
      if (campo) await preencher(page, campo, 'Texto de teste com mais de quarenta caracteres pra passar na validação do formulário.');
      for (const r of rs) {
        await fila(page, [r]);
        await clicar(page, `[data-a="${acao}"]`);
        await page.waitForFunction(i => !window.NDX.state.kit.tools[i].busy && window.NDX.state.kit.tools[i].err, t, { timeout: 4000 }).catch(() => { });
        const err = await st(page, i => window.NDX.state.kit.tools[i].err, t);
        const tela2 = await page.locator('#main').textContent();
        ok(!!err && tela2.includes(err) && /Kit de/i.test(tela2), `${t}: ${JSON.stringify(r).slice(0, 50)} → erro amigável`);
      }
    }
    await tela(page, 'kit-erro', combo);
    // viral com análise ruim
    await nav(page, 'virais');
    await clicar(page, '[data-a="add-viral"]');
    await preencher(page, 'vf-titulo', 'Ruim');
    await preencher(page, 'vf-seguidores', '1000');
    await preencher(page, 'vf-views', '50000');
    await fila(page, [{ json: {} }]);
    await clicar(page, '[data-a="salvar-viral"][data-analisar="1"]');
    await page.waitForFunction(() => window.NDA.ui.modal && window.NDA.ui.modal.err);
    ok(await page.locator('.errnote').count() > 0, 'viral: análise vazia vira erro amigável');
    ok(page.__erros.length === 0, 'sem erro de console com respostas ruins: ' + page.__erros.slice(0, 3).join(' | '));
  } catch (e) { ok(false, 'exceção: ' + (e && e.message ? e.message.split('\n')[0] + ' @ ' + ((e.stack || '').split('\n').find(l => l.includes('teste.js')) || '').trim() : e)); }
  await ctx.close();
}

(async () => {
  const opts = {};
  const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  if (fs.existsSync(exe)) opts.executablePath = exe;
  const browser = await chromium.launch(opts);
  const combos = SO ? [[{ width: 1280, height: 900 }, 'light']] : [[{ width: 1280, height: 900 }, 'light'], [{ width: 1280, height: 900 }, 'dark'], [{ width: 390, height: 844 }, 'light'], [{ width: 390, height: 844 }, 'dark']];
  for (const [vp, tema] of combos) {
    console.log('==>', vp.width, tema);
    await suite(browser, vp, tema);
    await suiteSemIA(browser, vp, tema);
    await suiteRuins(browser, vp, tema);
  }
  await browser.close();
  console.log(`\nPASSOU ${res.passou.length} · FALHOU ${res.falhou.length}`);
  res.falhou.forEach(f => console.log('  x', f));
  fs.writeFileSync(path.join(__dirname, 'resultado.json'), JSON.stringify({ ...res, shots }, null, 2));
  process.exit(res.falhou.length ? 1 : 0);
})();
