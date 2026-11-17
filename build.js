// Junta src/ num único index.html (a página publicada) e num test.html com dados de exemplo.
// Uso: node build.js [pasta com quotes/, history/, days/, meta/, ohlc/ e kronos/ em JSON]
const fs=require('fs'),path=require('path');
const src=f=>fs.readFileSync(path.join(__dirname,'src',f),'utf8');
const vend=f=>fs.readFileSync(path.join(__dirname,'src','vendor',f),'utf8');
const fonts='<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500..900&family=Hanken+Grotesk:wght@400;500;600&family=Martian+Mono:wdth,wght@75..112,400..600&display=swap">';
const page=`<title>Invest101</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n${fonts}\n<style>\n${src('style.css')}${src('theme.css')}${src('motion3.css')}${src('markets.css')}${src('learn.css')}${src('home.css')}${src('globe.css')}</style>\n\n${src('body.html')}\n<script>\n${vend('d3-array.min.js')}\n${vend('d3-geo.min.js')}\n${vend('topojson-client.min.js')}\n${src('globe-data.js')}\n${src('globe-core.js')}\n${src('app1.js')}\n${src('learn-core.js')}\n${src('learn-data.js')}
${src('learn-mod-fundamentos.js')}
${src('learn-mod-mercados.js')}
${src('learn-mod-produtos.js')}
${src('learn-mod-risco.js')}
${src('learn-mod-carteira.js')}
${src('learn-mod-portugal.js')}
${src('learn-mod-impostos.js')}
${src('learn-mod-fundamental.js')}
${src('learn-mod-tecnica.js')}
${src('learn-mod-psicologia.js')}
${src('learn-mod-planeamento.js')}
${src('learn-mod-glossario.js')}
${src('learn-data-z.js')}\n${src('learn.js')}\n${src('motion3.js')}\n${src('home.js')}\n${src('globe.js')}\n${src('app2.js')}\n${src('bars.js')}\n${src('indic.js')}\n${src('motion.js')}\n${src('motion2.js')}</script>\n`;
fs.mkdirSync(path.join(__dirname,'dist'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'dist','index.html'),page);
console.log('dist/index.html',Buffer.byteLength(page),'bytes');
const dir=process.argv[2];
if(dir){
  const load=c=>{ const o={}; const d=path.join(dir,c); if(fs.existsSync(d)) for(const f of fs.readdirSync(d)) o[f.replace(/\.json$/,'')]=JSON.parse(fs.readFileSync(path.join(d,f),'utf8')); return o; };
  const data={quotes:load('quotes'),history:load('history'),days:load('days'),meta:load('meta'),ohlc:load('ohlc'),kronos:load('kronos')};
  const mock=`<script>
const __D=${JSON.stringify(data)};
// fora do Artifact (GitHub Pages) o diário e o radar ficam no browser de cada pessoa
const lsGet=(k,d)=>{ try{ return JSON.parse(localStorage.getItem(k))??d; }catch(e){ return d; } }, lsSet=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} };
const __J=lsGet('i101-diario',[]);
const snap=(id,d)=>({id,exists:!!d,data:()=>d,metadata:{}});
const jsubs=[]; const jfire=()=>{ lsSet('i101-diario',__J); jsubs.forEach(f=>f({docs:__J.map(t=>snap(t.id,t.d))})); };
const col=name=>({onSnapshot(cb){ if(name==='trades'){ jsubs.push(cb); setTimeout(jfire,0); } else setTimeout(()=>cb({docs:Object.entries(__D[name]||{}).map(([k,v])=>snap(k,v))}),0); return ()=>{}; },
  add:async d=>{ __J.push({id:'t'+Date.now(),d}); jfire(); }, doc:id=>({delete:async()=>{ const i=__J.findIndex(t=>t.id===id); if(i>=0) __J.splice(i,1); jfire(); }})});
let __R=lsGet('i101-radar',null); const rsubs=[]; const rdoc={onSnapshot(cb){ rsubs.push(cb); setTimeout(()=>cb(snap('radar',__R)),0); return ()=>{}; },set:async d=>{ __R=d; lsSet('i101-radar',d); rsubs.forEach(f=>f(snap('radar',__R))); }};
const db={collection:col,doc:p=>p.startsWith('ohlc/')?{get:async()=>snap(p.slice(5),__D.ohlc[p.slice(5)])}:p.startsWith('kronos/')?{get:async()=>snap(p.slice(7),__D.kronos[p.slice(7)])}:p.endsWith('/radar')?rdoc:p==='meta/status'?{onSnapshot(cb){ setTimeout(()=>cb(snap('status',__D.meta.status)),0); return ()=>{}; }}:{collection:()=>col('trades')}};
window.claude={use:async n=>n==='db'?db:n==='user'?{id:async()=>'u_teste'}:null};
</script>`;
  const test=`<!doctype html><html><head><meta charset="utf8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;background:#faf9f5}img{max-width:100%}[hidden]{display:none!important}</style></head><body>\n${mock}\n${page}</body></html>`;
  fs.writeFileSync(path.join(__dirname,'dist','test.html'),test);
  console.log('dist/test.html com dados de',dir);
}
