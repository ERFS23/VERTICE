---
titulo: CAPI AGENTES - ADV
camada: biblioteca
area: juridico
genero: nota
atualizado: 2026-09-24
tags: notion
fonte: https://app.notion.com/p/3e530eaeef228005889fe4036c34f7ee
pasta_vertice: Notion / Páginas avulsas
origem: vertice
vertice_id: notion-3e530eaeef228005889fe4036c34f7ee
---
### Como funciona
Cada skill é um especialista. Você pode chamar pelo nome digitando `/capi-` e escolhendo na lista. Ou pode só descrever o que precisa ("chegou cliente novo", "quando vence esse prazo?") que o Claude escolhe o especialista sozinho.
**Por onde começar**
- **`/capi-socio`**: é a porta de entrada, o "sócio sênior". Você conta o problema, ele decide quais especialistas usar e conduz o caso do começo ao fim. Também faz a "reunião de segunda": revisa a pasta `casos/` e mostra os prazos e pendências de todos os casos.
- **`/capi-comece-aqui`**: tutorial para a primeira vez. Confere se tudo funciona, pergunta sua área, indica 3 agentes e faz um exercício com um caso fictício.
**O caminho normal de um caso**
1. **`capi-atendimento`**: transforma o relato bagunçado do cliente (WhatsApp, áudio, prints) em uma ficha do caso. A ficha tem linha do tempo, alertas de prescrição, documentos a pedir e uma mensagem pronta para o cliente.
2. **`capi-parecer`**: diz se vale a pena entrar com a ação, qual a chance, os riscos e a estratégia.
3. **`capi-honorarios`**: calcula quanto cobrar, monta a proposta com 3 opções e redige o contrato de honorários.
4. **`capi-jurisprudencia`**: pesquisa julgados sempre com link oficial, nunca de memória.
5. **`capi-peticao`**: primeiro propõe o esqueleto das teses. Depois redige a peça, com cada fato ligado a um documento numerado.
6. **`capi-revisor`**: três revisores atacam a peça (um juiz, o advogado da outra parte e um revisor de citações) e dão nota de 0 a 10. No modo ATAQUE, ele desmonta a peça do adversário.
7. **`capi-timbrado`**: passa o texto para o Word com o timbre do seu escritório.
**No dia a dia**
- **`capi-prazos`**: calcula o prazo com um programa (dias úteis do CPC, recesso, feriados) e mostra a contagem dia a dia.
- **`capi-processo`**: lê os autos e entrega o "raio-x" (resumo, prazos em aberto, riscos, próximos passos).
- **`capi-audiencia`**: prepara as perguntas às testemunhas, o seu cliente e a estratégia de acordo.
- **`capi-contrato`**: revisa ou redige contratos com um semáforo de risco por cláusula.
- **`capi-cliente`**: traduz decisões para o cliente, dá notícia ruim, cobra honorários e faz o relatório mensal.
- **`capi-conteudo`**: posts, carrosséis e Reels dentro das regras de publicidade da OAB.
**Proteção e automação**
- **`capi-anonimizador`**: troca nomes, CPF e outros dados por marcadores como `[PESSOA_1]` antes de o documento chegar à IA. No fim, devolve os dados reais no arquivo pronto. Tudo roda no seu computador. Use para respeitar o sigilo e a LGPD.
- **`capi-tribunal`**: opera o PJe, o Eproc e o e-SAJ pelo navegador. Por regra do próprio pack, ele nunca digita senha, nunca assina e nunca protocola: para na tela antes da assinatura.
- **`capi-criador-de-skills`**: cria novos agentes para as tarefas repetitivas do seu escritório.
**Uma dica**: trabalhe de dentro de uma pasta do escritório, com uma subpasta `casos/`. Assim as fichas e peças ficam salvas e o `capi-socio` consegue acompanhar tudo.
### Pontos de atenção
- Tudo que os agentes entregam é **minuta**. Confira lei, julgado, data e valor antes de usar.
- **Pandoc** não está instalado. É opcional: o `capi-timbrado` já gera o Word sozinho.
- Algumas skills se sobrepõem às que você já tinha. Por exemplo, `capi-conteudo` com `narrador-de-impacto`, e `capi-honorarios` com `adv-tech-complete-system`. Quando quiser uma específica, chame pelo nome.
- **Atualizar o pack**: basta substituir as pastas `capi-*`. Isso não mexe nas suas outras skills.
Quer que eu rode o `/capi-comece-aqui` agora para fazer o primeiro exercício com o caso fictício?

---
[Abrir no Notion](https://app.notion.com/p/3e530eaeef228005889fe4036c34f7ee)
