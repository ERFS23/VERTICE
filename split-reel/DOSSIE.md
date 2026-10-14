# Dossiê de Estilos de Edição com IA — Vértice

Tudo o que foi aprendido e construído nesta sessão sobre os dois estilos de edição de referência, mais o motor que os reproduz. Feito para ser exportado e usado fora desta conversa (outro Claude, outro editor, um freelancer ou você mesmo).

**Como ler:** a Parte A é o resumo. A B e a C são a decupagem de cada estilo. A D é o vocabulário comum de animação. A E é o motor técnico. A F é o fluxo de trabalho. A G é a lista honesta do que **não** foi aprendido ou não foi verificado.

---

## Parte 0 — Triagem deste pedido

| Ponto | Decisão tomada |
|---|---|
| "Tudo que aprendeu" | Os 2 estilos de referência, o motor `split-reel`, a skill e o fluxo de uso. Nada além disso foi estudado. |
| "Exportar" | Entregue em Markdown (abre em qualquer lugar, vira PDF/Word com um clique). Está também no repositório, na pasta `split-reel/`. |
| "Sem deixar escapar nenhum detalhe" | Incluí valores exatos (cores, tamanhos, tempos, física das molas). Onde só estimei, está marcado como **aproximado**. |
| Lacunas | Não analisei áudio (música, efeitos sonoros) em nenhuma das referências. Isso está na Parte G. |
| Referências de terceiros | Os vídeos são de outros criadores. O dossiê descreve **técnica e estrutura**, não copia roteiro, marca ou arte. Troque nomes, logos e cores pela identidade da Vértice antes de publicar. |

---

## Parte A — Resumo executivo

Foram estudados **dois vídeos de referência**:

| | Estilo 1 | Estilo 2 |
|---|---|---|
| Formato | 9:16 vertical (720x1280, 42,9 s) | 16:9 horizontal (640x360, 591,8 s; analisados só os 2 primeiros minutos) |
| Ideia central | Tela dividida 50/50: animação em cima, rosto cru embaixo | Rosto que alterna entre 5 layouts a cada 2–4 s |
| Paleta | Preto + rosa neon + roxo | Preto + verde-limão neon, com variante off-white |
| Legenda | Pílula escura com sombra rosa, karaokê em 3 cores | Caixa-alta condensada sem fundo, palavra a palavra |
| Progresso | Capítulos "03 / 08" + barra segmentada | Barra contínua tracejada na base |
| Motor | Composição `SplitReel` | Composição `TalkReel` |

**Princípios que valem para os dois:**
1. A animação **ilustra literalmente a frase falada**.
2. Troca visual relevante a cada ~1 s; troca de cena a cada 2–6 s.
3. Tudo entra com **mola** (nunca aparece "seco") e em **cascata**.
4. **Uma palavra de destaque** por título, em cor/fonte diferente.
5. Elementos-âncora **persistem** entre cenas em vez de sumir e reaparecer (estilo 1).
6. O vídeo termina com um **CTA visual** que ensina a ação (seguir, comentar, inscrever-se).

---

## Parte B — Estilo 1: "Tela Dividida + Motion" (9:16)

### B.1 Ficha técnica da referência
- 720x1280, 30 fps, 42,93 s, com áudio. Foi recriado em **1080x1920**.
- Gravação em selfie, fundo neutro de parede e porta. Rosto centralizado.

### B.2 Geometria do quadro (em 1080x1920)
| Zona | Posição | Detalhe |
|---|---|---|
| Metade de cima | y 0 a 960 | Motion graphics |
| Linha divisória | y = 958 a 962 (4 px) | Rosa neon (#FF2D7A) com glow. Na referência a linha rosa fica na linha 640 de 1280, ou seja, **exatamente 50/50** (medido no pixel) |
| Legenda | Centrada na linha, topo em y = 918 | Metade dentro de cada zona |
| Metade de baixo | y 960 a 1920 | Vídeo cru, `object-fit: cover`, sem zoom, sem efeito, sem corte |

### B.3 Identidade visual (valores exatos usados no motor)
**Cores**
| Papel | Hex |
|---|---|
| Fundo | `#050306` |
| Painéis | `#0D070C` |
| Rosa (principal) | `#FF2D7A` |
| Magenta | `#E0177F` |
| Roxo | `#8A3FFC` |
| Texto | `#F4F1F5` |
| Cinza | `#A9A6AE` / dim `#6E6A73` |
| Etiqueta do cursor (laranja) | `#E8692F` |
| Check de sucesso | `#22C55E` |
| Degradê de títulos | `linear-gradient(90deg,#FF2D7A,#C026D3,#8A3FFC)` |
| Tiles do grid | linha 1 rosa→magenta, linha 2 magenta→roxo, linha 3 roxo claro→azul-roxo |

**Fundo (Backdrop)**
- Preto quase puro.
- Brilho radial magenta no topo central (elipse 70% x 45%, centro a 50%/8%), que "respira": opacidade oscila entre 85% e 100% com período de ~157 quadros (`sin(frame/25)`).
- Grade de pontos brancos a 9% de opacidade, espaçamento de 36 px, com máscara que some nas bordas.
- Vinheta escura nas bordas (até 85% preto).

**Tipografia (3 famílias, cada uma com um papel)**
| Família | Peso | Usos |
|---|---|---|
| Inter | 800/900 | Títulos em caixa-alta e legendas |
| JetBrains Mono (espaçamento largo, 3–6 px) | 400/500 | Rótulos técnicos: "• OS AGENTES", "03 / 08", "SKILL PACK", "CÓDIGO ABERTO · LICENÇA MIT" |
| Instrument Serif itálico | 400 | **Uma** palavra de destaque por título, com degradê |

**Brilho padrão:** borda de 2–3 px na cor rosa + `box-shadow: 0 0 24px cor80, 0 0 48px cor33`.

### B.4 Cabeçalho de capítulos
- Posição: topo em y = 160, margens laterais de 90 px.
- Esquerda: ponto rosa (11 px, com glow) + nome do capítulo em mono, caixa-alta, espaçamento 6 px, tamanho 24.
- Direita: contador `03 / 08` em cinza, mesmo estilo.
- Abaixo (18 px de distância): **barra segmentada**, um segmento por capítulo, altura 5 px, espaço de 8 px. Capítulos já vistos ficam 100% rosa, o atual enche conforme o tempo, os futuros ficam a 12% branco.
- O nome do capítulo entra com mola (deslocamento de 20 px da esquerda).

### B.5 Título de capítulo
- Topo em y = 250, centralizado.
- Caixa-alta Inter 900, 66 px, espaçamento −1,5.
- Palavra de destaque: Instrument Serif itálico 82 px, degradê rosa→roxo.
- Entra **palavra por palavra**, atraso de 0,09 s entre palavras, subindo 40 px.
- Na referência os títulos só aparecem a partir do capítulo 4 ("A EQUIPE").

### B.6 Legenda karaokê
- **Blocos de 2 a 4 palavras**, até 26 caracteres.
- Quebra de bloco: ao atingir o limite, em pontuação (`. , ! ? ; :`), em pausa maior que 0,45 s, ou quando o texto marca fim de bloco.
- O bloco fica na tela até o próximo começar (se o intervalo for menor que 0,6 s), senão fica 0,35 s a mais.
- **3 estados por palavra:** futura = cinza `#6E6A73`; falando agora = rosa; já falada = branca.
- Caixa: fundo `#1D1B21`, padding 10/26/14 px, canto 6 px, **sombra sólida rosa deslocada 6 px para baixo e direita** (efeito adesivo) + sombra suave preta.
- Fonte Inter 800, 50 px, espaçamento −1. Entrada com mola: escala 0,85→1.

### B.7 Estrutura da referência (8 capítulos, tempos **aproximados**, ±0,5 s)
Fala do original resumida (é uma referência de terceiro, não é para copiar).

| # | Capítulo | Tempo | O que acontece no motion |
|---|---|---|---|
| 1 | O GANCHO | 0–5 s | Palavra "Instagram" gigante em degradê, digitada letra a letra. Cursor com etiqueta laranja chega. A palavra **desmonta e cai** (letras ficam cinza, giram e despencam) quando a fala diz "matar". Um celular com perfil sobe e os 9 tiles do grid mostram as letras da palavra. O cursor clica num tile, que pulsa. Os tiles viram ícones com *flip*. Chip "TOCANDO O SEU PERFIL" aparece à direita |
| 2 | A SKILL | 5–8,5 s | Celular vai para a esquerda. Cartão estilo etiqueta de produto ("SKILL PACK / Instagram Skills / github · usuário" + código de barras). Selo estrelado girando "100% GRÁTIS" com raios. Rodapé "CÓDIGO ABERTO · LICENÇA MIT" |
| 3 | OS AGENTES | 8,5–13 s | Contador "02 → 09 AGENTES". Mini-robô entra no cartão. O celular some e abre uma **grade 3x3 de robôs** com rótulos |
| 4 | A EQUIPE | ~13–23,5 s | Título "CADA UM NA *sua* ÁREA". Cada agente aparece num **cenário próprio com mascote**: Legenda (digita texto num post), Carrossel (carrossel girando que vira cartão), Plano (calendário semanal com dias sendo marcados), Hashtags (máquina que cospe hashtags), Humanizador (aspirador que tira "cara de IA" do texto, marcando frases em amarelo) |
| 5 | TENDÊNCIAS | ~23,5–29,5 s | Título "O QUE TÁ *bombando*". Mosaico de tiles com alguns em destaque amarelo. Mascote com lupa. Cartão de alerta "Ninguém te conta". Painel "FORMATADOR" com duas opções ("seu público" / "suas palavras") |
| 6 | ESTRATÉGIA | ~29,5–34,5 s | Título "O QUE E *quando* POST". Celular à esquerda e painel à direita: seletor de formato (Reels / Carrossel / Story), seletor de dia da semana, bloco "REAPROVEITAR". O cursor clica em cada opção, que vira rosa com check verde |
| 7 | INSTALAR | ~34,5–37,5 s | Título "BAIXA EM *uma* LINHA". Terminal com comando digitado (repositório + "294 ★ no GitHub"). Chip "1 LINHA". Robôs aparecem. Selo "INSTALADO" |
| 8 | PASSO A PASSO | ~37,5–42,9 s | **CTA em UI real:** perfil → botão Seguir → caixa de comentário em que a palavra-chave é digitada → ícone de envio → DM chegando com o link. Cartão branco com checklist. Letras da palavra-chave formadas por robôs. Rótulo "NA SUA DM" |

### B.8 Ritmo
- Gancho em menos de 1,5 s, com o elemento mais chamativo do vídeo (a palavra que explode).
- Algo novo entra, se move ou muda a cada ~1 s.
- Troca de capítulo a cada 4–6 s.
- A metade de baixo **nunca corta**: quem dá o ritmo é a de cima.

---

## Parte C — Estilo 2: "Talking Head + Motion" (16:9)

### C.1 Ficha técnica da referência
- 640x360, 30 fps, 591,8 s. Foram analisados os **primeiros 120 s**, que concentram a edição de interesse. Recriado em **1920x1080**.
- Apresentador em câmera de mesa, fundo com estante de livros e lâmpada verde (a lâmpada ecoa a cor da marca).

### C.2 Esqueleto fixo (em todos os layouts)
| Elemento | Detalhe |
|---|---|
| Marca d'água | Wordmark no canto superior esquerdo, Inter 800, 34 px, a 64 px da borda esquerda e 44 px do topo. Branca no escuro, preta no claro |
| Barra de progresso | Base, a 40 px da borda, margens de 64 px. Trilho **tracejado** (3 px) + preenchimento verde de 7 px com bolinha na ponta (glow no escuro). Cresce de forma contínua |
| Legenda | Caixa-alta condensada (Anton, 64 px), centralizada, topo em y = 890. **Sem caixa de fundo**. Palavra fica branca quando falada (futuras a 40% de opacidade). No fundo claro: preto, sem sombra |

### C.3 Cores e fontes (valores usados)
| Papel | Valor |
|---|---|
| Fundo escuro | `#030403` |
| Fundo claro | `#FAFAF7` (pontilhado preto a 10%, espaçamento 40 px, cruzes "+" nos 4 cantos) |
| Verde | `#7CFF1E` (escolhido a olho para o neon do fundo escuro; no fundo claro a referência usa um verde mais fechado, medido em `#52A90B`) |
| Preto de texto | `#0D0D0D` |
| Branco | `#F2F4EF` |
| Cinza | `#7A8274` |
| Condensada | **Anton** (títulos, palavras gigantes, legenda) |
| Sans | Inter (botões, rótulos, wordmark) |
| Mono | JetBrains Mono (eyebrows) |
| Brilho no escuro | `0 0 18px rgba(124,255,30,.55), 0 0 36px rgba(124,255,30,.22)` |

### C.4 Os 5 layouts em detalhe
**1. `full` (tela cheia)**
- Vídeo cru em 1920x1080, `object-fit: cover`.
- Degradê escuro sutil no topo (45%) e na base (55%) para dar leitura a legenda e marca.
- Só entram **itens por cima**: etiquetas (pílulas), palavras gigantes, odômetro, botões.

**2. `stage` (palco)**
- Fundo escuro com brilho verde (elipse a 70%/20%) e pontilhado verde a 12%.
- Rosto vira **cartão vertical** de 390x730, centro, topo em y = 215, borda verde de 3 px com glow.
- **Painéis de screenshot** em perspectiva dos dois lados (inclinados ±18–22° em Y, borda verde, barra de janela com 3 bolinhas).
- Título condensado no topo (92 px).

**3. `canvas`**
- Sem rosto. Fundo escuro **com grade em perspectiva no chão** (linhas verdes a 28%, passo de 90 px, inclinação de 62°, máscara que some para cima).
- Silhuetas de prédios com pontilhado ao fundo (na referência; no motor ficam como grade de chão).
- Cartões/palavras entram em sequência. **Linha tracejada verde** que se desenha (traço de 70 px, vão de 36 px, espessura 12, glow verde) serve de transição.

**4. `light` (claro)**
- Fundo `#FAFAF7` com pontilhado e cruzes nos cantos.
- Rosto em cartão de 520x840 à direita, **borda preta de 4 px e sombra sólida preta deslocada 12 px**.
- Explicação à esquerda: título condensado preto com uma palavra em verde.
- Elementos típicos: janela de app com ícones ("SEU COMPUTADOR"), blocos que acendem ("90% dos serviços"), diagrama de fluxo com setas tracejadas ("WORD → REA → SEU WORD", legenda "Clone o app e crie a sua versão").

**5. `screen` (gravação de tela)**
- Gravação de tela em 1230x820 à esquerda, contorno fino e glow.
- Rosto em retângulo de 530x700 à direita, com o **@ do canal** embaixo (Inter 800, 40 px).
- Fundo escuro.
- Na referência a tela de fundo é de uma rede social em modo escuro com o rosto em coluna à direita e "@orafavoss"; o motor usa o mesmo arranjo.

### C.5 Itens de motion (estilo 2)
| Item | Aparência | Parâmetros |
|---|---|---|
| `tag` | Pílula com ícone (verde) e texto. Variante `solid` = fundo verde, texto preto | `icon`, `text`, `solid`, `size` |
| `eyebrow` | Ponto verde + texto mono caixa-alta, espaçamento 4 | `text`, `size` |
| `big` | Palavra condensada gigante (padrão 150 px) que entra subindo e crescendo. `ghost` deixa a palavra anterior apagada a 28%; `green` = verde com glow | `text`, `size`, `green`, `ghost` |
| `odometer` | Cartão escuro com rótulo, número grande verde e legenda mono, contando de `from` a `to` | `label`, `sub`, `from`, `to`, `duration` |
| `panel` | Janela de screenshot em perspectiva (3 bolinhas, linhas de texto aleatórias) | `w`, `h`, `tilt`, `title`, `lines` |
| `wave` | Curva tracejada verde que se desenha | `y`, `amp`, `duration` |
| `appwindow` | Janela com grade 3 colunas de ícones em tiles pretos; um item pode ser destacado em verde com contorno | `title`, `apps[{icon,label}]`, `highlight`, `highlightAt` |
| `blocks` | Grade de 5 colunas de quadrados pretos com ponto verde; os apagados são tracejados | `total`, `on` |
| `btn` | Botão pílula que, no momento `clickAt`, vira verde com check ("Gostei", "Inscrito") | `text`, `doneText`, `icon`, `clickAt` |
| `head` | Título alinhado à esquerda no meio da cena | `text`, `accent`, `size` |

### C.6 Estrutura da referência (primeiros 2 min, tempos **aproximados**)
| Bloco | Tempo | O que acontece |
|---|---|---|
| Gancho "R.E.A." | 0–~25 s | Abre em `full` com tags. Corta para `stage` com título "A NOVA MODA", painéis de repositório e artigo se alternando. "NINGUÉM / NINGUÉM PARA DE FALAR". Palavra gigante "REA" com **linha tracejada verde** passando por baixo. Depois `canvas`: "ABREVIAÇÃO EM INGLÊS" com 3 cartões *Reverse / Engineer / Anything* e ícones sobre elipses brilhantes no chão. Em `full`, "ENGENHARIA REVERSA" aparece no canto, com a palavra anterior sumindo e "DE TUDO" |
| Promessa | ~25–40 s | `full` com tags "MCP", "Open source", "GitHub", "Claude Code". "USANDO ESSA TECNOLOGIA". Odômetro "Qualquer app 1 → 99 clones" + palavra "QUALQUER" com "CLONE" fantasma. Canvas com cartão "Repositório" e linha tracejada até o ícone "SEU CLAUDE"; cartão estilo terminal "copie este aplicativo" com caret piscando. Globo em wireframe verde ("o mundo todo falando") |
| Título "APRENDA FÁCIL" | ~40 s | `full` com "APRENDA" à esquerda e "FÁCIL" gigante à direita |
| Vinheta da marca | ~42 s | Tela preta com o wordmark centralizado e pontilhado, ~1,5 s |
| Apresentação | ~44–60 s | `full` com "SEJA MUITO BEM-VINDO AO CANAL", wordmark na base + "MEU NOME É …", pílula "Especialista em IA", eyebrow "• TREINANDO EMPRESAS" com logos de clientes, "• CONSULTORIA" com título "IA NA SUA EMPRESA DO JEITO CERTO". Cartão verde "2º link da descrição" com seta |
| CTA de engajamento | ~60–68 s | Botões "Gostei" e "Inscrever-se" com cursor que clica e vira verde (ficam "Gostei" e "Inscrito"). Texto "ISSO ME AJUDA DEMAIS" |
| Explicação `light` | ~70–100 s | "VAMOS SUPOR: Um app que chama atenção", janela de app com 6 ícones (Agenda, Email, Word, Planilha, Chat, Arquivos), cursor destaca "Word". "O WORD: 90% dos serviços", 10 blocos com 9 acesos. Fluxo "COM O REA": Word ⇢ REA ⇢ Seu Word, com legendas "Clone o app" e "e crie a sua versão" |
| Demonstração `screen` | ~100–120 s | Gravação de tela de rede social em modo escuro, rosto à direita, "@orafavoss" |

### C.7 Gramática do motion do estilo 2
1. **Troca de layout a cada 2–4 s** é o motor de retenção.
2. **Palavra-chave vira elemento visual** (palavra gigante, odômetro, ícone).
3. **Eyebrow mono + título condensado** anunciam cada bloco.
4. **Linha tracejada verde** liga cenas.
5. **UI simulada** (terminal digitando, janela de app, botões de rede social).
6. **Estatística visual** (blocos acendendo) em vez de só dizer o número.
7. **Prova social** com tag de contexto e logos.
8. **Abertura em 3 beats:** gancho → vinheta de marca → apresentação.

---

## Parte D — Vocabulário comum de animação

| Conceito | Valor |
|---|---|
| Mola padrão (`popIn`) | `damping 13` (11–14 conforme o elemento), `mass 0.7`, `stiffness 140`. Resultado: ~0,3 s com leve sobre-passagem |
| Entrada típica | opacidade 0→1 (1,4x mais rápida que a escala), escala 0,6→1, sobe 30 px |
| Saída | fade em 0,2 s + zoom leve de 6% |
| Cascata | 45 ms (letras), 60 ms (tiles), 70 ms (robôs), 90 ms (palavras de título), 350 ms (itens de checklist) |
| Easing de movimento | `inOut(cubic)` |
| Contadores | `out(cubic)`, 0,7–1,6 s |
| Digitação | linear, ~1,2 s para um comando; caret pisca a 2 Hz |
| Cursor | percorre pontos com `inOut(cubic)`; clique = escala 0,85 por 0,15 s + onda branca de 0,6 s; etiqueta colorida (marca) no canto |
| Flip de tiles | rotação em Y de 0 a 180° em 0,3 s, com atraso de 50 ms por tile, troca o conteúdo no meio |
| Explosão de letras | a partir de `explodeAt`, em 0,7 s: deslocamento horizontal aleatório (±130 px), queda de 80–460 px, rotação ±60°, letras ficam cinzas |
| Selo | gira de −90° a −12° com mola; 10 raios que saem e somem em 0,6 s |
| Aleatoriedade | sempre **determinística** (semente fixa), para o render ser reproduzível |

---

## Parte E — O motor técnico (`split-reel/`)

**Stack:** Remotion 4 (React) + TypeScript + FFmpeg + Chromium headless. Roda em Node 22. Fontes via `@fontsource`.

### E.1 Arquivos (repositório `erfs23/vertice`, branch `claude/reel-tela-dividida`)
```
.claude/skills/reel-tela-dividida/SKILL.md   skill que dirige o fluxo
split-reel/
  ESTILO.md  ESTILO-2.md  DOSSIE.md  README.md
  package.json  tsconfig.json  .gitignore
  scripts/
    render.mjs             junta palavras + cenas e renderiza (escolhe a composição sozinho)
    chunks-to-words.mjs    legenda por bloco {t,s,e} -> palavras com tempo interpolado
    srt-to-captions.mjs    .srt (CapCut) -> captions.json
    transcribe.py          Whisper com tempo por palavra (rodar na sua máquina)
  remotion/
    index.ts  Root.tsx     registra as composições SplitReel e TalkReel (30 fps)
    theme.ts  types.ts  anim.ts
    SplitReel.tsx          estilo 1
    elements/  Chrome.tsx  Captions.tsx  Icon.tsx  Library.tsx
    talk/      TalkReel.tsx  theme.ts  types.ts   (estilo 2)
  public/projects/demo/        projeto de exemplo do estilo 1
  public/projects/talk-demo/   projeto de exemplo do estilo 2 (scenes.json, captions.json)
```
Vídeos (`.mp4`) e a pasta `out/` não vão para o git. Para regenerar as demos, é preciso ter os vídeos locais.

### E.2 Comandos
```bash
cd split-reel && npm install
npm run studio                              # pré-visualização no navegador
node scripts/render.mjs <projeto>           # vídeo final em out/<projeto>.mp4
node scripts/render.mjs <projeto> --still=3 # um quadro em out/<projeto>-3s.png
```
Saída: H.264, CRF 18, 30 fps, com o áudio do vídeo cru. Estilo 1 = 1080x1920; estilo 2 = 1920x1080. O render de 13 s leva ~1 min em CPU.
Na nuvem, `render.mjs` usa o Chromium pré-instalado em `/opt/pw-browsers`; na sua máquina, defina `REMOTION_BROWSER` se necessário.

### E.3 Formato do projeto
Cada projeto fica em `public/projects/<nome>/` com: `raw.mp4`, `words.json` (ou `captions.json`) e `scenes.json`.

- **`words.json`:** `[{"w":"palavra","s":0.00,"e":0.40}, ...]` (tempo em segundos; `brk:true` força quebra de bloco).
- **`captions.json`:** `[{"t":"texto do bloco","s":0,"e":1.2}, ...]` (o script distribui o tempo entre as palavras proporcionalmente ao tamanho).
- **`scenes.json` estilo 1:** `video`, `objectPosition`, `brandTag`, `durationSec`, `chapters[{label,start,end,title?,titleAt?,elements[]}]`.
- **`scenes.json` estilo 2:** `video`, `objectPosition`, `brand`, `handle?`, `screen?`, `durationSec`, `scenes[{start,end,layout,head?,items[]}]`.
- Campos comuns dos itens: `type`, `at`, `out`, `x`, `y`, `scale`, `moveTo` (um objeto ou lista de `{at,x?,y?,scale?,dur?}`).

### E.4 Elementos do estilo 1 (biblioteca `Library.tsx`)
`kinetic` (palavra digitada/explodível), `phone` (perfil + grid 3x3; `tiles`, `highlight`, `swap`), `card` (etiqueta de produto), `badge` (selo), `counter`, `robot`, `robots` (grade de agentes), `terminal`, `checklist`, `text`, `chip`, `iconTile`, `panel`, `cursor`.
Ícones disponíveis (27): menu, carousel, calendar, flame, smile, hash, users, recycle, user, play, check, star, heart, chat, send, bolt, chart, camera, search, home, plus, grid, money, rocket, lock, terminal.

Para criar um elemento novo: escrever o componente em `Library.tsx`, registrar em `REGISTRY` e documentar na skill.
Para trocar a identidade: editar `remotion/theme.ts` (estilo 1) e `remotion/talk/theme.ts` (estilo 2).

### E.5 O que a demo contém
- **demo** (estilo 1): 13,2 s, 3 capítulos (gancho, skill, agentes). Recria só o início do reel de referência, com a filmagem do próprio original como "rosto" de teste.
- **talk-demo** (estilo 2): 13,2 s, 5 cenas (full, stage, canvas, light, full). Mesmo "rosto" de teste.

---

## Parte F — Fluxo de trabalho para um vídeo novo

1. **Escolher o estilo** pelo formato: 9:16 → estilo 1, 16:9 → estilo 2.
2. **Colocar o vídeo cru** em `public/projects/<nome>/raw.mp4`. Se não for do formato certo, ajustar `objectPosition` para manter o rosto centralizado.
3. **Transcrever com tempo por palavra:** `python scripts/transcribe.py raw.mp4 words.json` (na sua máquina), ou exportar o `.srt` do CapCut e converter com `srt-to-captions.mjs`.
4. **Roteiro visual:** dividir em capítulos/cenas (estilo 1: 4–6 s; estilo 2: 2–4 s). Fazer uma tabela *tempo | fala | visual*. Para cada frase, decidir **qual imagem ilustra literalmente o que se diz**. Validar com você antes de codificar.
5. **Escrever `scenes.json`**, alinhando `at` ao início da palavra-chave. Cursor chega ~0,3 s antes da palavra e clica no início dela.
6. **Conferir em quadros parados** (4–5 momentos) e procurar sobreposição, texto cortado ou algo cobrindo a legenda.
7. **Render final** e revisão.

**Área segura (estilo 1):** de y 260 a 900 na metade de cima (cabeçalho até y≈210, título em y≈250–340, nada abaixo de 900 por causa da legenda).
**Área segura (estilo 2):** manter itens fora de y > 860 (legenda) e fora das margens de 64 px (marca/barra).

---

## Parte G — Limitações, lacunas e o que verificar

Honestidade sobre o que **não** está neste dossiê ou ficou incerto:

1. **Áudio das referências não foi analisado.** Não sei qual música, efeitos sonoros (whoosh, cliques, notificação) ou mixagem os vídeos usam. O motor mantém só o áudio original do vídeo cru. Se o som faz parte do estilo para você, é um próximo passo.
2. **Nenhuma transcrição das falas.** O modelo de transcrição não pôde ser baixado nesta sessão (rede bloqueada). As frases citadas vêm das legendas lidas nos quadros do estilo 1; no estilo 2 não li o roteiro.
3. **Amostragem visual:** estilo 1 em 2 quadros por segundo; estilo 2 em 1 quadro a cada 2 s, mais alguns quadros em resolução cheia. **Transições rápidas (menos de 0,5 s) e microanimações podem ter passado.** Tempos de capítulo são aproximados.
4. **Estilo 2: só os 2 primeiros minutos** dos 9,9 minutos do vídeo.
5. **Reconstrução do estilo 2 é parcial:** não foram feitos o globo wireframe, o aspirador "humanizador" (estilo 1), os logos de clientes, a silhueta de prédios e o diagrama de fluxo com setas. O motor cobre a **gramática** (layouts, tags, odômetro, painéis, blocos, botões, linha tracejada), não cada ilustração.
6. **Estilo 1:** a demo recria o capítulo 1, 2 e o começo do 3. Os capítulos de 4 a 8 estão **descritos**, mas não implementados como cenas prontas (os elementos para fazê-los existem: `checklist`, `terminal`, `cursor`, `robots`).
7. **Fontes:** Inter, JetBrains Mono, Instrument Serif e Anton são **aproximações** abertas das fontes dos vídeos originais, que não consegui identificar com certeza.
8. **Nunca testei o motor com um vídeo cru seu.** A demo usa a filmagem do próprio reel de referência recortada. Resultados com sua filmagem (iluminação, enquadramento) podem exigir ajuste de `objectPosition`.
9. **Cores de terceiros:** rosa/roxo (estilo 1) e verde-limão (estilo 2) são das referências. Para a Vértice, troque pelos tokens da sua marca.
10. **Nada foi enviado ao YouTube/Instagram** e nenhuma conta foi acessada. O motor só gera o arquivo `.mp4`.
11. **Direitos:** nomes, logos, @ e frases dos vídeos de referência pertencem aos criadores. Use apenas a **técnica**.
