// Verifica o conteúdo de Aprender: node tools/lint-content.js
// Carrega learn-core.js e learn-data.js no mesmo contexto (como acontece no navegador) e corre lrnLint.
const fs=require('fs'),path=require('path'),vm=require('vm');
const dir=path.join(__dirname,'..','src');
const ctx=vm.createContext({console,Math,Number,Intl});
vm.runInContext(['learn-core.js','learn-data.js','learn-mod-fundamentos.js','learn-mod-mercados.js','learn-mod-produtos.js','learn-mod-risco.js','learn-mod-carteira.js','learn-mod-portugal.js','learn-mod-impostos.js','learn-mod-fundamental.js','learn-mod-tecnica.js','learn-mod-psicologia.js','learn-mod-planeamento.js','learn-mod-glossario.js','learn-data-z.js'].map(f=>fs.readFileSync(path.join(dir,f),'utf8')).join('\n')+'\nthis.__r={LRN,LRN_MODULES,lrnLint};',ctx);
const {LRN,LRN_MODULES,lrnLint}=ctx.__r;
const errs=lrnLint(LRN,LRN_MODULES);
errs.forEach(e=>console.error('ERRO',e));
console.log(`${LRN.length} artigos, ${LRN_MODULES.length} módulos, ${errs.length} erros`);
process.exit(errs.length?1:0);
