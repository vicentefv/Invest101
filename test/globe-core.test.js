const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const g=require('../src/globe-core.js');
const ids=fs.readdirSync(path.join(__dirname,'..','data','quotes')).map(f=>f.replace(/\.json$/,''));

test('os 24 ativos do site têm todos uma localização, sem repetidos nem sobras',()=>{ assert.equal(ids.length,24); assert.deepEqual(g.globeCheck(ids),[]); });
test('globeCheck deteta um ativo em falta',()=>{ assert.ok(g.globeCheck(ids.concat('XYZ')).some(e=>/sem localização: XYZ/.test(e))); });
test('os arcos de forex ligam locais que existem',()=>{ const p=new Set(g.GLOBE_PLACES.map(x=>x.id)); g.GLOBE_ARCS.forEach(([a,b])=>{ assert.ok(p.has(a)&&p.has(b)); }); });
test('há 7 continentes rotulados e as vistas por região têm coordenadas',()=>{ assert.equal(g.GLOBE_CONT.length,7); Object.values(g.GLOBE_VIEWS).forEach(([lo,la])=>{ assert.ok(Math.abs(lo)<=180&&Math.abs(la)<=90); }); });
test('a camada de ETFs tem os 2 UCITS verificados na Irlanda e o VOO/SPY como não comprável',()=>{ const ie=g.GLOBE_ETF.find(x=>x.id==='ie'),us=g.GLOBE_ETF.find(x=>x.id==='us'); assert.deepEqual(ie.rows.map(r=>r.isin),['IE00B5BMR087','IE00BFMXXD54']); assert.ok(us.rows.every(r=>!r.ok)); });

test('todos os ativos têm um símbolo curto',()=>{ ids.forEach(i=>assert.ok(g.GLOBE_SHORT[i],'sem símbolo curto: '+i)); });
test('o leque abre para fora e espalha as fichas',()=>{ const f=g.globeFan(0,7); assert.equal(f.length,7); f.forEach(o=>assert.ok(o.dx>0)); assert.ok(new Set(f.map(o=>Math.round(o.dy))).size>=6); });
test('a relaxação separa 7 fichas no mesmo sítio e mantém-nas dentro da caixa',()=>{
  const fan=g.globeFan(-0.6,7),it=fan.map(o=>({w:70,h:26,tx:200+o.dx,ty:200+o.dy}));
  g.globeRelax(it,{w:420,h:420},30,3);
  for(let i=0;i<it.length;i++){ const a=it[i]; assert.ok(a.x-a.w/2>=0&&a.x+a.w/2<=420&&a.y-a.h/2>=0&&a.y+a.h/2<=420);
    for(let j=i+1;j<it.length;j++){ const b=it[j]; const ov=Math.abs(a.x-b.x)<(a.w+b.w)/2&&Math.abs(a.y-b.y)<(a.h+b.h)/2; assert.ok(!ov,'sobreposição '+i+'-'+j); } }
});
test('fichas fixas não se mexem',()=>{ const it=[{w:60,h:24,tx:100,ty:100,fixed:true},{w:60,h:24,tx:104,ty:102}]; g.globeRelax(it,{w:300,h:300},8,2); assert.equal(it[0].x,100); assert.equal(it[0].y,100); });
