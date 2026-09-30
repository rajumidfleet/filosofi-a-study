# Säkerhetsgränser

Statisk studieguide utan backend, konton, telemetri eller externa JavaScript-beroenden. Endast självskattning lagras i localStorage under `filosofi-a-guide-v1`; inget skrivs till kursplattformen. Befintliga nycklar lämnas orörda.

Kursinnehåll valideras vid build. Alla textfält HTML-escapas före rendering. JSON som bäddas in i script skyddar mot avslutande HTML-taggar. Endast kända ämnes-id:n kan bli router eller lagringsnycklar; importerad/störd localStorage valideras och gamla/okända nycklar ignoreras. Lagringsfel ger en synlig begränsningsnotis.

Tentakällor valideras till HTTPS på www.fil.lu.se. Externa länkar får rel=noopener. Servern binder till 127.0.0.1 och använder en filallowlist; .git, datafiler och godtyckliga sökvägar serveras inte. Servern är en lokal utvecklingsförhandsvisning, inte en produktionsserver.

Källarkivets PDF:er, personliga svar, betyg och kontoinformation kopieras inte till det offentliga repot. Kursarkivets ursprungsdatum och innehållets avgränsningar syns i guiden.

CI kör innehållskontroll, tester, deterministisk build, hemlighetsskanning och Trivy för beroenden/konfigurationsproblem. Inga npm runtime-beroenden finns att skanna.
