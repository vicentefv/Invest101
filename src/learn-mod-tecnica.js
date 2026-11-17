// ================= Aprender: módulo «tecnica» =================
// Regras de Portugal só com fonte oficial (campo `src`); o que não ficou confirmado leva `pending:true` («Por confirmar»).
// Todas as ações e séries deste módulo são inventadas ou simuladas, com números calculados aqui para nunca divergirem do texto.

const _te_n=(x,d=1)=>Number(x).toLocaleString('pt-PT',{minimumFractionDigits:d,maximumFractionDigits:d});
const _te_p=(x,d=1)=>_te_n(x,d)+'%';
const _te_r=(x,d=1)=>+Number(x).toFixed(d);
const _te_rng=seed=>{ let s=seed>>>0; return ()=>{ s=(Math.imul(s,1664525)+1013904223)>>>0; return s/4294967296; }; };
const _te_norm=r=>{ const u=r()||1e-9, v=r(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); };
const _te_sma=(a,n)=>a.map((_,i)=>i<n-1?null:a.slice(i-n+1,i+1).reduce((s,x)=>s+x,0)/n);
const _te_ema=(a,n)=>{ const k=2/(n+1); let e=null; return a.map(x=>{ e=e===null?x:x*k+e*(1-k); return e; }); };
const _te_std=a=>{ const m=a.reduce((s,x)=>s+x,0)/a.length; return Math.sqrt(a.reduce((s,x)=>s+(x-m)*(x-m),0)/a.length); };
// Passeio aleatório simulado (sem qualquer padrão por construção): n dias, volatilidade diária vol (%).
const _te_walk=(seed,n,vol,start)=>{ const r=_te_rng(seed); const a=[start||100]; for(let i=1;i<n;i++) a.push(a[i-1]*(1+_te_norm(r)*vol/100)); return a; };

// ---- Velas: cinco dias da «Ação Alfa» (valores de exemplo)
const _te_V=(()=>{
  const dias=[[20.0,20.8,19.8,20.6],[20.6,21.4,20.5,21.3],[21.3,22.1,20.6,21.4],[21.4,21.5,20.3,20.4],[19.9,20.1,19.0,20.0]];
  const cls=(o,h,l,c)=>{ const corpo=Math.abs(c-o), amp=h-l, sup=h-Math.max(o,c), inf=Math.min(o,c)-l;
    if(corpo/amp<0.2&&inf>=2*corpo&&sup<=corpo*1.2+0.05) return 'Corpo pequeno e sombra inferior longa (martelo)';
    if(corpo/amp<0.2) return 'Corpo pequeno e sombras longas (indecisão)';
    return c>o?'Vela de subida':'Vela de descida'; };
  const rows=dias.map(([o,h,l,c],i)=>({d:i+1,o,h,l,c,corpo:c-o,amp:h-l,pc:Math.abs(c-o)/(h-l)*100,txt:cls(o,h,l,c)}));
  return {rows,q:{o:50,h:53,l:49,c:52}};
})();

// ---- Tendências: 24 fechos da «Ação Gama»; pivôs calculados (máximo ou mínimo local)
const _te_T=(()=>{
  const c=[20.0,20.8,21.6,21.0,20.4,21.2,22.4,23.4,22.8,22.1,23.0,24.4,25.2,24.5,23.8,24.6,26.0,26.6,25.9,25.2,26.1,27.5,27.9,27.2];
  const hi=[],lo=[]; for(let i=1;i<c.length-1;i++){ if(c[i]>c[i-1]&&c[i]>c[i+1]) hi.push([i+1,c[i]]); if(c[i]<c[i-1]&&c[i]<c[i+1]) lo.push([i+1,c[i]]); }
  const up=a=>a.every((x,i)=>!i||x[1]>a[i-1][1]);
  const l0=lo[0],l1=lo[lo.length-1],slope=(l1[1]-l0[1])/(l1[0]-l0[0]);
  // Ação Beta: resistência testada três vezes e plano de operação (valores de exemplo)
  const B={res:50,sup:44,testes:[49.8,50.1,49.9],ent:50.5,stop:48.8}; B.alvo=B.res+(B.res-B.sup); B.rr=(B.alvo-B.ent)/(B.ent-B.stop);
  return {c,hi,lo,hiUp:up(hi),loUp:up(lo),slope,l0,l1,B,
    pct:{a:(20-10)/10*100,b:(30-20)/20*100}};
})();
const _te_fmtP=a=>a.map(x=>'dia '+x[0]+': '+_te_n(x[1])+' €').join('; ');
// ---- Indicadores (cálculos puros, usados só para gerar os números dos exemplos)
const _te_emaS=(a,n)=>{ const k=2/(n+1); const out=a.map(()=>null); let e=a.slice(0,n).reduce((s,x)=>s+x,0)/n; out[n-1]=e; for(let i=n;i<a.length;i++){ e=a[i]*k+e*(1-k); out[i]=e; } return out; };
const _te_rsiSerie=(a,n)=>{ const out=a.map(()=>null); let g=0,l=0; for(let i=1;i<=n;i++){ const d=a[i]-a[i-1]; if(d>0) g+=d; else l-=d; } g/=n; l/=n; const f=(g,l)=>l===0?100:100-100/(1+g/l); out[n]=f(g,l);
  for(let i=n+1;i<a.length;i++){ const d=a[i]-a[i-1]; g=(g*(n-1)+(d>0?d:0))/n; l=(l*(n-1)+(d<0?-d:0))/n; out[i]=f(g,l); } return out; };

// ---- Volume e padrões: volume médio de 20 dias e dia de rompimento (milhares de ações, valores de exemplo)
const _te_VP=(()=>{
  const v=[96,104,88,110,95,102,99,91,108,97,105,93,100,98,107,94,101,96,103,99], media=v.reduce((s,x)=>s+x,0)/v.length, rompe=240;
  const db={min1:18.0,min2:18.2,neck:22.0,ent:22.2}; db.altura=db.neck-db.min1; db.alvo=db.neck+db.altura; db.stopLargo=17.8; db.stopApertado=21.4;
  db.rrLargo=(db.alvo-db.ent)/(db.ent-db.stopLargo); db.rrApertado=(db.alvo-db.ent)/(db.ent-db.stopApertado);
  const hs={esq:30,cab:34,dir:31,neck:27}; hs.alvo=hs.neck-(hs.cab-hs.neck);
  return {v,media,rompe,razao:rompe/media,db,hs,q:{med:100,rompe:250}};
})();

// ---- Médias móveis e RSI
const _te_MR=(()=>{
  const c=[20,21,19,22,23,24,23,25,26,24,27,28]; const sma=_te_sma(c,5), ema=_te_emaS(c,5);
  const rsiC=[100,101,102,101,103,104,103,105,106,105,107,108,107,109,110];
  let g=0,l=0,ng=0,nl=0; for(let i=1;i<rsiC.length;i++){ const d=rsiC[i]-rsiC[i-1]; if(d>0){g+=d;ng++;} else {l-=d;nl++;} }
  const ag=g/14, al=l/14, rs=ag/al, rsi=100-100/(1+rs);
  // subida contínua: 0,5% por dia com um recuo de 0,5% de cinco em cinco dias
  const up=[100]; for(let i=1;i<60;i++) up.push(up[i-1]*(i%5===0?0.995:1.005));
  const rsiUp=_te_rsiSerie(up,14), dias70=rsiUp.filter(x=>x!==null&&x>70).length, validos=rsiUp.filter(x=>x!==null).length;
  const whip={n:6,perda:1}; whip.total=(Math.pow(1-whip.perda/100,whip.n)-1)*100;
  return {c,sma,ema,rsiC,g,l,ng,nl,ag,al,rs,rsi,rsiUp,dias70,validos,whip,q:{ag:1.2,al:0.4}};
})();

// ---- MACD e Bollinger: série de exemplo de 70 fechos e uma simulação agregada sem padrões (50 séries aleatórias de 1000 dias)
const _te_MB=(()=>{
  const c=[]; for(let i=0;i<70;i++) c.push(+(50+0.12*i+3.2*Math.sin(i/5)+0.8*Math.sin(i*1.7)).toFixed(2));
  const e12=_te_ema(c,12), e26=_te_ema(c,26), macd=e12.map((x,i)=>x-e26[i]), sig=_te_ema(macd,9), hist=macd.map((x,i)=>x-sig[i]);
  const cruz=[]; for(let i=27;i<c.length;i++){ if(hist[i-1]<=0&&hist[i]>0) cruz.push({d:i+1,t:'alta'}); if(hist[i-1]>=0&&hist[i]<0) cruz.push({d:i+1,t:'baixa'}); }
  const bb=end=>{ const w=c.slice(end-19,end+1), m=w.reduce((s,x)=>s+x,0)/20, sd=_te_std(w), up=m+2*sd, lo=m-2*sd; return {m,sd,up,lo,pb:(c[end]-lo)/(up-lo),bw:(up-lo)/m*100}; };
  const b1=bb(c.length-1), b0=bb(c.length-21);
  const pool={nM:0,posM:0,nB:0,posB:0};
  for(let s=1;s<=50;s++){ const w=_te_walk(1000+s,1000,1,100), E12=_te_ema(w,12), E26=_te_ema(w,26), M=E12.map((x,i)=>x-E26[i]), S=_te_ema(M,9);
    for(let i=40;i<w.length-10;i++){
      if(M[i-1]<=S[i-1]&&M[i]>S[i]){ pool.nM++; if(w[i+10]>w[i]) pool.posM++; }
      const win=w.slice(i-19,i+1), m=win.reduce((a,b)=>a+b,0)/20, sd=_te_std(win), pw=w.slice(i-20,i), pm=pw.reduce((a,b)=>a+b,0)/20, psd=_te_std(pw);
      if(w[i]<m-2*sd&&w[i-1]>=pm-2*psd){ pool.nB++; if(w[i+10]>w[i]) pool.posB++; } } }
  return {c,macd,sig,hist,cruz,b1,b0,pool,q:{m:30,sd:1.5}};
})();

// ---- Gestão de risco numa operação
const _te_GR=(()=>{
  const cap=20000, rp=1, risco=cap*rp/100, ent=25, stop=23, rAcao=ent-stop, qt=Math.floor(risco/rAcao), pos=qt*ent;
  const gap={abre:21.5}; gap.perda=(ent-gap.abre)*qt; gap.vezes=gap.perda/risco;
  const alvo=31, rr=(alvo-ent)/rAcao;
  const atr=1.2, stopAtr=ent-2*atr, qtAtr=Math.floor(risco/(2*atr));
  const be=rr0=>1/(1+rr0)*100, esp=(p,r)=>p*r-(1-p);
  const seq={a:(Math.pow(1-0.01,10)-1)*100,b:(Math.pow(1-0.10,10)-1)*100};
  return {cap,rp,risco,ent,stop,rAcao,qt,pos,posPct:pos/cap*100,gap,alvo,rr,atr,stopAtr,qtAtr,costs:10,custoPct:10/risco*100,be,esp,seq,
    q:{cap:15000,rp:1,ent:40,stop:37}};
})();

// ---- Limites: o acaso também desenha tendências e estratégias vencedoras
const _te_LM=(()=>{
  const r=_te_rng(99); let tot=0; const N=10000; for(let s=0;s<N;s++){ let run=1,best=1,prev=r()<.5; for(let i=1;i<20;i++){ const x=r()<.5; run=x===prev?run+1:1; best=Math.max(best,run); prev=x; } tot+=best; }
  const rr=_te_rng(2024), rets=[]; for(let i=0;i<250;i++) rets.push(_te_norm(rr)*0.01);
  const rs=_te_rng(77), all=[]; for(let k=0;k<100;k++){ let t=0; for(let i=0;i<250;i++) t+=(rs()<.5?1:-1)*rets[i]; all.push(t*100); }
  return {run:tot/N,best:Math.max(...all),media:all.reduce((a,b)=>a+b,0)/all.length,q:{a:4,b:20}};
})();

LRN.push(
{ id:'velas', topic:'tecnica', o:1, title:'Velas e gráficos', mins:8,
  lead:`Uma vela japonesa resume tudo o que o preço fez num período: onde abriu, onde fechou, e até onde foi em cima e em baixo. É a letra com que se escrevem quase todos os gráficos de bolsa, e convém aprender a lê-la antes de lhe pedir mais do que ela dá.`,
  blocks:[
    {t:'h',id:'h1',x:'Um dia de mercado, como um jogo de futebol'},
    {t:'p',id:'p0',x:`Pensa num jogo de futebol. O resultado final é o que consta na tabela, mas quem viu o jogo sabe que houve alturas em que uma equipa vencia por dois golos e acabou a perder, ou que o empate só chegou ao fim de um jogo de nervos. Um preço de fecho é o resultado final; o que aconteceu durante o dia está nos máximos e nos mínimos. A vela é a forma de ver as duas coisas ao mesmo tempo.`},

    {t:'h',id:'h2',x:'Como se lê uma vela'},
    {t:'p',id:'p1',x:`Cada vela mostra quatro preços de um período (um dia, uma hora): <b>abertura</b>, <b>fecho</b>, <b>máximo</b> e <b>mínimo</b>. O <b>corpo</b> vai da abertura ao fecho; as <b>sombras</b> (os fios) mostram os extremos. Por convenção, uma vela de subida fecha acima da abertura e uma de descida fecha abaixo, com cores diferentes conforme a plataforma (nem sempre verde para subida e vermelho para descida: em alguns países é ao contrário).`},
    {t:'cmp',id:'c1',head:['Parte da vela','O que mostra'],rows:[['Corpo','Distância entre abertura e fecho'],['Sombra superior','Até onde o preço subiu'],['Sombra inferior','Até onde o preço desceu'],['Corpo grande','Movimento forte e decidido'],['Corpo pequeno com sombras longas','Indecisão: o preço foi longe mas voltou']]},
    {t:'p',id:'p2',x:`As velas dão mais informação do que uma simples linha de fechos, e são o formato normal dos gráficos de preços. Nas vistas <b>Gráficos</b> deste site podes ver velas de vários ativos. Existem três formatos comuns de gráfico, e as velas são só um deles:`},
    {t:'cmp',id:'c2',head:['Formato','O que mostra','Vantagem','Limite'],rows:[
      ['Linha','Só o preço de fecho de cada período','Limpo; fácil de ver a direção','Esconde o que se passou dentro do período'],
      ['Barras (OHLC)','Abertura, máximo, mínimo e fecho, em traços','Mostra os quatro preços','Menos intuitivo à primeira vista'],
      ['Velas','Os mesmos quatro preços, com corpo colorido','Lê-se depressa a direção e a indecisão','Dá a falsa sensação de que cada forma «significa» algo']]},

    {t:'h',id:'h3',x:'Cinco dias de uma ação, vela a vela'},
    {t:'p',id:'p3',x:`Veja-se uma ação inventada, a <b>Ação Alfa</b>, ao longo de cinco dias. Para cada dia, o <b>corpo</b> é o fecho menos a abertura e a <b>amplitude</b> é o máximo menos o mínimo. A percentagem do corpo sobre a amplitude diz se o dia foi decidido (corpo grande) ou hesitante (corpo pequeno).`},
    {t:'cmp',id:'c3',head:['Dia','Abertura','Máximo','Mínimo','Fecho','Corpo ÷ amplitude','Leitura'],rows:_te_V.rows.map(r=>[String(r.d),_te_n(r.o),_te_n(r.h),_te_n(r.l),_te_n(r.c),_te_p(r.pc,0),r.txt]),cap:'Valores de exemplo, em euros. A «leitura» usa regras simples: corpo menor que 20% da amplitude conta como pequeno.'},
    {t:'p',id:'p4',x:`No dia 1 e no dia 2 houve subidas claras, com o fecho perto do máximo. No dia 3 o preço subiu até ${_te_n(_te_V.rows[2].h)} € e chegou a descer a ${_te_n(_te_V.rows[2].l)} €, para fechar quase onde abriu: ninguém ganhou a luta. No dia 4 houve uma queda forte com fecho perto do mínimo. No dia 5 o preço desceu até ${_te_n(_te_V.rows[4].l)} € mas foi comprado de volta para fechar perto do máximo: a sombra inferior longa mostra que os vendedores não conseguiram manter o preço em baixo.`},

    {t:'fazve',id:'q1',ensina:['p1','c1'],q:`Uma vela abriu a ${_te_V.q.o} €, chegou a ${_te_V.q.h} €, desceu a ${_te_V.q.l} € e fechou a ${_te_V.q.c} €. Qual é a amplitude da vela (máximo menos mínimo), em €?`,unit:'€',answer:_te_V.q.h-_te_V.q.l,tol:.02,why:`${_te_V.q.h} − ${_te_V.q.l} = ${_te_V.q.h-_te_V.q.l} €. O corpo é a diferença entre fecho e abertura (${_te_V.q.c} − ${_te_V.q.o} = ${_te_V.q.c-_te_V.q.o} €); a amplitude conta tudo, sombras incluídas.`},

    {t:'h',id:'h4',x:'Os padrões de velas mais falados'},
    {t:'p',id:'p5',x:`Há quem dê nomes a combinações de velas e diga o que «costumam» anunciar. Os mais conhecidos:`},
    {t:'cmp',id:'c4',head:['Padrão','Como se desenha','O que se diz que sugere'],rows:[
      ['Doji','Abertura e fecho quase iguais, sombras longas','Indecisão; possível pausa na tendência'],
      ['Martelo','Corpo pequeno no topo e sombra inferior longa, depois de uma queda','Os vendedores perderam força: possível viragem para cima'],
      ['Estrela cadente','Corpo pequeno em baixo e sombra superior longa, depois de uma subida','Os compradores perderam força: possível viragem para baixo'],
      ['Engolfante','Uma vela cujo corpo cobre por completo o da vela anterior, de sentido contrário','Mudança de força entre compradores e vendedores']],cap:'Estas leituras são convenções populares. Nenhuma tem garantia.'},
    {t:'note',id:'n1',x:'Os estudos disponíveis sobre padrões de velas, quando existem, encontram resultados fracos ou inconsistentes depois de contar os custos de negociar. Servem para descrever o que aconteceu, não para garantir o que vem a seguir.'},

    {t:'h',id:'h5',x:'Período, escala e lacunas'},
    {t:'p',id:'p6',x:`<b>O período importa.</b> Uma vela diária resume um dia; uma vela de 5 minutos resume 5 minutos. Em períodos curtos há muito mais «ruído» (movimentos sem significado) e os mesmos padrões aparecem e desaparecem por acaso. Para quem investe a longo prazo, o gráfico semanal ou mensal é mais útil.`},
    {t:'p',id:'p7',x:`<b>A escala importa.</b> Numa escala normal (linear), uma subida de 10 € para 20 € e outra de 20 € para 30 € parecem do mesmo tamanho, 10 € cada. Mas a primeira é de ${_te_p(_te_T.pct.a,0)} e a segunda de ${_te_p(_te_T.pct.b,0)}. Na <b>escala logarítmica</b>, os mesmos intervalos percentuais ocupam a mesma altura, e é a escala preferida para períodos longos.`},
    {t:'p',id:'p8',x:`<b>As lacunas (gaps).</b> Quando o mercado fecha, o preço pode abrir no dia seguinte bem longe do fecho anterior, por exemplo depois de resultados ou de uma notícia. Nesse caso há um «buraco» no gráfico, onde ninguém negociou. É por isso que uma ordem para vender a um preço fixo pode ser executada pior, como vês em «Gestão de risco numa operação: stop-loss e tamanho da posição».`},

    {t:'h',id:'h6',x:'Um pouco de história'},
    {t:'p',id:'p9',x:`As velas vêm do Japão. Segundo a tradição, foram usadas por comerciantes de arroz no século XVIII, na cidade de Osaka, para acompanhar o preço do arroz, e só chegaram ao Ocidente no fim do século XX. A forma é intuitiva, o que explica a popularidade, mas ser intuitiva não prova que prevê o futuro. Muito do que se diz sobre «o que cada vela quer dizer» vem de tradição e de livros, não de experiências que se possam repetir.`},

    {t:'h',id:'h7',x:'Os erros que mais custam'},
    {t:'ul',id:'u1',x:[
      '<b>Ler uma vela isolada.</b> Um martelo ou um doji sem contexto (que tendência havia, que volume) quase nada diz.',
      '<b>Trocar de período até aparecer o que queres ver.</b> Em algum período há sempre um padrão que confirma a tua ideia.',
      '<b>Ignorar a escala.</b> Comparar gráficos de ativos diferentes com escalas diferentes engana.',
      '<b>Achar que a cor da vela explica o porquê.</b> A vela mostra o que o preço fez, não porquê.',
      '<b>Negociar a cada vela.</b> Cada operação tem custos e impostos, e muitos «sinais» são ruído.']},

    {t:'h',id:'h8',x:'Em Portugal'},
    {t:'p',id:'p10',x:`As ações cotadas na Euronext Lisboa têm preços em euros e horário próprio (ver «Horários da Euronext Lisboa»); as velas diárias refletem essas sessões. Na vista <b>Gráficos</b> deste site e na plataforma da tua corretora podes mudar entre linha, barras e velas e entre escala linear e logarítmica. Cada operação que fizeres com base no que vês tem comissões e imposto do selo (ver «Comissões e imposto do selo»).`},

    {t:'h',id:'h9',x:'Em poucas palavras'},
    {t:'ul',id:'u2',x:[
      'Uma vela resume abertura, fecho, máximo e mínimo de um período.',
      'Corpo grande: movimento decidido; corpo pequeno com sombras longas: indecisão.',
      'Linha, barras e velas mostram níveis diferentes de detalhe sobre o mesmo preço.',
      'Os padrões de velas são convenções populares, sem garantia de que prevejam o futuro.',
      'Período e escala mudam a leitura: percebe-os antes de tirar conclusões.']},
    {t:'decide',id:'q2',ensina:['p1','c1','p4'],label:'Decide',q:'Uma vela tem um corpo pequeno e sombras muito longas para cima e para baixo. O que sugere?',o:['Uma subida muito forte','Indecisão: o preço foi longe nos dois sentidos mas acabou perto de onde abriu','Uma queda muito forte'],c:1,why:'Corpo pequeno com sombras longas indica que os compradores e vendedores empurraram o preço em direções opostas e ninguém ganhou.'},
    {t:'decide',id:'q3',ensina:['p1'],label:'Decide',q:'Quantos preços resume uma vela?',o:['Dois: abertura e fecho','Só o preço de fecho','Quatro: abertura, fecho, máximo e mínimo'],c:2,why:'Uma vela resume abertura, fecho, máximo e mínimo do período.'},
    {t:'decide',id:'q4',ensina:['p7'],label:'Decide',q:'Uma ação sobe de 10 € para 20 € e outra de 20 € para 30 €. Qual das subidas foi maior em percentagem?',o:['A segunda, porque chegou a um valor mais alto','A primeira (100%, contra 50%)','Foram iguais, porque ambas subiram 10 €'],c:1,why:'O que conta é a variação em relação ao ponto de partida: 10 → 20 é +100%, 20 → 30 é +50%. A escala logarítmica mostra isto bem.'},
    {t:'erro',id:'q5',ensina:['p6','p9','n1'],label:'Encontra o erro',q:'Uma destas frases sobre as velas está errada. Qual?',o:['Períodos curtos têm mais ruído do que períodos longos','Um martelo garante que o preço vai subir','A mesma ação pode parecer diferente consoante a escala usada','As velas vêm do Japão, segundo a tradição'],c:1,why:'Nenhum padrão de velas garante o que vem a seguir. Descrevem o que o preço fez, não o que vai fazer.'}
  ], src:[] },

{ id:'tendencias', topic:'tecnica', o:2, title:'Tendências, suportes e resistências', mins:7,
  lead:`A análise técnica procura padrões nos preços passados. Duas ideias são centrais: a tendência e os níveis onde o preço costuma travar. São simples de desenhar, e por isso mesmo é fácil ver mais do que lá está.`,
  blocks:[
    {t:'h',id:'h1',x:'Uma imagem para perceber'},
    {t:'p',id:'p0',x:`Imagina uma bola a subir uma escadaria. Em cada degrau pode parar um momento (o preço recua), mas enquanto o degrau seguinte for mais alto do que o anterior, a bola está a subir. Uma tendência de alta é isso: máximos e mínimos cada vez mais altos, com recuos pelo caminho. Os degraus são as zonas de suporte e resistência.`},

    {t:'h',id:'h2',x:'Tendências: alta, baixa e lateral'},
    {t:'p',id:'p1',x:`Uma <b>tendência de alta</b> forma máximos e mínimos cada vez mais altos. Uma <b>tendência de baixa</b> forma máximos e mínimos cada vez mais baixos. Quando o preço anda de lado, dentro de uma faixa, diz-se que está em <b>consolidação</b> ou numa tendência lateral. A ideia clássica é «a tendência é tua amiga»: tende a durar até haver sinais de mudança.`},
    {t:'p',id:'p2',x:`Para ver isto com números, olha para os 24 fechos de uma ação inventada, a <b>Ação Gama</b>. Um <b>pivô</b> é um máximo ou mínimo local: um dia em que o fecho é maior (ou menor) do que o do dia anterior e o do seguinte. Os máximos pivô desta série são: ${_te_fmtP(_te_T.hi)}. Os mínimos pivô são: ${_te_fmtP(_te_T.lo)}.`},
    {t:'p',id:'p3',x:`${_te_T.hiUp&&_te_T.loUp?'Os dois conjuntos sobem de forma consistente: cada máximo e cada mínimo é mais alto do que o anterior. É a definição de tendência de alta.':'Os pivôs não sobem todos.'} A <b>linha de tendência</b> liga os mínimos: de ${_te_n(_te_T.l0[1])} € (dia ${_te_T.l0[0]}) a ${_te_n(_te_T.l1[1])} € (dia ${_te_T.l1[0]}), a linha sobe cerca de ${_te_n(_te_T.slope,2)} € por dia. Enquanto o preço se mantiver acima da linha, a tendência mantém-se; se fechar claramente abaixo, é um aviso.`},
    {t:'cmp',id:'c1',head:['Tendência','Máximos','Mínimos','O que fazem os que seguem a tendência'],rows:[
      ['Alta','Cada vez mais altos','Cada vez mais altos','Procuram comprar nos recuos'],
      ['Baixa','Cada vez mais baixos','Cada vez mais baixos','Evitam comprar, ou vendem nas subidas'],
      ['Lateral','Parecidos entre si','Parecidos entre si','Esperam um rompimento da faixa']]},
    {t:'p',id:'p3b',x:`As duas linhas paralelas que contêm o preço, uma a ligar os mínimos e outra os máximos, formam um <b>canal</b>. Dentro de um canal de alta, quem segue a tendência vê os recuos até à linha de baixo como oportunidades, e o toque na linha de cima como zona onde o preço pode travar. Um canal é só uma forma de organizar o que se vê: o preço pode sair dele a qualquer momento, e muitas vezes sai sem aviso.`},
    {t:'p',id:'p4',x:`Há tendências de vários prazos ao mesmo tempo: uma ação pode estar em tendência de alta há anos, de baixa há três semanas, e lateral esta manhã. Por isso, antes de falar em «tendência», convém dizer <b>qual horizonte</b> estás a ver.`},

    {t:'h',id:'h3',x:'Suportes e resistências'},
    {t:'p',id:'p5',x:`O <b>suporte</b> é um nível onde as quedas costumam parar (os compradores aparecem). A <b>resistência</b> é um nível onde as subidas costumam parar (aparecem os vendedores). Quando um suporte é rompido para baixo, tende a transformar-se em resistência, e vice-versa. A explicação habitual é psicológica: quem comprou perto do nível e ficou em prejuízo quer sair «ao preço que pagou», e isso cria vendas nesse nível.`},
    {t:'note',id:'n1',x:'Estes níveis são zonas aproximadas, não linhas exatas. E o facto de um nível ter funcionado no passado não garante que funcione de novo.'},
    {t:'p',id:'p6',x:`Um exemplo: a <b>Ação Beta</b> chegou três vezes a perto de ${_te_T.B.res} € e recuou de cada vez (${_te_T.B.testes.map(x=>_te_n(x)+' €').join(', ')}); em baixo, costuma parar perto de ${_te_T.B.sup} €. Há uma resistência em ${_te_T.B.res} € e um suporte em ${_te_T.B.sup} €. Se o preço rompe ${_te_T.B.res} € e fecha acima, quem segue o método diz que a resistência virou suporte. Uma regra prática estima o alvo somando a altura da faixa: ${_te_T.B.res} + (${_te_T.B.res} − ${_te_T.B.sup}) = <b>${_te_n(_te_T.B.alvo,0)} €</b>.`},
    {t:'p',id:'p7',x:`Imagina que compras a ${_te_n(_te_T.B.ent)} € depois do rompimento e decides sair se o preço voltar abaixo de ${_te_n(_te_T.B.stop)} € (a resistência que virou suporte falhou). Arriscas ${_te_n(_te_T.B.ent-_te_T.B.stop)} € por ação para tentar ganhar ${_te_n(_te_T.B.alvo-_te_T.B.ent)} €, uma relação de <b>${_te_n(_te_T.B.rr)} para 1</b>. Estas contas, de risco e retorno, são o tema de «Gestão de risco numa operação: stop-loss e tamanho da posição».`},
    {t:'stat',id:'s1',v:Math.round(_te_T.B.alvo),label:'preço-alvo da Ação Beta pelo método da altura da faixa, só como exemplo de cálculo'},

    {t:'fazve',id:'q1',ensina:['p6','p7'],q:`Uma ação tem um suporte em ${_te_T.B.sup} € e uma resistência em ${_te_T.B.res} €. Comprando a ${_te_n(_te_T.B.ent)} € depois de romper a resistência, qual é o alvo (resistência + altura da faixa), em €?`,unit:'€',answer:_te_T.B.alvo,tol:.02,why:`A altura da faixa é ${_te_T.B.res} − ${_te_T.B.sup} = ${_te_T.B.res-_te_T.B.sup} €. Somada à resistência dá ${_te_T.B.res} + ${_te_T.B.res-_te_T.B.sup} = ${_te_T.B.alvo} €. É uma regra de bolso, não uma previsão.`},

    {t:'h',id:'h4',x:'Rompimentos verdadeiros e falsos'},
    {t:'p',id:'p8',x:`Um <b>rompimento</b> acontece quando o preço sai da faixa onde andava. O problema é que muitos rompimentos são falsos: o preço passa o nível por um dia ou dois e volta para dentro. Os praticantes tentam filtrar usando um fecho acima do nível (e não só o máximo do dia), esperando um ou dois dias, ou olhando para o volume (ver «Volume e padrões gráficos»). Nenhum filtro elimina os falsos rompimentos: só os reduz, ao preço de entrar mais tarde.`},

    {t:'h',id:'h5',x:'Um caso real: a queda de 2007 a 2009'},
    {t:'p',id:'p11',x:`Entre 2007 e março de 2009, muitos índices de ações caíram em tendência de baixa durante mais de um ano, com máximos e mínimos cada vez mais baixos, e suportes rompidos um a um. Para quem seguia a tendência, os sinais de saída apareceram bem antes do fundo. Mas esses mesmos métodos também geraram muitos sinais falsos nas pausas pelo caminho (rebotes de poucas semanas que depois falharam), e quem quis entrar na recuperação em 2009 teve de o fazer sem que a tendência tivesse virado, porque as viragens só se confirmam depois de acontecerem. É a natureza do método: reage, não antecipa.`},

    {t:'h',id:'h6',x:'Os limites do método'},
    {t:'ul',id:'u1',x:[
      '<b>Subjetividade.</b> Duas pessoas desenham linhas de tendência diferentes sobre o mesmo gráfico, e ambas «têm razão».',
      '<b>Olhar para trás é fácil.</b> Depois de um movimento, o nível parece óbvio; antes dele, havia dezenas de níveis possíveis.',
      '<b>Profecias que se cumprem, por vezes.</b> Se muita gente olha para o mesmo nível, ele funciona porque todos agem nele, mas isso muda com o tempo.',
      '<b>Atraso.</b> Tendência confirma-se depois de já ter começado; entra-se sempre tarde e sai-se sempre tarde.',
      '<b>Evidência.</b> Há alguma evidência académica de que a tendência (o «momentum») persiste em certos mercados e períodos, mas não é estável, e os custos de negociar reduzem muito o que sobra.']},

    {t:'h',id:'h7',x:'Em Portugal'},
    {t:'p',id:'p9',x:`Estes níveis aplicam-se a qualquer preço que apareça num gráfico, incluindo os índices e as ações da Euronext Lisboa. Nas ações com pouca negociação, os níveis são menos fiáveis, porque poucos negócios movem o preço. Se agires com base num nível, as ordens têm tipos próprios (ver «Tipos de ordem») e os ganhos pagam imposto (ver «Mais-valias: quanto imposto pagas ao vender»).`},

    {t:'h',id:'h8',x:'Em poucas palavras'},
    {t:'ul',id:'u2',x:[
      'Tendência de alta: máximos e mínimos mais altos; de baixa: o contrário; lateral: uma faixa.',
      'Suporte e resistência são zonas onde o preço costuma travar, e um nível rompido tende a trocar de papel.',
      'Os rompimentos falham muitas vezes: filtra-os, sabendo que nenhum filtro é perfeito.',
      'O método reage ao que já aconteceu: não antecipa viragens.',
      'Os níveis são zonas aproximadas, desenhadas com alguma subjetividade.']},
    {t:'decide',id:'q2',ensina:['p1','p2','p3'],label:'Decide',q:'O preço forma máximos mais altos e mínimos mais altos, sucessivamente. Que tendência é esta?',o:['Baixa','Lateral','Alta'],c:2,why:'Máximos e mínimos cada vez mais altos definem uma tendência de alta.'},
    {t:'decide',id:'q3',ensina:['p5'],label:'Decide',q:'O preço sobe até um nível onde já travou várias vezes antes. Como se chama esse nível?',o:['Suporte','Resistência','Consolidação'],c:1,why:'Resistência é onde as subidas costumam parar.'},
    {t:'decide',id:'q4',ensina:['p5','p8'],label:'Decide',q:'O preço rompe uma resistência e fecha acima dela durante dois dias. O que dizem os praticantes que provavelmente passa a acontecer a esse nível?',o:['Passa a ser um suporte potencial','Desaparece completamente','Transforma-se em consolidação'],c:0,why:'Uma resistência rompida tende a transformar-se em suporte (e um suporte rompido em resistência). É uma regra de bolso, sem garantia.'},
    {t:'erro',id:'q5',ensina:['p8','u1','n1'],label:'Encontra o erro',q:'Uma destas frases está errada. Qual?',o:['Os níveis de suporte e resistência são zonas aproximadas','Um rompimento confirma sempre que o preço vai continuar na mesma direção','Duas pessoas podem desenhar linhas de tendência diferentes no mesmo gráfico','A tendência só se confirma depois de já ter começado'],c:1,why:'Muitos rompimentos são falsos: o preço volta para dentro da faixa. Os filtros reduzem esse risco mas não o eliminam.'}
  ], src:[] },

{ id:'volume-padroes', topic:'tecnica', o:3, title:'Volume e padrões gráficos', mins:9,
  lead:`O preço diz onde o mercado foi; o volume diz com quanta convicção. Os padrões gráficos (topos duplos, triângulos, ombro-cabeça-ombro) juntam as duas coisas para tentar prever o próximo passo, com um historial de resultados bem mais modesto do que as imagens sugerem.`,
  blocks:[
    {t:'h',id:'h1',x:'Uma imagem para perceber'},
    {t:'p',id:'p0',x:`Imagina uma multidão a sair de um estádio. Se saem duas pessoas por uma porta, não se percebe nada; se sai metade do público, algo se passou. O <b>volume</b> é o número de ações (ou unidades) negociadas num período. Um movimento de preço com muito volume foi feito por muita gente; o mesmo movimento com pouco volume pode ter sido feito por meia dúzia de ordens.`},

    {t:'h',id:'h2',x:'O que o volume acrescenta ao preço'},
    {t:'p',id:'p1',x:`A ideia clássica é que o <b>volume confirma</b> o preço. Uma subida com volume a crescer sugere que mais compradores entram; uma subida com volume a descer sugere que o movimento está a perder energia. O mesmo se aplica às descidas.`},
    {t:'cmp',id:'c1',head:['Preço','Volume','Leitura habitual','Dúvida'],rows:[
      ['Sobe','Sobe','Convicção compradora','Pode ser o fim de um movimento (muita gente entra no fim)'],
      ['Sobe','Desce','Subida sem convicção','Pode ser apenas um dia calmo, por exemplo antes de feriados'],
      ['Desce','Sobe','Pressão vendedora','Pode ser pânico no fundo'],
      ['Desce','Desce','Queda sem convicção','Pode ser só falta de compradores']],cap:'As leituras são convenções. O mesmo par preço-volume pode ter explicações contrárias.'},
    {t:'p',id:'p2',x:`Para saber se um volume é «alto», compara-o com o volume médio. Numa ação inventada, os últimos 20 dias tiveram um volume médio de <b>${_te_n(_te_VP.media,0)} mil ações</b> por dia, com variações pequenas, entre ${Math.min(..._te_VP.v)} e ${Math.max(..._te_VP.v)} mil. No dia em que o preço rompeu uma resistência, o volume foi de ${_te_VP.rompe} mil: <b>${_te_n(_te_VP.razao,1)} vezes</b> a média. Um rompimento com este volume tem mais credibilidade do que um com 105 mil ações. Algumas pessoas usam uma regra de bolso, de que o volume deve ser pelo menos 1,5 vezes a média, mas é um valor de exemplo, não uma lei.`},
    {t:'fazve',id:'q1',ensina:['p1','p2'],q:`O volume médio de uma ação é ${_te_VP.q.med} mil ações por dia. No dia do rompimento negociaram-se ${_te_VP.q.rompe} mil. Quantas vezes a média?`,unit:'x',answer:_te_VP.q.rompe/_te_VP.q.med,tol:.02,why:`${_te_VP.q.rompe} ÷ ${_te_VP.q.med} = ${_te_n(_te_VP.q.rompe/_te_VP.q.med,1)} vezes. Um volume bem acima da média torna o rompimento mais credível, mas não o garante.`},

    {t:'h',id:'h3',x:'Os padrões gráficos'},
    {t:'p',id:'p3',x:`Um <b>padrão gráfico</b> é uma forma que o preço desenha ao longo de várias semanas ou meses e que, segundo os seus defensores, anuncia o que vem a seguir. Os mais conhecidos dividem-se em dois grupos: de <b>inversão</b> (a tendência vai mudar) e de <b>continuação</b> (a tendência retoma depois de uma pausa).`},
    {t:'cmp',id:'c2',head:['Padrão','Tipo','Como se vê','O que sugere'],rows:[
      ['Duplo fundo','Inversão','Dois mínimos ao mesmo nível, com um máximo no meio (a «linha do pescoço»)','Fim de uma queda se o preço romper a linha do pescoço'],
      ['Duplo topo','Inversão','Dois máximos ao mesmo nível, com um mínimo no meio','Fim de uma subida se o preço romper o mínimo do meio'],
      ['Ombro-cabeça-ombro','Inversão','Três máximos: o do meio (a cabeça) é mais alto do que os dois dos lados (os ombros)','Fim de uma subida se romper a linha que une os mínimos'],
      ['Triângulo','Continuação (ou inversão)','O preço oscila numa faixa cada vez mais estreita','Rompimento numa direção; que direção é incerta'],
      ['Bandeira','Continuação','Uma subida muito rápida, uma pequena pausa inclinada, e retoma','Mais um impulso na mesma direção']],cap:'Todos os padrões são interpretados a posteriori, por isso existem muitos casos «parecidos» que não resultam.'},

    {t:'h',id:'h4',x:'Um duplo fundo, com contas'},
    {t:'p',id:'p4',x:`Uma ação inventada cai até ${_te_n(_te_VP.db.min1)} €, recupera até ${_te_n(_te_VP.db.neck)} €, cai de novo até ${_te_n(_te_VP.db.min2)} € e volta a subir. Os dois fundos estão quase à mesma altura (${_te_n(_te_VP.db.min1)} e ${_te_n(_te_VP.db.min2)} €), e o máximo do meio, ${_te_n(_te_VP.db.neck)} €, é a linha do pescoço. Quando o preço fecha acima dela, diz-se que o padrão está confirmado.`},
    {t:'p',id:'p5',x:`A regra de bolso para o alvo é a <b>altura do padrão</b> somada ao ponto de rompimento: ${_te_n(_te_VP.db.neck)} − ${_te_n(_te_VP.db.min1)} = ${_te_n(_te_VP.db.altura)} €, e o alvo é ${_te_n(_te_VP.db.neck)} + ${_te_n(_te_VP.db.altura)} = <b>${_te_n(_te_VP.db.alvo)} €</b>. Se entrares a ${_te_n(_te_VP.db.ent)} € logo a seguir ao rompimento, tens duas escolhas para a saída em caso de erro:`},
    {t:'cmp',id:'c3',head:['Onde pões a saída','Preço','Risco por ação','Ganho possível até ao alvo','Relação ganho/risco'],rows:[
      ['Abaixo do fundo','17,8 €',_te_n(_te_VP.db.ent-_te_VP.db.stopLargo)+' €',_te_n(_te_VP.db.alvo-_te_VP.db.ent)+' €',_te_n(_te_VP.db.rrLargo,2)+' para 1'],
      ['Logo abaixo da linha do pescoço','21,4 €',_te_n(_te_VP.db.ent-_te_VP.db.stopApertado)+' €',_te_n(_te_VP.db.alvo-_te_VP.db.ent)+' €',_te_n(_te_VP.db.rrApertado,2)+' para 1']],cap:'Valores de exemplo, antes de comissões.'},
    {t:'p',id:'p6',x:`Repara no dilema. Com a saída abaixo do fundo, aguentas um recuo, mas arriscas mais do que podes ganhar (relação inferior a 1). Com a saída apertada, a relação parece ótima, mas basta o preço voltar a testar a linha do pescoço, o que é normal depois de um rompimento, para seres tirado do negócio. A beleza do padrão no gráfico esconde que a gestão do risco é que decide se compensa (ver «Gestão de risco numa operação: stop-loss e tamanho da posição»).`},

    {t:'p',id:'p7',x:`Um ombro-cabeça-ombro funciona ao contrário. Uma ação sobe até ${_te_VP.hs.esq} € (ombro esquerdo), até ${_te_VP.hs.cab} € (cabeça) e recua até ${_te_VP.hs.dir} € (ombro direito), com a linha do pescoço em ${_te_VP.hs.neck} €. Se o preço romper essa linha para baixo, a regra de bolso projeta uma queda igual à altura da cabeça: ${_te_VP.hs.cab} − ${_te_VP.hs.neck} = ${_te_VP.hs.cab-_te_VP.hs.neck} €, ou seja, um alvo de ${_te_VP.hs.neck} − ${_te_VP.hs.cab-_te_VP.hs.neck} = <b>${_te_VP.hs.alvo} €</b>.`},
    {t:'fazve',id:'q2',ensina:['p4','p5'],q:`Num duplo fundo, os mínimos estão em ${_te_n(_te_VP.db.min1,0)} € e a linha do pescoço em ${_te_n(_te_VP.db.neck,0)} €. Pela regra da altura, qual é o alvo, em €?`,unit:'€',answer:_te_VP.db.alvo,tol:.02,why:`Altura = ${_te_n(_te_VP.db.neck,0)} − ${_te_n(_te_VP.db.min1,0)} = ${_te_n(_te_VP.db.altura,0)} €. Alvo = ${_te_n(_te_VP.db.neck,0)} + ${_te_n(_te_VP.db.altura,0)} = ${_te_n(_te_VP.db.alvo,0)} €. É uma regra de bolso, não uma previsão.`},

    {t:'h',id:'h5',x:'O que a evidência diz'},
    {t:'p',id:'p8',x:`A pergunta é se estes padrões acrescentam informação útil. A evidência é mista. Um trabalho académico muito citado (de Lo, Mamaysky e Wang, em 2000) usou um método informático para detetar padrões e encontrou que alguns tinham algum conteúdo informativo; outros estudos, em mercados e períodos diferentes, encontraram resultados fracos ou inexistentes, sobretudo depois de contar custos de negociação. Outro problema é que, a olho, é difícil de repetir: duas pessoas veem o mesmo gráfico e uma vê um duplo fundo, a outra um simples recuo. E a análise feita depois do facto (<i>backtesting</i>) tende a «encontrar» padrões que funcionavam no passado e deixam de funcionar quando se aplicam a dados novos.`},
    {t:'note',id:'n1',x:'Tudo o que se vê num gráfico passado parece mais claro do que era na altura. Se queres testar um padrão, escreve a regra antes (quando é que o padrão está confirmado, onde sais) e aplica-a a dados que não usaste para a criar.'},

    {t:'h',id:'h6',x:'Um caso real: Charles Dow'},
    {t:'p',id:'p9',x:`A ideia de olhar para preço e volume vem de Charles Dow, o cofundador do <i>Wall Street Journal</i>, que escreveu sobre o mercado no fim do século XIX e início do século XX. Os seus textos deram origem à chamada «Teoria de Dow», que afirma, entre outras coisas, que as tendências do mercado se confirmam entre si e que o volume deve acompanhar a tendência. É a base de grande parte da análise técnica moderna. Mas o mercado de há mais de cem anos tinha poucos participantes e pouca informação disponível, e hoje milhões de pessoas, e computadores, olham para os mesmos gráficos, o que faz com que seja bem mais difícil tirar vantagem de regras conhecidas.`},

    {t:'h',id:'h7',x:'Os limites e os erros comuns'},
    {t:'ul',id:'u1',x:[
      '<b>Ver padrões onde não existem.</b> O cérebro é muito bom a achar figuras. Em dados aleatórios aparecem «duplos fundos» e «triângulos» sem qualquer significado.',
      '<b>Esperar demasiado pela confirmação.</b> Quando o padrão se confirma, parte do movimento já aconteceu.',
      '<b>Ignorar o risco.</b> Um padrão bonito com uma saída desproporcionada dá mau negócio, como se viu no duplo fundo.',
      '<b>Ler o volume como se fosse sempre igual.</b> O volume de uma ação cotada em várias bolsas está dividido por todas elas, e o de um ETF não mede a liquidez real, só os negócios nessa bolsa.',
      '<b>Esquecer a liquidez.</b> Em ações pouco negociadas, o volume baixo faz com que poucos negócios mexam muito no preço, e os padrões ficam pouco fiáveis.']},

    {t:'h',id:'h8',x:'Em Portugal'},
    {t:'p',id:'p10',x:`Várias ações da Euronext Lisboa têm pouca negociação diária, o que torna o volume irregular e os padrões menos fiáveis do que nas grandes ações internacionais. Ao negociares com base num padrão, convém saber que tipo de ordem usar (ver «Tipos de ordem») e quanto custa entrar e sair (ver «Comissões e imposto do selo»). Se o negócio correr bem, o ganho paga imposto (ver «Mais-valias: quanto imposto pagas ao vender»).`},

    {t:'h',id:'h9',x:'Em poucas palavras'},
    {t:'ul',id:'u2',x:[
      'O volume mede a convicção por trás de um movimento: compara-o sempre com a média recente.',
      'Padrões de inversão e de continuação são formas que o preço desenha e que, em teoria, anunciam o que vem a seguir.',
      'O alvo pela altura do padrão é uma regra de bolso, não uma previsão.',
      'A evidência de que os padrões acrescentam valor é mista e fraca, sobretudo depois de custos.',
      'A relação entre ganho e risco da operação importa mais do que a beleza do padrão.']},
    {t:'decide',id:'q3',ensina:['p1','c1'],label:'Decide',q:'O preço sobe durante vários dias, mas o volume diário vai descendo. Como se costuma ler isto?',o:['Como uma subida sem convicção, que pode estar a perder força','Como uma confirmação forte de que vai subir mais','Como sinal de que o preço vai cair amanhã'],c:0,why:'Pela convenção clássica, o volume deve acompanhar a tendência. Se desce enquanto o preço sobe, o movimento tem menos participação. Mas é um aviso, não uma previsão.'},
    {t:'decide',id:'q4',ensina:['c3','p6'],label:'Decide',q:'Um duplo fundo parece perfeito, mas para te proteger tens de pôr a saída a um preço tão longe que arriscas mais do que podes ganhar até ao alvo. O que concluis?',o:['O padrão só vale a pena se a relação ganho/risco for razoável: aqui, não compensa','Que devias ignorar a saída e esperar','Que o padrão é mais fiável quanto maior for o risco'],c:0,why:'Um bom padrão com mau risco continua a ser mau negócio. É a relação entre o que arriscas e o que podes ganhar que decide.'},
    {t:'erro',id:'q5',ensina:['c2','p8','u1'],label:'Encontra o erro',q:'Uma destas frases está errada. Qual?',o:['Em dados aleatórios também surgem formas que parecem padrões','A evidência de que os padrões gráficos dão sempre lucro é sólida','O volume deve ser comparado com a média recente','O alvo pela altura do padrão é uma regra de bolso'],c:1,why:'A evidência é mista e fraca, sobretudo depois de contar os custos de negociar. Nenhum padrão dá sempre lucro.'}
  ], src:[] },

{ id:'medias-rsi', topic:'tecnica', o:4, title:'Médias móveis e RSI', mins:7,
  lead:`Dois indicadores muito usados: a média móvel suaviza os preços para ver a direção, e o RSI mede o ritmo das subidas e descidas. São contas simples sobre preços passados, e é bom perceber exatamente o que contam, e o que não contam.`,
  blocks:[
    {t:'h',id:'h1',x:'Uma imagem para perceber'},
    {t:'p',id:'p0',x:`Quando o tempo está instável, olhar para a temperatura de hoje diz pouco; olhar para a média dos últimos 30 dias diz se estamos a entrar no verão ou no inverno. A <b>média móvel</b> faz isto com preços: tira o ruído do dia a dia e deixa ver a direção. O <b>RSI</b> é outra coisa: é como o velocímetro de um carro, mede a velocidade das últimas subidas e descidas, não para onde o carro vai.`},

    {t:'h',id:'h2',x:'Média móvel simples'},
    {t:'p',id:'p1',x:`A <b>média móvel</b> é a média dos últimos N preços de fecho, recalculada a cada novo período. Suaviza o ruído e mostra a direção. Com os fechos 10, 12, 11, 13 e 14, a média de 5 é <b>(10+12+11+13+14) ÷ 5 = 12</b>. Quando o preço está acima da média, a tendência costuma ser de alta; abaixo, de baixa. Médias curtas (por exemplo, 10 dias) reagem depressa mas têm mais ruído; médias longas (200 dias) são mais estáveis mas reagem tarde.`},
    {t:'h',id:'h3',x:'Média móvel exponencial'},
    {t:'p',id:'p2',x:`A <b>média móvel exponencial</b> (EMA) dá mais peso aos preços mais recentes. Em vez de contar todos os dias de forma igual, usa um multiplicador, 2 ÷ (N + 1): para N = 5 é 2 ÷ 6 = <b>${_te_n(2/6,3)}</b>. Cada dia, a nova EMA = preço de hoje × multiplicador + EMA de ontem × (1 − multiplicador). Reage mais depressa do que a média simples, mas também dá mais sinais falsos.`},
    {t:'cmp',id:'c1',head:['Dia','Fecho','Média simples (5)','Média exponencial (5)'],rows:_te_MR.c.map((x,i)=>[String(i+1),String(x),_te_MR.sma[i]===null?'—':_te_n(_te_MR.sma[i],2),_te_MR.ema[i]===null?'—':_te_n(_te_MR.ema[i],2)]).slice(4),cap:'Valores de exemplo. A exponencial começa na média simples do primeiro período de 5 dias.'},
    {t:'p',id:'p3',x:`Repara no último dia: o fecho é ${_te_MR.c[11]}, a média simples ${_te_n(_te_MR.sma[11],2)} e a exponencial ${_te_n(_te_MR.ema[11],2)}. A exponencial está mais perto do preço porque dá mais peso aos dias recentes. É a diferença entre as duas: a EMA reage mais depressa.`},
    {t:'fazve',id:'q1',ensina:['p1'],q:'Os últimos 5 fechos foram 20, 22, 21, 23 e 24. Qual é a média móvel de 5 períodos?',unit:'',answer:22,tol:.01,why:'(20+22+21+23+24) ÷ 5 = 110 ÷ 5 = 22.'},

    {t:'h',id:'h4',x:'Cruzamentos e o problema do atraso'},
    {t:'p',id:'p4',x:`Um sinal muito falado é o <b>cruzamento de médias</b>: quando uma média curta (por exemplo, 50 dias) passa para cima de uma longa (200 dias), diz-se «cruz dourada» e interpreta-se como sinal de alta; o inverso chama-se «cruz da morte». As médias móveis <b>atrasam</b>: confirmam o que já aconteceu. Na prática, quando o cruzamento acontece, parte do movimento já foi feita.`},
    {t:'p',id:'p5',x:`O pior problema surge quando o mercado anda de lado. O preço oscila perto das médias e cruza-as muitas vezes, cada cruzamento dá um sinal e cada sinal é um negócio. Se cada um destes negócios perde, por exemplo, ${_te_MR.whip.perda}% (entre comissões e preços piores), seis sinais seguidos dão ${_te_n(_te_MR.whip.total,1)}% de perda acumulada sem que nada de «mau» tenha acontecido. É o custo dos falsos sinais.`},

    {t:'h',id:'h5',x:'O RSI, passo a passo'},
    {t:'p',id:'p6',x:`O <b>RSI</b> (índice de força relativa) varia entre 0 e 100. Em 14 períodos, o cálculo é: <b>1.</b> Soma das subidas e das descidas dos últimos 14 períodos (cada uma em valor absoluto). <b>2.</b> Média das subidas ÷ média das descidas, que se chama força relativa (RS). <b>3.</b> RSI = 100 − 100 ÷ (1 + RS).`},
    {t:'p',id:'p7',x:`Com 15 fechos de exemplo (${_te_MR.rsiC.join(', ')}), há ${_te_MR.ng} dias de subida que somam ${_te_MR.g} e ${_te_MR.nl} dias de descida que somam ${_te_MR.l}. As médias são ${_te_n(_te_MR.ag,2)} (subidas) e ${_te_n(_te_MR.al,2)} (descidas). A força relativa é ${_te_n(_te_MR.ag,2)} ÷ ${_te_n(_te_MR.al,2)} = ${_te_n(_te_MR.rs,2)}, e o RSI é 100 − 100 ÷ (1 + ${_te_n(_te_MR.rs,2)}) = <b>${_te_n(_te_MR.rsi,0)}</b>. (Depois do primeiro valor, as plataformas usam um alisamento ligeiramente diferente.)`},
    {t:'p',id:'p8',x:`Por convenção, acima de 70 considera-se que o ativo está «sobrecomprado» (subiu depressa demais) e abaixo de 30 «sobrevendido». Mas atenção: um ativo pode ficar sobrecomprado durante muito tempo em tendências fortes. Numa série de exemplo com uma subida constante de 0,5% ao dia e um recuo a cada cinco dias, o RSI fica acima de 70 em ${_te_MR.dias70} dos ${_te_MR.validos} dias em que se calcula, ou seja, em ${_te_p(_te_MR.dias70/_te_MR.validos*100,0)} do tempo. Quem tivesse vendido ao primeiro «sobrecomprado» teria saído de uma subida inteira.`},
    {t:'fazve',id:'q2',ensina:['p6','p7'],q:`Numa janela de 14 períodos, a média das subidas é ${_te_n(_te_MR.q.ag,1)} e a média das descidas é ${_te_n(_te_MR.q.al,1)}. Qual é o RSI?`,unit:'',answer:_te_r(100-100/(1+_te_MR.q.ag/_te_MR.q.al),1),tol:.02,why:`RS = ${_te_n(_te_MR.q.ag,1)} ÷ ${_te_n(_te_MR.q.al,1)} = ${_te_n(_te_MR.q.ag/_te_MR.q.al,0)}. RSI = 100 − 100 ÷ (1 + ${_te_n(_te_MR.q.ag/_te_MR.q.al,0)}) = 100 − 25 = ${_te_n(100-100/(1+_te_MR.q.ag/_te_MR.q.al),0)}.`},

    {t:'ul',id:'u1',x:[
      'As médias móveis <b>atrasam</b>: confirmam o que já aconteceu.',
      'O RSI é um indicador de momento, não uma previsão.',
      'Usados isoladamente dão muitos falsos sinais.',
      'Os parâmetros (5, 14, 50, 200) são convenções: com outros números, os sinais mudam, e é fácil escolher os que «funcionavam» no passado.']},

    {t:'h',id:'h6',x:'Um caso real: os «Turtles»'},
    {t:'p',id:'p9',x:`No início dos anos 80, o negociante Richard Dennis ensinou um grupo de pessoas sem experiência (os «Turtles») a seguir um conjunto de regras mecânicas de seguimento de tendência, com ordens de compra em rompimentos e saídas pré-definidas. Segundo o que se conta, muitos tiveram bons resultados durante anos. A história é muitas vezes usada para mostrar que as tendências se podem seguir. Mas esquece-se uma parte: este tipo de método tem longos períodos de perdas seguidas e quedas fortes, e exige uma disciplina que poucas pessoas conseguem manter. Quando mais gente passou a usar métodos parecidos, a vantagem, a existir, ficou mais difícil de manter.`},

    {t:'h',id:'h7',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      '<b>Vender só porque o RSI passou os 70.</b> Em tendências fortes pode manter-se alto durante semanas.',
      '<b>Usar médias em mercados laterais.</b> Os cruzamentos repetem-se e cada um custa dinheiro.',
      '<b>Afinar os parâmetros até funcionar no passado.</b> Se testares 50 combinações, uma delas parecerá excelente por acaso.',
      '<b>Esquecer os custos.</b> Cada sinal é uma compra e uma venda, com comissões e imposto.',
      '<b>Ler o indicador sem o gráfico.</b> O indicador resume preços; sem ver o que o preço fez, é fácil interpretar mal.']},

    {t:'h',id:'h8',x:'Em Portugal'},
    {t:'p',id:'p10',x:`Estes indicadores aparecem nas plataformas das corretoras e na vista <b>Gráficos</b> deste site. Se os usares para entrar e sair com frequência, convém contar o impacto dos impostos: as mais-valias de ações e ETFs têm uma taxa autónoma de 28% sobre o saldo anual positivo (art. 72.º do CIRS, Portal das Finanças), e cada venda que dá lucro é um facto tributável. Experimenta com os teus números:`},
    {t:'w',id:'w1',w:'tax'},
    {t:'p',id:'p11',x:`O tema «Mais-valias: quanto imposto pagas ao vender» explica o que conta nesta taxa, e «Comissões e imposto do selo» os custos de cada ordem. A conta fica mais favorável a quem vende menos vezes.`},
    {t:'note',id:'n1',pending:true,x:'A forma como as perdas de um ano podem ser usadas nos anos seguintes não ficou confirmada em fonte oficial. Confirma no Portal das Finanças antes de contar com isso.'},

    {t:'h',id:'h9',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'A média móvel simples é a média dos últimos N fechos; a exponencial dá mais peso aos dias recentes.',
      'As médias suavizam e mostram a direção, mas atrasam e falham em mercados laterais.',
      'O RSI mede o ritmo das subidas e descidas (0 a 100); acima de 70 e abaixo de 30 são só convenções.',
      'Em tendências fortes, o RSI pode ficar «sobrecomprado» durante muito tempo.',
      'Cada sinal é uma operação: contam os custos e os impostos.']},
    {t:'decide',id:'q3',ensina:['p8','u1'],label:'Decide',q:'O RSI de um ativo está acima de 70. Isso garante que o preço vai descer em breve?',o:['Sim, é um sinal infalível','Sim, mas só às sextas-feiras','Não: apenas indica que subiu muito depressa, e em tendências fortes pode manter-se alto'],c:2,why:'O RSI mede o ritmo, não prevê. Um valor alto pode persistir enquanto a tendência for forte.'},
    {t:'decide',id:'q4',ensina:['p4','p5'],label:'Decide',q:'Em que tipo de mercado é que o cruzamento de médias costuma dar mais sinais falsos?',o:['Num mercado em forte tendência','Num mercado lateral, que oscila perto das médias','Num mercado fechado'],c:1,why:'Quando o preço anda de lado, cruza as médias muitas vezes sem ir a lado nenhum, e cada cruzamento custa comissões e preços piores.'},
    {t:'erro',id:'q5',ensina:['p2','p3','p4'],label:'Encontra o erro',q:'Uma destas frases está errada. Qual?',o:['A média exponencial dá mais peso aos preços recentes','As médias móveis antecipam as viragens do mercado','Médias longas reagem mais devagar do que médias curtas','O RSI usa a relação entre subidas e descidas médias'],c:1,why:'As médias móveis atrasam: confirmam o que já aconteceu, não o antecipam.'}
  ], src:[_AT_72] },

{ id:'macd-bollinger', topic:'tecnica', o:5, title:'MACD e bandas de Bollinger', mins:8,
  lead:`O MACD mede se o ritmo da subida ou da descida está a aumentar ou a abrandar. As bandas de Bollinger mostram se o preço está perto do seu intervalo habitual ou fora dele. São duas contas sobre preços passados, e convém saber ao certo o que cada uma mede.`,
  blocks:[
    {t:'h',id:'h1',x:'Uma imagem para perceber'},
    {t:'p',id:'p0',x:`Imagina dois corredores: um corre atento ao último minuto e outro à última meia hora. Se o corredor «do último minuto» passa para a frente do outro, é sinal de que acelerou em relação ao seu ritmo habitual. O MACD faz isto com preços: compara uma média rápida com uma lenta. As bandas de Bollinger são outra coisa: uma faixa à volta do preço que se alarga quando o mercado se agita e se estreita quando se acalma.`},

    {t:'h',id:'h2',x:'Como se constrói o MACD'},
    {t:'p',id:'p1',x:`O nome vem do inglês (<i>moving average convergence divergence</i>) e a conta tem três passos, todos feitos com médias exponenciais (ver «Médias móveis e RSI»).`},
    {t:'ul',id:'u1',x:[
      '<b>Linha MACD</b> = média exponencial de 12 períodos − média exponencial de 26 períodos. É positiva quando a média rápida está acima da lenta.',
      '<b>Linha de sinal</b> = média exponencial de 9 períodos da própria linha MACD. É uma versão mais lenta, para ajudar a ver cruzamentos.',
      '<b>Histograma</b> = linha MACD − linha de sinal. Mostra se a diferença está a crescer ou a diminuir.']},
    {t:'p',id:'p2',x:`Os números 12, 26 e 9 são convenções muito espalhadas, não leis da natureza. Usemos 70 fechos de uma ação inventada. Nos últimos seis dias, os números são:`},
    {t:'cmp',id:'c1',head:['Dia','Fecho','MACD','Sinal','Histograma'],rows:_te_MB.c.map((x,i)=>[String(i+1),_te_n(x,2),_te_n(_te_MB.macd[i],2),_te_n(_te_MB.sig[i],2),_te_n(_te_MB.hist[i],2)]).slice(-6),cap:'Valores de exemplo, em euros. Histograma = MACD − sinal.'},
    {t:'p',id:'p3',x:`No último dia, a linha MACD é ${_te_n(_te_MB.macd[69],2)} e o sinal ${_te_n(_te_MB.sig[69],2)}: o MACD está acima do sinal, e o histograma, de ${_te_n(_te_MB.hist[69],2)}, é positivo. Ao longo dos 70 dias, a linha MACD cruzou o sinal ${_te_MB.cruz.length} vezes, nos dias ${_te_MB.cruz.map(x=>x.d+' ('+x.t+')').join(', ')}. É isso que as pessoas costumam procurar: <b>cruzamento para cima = sinal de alta</b>, <b>para baixo = sinal de baixa</b>.`},
    {t:'fazve',id:'q1',ensina:['u1','p2'],q:'A média exponencial de 12 períodos está em 52,4 € e a de 26 períodos em 51,1 €. Qual é o valor da linha MACD, em €?',unit:'€',answer:1.3,tol:.02,why:'MACD = EMA 12 − EMA 26 = 52,4 − 51,1 = 1,3 €. É positivo porque a média rápida está acima da lenta.'},

    {t:'h',id:'h3',x:'O que dizem os sinais do MACD'},
    {t:'cmp',id:'c2',head:['Sinal','Como se vê','Leitura habitual','Dúvida'],rows:[
      ['Cruzamento com a linha de sinal','O MACD passa para cima (ou para baixo) da linha de sinal','Aumento (ou perda) de ritmo de subida','Dá muitos sinais em mercados laterais'],
      ['Passagem pelo zero','O MACD passa de negativo a positivo (ou vice-versa)','A média rápida passou a lenta: mudança de direção','Chega tarde, como todas as médias'],
      ['Divergência','O preço faz novo máximo, mas o MACD não','O movimento perde força','Pode durar semanas sem a viragem prevista']],cap:'São convenções de leitura. Nenhuma tem garantia.'},

    {t:'h',id:'h4',x:'As bandas de Bollinger'},
    {t:'p',id:'p4',x:`As <b>bandas de Bollinger</b> têm uma média móvel simples de 20 períodos ao meio, e duas bandas, uma acima e outra abaixo, a <b>2 desvios-padrão</b> de distância. O desvio-padrão é uma medida de quanto os preços se afastam da média: quanto mais o preço oscila, maior é. Por isso as bandas alargam em mercados agitados e estreitam em mercados calmos.`},
    {t:'p',id:'p5',x:`Na mesma série, nos últimos 20 dias a média foi de ${_te_n(_te_MB.b1.m,2)} € e o desvio-padrão de ${_te_n(_te_MB.b1.sd,2)} €. A banda superior é ${_te_n(_te_MB.b1.m,2)} + 2 × ${_te_n(_te_MB.b1.sd,2)} = <b>${_te_n(_te_MB.b1.up,2)} €</b> e a inferior ${_te_n(_te_MB.b1.m,2)} − 2 × ${_te_n(_te_MB.b1.sd,2)} = <b>${_te_n(_te_MB.b1.lo,2)} €</b>. O último fecho foi ${_te_n(_te_MB.c[69],2)} €, ou seja, a ${_te_p(_te_MB.b1.pb*100,0)} do caminho entre a banda inferior e a superior (o chamado «%B»). A largura das bandas, em relação à média, é de ${_te_p(_te_MB.b1.bw,0)}. Vinte dias antes era de ${_te_p(_te_MB.b0.bw,0)}: as bandas tinham estado mais estreitas.`},
    {t:'fazve',id:'q2',ensina:['p4','p5'],q:`Uma ação tem uma média de 20 dias de ${_te_MB.q.m} € e um desvio-padrão de ${_te_n(_te_MB.q.sd,1)} €. Onde está a banda superior de Bollinger (média + 2 desvios-padrão), em €?`,unit:'€',answer:_te_MB.q.m+2*_te_MB.q.sd,tol:.02,why:`${_te_MB.q.m} + 2 × ${_te_n(_te_MB.q.sd,1)} = ${_te_MB.q.m+2*_te_MB.q.sd} €. A banda inferior seria ${_te_MB.q.m-2*_te_MB.q.sd} €.`},
    {t:'cmp',id:'c3',head:['Leitura popular','O que diz','O que costuma falhar'],rows:[
      ['Toque na banda inferior','«Barato»: o preço pode voltar à média','Em quedas fortes, o preço «anda» pela banda e continua a descer'],
      ['Toque na banda superior','«Caro»: o preço pode voltar à média','Em subidas fortes, o preço pode ficar na banda superior durante semanas'],
      ['Bandas muito estreitas (squeeze)','Mercado calmo, pode vir um movimento forte','Não diz em que direção vem, nem quando']],cap:'As bandas descrevem a volatilidade recente. Não dizem se o preço está «caro» ou «barato».'},

    {t:'h',id:'h5',x:'Testar com dados que não têm padrões'},
    {t:'p',id:'p6',x:`Uma forma de ver o que estes sinais valem é testá-los em dados onde se <b>sabe</b> que não há padrões. Gerámos ${50} séries aleatórias de 1 000 dias cada (variações diárias ao acaso, sem tendência nem memória). Em todas elas contámos os sinais de compra do MACD (cruzamento para cima) e os toques na banda inferior de Bollinger, e vimos quantas vezes o preço estava mais alto 10 dias depois.`},
    {t:'cmp',id:'c4',head:['Sinal (em dados aleatórios)','Nº de sinais','Seguidos de subida em 10 dias'],rows:[
      ['MACD cruza para cima',String(_te_MB.pool.nM),_te_p(_te_MB.pool.posM/_te_MB.pool.nM*100,0)],
      ['Preço toca a banda inferior',String(_te_MB.pool.nB),_te_p(_te_MB.pool.posB/_te_MB.pool.nB*100,0)]],cap:'Simulação feita para este tema. Em dados sem padrões, «acertar» metade das vezes é o que se espera de um cara ou coroa.'},
    {t:'p',id:'p7',x:`O resultado é o que se esperaria de uma moeda ao ar: cerca de metade. Isto <b>não prova</b> que os sinais não funcionam em mercados reais (podem existir padrões que o nosso gerador aleatório não tem), mas mostra o ponto de partida: para um sinal valer alguma coisa, tem de fazer <b>melhor do que isto</b> de forma consistente, depois de custos, em dados que não foram usados para o escolher.`},

    {t:'h',id:'h6',x:'Um pouco de história'},
    {t:'p',id:'p8',x:`O MACD foi criado por Gerald Appel, nos anos 70, e as bandas por John Bollinger, nos anos 80. Ambos nasceram numa época em que fazer estas contas à mão ou em computadores lentos era trabalhoso, e em que poucos investidores as seguiam. Hoje qualquer plataforma as desenha, e milhões de pessoas e programas olham para os mesmos indicadores. Isso não os torna inúteis como descrição, mas torna improvável que um sinal tão popular dê vantagem fácil.`},

    {t:'h',id:'h7',x:'Os limites e os erros comuns'},
    {t:'ul',id:'u2',x:[
      '<b>Os dois são derivados do preço.</b> Não trazem informação nova: são o mesmo preço, tratado de outra maneira.',
      '<b>Atraso.</b> O MACD usa médias, por isso confirma depois de o movimento começar.',
      '<b>Mercados laterais.</b> Os cruzamentos do MACD repetem-se e cada sinal pode ser uma perda pequena.',
      '<b>Bandas como «compra» e «venda».</b> Tocar a banda inferior não é sinal de compra; em quedas fortes, o preço cola-se a ela.',
      '<b>Afinar os parâmetros.</b> Mudar 12-26-9 ou 20 e 2 até o passado «dar certo» é um erro clássico: os números só valem se funcionarem em dados novos.']},
    {t:'note',id:'n1',x:'A evidência de que estes indicadores permitem ganhar de forma consistente ao mercado, depois de custos, é fraca. Usa-os como forma de descrever o que o preço está a fazer, não como máquina de sinais.'},

    {t:'h',id:'h8',x:'Em Portugal'},
    {t:'p',id:'p9',x:`As plataformas das corretoras que usas em Portugal têm estes indicadores nos gráficos, e a vista <b>Gráficos</b> deste site também. Se transformares cada cruzamento numa operação, as comissões e o imposto do selo acumulam-se (ver «Comissões e imposto do selo»), e os ganhos pagam imposto (ver «Mais-valias: quanto imposto pagas ao vender»). Para um investidor a longo prazo em ETFs, o plano de investir aos poucos (ver «Investir aos poucos ou de uma vez») dispensa estes indicadores.`},

    {t:'h',id:'h9',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'MACD = EMA de 12 − EMA de 26; a linha de sinal é a EMA de 9 do MACD; o histograma é a diferença.',
      'As bandas de Bollinger são uma média de 20 períodos com duas bandas a 2 desvios-padrão: medem a volatilidade, não «caro» ou «barato».',
      'Ambos são derivados do preço e atrasam em relação ao movimento.',
      'Em dados aleatórios, os sinais «acertam» cerca de metade das vezes, o que dá o ponto de partida para os avaliar.',
      'A evidência de que dão vantagem consistente é fraca; usa-os para descrever, não para prever.']},
    {t:'decide',id:'q3',ensina:['u1','p3','c2'],label:'Decide',q:'A linha MACD passa de baixo para cima da linha de sinal. Como se costuma ler?',o:['Como um sinal de aumento do ritmo de subida (e só isso: não é uma garantia)','Como a certeza de que o preço vai duplicar','Como o fim do mercado'],c:0,why:'O cruzamento sugere que a média rápida está a ganhar à lenta. Mas é só uma leitura convencional, que falha muitas vezes, sobretudo em mercados laterais.'},
    {t:'decide',id:'q4',ensina:['p4','c3'],label:'Decide',q:'O preço de uma ação toca a banda inferior de Bollinger durante uma queda forte. O que é mais prudente concluir?',o:['Que o preço tem de subir já a seguir','Que o preço está muito baixo e é obrigatório comprar','Que o preço pode continuar a descer: as bandas descrevem volatilidade, não prometem uma subida'],c:2,why:'Em quedas fortes, o preço pode manter-se ou continuar a andar pela banda inferior durante muito tempo. A banda mede a dispersão dos preços, não o «valor justo».'},
    {t:'erro',id:'q5',ensina:['p6','p7','u2'],label:'Encontra o erro',q:'Uma destas frases está errada. Qual?',o:['O MACD e as bandas de Bollinger são calculados a partir do preço','Em séries aleatórias, os sinais do MACD acertam cerca de metade das vezes','O MACD antecipa as viragens antes de elas acontecerem','Mudar os parâmetros até o passado «dar certo» é um risco'],c:2,why:'O MACD é calculado com médias de preços passados, por isso atrasa em relação ao movimento. Não antecipa viragens.'}
  ], src:[] },

{ id:'gestao-risco-operacao', topic:'tecnica', o:6, title:'Gestão de risco numa operação: stop-loss e tamanho da posição', mins:9,
  lead:`Quem negoceia perde muitas vezes. O que decide se, no fim, sobra dinheiro é quanto se perde quando se perde e quanto se ganha quando se ganha. Duas decisões fazem quase todo o trabalho: onde pões a saída (stop-loss) e quanto compras (tamanho da posição).`,
  blocks:[
    {t:'h',id:'h1',x:'Uma imagem para perceber'},
    {t:'p',id:'p0',x:`Pensa em quem conduz. Ninguém decide a velocidade só pela estrada que vê: também pesa o que acontece se tiver de travar de repente. Conduzir a 50 num dia de chuva, com carro a 5 metros à frente, é uma má ideia, mesmo que a estrada esteja livre agora. Nas operações em bolsa, o <b>stop-loss</b> é o plano de travagem e o <b>tamanho da posição</b> é a velocidade. Antes de entrares, convém saberes quanto aceitas perder se te enganares.`},

    {t:'h',id:'h2',x:'O stop-loss: sair antes de a perda crescer'},
    {t:'p',id:'p1',x:`Um <b>stop-loss</b> é uma ordem para vender (ou uma decisão de vender) se o preço descer até um nível definido <b>antes</b> de comprares. A ideia é limitar a perda em cada operação a um valor que já aceitaste. O stop não é um palpite sobre o mercado; é uma decisão sobre o risco. Há quatro formas comuns de o escolher:`},
    {t:'cmp',id:'c1',head:['Tipo','Como se define','Vantagem','Limite'],rows:[
      ['Por percentagem','Uma percentagem abaixo da compra (por exemplo, 8%)','Simples','Ignora o comportamento normal da ação: pode ser apertado demais ou largo demais'],
      ['Por nível técnico','Logo abaixo de um suporte ou de um mínimo recente','Liga-se a algo que se vê no gráfico','Os níveis não são exatos e o preço pode «varrê-los» antes de subir'],
      ['Por volatilidade (ATR)','Um múltiplo da amplitude média diária (ATR, <i>average true range</i>), por exemplo 2×','Adapta-se ao «ruído» normal da ação','É um número, e o preço pode ser mais volátil num dia mau'],
      ['Móvel (trailing)','Sobe com o preço, mantendo uma distância fixa','Protege ganhos à medida que o preço sobe','Numa oscilação normal, pode sair cedo']],cap:'Qualquer método tem falsos disparos. A questão é se a perda máxima por operação é aceitável.'},

    {t:'h',id:'h3',x:'Tamanho da posição: a conta que quase ninguém faz'},
    {t:'p',id:'p2',x:`O erro mais comum é decidir primeiro quanto comprar e só depois pensar no stop. A ordem certa é a inversa. A regra é: <b>risco por operação = percentagem do capital que aceitas perder</b> (muitas pessoas usam 1%, é só um exemplo), e <b>número de ações = risco ÷ (preço de entrada − stop)</b>.`},
    {t:'p',id:'p3',x:`Um exemplo: tens ${_e(_te_GR.cap)}, aceitas perder ${_te_GR.rp}% por operação, ou seja, <b>${_e(_te_GR.risco)}</b>. Queres entrar numa ação a ${_te_n(_te_GR.ent,0)} € com stop a ${_te_n(_te_GR.stop,0)} €: arriscas ${_te_n(_te_GR.rAcao,0)} € por ação. Então compras ${_e(_te_GR.risco)} ÷ ${_te_n(_te_GR.rAcao,0)} € = <b>${_te_GR.qt} ações</b>. A posição vale ${_te_GR.qt} × ${_te_n(_te_GR.ent,0)} = ${_e(_te_GR.pos)}, que é ${_te_p(_te_GR.posPct,1)} do capital. Reparas que a posição é muito maior do que o risco: o stop é que a faz caber.`},
    {t:'p',id:'p4',x:`O mesmo capital com um stop mais largo muda tudo. Se usares o ATR, e a amplitude média diária for ${_te_n(_te_GR.atr,1)} €, um stop a 2 × ATR fica ${_te_n(2*_te_GR.atr,1)} € abaixo, em ${_te_n(_te_GR.stopAtr,1)} €. Com os mesmos ${_e(_te_GR.risco)} de risco, comprarias apenas ${_te_GR.qtAtr} ações. Stop mais largo, menos ações: o risco é o mesmo.`},
    {t:'fazve',id:'q1',ensina:['p2','p3'],q:`Tens ${_e(_te_GR.q.cap)} e aceitas perder ${_te_GR.q.rp}% por operação. Entras a ${_te_GR.q.ent} € com stop a ${_te_GR.q.stop} €. Quantas ações compras?`,unit:'ações',answer:Math.floor(_te_GR.q.cap*_te_GR.q.rp/100/(_te_GR.q.ent-_te_GR.q.stop)),tol:.02,why:`Risco = ${_te_GR.q.cap} × ${_te_GR.q.rp}% = ${_te_GR.q.cap*_te_GR.q.rp/100} €. Risco por ação = ${_te_GR.q.ent} − ${_te_GR.q.stop} = ${_te_GR.q.ent-_te_GR.q.stop} €. Ações = ${_te_GR.q.cap*_te_GR.q.rp/100} ÷ ${_te_GR.q.ent-_te_GR.q.stop} = ${Math.floor(_te_GR.q.cap*_te_GR.q.rp/100/(_te_GR.q.ent-_te_GR.q.stop))}.`},

    {t:'h',id:'h4',x:'Quanto ganhas versus quanto arriscas'},
    {t:'p',id:'p5',x:`Antes de entrar, define também onde esperas sair com lucro. Se o alvo for ${_te_n(_te_GR.alvo,0)} €, ganhas ${_te_n(_te_GR.alvo-_te_GR.ent,0)} € por ação se acertares e perdes ${_te_n(_te_GR.rAcao,0)} € se falhares: uma relação ganho/risco de <b>${_te_n(_te_GR.rr,0)} para 1</b>. Esta relação diz quantas vezes tens de acertar para não perder dinheiro, antes de custos:`},
    {t:'cmp',id:'c2',head:['Relação ganho/risco','Percentagem de acertos mínima para empatar','Com 40% de acertos, ganho médio por operação (em unidades de risco)'],rows:[1,2,3].map(r=>[r+' para 1',_te_p(_te_GR.be(r),0),(_te_GR.esp(0.4,r)>=0?'+':'')+_te_n(_te_GR.esp(0.4,r),1)+' R']),cap:'«R» é o risco de uma operação. Antes de comissões e impostos.'},
    {t:'p',id:'p6',x:`A conta é simples: com relação 2 para 1, basta acertar uma vez em cada três para empatar. Mas atenção: uma relação 3 para 1 só vale a pena se o alvo for realista. Um alvo demasiado longe falha mais vezes. E há custos: com comissões de ${_te_GR.costs} € entre compra e venda, e risco de ${_e(_te_GR.risco)}, só os custos consomem ${_te_p(_te_GR.custoPct,0)} do risco de cada operação.`},

    {t:'h',id:'h5',x:'Porque é que perder pouco de cada vez é tão importante'},
    {t:'p',id:'p7',x:`Imagina uma série de 10 operações perdedoras seguidas. Se perdes ${_te_GR.rp}% do capital em cada uma, ficas com ${_te_n(100+_te_GR.seq.a,1)}% do capital, ou seja, perdeste ${_te_n(-_te_GR.seq.a,1)}%. Se arriscares 10% em cada uma, ficas com ${_te_n(100+_te_GR.seq.b,1)}%: perdeste ${_te_n(-_te_GR.seq.b,0)}%. Séries de perdas acontecem a quem acerta bastante, e a diferença entre sobreviver e ficar fora do jogo está no tamanho de cada aposta. Além disso, recuperar é mais difícil do que perder: uma queda de 10% exige uma subida de 11,1% para voltares ao início. Experimenta:`},
    {t:'w',id:'w1',w:'calc',c:'drawdown'},
    {t:'p',id:'p8',x:`Ver o tema «Quedas máximas (drawdown)» para as contas das quedas e o tema «Disciplina e rotina» para como manter o plano quando corre mal.`},

    {t:'h',id:'h6',x:'O que o stop não garante'},
    {t:'p',id:'p9',x:`Um stop-loss não é um seguro. Quando o preço atinge o nível, a ordem torna-se uma ordem de venda e é executada ao <b>melhor preço disponível</b>, que pode ser pior. Se a ação fechar ontem acima do teu stop de ${_te_n(_te_GR.stop,0)} € e abrir hoje a ${_te_n(_te_GR.gap.abre,1)} € por causa de uma notícia (uma lacuna ou «gap», ver «Velas e gráficos»), a venda faz-se por perto de ${_te_n(_te_GR.gap.abre,1)} €. Com as ${_te_GR.qt} ações, a perda é (${_te_n(_te_GR.ent,0)} − ${_te_n(_te_GR.gap.abre,1)}) × ${_te_GR.qt} = <b>${_e(_te_GR.gap.perda)}</b>, ${_te_n(_te_GR.gap.vezes,2)} vezes o risco planeado de ${_e(_te_GR.risco)}.`},
    {t:'stat',id:'s1',v:Math.round(_te_GR.gap.perda),label:'perdidos com um «gap» de abertura, num stop pensado para limitar a perda a 200 €'},
    {t:'ul',id:'u1',x:[
      '<b>Gaps durante a noite ou o fim de semana</b> passam por cima do stop e tiram o preço planeado.',
      '<b>Ações pouco negociadas</b> podem ter ofertas distantes umas das outras, e a execução faz-se bem longe do stop.',
      '<b>Movimentos bruscos</b> (por exemplo, o «flash crash» de 6 de maio de 2010, em que alguns títulos negociaram por breves instantes a preços absurdos) executam stops a preços que desaparecem minutos depois.',
      '<b>Produtos com alavancagem</b> (CFD, por exemplo) ampliam tudo: o stop pode ser atingido mais depressa e a perda pesa muito mais no capital (ver «Opções, CFD e alavancagem (riscos)»).']},

    {t:'h',id:'h7',x:'Um caso real: o «flash crash» de 2010'},
    {t:'p',id:'p10',x:`Em 6 de maio de 2010, os mercados dos Estados Unidos caíram e recuperaram muito em poucos minutos. Algumas ações negociaram por breves instantes a preços absurdamente baixos, e muitos pequenos investidores que tinham ordens stop automáticas viram-nas executadas a esses preços, perdendo muito mais do que tinham planeado, antes de o preço voltar ao normal. A lição que ficou foi que o stop é uma ferramenta com falhas conhecidas: convém saber que tipo de ordem estás a usar (ver «Tipos de ordem») e o que pode correr mal.`},

    {t:'h',id:'h8',x:'E para quem investe a longo prazo?'},
    {t:'p',id:'p11',x:`Um stop-loss tem sentido para quem negoceia com horizontes curtos e uma posição concentrada. Para quem constrói uma carteira diversificada de ETFs com um horizonte de décadas, um stop pode fazer mais mal do que bem: obriga a vender depois de uma queda, ficando de fora na recuperação que costuma seguir-se. Aí, o que protege é a diversificação, o plano de investimento e o tamanho certo da posição em cada ativo (ver «Diversificação e correlação»). Cada pessoa tem de escolher o que faz sentido para o seu caso.`},

    {t:'h',id:'h9',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      '<b>Decidir o tamanho primeiro e o stop depois.</b> A ordem correta é: stop, risco aceitável, número de ações.',
      '<b>Mexer no stop quando o preço se aproxima.</b> Afastar o stop para «dar mais espaço» desfaz o plano.',
      '<b>Pôr o stop num nível óbvio.</b> Muita gente coloca stops no mesmo sítio, e o preço pode lá ir um momento antes de subir.',
      '<b>Arriscar demasiado de cada vez.</b> Séries de perdas acontecem a toda a gente.',
      '<b>Ignorar custos e impostos.</b> Com stops muito apertados, o número de operações e os custos sobem.']},

    {t:'h',id:'h10',x:'Em Portugal'},
    {t:'p',id:'p12',x:`Em Portugal, os tipos de ordem que podes usar dependem da corretora ou do banco (ver «Tipos de ordem» e «Banco ou corretora?»), e cada operação tem comissões e imposto do selo (ver «Comissões e imposto do selo»). Quando vendes com lucro, aplica-se a taxa autónoma de 28% sobre o saldo anual positivo das mais-valias (art. 72.º do CIRS, Portal das Finanças), explicado em «Mais-valias: quanto imposto pagas ao vender». Isso significa que o ganho líquido de uma operação é menor do que o ganho do gráfico, e deves contar com isso ao calcular a relação ganho/risco.`},
    {t:'note',id:'n1',pending:true,x:'A forma como as perdas de uma operação podem compensar ganhos de outros anos não ficou confirmada em fonte oficial. Confirma no Portal das Finanças antes de contar com isso no teu plano.'},

    {t:'h',id:'h11',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'O stop-loss é uma decisão de risco tomada antes de entrar, não um palpite sobre o mercado.',
      'Número de ações = (capital × risco aceite) ÷ (entrada − stop). Primeiro o stop, depois o tamanho.',
      'A relação ganho/risco diz quantas vezes tens de acertar para empatar: 2 para 1 exige acertar em 33%.',
      'Perder pouco de cada vez protege-te de séries de perdas, que acontecem a todos.',
      'O stop não garante o preço: gaps, ações pouco negociadas e movimentos bruscos executam pior.']},
    {t:'decide',id:'q2',ensina:['p2','p3','p4'],label:'Decide',q:'Queres arriscar 200 € numa operação. Se afastares o stop para o dobro da distância, o que acontece ao número de ações que compras?',o:['Compras o dobro das ações','Compras metade das ações, para o risco continuar nos 200 €','Compras o mesmo número, e o risco duplica'],c:1,why:'O risco total é o número de ações vezes a distância ao stop. Para manter o mesmo risco, se a distância dobra, tens de comprar metade das ações.'},
    {t:'fazve',id:'q3',ensina:['p5','c2'],q:'Se a relação ganho/risco de uma operação é 3 para 1, qual é a percentagem mínima de acertos para empatar (antes de custos)?',unit:'%',answer:_te_r(_te_GR.be(3),1),tol:.03,why:`Com relação 3 para 1, cada acerto compensa 3 falhas. Para empatar tens de acertar 1 vez em cada 4, ou seja, 1 ÷ (1 + 3) = ${_te_n(_te_GR.be(3),0)}%.`},
    {t:'decide',id:'q4',ensina:['p9','u1','p10'],label:'Decide',q:'Pões um stop a 23 €. A ação abre a 21,5 € depois de uma má notícia. O que tende a acontecer à venda?',o:['É executada exatamente a 23 €','É executada por perto de 21,5 €, pior do que o stop','Não é executada nunca'],c:1,why:'O stop só dispara quando o preço lá chega, e a ordem executa-se ao melhor preço disponível nessa altura. Num gap, esse preço pode estar muito abaixo do stop.'},
    {t:'erro',id:'q5',ensina:['p2','p7','p9','u2'],label:'Encontra o erro',q:'Uma destas frases está errada. Qual?',o:['Um stop-loss garante sempre que a perda fica limitada ao valor escolhido','O tamanho da posição deve ser decidido depois de escolher o stop','Séries de perdas acontecem mesmo a quem acerta mais vezes do que falha','Perder 10% exige uma subida de cerca de 11% para recuperar'],c:0,why:'O stop não garante o preço de execução: em gaps e movimentos bruscos, a perda pode ser maior do que a planeada.'}
  ], src:[_AT_72] },

{ id:'limites-tecnica', topic:'tecnica', o:7, title:'Limites da análise técnica', mins:8,
  lead:`Os gráficos têm um fascínio enorme, mas a evidência de que os padrões preveem o futuro é fraca. Convém usá-los com os olhos abertos: sabendo o que conseguem fazer, o que não conseguem, e porquê é tão fácil enganarmo-nos.`,
  blocks:[
    {t:'h',id:'h1',x:'O acaso também desenha figuras'},
    {t:'p',id:'p0',x:`Lança uma moeda 20 vezes e regista as caras e coroas. A maior parte das pessoas acha que «uma sequência de 5 ou 6 caras seguidas» é suspeita. Mas fizemos esta experiência 10 000 vezes num computador e a sequência mais longa foi, em média, de <b>${_te_n(_te_LM.run,1)}</b> seguidas. Ou seja, o acaso produz sequências que parecem ter intenção. O mesmo acontece com os preços: um gráfico gerado a atirar moedas ao ar tem «tendências», «suportes» e «padrões». É por isso que o primeiro cuidado ao olhar para um gráfico é perguntar: <b>isto é um padrão, ou é o acaso a parecer um padrão?</b>`},

    {t:'h',id:'h2',x:'O que diz a teoria'},
    {t:'p',id:'p1',x:`A <b>hipótese dos mercados eficientes</b>, formulada pelo economista Eugene Fama nos anos 60 e 70, defende que os preços já refletem a informação disponível, e que, por isso, as variações futuras são sobretudo imprevisíveis. Na versão «fraca», isso quer dizer que nem sequer o historial de preços permite prever o futuro, o que, tomado à letra, deixaria a análise técnica sem utilidade. O economista Burton Malkiel popularizou a ideia em 1973 no livro <i>A Random Walk Down Wall Street</i> («Um passeio aleatório por Wall Street»), onde sustentou que um macaco a atirar dardos a uma lista de ações poderia fazer tão bem como um gestor profissional.`},
    {t:'p',id:'p2',x:`Esta teoria tem críticos sérios. Há trabalhos que encontram padrões como o «momentum» (ativos que subiram tendem a subir um pouco mais, em certos períodos) e a investigação em finanças comportamentais mostra que os investidores cometem erros sistemáticos. A conclusão sensata, sem ir a nenhum extremo, é esta: <b>o mercado não é perfeitamente eficiente, mas é difícil e raro explorar as suas falhas de forma consistente, depois de custos e impostos.</b>`},

    {t:'h',id:'h3',x:'Cinco razões pelas quais é fácil enganarmo-nos'},
    {t:'ul',id:'u1',x:[
      '<b>Olhar para trás é fácil</b>: depois de um movimento, qualquer padrão parece evidente. Antes, há muitos padrões possíveis.',
      '<b>Confirmação seletiva</b>: tendemos a ver os padrões que confirmam o que já pensávamos.',
      '<b>Profecias que se cumprem</b>: um nível pode funcionar porque muita gente o observa, mas isso muda com o tempo.',
      '<b>Custos</b>: negociar muitas vezes com base em sinais acumula comissões, spreads e impostos.',
      '<b>Evidência mista</b>: os estudos não mostram que seja possível ganhar de forma consistente ao mercado só com gráficos.']},

    {t:'h',id:'h4',x:'O perigo de «melhorar» as regras com dados passados'},
    {t:'p',id:'p3',x:`Há um erro especialmente traiçoeiro: testar muitas regras nos mesmos dados e ficar com a melhor. Fizemos esta experiência. Simulámos 250 dias de um ativo (variação diária ao acaso de cerca de 1%) e 100 «estratégias» que decidem ao acaso, todos os dias, se estão compradas ou vendidas. Nenhuma tem lógica nenhuma. A média dos resultados foi de ${_te_n(_te_LM.media,1)}%. Mas a melhor das 100 teve um resultado de <b>${_te_n(_te_LM.best,0)}%</b> num ano.`},
    {t:'stat',id:'s1',v:Math.round(_te_LM.best),fmt:'pct',label:'ganho da melhor de 100 estratégias que decidem ao acaso, numa simulação de um ano: sorte pura, sem qualquer lógica'},
    {t:'p',id:'p4',x:`Quem olhasse só para o melhor «teste» poderia achar que descobriu uma regra poderosa. É o que acontece, sem má-fé, quando se experimentam muitos indicadores, parâmetros e períodos até um deles «dar certo». Quanto mais regras se testam, maior é a probabilidade de uma parecer excelente por acaso. A defesa é testar em dados <b>novos</b>, que não serviram para encontrar a regra, e desconfiar de resultados bons demais.`},
    {t:'fazve',id:'q1',ensina:['p3','p4'],q:`Na simulação, a média das 100 estratégias foi de ${_te_n(_te_LM.media,1)}% e a melhor deu ${_te_n(Math.round(_te_LM.best),0)}%. Quantos pontos percentuais acima da média ficou a melhor?`,unit:'pontos',answer:_te_r(Math.round(_te_LM.best)-_te_r(_te_LM.media,1),1),tol:.03,why:`${_te_n(Math.round(_te_LM.best),0)} − ${_te_n(_te_LM.media,1)} = ${_te_n(Math.round(_te_LM.best)-_te_r(_te_LM.media,1),1)} pontos. Nenhuma das estratégias tinha lógica: a «melhor» foi só a mais sortuda entre 100.`},

    {t:'h',id:'h5',x:'O custo de agir com base em sinais'},
    {t:'p',id:'p5',x:`Mesmo que um método tenha alguma vantagem em teoria, agir sobre ele custa dinheiro: comissões em cada compra e venda, a diferença entre o preço de compra e de venda (spread), imposto sobre ganhos e, nas operações curtas, o tempo e a atenção. Estudos com milhares de contas de pequenos investidores, em países diferentes (como os Estados Unidos, Taiwan e o Brasil), encontraram que quem negoceia com muita frequência tende a ter piores resultados do que quem negoceia pouco, e que a maior parte dos «day traders» acaba por perder dinheiro. As plataformas de CFD muitas vezes mostram um aviso com a percentagem de clientes que perde dinheiro (ver «Opções, CFD e alavancagem (riscos)»).`},

    {t:'h',id:'h6',x:'O que a análise técnica pode, e não pode, fazer'},
    {t:'cmp',id:'c1',head:['Pode ajudar a','Não consegue'],rows:[
      ['Ler o contexto: tendência, volatilidade, volume','Garantir previsões de preços'],
      ['Decidir onde cortar uma perda e quanto arriscar','Transformar um mau negócio num bom'],
      ['Perceber o comportamento dos outros participantes (medo, euforia)','Dar sempre sinais antes das viragens'],
      ['Acompanhar um plano de investimento com regras claras','Dispensar custos, impostos e disciplina'],
      ['Descrever o que o preço fez','Explicar porque o fez']],cap:'Não quer dizer que seja inútil: serve para ler o contexto e gerir o risco.'},
    {t:'p',id:'p6',x:`Isto não quer dizer que a análise técnica seja inútil: serve para <b>ler o contexto</b>, entender o comportamento dos preços e gerir o risco (por exemplo, decidir onde cortar uma perda, como se vê em «Gestão de risco numa operação: stop-loss e tamanho da posição»). O que não faz é garantir previsões. Há quem use alguns indicadores simples para organizar a entrada de dinheiro num plano de longo prazo, e quem os use por gosto ou curiosidade, o que é legítimo, desde que se conheçam os limites.`},

    {t:'h',id:'h7',x:'Um caso real: o passeio aleatório e o concurso dos dardos'},
    {t:'p',id:'p7',x:`Desde os anos 80 que jornais financeiros fizeram concursos em que ações escolhidas por analistas profissionais eram comparadas com ações escolhidas ao acaso (atirando dardos a uma lista). Os resultados variaram com o período, e os profissionais ganharam algumas vezes, mas o facto de a comparação ser equilibrada surpreendeu muita gente. Este episódio ficou como símbolo de uma discussão que continua: quanto é que é mérito e quanto é sorte no desempenho de quem escolhe ações. Nenhum concurso prova a favor ou contra a análise técnica, mas lembra a pergunta certa: <b>este método ganha ao acaso, depois de custos?</b>`},

    {t:'h',id:'h8',x:'Os erros que mais custam'},
    {t:'ul',id:'u2',x:[
      '<b>Confundir o que parece óbvio no passado com o que se podia saber no momento.</b>',
      '<b>Experimentar até uma regra dar bom resultado, e acreditar nela.</b>',
      '<b>Negociar muito.</b> Cada sinal é uma operação com custos.',
      '<b>Ignorar que o outro lado da operação sabe, pelo menos, o mesmo.</b> Quem te vende ao preço que queres comprar também olha para o gráfico.',
      '<b>Usar alavancagem para «aproveitar» sinais.</b> Amplia ganhos e perdas, e as perdas podem ser maiores do que o capital que pusesses.']},

    {t:'h',id:'h9',x:'Em Portugal'},
    {t:'p',id:'p8',x:`A análise técnica pode ser usada em Portugal da mesma forma que noutros países, com as mesmas limitações. O que muda é o que paga cada operação: comissões e imposto do selo (ver «Comissões e imposto do selo») e imposto sobre os ganhos (ver «Mais-valias: quanto imposto pagas ao vender»). Se te sentires tentado a negociar muito, vê «Vieses que custam dinheiro» e «Disciplina e rotina»; e para saber quando uma oferta de «sinais» ou «gurus» é uma burla, vê «Esquemas e como nos enganam» e «Burlas e a lista da CMVM». Para a maioria das pessoas, a alternativa de investir de forma regular e diversificada, como em «Indexado ou gestão ativa», dispensa os gráficos.`},

    {t:'h',id:'h10',x:'Em poucas palavras'},
    {t:'ul',id:'u3',x:[
      'O acaso gera tendências e padrões que parecem ter significado; convém perguntar se é padrão ou acaso.',
      'A evidência de que gráficos permitem ganhar ao mercado de forma consistente é fraca; os mercados não são perfeitos mas são difíceis de bater.',
      'Testar muitas regras nos mesmos dados dá resultados enganadores: valida em dados novos.',
      'Negociar com frequência acumula custos e impostos, e tende a piorar os resultados.',
      'O uso mais sólido é ler o contexto e gerir o risco, não prever.']},
    {t:'decide',id:'q2',ensina:['u1','p0'],label:'Decide',q:'Porque é que os padrões nos gráficos parecem tão óbvios depois do movimento?',o:['Porque o futuro é sempre previsível','Porque os gráficos nunca falham','Porque olhar para trás é fácil: já sabemos o resultado e escolhemos o padrão que o explica'],c:2,why:'É o viés de retrospetiva: depois de conhecer o resultado, qualquer padrão parece evidente. E o acaso gera figuras que parecem ter intenção.'},
    {t:'decide',id:'q3',ensina:['p3','p4'],label:'Decide',q:'Testas 100 regras num ano de dados e a melhor deu 40%. O que é mais prudente concluir?',o:['Que encontraste uma regra poderosa e deves usá-la já','Que a melhor de 100 pode ser sorte: testa-a em dados novos antes de acreditar','Que é preciso testar menos regras para ganhar mais'],c:1,why:'Quanto mais regras se testam, maior é a probabilidade de uma parecer excelente por acaso. A prova está em dados novos, não nos que serviram para a escolher.'},
    {t:'erro',id:'q4',ensina:['u1','p5','c1','p6'],label:'Encontra o erro',q:'Uma destas frases sobre a análise técnica está errada. Qual?',o:['Olhar para trás torna os padrões enganadoramente óbvios','Operar muitas vezes com base em sinais acumula custos','A análise técnica garante prever os preços','Pode ajudar a ler o contexto e gerir o risco'],c:2,why:'Ninguém consegue garantir previsões de preços com gráficos.'}
  ], src:[] }
);
