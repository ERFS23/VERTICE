---
titulo: ⚖️ 01 · Jurídico — Pack Capi Advocacia
camada: acao
area: juridico
genero: nota
atualizado: 2026-10-01
tags: notion
fonte: https://app.notion.com/p/3ed30eaeef228178943fc619ad2be50b
pasta_vertice: Notion / Memória / Skills
origem: vertice
vertice_id: notion-3ed30eaeef228178943fc619ad2be50b
---
Pacote com 18 skills para escritório de advocacia. **Porta de entrada:** `capi-socio` (decide qual skill usar e conduz o fluxo). **Primeira vez:** `capi-comece-aqui`.
Fonte: `E:\SKILS\01-juridico-advocacia\capi-pack-advocacia`. Instalado em `~/.claude/skills` e `~/.codex/skills`. Scripts só usam Python padrão.
## Coordenação

Skill | Para que serve | Exemplo de pedido

`capi-socio` | Sócio sênior: recebe qualquer demanda, escolhe a skill, monta o plano e conduz de ponta a ponta. Faz a "reunião de segunda" com prazos e pendências de todos os casos | "chegou um cliente novo", "como estão meus casos"

`capi-comece-aqui` | Tutor para quem nunca usou IA: confere instalação, recomenda 3 agentes, exercício com caso fictício | "por onde eu começo"

`capi-criador-de-skills` | Cria skill nova para tarefa repetitiva do escritório, testa e empacota para a equipe | "quero criar uma skill"

## Atendimento e cliente

Skill | Para que serve | Exemplo de pedido

`capi-atendimento` | Triagem do cliente e ficha do caso: linha do tempo, alertas de prescrição, documentos a pedir, mensagem de WhatsApp | "organiza esse caso"

`capi-cliente` | Comunicação com o cliente em linguagem simples: andamento, notícia ruim, cobrança, relatório mensal, áudio de WhatsApp | "explica isso pro cliente"

`capi-honorarios` | Precifica o caso, proposta com 3 opções, contrato de honorários e roteiro para apresentar o preço | "quanto eu cobro?"

`capi-anonimizador` | Mascara dados pessoais (CPF, nomes, processo) antes de ir para a IA e restaura no final. LGPD e sigilo | "anonimiza esse documento"

## Análise e estratégia

Skill | Para que serve | Exemplo de pedido

`capi-processo` | Raio-x dos autos: resumo, linha do tempo, decisões, prazos em aberto, riscos | "lê esse processo"

`capi-parecer` | Viabilidade e estratégia: teses, chance (alta/média/baixa), custos, parecer formal | "vale a pena entrar com essa ação?"

`capi-jurisprudencia` | Pesquisa jurisprudência com fonte oficial e link, nunca de memória | "o que o STJ entende sobre..."

`capi-prazos` | Calcula prazo processual com script (dias úteis CPC, recesso, feriados, dobro) | "quando vence?"

## Peças e documentos

Skill | Para que serve | Exemplo de pedido

`capi-peticao` | Redige peças: inicial, contestação, recursos, execução, MS, HC, trabalhistas, notificação | "faz a inicial"

`capi-contrato` | Elabora, revisa e compara contratos com semáforo de risco por cláusula | "revisa esse contrato"

`capi-revisor` | Banca de 3 revisores (juiz, parte contrária, formal). Modo DEFESA e modo ATAQUE | "revisa antes de protocolar"

`capi-timbrado` | Passa a peça para Word (.docx) no timbre do escritório, sem mudar o conteúdo | "coloca no timbrado"

## Audiência, tribunal e conteúdo

Skill | Para que serve | Exemplo de pedido

`capi-audiencia` | Prepara audiência: perguntas para testemunhas, preparo do cliente, faixas de acordo, sustentação oral | "tenho audiência amanhã"

`capi-tribunal` | Opera PJe/Eproc/e-SAJ/Projudi pelo navegador com travas: nunca assina nem protocola sozinho | "olha meu painel do PJe"

`capi-conteudo` | Conteúdo de redes sociais dentro das regras da OAB (Provimento 205/2021) | "me dá ideia de post"

---
[Abrir no Notion](https://app.notion.com/p/3ed30eaeef228178943fc619ad2be50b)
