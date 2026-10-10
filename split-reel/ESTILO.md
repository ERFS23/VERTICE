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
