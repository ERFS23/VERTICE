---
titulo: Skills e ferramentas
camada: acao
area: sistema
atualizado: 2026-09-30
fonte: https://app.notion.com/p/3eb30eaeef2281e79f56cd913cc45053
---

# Skills e ferramentas

## Onde ficam

- Fonte: `E:\SKILS` (organizada por área em 25/09/2026; índice completo em `E:\SKILS\INDEX.md`).
- Instaladas: `C:\Users\Elias Rfs\.claude\skills\`.
- ⚠️ Editar em `E:\SKILS` **não** atualiza a cópia instalada. Recopiar depois de editar (ver [[aprendizados]]).

## Por área

**01 · Jurídico/advocacia** ([[area-juridico]])
- Pack **Capi Advocacia** (18 skills `capi-*`): começa por `capi-socio`; onboarding `capi-comece-aqui`. Também copiado para `~/.codex/skills`.
- `adv-tech-complete-system`, `adv-tech-copywriter` (Legal Design, copy jurídica), `oab-simulados-premium`.

**02 · Vídeo e cortes** ([[area-conteudo]])
- `corte-viral`: corta vídeo longo em clipes verticais (agentes próprios; venv em `.venv`). Falta o modelo `face_detection_yunet_2023mar.onnx` (enquadramento automático). Após atualizar, recopiar `agentes\*.md` para `~/.claude/agents/`. Ver [[padrao-video-cortes]].
- `motion-vox`: motion graphics + legenda queimada (sem pasta `assets/` de PNGs).
- `video-use`: edição de vídeo por conversa.
- `watch`: assistir/analisar vídeos (link para `~/Developer/claude-video`; atualizar com `git pull`).

**03 · Marketing e negócios** ([[area-vendas]])
- C-level squad: `caio-architect`, `cio-engineer`, `cmo-architect`, `coo-orchestrator`, `cto-architect`, `vision-chief`.
- `agente-estrategista` (vendas B2B), `alfredo-soares-advisor`.

**04 · Conteúdo e roteiro** ([[area-conteudo]])
- `roteiro-viral-serrano`, `roteirista`, `narrador-de-impacto` (base do Roteirista RQC).

**05 · Neuroaprendizagem** ([[area-pessoal]]) — `neuroaprendizagem`.

**06 · Trading** ([[area-pessoal]]) — `binary-options-indicator` (indicadores Lua para IQ Option/Polarium).

**07 · Design** ([[area-sites]]) — `site-premium`, `epic-paper` (precisa do Paper Desktop + MCP), `image-prompt-generator`.

**08 · Referência** — `engenharia-de-prompt`, prompts mestres, cheatsheet do Claude Code.

## Detalhes técnicos do Windows

- `corte-viral` e `motion-vox` têm venv próprio (`<skill>\.venv\Scripts\python.exe`). O `vch` do corte-viral roda pelo Bash, não pelo PowerShell.
- yt-dlp instalado via winget; chamar scripts com `python`.

## Prompts e agentes no Notion

- [BIBLIOTECA DE PROMPTS](https://app.notion.com/p/34f30eaeef228039b603d16f9d8636c9)
- [PROMPTS](https://app.notion.com/p/3de30eaeef228063b78cd12c955115ec)
- [OTIMIZADOR DE PROMPT](https://app.notion.com/p/3da30eaeef22800bb0e7efaa03d312e6)
- [TEMPLATE PARA CRIAÇÃO DE IA ESPECIALIZADA](https://app.notion.com/p/3da30eaeef22801f9cbce88b6754ce3a)
- [PERFIL COMUNICACIONAL PARA AGENTES](https://app.notion.com/p/3da30eaeef228065aec1cc3763dfaf31)

Conectores (Notion, Gmail etc.) estão em [[conectores]].
