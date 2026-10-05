---
titulo: PROMPTS
camada: biblioteca
area: sistema
genero: nota
atualizado: 2026-09-25
tags: notion
fonte: https://app.notion.com/p/3de30eaeef228063b78cd12c955115ec
pasta_vertice: Notion / Planejamento de Conteúdo @serranoconteudo
origem: vertice
vertice_id: notion-3de30eaeef228063b78cd12c955115ec
---
### Notbook lm

- AUDIO - Preciso de um guia de estudo para essas matérias, focando em ser o mais detalhista possível e entender os conceitos e suas aplicações para a prova da UAB e provas da faculdade.

### AGENTES

# Time de agentes — Serrano Conteúdo
Meta que governa tudo: **R\$5.000/mês recorrente até dezembro de 2026**, vindo de mentoria (\~R\$500/mês) + produto de entrada de IA (prompts/skills).
Régua: 10 mentorias × R\$500 · ou 6 mentorias + 40 produtos de entrada × R\$50 · ou 6 mentorias + 10 pacotes × R\$200.
## Quem resolve o quê

Pedido | Agente

Preço, oferta, margem, meta, parceria, "vale a pena?", "como chego nos 5k" | `estrategista`

Responder lead, direct, objeção, follow-up, proposta, fechamento, meta do mês | `maquina-de-vendas`

Posicionamento, bio, pilares, calendário de 30 dias, funil, revisão de perfil | `plano-de-conteudo`

Roteiro de Reel, gancho, ideia de vídeo, análise de vídeo postado | `roteiro-viral-serrano` (já instalada)

Fluxo natural: `estrategista` define a oferta → `plano-de-conteudo` monta o mês → `roteiro-viral-serrano` escreve cada vídeo → `maquina-de-vendas` fecha no direct.
## Origem
Os três primeiros vêm da fusão otimizada de dois master prompts do usuário (persona Alfredo Soares + Estrategista com camadas Flávio Augusto e Tallis Gomes), separados por função para que o roteamento automático funcione, e calibrados com o contexto real do negócio.
## Contexto do negócio embutido nos agentes
- Elias Serrano · @serranoconteudo · Instagram + YouTube
- Mentoria mensal \~R\$500, poucos clientes ativos; dor declarada: achar clientes
- Ativos: plataforma própria de aulas, biblioteca de prompts/skills de IA, case de mentorado 43k → +10k seguidores em 3 semanas, papel de advisor de palestrante (30–40% de contrato \~R\$100k)

### SUPABASE

🔒 Conteúdo sensível (senhas/chaves) omitido do cérebro. Veja no Notion.

### RSSEND

🔒 Conteúdo sensível (senhas/chaves) omitido do cérebro. Veja no Notion.

### ROTERISTA

# Diretrizes de Roteiro v2 — Engenharia de Retenção
Atualização do Método Serrano com a engenharia de Kien Nguyen (@kienobifilms), Ava Yuergens (@personalbrandlaunch), Janaína Albuquerque (@janainaalbuquerque.adv), Thomas Goh (@gottagoh) e Filipe (ex-VianaBrands). Atualizado em 21/09/2026.
O v1 continua valendo: 8 formatos, 7 mecanismos de gancho, tabela cena a cena, pacote de postagem. O que segue **entra por cima** e corrige três buracos.
---
## Os três buracos do v1

Buraco | O que o v1 fazia | O que passa a fazer

**Gancho só verbal** | Escrevia a fala, o texto e o frame como três camadas soltas | Trata as três como **um gancho só**, com a visual mandando — a visão processa estímulo \~60.000× mais rápido que a audição

**Sem critério de modelagem** | "Modele um vídeo que viralizou" | **Regra dos Outliers**: só modela o que fez 5× a 100× a média do próprio perfil, em contas abaixo de 200k

**Sem o que fazer depois do acerto** | Cada roteiro era um evento isolado | **Doubling Down**: acertou, esgota o ângulo por 2 semanas antes de mudar de assunto

---
## 1. O gancho é tríplice (Kienobi)
Os três segundos iniciais têm três camadas simultâneas e **alinhadas**. Desalinhou, o cérebro rejeita e rola.
**Camada visual (10× mais forte que as outras):**
- Tela dividida — antes/depois já no frame 0
- Mostrar primeiro, explicar depois: segurar um objeto, apontar pra fora de campo, começar no meio de um movimento
- Quebra de padrão cinestésico: se todo mundo no nicho começa em pé falando na altura dos olhos, comece de baixo pra cima, ou de cima pra baixo, ou caminhando em direção à câmera pra sentar
- Resultado na frente: abre com o print do resultado, aí diz "veja como cheguei aqui"
**Camada verbal (fala + texto na tela):**
- **Especificidade vence poesia.** "Você não vai acreditar nisso" morre. "Foi por esta razão exata que o seu Reel morreu nos primeiros 3 segundos" prende — o cérebro confia em diagnóstico cirúrgico.
- **Text-audio alignment:** a palavra escrita grande na tela nos 2 primeiros segundos tem que ser **a mesma** que a boca está falando. Texto dizendo uma coisa e boca dizendo outra = atrito cognitivo = rolagem.
**Camada de áudio:**
- A trilha espelha o tom exato da mensagem — reflexivo pede synth etéreo ou piano; revelação técnica pede ritmo limpo e acelerado
- **Silêncio total nos 2 primeiros segundos** é a quebra de padrão mais violenta que existe, num feed onde todo vídeo abre gritando. A pessoa olha pra tela pra ver se o som do aparelho falhou.
- Foley diegético realçado: o clique da lente, a xícara na mesa, o teclado. Áudio é 50% do vídeo.
---
## 2. Arquitetura de script: Amplo → Estreito → Nichado (PBL)
O erro fatal do especialista técnico é abrir com gancho hiper-nichado. O algoritmo não entrega nem pra base própria, porque o abandono nos 2 primeiros segundos chega a 98%.

Bloco | Tempo | Função

**1. Gancho amplo** | 0–3s | Segura 100% da audiência casual. Qualquer ser humano no feed para pra ouvir. Alimenta o algoritmo com retenção alta.

**2. Valor estreito** | 3–25s | A técnica específica, o passo a passo, o dado útil pro ICP.

**3. CTA nichado** | 25–30s | Filtra curioso. Só converte quem tem poder de compra.

**Exemplo aplicado ao Direito:**
- **Amplo (0–3s):** "Ele viveu com duas mulheres por anos. As duas descobriram no velório." ← qualquer pessoa para
- **Estreito (3–25s):** a decisão do STF, o Tema 529, o que muda na pensão
- **Nichado (25–30s):** "Se você é advogado e trava na hora de postar por medo do Provimento 205, comenta ORDEM aqui embaixo."
O gancho amplo **não é clickbait** — ele é a porta larga pro mesmo conteúdo. A promessa tem que ser paga.
---
## 3. Escreva a última linha primeiro (Loop Perfeito)
Retenção acima de 100% vem do loop infinito: o vídeo termina e reinicia sem que a pessoa perceba o corte.
Método: **escreva a última frase do roteiro antes de tudo.** Ela conecta sintática ou conceitualmente com a primeira.
```plain text
Frame 0s  → "Esse é o maior erro que eu cometi como criador…"
Meio      → explicação
Frame 15s → "…e é exatamente por isso que você nunca deve esquecer que:"
[reinicia] → "Esse é o maior erro que eu cometi como criador…"
```
Um Reel de 9 segundos em loop perfeito puxa a retenção média pra 180–220%. O Instagram lê isso como conteúdo irresistível.
---
## 4. MAS / PORTANTO — nunca "E ENTÃO"
Amador empilha fatos em ordem cronológica com "e então": *"Comecei a postar e então não deu certo e então estudei edição e então melhorei."* Narrativa linear, zero tensão, abandono.
Profissional troca todo "e então" por dois conectivos:
- **MAS** — introduz conflito inesperado
- **PORTANTO** — introduz a consequência inevitável
*"Eu sabia fazer vídeo cinematográfico pra casamento. **MAS** toda vez que eu postava meu próprio trabalho, empacava em 200 views enquanto moleque com celular batia milhões. **PORTANTO** decidi trancar meu ego e dissecar frame a frame o que eles faziam diferente."*
**Ritmo musical:** frases todas do mesmo tamanho hipnotizam negativamente. Alterne curta e contundente com média e explicativa.
---
## 5. Regra dos Outliers — o que modelar
Pare de adivinhar. O mercado já revelou o que quer consumir.
1. Identifique 15 a 30 criadores do nicho **abaixo de 200k seguidores** (conta gigante distorce: ela tem tração de autoridade prévia, não mecânica de gancho)
2. Mapeie a visualização média da grade
3. Isole o que fez **5× a 100×** a média da conta
4. Salve numa Coleção do Instagram
5. Desconstrua: gancho visual (frame 0) + gancho verbal + cadência + áudio
6. Roube a mecânica, injete a sua história
7. Crie 3 variações de gancho e teste em Trial Reels
**A matemática:** média de 1.000 views e um vídeo fez 1.400? Ruído estatístico, ignore. Fez 5.000 (5×) ou 100.000 (100×)? Outlier inequívoco — o algoritmo testou fora da bolha e a retenção nos 3 primeiros segundos passou da linha de corte.
**Roube como cientista:**

Roubar | Nunca copiar

A mecânica do gancho | A fala literal, linha por linha

Abrir mostrando o resultado final em 0,5s | A história pessoal do outro

A frase que desafia o senso comum | A identidade visual da marca dele

O ritmo de corte, o ponto da revelação | Os números e opiniões dele

---
## 6. Doubling Down — o que fazer quando acerta
Erro da maioria: o vídeo explode, a pessoa comemora e **muda de assunto** no dia seguinte.
Postura correta: **monopolize o próprio sucesso.** Esgote o ângulo até os dados esfriarem.
Três formas de dobrar:
- **A — Variação mínima:** mantém 90% dos 7 componentes; troca só um detalhe do valor ou o gancho de abertura
- **B — Troca de variável:** mantém formato e estrutura exatos; troca a marca, o nicho ou o exemplo
- **C — Troca de formato:** mantém valor e script; muda o invólucro (talking head vira lousa, ou vira áudio + B-roll)
*Case real: um vídeo "Quanto você ganha sendo dono de um McDonald's" fez 9 milhões. Trocaram só a marca — Burger King, Subway, Krispy Kreme — e cada um fez centenas de milhares. Depois pegaram o mesmo áudio e regravaram em formato Áudio + B-roll: 10 milhões.*
Aplicado ao Caso Encerrado: se um caso de pensão explodir, as duas semanas seguintes são casos de pensão. Não é preguiça — é ler o dado.
---
## 7. Os 7 componentes de todo vídeo (checklist PBL)
Antes de gravar, cada um tem que estar decidido no papel:
1. **Gancho** — o que é visto, lido e ouvido em 0–3s
2. **Cenário** — a localização física, o contraste de iluminação, os adereços em cena
3. **Cadência** — velocidade de corte, punch-in digital de 10–15% a cada vírgula ou mudança de pensamento. Nenhum plano passa de 2,5s sem alteração perceptiva
4. **Valor** — o conteúdo tático, contra-intuitivo, aplicável. Régua de legibilidade de 5º ano — jargão vira palavra simples
5. **Formato** — a "pele" do vídeo (lousa, tela dividida, narração sobre B-roll, encenação)
6. **Gatilho emocional** — indignação com erro crônico, curiosidade sobre método secreto, ou ambição por resultado numérico comprovado
7. **CTA** — fechamento sem atrito, uma palavra-chave só
---
## 8. Produção: o banco de B-roll (Kienobi + Filipe)
**Postar todo dia não é gravar todo dia.**
Um bloco inegociável de 2 horas por semana → 15 a 30 planos sequenciais de 5 a 10 segundos da rotina real (estudando, andando, abrindo o notebook, anotando, fechando o caderno).
Ao longo do mês: pega um clipe de 7 segundos, aplica gancho visual em texto, escreve a reflexão na legenda, associa áudio atmosférico. **Menos de 5 minutos por post.**
**Gramática visual de uma sequência que conta história sem palavra:**
```plain text
Plano aberto (contexto) → Reação facial → Plano detalhe (ação) → Nova reação → Saída de cena
```
**Tríade de valor — um clipe, três destinos:** o mesmo B-roll de você editando vira entretenimento ("bastidores de tentar editar ignorando 40 mensagens no WhatsApp"), emoção ("a sensação solitária de postar por semanas achando que ninguém se importa") ou educação ("as 3 configurações que mudei"). O perfil nunca satura num estímulo só.
**Os 3 moldes do Filipe, pra carrossel:** A tipográfico (3 min) · B caderno na mesa (5 min) · C talking head (10 min). Ele não inventa layout, preenche molde. Por isso tem volume.
---
## 9. Matemática anti-perfeccionismo
**30 vídeos a 80% vencem 3 vídeos a 99%.**
30 posts geram 30 pontos de dado real no algoritmo, revelam 2 a 3 outliers e ensinam na prática o que retém. O perfeccionista que passa um mês polindo um vídeo não gera dado suficiente pra validar método nenhum — e quando o vídeo fracassa, desmotiva de vez.
"O algoritmo não premia o perfeito. Premia o postado."
---
## 10. CTA e conversão
**A regra:** um pedido só, palavra-chave única, entrega no mesmo dia.
- Nunca "comente sua opinião". Sempre "comenta **ORDEM**" — palavra específica dispara automação e filtra intenção
- Follower-gating: a DM chega com o material condicionado a um botão "já estou seguindo". Converte até 60% de espectador casual em seguidor
- **Stories é caixa registradora diária:** 1–2 prints de resultado, 1 reflexão de bastidor, 1 sticker de link ou enquete que aciona DM
**Limite do Serrano:** como estudante, sem promessa de resultado, sem caso como argumento de venda, sem honorário. O CTA de conversão é sempre pro problema (medo de postar, travar na Ordem), nunca pra solução jurídica.
---
## 11. Checklist final — antes de gravar
- [ ] A última linha foi escrita antes da primeira, e fecha o loop
- [ ] O gancho tem as três camadas alinhadas (visual, verbal, áudio) e o texto na tela é igual à fala
- [ ] O gancho é amplo o bastante pra qualquer pessoa no feed parar
- [ ] Tem um "MAS" e um "PORTANTO" no corpo — nenhum "e então"
- [ ] Nenhum plano passa de 2,5s sem mudança perceptiva
- [ ] Uma ideia só no vídeo
- [ ] Um pedido de ação só, com palavra-chave específica
- [ ] Nenhuma promessa de resultado, nenhum número inventado
- [ ] O vídeo fala com quem **compra**, não com colega de profissão
---
## Fontes desta atualização
- Documento Personal Branding — Kien Nguyen (@kienobifilms) e Ava Yuergens (@personalbrandlaunch)
- Análise de perfil — Thomas Goh (@gottagoh): storytelling visual do cotidiano, setup minimalista
- Modelagem — Janaína Albuquerque (@janainaalbuquerque.adv): caso real bate explicação de lei em 18×
- Modelagem — Filipe (ex-VianaBrands): carrossel-first, 3 moldes em loop
- Banco de 150 ganchos virais e 60 temas (Direito · Empreendedorismo · Vendas · Crescimento)
- Ver também: \[\[quadro-direito-playbook\]\] e \[\[time-de-agentes\]\]

### Claude code

🔒 Conteúdo sensível (senhas/chaves) omitido do cérebro. Veja no Notion.

### Serrano conteúdo

Aqui está a descrição dos produtos, organizada do jeito que você definiu: **Serrano Conteúdo como marca-mãe**, e as outras frentes como produtos que ficam debaixo dela.
# Ecossistema Serrano Conteúdo
**O que é:** a marca de Elias Serrano, o Nerd Vendedor. Ele pega o que é difícil (marketing, vendas, direito digital e tributário) e "serra" até ficar simples o bastante para o outro agir.
**Para quem:** dois públicos que se repetem em todas as frentes.
- **Criadores de conteúdo** com audiência que não se converte em renda, e que ao crescer passam a ter uma marca para proteger.
- **Pequenas e médias empresas** que já faturam, mas têm marketing fraco e pagam imposto sem saber se deveriam.
**Promessa da marca:** entender o seu público, vender o produto certo e proteger o que você construiu.
**O diferencial:** o Direito não é um nicho separado. Ele é o que o Serrano sabe e o criador comum de marketing não sabe: as regras que afetam quem vende pela internet.
## Produto 1: Mentoria Método RQC
**Nome completo:** Mentoria de posicionamento digital e conteúdo estratégico, Método RQC (Relacionamento, Qualificação, Conversão).
**O problema:** o criador tem seguidores, mas seguidor não é cliente. Ele posta sem saber o que o público quer, cria produto no escuro e, quando tenta vender, soa forçado.
**A virada:** o relacionamento vem antes da venda. O criador conversa com a audiência para entender do que ela precisa, e usa isso para decidir o conteúdo e o produto. A venda passa a ser consequência: o produto certo, para a pessoa certa, no momento certo.
**Os três pilares:**
- **Relacionamento:** conteúdo e DM usados para escutar a audiência, não só para anunciar.
- **Qualificação:** separar curioso de comprador e atrair seguidor com potencial de compra.
- **Conversão:** oferecer o que a audiência já pediu, sem empurrar.
**Formatos e preços (Vértice):**
- **Criadores:** R\$ 500/mês por 3 meses (R\$ 1.500). Perfil ideal: cerca de 10 mil seguidores ou mais, com tração e sem monetização.
- **Empresas:** R\$ 3.500 a R\$ 7.500/mês. O marketing fica com a Vértice, e vendas e liderança com o Gabriel Veik. Filtro: empresa com 10 a 15 funcionários ou mais e caixa de cerca de 10 vezes o investimento.
**Provas:** o criador que foi de 43 mil para 53 mil seguidores em 3 semanas; o vídeo próprio com 129 mil visualizações e cerca de 2 mil seguidores ganhos; o palestrante que vendeu cerca de R\$ 400 mil. Os cases são apresentados como histórico, nunca como garantia.
**Degraus de entrada:** Manual do Roteiro Viral (grátis), skill de roteiro a R\$ 47, curso de marketing, vendas e liderança, e Diagnóstico de Identidade.
## Produto 2: Proteção de Marca para Criadores
**O problema:** o criador constrói um nome, um perfil e um produto, mas não registra a marca. Um dia descobre que alguém registrou antes, ou que o próprio contrato de parceria o prejudica.
**A proposta:** conteúdo que mostra os riscos jurídicos de quem vende pela internet e conduz o criador até advogados especializados em registro de marca e direito digital.
**Por que ele compra de você:** você é o mesmo que o ajudou a crescer. O criador que sai da mentoria RQC com uma audiência maior é exatamente quem passa a ter uma marca que vale proteger.
## Produto 3: Revisão Tributária para PMEs
**O problema:** a empresa paga imposto sem saber se está no regime certo, se pagou a mais ou se tem crédito a recuperar.
**A proposta:** conteúdo educativo sobre repetição de indébito, regime tributário e planejamento lícito, que conduz o empresário até os escritórios tributários parceiros.
**Por que ele compra de você:** é o mesmo empresário da Vértice. Quem já confia em você para o marketing ouve quando você diz que talvez esteja pagando imposto demais.
## Como as frentes se conectam

Frente | Hoje | Depois da OAB

Serrano Conteúdo | Gera audiência e autoridade | Canal de captação do seu escritório

Mentoria RQC | Gera receita e cases | Continua como produto, ou vira sua porta de entrada para empresas

Marca e tributário | Encaminha para parceiros | Vira o seu próprio escritório de direito digital e tributário

Toda a estrutura existe para que, no dia da formatura, você já tenha público, reputação e clientes esperando.
## Um ponto que precisa ser resolvido antes da estratégia
A remuneração por comissão sobre cliente fechado é arriscada. O Estatuto da Advocacia proíbe captar causas, inclusive por meio de terceiros, e a participação de quem não é advogado nos honorários também é vedada. O risco cai sobre os escritórios parceiros agora, e pode atingir a sua própria reputação e inscrição quando você entrar na OAB. Isso seria o oposto do que a marca está construindo.
Uma saída que se encaixa no seu negócio: a Vértice presta **serviço de marketing jurídico** aos escritórios, com mensalidade fixa e conteúdo dentro das regras do Provimento 205/2021 da OAB. Você deixa de ser "captador" e passa a ser o especialista em conteúdo jurídico, o que fortalece o posicionamento. Vale confirmar esse desenho com os escritórios e com um professor de ética profissional antes de publicar qualquer coisa nessa frente.
Se você concordar com essa estrutura, o próximo passo é a estratégia: funil, formatos por camada e cadência. Quer que eu coloque essas descrições como uma nova aba no Dossiê do Nerd Vendedor, para ficar tudo num lugar só?

### Nerd vendedor

🔒 Conteúdo sensível (senhas/chaves) omitido do cérebro. Veja no Notion.

# Tudo que tenho
- 60 temas virais
- Formatos de vídeo que funcionam
- 150 Ganchos que funcionam
- Skil roterista
- Skil Editora de video
- Skil clipadora
- Prompt mestra para gerar os melhores artefatos
- Lições de engenharia de prompt
- Neuroaprendizagem e criação de metodos de estudo
- Técnicas de leitura e foco 
- Copyriter para advogados
- ARTEFATO - Roterista
- ARTEFATO - Linguagem para TCC
- ARTEFATO - Alfredo
- SKIL - analize de videos do instagram
- EXTENÇÃO - Analize de virais 
- Hospedagem de sites de graça - claude code
- METODO RQC - Relacionamento e funil
- Automação no MANYCHAT
- Página de vendas
- Pagina de captura
- Página da comunidade
- Auxilio no modo voz para otimização de tempo
- Criação de segundo cerebro com notebook lm
- Carteira de clientes sem o problema de esquecer qualquer detalhe
- gerador de oferta A partir de persona e produto
- Geração de persona
-

---
[Abrir no Notion](https://app.notion.com/p/3de30eaeef228063b78cd12c955115ec)
