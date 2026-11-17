// ================= Aprender: vista, gráficos e widgets =================
// Biblioteca aberta: tudo acessível desde o início. XP, sequência e "lido" são uma camada opcional por cima.
const lrnSt={topic:'todos',q:'',sel:null,bound:false,prog:null,drawn:{}};
const lrnEUR=n=>Number(n).toLocaleString('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:0,useGrouping:'always'});
const lrnCompact=n=>Number(n).toLocaleString('pt-PT',{notation:'compact',maximumFractionDigits:1})+' €';
const lrnNum=v=>{ const n=parseFloat(String(v).replace(/\s/g,'').replace(',','.')); return isFinite(n)?n:0; };
const lrnMod=id=>LRN_MODULES.find(m=>m.id===id)||{id,name:id,color:'ink',glyph:'sun',soon:[]};
const lrnTopicName=id=>lrnMod(id).name;
const lrnIds=key=>String(key).replace(/\W/g,'');

function lrnProg(){ if(!lrnSt.prog){ const s=store('learn')||{}; lrnSt.prog={xp:s.xp||0,done:s.done||{},quiz:s.quiz||{},streak:s.streak||{count:0,last:null,rest:1}}; } return lrnSt.prog; }
function lrnSave(){ store('learn',lrnSt.prog); }
function lrnAward(xp){ const p=lrnProg(); p.xp+=xp; p.streak=lrnStreak(p.streak,today()); lrnSave(); renderLearnProgress(); }

const LRN_CHECK='<svg class="ic" viewBox="0 0 256 256" aria-hidden="true"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg>';

// Formas geométricas de cartaz, uma por módulo. Desenhadas em 120x120 com a cor do texto do bloco.
function lrnGlyph(n){
  const S='fill="none" stroke="currentColor" stroke-linecap="round"';
  const g={
    sun:`<circle cx="60" cy="60" r="26" fill="currentColor"/><path d="M60 8v16M60 96v16M8 60h16M96 60h16M23 23l11 11M86 86l11 11M97 23L86 34M34 86L23 97" ${S} stroke-width="7"/>`,
    arcs:`<path d="M8 112A104 104 0 0 1 112 8" ${S} stroke-width="14"/><path d="M8 112A72 72 0 0 1 80 40" ${S} stroke-width="14"/><path d="M8 112A40 40 0 0 1 48 72" ${S} stroke-width="14"/>`,
    bars:`<rect x="10" y="74" width="20" height="38" fill="currentColor"/><rect x="38" y="52" width="20" height="60" fill="currentColor"/><rect x="66" y="30" width="20" height="82" fill="currentColor"/><circle cx="106" cy="16" r="10" fill="currentColor"/><rect x="94" y="8" width="0" height="0"/>`,
    wave:`<path d="M6 60c14-44 28-44 42 0s28 44 42 0 14-20 24-12" ${S} stroke-width="12"/>`,
    donut:`<circle cx="60" cy="60" r="38" ${S} stroke-width="22" opacity=".35"/><path d="M60 22a38 38 0 0 1 38 38" ${S} stroke-width="22"/>`,
    tile:`<rect x="8" y="8" width="48" height="48" fill="currentColor"/><path d="M64 56a48 48 0 0 1 48-48v48z" fill="currentColor"/><path d="M8 64h48v48A48 48 0 0 1 8 64z" fill="currentColor"/><circle cx="88" cy="88" r="24" fill="currentColor"/>`,
    stack:`<rect x="14" y="76" width="92" height="26" rx="13" fill="currentColor"/><rect x="26" y="46" width="68" height="26" rx="13" fill="currentColor" opacity=".7"/><rect x="38" y="16" width="44" height="26" rx="13" fill="currentColor" opacity=".45"/>`,
    pie:`<circle cx="60" cy="60" r="46" ${S} stroke-width="8"/><path d="M60 60V14a46 46 0 0 1 40 23z" fill="currentColor"/><path d="M60 60l40-23a46 46 0 0 1-8 60z" fill="currentColor" opacity=".5"/>`,
    candles:`<path d="M26 14v92M60 30v76M94 8v82" ${S} stroke-width="6"/><rect x="14" y="36" width="24" height="44" fill="currentColor"/><rect x="48" y="48" width="24" height="34" fill="currentColor" opacity=".55"/><rect x="82" y="22" width="24" height="48" fill="currentColor"/>`,
    eye:`<path d="M6 60C26 28 94 28 114 60 94 92 26 92 6 60z" ${S} stroke-width="8"/><circle cx="60" cy="60" r="15" fill="currentColor"/>`,
    path:`<path d="M10 106h28V76h28V46h28V16" ${S} stroke-width="12" stroke-linejoin="round"/><circle cx="104" cy="16" r="9" fill="currentColor"/>`,
    letters:`<path d="M10 104L40 14l30 90M20 78h40" ${S} stroke-width="12" stroke-linejoin="round"/><path d="M78 104V54a14 14 0 0 1 28 0v50M78 78h28" ${S} stroke-width="10"/>`
  };
  return `<svg viewBox="0 0 120 120" aria-hidden="true">${g[n]||g.sun}</svg>`;
}

// ---------- Gráfico SVG: áreas empilhadas ou linha, com cursor e dica ----------
function lrnNice(v){ if(v<=0) return 1; const raw=v/4,mag=Math.pow(10,Math.floor(Math.log10(raw))),step=[1,1.2,1.5,2,2.5,3,4,5,6,8,10].map(k=>k*mag).find(s=>s>=raw-1e-9); return step*4; }
// series: [{key,label,color,line}] por ordem de empilhamento. data: [{x,...valores}]. xfmt(x), vfmt(v) formatam rótulos.
function lrnChart(host,{data,series,stacked,xfmt,vfmt,label,reveal}){
  const W=640,H=250,m={l:50,r:12,t:10,b:26},iw=W-m.l-m.r,ih=H-m.t-m.b;
  const tot=d=>stacked?series.reduce((a,s)=>a+d[s.key],0):d[series[0].key];
  const top=lrnNice(Math.max(...data.map(tot),1)),x0=data[0].x,x1=data.at(-1).x||1;
  const X=x=>m.l+(x-x0)/(x1-x0||1)*iw,Y=v=>m.t+ih-v/top*ih;
  let acc=data.map(()=>0),paths='';
  series.forEach(s=>{ const base=stacked?acc.slice():data.map(()=>0); const up=data.map((d,k)=>base[k]+d[s.key]); acc=up;
    const line=up.map((v,k)=>(k?'L':'M')+X(data[k].x).toFixed(1)+' '+Y(v).toFixed(1)).join('');
    const area=line+base.map((v,k)=>'L'+X(data[data.length-1-k].x).toFixed(1)+' '+Y(base[data.length-1-k]).toFixed(1)).join('')+'Z';
    // 2px de superfície entre áreas empilhadas: traço da cor da superfície
    paths+=`<path d="${area}" fill="${s.color}" fill-opacity="${s.op||.5}" stroke="var(--surface)" stroke-width="${stacked?2:0}" stroke-linejoin="round"/>`;
    if(s.line) paths+=`<path d="${line}" fill="none" stroke="${s.line}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`; });
  let grid='';
  for(let i=0;i<=4;i++){ const v=top/4*i,y=Y(v); grid+=`<line x1="${m.l}" x2="${W-m.r}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-width="1"/><text x="${m.l-8}" y="${y+3.5}" text-anchor="end" class="lrn-ax">${vfmt(v)}</text>`; }
  const step=Math.max(1,Math.ceil((data.length-1)/6)),xs=data.filter((_,i)=>i%step===0);
  const xl=xs.map(d=>`<text x="${X(d.x)}" y="${H-7}" text-anchor="middle" class="lrn-ax">${xfmt(d.x)}</text>`).join('');
  const legend=series.length>1?`<div class="lrn-leg">${series.map(s=>`<span><i style="background:${s.color}"></i>${esc(s.label)}</span>`).join('')}</div>`:'';
  const rows=data.filter((_,i)=>i%Math.max(1,Math.ceil(data.length/12))===0||i===data.length-1);
  const table=`<details class="lrn-tbl"><summary>Ver como tabela</summary><div class="tw"><table><thead><tr><th>${esc(label.x)}</th>${series.map(s=>`<th>${esc(s.label)}</th>`).join('')}</tr></thead><tbody>${rows.map(d=>`<tr><td>${xfmt(d.x)}</td>${series.map(s=>`<td class="num">${lrnEUR(d[s.key])}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`;
  host.innerHTML=`${legend}<div class="lrn-plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label.aria)}" preserveAspectRatio="none"><g>${grid}${xl}</g><g class="${reveal?'lrn-reveal':''}">${paths}</g><line class="lrn-cross" y1="${m.t}" y2="${m.t+ih}" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="3 3" hidden/>${series.map(s=>`<circle class="lrn-dot" r="5" fill="${s.line||s.color}" stroke="var(--surface)" stroke-width="2.5" hidden/>`).join('')}<rect class="lrn-hit" x="${m.l}" y="${m.t}" width="${iw}" height="${ih}" fill="transparent"/></svg><div class="lrn-tip" hidden></div></div>${table}`;
  const svg=host.querySelector('svg'),tip=host.querySelector('.lrn-tip'),cross=host.querySelector('.lrn-cross'),dots=[...host.querySelectorAll('.lrn-dot')],plot=host.querySelector('.lrn-plot');
  const hide=()=>{ tip.hidden=cross.hidden=true; dots.forEach(d=>d.hidden=true); };
  host.querySelector('.lrn-hit').addEventListener('pointermove',e=>{
    const r=svg.getBoundingClientRect(),px=(e.clientX-r.left)/r.width*W,t=clamp((px-m.l)/iw,0,1),xv=x0+t*(x1-x0);
    let k=0,best=1e9; data.forEach((d,i)=>{ const dd=Math.abs(d.x-xv); if(dd<best){ best=dd; k=i; } }); const d=data[k],cx=X(d.x);
    cross.setAttribute('x1',cx); cross.setAttribute('x2',cx); cross.hidden=false;
    let a=0; series.forEach((s,i)=>{ a=stacked?a+d[s.key]:d[s.key]; dots[i].setAttribute('cx',cx); dots[i].setAttribute('cy',Y(a)); dots[i].hidden=false; });
    tip.innerHTML=`<b>${xfmt(d.x)}</b>`+series.map(s=>`<span><i style="background:${s.color}"></i>${esc(s.label)}<em class="num">${lrnEUR(d[s.key])}</em></span>`).join('');
    tip.hidden=false; const w=tip.offsetWidth,pw=plot.clientWidth,left=clamp(cx/W*pw-w/2,0,pw-w); tip.style.left=left+'px'; });
  host.querySelector('.lrn-hit').addEventListener('pointerleave',hide);
}

// ---------- Widgets (ids com prefixo próprio: o mesmo widget pode existir na Home e num artigo) ----------
function lrnRange(id,label,min,max,step,val,fmt){ return `<label class="lrn-rg" for="${id}"><span>${label}<b class="num" id="${id}V">${fmt(val)}</b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`; }
function lrnBindRanges(root,fmts,fn){ root.querySelectorAll('input[type=range]').forEach(r=>r.addEventListener('input',()=>{ const o=root.querySelector('#'+r.id+'V'); if(o) o.textContent=fmts[r.id](+r.value); fn(); })); }

function widgetInflation(host,key){
  const k=lrnIds(key),I=k+'I',Y=k+'Y',O=k+'O',C=k+'C';
  const f={[I]:v=>nf(v,1)+'%',[Y]:v=>v+' anos'};
  host.innerHTML=`<div class="lrn-ctl">${lrnRange(I,'Inflação anual',0,10,.5,3,f[I])}${lrnRange(Y,'Anos',1,40,1,10,f[Y])}</div><p class="lrn-out" id="${O}"></p><div id="${C}"></div>`;
  const draw=()=>{ const i=+host.querySelector('#'+I).value,y=+host.querySelector('#'+Y).value;
    const data=[...Array(y+1)].map((_,n)=>({x:n,v:lrnReal(100,i,n)}));
    host.querySelector('#'+O).innerHTML=`100 € hoje compram como <b class="num down">${nf(data.at(-1).v,0)} €</b> daqui a ${y} anos.`;
    lrnChart(host.querySelector('#'+C),{data,series:[{key:'v',label:'Poder de compra de 100 €',color:'var(--red)',line:'var(--red)',op:.2}],stacked:false,xfmt:x=>x?'Ano '+x:'Hoje',vfmt:v=>nf(v,0)+' €',label:{x:'Ano',aria:'Gráfico: poder de compra de 100 euros ao longo dos anos com inflação constante'},reveal:!lrnSt.drawn[key]}); lrnSt.drawn[key]=1; };
  lrnBindRanges(host,f,draw); draw(); }

function widgetCompound(host,key,p){
  const k=lrnIds(key),A=k+'A',B=k+'B',R=k+'R',N=k+'N',O=k+'O',C=k+'C';
  const f={[A]:lrnEUR,[B]:lrnEUR,[R]:v=>nf(v,1)+'%',[N]:v=>v+' anos'};
  host.innerHTML=`<div class="lrn-ctl">${lrnRange(A,'Valor inicial',0,20000,500,p.initial,f[A])}${lrnRange(B,'Por mês',0,1000,25,p.monthly,f[B])}${lrnRange(R,'Rendimento anual (exemplo)',0,12,.5,p.rate,f[R])}${lrnRange(N,'Anos',1,40,1,p.years,f[N])}</div><p class="lrn-out" id="${O}"></p><div id="${C}"></div>`;
  const draw=()=>{ const q=id=>+host.querySelector('#'+id).value; const d=lrnCompound({initial:q(A),monthly:q(B),rate:q(R),years:q(N)}),l=d.at(-1);
    host.querySelector('#'+O).innerHTML=`Depositaste <b class="num">${lrnEUR(l.paid)}</b>, tens <b class="num up">${lrnEUR(l.total)}</b>, dos quais <b class="num up">${lrnEUR(l.interest)}</b> são juros.`;
    lrnChart(host.querySelector('#'+C),{data:d,series:[{key:'paid',label:'Depositado',color:'var(--blue)',op:.85},{key:'interest',label:'Juros',color:'var(--yellow)',line:'var(--ink)',op:1}],stacked:true,xfmt:x=>x?'Ano '+x:'Início',vfmt:lrnCompact,label:{x:'Ano',aria:'Gráfico: valor depositado e juros acumulados ao longo dos anos'},reveal:!lrnSt.drawn[key]}); lrnSt.drawn[key]=1; };
  lrnBindRanges(host,f,draw); draw(); }

function widgetTax(host,key){
  const k=lrnIds(key),B=k+'B',S=k+'S',F=k+'F',O=k+'O',M=k+'M';
  host.innerHTML=`<div class="form"><div class="fld"><label for="${B}">Pagaste (compra)</label><input class="inp" id="${B}" inputmode="decimal" value="10000"></div><div class="fld"><label for="${S}">Vendeste por</label><input class="inp" id="${S}" inputmode="decimal" value="14000"></div><div class="fld"><label for="${F}">Comissões (compra + venda)</label><input class="inp" id="${F}" inputmode="decimal" value="10"></div></div><div class="out" id="${O}"></div><p class="msg" id="${M}"></p>`;
  const draw=()=>{ const r=lrnGainTax({buy:lrnNum(host.querySelector('#'+B).value),sell:lrnNum(host.querySelector('#'+S).value),fees:lrnNum(host.querySelector('#'+F).value)});
    host.querySelector('#'+O).innerHTML=`<div><span class="lab">Ganho</span><span class="v ${r.gain>=0?'up':'down'}">${nf(r.gain,2)} €</span></div><div class="hi"><span class="lab">Imposto a 28%</span><span class="v">${nf(r.tax,2)} €</span></div><div><span class="lab">Fica contigo</span><span class="v">${nf(r.net,2)} €</span></div>`;
    host.querySelector('#'+M).textContent=r.gain<=0?'Saldo negativo: neste cálculo não há imposto. Confirma como as perdas podem ser usadas nos anos seguintes.':'Cálculo simples com a taxa autónoma. Não inclui englobamento nem outros rendimentos.'; };
  host.querySelectorAll('input').forEach(i=>i.addEventListener('input',draw)); draw(); }

// Calculadora genérica: campos e contas vêm de LRN_CALCS (learn-core.js)
function widgetCalc(host,key,name){
  const k=lrnIds(key),C=LRN_CALCS[name],O=k+'O',fmt={eur:v=>Number(v).toLocaleString('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:v%1?2:0,useGrouping:'always'}),pct:v=>nf(v,1)+'%',num:v=>nf(v,1)};
  host.innerHTML='<div class="form">'+C.f.map(f=>`<div class="fld"><label for="${k+f.id}">${f.l} (${f.u})</label><input class="inp" id="${k+f.id}" inputmode="decimal" value="${f.v}"></div>`).join('')+'</div><div class="out" id="'+O+'"></div>';
  const draw=()=>{ const v={}; C.f.forEach(f=>v[f.id]=lrnNum(host.querySelector('#'+k+f.id).value));
    host.querySelector('#'+O).innerHTML=lrnCalcOut(name,v).map((r,i,a)=>`<div${i===a.length-1?' class="hi"':''}><span class="lab">${r[0]}</span><span class="v">${isFinite(r[1])?fmt[r[2]](r[1]):'-'}</span></div>`).join(''); };
  host.querySelectorAll('input').forEach(i=>i.addEventListener('input',draw)); draw(); }

function widgetFgd(host,key){
  const k=lrnIds(key),ids=[k+'A',k+'B',k+'C'],O=k+'O';
  host.innerHTML=`<div class="form">${ids.map((id,i)=>`<div class="fld"><label for="${id}">Banco ${'ABC'[i]}</label><input class="inp" id="${id}" inputmode="decimal" value="${[150000,60000,0][i]}"></div>`).join('')}</div><div class="lrn-fg" id="${O}"></div>`;
  const draw=()=>{ const r=lrnCovered(ids.map(i=>lrnNum(host.querySelector('#'+i).value))),mx=Math.max(...r.map(x=>x.deposit),LRN_FGD);
    host.querySelector('#'+O).innerHTML=r.map((x,i)=>`<div class="lrn-fgr"><span class="lab">Banco ${'ABC'[i]}</span><div class="lrn-fgb" style="width:${Math.max(x.deposit/mx*100,0)}%" role="img" aria-label="Banco ${'ABC'[i]}: ${lrnEUR(x.covered)} protegidos, ${lrnEUR(x.exposed)} fora da garantia">${x.covered?`<i class="ok" style="flex:${x.covered}"></i>`:""}${x.exposed?`<i class="out" style="flex:${x.exposed}"></i>`:""}</div><span class="num lrn-fgv">${lrnEUR(x.covered)}${x.exposed?` <em>+ ${lrnEUR(x.exposed)} sem garantia</em>`:''}</span></div>`).join('')+`<div class="lrn-fgt"><span class="lab">Total protegido</span><b class="num up">${lrnEUR(r.reduce((a,x)=>a+x.covered,0))}</b></div>`; };
  host.querySelectorAll('input').forEach(i=>i.addEventListener('input',draw)); draw(); }

// ---------- Blocos do artigo ----------
function lrnBlock(b,art,i){
  const st=`style="--i:${Math.min(i,8)}" data-bid="${b.id}"`;
  if(b.t==='p') return `<p class="lrn-p" ${st}>${b.x}</p>`;
  if(b.t==='h') return `<h3 class="lrn-h" ${st}>${b.x}</h3>`;
  if(b.t==='ul') return `<ul class="lrn-ul" ${st}>${b.x.map(x=>`<li>${x}</li>`).join('')}</ul>`;
  if(b.t==='note') return `<p class="lrn-note" ${st}>${b.pending?'<span class="pill warn">Por confirmar</span> ':''}${b.x}</p>`;
  if(b.t==='scene') return `<figure class="lrn-scene" ${st} data-scrub="loop" role="img" aria-label="${esc(b.alt)}" data-scene="${b.s}">${lrnScene(b.s)}<figcaption>${esc(b.cap||'')}</figcaption></figure>`;
  if(b.t==='stat') return `<div class="lrn-stat" ${st}><b>${b.fmt==='pct'?b.v+'%':lrnEUR(b.v)}</b><span>${esc(b.label)}</span></div>`;
  if(b.t==='cmp') return `<div class="lrn-cmp" ${st}><div class="tw"><table><thead><tr>${b.head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r=>`<tr>${r.map((c,j)=>j?`<td>${c}</td>`:`<th scope="row">${c}</th>`).join('')}</tr>`).join('')}</tbody></table></div>${b.cap?`<small>${b.cap}</small>`:''}</div>`;
  if(b.t==='gl'){ const it=b.items.slice().sort((x,y)=>x[0].localeCompare(y[0],'pt')); return `<div class="lrn-gl" ${st}><input class="inp" type="search" placeholder="Procurar um termo" aria-label="Procurar um termo"><dl>${it.map(([t,d])=>`<div data-t="${esc((t+' '+d).toLowerCase())}"><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl><p class="muted lrn-empty" hidden>Nenhum termo encontrado.</p></div>`; }
  if(b.t==='w') return `<div class="lrn-w" ${st} data-w="${b.w}" ${b.c?`data-c="${b.c}" `:''}data-art="${art.id}-${b.id}" ${b.p?`data-p='${JSON.stringify(b.p)}'`:''}></div>`;
  if(b.t==='pt'){ const a=LRN_PT[b.pt]; return `<aside class="lrn-pt" ${st}><div class="lrn-pth"><span class="pill">PT</span><h3>Em Portugal: ${esc(a.name)}</h3></div><p>${esc(a.note)}</p><p class="lab">Versões que se compram em Portugal</p><ul>${a.list.map(e=>`<li><a href="${esc(e.src)}" target="_blank" rel="noopener">${esc(e.name)}</a><span class="num">${e.isin} · ${e.dom} · ${e.kind} · custo anual ${e.ter}</span></li>`).join('')}</ul><small>${esc(a.foot)} Verificado em ${LRN_VERIFIED}. Informação educativa, não é recomendação.</small></aside>`; }
  if(b.t==='decide'||b.t==='erro') return `<div class="lrn-quiz" ${st} data-q="${b.id}"><span class="pill">${b.label||'Decide'}</span><p class="lrn-q">${b.q}</p><div class="lrn-opts">${b.o.map((o,k)=>`<button class="lrn-opt" data-k="${k}">${o}</button>`).join('')}</div><div class="lrn-why" hidden></div></div>`;
  if(b.t==='fazve') return `<div class="lrn-quiz" ${st} data-q="${b.id}"><span class="pill">Faz e vê</span><p class="lrn-q">${b.q}</p><form class="lrn-guess"><input class="inp" inputmode="decimal" aria-label="A tua estimativa" placeholder="A tua estimativa"><span class="lab">${b.unit}</span><button class="btn primary" type="submit">Ver resposta</button></form><div class="lrn-why" hidden></div></div>`;
  return '';
}
// ---------- Cenas de motion graphics: SVG controlado pelo scroll (--p da figura, 0 a 1) ----------
function lrnScene(n){
  const col=['var(--red)','var(--blue)','var(--green)','var(--yellow)','#16120E'];
  if(n==='inflacao'){ let c=''; for(let i=0;i<10;i++){ const s=1/Math.pow(1.03,i); c+='<circle cx="'+(52+i*60)+'" cy="130" r="26" fill="none" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="3 5" opacity=".5"/><g class="co" style="--i:'+i+';--s:'+s.toFixed(4)+'"><circle cx="'+(52+i*60)+'" cy="130" r="26" fill="var(--yellow)" stroke="#16120E" stroke-width="3.5"/><text x="'+(52+i*60)+'" y="138" text-anchor="middle" font-family="Unbounded,sans-serif" font-weight="900" font-size="20" fill="#16120E">€</text></g>'; }
    return '<svg viewBox="0 0 640 300"><line x1="20" x2="620" y1="170" y2="170" stroke="var(--ink)" stroke-width="3"/>'+c+'<text x="52" y="215" text-anchor="middle" class="sc-l">Hoje</text><text x="592" y="215" text-anchor="middle" class="sc-l">10 anos</text><text x="320" y="272" text-anchor="middle" class="sc-big"><tspan data-n data-from="100" data-to="74" data-fmt="eur">100 €</tspan> em poder de compra</text></svg>'; }
  if(n==='juros') return '<svg viewBox="0 0 640 300"><path d="M10 120C200 130 420 210 630 262" fill="none" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/><g class="ball"><circle cx="50" cy="96" r="30" fill="var(--blue)" stroke="#16120E" stroke-width="4"/><path d="M50 66v60M20 96h60" stroke="#FFFAEB" stroke-width="4" stroke-linecap="round" opacity=".6"/></g><text x="24" y="42" class="sc-big" text-anchor="start"><tspan data-n data-from="1000" data-to="'+Math.round(lrnCompound({initial:1000,monthly:0,rate:5,years:20}).at(-1).total)+'" data-fmt="eur">1 000 €</tspan></text><text x="616" y="40" text-anchor="end" class="sc-l">5% ao ano, 20 anos (exemplo)</text></svg>';
  if(n==='regra72'){ let a='',b=''; for(let i=0;i<3;i++) a+='<ellipse cx="470" cy="'+(228-i*22)+'" rx="46" ry="14" fill="var(--yellow)" stroke="#16120E" stroke-width="3.5"/>'; for(let j=0;j<6;j++) b+='<ellipse class="cn" style="--j:'+j+'" cx="570" cy="'+(228-j*22)+'" rx="46" ry="14" fill="var(--yellow)" stroke="#16120E" stroke-width="3.5"/>';
    return '<svg viewBox="0 0 640 300"><circle cx="150" cy="140" r="96" fill="var(--surface)" stroke="#16120E" stroke-width="5"/><circle class="arc" cx="150" cy="140" r="78" pathLength="100" fill="none" stroke="var(--red)" stroke-width="14" stroke-linecap="round" transform="rotate(-90 150 140)"/><g class="hand"><line x1="150" y1="140" x2="150" y2="84" stroke="#16120E" stroke-width="6" stroke-linecap="round"/></g><circle cx="150" cy="140" r="8" fill="#16120E"/><line x1="410" x2="630" y1="244" y2="244" stroke="var(--ink)" stroke-width="3"/>'+a+b+'<text x="150" y="276" text-anchor="middle" class="sc-big" style="font-size:20px">72 ÷ 8 = 9 anos</text></svg>'; }
  if(n==='etf'){ let d=''; const pts=[[-250,-90],[-190,60],[-120,-40],[-60,100],[250,-80],[190,70],[120,-30],[60,110],[-20,-120],[40,-110],[-300,10],[300,20],[-150,110],[150,-110]]; pts.forEach((p,i)=>{ d+='<circle class="dt" style="--dx:'+p[0]+'px;--dy:'+p[1]+'px" cx="320" cy="150" r="13" fill="'+col[i%5]+'" stroke="#16120E" stroke-width="3"/>'; });
    return '<svg viewBox="0 0 640 300"><g class="etf"><circle cx="320" cy="150" r="82" fill="var(--yellow)" stroke="#16120E" stroke-width="5"/><text x="320" y="164" text-anchor="middle" font-family="Unbounded,sans-serif" font-weight="900" font-size="44" fill="#16120E">ETF</text></g>'+d+'</svg>'; }
  if(n==='mais'){ const a0=-90*Math.PI/180,a1=a0+0.28*2*Math.PI,P=(a,r)=>[(200+r*Math.cos(a)).toFixed(1),(150+r*Math.sin(a)).toFixed(1)],s0=P(a0,100),s1=P(a1,100);
    return '<svg viewBox="0 0 640 300"><path d="M200 150L'+s1[0]+' '+s1[1]+'A100 100 0 1 1 '+s0[0]+' '+s0[1]+'Z" fill="var(--yellow)" stroke="#16120E" stroke-width="4" stroke-linejoin="round"/><path class="slice" d="M200 150L'+s0[0]+' '+s0[1]+'A100 100 0 0 1 '+s1[0]+' '+s1[1]+'Z" fill="var(--red)" stroke="#16120E" stroke-width="4" stroke-linejoin="round"/><text x="360" y="120" class="sc-big" style="fill:var(--red)"><tspan data-n data-from="0" data-to="28" data-fmt="pct">0%</tspan></text><text x="360" y="146" class="sc-l">para o imposto</text><text x="360" y="212" class="sc-big"><tspan data-n data-from="0" data-to="72" data-fmt="pct">0%</tspan></text><text x="360" y="238" class="sc-l">fica contigo</text></svg>'; }
  if(n==='fgd') return '<svg viewBox="0 0 640 300"><line x1="40" x2="600" y1="262" y2="262" stroke="var(--ink)" stroke-width="3"/><g class="bankA"><rect x="90" y="62" width="120" height="200" fill="var(--red)" stroke="#16120E" stroke-width="4"/><rect x="90" y="129" width="120" height="133" fill="var(--green)" stroke="#16120E" stroke-width="4"/><text x="150" y="205" text-anchor="middle" class="sc-w">100 000 €</text><text x="150" y="102" text-anchor="middle" class="sc-w">50 000 €</text></g><text x="150" y="288" text-anchor="middle" class="sc-l">Banco A</text><rect x="360" y="182" width="120" height="80" fill="var(--green)" stroke="#16120E" stroke-width="4"/><text x="420" y="228" text-anchor="middle" class="sc-w">60 000 €</text><text x="420" y="288" text-anchor="middle" class="sc-l">Banco B</text><text x="500" y="60" class="sc-l">protegido</text><text x="500" y="82" class="sc-big" style="font-size:22px;fill:var(--green)"><tspan data-n data-from="0" data-to="160000" data-fmt="eur">0 €</tspan></text></svg>';
  return '';
}
function lrnMountWidgets(root){
  root.querySelectorAll('[data-w]').forEach(h=>{ const w=h.dataset.w,key=h.dataset.art;
    if(w==='inflation') widgetInflation(h,key); else if(w==='compound') widgetCompound(h,key,JSON.parse(h.dataset.p)); else if(w==='tax') widgetTax(h,key); else if(w==='fgd') widgetFgd(h,key); else if(w==='calc') widgetCalc(h,key,h.dataset.c); });
  root.querySelectorAll('.lrn-gl').forEach(g=>{ const rows=[...g.querySelectorAll('dl>div')],em=g.querySelector('.lrn-empty'); g.querySelector('input').addEventListener('input',e=>{ const q=e.target.value.trim().toLowerCase(); let n=0; rows.forEach(r=>{ const ok=!q||r.dataset.t.includes(q); r.hidden=!ok; if(ok) n++; }); em.hidden=n>0; }); });
}
function lrnAnswer(qz,ok,extra){
  const art=LRN.find(x=>x.id===lrnSt.sel),b=art.blocks.find(x=>x.id===qz.dataset.q),w=qz.querySelector('.lrn-why'),key=art.id+':'+b.id;
  w.hidden=false; w.className='lrn-why '+(ok?'right':'wrong'); qz.classList.remove('pop','shake'); void qz.offsetWidth; qz.classList.add(ok?'pop':'shake'); if(ok) m3Burst(w);
  const back=!ok&&b.ensina&&b.ensina[0]?` <button class="btn sm" type="button" data-re="${b.ensina[0]}">Rever a explicação</button>`:'';
  w.innerHTML=`<b>${ok?'Certo.':'Ainda não.'}</b> ${extra||''}${b.why}${back}`;
  if(ok&&!lrnProg().quiz[key]){ lrnProg().quiz[key]=1; lrnAward(10); }
}

// ---------- Vista ----------
function lrnList(){ const q=lrnSt.q.trim().toLowerCase(); return LRN.filter(a=>(lrnSt.topic==='todos'||a.topic===lrnSt.topic)&&(!q||(a.title+' '+a.lead+' '+lrnTopicName(a.topic)).toLowerCase().includes(q))); }
function renderLearnProgress(){ const p=lrnProg(),n=LRN.filter(a=>p.done[a.id]).length;
  $('lrnProg').innerHTML=`<span class="chip" title="Dias seguidos a aprender. Um dia de descanso perdoa uma falha."><b class="num">${p.streak.count}</b> ${p.streak.count===1?'dia seguido':'dias seguidos'}</span><span class="chip" title="Experiência"><b class="num">${p.xp}</b> XP · nível <b class="num">${lrnLevel(p.xp)}</b></span><span class="chip" title="Temas lidos"><b class="num">${n}</b> de <b class="num">${LRN.length}</b> lidos</span>`; }
function renderLearnList(){
  $('lrnTopics').innerHTML=[['todos','Tudo','ink'],...LRN_MODULES.map(m=>[m.id,m.name,m.color])].map(([id,l,c])=>`<button class="chip mc-${c}" data-lt="${id}" aria-pressed="${lrnSt.topic===id}"><i></i>${esc(l)}</button>`).join('');
  const list=lrnList(),p=lrnProg(); $('lrnCount').textContent=list.length+(list.length===1?' tema':' temas');
  $('lrnRows').innerHTML=list.length?list.map(a=>`<button class="lrn-row mc-${lrnMod(a.topic).color}" role="listitem" data-lid="${a.id}" aria-current="${lrnSt.sel===a.id}"><i class="lrn-mk"></i><span class="lrn-rt">${esc(a.title)}</span><span class="lrn-rm">${lrnTopicName(a.topic)} · ${a.mins} min</span>${p.done[a.id]?`<span class="lrn-ck" title="Lido">${LRN_CHECK}</span>`:''}</button>`).join(''):'<p class="muted lrn-empty">Nada encontrado. Experimenta «juros», «ETF» ou «imposto».</p>';
  const mods=lrnSt.topic==='todos'?LRN_MODULES:[lrnMod(lrnSt.topic)],soon=mods.flatMap(m=>m.soon.map(s=>[m,s])),shown=lrnSt.topic==='todos'?soon.slice(0,6):soon;
  $('lrnSoon').innerHTML=`<p class="lab">A caminho (só entra com fonte oficial)</p><ul>${shown.map(([m,s])=>`<li>${esc(s)}</li>`).join('')}</ul>${lrnSt.topic==='todos'&&soon.length>6?`<p class="lab">e mais ${soon.length-6} temas nos outros módulos</p>`:''}`; }
function renderLearnReader(animate){
  // módulo ainda sem artigos: mostra o que vem a caminho em vez de um tema de outro módulo
  if(lrnSt.topic!=='todos'&&!LRN.some(x=>x.topic===lrnSt.topic)){ const m=lrnMod(lrnSt.topic);
    $('lrnRead').innerHTML=`<div class="lrn-body mc-${m.color}${animate?' in':''}"><header class="lrn-head"><div class="lrn-hg">${lrnGlyph(m.glyph)}</div><p class="lrn-mod">${esc(m.name)} · a caminho</p><h2 class="lrn-title">${esc(m.name)}</h2></header><p class="lrn-lead">Este módulo ainda não está escrito. Cada tema só entra com fontes oficiais verificadas para Portugal.</p><ul class="lrn-ul" style="--i:1">${m.soon.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><div class="lrn-foot"><button class="btn primary lg" data-lt="todos">Ver os temas disponíveis</button></div></div>`; return; }
  const a=LRN.find(x=>x.id===lrnSt.sel)||LRN[0]; lrnSt.sel=a.id; const p=lrnProg(),done=!!p.done[a.id],m=lrnMod(a.topic);
  $('lrnRead').innerHTML=`<div class="lrn-body mc-${m.color}${animate?' in':''}"><header class="lrn-head"><div class="lrn-hg">${lrnGlyph(m.glyph)}</div><p class="lrn-mod">${esc(m.name)} · ${a.mins} min</p><h2 class="lrn-title" data-kin>${esc(a.title)}</h2></header><p class="lrn-lead">${a.lead}</p>${a.blocks.map((b,i)=>lrnBlock(b,a,i)).join('')}${a.src.length?`<div class="lrn-src"><p class="lab">Fontes <span class="pill up">Verificado em ${LRN_VERIFIED}</span></p><ul>${a.src.map(s=>`<li><a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.l)}</a></li>`).join('')}</ul></div>`:''}<div class="lrn-foot"><button class="btn ${done?'':'primary'} lg" id="lrnDone" aria-pressed="${done}">${done?'Lido':'Marcar como lido'}</button><span class="lab">${done?'Já contou para a tua sequência.':'Ganha 20 XP e conta para a sequência de hoje.'}</span></div>${lrnNextHtml(a,p)}</div>`;
  lrnMountWidgets($('lrnRead')); m3Scan($('lrnRead')); }
function renderLearn(){
  if(!lrnSt.bound){ lrnSt.bound=true;
    const pick=id=>{ lrnSt.topic=id; const cur=LRN.find(x=>x.id===lrnSt.sel),first=LRN.find(x=>x.topic===id); if(id!=='todos'&&first&&(!cur||cur.topic!==id)) lrnSt.sel=first.id; renderLearnList(); renderLearnReader(true); };
    $('lrnTopics').addEventListener('click',e=>{ const b=e.target.closest('[data-lt]'); if(b) pick(b.dataset.lt); });
    $('lrnRead').addEventListener('click',e=>{ const b=e.target.closest('[data-lt]'); if(b) pick(b.dataset.lt); });
    $('lrnQ').addEventListener('input',e=>{ lrnSt.q=e.target.value; renderLearnList(); });
    $('lrnRows').addEventListener('click',e=>{ const b=e.target.closest('[data-lid]'); if(!b) return; lrnOpen(b.dataset.lid,true); });
    const rd=$('lrnRead');
    rd.addEventListener('click',e=>{
      const opt=e.target.closest('.lrn-opt'); if(opt){ const qz=opt.closest('.lrn-quiz'),art=LRN.find(x=>x.id===lrnSt.sel),b=art.blocks.find(x=>x.id===qz.dataset.q),k=+opt.dataset.k;
        qz.querySelectorAll('.lrn-opt').forEach((o,i)=>{ o.disabled=true; o.classList.toggle('right',i===b.c); o.classList.toggle('wrong',i===k&&k!==b.c); });
        lrnAnswer(qz,k===b.c); return; }
      if(e.target.closest('[data-lrnlist]')){ $('lrnRows').scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'}); return; }
      const nx=e.target.closest('[data-next]'); if(nx){ lrnOpen(nx.dataset.next,true); return; }
      const re=e.target.closest('[data-re]'); if(re){ const t=rd.querySelector(`[data-bid="${re.dataset.re}"]`); if(t){ t.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'center'}); t.classList.remove('flash'); void t.offsetWidth; t.classList.add('flash'); } return; }
      if(e.target.closest('#lrnDone')){ const p=lrnProg(),id=lrnSt.sel; if(p.done[id]){ delete p.done[id]; lrnSt.justDone=null; } else { p.done[id]=1; lrnAward(20); lrnSt.justDone=id; } lrnSave(); renderLearnProgress(); renderLearnList(); renderLearnReader(false); const af=$('lrnAfter'); if(af) af.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'center'}); } });
    rd.addEventListener('submit',e=>{ const f=e.target.closest('.lrn-guess'); if(!f) return; e.preventDefault();
      const qz=f.closest('.lrn-quiz'),art=LRN.find(x=>x.id===lrnSt.sel),b=art.blocks.find(x=>x.id===qz.dataset.q),inp=f.querySelector('input');
      if(!inp.value.trim()){ inp.focus(); return; } const g=lrnNum(inp.value),ok=Math.abs(g-b.answer)<=Math.max(Math.abs(b.answer)*b.tol,.0001);
      f.querySelectorAll('input,button').forEach(x=>x.disabled=true);
      lrnAnswer(qz,ok,`A tua estimativa: <b class="num">${nf(g,b.unit==='€'?0:1)} ${b.unit}</b>. Resposta: <b class="num">${nf(b.answer,b.unit==='€'?0:1)} ${b.unit}</b>. `); });
  }
  renderLearnProgress(); renderLearnList(); renderLearnReader(true); }
function lrnOpen(id,scroll){ lrnSt.sel=id; lrnSt.justDone=null; if(st.view!=='aprender'){ go('aprender'); return; } renderLearnList(); renderLearnReader(true); if(scroll&&innerWidth<1080) setTimeout(()=>$('lrnRead').scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'}),60); else window.scrollTo({top:0}); }
// Abre a biblioteca já filtrada num módulo (usado pelo mapa da Home).
function lrnOpenModule(id){ lrnSt.topic=id; lrnSt.q=''; const first=LRN.find(a=>a.topic===id); if(first) lrnSt.sel=first.id; if(st.view!=='aprender') go('aprender'); else renderLearn(); }

// Fim da aula: próximo tema por ler; depois de "Marcar como lido", um menu com alternativas de outros módulos
function lrnNextHtml(a,p){
  const i=LRN.indexOf(a),nx=LRN.slice(i+1).find(x=>x.topic===a.topic&&!p.done[x.id])||LRN.find(x=>x!==a&&!p.done[x.id]);
  const next=nx?`<button class="lrn-next mc-${lrnMod(nx.topic).color}" data-next="${nx.id}"><span>Próximo tema</span><b>${esc(nx.title)}</b></button>`:'';
  if(lrnSt.justDone!==a.id) return next;
  const alts=LRN_MODULES.map(m=>LRN.find(x=>x.topic===m.id&&x!==a&&x!==nx&&!p.done[x.id])).filter(Boolean).slice(0,4);
  return `<div class="lrn-after" id="lrnAfter" role="region" aria-label="O que ler a seguir"><p class="lrn-after-t">${nx?'Feito. O que lês a seguir?':'Leste todos os temas.'}</p>${next}${alts.length?`<p class="lab">Ou escolhe outro tema</p><div class="lrn-alt">${alts.map(x=>`<button class="btn mc-${lrnMod(x.topic).color}" data-next="${x.id}"><span class="lab">${esc(lrnMod(x.topic).name)}</span>${esc(x.title)}</button>`).join('')}</div>`:''}<button class="btn" data-lrnlist>Ver todos os temas</button></div>`;
}
