// ================= Movimento partilhado: texto cinético, scroll-scrub, cortina entre vistas, cursor =================
// Tudo só com transform/opacity/clip-path. Com prefers-reduced-motion fica no estado final, sem movimento.
const M3_COL={inicio:'var(--yellow)',aprender:'var(--blue)',painel:'var(--red)',mercados:'var(--green)',calendario:'var(--yellow)',analise:'var(--blue)',radar:'var(--red)',ferramentas:'var(--green)',diario:'var(--blue)',metodo:'var(--yellow)'};
const m3={ready:false,busy:false,act:new Set(),loops:new Set(),lraf:0,raf:0,io:null,seen:null,mx:0,my:0,cx:0,cy:0,curRaf:0};
const m3fine=()=>matchMedia('(hover:hover) and (pointer:fine)').matches;

// ---- Scroll-scrub: põe --p (0 a 1) no elemento enquanto está visível. modos: view | enter | pin ----
function m3Progress(el){
  const r=el.getBoundingClientRect(),vh=innerHeight,mode=el.dataset.scrub;
  if(mode==='pin') return clamp(-r.top/Math.max(1,r.height-vh),0,1);
  if(mode==='enter') return clamp((vh-r.top)/(vh*.72),0,1);
  return clamp((vh-r.top)/(vh+r.height),0,1);
}
function m3Apply(el,p){
  if(el._p===p) return; el._p=p; el.style.setProperty('--p',p.toFixed(4)); if(el._on) el._on(p,el);
  el.querySelectorAll('[data-n]').forEach(n=>{ const a=+n.dataset.from,b=+n.dataset.to,t=clamp((p-(+n.dataset.t0||0))/((+n.dataset.t1||1)-(+n.dataset.t0||0)),0,1),v=a+(b-a)*t; n.textContent=n.dataset.fmt==='pct'?nf(v,0)+'%':n.dataset.fmt==='eur'?lrnEUR(v):nf(v,0); });
}
function m3Tick(){ m3.raf=0; m3.act.forEach(el=>m3Apply(el,m3Progress(el))); }

// ---- Loop suave: 0 -> 1 -> 0 num ciclo de ~7 s, com pausa nas pontas; só corre com a cena visível ----
const M3_LOOP_MS=7200;
const m3Wave=now=>{ const t=(now%M3_LOOP_MS)/M3_LOOP_MS,tri=t<.5?t*2:2-t*2,x=clamp((tri-.1)/.8,0,1); return x*x*(3-2*x); };
function m3LoopRun(){
  if(m3.lraf||!m3.loops.size||document.hidden) return;
  const f=now=>{ m3.lraf=0; if(!m3.loops.size||document.hidden) return; const p=m3Wave(now); m3.loops.forEach(el=>{ if(!el.isConnected){ m3.loops.delete(el); return; } m3Apply(el,p); }); m3.lraf=requestAnimationFrame(f); };
  m3.lraf=requestAnimationFrame(f);
}
function m3Sched(){ if(!m3.raf&&m3.act.size) m3.raf=requestAnimationFrame(m3Tick); }

// ---- Texto cinético: parte o texto em palavras que entram com cortina ----
function m3Kin(el){
  if(el.dataset.kinDone) return; el.dataset.kinDone='1';
  const txt=el.textContent.trim(); el.setAttribute('aria-label',txt);
  el.innerHTML=txt.split(/\s+/).map((w,i)=>`<span class="k" aria-hidden="true"><span class="kw" style="--i:${i}">${esc(w)}</span></span>`).join(' ');
}
function m3Count(el){
  const to=+el.dataset.count,fmt=el.dataset.fmt;
  const put=v=>{ el.textContent=fmt==='pct'?nf(v,0)+'%':fmt==='eur'?lrnEUR(v):nf(v,0); };
  if(reduced()){ put(to); return; }
  const t0=performance.now(),dur=1400; const step=t=>{ const k=clamp((t-t0)/dur,0,1); put(to*(1-Math.pow(1-k,4))); if(k<1) requestAnimationFrame(step); }; requestAnimationFrame(step);
}

// ---- Varre uma zona e liga tudo o que tem data-kin / data-scrub / data-count / .rv ----
function m3Scan(root){
  root=root||document;
  root.querySelectorAll('[data-kin]').forEach(m3Kin);
  const rm=reduced();
  if(!m3.io){ m3.io=new IntersectionObserver(es=>es.forEach(e=>{ const el=e.target;
      if(e.isIntersecting){ el.classList.add('in'); if(el.dataset.count&&!el._counted){ el._counted=1; m3Count(el); } if(el.dataset.scrub==='loop'){ m3.loops.add(el); m3LoopRun(); } else if(el.hasAttribute('data-scrub')){ m3.act.add(el); m3Sched(); } if(!el.hasAttribute('data-loop')&&!el.hasAttribute('data-scrub')&&!el.dataset.count&&!el.classList.contains('k-live')) m3.io.unobserve(el); }
      else{ if(el.hasAttribute('data-scrub')){ m3.act.delete(el); m3.loops.delete(el); } if(el.hasAttribute('data-loop')) el.classList.remove('in'); } }),{threshold:0.12,rootMargin:'0px 0px -6% 0px'}); }
  root.querySelectorAll('[data-kin],.rv,[data-scrub],[data-count],[data-loop]').forEach(el=>{
    if(rm){ el.classList.add('in'); if(el.dataset.count) el.textContent=(el.dataset.fmt==='pct'?nf(+el.dataset.count,0)+'%':el.dataset.fmt==='eur'?lrnEUR(+el.dataset.count):nf(+el.dataset.count,0)); if(el.hasAttribute('data-scrub')){ el.style.setProperty('--p',el.dataset.scrub==='pin'?1:1); if(el._on) el._on(1,el); el.querySelectorAll('[data-n]').forEach(n=>{ const v=+n.dataset.to; n.textContent=n.dataset.fmt==='pct'?nf(v,0)+'%':n.dataset.fmt==='eur'?lrnEUR(v):nf(v,0); }); } return; }
    if(el._m3) return; el._m3=1; m3.io.observe(el); });
}

// ---- Cortina entre vistas ----
function m3Go(v,push,keep){
  const run=()=>{ goNow(v,push,keep); m3Nav(); };
  if(!m3.ready||reduced()||m3.busy||(st&&st.view===(ALIAS[v]||v))){ run(); m3.ready=true; return; }
  const cur=$('curtain'); if(!cur){ run(); return; }
  m3.busy=true; cur.style.background=M3_COL[ALIAS[v]||v]||'var(--yellow)';
  const ease='cubic-bezier(.77,0,.175,1)';
  cur.animate([{clipPath:'inset(0 0 0 100%)'},{clipPath:'inset(0 0 0 0)'}],{duration:190,easing:ease,fill:'forwards'}).finished
    .then(()=>{ run(); return cur.animate([{clipPath:'inset(0 0 0 0)'},{clipPath:'inset(0 100% 0 0)'}],{duration:300,easing:ease,fill:'forwards'}).finished; })
    .then(()=>{ cur.getAnimations().forEach(a=>a.cancel()); m3.busy=false; })
    .catch(()=>{ m3.busy=false; });
}
// Indicador deslizante do menu
function m3Nav(){ const n=document.querySelector('.nav'),b=n&&n.querySelector('[aria-current="true"]'); if(!b) return; n.style.setProperty('--nx',b.offsetLeft+'px'); n.style.setProperty('--ns',b.offsetWidth); }

// ---- Cabeçalho "cartaz" das vistas de mercados: cor e forma por vista ----
const M3_HEAD={painel:['red','arcs'],mercados:['green','candles'],calendario:['yellow','tile'],analise:['blue','donut'],radar:['red','eye'],ferramentas:['green','stack'],diario:['blue','path'],metodo:['yellow','pie']};
function m3Heads(){ Object.entries(M3_HEAD).forEach(([v,[c,g]])=>{ const sec=$('v-'+v),vh=sec&&sec.querySelector('.vh'); if(!vh||vh.dataset.g) return; vh.dataset.g='1'; vh.classList.add('mc-'+c,'poster'); vh.insertAdjacentHTML('beforeend',`<span class="vh-g" aria-hidden="true">${lrnGlyph(g)}</span>`); const h=vh.querySelector('h1'); if(h) h.setAttribute('data-kin',''); }); }

// ---- Cursor, botões magnéticos e paralaxe do rato (só com rato; nunca em ecrã tátil) ----
function m3Pointer(){
  if(!m3fine()||reduced()) return;
  const cur=document.createElement('div'); cur.id='cur'; cur.setAttribute('aria-hidden','true'); document.body.appendChild(cur);
  const loop=()=>{ m3.cx+=(m3.mx-m3.cx)*.22; m3.cy+=(m3.my-m3.cy)*.22; cur.style.transform=`translate(${m3.cx}px,${m3.cy}px) translate(-50%,-50%)`; m3.curRaf=(Math.abs(m3.mx-m3.cx)+Math.abs(m3.my-m3.cy)>.3)?requestAnimationFrame(loop):0; };
  let mag=null;
  addEventListener('pointermove',e=>{
    if(e.pointerType!=='mouse') return; cur.classList.add('on'); m3.mx=e.clientX; m3.my=e.clientY; if(!m3.curRaf) m3.curRaf=requestAnimationFrame(loop);
    const t=e.target.closest&&e.target.closest('a,button,input,select,[data-mod],.lrn-row,.lrn-opt,summary,label'); cur.classList.toggle('hot',!!t);
    const b=e.target.closest&&e.target.closest('.btn.lg');
    if(mag&&mag!==b){ mag.style.translate=''; mag=null; }
    if(b){ const r=b.getBoundingClientRect(); b.style.translate=`${((e.clientX-r.left)/r.width-.5)*10}px ${((e.clientY-r.top)/r.height-.5)*8}px`; mag=b; }
    const hero=e.target.closest&&e.target.closest('.hm-hero'); if(hero){ const r=hero.getBoundingClientRect(); hero.style.setProperty('--mx',(((e.clientX-r.left)/r.width)*2-1).toFixed(3)); hero.style.setProperty('--my',(((e.clientY-r.top)/r.height)*2-1).toFixed(3)); }
  },{passive:true});
  document.addEventListener('pointerleave',()=>cur.classList.remove('on'));
  document.addEventListener('visibilitychange',()=>{ document.documentElement.classList.toggle('m3-paused',document.hidden); if(!document.hidden) m3LoopRun(); });
}

function m3Init(){
  const c=document.createElement('div'); c.id='curtain'; c.setAttribute('aria-hidden','true'); document.body.appendChild(c);
  addEventListener('scroll',m3Sched,{passive:true}); addEventListener('resize',()=>{ m3Sched(); m3Nav(); },{passive:true});
  m3Heads(); m3Pointer(); m3Scan(document);
  m3Nav(); if(document.fonts&&document.fonts.ready) document.fonts.ready.then(m3Nav);
}
// confetti geométrico discreto (círculos e quadrados nas cores do cartaz) a partir de um elemento
function m3Burst(el){
  if(reduced()||!el.animate) return; const r=el.getBoundingClientRect(),cols=['#FFC400','#D8321A','#1F3FD6','#0C7A4F'];
  for(let i=0;i<16;i++){ const s=document.createElement('i'); const sz=6+Math.random()*8; s.style.cssText=`position:fixed;left:${r.left+r.width/2}px;top:${r.top+r.height/2}px;width:${sz}px;height:${sz}px;background:${cols[i%4]};border:1.5px solid #16120E;border-radius:${i%2?'50%':'2px'};pointer-events:none;z-index:95`; document.body.appendChild(s);
    const a=Math.random()*Math.PI*2,d=50+Math.random()*90; s.animate([{transform:'translate(-50%,-50%) scale(1) rotate(0)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*d}px),calc(-50% + ${Math.sin(a)*d-30}px)) scale(.4) rotate(${Math.random()*360}deg)`,opacity:0}],{duration:700+Math.random()*300,easing:'cubic-bezier(.23,1,.32,1)'}).finished.then(()=>s.remove()).catch(()=>s.remove()); }
}
