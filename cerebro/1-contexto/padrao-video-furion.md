---
titulo: Vídeo — edição padrão Furion
apelidos: Vídeo — edição padrão Furion (Cowork)
camada: contexto
area: conteudo
atualizado: 2026-09-23
fonte: https://app.notion.com/p/3eb30eaeef2281968f21d8d62a484f9a
---

# Vídeo — edição padrão Furion

Padrão ouro de edição do Elias, analisado quadro a quadro em 22–23/09/2026 a partir de `C:\Users\Elias Rfs\Desktop\Furion.ai.mp4`. Aplicar em **toda** edição e mostrar o plano de efeitos (EDL) antes de renderizar. Sons: ver [[padrao-video-sfx]].

Referências secundárias (shorts de "edição dinâmica"): youtube.com/shorts/uUAkWb6Df-o, T_2dHvw-zJs, 9hGcm8njgR8, kIc-xZvQoLc, Ga8a5T-qxic.

**Restrição nº 1 do Elias: dinâmico, mas NUNCA poluído. Um foco por vez.**

## Filosofia em 5 linhas

1. Um foco por vez. Texto grande entra, legenda sai.
2. O efeito ilustra o que é dito (número, lista, produto, prova). Não enfeita.
3. Densidade segue o roteiro: promessa/mecanismo/prova = muito gráfico; objeção/emoção/CTA = só rosto e legenda.
4. Paleta única: preto quente + laranja **#F07018** + branco. Vermelho **#E03010** só para negação. Sem emoji, sem arco-íris.
5. O som faz metade: trilha sobe quando o rosto sai, some antes da prova principal; um efeito por gráfico. Legenda e troca de câmera sem som.

## Números medidos no Furion

167 palavras/min · 43 cortes secos (1 a cada ~4,2s) · evento visual a cada ~2,1s · 12 flashes brancos · −21 LUFS · trilha ~16–20 dB abaixo da voz.

## Estrutura de VSL (template)

Gancho numérico → Virada → Promessa em lista → Prova (com vácuo de trilha) → Objeção (limpa) → Prova massiva → Mecanismo (1 sistema gráfico por feature) → Diferencial → Para quem → Demonstração → CTA limpo.

## Ritmo e câmera

- Cortar toda pausa > ~0,15s, deixando 40–80ms de cauda.
- 3 enquadramentos; trocar a cada 2–5s na fronteira de frase, corte seco e sem som. Com uma câmera só: alternar 100% ↔ 118–122%.
- Punch-in 115–120% no quadro da palavra-chave. Push lento 100→106% só enquanto um gráfico se monta.
- Rack focus (desfocado → nítido em ~6 quadros) para abrir frase.

## Sistema visual

- **Legenda base:** branca, sans bold (Manrope/Inter), ~3% da altura, 1–3 palavras, a ~80% da altura, sem caixa, sem som.
- **Destaque médio:** frase ~5% da altura com 1 palavra laranja + sublinhado desenhando. Máx. 1 a cada 20–30s.
- **Tipografia cinética:** 7–10% da altura, sobre o peito (nunca sobre os olhos), letra a letra 40–60ms com glow; sai em 150–250ms. ~1 a cada 10–15s nos blocos densos.
- **HUD:** painel de vidro escuro com borda laranja de 1px, no terço vazio; itens entram no instante em que são falados. Diagramas de nós, contadores de views, logos na mão.
- **Tela cheia:** UI do produto inclinada em 3D, 2–7s, sempre entrando/saindo com flash.
- **Transições (só 3):** flash branco/light leak (mudança de seção), rack focus, glitch/RGB (só depoimento). Proibido: dissolve, cubo, zoom "mola".

## Som

| Visual | Som |
|---|---|
| Flash de seção | Whoosh + sub (discreto, ~+3 dB) |
| Texto digitado, lista, contador | Ticks |
| Logo, ícone, nó | Pop curto (0–30ms antes) |
| Palavra-bomba | Impacto + flash vermelho |
| Legenda, troca de câmera | **Nenhum** |

- Trilha ~105 BPM, 16–20 dB sob a voz; +10–15 dB quando o rosto sai; **some sob a prova principal**; fade de ~7s no CTA.
- Loudness: VSL −16 LUFS; Reels −14 LUFS; pico ≤ −1 dBTP.

## Anti-poluição (checklist a cada 10s)

- Pelo menos 1 mudança visual e no máximo ~6?
- 2 elementos focais disputando? → remover um.
- Gráfico cobrindo o rosto? → mover.
- Todo gráfico corresponde à palavra falada naquele instante?
- Legenda + texto grande juntos? → esconder a legenda.
- Legenda ou troca de câmera com som? → remover.
- Cor fora da paleta?

**Proibido:** emoji, cada palavra de uma cor, karaokê gigante, tremor constante, zoom "respirando", SFX em toda legenda, dissolve, 3 fontes, B-roll genérico.

## Reels 9:16

- 1080×1920, 30 fps, 20–45s.
- Área útil: **x 60–940, y 220–1480**. Rosto no terço superior; legenda em y ≈ 1180–1300 (~55–60px, ≤ 22 caracteres por linha); tipografia grande em y ≈ 900–1150.
- Evento visual a cada 1,2–1,8s; troca de enquadramento a cada 1,5–3s; re-gancho a cada 5–7s.
- Estrutura: 0–2s gancho · 2–6s tensão · 6–25s 2–3 blocos de prova/mecanismo · vácuo + frase-prova · CTA curto que liga ao início (loop).
- Voz −14 LUFS; trilha 16–18 dB abaixo; primeiro SFX no primeiro quadro.

## Fluxo de produção

1. Ingestão (ffprobe + transcrição por palavra) → 2. Mapa de beats → 3. **Plano de efeitos (EDL), mostrar antes** → 4. Corte → 5. Câmera → 6. Grade quente/escura → 7. Gráficos (HTML → PNG com alpha via Playwright) → 8. Composição + legenda ASS → 9. Transições → 10. Som → 11. Loudness → 12. Revisão (folha de quadros + checklist).

## O que o Elias precisa fornecer/autorizar

Vídeo bruto (ideal 2 ângulos), trilha, fontes (Manrope + Archivo Black), logos/prints/gravações de tela. Recorte da pessoa (texto atrás) precisa de modelo de segmentação: baixar só com autorização.

Manual completo original: memória `video-edit-playbook-furion` do Cowork.
