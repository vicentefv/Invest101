# Design: Invest101 "Cartaz"

Escrito à mão a partir do que foi construído (revisão independente do impeccable não correu: o agente `impeccable-finish-reviewer` não existe nesta sessão; verificação feita com capturas em 10 larguras, detetor `impeccable detect` sem achados e testes manuais).

## Ideia
Aprender a investir como quem folheia um cartaz modernista português: campos de cor chapada, geometria (círculos, semicírculos, barras, diagonais), números e títulos gigantes que se movem. Recusa o terminal escuro com neon e o cartão genérico.

## Cor
Papel `#F3EDDD` (fundo), `#FFFAEB` (superfície), tinta `#16120E`. Campos: vermelhão `#D8321A`, cobalto `#1F3FD6`, amarelo `#FFC400`, verde-garrafa `#0C7A4F`. Cada módulo e cada vista usa uma cor (`.mc-yellow|red|blue|green|ink`, variáveis `--mc` e `--on-mc`). Subida = verde, descida = vermelho. Tema escuro: tinta quente `#14110E`, mesmas cores mais luminosas. Tokens em `src/style.css`.

## Tipografia
Unbounded (900) para títulos, números grandes e nomes de módulos; Hanken Grotesk para texto; Martian Mono para dados. Títulos com `clamp()`, entre 26 px e 150 px; texto de leitura 15,5 a 21 px.

## Forma e profundidade
Contornos de tinta de 2 px, raio 4 px, botões e etiquetas em pílula. Sem sombras suaves nem blocos com sombra deslocada; elevação só por contorno e cor.

## Movimento (`src/motion3.js`, `src/motion3.css`)
Texto cinético (`data-kin`), scroll-scrub (`--p`), cortina em `clip-path` entre vistas, indicador deslizante no menu, cursor e botões magnéticos só com rato, abertura da Home (uma vez por sessão), confetti geométrico ao acertar. Só `transform`, `opacity` e `clip-path`; no máximo três elementos em loop por ecrã; pausa fora do ecrã e com o separador escondido; `prefers-reduced-motion` mostra o estado final sem movimento.

## Peças
Início (hero com barras e círculos, faixa de factos, história pinada de 4 cenas, mapa de 12 módulos com lista ao passar, mini-simulador, bloco "Só o que se pode fazer em Portugal", faixa gigante). Aprender (cabeçalho de artigo na cor do módulo, cenas SVG controladas pelo scroll, `stat` em faixa preta, perguntas Decide/Faz e vê/Encontra o erro, ficha "Em Portugal" a amarelo). Vistas de mercados com cabeçalho-cartaz (`.vh.poster`), regime em cartaz e cotações em blocos de cor.

## Responsivo
Testado sem overflow de 320 a 2560 px nas 10 vistas. Faixas de largura total saem da coluna central (`100vw`); colunas colapsam por `min-width`/`clamp`; a história pinada empilha abaixo de 820 px; zonas com scroll próprio (lista de vigilância, barra de controlos do gráfico em ecrã tátil) são intencionais.

## v4: loops e globo
- **Aprender**: as cenas já não dependem do scroll; `--p` oscila sozinho (0 → 1 → 0, ~7 s, pausa nas pontas, `m3Wave` em `src/motion3.js`) e só enquanto a cena está visível; reduced-motion fica no estado final. A forma do módulo no cabeçalho roda devagar e continuamente (48 s).
- **Globo "De onde vêm os ativos"** (`src/globe.js`, `globe-core.js`, `globe.css`): canvas 2D com projeção ortográfica d3-geo e Natural Earth 110m embutido. Oceano cobalto, terra em papel, contornos de tinta de 2 a 3,5 px, sombra de um lado, disco amarelo e semicírculo vermelho atrás (a mesma gramática do hero). Marcadores por classe (ações vermelho, obrigações amarelo, forex verde, matérias-primas tinta, cripto azul em órbita), arcos tracejados vermelhos para os pares de moedas, camada alternativa "Domicílio dos ETFs". Arrasto, inércia, rotação automática lenta que pausa ao interagir ou fora do ecrã, e lista de botões como alternativa acessível.

## v5: globo concentrado e fichas em leque
O disco amarelo e a bolinha vermelha são desenhados no canvas, concêntricos com a esfera e a acompanhar o zoom. Os nomes dos continentes são pílulas de tinta com letras de papel. Os ativos saem de cada local como **fichas DOM** (pílulas de papel com contorno de tinta, ponto da classe e traço inferior verde ou vermelho conforme o dia), ligadas ao marcador por uma linha, dispostas em leque para fora do globo (`globeFan`) e separadas por relaxação (`globeRelax`, com os marcadores como obstáculos fixos). Clicar numa ficha abre a vista geral no painel lateral: cortina de cor da classe e conteúdo em cascata; Esc ou ✕ fecham. A rotação automática pára com o rato por cima do globo.
