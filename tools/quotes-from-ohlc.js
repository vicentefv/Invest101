// Atualiza <pasta>/quotes e <pasta>/history a partir das velas em <pasta>/ohlc (escritas por fetch-ohlc.js).
// Uso: node tools/quotes-from-ohlc.js data   (mantém nome, classe e ordem de cada cotação; muda preço, variação e hora)
const fs=require('fs'),path=require('path');
const dir=process.argv[2]||'data',rd=f=>{ try{ return JSON.parse(fs.readFileSync(f,'utf8')); }catch(e){ return null; } };
// dia de uma vela diária: o Yahoo abre-a na véspera à noite (UTC), por isso soma-se 6 h antes de tirar a data
const day=t=>new Date((t+6*3600)*1000).toISOString().slice(0,10);
function update(id,doc,q){
  const d=doc.tf.d1; if(!d||d.c.length<2) return null;
  const m=doc.tf.m15, n=d.c.length, lastDay=day(d.t[n-1]);
  const useM=m&&m.t.length&&day(m.t[m.t.length-1])>=lastDay, price=useM?m.c[m.c.length-1]:d.c[n-1];
  const prev=d.c[n-2], t=useM?m.t[m.t.length-1]:d.t[n-1];
  const out={...(q||{name:id,cls:'',ord:99}),price,updatedAt:new Date(t*1000).toISOString()};
  if(out.kind==='yield'){ out.chgBp=Math.round((price-prev)*100); delete out.chg; } else out.chg=Math.round((price/prev-1)*1e4)/100;
  const base=day(d.t[0]),b0=Date.parse(base);
  const hist={base,o:d.t.map(x=>Math.round((Date.parse(day(x))-b0)/864e5)),c:d.c,h:[]};
  return {out,hist};
}
if(require.main===module){
  const ok=[];
  for(const f of fs.readdirSync(path.join(dir,'ohlc'))){ const id=f.replace(/\.json$/,''),doc=rd(path.join(dir,'ohlc',f)); if(!doc) continue;
    const r=update(id,doc,rd(path.join(dir,'quotes',f))); if(!r) continue;
    fs.writeFileSync(path.join(dir,'quotes',f),JSON.stringify(r.out)); fs.writeFileSync(path.join(dir,'history',f),JSON.stringify(r.hist)); ok.push(id); }
  console.log('cotações atualizadas:',ok.length,ok.join(' '));
}
module.exports={update,day};
