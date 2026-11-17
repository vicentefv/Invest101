# Invest101 (antes Radar Macro)

Site em PT-PT para o utilizador e o pai aprenderem a investir (biblioteca **Aprender**) e acompanharem mercados (painel, gráficos, calendário, análise, radar, ferramentas, diário, metodologia).

- **Antes de qualquer trabalho: ler `docs/` (vault Obsidian)**: Contexto, Decisões, Estado, Próximos passos, Fontes e verificações. No fim, atualizar `Estado` e `Próximos passos`.
- Stack: JS puro, sem framework. `node build.js [pasta-de-dados]` junta `src/` em `dist/index.html` (publicado como Artifact) e, com pasta de dados (`data`), gera `dist/test.html` com mock da db para testar no browser.
- Testes: `node --test test/learn-core.test.js test/globe-core.test.js test/motion3.test.js` (não usar `node --test test/`). Conteúdo: `node tools/lint-content.js`. Globo: `node tools/make-globe-data.js` regenera `src/globe-data.js`.
- Aprender = `src/learn-core.js` (cálculos e calculadoras), `src/learn-data.js` + `learn-data-a..d.js` (conteúdo; a ordem final está no fim de `-d`), `src/learn.js` (vista/gráficos/widgets), `src/learn.css`.
- **Regra do projeto: tudo tem de ser possível em Portugal/UE.** Se um ativo só existe fora, dizê-lo e listar as versões que se compram em PT (ficha "Em Portugal"). Regras fiscais/legais só com fonte oficial e "verificado em <data>"; o que só tem fonte secundária leva o selo "Por confirmar". Nunca escrever regras de memória.
- Identidade visual "Fósforo" (tokens em `src/style.css`). Vistas novas reutilizam tokens, `.panel`, `.seg`, `.chip`, `.pill`, `.out`, `.fld`.
