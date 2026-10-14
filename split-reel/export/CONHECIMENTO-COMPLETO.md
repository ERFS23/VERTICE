# CONHECIMENTO COMPLETO — edição de vídeo, motion design e SFX (Vértice)

Arquivo único para colar/anexar em outro agente. Contém, em ordem: LEIA-ME-AGENTE.md; DOSSIE.md; ESTILO.md; ESTILO-2.md; SKILL.md (skill reel-tela-dividida).


==============================================================================
# ARQUIVO: LEIA-ME-AGENTE.md
==============================================================================

# LEIA-ME-AGENTE — Kit de edição de vídeo, motion design e SFX (Vértice)

Você (agente) está recebendo o conhecimento completo de um sistema que **edita vídeos de rosto com motion graphics e SFX gerados por código**. Leia este arquivo primeiro; depois `DOSSIE.md` (referência completa), `ESTILO.md` e `ESTILO-2.md` (decupagem dos 2 estilos) e `SKILL.md` (fluxo de trabalho). Se recebeu só `CONHECIMENTO-COMPLETO.md`, ele já contém tudo isso em um arquivo.

## 1. O que existe
| Peça | O que é |
|---|---|
| **Estilo 1** | 9:16, tela dividida 50/50: motion rosa/roxo em cima, rosto cru embaixo, legenda karaokê na divisória, capítulos "03 / 08". Composição `SplitReel` |
| **Estilo 2** | 16:9, talking head verde-limão com 5 layouts (`full`, `stage`, `canvas`, `light`, `screen`). Composição `TalkReel` |
| **Motor** | Remotion 4 + TypeScript + FFmpeg. Cenas descritas em JSON (`scenes.json`) |
| **SFX** | `scripts/sfx.py`: 7 sons sintetizados + cues automáticos + mixagem em −14 LUFS |
| **Análise de áudio** | `scripts/audio/*`: como medir níveis, achar SFX/cama musical em vídeos de referência |

## 2. Instalar e rodar (5 minutos)
```bash
cd split-reel && npm install          # Node 18+; ffmpeg e python3 com numpy/scipy no PATH
node scripts/render.mjs demo --still=3          # testa: gera out/demo-3s.png
node scripts/render.mjs demo --sfx              # vídeo + SFX
npm run studio                                  # pré-visualização no navegador
```
O render usa Chromium. Se não achar, defina `REMOTION_BROWSER=/caminho/do/chrome`. Os vídeos `.mp4` de exemplo **não vêm no kit**: coloque o seu em `public/projects/<nome>/raw.mp4`.

## 3. Fluxo para um vídeo novo (resumo; detalhes em SKILL.md)
1. Escolha o estilo pelo formato (9:16 → estilo 1; 16:9 → estilo 2).
2. Vídeo cru → `public/projects/<nome>/raw.mp4`.
3. Transcrição com tempo por palavra: `python scripts/transcribe.py` (Whisper) ou `.srt` do CapCut + `scripts/srt-to-captions.mjs`.
4. **Roteiro visual** em tabela *tempo | fala | visual* — aprove com o usuário antes de codificar. Cada frase falada deve ter uma imagem que a ilustre **literalmente**.
5. Escreva `scenes.json` (formato no DOSSIE, Parte E.3 e na SKILL).
6. Confira 4–5 quadros parados: `node scripts/render.mjs <nome> --still=SEG`.
7. Render final com `--sfx`. Valide com `python3 -I scripts/audio/sfx-check.py <nome>`. **Peça ao usuário para ouvir com fone.**

## 4. Regras que valem sempre
- Troca visual relevante a cada ~1 s; troca de cena/layout a cada 2–6 s.
- Tudo entra com mola e em cascata; nunca "seco". Uma palavra de destaque por título.
- Estilo 1: nada passa de y = 900 na metade de cima (legenda sobre a linha). Estilo 2: itens fora de y > 860 e das margens de 64 px.
- O cursor chega ao alvo ~0,3 s antes da palavra e clica no início dela.
- SFX: `whoosh` na troca de cena, `pop` na entrada, `tick` na digitação/cascata, `click` no cursor, `ding` no check, `thud` no selo/explosão. Perfil padrão `discreto`.
- **Nunca copie** nomes, logos, @ ou frases dos vídeos de referência; use só a técnica. Nunca use samples de áudio de terceiros.

## 5. Verdades incômodas (não se esqueça)
- Os 2 estilos vêm de 2 vídeos de referência analisados **por quadros e sinal, sem transcrição e sem ouvir**.
- As referências **não têm SFX detectável**; só uma cama musical baixa. A camada de SFX é decisão de design e **nunca foi ouvida** por quem a criou, apenas medida.
- Só 3 dos 8 capítulos do estilo 1 e 5 cenas do estilo 2 estão implementados como demo. Os elementos para o resto existem.
- Fontes (Inter, JetBrains Mono, Instrument Serif, Anton) são aproximações abertas.
- Paleta é a das referências; troque em `remotion/theme.ts` e `remotion/talk/theme.ts` para a marca.

## 6. Prompt pronto para colar no seu agente
> Você é editor de vídeo e motion designer da Vértice. Use o kit em `split-reel/`. Quando eu enviar um vídeo cru e a transcrição, (1) pergunte o formato (9:16 ou 16:9) se não for óbvio, (2) proponha o roteiro visual em tabela *tempo | fala | visual* e espere meu ok, (3) escreva o `scenes.json`, (4) mostre 4–5 quadros parados, (5) renderize com `--sfx` e rode `sfx-check.py`, (6) me diga honestamente o que você mediu e o que só eu consigo avaliar ouvindo. Siga as regras da seção 4 do LEIA-ME-AGENTE.md e nunca copie material das referências.


==============================================================================
# ARQUIVO: DOSSIE.md
==============================================================================

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
  LEIA-ME-AGENTE.md  CONHECIMENTO-COMPLETO.md (gerado)  scripts/make-kit.py
  scripts/
    sfx.py                 SFX sintetizados + cues automáticos + mixagem (Parte I)
    audio/                 visual-events.py  audio-vs-visual.py  sfx-check.py  (análise e validação de áudio)
    render.mjs             junta palavras + cenas e renderiza (escolhe a composição sozinho; --sfx liga o som)
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

1. **Áudio: analisado na Parte H** (as referências não têm SFX detectável) e **camada de SFX própria criada na Parte I** (sintetizada, calibrada por medição, nunca ouvida por mim).
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


---

## Parte H — Análise de áudio e efeitos sonoros (SFX)

**Método.** Áudio extraído em 44,1 kHz estéreo (estilo 1: 42,8 s inteiros; estilo 2: primeiros 120 s). Medi (a) loudness, (b) ataques por faixa de frequência (graves 30–120 Hz, graves-médios, médios, agudos 2–6 kHz, "ar" 6–16 kHz), (c) cruzamento desses ataques com **os instantes em que algo muda na tela** (23 eventos visuais no estilo 1, 73 no estilo 2, detectados por diferença de quadros), (d) espectrogramas, (e) o espectro e a periodicidade dos trechos mais quietos, para achar trilha por baixo da voz. Scripts em `scripts/audio/`.

### H.1 Resultado principal: SFX sincronizado não foi detectado
| Teste | Estilo 1 | Estilo 2 |
|---|---|---|
| Ataque sonoro nos instantes de eventos visuais vs. instantes aleatórios (razão mediana, 5 faixas) | 0,83 a 1,22 | 0,83 a 1,00 |
| Distribuição do atraso entre evento visual e pico de ataque | plana (sem agrupamento) | plana |
| Quedas secas de nível (cortes de áudio) | 0 | 0 |
| Espectrograma | só voz (consoantes como linhas verticais largas) | só voz |

**Leitura:** razão próxima de 1,0 e atraso uniforme significam que, estatisticamente, **o som não acompanha a animação**. Se existem whooshes, pops ou cliques, eles estão mais baixos que o piso de ruído da sala ou escondidos atrás da voz. **Não dá para provar que não existem**, mas não há evidência de que o efeito dessas edições dependa de SFX audíveis.

### H.2 Níveis de mixagem
| | Estilo 1 | Estilo 2 |
|---|---|---|
| Loudness integrado | −14,2 LUFS | −13,4 LUFS |
| Pico | −0,6 dBFS | −1,4 dBFS |
| Faixa de loudness (LRA) | 3,0 LU | 3,2 LU |
| Picos de fala (percentil 95) | −11 a −13 dBFS | ≈ −10 dBFS |
| Piso entre palavras (percentil 10) | −27 a −31 dBFS | 0–40 s: −28 a −33 dBFS; depois de 50 s: −36 a −45 dBFS |

Leitura: áudio **muito comprimido e limitado** (LRA de 3 LU, pico perto de 0 dBFS), no padrão de redes sociais, que costuma ficar entre −14 e −13 LUFS.

### H.3 Trilha por baixo da voz (indício, confiança moderada)
- **Estilo 2, 0 a ~36 s:** picos tonais estreitos e estáveis em torno de **880, 1110, 1480 e 1660 Hz** nos momentos mais quietos (+4 a +16 dB acima da vizinhança, mais forte entre 20 e 32 s). Essas frequências formam um acorde sustentado, o que é compatível com uma **ambiência/pad musical sem batida** (a periodicidade de batida é desprezível, força 0,06). Depois de ~36–40 s a energia tonal cai a nível de ruído.
- **Estilo 2, 41,8 s:** **1,25 s de silêncio digital** exatamente na **vinheta da marca** (logo em tela preta). Depois dela o piso de ruído cai 10 a 15 dB e fica assim pelo resto dos 2 minutos: **só voz limpa**, sem trilha detectada.
  - Interpretação: o **gancho tem ambiência por baixo; a vinheta é um respiro silencioso**; a apresentação e o conteúdo seguem sem trilha.
- **Estilo 1:** pulso estável de **~83 BPM (0,72 s)** na faixa de 40–200 Hz, o mesmo atraso nas 5 janelas de 8 s (força 0,23 a 0,40). Compatível com **uma trilha rítmica muito baixa** (sem notas sustentadas detectáveis). Confiança moderada: um pulso tão estável não parece ritmo de fala, mas só ouvindo o arquivo para confirmar.

### H.4 O que isso significa para a Vértice
1. **O efeito dessas referências vem do visual.** Não há evidência de SFX que sustentem o estilo.
2. Se a sensação de "polimento" que você percebe nessas edições vem do som, o candidato mais provável é a **cama sonora baixa** (pad no estilo 2, pulso no estilo 1) e a **mixagem alta e comprimida**, não os efeitos pontuais.
3. O motor **ainda não gera áudio**. Se você quiser SFX, é decisão de design nossa, sem referência para copiar. A convenção do mercado (a ser validada por você) é: *whoosh* curto na troca de layout/capítulo, *pop* baixo na entrada de elementos, *tick* na digitação, *click* no clique do cursor, *ding* no check. Tudo gerável sintetizado, sem sample de terceiros, e disparado automaticamente pelos tempos do `scenes.json`.

### H.5 Limites desta análise
- Detecção por estatística de sinal, **sem ouvir** os arquivos. Cruzamento visual–sonoro usa 30 quadros/s (resolução de ±33 ms).
- A voz mascara SFX baixos. Um SFX 20 dB abaixo da fala não seria detectado.
- O arquivo do estilo 1 é um download de rede social; se a música original foi mixada pela plataforma, pode não estar no arquivo.
- Estilo 2: só os primeiros 120 s dos 591 s.


---

## Parte I — Camada de SFX do motor (`scripts/sfx.py`)

**Decisão de design.** As referências não têm SFX detectável (Parte H), então esta camada **não copia nada**: segue a convenção de mercado e foi calibrada por medição. Todos os sons são **sintetizados do zero** (senoides, ruído filtrado, envelopes), sem amostra de terceiros, e disparados **automaticamente** pelos tempos do `scenes.json`.

### I.1 Uso
```bash
node scripts/render.mjs <projeto> --sfx            # perfil "discreto" (padrão)
node scripts/render.mjs <projeto> --sfx=marcado    # perfil mais presente
python3 scripts/sfx.py <projeto> --profile discreto --video out/<projeto>.mp4   # só a etapa de som
python3 scripts/sfx.py <projeto> --cues-only       # só lista os cues (out/<projeto>.cues.json)
python3 -I scripts/audio/sfx-check.py <projeto>    # valida níveis e loudness
```
Saídas: `out/<projeto>-sfx.wav` (trilha de SFX isolada, estéreo 44,1 kHz), `out/<projeto>.cues.json` (lista `[tempo, som, ganho_dB]`), `out/<projeto>-sfx.mp4` (vídeo final com voz + SFX). Requer `numpy` e `ffmpeg`.

### I.2 Os 7 sons (receitas exatas)
| Som | Receita | Duração | Para quê |
|---|---|---|---|
| `pop` | Seno que cai de ~620 Hz (`f·e^(−18t)+0,35f`) com decaimento `e^(−34t)` + 2 ms de estalo de ruído | 140 ms | Entrada de elemento (cartão, chip, tag, palavra) |
| `tick` | Seno de 2,6 kHz com janela de Hann² e decaimento `e^(−90t)` | 30 ms | Digitação, cascatas, contadores, tiles |
| `click` | Dois ticks (1,9 kHz e 2,5 kHz, o segundo 55 ms depois a 70%) + corpo de 170 Hz | 90 ms | Clique do cursor |
| `ding` | Seno em f + quinta (1,5f) + parcial (2,01f), decaimento `e^(−7t)`, ataque 3 ms; f padrão 1320 Hz | 500 ms | Check, sucesso, "inscrito", fim de digitação |
| `thud` | Seno que cai de ~133 para 38 Hz (`95·e^(−7t)+38`), decaimento `e^(−11t)` + ruído curto | 350 ms | Selo estampado, explosão de letras |
| `whoosh` | Ruído branco no filtro ressonante (variável de estado, q = 0,22) varrendo **350 → 5200 Hz** em escala geométrica; envelope sobe até 70% e cai suave | 300–1200 ms | Troca de cena/layout, movimento, linha tracejada |
| `fall` | Mesmo filtro, varredura **4200 → 260 Hz**, pico aos 15% | 700 ms | "Queda" das letras que desmontam |

Cada disparo recebe **variação aleatória de ±1 dB** (semente fixa, reprodutível). Alturas de `tick`/`pop` sobem em escada nas cascatas (ex.: tiles a 1800 + 140·i Hz) para dar sensação de preenchimento.

### I.3 Mapa de cues — estilo 1 (`chapters`)
| Gatilho | Som (ganho relativo) |
|---|---|
| Início de cada capítulo (menos o 1º), 60 ms antes | `whoosh` 450 ms (−2 dB) |
| Cada palavra do título do capítulo (`titleAt` + i·0,09 s) | `tick` (−12) |
| `moveTo` de qualquer elemento | `whoosh` 300 ms (−9) |
| `kinetic` | `tick` por letra (−13); com `explodeAt`: `thud` (−1) + `fall` 700 ms a +50 ms (−6) |
| `phone` | `pop` (−2); `tick` em escada por tile em `tilesAt` + i·0,06 (−11); `click` em `highlightAt` (−3); `swap`: `whoosh` 350 ms (−8) + 9 `tick` a cada 50 ms (−12) |
| `card` | `pop` a 520 Hz (−3) |
| `badge` | `thud` 250 ms (−6) + `ding` a 1568 Hz 40 ms depois (−4) |
| `counter` | `tick` (−14), no máximo um a cada ~60 ms, desacelerando |
| `robot` / `robots` | `pop` (−4 / −7), uma por robô a cada `stagger`; `tick` por rótulo (−15) |
| `terminal` | `tick` por caractere (no máx. 1 a cada 35 ms, −13) + `ding` a 1760 Hz no fim (−9) |
| `checklist` | `pop` (−8) + `ding` 150 ms depois, subindo 110 Hz por item (−5) |
| `chip`, `iconTile`, `panel`, `text` | `pop` (−5) |
| `cursor` com `click: true` | `click` (−3) |

### I.4 Mapa de cues — estilo 2 (`scenes`)
| Gatilho | Som |
|---|---|
| Início de cada cena (menos a 1ª) | `whoosh` 400 ms (−2) — é a troca de layout |
| Palavras do `head` | `tick` (−12) |
| `tag`, `eyebrow` | `pop` (−6); `big` → `pop` (−4) |
| `panel` | `whoosh` 300 ms (−8) + `pop` (−6) |
| `wave` | `whoosh` com a duração da linha (−3) |
| `odometer` | `pop` (−6) + `tick` rápido (−14) |
| `appwindow` | `tick` em escada (−11) + `click` no destaque (−3) |
| `blocks` | `tick` em escada, 1 a cada 100 ms (−12) |
| `btn` | `pop` (−7) + `click` em `clickAt` (−2) + `ding` 60 ms depois (−5) |
| `moveTo` | `whoosh` 300 ms (−9) |

### I.5 Perfis de nível e mixagem
- **Nível-base do cue 0 dB:** `discreto` = **−10 dBFS**, `marcado` = **−3 dBFS** (pico, antes da mixagem). O ganho individual da tabela soma a esse valor.
- **Cadeia:** `amix` (voz + SFX, `normalize=0`) → `loudnorm` **I = −14 LUFS, TP = −1,5 dBTP, LRA = 7** (o padrão que medi nas referências, Parte H.2) → AAC 192 kbps. O vídeo é copiado sem recodificar.
- **Calibração por medição no demo de 13 s** (nível do SFX contra a voz na janela de 150 ms de cada cue):
  | Perfil | Mediana | Cues a menos de 12 dB da voz | Cues que passam da voz (mascaram) | Loudness final |
  |---|---|---|---|---|
  | −28 dBFS (1ª tentativa) | −35 dB (RMS global) | 0% | 0% | inaudível, descartado |
  | **discreto (−10)** | **−14 a −15 dB** | 31–35% | 0–6% | −14,7 LUFS |
  | **marcado (−3)** | **−8 dB** | 72% | 8% | −14,7 LUFS |
- **Lição de calibração:** a 1ª tentativa ficou inaudível (35 dB abaixo da voz). Tempos de cue e níveis precisam ser **medidos**, não adivinhados. O teste de "sincronia por correlação" que usei nas referências **não serve** para trilhas densas, porque os instantes aleatórios também caem em SFX. Para validar a mixagem própria use `sfx-check.py` (nível relativo à voz).

### I.6 Como personalizar
- **Trocar o caráter de um som:** edite a função em `sfx.py` (`pop`, `tick`…). Cada uma é curta e comentada.
- **Mudar quais elementos fazem som:** edite `_el_split` (estilo 1) ou `cues_talk` (estilo 2). Cada linha é `(tempo, nome_do_som, ganho_dB, parâmetros)`.
- **Novo elemento visual:** adicione o `type` no mapa de cues na mesma mudança em que o criar em `Library.tsx` / `TalkReel.tsx`.
- **Mais ou menos densidade:** a maior parte do "barulho" vem dos `tick` em cascata. Reduza-os (ou o ganho) para um som mais limpo.

### I.7 Limites honestos
- **Eu não ouvi o resultado.** Só medi (níveis, loudness, espectro). Antes de publicar, **escute com fone**. Se algo irritar, reduza o ganho do som correspondente.
- A calibração de níveis foi feita em **um vídeo de 13 s** com voz contínua. Em vídeos com pausas, o mesmo ganho soará mais alto.
- Sem **trilha/ambiência musical**: as referências sugerem uma cama baixa (Parte H.3), mas não a geramos.
- Sem **ducking** (abaixar o SFX quando a voz é forte). O `loudnorm` único também é de uma passada, então o loudness final pode variar ±0,7 LU.
- Os sons são sintéticos e podem soar "digitais" comparados a samples gravados. Se quiser samples próprios, basta trocar a saída de `synth()` por arquivos `.wav` licenciados.


==============================================================================
# ARQUIVO: ESTILO.md
==============================================================================

# Estilo "Tela Dividida + Motion" — decupagem do reel de referência

Reel analisado: 42,9 s, 720x1280, 30 fps. Gravação de rosto em selfie (fundo neutro) e, em cima, uma animação explicativa sincronizada com a fala.

## 1. Estrutura do quadro

| Zona | Posição (em 1080x1920) | O que vai |
|---|---|---|
| Metade de cima | y 0–960 | Motion graphics sobre fundo preto |
| Linha divisória | y = 960, ~4px | Linha rosa neon com brilho |
| Legenda | centrada **em cima da linha** (y ≈ 918–1000) | Pílula escura com sombra rosa deslocada |
| Metade de baixo | y 960–1920 | Vídeo cru, sem corte de zoom, sem efeito |

A divisão é **exatamente 50/50** (medido no pixel: a linha rosa está na linha 640 de 1280).

## 2. Identidade visual

- **Fundo:** preto quase puro (#050306), com um brilho magenta radial no topo central que "respira" de leve, grade de pontos bem sutil e vinheta escura nas bordas.
- **Cores:** rosa neon (#FF2D7A) → magenta → roxo (#8A3FFC). Os tiles do grid seguem um degradê: rosa na linha de cima, roxo na de baixo.
- **Brilho:** todo elemento importante tem uma borda rosa de 2–3px e glow (`box-shadow` duplo).
- **Tipografia (3 famílias, cada uma com um papel):**
  - **Sans pesada** (Inter 800/900): títulos em CAIXA-ALTA e legendas.
  - **Mono espaçada** (JetBrains Mono, letter-spacing alto): rótulos técnicos como "• OS AGENTES", "03 / 08", "SKILL PACK" e "CÓDIGO ABERTO · LICENÇA MIT".
  - **Serifada itálica** (Instrument Serif): só **uma palavra de destaque** por título, com degradê ("CADA UM NA *sua* ÁREA", "O QUE TÁ *bombando*", "BAIXA EM *uma* LINHA").
- **Etiqueta laranja** no cursor ("Claude"): o "personagem" que opera a interface. No seu perfil, troque pelo nome da sua marca ou ferramenta.

## 3. Cabeçalho de capítulos (o "esqueleto" do vídeo)

Sempre visível no topo: `• NOME DO CAPÍTULO` à esquerda e `03 / 08` à direita, com uma barra segmentada embaixo. Há um segmento por capítulo: os anteriores ficam cheios e o atual enche conforme o tempo passa.

Capítulos do reel: O GANCHO → A SKILL → OS AGENTES → A EQUIPE → TENDÊNCIAS → ESTRATÉGIA → INSTALAR → PASSO A PASSO. Ou seja, **um capítulo a cada 4–6 s**, e cada um vira uma "cena" nova.

## 4. Legenda (karaokê em 3 estados)

- Blocos curtos de **2 a 4 palavras** (até ~26 caracteres), que quebram em pontuação e em pausas.
- Palavra **ainda não falada = cinza**, **falando agora = rosa**, **já falada = branca**.
- O bloco entra com um "pop" (escala 0,85 → 1).
- Pílula #1D1B21, cantos de 6px e sombra **sólida rosa deslocada 6px** para baixo e para a direita (efeito "sticker").

## 5. Gramática do motion (como ele "adiciona elementos")

1. **A animação ilustra literalmente a frase falada.** "Matar o Instagram" faz a palavra *Instagram* ser digitada e depois desmontar e cair. "Colocar ele pra tocar o seu perfil" mostra o cursor clicando no celular e aparece o chip "TOCANDO O SEU PERFIL". "9 agentes" faz um contador correr de 02 a 09.
2. **Elementos-âncora persistem.** O mockup de celular entra cedo e fica vários capítulos na tela, só se movendo (centro → esquerda) e trocando o conteúdo dos tiles (letras viram ícones com "flip"). Isso dá continuidade.
3. **Tudo entra com mola** (spring, ~0,3 s), em cascata (*stagger* de 50–90 ms por item). Nada aparece "seco".
4. **O cursor com etiqueta** guia o olho: ele se move até o próximo ponto de interesse **antes** da fala chegar lá e clica (com onda) no momento da palavra-chave.
5. **Selos e números dão ênfase:** selo estrelado "100% GRÁTIS" que gira ao entrar com raios, e contadores grandes com degradê.
6. **Cenários com mascote:** na parte "A EQUIPE", cada agente é um robozinho rosa num painel ("PLANO", "CARROSSEL", "HASHTAGS"…) ao lado de um post de exemplo que vai sendo montado. Mostra o resultado, em vez de explicar.
7. **CTA final em UI real:** perfil → botão Seguir → caixa de comentário digitando a palavra-chave → DM chegando com o link. A animação ensina a ação que você quer do público.
8. **Títulos de capítulo** aparecem palavra por palavra a partir do 4º capítulo, quando o conteúdo fica mais "explicativo".

## 6. Ritmo

- Gancho em **menos de 1,5 s** ("O Claude acabou de matar o Instagram"), com o elemento mais chamativo do vídeo inteiro (a palavra gigante explodindo).
- Troca visual relevante a cada **~1 s** (algo novo entra, se move ou muda) e troca de capítulo a cada 4–6 s.
- A metade de baixo nunca corta. Quem dá o ritmo é a metade de cima.

## 7. Por que funciona

O rosto embaixo segura a confiança ("tem alguém real falando") e a animação em cima segura a retenção, com estímulo novo o tempo todo. Quem assiste sem som entende pelo motion e pela legenda. O cabeçalho "03 / 08" cria a vontade de ver até o fim.


==============================================================================
# ARQUIVO: ESTILO-2.md
==============================================================================

# Estilo 2: "Talking head + motion" (16:9, verde neon)

Decupagem dos primeiros 2 min do vídeo de referência (591 s no total, 640x360, 30 fps, horizontal). Cinco layouts alternam a cada 2–4 s, sempre com o mesmo "esqueleto" fixo por cima.

## 1. Esqueleto fixo (aparece em todos os layouts)
- **Marca d'água** no canto superior esquerdo (wordmark em sans pesada, ~34 px em 1080p).
- **Barra de progresso** na base: trilho tracejado + preenchimento verde com uma bolinha na ponta. No fundo claro, o trilho fica escuro.
- **Legenda** em caixa-alta condensada, na parte de baixo, **sem caixa de fundo**. Cada palavra aparece em branco no momento em que é dita (as futuras ficam apagadas). No fundo claro a legenda vira preta.

## 2. Os 5 layouts
| Layout | Quando usa | Composição |
|---|---|---|
| `full` | Rosto em tela cheia, para falar de forma direta | Vídeo cru ocupa tudo; só entram *tags* (pílulas com ícone: "MCP", "Open source", "Claude Code"), palavras gigantes no canto e contadores |
| `stage` | Apresentar o assunto ("A NOVA MODA") | Fundo escuro com brilho verde. O rosto vira um **cartão vertical** central com borda verde neon, e **painéis de screenshot inclinados em perspectiva** flutuam dos dois lados. Título condensado no topo |
| `canvas` | Explicar um conceito ("R.E.A. = Reverse Engineer Anything") | Sem rosto. Silhuetas de prédios, **grade em perspectiva no chão**, cartões que entram em sequência e uma **linha tracejada verde** que se desenha na tela e funciona como transição |
| `light` | Explicação didática (blocos "Um app que chama atenção", "90%") | Fundo **off-white** (#FAFAF7) com pontilhado e cruzes "+" nos cantos. Rosto num cartão arredondado com **borda preta e sombra sólida deslocada**. Explicação à esquerda em preto com uma palavra em verde |
| `screen` | Mostrar demo ao vivo | Gravação de tela grande à esquerda; rosto num retângulo à direita com o @ embaixo |

## 3. Identidade visual
- **Cores:** verde-limão neon `#7CFF1E` (destaque), quase-preto `#030403` (fundo escuro), off-white `#FAFAF7` (fundo claro), preto `#0D0D0D` (texto no claro).
- **Tipografia:** condensada pesada em caixa-alta (Anton) para títulos e palavras gigantes; sans pesada para botões e rótulos; mono espaçada para eyebrows ("• ABREVIAÇÃO EM INGLÊS", "• NESTE VÍDEO").
- **Destaque:** em todo título, **uma palavra** fica em verde (com brilho no escuro).
- **Brilho:** bordas verdes de 3 px com glow nos cartões do fundo escuro; no fundo claro não há glow, só contorno preto.

## 4. Gramática do motion
1. **Troca de layout a cada 2–4 s.** É o principal motor de retenção: o olho nunca fica no mesmo enquadramento.
2. **A palavra-chave vira elemento.** "Qualquer" aparece gigante, e "Clone" fica fantasma atrás dele; "1 → 99" vira um odômetro de clones.
3. **Elementos entram com mola e em cascata** (como no estilo 1), e saem com fade + zoom leve.
4. **Eyebrow mono + título condensado** anunciam cada bloco novo.
5. **Linha tracejada verde desenhada** liga cenas (início do canvas, "seu Claude" → comando).
6. **Digitação em UI:** cartões estilo terminal com comando digitado ("copie este aplicativo") aparecem no canvas.
7. **Blocos que acendem** (10 quadrados, 9 acesos = "90% dos serviços"): estatística vista em vez de dita.
8. **Cursor clicando** em botões de verdade: "Gostei" e "Inscrever-se" viram verde ("Inscrito"). É o CTA de engajamento.
9. **Tag de contexto lateral** ("• TREINANDO EMPRESAS" + logos de clientes) como prova social enquanto o apresentador fala.
10. **Abertura em 3 beats:** gancho com palavra gigante → mini-vinheta da marca em tela preta → apresentação ("Meu nome é…", pílula "Especialista em IA").

## 5. Diferenças para o estilo 1 (tela dividida)
| | Estilo 1 | Estilo 2 |
|---|---|---|
| Formato | 9:16, 50/50 fixo | 16:9, layout muda por cena |
| Rosto | Sempre embaixo, intacto | Pode ocupar tudo, virar cartão ou sair de cena |
| Paleta | Rosa/roxo | Verde-limão + versão clara |
| Legenda | Pílula com sombra rosa | Condensada, sem caixa |
| Progresso | Capítulos "03 / 08" | Barra contínua |


==============================================================================
# ARQUIVO: SKILL.md (skill reel-tela-dividida)
==============================================================================

---
name: reel-tela-dividida
description: Edita um vídeo cru de rosto em dois estilos com motion graphics sincronizados à fala. Estilo 1 (9:16), tela dividida rosa/roxo com a animação em cima e o vídeo cru embaixo. Estilo 2 (16:9), talking head verde-limão que alterna 5 layouts (tela cheia, palco, canvas, claro, gravação de tela). Use quando o usuário mandar um vídeo para editar "naquele estilo", "tela dividida", "split screen", "com motion" ou para YouTube horizontal.
---

# Reels com motion (estilo Vértice)

**Escolha o estilo antes de começar:**
- 9:16 (Reels/TikTok/Shorts): **estilo 1**, `ESTILO.md`, composição `SplitReel`, `scenes.json` com `chapters`.
- 16:9 (YouTube): **estilo 2**, `ESTILO-2.md`, composição `TalkReel`, `scenes.json` com `scenes` (veja a seção "Estilo 2" no fim). O `render.mjs` escolhe a composição sozinho.


Projeto: `split-reel/` (Remotion). Antes de criar cenas, leia `split-reel/ESTILO.md`, que é a decupagem do reel de referência e as regras do estilo.

## Fluxo

1. **Projeto novo:** crie `split-reel/public/projects/<nome>/` e coloque o vídeo cru como `raw.mp4`.
   Se o vídeo não for 9:16, ajuste `objectPosition` para manter o rosto centralizado na metade de baixo.
2. **Transcrição com tempo por palavra** (escolha uma opção):
   - `python split-reel/scripts/transcribe.py raw.mp4 words.json` (faster-whisper, na máquina do usuário; nesta nuvem o download do modelo é bloqueado);
   - `.srt` do CapCut: `node scripts/srt-to-captions.mjs x.srt > captions.json`;
   - em último caso, escreva `captions.json` à mão, em blocos `{t,s,e}`.
3. **Roteiro visual.** Leia a transcrição e divida em capítulos de 4–6 s, cada um com um rótulo curto em caixa-alta. Para cada frase, decida **que imagem ilustra literalmente o que está sendo dito** (ver ESTILO.md §5). Mostre esse roteiro ao usuário numa tabela (tempo | fala | visual) **antes** de escrever o JSON.
4. **Escreva `scenes.json`** (formato abaixo). Tempos são absolutos, em segundos, e alinhados ao início da palavra-chave em `words.json`.
5. **Confira em quadros parados:** `cd split-reel && node scripts/render.mjs <nome> --still=SEG` em 3–5 momentos-chave. Olhe os PNGs e procure sobreposição, texto cortado ou elemento cobrindo a legenda.
6. **Render final:** `node scripts/render.mjs <nome>` gera `out/<nome>.mp4` (1080x1920, H.264, áudio do vídeo cru).
7. **SFX (opcional, recomendado):** `node scripts/render.mjs <nome> --sfx` (ou `--sfx=marcado`) gera sons sintetizados pelos tempos das cenas e mixa em `out/<nome>-sfx.mp4`. Valide com `python3 -I scripts/audio/sfx-check.py <nome>` e **peça ao usuário para ouvir com fone** (você só mede, não ouve). Receitas e mapa de cues: `DOSSIE.md`, Parte I.

## Regras do estilo (não negociáveis)

- O gancho (primeiros 1,5 s) usa o elemento mais forte, normalmente `kinetic` com `explodeAt`.
- Algo novo entra, se move ou muda a cada ~1 s.
- Um **elemento-âncora** (em geral `phone`) atravessa vários capítulos com `out` > fim do capítulo, usando `moveTo` e `swap` em vez de sumir e reaparecer.
- O `cursor` chega ao alvo ~0,3 s **antes** da palavra e clica (`click: true`) no início dela.
- Título de capítulo: no máximo 5 palavras, com 1 palavra em `accent`.
- Área útil da metade de cima: y de 260 a 900. O cabeçalho ocupa até y≈210 e o título fica em y≈250–340 quando existe. Nada passa de y=900, porque ali começa a legenda.
- O último capítulo é um CTA visual (seguir, comentar palavra-chave, DM).

## Formato `scenes.json`

```json
{
  "video": "projects/<nome>/raw.mp4",
  "objectPosition": "50% 35%",
  "brandTag": "Vértice",
  "chapters": [
    {"label": "O gancho", "start": 0, "end": 4.9,
     "title": {"text": "Cada um na sua área", "accent": "sua"}, "titleAt": 0.2,
     "elements": [ {"type": "kinetic", "at": 0.05, "text": "Instagram", "explodeAt": 1.35, "out": 2.1, "x": 540, "y": 520} ]}
  ]
}
```

Campos comuns a todo elemento: `type`, `at` (entra), `out` (sai; padrão = fim do capítulo, e pode ser maior), `x`, `y` (centro, na área 1080x960), `scale`, `moveTo` (`{at,x?,y?,scale?,dur?}` ou uma lista deles).

| type | Props principais | Uso típico |
|---|---|---|
| `kinetic` | `text`, `size`, `stagger`, `explodeAt` | palavra gigante digitada que pode desmontar |
| `phone` | `handle`, `name`, `button`, `tiles[{label\|icon}]`, `tilesAt`, `highlight`, `highlightAt`, `swap{at,tiles}` | mockup do perfil (âncora) |
| `card` | `eyebrow`, `title`, `accent`, `sub`, `barcode`, `footnote`, `width` | "etiqueta de produto" |
| `badge` | `text`, `sub` | selo "100% GRÁTIS" |
| `counter` | `from`, `to`, `duration`, `label`, `size`, `pad` | número subindo |
| `robot` / `robots` | `size`, `color` / `count`, `cols`, `labels[]`, `labelsAt`, `stagger` | mascote / time de agentes |
| `terminal` | `command`, `prompt`, `typeDur`, `note`, `width` | comando digitado |
| `checklist` | `title`, `items[]`, `stagger`, `width` | passos marcando ✓ |
| `chip` | `text`, `icon` | pílula de status |
| `iconTile` | `icon`, `size` | ícone grande |
| `text` | `text`, `size`, `mono`, `gradient`, `color` | texto livre |
| `panel` | `w`, `h`, `label`, `icon` | moldura de cenário (declare antes do que vai por cima) |
| `cursor` | `path[{at,x,y,click?}]`, `tag` | cursor com etiqueta da marca |

Ícones: `menu carousel calendar flame smile hash users recycle user play check star heart chat send bolt chart camera search home plus grid money rocket lock terminal`.

Exemplo completo: `split-reel/public/projects/demo/scenes.json`.

Para criar um elemento novo, adicione o componente em `remotion/elements/Library.tsx`, registre-o em `REGISTRY` e documente-o nesta tabela. Cores e fontes ficam em `remotion/theme.ts`: troque lá para mudar a identidade inteira.


## Estilo 2 (16:9, `TalkReel`)

Leia `split-reel/ESTILO-2.md`. Exemplo: `public/projects/talk-demo/scenes.json`. Coordenadas em 1920x1080; `x,y` é o centro do item (use `"center": false` para ancorar pelo canto superior esquerdo).

Cada cena: `{start, end, layout, head?: {text, accent, at}, items[]}`. Layouts: `full`, `stage` (rosto vira cartão com painéis inclinados), `canvas` (sem rosto, grade no chão), `light` (off-white, rosto em cartão), `screen` (precisa de `screen` e `handle` no topo do JSON).

Itens: `tag{icon,text,solid}`, `eyebrow{text}`, `big{text,size,green,ghost}`, `odometer{from,to,label,sub}`, `panel{w,h,tilt,title,lines}`, `wave{y,amp,duration}`, `appwindow{title,apps[{icon,label}],highlight,highlightAt}`, `blocks{total,on}`, `btn{text,doneText,icon,clickAt}`, `head{text,accent}`. Todos aceitam `at`, `out`, `x`, `y`, `scale`, `moveTo`.

Regras: troque de layout a cada 2–4 s; abra com `full` + uma palavra gigante; use `stage` para anunciar tema, `canvas` para definir conceitos, `light` para explicações com números e feche com `btn` de Gostei/Inscrever-se. Sempre confira 4–5 quadros parados antes do render final.


## SFX (os dois estilos)

`scripts/sfx.py` lê `props.json` e dispara 7 sons sintetizados (`pop`, `tick`, `click`, `ding`, `thud`, `whoosh`, `fall`) a partir dos tempos de capítulos/cenas e elementos. Regras:
- Troca de capítulo/layout = `whoosh`; entrada de elemento = `pop`; digitação/cascata = `tick` em escada; clique do cursor = `click`; check/sucesso = `ding`; selo/explosão = `thud`.
- Perfis: `discreto` (padrão, SFX ~15 dB abaixo da voz) e `marcado` (~8 dB abaixo). Final em −14 LUFS / −1,5 dBTP.
- Novo elemento visual ⇒ adicionar também o cue em `sfx.py` (`_el_split` ou `cues_talk`).
- As referências estudadas **não têm SFX detectável** (só ambiência baixa); esta camada é decisão de design da Vértice, não cópia. Nunca use samples de terceiros.


==============================================================================
# CÓDIGO-CHAVE (referência rápida; o kit .zip tem tudo)
==============================================================================

## scripts/sfx.py
```python
#!/usr/bin/env python3
"""SFX sintetizados + mixagem automática pelos tempos do projeto.

Todos os sons são gerados aqui (ruído filtrado, senoides, envelopes). Não usa nenhuma amostra de terceiros.

  python3 scripts/sfx.py <projeto> [--profile discreto|marcado] [--video out/<projeto>.mp4] [--cues-only]

Lê   public/projects/<projeto>/props.json   (gerado por render.mjs)
Gera out/<projeto>-sfx.wav  e  out/<projeto>.cues.json
Com --video, mixa o SFX no áudio do vídeo e grava out/<projeto>-sfx.mp4 (-14 LUFS, pico -1,5 dBTP, como nas referências).

Requer: numpy, ffmpeg.   (pip install numpy)
"""
import argparse
import json
import math
import subprocess
import wave
from pathlib import Path

import numpy as np

SR = 44100

# Nível do pico de um cue "0 dB" antes da mixagem final, por perfil (dBFS).
# Voz nas referências: picos em ~ -10 dBFS. "discreto" fica ~18 dB abaixo, "marcado" ~8 dB.
PROFILES = {'discreto': -10.0, 'marcado': -3.0}


# ───────────────────────── síntese ─────────────────────────
def _norm(x):
    p = float(np.max(np.abs(x))) or 1.0
    return (x / p).astype(np.float32)


def _t(n):
    return np.arange(n) / SR


def pop(f=620.0, dur=0.14):
    """Bolha curta: seno que cai de pitch + estalo mínimo. Entrada de elemento."""
    n = int(dur * SR); t = _t(n)
    freq = f * np.exp(-t * 18) + f * 0.35
    ph = 2 * np.pi * np.cumsum(freq) / SR
    x = np.sin(ph) * np.exp(-t * 34)
    x[: int(0.002 * SR)] += np.random.default_rng(1).standard_normal(int(0.002 * SR)) * 0.4
    return _norm(x)


def tick(f=2600.0, dur=0.03):
    """Estalo seco e agudo: digitação, cascatas, contadores."""
    n = int(dur * SR); t = _t(n)
    x = np.sin(2 * np.pi * f * t) * np.hanning(n) ** 2 * np.exp(-t * 90)
    return _norm(x)


def click(dur=0.09):
    """Clique de mouse: dois estalos (descida + subida) com um corpo grave curtinho."""
    n = int(dur * SR); x = np.zeros(n)
    a = tick(1900, 0.02); b = tick(2500, 0.018)
    x[: len(a)] += a
    ofs = int(0.055 * SR); x[ofs: ofs + len(b)] += b * 0.7
    t = _t(int(0.025 * SR)); x[: len(t)] += np.sin(2 * np.pi * 170 * t) * np.exp(-t * 120) * 0.6
    return _norm(x)


def ding(f=1320.0, dur=0.5):
    """Sino curto e limpo: check, sucesso, 'inscrito'."""
    n = int(dur * SR); t = _t(n)
    x = (np.sin(2 * np.pi * f * t) + 0.45 * np.sin(2 * np.pi * f * 1.5 * t) + 0.2 * np.sin(2 * np.pi * f * 2.01 * t)) * np.exp(-t * 7)
    x *= np.minimum(1, t / 0.003)
    return _norm(x)


def thud(dur=0.35):
    """Impacto grave: selo, explosão de letras."""
    n = int(dur * SR); t = _t(n)
    freq = 95 * np.exp(-t * 7) + 38
    x = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 11)
    noise = np.random.default_rng(3).standard_normal(n) * np.exp(-t * 60) * 0.25
    return _norm(x + noise)


def sweep(dur=0.45, f0=350.0, f1=5200.0, q=0.22, peak=0.7, seed=0):
    """Whoosh: ruído passado por um filtro ressonante cujo centro varre f0→f1 (use f1<f0 para 'queda').
    Envelope assimétrico: sobe até `peak` da duração e desce suave."""
    n = int(dur * SR); noise = np.random.default_rng(seed).standard_normal(n)
    f = np.geomspace(f0, f1, n)
    g = 2 * np.sin(np.pi * np.minimum(f, SR / 6) / SR)
    lp = bp = 0.0; out = np.empty(n)
    for i in range(n):  # filtro de variável de estado (Chamberlin)
        lp += g[i] * bp
        hp = noise[i] - lp - q * bp
        bp += g[i] * hp
        out[i] = bp
    u = np.linspace(0, 1, n)
    env = np.where(u < peak, (u / peak) ** 2, np.cos((u - peak) / (1 - peak) * np.pi / 2) ** 2)
    return _norm(out * env)


def whoosh(dur=0.45):
    return sweep(dur, 350, 5200)


def fall(dur=0.7):
    return sweep(dur, 4200, 260, peak=0.15)


_CACHE = {}


def synth(name, **kw):
    key = (name, tuple(sorted(kw.items())))
    if key not in _CACHE:
        _CACHE[key] = {'pop': pop, 'tick': tick, 'click': click, 'ding': ding, 'thud': thud, 'whoosh': whoosh, 'fall': fall}[name](**kw)
    return _CACHE[key]


# ───────────────────────── cues a partir do props.json ─────────────────────────
# Cada cue: (tempo_s, som, ganho_dB, kwargs). Ganho é relativo ao nível do perfil.
def cues_split(p):
    """Estilo 1 (9:16, tela dividida): capítulos + elementos."""
    c = []
    for ci, ch in enumerate(p['chapters']):
        if ci > 0:
            c.append((ch['start'] - 0.06, 'whoosh', -2, {'dur': 0.45}))
        if ch.get('title'):
            at = ch.get('titleAt', ch['start'])
            for i, _ in enumerate(ch['title']['text'].split()):
                c.append((at + i * 0.09, 'tick', -12, {'f': 2300 + 150 * i}))
        for el in ch['elements']:
            c += _el_split(el)
    return c


def _el_split(el):
    t, at = el['type'], el['at']
    c = []
    for m in (el['moveTo'] if isinstance(el.get('moveTo'), list) else [el['moveTo']] if el.get('moveTo') else []):
        c.append((m['at'], 'whoosh', -9, {'dur': 0.3}))
    if t == 'kinetic':
        st = el.get('stagger', 0.045)
        for i, ch in enumerate(el.get('text', '')):
            if ch != ' ':
                c.append((at + i * st, 'tick', -13, {'f': 2000 + 90 * i}))
        if el.get('explodeAt') is not None:
            e = el['explodeAt']
            c += [(e, 'thud', -1, {}), (e + 0.05, 'fall', -6, {'dur': 0.7})]
    elif t == 'phone':
        c.append((at, 'pop', -2, {}))
        ta = el.get('tilesAt', at + 0.3)
        for i in range(len(el.get('tiles', [None] * 9))):
            c.append((ta + i * 0.06, 'tick', -11, {'f': 1800 + 140 * i}))
        if el.get('highlight') is not None:
            c.append((el.get('highlightAt', 0), 'click', -3, {}))
        if el.get('swap'):
            s = el['swap']['at']
            c.append((s, 'whoosh', -8, {'dur': 0.35}))
            for i in range(9):
                c.append((s + i * 0.05, 'tick', -12, {'f': 2100 + 120 * i}))
    elif t == 'card':
        c.append((at, 'pop', -3, {'f': 520}))
    elif t == 'badge':
        c += [(at, 'thud', -6, {'dur': 0.25}), (at + 0.04, 'ding', -4, {'f': 1568})]
    elif t == 'counter':
        d = el.get('duration', 0.8); n = abs(el.get('to', 10) - el.get('from', 0))
        k = max(1, min(n, int(d / 0.06)))
        for i in range(k):
            c.append((at + d * (i / k) ** 0.7 * 0.95, 'tick', -14, {'f': 2200 + 40 * i}))
    elif t == 'robot':
        c.append((at, 'pop', -4, {'f': 700}))
    elif t == 'robots':
        st = el.get('stagger', 0.07)
        for i in range(el.get('count', 9)):
            c.append((at + i * st, 'pop', -7, {'f': 520 + 55 * (i % 5)}))
        for i, _ in enumerate(el.get('labels', [])):
            c.append((el.get('labelsAt', at + 0.8) + i * 0.08, 'tick', -15, {'f': 2400}))
    elif t == 'terminal':
        d = el.get('typeDur', 1.2); n = len(el.get('command', ''))
        k = max(1, min(n, int(d / 0.035)))
        for i in range(k):
            c.append((at + 0.2 + d * i / k, 'tick', -13, {'f': 2300 + (i * 97) % 500}))
        c.append((at + 0.2 + d + 0.05, 'ding', -9, {'f': 1760}))
    elif t == 'checklist':
        for i, _ in enumerate(el.get('items', [])):
            a = at + 0.25 + i * el.get('stagger', 0.35)
            c += [(a, 'pop', -8, {}), (a + 0.15, 'ding', -5, {'f': 1320 + 110 * i})]
    elif t in ('chip', 'iconTile', 'panel', 'text'):
        c.append((at, 'pop', -5, {'f': 640}))
    elif t == 'cursor':
        for pt in el.get('path', []):
            if pt.get('click'):
                c.append((pt['at'], 'click', -3, {}))
    return c


def cues_talk(p):
    """Estilo 2 (16:9, talking head): cenas/layouts + itens."""
    c = []
    for si, sc in enumerate(p['scenes']):
        if si > 0:
            c.append((sc['start'] - 0.06, 'whoosh', -2, {'dur': 0.4}))
        if sc.get('head'):
            at = sc['head'].get('at', sc['start'])
            for i, _ in enumerate(sc['head']['text'].split()):
                c.append((at + i * 0.1, 'tick', -12, {'f': 2300 + 150 * i}))
        for it in sc['items']:
            t, at = it['type'], it['at']
            for m in (it['moveTo'] if isinstance(it.get('moveTo'), list) else [it['moveTo']] if it.get('moveTo') else []):
                c.append((m['at'], 'whoosh', -9, {'dur': 0.3}))
            if t in ('tag', 'eyebrow', 'big'):
                c.append((at, 'pop', -4 if t == 'big' else -6, {'f': 560 if t == 'big' else 700}))
            elif t == 'panel':
                c += [(at, 'whoosh', -8, {'dur': 0.3}), (at + 0.05, 'pop', -6, {'f': 480})]
            elif t == 'wave':
                c.append((at, 'whoosh', -3, {'dur': it.get('duration', 1.2)}))
            elif t == 'odometer':
                d = it.get('duration', 1.4); n = abs(it.get('to', 99) - it.get('from', 0))
                k = max(1, min(n, int(d / 0.06)))
                c.append((at, 'pop', -6, {}))
                for i in range(k):
                    c.append((at + d * (i / k) ** 0.6 * 0.95, 'tick', -14, {'f': 2200 + 30 * i}))
            elif t == 'appwindow':
                for i, _ in enumerate(it.get('apps', [])):
                    c.append((at + 0.2 + i * 0.08, 'tick', -11, {'f': 1900 + 130 * i}))
                if it.get('highlight') is not None:
                    c.append((it.get('highlightAt', 0), 'click', -3, {}))
            elif t == 'blocks':
                for i in range(it.get('total', 10)):
                    c.append((at + i * 0.1, 'tick', -12, {'f': 1700 + 110 * i}))
            elif t == 'btn':
                c.append((at, 'pop', -7, {}))
                c += [(it['clickAt'], 'click', -2, {}), (it['clickAt'] + 0.06, 'ding', -5, {'f': 1568})]
            elif t == 'head':
                c.append((at, 'pop', -7, {}))
    return c


# ───────────────────────── mixagem ─────────────────────────
def render_track(cues, dur, base_db):
    n = int((dur + 1.0) * SR); y = np.zeros(n, dtype=np.float32)
    rng = np.random.default_rng(11)
    for tt, name, g, kw in sorted(cues, key=lambda x: x[0]):
        if tt < 0:
            continue
        s = synth(name, **kw)
        i = int(tt * SR)
        if i >= n:
            continue
        gain = 10 ** ((base_db + g + rng.uniform(-1.0, 1.0)) / 20)  # ±1 dB de variação humana
        seg = s[: n - i] * gain
        y[i: i + len(seg)] += seg
    return np.clip(y, -1, 1)


def write_wav(path, y):
    st = np.stack([y, y], 1)
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype('<i2').tobytes())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('project'); ap.add_argument('--profile', default='discreto', choices=PROFILES)
    ap.add_argument('--video'); ap.add_argument('--cues-only', action='store_true')
    a = ap.parse_args()
    props = json.loads(Path(f'public/projects/{a.project}/props.json').read_text())
    cues = cues_split(props) if 'chapters' in props else cues_talk(props)
    ends = [w['e'] for w in props.get('words', [])] + [props.get('durationSec', 0)]
    dur = max(ends)
    Path('out').mkdir(exist_ok=True)
    Path(f'out/{a.project}.cues.json').write_text(json.dumps([[round(t, 3), n, g] for t, n, g, _ in sorted(cues, key=lambda x: x[0])]))
    print(f'{len(cues)} cues, perfil {a.profile} ({PROFILES[a.profile]} dBFS no cue 0 dB)')
    if a.cues_only:
        return
    y = render_track(cues, dur, PROFILES[a.profile])
    wav = Path(f'out/{a.project}-sfx.wav'); write_wav(wav, y)
    if a.video:
        out = f'out/{a.project}-sfx.mp4'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a.video, '-i', str(wav), '-filter_complex',
                        '[0:a][1:a]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=7[a]',
                        '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', out], check=True)
        print('vídeo com SFX:', out)


if __name__ == '__main__':
    main()

```

## scripts/render.mjs
```js
// Junta palavras + cenas em props.json e renderiza o reel.
// Uso: node scripts/render.mjs <projeto> [--still=SEG] [--sfx[=discreto|marcado]]
//   public/projects/<projeto>/words.json    (ou captions.json com blocos {t,s,e})
//   public/projects/<projeto>/scenes.json   (capítulos + elementos)
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {toWords} from './chunks-to-words.mjs';

const name = process.argv[2];
if (!name) throw new Error('uso: node scripts/render.mjs <projeto> [--still=SEG]');
const dir = path.join('public/projects', name);
const read = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
const words = fs.existsSync(path.join(dir, 'words.json')) ? read('words.json') : toWords(read('captions.json'));
const props = {...read('scenes.json'), words};
fs.writeFileSync(path.join(dir, 'props.json'), JSON.stringify(props, null, 1));

const browser = process.env.REMOTION_BROWSER ?? (fs.existsSync('/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell') ? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' : null);
const still = process.argv.find((a) => a.startsWith('--still='));
const comp = props.scenes ? 'TalkReel' : 'SplitReel';
const common = ['remotion/index.ts', comp, `--props=${path.join(dir, 'props.json')}`, ...(browser ? [`--browser-executable=${browser}`] : [])];
fs.mkdirSync('out', {recursive: true});
if (still) {
  const sec = parseFloat(still.split('=')[1]);
  execFileSync('npx', ['remotion', 'still', ...common, `out/${name}-${sec}s.png`, `--frame=${Math.round(sec * 30)}`], {stdio: 'inherit'});
} else {
  execFileSync('npx', ['remotion', 'render', ...common, `out/${name}.mp4`, '--codec=h264', '--crf=18'], {stdio: 'inherit'});
  // --sfx[=discreto|marcado]: gera SFX sintetizados pelos tempos das cenas e mixa no áudio (scripts/sfx.py)
  const sfx = process.argv.find((a) => a.startsWith('--sfx'));
  if (sfx) {
    const profile = sfx.includes('=') ? sfx.split('=')[1] : 'discreto';
    execFileSync('python3', ['scripts/sfx.py', name, `--profile=${profile}`, '--video', `out/${name}.mp4`], {stdio: 'inherit'});
  }
}

```
