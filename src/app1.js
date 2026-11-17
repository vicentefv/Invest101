// ================= Ajuda =================
const HELP = {
  live:{t:'De onde vêm os dados e quando atualizam',b:`<p>O Invest101 junta três fontes:</p><ul><li><b>Cotações</b>: preço e variação do dia de 24 mercados, do Yahoo Finance. Atualizam-se automaticamente <b>uma vez por dia, depois do fecho de Nova Iorque (21h30 UTC)</b>, e chegam com algum atraso.</li><li><b>Histórico</b>: fechos diários e velas dos últimos meses, atualizados ao mesmo tempo.</li><li><b>Calendário económico</b>: eventos da Investing.com, com resultado, previsão e valor anterior. Não é atualizado automaticamente.</li></ul><p>O ponto verde no topo significa que os dados têm menos de 90 minutos. Âmbar quer dizer que são da última atualização diária.</p>`},
  heat:{t:'Como ler o mapa de calor',b:`<p>Cada quadrado é um mercado. A cor mostra quanto se mexeu hoje face ao que é habitual nesse mercado, em desvios-padrão (σ), não em percentagem: assim 1% no petróleo e 1% no índice do dólar não pesam o mesmo.</p><p>Verde sobe, vermelho desce, e quanto mais forte a cor, mais invulgar o movimento. O número dentro do quadrado é a variação do dia. Clique para abrir o gráfico.</p>`},
regime:{t:'O que é o regime de mercado?',b:`<p>É o contexto que muda a forma como o mercado lê as notícias. O mesmo dado pode ter efeitos opostos consoante o regime.</p><p>Com inflação alta e bancos centrais a subir juros, um dado económico forte é lido como "mais subidas a caminho": pressiona ações de crescimento, ouro e cripto, e fortalece o dólar.</p><p>Num regime de juros a descer, o mesmo dado forte seria quase sempre bom para as ações. O texto no topo do painel descreve o regime em vigor.</p>`},
  quotes:{t:'Como ler as cotações',b:`<ul><li><b>Último</b>: último valor conhecido, com atraso.</li><li><b>Dia</b>: variação face ao fecho anterior.</li><li><b>1S, 1M, 3M</b>: variação face ao fecho de há uma semana, um mês e três meses.</li><li><b>Obrigações</b>: mostram a <b>yield</b>. A variação aparece em <b>pontos base (pb)</b>: 1 pb = 0,01 ponto percentual. Yield a subir significa preço da obrigação a descer.</li><li><b>Pares cambiais</b>: EUR/USD a subir é o euro a ganhar ao dólar. USD/JPY a subir é o dólar a ganhar ao iene.</li></ul><p>Clique numa linha para abrir a ficha do ativo.</p>`},
  calendar:{t:'Como ler o calendário',b:`<ul><li><b>Atual</b>: o valor divulgado. Fica vazio até à divulgação.</li><li><b>Previsão</b>: a estimativa média dos economistas.</li><li><b>Anterior</b>: o valor do período passado.</li><li><b>Barras de importância</b>: uma, duas ou três, para impacto baixo, médio ou alto.</li><li><b>Positivo / Negativo</b>: se o resultado foi bom ou mau para a moeda do país, face à previsão.</li><li><b>Setas</b>: para onde tendem a ir outros ativos. ▲▲ é efeito forte, ▲ moderado.</li><li><b>A aguardar</b>: a hora já passou mas o valor ainda não foi registado.</li></ul><p>A faixa de dias mostra quantos eventos há em cada dia e quantos são de alto impacto. Clique num evento para ver a leitura completa.</p>`},
  impact:{t:'Como é calculado o impacto',b:`<p>São três passos:</p><ul><li><b>Surpresa</b>: o valor divulgado é comparado com a previsão. Sem previsão, compara-se com o anterior, como sinal fraco.</li><li><b>Moeda</b>: usamos a classificação da Investing.com sobre se o resultado é bom ou mau para a moeda. No desemprego, por exemplo, um valor mais alto é mau.</li><li><b>Outros ativos</b>: um mapa por categoria (inflação, emprego, atividade, banco central…) indica como costumam reagir obrigações, ações e matérias-primas, ajustado ao regime atual.</li></ul><p>É uma estimativa qualitativa e não uma correlação estatística.</p>`},
  surprise:{t:'O que é uma surpresa?',b:`<p>Uma surpresa acontece quando o valor divulgado é diferente da previsão dos economistas.</p><p>O mercado já incorporou a previsão nos preços. Por isso é a diferença, e não o valor em si, que faz mexer as cotações. Quanto maior a diferença e a importância do indicador, maior a reação provável.</p>`},
  chart:{t:'Como usar o gráfico',b:`<ul><li><b>Intervalo</b>: nos ativos com velas, 15m, 1h, 1D e 1S escolhem quanto tempo cabe em cada vela; nos restantes, 1S, 1M, 3M e 6M escolhem o período à vista.</li><li><b>Andar no gráfico de velas</b>: arraste para recuar no tempo. Para aproximar e afastar use a roda do rato, os botões − e + ou dois dedos; a seta com barra volta à vela mais recente. No teclado: setas, + e −.</li><li><b>Passe o rato</b> ou deslize o dedo para ver o valor e a data de cada ponto, e a variação desde o início do intervalo.</li><li><b>Cor da linha</b>: verde se o ativo subiu no intervalo, vermelho se desceu.</li><li><b>MM20 e MM50</b>: médias móveis simples de 20 e 50 fechos. Ligue ou desligue cada uma; a cor do botão é a cor da linha.</li><li><b>Indicadores</b>: nos câmbios, o botão Indicadores abre a lista do que se pode desenhar: até três sobre o preço e um num painel por baixo. Cada um explica como se lê.</li><li><b>Comparar com</b>: junta até três ativos ao gráfico, todos em variação desde o início do período.</li><li><b>Pontos na base</b>: eventos de alto impacto que mexem com este ativo. Clique num ponto para abrir o evento.</li><li><b>Sessões</b>: nos gráficos de 15 minutos e de 1 hora, as faixas de cor dividem o tempo pelas sessões da Ásia (Tóquio, 9h às 18h locais), da Europa (Londres, 8h às 17h) e da América (Nova Iorque, 8h às 17h). Onde duas cores se misturam, as duas praças estão abertas ao mesmo tempo, e é aí que costuma haver mais negócio. O botão Sessões liga e desliga as faixas.</li><li><b>Volume</b>: em velas, as colunas no fundo mostram quanto se negociou em cada vela, a verde se fechou acima da abertura e a vermelho se fechou abaixo. A altura é relativa à maior coluna à vista. O câmbio à vista não tem volume centralizado: nos câmbios as colunas mostram o volume dos futuros (CME; ICE no índice do dólar), que é a aproximação habitual. As yields não têm volume.</li><li><b>Previsão Kronos</b>: estende o gráfico com a previsão de um modelo de inteligência artificial treinado em velas de preços. A linha tracejada é a média de várias trajetórias simuladas; as faixas mostram onde caem 50% e 80% delas, e as linhas finas são algumas trajetórias soltas. Quanto mais larga a faixa, mais incerto o modelo está. Clique outra vez para a retirar.</li></ul>`},
  tech:{t:'Resumo técnico',b:`<ul><li><b>Tendência</b>: alta quando o preço está acima da MM20 e esta acima da MM50; baixa no caso inverso; mista nos restantes.</li><li><b>MM20, MM50, MM100</b>: médias móveis simples e distância do preço a cada uma.</li><li><b>RSI 14</b>: força relativa de 0 a 100. Acima de 70 costuma ler-se como sobrecomprado, abaixo de 30 como sobrevendido.</li><li><b>Desvio à média</b>: a quantos desvios-padrão o preço está da MM20. Além de ±2 está esticado.</li><li><b>Volatilidade</b>: desvio-padrão dos retornos de 20 sessões, anualizado. A <b>amplitude de 1σ</b> é o movimento típico de um dia.</li><li><b>Gama de 6 meses</b>: onde está o preço entre o fecho mínimo (0%) e o máximo (100%).</li></ul><p>Tudo é calculado sobre fechos diários. Não há máximos nem mínimos intradiários.</p>`},
  sens:{t:'O que é a sensibilidade?',b:`<p>Mostra como este ativo costuma reagir a uma <b>surpresa forte</b> (dado acima do esperado, ou banco central mais duro) em cada tipo de evento.</p><ul><li>Barra para a <b>direita, a verde</b>: tende a subir.</li><li>Barra para a <b>esquerda, a vermelho</b>: tende a descer.</li><li>Valor <b>2</b>: reação forte. Valor <b>1</b>: moderada.</li></ul><p>Se o dado sair abaixo do esperado, a reação inverte-se.</p>`},
  matrix:{t:'Como ler a matriz de sensibilidade',b:`<ul><li><b>Linhas</b>: tipos de evento. <b>Colunas</b>: ativos.</li><li><b>Células</b>: reação a um dado <b>acima do esperado</b>. +2 sobe forte, +1 sobe, · neutro, −1 desce, −2 desce forte.</li><li><b>Obrigações</b>: é a yield que sobe ou desce.</li><li><b>Pares cambiais</b>: lidos como estão escritos.</li></ul><p>Para um dado abaixo do esperado, inverta os sinais. Esta matriz é um modelo qualitativo; a tabela de correlações acima é estatística.</p>`},
  sessions:{t:'Sessões e linha do dia',b:`<p>O mercado cambial funciona 24 horas nos dias úteis, em quatro sessões que se sobrepõem. A liquidez e os movimentos são maiores quando duas estão abertas, sobretudo <b>Londres e Nova Iorque</b>.</p><ul><li><b>Sydney</b>: 7h às 16h locais.</li><li><b>Tóquio</b>: 9h às 18h locais.</li><li><b>Londres</b>: 8h às 17h locais.</li><li><b>Nova Iorque</b>: 8h às 17h locais.</li></ul><p>As barras estão convertidas para a hora de Lisboa e acompanham as mudanças de hora de cada praça. Os pontos por baixo são os eventos de hoje: âmbar para alto impacto por sair, cinzento para os que já saíram.</p>`},
  risk:{t:'Apetite pelo risco',b:`<p>Resume se o mercado está a comprar ou a fugir do risco nas últimas 5 sessões.</p><p>Para cada ativo calculamos a variação a 5 sessões em desvios-padrão (face à sua volatilidade de 60 sessões). Contam a favor do risco: S&amp;P 500, Nasdaq 100, Euro Stoxx 50, cobre, Bitcoin e USD/JPY. Contam contra: dólar e ouro, que sobem quando há medo.</p><p>O resultado é a média, de −1 (aversão) a +1 (apetite).</p><p><b>É uma aproximação.</b> Não inclui o VIX nem spreads de crédito, que não fazem parte dos dados.</p>`},
  movers:{t:'Movimentos fora do normal',b:`<p>Uma variação de 1% é enorme no EUR/USD e banal no Bitcoin. Para comparar, dividimos a variação de hoje pela volatilidade diária habitual de cada ativo (60 sessões).</p><p>O resultado está em desvios-padrão (σ). Acima de 2σ é um dia invulgar; costuma ter uma notícia por trás.</p>`},
  surpidx:{t:'Balanço de surpresas',b:`<p>Mostra, por moeda, se os dados dos últimos 7 dias saíram mais vezes acima ou abaixo do esperado.</p><p>Cada divulgação com previsão conta +1 (boa para a moeda) ou −1 (má), ponderada pela importância. O resultado vai de −1 a +1.</p><p>Com uma semana de história isto é um balanço simples e não um índice de surpresas económicas no sentido estatístico.</p>`},
  screen:{t:'Tabela de desempenho e volatilidade',b:`<ul><li><b>Dia, 1S, 1M, 3M, 6M</b>: variação em cada horizonte. A cor é mais forte quanto maior o movimento.</li><li><b>Vol. 20d e 60d</b>: volatilidade anualizada. Se a de 20 dias está acima da de 60, o ativo está mais agitado do que o habitual.</li><li><b>1σ dia</b>: movimento típico de um dia, nas unidades do preço.</li><li><b>RSI 14</b>: acima de 70 sobrecomprado, abaixo de 30 sobrevendido.</li><li><b>Do máx.</b>: distância ao fecho máximo dos seis meses.</li></ul><p>Clique num cabeçalho para ordenar e outra vez para inverter. Nas obrigações as variações são em pontos base.</p>`},
  compare:{t:'Comparar ativos',b:`<p>Põe até quatro ativos na mesma escala: todos começam em 100 no início do intervalo. Um valor de 108 significa +8% desde então.</p><p>Escolha os ativos nos botões por cima do gráfico. As obrigações ficam de fora porque a yield não é um preço.</p>`},
  corr:{t:'Correlações',b:`<p>A correlação mede se dois ativos se movem juntos, de −1 a +1.</p><ul><li><b>Perto de +1</b>: sobem e descem nos mesmos dias.</li><li><b>Perto de 0</b>: sem relação.</li><li><b>Perto de −1</b>: quando um sobe o outro desce.</li></ul><p>É calculada sobre os retornos diários na janela escolhida (20, 60 ou 120 sessões). Serve para ver se duas posições são na prática a mesma aposta, ou se uma protege a outra.</p><p>O Nikkei fecha antes da abertura dos EUA, por isso a sua correlação diária com mercados americanos fica subestimada. As correlações mudam com o regime.</p>`},
  fxs:{t:'Força das moedas',b:`<p>Em vez de olhar par a par, mostra que moeda está a ganhar ou a perder contra as outras.</p><p>Para cada moeda calculamos o retorno contra o dólar e comparamos com a média das cinco. O resultado equivale ao retorno médio contra as outras quatro.</p><p>A ideia habitual é negociar a mais forte contra a mais fraca. Só há dados para USD, EUR, GBP, JPY e CAD.</p>`},
  spreads:{t:'Spreads e rácios',b:`<ul><li><b>Curva EUA 10A − 2A</b>: negativa (invertida) costuma anteceder abrandamento; a subir, o mercado espera cortes de juros ou mais crescimento.</li><li><b>EUA 10A − Bund</b>: diferencial de juros entre EUA e Alemanha. A alargar favorece o dólar contra o euro.</li><li><b>Brent − WTI</b>: prémio do petróleo europeu sobre o americano.</li><li><b>Ouro / Prata</b>: a subir indica procura de refúgio.</li><li><b>Cobre / Ouro</b>: a subir indica confiança no crescimento.</li><li><b>ETH / BTC</b>: apetite pelo risco dentro da cripto.</li><li><b>Nasdaq / S&amp;P 500</b>: tecnologia contra o mercado em geral.</li></ul><p>A última coluna mostra onde está o valor atual face aos últimos seis meses: 0% é o mínimo, 100% o máximo.</p>`},
  tpos:{t:'Tamanho da posição',b:`<p>Responde à pergunta: quanto posso comprar ou vender para perder apenas o que decidi arriscar, se o stop for atingido?</p><p><b>Unidades = risco ÷ (distância ao stop × taxa de conversão)</b></p><ul><li><b>Risco</b>: saldo × percentagem de risco. A regra clássica é 1% a 2% por operação.</li><li><b>Distância ao stop</b>: diferença entre entrada e stop. No câmbio mede-se em pips: 0,0001 na maioria dos pares e 0,01 nos pares com iene.</li><li><b>Taxa de conversão</b>: a perda é sempre na moeda cotada (a segunda do par) e tem de ser convertida para a moeda da conta. Vem das cotações, que têm atraso; corrija se precisar.</li><li><b>Margem</b>: valor da posição ÷ alavancagem. Na UE o máximo para retalho é 1:30 nos pares principais.</li></ul><p>Para índices, matérias-primas ou cripto escolha "Outro" e use o preço por unidade ou por contrato da sua corretora.</p>`},
  trr:{t:'Risco e retorno',b:`<ul><li><b>Rácio R:R</b>: quanto ganha no objetivo por cada unidade que arrisca até ao stop.</li><li><b>Acerto mínimo</b>: 1 ÷ (1 + R:R). É a taxa de acerto a partir da qual a estratégia não perde dinheiro.</li><li><b>Expectativa</b>: acerto × R:R − (1 − acerto). É o ganho médio por operação, em múltiplos do risco. Tem de ser positiva.</li></ul><p>Com R:R de 2, basta acertar mais de 33% das vezes. Com R:R de 0,5, precisa de acertar mais de 67%.</p>`},
  tpiv:{t:'Pontos pivot',b:`<p>Níveis de suporte (S) e resistência (R) para a sessão de hoje, calculados a partir do máximo, mínimo e fecho da sessão anterior.</p><ul><li><b>Clássico</b>: P = (máx. + mín. + fecho) ÷ 3; R1 = 2P − mín.; S1 = 2P − máx.</li><li><b>Fibonacci</b>: P ± 38,2%, 61,8% e 100% da amplitude.</li><li><b>Camarilla</b>: fecho ± amplitude × 1,1 ÷ 12, ÷ 6, ÷ 4 e ÷ 2. Os níveis 3 e 4 são os mais usados.</li></ul><p>Muitos operadores olham para os mesmos níveis, e é isso que lhes dá relevância.</p>`},
  tfib:{t:'Níveis de Fibonacci',b:`<p>Depois de um movimento forte, o preço costuma recuar uma parte antes de continuar. As retrações de Fibonacci marcam as zonas habituais: 23,6%, 38,2%, 50%, 61,8% e 78,6% do movimento.</p><p>As extensões (127,2% e 161,8%) servem de objetivos se o movimento continuar para lá do extremo.</p><p>Pode preencher com o fecho máximo e mínimo de um ativo nos últimos três meses. São fechos, por isso os extremos reais da sua plataforma podem diferir um pouco.</p>`},
  tdd:{t:'Perdas e recuperação',b:`<p>As perdas pesam mais do que os ganhos. Para recuperar uma perda de d é preciso ganhar <b>d ÷ (1 − d)</b>: perder 20% obriga a ganhar 25%; perder 50% obriga a ganhar 100%.</p><p>Uma série de perdas seguidas reduz a conta em 1 − (1 − risco)<sup>n</sup>. Com 1% por operação, dez perdas seguidas custam 9,6%. Com 5%, custam 40%.</p><p>É por isto que o risco por operação é a decisão mais importante.</p>`},
  tpip:{t:'Valor do pip',b:`<p>O pip é a unidade mínima habitual de variação de um par: 0,0001, ou 0,01 nos pares com iene.</p><p>O valor de um pip depende da <b>moeda cotada</b> (a segunda do par), não da base. Num lote padrão de 100 000 unidades, um pip vale 10 unidades da moeda cotada (1 000 no caso do iene), que depois se convertem para a moeda da conta.</p>`},
  journal:{t:'Diário de operações',b:`<p>O resultado de cada operação é medido em <b>R</b>, múltiplos do risco inicial: se arriscou 40 pips e ganhou 80, fez +2R; se foi parado, fez −1R. Assim pode comparar operações de tamanhos e ativos diferentes.</p><ul><li><b>Taxa de acerto</b>: percentagem de operações com R positivo.</li><li><b>Expectativa</b>: R médio por operação. Positiva significa que o método ganha a longo prazo.</li><li><b>Fator de lucro</b>: soma dos ganhos ÷ soma das perdas. Acima de 1 é lucrativo.</li><li><b>Maior queda</b>: a maior descida do R acumulado desde um máximo.</li></ul><p>Com menos de 30 operações estas estatísticas dizem pouco. As operações ficam guardadas em privado, só para a sua conta.</p>`},
};

// ================= Modelo de impacto =================
const COLS=[{id:'SPX',l:'S&P 500'},{id:'NDX',l:'Nasdaq 100'},{id:'DAX',l:'DAX'},{id:'PSI',l:'PSI'},{id:'US10Y',l:'Yield EUA 10A'},{id:'BUND',l:'Yield Bund 10A'},{id:'EURUSD',l:'EUR/USD'},{id:'USDJPY',l:'USD/JPY'},{id:'USDCAD',l:'USD/CAD'},{id:'DXY',l:'Dólar (DXY)'},{id:'GOLD',l:'Ouro'},{id:'BRENT',l:'Brent'},{id:'COPPER',l:'Cobre'},{id:'BTC',l:'Bitcoin'}];
const LABEL={SPX:'S&P 500',NDX:'Nasdaq 100',DJI:'Dow Jones',DAX:'DAX',ESTX50:'Euro Stoxx 50',PSI:'PSI',NIKKEI:'Nikkei 225',US2Y:'Yield EUA 2A',US10Y:'Yield EUA 10A',BUND:'Yield Bund 10A',EURUSD:'EUR/USD',GBPUSD:'GBP/USD',USDJPY:'USD/JPY',USDCAD:'USD/CAD',DXY:'Dólar (DXY)',BRENT:'Brent',WTI:'WTI',NATGAS:'Gás natural',GOLD:'Ouro',SILVER:'Prata',COPPER:'Cobre',BTC:'Bitcoin',ETH:'Ethereum',SOL:'Solana'};
const SHORT={SPX:'S&P',NDX:'Nasdaq',DAX:'DAX',PSI:'PSI',NIKKEI:'Nikkei',US10Y:'EUA 10A',BUND:'Bund',DXY:'DXY',EURUSD:'EUR/USD',USDJPY:'USD/JPY',GOLD:'Ouro',BRENT:'Brent',COPPER:'Cobre',BTC:'BTC'};
const ORDER=COLS.map(c=>c.id); const S=a=>Object.fromEntries(ORDER.map((k,i)=>[k,a[i]]));
const MX={'Emprego EUA':S([-1,-2,-1,-1,2,1,-2,2,1,2,-2,1,0,-2]),'Inflação EUA':S([-2,-2,-1,-1,2,1,-1,2,1,2,-1,0,-1,-2]),'Atividade EUA':S([0,-1,1,0,1,1,-1,1,0,1,-1,1,2,-1]),'Consumo EUA':S([1,0,0,0,1,0,-1,1,0,1,-1,1,1,0]),'Fed mais duro':S([-2,-2,-1,-1,2,1,-2,2,1,2,-2,-1,-1,-2]),'Inflação Zona Euro':S([0,0,-1,-1,0,2,2,0,0,-1,0,0,0,0]),'BCE mais duro':S([0,0,-1,-1,0,2,2,0,0,-1,0,0,0,0]),'Atividade Zona Euro':S([0,0,1,1,0,1,1,0,0,-1,0,0,0,0]),'China (procura)':S([0,0,1,0,0,0,0,0,-1,-1,1,1,2,0]),'Stocks de petróleo EUA':S([0,0,0,0,0,0,0,0,1,0,0,-2,0,0])};
const CATN={I:'Inflação',C:'Banco central',E:'Emprego',A:'Atividade',S:'Confiança',B:'Balança e fluxos',K:'Crédito e moeda',O:'Leilão de dívida'};
const MECH={I:'Inflação acima do esperado aumenta a probabilidade de juros mais altos: a moeda e as yields sobem e as ações tendem a descer.',C:'Uma decisão ou tom mais duro do banco central valoriza a moeda e sobe as yields; ações e ativos de risco sofrem. Um tom mais suave faz o contrário.',E:'Emprego forte sustenta a moeda e as yields. Com inflação alta e juros a subir, nos EUA e na Zona Euro é lido como risco de mais subidas, o que pesa nas ações.',A:'Atividade forte favorece a moeda, as ações cíclicas e as matérias-primas, e empurra as yields para cima.',S:'A confiança antecipa consumo e investimento: confiança mais alta ajuda a moeda e as ações domésticas, com efeito moderado.',B:'Balanças e fluxos mexem sobretudo na moeda. Nos stocks de energia, acumulação acima do esperado pressiona o preço em baixa.',K:'Crédito e massa monetária a crescer sinalizam procura interna e pressão sobre os preços: efeito moderado na moeda e nas yields.',O:'Num leilão, uma yield acima da anterior mostra que o mercado exige mais para financiar o Estado: as yields de mercado tendem a subir.'};
const FX={USD:{l:'Dólar (DXY)',s:1},EUR:{l:'EUR/USD',s:1},GBP:{l:'GBP/USD',s:1},JPY:{l:'USD/JPY',s:-1},AUD:{l:'AUD/USD',s:1},NZD:{l:'NZD/USD',s:1},CAD:{l:'USD/CAD',s:-1},CHF:{l:'USD/CHF',s:-1},CNY:{l:'USD/CNH',s:-1}};
const EQ={USD:['S&P 500','Nasdaq 100'],EUR:['DAX','Euro Stoxx 50'],GBP:['FTSE 100'],JPY:['Nikkei 225'],AUD:['ASX 200'],CAD:['TSX'],CHF:['SMI'],CNY:['CSI 300','Hang Seng'],NZD:['NZX 50'],BRL:['Ibovespa'],MXN:['IPC México'],INR:['Nifty 50'],KRW:['Kospi'],TRY:['BIST 100'],ZAR:['JSE Top 40'],SEK:['OMX Estocolmo'],NOK:['OBX Oslo'],PLN:['WIG20'],HKD:['Hang Seng'],SGD:['STI'],TWD:['Taiex']};
const BD={USD:'Yield EUA 10A',EUR:'Yield Bund 10A',GBP:'Yield Gilt 10A',JPY:'Yield JGB 10A',AUD:'Yield Austrália 10A',CAD:'Yield Canadá 10A',CHF:'Yield Suíça 10A',CNY:'Yield China 10A',NZD:'Yield NZ 10A'};
const CAT_W={I:{fx:1,bd:2,eq:-1},C:{fx:2,bd:2,eq:-1},E:{fx:1,bd:1,eq:1},A:{fx:1,bd:1,eq:1},S:{fx:1,bd:0,eq:1},B:{fx:1,bd:0,eq:0},K:{fx:1,bd:1,eq:0},O:{fx:0,bd:1,eq:0}};
const reOil=/(petr[óo]leo|crude|cushing|gasolina|destilad|aquecimento)/i,reStock=/(invent|reserva|stock)/i,reGas=/g[áa]s natural/i,reRigs=/(baker hughes|sondas|plataformas)/i,reCFTC=/(CFTC|posi[çc][õo]es l[íi]quidas)/i;
const effCache=new Map();
function effects(it){
  if(effCache.has(it.key)) return effCache.get(it.key);
  const r=(()=>{
  const out=[]; const add=(l,v)=>{ if(v) out.push({l,v}); };
  if(reCFTC.test(it.n)) return {list:[],raw:false,info:true};
  if(it.cur==='USD'&&reOil.test(it.n)&&reStock.test(it.n)) return {list:[{l:'Brent',v:-2},{l:'WTI',v:-2},{l:'USD/CAD',v:1}],raw:true};
  if(reGas.test(it.n)&&/armazen|invent/i.test(it.n)) return {list:[{l:'Gás natural',v:-2}],raw:true};
  if(reRigs.test(it.n)) return {list:[{l:'WTI',v:-1},{l:'Brent',v:-1}],raw:true};
  const w=CAT_W[it.cat]||CAT_W.A, cur=it.cur, fx=FX[cur]||{l:'USD/'+cur,s:-1};
  if(it.cat==='O'){ add(BD[cur]||('Yields '+cur),1); return {list:out,raw:true}; }
  add(fx.l,w.fx*fx.s);
  let eq=w.eq; if(it.cat==='E'&&(cur==='USD'||cur==='EUR')) eq=-1;
  (EQ[cur]||[]).forEach(e=>add(e,eq));
  if(cur==='EUR'&&(it.co==='Portugal'||it.co==='Zona Euro'||!it.co)) add('PSI',eq);
  add(BD[cur]||('Yields '+cur),w.bd);
  if(cur==='USD'){ if(it.cat==='I'||it.cat==='C'){add('Ouro',-2);add('Bitcoin',-2);add('EUR/USD',-1);} else if(it.cat==='E'){add('Ouro',-1);add('Bitcoin',-1);add('EUR/USD',-1);} else if(it.cat==='A'||it.cat==='S'){add('Ouro',-1);add('Cobre',1);} }
  if(cur==='CNY'&&(it.cat==='A'||it.cat==='B'||it.cat==='S')){add('Cobre',2);add('Brent',1);add('AUD/USD',1);}
  if(cur==='CNY'&&it.cat==='I') add('Cobre',1);
  if(cur==='EUR'&&(it.cat==='I'||it.cat==='C')) add('Dólar (DXY)',-1);
  const cap=it.imp>=2?2:1;
  return {list:out.map(e=>({l:e.l,v:Math.sign(e.v)*Math.min(Math.abs(e.v),cap)})),raw:false};})();
  effCache.set(it.key,r); return r;
}
function direction(it){
  if(it.a==null) return null; const E=effects(it);
  if(E.raw){ const ref=it.f!=null?it.f:it.v; if(ref==null) return {d:0,ref:null,raw:true}; return {d:Math.sign(it.a-ref),ref:it.f!=null?'previsão':'anterior',raw:true,diff:it.a-ref}; }
  if(it.s===1||it.s===-1) return {d:it.s,ref:it.f!=null?'previsão':'anterior',diff:it.f!=null?it.a-it.f:(it.v!=null?it.a-it.v:null)};
  if(it.f!=null) return {d:Math.sign(it.a-it.f)*(it.p||1),ref:'previsão',diff:it.a-it.f};
  if(it.v!=null) return {d:0,ref:'anterior',weak:Math.sign(it.a-it.v)*(it.p||1),diff:it.a-it.v};
  return {d:0,ref:null};
}

// ================= Estado e utilitários =================
const st={view:'painel',quotes:{},days:{},hist:{},items:[],meta:null,sel:null,asset:'SPX',range:92,ma:new Set([20]),period:'today',dayPick:null,imp:new Set([1,2,3]),state:'all',cur:new Set(),cat:'',q:'',limit:300,lastSeen:{},dbOk:null,
  sort:{k:'cls',dir:1},corWin:60,fxWin:7,cmp:['SPX','GOLD','BRENT','BTC'],cmpA:[null,null,null],ctype:'line',cmpRange:92,fav:new Set()};
const $=id=>document.getElementById(id);
const TZ='Europe/Lisbon';
const fT=new Intl.DateTimeFormat('pt-PT',{hour:'2-digit',minute:'2-digit',timeZone:TZ});
const fDay=new Intl.DateTimeFormat('pt-PT',{weekday:'long',day:'numeric',month:'long',timeZone:TZ});
const fWd=new Intl.DateTimeFormat('pt-PT',{weekday:'short',day:'numeric',timeZone:'UTC'});
const fWd2=new Intl.DateTimeFormat('pt-PT',{day:'numeric',month:'short',timeZone:'UTC'});
const fShort=new Intl.DateTimeFormat('pt-PT',{day:'numeric',month:'short',timeZone:TZ});
const fShortT=new Intl.DateTimeFormat('pt-PT',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',timeZone:TZ});
const fISO=new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:TZ});
const nf=(v,d)=>v==null||!isFinite(v)?'n/d':Number(v).toLocaleString('pt-PT',{minimumFractionDigits:d,maximumFractionDigits:d});
const sg=(v,d,u='')=>v==null||!isFinite(v)?'n/d':(v>0?'+':v<0?'−':'')+nf(Math.abs(v),d)+u;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ico=d=>'<svg class="ic" viewBox="0 0 256 256" aria-hidden="true"><path d="'+d+'"/></svg>';
const IC={x:'M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z',star:'M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z',starFill:'M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z'};
const dc=x=>x>0?'up':x<0?'down':'flat';
const arrows=v=>(v>0?'▲':'▼').repeat(Math.abs(v));
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function ago(iso){ if(!iso) return 'n/d'; const m=Math.round((Date.now()-new Date(iso))/60000); if(m<1) return 'agora'; if(m<60) return `há ${m} min`; const h=Math.round(m/60); if(h<48) return `há ${h} h`; return `há ${Math.round(h/24)} dias`; }
function until(ms){ let s=Math.max(0,Math.round((ms-Date.now())/1000)); const d=Math.floor(s/86400); s%=86400; const h=Math.floor(s/3600); s%=3600; const m=Math.floor(s/60); s%=60; return d>0?`em ${d}d ${h}h`:h>0?`em ${h}h ${String(m).padStart(2,'0')}m`:`em ${m}m ${String(s).padStart(2,'0')}s`; }
function addDays(iso,n){ const [y,m,d]=iso.split('-').map(Number); return new Date(Date.UTC(y,m-1,d+n)).toISOString().slice(0,10); }
function toTs(day,hhmm){ const [y,m,d]=day.split('-').map(Number); const [h,mi]=hhmm.split(':').map(Number); let t=Date.UTC(y,m-1,d,h,mi); const ld=fISO.format(new Date(t)); if(ld>day) t-=864e5; else if(ld<day) t+=864e5; return t; }
const today=()=>fISO.format(new Date());
function weekStart(iso){ const [y,m,d]=iso.split('-').map(Number); const wd=new Date(Date.UTC(y,m-1,d)).getUTCDay(); return addDays(iso,-((wd+6)%7)); }
function fv(it,v){ if(v==null) return 'n/d'; const u=it.u||''; const d=it.pr!=null?Math.min(it.pr,3):1; return nf(v,d)+(u==='%'?'%':u); }
function bars(n){ return `<span class="imp" role="img" aria-label="importância ${n} de 3">${[1,2,3].map(i=>`<i class="${i<=n?'on':''}"></i>`).join('')}</span>`; }
function qDec(q){ return q?.kind==='yield'?2:(q?.dec??(q?.price<10?4:2)); }
function fmtQ(q){ const y=q.kind==='yield'; const p=y?nf(q.price,2)+'%':nf(q.price,qDec(q)); const c=y?(q.chgBp==null?'n/d':sg(q.chgBp,1,' pb')):(q.chg==null?'n/d':sg(q.chg,2,'%')); return {p,c,v:y?q.chgBp:q.chg}; }
const pn=s=>{ const x=parseFloat(String(s??'').replace(/\s/g,'').replace(',','.')); return isFinite(x)?x:NaN; };
const decOf=s=>{ const m=String(s??'').replace(',','.').match(/\.(\d+)/); return m?Math.min(m[1].length,5):0; };
function store(k,v){ try{ if(v===undefined) return JSON.parse(localStorage.getItem('rm.'+k)); localStorage.setItem('rm.'+k,JSON.stringify(v)); }catch(e){ return null; } }

// ================= Séries e estatística =================
const YIELDS=new Set(['US2Y','US10Y','BUND']);
const isY=id=>st.quotes[id]?.kind==='yield'||YIELDS.has(id);
const isCont=id=>!!st.hist[id]?.cont;
const memo=new Map(); const M=(k,fn)=>{ if(!memo.has(k)) memo.set(k,fn()); return memo.get(k); };
// pontos para o gráfico: fechos diários + leituras horárias + última cotação
function series(id){
  const h=st.hist[id]; const out=[];
  if(h&&Array.isArray(h.c)){ const [y,m,d]=(h.base||'2026-04-01').split('-').map(Number); const b=Date.UTC(y,m-1,d);
    h.c.forEach((v,i)=>{ const o=h.cont?i:(h.o||[])[i]; if(o==null||v==null) return; out.push({t:Math.min(b+o*864e5+21*36e5,Date.now()-60e3),v:+v}); });
    (h.h||[]).forEach(p=>{ if(Array.isArray(p)&&p[1]!=null){ const t=p[0]*1000; if(!out.length||t>out[out.length-1].t) out.push({t,v:+p[1]}); } });
  }
  const q=st.quotes[id]; if(q&&q.price!=null&&q.updatedAt){ const t=+new Date(q.updatedAt); if(!out.length||t>out[out.length-1].t+30*60e3) out.push({t,v:+q.price}); }
  return out;
}
// fechos diários por data, com a cotação de hoje como último ponto provisório
function daily(id){ return M('d|'+id,()=>{
  const h=st.hist[id]; const out=[];
  if(h&&Array.isArray(h.c)){ const base=h.base||'2026-04-01'; h.c.forEach((v,i)=>{ const o=h.cont?i:(h.o||[])[i]; if(o==null||v==null) return; out.push({d:addDays(base,o),v:+v}); }); }
  const q=st.quotes[id]; if(q&&q.price!=null&&q.updatedAt&&out.length){ const qd=fISO.format(new Date(q.updatedAt)); const l=out[out.length-1]; if(qd>l.d) out.push({d:qd,v:+q.price}); else if(qd===l.d) l.v=+q.price; }
  return out; }); }
function rets(id){ return M('r|'+id,()=>{ const s=daily(id),y=isY(id),o=[]; for(let i=1;i<s.length;i++){ if(y) o.push({d:s[i].d,r:(s[i].v-s[i-1].v)*100}); else if(s[i].v>0&&s[i-1].v>0) o.push({d:s[i].d,r:Math.log(s[i].v/s[i-1].v)*100}); } return o; }); }
const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
function sd(a){ if(a.length<2) return NaN; const m=mean(a); return Math.sqrt(a.reduce((x,y)=>x+(y-m)*(y-m),0)/(a.length-1)); }
function sdDaily(id,n){ const r=rets(id).slice(-n).map(x=>x.r); return r.length>=Math.min(n,10)?sd(r):NaN; }
function volAnn(id,n){ return sdDaily(id,n)*Math.sqrt(isCont(id)?365:252); }
function sma(vals,n){ if(vals.length<n) return NaN; return mean(vals.slice(-n)); }
function smaSeries(s,n){ const o=[]; let sum=0; for(let i=0;i<s.length;i++){ sum+=s[i].v; if(i>=n) sum-=s[i-n].v; if(i>=n-1) o.push({d:s[i].d,v:sum/n}); } return o; }
function rsi(vals,n=14){ if(vals.length<n+1) return NaN; let g=0,l=0; for(let i=1;i<=n;i++){ const c=vals[i]-vals[i-1]; if(c>0) g+=c; else l-=c; } g/=n; l/=n;
  for(let i=n+1;i<vals.length;i++){ const c=vals[i]-vals[i-1]; g=(g*(n-1)+Math.max(c,0))/n; l=(l*(n-1)+Math.max(-c,0))/n; } return l===0?100:100-100/(1+g/l); }
function chgSince(id,days){ const s=daily(id); if(s.length<2) return null; const last=s[s.length-1],cut=addDays(last.d,-days); let ref=null; for(let i=s.length-2;i>=0;i--){ if(s[i].d<=cut){ ref=s[i]; break; } } if(!ref) return null; return isY(id)?(last.v-ref.v)*100:(last.v/ref.v-1)*100; }
function dayChg(id){ const q=st.quotes[id]; if(!q) return null; return q.kind==='yield'?q.chgBp??null:q.chg??null; }
function fmtChg(id,x,dayRow){ if(x==null||!isFinite(x)) return 'n/d'; return isY(id)?sg(x,dayRow?1:0,' pb'):sg(x,2,'%'); }
function corr(a,b,n){ return M('c|'+a+'|'+b+'|'+n,()=>{ const A=daily(a),B=new Map(daily(b).map(p=>[p.d,p.v])); const com=A.filter(p=>B.has(p.d)).slice(-(n+1)); if(com.length<Math.min(n,15)) return NaN;
  const ya=isY(a),yb=isY(b),x=[],y=[]; for(let i=1;i<com.length;i++){ const a0=com[i-1].v,a1=com[i].v,b0=B.get(com[i-1].d),b1=B.get(com[i].d); x.push(ya?a1-a0:Math.log(a1/a0)); y.push(yb?b1-b0:Math.log(b1/b0)); }
  const mx=mean(x),my=mean(y); let sxy=0,sx=0,sy=0; for(let i=0;i<x.length;i++){ sxy+=(x[i]-mx)*(y[i]-my); sx+=(x[i]-mx)**2; sy+=(y[i]-my)**2; } return sx&&sy?sxy/Math.sqrt(sx*sy):NaN; }); }
function techOf(id){ return M('t|'+id,()=>{ const s=daily(id); if(s.length<25) return null; const v=s.map(p=>p.v),last=v[v.length-1],y=isY(id);
  const m20=sma(v,20),m50=sma(v,50),m100=sma(v,100),s20=sd(v.slice(-20)); const hi=Math.max(...v),lo=Math.min(...v);
  const dist=m=>!isFinite(m)?null:y?(last-m)*100:(last/m-1)*100; const sdd=sdDaily(id,20);
  return {last,m20,m50,m100,d20:dist(m20),d50:dist(m50),d100:dist(m100),rsi:rsi(v),z:s20?(last-m20)/s20:NaN,vol20:volAnn(id,20),vol60:volAnn(id,60),sdd,move:y?sdd:last*sdd/100,hi,lo,pos:hi>lo?(last-lo)/(hi-lo)*100:NaN,fromHi:y?(last-hi)*100:(last/hi-1)*100,
    trend:isFinite(m50)?(last>m20&&m20>m50?1:last<m20&&m20<m50?-1:0):null}; }); }
function zDay(id){ const c=dayChg(id),s=sdDaily(id,60); return c==null||!s?null:c/s; }

// ================= Sessões =================
const SESS=[{k:'Sydney',tz:'Australia/Sydney',o:7,c:16},{k:'Tóquio',tz:'Asia/Tokyo',o:9,c:18},{k:'Londres',tz:'Europe/London',o:8,c:17},{k:'Nova Iorque',tz:'America/New_York',o:8,c:17}];
const tzF={}; function tzParts(ms,tz){ const f=tzF[tz]||(tzF[tz]=new Intl.DateTimeFormat('en-CA',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})); const o={}; f.formatToParts(new Date(ms)).forEach(p=>o[p.type]=+p.value); return o; }
function tzOff(ms,tz){ const p=tzParts(ms,tz); return Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute)-Math.floor(ms/60000)*60000; }
function zoned(y,m,d,h,mi,tz){ const g=Date.UTC(y,m-1,d,h,mi); const t=g-tzOff(g,tz); return g-tzOff(t,tz); }
function dayStartLisbon(iso){ const [y,m,d]=iso.split('-').map(Number); return zoned(y,m,d,0,0,TZ); }
function sessionWindows(t0){ const t1=t0+864e5; return SESS.map(s=>{ const w=[],seen=new Set(); for(let k=-1;k<=1;k++){ const p=tzParts(t0+k*864e5+12*36e5,s.tz),key=p.year+'-'+p.month+'-'+p.day; if(seen.has(key)) continue; seen.add(key);
    const wd=new Date(Date.UTC(p.year,p.month-1,p.day)).getUTCDay(); if(wd===0||wd===6) continue; const a=zoned(p.year,p.month,p.day,s.o,0,s.tz),b=zoned(p.year,p.month,p.day,s.c,0,s.tz); if(b>t0&&a<t1) w.push([Math.max(a,t0),Math.min(b,t1)]); }
  return {k:s.k,w}; }); }

// ================= Calendário: dados =================
function rebuild(){
  const arr=[]; effCache.clear();
  for(const [day,doc] of Object.entries(st.days)) for(const [id,r] of Object.entries(doc.items||{})){ if(!Array.isArray(r)) continue;
    const it={id,key:day+'|'+id,day,time:r[0],cur:r[1],co:r[2],n:r[3],imp:r[4]||1,cat:r[5]||'A',a:r[6],f:r[7],v:r[8],u:r[9],s:r[10],p:r[11]??1,ref:r[12],pr:r[13]}; it.ts=toTs(day,it.time); arr.push(it); }
  arr.sort((x,y)=>x.ts-y.ts||y.imp-x.imp); st.items=arr;
}
function range(){ const t=today(),ws=weekStart(t); if(st.period==='day'&&st.dayPick) return [st.dayPick,st.dayPick];
  return {yesterday:[addDays(t,-1),addDays(t,-1)],today:[t,t],tomorrow:[addDays(t,1),addDays(t,1)],week:[ws,addDays(ws,6)],next:[addDays(ws,7),addDays(ws,13)]}[st.period]||['0000','9999']; }
function filtered(){ const [a,b]=range(),now=Date.now(),q=st.q.trim().toLowerCase();
  return st.items.filter(it=>{ if(it.day<a||it.day>b||!st.imp.has(it.imp)) return false; if(st.cur.size&&!st.cur.has(it.cur)) return false; if(st.cat&&it.cat!==st.cat) return false;
    if(st.state==='out'&&it.a==null) return false; if(st.state==='up'&&it.ts<=now) return false; if(st.state==='surp'){ const d=direction(it); if(!d||!d.d) return false; }
    if(q&&!(it.n.toLowerCase().includes(q)||(it.co||'').toLowerCase().includes(q)||it.cur.toLowerCase().includes(q))) return false; return true; }); }
function impactInline(it,max=4){
  const E=effects(it); if(E.info) return '<span class="muted">Posicionamento especulativo (informativo)</span>';
  const d=direction(it); const top=E.list.slice().sort((x,y)=>Math.abs(y.v)-Math.abs(x.v)).slice(0,max);
  if(d&&d.d){ const lbl=E.raw?(d.d>0?'Acima do esperado':'Abaixo do esperado'):(d.d>0?`Positivo ${it.cur}`:`Negativo ${it.cur}`);
    return `<span class="pill ${E.raw?'warn':dc(d.d)}">${esc(lbl)}</span>`+top.map(e=>`<span class="eff ${dc(e.v*d.d)}">${esc(e.l)} ${arrows(e.v*d.d)}</span>`).join(''); }
  if(d) return `<span class="pill flat">${d.weak!=null?'Sem previsão':'Em linha'}</span>`+(d.weak?`<span class="muted">face ao anterior: ${d.weak>0?'mais forte':'mais fraco'}</span>`:'');
  if(!top.length) return '';
  return `<span class="muted">Se acima:</span>`+top.slice(0,3).map(e=>`<span class="eff ${dc(e.v)}">${esc(e.l)} ${arrows(e.v)}</span>`).join('');
}
function valsCell(it,wide){ const now=Date.now(),past=it.ts<=now,d=direction(it),pf=fv(it,it.f),pv=fv(it,it.v); let a='';
  if(it.a!=null) a=`<b class="${dc(d?.d||0)}">${fv(it,it.a)}</b>`;
  else if(past&&(it.f!=null||it.v!=null)) a='<span class="pill warn">a aguardar</span>';
  else if(!past) a=`<span class="cd${it.ts-now<36e5?' soon':''}" data-cd="${it.ts}">${until(it.ts)}</span>`;
  if(!(it.a!=null||it.f!=null||it.v!=null||!past)) return '';
  return wide?`<span class="va">${a}</span><span class="vf">${it.f!=null?pf:''}</span><span class="vp">${it.v!=null?pv:''}</span>`:`<span class="va">${a}</span><span class="vm">prev ${pf} · ant ${pv}</span>`; }
function evRow(it,sel,max,wide){ const co=it.co&&!it.n.includes(it.co)?` <span class="co">· ${esc(it.co)}</span>`:'';
  const soon=it.a==null&&it.ts>Date.now()&&it.ts-Date.now()<36e5;
  return `<button class="row${wide?' wide':''}${sel?' sel':''}" data-ev="${esc(it.id)}"><span class="t${soon?' soon':''}">${fT.format(new Date(it.ts))}</span><span class="cur">${esc(it.cur)}</span><span class="ttl">${esc(it.n)}${co}${bars(it.imp)}</span><span class="vals">${valsCell(it,wide)}</span><span class="improw">${impactInline(it,max)}</span></button>`; }
