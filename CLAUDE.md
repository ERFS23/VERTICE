# Segundo cérebro do Elias

Este repositório é o segundo cérebro do Elias. Antes de responder qualquer pedido, use o cérebro: ele existe para que você não precise perguntar o que já está escrito aqui.

**Sempre responda em português do Brasil.** O Elias não fala inglês.

## Leitura obrigatória no início de toda conversa

1. `cerebro/1-contexto/elias.md`: quem é o Elias e quais são as áreas.
2. `cerebro/1-contexto/como-trabalhar-comigo.md`: como ele quer ser atendido.
3. `cerebro/2-memoria/prioridades.md` e `cerebro/2-memoria/tarefas.md`: o que está acontecendo agora.

Depois, leia só o que o pedido precisa. Exemplos:

| Pedido | Leia antes |
|---|---|
| Carrossel | `1-contexto/padrao-carrosseis.md` |
| Edição de vídeo, Reels | `1-contexto/padrao-video-furion.md` e `padrao-video-sfx.md` |
| Cortes de vídeo longo | `1-contexto/padrao-video-cortes.md` |
| Site ou landing page | `1-contexto/padrao-sites-premium.md` |
| Plataforma da comunidade | `2-memoria/projeto-plataforma-comunidade.md` |
| Roteiro, ideia de post | `1-contexto/area-conteudo.md` (tem os links do Notion) |
| Qualquer assunto jurídico | `1-contexto/area-juridico.md` |
| "Qual skill uso?" | `3-acao/skills.md` e `3-acao/catalogo-skills/` |
| Referência de vídeo viral, gancho, tema | procure em `4-biblioteca/biblioteca-de-referencias-ig/` (ver Biblioteca abaixo) |

Se o arquivo de área aponta para uma página do Notion e você precisa do conteúdo dela, leia pelo conector do Notion.

## As camadas

```
cerebro/
├── 1-contexto/    Coisas estáveis: quem sou, áreas, padrões de trabalho, mapa do Notion
├── 2-memoria/     Coisas que mudam: prioridades, tarefas, decisões, aprendizados, projetos, diário
├── 3-acao/        Como agir: skills, catálogo de skills, conectores, rotinas automáticas
└── 4-biblioteca/  Conhecimento de referência (o antigo cérebro Vértice): vídeos analisados, estudos, páginas do Notion
```

- **Contexto** muda pouco. Só altere quando o Elias mudar um padrão, um preço ou uma regra.
- **Memória** muda todo dia. É aqui que você registra o que aconteceu.
- **Ação** descreve as ferramentas e as rotinas que alimentam e limpam o cérebro.
- **Biblioteca** é grande (mais de 580 notas). **Nunca leia a pasta inteira.** Procure pelo assunto com `grep -ril "palavra" cerebro/4-biblioteca` e leia só as notas que aparecerem. Os mapas (`genero: mapa`) são índices de cada tema: comece por eles.

## Áreas

`conteudo`, `sites`, `comunidade`, `juridico`, `vendas`, `pessoal`, `sistema` (o próprio cérebro). Cada área tem um arquivo `1-contexto/area-<nome>.md` que funciona como índice dela.

## Regras para escrever no cérebro

1. **Todo arquivo começa com este cabeçalho:**
   ```
   ---
   titulo: Nome legível
   camada: contexto | memoria | acao
   area: conteudo | sites | comunidade | juridico | vendas | pessoal | sistema
   atualizado: AAAA-MM-DD
   ---
   ```
   Campos opcionais: `tipo` (`area`, `diario`, `rotina`), `fonte` (link de origem), `apelidos` (outros nomes do arquivo, separados por `;`), `tags` (separadas por vírgula), `genero` (na biblioteca: `mapa`, `conceito`, `nota`, `projeto`, `fonte`, `pessoa`, `diario`). Na biblioteca use `camada: biblioteca`.
2. **Nomes de arquivo:** minúsculas, sem acento, com hífen (`projeto-nome.md`, `padrao-nome.md`). Cada nome é único no cérebro inteiro.
3. **Ligue as ideias:** cite outros arquivos com `[[nome-do-arquivo]]`, `[[Título da nota]]` ou `[[nome-do-arquivo|texto]]` (título e apelidos também valem, sem diferença de acento ou maiúscula). São essas ligações que formam o grafo neural do painel. Todo arquivo novo precisa de pelo menos um link para a área dele.
4. **Páginas do Notion:** link normal em Markdown (`[título](https://app.notion.com/p/...)`), dentro do arquivo da área certa.
5. **Nunca invente fatos.** Se não sabe, pergunte ou marque `[PREENCHER]`.
6. **Nunca grave segredos** (senhas, tokens, dados bancários).
7. Ao mudar um arquivo, atualize o campo `atualizado`.

## Quando registrar memória

Durante a conversa, sem o Elias pedir:

- Ele tomou uma **decisão** → uma linha no topo de `2-memoria/decisoes.md`.
- Algo deu errado e foi resolvido → uma linha em `2-memoria/aprendizados.md`.
- Surgiu uma **tarefa** → `2-memoria/tarefas.md`, formato `- [ ] tarefa · área · origem · prazo`.
- Um projeto avançou → atualize o arquivo do projeto em `2-memoria/`.
- Projeto novo → crie `2-memoria/projeto-<nome>.md` e ligue na área.

Avise em uma linha o que foi registrado ("Anotei a decisão em decisoes.md").

## Modelo do diário (`2-memoria/diario/AAAA-MM-DD.md`)

```
---
titulo: Diário DD/MM/AAAA
camada: memoria
area: sistema
tipo: diario
atualizado: AAAA-MM-DD
---

# Diário — DD/MM/AAAA

## O que aconteceu
## Decisões
## Aprendizados
## Tarefas que surgiram
```

## Painel visual

Depois de mudar qualquer arquivo em `cerebro/`, rode:

```
python painel/gerar.py
```

Isso atualiza `painel/cerebro.html` (grafo neural, vista em camadas, busca e aba "Hoje"). Se ele avisar "link quebrado", corrija o link antes de salvar.

Para trazer de novo notas do artifact Vértice (exportadas como uma pasta de `.json`), rode `python painel/importar_vertice.py <pasta>`: ele atualiza as notas que já vieram e cria as novas, sem duplicar.

## Salvar no fim

Sessões na nuvem são apagadas quando terminam. Antes de encerrar, faça commit das mudanças no cérebro e envie (push). Mensagem de commit começando com `memória:` quando for registro de memória.
