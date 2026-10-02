# Segundo Cérebro — skill para Claude e ChatGPT

Transforma as suas anotações do **Notion**, os seus arquivos ou a **memória das suas conversas com a IA** num mapa interativo do seu conhecimento: cada pasta vira um círculo, as ideias se ligam por conceito, e você clica em qualquer bolinha para ler a nota.

O resultado é **um arquivo `.html`** que abre no navegador e fica salvo no seu computador.

---

## No Claude (claude.ai ou app)

1. Baixe o arquivo **`segundo-cerebro.zip`** (não descompacte).
2. Vá em **Configurações → Capacidades** e ative **Execução de código e criação de arquivos**.
3. Em **Configurações → Capacidades → Skills**, clique em **Enviar skill** e escolha o `segundo-cerebro.zip`.
4. (Opcional) Para usar o Notion: **Configurações → Conectores → Notion → Conectar**.
5. Abra uma conversa nova e peça, por exemplo:
   - *"Crie meu segundo cérebro com tudo do meu Notion."*
   - *"Crie meu segundo cérebro com o que você lembra das nossas conversas."*
   - *"Crie meu segundo cérebro a partir deste conversations.json"* (anexando o arquivo).
6. Baixe o `segundo-cerebro.html` que ele entregar e abra no navegador.

## No ChatGPT

O ChatGPT não instala skills, mas dá para fazer igual com um **Projeto** (ou um GPT personalizado):

1. Descompacte o `segundo-cerebro.zip`.
2. Crie um **Projeto** novo (barra lateral → Projetos → Novo projeto).
3. Em **Instruções do projeto**, cole o conteúdo de `chatgpt/instrucoes.md`.
4. Em **Arquivos do projeto**, envie: `SKILL.md`, `references/fontes.md`, `references/formato-notas.md`, `scripts/build_brain.py`, `scripts/chat_export_to_notes.py` e `assets/cerebro-template.html`.
5. (Opcional) Ligue o conector do **Notion** em Configurações → Apps/Conectores.
6. Dentro do projeto, peça: *"Crie meu segundo cérebro com meu Notion"* (ou com as memórias, ou com o conversations.json anexado).

## Usando a memória completa das conversas

- **ChatGPT:** Configurações → Controles de dados → **Exportar dados**.
- **Claude:** Configurações → Privacidade → **Exportar dados**.

Chega um e-mail com um `.zip`. Envie o `conversations.json` de dentro dele para a IA.

## Privacidade

- O arquivo final fica só com você; as notas ficam salvas no seu navegador.
- A skill remove senhas, chaves, tokens e telefones antes de montar o cérebro. Mesmo assim, olhe antes de compartilhar o arquivo com alguém.

## Usando o cérebro

- **Temas / Pastas / Palavras-chave / Tipos** (barra lateral): mudam como as notas se agrupam.
- Clique num grupo para dar zoom; o 👁 esconde o grupo; **SÓ** mostra só ele.
- `Ctrl+K` busca. Ao escrever, `[[` liga uma nota a outra.
- Menu **⋯ → Baixar backup** guarda tudo num `.json` (que pode ser importado de novo).
