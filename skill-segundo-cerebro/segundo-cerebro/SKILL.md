---
name: segundo-cerebro
description: Cria um "segundo cérebro" interativo (grafo de conhecimento estilo Obsidian, com pastas em círculos, temas, palavras-chave, busca e notas clicáveis) a partir das anotações da pessoa no Notion, de arquivos (.md, Obsidian, PDF, texto) ou da memória e do histórico de conversas com a IA (Claude ou ChatGPT). Use sempre que alguém pedir segundo cérebro, mapa mental das minhas notas, grafo de conhecimento, "organizar meu Notion em rede", "o que você sabe sobre mim em forma de mapa", ou quiser visualizar e conectar suas ideias, mesmo sem citar a skill pelo nome.
---

# Segundo Cérebro

Você vai transformar o conhecimento da pessoa em notas ligadas entre si e entregar **um único arquivo .html** que abre em qualquer navegador. Ele mostra a rede, permite buscar, clicar e ler cada nota, e organizar por **Temas**, **Pastas** (cada pasta vira um círculo com as notas dentro), **Palavras-chave** e **Tipos**.

Fale sempre na língua da pessoa (padrão: português do Brasil), em passos curtos.

## Passo 1 — Escolher a fonte

Pergunte (uma vez só, se ela não disse) de onde vem o conhecimento. Pode ser mais de uma:

| Fonte | O que fazer |
|---|---|
| **Notion** | Precisa do conector do Notion ligado. Veja `references/fontes.md` → Notion. |
| **Memória da IA** | Use a memória e o histórico de conversas que você enxerga. Veja `references/fontes.md` → Memória. |
| **Exportação de conversas** (conversations.json do ChatGPT ou do Claude) | Rode `scripts/chat_export_to_notes.py`. Veja `references/fontes.md` → Exportação. |
| **Arquivos** (.md do Obsidian, .txt, PDFs, docs) | Leia os arquivos enviados e transforme em notas. |

Se uma fonte não estiver disponível (conector desligado, sem acesso ao histórico), diga exatamente o que a pessoa precisa ligar ou enviar, e ofereça a próxima melhor fonte. Nunca invente conteúdo que não veio da pessoa.

## Passo 2 — Montar as notas

Siga `references/formato-notas.md`. Resumo:

- Uma nota por página, documento, conversa ou ideia importante. Título curto e único.
- **pasta** = de onde a nota vem, como caminho (`Faculdade / Direito Civil`). É isso que vira os círculos da visualização por Pastas.
- **[[Links]]**: escreva `[[Título de outra nota]]` no corpo sempre que uma ideia citar outra. São as conexões do grafo.
- **tags**: 2 a 5 conceitos centrais da nota (minúsculas, com hífen). Notas com tags em comum se agrupam.
- Crie notas **Mapa** (`type: "mapa"`) para os grandes temas, cada uma com links para as notas do tema. Elas viram os centros da rede.
- **Nunca** copie senhas, chaves de API, tokens, números de cartão, documentos (CPF/RG) ou telefones. Troque por `[omitido]`. O arquivo final pode ser compartilhado.

Salve tudo como `notas.json` (lista de notas).

## Passo 3 — Gerar o arquivo

**Se você pode rodar Python** (Claude com execução de código, ChatGPT com análise de dados, Claude Code):

```bash
python scripts/build_brain.py notas.json -o segundo-cerebro.html --nome "Nome da pessoa"
```

Entregue o `segundo-cerebro.html` para download. O script também limpa segredos e telefones e garante títulos únicos.

**Se não pode rodar código:** entregue o `notas.json` e o arquivo `assets/cerebro-template.html` (sem alterar). A pessoa abre o template no navegador e clica em **Importar arquivo** → escolhe o `notas.json`.

**No claude.ai, com Artifacts:** você também pode publicar o `segundo-cerebro.html` gerado como artifact, para a pessoa abrir por link.

## Passo 4 — Explicar como usar (curto)

Diga à pessoa:
1. Abra o arquivo no navegador (Chrome, Edge, Safari). Precisa de internet só para carregar as fontes e o motor do grafo.
2. Na barra lateral, troque entre **Temas, Pastas, Palavras-chave e Tipos**. Clique num grupo para dar zoom; o olho esconde o grupo; **SÓ** mostra só ele.
3. Clique numa bolinha para ler a nota; `Ctrl+K` busca; `[[` no editor liga notas.
4. As notas ficam salvas no próprio navegador. Use o menu **⋯ → Baixar backup** de vez em quando.
5. Para atualizar com conteúdo novo, peça de novo à IA e abra o novo arquivo (as notas que a pessoa criou à mão no navegador são mantidas).

Mostre um resumo do que entrou: quantas notas, quais pastas principais e os 5 temas mais fortes.
