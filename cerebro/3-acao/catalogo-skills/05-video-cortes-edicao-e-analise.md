---
titulo: 🎬 05 · Vídeo — cortes, edição e análise
camada: acao
area: conteudo
genero: nota
atualizado: 2026-10-01
tags: notion
fonte: https://app.notion.com/p/3ed30eaeef2281aa9bd1ffb5282e24dc
pasta_vertice: Notion / Memória / Skills
origem: vertice
vertice_id: notion-3ed30eaeef2281aa9bd1ffb5282e24dc
---
Fonte: `E:\SKILS\02-video-cortes`.

Skill | Para que serve | Observações

`corte-viral` | Transforma vídeo longo (podcast, live, aula) em clipes verticais 9:16 para Shorts/Reels/TikTok: decupagem, escolha dos trechos, corte preciso, enquadramento no locutor | Tem venv próprio e 9 agentes (context-mapper, clip-hunter, clip-builder, blind-reviewer etc.). Falta o modelo YuNet do autoframe

`motion-vox` | Motion graphics estilo Vox + legenda queimada em clipe vertical já cortado | Venv próprio. Pasta `assets/` sem PNGs

`video-use` | Edita qualquer vídeo por conversa: transcrever, cortar, color grade, animações, legenda | Recebeu o **estilo Elias** (visual Hashtag + som Furion)

`watch` | "Assiste" um vídeo (link ou arquivo): baixa com yt-dlp, extrai quadros e transcrição para o Claude responder perguntas | Atualizar com `git pull` em `~/Developer/claude-video`

`manim-video` | Animações matemáticas/técnicas estilo 3Blue1Brown com Manim | Explicações animadas, algoritmos, diagramas

☁️ `cctv-cinematico` | Transforma vídeo de câmera de segurança em prompt cinematográfico multi-plano para Higgsfield/Seedance | Do [claude.ai](http://claude.ai)

## Fluxo típico
1. `corte-viral` → gera o clipe vertical limpo.
2. `motion-vox` → coloca motion e legenda.
3. `video-use` → acabamento no estilo Elias.

---
[Abrir no Notion](https://app.notion.com/p/3ed30eaeef2281aa9bd1ffb5282e24dc)
