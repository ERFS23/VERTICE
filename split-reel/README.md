# split-reel

Gerador de Reels no estilo **tela dividida**: motion graphics neon em cima, vídeo cru embaixo e legenda karaokê na divisória. Feito com [Remotion](https://remotion.dev).

- Decupagem do estilo: [`ESTILO.md`](ESTILO.md)
- Como o Claude usa: skill [`/.claude/skills/reel-tela-dividida`](../.claude/skills/reel-tela-dividida/SKILL.md)

```bash
npm install
npm run studio                          # pré-visualização interativa no navegador
node scripts/render.mjs demo            # renderiza out/demo.mp4
node scripts/render.mjs demo --still=3  # um quadro em out/demo-3s.png
```

Cada projeto fica em `public/projects/<nome>/`, com `raw.mp4`, `words.json` (ou `captions.json`) e `scenes.json`.
Os vídeos não são versionados no git.
