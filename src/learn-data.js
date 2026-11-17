// ================= Aprender: conteúdo =================
// Regras do projeto: tudo tem de ser possível em Portugal. Só entram factos verificados em fonte (campo `src`).
// O que só tem fonte secundária leva `pending:true` e aparece com o selo "Por confirmar".
// Perguntas (decide / fazve / erro) vêm SEMPRE depois de a matéria ser explicada e levam `ensina:[ids]` dos blocos
// que as justificam (lrnLint, em learn-core.js, verifica isto).
const LRN_VERIFIED='2026-11-11';
const _e=n=>Number(n).toLocaleString('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:0});

// Mapa completo: cada módulo tem cor, forma e os temas que já existem (artigos) e os que estão a caminho.
const LRN_MODULES=[
 {id:'fundamentos',name:'Fundamentos do dinheiro',color:'yellow',glyph:'sun',soon:[]},
 {id:'mercados',name:'Como funcionam os mercados',color:'blue',glyph:'arcs',soon:[]},
 {id:'produtos',name:'Produtos de investimento',color:'red',glyph:'bars',soon:[]},
 {id:'risco',name:'Risco e retorno',color:'ink',glyph:'wave',soon:[]},
 {id:'carteira',name:'Construir a carteira',color:'blue',glyph:'donut',soon:['Simulador: Máquina do Tempo','Simulador: Replay de mercado']},
 {id:'portugal',name:'Portugal na prática',color:'green',glyph:'tile',soon:[]},
 {id:'impostos',name:'Impostos em Portugal',color:'red',glyph:'stack',soon:[]},
 {id:'fundamental',name:'Análise fundamental',color:'yellow',glyph:'pie',soon:[]},
 {id:'tecnica',name:'Análise técnica',color:'blue',glyph:'candles',soon:[]},
 {id:'psicologia',name:'Psicologia e erros comuns',color:'red',glyph:'eye',soon:[]},
 {id:'planeamento',name:'Planeamento para a vida',color:'green',glyph:'path',soon:[]},
 {id:'glossario',name:'Glossário',color:'ink',glyph:'letters',soon:[]}
];

// Ficha "Em Portugal": se o original não se compra cá, diz-se e listam-se as versões que se compram.
const LRN_PT={
  sp500:{ name:'S&P 500 (as 500 maiores empresas dos EUA)',
    note:'Os ETFs americanos mais conhecidos (VOO, SPY, VTI) não se podem comprar a partir de Portugal: não têm o documento europeu (KID) exigido pela regra PRIIPs. Quem já os tem pode vendê-los, mas não comprar mais.',
    list:[
      {name:'iShares Core S&P 500 UCITS ETF (Acc)',isin:'IE00B5BMR087',dom:'Irlanda',kind:'Acumulação',ter:'0,07%',src:'https://www.justetf.com/en/etf-profile.html?isin=IE00B5BMR087'},
      {name:'Vanguard S&P 500 UCITS ETF (Acc)',isin:'IE00BFMXXD54',dom:'Irlanda',kind:'Acumulação',ter:'0,07%',src:'https://www.justetf.com/en/etf-profile.html?isin=IE00BFMXXD54'}],
    foot:'Confirma sempre se a tua corretora oferece o ETF concreto: nem todas têm todos.' }
};

// Contas dos exemplos (calculadas aqui para a explicação nunca divergir do número certo).
const _ex={
  realDep:10000*Math.pow(1.02/1.03,10),
  amigoA:(()=>{ const d=lrnCompound({initial:0,monthly:100,rate:5,years:10}).at(-1); return {pago:d.paid,total:d.total*Math.pow(1.05,10)}; })(),
  amigoB:(()=>{ const d=lrnCompound({initial:0,monthly:100,rate:5,years:10}).at(-1); return {pago:d.paid,total:d.total}; })(),
  imposto:(9500-8000-20)*0.28
};

const LRN=[];


// Helpers partilhados pelos ficheiros learn-mod-*.js
const _c=(n,v)=>lrnCalcOut(n,v).map(x=>x[1]);
const _AT_GUIA={l:'Portal das Finanças: Tributação de produtos financeiros em sede de IRS',u:'https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/Guias/Documents/Guia_Fiscal_produtos_financeiros.pdf'};
const _AT_72={l:'Portal das Finanças: artigo 72.º do Código do IRS',u:'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs72.aspx'};
const _AT_71={l:'Portal das Finanças: artigo 71.º do Código do IRS',u:'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs71.aspx'};
const _CMVM={l:'CMVM: Portal do Investidor',u:'https://investidor.cmvm.pt/PInvestidor/'};
