/* Narrador de Impacto — conhecimento das skills de Instagram (ig-*), em português do Brasil
   Preenche window.NDX.K: as 10 fórmulas de gancho, o mapa de objetivos e os blocos de texto
   que as ferramentas colocam nos prompts (sinais, legenda, carrossel, hashtags, plano, perfil,
   reaproveitar, humanizar) + os vícios de IA em português que X.auditar usa.
   Só dados e texto: não lê window.NDA, não mexe em tela. Carrega depois de ig-base.js.
   Origem: .claude/skills/ig-* e .claude/references/*.md, adaptados pro público brasileiro.
   Números que vêm de criadores (não oficiais) aparecem como "relatado". */
(function () {
  const X = window.NDX = window.NDX || {};
  X.K = X.K || {};

  /* ---------- limites (números usados nas regras) ---------- */
  const LIMITES = {
    legenda: 2200, dobra: 125, hashtags: { min: 3, max: 5 }, emojis: 3, palavrasPorTravessao: 100, fragmentos: 2,
    slides: { min: 2, maxApi: 10, maxApp: 20, ideal: [6, 10] }, bio: 150, nomeCampo: 30, destaques: [4, 6], fixados: 3,
    reelMaxSeg: 180, carrosselVideoSeg: 60, proporcao: '4:5 a 1,91:1', hashtagTamanho: { nicho: 50000, medio: 500000 }
  };

  /* ---------- as 10 fórmulas de gancho (ids fixos) ----------
     superficie: onde a fórmula nasce. tambem: onde ela adapta bem.
     molde: esqueleto com {lacunas}. exemplo: ilustrativo, nunca dado real.
     reconhece: como identificar num viral. fecho: o fechamento que ganha o objetivo. */
  const FORMULAS = [
    {
      id: 'numero', cod: 'IG1', nome: 'Número primeiro', superficie: 'legenda', tambem: ['reel', 'carrossel'],
      objetivos: ['salvamentos'],
      molde: '{resultado com número exato} em {prazo}.\n\nO que eu mudei, passo a passo, está aqui embaixo.',
      exemplo: 'Exemplo ilustrativo (troque pelo seu número real): "Reduzi de 6 horas pra 47 minutos o fechamento do mês do meu MEI. Os 3 passos estão aqui embaixo."',
      porque: 'Um número exato nos primeiros 125 caracteres para o scroll e promete um método que dá pra repetir, o tipo de post que mais se salva. Número quebrado (47 minutos, R$ 873) soa como medição, não como impressão.',
      cuidado: 'Nunca invente o número. Número contestado nos comentários custa mais alcance do que o post ganhou. Sem o dado real, use [PREENCHER: número, prazo e de onde vem].',
      reconhece: 'Número preciso logo na primeira linha + promessa de "como eu fiz" ou "pode copiar".',
      fecho: 'Salvar o passo a passo ("salva pra fazer quando for fechar o mês").'
    },
    {
      id: 'contraria', cod: 'IG2', nome: 'Verdade contrária', superficie: 'legenda', tambem: ['reel'],
      objetivos: ['compartilhamentos'],
      molde: '{conselho que todo mundo do nicho repete} está errado.\n\n{o que funciona de verdade, dito sem rodeio}.',
      exemplo: 'Exemplo ilustrativo: "Postar todo dia é o conselho que mais cansa perfil pequeno. 3 posts bons por semana, em dia fixo, rendem mais que 7 feitos às pressas."',
      porque: 'Opinião pronta pra print vira envio ("viu, eu te falei") e repost no story. Tem que ser verdade o bastante pra defender nos comentários e afiada o bastante pra valer o envio.',
      cuidado: 'Contrária que você não sustenta vira enxurrada de correção nos comentários. Só publique a que você defenderia olho no olho. Em tema regulado, a "verdade" precisa de fato conferido ou [CONFERIR].',
      reconhece: 'Afirmação seca que contradiz um conselho comum do nicho, sem preâmbulo.',
      fecho: 'Mandar pra alguém ("manda pra quem ainda segue esse conselho").'
    },
    {
      id: 'cena', cod: 'IG3', nome: 'Cena identificável', superficie: 'legenda', tambem: ['reel'],
      objetivos: ['comentarios'],
      molde: '{uma linha que joga quem lê num momento que todo mundo do nicho já viveu, com um detalhe específico}',
      exemplo: 'Exemplo ilustrativo: "responder \'qual o valor?\' no direct pela 14ª vez no dia e a pessoa visualizar e sumir."',
      porque: 'O reconhecimento é instantâneo e os comentários enchem de "sou eu". O detalhe específico bate mais forte que um clima vago, e comentário é sinal que conta pro alcance.',
      cuidado: 'É o gênero mais copiado do Instagram: versão genérica some. A especificidade (o momento, o objeto, a frase exata) é o trabalho todo.',
      reconhece: 'Um momento compartilhado, sem preparação e sem número de resultado.',
      fecho: 'Pergunta específica que a pessoa responde com a experiência dela.'
    },
    {
      id: 'confissao', cod: 'IG4', nome: 'Confissão com custo', superficie: 'legenda', tambem: ['reel'],
      objetivos: ['comentarios', 'seguidores'],
      molde: '{marcador de tempo}: {o que aconteceu, incluindo a parte feia}.\n\n{a linha de sentido que faz valer a leitura}.',
      exemplo: 'Exemplo ilustrativo (só com história real do criador): "Março de 2024: fechei um trabalho só no WhatsApp e levei 5 meses pra receber. Desde então, nada começa sem 1 página assinada."',
      porque: 'Transparência puxa mais que polimento. Um erro real dá permissão pros seguidores contarem os deles (comentários), e a linha de aprendizado ganha o seguir.',
      cuidado: 'Tem que ser verdade: vulnerabilidade fabricada é óbvia e é punida. Sem fato real informado, use [PREENCHER: o que aconteceu, quando e quanto custou]. Conte o fato seco, sem "vou ser sincero".',
      reconhece: 'Marcador de tempo em 1ª pessoa + um custo ou uma surpresa admitida.',
      fecho: 'A lição em uma linha + seguir pra próxima parte da história.'
    },
    {
      id: 'lista', cod: 'IG5', nome: 'Lista numerada', superficie: 'carrossel', tambem: ['reel'],
      objetivos: ['salvamentos'],
      molde: 'Slide 1: {N} {coisas} que {ganho grande e específico} (a maioria erra a {k}).\nSlides 2 a N-1: um item por slide, com nome e exemplo concreto.\nÚltimo slide: a lista inteira num slide + "salva pra usar quando {situação}".',
      exemplo: 'Exemplo ilustrativo: "5 erros no orçamento pelo direct que fazem o cliente sumir (o 3º passa batido)".',
      porque: 'Lista numerada que ensina é o formato mais salvo do Instagram. O "a maioria erra a 3" abre um loop que puxa o arraste, e o slide-resumo vira referência que vale guardar.',
      cuidado: 'Se o slide 1 promete demais e os slides entregam de menos, o público aprende a pular seus carrosséis. A promessa é contrato. Nunca encha pra fechar número redondo.',
      reconhece: 'Slide 1 (ou gancho) promete N itens numerados; o corpo é um item por vez.',
      fecho: 'Salvar a lista ("salva pra usar quando for responder o próximo orçamento").'
    },
    {
      id: 'antesdepois', cod: 'IG6', nome: 'Antes → depois', superficie: 'carrossel', tambem: ['reel'],
      objetivos: ['salvamentos', 'seguidores'],
      molde: 'Slide 1: {o depois, com número ou imagem forte}.\nSlide 2: onde começou (o antes).\nSlides 3 a N-1: os passos exatos, um por slide.\nÚltimo slide: o resultado de novo + UM pedido ("segue pro método completo de {tema}").',
      exemplo: 'Exemplo ilustrativo: Slide 1 "Do caderno bagunçado pra fechar o mês em 20 minutos" · Slide 2 "Como era antes: [PREENCHER: o antes real]".',
      porque: 'Prova de transformação é o gancho mais crível. O vão entre o slide 1 (depois) e o 2 (antes) é o loop que ganha o arraste; os passos ganham o salvamento; a prova ganha o seguir.',
      cuidado: 'Passo vago ("seja constante", "tenha foco") mata o salvamento: cada passo precisa de algo que dê pra fazer amanhã. O depois tem que ser real (do criador ou de caso conferido).',
      reconhece: 'Abre mostrando o resultado (o depois); em seguida o antes; o corpo são passos.',
      fecho: 'Seguir pro método completo (ou salvar os passos).'
    },
    {
      id: 'mito', cod: 'IG7', nome: 'Mito × verdade', superficie: 'carrossel', tambem: ['reel'],
      objetivos: ['compartilhamentos'],
      molde: 'Slide 1: {N} mitos sobre {tema} que estão te custando {perda específica}.\nSlides 2 a N-1: "Mito: {crença}." e depois "Verdade: {o que funciona}."\nÚltimo slide: a virada em uma linha + "manda pra quem ainda acredita no 1º".',
      exemplo: 'Exemplo ilustrativo: "4 mitos sobre contrato de publi que estão te fazendo trabalhar de graça".',
      porque: 'Desmentir mito dá munição pra quem lê, então ele manda pra quem precisa ser corrigido. Nomear a perda aumenta a aposta, e envio é o sinal que mais espalha.',
      cuidado: 'Não invente o mito só pra derrubar: espantalho soa cínico e os comentários percebem. Cada "verdade" técnica com fato conferido ou [CONFERIR].',
      reconhece: 'Pares "Mito:" / "Verdade:" (ou "errado" / "certo") no corpo.',
      fecho: 'Mandar pra alguém ("manda pra quem ainda acredita no 1º").'
    },
    {
      id: 'framework', cod: 'IG8', nome: 'Método com nome', superficie: 'carrossel', tambem: ['reel'],
      objetivos: ['salvamentos', 'seguidores'],
      molde: 'Slide 1: o método {nome} que eu uso pra {resultado específico}.\nSlides 2 a N-1: uma parte do método por slide, com o porquê.\nÚltimo slide: o método inteiro num slide só (o resumo que se salva) + motivo pra salvar.',
      exemplo: 'Exemplo ilustrativo: "O método 3C que eu uso pra responder orçamento sem baixar o preço: Contexto, Critério, Convite."',
      porque: 'Método com nome parece propriedade intelectual que vale guardar. O resumo de um slide no fim é o que se salva: a pessoa guarda o carrossel pra aplicar depois.',
      cuidado: 'Lista com nome bonito decepciona: cada parte precisa de um motivo real pra existir. Não invente resultado do método.',
      reconhece: 'Abre nomeando um método; fecha com ele inteiro num slide.',
      fecho: 'Salvar o resumo pra aplicar ("salva e usa no próximo orçamento").'
    },
    {
      id: 'quebra', cod: 'IG9', nome: 'Quebra de padrão', superficie: 'reel', tambem: [],
      objetivos: ['compartilhamentos'],
      molde: 'Texto no primeiro frame: {afirmação ou pergunta que faz passar reto parecer perda}.\nPrimeira fala: {entra direto no ponto, sem "oi, gente"}.',
      exemplo: 'Exemplo ilustrativo: Tela "você está postando Reels no pior horário" · Fala "o horário em que o seu público está online fica num lugar do app que quase ninguém abre."',
      porque: 'O alcance do Reel se decide nos primeiros segundos. Quebra de padrão + loop aberto seguram a retenção até o empurrão, e uma entrega digna de mandar ganha o envio. Texto na tela pega quem assiste sem som.',
      cuidado: 'Gancho que o Reel não paga faz a pessoa sair rápido, e o algoritmo lê isso como baixa qualidade. A promessa tem que cair, e cedo.',
      reconhece: 'Nos 1 a 3 primeiros segundos, imagem ou texto que quebra o esperado ou abre um loop, sem introdução.',
      fecho: 'Mandar pra alguém, ou seguir pra próxima parte; último frame que emenda no primeiro.'
    },
    {
      id: 'comoeu', cod: 'IG10', nome: '"Como eu" com resultado', superficie: 'reel', tambem: ['carrossel'],
      objetivos: ['salvamentos'],
      molde: 'Texto no primeiro frame: como eu {resultado específico com número} em {prazo}.\nCorpo: passo 1, passo 2, passo 3, com o rótulo de cada passo na tela, cortes rápidos, sem enrolação.\nFim: "salva pra fazer junto" + o resumo em uma linha na tela.',
      exemplo: 'Exemplo ilustrativo (com resultado real do criador): "Como eu emito a nota de uma publi em [PREENCHER: tempo real]".',
      porque: '"Como eu" vence "como fazer" porque resultado em 1ª pessoa carrega prova. Passo a passo enxuto é isca de salvamento, e o número no primeiro frame é a âncora de credibilidade.',
      cuidado: 'Passo rápido demais pra acompanhar ganha salvamento mas perde quem assiste até o fim; passo raso não ganha nenhum dos dois. Ritmo de "eu conseguiria fazer isso". Resultado só se for real.',
      reconhece: '"Como eu {resultado} em {prazo}" + passos com rótulo na tela.',
      fecho: 'Salvar pra fazer junto.'
    }
  ];
  const SUP_NOME = { legenda: 'legenda (imagem única ou qualquer post)', carrossel: 'carrossel', reel: 'Reel', qualquer: 'qualquer superfície' };
  const OBJ_CURTO = { salvamentos: 'salvamentos', compartilhamentos: 'envios', comentarios: 'comentários', seguidores: 'seguidores' };

  /* ---------- objetivos: o que faz a pessoa salvar, mandar, comentar e seguir ---------- */
  const OBJETIVOS = {
    salvamentos: {
      nome: 'Salvamentos', appId: 'salvamento', sinal: '"Vou voltar nisso."',
      formulas: ['numero', 'lista', 'framework', 'comoeu', 'antesdepois'],
      comoGanha: 'A pessoa salva o que vai querer usar de novo: lista, método com nome, passo a passo, checklist, conta pronta, modelo de frase. O conteúdo funciona como referência (o resumo num slide, os passos numerados na tela) e o CTA diz QUANDO ela vai usar. Salvamento continua trazendo alcance por dias, porque o Explorar segue mostrando.',
      cta: 'Salva pra usar quando {situação real do público}.',
      teste: 'Ela abriria isto de novo daqui a uma semana pra fazer alguma coisa?'
    },
    compartilhamentos: {
      nome: 'Envios e compartilhamentos', appId: 'compartilhamento', sinal: '"Fulano precisa ver isso."',
      formulas: ['contraria', 'mito', 'quebra'],
      comoGanha: 'A pessoa manda quando pensa numa pessoa específica: o sócio que repete o erro, a amiga que vende pelo direct, o cliente que sempre pergunta. Ganha envio a verdade contrária que dá razão a quem lê, o mito derrubado (munição pra corrigir alguém), o alerta que alguém precisa ver, a frase que ela sente e não sabia dizer, e a cena tão específica que vira "isso é você". O CTA nomeia pra quem mandar. Envio por direct e repost no story é o sinal que mais espalha um post hoje (relatado por criadores e em falas públicas do Instagram).',
      cta: 'Manda pra {pessoa específica} que {situação dela}.',
      teste: 'Dá pra dizer o nome de UMA pessoa pra quem ela mandaria isto?'
    },
    comentarios: {
      nome: 'Comentários', appId: 'comentario', sinal: '"Isso é comigo" ou "eu tenho algo a dizer".',
      formulas: ['cena', 'confissao'],
      comoGanha: 'A pessoa comenta quando se reconhece ou quando tem algo pra contar: a cena que ela viveu, a confissão que dá permissão pra contar a dela, a pergunta real e específica que ela sabe responder (a experiência dela, o número dela, a escolha dela). Responder os primeiros comentários na primeira hora puxa mais conversa. Nunca "comenta SIM" nem "o que vocês acham?".',
      cta: '{Pergunta específica que se responde com a experiência da pessoa}?',
      teste: 'A pessoa consegue responder em uma linha, sem pensar muito, falando da vida dela?'
    },
    seguidores: {
      nome: 'Seguidores', appId: 'seguidores', sinal: '"Quero o próximo."',
      formulas: ['confissao', 'antesdepois', 'framework'],
      comoGanha: 'A pessoa segue quando entende o que vai ganhar daqui pra frente: viu uma prova de transformação, recebeu um método que funciona e percebeu que este post é um pedaço de algo maior. Ganha o seguir o antes → depois real, o método com nome, a história com aprendizado e o CTA que vende o PRÓXIMO ganho com assunto definido ("segue: na parte 2 eu mostro..."). O perfil (nome, bio, fixados) tem que confirmar a promessa em 3 segundos.',
      cta: 'Segue: no próximo eu mostro {próximo ganho com assunto definido}.',
      teste: 'Depois de ver, ela sabe exatamente o que o próximo post vai resolver pra ela?'
    }
  };
  // aceita 'salvamento', 'salvamentos', 'envio', 'compartilhar'... e devolve o id do contrato
  const objetivoNorm = x => {
    const s = String(x == null ? '' : x).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (/^salv/.test(s)) return 'salvamentos';
    if (/^(compart|envi|mand|share)/.test(s)) return 'compartilhamentos';
    if (/^coment/.test(s)) return 'comentarios';
    if (/^(segui|follow)/.test(s)) return 'seguidores';
    return null;
  };

  /* ---------- funções das fórmulas ---------- */
  const supNorm = s => {
    const t = String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (!t || t === 'qualquer' || t === 'auto' || t === 'todas') return null;
    if (/^(legenda|imagem|foto|post|caption)/.test(t)) return 'legenda';
    if (/^(carross|carousel)/.test(t)) return 'carrossel';
    if (/^(reel|video|roteiro)/.test(t)) return 'reel';
    return null;
  };
  const formula = id => {
    const t = String(id == null ? '' : id).trim().toLowerCase();
    if (!t) return null;
    return FORMULAS.find(f => f.id === t || f.cod.toLowerCase() === t) || null;
  };
  const linhaFormula = (f, alt, sup) => {
    const objs = f.objetivos.map(o => OBJ_CURTO[o]).join(' e ');
    const adapta = alt && sup && f.tambem.includes(sup) ? ` · adapta bem pra ${SUP_NOME[sup]}` : '';
    return `[${f.id}] ${f.nome} (${f.cod}) · nasce em: ${SUP_NOME[f.superficie]} · ganha: ${objs}${adapta}\nMolde: ${f.molde.replace(/\n+/g, ' / ')}\nCuidado: ${f.cuidado}`;
  };
  const blocoFormulas = superficie => {
    const sup = supNorm(superficie);
    const L = ['═══ FÓRMULAS DE GANCHO DO INSTAGRAM ═══',
      'Cada superfície tem o seu gancho: legenda = os ~125 primeiros caracteres, antes do "mais"; carrossel = o slide 1, que decide o arraste em menos de um segundo; Reel = os 1 a 3 primeiros segundos (imagem + texto na tela + primeira fala). Escolha a fórmula pelo OBJETIVO do post, depois ajuste ao tema. Ao citar uma fórmula, use o id entre colchetes.'];
    if (sup) {
      const prim = FORMULAS.filter(f => f.superficie === sup || f.superficie === 'qualquer');
      const alt = FORMULAS.filter(f => !prim.includes(f));
      L.push(`Fórmulas de ${SUP_NOME[sup]}:`);
      prim.forEach(f => L.push(linhaFormula(f, false, sup)));
      L.push(`Alternativas (nascem em outra superfície; use só se a ideia pedir e adapte o molde a ${SUP_NOME[sup]}):`);
      alt.forEach(f => L.push(linhaFormula(f, true, sup)));
    } else {
      FORMULAS.forEach(f => L.push(linhaFormula(f, false, null)));
    }
    L.push('Por objetivo: ' + Object.keys(OBJETIVOS).map(k => `${OBJ_CURTO[k]} → ${OBJETIVOS[k].formulas.join(', ')}`).join(' · ') + '.');
    L.push('Regras do gancho: se sustenta sozinho (a legenda não pode precisar da 2ª linha); slide 1 é promessa com loop aberto, nunca título ("5 jeitos de X" vence "Dicas de X"); "como eu" vence "como fazer"; um número específico e real no gancho aumenta salvamento e envio ("47 minutos" vence "rápido"); o conteúdo paga a promessa. Nunca: isca de engajamento ("comenta SIM", "marca 3 amigos"), ideia de uma linha esticada em 10 slides, título sem promessa.');
    return L.join('\n\n');
  };
  const blocoObjetivos = () => ['═══ O QUE FAZ A PESSOA SALVAR, MANDAR, COMENTAR E SEGUIR ═══']
    .concat(Object.keys(OBJETIVOS).map(k => { const o = OBJETIVOS[k]; return `${o.nome} (${o.sinal}): ${o.comoGanha}\nFórmulas: ${o.formulas.join(', ')}. CTA modelo: ${o.cta} Teste: ${o.teste}`; }))
    .join('\n\n');

  /* ---------- blocos de texto pros prompts ---------- */
  const SINAIS = `═══ O QUE O INSTAGRAM MEDE EM 2026 ═══
Fonte: falas públicas do Instagram (Adam Mosseri) e testes de criadores. Os pesos são relatados, não uma tabela oficial: use como direção.

Sinais, do mais forte pro mais fraco (relatado):
- Envio: mandar no direct ou repostar no story. É o que mais espalha um post; "envios por alcance" é a métrica que, segundo criadores, mais pesa hoje.
- Salvamento: "vou voltar nisso". Puxa alcance por dias em lista, método, passo a passo e antes → depois.
- Comentário, ainda mais quando o autor responde: conversa real conta como qualidade.
- Retenção do Reel: tempo assistido, ver até o fim, rever. Nos Reels, decide o empurrão.
- Visita ao perfil que vira seguidor: o sinal de crescimento.
- Curtida: pesa pouco.
- Negativos ("não tenho interesse", deixar de seguir, ocultar, denunciar): penalidade pesada. Uma denúncia pesa mais que muitas curtidas.
Pergunta antes de postar: alguém mandaria isto pra UMA pessoa específica, ou salvaria pra usar depois? Se só ganha curtida, afie a entrega.

Primeiros 30 a 60 minutos: os primeiros envios, salvamentos e comentários decidem se o post sai pra quem não segue (Explorar e aba Reels). Poste quando der pra responder os primeiros comentários e directs na hora. Reel que segura os 3 primeiros segundos no teste inicial ganha empurrão maior.

Derruba alcance:
- Isca de engajamento ("comenta SIM", "marca 3 amigos", "curte se concorda"): o Instagram rebaixa de propósito.
- Vídeo com marca d'água de outro app nos Reels.
- Parede de 20 a 30 hashtags: lê como spam e não ajuda.
- Imagem fora da proporção 4:5 a 1,91:1 (o Instagram corta).
- Muita gente ocultando, deixando de seguir ou denunciando.
- Carrossel misturando foto e vídeo (a publicação pela API recusa).
- Gancho que o conteúdo não paga: a pessoa sai rápido e o algoritmo lê como baixa qualidade.

Aumenta alcance:
- Post feito pra ser mandado: a verdade que a pessoa sente e não sabia dizer, o alerta, a lista útil.
- Formato de salvamento segue ganhando alcance por dias.
- Reel com boa retenção é o formato mais empurrado pra quem não segue (relatado). Texto na tela (pega quem assiste sem som) e áudio original ajudam; gancho e retenção pesam mais que o áudio.
- Carrossel tem segunda chance: pode reaparecer, a partir do slide 2, pra quem não arrastou.
- Final de Reel que emenda no começo aumenta o rever.
- Repostar o próprio post no story vale como envio e leva o post a quem não viu.

Regras práticas:
- Um objetivo principal por post (salvar, mandar, comentar ou seguir), nunca os quatro ao mesmo tempo.
- Todo post precisa de mídia (foto, carrossel ou vídeo). Vertical 4:5 ocupa mais tela no feed.
- Stories não trazem gente nova: aprofundam a relação com quem já segue. Enquete, caixinha e quiz rendem toques e mantêm o perfil na frente da fila.
- Constância vence volume: 3 a 5 posts bons por semana, em ritmo fixo, rendem mais que um por dia feito às pressas.`;

  const LEGENDA = `═══ LEGENDA DO INSTAGRAM ═══
Se o prompt trouxer a "LEGENDA — estrutura fixa" do perfil, ela manda na ordem das partes e no CTA. Estas regras completam.

Limite: 2.200 caracteres. Só os ~125 primeiros aparecem antes do "mais"; o resto só lê quem já foi fisgado.

A dobra dos 125 caracteres:
- A 1ª linha é a assinatura do perfil e logo depois vem o gancho. Assinatura + quebras de linha + gancho cabem JUNTOS nos 125 primeiros caracteres (assinatura de 40 deixa uns 80 pro gancho). Se não couber, encurte o gancho; nunca deixe o "mais" cortar o gancho.
- O gancho se sustenta sozinho: entrega o ganho, a tensão ou o número sem precisar da linha seguinte.
- Promessa, não título: "Dicas de organização" é título; "o jeito de fechar o mês em 20 minutos sem planilha" é promessa.
- No Reel, o gancho da legenda é diferente da fala do vídeo.
- Número específico no gancho quando existir um real ("47 minutos" vence "rápido"). Sem o dado: [PREENCHER: número e de onde vem]. Nunca invente.

Corpo:
- Uma ideia por legenda. Duas ideias = dois posts.
- Linhas curtas e linha em branco entre os blocos. Parede de texto é ignorada.
- Entrega o que o gancho prometeu.
- Reel: legenda curta que complementa, nunca resume. Traz o que não coube na fala (a lei, o termo técnico, o detalhe, o passo escrito).
- Carrossel: pode ser curta, os slides carregam. Repete a promessa do slide 1 pra dobra, 1 linha de contexto, o CTA e as hashtags.
- Imagem única: a legenda carrega mais. A maioria das boas fica entre 150 e 1.500 caracteres; longa só se ensinar ou contar uma história que valha a rolagem.
- Escreva as palavras que o público digitaria na busca (o nome do problema do jeito que ele fala): a busca do Instagram lê a legenda.

Fechamento, nesta ordem:
1. Primeiro passo de graça, em uma linha, quando o post ensina.
2. Uma pergunta aberta e específica, de uma linha, que a pessoa responde com a experiência dela. Ela puxa comentário e não conta como segundo pedido. Proibido: "o que vocês acham?", "concorda?", "comenta aí".
3. Disclaimer do perfil, se o conteúdo for regulado (direito, tributo, saúde, finanças).
4. UM CTA, com motivo: seguir amarrado ao próximo conteúdo ("segue: na parte 2 eu mostro..."), ou a palavra-chave no direct só se o perfil usa esse modo e entrega no mesmo dia. Pedido de salvar ou mandar também vale se diz quando ou pra quem ("salva pra quando for fechar o mês", "manda pro seu sócio"). Nunca dois pedidos ("segue, salva e compartilha").
5. Hashtags: 3 a 5, no fim (ou no 1º comentário), em minúsculas, específicas do assunto, nunca no meio da frase.

Estilo:
- Emoji: 0 a 3 com função. Os números de lista (1️⃣ 2️⃣ 3️⃣) não entram na conta; a seta 👇 da pergunta entra. Nunca fileira nem um por linha.
- Travessão (—): no máximo 1 a cada 100 palavras (1 ou 2 por legenda). O excesso vira vírgula, dois-pontos, parênteses ou quebra de linha, nunca ponto. Sem "–" nem "--" entre frases.
- Sem venda forte: no máximo uma menção natural à oferta.
- Sem LINHA EM MAIÚSCULAS pra dar intensidade: a força vem da escolha das palavras.
- Começa pelo gancho, sem "oi, gente", "neste post" ou "você sabia que".
Lembre o criador de anexar a mídia: o Instagram não publica legenda sem foto ou vídeo.`;

  const CARROSSEL = `═══ CARROSSEL: SLIDE A SLIDE ═══
Limites: de 2 a 10 itens pela API (o app do Instagram aceita até 20; aqui, planeje até 10). Só fotos ou só vídeos, nunca misturado. Vertical 4:5 (1080 × 1350) ocupa mais tela. Vídeo em carrossel: até 60 s por clipe.

A espinha:
- Slide 1 (gancho): promessa + loop aberto ("a maioria erra a 4"). Uma ideia, 6 a 12 palavras, letra grande, número se couber. É o funil inteiro: se não ganha o arraste, o resto não existe. Nunca só um título ("Dicas de X").
- Slides 2 e 3: o valor mais forte. O arraste cai a cada slide, então o melhor ponto vem cedo, nunca no último.
- Slides 4 a N-1: um ponto por slide, que se sustenta sozinho e se lê em 2 segundos.
- Último slide: o resumo inteiro num slide só (o que a pessoa salva e printa) + UM pedido (salvar, mandar ou seguir, conforme o objetivo). Se o perfil trabalha em série, diga o assunto do próximo post.

Quantos slides:
- Lista curta ou método: 6 a 8. Conjunto mais rico ou transformação: 8 a 10.
- Menos de 4 pontos reais: vira post de imagem única.
- Nunca encha pra chegar a 10. 5 pontos = 7 slides (capa + 5 + fechamento).

Texto na imagem:
- Uma ideia por slide; se tem duas, divida.
- Outdoor, não parágrafo: poucas palavras, letra grande. O detalhe vai pra legenda.
- Em lista, numere os itens (1., 2., 3.) pra o loop "a maioria erra a 4" se pagar.
- Mesma fonte, mesma margem e mesma cor de destaque em todos: tem que parecer um conjunto.
- No máximo 1 travessão por slide, e só se fizer trabalho de verdade.

Espinhas por fórmula:
- lista (salvamentos): 1 "{N} {coisas} que {ganho} (a maioria erra a {k})" · 2 a N-1 um item por slide, com nome e exemplo concreto, o mais surpreendente na posição 1 ou 2 · último: a lista inteira num slide + "salva pra usar quando {situação}".
- antesdepois (salvamentos e seguidores): 1 o depois, com número ou imagem forte · 2 o antes (o vão entre 1 e 2 puxa o arraste) · 3 a N-1 os passos exatos, um por slide, que dê pra fazer amanhã · último: o resultado de novo + "segue pro método completo de {tema}".
- mito (envios): 1 "{N} mitos sobre {tema} que estão te custando {perda}" · 2 a N-1 "Mito: {crença}" e "Verdade: {o que funciona}" · último: a virada em uma linha + "manda pra quem ainda acredita no 1º".
- framework (salvamentos): 1 "o método {nome} que eu uso pra {resultado}" · 2 a N-1 uma parte por slide, com o porquê · último: o método inteiro num slide, autossuficiente, + motivo pra salvar.

Legenda do carrossel: curta. Repete a promessa do slide 1 pra dobra, 1 linha de contexto, o CTA e 3 a 5 hashtags.

Proibido: slide 1 sem promessa; o melhor ponto no fim; três pedidos no último slide; parede de texto; slide de enchimento; mistura de foto e vídeo; "O resultado?" e frases curtas em fila pra dar ritmo; palavra de IA.
Lembre o criador: as imagens sobem na ordem dos slides.`;

  const HASHTAGS = `═══ HASHTAGS: TAMANHO, NÃO QUANTIDADE ═══
3 a 5 hashtags bem escolhidas rendem mais que 30 aleatórias. Hoje a hashtag funciona como etiqueta de assunto, que ajuda o Instagram a classificar o post; o alcance vem de envios, salvamentos e da recomendação. Este app usa no máximo 5 (o Instagram anunciou em dez/2025 o limite de 5 por post).

Tamanho = total de publicações da hashtag:
- Nicho: menos de 50 mil. Onde perfil pequeno ou médio consegue ranquear e ficar visível por horas. Use 2 a 3.
- Médio: de 50 mil a 500 mil. Público morno, concorrência vencível. Use 1 a 2.
- Amplo: mais de 500 mil. Etiqueta de categoria; o post fica no topo por minutos. Use 0 ou 1, só se encaixar.
Receita: 2 a 3 nicho + 1 a 2 médio + 0 a 1 amplo = 3 a 5 no total. Sem amplo que sirva, fique com 4.

Como achar:
- Nicho: junte dois termos (assunto + público, assunto + formato, assunto + estilo), use o nome que a comunidade dá a si mesma, veja as tags PEQUENAS que perfis parecidos usam (não as gigantes) e leia as sugestões da busca.
- Médio: o subtema reconhecível, conhecido mas não universal.
- Amplo: uma palavra comum que todo mundo usa (#empreendedorismo, #marketing).
- Formato de exemplo, tamanhos a conferir: #notafiscalparacriadores (nicho provável) · #contratodepubli (nicho provável) · #empreendedorismo (amplo).

Como o criador confere o tamanho:
1. Abra o Instagram e toque na lupa (Pesquisar).
2. Digite a hashtag com o # na frente.
3. Toque na aba "Tags" (em algumas versões, "Hashtags"): o número de publicações aparece embaixo de cada tag. Abrindo a tag, ele aparece no topo da página dela.
4. Se o número não aparecer, olhe a página da tag: posts de minutos atrás no topo = tag grande e rápida; posts de dias atrás = tag de nicho.
5. Anote e reconfira de tempos em tempos: tag cresce.
A IA deste app não tem internet: todo tamanho que ela sugere é estimativa pela especificidade e vem marcado "estimativa, conferir na busca". Só use depois de conferir.

Regras:
- Toda tag descreve o conteúdo real do post. Tag popular fora do assunto ensina o algoritmo a mostrar o post pra pessoa errada, e o alcance cai.
- No fim da legenda ou no 1º comentário (o alcance é igual), em minúsculas, nunca no meio da frase.
- Gire: não repita o mesmo bloco em todo post (parece automação). Troque as de nicho por assunto; médio e amplo podem ficar mais estáveis dentro do mesmo pilar.
- Hashtag da marca (#seunome) conta como uma de nicho, se for pequena. Hashtag de campanha ocupa 1 vaga durante a campanha.

Evite:
- Tags de troca de curtida e seguidor (#follow4follow, #like4like, #sdv, #seguidores, #curtidas) e as que o Instagram costuma marcar como spam.
- Pacote "viral" genérico (#viral, #explore, #reels, #instagood): fila impossível de vencer.
- 20 a 30 tags, ou tags escondidas atrás de pontinhos "pra ficar limpo": continua spam.
- Conjunto só de amplas, que perfil pequeno não ranqueia.

Saída: cada tag com o tamanho estimado (nicho, médio ou amplo), marcado como estimativa a conferir, e um porquê de uma linha.`;

  const PLANO = `═══ PLANO DA SEMANA ═══
Ritmo em vez de post solto: Reels pra alcance, carrossel pra salvamento, stories pra relação.

Papéis (cada post tem um pilar de tema do perfil E um destes papéis). Divisão padrão:
- Educativo, 40%: ensina o que o perfil resolve. Ganha salvamentos. Fórmulas: lista, framework, comoeu, numero. Formato: carrossel ou Reel "como eu".
- História, 30%: bastidor em 1ª pessoa, acerto e erro. Ganha seguidores e comentários (gente segue gente). Fórmulas: confissao, antesdepois. Formato: carrossel antes → depois ou Reel de frente pra câmera.
- Conexão, 20%: cena identificável, opinião, pergunta. Ganha comentários e envios. Fórmulas: cena, quebra, contraria, figurinhas no story. Formato: imagem, Reel ou stories.
- Oferta, 10%: o produto, o serviço, o próximo passo. Ganha seguidores e cliente. Fórmulas: antesdepois (resultado que mostra o produto funcionando), numero (dado próprio). No máximo 1 a 2 por semana: oferta demais enterra o alcance.
Nenhum papel e nenhum pilar passa de 50% dos posts da semana.

Cadência e mix:
- 3 a 5 posts de qualidade no feed por semana valem mais que um por dia feito às pressas. Não encha pra bater número.
- Pelo menos 2 Reels (alcance) e 2 carrosséis (salvamento); imagem única quando a ideia cabe numa frase.
- Reel pode sair mais vezes que carrossel sem cansar a base: cada um chega a gente nova.
- Uma fórmula por post, variando: nenhuma mais de 2 vezes na semana.

Meta da semana: salvamentos + envios somados é o número principal, não curtida. Meta: passar a soma da semana anterior (sem histórico, a primeira semana vira a base). Pra isso:
- pelo menos 3 posts de salvamento (numero, lista, antesdepois, framework, comoeu) e 2 de envio (contraria, mito, quebra);
- pelo menos 1 de comentário (cena, confissao) e 1 de seguidor (confissao, antesdepois, framework);
- pelo menos 1 história real em 1ª pessoa; um objetivo principal por post.

Stories todo dia, 2 a 4 telas: bastidor, uma enquete ou caixinha, e pelo menos 1 repost de post recente do feed (vale como envio e leva o post a quem perdeu). No dia de pergunta e no dia da oferta, mais figurinhas.

Horários (horário de Brasília): ponto de partida adaptado das janelas que criadores relatam, não regra oficial. Confira no Painel profissional, nos dados do público, em "Horários mais ativos", e ajuste em 2 a 3 semanas.
- Dias úteis: 11h às 13h (almoço) e 19h às 21h (depois do trabalho). Domingo: 18h às 21h.
- Donos de negócio e B2B: terça a quinta, 9h às 11h e no almoço.
- Público grande em outro fuso (Manaus 1h a menos, Acre 2h a menos)? Ajuste.
- Escolha um horário em que você consegue responder os comentários na primeira hora.

Fio condutor (o que faz a pessoa querer acompanhar a semana):
- A semana tem um tema maior dividido em capítulos. Cada post resolve um pedaço real e funciona sozinho pra quem chega no meio.
- Todo post anuncia o próximo com assunto definido, e o CTA de seguir é amarrado a esse próximo capítulo.
- A série tem um nome curto que aparece na capa ou na tarja de todos os posts.
- Educativo e história vêm antes; a oferta, se houver, depois que a semana já entregou valor.
- O último post fecha com o resumo da semana (framework ou lista) e abre o tema da semana seguinte.

Saída por dia: formato, pilar e papel, fórmula (id), ângulo em 1 linha, objetivo, horário e o gancho do próximo capítulo. No fim: meta de salvamentos + envios, rotina de stories e a checagem de equilíbrio com o que falta.`;

  const PERFIL = `═══ PERFIL: AUDITORIA EM 9 PARTES ═══
A decisão de seguir acontece no topo do perfil: foto, nome, bio, link e as 2 ou 3 primeiras linhas da grade. Teste do topo: lendo só isso, um estranho sabe pra quem é o perfil e quer seguir?

Antes: qual é o objetivo do perfil? Crescer, vender um produto, fechar clientes ou construir autoridade. O CTA da bio, o link e os fixados mudam com ele. Conta profissional (criador ou empresa) libera a categoria e o painel.

As 9 partes e o que passa:
1. Foto: rosto nítido preenchendo o círculo, recente, alto contraste com fundo simples. Aparece pequena: detalhe some, contraste não.
2. Campo Nome (até 30 caracteres): é o que a busca do Instagram lê, não o @. Nome + a palavra que o público digita ("Ana Souza | Contrato de publi"). É o ajuste de busca de maior impacto; nunca deixe só o nome.
3. @: curto, fácil de lembrar e de falar, ligado à marca; evite números e sublinhados se der.
4. Bio (até 150 caracteres): pra quem + o que você posta + uma prova ou dado específico. Começa pelo ganho de quem lê, não pelo cargo. "Ajudo X a Y" só se o resto for específico. Quebra de linha e 1 emoji de âncora pode; chuva de emoji, não.
5. Link: um, ligado ao objetivo (oferta, lista, agenda). Se precisar de vários, uma página de links, não a home do site. Dá pra pôr mais de um link, mas o primeiro leva o clique.
6. Categoria: uma, clara, que reforça a bio sem repetir.
7. Destaques: 4 a 6, da esquerda pra direita na ordem da próxima pergunta de quem chega (Comece aqui, Provas, Oferta, Dúvidas, Sobre). Capas no mesmo estilo, nomes de uma palavra que não cortam. Os 3 ou 4 primeiros aparecem sem rolar.
8. Grade dos 9 primeiros: a vitrine. Legível de relance, visual consistente (cor, enquadramento ou estilo de texto), variedade sem bagunça. Julgue como conjunto; troque ou reordene os quadros fracos do topo.
9. Fixados (até 3): as melhores provas do que o seguidor vai ganhar, conforme o objetivo: o post de melhor desempenho, uma oferta clara e um post de apresentação (pra quem é o perfil).

Regras:
- Tudo dentro dos limites (bio 150, nome 30). Nunca entregue bio cortada nem destaque com nome que trunca.
- Prova só se for real: credencial, número ou resultado informado pelo criador. Sem dado: [PREENCHER: prova real]. Respeite os títulos proibidos do perfil.
- Conteúdo regulado: nada de promessa de resultado na bio.
- No máximo 1 travessão na bio; sem palavra de IA ("potencializar", "alavancar", "jornada", "transformar vidas").

Saída: nota por parte (passa, ajustar ou reprova), correções em ordem de impacto (nome, bio e fixados primeiro), antes → depois de cada parte reprovada, plano de destaques (capas, ordem, nomes) e escolha de grade e fixados com o motivo.`;

  const REAPROVEITAR = `═══ REAPROVEITAR CONTEÚDO DE OUTRA REDE ═══
Reaproveitar não é colar. Post que foi bem no LinkedIn ou fio que voou no X morre no Instagram se for colado: gancho errado, recipiente errado, ritmo errado, sem mídia e com marcas da outra rede. Mantenha a ideia, refaça a entrega.

Passos:
1. Ache a espinha: a afirmação, a história ou o número que vale guardar. Reaproveitamento falha quando guarda as palavras e perde o ponto.
2. Escolha o recipiente:
   - Uma afirmação ou um número: legenda de imagem única.
   - Ensino, lista ou construção: carrossel, um ponto por slide, do gancho ao resumo.
   - Vídeo longo: carrossel com o que o vídeo descobriu (não resumo cena a cena), ou Reel curto com o melhor trecho, gancho novo e um passo.
3. Gancho novo pra dobra: o gancho da fonte quase nunca sobrevive. Escreva outro com uma das fórmulas, escolhida pelo objetivo, que se sustente nos 125 primeiros caracteres (ou no slide 1, ou nos 3 primeiros segundos).
4. Ajuste o formato: legenda escaneável, linhas curtas; carrossel com uma ideia por slide. Corte o tecido de ligação da fonte: o Instagram premia o ganho logo de cara.
5. Limpe as marcas da outra rede: "link na bio" herdado, "se inscreve no canal", "ativa o sininho", "leia mais abaixo", @ que só existe no X, numeração de fio (1/7), "como eu postei no LinkedIn". O post não admite que é reaproveitado.
6. Mídia: o Instagram não publica só texto. Diga qual imagem, slides ou vídeo o criador precisa.
7. Hashtags num bloco no fim (3 a 5), nunca no meio.
8. Passe o filtro de cara de IA.

Por origem:
- LinkedIn: texto longo vira carrossel; uma afirmação afiada vira legenda. O LinkedIn tolera aquecimento, o Instagram não; o gancho do LinkedIn costuma ser longo demais pra dobra.
- Blog ou newsletter: a estrutura vira slides, gancho no 1, resumo no último. Não cole o texto inteiro numa legenda.
- YouTube: comece pelo resultado do vídeo, não pela introdução: "o que eu descobri", não recapitulação.
- X (tweet ou fio): tweet vira legenda; fio vira carrossel, um tweet por slide com seu próprio miniponto. Tire @ e numeração.

Regras: mantenha a afirmação e os números da fonte (muda a entrega, nunca o sentido nem o número; não acrescente número que não está lá). Um número específico se a fonte tiver. Sem venda forte: no máximo uma menção natural. Sem LINHA EM MAIÚSCULAS.

Saída: mapa fonte → Instagram (o que virou o quê), recipiente, fórmula, gancho (avise se passa de 125 caracteres), hashtags, mídia necessária e objetivo.`;

  const HUMANIZAR = `═══ TIRAR A CARA DE IA (PORTUGUÊS) ═══
Não é pra enganar detector (nenhuma edição garante). É tirar o que o leitor percebe: vocabulário e estrutura de frase. Legenda com cara de conta de marca não ganha salvamento nem envio.

1. Densidade, não palavra solta. Conte as marcas por parágrafo (ou slide): 1 é normal; 2 é limite (aponte e deixe); 3 ou mais, reescreva o parágrafo inteiro, no registro do autor. Sinônimo da mesma lista não conserta ("alavancar" → "potencializar").
Marcas e troca: potencializar, alavancar → aumentar, usar · desbloquear → liberar · mergulhar → ver de perto · jornada → caminho (ou corte) · crucial, fundamental → corte ou diga o porquê · utilizar → usar · significativo → o número · insights valiosos → o que aprendeu · ecossistema, universo de, panorama → mercado, área · empoderar → ajudar · fomentar → criar · holístico, abrangente → completo · elevar → melhorar · navegar por → lidar com · de forma eficaz → mostre o efeito · transformador, incrível → diga o que mudou.
Gramática: frase aberta com gerúndio ("Pensando nisso,") → comece por quem faz; "a implementação de", "a utilização de" → use o verbo com o sujeito.

2. Corte sempre, mesmo com uma ocorrência:
- Ponte de revelação: "a verdade é que", "e o melhor?", "O resultado?", "spoiler:", "Por quê? Porque". Apague a ponte; a frase seguinte era o ponto.
- Contraste falso: "não é X, é Y", "Não é sorte. É método.", "mais do que X, é Y". Afirme direto.
- Sinceridade encenada: "vou ser sincero", "papo reto:", "não vou mentir", "opinião impopular" sobre algo popular. Diga o fato seco.
- Clichê: "no mundo de hoje", "na era digital", "cada vez mais importante", "divisor de águas", "próximo nível", "o poder do...".
- Enchimento: "neste post", "você vai aprender", "você sabia que", "vem comigo", "é importante destacar", "ademais", "em suma".
- Isca e fechamento morto: "comenta SIM", "marca 3 amigos", "o que vocês acham?", "pensa nisso", "fica a dica".

3. Ritmo: só guarda contra texto mecânico; nunca crie variação artificial. Proibido: "Sem X. Sem Y. Só Z."; "Simples. Rápido. Eficaz."; linha de uma palavra pra drama ("Pronto."); gangorra de frase curta e longa. No máximo 2 fragmentos soltos por legenda. Uma ideia por linha, com linha em branco, é o layout do Instagram e fica. Mexa só no parágrafo plano (4+ frases do mesmo tamanho, sem oração que trabalhe), em uma frase. Slide não se corta nem se enche pra dar ritmo.

4. Trios: um trio natural com itens concretos fica. Trio oco ("clareza, foco e consistência"), repetido ("mais tempo, mais dinheiro, mais liberdade") ou o 3º trio da legenda: reescreva com 2 itens, ou 4 com um quebrando o padrão.

5. Marcas humanas, só com dado real do criador (sem ele, [PREENCHER: ...]): um número de precisão ímpar COM referência (quem, o quê, quando, quanto custou); um nome próprio (pessoa, marca, ferramenta, data); um detalhe concreto em 1ª pessoa; um fato datado e incômodo dito seco ("Perdi meu maior cliente em 14 de fevereiro.", sem "vou ser sincero, essa doeu"). Nunca insira sinceridade anunciada nem hesitação que o autor não escreveu ("talvez", "posso estar errado, mas").

6. Pontuação e emoji: travessão até ~1 a cada 100 palavras (1 ou 2 por legenda, 1 por slide); o excesso vira vírgula, dois-pontos, parênteses ou quebra de linha, nunca ponto. Zero travessão numa legenda longa também soa artificial. Sem "–" e "--" entre frases. Emoji 0 a 3, nunca fileira (🚀✨🔥💯).

7. Preserve a voz: minúsculas se o autor escreve assim, gírias, bordões, "pra", "tá", o emoji dele, 1 travessão, 1 trio natural, a opinião e a reação. Tom plano do começo ao fim também denuncia.

8. Autochecagem: criei frases curtas em fila ou "O resultado?"? Junte. Inseri sinceridade ou hesitação? Tire. Apaguei a voz (todo travessão, trio, emoji)? Devolva. Texto limpo recebe 2 ou 3 toques; na dúvida se é do autor, deixe.`;

  // extra: como identificar a fórmula de um gancho (ig-hook-extractor)
  const EXTRAIR = `═══ COMO IDENTIFICAR A FÓRMULA DE UM GANCHO ═══
1. Superfície: 1 foto + legenda → olhe numero, contraria, cena, confissao. 2 a 10 imagens com pontinhos de arraste → lista, antesdepois, mito, framework. Vídeo vertical → quebra, comoeu. Link com /reel/ é Reel; /p/ é foto ou carrossel (pergunte).
2. Traços de cada fórmula:
${FORMULAS.map(f => `- [${f.id}] ${f.nome}: ${f.reconhece}`).join('\n')}
3. Confiança: alta (0,8+) quando o gancho bate com o molde e o corpo segue a estrutura; média (0,5 a 0,8) quando o gancho encaixa mas o corpo é solto, ou duas fórmulas se sobrepõem (comum: numero e comoeu); devolva as 2 melhores com a nota de cada. Baixa (menos de 0,5): descreva a estrutura literalmente e sugira a mais próxima. Desempate pelo objetivo e pela superfície: resultado só na legenda = numero; o mesmo resultado em Reel com passos = comoeu.
4. Objetivo pelo fechamento: "salva", lista, método, passo a passo → salvamentos; "manda pra", contrária, mito → envios; cena, pergunta, confissão → comentários; prova de transformação, "segue pra" → seguidores.
5. Molde em branco: o molde da fórmula com as {lacunas} renomeadas pro tema do criador. Copie a estrutura, nunca a frase.
6. Audite a fonte pra não copiar o vício: travessão em excesso, acúmulo de palavras de IA, 20 a 30 hashtags, isca de engajamento, gancho que só faz sentido depois do "mais".`;

  // extra: ler o nicho com dados reais (ig-audience-insights)
  const NICHO = `═══ LER O NICHO COM DADOS REAIS ═══
- O que dá pra ver em conta de outra pessoa: posts e números públicos (views, curtidas, comentários, às vezes envios), seguidores, bio e categoria. Quem curtiu ou comentou não é acessível de forma confiável: nunca prometa lista de quem engajou.
- Normalize pelo tamanho antes de chamar um post de vencedor: compare as views com os seguidores do próprio perfil e com a média dele. Sem isso você copia efeito de conta grande, não de post bom.
- Padrão só é padrão quando se repete em vários posts do topo, não em um.
- O que extrair dos vencedores: a forma do gancho (pergunta, confissão, lista, dado), o tamanho da legenda, imagem, carrossel ou Reel, se tem número específico, se tem pergunta, qual o CTA.
- Ação: fazer mais do formato que vence, perfis pra acompanhar, e qual ferramenta usa isso (gancho, carrossel, legenda).
- Nunca invente post, número ou padrão. Amostra fina? Diga e sugira olhar uma hashtag vizinha ou perfis conhecidos.`;

  /* ---------- vícios de IA em português (complementam VICIOS_BASE do ig-base.js) ----------
     Todas com flags 'gi'. \b só funciona com letra sem acento nas pontas; onde a palavra
     começa com acento, uso (?<![letra]) como borda. Construídas com try/catch: se o navegador
     não aceitar alguma (ex.: lookbehind), só aquela regra fica de fora. */
  const LET = 'A-Za-zÀ-ÿ0-9_';
  const IW = `(?<![${LET}])`;                      // começo de palavra (aceita acento)
  const FW = `(?![${LET}])`;                       // fim de palavra (aceita acento)
  const INI = String.raw`(?:^\s*|(?<=[\n.!?:]\s*))`; // começo de frase
  const RE = src => { try { return new RegExp(src, 'gi'); } catch (e) { return null; } };
  const CON = String.raw`(?:al[ée]m disso|al[ée]m do mais|dessa forma|desta forma|nesse sentido|sendo assim|diante disso|por outro lado|outro ponto importante)`;
  const OCO = String.raw`(?:simples|pr[áa]tic[oa]s?|eficaz(?:es)?|eficientes?|r[áa]pid[oa]s?|f[áa]ceis|f[áa]cil|poderos[oa]s?|estrat[ée]gic[oa]s?|inovador(?:a|es)?|din[âa]mic[oa]s?|leve|barat[oa]|melhor|clareza|foco|consist[êe]ncia|disciplina|const[âa]ncia|prop[óo]sito|resultados?|crescimento|sucesso|liberdade|impacto|valor|autoridade|confian[çc]a|credibilidade|leveza|seguran[çc]a|lucro|escala|estrat[ée]gia|vis[ãa]o|mindset|mentalidade|conex[ãa]o|engajamento|transforma[çc][ãa]o|praticidade|agilidade|qualidade|excel[êe]ncia|inova[çc][ãa]o|efici[êe]ncia|produtividade|organiza[çc][ãa]o|equil[íi]brio)`;
  // emoji sem a flag u: pares de surrogate (exclui tons de pele e letras de bandeira soltas) + símbolos do BMP
  const EMO = String.raw`(?:\uD83C[\uDDE6-\uDDFF]\uD83C[\uDDE6-\uDDFF]|\uD83C[\uDC00-\uDDE5\uDE00-\uDFFA]|[\uD83D\uD83E][\uDC00-\uDFFF]|[☀-➿⭐⭕])`;
  const EMOJ = `${EMO}(?:\\uFE0F|\\uD83C[\\uDFFB-\\uDFFF]|\\u200D${EMO})*`;
  // "assinatura" de emoji de IA: 🚀 ✨ 🔥 💯 🙌 🎯 💡 📈 💪 ✅ 🤯 💥 ⚡
  const SIG = String.raw`(?:🚀|✨|🔥|💯|🙌|🎯|💡|📈|💪|✅|🤯|💥|⚡)`;

  const VICIOS = [
    {
      nome: 'Clichê de contexto ("no mundo de hoje")',
      re: RE(String.raw`\b(?:no mundo (?:de hoje|atual|moderno|digital|dos neg[óo]cios|do empreendedorismo|corporativo|das redes sociais)|nos dias (?:de hoje|atuais)|hoje em dia,? mais do que nunca|na era (?:digital|da informa[çc][ãa]o|da ia|das redes sociais|da intelig[êe]ncia artificial)|no atual cen[áa]rio|em tempos de (?:redes sociais|ia|intelig[êe]ncia artificial|incerteza)|cada vez mais (?:importante|essencial|necess[áa]rio|relevante|competitivo|conectado|digital))\b`),
      dica: 'Corte a frase de contexto e comece pelo fato, pelo número ou pela cena.'
    },
    {
      nome: 'Vocabulário de IA',
      re: RE(String.raw`\b(?:utiliz\w*|empoder\w*|fomenta\w*|desvend\w*|aprimor\w*|ecossistema|paradigma|sinergia|hol[íi]stic[oa]s?|abrangente|primordial|imprescind[íi]ve(?:l|is)|significativamente|panorama|universo d[oa]s?|elev(?:ar|e|a) (?:o|a|seu|sua|seus|suas) (?:n[íi]vel|patamar|neg[óo]cio|conte[úu]do|marca|jogo|resultados?)|(?:insights?|dicas|informa[çc][õo]es|li[çc][õo]es) valios[ao]s|naveg\w* (?:pel[oa]s?|n[oa]s?|por) (?:\w+ )?(?:universo|mundo|mar|desafios?|complexidades?|cen[áa]rio)|de (?:forma|maneira) (?:eficaz|eficiente|estrat[ée]gica|significativa|hol[íi]stica|assertiva))\b`),
      dica: 'Uma palavra dessas sozinha passa; três no mesmo parágrafo soam como IA. Troque pela palavra de conversa (utilizar → usar, de forma eficaz → mostre o efeito).'
    },
    {
      nome: 'Clichê de palco ("divisor de águas")',
      re: RE(String.raw`\b(?:divisor de [áa]guas|game[ -]?changer|muda(?:r)? o jogo|(?:pr[óo]ximo|outro|novo) (?:n[íi]vel|patamar)|subir de n[íi]vel|level up|deep dive|(?:no|ao) final do dia,? (?:o que (?:importa|conta|vale)|tudo se resume|quem)|a chave (?:do|para o|pro) sucesso|(?:o )?segredo do sucesso|f[óo]rmula do sucesso|o poder d[oa]s?|imperd[íi]ve(?:l|is)|must[- ]have|mudan[çc]a de paradigma)\b`),
      dica: 'Diga o que muda de fato (o valor, o prazo, o resultado), sem a frase de efeito.'
    },
    {
      nome: 'Sinceridade encenada ("vou ser sincero")',
      re: RE(String.raw`\b(?:vou ser (?:bem |muito |100% )?(?:sincer[oa]|honest[oa]|diret[oa]|transparente)|deixa eu ser (?:sincer[oa]|honest[oa]|diret[oa])|sendo (?:bem |muito )?(?:sincer[oa]|honest[oa])|sinceramente\?|posso ser (?:sincer[oa]|honest[oa]|vulner[áa]vel)|n[ãa]o vou mentir|vou abrir o jogo|vou abrir meu cora[çc][ãa]o|papo reto[:,]|opini[ãa]o impopular|preciso confessar|storytime)` + FW),
      dica: 'Apague o anúncio e diga o fato seco. Se não sobrar um fato, falta o dado real: peça ao criador.'
    },
    {
      nome: 'Conectivo de redação ("ademais", "é importante destacar")',
      re: RE(String.raw`\b(?:ademais|outrossim|em suma|em s[íi]ntese|sem mais delongas|dito isso|em [úu]ltima an[áa]lise|por fim,? mas n[ãa]o menos importante|pensando nisso|com isso em mente|tendo isso em (?:vista|mente)|tendo em vista (?:isso|que)|levando em (?:conta|considera[çc][ãa]o) (?:isso|que)|cabe (?:destacar|ressaltar|salientar|mencionar|lembrar)|vale (?:destacar|salientar|mencionar|frisar))\b|` + IW + String.raw`é (?:importante|v[áa]lido|interessante) (?:destacar|lembrar|notar|frisar|mencionar|salientar|ressaltar|observar|considerar)\b`),
      dica: 'Legenda não é redação. Corte o conectivo: a linha em branco já faz a transição.'
    },
    {
      nome: 'Conectivos em fila ("além disso", "dessa forma")',
      re: RE(String.raw`\b${CON}\b(?=[\s\S]{0,2200}?\b${CON}\b)`),
      dica: 'Dois ou mais conectivos de redação no mesmo texto. Corte; frases curtas em linhas separadas já se ligam.'
    },
    {
      nome: 'Frase de enchimento ("neste post", "você sabia que")',
      re: RE(String.raw`\b(?:nes[st]e (?:post|conte[úu]do|carrossel|v[íi]deo|reel|artigo)|voc[êe] vai (?:aprender|descobrir|entender) (?:como|o que|por que|tudo)|vem comigo|fica at[ée] o final|at[ée] o final (?:desse|deste) (?:post|v[íi]deo|carrossel)|voc[êe] sabia que|voc[êe] j[áa] (?:se perguntou|parou (?:pra|para) pensar)|j[áa] parou (?:pra|para) pensar|muita gente n[ãa]o sabe|poucas pessoas sabem|imagine (?:s[óo] )?(?:a seguinte situa[çc][ãa]o|um mundo))\b(?<=\S[\s\S]*\n[\s\S]*)`),
      dica: 'Fala sobre o post em vez de entregar. Corte e vá direto ao ponto (a 1ª linha o app já confere à parte).'
    },
    {
      nome: 'Ponte de revelação ("O resultado?")',
      re: RE(INI + String.raw`(?:e )?(?:o|a) (?:resultado|resposta|motivo|detalhe|li[çc][ãa]o|problema|pior|pulo do gato|virada|consequ[êe]ncia|conclus[ãa]o|moral da hist[óo]ria|pegadinha|surpresa)\?|\b(?:plot twist|aqui vai o (?:segredo|pulo do gato|truque)|adivinha s[óo]|sabe o que aconteceu\?)|\b(?:por qu[êe]|e sabe por qu[êe]|como assim)\? (?:porque|simples|[ée] simples)\b`),
      dica: 'Apague a pergunta-ponte e diga a resposta direto: ela era o ponto.'
    },
    {
      nome: 'Contraste falso ("Não é sorte. É método.")',
      re: RE(String.raw`\bn[ãa]o (?:é|foi|era|s[ãa]o) (?:s[óo] |apenas |sobre )?[^.!?\n,;]{2,40}\.\s+(?:é|foi|era|s[ãa]o)` + FW + String.raw`|\bn[ãa]o se trata (?:s[óo] |apenas )?de [^.!?\n]{2,50}?[,;.]\s*(?:mas|e sim|trata-se)\b|` + INI + String.raw`mais do que (?:s[óo] |apenas )?[^.!?\n,]{2,40}, [ée]` + FW),
      dica: 'Afirme o que é, sem montar o contraste. Ex.: "o que resolve é o método" em vez de "não é sorte. é método."'
    },
    {
      nome: 'Frases curtas em fila ("Sem X. Sem Y. Só Z.")',
      re: RE(String.raw`\b(?:sem|nada de|zero|nem) [^\s.!?,]+(?: [^\s.!?,]+)?[.,]\s+(?:sem|nada de|zero|nem) [^\s.!?,]+(?: [^\s.!?,]+)?[.,]\s+(?:s[óo]|apenas|somente|e sim)\s|` + INI + String.raw`(?:[^\s.!?]+(?: [^\s.!?]+)?[.!]\s+){2}[^\s.!?]+(?: [^\s.!?]+)?[.!](?=\s|$)|(?:^|(?<=\n))[ \t]*(?:pronto|exato|exatamente|ponto final|ponto|fim|acabou|s[óo] isso|simples assim)[.!][ \t]*(?=\n|$)`),
      dica: 'Junte numa frase completa, com uma oração que trabalhe ("sem promessa e sem mágica: o que funciona é o método"). No máximo 2 fragmentos soltos por legenda.'
    },
    {
      nome: 'Trio oco ou repetido ("clareza, foco e consistência")',
      re: RE(String.raw`\b(?:mais |menos )?${OCO},\s(?:mais |menos )?${OCO},?\s(?:e|ou)\s(?:mais |menos )?${OCO}\b|\b(mais|menos|sem|zero|nada de) [^\s,.!?]+(?: [^\s,.!?]+)?,\s\1 [^\s,.!?]+(?: [^\s,.!?]+)?,?\s(?:e\s)?\1 [^\s,.!?]+`),
      dica: 'Trio de palavras abstratas ou repetidas soa como IA. Fique com 2 itens, ou troque por itens concretos (o valor, o prazo, o nome).'
    },
    {
      nome: 'Emoji em fila',
      re: RE(`${EMOJ}(?:\\s?${EMOJ}){2,}|(${SIG})\\uFE0F?\\s?(?!\\1)${SIG}`),
      dica: 'Fileira de emoji (🚀✨🔥) soa como IA ou spam. De 0 a 3 na legenda, cada um num lugar com função.'
    },
    {
      nome: 'Meia-risca ou "--" entre frases',
      re: RE(String.raw`\s(?:–|--)\s`),
      dica: 'Entre frases use vírgula, dois-pontos ou quebra de linha (nunca ponto). Meia-risca só em intervalo de números (7–9).'
    },
    {
      nome: 'Fechamento sem alvo ("o que vocês acham?")',
      re: RE(String.raw`(?:(?<!a[íi],? )\bo que voc[êe] (?:acha|pensa)(?: disso| sobre isso)?\?|\bo que voc[êe]s (?:acham|pensam)(?: disso| sobre isso)?\?|\bdeixa (?:a |aqui a )?sua opini[ãa]o(?: nos coment[áa]rios| aqui)?|\bme conta (?:a[íi] )?nos coment[áa]rios|\bpensa nisso|\breflita sobre isso|\bfica a dica|\bfaz sentido pra voc[êe]\?|\be voc[êe],? o que acha\?)[.!]*(?=[^\n\w]{0,8}(?:\n|$))`),
      dica: 'Feche com uma pergunta que a pessoa responde com a experiência dela, ou com um único CTA que diz quando usar ou pra quem mandar.'
    },
    {
      nome: 'Promessa de resultado ("resultado garantido")',
      re: RE(String.raw`\b(?:resultados? garantidos?|100% garantid[oa]s?|sucesso garantido|(?:vai|v[ãa]o) mudar (?:a )?sua vida|f[óo]rmula m[áa]gica|dinheiro f[áa]cil|fique rico|ficar rico r[áa]pido|renda passiva garantida|sem esfor[çc]o nenhum|zer(?:ar|e|a) (?:o |seu )?imposto)\b`),
      dica: 'Promessa que o post não garante derruba a confiança (e em tema regulado é proibida). Mostre o mecanismo e o primeiro passo.'
    }
  ].filter(v => v.re);

  const humAnt = X.K.humanizar || {};
  const viciosAnt = Array.isArray(humAnt.vicios) ? humAnt.vicios : [];
  const nomesNovos = VICIOS.map(v => v.nome);

  Object.assign(X.K, {
    limites: LIMITES,
    formulas: FORMULAS,
    formula,
    blocoFormulas,
    objetivos: OBJETIVOS,
    objetivoNorm,
    // id do objetivo no banco do app (N.OBJETIVOS / Estúdio usa singular): 'salvamentos' → 'salvamento'
    objetivoApp: x => { const k = objetivoNorm(x); return k ? OBJETIVOS[k].appId : null; },
    blocoObjetivos,
    sinais: SINAIS,
    legenda: LEGENDA,
    carrossel: CARROSSEL,
    hashtags: HASHTAGS,
    plano: PLANO,
    perfil: PERFIL,
    reaproveitar: REAPROVEITAR,
    humanizarRegras: HUMANIZAR,
    extrair: EXTRAIR,
    nicho: NICHO,
    humanizar: Object.assign({}, humAnt, {
      vicios: viciosAnt.filter(v => v && !nomesNovos.includes(v.nome)).concat(VICIOS)
    })
  });
})();
