// ================= Movimento =================
// Só o que ajuda a ler: radar com feixe, ponteiro do risco, linha do gráfico a desenhar-se e o último preço a pulsar.
// Com "reduzir movimento" ligado não corre nada daqui: a página fica completa e estática.
(()=>{
const RM=reduced(), FINE=matchMedia('(hover:hover) and (pointer:fine)').matches, EO='cubic-bezier(.23,1,.32,1)';
const q1=s=>document.querySelector(s);
function whenSeen(el,fn){ if(!el) return; if(!('IntersectionObserver' in window)){ fn(); return; } const io=new IntersectionObserver(es=>{ if(es.some(e=>e.isIntersecting)){ io.disconnect(); fn(); } },{rootMargin:'0px 0px -10% 0px'}); io.observe(el); }

// ---------- faíscas: só quando se regista uma operação ganhadora ----------
window.burst=function(el){ if(RM||!el) return; const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  for(let i=0;i<14;i++){ const d=document.createElement('i'); d.className='spark'; d.style.cssText=`left:${cx}px;top:${cy}px;background:${i%3?'var(--up)':'var(--accent-bg)'}`; document.body.appendChild(d);
    const a=Math.random()*Math.PI*2,v=50+Math.random()*90; d.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(calc(-50% + ${(Math.cos(a)*v).toFixed(0)}px),calc(-50% + ${(Math.sin(a)*v-30).toFixed(0)}px)) scale(.25)`,opacity:0}],{duration:600+Math.random()*350,easing:EO}).onfinish=()=>d.remove(); } };

if(RM) return;

// ---------- radar: pontos acendem com o feixe, entram do centro, cartão ao passar o rato ----------
const PERIOD=8000,known={radar2:new Set()};
function radarFx(svg,sweep){ const gs=[...svg.querySelectorAll('.bw')],was=known[svg.id],now=new Set(),st0=+(sweep?.getAnimations()[0]?.currentTime)||0; let k=0; // st0: fase atual do feixe
  gs.forEach(g=>{ const b=g.querySelector('.blip'),rg=g.querySelector('.rg'),x=+b.getAttribute('cx'),y=+b.getAttribute('cy'),phi=((Math.atan2(y-200,x-200)*180/Math.PI+90)%360+360)%360,o={duration:PERIOD,iterations:Infinity}; now.add(g.dataset.id);
    const a1=b.animate([{transform:'scale(1.9)',opacity:1},{transform:'scale(1)',opacity:.74,offset:.16},{transform:'scale(1)',opacity:.74}],o),a2=rg.animate([{transform:'scale(1)',opacity:.9},{transform:'scale(4.4)',opacity:0,offset:.2},{transform:'scale(4.4)',opacity:0}],o);
    const ph=((st0-phi/360*PERIOD)%PERIOD+PERIOD)%PERIOD; a1.currentTime=ph; a2.currentTime=ph;
    if(!was.has(g.dataset.id)) g.animate([{transform:`translate(${(200-x).toFixed(1)}px,${(200-y).toFixed(1)}px)`,opacity:0},{transform:'none',opacity:1}],{duration:800,delay:40+(k++)*30,easing:EO,fill:'backwards'}); });
  known[svg.id]=now; }
{ const _rm=renderMyRadar; renderMyRadar=function(){ _rm(); radarFx($('radar2'),q1('#radarBig .sweep')); }; }
{ const svg=$('radar2'),tip=$('rtip');
  if(FINE&&svg&&tip){ const line=()=>svg.querySelector('.rline');
    svg.addEventListener('pointerover',e=>{ const b=e.target.closest?.('.blip'); if(!b) return; const id=b.dataset.asset,q=st.quotes[id]; if(!q) return; const f=fmtQ(q),z=zDay(id),x=+b.getAttribute('cx'),y=+b.getAttribute('cy');
      tip.innerHTML=`<b>${esc(nameOf(id))}</b><span class="num">${f.p}</span><span class="num ${dc(f.v)}">${f.c}</span><small>${sg(z,1,'σ')} face ao habitual</small>`; tip.style.left=(x/4)+'%'; tip.style.top=(y/4)+'%'; tip.classList.toggle('below',y<110); tip.hidden=false;
      svg.classList.add('hov'); b.parentNode.classList.add('h'); const l=line(); if(l){ l.setAttribute('x2',x); l.setAttribute('y2',y); l.style.opacity=.55; } });
    svg.addEventListener('pointerout',e=>{ const b=e.target.closest?.('.blip'); if(!b) return; tip.hidden=true; svg.classList.remove('hov'); b.parentNode.classList.remove('h'); const l=line(); if(l) l.style.opacity=0; }); }
  $('radarBig')?.addEventListener('click',e=>{ if(e.target.closest('.blip,button')) return; q1('#radarBig .rpulse')?.animate([{transform:'scale(.12)',opacity:.75},{transform:'scale(1)',opacity:0}],{duration:1000,easing:EO}); }); }

// ---------- ponteiro do risco: mola até ao valor, a partir de onde estava ----------
let lastDeg=-90,riskSeen=false; const playNeedle=()=>{ const n=q1('#riskBox .needle'); if(!n) return; const deg=+n.dataset.deg; n.animate([{transform:`rotate(${lastDeg}deg)`},{transform:`rotate(${deg}deg)`}],{duration:1100,easing:'cubic-bezier(.34,1.3,.64,1)'}); lastDeg=deg; };
{ const _rk=renderRisk; renderRisk=function(){ _rk(); if(riskSeen) playNeedle(); }; }
whenSeen($('riskBox'),()=>{ riskSeen=true; playNeedle(); });

// ---------- linha do dia: sessões a preencher quando o painel aparece ----------
whenSeen($('timeline'),()=>{ const el=$('timeline'); el.classList.add('go'); setTimeout(()=>el.classList.remove('go'),1500); });

// ---------- gráfico: a linha desenha-se e o último preço pulsa ----------
{ const _dc=drawChart; drawChart=function(animate){ _dc(animate); const p=$('cline'); if(!p||!chartState) return; const last=chartState.pts[chartState.pts.length-1];
    $('chart').insertAdjacentHTML('beforeend',`<circle class="lp" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="4" fill="none" style="stroke:${p.style.stroke}" stroke-width="1.5"/>`);
    if(!animate||!p.getTotalLength) return; const L=p.getTotalLength(); p.animate([{strokeDasharray:L,strokeDashoffset:L},{strokeDasharray:L,strokeDashoffset:0}],{duration:600,easing:EO});
    $('chart').querySelector('path[fill="url(#cg)"]')?.animate([{opacity:0},{opacity:1}],{duration:700,easing:'ease-out'}); }; }
})();
