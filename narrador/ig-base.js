/* Narrador de Impacto — base das extensões do Instagram (skills ig-*)
   Carrega ANTES do app.js. Registra telas, modais, ações e campos em window.NDX;
   o app.js lê esse registro e expõe a ponte window.NDA (estado, IA, salvamento, render).
   Tudo que precisa do app (estado, IA, render) é lido de window.NDA na hora do uso. */
(function () {
  const X = window.NDX = window.NDX || {};
  X.views = X.views || {};
  X.modals = X.modals || {};
  X.actions = X.actions || {};
  X.icons = X.icons || {};
  X.hooks = X.hooks || { viraisToolbar: [], viralExtra: [] };
  X.tools = X.tools || [];
  X.K = X.K || {};
  X.state = X.state || {};
  X.onBind = X.onBind || [];
  X.onChange = X.onChange || [];

  const api = () => window.NDA;
  X.api = api;

  /* ---------- ícones novos (traço 24×24, mesmo estilo do app) ---------- */
  Object.assign(X.icons, {
    semana: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/>',
    kit: '<path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/>',
    carrossel: '<rect width="12" height="16" x="6" y="4" rx="2"/><path d="M2 7v10"/><path d="M22 7v10"/>',
    legenda: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h10"/>',
    hashtag: '<path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3 8 21"/><path d="M16 3l-2 18"/>',
    humano: '<path d="M18 11V6a2 2 0 0 0-4 0"/><path d="M14 10V4a2 2 0 0 0-4 0v2"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
    anzol: '<path d="M14 3v11a4 4 0 0 1-8 0v-2"/><path d="m4 14 2-2 2 2"/><circle cx="14" cy="3" r="1"/>',
    reciclar: '<path d="M7 19H4.8a1.8 1.8 0 0 1-1.6-2.7L7.1 9.5"/><path d="M11 19h8.2a1.8 1.8 0 0 0 1.6-2.7l-1.2-2.1"/><path d="m14 16-3 3 3 3"/><path d="M8.3 13.6 7.1 9.5 3 10.6"/><path d="m9.3 5.6 1.1-2a1.8 1.8 0 0 1 3.1 0l3.9 6.8"/><path d="m13.4 9.9 4.1 1.1 1.1-4.1"/>',
    alvo: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    relogio: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'
  });

  /* ---------- CSS próprio das extensões ---------- */
  X.css = text => {
    // vai pro fim do body: assim vem depois do <style> da página e ganha no empate de especificidade
    try { const s = document.createElement('style'); s.textContent = text; (document.body || document.head || document.documentElement).appendChild(s); } catch (e) { }
  };
  X.css(`
/* ---------- extensões IG: shell ---------- */
.kit-tabs{display:flex; gap:6px; overflow-x:auto; padding-bottom:6px; margin-bottom:18px; scrollbar-width:thin}
.kit-tabs .chip{height:34px; padding:0 13px; font-size:13px}
.kit-tabs .chip .ic{width:15px; height:15px}
.kit{display:grid; grid-template-columns:minmax(320px, 400px) minmax(0,1fr); gap:24px; align-items:start}
.kit-in{padding:18px; display:flex; flex-direction:column; gap:14px; position:sticky; top:20px}
.kit-in h2{margin:0; font-family:var(--f-disp); font-weight:800; font-size:24px; text-transform:uppercase; letter-spacing:.02em; line-height:1}
.kit-in .lead{margin:0; font-size:13.5px; color:var(--ink2)}
.kit-out{min-width:0; display:flex; flex-direction:column; gap:16px}
.kit-out .card{padding:18px}
.kit-out h3{margin:0; font-family:var(--f-disp); font-weight:800; font-size:21px; letter-spacing:.03em; text-transform:uppercase}
.kit-hint{font-size:12.5px; color:var(--ink3); margin:0}
.kit-row{display:flex; gap:8px; flex-wrap:wrap; align-items:center}
.kit-row .grow{flex:1}
.kit-sec{display:flex; flex-direction:column; gap:10px}
.kit-sec + .kit-sec{border-top:1px solid var(--line); padding-top:14px}
.kit-pre{white-space:pre-wrap; overflow-wrap:anywhere; margin:0; font-family:var(--f-body); font-size:14.5px; line-height:1.6; background:var(--bg2); border:1px solid var(--line); border-radius:12px; padding:14px 16px}
.kit-fold{position:relative}
.kit-fold .dobra{display:block; border-top:1px dashed var(--amber-line); margin:6px 0; font-family:var(--f-mono); font-size:10.5px; color:var(--amber-text); letter-spacing:.1em; text-transform:uppercase; padding-top:4px}
.kit-hist{display:flex; flex-direction:column}
.kit-hist .rec-row{grid-template-columns:minmax(0,1fr) auto}
.kit-score{display:inline-flex; align-items:baseline; gap:4px; font-family:var(--f-disp); font-weight:800; font-size:26px; line-height:1}
.kit-score small{font-family:var(--f-mono); font-size:11px; color:var(--ink3); font-weight:400}
.kit-audit{display:flex; flex-direction:column; gap:8px}
.kit-audit .it{display:grid; grid-template-columns:auto minmax(0,1fr); gap:10px; align-items:start; font-size:14px; line-height:1.45}
.kit-audit .it .dot{margin-top:6px}
.kit-audit .it small{display:block; color:var(--ink3); font-size:12.5px}
.kit-empty{padding:26px; border:1px dashed var(--line2); border-radius:16px; color:var(--ink2); display:flex; flex-direction:column; gap:8px}
.kit-empty b{color:var(--ink); font-size:15px}
@media (max-width: 1180px){ .kit{grid-template-columns:minmax(0,1fr)} .kit-in{position:static} }
`);

  /* ---------- registro: telas, ferramentas e ganchos ---------- */
  // tela: X.view('semana', { nome, after, render(), count?(), mount?(el) })
  X.view = (id, def) => { X.views[id] = def; };
  // modal: X.modal('tipo', fn(M) -> html, { wide })
  X.modal = (type, fn, opt) => { if (opt && opt.wide) fn.wide = true; X.modals[type] = fn; };
  // ações: X.action('x-nome', (el, e) => {}) — sempre com prefixo x-
  X.action = (name, fn) => { X.actions[name] = fn; };
  // ferramenta do Kit: { id, nome, icone, resumo, ordem, init?() -> estado inicial, render(S) -> html }
  X.tool = def => {
    const i = X.tools.findIndex(t => t.id === def.id);
    if (i >= 0) X.tools.splice(i, 1, def); else X.tools.push(def);
    X.tools.sort((a, b) => (a.ordem || 50) - (b.ordem || 50));
  };
  X.hook = (name, fn) => { (X.hooks[name] = X.hooks[name] || []).push(fn); };
  X.viraisToolbar = () => X.hooks.viraisToolbar.map(f => { try { return f() || ''; } catch (e) { console.error(e); return ''; } }).join('');
  X.viralExtra = (v, M) => X.hooks.viralExtra.map(f => { try { return f(v, M) || ''; } catch (e) { console.error(e); return ''; } }).join('');

  /* ---------- campos: data-bind="x.caminho.no.estado" grava em X.state ---------- */
  X.get = (path, root) => String(path).split('.').reduce((o, k) => (o == null ? undefined : o[k]), root || X.state);
  X.set = (path, val, root) => {
    const ks = String(path).split('.');
    let o = root || X.state;
    ks.slice(0, -1).forEach(k => { if (o[k] == null || typeof o[k] !== 'object') o[k] = {}; o = o[k]; });
    o[ks[ks.length - 1]] = val;
  };
  X.bind = (path, val, el) => {
    X.set(path, val);
    X.onBind.forEach(f => { try { f(path, val, el); } catch (e) { console.error(e); } });
  };
  // onBind: X.watch(fn(path, val, el)) — pra atualizar contadores ao vivo sem re-render
  X.watch = fn => X.onBind.push(fn);
  // change genérico (ex.: input de arquivo): X.onChangeEvent(fn(e) -> true se tratou)
  X.onChangeEvent = fn => X.onChange.push(fn);
  X.change = e => X.onChange.some(f => { try { return !!f(e); } catch (er) { console.error(er); return false; } });

  /* ---------- helpers de HTML ---------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  X.esc = esc;
  const ic = (n, cls) => { const A = api(); return A ? A.ic(n, cls) : ''; };
  X.ic = ic;
  let uid = 0;
  X.h = {
    // campo de texto, área, select, número ou data ligado a X.state por caminho
    campo({ path, label, tipo, value, placeholder, help, rows, opcoes, id, autofocus, max }) {
      const v = value !== undefined ? value : X.get(path);
      const fid = id || 'x-' + String(path).replace(/[^a-z0-9]+/gi, '-');
      const at = `id="${fid}" data-bind="x.${esc(path)}"${autofocus ? ' data-autofocus' : ''}`;
      let inp;
      if (tipo === 'textarea') inp = `<textarea ${at} rows="${rows || 4}" placeholder="${esc(placeholder || '')}"${max ? ` maxlength="${max}"` : ''}>${esc(v || '')}</textarea>`;
      else if (tipo === 'select') inp = `<select ${at}>${(opcoes || []).map(o => { const [val, txt] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(val)}" ${String(v) === String(val) ? 'selected' : ''}>${esc(txt)}</option>`; }).join('')}</select>`;
      else if (tipo === 'check') return `<label class="check"><input type="checkbox" ${at} ${v ? 'checked' : ''}> ${esc(label)}</label>`;
      else inp = `<input type="${tipo === 'num' ? 'number' : tipo === 'date' ? 'date' : 'text'}" ${at} value="${esc(v == null ? '' : v)}" placeholder="${esc(placeholder || '')}"${tipo === 'num' ? ' inputmode="numeric" min="0"' : ''}${max ? ` maxlength="${max}"` : ''}>`;
      return `<label class="field"><span>${esc(label)}</span>${inp}${help ? `<small>${esc(help)}</small>` : ''}</label>`;
    },
    // grupo de botões de escolha única: data-a="x-set" grava o valor no caminho e re-renderiza
    seg(path, opcoes, atual) {
      const cur = atual !== undefined ? atual : X.get(path);
      return `<div class="seg" role="group">${opcoes.map(o => { const [val, txt] = Array.isArray(o) ? o : [o, o]; return `<button type="button" data-a="x-set" data-path="${esc(path)}" data-val="${esc(val)}" aria-pressed="${String(cur) === String(val)}">${esc(txt)}</button>`; }).join('')}</div>`;
    },
    // chips de múltipla escolha: data-a="x-toggle" liga/desliga o valor num array
    multi(path, opcoes) {
      const cur = X.get(path) || [];
      return `<div class="rates">${opcoes.map(o => { const [val, txt] = Array.isArray(o) ? o : [o, o]; const on = cur.includes(val); return `<button type="button" class="chip ${on ? 'on' : ''}" data-a="x-toggle" data-path="${esc(path)}" data-val="${esc(val)}" aria-pressed="${on}">${esc(txt)}</button>`; }).join('')}</div>`;
    },
    copiar(texto, rotulo, cls) { return `<button type="button" class="btn xs ${cls || ''}" data-a="copiar-txt" data-txt="${esc(texto)}">${ic('copy', 'sm')} ${esc(rotulo || 'Copiar')}</button>`; },
    ocupado(msg, stopAction) { return `<div class="thinking" style="padding:18px 2px"><div class="scan"></div><div class="tip">${esc(msg || 'A IA está trabalhando. No modelo padrão isso leva de 10 segundos a 1 minuto.')}</div>${stopAction ? `<button type="button" class="btn sm" data-a="${esc(stopAction)}">${ic('stop', 'sm')} Parar</button>` : ''}</div>`; },
    erro(msg) { return msg ? `<div class="errnote">${ic('alert', 'sm')}<span>${esc(msg)}</span></div>` : ''; },
    vazio(titulo, texto) { return `<div class="kit-empty"><b>${esc(titulo)}</b>${texto ? `<span>${esc(texto)}</span>` : ''}</div>`; },
    lista(arr, cls) { return (arr || []).length ? `<ul class="list ${cls || ''}">${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''; },
    semIA() { const A = api(); return A && A.ui.ai === 'off' ? `<div class="errnote warn">${ic('alert', 'sm')}<span>A IA não está disponível nesta visualização. Abra o app no Claude pra gerar; o que já foi salvo continua aqui.</span></div>` : ''; },
    // contagem rápida do texto: caracteres, hashtags, emojis, travessões
    contagem(texto) {
      const a = X.auditar(texto || '', { rapido: true });
      return `<div class="rates"><span class="tag mono">${a.chars} caract.</span><span class="tag mono ${a.hashtags > 5 ? 'bad' : ''}">${a.hashtags} #</span><span class="tag mono ${a.emojis > 3 ? 'warn' : ''}">${a.emojis} emoji</span>${a.travessoes ? `<span class="tag mono warn">${a.travessoes} travessão</span>` : ''}</div>`;
    },
    // legenda com a marca da dobra dos 125 caracteres (o que aparece antes do "mais")
    dobra(texto) {
      const t = String(texto || '');
      const corte = X.corte125(t);
      return `<div class="kit-fold"><pre class="kit-pre">${esc(t.slice(0, corte))}<span class="dobra">dobra · "mais"</span>${esc(t.slice(corte))}</pre></div>`;
    }
  };

  /* ---------- contagem e auditoria local (sem IA) ---------- */
  const graf = s => { try { return [...new Intl.Segmenter('pt-BR', { granularity: 'grapheme' }).segment(s)].length; } catch (e) { return [...s].length; } };
  X.graf = graf;
  X.corte125 = t => {
    // índice (em code units) onde caem os primeiros 125 grafemas
    let n = 0, i = 0;
    try { for (const seg of new Intl.Segmenter('pt-BR', { granularity: 'grapheme' }).segment(t)) { if (n >= 125) return seg.index; n++; i = seg.index + seg.segment.length; } } catch (e) { return Math.min(t.length, 125); }
    return i;
  };
  const EMOJI = /\p{Extended_Pictographic}/gu;
  // vícios de texto de IA em português (base; ig-saber.js pode ampliar em X.K.humanizar)
  const VICIOS_BASE = [
    { nome: 'Abertura de "revelação"', re: /\b(a verdade é que|o segredo é|e o melhor\??|sabe o que é mais|a real é que|spoiler:)/gi, dica: 'Diga direto o que você ia revelar.' },
    { nome: 'Fórmula "não é X, é Y"', re: /\bn[ãa]o [ée] (s[óo] |apenas |sobre )?[^.!?\n]{2,40}[,;]\s*[ée] /gi, dica: 'Afirme o que é, sem montar o contraste falso.' },
    { nome: 'Palavra de IA', re: /\b(potencializ\w*|alavanc\w*|jornada|desbloque\w*|mergulh\w*|crucial|fundamental(mente)?|robust[oa]s?|transformador(a|es)?|incr[íi]ve(l|is)|revolucion\w*|no cen[áa]rio atual|em um mundo onde|vale ressaltar|[ée] importante ressaltar|sem sombra de d[úu]vidas?|n[ãa]o [ée] exagero dizer)\b/gi, dica: 'Troque pela palavra que você usaria numa conversa.' },
    { nome: 'Pedido de engajamento', re: /\b(comenta (sim|eu quero|a[íi])|marca (3|tr[êe]s|um) amig\w*|d[áa] (um |aquele )?like|deixa (seu|o) like|curte se)\b/gi, dica: 'O Instagram derruba isca de engajamento. Troque por uma pergunta de verdade ou por um único CTA.' },
    { nome: 'Fechamento genérico', re: /\b(e a[íi],? o que voc[êe] acha\??|concorda\?|bora\?!?|vamos juntos)\s*$/gim, dica: 'Feche com uma pergunta específica ou com o próximo passo.' }
  ];
  X.auditar = (texto, opt) => {
    const t = String(texto || '');
    const linhas = t.split('\n');
    const hashtags = (t.match(/(^|\s)#[\p{L}\p{N}_]+/gu) || []).length;
    const emojis = (t.match(EMOJI) || []).length;
    const travessoes = (t.match(/—/g) || []).length;
    const palavras = (t.match(/[\p{L}\p{N}]+/gu) || []).length;
    const out = { chars: graf(t), hashtags, emojis, travessoes, palavras, itens: [] };
    if (opt && opt.rapido) return out;
    const add = (nivel, txt, dica) => out.itens.push({ nivel, txt, dica: dica || '' });
    const prim = t.slice(0, X.corte125(t)).trim();
    const primLinha = (linhas.find(l => l.trim()) || '').trim();
    add(prim.length >= 40 ? 'good' : 'warn', prim.length >= 40 ? 'Os primeiros 125 caracteres têm conteúdo' : 'Os primeiros 125 caracteres estão vazios ou curtos demais', 'É o que aparece antes do "mais": o gancho precisa estar inteiro aqui.');
    if (out.chars > 2200) add('bad', `${out.chars} caracteres: passa do limite de 2.200 do Instagram`, 'Corte o corpo ou leve parte pro primeiro comentário.');
    add(hashtags <= 5 ? 'good' : 'bad', `${hashtags} hashtag${hashtags === 1 ? '' : 's'} (máximo 5)`, 'Fique com 3 a 5, específicas do assunto, no fim.');
    add(emojis <= 3 ? 'good' : 'warn', `${emojis} emoji${emojis === 1 ? '' : 's'}`, 'De 0 a 3, com intenção. Fileira de emoji soa como IA.');
    const limTrav = Math.max(1, Math.floor(palavras / 100));
    add(travessoes <= limTrav ? 'good' : 'warn', `${travessoes} travessão${travessoes === 1 ? '' : 'ões'}`, 'No máximo um a cada 100 palavras. Troque por vírgula, ponto ou dois-pontos.');
    const vicios = VICIOS_BASE.concat(((X.K.humanizar || {}).vicios || []));
    vicios.forEach(v => {
      let re; try { re = v.re instanceof RegExp ? new RegExp(v.re.source, v.re.flags.includes('g') ? v.re.flags : v.re.flags + 'g') : new RegExp(v.re, 'gi'); } catch (e) { return; }
      const m = t.match(re);
      if (m && m.length) add('warn', `${v.nome}: "${m.slice(0, 2).map(s => s.trim()).join('", "')}"`, v.dica);
    });
    const cta = ['segue', 'siga', 'salva', 'salve', 'compartilha', 'compartilhe', 'manda pra', 'comenta', 'comente'].filter(w => new RegExp(`\\b${w}\\b`, 'i').test(t));
    if (cta.length > 1) add('warn', `${cta.length} pedidos diferentes: ${cta.join(', ')}`, 'Um único CTA por post.');
    if (primLinha && /^(oi|ol[áa]|fala,? galera|e a[íi],? galera|hoje eu vou|neste post|nesse post)/i.test(primLinha)) add('bad', `Abertura fraca: "${primLinha.slice(0, 40)}"`, 'Comece pelo gancho, sem saudação.');
    out.nota = Math.max(0, 100 - out.itens.filter(i => i.nivel === 'warn').length * 8 - out.itens.filter(i => i.nivel === 'bad').length * 18);
    return out;
  };

  /* ---------- IA ---------- */
  // X.ia(prompt, { tier, texto, signal, onText, images }) -> JSON (ou texto se texto:true)
  // rejeita { msg, kind, code, text }
  X.ia = async (prompt, opts) => {
    const A = api(); opts = opts || {};
    const s = A && A.sample;
    if (!s) throw { msg: 'A IA não está disponível nesta visualização. Abra o app no Claude pra gerar.', kind: 'warn', code: 'no_sample' };
    const o = { modelTier: opts.tier || 'default', cache: false };
    if (opts.signal) o.signal = opts.signal;
    if (opts.onText) o.onText = opts.onText;
    if (opts.images && opts.images.length) o.images = opts.images;
    try {
      if (opts.texto) { const r = await s(prompt, o); return r.text; }
      return await s.json(prompt, o);
    } catch (e) {
      const er = A.sampleErr(e);
      throw { msg: er.msg, kind: er.kind, code: e && e.code, text: e && e.text };
    }
  };
  // X.rodar(S, prompt, parse, opts): controla S.busy / S.err / S.res / S.ctl e re-renderiza
  X.rodar = async (S, prompt, parse, opts) => {
    if (!S || S.busy) return null;
    S.busy = true; S.err = ''; S.ctl = new AbortController();
    X.refresh();
    let res = null;
    try {
      const r = await X.ia(prompt, Object.assign({}, opts || {}, { signal: S.ctl.signal }));
      res = parse ? parse(r) : r;
      if (!res) throw { msg: 'A resposta veio fora do formato esperado. Tente de novo.', kind: 'bad' };
      S.res = res;
    } catch (e) {
      if (!(e && e.code === 'cancelled')) S.err = (e && e.msg) || 'Não deu certo agora. Tente de novo.';
      res = null;
    } finally {
      S.busy = false; S.ctl = null;
      X.refresh();
    }
    return res;
  };
  X.parar = S => { if (S && S.ctl) { try { S.ctl.abort(); } catch (e) { } } };
  X.prontoIA = () => { const A = api(); return !!(A && A.ui.ai === 'on'); };

  // re-render só do que é das extensões (tela atual + modal aberto)
  X.refresh = () => {
    const A = api(); if (!A) return;
    if (X.views[A.ui.view]) {
      const m = document.getElementById('main');
      const y = window.scrollY;
      if (m) { m.innerHTML = X.views[A.ui.view].render(); if (typeof X.views[A.ui.view].mount === 'function') X.views[A.ui.view].mount(m); }
      A.renderChrome();
      window.scrollTo(0, y);
    }
    if (A.ui.modal && (X.modals[A.ui.modal.type] || A.ui.modal.type === 'viral')) A.renderModal();
  };

  /* ---------- contexto do perfil pros prompts ---------- */
  // Bloco padrão que toda ferramenta coloca no começo do prompt: quem é o criador,
  // verdade e limites, voz, o que o perfil aprendeu e as regras de valor.
  X.ctxPerfil = (opt) => {
    const A = api(); const st = A.st, E = A.E, p = st.profile;
    opt = opt || {};
    const partes = [];
    partes.push(`Você é o NARRADOR DE IMPACTO, estrategista de conteúdo e roteirista de Instagram de ${p.nome || 'um criador'}${p.handle ? ` (${p.handle})` : ''}. Responda sempre em português do Brasil, com a linguagem de quem fala com o público dele (nada de jargão de marketing). Hoje é ${E.hoje()}.`);
    partes.push(`═══ DNA DO PERFIL ═══\n${E.dna ? E.dna(p) : [p.nome, p.handle, p.nicho, p.publico].filter(Boolean).join(' · ')}`);
    if (p.tom) partes.push(`═══ TOM ═══\n${p.tom}`);
    if (E.VALOR) partes.push(E.VALOR);
    if (!opt.semVerdade && E.verdade) partes.push(E.verdade(p, st));
    if (!opt.semAprendizados && E.aprendizados) partes.push(`═══ O QUE ESTE PERFIL JÁ APRENDEU ═══\n${E.aprendizados(st)}`);
    if (p.gravacao && !opt.semGravacao) partes.push(`═══ O QUE O CRIADOR CONSEGUE GRAVAR E EDITAR ═══\n${p.gravacao}`);
    return partes.join('\n\n');
  };
  // Resumo do desempenho real (Biblioteca + Virais analisados) pra planejar com base em dados
  X.desempenho = () => {
    const A = api(); const st = A.st, E = A.E, N = A.N;
    const L = [];
    try {
      const pf = E.agrupar(st, 'formato');
      const fl = Object.entries(pf).filter(([, x]) => x.media != null).sort((a, b) => b[1].media - a[1].media).slice(0, 5).map(([k, x]) => `${(E.formato(k) || {}).nome || k} (score ${x.media}, ${x.comScore} vídeo${x.comScore > 1 ? 's' : ''})`);
      if (fl.length) L.push('Formatos com melhor score no perfil: ' + fl.join(' · '));
      const rg = E.rankGanchos(st).slice(0, 4).map(x => `"${(E.gancho(x.id) || {}).texto || ''}" (score ${x.media})`);
      if (rg.length) L.push('Ganchos que mais funcionaram: ' + rg.join(' · '));
      const geral = E.scoreGeral(st); if (geral != null) L.push(`Score médio do perfil: ${geral}/100.`);
    } catch (e) { }
    const an = st.virais.filter(v => v.analise).slice(0, 8);
    if (an.length) {
      L.push(`Virais de referência analisados (${an.length}):`);
      an.forEach(v => L.push(`- ${v.handle || 'perfil'} "${v.titulo || ''}": ${(v.analise.veredito || '').slice(0, 220)}${v.analise.formato && E.formato(v.analise.formato) ? ' · formato ' + E.formato(v.analise.formato).nome : ''}`));
    }
    const rec = st.scripts.filter(s => s.origem !== 'referencia').slice(0, 10).map(s => `"${s.titulo || 'sem título'}"`);
    if (rec.length) L.push('Roteiros recentes (não repetir o assunto): ' + rec.join(' · '));
    const lic = st.memory.licoes.filter(l => l.ativa !== false).slice(0, 8).map(l => '- ' + l.texto);
    if (lic.length) L.push('Lições ativas:\n' + lic.join('\n'));
    return L.join('\n') || '(o perfil ainda não tem números nem virais analisados: use as boas práticas e diga isso)';
  };
  X.formatosLista = () => { const A = api(); return A.N.FORMATOS.map(f => `${f.id} = ${f.nome} (${f.dur[0]}–${f.dur[1]} s): ${f.serve}`).join('\n'); };
  X.pilaresLista = () => { const A = api(); return A.N.PILARES.map(p => `${p.id} = ${p.nome}`).join(', '); };

  /* ---------- normalizadores de JSON ---------- */
  X.str = (x, max) => { const s = x == null ? '' : String(x).replace(/\\n/g, '\n').trim(); return max ? s.slice(0, max) : s; };
  X.arr = (x, n, map) => (Array.isArray(x) ? x : []).map(map || (y => X.str(y))).filter(y => y !== '' && y != null).slice(0, n || 12);
  X.num = (x, lo, hi) => { const n = Math.round(Number(x)); return isFinite(n) ? Math.max(lo, Math.min(hi, n)) : null; };

  /* ---------- salvamento (coleções 'planos' e 'pecas') ---------- */
  X.salvar = (col, item) => {
    const A = api(); if (!A || !item) return null;
    if (!item.id) item.id = A.newId(col === 'planos' ? 'w' : 'k');
    if (!item.createdAt) item.createdAt = Date.now();
    item.updatedAt = Date.now();
    const arr = A.st[col] || (A.st[col] = []);
    const i = arr.findIndex(x => x.id === item.id);
    if (i >= 0) arr[i] = item; else arr.unshift(item);
    A.Store.saveItem(col, item);
    return item;
  };
  X.apagar = (col, id) => {
    const A = api(); if (!A) return;
    const arr = A.st[col] || [];
    const i = arr.findIndex(x => x.id === id);
    if (i >= 0) arr.splice(i, 1);
    A.Store.delItem(col, id);
  };
  X.pecas = tipo => { const A = api(); return (A.st.pecas || []).filter(p => !tipo || p.tipo === tipo); };

  /* ---------- levar pro Estúdio (roteiro de Reel) ---------- */
  // X.paraEstudio({ assunto, gancho, formatoId, objetivo, proximo, obs, why, temaId })
  X.paraEstudio = o => {
    const A = api(); const sd = A.ui.studio, E = A.E;
    const fid = o.formatoId && E.formato(o.formatoId) ? o.formatoId : (sd.formatoId || 'lista');
    const obj = o.objetivo && E.objetivo(o.objetivo) ? o.objetivo : sd.objetivo;
    Object.assign(sd, {
      mode: 'criar', temaId: o.temaId && E.tema(o.temaId) ? o.temaId : null, formatoId: fid, objetivo: obj,
      assunto: X.str(o.assunto, 600), ganchoModo: 'meu', ganchoId: null, ganchoTexto: X.str(o.gancho, 300), ganchoTravado: false,
      inspiracao: null, colchetes: [], fato: '', fonte: '', continua: null, serie: null, modelo: o.modelo || null,
      proximo: X.str(o.proximo, 300), obs: X.str(o.obs, 1200),
      why: X.str(o.why, 300) || 'Ideia vinda do Kit Instagram. Edite o gancho do seu jeito e rode o take.'
    });
    A.ui.modal = null;
    A.go('estudio');
    A.toast('Levado pro Estúdio. Revise o gancho e rode o take.');
  };

  /* ---------- Kit: tela com as ferramentas ---------- */
  const K = X.state.kit = X.state.kit || { ativo: null, tools: {} };
  try { const a = localStorage.getItem('ndi:kit'); if (a) K.ativo = a; } catch (e) { }
  X.toolState = id => {
    if (!K.tools[id]) {
      const t = X.tools.find(x => x.id === id);
      K.tools[id] = Object.assign({ busy: false, err: '', res: null, ctl: null }, t && typeof t.init === 'function' ? t.init() : {});
    }
    return K.tools[id];
  };
  // abre uma ferramenta já preenchida: X.abrirFerramenta('carrossel', { tema: '...' })
  X.abrirFerramenta = (id, preset) => {
    const A = api();
    if (!X.tools.find(t => t.id === id)) return;
    K.ativo = id;
    try { localStorage.setItem('ndi:kit', id); } catch (e) { }
    const S = X.toolState(id);
    if (preset) { Object.assign(S, preset); S.res = preset.res || null; S.err = ''; }
    A.ui.modal = null;
    if (A.ui.view === 'kit') { A.render(); window.scrollTo(0, 0); } else A.go('kit');
  };
  X.view('kit', {
    nome: 'Kit IG', after: 'virais',
    count: () => X.tools.length || null,
    render() {
      const A = api();
      if (!X.tools.length) return `<div class="vh"><div><h1>Kit <em>Instagram</em></h1></div></div>${X.h.vazio('Nenhuma ferramenta carregada.', 'Recarregue a página.')}`;
      if (!K.ativo || !X.tools.find(t => t.id === K.ativo)) K.ativo = X.tools[0].id;
      const t = X.tools.find(x => x.id === K.ativo);
      const S = X.toolState(t.id);
      let corpo = '';
      try { corpo = t.render(S); } catch (e) { console.error(e); corpo = X.h.erro('Esta ferramenta deu erro ao abrir. Troque de aba e volte.'); }
      return `<div class="vh"><div><div class="eyebrow">Kit Instagram · ${X.tools.length} ferramentas</div><h1>Kit de <em>crescimento</em></h1>
        <p>Ferramentas pra cada etapa do post: extrair o gancho de um viral e recriar no seu nicho, planejar carrossel, escrever legenda, escolher hashtags, tirar a cara de IA e ajustar o perfil. Tudo usa o DNA do Perfil e o que o app aprendeu com os seus números.</p></div></div>
        ${X.h.semIA()}
        <div class="kit-tabs" role="tablist" aria-label="Ferramentas">${X.tools.map(x => `<button type="button" role="tab" class="chip ${x.id === t.id ? 'on' : ''}" aria-selected="${x.id === t.id}" data-a="x-kit-tab" data-t="${esc(x.id)}">${ic(x.icone || 'spark', 'sm')}${esc(x.nome)}</button>`).join('')}</div>
        ${corpo}`;
    }
  });
  X.action('x-kit-tab', el => { K.ativo = el.dataset.t; try { localStorage.setItem('ndi:kit', K.ativo); } catch (e) { } api().render(); });

  /* ---------- ações genéricas ---------- */
  X.action('x-set', el => { X.bind(el.dataset.path, el.dataset.val, el); X.refresh(); });
  X.action('x-toggle', el => {
    const cur = (X.get(el.dataset.path) || []).slice();
    const v = el.dataset.val, i = cur.indexOf(v);
    if (i >= 0) cur.splice(i, 1); else cur.push(v);
    X.bind(el.dataset.path, cur, el); X.refresh();
  });
  // parar a geração de uma ferramenta do Kit: data-a="x-parar" data-t="id"
  X.action('x-parar', el => X.parar(X.toolState(el.dataset.t)));
  // apagar peça salva: data-a="x-del-peca" data-id
  X.action('x-del-peca', el => { X.apagar('pecas', el.dataset.id); api().toast('Apagado.'); X.refresh(); });

  // zerar (Perfil › Começar do zero): limpa o estado das extensões
  X.reset = () => { K.tools = {}; Object.keys(X.state).forEach(k => { if (k !== 'kit') delete X.state[k]; }); (X.onReset || []).forEach(f => { try { f(); } catch (e) { } }); };
  X.onReset = X.onReset || [];
})();
