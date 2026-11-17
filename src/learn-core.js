// ================= Aprender: cálculos puros (testados com `node --test`) =================
// Sem DOM. No navegador ficam como funções globais; em Node são exportadas no fim do ficheiro.

// Juros compostos com entradas mensais. A taxa anual é convertida na taxa mensal equivalente.
function lrnCompound({initial,monthly,rate,years}){
  const r=Math.pow(1+rate/100,1/12)-1; let value=initial,paid=initial; const out=[{x:0,paid,interest:0,total:value}];
  for(let m=1;m<=years*12;m++){ value=value*(1+r)+monthly; paid+=monthly; if(m%12===0) out.push({x:m/12,paid,interest:value-paid,total:value}); }
  return out; }

// Poder de compra de `amount` daqui a `years` anos, com inflação anual constante.
const lrnReal=(amount,infl,years)=>amount/Math.pow(1+infl/100,years);

// Mais-valias de ações/ETF em Portugal: taxa autónoma de 28% sobre o saldo anual positivo (art. 72.º CIRS).
// Perdas não geram imposto. O englobamento é uma opção do contribuinte e não é calculado aqui.
const LRN_TAX_RATE=0.28;
function lrnGainTax({buy,sell,fees}){ const gain=sell-buy-fees, tax=gain>0?gain*LRN_TAX_RATE:0; return {gain,tax,net:gain-tax}; }

// Fundo de Garantia de Depósitos: até 100 000 € por depositante e por instituição.
const LRN_FGD=100000;
const lrnCovered=banks=>banks.map(v=>({deposit:v,covered:Math.min(Math.max(v,0),LRN_FGD),exposed:Math.max(v-LRN_FGD,0)}));

// Sequência diária: um "dia de descanso" perdoa uma falha. Ganha-se mais um a cada 7 dias seguidos (máx. 2).
const lrnDays=(a,b)=>Math.round((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/864e5);
function lrnStreak(s,today){
  if(s.last===today) return s;
  const gap=s.last?lrnDays(s.last,today):null; let {count,rest}=s;
  if(gap===1) count+=1; else if(gap===2&&rest>0){ count+=1; rest-=1; } else count=1;
  if(count%7===0) rest=Math.min(2,rest+1);
  return {count,last:today,rest}; }

const lrnLevel=xp=>Math.floor(xp/100)+1;

// Calculadoras dos temas (widget "calc"). Cada uma: campos {id,l,v,u} e saída [[rótulo, valor, formato]] (formatos: eur, pct, num).
const _m=(x,d)=>{ const k=Math.pow(10,d||0); return Math.round(x*k)/k; };
const LRN_CALCS={
  budget:{f:[{id:'inc',l:'Rendimento líquido por mês',v:1500,u:'€'}],
    o:v=>[['Necessidades (50%)',v.inc*.5,'eur'],['Desejos (30%)',v.inc*.3,'eur'],['Poupar e pagar dívidas (20%)',v.inc*.2,'eur']]},
  emergency:{f:[{id:'exp',l:'Despesas essenciais por mês',v:1200,u:'€'},{id:'mes',l:'Meses de reserva',v:6,u:'meses'}],
    o:v=>[['Fundo de emergência',v.exp*v.mes,'eur']]},
  debt:{f:[{id:'cap',l:'Valor pedido',v:10000,u:'€'},{id:'tax',l:'Taxa anual nominal',v:8,u:'%'},{id:'ano',l:'Prazo',v:5,u:'anos'}],
    o:v=>{ const n=v.ano*12,r=v.tax/1200,pmt=n<=0?0:(r?v.cap*r/(1-Math.pow(1+r,-n)):v.cap/n); return [['Prestação mensal',pmt,'eur'],['Total pago ao banco',pmt*n,'eur'],['Só em juros',pmt*n-v.cap,'eur']]; }},
  drawdown:{f:[{id:'val',l:'Valor da carteira',v:10000,u:'€'},{id:'q',l:'Queda',v:40,u:'%'}],
    o:v=>{ const q=Math.min(Math.max(v.q,0),99.9); return [['Valor depois da queda',v.val*(1-q/100),'eur'],['Subida necessária para recuperar',q/(100-q)*100,'pct']]; }},
  fees:{f:[{id:'ini',l:'Valor inicial',v:10000,u:'€'},{id:'men',l:'Por mês',v:200,u:'€'},{id:'rate',l:'Retorno anual antes de custos',v:6,u:'%'},{id:'ter',l:'Custo anual (TER)',v:1.5,u:'%'},{id:'ano',l:'Anos',v:30,u:'anos'}],
    o:v=>{ const a=lrnCompound({initial:v.ini,monthly:v.men,rate:v.rate,years:v.ano}).at(-1).total,b=lrnCompound({initial:v.ini,monthly:v.men,rate:v.rate-v.ter,years:v.ano}).at(-1).total; return [['Sem custos',a,'eur'],['Com custos',b,'eur'],['Perdido em custos',a-b,'eur']]; }},
  per:{f:[{id:'p',l:'Preço da ação',v:50,u:'€'},{id:'l',l:'Lucro por ação (último ano)',v:4,u:'€'}],
    o:v=>[['PER (anos de lucro que pagas)',v.l>0?v.p/v.l:NaN,'num'],['Lucro por cada € investido',v.p>0?v.l/v.p*100:NaN,'pct']]},
  payout:{f:[{id:'d',l:'Dividendo por ação',v:1.2,u:'€'},{id:'l',l:'Lucro por ação',v:3,u:'€'},{id:'p',l:'Preço da ação',v:30,u:'€'}],
    o:v=>[['Payout (parte do lucro distribuída)',v.l>0?v.d/v.l*100:NaN,'pct'],['Rendimento do dividendo',v.p>0?v.d/v.p*100:NaN,'pct']]},
  netint:{f:[{id:'cap',l:'Depósito',v:10000,u:'€'},{id:'tax',l:'Taxa anual bruta',v:2.5,u:'%'}],
    o:v=>{ const g=v.cap*v.tax/100; return [['Juro bruto num ano',g,'eur'],['Retenção na fonte (28%)',g*.28,'eur'],['Juro líquido',g*.72,'eur']]; }},
  retire:{f:[{id:'ren',l:'Rendimento mensal pretendido',v:1000,u:'€'},{id:'ret',l:'Retirada anual do capital',v:4,u:'%'}],
    o:v=>[['Capital necessário',v.ret>0?v.ren*12/(v.ret/100):NaN,'eur']]}
};
const lrnCalcOut=(name,vals)=>LRN_CALCS[name].o(vals);

// Verifica o conteúdo: nunca se pergunta o que não foi ensinado, ids únicos, fontes em temas fiscais/legais.
const LRN_QTYPES=['decide','fazve','erro'], LRN_NEEDS_SRC=['impostos','portugal'];
function lrnLint(articles,modules){
  const err=[], mods=new Set(modules.map(m=>m.id)), seen=new Set();
  articles.forEach(a=>{
    const w=`[${a.id}]`;
    if(seen.has(a.id)) err.push(w+' id de artigo repetido'); seen.add(a.id);
    if(!mods.has(a.topic)) err.push(w+' módulo desconhecido: '+a.topic);
    if(!a.title||!a.lead) err.push(w+' falta título ou introdução');
    if(LRN_NEEDS_SRC.includes(a.topic)&&!(a.src&&a.src.length)) err.push(w+' tema fiscal/legal sem fonte');
    const ids=new Map();
    a.blocks.forEach((b,i)=>{
      if(!b.id) err.push(`${w} bloco ${i} sem id`); else if(ids.has(b.id)) err.push(`${w} id de bloco repetido: ${b.id}`); else ids.set(b.id,i);
      if(b.t==='scene'&&(!b.s||!b.alt)) err.push(`${w} cena ${b.id} sem forma ou sem descrição (alt)`);
      if(b.t==='w'&&b.w==='calc'&&!LRN_CALCS[b.c]) err.push(`${w} calculadora desconhecida: ${b.c}`);
      if(b.t==='cmp'&&!(b.head&&b.rows&&b.rows.length&&b.rows.every(r=>r.length===b.head.length))) err.push(`${w} tabela ${b.id} com colunas desiguais`);
      if(b.t==='stat'&&(!isFinite(b.v)||!b.label)) err.push(`${w} destaque ${b.id} incompleto`);
      if(LRN_QTYPES.includes(b.t)){
        if(i===0||!a.blocks.slice(0,i).some(x=>!LRN_QTYPES.includes(x.t)&&x.t!=='note')) err.push(`${w} pergunta ${b.id} aparece antes de qualquer explicação`);
        if(!b.ensina||!b.ensina.length) err.push(`${w} pergunta ${b.id} sem "ensina"`);
        else b.ensina.forEach(r=>{ const j=ids.get(r); if(j===undefined||j>=i) err.push(`${w} pergunta ${b.id} refere "${r}", que não está explicado antes dela`); });
        if(b.t==='fazve'?!(isFinite(b.answer)&&b.why):!(b.o&&b.o.length>1&&b.c>=0&&b.c<b.o.length&&b.why)) err.push(`${w} pergunta ${b.id} incompleta`);
      }
    });
  });
  return err;
}

if(typeof module!=='undefined') module.exports={LRN_CALCS,lrnCalcOut,lrnCompound,lrnReal,lrnGainTax,lrnCovered,lrnStreak,lrnLevel,lrnLint,LRN_TAX_RATE,LRN_FGD};
