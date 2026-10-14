# Vértice — memória do projeto

Este repositório guarda o sistema de **edição de vídeo, motion design e SFX por código** da Vértice (`split-reel/`).

Antes de editar qualquer vídeo, leia nesta ordem:
1. `split-reel/LEIA-ME-AGENTE.md` (visão geral, regras e prompt de trabalho)
2. `.claude/skills/reel-tela-dividida/SKILL.md` (fluxo passo a passo, formato do `scenes.json`)
3. `split-reel/DOSSIE.md` (referência completa: 2 estilos, motor, análise de áudio, SFX)

Estilos: **1** = 9:16 tela dividida rosa/roxo (`SplitReel`); **2** = 16:9 talking head verde-limão com 5 layouts (`TalkReel`). SFX: `node scripts/render.mjs <projeto> --sfx`.

Regras fixas: nunca copiar nomes/logos/@/frases dos vídeos de referência (só a técnica); nunca usar samples de áudio de terceiros; você mede o áudio mas não o ouve, então peça ao usuário para ouvir com fone antes de publicar.

Exportar tudo para outro agente: `cd split-reel && python3 scripts/make-kit.py` gera `export/CONHECIMENTO-COMPLETO.md` (arquivo único) e `export/vertice-edicao-kit.zip` (código + docs).
