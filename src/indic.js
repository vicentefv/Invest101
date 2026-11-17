// ================= Indicadores técnicos no gráfico =================
// Escolhidos para câmbios; por agora o menu só aparece nos ativos de Forex. Calculam-se sobre todas as velas guardadas do intervalo,
// não só as visíveis, para as médias alisadas (Wilder, exponencial) já terem estabilizado quando chegam ao ecrã.
// As sobreposições desenham-se no preço (até três ao mesmo tempo); os osciladores partilham um painel por baixo do gráfico (um de cada vez).
const IND=[
  {id:'piv',k:'o',n:'Pontos de pivô',g:'Níveis',col:'var(--i-piv)',how:'Níveis calculados a partir do período anterior (dia, semana ou mês). O preço reage muitas vezes junto deles, mas nem sempre.',ok:tf=>tf!=='w1',no:'Não se aplica em velas de 1 semana.'},
  {id:'bb',k:'o',n:'Bandas de Bollinger',g:'Volatilidade',col:'var(--i-bb)',how:'Bandas largas indicam mercado agitado; estreitas, mercado calmo. Tocar numa banda não é, por si só, sinal de inversão.'},
  {id:'don',k:'o',n:'Canal de Donchian',g:'Estrutura',col:'var(--i-don)',how:'Máximo e mínimo do período recente. Um fecho fora do canal é um rompimento, que pode falhar.'},
  {id:'fvg',k:'o',n:'FVG, lacunas de valor justo',g:'Estrutura',col:'linear-gradient(135deg,var(--up) 50%,var(--down) 50%)',how:'Zonas que o preço atravessou tão depressa que ficou um intervalo entre três velas. A verde podem servir de apoio, a vermelho de travão. Mostram-se as cinco mais recentes que ainda valem; saem quando uma vela fecha do lado de lá.'},
  {id:'ifvg',k:'o',n:'iFVG, lacunas invertidas',g:'Estrutura',col:'repeating-linear-gradient(135deg,var(--up) 0 3px,var(--down) 3px 6px)',how:'Uma lacuna em que uma vela fechou do lado de lá troca de papel: o apoio passa a travão e o travão a apoio. Aparecem a tracejado, as cinco mais recentes, até o preço voltar a fechar para lá delas.'},
  {id:'ma200',k:'o',n:'Média de 200',g:'Tendência',col:'var(--i-ma)',how:'Preço acima da média de 200: tendência de fundo ascendente; abaixo: descendente.',ok:tf=>tf!=='m15',no:'Não se aplica em velas de 15 minutos.'},
  {id:'vwap',k:'o',n:'VWAP da sessão',g:'Volume',col:'var(--i-vwap)',how:'Preço médio do dia ponderado pelo volume dos futuros. Acima dele, os compradores do dia estão a ganhar; abaixo, a perder. É uma aproximação.',ok:(tf,b,id)=>(tf==='m15'||tf==='h1')&&!!b.v&&id!=='DXY',no:'Só em velas de 15 minutos e 1 hora, nos pares com volume de futuros.'},
  {id:'rsi',k:'p',n:'RSI 14',g:'Momento',how:'Acima de 70 a subida recente foi forte; abaixo de 30, a descida. Em tendência pode ficar lá muito tempo.'},
  {id:'adx',k:'p',n:'ADX e DI',g:'Força da tendência',how:'Acima de 25 há tendência com força; abaixo de 20 o mercado está sem direção. O ADX mede força, não sentido.'},
  {id:'macd',k:'p',n:'MACD',g:'Momento da tendência',how:'Histograma a crescer: o movimento ganha força; a encolher: perde-a.'},
  {id:'atr',k:'p',n:'ATR 14',g:'Volatilidade',how:'Quanto o preço costuma mexer por vela. Não indica direção.'},
];
// conjuntos que fazem sentido ligar juntos, sem indicadores redundantes
const IPRE=[{n:'Tendência',o:['ma200','don'],p:'adx'},{n:'Reversão à média',o:['bb','vwap'],p:'rsi'},{n:'Rompimentos',o:['piv','don'],p:'atr'}];
const DON_N={m15:96,h1:120,d1:20,w1:52};  // 24 horas, uma semana, 20 dias e 52 semanas
const PIV_L={m15:'diários',h1:'semanais',d1:'mensais'};
const FVG_SHOW=5;  // quantas lacunas por fechar e quantas invertidas se mostram, das mais recentes (como o "mostrar as últimas" dos indicadores de referência)
{ const s=store('ind'); st.ind={o:new Set(Array.isArray(s?.o)?s.o:[]),p:typeof s?.p==='string'?s.p:null}; }
const indFor=id=>st.quotes[id]?.cls==='Forex';
// os indicadores em preço mostram-se em pips nos pares (centésimos no iene) e em pontos no índice do dólar
const iUnit=(id,dec)=>id==='USDJPY'?{m:100,u:' pips',d:1}:id==='DXY'||!indFor(id)?{m:1,u:'',d:Math.min(dec??3,3)}:{m:1e4,u:' pips',d:1};

// ---------- dia de negociação de câmbios: das 17h00 às 17h00 de Nova Iorque ----------
// As velas de domingo à noite pertencem a segunda-feira; as de sexta depois das 17h ficam na sexta. Devolve dias desde 1970.
const nyMemo=new Map();
function nyDay(t){ let d=nyMemo.get(t); if(d!==undefined) return d; const p=tzParts(t*1000,'America/New_York'); d=Date.UTC(p.year,p.month-1,p.day)/864e5+(p.hour>=17?1:0); const wd=(d+4)%7; if(wd===6) d--; else if(wd===0) d++; if(nyMemo.size>8000) nyMemo.clear(); nyMemo.set(t,d); return d; }
const nyWeek=t=>{ const d=nyDay(t); return d-(d+3)%7; };  // segunda-feira dessa semana

// ---------- cálculo ----------
const iSma=(a,n)=>{ const o=new Array(a.length).fill(null); let s=0; for(let i=0;i<a.length;i++){ s+=a[i]; if(i>=n) s-=a[i-n]; if(i>=n-1) o[i]=s/n; } return o; };
// médias alisadas: a semente é a média simples dos primeiros n valores a contar de "from". Wilder usa 1/n; a exponencial, 2/(n+1).
const iSmooth=(a,n,alpha,from=0)=>{ const o=new Array(a.length).fill(null); if(a.length<from+n) return o; let v=0; for(let i=from;i<from+n;i++) v+=a[i]; v/=n; o[from+n-1]=v; for(let i=from+n;i<a.length;i++){ v+=alpha*(a[i]-v); o[i]=v; } return o; };
const iRma=(a,n,from)=>iSmooth(a,n,1/n,from),iEma=(a,n,from)=>iSmooth(a,n,2/(n+1),from);
const iTR=b=>b.t.map((_,i)=>i?Math.max(b.h[i]-b.l[i],Math.abs(b.h[i]-b.c[i-1]),Math.abs(b.l[i]-b.c[i-1])):b.h[i]-b.l[i]);
const ICALC={
  // média de 20 fechos e duas bandas a 2 desvios-padrão (populacional, divisor n)
  bb(b){ const mid=iSma(b.c,20),up=mid.slice(),lo=mid.slice(); for(let i=19;i<b.c.length;i++){ let q=0; for(let k=i-19;k<=i;k++) q+=(b.c[k]-mid[i])**2; const sd=Math.sqrt(q/20); up[i]=mid[i]+2*sd; lo[i]=mid[i]-2*sd; } return {mid,up,lo}; },
  // máximo e mínimo das n velas anteriores, sem contar a atual: só assim um fecho pode romper o canal
  don(b,tf){ const n=DON_N[tf],len=b.t.length,up=new Array(len).fill(null),lo=up.slice(); for(let i=n;i<len;i++){ let h=-Infinity,l=Infinity; for(let k=i-n;k<i;k++){ if(b.h[k]>h) h=b.h[k]; if(b.l[k]<l) l=b.l[k]; } up[i]=h; lo[i]=l; } return {up,lo}; },
  ma200:b=>iSma(b.c,200),
  // preço típico de cada vela ponderado pelo volume dos futuros, a recomeçar em cada dia de negociação (15m) ou semana (1h)
  vwap(b,tf){ const key=tf==='m15'?nyDay:nyWeek,len=b.t.length,v=new Array(len).fill(null),k=new Array(len); let pv=0,sv=0,n=0; for(let i=0;i<len;i++){ k[i]=key(b.t[i]); if(i&&k[i]!==k[i-1]){ pv=sv=n=0; } const w=b.v[i]||0; if(w){ pv+=(b.h[i]+b.l[i]+b.c[i])/3*w; sv+=w; n++; } if(n>=4) v[i]=pv/sv; } return {v,k}; },
  // níveis clássicos a partir do máximo, mínimo e fecho do período anterior: dia (15m), semana (1h) ou mês (1D)
  piv(b,tf){ const key=tf==='m15'?nyDay:tf==='h1'?nyWeek:t=>{ const d=new Date(t*1000); return d.getUTCFullYear()*12+d.getUTCMonth(); },per=[]; let cur=null;
    b.t.forEach((t,i)=>{ const k=key(t); if(!cur||cur.k!==k) per.push(cur={k,i0:i,i1:i,H:-Infinity,L:Infinity,C:0}); cur.i1=i; if(b.h[i]>cur.H) cur.H=b.h[i]; if(b.l[i]<cur.L) cur.L=b.l[i]; cur.C=b.c[i]; });
    return per.slice(1).map((p,j)=>{ const q=per[j],P=(q.H+q.L+q.C)/3,r=q.H-q.L; return {i0:p.i0,i1:p.i1,last:j===per.length-2,P,R1:2*P-q.L,S1:2*P-q.H,R2:P+r,S2:P-r}; }); },
  // lacunas de valor justo, pelas regras do indicador de referência no TradingView (Fair Value Gap, LuxAlgo), que traduzem o conceito do ICT:
  // de alta quando mínimo[i] > máximo[i-2] e a vela do meio fecha acima de máximo[i-2] (vela de deslocamento); de baixa, o espelho.
  // Só contam as maiores do que a média das lacunas já vistas (altura relativa ao preço). Uma lacuna vale até uma vela FECHAR do lado de lá:
  // um pavio que a atravessa é só um teste. Nesse fecho inverte-se (inv) e vale, com o papel trocado, até um fecho de volta.
  fvg(b){ const len=b.t.length,Z=[]; let sum=0,n=0; for(let i=2;i<len;i++){ const up=b.l[i]>b.h[i-2]&&b.c[i-1]>b.h[i-2]; if(!up&&!(b.h[i]<b.l[i-2]&&b.c[i-1]<b.l[i-2])) continue;
      const lo=up?b.h[i-2]:b.h[i],hi=up?b.l[i]:b.l[i-2],rel=(hi-lo)/lo,thr=n?sum/n:0; sum+=rel; n++; if(rel<=thr) continue;
      const z={d:up?1:-1,lo,hi,i0:i-1,i1:null,inv:null}; Z.push(z);
      for(let j=i+1;j<len;j++) if(up?b.c[j]<lo:b.c[j]>hi){ z.i1=j; z.inv={i0:j,i1:null}; for(let k=j+1;k<len;k++) if(up?b.c[k]>hi:b.c[k]<lo){ z.inv.i1=k; break; } break; } }
    return Z; },
  ifvg:b=>ICALC.fvg(b),
  rsi(b){ const len=b.c.length,U=new Array(len).fill(0),D=U.slice(); for(let i=1;i<len;i++){ const x=b.c[i]-b.c[i-1]; if(x>0) U[i]=x; else D[i]=-x; } const u=iRma(U,14,1),d=iRma(D,14,1); return u.map((x,i)=>x==null?null:d[i]===0?(x===0?50:100):100-100/(1+x/d[i])); },
  atr:b=>iRma(iTR(b),14),
  adx(b){ const len=b.t.length,P=new Array(len).fill(0),M=P.slice(); for(let i=1;i<len;i++){ const up=b.h[i]-b.h[i-1],dn=b.l[i-1]-b.l[i]; if(up>dn&&up>0) P[i]=up; if(dn>up&&dn>0) M[i]=dn; }
    const sT=iRma(iTR(b),14,1),sP=iRma(P,14,1),sM=iRma(M,14,1),p=sT.map((x,i)=>x==null?null:x?100*sP[i]/x:0),m=sT.map((x,i)=>x==null?null:x?100*sM[i]/x:0),dx=p.map((x,i)=>x==null?0:x+m[i]?100*Math.abs(x-m[i])/(x+m[i]):0);
    return {p,m,adx:iRma(dx,14,14)}; },
  macd(b){ const a=iEma(b.c,12),c=iEma(b.c,26),m=c.map((x,i)=>x==null?null:a[i]-x),s=iEma(m.map(x=>x??0),9,25); return {m,s,h:s.map((x,i)=>x==null?null:m[i]-x)}; },
};
const iCache=new WeakMap();  // resultados por conjunto de velas: mudam só quando chegam velas novas
// o que está ligado e se aplica a este ativo e intervalo, com as séries já calculadas
function indPrep(id,tf,b){ if(!indFor(id)) return {o:[],p:null,d:{}}; let c=iCache.get(b); if(!c) iCache.set(b,c={});
  const ok=x=>!x.ok||x.ok(tf,b,id),o=IND.filter(x=>x.k==='o'&&st.ind.o.has(x.id)&&ok(x)).map(x=>x.id),pd=IND.find(x=>x.k==='p'&&x.id===st.ind.p),p=pd&&ok(pd)?pd.id:null,d={};
  for(const k of p?[...o,p]:o) d[k]=c[k]||(c[k]=ICALC[k](b,tf)); return {o,p,d,id,tf}; }
// só as bandas e o canal alargam a escala do preço; pivôs, VWAP e média de 200 não, para não esmagarem as velas
function indRange(I,s,e,f){ for(const k of ['bb','don']){ const d=I.d[k]; if(!d||!I.o.includes(k)) continue; for(let i=s;i<e;i++) if(d.up[i]!=null) f(d.lo[i],d.up[i]); } }

// ---------- desenho ----------
function indSvg(I,g){ if(!I.o.length&&!I.p) return {over:'',pane:''}; const {b,s,e,X,Y,W,padL,padR,padT,band,bw,pbot,ptop,ph,dec,ad}=g,d=I.d,xr=W-padR,has=k=>I.o.includes(k); let o='';
  const halo='paint-order:stroke;stroke:var(--bg);stroke-width:3px;stroke-opacity:.75;stroke-linejoin:round';  // contorno escuro: o texto lê-se por cima de velas e linhas
  const ln=(p,col,w,dash)=>p?`<path d="${p}" fill="none" style="stroke:${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}/>`:'';
  // linha pelos valores conhecidos; "brk" obriga a recomeçar quando muda (âncora do VWAP)
  const path=(a,YY,brk)=>{ let p='',on=false; for(let i=s;i<e;i++){ const v=a[i]; if(v==null){ on=false; continue; } p+=(on&&!(brk&&i>s&&brk[i]!==brk[i-1])?'L':'M')+X(i).toFixed(1)+','+YY(v).toFixed(1); on=true; } return p; };
  const steps=a=>{ let p='',on=false; for(let i=s;i<e;i++){ const v=a[i]; if(v==null){ on=false; continue; } const yy=Y(v).toFixed(1); p+=(on?'L':'M')+(X(i)-band/2).toFixed(1)+','+yy+'L'+(X(i)+band/2).toFixed(1)+','+yy; on=true; } return p; };
  if(has('bb')){ const {up,lo,mid}=d.bb; let a=s; while(a<e&&up[a]==null) a++;
    if(a<e-1){ let f=''; for(let i=a;i<e;i++) f+=(i>a?'L':'M')+X(i).toFixed(1)+','+Y(up[i]).toFixed(1); for(let i=e-1;i>=a;i--) f+='L'+X(i).toFixed(1)+','+Y(lo[i]).toFixed(1); o+=`<path d="${f}Z" style="fill:var(--i-bb)" opacity=".07"/>`; }
    o+=ln(path(up,Y),'var(--i-bb)',1.1)+ln(path(lo,Y),'var(--i-bb)',1.1)+(st.ma.has(20)?'':ln(path(mid,Y),'var(--i-bb)',1,'3 4')); }
  if(has('don')) o+=ln(steps(d.don.up),'var(--i-don)',1.2)+ln(steps(d.don.lo),'var(--i-don)',1.2);
  if(has('ma200')) o+=ln(path(d.ma200,Y),'var(--i-ma)',2);
  if(has('vwap')) o+=ln(path(d.vwap.v,Y,d.vwap.k),'var(--i-vwap)',1.6);
  // pivôs: o período em curso leva os cinco níveis e as etiquetas, e prolonga-se até à margem direita (vale também para a zona da previsão);
  // os períodos anteriores ficam só com P, R1 e S1, esbatidos, para não encherem o gráfico
  // lacunas: só as que ainda valem, as FVG_SHOW mais recentes de cada tipo, desde a vela do meio até à margem direita, com contorno e etiqueta.
  // As invertidas levam a cor contrária à da lacuna de origem e contorno tracejado.
  const zone=(a,lo,hi,dir,inv)=>{ if(a>=e) return ''; const x0=Math.max(padL,X(a)-band/2),y0=Y(hi),h=Math.max(1.5,Y(lo)-y0),w=xr-x0,col=dir>0?'var(--up)':'var(--down)'; if(w<=0) return '';
    return `<rect x="${x0.toFixed(1)}" y="${y0.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="2" style="fill:${col}" opacity=".15"/><rect x="${x0.toFixed(1)}" y="${y0.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="none" style="stroke:${col}" stroke-width="1"${inv?' stroke-dasharray="4 3"':''} opacity=".6"/>`+(w>=40&&h>=9?`<text x="${(x0+5).toFixed(1)}" y="${(y0+h/2+3.2).toFixed(1)}" font-size="9" style="fill:color-mix(in srgb,${col} 70%,var(--ink));font-weight:600;letter-spacing:.04em">${inv?'iFVG':'FVG'}</text>`:''); };
  if(has('fvg')) for(const z of d.fvg.filter(z=>z.i1==null).slice(-FVG_SHOW)) o+=zone(z.i0,z.lo,z.hi,z.d,false);
  if(has('ifvg')) for(const z of d.ifvg.filter(z=>z.inv&&z.inv.i1==null).sort((a,b)=>a.inv.i0-b.inv.i0).slice(-FVG_SHOW)) o+=zone(z.inv.i0,z.lo,z.hi,-z.d,true);
  if(has('piv')) for(const P of d.piv){ if(P.i1<s||(P.i0>=e&&!P.last)) continue; const xa=Math.max(padL,X(P.i0)-band/2),xb=P.last?xr:Math.min(xr,X(P.i1)+band/2); if(xb<=xa) continue;
    for(const [k,v,dash,w] of [['P',P.P,'',1.3],['R1',P.R1,'5 4',1],['S1',P.S1,'5 4',1],['R2',P.R2,'1 4',1],['S2',P.S2,'1 4',1]]){ if(!P.last&&k[1]==='2') continue; const yy=Y(v);
      o+=`<line x1="${xa.toFixed(1)}" x2="${xb.toFixed(1)}" y1="${yy.toFixed(1)}" y2="${yy.toFixed(1)}" style="stroke:var(--i-piv)" stroke-width="${w}"${dash?` stroke-dasharray="${dash}"`:''} opacity="${P.last?.85:.38}"/>`+(P.last?`<text x="${(xb-6).toFixed(1)}" y="${(yy-4).toFixed(1)}" text-anchor="end" font-size="10.5" style="fill:var(--ink);font-weight:600;${halo}">${k}<tspan dx="5" style="fill:var(--i-piv);font-family:var(--f-data);font-weight:400">${nf(v,ad)}</tspan></text>`:''); } }
  const over=o?`<clipPath id="pclip"><rect x="${padL}" y="${padT}" width="${xr-padL}" height="${Math.max(0,pbot-padT)}"/></clipPath><g clip-path="url(#pclip)">${o}</g>`:'';
  // painel do oscilador, por baixo do preço e do volume e com a mesma escala de tempo: uma fila para o título (nome, valor e leitura em palavras),
  // a curva por baixo dela e o último valor numa etiqueta no eixo, como a do preço
  let pane=''; if(I.p){ const top=ptop,pd=d[I.p],u=iUnit(I.id,dec),def=IND.find(x=>x.id===I.p),y0=top+22,yh=ph-29; let lo=0,hi=100,body='',val='',say='',tv=null,tt='';
    const PY=v=>y0+(1-(v-lo)/(hi-lo||1))*yh,vis=a=>{ for(let i=s;i<e;i++){ const v=a[i]; if(v!=null){ if(v<lo) lo=v; if(v>hi) hi=v; } } },last=a=>{ for(let i=e-1;i>=s;i--) if(a[i]!=null) return a[i]; return null; };
    const hl=(v,dash,op)=>`<line x1="${padL}" x2="${xr}" y1="${PY(v).toFixed(1)}" y2="${PY(v).toFixed(1)}" style="stroke:var(--line-2)"${dash?` stroke-dasharray="${dash}"`:''} opacity="${op}"/>`,lab=(v,t)=>tv!=null&&Math.abs(PY(v)-PY(tv))<10?'':`<text x="${xr+8}" y="${(PY(v)+3.5).toFixed(1)}" font-size="10" style="fill:var(--muted);font-family:var(--f-data)">${t}</text>`;
    const zone=(a,z,col)=>`<rect x="${padL}" y="${PY(z).toFixed(1)}" width="${xr-padL}" height="${(PY(a)-PY(z)).toFixed(1)}" style="fill:var(--${col})" opacity=".05"/>`;
    if(I.p==='rsi'){ const v=tv=last(pd); body=zone(70,100,'down')+zone(0,30,'up')+hl(70,'3 4',.9)+hl(30,'3 4',.9)+hl(50,'1 5',.55)+lab(70,'70')+lab(30,'30')+ln(path(pd,PY),'var(--accent)',1.6); val=v==null?'':nf(v,0); tt=val; say=v==null?'':v>=70?'sobrecomprado':v<=30?'sobrevendido':'zona neutra'; }
    else if(I.p==='adx'){ hi=40; vis(pd.adx); vis(pd.p); vis(pd.m); hi=Math.ceil(hi/10)*10; const v=tv=last(pd.adx); body=hl(25,'3 4',.9)+hl(20,'1 5',.6)+lab(25,'25')+ln(path(pd.p,PY),'var(--up)',1.1)+ln(path(pd.m,PY),'var(--down)',1.1)+ln(path(pd.adx,PY),'var(--ink)',1.8);
      val=v==null?'':`${nf(v,0)} <tspan style="fill:var(--up)">+DI ${nf(last(pd.p),0)}</tspan> <tspan style="fill:var(--down)">−DI ${nf(last(pd.m),0)}</tspan>`; tt=v==null?'':nf(v,0); say=v==null?'':v>=25?'tendência com força':v<20?'sem direção':'força indefinida'; }
    else if(I.p==='macd'){ lo=Infinity; hi=-Infinity; vis(pd.m); vis(pd.s); vis(pd.h); const a=Math.max(Math.abs(lo),Math.abs(hi)); lo=-(isFinite(a)&&a?a:1); hi=-lo; const z=PY(0); let hs='';
      for(let i=s;i<e;i++){ const v=pd.h[i]; if(v==null) continue; const yy=PY(v); hs+=`<rect x="${(X(i)-bw/2).toFixed(1)}" y="${Math.min(yy,z).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(.6,Math.abs(yy-z)).toFixed(1)}" style="fill:var(--${v>=0?'up':'down'})" opacity=".45"/>`; }
      body=hl(0,'',.9)+lab(0,'0')+hs+ln(path(pd.m,PY),'var(--accent)',1.5)+ln(path(pd.s,PY),'var(--c2)',1.2); const v=last(pd.m),sg_=last(pd.s); val=v==null?'':nf(v*u.m,u.d)+(sg_==null?'':` <tspan style="fill:var(--c2)">sinal ${nf(sg_*u.m,u.d)}</tspan>`)+u.u; }
    else { lo=Infinity; hi=-Infinity; vis(pd); if(!isFinite(lo)){ lo=0; hi=1; } const p=(hi-lo||hi*.1||1)*.12; lo-=p; hi+=p; const v=tv=last(pd); body=ln(path(pd,PY),'var(--accent)',1.6); val=v==null?'':nf(v*u.m,u.d)+u.u; tt=v==null?'':nf(v*u.m,u.d); }
    const tag=tv==null?'':`<rect x="${xr+3}" y="${(PY(tv)-8).toFixed(1)}" width="${padR-5}" height="16" rx="4" style="fill:var(--${I.p==='adx'?'ink-2':'accent'})"/><text x="${xr+8}" y="${(PY(tv)+3.7).toFixed(1)}" font-size="10.5" style="fill:var(--on-accent);font-family:var(--f-data);font-weight:500">${tt}</text>`;
    pane=`<rect x="${padL}" y="${top}" width="${xr-padL}" height="${ph}" rx="8" style="fill:var(--ink)" opacity=".04"/>`+body+tag+`<text x="${padL+10}" y="${top+15}" font-size="11" style="fill:var(--ink-2);font-weight:600;${halo}">${def.n}<tspan dx="7" style="font-family:var(--f-data);font-weight:500;fill:var(--ink)">${val||'sem velas suficientes'}</tspan>${say&&W>=520?`<tspan dx="8" style="fill:var(--muted);font-weight:400">${say}</tspan>`:''}</text>`; }
  return {over,pane}; }
// linha extra no tooltip da vela: o valor do oscilador nessa vela
function indTip(I,i){ if(!I?.p) return ''; const d=I.d[I.p],u=iUnit(I.id); let t='';
  if(I.p==='rsi'){ if(d[i]!=null) t='RSI '+nf(d[i],0); } else if(I.p==='atr'){ if(d[i]!=null) t='ATR '+nf(d[i]*u.m,u.d)+u.u; }
  else if(I.p==='adx'){ if(d.adx[i]!=null) t=`ADX ${nf(d.adx[i],0)} · +DI ${nf(d.p[i],0)} · −DI ${nf(d.m[i],0)}`; } else if(d.h[i]!=null) t=`MACD ${nf(d.m[i]*u.m,u.d)} · sinal ${nf(d.s[i]*u.m,u.d)}${u.u}`;
  return t?`<br><span style="opacity:.85">${t}</span>`:''; }
function indLegend(I){ const nm={piv:'Pivôs '+(PIV_L[I.tf]||''),bb:'Bollinger (20, 2)',don:`Donchian (${DON_N[I.tf]})`,ma200:'Média de 200',vwap:'VWAP',fvg:'FVG, de alta e de baixa',ifvg:'iFVG, lacunas invertidas'}; return I.o.map(k=>`<span><i class="${k==='fvg'||k==='ifvg'?'zsw':'ln'}" style="background:${IND.find(x=>x.id===k).col}"></i>${nm[k]}</span>`).join(''); }

// ---------- menu ----------
// Painel com os conjuntos prontos em cima e duas colunas por baixo: o que se desenha no preço (caixas, até três) e o que vai para o painel de baixo
// (círculos, um de cada vez). Redesenha-se a cada escolha, por isso guarda e repõe o foco do teclado. Em telemóvel é uma folha presa ao fundo do ecrã.
function indMenu(){ const id=st.asset,B=barsFor(id); if(!B) return; const pop=$('indPop'),ok=x=>!x.ok||x.ok(B.tf,B.b,id),nO=IND.filter(x=>x.k==='o'&&st.ind.o.has(x.id)&&ok(x)).length,pOn=IND.some(x=>x.k==='p'&&st.ind.p===x.id&&ok(x)),n=nO+(pOn?1:0);
  const af=pop.contains(document.activeElement)?document.activeElement:null,fk=af?(af.dataset.ind?`[data-ind="${af.dataset.ind}"]`:af.dataset.ipre?`[data-ipre="${af.dataset.ipre}"]`:null):null,sc=pop.scrollTop;
  const row=x=>{ const on=(x.k==='o'?st.ind.o.has(x.id):st.ind.p===x.id)&&ok(x),full=x.k==='o'&&!on&&nO>=3&&ok(x);
    return `<button class="irow" aria-pressed="${on}" data-ind="${x.id}"${!ok(x)||full?' disabled':''}><span class="ick" aria-hidden="true"${x.col?` style="--ic:${x.col}"`:''}></span><span class="itx"><b>${x.n}</b><em>${x.g}</em><small>${!ok(x)?x.no:full?'Já tem três no preço. Desligue um para ligar este.':x.how}</small></span></button>`; };
  const same=p=>p.o.length===st.ind.o.size&&p.o.every(k=>st.ind.o.has(k))&&st.ind.p===p.p;
  pop.innerHTML=`<div class="ihead"><b>Indicadores</b><span class="muted">${n?n+(n===1?' ligado':' ligados'):'nenhum ligado'}</span><button class="link" data-ipre="x"${st.ind.o.size||st.ind.p?'':' hidden'}>Limpar</button><button class="xbtn" data-iclose aria-label="Fechar indicadores">${ico(IC.x)}</button></div>
    <div class="ipre"><span class="lab">Conjuntos prontos</span>${IPRE.map((p,i)=>`<button class="chip" data-ipre="${i}" aria-pressed="${same(p)}">${p.n}</button>`).join('')}</div>
    <div class="icols"><div class="isec" role="group" aria-label="No preço, até três"><span class="lab">No preço <i>até três</i></span>${IND.filter(x=>x.k==='o').map(row).join('')}</div><div class="isec one" role="group" aria-label="Por baixo do gráfico, um de cada vez"><span class="lab">Por baixo do gráfico <i>um de cada vez</i></span>${IND.filter(x=>x.k==='p').map(row).join('')}</div></div>`;
  pop.scrollTop=sc; if(fk) (pop.querySelector(fk+':not(:disabled):not([hidden])')||pop).focus({preventScroll:true}); }
// em ecrãs largos abre por baixo do botão, alinhado à esquerda dele; a origem da animação fica no botão
function indPlace(){ const p=$('indPop'); if(matchMedia('(max-width:560px)').matches){ p.style.left=p.style.top=p.style.transformOrigin=''; return; }
  const b=$('indBtn').getBoundingClientRect(),host=p.offsetParent.getBoundingClientRect(),w=p.offsetWidth,l=clamp(b.left-host.left,12,Math.max(12,host.width-w-12)); p.style.left=l+'px'; p.style.top=(b.bottom-host.top+8)+'px'; p.style.transformOrigin=clamp(b.left+b.width/2-host.left-l,0,w)+'px 0'; }
function indClose(focus){ const p=$('indPop'); if(p.hidden) return; p.hidden=true; $('indBtn').setAttribute('aria-expanded','false'); if(focus) $('indBtn').focus(); }
// botão do menu: só nos ativos de Forex com velas; mostra quantos indicadores estão ligados neste intervalo
function indUi(){ const btn=$('indBtn'),B=$('chartbox').classList.contains('bars')&&indFor(st.asset)&&barsFor(st.asset); btn.hidden=!B; if(!B){ indClose(false); $('iLeg').innerHTML=''; return; }
  const I=indPrep(st.asset,B.tf,B.b),n=I.o.length+(I.p?1:0); $('indN').textContent=n||''; $('indN').hidden=!n; btn.classList.toggle('on',n>0); if(!$('indPop').hidden) indMenu(); }
$('indBtn').addEventListener('click',()=>{ const p=$('indPop'); if(!p.hidden){ indClose(false); return; } indMenu(); p.hidden=false; p.scrollTop=0; $('indBtn').setAttribute('aria-expanded','true'); indPlace(); p.focus({preventScroll:true}); });
$('indPop').addEventListener('click',e=>{ if(e.target.closest('[data-iclose]')){ indClose(true); return; } const pre=e.target.closest('[data-ipre]'),r=e.target.closest('[data-ind]'); if(!pre&&(!r||r.disabled)) return;
  if(pre){ const p=IPRE[pre.dataset.ipre]; st.ind={o:new Set(p?p.o:[]),p:p?p.p:null}; }
  else { const x=IND.find(z=>z.id===r.dataset.ind); if(x.k==='p') st.ind.p=st.ind.p===x.id?null:x.id; else st.ind.o.has(x.id)?st.ind.o.delete(x.id):st.ind.o.add(x.id); }
  store('ind',{o:[...st.ind.o],p:st.ind.p}); renderCmpBar(); drawChart(false); });
document.addEventListener('click',e=>{ if(!$('indPop').hidden&&!e.composedPath().some(n=>n.id==='indPop'||n.id==='indBtn')) indClose(false); });  // o menu redesenha-se a cada clique, por isso vale o caminho do evento e não o elemento clicado
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!$('indPop').hidden){ e.stopPropagation(); indClose(true); } },true);
addEventListener('resize',()=>{ if(!$('indPop').hidden) indPlace(); });
