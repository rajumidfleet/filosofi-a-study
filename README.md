# Filosofi A – Studieatlas och samlad studieguide

Två kurser, samma studieplats: **Filosofins historia** och **Kritiskt tänkande**.

## Öppna guiden

[Öppna guiden på GitHub Pages](https://rajumidfleet.github.io/filosofi-a-study/guide.html) · [Gå direkt till tidskartan](https://rajumidfleet.github.io/filosofi-a-study/guide.html#time-map)

`guide.html` är en självständig HTML-fil med samma lugna upplägg som biologiguiden:

- Tidskarta med dragreglage, uppspelning, geografisk zoom/panorering, 24 filosofer, åtta perioder och jämförbara livsspann.
- 20 områden: 12 i historia och 8 i kritiskt tänkande.
- Sökbart begreppsindex A–Ö med 113 förklaringar, kursfilter och delbara söklänkar. Sök exempelvis ”vad är ett axiom?”.
- 45 egna övningsfrågor, en i taget, med dolt svarsstöd.
- Kurs-/ämnesfilter, självskattning och repetition av frågor som inte sitter.
- Sökning över ämnen, filosofer och begrepp.
- Interaktiv sanningsvärdestabell och 31 länkar till Lunds tentahäften.
- Lokal sparning utan konto; den äldre appens sparade markeringar påverkas inte.

```sh
npm run check
npm run preview
```

Öppna `http://127.0.0.1:61614/guide.html`. Node 22 eller senare, inga externa npm-beroenden. Servern lyssnar bara på loopback och serverar en uttrycklig lista med appfiler.

`guide.html` fungerar även utan server och internet. Canvas-, tentakällor och länkar till atlasets övriga filer behöver internet respektive dessa filer bredvid guiden. Webbläsaren bestämmer hur lokal lagring fungerar vid `file://`; använd samma localhost-adress för stabil lokal sparning.

## Befintliga vyer

- `index.html`, `app.js`, `styles.css`: det ursprungliga historieatlaset med filosofporträtt och snabbtest.
- `critical.html`, `critical.js`, `critical.css`: tidigare övningar i argumentstruktur. Dess senare moduler är fortfarande platshållare; hela kursöversikten finns i den samlade guiden.
- Nya länkar från båda vyerna leder till `guide.html`.

## Redigera och bygga

- `data/guide-topics.json`: pedagogiska sammanfattningar, frågor och källsidor.
- `data/extra-concepts.json`: kompletterande begrepp med egna källor (utöver kursavsnittens termer).
- `data/time-map.json`: källbelagda personer, perioder och idésamband.
- `data/map-land.json`: förenklade kustkonturer från Natural Earth (public domain).
- `data/exams.json`: metadata/länkar från tentainventeringen 29 september 2026.
- `guide/`: HTML-skal, stilar, rendering och testbara hjälpmetoder.
- `scripts/build-guide.mjs`: validerar innehåll och bygger en fristående `guide.html`.
- `tests/guide.test.mjs`: innehåll, sökning, lagringsvalidering, kursfilter, logik och byggd fil.
- `docs/`: källproveniens, säkerhetsgränser och verifiering.

Kör `npm run check` efter ändringar och versionshantera också den ombyggda `guide.html`. CI kontrollerar att källor och genererad fil stämmer överens.

## Källor och avgränsning

Underlaget är det lokala Umeå-arkivet från 31 augusti 2026. Föreläsningarnas innehåll har lästs för sammanfattningarna; detta är inte en fullständig återgivning av kursböckerna. Källfil och PDF-sidor anges per område. Originaltexter och senare Canvas-ändringar är inte heltäckande kontrollerade. Inga aktuella deadlines visas.

Alla förklaringar, exempel och övningsfrågor i den nya guiden är studiestöd, inte officiella facit. Sanningsvärdestabellerna är kompletterande grundträning. Tentorna är från Lund och är inte Umeås examinationskrav. Kurs-PDF:er och personliga studentsvar ingår inte i repot.

## GitHub Pages

Befintlig Pages-konfiguration serverar `main` från roten. Efter att en ändring har granskats och mergeats finns guiden på `https://rajumidfleet.github.io/filosofi-a-study/guide.html`. En feature-branch publiceras inte automatiskt på den sidan.
