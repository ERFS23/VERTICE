---
titulo: Carrosséis — regras e estilo
camada: contexto
area: conteudo
atualizado: 2026-09-30
fonte: https://app.notion.com/p/3eb30eaeef2281f6be72c78179083577
---

# Carrosséis — regras e estilo

Aplicar em **todo** carrossel da [[area-conteudo|área de Conteúdo]].

## Regras obrigatórias

Fonte: post "Ugly vs Viral Carousel" (@fizzaandalgorithm) — https://www.instagram.com/p/DcJXeZ4iP_L/

1. **Tamanho:** orgânico **1080×1440 (3:4)**; área segura 180px em cima/embaixo e 50px nas laterais. Impulsionar/anúncio: **1080×1350**.
2. **Leitura em F/Z:** o primeiro a ler é o MAIOR, no alto à esquerda; depois subtítulo; detalhes pequenos embaixo. Nunca título no canto direito com texto solto no meio.
3. **Contraste:** legível em tela pequena/escura; ≥ 7:1 no texto principal; uma cor de destaque para palavras-chave.
4. **Estrutura de 10 slides:** 1 parar o scroll · 2–3 interesse com exemplo · 4–5 diagrama/visual · 6–9 informação prática · 10 CTA simples.
   - Proibido: gancho sem graça, slide sem motivo para arrastar, vender antes de entregar valor, informação aleatória, CTA de venda no fim.
5. **Curiosidade entre slides:** loop aberto, "arrasta →".
6. **Imagem integrada:** recorte com sombra no chão e luz coerente, interagindo com o texto. Nunca imagem colada chapada.

Se um pedido explícito do Elias conflitar com as regras, o pedido vence, mas avisar.

## Estilo visual @serranoconteudo

- Fundo branco com quadriculado cinza bem claro.
- Títulos em serifa pesada e condensada: aproximação com **Playfair Display 800–900** e letter-spacing negativo (a fonte real ainda não foi enviada, ver [[tarefas]]).
- Ilustrações 3D (**Microsoft Fluent Emoji** via jsdelivr) + mockup de celular com cena de Reels.
- Entrega: PNGs soltos + zip + legenda pronta (≤ 2200 caracteres).

## Como gerar (pipeline que funcionou)

- `gerar.py` monta o HTML → **Playwright com `channel="msedge"`** → um slide por vez com `page.screenshot(clip=...)` (screenshot de elemento cortava os slides).
- Projetos de exemplo: `E:\SKILS\carrossel-formatos-video`, `E:\SKILS\carrossel-ganchos`.
- Alternativa: conector **CarrosseIA** (cria carrossel a partir de roteiro). Ver [[conectores]].
