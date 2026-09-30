# Verifiering 30 september 2026

## Utfört lokalt

- `npm run check`: JS-syntax, innehållsvalidering, byggd fristående HTML och 8 tester godkända.
- Core-modulens tester: 100 % rader/funktioner och 97,44 % grenar. Detta gäller hjälpmetoderna, inte hela DOM-renderingen.
- Gitleaks filskanning: inga hemligheter hittade.
- npm audit: inga sårbarheter; appen saknar externa npm-beroenden.
- Trivy filskanning: inga rapporterade fynd; inga tillämpliga paket-/konfigurationsmål identifierades i första skanningen.
- HTTP-integrationstest: otillåtna filer/metoder nekas; felaktiga URL:er ger 400 utan att stoppa servern.
- Faktisk Chrome-verifiering: startvy, båda kursdelar, global sökning, begreppsfilter, övning en fråga i taget, kurs- och ämnesfilter, svarsstöd, självskattning som överlever omladdning, repetitionsfilter och sanningsvärdestabell.
- Tangentbord: skip-länk flyttar fokus utan att byta aktuell sida. Sökfältets markörläge bevaras vid omrendering.
- Mobil 390 × 844: menyn kan öppnas, ämne kan väljas och menyn stängs; ingen horisontell sidöverströmning på start- eller ämnesvy. Normal viewport återställd.
- Inga console errors observerade under dessa UI-flöden.
- Testmarkeringar återställda genom guidens vanliga knappar.

## Avgränsning

Ingen automatisk helwebbsläsartäckning, fullständig WCAG-granskning eller full faktagranskning av hela kurslitteraturen. Arkiverade föreläsningar kontrollerade; aktuella Canvas-instruktioner och externa tentakällors tillgänglighet har inte nyverifierats. Gamla appens quiz/progress är bevarade, inte ombyggda eller fullständigt regressionstestade.

Den nya guiden är en lokal förhandsvisning och ett branch-förslag tills PR är mergead. Befintliga GitHub Pages från main ändras inte av detta arbete.
