// ================= Aprender: módulo «psicologia» =================
// Regras de Portugal só com fonte oficial (campo `src`); o que não ficou confirmado leva `pending:true` («Por confirmar»).

// Exemplo do tema «Vieses»: dois investidores com o mesmo mercado (6% ao ano), um que o acompanha e outro que perde 1,5 pontos por ano a entrar e sair. Valores de exemplo.
const _psi_calmo=lrnCompound({initial:5000,monthly:150,rate:6,years:25}).at(-1);
const _psi_nervoso=lrnCompound({initial:5000,monthly:150,rate:4.5,years:25}).at(-1);
// Exemplo do tema «FOMO e pânico»: quem compra no topo e quem fica investido.
const _psi_rec=(q)=>q/(100-q)*100;

LRN.push(
{ id:'vieses', topic:'psicologia', o:1, title:'Vieses que custam dinheiro', mins:9,
  lead:'O teu cérebro foi afinado para sobreviver em grupos pequenos, não para decidir sobre carteiras. Há erros de pensamento previsíveis que tanto o principiante como o profissional cometem, e saber dar-lhes nome é o primeiro passo para não pagares por eles.',
  blocks:[
    {t:'h',id:'h1',x:'Porque é que pensamos mal sobre dinheiro'},
    {t:'p',id:'p1',x:'Imagina que ouves um ruído no mato. O antepassado que fugia sempre, mesmo quando era só o vento, sobrevivia mais vezes do que o que parava para analisar. O nosso cérebro herdou atalhos assim: rápidos, automáticos e quase sempre bons para a vida de todos os dias. Chamam-se <b>heurísticas</b> (regras práticas de pensamento). O problema é que, em finanças, o mundo mudou mais depressa do que o cérebro, e esses mesmos atalhos produzem erros sistemáticos a que se chama <b>vieses cognitivos</b>.'},
    {t:'p',id:'p2',x:'«Sistemáticos» é a palavra importante. Um erro ao acaso ora te favorece ora te prejudica e, com o tempo, anula-se. Um viés empurra sempre para o mesmo lado: comprar tarde, vender cedo, ficar agarrado ao que já perdeu. É por isso que custa dinheiro a sério. A área que estuda isto chama-se <b>finanças comportamentais</b> e juntou psicólogos e economistas; dois deles, Daniel Kahneman e Amos Tversky, mostraram nos anos 70 que as pessoas não decidem como as fórmulas de manual assumem.'},

    {t:'h',id:'h2',x:'Os cinco que mais se repetem'},
    {t:'cmp',id:'c1',head:['Viés','O que é','Como custa dinheiro'],rows:[
      ['Aversão à perda','Uma perda dói bastante mais do que um ganho do mesmo tamanho dá prazer (em muitas experiências, cerca do dobro)','Vendes os ganhos cedo, para os garantires, e seguras as perdas à espera de recuperar'],
      ['Excesso de confiança','Achamos que sabemos mais do que sabemos e que prevemos melhor do que prevemos','Negociar demais, concentrar tudo numa ideia, ignorar o risco'],
      ['Efeito rebanho','Seguir o que os outros fazem, sobretudo quando estão todos a fazer o mesmo','Comprar caro na euforia e vender barato no pânico'],
      ['Ancoragem','Agarrar-se a um número de referência, como o preço a que compraste','Recusar vender «até voltar ao que paguei» ou achar barato o que caiu muito'],
      ['Confirmação','Procurar e lembrar só a informação que dá razão ao que já pensas','Ignorar os sinais de que a tua ideia está errada']]},
    {t:'p',id:'p3',x:'Vamos ver cada um com uma situação do dia a dia, porque reconhecê-los em ti é mais útil do que decorar a tabela.'},

    {t:'h',id:'h3',x:'Como cada viés se disfarça'},
    {t:'p',id:'p4',x:'<b>Aversão à perda.</b> Tens duas ações. Uma subiu 20% desde que a compraste, a outra caiu 20%. A tentação é vender a que subiu («ficar com o lucro») e esperar pela que caiu («só vendo quando recuperar»). Fazer isto sistematicamente chama-se <i>efeito de disposição</i>: cortas as vencedoras, que provavelmente continuariam a crescer, e guardas as perdedoras, que podem continuar a cair. Vender uma perda é admitir o erro; enquanto não vendes, a perda parece «ainda não real». Mas o dinheiro perdido já está perdido: o que conta é se, <i>hoje</i>, essa ação é a melhor forma de usar esse dinheiro.'},
    {t:'p',id:'p5',x:'<b>Excesso de confiança.</b> Uma sondagem clássica pergunta a condutores se conduzem melhor do que a média, e a maioria diz que sim, o que é matematicamente impossível. Em investimento, o mesmo leva a trocar muito de posições, a achar que se adivinha o momento certo para entrar e sair e a pôr demasiado dinheiro numa só ideia. Estudos com contas de corretoras mostraram que quem negoceia mais costuma ter piores resultados líquidos, porque cada operação tem custos e a «vantagem» que se julga ter não existe.'},
    {t:'p',id:'p6',x:'<b>Efeito rebanho.</b> Seguir os outros costuma ser sensato: se um restaurante está cheio, provavelmente é bom. Na bolsa, o preço sobe <i>porque</i> há mais compradores, e isso atrai mais compradores, que fazem subir o preço, que atrai mais gente. O sinal «toda a gente está a comprar» confunde-se com o sinal «é bom negócio». Quando a maré vira, o mesmo mecanismo funciona ao contrário.'},
    {t:'p',id:'p7',x:'<b>Ancoragem.</b> O preço a que compraste é, para o mercado, irrelevante: ele não sabe quanto pagaste. Mesmo assim, é o número que mais nos pesa («não vendo abaixo de 50»). A âncora também engana ao contrário: uma ação que caiu de 100 € para 40 € parece «uma pechincha» só porque olhas para o máximo, quando a queda pode ter razões sólidas. Um preço só é barato ou caro em relação ao valor da empresa, não em relação ao passado dele.'},
    {t:'p',id:'p8',x:'<b>Confirmação.</b> Depois de comprares uma ação, reparas em todas as notícias boas sobre ela e desvalorizas as más. Segues no Instagram ou no Telegram quem pensa como tu, e o algoritmo trata de te mostrar mais do mesmo. O resultado é sentires-te cada vez mais seguro, não porque tenhas mais razão, mas porque deixaste de ouvir quem discorda.'},

    {t:'h',id:'h4',x:'Quanto custa um viés, em euros'},
    {t:'p',id:'p9',x:'Os vieses não custam só nervos. Para ver o efeito, compara dois investidores com o mesmo mercado (valor de exemplo: 6% ao ano) e o mesmo esforço: 5 000 € iniciais e 150 € por mês durante 25 anos. O primeiro mantém o plano. O segundo vende nas quedas, volta depois das subidas e perde, em média, 1,5 pontos percentuais por ano a entrar e sair tarde (também um valor de exemplo, mas a ordem de grandeza é plausível):'},
    {t:'stat',id:'s1',v:Math.round(_psi_calmo.total),label:'Investidor que mantém o plano (6% ao ano)'},
    {t:'stat',id:'s2',v:Math.round(_psi_nervoso.total),label:'Investidor que perde 1,5 pontos por ano com o comportamento (4,5%)'},
    {t:'stat',id:'s3',v:Math.round(_psi_calmo.total-_psi_nervoso.total),label:'Diferença, sem que nenhum tenha poupado menos'},
    {t:'p',id:'p10',x:'Ambos depositaram o mesmo dinheiro (' + _e(_psi_calmo.paid) + '). A diferença vem só do comportamento. É a razão pela qual se diz que o maior risco de um investidor costuma ser ele próprio.'},

    {t:'h',id:'h5',x:'Um caso real: a bolha da internet'},
    {t:'p',id:'p11',x:'Entre 1998 e março de 2000, as ações de tecnologia dispararam. Empresas sem lucros, e algumas sem produto, valiam milhares de milhões só por terem «.com» no nome. Quem duvidava ouvia que «as regras antigas já não valem». Era o efeito rebanho e o excesso de confiança em grande escala: as pessoas compravam porque os vizinhos estavam a ganhar. Depois do pico, o índice tecnológico norte-americano (Nasdaq) caiu durante cerca de dois anos e perdeu bem mais de metade do valor; muitas empresas desapareceram. Quem ancorou no preço máximo e esperou voltar a ver esse nível teve de esperar mais de uma década. Os negócios eram reais; o preço pago por eles é que era absurdo.'},

    {t:'h',id:'h6',x:'Como se contornam, já que não se eliminam'},
    {t:'p',id:'p12',x:'Saber que um viés existe não o desliga; os investigadores caem neles tal como toda a gente. O que funciona é mudar o <i>ambiente</i> das decisões, para que o impulso tenha menos espaço:'},
    {t:'ul',id:'u1',x:[
      '<b>Plano escrito antes</b> de investir: objetivo, prazo, alocação e o que farás numa queda de 20% ou 30%. Decidir a frio vale mais do que decidir a quente.',
      '<b>Automatizar</b> a poupança e as compras regulares: a decisão é tomada uma vez e depois o dinheiro vai sozinho.',
      '<b>Regra de espera</b>: antes de qualquer decisão grande (vender tudo, comprar uma ideia nova), esperar 48 horas e escrever as razões.',
      '<b>Procurar quem discorda</b>: antes de comprar, escreve três razões pelas quais podes estar errado e procura a melhor crítica à tua ideia.',
      '<b>Olhar menos</b>: rever a carteira uma ou duas vezes por ano chega; ver o preço todos os dias só alimenta a aversão à perda.',
      '<b>Registar</b> as decisões e o motivo (a vista <b>Diário</b> deste site serve para isso), para poderes avaliar, mais tarde, se o raciocínio era bom e não só se teve sorte.']},

    {t:'h',id:'h7',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      'Achar que isto «só acontece aos outros»: todos temos estes vieses, e quem diz que não os tem é o que menos os vê.',
      'Confundir <b>um bom resultado</b> com uma <b>boa decisão</b>: apostar tudo e ganhar não prova que a decisão foi boa, só que correu bem.',
      'Mudar de estratégia a cada notícia ou a cada conselho de amigos e redes sociais.',
      'Medir o investimento pelo preço de compra, e não pelo que vale hoje e pelo que se espera dele.',
      'Concentrar muito numa só empresa por se ter «certeza» sobre ela (muitas vezes a empresa onde se trabalha).']},

    {t:'h',id:'h8',x:'Em Portugal'},
    {t:'p',id:'p13',x:'Nada disto é «estrangeiro»: os investidores portugueses também sentem o efeito rebanho, por exemplo em ciclos de imobiliário ou em modas de criptoativos. Uma ajuda prática é evitar decidir sobre vendas perto do fim do ano só por causa dos impostos ou por ver um resumo de ganhos: vê o tema «Mais-valias: quanto imposto pagas ao vender» para perceberes como funciona o imposto antes de deixares que ele dirija uma decisão. E, se fores buscar a dedução do PPR por impulso, lê primeiro o tema «PPR ou investir por conta própria».'},

    {t:'h',id:'h9',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'Os vieses são erros <b>sistemáticos</b>: empurram sempre para o mesmo lado, por isso custam dinheiro ao longo dos anos.',
      'Cinco comuns: aversão à perda, excesso de confiança, efeito rebanho, ancoragem e confirmação.',
      'O preço a que compraste é irrelevante para o mercado; o que conta é o que a decisão vale daqui para a frente.',
      'Não os eliminas, mas podes desenhar regras que lhes tiram força: plano escrito, automação, tempo de espera e quem discorde de ti.',
      'Um pequeno custo comportamental por ano, repetido durante décadas, pode valer dezenas de milhares de euros.']},

    {t:'decide',id:'q1',ensina:['c1','p7'],label:'Decide',q:'Compraste uma ação a 50 € e agora vale 35 €. Recusas vender «até voltar aos 50». Que viés é este?',o:['Efeito rebanho','Ancoragem no preço de compra, ligada à aversão à perda','Excesso de confiança apenas'],c:1,why:'Agarrar-se ao preço pago e evitar concretizar a perda são a ancoragem e a aversão à perda a trabalhar juntas. O mercado não sabe que pagaste 50 €; o que importa é o futuro da ação.'},
    {t:'decide',id:'q2',ensina:['p4'],label:'Decide',q:'Tens duas ações: uma subiu 20% e a outra caiu 20%. Vendes a que subiu para «garantir o lucro» e guardas a que caiu. O que podes estar a fazer?',o:['O efeito de disposição: cortas as vencedoras e seguras as perdedoras','Diversificar corretamente','Seguir a ancoragem só'],c:0,why:'Vender as que ganham e guardar as que perdem é o efeito de disposição, ligado à aversão à perda. A pergunta certa é qual das duas é hoje a melhor aplicação do teu dinheiro.'},
    {t:'fazve',id:'q3',ensina:['p9','s3'],q:'No exemplo, qual é a diferença final, em euros, entre quem mantém o plano e quem perde 1,5 pontos por ano com o comportamento?',unit:'€',answer:_psi_calmo.total-_psi_nervoso.total,tol:.02,why:'Os dois depositaram o mesmo; a diferença vem só da taxa de retorno efetiva (6% contra 4,5%), composta durante 25 anos. É o preço de um comportamento que parece pequeno em cada ano.'},
    {t:'decide',id:'q4',ensina:['u1'],label:'Decide',q:'Qual destas estratégias ajuda a contornar vieses emocionais?',o:['Comprar sempre que as notícias estão otimistas','Ter um plano escrito, compras automáticas e um tempo de espera antes de decisões grandes','Seguir a opinião do último amigo com quem falaste'],c:1,why:'Planos escritos, automação e tempo de espera tiram a decisão do momento emocional.'},
    {t:'erro',id:'q5',ensina:['p8'],label:'Encontra o erro',q:'Compraste uma ação e, para decidires se mantens, só lês artigos de quem a recomenda. «Assim fico bem informado.» Qual é o erro?',o:['Nenhum, ler quem sabe do tema é suficiente','Viés de confirmação: só procuras informação que concorda contigo','Efeito rebanho em exclusivo'],c:1,why:'Procurar só o que dá razão ao que já pensas deixa-te cego aos riscos. O hábito certo é procurar ativamente a melhor crítica à tua ideia.'}
  ], src:[] },

{ id:'fomo-panico', topic:'psicologia', o:2, title:'FOMO e pânico', mins:9,
  lead:'Comprar no topo por medo de ficar de fora e vender no fundo por medo de perder tudo é o par de erros mais caro do investimento. Percebe-lo ajuda a travar na altura em que mais custa.',
  blocks:[
    {t:'h',id:'h1',x:'Dois lados do mesmo medo'},
    {t:'p',id:'p1',x:'<b>FOMO</b> vem do inglês <i>fear of missing out</i>, medo de perder a oportunidade. Aparece quando tudo sobe e toda a gente fala disso: colegas, notícias, redes sociais. Quem ficou de fora sente que está a deixar dinheiro na mesa e compra tarde, a preços altos. O <b>pânico</b> é o espelho: quando tudo cai, vendes para parar a dor. Em ambos os casos, a decisão é tomada pela emoção e no pior momento possível.'},
    {t:'p',id:'p2',x:'Pensa num concerto com a porta fechada. Cá fora, a multidão grita e todos querem entrar; lá dentro, quando alguém grita «fogo», todos querem sair. O medo coletivo faz com que ninguém pense. Os mercados funcionam assim: o preço sobe e desce não só por causa das empresas, mas por causa do que as pessoas <i>sentem</i> sobre elas.'},

    {t:'h',id:'h2',x:'O ciclo emocional do mercado'},
    {t:'p',id:'p3',x:'Muitos autores descrevem o ciclo de um mercado como uma sequência de emoções. Não é uma lei, mas serve de mapa:'},
    {t:'cmp',id:'c1',head:['Fase','O que se sente','O que se faz tipicamente'],rows:[
      ['Otimismo','As coisas vão bem, os primeiros ganhos aparecem','Compra-se mais'],
      ['Euforia','«Isto só sobe», todos falam de bolsa, as notícias festejam','Compra-se tudo, entra dinheiro que nunca tinha investido, usa-se alavancagem'],
      ['Ansiedade e negação','Os preços caem, «é uma correção, vai passar»','Não se faz nada, ou compra-se mais para «aproveitar»'],
      ['Pânico','«Vou perder tudo», as notícias só falam de crise','Vende-se, muitas vezes no pior preço'],
      ['Desânimo','Ninguém quer ouvir falar de bolsa','Fica-se de fora, e perde-se a recuperação']]},
    {t:'p',id:'p4',x:'Repara que as <b>decisões mais caras acontecem nas pontas</b>: na euforia (compra) e no pânico (venda). É o contrário do que quer dizer «comprar barato e vender caro», mas é exatamente o que a emoção pede.'},

    {t:'h',id:'h3',x:'O custo duplo do pânico'},
    {t:'p',id:'p5',x:'Quem vende numa queda concretiza a perda: o que era «uma descida no ecrã» passa a ser dinheiro que já não volta. Mas há um segundo custo, menos visível. Quem vende em baixo normalmente só volta a comprar quando se sente seguro, e isso acontece quando o mercado já recuperou. Perdes na queda <i>e</i> perdes a subida.'},
    {t:'p',id:'p6',x:'A matemática da recuperação também joga contra ti: depois de cair 50%, não basta subir 50% para voltar ao início, é preciso subir 100%. Experimenta com valores diferentes:'},
    {t:'w',id:'w1',w:'calc',c:'drawdown'},
    {t:'p',id:'p7',x:'Para uma queda de 30%, a subida necessária é ' + _psi_rec(30).toFixed(1).replace('.',',') + '%. Para 50%, 100%. Quanto maior a queda, mais difícil é recuperar; por isso as quedas profundas são tão traiçoeiras, e por isso quem aguenta (ou compra mais, se tiver margem) tem a recuperação do seu lado.'},
    {t:'p',id:'p8',x:'Estudos de comportamento de investidores de fundos mostram, em vários países, que o retorno real que as pessoas obtêm costuma ficar abaixo do retorno do próprio fundo, porque entram depois de as subidas já terem ocorrido e saem depois das quedas. Os números exatos variam de estudo para estudo; o que se repete é o sentido da diferença.'},

    {t:'h',id:'h4',x:'Um caso real: março de 2020'},
    {t:'p',id:'p9',x:'Em fevereiro e março de 2020, com a chegada da covid-19, as bolsas mundiais tiveram uma das quedas mais rápidas da história: em poucas semanas, muitos índices perderam cerca de um terço do valor. As notícias eram assustadoras e muita gente vendeu. Nos meses seguintes, ajudados por apoios de governos e bancos centrais, os mercados recuperaram a grande velocidade, e vários índices chegaram a novos máximos ainda nesse ano. Quem vendeu no pânico perdeu a queda e a recuperação; quem manteve o plano (ou continuou a comprar todos os meses) viu a perda desaparecer. Nem sempre as recuperações são tão rápidas (depois de 2008 demoraram anos), mas o padrão é o mesmo: as piores decisões foram tomadas nos dias de maior medo.'},

    {t:'h',id:'h5',x:'O que fazer antes de a emoção chegar'},
    {t:'ul',id:'u1',x:[
      'Define <b>antecipadamente</b> o que farás se a carteira cair 20% ou 30%. Escreve-o. Na altura, relê.',
      'Investe dinheiro de que <b>não precisas</b> a curto prazo, para não seres obrigado a vender no fundo. Isto liga-se ao fundo de emergência: tem as despesas de alguns meses em liquidez, fora da carteira.',
      'Escolhe uma <b>alocação que consigas aguentar</b>: se uma queda de 30% te tirar o sono, tens ações a mais. É melhor uma carteira ligeiramente menos rentável que consigas manter do que uma ótima que abandonas na primeira crise.',
      '<b>Compra de forma regular</b> (todos os meses), para não teres de decidir o momento. Nas quedas, a mesma quantia compra mais unidades.',
      'Diminui a frequência com que olhas para a carteira e silencia notificações de preços.',
      'Quando sentires FOMO, faz uma pausa de 48 horas e pergunta-te: «Se este ativo ainda não tivesse subido, eu compraria?»']},

    {t:'h',id:'ha',x:'O que se passa no corpo quando o preço cai'},
    {t:'p',id:'pa',x:'Ver uma carteira a perder valor ativa no cérebro os mesmos circuitos de alarme que uma ameaça física: o coração acelera, a atenção estreita-se e a vontade de «fazer alguma coisa» fica quase irresistível. O problema é que, num mercado, <b>fazer alguma coisa raramente é a melhor ação</b>; a melhor costuma ser não fazer nada, ou seguir o plano. Saber que a reação é fisiológica ajuda a tratá-la como o que é: um alarme falso, que não precisa de ser obedecido.'},
    {t:'p',id:'pb',x:'Uma técnica simples é a <b>pausa de 24 horas</b>: se sentes vontade de vender tudo, escreve num papel a razão e a hora, e só decides no dia seguinte. A maior parte das vezes, a urgência passou. Outra é perguntares-te: «Se eu não tivesse nada investido hoje, compraria isto com estes preços?». Se a resposta for sim, vender não faz sentido.'},

    {t:'h',id:'hb',x:'Um plano para uma queda de 30%, passo a passo'},
    {t:'p',id:'pc',x:'Imagina que tens 20 000 € investidos e o mercado cai 30%. Do teu ecrã desaparecem 6 000 €, e a carteira passa a valer 14 000 €. Em vez de reagires, usa uma lista que escreveste antes, em calma:'},
    {t:'ul',id:'ua',x:[
      '<b>Passo 1, respirar</b>: nada de decisões nas primeiras 24 horas.',
      '<b>Passo 2, verificar o essencial</b>: o dinheiro de que precisas nos próximos anos está fora da carteira? O fundo de emergência está intacto?',
      '<b>Passo 3, rever o motivo da queda</b>: é uma descida do mercado em geral, ou algo que mudou no ativo em concreto (por exemplo, uma empresa em risco real)? Para um ETF global diversificado, a primeira é a regra.',
      '<b>Passo 4, seguir o plano</b>: se o plano diz «comprar todos os meses», continua. Se a carteira já não é a que escolheste, rebalanceia, mas sem alterar o objetivo.',
      '<b>Passo 5, registar</b> o que sentiste e o que decidiste no <b>Diário</b>, para aprenderes com a experiência.']},
    {t:'p',id:'pd',x:'Há um argumento prático para manter as compras regulares nas quedas. Com 200 € por mês, quando o preço de uma unidade de ETF é 100 €, compras ' + (200/100).toFixed(1).replace('.',',') + ' unidades; se o preço cair para 70 €, esses mesmos 200 € compram ' + (200/70).toFixed(2).replace('.',',') + ' unidades, isto é, cerca de ' + Math.round((100/70-1)*100) + '% mais. Quando o mercado recuperar, essas unidades extra valem mais. Não é garantido, mas é o contrário do instinto de fugir.'},

    {t:'h',id:'hc',x:'Outro caso: o ciclo das criptomoedas'},
    {t:'p',id:'pe',x:'Os criptoativos são um bom laboratório de FOMO e pânico, porque oscilam muito e depressa. Em 2021, as subidas e as notícias de quem «ficou rico» levaram milhões de pessoas a comprar perto dos máximos. Em 2022, os preços caíram fortemente e várias plataformas faliram, e muita gente vendeu em baixa ou perdeu o dinheiro que tinha lá. Quem compra por FOMO costuma comprar justamente quando o assunto está em todo o lado, e quem vende por pânico costuma fazê-lo quando já ninguém fala dele. É o ciclo emocional da tabela, em formato acelerado. Para quem quer ter alguma exposição, a regra é limitar o peso (uma pequena parte do património, de que se aceita perder tudo) e não usar dinheiro de que se precisa.'},

    {t:'h',id:'h6',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      'Entrar a fundo num ativo só porque subiu muito nos últimos meses ou porque «toda a gente» fala dele.',
      'Usar dinheiro emprestado (alavancagem) na euforia: uma queda pequena obriga a vender com prejuízo.',
      'Vender tudo no fundo e prometer voltar «quando estiver mais claro».',
      'Pôr no mercado dinheiro de que podes precisar em menos de uns anos.',
      'Confundir <b>volatilidade</b> (oscilar) com <b>perda permanente</b>: só concretizas a perda se venderes.']},

    {t:'h',id:'h7',x:'Em Portugal'},
    {t:'p',id:'p10',x:'A reserva de segurança e a escolha do tipo de produto contam muito: dinheiro de que precisas a curto prazo deve estar em depósitos ou em produtos de baixo risco e não em ações; os depósitos até 100 000 € por depositante e por banco estão cobertos pelo Fundo de Garantia de Depósitos (vê o tema «Quem protege o teu dinheiro se o banco falir»). Se quiseres reduzir o impulso de vender, um plano de entradas mensais num ETF UCITS de acumulação ajuda, e não precisas de «acertar» no dia. Atenção ao efeito dos impostos: vender depressa por pânico pode gerar uma mais-valia ou menos-valia e uma decisão fiscal que não planeaste; antes, vê o tema «Mais-valias: quanto imposto pagas ao vender».'},

    {t:'h',id:'h8',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'FOMO leva a comprar caro; pânico leva a vender barato. As pontas do ciclo emocional são onde mais se perde.',
      'Vender numa queda custa duas vezes: concretizas a perda e perdes a recuperação.',
      'Recuperar exige subidas maiores do que a queda: -30% pede +43%, -50% pede +100%.',
      'O remédio é preparar-se antes: plano escrito, fundo de emergência, compras regulares e uma carteira que consigas aguentar.',
      'Volatilidade não é o mesmo que perda: só perdes de forma permanente se venderes (ou se a empresa desaparecer).']},

    {t:'fazve',id:'q1',ensina:['p6','w1','p7'],q:'Vendes tudo depois de uma queda de 30%. Para voltares ao valor inicial teria sido preciso subir quanto, em %?',unit:'%',answer:_c('drawdown',{val:1000,q:30})[1],tol:.03,why:'30 ÷ 70 = 42,9%. Quem fica investido apanha a recuperação; quem vendeu em baixo deixa-a passar.'},
    {t:'decide',id:'q2',ensina:['u1'],label:'Decide',q:'Qual destas ajuda mais a evitar o pânico numa queda forte?',o:['Olhar para a carteira todas as horas','Comprar mais só porque os outros estão a vender','Ter um plano definido de antemão e dinheiro de curto prazo separado'],c:2,why:'Um plano prévio e uma reserva separada evitam vender sob pressão emocional.'},
    {t:'decide',id:'q3',ensina:['p3','c1','p4'],label:'Decide',q:'Em que fases do ciclo emocional tendem a acontecer as decisões mais caras?',o:['Nas pontas: compra na euforia e venda no pânico','No meio do ciclo, quando nada acontece','Sempre que se segue um plano'],c:0,why:'A euforia leva a comprar caro e o pânico a vender barato. É nas pontas que a emoção mais empurra, e por isso é aí que um plano escrito mais vale.'},
    {t:'erro',id:'q4',ensina:['p5','p9'],label:'Encontra o erro',q:'«Vendi tudo em março de 2020 para não perder mais. Volto quando estiver mais seguro.» O que falha neste raciocínio?',o:['Nada, é prudente','Quem vende em baixo perde a queda e a recuperação, porque só volta quando o mercado já subiu','Os impostos são sempre maiores nesse mês'],c:1,why:'O segundo custo do pânico é ficar de fora na recuperação. Em 2020 a subida foi tão rápida que quem esperou «mais segurança» comprou muito acima do ponto onde vendeu.'}
  ], src:[] },

{ id:'esquemas', topic:'psicologia', o:3, title:'Esquemas e como nos enganam', mins:8,
  lead:'As burlas financeiras funcionam porque exploram a psicologia, não a falta de inteligência. Quem as monta estuda o que nos faz decidir depressa, e quem as conhece consegue pará-las a tempo.',
  blocks:[
    {t:'h',id:'h1',x:'Não é falta de inteligência'},
    {t:'p',id:'p1',x:'Há quem pense que só cai numa burla quem é ingénuo. Os factos dizem outra coisa: as vítimas incluem médicos, engenheiros, professores e, claro, investidores experientes. O burlão não precisa de enganar a tua cabeça; precisa de te fazer sentir uma emoção forte (esperança, medo, vergonha, afeto) até deixares de verificar. É um trabalho de <b>engenharia social</b>: usar a relação e a emoção, em vez de forçar sistemas.'},
    {t:'p',id:'p2',x:'Pensa no que um vendedor de rua faz: cria uma pequena pressa («só tenho este») e uma pequena confiança («faço-te preço de amigo»). As burlas financeiras são o mesmo truque, mas com muitos milhares de euros em jogo e meses de preparação.'},

    {t:'h',id:'h2',x:'Os esquemas mais comuns'},
    {t:'cmp',id:'c1',head:['Esquema','Como funciona','Sinal de alerta'],rows:[
      ['Pirâmide / Ponzi','Os retornos dos investidores antigos são pagos com o dinheiro dos novos, não com lucros reais','Retornos regulares e altos, sem explicação clara da origem'],
      ['Pump and dump','Um grupo inflaciona o preço de um ativo pequeno com promoção e vende antes de ele ruir','Promoção intensa em redes sociais e grupos de mensagens, «sinais» secretos'],
      ['Falsa corretora','Plataforma que mostra lucros no ecrã mas não deixa levantar o dinheiro','Pedem «taxas» ou «impostos» para libertar o dinheiro'],
      ['Romance e investimento','Alguém cria uma relação online e leva-te aos poucos a investir numa plataforma','Fala de investir logo cedo na relação, nunca faz videochamada'],
      ['Clonagem de entidades','Usam o nome, a imagem ou o site de um banco, corretora ou figura pública','Contacto não pedido por telefone, mensagem ou anúncio; domínio ligeiramente diferente'],
      ['Recuperação de perdas','Prometem recuperar dinheiro já perdido em troca de um pagamento prévio','Contacto de «especialistas» depois de seres vítima']]},
    {t:'p',id:'p3',x:'O <b>esquema Ponzi</b> (nome de Charles Ponzi, que o fez nos anos 20) e a <b>pirâmide</b> parecem iguais e têm o mesmo destino: só se aguentam enquanto entra dinheiro novo. Quando o fluxo de novos investidores abranda, ou quando muita gente pede para levantar ao mesmo tempo, o castelo cai. Quem está no fim da fila perde tudo.'},
    {t:'p',id:'p4',x:'O <b>pump and dump</b> é a versão «de bolsa»: bombear (<i>pump</i>) o preço de um ativo pouco líquido, como uma ação minúscula ou uma cripto pouco conhecida, e despejar (<i>dump</i>) a posição no pico para quem chegou a seguir. Como o ativo é pequeno, poucos compradores chegam para mexer no preço, e é aí que os grupos de «sinais» fazem o seu trabalho.'},

    {t:'h',id:'h3',x:'As quatro alavancas psicológicas'},
    {t:'p',id:'p5',x:'Os investigadores de persuasão, como Robert Cialdini, descreveram princípios que funcionam em quase todos nós. As burlas usam sempre os mesmos:'},
    {t:'ul',id:'u1',x:[
      '<b>Urgência</b>: «só até às 18:00», «a oferta fecha hoje». Serve para te impedir de pensar e verificar.',
      '<b>Autoridade</b>: falsos «analistas», «gestores» com cargos pomposos, logótipos de entidades verdadeiras e até deepfakes de figuras conhecidas.',
      '<b>Prova social</b>: testemunhos fabricados, grupos onde «toda a gente» ganha (e quase todos são contas falsas), prints de lucros.',
      '<b>Escassez</b>: «vagas limitadas», «convite exclusivo». O que é raro parece mais valioso.',
      '<b>Reciprocidade e afeto</b>: um «amigo» que te faz favores e uma relação que cresce antes do pedido. Quando o pedido chega, custa recusar.']},
    {t:'p',id:'p6',x:'Regra prática: se sentes <b>pressa ou entusiasmo fortes</b> numa proposta de investimento, é um sinal para <i>parar</i>, não para avançar. As boas oportunidades de investimento são aborrecidas e não têm prazo para amanhã.'},

    {t:'h',id:'h4',x:'Como é que um golpe se desenrola'},
    {t:'p',id:'p7',x:'Muitos esquemas modernos seguem um guião previsível. Primeiro, um contacto inicial (anúncio, mensagem para o telemóvel, convite para um grupo, perfil novo numa rede social). Depois vem a <b>construção de confiança</b>: conversas, «dicas» pequenas que até dão certo, uma plataforma com ar profissional. A seguir, o primeiro investimento, pequeno, e um <b>lucro visível</b> no ecrã (e às vezes até um pequeno levantamento que funciona, para te convencer). Aí pedem mais, muito mais. Por fim, quando tentas levantar, surgem «taxas», «impostos» ou «verificações» que exigem novo pagamento, até desaparecerem.'},
    {t:'p',id:'p8',x:'O lucro que vês num ecrã não é dinheiro teu: é um número numa página controlada por quem te quer enganar. Só conta o que consegues levantar para a tua conta bancária, e só se a entidade estiver autorizada.'},

    {t:'h',id:'h5',x:'O teste do retorno impossível'},
    {t:'p',id:'p9',x:'Uma regra simples desarma a maior parte dos esquemas: <b>retornos muito acima do mercado, com pouco ou nenhum risco, são um sinal de que algo está errado</b>. Se alguém promete 5% <i>por mês</i>, olha para a conta: composto, isso é perto de 80% ao ano. Vê quanto daria:'},
    {t:'stat',id:'s1',v:Math.round((Math.pow(1.05,12)-1)*100),fmt:'pct',label:'Retorno anual de «5% por mês», com juros compostos'},
    {t:'stat',id:'s2',v:Math.round(10000*Math.pow(1.05,36)),label:'10 000 € a 5% por mês durante 3 anos (se fosse verdade)'},
    {t:'p',id:'p10',x:'Em três anos, 10 000 € virariam esse valor, sem nenhum mercado no mundo a fazê-lo com regularidade. Os esquemas tipo Ponzi dão sempre retornos <i>regulares</i> e <i>sem oscilação</i>, porque os números são inventados, enquanto os mercados reais oscilam. Atenção: aquilo que é «regular» e «garantido» a níveis altos deve preocupar-te, não tranquilizar-te.'},

    {t:'h',id:'h6',x:'Um caso real: Madoff'},
    {t:'p',id:'p11',x:'Bernard Madoff, antigo presidente da bolsa Nasdaq, geriu durante décadas um dos maiores esquemas Ponzi da história, descoberto em 2008, quando a crise levou muitos clientes a pedir os seus fundos de volta e o dinheiro não existia. O fundo mostrava ganhos pequenos mas constantes, sem anos maus. Parecia uma qualidade, era o sinal. Muitos investidores sofisticados e instituições confiaram na reputação, no estatuto e na «exclusividade» de ser aceite, sem verificar de onde vinha o retorno. A lição não é «não confies em ninguém», mas sim: <b>entende de onde vem o dinheiro</b>, e desconfia de retornos perfeitos.'},

    {t:'h',id:'h7',x:'O que fazer antes de enviares dinheiro'},
    {t:'ul',id:'u2',x:[
      '<b>Verifica a entidade</b> na lista da CMVM (ou do Banco de Portugal, para bancos): se não estiver registada ou autorizada, não envies nada.',
      '<b>Contacta por um canal oficial</b>: procura tu o número ou site da entidade, não uses o que te foi enviado.',
      '<b>Pede tempo</b>: uma entidade séria aceita que penses e verifiques.',
      '<b>Nunca partilhes</b> códigos, palavras-passe, acesso remoto ao ecrã nem fotos do cartão ou do Cartão de Cidadão.',
      '<b>Não pagues para levantar</b>: nenhuma entidade legítima exige um pagamento prévio para te devolver o teu dinheiro.',
      'Se já enviaste dinheiro, contacta de imediato o teu banco e apresenta queixa; não pagues a quem te promete «recuperar» as perdas.']},

    {t:'h',id:'h8',x:'Em Portugal'},
    {t:'p',id:'p12',x:'A CMVM mantém listas de entidades registadas e de alertas sobre entidades não autorizadas; a lista de alertas não é exaustiva (verificado em 17/11/2026), por isso uma entidade que não consta dos alertas não é, por esse motivo, de confiança: o teste certo é <b>estar na lista de autorizadas</b>. Entregar dinheiro a uma entidade não autorizada significa que não tens a proteção a que os investidores de entidades autorizadas têm direito, e a atividade de intermediação sem autorização é uma contraordenação muito grave. Para mais pormenores, vê o tema «Burlas e a lista da CMVM». Os depósitos nos bancos autorizados estão cobertos pelo Fundo de Garantia de Depósitos até 100 000 € por depositante e por banco (tema «Quem protege o teu dinheiro se o banco falir»).'},
    {t:'note',id:'n1',x:'Nenhuma entidade séria te pressiona, te contacta sem pedires ou te garante retornos. Antes de enviares dinheiro, vê o tema «Burlas e a lista da CMVM».'},

    {t:'h',id:'h9',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'As burlas exploram emoções (pressa, esperança, afeto), não falta de inteligência; qualquer pessoa pode ser apanhada.',
      'As alavancas são sempre as mesmas: urgência, autoridade, prova social, escassez e relação de confiança.',
      'Retornos altos, regulares e «sem risco» são sinal de alerta; lucros num ecrã não são dinheiro teu.',
      'Verifica sempre se a entidade está autorizada, e contacta-a por canais que tu encontres.',
      'Se já caíste, age depressa (banco e queixa) e não pagues a quem diz que recupera as perdas.']},

    {t:'decide',id:'q1',ensina:['c1','p3'],label:'Decide',q:'Um esquema paga retornos regulares aos primeiros investidores com o dinheiro dos que entram depois. Como se chama?',o:['Diversificação','Pump and dump','Pirâmide ou esquema Ponzi'],c:2,why:'Nos esquemas Ponzi e nas pirâmides, os retornos vêm do dinheiro de novos entrantes e colapsam quando deixam de entrar.'},
    {t:'decide',id:'q2',ensina:['u1'],label:'Decide',q:'Alguém diz «só tens até às 18:00 para entrar nesta oportunidade». Qual é a técnica?',o:['Urgência','Autoridade','Diversificação'],c:0,why:'Criar pressa de tempo é a técnica da urgência: impede-te de pensar e verificar.'},
    {t:'fazve',id:'q3',ensina:['p9','s1','s2'],q:'Alguém promete 5% por mês, com juros compostos. Quanto dá isso ao fim de um ano, em % (arredonda às unidades)?',unit:'%',answer:(Math.pow(1.05,12)-1)*100,tol:.03,why:'1,05 elevado a 12 dá cerca de 1,796, isto é, perto de 80% ao ano. Nenhum investimento legítimo e regular o consegue, por isso a promessa é o sinal de alerta.'},
    {t:'erro',id:'q4',ensina:['p7','p8'],label:'Encontra o erro',q:'«A plataforma mostra +40% e deixou-me levantar 100 €. Agora vou colocar mais 5 000 €.» Qual é o erro?',o:['Nenhum: um levantamento que funciona prova que é legítima','Um lucro num ecrã não é dinheiro teu, e um levantamento pequeno é um truque para ganhar confiança','O erro é só investir em dólares'],c:1,why:'Os esquemas deixam fazer pequenos levantamentos para criar confiança antes do pedido grande. Só vale o que consegues levantar numa entidade autorizada.'}
  ], src:[{l:'CMVM: Portal do Investidor',u:'https://investidor.cmvm.pt/PInvestidor/'}] },

{ id:'finfluencers-ruido', topic:'psicologia', o:4, title:'Finfluencers, redes sociais e ruído', mins:9,
  lead:'Hoje muita gente aprende a investir no telemóvel, entre vídeos de dança e anúncios. As redes sociais podem ensinar bem, mas foram desenhadas para prender a tua atenção e não para te darem bons resultados. Aprende a separar informação de ruído e de publicidade.',
  blocks:[
    {t:'h',id:'h1',x:'Quem são e porque funcionam'},
    {t:'p',id:'p1',x:'<b>Finfluencer</b> é a junção de «finance» e «influencer»: alguém que fala de finanças nas redes sociais e ganha seguidores com isso. Há quem faça bom trabalho, explique conceitos com honestidade e diga o que não sabe. Mas o modelo de negócio é <b>atenção</b>, e atenção ganha-se com emoção: promessas, medo, exemplos extremos e a imagem do estilo de vida («carro, viagens, ecrã com lucros»). Isso não é o mesmo que ensinar a investir.'},
    {t:'p',id:'p2',x:'Pensa num ginásio com um treinador muito simpático que, ao fim da aula, te vende suplementos. Pode ser um bom treinador, mas tens de saber que ele também ganha com a venda. Com os finfluencers é igual: o conteúdo é grátis porque o produto (ou o negócio) está nalgum lado.'},

    {t:'h',id:'h2',x:'Como é que eles ganham dinheiro'},
    {t:'cmp',id:'c1',head:['Fonte de rendimento','Como funciona','Conflito de interesses'],rows:[
      ['Publicidade e patrocínios','Uma corretora, plataforma ou produto paga pela promoção','Só fala bem de quem lhe paga'],
      ['Comissões de referência (afiliados)','Recebe por cada pessoa que abre conta por um link seu','Ganha quando tu abres conta, tenhas ou não lucro'],
      ['Cursos, mentorias e grupos pagos','Vende formação ou acesso a «sinais»','Ganha com o preço do curso, não com os teus resultados'],
      ['Posições próprias','Já tem o ativo que recomenda e beneficia se o preço subir','Pode ganhar se outros comprarem (pump and dump)'],
      ['Visualizações','A plataforma paga pelo alcance','Prefere conteúdo emocional e polémico a conteúdo rigoroso']]},
    {t:'p',id:'p3',x:'Nada disto é ilegal por si só, desde que seja <b>declarado de forma clara</b>. O problema surge quando não é, ou quando a relação financeira não é visível para quem vê.'},

    {t:'h',id:'h3',x:'O que dizem as regras europeias'},
    {t:'p',id:'p4',x:'A ESMA, a autoridade europeia dos mercados financeiros, publicou uma ficha com dicas para influenciadores financeiros, adaptada a Portugal (verificado em 17/11/2026). Os pontos principais ajudam-te também a avaliar quem estás a seguir:'},
    {t:'ul',id:'u1',x:[
      'Quem promove um produto financeiro é <b>responsável pelo que publica</b>, mesmo que não seja profissional do setor, e pode responder legalmente por prejuízos dos seguidores.',
      'Pagamentos, presentes ou vantagens têm de ser declarados com clareza («anúncio», «parceria paga», «conteúdo patrocinado»), não em letras minúsculas nem escondidos em hashtags. Também se deve declarar se o autor tem posição no produto ou beneficia caso outros o comprem.',
      'Dizer a terceiros o que comprar ou evitar pode ser <b>consultoria para investimento</b>, que em Portugal exige licença da CMVM; mesmo uma opinião pública sobre a evolução de uma ação ou criptoativo pode ser considerada recomendação.',
      'Avisos do tipo «isto não é aconselhamento financeiro» <b>não isentam</b> de responsabilidade nesses casos.',
      'Produtos como CFD, forex, futuros, certas iniciativas de crowdfunding e criptoativos voláteis podem implicar perder 100% do capital; quem os promove deve realçar os riscos, não só as recompensas, e não criar pressão com frases como «enriquece depressa».']},
    {t:'p',id:'p5',x:'Isto dá-te uma lista de verificação gratuita: se quem segues não declara patrocínios, não fala de riscos, usa urgência, promete retornos ou diz concretamente «compra isto», os sinais de aviso estão acesos.'},

    {t:'h',id:'h4',x:'Ruído, sinal e o efeito de repetição'},
    {t:'p',id:'p6',x:'Há ainda um problema que não depende de má-fé. As redes mostram-te o que gera mais cliques, e isso favorece o <b>ruído</b>: previsões ousadas, «o próximo grande colapso», ações «que vão multiplicar por dez». O <b>sinal</b>, isto é, o que realmente importa para um investidor a longo prazo (custos baixos, diversificação, tempo, disciplina), é aborrecido e raramente se torna viral.'},
    {t:'p',id:'p7',x:'Outro efeito é o <b>viés do sobrevivente</b>: vês quem ganhou e fala disso, e não vês os milhares que perderam e se calaram. Uma ação que subiu dez vezes dá um vídeo; uma que caiu 90% não dá. Se só vês as vitórias, a probabilidade de ganhar parece muito maior do que é. E o <b>efeito de repetição</b>: ouvir a mesma ideia muitas vezes faz com que pareça verdadeira, mesmo que nada de novo tenha aparecido.'},
    {t:'p',id:'p8',x:'Em pequena escala, o mesmo acontece em grupos de mensagens: quando alguns membros fingem ganhos, ou criam ligações emocionais, o grupo transforma-se numa câmara de eco que reforça a confirmação do que já pensas.'},

    {t:'h',id:'h5',x:'O custo de seguir um «sinal»'},
    {t:'p',id:'p9',x:'Imagina um grupo pago que dá 20 «sinais» por mês e cobra 50 € mensais. Mesmo com boas intenções, tens custos que não vês logo. Para teres noção da ordem de grandeza (valores de exemplo): 50 € por mês durante 10 anos são ' + _e(50*120) + ', e se esse dinheiro estivesse investido a 5% ao ano, valeria cerca de ' + _e(lrnCompound({initial:0,monthly:50,rate:5,years:10}).at(-1).total) + '.'},
    {t:'stat',id:'s1',v:Math.round(lrnCompound({initial:0,monthly:50,rate:5,years:10}).at(-1).total),label:'O que 50 € por mês valeriam em 10 anos, investidos a 5% (exemplo)'},
    {t:'p',id:'p10',x:'Isto sem contar com as comissões de cada operação e com os impostos sobre os ganhos, que consomem muito do resultado de quem negoceia muito. Para o custo ser compensado, o «sinal» teria de ser <i>claramente</i> melhor do que simplesmente manter um ETF diversificado de custos baixos, e a evidência é de que quase ninguém consegue isso de forma consistente (vê o tema «Indexado ou gestão ativa»).'},

    {t:'h',id:'h6',x:'Um caso real: a febre das «ações de meme»'},
    {t:'p',id:'p11',x:'Em janeiro de 2021, uma comunidade online começou a comprar em massa as ações de uma cadeia de lojas de videojogos que fundos grandes tinham apostado que cairiam. O preço disparou durante dias, os vídeos e memes espalharam-se, e milhões de pessoas quiseram «entrar». Alguns que compraram cedo ganharam muito; muitos que entraram quando o assunto já estava nas notícias compraram perto do pico e viram o preço cair depressa. A história mostra duas coisas: as redes podem mover preços (sobretudo de ativos pequenos), e quando ouves falar de uma «oportunidade» em todo o lado já costuma ser tarde.'},

    {t:'h',id:'h7',x:'Como usar as redes sem pagar por isso'},
    {t:'ul',id:'u2',x:[
      '<b>Pergunta sempre quem ganha</b> com o que estás a ver: patrocinador, afiliado, curso, posição própria? Se não é claro, assume que há interesse.',
      '<b>Desconfia de promessas</b>: retornos garantidos ou muito acima do mercado, «sem risco», «enriquece depressa», prazos curtos.',
      '<b>Verifica a entidade</b> antes de abrires conta numa plataforma mencionada: se não está nas listas da CMVM (ou do Banco de Portugal, para instituições de crédito), não uses.',
      '<b>Verifica os factos</b> em fontes primárias: o site do emissor, o KID do produto, a CMVM, o Banco de Portugal.',
      'Usa as redes para <b>descobrir temas</b>, nunca para decidir uma compra. Se algo te interessar, estuda-o por conta própria, com calma.',
      '<b>Segue pessoas que dizem «não sei»</b>, mostram erros e mudam de ideias com razões; foge de quem nunca falha.',
      '<b>Reduz o ruído</b>: silencia contas, desliga notificações e evita acompanhar preços em tempo real.']},

    {t:'h',id:'h8',x:'Os erros que mais custam'},
    {t:'ul',id:'u3',x:[
      'Tomar uma opinião ou «dica» como se fosse um facto ou um conselho adequado à <i>tua</i> situação, quando quem fala não te conhece.',
      'Entrar num ativo «por causa de um vídeo» sem perceber o que é nem o que acontece se cair.',
      'Pagar por cursos ou grupos de «sinais» sem comparar com a alternativa mais simples e barata.',
      'Seguir uma plataforma ou corretora recomendada sem verificar se está autorizada em Portugal ou na UE.',
      'Usar o dinheiro do fundo de emergência ou dinheiro emprestado para «aproveitar» uma ideia viral.']},

    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p12',x:'Em Portugal, a CMVM disponibiliza as listas de entidades autorizadas e registadas para intermediação financeira, e a ficha da ESMA recorda que a publicidade e a prospeção para captar clientes para atividades de intermediação financeira estão reservadas a intermediários financeiros e a agentes vinculados (verificado em 17/11/2026). Na prática, um particular sem autorização não pode andar a captar clientes para uma corretora ou a dar recomendações personalizadas. Se vires isso, desconfia. Vê o tema «Burlas e a lista da CMVM» para saberes como verificar. Se um finfluencer te levar a abrir conta numa plataforma estrangeira, vê também o tema «Banco ou corretora?» e confirma que está autorizada e que os teus ativos têm proteção.'},

    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u4',x:[
      'O modelo de negócio das redes é a atenção, não os teus resultados; o ruído vence o sinal.',
      'Pergunta sempre quem ganha dinheiro com o que estás a ver: patrocínio, afiliado, curso, posição própria.',
      'A ESMA lembra que patrocínios têm de ser declarados, que recomendar o que comprar pode exigir licença da CMVM e que avisos como «não é aconselhamento» não protegem.',
      'Desconfia de promessas, urgência e de quem mostra só as vitórias; o viés do sobrevivente engana.',
      'Usa as redes para descobrir temas, e verifica sempre na fonte e na lista da CMVM antes de decidir.']},

    {t:'decide',id:'q1',ensina:['c1','p3'],label:'Decide',q:'Um criador de conteúdo recebe uma comissão por cada pessoa que abre conta numa corretora através do seu link. Qual é o conflito de interesses?',o:['Ganha quando tu abres conta, independentemente de teres lucro','Nenhum, porque o conteúdo é grátis','Só existe se a corretora for estrangeira'],c:0,why:'A comissão de referência paga o criador por aberturas de conta, não pelos teus resultados. Se não for declarada com clareza («parceria paga»), é um problema.'},
    {t:'decide',id:'q2',ensina:['u1','p4'],label:'Decide',q:'Um influenciador diz «isto não é aconselhamento financeiro, mas se fosse a ti comprava já esta ação». O aviso protege-o de responsabilidade?',o:['Sim, o aviso resolve tudo','Não necessariamente: segundo a ESMA, esses avisos não isentam de responsabilidade se estiver a dar recomendações','Só se tiver mais de 100 000 seguidores'],c:1,why:'A ficha da ESMA para Portugal diz que avisos do tipo «isto não constitui aconselhamento financeiro» não isentam de responsabilidade quando há recomendações, e que indicar o que comprar pode exigir licença da CMVM.'},
    {t:'erro',id:'q3',ensina:['p7','p6'],label:'Encontra o erro',q:'«Vi cinco vídeos de pessoas que ganharam muito com esta ação, por isso a probabilidade de ganhar é alta.» Qual é o erro?',o:['Nenhum, cinco exemplos chegam','Viés do sobrevivente: não vês os que perderam e não fizeram vídeo','O erro é usar vídeos em vez de textos'],c:1,why:'Só quem ganhou fala. Os que perderam ficam calados, por isso a amostra que vês é enviesada e parece muito mais favorável do que a realidade.'},
    {t:'fazve',id:'q4',ensina:['p9','s1'],q:'Pagas 50 € por mês por um grupo de sinais durante 10 anos. Se esse dinheiro estivesse investido a 5% ao ano (valor de exemplo), quanto valeria no fim?',unit:'€',answer:lrnCompound({initial:0,monthly:50,rate:5,years:10}).at(-1).total,tol:.03,why:'Pagaste 6 000 €; investidos a 5% teriam rendido cerca de 7 800 €. O custo de «oportunidade» é maior do que a mensalidade que vês todos os meses.'},
    {t:'decide',id:'q5',ensina:['u2'],label:'Decide',q:'Um vídeo mostra uma plataforma nova com «retornos de 3% por semana». Qual é o primeiro passo mais sensato?',o:['Abrir conta com pouco dinheiro, só para testar','Ver se a entidade está nas listas da CMVM de entidades autorizadas e desconfiar da promessa','Partilhar com amigos para ver o que acham'],c:1,why:'A promessa de retornos altos e regulares é um sinal de alerta, e verificar a autorização da entidade é o teste que filtra a maior parte dos golpes.'}
  ], src:[{l:'ESMA: Finfluencers, dicas para uma promoção responsável (ficha adaptada a Portugal)',u:'https://www.esma.europa.eu/sites/default/files/2026-01/PT_Portugal_pt_-_Finfluencers_factsheet.pdf'},{l:'CMVM: Portal do Investidor',u:'https://investidor.cmvm.pt/PInvestidor/'}] },

{ id:'dinheiro-em-familia', topic:'psicologia', o:5, title:'Falar de dinheiro em família', mins:9,
  lead:'Em muitas casas, falar de dinheiro é mais difícil do que falar de política. Mas é em família que aprendemos as primeiras ideias sobre poupar, gastar e arriscar, e é em família que se tomam as decisões com mais impacto. Saber conversar sobre isto vale mais do que qualquer produto.',
  blocks:[
    {t:'h',id:'h1',x:'Porque é que é tão difícil'},
    {t:'p',id:'p1',x:'O dinheiro nunca é só dinheiro. Para uns é segurança, para outros liberdade, para outros prova de valor ou de amor. Cada pessoa cresceu a ouvir frases diferentes à mesa («não temos dinheiro para isso», «o dinheiro não é tudo», «poupa para os dias maus»), e esses ecos moldam, sem darmos por isso, o que sentimos ao gastar ou investir. Chamam-se por vezes <b>crenças sobre dinheiro</b>, e são herdadas muito antes de teres o teu primeiro ordenado.'},
    {t:'p',id:'p2',x:'Quando duas pessoas com crenças diferentes tomam decisões juntas (casal, pais e filhos, irmãos), o desacordo raramente é sobre os números. Pensa em duas pessoas que querem ir de carro até à mesma cidade: uma quer ir pela autoestrada, a outra pela estrada nacional. O destino é o mesmo, mas se nunca falarem sobre isso, discutem a meio da viagem.'},

    {t:'h',id:'h2',x:'Perfis de relação com o dinheiro'},
    {t:'p',id:'p3',x:'Não são rótulos científicos, mas ajudam a perceber porque é que duas pessoas reagem de forma tão diferente à mesma despesa:'},
    {t:'cmp',id:'c1',head:['Perfil','Instinto','Força','Risco'],rows:[
      ['Poupador','Segurança primeiro: guardar, evitar dívida','Reserva e estabilidade','Ansiedade, deixar de viver o presente, ter medo de investir'],
      ['Gastador','Aproveitar o agora, partilhar','Generosidade, vida social','Sem reserva, dívida, stress no fim do mês'],
      ['Evitador','Prefere não olhar para as contas','Menos stress imediato','Surpresas desagradáveis, decisões tomadas por outros'],
      ['Controlador','Quer decidir e acompanhar tudo','Organização','Conflito com quem decide diferente, esconder erros por vergonha']]},
    {t:'p',id:'p4',x:'Quase ninguém é só um perfil, e nenhum é «o certo». O objetivo é perceber qual é o teu e qual é o da outra pessoa, e construir regras que respeitem os dois.'},

    {t:'h',id:'h3',x:'Conversas que importam, e quando as ter'},
    {t:'p',id:'p5',x:'Há conversas que se adiam anos e depois chegam de repente, em momentos maus: uma doença, um despedimento, um falecimento. É mais fácil tê-las <b>antes</b>, a frio, num dia calmo. As mais úteis, por ordem de prioridade:'},
    {t:'ul',id:'u1',x:[
      '<b>Quanto entra e quanto sai</b>: rendimentos, despesas fixas e dívidas de cada pessoa, sem esconder nada.',
      '<b>Objetivos comuns</b>: o que queremos daqui a 1, 5 e 20 anos (casa, filhos, reforma, viagens, ajudar os pais).',
      '<b>Regras de decisão</b>: a partir de que valor decidimos juntos? Quanto cada um pode gastar sem dar explicações?',
      '<b>Como se investe</b>: qual o risco que cada um aguenta, e o que fazemos se uma carteira cair 30%.',
      '<b>Imprevistos</b>: fundo de emergência, seguros, quem trata de quê se um de nós não puder.',
      '<b>O futuro da família</b>: ajudar os pais a envelhecer, o que deixar aos filhos, testamento e herança (vê o tema «Sucessão e herança: preparar a família»).']},

    {t:'h',id:'h4',x:'Um método simples para a conversa'},
    {t:'ul',id:'u2',x:[
      '<b>Marca um momento</b>: «Podemos falar das nossas contas no sábado de manhã?» é diferente de atacar com um extrato na mão a meio de uma discussão.',
      '<b>Começa pelos objetivos</b> e não pelas culpas: «O que queremos construir?» antes de «Quem gastou o quê?».',
      '<b>Fala por «eu»</b>: «Eu fico ansioso quando não temos reserva» em vez de «Tu gastas tudo».',
      '<b>Ouve primeiro</b>: pergunta o que cada decisão representa para a outra pessoa antes de argumentares com números.',
      '<b>Decidam regras e escrevam-nas</b>: poucas e claras, revistas uma ou duas vezes por ano.',
      '<b>Mantenham o hábito</b>: uma reunião curta e mensal sobre contas evita as grandes crises.']},

    {t:'h',id:'h5',x:'Casais: juntar ou separar contas'},
    {t:'p',id:'p6',x:'Não existe um sistema universal. Há três modelos comuns: <b>tudo junto</b> (uma conta comum, ambos usam), <b>tudo separado</b> (cada um paga a sua parte) e <b>híbrido</b> (uma conta comum para despesas partilhadas e contas pessoais para gastos livres). O híbrido costuma reduzir conflitos porque protege a autonomia. Se os rendimentos são muito diferentes, é comum dividir as despesas comuns em proporção ao que cada um ganha, e não a meias.'},
    {t:'p',id:'p7',x:'Com o orçamento da casa à vista, as conversas ficam mais concretas. Experimenta a regra 50/30/20 com o rendimento líquido da casa:'},
    {t:'w',id:'w1',w:'calc',c:'budget'},
    {t:'p',id:'p8',x:'É um ponto de partida, não uma lei: se a renda ou a prestação da casa pesar mais, as necessidades passam de 50%. O importante é decidirem <i>juntos</i> a percentagem que poupam e que investem. Para rever a base do orçamento, vê o tema «Orçamento e poupança: para onde vai o dinheiro».'},

    {t:'h',id:'h6',x:'Pais e filhos: ensinar sem sermões'},
    {t:'p',id:'p9',x:'As crianças aprendem muito mais com o que vêem do que com o que ouvem. Se a casa nunca fala de dinheiro, aprendem que é um assunto proibido; se só fala de dinheiro em discussões, aprendem que é um problema. Algumas ideias práticas, por idade:'},
    {t:'ul',id:'u3',x:[
      '<b>Crianças</b>: uma pequena mesada e um mealheiro com objetivo. Aprendem a esperar e a escolher.',
      '<b>Adolescentes</b>: deixa-os gerir um orçamento próprio (roupa, saídas) e experimentar o erro com pouco dinheiro. Mostra o que são juros compostos com números reais.',
      '<b>Jovens adultos</b>: abrir conta própria, começar a poupar mesmo com pouco, perceber que o primeiro emprego é o melhor momento para criar o hábito.',
      '<b>Para todos</b>: mostra como se decide, incluindo os erros, sem dramatizar.']},
    {t:'p',id:'p10',x:'Quando o jovem adulto e o pai aprendem a investir <i>juntos</i> (como acontece neste site), a conversa muda de lugar: em vez de pai a «ensinar» e filho a «ouvir», os dois aprendem e discutem argumentos. Isso desfaz o medo de perguntar. Mas combinem regras: quem decide o quê, que dinheiro é de cada um e que valores são partilhados.'},

    {t:'h',id:'h7',x:'Emprestar e pedir emprestado dentro da família'},
    {t:'p',id:'p11',x:'Emprestar a um familiar é um dos temas mais delicados, porque mistura afeto e dinheiro. Algumas regras práticas, que preservam a relação:'},
    {t:'ul',id:'u4',x:[
      'Empresta apenas o que podes perder sem pôr em risco a tua reserva; se não puderes perder, é melhor <b>recusar com carinho</b> ou dar uma parte pequena.',
      'Se emprestares, <b>escreve</b> o valor, o prazo e a forma de pagamento. Escrever não é desconfiar, é evitar que cada um se lembre de uma coisa diferente.',
      'Evita ser <b>fiador</b> ou garantir créditos de outras pessoas; o risco é teu, e as consequências podem durar anos.',
      'Pergunta-te se estás a ajudar ou a adiar um problema: dar dinheiro uma e outra vez pode manter a dependência.']},

    {t:'h',id:'h8',x:'Um caso real: a crise da dívida na Zona Euro'},
    {t:'p',id:'p12',x:'Entre 2010 e 2014, vários países do sul da Europa, incluindo Portugal, passaram por uma crise de dívida: os juros subiram, os governos tiveram de cortar despesa e muitas famílias viram descer rendimentos, subir impostos e perder emprego. Nas casas, muitas conversas difíceis foram tidas tarde, quando já não havia margem: quem estava endividado, quem era fiador de outrem, quem não tinha poupança. As famílias que já falavam abertamente de dinheiro e tinham reserva enfrentaram melhor o choque. A lição não é política: é que as conversas de dinheiro se têm antes de a crise chegar.'},

    {t:'h',id:'h9',x:'Os erros que mais custam'},
    {t:'ul',id:'u5',x:[
      '<b>Esconder dívidas, perdas ou despesas</b> por vergonha: quase sempre piora e destrói a confiança.',
      '<b>Deixar que só uma pessoa</b> trate do dinheiro da casa, sem a outra saber de contas, senhas, seguros e investimentos. Se algo lhe acontecer, a família fica às cegas.',
      '<b>Misturar afeto com dinheiro</b> sem regras claras: emprestar sem escrever, dar «à confiança», prometer o que não se pode cumprir.',
      '<b>Usar o dinheiro como poder</b>, castigo ou prémio.',
      '<b>Evitar a conversa</b> sobre o futuro (cuidar dos pais, deixar bens, testamento), até que a situação é urgente.']},

    {t:'h',id:'h10',x:'Em Portugal'},
    {t:'p',id:'p13',x:'Em Portugal é comum a família ajudar financeiramente os filhos (entrada de casa, estudos) e, mais tarde, os pais. Antes de combinar apoios, convém saber como funcionam as contas conjuntas, que partilham a titularidade e criam riscos que as pessoas esquecem (vê o tema «Contas conjuntas e herança»), e como funcionam as transmissões gratuitas, que têm regras de imposto do selo próprias (vê o tema «Imposto do selo»). Para dívidas, vê o tema «Dívida boa e dívida má» e usa um cálculo realista da prestação (tema «Comprar casa ou investir»). O Banco de Portugal e a DECO oferecem informação útil e gratuita sobre endividamento e planeamento familiar.'},
    {t:'note',id:'n1',pending:true,x:'Regras sobre empréstimos entre familiares, fiança e partilha de bens num casal dependem do regime de bens do casamento e da lei em vigor. Para decisões de valor, confirma no site oficial relevante (Justiça, Portal das Finanças) ou com um profissional.'},

    {t:'h',id:'h11',x:'Em poucas palavras'},
    {t:'ul',id:'u6',x:[
      'O dinheiro mexe com emoções e crenças herdadas; o desacordo raramente é só sobre números.',
      'Fala antes de haver crise: rendimentos, despesas, objetivos, regras de decisão e imprevistos.',
      'Começa pelos objetivos, fala por «eu», ouve primeiro e escreve poucas regras claras.',
      'Casais: o modelo híbrido (conta comum mais contas pessoais) costuma proteger a autonomia e reduzir conflitos.',
      'Empresta só o que podes perder, escreve o acordo e evita ser fiador.',
      'Pais e filhos aprendem pelo exemplo: investir e aprender juntos é uma boa forma de abrir a conversa.']},

    {t:'decide',id:'q1',ensina:['u1','p5'],label:'Decide',q:'Qual destas conversas faz mais sentido ter com a família logo no início?',o:['Rendimentos, despesas, dívidas e objetivos comuns, sem esconder nada','Quem gastou mais no mês passado','Apenas qual a melhor ação para comprar'],c:0,why:'Começar pelos números reais e pelos objetivos comuns cria uma base de confiança e evita discussões baseadas em suposições.'},
    {t:'fazve',id:'q2',ensina:['p7','w1'],q:'O rendimento líquido da casa é de 3 200 € por mês. Pela regra 50/30/20, quanto vai para poupar e pagar dívidas?',unit:'€',answer:_c('budget',{inc:3200})[2],tol:.01,why:'20% de 3 200 € = 640 € por mês. É um ponto de partida: o importante é que o casal decida junto a percentagem que realmente cumpre.'},
    {t:'erro',id:'q3',ensina:['u4','p11'],label:'Encontra o erro',q:'«Empresto 5 000 € ao meu primo, são todas as poupanças da minha reserva, mas ele é família, não preciso de escrever nada.» Qual é o problema?',o:['Nenhum, a confiança entre família chega','O problema é só ser dinheiro','Emprestar a reserva toda e sem registo põe em risco a tua segurança e a relação'],c:2,why:'Só se empresta o que se pode perder. Escrever valor e prazo evita memórias diferentes e protege a relação.'},
    {t:'decide',id:'q4',ensina:['p6'],label:'Decide',q:'Um casal com rendimentos muito diferentes quer dividir as despesas comuns. Qual abordagem costuma ser mais justa e evitar conflito?',o:['Dividir em proporção ao que cada um ganha, com contas pessoais para gastos livres','Dividir sempre a meias','Que pague sempre quem ganha mais, sem acordo'],c:0,why:'Proporcional ao rendimento e com espaço pessoal (modelo híbrido) respeita a capacidade de cada um e a autonomia.'}
  ], src:[] },

{ id:'disciplina', topic:'psicologia', o:6, title:'Disciplina e rotina', mins:9,
  lead:'Investir bem é sobretudo uma questão de hábitos. Um plano simples, seguido durante anos, vence a inspiração de curto prazo, e é isto, mais do que escolher o «melhor» ativo, que separa quem chega ao objetivo de quem desiste a meio.',
  blocks:[
    {t:'h',id:'h1',x:'Aborrecido é bom'},
    {t:'p',id:'p1',x:'Quando se começa a investir, parece que o segredo está em encontrar a ação certa ou o momento certo. Com o tempo, percebe-se que o que faz diferença é aparecer todos os meses, durante muitos anos, sem desistir. É como o ginásio: um treino perfeito num dia não compensa três meses de faltas. O investimento bem feito é, na maior parte do tempo, <b>aborrecido</b>, e é por isso que funciona: deixa pouco espaço para a emoção.'},
    {t:'p',id:'p2',x:'Pensa num barco com um leme fixo: não se desvia de cada onda, segue a rota. A disciplina é isso. Não impede o mar de agitar, mas impede-te de mudar de rumo a cada onda.'},

    {t:'h',id:'h2',x:'Os cinco pilares de uma rotina'},
    {t:'ul',id:'u1',x:[
      '<b>Plano escrito</b>: objetivo, prazo, alocação, quanto investes por mês e o que farás se o mercado cair 20% ou 30%. É o teu contrato com o «eu» do futuro.',
      '<b>Automatiza</b>: transferência e compra regulares, para que a decisão seja tomada uma vez e não todos os meses.',
      '<b>Revê</b> com calma, por exemplo uma ou duas vezes por ano, e rebalanceia se for preciso.',
      '<b>Regista</b> as decisões e o porquê: na vista <b>Diário</b> deste site podes fazê-lo, e daqui a meses percebes o que aprendeste e se o raciocínio era bom.',
      '<b>Evita novidades</b>: não mudes de estratégia a cada notícia ou a cada conselho.']},

    {t:'h',id:'h3',x:'O plano de investimento pessoal'},
    {t:'p',id:'p3',x:'Os profissionais chamam-lhe <b>declaração de política de investimento</b> (em inglês, <i>IPS</i>). Em versão pessoal, cabe numa folha. Responde a estas perguntas e guarda a folha onde a possas ler numa crise:'},
    {t:'cmp',id:'c1',head:['Pergunta','Exemplo de resposta (a tua será diferente)'],rows:[
      ['Para quê é este dinheiro?','Reforma daqui a 30 anos, e não para gastar antes'],
      ['Quanto invisto e quando?','Um valor fixo por mês, no dia a seguir ao ordenado'],
      ['Em quê?','Alguns ETFs diversificados, com uma alocação definida entre ações e obrigações'],
      ['O que faço se cair 30%?','Mantenho e continuo as compras; só vendo se mudar o objetivo'],
      ['Quando reviso?','Em janeiro e em julho, uma vez por semestre'],
      ['O que não faço?','Não uso dinheiro emprestado, não compro o que não entendo, não decido sob emoção']]},
    {t:'p',id:'p4',x:'O plano protege-te de ti mesmo. Quando estiveres em pânico ou em euforia, não vais ter capacidade de decidir bem; o plano decidiu por ti quando estavas calmo.'},

    {t:'h',id:'h4',x:'Automatizar: o poder de decidir uma vez'},
    {t:'p',id:'p5',x:'A força de vontade cansa; os sistemas não. Uma <b>ordem permanente</b> do ordenado para a conta de investimento, e uma compra regular, fazem com que investir aconteça «por defeito». Os investigadores de comportamento chamam-lhe <i>efeito de defeito</i>: tendemos a manter o que está pré-definido. Usa isso a teu favor, e põe o que é mau (gastar) a exigir um passo extra.'},
    {t:'p',id:'p6',x:'Compra regular tem ainda outra vantagem, chamada <b>DCA</b> (<i>dollar-cost averaging</i>, isto é, investir quantias iguais de tempos a tempos): quando os preços estão baixos compras mais unidades, e quando estão altos compras menos. Não garante lucro, mas retira o peso de tentar adivinhar o melhor momento, que ninguém acerta de forma consistente (vê o tema «Investir aos poucos ou de uma vez»).'},

    {t:'h',id:'h5',x:'O custo de adiar e de interromper'},
    {t:'p',id:'p7',x:'Comparemos duas pessoas com o mesmo plano, a 5% ao ano (valor de exemplo) e 200 € por mês. A primeira começa já e investe 25 anos. A segunda adia cinco anos e investe 20. Ambas acham que «cinco anos não fazem diferença»:'},
    {t:'stat',id:'s1',v:Math.round(lrnCompound({initial:0,monthly:200,rate:5,years:25}).at(-1).total),label:'Começa já: 200 € por mês, 25 anos, 5% (exemplo)'},
    {t:'stat',id:'s2',v:Math.round(lrnCompound({initial:0,monthly:200,rate:5,years:20}).at(-1).total),label:'Adia cinco anos: 200 € por mês, 20 anos, 5% (exemplo)'},
    {t:'p',id:'p8',x:'A diferença é de cerca de ' + _e(lrnCompound({initial:0,monthly:200,rate:5,years:25}).at(-1).total-lrnCompound({initial:0,monthly:200,rate:5,years:20}).at(-1).total) + ', e foram depositados só ' + _e(200*60) + ' a mais. Os primeiros anos pesam mais do que parece, porque são os que têm mais tempo para os juros se acumularem (vê o tema «Juros compostos: o efeito bola de neve»). O hábito de começar cedo vale mais do que o valor inicial.'},
    {t:'p',id:'p9',x:'Mexer muito também custa: cada operação tem comissões e potencialmente impostos, e aumenta as hipóteses de decisões emocionais. Os investidores que mais lucram a longo prazo costumam ser os que menos mexem.'},

    {t:'h',id:'h6',x:'Um caso real: 2008 e quem ficou'},
    {t:'p',id:'p10',x:'Na crise financeira de 2008, as bolsas mundiais caíram muito, e as notícias previam o fim do sistema. Muitos investidores venderam e juraram nunca mais voltar. As bolsas demoraram alguns anos a recuperar, e o que se seguiu, na década seguinte, foi um dos períodos de subida mais longos da história. Quem manteve um plano de compras mensais comprou muito barato nesses anos; quem desistiu perdeu a recuperação. Não foi uma decisão genial, foi cumprir uma rotina que já estava escrita.'},

    {t:'h',id:'h7',x:'Quando mudar o plano (e quando não)'},
    {t:'p',id:'p11',x:'Disciplina não é teimosia. Há razões <b>válidas</b> para rever: mudou o teu objetivo (casamento, filhos, casa), mudou o horizonte, mudou o teu rendimento ou perdeste o emprego, ou percebeste que o teu perfil de risco era diferente do que pensavas. E há razões <b>más</b>: uma notícia, uma queda ou uma subida do mercado, a opinião de alguém nas redes. A regra: muda o plano quando mudar a <i>tua vida</i>, não quando mudar o <i>mercado</i>.'},

    {t:'h',id:'ha',x:'Uma rotina ao longo do ano'},
    {t:'p',id:'pa',x:'Disciplina não é fazer muita coisa; é fazer as poucas coisas certas, nos momentos certos. Uma rotina pode ser tão simples como esta:'},
    {t:'cmp',id:'c2',head:['Quando','O que fazes','Quanto tempo'],rows:[
      ['Todos os meses','Confirmas que a transferência e a compra automáticas aconteceram, e registas no Diário se algo mudou','5 minutos'],
      ['Duas vezes por ano','Olhas para a alocação e para os custos; rebalanceias se alguma parte se afastou muito do plano','30 a 60 minutos'],
      ['Uma vez por ano','Revês o objetivo, o prazo, o valor mensal e o fundo de emergência; atualizas beneficiários e seguros','1 a 2 horas'],
      ['Quando a vida muda','Casamento, filhos, casa, emprego novo: revês o plano inteiro','Uma conversa calma'],
      ['Quando o mercado oscila','Nada, a não ser reler o plano e a regra do que fazes numa queda','0 minutos']]},
    {t:'p',id:'pb',x:'A última linha é a mais importante. Muita gente quer fazer algo nas crises; o plano existe para dizer «não».'},

    {t:'h',id:'hb',x:'Uma lista para antes de qualquer decisão fora do plano'},
    {t:'p',id:'pc',x:'Haverá dias em que sentes uma vontade forte de mudar tudo: vender, comprar uma ideia nova, mudar de estratégia. Antes de agires, passa por estas perguntas, por escrito:'},
    {t:'ul',id:'ua',x:[
      'O meu objetivo ou o meu prazo mudaram? (Se sim, rever o plano é legítimo.)',
      'Estou a decidir por causa de uma emoção (medo, euforia, inveja) ou por causa de um facto novo?',
      'Falei disto com alguém que me conhece e que não tem interesse na decisão?',
      'Passaram pelo menos 48 horas desde que tive esta ideia?',
      'Se o resultado correr mal, consigo explicar à pessoa que mais confia em mim porque tomei esta decisão?',
      'Quanto custa esta mudança em comissões e impostos?']},
    {t:'p',id:'pd',x:'Se não passares em duas ou mais, adia. As boas ideias sobrevivem a dois dias de espera.'},

    {t:'h',id:'hc',x:'Quando falhas um mês (e o que fazer)'},
    {t:'p',id:'pe',x:'Vai acontecer: um mês com despesas extra em que não consegues investir. A reação habitual é culpa e a tentação de «compensar» no mês seguinte com mais risco. O melhor é o contrário: <b>retomar o plano normal, sem culpa e sem compensar</b>. Um mês perdido num plano de 20 anos pesa muito pouco; abandonar o plano pesa muito. Se se repetir, não é falta de disciplina, é sinal de que o valor mensal está demasiado ajustado ao limite e convém baixá-lo, ou rever o orçamento (vê o tema «Orçamento e poupança: para onde vai o dinheiro»).'},

    {t:'h',id:'hd',x:'Outro caso: a aposta de Buffett'},
    {t:'p',id:'pf',x:'Em 2007, o investidor Warren Buffett apostou publicamente que um simples fundo indexado ao S&P 500, de custos baixos, superaria durante dez anos uma seleção de fundos de gestores profissionais escolhida por quem aceitou a aposta. Dez anos depois, o fundo indexado ganhou. Não foi por ser genial, foi por ser barato, diversificado e por ninguém lhe mexer. É o argumento a favor da disciplina: um plano simples, mantido, bateu especialistas a fazer muito mais.'},

    {t:'h',id:'h8',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      'Não ter plano escrito e decidir tudo sobre a hora.',
      'Parar de investir nas quedas, quando as compras são mais baratas.',
      'Mudar de estratégia a cada notícia ou a cada conselho.',
      'Esperar pelo «momento certo» para começar e ir adiando durante anos.',
      'Complicar demais: carteiras com dezenas de produtos que não consegues acompanhar.',
      'Não rever nunca, e acabar com uma carteira que já não corresponde à tua vida.']},

    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p12',x:'Em Portugal, automatizar é fácil: uma ordem permanente do banco para a conta da corretora ou da entidade onde investes, no dia a seguir ao ordenado. Ao rever a carteira uma ou duas vezes por ano, tem em conta o imposto: vender para rebalancear pode gerar mais-valias (vê o tema «Mais-valias: quanto imposto pagas ao vender»), e usar novos depósitos para repor as proporções evita vender. Os custos e os impostos são os teus «inimigos» silenciosos: revê o tema «Custos e TER» antes de mudares de produto.'},

    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'O que funciona é aparecer todos os meses durante anos; o aborrecido ganha ao brilhante.',
      'Escreve um plano de uma folha: objetivo, quanto, em quê, o que fazes numa queda, quando reviste.',
      'Automatiza para decidir uma só vez; compra regular tira a pressão de acertar no momento.',
      'Começar cedo vale mais do que o valor: cinco anos de atraso custam milhares de euros.',
      'Muda o plano quando mudar a tua vida, não quando mudar o mercado.']},

    {t:'decide',id:'q1',ensina:['u1','p5'],label:'Decide',q:'Qual destes hábitos mais ajuda a manter a disciplina ao longo dos anos?',o:['Mudar de estratégia a cada notícia','Olhar para a carteira todos os dias','Automatizar as compras e rever o plano poucas vezes por ano'],c:2,why:'A automação e as revisões espaçadas reduzem as decisões emocionais.'},
    {t:'decide',id:'q2',ensina:['p9'],label:'Decide',q:'Porque é que mexer muito na carteira tende a custar dinheiro?',o:['Porque os mercados proíbem','Porque aumenta os custos e as oportunidades de errar','Porque dá sempre mais lucro'],c:1,why:'Cada operação tem comissões e potencialmente impostos, e aumenta as hipóteses de decisões emocionais.'},
    {t:'fazve',id:'q3',ensina:['p7','s1','s2','p8'],q:'Com 200 € por mês a 5% (exemplo), quanto a mais acumulas começando já e investindo 25 anos, em vez de adiares 5 anos e investires 20?',unit:'€',answer:lrnCompound({initial:0,monthly:200,rate:5,years:25}).at(-1).total-lrnCompound({initial:0,monthly:200,rate:5,years:20}).at(-1).total,tol:.03,why:'Pagas só 12 000 € a mais de depósitos, mas os primeiros anos têm mais tempo para os juros se acumularem, e a diferença final é muito maior do que isso.'},
    {t:'decide',id:'q4',ensina:['p11'],label:'Decide',q:'Qual é uma boa razão para rever o teu plano de investimento?',o:['O mercado caiu 15% esta semana','Mudou o teu objetivo ou o teu horizonte (por exemplo, vais comprar casa)','Um influenciador disse que há uma oportunidade nova'],c:1,why:'Muda o plano quando mudar a tua vida, não quando mudar o mercado nem a opinião de terceiros.'}
  ], src:[] }
);
