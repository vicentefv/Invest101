// ================= Movimento 2: resposta e orientação em todo o site =================
// Escolhas guiadas pela pesquisa: resposta imediata à ação, transições que mostram de onde se vem,
// estados que se percebem; nada que obrigue a esperar para ler. Com "reduzir movimento" não corre.
(()=>{
if(reduced()) return;
const EO='cubic-bezier(.23,1,.32,1)',q1=s=>document.querySelector(s),FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;

// ---------- seletor segmentado: a marca desliza até à opção escolhida ----------
const SEGS=['fPeriod','fState','rng','tfSeg','ctSeg','cmpRng','corWin','fxWin'].map($).filter(Boolean);
function placeSeg(seg,instant){ const ind=seg.querySelector('.seg-ind'); if(!ind||!seg.offsetWidth) return; const b=seg.querySelector('button[aria-pressed="true"]'),w=seg.clientWidth,h=seg.clientHeight;
  if(instant) ind.style.transition='none'; ind.style.clipPath=b?`inset(${b.offsetTop}px ${w-b.offsetLeft-b.offsetWidth}px ${h-b.offsetTop-b.offsetHeight}px ${b.offsetLeft}px round 999px)`:'inset(50% 50% 50% 50% round 999px)'; if(instant){ void ind.offsetWidth; ind.style.transition=''; } }
SEGS.forEach(seg=>{ seg.classList.add('sl'); const i=document.createElement('span'); i.className='seg-ind'; i.setAttribute('aria-hidden','true'); seg.prepend(i); placeSeg(seg,true);
  new ResizeObserver(()=>placeSeg(seg,true)).observe(seg);  // a vista pode estar escondida (largura 0) quando o seletor é criado
  new MutationObserver(()=>placeSeg(seg,false)).observe(seg,{attributes:true,attributeFilter:['aria-pressed','hidden'],subtree:true}); });  // 'hidden': os intervalos da ficha (rng e tfSeg) trocam de lugar consoante o ativo tem velas
const placeSegs=()=>SEGS.forEach(s=>placeSeg(s,true)); addEventListener('resize',placeSegs); document.fonts?.ready.then(placeSegs);

// ---------- transições entre vistas, com o nome do ativo a viajar até ao título ----------
// A atualização do DOM tem de ser síncrona: a renderização fica suspensa durante a transição.
let morphSrc=null;
document.addEventListener('click',e=>{ const a=e.target.closest?.('[data-asset]'); if(!a||st.view==='mercados'||e.target.closest('[data-rdx],[data-fav]')) return;
  const s=a.matches('tr')?a.cells[0]:a.querySelector('.n')||a.firstElementChild; if(!s||s instanceof SVGElement) return; morphSrc=s; s.style.viewTransitionName='asset'; setTimeout(()=>{ if(morphSrc===s&&!vtBusy){ s.style.viewTransitionName=''; morphSrc=null; } },0); },true);
let vtBusy=false;
{ const _g=go; go=function(v){ const tgt=ALIAS[v]||v,args=arguments,self=this; const after=()=>requestAnimationFrame(placeSegs);
    if(!document.startViewTransition||tgt===st.view||vtBusy){ _g.apply(self,args); after(); return; }
    vtBusy=true; const src=morphSrc; let vt; try{ vt=document.startViewTransition(()=>{ if(src) src.style.viewTransitionName=''; window.__syncRender=true; try{ _g.apply(self,args); }finally{ window.__syncRender=false; } placeSegs(); }); }catch(err){ vtBusy=false; _g.apply(self,args); after(); return; }
    vt.finished.catch(()=>{}).finally(()=>{ vtBusy=false; if(src) src.style.viewTransitionName=''; morphSrc=null; }); }; }

// ---------- cotações: a célula pisca a verde ou vermelho quando o preço muda ----------
const seenPx={};
{ const _rb=renderBoard; renderBoard=function(){ _rb(); document.querySelectorAll('#board tr[data-asset]').forEach(tr=>{ const id=tr.dataset.asset,p=st.quotes[id]?.price,o=seenPx[id]; seenPx[id]=p; if(o!=null&&p!=null&&p!==o) tr.cells[1].classList.add(p>o?'tk-up':'tk-down'); }); }; }

// ---------- ficha do ativo: o preço assenta no valor ao trocar de ativo ----------
let lastAsset=null;
{ const _ra=renderAsset; renderAsset=function(animate){ _ra(animate); const id=st.asset,q=st.quotes[id],el=$('aPrice'); if(!q||id===lastAsset){ lastAsset=id; return; } lastAsset=id;
    const y=q.kind==='yield',to=+q.price,from=to*.985,d=qDec(q),t0=performance.now(),fmt=v=>y?nf(v,2)+'%':nf(v,d);
    const step=t=>{ const k=Math.min(1,(t-t0)/420); if(st.asset!==id) return; el.textContent=fmt(from+(to-from)*(1-Math.pow(1-k,4))); if(k<1) requestAnimationFrame(step); }; requestAnimationFrame(step); }; }

// ---------- velas: entram em cascata da esquerda para a direita ----------
{ const _d=drawChart; drawChart=function(animate){ _d(animate); if(!animate||!chartState?.candle) return; const cs=document.querySelectorAll('#chart .cnd'),step=Math.min(14,420/cs.length); cs.forEach((g,i)=>g.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:280,delay:i*step,easing:EO,fill:'backwards'})); }; }

// ---------- favoritos e escolhas do radar: o elemento salta ao ser marcado ----------
const pop=el=>el?.animate([{transform:'scale(1)'},{transform:'scale(1.32)',offset:.4},{transform:'scale(1)'}],{duration:340,easing:EO});
document.addEventListener('click',e=>{ const f=e.target.closest?.('[data-fav]'),c=e.target.closest?.('[data-rd]');
  if(f){ const id=f.dataset.fav; setTimeout(()=>document.querySelectorAll('[data-fav="'+CSS.escape(id)+'"][aria-pressed="true"]').forEach(pop),0); }
  // adicionar ao radar: uma cápsula com o nome desliza do botão até ao lugar do ponto, que acende ao aterrar
  const src=c||e.target.closest?.('[data-rdtop]'); if(src){ const r0=src.getBoundingClientRect(),prev=new Set(rd.ids); setTimeout(()=>rd.ids.filter(x=>!prev.has(x)).forEach((id,i)=>fly(id,r0,i*90)),0); } },true);
const FLY=680;
function fly(id,r0,delay){ const g=q1('#radar2 .bw[data-id="'+CSS.escape(id)+'"]'),stage=$('radarBig').getBoundingClientRect(),sx=r0.left+r0.width/2,sy=r0.top+r0.height/2; let tx=stage.left+stage.width/2,ty=stage.top+stage.height/2,b=null,rg=null;
  if(g){ b=g.querySelector('.blip'); rg=g.querySelector('.rg'); const br=b.getBoundingClientRect(); tx=br.left+br.width/2; ty=br.top+br.height/2; g.getAnimations().forEach(a=>a.cancel()); g.animate([{opacity:0},{opacity:0}],{duration:FLY+delay-40}); }
  const el=document.createElement('span'); el.className='flyer'; el.textContent=nameOf(id); el.style.left=sx+'px'; el.style.top=sy+'px'; document.body.appendChild(el);
  const dx=tx-sx,dy=ty-sy,lift=Math.min(130,50+Math.hypot(dx,dy)*.14);
  el.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(calc(-50% + ${(dx*.5).toFixed(1)}px),calc(-50% + ${(dy*.5-lift).toFixed(1)}px)) scale(.72)`,opacity:1,offset:.5},{transform:`translate(calc(-50% + ${dx.toFixed(1)}px),calc(-50% + ${dy.toFixed(1)}px)) scale(.14)`,opacity:.85}],{duration:FLY,delay,easing:'cubic-bezier(.77,0,.175,1)',fill:'backwards'}).onfinish=()=>{ el.remove();
    if(b&&b.isConnected){ b.animate([{transform:'scale(2.8)'},{transform:'scale(1)'}],{duration:520,easing:EO}); rg.animate([{transform:'scale(1)',opacity:.95},{transform:'scale(6)',opacity:0}],{duration:700,easing:EO}); } }; }

// ---------- calendário: a leitura do evento entra suavemente; a lista entra em cascata ao mudar de período ----------
let lastSel=null,lastRange='';
{ const _rr=renderRead; renderRead=function(){ _rr(); if(st.sel===lastSel) return; lastSel=st.sel; if(st.view==='calendario') $('read').animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:240,easing:EO}); }; }
{ const _rc=renderCal; renderCal=function(){ _rc(); const k=range().join('|'); if(k===lastRange||st.view!=='calendario') { lastRange=k; return; } lastRange=k;
    [...document.querySelectorAll('#list .row')].slice(0,14).forEach((r,i)=>r.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:260,delay:i*22,easing:EO,fill:'backwards'})); }; }

// ---------- tabela de desempenho: ao ordenar, as linhas deslizam para o novo lugar ----------
{ const _rs=renderScreen; renderScreen=function(){ const before=new Map(); document.querySelectorAll('#screen tr[data-asset]').forEach(tr=>before.set(tr.dataset.asset,tr.getBoundingClientRect().top)); _rs(); if(!before.size||st.view!=='analise') return;
    document.querySelectorAll('#screen tr[data-asset]').forEach(tr=>{ const o=before.get(tr.dataset.asset); if(o==null) return; const d=o-tr.getBoundingClientRect().top; if(Math.abs(d)>1) tr.animate([{transform:`translateY(${d.toFixed(1)}px)`},{transform:'none'}],{duration:360,easing:EO}); }); }; }

// ---------- matrizes: cruzar linha e coluna ao passar o rato ----------
if(FINE) ['cor','mx'].forEach(id=>{ const t=$(id); if(!t) return; let on=[]; const clear=()=>{ on.forEach(n=>n.classList.remove('hl')); on=[]; };
  t.addEventListener('pointerover',e=>{ const td=e.target.closest?.('td'); clear(); if(!td||!t.tHead) return; on=[td,td.parentNode.cells[0],t.tHead.rows[0].cells[td.cellIndex]].filter(Boolean); on.forEach(n=>n.classList.add('hl')); });
  t.addEventListener('pointerleave',clear); });

// ---------- comparação e curva do diário: as linhas desenham-se quando os dados mudam ----------
const draw=(p,i)=>{ if(!p.getTotalLength) return; const L=p.getTotalLength(); p.animate([{strokeDasharray:L,strokeDashoffset:L},{strokeDasharray:L,strokeDashoffset:0}],{duration:700,delay:i*90,easing:EO,fill:'backwards'}); };
let lastCmp='';
{ const _rc=renderCompare; renderCompare=function(){ _rc(); const k=st.cmp.join(',')+'|'+st.cmpRange; if(k===lastCmp||st.view!=='analise'){ lastCmp=k; return; } lastCmp=k; document.querySelectorAll('#cmp path').forEach(draw); }; }
let jIds=null;
{ const _rj=renderJournal; renderJournal=function(){ _rj(); const ids=new Set(jr.items.map(t=>t.id)),was=jIds; jIds=ids; if(!was||st.view!=='diario') return; const fresh=[...ids].filter(x=>!was.has(x)); if(!fresh.length) return;
    fresh.forEach(id=>{ const tr=q1('#jTab [data-del="'+CSS.escape(id)+'"]')?.closest('tr'); tr?.animate([{opacity:0,transform:'translateY(-10px)',background:'rgba(106,166,255,.22)'},{opacity:1,transform:'none',background:'rgba(106,166,255,.22)',offset:.5},{background:'transparent'}],{duration:900,easing:EO}); });
    const p=q1('#eq path'); if(p) draw(p,0); }; }
// confirmação de registo: o visto desenha-se
{ const m=$('jMsg'); if(m) new MutationObserver(()=>{ if(m.classList.contains('err')||!/registada|guardada/.test(m.textContent)||m.querySelector('svg')) return;
    m.insertAdjacentHTML('afterbegin','<svg class="okc" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5"/><path d="M6 10.4l2.7 2.7L14.2 7.4"/></svg>'); }).observe(m,{childList:true,characterData:true,subtree:true}); }

// ---------- calculadoras: o resultado principal acende ao mudar; a mensagem de erro abana ----------
const prevOut={};
function toolFx(out,msg){ const v=q1('#'+out+' .hi .v'),m=$(msg),t=v?.textContent,e=m&&m.classList.contains('err')?m.textContent:''; const p=prevOut[out]||{};
  if(v&&p.t!==undefined&&t!==p.t&&t!=='n/d') v.animate([{transform:'scale(1.07)',filter:'brightness(1.6)'},{transform:'none',filter:'none'}],{duration:300,easing:EO});
  if(e&&e!==p.e) m.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(5px)'},{transform:'translateX(-3px)'},{transform:'translateX(0)'}],{duration:320,easing:'ease-out'});
  prevOut[out]={t,e}; }
{ const a=calcPos; calcPos=function(){ a(); toolFx('psOut','psMsg'); }; const b=calcRR; calcRR=function(){ b(); toolFx('rrOut','rrMsg'); }; const c=calcDD; calcDD=function(){ c(); toolFx('ddOut',''); }; }
})();
