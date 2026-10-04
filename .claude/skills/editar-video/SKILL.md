---
name: editar-video
description: Playbook de edição de vídeo em nível de excelência com Claude + HyperFrames (vídeo cru falado para a câmera → Reel/TikTok/Short 9:16 finalizado; e motion graphics criados do zero com trilha e efeitos sonoros sincronizados). Use sempre que o usuário pedir para editar, cortar, legendar, finalizar ou criar um vídeo, Reel, Short, TikTok, trailer ou motion graphic.
---

# Edição de vídeo nível excelência (método "Claude edita meus vídeos")

Fonte: vídeo "Como Eu Crio e Edito Meus Vídeos com o Claude Opus 5.5" (Matheus Fonseca, 02/10/2026, youtube.com/watch?v=1IuB9IRyOCs), completado com as regras oficiais do HyperFrames (github.com/heygen-com/hyperframes), que é o motor que produziu o resultado do vídeo. A parte de animação 3D foi deixada de fora de propósito.

## 0. Princípios do método (o que o vídeo ensina)

1. **Tudo por código, nada de editor.** A edição é feita com FFmpeg + Python + Node + **HyperFrames** (vídeo feito de HTML/CSS/GSAP renderizado em MP4). Não abrir CapCut/Premiere.
2. **Um prompt só, grande e completo.** O resultado vem de um prompt detalhado que define formato, ferramentas, regras de áudio e de instalação. Ver os modelos na seção 7.
3. **Modelo mais forte + esforço máximo.** Edição boa leva tempo: ~50 min para editar um vídeo cru, ~30 min para um motion graphic de 15 s. Não apressar, não pular a QA.
4. **Música e efeitos sonoros sintetizados por código** (Web Audio API / OfflineAudioContext → WAV), sem arquivos externos, a não ser que o usuário forneça.
5. **Dependências só dentro do projeto**: npm local na pasta do projeto, Python em `.venv` local. Nunca instalar nada globalmente.
6. **Pré-requisito:** HyperFrames instalado (`npx hyperframes doctor` para checar; skills via `npx hyperframes skills update`). Repo: https://github.com/heygen-com/hyperframes. Skills relevantes: `talking-head-recut` (cards sobre vídeo falado), `embedded-captions` (legendas, inclusive atrás da pessoa), `motion-graphics`, `hyperframes-audio` (mixagem/ducking), `media-use` (música, SFX).

## 1. Anatomia do Reel editado (o que o resultado tinha, e que é o padrão a bater)

Análise quadro a quadro do resultado final do teste 1:

| Elemento | Como foi feito |
| --- | --- |
| Formato | 9:16, 1080×1920, vindo de vídeo vertical OU horizontal (reenquadrado) |
| Hook (0–2 s) | Card no topo com a frase-gancho ("Claude editou este vídeo") + miniaturas da timeline + transição rápida. O primeiro segundo já tem movimento e texto |
| Profundidade | A pessoa **recortada (matte) na frente** dos cards/elementos gráficos: dá sensação de que ela está dentro do espaço. Uso pontual, não o vídeo todo |
| Moldura | Em alguns trechos o vídeo do apresentador vai para dentro de um mockup de celular estilizado |
| Cortes | Cortes secos removendo pausas, respiros e erros. Vídeo cru sem nenhum corte vira vídeo sem tempo morto |
| Punch-ins | Zoom digital rápido nos momentos de ênfase da fala (alternar plano normal ↔ fechado esconde os cortes) |
| Legendas | Sans-serif arredondada e grossa, branca com contorno/sombra preta suave, centro/terço inferior, tamanho médio-grande, aparecem sincronizadas por palavra/frase curta, **palavras-chave em amarelo** (uma cor de destaque só) |
| Cards de UI | Cards flutuantes ilustrando o que é dito: interface do app citado, alerta vermelho ("NÃO SUPORTADO") quando fala de problema, card de documento ("Método: …") quando fala do método |
| CTA final | Caixa de comentário animada digitando a palavra-chave ("vídeo") + clique animado em "Publicar", junto da fala "comenta a palavra X que eu te envio na DM" |
| Áudio | Música de fundo contínua e baixa (ducking sob a voz) + SFX sutis: *whoosh* nas transições, *pop* na entrada de cards, *click* nos cliques de UI |

Regra de ouro: **cada coisa que a pessoa fala de concreto ganha um elemento visual sincronizado** (card, ícone, destaque), e cada elemento visual ganha um som discreto.

## 2. Pipeline do vídeo cru → Reel

1. **Sondar:** `ffprobe` (duração, resolução, fps). Tirar frames em 20/50/80% e uma folha de contato 1 fps (`ffmpeg -i in.mp4 -vf "fps=1,scale=160:-1,tile=10x5" sheet.png`) para ver enquadramento e se já existe texto queimado.
2. **Áudio + transcrição com tempo por palavra:** extrair `audio.mp3`, transcrever com Whisper (`npx hyperframes transcribe … --json`; para português use modelo multilíngue, ex. `small`/`medium`, nunca `.en`). Corrigir erros de ASR (nomes de produto, termos técnicos) **sem mexer nos timestamps**.
3. **Cortes:** remover silêncios > ~0,3–0,5 s, gaguejadas, autocorreções e takes repetidos (manter só a versão final da frase). Fazer os cortes no respiro, nunca no meio da palavra. Recalcular os tempos da transcrição depois do corte.
4. **Reenquadrar para 9:16:** se a fonte for horizontal, crop centrado no rosto (ou layout empilhado/PiP). Rosto no terço superior, fora das zonas de UI da plataforma.
5. **Reencodar com keyframes densos** antes de compor (senão o frame congela no seek): `ffmpeg -i in.mp4 -c:v libx264 -crf 18 -g 30 -keyint_min 30 -pix_fmt yuv420p -movflags +faststart -c:a aac input-video.mp4`.
6. **Storyboard (`storyboard.json`)** antes de escrever qualquer HTML: lista de cards com `startSec/endSec`, intenção, zona, cor de destaque, conteúdo. Hook no começo, CTA no fim.
7. **Escrever os cards em HTML** (um arquivo por card, CSS escopado, animações declaradas) e montar `public/index.html` com uma única timeline GSAP pausada.
8. **Matte da pessoa** (`hyperframes remove-background`) para o efeito de profundidade e para legendas "embed" atrás dela.
9. **Trilha + SFX** sincronizados aos eventos (ver seção 5).
10. **QA com snapshots antes do render** (`npx hyperframes snapshot public --at <s>`), corrigir, e só então `npx hyperframes render public -o output.mp4 --fps 30`.
11. **Conferir o MP4 final** (frames em vários pontos, áudio presente, duração correta, sem rabo preto no fim).

## 3. Ritmo e quantidade de elementos

- Ritmo base de cards/elementos por duração: < 60 s → um a cada **6–8 s**; 60 s–3 min → **8–12 s**; 3–10 min → **12–20 s**. Conteúdo denso (muitos números/ideias) × 0,7; reflexivo × 1,5. Mínimo de 5 cards.
- Card parado por mais de ~8 s fica chato: card longo precisa de revelações em etapas.
- **Quebre o ritmo a cada ~30 s:** algo entra pela direção oposta, uma palavra em 2× o tamanho, uma pausa sem legenda, troca de cor.
- 2–3 padrões de movimento repetíveis no vídeo todo (coerência > variedade).
- Transições de layout do vídeo em 0,5–0,7 s com `power2.inOut`. Entrada de card ~0,4 s `power2.out`, saída ~0,35 s `power2.in`.

## 4. Legendas: as regras que separam profissional de preset

- **O rosto sempre ganha.** Se a legenda chama mais atenção que a pessoa, diminua, escureça ou mova. Nunca cobrir o rosto.
- **Uma família de fonte, no máximo dois pesos.** Hierarquia por peso e tamanho, nunca misturando fontes. Nada de itálico para ênfase.
- **Uma cor de destaque só** (ex.: amarelo) + branco/neutros. Destaque 1–2 palavras que carregam o sentido da frase: ~70% texto normal, 20% leve destaque, 8% ênfase forte, 2% clímax.
- **Contraste sem caixa branca:** contorno escuro de 2–3 px + sombra suave; ou faixa semitransparente do tamanho do texto. Nunca escurecer/colorir o vídeo inteiro.
- **Tamanho em 1080×1920:** corpo 65–95 px; gancho/punchline 130–170 px. Títulos grandes com tracking negativo (-0,015 a -0,035 em).
- **Quebrar no respiro** (pausa ≥ 250 ms), nunca no meio da frase. ≤ 2 linhas, ~32–42 caracteres por linha, sem palavra solitária na linha.
- **Sincronia:** cada palavra a ≤ 80 ms do áudio; cada legenda ≥ 0,5 s na tela. Não juntar duas palavras num mesmo item de tempo.
- **Stagger define o tom:** 40 ms = urgente/TikTok; 80 ms = conversa; 150 ms = documental; 250 ms+ = poético.
- **Cortar o que repete:** não legendar "é", "tipo", "né", "então assim", autocorreções.
- **Animar só transform/opacity/clip-path** (nunca letter-spacing, blur ou font-weight, que fazem o texto pular).
- **Embed (palavra atrás da pessoa) é raro e merecido:** no máximo um por ideia, nunca dois juntos, um clímax principal. Legendar tudo atrás da pessoa é o erro clássico.
- **Zonas seguras:** manter texto fora da área de UI do Instagram/TikTok (topo, base com legenda/ícones e a coluna direita de botões).

## 5. Áudio: música, SFX e sincronia

- Música de fundo contínua, **abaixo da voz** (ducking/carve: a música abre espaço nas frequências da voz quando ela fala). Fade-in no início, fade-out no fim.
- SFX discretos e coerentes: whoosh = transição/movimento, pop = card aparecendo, click = clique de UI, riser antes de revelação, impacto no clímax. Volume baixo; o som acompanha, não grita.
- **Sincronizar ao frame:** o corte/entrada visual cai exatamente na batida ou no transiente do som. Para motion graphic, defina o BPM primeiro e derive os tempos das cenas do compasso (ex.: 120 BPM → batida a cada 0,5 s).
- Gerar a trilha por código quando não houver arquivo: Web Audio API com OfflineAudioContext → WAV → mux no MP4. Tudo determinístico (sem `Math.random()`/`Date.now()` no caminho de render).

## 6. Motion graphic do zero (teste 2)

O que o resultado tinha: trailer de 15 s, 16:9 em 2560×1440 a 60 fps; fundo escuro texturizado com linhas de código translúcidas; tipografia serifada elegante branco/bege com um acento terracota; frases curtas uma por cena ("Nada disto foi filmado." → corte para fundo claro "Foi escrito." → régua de frames com contador → forma de onda com a nota tocada em Hz → logo + subtítulo + badges das tecnologias). Tudo cortado na batida.

Receita:
- Conceito + narrativa em 4–6 cenas de 2–3 s, uma ideia por cena, frases de 2–5 palavras.
- Paleta: fundo + texto neutro + **um** acento. Uma família tipográfica.
- Alternância claro/escuro como "corte" de impacto.
- Elementos que reagem ao áudio (onda, contador, cursor) vendem a sincronia.
- Final = revelação da marca/logo + frase de assinatura + CTA ou créditos.
- Só HTML/CSS/SVG/Canvas/GSAP; sem imagens de banco nem mídia gerada por IA, salvo pedido.

## 7. Modelos de prompt (usar como base)

### 7.1 Vídeo cru → Reel (parte visível do prompt do vídeo, traduzida/adaptada)

> Transforme minha gravação bruta falando para a câmera em um vídeo vertical 9:16 finalizado e pronto para publicar como Instagram Reel, TikTok ou YouTube Short.
> Execute todo o processo por código, usando FFmpeg, Python, Node e HyperFrames. Não utilize aplicativos de edição de vídeo.
> Sintetize por código toda a música e todos os efeitos sonoros. O áudio da minha voz será fornecido, mas não haverá arquivos externos de música ou efeitos.
> Você pode instalar as dependências necessárias dentro deste projeto, incluindo pacotes npm na pasta do projeto e pacotes Python em um ambiente virtual local. Nunca instale programas globalmente no sistema.
> [complementos deste playbook:] Remova pausas e erros; aplique punch-ins nas ênfases; legendas sincronizadas por palavra com destaque amarelo nas palavras-chave; cards de UI ilustrando o que eu falo; efeito de profundidade (eu recortado na frente de elementos) em 1–3 momentos; hook nos 2 primeiros segundos; CTA animado no final; música de fundo com ducking e SFX discretos. Gere snapshots e revise contra o checklist antes de renderizar.

(O prompt completo do autor fica em matheusfonseca.bio/materiais/opus-5-5-edita-videos; o link estava bloqueado pela rede quando esta memória foi escrita, então só o trecho que aparece na tela foi capturado.)

### 7.2 Motion graphic / trailer

> Crie um vídeo cinematográfico de [N] segundos sobre [tema], construído inteiramente no HyperFrames e renderizado em MP4, [2560×1440 a 60 fps | 1080×1920 a 30 fps].
> Tudo que aparecer na tela deve ser criado por código (HTML, CSS, SVG, Canvas e GSAP). Não use imagens, vídeos de banco ou mídia gerada por IA.
> Crie toda a trilha sonora por código com a Web Audio API, renderize com OfflineAudioContext, exporte em WAV e incorpore ao MP4. Sem arquivos de áudio externos nem samples.
> Você é responsável pela direção criativa: conceito, narrativa e elementos visuais. Deve parecer um filme de lançamento de uma grande marca, com identidade própria e acabamento cinematográfico. Sincronize cortes e animações com a batida.

## 8. Checklist de QA (rodar antes de entregar)

- [ ] Primeiro 1–2 s tem gancho visual + texto + movimento?
- [ ] Nenhum tempo morto (pausas, erros, repetições cortados)?
- [ ] Legenda a ≤ 80 ms da fala, ≥ 0,5 s na tela, quebrada no respiro, ≤ 2 linhas?
- [ ] Uma fonte, ≤ 2 pesos, uma cor de destaque, sem itálico, sem caixa branca?
- [ ] Rosto nunca coberto; texto fora das zonas de UI da plataforma?
- [ ] Cada afirmação concreta tem apoio visual; ritmo de cards dentro da faixa da seção 3?
- [ ] Quebra de ritmo a cada ~30 s?
- [ ] Profundidade/embed usados com moderação?
- [ ] Música abaixo da voz, SFX discretos e alinhados ao frame do evento?
- [ ] CTA claro no final (palavra-chave para comentar, seguir, link)?
- [ ] Render conferido: duração certa, áudio presente, sem frame congelado nem rabo preto?
- [ ] Revisão "olhos frescos": olhar a folha de snapshots como se fosse de outra pessoa e corrigir antes do render final.
