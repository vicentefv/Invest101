// ================= Aprender: módulo «risco» =================
// Regras de Portugal só com fonte oficial (campo `src`); o que não ficou confirmado leva `pending:true` («Por confirmar»).

// Contas dos exemplos (calculadas aqui para a explicação nunca divergir do número certo).
const _rk_mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
const _rk_sd=a=>{ const m=_rk_mean(a); return Math.sqrt(a.reduce((s,x)=>s+(x-m)*(x-m),0)/(a.length-1)); };
const _rk_f=(n,d)=>Number(n).toLocaleString('pt-PT',{minimumFractionDigits:d||0,maximumFractionDigits:d||0}).replace('-','−');
const _rk_fgd={l:'FGD, Fundo de Garantia de Depósitos: garantia de depósitos',u:'https://www.fgd.pt/en/deposit-guarantee'};
// Volatilidade: duas séries de retornos anuais que acabam exatamente no mesmo valor.
const _rk_A=[7,4,8,3,8,6];
const _rk_prod=a=>a.reduce((p,r)=>p*(1+r/100),1);
const _rk_fin=_rk_prod(_rk_A);
const _rk_B5=[28,-19,24,-14,17];
const _rk_B=_rk_B5.concat([(_rk_fin/_rk_prod(_rk_B5)-1)*100]);
const _rk_vA=_rk_sd(_rk_A), _rk_vB=_rk_sd(_rk_B);
const _rk_ex4=[10,-4,8,2], _rk_m4=_rk_mean(_rk_ex4), _rk_dev4=_rk_ex4.map(x=>x-_rk_m4), _rk_sq4=_rk_dev4.map(x=>x*x);
const _rk_var4=_rk_sq4.reduce((s,x)=>s+x,0)/(_rk_ex4.length-1), _rk_sd4=Math.sqrt(_rk_var4);

// Drawdown: série de valores de uma carteira de exemplo (um por trimestre).
const _rk_S=[10000,11200,12400,11000,9300,8700,9500,10800,12600];
const _rk_dd=(()=>{ let pk=_rk_S[0],mdd=0,pkAt=0,trAt=0,cur=0,rows=[],ccPk=0; _rk_S.forEach((v,i)=>{ if(v>pk){ pk=v; ccPk=i; } const d=(v/pk-1)*100; if(d<mdd){ mdd=d; pkAt=ccPk; trAt=i; } rows.push([i,v,pk,d]); }); return {mdd,pkAt,trAt,rows}; })();
const _rk_recIdx=_rk_S.findIndex((v,i)=>i>_rk_dd.trAt&&v>=_rk_S[_rk_dd.pkAt]);

// Sharpe e Sortino: contas dos exemplos.
const _rk_rf=2;
const _rk_funds=[['Fundo X',8,15],['Fundo Y',6,8],['Fundo Z',5,5]].map(([n,r,v])=>({n,r,v,sh:(r-_rk_rf)/v}));
const _rk_U=[-2,-1,-2,-1,-2,28], _rk_V=[20,-14,18,-12,16,-8];
const _rk_down=(a,t)=>Math.sqrt(a.reduce((s,x)=>s+Math.pow(Math.min(x-t,0),2),0)/a.length);
const _rk_sh=a=>(_rk_mean(a)-_rk_rf)/_rk_sd(a), _rk_so=a=>(_rk_mean(a)-_rk_rf)/_rk_down(a,_rk_rf);
const _rk_cagr=(Math.pow(_rk_S[_rk_S.length-1]/_rk_S[0],4/(_rk_S.length-1))-1)*100;

// Diversificação: correlação de duas séries e volatilidade de uma carteira 50/50.
const _rk_corr=(a,b)=>{ const ma=_rk_mean(a),mb=_rk_mean(b); let n=0,da=0,db=0; a.forEach((x,i)=>{ n+=(x-ma)*(b[i]-mb); da+=(x-ma)*(x-ma); db+=(b[i]-mb)*(b[i]-mb); }); return n/Math.sqrt(da*db); };
const _rk_X=[12,-8,15,-20,18,10], _rk_Y=[3,5,2,8,1,4], _rk_M=_rk_X.map((x,i)=>(x+_rk_Y[i])/2);
const _rk_pv=(s1,s2,r,w)=>Math.sqrt(w*w*s1*s1+(1-w)*(1-w)*s2*s2+2*w*(1-w)*r*s1*s2);

// Outros riscos: contas dos exemplos.
const _rk_fx0=1.10, _rk_fx1=1.20, _rk_usdRet=10;
const _rk_eurRet=((1+_rk_usdRet/100)*(_rk_fx0/_rk_fx1)-1)*100;
const _rk_realRet=((1.03/1.025)-1)*100;
const _rk_bondDown=7*1;

// Emissor e contraparte: perda esperada de uma obrigação de exemplo.
const _rk_pd=2, _rk_rec=40, _rk_yHi=5, _rk_yLo=3;
const _rk_el=_rk_pd*(100-_rk_rec)/100;
const _rk_net=_rk_yHi-_rk_el;

// Risco de sequência: os mesmos retornos, em ordem contrária.
const _rk_R=[-22,-12,6,14,18,16,10,12,9,15], _rk_Rr=_rk_R.slice().reverse();
const _rk_wd=(rets,start,w)=>{ let b=start,out=[]; rets.forEach(r=>{ b=Math.max(b-w,0)*(1+r/100); out.push(b); }); return out; };
const _rk_ct=(rets,start,c)=>{ let b=start,out=[]; rets.forEach(r=>{ b=(b+c)*(1+r/100); out.push(b); }); return out; };
const _rk_w1=_rk_wd(_rk_R,500000,25000), _rk_w2=_rk_wd(_rk_Rr,500000,25000);
const _rk_c1=_rk_ct(_rk_R,0,5000), _rk_c2=_rk_ct(_rk_Rr,0,5000);
const _rk_l1=_rk_prod(_rk_R), _rk_l2=_rk_prod(_rk_Rr);
const _rk_gm=(Math.pow(_rk_l1,1/_rk_R.length)-1)*100;

// Perfil de risco: teste de esforço de exemplo.
const _rk_st=[['Prudente',20],['Equilibrado',50],['Dinâmico',80]].map(([n,a])=>({n,a,loss:20000*a/100*0.4}));


LRN.push(
{ id:'volatilidade', topic:'risco', o:1, title:'Volatilidade: quanto oscila', mins:7,
  lead:'Volatilidade mede o tamanho das oscilações do preço. Um ativo muito volátil sobe e desce depressa, e aguentá-lo exige estômago e prazo. É a primeira palavra do vocabulário do risco e a mais mal compreendida.',
  blocks:[
    {t:'h',id:'h1',x:'Uma estrada reta e uma estrada de montanha'},
    {t:'p',id:'p1',x:'Imagina dois automóveis que partem de Lisboa e chegam ao Porto à mesma hora. Um fez a viagem toda na autoestrada, a 120 km/h. O outro foi por estradas de serra, a acelerar, a travar, a subir e a descer. Chegaram juntos, mas a viagem não foi igual: no segundo carro houve enjoos, curvas, e momentos em que parecia que não se chegava lá. A <b>volatilidade</b> mede precisamente isso, a irregularidade do caminho, e não o sítio de chegada.'},
    {t:'p',id:'p2',x:'Num investimento, o «caminho» é o gráfico do preço. Dois ativos podem valer o mesmo ao fim de seis anos e ter vidas completamente diferentes pelo meio. Quem os detém sente a diferença: no primeiro dorme-se bem, no segundo há anos em que a carteira perde um quinto do valor e é preciso resistir à tentação de vender.'},
    {t:'h',id:'h2',x:'Um exemplo com números'},
    {t:'p',id:'p3',x:'Vamos comparar dois ativos de exemplo durante seis anos. O <b>A</b> rende entre '+_rk_f(Math.min(..._rk_A))+'% e '+_rk_f(Math.max(..._rk_A))+'% ao ano, sem sustos. O <b>B</b> tem anos excelentes e anos maus. Os valores são inventados para ilustrar, mas a conta é verdadeira: o retorno do último ano do B foi escolhido de forma a que os dois acabem exatamente com o mesmo dinheiro.'},
    {t:'cmp',id:'c0',head:['Ano','Ativo A','Ativo B'],rows:
      _rk_A.map((a,i)=>['Ano '+(i+1),_rk_f(a,1)+'%',_rk_f(_rk_B[i],1)+'%'])
      .concat([['Valor final de 10 000 €',_e(10000*_rk_fin),_e(10000*_rk_prod(_rk_B))],['Volatilidade (desvio-padrão)',_rk_f(_rk_vA,1)+'%',_rk_f(_rk_vB,1)+'%']]),
      cap:'Valores de exemplo. Os dois ativos terminam com o mesmo dinheiro, mas o B é muito mais volátil.'},
    {t:'stat',id:'s1',v:Math.round(_rk_vA),fmt:'pct',label:'Volatilidade anual do ativo A (arredondada)'},
    {t:'stat',id:'s2',v:Math.round(_rk_vB),fmt:'pct',label:'Volatilidade anual do ativo B (arredondada)'},
    {t:'p',id:'p4',x:'Olhar só para o ponto de chegada diria que A e B são iguais. Olhar para o caminho mostra que o B é cerca de '+Math.round(_rk_vB/_rk_vA)+' vezes mais volátil. Se tivesses precisado do dinheiro no fim do segundo ano, o B tinha-te custado caro; o A, não.'},
    {t:'h',id:'h3',x:'Como se calcula, passo a passo'},
    {t:'p',id:'p5',x:'A medida habitual chama-se <b>desvio-padrão</b>. Parece assustadora, mas é uma espécie de média das distâncias à média. Faz-se assim, com quatro retornos anuais de exemplo ('+_rk_ex4.map(x=>_rk_f(x)+'%').join(', ')+'):'},
    {t:'ul',id:'u1',x:[
      '<b>1. Média.</b> A média dos retornos é '+_rk_f(_rk_m4,1)+'%.',
      '<b>2. Distâncias.</b> Subtrai a média a cada retorno: '+_rk_dev4.map(x=>_rk_f(x,1)).join(', ')+'.',
      '<b>3. Quadrados.</b> Eleva cada distância ao quadrado, para que as negativas não cancelem as positivas: '+_rk_sq4.map(x=>_rk_f(x,1)).join(', ')+'.',
      '<b>4. Média dos quadrados.</b> Soma e divide por '+(_rk_ex4.length-1)+' (uma pequena correção usada com poucos dados), o que dá '+_rk_f(_rk_var4,1)+'. É a <i>variância</i>.',
      '<b>5. Raiz quadrada.</b> A raiz da variância volta a dar uma percentagem: '+_rk_f(_rk_sd4,1)+'%. Esse é o desvio-padrão, a volatilidade.']},
    {t:'p',id:'p6',x:'Lê-se assim: os retornos desta série afastam-se tipicamente cerca de '+_rk_f(_rk_sd4,1)+' pontos percentuais da média. Quanto maior o número, mais larga a «nuvem» onde o retorno de um ano pode cair.'},
    {t:'h',id:'h4',x:'O que o número te diz na prática'},
    {t:'p',id:'p7',x:'Para retornos que se distribuem de forma aproximadamente regular, cerca de <b>dois terços</b> dos anos ficam a menos de um desvio-padrão da média, e cerca de 95% a menos de dois. Se um ativo tem retorno médio de 7% e volatilidade de 15%, em dois de cada três anos o retorno anda entre −8% e +22%, e em alguns anos fica ainda mais longe. É uma regra de bolso: na vida real as quedas extremas aparecem mais vezes do que a regra sugere.'},
    {t:'p',id:'p8',x:'A volatilidade costuma ser quotada por ano. Se só tens dados mensais, multiplica o desvio-padrão mensal pela raiz quadrada de 12 (cerca de 3,46) para obter a anual. É uma aproximação que supõe que um mês não influencia o seguinte.'},
    {t:'fazve',id:'q1',ensina:['p7','p8'],q:'Um fundo tem volatilidade mensal de 4%. Qual é a sua volatilidade anual aproximada? (multiplica por √12)',unit:'%',answer:4*Math.sqrt(12),tol:.02,why:'4% × √12 = 4% × 3,46 ≈ 13,9% ao ano. Sem o ajuste, compararias números de prazos diferentes, como comparar quilómetros por hora com quilómetros por dia.'},
    {t:'h',id:'h5',x:'Cada ativo, o seu feitio'},
    {t:'cmp',id:'c1',head:['Tipo de ativo','Oscilação típica','Comentário'],rows:[
      ['Depósito / poupança','Muito baixa','O valor nominal não cai'],
      ['Obrigações de bons emissores','Baixa a média','Variam sobretudo com as taxas de juro'],
      ['Ações (carteira diversificada)','Média a alta','Quedas de 20% ou mais acontecem de tempos a tempos'],
      ['Ações de uma só empresa','Alta','Muito mais do que o mercado todo, por concentração'],
      ['Criptomoedas','Muito alta','Variações de dezenas de por cento em semanas']],
      cap:'Qualitativo: a oscilação real muda ao longo do tempo.'},
    {t:'h',id:'h6',x:'Um caso real: o medo que se mede'},
    {t:'p',id:'p9',x:'Nos Estados Unidos existe um índice chamado <b>VIX</b>, calculado a partir dos preços de opções sobre o S&P 500, que mede a volatilidade que o mercado espera para o mês seguinte. É conhecido como o «índice do medo». Nas crises sobe de repente: aconteceu em 2008, quando o sistema financeiro quase colapsou, e outra vez em março de 2020, quando a pandemia fez as bolsas cair mais de 30% em cerca de um mês. Em períodos calmos fica baixo durante muito tempo.'},
    {t:'p',id:'p10',x:'Há aqui uma lição útil: a volatilidade <b>não é constante</b>. Tende a vir em ondas: dias calmos seguem-se a dias calmos, dias turbulentos a dias turbulentos. Por isso a volatilidade medida no passado é um bom guia, mas nunca uma promessa.'},
    {t:'h',id:'h7',x:'O que a volatilidade não diz'},
    {t:'ul',id:'u2',x:[
      '<b>Trata subidas e descidas por igual.</b> Um ativo que sobe aos solavancos é «volátil», mas ninguém se queixa das subidas. O que dói é a parte para baixo, e há medidas só para isso (vê «Risco e retorno medidos: Sharpe, Sortino e afins»).',
      '<b>Não é perda permanente.</b> Volatilidade é oscilar e voltar; perda definitiva é, por exemplo, uma empresa que fecha. São coisas diferentes.',
      '<b>Esconde a pior queda.</b> Duas carteiras com a mesma volatilidade podem ter quedas máximas muito diferentes (vê «Quedas máximas (drawdown)»).',
      '<b>Depende do período medido.</b> Medida em anos calmos, parece pequena; medida numa crise, enorme.']},
    {t:'decide',id:'q2',ensina:['p3','p4','c0'],label:'Decide',q:'Dois ativos acabam o ano com o mesmo retorno. O A foi quase em linha reta e o B teve quedas e subidas fortes. Qual é mais volátil?',o:['O A','O B','Têm a mesma volatilidade, porque acabaram iguais'],c:1,why:'A volatilidade mede o tamanho das oscilações ao longo do caminho, não só o ponto de chegada. O B oscilou muito mais.'},
    {t:'decide',id:'q3',ensina:['p7'],label:'Decide',q:'Um ativo tem retorno médio de 8% ao ano e volatilidade de 10%. Em cerca de dois de cada três anos, entre que valores deve andar o retorno?',o:['Entre 8% e 18%','Entre −10% e +10%','Entre −2% e +18%'],c:2,why:'Um desvio-padrão para cada lado da média: 8% − 10% = −2% e 8% + 10% = +18%. Os anos mais extremos ficam fora deste intervalo.'},
    {t:'erro',id:'q4',ensina:['u2','c1','p10'],label:'Encontra o erro',q:'Uma destas afirmações está errada. Qual?',o:['Ações costumam oscilar mais do que depósitos','A volatilidade passada garante a volatilidade futura','A volatilidade vem em ondas: períodos calmos e períodos turbulentos','Dois ativos com o mesmo retorno final podem ter volatilidades muito diferentes'],c:1,why:'A volatilidade muda ao longo do tempo. O passado é uma pista, não uma garantia, e é nas crises que as surpresas aparecem.'},
    {t:'h',id:'h8',x:'Os erros que mais custam'},
    {t:'ul',id:'u3',x:[
      'Achar que volatilidade é o mesmo que risco. É uma parte do risco, não ele todo.',
      'Escolher só pelo retorno do último ano, sem olhar para a viagem que o produziu.',
      'Fugir de todo o ativo volátil: para um prazo longo, ações podem fazer sentido apesar das oscilações.',
      'Confundir calma com segurança: anos tranquilos não impedem a próxima tempestade.',
      'Dizer «aguento tudo» sem nunca ter visto a carteira perder um quinto do valor.']},
    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p11',x:'Os fundos e ETFs vendidos em Portugal trazem um documento europeu padronizado, o KID (documento de informações fundamentais), com uma escala de risco que resume a volatilidade do produto. É a forma mais fácil de comparar à partida. Para o que é preciso aguentar quando o mercado cai e para o efeito do imposto quando vendes, vê os temas «Quedas máximas (drawdown)» e «Mais-valias: quanto imposto pagas ao vender».'},
    {t:'note',id:'n1',pending:true,x:'Escala de risco do KID (indicador de 1 a 7, regulamento europeu dos PRIIPs): descrição baseada em fontes secundárias; falta confirmar no texto do regulamento ou na CMVM.'},
    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u4',x:[
      'Volatilidade mede o tamanho das oscilações, não o ponto de chegada.',
      'Calcula-se com o desvio-padrão dos retornos e quase sempre vem em % por ano.',
      'Regra de bolso: cerca de dois terços dos anos ficam a menos de um desvio-padrão da média.',
      'Muda com o tempo, vem em ondas e sobe nas crises.',
      'Não distingue subidas de descidas nem perdas temporárias de permanentes.',
      'Aceitar volatilidade é o preço dos retornos esperados mais altos, mas só se o prazo e o temperamento o permitirem.']}
  ], src:[] },


{ id:'drawdown', topic:'risco', o:2, title:'Quedas máximas (drawdown)', mins:7,
  lead:'Drawdown é a queda desde o último máximo até ao ponto mais baixo seguinte. É a medida que mais se aproxima do que realmente sentes numa crise, e a que mais ajuda a perceber porque é que perder pesa mais do que ganhar.',
  blocks:[
    {t:'h',id:'h1',x:'A distância ao topo da montanha'},
    {t:'p',id:'p1',x:'Imagina que subiste uma serra e chegaste ao cume com 1 000 metros de altitude. Depois desces para um vale a 600 metros. A descida foi de 400 metros, e foi esse o esforço que sentiste, independentemente de teres começado a subir ao nível do mar. O <b>drawdown</b> é exatamente isto aplicado ao dinheiro: mede quanto desceste desde o ponto mais alto que a carteira já teve.'},
    {t:'p',id:'p2',x:'Se uma carteira chegou a valer 10 000 € e caiu para 6 000 €, o drawdown foi de <b>−40%</b>. Não interessa o que aconteceu antes nem o que ganhaste em anos anteriores: o que dói é a distância ao máximo. O <b>drawdown máximo</b> (em inglês, <i>maximum drawdown</i> ou <i>max drawdown</i>) é a pior dessas quedas num certo período, e é o número que mais te diz sobre o que terias de aguentar.'},
    {t:'h',id:'h2',x:'Como se calcula, com uma carteira de exemplo'},
    {t:'p',id:'p3',x:'Vamos seguir uma carteira ao longo de '+(_rk_S.length-1)+' trimestres. Em cada momento comparamos o valor com o <b>máximo anterior</b> e vemos a distância. Um passo de cada vez:'},
    {t:'cmp',id:'c1',head:['Trimestre','Valor','Máximo até aí','Distância ao máximo'],rows:_rk_dd.rows.map(r=>[r[0]===0?'Início':String(r[0]),_e(r[1]),_e(r[2]),r[3]===0?'0%':_rk_f(r[3],1)+'%']),
      cap:'Valores de exemplo. A distância é (valor ÷ máximo − 1).'},
    {t:'p',id:'p4',x:'O pior ponto foi no trimestre '+_rk_dd.trAt+', com '+_rk_f(Math.abs(_rk_dd.mdd),1)+'% abaixo do máximo de '+_e(_rk_S[_rk_dd.pkAt])+'. Esse é o drawdown máximo desta carteira. Repara também na duração: o valor só voltou ao máximo anterior no trimestre '+_rk_recIdx+', ou seja, passaram '+(_rk_recIdx-_rk_dd.pkAt)+' trimestres entre o cume e a recuperação. O tempo que se passa «debaixo de água» também conta, e muitas vezes custa mais do que a queda em si.'},
    {t:'stat',id:'s1',v:Math.round(Math.abs(_rk_dd.mdd)),fmt:'pct',label:'Drawdown máximo da carteira de exemplo (arredondado)'},
    {t:'h',id:'h3',x:'A conta que castiga: perder 50% não se repõe com 50%'},
    {t:'p',id:'p5',x:'A matemática é cruel: quanto maior a queda, maior a subida necessária para voltar ao ponto de partida. Se perdes 50% de 100 €, ficas com 50 €. Para chegares outra vez aos 100 € tens de ganhar 50 € sobre uns meros 50 €, ou seja, <b>100%</b>. Experimenta com vários valores:'},
    {t:'w',id:'w1',w:'calc',c:'drawdown'},
    {t:'cmp',id:'c2',head:['Queda','Subida necessária para recuperar'],rows:[10,20,30,40,50,60,70,80,90].map(q=>[q+'%',_rk_f(q/(100-q)*100,0)+'%']),
      cap:'Subida = queda ÷ (100 − queda). Perto dos 100%, a subida necessária dispara.'},
    {t:'p',id:'p6',x:'Isto explica porque é que evitar grandes quedas pesa tanto como captar subidas. Uma carteira que ganha 10% e perde 10% não fica na mesma: 100 € passam a 110 € e depois a 99 €. E uma carteira que perde 20% e depois ganha 20% acaba com <b>96%</b> do que tinha ('+_rk_f(100*0.8*1.2,0)+' em vez de 100). A ordem não muda o resultado, mas a assimetria significa que a volatilidade, por si só, tira retorno composto.'},
    {t:'fazve',id:'q1',ensina:['p5','w1','c2'],q:'A tua carteira cai 50%. Quanto tem de subir, em %, para voltar ao valor inicial?',unit:'%',answer:100,tol:.02,why:'Subir 100%: se 100 passa para 50, tens de duplicar esses 50 para voltar aos 100.'},
    {t:'fazve',id:'q2',ensina:['p5','w1'],q:'A tua carteira caiu 35%. Que subida, em %, é precisa para recuperar? (arredonda às unidades)',unit:'%',answer:_c('drawdown',{val:10000,q:35})[1],tol:.03,why:'35 ÷ (100 − 35) = 35 ÷ 65 ≈ 53,8%. Repara que é bem mais do que 35%: a queda parte de um valor grande, a subida parte de um valor já reduzido.'},
    {t:'h',id:'h4',x:'Três quedas que ficaram na história'},
    {t:'p',id:'p7',x:'<b>A crise financeira de 2008.</b> O S&P 500, o índice das 500 maiores empresas americanas, caiu mais de metade entre o máximo de 2007 e o mínimo de março de 2009. Quem tinha só ações precisou de vários anos para voltar ao nível anterior, e quem vendeu no fundo fixou a perda.'},
    {t:'p',id:'p8',x:'<b>A bolha das empresas de internet.</b> O Nasdaq, índice dominado por tecnológicas, caiu cerca de três quartos entre 2000 e 2002. Só passados cerca de quinze anos voltou ao máximo de 2000. Foi um exemplo de queda enorme e de recuperação lenta ao mesmo tempo.'},
    {t:'p',id:'p9',x:'<b>O Japão.</b> O índice Nikkei 225 atingiu um máximo no final de 1989 e só o voltou a superar em 2024, mais de trinta anos depois. É o exemplo extremo de que «a bolsa acaba por recuperar» pode demorar uma vida inteira se compraste no topo de uma bolha e tiveste só um mercado.'},
    {t:'p',id:'p10',x:'Estes exemplos servem para uma regra prática: antes de investir, pergunta-te não «quanto posso ganhar?» mas «e se isto cair um terço ou metade, e demorar anos a recuperar, o que acontece à minha vida?». Se a resposta te assusta, a carteira tem demasiado risco para ti.'},
    {t:'h',id:'h5',x:'Drawdown e volatilidade: parentes, não gémeos'},
    {t:'ul',id:'u1',x:[
      '<b>Volatilidade</b> mede a irregularidade média. <b>Drawdown</b> mede o pior cenário vivido.',
      'O drawdown depende do caminho: a mesma volatilidade pode esconder quedas curtas ou uma queda enorme e prolongada.',
      'O drawdown máximo só pode piorar com o tempo: quanto mais anos olhas, maior tende a ser. Por isso compara sempre períodos equivalentes.',
      'É um número do <b>passado</b>. A próxima queda pode ser pior do que qualquer uma já vista.']},
    {t:'h',id:'h6',x:'O que podes fazer a respeito'},
    {t:'p',id:'p11',x:'Não há forma de eliminar quedas num investimento em bolsa, mas há formas de as tornar suportáveis. A <b>alocação</b> entre ações e ativos mais estáveis decide quanta queda aceitas (vê «Alocação de ativos»). A <b>diversificação</b> reduz a probabilidade de uma queda concentrada (vê «Diversificação e correlação»). O <b>prazo</b> dá tempo à recuperação. E um <b>fundo de emergência</b> separado evita ter de vender no pior momento, que é o erro que transforma um drawdown temporário numa perda definitiva.'},
    {t:'decide',id:'q3',ensina:['p2','p5'],label:'Decide',q:'Uma carteira de 10 000 € caiu para 7 000 €. Qual foi o drawdown?',o:['−3 000%','−70%','−30%'],c:2,why:'(7 000 − 10 000) ÷ 10 000 = −30%. Para voltar aos 10 000 € tem de subir cerca de 43%.'},
    {t:'decide',id:'q4',ensina:['p4','u1'],label:'Decide',q:'Duas carteiras têm a mesma volatilidade anual. Uma teve a pior queda de 15% e a outra de 40%. O que concluis?',o:['Que a volatilidade chega para as comparar','Que a segunda tem muito mais risco de queda forte, e a volatilidade sozinha não o mostrava','Que a primeira terá sempre melhor retorno'],c:1,why:'A volatilidade é uma média da irregularidade; o drawdown mostra o pior episódio. Convém olhar para os dois.'},
    {t:'erro',id:'q5',ensina:['p5','p6','c2'],label:'Encontra o erro',q:'Uma destas afirmações está errada. Qual?',o:['Uma queda de 50% exige uma subida de 100% para recuperar','Perder 20% e depois ganhar 20% deixa-te exatamente onde começaste','Quanto maior a queda, maior a subida necessária','O drawdown mede a distância ao último máximo'],c:1,why:'100 € a perder 20% ficam 80 €; ganhar 20% sobre 80 € dá 96 €. Os ganhos e perdas percentuais não se compensam simetricamente.'},
    {t:'h',id:'h7',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      'Julgar o risco só pela queda média e esquecer o pior caso.',
      'Aumentar o risco depois de uma queda «para recuperar mais depressa»: a conta mostra porque é o contrário do que convém.',
      'Vender no fundo e depois esperar que o preço «baixe mais» para voltar a entrar: transforma queda temporária em perda real.',
      'Ignorar a duração: uma carteira que demora dez anos a recuperar pode não servir a quem precisa do dinheiro antes.',
      'Achar que o futuro nunca será pior do que o pior ano que já viste.']},
    {t:'h',id:'h8',x:'Em Portugal'},
    {t:'p',id:'p12',x:'Em Portugal a regra é a mesma, mas o imposto entra nas contas. Se vendes com perda, o saldo negativo do ano não gera imposto e pode ter regras próprias de utilização (vê «Mais-valias: quanto imposto pagas ao vender»). Se precisas de apoio emocional para não vender em pânico, o plano escrito do tema «O teu plano de investimento por escrito» ajuda, tal como as regras do tema «O teu perfil de risco». Para o dinheiro de emergência, o tema «Fundo de emergência: a rede por baixo de tudo» explica porque deve ficar fora da bolsa.'},
    {t:'h',id:'h9',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'Drawdown é a queda entre um máximo e o mínimo seguinte; o máximo é o pior que já viste.',
      'Subida necessária = queda ÷ (100 − queda): uma queda de 50% pede +100%.',
      'Conta também o tempo que demoras a recuperar, não só a profundidade.',
      'Perder e ganhar a mesma percentagem deixa-te abaixo do ponto de partida.',
      'Mede o passado: o próximo drawdown pode ser maior.',
      'Prazo, diversificação, alocação e fundo de emergência são os teus instrumentos.']}
  ], src:[] },


{ id:'sharpe-sortino', topic:'risco', o:3, title:'Risco e retorno medidos: Sharpe, Sortino e afins', mins:8,
  lead:'Ver só o retorno é meia história. Dois fundos que rendem o mesmo podem ter corrido riscos muito diferentes. Estes rácios servem para responder a uma pergunta simples: quanto retorno recebi por cada unidade de risco que aguentei?',
  blocks:[
    {t:'h',id:'h1',x:'Consumo aos cem, mas para o dinheiro'},
    {t:'p',id:'p1',x:'Quando compras um carro, não olhas só para a velocidade máxima: olhas também para o consumo. Um carro que faz 200 km/h a gastar 15 litros aos cem pode valer menos do que outro que faz 180 a gastar 6. Nos investimentos passa-se o mesmo. O retorno é a distância que percorreste; o risco é o combustível que gastaste. Medir a <b>eficiência</b> (retorno por unidade de risco) permite comparar carteiras que, à primeira vista, não são comparáveis.'},
    {t:'p',id:'p2',x:'Este é um tema mais técnico, mas é uma das ferramentas mais úteis para não te deixares enganar por um fundo que mostra 20% num ano. Se esse retorno veio de um risco absurdo, não há mérito: foi sorte.'},
    {t:'h',id:'h2',x:'O rácio de Sharpe'},
    {t:'p',id:'p3',x:'O <b>rácio de Sharpe</b> (criado pelo economista William Sharpe, prémio Nobel) é a medida mais usada. A fórmula é curta:'},
    {t:'p',id:'p4',x:'<b>Sharpe = (retorno da carteira − retorno sem risco) ÷ volatilidade</b>'},
    {t:'p',id:'p5',x:'O <b>retorno sem risco</b> é o que obterias sem arriscar nada, por exemplo num depósito ou em dívida pública de curto prazo. Tira-se esse valor ao retorno da carteira porque só o que ganhaste <i>a mais</i>, em troca de arriscares, é que conta (chama-se «retorno em excesso»). Depois divide-se pela volatilidade, que é a medida de risco que já conheces. O resultado é «quantos pontos de retorno extra por cada ponto de volatilidade».'},
    {t:'p',id:'p6',x:'Exemplo com três fundos fictícios e um retorno sem risco de '+_rk_rf+'% ao ano:'},
    {t:'cmp',id:'c1',head:['Fundo','Retorno anual','Volatilidade','Retorno em excesso','Sharpe'],rows:_rk_funds.map(f=>[f.n,f.r+'%',f.v+'%',(f.r-_rk_rf)+' pontos',_rk_f(f.sh,2)]),
      cap:'Valores de exemplo. O fundo com maior retorno não é o mais eficiente.'},
    {t:'p',id:'p7',x:'O fundo X é o que mais rende, mas é o que tem pior Sharpe ('+_rk_f(_rk_funds[0].sh,2)+'): cada ponto de volatilidade rendeu-lhe pouco. O Z rende menos em absoluto, mas por cada ponto de risco rendeu mais ('+_rk_f(_rk_funds[2].sh,2)+'). Se pudesses usar um pouco de alavancagem, ou simplesmente misturar o Z com mais risco, poderias construir algo melhor do que o X com o mesmo risco. É por isso que se diz que o Sharpe mede <i>eficiência</i>.'},
    {t:'fazve',id:'q1',ensina:['p4','p5','c1'],q:'Um fundo rendeu 9% ao ano com volatilidade de 12%, e o retorno sem risco é de 2%. Qual é o rácio de Sharpe?',unit:'',answer:(9-2)/12,tol:.02,why:'(9% − 2%) ÷ 12% = 7 ÷ 12 ≈ 0,58. Tira-se primeiro o retorno sem risco e só depois se divide pela volatilidade.'},
    {t:'h',id:'h3',x:'O rácio de Sortino: só te queixas das quedas'},
    {t:'p',id:'p8',x:'O Sharpe tem um defeito: castiga a volatilidade das <i>subidas</i> tanto como a das quedas. Ora, ninguém se queixa de um mês em que a carteira subiu muito. O <b>rácio de Sortino</b> corrige isso: em vez da volatilidade total, usa só a <b>volatilidade negativa</b> (também chamada desvio descendente), isto é, calcula o afastamento apenas dos retornos que ficam abaixo de um objetivo mínimo, por exemplo o retorno sem risco.'},
    {t:'p',id:'p9',x:'Para ver a diferença, comparamos dois ativos de exemplo. O primeiro (U) quase nunca perde e dá um salto grande no último ano. O segundo (V) alterna ganhos e perdas fortes. Os retornos de seis anos foram: U = '+_rk_U.map(x=>_rk_f(x)+'%').join(', ')+'; V = '+_rk_V.map(x=>_rk_f(x)+'%').join(', ')+'.'},
    {t:'cmp',id:'c2',head:['','Ativo U (salto para cima)','Ativo V (sobe e desce)'],rows:[
      ['Retorno médio anual',_rk_f(_rk_mean(_rk_U),1)+'%',_rk_f(_rk_mean(_rk_V),1)+'%'],
      ['Volatilidade',_rk_f(_rk_sd(_rk_U),1)+'%',_rk_f(_rk_sd(_rk_V),1)+'%'],
      ['Volatilidade negativa (abaixo de '+_rk_rf+'%)',_rk_f(_rk_down(_rk_U,_rk_rf),1)+'%',_rk_f(_rk_down(_rk_V,_rk_rf),1)+'%'],
      ['Sharpe',_rk_f(_rk_sh(_rk_U),2),_rk_f(_rk_sh(_rk_V),2)],
      ['Sortino',_rk_f(_rk_so(_rk_U),2),_rk_f(_rk_so(_rk_V),2)]],
      cap:'Valores de exemplo. O Sortino distingue «volatilidade boa» de «volatilidade má».'},
    {t:'p',id:'p10',x:'Reparas na diferença? Os dois Sharpe são parecidos ('+_rk_f(_rk_sh(_rk_U),2)+' e '+_rk_f(_rk_sh(_rk_V),2)+'), porque as volatilidades totais não diferem muito. Mas o Sortino separa-os: '+_rk_f(_rk_so(_rk_U),2)+' contra '+_rk_f(_rk_so(_rk_V),2)+'. Quase toda a oscilação do U vem de uma subida, que o investidor não sente como risco; a do V vem de quedas. Quando os retornos são simétricos, os dois rácios dizem coisas parecidas. Quando há assimetria, o Sortino é mais justo para quem se preocupa sobretudo com perder.'},
    {t:'h',id:'h4',x:'Outras medidas que aparecem nos fundos'},
    {t:'ul',id:'u1',x:[
      '<b>Rácio de Calmar</b>: retorno anual composto dividido pelo drawdown máximo. Na carteira de exemplo do tema «Quedas máximas (drawdown)», o retorno anualizado foi de cerca de '+_rk_f(_rk_cagr,1)+'% e o drawdown de '+_rk_f(Math.abs(_rk_dd.mdd),1)+'%, o que dá um Calmar de '+_rk_f(_rk_cagr/Math.abs(_rk_dd.mdd),2)+'. Mede o retorno por unidade da pior queda.',
      '<b>Beta</b>: quanto o ativo se mexe em relação ao mercado. Beta 1 move-se como o mercado; beta 1,5 amplifica; beta 0,5 amortece.',
      '<b>Alfa</b>: o retorno que sobra depois de descontar o que o beta explica. É o que os gestores ativos dizem criar. Na prática, é raro e dificílimo de manter (vê «Indexado ou gestão ativa»).',
      '<b>Tracking error</b>: a diferença de comportamento entre um fundo e o seu índice. Num ETF indexado, quer-se pequeno.',
      '<b>Rácio de informação</b>: o retorno acima do índice a dividir pelo tracking error, usado para avaliar gestores ativos.']},
    {t:'h',id:'h5',x:'Como se usam no dia a dia'},
    {t:'p',id:'p11',x:'Quando um fundo ou um serviço de comparação mostra o Sharpe, olha para quatro cuidados. Primeiro, o <b>período</b>: um Sharpe calculado só em anos de subida é enganador. Segundo, o <b>retorno sem risco</b> usado: tem de ser o mesmo para os fundos que comparas. Terceiro, o <b>prazo</b>: usa pelo menos três a cinco anos, de preferência incluindo uma queda. Quarto, a <b>coerência</b>: compara fundos do mesmo tipo (ações com ações, obrigações com obrigações), porque os rácios variam muito entre classes.'},
    {t:'h',id:'h6',x:'Quando os números enganam: o caso Madoff'},
    {t:'p',id:'p12',x:'Bernard Madoff geriu durante décadas, nos Estados Unidos, o que parecia um fundo fantástico: retornos pequenos mas muito certinhos, ano após ano, sem quedas visíveis. Um Sharpe altíssimo. Alguns analistas desconfiaram precisamente por isso: nenhuma estratégia real produz uma linha tão suave sem sofrer em anos maus. Em dezembro de 2008, com a crise e os pedidos de resgate, descobriu-se que era uma fraude em pirâmide e os clientes perderam milhares de milhões de dólares. A lição é dupla: um rácio bonito demais é um sinal de alerta, não de confiança, e os números nunca substituem perceber como o fundo ganha dinheiro.'},
    {t:'h',id:'h7',x:'Os limites destes rácios'},
    {t:'ul',id:'u2',x:[
      '<b>Olham para trás.</b> Um Sharpe alto no passado não garante nada no futuro.',
      '<b>Dependem do período.</b> Muda muito se a janela incluir ou não uma crise.',
      '<b>Assumem retornos regulares.</b> Estratégias que ganham pouco quase sempre e perdem muito raramente (como vender seguros de mercado) têm Sharpe excelente até ao dia da catástrofe.',
      '<b>Ativos pouco negociados</b> (imobiliário, capital privado) têm preços «alisados», o que faz a volatilidade parecer artificialmente baixa.',
      '<b>Não medem o que importa para ti.</b> O teu risco real é não teres dinheiro quando precisas, e isso depende do teu prazo.']},
    {t:'decide',id:'q2',ensina:['p4','p5','c1','p7'],label:'Decide',q:'Entre o fundo X (retorno 8%, vol 15%) e o fundo Z (retorno 5%, vol 5%), com 2% sem risco, qual tem melhor rácio de Sharpe?',o:['O X, porque rende mais','O Z, porque rende mais por unidade de risco','Têm o mesmo'],c:1,why:'O Sharpe do Z é 0,60, o do X é 0,40. O Z rendeu mais por cada ponto de volatilidade, apesar de render menos em absoluto.'},
    {t:'decide',id:'q3',ensina:['p8','p10','c2'],label:'Decide',q:'Um ativo tem poucos anos maus mas uns saltos fortes para cima. Qual rácio o trata melhor?',o:['O Sharpe, porque conta toda a volatilidade','O Sortino, porque só penaliza a volatilidade das quedas','Nenhum, porque são iguais'],c:1,why:'O Sortino usa só o desvio dos retornos abaixo do objetivo, por isso não castiga as subidas fortes, ao contrário do Sharpe.'},
    {t:'erro',id:'q4',ensina:['u2','p12'],label:'Encontra o erro',q:'Uma destas frases está errada. Qual?',o:['Um fundo com retornos muitíssimo regulares merece curiosidade e dúvidas','Um Sharpe alto no passado garante um bom futuro','O Sharpe depende do período usado no cálculo','Fundos de classes diferentes comparam-se mal pelo Sharpe'],c:1,why:'Os rácios descrevem o passado e dependem do período medido. Nenhum garante o futuro.'},
    {t:'h',id:'h8',x:'Os erros que mais custam'},
    {t:'ul',id:'u3',x:[
      'Escolher fundos só pelo maior retorno, sem olhar ao risco que o produziu.',
      'Comparar rácios calculados em períodos diferentes ou com retornos «sem risco» diferentes.',
      'Tratar um Sharpe alto como prova de talento, quando pode ser sorte de uma fase boa.',
      'Desconfiar só de retornos maus e nunca de retornos bons demais.',
      'Esquecer os custos: o rácio costuma ser calculado antes ou depois deles conforme o fundo; confirma qual (vê «Custos e TER»).']},
    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p13',x:'Para um investidor em Portugal, a referência do «retorno sem risco» pode ser aproximada pelo que rende um depósito a prazo ou um Certificado de Aforro (vê «Depósitos a prazo» e «Certificados de Aforro e do Tesouro»), tendo em conta que o retorno sem risco muda com o ciclo das taxas de juro. Os fundos e ETFs que se compram em Portugal publicam no KID e nas fichas dos emissores a volatilidade e o retorno histórico, e sites independentes de comparação mostram o Sharpe. Usa-o para comparar, nunca como único critério.'},
    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u4',x:[
      'Estes rácios medem o retorno que recebes por cada unidade de risco.',
      'Sharpe = (retorno − retorno sem risco) ÷ volatilidade.',
      'Sortino só conta a volatilidade das quedas, por isso é mais justo quando as subidas são fortes.',
      'Calmar compara o retorno com a pior queda; beta e alfa comparam com o mercado.',
      'Dependem do período e olham para trás; retornos bons demais devem levantar dúvidas.',
      'Usa-os para comparar produtos do mesmo tipo, nunca para decidir sozinhos.']}
  ], src:[] },


{ id:'diversificacao', topic:'risco', o:4, title:'Diversificação e correlação', mins:7,
  lead:'Não ponhas os ovos todos no mesmo cesto: é a ideia mais antiga do investimento. Funciona porque os ativos não se mexem todos da mesma maneira ao mesmo tempo, e é das poucas coisas em finanças que dá risco a menos sem exigir retorno a menos.',
  blocks:[
    {t:'h',id:'h1',x:'Gelados e guarda-chuvas'},
    {t:'p',id:'p1',x:'Imagina um negócio de gelados numa praia. Nos verões quentes ganha bem; nos verões chuvosos, mal. Agora imagina que o dono abre também uma loja de guarda-chuvas ao lado. Nos verões quentes os guarda-chuvas vendem pouco, nos chuvosos vendem muito. O dono ganha aproximadamente o mesmo todos os anos, apesar de cada negócio individual ser muito incerto. Isto é <b>diversificação</b>: juntar coisas que não correm bem e mal ao mesmo tempo.'},
    {t:'p',id:'p2',x:'O truque não é ter «muitas» coisas, é ter coisas que reagem de maneira diferente. Dois negócios de gelados à beira da mesma praia não ajudam: quando um vai mal, o outro também.'},
    {t:'h',id:'h2',x:'Correlação: a medida de «andar juntos»'},
    {t:'p',id:'p3',x:'A <b>correlação</b> é um número entre −1 e +1 que diz se dois ativos se mexem na mesma direção. Perto de <b>+1</b>, sobem e descem a par. Perto de <b>0</b>, mexem-se de forma independente. Perto de <b>−1</b>, quando um sobe o outro tende a descer, como os gelados e os guarda-chuvas.'},
    {t:'p',id:'p4',x:'Exemplo com dois ativos fictícios durante seis anos. O ativo X (parecido com ações) teve retornos de '+_rk_X.map(x=>_rk_f(x)+'%').join(', ')+'. O ativo Y (mais parecido com obrigações) teve '+_rk_Y.map(x=>_rk_f(x)+'%').join(', ')+'. Juntando 50% em cada, a carteira teria tido '+_rk_M.map(x=>_rk_f(x,1)+'%').join(', ')+'.'},
    {t:'cmp',id:'c1',head:['','Ativo X','Ativo Y','Carteira 50/50'],rows:[
      ['Retorno médio',_rk_f(_rk_mean(_rk_X),1)+'%',_rk_f(_rk_mean(_rk_Y),1)+'%',_rk_f(_rk_mean(_rk_M),1)+'%'],
      ['Volatilidade',_rk_f(_rk_sd(_rk_X),1)+'%',_rk_f(_rk_sd(_rk_Y),1)+'%',_rk_f(_rk_sd(_rk_M),1)+'%'],
      ['Pior ano',_rk_f(Math.min(..._rk_X),0)+'%',_rk_f(Math.min(..._rk_Y),0)+'%',_rk_f(Math.min(..._rk_M),1)+'%']],
      cap:'Valores de exemplo, escolhidos para mostrar bem o efeito (na vida real a correlação entre ações e obrigações é menos extrema). A correlação entre X e Y é '+_rk_f(_rk_corr(_rk_X,_rk_Y),2)+'.'},
    {t:'p',id:'p5',x:'A carteira 50/50 tem a volatilidade de '+_rk_f(_rk_sd(_rk_M),1)+'%, bastante <b>menor</b> do que a média das duas volatilidades ('+_rk_f((_rk_sd(_rk_X)+_rk_sd(_rk_Y))/2,1)+'%), e o pior ano ficou em '+_rk_f(Math.min(..._rk_M),1)+'% em vez de '+_rk_f(Math.min(..._rk_X))+'%. Mantém-se uma boa parte do retorno do X. Isto é o chamado «almoço grátis» da diversificação: menos risco sem perder o mesmo montante de retorno.'},
    {t:'h',id:'h3',x:'Quanto vale a correlação, em números'},
    {t:'p',id:'p6',x:'A volatilidade de uma carteira de dois ativos depende dos pesos, das volatilidades e da correlação. Tomando 50/50 e dois ativos com 20% de volatilidade cada um, o resultado muda muito com a correlação:'},
    {t:'cmp',id:'c2',head:['Correlação entre os dois','Volatilidade da carteira 50/50','Ganho face a ter só um ativo'],rows:[1,.5,0,-.5,-1].map(r=>[(r>0?'+':'')+_rk_f(r,1),_rk_f(_rk_pv(20,20,r,.5),1)+'%',_rk_f(20-_rk_pv(20,20,r,.5),1)+' pontos']),
      cap:'Dois ativos de exemplo com 20% de volatilidade. Com correlação +1 não há ganho; com −1, o risco anula-se.'},
    {t:'p',id:'p7',x:'Com correlação +1, juntar os dois não ajuda nada: é como ter o mesmo ativo duas vezes. Quanto mais baixa a correlação, mais a diversificação trabalha. Na prática, correlação de −1 não existe entre ativos reais, mas ir de +0,9 para +0,3 já faz uma grande diferença.'},
    {t:'fazve',id:'q1',ensina:['p6','c2'],q:'Dois ativos com 20% de volatilidade cada e correlação 0 são juntados 50/50. Qual é a volatilidade da carteira? (usa a fórmula √(0,25×20² + 0,25×20² + 2×0,25×corr×20×20))',unit:'%',answer:_rk_pv(20,20,0,.5),tol:.02,why:'√(0,25×400 + 0,25×400) = √200 ≈ 14,1%. Em vez de 20%, a carteira oscila só 14,1%, e ainda mantém o retorno médio dos dois.'},
    {t:'h',id:'h4',x:'O que a diversificação resolve (e o que não resolve)'},
    {t:'ul',id:'u1',x:[
      'Resolve o <b>risco específico</b> (ou «idiossincrático»): uma empresa que corre mal, um setor em crise, um país em dificuldades. Esse risco diversifica-se.',
      'Não resolve o <b>risco de mercado</b> (ou «sistemático»): numa crise geral, a maioria das ações cai ao mesmo tempo. Esse risco aguenta-se, ou reduz-se com a alocação a ativos mais estáveis.',
      'Cinco ações da mesma área <b>não</b> são diversificação: caem pelos mesmos motivos.',
      'Um ETF global dá muita diversificação com um único produto, mas continua a ter risco de mercado.']},
    {t:'p',id:'p8',x:'Estudos clássicos sugerem que as primeiras dezenas de títulos de setores diferentes eliminam a maior parte do risco específico. Depois disso, juntar mais pouco acrescenta. Mas escolher, comprar e acompanhar dezenas de títulos dá trabalho e custos; por isso os ETFs largos, com centenas ou milhares de empresas, são o caminho mais simples.'},
    {t:'h',id:'h5',x:'Um caso real: quando tudo cai ao mesmo tempo'},
    {t:'p',id:'p9',x:'Na crise financeira de 2008 aconteceu o que os manuais chamam de <b>correlações a convergir para 1</b>: quase todas as ações, de todos os países, e muitos outros ativos arriscados, caíram juntos. Quem julgava estar diversificado por ter dez fundos de ações diferentes viu que, naquele momento, estavam todos expostos ao mesmo medo. Os ativos que ajudaram foram as obrigações de dívida pública de países sólidos, o dinheiro em depósito e, em parte, o ouro. A lição: a diversificação funciona melhor com ativos de <i>natureza diferente</i> (ações, obrigações, liquidez), não só com muitos nomes diferentes dentro da mesma classe.'},
    {t:'p',id:'p10',x:'Outro exemplo mais perto de casa: em 2014 o Banco Espírito Santo, um dos maiores bancos portugueses, entrou em colapso. Muitos clientes tinham poupanças em ações, dívida e outros produtos do mesmo grupo, e viram tudo a perder valor em simultâneo. Concentrar numa só instituição é o oposto de diversificar, mesmo que o dinheiro estivesse repartido em vários produtos.'},
    {t:'h',id:'h6',x:'As faces da diversificação'},
    {t:'cmp',id:'c3',head:['Em que eixo','Como se faz','Exemplo'],rows:[
      ['Entre classes de ativos','Ações, obrigações, liquidez','Uma carteira 70/30 de ações e obrigações'],
      ['Entre regiões','Várias zonas do mundo, não só uma','ETF global em vez de só Portugal'],
      ['Entre setores','Tecnologia, saúde, energia, bancos, consumo','Índices amplos, não de um só setor'],
      ['Entre moedas','Euro e outras moedas','ETF global (traz exposição a outras moedas)'],
      ['Entre emissores','Não deixar tudo numa só instituição','Várias contas bancárias, vários emissores de dívida'],
      ['No tempo','Entradas repartidas ao longo do tempo','Investir todos os meses (vê «Investir aos poucos ou de uma vez»)']]},
    {t:'h',id:'h7',x:'Falsas diversificações'},
    {t:'ul',id:'u2',x:[
      '<b>Dez fundos com os mesmos títulos no fundo.</b> Verifica o que cada um tem; muitos fundos de ações americanas têm as mesmas grandes empresas.',
      '<b>Um ETF «temático» que parece diversificado.</b> Um ETF só de tecnologia tem muitos títulos, mas todos do mesmo setor.',
      '<b>Só ativos do teu país.</b> Se a tua casa, o teu emprego e as tuas ações dependem da economia portuguesa, uma crise cá bate em tudo ao mesmo tempo.',
      '<b>Ações da tua empresa.</b> Se ela falhar, perdes o emprego e o investimento ao mesmo tempo.',
      '<b>Mais não é sempre melhor.</b> Passar de 5 para 50 fundos pode apenas duplicar custos e trabalho.']},
    {t:'decide',id:'q2',ensina:['u1','p8'],label:'Decide',q:'Qual das opções oferece mais diversificação?',o:['Cinco ações de empresas de tecnologia americanas','Três bancos portugueses','Um ETF que replica ações de várias regiões e setores'],c:2,why:'O ETF global espalha o risco por milhares de empresas, setores e países. As outras opções concentram-se num setor ou num país e caem pelos mesmos motivos.'},
    {t:'decide',id:'q3',ensina:['p3','p7','c2'],label:'Decide',q:'Para reduzir o risco ao juntar dois ativos, que correlação entre eles é mais útil?',o:['+0,95','−0,2','+1'],c:1,why:'Quanto mais baixa a correlação, mais um ativo compensa as quedas do outro. Com +1 a diversificação é nula.'},
    {t:'erro',id:'q4',ensina:['p1','p9','u1'],label:'Encontra o erro',q:'Uma destas frases sobre diversificação está errada. Qual?',o:['Reduz o risco de uma empresa específica correr mal','Ativos pouco correlacionados reduzem a oscilação do conjunto','Garante que nunca perdes dinheiro numa crise','Cinco ações do mesmo setor não são diversificação real'],c:2,why:'A diversificação reduz o risco, não o elimina. Numa crise geral, a maioria dos ativos arriscados cai ao mesmo tempo e as correlações sobem.'},
    {t:'h',id:'h8',x:'Os erros que mais custam'},
    {t:'ul',id:'u3',x:[
      'Julgar que ter muitos produtos é ter diversificação, sem olhar ao que cada um contém.',
      'Concentrar tudo no país onde vives (o «viés doméstico»), na empresa onde trabalhas ou no banco onde tens o dinheiro.',
      'Perseguir o que mais subiu recentemente e acabar com tudo no mesmo setor.',
      'Diversificar tanto que já não percebes o que tens, nem consegues acompanhar.',
      'Esquecer que as correlações sobem nas crises: o colchão tem de ser feito de coisas realmente diferentes.']},
    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p11',x:'O mercado de ações português é pequeno e concentrado em poucos setores. Por isso, quem investe a partir de cá costuma usar ETFs UCITS globais ou europeus (vê «ETFs e diversificação: o que se compra em Portugal») em vez de montar uma carteira só com empresas nacionais. Atenção à diversificação entre bancos: o Fundo de Garantia de Depósitos protege até 100 000 € por depositante e por instituição (vê «Quem protege o teu dinheiro se o banco falir»). Verificado em 17/11/2026 no site do FGD.'},
    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u4',x:[
      'Diversificar é juntar ativos que não correm mal ao mesmo tempo.',
      'A correlação mede isso: perto de +1 é igual, perto de 0 ou negativa ajuda.',
      'Elimina o risco específico, mas não o risco de mercado.',
      'Nas crises as correlações sobem, por isso convém misturar classes de natureza diferente.',
      'Um ETF global dá, com um só produto, muita diversificação a baixo custo.',
      'Mais produtos não é sinónimo de mais diversificação.']}
  ], src:[_rk_fgd] },


{ id:'riscos-outros', topic:'risco', o:5, title:'Risco cambial, de liquidez e de inflação', mins:9,
  lead:'A queda de preço é só um dos riscos. Há vários outros, e convém saber nomeá-los para os reconhecer antes de investir. Quem só olha para o preço do dia vê metade do problema.',
  blocks:[
    {t:'h',id:'h1',x:'Um mapa dos riscos'},
    {t:'p',id:'p1',x:'Um investimento pode correr mal por razões muito diferentes, e cada razão pede uma defesa diferente. Imagina que és dono de uma casa: pode haver uma inundação, um incêndio, um vizinho barulhento ou uma subida da prestação. São riscos distintos e não se resolvem todos com o mesmo seguro. Nos investimentos acontece o mesmo, e o quadro seguinte é o mapa geral:'},
    {t:'cmp',id:'c1',head:['Risco','O que é','Exemplo','Como se atenua'],rows:[
      ['Mercado','O preço cai porque o mercado cai','Crise financeira','Prazo longo, diversificação'],
      ['Cambial','A moeda do ativo perde para o euro','Ativo em dólares com o dólar a cair','ETF com cobertura cambial, ou aceitar'],
      ['Liquidez','Não consegues vender depressa, ou só com grande perda','Um imóvel, ou um ativo pouco negociado','Preferir ativos muito negociados'],
      ['Inflação','Os preços sobem mais do que o teu retorno','Dinheiro parado numa conta','Investir acima da inflação'],
      ['Taxa de juro','As taxas sobem e o ativo perde valor','Obrigação já emitida a taxa baixa','Prazos curtos, diversificar'],
      ['Crédito / emissor','O emissor não paga o que deve','Obrigação de uma empresa falida','Emissores sólidos, diversificar'],
      ['Concentração','Demasiado dinheiro num só ativo','Todo o património numa empresa','Diversificar'],
      ['Comportamento','Tu próprio vendes no pior momento','Vender tudo em pânico','Plano escrito, regras fixas']],
      cap:'O risco de crédito e de emissor tem tema próprio: vê «Risco de emissor e de contraparte».'},
    {t:'p',id:'p2',x:'Neste tema aprofundamos os três riscos do título: o cambial, o de liquidez e o de inflação, e acrescentamos o de taxa de juro, que muitas vezes é esquecido. Repara que <b>não investir também tem risco</b>: o dinheiro parado perde poder de compra. O objetivo nunca é «risco zero», é escolher os riscos que compensam e que consegues suportar.'},
    {t:'h',id:'h2',x:'Risco cambial: quando a moeda também joga'},
    {t:'p',id:'p3',x:'Se compras um ativo cotado em dólares, o teu retorno em euros depende de duas coisas: o que o ativo fez em dólares e o que o dólar fez face ao euro. Exemplo com valores ilustrativos: o euro vale '+_rk_f(_rk_fx0,2)+' dólares quando investes e passa a valer '+_rk_f(_rk_fx1,2)+'. O ativo sobe '+_rk_usdRet+'% em dólares. Em euros, o ganho encolhe: '+_rk_f(_rk_eurRet,1)+'%. O dólar enfraqueceu face ao euro, e isso comeu o ganho.'},
    {t:'fazve',id:'q1',ensina:['p3'],q:'O euro passa de 1,10 para 1,20 dólares. Um ativo americano sobe 10% em dólares. Quanto rende em euros, em %? (arredonda às décimas)',unit:'%',answer:_rk_eurRet,tol:.1,why:'Multiplica (1,10) pela razão 1,10 ÷ 1,20 = 0,9167; dá 1,0083, ou seja, cerca de +0,8% em euros. O ativo subiu 10%, mas quase todo o ganho foi anulado pela subida do euro.'},
    {t:'p',id:'p4',x:'Isto vale para qualquer ativo exposto a moedas estrangeiras, mesmo que o ETF seja vendido em euros: um ETF de ações americanas, ainda que negociado em euros, carrega o dólar «por dentro», porque as empresas que detém cotam em dólares. Há duas respostas: aceitar o risco (em prazos longos o efeito tende a diluir-se e funciona como diversificação extra) ou escolher versões <b>com cobertura cambial</b> (<i>hedged</i>), que usam contratos para neutralizar a moeda, ao custo de uma comissão ligeiramente superior.'},
    {t:'p',id:'p5',x:'Um caso conhecido: em janeiro de 2015 o banco central suíço abandonou o limite que mantinha ao franco, e a moeda disparou em poucos minutos. Quem tinha dívidas em francos (como muitos devedores na Europa de Leste) ou apostas em sentido contrário foi apanhado de surpresa. Mostra como os câmbios podem mexer depressa e com violência.'},
    {t:'h',id:'h3',x:'Risco de liquidez: poder sair quando quiseres'},
    {t:'p',id:'p6',x:'<b>Liquidez</b> é a facilidade de transformar um ativo em dinheiro, depressa e sem grande perda de preço. Ações de grandes empresas e ETFs muito negociados são muito líquidos: vendes em segundos ao preço de mercado. Uma casa pode demorar meses a vender e custa uma comissão de agência e impostos. Um fundo imobiliário pode impor prazos de aviso para resgates. E um ativo pouco negociado pode ter um «<b>spread</b>» grande: a diferença entre o preço a que alguém quer comprar e o preço a que alguém quer vender.'},
    {t:'ul',id:'u1',x:[
      '<b>Sinais de pouca liquidez:</b> pouco volume negociado, spreads largos, prazos de resgate, necessidade de encontrar comprador.',
      '<b>O perigo escondido:</b> a liquidez desaparece quando mais precisas dela. Nas crises, até ativos normalmente líquidos negoceiam com spreads enormes.',
      '<b>A regra prática:</b> o dinheiro de que podes precisar a curto prazo não deve estar em ativos pouco líquidos nem em ativos que podem estar a perder valor nesse momento.']},
    {t:'p',id:'p7',x:'Em 2008, vários fundos de investimento imobiliário em países europeus suspenderam resgates porque os clientes queriam sair todos ao mesmo tempo e os imóveis não se vendem num dia. Quem tinha o dinheiro lá preso não conseguiu levantá-lo quando mais precisava.'},
    {t:'h',id:'h4',x:'Risco de inflação: o inimigo silencioso'},
    {t:'p',id:'p8',x:'Inflação é a subida geral dos preços. Se os preços sobem 3% e o teu dinheiro rende 3%, ficas na mesma em poder de compra. A conta certa chama-se <b>retorno real</b>: (1 + retorno) ÷ (1 + inflação) − 1. Com retorno de 3% e inflação de 2,5%, o retorno real é de apenas '+_rk_f(_rk_realRet,2)+'%. O retorno real é o que conta para os teus objetivos, porque o que compras com o dinheiro é feito aos preços de amanhã, não de hoje.'},
    {t:'w',id:'w1',w:'inflation'},
    {t:'p',id:'p9',x:'Nos anos 70, a inflação em muitos países ocidentais atingiu valores de dois dígitos depois dos choques do petróleo. Quem tinha poupanças em depósitos com juros baixos viu o dinheiro perder valor ano após ano, e os juros reais chegaram a ser negativos. É o caso extremo, mas mostra que deixar o dinheiro «seguro» a render pouco pode ser, na verdade, uma perda lenta.'},
    {t:'fazve',id:'q2',ensina:['p8','w1'],q:'Um depósito rende 3% ao ano e a inflação é de 2,5%. Qual é o retorno real aproximado, em %? (duas casas decimais)',unit:'%',answer:_rk_realRet,tol:.02,why:'(1,03 ÷ 1,025) − 1 = 0,49%. Quase nada do juro se transformou em poder de compra. Descontar a inflação é essencial para saber onde estás.'},
    {t:'h',id:'h5',x:'Risco de taxa de juro: as obrigações também caem'},
    {t:'p',id:'p10',x:'As obrigações pagam juros fixos. Se as taxas de mercado sobem depois de comprares uma, a tua passa a ser menos atraente e o preço dela baixa para compensar. Uma regra de bolso liga a descida à <b>duração</b> da obrigação (um número em anos que mede a sensibilidade): por cada ponto percentual que as taxas sobem, o preço cai aproximadamente tantos por cento quantos os anos de duração. Com uma duração de 7 anos e uma subida de 1 ponto, a queda ronda os '+_rk_bondDown+'%.'},
    {t:'p',id:'p11',x:'Isto surpreendeu muita gente em 2022, quando o BCE e a Reserva Federal subiram as taxas de forma rápida para combater a inflação: ações e obrigações caíram ao mesmo tempo, e as carteiras 60/40 tiveram um ano mau. É um lembrete de que as obrigações não são «cofres», e de que a defesa é escolher durações que se ajustem ao teu prazo.'},
    {t:'h',id:'h6',x:'Como se juntam estes riscos'},
    {t:'ul',id:'u2',x:[
      'Um ETF de ações americanas em euros: risco de mercado + cambial.',
      'Um fundo de obrigações de longo prazo: risco de taxa de juro + inflação + crédito.',
      'Um imóvel para arrendar: liquidez + concentração + inflação (as rendas podem acompanhar).',
      'Um depósito a prazo: inflação + liquidez (se mobilizares antes) + emissor (acima do limite de garantia).',
      'O dinheiro parado: sobretudo inflação.']},
    {t:'decide',id:'q3',ensina:['c1','u1'],label:'Decide',q:'Tens quase todo o património em ações da empresa onde trabalhas. Que risco estás a correr, para além de o mercado cair?',o:['Risco cambial','Risco de concentração: se a empresa correr mal, perdes emprego e investimento ao mesmo tempo','Risco de liquidez apenas'],c:1,why:'Concentrar tudo numa empresa significa que um problema nela atinge o rendimento e o património em simultâneo.'},
    {t:'decide',id:'q4',ensina:['p8','w1','p9'],label:'Decide',q:'Deixas 20 000 € numa conta à ordem a render quase nada durante 10 anos, com inflação a 3%. Que risco estás a correr?',o:['Nenhum, porque o valor nominal não desce','Risco cambial','Risco de inflação: o dinheiro compra cada vez menos'],c:2,why:'O saldo não cai, mas os preços sobem e o poder de compra desce todos os anos.'},
    {t:'decide',id:'q5',ensina:['p10','p11'],label:'Decide',q:'Esperas que as taxas de juro subam nos próximos anos. Que obrigações perdem mais valor se isso acontecer?',o:['As de prazo longo (duração alta)','As de prazo curto (duração baixa)','Todas por igual'],c:0,why:'Quanto maior a duração, maior a sensibilidade do preço às taxas. Uma duração de 7 anos perde cerca de 7% por cada ponto de subida.'},
    {t:'erro',id:'q6',ensina:['p4','p6','p8'],label:'Encontra o erro',q:'Uma destas frases está errada. Qual?',o:['Um ETF em euros de ações americanas tem exposição ao dólar','Um ativo líquido vende-se depressa sem grande perda de preço','O retorno real é o retorno antes de descontar a inflação','A inflação reduz o poder de compra do dinheiro parado'],c:2,why:'O retorno real é o que sobra depois de descontar a inflação. Antes de a descontar, chama-se retorno nominal.'},
    {t:'h',id:'h7',x:'Os erros que mais custam'},
    {t:'ul',id:'u3',x:[
      'Achar que o valor de uma conta a prazo ou à ordem «não se perde», ignorando a inflação.',
      'Comprar um ativo pouco líquido com dinheiro de que podes precisar.',
      'Esquecer que um ETF «em euros» pode ter uma moeda lá dentro.',
      'Julgar que obrigações são sempre seguras e não ver o risco de taxa de juro.',
      'Tratar cada risco isoladamente, em vez de ver o conjunto da carteira.']},
    {t:'h',id:'h8',x:'Em Portugal'},
    {t:'p',id:'p12',x:'Como investidor em euros, o teu risco cambial surge sempre que compras algo cotado ou exposto a outra moeda. Muitos ETFs UCITS oferecem versões com cobertura cambial; confirma sempre o nome completo do ETF para ver se é a versão «hedged». Para o risco de inflação, os Certificados de Aforro e outros instrumentos de poupança são formas de proteção parcial (vê «Certificados de Aforro e do Tesouro» e «Depósitos a prazo»). Quanto à liquidez, os ETFs negoceiam em bolsa e vendem-se em segundos; um imóvel, não (vê o tema «Comprar casa ou investir»).'},
    {t:'h',id:'h9',x:'Em poucas palavras'},
    {t:'ul',id:'u4',x:[
      'Há riscos diferentes do preço cair: cambial, liquidez, inflação, taxa de juro, crédito, concentração e comportamento.',
      'O retorno real (depois da inflação) é o que importa.',
      'Ativos em moeda estrangeira trazem risco cambial, mesmo vendidos em euros.',
      'As obrigações caem quando as taxas sobem; quanto maior a duração, maior a queda.',
      'A liquidez desaparece quando mais se precisa dela: não ponhas em ativos ilíquidos o que podes precisar já.',
      'Não investir também tem risco; o objetivo é escolher os que compensam.']}
  ], src:[] },


{ id:'risco-emissor', topic:'risco', o:6, title:'Risco de emissor e de contraparte', mins:8,
  lead:'Em muitos investimentos há alguém do outro lado que te deve alguma coisa: o banco, a empresa que emitiu a obrigação, a corretora, a seguradora. Se essa entidade falhar, o teu dinheiro pode ficar preso ou perder-se, por mais bem que o mercado esteja.',
  blocks:[
    {t:'h',id:'h1',x:'O vale que assinaste a um amigo'},
    {t:'p',id:'p1',x:'Imagina que emprestas 1 000 € a um amigo e ele te dá um papel a prometer devolver tudo daqui a um ano, com um pouco de juros. A tua poupança depende agora de duas coisas: do que o dinheiro rende e de o teu amigo conseguir pagar. Se ele ficar sem emprego, de nada serve o papel. Isto é o <b>risco de emissor</b> (quem emite o título, a promessa de pagar) e, de forma mais geral, o <b>risco de contraparte</b> (a pessoa ou empresa do outro lado de um contrato falhar a sua parte).'},
    {t:'p',id:'p2',x:'É um risco diferente da volatilidade. Um índice largo pode cair 40% e recuperar. Um emissor que vai à falência não recupera. O primeiro é um mau período; o segundo é perda definitiva. Por isso quem empresta dinheiro (depósitos, obrigações) tem de se preocupar com a solidez de quem recebe.'},
    {t:'h',id:'h2',x:'Onde aparece, no dia a dia'},
    {t:'cmp',id:'c1',head:['Produto','Quem é a contraparte','O que pode falhar'],rows:[
      ['Depósito a prazo','O banco','O banco falir; protegido até um limite'],
      ['Obrigação','A empresa ou o Estado que a emitiu','Não pagar juros ou capital'],
      ['Ação','Nenhuma promessa fixa','A empresa pode valer zero, mas ninguém «te deve»'],
      ['ETF ou fundo de ações','O emissor e o depositário, mais o gestor','Em geral os ativos estão separados do património do emissor, mas há detalhes (swaps, empréstimo de títulos)'],
      ['Corretora','A empresa que guarda os teus títulos e dinheiro','Falir, ser burlona ou fraudulenta'],
      ['CFD e derivados de balcão','A própria corretora, em geral','Falhar, ou fixar preços contra ti'],
      ['Plataformas de cripto','A plataforma que guarda os fundos','Falir ou desaparecer com o dinheiro'],
      ['Seguros e produtos de capitalização','A seguradora','Incumprimento da seguradora']],
      cap:'Resumo qualitativo. Cada caso tem regras próprias de proteção: confirma sempre o que se aplica.'},
    {t:'h',id:'h3',x:'Como se mede: ratings e spreads'},
    {t:'p',id:'p3',x:'Agências de notação, como a S&amp;P, a Moody’s ou a Fitch, atribuem a emissores uma nota (<b>rating</b>) que resume a probabilidade de pagarem. A escala começa em AAA e desce por letras: de AAA até BBB- chama-se <b>investment grade</b> (grau de investimento, emissores considerados sólidos); abaixo disso, de BB+ para baixo, chama-se <b>high yield</b> ou, em linguagem corrente, «lixo» (<i>junk</i>). Os emissores mais frágeis pagam juros mais altos para compensar o risco.'},
    {t:'p',id:'p4',x:'Esse juro extra chama-se <b>spread de crédito</b>: a diferença entre o que a obrigação paga e o que paga uma dívida considerada quase sem risco. Spread alto significa que o mercado vê perigo. E aqui nasce uma regra de ouro: <b>quando o juro oferecido é muito mais alto do que o de produtos parecidos, o mercado está a avisar-te de que o risco é maior</b>, ou, pior, estão a tentar enganar-te.'},
    {t:'h',id:'h4',x:'Quanto custa o risco: perda esperada'},
    {t:'p',id:'p5',x:'Em termos práticos, o risco de crédito calcula-se com duas peças: a <b>probabilidade de incumprimento</b> (a chance de o emissor falhar num ano) e a <b>perda em caso de incumprimento</b> (o que não recuperas). Exemplo ilustrativo: uma obrigação de uma empresa paga '+_rk_yHi+'% ao ano, enquanto uma dívida muito segura paga '+_rk_yLo+'%. Imagina que a probabilidade de falhar em cada ano é de '+_rk_pd+'% e que, se falhar, recuperas '+_rk_rec+'% do que investiste (perdes '+(100-_rk_rec)+'%).'},
    {t:'ul',id:'u1',x:[
      '<b>Perda esperada por ano:</b> '+_rk_pd+'% × '+(100-_rk_rec)+'% = '+_rk_f(_rk_el,1)+'%.',
      '<b>Juro depois de descontar a perda esperada:</b> '+_rk_yHi+'% − '+_rk_f(_rk_el,1)+'% = '+_rk_f(_rk_net,1)+'%.',
      '<b>Prémio sobre a dívida segura:</b> '+_rk_f(_rk_net,1)+'% − '+_rk_yLo+'% = '+_rk_f(_rk_net-_rk_yLo,1)+'% ao ano pelo incómodo de poder ter um falhanço.']},
    {t:'stat',id:'s1',v:Math.round(_rk_yHi-_rk_yLo),fmt:'pct',label:'Juro extra prometido pela obrigação de exemplo (pontos percentuais)'},
    {t:'p',id:'p6',x:'O ponto é este: os '+(_rk_yHi-_rk_yLo)+' pontos de juro «a mais» não são lucro garantido. Uma parte é a compensação esperada pelas falhas, e a outra o prémio por aguentares a incerteza. E quando o falhanço acontece, a perda é de uma vez só, enquanto os juros extra demoraram anos a acumular.'},
    {t:'fazve',id:'q1',ensina:['p5','u1'],q:'Uma obrigação tem 3% de probabilidade anual de incumprimento e, se falhar, recuperas só 50% do capital. Qual é a perda esperada por ano, em %?',unit:'%',answer:3*50/100,tol:.02,why:'3% × (100% − 50%) = 3% × 50% = 1,5% ao ano. É o custo médio do risco, que o juro tem de cobrir antes de haver qualquer lucro.'},
    {t:'h',id:'h5',x:'Três casos reais'},
    {t:'p',id:'p7',x:'<b>Lehman Brothers (2008).</b> Em setembro de 2008 este banco de investimento americano faliu. Muitos investidores, incluindo pessoas comuns em vários países, tinham produtos estruturados e dívida do banco, e perderam grande parte do valor. A falência alastrou a desconfiança ao sistema financeiro inteiro, e mostrou que «um banco grande» não equivale a «um banco seguro».'},
    {t:'p',id:'p8',x:'<b>Grécia (2012).</b> Os credores privados de dívida pública grega acordaram uma reestruturação em que ficaram com perdas muito significativas, de mais de metade do valor nominal. Foi a prova de que nem a dívida de um Estado da Zona Euro está livre de risco de emissor.'},
    {t:'p',id:'p9',x:'<b>Banco Espírito Santo (2014).</b> O BES, um dos maiores bancos portugueses, colapsou. Muitos clientes de balcão tinham aplicações em dívida do próprio grupo, e perderam dinheiro. A lição é geral: quem te vende um produto pode ter interesse em vender o seu próprio risco. Antes de comprar, pergunta quem é o emissor e o que acontece se ele falhar.'},
    {t:'p',id:'p10',x:'Mais recentemente, em 2022, a plataforma de criptoativos FTX entrou em colapso depois de se descobrir que usara dinheiro dos clientes para outros fins. Os clientes ficaram sem acesso aos fundos. É o risco de contraparte na sua forma mais crua: tinhas o dinheiro «na plataforma», e a plataforma não tinha o dinheiro.'},
    {t:'h',id:'h6',x:'Que proteções existem'},
    {t:'p',id:'p11',x:'Para o dinheiro em <b>depósitos</b>, existe o Fundo de Garantia de Depósitos, que reembolsa até 100 000 € por depositante e por instituição (verificado em 17/11/2026 no site do FGD). O limite aplica-se por banco, não por pessoa no total, e é por isso que quem tem valores acima disso pode repartir por mais do que uma instituição. Experimenta:'},
    {t:'w',id:'w1',w:'fgd'},
    {t:'p',id:'p12',x:'Para <b>títulos guardados numa corretora</b>, existe um sistema de indemnização aos investidores, de valor mais baixo, que cobre falhas da intermediária (vê «Sistema de Indemnização aos Investidores»). Os títulos pertencem-te, e em geral estão registados à parte do património da corretora, mas há detalhes que convém confirmar.'},
    {t:'note',id:'n1',pending:true,x:'Sistema de Indemnização aos Investidores: 25 000 € por investidor, segundo fontes secundárias (literaciafinanceira.pt, Cofidis) e o Decreto-Lei 222/99; a confirmar na CMVM. Regras de segregação de ativos de clientes em corretoras e fundos UCITS: confirmar também em fonte oficial.'},
    {t:'p',id:'p13',x:'Para <b>obrigações, ações e ETFs</b>, não há garantia nenhuma contra a perda de valor ou a falência do emissor: a proteção é o teu critério e a diversificação.'},
    {t:'h',id:'h7',x:'Como reduzir o risco de emissor'},
    {t:'ul',id:'u2',x:[
      '<b>Diversificar emissores.</b> Em vez de uma obrigação de uma empresa, um fundo ou ETF de obrigações de muitas. O risco de uma falhar dilui-se.',
      '<b>Olhar para o rating</b> e para o que as agências estão a mudar; desconfiar de juros muito acima do normal.',
      '<b>Entender quem é a contraparte.</b> Num produto estruturado ou num ETF «sintético», há um banco do outro lado de um contrato; um ETF físico (que detém os títulos) tem outros riscos. Lê o KID e o prospeto.',
      '<b>Repartir o dinheiro</b> por mais do que uma instituição quando passa do limite de garantia.',
      '<b>Confirmar que a entidade está autorizada.</b> A CMVM e o Banco de Portugal têm listas de entidades registadas e alertas sobre as que não estão.',
      '<b>Nunca concentrar em quem te vende o produto</b> ou no teu empregador.']},
    {t:'decide',id:'q2',ensina:['p5','u1','p6'],label:'Decide',q:'Uma obrigação paga 9% e outra semelhante, de um emissor sólido, paga 3%. Qual é a leitura mais sensata?',o:['A de 9% é simplesmente melhor','O mercado vê muito mais risco de falha na de 9%, e o juro extra é a compensação por isso','A de 3% está a enganar quem a compra'],c:1,why:'Juros muito acima do normal são sinal de que o mercado exige compensação por um risco de perda maior. Não é um «desconto», é um aviso.'},
    {t:'decide',id:'q3',ensina:['p11','w1'],label:'Decide',q:'Tens 150 000 € num único banco. Que parte fica acima do limite de garantia do FGD?',o:['Nada, porque tudo está protegido','50 000 €','100 000 €'],c:1,why:'A garantia cobre até 100 000 € por depositante e por instituição. Os restantes 50 000 € ficam sem garantia. Repartindo por dois bancos, tudo ficaria protegido.'},
    {t:'erro',id:'q4',ensina:['p11','p13','u2'],label:'Encontra o erro',q:'Uma destas frases está errada. Qual?',o:['Depósitos têm uma garantia até um limite por banco','As obrigações têm garantia pública contra falência do emissor','Diversificar emissores reduz o risco de crédito','Um ETF sintético tem um banco como contraparte'],c:1,why:'Obrigações de empresas não têm garantia pública: se o emissor falha, o investidor suporta a perda.'},
    {t:'h',id:'h8',x:'Os erros que mais custam'},
    {t:'ul',id:'u3',x:[
      'Ir atrás do juro mais alto sem perguntar de onde vem.',
      'Concentrar tudo no mesmo banco, ou em produtos do mesmo grupo.',
      'Confiar no nome ou na dimensão: «é um banco grande, não falha» foi dito em 2008.',
      'Achar que tudo o que se compra a uma instituição está protegido por garantia.',
      'Não ler quem é o emissor nem o que diz o documento de informações fundamentais.']},
    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p14',x:'Lê os temas «Quem protege o teu dinheiro se o banco falir», «Sistema de Indemnização aos Investidores» e «Burlas e a lista da CMVM» para ver os mecanismos cá e como confirmar se uma entidade está autorizada. Se hesitas entre guardar títulos num banco ou numa corretora, vê «Banco ou corretora?». O dinheiro depositado repartido por vários bancos fica melhor protegido.'},
    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u4',x:[
      'Risco de emissor é a possibilidade de quem te deve não pagar; contraparte é o mesmo, em contratos.',
      'Ratings e spreads medem-no; juro muito alto é sinal de perigo.',
      'Perda esperada = probabilidade de incumprimento × perda se falhar.',
      'Depósitos têm garantia até 100 000 € por banco; obrigações e ações não têm.',
      'Diversifica emissores e repartir por instituições; confirma que a entidade está autorizada.',
      'Dimensão e fama não eliminam o risco.']}
  ], src:[_rk_fgd,_CMVM] },


{ id:'risco-sequencia', topic:'risco', o:7, title:'Risco de sequência: a ordem dos retornos perto da reforma', mins:8,
  lead:'O retorno médio de uma carteira não chega para saber como acaba. Quando estás a poupar, a ordem dos anos bons e maus quase não conta. Quando já estás a retirar dinheiro para viver, conta imenso. É o risco de sequência, e é a razão pela qual a reforma pede uma carteira diferente da juventude.',
  blocks:[
    {t:'h',id:'h1',x:'Descer uma escada com uma mochila a esvaziar'},
    {t:'p',id:'p1',x:'Imagina duas pessoas com a mesma mochila de comida para dez dias de caminhada. Uma apanha o pior tempo no início, com neve e vento; a outra apanha-o no fim. Em média, o tempo foi igual para as duas. Mas a primeira perdeu mais forças, gastou mais comida a lutar contra o frio e chega ao fim mais fraca, com a mochila mais vazia. A segunda começou forte e aguenta melhor a parte final. Com o dinheiro, é igual: se o mau tempo chega quando tens a mochila cheia e ainda não tiraste nada, passas melhor; se chega logo que começas a tirar, o estrago é maior.'},
    {t:'p',id:'p2',x:'A isto chama-se <b>risco de sequência de retornos</b>: o risco de os piores anos do mercado calharem no pior momento para ti, que é perto do início das retiradas, isto é, perto da reforma. É um risco que depende apenas da <i>ordem</i>, não do retorno médio.'},
    {t:'h',id:'h2',x:'Quando poupas, a ordem importa pouco (e até pode ajudar)'},
    {t:'p',id:'p3',x:'Se investires uma quantia única e deixares crescer, a ordem dos retornos é irrelevante: (1,10 × 0,80) dá o mesmo que (0,80 × 1,10), porque a multiplicação não depende da ordem. Duas sequências com os mesmos retornos acabam exatamente no mesmo valor. Nos nossos dez anos de exemplo ('+_rk_R.map(x=>_rk_f(x)+'%').join(', ')+'), o dinheiro multiplica-se por '+_rk_f(_rk_l1,3)+' em qualquer ordem, o que corresponde a um retorno anual composto de '+_rk_f(_rk_gm,1)+'%.'},
    {t:'fazve',id:'q1',ensina:['p3'],q:'Investes 100 000 € de uma vez. Num ano o mercado cai 20%, no outro sobe 25%. Quanto tens ao fim dos dois anos, em qualquer ordem?',unit:'€',answer:100000*.8*1.25,tol:.01,why:'100 000 × 0,80 × 1,25 = 100 000 €. Sem retiradas nem entregas, a ordem não muda o resultado: a multiplicação é comutativa.'},
    {t:'p',id:'p4',x:'Se, em vez de uma quantia única, estás a <b>entregar</b> '+_e(5000)+' por ano, a ordem passa a contar, mas a teu favor se os anos maus vierem cedo: compras mais barato. Com as mesmas dez rentabilidades, quem começa pelos anos maus acaba com '+_e(_rk_c1.at(-1))+', e quem tem os anos maus no fim acaba com '+_e(_rk_c2.at(-1))+'. Enquanto poupas, uma queda cedo é uma boa notícia disfarçada.'},
    {t:'h',id:'h3',x:'Quando levantas, a ordem decide tudo'},
    {t:'p',id:'p5',x:'Agora o caso inverso. Reformaste-te com 500 000 € e levantas '+_e(25000)+' por ano para viver (5% do capital inicial, acima da regra dos 4% que vais ver já a seguir, para o efeito se notar bem). As rentabilidades são as mesmas, e são as mesmas dez do caso anterior. Só muda a ordem:'},
    {t:'cmp',id:'c1',head:['Ano','Cenário A: começa mal','Saldo A','Cenário B: acaba mal','Saldo B'],rows:_rk_R.map((r,i)=>[String(i+1),_rk_f(r)+'%',_e(_rk_w1[i]),_rk_f(_rk_Rr[i])+'%',_e(_rk_w2[i])]),
      cap:'Valores de exemplo: saldo ao fim de cada ano, depois de levantar '+_e(25000)+' no início do ano e aplicar o retorno.'},
    {t:'stat',id:'s1',v:Math.round(_rk_w2.at(-1)-_rk_w1.at(-1)),fmt:undefined,label:'Diferença no fim dos dez anos entre os dois cenários, com os mesmos retornos'},
    {t:'p',id:'p6',x:'No cenário A, as quedas caíram em cima dos primeiros levantamentos: venderam-se unidades quando o preço estava no fundo, e essas unidades não participaram na recuperação. No cenário B, os anos bons vieram cedo, o saldo cresceu e aguentou melhor os anos maus no fim. Mesmo retorno médio, resultados muito diferentes: '+_e(_rk_w1.at(-1))+' contra '+_e(_rk_w2.at(-1))+'.'},
    {t:'p',id:'p7',x:'Há um motivo mecânico simples: quando levantas dinheiro de uma carteira que desceu, vendes uma fatia maior dela para o mesmo valor. Essa fatia não volta a beneficiar da subida. Em linguagem corrente, <b>vendes barato e já não podes recomprar</b>.'},
    {t:'h',id:'h4',x:'A «regra dos 4%» e os seus limites'},
    {t:'p',id:'p8',x:'Uma regra de bolso conhecida diz que podes levantar cerca de 4% do capital no primeiro ano de reforma, atualizar esse valor com a inflação, e que o dinheiro costuma aguentar 30 anos em estudos feitos com dados americanos. Nasceu precisamente a estudar o risco de sequência. Tem limites: baseia-se em mercados e épocas específicos, supõe uma carteira de ações e obrigações, e não garante nada num mercado diferente. Usa-a para <b>estimar a ordem de grandeza</b> do capital de que precisas, nunca como verdade absoluta. Experimenta:'},
    {t:'w',id:'w1',w:'calc',c:'retire'},
    {t:'h',id:'h5',x:'Como se reduz o risco de sequência'},
    {t:'ul',id:'u1',x:[
      '<b>Reduzir o risco à medida que o prazo encurta.</b> É o conceito de «<i>glide path</i>»: começas com muitas ações e vais passando para obrigações e liquidez nos anos antes da reforma. Muitos fundos de ciclo de vida fazem isto sozinhos.',
      '<b>Ter um colchão de despesas.</b> Guardar 2 a 3 anos de despesas em liquidez ou ativos estáveis, para não teres de vender ações nos anos maus. Em vez de levantar sempre da mesma carteira, levantas do colchão e repões nos anos bons (a chamada estratégia dos «baldes»).',
      '<b>Levantar de forma flexível.</b> Em anos maus, cortar um pouco nas despesas não essenciais. Levantar menos nos primeiros anos faz muita diferença.',
      '<b>Outras fontes de rendimento.</b> Uma pensão, rendas, ou trabalho a tempo parcial nos primeiros anos reduzem a pressão sobre a carteira.',
      '<b>Diversificar.</b> Uma carteira só de ações amplifica o risco de sequência.',
      '<b>Adiar a reforma um ou dois anos</b> quando o mercado está em baixa: cada ano a mais é um ano a menos de levantamentos e a mais de entregas.']},
    {t:'h',id:'h6',x:'Um caso real: reformar-se no pior ano'},
    {t:'p',id:'p9',x:'Nas décadas modernas há exemplos claros. Quem se reformou no início de 2000, com carteira cheia de ações, apanhou a queda da bolha tecnológica nos primeiros anos e, logo a seguir, a crise de 2008, e o dinheiro encolheu muito durante os levantamentos. Quem se reformou apenas alguns anos antes ou depois, com os mesmos retornos médios, teve uma experiência muito mais suave. O mesmo vale para quem tinha quase todo o dinheiro em ações no fim de 2007, a poucos anos de se reformar: viu o valor cair mais de metade quando já não tinha tempo para esperar.'},
    {t:'decide',id:'q2',ensina:['p5','c1','p6','p7'],label:'Decide',q:'Dois reformados levantam o mesmo valor todos os anos e a carteira tem o mesmo retorno médio. O primeiro apanha uma queda forte nos primeiros anos, o segundo no fim. Quem acaba com menos dinheiro, em geral?',o:['O segundo, porque a queda foi mais recente','O primeiro, porque as quedas apanharam-no logo nos primeiros levantamentos','Nenhum: o retorno médio é igual, por isso o resultado é igual'],c:1,why:'Com levantamentos, vender unidades ao preço baixo logo no início faz perder a recuperação seguinte. O mesmo retorno médio pode dar resultados muito diferentes.'},
    {t:'decide',id:'q3',ensina:['p4'],label:'Decide',q:'Tens 30 anos e entregas dinheiro todos os meses. O mercado cai forte no próximo ano. Como te afeta, em geral?',o:['É má notícia pura','É boa notícia disfarçada, porque as entregas compram mais barato','Não afeta nada'],c:1,why:'Quem está a acumular compra mais unidades quando o preço desce. Uma queda cedo no percurso é favorável, com prazo e disciplina.'},
    {t:'erro',id:'q4',ensina:['p3','p4','p7'],label:'Encontra o erro',q:'Uma destas afirmações está errada. Qual?',o:['Com um investimento único, a ordem dos retornos não muda o valor final','Quando estás a levantar dinheiro, a ordem dos retornos pode mudar muito o resultado','O risco de sequência afeta sobretudo quem está longe da reforma e investe todos os meses','Reduzir o risco perto da reforma ajuda a proteger contra a má sequência'],c:2,why:'O risco de sequência afeta sobretudo quem está perto de levantar dinheiro. Para quem acumula, anos maus cedo podem até ser favoráveis.'},
    {t:'h',id:'h7',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      'Chegar à reforma com 100% em ações porque «a bolsa sobe no longo prazo».',
      'Planear só com o retorno médio, sem testar um cenário de queda logo no início.',
      'Esquecer a inflação: o valor levantado tem de crescer ao longo dos anos.',
      'Vender em pânico depois de uma queda, em vez de usar o colchão.',
      'Levantar mais nos primeiros anos «porque ainda tenho saúde», e deixar a carteira sem fôlego.']},
    {t:'h',id:'h8',x:'Em Portugal'},
    {t:'p',id:'p10',x:'Em Portugal, a pensão da Segurança Social costuma ser a base do rendimento de reforma, e a carteira própria um complemento (vê «Reforma e Segurança Social»). Isso reduz a pressão sobre a carteira, e é uma forma natural de mitigar o risco de sequência. Para quem poupa por PPR ou por conta própria, o tema «PPR ou investir por conta própria» compara as duas vias, e «PPR: poupança com benefício fiscal» explica os incentivos. Muitos PPR reduzem o risco com a idade; confirma no prospeto de cada um. Quando vendes para levantar, lembra-te de que há mais-valias a declarar (vê «Mais-valias: quanto imposto pagas ao vender»).'},
    {t:'h',id:'h9',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'Risco de sequência é o risco de os piores anos virem no início das retiradas.',
      'Com uma quantia única, a ordem não importa; com levantamentos, importa muito.',
      'Quem poupa até pode beneficiar de anos maus cedo.',
      'A regra dos 4% é só uma ordem de grandeza.',
      'Defesas: reduzir o risco ao aproximar a reforma, ter um colchão de 2 a 3 anos, levantar com flexibilidade.',
      'Planeia sempre para um cenário mau nos primeiros anos.']}
  ], src:[] },


{ id:'perfil-risco', topic:'risco', o:8, title:'O teu perfil de risco', mins:8,
  lead:'Quanto risco podes e queres aceitar? A resposta depende de três coisas diferentes, e é comum confundi-las. Acertar nisto antes de investir evita o erro mais caro de todos: vender em pânico no pior momento.',
  blocks:[
    {t:'h',id:'h1',x:'Um carro, uma estrada e um condutor'},
    {t:'p',id:'p1',x:'Imagina que vais conduzir numa estrada de montanha. Três coisas decidem a velocidade a que podes ir: o <b>carro</b> (o que ele aguenta), a <b>estrada</b> (o que o destino exige, e o tempo que tens) e o <b>condutor</b> (como reages quando vem uma curva fechada). Um carro desportivo na mão de um condutor nervoso numa estrada de curvas é receita para um acidente. Na carteira passa-se o mesmo: o teu perfil de risco é a combinação de três peças, e a menor delas manda.'},
    {t:'h',id:'h2',x:'As três peças'},
    {t:'ul',id:'u1',x:[
      '<b>Capacidade</b> (o carro): quanto podes perder sem pôr em causa a tua vida. Depende do rendimento estável, das reservas, das dívidas, das pessoas a cargo e do património fora da carteira.',
      '<b>Necessidade</b> (a estrada): que retorno precisas para atingir o objetivo. Se um retorno baixo chega, não é preciso arriscar mais. Se o objetivo exige um retorno muito alto, é sinal de que o objetivo ou o prazo precisam de revisão, e não de mais risco.',
      '<b>Tolerância</b> (o condutor): como reages emocionalmente a uma queda. Uma coisa é dizer que aguentas 30% de queda, outra é ver os 30% na conta e as notícias a falar de crise.']},
    {t:'p',id:'p2',x:'O <b>prazo</b> liga as três: mais anos até precisares do dinheiro permitem mais risco, porque dão tempo à recuperação. Duas pessoas com a mesma tolerância podem ter perfis diferentes se uma precisa do dinheiro daqui a 3 anos e a outra daqui a 30.'},
    {t:'p',id:'p3',x:'O perfil final é o <b>mais prudente</b> das três peças, não a média. Se a capacidade é baixa, mas a tolerância é alta, manda a capacidade: podes até gostar de arriscar, mas não podes perder. Se a capacidade é alta, mas a tolerância é baixa, manda a tolerância: de nada serve um plano que não consegues cumprir.'},
    {t:'h',id:'h3',x:'Capacidade: o primeiro passo é a rede por baixo'},
    {t:'p',id:'p4',x:'Antes de falar de bolsa, pergunta-te se tens as bases. Um <b>fundo de emergência</b> separado protege-te de teres de vender investimentos num mau momento por causa de uma avaria ou de uma quebra de rendimento. Calcula o teu:'},
    {t:'w',id:'w1',w:'calc',c:'emergency'},
    {t:'p',id:'p5',x:'Depois olha para as dívidas caras, que muitas vezes rendem mais (em poupança de juros) do que qualquer investimento esperaria dar. E para o rendimento: um funcionário público com contrato estável tem maior capacidade para a mesma carteira do que um trabalhador independente com rendimentos irregulares. Mais gente a depender do teu rendimento significa menos capacidade.'},
    {t:'h',id:'h4',x:'Tolerância: a que só se descobre em queda'},
    {t:'p',id:'p6',x:'Estudos de psicologia financeira, a começar pelos de Daniel Kahneman e Amos Tversky, mostram que as perdas pesam bastante mais do que ganhos do mesmo tamanho: cerca do dobro, segundo muitas estimativas. É a chamada <b>aversão à perda</b>. Por isso, os questionários pouco dizem sobre o que farás de verdade: só saberás ao ver a conta no vermelho. A melhor forma de testar é traduzir em euros.'},
    {t:'h',id:'h5',x:'Um teste de esforço em euros'},
    {t:'p',id:'p7',x:'Pega no que pensas investir e imagina uma queda de 40% nas ações (um número já visto em crises). Calcula quanto isso é, em euros, e pergunta-te honestamente: dormia? mantinha as entregas mensais? Com 20 000 € investidos, o quadro mostra quanto perdias em três perfis de exemplo:'},
    {t:'cmp',id:'c1',head:['Perfil (exemplo)','Ações','Resto (obrigações, liquidez)','Perda numa queda de 40% das ações'],rows:_rk_st.map(s=>[s.n,s.a+'%',(100-s.a)+'%',_e(s.loss)]),
      cap:'Exemplos para ilustrar o teste, não recomendações. Assume que o resto da carteira não perde valor.'},
    {t:'stat',id:'s1',v:Math.round(_rk_st[2].loss),label:'Perda do perfil dinâmico de exemplo numa queda de 40% das ações'},
    {t:'fazve',id:'q1',ensina:['p7','c1'],q:'Tens 20 000 € investidos, 60% em ações. As ações caem 40% e o resto não se mexe. Quanto perdes, em euros?',unit:'€',answer:20000*.6*.4,tol:.01,why:'60% de 20 000 € = 12 000 € em ações. 40% de 12 000 € = 4 800 €. Se este número te assusta, a parte em ações é demasiado alta para ti.'},
    {t:'h',id:'h6',x:'Do perfil à carteira: um percurso em passos'},
    {t:'ul',id:'u2',x:[
      '<b>1. Escreve o objetivo e a data.</b> Reforma, entrada para uma casa, uma viagem? Cada objetivo tem o seu prazo e o seu perfil.',
      '<b>2. Garante a rede.</b> Fundo de emergência feito, dívidas caras tratadas.',
      '<b>3. Avalia a capacidade</b> com números: rendimento, despesas, pessoas a cargo.',
      '<b>4. Faz o teste de esforço</b> em euros e vê como te sentes.',
      '<b>5. Escolhe uma alocação</b> compatível com a peça mais prudente (vê «Alocação de ativos»).',
      '<b>6. Escreve regras</b> para o que fazer numa queda (vê «O teu plano de investimento por escrito»).',
      '<b>7. Revê</b> uma vez por ano ou quando a vida muda.']},
    {t:'h',id:'h7',x:'O perfil não é fixo'},
    {t:'p',id:'p8',x:'O perfil <b>muda</b> com a idade, a situação familiar, o património, o emprego. Quem está perto de precisar do dinheiro costuma reduzir o risco para garantir o que já tem (vê «Risco de sequência: a ordem dos retornos perto da reforma»). Quem acabou de ter um filho pode precisar de mais reservas. E a tolerância muda com a experiência: quem já viveu uma crise sem vender, normalmente, aguenta melhor a seguinte.'},
    {t:'cmp',id:'c2',head:['Prazo até precisares do dinheiro','Peso típico do risco','Porquê'],rows:[
      ['Menos de 3 anos','Muito baixo','Uma queda pode não ter tempo de recuperar'],
      ['3 a 10 anos','Moderado','Algum tempo de recuperação, mas não muito'],
      ['Mais de 10 anos','Pode ser mais alto','Há tempo para atravessar ciclos completos']],
      cap:'Regra de bolso qualitativa: o prazo é um dos fatores, não o único.'},
    {t:'h',id:'h8',x:'Um caso real: o que fizeram os investidores em 2008 e 2020'},
    {t:'p',id:'p9',x:'Na crise de 2008 e na queda de março de 2020, muitos investidores que se diziam de «perfil dinâmico» venderam tudo no pior momento. Quem manteve o plano viu os mercados recuperarem, e em 2020 a recuperação foi rápida; quem vendeu fixou a perda. O padrão repete-se: a tolerância declarada é sempre maior do que a tolerância real, e é por isso que o teste de esforço em euros vale mais do que um questionário.'},
    {t:'decide',id:'q2',ensina:['h2','u1','p2','p3'],label:'Decide',q:'O pai tem 62 anos, vai precisar das poupanças para viver na reforma daqui a 3 anos e já não tem outro rendimento. Qual é a postura mais coerente?',o:['Arriscar muito, para recuperar o tempo perdido','Ignorar o prazo e olhar só para o retorno','Dar mais peso à segurança, porque a capacidade de absorver quedas é baixa e o prazo é curto'],c:2,why:'Com um prazo curto, sem outro rendimento, uma queda forte pode não ter tempo de recuperar. A capacidade pesa mais do que o desejo de rendimento.'},
    {t:'decide',id:'q3',ensina:['u1','p6','p9'],label:'Decide',q:'Dizes que aguentas uma queda de 30%, mas na última correção vendeste tudo em pânico. Qual das peças falhou?',o:['A capacidade financeira','A necessidade de retorno','A tolerância emocional, que é diferente da que imaginavas'],c:2,why:'A tolerância real só se conhece quando as quedas acontecem. Se vendeste em pânico, o teu perfil real é mais prudente do que supunhas.'},
    {t:'decide',id:'q4',ensina:['p3'],label:'Decide',q:'A tua capacidade é alta (rendimento estável, boas reservas), mas ficas muito ansioso com perdas. Que perfil é mais coerente?',o:['O da capacidade: arriscar muito','Um perfil mais prudente, ditado pela tolerância','Fazer a média e esquecer'],c:1,why:'O perfil final é o mais prudente das peças. Um plano que não consegues cumprir sob pressão não serve.'},
    {t:'erro',id:'q5',ensina:['p3','p8','c2'],label:'Encontra o erro',q:'Uma destas afirmações está errada. Qual?',o:['O perfil pode mudar com a idade e a situação familiar','O prazo é um dos fatores que determinam o perfil','O perfil é sempre o mais arrojado das três peças','Capacidade, necessidade e tolerância são coisas diferentes'],c:2,why:'O perfil resulta da peça mais prudente. Se uma das três for baixa, essa limita o risco que deves correr.'},
    {t:'h',id:'h9',x:'Os erros que mais custam'},
    {t:'ul',id:'u3',x:[
      'Confundir vontade de arriscar com capacidade de aguentar perdas.',
      'Responder a um questionário e esquecer o teste em euros.',
      'Arriscar mais depois de uma série de ganhos (excesso de confiança).',
      'Copiar o perfil de um amigo ou familiar com outro prazo e outro rendimento.',
      'Nunca rever o perfil: aos 25 e aos 60 anos as respostas deviam ser diferentes.']},
    {t:'h',id:'h10',x:'Em Portugal'},
    {t:'p',id:'p10',x:'Quando abres conta numa corretora ou num banco para investir, é comum pedirem-te que respondas a um questionário sobre os teus conhecimentos e objetivos. Serve para te informar e para a entidade avaliar a adequação do produto, mas não substitui o teu teste de esforço. A ficha de cada produto (KID) tem um indicador de risco para te ajudar a comparar. Para as bases da tua rede e as tuas metas, vê os temas «Fundo de emergência: a rede por baixo de tudo» e «Objetivos e horizonte temporal».'},
    {t:'note',id:'n1',pending:true,x:'Questionário de adequação ou de conhecimentos pedido pelas entidades que vendem produtos de investimento: regras europeias (MiFID II); confirmar o enquadramento exato em fonte oficial (CMVM). Indicador de risco do KID (escala de 1 a 7): ver nota no tema «Volatilidade: quanto oscila».'},
    {t:'h',id:'h11',x:'Em poucas palavras'},
    {t:'ul',id:'u4',x:[
      'O perfil de risco tem três peças: capacidade, necessidade e tolerância.',
      'Manda a mais prudente, não a média.',
      'O prazo liga as três: mais anos permitem mais risco.',
      'A tolerância real só se vê em queda; testa-a com o teste de esforço em euros.',
      'Garante primeiro a rede: fundo de emergência e dívidas caras.',
      'Revê o perfil quando a vida muda.']}
  ], src:[] }
);
