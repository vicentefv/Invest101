// ================= Globo: de onde são os ativos (dados puros, testados com `node --test`) =================
// Cada ativo aparece no seu MERCADO DE REFERÊNCIA (onde cota ou é entregue), não na origem física:
// o ouro não "vem" de Nova Iorque, mas o contrato de referência cota no COMEX. Cripto não tem país.
const GLOBE_PLACES=[
  {id:'ny',name:'Nova Iorque',lon:-74.01,lat:40.71,assets:['SPX','NDX','DJI','GOLD','SILVER','COPPER','DXY'],note:'Bolsas de ações dos EUA, o mercado COMEX de metais e o índice do dólar.'},
  {id:'wdc',name:'Washington',lon:-77.04,lat:38.9,assets:['US2Y','US10Y'],note:'Dívida pública dos Estados Unidos (Tesouro).'},
  {id:'cush',name:'Cushing, Oklahoma',lon:-96.77,lat:35.98,assets:['WTI'],note:'Ponto de entrega do petróleo WTI.'},
  {id:'hh',name:'Henry Hub, Louisiana',lon:-92.04,lat:29.96,assets:['NATGAS'],note:'Ponto de entrega do gás natural dos EUA.'},
  {id:'tor',name:'Toronto',lon:-79.38,lat:43.65,assets:['USDCAD'],note:'O dólar canadiano, contra o dólar dos EUA.'},
  {id:'fra',name:'Frankfurt',lon:8.68,lat:50.11,assets:['DAX','BUND','EURUSD'],note:'Bolsa de Frankfurt, dívida pública alemã (Bund) e o euro (sede do BCE).'},
  {id:'par',name:'Zona Euro (Paris)',lon:2.35,lat:48.86,assets:['ESTX50'],note:'Índice das 50 maiores empresas da Zona Euro. Não tem um único local: marcado em Paris.'},
  {id:'lis',name:'Lisboa',lon:-9.14,lat:38.72,assets:['PSI'],note:'Euronext Lisboa, a bolsa portuguesa.'},
  {id:'lon',name:'Londres',lon:-0.13,lat:51.51,assets:['GBPUSD'],note:'A libra esterlina, contra o dólar dos EUA.'},
  {id:'ns',name:'Mar do Norte',lon:2.5,lat:57.5,assets:['BRENT'],note:'Referência do petróleo do Mar do Norte (Brent).'},
  {id:'tok',name:'Tóquio',lon:139.69,lat:35.68,assets:['NIKKEI','USDJPY'],note:'Bolsa de Tóquio e o iene japonês, contra o dólar dos EUA.'}
];
// pares de moedas: arcos entre a zona da moeda e os EUA
const GLOBE_ARCS=[['fra','ny'],['lon','ny'],['tok','ny'],['tor','ny']];
// ativos sem país: orbitam o globo
const GLOBE_SATS=[{id:'BTC'},{id:'ETH'},{id:'SOL'}];
// segunda camada: onde estão domiciliados os ETFs (liga à regra "só o que se compra em Portugal")
const GLOBE_ETF=[
  {id:'ie',name:'Dublin, Irlanda',lon:-6.26,lat:53.35,note:'Domicílio dos ETFs UCITS do S&P 500 que se compram em Portugal.',rows:[{name:'iShares Core S&P 500 UCITS ETF (Acc)',isin:'IE00B5BMR087',ok:true},{name:'Vanguard S&P 500 UCITS ETF (Acc)',isin:'IE00BFMXXD54',ok:true}]},
  {id:'us',name:'Estados Unidos',lon:-98.6,lat:39.8,note:'ETFs americanos: não têm o documento europeu (KID) e não se compram em Portugal.',rows:[{name:'VOO',ok:false},{name:'SPY',ok:false}]}
];
const GLOBE_CONT=[['África',20,3],['América do Norte',-102,46],['América do Sul',-60,-14],['Europa',16,53],['Ásia',92,46],['Oceânia',134,-25],['Antártida',20,-80]];
const GLOBE_VIEWS={americas:[-80,10],eurafrica:[15,18],asiaoceania:[115,5]};

// símbolo curto de cada ativo (o que aparece na ficha que sai do local)
const GLOBE_SHORT={SPX:'S&P 500',NDX:'Nasdaq',DJI:'Dow Jones',DAX:'DAX',ESTX50:'Stoxx 50',PSI:'PSI',NIKKEI:'Nikkei',US2Y:'EUA 2A',US10Y:'EUA 10A',BUND:'Bund',EURUSD:'EUR/USD',GBPUSD:'GBP/USD',USDJPY:'USD/JPY',USDCAD:'USD/CAD',DXY:'Dólar',BRENT:'Brent',WTI:'WTI',NATGAS:'Gás',GOLD:'Ouro',SILVER:'Prata',COPPER:'Cobre',BTC:'Bitcoin',ETH:'Ethereum',SOL:'Solana'};

// Leque: desloca n fichas num arco em torno da direção dir (radianos, para fora do globo), com dois raios alternados.
function globeFan(dir,n,r0,r1){
  r0=r0||52; r1=r1||78; const step=Math.min(38,150/Math.max(n,1))*Math.PI/180, out=[];
  for(let i=0;i<n;i++){ const a=dir+(i-(n-1)/2)*step, r=n>1?r0+(i%2)*(r1-r0):r0; out.push({dx:Math.cos(a)*r,dy:Math.sin(a)*r}); }
  return out;
}
// Relaxação: separa retângulos {x,y,w,h,tx,ty,fixed} (centro x,y) para não se sobreporem, puxando-os de volta ao alvo (tx,ty)
// e mantendo-os dentro da caixa {w,h}. Determinística; devolve o mesmo array com x,y finais.
function globeRelax(it,box,iters,pad){
  iters=iters||24; pad=pad==null?4:pad;
  it.forEach(a=>{ a.x=a.tx; a.y=a.ty; });
  for(let k=0;k<iters;k++){
    for(let i=0;i<it.length;i++) for(let j=i+1;j<it.length;j++){
      const a=it[i],b=it[j],ox=(a.w+b.w)/2+pad-Math.abs(a.x-b.x),oy=(a.h+b.h)/2+pad-Math.abs(a.y-b.y);
      if(ox>0&&oy>0){ const ax=ox<oy,s=ax?(a.x<=b.x?-1:1):(a.y<=b.y?-1:1),m=(ax?ox:oy)/2,wa=a.fixed?0:(b.fixed?1:.5),wb=b.fixed?0:(a.fixed?1:.5);
        if(ax){ a.x+=s*m*2*wa; b.x-=s*m*2*wb; } else { a.y+=s*m*2*wa; b.y-=s*m*2*wb; } } }
    it.forEach(a=>{ if(a.fixed) return; if(k<iters/2){ a.x+=(a.tx-a.x)*.06; a.y+=(a.ty-a.y)*.06; } a.x=Math.max(a.w/2+2,Math.min(box.w-a.w/2-2,a.x)); a.y=Math.max(a.h/2+2,Math.min(box.h-a.h/2-2,a.y)); });
  }
  return it;
}

const globeCovered=()=>GLOBE_PLACES.flatMap(p=>p.assets).concat(GLOBE_SATS.map(s=>s.id));
// Devolve problemas: ativos em falta ou repetidos, coordenadas inválidas, arcos que apontam para sítios que não existem.
function globeCheck(ids){
  const err=[],cov=globeCovered(),seen=new Set();
  cov.forEach(i=>{ if(seen.has(i)) err.push('ativo repetido: '+i); seen.add(i); });
  ids.forEach(i=>{ if(!seen.has(i)) err.push('ativo sem localização: '+i); });
  cov.forEach(i=>{ if(!ids.includes(i)) err.push('localização para ativo que não existe: '+i); });
  const pid=new Set(GLOBE_PLACES.map(p=>p.id));
  GLOBE_PLACES.concat(GLOBE_ETF).forEach(p=>{ if(!(p.lat>=-90&&p.lat<=90&&p.lon>=-180&&p.lon<=180)) err.push('coordenadas inválidas: '+p.id); });
  GLOBE_ARCS.forEach(([a,b])=>{ if(!pid.has(a)||!pid.has(b)) err.push('arco inválido: '+a+'-'+b); });
  return err;
}
if(typeof module!=='undefined') module.exports={GLOBE_SHORT,globeFan,globeRelax,GLOBE_PLACES,GLOBE_ARCS,GLOBE_SATS,GLOBE_ETF,GLOBE_CONT,GLOBE_VIEWS,globeCovered,globeCheck};
