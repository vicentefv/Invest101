// ================= Aprender: módulo «carteira» =================
// Regras de Portugal só com fonte oficial (campo `src`); o que não ficou confirmado leva `pending:true` («Por confirmar»).

// Contas dos exemplos (calculadas aqui para a explicação nunca divergir do número certo).
const _ca_f=(n,d)=>Number(n).toLocaleString('pt-PT',{minimumFractionDigits:d||0,maximumFractionDigits:d||0}).replace('-','−');
const _ca_prod=a=>a.reduce((p,r)=>p*(1+r/100),1);
const _ca_mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
// Premissas de exemplo (não são previsões): ações 7% e 16% de volatilidade, obrigações 3% e 5%, correlação 0,2.
const _ca_A={r:7,v:16}, _ca_O={r:3,v:5}, _ca_rho=.2;
const _ca_pv=w=>Math.sqrt(w*w*_ca_A.v*_ca_A.v+(1-w)*(1-w)*_ca_O.v*_ca_O.v+2*w*(1-w)*_ca_rho*_ca_A.v*_ca_O.v);
const _ca_pr=w=>w*_ca_A.r+(1-w)*_ca_O.r;
const _ca_perf=[['Prudente',20],['Equilibrado',50],['Dinâmico',80],['Só ações',100]].map(([n,a])=>({n,a,r:_ca_pr(a/100),v:_ca_pv(a/100),q:a*.4}));

// Carteiras-modelo: valor ao fim de 20 anos com 10 000 € iniciais e 200 €/mês, com as premissas de exemplo da alocação.
const _ca_mod=[['Só ações',100],['80/20',80],['60/40',60],['40/60',40]].map(([n,a])=>{ const r=_ca_pr(a/100),d=lrnCompound({initial:10000,monthly:200,rate:r,years:20}).at(-1); return {n,a,r,paid:d.paid,total:d.total,q:a*.4}; });
const _ca_age=[25,35,45,55,65].map(i=>[i,110-i]);

// Rebalanceamento: desvio em 10 anos e comparação com/sem rebalancear.
const _ca_rs=[18,12,22,-8,25,15,10,20,-12,16], _ca_rb=[3,6,2,1,4,5,0,2,6,1];
const _ca_rebal=(reb)=>{ let a=6000,o=4000,rows=[]; _ca_rs.forEach((r,i)=>{ a*=1+r/100; o*=1+_ca_rb[i]/100; const t=a+o,w=a/t*100; rows.push({i:i+1,t,w}); if(reb){ a=t*.6; o=t*.4; } }); return rows; };
const _ca_nr=_ca_rebal(false), _ca_yr=_ca_rebal(true);
const _ca_drift=(()=>{ const a=60*Math.pow(1.08,10),o=40*Math.pow(1.03,10); return a/(a+o)*100; })();

// Investir aos poucos ou de uma vez: 1 200 € em três caminhos de preço (12 meses).
const _ca_paths={
  'Mercado sobe':[100,101,102,104,105,106,107,108,109,110,111,112],
  'Mercado cai':[100,99,98,97,95,94,93,92,91,90,89,88],
  'Cai e recupera':[100,95,90,85,80,82,86,90,94,97,99,100]};
const _ca_dca=Object.entries(_ca_paths).map(([n,p])=>{ const last=p.at(-1), lump=1200/p[0]*last, units=p.reduce((s,x)=>s+100/x,0), dca=units*last; return {n,lump,dca,avg:1200/units,mean:_ca_mean(p)}; });
const _ca_ex4=[100,80,90,110], _ca_u4=_ca_ex4.reduce((s,x)=>s+100/x,0);

// Custos e TER: 10 000 € + 200 €/mês, 6% bruto, 30 anos, com vários níveis de custo anual.
const _ca_cost=[0,.1,.5,1,1.5,2].map(t=>{ const o=_c('fees',{ini:10000,men:200,rate:6,ter:t,ano:30}); return {t,sem:o[0],com:o[1],perd:o[2]}; });
const _ca_c15=_ca_cost.find(c=>c.t===1.5), _ca_c01=_ca_cost.find(c=>c.t===.1), _ca_c1=_ca_cost.find(c=>c.t===1);

// Indexado ou ativo: aritmética de gestão e sorte.
const _ca_idx=10000*Math.pow(1.069,20), _ca_act=10000*Math.pow(1.055,20);
const _ca_luck=[1,2,3,5,10].map(n=>[n,1000/Math.pow(2,n)]);

// Fatores: quanto tempo leva a ter confiança num prémio, e quão provável é perder durante anos.
const _ca_cdf=z=>{ const t=1/(1+.2316419*Math.abs(z)),d=.3989423*Math.exp(-z*z/2),p=d*t*(.3193815+t*(-.3565638+t*(1.781478+t*(-1.821256+t*1.330274)))); return z>0?1-p:p; };
const _ca_prem=2, _ca_te=5;
const _ca_pLose=n=>_ca_cdf(-_ca_prem*Math.sqrt(n)/_ca_te)*100;
const _ca_yrs=Math.pow(2*_ca_te/_ca_prem,2);

// Escolher um ETF: três ETFs fictícios que replicam o mesmo índice, e o custo de cada escolha em 20 anos.
const _ca_etf=[['ETF A',.07,'Física, acumulação',5000],['ETF B',.20,'Física, distribuição',300],['ETF C',.45,'Sintética, acumulação',60]];
const _ca_etfv=_ca_etf.map(([n,t,k,s])=>({n,t,k,s,v:_c('fees',{ini:10000,men:200,rate:6,ter:t,ano:20})[1]}));
const _ca_td=7.00-6.90;

// Plano por escrito: exemplo fictício, 400 €/mês durante 20 anos, 5% ao ano (valor de exemplo).
const _ca_plan=lrnCompound({initial:5000,monthly:400,rate:5,years:20}).at(-1);
const _ca_plan2=lrnCompound({initial:5000,monthly:400,rate:3,years:20}).at(-1);
const _ca_plan0=_ca_plan.paid;


LRN.push(
{ id:'alocacao', topic:'carteira', o:1, title:'Alocação de ativos', mins:7,
  lead:'Decidir quanto vai para ações, obrigações e liquidez pesa mais no resultado do que escolher este ou aquele ativo. É a decisão mais importante da carteira, e a primeira que deves tomar.',
  blocks:[
    {t:'h',id:'h1',x:'A receita antes dos ingredientes'},
    {t:'p',id:'p1',x:'Quem cozinha sabe que o resultado depende mais das proporções do que da marca do sal. Um bolo com o dobro do açúcar fica mau, por melhor que seja o açúcar. Numa carteira, o equivalente é a <b>alocação</b> (em inglês, <i>asset allocation</i>): a divisão do dinheiro por <b>classes de ativos</b>, isto é, por grandes famílias de investimentos que se comportam de maneira parecida entre si, como ações, obrigações e liquidez.'},
    {t:'p',id:'p2',x:'Um estudo muito citado, dos anos 80, concluiu que a alocação explica a maior parte das <i>variações</i> do retorno de um fundo ao longo do tempo (não o nível do retorno, é uma diferença importante). A ideia útil é simples: antes de pensares em qual ação ou qual fundo, decide <b>quanto risco</b> queres ter, e esse é, no fundo, o peso das ações na carteira.'},
    {t:'h',id:'h2',x:'Quem faz o quê numa carteira'},
    {t:'cmp',id:'c1',head:['Classe','Papel na carteira','Comportamento típico','Principal risco'],rows:[
      ['Ações','Motor de crescimento','Sobem mais no longo prazo, com quedas fortes','Queda de preço, prazos longos de recuperação'],
      ['Obrigações','Amortecedor e rendimento','Oscilam menos; sofrem com subida de taxas','Taxa de juro, emissor'],
      ['Liquidez','Segurança e disponibilidade','Quase não oscila; rende pouco','Inflação'],
      ['Imobiliário','Rendimento e proteção parcial contra inflação','Oscila e é pouco líquido','Liquidez, concentração'],
      ['Ouro e matérias-primas','Diversificador','Comportamento próprio, nem sempre previsível','Sem rendimento, oscila muito'],
      ['Criptoativos','Aposta especulativa','Oscilações extremas','Perda total possível']],
      cap:'Qualitativo. Cada classe tem os seus temas próprios na biblioteca.'},
    {t:'h',id:'h3',x:'Mais ações, mais retorno esperado e mais oscilação'},
    {t:'p',id:'p3',x:'Para perceber o que a alocação faz, usamos premissas de exemplo (não são previsões): as ações rendem em média '+_ca_A.r+'% ao ano com volatilidade de '+_ca_A.v+'%; as obrigações rendem '+_ca_O.r+'% com volatilidade de '+_ca_O.v+'%; e as duas têm correlação de '+_ca_f(_ca_rho,1)+'. Combinando-as em várias proporções, e supondo uma crise em que as ações caem 40% e as obrigações ficam iguais:'},
    {t:'cmp',id:'c2',head:['Perfil (exemplo)','Ações','Obrigações e liquidez','Retorno esperado','Volatilidade','Perda na crise'],rows:_ca_perf.map(p=>[p.n,p.a+'%',(100-p.a)+'%',_ca_f(p.r,1)+'%',_ca_f(p.v,1)+'%','−'+_ca_f(p.q)+'%']),
      cap:'Exemplos para ilustrar a ideia, não recomendações nem previsões.'},
    {t:'stat',id:'s1',v:Math.round(_ca_perf[2].v),fmt:'pct',label:'Volatilidade do perfil dinâmico de exemplo (80% ações)'},
    {t:'p',id:'p4',x:'Repara no padrão: ao subir o peso das ações de 20% para 80%, o retorno esperado sobe '+_ca_f(_ca_perf[2].r-_ca_perf[0].r,1)+' pontos, mas a volatilidade multiplica-se várias vezes, e a perda numa crise passa de −8% para −32%. Não há perfil «certo» em abstrato: há o que se ajusta ao teu prazo, às tuas reservas e à tua capacidade de aguentar quedas (vê «O teu perfil de risco»).'},
    {t:'p',id:'p5',x:'O amortecimento das obrigações é concreto: uma carteira com 70% em ações e 30% em obrigações, em que as ações caem 20% e as obrigações ficam iguais, perde <b>14%</b>, e não 20%. O preço dessa proteção é um retorno esperado menor no longo prazo.'},
    {t:'fazve',id:'q1',ensina:['p5'],q:'Tens 10 000 € divididos em 70% ações e 30% obrigações. As ações caem 20% e as obrigações ficam iguais. Qual é o valor total da carteira?',unit:'€',answer:8600,tol:.01,why:'Ações: 7 000 € × 0,8 = 5 600 €. Obrigações: 3 000 €. Total: 8 600 €, uma queda de 14%.'},
    {t:'fazve',id:'q2',ensina:['p3','c2'],q:'Com as premissas de exemplo (ações 7%, obrigações 3%), qual é o retorno esperado de uma carteira 60% ações e 40% obrigações, em %?',unit:'%',answer:_ca_pr(.6),tol:.02,why:'0,6 × 7% + 0,4 × 3% = 4,2% + 1,2% = 5,4%. O retorno esperado de uma carteira é a média ponderada dos retornos esperados de cada parte.'},
    {t:'h',id:'h4',x:'Como escolher o peso das ações'},
    {t:'p',id:'p6',x:'Há três perguntas por esta ordem. <b>Quando vou precisar do dinheiro?</b> Dinheiro de que vais precisar nos próximos três a cinco anos não deve estar em ações. <b>Quanto posso perder sem mudar de vida?</b> É a tua capacidade. <b>Quanto consigo aguentar sem vender em pânico?</b> É a tua tolerância. A alocação nasce destas respostas, não de uma fórmula.'},
    {t:'p',id:'p7',x:'Há regras de bolso para começar. A mais conhecida diz que a percentagem em ações deve ser «<b>100 menos a tua idade</b>» (há variantes com 110 ou 120, que são mais agressivas). Para 25 anos dá '+(100-25)+'% em ações; para 62 anos dá '+(100-62)+'%. É um ponto de partida, não um mandamento: ignora a tua capacidade e a tua tolerância.'},
    {t:'h',id:'h5',x:'Estratégica e tática, núcleo e satélites'},
    {t:'ul',id:'u1',x:[
      '<b>Alocação estratégica</b>: o alvo de longo prazo, que decides uma vez e revês de vez em quando. É o que conta.',
      '<b>Alocação tática</b>: desvios de curto prazo, a tentar aproveitar o momento do mercado. Exige prever, e a maioria falha.',
      '<b>Núcleo e satélites</b>: o grosso da carteira (o núcleo) em investimentos largos e baratos, e uma pequena parte (os satélites, por exemplo 5% a 10%) para ideias próprias. Limita o dano se uma ideia correr mal.']},
    {t:'h',id:'h6',x:'Um caso real: o que 2008 fez a duas carteiras'},
    {t:'p',id:'p8',x:'Na crise financeira de 2008, as bolsas de todo o mundo caíram mais de um terço num ano. Uma carteira só de ações sofreu a queda inteira. Uma carteira com uma parte relevante em dívida pública de países sólidos e em liquidez caiu bastante menos, e teve dinheiro «seguro» para comprar mais barato ou simplesmente para esperar. Quem estava a precisar do dinheiro nesse ano, e tinha tudo em ações, teve de vender no fundo. A alocação não evitou a crise: mudou o que a crise fez a cada pessoa.'},
    {t:'decide',id:'q3',ensina:['p6','p7','c2'],label:'Decide',q:'Uma pessoa de 25 anos a investir para a reforma, e o pai de 62 anos a precisar do dinheiro daqui a 3 anos. Qual deve ter mais peso em obrigações e liquidez?',o:['A pessoa de 25 anos','Ambos o mesmo','O pai de 62 anos'],c:2,why:'O pai tem menos tempo para recuperar de uma queda, por isso costuma reduzir o risco. A pessoa de 25 anos tem décadas pela frente.'},
    {t:'decide',id:'q4',ensina:['u1','p4'],label:'Decide',q:'Que parte da carteira deve ter «ideias próprias» (satélites), numa lógica de núcleo e satélites?',o:['Uma parte pequena, por exemplo 5% a 10%, para limitar o dano se correr mal','A maior parte, porque é onde está o retorno','Metade, para equilibrar'],c:0,why:'O núcleo largo e barato faz o grosso do trabalho; os satélites são uma pequena parte para ideias próprias, e se falharem o estrago é limitado.'},
    {t:'erro',id:'q5',ensina:['p3','p4','c1'],label:'Encontra o erro',q:'Uma destas afirmações está errada. Qual?',o:['Mais ações significa mais retorno esperado e mais oscilação','As obrigações costumam amortecer as quedas das ações','Existe uma alocação certa para toda a gente','A alocação deve depender do prazo e da tolerância'],c:2,why:'Não há alocação universal: depende do prazo, da capacidade e da tolerância de cada pessoa.'},
    {t:'h',id:'h6b',x:'Dentro das ações: como repartir'},
    {t:'p',id:'p8b',x:'Depois de decidires quanto vai para ações, ainda falta repartir esse bolo. A forma mais simples é seguir o <b>mercado mundial</b>: quanto mais valiosa é uma região, mais pesa. Um ETF global faz isso por ti, e o resultado é uma carteira com muito peso em empresas americanas, menos em Europa e Ásia, e ainda menos em mercados emergentes. Quem inclina a carteira para o seu próprio país (o chamado <i>home bias</i>, ou viés doméstico) fica com demasiado risco concentrado: a economia que paga o teu ordenado, valoriza a tua casa e dá o rendimento do teu fundo passa a ser a mesma. Nas obrigações, passa-se algo parecido: convém olhar para o prazo, para a qualidade dos emissores e para a moeda, e não apenas para o juro.'},
    {t:'h',id:'h7',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      'Escolher produtos antes de decidir a alocação: é pôr o telhado antes dos alicerces.',
      'Copiar a alocação de alguém com outro prazo, outro rendimento e outro temperamento.',
      'Ter risco a mais no ano em que precisas do dinheiro.',
      'Aumentar o peso das ações depois de grandes subidas, e reduzi-lo depois de grandes quedas.',
      'Mudar de alocação a cada notícia: a alocação estratégica serve para não depender das notícias.']},
    {t:'h',id:'h8',x:'Em Portugal'},
    {t:'p',id:'p9',x:'Em Portugal, a parte de ações faz-se normalmente com ETFs UCITS (vê «ETFs e diversificação: o que se compra em Portugal»), a de obrigações com ETFs ou fundos de obrigações, e a de liquidez e segurança com depósitos a prazo e Certificados de Aforro (vê «Depósitos a prazo» e «Certificados de Aforro e do Tesouro»). O PPR é uma forma de implementar uma parte da alocação com benefício fiscal (vê «PPR: poupança com benefício fiscal»). Quando venderes para rebalancear ou levantar, as mais-valias são tributadas (vê «Mais-valias: quanto imposto pagas ao vender»).'},
    {t:'h',id:'h9',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'Alocação é dividir o dinheiro por classes de ativos; define quanto risco tens.',
      'Mais ações: mais retorno esperado e mais oscilação; mais obrigações e liquidez: o contrário.',
      'O prazo e a capacidade de aguentar quedas ditam o peso das ações, não a vontade de ganhar.',
      'Regras como «100 menos a idade» são pontos de partida, não verdades.',
      'Núcleo largo e barato, satélites pequenos.',
      'Decide a alocação antes de escolheres produtos.']}
  ], src:[] },


{ id:'carteiras-modelo', topic:'carteira', o:2, title:'Carteiras-modelo simples: um ETF global, 80/20, por idade', mins:8,
  lead:'Não precisas de uma carteira complicada para investir bem. Há meia dúzia de estruturas simples, conhecidas e testadas, que servem a maioria das pessoas. Aqui vês como são, o que fazem e os seus limites, sem produtos concretos: só a forma.',
  blocks:[
    {t:'h',id:'h1',x:'Menu do dia em vez de pedir prato a prato'},
    {t:'p',id:'p1',x:'Num restaurante, o menu do dia é mais barato e mais simples do que escolher prato a prato, e quase sempre chega. Com a carteira passa-se o mesmo: construir uma do zero, com dezenas de decisões, convida a erros. As <b>carteiras-modelo</b> são estruturas prontas, definidas por poucas peças e pelas proporções entre elas. Servem de ponto de partida, e as melhores têm duas virtudes: são fáceis de compreender e fáceis de manter.'},
    {t:'p',id:'p2',x:'Importante: o que se apresenta aqui são <b>estruturas</b>, não recomendações de produtos nem de pessoas. Não é um conselho de investimento: o que te serve depende do teu prazo, das tuas reservas e da tua tolerância (vê «O teu perfil de risco»). Escolher o ETF concreto é o passo seguinte (vê «Escolher um ETF passo a passo»).'},
    {t:'h',id:'h2',x:'Estrutura 1: um único ETF global de ações'},
    {t:'p',id:'p3',x:'A carteira mais simples possível: um só ETF que replica ações do mundo inteiro, de países desenvolvidos (e, nalguns casos, também emergentes). Tens milhares de empresas, dezenas de países, várias moedas e setores, com uma única compra. Não há nada para rebalancear, porque só há uma peça.'},
    {t:'ul',id:'u1',x:[
      '<b>Prós:</b> máxima simplicidade; custo baixo; diversificação enorme; pouca tentação de mexer.',
      '<b>Contras:</b> 100% em ações; a oscilação e as quedas são plenas; não tens obrigações nem liquidez dentro da carteira, por isso a «parte segura» tem de estar à parte (fundo de emergência, depósitos).',
      '<b>Para quem faz sentido:</b> prazos muito longos e boa tolerância a quedas, com reservas de segurança tratadas fora.']},
    {t:'h',id:'h3',x:'Estrutura 2: ações e obrigações em proporção fixa (80/20, 60/40)'},
    {t:'p',id:'p4',x:'Dois ETFs: um de ações globais e outro de obrigações. A proporção define o risco. «80/20» quer dizer 80% em ações e 20% em obrigações; «60/40», 60% e 40%. É a estrutura clássica dos investidores de longo prazo. Precisa de rebalanceamento de vez em quando (vê «Rebalanceamento»), porque as proporções desviam-se.'},
    {t:'p',id:'p5',x:'Quanto vale a diferença? Com as premissas de exemplo do tema «Alocação de ativos» (ações 7% ao ano, obrigações 3%) e entregas de 200 € por mês, mais 10 000 € iniciais, durante 20 anos, os valores ficam assim:'},
    {t:'cmp',id:'c1',head:['Estrutura','Retorno anual esperado (exemplo)','Valor ao fim de 20 anos','Perda numa crise (ações −40%)'],rows:_ca_mod.map(m=>[m.n,_ca_f(m.r,1)+'%',_e(m.total),'−'+_ca_f(m.q)+'%']),
      cap:'Valores de exemplo, com os mesmos '+_e(_ca_mod[0].paid)+' entregues em todos os casos. Não são previsões.'},
    {t:'p',id:'p6',x:'A diferença entre «só ações» e «60/40» ao fim de 20 anos é '+_e(_ca_mod[0].total-_ca_mod[2].total)+', no exemplo. É o preço de ter uma carteira que cai '+(_ca_mod[0].q-_ca_mod[2].q)+' pontos percentuais menos numa crise. Experimenta alterar o retorno no simulador:'},
    {t:'w',id:'w1',w:'compound',p:{initial:10000,monthly:200,rate:6,years:20}},
    {t:'fazve',id:'q1',ensina:['p5','c1'],q:'Com as premissas do exemplo, quanto valem ao fim de 20 anos 10 000 € iniciais mais 200 € por mês numa carteira 80/20 (retorno esperado de 6,2% ao ano)?',unit:'€',answer:_ca_mod[1].total,tol:.02,why:'Aplicando juros compostos com entregas mensais ao retorno anual de 6,2% durante 20 anos, o valor ronda os '+_e(_ca_mod[1].total)+', dos quais '+_e(_ca_mod[1].paid)+' foram entregues por ti.'},
    {t:'h',id:'h4',x:'Estrutura 3: a carteira por idade (ciclo de vida)'},
    {t:'p',id:'p7',x:'Em vez de uma proporção fixa, a proporção muda com os anos: começas com muito em ações e vais passando para obrigações e liquidez à medida que te aproximas do objetivo. Uma versão caseira usa a regra «110 menos a idade» para o peso das ações:'},
    {t:'cmp',id:'c2',head:['Idade','Ações (110 − idade)','Obrigações e liquidez'],rows:_ca_age.map(([i,a])=>[String(i),a+'%',(100-a)+'%']),
      cap:'Regra de bolso, com variantes mais ou menos agressivas (100 ou 120 em vez de 110). Não é um conselho.'},
    {t:'p',id:'p8',x:'A mesma ideia existe em produtos prontos, os <b>fundos de ciclo de vida</b> (ou <i>target date</i>), que apareceram nos anos 90 para quem não queria gerir a carteira: escolhes um ano-alvo, geralmente o da tua reforma, e o fundo vai reduzindo o risco por ti. A vantagem é a automatização; a desvantagem é que a regra é igual para todos e os custos podem ser mais altos do que montar tu os dois ETFs. A razão de fundo é a mesma do tema «Risco de sequência: a ordem dos retornos perto da reforma».'},
    {t:'h',id:'h5',x:'Estrutura 4: ETF «tudo em um» (multi-ativos)'},
    {t:'p',id:'p9',x:'Existem ETFs e fundos que já trazem ações e obrigações dentro, numa proporção definida e rebalanceada pelo próprio produto. Com uma só compra tens uma carteira 80/20, por exemplo, sem nada a fazer. É a estrutura mais cómoda: o preço é um custo de gestão ligeiramente superior e menos flexibilidade, porque aceitas a proporção que o produto escolheu.'},
    {t:'h',id:'h6',x:'Estrutura 5: três ETFs, núcleo e satélites'},
    {t:'p',id:'p10',x:'Um ETF de ações do mundo desenvolvido, um de mercados emergentes e um de obrigações. É a versão em que escolhes tu o peso de cada região. Dá mais controlo e exige mais rebalanceamento. A variante «núcleo e satélites» põe o grosso num ETF largo e reserva uma pequena fatia (por exemplo 5% a 10%) para ideias próprias, como um setor ou um tema.'},
    {t:'h',id:'h7',x:'Estrutura 6: a «carteira permanente» e as 4 partes iguais'},
    {t:'p',id:'p11',x:'Nos anos 80, o analista americano Harry Browne propôs dividir o dinheiro em quatro partes iguais: ações, obrigações de longo prazo, ouro e liquidez. A lógica é ter algo que funcione em cada cenário: crescimento, recessão, inflação e deflação. É um bom exemplo da ideia de «preparar-se para vários futuros». Tem o inconveniente de dar um retorno esperado mais baixo do que uma carteira com mais ações, e de o ouro não render dividendos.'},
    {t:'h',id:'h8',x:'As estruturas lado a lado'},
    {t:'cmp',id:'c3',head:['Estrutura','Produtos','Rebalanceamento','Complexidade','Limite principal'],rows:[
      ['Um ETF global de ações','1','Não precisa','Muito baixa','100% ações; segurança à parte'],
      ['80/20 ou 60/40','2','Sim, ocasional','Baixa','Mais custos de decisão e de impostos ao vender'],
      ['Ciclo de vida (por idade)','1 a 2','Feito pelo produto ou por ti','Baixa','Regra igual para todos'],
      ['Tudo em um (multi-ativos)','1','Feito pelo produto','Muito baixa','Aceitas a proporção do produto'],
      ['Três ETFs, núcleo e satélites','3 ou mais','Sim, mais atenção','Média','Tentação de complicar'],
      ['Quatro partes iguais','4','Sim','Média','Retorno esperado mais baixo']]},
    {t:'h',id:'h9',x:'Como escolher entre elas'},
    {t:'ul',id:'u2',x:[
      '<b>Começa pelo risco.</b> Define o peso de ações compatível com o teu prazo e a tua tolerância; a estrutura vem depois.',
      '<b>Quanto mais simples, mais fácil de manter.</b> A melhor carteira é a que mantens durante décadas e não abandonas na primeira crise.',
      '<b>Conta os custos.</b> Cada peça acrescenta uma comissão e uma decisão (vê «Custos e TER»).',
      '<b>Não coleciones produtos.</b> Mais ETFs não é mais diversificação se replicam o mesmo.',
      '<b>Escreve a estrutura</b> no teu plano, com a proporção-alvo e a regra de rebalanceamento (vê «O teu plano de investimento por escrito»).']},
    {t:'decide',id:'q2',ensina:['p3','p4','c3'],label:'Decide',q:'Qual das estruturas dispensa rebalanceamento da tua parte, por ter uma só peça?',o:['80/20 com dois ETFs','Quatro partes iguais','Um único ETF global de ações'],c:2,why:'Com um só ETF não há proporções para repor. O preço é aceitares 100% em ações e tratares à parte a segurança.'},
    {t:'decide',id:'q3',ensina:['p7','p8','c2'],label:'Decide',q:'Que ideia está por trás da carteira «por idade»?',o:['Aumentar o risco à medida que se envelhece','Reduzir o risco à medida que o objetivo se aproxima, para proteger o que já se juntou','Manter sempre a mesma proporção'],c:1,why:'Perto do objetivo há menos tempo para recuperar de quedas, por isso o peso das ações vai baixando.'},
    {t:'erro',id:'q4',ensina:['p2','u2'],label:'Encontra o erro',q:'Uma destas afirmações está errada. Qual?',o:['As carteiras-modelo são ponto de partida, não conselhos personalizados','Mais produtos na carteira significam sempre mais diversificação','Uma estrutura simples é mais fácil de manter durante décadas','A proporção entre ações e obrigações define o risco'],c:1,why:'Vários produtos que replicam coisas parecidas não diversificam mais: só acrescentam custos e complicação.'},
    {t:'h',id:'h10',x:'Os erros que mais custam'},
    {t:'ul',id:'u3',x:[
      'Escolher a estrutura pelo que rendeu melhor nos últimos anos.',
      'Complicar: dez ETFs onde dois chegavam.',
      'Mudar de estrutura sempre que uma outra «ganha» a corrida do ano.',
      'Tratar uma estrutura de exemplo como conselho personalizado.',
      'Esquecer o fundo de emergência e a parte segura quando escolhes só um ETF de ações.']},
    {t:'h',id:'h11',x:'Em Portugal'},
    {t:'p',id:'p12',x:'Todas estas estruturas podem montar-se com ETFs UCITS, que são os que se compram a partir de Portugal (vê «ETFs e diversificação: o que se compra em Portugal»). A parte segura pode ser feita com depósitos a prazo ou Certificados de Aforro (vê «Depósitos a prazo» e «Certificados de Aforro e do Tesouro»). Se o objetivo é a reforma, compara a via do PPR com a do investimento por conta própria no tema «PPR ou investir por conta própria». Nas estruturas com rebalanceamento, vender gera mais-valias a declarar (vê «Mais-valias: quanto imposto pagas ao vender»).'},
    {t:'h',id:'h12',x:'Em poucas palavras'},
    {t:'ul',id:'u4',x:[
      'Carteiras-modelo são estruturas simples: poucas peças e proporções claras.',
      'As mais comuns: um ETF global de ações, 80/20 ou 60/40, por idade, tudo em um, três ETFs, quatro partes iguais.',
      'A proporção entre ações e obrigações define o risco e o retorno esperado.',
      'Simples é melhor: mantém-se mais facilmente e custa menos.',
      'Não é conselho: é ponto de partida, a ajustar ao teu perfil.',
      'Escolher o produto concreto é um passo seguinte, com critérios próprios.']}
  ], src:[] },


{ id:'rebalanceamento', topic:'carteira', o:3, title:'Rebalanceamento', mins:7,
  lead:'Com o tempo, o que sobe ganha peso e a tua alocação desvia-se do plano. Rebalancear é repô-la, o que também te obriga a uma disciplina que o instinto não ajuda a ter: vender um pouco do que subiu e comprar o que ficou para trás.',
  blocks:[
    {t:'h',id:'h1',x:'O jardim que cresce torto'},
    {t:'p',id:'p1',x:'Um jardineiro planta ervas e flores nas proporções que desenhou. Passado um ano, as ervas, que crescem mais depressa, ocupam metade do canteiro. Se não podar, o jardim deixa de ser o que planeou. A carteira é igual: o que sobe mais depressa ganha peso, e o plano que definiste (vê «Alocação de ativos») desvia-se sem que faças nada.'},
    {t:'p',id:'p2',x:'Se tinhas 60% em ações e 40% em obrigações, e as ações subiram muito, ficas com mais risco do que planeaste. <b>Rebalancear</b> é voltar à proporção original, vendendo parte do que subiu e comprando o que ficou para trás, ou, mais simples, direcionando as novas entregas para o que está abaixo do peso.'},
    {t:'h',id:'h2',x:'O desvio vê-se em números'},
    {t:'p',id:'p3',x:'Começa com 60/40. Suponhamos, como exemplo, que as ações rendem 8% ao ano e as obrigações 3%, sem nunca mexeres na carteira. Ao fim de 10 anos, as ações pesam <b>'+_ca_f(_ca_drift,1)+'%</b>, e já não 60%. Sem teres decidido nada, passaste de uma carteira «equilibrada» para uma mais arriscada, e a próxima crise vai apanhar-te mais exposto do que pensavas.'},
    {t:'stat',id:'s1',v:Math.round(_ca_drift),fmt:'pct',label:'Peso das ações ao fim de 10 anos, a partir de 60% e sem rebalancear (arredondado)'},
    {t:'fazve',id:'q1',ensina:['p2'],q:'Tinhas 6 000 € em ações e 4 000 € em obrigações (60/40). As ações subiram 25% e as obrigações ficaram iguais. A carteira vale agora 11 500 €. Para voltar aos 60/40, quanto tens de vender de ações?',unit:'€',answer:7500-11500*.6,tol:.01,why:'Ações: 7 500 €. O alvo é 60% de 11 500 € = 6 900 €. Vendes 600 € de ações e compras 600 € de obrigações.'},
    {t:'h',id:'h3',x:'Quando rebalancear'},
    {t:'p',id:'p4',x:'Há duas regras simples e razoáveis. A primeira é <b>por calendário</b>: uma vez por ano (muita gente escolhe o aniversário ou o fim do ano). A segunda é <b>por limiar</b>: só rebalanceias quando uma classe se afasta do alvo mais do que um limite, por exemplo 5 pontos percentuais. Uma variante usa as duas: olhas uma vez por ano, e só atuas se o desvio passar o limiar.'},
    {t:'cmp',id:'c1',head:['Método','Como funciona','Vantagem','Inconveniente'],rows:[
      ['Calendário','Uma vez por ano (ou semestre)','Simples, previsível','Pode rebalancear sem necessidade, ou tarde de mais'],
      ['Limiar','Quando uma classe passa 5 pontos do alvo','Só atuas quando importa','Exige acompanhar com regularidade'],
      ['Com entregas','As novas entregas vão para o que está abaixo do peso','Sem vender, sem custos nem imposto','Só funciona se estás a entregar dinheiro e o desvio não é grande'],
      ['Nunca','Deixas andar','Zero trabalho','O risco sobe sem decisão tua']],
      cap:'Fazer isto com muita frequência só aumenta custos e, em Portugal, pode gerar mais-valias tributáveis quando vendes.'},
    {t:'h',id:'h4',x:'O que o rebalanceamento faz (e não faz)'},
    {t:'p',id:'p5',x:'O objetivo principal do rebalanceamento é <b>controlar o risco</b>, e não aumentar o retorno. Para ver o efeito, usamos dez anos de retornos de exemplo para ações ('+_ca_rs.map(x=>_ca_f(x)+'%').join(', ')+') e obrigações ('+_ca_rb.map(x=>_ca_f(x)+'%').join(', ')+'), partindo de 10 000 € em 60/40:'},
    {t:'cmp',id:'c2',head:['','Sem rebalancear','Rebalanceando todos os anos'],rows:[
      ['Valor ao fim de 10 anos',_e(_ca_nr.at(-1).t),_e(_ca_yr.at(-1).t)],
      ['Peso das ações no fim',_ca_f(_ca_nr.at(-1).w,0)+'%','60% (por definição, ao rebalancear)'],
      ['Peso máximo das ações durante o período',_ca_f(Math.max(..._ca_nr.map(r=>r.w)),0)+'%',_ca_f(Math.max(..._ca_yr.map(r=>r.w)),0)+'% (antes de cada rebalanceamento)']],
      cap:'Valores de exemplo, sem custos nem impostos.'},
    {t:'p',id:'p6',x:'Neste exemplo, com as ações a subir quase sempre, <b>não rebalancear acabou com mais dinheiro</b> ('+_e(_ca_nr.at(-1).t)+' contra '+_e(_ca_yr.at(-1).t)+'), mas com '+_ca_f(_ca_nr.at(-1).w,0)+'% em ações no fim, quando o plano dizia 60%: uma crise nesse ponto teria doído muito mais. Num período em que as ações caíssem, a ordem inverter-se-ia. O rebalanceamento não é uma mina de ouro: troca um pouco de retorno potencial por <b>risco que decides tu</b>.'},
    {t:'h',id:'h5',x:'Disciplina que contraria o instinto'},
    {t:'p',id:'p7',x:'Rebalancear manda fazer o contrário do que apetece: vender o que subiu (que parece estar a funcionar) e comprar o que desceu (que parece estar a falhar). É por isso que funciona como uma regra de «comprar baixo, vender alto» sem prever nada. Também é por isso que é difícil: depois de grandes subidas parece uma pena vender, e depois de grandes quedas dá medo comprar.'},
    {t:'p',id:'p8',x:'No início de 2000, quem tinha ações tecnológicas a subir e rebalanceou vendeu parte delas, e ficou menos exposto à queda que veio. No início de 2009, no fundo da crise financeira, rebalancear obrigava a vender obrigações e comprar mais ações baixíssimas, no meio do pânico. Poucos o fizeram, e quem o fez foi bem recompensado na recuperação seguinte.'},
    {t:'h',id:'h6',x:'Como rebalancear sem custos nem impostos'},
    {t:'ul',id:'u1',x:[
      '<b>Direciona as novas entregas</b> para a classe que está abaixo do peso, em vez de vender.',
      '<b>Usa os dividendos e juros</b> recebidos para comprar o que falta.',
      '<b>Quando levantas dinheiro</b>, tira-o do que está acima do peso.',
      '<b>Usa limiares largos</b> (por exemplo 5 pontos) para evitar movimentos pequenos.',
      '<b>Um ETF multi-ativos</b> faz o rebalanceamento dentro do produto por ti (vê «Carteiras-modelo simples: um ETF global, 80/20, por idade»).']},
    {t:'decide',id:'q2',ensina:['p2','u1'],label:'Decide',q:'Estás a investir todos os meses. Qual é uma forma simples de rebalancear sem vender nada?',o:['Parar de investir','Vender tudo e recomeçar','Pôr as novas entregas no ativo que está abaixo do peso'],c:2,why:'Dirigir as novas entregas para a classe que ficou para trás corrige o desvio sem vender, o que evita custos e impostos.'},
    {t:'decide',id:'q3',ensina:['p4','c1'],label:'Decide',q:'A tua regra é rebalancear quando uma classe se afasta mais de 5 pontos do alvo. As ações estão a 62% num alvo de 60%. O que fazes?',o:['Nada: o desvio é de 2 pontos, abaixo do limiar','Vendes ações para voltar a 60% já','Vendes tudo'],c:0,why:'Um desvio de 2 pontos fica dentro do limiar de 5. Rebalancear por pouco só gera custos e, ao vender, eventuais impostos.'},
    {t:'erro',id:'q4',ensina:['p5','p6','p7'],label:'Encontra o erro',q:'Uma destas afirmações está errada. Qual?',o:['Rebalancear serve sobretudo para controlar o risco','Rebalancear obriga a vender o que subiu e comprar o que desceu','Rebalancear garante sempre um retorno mais alto','Rebalancear com muita frequência aumenta custos'],c:2,why:'O rebalanceamento controla o risco; o retorno pode ser ligeiramente melhor ou pior consoante o período. Não é garantido.'},
    {t:'h',id:'h6b',x:'Rebalancear com levantamentos e com vários produtos'},
    {t:'p',id:'p8b',x:'Quem já está a retirar dinheiro tem uma vantagem: pode retirá-lo <b>da classe que está acima do peso</b>, e assim rebalancear sem custos extra. Quem tem vários produtos deve olhar para o total, e não para cada um isolado: o que conta é a proporção entre ações e obrigações na carteira inteira, incluindo o PPR, os depósitos e os Certificados de Aforro que fazem parte da parte «segura». Um truque para não esquecer: anotar o alvo e os limites no plano escrito (vê «O teu plano de investimento por escrito») e rever uma vez por ano, sempre na mesma data. Se só tens um ETF multi-ativos, o produto faz o rebalanceamento por ti, e a tua tarefa reduz-se a decidir se a proporção que ele mantém ainda te serve.'},
    {t:'h',id:'h7',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      'Nunca rebalancear e acabar com mais risco do que o planeado.',
      'Rebalancear todos os meses por ansiedade: custos e impostos sem benefício.',
      'Deixar de rebalancear nas crises, que é quando mais vale a pena.',
      'Vender tudo e recomeçar, em vez de usar entregas ou ajustes parciais.',
      'Ignorar o imposto: vender com ganhos tem custo fiscal.']},
    {t:'h',id:'h8',x:'Em Portugal'},
    {t:'p',id:'p9',x:'Em Portugal, vender ETFs ou ações com ganhos gera mais-valias, tributadas à taxa autónoma de 28% sobre o saldo anual positivo (verificado em 17/11/2026 no artigo 72.º do Código do IRS, no Portal das Finanças). Por isso compensa rebalancear com novas entregas ou usar limiares largos, em vez de vender pequenas fatias com frequência. Os detalhes de cálculo estão no tema «Mais-valias: quanto imposto pagas ao vender», e o regime dos ETFs de acumulação no tema «ETFs de acumulação e de distribuição».'},
    {t:'h',id:'h9',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'Sem rebalancear, a carteira desvia-se do plano e o risco sobe sozinho.',
      'Rebalancear é repor as proporções: vender o que subiu e comprar o que ficou para trás.',
      'Faz-se por calendário (uma vez por ano) ou por limiar (por exemplo, 5 pontos de desvio).',
      'Serve para controlar o risco, não para garantir mais retorno.',
      'A forma mais barata é usar as novas entregas.',
      'Em Portugal, vender com ganhos gera mais-valias: evita rebalancear em excesso.']}
  ], src:[_AT_72] },


{ id:'dca', topic:'carteira', o:4, title:'Investir aos poucos ou de uma vez', mins:7,
  lead:'Se tens uma quantia grande, investes tudo de uma vez ou em parcelas? As duas têm lógica, e a resposta tem mais de psicologia do que de matemática. E se o dinheiro te chega todos os meses, a pergunta nem se põe.',
  blocks:[
    {t:'h',id:'h1',x:'Entrar na piscina de uma vez ou aos poucos'},
    {t:'p',id:'p1',x:'Há quem salte para a piscina de cabeça, e há quem entre degrau a degrau. Chegam os dois ao fundo, mas o choque térmico é diferente. Investir é parecido. Investir <b>de uma vez</b> põe o dinheiro a trabalhar já. Investir <b>aos poucos</b> (em inglês, <i>dollar-cost averaging</i>, ou <i>DCA</i>) é dividir a quantia em parcelas iguais, entregues a intervalos regulares, durante meses.'},
    {t:'p',id:'p2',x:'Se o preço sobe sempre, comprar de uma vez ganha, porque compras tudo ao preço mais baixo. Se cai e recupera, comprar aos poucos compra mais unidades quando o preço está baixo. O problema é que não sabes de antemão qual será o caminho do preço.'},
    {t:'h',id:'h2',x:'Um exemplo pequeno, passo a passo'},
    {t:'p',id:'p3',x:'Tens 400 € e o preço de uma unidade vai de 100 € para 80 €, 90 € e 110 € nos quatro meses seguintes. Compras tudo no mês 1 (4 unidades), ou 100 € por mês. A segunda opção compra '+_ca_ex4.map(x=>_ca_f(100/x,2)).join(' + ')+' = <b>'+_ca_f(_ca_u4,2)+' unidades</b>, que valem mais no fim.'},
    {t:'fazve',id:'q1',ensina:['p3'],q:'No exemplo (parcelas de 100 € aos preços 100, 80, 90 e 110), qual é o valor final das unidades compradas ao preço de 110 €?',unit:'€',answer:_ca_u4*110,tol:.01,why:'Compras '+_ca_f(_ca_u4,2)+' unidades, que a 110 € valem cerca de '+_e(_ca_u4*110)+'. Comprar tudo no mês 1 daria 4 × 110 = 440 €.'},
    {t:'h',id:'h3',x:'Os três caminhos do preço'},
    {t:'p',id:'p4',x:'Vamos testar com 1 200 €, a investir de uma vez no mês 1 ou 100 € por mês durante 12 meses, em três caminhos de preço inventados:'},
    {t:'cmp',id:'c1',head:['Caminho do preço','De uma vez','Aos poucos','Melhor'],rows:_ca_dca.map(d=>[d.n,_e(d.lump),_e(d.dca),d.lump>d.dca?'De uma vez':'Aos poucos']),
      cap:'Valores de exemplo, sem custos. Valor no fim dos 12 meses de 1 200 € investidos.'},
    {t:'p',id:'p5',x:'Nada de surpreendente: de uma vez ganha quando o mercado sobe; aos poucos ganha quando cai ou cai e recupera. Como não sabes qual vai acontecer, a questão é quanto custa errar cada uma. Se o mercado sobe, ficas com um pouco menos do que podias. Se desce logo a seguir, ficas com muito menos dor de arrependimento.'},
    {t:'h',id:'h4',x:'O que dizem os estudos'},
    {t:'p',id:'p6',x:'Estudos feitos com dados históricos americanos mostram que investir de uma vez costuma ganhar em cerca de <b>dois terços</b> dos períodos, porque os mercados sobem mais vezes do que descem. Mas isto é uma média: em alguns períodos o investimento em parcelas foi melhor, e em todos eles foi menos arriscado em termos emocionais.'},
    {t:'p',id:'p7',x:'Repara também numa ideia que se diz muito e é meio enganadora: «com DCA o meu preço médio é mais baixo». É verdade em relação à média dos preços: nos exemplos acima, o preço médio de compra foi sempre ligeiramente inferior à média aritmética dos preços ('+_ca_dca.map(d=>_ca_f(d.avg,1)+' contra '+_ca_f(d.mean,1)).join('; ')+'), porque compras mais unidades quando é barato. Mas isso não significa que ganhes mais do que quem investiu de uma vez: depende do caminho.'},
    {t:'h',id:'h5',x:'Quando faz mais sentido uma e outra'},
    {t:'ul',id:'u1',x:[
      '<b>Recebes dinheiro todos os meses</b> (o ordenado): já estás a investir aos poucos, sem decidir. Automatiza e esquece.',
      '<b>Tens uma quantia grande de uma vez</b> (herança, indemnização) e aguentas bem as oscilações: investir de uma vez costuma ser o caminho matematicamente favorável.',
      '<b>Tens uma quantia grande e medo de investir tudo no dia errado:</b> dividir em 6 a 12 parcelas é uma proteção contra o arrependimento. É um compromisso razoável, desde que cumpras o calendário.',
      '<b>Nunca guardes o dinheiro «à espera do momento certo».</b> Isso é tentar adivinhar o mercado, e costuma sair mais caro do que os dois métodos acima.']},
    {t:'h',id:'h6',x:'Um caso real: quem continuou a comprar em 2008'},
    {t:'p',id:'p8',x:'Imagina duas pessoas que investiam uma quantia todos os meses em 2007. Em 2008 o mercado caiu muito. Uma continuou a investir e acumulou mais unidades a preços baixos; a outra parou, assustada. Quando o mercado recuperou, a primeira tinha uma carteira bem maior. O DCA não é um truque para ganhar: é uma regra que impede o medo de te fazer parar nos momentos em que comprar mais barato é possível.'},
    {t:'h',id:'h7',x:'O custo escondido: comissões fixas'},
    {t:'p',id:'p9',x:'Há um senão prático. Se a tua corretora cobra uma comissão fixa por cada compra, investir pouco de cada vez custa uma percentagem grande. Com uma comissão de 2 € por ordem (valor de exemplo), uma compra de 100 € custa <b>'+_ca_f(2/100*100,1)+'%</b>; uma compra de 1 000 €, '+_ca_f(2/1000*100,1)+'%. Por isso, compara as comissões antes de escolher a periodicidade: a cada mês, a cada trimestre, ou quando o saldo chega a um valor que dilua o custo (vê «Custos e TER»).'},
    {t:'fazve',id:'q2',ensina:['p9'],q:'A tua corretora cobra 2 € por compra. Investes 50 € por mês. Que percentagem de cada compra vai em comissão?',unit:'%',answer:2/50*100,tol:.01,why:'2 ÷ 50 = 4%. Com valores pequenos e comissões fixas, o custo come uma parte grande do investimento; juntar várias entregas numa só compra pode compensar.'},
    {t:'decide',id:'q3',ensina:['p5','p6','u1'],label:'Decide',q:'Recebes uma herança grande e tens medo de investir tudo e ver o mercado cair no dia seguinte. Qual a ideia mais coerente?',o:['Dividir em parcelas ao longo de vários meses, para reduzir o arrependimento','Esperar um ano sem fazer nada','Investir tudo na altura mais barata que conseguires prever'],c:0,why:'Investir em parcelas reduz o risco de investir tudo na pior altura e o peso emocional. Prever a altura mais barata é muito difícil.'},
    {t:'decide',id:'q4',ensina:['p4','c1','p5'],label:'Decide',q:'Em que caminho de preço é que investir aos poucos acaba por vencer investir de uma vez?',o:['Quando o preço sobe sempre','Quando o preço cai e recupera','Nunca'],c:1,why:'Se o preço desce primeiro, as parcelas compram mais unidades baratas, que depois valem mais na recuperação.'},
    {t:'erro',id:'q5',ensina:['p6','p7','u1'],label:'Encontra o erro',q:'Uma destas afirmações está errada. Qual?',o:['Investir de uma vez ganha em muitos períodos, porque os mercados sobem mais do que descem','Investir aos poucos reduz o arrependimento','Investir aos poucos ganha sempre a investir de uma vez','Quem investe parte do ordenado todos os meses já faz DCA'],c:2,why:'Não há garantia: depende do caminho do preço. Em mercados que sobem, ganha o investimento de uma vez.'},
    {t:'h',id:'h7b',x:'A regra de ouro: decidir uma vez e automatizar'},
    {t:'p',id:'p9b',x:'O maior inimigo de um plano de entregas periódicas não é o mercado: és tu. Num mês de pânico, é fácil adiar «só desta vez», e as vezes acumulam-se. A forma de contornar isto é tornar a decisão automática: definir uma ordem permanente da conta para a corretora logo a seguir ao ordenado, e uma compra programada para o mesmo dia de cada mês. Assim a decisão fica tomada no dia calmo em que a configuraste. Um segundo cuidado: o dinheiro de que vais precisar nos próximos anos (a entrada para uma casa, uma viagem, o fundo de emergência) <b>nem deve entrar em ações</b>, seja de uma vez, seja aos poucos. A pergunta «de uma vez ou aos poucos?» só se aplica a dinheiro de longo prazo.'},
    {t:'h',id:'h8',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      'Prolongar o calendário por meses ou anos «para ver o que o mercado faz».',
      'Parar as entregas quando o mercado cai, que é quando comprar é mais barato.',
      'Ignorar comissões fixas em compras pequenas.',
      'Mudar a quantia ou o ativo a meio, consoante o humor.',
      'Julgar que o DCA elimina o risco: só o distribui no tempo.']},
    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p10',x:'Em Portugal, muitas corretoras e bancos permitem programar entregas periódicas, mas as comissões variam muito: confirma sempre o custo por ordem antes de definires a frequência. Quando vender, as várias compras feitas em datas e preços diferentes entram no cálculo das mais-valias (vê «Mais-valias: quanto imposto pagas ao vender»). Escolhe também o ETF com cuidado (vê «Escolher um ETF passo a passo»).'},
    {t:'note',id:'n1',pending:true,x:'Método de apuramento do custo de aquisição quando se vende uma parte de títulos comprados em datas diferentes (ordem das compras): confirmar em fonte oficial (AT) antes de usar nos cálculos.'},
    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'De uma vez põe o dinheiro a trabalhar já; aos poucos reparte o risco de entrar no pior dia.',
      'Em média, investir de uma vez costuma ganhar, mas só quando o mercado sobe.',
      'Aos poucos reduz o arrependimento e protege contra decisões emocionais.',
      'Quem investe parte do ordenado todos os meses já faz DCA.',
      'Cuidado com comissões fixas em compras pequenas.',
      'O que importa é escolher um método e cumpri-lo.']}
  ], src:[] },


{ id:'custos', topic:'carteira', o:5, title:'Custos e TER', mins:7,
  lead:'Custos parecem pequenos, mas comem uma parte grande do retorno durante décadas. Reduzi-los é das poucas coisas que controlas por completo, porque o retorno do mercado não depende de ti e o que pagas a quem gere o teu dinheiro, sim.',
  blocks:[
    {t:'h',id:'h1',x:'Uma torneira a pingar'},
    {t:'p',id:'p1',x:'Uma torneira a pingar parece inofensiva. Uma gota por segundo não enche um copo em minutos. Mas ao fim de um ano são milhares de litros. Os custos dos investimentos são assim: cobrados em pequenas percentagens, todos os anos, sobre todo o dinheiro, incluindo o que ganhaste. E, ao contrário do mercado, nunca falham: pagas mesmo nos anos em que a carteira perde.'},
    {t:'p',id:'p2',x:'Há uma segunda razão para dar importância a este tema: o futuro é incerto, mas os custos são certos. Não sabes o retorno do ano seguinte, mas sabes exatamente quanto vais pagar. Entre duas alternativas que replicam o mesmo mercado, a mais barata fica, <i>garantidamente</i>, à frente.'},
    {t:'h',id:'h2',x:'O TER, o custo que não se vê'},
    {t:'p',id:'p3',x:'O <b>TER</b> (<i>total expense ratio</i>, «rácio de despesas totais») é o custo anual total de um fundo ou ETF, em percentagem do valor investido. É descontado <b>dentro do produto</b>, todos os dias, por isso não o vês numa fatura: simplesmente o fundo rende menos. Um ETF largo pode custar à volta de 0,07% a 0,2% ao ano (valores típicos de exemplo); um fundo de gestão ativa pode custar 1,5% ou mais.'},
    {t:'h',id:'h3',x:'Todos os custos possíveis'},
    {t:'cmp',id:'c1',head:['Custo','Quem cobra','Quando','Onde se vê'],rows:[
      ['TER / comissão de gestão','O fundo ou ETF','Todos os anos, dentro do produto','No KID e na ficha do produto'],
      ['Comissão de subscrição ou resgate','Alguns fundos','Ao entrar ou sair','No KID; muitos ETFs não têm'],
      ['Comissão de êxito','Alguns fundos ativos','Quando o fundo bate um alvo','No prospeto'],
      ['Comissão de corretagem','A corretora','Cada compra ou venda','Na tabela de preços da corretora'],
      ['Spread','O mercado','Diferença entre preço de compra e de venda','No ecrã de negociação'],
      ['Comissão de custódia','Algumas corretoras e bancos','Anual, em alguns casos','Na tabela de preços'],
      ['Câmbio','A corretora','Quando convertes moeda','No extrato da operação'],
      ['Imposto do selo sobre comissões','O Estado, cobrado pela entidade','Sobre certas comissões','Na nota de operação (vê «Comissões e imposto do selo»)'],
      ['Diferença de réplica (tracking difference)','O ETF, por construção','Ao longo do tempo','Na comparação com o índice']],
      cap:'Nem todos existem em todos os produtos: ler o KID e a tabela de preços mostra os que se aplicam.'},
    {t:'h',id:'h4',x:'A conta que muda tudo: 30 anos de custos'},
    {t:'p',id:'p4',x:'Imagina que investes 10 000 € e 200 € por mês durante 30 anos, com um retorno de 6% ao ano antes de custos. Vê o que se perde consoante o custo anual do produto:'},
    {t:'cmp',id:'c2',head:['Custo anual (TER)','Valor final','O que fica no caminho','% do valor sem custos'],rows:_ca_cost.map(c=>[_ca_f(c.t,2)+'%',_e(c.com),_e(c.perd),c.t?_ca_f(c.perd/c.sem*100,0)+'%':'0%']),
      cap:'Exemplo com retorno de 6% antes de custos. A coluna final mostra a fatia do valor que os custos levam.'},
    {t:'stat',id:'s1',v:Math.round(_ca_c15.perd),label:'Perdido em custos com um TER de 1,5% (arredondado)'},
    {t:'p',id:'p5',x:'Com 1,5% ao ano, os custos levam cerca de '+_ca_f(_ca_c15.perd/_ca_c15.sem*100,0)+'% do que terias sem custos, e isto de um retorno que parecia apenas «1,5 pontos» mais baixo. Experimenta com os teus valores:'},
    {t:'w',id:'w1',w:'calc',c:'fees'},
    {t:'p',id:'p6',x:'Há outra maneira de ver: com um retorno bruto de 6%, um custo de 1,5% é <b>'+_ca_f(1.5/6*100,0)+'%</b> do retorno. Dito de outra forma, o produto fica com uma de cada quatro unidades do que o mercado deu, e tu ficas com as outras três. E isto repete-se todos os anos, incluindo os maus.'},
    {t:'fazve',id:'q1',ensina:['p4','c2','w1'],q:'Investes 200 € por mês (começando com 10 000 €) durante 30 anos, com 6% de retorno antes de custos. Quanto perdes em custos com um TER de 1,5%, aproximadamente?',unit:'€',answer:_c('fees',{ini:10000,men:200,rate:6,ter:1.5,ano:30})[2],tol:.03,why:'Sem custos, o valor ronda os '+_e(_ca_c15.sem)+'; com 1,5% de custos, fica por volta dos '+_e(_ca_c15.com)+'. Perdes cerca de '+_e(_ca_c15.perd)+', mesmo sem o veres numa fatura.'},
    {t:'h',id:'h5',x:'O que se paga e o que se recebe'},
    {t:'p',id:'p7',x:'Custos mais altos não significam melhor gestão. Estudos regulares de comparação entre fundos ativos e índices (como os do tipo SPIVA) mostram que, depois de custos, a maioria dos fundos ativos fica abaixo do seu índice em períodos longos, e que os mais caros não têm resultados superiores (vê «Indexado ou gestão ativa»). Pagar mais só vale a pena se o que recebes em troca for realmente diferente, e isso quase nunca é verificável de antemão.'},
    {t:'p',id:'p8',x:'A escala também conta. Uma estratégia que cobra 2% e dá 8% ao ano deixa ao investidor 6%. Uma que cobra 0,1% e dá 7% deixa 6,9%, mais do que a primeira, apesar de ter «rendido menos».'},
    {t:'h',id:'h6',x:'Um caso real: o primeiro fundo indexado de retalho'},
    {t:'p',id:'p9',x:'Em 1976, o americano John Bogle lançou o primeiro fundo indexado para o público em geral, com custos muito mais baixos do que os dos fundos ativos. Foi alvo de troça, apelidado de «loucura de Bogle»: ninguém queria ter o retorno médio. Com o tempo, a ideia dominou: hoje, os fundos e ETFs indexados detêm uma parte enorme do mercado e a pressão fez baixar os custos em toda a indústria. A lição é que a vitória dos custos baixos veio de uma conta simples, não de uma teoria complicada.'},
    {t:'h',id:'h7',x:'Como reduzir custos na prática'},
    {t:'ul',id:'u1',x:[
      '<b>Compara o TER</b> de produtos que replicam o mesmo índice e escolhe o mais baixo, tendo em conta outros critérios como o tamanho e a réplica (vê «Escolher um ETF passo a passo»).',
      '<b>Evita comissões de subscrição</b> e fundos com comissão de êxito, se não perceberes o que dão em troca.',
      '<b>Investe com menos operações.</b> Menos compras e vendas, menos comissões e menos spread. Junta entregas pequenas numa só compra quando a comissão é fixa.',
      '<b>Compara a tabela de preços das corretoras</b> e o custo do câmbio.',
      '<b>Pergunta sempre o custo total.</b> Se o custo não for claro, desconfia.']},
    {t:'decide',id:'q2',ensina:['p3','c1','p4','c2'],label:'Decide',q:'Dois produtos replicam o mesmo índice, um com TER de 0,07% e outro de 1,2%. Qual tende a dar-te mais no longo prazo, tudo o resto igual?',o:['O de 1,2%, porque custa mais','Dá igual','O de 0,07%, porque os custos menores acumulam a teu favor'],c:2,why:'Replicando o mesmo índice, o retorno antes de custos é igual; o produto mais barato deixa-te com mais.'},
    {t:'decide',id:'q3',ensina:['p6','p8'],label:'Decide',q:'Um fundo A rende 8% ao ano e cobra 2%. Um fundo B rende 7% e cobra 0,1%. Qual deixa mais ao investidor?',o:['O A, porque rende mais antes de custos','O B, porque 6,9% depois de custos é mais do que 6%','Ficam iguais'],c:1,why:'O que importa é o retorno depois de custos: A deixa 8% − 2% = 6%; B deixa 7% − 0,1% = 6,9%.'},
    {t:'erro',id:'q4',ensina:['p1','p3','p7'],label:'Encontra o erro',q:'Uma destas afirmações está errada. Qual?',o:['O TER é descontado dentro do produto, sem fatura','Os custos são cobrados mesmo nos anos em que o fundo perde','Os fundos mais caros têm, em média, melhores resultados depois de custos','Um custo de 1,5% ao ano pode levar um quarto do retorno'],c:2,why:'Os estudos de comparação não mostram que mais caro seja melhor depois de custos; em geral os mais baratos saem à frente.'},
    {t:'h',id:'h8',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      'Achar que «1,5% é pouco». Em 30 anos, pesa uma fatia enorme do valor final.',
      'Olhar só para o retorno antes de custos.',
      'Pagar comissões de êxito ou de subscrição sem perceber o que se recebe em troca.',
      'Ignorar o custo de câmbio e do spread, que não aparecem como «comissão».',
      'Trocar de produto muitas vezes: cada troca tem custos e pode gerar impostos.']},
    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p10',x:'Em Portugal, vê sempre o TER no KID, o preço de cada operação na tabela da corretora ou do banco e a existência de comissões de custódia. Alguns custos de serviços financeiros estão sujeitos a imposto do selo (vê «Comissões e imposto do selo»). Se estás a comparar um PPR de banco com um ETF, o custo é um fator essencial (vê «PPR ou investir por conta própria»). E o imposto sobre os ganhos, tratado nos temas de impostos, soma-se aos custos para determinar o que realmente ficas a ganhar.'},
    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'O TER é o custo anual de um fundo ou ETF, cobrado dentro do produto.',
      'Custos pequenos acumulam-se: 1,5% ao ano levou perto de um quarto do valor final em 30 anos.',
      'Os custos são certos; o retorno não é.',
      'Compara produtos que replicam o mesmo índice: o mais barato fica à frente.',
      'Procura também comissões de corretagem, custódia, câmbio e spread.',
      'Custos mais altos não significam melhor gestão.']}
  ], src:[] },


{ id:'indexado-ativo', topic:'carteira', o:6, title:'Indexado ou gestão ativa', mins:7,
  lead:'Replicar o mercado ou tentar vencê-lo? É um dos debates mais antigos do investimento, e a evidência favorece quem tem pouco tempo e paciência. Perceber porquê ajuda a escolher sem ser seduzido por promessas.',
  blocks:[
    {t:'h',id:'h1',x:'Comprar a manada inteira'},
    {t:'p',id:'p1',x:'Um criador de gado pode tentar escolher os melhores animais para levar à feira, sabendo que uma parte falha. Ou pode levar o rebanho todo e aceitar o preço médio. A <b>gestão passiva</b> (ou <b>indexada</b>) faz a segunda coisa: replica um <b>índice</b> (uma lista de ativos, como as 500 maiores empresas dos Estados Unidos), compra todos na proporção do índice, paga pouco e aceita o retorno médio. A <b>gestão ativa</b> faz a primeira: um gestor escolhe os ativos que acha que vão render mais, ou o momento certo para entrar e sair, e cobra mais por isso.'},
    {t:'p',id:'p2',x:'Não se trata de uma questão de «inteligência» dos gestores, que muitas vezes são excelentes. É uma questão de aritmética e de custos.'},
    {t:'h',id:'h2',x:'A aritmética que ninguém consegue contornar'},
    {t:'p',id:'p3',x:'O investidor médio no mercado <b>é</b> o mercado. Antes de custos, todos os investidores juntos têm o retorno do mercado. Se uns ganham mais do que a média, outros têm de ganhar menos. Mas os gestores ativos cobram custos mais altos, e os indexados cobram custos baixos. Logo, <b>depois de custos</b>, o gestor ativo médio tem de ficar atrás do indexado médio. É uma consequência direta, não precisa de estudos para ser verdade (embora os estudos a confirmem).'},
    {t:'p',id:'p4',x:'Exemplo: o mercado rende 7% ao ano. Um ETF indexado cobra 0,1% e deixa-te com '+_ca_f(6.9,1)+'%. Um fundo ativo, mesmo que antes de custos consiga exatamente o retorno do mercado, cobra 1,5% e deixa-te com '+_ca_f(5.5,1)+'%. Em 20 anos, 10 000 € crescem para <b>'+_e(_ca_idx)+'</b> no indexado e para <b>'+_e(_ca_act)+'</b> no ativo: uma diferença de '+_e(_ca_idx-_ca_act)+', sem que o gestor ativo tenha feito nada errado, só por custar mais.'},
    {t:'stat',id:'s1',v:Math.round(_ca_idx-_ca_act),label:'Diferença em 20 anos entre indexado (6,9%) e ativo (5,5%) a partir de 10 000 €'},
    {t:'fazve',id:'q1',ensina:['p3','p4'],q:'O mercado rende 7% ao ano. Um fundo indexado cobra 0,1% e um fundo ativo cobra 1,5% (e antes de custos só iguala o mercado). Quanto vale cada 10 000 € ao fim de 20 anos no fundo ativo?',unit:'€',answer:_ca_act,tol:.01,why:'7% − 1,5% = 5,5% ao ano. 10 000 × 1,055^20 ≈ '+_e(_ca_act)+'. No indexado, 6,9% dá cerca de '+_e(_ca_idx)+'.'},
    {t:'h',id:'h3',x:'O que dizem os estudos'},
    {t:'p',id:'p5',x:'Estudos regulares, como o relatório SPIVA (que compara fundos ativos com os seus índices de referência), mostram que, em períodos longos como 10 e 15 anos, a <b>maioria</b> dos fundos ativos fica abaixo do seu índice depois de custos, em quase todas as categorias e regiões. Os que ganham num período raramente repetem no seguinte, e não sabes de antemão quais serão.'},
    {t:'p',id:'p6',x:'Há ainda um viés escondido: os fundos que correm mal fecham ou fundem-se, e desaparecem das estatísticas. Quando ouves «este fundo bateu o índice», pergunta-te quantos fundos semelhantes foram fechados em silêncio. É o <b>viés de sobrevivência</b>: só vês os sobreviventes.'},
    {t:'h',id:'h4',x:'Sorte ou talento? A experiência das moedas'},
    {t:'p',id:'p7',x:'Imagina 1 000 gestores que, em cada ano, têm 50% de probabilidade de bater o índice só por sorte (como atirar uma moeda ao ar). Quantos bateriam o índice vários anos seguidos, apenas por acaso?'},
    {t:'cmp',id:'c1',head:['Anos seguidos a bater o índice','Gestores «estrela» só por sorte (em 1 000)'],rows:_ca_luck.map(([n,k])=>[String(n),_ca_f(k,k<10?1:0)]),
      cap:'Cada ano tem 50% de hipótese de sucesso. Metade, depois um quarto, e por aí fora.'},
    {t:'p',id:'p8',x:'Ao fim de 5 anos haveria cerca de '+_ca_f(_ca_luck[3][1],0)+' gestores com um historial «perfeito» só por azar ou sorte. Parecem génios, e as revistas escrevem sobre eles. Distinguir talento de sorte exige muitos anos de dados, e mesmo assim é difícil. Por isso, o historial recente de um fundo é um mau critério para o escolher.'},
    {t:'h',id:'h5',x:'Um caso real: a aposta de Warren Buffett'},
    {t:'p',id:'p9',x:'Em 2007, o investidor Warren Buffett apostou que um simples fundo indexado ao S&P 500 bateria, ao fim de dez anos, uma seleção de fundos de gestão alternativa escolhida por uma empresa de gestão profissional. A aposta decorreu entre 2008 e 2017. O fundo indexado ganhou com larga margem, em boa parte por causa dos custos mais baixos dos fundos de índice. Não prova que nenhum gestor consegue vencer o mercado, mas mostra o peso dos custos.'},
    {t:'h',id:'h6',x:'Indexado ou ativo, lado a lado'},
    {t:'cmp',id:'c2',head:['','Indexado (passivo)','Ativo'],rows:[
      ['Objetivo','Igualar o índice','Bater o índice'],
      ['Custos','Baixos','Mais altos'],
      ['Diversificação','Ampla, por construção','Depende do gestor'],
      ['Rotação de títulos','Pouca','Muita (mais custos de transação)'],
      ['Risco principal','Cair com o mercado','Cair com o mercado e escolher mal'],
      ['Onde pode fazer sentido','Mercados grandes e eficientes (ações globais)','Nichos menos eficientes, ou gestores com histórico muito longo e custos justos']]},
    {t:'ul',id:'u1',x:[
      '<b>Indexado:</b> custos baixos, diversificação ampla, nenhuma decisão de «timing».',
      '<b>Ativo:</b> pode fazer sentido em nichos menos eficientes, ou se confias num gestor com histórico longo e custos justos.',
      '<b>Meio-termo:</b> núcleo indexado e uma pequena parte para ideias próprias (vê «Alocação de ativos»).']},
    {t:'h',id:'h7',x:'Os limites da indexação'},
    {t:'p',id:'p10',x:'A indexação não é perfeita. Na maioria dos índices, as empresas pesam em proporção ao seu valor de mercado, o que significa que, quando algumas empresas gigantes sobem muito, passam a pesar mais no índice, e a tua carteira concentra-se mais nelas. Também há índices e ETFs temáticos que se dizem passivos mas são apostas concentradas. «Indexado» não quer dizer «seguro» nem «diversificado» automaticamente: depende do índice que se replica.'},
    {t:'decide',id:'q2',ensina:['p3','p5','p6'],label:'Decide',q:'O que dizem, em geral, os estudos sobre fundos de gestão ativa em períodos longos, depois de custos?',o:['A maioria bate o índice','Todos batem o índice','A maioria fica atrás do índice'],c:2,why:'Depois de custos, a maioria dos fundos ativos fica abaixo do índice de referência em horizontes longos.'},
    {t:'decide',id:'q3',ensina:['p7','c1','p8'],label:'Decide',q:'Um fundo bateu o índice cinco anos seguidos. O que é mais prudente concluir?',o:['Que o gestor é um génio e vai continuar','Que, entre muitos fundos, alguns têm sequências assim só por sorte, e é preciso mais do que cinco anos para concluir','Que o índice é mau'],c:1,why:'Com muitos fundos, a sorte produz sequências vencedoras. O historial recente não garante o futuro.'},
    {t:'erro',id:'q4',ensina:['p1','u1','c2'],label:'Encontra o erro',q:'Uma destas afirmações está errada. Qual?',o:['Um ETF indexado replica um índice','A gestão ativa costuma cobrar custos mais altos','A gestão passiva exige prever o melhor momento para comprar','Vencer o mercado de forma consistente é difícil'],c:2,why:'A gestão passiva não tenta prever o momento: compra o mercado e fica.'},
    {t:'h',id:'h7b',x:'Se escolheres um fundo ativo, o que verificar'},
    {t:'p',id:'p10b',x:'Há quem queira, ainda assim, um gestor ativo, e isso não é irracional se souberes o que pagas. Faz quatro perguntas. <b>Quanto custa?</b> Soma o TER, as comissões de subscrição e de êxito, e compara com um ETF do mesmo mercado. <b>Quanto tempo de historial tem o gestor?</b> Menos de dez anos, com a mesma pessoa à frente, diz pouco. <b>Como se comportou nas quedas</b>, e não só nas subidas? <b>O que faz de diferente do índice?</b> Se a carteira é quase igual ao índice, mas cobra mais, estás a pagar por uma «cópia cara» (o que no meio se chama <i>closet indexing</i>). Se não tens boas respostas, o indexado é a escolha razoável.'},
    {t:'h',id:'h8',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      'Escolher um fundo pelo retorno dos últimos 1 a 3 anos.',
      'Achar que «ativo» é sempre melhor porque há uma pessoa a decidir por ti.',
      'Esquecer o viés de sobrevivência quando vês rankings de fundos.',
      'Achar que todos os fundos indexados são iguais: o índice, o TER e a réplica contam (vê «Escolher um ETF passo a passo»).',
      'Mudar de fundo ativo em fundo ativo, a perseguir o último campeão.']},
    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p11',x:'Os bancos portugueses vendem sobretudo fundos de gestão ativa, com custos geralmente mais altos do que os ETFs que se negoceiam em corretoras. Antes de subscreveres, olha para o TER e para as comissões de subscrição ou resgate no KID (vê «Custos e TER»). A alternativa de ETFs UCITS que replicam índices está descrita em «ETFs e diversificação: o que se compra em Portugal». A decisão fiscal sobre a venda é a mesma (vê «Mais-valias: quanto imposto pagas ao vender»).'},
    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'Passivo replica um índice a baixo custo; ativo tenta bater o índice a custo mais alto.',
      'Antes de custos, o investidor médio tem o retorno do mercado; depois de custos, o ativo médio fica atrás.',
      'Estudos mostram que a maioria dos fundos ativos perde para o índice em períodos longos.',
      'Sorte produz «estrelas»; o historial recente é mau critério.',
      'Núcleo indexado e pequena parte para ideias é um meio-termo razoável.',
      '«Indexado» não é sinónimo de «sem risco»: depende do índice.']}
  ], src:[] },


{ id:'fatores-smart-beta', topic:'carteira', o:7, title:'Fatores e smart beta: valor, momentum, qualidade, pequenas empresas', mins:8,
  lead:'Há características que, ao longo de décadas, parecem ter dado prémio a quem as manteve: empresas baratas, pequenas, em tendência ou de boa qualidade. Investir por «fatores» tenta captá-las de forma sistemática. Convém perceber a ideia, e sobretudo os seus limites, antes de pagar mais por ela.',
  blocks:[
    {t:'h',id:'h1',x:'Os ingredientes do prato'},
    {t:'p',id:'p1',x:'Quando lês o rótulo de um alimento, não vês só «bolo»: vês açúcar, farinha, gordura, proteínas. Dois bolos diferentes podem ter ingredientes parecidos. Uma carteira de ações também se pode decompor em «ingredientes». Em vez de perguntar «que empresas tenho?», perguntas «que características tenho?»: empresas baratas ou caras, pequenas ou grandes, que subiram ou desceram, sólidas ou frágeis. Essas características chamam-se <b>fatores</b>.'},
    {t:'p',id:'p2',x:'O primeiro fator é o próprio <b>mercado</b>: quando o mercado sobe, quase tudo sobe. É o que mede o beta (vê «Risco e retorno medidos: Sharpe, Sortino e afins»). Nos anos 90, dois professores americanos, Eugene Fama e Kenneth French, mostraram que, para além do mercado, duas características ajudavam a explicar os retornos das ações: o <b>tamanho</b> e o <b>valor</b>. Outros autores juntaram depois o <b>momentum</b>, a <b>qualidade</b> e a <b>baixa volatilidade</b>.'},
    {t:'h',id:'h2',x:'Os fatores mais conhecidos'},
    {t:'cmp',id:'c1',head:['Fator','O que é','Intuição para o prémio','Quando sofre'],rows:[
      ['Valor','Empresas baratas face ao que valem (PER baixo, preço baixo face ao valor contabilístico)','Pagam mais a quem aguenta empresas pouco populares ou em dificuldades','Quando o mercado premeia o crescimento, durante anos'],
      ['Tamanho (pequenas empresas)','Empresas de menor valor de mercado','São mais arriscadas e menos acompanhadas, por isso esperava-se mais retorno','Em crises, em que as pequenas caem mais'],
      ['Momentum','Ações que subiram mais nos últimos 6 a 12 meses','As tendências persistem durante algum tempo, por reação lenta dos investidores','Em viragens bruscas do mercado'],
      ['Qualidade','Empresas rentáveis, com lucros estáveis e pouca dívida','Empresas sólidas tendem a resistir melhor, mas o mercado pode já pagá-las bem','Quando o mercado prefere empresas «baratas e fracas»'],
      ['Baixa volatilidade','Ações que oscilam menos do que o mercado','Menos risco sem perder retorno, o que contraria a teoria simples','Quando o mercado sobe depressa e com euforia']],
      cap:'Quadro qualitativo. Os prémios variam muito entre épocas e países.'},
    {t:'p',id:'p3',x:'Para o fator <b>valor</b>, o indicador mais simples é o PER, que já conheces (vê «PER e outros rácios»). O <b>momentum</b> é, de certa forma, o oposto: compra o que está a subir. Que ambos tenham sido, em épocas diferentes, associados a prémios, é um dos puzzles da investigação financeira.'},
    {t:'h',id:'h3',x:'O que é «smart beta»'},
    {t:'p',id:'p4',x:'<b>Smart beta</b> (em português, «beta inteligente») é o nome dado a ETFs que seguem regras para inclinar a carteira para um ou mais fatores, em vez de replicar o mercado inteiro proporcionalmente ao tamanho das empresas. «Beta» porque segue regras e não um gestor; «smart» porque as regras tentam ser mais espertas do que a ponderação clássica. Ficam algures entre a gestão passiva e a ativa: a regra é fixa e pública, mas há uma escolha por trás.'},
    {t:'ul',id:'u1',x:[
      '<b>Ponderação igual:</b> todas as empresas pesam o mesmo. Dá mais peso às pequenas do que o índice normal.',
      '<b>ETF de valor, de qualidade, de momentum, de baixa volatilidade:</b> filtram e ponderam ações segundo o fator.',
      '<b>Multifator:</b> combinam vários fatores num só produto, para reduzir o risco de um falhar.',
      '<b>ETF de pequenas empresas:</b> expõe só ao tamanho.']},
    {t:'h',id:'h4',x:'A parte desconfortável: o prémio não é certo'},
    {t:'p',id:'p5',x:'Um fator pode ter dado, em média, um prémio de 2% ao ano sobre o mercado, mas com um desvio-padrão da diferença (o chamado <i>tracking error</i>, a distância ao mercado) de 5% ao ano. Parece bom. Mas vê quantas vezes perde, com estes números de exemplo (e a suposição, simplificadora, de retornos regulares e independentes):'},
    {t:'cmp',id:'c2',head:['Prazo','Probabilidade de o fator ficar atrás do mercado'],rows:[1,3,5,10,20].map(n=>[n===1?'1 ano':n+' anos',_ca_f(_ca_pLose(n),0)+'%']),
      cap:'Exemplo: prémio de '+_ca_prem+'% ao ano e tracking error de '+_ca_te+'%. Cálculo com distribuição normal; é uma aproximação.'},
    {t:'p',id:'p6',x:'Mesmo com um prémio real, há cerca de <b>'+_ca_f(_ca_pLose(5),0)+'%</b> de probabilidade de o fator perder para o mercado durante cinco anos seguidos. E para ter confiança estatística de que o prémio existe (um «t» de 2), seriam precisos cerca de <b>'+_ca_f(_ca_yrs,0)+' anos</b> de dados. É por isso que muita gente abandona os fatores no pior momento, e perde o prémio que procurava.'},
    {t:'stat',id:'s1',v:Math.round(_ca_pLose(5)),fmt:'pct',label:'Probabilidade de o fator de exemplo perder durante 5 anos seguidos (arredondada)'},
    {t:'fazve',id:'q1',ensina:['p5','c2','p6'],q:'No exemplo (prémio de 2% e tracking error de 5%), aproximadamente quantos anos de dados são precisos para ter confiança estatística (t = 2) no prémio? (usa a fórmula (2 × 5 ÷ 2)²)',unit:'anos',answer:_ca_yrs,tol:.02,why:'O número de anos é (2 × tracking error ÷ prémio)² = (2 × 5 ÷ 2)² = 25 anos. Com poucos anos, não se distingue prémio real de sorte.'},
    {t:'h',id:'h5',x:'Um caso real: a década em que o valor perdeu'},
    {t:'p',id:'p7',x:'Durante grande parte dos anos 2010, as ações de «crescimento», sobretudo tecnológicas, venceram com larga margem as ações «de valor». Quem tinha uma inclinação para o valor viu a sua carteira ficar atrás do mercado durante muito tempo, e muitos desistiram. Em 2022, com a subida das taxas de juro, o valor voltou a ganhar terreno. Mostra os dois lados do tema: os fatores podem ter fases de uma década inteira em que parecem não funcionar, e é nesse tempo que se testa o investidor.'},
    {t:'h',id:'h6',x:'Porque é que o prémio pode existir, ou desaparecer'},
    {t:'ul',id:'u2',x:[
      '<b>Compensação pelo risco.</b> Empresas «baratas» e pequenas podem ser, de facto, mais arriscadas, e o prémio é a recompensa por aguentar esse risco.',
      '<b>Comportamento dos investidores.</b> Excesso de entusiasmo com o que está na moda e desprezo pelo que está fora dela cria padrões que outros podem aproveitar.',
      '<b>Estrutura do mercado.</b> Alguns investidores não podem ou não querem comprar certas empresas.',
      '<b>Mas também:</b> prémios descobertos no passado tendem a diminuir depois de se tornarem conhecidos, porque mais dinheiro os persegue. E parte do que parece prémio é produto de procurar padrões nos dados até encontrar algum, e isso não se repete.']},
    {t:'h',id:'h7',x:'O que custa e o que pensar antes de entrar'},
    {t:'ul',id:'u3',x:[
      '<b>Custos.</b> Os ETFs de fatores costumam cobrar mais do que os ETFs de mercado (vê «Custos e TER»), e rodam mais a carteira, o que acrescenta custos de transação.',
      '<b>Prazo e paciência.</b> Sem 10 a 20 anos de disciplina, a probabilidade de te arrependeres é alta.',
      '<b>Dimensão.</b> Um fator em pequena percentagem da carteira não muda muito o resultado, e um muito grande concentra risco.',
      '<b>Complexidade.</b> Mais uma peça para acompanhar e rebalancear.',
      '<b>Alternativa simples.</b> Um ETF largo de ações globais já inclui, ponderado ao mercado, empresas de todos os tamanhos e estilos.']},
    {t:'decide',id:'q2',ensina:['p1','p2','c1'],label:'Decide',q:'Que fator procura ações que subiram mais nos últimos meses, apostando que a tendência continua?',o:['Valor','Qualidade','Momentum'],c:2,why:'O momentum compra o que subiu recentemente, partindo da ideia de que as tendências persistem durante algum tempo.'},
    {t:'decide',id:'q3',ensina:['p5','p6','c2','p7'],label:'Decide',q:'Um ETF de fator rendeu menos do que o mercado nos últimos três anos. Qual é a leitura mais sensata?',o:['O fator deixou de existir e é preciso vender já','Três anos é pouco para tirar conclusões: mesmo com prémio real, o fator pode perder durante vários anos','Os fatores nunca funcionam'],c:1,why:'Com a volatilidade típica, é normal um fator ficar atrás do mercado durante vários anos seguidos, mesmo existindo prémio a longo prazo.'},
    {t:'erro',id:'q4',ensina:['u2','u3','p6'],label:'Encontra o erro',q:'Uma destas afirmações está errada. Qual?',o:['Os fatores podem ter fases longas em que parecem não funcionar','Prémios conhecidos podem diminuir depois de se tornarem populares','Um ETF de fatores garante bater o mercado','Os ETFs de fatores costumam custar mais do que os de mercado'],c:2,why:'Não há garantia nenhuma de bater o mercado. Os fatores são uma aposta de longo prazo com períodos longos de perda.'},
    {t:'h',id:'h8',x:'Os erros que mais custam'},
    {t:'ul',id:'u4',x:[
      'Comprar o fator que mais rendeu nos últimos anos, o que normalmente é comprar depois da subida.',
      'Abandonar um fator depois de dois ou três anos fracos.',
      'Pagar muito mais do que num ETF de mercado sem ter percebido o que se obtém.',
      'Misturar muitos ETFs de fatores até recriar o mercado, com mais custos.',
      'Julgar que um fator é uma «proteção» e esquecer que continua a ter risco de mercado.']},
    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p8',x:'Os ETFs UCITS de fatores (valor, momentum, qualidade, pequenas empresas, multifator) existem e podem comprar-se através de corretoras. Aplica-se aqui o que se aplica a qualquer ETF: confirma o índice replicado, o TER, o tamanho, a política de dividendos e o domicílio (vê «Escolher um ETF passo a passo» e «ETFs de acumulação e de distribuição»). Para quem começa, o mais simples costuma ser um ETF largo de ações globais; os fatores, se entrarem, são uma parte pequena. As mais-valias na venda seguem as regras gerais (vê «Mais-valias: quanto imposto pagas ao vender»).'},
    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u5',x:[
      'Fatores são características (valor, tamanho, momentum, qualidade, baixa volatilidade) associadas a prémios no passado.',
      'Smart beta são ETFs que seguem regras para inclinar a carteira para um ou mais fatores.',
      'Os prémios existem, em média, mas com fases longas de perda; não há garantias.',
      'Precisas de décadas e disciplina para colher um prémio de poucos pontos por ano.',
      'Custos e complexidade maiores do que num ETF de mercado.',
      'Se entrar, em pequena parte da carteira e depois de tratar do essencial.']}
  ], src:[] },


{ id:'escolher-etf', topic:'carteira', o:8, title:'Escolher um ETF passo a passo', mins:9,
  lead:'Dizer «quero um ETF global» ainda não chega: há centenas, e entre dois que parecem iguais há diferenças que custam dinheiro. Neste tema ficas com uma lista de verificação, por ordem, para comparar ETFs com critério e sem ficar à mercê de anúncios.',
  blocks:[
    {t:'h',id:'h1',x:'Ler o rótulo antes de comprar'},
    {t:'p',id:'p1',x:'Quando escolhes um iogurte, não olhas só para a embalagem bonita: lês o rótulo, vês o açúcar, o prazo, o preço ao quilo. Um ETF também tem um «rótulo»: um documento europeu chamado <b>KID</b> (documento de informações fundamentais), uma ficha do emissor e o prospeto. Quase tudo o que precisas para escolher está lá, se souberes o que procurar. Este tema é a tua lista de verificação, por ordem de importância.'},
    {t:'p',id:'p2',x:'Um ETF (<i>exchange-traded fund</i>) é um fundo que se compra e vende em bolsa como uma ação e que, na maioria dos casos, replica um índice (vê «ETFs e diversificação: o que se compra em Portugal»). Aqui não se indicam produtos: indicam-se critérios.'},
    {t:'h',id:'h2',x:'Passo 1: o índice que replica'},
    {t:'p',id:'p3',x:'É a decisão principal, porque define <b>o que compras</b>. Um índice «mundo» tem empresas de muitos países; um «S&P 500» tem as 500 maiores dos Estados Unidos; um «Europa» tem empresas europeias. Verifica o nome exato do índice: há versões que excluem países, ou que filtram por critérios ambientais e sociais, e isso muda o que compras. Lê também a <b>ponderação</b>: a maior parte pondera pelo tamanho das empresas, mas alguns ponderam por outros critérios (vê «Fatores e smart beta: valor, momentum, qualidade, pequenas empresas»).'},
    {t:'h',id:'h3',x:'Passo 2: o custo (TER) e a diferença de réplica'},
    {t:'p',id:'p4',x:'Entre ETFs que replicam o <b>mesmo índice</b>, o TER é o primeiro desempate (vê «Custos e TER»). Mas o TER não é o custo total: um ETF pode ficar atrás do índice mais do que o TER. A diferença entre o retorno do índice e o do ETF chama-se <b>tracking difference</b>. Se o índice rendeu 7,00% e o ETF 6,90%, a diferença foi de '+_ca_f(_ca_td,2)+' pontos. Procura essa diferença na ficha do produto, ao longo de vários anos, e prefere os que ficam muito perto.'},
    {t:'h',id:'h4',x:'Passo 3: tamanho e liquidez'},
    {t:'p',id:'p5',x:'O <b>tamanho</b> é o dinheiro total gerido pelo ETF (em inglês, <i>AUM</i>). ETFs muito pequenos podem ser encerrados pelo emissor por não serem rentáveis. Se isso acontecer, recebes o valor de volta, mas num momento que não escolheste, o que pode gerar mais-valias que não esperavas. Como regra de bolso, muita gente evita ETFs com poucas dezenas de milhões e prefere fundos com várias centenas de milhões, mas é uma regra de bolso, e não uma lei.'},
    {t:'p',id:'p6',x:'A <b>liquidez</b> é a facilidade de comprar e vender a bom preço. Vê o volume negociado e o <b>spread</b> (a diferença entre o preço de compra e de venda). Com um spread de 0,05%, comprar 1 000 € custa 0,50 € só nesta diferença, e voltar a vender custa outros 0,50 €. Com 0,50% de spread, seria 5 € por ordem. Spreads altos pesam especialmente em quem compra e vende com frequência.'},
    {t:'fazve',id:'q1',ensina:['p6'],q:'Um ETF tem spread de 0,10%. Compras 2 000 €. Quanto custa, em euros, só a diferença entre os preços de compra e de venda nessa compra?',unit:'€',answer:2000*.001,tol:.02,why:'0,10% de 2 000 € = 2 €. Se vendes mais tarde, paga-se outra vez uma diferença do mesmo tipo, daí que o custo de entrar e sair seja o dobro.'},
    {t:'h',id:'h5',x:'Passo 4: física ou sintética'},
    {t:'cmp',id:'c1',head:['Tipo de réplica','Como funciona','Vantagem','Atenção'],rows:[
      ['Física completa','O ETF compra todos os títulos do índice','Simples e transparente','Em índices enormes pode ser mais cara'],
      ['Física por amostragem','Compra uma seleção representativa','Mais barata em índices grandes','Pequena diferença face ao índice'],
      ['Sintética (swap)','O ETF não compra os títulos; um banco garante o retorno do índice através de um contrato','Pode acompanhar índices difíceis de replicar','Risco de contraparte: depende do banco (vê «Risco de emissor e de contraparte»)']],
      cap:'Os ETFs físicos são os mais comuns. Lê o prospeto para saber qual é o tipo e que garantias existem.'},
    {t:'p',id:'p7',x:'Para um primeiro ETF de ações globais, a réplica física é a escolha mais fácil de perceber. Os sintéticos não são «piores», mas exigem que percebas a contraparte. E há uma nuance nos físicos: alguns emprestam títulos a terceiros para ganhar uma pequena receita, o que traz um pequeno risco. O prospeto diz se o fazem e como se protege.'},
    {t:'h',id:'h6',x:'Passo 5: acumulação ou distribuição'},
    {t:'p',id:'p8',x:'Um ETF de <b>acumulação</b> reinveste os dividendos dentro do fundo; um de <b>distribuição</b> paga-os na tua conta. O retorno bruto é parecido, mas a gestão fiscal e a comodidade diferem. A tua escolha deve começar pelo que pretendes (crescer ou receber rendimento) e passar pelo tratamento fiscal em Portugal (vê «ETFs de acumulação e de distribuição» e «Dividendos e juros»).'},
    {t:'h',id:'h7',x:'Passo 6: domicílio e se é UCITS'},
    {t:'p',id:'p9',x:'O <b>domicílio</b> é o país onde o ETF está registado, muitas vezes a Irlanda ou o Luxemburgo. Importa por duas razões: a proteção do investidor (um ETF «UCITS» segue regras europeias de proteção e vem com o KID) e o tratamento fiscal dos dividendos dentro do fundo. Os ETFs americanos como o VOO ou o SPY não se compram a partir de Portugal. Para o S&P 500, por exemplo:'},
    {t:'pt',id:'pt1',pt:'sp500'},
    {t:'note',id:'n1',pending:true,x:'Retenção na fonte de dividendos americanos dentro de ETFs domiciliados na Irlanda (convenção Irlanda-EUA) e regime exato de ETFs UCITS face aos americanos (PRIIPs/KID): descrição baseada em fontes secundárias (justETF); falta confirmar em fonte oficial (ESMA, CMVM, AT).'},
    {t:'h',id:'h8',x:'Passo 7: moeda e cobertura cambial'},
    {t:'p',id:'p10',x:'Vê em que moeda o ETF é negociado e se há cobertura cambial. O mesmo ETF pode existir em euros, em dólares e em libras. Comprar a versão em euros evita fazer câmbio na corretora, mas não elimina o risco cambial do que o ETF detém (vê «Risco cambial, de liquidez e de inflação»). Se existir a versão «hedged» (coberta), tem custos ligeiramente superiores.'},
    {t:'h',id:'h9',x:'Passo 8: o emissor e a corretora'},
    {t:'p',id:'p11',x:'Prefere gestoras com historial longo e boa dimensão. E não te esqueças da <b>corretora</b>: nem todas oferecem todos os ETFs; as comissões, o câmbio e a custódia variam (vê «Banco ou corretora?», «Comissões e imposto do selo» e «Sistema de Indemnização aos Investidores»). Confirma sempre que a corretora está autorizada (vê «Burlas e a lista da CMVM»).'},
    {t:'h',id:'h10',x:'A lista de verificação, num quadro'},
    {t:'cmp',id:'c2',head:['Critério','O que verificar','Onde ver'],rows:[
      ['Índice','Nome exato, regiões, ponderação','KID e ficha do emissor'],
      ['TER e tracking difference','Custo anual e diferença face ao índice','KID e ficha do emissor'],
      ['Tamanho','Dinheiro gerido; dimensão acima de dezenas de milhões','Ficha do emissor'],
      ['Liquidez','Volume e spread na bolsa onde vais comprar','Ecrã da corretora'],
      ['Réplica','Física ou sintética; empréstimo de títulos','Prospeto'],
      ['Acumulação ou distribuição','O que acontece aos dividendos','Nome do ETF e ficha'],
      ['Domicílio e UCITS','País de registo; se é UCITS','Ficha e KID'],
      ['Moeda e cobertura','Moeda de negociação; se há versão coberta','Ficha'],
      ['Corretora','Disponibilidade, comissões, câmbio, custódia','Tabela de preços']]},
    {t:'h',id:'h11',x:'Um exemplo de comparação, com ETFs fictícios'},
    {t:'p',id:'p12',x:'Imagina três ETFs fictícios que replicam o mesmo índice mundial. Comparamos o que cada um dá ao fim de 20 anos com 10 000 € iniciais, 200 € por mês e 6% de retorno do índice antes de custos (considerando só o TER):'},
    {t:'cmp',id:'c3',head:['ETF (fictício)','TER','Réplica e tipo','Tamanho (milhões €)','Valor ao fim de 20 anos'],rows:_ca_etfv.map(e=>[e.n,_ca_f(e.t,2)+'%',e.k,_ca_f(e.s),_e(e.v)]),
      cap:'Valores de exemplo, para ilustrar o raciocínio. Não são produtos reais.'},
    {t:'p',id:'p13',x:'O ETF A é o mais barato e o maior. O B custa um pouco mais e distribui dividendos, o que pode ser útil a quem quer rendimento, mas obriga a gerir o reinvestimento. O C tem um TER muito mais alto, é pequeno e sintético: a diferença para o A, em 20 anos, é de '+_e(_ca_etfv[0].v-_ca_etfv[2].v)+'. Sem uma razão forte, o A seria o candidato.'},
    {t:'h',id:'h12',x:'Um caso real: o dia em que os ETFs tropeçaram'},
    {t:'p',id:'p14',x:'Em 24 de agosto de 2015, nos Estados Unidos, a abertura da bolsa foi caótica: muitos ETFs negociaram durante minutos a preços muito abaixo do valor das ações que continham, porque as paragens automáticas de negociação em algumas ações dificultaram a formação de preços. Quem tinha dado ordens «a mercado» vendeu a preços absurdos. Aprendizagem prática: usa <b>ordens limite</b>, define o preço máximo que aceitas pagar ou o mínimo que aceitas receber (vê «Tipos de ordem»), e evita comprar ou vender nos primeiros minutos da sessão.'},
    {t:'decide',id:'q2',ensina:['c3','p13','p4'],label:'Decide',q:'Dois ETFs replicam exatamente o mesmo índice e têm dimensão e liquidez semelhantes. Um tem TER de 0,07% e outro de 0,45%. O que deves privilegiar, tudo o resto igual?',o:['O de 0,45%, por ser mais caro','O de 0,07%, por custar menos','Tanto faz'],c:1,why:'Replicando o mesmo índice, o retorno antes de custos é igual; o que custa menos deixa-te com mais.'},
    {t:'decide',id:'q3',ensina:['p5','p6'],label:'Decide',q:'Estás a escolher entre um ETF com 40 milhões em ativos e outro com 4 000 milhões, ambos com o mesmo índice e TER semelhante. Que risco acrescido tem o mais pequeno?',o:['Pode ser encerrado pelo emissor por não ser rentável','Nenhum risco adicional','Replica um índice diferente'],c:0,why:'ETFs pequenos têm maior probabilidade de encerramento, o que obriga a receber o dinheiro numa altura que não escolheste.'},
    {t:'erro',id:'q4',ensina:['p9','p10','c1'],label:'Encontra o erro',q:'Uma destas afirmações está errada. Qual?',o:['Um ETF em euros de ações americanas continua exposto ao dólar','Um ETF sintético depende de um banco como contraparte','O S&P 500 pode comprar-se em Portugal através do ETF americano VOO','Um ETF UCITS vem acompanhado de um KID'],c:2,why:'Os ETFs americanos como o VOO não se compram a partir de Portugal; há versões UCITS equivalentes.'},
    {t:'h',id:'h13',x:'Os erros que mais custam'},
    {t:'ul',id:'u1',x:[
      'Escolher pelo nome ou pelo retorno do último ano, sem ver o índice.',
      'Comparar só o TER e esquecer o tamanho, o spread e a diferença de réplica.',
      'Comprar um ETF «temático» pensando que é diversificado.',
      'Dar ordens «a mercado» em horas de grande volatilidade.',
      'Não confirmar se a corretora oferece o ETF concreto e a que custo.',
      'Misturar versões de acumulação e distribuição sem perceber as diferenças fiscais.']},
    {t:'h',id:'h14',x:'Em Portugal'},
    {t:'p',id:'p15',x:'Para um investidor em Portugal, o ponto de partida são os ETFs UCITS, com KID, que se compram através de corretoras ou de bancos com serviço de bolsa. As mais-valias na venda e os dividendos têm tratamento fiscal próprio (vê «Mais-valias: quanto imposto pagas ao vender», «Dividendos e juros» e «Declarar no IRS: Modelo 3, anexos G e J»). E antes de abrires conta, vê «Abrir conta: NIF, IBAN e KYC».'},
    {t:'h',id:'h15',x:'Em poucas palavras'},
    {t:'ul',id:'u2',x:[
      'Escolhe primeiro o índice, depois compara os ETFs que o replicam.',
      'O TER é o primeiro desempate, mas vê também a tracking difference.',
      'Tamanho e liquidez evitam encerramentos e spreads altos.',
      'Réplica física é mais simples; sintética exige perceber a contraparte.',
      'Acumulação ou distribuição, moeda e domicílio completam a lista.',
      'Verifica a corretora, e usa ordens limite.']}
  ], src:[] },


{ id:'plano-por-escrito', topic:'carteira', o:9, title:'O teu plano de investimento por escrito', mins:7,
  lead:'As melhores decisões de investimento tomam-se em dias calmos e executam-se em dias de pânico. Escrever um plano é a forma de fazer a primeira parte para que a segunda não dependa do teu humor. É curto, é teu, e vale mais do que qualquer previsão.',
  blocks:[
    {t:'h',id:'h1',x:'O mapa que levas para a montanha'},
    {t:'p',id:'p1',x:'Quem sobe uma serra com nevoeiro não decide o caminho no meio do nevoeiro: decidiu-o em casa, com o mapa aberto, e leva o mapa. Se o tempo piorar, segue o que combinou consigo próprio. Na bolsa o nevoeiro chama-se crise: notícias alarmantes, a carteira no vermelho, amigos a venderem. Nesse momento ninguém decide bem. O plano escrito é o mapa.'},
    {t:'p',id:'p2',x:'Na gestão profissional chama-se <i>Investment Policy Statement</i> (declaração de política de investimento). Para ti, é uma ou duas folhas que respondem a perguntas simples: para quê, quanto, quando, como e o que fazer quando as coisas correm mal. O mito de Ulisses explica a ideia: sabendo que não resistiria ao canto das sereias, mandou os marinheiros atá-lo ao mastro antes de chegar lá. O plano escrito é o mastro.'},
    {t:'h',id:'h2',x:'Porque é que escrever ajuda'},
    {t:'ul',id:'u1',x:[
      '<b>Obriga a pensar com clareza.</b> Muitas ideias vagas desfazem-se quando as tentas pôr em frases.',
      '<b>Tira a emoção do momento.</b> Se já decidiste o que fazes numa queda de 30%, não precisas de decidir a quente.',
      '<b>Evita as mudanças de rumo.</b> Quando um amigo diz que ganhou a comprar qualquer coisa, tens um critério para o ignorar.',
      '<b>Torna fácil rever.</b> Ao fim de um ano, comparas o que fizeste com o que prometeste.',
      '<b>Ajuda quem vem depois.</b> Se um dia outra pessoa tiver de gerir a carteira, perceberá a lógica.']},
    {t:'h',id:'h3',x:'As peças de um plano simples'},
    {t:'cmp',id:'c1',head:['Peça','Pergunta a que responde','Exemplo de resposta (ilustrativo)'],rows:[
      ['1. Objetivo e prazo','Para quê e para quando?','Reforma, daqui a 20 anos; casa daqui a 8'],
      ['2. Situação de partida','Reservas, dívidas, rendimento','Fundo de emergência de 6 meses feito; sem dívidas caras'],
      ['3. Perfil e limite de queda','Quanto posso perder sem mudar a vida?','Aguento −30% sem vender; não aguento −50%'],
      ['4. Alocação-alvo','Quanto em ações, obrigações, liquidez?','70% ações, 30% obrigações e liquidez'],
      ['5. Critérios de produtos','O que escolho, e porquê?','ETFs UCITS largos, de custo baixo, de acumulação'],
      ['6. Como e quando invisto','Quanto, com que frequência?','400 € por mês, no dia 5'],
      ['7. Rebalanceamento','Quando e como corrijo?','Uma vez por ano, ou se passar 5 pontos, com novas entregas'],
      ['8. Regras para quedas','O que faço se o mercado cair?','Não vendo; continuo as entregas; rebalanceio por limiar'],
      ['9. O que não faço','Que limites me imponho?','Sem alavancagem, sem day trading, sem produtos que não percebo'],
      ['10. Custos e impostos','O que pago e como declaro?','TER baixo; mais-valias e dividendos declarados no IRS'],
      ['11. Revisão','Quando volto a este papel?','Todos os anos em janeiro, ou se a vida mudar muito']],
      cap:'Exemplo fictício. As respostas são tuas; o que importa é teres respostas.'},
    {t:'h',id:'h4',x:'Um plano preenchido, com números'},
    {t:'p',id:'p3',x:'Imagina uma pessoa com 5 000 € para começar, que entrega 400 € por mês durante 20 anos. Supõe um retorno de exemplo de 5% ao ano. Ao fim dos 20 anos, o plano dá cerca de <b>'+_e(_ca_plan.total)+'</b>, dos quais '+_e(_ca_plan0)+' foram entregues pela própria pessoa e o resto são juros. Se o retorno for de apenas 3%, ficam '+_e(_ca_plan2.total)+'. É útil escrever as duas contas no plano: o cenário esperado e um cenário mau, para que o resultado mau não seja um choque.'},
    {t:'stat',id:'s1',v:Math.round(_ca_plan.total),label:'Valor do plano de exemplo ao fim de 20 anos, com 5% ao ano (arredondado)'},
    {t:'w',id:'w1',w:'compound',p:{initial:5000,monthly:400,rate:5,years:20}},
    {t:'fazve',id:'q1',ensina:['p3','w1'],q:'No plano de exemplo (5 000 € iniciais, 400 € por mês, 5% ao ano, 20 anos), quanto dinheiro entregou a própria pessoa ao todo, em euros?',unit:'€',answer:5000+400*240,tol:.01,why:'5 000 € + 400 € × 240 meses = 5 000 € + 96 000 € = 101 000 €. O resto do valor final são juros compostos.'},
    {t:'h',id:'h5',x:'As regras para quedas: «se acontecer isto, faço aquilo»'},
    {t:'p',id:'p4',x:'A parte mais valiosa de um plano é a das <b>regras de «se... então»</b>. Escreve-as antes. Por exemplo:'},
    {t:'ul',id:'u2',x:[
      '<b>Se a carteira cair 20%:</b> não vendo; confirmo que o fundo de emergência está intacto; continuo as entregas.',
      '<b>Se cair 35% ou mais:</b> reviso o plano com calma ao fim de uma semana; só mudo a alocação se a minha vida tiver mudado, e não por causa do mercado.',
      '<b>Se sair uma notícia alarmante:</b> espero 48 horas antes de qualquer decisão.',
      '<b>Se alguém me der uma dica quente:</b> a regra é pôr, no máximo, 5% da carteira, ou nada.',
      '<b>Se uma classe passar 5 pontos do alvo:</b> rebalanceio com as novas entregas.']},
    {t:'p',id:'p5',x:'Estas regras funcionam porque transformam uma decisão emocional («o que faço agora?») numa decisão mecânica («o que escrevi?»).'},
    {t:'h',id:'h6',x:'Um caso real: março de 2020'},
    {t:'p',id:'p6',x:'Em fevereiro e março de 2020, a pandemia fez as bolsas mundiais caírem mais de 30% em poucas semanas, a queda mais rápida em muito tempo. Muitos investidores venderam em pânico perto do fundo. Os mercados recuperaram nos meses seguintes, e quem vendeu fixou a perda e perdeu a recuperação. Os que tinham um plano escrito, com regras do tipo «não vendo numa queda» e um fundo de emergência separado, tiveram uma tarefa muito mais fácil: abrir o plano e fazer o que lá estava.'},
    {t:'h',id:'h7',x:'Como o escrever, em cinco passos'},
    {t:'ul',id:'u3',x:[
      '<b>Pega numa folha</b> (ou num documento) e copia as 11 peças do quadro.',
      '<b>Responde com números concretos</b>, sem vaguezas: «70% ações» e não «uma boa parte».',
      '<b>Mostra o plano a alguém</b> de confiança, por exemplo o pai: explicar em voz alta revela buracos.',
      '<b>Guarda uma cópia</b> num sítio a que voltas facilmente, e marca a revisão anual no calendário.',
      '<b>Revê só quando a vida muda</b> (emprego, filhos, casa, saúde) ou na data marcada, nunca por causa de uma manchete.']},
    {t:'h',id:'h8',x:'O que o plano não é'},
    {t:'p',id:'p7',x:'Não é uma previsão: ninguém sabe o que vai acontecer no mercado. Não é um contrato com terceiros nem um produto financeiro. E não é imutável: serve para te proteger de decisões impulsivas, não de decisões ponderadas. Se a tua vida muda (casamento, desemprego, uma herança), o plano muda, e muda com calma.'},
    {t:'decide',id:'q2',ensina:['p4','u2','p5','p6'],label:'Decide',q:'O mercado cai 25% em duas semanas, e vês notícias alarmantes por todo o lado. O que diz o teu plano escrito que deves fazer?',o:['Vender tudo, para evitar mais perdas','Seguir o que escreveste antes: manter, confirmar o fundo de emergência e continuar as entregas','Mudar de carteira para o que está a subir'],c:1,why:'O plano existe para que a decisão não seja tomada a quente. Seguir as regras escritas é exatamente o que ele pede.'},
    {t:'decide',id:'q3',ensina:['c1','p7'],label:'Decide',q:'Quando faz sentido mudar o plano?',o:['Sempre que o mercado cai ou sobe muito','Quando a tua vida muda (emprego, família, objetivos) ou na revisão anual marcada','Quando um amigo tem uma ideia nova'],c:1,why:'O plano muda por razões da tua vida, não por causa do humor do mercado. Mudar a cada notícia derrota o propósito de o ter escrito.'},
    {t:'erro',id:'q4',ensina:['h2','u1','p7'],label:'Encontra o erro',q:'Uma destas afirmações está errada. Qual?',o:['O plano ajuda a decidir com calma em vez de a quente','Um plano escrito dispensa qualquer revisão ao longo da vida','O plano deve ter números concretos','As regras «se... então» funcionam porque tiram a emoção do momento'],c:1,why:'O plano deve ser revisto quando a vida muda e uma vez por ano. Um plano que nunca se revê deixa de servir.'},
    {t:'h',id:'h9',x:'Os erros que mais custam'},
    {t:'ul',id:'u4',x:[
      'Não escrever e confiar na memória e na coragem do momento.',
      'Escrever respostas vagas, sem números nem datas.',
      'Fazer um plano e ignorá-lo na primeira crise.',
      'Esquecer o fundo de emergência e as dívidas na peça «situação de partida».',
      'Copiar o plano de outra pessoa: o teu prazo e a tua capacidade são outros.']},
    {t:'h',id:'h10',x:'Em Portugal'},
    {t:'p',id:'p8',x:'No plano, junta as peças que são específicas de Portugal: onde guardas os investimentos (banco ou corretora, vê «Banco ou corretora?»), como declaras no IRS (vê «Declarar no IRS: Modelo 3, anexos G e J»), se usas um PPR (vê «PPR ou investir por conta própria») e quem tem acesso em caso de doença ou morte (vê «Contas conjuntas e herança»). As mais-valias de ações e ETFs são tributadas à taxa autónoma de 28% sobre o saldo anual positivo (verificado em 17/11/2026 no artigo 72.º do Código do IRS, no Portal das Finanças); deixa isso escrito, para planeares as vendas. Para fixar o objetivo, vê também «Objetivos e horizonte temporal».'},
    {t:'h',id:'h11',x:'Em poucas palavras'},
    {t:'ul',id:'u5',x:[
      'Um plano escrito faz as decisões difíceis em dias calmos para as executares em dias de pânico.',
      'Responde a: para quê, quanto, quando, como e o que fazer nas crises.',
      'As regras «se... então» são a parte mais valiosa.',
      'Usa números concretos e escreve um cenário mau além do esperado.',
      'Revê uma vez por ano ou quando a vida muda, nunca por causa de manchetes.',
      'Mostra-o a alguém de confiança e guarda-o onde o vás reencontrar.']}
  ], src:[_AT_72] }
);

// ---- Investimento sustentável (acrescentada em 17/11/2026) ----
// Valor de 10 000 € ao fim de 20 anos a 6% brutos, menos o TER
const _esg_v=ter=>10000*Math.pow(1.06-ter,20);
const _esg_sfdr={l:'EUR-Lex: Regulamento (UE) 2019/2088 (SFDR), art. 2.º, ponto 17, e art. 8.º e 9.º (verificado em 17/11/2026)',u:'https://eur-lex.europa.eu/legal-content/PT/TXT/?uri=CELEX:32019R2088'};
const _esg_esma={l:'ESMA: orientações sobre nomes de fundos com termos ESG ou de sustentabilidade',u:'https://www.esma.europa.eu/press-news/esma-news/esma-publishes-guidelines-funds-names-using-esg-or-sustainability-related-terms'};

LRN.push(
{ id:'esg', topic:'carteira', o:7.5, title:'Investimento sustentável: ESG, SFDR e greenwashing', mins:8,
  lead:'Muitos fundos dizem-se «sustentáveis», «verdes» ou «ESG». Às vezes é verdade, às vezes é só o nome. Aqui vês o que estas palavras querem dizer, como a UE classifica os fundos, o que isso muda no risco e no retorno, e como não ser enganado.',
  blocks:[
    {t:'h',id:'h0',x:'Uma imagem para perceber'},
    {t:'p',id:'p0',x:'No supermercado, «bio» tem regras e um selo; «natural» quase não quer dizer nada. Com os fundos é parecido. Há palavras com regras por trás e palavras de marketing. Investir de forma sustentável pode ser uma escolha legítima, por valores ou por convicção sobre riscos futuros. O problema é pagar por uma etiqueta que não corresponde ao que está dentro.'},
    {t:'h',id:'h1',x:'O que quer dizer ESG'},
    {t:'ul',id:'u1',x:[
      '<b>E, ambiental:</b> emissões, consumo de energia e água, poluição, biodiversidade.',
      '<b>S, social:</b> condições de trabalho, segurança dos produtos, relação com clientes e comunidades.',
      '<b>G, governo da sociedade:</b> independência da administração, salários dos gestores, contabilidade, corrupção, direitos dos acionistas.']},
    {t:'p',id:'p1',x:'Empresas como a MSCI e a Sustainalytics dão notas ESG às empresas. Essas notas <b>discordam muito umas das outras</b>: um estudo do MIT de 2022 («Aggregate Confusion», de Berg, Kölbel e Rigobon) encontrou correlações entre agências de apenas cerca de 0,4 a 0,7, muito abaixo das notas de crédito, que quase sempre concordam. A mesma empresa pode ser «boa» numa agência e «média» noutra. Ou seja, «ESG» depende de quem mede e de como mede.'},
    {t:'h',id:'h2',x:'As formas de investir de modo sustentável'},
    {t:'cmp',id:'c1',head:['Abordagem','O que faz','Exemplo'],rows:[
      ['Exclusão','Retira setores ou empresas da carteira','Sem tabaco, armas ou carvão'],
      ['Melhores do setor','Fica só com as empresas com melhor nota em cada setor','As petrolíferas com menos emissões'],
      ['Integração','Usa os dados ESG como mais um fator de risco na análise','Um gestor que penaliza más práticas de governo'],
      ['Temático','Investe num tema ligado à sustentabilidade','Energias renováveis, água'],
      ['Impacto','Procura um efeito medível, além do retorno','Financiar habitação social'],
      ['Envolvimento e voto','Fica com as ações e pressiona a empresa nas assembleias','Votar contra salários excessivos']],
      cap:'Muitos fundos combinam várias abordagens. Lê a política do fundo.'},
    {t:'h',id:'h3',x:'Como a UE classifica os fundos: o SFDR'},
    {t:'p',id:'p2',x:'Desde março de 2021, o <b>Regulamento (UE) 2019/2088</b>, conhecido por SFDR, obriga os gestores a dizer como tratam a sustentabilidade. Na prática, os fundos dividem-se em três grupos, pelo artigo do regulamento que cumprem:'},
    {t:'cmp',id:'c2',head:['Grupo','O que o fundo diz','Como ler'],rows:[
      ['Artigo 6.º','Não promove características ambientais ou sociais','Um fundo comum; tem de explicar como trata os riscos de sustentabilidade'],
      ['Artigo 8.º','Promove, entre outras, características ambientais ou sociais','Grupo muito largo: vai de exclusões leves a políticas exigentes'],
      ['Artigo 9.º','Tem como objetivo investimentos sustentáveis','O grupo mais exigente; os investimentos têm de caber na definição do regulamento']],
      cap:'A definição de «investimento sustentável» está no art. 2.º, ponto 17, do regulamento.'},
    {t:'p',id:'p3',x:'O ponto mais importante: o SFDR é um regime de <b>divulgação</b>, não um selo de qualidade. Ninguém aprova o fundo como «verde». O gestor escolhe o artigo e explica-se nos documentos. Um fundo do artigo 8.º pode ser quase igual a um índice comum com meia dúzia de exclusões.'},
    {t:'note',id:'n1',pending:true,x:'A ESMA publicou em 2024 orientações para os nomes dos fundos: um fundo com termos ESG ou de sustentabilidade no nome deve ter pelo menos 80% dos investimentos alinhados com o que promete, e cumprir certas exclusões. Encontrámos o limiar e as datas só em fontes secundárias; confirma no site da ESMA.'},
    {t:'note',id:'n2',pending:true,x:'Desde 2022, os bancos e consultores que te aconselham têm de te perguntar pelas tuas preferências de sustentabilidade, como parte da avaliação de adequação. Não confirmámos a data e o enquadramento em fonte oficial.'},
    {t:'h',id:'h4',x:'E o retorno? Ganha-se ou perde-se?'},
    {t:'p',id:'p4',x:'Não há resposta garantida, e desconfia de quem diz que há. Um fundo sustentável é um fundo com regras de exclusão ou de escolha, e por isso fica <b>diferente do mercado</b>: com menos de uns setores e mais de outros. Isso faz com que ganhe mais em uns anos e menos noutros. Em 2022, com a guerra na Ucrânia e a subida do preço da energia, as petrolíferas subiram muito enquanto a bolsa mundial caiu, e muitos fundos ESG, com pouca energia e muita tecnologia, ficaram atrás do índice. Noutros anos aconteceu o contrário.'},
    {t:'p',id:'p5',x:`O que podes controlar são os custos. Valores de exemplo: 10 000 € a 6% ao ano durante 20 anos. Com um ETF de custos de 0,12% ao ano ficas com ${_e(_esg_v(0.0012))}; com um fundo ESG de 0,25% ficas com ${_e(_esg_v(0.0025))}; com um fundo ativo «verde» de 1,5% ficas com ${_e(_esg_v(0.015))}. Muitas versões ESG de índices globais custam pouco mais do que as normais; muitos fundos temáticos custam muito mais.`},
    {t:'cmp',id:'c3',head:['Custo anual (TER)','Valor ao fim de 20 anos','Diferença para 0,12%'],rows:[0.0012,0.0025,0.005,0.015].map(t=>[(t*100).toLocaleString('pt-PT')+'%',_e(_esg_v(t)),_e(_esg_v(t)-_esg_v(0.0012))]),
      cap:'10 000 € a 6% brutos ao ano, valores de exemplo, sem impostos.'},
    {t:'h',id:'h5',x:'Greenwashing: um caso real'},
    {t:'p',id:'p6',x:'<b>Greenwashing</b> é apresentar um produto como mais sustentável do que é. Em 2022, a polícia e o Ministério Público de Frankfurt fizeram buscas na DWS, a gestora de fundos do Deutsche Bank, depois de uma antiga responsável pela sustentabilidade ter dito que a empresa exagerava as credenciais ESG dos seus fundos. O presidente executivo demitiu-se, e em 2023 a DWS pagou multas nos Estados Unidos e, mais tarde, na Alemanha. Se uma das maiores gestoras da Europa foi apanhada, o nome de um fundo não chega como prova.'},
    {t:'h',id:'h6',x:'Como verificar um fundo'},
    {t:'ul',id:'u2',x:[
      'Vê o artigo do SFDR no documento de informação e no site do gestor.',
      'Lê a secção de divulgações relacionadas com a sustentabilidade: o que é excluído, com que limites, e que parte da carteira cumpre o que promete.',
      'Abre a lista de posições. As maiores posições são o que esperavas encontrar?',
      'Compara o custo com a versão não ESG do mesmo índice.',
      'Vê o índice que o fundo segue: «ESG Screened», «ESG Leaders», «SRI» e «Paris-Aligned» são regras diferentes, do mais leve ao mais exigente.']},
    {t:'h',id:'h7',x:'Os erros que mais custam'},
    {t:'ul',id:'u3',x:[
      'Acreditar no nome ou na cor do folheto sem ler a política do fundo.',
      'Achar que artigo 8.º quer dizer «verde».',
      'Esperar que o fundo sustentável renda sempre mais, ou sempre menos.',
      'Pagar 1,5% ao ano por um tema da moda e concentrar tudo num setor.',
      'Trocar uma carteira diversificada por vários fundos temáticos que se sobrepõem.']},
    {t:'h',id:'h8',x:'Em Portugal'},
    {t:'p',id:'p7',x:'Nas corretoras e nos bancos portugueses encontras ETFs UCITS com versões ESG dos grandes índices globais, além de fundos de gestoras portuguesas e estrangeiras com classificação de artigo 8.º ou 9.º. A classificação aparece no documento de informação fundamental e nas divulgações de sustentabilidade do fundo. Os impostos são os mesmos de qualquer fundo ou ETF: ser sustentável não dá benefício fiscal. Se o banco te aconselhar, pode perguntar pelas tuas preferências de sustentabilidade; podes responder que não tens nenhuma.'},
    {t:'h',id:'h9',x:'Em poucas palavras'},
    {t:'ul',id:'u4',x:[
      'ESG avalia o ambiente, o lado social e o governo das empresas, e as notas variam muito de agência para agência.',
      'O SFDR divide os fundos em artigos 6.º, 8.º e 9.º; é divulgação, não um selo.',
      'Um fundo sustentável fica diferente do mercado: ganha em uns anos e perde noutros.',
      'O que controlas é o custo e se o fundo cumpre o que diz.',
      'Verifica as posições e as divulgações; o nome não chega.']},
    {t:'decide',id:'q1',ensina:['p3','c2'],label:'Decide',q:'Um fundo diz que é «artigo 8.º». O que podes concluir?',o:['Que foi aprovado como fundo verde pela UE','Que promove características ambientais ou sociais, e que tens de ler o que isso quer dizer neste fundo','Que só investe em energias renováveis'],c:1,why:'O SFDR é divulgação: o artigo 8.º é um grupo largo, e o que conta é a política concreta do fundo.'},
    {t:'fazve',id:'q2',ensina:['p5','c3'],q:'10 000 € a 6% brutos ao ano, durante 20 anos. Quanto a mais tens com um TER de 0,12% do que com um de 1,5%, em €? (arredonda às unidades)',unit:'€',answer:Math.round(_esg_v(0.0012)-_esg_v(0.015)),tol:.03,why:'Com 0,12% a taxa líquida é 5,88% ao ano; com 1,5% é 4,5%. Em 20 anos, a diferença é de vários milhares de euros.'},
    {t:'erro',id:'q3',ensina:['p1','p4'],label:'Encontra o erro',q:'Uma destas frases está errada. Qual?',o:['As notas ESG variam muito entre agências','Um fundo ESG fica diferente do índice normal','Um fundo ESG rende sempre mais, porque as empresas sustentáveis são melhores','Em 2022 muitos fundos ESG ficaram atrás do índice'],c:2,why:'Não há garantia: um fundo com regras diferentes do mercado ganha em uns anos e perde noutros.'},
    {t:'decide',id:'q4',ensina:['p6','u2'],label:'Decide',q:'Encontras um fundo chamado «Planeta Verde» com custos de 1,8% ao ano. O que fazes primeiro?',o:['Compro: o nome diz tudo','Vejo o artigo do SFDR, as maiores posições e comparo o custo com alternativas','Escolho-o porque é mais caro, logo é melhor gerido'],c:1,why:'O caso da DWS mostra que o nome não chega. Verifica o que está dentro e quanto custa.'}
  ], src:[_esg_sfdr,_esg_esma,_CMVM] }
);
