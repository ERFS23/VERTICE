---
name: reel-tela-dividida
description: Edita um vídeo cru de rosto no estilo "tela dividida", com motion graphics neon sincronizados à fala em cima, vídeo original embaixo e legenda karaokê na divisória. Use quando o usuário mandar um vídeo para editar "naquele estilo", "tela dividida", "split screen" ou "com motion em cima".
---

# Reel tela dividida (estilo Vértice)

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
