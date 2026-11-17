# Invest101

Aprende a investir a partir do zero, com tudo pensado para Portugal.

**Site:** https://vicentefv.github.io/Invest101/

Mais de 100 aulas gratuitas, das contas a prazo e certificados de aforro aos ETFs, ações e IRS, com exemplos em euros e fontes oficiais. Inclui um painel de mercados atualizado todos os dias. Sem publicidade e sem nada para vender.

> **Conteúdo educativo, não é aconselhamento financeiro.** As regras fiscais e legais indicam a fonte oficial e a data em que foram verificadas; o que ainda não foi confirmado aparece com o selo «Por confirmar». Confirma sempre antes de decidir.

## O que tem

- **Aprender:** 12 módulos, de fundamentos e produtos a impostos, análise de empresas, psicologia e planeamento da reforma. Cada aula explica primeiro e só depois faz perguntas.
- **Mercados:** cotações, gráficos, calendário e análise de ações, obrigações, câmbios, matérias-primas e cripto.
- **Ferramentas:** calculadoras (juros compostos, crédito, custos, reforma) e um diário de investimentos guardado no teu browser.

## Como funciona

Todos os dias, uma GitHub Action vai buscar as cotações ao Yahoo Finance, guarda-as em `data/` e publica o site no GitHub Pages.

Para o correres no teu computador (precisas do Node.js):

```
node build.js data
```

Depois abre `dist/test.html` no browser.
