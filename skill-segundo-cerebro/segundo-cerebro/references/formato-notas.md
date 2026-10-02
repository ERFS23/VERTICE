# Formato das notas (notas.json)

Uma lista JSON. Cada nota:

```json
{
  "title": "Regra Matriz de Incidência Tributária",
  "pasta": "Faculdade / Direito Tributário",
  "type": "conceito",
  "tags": ["imposto-de-renda", "fato-gerador", "ctn"],
  "body": "Resumo em **markdown**.\n\nLiga com [[Imposto de Renda]] e [[Lucro Presumido]].\n\n---\n[Abrir no Notion](https://...)",
  "created": 1727740800000
}
```

| Campo | Regra |
|---|---|
| `title` | Obrigatório, curto e **único**. Sem `[` `]`. |
| `pasta` | Caminho com ` / `. Até 3 níveis. Reflete a origem (página mãe do Notion, pasta do cofre, área da vida). Notas soltas: `Páginas avulsas`. |
| `type` | `mapa` (centro de um tema), `conceito`, `nota` (padrão), `projeto`, `fonte` (livro, vídeo, conversa), `pessoa`, `diario`. |
| `tags` | 2 a 5 conceitos, minúsculas, palavras unidas por hífen. Reuse as mesmas tags entre notas: é assim que os assuntos se encontram. |
| `body` | Markdown. Preserve o conteúdo da pessoa; para textos longos, mantenha a estrutura (títulos, listas). Limite ~150 mil caracteres. |
| `created` | Opcional, em milissegundos. |
| `src` | Opcional, link de origem. |

## Como criar boas conexões

1. **Links explícitos primeiro:** se a fonte já liga páginas (Notion, Obsidian), preserve como `[[Título]]` com o título final exato da nota de destino.
2. **Mapas por tema:** para cada grande assunto (5 a 15 no total), uma nota `type: "mapa"` com 2–4 frases explicando o tema e uma lista `- [[nota]]` das notas dele. Uma nota pode estar em mais de um mapa.
3. **Ligações de ideia:** quando duas notas tratam do mesmo conceito em contextos diferentes, acrescente no fim de uma delas: `Relacionado: [[outra nota]]`. Não exagere: 1–3 por nota.
4. O próprio app também liga automaticamente notas com vocabulário parecido (linhas tracejadas), então não é preciso ligar tudo à mão.

## Privacidade

Antes de salvar, remova: senhas, chaves de API e tokens, dados de cartão, CPF/RG, telefones e endereços completos de terceiros. Se uma página for só credenciais, crie a nota apenas com o título e `🔒 Conteúdo sensível omitido.`
