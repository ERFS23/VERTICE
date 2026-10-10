/* Narrador de Impacto — banco oficial (Super Master Prompt v5) */
(function () {
  const PILARES = [
    { id: 'direito', nome: 'Direito', de: 1, ate: 15 },
    { id: 'empreendedorismo', nome: 'Empreendedorismo', de: 16, ate: 30 },
    { id: 'vendas', nome: 'Vendas', de: 31, ate: 45 },
    { id: 'crescimento', nome: 'Crescimento Pessoal', de: 46, ate: 60, pendente: true }
  ];

  const T = (nome, frase, nota) => ({ nome, frase, nota: nota || '' });
  const TEMAS_RAW = [
    // Direito 1–15
    T('O custo da omissão', 'O contrato que você não leu vai custar mais caro do que o advogado que você não contratou.', 'Casos de cláusula simples que destruíram empresas; o problema é a omissão antes do processo.'),
    T('Advogado estrategista', 'Advogado que só aparece no processo perdeu o jogo antes de entrar em campo.', 'Jurídico preventivo contra contencioso.'),
    T('Planejamento tributário lícito', 'O governo não cobra imposto do inteligente — cobra de quem não conhece a lei.', 'Regimes, créditos, estrutura.'),
    T('Recuperação de créditos', 'Você pode estar pagando imposto que a lei não exige — e ninguém te contou isso.', 'Não é golpe, é direito.'),
    T('A informalidade que quebra empresas', 'Palavra de amigo não vale nada numa mesa de negociação — vale papel assinado.', 'Ao usar: acordo de boca vale, o problema é provar.'),
    T('Holding e estruturação patrimonial', 'A holding que seu concorrente tem é o segredo que ele nunca vai te contar.'),
    T('Passivo trabalhista oculto', 'Cada funcionário sem contrato correto é uma bomba-relógio no seu balanço.'),
    T('Advocacia como negócio', 'A OAB te ensinou a ser advogado. Ninguém te ensinou a ser empresário do direito.'),
    T('Posicionamento e percepção de valor', 'O advogado mais caro da sua cidade não é o melhor — é o mais bem posicionado.'),
    T('LGPD de forma viral', 'Você aceita termos que nunca leu e entrega dados que valem mais do que sabe.'),
    T('Direitos do consumidor que você não usa', 'O consumidor brasileiro tem mais direitos do que qualquer vendedor quer que você saiba.'),
    T('Propriedade intelectual', 'Você criou, mas não registrou — então tecnicamente não é seu.'),
    T('Mediação e arbitragem', 'O melhor processo é o que nunca vai a juízo.'),
    T('Checklist jurídico de startup', 'Toda startup que quebrou tinha um problema jurídico que ignorou no começo.'),
    T('Modelos de honorários', 'Cobrar por hora é punir o cliente pela sua eficiência — e punir você pela sua lentidão.'),
    // Empreendedorismo 16–30
    T('Por que negócios quebram de verdade', 'Você não fracassou no negócio — você fracassou em entender que negócio é sobre pessoas.'),
    T('Esforço vs. alavancagem', 'Trabalhar mais não escala. Trabalhar certo, sim.'),
    T('Escolha de sócios', 'O pior dia da sua empresa pode ter sido o dia em que você escolheu seu sócio.'),
    T('Fluxo de caixa e margem real', 'Faturar R$1 milhão e não ter dinheiro no fim do mês é mais comum do que você imagina.'),
    T('Cobrar mais sem perder cliente', 'Você não perde cliente por preço alto — perde por não saber justificar o valor.'),
    T('O custo do bad hire', 'Contratar errado é mais caro do que não contratar.'),
    T('A armadilha da complacência', 'Quem não inova não quebra amanhã — quebra hoje sem perceber.'),
    T('Autoridade que não depende do CNPJ', 'Sua empresa pode sumir. Sua marca pessoal, não.'),
    T('Independência operacional', 'Você não tem empresa — você tem um emprego disfarçado de CNPJ.'),
    T('Networking antes de precisar', 'A próxima oportunidade da sua vida está na cabeça de alguém que você ainda não conhece.'),
    T('Crise e resiliência', 'Crise não cria caráter — ela revela.'),
    T('Validar antes de construir', 'A ideia que você acha genial provavelmente ninguém vai pagar para ter.'),
    T('A contra-intuição do nicho', 'Quanto mais específico você for, mais dinheiro você vai ganhar.'),
    T('Automação acessível', 'Você compete com profissionais que trabalham enquanto dormem — porque automatizaram.'),
    T('O bloqueio mental do crescimento', 'Pensar pequeno não é humildade — é limitação disfarçada de virtude.'),
    // Vendas 31–45
    T('Emoção precede lógica', 'As pessoas não compram o que precisam — compram o que sentem que precisam.'),
    T('O que "vou pensar" significa', 'Quando o cliente diz "vou pensar", ele está dizendo que você não convenceu.'),
    T('Nicho é dinheiro em vendas', 'Quem tenta vender para todo mundo não vende para ninguém.'),
    T('Follow-up', 'A venda que você perdeu foi para o concorrente que ligou depois de você.'),
    T('Escuta ativa', 'O melhor vendedor do mundo fala menos do que você imagina.'),
    T('Venda resultado, não processo', 'Você não vende serviço jurídico — você vende paz de espírito e segurança.'),
    T('Autoridade e fila de espera', 'Quem é percebido como autoridade não precisa convencer — precisa só apresentar.'),
    T('Persuasão ética', 'A diferença entre persuasão e manipulação é a intenção — e o resultado.'),
    T('Inbound', 'Você pode vender sem nunca fazer uma ligação fria — se souber criar conteúdo certo.'),
    T('Pare de competir por preço', 'Abaixar preço é o recurso de quem não sabe comunicar valor.'),
    T('Funil previsível', 'Você não tem problema de venda — você tem problema de processo.'),
    T('Retenção', 'Conquistar cliente novo custa 7x mais do que manter o que você já tem.', 'Número a conferir antes de usar.'),
    T('Indicações', 'Seu melhor vendedor não está na sua equipe — está na carteira de clientes satisfeitos.'),
    T('Alto ticket', 'Vender R$50 mil é mais fácil do que vender R$500 — se você souber para quem falar.'),
    T('Fechamento progressivo', 'O fechamento começa na primeira frase que você diz — não na última.')
  ];
  const TEMAS = TEMAS_RAW.map((t, i) => {
    const id = i + 1;
    const pilar = PILARES.find(p => id >= p.de && id <= p.ate).id;
    return Object.assign({ id, pilar }, t);
  });

  const FORMATOS = [
    { id: 'tela', nome: 'Tela Dividida', dur: [20, 45], oque: 'Dois vídeos ao mesmo tempo: você falando de um lado e um vídeo satisfatório do outro (gameplay, ASMR, corte de sabão).', porque: 'O duplo estímulo prende a atenção dispersa.', serve: 'Aula rápida, tutorial, explicação de regra.', regra: 'Erro a evitar: a metade satisfatória ficar mais interessante que a fala.' },
    { id: 'react', nome: 'React', dur: [15, 40], oque: 'Você reage a um vídeo que já viralizou, pela função Remix, e corrige ou analisa.', porque: 'Pega carona num vídeo que já provou que prende.', serve: 'Erro comum do nicho, mito jurídico, prática errada do mercado.', regra: 'Critica o método, nunca a pessoa. Print genérico ou encene a situação você mesmo.' },
    { id: 'novelinha', nome: 'Novelinha (Esquete)', dur: [20, 45], oque: 'Você interpreta 2 personagens ou mais, trocando posição, acessório ou enquadramento.', porque: 'Identificação imediata com a situação dolorosa ou absurda.', serve: 'Cliente contra profissional, marca contra criador, sócio contra sócio.', regra: 'No máximo 6 falas, com o conflito logo na primeira.' },
    { id: 'comparativo', nome: 'Comparativo', dur: [15, 35], oque: 'Certo e errado / antes e depois: dois cenários em contraste direto.', porque: 'Entrega valor sem exigir esforço pra entender.', serve: 'Jeito errado contra jeito certo, CPF contra CNPJ, 15,5% contra 6%.', regra: 'Mesmo enquadramento e mesma luz nos dois lados, começando pelo errado. Vermelho contra verde.' },
    { id: 'narrado', nome: 'Vídeo Narrado', dur: [30, 60], oque: 'Voiceover com B-roll: cenas bonitas de fundo e narração gravada por cima.', porque: 'A estética e a narrativa hipnotizam.', serve: 'História, bastidor, passo a passo estratégico.', regra: 'Takes de 2 a 4 segundos, e o primeiro take com movimento.' },
    { id: 'trend', nome: 'Trend com Texto', dur: [5, 8], oque: 'Áudio em alta, frase de impacto no centro e "leia a legenda".', porque: 'Enquanto a pessoa lê a legenda, o vídeo fica em loop e a retenção passa de 100%.', serve: 'Opinião impopular, alerta, verdade incômoda.', regra: 'A aula inteira vai na legenda.' },
    { id: 'conversa', nome: 'Conversa', dur: [15, 40], oque: 'Troca de mensagens de WhatsApp ou Direct, animada.', porque: 'Dá a sensação de espiar uma conversa privada.', serve: 'Negociação com cliente, marca propondo publi, sócio combinando de boca.', regra: 'De 6 a 10 mensagens, uma ideia por mensagem, virada na penúltima e sempre "simulação" na tela. Nunca é apresentada como print real.' },
    { id: 'lista', nome: 'Lista', dur: [20, 45], oque: 'Conteúdo numerado e fácil de escanear ("3 regras...", "5 erros...").', porque: 'Valor prático visível: é o formato com mais salvamento.', serve: 'Regras, erros, passos, ferramentas.', regra: 'Número anunciado no gancho e fixo na tela, com o melhor item guardado pro fim.' },
    // formatos importados do estudo de 20 Reels (set/2026)
    { id: 'contagem', nome: 'Lista com Contagem Revelada', dur: [20, 45], oque: 'Título fixo no topo e, no canto, a lista inteira numerada com os itens escondidos (*****). Cada item se revela, em destaque, quando é falado.', porque: 'A pessoa vê que faltam itens e fica até o fim pra ver todos: é um loop aberto visual.', serve: 'Banco de ganchos, erros, passos, ferramentas.', regra: 'Mostre a lista escondida desde o frame 0. Revele de baixo pra cima e guarde o melhor item pro fim.' },
    { id: 'cascata', nome: 'Pergunta e Resposta em Cascata', dur: [10, 25], oque: 'Uma pergunta curta na tela ("Como eu faço pra ter salvamento?") e a resposta em uma ou duas palavras ("Tutorial."), em sequência rápida. Pode ser com duas pessoas ou você nos dois papéis.', porque: 'O ritmo pergunta → resposta seca prende e entrega valor em segundos: dá vontade de salvar.', serve: 'Mapas rápidos (métrica → conteúdo, erro → correção, dúvida → resposta).', regra: 'Uma ideia por frase. A resposta sempre mais curta que a pergunta. Nada de explicação entre os pares.' },
    { id: 'niveis', nome: 'Ruim, Bom e Perfeito', dur: [20, 40], oque: 'A mesma situação em 3 níveis lado a lado: o jeito ruim, o bom e o perfeito.', porque: 'A comparação em escada mostra onde a pessoa está e o próximo degrau: identificação + aspiração.', serve: 'Frequência de post, jeito de cobrar, contrato, legenda, gancho.', regra: 'Mesmo enquadramento nos 3. Termine no perfeito, com o motivo em uma frase.' },
    { id: 'manchete', nome: 'Frase de Manchete', dur: [10, 30], oque: 'Uma frase ou dado apresentado com cara de notícia: citação entre aspas, fonte e legenda em estilo manchete.', porque: 'Parece informação quente e confiável; para o scroll de quem consome notícia.', serve: 'Lei nova, decisão, prazo, número oficial, frase de alguém conhecido.', regra: 'Só com fonte real e conferida na tela. Nunca invente citação.' },
    { id: 'relato', nome: 'Relato Íntimo', dur: [30, 60], oque: 'Você conta uma história de forma confessional, de perto, tom baixo, como se fosse pra uma pessoa só.', porque: 'Intimidade gera identificação e compartilhamento ("isso é o que eu não conseguia dizer").', serve: 'Bastidor, erro que custou caro, virada de chave, motivação.', regra: 'Só com história real. Câmera perto, um plano, sem trilha alta.' },
    { id: 'desafio', nome: 'Desafio Interativo', dur: [30, 60], oque: 'Você propõe um teste que a pessoa faz junto (cronômetro, quiz, "marque quantos você faz") e pede o resultado nos comentários.', porque: 'A pessoa fica até o fim pra saber o próprio resultado, e comentar vira a conclusão natural.', serve: 'Quiz de direitos, teste de conhecimento, autodiagnóstico do negócio.', regra: 'Instrução clara em uma frase. O CTA é pedir o resultado pessoal nos comentários, sem palavra-chave.' },
    { id: 'experimento', nome: 'Experimento ao Vivo', dur: [30, 45], oque: 'Você mostra um teste A/B real (dois ganchos, dois enquadramentos, dois preços) e promete o resultado em 72 horas.', porque: 'Gera curiosidade e um motivo concreto pra seguir e voltar: vira série.', serve: 'Testes de conteúdo, de oferta, de abordagem.', regra: 'Mude uma variável só. Mostre as duas versões lado a lado e marque a data da resposta.' },
    { id: 'curadoria', nome: 'Curadoria Regressiva com Prova', dur: [45, 75], oque: 'Título na tela, gancho e uma lista de 5 itens em contagem regressiva (o mais forte ou inesperado por último). Cada item mostra o formato, o print do vídeo original com as views visíveis, quem fez (@ na tela), um corte curto do original, por que funciona e como adaptar.', porque: 'Prova social em cada item: a pessoa vê o número real, não só ouve a opinião. É o formato que fez 140 mil views na série Reviralização.', serve: 'Curadoria de virais por tema (CTAs, storytelling, polêmicas, ângulos de câmera, collabs).', regra: 'De 7 a 12 s por item. Nenhum número sem fonte: sem print real, o item fica marcado [DADO REAL + FONTE] e não é gravado.' },
    { id: 'performatico', nome: 'Bastidor Performático', dur: [20, 45], oque: 'Você aparece trabalhando e resolvendo um problema real, ao vivo, em vez de explicar a teoria.', porque: 'A pessoa quer entender o método que você está usando: gera autoridade sem se gabar.', serve: 'Analisar um contrato, montar um roteiro, responder uma dúvida do direct.', regra: 'Mostre o processo, não a conquista. Uma situação real acontecendo desde o frame 0.' }
  ];

  // cat: id, nome, formatos (mapa oficial gancho → formato), gate da categoria, nota
  const C = (nome, hooks, opts) => Object.assign({ nome, hooks, formatos: [], gate: null, nota: '' }, opts || {});
  const CATS_RAW = [
    C('Curiosidade e Mistério', [
      'Ninguém te contou isso porque não é do interesse deles que você saiba.',
      'Eu descobri isso às 2 da manhã e não consegui mais dormir.',
      'Tem uma coisa que os melhores fazem que os medianos nunca percebem.',
      'Você vai assistir esse vídeo e nunca mais pensar da mesma forma.',
      'O que acontece depois que você faz isso... é o que ninguém mostra.',
      'Tem um padrão silencioso que separa quem cresce de quem fica parado.',
      'Eu estava errado sobre isso por anos. E provavelmente você também está.',
      'Por que as pessoas que mais estudam são as que menos aplicam?',
      'Esse detalhe invisível está sabotando tudo que você constrói.',
      'Antes de dormir hoje, você precisa saber disso.'
    ]),
    C('Dor e Identificação', [
      'Você trabalha muito, entrega tudo... e ainda sente que não avançou nada?',
      'Cansado de dar tudo num relacionamento e receber metade de volta?',
      'Você sabe o que fazer. Mas não consegue fazer. E isso te corrói por dentro.',
      'Quantas vezes você foi o mais esforçado da sala e o menos reconhecido?',
      'Ninguém fala sobre o quanto dói crescer enquanto as pessoas ao redor ficam paradas.',
      'Você já acordou sabendo exatamente o que precisa mudar... e não mudou nada?',
      'Existe uma solidão específica de quem tem sonhos grandes num círculo pequeno.',
      'Às vezes o maior problema não é falta de dinheiro. É falta de clareza.',
      'Você já perdeu um relacionamento por não saber se comunicar? Eu já.',
      'Trabalhar pra pagar conta não é propósito. E você sabe disso.',
      'Se você precisa de aprovação pra agir, esse vídeo é pra você.',
      'Sabe aquela sensação de estar construindo... mas não saber pra quê?',
      'Ninguém te ensinou a lidar com sucesso. Só com fracasso.',
      'Você quer crescer no Instagram mas posta e some. Esse é o problema.',
      'Relacionamento à distância não quebra pela distância. Quebra pelo silêncio.'
    ], { formatos: ['novelinha'], nota: 'Novelinha ou talking head direto.' }),
    C('Surpresa e Choque', [
      'Trabalhar mais está destruindo sua empresa. E você acha que é dedicação.',
      'O maior erro que você comete no Instagram é postar conteúdo de qualidade.',
      'Quanto mais você força um relacionamento, mais ele escapa.',
      'Deus não está atrasado na sua vida. Você é que está adiantado nos seus planos.',
      'Você não precisa de mais seguidores. Precisa de mais clareza.',
      'O funcionário mais barato da sua empresa pode ser o mais caro no longo prazo.',
      'A mulher incrível que você quer... já está te observando. O problema é outro.',
      'Consistência sem estratégia é só cansaço com boa aparência.',
      'O que te impede de crescer não é falta de conteúdo. É excesso de medo.',
      'Você está pedindo pra Deus mudar sua situação quando ele quer mudar você.',
      'Contratar errado custa mais do que não contratar. E a lei te prova isso.',
      'Postar todo dia sem estratégia é o caminho mais rápido para não crescer nunca.',
      'O algoritmo não é seu inimigo. Sua falta de clareza é.',
      'Amor não se prova com presença. Se prova com consistência.',
      'Você não está sem propósito. Está com medo do propósito que você já conhece.'
    ]),
    C('Autoridade e Credibilidade', [
      'Analisei 300 perfis que cresceram do zero no último ano. Aqui está o padrão.',
      'Depois de estudar Direito Empresarial por 4 anos, aprendi que a maioria ignora isso.',
      'Eu entrevistei casais que ficaram juntos mais de 10 anos. Todos disseram a mesma coisa.',
      'Fiz o que a maioria dos especialistas disse pra não fazer. Funcionou.',
      'Trabalhei com dezenas de empresas e o problema é sempre o mesmo.',
      'Estudei os maiores criadores do Brasil e eles cometem o mesmo erro básico.',
      'O TST já decidiu isso milhares de vezes. E sua empresa ainda ignora.',
      'Não sou guru de relacionamento. Mas errei o suficiente pra saber o que funciona.',
      'Aqui está o que 5 anos de criação de conteúdo me ensinaram em 60 segundos.',
      'Os gringos testaram isso por anos. Eu trouxe pra você em português.'
    ], { formatos: ['react', 'lista'], gate: 'fato', nota: 'Só com fato real.' }),
    C('Urgência e Escassez', [
      'Você tem exatamente 3 segundos pra decidir se vai crescer ou continuar onde está.',
      'Cada mês que você ignora isso, sua empresa acumula passivo trabalhista.',
      'A janela de ser early adopter no Instagram se fecha mais rápido do que você imagina.',
      'O relacionamento que você está negligenciando hoje pode não existir amanhã.',
      'Se você não definir seu propósito, o mercado vai definir por você.',
      'Toda semana sem estratégia no Instagram é uma semana que seu concorrente cresce.',
      'O prazo prescricional já está correndo. E você nem sabe disso.',
      'Você ainda tem tempo de corrigir isso. Mas não muito.',
      'A mulher incrível não espera você se preparar pra sempre.',
      'Cada dia sem propósito claro é um dia trabalhando pro sonho de outro.'
    ]),
    C('Provocação e Controvérsia', [
      'Opinião impopular: a maioria dos criadores de conteúdo não merece crescer ainda.',
      'Se você acha que seu funcionário é o problema, você é o problema.',
      'Relacionamento saudável não é aquele sem conflito. É aquele que resolve conflito.',
      'Não existe fé passiva. Ou você age ou está só esperando.',
      'Pare de culpar o algoritmo. O algoritmo só distribui o que as pessoas querem ver.',
      'Você não quer um relacionamento. Você quer uma ideia de relacionamento.',
      'A maioria das empresas no Brasil quebra por problema jurídico que custaria R$500 pra resolver.',
      'Seguidores não pagam conta. Posicionamento paga.',
      'Homem que não sabe se comunicar perde relacionamento. Sempre.',
      'Deus não vai abençoar o que você está carregando com as suas próprias forças.',
      'Todo mundo quer crescer no Instagram. Quase ninguém quer estudar o que funciona.',
      'Você não tem problema de gestão. Tem problema de liderança.',
      'Amor à distância não é mais difícil. É mais honesto.',
      'Consistência sem descanso não é disciplina. É autossabotagem.',
      'A empresa que não tem contrato bem feito está sempre à mercê do funcionário.'
    ], { formatos: ['trend', 'react'], nota: 'Opinião forte: Trend com Texto ou React.' }),
    C('Promessa de Valor Direto', [
      'Em 60 segundos você vai entender mais de Direito Trabalhista do que 80% dos empresários.',
      'Vou te dar 3 perguntas que você precisa fazer antes de assinar qualquer contrato.',
      'Aqui estão os 5 erros que destroem perfis no Instagram antes dos 1000 seguidores.',
      'Vou te mostrar como um casal a distância mantém conexão sem perder a chama.',
      '3 hábitos que separam quem tem propósito claro de quem vive no piloto automático.',
      'Isso aqui vale mais do que qualquer consultoria jurídica de R$500.',
      'O roteiro exato que eu uso pra criar um Reel que viraliza em 24 horas.',
      '5 sinais de que seu relacionamento está crescendo — não minguando.',
      'Como regularizar sua empresa em 3 passos sem gastar fortunas com advogado.',
      'O único exercício espiritual que mudou minha perspectiva sobre propósito.',
      'Vou te explicar o que é pejotização ilegal em menos de 1 minuto.',
      'A fórmula exata de gancho que usei pra bater 1 milhão de views.',
      'Como iniciar uma conversa com uma mulher incrível sem parecer desesperado.',
      '3 cláusulas que todo contrato de prestação de serviço precisa ter.',
      'O que fazer nos primeiros 30 dias de relacionamento à distância pra não perder a conexão.'
    ], { formatos: ['lista'] }),
    C('Storytelling e Jornada', [
      'Eu quase fechei minha empresa por um erro jurídico que eu poderia ter evitado com R$200.',
      'No dia que eu decidi parar de fingir que estava bem, minha vida mudou.',
      'Comecei a namorar a distância achando que ia durar 3 meses. Durou anos. Aqui está o porquê.',
      'No dia que eu postei meu primeiro Reel, tinha 47 seguidores. Hoje tenho isso.',
      'Tinha tudo pra dar certo na empresa. E deu errado. O Direito me explicou o porquê.',
      'Eu perdi a mulher mais incrível que já conheci por um erro que nunca mais cometo.',
      'Tinha 25 anos, sem direção, sem propósito. O que mudou tudo foi uma pergunta.',
      'No dia que parei de criar pra algoritmo e comecei a criar pra pessoa, tudo mudou.',
      'Recebi uma notificação de processo trabalhista numa segunda-feira de manhã. Aprendi tudo na força.',
      'O dia que Deus fechou uma porta que eu implorava pra abrir foi o melhor dia da minha vida.'
    ], { gate: 'fato', nota: 'Só com história real.' }),
    C('Números e Dados', [
      '58% das empresas brasileiras têm até 5 funcionários. E quase todas ignoram isso.',
      'Um processo trabalhista médio custa R$42 mil. Evitar custa R$300.',
      'Perfis que postam com consistência por 90 dias crescem em média 340% mais.',
      '70% dos relacionamentos à distância terminam por falta de rotina juntos. Não por distância.',
      'Empresas que regularizam contratos reduzem passivo trabalhista em até 80%.',
      'Os primeiros 3 segundos do seu vídeo determinam 90% da retenção. Aqui está o porquê.',
      'R$1 bilhão. É o que o INSS gasta por ano com afastamentos por saúde mental no Brasil.',
      'Casais que definem expectativas nos primeiros 30 dias têm 60% menos conflitos.',
      'Os 5% de criadores que crescem de verdade fazem uma coisa diferente. Apenas uma.',
      'Uma cláusula mal redigida pode invalidar um contrato de R$500 mil. Acontece todo dia.'
    ], { gate: 'numero', nota: 'Todo número conferido antes de usar.' }),
    C('Mito vs. Realidade', [
      'Todo mundo acha que mais seguidores = mais dinheiro. A realidade é outra.',
      'Mito: CLT protege só o funcionário. Realidade: protege os dois quando bem aplicado.',
      'Todo mundo acha que relacionamento à distância é condenado. Os dados dizem o contrário.',
      'Mito: fé é esperar. Realidade: fé é agir sem ver o resultado ainda.',
      'Todo mundo fala em autenticidade no Instagram. Quase ninguém sabe o que isso significa.',
      'Mito: empresa pequena não precisa de contrato. Realidade: empresa pequena precisa mais.',
      'Todo mundo acha que o parceiro perfeito resolve seus problemas. Ele amplifica quem você já é.',
      'Mito: postar menos vezes gera mais qualidade. Realidade: consistência gera qualidade.',
      'Todo mundo acha que propósito é descoberto. Na verdade, é construído.',
      'Mito: terceirizar é sempre mais barato. Realidade: depende do contrato. E você provavelmente não tem o certo.'
    ], { formatos: ['comparativo', 'lista'] }),
    C('Série e Continuidade', [
      'Semana 1 da minha jornada pública no Instagram. Vou mostrar tudo. Inclusive os números.',
      'Parte 2: o que ninguém te conta sobre crescer no Instagram depois dos 10 mil.',
      'Dia 30 da jornada. O que funcionou, o que não funcionou e o que vem a seguir.',
      'Série: Direito que todo empresário deveria saber. Episódio 1: contratos.',
      'Continuando a série de relacionamento à distância: semana 4. O que mudou.',
      'Se você perdeu o episódio 1 dessa série, comece por lá. Hoje vem a parte mais importante.',
      'Update semanal: crescimento, erros e o que eu aprendi essa semana criando conteúdo.',
      'Série: 30 dias tentando construir uma rotina com propósito. Dia 15.',
      'Episódio final da série de Direito Trabalhista. O mais importante ficou pra agora.',
      'Parte 3 da série de como encontrar uma mulher incrível sem ser desesperado.'
    ]),
    C('Reflexão e Propósito', [
      'E se o que você chama de fracasso for exatamente o que precisava acontecer?',
      'Tem uma diferença enorme entre ter fé e ter confiança. E ela muda tudo.',
      'A vida que você quer exige uma versão sua que ainda não existe. Você está construindo ela?',
      'O que você faz quando ninguém está olhando define quem você se torna quando todo mundo olha.',
      'Parei de pedir pra Deus mudar minha situação. Comecei a pedir pra me mudar. Isso transformou tudo.',
      'Tem uma versão sua que já sabe o que fazer. O problema é que você ainda não confia nela.',
      'O silêncio de Deus às vezes é a resposta mais poderosa que você pode receber.',
      'Você não está atrasado. Está sendo preparado. Mas preparação exige que você apareça.',
      'Construir algo do zero, com fé e sem garantia, é o maior ato de coragem que existe.',
      'Existe uma paz específica em saber que está no caminho certo. Mesmo sem ver o destino.'
    ], { nota: 'Sem CTA de venda. Tom baixo.' }),
    C('Relacionamentos', [
      'A mulher incrível não quer perfeição. Ela quer presença real.',
      '3 coisas que casais que duram décadas fazem diferente dos que duram meses.',
      'Relacionamento à distância tem um inimigo invisível. E não é a distância.',
      'Como saber se uma mulher está interessada em você sem precisar adivinhar.',
      'O erro que a maioria dos homens comete no início do relacionamento sem perceber.',
      'Comunicação em casal não é sobre falar mais. É sobre ouvir diferente.',
      'Como manter atração num relacionamento longo sem forçar romanticismo falso.',
      'O que uma mulher incrível observa em você antes de decidir se fica ou vai embora.',
      'Relacionamento saudável não é ausência de briga. É presença de respeito.',
      'Você não precisa de um relacionamento perfeito. Precisa de um real.'
    ], { nota: 'Fora do pilar principal: use só se o ângulo pedir.' }),
    C('Sentença de Contraste', [
      'O governo não cobra imposto do inteligente — cobra de quem não conhece a lei.'
    ], { formatos: ['lista'], nota: 'Frase curta em duas partes que inverte quem é punido ou premiado. Dita seca, sem sorrir, metades em cores opostas. Talking head seco com Lista.' }),
    C('Controversos', [
      'Eu sei que vou levar hate por dizer isso, mas...',
      'Me disseram que eu nunca ia conseguir. Olha o que aconteceu.',
      'Se você acha que isso é loucura, você está certo.',
      'A verdade impopular que ninguém quer admitir.',
      'Isso vai incomodar algumas pessoas.',
      'Eu não sigo as \'regras\', e foi a melhor decisão que já tomei.',
      'Vamos abrir o jogo sobre a realidade de [X].',
      'As pessoas estão começando a perceber que [afirmação estranha].'
    ], { formatos: ['trend', 'react'] }),
    C('Intriga e Tensão', [
      'Eu não deveria contar essa história. Mas aqui estamos.',
      'Tudo começou com um \'não\'.',
      'O que ninguém viu por trás daquela foto.',
      'Se você tivesse me dito isso há um ano, eu teria caído na gargalhada.',
      'Você não vai acreditar em quem eu conheci no lugar mais inesperado.',
      'Você nunca vai adivinhar o que aconteceu quando eu disse sim pra isso.',
      'Eu não estava preparado para o que disseram a seguir.',
      'Começou como o melhor dia da minha vida. Até isso acontecer.',
      'Eu mal sabia que isso mudaria tudo.',
      'Eu tinha cinco segundos para decidir. E escolhi errado.',
      'A sala ficou em silêncio e todo mundo me olhou.',
      'Quando eu estava prestes a desistir, algo absurdo aconteceu.'
    ], { formatos: ['conversa', 'narrado'], gate: 'fato', nota: 'Todos são de história: só com fato real.' }),
    C('Emocionais', [
      'Se você já sentiu vontade de desistir, isso é pra você.',
      'Eu chorava até dormir por causa de uma coisa.',
      'Eu não cresci com dinheiro nem com conexões, mas eu tinha isso.',
      'Eu fiquei tão envergonhado que quase deletei esse post.',
      'Olhando pra trás, mal acredito que foi aqui que tudo começou.',
      'Eu achei que o sucesso fosse ter outro gosto.'
    ], { formatos: ['novelinha', 'narrado'] }),
    C('Lição e Erros', [
      'Esse erro me custou meses de progresso.',
      'O melhor conselho que eu já ignorei. No começo.',
      'O que ninguém te conta sobre alcançar seus objetivos.',
      'O dia em que percebi que eu era meu maior obstáculo.',
      'Essa foi a escolha mais assustadora e mais inteligente da minha vida.',
      'Uma decisão. Só isso bastou.',
      'Todo mundo te fala [X], mas ninguém te diz o porquê.',
      'Explicando [assunto difícil] para uma criança de 5 anos.'
    ], { formatos: ['comparativo', 'lista'] }),
    C('Velocidade e Resultado Rápido', [
      'É possível [resultado difícil] em [tempo extremamente curto]?',
      'Aqui eu ensino todo dia a como criar conteúdo que funciona no modo preguiça... me segue e aprenda comigo.',
      'Em 60 segundos você vai entender mais de [tema] do que 80% das pessoas.',
      'Vou te dar [X] em menos de 1 minuto. Sem enrolação.'
    ], { formatos: ['tela', 'lista'] }),
    // --- a partir daqui: conhecimento importado do estudo de 20 Reels (@nicolaswalterorganico, set/2026) ---
    C('Curiosidade Curta (open loop)', [
      'Ninguém te contou isso.',
      'Você está fazendo isso errado.',
      'Isso mudou tudo pra mim.',
      '[X] não vai resolver o teu [Y].',
      'Aqui está o que ninguém te contou.',
      'Eu quase não publiquei isso.',
      'Assista isso antes de [X].',
      'Este é o seu sinal pra [X].',
      'Eu queria que alguém tivesse me contado isso antes.',
      'Você precisa ouvir isso.',
      'Ninguém fala sobre isso.',
      'Eu queria ter descoberto isso antes.',
      'Pare por 1 segundo.',
      'Você já percebeu esse padrão?',
      'Aqui vai uma verdade.',
      'Deixa eu poupar horas do seu tempo.',
      'Isso pode te surpreender.',
      'Você precisa disso agora.',
      'Talvez você não concorde com isso.',
      'Eu acabei de descobrir isso.'
    ], { formatos: ['trend', 'lista', 'contagem'], nota: 'Frases de 4 a 6 palavras que abrem a curiosidade sem revelar o assunto. Funcionam como primeira frase de qualquer vídeo; a frase de identificação dos 3 a 7 segundos é que diz do que se trata.' }),
    C('Moldes de Gancho [complete]', [
      'Existe um detalhe que separa quem consegue [resultado] de quem continua [problema]. E quase ninguém percebe isso.',
      'Se você ainda faz [comportamento comum], pode estar sabotando [resultado] sem perceber.',
      'Antes de [ação], presta atenção nisso. Esse erro pode estar te fazendo perder [benefício].',
      'Você não precisa de [o que todo mundo acha necessário] pra conseguir [resultado]. Você precisa disso aqui.',
      'Se você já tentou [ação] e mesmo assim continua [frustração], esse vídeo é pra você.',
      'Depois de analisar [número] casos de [tema], eu percebi que um padrão se repete em quase todos.',
      'O que as pessoas que conseguem [resultado] não te contam sobre [tema] é isso.',
      'Pare de tentar [X] por alguns segundos e escute isso.',
      'Tem uma mentira sobre [X] que todo mundo acredita.',
      'Ninguém percebe isso até ser tarde demais.',
      'Isso explica por que algumas pessoas conseguem e outras não.',
      'Talvez você esteja ignorando a parte mais importante.',
      'Você está a uma mudança de distância de transformar seus resultados.',
      'A maioria das pessoas faz exatamente o contrário do que deveria.',
      'O segredo não está em fazer mais. Está em entender isso.',
      'Quanto antes você entender isso, mais fácil tudo fica.',
      'Você não tem um problema de [X]. Você tem um problema de [Y].',
      'A maioria das pessoas não percebe que é por isso que você ainda está [situação].',
      'Isso vai mudar a forma como você vê [tema].',
      'Aprendi isso tarde demais.',
      'Aqui está a verdade sobre [tema].',
      'Evite [erro] quando você estiver [situação].',
      'Esse é o verdadeiro motivo pelo qual você ainda está [situação].',
      'Se eu tivesse que começar de novo [atividade]...',
      'Se você é [público], escute com atenção.'
    ], { formatos: ['lista', 'contagem'], nota: 'Nome técnico → molde: curiosidade, alerta, urgência, desconstrução, identificação, autoridade, bastidor, causa invisível, arrependimento, aviso, revelação, chamada direta. Só o que está entre [colchetes] muda.' }),
    C('Crença Invertida (não é X, é Y)', [
      '[X] é caro? [Y] é muito mais caro.',
      'Esse erro você só percebe depois que [consequência].',
      '[X] não é luxo. É o que [protege ou economiza] no fim.',
      '[Sintoma] não é [causa que todo mundo culpa]. É [causa real].',
      'Você não tá sem [resultado]. Tá sem [causa real]. E tem solução.',
      'O [passo] que você pula é o que te [prejudica].',
      'Você faz [X] errado e culpa [Y].',
      '[Mito em forma de pergunta]? A resposta incomoda.',
      'O que você já pagou de [custo recorrente], [comprava ou resolvia algo maior].'
    ], { formatos: ['comparativo', 'lista', 'niveis'], nota: 'Crença comum → reversão, ou consequência tardia que ninguém vê. Gera desconforto específico da dor do público. Troque a descrição técnica por benefício ou perda vivida, concreta e visual.' })
  ];

  // notas e travas por gancho (do banco oficial)
  const NOTAS = {
    7: { gate: 'fato', nota: 'Só com história real.' },
    42: { nota: 'Ajustar o tempo ao real.' },
    49: { nota: 'Ajustar o tempo ao real.' },
    67: { gate: 'numero', nota: 'Número sem fonte: não usar até confirmar.' },
    76: { soft: 'numero', nota: '"80%" é número: confira ou troque de gancho.' },
    81: { soft: 'numero', nota: 'Valor de referência: confira antes de usar.' },
    87: { gate: 'fato', nota: 'Só se for real.' },
    153: { gate: 'fato', nota: 'Só com história real.' },
    173: { gate: 'fato', nota: 'Só com história real.' },
    174: { gate: 'fato', nota: 'Só com história real.' },
    178: { gate: 'fato', nota: 'Só com erro real.' },
    188: { soft: 'numero', nota: '"80%" é número: confira ou troque de gancho.' },
    192: { nota: 'Pessoal: diga o que mudou de verdade.' },
    195: { nota: 'Pessoal: só se for verdade.' },
    215: { gate: 'fato', nota: 'Autoridade: só com a análise real (quantos casos, de quê).' },
    219: { nota: '' },
    233: { nota: 'Experiência: só com a sua trajetória real.' }
  };

  const CATS = [];
  const GANCHOS = [];
  let n = 0;
  CATS_RAW.forEach((c, i) => {
    const cat = { id: i + 1, nome: c.nome, formatos: c.formatos, gate: c.gate, nota: c.nota, de: n + 1 };
    c.hooks.forEach(texto => {
      n++;
      const extra = NOTAS[n] || {};
      GANCHOS.push({
        id: n, cat: cat.id, texto,
        gate: extra.gate || c.gate || null,
        soft: extra.soft || null,
        nota: extra.nota || '',
        colchete: /\[[^\]]+\]/.test(texto)
      });
    });
    cat.ate = n;
    CATS.push(cat);
  });

  const MAPA = [
    ['Controverso / opinião forte', 'Trend com Texto ou React'],
    ['Intriga e tensão', 'Conversa ou Vídeo Narrado'],
    ['Emocional / vulnerabilidade', 'Novelinha ou Vídeo Narrado'],
    ['Lição e erro / Mito vs. Realidade', 'Comparativo ou Lista (maior salvamento)'],
    ['Autoridade e credibilidade', 'React ou Lista'],
    ['Dor e identificação', 'Novelinha ou talking head direto'],
    ['Promessa de valor direto', 'Lista'],
    ['Velocidade e resultado rápido', 'Tela Dividida'],
    ['Sentença de contraste', 'Talking head seco com Lista'],
    ['Curiosidade curta (open loop)', 'Trend com Texto, Lista ou Contagem Revelada'],
    ['Moldes de gancho [complete]', 'Lista ou Contagem Revelada'],
    ['Crença invertida (não é X, é Y)', 'Comparativo, Lista ou Ruim, Bom e Perfeito']
  ];

  /* ---------- Manual do viral: regras e conhecimentos (estudo de 20 Reels, set/2026) ---------- */
  const MANUAL = [
    { id: 'metrica', titulo: 'Cada métrica pede um tipo de conteúdo', itens: [
      ['Salvamento', 'Tutorial: conteúdo útil, "como fazer", que a pessoa vai querer consultar depois.'],
      ['Curtida', 'Opinião: posicionamento claro sobre um assunto do nicho.'],
      ['Comentário', 'Assunto mais comentado do momento, ou uma pergunta cujo resultado é pessoal (teste, quiz).'],
      ['Compartilhamento', 'Motivação ou algo que a pessoa sente mas não conseguiria dizer sozinha: ela manda pra alguém dizer por ela.'],
      ['Seguidor', 'Promessa específica do próximo vídeo: o próximo problema que a pessoa vai ter depois de aprender este.']] },
    { id: 'cta', titulo: 'CTA do próximo problema', itens: [
      ['Erro', 'Terminar com "me segue pra mais dicas": a pessoa não tem motivo pra seguir.'],
      ['Passo 1', 'Depois de entregar o conteúdo, pense: qual é o próximo problema que essa pessoa vai ter depois de aprender isso?'],
      ['Passo 2', 'Transforme esse próximo problema no CTA: "Agora que você já sabe X, me segue porque no próximo vídeo eu te mostro Y."'],
      ['Princípio', 'A pessoa não segue porque você pediu. Segue porque você deu um motivo específico pra ela querer ver o próximo.']] },
    { id: 'abertura', titulo: 'Aberturas que matam o vídeo (e o que fazer no lugar)', itens: [
      ['"Olá, pessoas que me seguem" / "fala galera"', 'Mostre uma situação real acontecendo desde o primeiro segundo.'],
      ['"Meu nome é... eu sou..."', 'Comece pela perda ou pelo ganho de quem assiste: "O que você já pagou de aluguel aqui, comprava uma casa."'],
      ['Descrição técnica ou adjetivo vago ("conforto e sofisticação")', 'Benefício vivido, concreto e visual: "Você vai ganhar 1 hora a mais de sono por dia morando aqui."'],
      ['Falar das suas conquistas', 'Explicar como chegou nelas: processo, não resultado.'],
      ['Ser técnico demais logo de cara', 'O técnico fica pro curso ou pra mentoria; o Reel abre pela dor.'],
      ['Polêmica todo dia', 'Misture: nem todo vídeo precisa ser treta.']] },
    { id: 'copiar', titulo: 'O que copiar de um vídeo viral', itens: [
      ['Copie', 'A estrutura (não as frases), o tipo de gancho (não o assunto), a velocidade da entrega, a ordem dos argumentos, o contraste do começo, a emoção que o vídeo desperta, a dúvida mantida aberta até o fim, o formato visual e o tipo de CTA.'],
      ['Adapte', 'Transforme tudo num conteúdo que só faria sentido dentro do seu nicho.']] },
    { id: 'feio', titulo: 'Por que vídeo "ruim" viraliza', itens: [
      ['1', 'Viralizar não é prêmio pela qualidade da edição.'],
      ['2', 'Uma ideia forte vale mais que uma câmera cara.'],
      ['3', 'Vídeo simples gera mais identificação; produção demais parece anúncio.'],
      ['4', 'A primeira frase importa mais que o cenário; clareza prende mais que efeito especial.'],
      ['5', 'As pessoas compartilham o que provoca reação. O Instagram mede o comportamento de quem assiste, não a beleza.']] },
    { id: 'tom', titulo: 'Tom de voz por público', itens: [
      ['Homens', 'Direto, competitivo, simples, rápido, visual, mexendo com ego e status.'],
      ['Mulheres', 'Emocional, detalhado, estético, acolhedor, identificável, aspiracional.'],
      ['Quem busca imóvel', 'Urgente, seguro, visual, prático, confortável, mexendo com sonho e status.'],
      ['Fitness', 'Intenso, visual, disciplinado, transformador, energético, comparativo.'],
      ['Quem quer aprender uma habilidade', 'Motivador, simples, progressivo, prático, possível, divertido.']] },
    { id: 'visual', titulo: 'Templates visuais baratos que funcionam', itens: [
      ['Card fixo + card dinâmico', 'Título fixo no topo o vídeo inteiro; embaixo, um card que troca a cada item numerado.'],
      ['Contagem revelada', 'Lista com os itens escondidos no canto, revelados um a um.'],
      ['Card único central', '"Gancho 01:", "Gancho 02:"... um card que é substituído a cada item.'],
      ['TV ou cartaz físico em cena', 'Slides numa TV ou cartaz impresso atrás de você, com ❌ erro / ✅ acerto: dispensa motion.'],
      ['Print de referência', 'Um print de outro Reel flutuando acima da sua cabeça como prova do que você está ensinando.'],
      ['Duas cenas', 'Corpo do vídeo num cenário e CTA gravado em outro: grave vários CTAs de uma vez e reaproveite.']] },
    { id: 'stories', titulo: 'Stories todos os dias, sem roteiro', itens: [
      ['Saiu de casa', 'Grave o caminho e poste com uma frase.'],
      ['Chegou no trabalho', 'Mostre o ambiente e como vai ser a rotina hoje.'],
      ['Fazendo uma tarefa', '10 a 15 segundos do que está acontecendo, com música.'],
      ['Dúvida no direct', 'Print da pergunta e resposta nos Stories: a dúvida de um é a de todos.'],
      ['Teve um resultado', 'Poste, mesmo pequeno: "Quem quiser o mesmo, me chama aqui agora."'],
      ['Cliffhanger em 2 atos', 'Poste só "Deu ruim." e suma por algumas horas. Volte com "Deu ruim, mas foi a melhor coisa que podia ter acontecido" e conte a história de virada.']] },
    { id: 'serie', titulo: 'Um molde, muitos vídeos', itens: [
      ['Por nicho', 'Pegue um molde que funcionou (ex.: "7 ganchos pra X") e refaça pra cada público que você atende.'],
      ['Em lote', 'Grave vários vídeos na mesma sessão, com o mesmo cenário e figurino; troque só o card.'],
      ['Isca por palavra-chave', 'Uma palavra fixa pra cada material (ex.: ROTEIRO, BANCO, AULA), entregue no direct no mesmo dia.']] },
    { id: 'teste', titulo: 'Teste A/B de conteúdo', itens: [
      ['Hipótese', 'Uma variável só: gancho, enquadramento, cenário, duração ou CTA.'],
      ['Método', 'Poste as duas versões e compare depois de 72 horas.'],
      ['Registro', 'Anote os números das duas na Biblioteca: o app aprende com o resultado.']] },
    // módulo importado de um segundo Reel estudado (@peter.visuals, set/2026): a fórmula de retenção do meio do vídeo
    { id: 'retencao', titulo: 'A fórmula: Gancho → Promessa → Valor → Loop → Valor → Loop → Valor → CTA', itens: [
      ['Gancho', 'Para o scroll (o gancho literal do banco).'],
      ['Promessa', 'Diz exatamente o que a pessoa ganha se ficar até o fim — o resultado, não o assunto.'],
      ['1ª entrega de valor', 'A primeira parte da solução, de verdade, cumprindo um pedaço da promessa.'],
      ['Loop aberto #1', 'Antes da pessoa pensar em sair, prometa mais sem dizer o quê: "Mas tem mais uma coisa." / "Só que tem um detalhe."'],
      ['2ª entrega de valor', 'Mais solução, aprofundando.'],
      ['Loop aberto #2', 'Segunda isca de curiosidade, no próximo ponto natural de saída: "E é aqui que a maioria erra." / "Mas o pior vem agora."'],
      ['Valor final + CTA', 'A última entrega, a mais forte, seguida do CTA — nunca o CTA antes do último valor.'],
      ['Por que funciona', 'Cada loop entra exatamente onde a pessoa pensaria em sair, e é sempre pago antes do fim: a retenção vem de prometer "mais uma coisa" de novo e de novo.']], fonte: 'Reel de @peter.visuals (set/2026)' }
  ];
  MANUAL.forEach(m => { if (!m.fonte) m.fonte = 'Estudo de 20 Reels de @nicolaswalterorganico (set/2026)'; });

  /* ---------- Séries prontas: briefing "Reviralização" (5 vídeos, segunda a sexta) ---------- */
  const SERIE_REGRAS = `BASE DE TODOS OS VÍDEOS DA SÉRIE:
- Estrutura: título na tela, gancho, lista de 5 itens em contagem regressiva (o mais forte ou inesperado por último) e fechamento.
- Gancho: uma frase curta e direta que prende no primeiro segundo. O texto já aparece na tela no primeiro quadro, sem apresentação.
- Duração: de 45 a 75 segundos, com 7 a 12 segundos por item.
- Cada item precisa ter: (1) o nome do formato em uma frase; (2) o print do vídeo original com o contador de views visível, e os comentários quando houver; (3) a foto ou o perfil de quem fez, com o @ na tela; (4) um corte de 3 a 5 segundos do original; (5) uma explicação de por que funciona; (6) uma linha de como adaptar.
- Dados: nenhum número sem fonte. Os números do arquivo IDEIAS.docx (18M, 14M e outros) foram inventados e NÃO podem ser usados. Se faltar o print real de um item, marque [DADO REAL + FONTE] naquele item e avise que ele não deve ser gravado.
- Linguagem: dizer "fez X views", nunca "gerou X". Nada de promessa de resultado.
- Palavra-chave nos comentários: pedir só depois dos primeiros 10 a 15 segundos; repetir no fim; só usar se o criador tiver uma entrega real no direct (automática ou manual) no mesmo dia.
- Fechamento: bordão fixo do criador, convite para seguir e palavra-chave.`;
  const SERIE = {
    id: 'reviralizacao', nome: 'Reviralização', sub: 'Série de 5 vídeos de curadoria, de segunda a sexta. O original fez 140 mil views no Instagram: lista numerada, print das views como prova social e exemplo visual em cada item.',
    eps: [
      { id: 'seg', dia: 'Segunda', titulo: 'CTAs que convertem', gancho: 'Para de copiar gancho viral. Se o CTA for fraco, a view não vira lead nenhum.', ganchoAlt: 'Gancho viral sem CTA bom é só view, não é lead.',
        itens: [
          '5º — @sandraconsuelly (2,9 mil seguidores): 1,7 milhão de views. CTA: comentar uma palavra e tocar em "ver tradução". Gatilho: curiosidade. Dizer que só gera comentário, não lead.',
          '4º — @felipemilani_ (96 mil): 556,8 mil views. CTA: "Coloca seu @ aqui". Gatilho: ajuda personalizada com ação mínima.',
          '3º — @yra.diniz (28,4 mil): 177,6 mil views. CTA: "Comenta qual é o seu NICHO que eu adapto essas 5 frases pra você". Gatilho: entrega sob medida.',
          '2º — @_boladecristal (343,6 mil): 348,6 mil views. CTA: "Escreva AULA nos comentários". Os reels com "Escreva CHAT" fizeram 692 comentários em 26 mil plays. Gatilho: isca gratuita com uma palavra só.',
          '1º — @lucasflame.ai (cerca de 580 mil): 4,8 milhões de plays e 32,8 mil comentários. CTA: "Comenta COMANDO que eu te envio outros 50 comandos". Gatilho: demonstração do resultado seguida de oferta numerada.'],
        pontos: ['Nos reels pequenos e médios, o CTA com palavra-chave rendeu de 2,4% a 2,8% de comentários sobre os plays, e 0,7% no reel gigante.', 'O Lucas usou o mesmo CTA em outro reel, que fez só 6,1 mil plays. O alcance vem do gancho e do tema, não do CTA.'],
        pendencias: ['Conferir os comentários dos itens 1 a 4 direto no reel.', 'Printar o número de views do Lucas no próprio reel: o vidIQ e o perfil mostram valores diferentes (6,1 milhões e 4,8 milhões).', 'Faturamento fica de fora até o criador escolher 2 ou 3 nomes: não há faturamento público ligado a um CTA específico.'],
        nota: 'Os gatilhos são leitura do briefing sobre os reels; o criador pode ajustar. Números do briefing ainda não conferidos nos prints.' },
      { id: 'ter', dia: 'Terça', titulo: 'Storytelling', gancho: 'Ninguém assiste aula até o fim. Todo mundo assiste história até o fim.', ganchoAlt: '',
        itens: ['De 4 a 5 estruturas narrativas. Cada uma com: o nome da estrutura e a frase de abertura-modelo em português; os 3 momentos da história; um exemplo real com perfil, views e comentários.', 'Item final: a própria história do vídeo de 140 mil contada em uma das estruturas, como demonstração.'],
        pontos: [], pendencias: ['Os exemplos reais ainda não foram pesquisados: marque [DADO REAL + FONTE] em cada exemplo até haver print.'], nota: '' },
      { id: 'qua', dia: 'Quarta', titulo: 'Polêmicas virais', gancho: 'Opinião morna não viraliza. Mas tem uma linha que, se você cruzar, te cancela.', ganchoAlt: '',
        itens: ['De 4 a 5 tipos de opinião polêmica, cada um com exemplo real, views e comentários.', 'Item obrigatório: "o limite". Regra: criticar a ideia ou a prática, nunca a pessoa. Nada de acusação de fato sem prova e nada que identifique um alvo.', 'Fechamento: um take do criador sobre o nicho, pedindo "concordo ou discordo" nos comentários (gera só engajamento, sem lead).'],
        pontos: ['Usar só opiniões como exemplo, não acusações a pessoas.'], pendencias: ['Os exemplos reais ainda não foram pesquisados.', 'Validar as afirmações técnicas antes de postar.'], nota: '' },
      { id: 'qui', dia: 'Quinta', titulo: 'Ângulos de câmera', gancho: 'A mesma frase gravada em 5 ângulos. Qual prende mais?', ganchoAlt: '',
        itens: ['5 enquadramentos. Cada um com: o nome e quando usar; como gravar (altura do celular, distância, luz e fundo); um clipe real de exemplo; o criador gravando a mesma frase naquele ângulo, lado a lado.', 'Exemplos reais já levantados: falando para a câmera dentro do carro (@yra.diniz); selfie no espelho de elevador com capacete (@felipemilani_); tela dividida com o criador e a gravação de tela (@lucasflame.ai).'],
        pontos: ['Este vídeo precisa de lista de planos, com a fala e o plano de cada item.'], pendencias: ['Faltam 2 ângulos com exemplo.'], nota: '' },
      { id: 'sex', dia: 'Sexta', titulo: 'Colaborações', gancho: 'Collab com a pessoa errada não soma nada. Olha as que somaram.', ganchoAlt: '',
        itens: ['Parte A, casos: 3 a 4 colaborações com a foto dos dois perfis e as views ou números reais. Caso já levantado: @adeliabristot fez um vídeo em costura (stitch) com @rafasudre_ no TikTok: 8,3 milhões de views, 57 vezes a mediana dela, e ela tem 345,6 mil seguidores.',
          'Parte B, como fazer, em 5 passos curtos: (1) escolher parceiro com público complementar e tamanho parecido; (2) definir o formato: post em colaboração, costura, live ou participação; (3) dividir quem grava, quem edita e quem posta; (4) combinar um CTA conjunto; (5) combinar por escrito quem pode usar o material e por quanto tempo (direito de imagem e uso).'],
        pontos: [], pendencias: ['Faltam os outros casos reais.'], nota: '' }
    ]
  };

  const OBJETIVOS = [
    ['seguidores', 'Ganhar seguidores', 'O vídeo existe pra virar seguidor: CTA do próximo problema, promessa específica do próximo vídeo.'],
    ['salvamento', 'Salvamentos', 'Tutorial prático, passo a passo ou lista que a pessoa vai querer consultar depois; prova na tela.'],
    ['compartilhamento', 'Compartilhamentos', 'Algo que a pessoa sente mas não conseguiria dizer sozinha, ou um alerta que ela precisa mandar pra alguém; a frase-chiclete carrega o vídeo.'],
    ['comentario', 'Comentários', 'Assunto do momento, opinião que divide, ou um teste cujo resultado é pessoal; o CTA pede o resultado ou a opinião, sem palavra-chave genérica.'],
    ['curtida', 'Curtidas', 'Opinião firme de posicionamento, curta, com verdade incômoda do nicho.']
  ];

  /* ---------- Perfil de exemplo: Serrano ---------- */
  const PERFIL_SERRANO = {
    nome: 'Elias Serrano',
    apelido: 'Serrano',
    handle: '@serranoconteudo',
    assinatura: '@serranoconteudo | @gabriel_vertice',
    promessa: 'Serro o difícil e entrego simples',
    nicho: 'Direito pra quem vende online + criação de conteúdo',
    posicionamento: 'Direito é o que atrai seguidor: as regras jurídicas e tributárias que afetam quem vende pela internet (o Direito é o ângulo, não o nicho). Marketing é o que ensina e vende: criação de conteúdo, crescimento no Instagram, como ganhar dinheiro com a internet. Reflexão é pilar raro, tom baixo, nunca leva CTA de venda.',
    publico: 'Criadores de conteúdo e empreendedores (25 a 34 anos) que querem ganhar dinheiro com a internet e podem, mais tarde, virar alunos ou mentorados.',
    credencial: 'Estudante de Direito (UNASP). Não é advogado: o título de advogado é só de quem tem inscrição na OAB (Lei 8.906/94, art. 3º).',
    proibidos: 'advogado, advogado dos criadores, tributarista, especialista em Direito',
    permitidos: 'estudante de Direito, "estudando Direito, eu aprendi...", futuro adv',
    ofertas: 'Isca gratuita: PDF "Manual do Roteiro Viral" (link da bio). Produto de entrada: skill de IA de roteiro, R$47. Mentoria: Método RQC (Relacionamento, Qualificação, Conversão), cerca de R$500 por mês. Falado rápido, "RQC" soa como "enriquecer".',
    ctaModo: 'seguir',
    ctaPalavra: '',
    seguidores: 2615,
    metaSeguidores: 5000,
    metaData: '2026-09-30',
    metaNegocio: 'R$5.000 por mês recorrentes até dezembro de 2026',
    tom: 'Marketing / criador de conteúdo: tom de guerra inteiro. Direto, cru, sem clichê, com a verdade incômoda do mercado. Direito: o mesmo tom direto, com zero jargão de marketing digital ("método validado" não significa nada pro MEI com medo); a força vem da clareza. Reflexão: tom baixo, sem CTA de venda.',
    gravacao: 'Microfone de lapela sem fio, celular em modo selfie, parede branca (estúdio) e carro (Stories). Legenda animada 3D palavra a palavra, zoom-in rápido, jump cut. Filtro como significado: P&B pra segredo/investigação; retícula pop-art com fundo preto pra alerta severo. Tarja fixa no topo, números caindo na tela, flash vermelho, som de papel rasgando, som de caixa registradora. Gestos: mão no peito nas palavras de peso, dedo na têmpora, tirar os óculos no primeiro segundo, apontar pra lente no CTA, mãos enumerando itens. Take com 2 segundos de silêncio no começo. Camiseta lisa e escura; luz lateral na parede branca.',
    visual: 'Tech-Moderna / Dark Premium: mesma paleta e mesmas fontes em todo vídeo; logo só no fim, nunca no frame 0.',
    bio: '🪚 Serro o difícil e entrego simples\n🎬 Conteúdo que vira seguidor e grana\n⚖️ Direito pra quem vende online (futuro adv 🤓)\n📥 Roteiro Viral grátis 👇',
    nomeCampo: 'Serrano | Conteúdo e Direito',
    regulado: true,
    disclaimer: '⚖️ Conteúdo informativo. Não substitui a análise de um contador ou advogado para o seu caso.',
    mediaViews: ''
  };

  const FATOS_SERRANO = [
    'IBS/CBS não incidem sobre "enriquecimento" nem sobre "renda". São tributos sobre consumo e incidem sobre a operação (a venda), com lucro ou sem lucro. Acréscimo patrimonial é conceito do Imposto de Renda (CTN, art. 43).',
    '"30% de imposto" está errado. A trava legal da alíquota de referência do IVA é 26,5%. A estimativa oficial divulgada foi de 27,91%, acima da trava, e por isso virou notícia.',
    'A janela de 1 a 30/09/2026 pra escolher recolher IBS/CBS pelo regime regular vale pra ME/EPP do Simples Nacional, não pra MEI. O MEI segue no próprio calendário e não tem essa opção.',
    'Quem fica no Simples normal não abate crédito das próprias compras. Quem compra de microempresa do Simples abate o valor pago dentro do DAS. Quem compra de MEI não abate nada. Por isso o cliente-empresa pode preferir outro fornecedor.',
    'Curso não é e-book. A imunidade vale para o livro (inclusive o digital) e só para impostos. "Criar um e-book atrelado ao curso e dividir a nota" é o que a Receita trata como simulação.',
    'Trocar "publicidade" por "cessão de direito de imagem" na nota não derruba imposto. O que define o imposto é o que você faz, não o nome escrito na nota.',
    'Fator R: é a folha inteira dos últimos 12 meses (pró-labore, salários, encargos, FGTS, 13º) dividida pela receita bruta dos últimos 12 meses. Deu 28% ou mais: Anexo III, a partir de 6%. Menos: Anexo V, a partir de 15,5%. Só vale pras atividades sujeitas ao Fator R (LC 123/2006). Pró-labore maior também paga INSS e IR: a conta é feita com o contador.',
    'Pix: não existe taxa de Pix, e a Receita não fiscaliza Pix por Pix. Bancos e fintechs informam à Receita, na e-Financeira, o total do mês acima de R$5 mil (pessoa física) ou R$15 mil (empresa), conforme a IN RFB 2.278/2025. É a Receita, não o Banco Central. Todo vídeo sobre Pix precisa deixar isso claro na tela.',
    '27,5% é a faixa mais alta do IR, não a alíquota sobre tudo. Em R$10 mil num mês, o IR fica perto de R$1.840. A isenção vai até R$5 mil por mês, com redução parcial até cerca de R$7.350.',
    '"No CNPJ você paga 6%" vale pra algumas atividades no Anexo III, e fora isso ainda tem o pró-labore e o contador. Diga "começa em 6%, dependendo da atividade".',
    'Dividendos (Lei 15.270/2025, em vigor desde janeiro de 2026): retenção de 10% sobre lucros acima de R$50 mil por mês pagos pela mesma empresa à mesma pessoa, e IR mínimo pra quem tem renda acima de R$600 mil por ano. Abaixo disso, o lucro distribuído segue sem IR, com contabilidade regular. A aplicação ao Simples ainda está em discussão.',
    'Acordo de boca vale na maioria dos casos (Código Civil, art. 107). O problema é provar. Entre sócios, a sociedade só se prova por escrito (Código Civil, art. 987). Mensagem de confirmação ajuda como prova, mas não substitui contrato.',
    'UGC e anúncio: contrato sobre direito autoral é interpretado de forma restritiva (Lei 9.610/98, art. 4º). Se o contrato não diz a modalidade de uso, vale só o uso indispensável à finalidade do contrato (art. 49, VI). Usar a imagem de alguém com fim comercial, sem autorização, gera indenização sem precisar provar prejuízo (Súmula 403 do STJ). "Sem cláusula a marca pode tudo" está errado: é o contrário.',
    'Criticar o método, nunca a pessoa. Em React, nada de chamar alguém de "amador". Use print genérico ou encene a situação você mesmo.'
  ];

  const LICOES_SERRANO = [
    'Número do item na tela desde o frame 0, fixo no canto (regra do Outlier #01).',
    'Toda afirmação forte vem com prova na tela: print, número ou documento.',
    'Primeiro item entregue o mais cedo possível, idealmente antes dos 12s: no Outlier #01 a retenção caiu pra perto de 50% aos 8s porque o primeiro item demorou.',
    'Todo vídeo termina puxando interação: pergunta aberta na legenda + CTA de seguir. O Outlier #01 teve só 60 comentários (0,06%) porque ninguém pediu.',
    'Todo Reel vai pros Stories na primeira hora (só 0,2% das views do Outlier #01 vieram de Stories).',
    'Vídeo que fizer 5 vezes a média ganha uma Parte 2 em até 48 horas (Doubling Down): dobre no tema, nunca na âncora polêmica.',
    'Fórmula que funcionou: lista numerada + prova visual na tela + autoironia + utilidade que dá vontade de salvar + quebra de padrão no frame 0 + conteúdo que não perde a validade.',
    'O público quer ferramenta, não aula. Prova numérica. Humor como veículo. E não comenta se ninguém pedir.',
    '71% de quem visitou o perfil seguiu: o perfil converte bem; o gargalo é levar gente até ele.',
    'Nunca abrir pelo assunto quente sem gancho do banco: o vídeo "STF e Banco Master" (1min17) teve 60% de pulados, 83% das views de quem já seguia, 1,8% da Aba Reels e zero comentário, salvamento e compartilhamento. Assunto quente só como ponte, entre o segundo 4 e o 8.',
    'Vídeo acima de 45s perde quase toda a audiência antes da metade: mirar 35 a 45 segundos.'
  ];

  const POSTS_SERRANO = [
    {
      titulo: 'Formatos virais da superior cringa',
      formatoId: 'lista', temaId: null, ganchoId: null,
      postadoEm: '2026-08-28', duracao: 39,
      metrics: { views: 129228, alcance: 99296, seguidores: 1995, salvamentos: 7800, compartilhamentos: 5500, curtidas: 5300, comentarios: 60, naoSeguidores: 97.5, abaReels: 80.6, pulados: '', visitas: '' },
      nota: 'Outlier #01. 97,5% de não seguidores, 80,6% vindo da Aba Reels. Público 25–34 (58,6%). 71% de quem visitou o perfil seguiu.'
    },
    {
      titulo: 'STF e Banco Master como cortina de fumaça',
      formatoId: null, temaId: null, ganchoId: null,
      postadoEm: '', duracao: 77,
      metrics: { views: '', alcance: '', seguidores: '', salvamentos: 0, compartilhamentos: 0, curtidas: '', comentarios: 0, naoSeguidores: 17, abaReels: 1.8, pulados: 60, visitas: '' },
      nota: 'Abriu pelo assunto quente, sem gancho do banco, com 1min17. Curtida alta (3,1%): quem ficou gostou. O conteúdo era bom, a porta de entrada não.'
    }
  ];

  const EXEMPLO = `@@CABECALHO
Tema #03 — Planejamento tributário lícito · Gancho #151 — Sentença de Contraste
@@ALTERNATIVOS
#1
#58
@@PILARES
Surpresa (inverte quem paga) + promessa de clareza (existe uma lei que você não conhece). A dor universal entra no segundo 5 ("você pode estar pagando quinze e meio").
@@VALOR
Pra quem: dono de empresa de serviço no Simples e criador que recebe de marca.
Antes → depois: acha que imposto é fixo e que pagar menos é coisa de esperto → sabe que existem 3 regras na lei e qual pergunta fazer pro contador.
Leva pronto: a pergunta "qual dessas eu ainda não tô usando?" pra mandar pro contador hoje.
Ganho: até nove e meio pontos de imposto a menos sobre o faturamento, todo mês.
Mandaria pra: o sócio ou o contador, junto com a pergunta.
Por que seguir: essa semana sai uma regra por dia, começando pelo Pix no CPF.
Nota: transformação 9 · aplicável hoje 9 · ganho 9 · digno de mandar 9 · motivo pra seguir 9
@@TARJA
3 REGRAS PRA PAGAR MENOS IMPOSTO
@@ATO1 0–4s
- "O governo não cobra imposto do inteligente. Cobra de quem não conhece a lei."
@@ATO2 4–12s
- "Se você tem empresa ou ganha dinheiro com a internet, presta atenção."
- "Tem empresa do mesmo tamanho que a sua, faturando a mesma coisa, pagando seis por cento de imposto. E você pode estar pagando quinze e meio."
- "Todo mês. Dinheiro que sai da sua conta e não volta."
- "Sonegação? Não. São três regras que estão na lei."
@@ATO3 12–40s
- "Um: não recebe de marca no CPF. No CPF, parte do dinheiro paga vinte e sete e meio por cento. No CNPJ, dependendo da atividade, começa em seis."
- "Dois: o Fator R. Se a sua empresa é de serviço no Simples e o que você gasta com folha, contando o seu pró-labore, chega a vinte e oito por cento do faturamento, o imposto pode cair de quinze e meio pra seis."
- "Três, a que menos gente usa: o lucro que você tira como lucro, e não como salário, não paga imposto de renda até cinquenta mil por mês, com a contabilidade feita direito."
- "Tira print dessas três e manda pro seu contador hoje com uma pergunta: 'qual dessas eu ainda não tô usando?'"
- ★ "Pagar menos imposto não é esperteza. É conhecer a lei."
@@ATO4 40–45s
- "Segue, porque essa semana eu destrincho cada uma. Começando pelo Pix no CPF."
@@LEGENDA
@serranoconteudo | @gabriel_vertice

Mesma empresa, mesmo faturamento. Uma paga 6% de imposto. A outra, 15,5%.

3 regras legais que a maioria dos empresários e criadores ignora:

1️⃣ Publi no CPF pode cair em 27,5% de IR. No CNPJ do Simples, dependendo da atividade, começa em 6%
2️⃣ Fator R: se a folha dos últimos 12 meses (com pró-labore) chega a 28% do faturamento, o imposto pode ir de 15,5% para 6%
3️⃣ Lucro distribuído não paga IR até R$50 mil por mês, com contabilidade regular (Lei 15.270/2025)

Primeiro passo de graça: mande essas 3 pro seu contador e pergunte qual você ainda não usa.

Qual das três você não conhecia? 👇

⚖️ Conteúdo informativo. Planejamento tributário deve ser feito com seu contador.

Segue @serranoconteudo pra ver cada regra em detalhe essa semana.

#planejamentotributario #simplesnacional #fatorr #impostoderenda #cnpj
@@EDICAO
- Tarja fixa no topo: "3 REGRAS PRA PAGAR MENOS IMPOSTO" (6 palavras).
- Gancho: 2 segundos de silêncio olhando pra lente, depois a fala seca, sem sorrir. "INTELIGENTE" em verde e "NÃO CONHECE A LEI" em vermelho, junto com a fala.
- "6%" e "15,5%" lado a lado, em verde e vermelho.
- "Sonegação? Não.": corte seco e você balançando a cabeça.
- Número do item fixo no canto. Cada item mais rápido que o anterior.
- Um card por regra: "CPF ❌ / CNPJ ✅", depois 15,5% caindo pesado até 6%, depois "R$50 MIL/MÊS SEM IR" com caixa registradora e "Lei 15.270/2025" embaixo.
- Na frase-chiclete: zoom-in e a música some por 1 segundo.
- Até 45 segundos.
@@ANTES_DE_POSTAR
- Conferir se a retenção de 10% segue valendo só acima de R$50 mil por mês por fonte (Lei 15.270/2025).
@@PROXIMO
Pix no CPF: a primeira das três regras em detalhe.`;

  /* ---------- Médias do Instagram (conferidas na fonte em 23/09/2026) ----------
     O Instagram não publica médias oficiais. Estas são de estudos de mercado:
     Socialinsider e Dash Social medem páginas de marcas; HypeAuditor mede influenciadores. */
  const F5 = (a, b, c, d, e) => [
    { de: 1000, ate: 5000, rotulo: '1 a 5 mil', valor: a },
    { de: 5000, ate: 10000, rotulo: '5 a 10 mil', valor: b },
    { de: 10000, ate: 50000, rotulo: '10 a 50 mil', valor: c },
    { de: 50000, ate: 100000, rotulo: '50 a 100 mil', valor: d },
    { de: 100000, ate: 1000000, rotulo: '100 mil a 1 mi', valor: e }
  ];
  const SI_BENCH = { fonte: 'Socialinsider — Instagram Benchmarks', fonteCurta: 'Socialinsider', url: 'https://www.socialinsider.io/social-media-benchmarks/instagram', periodo: 'jan–dez/2025', amostra: '35 mi de posts de 447.613 páginas' };
  const SI_ENG = { fonte: 'Socialinsider — Instagram Engagement Report', fonteCurta: 'Socialinsider', url: 'https://www.socialinsider.io/social-media-benchmarks/instagram-engagement-report', periodo: 'out/2025–mar/2026', amostra: '15 mi de posts de 417.130 páginas' };
  const BENCH = {
    atualizado: '23/09/2026',
    nota: 'O Instagram não publica médias oficiais: estas vêm de estudos de mercado. Socialinsider e Dash Social medem páginas de marcas, que engajam menos que criadores; a HypeAuditor mede influenciadores. Cada comparação usa a mesma fórmula da fonte.',
    itens: [
      Object.assign({ id: 'er_faixa', metrica: 'engajamento', base: 'seguidores', numerador: ['curtidas', 'comentarios'], unidade: '%', rotulo: 'Engajamento de Reels por seguidores (marcas)', faixas: F5(0.80, 0.65, 0.55, 0.45, 0.40), definicao: 'interações ÷ seguidores; a página de vídeo não detalha as interações, e o padrão da Socialinsider no Instagram é curtidas + comentários' }, { fonte: 'Socialinsider — Social Media Video Statistics', fonteCurta: 'Socialinsider', url: 'https://www.socialinsider.io/social-media-benchmarks/social-media-video-statistics', periodo: 'jan–jun/2026', amostra: 'Reels de páginas business (parte de 111 mil vídeos em 4 redes)' }),
      Object.assign({ id: 'er_geral', metrica: 'engajamento', base: 'seguidores', numerador: ['curtidas', 'comentarios'], unidade: '%', rotulo: 'Engajamento médio de Reels, todas as faixas (marcas)', valor: 0.48, definicao: '(curtidas + comentários) ÷ seguidores' }, SI_BENCH, { periodo: '2º tri/2026', amostra: 'atualização trimestral da Socialinsider' }),
      { id: 'er_criadores', metrica: 'engajamento', base: 'views', aprox: true, numerador: ['curtidas', 'comentarios'], unidade: '%', rotulo: 'Engajamento de criadores (HypeAuditor)', faixas: [{ de: 1000, ate: 5000, rotulo: '1 a 5 mil', valor: 4.8 }, { de: 20000, ate: 100000, rotulo: '20 a 100 mil', valor: 1.2 }, { de: 100000, ate: 1000000, rotulo: '100 mil a 1 mi', valor: 1.0 }, { de: 1000000, ate: null, rotulo: 'mais de 1 mi', valor: 1.2 }], definicao: '(curtidas + comentários) ÷ views quando o perfil tem Reels recentes; senão ÷ seguidores (a fonte não diz qual fórmula gerou cada faixa, e não tem a faixa de 5 a 20 mil)', fonte: 'HypeAuditor — Instagram Engagement Calculator', fonteCurta: 'HypeAuditor', url: 'https://hypeauditor.com/free-tools/instagram-engagement-calculator/', periodo: '2026', amostra: 'influenciadores; média geral 2,2%' },
      Object.assign({ id: 'views_faixa', metrica: 'views', base: 'post', unidade: '', rotulo: 'Views médias por Reel (marcas)', faixas: F5(580, 1000, 2460, 6095, 16035), definicao: 'média de views por Reel' }, SI_BENCH),
      { id: 'alcance_faixa', metrica: 'views', base: 'seguidores', aprox: true, unidade: '%', rotulo: 'Alcance médio de Reels, em % dos seguidores (marcas)', faixas: F5(9.78, 7.55, 7.10, 5.60, 5.00), definicao: 'alcance ÷ seguidores (aqui comparado com views ÷ seguidores; views contam repetições)', fonte: 'Socialinsider — Instagram Reels Statistics', fonteCurta: 'Socialinsider', url: 'https://www.socialinsider.io/blog/instagram-reels-statistics/', periodo: 'jan–jun/2026', amostra: '140 mil Reels de páginas business' },
      Object.assign({ id: 'coment_faixa', metrica: 'comentarios', base: 'post', unidade: '', rotulo: 'Comentários médios por Reel (marcas)', faixas: F5(3, 6, 12, 22, 60), definicao: 'média de comentários por Reel' }, SI_BENCH),
      Object.assign({ id: 'salv_faixa', metrica: 'salvamentos', base: 'post', unidade: '', rotulo: 'Salvamentos médios por Reel (marcas)', faixas: F5(1, 2, 7, 22, 96), definicao: 'média de salvamentos por Reel' }, SI_BENCH),
      Object.assign({ id: 'coment_taxa', metrica: 'comentarios', base: 'seguidores', unidade: '%', rotulo: 'Taxa de comentários de Reels', valor: 0.06, definicao: 'comentários ÷ seguidores' }, SI_ENG),
      Object.assign({ id: 'comp_taxa', metrica: 'compartilhamentos', base: 'seguidores', unidade: '%', rotulo: 'Taxa de compartilhamentos de Reels', valor: 0.10, definicao: 'compartilhamentos ÷ seguidores' }, SI_ENG),
      Object.assign({ id: 'salv_taxa', metrica: 'salvamentos', base: 'seguidores', unidade: '%', rotulo: 'Taxa de salvamentos de Reels', valor: 0.04, definicao: 'salvamentos ÷ seguidores' }, SI_ENG)
    ],
    contexto: [
      { texto: 'Reel médio de marca: 283 mil views, 182 mil de alcance, 1,3 mil compartilhamentos e 618 salvamentos; engajamento ÷ views de 0,1% a 0,5% conforme o setor.', fonte: 'Dash Social — Instagram Reels Benchmarks (3,3 mil marcas)', url: 'https://www.dashsocial.com/blog/instagram-reels-performance-benchmarks', data: 'jul–dez/2025' },
      { texto: 'De 60,5% (100 mil a 1 mi) a 65,5% (1 a 5 mil) das pessoas pulam o Reel nos 3 primeiros segundos.', fonte: 'Socialinsider — Instagram Reels Statistics', url: 'https://www.socialinsider.io/blog/instagram-reels-statistics/', data: 'jan–jun/2026' },
      { texto: 'Tempo médio assistido de um Reel: 8,5 segundos, mais que o dobro do ano anterior.', fonte: 'Metricool — Instagram Study 2026 (24,3 mi de posts)', url: 'https://metricool.com/press-release-instagram-study-2026/', data: 'jan–fev/2026' }
    ],
    sinais: [
      { texto: 'Adam Mosseri: os três sinais que mais pesam no ranqueamento são tempo assistido, curtidas e envios. Curtidas pesam um pouco mais pra quem já segue; envios, pra quem não segue.', fonte: 'Adam Mosseri, via Social Media Today', url: 'https://www.socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/', data: '22/01/2025' },
      { texto: 'Adam Mosseri: a taxa de curtida importa mais pros seus seguidores, e a taxa de envio importa mais pra quem não te segue.', fonte: 'Adam Mosseri, via Social Media Today', url: 'https://www.socialmediatoday.com/news/instagram-engagement-rates-provide-insight-into-reach/821170/', data: '26/05/2026' },
      { texto: 'O modelo que encadeia Reels prevê, entre outras coisas, a chance de a pessoa assistir menos de 3 segundos, repostar o Reel e seguir o autor.', fonte: 'Meta — Instagram Reels Chaining (central de transparência)', url: 'https://transparency.meta.com/features/explaining-ranking/ig-reels-chaining/', data: 'atualizado em 11/11/2025' }
    ]
  };

  window.NDI = { PILARES, TEMAS, FORMATOS, CATS, GANCHOS, MAPA, PERFIL_SERRANO, FATOS_SERRANO, LICOES_SERRANO, POSTS_SERRANO, EXEMPLO, BENCH, MANUAL, OBJETIVOS, SERIE, SERIE_REGRAS };
})();
