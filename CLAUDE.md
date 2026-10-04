# VERTICE: memória do projeto

## Edição de vídeo

Sempre que o pedido envolver editar, cortar, legendar, finalizar ou criar vídeo (Reel, TikTok, Short, trailer, motion graphic), siga o playbook em `.claude/skills/editar-video/SKILL.md` (skill `editar-video`). Resumo do que nunca pode faltar:

- Edição 100% por código: FFmpeg + Python + Node + HyperFrames. Dependências só locais (npm na pasta, Python em `.venv`).
- Vídeo falado → 9:16 com hook nos 2 primeiros segundos, cortes secos sem pausas, punch-ins nas ênfases, legendas por palavra com uma cor de destaque (amarelo), cards de UI ilustrando a fala, profundidade (pessoa recortada na frente) com moderação, CTA animado no final.
- Música baixa com ducking + SFX discretos (whoosh, pop, click), sincronizados ao frame.
- Storyboard antes do HTML; snapshots e checklist de QA antes do render final.
