/* Teste rápido das novidades: vídeo do viral (quadros), escolha de viral no Extrair e recriar, ferramentas das skills do criador. */
const { chromium } = require('playwright');
const path = require('path');
const INIT = () => {
  window.__respostas = []; window.__prompts = [];
  const prox = (input, opts) => { window.__prompts.push({ input: String(input), imgs: opts && opts.images ? opts.images.length : 0 }); return window.__respostas.shift(); };
  const sample = async (i, o) => { const r = prox(i, o); return { text: JSON.stringify(r && r.json), truncated: false }; };
  sample.json = async (i, o) => { const r = prox(i, o); if (!r) throw { code: 'invalid_json' }; return r.json; };
  sample.limits = async () => ({ maxPromptBytes: 65536, images: { maxCount: 6, maxInputBytes: 20000000, mediaTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] } });
  window.claude = { use: async n => (n === 'sample' ? sample : null) };
};
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FALHA') + ' ' + m); if (!c) process.exitCode = 1; };
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const erros = []; page.on('pageerror', e => erros.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_/.test(m.text())) erros.push(m.text()); });
  await page.addInitScript(INIT);
  await page.goto('file://' + path.resolve(__dirname, '../index.html'));
  await page.waitForFunction(() => window.NDA && window.NDA.ui.ai === 'on');
  // viral com vídeo
  await page.evaluate(() => { window.NDA.go('virais'); });
  await page.click('[data-a="add-viral"]');
  await page.setInputFiles('#v-video', path.join(__dirname, 'reel.webm'));
  await page.waitForFunction(() => (window.NDA.ui.modal.frames || []).length > 0, null, { timeout: 15000 });
  const fr = await page.evaluate(() => ({ n: window.NDA.ui.modal.frames.length, t: window.NDA.ui.modal.frames.map(f => f.t), dur: window.NDA.ui.modal.draft.duracao }));
  ok(fr.n >= 3 && fr.t[0] < 0.2 && fr.dur === '12', 'vídeo vira quadros ' + JSON.stringify(fr));
  await page.fill('#vf-titulo', 'Poupança não'); await page.fill('#vf-seguidores', '10 mil'); await page.fill('#vf-views', '200 mil');
  await page.evaluate(() => window.__respostas.push({ json: { veredito: 'Inversão de crença', fatores: [{ area: 'gancho', peso: 5, porque: 'x' }], gancho: { texto: 'Pare', formula: 'contrária' } } }));
  await page.click('[data-a="salvar-viral"][data-analisar="1"]');
  await page.waitForFunction(() => window.NDA.st.virais[0] && window.NDA.st.virais[0].analise);
  const p1 = await page.evaluate(() => window.__prompts[window.__prompts.length - 1]);
  ok(p1.imgs >= 3 && /quadros do próprio vídeo/.test(p1.input), 'análise recebe os quadros (' + p1.imgs + ' imagens)');
  ok(await page.evaluate(() => window.NDA.st.virais[0].analise.gancho.formula === 'contraria'), 'fórmula com acento normalizada');
  // Extrair e recriar escolhendo o viral
  await page.evaluate(() => { window.NDA.ui.modal = null; window.NDX.abrirFerramenta('gancho', {}); });
  await page.click('[data-a="x-kg-pick-viral"][data-id]:not([data-id=""])');
  ok(await page.evaluate(() => !!window.NDX.toolState('gancho').viralId), 'viral escolhido pelo cartão');
  await page.evaluate(() => window.__respostas.push({ json: { gancho: 'Pare', formula: 'contraria', objetivo: 'compartilhamentos', porque: 'x', recriados: [1, 2, 3].map(i => ({ texto: 'Gancho ' + i, superficie: 'reel', formula: 'contraria', objetivo: 'salvamentos', angulo: 'a' })) } }));
  await page.click('[data-a="x-kg-gancho-gerar"]');
  await page.waitForFunction(() => window.NDX.toolState('gancho').res);
  const p2 = await page.evaluate(() => window.__prompts[window.__prompts.length - 1]);
  ok(p2.imgs >= 3 && /Poupança não/.test(p2.input), 'Extrair e recriar usa o viral e os quadros (' + p2.imgs + ')');
  // ferramentas novas
  for (const [tool, acao, json] of [
    ['lista', 'x-ks-lista', { titulos: ['5 X que TODO criador'], palavra: 'LISTA', roteiro: [{ tempo: '0–5s', fala: 'Duvido', topo: 'T', item: '', acao: 'a' }], legenda: 'leg', dm: 'dm', curto: 'c', avisos: [] }],
    ['react', 'x-ks-react', { formato: 'F1', versoes: [{ abertura: 'A', frame0: 'f', fala: 'Como que alguém', duracao: '8 s', final: 'x' }], legenda: { linha1: 'a', cta: 'b' } }],
    ['cortes', 'x-ks-cortes', { momentos: [{ inicio: '00:01', fim: '00:40', titulo: 'T', hook: 'H', payoff: 'P', nota: 8 }] }]]) {
    await page.evaluate(([t]) => { window.NDX.abrirFerramenta(t, t === 'react' ? { assunto: 'Meta muda regra' } : t === 'cortes' ? { texto: 'fala '.repeat(80) } : {}); }, [tool]);
    await page.evaluate(j => window.__respostas.push({ json: j }), json);
    await page.click(`[data-a="${acao}"]`);
    await page.waitForFunction(t => window.NDX.toolState(t).res, tool);
    ok(true, 'ferramenta ' + tool + ' gera e mostra');
  }
  await page.setViewportSize({ width: 390, height: 844 });
  ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'sem rolagem horizontal em 390px');
  await page.screenshot({ path: path.join(__dirname, 'shots/novos-390.png') });
  ok(!erros.length, 'sem erro de console: ' + erros.slice(0, 3).join(' | '));
  await b.close();
})();
