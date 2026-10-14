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
