---
titulo: Projeto — Plataforma da Comunidade
apelidos: Projeto — Plataforma da Comunidade
camada: memoria
area: comunidade
atualizado: 2026-09-28
fonte: https://app.notion.com/p/3eb30eaeef22812a8165efed1fcfc548
---

# Projeto — Plataforma da Comunidade

Área de membros do @serranoconteudo / [[area-comunidade|Comunidade Vértice]]. Também é trabalho da [[area-sites|área de Sites]].

## Onde está

- Pasta: `E:\SITES\plataforma-da-comunidade---aulas-&-ferramentas`
- No ar: https://comunidade-serrano.vercel.app (Vercel, conta verticewsoficial-4179)
- Backup do código original: `E:\SITES\_backups\plataforma-src-original-2026-09-28`
- Brief e pendências: `CLAUDE.md` dentro do projeto.

## Tecnologia e design

- React 19 + Vite 8 + Tailwind v4 (gerada no Google AI Studio, redesenhada em 28/09/2026).
- Direção "caderno editorial": papel quente, grade quadriculada, fontes Fraunces + Instrument Sans + JetBrains Mono, vermelhão **#B8391C** só em ação, raio 3px.
- Tokens em `src/index.css`, componentes em `src/components/ui.tsx`.

## O que foi feito

- Cada material tem página própria `/materiais/<slug>` (roteador em `src/utils/routes.ts`).
- Plano único R$ 97/mês (`src/config.ts`).
- Material premium "Roteirista RQC" (vem da skill narrador-de-impacto) com bloqueio visual (sem login).
- Página de caso `/casos/aquino-pescador` (+10,3 mil seguidores em 2 semanas), **escondida** com `SHOW_CASE=false` até o Aquino autorizar.
- Sem botão "copiar link" para o visitante (decisão do Elias).

## Cuidados técnicos

- O `&` no nome da pasta quebra `npm run dev`/`npx` no Windows. Rodar: `node node_modules/vite/bin/vite.js` e `node node_modules/typescript/bin/tsc --noEmit`.
- Não usar a classe `overline` (colide com Tailwind). Usar `eyebrow`.
- Publicar atualização: `vercel deploy --prod --yes` na pasta do projeto.

## Pendências

Estão em [[tarefas]]: conteúdo fictício (vídeos placeholder, posts, preços) e autorização do Aquino.
