// Gera src/globe-data.js a partir do Natural Earth 110m (pacote npm "world-atlas", domínio público).
// Fontes: https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json e countries-110m.json (guardadas em tools/globe-src).
// Uso: node tools/make-globe-data.js
const fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'globe-src');
const rd=f=>JSON.stringify(JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')));
const out='// Gerado por tools/make-globe-data.js (Natural Earth 110m, domínio público). Não editar à mão.\nconst GLOBE_LAND='+rd('land-110m.json')+';\nconst GLOBE_COUNTRIES='+rd('countries-110m.json')+';\n';
fs.writeFileSync(path.join(__dirname,'..','src','globe-data.js'),out);
console.log('src/globe-data.js',out.length,'bytes');
