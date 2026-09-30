# Filosofins historia: innehållsunderlag

Skapat 2026-09-30 som ett första fristående repetitionsmaterial på enkel svenska. `history.json` innehåller 12 ämnen, 25 korta övningsfrågor och egna undervisningsexempel. Sammanfattningarna är inte inlämningssvar och gör inga anspråk på att vara komplett kurslitteratur eller en provprognos.

## Underlag och kontroll

Källmapp: `lokalt arkiv: Filosofi-A-HT2026/01-filosofins-historia/`.

- `README.md` lästes för arkivets struktur och originaltextreferenser. Arkiverade tidsfrister, examinationsformer och andra tidsberoende uppgifter har inte förts in.
- Samtliga 13 föreläsnings-PDF:er extraherades med `pdftotext -layout` till `work/history-sources/`. Sidnummer avser PDF-visarens sidräkning från 1, inte bokens tryckta sidnummer.
- Centrala argument och ämnesavsnitt lästes mot de extraherade sidorna. Föreläsning 12 är i huvudsak bildbaserad; samtliga 19 sidor renderades och OCR-lästes med Tesseract. PDF-s. 3 kontrollerades också visuellt mot den renderade sidan. OCR-texten används inte som ordagranna citat.
- Den kompletta lokala Descartes-filen extraherades dessutom separat. Meditation I börjar på PDF-s. 6, II på 8, III på 12, IV på 19, V på 23 och VI på 25. Huvudtexten slutar på PDF-s. 32. Inledningsmaterialet på s. 1–5 är åtskilt från huvudtexten.
- JSON kontrollerades för 12 unika ASCII-id:n, obligatoriska innehållsfält, rätt kurs-id och efterfrågade antal faktapunkter, begrepp och frågor.

## Källor per ämne

| Ämne | Kontrollerad föreläsningskälla och PDF-sidor |
|---|---|
| Försokratiker | `1. Försokratikerna.pdf`, s. 3, 7–15 |
| Sokrates och Platon | `2.1 Sokrates och Platon.pdf`, s. 2–17; `Föreläsning 2, del 2 PLATON.pdf`, s. 2–5, 9–15 |
| Aristoteles | `Föreläsning 3 - ARISTOTELES.pdf`, s. 7–16, 19–30 |
| Antik etik | `Föreläsning 4 - Antikens etik.pdf`, s. 2–10, 12–25 |
| Descartes | `Föreläsning 5 - Rationalismen 1 - Descartes.pdf`, s. 4–17; originalet `H2665_Descartes' Meditations-1.pdf`, s. 6–32 |
| Spinoza och Leibniz | `Föreläsning 6 - Rationalismen del II.pdf`, s. 3–9, 11–12, 16–20 |
| Locke och Berkeley | `Föreläsning 7 EMPIRISMEN del I Locke & Berkeley.pdf`, s. 3–12, 15–21 |
| Hume | `Föreläsning 8 - Empirismen, del 2 - Hume.pdf`, s. 3–18, 20–24 |
| Kant, teoretisk filosofi | `Föreläsning 9 - Kants teoretiska fil.pdf`, s. 3–18 |
| Kant, etik | `Föreläsning 10 - KANTS MORALFILOSOFI.pdf`, s. 2–5, 8–19 |
| Bentham, Mill, Nietzsche | `Föreläsning 11. Bentham, Mill _ Nietzsche.pdf`, s. 3–15 |
| Wollstonecraft | `Föreläsning 12 Wollstonecraft & feministisk filosofihistoria -.pdf`, s. 2–12, 16–19 |

## Avgränsningar och redaktionella val

- Materialet bygger på användarens lokalt arkiverade kursfiler. Inga aktuella Canvas-krav eller tidsfrister har kontrollerats i detta delarbete.
- `reading` visar lokala originaltextreferenser som stöds av filinventariet, README eller föreläsningarna. Med undantag för Descartes är detta inte en genomläsning och sidkontroll av alla originaltext-PDF:er.
- Arkivets README anger att en svensk Hume-översättning av Treatise III.1.2 inte kunde sparas vid arkivering. Därför betyder läsreferensen inte att varje språkversion eller varje avsnitt finns komplett lokalt.
- Tematiska flöden är begreppsliga läsvägar, inte generella historiska orsakskedjor. Descartes-flödet sammanfattar verkets ordning och skiljer uttryckligen alla sex meditationer åt i faktatext och läsanvisning.
- Exempel med byggklossar, trästol, vattenkokare och utbildningsjämförelse är nyskrivna undervisningsanalogier. De tillskrivs inte historiska författare.
- Försokratisk filosofi är starkt förenklad. Framställningen undviker att presentera "allt flyter" som ett säkert ordagrant Herakleitos-citat eller antik atomism som modern fysik.
- Theaitetos presenteras som en undersökning som slutar i apori, inte som ett färdigt godkännande av en standarddefinition av kunskap.
- Leibniz faktasanningar anges som kontingenta. Föreläsningens formulering att de vore förnuftssanningar för Gud har inte återgivits eftersom den riskerar att sudda ut skillnaden mellan gudomlig kunskap och logisk nödvändighet.
- Mills relation till regelutilitarism klassificeras inte slutgiltigt. Nietzscheavsnittet begränsas till den kritik av utilitarismen som föreläsningen själv säger sig behandla.
- Kants etik beskrivs utan påståendet att glädje vid en handling automatiskt skulle undanröja dess moraliska värde. Föreläsningen diskuterar själv detta som en tolkningsfråga.
- Wollstonecraft används för hennes argument om utbildning och förnuft. Filosofihistoriska fördomar återges inte som fakta om kvinnors förmåga.
- Inga föreläsnings-PDF:er eller originaltexter har kopierats till någon publik leverans. De egna sammanfattningarna behöver inte distribuera källfilerna för att fungera.
