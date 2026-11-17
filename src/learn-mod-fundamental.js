// ================= Aprender: módulo «fundamental» =================
// Regras de Portugal só com fonte oficial (campo `src`); o que não ficou confirmado leva `pending:true` («Por confirmar»).
// Todas as empresas deste módulo são fictícias; os números são valores de exemplo, calculados aqui para nunca divergirem do texto.

const _fu_n=(x,d=1)=>Number(x).toLocaleString('pt-PT',{minimumFractionDigits:d,maximumFractionDigits:d});
const _fu_M=(x,d=1)=>_fu_n(x,d)+' M€';
const _fu_p=(x,d=1)=>_fu_n(x,d)+'%';
const _fu_r=(x,d=1)=>+Number(x).toFixed(d);

// Conservas do Atlântico (empresa de exemplo, valores em milhões de euros)
const _fu_A=(()=>{
  const vendas=10, custo=6.2, opex=2.6, dep=0.4, juros=0.2, taxa=0.25, acoes=1;
  const bruta=vendas-custo, ebit=bruta-opex, antes=ebit-juros, imp=antes*taxa, lucro=antes-imp;
  const caixa=1.0, clientes=1.5, exist=1.5, fixos=8.0, ativo=caixa+clientes+exist+fixos;
  const divida=4.0, forn=1.5, outras=0.5, passivo=divida+forn+outras, cp=ativo-passivo;
  const dWC=0.15, cfo=lucro+dep-dWC, capex=0.6, divid=0.25, amort=0.1, fin=-(divid+amort), var_=cfo-capex+fin;
  return {vendas,custo,opex,dep,juros,taxa,acoes,bruta,ebit,antes,imp,lucro,caixa,clientes,exist,fixos,ativo,divida,forn,outras,passivo,cp,dWC,cfo,capex,divid,amort,fin,var_,
    mBruta:bruta/vendas*100,mOp:ebit/vendas*100,mLiq:lucro/vendas*100,roe:lucro/cp*100,lpa:lucro/acoes,retido:lucro-divid};
})();
// Tecelagem do Vale: lucro bom, caixa má
const _fu_B=(()=>{
  const vendas=8, lucro=0.5, dep=0.3, cli0=1.0, cli1=2.2, vendas0=7, dWC=cli1-cli0, cfo=lucro+dep-dWC;
  return {vendas,lucro,dep,cli0,cli1,vendas0,dWC,cfo,dso0:cli0/vendas0*365,dso1:cli1/vendas*365};
})();
const _fu_a=_fu_A, _fu_b=_fu_B;
// Metalúrgica Serra (S) e Imobiliária Costa Azul (C): ambas com 30 M€ de ativo; Q = exemplo das perguntas
const _fu_bal=(cx,cli,ex,anc,forn,dcp,dlp,ebit,juros,ebitda)=>{ const ac=cx+cli+ex, pc=forn+dcp, ativo=ac+anc, div=dcp+dlp, cp=ativo-pc-dlp, dl=div-cx;
  return {cx,cli,ex,anc,forn,dcp,dlp,ebit,juros,ebitda,ac,pc,ativo,div,cp,dl,lc:ac/pc,lr:(cx+cli)/pc,aut:cp/ativo*100,dce:div/cp,dlE:dl/ebitda,cob:ebit/juros}; };
const _fu_S=_fu_bal(2,3,4,21,3,3,7,3.5,0.4,5);
const _fu_C=_fu_bal(0.5,2,3.5,24,3,7,12,2.6,1.3,4);
const _fu_Q={ac:9,pc:12,div:18,cx:3,eb:5};
// Fluxo de caixa livre: Software Lisboa (sl) e Cimentos do Sul (cs), ambas a valer 200 M€; q = exemplo das perguntas
const _fu_f=(lucro,dep,wc,capex,div)=>{ const cfo=lucro+dep+wc, fcf=cfo-capex; return {lucro,dep,wc,capex,div,cfo,fcf,conv:fcf/lucro*100,per:200/lucro,yld:fcf/200*100,fcfM:cfo-dep,yldM:(cfo-dep)/200*100}; };
const _fu_F={sl:_fu_f(10,1.5,-0.5,1,4),cs:_fu_f(10,9,-1,17,6),q:{cfo:12,capex:5,cap:150,fcf:9}};
// Dividendos: Energias do Tejo (D); Moat: Cerveja Rocha e Aço Comum (V)
const _fu_D=(()=>{ const preco=30,lpa=3,div=1.2,fcf=2,preco2=15,lpa2=1,
  bb={acoes:100,preco:20,lucro:300,gasto:100}; bb.rec=bb.gasto/bb.preco; bb.sobe=((bb.lucro/(bb.acoes-bb.rec))/(bb.lucro/bb.acoes)-1)*100;
  const imp={n:1000}; imp.bruto=imp.n*div; imp.ret=imp.bruto*.28; imp.liq=imp.bruto-imp.ret;
  return {preco,lpa,div,fcf,preco2,lpa2,yld:div/preco*100,payout:div/lpa*100,yld2:div/preco2*100,payout2:div/lpa2*100,rt:(preco+3-preco+div)/preco*100,bb,imp,
    rr:{pr:5,y:3,anos:20,sem:10000*Math.pow(1.05,20),com:10000*Math.pow(1.08,20)}}; })();
const _fu_V=(()=>{ const m=(roic,ms)=>({roic,m:ms,min:Math.min(...ms),max:Math.max(...ms),f10:100*Math.pow(1+roic/100,10)});
  return {cap:100,k:8,r:m(22,[25,26,24,25,26]),a:m(6,[12,4,9,-1,7]),q:{cap:50,roic:15,k:9}}; })();
// Avaliação (X), DCF (K) e leitura de contas (O)
const _fu_X=(()=>{ const lpa=2,perSetor=14,preco=21,v=lpa*perSetor,cen=[{v:15,p:25},{v:28,p:50},{v:40,p:25}], esp=cen.reduce((s,c)=>s+c.v*c.p/100,0);
  const l=[5]; for(let i=1;i<5;i++) l.push(l[i-1]*0.85);
  return {lpa,perSetor,preco,v,ms:(v-preco)/v*100,cen,esp,msEsp:(esp-preco)/esp*100,trap:{preco:25,l,queda:15},q:{v:40,p:28}}; })();
const _fu_dcf=(f0,g,n,r,gt,debt,sh)=>{ let pv=0,f=f0; const rows=[]; for(let t=1;t<=n;t++){ f*=1+g/100; const d=f/Math.pow(1+r/100,t); pv+=d; rows.push([t,f,d]); }
  const tv=f*(1+gt/100)/((r-gt)/100), pvtv=tv/Math.pow(1+r/100,n), ev=pv+pvtv; return {rows,pv,tv,pvtv,ev,eq:ev-debt,ps:(ev-debt)/sh,tvShare:pvtv/ev}; };
const _fu_K=(()=>{ const K={fcf0:10,g:8,n:5,gt:2,r:9,debt:20,sh:10,r0:10,preco:14,gs:[1,2,3],q:{r:10,v:1000,n:3},q2:{f:6,g:3,r:9}};
  K.base=_fu_dcf(K.fcf0,K.g,K.n,K.r,K.gt,K.debt,K.sh);
  K.sens=[8,9,10].map(r=>[r,K.gs.map(gt=>_fu_dcf(K.fcf0,K.g,K.n,r,gt,K.debt,K.sh).ps)]);
  const all=K.sens.flatMap(x=>x[1]); K.min=Math.min(...all); K.max=Math.max(...all);
  let lo=-20,hi=40; for(let i=0;i<60;i++){ const m=(lo+hi)/2; (_fu_dcf(K.fcf0,m,K.n,K.r,K.gt,K.debt,K.sh).ps<K.preco)?lo=m:hi=m; } K.impl=(lo+hi)/2; return K; })();
const _fu_O={venc:[1.0,2.0,1.0],cli:3.5};
// PER e outros rácios
const _fu_ev=(cap,dl,lucro,ebitda)=>({cap,dl,lucro,ebitda,ev:cap+dl,per:cap/lucro,evE:(cap+dl)/ebitda});
const _fu_R={preco:60,lpa:5,unico:1.5,ciclo:[8,4,-1],cicloMed:(8+4-1)/3,
  alfa:_fu_ev(200,0,20,30),beta:_fu_ev(200,300,20,60),
  roe:{ativo:100,lucro:7,a:{cp:100,roe:10,roic:10},b:{cp:40,roe:7/40*100,roic:10}}};

LRN.push(
{ id:'demonstracoes', topic:'fundamental', o:1, title:'Demonstrações financeiras', mins:10,
  lead:`Uma empresa conta a sua história em três documentos que se completam. Quem aprende a lê-los percebe se a empresa ganha dinheiro a sério, quanto deve e para onde vai o dinheiro que entra.`,
  blocks:[
    {t:'h',id:'h1',x:'Três fotografias da mesma empresa'},
    {t:'p',id:'p0',x:`Pensa nas contas de uma família. Há o <b>recibo do ordenado menos as despesas</b> (quanto sobrou no mês), há o <b>património e as dívidas</b> (a casa, as poupanças, o crédito) e há o <b>extrato do banco</b> (o dinheiro que entrou e saiu mesmo). Cada um conta uma parte da verdade e nenhum chega sozinho. Numa empresa passa-se o mesmo, e os três documentos têm nomes próprios.`},
    {t:'cmp',id:'c1',head:['Documento','Pergunta a que responde','O que procurar'],rows:[
      ['Demonstração de resultados','A empresa ganhou ou perdeu dinheiro neste período?','Receitas a crescer, margens estáveis, lucro positivo'],
      ['Balanço','O que tem e o que deve, hoje?','Dívida controlada, ativos reais'],
      ['Fluxos de caixa','Para onde foi o dinheiro de verdade?','Caixa gerada pela atividade, não só lucro contabilístico']],cap:'Resultados e fluxos de caixa cobrem um período (um ano, um semestre). O balanço é uma fotografia numa data.'},
    {t:'p',id:'p1',x:`A diferença entre «período» e «data» é a primeira coisa a fixar. A demonstração de resultados e a de fluxos de caixa são como um filme de um ano. O balanço é uma fotografia tirada a 31 de dezembro (ou na data de fecho das contas). Por isso, quando comparas anos, estás a comparar fotografias e filmes diferentes.`},

    {t:'h',id:'h2',x:'A empresa de exemplo'},
    {t:'p',id:'p2',x:`Vamos usar uma empresa inventada, a <b>Conservas do Atlântico, S.A.</b>, que compra peixe, transforma-o e vende-o em lata. Todos os números são valores de exemplo, em milhões de euros (M€), e a empresa tem 1 milhão de ações.`},

    {t:'h',id:'h3',x:'Demonstração de resultados: de cima para baixo'},
    {t:'p',id:'p3',x:`Lê-se como uma cascata. Começas pelas <b>vendas</b> e vais retirando custos até chegares ao <b>lucro líquido</b>, o que fica para os sócios. Cada degrau responde a uma pergunta diferente.`},
    {t:'cmp',id:'c2',head:['Linha','Valor','O que significa'],rows:[
      ['Vendas (receitas)',_fu_M(_fu_a.vendas),'Tudo o que os clientes pagaram pelos produtos vendidos'],
      ['Custo das vendas',_fu_M(-_fu_a.custo),'Peixe, latas, mão de obra da fábrica'],
      ['Margem bruta',_fu_M(_fu_a.bruta)+' ('+_fu_p(_fu_a.mBruta,0)+')','O que sobra depois de produzir'],
      ['Despesas de funcionamento',_fu_M(-_fu_a.opex),'Vendas, administração, rendas, depreciações'],
      ['Resultado operacional',_fu_M(_fu_a.ebit)+' ('+_fu_p(_fu_a.mOp,0)+')','O que o negócio em si ganha, antes de dívida e impostos'],
      ['Juros pagos',_fu_M(-_fu_a.juros),'O custo da dívida'],
      ['Imposto sobre lucros (25%, valor de exemplo)',_fu_M(-_fu_a.imp),'Pago ao Estado'],
      ['Lucro líquido',_fu_M(_fu_a.lucro)+' ('+_fu_p(_fu_a.mLiq)+')','O que fica para os sócios']],cap:'As percentagens são sobre as vendas: margem bruta, operacional e líquida.'},
    {t:'p',id:'p4',x:`O <b>lucro por ação</b> (LPA) é o lucro líquido a dividir pelo número de ações: ${_fu_M(_fu_a.lucro,2)} ÷ ${_fu_a.acoes} milhão = <b>${_fu_n(_fu_a.lpa,2)} € por ação</b>. É o número que entra no PER, que vês no tema «PER e outros rácios».`},
    {t:'p',id:'p5',x:`Repara que há três margens. A <b>margem bruta</b> diz se o produto é bom negócio. A <b>margem operacional</b> diz se a empresa, no seu todo, é bem gerida. A <b>margem líquida</b> já tem a dívida e os impostos lá dentro. Uma empresa pode ter boa margem bruta e mesmo assim perder dinheiro, se gastar demais a vender e a administrar.`},
    {t:'stat',id:'s1',v:Math.round(_fu_a.mBruta),fmt:'pct',label:'margem bruta da Conservas do Atlântico: de cada 100 € vendidos, 38 € sobram depois de produzir (o lucro líquido final é bem menor)'},

    {t:'h',id:'h4',x:'Balanço: o que tem e o que deve'},
    {t:'p',id:'p6',x:`O balanço obedece sempre a uma igualdade: <b>ativo = passivo + capital próprio</b>. O ativo é o que a empresa tem; o passivo é o que deve a terceiros (bancos, fornecedores); o capital próprio é o que sobra e pertence aos sócios. É como a tua casa: se vale 200 000 € e deves 120 000 € ao banco, o teu capital próprio nela é de 80 000 €.`},
    {t:'cmp',id:'c3',head:['Ativo (o que tem)','Valor','Passivo e capital próprio (a quem pertence)','Valor'],rows:[
      ['Caixa',_fu_M(_fu_a.caixa),'Dívida a bancos',_fu_M(_fu_a.divida)],
      ['Clientes (a receber)',_fu_M(_fu_a.clientes),'Fornecedores (a pagar)',_fu_M(_fu_a.forn)],
      ['Existências (peixe, latas)',_fu_M(_fu_a.exist),'Outras dívidas',_fu_M(_fu_a.outras)],
      ['Fábrica e equipamento',_fu_M(_fu_a.fixos),'Capital próprio (dos sócios)',_fu_M(_fu_a.cp)],
      ['Total do ativo',_fu_M(_fu_a.ativo),'Total passivo + capital próprio',_fu_M(_fu_a.passivo+_fu_a.cp)]],cap:'Os dois lados têm de dar o mesmo total. Se não dão, há um erro.'},
    {t:'p',id:'p7',x:`Daqui sai o <b>ROE</b> (retorno sobre o capital próprio): ${_fu_M(_fu_a.lucro,2)} de lucro sobre ${_fu_M(_fu_a.cp)} de capital dos sócios dá <b>${_fu_p(_fu_a.roe)}</b>. Mede quanto lucro a empresa produz por cada euro que os sócios lá têm. O tema «O balanço a fundo: dívida, liquidez e solvência» desmonta este documento com mais calma.`},

    {t:'h',id:'h5',x:'Fluxos de caixa: o extrato bancário da empresa'},
    {t:'p',id:'p8',x:`A demonstração de fluxos de caixa separa o dinheiro em três ramos. A <b>atividade operacional</b> é o dinheiro que o negócio gera ao funcionar. O <b>investimento</b> é o dinheiro gasto em máquinas, fábricas e outras empresas. O <b>financiamento</b> é o dinheiro que entra e sai por via de dívida e de sócios (empréstimos, dividendos).`},
    {t:'cmp',id:'c4',head:['Ramo','Conta','Valor'],rows:[
      ['Operacional','Lucro líquido',_fu_M(_fu_a.lucro,2)],
      ['Operacional','Mais: depreciações (custo que não é saída de dinheiro)',_fu_M(_fu_a.dep,2)],
      ['Operacional','Menos: aumento de clientes e existências',_fu_M(-_fu_a.dWC,2)],
      ['Operacional','<b>Caixa gerada pela atividade</b>','<b>'+_fu_M(_fu_a.cfo,2)+'</b>'],
      ['Investimento','Compra de máquinas e equipamento',_fu_M(-_fu_a.capex,2)],
      ['Financiamento','Dividendos pagos aos sócios',_fu_M(-_fu_a.divid,2)],
      ['Financiamento','Dívida amortizada ao banco',_fu_M(-_fu_a.amort,2)],
      ['Total','<b>Variação da caixa no ano</b>','<b>'+_fu_M(_fu_a.var_,2)+'</b>']]},
    {t:'p',id:'p9',x:`Porque é que a caixa não é igual ao lucro? Por duas razões. Primeiro, as <b>depreciações</b>: quando a empresa compra uma máquina de 4 M€ que dura 10 anos, não lança 4 M€ de custo de uma vez, lança 0,4 M€ por ano. Esse custo reduz o lucro mas não é dinheiro que saia nesse ano (o dinheiro saiu quando comprou a máquina). Segundo, o <b>fundo de maneio</b>: se a empresa vendeu mas o cliente ainda não pagou, há lucro e não há caixa. Aqui, clientes e existências subiram ${_fu_M(_fu_a.dWC,2)} e esse dinheiro ficou «preso» no negócio.`},

    {t:'h',id:'h6',x:'Como os três se ligam'},
    {t:'p',id:'p10',x:`Os documentos conversam entre si. O lucro de ${_fu_M(_fu_a.lucro,2)} menos os dividendos de ${_fu_M(_fu_a.divid,2)} dá ${_fu_M(_fu_a.retido,2)} que ficam na empresa e engordam o <b>capital próprio</b> no balanço. A variação de caixa de ${_fu_M(_fu_a.var_,2)} é a diferença da linha «Caixa» entre o balanço do ano passado e o deste ano. A dívida a bancos desceu ${_fu_M(_fu_a.amort,1)} porque o fluxo de financiamento amortizou essa parte. Quando os três não batem certo, há um erro ou uma operação que merece pergunta.`},

    {t:'h',id:'h7',x:'Quando o lucro e a caixa discordam'},
    {t:'p',id:'p11',x:`A <b>Tecelagem do Vale</b> (outra empresa de exemplo) reporta um lucro de ${_fu_M(_fu_b.lucro)} e as vendas cresceram de ${_fu_b.vendas0} para ${_fu_b.vendas} M€. Parece ótimo. Mas os clientes por receber subiram de ${_fu_M(_fu_b.cli0)} para ${_fu_M(_fu_b.cli1)}. Em dias de vendas por cobrar (clientes ÷ vendas × 365), passou de cerca de ${_fu_n(_fu_b.dso0,0)} dias para cerca de ${_fu_n(_fu_b.dso1,0)}. Está a vender muito, mas a cobrar cada vez mais tarde, e isso pode ser sinal de clientes em dificuldades ou de vendas «empurradas» com prazos generosos.`},
    {t:'cmp',id:'c5',head:['','Conservas do Atlântico','Tecelagem do Vale'],rows:[
      ['Lucro líquido',_fu_M(_fu_a.lucro,2),_fu_M(_fu_b.lucro,2)],
      ['Caixa gerada pela atividade',_fu_M(_fu_a.cfo,2),_fu_M(_fu_b.cfo,2)],
      ['Dias de vendas por cobrar','—',_fu_n(_fu_b.dso0,0)+' → '+_fu_n(_fu_b.dso1,0)]],cap:'Lucro positivo com caixa operacional negativa é um sinal de alerta, não uma sentença: pode ser um ano de crescimento forte. Pergunta-se sempre porquê.'},
    {t:'p',id:'p12',x:`Isto não quer dizer que o lucro seja «falso». Quer dizer que o lucro é uma <b>opinião contabilística</b> sobre quando contar receitas e custos, enquanto a caixa é um facto. Os dois juntos contam a história completa, e é por isso que a próxima aula do módulo, «Fluxo de caixa livre: o dinheiro que sobra mesmo», parte daqui.`},

    {t:'decide',id:'q1',ensina:['c1','p1'],label:'Decide',q:'Queres saber quanto uma empresa deve e que bens tem num dado momento. Que documento consultas?',o:['A demonstração de resultados','Os fluxos de caixa','O balanço'],c:2,why:'O balanço mostra o que a empresa tem (ativos) e o que deve (passivos) numa data. Os outros dois cobrem um período inteiro.'},
    {t:'fazve',id:'q2',ensina:['c2','p5'],q:`A Conservas do Atlântico vendeu ${_fu_a.vendas} M€ e teve um lucro líquido de ${_fu_n(_fu_a.lucro,2)} M€. Qual é a margem líquida, em %?`,unit:'%',answer:_fu_r(_fu_a.mLiq,2),tol:.02,why:`${_fu_n(_fu_a.lucro,2)} ÷ ${_fu_a.vendas} = ${_fu_n(_fu_a.mLiq/100,3)}, ou seja, ${_fu_n(_fu_a.mLiq)}%. A margem líquida diz quanto das vendas chega ao fim como lucro.`},
    {t:'fazve',id:'q3',ensina:['c3','p7'],q:`O capital próprio da Conservas do Atlântico é ${_fu_a.cp} M€ e o lucro foi ${_fu_n(_fu_a.lucro,2)} M€. Qual é o ROE, em %?`,unit:'%',answer:_fu_r(_fu_a.roe,2),tol:.02,why:`${_fu_n(_fu_a.lucro,2)} ÷ ${_fu_a.cp} = ${_fu_n(_fu_a.roe/100,3)}, isto é, ${_fu_n(_fu_a.roe)}%. Por cada euro dos sócios na empresa, ela gerou cerca de 12,5 cêntimos de lucro.`},

    {t:'h',id:'h8',x:'Um caso real: Enron'},
    {t:'p',id:'p13',x:`A Enron foi uma das maiores empresas dos Estados Unidos, ligada à energia, e entrou em falência no fim de 2001 depois de se descobrir que as contas escondiam dívidas e inflacionavam resultados. Os investidores que só olharam para os lucros e para a história que a empresa contava foram apanhados de surpresa. Quem comparava lucros com caixa gerada, e lia as notas sobre dívidas fora do balanço, tinha razões para desconfiar mais cedo. Fraudes assim são raras, mas ensinam a mesma coisa que o pequeno exemplo da Tecelagem: <b>lucro sem caixa pede explicações</b>.`},

    {t:'h',id:'h9',x:'Os erros que mais custam'},
    {t:'ul',id:'u1',x:[
      '<b>Olhar só para o lucro.</b> O lucro depende de estimativas e escolhas contabilísticas. Confirma sempre com a caixa gerada.',
      '<b>Olhar só para um ano.</b> Um ano excelente pode ser um acaso (venda de um ativo, um contrato único). Vê pelo menos cinco anos.',
      '<b>Esquecer a dívida.</b> Duas empresas com o mesmo lucro valem coisas muito diferentes se uma deve dez vezes mais.',
      '<b>Ignorar as notas.</b> Os números grandes estão nos quadros, mas as explicações (prazos da dívida, processos judiciais, mudanças de critério) estão nas notas.',
      '<b>Confundir «lucro» com «dinheiro disponível».</b> Lucro que ficou em clientes por cobrar ou em existências por vender não paga salários nem dividendos.']},

    {t:'h',id:'h10',x:'Em Portugal'},
    {t:'p',id:'p14',x:`As empresas cotadas na Euronext Lisboa publicam estes três documentos (juntos, chamam-se o <b>relatório e contas</b>), e o mesmo acontece com as empresas estrangeiras que podes comprar através de uma corretora. O tema «Onde ler as contas de uma empresa: relatórios anuais, CMVM e sites de relações com investidores» mostra onde os encontrar e por onde começar. Os ganhos que venhas a ter com ações têm impostos próprios, explicados no tema «Mais-valias: quanto imposto pagas ao vender».`},
    {t:'note',id:'n1',pending:true,x:`As normas contabilísticas usadas variam: em regra, as grandes empresas cotadas apresentam contas segundo normas internacionais (IFRS), e as empresas portuguesas não cotadas usam o sistema nacional (SNC). Os nomes das linhas e alguns critérios podem mudar de uma norma para outra. Fica por confirmar em fonte oficial qual a norma exigida em cada caso.`},

    {t:'h',id:'h11',x:'Em poucas palavras'},
    {t:'ul',id:'u2',x:[
      'Três documentos, três perguntas: resultados (ganhou?), balanço (o que tem e deve?), fluxos de caixa (para onde foi o dinheiro?).',
      'O balanço é uma fotografia numa data; os outros dois são filmes de um período.',
      'Margem bruta, operacional e líquida dizem coisas diferentes: lê as três.',
      'Lucro sem caixa pede explicações. Compara sempre os dois.',
      'Nenhum número vale sozinho: compara com anos anteriores e com empresas do mesmo setor.']},
    {t:'decide',id:'q4',ensina:['p9','c5','p12'],label:'Decide',q:'Uma empresa reporta lucros todos os anos mas a sua caixa nunca aumenta. Porque é que isso deve preocupar-te?',o:['Porque o lucro é sempre falso','Porque o lucro contabilístico pode não corresponder a dinheiro real a entrar','Não é motivo de preocupação'],c:1,why:'O lucro depende de escolhas contabilísticas e de quando se contam receitas. Sem caixa a entrar, a empresa pode não conseguir pagar dívidas, investir ou distribuir dividendos. Não quer dizer que seja fraude: quer dizer que há uma pergunta a fazer.'},
    {t:'erro',id:'q5',ensina:['p6','p9','p10'],label:'Encontra o erro',q:'Uma destas frases sobre as demonstrações financeiras está errada. Qual?',o:['O balanço obedece à igualdade ativo = passivo + capital próprio','As depreciações reduzem o lucro mas não são uma saída de dinheiro nesse ano','Os fluxos de caixa mostram a situação numa data, como uma fotografia','O lucro retido fica na empresa e aumenta o capital próprio'],c:2,why:'A fotografia numa data é o balanço. Os fluxos de caixa (e os resultados) cobrem um período inteiro, como um filme.'}
  ], src:[] },

{ id:'balanco-a-fundo', topic:'fundamental', o:2, title:'O balanço a fundo: dívida, liquidez e solvência', mins:9,
  lead:`Duas empresas podem ter o mesmo lucro e riscos completamente diferentes. A diferença está no balanço: quanto devem, a quem, para quando, e se têm com que pagar.`,
  blocks:[
    {t:'h',id:'h1',x:'Uma imagem para perceber'},
    {t:'p',id:'p1',x:`Imagina duas famílias com o mesmo ordenado. Uma comprou casa com 30% de dívida e tem poupanças para três meses. A outra pediu o crédito quase todo, não tem poupanças e a prestação sobe se as taxas subirem. No dia a dia parecem iguais. No dia em que um dos dois perde o emprego, deixam de o ser. O balanço é o documento que mostra essa diferença nas empresas, e há duas perguntas que se fazem sempre: <b>consegue pagar o que vence em breve?</b> (liquidez) e <b>aguenta a dívida a longo prazo?</b> (solvência).`},

    {t:'h',id:'h2',x:'Como ler o balanço por dentro'},
    {t:'p',id:'p2',x:`O primeiro passo é separar o <b>curto prazo</b> (o que se converte em dinheiro ou se paga em menos de 12 meses) do <b>longo prazo</b>. O <b>ativo corrente</b> é caixa, clientes por cobrar e existências. O <b>passivo corrente</b> é o que tem de pagar no próximo ano: fornecedores, parte da dívida, impostos. A diferença entre os dois chama-se <b>fundo de maneio</b>. Se for negativa, a empresa deve ao curto prazo mais do que tem à mão.`},
    {t:'p',id:'p3',x:`O segundo passo é olhar para o <b>capital próprio</b>, o colchão dos sócios. Quanto maior for em relação ao total, mais perdas a empresa aguenta antes de os credores sentirem. E convém perguntar de que é feito o ativo: <b>fábricas e stocks</b> vendem-se (mal ou bem), mas o <b>goodwill</b> (o sobrepreço pago ao comprar outras empresas) e outros ativos intangíveis podem valer zero numa crise.`},

    {t:'h',id:'h3',x:'Duas empresas, o mesmo tamanho'},
    {t:'p',id:'p4',x:`A <b>Metalúrgica Serra</b> e a <b>Imobiliária Costa Azul</b> são empresas de exemplo, ambas com 30 M€ de ativos. Todos os valores abaixo estão em milhões de euros.`},
    {t:'cmp',id:'c1',head:['','Metalúrgica Serra','Imobiliária Costa Azul'],rows:[
      ['Caixa',_fu_M(_fu_S.cx),_fu_M(_fu_C.cx)],
      ['Clientes por cobrar',_fu_M(_fu_S.cli),_fu_M(_fu_C.cli)],
      ['Existências',_fu_M(_fu_S.ex),_fu_M(_fu_C.ex)],
      ['Ativo corrente',_fu_M(_fu_S.ac),_fu_M(_fu_C.ac)],
      ['Ativo de longo prazo',_fu_M(_fu_S.anc),_fu_M(_fu_C.anc)],
      ['Fornecedores',_fu_M(_fu_S.forn),_fu_M(_fu_C.forn)],
      ['Dívida a pagar em menos de 1 ano',_fu_M(_fu_S.dcp),_fu_M(_fu_C.dcp)],
      ['Passivo corrente',_fu_M(_fu_S.pc),_fu_M(_fu_C.pc)],
      ['Dívida a mais de 1 ano',_fu_M(_fu_S.dlp),_fu_M(_fu_C.dlp)],
      ['Capital próprio',_fu_M(_fu_S.cp),_fu_M(_fu_C.cp)],
      ['Resultado operacional (EBIT)',_fu_M(_fu_S.ebit),_fu_M(_fu_C.ebit)],
      ['Juros pagos',_fu_M(_fu_S.juros),_fu_M(_fu_C.juros)]]},

    {t:'h',id:'h4',x:'Liquidez: consegue pagar o que vence?'},
    {t:'p',id:'p5',x:`A <b>liquidez corrente</b> divide o ativo corrente pelo passivo corrente. Acima de 1, tem mais coisas a converter em dinheiro do que contas a pagar no próximo ano. A <b>liquidez reduzida</b> faz a mesma conta sem as existências, porque o stock demora a vender e pode vender-se com desconto. Não existe um valor «bom» universal: um supermercado, que recebe a pronto e paga a fornecedores a 60 dias, vive bem com liquidez baixa; uma empresa de equipamentos industriais, não.`},
    {t:'cmp',id:'c2',head:['Medida','Fórmula','Metalúrgica Serra','Imobiliária Costa Azul'],rows:[
      ['Fundo de maneio','Ativo corrente − passivo corrente',_fu_M(_fu_S.ac-_fu_S.pc),_fu_M(_fu_C.ac-_fu_C.pc)],
      ['Liquidez corrente','Ativo corrente ÷ passivo corrente',_fu_n(_fu_S.lc,2)+'x',_fu_n(_fu_C.lc,2)+'x'],
      ['Liquidez reduzida','(Caixa + clientes) ÷ passivo corrente',_fu_n(_fu_S.lr,2)+'x',_fu_n(_fu_C.lr,2)+'x']],cap:'«x» quer dizer «vezes».'},

    {t:'h',id:'h5',x:'Solvência: aguenta a dívida?'},
    {t:'p',id:'p6',x:`A solvência olha para mais longe. Três medidas servem para começar. A <b>autonomia financeira</b> é o capital próprio a dividir pelo ativo total: que parte do que a empresa tem é realmente dos sócios. A <b>dívida líquida</b> é a dívida total menos a caixa (se pagasse hoje o que pode, o que sobrava a dever). E a <b>cobertura de juros</b> é o resultado operacional a dividir pelos juros: quantas vezes o negócio paga os juros do ano.`},
    {t:'p',id:'p7',x:`Há ainda o <b>EBITDA</b>, que é o resultado antes de juros, impostos, depreciações e amortizações. É uma aproximação grosseira da capacidade de gerar dinheiro (lê-se «ebitda»). Como «dívida líquida ÷ EBITDA» diz em quantos anos de EBITDA a empresa pagaria a dívida, é muito usada por bancos e analistas. Mas o EBITDA <b>não é caixa</b>: ignora investimentos que a empresa tem de fazer para continuar a funcionar.`},
    {t:'cmp',id:'c3',head:['Medida','Metalúrgica Serra','Imobiliária Costa Azul'],rows:[
      ['Dívida total',_fu_M(_fu_S.div),_fu_M(_fu_C.div)],
      ['Dívida líquida',_fu_M(_fu_S.dl),_fu_M(_fu_C.dl)],
      ['Autonomia financeira (CP ÷ ativo)',_fu_p(_fu_S.aut),_fu_p(_fu_C.aut)],
      ['Dívida ÷ capital próprio',_fu_n(_fu_S.dce,2)+'x',_fu_n(_fu_C.dce,2)+'x'],
      ['EBITDA (valor de exemplo)',_fu_M(_fu_S.ebitda),_fu_M(_fu_C.ebitda)],
      ['Dívida líquida ÷ EBITDA',_fu_n(_fu_S.dlE,1)+'x',_fu_n(_fu_C.dlE,1)+'x'],
      ['Cobertura de juros (EBIT ÷ juros)',_fu_n(_fu_S.cob,1)+'x',_fu_n(_fu_C.cob,1)+'x']]},
    {t:'p',id:'p8',x:`A leitura é clara. A Metalúrgica Serra tem mais de metade do ativo financiado por capital dos sócios, deve cerca de ${_fu_n(_fu_S.dlE,1)} anos de EBITDA e paga os juros ${_fu_n(_fu_S.cob,1)} vezes. A Costa Azul deve ${_fu_n(_fu_C.dlE,1)} anos de EBITDA, só cobre os juros ${_fu_n(_fu_C.cob,1)} vezes e tem ${_fu_p(_fu_C.dcp/_fu_C.div*100,0)} da dívida a vencer no ano com apenas ${_fu_M(_fu_C.cx)} em caixa. Numa semana em que os bancos se recusem a renovar o crédito, a Costa Azul tem um problema sério; a Serra, não.`},
    {t:'stat',id:'s1',v:Math.round(_fu_C.aut),fmt:'pct',label:'autonomia financeira da Imobiliária Costa Azul: só cerca de um quarto do ativo é dos sócios'},

    {t:'h',id:'h6',x:'O que o balanço não mostra de imediato'},
    {t:'ul',id:'u1',x:[
      '<b>O calendário da dívida.</b> Nas notas, a empresa diz quanto vence em cada ano. Dívida toda a vencer no mesmo ano obriga a refinanciar de uma só vez, e isso depende de os bancos e os mercados quererem emprestar nesse momento.',
      '<b>As cláusulas dos contratos.</b> Muitos empréstimos obrigam a manter certos rácios (por exemplo, dívida líquida abaixo de certo múltiplo do EBITDA). Se a empresa os falhar, o banco pode exigir pagamento antecipado.',
      '<b>Taxa fixa ou variável.</b> Dívida a taxa variável encarece quando sobem as taxas de juro (ver «Bancos centrais e taxas de juro»).',
      '<b>Rendas e outros compromissos.</b> Contratos de arrendamento e garantias dadas a terceiros podem pesar como se fossem dívida; vê as notas.',
      '<b>Os ativos que não se vendem.</b> Se tirares o goodwill ao capital próprio, ficas com o capital próprio tangível, uma medida mais dura da folga real.']},
    {t:'fazve',id:'q1',ensina:['p5','c2'],q:`Uma empresa tem ativo corrente de ${_fu_Q.ac} M€ e passivo corrente de ${_fu_Q.pc} M€. Qual é a liquidez corrente?`,unit:'x',answer:_fu_r(_fu_Q.ac/_fu_Q.pc,2),tol:.02,why:`${_fu_Q.ac} ÷ ${_fu_Q.pc} = ${_fu_n(_fu_Q.ac/_fu_Q.pc,2)}. Abaixo de 1, a empresa tem menos a converter em dinheiro do que a pagar no próximo ano.`},
    {t:'fazve',id:'q2',ensina:['p6','p7','c3'],q:`Uma empresa tem dívida total de ${_fu_Q.div} M€, caixa de ${_fu_Q.cx} M€ e EBITDA de ${_fu_Q.eb} M€. Quantos anos de EBITDA dura a dívida líquida (dívida líquida ÷ EBITDA)?`,unit:'x',answer:_fu_r((_fu_Q.div-_fu_Q.cx)/_fu_Q.eb,2),tol:.02,why:`Dívida líquida = ${_fu_Q.div} − ${_fu_Q.cx} = ${_fu_Q.div-_fu_Q.cx} M€. Dividindo por ${_fu_Q.eb} M€ de EBITDA dá ${_fu_n((_fu_Q.div-_fu_Q.cx)/_fu_Q.eb,2)} vezes.`},

    {t:'h',id:'h7',x:'Um caso real: Lehman Brothers, setembro de 2008'},
    {t:'p',id:'p9',x:`O banco de investimento Lehman Brothers faliu em setembro de 2008 e foi o ponto de viragem da crise financeira. Tinha um balanço enorme, pago em grande parte com <b>dívida de muito curto prazo</b> (renovada todas as semanas) e investido em ativos difíceis de vender depressa, como créditos à habitação. Enquanto os financiadores renovaram, tudo parecia normal. Quando deixaram de confiar, a Lehman tinha ativos a longo prazo e contas a pagar ao fim do dia, e não conseguiu transformar uns nas outras. Foi uma crise de liquidez que se tornou numa crise de solvência. Os bancos têm contas diferentes das empresas normais (a dívida é a sua matéria-prima), mas a lição vale para qualquer um: <b>dívida curta a financiar ativos longos é frágil</b>.`},

    {t:'h',id:'h8',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      '<b>Comparar rácios entre setores.</b> Uma elétrica e uma loja não têm o mesmo nível «normal» de dívida; compara com o setor.',
      '<b>Olhar só para o total da dívida.</b> A mesma dívida é leve com EBITDA alto e pesada com EBITDA a cair. Vê o rácio e a tendência.',
      '<b>Usar um rácio único como veredicto.</b> Liquidez, solvência e cobertura contam histórias diferentes; usa-os juntos.',
      '<b>Confiar na data do fecho.</b> Algumas empresas parecem mais folgadas na data do balanço do que ao longo do ano (por exemplo, quando vendem ativos pouco antes do fecho).',
      '<b>Esquecer a tendência.</b> Uma dívida a subir três anos seguidos diz mais do que um valor isolado.']},
    {t:'note',id:'n1',x:'Os rácios deste tema vêm de contas passadas. Mostram a saúde de ontem, não garantem a de amanhã: uma empresa com balanço sólido também pode perder dinheiro, e uma endividada pode correr bem se o negócio crescer.'},

    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p10',x:`Tudo isto aplica-se às empresas da Euronext Lisboa e às que compras no estrangeiro. Para as contas de uma empresa portuguesa concreta, o tema «Onde ler as contas de uma empresa: relatórios anuais, CMVM e sites de relações com investidores» diz onde ir. Se a dívida de uma empresa estiver ligada à Euribor (taxa de referência europeia), o que lês em «Bancos centrais e taxas de juro» explica porque é que os juros pagos mudam quando o BCE altera a sua taxa.`},

    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'Liquidez responde a «consegue pagar o que vence em breve?»; solvência responde a «aguenta a dívida a longo prazo?».',
      'Liquidez corrente = ativo corrente ÷ passivo corrente; a reduzida tira as existências.',
      'Dívida líquida ÷ EBITDA e cobertura de juros são os rácios de dívida mais usados; o EBITDA não é caixa.',
      'O calendário da dívida, as cláusulas e o goodwill estão nas notas, não nos quadros.',
      'Compara sempre com o setor e com os anos anteriores da própria empresa.']},
    {t:'decide',id:'q3',ensina:['p5','p6','p8','c3'],label:'Decide',q:'Duas empresas têm o mesmo lucro. Uma tem dívida líquida de 1,6 vezes o EBITDA e cobre os juros 8 vezes. A outra, 4,6 vezes e 2 vezes. Qual é mais frágil se o negócio piorar?',o:['A primeira, porque deve mais','A segunda, porque a dívida pesa mais e os juros quase consomem o resultado operacional','São iguais, porque o lucro é o mesmo'],c:1,why:'Com 2 vezes de cobertura, uma queda de metade no resultado operacional deixa a empresa sem conseguir pagar os juros. Lucro igual hoje não quer dizer risco igual amanhã.'},
    {t:'erro',id:'q4',ensina:['p2','p5','p7'],label:'Encontra o erro',q:'Uma destas frases está errada. Qual?',o:['O fundo de maneio é o ativo corrente menos o passivo corrente','Liquidez reduzida deixa de fora as existências','O EBITDA é o dinheiro que a empresa tem em caixa','A dívida líquida é a dívida total menos a caixa'],c:2,why:'O EBITDA é um resultado antes de juros, impostos e depreciações, não é dinheiro em caixa. Ignora investimentos necessários e a variação do fundo de maneio.'},
    {t:'decide',id:'q5',ensina:['p9','u1'],label:'Decide',q:'Porque é que dívida curta a financiar ativos longos é um risco?',o:['Porque a dívida curta tem sempre juros mais altos','Porque a empresa tem de renovar o financiamento muitas vezes e pode não conseguir se os financiadores deixarem de confiar','Porque os ativos longos perdem sempre valor'],c:1,why:'O problema é o desencontro de prazos: os ativos só se convertem em dinheiro devagar, mas as contas a pagar chegam depressa. Foi o que derrubou a Lehman em 2008.'}
  ], src:[] },

{ id:'fluxo-caixa-livre', topic:'fundamental', o:3, title:'Fluxo de caixa livre: o dinheiro que sobra mesmo', mins:8,
  lead:`O lucro conta o que a empresa «ganhou» no papel. O fluxo de caixa livre conta o que sobra depois de pagar tudo o que é preciso para continuar a funcionar, e é esse dinheiro que pode ir para os sócios.`,
  blocks:[
    {t:'h',id:'h1',x:'Uma imagem para perceber'},
    {t:'p',id:'p1',x:`Dois amigos ganham 2 000 € por mês. Um tem uma profissão sem custos: sai de casa, trabalha e volta. O outro é taxista e, todos os meses, tem de pôr de lado dinheiro para os pneus, as revisões e, daqui a uns anos, o carro novo. No papel ganham o mesmo. Mas o que cada um pode gastar ou poupar <b>sem comprometer o futuro</b> é muito diferente. O fluxo de caixa livre (em inglês, <i>free cash flow</i> ou FCF) mede exatamente isto numa empresa.`},

    {t:'h',id:'h2',x:'A conta, passo a passo'},
    {t:'p',id:'p2',x:`Partimos da <b>caixa gerada pela atividade</b> (a primeira linha da demonstração de fluxos de caixa, vista em «Demonstrações financeiras»). Dela subtraímos o <b>investimento em ativos fixos</b>, que em inglês se diz <i>capex</i> (despesas de capital): máquinas, fábricas, equipamento informático, tudo o que a empresa tem de comprar para manter ou aumentar a capacidade.`},
    {t:'p',id:'p3',x:`<b>FCF = caixa gerada pela atividade − investimento em ativos fixos.</b> O que sobra é dinheiro que a empresa pode usar para pagar dividendos, recomprar ações, amortizar dívida, comprar outras empresas ou simplesmente guardar. Um FCF positivo e estável durante anos é a melhor prova de que o negócio funciona.`},
    {t:'p',id:'p4',x:`Há duas variantes. O <b>FCF para os acionistas</b> é o que acabámos de ver (já depois de pagar juros). O <b>FCF da empresa</b> soma de volta os juros (com o efeito do imposto) e serve para valorizar a empresa inteira, independentemente de como é financiada. Quando alguém fala em «FCF» sem mais, convém perguntar qual dos dois. Nas contas deste tema usamos o primeiro.`},

    {t:'h',id:'h3',x:'Dois negócios com o mesmo lucro'},
    {t:'p',id:'p5',x:`A <b>Software Lisboa</b> vende programas pela internet: quase não tem fábricas. A <b>Cimentos do Sul</b> produz cimento: fornos e pedreiras exigem muito investimento todos os anos. As duas são empresas de exemplo, valem ambas 200 M€ em bolsa e declararam 10 M€ de lucro.`},
    {t:'cmp',id:'c1',head:['M€','Software Lisboa','Cimentos do Sul'],rows:[
      ['Lucro líquido',_fu_n(_fu_F.sl.lucro),_fu_n(_fu_F.cs.lucro)],
      ['Depreciações (somam-se, não são saída de dinheiro)',_fu_n(_fu_F.sl.dep),_fu_n(_fu_F.cs.dep)],
      ['Variação do fundo de maneio',_fu_n(_fu_F.sl.wc),_fu_n(_fu_F.cs.wc)],
      ['<b>Caixa gerada pela atividade</b>','<b>'+_fu_n(_fu_F.sl.cfo)+'</b>','<b>'+_fu_n(_fu_F.cs.cfo)+'</b>'],
      ['Investimento (capex)',_fu_n(-_fu_F.sl.capex),_fu_n(-_fu_F.cs.capex)],
      ['<b>Fluxo de caixa livre</b>','<b>'+_fu_n(_fu_F.sl.fcf)+'</b>','<b>'+_fu_n(_fu_F.cs.fcf)+'</b>'],
      ['FCF ÷ lucro (conversão)',_fu_p(_fu_F.sl.conv,0),_fu_p(_fu_F.cs.conv,0)],
      ['PER (200 M€ ÷ lucro)',_fu_n(_fu_F.sl.per)+'x',_fu_n(_fu_F.cs.per)+'x'],
      ['Rendimento do FCF (FCF ÷ 200 M€)',_fu_p(_fu_F.sl.yld),_fu_p(_fu_F.cs.yld)]],cap:'Valores de exemplo, em milhões de euros.'},
    {t:'p',id:'p6',x:`Com o PER a olhar só para o lucro, as duas empresas parecem iguais: ${_fu_n(_fu_F.sl.per,0)} vezes o lucro. Com o FCF, a Software Lisboa devolve <b>${_fu_p(_fu_F.sl.yld)}</b> do que custa por ano em dinheiro livre, e a Cimentos do Sul apenas <b>${_fu_p(_fu_F.cs.yld)}</b>. É a diferença entre ser sócio de um negócio que deixa sobrar dinheiro e ser sócio de outro que o reinveste todo para se manter à tona.`},
    {t:'stat',id:'s1',v:Math.round(_fu_F.cs.conv),fmt:'pct',label:'é quanto do lucro da Cimentos do Sul chega a fluxo de caixa livre, contra 100% na Software Lisboa'},

    {t:'h',id:'h4',x:'Capex de manutenção e capex de crescimento'},
    {t:'p',id:'p7',x:`Nem todo o investimento é igual. O <b>capex de manutenção</b> serve para a empresa continuar a ser a mesma (trocar o forno velho). O <b>capex de crescimento</b> serve para ser maior (construir uma fábrica nova). Se a Cimentos do Sul investe ${_fu_n(_fu_F.cs.capex,0)} M€ mas só ${_fu_n(_fu_F.cs.dep,0)} M€ são para manter o que tem, então os restantes ${_fu_n(_fu_F.cs.capex-_fu_F.cs.dep,0)} M€ estão a comprar crescimento futuro. Se isso funcionar, o FCF vai subir; se não, foi dinheiro mal gasto.`},
    {t:'p',id:'p8',x:`Uma forma rápida de espreitar é calcular um <b>FCF de manutenção</b>, tomando as depreciações como estimativa do capex de manutenção. Para a Cimentos do Sul: ${_fu_n(_fu_F.cs.cfo,0)} − ${_fu_n(_fu_F.cs.dep,0)} = <b>${_fu_n(_fu_F.cs.fcfM,0)} M€</b>, ou seja, ${_fu_p(_fu_F.cs.yldM)} do valor em bolsa. É uma estimativa grosseira (as depreciações são um critério contabilístico, não um orçamento de manutenção), mas mostra que o FCF baixo de um ano pode esconder um negócio mais saudável do que parece, <i>se</i> o crescimento pago valer a pena.`},

    {t:'h',id:'h5',x:'Para onde vai o dinheiro livre'},
    {t:'p',id:'p9',x:`O FCF é o que a empresa pode distribuir sem pedir emprestado. Por isso, quando olhas para o dividendo, deves perguntar se o FCF o cobre. Se a Software Lisboa pagar ${_fu_n(_fu_F.sl.div,0)} M€ em dividendos, o FCF cobre-os <b>${_fu_n(_fu_F.sl.fcf/_fu_F.sl.div,1)} vezes</b>. Se a Cimentos do Sul pagar ${_fu_n(_fu_F.cs.div,0)} M€, o FCF de ${_fu_n(_fu_F.cs.fcf,0)} M€ cobre só <b>${_fu_n(_fu_F.cs.fcf/_fu_F.cs.div,2)} vezes</b>: o resto vem de dívida ou de reservas, e isso não dura. É a mesma lógica do tema «Dividendos e payout», mas com uma base mais difícil de manipular do que o lucro.`},

    {t:'fazve',id:'q1',ensina:['p3','c1'],q:`Uma empresa gerou ${_fu_F.q.cfo} M€ de caixa pela atividade e investiu ${_fu_F.q.capex} M€ em máquinas. Qual foi o fluxo de caixa livre, em M€?`,unit:'M€',answer:_fu_F.q.cfo-_fu_F.q.capex,tol:.02,why:`${_fu_F.q.cfo} − ${_fu_F.q.capex} = ${_fu_F.q.cfo-_fu_F.q.capex} M€. É o que sobra depois de pagar o investimento, e que pode ir para dividendos, dívida ou reservas.`},
    {t:'fazve',id:'q2',ensina:['p6','c1'],q:`Uma empresa vale ${_fu_F.q.cap} M€ em bolsa e gera um FCF de ${_fu_F.q.fcf} M€ por ano. Qual é o rendimento do FCF, em %?`,unit:'%',answer:_fu_r(_fu_F.q.fcf/_fu_F.q.cap*100,2),tol:.02,why:`${_fu_F.q.fcf} ÷ ${_fu_F.q.cap} = ${_fu_n(_fu_F.q.fcf/_fu_F.q.cap*100,1)}%. Mostra quanto dinheiro livre a empresa gera por cada euro que custa comprá-la inteira.`},

    {t:'h',id:'h6',x:'Quando o FCF engana'},
    {t:'ul',id:'u1',x:[
      '<b>Um ano não chega.</b> Uma empresa pode adiar investimento durante um ou dois anos e mostrar um FCF alto que não é sustentável. Vê uma média de cinco anos.',
      '<b>Fundo de maneio manobrável.</b> Pagar mais tarde aos fornecedores ou vender contas por cobrar melhora a caixa do ano, mas só uma vez. O mesmo vale ao contrário em anos de crescimento.',
      '<b>Compensação em ações.</b> Algumas empresas pagam grande parte dos salários em ações. Isso não sai da caixa, mas custa aos sócios, que passam a ter uma fatia menor. Confirma nas notas.',
      '<b>Negócios que crescem depressa.</b> FCF baixo ou negativo pode ser um investimento que compensa, ou uma máquina de queimar dinheiro. Pergunta quanto do crescimento é pago por clientes e quanto por novos financiamentos.',
      '<b>Vender ativos.</b> A venda de uma fábrica entra como caixa, mas não é um fluxo recorrente.']},

    {t:'h',id:'h7',x:'Um caso real: as «ponto com» no ano 2000'},
    {t:'p',id:'p10',x:`No fim dos anos 90 muitas empresas de internet tinham vendas a crescer a ritmo vertiginoso e prejuízos enormes. Eram avaliadas por «cliques» e «utilizadores», não por dinheiro. Muitas gastavam mais caixa do que geravam e dependiam de novas entradas de dinheiro dos investidores para continuar. Quando, em 2000 e 2001, o mercado deixou de querer financiar esse modelo, muitas fecharam em poucos meses. As que sobreviveram, e algumas prosperaram, eram as que acabaram por gerar fluxo de caixa livre. O mercado leva tempo a perceber, mas a pergunta «de onde vem o dinheiro?» acaba sempre por ser feita.`},

    {t:'h',id:'h8',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      'Assumir que lucro alto significa caixa livre alta. Depende do investimento que o negócio exige.',
      'Comparar o FCF de empresas de setores muito diferentes sem ajustar à intensidade de capital.',
      'Pagar muito por uma empresa só porque o FCF cresceu um ano.',
      'Ignorar de onde vem o FCF: de operações, ou de ter adiado pagamentos e vendido ativos.',
      'Confundir FCF com «dividendos que posso receber»: só a empresa decide quanto distribui.']},

    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p11',x:`O FCF aplica-se às empresas portuguesas e estrangeiras da mesma maneira. Se vais receber parte dele como dividendo, convém saber que há retenção na fonte de 28% quando recebes em Portugal, segundo o guia fiscal da Autoridade Tributária. Vê o tema «Dividendos e juros» para as regras e o que tens de declarar. Quando é distribuído de outra forma (recompra de ações), o imposto só surge quando vendes, e é tema de «Mais-valias: quanto imposto pagas ao vender».`},

    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'FCF = caixa gerada pela atividade − investimento em ativos fixos.',
      'É o dinheiro que sobra para dividendos, dívida e novos projetos sem pedir emprestado.',
      'Empresas com o mesmo lucro podem ter FCF muito diferentes: depende do capex que o negócio exige.',
      'O rendimento do FCF (FCF ÷ valor em bolsa) é mais sólido do que o PER para comparar o que pagas.',
      'Um ano não chega: procura FCF estável ao longo de vários anos.']},
    {t:'decide',id:'q3',ensina:['c1','p6','p7'],label:'Decide',q:'Duas empresas têm o mesmo lucro e o mesmo PER. A primeira tem FCF igual ao lucro; a segunda tem FCF de 10% do lucro. O que isto sugere?',o:['A segunda é melhor, porque investe mais','A primeira deixa sobrar muito mais dinheiro livre por cada euro de lucro','Não há diferença, porque o lucro é o mesmo'],c:1,why:'Lucro igual com FCF diferente significa que uma empresa precisa de reinvestir quase tudo para se manter, e a outra não. Para o sócio, o dinheiro livre é o que conta.'},
    {t:'erro',id:'q4',ensina:['p3','p4','p8','u1'],label:'Encontra o erro',q:'Uma destas frases sobre o fluxo de caixa livre está errada. Qual?',o:['O capex de crescimento pode baixar o FCF de hoje e subi-lo no futuro','Vender uma fábrica aumenta o FCF recorrente do negócio','O FCF cobre ou não o dividendo, e isso importa mais do que o payout calculado sobre o lucro','Adiar pagamentos a fornecedores melhora a caixa só uma vez'],c:1,why:'A venda de um ativo traz caixa uma vez, não é um fluxo que se repita. Convém retirá-la quando estimas o FCF recorrente.'}
  ], src:[] },

{ id:'per-racios', topic:'fundamental', o:4, title:'PER e outros rácios', mins:9,
  lead:`Rácios transformam números da empresa em medidas comparáveis. Servem para perguntar «quanto estou a pagar por isto?» e comparar empresas, mas cada um só responde bem a certas perguntas.`,
  blocks:[
    {t:'h',id:'h1',x:'Uma imagem para perceber'},
    {t:'p',id:'p1',x:`Se vires uma casa à venda por 300 000 € que dá 15 000 € de renda por ano, sabes que ela te devolve 5% ao ano (15 000 ÷ 300 000). Se outra, igual, custar 200 000 € e der as mesmas rendas, devolve 7,5% e é mais barata para o mesmo rendimento. Os rácios fazem isto com empresas: dividem o preço pelo que a empresa produz (lucro, vendas, ativos) para que dois preços muito diferentes se possam comparar.`},

    {t:'h',id:'h2',x:'O PER'},
    {t:'p',id:'p2',x:`O <b>PER</b> (price-to-earnings, ou «preço sobre lucros») divide o preço da ação pelo lucro por ação. Diz quantos anos de lucro estás a pagar. Um PER de 12 significa que pagas 12 vezes o lucro anual. Experimenta:`},
    {t:'w',id:'w1',w:'calc',c:'per'},
    {t:'p',id:'p3',x:`O inverso do PER chama-se <b>rendimento dos lucros</b> (<i>earnings yield</i>): com PER 12, é 1 ÷ 12 = ${_fu_p(100/12)}. Significa que, por cada 100 € que pagas pela ação, a empresa ganha cerca de ${_fu_n(100/12,2)} € por ano. É uma forma útil de comparar com alternativas, como um depósito ou uma obrigação, desde que lembres que os lucros da empresa não são pagos todos a ti.`},
    {t:'ul',id:'u1',x:[
      '<b>PER alto</b>: o mercado espera crescimento forte, ou a ação está cara.',
      '<b>PER baixo</b>: a empresa pode estar barata, ou ter dificuldades que o mercado já vê.',
      '<b>PER «a seguir» (forward)</b>: usa o lucro estimado para o próximo ano em vez do último. É mais atual, mas depende de previsões que podem falhar.']},

    {t:'h',id:'h3',x:'Quando o PER engana'},
    {t:'p',id:'p4',x:`<b>Lucros únicos.</b> Uma ação custa ${_fu_R.preco} € e o lucro por ação foi de ${_fu_R.lpa} €, PER ${_fu_n(_fu_R.preco/_fu_R.lpa,1)}. Mas ${_fu_n(_fu_R.unico,1)} € desse lucro vinha da venda de um edifício, que não se repete. O lucro recorrente é ${_fu_n(_fu_R.lpa-_fu_R.unico,1)} € e o PER «a sério» sobe para <b>${_fu_n(_fu_R.preco/(_fu_R.lpa-_fu_R.unico),1)}</b>.`},
    {t:'p',id:'p5',x:`<b>Negócios cíclicos.</b> Uma siderurgia ganha muito nos anos bons e perde nos maus. Com a ação a ${_fu_R.preco} €, num ano bom (lucro ${_fu_R.ciclo[0]} €) o PER é ${_fu_n(_fu_R.preco/_fu_R.ciclo[0],1)} e parece baratíssima. Num ano médio (${_fu_R.ciclo[1]} €) é ${_fu_n(_fu_R.preco/_fu_R.ciclo[1],1)}. Num ano mau (${_fu_R.ciclo[2]} € de prejuízo) o PER nem faz sentido. O que conta é o lucro «médio do ciclo»: aqui ${_fu_n(_fu_R.cicloMed,2)} €, e o PER sobre esse valor é ${_fu_n(_fu_R.preco/_fu_R.cicloMed,1)}. Quem compra a siderurgia pelo PER 7,5 no auge pode estar a pagar o preço mais alto no pior momento.`},
    {t:'p',id:'p6',x:`<b>Empresas sem lucro.</b> PER negativo ou indefinido não se compara. Para empresas que ainda perdem dinheiro olha para outros indicadores, como o rácio preço/vendas, sabendo que é um indicador fraco: vendas sem margens não valem nada.`},
    {t:'note',id:'n1',x:'Um rácio isolado diz pouco. Compara com o <b>mesmo setor</b> e com o <b>histórico</b> da própria empresa. Bancos e empresas de tecnologia têm PER normais muito diferentes.'},

    {t:'h',id:'h4',x:'O valor da empresa e o EV/EBITDA'},
    {t:'p',id:'p7',x:`O PER só olha para o preço da ação e ignora a dívida. Para ter em conta quem financia a empresa, usa-se o <b>valor da empresa</b> (<i>enterprise value</i>, EV): valor em bolsa <b>mais</b> a dívida líquida. É o que custaria comprar a empresa toda, ficando também com as suas dívidas. Dividindo o EV pelo EBITDA (o resultado antes de juros, impostos e depreciações, que viste em «O balanço a fundo: dívida, liquidez e solvência») obténs o <b>EV/EBITDA</b>.`},
    {t:'cmp',id:'c1',head:['M€ (valores de exemplo)','Alfa Têxteis','Beta Indústria'],rows:[
      ['Valor em bolsa (10 M ações a 20 €)',_fu_n(_fu_R.alfa.cap,0),_fu_n(_fu_R.beta.cap,0)],
      ['Dívida líquida',_fu_n(_fu_R.alfa.dl,0),_fu_n(_fu_R.beta.dl,0)],
      ['<b>Valor da empresa (EV)</b>','<b>'+_fu_n(_fu_R.alfa.ev,0)+'</b>','<b>'+_fu_n(_fu_R.beta.ev,0)+'</b>'],
      ['Lucro líquido',_fu_n(_fu_R.alfa.lucro,0),_fu_n(_fu_R.beta.lucro,0)],
      ['PER',_fu_n(_fu_R.alfa.per,1)+'x',_fu_n(_fu_R.beta.per,1)+'x'],
      ['EBITDA',_fu_n(_fu_R.alfa.ebitda,0),_fu_n(_fu_R.beta.ebitda,0)],
      ['EV/EBITDA',_fu_n(_fu_R.alfa.evE,1)+'x',_fu_n(_fu_R.beta.evE,1)+'x']]},
    {t:'p',id:'p8',x:`O PER é igual (${_fu_n(_fu_R.alfa.per,0)}x), mas a Beta Indústria deve muito e por isso o EV/EBITDA dela é maior: ${_fu_n(_fu_R.beta.evE,1)}x contra ${_fu_n(_fu_R.alfa.evE,1)}x. Quem comprasse a Beta inteira pagaria mais por cada euro de EBITDA, e ficava com uma dívida pesada. O PER sozinho não via isso.`},

    {t:'h',id:'h5',x:'Os outros rácios, lado a lado'},
    {t:'cmp',id:'c2',head:['Rácio','Como se calcula','Útil para','Cuidado com'],rows:[
      ['PER','Preço ÷ lucro por ação','Comparar empresas estáveis do mesmo setor','Lucros únicos, ciclos, empresas sem lucro'],
      ['EV/EBITDA','(Valor em bolsa + dívida líquida) ÷ EBITDA','Comparar empresas com dívida muito diferente','EBITDA ignora o investimento necessário'],
      ['P/B (preço/valor contabilístico)','Preço ÷ capital próprio por ação','Bancos, seguradoras, imobiliárias','Inútil em negócios de ativos leves (software)'],
      ['Preço/vendas','Valor em bolsa ÷ vendas','Empresas ainda sem lucro','Vendas sem margem não valem nada'],
      ['ROE','Lucro líquido ÷ capital próprio','Rentabilidade para os sócios','A dívida pode inflacionar o ROE'],
      ['ROIC','Resultado operacional após impostos ÷ (capital próprio + dívida líquida)','Rentabilidade do negócio, independente de como é financiado','O «capital investido» tem várias definições'],
      ['Rendimento do dividendo','Dividendo ÷ preço','Rendimento corrente','Pode ser alto porque o preço caiu']],cap:'Nenhum rácio é «o melhor». Cada um responde a uma pergunta.'},

    {t:'h',id:'h6',x:'O ROE e a armadilha da dívida'},
    {t:'p',id:'p9',x:`O ROE parece perfeito: quanto lucro por euro dos sócios. Mas a dívida mexe nele. Duas empresas de exemplo, a <b>Cautela</b> e a <b>Arrojo</b>, têm ambas ${_fu_R.roe.ativo} M€ de ativos e <b>o mesmo negócio</b>, que gera 10 M€ de resultado operacional depois de impostos. A Cautela financia-se só com capital dos sócios. A Arrojo pediu emprestado ${_fu_R.roe.ativo-_fu_R.roe.b.cp} M€ e os sócios põem apenas ${_fu_R.roe.b.cp} M€; paga 3 M€ de juros (já depois do efeito fiscal), e por isso o lucro líquido dela é ${_fu_R.roe.lucro} M€.`},
    {t:'cmp',id:'c3',head:['M€ (valores de exemplo)','Cautela','Arrojo'],rows:[
      ['Capital próprio',_fu_n(_fu_R.roe.a.cp,0),_fu_n(_fu_R.roe.b.cp,0)],
      ['Dívida',_fu_n(0,0),_fu_n(_fu_R.roe.ativo-_fu_R.roe.b.cp,0)],
      ['Resultado operacional após impostos',_fu_n(10,0),_fu_n(10,0)],
      ['Lucro líquido (depois de juros)',_fu_n(10,0),_fu_n(_fu_R.roe.lucro,0)],
      ['ROE (lucro ÷ capital próprio)',_fu_p(_fu_R.roe.a.roe),_fu_p(_fu_R.roe.b.roe)],
      ['ROIC (resultado operacional ÷ capital investido)',_fu_p(_fu_R.roe.a.roic),_fu_p(_fu_R.roe.b.roic)]],cap:'Mesmo negócio, mesmo ROIC. O ROE da Arrojo é maior só por causa da dívida, que também lhe traz mais risco.'},
    {t:'p',id:'p10',x:`O ROE da Arrojo (${_fu_p(_fu_R.roe.b.roe)}) parece muito melhor do que o da Cautela (${_fu_p(_fu_R.roe.a.roe)}), mas é o mesmo negócio com mais risco. O <b>ROIC</b> (retorno sobre o capital investido, que inclui a dívida) mostra que o negócio rende o mesmo nas duas. Um ROE alto com dívida alta é um aviso, não um elogio.`},

    {t:'fazve',id:'q1',ensina:['p2','w1'],q:'Uma ação custa 60 € e a empresa teve um lucro de 5 € por ação no último ano. Qual é o PER?',unit:'',answer:12,tol:.02,why:'60 ÷ 5 = 12. Estás a pagar 12 anos de lucro atual.'},
    {t:'fazve',id:'q2',ensina:['p4'],q:`A ação custa ${_fu_R.preco} € e o lucro por ação foi ${_fu_R.lpa} €, dos quais ${_fu_n(_fu_R.unico,1)} € vieram da venda única de um edifício. Qual é o PER sobre o lucro recorrente?`,unit:'',answer:_fu_r(_fu_R.preco/(_fu_R.lpa-_fu_R.unico),1),tol:.03,why:`Lucro recorrente = ${_fu_R.lpa} − ${_fu_n(_fu_R.unico,1)} = ${_fu_n(_fu_R.lpa-_fu_R.unico,1)} €. ${_fu_R.preco} ÷ ${_fu_n(_fu_R.lpa-_fu_R.unico,1)} = ${_fu_n(_fu_R.preco/(_fu_R.lpa-_fu_R.unico),1)}. Depois de retirar o ganho que não se repete, a ação é mais cara do que parecia.`},

    {t:'h',id:'h7',x:'Um caso real: o ano 2000'},
    {t:'p',id:'p11',x:`No auge da bolha das empresas de internet, em 2000, as ações de muitas empresas de tecnologia chegaram a ser negociadas a PER de várias centenas, ou a preços para empresas que ainda nem tinham lucro. A justificação era que o crescimento futuro compensaria tudo. Quando o crescimento não chegou ao ritmo previsto, as cotações caíram muito, e os índices de tecnologia demoraram muitos anos a recuperar. Isto não quer dizer que PER alto seja sempre mau; quer dizer que PER alto exige crescimento muito acima da média durante muito tempo, e esse pressuposto precisa de ser pensado, não aceite.`},

    {t:'h',id:'h8',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      'Comprar só porque o PER é baixo. Pode ser uma empresa em declínio ou um negócio no auge do ciclo.',
      'Comparar rácios de setores diferentes (um banco com uma tecnológica).',
      'Usar o lucro de um único ano, sem retirar ganhos únicos nem olhar para a média do ciclo.',
      'Ignorar a dívida: o PER não a vê, o EV/EBITDA já vê.',
      'Achar que a precisão de duas casas decimais torna o número mais certo. Os lucros são estimativas contabilísticas.']},

    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p12',x:`Os rácios aplicam-se a empresas portuguesas e estrangeiras da mesma maneira. Para comparar, compara o PER das empresas portuguesas com o de outras empresas do mesmo setor na Europa, e não com tecnológicas americanas: os mercados têm composições muito diferentes (ver «Índices: S&P 500, PSI e Euro Stoxx 50»). Como os rácios dos fundos e ETFs aparecem nas fichas dos produtos (por exemplo, o PER médio das empresas do índice), o que aprendeste aqui ajuda a perceber essa ficha. Os custos e os impostos que reduzem o retorno vêm em «Comissões e imposto do selo» e «Mais-valias: quanto imposto pagas ao vender».`},

    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'PER = preço ÷ lucro por ação: quantos anos de lucro pagas.',
      'O PER falha com lucros únicos, negócios cíclicos e empresas sem lucro.',
      'O EV/EBITDA inclui a dívida e compara melhor empresas muito endividadas com outras que não o são.',
      'O ROE pode ser inflacionado pela dívida: confirma com o ROIC.',
      'Rácios comparam-se com o setor e com o histórico, nunca de forma isolada.']},
    {t:'decide',id:'q3',ensina:['p5','n1'],label:'Decide',q:`Uma siderurgia, no melhor ano do ciclo, mostra um PER de ${_fu_n(_fu_R.preco/_fu_R.ciclo[0],1)}, muito abaixo do mercado. Qual é a leitura mais prudente?`,o:['Está claramente barata: compra-se','Pode ser o auge do ciclo: vê o lucro médio de vários anos antes de concluir','O PER baixo é sempre sinal de que a empresa vai subir'],c:1,why:'Em negócios cíclicos o PER é mais baixo quando os lucros estão no máximo, justamente quando mais tarde costumam descer. O lucro médio do ciclo dá uma imagem mais justa.'},
    {t:'decide',id:'q4',ensina:['c1','p7','p8'],label:'Decide',q:'Duas empresas têm o mesmo PER, mas uma tem muita dívida e a outra quase nenhuma. Que rácio ajuda a ver a diferença?',o:['O EV/EBITDA, porque inclui a dívida','O PER, porque já está igual','O rendimento do dividendo'],c:0,why:'O valor da empresa (EV) soma a dívida líquida ao valor em bolsa, por isso o EV/EBITDA revela o que o PER escondia.'},
    {t:'erro',id:'q5',ensina:['c2','p9','p10'],label:'Encontra o erro',q:'Uma destas frases está errada. Qual?',o:['O ROE pode aumentar apenas porque a empresa se endividou','O P/B é mais útil para bancos do que para empresas de software','Um PER baixo mostra sempre que a ação é uma boa compra','O PER «a seguir» usa lucros estimados'],c:2,why:'O PER baixo pode refletir um negócio em declínio, um ciclo no auge ou um lucro único. É um ponto de partida para investigar, não um sinal de compra.'}
  ], src:[] },

{ id:'dividendos-payout', topic:'fundamental', o:5, title:'Dividendos e payout', mins:8,
  lead:`Um dividendo alto parece apetecível, mas o que conta é se a empresa o consegue manter e de onde vem o dinheiro. O payout e o fluxo de caixa ajudam a perceber isso.`,
  blocks:[
    {t:'h',id:'h1',x:'Uma imagem para perceber'},
    {t:'p',id:'p0',x:`Pensa numa macieira. Todos os anos dá maçãs e podes comer algumas (o dividendo) e plantar o resto das sementes para ter mais árvores (reinvestir). Se comeres todas as maçãs e nunca plantares nada, a macieira não cresce. Se plantares tudo e nunca comeres, passas fome. Uma empresa tem esta escolha todos os anos: <b>distribuir o lucro</b> pelos sócios ou <b>reinvesti-lo</b> no negócio. O payout mede o equilíbrio entre as duas coisas.`},

    {t:'h',id:'h2',x:'Yield e payout, as duas contas'},
    {t:'p',id:'p1',x:`O <b>rendimento do dividendo</b> (<i>dividend yield</i>) é o dividendo anual dividido pelo preço da ação: diz quanto recebes por ano em dinheiro, em percentagem do que pagaste. O <b>payout</b> é a parte do lucro que a empresa distribui. Se o payout passa os 100%, a empresa paga mais do que ganha, e isso não se aguenta por muito tempo.`},
    {t:'w',id:'w1',w:'calc',c:'payout'},
    {t:'p',id:'p2',x:`Usemos uma empresa de exemplo, a <b>Energias do Tejo</b>. A ação custa ${_fu_D.preco} €, o lucro por ação é de ${_fu_D.lpa} € e paga ${_fu_n(_fu_D.div,1)} € de dividendo. O yield é ${_fu_n(_fu_D.div,1)} ÷ ${_fu_D.preco} = <b>${_fu_p(_fu_D.yld,0)}</b>. O payout é ${_fu_n(_fu_D.div,1)} ÷ ${_fu_D.lpa} = <b>${_fu_p(_fu_D.payout,0)}</b>. Os outros ${_fu_p(100-_fu_D.payout,0)} do lucro ficam na empresa e financiam o crescimento ou reduzem a dívida.`},
    {t:'p',id:'p3',x:`O payout sobre o lucro tem um defeito: o lucro é um número contabilístico. Por isso muitos analistas calculam também o <b>payout sobre o fluxo de caixa livre</b> (visto em «Fluxo de caixa livre: o dinheiro que sobra mesmo»). Se o fluxo de caixa livre por ação for ${_fu_n(_fu_D.fcf,1)} €, o dividendo de ${_fu_n(_fu_D.div,1)} € consome ${_fu_p(_fu_D.div/_fu_D.fcf*100,0)} do dinheiro livre. Um dividendo coberto pelo caixa é mais seguro do que um coberto só pelo lucro.`},

    {t:'h',id:'h3',x:'O dividendo não é dinheiro grátis'},
    {t:'p',id:'p4',x:`Quando a empresa paga o dividendo, o dinheiro sai do seu cofre. Por isso, no dia em que a ação passa a negociar «sem direito ao dividendo» (a <b>data ex-dividendo</b>), o preço tende a descer aproximadamente o valor pago. Se a ação estava a ${_fu_n(_fu_D.preco+3,0)} € e o dividendo é de ${_fu_n(_fu_D.div,1)} €, passa a ${_fu_n(_fu_D.preco+3-_fu_D.div,1)} € e tu recebes ${_fu_n(_fu_D.div,1)} € em dinheiro. Ficaste com o mesmo valor total, só mudou de forma. O dividendo muda de bolso, não cria riqueza.`},
    {t:'p',id:'p5',x:`O que cria riqueza é o <b>retorno total</b>: a variação do preço mais os dividendos recebidos. Se a ação sobe de ${_fu_D.preco} € para ${_fu_D.preco+3} € (+${_fu_p(3/_fu_D.preco*100,0)}) e recebes ${_fu_n(_fu_D.div,1)} €, o retorno total é (${_fu_D.preco+3} − ${_fu_D.preco} + ${_fu_n(_fu_D.div,1)}) ÷ ${_fu_D.preco} = <b>${_fu_p(_fu_D.rt,0)}</b>. Uma ação sem dividendos que subisse ${_fu_p(_fu_D.rt,0)} daria o mesmo resultado a quem a tem.`},

    {t:'h',id:'h4',x:'A armadilha do yield alto'},
    {t:'p',id:'p6',x:`Um <b>yield muito alto</b> pode ser um aviso. O yield é dividendo ÷ preço, e o preço está no denominador: se a ação cai para metade, o yield duplica sem que a empresa tenha feito nada. Se a Energias do Tejo cair de ${_fu_D.preco} € para ${_fu_D.preco2} € porque o mercado antecipa problemas, o yield passa a ${_fu_n(_fu_D.div,1)} ÷ ${_fu_D.preco2} = <b>${_fu_p(_fu_D.yld2,0)}</b>. Parece uma pechincha. Mas se o lucro por ação cair para ${_fu_D.lpa2} €, o payout passa a ${_fu_n(_fu_D.div,1)} ÷ ${_fu_D.lpa2} = <b>${_fu_p(_fu_D.payout2,0)}</b>, e o dividendo será provavelmente cortado.`},
    {t:'cmp',id:'c1',head:['Cenário','Preço','Dividendo','Lucro por ação','Yield','Payout'],rows:[
      ['Antes',_fu_n(_fu_D.preco,0)+' €',_fu_n(_fu_D.div,2)+' €',_fu_n(_fu_D.lpa,2)+' €',_fu_p(_fu_D.yld,0),_fu_p(_fu_D.payout,0)],
      ['Ação cai, dividendo igual',_fu_n(_fu_D.preco2,0)+' €',_fu_n(_fu_D.div,2)+' €',_fu_n(_fu_D.lpa2,2)+' €',_fu_p(_fu_D.yld2,0),_fu_p(_fu_D.payout2,0)],
      ['Dividendo cortado a metade',_fu_n(_fu_D.preco2,0)+' €',_fu_n(_fu_D.div/2,2)+' €',_fu_n(_fu_D.lpa2,2)+' €',_fu_p(_fu_D.div/2/_fu_D.preco2*100,0),_fu_p(_fu_D.div/2/_fu_D.lpa2*100,0)]],cap:'Valores de exemplo. O yield alto da segunda linha não era um presente: era o mercado a avisar.'},
    {t:'p',id:'p7',x:`Os dividendos <b>não são garantidos</b>; a empresa pode reduzi-los ou suspendê-los. É prática comum as empresas tentarem manter ou aumentar o dividendo, porque um corte assusta os acionistas, e por isso só o fazem quando têm mesmo de o fazer. Para o investidor, o corte costuma chegar junto com uma queda do preço.`},

    {t:'fazve',id:'q1',ensina:['p1','w1','p2'],q:'Uma empresa lucra 3 € por ação e paga 1,2 € de dividendo. Qual é o payout, em %?',unit:'%',answer:40,tol:.02,why:'1,2 ÷ 3 = 40%. A empresa distribui 40% do lucro e reinveste o resto.'},
    {t:'fazve',id:'q2',ensina:['p1','p2','p6'],q:`Uma ação custa ${_fu_D.preco2} € e paga ${_fu_n(_fu_D.div,1)} € de dividendo por ano. Qual é o rendimento do dividendo, em %?`,unit:'%',answer:_fu_r(_fu_D.yld2,1),tol:.02,why:`${_fu_n(_fu_D.div,1)} ÷ ${_fu_D.preco2} = ${_fu_n(_fu_D.yld2/100,2)}, isto é, ${_fu_n(_fu_D.yld2,0)}%. O mesmo dividendo rende mais quando o preço é mais baixo, mas isso não quer dizer que seja mais seguro.`},

    {t:'h',id:'h5',x:'Dividendos ou recompra de ações'},
    {t:'p',id:'p8',x:`Há outra forma de a empresa devolver dinheiro: <b>recomprar as suas próprias ações</b> no mercado. Imagina uma empresa com ${_fu_D.bb.acoes} milhões de ações a ${_fu_D.bb.preco} €, que ganha ${_fu_D.bb.lucro} M€. O lucro por ação é ${_fu_n(_fu_D.bb.lucro/_fu_D.bb.acoes,2)} €. Se usar ${_fu_D.bb.gasto} M€ para recomprar ${_fu_D.bb.rec} milhões de ações, passa a ter ${_fu_D.bb.acoes-_fu_D.bb.rec} milhões. Com o mesmo lucro, o lucro por ação sobe para ${_fu_n(_fu_D.bb.lucro/(_fu_D.bb.acoes-_fu_D.bb.rec),2)} € (+${_fu_p(_fu_D.bb.sobe)}), e cada acionista passa a ter uma fatia maior da empresa sem ter recebido um cêntimo.`},
    {t:'cmp',id:'c2',head:['','Dividendo','Recompra de ações'],rows:[
      ['O que recebes','Dinheiro, na tua conta','Nada diretamente: a tua fatia da empresa fica maior'],
      ['Flexibilidade da empresa','Baixa: cortá-lo assusta o mercado','Alta: pode comprar mais ou menos conforme o ano'],
      ['Quando é boa ideia','Quando a empresa não tem melhor uso para o dinheiro','Quando as ações estão baratas em relação ao valor'],
      ['Armadilha','Pagar mais do que o caixa permite','Comprar caro, ou comprar só para compensar ações dadas aos gestores']],cap:'Nenhuma é «melhor». O que importa é se a empresa escolhe bem.'},

    {t:'h',id:'h6',x:'O efeito do reinvestimento a longo prazo'},
    {t:'p',id:'p9',x:`Quem recebe dividendos pode gastá-los ou reinvesti-los. Com 10 000 € numa ação cujo preço sobe ${_fu_D.rr.pr}% ao ano e que paga ${_fu_D.rr.y}% de dividendo, ao fim de ${_fu_D.rr.anos} anos tens ${_e(_fu_D.rr.sem)} se gastares os dividendos (só o preço) e ${_e(_fu_D.rr.com)} se os reinvestires (retorno total de ${_fu_D.rr.pr+_fu_D.rr.y}% ao ano). A diferença, ${_e(_fu_D.rr.com-_fu_D.rr.sem)}, é o poder dos juros compostos que já viste em «Juros compostos: o efeito bola de neve». A conta não inclui impostos nem comissões, por isso é ilustrativa.`},

    {t:'h',id:'h7',x:'Um caso real: 2020'},
    {t:'p',id:'p10',x:`Em 2020, com a pandemia, muitas empresas cortaram ou suspenderam dividendos para preservar caixa, e os supervisores pediram aos bancos europeus que travassem as distribuições. Quem tinha construído um rendimento contando com esses dividendos viu esse rendimento desaparecer, ao mesmo tempo que os preços caíam. Foi uma lição prática: dividendo é uma decisão da administração, não um contrato. As empresas com payout baixo e muito caixa tiveram mais margem para manter o que pagavam.`},

    {t:'h',id:'h8',x:'Os erros que mais custam'},
    {t:'ul',id:'u1',x:[
      '<b>Escolher só pelo yield mais alto.</b> Costuma ser o preço que caiu, não um presente.',
      '<b>Ignorar o payout.</b> Um payout acima de 100% sobre o lucro ou sobre o fluxo de caixa livre é um sinal de alerta.',
      '<b>Achar que dividendo é rendimento «extra».</b> O preço desce na data ex-dividendo; o que conta é o retorno total.',
      '<b>Esquecer o imposto.</b> Em Portugal, o dividendo tem retenção na fonte; vê abaixo.',
      '<b>Nunca olhar para o histórico.</b> Cinco a dez anos de dividendos estáveis ou a crescer dizem mais do que um valor este ano.']},

    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p11',x:`Os dividendos recebidos em Portugal têm retenção na fonte de 28%, a título definitivo, feita pela entidade registadora ou depositária em Portugal (guia fiscal da AT). Com ${_fu_D.imp.n} ações a ${_fu_n(_fu_D.div,1)} € de dividendo, recebes ${_e(_fu_D.imp.bruto)} brutos, a retenção é ${_e(_fu_D.imp.ret)} e recebes ${_e(_fu_D.imp.liq)} líquidos. Se a corretora for estrangeira, a retenção em Portugal não é feita por ela e o rendimento é declarado por ti; o país da empresa também pode reter imposto. O tema «Dividendos e juros» explica o que se aplica a cada caso e «Declarar no IRS: Modelo 3, anexos G e J» mostra onde declarar. E o tema «ETFs de acumulação e de distribuição» compara receber dividendos com os ver reinvestidos dentro do ETF.`},

    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u2',x:[
      'Yield = dividendo ÷ preço; payout = dividendo ÷ lucro. Os dois juntos dão uma imagem mais completa.',
      'Payout acima de 100% (do lucro ou do fluxo de caixa livre) raramente se aguenta.',
      'Yield muito alto muitas vezes significa que o preço caiu porque se espera um corte.',
      'No dia ex-dividendo o preço desce aproximadamente o valor pago: o que conta é o retorno total.',
      'Dividendos e recompra de ações são duas formas de devolver dinheiro; em Portugal, os dividendos têm retenção de 28%.']},
    {t:'decide',id:'q3',ensina:['p3','p6','c1'],label:'Decide',q:'Uma ação paga um yield de 12%, muito acima do mercado, e o payout é de 140%. O que isto sugere?',o:['Um dividendo provavelmente insustentável','Um dividendo muito seguro','Que a ação está barata sem risco'],c:0,why:'Payout acima de 100% significa que a empresa paga mais do que lucra. É um sinal de que o dividendo pode ser cortado, e o yield tão alto pode ser o resultado de o preço ter caído.'},
    {t:'decide',id:'q4',ensina:['p4','p5'],label:'Decide',q:'Uma ação custa 50 € e paga 2 € de dividendo. No dia ex-dividendo, o que se espera que aconteça ao preço, tudo o resto igual?',o:['Sobe 2 €','Fica igual','Desce aproximadamente 2 €'],c:2,why:'O dinheiro saiu da empresa para ti. O valor total (preço + dividendo) mantém-se, por isso o preço desce aproximadamente o dividendo.'},
    {t:'erro',id:'q5',ensina:['p4','p6','p8','c2'],label:'Encontra o erro',q:'Uma destas frases está errada. Qual?',o:['A recompra de ações pode aumentar o lucro por ação','Um corte de dividendo costuma vir junto com más notícias','Os dividendos são garantidos enquanto a empresa for grande','O retorno total soma a variação do preço e os dividendos'],c:2,why:'Nenhum dividendo é garantido, por maior que seja a empresa. Quem o decide é a administração, em função do lucro e da caixa.'}
  ], src:[_AT_GUIA] },

{ id:'moat-qualidade', topic:'fundamental', o:6, title:'Vantagens competitivas (moat) e qualidade do negócio', mins:8,
  lead:`Dois negócios podem vender o mesmo produto e ter destinos muito diferentes: um ganha dinheiro durante décadas, o outro vive de baixar preços. A diferença chama-se vantagem competitiva, e Warren Buffett deu-lhe o nome de «fosso» (moat).`,
  blocks:[
    {t:'h',id:'h1',x:'Um castelo com um fosso'},
    {t:'p',id:'p1',x:`Imagina um castelo rodeado de água. O que protege os donos do castelo não são as muralhas, é o fosso: obriga os atacantes a pararem antes de chegar. Nos negócios, o «fosso» é o que impede os concorrentes de copiar o que a empresa faz e de lhe roubar clientes e lucros. Sem fosso, quando uma empresa começa a ganhar dinheiro a sério, aparecem logo outras a oferecer o mesmo mais barato, e os lucros desaparecem. Com fosso, os lucros altos duram.`},

    {t:'h',id:'h2',x:'De onde vem um fosso'},
    {t:'cmp',id:'c1',head:['Fonte','Como funciona','Exemplo inventado','Como se perde'],rows:[
      ['Marca','O cliente paga mais ou escolhe sem hesitar','A cerveja «Rocha»: as pessoas pedem-na pelo nome','Mudança de gosto, má qualidade, imitações'],
      ['Custos de mudança','Trocar de fornecedor é caro ou incómodo','Programa de faturação «ContaSimples», com anos de dados dentro','Um concorrente que facilite a migração'],
      ['Efeito de rede','Quanto mais gente usa, mais vale para todos','Marketplace «PraçaOnline»: vendedores vão onde estão os compradores','Uma plataforma melhor leva a rede consigo'],
      ['Escala e custos baixos','Produzir mais barato do que os outros','Logística «Beira»: tem mais camiões a fazer a mesma rota','Alguém igualar a escala ou mudar a tecnologia'],
      ['Ativos intangíveis','Patentes, licenças, direitos exclusivos','Farmacêutica «Lusa Lab» com patente de um medicamento','A patente termina ou é contornada'],
      ['Regulação ou monopólio natural','A lei ou a geografia limitam a concorrência','Concessão de águas «Águas do Norte»','Mudança de regras ou preços regulados baixos']],cap:'As empresas são inventadas. Uma empresa real pode ter mais do que um tipo de fosso.'},
    {t:'p',id:'p2',x:`Uma forma de organizar o pensamento é perguntar: <b>1.</b> Porque é que os clientes compram a esta empresa e não à concorrência? <b>2.</b> O que impede um concorrente rico de fazer o mesmo? <b>3.</b> Essa barreira vai ser mais forte ou mais fraca daqui a dez anos? Se as respostas forem vagas («tem boa gestão», «é líder»), provavelmente não há um fosso, há apenas um bom momento.`},

    {t:'h',id:'h3',x:'Como se vê um fosso nos números'},
    {t:'p',id:'p3',x:`O fosso aparece no <b>ROIC</b>, a rentabilidade do capital investido (explicada em «PER e outros rácios»). Cada empresa tem de pagar pelo capital que usa: o <b>custo do capital</b>, o retorno mínimo que os investidores exigem. Se o ROIC é superior a esse custo, a empresa <b>cria valor</b>; se é inferior, destrói-o. O que o fosso faz é manter o ROIC alto durante muito tempo, sem que a concorrência o puxe para baixo.`},
    {t:'p',id:'p4',x:`Duas empresas de exemplo, cada uma com ${_fu_V.cap} M€ de capital investido e um custo de capital de ${_fu_V.k}% (valor de exemplo). A <b>Cerveja Rocha</b> tem uma marca forte e um ROIC de ${_fu_V.r.roic}%. A <b>Aço Comum</b> vende uma mercadoria sem diferenças e tem um ROIC de ${_fu_V.a.roic}%.`},
    {t:'cmp',id:'c2',head:['','Cerveja Rocha','Aço Comum'],rows:[
      ['ROIC',_fu_p(_fu_V.r.roic,0),_fu_p(_fu_V.a.roic,0)],
      ['Custo do capital',_fu_p(_fu_V.k,0),_fu_p(_fu_V.k,0)],
      ['<b>Diferença (spread)</b>','<b>'+_fu_n(_fu_V.r.roic-_fu_V.k,0)+' pontos percentuais</b>','<b>'+_fu_n(_fu_V.a.roic-_fu_V.k,0)+' pontos percentuais</b>'],
      ['Valor criado por ano',_fu_M(_fu_V.cap*(_fu_V.r.roic-_fu_V.k)/100),_fu_M(_fu_V.cap*(_fu_V.a.roic-_fu_V.k)/100)],
      ['Margem operacional (5 anos, %)',_fu_V.r.m.join(' · '),_fu_V.a.m.join(' · ')],
      ['Variação das margens (mín. a máx.)',_fu_V.r.min+'% a '+_fu_V.r.max+'%',_fu_V.a.min+'% a '+_fu_V.a.max+'%']],cap:'«Valor criado» = capital investido × (ROIC − custo do capital). Valores de exemplo.'},
    {t:'p',id:'p5',x:`A Rocha ganha ${_fu_n(_fu_V.r.roic-_fu_V.k,0)} pontos acima do que o capital exige e tem margens estáveis, sinal de que consegue manter preços. A Aço Comum rende menos do que o capital custa (cria valor negativo) e as margens saltam com o ciclo, sinal de que não manda nos preços. Em geral, <b>poder de fixar preços</b> é um dos melhores testes: se a empresa sobe preços e não perde clientes, tem fosso.`},
    {t:'p',id:'p6',x:`O fosso torna-se enorme ao longo do tempo. Se uma empresa conseguir reinvestir os lucros à mesma rentabilidade, 100 € a ${_fu_V.r.roic}% ao ano viram ${_e(_fu_V.r.f10)} em 10 anos; os mesmos 100 € a ${_fu_V.a.roic}% viram ${_e(_fu_V.a.f10)}. É um cenário de livro de texto (raramente há tantos projetos novos que rendam o mesmo), mas mostra porque é que os investidores valorizam tanto a qualidade: <b>é a rentabilidade, mantida durante anos, que compõe</b>.`},

    {t:'fazve',id:'q1',ensina:['p3','p4','c2'],q:`Uma empresa tem ${_fu_V.q.cap} M€ de capital investido, ROIC de ${_fu_V.q.roic}% e um custo de capital de ${_fu_V.q.k}%. Quantos milhões de euros de valor cria por ano?`,unit:'M€',answer:_fu_V.q.cap*(_fu_V.q.roic-_fu_V.q.k)/100,tol:.02,why:`${_fu_V.q.cap} × (${_fu_V.q.roic}% − ${_fu_V.q.k}%) = ${_fu_V.q.cap} × ${_fu_n(_fu_V.q.roic-_fu_V.q.k,0)}% = ${_fu_n(_fu_V.q.cap*(_fu_V.q.roic-_fu_V.q.k)/100,1)} M€. É o excesso sobre o que o capital exigia.`},

    {t:'h',id:'h4',x:'Qualidade não é o mesmo que preço baixo'},
    {t:'p',id:'p7',x:`Uma empresa com fosso é uma boa empresa. Isso não a torna automaticamente um bom investimento: depende do preço. Se pagares hoje o valor de todo o futuro brilhante, e um pouco mais, os teus retornos serão baixos mesmo que a empresa corra bem. O inverso também é verdade: uma empresa média comprada muito barata pode render bem. Por isso este tema é uma parte da análise; as outras são o preço e a avaliação (ver «Como avaliar uma empresa» e «Valor intrínseco e fluxos de caixa descontados (DCF), explicado sem medo»).`},
    {t:'ul',id:'u1',x:[
      '<b>Perguntas qualitativas:</b> o produto é difícil de substituir? Os clientes voltam? Há alternativas baratas?',
      '<b>Números a ver durante 5 a 10 anos:</b> ROIC acima do custo do capital, margens estáveis ou a subir, quota de mercado, dívida controlada.',
      '<b>Sinais de alarme:</b> margens a descer de ano para ano, preços a baixar para manter clientes, investimento enorme só para não perder terreno.',
      '<b>Gestão:</b> honestidade e boa alocação do dinheiro (não gastar o caixa em aquisições caras) importam tanto como o fosso.']},

    {t:'h',id:'h5',x:'Um caso real: Kodak'},
    {t:'p',id:'p8',x:`Durante grande parte do século XX, a Kodak dominava a fotografia: tinha a marca, os filmes e as máquinas que quase todos usavam, e o seu negócio de películas dava lucros enormes. Quando a fotografia digital chegou (e a própria Kodak foi das primeiras a desenvolvê-la), o fosso do rolo desapareceu, porque as pessoas deixaram de comprar películas. A Kodak pediu a proteção de falência em 2012. A lição não é que a Kodak era má empresa; é que <b>o fosso de ontem não garante o de amanhã</b>. As melhores vantagens são as que resistem a mudanças de tecnologia e de hábitos, e é preciso voltar a verificá-las todos os anos.`},

    {t:'h',id:'h6',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      '<b>Ver fosso em tudo.</b> Quase toda a empresa diz que tem «vantagens competitivas». Pede números que as sustentem.',
      '<b>Confundir popularidade com fosso.</b> Ser muito conhecido não impede alguém de fazer o mesmo mais barato.',
      '<b>Pagar qualquer preço pela qualidade.</b> Boa empresa a preço excessivo continua a ser má compra.',
      '<b>Esquecer a mudança tecnológica.</b> Um fosso que depende de uma tecnologia só dura enquanto ela não for superada.',
      '<b>Julgar só por um bom ano.</b> O fosso vê-se na consistência, e a consistência vê-se em vários anos.']},
    {t:'note',id:'n1',x:'Avaliar um fosso é um julgamento, não uma medição. Duas pessoas competentes podem concordar nos números e discordar sobre se a vantagem vai durar. Por isso, há quem prefira simplesmente comprar um ETF diversificado em vez de escolher empresas.'},

    {t:'h',id:'h7',x:'Em Portugal'},
    {t:'p',id:'p9',x:`O mercado português é pequeno, com poucas dezenas de empresas cotadas e muitas ligadas a setores com regras próprias (energia, água, telecomunicações, banca), onde o «fosso» é muitas vezes uma concessão ou uma licença, o que traz proteção mas também preços e retornos decididos por reguladores. Para comparar com o resto do mundo, convém olhar também para as empresas europeias e globais que se compram através da corretora e dos ETFs (ver «ETFs e diversificação: o que se compra em Portugal»). O tema «Ações» explica o que significa ser acionista e como se compram.`},

    {t:'h',id:'h8',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'Um fosso é o que protege os lucros de uma empresa da concorrência: marca, custos de mudança, rede, escala, patentes ou regulação.',
      'Vê-se nos números: ROIC acima do custo do capital durante muitos anos e margens estáveis.',
      'Poder de subir preços sem perder clientes é um dos melhores testes.',
      'Os fossos podem desaparecer (Kodak): reavalia todos os anos.',
      'Qualidade não é preço: uma boa empresa comprada cara pode ser um mau investimento.']},
    {t:'decide',id:'q2',ensina:['p3','p5','c2'],label:'Decide',q:'Uma empresa tem ROIC de 6% e o custo do capital é de 8%. Mesmo com lucros positivos, o que isso quer dizer?',o:['Que cria valor para os acionistas','Que destrói valor: não rende o que o capital custa','Que tem um fosso forte'],c:1,why:'Para criar valor, o retorno do capital tem de superar o seu custo. Abaixo disso, mesmo com lucro contabilístico, cada euro investido rende menos do que as alternativas.'},
    {t:'decide',id:'q3',ensina:['c1','p2'],label:'Decide',q:'Uma empresa diz ter «uma marca forte». Qual destes sinais confirma melhor que há mesmo um fosso?',o:['Está nos jornais todos os dias','Consegue subir preços de forma regular sem perder clientes','Tem muitos funcionários'],c:1,why:'Poder de preço, visto em margens estáveis ou crescentes, é a prova prática de que os clientes a preferem. Fama e dimensão não são prova.'},
    {t:'erro',id:'q4',ensina:['p7','h5','p8'],label:'Encontra o erro',q:'Uma destas frases está errada. Qual?',o:['Um fosso pode desaparecer com uma mudança tecnológica','Uma boa empresa é sempre um bom investimento, seja qual for o preço','O ROIC acima do custo do capital durante muitos anos é um bom sinal','Margens muito instáveis sugerem pouco poder de fixar preços'],c:1,why:'O preço pago pesa tanto como a qualidade. Pagar demasiado por um bom negócio pode dar retornos fracos.'}
  ], src:[] },

{ id:'avaliar-empresa', topic:'fundamental', o:7, title:'Como avaliar uma empresa', mins:8,
  lead:`Avaliar é estimar quanto vale uma empresa e comparar com o preço. O preço é o que pagas; o valor é o que recebes. A habilidade está em perceber a diferença, e em aceitar que ninguém a mede com exatidão.`,
  blocks:[
    {t:'h',id:'h1',x:'Preço e valor são coisas diferentes'},
    {t:'p',id:'p0',x:`Quando compras uma casa, ninguém te diz que ela «vale» o que pagas: negoceias, comparas com casas parecidas, vês a renda que daria, estimas as obras. Com as ações é igual, mas o preço aparece todos os dias no ecrã e tem-se a ilusão de que é o valor. O grande investidor Benjamin Graham deu a esta confusão uma imagem famosa: o <b>Sr. Mercado</b>, um sócio maníaco-depressivo que todos os dias aparece a oferecer-se para comprar ou vender a sua parte. Há dias em que pede muito (está eufórico) e dias em que aceita quase nada (está em pânico). Não és obrigado a aceitar nenhuma das ofertas, e a vantagem é tua se souberes quanto a tua parte vale.`},

    {t:'h',id:'h2',x:'As perguntas, por ordem'},
    {t:'p',id:'p1',x:`Uma abordagem simples tem três perguntas: <b>1.</b> O negócio é compreensível e tem vantagens competitivas (marca, escala, tecnologia)? <b>2.</b> Os resultados são sólidos e a dívida controlada? <b>3.</b> O <b>preço</b> é razoável em relação ao que a empresa ganha e vai ganhar? As duas primeiras não dependem do preço e filtram empresas. Só depois de passarem faz sentido gastar tempo com a terceira.`},
    {t:'ul',id:'u0',x:[
      '<b>O negócio:</b> consegues explicá-lo em duas frases? De onde vem o dinheiro? (Ver «Vantagens competitivas (moat) e qualidade do negócio».)',
      '<b>A saúde financeira:</b> lucros e caixa consistentes, dívida suportável. (Ver «Demonstrações financeiras», «O balanço a fundo: dívida, liquidez e solvência» e «Fluxo de caixa livre: o dinheiro que sobra mesmo».)',
      '<b>O preço:</b> compara-se com o valor estimado. É o que fazemos neste tema.']},

    {t:'h',id:'h3',x:'Três maneiras de estimar o valor'},
    {t:'cmp',id:'c1',head:['Método','Ideia','Bom para','Limite'],rows:[
      ['Múltiplos (comparação)','Aplicar o PER ou o EV/EBITDA típico do setor ao lucro da empresa','Empresas estáveis, com concorrentes parecidos','Se o setor inteiro está caro (ou barato), o método herda o erro'],
      ['Valor dos ativos','Somar o que a empresa tem e subtrair o que deve','Bancos, imobiliárias, empresas em liquidação','Ignora o valor do negócio em funcionamento e os ativos que valem menos do que o registado'],
      ['Fluxos de caixa descontados (DCF)','Estimar o dinheiro livre futuro e trazê-lo para o presente','Negócios com fluxos de caixa previsíveis','Muito sensível aos pressupostos (ver «Valor intrínseco e fluxos de caixa descontados (DCF), explicado sem medo»)']],cap:'Os profissionais usam os três ao mesmo tempo para ver se concordam entre si.'},

    {t:'h',id:'h4',x:'Um exemplo com números'},
    {t:'p',id:'p2',x:`As <b>Padarias Vieira</b> (empresa de exemplo) ganharam ${_fu_n(_fu_X.lpa,2)} € por ação. As empresas parecidas do setor negoceiam em média a PER ${_fu_X.perSetor}. Aplicando esse múltiplo, o valor estimado é ${_fu_X.perSetor} × ${_fu_n(_fu_X.lpa,2)} = <b>${_fu_n(_fu_X.v,0)} €</b> por ação. A ação custa ${_fu_X.preco} €.`},
    {t:'p',id:'p3',x:`A <b>margem de segurança</b> é a diferença entre o que estimas que vale e o que pagas, em percentagem do valor: (${_fu_n(_fu_X.v,0)} − ${_fu_X.preco}) ÷ ${_fu_n(_fu_X.v,0)} = <b>${_fu_p(_fu_X.ms,0)}</b>. Dá folga se te enganares: se o valor real for 20% menor do que estimaste, ainda não pagas mais do que vale.`},
    {t:'p',id:'p4',x:`Só que uma estimativa única dá uma falsa sensação de precisão. É melhor pensar em cenários. Para as Padarias Vieira: num cenário <b>pessimista</b> (concorrência nova, margens a descer) vale ${_fu_X.cen[0].v} € com ${_fu_X.cen[0].p}% de probabilidade; no <b>base</b>, ${_fu_X.cen[1].v} € com ${_fu_X.cen[1].p}%; no <b>otimista</b>, ${_fu_X.cen[2].v} € com ${_fu_X.cen[2].p}%. O valor esperado é a média ponderada: <b>${_fu_n(_fu_X.esp,2)} €</b>. Em relação ao preço de ${_fu_X.preco} €, a margem de segurança fica em ${_fu_p(_fu_X.msEsp,0)}, e no pior cenário perdes ${_fu_p((1-_fu_X.cen[0].v/_fu_X.preco)*100,0)} do que pagaste. Convém saber que perdas aguentas antes de decidir.`},
    {t:'stat',id:'s1',v:Math.round(_fu_X.ms),fmt:'pct',label:'margem de segurança das Padarias Vieira no cenário base, com os valores de exemplo'},

    {t:'h',id:'h5',x:'A armadilha do «barato»'},
    {t:'p',id:'p5',x:`Um PER baixo parece uma pechincha. Mas imagina a <b>Têxtil Velha</b>, cuja ação custa ${_fu_X.trap.preco} € e que ganha ${_fu_n(_fu_X.trap.l[0],2)} € por ação: PER ${_fu_n(_fu_X.trap.preco/_fu_X.trap.l[0],1)}. Só que o lucro vem a cair ${_fu_X.trap.queda}% ao ano porque os clientes se mudaram para concorrentes. Se o preço ficar igual, o PER sobre os lucros dos quatro anos seguintes sobe para ${_fu_X.trap.l.slice(1).map(l=>_fu_n(_fu_X.trap.preco/l,1)).join(', ')}. Quem pagou PER ${_fu_n(_fu_X.trap.preco/_fu_X.trap.l[0],1)} comprou uma <b>armadilha de valor</b>: uma empresa barata por boas razões. O preço baixo era o mercado a avisar.`},
    {t:'p',id:'p6',x:`O inverso também acontece: empresas com PER alto podem justificar-se se o crescimento for sólido e duradouro. O que não se justifica é pagar por crescimento sem lucros que o sustentem, e por isso convém desconfiar de histórias que «explicam» preços sem números que as apoiem.`},
    {t:'ul',id:'u1',x:[
      'Ninguém acerta sempre: as estimativas dependem de pressupostos sobre o futuro.',
      'Olha para vários anos, não só para o último.',
      'Desconfia de histórias que justificam preços sem lucros que os sustentem.',
      'Se não percebes o negócio, não investes.']},

    {t:'fazve',id:'q1',ensina:['p2','p3'],q:`Estimas que uma empresa vale ${_fu_X.q.v} € por ação e ela custa ${_fu_X.q.p} €. Qual é a margem de segurança, em %?`,unit:'%',answer:(_fu_X.q.v-_fu_X.q.p)/_fu_X.q.v*100,tol:.02,why:`(${_fu_X.q.v} − ${_fu_X.q.p}) ÷ ${_fu_X.q.v} = ${_fu_n((_fu_X.q.v-_fu_X.q.p)/_fu_X.q.v,2)}, ou seja, ${_fu_n((_fu_X.q.v-_fu_X.q.p)/_fu_X.q.v*100,0)}%. É a folga que tens se o valor real for mais baixo do que a tua estimativa.`},

    {t:'h',id:'h6',x:'Um caso real: o Sr. Mercado em ação'},
    {t:'p',id:'p7',x:`Entre 2007 e março de 2009, as bolsas de todo o mundo caíram muito durante a crise financeira. Muitas empresas de qualidade, com lucros e balanços sólidos, chegaram a ser negociadas a preços que implicavam o fim do seu negócio, e os investidores que tinham feito os trabalhos de casa conseguiram comprar com grande margem de segurança. Mas só os que conseguiam suportar a queda, sem vender em pânico, aproveitaram. Em 2021, no extremo oposto, o Sr. Mercado pagou preços altíssimos por empresas sem lucros. Ambos os casos mostram a mesma coisa: o preço oscila bastante mais do que o valor.`},

    {t:'h',id:'h7',x:'Os limites do método'},
    {t:'p',id:'p8',x:`Avaliar empresas é uma arte com contas, não uma ciência exata. Duas pessoas competentes chegam a valores diferentes com os mesmos dados, e o mercado já tem milhares de analistas a fazer o mesmo trabalho, por isso é difícil ter uma vantagem. Muitos estudos mostram que a maioria dos gestores ativos, depois de custos, não consegue bater um índice simples durante muitos anos (ver «Indexado ou gestão ativa»). Isto não quer dizer que seja impossível, quer dizer que exige tempo, método e humildade, e que o resultado é incerto.`},
    {t:'note',id:'n1',x:'Para a maior parte das pessoas, um ETF diversificado dispensa este trabalho. Analisar empresas dá gosto e pode ser uma pequena parte da carteira, mas exige tempo.'},

    {t:'h',id:'h8',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      '<b>Apaixonar-se pela empresa.</b> Gostar do produto não é o mesmo que a ação estar barata.',
      '<b>Fazer uma estimativa única e fingir que é certa.</b> Usa intervalos e cenários.',
      '<b>Ignorar a margem de segurança.</b> Quem compra «pelo preço justo» fica sem folga para o erro.',
      '<b>Comprar só pelo PER baixo.</b> A armadilha de valor mostra que barato pode ser caro.',
      '<b>Ajustar os pressupostos para justificar o que já queres comprar.</b> É o viés de confirmação em ação (ver «Vieses que custam dinheiro»).']},

    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p9',x:`Para as empresas portuguesas, os preços e as contas encontram-se nos sítios da própria empresa e da CMVM (ver «Onde ler as contas de uma empresa: relatórios anuais, CMVM e sites de relações com investidores»). Qualquer ganho que daí resulte tem imposto próprio: «Mais-valias: quanto imposto pagas ao vender». Como a margem de segurança é bruta, convém contar também as comissões e o imposto (ver «Comissões e imposto do selo») quando decides se compensa mesmo.`},

    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'Preço é o que pagas, valor é o que recebes: a diferença é a base de investir em empresas.',
      'Primeiro o negócio e a saúde financeira; só depois o preço.',
      'Há três métodos (múltiplos, ativos, DCF) e convém usá-los em conjunto.',
      'Margem de segurança = (valor − preço) ÷ valor; dá folga aos erros.',
      'Barato pode ser uma armadilha; usa cenários, não uma estimativa só.']},
    {t:'decide',id:'q2',ensina:['p3','p4'],label:'Decide',q:'Qual destas frases descreve melhor a «margem de segurança»?',o:['Comprar só ações que nunca caíram','Ter muitas ações ao mesmo tempo','Pagar bem menos do que estimas que a empresa vale, para teres folga se te enganares'],c:2,why:'A margem de segurança é a folga entre o valor estimado e o preço pago. Quanto maior, mais erro de estimativa aguentas.'},
    {t:'decide',id:'q3',ensina:['p5','p6'],label:'Decide',q:'Uma empresa tem PER 5, o lucro cai todos os anos e o preço não mexe. O que é provável?',o:['Que fique mais barata a cada ano, porque o PER desce','Que o PER suba com o tempo, mostrando que não era tão barata como parecia','Nada, o PER baixo garante um bom negócio'],c:1,why:'Se o lucro cai e o preço fica, o preço a dividir por um lucro menor dá um PER mais alto. É o que acontece numa armadilha de valor.'},
    {t:'erro',id:'q4',ensina:['p0','p3','p5'],label:'Encontra o erro',q:'Uma destas frases sobre avaliação está errada. Qual?',o:['Uma boa empresa pode ser um mau investimento se o preço for demasiado alto','O preço e o valor são a mesma coisa','Convém olhar para vários anos de resultados','A margem de segurança dá folga a erros de estimativa'],c:1,why:'O preço é o que pagas; o valor é o que a empresa vale. A diferença entre os dois é a base do investimento em valor.'}
  ], src:[] },

{ id:'dcf-valor-intrinseco', topic:'fundamental', o:8, title:'Valor intrínseco e fluxos de caixa descontados (DCF), explicado sem medo', mins:8,
  lead:`O valor de uma empresa é, no fundo, todo o dinheiro que vai gerar no futuro, trazido para hoje. O DCF é a conta que faz isso. Parece assustador, mas são cinco passos, e é mais útil para perceber o que o preço assume do que para obter um número «exato».`,
  blocks:[
    {t:'h',id:'h1',x:'Primeiro, a ideia do dinheiro no tempo'},
    {t:'p',id:'p1',x:`Se te oferecessem 100 € hoje ou 100 € daqui a um ano, preferias hoje: podias pô-los num depósito, ou perdê-los para a inflação (ver «Porque é que o dinheiro parado perde valor»). Por isso, 100 € no futuro valem menos do que 100 € agora. Quanto menos? Depende da taxa que consideras razoável. Com uma taxa de ${_fu_K.r0}% ao ano, 100 € daqui a um ano valem hoje 100 ÷ ${_fu_n(1+_fu_K.r0/100,2)} = <b>${_fu_n(100/(1+_fu_K.r0/100),2)} €</b>. E 100 € daqui a dois anos valem 100 ÷ ${_fu_n(1+_fu_K.r0/100,2)}² = <b>${_fu_n(100/Math.pow(1+_fu_K.r0/100,2),2)} €</b>. Este processo, o inverso dos juros compostos que viste em «Juros compostos: o efeito bola de neve», chama-se <b>desconto</b>, e a taxa chama-se <b>taxa de desconto</b>.`},

    {t:'h',id:'h2',x:'As cinco etapas do DCF'},
    {t:'ul',id:'u1',x:[
      '<b>1. Estima os fluxos de caixa livres</b> dos próximos anos (normalmente 5 a 10): o dinheiro que sobra depois do investimento, como em «Fluxo de caixa livre: o dinheiro que sobra mesmo».',
      '<b>2. Escolhe a taxa de desconto</b>: o retorno mínimo que exiges para correr o risco desta empresa.',
      '<b>3. Calcula o valor de continuidade</b>: o que a empresa vale depois do último ano projetado, assumindo um crescimento modesto para sempre.',
      '<b>4. Desconta tudo para hoje e soma</b>, obtendo o valor da empresa.',
      '<b>5. Subtrai a dívida líquida</b> e divide pelo número de ações: o valor por ação.']},

    {t:'h',id:'h3',x:'Um exemplo completo'},
    {t:'p',id:'p2',x:`A <b>Hortas do Sul</b> (empresa de exemplo) gerou ${_fu_K.fcf0} M€ de fluxo de caixa livre este ano. Assumimos que cresce ${_fu_K.g}% ao ano nos próximos ${_fu_K.n} anos, que depois cresce ${_fu_K.gt}% ao ano para sempre (um ritmo próximo do crescimento da economia), e que a taxa de desconto é ${_fu_K.r}%. Tem ${_fu_K.debt} M€ de dívida líquida e ${_fu_K.sh} milhões de ações.`},
    {t:'cmp',id:'c1',head:['Ano','Fluxo de caixa livre (M€)','Fator de desconto','Valor hoje (M€)'],rows:[
      ..._fu_K.base.rows.map(([t,f,d])=>[String(t),_fu_n(f,2),_fu_n(Math.pow(1+_fu_K.r/100,-t),3),_fu_n(d,2)]),
      ['<b>Soma dos 5 anos</b>','','','<b>'+_fu_n(_fu_K.base.pv,1)+'</b>']],cap:'Fator de desconto = 1 ÷ (1 + taxa)^ano. Valores de exemplo.'},
    {t:'p',id:'p3',x:`O <b>valor de continuidade</b> (<i>terminal value</i>) capta tudo o que vem depois do ano ${_fu_K.n}. A fórmula usual é: fluxo do ano seguinte ÷ (taxa de desconto − crescimento). Aqui, o fluxo do ano ${_fu_K.n} é ${_fu_n(_fu_K.base.rows[_fu_K.n-1][1],2)} M€; no ano seguinte será ${_fu_n(_fu_K.base.rows[_fu_K.n-1][1]*(1+_fu_K.gt/100),2)} M€. Dividindo por (${_fu_K.r}% − ${_fu_K.gt}%) = ${_fu_K.r-_fu_K.gt}% dá <b>${_fu_n(_fu_K.base.tv,1)} M€</b>, que no ano ${_fu_K.n} valem ${_fu_n(_fu_K.base.pvtv,1)} M€ hoje depois de descontar ${_fu_K.n} anos.`},
    {t:'cmp',id:'c2',head:['Passo','Valor (M€)'],rows:[
      ['Fluxos dos 5 anos, trazidos para hoje',_fu_n(_fu_K.base.pv,1)],
      ['Valor de continuidade, trazido para hoje',_fu_n(_fu_K.base.pvtv,1)],
      ['<b>Valor da empresa</b>','<b>'+_fu_n(_fu_K.base.ev,1)+'</b>'],
      ['Menos dívida líquida','−'+_fu_n(_fu_K.debt,1)],
      ['<b>Valor para os acionistas</b>','<b>'+_fu_n(_fu_K.base.eq,1)+'</b>'],
      ['Dividido por '+_fu_K.sh+' milhões de ações','<b>'+_fu_n(_fu_K.base.ps,2)+' € por ação</b>']]},
    {t:'p',id:'p4',x:`Repara que o valor de continuidade pesa <b>${_fu_p(_fu_K.base.tvShare*100,0)}</b> do valor da empresa. É normal: a maior parte do valor de um negócio está no futuro distante, que é onde as estimativas são mais incertas. Se tiveres de desconfiar de um pedaço do DCF, desconfia deste.`},
    {t:'stat',id:'s1',v:Math.round(_fu_K.base.tvShare*100),fmt:'pct',label:'do valor da Hortas do Sul vem do que se assume depois do 5.º ano'},

    {t:'fazve',id:'q1',ensina:['p1'],q:`Com uma taxa de desconto de ${_fu_K.q.r}% ao ano, quanto valem hoje ${_fu_K.q.v} € que vais receber daqui a ${_fu_K.q.n} anos? (em €, uma casa decimal)`,unit:'€',answer:_fu_r(_fu_K.q.v/Math.pow(1+_fu_K.q.r/100,_fu_K.q.n),1),tol:.01,why:`${_fu_K.q.v} ÷ ${_fu_n(1+_fu_K.q.r/100,2)}^${_fu_K.q.n} = ${_fu_n(_fu_K.q.v/Math.pow(1+_fu_K.q.r/100,_fu_K.q.n),2)} €. Quanto mais longe e quanto maior a taxa, menos vale hoje.`},

    {t:'h',id:'h4',x:'O que acontece quando mudas os pressupostos'},
    {t:'p',id:'p5',x:`Eis o ponto mais importante do tema. Vamos mudar a taxa de desconto e o crescimento de longo prazo, mantendo tudo o resto. O valor por ação de ${_fu_n(_fu_K.base.ps,2)} € passa a:`},
    {t:'cmp',id:'c3',head:['Taxa de desconto','Crescimento 1%','Crescimento 2%','Crescimento 3%'],rows:_fu_K.sens.map(([r,v])=>[r+'%',..._fu_K.gs.map((g,i)=>_fu_n(v[i],2)+' €')]),cap:'Valor por ação em euros. Só mudámos duas variáveis em ±1 ponto.'},
    {t:'p',id:'p6',x:`Mudar a taxa em 1 ponto e o crescimento em 1 ponto faz o valor andar entre ${_fu_n(_fu_K.min,2)} € e ${_fu_n(_fu_K.max,2)} €, uma amplitude de ${_fu_p((_fu_K.max/_fu_K.min-1)*100,0)}. Nenhuma das duas variáveis pode ser conhecida com essa precisão. Por isso, o DCF não dá «o» valor: dá um <b>intervalo</b>, e a conclusão fica mais fiável quando o preço está bem fora dele.`},

    {t:'h',id:'h5',x:'Usar o DCF ao contrário'},
    {t:'p',id:'p7',x:`Há uma forma mais honesta de usar este método: o <b>DCF inverso</b>. Em vez de estimar o valor, partes do preço e perguntas-te «que crescimento tem de acontecer para este preço fazer sentido?». Se a Hortas do Sul custar ${_fu_K.preco} € por ação, mantendo a taxa e o crescimento de longo prazo, o preço implica um crescimento de cerca de <b>${_fu_p(_fu_K.impl,1)} ao ano</b> nos primeiros cinco anos (contra ${_fu_K.g}% do nosso cenário). Agora a pergunta é outra e mais fácil de pensar: achas que a empresa consegue crescer mais do que isso? Se sim, o preço dá-te folga. Se o preço implicasse um crescimento muito acima do que o setor alguma vez fez, saberias que o mercado exige demasiado, e isso é útil saber antes de comprar.`},

    {t:'h',id:'h6',x:'De onde vem a taxa de desconto'},
    {t:'p',id:'p8',x:`A taxa de desconto é o retorno que exiges. Um ponto de partida é o que consegues com pouco risco, como os depósitos, as obrigações do Tesouro ou os Certificados (ver «Obrigações» e «Certificados de Aforro e do Tesouro»); depois somas um prémio pelo risco de ser acionista desta empresa. As empresas mais estáveis merecem taxas mais baixas, as mais arriscadas taxas mais altas. Os profissionais usam fórmulas mais elaboradas (como o custo médio ponderado do capital), mas o princípio é este. Valores de referência mudam com as taxas de juro, por isso não os escrevemos aqui: consulta-os no Banco de Portugal ou no IGCP.`},

    {t:'h',id:'h7',x:'Um caso real: 2022 e as taxas de juro'},
    {t:'p',id:'p9',x:`Em 2022 os bancos centrais subiram as taxas de juro depressa para combater a inflação (ver «Bancos centrais e taxas de juro»). Em muitas empresas de crescimento, cujo valor está sobretudo em lucros distantes, as cotações caíram muito, mais do que as de empresas já maduras. O DCF explica porquê: a taxa de desconto sobe e os fluxos mais longínquos valem menos hoje, como mostra a nossa tabela de sensibilidade. O mesmo negócio, com os mesmos lucros previstos, passou a valer menos porque o dinheiro passou a custar mais.`},

    {t:'h',id:'h8',x:'Os limites e os erros comuns'},
    {t:'ul',id:'u2',x:[
      '<b>Entra lixo, sai lixo.</b> A conta é exata, os pressupostos não. Um DCF bem apresentado pode esconder estimativas muito otimistas.',
      '<b>Precisão enganadora.</b> Dar um valor de 16,78 € não o torna mais certo do que 16 € a 17 €.',
      '<b>Crescimento perpétuo irrealista.</b> Assumir que uma empresa cresce para sempre mais do que a economia não faz sentido.',
      '<b>Funciona mal em alguns negócios.</b> Em empresas sem fluxos previsíveis (start-ups ainda sem lucros) e em bancos, o método é muito difícil de aplicar.',
      '<b>Ajustar o DCF até dar o preço desejado.</b> Se mexes nos pressupostos até o valor te agradar, não estás a avaliar, estás a justificar.']},
    {t:'note',id:'n1',x:'O DCF é uma ferramenta para pensar, não uma máquina de previsões. Vale pela disciplina de obrigar a escrever o que se assume, e de ver quão sensível o resultado é.'},

    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p10',x:`O método é o mesmo em qualquer país. Em Portugal, o que muda é o que fica no teu bolso: os dividendos têm retenção na fonte e as mais-valias têm taxa própria (ver «Dividendos e juros» e «Mais-valias: quanto imposto pagas ao vender»), por isso a tua taxa de retorno exigida deve ser <b>líquida de impostos e de comissões</b>. Para obter as contas das empresas, vê «Onde ler as contas de uma empresa: relatórios anuais, CMVM e sites de relações com investidores».`},

    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'O valor de uma empresa é o dinheiro livre que vai gerar, trazido para hoje com uma taxa de desconto.',
      'Cinco passos: projetar fluxos, escolher a taxa, calcular o valor de continuidade, descontar, subtrair a dívida.',
      'O valor de continuidade costuma pesar mais de metade do total: é a parte mais incerta.',
      'Pequenas mudanças na taxa e no crescimento dão resultados muito diferentes: usa intervalos.',
      'O DCF inverso mostra o que o preço assume e é a utilização mais honesta do método.']},
    {t:'fazve',id:'q2',ensina:['p3','c2'],q:`Uma empresa vai gerar ${_fu_K.q2.f} M€ de fluxo de caixa livre no próximo ano, crescendo ${_fu_K.q2.g}% ao ano para sempre, com uma taxa de desconto de ${_fu_K.q2.r}%. Qual é o valor da empresa pela fórmula do valor de continuidade (fluxo ÷ (taxa − crescimento)), em M€?`,unit:'M€',answer:_fu_K.q2.f/((_fu_K.q2.r-_fu_K.q2.g)/100),tol:.01,why:`${_fu_K.q2.f} ÷ (${_fu_K.q2.r}% − ${_fu_K.q2.g}%) = ${_fu_K.q2.f} ÷ ${_fu_n((_fu_K.q2.r-_fu_K.q2.g)/100,2)} = ${_fu_n(_fu_K.q2.f/((_fu_K.q2.r-_fu_K.q2.g)/100),0)} M€.`},
    {t:'decide',id:'q3',ensina:['c3','p6'],label:'Decide',q:'Descobres que, se subires a taxa de desconto 1 ponto, o valor da empresa baixa 15%. O que isto te diz?',o:['Que o DCF é inútil e deve ser ignorado','Que o resultado é muito sensível aos pressupostos, por isso convém usar um intervalo e uma margem de segurança','Que o valor da empresa mudou realmente 15%'],c:1,why:'O negócio não mudou: mudou a hipótese. É por isso que o DCF dá um intervalo e deve vir com margem de segurança.'},
    {t:'erro',id:'q4',ensina:['p3','p4','u2'],label:'Encontra o erro',q:'Uma destas frases sobre o DCF está errada. Qual?',o:['O valor de continuidade costuma ser a maior parte do valor total','Um DCF com muitas casas decimais é mais certo do que um com poucas','A taxa de desconto reflete o retorno que exiges para correr o risco','Subtrai-se a dívida líquida para chegar ao valor dos acionistas'],c:1,why:'Casas decimais não aumentam a certeza: a incerteza vem dos pressupostos, não da aritmética.'}
  ], src:[] },

{ id:'onde-ler-contas', topic:'fundamental', o:9, title:'Onde ler as contas de uma empresa: relatórios anuais, CMVM e sites de relações com investidores', mins:7,
  lead:`Toda a análise começa por saber onde estão os números. As empresas cotadas são obrigadas a publicar as suas contas, e aprender a navegar nesses documentos, e a ler primeiro o que interessa, poupa horas e evita o ruído.`,
  blocks:[
    {t:'h',id:'h1',x:'Ir à fonte'},
    {t:'p',id:'p1',x:`Notícias, aplicações e fóruns resumem as contas, mas resumir é escolher o que mostrar. Os documentos originais são a única fonte completa e, sobretudo, a que a própria empresa tem de assumir por escrito. Pensa em comprar um carro usado: podes ler o anúncio, mas a revisão e o histórico oficial dizem-te muito mais. Este tema é o mapa para chegar a esse histórico.`},

    {t:'h',id:'h2',x:'Onde procurar'},
    {t:'cmp',id:'c1',head:['Onde','O que lá encontras','Quando usar'],rows:[
      ['Site da empresa, secção «Investidores» (ou «Relações com Investidores», <i>Investor Relations</i>)','Relatórios anuais e semestrais, apresentações de resultados, calendário financeiro, informação sobre dividendos','É o primeiro sítio: tudo organizado pela própria empresa'],
      ['CMVM (Comissão do Mercado de Valores Mobiliários)','Informação regulada publicada pelas empresas cotadas em Portugal','Para confirmar que o documento é oficial e ver comunicados importantes'],
      ['A bolsa onde a ação é negociada (por exemplo, a Euronext Lisboa)','Lista das empresas, comunicados e dados de negociação','Para ver quais as empresas cotadas e descobrir o código de cada uma'],
      ['Base de dados oficial dos EUA (SEC, «EDGAR»)','Relatório anual (<i>10-K</i>), trimestral (<i>10-Q</i>) e comunicados (<i>8-K</i>) das empresas americanas','Para empresas dos EUA que compras através da corretora']],cap:'Para empresas de outros países, o princípio é o mesmo: o regulador do país e o sítio da empresa.'},
    {t:'note',id:'n1',pending:true,x:`Em Portugal, a CMVM mantém um sistema público de difusão de informação (o SDI) onde as empresas cotadas divulgam informação regulada, incluindo as contas anuais e semestrais. Os prazos de publicação e o conteúdo mínimo desses relatórios estão no Código dos Valores Mobiliários e em regulamentos da CMVM. Não ficou confirmado em fonte oficial o texto exato, por isso consulta o sítio da CMVM antes de contar com prazos. As empresas não cotadas entregam as contas anuais por outra via (a IES, Informação Empresarial Simplificada), também por confirmar.`},

    {t:'h',id:'h3',x:'O que há dentro de um relatório anual'},
    {t:'p',id:'p2',x:`Um relatório e contas é grande (muitas vezes mais de 200 páginas), mas costuma seguir uma estrutura previsível. Em regra tem: uma <b>mensagem do presidente</b>; o <b>relatório de gestão</b>, onde a administração explica o ano; um capítulo de <b>governo da sociedade</b> (quem manda, quanto ganham os administradores); as <b>demonstrações financeiras</b> (as três que viste em «Demonstrações financeiras»); as <b>notas</b>, que explicam as contas; e a <b>certificação legal das contas</b>, o parecer do auditor externo.`},
    {t:'p',id:'p3',x:`A parte mais útil, e a mais ignorada, são as <b>notas às demonstrações financeiras</b>. É nelas que descobres quanto a empresa deve a cada prazo, que processos judiciais tem, que clientes pesam mais, que critérios mudou. As mensagens do presidente e as páginas com fotografias são marketing; as notas são factos.`},

    {t:'h',id:'h4',x:'Uma leitura em 20 minutos'},
    {t:'p',id:'p4',x:`Podes ler um relatório sem ser especialista se seguires uma ordem. Com a <b>Conservas do Atlântico</b>, a empresa que viste em «Demonstrações financeiras», seria assim:`},
    {t:'cmp',id:'c2',head:['Passo','Onde ver','O que tirar','Alerta'],rows:[
      ['1. A opinião do auditor','Certificação legal das contas','Se as contas dão uma imagem verdadeira e apropriada','Reservas, «escusa de opinião» ou dúvidas sobre a continuidade'],
      ['2. Os três quadros','Demonstrações financeiras','Vendas, margens, lucro, caixa gerada ('+_fu_M(_fu_a.cfo,1)+' aqui), dívida','Lucro a subir e caixa a descer'],
      ['3. O calendário da dívida','Notas sobre financiamentos','De '+_fu_M(_fu_a.divida,1)+' de dívida, '+_fu_M(_fu_O.venc[0],1)+' vence no ano seguinte ('+_fu_p(_fu_O.venc[0]/_fu_a.divida*100,0)+')','Muita dívida a vencer ao mesmo tempo'],
      ['4. Os clientes','Notas sobre risco e segmentos','O maior cliente pesa '+_fu_M(_fu_O.cli,1)+' das vendas de '+_fu_M(_fu_a.vendas,1)+' ('+_fu_p(_fu_O.cli/_fu_a.vendas*100,0)+')','Um só cliente com mais de 10% das vendas'],
      ['5. O que mudou','Políticas contabilísticas e eventos posteriores','Critérios novos, ativos desvalorizados, acontecimentos depois do fecho','Mudanças que melhoram sempre os números'],
      ['6. O que dizem os gestores','Relatório de gestão e apresentação de resultados','Objetivos, riscos que a própria empresa identifica','Metas que mudam todos os anos sem explicação']],cap:'Os números da Conservas do Atlântico são de exemplo.'},

    {t:'h',id:'h5',x:'A opinião do auditor, em linguagem simples'},
    {t:'cmp',id:'c3',head:['Opinião','O que significa','Como encarar'],rows:[
      ['Sem reservas','O auditor considera que as contas dão uma imagem verdadeira e apropriada','O normal, e o que se espera'],
      ['Com reservas','Há algum ponto onde o auditor discorda ou não conseguiu confirmar','Lê a reserva; o impacto pode ser pequeno ou não'],
      ['Adversa','As contas, no conjunto, não refletem a realidade','Alarme sério'],
      ['Escusa de opinião','O auditor não conseguiu obter provas suficientes para opinar','Alarme sério'],
      ['Parágrafo de ênfase ou de incerteza material sobre a continuidade','O auditor chama a atenção para um ponto, ou duvida de que a empresa continue a funcionar','Lê o que está a ser dito e porquê']],cap:'Descrição geral das opiniões mais comuns. Os nomes exatos variam um pouco entre documentos.'},
    {t:'p',id:'p5',x:`O auditor não garante que a empresa seja boa; garante, dentro de limites, que os números não estão materialmente errados. Mesmo assim, houve escândalos com contas auditadas (como o da Enron, referido em «Demonstrações financeiras»), por isso a opinião é um filtro, não um selo de qualidade.`},

    {t:'h',id:'h6',x:'Tirar partido das apresentações de resultados'},
    {t:'p',id:'p6',x:`Quatro vezes por ano, a maioria das grandes empresas faz uma <b>apresentação de resultados</b> e muitas fazem uma conversa com analistas, onde se ouvem as perguntas difíceis. Os diapositivos resumem as contas e as perguntas dos analistas revelam o que preocupa quem as lê a fundo. Quando a empresa evita responder a uma pergunta, isso também é informação. Nos sítios das empresas costumam existir as gravações e as transcrições.`},

    {t:'h',id:'h7',x:'Os erros que mais custam'},
    {t:'ul',id:'u1',x:[
      '<b>Ler só os resumos de terceiros.</b> Quem resume pode errar ou escolher o que quer destacar.',
      '<b>Ler só a mensagem do presidente.</b> É a parte menos neutra de todo o relatório.',
      '<b>Esquecer as notas.</b> Dívida por prazo, cláusulas, processos e clientes importantes estão lá.',
      '<b>Comparar anos sem ver se mudaram critérios.</b> Os números do ano passado podem ter sido reapresentados.',
      '<b>Fiar-se em dados antigos.</b> Confirma a data do relatório e se saiu informação posterior.']},

    {t:'h',id:'h8',x:'Um caso real: Wirecard'},
    {t:'p',id:'p7',x:`A Wirecard era uma empresa alemã de pagamentos, listada na bolsa e com enorme visibilidade. Em 2020, o auditor não conseguiu confirmar a existência de uma parte significativa do dinheiro que a empresa dizia ter em contas de bancos asiáticos, e a empresa pediu insolvência pouco depois. Já havia jornalistas e investidores a levantar dúvidas há anos. Quem leu as notas e as respostas às perguntas difíceis, e viu que a prova do caixa dependia de terceiros, tinha razões para desconfiar. A lição prática: quando uma parte importante do balanço não pode ser confirmada de forma independente, é um sinal de alerta.`},

    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p8',x:`Para uma empresa portuguesa cotada, começa pelo site dela (secção «Investidores») e confirma na CMVM. Para as estrangeiras que compras através da corretora, vais ao site da empresa ou ao regulador do país dela. Os documentos podem estar noutra língua (muitas vezes em inglês): não há problema em usar um tradutor para as secções de que precisas, desde que olhes para os números originais. Se vais comprar através de um banco ou de uma corretora, vê «Banco ou corretora?» para perceber o que cada uma oferece, e «Burlas e a lista da CMVM» para confirmar que quem te vende é uma entidade autorizada.`},

    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u2',x:[
      'Os documentos originais (relatório e contas, apresentações) são melhores do que os resumos de terceiros.',
      'Procura no site da empresa («Investidores»), na CMVM (para empresas portuguesas) e no regulador do país (para as estrangeiras).',
      'As notas às contas e a certificação do auditor são as partes mais úteis e menos lidas.',
      'Lê por ordem: auditor, quadros, dívida por prazo, clientes, mudanças de critério, mensagens da gestão.',
      'Uma parte do balanço que não se consegue confirmar de forma independente é um alerta.']},
    {t:'decide',id:'q1',ensina:['c1','p1','p3'],label:'Decide',q:'Onde costumas encontrar o prazo de vencimento da dívida de uma empresa cotada?',o:['Na mensagem do presidente','Nas notas às demonstrações financeiras','Na capa do relatório'],c:1,why:'As notas detalham a dívida por prazos e condições. A mensagem do presidente é um texto de apresentação e não tem esses números.'},
    {t:'fazve',id:'q2',ensina:['c2','p3'],q:`Numa empresa com vendas de ${_fu_a.vendas} M€, as notas dizem que o maior cliente pesa ${_fu_n(_fu_O.cli,1)} M€. Que percentagem das vendas vem desse cliente?`,unit:'%',answer:_fu_O.cli/_fu_a.vendas*100,tol:.02,why:`${_fu_n(_fu_O.cli,1)} ÷ ${_fu_a.vendas} = ${_fu_n(_fu_O.cli/_fu_a.vendas,2)}, ou seja, ${_fu_n(_fu_O.cli/_fu_a.vendas*100,0)}%. Perder um cliente assim deixaria um buraco grande, e é um risco que só se descobre nas notas.`},
    {t:'erro',id:'q3',ensina:['c3','p5','p7'],label:'Encontra o erro',q:'Uma destas frases está errada. Qual?',o:['A opinião do auditor é um filtro, não uma garantia de qualidade da empresa','Uma «escusa de opinião» é um alerta sério','Contas auditadas nunca escondem problemas','Uma parte do balanço que não se confirma de forma independente merece desconfiança'],c:2,why:'Houve fraudes em empresas auditadas. O auditor reduz o risco de erros graves, mas não o elimina.'}
  ], src:[_CMVM] }
);
