---
titulo: Conectar a uma conversa
camada: acao
area: sistema
atualizado: 2026-10-04
---

# Conectar a uma conversa

O cérebro não serve se só eu abro. Ele precisa entrar em **qualquer conversa** com a IA. Três jeitos:

## 1. Claude Code neste PC (o principal)

- Digite `/segundo-cerebro` ou diga "use meu segundo cérebro".
- A skill `segundo-cerebro` lê o painel (`https://claude.ai/artifact/Xa2kyT82vzWyioMsZCc4hw`) e os dados vivos.
- Durante a conversa, o Claude **grava** no cérebro: tarefas combinadas, decisões, aprendizados e o número novo de uma métrica.

## 2. Qualquer outro chat (Claude.ai, ChatGPT, Gemini)

- No Painel, botão **Copiar cérebro como texto** (ou **Baixar cerebro.md**).
- Cole no começo da conversa. Vai junto um roteador dizendo onde está cada coisa.
- É o mesmo princípio do `CLAUDE.md` / `AGENTS.md`: o cérebro é só texto, então serve para qualquer IA (ver [[niveis-do-cerebro]]).

## 3. Rotinas agendadas

- [[rotina-intake-diario]] e [[rotina-manutencao-semanal]] usam o mesmo link para ler e gravar.

## Regras para quem grava

- Tarefa: coleção `tarefas` com `texto`, `area`, `origem`, `prazo` (AAAA-MM-DD), `feito`, `criado`.
- Memória: coleção `memoria` com `tipo` (diario, decisao, aprendizado, nota, reuniao), `titulo`, `texto`, `data`, `origem`.
- Métrica: atualizar `valor`, acrescentar `{d, v}` em `historico`, `atualizado` e `fonte: "claude"`.
- Nunca gravar senhas, tokens ou dados bancários.
