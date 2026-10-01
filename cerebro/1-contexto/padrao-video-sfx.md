---
titulo: Vídeo — biblioteca de SFX
camada: contexto
area: conteudo
atualizado: 2026-09-24
fonte: https://app.notion.com/p/3eb30eaeef228150b97bcbc640e1f7a9
---

# Vídeo — biblioteca de SFX

Complementa o [[padrao-video-furion]].

## Onde está

`E:/INSTAGRAM/sfx_library/`: 55 sons em 13 classes (extraídos em 24/09/2026 do YouTube 957Y50dLrhQ).

- whoosh (7), glitch (5), riser_hit (6), sub_drop (6), drone (2), horn (2), click (5), reverse (2), button (3), camera (2), ui_popup (2), faaah (4), meme (9).
- `index.json`: arquivo, duração, `peak_s` (alinhar: início = alvo − peak_s) e `gain_db`.
- `README.md` = catálogo; `_preview_<classe>.wav` para ouvir.
- **Regras completas:** `E:/INSTAGRAM/sfx_library/REGRAS_SFX.md`. Ler antes de mixar.

## Regra principal

**Nunca sintetizar SFX.** No primeiro Reel os sons sintetizados ficaram ruins. Sempre usar a biblioteca e aplicar o `gain_db` de cada clipe (os brutos são tão altos quanto a voz; foi por isso que a primeira edição estourou).

## Níveis-alvo (voz em −14 LUFS)

whoosh −27 · click/button −28 · ui/camera −27 · glitch/reverse −26 · riser_hit −21 · sub_drop −22 · horn −22 · drone −34 · meme/faaah −21 (só humor; no máx. 1 em conteúdo de autoridade).

## Densidade e sincronia

- ~1 SFX a cada 3–4s; impactos no máx. 2 num Reel de 30–45s (3–4 em 80–90s).
- Whoosh só em transição real, com o pico no corte. Riser hit na sílaba do payoff. Reverse termina no corte. Clicks 0–30ms antes do elemento.
- Nunca o mesmo arquivo duas vezes seguidas. Sem SFX em legenda ou troca de ângulo. 5–15s sem SFX em objeção/emoção/CTA.
- Filtro passa-alta 120 Hz nos SFX leves; −3 dB em 2–5 kHz nos risers/drones sob a fala.
- Regras do próprio Elias sempre valem por cima destas.
