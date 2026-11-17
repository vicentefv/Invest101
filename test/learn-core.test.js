const test=require('node:test'), assert=require('node:assert/strict');
const c=require('../src/learn-core.js');
const near=(a,b,e=1e-6)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);

test('1000 € a 5%/ano durante 2 anos = 1102,50 €',()=>{ near(c.lrnCompound({initial:1000,monthly:0,rate:5,years:2}).at(-1).total,1102.5); });
test('sem juros o total é só o que foi depositado',()=>{ const r=c.lrnCompound({initial:100,monthly:10,rate:0,years:1}).at(-1); near(r.total,220); near(r.paid,220); near(r.interest,0); });
test('100 € com 3% de inflação em 10 anos valem ~74,41 €',()=>{ near(c.lrnReal(100,3,10),74.409,1e-2); });
test('mais-valia de 1000 € paga 280 € (28%)',()=>{ const r=c.lrnGainTax({buy:1000,sell:2000,fees:0}); near(r.gain,1000); near(r.tax,280); near(r.net,720); });
test('as comissões reduzem a base de imposto',()=>{ const r=c.lrnGainTax({buy:1000,sell:2000,fees:100}); near(r.gain,900); near(r.tax,252); });
test('perda não paga imposto',()=>{ const r=c.lrnGainTax({buy:2000,sell:1500,fees:0}); near(r.tax,0); near(r.net,-500); });
test('FGD cobre 100 000 € por instituição e não soma entre bancos',()=>{ const r=c.lrnCovered([150000,20000]); assert.equal(r[0].covered,100000); assert.equal(r[0].exposed,50000); assert.equal(r[1].covered,20000); assert.equal(r[1].exposed,0); });
test('sequência: dia seguinte soma, mesmo dia não altera',()=>{ const a=c.lrnStreak({count:0,last:null,rest:1},'2026-11-11'); assert.equal(a.count,1); assert.equal(c.lrnStreak(a,'2026-11-11'),a); assert.equal(c.lrnStreak(a,'2026-11-12').count,2); });
test('sequência: falhar 1 dia gasta o descanso; sem descanso recomeça',()=>{ assert.deepEqual(c.lrnStreak({count:3,last:'2026-11-11',rest:1},'2026-11-13'),{count:4,last:'2026-11-13',rest:0}); assert.equal(c.lrnStreak({count:3,last:'2026-11-11',rest:0},'2026-11-13').count,1); assert.equal(c.lrnStreak({count:9,last:'2026-11-01',rest:2},'2026-11-11').count,1); });
test('nível: 100 XP por nível',()=>{ assert.equal(c.lrnLevel(0),1); assert.equal(c.lrnLevel(250),3); });

const mods=[{id:'m'}];
const art=blocks=>[{id:'a',topic:'m',title:'t',lead:'l',blocks,src:[]}];
test('lint: pergunta como primeiro bloco falha',()=>{ const e=c.lrnLint(art([{t:'decide',id:'q',ensina:['x'],o:['a','b'],c:0,why:'w'}]),mods); assert.ok(e.some(x=>/antes de qualquer explicação/.test(x))); });
test('lint: pergunta tem de referir blocos anteriores',()=>{ const e=c.lrnLint(art([{t:'p',id:'p'},{t:'decide',id:'q',ensina:['zz'],o:['a','b'],c:0,why:'w'}]),mods); assert.ok(e.some(x=>/não está explicado antes/.test(x))); });
test('lint: artigo correto passa',()=>{ assert.deepEqual(c.lrnLint(art([{t:'p',id:'p'},{t:'decide',id:'q',ensina:['p'],o:['a','b'],c:1,why:'w'}]),mods),[]); });
test('lint: tema fiscal sem fonte falha',()=>{ const e=c.lrnLint([{id:'a',topic:'impostos',title:'t',lead:'l',blocks:[{t:'p',id:'p'}],src:[]}],[{id:'impostos'}]); assert.ok(e.some(x=>/sem fonte/.test(x))); });

test('calculadoras: 50/30/20, emergência, queda e recuperação',()=>{
  const o=(n,v)=>c.lrnCalcOut(n,v).map(x=>x[1]);
  assert.deepEqual(o('budget',{inc:1000}),[500,300,200]);
  assert.deepEqual(o('emergency',{exp:1000,mes:6}),[6000]);
  near(o('drawdown',{val:1000,q:50})[1],100); near(o('drawdown',{val:1000,q:50})[0],500);
  near(o('netint',{cap:1000,tax:2})[2],14.4);
  near(o('payout',{d:1,l:4,p:20})[0],25); near(o('retire',{ren:1000,ret:4})[0],300000);
});
test('calculadora de empréstimo: sem juros divide em partes iguais; com juros paga mais',()=>{
  near(c.lrnCalcOut('debt',{cap:1200,tax:0,ano:1})[0][1],100);
  const r=c.lrnCalcOut('debt',{cap:10000,tax:8,ano:5}); assert.ok(r[2][1]>0&&r[1][1]>10000); near(r[0][1],202.76,.02);
});
test('calculadora de custos: o TER reduz o valor final',()=>{ const r=c.lrnCalcOut('fees',{ini:0,men:100,rate:5,ter:1,ano:20}); assert.ok(r[2][1]>0&&r[0][1]>r[1][1]); });
test('lint: calculadora desconhecida e tabela torta falham',()=>{ const e=c.lrnLint(art([{t:'w',id:'w',w:'calc',c:'xx'},{t:'cmp',id:'c',head:['a','b'],rows:[['1']]}]),mods); assert.equal(e.length,2); });
