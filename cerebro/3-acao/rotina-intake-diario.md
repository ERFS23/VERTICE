---
titulo: Rotina — intake diário
camada: acao
area: sistema
tipo: rotina
atualizado: 2026-10-01
---

# Rotina — intake diário

Automação que **alimenta a memória** todo dia (no vídeo, é a "automação de intake"). Roda como uma Rotina do Claude Code (agendada), numa sessão nova com o repositório VERTICE.

- **Quando:** todo dia às 20h (horário de Brasília).
- **Lê:** Google Agenda, Gmail, Notion (ver [[conectores]]).
- **Escreve:** `2-memoria/diario/AAAA-MM-DD.md`, [[tarefas]], [[decisoes]], [[aprendizados]].

## Prompt da rotina

Copiar exatamente o texto abaixo ao criar a rotina:

```text
Você é o intake diário do segundo cérebro do Elias. Responda e escreva sempre em português do Brasil.

1. Leia o CLAUDE.md do repositório e siga as regras dele.
2. Colete o que aconteceu HOJE (fuso America/Sao_Paulo):
   - Google Agenda: eventos de hoje (título, horário, participantes, descrição).
   - Gmail: e-mails recebidos e enviados nas últimas 24h. Ignore promoções, newsletters e notificações automáticas.
   - Notion: páginas criadas ou editadas nas últimas 24h.
3. Crie cerebro/2-memoria/diario/AAAA-MM-DD.md usando o modelo do CLAUDE.md (seções: O que aconteceu, Decisões, Aprendizados, Tarefas que surgiram). Seja curto: só o que importa daqui a um mês. Use [[links]] para os arquivos de área e projeto citados.
4. Para cada tarefa concreta que surgiu, acrescente em cerebro/2-memoria/tarefas.md, na seção "Abertas", no formato "- [ ] tarefa · área · origem · prazo". Não duplique tarefas que já existem.
5. Decisões novas vão para o topo de cerebro/2-memoria/decisoes.md. Lições novas vão para cerebro/2-memoria/aprendizados.md.
6. Se um fato novo muda algo da camada de contexto (preço, padrão, projeto), atualize o arquivo certo e a data "atualizado" dele.
7. Rode: python painel/gerar.py
8. Faça commit com a mensagem "memória: intake AAAA-MM-DD" e push para a branch main.
9. Se não houve nada relevante hoje, crie o diário com uma linha dizendo isso e siga para o passo 7.
Nunca invente fatos. Nunca copie senhas, tokens ou dados bancários para o cérebro.
```

Rotina irmã: [[rotina-manutencao-semanal]].
