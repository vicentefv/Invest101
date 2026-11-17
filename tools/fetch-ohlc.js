// Vai buscar velas (abertura, máximo, mínimo, fecho e, quando existe, volume) ao Yahoo Finance para os mercados do Radar Macro
// e escreve um ficheiro JSON por mercado em <pasta>/ohlc/<ID>.json, pronto a gravar na coleção "ohlc".
// Uso: node fetch-ohlc.js <pasta de saída>
const fs=require('fs'),path=require('path'),https=require('https');
const out=process.argv[2]||'.';
const SYM={SPX:'^GSPC',NDX:'^NDX',DJI:'^DJI',DAX:'^GDAXI',ESTX50:'^STOXX50E',PSI:'PSI20.LS',NIKKEI:'^N225',US2Y:'2YY=F',US10Y:'^TNX',
  EURUSD:'EURUSD=X',GBPUSD:'GBPUSD=X',USDJPY:'JPY=X',USDCAD:'CAD=X',DXY:'DX-Y.NYB',BRENT:'BZ=F',WTI:'CL=F',NATGAS:'NG=F',GOLD:'GC=F',SILVER:'SI=F',COPPER:'HG=F',BTC:'BTC-USD',ETH:'ETH-USD',SOL:'SOL-USD'};
const DEC={EURUSD:5,GBPUSD:5,USDCAD:5,USDJPY:3,US2Y:3,US10Y:3,NATGAS:3,COPPER:4,SILVER:3,DXY:3};
// intervalo do Yahoo, período pedido, número máximo de velas guardadas
const TF={m15:['15m','5d',480],h1:['60m','1mo',400],d1:['1d','2y',400],w1:['1wk','10y',300]};
const STEP={'15m':900,'60m':3600,'1d':86400,'1wk':604800};
const get=u=>new Promise((res,rej)=>{ const rq=https.get(u,{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36',Accept:'application/json'},timeout:20000},r=>{ let d=''; r.on('data',c=>d+=c); r.on('end',()=>r.statusCode===200?res(d):rej(new Error('HTTP '+r.statusCode))); }); rq.on('error',rej); rq.on('timeout',()=>rq.destroy(new Error('timeout'))); });
async function bars(sym,iv,rg,max,dec){ const j=JSON.parse(await get(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=${iv}&range=${rg}`)),r=j.chart&&j.chart.result&&j.chart.result[0]; if(!r||!r.timestamp) throw new Error('sem dados');
  const q=r.indicators.quote[0],k=10**dec,f=v=>Math.round(v*k)/k,o={t:[],o:[],h:[],l:[],c:[],v:[]};
  r.timestamp.forEach((t,i)=>{ const a=q.open[i],b=q.high[i],c=q.low[i],d=q.close[i]; if([a,b,c,d].some(v=>v==null||!isFinite(v))||d<=0) return; o.t.push(t); o.o.push(f(a)); o.h.push(f(Math.max(a,b,c,d))); o.l.push(f(Math.min(a,b,c,d))); o.c.push(f(d)); o.v.push(Math.round(q.volume?.[i]||0)); });
  // o Yahoo acrescenta um último ponto com a hora atual: se cair dentro da vela anterior, é essa vela ainda a decorrer e junta-se a ela
  const n=o.t.length,step=STEP[iv]; if(n>1&&o.t[n-1]%900&&o.t[n-1]-o.t[n-2]<step){ o.h[n-2]=Math.max(o.h[n-2],o.h[n-1]); o.l[n-2]=Math.min(o.l[n-2],o.l[n-1]); o.c[n-2]=o.c[n-1]; o.v[n-2]+=o.v[n-1]; for(const key of Object.keys(o)) o[key].pop(); }
  for(const key of Object.keys(o)) o[key]=o[key].slice(-max); if(!o.v.some(Boolean)) delete o.v;  // câmbios e yields não têm volume
  if(o.t.length<5) throw new Error('poucas velas'); return o; }
// Dia de negociação de câmbios: das 17h00 às 17h00 de Nova Iorque (as velas de domingo à noite pertencem a segunda-feira; as de sexta depois das 17h ficam na sexta).
// Devolve o dia em dias desde 1970. Usa o fuso de Nova Iorque e não um desvio fixo, porque os EUA e a Europa mudam a hora em datas diferentes.
const nyF=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit'});
function nyDay(t){ const p={}; nyF.formatToParts(new Date(t*1000)).forEach(x=>p[x.type]=+x.value); let d=Date.UTC(p.year,p.month-1,p.day)/864e5+(p.hour>=17?1:0); const wd=(d+4)%7; if(wd===6) d--; if(wd===0) d++; return d; }
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function chart(sym,iv,rg){ const j=JSON.parse(await get(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=${iv}&range=${rg}`)),r=j.chart&&j.chart.result&&j.chart.result[0]; if(!r||!r.timestamp) throw new Error('sem dados'); const q=r.indicators.quote[0]; return {t:r.timestamp,o:q.open,h:q.high,l:q.low,c:q.close,v:q.volume||[]}; }
// Velas diárias dos pares de câmbio: nas velas "1d" do Yahoo o fecho vem quase sempre igual à abertura (não é um fecho verdadeiro),
// por isso constroem-se a partir das velas de 1 hora dos últimos dois anos. Cada vela fica com a data do dia de negociação (00h00 UTC).
const FXD=new Set(['EURUSD','GBPUSD','USDJPY','USDCAD']);
async function fxDaily(sym,dec,max){ const r=await chart(sym,'60m','730d'),k=10**dec,f=v=>Math.round(v*k)/k,by=new Map();
  r.t.forEach((t,i)=>{ const a=r.o[i],b=r.h[i],c=r.l[i],d=r.c[i]; if([a,b,c,d].some(v=>v==null||!isFinite(v))||d<=0) return; const key=nyDay(t); let x=by.get(key); if(!x) by.set(key,x={o:a,h:-Infinity,l:Infinity,c:d}); x.h=Math.max(x.h,a,b,c,d); x.l=Math.min(x.l,a,b,c,d); x.c=d; });
  const days=[...by.entries()].sort((x,y)=>x[0]-y[0]).slice(-max),o={t:[],o:[],h:[],l:[],c:[]}; for(const [d,x] of days){ o.t.push(d*86400); o.o.push(f(x.o)); o.h.push(f(x.h)); o.l.push(f(x.l)); o.c.push(f(x.c)); }
  if(o.t.length<5) throw new Error('poucas velas'); return o; }
// Volume nos câmbios: o mercado à vista não tem volume centralizado, por isso as colunas usam o volume dos futuros (CME; ICE no índice do dólar).
// CME: o contrato contínuo do Yahoo só tem volume fiável nas velas de 1 hora (nas diárias aparece o de contratos pouco negociados),
// por isso o volume diário e o semanal são a soma das horárias. ICE: não há contrato contínuo; juntam-se os contratos trimestrais que o Yahoo
// ainda guarda e, em cada dia, fica o mais negociado; os dias em que só há contratos pouco negociados ficam sem volume.
const FUT={EURUSD:['6E','.CME','CME'],GBPUSD:['6B','.CME','CME'],USDJPY:['6J','.CME','CME'],USDCAD:['6C','.CME','CME'],DXY:['DX','.NYB','ICE']};
async function futVolume(doc,[root,suf,ex]){ const day=new Map(); let hour=null,front=root+'=F';  // dia de negociação -> volume; hora -> volume; contrato para as velas intradiárias
  if(suf==='.CME'){ const r=await chart(front,'60m','730d'); hour=new Map(); r.t.forEach((t,i)=>{ const v=r.v[i]||0; if(!v) return; const d=nyDay(t),k=Math.floor(t/3600); day.set(d,(day.get(d)||0)+v); hour.set(k,(hour.get(k)||0)+v); }); }
  else { const yy=new Date().getUTCFullYear()%100,recent={},cut=Date.now()/1000-6*86400; front=null;
    for(let k=-3;k<=1;k++) for(const m of 'HMUZ'){ const c=root+m+String(yy+k).padStart(2,'0')+suf; try{ const r=await chart(c,'1d','10y'); r.t.forEach((t,i)=>{ const v=r.v[i]||0,d=Math.floor(t/86400); if(v>(day.get(d)||0)) day.set(d,v); if(t>cut) recent[c]=(recent[c]||0)+v; }); }catch(e){} await sleep(100); }
    const vals=[...day.values()].filter(Boolean).sort((a,b)=>a-b); if(!vals.length) return; const ref=vals[Math.floor(vals.length*.75)]; for(const [d,v] of day) if(v<ref*.12) day.delete(d);
    const best=Object.entries(recent).sort((a,b)=>b[1]-a[1])[0]; if(best&&best[1]>0) front=best[0]; }
  // dia de negociação de uma vela diária ou semanal: no Yahoo abre na véspera à noite (UTC); a última pode trazer a hora atual em vez da de abertura
  const dOf=(b,i)=>{ let t=b.t[i]; if(i&&t%900) t=b.t[i-1]+Math.floor((t-b.t[i-1])/86400)*86400; return Math.floor((t+6*3600)/86400); },today=Math.floor(Date.now()/864e5);
  if(doc.tf.d1){ const b=doc.tf.d1; b.v=b.t.map((_,i)=>day.get(dOf(b,i))||0); }
  if(doc.tf.w1){ const b=doc.tf.w1; b.v=b.t.map((_,i)=>{ const d0=dOf(b,i); let s=0,n=0; for(let k=0;k<7;k++){ const v=day.get(d0+k); if(v){ s+=v; n++; } } return n>=4||d0+7>today?s:0; }); }  // semanas com poucos dias conhecidos ficam de fora
  if(front) for(const [key,iv,rg,step] of [['m15','15m','5d',900],['h1','60m','1mo',3600]]){ const b=doc.tf[key]; if(!b) continue;
    try{ let m=key==='h1'&&hour; if(!m){ const r=await chart(front,iv,rg); m=new Map(); r.t.forEach((t,i)=>{ const k=Math.floor(t/step); m.set(k,(m.get(k)||0)+(r.v[i]||0)); }); await sleep(100); } b.v=b.t.map(t=>m.get(Math.floor(t/step))||0); }catch(e){} }
  let any=false; for(const b of Object.values(doc.tf)){ if(b.v&&b.v.some(Boolean)) any=true; else delete b.v; } if(any) doc.vol='futuros '+ex+' ('+root+')'; }
(async()=>{ fs.mkdirSync(path.join(out,'ohlc'),{recursive:true}); const ok=[],bad=[];
  for(const [id,sym] of Object.entries(SYM)){ const doc={sym,src:'Yahoo Finance',updatedAt:new Date().toISOString(),tf:{}};
    for(const [key,[iv,rg,max]] of Object.entries(TF)){ try{ doc.tf[key]=await bars(sym,iv,rg,max,DEC[id]??2); }catch(e){ bad.push(id+'/'+key+': '+e.message); } await new Promise(r=>setTimeout(r,120)); }
    if(FXD.has(id)){ try{ doc.tf.d1=await fxDaily(sym,DEC[id]??2,TF.d1[2]); }catch(e){ bad.push(id+'/d1 pelas horárias: '+e.message); } }
    if(FUT[id]&&Object.keys(doc.tf).length){ try{ await futVolume(doc,FUT[id]); }catch(e){ bad.push(id+'/volume: '+e.message); } }
    if(Object.keys(doc.tf).length){ fs.writeFileSync(path.join(out,'ohlc',id+'.json'),JSON.stringify(doc)); ok.push(id+' '+Object.entries(doc.tf).map(([k,v])=>k+':'+v.t.length).join(' ')+(doc.vol?'  volume: '+doc.vol:'')); } }
  console.log('OK '+ok.length+'\n'+ok.join('\n')); if(bad.length) console.log('FALHAS\n'+bad.join('\n')); })();
