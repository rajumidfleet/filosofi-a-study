# Tidskarta – verifiering 2026-09-30

- `npm run check`: 13 tester, inklusive årsskiftet 1 f.Kr./1 e.Kr., livsspann, URL-validering, geografisk gruppering, data/källor och preview-serverns åtkomstgräns.
- Chrome: drag med mus flyttar reglaget genom flera mellanlägen; piltangent flyttar ett år; uppspelning flyttar årtalet; paus fungerar.
- Personval byter period vid behov. URL-parametrar överlever omladdning.
- Zoom 1→1,5, panorering (+100,+20 px) och återställning verifierade.
- Tangentbordsval av Platon behåller fokus på den ersatta personknappen.
- Responsiv kontroll vid 390×844: ingen horisontell dokumentoverflow; kontroller och karta ryms. Geografisk zoom klipper avsiktligt kartytan och kan panoreras. Viewport återställd efter kontroll.
- Inga fel/varningar i Chromes konsol under kontrollerna.
- Oberoende kod-/innehållsgranskning identifierade marköröverlappning och förlorat tangentbordsfokus; båda rättades före publicering.

Kartan beskriver representativa biografiska orter, inte personernas position vid varje årtal. Tomma perioder avser personurvalet. Tester bevisar inte historisk fullständighet; källor och avgränsningar redovisas separat.
