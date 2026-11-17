# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
JS puro, sem framework. `build.js` junta `src/` num único `dist/index.html` (publicado como Artifact do Claude, com `window.claude` para db/user). Decisão herdada do projeto Radar Macro; o utilizador não pediu outra stack.

## Users
O utilizador e o pai, adultos portugueses que querem aprender tudo sobre investimentos para começar a investir dinheiro real. Aprendem de forma visual e interativa. O pai preocupa-se sobretudo com o que é realmente possível em Portugal e com a burocracia. Usam desktop e telemóvel.

## Product Purpose
Ensinar a investir do zero com toda a informação disponível numa biblioteca aberta (sem percurso obrigatório), com gráficos mexíveis e simuladores sem dinheiro real, e acompanhar mercados (painel, gráficos, calendário económico, análise, radar, diário). Sucesso: perceberem cada tema, saberem exatamente o que podem fazer em Portugal e continuarem a voltar até ao fim sem perderem o interesse.

## Positioning
Um site de literacia financeira que só diz o que é possível em Portugal (ETFs UCITS em vez de VOO/SPY, impostos e burocracia portugueses) e que mostra a fonte oficial e a data de verificação de cada regra.

## Operating Context
Conteúdo em português de Portugal. Regras fiscais e legais só com fonte oficial (Portal das Finanças, CMVM, Banco de Portugal, IGCP, ESMA, emissores) e "verificado em <data>"; fonte secundária leva o selo "Por confirmar". Contexto do projeto em `docs/` (vault Obsidian). Dados de mercado: velas do Yahoo Finance e calendário da Investing.com já descarregados por `tools/`.

## Capabilities and Constraints
- Vista Aprender (biblioteca aberta, widgets com gráficos, perguntas de aplicação, ficha "Em Portugal"), Painel, Gráficos, Calendário, Análise, Radar, Ferramentas, Diário, Metodologia.
- Tudo tem de ser possível em Portugal/UE; se um ativo só existe fora, dizê-lo e listar as versões compráveis em PT.
- Perguntas de aprendizagem só depois de a matéria ser explicada e sempre com sentido prático (cenários reais PT).
- Conteúdo amplo ("todas as informações sobre investir"), entregue por módulos verificados; o que ainda não existe aparece como "a caminho".
- Gamificação (XP, sequência, "lido") é opcional e nunca obrigatória.
- Não é aconselhamento financeiro nem fiscal. Limite do Artifact: 16 MB.
- Por decidir: nome do módulo de mercados (mantido "Radar Macro" por agora); link do Artifact existente para republicar.

## Brand Commitments
Nome: **Invest101** (antes Radar Macro, da Maré Analytics). Tom: claro, direto, sem jargão sem explicação. Direção visual pedida pelo utilizador: vivo, com animações e motion graphics, menos genérico (decisão visual registada no DESIGN.md, não aqui).

## Evidence on Hand
Seis artigos de Aprender com fontes (Portal das Finanças art. 72.º CIRS; Banco de Portugal/FGD; justETF), `docs/Fontes e verificações.md`, séries OHLC em `data/ohlc`. Não há testemunhos, clientes ou métricas de uso, e não devem ser inventados.

## Product Principles
1. Verdade antes de volume: nada entra sem fonte; o que falta diz-se que falta.
2. Aprender fazendo: explicar, mostrar, depois aplicar (nunca testar o que não foi ensinado).
3. Portugal primeiro: cada tema responde ao que se pode fazer cá e como.
4. Tudo aberto: a pessoa escolhe a ordem; a motivação convida, não prende.

## Accessibility & Inclusion
Legível para um utilizador mais velho: contraste forte, tamanhos de texto generosos, alvos táteis grandes, `prefers-reduced-motion` respeitado, português simples. (Inferido do contexto; por confirmar com o utilizador.)
