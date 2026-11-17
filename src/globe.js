// ================= Globo: de onde são os ativos (canvas 2D, projeção ortográfica d3-geo) =================
// Dados em globe-core.js; geografia (Natural Earth 110m) em globe-data.js. Os ativos "saem" de cada local em leque,
// como fichas DOM (clicáveis) por cima do canvas; clicar numa ficha abre a vista geral do ativo no painel lateral.
const gl={cv:null,ctx:null,w:0,h:0,dpr:1,rot:[-8,-26],zoom:1,zt:1,vel:[0,0],layer:'mk',sel:null,asset:null,drag:null,fly:null,vis:false,raf:0,last:0,idle:0,pins:[],hover:null,land:null,borders:null,grid:null,ready:false,bound:false,chips:[],built:'',swapT:0};
const GL_CLS={'Ações':'red','Obrigações':'yellow','Forex':'green','Matérias-primas':'ink','Cripto':'blue'};
const GL_INK='#16120E',GL_PAPER='#FFFAEB';
const GL_ETF_SHORT={'IE00B5BMR087':'iShares','IE00BFMXXD54':'Vanguard','VOO':'VOO','SPY':'SPY'};
const glRM=()=>reduced();
const glQ=id=>(typeof st!=='undefined'&&st.quotes&&st.quotes[id])||null;
const glCls=id=>{ const q=glQ(id); return q?q.cls:'Ações'; };

function glColors(){ const cs=getComputedStyle(document.documentElement),g=n=>cs.getPropertyValue(n).trim();
  return {ink:GL_INK,paper:g('--surface')||GL_PAPER,blue:g('--blue'),yellow:g('--yellow'),red:g('--red'),green:g('--green')}; }

function glInit(){
  if(gl.ready||typeof d3==='undefined'||typeof topojson==='undefined'||typeof GLOBE_LAND==='undefined') return gl.ready;
  gl.cv=$('glCv'); if(!gl.cv) return false; gl.ctx=gl.cv.getContext('2d');
  gl.land=topojson.feature(GLOBE_LAND,GLOBE_LAND.objects.land);
  gl.borders=topojson.mesh(GLOBE_COUNTRIES,GLOBE_COUNTRIES.objects.countries,(a,b)=>a!==b);
  gl.grid=d3.geoGraticule10(); gl.ready=true; return true;
}
function glResize(){
  const s=$('glStage'); if(!s||!gl.cv) return; const w=s.clientWidth,h=s.clientHeight||w; if(!w) return;
  gl.dpr=Math.min(window.devicePixelRatio||1,2); gl.w=w; gl.h=h; gl.cv.width=Math.round(w*gl.dpr); gl.cv.height=Math.round(h*gl.dpr); gl.ctx.setTransform(gl.dpr,0,0,gl.dpr,0,0);
  gl.chips.forEach(c=>{ c.w=0; }); glKick();
}

// ---------- fichas (DOM) ----------
function glItems(){
  if(gl.layer==='mk') return GLOBE_PLACES.flatMap(p=>p.assets.map(id=>({key:'a:'+id,id,label:GLOBE_SHORT[id]||id,cls:glCls(id),place:p.id,kind:'asset'}))).concat(GLOBE_SATS.map(s=>({key:'s:'+s.id,id:s.id,label:GLOBE_SHORT[s.id]||s.id,cls:'Cripto',place:null,kind:'sat'})));
  return GLOBE_ETF.flatMap(p=>p.rows.map((r,i)=>({key:'e:'+p.id+':'+i,id:r.isin||r.name,label:GL_ETF_SHORT[r.isin||r.name]||r.name,cls:r.ok?'Forex':'Ações',ok:r.ok,place:p.id,kind:'etf'})));
}
function glBuildChips(){
  const box=$('glChips'); if(!box) return; const items=glItems(),sig=gl.layer+'|'+items.length;
  if(gl.built===sig) { glChipData(); return; } gl.built=sig;
  box.innerHTML=items.map(it=>`<button class="gl-chip mc-${GL_CLS[it.cls]||'ink'}${it.kind==='etf'&&!it.ok?' no':''}" data-key="${it.key}" type="button"><span class="gl-cin"><i class="gl-d"></i><b>${esc(it.label)}</b></span></button>`).join('');
  gl.chips=items.map((it,i)=>Object.assign(it,{el:box.children[i],w:0,h:26,x:0,y:0,shown:false,idx:0}));
  glChipData();
}
function glChipData(){ // preço e variação nos rótulos acessíveis e a cor do contorno
  gl.chips.forEach(c=>{ const q=c.kind==='etf'?null:glQ(c.id); let aria=c.label; if(q){ const f=fmtQ(q); aria=`${nameOf(c.id)}: ${f.p}, ${f.c}`; c.el.classList.toggle('up',dc(f.v)==='up'); c.el.classList.toggle('down',dc(f.v)==='down'); } else if(c.kind==='etf'){ aria=c.label+(c.ok?' (compra-se em Portugal)':' (não se compra em Portugal)'); }
    c.el.setAttribute('aria-label',aria); });
}

// ---------- desenho ----------
function glRound(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function glDraw(now){
  const {ctx,w,h}=gl; if(!ctx||!w) return; const c=glColors(); ctx.clearRect(0,0,w,h);
  const R=Math.min(w,h)/2*.66,sc=R*gl.zoom,cx=w/2,cy=h/2;
  const proj=d3.geoOrthographic().scale(sc).translate([cx,cy]).rotate([gl.rot[0],gl.rot[1]]).clipAngle(90),path=d3.geoPath(proj,ctx);
  const center=[-gl.rot[0],-gl.rot[1]],t=now||0,orbit=glRM()?0:t*.00016;
  // disco amarelo concêntrico com o globo (acompanha o zoom) e uma bolinha vermelha tangente
  ctx.beginPath(); ctx.arc(cx,cy,sc*1.13,0,7); ctx.fillStyle=c.yellow; ctx.fill(); ctx.lineWidth=2.5; ctx.strokeStyle=GL_INK; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx+Math.cos(-.72)*sc*1.13,cy+Math.sin(-.72)*sc*1.13,sc*.085,0,7); ctx.fillStyle=c.red; ctx.fill(); ctx.lineWidth=2.5; ctx.stroke();
  // órbita das criptomoedas (parte de trás)
  const ring=(a0,a1)=>{ ctx.beginPath(); ctx.ellipse(cx,cy,sc*1.3,sc*.46,-.32,a0,a1); ctx.strokeStyle='rgba(22,18,14,.4)'; ctx.lineWidth=1.5; ctx.setLineDash([2,7]); ctx.lineCap='round'; ctx.stroke(); ctx.setLineDash([]); };
  ring(Math.PI,Math.PI*2);
  // oceano, graticule, terra, fronteiras
  ctx.beginPath(); path({type:'Sphere'}); ctx.fillStyle=c.blue; ctx.fill();
  ctx.beginPath(); path(gl.grid); ctx.strokeStyle='rgba(255,250,235,.2)'; ctx.lineWidth=1; ctx.stroke();
  ctx.beginPath(); path(gl.land); ctx.fillStyle=c.paper; ctx.fill(); ctx.lineWidth=2; ctx.strokeStyle=GL_INK; ctx.lineJoin='round'; ctx.stroke();
  ctx.beginPath(); path(gl.borders); ctx.strokeStyle='rgba(22,18,14,.3)'; ctx.lineWidth=.7; ctx.stroke();
  ctx.save(); ctx.beginPath(); path({type:'Sphere'}); ctx.clip(); const g=ctx.createLinearGradient(cx-sc,0,cx+sc,0); g.addColorStop(0,'rgba(22,18,14,0)'); g.addColorStop(.55,'rgba(22,18,14,0)'); g.addColorStop(1,'rgba(22,18,14,.34)'); ctx.fillStyle=g; ctx.fillRect(cx-sc,cy-sc,sc*2,sc*2); ctx.restore();
  ctx.beginPath(); path({type:'Sphere'}); ctx.lineWidth=3.5; ctx.strokeStyle=GL_INK; ctx.stroke();
  // arcos de forex
  if(gl.layer==='mk'){ ctx.setLineDash([7,7]); ctx.lineWidth=2.4; ctx.strokeStyle=c.red; ctx.lineCap='round';
    GLOBE_ARCS.forEach(([a,b])=>{ const A=GLOBE_PLACES.find(p=>p.id===a),B=GLOBE_PLACES.find(p=>p.id===b),it=d3.geoInterpolate([A.lon,A.lat],[B.lon,B.lat]),pts=[]; for(let i=0;i<=48;i++) pts.push(it(i/48)); ctx.beginPath(); path({type:'LineString',coordinates:pts}); ctx.stroke(); }); ctx.setLineDash([]); }
  // nomes dos continentes: pílula de tinta com letras de papel (legível sobre terra e oceano)
  ctx.font='800 10.5px Unbounded, sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  GLOBE_CONT.forEach(([n,lo,la])=>{ const d=d3.geoDistance([lo,la],center); if(d>1.2) return; const p=proj([lo,la]); if(!p) return; const a=Math.min(1,(1.2-d)/.35),tx=n.toUpperCase(),tw=ctx.measureText(tx).width,bw=tw+18,bh=21;
    ctx.globalAlpha=a; glRound(ctx,p[0]-bw/2,p[1]-bh/2,bw,bh,bh/2); ctx.fillStyle=GL_INK; ctx.fill(); ctx.lineWidth=1.5; ctx.strokeStyle=GL_PAPER; ctx.stroke(); ctx.fillStyle=GL_PAPER; ctx.fillText(tx,p[0],p[1]+.5); ctx.globalAlpha=1; });
  // locais visíveis, leque de fichas e linhas
  const places=gl.layer==='mk'?GLOBE_PLACES:GLOBE_ETF,P=[]; gl.pins=[];
  places.forEach((p,pi)=>{ const dist=d3.geoDistance([p.lon,p.lat],center); const xy=proj([p.lon,p.lat]); if(dist>1.5||!xy) return; P.push({p,pi,dist,x:xy[0],y:xy[1]}); });
  const lay=[];
  P.forEach(q=>{ if(q.p.id!==gl.sel) return; const mine=gl.chips.filter(k=>k.place===q.p.id); if(!mine.length) return; const ang=q.y>h*.3?-Math.PI/2:Math.PI/2,fan=globeFan(ang,mine.length,gl.w<480?46:60,gl.w<480?72:96);
    mine.forEach((k,i)=>{ if(!k.w){ k.w=k.el.offsetWidth||64; k.h=k.el.offsetHeight||26; } lay.push({k,q,w:k.w,h:k.h,tx:q.x+fan[i].dx,ty:q.y+fan[i].dy,i}); }); });
  const items=lay.map(o=>({w:o.w,h:o.h,tx:o.tx,ty:o.ty,o})),nChip=items.length;
  P.forEach(q=>{ if(lay.some(o=>o.q===q)) items.push({w:22,h:22,tx:q.x,ty:q.y,fixed:true}); }); // os marcadores contam como obstáculos fixos
  globeRelax(items,{w,h},40,5);
  const front=new Set();
  items.slice(0,nChip).forEach(it=>{ const o=it.o,k=o.k,fade=Math.max(0,Math.min(1,(1.32-o.q.dist)/.28)); k.x=it.x; k.y=it.y; k.px=o.q.x; k.py=o.q.y; k.fade=fade; k.order=o.i; front.add(k);
    if(fade>.05){ ctx.beginPath(); ctx.moveTo(o.q.x,o.q.y); ctx.lineTo(it.x,it.y); ctx.globalAlpha=Math.min(1,fade*(gl.sel&&gl.sel!==o.q.p.id?.45:.9)); ctx.strokeStyle=GL_INK; ctx.lineWidth=1.6; ctx.lineCap='round'; ctx.stroke(); ctx.globalAlpha=1; } });
  // satélites (criptomoedas): são as próprias fichas, em órbita
  const cOpen=gl.sel==='cripto'&&gl.layer==='mk',dots=[];
  gl.chips.filter(k=>k.kind==='sat').forEach((k,i)=>{ const th=orbit+i*2.094+.6,x=cx+sc*1.3*Math.cos(th)*Math.cos(-.32)-sc*.46*Math.sin(th)*Math.sin(-.32),y=cy+sc*1.3*Math.cos(th)*Math.sin(-.32)+sc*.46*Math.sin(th)*Math.cos(-.32); k.back=Math.sin(th)<0; dots.push({x,y,back:k.back});
    if(!cOpen) return; if(!k.w){ k.w=k.el.offsetWidth||64; k.h=26; } k.x=Math.max(k.w/2+2,Math.min(w-k.w/2-2,x)); k.y=Math.max(k.h/2+2,Math.min(h-k.h/2-2,y)); k.fade=k.back?.4:1; k.px=null; front.add(k); });
  ring(0,Math.PI);
  if(gl.layer==='mk') dots.forEach(d=>{ if(d.back&&Math.hypot(d.x-cx,d.y-cy)<sc) return; ctx.globalAlpha=d.back?.5:1; ctx.beginPath(); ctx.arc(d.x,d.y,cOpen?5:7,0,7); ctx.fillStyle=c.blue; ctx.fill(); ctx.lineWidth=2.4; ctx.strokeStyle=GL_INK; ctx.stroke(); ctx.globalAlpha=1; if(!d.back) gl.pins.push({id:'cripto',x:d.x,y:d.y,r:16}); });
  // marcadores
  P.forEach(q=>{ const p=q.p,sel=gl.sel===p.id,hov=gl.hover===p.id,n=(p.assets||p.rows).length,ok=gl.layer==='mk'?null:p.rows.every(r=>r.ok),col=gl.layer==='mk'?(c[GL_CLS[glCls(p.assets[0])]||'ink']||GL_INK):(ok?c.green:c.red),r=sel?10.5:hov?9.5:8;
    if(q.dist>1.45) return; const a=Math.max(0,Math.min(1,(1.45-q.dist)/.2)); ctx.globalAlpha=a;
    if(sel){ ctx.beginPath(); ctx.arc(q.x,q.y,r+6,0,7); ctx.fillStyle=c.yellow; ctx.fill(); ctx.lineWidth=2.5; ctx.strokeStyle=GL_INK; ctx.stroke(); }
    ctx.beginPath(); ctx.arc(q.x,q.y,r,0,7); ctx.fillStyle=col; ctx.fill(); ctx.lineWidth=2.6; ctx.strokeStyle=GL_INK; ctx.stroke();
    if(gl.layer==='etf'&&!ok){ ctx.beginPath(); ctx.moveTo(q.x-r,q.y+r); ctx.lineTo(q.x+r,q.y-r); ctx.lineWidth=3; ctx.stroke(); }
    if(n>1&&gl.layer==='mk'){ ctx.font='800 9px Unbounded, sans-serif'; ctx.fillStyle=col===c.yellow?GL_INK:GL_PAPER; ctx.fillText(String(n),q.x,q.y+.5); }
    if(hov&&!sel){ ctx.font='800 11px Hanken Grotesk, sans-serif'; ctx.textAlign='left'; ctx.lineWidth=4; ctx.strokeStyle=c.paper; const lx=q.x+r+9; ctx.strokeText(p.name,lx,q.y-1); ctx.fillStyle=GL_INK; ctx.fillText(p.name,lx,q.y-1); ctx.textAlign='center'; }
    ctx.globalAlpha=1; if(a>.5) gl.pins.push({id:p.id,x:q.x,y:q.y,r:r+8}); });
  glPlaceChips(front);
}
function glPlaceChips(front){
  gl.chips.forEach(k=>{ const on=front.has(k)&&k.fade>.05; const el=k.el;
    if(!on){ if(k.shown){ k.shown=false; el.classList.remove('in'); el.style.pointerEvents='none'; clearTimeout(k.ht); k.ht=setTimeout(()=>{ if(!k.shown) el.style.visibility='hidden'; },460); } return; }
    if(!k.shown){ k.shown=true; clearTimeout(k.ht); el.style.visibility='visible'; el.style.setProperty('--ox',(k.px==null?0:k.px-k.x)+'px'); el.style.setProperty('--oy',(k.py==null?0:k.py-k.y)+'px'); el.style.setProperty('--d',(k.order||0)*45+'ms'); void el.offsetWidth; el.classList.add('in'); }
    const x=k.x-k.w/2,y=k.y-k.h/2; if(k._x!==x||k._y!==y){ k._x=x; k._y=y; el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)'; }
    const dim=gl.sel&&k.place&&k.place!==gl.sel?.55:1,on2=k.back?.4:k.fade*dim; if(k._o!==on2){ k._o=on2; el.style.opacity=on2.toFixed(2); }
    el.style.pointerEvents=k.back?'none':'auto'; el.classList.toggle('sel',!!gl.sel&&k.place===gl.sel); el.classList.toggle('cur',gl.asset!=null&&k.id===gl.asset&&k.kind!=='etf'); });
}

// ---------- animação ----------
function glKick(){ if(!gl.raf&&gl.ready) gl.raf=requestAnimationFrame(glFrame); }
function glFrame(now){
  gl.raf=0; if(!gl.ready) return; const dt=gl.last?Math.min(48,now-gl.last):16; gl.last=now; let moving=false;
  if(gl.fly){ const f=gl.fly,k=Math.min(1,(now-f.t0)/f.d),e=1-Math.pow(1-k,3); gl.rot[0]=f.a[0]+(f.b[0]-f.a[0])*e; gl.rot[1]=f.a[1]+(f.b[1]-f.a[1])*e; if(k>=1) gl.fly=null; moving=true; }
  else if(gl.drag){ moving=true; }
  else if(Math.abs(gl.vel[0])+Math.abs(gl.vel[1])>.002){ gl.rot[0]+=gl.vel[0]; gl.rot[1]=Math.max(-80,Math.min(80,gl.rot[1]+gl.vel[1])); gl.vel[0]*=.93; gl.vel[1]*=.93; moving=true; }
  else if(!glRM()&&gl.vis&&!gl.sel&&!gl.over&&now-gl.idle>3500){ gl.rot[0]-=dt*.0055; moving=true; }
  if(Math.abs(gl.zt-gl.zoom)>.002){ gl.zoom+=(gl.zt-gl.zoom)*.16; moving=true; } else gl.zoom=gl.zt;
  glDraw(now);
  if(gl.vis&&!document.hidden&&(!glRM()||moving)) gl.raf=requestAnimationFrame(glFrame);
}
function glFly(lon,lat){ gl.fly={t0:performance.now(),d:900,a:gl.rot.slice(),b:[-lon,Math.max(-70,Math.min(70,-lat))]}; if(gl.fly.b[0]-gl.fly.a[0]>180) gl.fly.b[0]-=360; if(gl.fly.b[0]-gl.fly.a[0]<-180) gl.fly.b[0]+=360; gl.idle=performance.now(); glKick(); }

// ---------- lista de locais e painel lateral ----------
const glPlaces=()=>gl.layer==='mk'?GLOBE_PLACES:GLOBE_ETF;
const glPlaceOf=id=>GLOBE_PLACES.find(p=>p.assets.includes(id))||null;
function glRow(id){ const q=glQ(id); if(!q) return `<div class="gl-row"><span class="gl-d"></span><b>${esc(id)}</b><span class="muted">sem dados</span></div>`; const f=fmtQ(q);
  return `<button class="gl-row" data-asset="${esc(id)}"><span class="gl-d mc-${GL_CLS[q.cls]||'ink'}"></span><b>${esc(nameOf(id))}</b><small>${esc(q.cls)}</small><span class="num">${f.p}</span><span class="num ${dc(f.v)}">${f.c}</span></button>`; }
function glOverview(id){
  const q=glQ(id); if(!q) return `<h3>${esc(id)}</h3><p>Sem dados neste momento.</p>`; const f=fmtQ(q),pl=glPlaceOf(id),col=GL_CLS[q.cls]||'ink';
  return `<button class="gl-x" data-close aria-label="Fechar a vista geral">✕</button><div class="gl-ov-h"><span class="pill gl-cp">${esc(q.cls)}</span><small>${pl?esc(pl.name):'Sem país: rede descentralizada'}</small></div><h3>${esc(nameOf(id))}</h3><div class="gl-price"><b class="num">${f.p}</b><span class="num ${dc(f.v)}">${f.c}</span></div><div class="gl-spark">${typeof sparkArea==='function'?sparkArea(id,90,320,90):''}</div><p>${pl?esc(pl.note):'As criptomoedas não têm bolsa nem país de referência: por isso orbitam o globo.'}</p><div class="gl-acts"><button class="btn primary" data-open="${esc(id)}">Abrir no gráfico</button>${pl?`<button class="btn" data-gp="${pl.id}">Ver o local</button>`:''}</div>`;
}
function renderGlobeSide(animate){
  const L=$('glList'),C=$('glCard'); if(!L||!C) return;
  $('glLayers').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.layer===gl.layer)));
  const ps=glPlaces();
  L.innerHTML=ps.map(p=>{ const n=(p.assets||p.rows).length; return `<button class="gl-it${gl.sel===p.id?' on':''}" data-gp="${p.id}"><i class="gl-d mc-${gl.layer==='mk'?(GL_CLS[glCls(p.assets[0])]||'ink'):(p.rows.every(r=>r.ok)?'green':'red')}"></i>${esc(p.name)}<small>${n}</small></button>`; }).join('')+(gl.layer==='mk'?`<button class="gl-it${gl.sel==='cripto'?' on':''}" data-gp="cripto"><i class="gl-d mc-blue"></i>Cripto (órbita)<small>${GLOBE_SATS.length}</small></button>`:'');
  const sel=gl.layer==='mk'?GLOBE_PLACES.find(p=>p.id===gl.sel):GLOBE_ETF.find(p=>p.id===gl.sel);
  let html,cls='gl-card';
  if(gl.asset&&gl.layer==='mk'){ html=glOverview(gl.asset); cls+=' mc-'+(GL_CLS[glCls(gl.asset)]||'ink')+' ov'; }
  else if(gl.sel==='cripto'&&gl.layer==='mk'){ html=`<h3>Cripto: sem país</h3><p>As criptomoedas vivem numa rede descentralizada, sem bolsa nem país de referência. Por isso orbitam o globo.</p><div class="gl-rows">${GLOBE_SATS.map(s=>glRow(s.id)).join('')}</div>`; }
  else if(sel){ html=`<h3>${esc(sel.name)}</h3><p>${esc(sel.note)}</p><div class="gl-rows">${sel.assets?sel.assets.map(glRow).join(''):sel.rows.map(r=>`<div class="gl-row ${r.ok?'':'no'}"><span class="gl-d mc-${r.ok?'green':'red'}"></span><b>${esc(r.name)}</b><small>${r.ok?'ISIN '+r.isin:'não se compra em PT'}</small></div>`).join('')}</div>${sel.assets?'<small class="muted">Mercado de referência, não a origem física.</small>':''}`; }
  else html=`<h3>Escolhe um ativo</h3><p>${gl.layer==='mk'?'Toca num local do globo, ou na lista, para fazer sair os seus ativos, e depois num ativo para ver a vista geral. Os arcos vermelhos ligam moedas ao dólar dos EUA e as criptomoedas orbitam, porque não têm país.':'Mostra onde estão domiciliados os ETFs do S&amp;P 500 e porque só alguns se compram em Portugal.'}</p>${gl.layer==='mk'?'<ul class="gl-leg">'+Object.entries(GL_CLS).map(([k,v])=>`<li><i class="gl-d mc-${v}"></i>${k}</li>`).join('')+'</ul>':''}<small class="muted">Mercado de referência de cada ativo, não a sua origem física.</small>`;
  C.className=cls; C.innerHTML=html;
  if(animate&&!glRM()){ C.classList.remove('swap'); void C.offsetWidth; C.classList.add('swap'); clearTimeout(gl.swapT); gl.swapT=setTimeout(()=>C.classList.remove('swap'),900); }
}
function glSelect(id,fly){ gl.sel=id; gl.asset=null; gl.zt=id==='cripto'?1:1.28; renderGlobeSide(true); const p=glPlaces().find(x=>x.id===id); if(fly!==false&&p) glFly(p.lon,p.lat); glKick(); }
function glOpenAsset(id){
  gl.asset=id; const p=glPlaceOf(id); if(p){ gl.sel=p.id; gl.zt=1.28; glFly(p.lon,p.lat); } else if(GLOBE_SATS.some(s=>s.id===id)){ gl.sel='cripto'; gl.zt=1; } renderGlobeSide(true);
  if(innerWidth<=900) setTimeout(()=>$('glCard').scrollIntoView({behavior:glRM()?'auto':'smooth',block:'nearest'}),60); glKick();
}
function glClear(){ gl.sel=null; gl.asset=null; gl.zt=1; renderGlobeSide(true); glKick(); }
function glPick(x,y){ let best=null,bd=1e9; gl.pins.forEach(p=>{ const d=Math.hypot(p.x-x,p.y-y); if(d<p.r&&d<bd){ bd=d; best=p; } }); return best; }

function glBind(){
  if(gl.bound) return; gl.bound=true; const cv=gl.cv;
  const xy=e=>{ const r=cv.getBoundingClientRect(); return [e.clientX-r.left,e.clientY-r.top]; };
  cv.addEventListener('pointerdown',e=>{ const [x,y]=xy(e); gl.drag={x,y,x0:x,y0:y,moved:false,touch:e.pointerType==='touch'}; gl.vel=[0,0]; gl.fly=null; gl.idle=performance.now(); try{ cv.setPointerCapture(e.pointerId); }catch(_){} glKick(); });
  cv.addEventListener('pointermove',e=>{ const [x,y]=xy(e),d=gl.drag;
    if(d){ if(Math.hypot(x-d.x0,y-d.y0)>5) d.moved=true; if(d.moved){ const k=57.3/(Math.min(gl.w,gl.h)/2*.66*gl.zoom),dx=(x-d.x)*k,dy=d.touch?0:(y-d.y)*k; gl.rot[0]+=dx; gl.rot[1]=Math.max(-80,Math.min(80,gl.rot[1]-dy)); gl.vel=[dx,-dy]; gl.idle=performance.now(); } d.x=x; d.y=y; glKick(); }
    else { const p=glPick(x,y),id=p?p.id:null; if(id!==gl.hover){ gl.hover=id; cv.style.cursor=id?'pointer':'grab'; glKick(); } } });
  const up=e=>{ const d=gl.drag; gl.drag=null; if(!d) return; if(!d.moved){ const [x,y]=xy(e),p=glPick(x,y); if(p) glSelect(p.id); else if(gl.sel||gl.asset) glClear(); } gl.idle=performance.now(); glKick(); };
  cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',()=>{ gl.drag=null; });
  cv.addEventListener('pointerleave',()=>{ if(gl.hover){ gl.hover=null; glKick(); } });
  cv.addEventListener('wheel',e=>{ if(!e.ctrlKey) return; e.preventDefault(); gl.zt=Math.max(.8,Math.min(1.7,gl.zt*(e.deltaY<0?1.1:.9))); glKick(); },{passive:false});
  // com o rato por cima do globo a rotação automática pára, para as fichas não fugirem do clique
  $('glStage').addEventListener('pointerenter',e=>{ if(e.pointerType==='mouse') gl.over=true; });
  $('glStage').addEventListener('pointerleave',()=>{ gl.over=false; gl.idle=performance.now(); });
  $('glChips').addEventListener('click',e=>{ const b=e.target.closest('.gl-chip'); if(!b) return; const k=gl.chips.find(c=>c.el===b); if(!k) return; gl.idle=performance.now(); if(k.kind==='etf') glSelect(k.place); else glOpenAsset(k.id); });
  $('glSec').addEventListener('click',e=>{
    if(e.target.closest('[data-close]')){ gl.asset=null; renderGlobeSide(true); glKick(); return; }
    const op=e.target.closest('[data-open]'); if(op){ openAsset(op.dataset.open); return; }
    const it=e.target.closest('[data-gp]'); if(it){ glSelect(it.dataset.gp); return; }
    const as=e.target.closest('#glCard [data-asset]'); if(as){ glOpenAsset(as.dataset.asset); return; }
    const ly=e.target.closest('[data-layer]'); if(ly){ gl.layer=ly.dataset.layer; gl.sel=null; gl.asset=null; gl.zt=1; gl.built=''; glBuildChips(); renderGlobeSide(true); if(gl.layer==='etf') glFly(-20,45); glKick(); return; }
    const v=e.target.closest('[data-gv]'); if(v){ const c=GLOBE_VIEWS[v.dataset.gv]; if(c) glFly(c[0],c[1]); return; }
    const z=e.target.closest('[data-gz]'); if(z){ gl.zt=Math.max(.8,Math.min(1.7,gl.zt*(z.dataset.gz==='+'?1.25:.8))); glKick(); } });
  document.addEventListener('keydown',e=>{ if(e.key!=='Escape'||!gl.vis) return; if(gl.asset){ gl.asset=null; renderGlobeSide(true); glKick(); } else if(gl.sel) glClear(); });
  if('ResizeObserver' in window) new ResizeObserver(glResize).observe($('glStage')); else addEventListener('resize',glResize);
  if('IntersectionObserver' in window) new IntersectionObserver(es=>{ gl.vis=es[0].isIntersecting; if(gl.vis){ gl.last=0; glKick(); } },{threshold:.05}).observe($('glSec')); else { gl.vis=true; glKick(); }
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden){ gl.last=0; glKick(); } });
  new MutationObserver(glKick).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
}

// chamado por renderHome (ao entrar na vista) e quando chegam dados novos
function glUpdate(){
  if(!$('glSec')) return; if(!glInit()) return; glBind(); glBuildChips(); glResize(); renderGlobeSide(false); glKick();
}
