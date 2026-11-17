// ================= Fita e painel =================
const CLASS_ORDER=['Ações','Obrigações','Forex','Matérias-primas','Cripto'];
function sortedQuotes(){ const l=Object.values(st.quotes); return l.sort((a,b)=>CLASS_ORDER.indexOf(a.cls)-CLASS_ORDER.indexOf(b.cls)||(a.ord??99)-(b.ord??99)); }
const nameOf=id=>LABEL[id]||st.quotes[id]?.name||id;
function spark(id,n,w,h){ const s=daily(id).slice(-n); if(s.length<2) return `<svg viewBox="0 0 ${w} ${h}"></svg>`;
  const mn=Math.min(...s.map(p=>p.v)),mx=Math.max(...s.map(p=>p.v)),r=mx-mn||1; const up=s[s.length-1].v>=s[0].v;
  const pts=s.map((p,i)=>`${(i/(s.length-1)*w).toFixed(1)},${(h-2-(p.v-mn)/r*(h-4)).toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" fill="none" style="stroke:var(--${up?'up':'down'})" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>`; }
function renderTape(){ const l=sortedQuotes(); if(!l.length) return; const one=l.map(q=>{const f=fmtQ(q); return `<button class="tape-item" data-asset="${esc(q.id)}"><b>${esc(nameOf(q.id))}</b><span class="num">${f.p}</span><span class="num ${dc(f.v)}">${f.c}</span></button>`;}).join(''); $('tape').innerHTML=one+one; }
const tdc=(id,x,day)=>`<td class="${x==null?'muted':dc(x)}">${fmtChg(id,x,day)}</td>`;
function renderBoard(){ const l=sortedQuotes(); if(!l.length){ if(st.dbOk===false) $('board').innerHTML='<tbody><tr><td class="muted" style="font-family:var(--f-body);white-space:normal">Sem cotações nesta vista.</td></tr></tbody>'; return; }
  let h='<thead><tr><th>Ativo</th><th>Último</th><th>Dia</th><th class="hide-s">1S</th><th>1M</th><th class="hide-s">3M</th><th class="hide-s sp">30 dias</th></tr></thead><tbody>',cls='';
  for(const q of l){ if(q.cls!==cls){ cls=q.cls; h+=`<tr class="grp"><td colspan="7">${esc(cls)}</td></tr>`; } const f=fmtQ(q),id=q.id;
    h+=`<tr data-asset="${esc(id)}" tabindex="0" role="link"><td>${esc(nameOf(id))}</td><td>${f.p}</td>${tdc(id,f.v,true)}<td class="hide-s ${dc(chgSince(id,7))}">${fmtChg(id,chgSince(id,7))}</td>${tdc(id,chgSince(id,30))}<td class="hide-s ${dc(chgSince(id,91))}">${fmtChg(id,chgSince(id,91))}</td><td class="hide-s sp">${spark(id,30,88,24)}</td></tr>`; }
  $('board').innerHTML=h+'</tbody>'; }
function sparkArea(id,n,w,h){ const s=daily(id).slice(-n); if(s.length<2) return `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true"></svg>`;
  const mn=Math.min(...s.map(p=>p.v)),mx=Math.max(...s.map(p=>p.v)),r=mx-mn||1,up=s[s.length-1].v>=s[0].v,c=up?'up':'down';
  const pts=s.map((p,i)=>`${(i/(s.length-1)*w).toFixed(1)},${(h-3-(p.v-mn)/r*(h-8)).toFixed(1)}`);
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polygon points="0,${h} ${pts.join(' ')} ${w},${h}" style="fill:var(--${c})" fill-opacity=".13"/><polyline points="${pts.join(' ')}" fill="none" style="stroke:var(--${c})" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>`; }
const CARDS=['SPX','NDX','DAX','EURUSD','GOLD','BTC'];
function renderCards(){ const l=sortedQuotes(),el=$('mcards'); if(!l.length||!el) return; let ids=CARDS.filter(id=>st.quotes[id]); if(ids.length<6) ids=ids.concat(l.map(q=>q.id).filter(id=>!ids.includes(id))).slice(0,6);
  el.innerHTML=ids.map(id=>{ const q=st.quotes[id],f=fmtQ(q); return `<button class="mcard" data-asset="${esc(id)}"><span class="mn">${esc(nameOf(id))}</span><span class="mc">${esc(q.cls)}</span><span class="mp">${f.p}</span><span class="mv2 ${dc(f.v)}">${f.c}</span>${sparkArea(id,60,200,38)}</button>`; }).join(''); }
function renderHeat(){ const l=sortedQuotes(),el=$('heat'); if(!l.length||!el) return; const by={}; l.forEach(q=>(by[q.cls] ||= []).push(q));
  el.innerHTML=CLASS_ORDER.filter(c=>by[c]).map(c=>`<div class="heat-g"><h3>${esc(c)}</h3><div class="heat">${by[c].map(q=>{ const z=zDay(q.id),f=fmtQ(q),ok=z!=null&&isFinite(z),a=ok?clamp(Math.abs(z)/2.5,0,1):0;
    const bg=ok?`color-mix(in srgb,var(--heat-${z>=0?'up':'down'}) ${Math.round(16+a*84)}%,var(--sunk))`:'var(--sunk)';
    return `<button class="ht" data-asset="${esc(q.id)}" style="--hb:${bg}" title="${esc(nameOf(q.id))}: ${f.c}${ok?' ('+sg(z,1,'σ')+')':''}"><b>${esc(SHORT[q.id]||nameOf(q.id))}</b><span>${f.c}</span></button>`; }).join('')}</div></div>`).join(''); }
function renderBrief(){
  const t=today(),now=Date.now(),td=st.items.filter(i=>i.day===t);
  if(st.meta?.regime){ const tt=st.meta.regimeTitle||'Leitura do regime de mercado',hh=$('regTitle'); if(hh.dataset.t!==tt){ hh.textContent=tt; hh.dataset.t=tt; } $('regText').textContent=st.meta.regime; }
  else if(st.dbOk===false){ $('regText').textContent='Esta vista não consegue ler os dados. Abra a página em claude.ai com sessão iniciada. As calculadoras em Ferramentas funcionam na mesma.'; }
  const out=td.filter(i=>i.a!=null); let u=0,d=0; out.forEach(i=>{const x=direction(i); if(x&&x.d>0)u++; else if(x&&x.d<0)d++;});
  if(st.items.length){ $('k1').innerHTML=`${td.length}<small>${td.filter(i=>i.imp>=3).length} de alto impacto</small>`; $('k2').innerHTML=`${out.length}<small>${td.length?Math.round(out.length/td.length*100)+'% do dia':'sem eventos hoje'}</small>`;
    $('k3').innerHTML=`<span class="up">▲${u}</span> <span class="down">▼${d}</span><small>acima · abaixo</small>`; }
  const nx=st.items.find(i=>i.ts>now&&i.imp>=3);
  $('nextBox').innerHTML='<span class="lab">Próximo evento de alto impacto</span>'+(nx?`<span class="big" data-cd="${nx.ts}">${until(nx.ts)}</span><button data-ev="${esc(nx.id)}">${esc(nx.cur)} · ${esc(nx.n)}</button><div class="muted" style="font-size:12.5px">${fShortT.format(new Date(nx.ts))}${nx.f!=null?' · previsão '+fv(nx,nx.f):''}</div>`:'<span class="big">n/d</span><span class="muted">Sem eventos de alto impacto agendados.</span>');
  let list=td.filter(i=>i.imp>=2); if(list.length<4) list=st.items.filter(i=>i.ts>now&&i.imp>=2).slice(0,8);
  list=list.slice().sort((a,b)=>b.imp-a.imp||a.ts-b.ts).slice(0,7).sort((a,b)=>a.ts-b.ts);
  if(st.dbOk===false&&!st.items.length) $('todo').innerHTML='<div class="pb"><div class="empty">Sem calendário nesta vista.</div></div>';
  if(st.items.length) $('todo').innerHTML=list.length?list.map(it=>evRow(it,false,3)).join(''):'<div class="pb"><div class="empty">Sem eventos de média ou alta importância hoje.</div></div>';
}
function renderTimeline(){
  const t0=dayStartLisbon(today()),now=Date.now(),pc=t=>clamp((t-t0)/864e5*100,0,100),ws=sessionWindows(t0);
  const open=ws.filter(s=>s.w.some(([a,b])=>now>=a&&now<b)).map(s=>s.k);
  const dstr=fDay.format(new Date(now)); $('heroDate').textContent=dstr.charAt(0).toUpperCase()+dstr.slice(1); $('tlMeta').textContent=(open.length?`Abertas agora: ${open.join(' e ')}`:ws.every(s=>!s.w.length)?'Mercado cambial fechado ao fim de semana':'Nenhuma sessão principal aberta');
  let h=`<div class="tl" style="--f:${clamp((now-t0)/864e5,0,1).toFixed(4)}">`;
  ws.forEach(s=>{ h+=`<span class="lbl${open.includes(s.k)?' open':''}">${s.k}</span><div class="trk">${s.w.map(([a,b])=>`<i class="bar${now>=a&&now<b?' open':''}" style="left:${pc(a).toFixed(2)}%;width:${(pc(b)-pc(a)).toFixed(2)}%" title="${s.k}: ${fT.format(new Date(a))} às ${fT.format(new Date(b))}"></i>`).join('')}</div>`; });
  const t=today(),by=new Map(); st.items.filter(i=>i.day===t&&i.imp>=2).forEach(i=>{ const g=by.get(i.ts)||[]; g.push(i); by.set(i.ts,g); });
  let lastL=-99,ev=''; [...by.entries()].sort((a,b)=>a[0]-b[0]).forEach(([ts,g])=>{ g.sort((a,b)=>b.imp-a.imp); const top=g[0],x=pc(ts),hi=top.imp>=3,done=g.every(i=>i.a!=null);
    const lbl=hi&&x-lastL>9&&x<88; if(lbl) lastL=x; const tt=`${fT.format(new Date(ts))} · ${g.map(i=>i.cur+' '+i.n).join(' · ')}`;
    ev+=`<button class="evm${hi?'':' m'}${done?' done':''}" style="left:${x.toFixed(2)}%" data-ev="${esc(top.id)}" title="${esc(tt)}" aria-label="${esc(tt)}"><i></i>${lbl?`<span>${esc(top.cur)}${g.length>1?' ×'+g.length:''}</span>`:''}</button>`; });
  h+=`<span class="lbl">Eventos</span><div class="evs">${ev||'<span class="muted" style="position:absolute;left:0;bottom:6px">Sem eventos de média ou alta importância hoje.</span>'}</div>`;
  h+=`<span></span><div class="axis">${[0,3,6,9,12,15,18,21,24].map(x=>`<span style="left:${(x/24*100).toFixed(2)}%">${String(x).padStart(2,'0')}h</span>`).join('')}</div>`;
  $('timeline').innerHTML=h+`<div class="now"><b>${fT.format(new Date(now))}</b></div></div>`;
}
const RISK=[['SPX',1],['NDX',1],['ESTX50',1],['COPPER',1],['BTC',1],['USDJPY',1],['DXY',-1],['GOLD',-1]];
function riskScore(){ const parts=[],n=5; for(const [id,sgn] of RISK){ const s=daily(id); if(s.length<30) continue; const r=Math.log(s[s.length-1].v/s[s.length-1-n].v)*100,v=sdDaily(id,60); if(!v) continue; parts.push({id,z:clamp(r/(v*Math.sqrt(n)),-2,2)*sgn,inv:sgn<0}); }
  return parts.length<4?null:{score:mean(parts.map(p=>p.z))/2,parts}; }
function divBar(v,max){ const w=clamp(Math.abs(v)/max,0,1)*50; return `<span class="track"><span class="fill" style="left:${v>0?50:50-w}%;width:${w}%;background:var(--${v>0?'up':'down'});transform-origin:${v>0?'left':'right'}"></span></span>`; }
function renderRisk(){ const r=riskScore(); if(!r){ return; } const s=r.score,lab=s>0.25?'Apetite pelo risco':s<-0.25?'Aversão ao risco':'Neutro',a=Math.PI*(1-(s+1)/2),nx=100+66*Math.cos(a),ny=100-66*Math.sin(a);
  $('riskBox').innerHTML=`<svg class="gauge" viewBox="0 0 200 116" role="img" aria-label="${lab}, ${sg(s,2)} numa escala de −1 a +1"><defs><linearGradient id="gg" x1="0" x2="1" y1="0" y2="0"><stop offset="0" style="stop-color:var(--down)"/><stop offset=".5" style="stop-color:var(--warn)"/><stop offset="1" style="stop-color:var(--up)"/></linearGradient></defs>
    <path d="M16 100 A84 84 0 0 1 184 100" fill="none" style="stroke:var(--sunk)" stroke-width="14" stroke-linecap="round"/><path d="M16 100 A84 84 0 0 1 184 100" fill="none" stroke="url(#gg)" stroke-width="8" stroke-linecap="round"/>
    <line class="needle" data-deg="${(s*90).toFixed(1)}" x1="100" y1="100" x2="100" y2="34" style="stroke:var(--ink);transform:rotate(${(s*90).toFixed(1)}deg)" stroke-width="3" stroke-linecap="round"/><circle cx="100" cy="100" r="6" style="fill:var(--ink)"/></svg>
    <div class="riskv ${s>0.25?'up':s<-0.25?'down':''}">${lab}</div><p class="gsub">${sg(s,2)} numa escala de −1 a +1</p>
    <div class="gchips">${r.parts.map(p=>`<span class="pill ${dc(p.z)}" title="${p.inv?'Conta ao contrário: a subir indica medo':''}">${esc(SHORT[p.id]||nameOf(p.id))}${p.inv?' (inv.)':''} ${sg(p.z,1,'σ')}</span>`).join('')}</div>`; }
const CLS_SHORT={'Ações':'Ações','Obrigações':'Juros','Forex':'Forex','Matérias-primas':'Mat.-primas','Cripto':'Cripto'};
// Desenha um radar para a lista de cotações dada. full=true: todos com nome e clicáveis (o meu radar); false: ilustrativo (página inicial).
function buildRadar(l,full){ const C=200,R=160; let g='';
  const rad=z=>R*Math.sqrt(clamp(Math.abs(z),0,2.5)/2.5); [0.5,1,2].forEach(k=>{ g+=`<circle cx="${C}" cy="${C}" r="${rad(k).toFixed(1)}" fill="none" style="stroke:var(--line-2)" stroke-dasharray="2 6"/><text class="cls" x="${C+5}" y="${(C-rad(k)+13).toFixed(1)}">${String(k).replace('.',',')}σ</text>`; });
  const cls=CLASS_ORDER,n=cls.length;
  cls.forEach((c,i)=>{ const a=i/n*2*Math.PI-Math.PI/2,am=(i+.5)/n*2*Math.PI-Math.PI/2; g+=`<line x1="${C}" y1="${C}" x2="${(C+R*Math.cos(a)).toFixed(1)}" y2="${(C+R*Math.sin(a)).toFixed(1)}" style="stroke:var(--line)"/><text class="cls" text-anchor="middle" x="${(C+(R+20)*Math.cos(am)).toFixed(1)}" y="${(C+(R+20)*Math.sin(am)+4).toFixed(1)}">${CLS_SHORT[c]||c}</text>`; });
  const pts=[]; cls.forEach((c,i)=>{ const it=l.filter(q=>q.cls===c).map(q=>({q,z:zDay(q.id)})).filter(x=>x.z!=null&&isFinite(x.z)); it.forEach((x,k)=>{ const a=(i+(k+1)/(it.length+1))/n*2*Math.PI-Math.PI/2,rr=Math.max(14,rad(x.z)); pts.push({id:x.q.id,z:x.z,x:C+rr*Math.cos(a),y:C+rr*Math.sin(a)}); }); });
  const top=full?new Set(pts.map(p=>p.id)):new Set(pts.slice().sort((a,b)=>Math.abs(b.z)-Math.abs(a.z)).slice(0,5).filter(p=>Math.abs(p.z)>=0.8).map(p=>p.id));
  g+=`<line class="rline" x1="${C}" y1="${C}" x2="${C}" y2="${C}" style="stroke:var(--accent-2);opacity:0;transition:opacity .2s"/>`;
  g+=pts.map(p=>{ const col=p.z>=0?'var(--up)':'var(--down)'; return `<g class="bw" data-id="${esc(p.id)}"><circle class="rg" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5" style="stroke:${col}"/><circle class="blip"${full?` data-asset="${esc(p.id)}"`:''} cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${Math.abs(p.z)>=1.5?6.5:4.5}" style="fill:${col};filter:drop-shadow(0 0 7px ${col})"/>`+(top.has(p.id)?`<text x="${(p.x+(p.x>C?10:-10)).toFixed(1)}" y="${(p.y+4).toFixed(1)}" text-anchor="${p.x>C?'start':'end'}">${esc(SHORT[p.id]||nameOf(p.id))}</text>`:'')+'</g>'; }).join('');
  return g+`<circle cx="${C}" cy="${C}" r="3.5" style="fill:var(--accent-2);filter:drop-shadow(0 0 8px var(--accent-2))"/>`; }
function renderRadar(){ const s=$('radar'); if(s) s.innerHTML=buildRadar(sortedQuotes(),false); }

// ---------- O meu radar: só os ativos que o utilizador adicionou, guardados em privado ----------
const rd={ids:[],mode:null,ref:null,q:Promise.resolve(),qy:''};
function rdSave(){ if(rd.mode==='db'){ const ids=rd.ids.slice(); rd.q=rd.q.then(()=>rd.ref.set({ids,at:Date.now()})).catch(()=>{ rd.mode='local'; store('radar',rd.ids); if(st.view==='radar') renderMyRadar(); }); } else store('radar',rd.ids); }
function rdSet(ids){ rd.ids=[...new Set(ids)].slice(0,40); rdSave(); renderMyRadar(); }
function rdToggle(id){ rdSet(rd.ids.includes(id)?rd.ids.filter(x=>x!==id):[...rd.ids,id]); }
function renderMyRadar(){ const all=sortedQuotes(),mine=all.filter(q=>rd.ids.includes(q.id));
  $('rdMode').textContent=rd.mode==='db'?'Guardado em privado na sua conta':rd.mode==='local'?'Guardado apenas neste navegador':'';
  $('radar2').innerHTML=buildRadar(mine,true);
  const em=$('rdEmpty'); em.hidden=mine.length>0; if(!mine.length) em.innerHTML=all.length?'<b>O seu radar está vazio</b><span>Adicione os mercados que quer seguir. Só esses aparecem aqui.</span><button class="btn primary" data-rdtop>Adicionar os mais mexidos de hoje</button>':'<b>Sem cotações nesta vista</b><span>Abra a página em claude.ai com sessão iniciada.</span>';
  $('rdCount').textContent=mine.length?`${mine.length} de ${all.length} mercados`:''; $('rdClear').hidden=!mine.length;
  $('rdList').innerHTML=mine.length?mine.map(q=>({q,z:zDay(q.id)})).sort((a,b)=>Math.abs(b.z||0)-Math.abs(a.z||0)).map(({q,z})=>{ const f=fmtQ(q); return `<div class="kv rdrow" data-asset="${esc(q.id)}" role="button" tabindex="0"><span>${esc(nameOf(q.id))}<small>${esc(q.cls)}</small></span><span class="v">${f.p}</span><span class="v ${dc(f.v)}">${f.c}</span><span class="v ${dc(z)}">${sg(z,1,'σ')}</span><button class="rmv" data-rdx="${esc(q.id)}" aria-label="Retirar ${esc(nameOf(q.id))} do radar">${ico(IC.x)}</button></div>`; }).join(''):'<div class="pb"><div class="empty">Ainda não adicionou ativos. Escolha-os em baixo.</div></div>';
  const qy=rd.qy.trim().toLowerCase(),by={}; all.forEach(q=>{ if(!qy||nameOf(q.id).toLowerCase().includes(qy)||q.id.toLowerCase().includes(qy)||q.cls.toLowerCase().includes(qy)) (by[q.cls] ||= []).push(q); });
  const grp=CLASS_ORDER.filter(k=>by[k]).map(k=>`<div class="rdgrp"><span class="lab">${k}</span><div class="rdchips">${by[k].map(q=>`<button class="chip" data-rd="${esc(q.id)}" aria-pressed="${rd.ids.includes(q.id)}">${esc(nameOf(q.id))}</button>`).join('')}</div></div>`).join('');
  $('rdPick').innerHTML=grp||`<div class="empty">${all.length?'Nenhum ativo com esse nome.':'Sem cotações nesta vista.'}</div>`; }
async function initRadarStore(db){ let uid=null; try{ const user=window.claude?.use?await window.claude.use('user'):null; uid=user?await user.id():null; }catch(e){}
  const local=()=>{ rd.mode='local'; rd.ref=null; const l=store('radar'); rd.ids=Array.isArray(l)?l:[]; if(st.view==='radar') renderMyRadar(); };
  if(!db||!uid) return local();
  try{ rd.ref=db.doc('data/users/'+uid+'/radar'); rd.mode='db'; rd.ref.onSnapshot(s=>{ const d=s.exists?s.data():null; rd.ids=Array.isArray(d?.ids)?d.ids.filter(x=>typeof x==='string').slice(0,40):[]; if(st.view==='radar') renderMyRadar(); },local); }catch(e){ local(); } }
function renderMovers(){ const l=Object.keys(st.quotes).map(id=>({id,z:zDay(id)})).filter(x=>x.z!=null&&isFinite(x.z)).sort((a,b)=>Math.abs(b.z)-Math.abs(a.z)).slice(0,6); if(!l.length) return;
  $('movers').innerHTML=l.map(x=>`<button class="kv" data-asset="${esc(x.id)}"><span>${esc(nameOf(x.id))}<small>${fmtChg(x.id,dayChg(x.id),true)} hoje</small></span><span class="v ${dc(x.z)}">${sg(x.z,1,'σ')}</span></button>`).join(''); }
function renderSurpIdx(){ const now=Date.now(),from=now-7*864e5,by={}; st.items.forEach(it=>{ if(it.a==null||it.f==null||it.ts>now||it.ts<from) return; const d=direction(it); if(!d||d.raw) return; const o=by[it.cur]||(by[it.cur]={s:0,w:0,n:0}); o.s+=Math.sign(d.d)*it.imp; o.w+=it.imp; o.n++; });
  const l=Object.entries(by).filter(([,o])=>o.n>=3).sort((a,b)=>b[1].n-a[1].n).slice(0,8).map(([k,o])=>({k,v:o.s/o.w,n:o.n})).sort((a,b)=>b.v-a.v);
  if(!st.items.length) return; $('surpIdx').innerHTML=l.length?`<div class="bars">${l.map(x=>`<div class="brow"><span><span class="cur">${esc(x.k)}</span> <span class="muted">${x.n} dados</span></span>${divBar(x.v,1)}<span class="num ${dc(x.v)}">${sg(x.v,2)}</span></div>`).join('')}</div>`:'<div class="empty">Ainda não há divulgações suficientes com previsão nos últimos 7 dias.</div>'; }
function renderPainel(){ renderBrief(); renderTimeline(); renderCards(); renderHeat(); renderBoard(); renderRisk(); renderMovers(); renderSurpIdx(); }

// ================= Calendário =================
function renderChips(){ const [a,b]=range(),cnt={}; st.items.forEach(i=>{ if(i.day>=a&&i.day<=b) cnt[i.cur]=(cnt[i.cur]||0)+1; });
  $('fCur').innerHTML=`<button class="chip" data-cur="*" aria-pressed="${st.cur.size===0}">Todas as moedas</button>`+Object.keys(cnt).sort((x,y)=>cnt[y]-cnt[x]).slice(0,18).map(k=>`<button class="chip" data-cur="${esc(k)}" aria-pressed="${st.cur.has(k)}">${esc(k)}<small>${cnt[k]}</small></button>`).join(''); }
function renderWeek(){ const t=today(),ws=addDays(weekStart(st.period==='day'&&st.dayPick?st.dayPick:t),st.period==='next'?7:0),[a,b]=range(); let h='';
  for(let i=0;i<7;i++){ const d=addDays(ws,i),ev=st.items.filter(x=>x.day===d),hi=ev.filter(x=>x.imp>=3).length; const [y,m,dd]=d.split('-').map(Number);
    h+=`<button data-day="${d}" class="${d===t?'tod':''}" aria-pressed="${a===d&&b===d}"><b>${fWd.format(new Date(Date.UTC(y,m-1,dd))).replace('.','')}</b><span>${ev.length} ev.${hi?` · <em>${hi} alta</em>`:''}</span></button>`; }
  $('week').innerHTML=h; }
function renderList(){
  const list=filtered(),box=$('list');
  const out=list.filter(i=>i.a!=null); let u=0,d=0,e=0; out.forEach(i=>{const x=direction(i); if(x&&x.d>0)u++; else if(x&&x.d<0)d++; else e++;});
  $('sum').innerHTML=`<span><b>${list.length}</b> eventos</span><span><b>${out.length}</b> saídos</span><span class="up">▲ <b>${u}</b> acima</span><span class="down">▼ <b>${d}</b> abaixo</span><span class="muted">= <b>${e}</b> em linha ou sem previsão</span><button class="help" data-help="impact" aria-label="Ajuda: como é calculado o impacto">?</button>`;
  $('calMeta').textContent=st.items.length?`${st.items.length} eventos em ${Object.keys(st.days).length} dias`:'';
  const emp=m=>`<div class="pb" style="padding-top:16px"><div class="empty">${m}</div></div>`;
  if(!st.items.length){ box.innerHTML=emp(st.dbOk===false?'Esta vista não consegue ler os dados. Abra a página em claude.ai com sessão iniciada.':'Ainda não há eventos guardados.'); return; }
  if(!list.length){ box.innerHTML=emp('Nenhum evento com estes filtros. Experimente o período "Tudo" ou limpe a pesquisa.'); return; }
  let html='',last='',n=0; const perDay={}; list.forEach(i=>perDay[i.day]=(perDay[i.day]||0)+1);
  for(const it of list){ if(n++>=st.limit) break;
    if(it.day!==last){ html+=`<div class="day"><span>${fDay.format(new Date(it.ts))}</span><span>${perDay[it.day]}</span></div>`; last=it.day; }
    html+=evRow(it,it.id===st.sel,4,true); }
  if(list.length>st.limit) html+=`<div class="moreb"><button class="btn" id="moreBtn">Mostrar mais ${Math.min(300,list.length-st.limit)} de ${list.length-st.limit}</button></div>`;
  box.innerHTML=html;
}
function mvRows(list,sign){ return list.slice().sort((x,y)=>Math.abs(y.v)-Math.abs(x.v)).map(e=>`<div class="mv"><span>${esc(e.l)}</span><span class="arrow ${dc(e.v*sign)}">${arrows(e.v*sign)}</span></div>`).join('')||'<span class="muted">Sem efeito relevante esperado.</span>'; }
function renderRead(){
  const box=$('read'),it=st.items.find(x=>x.id===st.sel);
  if(!it){ box.innerHTML='<h3>Leitura do evento</h3><p class="muted">Escolha um evento na lista para ver a surpresa e o impacto esperado em cada mercado.</p>'; return; }
  const E=effects(it),d=direction(it),past=it.ts<=Date.now(),talk=it.cat==='C'&&it.a==null&&it.f==null&&it.v==null;
  let verdict='',body='';
  if(E.info) body='<p class="muted">Relatório semanal das posições dos especuladores (CFTC). Mostra para onde os fundos estão posicionados. É um indicador de sentimento e não tem previsão.</p>';
  else if(d&&d.d){ const col=E.raw?'var(--warn)':d.d>0?'var(--up)':'var(--down)'; const lbl=E.raw?(d.d>0?'Acima do esperado':'Abaixo do esperado'):(d.d>0?`Leitura positiva para o ${it.cur}`:`Leitura negativa para o ${it.cur}`);
    verdict=`<div class="verdict" style="color:${col};background:color-mix(in srgb,${col} 10%,transparent)">${esc(lbl)}${d.diff!=null?` · ${d.diff>0?'+':''}${fv(it,d.diff)} face à ${d.ref}`:''}</div>`;
    body=`<div><span class="lab">Impacto esperado</span><div class="scen" style="grid-template-columns:minmax(0,1fr);margin-top:6px"><div>${mvRows(E.list,d.d)}</div></div></div>`; }
  else if(d){ verdict=`<div class="verdict" style="color:var(--flat);background:var(--sunk)">${d.weak!=null?`Sem previsão de consenso. Face ao anterior, a leitura foi ${d.weak>0?'mais forte':d.weak<0?'mais fraca':'igual'}.`:'Em linha com a previsão: impacto direcional reduzido.'}</div>`;
    if(d.weak) body=`<div><span class="lab">Viés fraco (face ao anterior)</span><div class="scen" style="grid-template-columns:minmax(0,1fr);margin-top:6px"><div>${mvRows(E.list,d.weak)}</div></div></div>`; }
  else { const a1=talk?'Tom mais duro':E.raw?'Acima do esperado':'Acima da previsão',a2=talk?'Tom mais suave':E.raw?'Abaixo do esperado':'Abaixo da previsão';
    body=`<div><span class="lab">${past?'Cenários (valor ainda não registado)':'Cenários possíveis'}</span><div class="scen" style="margin-top:6px"><div><b class="up">${a1}</b>${mvRows(E.list,1)}</div><div><b class="down">${a2}</b>${mvRows(E.list,-1)}</div></div></div>`; }
  const figs=talk||E.info&&it.v==null?'':`<div class="figs"><div class="fig"><div class="lab">Atual</div><div class="v ${dc(d?.d||0)}">${fv(it,it.a)}</div></div><div class="fig"><div class="lab">Previsão</div><div class="v">${fv(it,it.f)}</div></div><div class="fig"><div class="lab">Anterior</div><div class="v">${fv(it,it.v)}</div></div></div>`;
  box.innerHTML=`<div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><h3>${esc(it.n)}${bars(it.imp)}</h3><button class="help" data-help="impact" aria-label="Ajuda: impacto">?</button></div>
    <p class="muted" style="font-size:12.5px;margin-top:-6px">${esc(it.cur)}${it.co?', '+esc(it.co):''} · ${fDay.format(new Date(it.ts))}, ${fT.format(new Date(it.ts))}<br>${CATN[it.cat]||''}${it.ref?', referência: '+esc(it.ref):''}${it.p===-1?'. Valor mais alto é leitura fraca.':''}</p>
    ${figs}${!past?`<div class="cd" data-cd="${it.ts}" style="font-size:13px">${until(it.ts)}</div>`:''}${verdict}${body}
    <p class="muted" style="font-size:13px"><b style="color:var(--ink)">Porquê:</b> ${esc(E.raw&&it.cat!=='O'?MECH.B:MECH[it.cat]||MECH.A)}</p>`;
}
function renderCal(){ renderChips(); renderWeek(); renderList(); renderRead(); }

// ================= Mercados =================
const pkSeen={};
st.pgOff=new Set(Array.isArray(store('pgOff'))?store('pgOff'):[]);
const chgAbs=q=>q.kind==='yield'||q.chg==null||q.price==null?null:q.price-q.price/(1+q.chg/100);
function pxHtml(q,f){ if(q.cls==='Forex'&&/[.,]\d{5,}$/.test(f.p)) return f.p.slice(0,-1)+'<sup>'+f.p.slice(-1)+'</sup>'; return f.p; }
function paRow(q){ const f=fmtQ(q),id=q.id,fav=st.fav.has(id),p=q.price,o=pkSeen[id]; pkSeen[id]=p; const fl=o!=null&&p!=null&&p!==o?(p>o?' tk-up':' tk-down'):'',ab=chgAbs(q),yl=q.kind==='yield';
  return `<div class="pa" role="button" tabindex="0" data-asset="${esc(id)}" aria-current="${id===st.asset}"><span class="nm"><button class="star" data-fav="${esc(id)}" aria-pressed="${fav}" aria-label="${fav?'Retirar dos favoritos':'Marcar como favorito'}: ${esc(nameOf(id))}">${ico(fav?IC.starFill:IC.star)}</button><span class="n">${esc(nameOf(id))}</span></span><span class="px${fl}">${pxHtml(q,f)}</span><span class="c ${dc(f.v)}">${yl?f.c:ab==null?'n/d':sg(ab,Math.min(qDec(q),4))}</span><span class="c ${dc(f.v)}">${yl?'':f.c}</span></div>`; }
function symDetails(){ const id=st.asset,q=st.quotes[id]; if(!q) return ''; const f=fmtQ(q),ab=chgAbs(q),yl=q.kind==='yield';
  const perf=[['1S',7],['1M',30],['3M',91]].map(([l,d])=>{ const x=chgSince(id,d),ok=x!=null&&isFinite(x); return `<div class="sdp ${ok?dc(x):'flat'}" style="${ok?`--pb:color-mix(in srgb,var(--${x>=0?'up':'down'}) ${Math.round(10+clamp(Math.abs(x)/(isY(id)?40:12),0,1)*26)}%,transparent)`:''}"><span>${l}</span><b>${ok?fmtChg(id,x):'n/d'}</b></div>`; }).join('');
  const T=techOf(id),V=techVotes(T);
  return `<div class="sdet"><div class="sd-h"><b>${esc(nameOf(id))}</b><span class="cur">${esc(q.cls)}</span></div><div class="sd-px"><span class="big">${pxHtml(q,f)}</span></div><div class="sd-c ${dc(f.v)}">${yl?f.c:(ab==null?'':sg(ab,Math.min(qDec(q),4))+' ')+f.c} <span class="muted">hoje</span></div><div class="sd-s"><i class="dot ${q.updatedAt&&(Date.now()-new Date(q.updatedAt))<90*6e4?'on':'stale'}"></i>Cotação atualizada ${ago(q.updatedAt)}</div><div class="sd-perf">${perf}</div>${V?`<div class="sd-t"><span class="muted">Sinal técnico</span>${ratingCell(V)}</div>`:''}</div>`; }
function renderPicker(){ const l=sortedQuotes(); if(!l.length) return;
  const by={}; l.forEach(q=>(by[q.cls] ||= []).push(q)); const fav=l.filter(q=>st.fav.has(q.id));
  const pk=$('picker'),old=pk.querySelector('.pk-list'),sl=old?old.scrollLeft:0,stp=old?old.scrollTop:0;
  const grp=(key,lab,rows)=>{ const off=st.pgOff.has(key); return `<div class="pgroup"><h4><button class="pg-t" data-pg="${esc(key)}" aria-expanded="${!off}"><svg class="ic" viewBox="0 0 256 256" aria-hidden="true"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>${esc(lab)}<small>${rows.length}</small></button></h4>${off?'':rows.map(paRow).join('')}</div>`; };
  pk.innerHTML='<div class="pk-top"><h2>Lista de vigilância</h2></div><div class="pk-head"><span>Símbolo</span><span>Último</span><span>Var.</span><span>Var. %</span></div><div class="pk-list">'+(fav.length?grp('Favoritos','Favoritos',fav):'')+CLASS_ORDER.filter(c=>by[c]).map(c=>grp(c,c,by[c])).join('')+'</div>'+symDetails();
  // a lista redesenha-se a cada cotação: repõe o scroll e, na fita horizontal dos ecrãs estreitos, garante que o ativo aberto fica à vista
  const nl=pk.querySelector('.pk-list'); nl.scrollTop=stp; nl.scrollLeft=sl; const cur=nl.querySelector('.pa[aria-current="true"]'); if(cur&&nl.scrollWidth>nl.clientWidth+4){ const a=cur.getBoundingClientRect(),b=nl.getBoundingClientRect(); if(a.left<b.left+8||a.right>b.right-8) nl.scrollLeft+=a.left-b.left-(b.width-a.width)/2; } }
let chartState=null;
// altura do gráfico, igual em todos os modos: 44% da janela em ecrãs largos (entre 340 e 440 px), para o gráfico mandar na ficha sem empurrar os números para fora do ecrã;
// fixa em telemóvel, onde a altura da janela muda com a barra do navegador
const chartH=W=>W<520?330:clamp(Math.round(innerHeight*.44),340,440);
function statBox(l,v,s,cls){ return `<div class="stat"><div class="lab">${l}</div><div class="v ${cls||''}">${v}</div>${s?`<small>${s}</small>`:''}</div>`; }
function techVotes(T){ if(!T) return null; const v=[]; if(T.trend!=null) v.push(T.trend); [T.d20,T.d50,T.d100].forEach(d=>{ if(d!=null&&isFinite(d)) v.push(d>0?1:d<0?-1:0); }); if(isFinite(T.rsi)) v.push(T.rsi>=70?-1:T.rsi<=30?1:0);
  if(v.length<3) return null; const sc=mean(v),buy=v.filter(x=>x>0).length,sell=v.filter(x=>x<0).length;
  return {sc,buy,sell,neu:v.length-buy-sell,lab:sc>=.6?'Compra forte':sc>=.2?'Compra':sc>-.2?'Neutro':sc>-.6?'Venda':'Venda forte',cl:sc>=.2?'up':sc<=-.2?'down':''}; }
const ratingCell=V=>V?`<span class="rt ${V.cl}">${V.cl==='up'?'▲':V.cl==='down'?'▼':'='} ${V.lab}</span>`:'<span class="muted">n/d</span>';
function techGauge(T){ const V=techVotes(T); if(!V) return ''; const {sc,buy,sell,neu,lab,cl}=V,a=Math.PI*(1-(sc+1)/2),nx=100+62*Math.cos(a),ny=100-62*Math.sin(a);
  return `<div class="tg-gauge"><svg class="gauge" style="width:210px" viewBox="0 0 200 112" role="img" aria-label="${lab}: ${buy} sinais de compra, ${neu} neutros, ${sell} de venda"><defs><linearGradient id="tgg" x1="0" x2="1" y1="0" y2="0"><stop offset="0" style="stop-color:var(--down)"/><stop offset=".5" style="stop-color:var(--flat)"/><stop offset="1" style="stop-color:var(--up)"/></linearGradient></defs><path d="M16 100 A84 84 0 0 1 184 100" fill="none" style="stroke:var(--sunk)" stroke-width="12" stroke-linecap="round"/><path d="M16 100 A84 84 0 0 1 184 100" fill="none" stroke="url(#tgg)" stroke-width="6" stroke-linecap="round"/><line x1="100" y1="100" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" style="stroke:var(--ink)" stroke-width="3" stroke-linecap="round"/><circle cx="100" cy="100" r="5" style="fill:var(--ink)"/></svg><div class="riskv ${cl}">${lab}</div><div class="tvote"><span class="down">Venda ${sell}</span><span>Neutro ${neu}</span><span class="up">Compra ${buy}</span></div></div>`; }
function renderAsset(animate){
  const id=st.asset,q=st.quotes[id],label=nameOf(id),y=isY(id),dec=qDec(q);
  $('aName').textContent=label; $('aAge').textContent=q?q.cls+'. Cotação atualizada '+ago(q.updatedAt)+', com atraso.':'';
  const f=q?fmtQ(q):null; $('aPrice').textContent=f?f.p:'n/d'; $('aChg').textContent=f?f.c+' hoje':''; $('aChg').className='num '+dc(f?.v);
  $('aNote').textContent=q?.note||''; $('aNote').hidden=!q?.note;
  renderCmpBar(); drawChart(animate);
  const T=techOf(id),pv=v=>y?nf(v,2)+'%':nf(v,dec),pd=x=>x==null?'':(y?sg(x,0,' pb'):sg(x,1,'%'))+' face ao preço';
  $('tech').innerHTML=!T?'<div class="pb" style="grid-column:1/-1;padding-top:16px"><div class="empty">Sem histórico suficiente para calcular indicadores.</div></div>':
    statBox('Tendência',T.trend==null?'n/d':T.trend>0?'Alta':T.trend<0?'Baixa':'Mista',T.trend==null?'':T.trend>0?'preço > MM20 > MM50':T.trend<0?'preço < MM20 < MM50':'médias cruzadas',T.trend>0?'up':T.trend<0?'down':'')+
    statBox('MM20',pv(T.m20),pd(T.d20))+statBox('MM50',isFinite(T.m50)?pv(T.m50):'n/d',pd(T.d50))+statBox('MM100',isFinite(T.m100)?pv(T.m100):'n/d',pd(T.d100))+
    `<div class="stat"><div class="lab">RSI 14</div><div class="v">${nf(T.rsi,0)}</div><div class="rsi" role="img" aria-label="RSI ${nf(T.rsi,0)} de 100"><i style="left:${clamp(T.rsi,0,100)}%"></i></div><small style="margin-top:4px">${T.rsi>=70?'sobrecomprado':T.rsi<=30?'sobrevendido':'zona neutra'}</small></div>`+
    statBox('Desvio à média',sg(T.z,1,'σ'),Math.abs(T.z)>=2?'esticado face à MM20':'dentro do habitual')+
    statBox('Volatilidade 20 d',y?nf(T.vol20,0)+' pb':nf(T.vol20,1)+'%',`1σ num dia: ±${y?nf(T.move,1)+' pb':nf(T.move,dec)} · 60 d: ${y?nf(T.vol60,0)+' pb':nf(T.vol60,1)+'%'}`)+
    statBox('Gama de 6 meses',nf(T.pos,0)+'%',`mín. ${pv(T.lo)} · máx. ${pv(T.hi)}`);
  $('tgauge').innerHTML=T?techGauge(T):'';
  const col=COLS.find(c=>c.id===id);
  $('aBars').innerHTML=col?Object.entries(MX).map(([k,s])=>({k,v:s[id]||0})).filter(x=>x.v).sort((a,b)=>Math.abs(b.v)-Math.abs(a.v)).map(r=>`<div class="brow w"><span>${esc(r.k)}</span>${divBar(r.v,2)}<span class="num ${dc(r.v)}">${r.v>0?'+':'−'}${Math.abs(r.v)}</span></div>`).join(''):'<p class="muted">Este ativo não está na matriz de sensibilidade. Veja ao lado os eventos que o afetam segundo o modelo de impacto.</p>';
  const cs=Object.keys(st.quotes).filter(o=>o!==id).map(o=>({o,c:corr(id,o,60)})).filter(x=>isFinite(x.c)).sort((a,b)=>b.c-a.c); const pick=cs.length>6?[...cs.slice(0,3),...cs.slice(-3)]:cs;
  $('aCorr').innerHTML=pick.length?pick.map(x=>{ const w=Math.abs(x.c)*50; return `<div class="brow w" data-asset="${esc(x.o)}" role="button" tabindex="0" style="cursor:pointer"><span>${esc(nameOf(x.o))}</span><span class="track"><span class="fill" style="left:${x.c>0?50:50-w}%;width:${w}%;background:var(--${x.c>0?'pos':'neg'})"></span></span><span class="num">${sg(x.c,2)}</span></div>`; }).join(''):'<p class="muted">Sem histórico suficiente.</p>';
  const now=Date.now();
  const nx=st.items.filter(it=>it.ts>now).map(it=>({it,e:effects(it).list.find(e=>e.l===label)})).filter(x=>x.e).sort((a,b)=>(b.it.imp-a.it.imp)||(a.it.ts-b.it.ts)).slice(0,6).sort((a,b)=>a.it.ts-b.it.ts);
  $('aWatch').innerHTML=nx.map(({it,e})=>`<button class="kv" data-ev="${esc(it.id)}"><span><span class="cur">${esc(it.cur)}</span> ${esc(it.n)}${bars(it.imp)}<small class="eff ${dc(e.v)}">se acima: ${arrows(e.v)}</small></span><span class="v cd" data-cd="${it.ts}">${until(it.ts)}</span></button>`).join('')||'<p class="muted pb">Nenhum evento relevante nas próximas semanas.</p>';
  const rc=st.items.filter(it=>it.a!=null&&it.ts<=now).map(it=>({it,e:effects(it).list.find(e=>e.l===label),d:direction(it)})).filter(x=>x.e&&x.d&&x.d.d).slice(-6).reverse();
  $('aRecent').innerHTML=rc.map(({it,e,d})=>`<button class="kv" data-ev="${esc(it.id)}"><span><span class="cur">${esc(it.cur)}</span> ${esc(it.n)}<small class="eff ${dc(e.v*d.d)}">${arrows(e.v*d.d)} ${e.v*d.d>0?'pressão em alta':'pressão em baixa'}</small></span><span class="v t">${fShort.format(new Date(it.ts))}</span></button>`).join('')||'<p class="muted pb">Sem surpresas relevantes registadas.</p>';
}
const dayT=d=>{ const [y,m,dd]=d.split('-').map(Number); return Math.min(Date.UTC(y,m-1,dd)+21*36e5,Date.now()-60e3); };
// ---------- comparação na ficha: até três ativos sobre o principal, em variação desde o início do intervalo ----------
function renderCmpBar(){ const y=isY(st.asset); st.cmpA=st.cmpA.map(id=>id&&st.quotes[id]&&id!==st.asset&&isY(id)===y?id:null);
  const on=st.cmpA.filter(Boolean),opts=sortedQuotes().filter(q=>q.id!==st.asset&&isY(q.id)===y&&!st.cmpA.includes(q.id)),by={}; opts.forEach(q=>(by[q.cls] ||= []).push(q));
  $('maSeg').hidden=on.length>0; $('ctSeg').hidden=on.length>0; document.querySelector('#v-mercados .legend').hidden=on.length>0;
  $('cmpA').innerHTML=(on.length?'<span class="lab">A comparar com</span>':'')+st.cmpA.map((id,i)=>id?`<button class="chip cmpc" data-cmpx="${esc(id)}" aria-label="Retirar ${esc(nameOf(id))} da comparação"><i style="background:var(--c${i+1})"></i>${esc(nameOf(id))}${ico(IC.x)}</button>`:'').join('')
    +(on.length>=3?'<span class="cmp-n">máximo de três</span>':opts.length?`<select class="inp" id="cmpAdd" aria-label="Comparar com outro ativo"><option value="">${on.length?'Adicionar…':'Comparar com…'}</option>${CLASS_ORDER.filter(k=>by[k]).map(k=>`<optgroup label="${k}">${by[k].map(q=>`<option value="${esc(q.id)}">${esc(nameOf(q.id))}</option>`).join('')}</optgroup>`).join('')}</select>`:'')
    +(y?'<span class="cmp-n">só entre obrigações, em pontos base</span>':''); }
function drawCmpChart(){
  const svg=$('chart'),box=$('chartbox'),W=Math.max(300,box.clientWidth),H=chartH(W),padL=50,padR=W<520?60:112,padT=14,padB=30,y=isY(st.asset),cut=Date.now()-st.range*864e5,u=y?' pb':'%',dd=y?0:1;
  const norm=id=>{ const all=series(id),s=st.range>=999?all:all.filter(q=>q.t>=cut); if(s.length<2) return null; const v0=s[0].v; return s.map(q=>({t:q.t,v:y?(q.v-v0)*100:(q.v/v0-1)*100})); };
  const main=norm(st.asset); if(!main) return false;
  const all=[...st.cmpA.map((id,i)=>id?{id,col:`var(--c${i+1})`,p:norm(id)}:null).filter(o=>o&&o.p),{id:st.asset,main:true,col:'var(--ink)',p:main}];
  svg.setAttribute('height',H); svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  const t0=Math.min(...all.map(s=>s.p[0].t)),t1=Math.max(...all.map(s=>s.p[s.p.length-1].t)); let mn=Math.min(0,...all.flatMap(s=>s.p.map(q=>q.v))),mx=Math.max(0,...all.flatMap(s=>s.p.map(q=>q.v))); const pad=(mx-mn||1)*.08; mn-=pad; mx+=pad;
  const X=t=>padL+(t-t0)/(t1-t0||1)*(W-padL-padR),Y=v=>padT+(1-(v-mn)/(mx-mn))*(H-padT-padB); let g='';
  for(let i=0;i<=4;i++){ const v=mn+(mx-mn)*i/4,yy=Y(v); g+=`<line x1="${padL}" x2="${W-padR}" y1="${yy.toFixed(1)}" y2="${yy.toFixed(1)}" style="stroke:var(--line)" stroke-dasharray="2 4"/><text x="${padL-8}" y="${(yy+4).toFixed(1)}" font-size="11" text-anchor="end" style="fill:var(--muted);font-family:var(--f-data)">${sg(v,dd)}${y?"":"%"}</text>`; }
  g+=`<line x1="${padL}" x2="${W-padR}" y1="${Y(0).toFixed(1)}" y2="${Y(0).toFixed(1)}" style="stroke:var(--line-2)"/>`;
  const nT=W<520?3:5; for(let i=0;i<=nT;i++){ const t=t0+(t1-t0)*i/nT; g+=`<text x="${X(t).toFixed(1)}" y="${H-padB+18}" font-size="11" text-anchor="${i===0?'start':i===nT?'end':'middle'}" style="fill:var(--muted)">${st.range<=7?fShortT.format(new Date(t)):fShort.format(new Date(t))}</text>`; }
  const d=s=>'M'+s.p.map(q=>X(q.t).toFixed(1)+','+Y(q.v).toFixed(1)).join('L');
  const lines=all.map(s=>`<path d="${d(s)}" ${s.main?'id="cline" ':''}fill="none" style="stroke:${s.col}${s.main?`;filter:drop-shadow(0 0 6px ${s.col})`:''}" stroke-width="${s.main?2.2:1.7}" stroke-linejoin="round" stroke-linecap="round"/>`).join('');
  const ends=all.map(s=>({s,v:s.p[s.p.length-1].v,y:Y(s.p[s.p.length-1].v)})).sort((a,b)=>a.y-b.y); for(let i=1;i<ends.length;i++) if(ends[i].y-ends[i-1].y<14) ends[i].y=ends[i-1].y+14;
  const over=ends[ends.length-1].y-(H-padB); if(over>0) ends.forEach(e=>e.y-=over);
  const labs=ends.map(e=>`<text x="${W-padR+8}" y="${(e.y+4).toFixed(1)}" font-size="11.5" style="fill:var(--ink)${e.s.main?';font-weight:600':''}"><tspan style="fill:${e.s.col}">●</tspan> ${W<520?'':esc(SHORT[e.s.id]||nameOf(e.s.id))+' '}<tspan style="font-family:var(--f-data)">${sg(e.v,dd,u)}</tspan></text>`).join('');
  svg.innerHTML=g+lines+labs+`<line id="xh" y1="${padT}" y2="${H-padB}" style="stroke:var(--muted)" stroke-dasharray="3 3" opacity="0"/><rect id="hit" x="${padL}" y="${padT}" width="${W-padL-padR}" height="${H-padT-padB}" fill="transparent"/>`;
  chartState={cmp:true,all,X,W,H,t0,t1,padL,padR,u,dd,pts:main.map(q=>[X(q.t),Y(q.v)])};
  $('stats').innerHTML=all.slice().reverse().map(s=>statBox(esc(nameOf(s.id)),sg(s.p[s.p.length-1].v,y?0:2,u),s.main?'ativo em análise':'no mesmo intervalo',dc(s.p[s.p.length-1].v))).join('');
  return true; }
function cmpAMove(ev){ const svg=$('chart'),r=svg.getBoundingClientRect(),{all,X,W,t0,t1,padL,padR,u,dd}=chartState,x=clamp((ev.clientX-r.left)*(W/r.width),padL,W-padR),t=t0+(x-padL)/(W-padL-padR)*(t1-t0);
  const rows=all.slice().reverse().map(s=>{ let b=s.p[0]; for(const q of s.p){ if(Math.abs(q.t-t)<Math.abs(b.t-t)) b=q; } return {s,b}; }),ref=rows[0].b,xx=X(ref.t),xh=$('xh'),tip=$('tip');
  xh.setAttribute('x1',xx); xh.setAttribute('x2',xx); xh.setAttribute('opacity',1);
  tip.innerHTML=(st.range<=7?fShortT:fShort).format(new Date(ref.t))+'<br>'+rows.map(o=>`<span style="color:${o.s.col}">●</span> ${esc(SHORT[o.s.id]||nameOf(o.s.id))} <b>${sg(o.b.v,dd,u)}</b>`).join('<br>');
  tip.style.left=Math.min(Math.max(xx*(r.width/W),90),r.width-90)+'px'; tip.style.top=(r.height/2)+'px'; tip.style.opacity=1; }
// ---------- velas: construídas só com fechos diários (não há abertura, máximo nem mínimo de cada sessão) ----------
// Intervalos curtos: uma vela por dia, do fecho anterior ao fecho, sem pavios.
// Intervalos longos: uma vela por semana; os pavios são o fecho diário mais alto e mais baixo da semana.
function drawCandles(){ const id=st.asset,all=daily(id); if(all.length<3) return false;
  const svg=$('chart'),box=$('chartbox'),W=Math.max(300,box.clientWidth),H=chartH(W),padL=8,padR=62,padT=14,padB=30,y=isY(id),q=st.quotes[id],dec=y?3:qDec(q),weekly=st.range>31,cutD=st.range>=999?'0000':addDays(today(),-st.range);
  let i0=all.findIndex(d=>d.d>=cutD); if(i0<1) i0=1; const days=all.slice(i0); if(days.length<2) return false;
  const cs=[]; if(!weekly) days.forEach((d,k)=>{ const o=all[i0+k-1].v; cs.push({o,c:d.v,h:Math.max(o,d.v),l:Math.min(o,d.v),lab:d.d,ds:[d.d]}); });
  else { let cur=null,prev=all[i0-1].v; days.forEach(d=>{ const w=weekStart(d.d); if(!cur||cur.w!==w){ if(cur) prev=cur.c; cur={w,o:prev,c:d.v,h:Math.max(prev,d.v),l:Math.min(prev,d.v),lab:w,ds:[]}; cs.push(cur); } cur.c=d.v; cur.h=Math.max(cur.h,d.v); cur.l=Math.min(cur.l,d.v); cur.ds.push(d.d); }); }
  svg.setAttribute('height',H); svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  const n=cs.length,band=(W-padL-padR)/n,bw=clamp(band*.62,2,24),xd=new Map(); cs.forEach((k,i)=>{ k.x=padL+band*(i+.5); k.ds.forEach((d,jj)=>xd.set(d,padL+band*i+band*(jj+.5)/k.ds.length)); });
  const mas=[20,50].filter(x=>st.ma.has(x)).map(x=>({col:x===20?'var(--c1)':'var(--c2)',p:smaSeries(all,x).filter(d=>xd.has(d.d))}));
  let mn=Math.min(...cs.map(k=>k.l),...mas.flatMap(a=>a.p.map(d=>d.v))),mx=Math.max(...cs.map(k=>k.h),...mas.flatMap(a=>a.p.map(d=>d.v))); const pad=(mx-mn||mx*.01)*.08; mn-=pad; mx+=pad;
  const Y=v=>padT+(1-(v-mn)/(mx-mn))*(H-padT-padB); let g='';
  for(let i=0;i<=4;i++){ const v=mn+(mx-mn)*i/4,yy=Y(v); g+=`<line x1="${padL}" x2="${W-padR}" y1="${yy.toFixed(1)}" y2="${yy.toFixed(1)}" style="stroke:var(--line)" stroke-dasharray="${i===0?'0':'2 4'}"/><text x="${W-padR+8}" y="${(yy+4).toFixed(1)}" font-size="11" style="fill:var(--muted);font-family:var(--f-data)">${nf(v,Math.min(dec,3))}</text>`; }
  const dl=s=>{ const [yy,mm,dd]=s.split('-').map(Number); return fWd2.format(new Date(Date.UTC(yy,mm-1,dd))); },nT=Math.min(W<520?3:5,n-1);
  for(let i=0;i<=nT;i++){ const k=cs[Math.round(i*(n-1)/nT)]; g+=`<text x="${k.x.toFixed(1)}" y="${H-padB+18}" font-size="11" text-anchor="${i===0?'start':i===nT?'end':'middle'}" style="fill:var(--muted)">${dl(k.lab)}</text>`; }
  const body=cs.map(k=>{ const up=k.c>=k.o,col=up?'var(--up)':'var(--down)',t=Y(Math.max(k.o,k.c)),hh=Math.max(1.5,Math.abs(Y(k.o)-Y(k.c))); return `<g class="cnd">${k.h>Math.max(k.o,k.c)||k.l<Math.min(k.o,k.c)?`<line x1="${k.x.toFixed(1)}" x2="${k.x.toFixed(1)}" y1="${Y(k.h).toFixed(1)}" y2="${Y(k.l).toFixed(1)}" style="stroke:${col}" stroke-width="1.3"/>`:''}<rect x="${(k.x-bw/2).toFixed(1)}" y="${t.toFixed(1)}" width="${bw.toFixed(1)}" height="${hh.toFixed(1)}" rx="1.5" style="fill:${col}"/></g>`; }).join('');
  const maP=mas.map(a=>a.p.length>1?`<path d="M${a.p.map(d=>xd.get(d.d).toFixed(1)+','+Y(d.v).toFixed(1)).join('L')}" fill="none" style="stroke:${a.col}" stroke-width="1.4" stroke-linejoin="round"/>`:'').join('');
  const label=nameOf(id); let mk='';
  st.items.filter(it=>it.imp>=3).forEach(it=>{ const x=xd.get(fISO.format(new Date(it.ts))); if(x==null) return; const e=effects(it).list.find(z=>z.l===label); if(!e) return; const d=direction(it),col=it.a==null?'var(--warn)':d&&d.d?(e.v*d.d>0?'var(--up)':'var(--down)'):'var(--flat)';
    mk+=`<circle class="evdot" data-ev="${esc(it.id)}" cx="${x.toFixed(1)}" cy="${(H-padB-7).toFixed(1)}" r="4.5" style="fill:${col};stroke:var(--surface)" stroke-width="2"><title>${esc(it.cur+' · '+it.n)}</title></circle>`; });
  svg.innerHTML=g+`<rect id="chl" y="${padT}" width="${band.toFixed(1)}" height="${H-padT-padB}" style="fill:var(--ink)" opacity="0"/>`+body+maP+`<rect id="hit" x="${padL}" y="${padT}" width="${W-padL-padR}" height="${H-padT-padB-14}" fill="transparent"/>`+mk;
  chartState={candle:true,cs,W,H,dec,y,weekly,Y,band,dl};
  const v0=cs[0].o,v1=cs[n-1].c,hi=Math.max(...cs.map(k=>k.h)),lo=Math.min(...cs.map(k=>k.l)),d4=Math.min(dec,4);
  $('stats').innerHTML=statBox('Variação no intervalo',y?sg((v1-v0)*100,0,' pb'):sg((v1/v0-1)*100,2,'%'),'',dc(v1-v0))+statBox(weekly?'Fecho mais alto':'Máximo',nf(hi,d4))+statBox(weekly?'Fecho mais baixo':'Mínimo',nf(lo,d4))+statBox('Início do intervalo',nf(v0,d4));
  $('cNote').textContent=weekly?'Cada vela é uma semana, do fecho da semana anterior ao fecho da semana. Os pavios marcam o fecho diário mais alto e mais baixo, não os extremos intradiários, que os dados não têm.':'Cada vela vai do fecho do dia anterior ao fecho do dia. Não tem pavios porque os dados só têm fechos diários.';
  return true; }
function candleMove(ev){ const svg=$('chart'),r=svg.getBoundingClientRect(),{cs,W,H,dec,y,weekly,Y,band,dl}=chartState,x=(ev.clientX-r.left)*(W/r.width); let k=cs[0]; for(const q of cs){ if(Math.abs(q.x-x)<Math.abs(k.x-x)) k=q; }
  const f=v=>y?nf(v,3)+'%':nf(v,Math.min(dec,4)),ch=y?(k.c-k.o)*100:(k.c/k.o-1)*100,hl=$('chl'),tip=$('tip'); hl.setAttribute('x',(k.x-band/2).toFixed(1)); hl.setAttribute('opacity',.06);
  tip.innerHTML=(weekly?'Semana de '+dl(k.lab):dl(k.lab))+`<br>Fecho <b>${f(k.c)}</b> <span class="${dc(ch)}">${sg(ch,y?0:2,y?' pb':'%')}</span><br><span style="opacity:.8">Fecho anterior ${f(k.o)}</span>`+(weekly?`<br><span style="opacity:.8">Fechos entre ${f(k.l)} e ${f(k.h)}</span>`:'');
  tip.style.left=Math.min(Math.max(k.x*(r.width/W),100),r.width-100)+'px'; tip.style.top=(Math.max(Y(k.h),96)*(r.height/H))+'px'; tip.style.opacity=1; }
function drawChart(animate){ $('tip').style.opacity=0; const cn=$('cNote'); if(st.cmpA.some(Boolean)&&drawCmpChart()){ cn.hidden=true; return; } if(st.ctype==='candle'&&drawCandles()){ cn.hidden=false; return; } cn.hidden=true;
  const svg=$('chart'),box=$('chartbox'),W=Math.max(300,box.clientWidth),H=chartH(W),padL=8,padR=62,padT=14,padB=30;
  svg.setAttribute('height',H); svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  const all=series(st.asset); const cut=Date.now()-st.range*864e5; const s=st.range>=999?all:all.filter(p=>p.t>=cut);
  if(s.length<2){ svg.innerHTML=`<text x="${W/2}" y="${H/2}" text-anchor="middle" style="fill:var(--muted)" font-size="13">Sem histórico suficiente para este intervalo.</text>`; $('stats').innerHTML=''; chartState=null; return; }
  const t0=s[0].t,t1=s[s.length-1].t; const mas=[20,50].filter(n=>st.ma.has(n)).map((n,i)=>({n,col:n===20?'var(--c1)':'var(--c2)',p:smaSeries(daily(st.asset),n).map(p=>({t:dayT(p.d),v:p.v})).filter(p=>p.t>=t0&&p.t<=t1)}));
  const vs=s.map(p=>p.v).concat(...mas.map(m=>m.p.map(p=>p.v))); let mn=Math.min(...vs),mx=Math.max(...vs); const pad=(mx-mn||mx*.01)*.08; mn-=pad; mx+=pad;
  const X=t=>padL+(t-t0)/(t1-t0||1)*(W-padL-padR), Y=v=>padT+(1-(v-mn)/(mx-mn))*(H-padT-padB);
  const up=s[s.length-1].v>=s[0].v, colr=up?'var(--up)':'var(--down)';
  const q=st.quotes[st.asset]; const dec=q?.kind==='yield'?3:(q?.dec??(s[0].v<10?4:2));
  let g='';
  for(let i=0;i<=4;i++){ const v=mn+(mx-mn)*i/4,y=Y(v); g+=`<line x1="${padL}" x2="${W-padR}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" style="stroke:var(--line)" stroke-dasharray="${i===0?'0':'2 4'}"/><text x="${W-padR+8}" y="${(y+4).toFixed(1)}" font-size="11" style="fill:var(--muted);font-family:var(--f-data)">${nf(v,Math.min(dec,3))}</text>`; }
  const nT=W<520?3:5; for(let i=0;i<=nT;i++){ const t=t0+(t1-t0)*i/nT,x=X(t); g+=`<text x="${x.toFixed(1)}" y="${H-padB+18}" font-size="11" text-anchor="${i===0?'start':i===nT?'end':'middle'}" style="fill:var(--muted)">${st.range<=7?fShortT.format(new Date(t)):fShort.format(new Date(t))}</text>`; }
  const pts=s.map(p=>[X(p.t),Y(p.v)]); const line='M'+pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join('L');
  const area=line+`L${pts[pts.length-1][0].toFixed(1)},${(H-padB).toFixed(1)}L${pts[0][0].toFixed(1)},${(H-padB).toFixed(1)}Z`;
  const maP=mas.map(m=>m.p.length>1?`<path d="M${m.p.map(p=>X(p.t).toFixed(1)+','+Y(p.v).toFixed(1)).join('L')}" fill="none" style="stroke:${m.col}" stroke-width="1.4" stroke-linejoin="round"/>`:'').join('');
  const label=nameOf(st.asset),now=Date.now(); let mk='';
  st.items.filter(it=>it.imp>=3&&it.ts>=t0&&it.ts<=t1+864e5).forEach(it=>{ const e=effects(it).list.find(x=>x.l===label); if(!e) return; const d=direction(it); const c=it.a==null?'var(--warn)':d&&d.d?(e.v*d.d>0?'var(--up)':'var(--down)'):'var(--flat)'; const x=Math.min(X(it.ts),W-padR);
    mk+=`<circle class="evdot" data-ev="${esc(it.id)}" cx="${x.toFixed(1)}" cy="${(H-padB-7).toFixed(1)}" r="4.5" style="fill:${c};stroke:var(--surface)" stroke-width="2"><title>${esc(it.cur+' · '+it.n)}</title></circle>`; });
  const last=pts[pts.length-1];
  svg.innerHTML=`<defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:${colr}" stop-opacity=".18"/><stop offset="1" style="stop-color:${colr}" stop-opacity="0"/></linearGradient></defs>${g}
    <path d="${area}" fill="url(#cg)"/>${maP}<path d="${line}" id="cline" fill="none" style="stroke:${colr};filter:drop-shadow(0 0 6px ${colr})" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="4" style="fill:${colr};stroke:var(--surface)" stroke-width="2"/>
    <line id="xh" y1="${padT}" y2="${H-padB}" style="stroke:var(--muted)" stroke-dasharray="3 3" opacity="0"/><circle id="xd" r="4.5" style="fill:var(--surface);stroke:${colr}" stroke-width="2" opacity="0"/>
    <rect id="hit" x="${padL}" y="${padT}" width="${W-padL-padR}" height="${H-padT-padB-14}" fill="transparent"/>${mk}`;
  chartState={s,pts,dec,W,H};
  const v0=s[0].v,v1=s[s.length-1].v,hi=Math.max(...s.map(p=>p.v)),lo=Math.min(...s.map(p=>p.v)),ch=(v1/v0-1)*100,isYl=q?.kind==='yield',d4=Math.min(dec,4);
  $('stats').innerHTML=statBox('Variação no intervalo',isYl?sg((v1-v0)*100,0,' pb'):sg(ch,2,'%'),'',dc(v1-v0))+statBox('Máximo',nf(hi,d4))+statBox('Mínimo',nf(lo,d4))+statBox('Início do intervalo',nf(v0,d4));
}
function chartMove(ev){ if(!chartState) return; if(chartState.bars) return barsMove(ev); if(chartState.cmp) return cmpAMove(ev); if(chartState.candle) return candleMove(ev); const svg=$('chart'),r=svg.getBoundingClientRect(); const x=(ev.clientX-r.left)*(chartState.W/r.width);
  const {s,pts}=chartState; let i=0,best=1e9; pts.forEach((p,k)=>{const dd=Math.abs(p[0]-x); if(dd<best){best=dd;i=k;}});
  const p=pts[i],xh=$('xh'),xd=$('xd'),tip=$('tip'); xh.setAttribute('x1',p[0]); xh.setAttribute('x2',p[0]); xh.setAttribute('opacity',1); xd.setAttribute('cx',p[0]); xd.setAttribute('cy',p[1]); xd.setAttribute('opacity',1);
  const q=st.quotes[st.asset],isYl=q?.kind==='yield',v=s[i].v,v0=s[0].v,ch=isYl?(v-v0)*100:(v/v0-1)*100;
  tip.innerHTML=`${(Date.now()-s[i].t<3*864e5||st.range<=7)?fShortT.format(new Date(s[i].t)):fShort.format(new Date(s[i].t))}<br><b>${isYl?nf(v,3)+'%':nf(v,Math.min(chartState.dec,4))}</b> <span style="opacity:.8">${sg(ch,isYl?0:2,isYl?' pb':'%')}</span>`;
  tip.style.left=Math.min(Math.max(p[0]*(r.width/chartState.W),60),r.width-60)+'px'; tip.style.top=(p[1]*(r.height/chartState.H))+'px'; tip.style.opacity=1; }
function chartLeave(){ $('tip').style.opacity=0; $('chl')?.setAttribute('opacity',0); $('xh')?.setAttribute('opacity',0); $('xd')?.setAttribute('opacity',0); $('cx')?.setAttribute('opacity',0); if(chartState?.bars) clgSet(null); }

// ================= Análise =================
const SCOLS=[['cls','Ativo'],['px','Último'],['d1','Dia'],['w','1S'],['m','1M'],['q','3M'],['h','6M'],['v20','Vol. 20d'],['v60','Vol. 60d'],['mv','1σ dia'],['rsi','RSI 14'],['hi','Do máx.'],['rt','Técnica']];
const CAP={d1:[2,10],w:[4,20],m:[8,40],q:[15,60],h:[25,100]};
function hmCell(id,x,k){ if(x==null||!isFinite(x)) return '<td class="muted">n/d</td>'; const cap=CAP[k][isY(id)?1:0],p=Math.round(clamp(Math.abs(x)/cap,0,1)*40); return `<td><span class="hm" style="background:color-mix(in srgb,var(--${x>=0?'up':'down'}) ${p}%,transparent)">${fmtChg(id,x,k==='d1')}</span></td>`; }
function renderScreen(){ const l=sortedQuotes(); if(!l.length){ $('screen').innerHTML='<tbody><tr><td class="muted" style="font-family:var(--f-body)">Sem cotações.</td></tr></tbody>'; return; }
  const rows=l.map(q=>{ const id=q.id,T=techOf(id)||{}; return {id,q,cls:CLASS_ORDER.indexOf(q.cls),px:q.price,d1:dayChg(id),w:chgSince(id,7),m:chgSince(id,30),q3:chgSince(id,91),h:chgSince(id,182),v20:T.vol20,v60:T.vol60,mv:T.move,rsi:T.rsi,hi:T.fromHi,V:techVotes(techOf(id)),rt:techVotes(techOf(id))?.sc}; });
  const k=st.sort.k==='q'?'q3':st.sort.k; if(st.sort.k!=='cls') rows.sort((a,b)=>{ const x=a[k],y=b[k]; if(x==null||!isFinite(x)) return 1; if(y==null||!isFinite(y)) return -1; return (x-y)*st.sort.dir; });
  let h='<thead><tr>'+SCOLS.map(([key,lab])=>`<th${st.sort.k===key&&key!=='cls'?` aria-sort="${st.sort.dir>0?'ascending':'descending'}"`:''}><button data-sort="${key}">${lab}${st.sort.k===key&&key!=='cls'?(st.sort.dir>0?' ↑':' ↓'):''}</button></th>`).join('')+'</tr></thead><tbody>',cls=-1;
  for(const r of rows){ const id=r.id,y=isY(id); if(st.sort.k==='cls'&&r.cls!==cls){ cls=r.cls; h+=`<tr class="grp"><td colspan="${SCOLS.length}">${esc(r.q.cls)}</td></tr>`; }
    h+=`<tr data-asset="${esc(id)}" tabindex="0" role="link"><td>${esc(nameOf(id))}</td><td>${fmtQ(r.q).p}</td>${hmCell(id,r.d1,'d1')}${hmCell(id,r.w,'w')}${hmCell(id,r.m,'m')}${hmCell(id,r.q3,'q')}${hmCell(id,r.h,'h')}<td>${isFinite(r.v20)?(y?nf(r.v20,0)+' pb':nf(r.v20,1)+'%'):'n/d'}</td><td>${isFinite(r.v60)?(y?nf(r.v60,0)+' pb':nf(r.v60,1)+'%'):'n/d'}</td><td>${isFinite(r.mv)?'±'+(y?nf(r.mv,1)+' pb':nf(r.mv,qDec(r.q))):'n/d'}</td><td${r.rsi>=70||r.rsi<=30?' style="color:var(--warn);font-weight:600"':''}>${nf(r.rsi,0)}</td><td>${fmtChg(id,r.hi)}</td><td>${ratingCell(r.V)}</td></tr>`; }
  $('screen').innerHTML=h+'</tbody>'; }
let cmpState=null;
function renderCompare(){
  const ids=sortedQuotes().map(q=>q.id).filter(id=>!isY(id));
  $('cmpLeg').innerHTML=ids.map(id=>{ const i=st.cmp.indexOf(id); return `<button class="chip" data-cmp="${esc(id)}" aria-pressed="${i>=0}">${i>=0?`<i style="background:var(--c${i+1})"></i>`:''}${esc(nameOf(id))}</button>`; }).join('')||'<span class="muted">Sem cotações.</span>';
  const svg=$('cmp'),box=$('cmpBox'),W=Math.max(300,box.clientWidth),H=280,padL=38,padR=W<520?64:108,padT=12,padB=26; svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  const cut=st.cmpRange>=999?'0000':addDays(today(),-st.cmpRange);
  const ser=st.cmp.map((id,i)=>{ if(!id) return null; const s=daily(id).filter(p=>p.d>=cut); if(s.length<2) return null; const b=s[0].v; return {id,i,p:s.map(p=>({t:Date.parse(p.d),v:p.v/b*100,d:p.d}))}; }).filter(Boolean);
  if(!ser.length){ svg.innerHTML=`<text x="${W/2}" y="${H/2}" text-anchor="middle" style="fill:var(--muted)" font-size="13">Escolha pelo menos um ativo para comparar.</text>`; cmpState=null; return; }
  const t0=Math.min(...ser.map(s=>s.p[0].t)),t1=Math.max(...ser.map(s=>s.p[s.p.length-1].t)); let mn=Math.min(...ser.flatMap(s=>s.p.map(p=>p.v))),mx=Math.max(...ser.flatMap(s=>s.p.map(p=>p.v))); const pad=(mx-mn||1)*.08; mn-=pad; mx+=pad;
  const X=t=>padL+(t-t0)/(t1-t0||1)*(W-padL-padR),Y=v=>padT+(1-(v-mn)/(mx-mn))*(H-padT-padB); let g='';
  for(let i=0;i<=4;i++){ const v=mn+(mx-mn)*i/4,y=Y(v); g+=`<line x1="${padL}" x2="${W-padR}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" style="stroke:var(--line)" stroke-dasharray="2 4"/><text x="${padL-6}" y="${(y+4).toFixed(1)}" font-size="11" text-anchor="end" style="fill:var(--muted);font-family:var(--f-data)">${nf(v,0)}</text>`; }
  if(mn<100&&mx>100) g+=`<line x1="${padL}" x2="${W-padR}" y1="${Y(100).toFixed(1)}" y2="${Y(100).toFixed(1)}" style="stroke:var(--line-2)"/>`;
  const nT=W<520?2:4; for(let i=0;i<=nT;i++){ const t=t0+(t1-t0)*i/nT; g+=`<text x="${X(t).toFixed(1)}" y="${H-8}" font-size="11" text-anchor="${i===0?'start':i===nT?'end':'middle'}" style="fill:var(--muted)">${fShort.format(new Date(t))}</text>`; }
  const ends=ser.map(s=>({s,y:Y(s.p[s.p.length-1].v)})).sort((a,b)=>a.y-b.y); for(let i=1;i<ends.length;i++) if(ends[i].y-ends[i-1].y<14) ends[i].y=ends[i-1].y+14;
  const over=ends.length?ends[ends.length-1].y-(H-padB):0; if(over>0) ends.forEach(e=>e.y-=over);
  const lines=ser.map(s=>`<path d="M${s.p.map(p=>X(p.t).toFixed(1)+','+Y(p.v).toFixed(1)).join('L')}" fill="none" style="stroke:var(--c${s.i+1})" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${X(s.p[s.p.length-1].t).toFixed(1)}" cy="${Y(s.p[s.p.length-1].v).toFixed(1)}" r="3.5" style="fill:var(--c${s.i+1});stroke:var(--surface)" stroke-width="2"/>`).join('');
  const labs=ends.map(e=>{ const v=e.s.p[e.s.p.length-1].v; return `<text x="${W-padR+8}" y="${(e.y+4).toFixed(1)}" font-size="11.5" style="fill:var(--ink)"><tspan style="fill:var(--c${e.s.i+1})">●</tspan> ${W<520?'':esc(SHORT[e.s.id]||nameOf(e.s.id))+' '}<tspan style="font-family:var(--f-data)">${nf(v,1)}</tspan></text>`; }).join('');
  svg.innerHTML=g+lines+labs+`<line id="cxh" y1="${padT}" y2="${H-padB}" style="stroke:var(--muted)" stroke-dasharray="3 3" opacity="0"/>`;
  cmpState={ser,X,W,t0,t1,padL,padR};
}
function cmpMove(ev){ if(!cmpState) return; const svg=$('cmp'),r=svg.getBoundingClientRect(),{ser,X,W,t0,t1,padL,padR}=cmpState; const x=clamp((ev.clientX-r.left)*(W/r.width),padL,W-padR),t=t0+(x-padL)/(W-padL-padR)*(t1-t0);
  const rows=ser.map(s=>{ let b=s.p[0]; for(const p of s.p){ if(Math.abs(p.t-t)<Math.abs(b.t-t)) b=p; } return {s,b}; }); const ref=rows[0].b; const xx=X(ref.t);
  const xh=$('cxh'); xh.setAttribute('x1',xx); xh.setAttribute('x2',xx); xh.setAttribute('opacity',1); const tip=$('cmpTip');
  tip.innerHTML=`${fShort.format(new Date(ref.t))}<br>`+rows.map(o=>`<span style="color:var(--c${o.s.i+1})">●</span> ${esc(SHORT[o.s.id]||nameOf(o.s.id))} <b>${nf(o.b.v,1)}</b>`).join('<br>');
  tip.style.transform='translate(-50%,0)'; tip.style.left=Math.min(Math.max(xx*(r.width/W),80),r.width-80)+'px'; tip.style.top='8px'; tip.style.opacity=1; }
const CORI=['SPX','NDX','DAX','PSI','NIKKEI','US10Y','BUND','DXY','EURUSD','USDJPY','GOLD','BRENT','COPPER','BTC'];
function renderCor(){ const ids=CORI.filter(id=>st.hist[id]); if(ids.length<2){ $('cor').innerHTML='<tbody><tr><td class="muted" style="padding:0 2px 4px">Sem histórico de preços.</td></tr></tbody>'; return; }
  const sh=id=>esc(SHORT[id]||nameOf(id));
  $('cor').innerHTML=`<thead><tr><th></th>${ids.map(id=>`<th><button data-asset="${id}">${sh(id)}</button></th>`).join('')}</tr></thead><tbody>${ids.map(a=>`<tr><th>${sh(a)}</th>${ids.map(b=>{ if(a===b) return '<td><div class="cell self">1</div></td>'; const c=corr(a<b?a:b,a<b?b:a,st.corWin); if(!isFinite(c)) return '<td><div class="cell self">n/d</div></td>';
    return `<td><div class="cell" style="background:color-mix(in srgb,var(--${c>=0?'pos':'neg'}) ${Math.round(Math.abs(c)*60)}%,var(--surface))" title="${esc(nameOf(a))} × ${esc(nameOf(b))}: ${sg(c,2)} (${st.corWin} sessões)">${sg(c,2)}</div></td>`; }).join('')}</tr>`).join('')}</tbody>`; }
const CCY={USD:'Dólar',EUR:'Euro',GBP:'Libra',JPY:'Iene',CAD:'Dólar canadiano'};
function fxStrength(days){ const g=id=>{ const s=daily(id); if(s.length<2) return null; const last=s[s.length-1],cut=addDays(last.d,-days); for(let i=s.length-2;i>=0;i--) if(s[i].d<=cut) return Math.log(last.v/s[i].v)*100; return null; };
  const e=g('EURUSD'),b=g('GBPUSD'),j=g('USDJPY'),c=g('USDCAD'); if([e,b,j,c].some(x=>x==null)) return null; const r={USD:0,EUR:e,GBP:b,JPY:-j,CAD:-c},m=mean(Object.values(r));
  return Object.entries(r).map(([k,v])=>({k,v:(v-m)*5/4})).sort((a,b)=>b.v-a.v); }
function renderFxs(){ const l=fxStrength(st.fxWin); if(!l){ $('fxs').innerHTML='<div class="empty">Sem histórico cambial suficiente.</div>'; return; } const mx=Math.max(...l.map(x=>Math.abs(x.v)),0.5);
  $('fxs').innerHTML=l.map(x=>`<div class="brow fx"><span><span class="cur">${x.k}</span> ${CCY[x.k]}</span>${divBar(x.v,mx)}<span class="num ${dc(x.v)}">${sg(x.v,2,'%')}</span></div>`).join('')+`<p class="muted" style="font-size:12.5px;margin-top:6px">Mais forte: <b style="color:var(--ink)">${l[0].k}</b>. Mais fraca: <b style="color:var(--ink)">${l[l.length-1].k}</b>.</p>`; }
const SPR=[{n:'Curva EUA 10A − 2A',ids:['US10Y','US2Y'],f:(a,b)=>(a-b)*100,u:' pb',d:0,h:'inclinação da curva de juros'},{n:'EUA 10A − Bund 10A',ids:['US10Y','BUND'],f:(a,b)=>(a-b)*100,u:' pb',d:0,h:'diferencial de juros EUA e Alemanha'},{n:'Brent − WTI',ids:['BRENT','WTI'],f:(a,b)=>a-b,u:' $',d:2,h:'prémio do petróleo europeu'},{n:'Ouro / Prata',ids:['GOLD','SILVER'],f:(a,b)=>a/b,u:'',d:1,h:'sobe com procura de refúgio'},{n:'Cobre / Ouro × 1000',ids:['COPPER','GOLD'],f:(a,b)=>a/b*1000,u:'',d:2,h:'sobe com confiança no crescimento'},{n:'ETH / BTC',ids:['ETH','BTC'],f:(a,b)=>a/b,u:'',d:4,h:'apetite pelo risco na cripto'},{n:'Nasdaq / S&P 500',ids:['NDX','SPX'],f:(a,b)=>a/b,u:'',d:3,h:'tecnologia contra o mercado'}];
function spreadSeries(sp){ const A=daily(sp.ids[0]),B=new Map(daily(sp.ids[1]).map(p=>[p.d,p.v])); return A.filter(p=>B.has(p.d)).map(p=>({d:p.d,v:sp.f(p.v,B.get(p.d))})); }
function renderSpreads(){ let h='<div class="tw"><table class="dt"><thead><tr><th>Indicador</th><th>Valor</th><th>1 mês</th><th>Em 6 meses</th></tr></thead><tbody>',any=false,curve='';
  for(const sp of SPR){ const s=spreadSeries(sp); if(s.length<10) continue; any=true; const last=s[s.length-1],cut=addDays(last.d,-30); let ref=null; for(let i=s.length-2;i>=0;i--) if(s[i].d<=cut){ ref=s[i]; break; }
    const ch=ref?last.v-ref.v:null,mn=Math.min(...s.map(p=>p.v)),mx=Math.max(...s.map(p=>p.v)),pos=mx>mn?(last.v-mn)/(mx-mn)*100:50;
    h+=`<tr><td style="white-space:normal">${sp.n}<small class="muted" style="display:block;font-weight:400;font-size:11.5px">${sp.h}</small></td><td>${nf(last.v,sp.d)}${sp.u}</td><td class="${dc(ch)}">${sg(ch,sp.d)}</td><td><span style="display:inline-flex;align-items:center;gap:8px"><span class="track pct" style="width:56px;height:6px;display:inline-block"><span class="fill" style="left:0;width:${pos.toFixed(0)}%;background:var(--accent)"></span></span>${nf(pos,0)}%</span></td></tr>`; }
  const d2=chgSince('US2Y',30),d10=chgSince('US10Y',30); if(d2!=null&&d10!=null){ const st_=d10-d2>0; curve=`<p class="pnote" style="padding-top:10px"><b style="color:var(--ink)">Curva dos EUA no último mês:</b> ${st_?(d2<0?'inclinou com as yields curtas a descer; o mercado espera cortes de juros.':'inclinou com as yields longas a subir; mais prémio de inflação ou de dívida.'):(d2>0?'achatou com as yields curtas a subir; o mercado espera juros mais altos.':'achatou com as yields longas a descer; procura de refúgio ou menos crescimento esperado.')} (2A ${sg(d2,0,' pb')}, 10A ${sg(d10,0,' pb')})</p>`; }
  $('spreads').innerHTML=any?h+'</tbody></table></div>'+curve:'<div class="pb"><div class="empty">Sem histórico suficiente.</div></div>'; }
const cellBg=v=>!v?'var(--sunk)':`color-mix(in srgb,var(--${v>0?'up':'down'}) ${Math.abs(v)===2?45:20}%,var(--surface))`;
function renderMatrix(){ $('mx').innerHTML=`<thead><tr><th></th>${COLS.map(c=>`<th><button data-asset="${c.id}">${esc(SHORT[c.id]||c.l)}</button></th>`).join('')}</tr></thead><tbody>${Object.entries(MX).map(([k,s])=>`<tr><th>${esc(k)}</th>${COLS.map(col=>{const v=s[col.id]||0; return `<td><div class="cell" style="background:${cellBg(v)}" title="${esc(k)} → ${esc(col.l)}">${v>0?'+'+v:v===0?'·':'−'+Math.abs(v)}</div></td>`}).join('')}</tr>`).join('')}</tbody>`; }
function renderAnalise(){ renderScreen(); renderCompare(); renderCor(); renderFxs(); renderSpreads(); }

// ================= Ferramentas =================
const PS=[{k:'EURUSD',b:'EUR',q:'USD'},{k:'GBPUSD',b:'GBP',q:'USD'},{k:'USDJPY',b:'USD',q:'JPY'},{k:'USDCAD',b:'USD',q:'CAD'},{k:'EURGBP',b:'EUR',q:'GBP'},{k:'EURJPY',b:'EUR',q:'JPY'},{k:'GBPJPY',b:'GBP',q:'JPY'}];
const FALLBACK={EURUSD:1.13,GBPUSD:1.33,USDJPY:150,USDCAD:1.38};
function usdPer(){ const g=k=>st.quotes[k]?.price||FALLBACK[k]; return {USD:1,EUR:g('EURUSD'),GBP:g('GBPUSD'),JPY:1/g('USDJPY'),CAD:1/g('USDCAD')}; }
const liveFx=()=>['EURUSD','GBPUSD','USDJPY','USDCAD'].every(k=>st.quotes[k]?.price);
const pipOf=q=>q==='JPY'?0.01:0.0001;
function psInst(){ const v=$('psInst').value; return PS.find(p=>p.k===v)||{k:v,q:v.split(':')[1],other:true}; }
function psDefaults(){ const p=psInst(),u=usdPer(),acc=$('psAcc').value; const rate=u[p.q]/u[acc]; $('psRate').value=p.q===acc?'1':rate.toPrecision(5); $('psRate').disabled=p.q===acc; $('psRateL').textContent=`Taxa: 1 ${p.q} em ${acc}`;
  if(p.other){ $('psEntry').value='100'; $('psStop').value='95'; } else { const px=u[p.b]/u[p.q],d=p.q==='JPY'?2:4; $('psEntry').value=px.toFixed(d); $('psStop').value=(px-40*pipOf(p.q)).toFixed(d); } calcPos(); }
const outCell=(l,v,hi)=>`<div${hi?' class="hi"':''}><span class="lab">${l}</span><span class="v">${v}</span></div>`;
function calcPos(){ const p=psInst(),acc=$('psAcc').value,bal=pn($('psBal').value),risk=pn($('psRisk').value),en=pn($('psEntry').value),sp=pn($('psStop').value),rate=pn($('psRate').value),lev=pn($('psLev').value),msg=$('psMsg'),out=$('psOut'); msg.className='msg';
  const bad=m=>{ out.innerHTML=outCell('Unidades','n/d',true); msg.className='msg err'; msg.textContent=m; };
  if(!(bal>0)) return bad('Indique o saldo da conta.'); if(!(risk>0&&risk<=100)) return bad('O risco tem de estar entre 0 e 100%.'); if(!(en>0&&sp>0)) return bad('Indique a entrada e o stop.'); if(en===sp) return bad('A entrada e o stop não podem ser iguais.'); if(!(rate>0)) return bad('Indique a taxa de conversão.');
  const riskAmt=bal*risk/100,dist=Math.abs(en-sp),units=riskAmt/(dist*rate),notional=units*en*rate,cur=acc==='EUR'?'€':'$',money=v=>nf(v,2)+' '+cur;
  let h=outCell('Unidades',nf(units,p.other?2:0),true)+outCell('Risco',money(riskAmt));
  if(!p.other){ const pip=pipOf(p.q); h+=outCell('Lotes',nf(units/1e5,2))+outCell('Distância ao stop',nf(dist/pip,1)+' pips')+outCell('Valor do pip',money(units*pip*rate)); } else h+=outCell('Distância ao stop',nf(dist,decOf($('psEntry').value)||2));
  h+=outCell('Valor da posição',money(notional))+(lev>0?outCell('Margem a 1:'+nf(lev,0),money(notional/lev)):''); out.innerHTML=h;
  const side=sp<en?'compra':'venda'; msg.textContent=`Posição de ${side}. ${notional/bal>1?`Alavancagem efetiva de ${nf(notional/bal,1)}× sobre o saldo. `:''}${p.q!==acc?(liveFx()?'Taxa de conversão das cotações, com atraso; corrija se precisar.':'Sem cotações nesta vista: confirme a taxa de conversão.'):''}`;
  if(lev>0&&notional/lev>bal){ msg.className='msg err'; msg.textContent='A margem necessária é maior do que o saldo. Reduza o risco por operação ou afaste o stop.'; } }
function calcRR(){ const en=pn($('rrEntry').value),sp=pn($('rrStop').value),tg=pn($('rrTgt').value),win=pn($('rrWin').value),msg=$('rrMsg'),out=$('rrOut'); msg.className='msg';
  const bad=m=>{ out.innerHTML=outCell('Rácio R:R','n/d',true); msg.className='msg err'; msg.textContent=m; };
  if(![en,sp,tg].every(isFinite)) return bad('Indique entrada, stop e objetivo.'); if(en===sp) return bad('A entrada e o stop não podem ser iguais.'); if((tg-en)*(sp-en)>=0) return bad('O stop e o objetivo têm de ficar em lados opostos da entrada.');
  const rr=Math.abs(tg-en)/Math.abs(en-sp),be=1/(1+rr)*100; let h=outCell('Rácio R:R','1 : '+nf(rr,2),true)+outCell('Acerto mínimo',nf(be,1)+'%'); let t=`Operação de ${sp<en?'compra':'venda'}.`;
  if(win>=0&&win<=100){ const ex=win/100*rr-(1-win/100); h+=outCell('Expectativa por operação',sg(ex,2,' R')); t+=ex>0?` Com ${nf(win,0)}% de acerto ganha em média ${nf(ex,2)} vezes o risco por operação.`:` Com ${nf(win,0)}% de acerto esta relação perde dinheiro: precisa de acertar mais de ${nf(be,1)}%.`; }
  out.innerHTML=h; msg.textContent=t; }
function calcPiv(){ const H=pn($('pvH').value),L=pn($('pvL').value),C=pn($('pvC').value),tab=$('pvOut'),msg=$('pvMsg'); const d=Math.max(decOf($('pvH').value),decOf($('pvL').value),decOf($('pvC').value),2),f=v=>nf(v,d);
  if(![H,L,C].every(isFinite)||H<L||C>H||C<L){ tab.innerHTML=''; msg.className='msg err'; msg.textContent='O máximo tem de ser maior do que o mínimo e o fecho tem de ficar entre os dois.'; return; }
  msg.className='msg'; msg.textContent='O Invest101 só tem fechos diários, por isso o máximo e o mínimo têm de vir da sua plataforma.';
  const P=(H+L+C)/3,R=H-L,cl={R3:H+2*(P-L),R2:P+R,R1:2*P-L,S1:2*P-H,S2:P-R,S3:L-2*(H-P)},fb={R3:P+R,R2:P+.618*R,R1:P+.382*R,S1:P-.382*R,S2:P-.618*R,S3:P-R},cm={R4:C+R*1.1/2,R3:C+R*1.1/4,R2:C+R*1.1/6,R1:C+R*1.1/12,S1:C-R*1.1/12,S2:C-R*1.1/6,S3:C-R*1.1/4,S4:C-R*1.1/2};
  const row=k=>`<tr><td>${k}</td><td>${cl[k]!=null?f(cl[k]):'n/d'}</td><td>${fb[k]!=null?f(fb[k]):'n/d'}</td><td>${f(cm[k])}</td></tr>`;
  tab.innerHTML=`<thead><tr><th>Nível</th><th>Clássico</th><th>Fibonacci</th><th>Camarilla</th></tr></thead><tbody>${['R4','R3','R2','R1'].map(row).join('')}<tr class="piv"><td>Pivot</td><td>${f(P)}</td><td>${f(P)}</td><td>${f(C)}</td></tr>${['S1','S2','S3','S4'].map(row).join('')}</tbody>`; }
function calcFib(){ const H=pn($('fbH').value),L=pn($('fbL').value),up=$('fbDir').value==='up',tab=$('fbOut'),msg=$('fbMsg'); const d=Math.max(decOf($('fbH').value),decOf($('fbL').value),2),f=v=>nf(v,d);
  if(!(H>L)){ tab.innerHTML=''; msg.className='msg err'; msg.textContent='O máximo tem de ser maior do que o mínimo.'; return; } msg.className='msg'; if(msg.dataset.keep!=='1') msg.textContent=''; msg.dataset.keep='';
  const R=H-L,lv=[[1.618,'Extensão 161,8%'],[1.272,'Extensão 127,2%'],[0,up?'Máximo (0%)':'Mínimo (0%)'],[.236,'23,6%'],[.382,'38,2%'],[.5,'50%'],[.618,'61,8%'],[.786,'78,6%'],[1,up?'Mínimo (100%)':'Máximo (100%)']];
  const px=r=>r>1?(up?H+R*(r-1):L-R*(r-1)):(up?H-R*r:L+R*r); const rows=lv.map(([r,n])=>({n,v:px(r),k:r===.618||r===.5||r===.382})).sort((a,b)=>b.v-a.v);
  tab.innerHTML=`<thead><tr><th>Nível</th><th>Preço</th></tr></thead><tbody>${rows.map(x=>`<tr${x.k?' class="piv"':''}><td>${x.n}</td><td>${f(x.v)}</td></tr>`).join('')}</tbody>`; }
function calcDD(){ const r=pn($('ddRisk').value),n=pn($('ddN').value),loss=pn($('ddLoss').value); let d=null,src='';
  if(loss>0&&loss<100){ d=loss/100; src=`Perda total de ${nf(loss,1)}%`; } else if(r>0&&r<100&&n>=1){ d=1-Math.pow(1-r/100,Math.round(n)); src=`${Math.round(n)} perdas seguidas a ${nf(r,2)}%`; }
  $('ddOut').innerHTML=d==null?outCell('Queda da conta','n/d',true):outCell('Queda da conta',nf(d*100,1)+'%',true)+outCell('Ganho para recuperar',nf(d/(1-d)*100,1)+'%')+outCell('Cenário',`<span style="font-family:var(--f-body);font-size:13px">${src}</span>`);
  $('ddTab').innerHTML=`<thead><tr><th>Perda</th>${[5,10,20,30,50,75].map(x=>`<th>${x}%</th>`).join('')}</tr></thead><tbody><tr><td>Ganho necessário</td>${[5,10,20,30,50,75].map(x=>`<td>${nf(x/(100-x)*100,1)}%</td>`).join('')}</tr></tbody>`; }
function renderPip(){ const u=usdPer(); $('pipTab').innerHTML=`<thead><tr><th>Par</th><th>Preço</th><th>Pip</th><th>Em EUR</th><th>Em USD</th></tr></thead><tbody>${PS.map(p=>{ const pip=pipOf(p.q),px=u[p.b]/u[p.q],q=1e5*pip*u[p.q]; return `<tr><td>${p.b}/${p.q}</td><td>${nf(px,p.q==='JPY'?2:4)}</td><td>${nf(pip,p.q==='JPY'?2:4)}</td><td>${nf(q/u.EUR,2)} €</td><td>${nf(q,2)} $</td></tr>`; }).join('')}</tbody>`+(liveFx()?'':'<tfoot><tr><td colspan="5" class="muted" style="font-family:var(--f-body);white-space:normal">Sem cotações nesta vista: valores calculados com taxas de referência.</td></tr></tfoot>'); }
let toolsReady=false,psTouched=false;
function initTools(){ if(toolsReady) return; toolsReady=true;
  $('psInst').innerHTML=PS.map(p=>`<option value="${p.k}">${p.b}/${p.q}</option>`).join('')+'<option value="X:USD">Outro, cotado em USD</option><option value="X:EUR">Outro, cotado em EUR</option>';
  psDefaults(); calcRR(); calcPiv(); calcFib(); calcDD(); renderPip();
  $('t-pos').addEventListener('input',e=>{ psTouched=true; if(e.target.id==='psInst'||e.target.id==='psAcc') psDefaults(); else calcPos(); });
  $('t-rr').addEventListener('input',calcRR); $('t-piv').addEventListener('input',calcPiv); $('t-dd').addEventListener('input',calcDD);
  $('t-fib').addEventListener('input',e=>{ if(e.target.id==='fbAsset'){ const id=e.target.value; if(id){ const s=daily(id).filter(p=>p.d>=addDays(today(),-91)); if(s.length>1){ const dec=qDec(st.quotes[id]),v=s.map(p=>p.v); $('fbH').value=Math.max(...v).toFixed(dec); $('fbL').value=Math.min(...v).toFixed(dec); $('fbDir').value=v.indexOf(Math.max(...v))>v.indexOf(Math.min(...v))?'up':'down'; $('fbMsg').dataset.keep='1'; $('fbMsg').textContent=`Fecho máximo e mínimo de ${nameOf(id)} nos últimos três meses.`; } } } calcFib(); }); }
function toolsData(){ if(!toolsReady) return; if(!psTouched) psDefaults(); renderPip(); const sel=$('fbAsset'); if(sel.options.length<2) sel.innerHTML='<option value="">Escolher…</option>'+sortedQuotes().map(q=>`<option value="${esc(q.id)}">${esc(nameOf(q.id))}</option>`).join(''); }

// ================= Diário =================
const jr={items:[],mode:null,col:null,pend:null};
const rOf=t=>{ const risk=Math.abs(t.entry-t.stop); return risk?t.dir*(t.exit-t.entry)/risk:NaN; };
function jSorted(){ return jr.items.slice().sort((a,b)=>(a.date||'').localeCompare(b.date||'')||(a.at||0)-(b.at||0)); }
function renderJournal(){ const l=jSorted().map(t=>({...t,r:rOf(t)})).filter(t=>isFinite(t.r)),n=l.length;
  $('jMode').textContent=jr.mode==='db'?'Guardado em privado na sua conta':jr.mode==='local'?'Guardado apenas neste navegador':'';
  const wins=l.filter(t=>t.r>0),gp=wins.reduce((a,t)=>a+t.r,0),gl=-l.filter(t=>t.r<0).reduce((a,t)=>a+t.r,0),tot=gp-gl; let cum=0,peak=0,dd=0; const curve=l.map(t=>{ cum+=t.r; peak=Math.max(peak,cum); dd=Math.max(dd,peak-cum); return cum; });
  $('jStats').innerHTML=statBox('Operações',n,n&&n<30?'amostra pequena (menos de 30)':'')+statBox('Taxa de acerto',n?nf(wins.length/n*100,0)+'%':'n/d')+statBox('Expectativa',n?sg(tot/n,2,' R'):'n/d','R médio por operação',n?dc(tot):'')+statBox('Fator de lucro',n?(gl?nf(gp/gl,2):'∞'):'n/d','ganhos ÷ perdas')+statBox('R acumulado',n?sg(tot,1,' R'):'n/d','',n?dc(tot):'')+statBox('Maior queda',n?'−'+nf(dd,1)+' R':'n/d','desde um máximo');
  $('jEmpty').hidden=n>0; $('jCopy').hidden=!n;
  $('jTab').innerHTML=n?`<thead><tr><th>Data</th><th style="text-align:left">Ativo</th><th>Direção</th><th>Entrada</th><th>Stop</th><th>Saída</th><th>Resultado</th><th style="text-align:left">Notas</th><th></th></tr></thead><tbody>${l.slice().reverse().map(t=>`<tr><td class="num" style="font-family:var(--f-data);font-weight:400">${esc(t.date)}</td><td style="font-family:var(--f-body);text-align:left">${esc(t.asset)}</td><td style="font-family:var(--f-body)">${t.dir>0?'Longo':'Curto'}</td><td>${nf(t.entry,t.dec??decOf(t.entry))}</td><td>${nf(t.stop,t.dec??decOf(t.stop))}</td><td>${nf(t.exit,t.dec??decOf(t.exit))}</td><td class="${dc(t.r)}">${sg(t.r,2,' R')}</td><td class="jnote" style="text-align:left">${esc(t.note||'')}</td><td><button class="btn sm ghost" data-del="${esc(t.id)}">${jr.pend===t.id?'Confirmar':'Apagar'}</button></td></tr>`).join('')}</tbody>`:'';
  const svg=$('eq'),W=Math.max(300,$('eqBox').clientWidth),H=220,pL=40,pR=14,pT=12,pB=24; svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  if(n<2){ svg.innerHTML=`<text x="${W/2}" y="${H/2}" text-anchor="middle" style="fill:var(--muted)" font-size="13">${n?'A curva aparece a partir da segunda operação.':'Sem operações registadas.'}</text>`; return; }
  const ys=[0,...curve],mn=Math.min(...ys),mx=Math.max(...ys),pad=(mx-mn||1)*.1,a=mn-pad,b=mx+pad,X=i=>pL+i/(ys.length-1)*(W-pL-pR),Y=v=>pT+(1-(v-a)/(b-a))*(H-pT-pB); let g='';
  for(let i=0;i<=3;i++){ const v=a+(b-a)*i/3,y=Y(v); g+=`<line x1="${pL}" x2="${W-pR}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" style="stroke:var(--line)" stroke-dasharray="2 4"/><text x="${pL-6}" y="${(y+4).toFixed(1)}" font-size="11" text-anchor="end" style="fill:var(--muted);font-family:var(--f-data)">${nf(v,1)}</text>`; }
  const col=tot>=0?'var(--up)':'var(--down)';
  svg.innerHTML=g+`<line x1="${pL}" x2="${W-pR}" y1="${Y(0).toFixed(1)}" y2="${Y(0).toFixed(1)}" style="stroke:var(--line-2)"/><path d="M${ys.map((v,i)=>X(i).toFixed(1)+','+Y(v).toFixed(1)).join('L')}" fill="none" style="stroke:${col}" stroke-width="2" stroke-linejoin="round"/>${l.map((t,i)=>`<circle cx="${X(i+1).toFixed(1)}" cy="${Y(curve[i]).toFixed(1)}" r="${n>40?2.5:4}" style="fill:var(--${t.r>0?'up':'down'});stroke:var(--surface)" stroke-width="1.5"><title>${esc(t.date+' · '+t.asset)}: ${sg(t.r,2,' R')} (acumulado ${sg(curve[i],1,' R')})</title></circle>`).join('')}<text x="${pL}" y="${H-6}" font-size="11" style="fill:var(--muted)">1.ª operação</text><text x="${W-pR}" y="${H-6}" font-size="11" text-anchor="end" style="fill:var(--muted)">${n}.ª</text>`;
}
function jLocalLoad(){ jr.mode='local'; jr.col=null; const l=store('journal'); jr.items=Array.isArray(l)?l:[]; renderJournal(); }
async function jAdd(t){ if(jr.mode==='db'){ await jr.col.add(t); } else { jr.items.push({...t,id:'l'+Date.now().toString(36)}); store('journal',jr.items); renderJournal(); } }
async function jDel(id){ if(jr.mode==='db'){ await jr.col.doc(id).delete(); } else { jr.items=jr.items.filter(t=>t.id!==id); store('journal',jr.items); renderJournal(); } }
async function initJournal(db){ $('jDate').value=today(); let uid=null; try{ const user=window.claude?.use?await window.claude.use('user'):null; uid=user?await user.id():null; }catch(e){}
  if(!db||!uid){ jLocalLoad(); return; }
  try{ jr.col=db.doc('data/users/'+uid+'/journal').collection('trades'); jr.mode='db'; jr.col.onSnapshot(s=>{ jr.items=s.docs.map(d=>({id:d.id,...d.data()})); renderJournal(); },()=>jLocalLoad()); renderJournal(); }catch(e){ jLocalLoad(); } }
$('jForm').addEventListener('submit',async e=>{ e.preventDefault(); const msg=$('jMsg'),t={date:$('jDate').value||today(),asset:$('jAsset').value.trim().slice(0,40),dir:+$('jDir').value,entry:pn($('jEntry').value),stop:pn($('jStop').value),exit:pn($('jExit').value),note:$('jNote').value.trim().slice(0,240),dec:Math.max(decOf($('jEntry').value),decOf($('jStop').value),decOf($('jExit').value)),at:Date.now()};
  const bad=m=>{ msg.className='msg err'; msg.textContent=m; };
  if(!t.asset) return bad('Indique o ativo.'); if(![t.entry,t.stop,t.exit].every(isFinite)) return bad('Indique entrada, stop e saída em números.'); if(t.entry===t.stop) return bad('A entrada e o stop não podem ser iguais.');
  if((t.entry-t.stop)*t.dir<=0) return bad(t.dir>0?'Numa compra o stop fica abaixo da entrada.':'Numa venda o stop fica acima da entrada.');
  try{ await jAdd(t); msg.className='msg'; msg.textContent=`Operação registada: ${sg(rOf(t),2,' R')}.`; if(rOf(t)>0) window.burst?.(e.submitter||$('jForm').querySelector('button')); ['jEntry','jStop','jExit','jNote'].forEach(k=>$(k).value=''); }
  catch(err){ if(err?.code==='invalid_argument'||err?.code==='not_granted'||err?.code==='revoked'){ jLocalLoad(); try{ await jAdd(t); msg.className='msg'; msg.textContent='Sem permissão para guardar na conta. A operação ficou guardada neste navegador.'; }catch(e2){ bad('Não foi possível guardar a operação.'); } } else bad(err?.code==='quota_exceeded'?'O diário está cheio. Apague operações antigas para registar novas.':'Não foi possível guardar. Verifique a ligação e tente outra vez.'); } });
$('jCopy').addEventListener('click',async()=>{ const csv='data;ativo;direcao;entrada;stop;saida;R;notas\n'+jSorted().map(t=>[t.date,t.asset,t.dir>0?'longo':'curto',t.entry,t.stop,t.exit,nf(rOf(t),2),(t.note||'').replace(/[;\n]/g,' ')].join(';')).join('\n'); const b=$('jCopy');
  try{ await navigator.clipboard.writeText(csv); b.textContent='Copiado'; }catch(e){ b.textContent='Não foi possível copiar'; } setTimeout(()=>b.textContent='Copiar como CSV',1800); });

// ================= Estado, navegação e pesquisa =================
function renderStatus(){ const dot=$('dot'),t=$('liveTxt'); if(st.dbOk===false){ dot.className='dot'; t.textContent='Sem dados nesta vista'; return; }
  const iso=st.meta?.updatedAt; if(!iso){ dot.className='dot'; t.textContent='A ligar…'; return; } const m=(Date.now()-new Date(iso))/60000; dot.className='dot '+(m<90?'on':'stale');
  t.textContent=`Atualizado ${ago(iso)}`; t.parentElement.title=st.meta?.next?`Próxima atualização às ${fT.format(new Date(st.meta.next))}`:''; }
const VIEWS=['inicio','aprender','painel','radar','calendario','mercados','analise','ferramentas','diario','metodo'];
const ALIAS={overview:'painel',calendar:'calendario',assets:'mercados',matrix:'analise',about:'metodo'};
function renderView(animate){ const v=st.view; if(v==='painel') renderPainel(); else if(v==='radar') renderMyRadar(); else if(v==='calendario') renderCal(); else if(v==='mercados'){ renderPicker(); renderAsset(animate); } else if(v==='analise') renderAnalise(); else if(v==='ferramentas'){ initTools(); toolsData(); } else if(v==='diario') renderJournal(); else if(v==='aprender') renderLearn(); else if(v==='inicio') renderHome(animate); m3Scan($('v-'+v)); }
function go(v,push=true,keepScroll=false){ m3Go(v,push,keepScroll); }
function goNow(v,push=true,keepScroll=false){ v=ALIAS[v]||v; if(!VIEWS.includes(v)) v='painel'; st.view=v;
  VIEWS.forEach(x=>{ const el=$('v-'+x),on=x===v; el.hidden=!on; if(on){ el.classList.remove('enter'); void el.offsetWidth; el.classList.add('enter'); } });
  document.querySelectorAll('.nav [data-go]').forEach(b=>{ const on=b.dataset.go===v; b.setAttribute('aria-current',String(on)); if(on) b.scrollIntoView({block:'nearest',inline:'nearest'}); });
  if(push){ try{ history.replaceState(null,'','#'+v); }catch(e){} }
  if(window.__syncRender) renderView(true); else requestAnimationFrame(()=>renderView(true)); if(!keepScroll) window.scrollTo({top:0}); }
function syncSeg(id,attr,val){ $(id).querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[attr]===String(val)))); }
function openAsset(id){ st.asset=id; if(st.view!=='mercados') go('mercados'); else { renderPicker(); renderAsset(true); window.scrollTo({top:0}); } }
function openEvent(id){ st.sel=id; const it=st.items.find(x=>x.id===id); if(it){ const [p0,p1]=range(); if(it.day<p0||it.day>p1){ st.period='day'; st.dayPick=it.day; syncSeg('fPeriod','p','day'); } }
  if(st.view!=='calendario') go('calendario'); else { renderWeek(); renderList(); renderRead(); } if(innerWidth<980) setTimeout(()=>$('read').scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'}),80); }
let lastFocus=null;
let popFor=null;
function placePop(btn){ const p=$('pop'); if(p.classList.contains('sheet')){ p.style.left=p.style.top=''; return; }
  const r=btn.getBoundingClientRect(),w=p.offsetWidth,h=p.offsetHeight,left=clamp(r.left-14,12,innerWidth-w-12),below=r.bottom+8+h<=innerHeight-12||r.top<h+20,top=below?Math.min(r.bottom+8,Math.max(12,innerHeight-h-12)):r.top-8-h;
  p.style.left=left+'px'; p.style.top=top+'px'; p.style.transformOrigin=(r.left+r.width/2-left)+'px '+(below?'0':'100%'); }
function closePop(focus){ const p=$('pop'); if(p.hidden) return; p.hidden=true; popFor?.setAttribute('aria-expanded','false'); if(focus&&popFor?.isConnected) popFor.focus(); popFor=null; }
function openHelp(k,btn){ const h=HELP[k],p=$('pop'); if(!h) return; if(!p.hidden&&popFor===btn){ closePop(true); return; } closePop(false);
  $('mTitle').textContent=h.t; $('mBody').innerHTML=h.b; p.classList.toggle('sheet',innerWidth<=560); popFor=btn; btn.setAttribute('aria-expanded','true'); p.hidden=false; p.scrollTop=0; placePop(btn); p.focus({preventScroll:true});
  if(!p.classList.contains('sheet')) addEventListener('scroll',()=>closePop(false),{passive:true,once:true}); }
function closeModals(){ if(!$('pop').hidden){ closePop(true); return; } const was=!$('cmdModal').hidden; $('cmdModal').hidden=true; if(was&&lastFocus?.focus) lastFocus.focus(); }
const TOOLS=[['t-pos','Tamanho da posição'],['t-rr','Risco e retorno'],['t-piv','Pontos pivot'],['t-fib','Níveis de Fibonacci'],['t-dd','Perdas e recuperação'],['t-pip','Valor do pip']];
const NAVN={inicio:'Início',aprender:'Aprender',painel:'Painel',radar:'Radar',calendario:'Calendário',mercados:'Gráficos',analise:'Análise',ferramentas:'Ferramentas',diario:'Diário',metodo:'Metodologia'};
let cmdItems=[],cmdSel=0;
function cmdBuild(q){ q=q.trim().toLowerCase(); const hit=s=>!q||s.toLowerCase().includes(q); const o=[];
  VIEWS.forEach(v=>{ if(hit(NAVN[v])) o.push({l:NAVN[v],s:'Secção',a:()=>go(v)}); });
  LRN_MODULES.forEach(m=>{ if(hit(m.name)) o.push({l:m.name,s:'Aprender · módulo',a:()=>lrnOpenModule(m.id)}); });
  LRN.forEach(a=>{ if(hit(a.title)||hit(lrnTopicName(a.topic))) o.push({l:a.title,s:'Aprender · '+lrnTopicName(a.topic),a:()=>lrnOpen(a.id)}); });
  TOOLS.forEach(([id,l])=>{ if(hit(l)) o.push({l,s:'Ferramenta',a:()=>{ go('ferramentas',true,true); setTimeout(()=>$(id).scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'}),60); }}); });
  if(q){ sortedQuotes().forEach(x=>{ if(hit(nameOf(x.id))||hit(x.id)) o.push({l:nameOf(x.id),s:x.cls+' · '+fmtQ(x).c,a:()=>openAsset(x.id)}); });
    if(q.length>=2){ const now=Date.now(); st.items.filter(i=>i.ts>now-36e5&&(hit(i.n)||hit(i.co||'')||hit(i.cur))).sort((a,b)=>b.imp-a.imp||a.ts-b.ts).slice(0,6).sort((a,b)=>a.ts-b.ts).forEach(i=>o.push({l:i.cur+' · '+i.n,s:fShortT.format(new Date(i.ts)),a:()=>openEvent(i.id)})); } }
  cmdItems=o.slice(0,14); cmdSel=0; cmdRender(); }
function cmdRender(){ $('cmdList').innerHTML=cmdItems.length?cmdItems.map((x,i)=>`<button role="option" data-cmdi="${i}" aria-selected="${i===cmdSel}"><span>${esc(x.l)}</span><small>${esc(x.s)}</small></button>`).join(''):'<p class="muted" style="padding:10px">Nada encontrado. Experimente o nome de um ativo, de um indicador ou de uma calculadora.</p>'; $('cmdList').querySelector('[aria-selected="true"]')?.scrollIntoView({block:'nearest'}); }
function openCmd(){ closePop(false); lastFocus=document.activeElement; $('cmdModal').hidden=false; $('cmdQ').value=''; cmdBuild(''); $('cmdQ').focus(); }
function cmdRun(i){ const x=cmdItems[i]; if(!x) return; $('cmdModal').hidden=true; x.a(); }

document.addEventListener('click',ev=>{
  const tg=ev.target; if(tg.id==='cmdModal'){ closeModals(); return; }
  if(!$('pop').hidden&&!tg.closest('#pop')&&!tg.closest('[data-help]')) closePop(false);
  const ci=tg.closest('[data-cmdi]'); if(ci){ cmdRun(+ci.dataset.cmdi); return; }
  const h=tg.closest('[data-help]'); if(h){ openHelp(h.dataset.help,h); return; }
  const cx_=tg.closest('[data-cmpx]'); if(cx_){ st.cmpA=st.cmpA.map(x=>x===cx_.dataset.cmpx?null:x); renderCmpBar(); drawChart(true); return; }
  const rx=tg.closest('[data-rdx]'); if(rx){ rdToggle(rx.dataset.rdx); return; }
  const rt=tg.closest('[data-rd]'); if(rt){ rdToggle(rt.dataset.rd); return; }
  if(tg.closest('[data-rdtop]')){ rdSet(Object.keys(st.quotes).map(id=>({id,z:Math.abs(zDay(id)||0)})).sort((a,b)=>b.z-a.z).slice(0,6).map(x=>x.id)); return; }
  if(tg.closest('#rdClear')){ rdSet([]); return; }
  const pgt=tg.closest('[data-pg]'); if(pgt){ const k=pgt.dataset.pg; st.pgOff.has(k)?st.pgOff.delete(k):st.pgOff.add(k); store('pgOff',[...st.pgOff]); renderPicker(); return; }
  const fv_=tg.closest('[data-fav]'); if(fv_){ const k=fv_.dataset.fav; st.fav.has(k)?st.fav.delete(k):st.fav.add(k); store('fav',[...st.fav]); renderPicker(); return; }
  const dl=tg.closest('[data-del]'); if(dl){ const id=dl.dataset.del; if(jr.pend===id){ jr.pend=null; jDel(id).catch(()=>{ $('jMsg').className='msg err'; $('jMsg').textContent='Não foi possível apagar a operação.'; }); } else { jr.pend=id; renderJournal(); setTimeout(()=>{ if(jr.pend===id){ jr.pend=null; renderJournal(); } },4000); } return; }
  const so=tg.closest('[data-sort]'); if(so){ const k=so.dataset.sort; if(k==='cls') st.sort={k:'cls',dir:1}; else st.sort=st.sort.k===k?{k,dir:-st.sort.dir}:{k,dir:-1}; renderScreen(); return; }
  const cm=tg.closest('[data-cmp]'); if(cm){ const k=cm.dataset.cmp,i=st.cmp.indexOf(k); if(i>=0) st.cmp[i]=null; else { const f=st.cmp.indexOf(null); if(f<0) return; st.cmp[f]=k; } renderCompare(); return; }
  const dy=tg.closest('[data-day]'); if(dy){ st.period='day'; st.dayPick=dy.dataset.day; st.limit=300; syncSeg('fPeriod','p','day'); renderCal(); return; }
  const g=tg.closest('[data-go]'); if(g){ go(g.dataset.go); return; }
  const e=tg.closest('[data-ev]'); if(e){ openEvent(e.dataset.ev); return; }
  const a=tg.closest('[data-asset]'); if(a){ openAsset(a.dataset.asset); return; }
  const c=tg.closest('[data-cur]'); if(c){ const k=c.dataset.cur; if(k==='*') st.cur.clear(); else st.cur.has(k)?st.cur.delete(k):st.cur.add(k); st.limit=300; renderChips(); renderList(); return; }
  if(tg.id==='moreBtn'){ st.limit+=300; renderList(); return; }
});
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){ e.preventDefault(); openCmd(); return; }
  if(e.key==='Escape'){ closeModals(); return; }
  if(!$('cmdModal').hidden){ if(e.key==='ArrowDown'||e.key==='ArrowUp'){ e.preventDefault(); if(cmdItems.length){ cmdSel=(cmdSel+(e.key==='ArrowDown'?1:-1)+cmdItems.length)%cmdItems.length; cmdRender(); } } else if(e.key==='Enter'){ e.preventDefault(); cmdRun(cmdSel); } return; }
  if((e.key==='Enter'||e.key===' ')&&e.target.matches?.('tr[data-asset],div[data-asset]')){ e.preventDefault(); openAsset(e.target.dataset.asset); }
  else if((e.key==='Enter'||e.key===' ')&&e.target.matches?.('[role="link"][data-go]')){ e.preventDefault(); go(e.target.dataset.go); }
});
window.addEventListener('hashchange',()=>{ const v=(location.hash||'').slice(1); if(v&&(ALIAS[v]||v)!==st.view) go(v,false); });
$('cmpA').addEventListener('change',e=>{ if(e.target.id!=='cmpAdd'||!e.target.value) return; const i=st.cmpA.indexOf(null); if(i<0) return; st.cmpA[i]=e.target.value; renderCmpBar(); drawChart(true); });
$('rdQ').addEventListener('input',e=>{ rd.qy=e.target.value; renderMyRadar(); });
$('findBtn').addEventListener('click',openCmd); $('cmdQ').addEventListener('input',e=>cmdBuild(e.target.value));
$('fPeriod').addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return; st.period=b.dataset.p; st.dayPick=null; st.limit=300; syncSeg('fPeriod','p',st.period); renderCal();});
$('fState').addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return; st.state=b.dataset.s; syncSeg('fState','s',st.state); renderList();});
$('fImp').addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return; const i=+b.dataset.i; if(st.imp.has(i)&&st.imp.size>1) st.imp.delete(i); else st.imp.add(i); $('fImp').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(st.imp.has(+x.dataset.i)))); renderList();});
$('fCat').addEventListener('change',e=>{st.cat=e.target.value; renderList();});
let qT; $('q').addEventListener('input',e=>{clearTimeout(qT); qT=setTimeout(()=>{st.q=e.target.value; st.limit=300; renderList();},150);});
$('rng').addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return; st.range=+b.dataset.r; syncSeg('rng','r',b.dataset.r); drawChart(true);});
$('ctSeg').addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return; st.ctype=b.dataset.ct; syncSeg('ctSeg','ct',st.ctype); store('ctype',st.ctype); drawChart(true);});
$('maSeg').addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return; const n=+b.dataset.ma; st.ma.has(n)?st.ma.delete(n):st.ma.add(n); b.setAttribute('aria-pressed',String(st.ma.has(n))); drawChart(false);});
$('cmpRng').addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return; st.cmpRange=+b.dataset.c; syncSeg('cmpRng','c',b.dataset.c); renderCompare();});
$('corWin').addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return; st.corWin=+b.dataset.w; syncSeg('corWin','w',b.dataset.w); renderCor();});
$('fxWin').addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return; st.fxWin=+b.dataset.f; syncSeg('fxWin','f',b.dataset.f); renderFxs();});
$('chartbox').addEventListener('pointermove',chartMove); $('chartbox').addEventListener('pointerleave',chartLeave);
$('cmpBox').addEventListener('pointermove',cmpMove); $('cmpBox').addEventListener('pointerleave',()=>{ $('cmpTip').style.opacity=0; $('cxh')?.setAttribute('opacity',0); });
$('mClose').addEventListener('click',()=>closePop(true));
let rT; new ResizeObserver(()=>{ clearTimeout(rT); rT=setTimeout(()=>{ if(st.view==='mercados') drawChart(false); if(st.view==='analise') renderCompare(); if(st.view==='diario') renderJournal(); },120); }).observe($('main'));

setInterval(()=>{ $('clock').textContent=fT.format(new Date()); const rb=$('rbR'); if(rb) rb.textContent=fT.format(new Date())+' (Lisboa)'; document.querySelectorAll('[data-cd]').forEach(el=>el.textContent=until(+el.dataset.cd)); },1000);
setInterval(()=>{ renderStatus(); if(st.view==='calendario') renderList(); if(st.view==='painel'){ renderBrief(); renderTimeline(); } },60000);

setTimeout(()=>$('main').classList.remove('first'),1800);

// tema claro/escuro: sem escolha segue o do visitante; o botão fixa uma escolha e guarda-a só neste navegador
{ const root=document.documentElement,cur=()=>root.dataset.theme||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
  const saved=store('theme'); if(saved==='light'||saved==='dark') root.dataset.theme=saved;
  $('thmBtn').addEventListener('click',()=>{ const n=cur()==='dark'?'light':'dark'; root.dataset.theme=n; store('theme',n); if(st.view==='mercados') drawChart(false); if(st.view==='analise') renderCompare(); }); }
// ================= Arranque =================
{ const f=store('fav'); if(Array.isArray(f)) st.fav=new Set(f); if(store('ctype')==='candle'){ st.ctype='candle'; syncSeg('ctSeg','ct','candle'); } }
$('clock').textContent=fT.format(new Date()); renderMatrix(); renderRead(); renderTimeline();
go((location.hash||'').slice(1)||'inicio',false); m3Init();
function firstPick(){ const now=Date.now(),t=today(); if(!st.items.some(i=>i.day===t)){ st.period='week'; syncSeg('fPeriod','p','week'); }
  const done=st.items.filter(i=>i.a!=null&&i.imp>=3&&i.ts<=now); const pk=done[done.length-1]||st.items.find(i=>i.ts>now); if(pk) st.sel=pk.id; }
let dataT; function dataChanged(){ memo.clear(); clearTimeout(dataT); dataT=setTimeout(()=>{ renderTape(); renderView(false); toolsData(); $('jAssets').innerHTML=sortedQuotes().map(q=>`<option value="${esc(nameOf(q.id))}">`).join(''); },40); }
(async()=>{
  let db=null; try{ db=window.claude?.use?await window.claude.use('db'):null; }catch(e){}
  initJournal(db); initRadarStore(db);
  if(!db){ st.dbOk=false; renderStatus(); renderView(false); return; }
  st.dbOk=true; st.db=db; const onErr=()=>{ st.dbOk=false; renderStatus(); }; let first=true;
  db.collection('quotes').onSnapshot(s=>{ const o={}; s.docs.forEach(d=>o[d.id]={id:d.id,...d.data()}); st.quotes=o; dataChanged(); },onErr);
  db.collection('history').onSnapshot(s=>{ const o={}; s.docs.forEach(d=>o[d.id]=d.data()); st.hist=o; dataChanged(); },onErr);
  db.collection('days').onSnapshot(s=>{ const o={}; s.docs.forEach(d=>o[d.id]=d.data()); st.days=o; rebuild(); if(first&&st.items.length){ firstPick(); first=false; } dataChanged(); },onErr);
  db.doc('meta/status').onSnapshot(s=>{ st.meta=s.exists?s.data():null; renderStatus(); if(st.view==='painel') renderBrief(); },onErr);
})();
