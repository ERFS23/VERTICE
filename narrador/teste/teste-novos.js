/* Teste rápido das novidades: vídeo do viral (quadros), escolha de viral no Extrair e recriar, ferramentas das skills do criador. */
const { chromium } = require('playwright');
const path = require('path');
const INIT = () => {
  window.__respostas = []; window.__prompts = [];
  const prox = (input, opts) => { window.__prompts.push({ input: String(input), imgs: opts && opts.images ? opts.images.length : 0 }); return window.__respostas.shift(); };
  const sample = async (i, o) => { const r = prox(i, o); return { text: JSON.stringify(r && r.json), truncated: false }; };
  sample.json = async (i, o) => { const r = prox(i, o); if (!r) throw { code: 'invalid_json' }; return r.json; };
  sample.limits = async () => ({ maxPromptBytes: 65536, images: { maxCount: 6, maxInputBytes: 20000000, mediaTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] } });
  const REELS = '## @fulano — 3 reels\n\n### ABC123 — 1.2M plays, 85K likes, 1,204 comments, 38s, posted 2026-10-01\nhttps://www.instagram.com/reel/ABC123/\n> "Pare de guardar dinheiro na poupança"\n\n### OUT1 — 40K plays, 2K likes, 30 comments, 30s, posted 2026-09-20\nhttps://www.instagram.com/reel/OUT1/\n\n### OUT2 — 60K plays, 3K likes, 50 comments, 31s, posted 2026-09-10\nhttps://www.instagram.com/reel/OUT2/\n';
  let polls = 0;
  window.__mcp = [];
  const mcp = { callTool: async (srv, tool, input) => { window.__mcp.push(tool);
    if (tool === 'vidiq_ig_profile') return { content: [{ type: 'text', text: '## @fulano — Fulano Finanças\n48.2K followers | 10 following | 300 posts\n> "Finanças pessoais sem enrolação"' }], payload: '## @fulano — Fulano Finanças\n48.2K followers | 10 following | 300 posts\n> "Finanças pessoais sem enrolação"' };
    if (tool === 'vidiq_ig_profile_reels') return { content: [{ type: 'text', text: REELS }], payload: REELS };
    if (tool === 'vidiq_watch_shortform_content') return { payload: { mcpJobId: 'job_1', status: 'inprogress' } };
    if (tool === 'vidiq_job_poll') return { payload: polls++ < 1 ? { status: 'inprogress' } : { status: 'completed', result: '0:00 Frame 0: homem joga a carteira na mesa. Fala: "Pare de guardar dinheiro na poupança."' } };
  } };
  window.claude = { use: async n => (n === 'sample' ? sample : n === 'mcp' ? mcp : null) };
};
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FALHA') + ' ' + m); if (!c) process.exitCode = 1; };
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const erros = []; page.on('pageerror', e => erros.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_/.test(m.text())) erros.push(m.text()); });
  await page.addInitScript(INIT);
  await page.goto('file://' + path.resolve(__dirname, '../index.html'));
  await page.waitForFunction(() => window.NDA && window.NDA.ui.ai === 'on');
  // puxar pelo link (vidIQ simulado)
  await page.evaluate(() => { window.NDA.go('virais'); });
  await page.click('[data-a="add-viral"]');
  await page.fill('#vf-link', 'https://www.instagram.com/reel/ABC123/?igsh=xx');
  await page.fill('#vf-handle', '@fulano');
  await page.evaluate(() => { window.__respostas.push({ json: { titulo: 'Poupança não rende', nicho: 'finanças pessoais', transcricao: 'Pare de guardar dinheiro na poupança.', textoTela: 'PARE', edicao: 'joga a carteira', audio: 'Voz original' } }); window.__respostas.push({ json: { veredito: 'Inversão', fatores: [{ area: 'gancho', peso: 5, porque: 'x' }] } }); });
  await page.click('[data-a="x-link-puxar"]');
  await page.waitForFunction(() => window.NDA.st.virais[0] && window.NDA.st.virais[0].analise, null, { timeout: 30000 });
  const vl = await page.evaluate(() => { const v = window.NDA.st.virais[0]; return { s: v.seguidores, v: v.views, c: v.curtidas, d: v.duracao, t: v.titulo, r: v.roteiro, a: !!v.assistido, m: v.media.views, n: v.nicho }; });
  ok(vl.s === '48.200' && vl.v === '1.200.000' && vl.c === '85.000' && vl.d === '38' && vl.a && vl.r && vl.m, 'link puxa perfil, números, média e vídeo assistido ' + JSON.stringify(vl));
  const pa = await page.evaluate(() => window.__prompts[window.__prompts.length - 1].input);
  ok(/VÍDEO ASSISTIDO CENA A CENA/.test(pa), 'análise usa o vídeo assistido');
  await page.evaluate(() => { window.NDA.ui.modal = null; window.NDA.renderModal(); });
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
  await page.evaluate(() => { const v = window.NDA.st.virais.find(x => (window.NDA.viralFrames[x.id] || []).length); document.querySelector('[data-a="x-kg-pick-viral"][data-id="' + v.id + '"]').click(); });
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
  // carrossel viral
  await page.evaluate(() => { window.NDA.go('virais'); });
  await page.click('[data-a="add-viral"]');
  await page.click('[data-a="vf-tipo"][data-t="carrossel"]');
  ok(await page.locator('#v-slides').count() === 1 && await page.locator('#v-video').count() === 0, 'carrossel troca vídeo por slides');
  await page.setInputFiles('#v-slides', ['slide1.png', 'slide2.png', 'slide3.png'].map(f => path.join(__dirname, f)));
  await page.waitForFunction(() => (window.NDA.ui.modal.frames || []).length === 3);
  await page.fill('#vf-titulo', 'Mitos do MEI'); await page.fill('#vf-seguidores', '20 mil'); await page.fill('#vf-curtidas', '15 mil');
  await page.evaluate(() => window.__respostas.push({ json: { veredito: 'Mito x verdade', fatores: [{ area: 'gancho', peso: 5, porque: 'x' }], estrutura: [{ parte: 'Slide 1', oque: 'capa' }, { parte: 'Slide 2', oque: 'mito 1' }, { parte: 'Slide 3', oque: 'cta' }], modelagem: { gancho: 'g', formato: 'lista', angulo: 'a' } } }));
  await page.click('[data-a="salvar-viral"][data-analisar="1"]');
  await page.waitForFunction(() => window.NDA.st.virais[0].tipo === 'carrossel' && window.NDA.st.virais[0].analise);
  const p3 = await page.evaluate(() => window.__prompts[window.__prompts.length - 1]);
  ok(/CARROSSEL, não um Reel/.test(p3.input) && /slides do carrossel/.test(p3.input) && p3.imgs === 3, 'análise do carrossel com os slides');
  ok(await page.locator('[data-a="x-kg-viral-car"]').textContent().then(t => /Replicar carrossel/.test(t)), 'botão Replicar carrossel');
  await page.click('[data-a="x-kg-viral-car"]');
  await page.waitForFunction(() => window.NDX.state.kit.ativo === 'carrossel');
  ok(await page.evaluate(() => /Slide 2: mito 1/.test(window.NDX.toolState('carrossel').base)), 'carrossel abre com a sequência dos slides');
  // Reel → carrossel no Estúdio
  await page.evaluate(() => window.NDA.go('estudio'));
  await page.click('[data-a="virar-carrossel"]');
  await page.waitForFunction(() => window.NDA.ui.view === 'kit' && window.NDX.state.kit.ativo === 'carrossel');
  ok(await page.evaluate(() => /ROTEIRO/.test(window.NDX.toolState('carrossel').base)), 'Estúdio: Virar carrossel leva o roteiro');
  await page.setViewportSize({ width: 390, height: 844 });
  ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'sem rolagem horizontal em 390px');
  await page.screenshot({ path: path.join(__dirname, 'shots/novos-390.png') });
  ok(!erros.length, 'sem erro de console: ' + erros.slice(0, 3).join(' | '));
  await b.close();
})();
