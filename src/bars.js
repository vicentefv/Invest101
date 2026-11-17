// ================= Gráfico interativo com velas reais =================
// Lê a coleção "ohlc" (abertura, máximo, mínimo, fecho por intervalo de tempo, do Yahoo Finance; gravada por tools/fetch-ohlc.js).
// Um documento por mercado, pedido só quando a ficha desse mercado é aberta. Sem documento, o gráfico antigo (fechos diários) continua a funcionar.
const TFS={m15:{l:'15 minutos',s:900},h1:{l:'1 hora',s:3600},d1:{l:'1 dia',s:86400},w1:{l:'1 semana',s:604800}};
const oh={cache:{},n:0,off:0,key:'',drag:false};
const kr={on:false,cache:{},ext:0,key:'',raf:0,closing:false,fresh:false,zn:null};  // previsão Kronos: ver mais abaixo
st.tf=TFS[store('tf')]?store('tf'):'d1';
const fBarT=new Intl.DateTimeFormat('pt-PT',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',timeZone:TZ});
const fBarM=new Intl.DateTimeFormat('pt-PT',{month:'short',year:'2-digit',timeZone:TZ});
// sessões: a que zonas pertence cada vela dos gráficos de 15 minutos e 1 hora, pelo horário local de cada praça (o mesmo da linha do dia no painel).
// Ásia e América nunca coincidem, por isso partilham a primeira fila de etiquetas; a Europa fica na segunda.
const ZONES=[{k:'Ásia',a:'ÁS',col:'var(--s-asia)',lane:0,w:34,s:SESS[1]},{k:'Europa',a:'EU',col:'var(--s-eu)',lane:1,w:50,s:SESS[2]},{k:'América',a:'AM',col:'var(--s-us)',lane:0,w:56,s:SESS[3]}];
const zMemo=new Map();
function zoneMask(t){ let m=zMemo.get(t); if(m!==undefined) return m; m=0; ZONES.forEach((z,i)=>{ const p=tzParts(t*1000,z.s.tz),wd=new Date(Date.UTC(p.year,p.month-1,p.day)).getUTCDay(),h=p.hour+p.minute/60; if(wd>0&&wd<6&&h>=z.s.o&&h<z.s.c) m|=1<<i; }); if(zMemo.size>6000) zMemo.clear(); zMemo.set(t,m); return m; }
const zoneLine=t=>{ const m=zoneMask(t),n=ZONES.filter((z,i)=>m>>i&1).map(z=>z.k); return `<br><span style="opacity:.85">${n.length?'Sessão: '+n.join(' e '):'Fora das sessões principais'}</span>`; };
st.sess=store('sess')!==false;
const fVol=new Intl.NumberFormat('pt-PT',{notation:'compact',maximumFractionDigits:1});
const barLabel=(tf,t)=>tf==='w1'?fBarM.format(new Date(t*1000)):tf==='d1'?fShort.format(new Date(t*1000)):fBarT.format(new Date(t*1000));
const OSC=100;  // altura que o painel do oscilador acrescenta por baixo do gráfico (a do gráfico é chartH, em app2.js)
const setHid=(el,h)=>{ if(el.hidden!==h) el.hidden=h; };  // só escreve se mudar: os seletores com marca deslizante observam estes atributos
function ohLoad(id){ const c=oh.cache[id]; if(!st.db||(c&&(c.loading||Date.now()-c.at<5*60e3))) return; oh.cache[id]={doc:c?.doc||null,known:!!c?.known,at:Date.now(),loading:true};
  const done=doc=>{ oh.cache[id]={doc,known:true,at:Date.now(),loading:false}; if(st.asset===id&&st.view==='mercados'){ renderCmpBar(); drawChart(!c?.known); } };
  st.db.doc('ohlc/'+id).get().then(s=>done(s.exists?s.data():null)).catch(()=>done(c?.doc||null)); }
function barsFor(id){ const d=oh.cache[id]?.doc; if(!d||!d.tf) return null; const tf=d.tf[st.tf]?st.tf:d.tf.d1?'d1':Object.keys(d.tf)[0],b=d.tf[tf]; return b&&Array.isArray(b.t)&&b.t.length>=5?{tf,b,doc:d}:null; }
function chartUi(){ const cmp=st.cmpA.some(Boolean),B=!cmp&&barsFor(st.asset),d=oh.cache[st.asset]?.doc;
  setHid($('rng'),!!B); setHid($('tfSeg'),!B); $('ztool').hidden=!B; $('chartbox').classList.toggle('bars',!!B);
  if(B) $('tfSeg').querySelectorAll('button').forEach(x=>{ const dis=!(d.tf&&d.tf[x.dataset.tf]),on=String(x.dataset.tf===B.tf); if(x.disabled!==dis) x.disabled=dis; if(x.getAttribute('aria-pressed')!==on) x.setAttribute('aria-pressed',on); });
  $('ssSeg').hidden=!(B&&TFS[B.tf].s<86400); $('ssSeg').firstElementChild.setAttribute('aria-pressed',String(st.sess)); krUi(); indUi(); qrUi(B); if(!B) $('clg').innerHTML=''; }
// intervalos rápidos por baixo do gráfico (como nas plataformas de análise): quantas velas mostrar, a partir da mais recente
const QR={d1:[['1S',5],['1M',21],['3M',63],['6M',126],['1A',252]],h1:[['1D',24],['3D',72],['1S',120],['Tudo',400]],m15:[['1D',96],['2D',192],['Tudo',480]],w1:[['3M',13],['6M',26],['1A',52],['2A',104],['5A',260]]};
function qrUi(B){ const rb=$('rangebar'); setHid(rb,!B); if(!B) return; const q=$('qr'),key=B.tf;
  if(q.dataset.tf!==key){ q.dataset.tf=key; q.innerHTML=(QR[key]||[]).map(([l,n])=>`<button data-qn="${n}" aria-pressed="false">${l}</button>`).join(''); }
  q.querySelectorAll('button').forEach(x=>{ const on=String(Math.abs(oh.n-Math.min(+x.dataset.qn,B.b.t.length))<=1&&oh.off===0); if(x.getAttribute('aria-pressed')!==on) x.setAttribute('aria-pressed',on); }); }
$('qr').addEventListener('click',e=>{ const x=e.target.closest('button'); if(!x||!chartState?.bars) return; oh.n=clamp(+x.dataset.qn,15,Math.min(chartState.b.t.length,400)); oh.off=0; drawChart(false); });
{ const _c=renderCmpBar; renderCmpBar=function(){ _c(); chartUi(); }; }
{ const _l=drawChart; drawChart=function(animate){ const id=st.asset; ohLoad(id); if(kr.on) krLoad(id); const c=oh.cache[id];
    if(!st.cmpA.some(Boolean)){ const B=barsFor(id); if(B){ chartUi(); return drawBars(B,animate); }
      // primeira carga das velas: o aviso mantém-se enquanto o pedido estiver pendente (antes, qualquer redesenho a meio trocava-o pelo gráfico de fechos diários,
      // que depois dava lugar às velas: três estados seguidos). Se demorar mais de 4 s, mostra o gráfico de fechos diários enquanto espera.
      if(c&&c.loading&&!c.known&&Date.now()-c.at<4000){ chartUi(); if(!c.tm) c.tm=setTimeout(()=>{ if(st.asset===id&&st.view==='mercados'&&oh.cache[id]?.loading) drawChart(false); },4100); const svg=$('chart'),W=Math.max(300,$('chartbox').clientWidth),H=chartH(W); svg.setAttribute('height',H); svg.setAttribute('viewBox',`0 0 ${W} ${H}`); svg.innerHTML=`<text x="${W/2}" y="${H/2}" text-anchor="middle" style="fill:var(--muted)" font-size="13">A carregar as velas…</text>`; chartState=null; $('eLeg').hidden=true; $('stats').innerHTML=statBox('Variação na janela','<i class="sk" style="width:64px"></i>')+statBox('Máximo','<i class="sk" style="width:56px"></i>')+statBox('Mínimo','<i class="sk" style="width:56px"></i>')+statBox('Início da janela','<i class="sk" style="width:56px"></i>'); $('cNote').hidden=true; return; } }
    chartUi(); $('eLeg').hidden=false; _l(animate); }; }

function drawBars(B,animate){ const {tf,b,doc}=B,id=st.asset,I=indPrep(id,tf,b),svg=$('chart'),box=$('chartbox'),W=Math.max(300,box.clientWidth),zon=st.sess&&TFS[tf].s<86400,H=chartH(W)+(I.p?OSC:0),padL=8,padR=78,padT=zon?44:14,padB=30,y=isY(id),q=st.quotes[id],dec=y?3:qDec(q),ad=Math.min(dec,indFor(id)?4:3),len=b.t.length,candle=st.ctype==='candle';  // ad: casas decimais no eixo (os câmbios leem-se à quarta)
  const key=id+'|'+tf; if(oh.key!==key){ oh.key=key; oh.n=clamp((W-padL-padR)/8,40,180); oh.off=0; }
  oh.n=Math.round(clamp(oh.n,15,Math.min(len,400))); oh.off=Math.round(clamp(oh.off,0,len-oh.n));
  // previsão Kronos: o gráfico ganha "ext" lugares à direita das velas reais (cresce de 0 até fc.x durante a animação)
  // e aproxima-se das velas recentes, para a previsão ocupar perto de um quarto da largura
  const fc=kr.on?fcFor(id,tf,b):null; if(fc){ const k2=key+'|'+fc.doc.updatedAt; if(kr.key!==k2){ kr.key=k2; const nt=Math.max(15,Math.round(fc.x*3.2)); kr.zn=oh.off===0&&oh.n>nt?[oh.n,nt]:null; krPlay(fc.x,0,1200,()=>{ kr.fresh=true; },kr.zn); } } else kr.key='';
  const ext=fc?Math.min(kr.ext,fc.x):0,e0=len-oh.off,s=e0-oh.n,e=Math.min(len,Math.floor(e0+ext+1e-6)),n=oh.n,nv=n+ext,band=(W-padL-padR)/nv,bw=clamp(band*.64,1,26),X=i=>padL+band*(i-s+.5);
  svg.setAttribute('height',H); svg.setAttribute('viewBox',`0 0 ${W} ${H}`); if(!oh.drag&&!kr.raf) $('tip').style.opacity=0;
  const mas=[20,50].filter(N=>st.ma.has(N)).map(N=>{ const p=[]; let sum=0; for(let i=Math.max(0,s-N+1);i<e;i++){ sum+=b.c[i]; if(i-N>=Math.max(0,s-N+1)) sum-=b.c[i-N]; if(i>=s&&i-Math.max(0,s-N+1)>=N-1) p.push([i,sum/N]); } return {col:N===20?'var(--c1)':'var(--c2)',p}; });
  let mn=Infinity,mx=-Infinity; for(let i=s;i<e;i++){ const lo=candle?b.l[i]:b.c[i],hi=candle?b.h[i]:b.c[i]; if(lo<mn) mn=lo; if(hi>mx) mx=hi; } mas.forEach(a=>a.p.forEach(([,v])=>{ if(v<mn) mn=v; if(v>mx) mx=v; }));
  // a escala abre-se aos poucos para caber a previsão, em vez de saltar
  if(fc){ const f=fc.f,p=ext/fc.x,end=e0+fc.x; let a=Infinity,z=-Infinity; for(let j=0;j<fc.F&&fc.i0+1+j<end;j++){ a=Math.min(a,f.p10[j],candle?f.l[j]:f.c[j]); z=Math.max(z,f.p90[j],candle?f.h[j]:f.c[j]); }
    (f.ps||[]).forEach((v,k)=>{ if(fc.i0+1+k%fc.F<end){ if(v<a) a=v; if(v>z) z=v; } }); if(a<mn) mn+=(a-mn)*p; if(z>mx) mx+=(z-mx)*p; }
  indRange(I,s,e,(a,z)=>{ if(a<mn) mn=a; if(z>mx) mx=z; });
  // volume: colunas no fundo do gráfico, só em velas e só se o mercado tiver volume nesta janela; o preço fica com a altura que sobra
  let vmax=0; if(candle&&Array.isArray(b.v)) for(let i=s;i<e;i++) if(b.v[i]>vmax) vmax=b.v[i]; const volH=vmax>0?48:0,base=H-padB,vb=base-(I.p?OSC:0),pbot=vb-(volH?volH+6:0);  // com oscilador, o volume e o preço assentam acima do painel dele
  const pad=(mx-mn||mx*.01)*.08; mn-=pad; mx+=pad; const Y=v=>padT+(1-(v-mn)/(mx-mn))*(pbot-padT); let g=volH?`<line x1="${padL}" x2="${W-padR}" y1="${vb}" y2="${vb}" style="stroke:var(--line)"/>`:'';
  // etiquetas no eixo: último fecho e, com a previsão toda à vista, o fecho médio previsto (afastada da primeira se ficarem em cima uma da outra)
  const lc=b.c[e-1],ly=Y(lc); let kty=null; if(fc&&X(fc.i0+fc.F)<=W-padR+.5){ const fy=Y(fc.f.c[fc.F-1]); kty=clamp(fy,padT+9,pbot-9); if(Math.abs(kty-ly)<19) kty=clamp(ly+(fy>=ly?19:-19),padT+9,pbot-9); }
  for(let i=0;i<=4;i++){ const v=mn+(mx-mn)*i/4,yy=Y(v),hid=Math.abs(yy-ly)<14||kty!=null&&Math.abs(yy-kty)<14; g+=`<line x1="${padL}" x2="${W-padR}" y1="${yy.toFixed(1)}" y2="${yy.toFixed(1)}" style="stroke:var(--line)" stroke-dasharray="${i===0?'0':'1 4'}"/>`+(hid?'':`<text x="${W-padR+8}" y="${(yy+4).toFixed(1)}" font-size="11" style="fill:var(--muted);font-family:var(--f-data)">${nf(v,ad)}</text>`); }
  const tAt=k=>k<len?b.t[k]:fc?fc.f.t[k-fc.i0-1]:null,nT=Math.min(W<520?2:4,n-1);
  // sessões: uma faixa de cor por cada período seguido de velas dentro do horário da praça (as sobreposições misturam as cores),
  // com a etiqueta por cima do gráfico. Um salto grande entre velas (noite, fim de semana) fecha a faixa. Inclui as velas da previsão.
  let zs=''; if(zon){ const thr=TFS[tf].s*6,end=s+Math.ceil(nv-1e-6),ph=H-padT-padB;
    ZONES.forEach((z,zi)=>{ let a=-1,pt=0; const ly_=padT-34+z.lane*16,flush=j=>{ if(a<0) return; const x0=Math.max(padL,X(a)-band/2),x1=Math.min(W-padR,X(j)+band/2),w=x1-x0; a=-1; if(w<=0) return;
        zs+=`<rect x="${x0.toFixed(1)}" y="${padT}" width="${w.toFixed(1)}" height="${ph}" style="fill:${z.col}" opacity=".055"/><rect x="${(x0+1).toFixed(1)}" y="${ly_}" width="${Math.max(1,w-2).toFixed(1)}" height="14" rx="5" style="fill:${z.col}" opacity=".24"/>`+(X(a)-band/2>=padL-.5?`<line x1="${x0.toFixed(1)}" x2="${x0.toFixed(1)}" y1="${ly_}" y2="${H-padB}" style="stroke:${z.col}" stroke-dasharray="2 5" opacity=".4"/>`:"")+(w>=22?`<text x="${(x0+w/2).toFixed(1)}" y="${ly_+10.7}" text-anchor="middle" font-size="10.5" style="fill:color-mix(in srgb,${z.col} 62%,var(--ink));font-weight:600;letter-spacing:.04em">${w>=z.w?z.k:z.a}</text>`:''); };
      for(let i=s;i<end;i++){ const t=tAt(i); if(t==null){ flush(i-1); continue; } const on=zoneMask(t)>>zi&1; if(a>=0&&(!on||t-pt>thr)) flush(i-1); if(on&&a<0) a=i; pt=t; } flush(end-1); }); } for(let i=0;i<=nT;i++){ const k=s+Math.round(i*(nv-1)/nT),t=tAt(k); if(t!=null) g+=`<line x1="${X(k).toFixed(1)}" x2="${X(k).toFixed(1)}" y1="${padT}" y2="${pbot}" style="stroke:var(--line)" stroke-dasharray="1 4"/><text x="${X(k).toFixed(1)}" y="${H-padB+18}" font-size="11" text-anchor="${i===0?'start':i===nT?'end':'middle'}" style="fill:var(--muted)">${barLabel(tf,t)}</text>`; }
  let body='',pts=null; const up=b.c[e-1]>=b.o[s],colr=up?'var(--up)':'var(--down)';
  if(candle){ for(let i=s;i<e;i++){ const u=b.c[i]>=b.o[i],col=u?'var(--up)':'var(--down)',x=X(i),t=Y(Math.max(b.o[i],b.c[i])),hh=Math.max(1,Math.abs(Y(b.o[i])-Y(b.c[i])));
      body+=`<g class="cnd">${volH&&b.v[i]>0?`<rect x="${(x-bw/2).toFixed(1)}" y="${(vb-Math.max(1,b.v[i]/vmax*volH)).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(1,b.v[i]/vmax*volH).toFixed(1)}" style="fill:${col}" opacity=".36"/>`:''}<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${Y(b.h[i]).toFixed(1)}" y2="${Y(b.l[i]).toFixed(1)}" style="stroke:${col}" stroke-width="${bw<4?1:1.2}"/><rect x="${(x-bw/2).toFixed(1)}" y="${t.toFixed(1)}" width="${bw.toFixed(1)}" height="${hh.toFixed(1)}" rx="${bw>6?1.5:0}" style="fill:${col}"/></g>`; } }
  else { pts=[]; for(let i=s;i<e;i++) pts.push([X(i),Y(b.c[i])]); const line='M'+pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join('L');
    body=`<defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:${colr}" stop-opacity=".18"/><stop offset="1" style="stop-color:${colr}" stop-opacity="0"/></linearGradient></defs><path d="${line}L${pts[pts.length-1][0].toFixed(1)},${H-padB}L${pts[0][0].toFixed(1)},${H-padB}Z" fill="url(#cg)"/><path d="${line}" id="cline" fill="none" style="stroke:${colr};filter:drop-shadow(0 0 6px ${colr})" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`; }
  const maP=mas.map(a=>a.p.length>1?`<path d="M${a.p.map(([i,v])=>X(i).toFixed(1)+','+Y(v).toFixed(1)).join('L')}" fill="none" style="stroke:${a.col}" stroke-width="1.4" stroke-linejoin="round"/>`:'').join('');
  // último fecho visível: linha tracejada e etiqueta no eixo
  const lcol=lc>=(b.c[e-2]??lc)?'var(--up)':'var(--down)';
  const cdEnd=b.t[len-1]*1000+TFS[tf].s*1000,cdOn=e===len&&TFS[tf].s<86400&&cdEnd>Date.now()&&Date.now()-b.t[len-1]*1000<TFS[tf].s*1500;
  const tag=`<line x1="${padL}" x2="${W-padR}" y1="${ly.toFixed(1)}" y2="${ly.toFixed(1)}" style="stroke:${lcol}" stroke-dasharray="1 4" opacity=".7"/><rect x="${W-padR+3}" y="${(ly-9).toFixed(1)}" width="${padR-5}" height="${cdOn?34:18}" rx="3" style="fill:${lcol}"/><text x="${W-padR+8}" y="${(ly+4).toFixed(1)}" font-size="11" style="fill:var(--on-accent);font-family:var(--f-data);font-weight:500">${nf(lc,ad)}</text>${cdOn?`<text id="lpcd" data-end="${cdEnd}" x="${W-padR+8}" y="${(ly+17).toFixed(1)}" font-size="10" style="fill:var(--on-accent);font-family:var(--f-data);opacity:.85"></text>`:''}`;
  // previsão: faixas de 80% e 50% das trajetórias por baixo das velas; trajetórias soltas, velas médias e linha média por cima. O recorte esconde o que ainda não coube.
  let kUnder='',kOver='',ftag=''; if(fc){ const f=fc.f,F=fc.F,xi=j=>X(fc.i0+1+j),idx=[...Array(F).keys()],A=X(fc.i0).toFixed(1)+','+Y(f.c0).toFixed(1),P=(a,j)=>xi(j).toFixed(1)+','+Y(a[j]).toFixed(1),dx=X(fc.i0)+band/2;
    const cone=(lo,hi,op)=>`<path d="M${A}L${idx.map(j=>P(hi,j)).join('L')}L${idx.slice().reverse().map(j=>P(lo,j)).join('L')}Z" style="fill:var(--accent-2)" opacity="${op}"/>`;
    kUnder=`<clipPath id="kclip"><rect x="${padL}" y="0" width="${W-padL-padR}" height="${H}"/></clipPath><g clip-path="url(#kclip)"><rect x="${dx.toFixed(1)}" y="${padT}" width="${Math.max(0,W-padR-dx).toFixed(1)}" height="${H-padT-padB}" style="fill:var(--accent-2)" opacity=".035"/>${cone(f.p10,f.p90,.1)}${cone(f.p25,f.p75,.14)}<line x1="${dx.toFixed(1)}" x2="${dx.toFixed(1)}" y1="${padT}" y2="${H-padB}" style="stroke:var(--accent-2)" stroke-dasharray="2 5" opacity=".55"/>${ext*band>96?`<text x="${(dx+7).toFixed(1)}" y="${padT+11}" font-size="10.5" style="fill:var(--accent-2);font-weight:600;letter-spacing:.07em">PREVISÃO</text>`:''}</g>`;
    const np=Array.isArray(f.ps)&&f.ps.length===(f.np|0)*F?f.np|0:0,gh=kr.raf?'':Array.from({length:np},(_,k)=>`<path class="kgh" d="M${A}L${idx.map(j=>xi(j).toFixed(1)+','+Y(f.ps[k*F+j]).toFixed(1)).join('L')}" fill="none" style="stroke:var(--accent-2)" stroke-width="1" stroke-linejoin="round" opacity=".3"/>`).join('');
    const kc=candle?idx.map(j=>{ const col=f.c[j]>=f.o[j]?'var(--up)':'var(--down)',x=xi(j),t=Y(Math.max(f.o[j],f.c[j])),hh=Math.max(1,Math.abs(Y(f.o[j])-Y(f.c[j]))); return `<g class="kcn" opacity=".5"><line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${Y(f.h[j]).toFixed(1)}" y2="${Y(f.l[j]).toFixed(1)}" style="stroke:${col}" stroke-width="${bw<4?1:1.2}"/><rect x="${(x-bw/2).toFixed(1)}" y="${t.toFixed(1)}" width="${bw.toFixed(1)}" height="${hh.toFixed(1)}" rx="${bw>6?1.5:0}" style="fill:${col}"/></g>`; }).join(''):'';
    const lx=xi(F-1),fy=Y(f.c[F-1]),vis=lx<=W-padR+.5;
    kOver=`<g clip-path="url(#kclip)">${gh}${kc}<path d="M${A}L${idx.map(j=>P(f.c,j)).join('L')}" fill="none" style="stroke:var(--accent-2);filter:drop-shadow(0 0 6px var(--accent-2))" stroke-width="${candle?1.6:2}" stroke-dasharray="6 4" stroke-linejoin="round" stroke-linecap="round"/>${vis?`<circle cx="${lx.toFixed(1)}" cy="${fy.toFixed(1)}" r="7" style="fill:var(--accent-2)" opacity=".22"/><circle cx="${lx.toFixed(1)}" cy="${fy.toFixed(1)}" r="3.5" style="fill:var(--accent-2)"/>`:''}</g>`;
    if(kty!=null){ const ty=kty;
      ftag=`<g class="ktag"><rect x="${W-padR+3}" y="${(ty-9).toFixed(1)}" width="${padR-5}" height="18" rx="4" style="fill:var(--accent-2)"/><text x="${W-padR+8}" y="${(ty+4).toFixed(1)}" font-size="11" style="fill:var(--on-accent);font-family:var(--f-data);font-weight:500">${nf(f.c[F-1],ad)}</text></g>`; } }
  const iv=indSvg(I,{b,s,e,X,Y,W,padL,padR,padT,band,bw,pbot,ptop:base-OSC+14,ph:OSC-14,dec,ad});
  // eventos de alto impacto, na vela em que caíram
  const label=nameOf(id),dur=TFS[tf].s,at=ts=>{ if(tf==='d1'||tf==='w1'){ const d=fISO.format(new Date(ts*1000)),k=tf==='w1'?weekStart(d):d; for(let i=e-1;i>=s;i--){ const bd=fISO.format(new Date(b.t[i]*1000)); if((tf==='w1'?weekStart(bd):bd)===k) return i; if(bd<k) break; } return -1; }
      let lo=s,hi=e-1; if(ts<b.t[lo]||ts>b.t[hi]+dur*1.5) return -1; while(lo<hi){ const m=(lo+hi+1)>>1; if(b.t[m]<=ts) lo=m; else hi=m-1; } return ts-b.t[lo]<dur*1.5?lo:Math.min(lo+1,e-1); };
  let mk=''; st.items.filter(it=>it.imp>=3&&it.ts<=Date.now()+dur*1000).forEach(it=>{ const i=at(it.ts/1000); if(i<0) return; const ef=effects(it).list.find(z=>z.l===label); if(!ef) return; const d=direction(it),col=it.a==null?'var(--warn)':d&&d.d?(ef.v*d.d>0?'var(--up)':'var(--down)'):'var(--flat)';
    mk+=`<circle class="evdot" data-ev="${esc(it.id)}" cx="${X(i).toFixed(1)}" cy="${(vb-7).toFixed(1)}" r="4.5" style="fill:${col};stroke:var(--surface)" stroke-width="2"><title>${esc(it.cur+' · '+it.n)}</title></circle>`; });
  svg.innerHTML=zs+g+`<rect id="chl" y="${padT}" width="${Math.max(band,1).toFixed(1)}" height="${H-padT-padB}" style="fill:var(--ink)" opacity="0"/>`+kUnder+body+maP+iv.over+kOver+tag+ftag+iv.pane+`<circle id="xd" r="4.5" style="fill:var(--surface);stroke:${colr}" stroke-width="2.5" opacity="0"/><g id="cx" opacity="0" pointer-events="none"><line id="cxv" y1="${padT}" y2="${H-padB}" style="stroke:var(--muted)" stroke-dasharray="3 3"/><line id="cxh" x1="${padL}" x2="${W-padR}" style="stroke:var(--muted)" stroke-dasharray="3 3"/><rect id="cxp" x="${W-padR+1}" width="${padR-3}" height="18" rx="3" style="fill:var(--ink)"/><text id="cxpt" x="${W-padR+6}" font-size="10.5" style="fill:var(--bg);font-family:var(--f-data)"></text><rect id="cxt" y="${H-padB+2}" height="18" rx="3" style="fill:var(--ink)"/><text id="cxtt" y="${H-padB+14.5}" font-size="10.5" text-anchor="middle" style="fill:var(--bg);font-family:var(--f-body)"></text></g><rect id="hit" x="${padL}" y="${padT}" width="${W-padL-padR}" height="${H-padT-padB-14}" fill="transparent"/>`+mk;
  chartState={bars:true,candle,b,s,e,n,band,X,Y,W,H,padL,padR,padT,padB,pbot,mn,mx,dec,y,tf,pts,fc,zon,vol:doc.vol,I,mal:mas.map((a,k)=>({n:[20,50].filter(N=>st.ma.has(N))[k],col:a.col,m:new Map(a.p)}))};
  clgSet(null);
  // a previsão acabou de se estender: as trajetórias soltas acendem uma a uma e a etiqueta do valor final entra
  if(fc&&kr.fresh){ kr.fresh=false; if(!reduced()){ svg.querySelectorAll('.kgh').forEach((p,i)=>p.animate([{opacity:0},{opacity:.3}],{duration:520,delay:i*70,easing:'ease-out',fill:'backwards'})); svg.querySelector('.ktag')?.animate([{opacity:0,transform:'translateX(8px)'},{opacity:1,transform:'none'}],{duration:320,easing:'cubic-bezier(.23,1,.32,1)'}); } }
  let hi=-Infinity,lo=Infinity; for(let i=s;i<e;i++){ if(b.h[i]>hi) hi=b.h[i]; if(b.l[i]<lo) lo=b.l[i]; } const v0=b.o[s],d4=Math.min(dec,4),cn=$('cNote'),kd=kr.cache[id]; cn.hidden=false; $('kLeg').hidden=!fc; $('vLeg').hidden=!volH; $('vLeg').lastChild.textContent=doc.vol?'Volume dos '+doc.vol:'Volume de cada vela'; $('sLeg').hidden=!zon; $('eLeg').hidden=!mk; $('iLeg').innerHTML=indLegend(I);
  if(fc){ const f=fc.f,F=fc.F,last=f.c[F-1],ch=y?(last-f.c0)*100:(last/f.c0-1)*100;
    // fiabilidade medida no backtest (tools/kronos-backtest.py): sem vantagem sobre "o preço fica igual", a linha média encolhe para o preço atual e o cone mostra só a incerteza do mercado
    const bt=f.bt,hasBt=!!bt&&bt.n>0,rel=hasBt&&f.lam>=.15&&bt.hit>=.55&&bt.skill>0,fl=$('kFlag'); if(fl) fl.textContent=hasBt&&!rel?' · sem vantagem estatística medida':'';
    $('stats').innerHTML=statBox('Fecho médio previsto',nf(last,d4),(y?sg(ch,0,' pb'):sg(ch,2,'%'))+' até '+barLabel(tf,f.t[F-1]),dc(ch))+statBox('Onde caem 80%',nf(f.p10[F-1],d4)+' a '+nf(f.p90[F-1],d4),'cone calibrado com o backtest')+statBox('Trajetórias em alta',nf(f.up*100,0)+'%',`de ${fc.doc.n} simuladas`,f.up>.55?'up':f.up<.45?'down':'')+statBox('Fiabilidade medida',hasBt?nf(bt.hit*100,0)+'% de acerto':'n/d',hasBt?`em ${bt.n} testes passados${rel?'':'; 50% é cara ou coroa'}`:'ainda sem backtest',rel?'up':'');
    cn.textContent=`Previsão do modelo Kronos (${fc.doc.model}), calculada ${ago(fc.doc.updatedAt)} com ${fc.doc.n} trajetórias simuladas sobre as velas do Yahoo Finance.`+(hasBt?` Em ${bt.n} testes sobre dados passados, este modelo ${rel?'mostrou alguma vantagem':'não mostrou vantagem sobre "o preço fica igual"'}: por isso a linha média aproveita só ${Math.round((f.lam||0)*100)}% do que o modelo aponta e o cone mostra a incerteza normal deste mercado.`:'')+' O modelo só vê o padrão das velas: não conhece notícias nem o calendário económico. Não é aconselhamento financeiro.'; return; }
  $('stats').innerHTML=statBox('Variação na janela',y?sg((lc-v0)*100,0,' pb'):sg((lc/v0-1)*100,2,'%'),`${n} velas de ${TFS[tf].l}`,dc(lc-v0))+statBox('Máximo',nf(hi,d4))+statBox('Mínimo',nf(lo,d4))+statBox('Início da janela',nf(v0,d4),barLabel(tf,b.t[s]));
  // letra pequena: primeiro o aviso de previsão em falta (se o botão está ligado), depois a origem e a frescura dos dados; como andar no gráfico está na ajuda (?)
  cn.innerHTML=(kr.on&&kd?.known&&!kd.loading?'<b>Ainda não há previsão Kronos atual para este ativo em velas de '+TFS[tf].l+'.</b> ':'')+esc(`Velas de ${TFS[tf].l} do Yahoo Finance, atualizadas ${ago(doc.updatedAt)}. Não são em tempo real.`+(candle&&!volH?' Sem volume para este mercado neste intervalo.':'')+(volH&&doc.vol?` As colunas mostram os contratos dos ${doc.vol}: o câmbio à vista não tem volume centralizado.`+(tf==='w1'||TFS[tf].s>=86400&&/ICE/.test(doc.vol)?' Há períodos sem colunas porque o Yahoo não guarda todos os contratos antigos.':''):''));
}
// legenda por cima do gráfico: abertura, máximo, mínimo e fecho da vela sob o cursor (ou da última), mais o que as camadas ligadas valem nessa vela
function clgSet(i,fj){ const el=$('clg'),c=chartState; if(!el) return; if(!c?.bars){ el.innerHTML=''; return; }
  el.style.top=(c.zon?c.padT+4:6)+'px'; const {b,e,tf,candle,y,dec,vol,zon,I,mal,fc}=c,f=v=>y?nf(v,3)+'%':nf(v,Math.min(dec,4)),id=st.asset;
  if(fj!=null&&fc){ const k=fc.f,ch=y?(k.c[fj]-k.c0)*100:(k.c[fj]/k.c0-1)*100;
    el.innerHTML=`<div class="l1"><b>${esc(nameOf(id))}</b><em>${barLabel(tf,k.t[fj])} · previsão</em><span><i>Fecho médio</i>${f(k.c[fj])}</span><span class="${dc(ch)}">${sg(ch,y?0:2,y?' pb':'%')}</span><span><i>80% entre</i>${f(k.p10[fj])} e ${f(k.p90[fj])}</span></div>`+(zon?`<div class="l2">${zoneLine(k.t[fj]).replace(/^<br>/,'')}</div>`:''); return; }
  i=i==null?e-1:i; const pc=i>0?b.c[i-1]:b.o[i],ch=y?(b.c[i]-pc)*100:(b.c[i]/pc-1)*100;
  const l2=[]; mal.forEach(a=>{ const v=a.m.get(i); if(v!=null) l2.push(`<span><i style="--sw:${a.col}"></i>MM${a.n} ${f(v)}</span>`); });
  if(candle&&b.v?.[i]>0) l2.push(`<span>Vol. ${vol?'(futuros) ':''}${fVol.format(b.v[i])}</span>`);
  const it=indTip(I,i).replace(/^<br>/,''); if(it) l2.push(it); if(zon) l2.push(zoneLine(b.t[i]).replace(/^<br>/,''));
  const dk=dc(b.c[i]-b.o[i]);
  el.innerHTML=`<div class="l1"><b>${esc(nameOf(id))}</b><em>${TFS[tf].l} · ${barLabel(tf,b.t[i])}</em>`+(candle?`<span class="${dk}"><i>A</i>${f(b.o[i])}</span><span class="${dk}"><i>Máx</i>${f(b.h[i])}</span><span class="${dk}"><i>Mín</i>${f(b.l[i])}</span>`:'')+`<span class="${dk}"><i>F</i>${f(b.c[i])}</span><span class="${dc(ch)}">${sg(ch,y?0:2,y?' pb':'%')}</span></div>`+(l2.length?`<div class="l2">${l2.join('')}</div>`:''); }
function barsMove(ev){ if(oh.drag||kr.raf) return; const {b,s,e,band,X,Y,W,H,padL,padR,padT,padB,pbot,mn,mx,dec,y,tf,candle,fc}=chartState,svg=$('chart'),r=svg.getBoundingClientRect(),x=(ev.clientX-r.left)*(W/r.width),py=(ev.clientY-r.top)*(H/r.height),iv=s+Math.floor((x-padL)/band),i=Math.round(clamp(iv,s,e-1));
  const hl=$('chl'),xd=$('xd'); let xx,lab,yy=null;
  if(fc&&iv>=b.t.length){ const k=fc.f,j=Math.round(clamp(iv-fc.i0-1,0,fc.F-1)); xx=X(fc.i0+1+j); lab=barLabel(tf,k.t[j]); yy=Y(k.c[j]); xd.setAttribute('cx',xx); xd.setAttribute('cy',yy); xd.setAttribute('opacity',1); clgSet(null,j); }
  else { xx=X(i); lab=barLabel(tf,b.t[i]); if(!candle){ yy=Y(b.c[i]); xd.setAttribute('cx',xx); xd.setAttribute('cy',yy); xd.setAttribute('opacity',1); } else xd.setAttribute('opacity',0); clgSet(i); }
  hl.setAttribute('x',(xx-band/2).toFixed(1)); hl.setAttribute('opacity',.05);
  // cruz com etiquetas nos eixos; a linha horizontal segue o rato dentro da zona de preço
  const cx=$('cx'),inP=py>=padT&&py<=pbot,v=mn+(1-(clamp(py,padT,pbot)-padT)/(pbot-padT))*(mx-mn),py_=clamp(py,padT+9,pbot-9),ad=Math.min(dec,y?3:(indFor(st.asset)?4:3));
  cx.setAttribute('opacity',1); $('cxv').setAttribute('x1',xx.toFixed(1)); $('cxv').setAttribute('x2',xx.toFixed(1));
  const hh=$('cxh'),pp=$('cxp'),pt=$('cxpt'); [hh,pp,pt].forEach(n=>n.setAttribute('opacity',inP?1:0));
  if(inP){ hh.setAttribute('y1',py.toFixed(1)); hh.setAttribute('y2',py.toFixed(1)); pp.setAttribute('y',(py_-9).toFixed(1)); pt.setAttribute('y',(py_+3.6).toFixed(1)); pt.textContent=nf(v,ad); }
  const tt=$('cxtt'),tr=$('cxt'); tt.textContent=lab; const tw=lab.length*5.6+14,tx=clamp(xx,padL+tw/2,W-padR-tw/2); tt.setAttribute('x',tx.toFixed(1)); tr.setAttribute('x',(tx-tw/2).toFixed(1)); tr.setAttribute('width',tw.toFixed(1)); }

// ---------- Previsão Kronos ----------
// Lê a coleção "kronos" (gravada por tools/kronos-forecast.py): por mercado e intervalo de velas, a média de várias trajetórias
// simuladas pelo modelo Kronos, os percentis dos fechos e algumas trajetórias soltas. O botão por cima do gráfico liga o modo
// e o gráfico estende-se para a direita com a previsão; fica ligado ao trocar de ativo, até se desligar.
function krLoad(id){ const c=kr.cache[id]; if(!st.db||(c&&(c.loading||Date.now()-c.at<5*60e3))) return; kr.cache[id]={doc:c?.doc||null,known:!!c?.known,at:Date.now(),loading:true};
  const done=doc=>{ kr.cache[id]={doc,known:true,at:Date.now(),loading:false}; if(st.asset===id&&st.view==='mercados'&&kr.on) drawChart(false); };
  st.db.doc('kronos/'+id).get().then(s=>done(s.exists?s.data():null)).catch(()=>done(c?.doc||null)); }
// previsão para as velas no ecrã. i0 é a vela de onde partiu (a seguir à penúltima de então, cuja hora já não muda) e x o número de velas ainda por acontecer;
// devolve null se não houver previsão ou se já tiver passado toda.
function fcFor(id,tf,b){ const d=kr.cache[id]?.doc,f=d?.tf?.[tf]; if(!f||!Array.isArray(f.t)||!['o','h','l','c','p10','p25','p75','p90'].every(k=>Array.isArray(f[k])&&f[k].length===f.t.length)||f.t.length<2) return null;
  const len=b.t.length,F=f.t.length; let i0=-1; for(let i=len-2;i>=0&&b.t[i]>=f.tp;i--) if(b.t[i]===f.tp){ i0=i+1; break; }
  const x=i0+1+F-len; return i0<0||x<1?null:{f,i0,F,x,doc:d}; }
// anima o número de lugares da previsão de 'from' até 'to' e, se vier zn=[de,para], o número de velas reais à vista
function krPlay(to,from,dur,done,zn){ cancelAnimationFrame(kr.raf); kr.raf=0; if(reduced()){ kr.ext=to; if(zn) oh.n=zn[1]; done?.(); return; } kr.ext=from; const t0=performance.now();
  const step=t=>{ const k=Math.min(1,(t-t0)/dur),q=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2; kr.ext=from+(to-from)*q; if(zn) oh.n=zn[0]+(zn[1]-zn[0])*q; if(k<1) kr.raf=requestAnimationFrame(step); else { kr.raf=0; kr.ext=to; done?.(); } drawChart(false); };
  kr.raf=requestAnimationFrame(step); }
function krUi(){ const btn=$('kBtn'),c=kr.cache[st.asset]; btn.hidden=!$('chartbox').classList.contains('bars'); btn.setAttribute('aria-pressed',String(kr.on&&!kr.closing)); btn.classList.toggle('busy',kr.on&&!!c?.loading&&!c.known); if(btn.hidden){ $('kLeg').hidden=true; $('vLeg').hidden=true; $('sLeg').hidden=true; } }
$('ssSeg').addEventListener('click',()=>{ st.sess=!st.sess; store('sess',st.sess); renderCmpBar(); drawChart(false); });
$('kBtn').addEventListener('click',()=>{ if(!kr.on){ kr.on=true; kr.key=''; drawChart(false); return; } if(kr.closing) return;
  const off=()=>{ kr.on=false; kr.closing=false; kr.key=''; kr.ext=0; }; if(kr.ext>0&&chartState?.fc&&!reduced()){ kr.closing=true; krPlay(0,kr.ext,420,off,kr.zn&&oh.n===kr.zn[1]&&oh.off===0?[kr.zn[1],kr.zn[0]]:null); krUi(); } else { cancelAnimationFrame(kr.raf); kr.raf=0; off(); drawChart(false); } });

// ---------- interação: arrastar recua no tempo, roda do rato e botões fazem zoom, dois dedos no toque ----------
{ const cb=$('chartbox'); cb.tabIndex=0; cb.setAttribute('aria-label','Gráfico interativo. Setas para andar no tempo, mais e menos para o zoom.');
  let rq=0; const redraw=()=>{ if(!rq) rq=requestAnimationFrame(()=>{ rq=0; drawChart(false); }); };
  const frac=cx=>{ const r=$('chart').getBoundingClientRect(),c=chartState; return clamp(((cx-r.left)*(c.W/r.width)-c.padL)/(c.W-c.padL-c.padR),0,1); };
  const zoom=(f,fr=1)=>{ const c=chartState; if(!c?.bars) return; const len=c.b.t.length,nn=Math.round(clamp(c.n*f,15,Math.min(len,400))); if(nn===c.n) return; const anchor=c.s+fr*c.n,ns=Math.round(anchor-fr*nn); oh.n=nn; oh.off=len-(ns+nn); redraw(); };
  const pan=d=>{ if(!chartState?.bars) return; oh.off+=d; redraw(); };
  cb.addEventListener('wheel',e=>{ if(!chartState?.bars) return; e.preventDefault(); if(e.shiftKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)) pan(-Math.sign(e.deltaX||e.deltaY)*Math.max(1,Math.round(oh.n*.06))); else zoom(e.deltaY>0?1.16:1/1.16,frac(e.clientX)); },{passive:false});
  const ptr=new Map(); let d0=null,p0=null;
  cb.addEventListener('pointerdown',e=>{ if(!chartState?.bars||e.target.closest('.evdot')) return; ptr.set(e.pointerId,e.clientX); if(ptr.size===1) d0={x:e.clientX,off:oh.off,moved:false}; if(ptr.size===2){ const xs=[...ptr.values()]; p0={d:Math.abs(xs[0]-xs[1])||1,n:oh.n}; d0=null; } });
  cb.addEventListener('pointermove',e=>{ if(!ptr.has(e.pointerId)||!chartState?.bars) return; ptr.set(e.pointerId,e.clientX);
    if(ptr.size===2&&p0){ const xs=[...ptr.values()],len=chartState.b.t.length; oh.drag=true; oh.n=clamp(p0.n*p0.d/(Math.abs(xs[0]-xs[1])||1),15,Math.min(len,400)); redraw(); return; }
    if(d0){ const dx=e.clientX-d0.x; if(!d0.moved&&Math.abs(dx)<4) return; if(!d0.moved){ d0.moved=true; oh.drag=true; cb.classList.add('dragging'); try{ cb.setPointerCapture(e.pointerId); }catch(err){} $('tip').style.opacity=0; }
      const r=$('chart').getBoundingClientRect(); oh.off=d0.off+Math.round(dx*(chartState.W/r.width)/chartState.band); redraw(); } });
  const end=e=>{ ptr.delete(e.pointerId); if(ptr.size<2) p0=null; if(!ptr.size){ d0=null; cb.classList.remove('dragging'); setTimeout(()=>{ oh.drag=false; },0); } };
  cb.addEventListener('pointerup',end); cb.addEventListener('pointercancel',end);
  cb.addEventListener('click',e=>{ if(oh.drag){ e.stopPropagation(); e.preventDefault(); } },true);
  cb.addEventListener('keydown',e=>{ if(!chartState?.bars) return; const st_=Math.max(1,Math.round(oh.n*.1)),k=e.key; if(k==='ArrowLeft') pan(st_); else if(k==='ArrowRight') pan(-st_); else if(k==='+'||k==='=') zoom(.8); else if(k==='-') zoom(1.25); else if(k==='Home') pan(1e6); else if(k==='End') pan(-1e6); else return; e.preventDefault(); });
  $('ztool').addEventListener('click',e=>{ const z=e.target.closest('[data-z]')?.dataset.z; if(!z) return; const st_=Math.max(1,Math.round(oh.n*.25)); if(z==='in') zoom(.75); else if(z==='out') zoom(1.33); else if(z==='left') pan(st_); else if(z==='right') pan(-st_); else if(z==='end'){ oh.off=0; redraw(); } });
  $('tfSeg').addEventListener('click',e=>{ const x=e.target.closest('button'); if(!x||x.disabled) return; st.tf=x.dataset.tf; store('tf',st.tf); renderCmpBar(); drawChart(true); });
}

// contagem decrescente na etiqueta do último preço
setInterval(()=>{ const el=$('lpcd'); if(!el) return; const r=Math.max(0,Math.round((+el.dataset.end-Date.now())/1000)),h=Math.floor(r/3600),m=Math.floor(r%3600/60),x=r%60,p=n=>String(n).padStart(2,'0'); el.textContent=(h?p(h)+':':'')+p(m)+':'+p(x); },1000);
