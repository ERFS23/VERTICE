---
titulo: Vídeo — cortes com corte-viral
apelidos: Vídeo — cortes com corte-viral (Cowork)
camada: contexto
area: conteudo
atualizado: 2026-09-15
fonte: https://app.notion.com/p/3eb30eaeef228191b9feef13760efd46
---

# Vídeo — cortes com corte-viral

Memórias do Cowork (15/09/2026). Skill `corte-viral` (ver [[skills]]).

## Como o Elias trabalha nos cortes

- Usa a skill `corte-viral` para transformar vídeo longo em Reels/Shorts verticais.
- Manda a **transcrição colada no chat** (formato `[00:02:19] texto`), não em arquivo.
- Aponta só a pasta do vídeo: confirmar o arquivo pelo `duration` do ffprobe batendo com o último timestamp, sem perguntar.
- **Corta escopo no meio da run** (ex.: aprovou 4 momentos e depois pediu só o 1 e o 4). Não adiantar trabalho das fases seguintes: cada portão existe porque ele muda de ideia ali.
- Pergunta de custo no meio: responder pelas janelas de 5h e semanal do plano Pro.
- Quer o resultado **entregue no chat**, não só salvo em disco.

## Ambiente (Windows)

- Fonte atual: `E:\SKILS\02-video-cortes\corte-viral` (kit antigo em `C:\Users\Elias Rfs\Downloads\SKILS Claude\corteviral\corte-viral\`).
- Rodar com `python "<kit>\scripts\vch.py" <subcomando>` (o lançador de macOS do SKILL.md não vale aqui).
- **ffmpeg** instalado via winget (`Gyan.FFmpeg` 9.0.1, com libass: queimar legenda funciona). Se não estiver no PATH, prefixar:

```powershell
$env:PATH = "C:\Users\Elias Rfs\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.1-full_build\bin;$env:PATH"
```

- Instalados: `pyyaml`, `jsonschema`.

## Lição: bordas do corte (erro que aconteceu 2x)

- Transcrição colada **não tem tempo por palavra** (~2s de precisão). **Nunca** estimar borda pela cadência da linha: erra ~0,4s.
- Medir com ffmpeg: `volumedetect` (calibrar), `silencedetect` (fronteira de frase), `volumedetect` numa janela (fala ou silêncio?).
- Mas **gap de silêncio não é fronteira de palavra** (oclusivas criam quedas dentro da palavra). Quando o corte depende de cravar entre duas palavras, **gerar tempo por palavra primeiro** e conferir no arquivo **já renderizado**.
- Caminho barato que funcionou: rodar **faster-whisper `medium`** (não `small`, que inventa palavras) só nos clipes já cortados, com `word_timestamps=True`, e alimentar `scripts.subtitles.build_caption_files`.
- O Whisper corrige erros da legenda automática (rate→hate, plája→plágio), mas conferir.
- Método completo gravado no kit: `docs/12-erros-registrados.md` §12.7 a §12.12.

Resumo desta lição também em [[aprendizados]].
