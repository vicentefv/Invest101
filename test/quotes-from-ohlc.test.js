const test=require('node:test'),assert=require('node:assert');
const {update}=require('../tools/quotes-from-ohlc.js');
const D=86400,t0=Date.UTC(2026,0,5)/1000-3*3600; // velas diárias abertas na véspera às 21h UTC
test('preço, variação e histórico a partir das velas',()=>{
  const doc={tf:{d1:{t:[t0,t0+D,t0+4*D],c:[100,110,99]}}};
  const r=update('X',doc,{name:'X',cls:'Ações',ord:1});
  assert.equal(r.out.price,99); assert.equal(r.out.chg,-10); assert.equal(r.out.name,'X');
  assert.deepEqual(r.hist.o,[0,1,4]); assert.equal(r.hist.base,'2026-01-05');
});
test('yields em pontos base',()=>{
  const r=update('Y',{tf:{d1:{t:[t0,t0+D],c:[4.10,4.25]}}},{kind:'yield',chg:1});
  assert.equal(r.out.chgBp,15); assert.equal(r.out.chg,undefined);
});
