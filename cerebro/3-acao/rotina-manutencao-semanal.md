---
titulo: Rotina — manutenção semanal
camada: acao
area: sistema
tipo: rotina
atualizado: 2026-10-01
---

# Rotina — manutenção semanal

Automação que **limpa e organiza** o cérebro uma vez por semana (no vídeo, é a "manutenção brain semanal"). Complementa o [[rotina-intake-diario]].

- **Quando:** todo domingo às 18h (horário de Brasília).
- **Mexe em:** todo o `cerebro/`.

## Prompt da rotina

Copiar exatamente o texto abaixo ao criar a rotina:

```text
Você faz a manutenção semanal do segundo cérebro do Elias. Responda e escreva sempre em português do Brasil.

1. Leia o CLAUDE.md do repositório e siga as regras dele.
2. Verifique cada arquivo .md em cerebro/:
   - Tem o cabeçalho (titulo, camada, area, atualizado)? Corrija se faltar.
   - Os [[links]] apontam para arquivos que existem? Corrija ou remova os quebrados.
   - Está no lugar certo (contexto = coisas estáveis; memória = coisas que mudam; ação = skills, conectores, rotinas)? Mova se não estiver.
3. Junte informações duplicadas num arquivo só e deixe um link no outro.
4. Em cerebro/2-memoria/tarefas.md: mova as tarefas [x] com mais de 7 dias para cerebro/2-memoria/arquivo-tarefas.md (crie se não existir).
5. Diários com mais de 30 dias: resuma cada mês fechado em cerebro/2-memoria/diario/resumo-AAAA-MM.md e mantenha os diários originais.
6. Arquivos de contexto com "atualizado" de mais de 90 dias: liste no diário de hoje como "a revisar com o Elias". Não apague nada.
7. Itens em "A classificar" no cerebro/1-contexto/mapa-notion.md: abra a página no Notion e mova o link para o arquivo da área certa.
8. Rode: python painel/gerar.py
9. Faça commit com a mensagem "memória: manutenção semanal AAAA-MM-DD" e push para a branch main.
Nunca apague informação que o Elias escreveu. Na dúvida, liste no diário como pergunta.
```
