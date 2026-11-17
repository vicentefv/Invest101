// ================= Início: hero animado, marquee, mapa dos módulos =================
const HM_FACTS=[
  ['100 000 €','por banco: é o que o Fundo de Garantia de Depósitos protege'],
  ['28%','taxa autónoma sobre mais-valias de ações e ETFs em Portugal'],
  ['VOO e SPY','não se compram em Portugal; os ETFs UCITS, sim'],
  ['72 ÷ taxa','= anos para o dinheiro duplicar'],
  ['100 €','valem cerca de 74 € em poder de compra daqui a 10 anos, com 3% de inflação']
];
const hmSt={ran:false,raf:0};

// Curva de juros compostos desenhada como cartaz: barras que crescem, círculos nos topos, sol e arcos atrás.
function hmArt(){
  const n=14,W=560,H=520,base=470,bw=28,gap=11,x0=34;
  const series=lrnCompound({initial:0,monthly:100,rate:5,years:20}),fin=series.at(-1);
  const hmax=360,cols=['var(--blue)','var(--red)','var(--yellow)'];
  let bars='';
  for(let i=0;i<n;i++){ const t=Math.pow(1.19,i)/Math.pow(1.19,n-1),h=Math.max(26,t*hmax),x=x0+i*(bw+gap);
    bars+=`<g class="hm-bar" style="--i:${i};--h:${h.toFixed(0)}"><rect x="${x}" y="${base-h}" width="${bw}" height="${h}" fill="${cols[i%3]}" stroke="var(--ink)" stroke-width="2.5"/><circle class="hm-cap" cx="${x+bw/2}" cy="${base-h-bw*.62}" r="${bw*.46}" fill="${cols[(i+1)%3]}" stroke="var(--ink)" stroke-width="2.5"/></g>`; }
  $('hmArt').innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Ilustração: barras e círculos a crescer como a curva dos juros compostos"><g class="hm-sun"><path d="M80 ${base}a210 210 0 0 1 420 0z" fill="var(--yellow)" stroke="var(--ink)" stroke-width="2.5"/></g><g class="hm-arcs" fill="none" stroke="var(--ink)" stroke-width="2.5"><path d="M30 ${base}a250 250 0 0 1 500 0"/><path d="M52 ${base}a228 228 0 0 1 456 0" stroke-dasharray="2 9" stroke-linecap="round"/></g>${bars}<line x1="14" x2="${W-14}" y1="${base+1}" y2="${base+1}" stroke="var(--ink)" stroke-width="3"/><circle class="hm-float" cx="470" cy="96" r="22" fill="var(--red)" stroke="var(--ink)" stroke-width="2.5"/></svg>`;
  $('hmN').dataset.to=Math.round(fin.total); $('hmPaid').textContent=lrnEUR(fin.paid);
}

function hmCount(){
  const el=$('hmN'),to=+el.dataset.to||0; cancelAnimationFrame(hmSt.raf);
  if(reduced()){ el.textContent=lrnEUR(to); return; }
  const t0=performance.now(),dur=1900,from=0;
  const step=t=>{ const k=Math.min(1,(t-t0-700)/dur); const e=k<=0?0:1-Math.pow(1-k,4); el.textContent=lrnEUR(from+(to-from)*e); if(k<1) hmSt.raf=requestAnimationFrame(step); };
  hmSt.raf=requestAnimationFrame(step);
}

function hmTiles(){
  $('hmTiles').innerHTML=LRN_MODULES.map((m,i)=>{ const n=LRN.filter(a=>a.topic===m.id).length;
    const tops=LRN.filter(a=>a.topic===m.id).map(a=>a.title).concat(m.soon).slice(0,5);
    return `<button class="hm-tile mc-${m.color}${n?'':' is-soon'} rv" style="--i:${i%4}" data-mod="${m.id}"><span class="hm-tg">${lrnGlyph(m.glyph)}</span><span class="hm-tn">${esc(m.name)}</span><span class="hm-tt" aria-hidden="true">${tops.map(t=>`<i>${esc(t)}</i>`).join('')}</span><span class="hm-tc">${n?`${n} ${n===1?'tema':'temas'} · mais ${m.soon.length} a caminho`:`${m.soon.length} ${m.soon.length===1?'tema':'temas'} a caminho`}</span></button>`; }).join('');
}

function hmMarquee(){
  const one=HM_FACTS.map(([a,b])=>`<span class="hm-mi"><b>${esc(a)}</b> ${esc(b)}</span><i class="hm-sep" aria-hidden="true"></i>`).join('');
  $('hmMq').innerHTML=one+one; // duas cópias: o deslocamento de -50% fecha o ciclo sem saltos
}

// Faixa gigante com os nomes dos módulos (contornos e preenchidos a alternar)
function hmBig(){ const one=LRN_MODULES.map((m,i)=>'<span class="'+(i%2?'f':'o')+'">'+esc(m.name)+'</span><i></i>').join(''); $('hmBig').innerHTML=one+one; }

// História pinada: um euro, a inflação, os juros, e só o que existe em Portugal. Controlada pelo scroll (--p).
const HS={infl:lrnReal(1000,3,10),grow:lrnCompound({initial:1000,monthly:0,rate:5,years:20}).at(-1).total};
const hsEase=t=>1-Math.pow(1-t,3), hsLerp=(a,b,t)=>a+(b-a)*t;
function hmStoryTick(p,el){
  const s=Math.min(3,Math.floor(p*4)),t=hsEase(clamp(p*4-s,0,1)),coin=$('hsCoin'),val=$('hsVal'); if(!coin) return;
  el.querySelector('.hs-stage').dataset.sc=s;
  let v=1000,x=300,y=290,r=0,sc=1,st=0;
  if(s===1){ v=hsLerp(1000,HS.infl,t); }
  else if(s===2){ v=hsLerp(1000,HS.grow,t); x=hsLerp(300,330,t); r=t*360; }
  else if(s===3){ v=HS.grow; x=hsLerp(330,170,t); st=t; }
  sc=Math.sqrt(v/1000)*(s===3?hsLerp(1,.55,t):1);
  if(s<3) y=470-130*sc; else y=hsLerp(470-130*Math.sqrt(HS.grow/1000),150,t);
  coin.setAttribute('transform','translate('+x+' '+y+') rotate('+r+') scale('+sc.toFixed(3)+')');
  val.setAttribute('transform','rotate('+(-r)+')'); val.textContent=lrnEUR(v);
  $('hsStamps').setAttribute('opacity',st.toFixed(2));
}
function hmStory(){ const el=$('hmStory'); if(!el) return; $('hsS1').textContent='Com 3% de inflação, em 10 anos, 1 000 € compram como '+lrnEUR(HS.infl)+'.'; $('hsS2').textContent='A 5% ao ano, em 20 anos, os mesmos 1 000 € passam a '+lrnEUR(HS.grow)+' (exemplo, sem entradas).'; el._on=hmStoryTick; hmStoryTick(0,el); }

// Abertura: placa amarela com o nome, que se fecha em círculo. Só uma vez por sessão; salta com um clique ou tecla.
function hmIntro(){
  let seen=false; try{ seen=sessionStorage.getItem('i101.intro')==='1'; }catch(e){}
  if(seen||reduced()) return Promise.resolve();
  try{ sessionStorage.setItem('i101.intro','1'); }catch(e){}
  return new Promise(res=>{
    const d=document.createElement('div'); d.id='intro'; d.setAttribute('aria-hidden','true'); d.innerHTML='<b>Invest101</b>'; document.body.appendChild(d);
    let done=false; const end=()=>{ if(done) return; done=true; removeEventListener('keydown',end); const a=d.animate([{clipPath:'circle(150% at 50% 50%)'},{clipPath:'circle(0% at 50% 50%)'}],{duration:650,easing:'cubic-bezier(.77,0,.175,1)',fill:'forwards'}); res(); a.finished.then(()=>d.remove()).catch(()=>d.remove()); };
    d.addEventListener('click',end); addEventListener('keydown',end,{once:true}); setTimeout(end,1250);
  });
}

function hmTry(){ widgetCompound($('hmTry'),'home',{initial:0,monthly:150,rate:5,years:25}); }

function hmReveal(){
  const els=document.querySelectorAll('#v-inicio .rv:not(.in)');
  if(reduced()||!('IntersectionObserver' in window)){ els.forEach(e=>e.classList.add('in')); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),{threshold:.15,rootMargin:'0px 0px -6% 0px'});
  els.forEach(e=>io.observe(e));
}

function renderHome(animate){
  const v=$('v-inicio');
  if(!hmSt.ran){ hmSt.ran=true; hmArt(); hmTiles(); hmMarquee(); hmTry(); hmBig(); hmStory();
    v.addEventListener('click',e=>{ const t=e.target.closest('[data-mod]'); if(t){ lrnOpenModule(t.dataset.mod); return; } if(e.target.closest('#hmMap')) $('hmMapSec').scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'}); }); }
  // reinicia a animação do hero de cada vez que se entra na vista
  if(typeof glUpdate==='function') glUpdate();
  if(animate===false&&hmSt.introDone) return;
  v.classList.remove('go'); void v.offsetWidth;
  if(!hmSt.introDone){ hmSt.introDone=true; hmIntro().then(()=>{ v.classList.add('go'); hmCount(); }); } else { v.classList.add('go'); hmCount(); }
}
