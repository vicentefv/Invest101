const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
// Extrai só as funções puras do loop de motion3.js (m3Wave) e valida a forma da onda.
const src=fs.readFileSync(path.join(__dirname,'..','src','motion3.js'),'utf8');
const ctx=vm.createContext({});
vm.runInContext('const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));\n'+src.match(/const M3_LOOP_MS=[^;]+;/)[0]+'\n'+src.match(/const m3Wave=[^\n]+;/)[0]+'\nthis.w=m3Wave;this.T=M3_LOOP_MS;',ctx);
const {w,T}=ctx;
test('a onda do loop fica sempre entre 0 e 1',()=>{ for(let t=0;t<T*2;t+=37){ const p=w(t); assert.ok(p>=0&&p<=1); } });
test('começa e acaba em 0 e chega a 1 a meio do ciclo',()=>{ assert.equal(w(0),0); assert.ok(Math.abs(w(T/2)-1)<1e-9); assert.ok(w(T-1)<.01); });
test('tem pausa nas pontas (parado perto de 0 e de 1)',()=>{ assert.equal(w(T*.04),0); assert.ok(w(T*.46)>.99); });
test('é suave: o salto entre 2 instantes próximos é pequeno',()=>{ let prev=w(0),max=0; for(let t=10;t<T;t+=10){ const p=w(t); max=Math.max(max,Math.abs(p-prev)); prev=p; } assert.ok(max<.03); });
