# Cérebro do Elias

Segundo cérebro no modelo de 3 camadas (Contexto → Memória → Ação), ligado ao Claude Code.

Toda conversa do Claude Code aberta neste repositório lê o `CLAUDE.md` sozinha. Ele ensina o Claude a consultar o cérebro antes de responder e a registrar memória nova. Não precisa mais colar contexto no começo da conversa.

## Estrutura

```
CLAUDE.md                 Manual do cérebro (o Claude lê sozinho)
cerebro/
├── 1-contexto/           Quem sou, áreas, padrões (carrossel, vídeo, sites), mapa do Notion
├── 2-memoria/            Prioridades, tarefas, decisões, aprendizados, projetos, diário/
└── 3-acao/               Skills, conectores, rotinas automáticas
painel/
├── gerar.py              Monta o painel a partir dos arquivos
├── modelo.html           Visual do painel
└── cerebro.html          Painel pronto (abrir no navegador)
```

## Ver o painel

Abra `painel/cerebro.html` no navegador (precisa de internet para carregar fontes e bibliotecas).

- **Mapa → Neural:** grafo com todas as ligações.
- **Mapa → Camadas:** Elias no centro, depois Áreas, Contexto, Memória, Ação e páginas do Notion por fora, cada área na sua fatia.
- **Hoje:** tarefas abertas, prioridades e o último diário.
- **Busca:** procura no título e no texto de todos os arquivos.

Depois de mudar qualquer arquivo em `cerebro/`, rode `python painel/gerar.py`.

## Rotinas

Os prompts prontos estão em `cerebro/3-acao/rotina-intake-diario.md` (todo dia) e `cerebro/3-acao/rotina-manutencao-semanal.md` (domingo).

## Ver também no Obsidian (opcional)

Os links usam o formato `[[nome]]`. Se abrir a pasta `cerebro/` no Obsidian, o "Graph view" dele também mostra o cérebro como rede neural.
