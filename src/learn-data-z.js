// Ordem final: por módulo, depois pelo campo `o`.
LRN.forEach(a=>{ if(a.o==null) a.o=50; });
LRN.sort((a,b)=>(LRN_MODULES.findIndex(m=>m.id===a.topic)-LRN_MODULES.findIndex(m=>m.id===b.topic))||(a.o-b.o));
