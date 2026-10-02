# Como coletar cada fonte

## Notion

Funciona no Claude (conector **Notion** em Configurações → Conectores) e no ChatGPT (conector/app **Notion**).

1. Liste as páginas de topo: ferramentas de listar páginas privadas/compartilhadas ou busca vazia. Se só houver busca, procure por termos amplos ("a", "e", "o", nomes de áreas) até cobrir tudo.
2. Abra (fetch) cada página. No conteúdo, cada `<page url=...>` ou `<database url=...>` é uma subpágina: abra também, guardando o **caminho** (Página mãe / Filha / Neta). Esse caminho é a `pasta` da nota.
3. Bancos de dados: consulte as linhas (query) e trate cada linha como uma nota; propriedades viram uma lista no começo do corpo (`- **Status:** feito`) e as de múltipla escolha podem virar tags.
4. Links entre páginas (`<mention-page>`, links para outras páginas) viram `[[Título]]`.
5. Pule páginas vazias e reuniões sem conteúdo. Imagens e anexos do Notion expiram: guarde só o nome (`📎 arquivo.pdf`) e o link da página (`[Abrir no Notion](url)` no fim da nota).
6. Workspaces grandes: avise o progresso a cada ~30 páginas. Se bater limite de uso do conector, entregue o que já tem e diga o que faltou.

## Memória da IA (sem exportar nada)

**Claude:** use a memória e as ferramentas de busca em conversas passadas, se existirem nesta conta (por exemplo, buscar conversas por tema ou listar as recentes). Faça várias buscas por áreas da vida: trabalho, estudos, projetos, saúde, finanças, relacionamentos, hobbies, metas, livros, ideias. Para cada assunto recorrente, crie uma nota com o que foi discutido e decidido, e a data aproximada.

**ChatGPT:** use as memórias salvas ("o que você lembra sobre mim") e o histórico de conversas que você consegue consultar. Mesma lógica: uma nota por assunto recorrente.

Organize em pastas como `Perfil`, `Trabalho / <projeto>`, `Estudos / <matéria>`, `Ideias`, `Decisões`. Crie Mapas por área. Se o acesso ao histórico for limitado, diga isso e sugira a exportação (abaixo), que é completa.

## Exportação de conversas (completa)

- **ChatGPT:** Configurações → Controles de dados → Exportar dados. Chega um e-mail com um .zip; dentro está `conversations.json`.
- **Claude:** Configurações → Privacidade → Exportar dados. Dentro do .zip está `conversations.json`.

Com o arquivo enviado:

```bash
python scripts/chat_export_to_notes.py conversations.json -o conversas.json
```

Isso cria uma nota por conversa (pasta `Conversas com IA / <ano-mês>`), com tags automáticas por assunto. Depois, leia uma amostra de `conversas.json` (títulos e tags) e **acrescente** notas Mapa por tema, com links `[[...]]` para as conversas daquele tema e um resumo do que a pessoa aprendeu ou decidiu. Junte tudo em `notas.json` antes do Passo 3.

## Arquivos

- `.md` do Obsidian: título = nome do arquivo, pasta = pasta do cofre, links `[[...]]` e tags `#tag` já funcionam.
- PDFs, docs, textos: uma nota por documento (ou por capítulo, se for grande), com um resumo fiel e os trechos mais importantes. Pasta = nome da pasta ou do assunto.
