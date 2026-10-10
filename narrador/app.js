/* Narrador de Impacto — app */
(function () {
  const N = window.NDI, E = window.NDE;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clone = o => JSON.parse(JSON.stringify(o));
  const newId = p => (p || 's') + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const pad2 = n => String(n).padStart(2, '0');
  const LS = 'ndi:v1';
  // extensões (ig-*.js) registram telas, modais, ações e campos em window.NDX antes deste arquivo
  const X = window.NDX || {};
  ['views', 'modals', 'actions', 'icons'].forEach(k => { if (!X[k] || typeof X[k] !== 'object') X[k] = {}; });
  const COLECOES = ['planos', 'pecas'];

  /* ---------- ícones ---------- */
  const IC = {
    estudio: '<path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    ganchos: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    temas: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    formatos: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    biblioteca: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
    perfil: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    spark: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    pause: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="1.5"/>',
    shuffle: '<path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/>',
    trend: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    scroll: '<path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
    chev: '<path d="m9 18 6-6-6-6"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    device: '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    brain: '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M12 5v13"/>',
    minus: '<path d="M5 12h14"/>',
    flip: '<path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"/><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/><path d="M12 20v2"/><path d="M12 14v2"/><path d="M12 8v2"/><path d="M12 2v2"/>'
  };
  IC.virais = IC.trend;
  IC.mic = '<rect width="6" height="11" x="9" y="2" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><path d="M12 18v4"/>';
  IC.stop = '<rect width="12" height="12" x="6" y="6" rx="2"/>';
  Object.keys(X.icons).forEach(k => { if (!IC[k]) IC[k] = X.icons[k]; });
  const ic = (n, cls) => `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || ''}</svg>`;
  const SAW = '<span class="logo-mask" role="img" aria-label="Logo"></span>';

  /* ---------- estado ---------- */
  function blank() {
    return {
      profile: { nome: '', apelido: '', handle: '', assinatura: '', promessa: '', nicho: '', posicionamento: '', publico: '', credencial: '', proibidos: '', permitidos: '', ofertas: '', ctaModo: 'seguir', ctaPalavra: '', bordao: '', seguidores: '', metaSeguidores: '', metaData: '', metaNegocio: '', tom: '', gravacao: '', visual: '', bio: '', nomeCampo: '', regulado: false, disclaimer: '⚖️ Conteúdo informativo. Não substitui a análise de um profissional para o seu caso.', mediaViews: '' },
      memory: { licoes: [], voz: null, prefs: [], fatos: [] },
      bank: { temas: {} },
      scripts: [],
      virais: [],
      planos: [],
      pecas: [],
      meta: { preset: null, persisted: false }
    };
  }
  function presetSerrano() {
    const now = Date.now();
    return {
      profile: clone(N.PERFIL_SERRANO),
      memory: {
        licoes: N.LICOES_SERRANO.map((t, i) => ({ id: 'l' + i, texto: t, ativa: true, origem: 'Super Master Prompt v5', data: '22/09/2026' })),
        voz: null, prefs: [],
        fatos: N.FATOS_SERRANO.map((t, i) => ({ id: 'f' + i, texto: t, data: '22/09/2026' }))
      },
      bank: { temas: {} },
      scripts: N.POSTS_SERRANO.map((p, i) => ({
        id: 'ref' + i, origem: 'referencia', status: 'postado',
        createdAt: p.postadoEm ? Date.parse(p.postadoEm + 'T12:00:00') : now - 86400000 * (40 + i),
        titulo: p.titulo, formatoId: p.formatoId, temaId: p.temaId, ganchoId: p.ganchoId, duracao: p.duracao,
        postadoEm: p.postadoEm, metrics: clone(p.metrics), nota: p.nota, raw: ''
      })),
      virais: [],
      planos: [],
      pecas: [],
      meta: { preset: 'serrano', persisted: false }
    };
  }
  function normalize(o) {
    const b = blank();
    const out = {
      profile: Object.assign(b.profile, o && o.profile || {}),
      memory: Object.assign(b.memory, o && o.memory || {}),
      bank: Object.assign(b.bank, o && o.bank || {}),
      scripts: Array.isArray(o && o.scripts) ? o.scripts.filter(s => s && s.id) : [],
      virais: Array.isArray(o && o.virais) ? o.virais.filter(v => v && v.id) : [],
      meta: Object.assign(b.meta, o && o.meta || {})
    };
    COLECOES.forEach(k => {
      out[k] = Array.isArray(o && o[k]) ? o[k].filter(x => x && x.id) : [];
      out[k].sort((a, b2) => (b2.createdAt || 0) - (a.createdAt || 0));
    });
    ['licoes', 'prefs', 'fatos'].forEach(k => { if (!Array.isArray(out.memory[k])) out.memory[k] = []; });
    if (!out.bank.temas || typeof out.bank.temas !== 'object') out.bank.temas = {};
    out.scripts.sort((a, b2) => (b2.createdAt || 0) - (a.createdAt || 0));
    out.virais.sort((a, b2) => (b2.createdAt || 0) - (a.createdAt || 0));
    return out;
  }

  let st = presetSerrano();
  E._state = st;
  const setState = o => { st = o; E._state = st; };

  /* ---------- telas (nav) ---------- */
  const VIEWS = [
    ['estudio', 'Estúdio'], ['virais', 'Virais'], ['ganchos', 'Ganchos'], ['temas', 'Temas'], ['formatos', 'Formatos'], ['biblioteca', 'Biblioteca'], ['perfil', 'Perfil']
  ];
  Object.keys(X.views).forEach(id => {
    const xv = X.views[id];
    if (!xv || typeof xv.render !== 'function' || VIEWS.some(v => v[0] === id)) return;
    const i = VIEWS.findIndex(v => v[0] === xv.after);
    VIEWS.splice(i < 0 ? VIEWS.length : i + 1, 0, [id, xv.nome || id]);
  });
  const viewOk = id => VIEWS.some(v => v[0] === id);

  const ui = {
    view: 'estudio',
    studio: { mode: 'criar', temaId: null, formatoId: null, ganchoId: null, colchetes: [], fato: '', fonte: '', ancora: '', proximo: '', obs: '', stories: false, objetivo: 'seguidores', tier: 'complex', continua: null, modelo: null, serie: null, why: '', assunto: '', ganchoModo: 'meu', ganchoTexto: '', ganchoTravado: false, inspiracao: null },
    juntos: { fase: 'chat', msgs: [], status: 'idle', err: '', draft: '', ideia: '', ctl: null, serie: null },
    gen: { status: 'idle', raw: N.EXEMPLO, exemplo: true, ctx: { temaId: 3, ganchoId: 151, formatoId: 'lista' }, scriptId: null, err: '', errKind: '', t0: 0, ctl: null, kind: 'roteiro', turns: null, storiesRes: null, storiesBusy: false, truncated: false, editing: false, editDraft: '' },
    ideia: { texto: '', status: 'idle', res: null, err: '' },
    revisar: { modo: 'roteiro', texto: '', gancho: '', cta: '', statusG: 'idle', statusC: 'idle', resGancho: null, resCta: null, errG: '', errC: '' },
    gf: { cat: 0, flag: 'todos', q: '' },
    tf: { pilar: 'todos', q: '' },
    bf: 'todos',
    ai: 'wait', store: 'local',
    modal: null,
    voz: { texto: '', num: '', busy: false, res: null },
    bio: { busy: false, res: null },
    resetArm: 0,
    vf: 'todos',
    imgMax: 0
  };
  const viralFiles = {};
  try { const v = localStorage.getItem('ndi:view'); if (v && viewOk(v)) ui.view = v; } catch (e) { }
  if (/^#[a-z]+$/.test(location.hash) && viewOk(location.hash.slice(1))) ui.view = location.hash.slice(1);
  try { const t = localStorage.getItem('ndi:tier'); if (t === 'default' || t === 'complex') ui.studio.tier = t; } catch (e) { }

  let sampleFn = null, downloads = null;

  /* ---------- persistência ---------- */
  const Store = {
    mode: 'local', db: null, uid: null, chains: {}, timer: 0,
    lsGet() { try { return JSON.parse(localStorage.getItem(LS) || 'null'); } catch (e) { return null; } },
    local() { if (!st.meta.persisted) return; try { localStorage.setItem(LS, JSON.stringify(st)); } catch (e) { } },
    estado() { return this.db.doc('data/users/' + this.uid + '/estado'); },
    rot() { return this.estado().collection('roteiros'); },
    vir() { return this.estado().collection('virais'); },
    q(key, fn) {
      const p = (this.chains[key] || Promise.resolve()).then(fn).catch(e => this.fail(e, key, fn));
      this.chains[key] = p; return p;
    },
    fail(e, key, fn) {
      const c = e && e.code;
      if (c === 'unavailable' && fn && !fn._retried) { fn._retried = true; return new Promise(r => setTimeout(r, 800 + Math.random() * 900)).then(fn).catch(er => this.fail(er)); }
      if (c === 'quota_exceeded') toast('Limite de itens salvos na nuvem atingido. Apague roteiros antigos na Biblioteca.', 'bad');
      else if (c) {
        if (this.mode === 'nuvem') {
          this.mode = 'local'; ui.store = 'local';
          toast('Não deu pra salvar na nuvem. Seguindo com salvamento neste navegador.', 'warn');
          this.local(); renderChrome();
        }
      }
    },
    markPersisted() {
      if (st.meta.persisted) return false;
      st.meta.persisted = true;
      if (this.mode === 'nuvem') { st.scripts.forEach(s => this.put(s)); st.virais.forEach(v => this.putV(v)); COLECOES.forEach(k => (st[k] || []).forEach(x => this.putC(k, x))); }
      return true;
    },
    // coleções das extensões (planos da semana, peças do Kit)
    col(k) { return this.estado().collection(k); },
    putC(k, x) { const body = clone(x); this.q(k + ':' + x.id, () => this.col(k).doc(x.id).set(body)); },
    saveItem(k, x) {
      if (!COLECOES.includes(k) || !x || !x.id) return;
      const first = this.markPersisted();
      if (first) this.saveEstado();
      else { this.local(); if (this.mode === 'nuvem') this.putC(k, x); }
    },
    delItem(k, id) {
      if (!COLECOES.includes(k)) return;
      this.local();
      if (this.mode === 'nuvem') this.q(k + ':' + id, () => this.col(k).doc(id).delete());
    },
    put(s) { const body = clone(s); this.q('s:' + s.id, () => this.rot().doc(s.id).set(body)); },
    putV(v) { const body = clone(v); this.q('v:' + v.id, () => this.vir().doc(v.id).set(body)); },
    saveViral(v) {
      const first = this.markPersisted();
      if (first) this.saveEstado();
      else { this.local(); if (this.mode === 'nuvem') this.putV(v); }
    },
    delViral(id) {
      this.local();
      if (this.mode === 'nuvem') this.q('v:' + id, () => this.vir().doc(id).delete());
    },
    saveEstado() {
      this.markPersisted();
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.local();
        if (this.mode === 'nuvem') {
          const body = clone({ profile: st.profile, memory: st.memory, bank: st.bank, meta: st.meta, v: 1, updatedAt: Date.now() });
          this.q('estado', () => this.estado().set(body));
        }
      }, 650);
    },
    saveScript(s) {
      const first = this.markPersisted();
      if (first) this.saveEstado();
      else { this.local(); if (this.mode === 'nuvem') this.put(s); }
    },
    delScript(id) {
      this.local();
      if (this.mode === 'nuvem') this.q('s:' + id, () => this.rot().doc(id).delete());
    },
    async init() {
      const loc = this.lsGet();
      if (loc && loc.meta && loc.meta.persisted) setState(normalize(loc));
      let user = null, db = null;
      try {
        if (window.claude && window.claude.use) [user, db] = await Promise.all([window.claude.use('user'), window.claude.use('db')]);
      } catch (e) { }
      if (user && db) {
        let id = null;
        try { id = await user.id(); } catch (e) { }
        if (id) {
          this.db = db; this.uid = id; this.mode = 'nuvem'; ui.store = 'nuvem';
          try {
            const snap = await this.estado().get();
            if (snap.exists) {
              const d = clone(snap.data());
              const rs = await this.rot().orderBy('createdAt', 'desc').limit(1000).get();
              d.scripts = rs.docs.map(x => clone(x.data()));
              try { const vs = await this.vir().orderBy('createdAt', 'desc').limit(500).get(); d.virais = vs.docs.map(x => clone(x.data())); } catch (e) { d.virais = []; }
              for (const k of COLECOES) {
                try { const xs = await this.col(k).orderBy('createdAt', 'desc').limit(300).get(); d[k] = xs.docs.map(x => clone(x.data())); } catch (e) { d[k] = []; }
              }
              d.meta = Object.assign({}, d.meta, { persisted: true });
              setState(normalize(d));
              this.local();
            } else if (loc && loc.meta && loc.meta.persisted) {
              st.meta.persisted = false; this.saveEstado();
            }
          } catch (e) {
            this.mode = 'local'; ui.store = 'local';
          }
        }
      }
      ui.store = this.mode;
      render();
    }
  };

  /* ---------- toasts / copiar ---------- */
  function toast(msg, kind) {
    const el = document.createElement('div');
    el.className = 'toast ' + (kind || 'good');
    el.innerHTML = ic(kind === 'bad' || kind === 'warn' ? 'alert' : 'check') + '<span></span>';
    el.querySelector('span').textContent = msg;
    $('#toasts').appendChild(el);
    setTimeout(() => el.remove(), kind === 'bad' ? 7000 : 3600);
  }
  function copy(text, label) {
    const ok = () => toast((label || 'Texto') + ' copiado.');
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let done = false; try { done = document.execCommand('copy'); } catch (e) { }
      ta.remove();
      done ? ok() : toast('Não deu pra copiar automaticamente. Selecione o texto e copie.', 'warn');
    };
    try { navigator.clipboard.writeText(text).then(ok, fallback); } catch (e) { fallback(); }
  }

  /* ---------- helpers de domínio ---------- */
  const scriptById = id => st.scripts.find(s => s.id === id);
  const takeNum = () => st.scripts.filter(s => s.origem !== 'referencia').length + 1;
  const pilarColor = p => `var(--p-${p})`;
  const catName = id => (E.cat(id) || {}).nome || '';
  const fmtName = id => (E.formato(id) || {}).nome || '';
  const scoreTag = sc => sc == null ? '' : `<span class="tag ${sc >= 70 ? 'good' : sc >= 40 ? 'amber' : 'bad'}">score ${sc}</span>`;
  const statusTag = s => ({ rascunho: '<span class="tag">Rascunho</span>', gravado: '<span class="tag amber">Gravado</span>', postado: '<span class="tag good">Postado</span>' }[s.status] || '');
  const dataBR = ts => { if (!ts) return ''; const d = new Date(ts); return pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear(); };
  const grafemas = s => { try { return [...new Intl.Segmenter('pt-BR', { granularity: 'grapheme' }).segment(s)].length; } catch (e) { return [...s].length; } };
  const initials = () => { const n = (st.profile.apelido || st.profile.nome || st.profile.handle || '?').replace('@', '').trim(); return (n[0] || '?').toUpperCase(); };
  const hl = s => esc(s).replace(/\[(CONFERIR[^\]]*)\]/gi, '<mark class="conf">[$1]</mark>').replace(/\[(PREENCHER[^\]]*)\]/gi, '<mark class="pre">[$1]</mark>');

  /* ---------- chrome (nav) ---------- */
  function counts() {
    const c = { virais: st.virais.length, ganchos: N.GANCHOS.length, temas: E.todosTemas().length + '/60', formatos: N.FORMATOS.length, biblioteca: st.scripts.length };
    Object.keys(X.views).forEach(id => { const xv = X.views[id]; if (xv && typeof xv.count === 'function') { try { const n = xv.count(); if (n != null && n !== '') c[id] = n; } catch (e) { } } });
    return c;
  }
  function sprintHTML() {
    const p = st.profile;
    const seg = Number(p.seguidores) || 0, meta = Number(p.metaSeguidores) || 0;
    let math = '';
    if (meta && p.metaData) {
      const dias = Math.ceil((Date.parse(p.metaData + 'T23:59:59') - Date.now()) / 86400000);
      const falta = Math.max(0, meta - seg);
      if (falta === 0) math = 'Meta batida. Hora de subir a régua.';
      else if (dias > 0) math = `Faltam ${E.fmtN(falta)} em ${dias} dia${dias > 1 ? 's' : ''}: ≈ ${E.fmtN(Math.ceil(falta / dias))} por dia.`;
      else math = `Prazo encerrado com ${E.fmtN(falta)} a menos. Redefina a meta no Perfil.`;
    }
    return `<div class="sprint">
      <div class="who"><div class="avatar">${esc(initials())}</div><div style="min-width:0"><div class="h">${esc(p.handle || p.nome || 'Seu perfil')}</div><div class="eyebrow" style="letter-spacing:.08em">${meta ? 'Sprint de seguidores' : 'Perfil'}</div></div></div>
      ${meta ? `<div class="bar"><i style="width:${Math.min(100, seg / meta * 100).toFixed(1)}%"></i></div>
      <div class="nums"><span>${E.fmtN(seg)}</span><span>${E.fmtN(meta)}</span></div>
      <div class="math">${esc(math)}</div>` : `<div class="math" style="margin-top:10px">Defina uma meta de seguidores no Perfil pra ver a conta do sprint.</div>`}
    </div>`;
  }
  function statusTags() {
    const store = ui.store === 'nuvem' ? `<span class="tag good">${ic('cloud', 'sm')} Salvo na sua conta</span>` : `<span class="tag">${ic('device', 'sm')} Salvo neste navegador</span>`;
    const ai = ui.ai === 'on' ? `<span class="tag amber">${ic('spark', 'sm')} IA ativa</span>` : ui.ai === 'wait' ? '<span class="tag">Conectando…</span>' : `<span class="tag warn">${ic('alert', 'sm')} IA indisponível</span>`;
    return store + ai;
  }
  function renderChrome() {
    const c = counts();
    const nav = VIEWS.map(([id, nome]) => `<button type="button" data-a="nav" data-v="${id}" ${ui.view === id ? 'aria-current="page"' : ''}>${ic(id)}<span>${nome}</span>${c[id] != null ? `<span class="count">${c[id]}</span>` : ''}</button>`).join('');
    $('#side').innerHTML = `
      <div class="brand"><div class="brand-mark">${SAW}</div><div class="brand-name">Narrador<small>de impacto</small></div></div>
      <nav class="nav" aria-label="Seções">${nav}</nav>
      <div class="side-foot">${sprintHTML()}<div class="status-row">${statusTags()}</div></div>`;
    $('#topbar').innerHTML = `<div class="brand-mark">${SAW}</div><div class="brand-name">Narrador<small>de impacto</small></div><div class="grow"></div><div class="avatar" title="${esc(st.profile.handle)}">${esc(initials())}</div>`;
    $('#tabbar').innerHTML = VIEWS.map(([id, nome]) => `<button type="button" data-a="nav" data-v="${id}" ${ui.view === id ? 'aria-current="page"' : ''}>${ic(id)}<span>${nome}</span></button>`).join('');
  }

  function render() {
    renderChrome();
    const m = $('#main');
    const xv = X.views[ui.view] && viewOk(ui.view) ? X.views[ui.view] : null;
    const fn = { estudio: vEstudio, virais: vVirais, ganchos: vGanchos, temas: vTemas, formatos: vFormatos, biblioteca: vBiblioteca, perfil: vPerfil }[ui.view] || (xv ? () => xv.render() : vEstudio);
    m.innerHTML = fn();
    if (ui.view === 'estudio') renderOut();
    if (xv && typeof xv.mount === 'function') { try { xv.mount(m); } catch (e) { console.error(e); } }
    renderModal();
  }
  function go(v) {
    ui.view = v;
    try { localStorage.setItem('ndi:view', v); } catch (e) { }
    render();
    window.scrollTo(0, 0);
  }

  /* =================================================================
     ESTÚDIO
     ================================================================= */

  /* ---------- recomendações: o que funciona pra este perfil ---------- */
  function recHTML(compact) {
    const R = E.recomendar(st);
    const head = `<div class="rec-h">${ic('trend')}<b>${compact ? 'Recomendado pra você' : 'O que o app está aprendendo'}</b>${R.geral != null ? `<span class="tag mono">média do perfil ${R.geral}</span>` : ''}</div>`;
    if (!R.comNum) return `<div class="card rec">${head}<p class="faint">Salve os roteiros, poste e registre os números de cada Reel na Biblioteca. A partir do primeiro vídeo com números, o app ranqueia os seus ganchos e formatos e passa a sugerir ganchos parecidos com os que deram certo.</p><button class="btn sm" data-a="nav" data-v="biblioteca">${ic('biblioteca', 'sm')} Ir pra Biblioteca</button></div>`;
    const topL = R.top.slice(0, compact ? 2 : 5).map(t => { const g = E.gancho(t.id); return `<div class="rec-row"><span class="num">#${g.id}</span><span>“${esc(g.texto)}”<small>${esc(catName(g.cat))} · ${t.n} vídeo${t.n > 1 ? 's' : ''}</small></span><span class="tag good">score ${t.media}</span></div>`; }).join('');
    const par = R.parecidos.slice(0, compact ? 3 : 6).map(p => { const g = E.gancho(p.id); return `<div class="rec-row"><span class="num">#${g.id}</span><span>“${esc(g.texto)}”<small>${esc(p.porque)} ${E.formato(p.formatoId) ? 'Formato: ' + esc(fmtName(p.formatoId)) + '.' : ''}</small></span><button class="btn xs" data-a="usar-rec" data-g="${g.id}" data-f="${esc(p.formatoId || '')}">Testar ${ic('arrow', 'sm')}</button></div>`; }).join('');
    const fm = R.fmts.slice(0, 4).map(f => `<span class="tag ${f.validado ? 'good' : f.media >= R.corte ? 'amber' : ''}">${esc(fmtName(f.id))} ${f.media}${f.validado ? ' · validado' : ` · ${f.n}/3 vídeos`}</span>`).join('');
    const semGancho = !R.top.length && !R.cats.length;
    return `<div class="card rec">${head}
      ${topL ? `<div class="eyebrow">Ganchos que funcionaram</div><div class="rec-list">${topL}</div>` : ''}
      ${par ? `<div class="eyebrow">Parecidos pra testar agora</div><div class="rec-list">${par}</div>` : ''}
      ${semGancho ? `<p class="faint" style="margin:0">Já tem ${R.comNum} vídeo${R.comNum > 1 ? 's' : ''} com números, mas sem o gancho registrado. Abra o vídeo na Biblioteca e preencha "Gancho usado (#)" pra liberar as sugestões de ganchos parecidos.</p>` : ''}
      ${fm ? `<div class="eyebrow">Formatos no seu perfil</div><div class="rates">${fm}</div><p class="faint" style="margin:0; font-size:12px">Validado = 3 vídeos ou mais com score na média do perfil ou acima.</p>` : ''}
    </div>`;
  }

  function vEstudio() {
    const sd = ui.studio;
    const banner = (st.meta.preset === 'serrano' && !st.meta.persisted) ? `<div class="banner">
      ${ic('bulb')}<p><b>Perfil do Serrano carregado</b> com o DNA, os fatos conferidos e as lições do Outlier #01. É o seu? Confirme e tudo passa a ser salvo. Outro criador começa do zero.</p>
      <button class="btn sm primary" data-a="confirmar-perfil">É o meu perfil</button>
      <button class="btn sm" data-a="novo-perfil">Sou outro criador</button></div>` : '';
    const aiOff = ui.ai === 'off' ? `<div class="banner info">${ic('alert')}<p>A geração com IA só funciona com este app aberto no Claude. Aqui você ainda monta a combinação e copia o prompt completo pra colar numa conversa.</p></div>` : '';
    return `${banner}${aiOff}
    <div class="vh">
      <div><div class="eyebrow">Estúdio · take ${pad2(takeNum())}</div>
      <h1>Sua ideia. Seu gancho.<br><em>Roteiro pronto.</em></h1>
      <p>Escreva a ideia do vídeo e o gancho do seu jeito: a IA só refina o que precisar pra prender. Tema do banco é opcional e os ${N.FORMATOS.length} formatos seguem à disposição. Quer pensar junto? Use "Montar juntos".</p></div>
      <div class="seg" role="group" aria-label="Modo">
        ${[['criar', 'Criar roteiro'], ['juntos', 'Montar juntos'], ['revisar', 'Revisar roteiro']].map(([k, l]) => `<button type="button" data-a="modo" data-m="${k}" aria-pressed="${sd.mode === k}">${l}</button>`).join('')}
      </div>
    </div>
    <div class="studio">
      <div class="studio-left" id="slate-wrap">${slateHTML()}${ui.studio.mode === 'criar' ? recHTML(true) : ''}</div>
      <section class="out" id="out" aria-label="Roteiro">
        <div class="out-bar" id="out-bar"></div>
        <div class="out-body" id="out-body" aria-live="off"></div>
      </section>
    </div>`;
  }

  function gateErr() {
    const sd = ui.studio;
    if (!sd.formatoId) return 'Escolha um formato.';
    if (!(sd.assunto || '').trim() && !sd.temaId) return 'Diga sobre o que é o vídeo (ou encaixe num tema do banco).';
    if (sd.ganchoModo === 'banco') {
      if (!sd.ganchoId) return 'Escolha um gancho do banco ou escreva o seu.';
      const g = E.gancho(sd.ganchoId);
      if (g.gate === 'fato' && !sd.fato.trim()) return 'Esse gancho só entra com fato real: escreva o fato ou troque de gancho.';
      if (g.gate === 'numero' && !sd.fonte.trim()) return 'Número em gancho só entra conferido: informe a fonte ou troque de gancho.';
      const slots = E.slotsColchete(g);
      if (slots.some((_, i) => !(sd.colchetes[i] || '').trim())) return 'Preencha o trecho entre colchetes do gancho.';
      if (sd.ganchoId === E.ultimoGancho(st)) return 'Esse foi o gancho do vídeo anterior. Nunca repita o mesmo gancho em dois vídeos seguidos.';
      return '';
    }
    if ((sd.ganchoTexto || '').trim().length < 5) return 'Escreva a ideia do seu gancho (ou escolha um do banco).';
    return '';
  }

  function slateHTML() {
    const sd = ui.studio;
    if (sd.mode === 'juntos') return juntosSlateHTML();
    if (sd.mode === 'revisar') return revisarHTML();
    const t = sd.temaId ? E.tema(sd.temaId) : null;
    const f = sd.formatoId ? E.formato(sd.formatoId) : null;
    const banco = sd.ganchoModo === 'banco';
    const g = banco && sd.ganchoId ? E.gancho(sd.ganchoId) : null;
    const comp = g && f ? E.compat(g.id, f.id) : null;
    const usoG = E.usoGancho(st), usoT = E.usoTema(st);
    const busy = ui.gen.status === 'thinking' || ui.gen.status === 'streaming';
    const err = gateErr();
    let gate = '';
    if (g) {
      const bits = [];
      const slots = E.slotsColchete(g);
      slots.forEach((sl, i) => bits.push(`<label class="field"><span>Troque [${esc(sl)}]</span><input type="text" id="col-${i}" data-bind="col.${i}" value="${esc(sd.colchetes[i] || '')}" placeholder="${esc(sl)}"></label>`));
      if (g.gate === 'fato') bits.push(`<label class="field"><span>Fato real (obrigatório)</span><textarea id="st-fato" data-bind="s.fato" rows="3" placeholder="O que aconteceu de verdade: quando, números reais, o que você aprendeu.">${esc(sd.fato)}</textarea><small>Sem fato real, a IA não inventa: troque de gancho.</small></label>`);
      else if (E.pessoal(g)) bits.push(`<label class="field"><span>Fato pessoal (opcional)</span><textarea id="st-fato" data-bind="s.fato" rows="2" placeholder="Se o gancho fala de você, conte o que é real.">${esc(sd.fato)}</textarea><small>Sem isso, o roteiro marca [PREENCHER] onde faltar dado seu.</small></label>`);
      if (g.gate === 'numero') bits.push(`<label class="field"><span>Fonte do número (obrigatória)</span><input type="text" id="st-fonte" data-bind="s.fonte" value="${esc(sd.fonte)}" placeholder="Ex.: IBGE, Cadastro Central de Empresas 2023, tabela X"></label>`);
      const titulo = g.gate === 'fato' ? 'Gancho de história ou autoridade: só entra com fato real.' : g.gate === 'numero' ? 'Número dentro de gancho só entra conferido na fonte.' : g.soft === 'numero' ? g.nota : slots.length ? 'Só o trecho entre colchetes muda. O resto fica literal.' : E.pessoal(g) ? 'O gancho fala de você.' : '';
      if (bits.length || g.soft) gate = `<div class="gatebox"><div class="gtitle">${ic('alert', 'sm')}<span>${esc(titulo)}</span></div>${bits.join('')}</div>`;
      if (g.cat === 13) gate += `<div class="compat"><span class="dot warn"></span><span>Relacionamentos fica fora do pilar principal: use só se o ângulo pedir.</span></div>`;
    } else if (!banco && E.pessoal({ texto: sd.ganchoTexto || '' })) {
      gate = `<div class="gatebox"><div class="gtitle">${ic('alert', 'sm')}<span>Seu gancho fala de você.</span></div><label class="field"><span>Fato pessoal (opcional)</span><textarea id="st-fato" data-bind="s.fato" rows="2" placeholder="Conte o que é real: quando, números, o que aconteceu.">${esc(sd.fato)}</textarea><small>Sem isso, o roteiro marca [PREENCHER] onde faltar dado seu. A IA não inventa história.</small></label></div>`;
    }
    const insp = sd.inspiracao && E.gancho(sd.inspiracao) ? `<div class="compat"><span class="dot good"></span><span>Inspiração (parecido com o que funcionou no seu perfil): “${esc(E.gancho(sd.inspiracao).texto)}” <button class="btn xs" data-a="adaptar-gancho" data-g="${sd.inspiracao}">Usar como base</button></span></div>` : '';
    const mod = sd.modelo ? `<div class="continua">${ic('virais', 'sm')}<p><b>Modelando ${esc(sd.modelo.handle || 'um viral')}${sd.modelo.titulo ? ` — “${esc(sd.modelo.titulo)}”` : ''}.</b> A estrutura e a edição dele entram no roteiro; o gancho é seu.</p><button class="btn xs ghost" data-a="limpar-modelo" aria-label="Parar de modelar">${ic('x', 'sm')}</button></div>` : '';
    const cont = sd.continua ? `<div class="continua">${ic('layers', 'sm')}<p><b>Próxima parte de “${esc(sd.continua.titulo)}”.</b> Este vídeo cumpre a promessa: ${esc(sd.continua.promessa)}</p><button class="btn xs ghost" data-a="limpar-continua" aria-label="Remover continuação">${ic('x', 'sm')}</button></div>` : '';
    const ser = sd.serie && N.SERIE ? (() => { const ep = N.SERIE.eps.find(e => e.id === sd.serie.ep); return ep ? `<div class="continua">${ic('layers', 'sm')}<p><b>Série ${esc(N.SERIE.nome)} — ${esc(ep.dia)}: ${esc(ep.titulo)}.</b> As regras da série e os dados do briefing entram no roteiro.</p><button class="btn xs ghost" data-a="limpar-serie" aria-label="Sair da série">${ic('x', 'sm')}</button></div>` : ''; })() : '';
    return `<div class="slate">
      <div class="clap" id="clap"><div class="clap-arm"></div><div class="clap-base"></div></div>
      <div class="slate-meta">
        <div><div class="eyebrow">Perfil</div><b>${esc(st.profile.handle || st.profile.nome || '—')}</b></div>
        <div><div class="eyebrow">Take</div><b class="mono" style="font-family:var(--f-disp)">${pad2(takeNum())}</b></div>
        <div><div class="eyebrow">Data</div><b>${E.hoje().slice(0, 5)}</b></div>
      </div>
      ${cont}${mod}${ser}
      <div class="slot">
        <div class="slot-h"><span class="disp">Ideia do vídeo</span></div>
        <label class="field"><span class="sr">Sobre o que é o vídeo</span><textarea id="st-assunto" data-bind="s.assunto" rows="3" placeholder="Sobre o que é o vídeo? Ex.: por que CTA com palavra-chave gera comentário mas não vira lead">${esc(sd.assunto || '')}</textarea></label>
      </div>
      <div class="slot">
        <div class="slot-h"><span class="disp">Formato</span>${f ? `<span class="tag mono">${E.duracaoAlvo(f.id).join('–')} s</span>` : ''}</div>
        ${f ? `<button type="button" class="pick" data-a="picker" data-k="formato"><span style="min-width:0"><span class="t">${esc(f.nome)}</span><span class="s" style="display:block">${esc(f.regra)}</span></span><span class="chev">${ic('chev')}</span></button>`
        : `<button type="button" class="pick empty-pick" data-a="picker" data-k="formato">${ic('plus')}<span>Escolher formato</span></button>`}
      </div>
      <div class="slot">
        <div class="slot-h"><span class="disp">Gancho</span>
          <div class="seg" role="group" aria-label="Origem do gancho"><button type="button" data-a="gancho-modo" data-m="meu" aria-pressed="${!banco}">Escrever o meu</button><button type="button" data-a="gancho-modo" data-m="banco" aria-pressed="${banco}">Do banco</button></div></div>
        ${banco
        ? (g ? `<button type="button" class="pick" data-a="picker" data-k="gancho"><span class="num">#${g.id}</span><span style="min-width:0"><span class="q">“${esc(E.textoGancho(g, sd.colchetes))}”</span><span class="s" style="display:block">${esc(catName(g.cat))}${usoG[g.id] ? ` · usado ${usoG[g.id].n}×` : ''}</span></span><span class="chev">${ic('chev')}</span></button>`
          : `<button type="button" class="pick empty-pick" data-a="picker" data-k="gancho">${ic('plus')}<span>Escolher gancho do banco</span></button>`)
        : `<label class="field"><span class="sr">A ideia do seu gancho</span><textarea id="st-gancho" data-bind="s.ganchoTexto" rows="3" placeholder="Escreva a ideia do seu gancho do seu jeito. A IA só refina se precisar pra prender nos 3 primeiros segundos.">${esc(sd.ganchoTexto || '')}</textarea><small>Se já prende, fica exatamente como você escreveu. Se precisar, o ajuste é mínimo e a IA diz o que mudou.</small></label>
          <label class="check" style="margin-top:10px"><input type="checkbox" id="st-travado" data-bind="s.ganchoTravado" ${sd.ganchoTravado ? 'checked' : ''}> Manter exatamente como escrevi</label>${insp}`}
        ${comp ? `<div class="compat"><span class="dot ${comp.nivel === 'forte' ? 'good' : comp.nivel === 'fraca' ? 'warn' : ''}"></span><span>${esc(comp.txt)}</span></div>` : ''}
        ${gate}
      </div>
      <div class="slot">
        <div class="slot-h"><span class="disp">Tema do banco</span><span class="tag">opcional</span></div>
        ${t ? `<div style="display:flex; gap:8px; align-items:stretch"><button type="button" class="pick" data-a="picker" data-k="tema" style="flex:1"><span class="num">#${pad2(t.id)}</span><span style="min-width:0"><span class="t">${esc(t.nome)}</span><span class="s" style="display:block">${esc(t.frase)}</span>${usoT[t.id] ? `<span class="s" style="display:block">Usado ${usoT[t.id].n}×</span>` : ''}</span><span class="chev">${ic('chev')}</span></button><button class="btn icon-btn ghost" data-a="limpar-tema" aria-label="Tirar o tema" title="Tirar o tema" style="height:auto">${ic('x', 'sm')}</button></div>`
        : `<button type="button" class="pick empty-pick" data-a="picker" data-k="tema">${ic('plus')}<span>Encaixar num tema do banco (se quiser)</span></button>`}
      </div>
      <details class="extras" ${sd.ancora || sd.proximo || sd.obs ? 'open' : ''}>
        <summary>${ic('chev', 'sm chev2')} Direção extra <span class="faint" style="font-weight:500">· opcional</span></summary>
        <div class="grid">
          <label class="field"><span>Assunto do dia (âncora)</span><input type="text" id="st-ancora" data-bind="s.ancora" value="${esc(sd.ancora)}" placeholder="Notícia, prazo ou caso que todo mundo está comentando"><small>Entra como ponte entre o segundo 4 e o 8, nunca no lugar do gancho. Nada de briga política.</small></label>
          <label class="field"><span>Próximo vídeo que o CTA promete</span><input type="text" id="st-proximo" data-bind="s.proximo" value="${esc(sd.proximo)}" placeholder="Em branco: a IA escolhe um próximo vídeo coerente"></label>
          <label class="field"><span>Observações pra este roteiro</span><textarea id="st-obs" data-bind="s.obs" rows="2" placeholder="Ex.: citar o caso do cliente que pagou multa (sem nome)">${esc(sd.obs)}</textarea></label>
          <label class="field"><span>Objetivo do vídeo</span><select id="st-objetivo" data-bind="s.objetivo">${(N.OBJETIVOS || []).map(o => `<option value="${o[0]}" ${(sd.objetivo || 'seguidores') === o[0] ? 'selected' : ''}>${esc(o[1])}</option>`).join('')}</select><small>Cada métrica pede um tipo de conteúdo: salvamento pede tutorial, compartilhamento pede o que a pessoa não conseguiria dizer sozinha.</small></label>
          <label class="check"><input type="checkbox" id="st-stories" data-bind="s.stories" ${sd.stories ? 'checked' : ''}> Incluir a sequência de 3 Stories</label>
        </div>
      </details>
      <div class="slate-actions">
        ${sd.why ? `<div class="why"><b>Por que essa combinação:</b> ${esc(sd.why)}</div>` : ''}
        <div class="gate-err" id="gate-err" ${err ? '' : 'hidden'}>${ic('alert', 'sm')}<span>${esc(err)}</span></div>
        ${ui.ai === 'off'
        ? `<button class="btn primary big gerar" data-a="copiar-prompt" ${err ? 'disabled' : ''} id="btn-gerar">${ic('copy')} Copiar prompt completo</button>`
        : `<button class="btn primary big gerar" data-a="gerar" ${err || busy ? 'disabled' : ''} id="btn-gerar">${ic('play')} ${busy ? 'Gravando o take…' : 'Rodar o take'}</button>`}
        <div class="row">
          <button class="btn sm" data-a="surpresa">${ic('shuffle', 'sm')} Sugestão pelo desempenho</button>
          <button class="btn sm" data-a="criar-juntos">${ic('spark', 'sm')} Montar junto</button>
          <div class="seg" role="group" aria-label="Qualidade" style="margin-left:auto">
            <button type="button" data-a="tier" data-t="complex" aria-pressed="${sd.tier === 'complex'}" title="Modelo mais capaz: pensa mais antes de escrever">Máxima</button>
            <button type="button" data-a="tier" data-t="default" aria-pressed="${sd.tier === 'default'}" title="Mais rápido">Rápida</button>
          </div>
        </div>
        ${ui.ai !== 'off' ? `<button class="btn ghost sm" data-a="copiar-prompt" ${err ? 'disabled' : ''} style="align-self:flex-start">${ic('copy', 'sm')} Copiar o prompt deste take</button>` : ''}
      </div>
    </div>`;
  }

  /* ---------- montar juntos (conversa) ---------- */
  function juntosSlateHTML() {
    const J = ui.juntos, sd = ui.studio;
    const f = sd.formatoId ? E.formato(sd.formatoId) : null;
    const iniciado = J.msgs.length > 0;
    const serie = N.SERIE;
    return `<div class="slate">
      <div class="clap" id="clap"><div class="clap-arm"></div><div class="clap-base"></div></div>
      <div class="mode-panel">
        <div><div class="eyebrow">Montar juntos</div><p class="muted" style="margin:6px 0 0; font-size:14px">Jogue a ideia do vídeo e a gente monta o roteiro em conversa: eu pergunto o que falta, sugiro ângulos, vocês escolhem e eu escrevo os blocos. Quando estiver pronto, "Fechar roteiro" gera a versão final.</p></div>
        ${iniciado ? `<div class="why"><b>Em andamento.</b> ${J.serie ? `Série ${esc(serie.nome)} — ${esc((serie.eps.find(e => e.id === J.serie.ep) || {}).dia || '')}. ` : ''}${f ? `Formato: ${esc(f.nome)}. ` : ''}${J.msgs.filter(m => m.role === 'user').length} mensagem(ns) sua(s).</div>
        <button class="btn" data-a="jt-recomecar">${ic('x', 'sm')} Recomeçar do zero</button>`
        : `<label class="field"><span>Sua ideia de vídeo</span><textarea id="jt-ideia" data-bind="jtideia" rows="5" placeholder="Jogue a ideia solta, do jeito que vier. Ex.: quero um vídeo mostrando que quem copia gancho viral e esquece o CTA ganha view e não ganha lead.">${esc(J.ideia)}</textarea></label>
        <div class="slot" style="padding:0; border:0"><div class="slot-h"><span class="disp">Formato</span><span class="tag">opcional</span></div>
          ${f ? `<button type="button" class="pick" data-a="picker" data-k="formato"><span style="min-width:0"><span class="t">${esc(f.nome)}</span><span class="s" style="display:block">${esc(f.regra)}</span></span><span class="chev">${ic('chev')}</span></button>`
          : `<button type="button" class="pick empty-pick" data-a="picker" data-k="formato">${ic('plus')}<span>Escolher formato (ou deixe a IA sugerir)</span></button>`}</div>
        <button class="btn primary big" data-a="jt-start" ${ui.ai !== 'on' || J.ideia.trim().length < 8 ? 'disabled' : ''}>${ic('play')} Começar a montar</button>
        ${ui.ai !== 'on' ? `<div class="gate-err">${ic('alert', 'sm')}<span>A conversa precisa da IA ativa (abra no Claude).</span></div>` : ''}
        ${serie ? `<div class="series"><div class="eyebrow">Série pronta · ${esc(serie.nome)}</div><p class="faint" style="margin:4px 0 10px; font-size:13px">${esc(serie.sub)}</p>
          <div class="serie-eps">${serie.eps.map(e => `<button class="serie-ep" data-a="jt-serie" data-ep="${e.id}"><b>${esc(e.dia)}</b><span>${esc(e.titulo)}</span></button>`).join('')}</div></div>` : ''}`}
      </div>
    </div>`;
  }
  function chatMsgsHTML() {
    const J = ui.juntos;
    if (!J.msgs.length) return '';
    return J.msgs.map((m, i) => `<div class="msg ${m.role}${J.status === 'busy' && i === J.msgs.length - 1 && m.role === 'assistant' ? ' live' : ''}"><div class="who">${m.role === 'user' ? 'Você' : 'Narrador'}</div><div class="txt">${m.content ? hl(m.content) : '<span class="faint">pensando…</span>'}</div></div>`).join('');
  }
  function juntosOutHTML() {
    const J = ui.juntos;
    if (!J.msgs.length) return `<div class="empty">Escreva a ideia ao lado e clique em "Começar a montar". A conversa aparece aqui.</div>`;
    return `<div class="chat" id="chat"><div class="chat-msgs" id="chat-msgs">${chatMsgsHTML()}</div>
      ${J.err ? `<div class="errnote">${ic('alert', 'sm')}<span>${esc(J.err)}</span></div>` : ''}
      <div class="composer"><textarea id="jt-draft" data-bind="jtdraft" rows="2" placeholder="Responda, escolha uma opção, peça um bloco de fala... (Ctrl+Enter envia)">${esc(J.draft)}</textarea>
        <button class="btn primary" data-a="jt-enviar" id="jt-send" ${J.status === 'busy' ? 'disabled' : ''}>${ic('arrow', 'sm')} Enviar</button></div></div>`;
  }
  function renderChatMsgs() {
    const el = $('#chat-msgs'); if (!el) return;
    el.innerHTML = chatMsgsHTML();
    el.scrollTop = el.scrollHeight;
    const o = $('#out-body'); if (o) o.scrollTop = o.scrollHeight;
  }

  function ideiaHTML() {
    const I = ui.ideia;
    const busy = I.status === 'busy';
    let res = '';
    if (I.res) {
      res = `${I.res.correcao ? `<div class="why"><b>${I.res.dentroDoBanco ? 'Dentro do banco.' : 'Fora dos temas do banco.'}</b> ${esc(I.res.correcao)}</div>` : ''}
      <div class="ideas">${I.res.opcoes.map((o, i) => {
        const t = E.tema(o.tema), g = E.gancho(o.gancho), f = E.formato(o.formato);
        return `<div class="idea">
          <div class="top"><span class="tag mono">Tema #${pad2(t.id)}</span><span class="tag"><span class="pdot" style="--pc:${pilarColor(t.pilar)}"></span>${esc(E.pilar(t.pilar).nome)}</span>${f ? `<span class="tag amber">${esc(f.nome)}</span>` : ''}</div>
          <h4>${esc(t.nome)}</h4>
          <div class="muted" style="font-size:14px">${esc(o.encaixe || '')}</div>
          ${g ? `<q>${esc(g.texto)}</q><div class="faint" style="font-size:12.5px">#${g.id} · ${esc(catName(g.cat))}${o.porque ? ' — ' + esc(o.porque) : ''}</div>` : ''}
          <div style="margin-top:12px"><button class="btn sm primary" data-a="usar-ideia" data-i="${i}">${ic('arrow', 'sm')} Usar esta combinação</button></div>
        </div>`;
      }).join('')}</div>`;
    }
    return `<div class="slate">
      <div class="clap" id="clap"><div class="clap-arm"></div><div class="clap-base"></div></div>
      <div class="mode-panel">
        <div><div class="eyebrow">Ideia solta</div><p class="muted" style="margin:6px 0 0; font-size:14px">Ideia fora do banco não vira roteiro direto. A IA mostra 3 temas do banco em que ela se encaixa, com gancho e formato. Você escolhe.</p></div>
        <label class="field"><span>Sua ideia</span><textarea id="ideia-texto" data-bind="ideia" rows="4" placeholder="Ex.: a inteligência artificial vai acabar com os advogados">${esc(I.texto)}</textarea></label>
        <button class="btn primary" data-a="ideia" ${busy || ui.ai !== 'on' ? 'disabled' : ''}>${ic('spark')} ${busy ? 'Enquadrando no banco…' : 'Enquadrar no banco'}</button>
        ${ui.ai === 'off' ? '<div class="gate-err">' + ic('alert', 'sm') + '<span>Precisa da IA ativa (abra no Claude).</span></div>' : ''}
        ${I.err ? `<div class="errnote">${ic('alert', 'sm')}<span>${esc(I.err)}</span></div>` : ''}
        ${res}
      </div>
    </div>`;
  }

  function revisarHTML() {
    const R = ui.revisar;
    const seg = `<div class="seg" role="group" aria-label="O que revisar" style="align-self:flex-start">${[['roteiro', 'Roteiro completo'], ['gancho', 'Só o gancho'], ['cta', 'Só o CTA']].map(([k, l]) => `<button type="button" data-a="rev-modo" data-m="${k}" aria-pressed="${R.modo === k}">${l}</button>`).join('')}</div>`;
    const inner = R.modo === 'gancho' ? ganchoRevHTML() : R.modo === 'cta' ? ctaRevHTML() : roteiroRevHTML();
    return `<div class="slate">
      <div class="clap" id="clap"><div class="clap-arm"></div><div class="clap-base"></div></div>
      <div class="mode-panel">
        <div><div class="eyebrow">Revisar e melhorar</div><p class="muted" style="margin:6px 0 0; font-size:14px">Cole o que você já tem — um roteiro inteiro, só o gancho ou só o CTA — e a IA aplica o banco e o Manual do viral pra deixar mais forte.</p></div>
        ${seg}
        ${inner}
      </div>
    </div>`;
  }
  function roteiroRevHTML() {
    const busy = ui.gen.status === 'thinking' || ui.gen.status === 'streaming';
    return `<p class="muted" style="margin:0; font-size:13.5px">Confere título proibido, gancho literal, tema do banco, fatos, CTA único, 4 atos e duração; lista as correções e entrega a versão pronta.</p>
      <label class="field"><span>Roteiro</span><textarea id="rev-texto" data-bind="revisar" rows="12" placeholder="Cole aqui o roteiro completo">${esc(ui.revisar.texto)}</textarea></label>
      <button class="btn primary" data-a="revisar" ${busy || ui.ai !== 'on' ? 'disabled' : ''}>${ic('check')} ${busy ? 'Revisando…' : 'Revisar e reescrever'}</button>
      ${ui.ai === 'off' ? '<div class="gate-err">' + ic('alert', 'sm') + '<span>Precisa da IA ativa (abra no Claude).</span></div>' : ''}`;
  }
  function ganchoRevHTML() {
    const R = ui.revisar, busy = R.statusG === 'busy', A = R.resGancho;
    const barra = (lbl, v) => `<div class="brow" style="grid-template-columns:100px minmax(0,1fr) 34px"><span class="lbl">${lbl}</span><span class="track"><i style="width:${(v || 0) * 10}%"></i></span><span class="val">${v}</span></div>`;
    let res = '';
    if (A) {
      const d = A.diagnostico || {};
      const manter = A.veredito === 'manter';
      res = `<div class="analysis" style="margin-top:14px">
        <div class="decision"><b>${manter ? 'Mantenha como está' : 'Vale refinar'}</b>${esc(d.resumo || '')}</div>
        <div class="bars">${barra('Dor universal', d.dorUniversal)}${barra('Surpresa', d.surpresa)}${barra('Promessa', d.promessaClareza)}${barra('Impacto', d.impactoEmocional)}</div>
        ${(A.erros || []).length ? `<div><h5>Erros de abertura</h5><ul class="list warnlist">${A.erros.map(e => `<li>${esc(e)}</li>`).join('')}</ul></div>` : ''}
        <div><h5>${manter ? 'O seu gancho já prende' : 'Gancho refinado (ajuste mínimo)'}</h5>
          <div class="idea idea-best"><q>${esc(A.refinado)}</q><p class="faint" style="margin:6px 0 0; font-size:13.5px">${esc(A.mudou || '')}</p>
          <div class="toolbar" style="margin-top:12px"><button class="btn sm primary" data-a="usar-gancho-texto" data-txt="${esc(A.refinado)}">${ic('estudio', 'sm')} Usar no Estúdio</button><button class="btn sm" data-a="copiar-txt" data-txt="${esc(A.refinado)}">${ic('copy', 'sm')} Copiar</button></div></div></div>
        ${(A.alternativas || []).length ? `<div><h5>Outras versões do mesmo gancho</h5><div class="ideas">${A.alternativas.map(s => `<div class="idea"><div style="display:flex; gap:6px; margin-bottom:6px"><span class="tag amber">${esc(s.enfase || 'versão')}</span></div><q>${esc(s.texto)}</q><p class="faint" style="margin:6px 0 0; font-size:13.5px">${esc(s.porque || '')}</p><div class="toolbar" style="margin-top:12px"><button class="btn sm" data-a="usar-gancho-texto" data-txt="${esc(s.texto)}">${ic('estudio', 'sm')} Usar no Estúdio</button><button class="btn sm" data-a="copiar-txt" data-txt="${esc(s.texto)}">${ic('copy', 'sm')} Copiar</button></div></div>`).join('')}</div></div>` : ''}
        ${A.abertura ? `<div><h5>Como abrir com o gancho final</h5><div class="nextcard" style="flex-direction:column; align-items:flex-start; gap:6px"><p style="margin:0"><b>Frame 0:</b> ${esc(A.abertura.visual || '')}</p><p style="margin:0"><b>Na tela:</b> ${esc(A.abertura.tela || '')}</p><p style="margin:0">“${esc(A.abertura.f03 || '')}”</p><p style="margin:0">“${esc(A.abertura.f37 || '')}”</p></div></div>` : ''}
      </div>`;
    }
    return `<p class="muted" style="margin:0; font-size:13.5px">Cole o gancho que você escreveu. A IA mede os 4 pilares e diz se já prende. Se prender, você mantém; se não, ela refina com ajuste mínimo, sem trocar a sua ideia.</p>
      <label class="field"><span>Seu gancho</span><textarea id="rev-gancho" data-bind="revg" rows="4" placeholder='Ex.: "Hoje eu vou te contar um segredo sobre imposto que ninguém sabe..."'>${esc(R.gancho)}</textarea></label>
      <button class="btn primary" data-a="melhorar-gancho" ${busy || ui.ai !== 'on' || !R.gancho.trim() ? 'disabled' : ''}>${ic('spark')} ${busy ? 'Analisando o gancho…' : 'Ver se prende / refinar'}</button>
      ${ui.ai === 'off' ? '<div class="gate-err">' + ic('alert', 'sm') + '<span>Precisa da IA ativa (abra no Claude).</span></div>' : ''}
      ${R.errG ? `<div class="errnote">${ic('alert', 'sm')}<span>${esc(R.errG)}</span></div>` : ''}
      ${res}`;
  }

  function ctaRevHTML() {
    const R = ui.revisar, busy = R.statusC === 'busy', A = R.resCta;
    let res = '';
    if (A) {
      res = `<div class="analysis" style="margin-top:14px">
        ${(A.diagnostico || []).length ? `<div><h5>O que está fraco</h5><ul class="list warnlist">${A.diagnostico.map(d => `<li>${esc(d)}</li>`).join('')}</ul></div>` : ''}
        <div><h5>CTAs prontos pra usar</h5><div class="ideas">${(A.sugestoes || []).map((s, i) => `<div class="idea">
          <div class="faint" style="font-size:12.5px; margin-bottom:4px">Próximo vídeo: ${esc(s.proximoVideo || '')}</div>
          <q>${esc(s.fala || '')}</q>
          <p style="margin:8px 0 0; font-size:14px"><b>Legenda:</b> ${esc(s.legenda || '')}</p>
          <p class="faint" style="margin:6px 0 0; font-size:13.5px">${esc(s.porque || '')}</p>
          <div class="toolbar" style="margin-top:12px"><button class="btn xs" data-a="copiar-txt" data-txt="${esc(s.fala || '')}">${ic('copy', 'sm')} Copiar fala</button><button class="btn xs" data-a="copiar-txt" data-txt="${esc(s.legenda || '')}">${ic('copy', 'sm')} Copiar legenda</button></div>
        </div>`).join('')}</div></div>
      </div>`;
    }
    return `<p class="muted" style="margin:0; font-size:13.5px">Cole o CTA que você já usa (a fala do fim do vídeo e/ou a linha da legenda). A IA aplica o método "CTA do próximo problema": a pessoa não segue porque foi pedido, segue porque recebeu um motivo específico.</p>
      <label class="field"><span>CTA atual</span><textarea id="rev-cta" data-bind="revc" rows="3" placeholder="Ex.: Segue pra mais dicas de direito.">${esc(R.cta)}</textarea></label>
      <button class="btn primary" data-a="melhorar-cta" ${busy || ui.ai !== 'on' || !R.cta.trim() ? 'disabled' : ''}>${ic('spark')} ${busy ? 'Reescrevendo o CTA…' : 'Melhorar CTA'}</button>
      ${ui.ai === 'off' ? '<div class="gate-err">' + ic('alert', 'sm') + '<span>Precisa da IA ativa (abra no Claude).</span></div>' : ''}
      ${R.errC ? `<div class="errnote">${ic('alert', 'sm')}<span>${esc(R.errC)}</span></div>` : ''}
      ${res}`;
  }

  function renderSlate() { const w = $('#slate-wrap'); if (w) w.innerHTML = slateHTML() + (ui.studio.mode === 'criar' ? recHTML(true) : ''); }
  function updateGate() {
    const err = gateErr();
    const el = $('#gate-err'); if (!el) return;
    el.hidden = !err; el.querySelector('span').textContent = err;
    const b = $('#btn-gerar'); if (b) b.disabled = !!err || ui.gen.status === 'thinking' || ui.gen.status === 'streaming';
    document.querySelectorAll('[data-a="copiar-prompt"]').forEach(x => x.disabled = !!err);
  }

  /* ---------- saída ---------- */
  const TIPS = [
    '2 segundos de silêncio antes da primeira frase: é a quebra de padrão mais forte que existe.',
    'Efeito na vida, não o assunto. Se alguém de fora do nicho perguntar "e daí?", está errado.',
    'Diga cedo quem não precisa assistir. Dispensar metade faz a outra metade travar.',
    'Um MAS e um PORTANTO. Nunca "e então".',
    'Nenhum plano passa de 2,5 segundos sem alguma mudança.',
    'A legenda complementa o vídeo, nunca resume.',
    'Um CTA só. Nada de "segue, salva e compartilha".',
    'Todo Reel vai pros Stories na primeira hora.',
    'Teste da mãe: ela entenderia, e veria por que isso importa pra ela?',
    'A frase-chiclete é a que gera compartilhamento.',
    'Última linha primeiro: o fim conversa com o começo pra esconder o corte do loop.'
  ];
  let timer = 0;
  function startTimer() {
    stopTimer();
    timer = setInterval(() => {
      const el = $('#gen-elapsed'); if (!el) return;
      const s = Math.floor((Date.now() - ui.gen.t0) / 1000);
      el.textContent = pad2(Math.floor(s / 60)) + ':' + pad2(s % 60);
      const tip = $('#gen-tip'); if (tip && s % 7 === 0) tip.textContent = 'Enquanto isso: ' + TIPS[(s / 7) % TIPS.length | 0];
    }, 1000);
  }
  function stopTimer() { clearInterval(timer); timer = 0; }
  let outRaf = 0;
  const scheduleOut = () => { if (!outRaf) outRaf = requestAnimationFrame(() => { outRaf = 0; renderOutBody(); }); };

  function editorHTML(text, id, bindKey, autofocus) {
    return `<p class="muted" style="margin:0 0 12px; font-size:13.5px">Edite o texto livremente. Mantenha as linhas que começam com <code class="mono">@@</code> (elas marcam cada parte: gancho, legenda, dicas de edição...) pra o roteiro continuar sendo lido certinho depois.</p>
      <textarea id="${id}" data-bind="${bindKey}" class="raw-editor" spellcheck="false" ${autofocus ? 'data-autofocus' : ''}>${esc(text)}</textarea>`;
  }
  const emChat = () => ui.studio.mode === 'juntos' && ui.juntos.fase === 'chat';
  function chatBarHTML() {
    const J = ui.juntos, n = J.msgs.filter(m => m.role === 'user').length;
    return `<span class="tag amber">${ic('spark', 'sm')} Montando juntos</span><span class="grow"></span>
      ${J.status === 'busy' ? `<button class="btn sm" data-a="jt-parar">${ic('stop', 'sm')} Parar</button>` : ''}
      <button class="btn sm primary" data-a="jt-fechar" ${J.status === 'busy' || n < 1 || ui.ai !== 'on' ? 'disabled' : ''}>${ic('check', 'sm')} Fechar roteiro</button>`;
  }
  function outBarHTML() {
    if (emChat()) return chatBarHTML();
    const G = ui.gen;
    const busy = G.status === 'thinking' || G.status === 'streaming';
    if (busy) return `<span class="tag amber">${ic('spark', 'sm')} ${G.status === 'thinking' ? 'Claude está pensando' : 'Escrevendo'}</span><span class="grow"></span><button class="btn sm" data-a="parar">${ic('stop', 'sm')} Parar</button>`;
    if (!G.raw) return `<span class="faint" style="font-size:13.5px">O roteiro aparece aqui.</span>`;
    if (G.editing) return `<span class="tag amber">${ic('edit', 'sm')} Editando</span><span class="grow"></span><button class="btn sm ghost" data-a="cancelar-edicao">${ic('x', 'sm')} Cancelar</button><button class="btn sm primary" data-a="salvar-edicao">${ic('check', 'sm')} Salvar edição</button>`;
    const s = G.scriptId ? scriptById(G.scriptId) : null;
    return `${G.exemplo ? '<span class="tag amber">Exemplo de entrega perfeita</span>' : s ? `<span class="tag good">${ic('check', 'sm')} Salvo em Meus roteiros</span>` : ''}
      <span class="grow"></span>
      ${s && !G.exemplo ? `<button class="btn sm primary" data-a="registrar-desempenho">${ic('trend', 'sm')} Registrar desempenho</button>` : ''}
      ${ui.studio.mode === 'juntos' && ui.juntos.msgs.length ? `<button class="btn sm" data-a="jt-voltar">${ic('chev', 'sm')} Voltar à conversa</button>` : ''}
      ${!G.exemplo ? `<button class="btn sm" data-a="editar-roteiro">${ic('edit', 'sm')} Editar</button>` : ''}
      <button class="btn sm" data-a="prompter">${ic('scroll', 'sm')} Teleprompter</button>
      <button class="btn sm" data-a="copiar-fala">${ic('copy', 'sm')} Fala</button>
      <button class="btn sm" data-a="copiar-tudo">${ic('copy', 'sm')} Tudo</button>
      ${!G.exemplo && G.kind !== 'ideia' && ui.ai === 'on' ? `<button class="btn sm" data-a="abrir-ajuste">${ic('spark', 'sm')} Ajustar com IA</button>` : ''}`;
  }

  function renderOut() {
    const bar = $('#out-bar'); if (!bar) return;
    bar.innerHTML = outBarHTML();
    renderOutBody();
  }

  function renderOutBody() {
    const body = $('#out-body'); if (!body) return;
    if (emChat()) { body.innerHTML = juntosOutHTML(); const el = $('#chat-msgs'); if (el) el.scrollTop = el.scrollHeight; return; }
    const G = ui.gen;
    if (G.status === 'thinking') {
      const s = Math.floor((Date.now() - G.t0) / 1000);
      body.innerHTML = `<div class="thinking">
        <div class="eyebrow">Take ${pad2(takeNum())} · ${G.kind === 'revisar' ? 'revisão' : G.kind === 'ajuste' ? 'ajuste' : 'roteiro'}</div>
        <div class="tcbig" id="gen-elapsed">${pad2(Math.floor(s / 60))}:${pad2(s % 60)}</div>
        <div class="scan"></div>
        <div class="tip" id="gen-tip">Claude lê o DNA do perfil, o banco e as lições antes de escrever. No modo Máxima isso leva de 20 segundos a 2 minutos.</div>
      </div>`;
      return;
    }
    if (G.editing) { body.innerHTML = editorHTML(G.editDraft, 'edit-roteiro', 'editroteiro'); return; }
    let html = roteiroHTML(G.raw, G.ctx, { streaming: G.status === 'streaming', checks: G.status === 'done' || G.exemplo, where: 'out' });
    if (G.err) html += `<div class="errnote ${G.errKind === 'warn' ? 'warn' : ''}">${ic('alert', 'sm')}<span>${esc(G.err)}</span></div>`;
    if (G.truncated) html += `<div class="errnote warn">${ic('alert', 'sm')}<span>A resposta foi cortada no limite de tamanho. Use "Ajustar" pedindo uma versão mais enxuta.</span></div>`;
    body.innerHTML = html;
  }

  function parseTempo(t) { const m = String(t || '').match(/(\d+)\s*[–\-a]+\s*(\d+)/); return m ? [Number(m[1]), Number(m[2])] : null; }

  function roteiroHTML(raw, ctx, opt) {
    ctx = ctx || {};
    const P = E.parse(raw);
    const streaming = opt.streaming;
    const ids = E.cabecalhoIds(P);
    const fid = ctx.formatoId || (P.FORMATO ? (P.FORMATO.match(/[a-z]+/) || [])[0] : null);
    const parts = [];
    if (P.CORRECOES != null) parts.push(`<div class="blk" style="padding-top:0; margin-bottom:22px"><div class="blk-h"><h3>Correções</h3></div><ul class="list corr">${E.linhas(P.CORRECOES).map(l => `<li>${hl(l.replace(/^[-•*]\s*/, ''))}</li>`).join('')}</ul></div>`);
    if (P.CABECALHO) {
      const h = esc(P.CABECALHO.trim()).replace(/(Tema\s*#\s*\d+|Gancho\s*#\s*\d+)/g, '<b>$1</b>');
      parts.push(`<div class="headline">${h}${E.formato(fid) ? ` · <b>${esc(fmtName(fid))}</b>` : ''}</div>`);
    }
    if (opt.checks && P.ATO1) {
      const ch = E.checar(st, raw, Object.assign({}, ctx, { formatoId: fid, temaId: ctx.temaId || ids.temaId, ganchoId: ctx.ganchoId || ids.ganchoId }));
      const oks = ch.itens.filter(c => c.nivel === 'ok'), probs = ch.itens.filter(c => c.nivel !== 'ok');
      const podeCorrigir = opt.where === 'out' && !streaming && !ui.gen.exemplo && ui.gen.scriptId && ui.ai === 'on';
      parts.push(`${probs.length ? `<div class="fixbox"><div class="fixbox-h">${ic('alert', 'sm')}<b>${probs.length} ponto${probs.length > 1 ? 's' : ''} pra ajustar</b>${podeCorrigir ? `<button class="btn sm primary" data-a="corrigir-tudo">${ic('spark', 'sm')} Corrigir ${probs.length > 1 ? 'todos' : ''} com IA</button>` : ''}</div>
        <ul class="fixlist">${probs.map(c => `<li class="${c.nivel}"><b>${esc(c.txt)}</b>${c.fix ? `<span>Como resolver: ${hl(c.fix)}</span>` : ''}</li>`).join('')}</ul></div>` : ''}
        <div class="checks">${oks.map(c => `<span class="tag good">${ic('check', 'sm')}${esc(c.txt)}</span>`).join('')}</div>`);
    }
    // hero
    const f1 = E.linhas(P.ATO1).map(l => E.fala(l).texto)[0] || '';
    const hasHero = P.TARJA != null || P.ATO1 != null || P.PILARES != null;
    if (hasHero) {
      const tempos = ['ATO1', 'ATO2', 'ATO3', 'ATO4'].map((k, i) => parseTempo(P._tempos[k]) || [[0, 4], [4, 22], [22, 38], [38, 45]][i]);
      const total = Math.max(1, tempos[3][1] - tempos[0][0]);
      const alts = E.alternativosTodos(P);
      parts.push(`<div class="hero">
        <div class="phone" aria-label="Prévia do frame 0">
          <div class="rec"></div>
          ${P.TARJA ? `<div class="tarja">${esc(P.TARJA.trim())}</div>` : ''}
          ${fid === 'lista' ? '<div class="num1">1</div>' : ''}
          <div class="ph-hook"><span>${esc(f1 || '…')}</span></div>
          <div class="handle"><span>${esc(st.profile.handle || '')}</span><span>0:00</span></div>
        </div>
        <div class="hero-meta">
          ${P.PILARES ? `<div class="kv"><div class="eyebrow">Pilares do gancho</div><p>${hl(P.PILARES.trim())}</p></div>` : ''}
          ${P.ATO4 != null || !streaming ? `<div class="kv"><div class="eyebrow">Linha do tempo · ${tempos[3][1]} s</div>
            <div class="timeline">${tempos.map(t => `<i style="flex:${Math.max(1, t[1] - t[0]) / total}"></i>`).join('')}</div>
            <div class="tl-labels">${tempos.map((t, i) => `<span style="flex:${Math.max(1, t[1] - t[0]) / total}">${['Gancho', 'Problema', 'Solução', 'CTA'][i]}</span>`).join('')}</div></div>` : ''}
          ${alts.length ? `<div class="kv"><div class="eyebrow">Versões alternativas do gancho</div><div class="alts">${alts.map((a, ai) => `<div class="alt"><span class="num">${a.id ? '#' + a.id : 'v' + (ai + 1)}</span><span>“${esc(a.texto)}”</span>${opt.where === 'out' && !streaming && ui.ai === 'on' && ui.gen.scriptId ? `<button class="btn xs" data-a="usar-alt" data-i="${ai}" title="Trocar o Ato 1 por esta versão">Usar</button>` : ''}</div>`).join('')}</div></div>` : ''}
        </div>
      </div>`);
    }
    // contrato de valor: por que este vídeo transforma e por que seguir faz sentido
    const VL = E.valor(P);
    if (VL && (VL.campos.length || VL.notas.length)) {
      parts.push(`<div class="blk" style="padding-top:0; margin-bottom:24px"><div class="blk-h"><h3>Valor que transforma</h3>${VL.min != null ? `<span class="tag ${VL.min >= 8 ? 'good' : 'warn'} mono">menor nota ${VL.min}/10</span>` : ''}</div>
        <div class="valor">${VL.campos.map(c => `<div class="vrow ${/seguir/i.test(c.k) ? 'seg' : ''}"><span class="k">${esc(c.k)}</span><p>${hl(c.v)}</p></div>`).join('')}</div>
        ${VL.notas.length ? `<div class="rates" style="margin-top:12px">${VL.notas.map(n => `<span class="tag ${n.v >= 8 ? 'good' : 'warn'}">${esc(n.k)} ${n.v}</span>`).join('')}</div>` : ''}</div>`);
    }
    // os 7 primeiros segundos: 3 aberturas
    if (P.ABERTURA != null) {
      const L = E.linhas(P.ABERTURA);
      const esc1 = (L.find(l => /^escolhida/i.test(l)) || '');
      const escolhida = (esc1.match(/escolhida:\s*([ABC])/i) || [])[1];
      const notas = esc1.split('|')[1] || '';
      const vs = L.filter(l => /^[ABC]\b/.test(l)).map(l => {
        const letra = l[0];
        const get = k => { const m = l.match(new RegExp(k + '\\s*:\\s*([^|]+)', 'i')); return m ? m[1].trim().replace(/^["“]|["”]$/g, '') : ''; };
        return { letra, tipo: (l.match(/^[ABC]\s*[—-]\s*([^—\-:]+?)\s*[—-]/) || [])[1] || '', visual: get('Visual'), tela: get('Tela'), f03: get('0–3s') || get('0-3s'), f37: get('3–7s') || get('3-7s') };
      });
      if (vs.length) parts.push(`<div class="blk" style="padding-top:0; margin-bottom:24px"><div class="blk-h"><h3>Os 7 primeiros segundos</h3>${notas ? `<span class="tag mono">${esc(notas.trim())}</span>` : ''}</div>
        <div class="aberturas">${vs.map(v => `<div class="abre ${v.letra === escolhida ? 'on' : ''}"><div class="abre-h"><span class="nb">${v.letra}</span><b>${esc(v.tipo)}</b>${v.letra === escolhida ? '<span class="tag good">no roteiro</span>' : (opt.where === 'out' && !streaming && !ui.gen.exemplo && ui.ai === 'on' ? `<button class="btn xs" data-a="usar-abertura" data-l="${v.letra}">Usar esta</button>` : '')}</div>
          ${v.visual ? `<p><span class="k">Frame 0</span>${esc(v.visual)}</p>` : ''}${v.tela ? `<p><span class="k">Na tela</span>${esc(v.tela)}</p>` : ''}
          ${v.f03 ? `<p class="f"><span class="k">0–3 s</span>“${hl(v.f03)}”</p>` : ''}${v.f37 ? `<p class="f"><span class="k">3–7 s</span>“${hl(v.f37)}”</p>` : ''}</div>`).join('')}</div></div>`);
    }
    // atos
    const labs = ['Gancho', 'Problema', 'Solução', 'CTA'];
    const acts = ['ATO1', 'ATO2', 'ATO3', 'ATO4'].filter(k => P[k] != null);
    if (acts.length) {
      parts.push(`<div class="acts">${acts.map(k => {
        const i = Number(k.slice(3)) - 1;
        const t = parseTempo(P._tempos[k]);
        const start = t ? t[0] : [0, 4, 22, 38][i];
        return `<div class="act"><div class="tc">00:${pad2(start)}<span class="lab">${labs[i]}</span>${t ? `<span class="rng">${t[0]}–${t[1]} s</span>` : ''}</div><div>${E.linhas(P[k]).map(l => {
          const fl = E.fala(l);
          return `<p class="fala ${fl.star ? 'star' : ''}">${fl.quem ? `<span class="who">${esc(fl.quem)}</span>` : ''}${hl(fl.texto)}</p>`;
        }).join('')}</div></div>`;
      }).join('')}</div>`);
    }
    if (P.LEGENDA != null) {
      const tags = (P.LEGENDA.match(/(^|\s)#[\p{L}\p{N}_]+/gu) || []).length;
      parts.push(`<div class="blk"><div class="blk-h"><h3>Legenda</h3><div class="toolbar"><span class="tag mono">${grafemas(P.LEGENDA)} caract. · ${tags} #</span>${!streaming ? `<button class="btn xs" data-a="copiar-sec" data-sec="LEGENDA" data-w="${opt.where}">${ic('copy', 'sm')} Copiar</button>` : ''}</div></div><pre class="legenda">${hl(P.LEGENDA.trim())}</pre></div>`);
    }
    if (P.EDICAO != null) parts.push(`<div class="blk"><div class="blk-h"><h3>Dicas de edição</h3></div><ul class="list">${E.linhas(P.EDICAO).map(l => `<li>${hl(l.replace(/^[-•*]\s*/, ''))}</li>`).join('')}</ul></div>`);
    if (P.ANTES_DE_POSTAR != null) parts.push(`<div class="blk"><div class="blk-h"><h3>Antes de postar</h3></div><ul class="list warnlist">${E.linhas(P.ANTES_DE_POSTAR).map(l => `<li>${hl(l.replace(/^[-•*]\s*/, ''))}</li>`).join('')}</ul></div>`);
    if (P.STORIES != null) parts.push(`<div class="blk"><div class="blk-h"><h3>Stories</h3></div><ul class="list">${E.linhas(P.STORIES).map(l => `<li>${hl(l.replace(/^[-•*]\s*/, ''))}</li>`).join('')}</ul></div>`);
    if (P.PROXIMO != null) {
      parts.push(`<div class="blk"><div class="blk-h"><h3>Próximo vídeo</h3></div><div class="nextcard"><p>${hl(P.PROXIMO.trim())}</p>${!streaming && opt.where === 'out' && !ui.gen.exemplo ? `<button class="btn sm primary" data-a="proxima-parte">${ic('layers', 'sm')} Criar a próxima parte</button>` : ''}</div></div>`);
    }
    // stories gerados à parte
    if (opt.where === 'out' && !streaming && !ui.gen.exemplo && P.ATO1 && ui.gen.status === 'done') {
      const R = ui.gen.storiesRes;
      parts.push(`<div class="blk"><div class="blk-h"><h3>Esteira Stories → Reel</h3>${!R ? `<button class="btn sm" data-a="stories" ${ui.gen.storiesBusy || ui.ai !== 'on' ? 'disabled' : ''}>${ic('spark', 'sm')} ${ui.gen.storiesBusy ? 'Montando…' : 'Gerar 3 Stories'}</button>` : ''}</div>
        ${R ? storiesHTML(R) : '<p class="faint" style="margin:0; font-size:14px">Bastidor com gancho, a dor com enquete e a ponte pro Reel. Todo Reel vai pros Stories na primeira hora.</p>'}</div>`);
    }
    if (streaming) parts.push('<span class="caret" aria-hidden="true"></span>');
    if (!parts.length && raw) parts.push(`<pre class="legenda">${esc(raw)}</pre>`);
    return parts.join('');
  }

  function storiesHTML(R) {
    return `<div class="storycards">${R.map((s, i) => {
      const g = s.gancho ? E.gancho(s.gancho) : null;
      return `<div class="story"><div class="eyebrow">Story ${i + 1} · ${esc(s.tipo || '')}</div>${g ? `<p><b>“${esc(g.texto)}”</b> <span class="faint mono" style="font-size:11px">#${g.id}</span></p>` : ''}<p>${esc(s.fala || '')}</p>${s.textoNaTela ? `<p class="faint">Na tela: ${esc(s.textoNaTela)}</p>` : ''}${s.interacao ? `<p><span class="tag amber">${esc(s.interacao)}</span></p>` : ''}</div>`;
    }).join('')}</div>`;
  }

  function toPlain(raw) {
    const P = E.parse(raw);
    const L = [];
    if (P.CABECALHO) L.push(P.CABECALHO.trim());
    const alts = E.alternativosTodos(P);
    if (alts.length) L.push('Versões alternativas do gancho: ' + alts.map(a => (a.id ? `#${a.id} ` : '') + `"${a.texto}"`).join(' · '));
    if (P.PILARES) L.push('Pilares do gancho: ' + P.PILARES.trim());
    if (P.CORRECOES) L.push('', 'CORREÇÕES', P.CORRECOES.trim());
    const VL = E.valor(P);
    if (VL && VL.campos.length) L.push('', 'VALOR QUE TRANSFORMA', ...VL.campos.map(c => `${c.k}: ${c.v}`));
    L.push('', 'ROTEIRO');
    ['ATO1', 'ATO2', 'ATO3', 'ATO4'].forEach((k, i) => {
      if (P[k] == null) return;
      L.push(`Ato ${i + 1} — ${['Gancho', 'Problema', 'Solução', 'CTA'][i]}${P._tempos[k] ? ' (' + P._tempos[k] + ')' : ''}`);
      E.linhas(P[k]).forEach(l => { const f = E.fala(l); L.push(`- ${f.quem ? '[' + f.quem + '] ' : ''}"${f.texto}"`); });
    });
    if (P.LEGENDA) L.push('', 'LEGENDA', P.LEGENDA.trim());
    if (P.EDICAO) L.push('', 'DICAS DE EDIÇÃO', (P.TARJA ? '- Tarja fixa: ' + P.TARJA.trim() + '\n' : '') + P.EDICAO.trim());
    if (P.ANTES_DE_POSTAR) L.push('', 'ANTES DE POSTAR', P.ANTES_DE_POSTAR.trim());
    if (P.STORIES) L.push('', 'STORIES', P.STORIES.trim());
    if (P.PROXIMO) L.push('', 'PRÓXIMO VÍDEO', P.PROXIMO.trim());
    return L.join('\n');
  }
  const falaPlain = raw => { const P = E.parse(raw); return ['ATO1', 'ATO2', 'ATO3', 'ATO4'].flatMap(k => E.linhas(P[k]).map(l => E.fala(l).texto)).join('\n\n'); };

  /* ---------- geração ---------- */
  function sampleErr(e) {
    const c = e && e.code;
    if (c === 'cancelled') return { msg: 'Parado. O que já tinha chegado ficou na tela.', kind: 'warn' };
    if (['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'].includes(c)) {
      ui.ai = 'off'; renderChrome();
      return { msg: 'A IA não foi liberada nesta visualização. Use "Copiar prompt" e cole numa conversa com o Claude.', kind: 'bad' };
    }
    const M = {
      rate_limited: 'Muitas gerações seguidas ou limite de uso do Claude atingido. Espere um pouco e tente de novo.',
      session_expired: 'Sua sessão no Claude expirou. Entre de novo e tente outra vez.',
      refused: 'O Claude recusou esse pedido. Mude o tema, a ideia ou as observações.',
      empty_completion: 'A resposta veio vazia. Tente de novo com menos observações.',
      prompt_too_large: 'O pedido ficou grande demais. Desative algumas lições na memória ou encurte o texto colado.',
      invalid_json: 'A resposta veio fora do formato esperado. Tente de novo.'
    };
    return { msg: M[c] || 'A conexão falhou no meio. O que chegou ficou na tela; tente de novo.', kind: 'bad' };
  }

  async function run(input, ctx, kind, onDone) {
    if (!sampleFn) { toast('IA indisponível nesta visualização.', 'warn'); return; }
    if (ui.gen.ctl) ui.gen.ctl.abort();
    const ctl = new AbortController();
    const prevStories = null;
    Object.assign(ui.gen, { status: 'thinking', raw: '', exemplo: false, ctx, err: '', errKind: '', t0: Date.now(), ctl, kind, storiesRes: prevStories, truncated: false });
    if (kind !== 'ajuste') ui.gen.scriptId = null;
    const clap = $('#clap'); if (clap) { clap.classList.remove('go'); void clap.offsetWidth; clap.classList.add('go'); }
    renderOut(); renderSlate(); startTimer();
    const out = $('#out'); if (out && window.innerWidth < 1180) out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try {
      const r = await sampleFn(input, {
        signal: ctl.signal, modelTier: ui.studio.tier, cache: false,
        onText: ({ text }) => {
          if (ui.gen.ctl !== ctl) return;
          ui.gen.raw = text;
          if (ui.gen.status !== 'streaming') { ui.gen.status = 'streaming'; renderOut(); }
          else scheduleOut();
        }
      });
      if (ui.gen.ctl !== ctl) return;
      ui.gen.raw = r.text; ui.gen.status = 'done'; ui.gen.truncated = r.truncated;
      if (r.modelTierApplied && r.modelTierApplied !== ui.studio.tier) toast('Seu plano usou o modelo padrão neste take.', 'warn');
      onDone(r.text);
    } catch (e) {
      if (ui.gen.ctl !== ctl) return;
      const er = sampleErr(e);
      ui.gen.raw = e && e.code === 'refused' ? '' : (e && e.text) || ui.gen.raw || '';
      ui.gen.status = ui.gen.raw ? 'done' : 'idle';
      ui.gen.err = er.msg; ui.gen.errKind = er.kind;
      if (!ui.gen.raw) { ui.gen.raw = ''; }
    } finally {
      if (ui.gen.ctl === ctl) { ui.gen.ctl = null; stopTimer(); }
      renderOut(); renderSlate(); renderChrome();
    }
  }

  function ctxDoStudio(sd) {
    const banco = sd.ganchoModo === 'banco' && sd.ganchoId;
    return { temaId: sd.temaId || null, ganchoId: banco ? sd.ganchoId : null, ganchoTexto: banco ? '' : (sd.ganchoTexto || '').trim(), ganchoTravado: !banco && !!sd.ganchoTravado, formatoId: sd.formatoId, colchetes: banco ? sd.colchetes.slice() : [] };
  }
  function sdDeScript(s) {
    const sr = s.serieId ? String(s.serieId).split(':') : null;
    return { temaId: s.temaId || null, ganchoModo: s.ganchoId ? 'banco' : 'meu', ganchoId: s.ganchoId || null, ganchoTexto: s.ganchoTexto || '', ganchoTravado: !!s.ganchoTravado, assunto: s.assunto || '', formatoId: s.formatoId, colchetes: s.colchetes || [], fato: s.fato || '', fonte: s.fonte || '', ancora: '', proximo: '', obs: '', stories: false, serie: sr ? { id: sr[0], ep: sr[1] } : null };
  }

  function gerar() {
    const err = gateErr(); if (err) { toast(err, 'warn'); return; }
    const sd = ui.studio;
    const prompt = E.promptRoteiro(st, sd);
    const ctx = ctxDoStudio(sd);
    const continua = sd.continua, modelo = sd.modelo, serie = sd.serie;
    run(prompt, ctx, 'roteiro', text => {
      const P = E.parse(text);
      const t = sd.temaId ? E.tema(sd.temaId) : null;
      const s = {
        id: newId('r'), createdAt: Date.now(), origem: 'gerado', status: 'rascunho',
        temaId: ctx.temaId, ganchoId: ctx.ganchoId, ganchoTexto: ctx.ganchoTexto, ganchoTravado: ctx.ganchoTravado, assunto: (sd.assunto || '').trim(),
        formatoId: ctx.formatoId, colchetes: ctx.colchetes,
        fato: sd.fato, fonte: sd.fonte, serieId: serie ? serie.id + ':' + serie.ep : null,
        raw: text, titulo: (P.TARJA || '').trim() || (t ? t.nome : (sd.assunto || 'Roteiro').trim().slice(0, 60)), proximo: (P.PROXIMO || '').trim(), duracao: E.duracao(P),
        parentId: continua ? continua.id : null, metrics: null
      };
      st.scripts.unshift(s); Store.saveScript(s);
      ui.gen.scriptId = s.id;
      ui.gen.turns = [{ role: 'user', content: prompt.split('═══ REFERÊNCIA DE QUALIDADE')[0].trim() }, { role: 'assistant', content: text }];
      if (continua) sd.continua = null;
      if (modelo) {
        s.viralId = modelo.id; Store.saveScript(s);
        const v = viralById(modelo.id);
        if (v) { v.modelado = true; v.scriptIds = (v.scriptIds || []).concat(s.id); v.updatedAt = Date.now(); Store.saveViral(v); }
        sd.modelo = null;
      }
      sd.why = '';
      toast('Roteiro salvo na Biblioteca como rascunho.');
    });
  }

  function ajustar(nota, lembrar) {
    const G = ui.gen;
    const s = G.scriptId ? scriptById(G.scriptId) : null;
    if (!s) return;
    let turns = G.turns;
    if (!turns) {
      const sd = sdDeScript(s);
      const base = s.origem === 'revisado' ? '' : E.promptRoteiro(st, sd).split('═══ REFERÊNCIA DE QUALIDADE')[0].trim();
      turns = base ? [{ role: 'user', content: base }, { role: 'assistant', content: s.raw }] : [{ role: 'user', content: 'Roteiro revisado anteriormente pelo Narrador de Impacto (siga as mesmas regras e o mesmo formato de seções @@).' }, { role: 'assistant', content: s.raw }];
    }
    const input = turns.concat([{ role: 'user', content: E.promptAjuste(nota) }]);
    if (lembrar) { st.memory.prefs.unshift({ id: newId('p'), texto: nota, ativa: true, data: E.hoje() }); Store.saveEstado(); }
    const ctx = Object.assign({}, G.ctx);
    run(input, ctx, 'ajuste', text => {
      s.anterior = s.raw; s.raw = text; s.updatedAt = Date.now();
      const P = E.parse(text);
      s.titulo = (P.TARJA || '').trim() || s.titulo; s.proximo = (P.PROXIMO || '').trim(); s.duracao = E.duracao(P);
      Store.saveScript(s);
      ui.gen.scriptId = s.id;
      ui.gen.turns = input.concat([{ role: 'assistant', content: text }]).slice(-5);
      if (ui.gen.turns[0].role !== 'user') ui.gen.turns.shift();
      toast('Ajuste aplicado e salvo.');
    });
  }

  function revisar() {
    const txt = ui.revisar.texto.trim();
    if (txt.length < 40) { toast('Cole o roteiro completo pra revisar.', 'warn'); return; }
    const prompt = E.promptRevisar(st, txt);
    run(prompt, {}, 'revisar', text => {
      const P = E.parse(text);
      const ids = E.cabecalhoIds(P);
      const fm = ((P.FORMATO || '').match(/[a-z]+/) || [])[0];
      const fid = E.formato(fm) ? fm : null;
      ui.gen.ctx = { temaId: E.tema(ids.temaId) ? ids.temaId : null, ganchoId: E.gancho(ids.ganchoId) ? ids.ganchoId : null, ganchoTexto: '', ganchoLivre: !E.gancho(ids.ganchoId), formatoId: fid, colchetes: [] };
      const s = {
        id: newId('r'), createdAt: Date.now(), origem: 'revisado', status: 'rascunho',
        temaId: ui.gen.ctx.temaId, ganchoId: ui.gen.ctx.ganchoId, formatoId: fid,
        raw: text, titulo: (P.TARJA || '').trim() || 'Roteiro revisado', proximo: (P.PROXIMO || '').trim(), duracao: E.duracao(P), metrics: null
      };
      st.scripts.unshift(s); Store.saveScript(s);
      ui.gen.scriptId = s.id;
      ui.gen.turns = [{ role: 'user', content: prompt }, { role: 'assistant', content: text }];
      if (E.bytes(prompt) + E.bytes(text) > 58000) ui.gen.turns = null;
      toast('Versão revisada salva na Biblioteca.');
    });
  }

  async function ideia() {
    const txt = ui.ideia.texto.trim();
    if (txt.length < 5) { toast('Escreva a ideia primeiro.', 'warn'); return; }
    if (!sampleFn) return;
    ui.ideia.status = 'busy'; ui.ideia.err = ''; ui.ideia.res = null; renderSlate();
    try {
      const r = await sampleFn.json(E.promptIdeia(st, txt), { modelTier: ui.studio.tier === 'complex' ? 'default' : 'default', cache: false });
      const ops = (r && Array.isArray(r.opcoes) ? r.opcoes : []).map(o => ({
        tema: Number(o.tema), gancho: Number(o.gancho), formato: String(o.formato || '').toLowerCase().trim(), encaixe: String(o.encaixe || ''), porque: String(o.porque || '')
      })).filter(o => E.tema(o.tema)).map(o => { if (!E.gancho(o.gancho)) o.gancho = null; if (!E.formato(o.formato)) o.formato = null; return o; }).slice(0, 3);
      if (!ops.length) throw { code: 'invalid_json' };
      ui.ideia.res = { dentroDoBanco: !!r.dentroDoBanco, correcao: String(r.correcao || ''), opcoes: ops };
    } catch (e) {
      ui.ideia.err = sampleErr(e).msg;
    }
    ui.ideia.status = 'idle'; renderSlate();
  }

  async function melhorarGancho() {
    const R = ui.revisar, txt = R.gancho.trim();
    if (txt.length < 3) { toast('Cole o gancho primeiro.', 'warn'); return; }
    if (!sampleFn) return;
    R.statusG = 'busy'; R.errG = ''; R.resGancho = null; renderSlate();
    try {
      const r = await sampleFn.json(E.promptMelhorarGancho(st, txt), { modelTier: 'default', cache: false });
      const num = (x, lo, hi) => { const n = Math.round(Number(x)); return isFinite(n) ? Math.max(lo, Math.min(hi, n)) : 0; };
      const d = r && r.diagnostico || {};
      const refinado = String(r && r.refinado || '').trim();
      if (!refinado) throw { code: 'invalid_json' };
      R.resGancho = {
        diagnostico: { dorUniversal: num(d.dorUniversal, 0, 10), surpresa: num(d.surpresa, 0, 10), promessaClareza: num(d.promessaClareza, 0, 10), impactoEmocional: num(d.impactoEmocional, 0, 10), resumo: String(d.resumo || '') },
        veredito: r.veredito === 'manter' ? 'manter' : 'ajustar',
        erros: (Array.isArray(r.erros) ? r.erros : []).map(String).slice(0, 6),
        refinado, mudou: String(r.mudou || ''),
        alternativas: (Array.isArray(r.alternativas) ? r.alternativas : []).filter(a => a && typeof a === 'object' && String(a.texto || '').trim()).map(a => ({ texto: String(a.texto).trim(), enfase: String(a.enfase || '').slice(0, 24), porque: String(a.porque || '') })).slice(0, 3),
        abertura: r.abertura && typeof r.abertura === 'object' ? { visual: String(r.abertura.visual || ''), tela: String(r.abertura.tela || ''), f03: String(r.abertura.f03 || ''), f37: String(r.abertura.f37 || '') } : null
      };
    } catch (e) { R.errG = sampleErr(e).msg; }
    R.statusG = 'idle'; renderSlate();
  }

  /* ---------- montar juntos: lógica ---------- */
  function jtTurns() {
    const J = ui.juntos, sd = ui.studio;
    const sys = E.promptJuntosSistema(st, { formatoId: sd.formatoId, serie: J.serie });
    const hist = J.msgs.filter(m => m.content).map(m => ({ role: m.role, content: m.content }));
    return E.cortarTurns([{ role: 'user', content: sys }].concat(hist), 52000);
  }
  async function jtResponder() {
    const J = ui.juntos;
    if (!sampleFn) { toast('A conversa precisa da IA ativa (abra no Claude).', 'warn'); return; }
    if (J.ctl) J.ctl.abort();
    const ctl = new AbortController(); J.ctl = ctl; J.status = 'busy'; J.err = '';
    const input = jtTurns();
    J.msgs.push({ role: 'assistant', content: '' });
    renderOut(); renderSlate();
    try {
      const r = await sampleFn(input, {
        signal: ctl.signal, modelTier: 'default', cache: false,
        onText: ({ text }) => { if (J.ctl !== ctl) return; J.msgs[J.msgs.length - 1].content = text; renderChatMsgs(); }
      });
      if (J.ctl !== ctl) return;
      J.msgs[J.msgs.length - 1].content = r.text;
    } catch (e) {
      if (J.ctl !== ctl) return;
      const er = sampleErr(e);
      if (e && e.text) J.msgs[J.msgs.length - 1].content = e.text; else J.msgs.pop();
      J.err = e && e.code === 'cancelled' ? '' : er.msg;
    } finally {
      if (J.ctl === ctl) { J.ctl = null; J.status = 'idle'; }
      renderOut(); renderSlate(); renderChrome();
      const ta = document.getElementById('jt-draft'); if (ta && ui.studio.mode === 'juntos') ta.focus({ preventScroll: true });
    }
  }
  function jtStart() {
    const J = ui.juntos, txt = J.ideia.trim();
    if (txt.length < 8) return;
    if (ui.ai !== 'on') { toast('A conversa precisa da IA ativa (abra no Claude).', 'warn'); return; }
    J.msgs = [{ role: 'user', content: txt }]; J.fase = 'chat'; J.err = ''; J.draft = '';
    jtResponder();
  }
  function jtEnviar() {
    const J = ui.juntos, txt = (J.draft || '').trim();
    if (!txt || J.status === 'busy') return;
    J.msgs.push({ role: 'user', content: txt }); J.draft = '';
    jtResponder();
  }
  function jtSerie(ep) {
    const S = N.SERIE, e = S && S.eps.find(x => x.id === ep); if (!e) return;
    const J = ui.juntos;
    J.serie = { id: S.id, ep };
    ui.studio.formatoId = 'curadoria';
    J.ideia = `Vídeo de ${e.dia} da série ${S.nome}: ${e.titulo}. Gancho rascunho do briefing: "${e.gancho}"${e.ganchoAlt ? ` (ou "${e.ganchoAlt}")` : ''}. Quero montar o roteiro com os itens do briefing e marcar [DADO REAL + FONTE] onde faltar print.`;
    jtStart();
  }
  function jtFechar() {
    const J = ui.juntos, sd = ui.studio;
    if (!sampleFn || J.status === 'busy') return;
    const fechar = E.promptJuntosFechar(st, { formatoId: sd.formatoId, stories: sd.stories });
    const input = jtTurns().concat([{ role: 'user', content: fechar }]);
    const ctx = { temaId: null, ganchoId: null, ganchoTexto: '', ganchoLivre: true, formatoId: sd.formatoId, colchetes: [] };
    J.fase = 'final';
    const serie = J.serie, ideia = J.msgs.length ? J.msgs[0].content : '';
    run(input, ctx, 'roteiro', text => {
      const P = E.parse(text);
      const gt = E.linhas(P.ATO1).map(l => E.fala(l).texto).join(' ');
      const s = {
        id: newId('r'), createdAt: Date.now(), origem: 'gerado', status: 'rascunho',
        temaId: null, ganchoId: null, ganchoTexto: gt, assunto: String(ideia).slice(0, 300), formatoId: sd.formatoId || null, colchetes: [],
        serieId: serie ? serie.id + ':' + serie.ep : null,
        raw: text, titulo: (P.TARJA || '').trim() || 'Roteiro montado junto', proximo: (P.PROXIMO || '').trim(), duracao: E.duracao(P), metrics: null
      };
      st.scripts.unshift(s); Store.saveScript(s);
      ui.gen.scriptId = s.id; ui.gen.turns = null;
      toast('Roteiro fechado e salvo na Biblioteca como rascunho.');
    });
  }
  function jtRecomecar() {
    const J = ui.juntos;
    if (J.ctl) J.ctl.abort();
    Object.assign(J, { fase: 'chat', msgs: [], status: 'idle', err: '', draft: '', ctl: null, serie: null });
    renderOut(); renderSlate();
  }
  function setModo(m) {
    ui.studio.mode = m;
    document.querySelectorAll('[data-a="modo"]').forEach(b => b.setAttribute('aria-pressed', b.dataset.m === m));
    renderSlate(); renderOut();
  }

  async function melhorarCTA() {
    const R = ui.revisar, txt = R.cta.trim();
    if (txt.length < 3) { toast('Cole o CTA primeiro.', 'warn'); return; }
    if (!sampleFn) return;
    R.statusC = 'busy'; R.errC = ''; R.resCta = null; renderSlate();
    try {
      const r = await sampleFn.json(E.promptMelhorarCTA(st, txt), { modelTier: 'default', cache: false });
      const sugestoes = (Array.isArray(r && r.sugestoes) ? r.sugestoes : []).map(s => ({
        fala: String(s.fala || ''), legenda: String(s.legenda || ''), proximoVideo: String(s.proximoVideo || ''), porque: String(s.porque || '')
      })).filter(s => s.fala || s.legenda).slice(0, 4);
      if (!sugestoes.length) throw { code: 'invalid_json' };
      R.resCta = { diagnostico: (Array.isArray(r.diagnostico) ? r.diagnostico : []).map(String).slice(0, 6), sugestoes };
    } catch (e) { R.errC = sampleErr(e).msg; }
    R.statusC = 'idle'; renderSlate();
  }

  async function gerarStories() {
    const G = ui.gen; if (!sampleFn || !G.raw) return;
    G.storiesBusy = true; renderOutBody();
    try {
      const r = await sampleFn.json(E.promptStories(st, G.raw), { modelTier: 'default', cache: false });
      const arr = (r && Array.isArray(r.stories) ? r.stories : []).slice(0, 3).map(s => ({ tipo: String(s.tipo || ''), gancho: E.gancho(Number(s.gancho)) ? Number(s.gancho) : null, fala: String(s.fala || ''), textoNaTela: String(s.textoNaTela || ''), interacao: String(s.interacao || '') }));
      if (!arr.length) throw { code: 'invalid_json' };
      G.storiesRes = arr;
      const s = G.scriptId && scriptById(G.scriptId);
      if (s) { s.stories = arr; Store.saveScript(s); }
    } catch (e) { toast(sampleErr(e).msg, 'bad'); }
    G.storiesBusy = false; renderOutBody();
  }

  function copiarPrompt() {
    const err = gateErr(); if (err) { toast(err, 'warn'); return; }
    copy(E.promptRoteiro(st, ui.studio), 'Prompt');
  }

  function proximaParte() {
    const s = ui.gen.scriptId && scriptById(ui.gen.scriptId);
    const P = E.parse(ui.gen.raw);
    const prom = (P.PROXIMO || '').trim();
    if (!prom) return;
    prepararContinua(s || { id: null, titulo: (P.TARJA || 'vídeo anterior').trim(), ganchoId: ui.gen.ctx.ganchoId, temaId: ui.gen.ctx.temaId, formatoId: ui.gen.ctx.formatoId }, prom, 'Parte 2 pronta: confira o gancho novo e rode o take.');
  }
  function prepararContinua(s, promessa, msg) {
    const sd = ui.studio;
    sd.mode = 'criar';
    sd.continua = { id: s.id, titulo: s.titulo || 'vídeo anterior', promessa, ganchoId: s.ganchoId };
    if (s.temaId) sd.temaId = s.temaId;
    sd.formatoId = s.formatoId || sd.formatoId || 'lista';
    sd.assunto = s.assunto || sd.assunto || s.titulo || '';
    sd.ganchoModo = 'meu'; sd.ganchoId = null; sd.ganchoTexto = ''; sd.ganchoTravado = false; sd.inspiracao = null;
    sd.colchetes = []; sd.fato = ''; sd.fonte = ''; sd.proximo = ''; sd.serie = null;
    sd.why = 'Mesmo formato do vídeo anterior, gancho novo: escreva um gancho diferente do anterior (' + (s.ganchoTexto ? '“' + s.ganchoTexto.slice(0, 80) + '”' : s.ganchoId ? '#' + s.ganchoId : 'o do vídeo anterior') + '). Doubling Down: dobre no tema, nunca na âncora polêmica.';
    ui.modal = null;
    if (ui.view !== 'estudio') go('estudio'); else { render(); }
    toast(msg);
  }

  /* =================================================================
     BANCOS
     ================================================================= */
  let hookCtx = { rank: {}, par: {} };
  function hookFilter(g, f, uso, ultimo) {
    if (f === 'funciona') return !!(hookCtx.rank[g.id] && hookCtx.rank[g.id].media >= hookCtx.corte) || !!hookCtx.par[g.id];
    if (f === 'livres') return !g.gate && !g.soft && !g.colchete;
    if (f === 'fato') return g.gate === 'fato';
    if (f === 'numero') return g.gate === 'numero' || g.soft === 'numero';
    if (f === 'colchete') return g.colchete;
    if (f === 'nunca') return !uso[g.id];
    return true;
  }
  function hookMeta(g, uso, ultimo) {
    const c = E.cat(g.cat);
    const t = [];
    if (g.gate === 'fato') t.push('<span class="tag warn">Fato real</span>');
    if (g.gate === 'numero') t.push('<span class="tag warn">Número conferido</span>');
    if (g.soft === 'numero') t.push('<span class="tag warn">Tem número</span>');
    if (g.colchete) t.push('<span class="tag amber">[ troca ]</span>');
    if (g.id === ultimo) t.push('<span class="tag bad">Último usado</span>');
    const rk = hookCtx.rank[g.id];
    if (rk) t.push(`<span class="tag ${rk.media >= hookCtx.corte ? 'good' : 'bad'}">Seu score ${rk.media}${rk.n > 1 ? ' · ' + rk.n + ' vídeos' : ''}</span>`);
    if (hookCtx.par[g.id]) t.push(`<span class="tag amber" title="${esc(hookCtx.par[g.id].porque)}">Parecido com o que funcionou</span>`);
    if (uso[g.id]) t.push(`<span class="tag">Usado ${uso[g.id].n}×</span>`);
    c.formatos.forEach(f => t.push(`<span class="tag">${esc(fmtName(f))}</span>`));
    if (g.nota && !g.gate && !g.soft) t.push(`<span class="faint" style="font-size:12px">${esc(g.nota)}</span>`);
    return t.join('');
  }
  function vGanchos() {
    const F = ui.gf, uso = E.usoGancho(st), ultimo = E.ultimoGancho(st);
    const pc = E.agrupar(st, 'cat');
    const R0 = E.recomendar(st);
    hookCtx = { rank: Object.fromEntries(E.rankGanchos(st).map(x => [x.id, x])), par: Object.fromEntries(R0.parecidos.map(p => [p.id, p])), corte: R0.corte };
    const flags = [['todos', 'Todos'], ['funciona', 'Funcionam pra você'], ['livres', 'Livres pra usar'], ['fato', 'Pedem fato real'], ['numero', 'Com número'], ['colchete', 'Com [colchetes]'], ['nunca', 'Nunca usados']];
    const q = E.norm(F.q);
    const cats = N.CATS.filter(c => !F.cat || c.id === F.cat);
    let total = 0;
    const blocks = cats.map(c => {
      const hs = N.GANCHOS.filter(g => g.cat === c.id && hookFilter(g, F.flag, uso, ultimo) && (!q || E.norm(g.texto).includes(q) || String(g.id) === q.replace('#', '')));
      total += hs.length;
      if (!hs.length) return '';
      const perf = pc[c.id] && pc[c.id].media != null ? `<span class="tag ${pc[c.id].media >= 70 ? 'good' : 'amber'}">Seu score ${pc[c.id].media}</span>` : '';
      return `<section class="cat-block"><div class="cat-h"><h2>${esc(c.nome)}</h2><span class="range">#${c.de}${c.ate !== c.de ? '–' + c.ate : ''}</span>${perf}<div class="fits">${c.formatos.map(f => `<span class="chip">${esc(fmtName(f))}</span>`).join('')}</div></div>
      ${c.nota ? `<div class="cat-note">${esc(c.nota)}</div>` : ''}
      ${hs.map(g => `<div class="hook ${g.id === ultimo ? 'last' : ''}"><span class="num">#${g.id}</span><div><div class="txt">“${esc(g.texto)}”</div><div class="meta">${hookMeta(g, uso, ultimo)}</div></div>
        <div class="acts2"><button class="btn xs icon-btn" data-a="copiar-gancho" data-g="${g.id}" aria-label="Copiar gancho ${g.id}" title="Copiar">${ic('copy', 'sm')}</button><button class="btn xs" data-a="adaptar-gancho" data-g="${g.id}" title="Copia pro seu gancho e você reescreve do seu jeito">Adaptar</button><button class="btn xs" data-a="usar-gancho" data-g="${g.id}" title="Usa exatamente como está">Literal</button></div></div>`).join('')}
      </section>`;
    }).join('');
    return `<div class="vh"><div><div class="eyebrow">Banco oficial · ${N.GANCHOS.length} ganchos · ${N.CATS.length} categorias</div><h1>Ganchos <em>literais</em></h1>
      <p>Banco opcional, só pra inspiração. <b>Adaptar</b> copia o gancho pro Estúdio pra você reescrever do seu jeito; <b>Literal</b> usa palavra por palavra (aí só o que está entre [colchetes] muda). Você também pode ignorar o banco e escrever o seu.</p></div>
      <div class="search">${ic('search')}<input type="search" id="g-q" data-bind="gq" value="${esc(F.q)}" placeholder="Buscar por palavra ou número" aria-label="Buscar gancho"></div></div>
      <div class="rail" role="group" aria-label="Categorias"><button class="chip ${!F.cat ? 'on' : ''}" data-a="gcat" data-c="0">Todas <span class="n">${N.GANCHOS.length}</span></button>${N.CATS.map(c => `<button class="chip ${F.cat === c.id ? 'on' : ''}" data-a="gcat" data-c="${c.id}">${esc(c.nome)} <span class="n">${c.ate - c.de + 1}</span></button>`).join('')}</div>
      <div class="rail" role="group" aria-label="Filtros">${flags.map(([k, l]) => `<button class="chip ${F.flag === k ? 'on' : ''}" data-a="gflag" data-f="${k}">${l}</button>`).join('')}</div>
      <div id="g-list">${total ? blocks : '<div class="empty">Nenhum gancho com esse filtro.</div>'}</div>`;
  }

  function vTemas() {
    const F = ui.tf, uso = E.usoTema(st), pp = E.agrupar(st, 'pilar');
    const q = E.norm(F.q);
    const pils = N.PILARES.filter(p => F.pilar === 'todos' || p.id === F.pilar);
    const html = pils.map(p => {
      const cards = [];
      for (let i = p.de; i <= p.ate; i++) {
        const t = E.tema(i);
        if (!t) {
          if (q) continue;
          cards.push(`<div class="tema pend" style="--pc:${pilarColor(p.id)}"><div class="top"><span class="nb">${pad2(i)}</span><span class="tag">Pendente</span></div><h3 class="faint">Tema #${i} ainda não definido</h3><div class="note">O banco oficial veio sem os temas deste pilar. Não inventamos: adicione os seus.</div><div class="foot"><span></span><button class="btn xs" data-a="add-tema" data-i="${i}">${ic('plus', 'sm')} Adicionar</button></div></div>`);
          continue;
        }
        if (q && !E.norm(t.nome + ' ' + t.frase + ' ' + t.id).includes(q)) continue;
        cards.push(`<div class="tema" style="--pc:${pilarColor(p.id)}"><div class="top"><span class="nb">${pad2(t.id)}</span>${uso[t.id] ? `<span class="tag">Usado ${uso[t.id].n}×</span>` : '<span class="tag">Novo</span>'}</div>
          <h3>${esc(t.nome)}</h3><blockquote>“${esc(t.frase)}”</blockquote>${t.nota ? `<div class="note">${esc(t.nota)}</div>` : ''}
          <div class="foot">${t.custom ? `<button class="btn xs ghost" data-a="add-tema" data-i="${t.id}">${ic('edit', 'sm')} Editar</button>` : '<span></span>'}<button class="btn xs" data-a="usar-tema" data-t="${t.id}">Usar ${ic('arrow', 'sm')}</button></div></div>`);
      }
      if (!cards.length) return '';
      const perf = pp[p.id] && pp[p.id].media != null ? `<span class="tag ${pp[p.id].media >= 70 ? 'good' : 'amber'}">Seu score ${pp[p.id].media}</span>` : '';
      return `<section class="cat-block"><div class="cat-h"><h2><span class="pdot" style="--pc:${pilarColor(p.id)}; width:12px; height:12px; margin-right:10px"></span>${esc(p.nome)}</h2><span class="range">#${pad2(p.de)}–${p.ate}</span>${perf}</div><div class="grid-cards" style="margin-top:14px">${cards.join('')}</div></section>`;
    }).join('');
    return `<div class="vh"><div><div class="eyebrow">Banco oficial · ${E.todosTemas().length} de 60 temas</div><h1>Temas <em>virais</em></h1>
      <p>Todo vídeo tangencia um destes temas. Pode encaixar num assunto do dia, mas o tema tem que ser reconhecível. Ideia fora daqui passa pela aba Ideia solta do Estúdio.</p></div>
      <div class="search">${ic('search')}<input type="search" id="t-q" data-bind="tq" value="${esc(F.q)}" placeholder="Buscar tema" aria-label="Buscar tema"></div></div>
      <div class="rail" role="group" aria-label="Pilares"><button class="chip ${F.pilar === 'todos' ? 'on' : ''}" data-a="tpil" data-p="todos">Todos</button>${N.PILARES.map(p => `<button class="chip ${F.pilar === p.id ? 'on' : ''}" data-a="tpil" data-p="${p.id}"><span class="pdot" style="--pc:${pilarColor(p.id)}"></span>${esc(p.nome)}</button>`).join('')}</div>
      <div id="t-list">${html || '<div class="empty">Nenhum tema com essa busca.</div>'}</div>`;
  }

  const FV = {
    tela: '<i class="face"></i><i class="body"></i><i class="sat"></i>',
    react: '<i class="big"></i><i class="play"></i><i class="pip"></i><i class="face"></i>',
    novelinha: '<i class="s1"></i><i class="h1"></i><i class="face f1"></i><i class="h2"></i><i class="face f2"></i><i class="s2"></i>',
    comparativo: '<i class="l"></i><i class="r"></i><i class="x">✕</i><i class="v">✓</i>',
    narrado: '<i class="b1"></i><i class="b2"></i><i class="b3"></i><i class="wave"></i>',
    trend: '<i class="note"></i><i class="t1"></i><i class="t2"></i><i class="cap"></i>',
    conversa: '<i class="m m1"></i><i class="m m2"></i><i class="m m3"></i><i class="m m4"></i><i class="m m5"></i><i class="sim">SIMULAÇÃO</i>',
    lista: '<i class="n">1</i><i class="r1"></i><i class="r2"></i><i class="r3"></i>'
  };
  const FVBASE = { contagem: 'lista', cascata: 'conversa', niveis: 'comparativo', manchete: 'trend', relato: 'narrado', desafio: 'trend', experimento: 'comparativo', performatico: 'react' };
  const fvHTML = id => { const b = FV[id] ? id : (FVBASE[id] || 'lista'); return `<div class="fv fv-${b}" aria-hidden="true">${FV[b]}</div>`; };
  function manualHTML() {
    const M = N.MANUAL || [];
    if (!M.length) return '';
    return `<div class="vh" style="margin-top:44px"><div><div class="eyebrow">Regras e conhecimento · entram em todo roteiro</div><h1 style="font-size:clamp(30px,4vw,46px)">Manual do <em>viral</em></h1>
      <p>O que cada métrica pede, como fechar o vídeo, aberturas que matam o alcance, a fórmula de retenção do meio do vídeo, o que copiar de um viral, tom por público, templates visuais baratos, Stories diários e teste A/B.</p></div></div>
      <div class="manual">${M.map(m => `<details class="card man" ${['metrica', 'cta', 'abertura'].includes(m.id) ? 'open' : ''}><summary><b>${esc(m.titulo)}</b>${ic('chev', 'sm')}</summary>
        <dl>${m.itens.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <p class="man-fonte">Fonte: ${esc(m.fonte)}.</p></details>`).join('')}</div>`;
  }

  function vFormatos() {
    const pf = E.agrupar(st, 'formato');
    const cards = N.FORMATOS.map(f => {
      const cats = N.CATS.filter(c => c.formatos.includes(f.id));
      const d = pf[f.id];
      const perf = (E.validado(st, f.id) ? '<span class="tag good">Validado pro seu perfil</span>' : '') + (d ? (d.media != null ? `<span class="perfbar">Seu score<span class="bar"><i style="width:${d.media}%"></i></span><b class="mono">${d.media}</b><span class="faint">· ${d.usos} vídeo${d.usos > 1 ? 's' : ''}</span></span>` : `<span class="perfbar faint">${d.usos} roteiro${d.usos > 1 ? 's' : ''}, sem números ainda</span>`) : '<span class="perfbar faint">Ainda não testado no perfil</span>');
      return `<article class="fmt">${fvHTML(f.id)}<div><h3>${esc(f.nome)}</h3><div class="durb">${f.dur[0]}–${f.dur[1]} s · alvo ${E.duracaoAlvo(f.id).join('–')} s</div>
        <dl><div><dt>O que é</dt><dd>${esc(f.oque)}</dd></div><div><dt>Por que viraliza</dt><dd>${esc(f.porque)}</dd></div><div><dt>Serve pra</dt><dd>${esc(f.serve)}</dd></div><div><dt>Regra</dt><dd>${esc(f.regra)}</dd></div>
        ${cats.length ? `<div><dt>Ganchos que combinam</dt><dd style="display:flex; gap:6px; flex-wrap:wrap; margin-top:6px">${cats.map(c => `<button class="chip" data-a="ver-cat" data-c="${c.id}">${esc(c.nome)}</button>`).join('')}</dd></div>` : ''}</dl></div>
        <div class="foot">${perf}<span class="grow"></span><button class="btn sm" data-a="usar-formato" data-f="${f.id}">Usar ${ic('arrow', 'sm')}</button></div></article>`;
    }).join('');
    return `<div class="vh"><div><div class="eyebrow">${N.FORMATOS.length} formatos · manual do viral</div><h1>Formatos que <em>funcionam</em></h1>
      <p>Na dúvida entre dois formatos, fique com o de menor atrito pra gravar. O score de cada um vem dos números que você registra na Biblioteca.</p></div></div>
      <div class="fmts">${cards}</div>
      <div class="card" style="padding:20px; margin-top:18px"><div class="eyebrow" style="margin-bottom:12px">Mapa gancho → formato</div>
      <div class="bars">${N.MAPA.map(m => `<div class="brow" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)"><span>${esc(m[0])}</span><span class="muted">→ ${esc(m[1])}</span></div>`).join('')}</div></div>
      ${manualHTML()}`;
  }

  /* =================================================================
     VIRAIS PRA MODELAR
     ================================================================= */
  const viralById = id => st.virais.find(v => v.id === id);
  const MLAB = { curtidas: 'Curtidas', comentarios: 'Comentários', salvamentos: 'Salvamentos', compartilhamentos: 'Compartilhamentos' };
  const FORMULAS = { numero: 'Número primeiro', contraria: 'Verdade contrária', cena: 'Cena identificável', confissao: 'Confissão com custo', lista: 'Lista numerada', antesdepois: 'Antes → depois', mito: 'Mito × verdade', framework: 'Método com nome', quebra: 'Quebra de padrão', comoeu: '"Como eu" com resultado' };
  const AREA = { gancho: 'Gancho', roteiro: 'Roteiro', edicao: 'Edição', formato: 'Formato', tema: 'Tema', audio: 'Áudio', legenda: 'Legenda', numeros: 'Números', perfil: 'Perfil de origem' };
  const xTag = (x, alto, medio) => x == null ? '<span class="faint">—</span>' : `<span class="tag ${x >= (alto || 2) ? 'good' : x >= (medio || 1) ? 'amber' : 'bad'}">${E.fmtX(x)}</span>`;
  const vStatus = v => v.modelado ? '<span class="tag good">Modelado</span>' : v.analise ? '<span class="tag amber">Analisado</span>' : '<span class="tag">Sem análise</span>';
  const numBR = x => esc(String(x).replace('.', ','));

  function vThumb(v, cls) {
    return v.thumb && /^data:image\//.test(v.thumb) ? `<img class="${cls || 'vthumb'}" src="${esc(v.thumb)}" alt="">`
      : `<div class="${cls || 'vthumb'} vthumb-ph" aria-hidden="true"><span>${esc((v.handle || '?').replace('@', '').slice(0, 1).toUpperCase() || '?')}</span></div>`;
  }

  function padroesHTML() {
    const an = st.virais.filter(v => v.analise);
    if (an.length < 2) return '';
    const cont = arr => { const c = {}; arr.filter(Boolean).forEach(k => { c[k] = (c[k] || 0) + 1; }); return Object.entries(c).sort((a, b) => b[1] - a[1]); };
    const fmts = cont(an.map(v => v.analise.formato));
    const cats = cont(an.map(v => v.analise.gancho && v.analise.gancho.categoria));
    const areas = {};
    an.forEach(v => (v.analise.fatores || []).forEach(f => { areas[f.area] = (areas[f.area] || 0) + (Number(f.peso) || 1); }));
    const areasL = Object.entries(areas).sort((a, b) => b[1] - a[1]);
    const maxA = areasL.length ? areasL[0][1] : 1;
    const stats = an.map(v => E.viralStats(v));
    const al = stats.map(s => s.alcanceX).filter(x => x != null);
    const sh = stats.filter(s => s.shareLike != null);
    const durs = stats.map(s => s.dur).filter(x => x != null);
    const mid = a => { const b = a.slice().sort((x, y) => x - y); return b.length ? (b.length % 2 ? b[b.length >> 1] : (b[b.length / 2 - 1] + b[b.length / 2]) / 2) : null; };
    const brow = (lbl, v, max, val) => `<div class="brow"><span class="lbl" title="${esc(lbl)}">${esc(lbl)}</span><span class="track"><i style="width:${Math.round(v / max * 100)}%"></i></span><span class="val">${esc(val)}</span></div>`;
    return `<div class="learn" style="margin-bottom:22px">
      <div class="card"><h3>O que pesou nos seus ${an.length} virais</h3><div class="bars">${areasL.slice(0, 6).map(([k, x]) => brow(AREA[k] || k, x, maxA, String(x))).join('')}</div>
        <p class="faint" style="font-size:12.5px; margin:12px 0 0">Soma do peso (1 a 5) que a análise deu a cada fator.</p></div>
      <div class="card"><h3>Padrões</h3><div class="bars">
        ${fmts.slice(0, 3).map(([k, n]) => brow('Formato: ' + fmtName(k), n, an.length, n + '/' + an.length)).join('')}
        ${cats.slice(0, 3).map(([k, n]) => brow('Gancho: ' + catName(Number(k)), n, an.length, n + '/' + an.length)).join('')}
      </div>
      <div class="rates" style="margin-top:14px">${al.length ? `<span class="tag">Views ÷ seguidores (mediana): ${E.fmtX(mid(al))}</span>` : ''}${sh.length ? `<span class="tag">${sh.filter(s => s.shareLike >= 1).length}/${sh.length} com mais compartilhamentos que curtidas</span>` : ''}${durs.length ? `<span class="tag">Duração mediana: ${Math.round(mid(durs))} s</span>` : ''}</div></div>
    </div>`;
  }

  function benchFonteHTML() {
    const b = N.BENCH;
    if (!b || !(b.itens || []).length) return '';
    return `<details class="card bench-src"><summary>${ic('search', 'sm')} Médias do Instagram usadas na comparação <span class="faint">· conferidas na fonte em ${esc(b.atualizado || '')}</span></summary>
      <ul class="list" style="margin-top:12px">${b.itens.map(it => `<li><b>${esc(it.rotulo)}</b>: ${it.faixas ? it.faixas.map(f => `${esc(f.rotulo)} <span class="mono">${numBR(f.valor)}${esc(it.unidade || '')}</span>`).join(' · ') : `<span class="mono">${numBR(it.valor)}${esc(it.unidade || '')}</span>`}<br><span class="faint" style="font-size:12.5px">${esc(it.definicao)}${it.amostra ? ' · ' + esc(it.amostra) : ''} — <a href="${esc(it.url)}" target="_blank" rel="noopener">${esc(it.fonte)}</a>, ${esc(it.periodo)}</span></li>`).join('')}
      ${(b.contexto || []).concat(b.sinais || []).map(s => `<li>${esc(s.texto)}<br><span class="faint" style="font-size:12.5px"><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.fonte)}</a>, ${esc(s.data)}</span></li>`).join('')}</ul>
      ${b.nota ? `<p class="faint" style="font-size:12.5px; margin:12px 0 0">${esc(b.nota)}</p>` : ''}</details>`;
  }

  function vVirais() {
    const F = ui.vf;
    const list = st.virais.filter(v => F === 'todos' || (F === 'pendente' && !v.analise) || (F === 'analisado' && v.analise && !v.modelado) || (F === 'modelado' && v.modelado));
    const cards = list.map(v => {
      const S = E.viralStats(v);
      const er = S.benchER.find(b => b.aqui != null && b.base === 'seguidores') || S.benchER.find(b => b.aqui != null);
      return `<button class="vcard" data-a="abrir-viral" data-v="${esc(v.id)}">
        ${vThumb(v)}
        <div class="vbody">
          <div class="top">${vStatus(v)}${v.analise && v.analise.formato && E.formato(v.analise.formato) ? `<span class="tag">${esc(fmtName(v.analise.formato))}</span>` : ''}</div>
          <div class="mono faint" style="font-size:12px">${esc(v.handle || 'perfil não informado')}${S.seg != null ? ' · ' + E.fmtK(S.seg) + ' seguidores' : ''}</div>
          <h4>${esc(v.titulo || 'Sem título')}</h4>
          ${v.analise && v.analise.veredito ? `<p class="vver">${esc(v.analise.veredito)}</p>` : ''}
          <div class="rates">${S.alcanceX != null ? `<span class="tag ${S.alcanceX >= 10 ? 'good' : 'amber'}">${E.fmtX(S.alcanceX)} os seguidores</span>` : ''}${S.outlierX != null ? `<span class="tag ${S.outlierX >= 5 ? 'good' : 'amber'}">${E.fmtX(S.outlierX)} a média do perfil</span>` : ''}${er && er.x != null ? `<span class="tag ${er.x >= 1 ? 'good' : 'bad'}">Engaj. ${E.fmtX(er.x)} a média do Instagram</span>` : ''}</div>
        </div></button>`;
    }).join('');
    const empty = `<div class="vempty">
      <div class="vstep"><span class="nb">1</span><h3>Salve o viral</h3><p>Link, @ do perfil, seguidores, views, curtidas, comentários, compartilhamentos e salvamentos. Aceita "12,3 mil" e "1,2 mi". Pode subir prints: a IA lê os números.</p></div>
      <div class="vstep"><span class="nb">2</span><h3>Entenda por que explodiu</h3><p>Números contra a média do próprio perfil e contra a média do Instagram pra faixa de seguidores. A IA lê o roteiro e a edição e dá peso a cada fator.</p></div>
      <div class="vstep"><span class="nb">3</span><h3>Modele no seu nicho</h3><p>A estrutura vira tema, gancho literal e formato do seu banco. Um clique leva pro Estúdio, e o roteiro já sai com a referência.</p></div>
    </div>`;
    return `<div class="vh"><div><div class="eyebrow">Modelagem · ${st.virais.length} vira${st.virais.length === 1 ? 'l' : 'is'} de referência</div><h1>Virais pra <em>modelar</em></h1>
      <p>Salve Reels que explodiram. O app compara os números com a média do próprio perfil e com a média do Instagram, a IA explica o roteiro e a edição, e a modelagem sai com tema, gancho e formato do seu banco. Modelar é copiar a estrutura, nunca o conteúdo.</p></div>
      <div class="toolbar">${typeof X.viraisToolbar === 'function' ? X.viraisToolbar() : ''}<button class="btn primary" data-a="add-viral">${ic('plus', 'sm')} Adicionar viral</button></div></div>
      ${padroesHTML()}
      ${st.virais.length ? `<div class="rail" role="group" aria-label="Filtro">${[['todos', 'Todos'], ['pendente', 'Sem análise'], ['analisado', 'Analisados'], ['modelado', 'Modelados']].map(([k, l]) => `<button class="chip ${F === k ? 'on' : ''}" data-a="vf" data-f="${k}">${l}</button>`).join('')}</div>
      <div class="vgrid">${cards || '<div class="empty">Nada com esse filtro.</div>'}</div>` : empty}
      <div style="margin-top:22px">${benchFonteHTML()}</div>`;
  }

  /* ---------- formulário do viral ---------- */
  function viralFormHTML(M) {
    const d = M.draft, md = d.media || {};
    const inp = (k, label, ph, help) => `<label class="field"><span>${label}</span><input type="text" inputmode="decimal" id="vf-${k}" data-bind="v.${k}" value="${esc(d[k] || '')}" placeholder="${esc(ph || '')}">${help ? `<small>${help}</small>` : ''}</label>`;
    const minp = (k, label) => { const L = E.parseLista(md[k]); return `<label class="field"><span>${label}</span><input type="text" inputmode="decimal" id="vm-${k}" data-bind="vm.${k}" value="${esc(md[k] || '')}" placeholder="12 mil; 8.500; 9,9 mil"><small id="vm-${k}-s">${L.n > 1 ? `Média de ${L.n} Reels: ${E.fmtK(L.media)}` : L.n === 1 ? E.fmtK(L.media) : '&nbsp;'}</small></label>`; };
    const files = M.files || [];
    const podeLer = files.length && ui.imgMax > 0 && ui.ai === 'on';
    return sheetHead(M.id ? 'Editar viral' : 'Adicionar viral') + `<div class="sheet-b vform">
      <section><div class="eyebrow">O vídeo</div>
        <div class="g2">
          <label class="field"><span>Link do Reel</span><input type="text" id="vf-link" data-bind="v.link" value="${esc(d.link || '')}" placeholder="https://www.instagram.com/reel/..." data-autofocus></label>
          <label class="field"><span>@ do perfil</span><input type="text" id="vf-handle" data-bind="v.handle" value="${esc(d.handle || '')}" placeholder="@perfil"></label>
          <label class="field"><span>Assunto / título</span><input type="text" id="vf-titulo" data-bind="v.titulo" value="${esc(d.titulo || '')}" placeholder="Ex.: 3 erros de quem vende pelo direct"></label>
          <label class="field"><span>Nicho do perfil de origem</span><input type="text" id="vf-nicho" data-bind="v.nicho" value="${esc(d.nicho || '')}" placeholder="Ex.: finanças pessoais"></label>
        </div></section>
      <section><div class="eyebrow">Prints (opcional)</div>
        <p class="faint" style="margin:6px 0 10px; font-size:13.5px">Frame 0, cenas-chave ou a tela com os números. A IA usa os prints pra ler a edição e pode preencher os números. Só a primeira imagem fica guardada, como capa pequena; as outras valem só nesta sessão.</p>
        <div class="files">${files.map((f, i) => `<div class="fprev"><img src="${esc(M.urls[i])}" alt="Print ${i + 1}"><button class="btn xs icon-btn" data-a="rm-print" data-i="${i}" aria-label="Remover print ${i + 1}">${ic('x', 'sm')}</button></div>`).join('')}
          ${files.length < 6 ? `<label class="fadd" for="v-prints">${ic('upload')}<span>${files.length ? 'Mais prints' : 'Subir prints'}</span></label>` : ''}<input type="file" id="v-prints" accept="image/png,image/jpeg,image/webp,image/gif" multiple hidden></div>
        ${files.length ? `<div class="toolbar" style="margin-top:10px"><button class="btn sm" data-a="ler-prints" ${podeLer && !M.lendo ? '' : 'disabled'}>${ic('spark', 'sm')} ${M.lendo ? 'Lendo os prints…' : 'Preencher números pelos prints'}</button>${ui.ai === 'on' && !ui.imgMax ? '<span class="faint" style="font-size:12.5px">Esta visualização não envia imagens pra IA.</span>' : ''}</div>` : ''}</section>
      <section><div class="eyebrow">Números do viral</div>
        <div class="g3">
          ${inp('seguidores', 'Seguidores do perfil *', '48,2 mil')}
          ${inp('views', 'Views *', '1,2 mi')}
          ${inp('curtidas', 'Curtidas', '85 mil')}
          ${inp('comentarios', 'Comentários', '1.204')}
          ${inp('compartilhamentos', 'Compartilhamentos', '32 mil', 'Contador do ícone de avião, quando aparece.')}
          ${inp('salvamentos', 'Salvamentos', 'se souber', 'Em geral só o dono vê. Pode deixar em branco.')}
          ${inp('duracao', 'Duração (s)', '38')}
          <label class="field"><span>Postado em</span><input type="date" id="vf-postado" data-bind="v.postadoEm" value="${esc(d.postadoEm || '')}"></label>
          <label class="field"><span>Áudio</span><select id="vf-audio" data-bind="v.audio"><option value="">—</option>${['Voz original', 'Áudio em alta (trend)', 'Narração + música', 'Música sem voz'].map(o => `<option ${d.audio === o ? 'selected' : ''}>${o}</option>`).join('')}</select></label>
        </div></section>
      <section><div class="eyebrow">Média do perfil de origem</div>
        <p class="faint" style="margin:6px 0 10px; font-size:13.5px">Pegue os últimos 6 a 12 Reels normais do perfil (sem o viral). Pode colar a lista separada por ponto e vírgula que o app tira a média. É isso que diz se o vídeo é um outlier ou se o perfil sempre vai bem assim.</p>
        <div class="g3">${minp('views', 'Views por Reel')}${minp('curtidas', 'Curtidas por Reel')}${minp('comentarios', 'Comentários por Reel')}${minp('compartilhamentos', 'Compartilhamentos por Reel')}${minp('salvamentos', 'Salvamentos por Reel')}</div></section>
      <section><div class="eyebrow">Roteiro e edição</div>
        <div style="display:flex; flex-direction:column; gap:12px; margin-top:8px">
          <label class="field"><span>Transcrição da fala</span><textarea id="vf-roteiro" data-bind="v.roteiro" rows="6" placeholder="Cole a fala do vídeo, do primeiro ao último segundo. A legenda automática do Instagram ajuda.">${esc(d.roteiro || '')}</textarea></label>
          <label class="field"><span>Texto na tela</span><textarea id="vf-texto" data-bind="v.textoTela" rows="2" placeholder="Tarja, títulos, números que aparecem">${esc(d.textoTela || '')}</textarea></label>
          <label class="field"><span>Como é a edição</span><textarea id="vf-edicao" data-bind="v.edicao" rows="3" placeholder="Ex.: abre andando pra câmera, corte a cada 1,5 s, legenda amarela palavra a palavra, zoom no número, b-roll de tela do celular, música some no final">${esc(d.edicao || '')}</textarea></label>
          <label class="field"><span>Legenda do post</span><textarea id="vf-legenda" data-bind="v.legenda" rows="3">${esc(d.legenda || '')}</textarea></label>
        </div></section>
      <div class="toolbar vform-foot">
        ${ui.ai === 'on' ? `<button class="btn primary" data-a="salvar-viral" data-analisar="1">${ic('spark', 'sm')} Salvar e analisar</button>` : ''}
        <button class="btn ${ui.ai === 'on' ? '' : 'primary'}" data-a="salvar-viral">${ic('check', 'sm')} Salvar</button>
        <button class="btn ghost" data-a="fechar">Cancelar</button>
        <span class="faint" style="font-size:12.5px">* Sem seguidores e views não há comparação.</span>
      </div></div>`;
  }

  /* ---------- detalhe do viral ---------- */
  function viralStatsHTML(v, S) {
    const erB = S.benchER.filter(b => b.aqui != null);
    const erSegB = erB.find(b => b.base === 'seguidores');
    const erViewB = erB.find(b => b.base !== 'seguidores');
    const kpi = (lbl, val, sub) => `<div class="kpi"><div class="eyebrow">${lbl}</div><div class="v">${val}</div><div class="s">${sub}</div></div>`;
    const benchCell = r => {
      const bs = r.bench.filter(b => b.aqui != null);
      if (!bs.length) return '<span class="faint">sem média pública</span>';
      return bs.map(b => `<span class="bcell" title="${esc(b.rotulo + ' — ' + b.fonte + ', ' + b.periodo)}"><span class="mono">${numBR(b.valor)}${esc(b.unidade || '')}</span> <span class="faint">${b.base === 'seguidores' ? 'dos seguidores' : b.base === 'post' ? 'por Reel' : b.base === 'alcance' ? 'do alcance*' : 'das views'}${b.faixa ? ' · ' + esc(b.faixa.rotulo) : ''} · ${esc(b.fonteCurta || b.fonte)}</span> ${xTag(b.x, 1.5, 1)}</span>`).join('');
    };
    const temAlcance = S.rows.some(r => r.val != null && r.bench.some(b => b.aqui != null && b.base === 'alcance')) || erB.some(b => b.base === 'alcance') || S.benchViews.some(b => b.aqui != null && b.aprox);
    const vPost = S.benchViews.find(b => b.aqui != null && b.base === 'post');
    const vSeg = S.benchViews.find(b => b.aqui != null && b.base === 'seguidores');
    const num = b => b.numerador ? b.numerador.map(k => MLAB[k].toLowerCase()).join(' + ') : 'todas as interações';
    return `<div class="kpis vkpis">
        ${kpi('Views ÷ seguidores', E.fmtX(S.alcanceX), vSeg ? `normal: alcançar ${numBR(vSeg.valor)}% dos seguidores (${esc(vSeg.faixa ? vSeg.faixa.rotulo : '')}, ${esc(vSeg.fonteCurta || vSeg.fonte)})*` : `${E.fmtK(S.views)} views · ${E.fmtK(S.seg)} seguidores`)}
        ${kpi('× a média do perfil', E.fmtX(S.outlierX), S.M.views.media ? `média de ${S.M.views.n} Reel${S.M.views.n > 1 ? 's' : ''}: ${E.fmtK(S.M.views.media)} views` : 'informe a média de views do perfil')}
        ${kpi('× a média do Instagram', vPost ? E.fmtX(vPost.x) : '—', vPost ? `Reel típico de ${esc(vPost.faixa ? vPost.faixa.rotulo : '')}: ${E.fmtK(vPost.valor)} views (${esc(vPost.fonteCurta || vPost.fonte)})` : 'sem média pública pra essa faixa de seguidores')}
        ${kpi('Engajamento ÷ seguidores', E.fmtPct(erSegB ? erSegB.aqui : S.erSeg), erSegB ? `${esc(num(erSegB))} · Instagram${erSegB.faixa ? ' (' + esc(erSegB.faixa.rotulo) + ')' : ''}: ${numBR(erSegB.valor)}% · este ${E.fmtX(erSegB.x)}` : S.perfilER != null ? `típico do perfil: ${E.fmtPct(S.perfilER)}` : 'curtidas + coment. + salv. + compart.')}
        ${kpi('Engajamento ÷ views', E.fmtPct(erViewB ? erViewB.aqui : S.erViews), erViewB ? `${esc(num(erViewB))} · criadores${erViewB.faixa ? ' (' + esc(erViewB.faixa.rotulo) + ')' : ''}: ${numBR(erViewB.valor)}% · este ${E.fmtX(erViewB.x)}` : 'interações por view')}
      </div>
      ${S.leitura.length ? `<div class="rates" style="margin:0 0 16px">${S.leitura.map(l => `<span class="tag ${l.n}">${esc(l.t)}</span>`).join('')}</div>` : ''}
      <div class="cmp-wrap"><table class="cmp"><thead><tr><th>Métrica</th><th>Viral</th><th>% das views</th><th>× média do perfil</th><th>Média do Instagram</th></tr></thead><tbody>
        ${S.rows.map(r => `<tr><td>${MLAB[r.k]}</td><td class="mono">${E.fmtK(r.val)}</td><td class="mono">${E.fmtPct(r.porView)}${r.perfilPorView != null && r.porView != null ? `<span class="faint"> · perfil ${E.fmtPct(r.perfilPorView)}</span>` : ''}</td><td>${xTag(r.xPerfil, 5, 2)}</td><td>${r.val == null ? '<span class="faint">—</span>' : benchCell(r)}</td></tr>`).join('')}
      </tbody></table></div>
      <p class="faint" style="font-size:12px; margin:8px 0 0">${temAlcance || erViewB ? '* Comparação aproximada: o alcance conta pessoas únicas e as views contam repetições; a média de criadores da HypeAuditor mistura as fórmulas por views e por seguidores. ' : ''}Médias de marcas (Socialinsider) ficam abaixo das de criadores: um criador acima delas não é, sozinho, prova de viral. Fontes no fim da página.</p>`;
  }

  function viralAnaliseHTML(v, M) {
    const A = v.analise;
    const sel = M.licSel || {};
    const cardModel = (o, i, main) => {
      const t = E.tema(o.tema), g = E.gancho(o.gancho), f = E.formato(o.formato);
      if (!t || !g) return '';
      return `<div class="${main ? 'modelcard' : 'idea'}">
        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px"><span class="tag mono">Tema #${pad2(t.id)}</span><span class="tag"><span class="pdot" style="--pc:${pilarColor(t.pilar)}"></span>${esc(t.nome)}</span>${f ? `<span class="tag amber">${esc(f.nome)}</span>` : ''}${g.gate ? `<span class="tag warn">${g.gate === 'fato' ? 'Pede fato real' : 'Pede fonte do número'}</span>` : ''}</div>
        <q class="mq">${esc(g.texto)}</q><div class="faint" style="font-size:12.5px">Gancho #${g.id} · ${esc(catName(g.cat))}</div>
        ${o.angulo ? `<p style="margin:10px 0 0">${esc(o.angulo)}</p>` : ''}${o.porque ? `<p class="faint" style="margin:6px 0 0; font-size:13.5px">${esc(o.porque)}</p>` : ''}
        <div style="margin-top:12px"><button class="btn sm ${main ? 'primary' : ''}" data-a="modelar" data-i="${i}">${ic('estudio', 'sm')} Modelar no Estúdio</button></div></div>`;
    };
    const gc = A.gancho || {};
    const list = (arr, cls) => (arr || []).length ? `<ul class="list ${cls || ''}">${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '<p class="faint" style="margin:0">—</p>';
    return `<div class="analysis vanalysis">
      <div class="decision"><b>Por que viralizou</b>${esc(A.veredito || '')}</div>
      ${(A.fatores || []).length ? `<div><h5>Fatores, do mais forte ao mais fraco</h5><div class="fatores">${A.fatores.map(f => `<div class="fator"><span class="tag">${esc(AREA[f.area] || f.area)}</span><span class="peso" role="img" aria-label="peso ${f.peso} de 5">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= f.peso ? 'on' : ''}"></i>`).join('')}</span><div><p>${esc(f.porque)}</p>${f.evidencia ? `<small>${esc(f.evidencia)}</small>` : ''}</div></div>`).join('')}</div></div>` : ''}
      ${gc.texto ? `<div><h5>O gancho do viral</h5><div class="nextcard" style="flex-direction:column; align-items:flex-start; gap:8px"><q class="mq" style="margin:0">${esc(gc.texto)}</q>
        <div class="rates">${gc.formula && FORMULAS[gc.formula] ? `<span class="tag amber">Fórmula: ${esc(FORMULAS[gc.formula])}</span>` : ''}${E.cat(gc.categoria) ? `<span class="tag amber">No banco: ${esc(catName(gc.categoria))}</span>` : ''}${(gc.pilares || []).map(p => `<span class="tag">${esc(p)}</span>`).join('')}</div>${gc.porque ? `<p class="muted" style="margin:0; font-size:14px">${esc(gc.porque)}</p>` : ''}
        <p class="faint" style="margin:0; font-size:12.5px">Não copie esta frase: o seu roteiro abre com o gancho literal do banco que cumpre a mesma função.</p></div></div>` : ''}
      ${A.entrega && (A.entrega.transformacao || A.entrega.comoSuperar) ? `<div><h5>O valor que ele entrega</h5><div class="valor">${[['Antes → depois', A.entrega.transformacao], ['Leva pronto', A.entrega.levaPronto], ['Por que seguiriam', A.entrega.porQueSeguir]].filter(x => x[1]).map(([k, t]) => `<div class="vrow"><span class="k">${k}</span><p>${esc(t)}</p></div>`).join('')}${A.entrega.comoSuperar ? `<div class="vrow seg"><span class="k">Como a sua versão entrega mais</span><p>${esc(A.entrega.comoSuperar)}</p></div>` : ''}</div></div>` : ''}
      ${(A.estrutura || []).length ? `<div><h5>Estrutura</h5><div class="estr">${A.estrutura.map(e => `<div class="estr-row"><span class="mono">${esc(e.tempo || '')}</span><b>${esc(e.parte)}</b><span>${esc(e.oque)}</span></div>`).join('')}</div></div>` : ''}
      <div class="cols2"><div><h5>Edição</h5>${list(A.edicao)}</div><div><h5>Leitura dos números</h5>${list(A.numeros)}</div></div>
      <div class="cols2"><div><h5>Modelar</h5>${list(A.modelar, 'corr')}</div><div><h5>Não copiar</h5>${list(A.naoCopiar, 'warnlist')}</div></div>
      ${(A.naoTransfere || []).length ? `<div><h5>O que não se transfere pro seu perfil</h5>${list(A.naoTransfere, 'warnlist')}</div>` : ''}
      ${A.modelagem ? `<div><h5>Modelagem pro seu perfil</h5>${cardModel(A.modelagem, -1, true)}</div>` : ''}
      ${(A.alternativas || []).length ? `<div><h5>Outros ângulos</h5><div class="ideas">${A.alternativas.map((o, i) => cardModel(o, i, false)).join('')}</div></div>` : ''}
      ${(A.licoes || []).length ? `<div><h5>O que levar deste viral</h5>${A.licoes.map((l, i) => `<label class="check" style="align-items:flex-start; margin-bottom:8px"><input type="checkbox" data-a="vlic-sel" data-i="${i}" ${sel[i] !== false ? 'checked' : ''}> <span>${esc(l)}</span></label>`).join('')}
        ${A.guardadas ? '<span class="tag good">Guardadas na memória</span>' : `<button class="btn sm" data-a="guardar-licoes-viral">${ic('brain', 'sm')} Guardar na memória</button>`}</div>` : ''}
      <p class="faint" style="font-size:12px; margin:0">Análise de ${esc(A.data || '')}${A.imagens ? ` com ${A.imagens} print${A.imagens > 1 ? 's' : ''}` : ''}.</p>
    </div>`;
  }

  function viralHTML(M) {
    const v = viralById(M.id);
    if (!v) return sheetHead('Viral') + '<div class="sheet-b"><div class="empty">Esse viral não existe mais.</div></div>';
    const S = E.viralStats(v);
    const armed = M.delArm && Date.now() - M.delArm < 5000;
    const nImgs = (viralFiles[v.id] || []).length;
    return sheetHead(esc(v.titulo || 'Viral'), vStatus(v)) + `<div class="sheet-b">
      <div class="vhead">${vThumb(v, 'vthumb big')}<div style="min-width:0; flex:1">
        <div class="mono faint" style="font-size:12.5px">${esc(v.handle || 'perfil não informado')}${v.nicho ? ' · ' + esc(v.nicho) : ''}${v.postadoEm ? ' · ' + esc(v.postadoEm.split('-').reverse().join('/')) : ''}${S.dur ? ' · ' + S.dur + ' s' : ''}${v.audio ? ' · ' + esc(v.audio) : ''}</div>
        <div class="toolbar" style="margin-top:12px">
          ${v.link && /^https:\/\//i.test(v.link) ? `<a class="btn sm" href="${esc(v.link)}" target="_blank" rel="noopener">${ic('arrow', 'sm')} Abrir no Instagram</a>` : ''}
          <button class="btn sm" data-a="edit-viral">${ic('edit', 'sm')} Editar dados</button>
          <button class="btn sm ${v.analise ? '' : 'primary'}" data-a="analisar-viral" ${M.busy || ui.ai !== 'on' || !(S.views && S.seg) ? 'disabled' : ''}>${ic('spark', 'sm')} ${M.busy ? 'Analisando…' : v.analise ? 'Refazer análise' : 'Analisar com IA'}</button>
          <span style="flex:1"></span>
          <button class="btn sm ${armed ? 'primary' : 'ghost danger'}" data-a="del-viral">${ic('trash', 'sm')} ${armed ? 'Confirmar exclusão' : 'Excluir'}</button>
        </div>
        ${!(S.views && S.seg) ? '<p class="gate-err" style="margin-top:10px">' + ic('alert', 'sm') + '<span>Informe seguidores e views pra liberar a comparação e a análise.</span></p>' : ''}
        ${ui.ai !== 'on' ? '<p class="faint" style="font-size:12.5px; margin-top:10px">A análise com IA só roda com o app aberto no Claude.</p>' : ''}
        ${nImgs ? `<p class="faint" style="font-size:12.5px; margin-top:10px">${nImgs} print${nImgs > 1 ? 's' : ''} desta sessão vão junto na análise.</p>` : ''}
      </div></div>
      <div class="blk" style="padding-top:18px"><div class="blk-h"><h3>Números contra as médias</h3></div>${viralStatsHTML(v, S)}</div>
      ${M.err ? `<div class="errnote">${ic('alert', 'sm')}<span>${esc(M.err)}</span></div>` : ''}
      ${M.busy ? `<div class="thinking" style="padding:22px 0"><div class="scan"></div><div class="tip">A IA está lendo o roteiro, a edição e os números${nImgs ? ' e os prints' : ''}. No modo Máxima isso leva de 20 segundos a 2 minutos.</div></div>` : ''}
      ${v.analise ? `<div class="blk"><div class="blk-h"><h3>Análise</h3></div>${viralAnaliseHTML(v, M)}</div>` : ''}
      ${typeof X.viralExtra === 'function' ? X.viralExtra(v, M) : ''}
      ${v.roteiro ? `<details class="card" style="margin-top:22px; padding:14px 16px"><summary style="cursor:pointer; font-weight:600">Transcrição salva</summary><pre class="legenda" style="margin-top:12px">${esc(v.roteiro)}</pre></details>` : ''}
      <div style="margin-top:18px">${benchFonteHTML()}</div>
    </div>`;
  }

  /* ---------- ações dos virais ---------- */
  const VKEYS = ['link', 'handle', 'titulo', 'nicho', 'seguidores', 'views', 'curtidas', 'comentarios', 'compartilhamentos', 'salvamentos', 'duracao', 'postadoEm', 'audio', 'roteiro', 'textoTela', 'edicao', 'legenda', 'thumb'];
  function viralDraft(v) {
    const d = {};
    VKEYS.forEach(k => { d[k] = v && v[k] != null ? v[k] : ''; });
    d.media = Object.assign({ views: '', curtidas: '', comentarios: '', compartilhamentos: '', salvamentos: '' }, v && v.media || {});
    return d;
  }
  function thumbFrom(file) {
    return new Promise(res => {
      let url = '';
      try { url = URL.createObjectURL(file); } catch (e) { res(''); return; }
      const img = new Image();
      img.onload = () => {
        const W = 240, H = 426;
        const c = document.createElement('canvas'); c.width = W; c.height = H;
        const g = c.getContext('2d');
        const r = Math.max(W / img.width, H / img.height);
        const w = img.width * r, h = img.height * r;
        g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
        g.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
        URL.revokeObjectURL(url);
        try { res(c.toDataURL('image/jpeg', 0.72)); } catch (e) { res(''); }
      };
      img.onerror = () => { URL.revokeObjectURL(url); res(''); };
      img.src = url;
    });
  }
  async function addPrints(fileList) {
    const M = ui.modal; if (!M || M.type !== 'viral-form') return;
    const novos = [...fileList].filter(f => /^image\//.test(f.type));
    if (!novos.length) { toast('Envie imagens (PNG, JPG, WebP).', 'warn'); return; }
    const antes = M.files || [];
    M.files = antes.concat(novos).slice(0, 6);
    M.urls = (M.urls || []).slice(0, antes.length).concat(M.files.slice(antes.length).map(f => URL.createObjectURL(f)));
    if (!M.draft.thumb || M.thumbAuto) { M.draft.thumb = await thumbFrom(M.files[0]); M.thumbAuto = true; }
    if (ui.modal === M) renderModal();
  }
  function filesParaIA(files) {
    const lim = ui.imgLim;
    if (!lim) return [];
    return files.filter(f => (!lim.mediaTypes || lim.mediaTypes.includes(f.type)) && (!lim.maxInputBytes || f.size <= lim.maxInputBytes)).slice(0, lim.maxCount || 1);
  }
  async function lerPrints() {
    const M = ui.modal; if (!M || !sampleFn) return;
    const imgs = filesParaIA(M.files || []);
    if (!imgs.length) { toast('Nenhum print aceito por esta visualização.', 'warn'); return; }
    M.lendo = true; renderModal();
    try {
      const r = await sampleFn.json(E.promptLerPrints(imgs.length), { images: imgs, modelTier: 'default', cache: false });
      let n = 0;
      const ok = x => x != null && String(x).trim() && String(x).trim().toLowerCase() !== 'null';
      ['seguidores', 'views', 'curtidas', 'comentarios', 'compartilhamentos', 'salvamentos', 'duracao'].forEach(k => {
        const val = r && r[k];
        if (ok(val) && E.parseNum(val) != null) { M.draft[k] = String(val).trim(); n++; }
      });
      if (r && ok(r.handle) && !M.draft.handle) { const h = String(r.handle).trim(); M.draft.handle = h.startsWith('@') ? h : '@' + h; n++; }
      if (r && ok(r.legenda) && !M.draft.legenda) { M.draft.legenda = String(r.legenda); n++; }
      if (r && ok(r.textoTela) && !M.draft.textoTela) { M.draft.textoTela = String(r.textoTela); n++; }
      toast(n ? `${n} campo${n > 1 ? 's' : ''} preenchido${n > 1 ? 's' : ''}. Confira antes de salvar.` : 'Nenhum número legível nos prints.', n ? 'good' : 'warn');
    } catch (e) { toast(sampleErr(e).msg, 'bad'); }
    if (ui.modal === M) { M.lendo = false; renderModal(); }
  }
  function salvarViral(analisar) {
    const M = ui.modal, d = M.draft;
    if (!String(d.titulo || '').trim() && !String(d.handle || '').trim() && !String(d.link || '').trim()) { toast('Dê pelo menos um título, o @ ou o link.', 'warn'); return; }
    let v = M.id ? viralById(M.id) : null;
    if (!v) { v = { id: newId('v'), createdAt: Date.now() }; st.virais.unshift(v); }
    VKEYS.forEach(k => { v[k] = typeof d[k] === 'string' ? d[k].trim() : (d[k] == null ? '' : d[k]); });
    if (v.handle && !v.handle.startsWith('@')) v.handle = '@' + v.handle;
    v.media = Object.assign({}, d.media);
    v.updatedAt = Date.now();
    if (M.files && M.files.length) viralFiles[v.id] = M.files.slice();
    Store.saveViral(v);
    ui.modal = { type: 'viral', id: v.id };
    if (ui.view === 'virais') $('#main').innerHTML = vVirais();
    renderChrome(); renderModal();
    toast('Viral salvo.');
    if (analisar) analisarViral();
  }
  async function analisarViral() {
    const M = ui.modal; const v = M && viralById(M.id);
    if (!sampleFn || !v) return;
    const S = E.viralStats(v);
    if (!S.views || !S.seg) { toast('Informe seguidores e views.', 'warn'); return; }
    const imgs = filesParaIA(viralFiles[v.id] || []);
    M.busy = true; M.err = ''; renderModal();
    try {
      const opts = { modelTier: ui.studio.tier === 'complex' ? 'complex' : 'default', cache: false };
      if (imgs.length) opts.images = imgs;
      const r = await sampleFn.json(E.promptViral(st, v, S, imgs.length), opts);
      if (!r || typeof r !== 'object') throw { code: 'invalid_json' };
      const arr = (x, n) => (Array.isArray(x) ? x : []).map(y => typeof y === 'string' ? y.trim() : '').filter(Boolean).slice(0, n || 8);
      const areaOk = a => Object.prototype.hasOwnProperty.call(AREA, a) ? a : 'roteiro';
      const combo = o => {
        if (!o || typeof o !== 'object') return null;
        const f = String(o.formato || '').toLowerCase().trim();
        const g = typeof o.gancho === 'string' ? o.gancho.trim() : (E.gancho(Number(o.gancho)) ? Number(o.gancho) : '');
        if (!g && !String(o.angulo || '').trim()) return null;
        return { tema: E.tema(Number(o.tema)) ? Number(o.tema) : null, gancho: g, formato: E.formato(f) ? f : null, angulo: String(o.angulo || ''), porque: String(o.porque || '') };
      };
      const fmt = String(r.formato || '').toLowerCase().trim();
      const analise = {
        veredito: String(r.veredito || ''),
        fatores: (Array.isArray(r.fatores) ? r.fatores : []).filter(f => f && typeof f === 'object').slice(0, 8).map(f => ({ area: areaOk(String(f.area || '').toLowerCase()), peso: Math.max(1, Math.min(5, Math.round(Number(f.peso) || 1))), porque: String(f.porque || ''), evidencia: String(f.evidencia || '') })).filter(f => f.porque).sort((a, b) => b.peso - a.peso),
        gancho: r.gancho && typeof r.gancho === 'object' ? { texto: String(r.gancho.texto || ''), categoria: E.cat(Number(r.gancho.categoria)) ? Number(r.gancho.categoria) : null, formula: String(r.gancho.formula || '').toLowerCase().replace(/[^a-z]/g, '').slice(0, 20), pilares: arr(r.gancho.pilares, 4), porque: String(r.gancho.porque || '') } : null,
        entrega: r.entrega && typeof r.entrega === 'object' ? { transformacao: String(r.entrega.transformacao || ''), levaPronto: String(r.entrega.levaPronto || ''), porQueSeguir: String(r.entrega.porQueSeguir || ''), comoSuperar: String(r.entrega.comoSuperar || '') } : null,
        estrutura: (Array.isArray(r.estrutura) ? r.estrutura : []).filter(e => e && typeof e === 'object').slice(0, 8).map(e => ({ parte: String(e.parte || ''), tempo: String(e.tempo || ''), oque: String(e.oque || '') })).filter(e => e.parte || e.oque),
        edicao: arr(r.edicao), formato: E.formato(fmt) ? fmt : null, numeros: arr(r.numeros), naoTransfere: arr(r.naoTransfere, 5),
        modelar: arr(r.modelar), naoCopiar: arr(r.naoCopiar),
        modelagem: combo(r.modelagem),
        alternativas: (Array.isArray(r.alternativas) ? r.alternativas : []).map(combo).filter(Boolean).slice(0, 2),
        licoes: arr(r.licoes, 3), data: E.hoje(), imagens: imgs.length, guardadas: false
      };
      if (!analise.veredito && !analise.fatores.length) throw { code: 'invalid_json' };
      const vivo = viralById(v.id);
      if (vivo) { vivo.analise = analise; vivo.updatedAt = Date.now(); Store.saveViral(vivo); }
      M.licSel = {};
    } catch (e) { M.err = sampleErr(e).msg; }
    M.busy = false;
    if (ui.modal === M) renderModal();
    if (ui.view === 'virais') $('#main').innerHTML = vVirais();
  }
  const gTexto = o => o ? (typeof o.gancho === 'number' ? ((E.gancho(o.gancho) || {}).texto || '') : String(o.gancho || '')) : '';
  function modelar(i) {
    const v = viralById(ui.modal.id); if (!v || !v.analise) return;
    const A = v.analise;
    const o = i < 0 ? A.modelagem : A.alternativas[i];
    if (!o) return;
    const sd = ui.studio;
    Object.assign(sd, {
      mode: 'criar', temaId: o.tema && E.tema(o.tema) ? o.tema : null, formatoId: o.formato || A.formato || sd.formatoId || 'lista',
      assunto: o.angulo || A.veredito || '', ganchoModo: 'meu', ganchoId: null, ganchoTexto: gTexto(o), ganchoTravado: false, inspiracao: null,
      colchetes: [], fato: '', fonte: '', continua: null, serie: null,
      modelo: { id: v.id, handle: v.handle, titulo: v.titulo, veredito: A.veredito, estrutura: A.estrutura, edicao: A.edicao, modelar: A.modelar, naoCopiar: A.naoCopiar, angulo: o.angulo, entrega: A.entrega || null },
      why: `Modelando ${v.handle || 'o viral'}: ${o.angulo || A.veredito}. O gancho é uma ideia pra você editar do seu jeito.`
    });
    ui.modal = null;
    go('estudio');
    toast('Modelagem no Estúdio. Edite o gancho do seu jeito e rode o take.');
  }

  /* =================================================================
     BIBLIOTECA
     ================================================================= */
  function vBiblioteca() {
    const scripts = st.scripts;
    const comNum = scripts.filter(s => E.score(s.metrics) != null);
    const postados = scripts.filter(s => s.status === 'postado').length;
    const media = comNum.length ? Math.round(comNum.reduce((a, s) => a + E.score(s.metrics), 0) / comNum.length) : null;
    const pf = E.agrupar(st, 'formato'), pc = E.agrupar(st, 'cat');
    const bestF = Object.entries(pf).filter(([, x]) => x.media != null).sort((a, b) => b[1].media - a[1].media)[0];
    const barsF = Object.entries(pf).filter(([, x]) => x.media != null).sort((a, b) => b[1].media - a[1].media);
    const barsC = Object.entries(pc).filter(([, x]) => x.media != null).sort((a, b) => b[1].media - a[1].media);
    const brow = (lbl, v, n) => `<div class="brow"><span class="lbl" title="${esc(lbl)}">${esc(lbl)}</span><span class="track"><i style="width:${v}%"></i><span class="ref" style="left:50%"></span></span><span class="val">${v}</span></div>`;
    const F = ui.bf;
    const list = scripts.filter(s => F === 'todos' || s.status === F);
    const mv = E.mediaViews(st);
    return `<div class="vh"><div><div class="eyebrow">Biblioteca · o que o perfil aprende</div><h1>Seus <em>takes</em></h1>
      <p>Todo roteiro gerado cai aqui. Depois de postar, registre os números: o score de impacto de cada formato e gancho passa a orientar a próxima sugestão e o próprio roteiro.</p></div>
      <div class="toolbar"><button class="btn" data-a="ditar-abrir">${ic('mic', 'sm')} Ditar métricas</button><button class="btn" data-a="registrar-video">${ic('plus', 'sm')} Registrar vídeo já postado</button></div></div>
      <div class="kpis">
        <div class="kpi"><div class="eyebrow">Roteiros</div><div class="v">${scripts.filter(s => s.origem !== 'referencia').length}</div><div class="s">${scripts.filter(s => s.status === 'rascunho').length} rascunhos</div></div>
        <div class="kpi"><div class="eyebrow">Postados</div><div class="v">${postados}</div><div class="s">${comNum.length} com números</div></div>
        <div class="kpi"><div class="eyebrow">Score médio</div><div class="v">${media != null ? media : '—'}</div><div class="s">0 a 100 · 50 = na referência</div></div>
        <div class="kpi"><div class="eyebrow">Melhor formato</div><div class="v" style="font-size:30px">${bestF ? esc(fmtName(bestF[0])) : '—'}</div><div class="s">${bestF ? 'score ' + bestF[1].media : 'registre números pra descobrir'}${mv ? ' · média ' + E.fmtN(Math.round(mv)) + ' views' : ''}</div></div>
      </div>
      <div class="learn">
        <div class="card"><h3>Formatos por score</h3>${barsF.length ? `<div class="bars">${barsF.map(([k, x]) => brow(fmtName(k), x.media)).join('')}</div>` : '<p class="faint" style="margin:0">Sem números ainda.</p>'}</div>
        <div class="card"><h3>Categorias de gancho por score</h3>${barsC.length ? `<div class="bars">${barsC.map(([k, x]) => brow(catName(k), x.media)).join('')}</div>` : '<p class="faint" style="margin:0; font-size:14px">Registre o gancho usado em cada vídeo postado pra ver quais categorias seguram mais.</p>'}</div>
      </div>
      <div style="margin:-16px 0 28px">${recHTML(false)}</div>
      <div class="card" style="padding:14px 18px; margin:-16px 0 28px; display:flex; gap:12px; align-items:center; flex-wrap:wrap">${ic('brain')}<span style="flex:1 1 280px; font-size:14px">A IA usa <b>${st.memory.licoes.filter(l => l.ativa !== false).length} lições</b>, ${st.memory.fatos.length} fatos conferidos${st.memory.voz ? ', a sua voz' : ''} e ${st.memory.prefs.length} preferências em todo roteiro. <span class="faint">Score: seguidores 30%, salvamentos 25%, compartilhamentos 20%, alcance fora da base 15%, comentários 10%, contra referências de ${E.REF.seguidores}%, ${E.REF.salvamentos}%, ${E.REF.compartilhamentos}%, ${E.REF.naoSeguidores}% e ${E.REF.comentarios}% das views.</span></span><button class="btn sm" data-a="nav" data-v="perfil">Ver memória</button></div>
      <div class="rail" role="group" aria-label="Status">${[['todos', 'Todos'], ['rascunho', 'Rascunhos'], ['gravado', 'Gravados'], ['postado', 'Postados']].map(([k, l]) => `<button class="chip ${F === k ? 'on' : ''}" data-a="bf" data-f="${k}">${l} <span class="n">${k === 'todos' ? scripts.length : scripts.filter(s => s.status === k).length}</span></button>`).join('')}</div>
      <div class="lib">${list.length ? list.map(s => {
      const sc = E.score(s.metrics);
      const t = s.temaId ? E.tema(s.temaId) : null;
      return `<button class="item" data-a="abrir-script" data-s="${esc(s.id)}"><div class="top">${statusTag(s)}${s.origem === 'referencia' ? '<span class="tag">Registrado</span>' : s.origem === 'revisado' ? '<span class="tag">Revisado</span>' : ''}${s.formatoId ? `<span class="tag">${esc(fmtName(s.formatoId))}</span>` : ''}</div>
          <h4>${esc(s.titulo || 'Sem título')}</h4>
          <div class="sub">${t ? 'Tema #' + pad2(t.id) + ' ' + esc(t.nome) : 'Tema não registrado'}${s.ganchoId ? ' · Gancho #' + s.ganchoId : s.ganchoTexto ? ' · Gancho próprio' : ''}<br>${s.postadoEm ? 'Postado em ' + s.postadoEm.split('-').reverse().join('/') : dataBR(s.createdAt)}${s.duracao ? ' · ≈' + s.duracao + ' s' : ''}</div>
          <div class="foot">${sc != null ? `<span class="score">${sc}<small>score</small></span>` : `<span class="faint" style="font-size:12.5px">${s.metrics ? 'Números parciais' : 'Sem números'}</span>`}${s.metrics && Number(s.metrics.views) ? `<span class="faint mono" style="font-size:12px">${E.fmtN(s.metrics.views)} views</span>` : ''}</div></button>`;
    }).join('') : '<div class="empty">Nada aqui ainda.</div>'}</div>`;
  }

  /* =================================================================
     PERFIL
     ================================================================= */
  const PF = [
    { sec: 'Identidade', f: [['nome', 'Nome'], ['apelido', 'Como te chamam'], ['handle', '@ do Instagram'], ['assinatura', 'Assinatura da legenda', 'Primeira linha de toda legenda. Ex.: @voce | @parceiro'], ['promessa', 'Promessa da marca'], ['nicho', 'Nicho']] },
    { sec: 'Posicionamento e tom', f: [['posicionamento', 'Posicionamento', '', 'ta'], ['publico', 'Público', '', 'ta'], ['tom', 'Tom por pilar', '', 'ta']] },
    { sec: 'Ofertas e metas', f: [['ofertas', 'Ofertas (isca, produto, mentoria)', '', 'ta'], ['ctaModo', 'CTA padrão', '', 'cta'], ['bordao', 'Bordão de fechamento', 'Frase fixa que fecha todo vídeo (ex.: da série). Se vazio, a IA deixa [PREENCHER] em vez de inventar.'], ['ctaPalavra', 'Palavra-chave do CTA no direct', 'Só se der pra entregar no mesmo dia. Ex.: Comenta ROTEIRO que eu te mando o PDF'], ['seguidores', 'Seguidores hoje', '', 'num'], ['metaSeguidores', 'Meta de seguidores', '', 'num'], ['metaData', 'Prazo da meta', '', 'date'], ['metaNegocio', 'Meta de negócio'], ['mediaViews', 'Média de views por Reel', 'Opcional. Sem isso, a média é calculada a partir de 3 vídeos com números.', 'num']] },
    { sec: 'Verdade e limites', f: [['credencial', 'Credencial real', '', 'ta'], ['proibidos', 'Títulos que você NÃO pode usar', 'Separe por vírgula. A checagem automática procura por eles.'], ['permitidos', 'Como você pode se apresentar'], ['regulado', 'Meu conteúdo toca em direito, tributo, saúde ou finanças', '', 'chk'], ['disclaimer', 'Disclaimer da legenda', '', 'ta']] },
    { sec: 'Gravação e identidade visual', f: [['gravacao', 'O que você consegue gravar e editar', 'A IA só sugere recursos desta lista.', 'ta'], ['visual', 'Identidade visual', '', 'ta']] }
  ];
  function pfield([k, label, help, kind]) {
    const v = st.profile[k];
    const id = 'pf-' + k;
    if (kind === 'chk') return `<label class="check"><input type="checkbox" id="${id}" data-bind="p.${k}" ${v ? 'checked' : ''}> ${esc(label)}</label>`;
    let inp;
    if (kind === 'ta') inp = `<textarea id="${id}" data-bind="p.${k}" rows="3">${esc(v)}</textarea>`;
    else if (kind === 'cta') inp = `<select id="${id}" data-bind="p.${k}"><option value="seguir" ${v !== 'palavra' ? 'selected' : ''}>Seguir (amarrado ao próximo vídeo)</option><option value="palavra" ${v === 'palavra' ? 'selected' : ''}>Palavra-chave no direct</option></select>`;
    else inp = `<input type="${kind === 'num' ? 'number' : kind === 'date' ? 'date' : 'text'}" id="${id}" data-bind="p.${k}" value="${esc(v)}" ${kind === 'num' ? 'min="0" inputmode="numeric"' : ''}>`;
    return `<label class="field"><span>${esc(label)}</span>${inp}${help ? `<small>${esc(help)}</small>` : ''}</label>`;
  }
  function vPerfil() {
    const p = st.profile, M = st.memory, V = ui.voz;
    const sections = PF.map(s => `<section class="card psec"><h2>${s.sec}</h2>${s.f.map(pfield).join('')}</section>`).join('');
    const bioRes = ui.bio.res ? `<div class="analysis">${ui.bio.res.nome ? `<div><h5>Campo Nome</h5><div class="nextcard"><p>${esc(ui.bio.res.nome)}</p><span class="tag mono">${grafemas(ui.bio.res.nome)}/64</span><button class="btn xs" data-a="copiar-txt" data-txt="${esc(ui.bio.res.nome)}">${ic('copy', 'sm')}</button></div></div>` : ''}
      ${ui.bio.res.bios.map(b => { const n = grafemas(b.texto); return `<div><div class="nextcard" style="align-items:flex-start"><p style="white-space:pre-wrap; font-weight:500">${esc(b.texto)}<br><span class="faint" style="font-size:12.5px">${esc(b.porque || '')}</span></p><span class="tag mono ${n > 150 ? 'bad' : 'good'}">${n}/150</span><button class="btn xs" data-a="copiar-txt" data-txt="${esc(b.texto)}">${ic('copy', 'sm')}</button></div></div>`; }).join('')}</div>` : '';
    const voz = M.voz ? `<div class="voz"><p style="margin:0">${esc(M.voz.resumo || '')}</p>
      ${(M.voz.tracos || []).length ? `<ul class="list">${M.voz.tracos.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      ${(M.voz.bordoes || []).length ? `<div><div class="eyebrow" style="margin-bottom:6px">Expressões</div><div class="tags voz">${M.voz.bordoes.map(b => `<span class="tag amber">${esc(b)}</span>`).join(' ')}</div></div>` : ''}
      ${(M.voz.evitar || []).length ? `<div><div class="eyebrow" style="margin-bottom:6px">Evita</div><div>${M.voz.evitar.map(b => `<span class="tag">${esc(b)}</span>`).join(' ')}</div></div>` : ''}
      <div><button class="btn xs ghost danger" data-a="apagar-voz">${ic('trash', 'sm')} Apagar voz</button></div></div>` : '<p class="faint" style="margin:0; font-size:14px">Ainda sem voz registrada. Cole abaixo o roteiro ou a transcrição de um vídeo seu que funcionou.</p>';
    const vozRes = V.res ? `<div class="analysis"><div class="decision"><b>Voz lida</b>${esc(V.res.resumo || '')}</div>${(V.res.licoes || []).length ? `<div><h5>Lições sugeridas</h5><ul class="list">${V.res.licoes.map(l => `<li>${esc(l)}</li>`).join('')}</ul></div>` : ''}<div class="toolbar"><button class="btn sm primary" data-a="guardar-voz">${ic('check', 'sm')} Guardar na memória</button><button class="btn sm ghost" data-a="descartar-voz">Descartar</button></div></div>` : '';
    const memRow = (item, kind) => `<div class="mrow ${item.ativa === false ? 'off' : ''}">${kind !== 'fatos' ? `<input type="checkbox" style="width:18px;height:18px;accent-color:var(--amber);margin-top:3px" data-a="toggle-mem" data-k="${kind}" data-id="${esc(item.id)}" ${item.ativa !== false ? 'checked' : ''} aria-label="Usar nos roteiros">` : `<span class="dot good" style="margin-top:7px"></span>`}<p>${esc(item.texto)}<small>${esc([item.origem, item.data && (kind === 'fatos' ? 'conferido em ' + item.data : item.data)].filter(Boolean).join(' · '))}</small></p><button class="btn xs icon-btn ghost" data-a="del-mem" data-k="${kind}" data-id="${esc(item.id)}" aria-label="Apagar">${ic('trash', 'sm')}</button></div>`;
    const armed = ui.resetArm && Date.now() - ui.resetArm < 5000;
    return `<div class="vh"><div class="prof-head"><div class="avatar">${esc(initials())}</div><div><div class="eyebrow">DNA do perfil · memória da IA</div><h1 style="font-size:clamp(32px,4.4vw,52px)">${esc(p.apelido || p.nome || 'Seu perfil')}</h1></div></div>
      <p style="flex-basis:100%; margin-top:-6px">Tudo aqui entra em cada roteiro: identidade, limites, o que você grava, os fatos conferidos e o que o perfil aprendeu com os números. Salva sozinho.</p></div>
      <div class="pgrid">
        ${sections}
        <section class="card psec"><h2>Bio</h2>${pfield(['bio', 'Bio atual', '', 'ta'])}${pfield(['nomeCampo', 'Campo "Nome"'])}
          <button class="btn sm" data-a="gerar-bio" ${ui.bio.busy || ui.ai !== 'on' ? 'disabled' : ''} style="align-self:flex-start">${ic('spark', 'sm')} ${ui.bio.busy ? 'Escrevendo…' : 'Sugerir 3 bios (até 150 caracteres)'}</button>${bioRes}</section>
      </div>
      <div class="vh" style="margin-top:40px"><div><div class="eyebrow">Memória</div><h1 style="font-size:clamp(30px,4vw,46px)">O que a IA <em>aprendeu</em></h1></div></div>
      <div class="pgrid">
        <section class="card psec"><h2>Lições <span class="faint mono" style="font-size:14px">${M.licoes.filter(l => l.ativa !== false).length} ativas</span></h2>
          <div class="mem">${M.licoes.length ? M.licoes.map(l => memRow(l, 'licoes')).join('') : '<p class="faint" style="margin:0">Nenhuma lição ainda. Elas nascem da análise dos vídeos postados.</p>'}</div>
          <div style="display:flex; gap:8px"><input type="text" id="nova-licao" placeholder="Adicionar lição manual" aria-label="Nova lição"><button class="btn" data-a="add-mem" data-k="licoes">${ic('plus', 'sm')}</button></div></section>
        <section class="card psec"><h2>Sua voz</h2>${voz}
          <label class="field"><span>Ensinar minha voz</span><textarea id="voz-texto" data-bind="vozt" rows="5" placeholder="Cole o roteiro ou a transcrição de um vídeo seu">${esc(V.texto)}</textarea></label>
          <label class="field"><span>Números desse vídeo (opcional)</span><input type="text" id="voz-num" data-bind="vozn" value="${esc(V.num)}" placeholder="Ex.: 40 mil views, 600 seguidores, 3% de salvamento"></label>
          <button class="btn sm" data-a="ensinar-voz" ${V.busy || ui.ai !== 'on' ? 'disabled' : ''} style="align-self:flex-start">${ic('brain', 'sm')} ${V.busy ? 'Lendo a sua voz…' : 'Aprender com este texto'}</button>${vozRes}</section>
        <section class="card psec"><h2>Fatos conferidos <span class="faint mono" style="font-size:14px">${M.fatos.length}</span></h2>
          <p class="faint" style="margin:-6px 0 0; font-size:13.5px">A IA não tem internet. Ela só afirma o que está aqui; o resto sai marcado [CONFERIR]. Regra muda: confira de novo antes de usar.</p>
          <div class="mem">${M.fatos.map(f => memRow(f, 'fatos')).join('') || '<p class="faint" style="margin:0">Nenhum fato conferido.</p>'}</div>
          <div style="display:flex; gap:8px; align-items:flex-start"><textarea id="novo-fato" rows="2" placeholder="Fato conferido + a fonte (lei, norma, link oficial)" aria-label="Novo fato"></textarea><button class="btn" data-a="add-mem" data-k="fatos">${ic('plus', 'sm')}</button></div></section>
        <section class="card psec"><h2>Preferências</h2>
          <div class="mem">${M.prefs.length ? M.prefs.map(x => memRow(x, 'prefs')).join('') : '<p class="faint" style="margin:0; font-size:14px">Quando você ajusta um roteiro e marca "lembrar", o pedido vira preferência permanente.</p>'}</div>
          <h2 style="margin-top:14px">Dados</h2>
          <p class="muted" style="margin:0; font-size:14px">${ui.store === 'nuvem' ? 'Salvo na sua conta do Claude, privado: nem quem compartilha o app com você vê.' : 'Salvo só neste navegador. Exporte um backup de vez em quando.'}</p>
          <div class="toolbar"><button class="btn sm" data-a="exportar">${ic('download', 'sm')} Exportar backup</button><label class="btn sm" for="imp-file">${ic('upload', 'sm')} Importar backup</label><input type="file" id="imp-file" accept="application/json,.json" hidden></div>
          <div class="toolbar"><button class="btn sm" data-a="carregar-serrano">Carregar perfil de exemplo (Serrano)</button><button class="btn sm ${armed ? 'primary' : 'danger'}" data-a="zerar">${armed ? 'Confirmar: apagar tudo' : 'Começar do zero'}</button></div></section>
      </div>`;
  }

  /* =================================================================
     MODAIS
     ================================================================= */
  let lastModal = null;
  function renderModal() {
    const root = $('#overlay-root');
    const M = ui.modal;
    const prevBody = root.querySelector('.sheet-b');
    const keep = M && M === lastModal && prevBody ? prevBody.scrollTop : 0;
    lastModal = M;
    if (!M) { root.innerHTML = ''; document.body.style.overflow = ''; return; }
    document.body.style.overflow = 'hidden';
    let html = '';
    const xm = X.modals[M.type];
    if (xm) { try { html = xm(M); } catch (e) { console.error(e); html = sheetHead('Erro') + '<div class="sheet-b"><div class="empty">Não deu pra abrir esta janela. Feche e tente de novo.</div></div>'; } }
    else if (M.type === 'picker') html = pickerHTML(M);
    else if (M.type === 'script') html = scriptHTML(M);
    else if (M.type === 'registrar') html = registrarHTML(M);
    else if (M.type === 'ajuste') html = ajusteHTML(M);
    else if (M.type === 'tema') html = temaFormHTML(M);
    else if (M.type === 'prompter') html = prompterHTML(M);
    else if (M.type === 'ditar') html = ditarHTML(M);
    else if (M.type === 'import') html = importHTML(M);
    else if (M.type === 'viral-form') html = viralFormHTML(M);
    else if (M.type === 'viral') html = viralHTML(M);
    root.innerHTML = M.type === 'prompter' ? html : `<div class="overlay" data-a="overlay-bg"><div class="sheet ${M.type === 'script' || M.type === 'viral' || M.type === 'viral-form' || (xm && xm.wide) ? 'wide' : ''}" role="dialog" aria-modal="true">${html}</div></div>`;
    const nb = root.querySelector('.sheet-b'); if (nb && keep) nb.scrollTop = keep;
    const f = !keep && root.querySelector('[data-autofocus]'); if (f) setTimeout(() => f.focus({ preventScroll: true }), 30);
    if (M.type === 'prompter') startPrompter();
  }
  function closeModal() { stopPrompter(); ditarStop(); ui.modal = null; renderModal(); }
  const sheetHead = (title, extra) => `<div class="sheet-h"><h2>${title}</h2>${extra || ''}<button class="btn sm icon-btn ghost" data-a="fechar" aria-label="Fechar">${ic('x')}</button></div>`;

  function pickerHTML(M) {
    const q = E.norm(M.q || '');
    const sd = ui.studio;
    if (M.k === 'tema') {
      const uso = E.usoTema(st);
      const items = E.todosTemas().filter(t => (!M.pilar || t.pilar === M.pilar) && (!q || E.norm(t.nome + ' ' + t.frase + ' ' + t.id).includes(q)));
      return sheetHead('Escolher tema') + `<div class="sheet-tools"><div class="search" style="max-width:none">${ic('search')}<input type="search" id="pk-q" data-bind="pkq" value="${esc(M.q || '')}" placeholder="Buscar tema" data-autofocus></div>
        <div class="rail" style="margin:0"><button class="chip ${!M.pilar ? 'on' : ''}" data-a="pk-pilar" data-p="">Todos</button>${N.PILARES.map(p => `<button class="chip ${M.pilar === p.id ? 'on' : ''}" data-a="pk-pilar" data-p="${p.id}"><span class="pdot" style="--pc:${pilarColor(p.id)}"></span>${esc(p.nome)}</button>`).join('')}</div></div>
        <div class="sheet-b" id="pk-list">${items.map(t => `<button class="opt ${sd.temaId === t.id ? 'sel' : ''}" data-a="pk" data-k="tema" data-id="${t.id}"><span class="num">#${pad2(t.id)}</span><span><span class="t">${esc(t.nome)}</span><span class="s" style="display:block">${esc(t.frase)}</span></span><span class="tag"><span class="pdot" style="--pc:${pilarColor(t.pilar)}"></span>${uso[t.id] ? uso[t.id].n + '×' : 'novo'}</span></button>`).join('') || '<div class="empty">Nada encontrado.</div>'}</div>`;
    }
    if (M.k === 'formato') {
      const pf = E.agrupar(st, 'formato');
      const g = sd.ganchoId ? E.gancho(sd.ganchoId) : null;
      return sheetHead('Escolher formato') + `<div class="sheet-b">${N.FORMATOS.map(f => {
        const comp = g ? E.compat(g.id, f.id) : null;
        return `<button class="opt ${sd.formatoId === f.id ? 'sel' : ''}" data-a="pk" data-k="formato" data-id="${f.id}" style="grid-template-columns:64px minmax(0,1fr) auto">${fvHTML(f.id).replace('fv ', 'fv ').replace('class="fv', 'style="width:52px" class="fv')}<span><span class="t">${esc(f.nome)} <span class="mono faint" style="font-size:12px">${E.duracaoAlvo(f.id).join('–')} s</span></span><span class="s" style="display:block">${esc(f.serve)}</span>${comp && comp.nivel === 'forte' ? '<span class="tag good" style="margin-top:6px">Combina com o gancho</span>' : ''}</span><span>${pf[f.id] && pf[f.id].media != null ? scoreTag(pf[f.id].media) : ''}</span></button>`;
      }).join('')}</div>`;
    }
    // gancho
    const uso = E.usoGancho(st), ult = E.ultimoGancho(st);
    const fit = M.fit && sd.formatoId;
    const items = N.GANCHOS.filter(g => (!M.cat || g.cat === M.cat) && (!fit || E.cat(g.cat).formatos.includes(sd.formatoId)) && (!M.livres || (!g.gate && !g.soft)) && (!q || E.norm(g.texto).includes(q) || String(g.id) === q));
    return sheetHead('Escolher gancho') + `<div class="sheet-tools"><div class="search" style="max-width:none">${ic('search')}<input type="search" id="pk-q" data-bind="pkq" value="${esc(M.q || '')}" placeholder="Buscar por palavra ou número" data-autofocus></div>
      <div class="rail" style="margin:0">${sd.formatoId ? `<button class="chip ${fit ? 'on' : ''}" data-a="pk-fit">Combina com ${esc(fmtName(sd.formatoId))}</button>` : ''}<button class="chip ${M.livres ? 'on' : ''}" data-a="pk-livres">Sem trava</button><button class="chip ${!M.cat ? 'on' : ''}" data-a="pk-cat" data-c="0">Todas</button>${N.CATS.map(c => `<button class="chip ${M.cat === c.id ? 'on' : ''}" data-a="pk-cat" data-c="${c.id}">${esc(c.nome)}</button>`).join('')}</div></div>
      <div class="sheet-b" id="pk-list">${items.map(g => `<button class="opt ${sd.ganchoId === g.id ? 'sel' : ''}" data-a="pk" data-k="gancho" data-id="${g.id}" ${g.id === ult ? 'disabled style="opacity:.45"' : ''}><span class="num">#${g.id}</span><span><span class="t">“${esc(g.texto)}”</span><span class="s" style="display:block">${esc(catName(g.cat))}${g.gate === 'fato' ? ' · exige fato real' : g.gate === 'numero' ? ' · exige fonte do número' : ''}${g.id === ult ? ' · foi o último usado' : uso[g.id] ? ' · usado ' + uso[g.id].n + '×' : ''}</span></span><span></span></button>`).join('') || '<div class="empty">Nada encontrado.</div>'}</div>`;
  }

  function metricsForm(d) {
    const F = [['views', 'Views'], ['alcance', 'Contas alcançadas'], ['curtidas', 'Curtidas'], ['comentarios', 'Comentários'], ['salvamentos', 'Salvamentos'], ['compartilhamentos', 'Compartilhamentos'], ['seguidores', 'Seguidores ganhos'], ['visitas', 'Visitas ao perfil'], ['naoSeguidores', '% não seguidores'], ['abaReels', '% vindo da Aba Reels'], ['pulados', '% reels pulados']];
    return `<div class="metrics-grid">${F.map(([k, l]) => `<label class="field"><span>${l}</span><input type="number" min="0" step="any" inputmode="decimal" id="m-${k}" data-bind="m.${k}" value="${esc(d[k] != null ? d[k] : '')}"></label>`).join('')}
      <label class="field" style="grid-column:1/-1"><span>Onde a retenção despenca (opcional)</span><input type="text" id="m-retencao" data-bind="m.retencao" value="${esc(d.retencao || '')}" placeholder="Ex.: caiu pra 50% aos 8 s"></label></div>`;
  }

  function scriptHTML(M) {
    const s = scriptById(M.id);
    if (!s) return sheetHead('Roteiro') + '<div class="sheet-b"><div class="empty">Esse item não existe mais.</div></div>';
    const d = M.draft;
    const sc = E.score(s.metrics);
    const tx = E.taxas(s.metrics);
    const mv = E.mediaViews(st);
    const ratio = mv && s.metrics && Number(s.metrics.views) ? Number(s.metrics.views) / mv : null;
    const forte = (sc != null && sc >= 75) || (ratio && ratio >= 5);
    const A = s.analise;
    const armed = M.delArm && Date.now() - M.delArm < 5000;
    const rateTag = (lbl, v, ref) => v == null ? '' : `<span class="tag ${v >= ref ? 'good' : v >= ref / 2 ? 'amber' : 'bad'}">${lbl} ${v.toFixed(v < 1 ? 2 : 1)}%</span>`;
    return sheetHead(esc(s.titulo || 'Roteiro'), `<div class="seg" role="group" aria-label="Status">${['rascunho', 'gravado', 'postado'].map(k => `<button type="button" data-a="status" data-v="${k}" aria-pressed="${s.status === k}">${k[0].toUpperCase() + k.slice(1)}</button>`).join('')}</div>`) + `
      <div class="sheet-b">
        <div class="toolbar" style="margin-bottom:18px">
          ${s.raw && !M.editing ? `<button class="btn sm" data-a="script-estudio">${ic('estudio', 'sm')} Abrir no Estúdio</button><button class="btn sm" data-a="script-prompter">${ic('scroll', 'sm')} Teleprompter</button><button class="btn sm" data-a="script-copiar">${ic('copy', 'sm')} Copiar tudo</button><button class="btn sm" data-a="editar-script">${ic('edit', 'sm')} Editar roteiro</button>` : ''}
          ${s.raw && M.editing ? `<button class="btn sm ghost" data-a="cancelar-edicao-script">${ic('x', 'sm')} Cancelar</button><button class="btn sm primary" data-a="salvar-edicao-script">${ic('check', 'sm')} Salvar edição</button>` : ''}
          ${forte && !M.editing ? `<button class="btn sm primary" data-a="doubling">${ic('layers', 'sm')} Parte 2 em até 48 h</button>` : ''}
          <span style="flex:1"></span>
          <button class="btn sm ${armed ? 'primary' : 'ghost danger'}" data-a="del-script">${ic('trash', 'sm')} ${armed ? 'Confirmar exclusão' : 'Excluir'}</button>
        </div>
        ${s.nota ? `<div class="why" style="margin-bottom:16px">${esc(s.nota)}</div>` : ''}
        ${M.editing ? '' : `<div class="card" style="padding:18px; background:var(--panel2)">
          <label class="field" style="margin-bottom:14px"><span>Nome do roteiro</span><input type="text" id="m-titulo" data-bind="m.titulo" value="${esc(d.titulo || '')}"></label>
          <div class="blk-h"><h3>Números do post</h3><button class="btn xs" data-a="ditar-script" title="Falar os números deste vídeo">${ic('mic', 'sm')} Ditar</button>${sc != null ? `<span class="score">${sc}<small>score</small></span>` : ''}</div>
          ${tx ? `<div class="rates" style="margin-bottom:14px">${rateTag('Seguidores', tx.seguidores, E.REF.seguidores)}${rateTag('Salvamentos', tx.salvamentos, E.REF.salvamentos)}${rateTag('Compart.', tx.compartilhamentos, E.REF.compartilhamentos)}${rateTag('Comentários', tx.comentarios, E.REF.comentarios)}${ratio ? `<span class="tag ${ratio >= 5 ? 'good' : ''}">${ratio.toFixed(1)}× a média</span>` : ''}</div>` : ''}
          ${metricsForm(d)}
          <div class="two" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:10px; margin-top:10px">
            <label class="field"><span>Postado em</span><input type="date" id="m-postado" data-bind="m.postadoEm" value="${esc(d.postadoEm || '')}"></label>
            <label class="field"><span>Duração real (s)</span><input type="number" min="0" id="m-dur" data-bind="m.duracao" value="${esc(d.duracao || '')}"></label>
            <label class="field"><span>Gancho usado (#)</span><input type="number" min="1" max="${N.GANCHOS.length}" id="m-gancho" data-bind="m.ganchoId" value="${esc(d.ganchoId || '')}"></label>
            <label class="field"><span>Formato</span><select id="m-formato" data-bind="m.formatoId"><option value="">—</option>${N.FORMATOS.map(f => `<option value="${f.id}" ${d.formatoId === f.id ? 'selected' : ''}>${esc(f.nome)}</option>`).join('')}</select></label>
          </div>
          <div class="toolbar" style="margin-top:14px"><button class="btn sm primary" data-a="salvar-metricas">${ic('check', 'sm')} Salvar desempenho</button>
          <button class="btn sm" data-a="analisar" ${M.busy || ui.ai !== 'on' || !(s.metrics && (s.metrics.views || s.metrics.pulados)) ? 'disabled' : ''}>${ic('spark', 'sm')} ${M.busy ? 'Analisando…' : 'Analisar com IA'}</button>
          ${!(s.metrics && (s.metrics.views || s.metrics.pulados)) ? '<span class="faint" style="font-size:12.5px">Salve os números pra liberar a análise.</span>' : ''}</div>
          ${M.err ? `<div class="errnote">${ic('alert', 'sm')}<span>${esc(M.err)}</span></div>` : ''}
          ${A ? analiseHTML(A, M) : ''}
        </div>
        ${sc != null && s.ganchoId ? `<div style="margin-top:16px">${recHTML(true)}</div>` : ''}`}
        ${M.editing ? `<div>${editorHTML(M.editDraft, 'edit-script', 'editscript', true)}</div>`
        : s.raw ? `<div style="margin-top:22px">${roteiroHTML(s.raw, { temaId: s.temaId, ganchoId: s.ganchoId, formatoId: s.formatoId, colchetes: s.colchetes || [] }, { checks: true, where: 'modal' })}${s.stories ? `<div class="blk"><div class="blk-h"><h3>Stories</h3></div>${storiesHTML(s.stories)}</div>` : ''}</div>` : '<p class="faint" style="margin-top:18px">Vídeo registrado sem roteiro: entra no aprendizado pelos números.</p>'}
      </div>`;
  }
  function analiseHTML(A, M) {
    const lab = { regravar: 'Regravar', doubling_down: 'Doubling Down', descartar: 'Descartar', manter: 'Manter e seguir' }[A.decisao] || A.decisao;
    const g = A.novoGancho ? E.gancho(A.novoGancho) : null;
    const sel = M.licSel || {};
    return `<div class="analysis">
      <div class="decision"><b>${esc(lab)}</b>${esc(A.decisaoPorque || '')}</div>
      ${(A.diagnostico || []).length ? `<div><h5>Diagnóstico</h5><ul class="list">${A.diagnostico.map(x => `<li><b>${esc(x.numero)}</b> — ${esc(x.causa)}</li>`).join('')}</ul></div>` : ''}
      ${(A.manter || []).length ? `<div><h5>Manter</h5><ul class="list">${A.manter.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
      ${(A.mudar || []).length ? `<div><h5>Mudar</h5><ul class="list warnlist">${A.mudar.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
      ${g ? `<div><h5>Gancho pra regravar</h5><div class="nextcard"><p>#${g.id} “${esc(g.texto)}”</p><button class="btn xs" data-a="usar-gancho" data-g="${g.id}">Usar</button></div></div>` : ''}
      ${(A.licoes || []).length ? `<div><h5>O perfil aprendeu</h5>${A.licoes.map((l, i) => `<label class="check" style="align-items:flex-start; margin-bottom:8px"><input type="checkbox" data-a="lic-sel" data-i="${i}" ${sel[i] !== false ? 'checked' : ''}> <span>${esc(l)}</span></label>`).join('')}
        ${A.guardadas ? '<span class="tag good">Guardadas na memória</span>' : `<button class="btn sm primary" data-a="guardar-licoes">${ic('brain', 'sm')} Guardar na memória</button>`}</div>` : ''}
    </div>`;
  }

  function registrarHTML(M) {
    const d = M.draft;
    return sheetHead('Registrar vídeo postado') + `<div class="sheet-b" style="display:flex; flex-direction:column; gap:14px">
      <p class="muted" style="margin:0; font-size:14px">Vídeo que você já postou (feito aqui ou não). Os números entram no score de formatos e ganchos.</p>
      <label class="field"><span>Título ou assunto</span><input type="text" id="r-titulo" data-bind="m.titulo" value="${esc(d.titulo || '')}" data-autofocus></label>
      <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(170px,1fr)); gap:10px">
        <label class="field"><span>Formato</span><select id="r-formato" data-bind="m.formatoId"><option value="">—</option>${N.FORMATOS.map(f => `<option value="${f.id}" ${d.formatoId === f.id ? 'selected' : ''}>${esc(f.nome)}</option>`).join('')}</select></label>
        <label class="field"><span>Tema (#)</span><input type="number" min="1" max="60" id="r-tema" data-bind="m.temaId" value="${esc(d.temaId || '')}"></label>
        <label class="field"><span>Gancho (#)</span><input type="number" min="1" max="${N.GANCHOS.length}" id="r-gancho" data-bind="m.ganchoId" value="${esc(d.ganchoId || '')}"></label>
        <label class="field"><span>Postado em</span><input type="date" id="r-data" data-bind="m.postadoEm" value="${esc(d.postadoEm || '')}"></label>
        <label class="field"><span>Duração (s)</span><input type="number" min="0" id="r-dur" data-bind="m.duracao" value="${esc(d.duracao || '')}"></label>
      </div>
      ${metricsForm(d)}
      <label class="field"><span>Nota</span><textarea id="r-nota" data-bind="m.nota" rows="2">${esc(d.nota || '')}</textarea></label>
      <div class="toolbar"><button class="btn primary" data-a="salvar-registro">${ic('check', 'sm')} Registrar</button><button class="btn ghost" data-a="fechar">Cancelar</button></div></div>`;
  }

  function ajusteHTML(M) {
    const quick = ['Mais curto: corte pra 35 segundos', 'Primeiro item antes dos 8 segundos', 'Mais humor e autoironia', 'Linguagem ainda mais simples', 'Trocar o exemplo por um de criador de conteúdo', 'Legenda com CTA de palavra-chave'];
    return sheetHead('Ajustar roteiro') + `<div class="sheet-b" style="display:flex; flex-direction:column; gap:14px">
      <p class="muted" style="margin:0; font-size:14px">O gancho, o tema e o formato ficam. O resto é reescrito com o seu pedido.</p>
      <div class="rail" style="flex-wrap:wrap">${quick.map(q => `<button class="chip" data-a="ajuste-rapido" data-t="${esc(q)}">${esc(q)}</button>`).join('')}</div>
      <label class="field"><span>O que mudar</span><textarea id="aj-texto" data-bind="aj" rows="4" data-autofocus placeholder="Ex.: o Ato 2 está com cara de aula, quero mais dor e menos explicação">${esc(M.texto || '')}</textarea></label>
      <label class="check"><input type="checkbox" id="aj-lembrar" data-bind="ajl" ${M.lembrar ? 'checked' : ''}> Lembrar como preferência em todos os próximos roteiros</label>
      <div class="toolbar"><button class="btn primary" data-a="aplicar-ajuste">${ic('play', 'sm')} Reescrever</button><button class="btn ghost" data-a="fechar">Cancelar</button></div></div>`;
  }

  function temaFormHTML(M) {
    const c = st.bank.temas[M.i] || {};
    return sheetHead(`Tema #${M.i} — Crescimento Pessoal`) + `<div class="sheet-b" style="display:flex; flex-direction:column; gap:14px">
      <p class="muted" style="margin:0; font-size:14px">O banco oficial veio sem os 15 temas deste pilar. Este é seu: nome, frase-mãe e um contexto curto.</p>
      <label class="field"><span>Nome do tema</span><input type="text" id="tm-nome" value="${esc(c.nome || '')}" data-autofocus></label>
      <label class="field"><span>Frase-mãe</span><textarea id="tm-frase" rows="2">${esc(c.frase || '')}</textarea></label>
      <label class="field"><span>Contexto (opcional)</span><input type="text" id="tm-nota" value="${esc(c.nota || '')}"></label>
      <div class="toolbar"><button class="btn primary" data-a="salvar-tema">${ic('check', 'sm')} Salvar tema</button>${c.nome ? `<button class="btn ghost danger" data-a="del-tema">${ic('trash', 'sm')} Remover</button>` : ''}<button class="btn ghost" data-a="fechar">Cancelar</button></div></div>`;
  }

  function importHTML(M) {
    return sheetHead('Importar backup') + `<div class="sheet-b" style="display:flex; flex-direction:column; gap:14px">
      <p style="margin:0">Backup de <b>${esc(M.data.profile.handle || M.data.profile.nome || 'perfil sem nome')}</b> com ${M.data.scripts.length} roteiros, ${M.data.memory.licoes.length} lições e ${M.data.memory.fatos.length} fatos.</p>
      <p class="muted" style="margin:0">Importar substitui o perfil, a memória e a biblioteca atuais.</p>
      <div class="toolbar"><button class="btn primary" data-a="confirmar-import">Substituir pelo backup</button><button class="btn ghost" data-a="fechar">Cancelar</button></div></div>`;
  }

  /* ---------- teleprompter ---------- */
  let pRaf = 0, pLast = 0;
  const fmtT = s => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const pStore = (k, v) => { try { localStorage.setItem('ndi:' + k, String(v)); } catch (e) { } };
  function pSpeedNow(M, el) {
    if (M.auto) { const max = Math.max(1, el.scrollHeight - el.clientHeight); return max / Math.max(5, M.dur) * (M.fator / 100); }
    return M.speed;
  }
  function pSpeedLabel(M) { return M.auto ? M.fator + '%' : M.speed + ' px/s'; }
  function prompterHTML(M) {
    const P = E.parse(M.raw);
    const labs = ['GANCHO', 'PROBLEMA', 'SOLUÇÃO', 'CTA'];
    const body = ['ATO1', 'ATO2', 'ATO3', 'ATO4'].map((k, i) => P[k] == null ? '' : `<div class="pact">${labs[i]}</div>` + E.linhas(P[k]).map(l => { const f = E.fala(l); return `<p class="pl ${f.star ? 'star' : ''}" style="font-size:${M.size}px">${f.quem ? '[' + esc(f.quem) + '] ' : ''}${esc(f.texto)}</p>`; }).join('')).join('');
    const rolando = M.playing || M.count > 0;
    return `<div class="prompter ${M.mirror ? 'mirror' : ''}" role="dialog" aria-modal="true" aria-label="Teleprompter"><div class="guide"></div>
      <button class="btn pback" data-a="fechar" aria-label="Voltar à tela anterior">${ic('arrow', 'sm')} Voltar</button>
      <div class="pclock" aria-live="off"><b id="p-clock">${fmtT(M.elapsed)}</b><span> / ${fmtT(M.dur)}</span></div>
      <div class="pcount" id="p-count">${M.count > 0 ? Math.ceil(M.count) : ''}</div>
      <div class="scroller" id="p-scroll" data-a="p-tap" title="Toque no texto pra pausar ou continuar"><div class="inner">${body}</div></div>
      <div class="ctl"><button class="btn" data-a="p-play">${ic(rolando ? 'pause' : 'play', 'sm')} ${M.count > 0 ? 'Cancelar' : M.playing ? 'Pausar' : 'Rolar'}</button>
      <div class="seg" role="group" aria-label="Modo de rolagem"><button type="button" data-a="p-auto" data-v="1" aria-pressed="${M.auto}" title="Rola sozinho e termina na duração estimada do roteiro">Pelo tempo</button><button type="button" data-a="p-auto" data-v="0" aria-pressed="${!M.auto}" title="Velocidade fixa">Manual</button></div>
      <div class="ppresets" role="group" aria-label="Velocidade">${(M.auto ? [50, 75, 100, 125, 150] : [20, 35, 50, 75, 100]).map(v => `<button type="button" data-a="p-preset" data-v="${v}" aria-pressed="${(M.auto ? M.fator : M.speed) === v}">${M.auto ? v + '%' : v}</button>`).join('')}</div>
      <div class="pspeed"><button class="btn icon-btn" data-a="p-vel" data-d="-5" aria-label="Mais devagar">${ic('minus', 'sm')}</button>
      <label><span id="p-sl">${M.auto ? 'Ritmo' : 'Velocidade'}</span> <input type="range" min="${M.auto ? 50 : 10}" max="${M.auto ? 160 : 140}" step="5" id="p-speed" data-bind="psp" value="${M.auto ? M.fator : M.speed}"><b id="p-sv">${pSpeedLabel(M)}</b></label>
      <button class="btn icon-btn" data-a="p-vel" data-d="5" aria-label="Mais rápido">${ic('plus', 'sm')}</button></div>
      <button class="btn" data-a="p-contagem" aria-pressed="${M.contagem}" title="Contagem 3-2-1 antes de rolar">${M.contagem ? 'Contagem: sim' : 'Contagem: não'}</button>
      <button class="btn icon-btn" data-a="p-size" data-d="-4" aria-label="Diminuir letra">${ic('minus', 'sm')}</button><button class="btn icon-btn" data-a="p-size" data-d="4" aria-label="Aumentar letra">${ic('plus', 'sm')}</button>
      <button class="btn" data-a="p-mirror">${ic('flip', 'sm')} Espelhar</button><button class="btn" data-a="p-top">Do início</button><button class="btn" data-a="fechar">${ic('x', 'sm')} Sair</button></div></div>`;
  }
  function startPrompter() {
    stopPrompter();
    const tick = t => {
      const M = ui.modal; if (!M || M.type !== 'prompter') return;
      const el = $('#p-scroll');
      const dt = pLast ? Math.min(0.1, (t - pLast) / 1000) : 0; pLast = t;
      if (M.count > 0) {
        M.count -= dt;
        if (M.count <= 0) { M.count = 0; M.playing = true; if (el) M.pos = el.scrollTop; renderModal(); return; }
        const c = $('#p-count'); if (c) c.textContent = Math.ceil(M.count);
      } else if (el && M.playing) {
        const max = Math.max(0, el.scrollHeight - el.clientHeight);
        M.pos = (M.pos || el.scrollTop) + pSpeedNow(M, el) * dt; el.scrollTop = M.pos; M.elapsed += dt;
        const ck = $('#p-clock'); if (ck) ck.textContent = fmtT(M.elapsed);
        if (M.pos >= max - 1 && max > 0) { M.playing = false; M.pos = max; renderModal(); return; }
      }
      pRaf = requestAnimationFrame(tick);
    };
    const el = $('#p-scroll'); if (el && ui.modal.pos) el.scrollTop = ui.modal.pos;
    pLast = 0; pRaf = requestAnimationFrame(tick);
  }
  function stopPrompter() { cancelAnimationFrame(pRaf); pRaf = 0; }
  function openPrompter(raw) {
    let size = 40, speed = 45, fator = 100, auto = true, contagem = true;
    try {
      size = Number(localStorage.getItem('ndi:psize')) || 40; speed = Number(localStorage.getItem('ndi:pspeed')) || 45; fator = Number(localStorage.getItem('ndi:pfator')) || 100;
      auto = localStorage.getItem('ndi:pauto') !== '0'; contagem = localStorage.getItem('ndi:pcount') !== '0';
    } catch (e) { }
    const dur = E.duracao(E.parse(raw)) || 30;
    ui.modal = { type: 'prompter', raw, size, speed, fator, auto, contagem, dur, elapsed: 0, count: 0, playing: false, mirror: false, pos: 0 };
    renderModal();
  }

  /* ---------- ditar métricas ---------- */
  let rec = null;
  const METRICAS = [['views', 'Views'], ['alcance', 'Alcance'], ['curtidas', 'Curtidas'], ['comentarios', 'Comentários'], ['salvamentos', 'Salvamentos'], ['compartilhamentos', 'Compartilhamentos'], ['seguidores', 'Seguidores ganhos'], ['visitas', 'Visitas ao perfil'], ['naoSeguidores', '% não seguidores'], ['abaReels', '% Aba Reels'], ['pulados', '% pulados']];
  function ditarStop() { if (rec) { try { rec.abort(); } catch (e) { } rec = null; } }
  function abrirDitar(alvo) { ui.modal = { type: 'ditar', alvo: alvo || null, texto: '', interim: '', ouvindo: false, busy: false, err: '', res: null }; renderModal(); }
  function ditarHTML(M) {
    const alvo = M.alvo ? scriptById(M.alvo) : null;
    const nome = s => esc(s.titulo || 'sem título') + (s.postadoEm ? ' · ' + s.postadoEm.split('-').reverse().join('/') : '');
    const opts = sel => `<option value="">— não aplicar —</option>` + st.scripts.map(s => `<option value="${s.id}" ${sel === s.id ? 'selected' : ''}>${nome(s)}</option>`).join('');
    let res = '';
    if (M.res) {
      res = `<div><h5>Conferir antes de aplicar</h5>${M.res.map((r, i) => `<div class="card" style="padding:12px; margin-bottom:10px; background:var(--panel2)">
        <label class="field"><span>${r.referencia ? 'Você disse: “' + esc(r.referencia) + '”. Vídeo:' : 'Vídeo:'}</span><select data-bind="dtsel" data-i="${i}">${opts(r.id)}</select></label>
        <div class="rates" style="margin-top:8px">${METRICAS.filter(([k]) => r.metricas[k] != null).map(([k, l]) => `<span class="tag">${esc(l)}: <b>${esc(String(r.metricas[k]))}</b></span>`).join('') || '<span class="faint">Nenhum número reconhecido.</span>'}${r.retencao ? `<span class="tag">Retenção: ${esc(r.retencao)}</span>` : ''}</div>
        ${r.duvida ? `<p class="faint" style="margin:8px 0 0; font-size:13px">${ic('alert', 'sm')} ${esc(r.duvida)}</p>` : ''}</div>`).join('')}
        <div class="toolbar"><button class="btn primary" data-a="ditar-aplicar" ${M.res.some(r => r.id) ? '' : 'disabled'}>${ic('check', 'sm')} Aplicar nos vídeos</button></div></div>`;
    }
    return sheetHead('Ditar métricas') + `<div class="sheet-b" style="display:flex; flex-direction:column; gap:14px">
      <p class="muted" style="margin:0; font-size:14px">${alvo ? `Números de “${esc(alvo.titulo || 'sem título')}”.` : 'Fale os números de um ou de vários vídeos.'} Ex.: “O vídeo do gancho do imposto teve 12 mil views, 340 salvamentos, 80 compartilhamentos e 25 seguidores novos.” A IA entende “mil”, “vírgula” e distribui em cada vídeo; você confere antes de salvar.</p>
      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap">
        <button class="btn ${M.ouvindo ? 'primary mic-on' : ''}" data-a="ditar-mic" aria-pressed="${M.ouvindo}">${ic(M.ouvindo ? 'stop' : 'mic', 'sm')} ${M.ouvindo ? 'Parar de ouvir' : 'Clicar e falar'}</button>
        <span class="faint" id="dt-interim" style="font-size:13px">${esc(M.interim)}</span></div>
      <label class="field"><span>Transcrição (pode editar ou digitar)</span><textarea id="dt-texto" data-bind="dtt" rows="5" placeholder="Os números ditados aparecem aqui.">${esc(M.texto)}</textarea></label>
      ${M.err ? `<div class="errnote">${ic('alert', 'sm')}<span>${esc(M.err)}</span></div>` : ''}
      <div class="toolbar"><button class="btn ${M.res ? '' : 'primary'}" data-a="ditar-ler" ${M.busy || ui.ai !== 'on' || M.texto.trim().length < 5 ? 'disabled' : ''}>${ic('spark', 'sm')} ${M.busy ? 'Distribuindo…' : 'Distribuir nos vídeos'}</button>
      ${ui.ai !== 'on' ? '<span class="faint" style="font-size:12.5px">Precisa da IA ativa (abra no Claude).</span>' : ''}</div>
      ${res}</div>`;
  }
  function ditarMic() {
    const M = ui.modal; if (!M || M.type !== 'ditar') return;
    if (rec) { rec.stop(); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { M.err = 'O ditado por voz não está disponível aqui. Use o ditado do teclado (celular, ou Windows + H no computador) dentro do campo abaixo, ou digite.'; renderModal(); return; }
    rec = new SR(); rec.lang = 'pt-BR'; rec.continuous = true; rec.interimResults = true;
    rec.onresult = e => {
      let fin = '', inte = '';
      for (let i = e.resultIndex; i < e.results.length; i++) { const r = e.results[i]; if (r.isFinal) fin += r[0].transcript + ' '; else inte += r[0].transcript; }
      if (fin) { M.texto = (M.texto ? M.texto.replace(/\s+$/, '') + ' ' : '') + fin.trim(); const t = $('#dt-texto'); if (t) t.value = M.texto; }
      M.interim = inte; const x = $('#dt-interim'); if (x) x.textContent = inte;
    };
    rec.onerror = e => { M.err = e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'O microfone está bloqueado neste navegador. Libere o acesso ao microfone, ou use o ditado do teclado no campo abaixo.' : e.error === 'no-speech' ? '' : 'Não consegui ouvir (' + e.error + '). Tente de novo ou digite.'; };
    rec.onend = () => { rec = null; M.ouvindo = false; M.interim = ''; if (ui.modal === M) renderModal(); };
    try { rec.start(); M.ouvindo = true; M.err = ''; } catch (e) { rec = null; M.err = 'Não consegui abrir o microfone.'; }
    renderModal();
  }
  async function ditarLer() {
    const M = ui.modal; if (!M || M.type !== 'ditar' || !sampleFn) return;
    if (rec) rec.stop();
    const cand = (M.alvo ? [scriptById(M.alvo)] : st.scripts.slice().sort((a, b) => (b.postadoEm || '').localeCompare(a.postadoEm || '') || (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 40)).filter(Boolean);
    const lista = cand.map((s, n) => {
      const P = E.parse(s.raw || ''), a1 = E.linhas(P.ATO1).map(l => E.fala(l).texto).join(' ').slice(0, 90);
      return `${n + 1}. id=${s.id} | título: ${s.titulo || 'sem título'} | postado: ${s.postadoEm || 'não informado'} | formato: ${s.formatoId || '-'} | abre com: ${a1 || (s.ganchoTexto || '-')}`;
    }).join('\n');
    const prompt = `Você organiza métricas de Reels ditadas por voz em português do Brasil.
VÍDEOS DISPONÍVEIS (use só estes ids):
${lista}

TRANSCRIÇÃO DITADA:
<<<
${M.texto.trim().slice(0, 4000)}
>>>

REGRAS:
- Cada vídeo citado vira um item. Ligue ao id pelo título, assunto, gancho, data ("o de ontem", "o primeiro", "o último") ou ordem. ${M.alvo ? 'Todos os números são do único vídeo listado.' : 'Se não der pra ter certeza, id = null e explique em "duvida".'}
- Converta números falados: "doze mil" = 12000, "1,2 mil" = 1200, "dois milhões e meio" = 2500000, "trezentos e quarenta" = 340. Porcentagens como número de 0 a 100.
- Campos permitidos em "metricas": views, alcance, curtidas, comentarios, salvamentos, compartilhamentos, seguidores (ganhos), visitas, naoSeguidores (%), abaReels (%), pulados (%). Só inclua o que foi dito. Nunca invente número.
- "retencao": texto curto se a pessoa disse onde o público sai; senão "".
- "referencia": as palavras que a pessoa usou pra citar o vídeo.
Responda só com JSON: {"videos":[{"id":"...","referencia":"...","metricas":{"views":0},"retencao":"","duvida":""}]}`;
    M.busy = true; M.err = ''; M.res = null; renderModal();
    try {
      const r = await sampleFn.json(prompt, { modelTier: 'default', cache: false });
      const ids = new Set(cand.map(s => s.id));
      const vids = (r && Array.isArray(r.videos) ? r.videos : []).map(v => {
        const m = {};
        METRICAS.forEach(([k]) => { const n = Number(v && v.metricas && v.metricas[k]); if (v && v.metricas && v.metricas[k] != null && isFinite(n) && n >= 0) m[k] = n; });
        return { id: v && ids.has(v.id) ? v.id : (M.alvo || null), referencia: String(v && v.referencia || ''), metricas: m, retencao: String(v && v.retencao || ''), duvida: String(v && v.duvida || '') };
      }).filter(v => Object.keys(v.metricas).length || v.retencao);
      if (!vids.length) throw { code: 'invalid_json' };
      M.res = vids;
    } catch (e) { M.err = sampleErr(e).msg; }
    M.busy = false; if (ui.modal === M) renderModal();
  }
  function ditarAplicar() {
    const M = ui.modal; if (!M || !M.res) return;
    let n = 0; const tocados = [];
    M.res.forEach(r => {
      const s = r.id && scriptById(r.id); if (!s) return;
      const d = draftFrom(s);
      Object.keys(r.metricas).forEach(k => { d[k] = r.metricas[k]; });
      if (r.retencao) d.retencao = r.retencao;
      applyDraft(s, d);
      if (s.metrics && s.metrics.views && s.status !== 'postado') s.status = 'postado';
      Store.saveScript(s); n++; tocados.push(s.id);
    });
    if (!n) { toast('Escolha o vídeo de cada item.', 'warn'); return; }
    const alvo = M.alvo;
    ui.modal = alvo && scriptById(alvo) ? { type: 'script', id: alvo, draft: draftFrom(scriptById(alvo)) } : null;
    renderModal(); renderChrome(); if (ui.view === 'biblioteca') $('#main').innerHTML = vBiblioteca();
    toast(`Métricas salvas em ${n} vídeo${n > 1 ? 's' : ''}. O app já usa isso no aprendizado.`);
  }

  /* =================================================================
     EVENTOS
     ================================================================= */
  const A = {};
  A.nav = el => { ui.modal = null; go(el.dataset.v); };
  A.modo = el => setModo(el.dataset.m);
  A.picker = el => { ui.modal = { type: 'picker', k: el.dataset.k, q: '', cat: 0, pilar: '', fit: el.dataset.k === 'gancho' && !!ui.studio.formatoId, livres: false }; renderModal(); };
  A['pk-pilar'] = el => { ui.modal.pilar = el.dataset.p; renderModal(); };
  A['pk-cat'] = el => { ui.modal.cat = Number(el.dataset.c); renderModal(); };
  A['pk-fit'] = () => { ui.modal.fit = !ui.modal.fit; renderModal(); };
  A['pk-livres'] = () => { ui.modal.livres = !ui.modal.livres; renderModal(); };
  A.pk = el => {
    const k = el.dataset.k, id = el.dataset.id, sd = ui.studio;
    if (k === 'tema') sd.temaId = Number(id);
    if (k === 'formato') sd.formatoId = id;
    if (k === 'gancho') { if (Number(id) !== sd.ganchoId) { sd.colchetes = []; sd.fonte = ''; } sd.ganchoId = Number(id); sd.ganchoModo = 'banco'; }
    sd.why = '';
    closeModal(); renderSlate();
  };
  A.fechar = () => closeModal();
  A['overlay-bg'] = (el, e) => { if (e.target === el) closeModal(); };
  A.tier = el => { ui.studio.tier = el.dataset.t; try { localStorage.setItem('ndi:tier', ui.studio.tier); } catch (e) { } renderSlate(); };
  A.surpresa = () => {
    const s = E.sugerir(st, (Date.now() % 100000) + 1);
    Object.assign(ui.studio, { formatoId: s.formatoId, inspiracao: s.ganchoId || null, why: s.why });
    renderSlate();
  };
  A['gancho-modo'] = el => { ui.studio.ganchoModo = el.dataset.m; renderSlate(); };
  A['limpar-tema'] = () => { ui.studio.temaId = null; renderSlate(); };
  A['limpar-serie'] = () => { ui.studio.serie = null; ui.studio.why = ''; renderSlate(); };
  A['criar-juntos'] = () => { ui.juntos.ideia = (ui.studio.assunto || '').trim() || ui.juntos.ideia; setModo('juntos'); };
  A['jt-start'] = () => jtStart();
  A['jt-enviar'] = () => jtEnviar();
  A['jt-fechar'] = () => jtFechar();
  A['jt-recomecar'] = () => jtRecomecar();
  A['jt-serie'] = el => jtSerie(el.dataset.ep);
  A['jt-parar'] = () => { if (ui.juntos.ctl) ui.juntos.ctl.abort(); };
  A['jt-voltar'] = () => { ui.juntos.fase = 'chat'; renderOut(); renderSlate(); };
  A['usar-gancho-texto'] = el => {
    const sd = ui.studio;
    Object.assign(sd, { ganchoModo: 'meu', ganchoTexto: el.dataset.txt || '', ganchoTravado: false, mode: 'criar', why: '' });
    go('estudio');
    toast('Gancho no Estúdio. Edite se quiser e rode o take.');
  };
  A['adaptar-gancho'] = el => {
    const g = E.gancho(Number(el.dataset.g)); if (!g) return;
    const sd = ui.studio;
    Object.assign(sd, { ganchoModo: 'meu', ganchoTexto: E.textoGancho(g, []), ganchoTravado: false, inspiracao: null, mode: 'criar', why: 'Gancho do banco como ponto de partida: reescreva do seu jeito, com a sua situação.' });
    ui.modal = null;
    if (ui.view !== 'estudio') go('estudio'); else { render(); }
    toast('Gancho copiado como rascunho. Reescreva do seu jeito.');
  };
  A['usar-alt'] = el => {
    const P = E.parse(ui.gen.raw), a = E.alternativosTodos(P)[Number(el.dataset.i)];
    if (!a) return;
    ajustar(`Troque o gancho do Ato 1 por esta versão (mantenha o resto coerente e a duração): "${a.texto}". O gancho anterior vira a primeira versão alternativa.`, false);
  };
  A.gerar = () => gerar();
  A['copiar-prompt'] = () => copiarPrompt();
  A.parar = () => { if (ui.gen.ctl) ui.gen.ctl.abort(); };
  A['limpar-continua'] = () => { ui.studio.continua = null; renderSlate(); };
  A['limpar-modelo'] = () => { ui.studio.modelo = null; ui.studio.why = ''; renderSlate(); };
  A.vf = el => { ui.vf = el.dataset.f; render(); };
  A['add-viral'] = () => { ui.modal = { type: 'viral-form', id: null, draft: viralDraft(null), files: [], urls: [] }; renderModal(); };
  A['abrir-viral'] = el => { if (!viralById(el.dataset.v)) return; ui.modal = { type: 'viral', id: el.dataset.v }; renderModal(); };
  A['edit-viral'] = () => { const v = viralById(ui.modal.id); if (!v) return; const files = (viralFiles[v.id] || []).slice(); ui.modal = { type: 'viral-form', id: v.id, draft: viralDraft(v), files, urls: files.map(f => URL.createObjectURL(f)) }; renderModal(); };
  A['salvar-viral'] = el => salvarViral(!!el.dataset.analisar);
  A['analisar-viral'] = () => analisarViral();
  A['ler-prints'] = () => lerPrints();
  A['rm-print'] = el => {
    const M = ui.modal, i = Number(el.dataset.i);
    try { URL.revokeObjectURL(M.urls[i]); } catch (e) { }
    M.files.splice(i, 1); M.urls.splice(i, 1);
    if (i === 0 && M.thumbAuto) { M.draft.thumb = ''; if (M.files[0]) thumbFrom(M.files[0]).then(t => { M.draft.thumb = t; if (ui.modal === M) renderModal(); }); }
    renderModal();
  };
  A.modelar = el => modelar(Number(el.dataset.i));
  A['vlic-sel'] = el => { ui.modal.licSel = ui.modal.licSel || {}; ui.modal.licSel[el.dataset.i] = el.checked; };
  A['guardar-licoes-viral'] = () => {
    const v = viralById(ui.modal.id); if (!v || !v.analise) return;
    const sel = ui.modal.licSel || {};
    const novas = (v.analise.licoes || []).filter((_, i) => sel[i] !== false);
    novas.forEach(t => st.memory.licoes.unshift({ id: newId('l'), texto: t, ativa: true, origem: `Viral ${v.handle || ''} “${v.titulo || ''}”`.trim(), data: E.hoje() }));
    v.analise.guardadas = true; Store.saveViral(v); Store.saveEstado();
    toast(`${novas.length} lição${novas.length === 1 ? '' : 'ões'} na memória. Entram no próximo roteiro.`);
    renderModal();
  };
  A['del-viral'] = () => {
    const M = ui.modal;
    if (!(M.delArm && Date.now() - M.delArm < 5000)) { M.delArm = Date.now(); renderModal(); return; }
    st.virais = st.virais.filter(x => x.id !== M.id);
    delete viralFiles[M.id];
    Store.delViral(M.id);
    if (ui.studio.modelo && ui.studio.modelo.id === M.id) ui.studio.modelo = null;
    closeModal(); render(); toast('Viral excluído.');
  };
  A.ideia = () => ideia();
  A['rev-modo'] = el => { ui.revisar.modo = el.dataset.m; renderSlate(); };
  A['melhorar-gancho'] = () => melhorarGancho();
  A['melhorar-cta'] = () => melhorarCTA();
  A['usar-ideia'] = el => {
    const o = ui.ideia.res.opcoes[Number(el.dataset.i)];
    const sd = ui.studio;
    sd.temaId = o.tema; if (o.gancho) sd.ganchoId = o.gancho; if (o.formato) sd.formatoId = o.formato;
    sd.colchetes = []; sd.fato = ''; sd.fonte = ''; sd.mode = 'criar';
    sd.why = o.encaixe + (o.porque ? ' ' + o.porque : '');
    render();
    toast('Combinação no Estúdio. Confira e rode o take.');
  };
  A.revisar = () => revisar();
  A['usar-gancho'] = el => {
    const g = Number(el.dataset.g), sd = ui.studio;
    if (g !== sd.ganchoId) { sd.colchetes = []; sd.fonte = ''; }
    sd.ganchoId = g; sd.ganchoModo = 'banco'; sd.mode = 'criar'; sd.why = '';
    ui.modal = null;
    if (ui.view !== 'estudio') go('estudio'); else { render(); }
    toast(`Gancho #${g} no Estúdio.`);
  };
  A['usar-tema'] = el => { ui.studio.temaId = Number(el.dataset.t); ui.studio.mode = 'criar'; ui.studio.why = ''; go('estudio'); toast(`Tema #${el.dataset.t} no Estúdio.`); };
  A['usar-formato'] = el => { ui.studio.formatoId = el.dataset.f; ui.studio.mode = 'criar'; ui.studio.why = ''; go('estudio'); toast(`${fmtName(el.dataset.f)} no Estúdio.`); };
  A['ver-cat'] = el => { ui.gf.cat = Number(el.dataset.c); ui.gf.flag = 'todos'; go('ganchos'); };
  A['copiar-gancho'] = el => copy(E.gancho(Number(el.dataset.g)).texto, 'Gancho');
  A.gcat = el => { ui.gf.cat = Number(el.dataset.c); render(); };
  A.gflag = el => { ui.gf.flag = el.dataset.f; render(); };
  A.tpil = el => { ui.tf.pilar = el.dataset.p; render(); };
  A.bf = el => { ui.bf = el.dataset.f; render(); };
  A['copiar-fala'] = () => copy(falaPlain(ui.gen.raw), 'Fala');
  A['copiar-tudo'] = () => copy(toPlain(ui.gen.raw), 'Roteiro');
  A['copiar-sec'] = el => {
    const raw = el.dataset.w === 'modal' && ui.modal && ui.modal.type === 'script' ? (scriptById(ui.modal.id) || {}).raw : ui.gen.raw;
    copy((E.parse(raw)[el.dataset.sec] || '').trim(), 'Legenda');
  };
  A['copiar-txt'] = el => copy(el.dataset.txt, 'Texto');
  A.prompter = () => openPrompter(ui.gen.raw);
  A['corrigir-tudo'] = () => {
    const G = ui.gen;
    const ch = E.checar(st, G.raw, G.ctx || {});
    const probs = ch.itens.filter(c => c.nivel !== 'ok' && c.ia);
    if (!probs.length) { toast('Nada pra corrigir.'); return; }
    ajustar('Corrija estes pontos que a checagem automática reprovou, sem mudar o que já está certo:\n' + probs.map((c, i) => `${i + 1}. ${c.txt} → ${c.ia}`).join('\n'), false);
  };
  A['usar-abertura'] = el => ajustar(`Use a abertura ${el.dataset.l} da seção @@ABERTURA: o Ato 1 passa a ser a fala 0–3s dela e a primeira fala do Ato 2 passa a ser a fala 3–7s dela. Marque "Escolhida: ${el.dataset.l}" e ajuste as edições do frame 0 nas DICAS DE EDIÇÃO. Mantenha o resto.`, false);
  A['abrir-ajuste'] = () => { ui.modal = { type: 'ajuste', texto: '', lembrar: false }; renderModal(); };
  A['editar-roteiro'] = () => {
    const G = ui.gen; G.editDraft = G.raw; G.editing = true; renderOut();
    const t = document.getElementById('edit-roteiro'); if (t) { t.focus(); t.setSelectionRange(0, 0); t.scrollIntoView({ block: 'nearest' }); }
  };
  A['cancelar-edicao'] = () => { const G = ui.gen; G.editing = false; G.editDraft = ''; renderOut(); };
  A['salvar-edicao'] = () => {
    const G = ui.gen, val = G.editDraft;
    if (!val || !val.trim()) { toast('O roteiro não pode ficar em branco.', 'warn'); return; }
    G.raw = val; G.editing = false; G.editDraft = '';
    const P = E.parse(val);
    const s = G.scriptId && scriptById(G.scriptId);
    if (s) {
      s.raw = val; s.titulo = (P.TARJA || '').trim() || s.titulo; s.proximo = (P.PROXIMO || '').trim(); s.duracao = E.duracao(P); s.updatedAt = Date.now();
      Store.saveScript(s);
    }
    G.turns = null; // a edição manual muda o texto; "Ajustar com IA" reconstrói o contexto do zero na próxima vez
    renderOut(); renderChrome();
    toast(s ? 'Edição salva.' : 'Edição aplicada nesta tela (não há roteiro salvo pra atualizar).');
  };
  A['ajuste-rapido'] = el => { ui.modal.texto = (ui.modal.texto ? ui.modal.texto.trim() + '. ' : '') + el.dataset.t; renderModal(); };
  A['aplicar-ajuste'] = () => {
    const t = (ui.modal.texto || '').trim();
    if (t.length < 3) { toast('Escreva o que mudar.', 'warn'); return; }
    const l = !!ui.modal.lembrar; closeModal(); ajustar(t, l);
  };
  A.stories = () => gerarStories();
  A['proxima-parte'] = () => proximaParte();
  A['confirmar-perfil'] = () => { Store.saveEstado(); toast('Perfil confirmado. Tudo passa a ser salvo.'); render(); };
  A['novo-perfil'] = () => { setState(blank()); ui.gen = Object.assign(ui.gen, { raw: N.EXEMPLO, exemplo: true, scriptId: null, turns: null, storiesRes: null, err: '' }); ui.studio.continua = null; go('perfil'); toast('Perfil em branco. Preencha o seu DNA.'); };
  A['add-tema'] = el => { ui.modal = { type: 'tema', i: Number(el.dataset.i) }; renderModal(); };
  A['salvar-tema'] = () => {
    const nome = $('#tm-nome').value.trim(), frase = $('#tm-frase').value.trim(), nota = $('#tm-nota').value.trim();
    if (!nome) { toast('Dê um nome ao tema.', 'warn'); return; }
    const i = ui.modal.i;
    st.bank.temas[i] = { nome, frase, nota };
    Store.saveEstado(); closeModal(); render(); toast(`Tema #${i} salvo no banco.`);
  };
  A['del-tema'] = () => { delete st.bank.temas[ui.modal.i]; if (ui.studio.temaId === ui.modal.i) ui.studio.temaId = null; Store.saveEstado(); closeModal(); render(); };
  A['abrir-script'] = el => { const s = scriptById(el.dataset.s); if (!s) return; ui.modal = { type: 'script', id: s.id, draft: draftFrom(s) }; renderModal(); };
  A.status = el => { const s = scriptById(ui.modal.id); s.status = el.dataset.v; Store.saveScript(s); renderModal(); if (ui.view === 'biblioteca') $('#main').innerHTML = vBiblioteca(); };
  A['salvar-metricas'] = () => {
    const s = scriptById(ui.modal.id), d = ui.modal.draft;
    applyDraft(s, d);
    if (s.metrics && s.metrics.views && s.status !== 'postado') s.status = 'postado';
    Store.saveScript(s);
    const sc2 = E.score(s.metrics);
    toast(sc2 != null ? `Desempenho salvo: score ${sc2}. O app já usa isso nas próximas sugestões.` : 'Salvo. Informe as views pra calcular o score.');
    renderModal(); renderChrome(); if (ui.view === 'biblioteca') $('#main').innerHTML = vBiblioteca();
  };
  A.analisar = () => analisar();
  A['registrar-desempenho'] = () => { const s = ui.gen.scriptId && scriptById(ui.gen.scriptId); if (!s) return; ui.modal = { type: 'script', id: s.id, draft: draftFrom(s) }; renderModal(); setTimeout(() => { const el = document.getElementById('m-views'); if (el) { el.scrollIntoView({ block: 'center' }); el.focus({ preventScroll: true }); } }, 60); };
  A['usar-rec'] = el => {
    const sd = ui.studio, g = Number(el.dataset.g), f = el.dataset.f;
    const R = E.recomendar(st), p = R.parecidos.find(x => x.id === g);
    const gg = E.gancho(g);
    sd.ganchoModo = 'meu'; sd.ganchoId = null; sd.ganchoTravado = false; sd.inspiracao = g;
    sd.ganchoTexto = '';
    if (E.formato(f)) sd.formatoId = f;
    sd.mode = 'criar'; sd.why = (p ? p.porque + ' ' : '') + 'Parecido com o que funcionou no seu perfil' + (gg ? ': “' + gg.texto + '”' : '') + '. Escreva o seu gancho com essa pegada.';
    ui.modal = null;
    if (ui.view !== 'estudio') go('estudio'); else { renderModal(); render(); }
    toast('Inspiração no Estúdio. Escreva o seu gancho.');
  };
  A['lic-sel'] = el => { ui.modal.licSel = ui.modal.licSel || {}; ui.modal.licSel[el.dataset.i] = el.checked; };
  A['guardar-licoes'] = () => {
    const s = scriptById(ui.modal.id); const sel = ui.modal.licSel || {};
    const novas = (s.analise.licoes || []).filter((_, i) => sel[i] !== false);
    novas.forEach(t => st.memory.licoes.unshift({ id: newId('l'), texto: t, ativa: true, origem: `Vídeo “${s.titulo || 'sem título'}”`, data: E.hoje() }));
    s.analise.guardadas = true; Store.saveScript(s); Store.saveEstado();
    toast(`${novas.length} lição${novas.length === 1 ? '' : 'ões'} na memória. Entram no próximo roteiro.`);
    renderModal();
  };
  A['script-estudio'] = () => {
    const s = scriptById(ui.modal.id);
    Object.assign(ui.gen, { status: 'done', raw: s.raw, exemplo: false, ctx: ctxDoStudio(sdDeScript(s)), scriptId: s.id, turns: null, storiesRes: s.stories || null, err: '', truncated: false, kind: s.origem === 'revisado' ? 'revisar' : 'roteiro' });
    Object.assign(ui.studio, sdDeScript(s), { mode: 'criar', temaId: s.temaId || null, formatoId: s.formatoId || ui.studio.formatoId, why: '' });
    ui.modal = null; go('estudio');
  };
  A['script-prompter'] = () => { const s = scriptById(ui.modal.id); openPrompter(s.raw); };
  A['script-copiar'] = () => copy(toPlain(scriptById(ui.modal.id).raw), 'Roteiro');
  A['editar-script'] = () => { const M = ui.modal, s = scriptById(M.id); if (!s) return; M.editDraft = s.raw; M.editing = true; renderModal(); };
  A['cancelar-edicao-script'] = () => { const M = ui.modal; M.editing = false; M.editDraft = ''; renderModal(); };
  A['salvar-edicao-script'] = () => {
    const M = ui.modal, s = scriptById(M.id), val = M.editDraft;
    if (!s) return;
    if (!val || !val.trim()) { toast('O roteiro não pode ficar em branco.', 'warn'); return; }
    const P = E.parse(val);
    s.raw = val; s.titulo = (P.TARJA || '').trim() || s.titulo; s.proximo = (P.PROXIMO || '').trim(); s.duracao = E.duracao(P); s.updatedAt = Date.now();
    Store.saveScript(s);
    M.editing = false; M.editDraft = '';
    if (ui.gen.scriptId === s.id) { ui.gen.raw = val; ui.gen.turns = null; }
    renderModal(); if (ui.view === 'biblioteca') $('#main').innerHTML = vBiblioteca();
    toast('Edição salva.');
  };
  A.doubling = () => {
    const s = scriptById(ui.modal.id);
    prepararContinua(s, s.proximo || 'Doubling Down (variação A): o mesmo conteúdo que funcionou, com outro gancho do banco.', 'Doubling Down pronto no Estúdio.');
  };
  A['del-script'] = () => {
    const M = ui.modal;
    if (!(M.delArm && Date.now() - M.delArm < 5000)) { M.delArm = Date.now(); renderModal(); return; }
    st.scripts = st.scripts.filter(x => x.id !== M.id);
    Store.delScript(M.id);
    if (ui.gen.scriptId === M.id) ui.gen.scriptId = null;
    closeModal(); render(); toast('Excluído.');
  };
  A['registrar-video'] = () => { ui.modal = { type: 'registrar', draft: { titulo: '', formatoId: '', temaId: '', ganchoId: '', postadoEm: '', duracao: '', nota: '' } }; renderModal(); };
  A['salvar-registro'] = () => {
    const d = ui.modal.draft;
    if (!String(d.titulo || '').trim()) { toast('Dê um título ao vídeo.', 'warn'); return; }
    const s = { id: newId('v'), origem: 'referencia', status: 'postado', createdAt: d.postadoEm ? Date.parse(d.postadoEm + 'T12:00:00') : Date.now(), raw: '', metrics: null };
    applyDraft(s, d);
    s.titulo = String(d.titulo).trim(); s.nota = String(d.nota || '').trim();
    const t = Number(d.temaId); s.temaId = E.tema(t) ? t : null;
    st.scripts.unshift(s); st.scripts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    Store.saveScript(s); closeModal(); render(); toast('Vídeo registrado.');
  };
  A['toggle-mem'] = el => {
    const arr = st.memory[el.dataset.k]; const it = arr.find(x => x.id === el.dataset.id);
    if (it) { it.ativa = el.checked; Store.saveEstado(); el.closest('.mrow').classList.toggle('off', !el.checked); }
  };
  A['del-mem'] = el => { st.memory[el.dataset.k] = st.memory[el.dataset.k].filter(x => x.id !== el.dataset.id); Store.saveEstado(); render(); };
  A['add-mem'] = el => {
    const k = el.dataset.k;
    const inp = k === 'fatos' ? $('#novo-fato') : $('#nova-licao');
    const t = inp.value.trim(); if (!t) return;
    st.memory[k].unshift(k === 'fatos' ? { id: newId('f'), texto: t, data: E.hoje() } : { id: newId('l'), texto: t, ativa: true, origem: 'Manual', data: E.hoje() });
    Store.saveEstado(); render();
  };
  A['ensinar-voz'] = () => ensinarVoz();
  A['guardar-voz'] = () => {
    const r = ui.voz.res;
    st.memory.voz = { resumo: r.resumo || '', tracos: r.tracos || [], bordoes: r.bordoes || [], evitar: r.evitar || [], estrutura: r.estrutura || '', data: E.hoje() };
    (r.licoes || []).forEach(t => st.memory.licoes.unshift({ id: newId('l'), texto: t, ativa: true, origem: 'Leitura de voz', data: E.hoje() }));
    ui.voz = { texto: '', num: '', busy: false, res: null };
    Store.saveEstado(); render(); toast('Voz guardada. Os próximos roteiros vão soar como você.');
  };
  A['descartar-voz'] = () => { ui.voz.res = null; render(); };
  A['apagar-voz'] = () => { st.memory.voz = null; Store.saveEstado(); render(); };
  A['gerar-bio'] = () => gerarBio();
  A.exportar = () => exportar();
  A['confirmar-import'] = () => {
    const d = ui.modal.data;
    const old = st.scripts.map(s => s.id);
    const oldC = {}; COLECOES.forEach(k => { oldC[k] = (st[k] || []).map(x => x.id); });
    setState(normalize(d)); st.meta.persisted = false;
    old.forEach(id => { if (!st.scripts.find(s => s.id === id)) Store.delScript(id); });
    COLECOES.forEach(k => oldC[k].forEach(id => { if (!st[k].find(x => x.id === id)) Store.delItem(k, id); }));
    Store.saveEstado();
    closeModal(); render(); toast('Backup importado.');
  };
  A['carregar-serrano'] = () => {
    const old = st.scripts.slice();
    const p = presetSerrano();
    // mantém os roteiros existentes
    p.scripts = old.filter(s => s.origem !== 'referencia' || !/^ref\d$/.test(s.id)).concat(p.scripts);
    p.virais = st.virais.slice();
    COLECOES.forEach(k => { p[k] = (st[k] || []).slice(); });
    setState(normalize(p)); Store.saveEstado(); render(); toast('Perfil de exemplo carregado. Seus roteiros continuam na Biblioteca.');
  };
  A.zerar = () => {
    if (!(ui.resetArm && Date.now() - ui.resetArm < 5000)) { ui.resetArm = Date.now(); render(); return; }
    ui.resetArm = 0;
    const ids = st.scripts.map(s => s.id), vids = st.virais.map(v => v.id);
    const cids = {}; COLECOES.forEach(k => { cids[k] = (st[k] || []).map(x => x.id); });
    setState(blank()); st.meta.persisted = false;
    ids.forEach(id => Store.delScript(id));
    vids.forEach(id => Store.delViral(id));
    COLECOES.forEach(k => cids[k].forEach(id => Store.delItem(k, id)));
    if (typeof X.reset === 'function') { try { X.reset(); } catch (e) { } }
    Store.saveEstado();
    Object.assign(ui.gen, { raw: N.EXEMPLO, exemplo: true, scriptId: null, turns: null, storiesRes: null, err: '', ctx: { temaId: 3, ganchoId: 151, formatoId: 'lista' } });
    render(); toast('Tudo apagado. Comece pelo seu DNA.');
  };
  A['p-play'] = () => {
    const M = ui.modal, el = $('#p-scroll'); if (el) M.pos = el.scrollTop;
    if (M.count > 0) { M.count = 0; renderModal(); return; }
    if (M.playing) { M.playing = false; renderModal(); return; }
    const max = el ? el.scrollHeight - el.clientHeight : 0;
    if (el && max > 0 && M.pos >= max - 2) { M.pos = 0; M.elapsed = 0; el.scrollTop = 0; }
    if (M.contagem && M.elapsed < 0.5) { M.count = 3; } else M.playing = true;
    renderModal();
  };
  A['p-auto'] = el => { const M = ui.modal; M.auto = el.dataset.v === '1'; pStore('pauto', M.auto ? 1 : 0); const s = $('#p-scroll'); if (s) M.pos = s.scrollTop; renderModal(); };
  A['p-contagem'] = () => { const M = ui.modal; M.contagem = !M.contagem; pStore('pcount', M.contagem ? 1 : 0); const s = $('#p-scroll'); if (s) M.pos = s.scrollTop; renderModal(); };
  A['p-vel'] = el => pVel(Number(el.dataset.d));
  A['p-tap'] = () => { const sel = window.getSelection && String(window.getSelection()); if (sel) return; A['p-play'](); };
  A['p-preset'] = el => {
    const M = ui.modal, v = Number(el.dataset.v);
    if (M.auto) { M.fator = v; pStore('pfator', v); } else { M.speed = v; pStore('pspeed', v); }
    const sc = $('#p-scroll'); if (sc) M.pos = sc.scrollTop;
    renderModal();
  };
  function pVel(d) {
    const M = ui.modal; if (!M || M.type !== 'prompter') return;
    if (M.auto) { M.fator = Math.max(50, Math.min(160, M.fator + d)); pStore('pfator', M.fator); }
    else { M.speed = Math.max(10, Math.min(140, M.speed + d)); pStore('pspeed', M.speed); }
    const sl = $('#p-speed'); if (sl) sl.value = M.auto ? M.fator : M.speed;
    const sv = $('#p-sv'); if (sv) sv.textContent = pSpeedLabel(M);
  }
  A['ditar-abrir'] = () => abrirDitar(null);
  A['ditar-script'] = () => abrirDitar(ui.modal && ui.modal.id);
  A['ditar-mic'] = () => ditarMic();
  A['ditar-ler'] = () => ditarLer();
  A['ditar-aplicar'] = () => ditarAplicar();
  A['p-size'] = el => { ui.modal.size = Math.max(20, Math.min(90, ui.modal.size + Number(el.dataset.d))); try { localStorage.setItem('ndi:psize', ui.modal.size); } catch (e) { } const p = $('#p-scroll'); if (p) ui.modal.pos = p.scrollTop; renderModal(); };
  A['p-mirror'] = () => { ui.modal.mirror = !ui.modal.mirror; const p = $('#p-scroll'); if (p) ui.modal.pos = p.scrollTop; renderModal(); };
  A['p-top'] = () => { const M = ui.modal; M.pos = 0; M.elapsed = 0; M.count = 0; M.playing = false; renderModal(); };

  function draftFrom(s) {
    const m = s.metrics || {};
    return Object.assign({}, m, { titulo: s.titulo || '', postadoEm: s.postadoEm || '', duracao: s.duracao || '', ganchoId: s.ganchoId || '', formatoId: s.formatoId || '' });
  }
  function applyDraft(s, d) {
    if (d.titulo != null && String(d.titulo).trim()) s.titulo = String(d.titulo).trim();
    const keys = ['views', 'alcance', 'curtidas', 'comentarios', 'salvamentos', 'compartilhamentos', 'seguidores', 'visitas', 'naoSeguidores', 'abaReels', 'pulados'];
    const m = {};
    keys.forEach(k => { const v = d[k]; m[k] = (v === '' || v == null || isNaN(Number(v))) ? '' : Number(v); });
    m.retencao = String(d.retencao || '');
    s.metrics = keys.some(k => m[k] !== '') ? m : null;
    s.postadoEm = d.postadoEm || '';
    s.duracao = d.duracao ? Number(d.duracao) : (s.duracao || '');
    const g = Number(d.ganchoId); s.ganchoId = E.gancho(g) ? g : (d.ganchoId === '' ? null : s.ganchoId);
    s.formatoId = E.formato(d.formatoId) ? d.formatoId : (d.formatoId === '' ? null : s.formatoId);
    s.updatedAt = Date.now();
  }

  async function analisar() {
    const M = ui.modal; const s = scriptById(M.id);
    if (!sampleFn || !s) return;
    M.busy = true; M.err = ''; renderModal();
    try {
      const r = await sampleFn.json(E.promptMetricas(st, s), { modelTier: 'default', cache: false });
      const dec = ['regravar', 'doubling_down', 'descartar', 'manter'].includes(r.decisao) ? r.decisao : 'manter';
      s.analise = {
        diagnostico: (Array.isArray(r.diagnostico) ? r.diagnostico : []).slice(0, 5).map(x => ({ numero: String(x.numero || ''), causa: String(x.causa || '') })),
        manter: (Array.isArray(r.manter) ? r.manter : []).slice(0, 5).map(String),
        mudar: (Array.isArray(r.mudar) ? r.mudar : []).slice(0, 5).map(String),
        decisao: dec, decisaoPorque: String(r.decisaoPorque || ''),
        novoGancho: E.gancho(Number(r.novoGancho)) ? Number(r.novoGancho) : null,
        licoes: (Array.isArray(r.licoes) ? r.licoes : []).slice(0, 3).map(String), data: E.hoje(), guardadas: false
      };
      M.licSel = {};
      Store.saveScript(s);
    } catch (e) { M.err = sampleErr(e).msg; }
    if (ui.modal === M) { M.busy = false; renderModal(); }
  }

  async function ensinarVoz() {
    const V = ui.voz;
    if (V.texto.trim().length < 80) { toast('Cole um texto maior (um roteiro ou transcrição inteira).', 'warn'); return; }
    if (!sampleFn) return;
    V.busy = true; render();
    try {
      const r = await sampleFn.json(E.promptVoz(st, V.texto, V.num.trim()), { modelTier: 'default', cache: false });
      const arr = x => (Array.isArray(x) ? x : []).map(String).filter(Boolean).slice(0, 12);
      V.res = { resumo: String(r.resumo || ''), tracos: arr(r.tracos), bordoes: arr(r.bordoes), evitar: arr(r.evitar), estrutura: String(r.estrutura || ''), licoes: arr(r.licoes).slice(0, 2) };
    } catch (e) { toast(sampleErr(e).msg, 'bad'); }
    V.busy = false; render();
  }

  async function gerarBio() {
    if (!sampleFn) return;
    ui.bio.busy = true; render();
    try {
      const r = await sampleFn.json(E.promptBio(st), { modelTier: 'default', cache: false });
      const bios = (Array.isArray(r.bios) ? r.bios : []).slice(0, 3).map(b => ({ texto: String(b.texto || '').replace(/\\n/g, '\n'), porque: String(b.porque || '') })).filter(b => b.texto);
      if (!bios.length) throw { code: 'invalid_json' };
      ui.bio.res = { nome: String(r.nome || ''), bios };
    } catch (e) { toast(sampleErr(e).msg, 'bad'); }
    ui.bio.busy = false; render();
  }

  async function exportar() {
    const data = JSON.stringify({ app: 'narrador-de-impacto', v: 1, exportadoEm: new Date().toISOString(), profile: st.profile, memory: st.memory, bank: st.bank, scripts: st.scripts, virais: st.virais, planos: st.planos, pecas: st.pecas, meta: st.meta }, null, 2);
    const nome = 'narrador-' + (st.profile.handle || 'perfil').replace(/[^a-z0-9]/gi, '') + '-' + new Date().toISOString().slice(0, 10) + '.json';
    if (downloads) {
      try { const r = await downloads.save({ filename: nome, data }); if (r && r.status === 'saved') toast('Backup salvo.'); return; }
      catch (e) { if (e && e.code === 'declined') return; if (e && e.code === 'rate_limited') { toast('Já tem um download aberto. Tente de novo em instantes.', 'warn'); return; } }
    }
    copy(data, 'Backup (JSON)');
  }

  Object.keys(X.actions).forEach(k => { if (!A[k] && typeof X.actions[k] === 'function') A[k] = X.actions[k]; });

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-a]');
    if (!el) return;
    const a = el.dataset.a;
    if (el.tagName === 'INPUT' && el.type === 'checkbox') { if (A[a]) A[a](el, e); return; }
    if (A[a]) { if (a !== 'overlay-bg') e.preventDefault(); A[a](el, e); }
  });

  let saveTimer = 0;
  function bind(el) {
    const b = el.dataset.bind;
    const val = el.type === 'checkbox' ? el.checked : el.value;
    if (b.startsWith('x.')) { if (typeof X.bind === 'function') X.bind(b.slice(2), val, el); return; }
    const sd = ui.studio;
    if (b.startsWith('p.')) {
      const k = b.slice(2);
      st.profile[k] = val;
      Store.saveEstado();
      clearTimeout(saveTimer); saveTimer = setTimeout(renderChrome, 300);
      return;
    }
    if (b.startsWith('s.')) { sd[b.slice(2)] = val; updateGate(); return; }
    if (b.startsWith('col.')) {
      sd.colchetes[Number(b.slice(4))] = val; updateGate();
      const q = document.querySelector('.pick .q'); if (q && sd.ganchoId) q.textContent = '“' + E.textoGancho(E.gancho(sd.ganchoId), sd.colchetes) + '”';
      return;
    }
    if (b.startsWith('m.')) { if (ui.modal && ui.modal.draft) ui.modal.draft[b.slice(2)] = val; return; }
    if (b.startsWith('vm.')) {
      if (!ui.modal || !ui.modal.draft) return;
      const k = b.slice(3); ui.modal.draft.media[k] = val;
      const L = E.parseLista(val); const sm = document.getElementById('vm-' + k + '-s');
      if (sm) sm.textContent = L.n > 1 ? `Média de ${L.n} Reels: ${E.fmtK(L.media)}` : L.n === 1 ? E.fmtK(L.media) : ' ';
      return;
    }
    if (b.startsWith('v.')) { if (ui.modal && ui.modal.draft) ui.modal.draft[b.slice(2)] = val; return; }
    if (b === 'editroteiro') { ui.gen.editDraft = val; return; }
    if (b === 'editscript') { if (ui.modal) ui.modal.editDraft = val; return; }
    if (b === 'ideia') { ui.ideia.texto = val; return; }
    if (b === 'jtideia') { ui.juntos.ideia = val; const bt = document.querySelector('[data-a="jt-start"]'); if (bt) bt.disabled = val.trim().length < 8 || ui.ai !== 'on'; return; }
    if (b === 'jtdraft') { ui.juntos.draft = val; const bt = document.querySelector('[data-a="jt-enviar"]'); if (bt) bt.disabled = !val.trim() || ui.juntos.status === 'busy'; return; }
    if (b === 'revisar') { ui.revisar.texto = val; return; }
    if (b === 'revg') { ui.revisar.gancho = val; const btn = document.querySelector('[data-a="melhorar-gancho"]'); if (btn) btn.disabled = !val.trim() || ui.revisar.statusG === 'busy' || ui.ai !== 'on'; return; }
    if (b === 'revc') { ui.revisar.cta = val; const btn = document.querySelector('[data-a="melhorar-cta"]'); if (btn) btn.disabled = !val.trim() || ui.revisar.statusC === 'busy' || ui.ai !== 'on'; return; }
    if (b === 'vozt') { ui.voz.texto = val; return; }
    if (b === 'vozn') { ui.voz.num = val; return; }
    if (b === 'aj') { ui.modal.texto = val; return; }
    if (b === 'ajl') { ui.modal.lembrar = val; return; }
    if (b === 'psp') { const M = ui.modal; if (M.auto) { M.fator = Number(val); pStore('pfator', val); } else { M.speed = Number(val); pStore('pspeed', val); } const sv = $('#p-sv'); if (sv) sv.textContent = pSpeedLabel(M); return; }
    if (b === 'dtt') { ui.modal.texto = val; const bt = document.querySelector('[data-a="ditar-ler"]'); if (bt) bt.disabled = val.trim().length < 5 || ui.ai !== 'on' || ui.modal.busy; return; }
    if (b === 'dtsel') { const r = ui.modal.res[Number(el.dataset.i)]; if (r) r.id = val || null; const bt = document.querySelector('[data-a="ditar-aplicar"]'); if (bt) bt.disabled = !ui.modal.res.some(x => x.id); return; }
    if (b === 'gq') { ui.gf.q = val; const w = $('#main'); const pos = el.selectionStart; w.innerHTML = vGanchos(); const n = $('#g-q'); n.focus(); try { n.setSelectionRange(pos, pos); } catch (er) { } return; }
    if (b === 'tq') { ui.tf.q = val; const w = $('#main'); const pos = el.selectionStart; w.innerHTML = vTemas(); const n = $('#t-q'); n.focus(); try { n.setSelectionRange(pos, pos); } catch (er) { } return; }
    if (b === 'pkq') { ui.modal.q = val; const pos = el.selectionStart; renderModal(); const n = $('#pk-q'); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (er) { } } return; }
  }
  document.addEventListener('input', e => { const el = e.target.closest('[data-bind]'); if (el && el.type !== 'checkbox' && el.tagName !== 'SELECT') bind(el); });
  document.addEventListener('change', e => {
    if (typeof X.change === 'function') { try { if (X.change(e)) return; } catch (er) { console.error(er); } }
    const el = e.target.closest('[data-bind]');
    if (el && (el.type === 'checkbox' || el.tagName === 'SELECT' || el.type === 'date')) bind(el);
    if (e.target.id === 'v-prints') { const fl = e.target.files; if (fl && fl.length) addPrints(fl); e.target.value = ''; return; }
    if (e.target.id === 'imp-file') {
      const f = e.target.files && e.target.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        try {
          const d = JSON.parse(rd.result);
          if (!d || !d.profile || !Array.isArray(d.scripts)) throw new Error('formato');
          ui.modal = { type: 'import', data: normalize(d) }; renderModal();
        } catch (er) { toast('Esse arquivo não é um backup do Narrador de Impacto.', 'bad'); }
      };
      rd.readAsText(f); e.target.value = '';
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && ui.modal) { closeModal(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && e.target && e.target.id === 'jt-draft') { e.preventDefault(); jtEnviar(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && e.target && e.target.id === 'jt-ideia') { e.preventDefault(); jtStart(); return; }
    if (ui.modal && ui.modal.type === 'prompter' && e.key === ' ' && e.target.tagName !== 'INPUT') { e.preventDefault(); A['p-play'](); }
    if (ui.modal && ui.modal.type === 'prompter' && (e.key === 'ArrowUp' || e.key === 'ArrowDown') && e.target.tagName !== 'INPUT') { e.preventDefault(); pVel(e.key === 'ArrowUp' ? 5 : -5); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && ui.view === 'estudio' && ui.studio.mode === 'criar' && ui.ai === 'on' && !gateErr() && ui.gen.status !== 'thinking' && ui.gen.status !== 'streaming') { e.preventDefault(); gerar(); }
  });

  /* ---------- ponte pras extensões (ig-*.js) ---------- */
  window.NDA = {
    get st() { return st; }, ui, E, N, A, IC, Store, COLECOES, viralFiles,
    get sample() { return sampleFn; }, get downloads() { return downloads; },
    $, esc, ic, clone, newId, pad2, grafemas, hl, toast, copy, sampleErr,
    render, renderChrome, renderModal, closeModal, go, sheetHead,
    fmtName, catName, pilarColor, scoreTag, viralById, scriptById, vThumb, filesParaIA,
    renderSlate: () => renderSlate()
  };

  /* ---------- boot ---------- */
  (function boot() {
    const s = E.sugerir(st, 7);
    Object.assign(ui.studio, { formatoId: s.formatoId, inspiracao: s.ganchoId || null, why: '' });
    render();
    Store.init().then(() => {
      if (!ui.studio.formatoId) { const s2 = E.sugerir(st, 11); Object.assign(ui.studio, { formatoId: s2.formatoId, inspiracao: s2.ganchoId || null }); }
      render();
    });
    (async () => {
      try { sampleFn = window.claude && window.claude.use ? await window.claude.use('sample') : null; } catch (e) { sampleFn = null; }
      ui.ai = sampleFn ? 'on' : 'off';
      if (sampleFn && sampleFn.limits) { try { const lim = await sampleFn.limits(); ui.imgLim = lim && lim.images ? lim.images : null; ui.imgMax = ui.imgLim ? ui.imgLim.maxCount || 0 : 0; } catch (e) { ui.imgLim = null; ui.imgMax = 0; } }
      try { downloads = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) { downloads = null; }
      render();
    })();
  })();
})();
