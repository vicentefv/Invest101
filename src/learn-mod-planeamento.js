// ================= Aprender: módulo «planeamento» =================
// Regras de Portugal só com fonte oficial (campo `src`); o que não ficou confirmado leva `pending:true` («Por confirmar»).

// Constantes deste módulo (prefixo _pl_).
// Sequência de retornos: mesma média, ordem diferente (valores de exemplo, em termos reais). Retira-se 4% do capital inicial por ano.
const _pl_sim=(rets,init,w)=>rets.reduce((b,r)=>(b-w)*(1+r/100),init);
const _pl_seqA=[-25,-10,5,15,20,10,10,10,10,10];
const _pl_seqB=_pl_seqA.slice().reverse();
const _pl_fimA=_pl_sim(_pl_seqA,1000000,40000);
const _pl_fimB=_pl_sim(_pl_seqB,1000000,40000);
// Anos até à independência financeira: poupa-se a fração s do rendimento, o retorno real é r% e o alvo é 25 vezes as despesas anuais (regra dos 4%).
const _pl_anosFi=(s,r)=>{ const i=r/100; return Math.log(1+25*(1-s)*i/s)/Math.log(1+i); };
// Fontes comuns
const _pl_ss={l:'Segurança Social: Pensão de velhice',u:'https://www.seg-social.pt/pensao-de-velhice'};
const _pl_ssGov={l:'gov.pt: Pedir a pensão de velhice',u:'https://www.gov.pt/servicos/requerer-a-pensao-de-velhice'};
const _pl_ebf={l:'Portal das Finanças: Estatuto dos Benefícios Fiscais, artigo 21.º',u:'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/bf_rep/Pages/ebf-artigo-21-ordm-.aspx'};
const _pl_selo={l:'Portal das Finanças: Código do Imposto do Selo, tabela geral',u:'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/selo/Pages/ccod-selo-tabgiselo.aspx'};

LRN.push(
{ id:'reforma', topic:'planeamento', o:1, title:'Reforma e Segurança Social', mins:7,
  lead:'A pensão da Segurança Social não substitui por inteiro o ordenado. Saber quando te podes reformar, quanto vais provavelmente receber e quanto precisas de juntar por tua conta é o primeiro passo do planeamento.',
  blocks:[
    {t:'h',id:'h1',x:'Duas fontes de rendimento na reforma'},
    {t:'p',id:'p1',x:'Imagina a reforma como uma mesa com duas pernas. A primeira é a <b>pensão pública</b>, paga pela Segurança Social com base nas contribuições que tu e os teus empregadores fizeram ao longo da vida. A segunda é a <b>poupança pessoal</b>: o que juntaste e investiste por tua conta. Uma só perna segura a mesa, mas o equilíbrio é fraco; quanto mais cedo começas a segunda, menos dependes de a primeira ser suficiente.'},
    {t:'p',id:'p2',x:'Em Portugal, o sistema público funciona por <b>repartição</b>: o que os trabalhadores de hoje descontam serve para pagar as pensões de hoje. Isto tem uma consequência importante para quem é jovem: com uma população que envelhece, o sistema tem de se ajustar, e as regras (idade, cálculo da pensão) tendem a mudar ao longo das décadas. Planear a reforma é, em parte, planear contando que as regras de hoje não serão as de amanhã.'},

    {t:'h',id:'h2',x:'Quando te podes reformar'},
    {t:'p',id:'p3',x:'Em Portugal, a <b>idade normal de acesso à pensão de velhice</b> está ligada à esperança de vida e <b>sobe com os anos</b>. Em 2026 é de <b>66 anos e 9 meses</b>, e para 2027 está fixada em 66 anos e 11 meses (verificado em 17/11/2026). Em regra são precisos <b>15 anos civis</b> de registo de remunerações. Com carreira longa a idade pode descer: em 2026, 4 meses por cada ano a mais dos 40 de carreira. Pedir a pensão antes da idade normal pode implicar penalização.'},
    {t:'cmp',id:'c1',head:['Situação','O que muda','O que fazer'],rows:[
      ['Idade normal','Pensão sem penalização, com pelo menos 15 anos civis de registo','Confirmar a tua idade no site da Segurança Social, porque muda todos os anos'],
      ['Carreira longa','Pode reduzir a idade em meses por cada ano de carreira acima de 40 (em 2026, 4 meses por ano)','Consultar o extrato de carreira contributiva'],
      ['Antes da idade normal','Pode haver penalização na pensão','Ver as condições concretas antes de decidir'],
      ['Poucos anos de descontos','Sem os 15 anos de registo não há esta pensão de velhice','Verificar o histórico, incluindo períodos no estrangeiro']]},
    {t:'p',id:'p4',x:'Os números de 2026 vêm da Segurança Social, mas a regra é móvel. Por isso nunca guardes na cabeça a «idade da reforma» como um número fixo: guarda antes que ela <b>depende do ano em que a pedires</b>.'},

    {t:'h',id:'h3',x:'Quanto vais receber'},
    {t:'p',id:'p5',x:'A pensão é calculada com base nas remunerações registadas e no número de anos de descontos, e há fatores de ajustamento. Na prática, para a maioria dos trabalhadores, a pensão fica <b>abaixo do último ordenado</b>, e a diferença é maior para quem ganha mais ou teve carreiras curtas ou interrompidas. Por isso a Segurança Social disponibiliza simulações e um extrato da tua carreira (acessível com o teu login) que é o ponto de partida honesto.'},
    {t:'note',id:'n1',pending:true,x:'A fórmula exata de cálculo da pensão, os fatores de ajustamento e os valores mínimos e máximos mudam com a lei e não foram confirmados em fonte oficial para este tema. Usa o simulador da Segurança Social para estimar a tua pensão, e escolhe um valor prudente.'},

    {t:'h',id:'h4',x:'A diferença que tens de cobrir'},
    {t:'p',id:'p6',x:'A forma mais simples de planear é ver a <b>diferença</b>: quanto queres gastar por mês na reforma menos quanto esperas receber da pensão. Um exemplo, com valores inventados só para a conta: queres viver com 1 800 € líquidos por mês, e o simulador indica 1 200 € de pensão. Faltam 600 € por mês. Quanto capital precisa de ter para os gerar? Uma referência muito usada é retirar cerca de 4% do capital por ano (vê o tema «A regra dos 4% e como levantar dinheiro na reforma» para perceber a origem e os limites). Faz as tuas contas aqui:'},
    {t:'w',id:'w1',w:'calc',c:'retire'},
    {t:'stat',id:'s1',v:Math.round(_c('retire',{ren:600,ret:4})[0]),label:'Capital para gerar 600 € por mês a 4% ao ano (exemplo)'},
    {t:'p',id:'p7',x:'Para chegar a esse capital, usa a calculadora de juros compostos: quanto precisas de poupar por mês, a um retorno prudente, durante os anos que faltam. Quanto mais cedo começares, menos terás de poupar (vê «Juros compostos: o efeito bola de neve»). E lembra-te de ajustar à inflação: 1 800 € daqui a 30 anos compram muito menos do que hoje.'},

    {t:'h',id:'h5',x:'Um caso real: a pensão e a crise da dívida'},
    {t:'p',id:'p8',x:'Durante a crise da dívida soberana na Zona Euro (a partir de 2010), Portugal teve de ajustar as contas públicas e várias regras que afetavam pensões e a idade da reforma foram alteradas em poucos anos. Foi uma lição prática: quem planeava a reforma contando só com a regra de um certo momento viu as condições mudarem a meio do caminho. A conclusão não é política; é que <b>uma pensão pública é uma base, não uma garantia fixa</b>, e quem tem poupança própria ganha margem.'},

    {t:'h',id:'h6',x:'Os erros que mais custam'},
    {t:'ul',id:'u1',x:[
      'Achar que «a pensão chega» sem nunca ter visto a simulação da Segurança Social.',
      'Começar a poupar tarde: o tempo é a variável mais poderosa e a mais cara de perder.',
      'Ignorar a inflação: um valor «bom» hoje pode ser pouco daqui a 30 anos.',
      'Contar com a reforma aos 60 sem verificar se a lei o permite no teu caso; a idade depende do ano e da carreira.',
      'Pôr toda a poupança da reforma em produtos com custos altos e prazos presos, sem comparar com alternativas (vê o tema «PPR ou investir por conta própria»).',
      'Não rever o plano: casamento, filhos, mudança de emprego e saúde mudam a conta.']},

    {t:'h',id:'h7',x:'Em Portugal'},
    {t:'p',id:'p9',x:'Para a reforma cá, as ferramentas mais comuns são três: a pensão da Segurança Social, os <b>PPR</b> (planos de poupança reforma, com benefício fiscal) e a poupança e investimento por conta própria (por exemplo ETFs UCITS). Contas como 401k ou IRA (americanas) não existem para quem vive em Portugal; o PPR é o produto «português» que mais se aproxima, mas com regras próprias (vê o tema «PPR: poupança com benefício fiscal»). Quanto aos impostos das mais-valias de ETFs e ações, vê o tema «Mais-valias: quanto imposto pagas ao vender». Se trabalhares no estrangeiro durante parte da carreira, confirma como contam esses anos para a pensão portuguesa.'},

    {t:'h',id:'h8',x:'Em poucas palavras'},
    {t:'ul',id:'u2',x:[
      'A reforma tem duas pernas: pensão pública e poupança própria. Quanto mais cedo começas a segunda, melhor.',
      'A idade normal em 2026 é 66 anos e 9 meses (66 anos e 11 meses em 2027); são precisos 15 anos civis de registo; carreira longa pode baixar a idade.',
      'A pensão costuma ser inferior ao último ordenado: vê o extrato e o simulador da Segurança Social.',
      'Calcula a diferença entre o que queres gastar e a pensão esperada; o capital necessário vem da retirada anual prudente.',
      'As regras mudam com os anos: planeia com margem e revê todos os anos.']},

    {t:'decide',id:'q1',ensina:['p3','c1'],label:'Decide',q:'Segundo a Segurança Social, qual é a idade normal de acesso à pensão de velhice em 2026?',o:['65 anos','67 anos e 6 meses','66 anos e 9 meses'],c:2,why:'Em 2026 é de 66 anos e 9 meses, segundo a Segurança Social; para 2027 está fixada em 66 anos e 11 meses. A idade sobe com a esperança de vida, por isso depende do ano.'},
    {t:'fazve',id:'q2',ensina:['p6','w1','s1'],q:'Queres um rendimento complementar de 1 000 € por mês, retirando 4% do capital por ano. De quanto capital precisas?',unit:'€',answer:_c('retire',{ren:1000,ret:4})[0],tol:.01,why:'1 000 € × 12 = 12 000 € por ano. 12 000 ÷ 0,04 = 300 000 €.'},
    {t:'decide',id:'q3',ensina:['p5','p6'],label:'Decide',q:'Qual é a forma mais prática de começar a planear a reforma?',o:['Calcular a diferença entre o que queres gastar e a pensão esperada','Esperar pelos 60 anos para ver o que há','Pôr tudo num único produto sem comparar custos'],c:0,why:'A diferença entre o que queres gastar e a pensão estimada é o que a poupança própria tem de cobrir; a partir dela calculas o capital e o esforço mensal.'},
    {t:'erro',id:'q4',ensina:['p3','p4','p8'],label:'Encontra o erro',q:'«A idade da reforma é 66 anos e 9 meses e fica sempre assim, por isso aos 60 já posso planear tudo.» Qual é o erro?',o:['Nenhum, a regra nunca muda','A idade normal muda com a esperança de vida e depende do ano e da carreira','O erro é só confundir meses com anos'],c:1,why:'A idade normal sobe com os anos (66 anos e 9 meses em 2026, 66 anos e 11 meses em 2027) e há regras para carreiras longas. Planear com uma regra fixa é arriscado.'}
  ], src:[_pl_ss,_pl_ssGov] },

{ id:'regra-4-por-cento', topic:'planeamento', o:2, title:'A regra dos 4% e como levantar dinheiro na reforma', mins:10,
  lead:'Chegar à reforma com um bom capital é metade do problema; a outra metade é saber quanto levantar por ano sem ficar sem dinheiro. A regra dos 4% é a resposta mais famosa, mas nasceu nos Estados Unidos, e quem vive em Portugal precisa de conhecer os seus limites.',
  blocks:[
    {t:'h',id:'h1',x:'A pergunta de fundo'},
    {t:'p',id:'p1',x:'Quando trabalhas, o dinheiro entra todos os meses. Na reforma, passa a sair. A questão é: <b>que fração do capital posso gastar por ano, de forma a não ficar sem nada antes de morrer?</b> Se levantares muito, esgotas a carteira cedo. Se levantares pouco, vives pior do que podias. Pensa num depósito de combustível numa viagem de duração incerta: tens de decidir o ritmo a que gastas sem saber exatamente quanto vai durar a estrada.'},

    {t:'h',id:'h2',x:'De onde vem a regra dos 4%'},
    {t:'p',id:'p2',x:'A regra tem origem em estudos de planeadores financeiros norte-americanos nos anos 90. O mais citado é o de William Bengen (1994), que testou, com dados históricos dos EUA, quanto um reformado poderia retirar por ano, ajustando à inflação, sem esgotar a carteira ao longo de 30 anos. Depois, um trabalho de três professores universitários (conhecido como o «estudo Trinity», 1998) chegou a conclusões parecidas. O resultado ficou resumido numa frase: <b>na reforma, retira 4% do capital no primeiro ano e, daí em diante, ajusta esse montante à inflação</b>.'},
    {t:'p',id:'p3',x:'Funciona assim: se tens 500 000 €, no primeiro ano levantas 20 000 € (4%). Se a inflação for de 2% nesse ano, no segundo levantas 20 400 €, e assim sucessivamente, <i>independentemente de o mercado ter subido ou descido</i>. O valor não acompanha a carteira, acompanha o custo de vida. Em quase todos os períodos de 30 anos testados nos EUA, a carteira (uma mistura de ações e obrigações) sobreviveu. O inverso é igualmente útil: para viver com X por ano, precisas de cerca de <b>25 vezes X</b> (porque 1 ÷ 0,04 = 25).'},
    {t:'w',id:'w1',w:'calc',c:'retire'},
    {t:'stat',id:'s1',v:Math.round(_c('retire',{ren:2000,ret:4})[0]),label:'Capital para levantar 2 000 € por mês a 4% (exemplo)'},

    {t:'h',id:'h3',x:'O que a regra assume (e a vida real raramente cumpre)'},
    {t:'ul',id:'u1',x:[
      '<b>Mercado norte-americano</b>: os dados são dos EUA, que tiveram um dos melhores séculos da história para as bolsas. Outros países tiveram resultados bem piores; o futuro pode ser diferente do passado.',
      '<b>Horizonte de 30 anos</b>: serve para quem se reforma por volta dos 65. Quem se reforma mais cedo precisa de uma retirada menor.',
      '<b>Carteira mista</b>: assume uma mistura entre ações e obrigações, sem custos altos. Com comissões e custos de produto elevados, a conta piora.',
      '<b>Sem impostos</b>: a regra original ignora os impostos sobre o que levantas.',
      '<b>Despesa constante em termos reais</b>: assume que gastas o mesmo todos os anos, ajustado à inflação, quando na realidade os gastos mudam (mais viagens no início, mais saúde mais tarde).',
      '<b>Sem outros rendimentos</b>: não conta com a pensão pública nem com outras fontes.']},

    {t:'h',id:'h4',x:'O inimigo escondido: o risco de sequência'},
    {t:'p',id:'p4',x:'Há um perigo que a média esconde: a <b>ordem</b> dos retornos conta. Se o mercado cair logo nos primeiros anos da reforma, estás a vender unidades baratas para pagar despesas, e quando o mercado recuperar há menos unidades para recuperar. Chama-se <b>risco de sequência</b> (de retornos). Na fase de poupança, as quedas até ajudam (compras mais barato); na fase de levantamento, fazem estragos.'},
    {t:'p',id:'p5',x:'Um exemplo com duas reformas que têm os <i>mesmos</i> dez retornos anuais (valores de exemplo, em termos reais), só em ordem diferente. Começam com 1 000 000 € e levantam 40 000 € por ano. A primeira tem as quedas no início (−25%, −10%, depois subidas); a segunda tem exatamente os mesmos anos de trás para a frente.'},
    {t:'stat',id:'s2',v:Math.round(_pl_fimA),label:'Ao fim de 10 anos, com as quedas logo no início'},
    {t:'stat',id:'s3',v:Math.round(_pl_fimB),label:'Ao fim de 10 anos, com as quedas só no fim (mesmos retornos)'},
    {t:'p',id:'p6',x:'A média dos retornos é idêntica, mas quem apanha a má fase no início fica com menos capital, e com menos capital as retiradas pesam mais. É por isso que os estudos testam muitos períodos históricos e não só um retorno médio.'},

    {t:'h',id:'h5',x:'Variantes para levantar dinheiro'},
    {t:'cmp',id:'c1',head:['Método','Como funciona','Vantagem','Limite'],rows:[
      ['4% fixo, ajustado à inflação','Levantas 4% no 1.º ano e ajustas à inflação','Simples e previsível','Rígido: não reage ao mercado'],
      ['Percentagem fixa do capital','Levantas todos os anos uma percentagem do valor atual','Nunca se esgota','Rendimento variável, pode baixar muito'],
      ['Barreiras (guardrails)','Retiras o habitual, mas cortas um pouco se o mercado cair muito e podes aumentar se subir','Equilíbrio entre estabilidade e segurança','Exige disciplina e margem para cortar despesa'],
      ['Baldes por prazo','Guardas 2 a 3 anos de despesas em liquidez e o resto investido; reabasteces o balde quando o mercado está bem','Dormes melhor nas quedas','Pode ter retorno menor pela liquidez parada'],
      ['Só rendimentos','Gastas dividendos e juros, não tocas no capital','Intuitivo','Pode forçar produtos de rendimento mais arriscados']]},
    {t:'p',id:'p7',x:'Não há o «melhor» método para toda a gente. O que os especialistas repetem é que <b>flexibilidade vale muito</b>: quem aceita cortar um pouco de despesa nos anos maus consegue levantar mais nos anos bons e reduz drasticamente o risco de ficar sem dinheiro.'},

    {t:'h',id:'h6',x:'Os limites para quem vive em Portugal'},
    {t:'p',id:'p8',x:'Portugal e a Zona Euro têm particularidades que a regra original não considera:'},
    {t:'ul',id:'u2',x:[
      '<b>Mercado diferente</b>: as bolsas da Europa e de Portugal não tiveram o mesmo historial dos EUA, e muitos portugueses investem em ETFs globais em euros. Os retornos futuros podem ser mais baixos do que os usados nos estudos. Em muitos planos europeus usa-se uma taxa de retirada mais prudente, como 3% a 3,5%, por segurança.',
      '<b>Custos</b>: o custo anual de um produto (TER) retira diretamente à carteira; 1% a mais de custos é uma parte grande dos 4%. Com ETFs de custo baixo, a regra funciona melhor (vê o tema «Custos e TER»).',
      '<b>Impostos</b>: em Portugal, as mais-valias de ações e ETF pagam, em regra, uma taxa autónoma de 28% sobre o saldo positivo anual (art. 72.º do CIRS, verificado em 17/11/2026). Quando vendes unidades para levantar, só a parte que é ganho entra no imposto, mas isso diminui a retirada líquida; um «4%» bruto pode ser menos na tua conta.',
      '<b>Sem 401k/IRA</b>: essas contas americanas não existem cá. As ferramentas são PPR, depósitos, certificados e ETFs UCITS por conta própria.',
      '<b>Moeda e inflação</b>: investir fora da zona euro traz risco cambial; a inflação também pode ser diferente (vê o tema «Risco cambial, de liquidez e de inflação»).',
      '<b>Pensão pública</b>: a pensão da Segurança Social reduz o que o teu capital tem de pagar, o que é um fator a favor; mas confirma sempre o valor esperado no simulador (vê o tema «Reforma e Segurança Social»).']},

    {t:'h',id:'h7',x:'Um caso real: a inflação dos anos 70'},
    {t:'p',id:'p9',x:'Nos Estados Unidos, quem se reformou em meados dos anos 60 e nos anos 70 apanhou uma combinação terrível: bolsas fracas durante anos e inflação alta, que fazia subir depressa o valor que tinha de levantar para manter o mesmo nível de vida. Nos estudos históricos, são esses reformados que costumam aparecer como o pior caso, e é em torno deles que se calibra a percentagem «segura». A lição para hoje: a regra dos 4% foi desenhada para sobreviver ao <i>pior</i> período conhecido, não ao período médio, e mesmo assim não garante o futuro. Quem tem flexibilidade (cortar despesa temporariamente, ter um balde de liquidez) atravessa melhor fases assim.'},

    {t:'h',id:'h8',x:'Os erros que mais custam'},
    {t:'ul',id:'u3',x:[
      'Tratar os 4% como lei: é uma regra prática baseada no passado dos EUA, não uma garantia.',
      'Aplicá-la a uma reforma de 40 ou 50 anos sem ajustar a percentagem para baixo.',
      'Ignorar impostos e custos do produto: o «4%» chega a ti líquido de bastante menos.',
      'Pôr tudo em ações até ao dia da reforma, e ficar exposto ao risco de sequência logo no início.',
      'Não ter liquidez para 2 a 3 anos: obriga a vender em baixa para pagar despesas.',
      'Esquecer a pensão pública e outros rendimentos, e poupar mais do que o necessário (ou menos).']},

    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p10',x:'Na prática, quem planeia a reforma em Portugal combina a pensão da Segurança Social (idade normal de 66 anos e 9 meses em 2026, com 15 anos civis de registo; verificado em 17/11/2026) com um capital por conta própria. Para saber como o dinheiro do PPR é tratado ao levantar, vê o tema «PPR: poupança com benefício fiscal»; para o imposto sobre o que vendes, o tema «Mais-valias: quanto imposto pagas ao vender». Uma estratégia comum é manter uma reserva em depósitos ou certificados para os primeiros anos de despesas (vê «Certificados de Aforro e do Tesouro»), e o resto em ETFs diversificados. Se a tua carreira não deu os 15 anos de registo, esta regra muda por completo: confirma a tua situação na Segurança Social.'},
    {t:'note',id:'n1',pending:true,x:'A taxa de retirada «segura» concreta para investidores europeus não tem fonte oficial: depende de retornos futuros, custos e impostos. Considera 4% como o ponto de partida americano e testa também com 3% a 3,5%.'},

    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u4',x:[
      'A regra dos 4% diz que podes levantar 4% do capital no 1.º ano e ajustar à inflação depois; equivale a ter 25 vezes a despesa anual.',
      'Nasceu em estudos americanos com 30 anos de horizonte e uma carteira mista; não é uma garantia nem uma lei.',
      'O risco de sequência (quedas logo no início) é o grande perigo; a flexibilidade na despesa e uma reserva de liquidez reduzem-no.',
      'Em Portugal, tem em conta custos, imposto de 28% sobre mais-valias, falta de contas tipo 401k, moeda e pensão pública.',
      'Para reformas longas (FIRE) ou mais prudentes, usa percentagens mais baixas e testa vários cenários.']},

    {t:'fazve',id:'q1',ensina:['p3','w1','s1'],q:'Queres levantar 2 000 € por mês na reforma, pela regra dos 4%. De quanto capital precisas?',unit:'€',answer:_c('retire',{ren:2000,ret:4})[0],tol:.01,why:'2 000 € × 12 = 24 000 € por ano; 24 000 ÷ 0,04 = 600 000 €, isto é, 25 vezes a despesa anual.'},
    {t:'decide',id:'q2',ensina:['p3'],label:'Decide',q:'Tens 500 000 € e levantas 4% no primeiro ano. No segundo ano, a inflação foi de 2%. Quanto levantas, segundo a regra original?',o:['20 000 €, o mesmo valor','20 400 €, o valor do 1.º ano ajustado à inflação','4% do valor atual da carteira'],c:1,why:'A regra fixa o montante do 1.º ano (20 000 €) e ajusta-o à inflação nos anos seguintes: 20 000 € × 1,02 = 20 400 €, independentemente de o mercado ter subido ou descido.'},
    {t:'decide',id:'q3',ensina:['p4','p5','s2','s3'],label:'Decide',q:'Duas reformas têm os mesmos retornos médios, mas uma tem as quedas logo no início. O que acontece?',o:['A que tem as quedas no início tende a ficar com menos capital, por causa do risco de sequência','Ficam sempre iguais, porque a média é a mesma','A que tem as quedas no início fica com mais capital'],c:0,why:'Vender unidades baratas no início para pagar despesas deixa menos capital para a recuperação. É o risco de sequência, e é por isso que a ordem dos retornos conta.'},
    {t:'erro',id:'q4',ensina:['u1','p8','u2'],label:'Encontra o erro',q:'«Vou reformar-me aos 40 com a regra dos 4%, porque sempre funcionou nos EUA por 30 anos.» Qual é o erro?',o:['A regra foi testada para 30 anos nos EUA; uma reforma aos 40 dura muito mais e noutro mercado, por isso a retirada tem de ser mais baixa','Nenhum, 4% serve sempre','O erro é só reformar-se aos 40'],c:0,why:'Os estudos assumem 30 anos e mercado norte-americano. Uma reforma de 50 anos, em euros, com custos e impostos, pede uma percentagem mais prudente e flexibilidade.'}
  ], src:[_pl_ss,_AT_72] },

{ id:'fire', topic:'planeamento', o:3, title:'Independência financeira (FIRE) sem ilusões', mins:8,
  lead:'FIRE promete reformar-se aos 40 ou 45 anos. Por baixo da promessa há uma ideia útil e simples: ter capital suficiente para que trabalhar passe a ser uma escolha. Vamos ver as contas, o que corre bem, o que costuma ser esquecido e o que muda em Portugal.',
  blocks:[
    {t:'h',id:'h1',x:'O que é FIRE, de facto'},
    {t:'p',id:'p1',x:'<b>FIRE</b> é uma sigla inglesa para <i>Financial Independence, Retire Early</i>: independência financeira e reforma antecipada. O movimento ganhou fama nos anos 2010, sobretudo nos EUA, com pessoas que poupavam metade do ordenado ou mais para deixar de depender de um emprego ainda jovens. A parte mais importante da sigla é a primeira: <b>independência financeira</b>, isto é, o ponto em que o rendimento dos teus investimentos cobre as tuas despesas. Se a seguir paras de trabalhar, mudas de trabalho ou trabalhas menos, a decisão é tua.'},
    {t:'p',id:'p2',x:'Pensa numa balança. De um lado, as tuas despesas anuais. Do outro, o que a tua carteira consegue gerar sem se esgotar. Quando o lado da carteira pesa mais, és financeiramente independente. Tudo o resto no movimento (estilo de vida, blogs, números radicais) são formas de empurrar esta balança.'},

    {t:'h',id:'h2',x:'A conta central: 25 vezes as despesas'},
    {t:'p',id:'p3',x:'A partir da regra dos 4% (vê o tema «A regra dos 4% e como levantar dinheiro na reforma»), o alvo é simples: <b>cerca de 25 vezes as tuas despesas anuais</b>. Se gastas 24 000 € por ano, precisas de 600 000 €. Se gastas 18 000 €, precisas de 450 000 €. Repara que o que importa é o que <i>gastas</i>, não o que ganhas: reduzir despesas baixa o alvo <i>e</i> aumenta o que podes poupar. Por isso cada euro cortado em despesas fixas vale duas vezes.'},
    {t:'p',id:'p4',x:'Isto leva a uma consequência curiosa: o tempo até chegares lá depende sobretudo da <b>taxa de poupança</b> (a fração do rendimento que poupas), e muito pouco do valor do rendimento. Vê a tabela, com retorno real de 5% ao ano (valor de exemplo, já descontada a inflação), partindo do zero:'},
    {t:'cmp',id:'c1',head:['Poupas do rendimento','Anos até ao alvo de 25 vezes as despesas'],rows:[10,25,40,50,65].map(p=>[p+'%',String(_pl_anosFi(p/100,5).toFixed(1)).replace('.',',')+' anos']),cap:'Cálculo teórico, a partir do zero, com retorno real constante de 5%. Na vida real o retorno oscila e há impostos e custos.'},
    {t:'p',id:'p5',x:'Quem poupa 10% leva mais de cinco décadas; quem poupa metade do rendimento chega em cerca de ' + Math.round(_pl_anosFi(.5,5)) + ' anos. A razão é dupla: poupar mais enche o balde mais depressa e, ao mesmo tempo, vives com menos, pelo que o alvo é mais baixo.'},
    {t:'p',id:'p6',x:'Para ver o efeito do tempo e do esforço mensal numa carteira concreta, experimenta a calculadora:'},
    {t:'w',id:'w1',w:'compound',p:{initial:10000,monthly:1000,rate:5,years:20}},

    {t:'h',id:'h3',x:'Variantes do movimento'},
    {t:'cmp',id:'c2',head:['Variante','Ideia','Para quem'],rows:[
      ['Lean FIRE','Viver com muito pouco, o que baixa o alvo','Quem aceita um estilo de vida frugal'],
      ['Fat FIRE','Alvo alto para manter um estilo de vida confortável','Quem tem rendimento alto e quer margem'],
      ['Barista FIRE','Capital parcial, mais trabalho de meio tempo ou menos exigente que cobre o resto','Quem quer reduzir stress sem parar de vez'],
      ['Coast FIRE','Já juntaste o suficiente para que, sem poupar mais, o capital cresça até ao alvo na idade normal da reforma','Quem quer trabalhar menos ou em algo que gosta, sem mais poupança'],
      ['Reforma tradicional','Poupar durante toda a carreira e reformar-se na idade normal','A grande maioria']]},
    {t:'p',id:'p7',x:'A mais realista para muita gente é o <b>Coast</b> ou o <b>Barista</b>: não pedem o salto total para a independência, mas aliviam a pressão. Uma pessoa de 30 anos que já juntou um bom capital pode, por exemplo, reduzir a poupança e escolher um trabalho que paga menos mas lhe dá mais tempo, porque o capital já cresce sozinho.'},

    {t:'h',id:'h4',x:'O que a conta simples esquece'},
    {t:'ul',id:'u1',x:[
      '<b>Reforma mais longa</b>: a regra dos 4% foi testada para 30 anos; quem para aos 40 pode viver 50 ou mais. Pede uma retirada mais baixa (3% a 3,5%) e portanto um alvo de 28 a 33 vezes as despesas.',
      '<b>Risco de sequência</b>: um mercado em queda logo no início da reforma é o pior cenário; por isso quem faz FIRE costuma manter uma reserva em liquidez e margem para cortar despesas.',
      '<b>Despesas que mudam</b>: casa, filhos, saúde, seguros. As despesas de aos 30 não são as de aos 60; e muitos descobrem que gastam <i>mais</i> sem a rotina do trabalho.',
      '<b>Impostos e custos</b>: o alvo deve ser calculado em valores líquidos de impostos e comissões.',
      '<b>Saúde e proteção</b>: sem emprego, perdes benefícios que o empregador dava; vê o tema «Seguros de proteção antes de investir (vida, saúde, responsabilidade)».',
      '<b>A pensão pública</b>: se paras de trabalhar cedo, acumulas menos anos de descontos, o que pode baixar a pensão futura (e é preciso um mínimo de 15 anos civis de registo).',
      '<b>O lado humano</b>: sem emprego, desaparece rotina, rede social e sentido. Muitos «reformados» acabam por trabalhar em algo que gostam, e isso é um bom resultado.']},

    {t:'h',id:'h5',x:'Um caso real: a crise de 2008 e o movimento FIRE'},
    {t:'p',id:'p8',x:'O movimento FIRE ganhou força depois da crise financeira de 2008, numa geração que viu o emprego tornar-se menos estável e a reforma pública parecer incerta. As bolsas subiram durante muitos anos e isso fez as contas parecerem fáceis: carteiras que cresciam a bom ritmo e poupanças que se multiplicavam. Mas essa década foi um período favorável, e nem sempre será assim. As pessoas que pararam de trabalhar com uma carteira 100% em ações e com despesas ajustadas ao limite sentiram-se muito vulneráveis quando a bolsa caiu fortemente em 2020 e em 2022. Quem tinha margem (reserva, flexibilidade, rendimento extra possível) atravessou bem; quem não tinha teve de voltar a trabalhar à pressa.'},

    {t:'h',id:'h6',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      'Usar retornos otimistas, copiados de gráficos de bolsa dos últimos anos, para calcular quando chegas ao alvo.',
      'Fixar o alvo sem testar o que acontece se o mercado cair 30% nos primeiros anos.',
      'Poupar de forma tão extrema que abandonas o plano ao fim de poucos anos, ou prejudicas saúde e relações.',
      'Esquecer os seguros, os impostos e as despesas imprevistas.',
      'Pôr o dinheiro só em ações até ao dia em que paras, sem reserva de liquidez.',
      'Medir o sucesso só pela idade em que paras e não pela qualidade de vida pelo caminho.']},

    {t:'h',id:'h7',x:'Em Portugal'},
    {t:'p',id:'p9',x:'FIRE em Portugal tem vantagens e dificuldades. Vantagens: um custo de vida que, fora das grandes cidades, pode ser relativamente moderado, e um serviço nacional de saúde. Dificuldades: salários em média baixos, o que dificulta uma taxa de poupança de 50%; imposto de 28% sobre as mais-valias de ações e ETF (art. 72.º do CIRS, verificado em 17/11/2026) a pesar sobre o que vendes para viver; e a necessidade de manter descontos para a Segurança Social, que exige pelo menos 15 anos civis de registo para a pensão de velhice. O PPR é um produto para a reforma: segundo o guia de deduções do IRS, o resgate sem penalização só é possível após 5 anos e em casos previstos; fora disso, o benefício fiscal recebido acresce à coleta com uma majoração (verificado em 17/11/2026). Por isso não serve de «dinheiro para os 40 anos». Vê os temas «Reforma e Segurança Social» e «PPR ou investir por conta própria» antes de decidir.'},
    {t:'note',id:'n1',pending:true,x:'O modo como se levanta dinheiro de ETFs de acumulação para viver (vender unidades) e o seu efeito fiscal ao longo dos anos dependem de regras que mudam. Confirma no Portal das Finanças e, se for um valor grande, com um contabilista.'},

    {t:'h',id:'h8',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'FIRE é, no essencial, independência financeira: o rendimento dos investimentos cobre as tuas despesas.',
      'O alvo costuma ser 25 vezes as despesas anuais (regra dos 4%); para reformas muito longas, mais.',
      'O que mais pesa não é o ordenado, é a taxa de poupança: quem poupa metade chega em cerca de 17 anos (exemplo teórico a 5% real).',
      'As variantes Coast e Barista aliviam a pressão sem exigir o salto total.',
      'Cuidado com o risco de sequência, os impostos, a saúde e os descontos para a Segurança Social.',
      'Em Portugal, o PPR e os impostos sobre mais-valias mudam as contas; planeia com margem.']},

    {t:'fazve',id:'q1',ensina:['p3'],q:'Gastas 18 000 € por ano. Pela regra dos 25 vezes as despesas, qual é o alvo de independência financeira?',unit:'€',answer:18000*25,tol:.01,why:'18 000 € × 25 = 450 000 €, o equivalente a retirar 4% ao ano (18 000 ÷ 450 000 = 4%).'},
    {t:'decide',id:'q2',ensina:['p4','c1','p5'],label:'Decide',q:'Duas pessoas têm o mesmo rendimento, mas uma poupa 10% e a outra 50%. Quem chega mais cedo à independência?',o:['A que poupa 10%, porque tem menos risco','Chegam ao mesmo tempo','Quem poupa 50%, porque junta mais depressa e precisa de um alvo mais baixo'],c:2,why:'Poupar mais enche o capital mais depressa e, ao mesmo tempo, significa viver com menos, o que baixa o alvo. A taxa de poupança pesa mais do que o valor do ordenado.'},
    {t:'decide',id:'q3',ensina:['u1','p3'],label:'Decide',q:'Alguém quer parar de trabalhar aos 38 anos. Em relação à regra dos 4% original, o que faz mais sentido?',o:['Considerar uma retirada mais baixa, porque a reforma pode durar bem mais de 30 anos','Usar o mesmo 4%, porque é uma regra universal','Retirar 8% para aproveitar mais cedo'],c:0,why:'A regra foi testada para cerca de 30 anos. Para uma reforma de 50 anos ou mais, usa-se uma percentagem mais prudente, o que exige um alvo maior.'},
    {t:'erro',id:'q4',ensina:['u1','p8'],label:'Encontra o erro',q:'«Tenho 25 vezes as despesas, tudo em ações, vou parar já. Se o mercado cair eu espero, não preciso de mais nada.» Qual é o erro?',o:['Nenhum, 25 vezes chega sempre','O erro é só ter ações','Ignora o risco de sequência: sem reserva nem margem para cortar, uma queda no início obriga a vender barato'],c:2,why:'O alvo de 25 vezes é um mínimo teórico. Sem reserva de liquidez nem flexibilidade nas despesas, uma queda no início da reforma pode obrigar a vender no pior momento.'}
  ], src:[_AT_72,_pl_ss,_pl_ebf] },

{ id:'seguros-protecao', topic:'planeamento', o:4, title:'Seguros de proteção antes de investir (vida, saúde, responsabilidade)', mins:8,
  lead:'Investir faz o dinheiro crescer, mas só se não tiveres de o gastar à pressa num imprevisto grande. Os seguros de proteção cobrem os riscos que uma poupança pequena não aguenta, e por isso vêm antes de aumentares a carteira.',
  blocks:[
    {t:'h',id:'h1',x:'Porque os seguros vêm antes dos investimentos'},
    {t:'p',id:'p1',x:'Imagina que juntaste 20 000 € em ETFs. Um acidente grave, uma doença longa ou uma ação em tribunal pode custar muito mais do que isso, e obrigar-te a vender tudo (provavelmente no pior momento). Um <b>seguro</b> serve para <i>transferir</i> esse risco para uma seguradora: pagas um valor pequeno e certo (o <b>prémio</b>) para te livrares de uma perda grande e improvável.'},
    {t:'p',id:'p2',x:'A lógica é diferente da do investimento. Num investimento, aceitas risco à espera de retorno. Num seguro, <b>pagas para tirar risco</b>, sabendo que na maior parte dos anos «não vais usar». Isso não é desperdício: é como o extintor de casa, que esperas nunca usar. Por isso a pergunta certa não é «vou ter retorno?», mas «que perda me destruiria, e quanto custa cobri-la?».'},

    {t:'h',id:'h2',x:'Os riscos que valem um seguro'},
    {t:'p',id:'p3',x:'Uma regra útil: segurar o que é <b>raro, grave e impossível de pagar do bolso</b>. O pequeno e frequente (um telemóvel, uma consulta) paga-se com o fundo de emergência; o raro e enorme (invalidez, morte de quem sustenta a família, um incêndio, uma condenação) é o que a poupança não aguenta.'},
    {t:'cmp',id:'c1',head:['Seguro','O que cobre','Quando faz sentido'],rows:[
      ['Vida (risco)','Paga um capital à família ou ao credor se morreres ou ficares incapacitado','Se alguém depende do teu rendimento ou há crédito ou dívida a pagar'],
      ['Saúde','Total ou parte dos custos de consultas, exames e internamentos em prestadores privados','Se queres alternativa ao sistema público ou rapidez; tem exclusões e limites'],
      ['Responsabilidade civil','Danos que causes a terceiros (por acidente, por exemplo)','Quase sempre, é barato e a perda pode ser enorme'],
      ['Multirriscos habitação','Danos na casa e no recheio (incêndio, água, tempestade, etc.)','Se és proprietário ou arrendatário com bens de valor'],
      ['Acidentes pessoais','Capital por morte ou invalidez causada por acidente','Complemento, não substitui o seguro de vida'],
      ['Proteção de rendimento','Paga parte do rendimento se não puderes trabalhar por doença ou acidente','Para quem depende do trabalho e não tem outra renda']]},
    {t:'p',id:'p4',x:'<b>Atenção a um engano comum</b>: os «seguros de poupança» ou «seguros financeiros» (como os unit-linked ou os seguros de capitalização) misturam proteção e investimento e são <i>outra coisa</i>. Costumam ter custos mais altos e menos transparência do que um ETF; avalia-os como investimentos, não como seguros de proteção. Para comparar custos, vê o tema «Custos e TER».'},

    {t:'h',id:'h3',x:'Quanto de seguro de vida precisas'},
    {t:'p',id:'p5',x:'Um método simples é o das <b>necessidades</b>: soma o que a família teria de pagar ou gastar se tu faltasses e subtrai o que já tem. Por exemplo (valores de exemplo): dívida da casa de 150 000 €, despesas anuais de 24 000 € que a família quer cobrir durante 5 anos, e poupança já existente de 30 000 €.'},
    {t:'stat',id:'s1',v:150000+24000*5-30000,label:'Capital de seguro de vida necessário (exemplo)'},
    {t:'p',id:'p6',x:'O valor depende do teu caso: com filhos pequenos e uma só fonte de rendimento, o capital deve ser maior e o prazo mais longo; se vives sozinho e sem dependentes, talvez o seguro de vida nem seja prioritário (e um seguro de invalidez ou de rendimento valha mais). Rever de vez em quando: à medida que a dívida diminui e os filhos crescem, o capital necessário desce.'},

    {t:'h',id:'h4',x:'O que ler numa apólice antes de assinar'},
    {t:'ul',id:'u1',x:[
      '<b>Capital seguro e limites</b>: o máximo que a seguradora paga.',
      '<b>Franquia</b>: a parte do dano que ficas a pagar tu; franquias mais altas baixam o prémio, mas exigem reserva.',
      '<b>Exclusões</b>: o que <i>não</i> está coberto (doenças pré-existentes, desportos de risco, etc.). É a parte mais importante a ler.',
      '<b>Períodos de carência e de espera</b>: tempo antes de a cobertura começar.',
      '<b>Beneficiários</b>: quem recebe o capital, e se está atualizado (casamento, filhos).',
      '<b>Atualização do prémio</b>: como e quanto sobe com a idade; um prémio muito baixo hoje pode subir muito.',
      '<b>Cancelamento</b>: condições para cancelar e se há penalizações.']},
    {t:'p',id:'p7',x:'Compara pelo menos três propostas, pergunta tudo o que não perceberes e guarda a apólice onde a família a encontre. Desconfia de quem te aconselha apenas a «que tens de ter este» sem explicar o que cobre, porque quem vende também ganha comissão.'},

    {t:'h',id:'h5',x:'A ordem certa: reserva, seguros, investimento'},
    {t:'p',id:'p8',x:'Uma sequência prática para a segurança financeira:'},
    {t:'ul',id:'u2',x:[
      '<b>1. Fundo de emergência</b>: despesas de alguns meses em dinheiro de acesso rápido. Calcula o teu com a ferramenta abaixo e vê o tema «Fundo de emergência: a rede por baixo de tudo».',
      '<b>2. Seguros essenciais</b>: responsabilidade civil, o da casa se tens bens ou crédito, e vida ou rendimento se alguém depende de ti.',
      '<b>3. Dívidas caras pagas</b> (vê «Dívida boa e dívida má»).',
      '<b>4. Investir a longo prazo</b> com o que sobra, sem o risco de teres de vender no pior momento.']},
    {t:'w',id:'w1',w:'calc',c:'emergency'},

    {t:'h',id:'h6',x:'Um caso real: o confinamento de 2020'},
    {t:'p',id:'p9',x:'Em 2020, o confinamento por causa da covid-19 mostrou a quem não tinha reserva nem proteção como um choque de rendimento pode ser súbito: trabalhadores independentes e de pequenos negócios viram os rendimentos parar de um dia para o outro, enquanto as despesas fixas continuavam. Quem tinha fundo de emergência e alguma proteção aguentou melhor; quem não tinha teve de usar crédito ou desfazer investimentos em baixa. A lição é geral: o risco que mais assusta nem sempre é o que acontece, o que importa é estar preparado para os que, mesmo raros, não podes pagar.'},

    {t:'h',id:'h7',x:'Os erros que mais custam'},
    {t:'ul',id:'u3',x:[
      'Investir tudo e ficar sem fundo de emergência nem seguros, quando a perda de um único imprevisto apaga anos de poupança.',
      'Comprar seguros por medo e em excesso, para riscos pequenos que o fundo de emergência cobre.',
      'Confundir seguro de proteção com «seguro poupança»: pagam-se custos pelo investimento sem a mesma transparência.',
      'Não ler as exclusões e descobrir só no sinistro que a situação não está coberta.',
      'Manter o beneficiário desatualizado (por exemplo, um ex-companheiro).',
      'Escolher só pelo prémio mais baixo, sem comparar coberturas e franquias.']},

    {t:'h',id:'h8',x:'Em Portugal'},
    {t:'p',id:'p10',x:'Os seguros em Portugal são fiscalizados pela ASF (Autoridade de Supervisão de Seguros e Fundos de Pensões), e podes vê-los através de seguradoras e de mediadores de seguros registados. Alguns seguros são obrigatórios em certas situações (por exemplo, o de responsabilidade civil automóvel), mas as exigências concretas, e os seguros ligados a crédito à habitação, dependem da lei em vigor. Depois de escolheres, guarda a apólice e revê-a quando a tua vida mudar. Se quiseres saber se o prémio de um seguro tem efeitos no IRS, confirma no Portal das Finanças.'},
    {t:'note',id:'n1',pending:true,x:'As regras de obrigatoriedade dos seguros (como o de responsabilidade civil automóvel e os associados ao crédito à habitação), os valores mínimos e os benefícios fiscais dos prémios mudam e não foram confirmados em fonte oficial para este tema. Confirma na ASF e no Portal das Finanças.'},

    {t:'h',id:'h9',x:'Em poucas palavras'},
    {t:'ul',id:'u4',x:[
      'Seguros transferem riscos raros e graves, que a poupança não aguenta, para uma seguradora, em troca de um prémio pequeno.',
      'Segura o raro e o grave, e paga o pequeno com o fundo de emergência.',
      'Seguro de vida: calcula pelas necessidades (dívidas mais despesas a cobrir, menos o que já existe).',
      'Lê sempre exclusões, franquia, carência e beneficiários; compara propostas.',
      'Seguros de poupança misturam proteção com investimento; avalia-os pelos custos.',
      'Ordem prática: fundo de emergência, seguros essenciais, dívidas caras e só depois investir mais.']},

    {t:'decide',id:'q1',ensina:['p1','p3','c1'],label:'Decide',q:'Qual destes riscos faz mais sentido cobrir com um seguro e não com o fundo de emergência?',o:['Reparar um telemóvel','Uma consulta de rotina','Uma condenação por danos causados a terceiros, que pode ser muito maior do que a tua poupança'],c:2,why:'Os seguros servem para riscos raros, graves e impossíveis de pagar do bolso, como a responsabilidade civil. O pequeno e frequente paga-se com a reserva.'},
    {t:'fazve',id:'q2',ensina:['p5','s1'],q:'Tens uma dívida de 150 000 €, queres cobrir 5 anos de despesas de 24 000 € por ano à tua família e já tens 30 000 € de poupança. Que capital de seguro de vida precisas, pelo método das necessidades?',unit:'€',answer:150000+24000*5-30000,tol:.01,why:'150 000 + (24 000 × 5 = 120 000) − 30 000 = 240 000 €.'},
    {t:'decide',id:'q3',ensina:['p4'],label:'Decide',q:'Um «seguro de poupança» com componente de investimento e custos elevados deve ser avaliado como...',o:['Um investimento, comparando os custos com alternativas simples','Um seguro de proteção, só','Um depósito a prazo'],c:0,why:'Misturam proteção e investimento e costumam ter custos altos. Deves avaliá-los como investimentos, com os custos à vista.'},
    {t:'erro',id:'q4',ensina:['u2','p8'],label:'Encontra o erro',q:'«Já invisto 100% do que ganho e não tenho fundo de emergência nem seguros, porque assim o dinheiro rende mais.» Qual é o erro?',o:['Sem reserva nem proteção, um imprevisto obriga a vender investimentos em má altura','Nenhum, investir tudo é sempre melhor','O erro é investir demasiado cedo'],c:0,why:'Fundo de emergência e seguros essenciais vêm antes de aumentar a carteira: evitam ter de vender no pior momento para pagar um imprevisto.'}
  ], src:[] },

{ id:'ppr-ou-conta', topic:'planeamento', o:5, title:'PPR ou investir por conta própria', mins:7,
  lead:'O PPR dá uma dedução no IRS, mas prende o dinheiro e cobra custos. Investir por tua conta é mais flexível e muitas vezes mais barato. A pergunta certa não é «qual é melhor», mas quando o benefício fiscal compensa o que perdes.',
  blocks:[
    {t:'h',id:'h1',x:'Duas formas de poupar para o longo prazo'},
    {t:'p',id:'p1',x:'Um <b>PPR</b> (Plano Poupança Reforma) é um produto financeiro para a reforma com benefício fiscal. Por baixo pode ser um fundo, um seguro ou outro veículo, e o mais importante é que não é um «tipo de investimento»: é uma <i>embalagem</i> fiscal à volta de um investimento. Investir <b>por conta própria</b> quer dizer escolher tu os ativos (por exemplo, ETFs UCITS) numa corretora ou banco, sem embalagem especial.'},
    {t:'p',id:'p2',x:'Pensa numa mala de viagem com desconto: o PPR é a mala com desconto, mas com regras para a levares; a conta própria é a mala sem desconto, mas que podes abrir quando quiseres. O desconto só compensa se não perderes mais noutro lado (custos, rigidez).'},

    {t:'h',id:'h2',x:'O benefício fiscal, em concreto'},
    {t:'p',id:'p3',x:'Segundo o Estatuto dos Benefícios Fiscais (art. 21.º) e o guia de deduções do IRS de 2025 (verificado em 17/11/2026), é dedutível <b>20% do valor aplicado</b> em PPR, com limites que dependem da idade a 1 de janeiro: <b>400 €</b> se tens menos de 35 anos, <b>350 €</b> entre 35 e 50 anos, e <b>300 €</b> com mais de 50 anos. Isto é, para aproveitares o máximo aos 30 anos, basta aplicar 2 000 € no ano (20% de 2 000 € = 400 €). A partir daí, mais dinheiro no PPR já não dá mais dedução.'},
    {t:'stat',id:'s1',v:2000,label:'Valor a aplicar num ano para atingir os 400 € de dedução (menos de 35 anos)'},
    {t:'p',id:'p4',x:'É uma dedução à coleta (ao imposto a pagar), por isso só te serve se tiveres IRS a pagar. E é um benefício <b>limitado</b>: no máximo algumas centenas de euros por ano. Se os custos do PPR forem altos, podem comer esse ganho durante décadas.'},

    {t:'h',id:'h3',x:'As regras do dinheiro preso'},
    {t:'p',id:'p5',x:'O PPR não é uma conta à ordem. O resgate sem penalização só é possível <b>após 5 anos</b> e nos casos previstos na lei (verifica-os com a entidade gestora antes de subscreveres). Fora disso, o benefício recebido acresce à coleta do ano do resgate, com uma <b>majoração de 10% por cada ano ou fração</b> (verificado em 17/11/2026, segundo o guia da AT). Ou seja: levantar cedo anula o benefício, e pode até ser pior do que nunca o ter tido.'},
    {t:'note',id:'n1',pending:true,x:'O tratamento do PPR no levantamento (imposto sobre os rendimentos, enquadramento exato e prazos) não foi confirmado em fonte oficial para este tema. Antes de resgatares um PPR, confirma as regras atuais com o Portal das Finanças e com a entidade gestora.'},

    {t:'h',id:'h4',x:'Comparação lado a lado'},
    {t:'cmp',id:'c1',head:['','PPR','Investir por conta própria (ETFs)'],rows:[
      ['Benefício fiscal','Dedução de 20% do valor aplicado, com limite por idade (400 / 350 / 300 €)','Nenhum à entrada'],
      ['Acesso ao dinheiro','Condicionado: levantar cedo anula o benefício e pode ter majoração','Livre, mas pagas imposto sobre as mais-valias'],
      ['Custos','Frequentemente mais altos (comissão de gestão)','Geralmente muito baixos'],
      ['Escolha dos ativos','Limitada ao que o PPR oferece','Total (dentro do que a corretora oferece)'],
      ['Esforço','Baixo, tudo gerido','Maior: escolhes e rebalanceias'],
      ['Disciplina','Ajuda quem tem tendência a gastar, porque está «preso»','Exige força de vontade para não mexer']]},
    {t:'p',id:'p6',x:'Repara no ponto da disciplina: o facto de o PPR ser difícil de levantar é, para quem sabe que gasta o que vê, uma <b>vantagem</b>, mesmo com custos mais altos. Para quem tem autocontrolo, é uma desvantagem.'},

    {t:'h',id:'h5',x:'Contas: quanto custa a diferença de custos'},
    {t:'p',id:'p7',x:'Para ver o efeito dos custos ao longo do tempo, compara dois produtos com a mesma carteira por baixo. Altera os números e vê quanto perdes só em comissões:'},
    {t:'w',id:'w1',w:'calc',c:'fees'},
    {t:'p',id:'p8',x:'Um exemplo prático (valores de exemplo). Aos 30 anos, aplicas 2 000 € por ano durante 30 anos, e o mercado rende 6% ao ano antes de custos. O ETF custa 0,2% por ano, e o PPR custa 1,8%. Quanto tens no fim?'},
    {t:'stat',id:'s2',v:Math.round(lrnCompound({initial:0,monthly:2000/12,rate:5.8,years:30}).at(-1).total),label:'ETF (0,2% de custos): valor ao fim de 30 anos'},
    {t:'stat',id:'s3',v:Math.round(lrnCompound({initial:0,monthly:2000/12+400/12,rate:4.2,years:30}).at(-1).total),label:'PPR (1,8% de custos), contando com os 400 € por ano de dedução reinvestidos'},
    {t:'p',id:'p9',x:'Mesmo contando com a dedução máxima de 400 € por ano reinvestida na mesma carteira, o PPR com custos altos fica atrás. Se o PPR custasse pouco mais do que o ETF, o resultado inverter-se-ia, porque a dedução seria um bónus real. Moral: <b>o benefício fiscal só vale se os custos forem baixos</b>. Por isso a primeira pergunta a fazer sobre um PPR é «quanto custa por ano?».'},

    {t:'h',id:'h6',x:'Um caso real: o fim das promessas de rendimento garantido'},
    {t:'p',id:'p10',x:'Durante muitos anos, os depósitos e produtos «seguros» davam juros razoáveis, e muita gente comprou PPR e seguros de poupança a esperar rendimentos garantidos. Depois da crise de 2008, as taxas de juro desceram para perto de zero, e muitos desses produtos renderam menos do que a inflação, enquanto cobravam comissões. Quem olhou só para a «dedução fiscal» e não para o rendimento líquido acabou com resultados pobres. A lição é que um benefício fiscal pequeno não substitui um bom investimento de base.'},

    {t:'h',id:'h7',x:'Os erros que mais custam'},
    {t:'ul',id:'u1',x:[
      'Comprar PPR só porque «dá IRS», sem comparar custos nem perguntar o que há por baixo.',
      'Aplicar mais do que o necessário para atingir o limite da dedução, sem ganho fiscal adicional.',
      'Resgatar antes do tempo, perdendo o benefício e pagando majoração.',
      'Pôr o dinheiro do fundo de emergência ou de objetivos de curto prazo num PPR.',
      'Não verificar quem gere o PPR, a política de investimento e os custos totais (comissões de gestão, depósito, resgate).',
      'Ter o PPR parado em depósito, a render pouco, durante décadas.']},

    {t:'h',id:'h8',x:'Como decidir'},
    {t:'ul',id:'u2',x:[
      '<b>Primeiro</b> o fundo de emergência e as dívidas caras (vê o tema «Fundo de emergência: a rede por baixo de tudo»).',
      '<b>Depois</b>, vê se tens IRS a pagar suficiente para aproveitar a dedução e qual é o teu limite por idade.',
      '<b>Compara o custo anual total</b> do PPR com o de um ETF; se for muito mais alto, a dedução tem de compensar.',
      'Podes <b>usar o PPR só até ao limite da dedução</b> e investir o resto por conta própria.',
      'Se sabes que mexerias no dinheiro por impulso, o «preso» do PPR pode ser uma vantagem.']},

    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p11',x:'Os PPR são um produto português, regulados e fiscalizados (consoante sejam fundos ou seguros) e oferecidos por bancos, seguradoras e gestoras. Os ETFs que se compram por conta própria têm de ser UCITS, com KID (por exemplo, os dois ETFs do S&P 500 listados na ficha do tema «ETFs e diversificação: o que se compra em Portugal»). Para impostos sobre a venda, vê «Mais-valias: quanto imposto pagas ao vender», e para os custos «Custos e TER». O tema «PPR: poupança com benefício fiscal» explica o produto em detalhe.'},

    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'PPR é uma embalagem fiscal para a reforma: dedução de 20% do valor aplicado, com limites de 400, 350 e 300 € consoante a idade.',
      'O benefício é limitado, e levantar cedo pode anular-se e implicar majoração de 10% por ano ou fração.',
      'Compara sempre o custo anual: um benefício de algumas centenas de euros não compensa custos altos durante décadas.',
      'Não é «um ou outro»: podes aproveitar a dedução até ao limite e investir o resto por conta própria.',
      'Primeiro reserva e dívidas caras; só depois pensas em PPR.']},

    {t:'decide',id:'q1',ensina:['c1','p5'],label:'Decide',q:'Qual é a principal desvantagem de um PPR face a investir por conta própria?',o:['Não paga nada','O dinheiro fica condicionado e os custos costumam ser mais altos','Não permite investir em ações'],c:1,why:'Levantar cedo anula o benefício e os custos de gestão costumam ser mais altos do que os de um ETF.'},
    {t:'fazve',id:'q2',ensina:['p3','s1'],q:'Tens 32 anos. Quanto precisas de aplicar num ano em PPR para teres a dedução máxima de 400 €?',unit:'€',answer:400/0.2,tol:.01,why:'A dedução é 20% do valor aplicado. Para 400 €, precisas de 400 ÷ 0,20 = 2 000 €. Além disso, não ganhas mais dedução.'},
    {t:'decide',id:'q3',ensina:['p7','w1','p9','s2','s3'],label:'Decide',q:'Com os mesmos ativos por baixo, um produto custa 1,8% por ano e outro 0,2%. O que acontece ao longo de 30 anos?',o:['O mais barato rende menos','Nada de relevante','O mais caro deixa-te com bastante menos dinheiro'],c:2,why:'Custos pequenos repetidos todos os anos acumulam-se: o produto mais caro deixa-te com muito menos no fim, mesmo contando com a dedução fiscal.'},
    {t:'erro',id:'q4',ensina:['p5','u1'],label:'Encontra o erro',q:'«Vou pôr 5 000 € num PPR, e se precisar levanto para uma entrada de casa daqui a dois anos, sem problemas.» Qual é o erro?',o:['Nenhum, o PPR é como uma conta à ordem','O resgate fora dos casos previstos e do prazo faz acrescer o benefício à coleta, com majoração','O erro é só o valor'],c:1,why:'O PPR é para a reforma: levantar fora dos casos previstos anula o benefício e pode ter majoração de 10% por ano ou fração. Não serve para objetivos de curto prazo.'}
  ], src:[_pl_ebf] },

{ id:'casa-ou-investir', topic:'planeamento', o:6, title:'Comprar casa ou investir', mins:9,
  lead:'Comprar casa e investir não são a mesma decisão. Uma é onde vives, a outra é como fazes crescer o dinheiro. Misturá-las leva a erros caros: pagar demais por uma casa «porque é um investimento», ou nunca comprar uma por medo.',
  blocks:[
    {t:'h',id:'h1',x:'Duas decisões diferentes'},
    {t:'p',id:'p1',x:'Uma casa própria dá <b>estabilidade</b> e evita pagar renda, mas concentra muito dinheiro num só ativo, difícil de vender depressa, e traz custos: entrada, impostos e taxas de aquisição, manutenção, seguros e os juros do crédito. Arrendar mantém o dinheiro livre e flexível, mas não constrói património imobiliário e a renda sobe com o tempo.'},
    {t:'p',id:'p2',x:'Pensa assim: quando compras casa, estás a fazer duas coisas ao mesmo tempo. Estás a <b>consumir</b> habitação (uma necessidade, que também terias a arrendar) e a <b>investir</b> (a casa pode valorizar ou desvalorizar). Só a segunda parte é um investimento. Por isso a comparação justa não é «comprar versus não fazer nada», mas «comprar versus arrendar e investir a diferença».'},

    {t:'h',id:'h2',x:'Os custos que se esquecem'},
    {t:'ul',id:'u1',x:[
      '<b>Entrada</b>: o banco financia só uma parte do valor; o resto tem de ser teu.',
      '<b>Impostos e taxas</b> na compra e na posse (IMT, imposto do selo, IMI): têm regras e valores que mudam, por isso confirma sempre no Portal das Finanças.',
      '<b>Prestação</b>: capital mais juros, que dependem da taxa e do prazo.',
      '<b>Manutenção</b>: obras, condomínio, avarias; uma regra prática comum é reservar uma percentagem do valor da casa por ano.',
      '<b>Seguros</b>: da casa e, muitas vezes, de vida ligado ao crédito.',
      '<b>Custo de oportunidade</b>: o dinheiro da entrada podia estar investido e a render.']},

    {t:'h',id:'h3',x:'O crédito: o que é preciso perceber'},
    {t:'p',id:'p3',x:'Quem compra casa com crédito paga <b>juros</b>, e no início da vida do empréstimo a maior parte da prestação são juros, não capital. Por isso, nos primeiros anos, pagas muito e o capital em dívida desce devagar. Usa a calculadora com os teus números, e experimenta taxas diferentes:'},
    {t:'w',id:'w1',w:'calc',c:'debt'},
    {t:'p',id:'p4',x:'Os créditos à habitação têm, em geral, uma taxa ligada à <b>Euribor</b> (taxa de referência europeia) mais uma margem do banco, e podem ser de <b>taxa variável</b> (a prestação sobe e desce com a Euribor), <b>fixa</b> (não muda durante um período) ou <b>mista</b>. Com taxa variável, a subida de juros pode aumentar muito a prestação. Convém por isso testar o crédito com uma taxa mais alta do que a atual.'},
    {t:'cmp',id:'c1',head:['Cenário (150 000 € a 30 anos)','Prestação mensal','Total pago ao banco','Só em juros'],rows:[4,6].map(t=>{ const o=_c('debt',{cap:150000,tax:t,ano:30}); return [t+'% (taxa nominal)',_e(o[0]),_e(o[1]),_e(o[2])]; }),cap:'Cálculo de exemplo, sem seguros nem comissões. A taxa e o prazo reais dependem do banco.'},
    {t:'p',id:'p5',x:'Repara: dois pontos percentuais a mais fazem a prestação subir cerca de ' + _e(_c('debt',{cap:150000,tax:6,ano:30})[0]-_c('debt',{cap:150000,tax:4,ano:30})[0]) + ' por mês, e os juros pagos ao longo dos 30 anos aumentam mais de metade. Se o ordenado não aguentar essa subida, o crédito é demasiado arriscado.'},
    {t:'p',id:'p6',x:'A <b>TAN</b> é a taxa nominal do empréstimo; a <b>TAEG</b> inclui também comissões, seguros e outros encargos obrigatórios, e é a que permite comparar propostas de bancos diferentes.'},

    {t:'h',id:'h4',x:'Comprar ou arrendar: como comparar'},
    {t:'p',id:'p7',x:'Para decidir com números, compara os custos <i>totais</i> dos dois cenários: no cenário «comprar» somas prestação, impostos, manutenção, seguros e o custo do dinheiro da entrada; no cenário «arrendar» somas a renda e invistes a diferença (a entrada e a diferença mensal entre o que pagarias de prestação e de renda). A casa também valoriza ou desvaloriza, e esse pormenor pesa muito mais do que parece, porque é impossível de prever. Se ficares na casa muitos anos, comprar tende a compensar mais; se vais mudar em poucos anos, os custos de compra e venda pesam e arrendar costuma ganhar.'},
    {t:'ul',id:'u2',x:[
      'Compara a <b>prestação total</b> com a renda que pagarias, e inclui os custos da casa.',
      'Não gastes todas as reservas na entrada: precisas de fundo de emergência.',
      'Um crédito grande pesa durante décadas: simula com taxas mais altas para ver se aguentas.',
      'Comprar casa para viver é uma decisão de vida; o rendimento financeiro é secundário.',
      'Evita que a prestação passe de uma fração confortável do rendimento líquido; muitos orientadores usam cerca de um terço como referência prática, mas depende de cada situação.']},

    {t:'h',id:'h5',x:'Um caso real: o imobiliário em 2008 e depois'},
    {t:'p',id:'p8',x:'Nos EUA, antes de 2008, muitas famílias compraram casas com crédito fácil convencidas de que o preço nunca desceria. Quando os preços caíram e as taxas subiram, muitos ficaram com dívidas superiores ao valor da casa, e a crise financeira espalhou-se ao mundo. Em Portugal, o setor imobiliário também sofreu na crise da dívida que se seguiu: crédito mais difícil, preços e vendas a cair durante anos. O que se aprende não é «casas são más», mas que o preço de uma casa pode cair e que quem tem uma prestação folgada e reservas aguenta, enquanto quem tem o orçamento no limite é forçado a vender mal.'},

    {t:'h',id:'ha',x:'Uma comparação com números: comprar ou arrendar e investir'},
    {t:'p',id:'pa',x:'Vejamos um exemplo simples, com valores inventados e sem custos de compra (que só pioram o lado de comprar). Uma casa custa 200 000 €. Dás 50 000 € de entrada e pedes 150 000 € a 4% durante 30 anos. A prestação é de ' + _e(_c('debt',{cap:150000,tax:4,ano:30})[0]) + ' por mês, e juntas 150 € de custos mensais de manutenção e seguros. Em alternativa, arrendas uma casa equivalente por 800 € por mês e investes os 50 000 € e a diferença mensal (prestação mais custos menos a renda) a 5% ao ano. Passados 10 anos, onde estás?'},
    {t:'cmp',id:'c2',head:['Preço da casa ao fim de 10 anos','Património se compraste (casa menos dívida)','Património se arrendaste e investiste'],rows:[-10,0,10].map(v=>{ const r=4/1200,n=120,pmt=_c('debt',{cap:150000,tax:4,ano:30})[0],div=150000*Math.pow(1+r,n)-pmt*(Math.pow(1+r,n)-1)/r,dif=pmt+150-800,inv=lrnCompound({initial:50000,monthly:dif,rate:5,years:10}).at(-1).total; return [(v>0?'Sobe ':v<0?'Desce ':'Fica igual, ')+(v?Math.abs(v)+'%':'200 000 €'),_e(200000*(1+v/100)-div),_e(inv)]; }),cap:'Cálculo de exemplo: taxa de 4% no crédito, 5% ao ano no investimento, renda de 800 €, sem impostos nem custos de compra e venda. Na vida real, os valores mudam.'},
    {t:'p',id:'pb',x:'A leitura honesta é esta: o resultado depende sobretudo do que acontece ao preço da casa, que ninguém consegue prever. Se o preço subir, comprar ganha; se descer, arrendar e investir ganha. Por isso a casa não deve ser escolhida «pelo retorno», mas porque queres lá viver e consegues pagar com folga.'},

    {t:'h',id:'hb',x:'Antes de pedires crédito, passo a passo'},
    {t:'ul',id:'ua',x:[
      '<b>1. Mede o que podes pagar</b>: soma os teus rendimentos líquidos e as tuas despesas atuais, e vê quanto sobra de forma estável.',
      '<b>2. Guarda a reserva</b>: mantém o fundo de emergência intacto, mesmo depois de pagares a entrada.',
      '<b>3. Faz a simulação em baixo, médio e alto</b>: testa a prestação com a taxa de hoje e com mais dois pontos percentuais.',
      '<b>4. Compara propostas</b> de vários bancos pela TAEG e pelo que está incluído (seguros, comissões).',
      '<b>5. Soma os custos de compra</b> e os custos anuais de ter a casa (impostos, condomínio, obras).',
      '<b>6. Só então decide</b>, e se a conta só fecha «no limite», adia ou procura uma casa mais barata.']},

    {t:'h',id:'hc',x:'Outro caso: quando as taxas de juro subiram'},
    {t:'p',id:'pc',x:'Entre 2022 e 2023, as taxas de juro na Zona Euro subiram muito depressa depois de anos perto de zero, e a Euribor acompanhou. Quem tinha crédito à habitação a taxa variável viu a prestação mensal aumentar de forma sensível em poucos meses, e muitas famílias tiveram de apertar o orçamento, renegociar com o banco ou rever planos. Quem tinha folga no orçamento atravessou a fase com desconforto; quem tinha comprado «no limite» sofreu mais. É o exemplo prático de porque se testa o crédito com taxas mais altas do que as de hoje.'},

    {t:'h',id:'h6',x:'Os erros que mais custam'},
    {t:'ul',id:'u3',x:[
      'Gastar todas as reservas na entrada, ficando sem fundo de emergência.',
      'Assumir uma prestação que só cabe no orçamento com taxas baixas.',
      'Comprar «porque o preço nunca desce» ou «porque arrendar é deitar dinheiro fora».',
      'Esquecer custos de posse: IMI, condomínio, obras, seguros.',
      'Ter todo o património numa só casa, sem diversificação.',
      'Não comparar TAEG de várias propostas, só olhar para a prestação mais baixa.']},

    {t:'h',id:'h7',x:'Em Portugal'},
    {t:'p',id:'p9',x:'Em Portugal, comprar casa envolve IMT, imposto do selo e IMI, cuja tabela e valores mudam; confirma sempre no Portal das Finanças. Pede propostas a vários bancos, compara a TAEG e consulta o Portal do Cliente Bancário do Banco de Portugal. Em termos de planeamento, vê o tema «Dívida boa e dívida má» para perceber quando o crédito ajuda e quando atrapalha, e o tema «Objetivos e horizonte temporal» para decidires quanto do dinheiro deve estar investido e quanto reservado para a entrada.'},
    {t:'note',id:'n2',pending:true,x:'Os impostos e taxas sobre a compra e a posse de imóveis (como IMT, imposto do selo e IMI) têm regras e valores que mudam. Consulta o Portal das Finanças e o teu banco para os números atuais. Os limites de financiamento impostos pelo Banco de Portugal também não foram confirmados para este tema.'},

    {t:'h',id:'h8',x:'Em poucas palavras'},
    {t:'ul',id:'u4',x:[
      'Comprar casa mistura consumo (habitação) e investimento; compara «comprar» com «arrendar e investir a diferença».',
      'Os custos escondidos (impostos, manutenção, seguros, juros) pesam mais do que a prestação.',
      'Testa sempre o crédito com taxas mais altas e olha para a TAEG, não só para a prestação.',
      'Mantém o fundo de emergência: nunca gastes tudo na entrada.',
      'A casa é um ativo concentrado e pouco líquido; o investimento financeiro diversifica.']},

    {t:'fazve',id:'q1',ensina:['p3','w1','c1'],q:'Pedes 150 000 € a 4% (taxa nominal) durante 30 anos. Qual é a prestação mensal aproximada?',unit:'€',answer:_c('debt',{cap:150000,tax:4,ano:30})[0],tol:.02,why:'Cerca de 716 € por mês. No fim terás pago aproximadamente 258 000 €, ou seja, mais de 107 000 € só em juros.'},
    {t:'decide',id:'q2',ensina:['u2','p1'],label:'Decide',q:'Estás a pensar gastar todas as tuas reservas na entrada de uma casa. Qual o risco principal?',o:['Nenhum, as casas só sobem','Ficas sem fundo de emergência, e um imprevisto pode obrigar-te a pedir dinheiro caro','O banco não te dá crédito'],c:1,why:'Sem reserva, um imprevisto força-te a endividar-te ou a vender mal. Preserva sempre um fundo de emergência.'},
    {t:'decide',id:'q3',ensina:['p4','p5'],label:'Decide',q:'Com um crédito de taxa variável, o que acontece se a Euribor subir muito?',o:['A prestação sobe, e deves testar se o orçamento aguenta','A prestação desce','Nada, a prestação é fixa'],c:0,why:'Na taxa variável a prestação acompanha a Euribor. Por isso se testa o crédito com taxas mais altas.'},
    {t:'erro',id:'q4',ensina:['p2','p7'],label:'Encontra o erro',q:'«Arrendar é deitar dinheiro fora; comprar é sempre melhor, porque a prestação fica para mim.» Qual é o erro?',o:['Nenhum','Ignora que a prestação inclui juros, custos de posse e o custo de oportunidade; a comparação justa é com «arrendar e investir a diferença»','O erro é só falar em prestação'],c:1,why:'Parte da prestação são juros e há impostos, manutenção e seguros. O que se compara é o custo total de comprar com o de arrendar e investir a diferença.'}
  ], src:[_pl_selo] },

{ id:'filhos', topic:'planeamento', o:7, title:'Investir para os filhos', mins:9,
  lead:'Com 18 anos de prazo, pequenos valores regulares podem crescer bastante. O tempo é a melhor ajuda que podes dar. Mas há decisões que importam mais do que o produto: para quê é o dinheiro, quando vai ser preciso e que regras se aplicam a um menor.',
  blocks:[
    {t:'h',id:'h1',x:'Começar pelo objetivo'},
    {t:'p',id:'p1',x:'Antes de pensar em ETFs, pergunta-te para quê é este dinheiro. Estudos, uma entrada de casa, um carro, um começo de vida, ou simplesmente «reserva para os 18 anos»? Cada objetivo tem um <b>prazo</b> diferente e, por isso, um risco diferente. O prazo manda no investimento: dinheiro que só vai ser preciso daqui a 18 anos aguenta oscilações; dinheiro que vai ser preciso daqui a 2 anos, não (vê o tema «Objetivos e horizonte temporal»).'},
    {t:'p',id:'p2',x:'Pensa numa viagem de carro com destino marcado. Se faltam 18 anos, podes ir por uma estrada mais acidentada, que costuma ser mais rápida; se faltam dois, vais pela autoestrada segura, mesmo que seja mais lenta. É isso que se faz ao reduzir o risco à medida que a data se aproxima.'},

    {t:'h',id:'h2',x:'O poder do tempo e dos pequenos valores'},
    {t:'p',id:'p3',x:'O horizonte é longo, por isso faz sentido ter uma parte significativa em ativos de crescimento, como ETFs de ações diversificados. Vê o efeito de poupar um pouco todos os meses, e experimenta valores diferentes:'},
    {t:'w',id:'w1',w:'compound',p:{initial:0,monthly:50,rate:5,years:18}},
    {t:'p',id:'p4',x:'Com 50 € por mês durante 18 anos a 5% ao ano (valor de exemplo), juntas cerca de ' + _e(lrnCompound({initial:0,monthly:50,rate:5,years:18}).at(-1).total) + ', dos quais ' + _e(50*12*18) + ' são o que depositaste. O resto são juros. Se começares com um depósito inicial (por exemplo, as prendas de batizado e de anos), o efeito aumenta, porque esse dinheiro tem 18 anos inteiros para crescer.'},
    {t:'stat',id:'s1',v:Math.round(lrnCompound({initial:1000,monthly:50,rate:5,years:18}).at(-1).total),label:'Com 1 000 € iniciais e 50 € por mês, 18 anos, 5% (exemplo)'},

    {t:'h',id:'h3',x:'Reduzir o risco à medida que a data chega'},
    {t:'p',id:'p5',x:'Quando a data se aproxima, uma queda de mercado já não tem tempo para recuperar. Por isso, muitos planos de longo prazo reduzem o risco ao longo dos anos. Chama-se a isto uma <b>trajetória de descida do risco</b> (<i>glide path</i>), e pode ser tão simples como:'},
    {t:'cmp',id:'c1',head:['Faltam','Ideia de alocação (exemplo)','Porquê'],rows:[
      ['Mais de 10 anos','Maioria em ações diversificadas','Muito tempo para recuperar de quedas'],
      ['5 a 10 anos','Reduzir ações e aumentar obrigações e liquidez','O tempo para recuperar já é menor'],
      ['Menos de 5 anos','Maior parte em liquidez e obrigações curtas','Proteger o que já foi acumulado'],
      ['Menos de 2 anos','Quase tudo em depósitos ou produtos de baixo risco','O dinheiro vai ser preciso em breve']]},
    {t:'p',id:'p6',x:'As percentagens exatas dependem de cada família e do que se aguenta emocionalmente; esta tabela é só uma ilustração do raciocínio, não uma recomendação.'},

    {t:'h',id:'h4',x:'Quem é o dono do dinheiro?'},
    {t:'p',id:'p7',x:'Um menor não pode, em regra, gerir sozinho um investimento: é representado pelos pais ou pelo representante legal. Surgem então perguntas práticas: a conta fica em nome de quem? Quem declara os rendimentos? O que acontece quando o filho faz 18 anos e passa a poder decidir sozinho? Se a conta estiver em nome do pai ou da mãe, o dinheiro é, legalmente, deles, e o filho pode não ter direito a nada; se estiver em nome do filho, aos 18 ele pode usá-lo como entender. Convém pensar nisso e <b>conversar com o filho</b> quando for crescido.'},
    {t:'note',id:'n1',pending:true,x:'Investir em nome de um menor tem regras próprias (representação legal, titularidade, tributação e que produtos aceitam menores). Pergunta à entidade e, se for preciso, a um contabilista, antes de abrir a conta.'},

    {t:'h',id:'h5',x:'Passar o hábito, não só o dinheiro'},
    {t:'p',id:'p8',x:'Além do dinheiro, podes passar o <b>hábito</b>: explicar o que são juros compostos, como se poupa e como se investe é, muitas vezes, o presente mais valioso. Uma criança que vê os pais a poupar com regularidade aprende mais do que com qualquer discurso. Podes envolver o teu filho: mostra-lhe o crescimento do «mealheiro» de quando em quando, com os números reais, e deixa-o participar em pequenas decisões (como escolher o valor de uma poupança). Aos 14 ou 15 anos, já pode perceber o que é um ETF; aos 18, deve conhecer o plano e decidir com base nele.'},

    {t:'h',id:'h6',x:'Um caso real: o custo de atrasar'},
    {t:'p',id:'p9',x:'Muitas famílias começam a poupar só quando os filhos já estão no secundário, e descobrem que o prazo curto exige valores muito mais altos para o mesmo resultado. Compara: para chegar ao mesmo montante em 6 anos que 50 € por mês dão em 18 (a 5% ao ano), o valor mensal teria de ser bem maior.'},
    {t:'stat',id:'s2',v:Math.round((()=>{ const alvo=lrnCompound({initial:0,monthly:50,rate:5,years:18}).at(-1).total; let lo=0,hi=5000; for(let i=0;i<60;i++){ const m=(lo+hi)/2; (lrnCompound({initial:0,monthly:m,rate:5,years:6}).at(-1).total<alvo?lo=m:hi=m); } return (lo+hi)/2; })()),label:'Valor mensal necessário para chegar ao mesmo montante em 6 anos (euros por mês, exemplo)'},
    {t:'p',id:'p10',x:'O aumento é enorme: o prazo faz mais trabalho do que o dinheiro. Cada ano que passa sem começar é um ano de juros perdidos para sempre.'},

    {t:'h',id:'ha',x:'Onde pôr o dinheiro, consoante o prazo'},
    {t:'cmp',id:'c2',head:['Opção','Para que prazo','O que esperar'],rows:[
      ['Conta à ordem ou poupança','Muito curto prazo ou reserva imediata','Acesso fácil, juros baixos'],
      ['Depósito a prazo','Alguns meses a poucos anos','Rendimento conhecido à partida; juros com retenção de 28% (verificado em 17/11/2026) e proteção do FGD até 100 000 € por depositante e por banco'],
      ['Certificados de Aforro','Médio prazo (a série F tem 15 anos, com resgate a partir de 3 meses)','Só para pessoas singulares; condições mudam, confirma no IGCP'],
      ['ETF diversificado (UCITS)','Longo prazo, 10 anos ou mais','Crescimento maior, mas oscila; o valor pode estar abaixo do que puseste no momento em que precisas'],
      ['Mistura (ações e baixo risco)','Todos os prazos intermédios','Reduz-se a parte de ações à medida que a data chega']]},
    {t:'p',id:'pa',x:'Repara no fio condutor: quanto <b>mais perto</b> está a data, mais para a esquerda da tabela se anda. Para um recém-nascido com objetivo de estudos aos 18, a parte em ETF pode ser grande nos primeiros anos; aos 15, a maior parte já deve estar na zona dos depósitos e dos produtos de baixo risco.'},

    {t:'h',id:'hb',x:'Quatro passos para começar este mês'},
    {t:'ul',id:'ua',x:[
      '<b>1. Escolhe o objetivo e o ano</b>: «estudos em 2044», por exemplo, ou «reserva de arranque aos 18 anos».',
      '<b>2. Define um valor mensal</b> que caiba no orçamento sem pôr em risco o teu fundo de emergência nem a tua reforma.',
      '<b>3. Escolhe onde fica o dinheiro</b> e quem é o titular, e pergunta à entidade as condições para menores.',
      '<b>4. Automatiza</b> com uma ordem permanente e marca uma revisão por ano, para ajustares o valor e reduzires o risco a tempo.']},
    {t:'p',id:'pb',x:'Se tens família alargada, as prendas de aniversário e de batizado podem ir direitas para esta conta, o que dá um empurrão inicial barato. Mas decide antes quem pode fazer depósitos, para o plano não ficar desorganizado.'},

    {t:'h',id:'hc',x:'Outro caso: estudos e a queda de 2008'},
    {t:'p',id:'pc',x:'No início de 2008, muitas famílias tinham ainda quase todo o dinheiro dos estudos dos filhos em ações, convencidas de que o horizonte longo as protegia. Quando a crise veio, as bolsas caíram muito, e quem precisava de pagar a faculdade nesse ou no ano seguinte teve de vender com prejuízo ou adiar. Quem tinha ido reduzindo o risco nos anos anteriores sofreu muito menos. O que se aprende é que o horizonte «longo» só protege enquanto é longo: perto da data, o risco tem de descer, e é por isso que o plano deve ter uma trajetória, e não uma única decisão no início.'},

    {t:'h',id:'h7',x:'Os erros que mais custam'},
    {t:'ul',id:'u1',x:[
      'Pôr em ações dinheiro de que se vai precisar daqui a 2 ou 3 anos.',
      'Não ter um plano para o que acontece aos 18 anos (quem decide, e se o dinheiro vai para o fim previsto).',
      'Ficar com produtos de custos altos só porque foram sugeridos como «poupança para filhos».',
      'Descuidar a própria reforma para investir para os filhos: os filhos podem pedir empréstimos para estudar, tu não podes pedir um empréstimo para a reforma.',
      'Dar dinheiro sem conversa: sem contexto, o dinheiro vale menos do que o hábito.',
      'Pôr tudo em produtos de «garantia» que rendem menos do que a inflação durante 18 anos.']},

    {t:'h',id:'h8',x:'Em Portugal'},
    {t:'p',id:'p11',x:'Cá, os Certificados de Aforro (Série F) só podem ser subscritos por pessoas singulares (verificado em 17/11/2026, IGCP), e os ETFs UCITS compram-se através de bancos e corretoras; pergunta qual aceita contas para menores. Depósitos a prazo e certificados têm retenção de 28% sobre os juros (vê «Depósitos a prazo» e «Certificados de Aforro e do Tesouro»). Se quiseres dar dinheiro a um filho (ou aos netos), a lei tem regras sobre o imposto do selo nas transmissões gratuitas: estão isentas, entre outras, as feitas a descendentes (vê o tema «Sucessão e herança: preparar a família»), mas confirma o tratamento no caso concreto.'},

    {t:'h',id:'h9',x:'Em poucas palavras'},
    {t:'ul',id:'u2',x:[
      'Define primeiro o objetivo e o prazo; o prazo manda no risco.',
      'Poupar pouco e cedo vale muito mais do que poupar muito e tarde.',
      'Reduz o risco à medida que a data se aproxima; nos últimos 2 a 3 anos, o dinheiro já não deve estar em ações.',
      'Decide quem é o titular do dinheiro e o que acontece aos 18 anos; confirma as regras com a entidade.',
      'Passar o hábito de poupar e investir é tão valioso como o capital.']},

    {t:'fazve',id:'q1',ensina:['p3','w1','p4'],q:'Poupas 50 € por mês durante 18 anos a 5% ao ano (valor de exemplo). Quanto terás, aproximadamente?',unit:'€',answer:lrnCompound({initial:0,monthly:50,rate:5,years:18}).at(-1).total,tol:.03,why:'Cerca de 17 300 €, dos quais 10 800 € são o que depositaste e o resto são juros. A taxa é um exemplo, não uma garantia.'},
    {t:'decide',id:'q2',ensina:['p5','c1'],label:'Decide',q:'Um filho vai precisar do dinheiro para a faculdade daqui a 3 anos. O que faz mais sentido?',o:['Continuar todo em ações, que rendem mais','Aumentar o risco','Reduzir o risco, porque o prazo é curto'],c:2,why:'À medida que a data se aproxima, protege-se o que já foi acumulado: com pouco tempo, uma queda forte pode não recuperar a tempo.'},
    {t:'decide',id:'q3',ensina:['p7'],label:'Decide',q:'A conta de investimento está em nome do pai. Quando o filho faz 18 anos, de quem é o dinheiro?',o:['Do filho, automaticamente','Legalmente do titular da conta (o pai), por isso é bom combinar antes o que se pretende','Do banco'],c:1,why:'O titular da conta é o dono do dinheiro. Se a intenção é que seja do filho, convém registar isso e confirmar as regras para menores com a entidade.'},
    {t:'erro',id:'q4',ensina:['p9','p10'],label:'Encontra o erro',q:'«Só começo a poupar para a faculdade quando ele tiver 12 anos; 6 anos chegam e depois apanho o atraso.» Qual é o erro?',o:['Nenhum, o tempo não conta','Com menos anos, o valor mensal necessário para o mesmo montante é muito maior: o tempo faz mais trabalho do que o dinheiro','O erro é só o ano de início'],c:1,why:'Os juros compostos precisam de tempo. Para o mesmo resultado em 6 anos em vez de 18, o valor mensal tem de ser várias vezes maior.'}
  ], src:[{l:'Portal das Finanças: Código do Imposto do Selo, tabela geral',u:'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/selo/Pages/ccod-selo-tabgiselo.aspx'},{l:'IGCP: Certificados de Aforro',u:'https://www.igcp.pt/'}] },

{ id:'sucessao-heranca', topic:'planeamento', o:8, title:'Sucessão e herança: preparar a família', mins:8,
  lead:'Ninguém gosta de pensar nisto, mas é uma das decisões financeiras mais importantes para quem fica. Preparar a sucessão evita conflitos, atrasos e custos, e garante que o que construíste vai para quem queres, dentro do que a lei permite.',
  blocks:[
    {t:'h',id:'h1',x:'O que acontece quando alguém morre'},
    {t:'p',id:'p1',x:'Quando uma pessoa morre, os seus bens, direitos e dívidas formam a <b>herança</b>. Quem recebe chama-se <b>herdeiro</b>, e quem morreu o <b>autor da herança</b>. Os bens não passam «automaticamente» para quem quisermos: seguem regras da lei, e esses herdeiros têm de tratar de papéis, de impostos e de dividir o que há. Se não houver preparação, as famílias descobrem tarde o que existe, onde está e como aceder.'},
    {t:'p',id:'p2',x:'Pensa numa casa com uma chave que só uma pessoa conhece. Se essa pessoa desaparecer sem a ter deixado a ninguém, a casa fica fechada, mesmo que seja de toda a família. A preparação da sucessão é, em grande parte, <b>deixar a chave</b>: informação, documentos e decisões claras.'},

    {t:'h',id:'h2',x:'A lei decide o essencial: a legítima'},
    {t:'p',id:'p3',x:'No Código Civil português, a sucessão tem várias modalidades. A <b>sucessão legítima</b> aplica-se quando não há testamento (ou quando este não cobre tudo): a lei define quem herda e por que ordem. E há uma regra importante: parte da herança está <b>reservada por lei a certos familiares próximos</b>, os chamados <b>herdeiros legitimários</b> (art. 2157.º do Código Civil), e o autor da herança não pode dispor livremente dessa parte, chamada <b>legítima</b>. Só a parte restante, a <b>quota disponível</b>, pode ser deixada a quem se quiser, por testamento.'},
    {t:'cmp',id:'c1',head:['Conceito','O que é','Consequência prática'],rows:[
      ['Sucessão legítima','A lei define os herdeiros quando não há testamento','Sem testamento, não escolhes quem herda'],
      ['Legítima','Parte da herança reservada por lei a herdeiros próximos (herdeiros legitimários)','Não podes deixá-la a quem quiseres'],
      ['Quota disponível','A parte restante, de que podes dispor livremente','Podes deixá-la por testamento a quem desejares'],
      ['Testamento','Documento em que declaras o destino dos bens (dentro dos limites da lei)','Permite usar a quota disponível e organizar a partilha'],
      ['Doação em vida','Transmissão de bens a outra pessoa ainda em vida','Pode afetar a legítima e ter impostos próprios']]},
    {t:'note',id:'n1',pending:true,x:'Quem são exatamente os herdeiros legitimários (cônjuge, descendentes, ascendentes), as frações da legítima em cada caso e a ordem dos herdeiros dependem do texto do Código Civil, que não foi lido por inteiro neste tema. Confirma no Diário da República (Código Civil, Livro V) ou num notário/advogado antes de planeares.'},
    {t:'p',id:'p4',x:'O resumo útil é este: <b>não és totalmente livre de deixar o que tens a quem quiseres</b>. Se tens cônjuge, filhos ou pais, a lei protege-os. Por isso o planeamento de herança é, em larga medida, <b>organizar</b> o que a lei já prevê, e usar a parte livre com intenção.'},

    {t:'h',id:'h3',x:'O que pode (e deve) ser feito em vida'},
    {t:'ul',id:'u1',x:[
      '<b>Fazer um inventário pessoal</b>: lista do que tens (contas, investimentos, PPR, seguros, imóveis, criptoativos), onde está e como aceder. Mantém-na atualizada e num local que a família conheça.',
      '<b>Testamento</b>: se queres usar a quota disponível de forma diferente da prevista na lei (por exemplo, deixar a alguém fora da família), precisas dele.',
      '<b>Beneficiários dos seguros</b>: revê-os quando a vida muda (casamento, divórcio, filhos).',
      '<b>Contas conjuntas</b>: percebe o que acontece ao saldo se um dos titulares morrer (vê o tema «Contas conjuntas e herança»).',
      '<b>Criptoativos e contas online</b>: as chaves e palavras-passe têm de poder ser recuperadas pela família, de forma segura (um gestor de palavras-passe e um acordo, por exemplo).',
      '<b>Conversar</b> com a família: mais vale dizer o que pensas e porquê, para não haver surpresas nem conflitos entre irmãos.']},
    {t:'p',id:'p5',x:'Se tens filhos menores, pensa também em quem tomaria conta deles e do seu património; isso é uma decisão a tomar com apoio jurídico.'},

    {t:'h',id:'h4',x:'Imposto: o que a lei diz sobre as transmissões gratuitas'},
    {t:'p',id:'p6',x:'Em Portugal não existe «imposto sobre heranças» com esse nome. As transmissões gratuitas (heranças e doações) estão sujeitas a <b>imposto do selo</b>, à taxa de <b>10%</b> (verba 1.2 da Tabela Geral do Imposto do Selo, verificado em 17/11/2026). Mas estão <b>isentos</b> o cônjuge ou unido de facto, os descendentes e os ascendentes (art. 6.º do Código do Imposto do Selo). A doação de imóveis tem uma taxa própria de 0,8% (verba 1.1). Isto significa que, na prática, quem herda dentro da família próxima costuma estar isento deste imposto, mas quem herda fora dela (um amigo, um sobrinho) paga.'},
    {t:'p',id:'p7',x:'Um exemplo (valor de exemplo): uma pessoa deixa por testamento 50 000 € de quota disponível a um amigo. Com a taxa de 10%, o imposto do selo seria:'},
    {t:'stat',id:'s1',v:Math.round(50000*0.10),label:'Imposto do selo sobre 50 000 € deixados a quem não é familiar próximo (10%)'},
    {t:'p',id:'p8',x:'Se o mesmo valor fosse deixado a um filho, a lei isenta-o deste imposto. Há outros custos (notário, registos, eventuais impostos sobre imóveis) que não estão neste cálculo, e as regras podem ter condições e exceções.'},
    {t:'note',id:'n2',pending:true,x:'As exceções ao imposto do selo, os custos de notário e de registo, o IMI e o IRS sobre bens recebidos, e o tratamento de contas conjuntas e de seguros não foram confirmados em fonte oficial para este tema. Confirma no Portal das Finanças e com um notário.'},

    {t:'h',id:'h5',x:'Como é o processo, na prática'},
    {t:'p',id:'p9',x:'Depois da morte, os herdeiros têm de apurar quem são (é a chamada habilitação de herdeiros, feita por notário, conservatória ou tribunal), identificar bens e dívidas, tratar de obrigações fiscais e, por fim, <b>partilhar</b> a herança, por acordo ou, se não houver acordo, por inventário. Os herdeiros podem, em regra, aceitar a herança ou repudiá-la, e a decisão importa porque a herança também pode ter dívidas. Cada passo tem prazos, custos e formalidades; por isso quanto mais organizada estiver a informação em vida, mais simples é.'},
    {t:'note',id:'n3',pending:true,x:'Os prazos, os custos e os procedimentos exatos (habilitação, partilha, aceitação ou repúdio da herança) mudam e não foram confirmados em fonte oficial para este tema. Para um caso real, fala com um notário, advogado ou solicitador, ou consulta o portal da Justiça.'},

    {t:'h',id:'h6',x:'Um caso real: o fundador que levou as chaves'},
    {t:'p',id:'p10',x:'No fim de 2018, o fundador de uma plataforma canadiana de troca de criptoativos morreu inesperadamente. Segundo foi noticiado, era a única pessoa a conhecer as chaves de acesso a grande parte dos fundos dos clientes, que ficaram inacessíveis, e a plataforma entrou em insolvência em 2019. O caso é um exemplo extremo, mas ilustra a lição de qualquer família: o que só uma pessoa sabe aceder está em risco de se perder para todos. Isto vale para criptoativos, mas também para contas bancárias, corretoras, pastas de documentos e senhas.'},

    {t:'h',id:'h7',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      'Adiar o assunto «porque ainda sou jovem»: os imprevistos não avisam.',
      'Não ter lista de contas e acessos, e deixar a família a descobrir bens (às vezes anos depois).',
      'Prometer a alguém uma parte «de palavra», sem testamento nem regras que a lei reconheça.',
      'Esquecer-se de atualizar beneficiários de seguros e de produtos financeiros.',
      'Pôr o património numa conta conjunta sem perceber as consequências para a herança.',
      'Evitar a conversa com os filhos e criar conflitos entre irmãos depois.',
      'Copiar regras de outro país: a sucessão tem regras próprias em cada país, e a de Portugal não é igual à dos EUA ou do Brasil.']},

    {t:'h',id:'h8',x:'Em Portugal'},
    {t:'p',id:'p11',x:'Em Portugal, a preparação passa pelo testamento (feito por notário, por exemplo), pela organização de contas, seguros e investimentos, e por saber como funcionam as contas conjuntas e os produtos com beneficiário. O tema «Contas conjuntas e herança» explica como as contas e a herança se relacionam. Para os investimentos, convém que a família saiba em que corretora ou banco estão e como a entidade trata uma conta de um falecido. O imposto do selo nas transmissões gratuitas é de 10%, com isenção para cônjuge, descendentes e ascendentes (verificado em 17/11/2026; vê o tema «Imposto do selo»).'},

    {t:'h',id:'h9',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'A herança segue a lei: parte está reservada a herdeiros próximos (a legítima) e só o resto (quota disponível) é de livre disposição.',
      'Sem testamento, a lei decide quem herda; com testamento, usas a quota disponível como queres.',
      'As transmissões gratuitas pagam imposto do selo de 10%, mas cônjuge, descendentes e ascendentes estão isentos.',
      'Faz uma lista de bens e acessos, revê beneficiários e conversa com a família.',
      'Para decisões concretas, procura apoio de um notário ou advogado, e confirma os valores no Portal das Finanças.']},

    {t:'decide',id:'q1',ensina:['p3','c1','p4'],label:'Decide',q:'O que é a «quota disponível» de uma herança?',o:['A parte da herança de que o autor pode dispor livremente por testamento','A parte da herança reservada por lei aos herdeiros legitimários','O imposto devido pela herança'],c:0,why:'A legítima é reservada por lei a herdeiros próximos; a quota disponível é a parte restante, que o autor da herança pode deixar a quem quiser.'},
    {t:'fazve',id:'q2',ensina:['p6','p7','s1'],q:'Deixas por testamento 50 000 € a um amigo (não é familiar próximo). Com a taxa de imposto do selo de 10%, quanto de imposto?',unit:'€',answer:50000*0.10,tol:.01,why:'50 000 € × 10% = 5 000 €. Se o beneficiário fosse um filho, estaria isento deste imposto (art. 6.º CIS).'},
    {t:'decide',id:'q3',ensina:['p6'],label:'Decide',q:'Quem está isento de imposto do selo nas transmissões gratuitas?',o:['Ninguém','O cônjuge ou unido de facto, os descendentes e os ascendentes','Só os filhos menores'],c:1,why:'Segundo o art. 6.º do Código do Imposto do Selo, estão isentos o cônjuge ou unido de facto, os descendentes e os ascendentes.'},
    {t:'erro',id:'q4',ensina:['u1','p10','p4'],label:'Encontra o erro',q:'«Só eu sei as senhas das contas e da carteira de cripto, e não escrevo nada, por segurança. A família que se arranje.» Qual é o erro?',o:['Nenhum, é o mais seguro','Se algo te acontecer, a família pode perder o acesso a tudo; é preciso um sistema seguro de acesso e um inventário','O erro é só ter cripto'],c:1,why:'Segurança sem plano de acesso pode significar perda total para a família. Usa um gestor de palavras-passe e deixa instruções seguras a uma pessoa de confiança.'}
  ], src:[{l:'Portal das Finanças: Código do Imposto do Selo, tabela geral',u:'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/selo/Pages/ccod-selo-tabgiselo.aspx'},{l:'Código Civil (índice, Livro V, Direito das Sucessões): art. 2133.º, 2157.º e seguintes',u:'https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=775&tabela=leis&ficha=1&pagina=1&so_miolo=S'}] }
);
