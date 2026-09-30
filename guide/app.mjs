import {courseNames, storageKey, esc, questionList, readRatings, selectQuestions, searchTopics, truthRows} from './core.mjs';
import {timeMapPage, mountTimeMap} from './time-map.mjs';
// The build inserts the versioned course content here; no runtime network calls.
const topics = /* GUIDE_TOPICS */ [];
const exams = /* GUIDE_EXAMS */ [];
const timeMapData = /* GUIDE_TIME_MAP */ {};
const mapLand = /* GUIDE_MAP_LAND */ {};
let timeMapCleanup = null;
const questions = questionList(topics);
const content = document.getElementById('content');
const nav = document.getElementById('nav');
const search = document.getElementById('search');
const results = document.getElementById('search-results');
let storageOK = true, ratings = {}, current = 'home', course = 'all', topic = 'all', review = false, index = 0, termQuery = '', operator = 'implies';
try { ratings = readRatings(localStorage.getItem(storageKey), questions); } catch { storageOK = false; }
const titles = {home:'Överblick','time-map':'Tidskarta & personer',historia:'Filosofins historia',kritiskt:'Kritiskt tänkande',practice:'Öva med egna ord',glossary:'Alla begrepp',exams:'Gamla tentor',sources:'Källor & läsning'};
const button = (id, title) => `<button data-page="${esc(id)}">${esc(title)}</button>`;
nav.innerHTML = `<div class="nav-items">${['home','time-map','practice','glossary'].map(id => button(id,titles[id])).join('')}</div>` + Object.entries(courseNames).map(([id,name]) => `<details class="nav-section" open><summary>${name}</summary><div class="nav-items">${button(id,'Kursöversikt')}${topics.filter(t => t.course === id).map(t => button(t.id,t.title)).join('')}</div></details>`).join('') + `<div class="nav-items">${button('exams',titles.exams)}${button('sources',titles.sources)}</div>`;

function progress() {
  const count = questions.filter(q => ratings[q.key] === 'yes').length;
  const percent = questions.length ? Math.round(count / questions.length * 100) : 0;
  document.getElementById('progress-label').textContent = `${count} av ${questions.length} förklaringar sitter`;
  document.getElementById('progress-bar').style.width = `${percent}%`;
  document.querySelector('[role=progressbar]').setAttribute('aria-valuenow',percent);
  document.getElementById('storage-note').textContent = storageOK ? 'Sparas i denna webbläsare. Självskattning, inte betyg.' : 'Lagring är inte tillgänglig. Markeringarna finns kvar tills sidan stängs.';
}
function cards(items) {
  return `<div class="grid">${items.map(t => `<article class="card topic-card"><div class="section-label">${esc(t.era || courseNames[t.course])}</div><h3>${esc(t.title)}</h3><p>${esc(t.subtitle)}</p>${button(t.id,'Läs & förklara →')}</article>`).join('')}</div>`;
}
function courseCard(id) {
  const count = topics.filter(t => t.course === id).length;
  const qs = questions.filter(q => q.course === id);
  const done = qs.filter(q => ratings[q.key] === 'yes').length;
  return `<article class="card course-card"><div class="course-symbol" aria-hidden="true">${id === 'historia' ? 'Φ' : '∴'}</div><div class="section-label">${count} områden · ${qs.length} övningsfrågor</div><h2>${courseNames[id]}</h2><p>${id === 'historia' ? 'Från försokratikerna till 1800-talet. Följ frågorna, förstå argumenten och jämför svaren.' : 'Se vad som hävdas, pröva skälen och förstå vad som följer. Ett verktyg i taget.'}</p><p class="small">${done} av ${qs.length} förklaringar sitter</p>${button(id,'Öppna kursen →')}</article>`;
}
function home() {
  return `<div class="hero"><div class="eyebrow">Filosofi A · Två kurser, en studieplats</div><h1>Förstå tanken.<br>Pröva argumentet.</h1><p class="lead">Läs en enkel förklaring. Ge ett eget exempel. Försök sedan förklara utan att titta. Här samlar du filosofins historia och kritiskt tänkande.</p><div class="actions"><button class="primary" data-page="practice">Börja öva →</button>${button('glossary','Hitta ett begrepp')}</div></div><div class="time-map-link"><div><h2>Res genom filosofins historia</h2><p>Dra i tiden. Se personerna, platserna och idéernas samband.</p></div>${button('time-map','Öppna tidskartan →')}</div><div class="grid">${courseCard('historia')}${courseCard('kritiskt')}</div><h2>Ett lagom studiepass · 25 minuter</h2><ol class="steps"><li><span><strong>10 minuter:</strong> välj ett område och läs förklaringen tillsammans med kursmaterialet.</span></li><li><span><strong>10 minuter:</strong> svara på två frågor med egna ord innan du öppnar svarsstödet.</span></li><li><span><strong>5 minuter:</strong> pröva en invändning eller jämför med en annan filosof. Markera vad du vill repetera.</span></li></ol><div class="reading">Att kunna återge en filosof är ett första steg. Nästa steg är att förstå varför argumentet kan verka övertygande – och var det kan ifrågasättas.</div><div class="actions">${button('exams','Utforska gamla tentor')}${button('sources','Källor & läsning')}</div>`;
}
function coursePage(id) {
  return `<div class="hero"><div class="eyebrow">${id === 'historia' ? 'Idéer, problem och argument' : 'Analys, värdering och logik'}</div><h1>${courseNames[id]}</h1><p class="lead">${id === 'historia' ? 'Använd ordningen som en läsväg. Fråga för varje filosof: vilket problem försöker hen lösa, med vilka skäl och till vilket pris?' : 'Börja med att beskriva argumentationen. Bedöm sedan skälens hållbarhet och relevans. Håll isär övertygande språk och starka argument.'}</p><button class="primary" data-practice-course="${id}">Öva den här kursen →</button></div>${cards(topics.filter(t => t.course === id))}`;
}
function rating(q) {
  return `<div class="rating" role="group" aria-label="Självskattning">${[['no','Sitter inte'],['part','Delvis'],['yes','Sitter']].map(([v,label]) => `<button data-rate="${q.key}" data-value="${v}" aria-pressed="${ratings[q.key] === v}">${label}</button>`).join('')}</div>`;
}
function qcard(q) {
  return `<article class="card q-card"><div class="section-label">${courseNames[q.course]} · ${esc(q.title)}</div><h2>${esc(q.q)}</h2><p class="small">Svara högt eller på papper. Öppna sedan stödet och jämför.</p><details><summary>Visa svarsstöd</summary><p>${esc(q.a)}</p></details>${rating(q)}</article>`;
}
function logicTool() {
  const labels = {and:'Konjunktion: p ∧ q',or:'Disjunktion: p ∨ q',implies:'Implikation: p → q'};
  return `<section class="card"><h2>Pröva sanningsvärdena</h2><p class="small">Kompletterande repetition av klassisk satslogik. S = sant, F = falskt. Här är ”eller” inkluderande.</p><label for="operator">Välj satsform </label><select id="operator">${Object.entries(labels).map(([id,label]) => `<option value="${id}" ${operator === id ? 'selected' : ''}>${label}</option>`).join('')}</select><table><caption>${labels[operator]}</caption><thead><tr><th>p</th><th>q</th><th>Hela satsen</th></tr></thead><tbody>${truthRows(operator).map(r => `<tr><td>${r.p?'S':'F'}</td><td>${r.q?'S':'F'}</td><td><strong>${r.result?'S':'F'}</strong></td></tr>`).join('')}</tbody></table><p class="small">${operator === 'implies' ? 'p → q är falsk bara när p är sann och q är falsk. Detta uttrycker ett sanningsvillkor, inte i sig ett orsakssamband.' : operator === 'and' ? 'Både p och q måste vara sanna.' : 'Minst en av p och q måste vara sann; båda får vara sanna.'}</p></section>`;
}
function topicPage(t) {
  return `<div class="eyebrow">${courseNames[t.course]}${t.era ? ' · '+esc(t.era) : ''}</div><h1>${esc(t.title)}</h1><p class="lead">${esc(t.subtitle)}</p><p>${esc(t.intro)}</p><section class="card facts"><h2>Det viktigaste först</h2><ul class="fact-list">${t.facts.map(f=>`<li>${esc(f)}</li>`).join('')}</ul></section><h2>Följ tanken</h2><div class="flow">${t.flow.map((s,i)=>`${i?'<b aria-hidden="true">→</b>':''}<span>${esc(s)}</span>`).join('')}</div><ol class="steps">${t.steps.map(s=>`<li><span>${esc(s)}</span></li>`).join('')}</ol><div class="reading"><strong>Ett exempel</strong><p>${esc(t.example)}</p></div><div class="note"><strong>En vanlig fallgrop</strong><p>${esc(t.trap)}</p></div><h2>Begreppen med enkla ord</h2><div class="terms">${t.terms.map(([name,definition])=>`<details><summary>${esc(name)}</summary><p>${esc(definition)}</p></details>`).join('')}</div>${t.course === 'kritiskt' && t.id.includes('sats') ? logicTool() : ''}<h2>Förklara själv</h2>${questions.filter(q=>q.topic===t.id).map(qcard).join('')}<div class="source-caption"><strong>Underlag:</strong> ${esc(t.source)}${t.reading?`<p><strong>Läs vidare:</strong> ${esc(t.reading)}</p>`:''}<p>Sammanfattat från det lokala kursarkivet (31 augusti 2026). Kontrollera läsanvisningarna i Canvas.</p></div><div class="actions">${button(t.course,'Till kursöversikten')}<button class="primary" data-practice-topic="${t.id}">Öva detta område →</button>${button('sources','Hitta kursmaterialet')}</div>`;
}
function practice() {
  const selected = selectQuestions(questions,course,topic,review,ratings);
  index = Math.min(index,Math.max(0,selected.length-1));
  return `<div class="eyebrow">Repetition · En fråga i taget</div><h1>Öva med egna ord</h1><p>Försök först själv. Svarsstödet är ett exempel på viktiga punkter, inte den enda möjliga formuleringen.</p><div class="study-toolbar"><label for="course-filter">Kurs</label><select id="course-filter"><option value="all">Båda kurserna</option>${Object.entries(courseNames).map(([id,name])=>`<option value="${id}" ${course===id?'selected':''}>${name}</option>`).join('')}</select><label for="topic-filter">Område</label><select id="topic-filter"><option value="all">Alla områden</option>${topics.filter(t=>course==='all'||t.course===course).map(t=>`<option value="${t.id}" ${topic===t.id?'selected':''}>${esc(t.title)}</option>`).join('')}</select><label><input id="review-only" type="checkbox" ${review?'checked':''}> Bara kvar att öva</label></div><p class="small" id="question-count" aria-live="polite">${selected.length ? `Fråga ${index+1} av ${selected.length}` : 'Inga frågor kvar i urvalet.'}</p>${selected.length ? qcard(selected[index]) : '<p class="empty">Alla frågor i urvalet är markerade Sitter. Stäng av filtret för att repetera dem igen.</p>'}<div class="actions"><button id="previous" ${index===0?'disabled':''}>← Föregående fråga</button><button id="next" class="primary" ${index>=selected.length-1?'disabled':''}>Nästa fråga →</button></div>`;
}
function glossary() {
  const list = topics.flatMap(t=>t.terms.map(([name,definition])=>({name,definition,topic:t.id,title:t.title,course:t.course}))).filter(g=>(g.name+' '+g.definition).toLocaleLowerCase('sv').includes(termQuery.toLocaleLowerCase('sv')));
  return `<h1>Alla begrepp</h1><p>Jämför betydelsen i sitt sammanhang – samma ord kan användas på olika sätt.</p><label for="term-search">Filtrera begrepp</label><input id="term-search" type="search" value="${esc(termQuery)}" placeholder="Till exempel: relevans"><p class="small" aria-live="polite">${list.length} begreppsförklaringar</p><div class="terms">${list.map(g=>`<details><summary>${esc(g.name)} <small>· ${esc(g.title)}</small></summary><p>${esc(g.definition)}</p>${button(g.topic,'Läs i sitt sammanhang →')}</details>`).join('')}</div>`;
}
function examPage() {
  return `<h1>Gamla tentor</h1><p class="lead">Pröva att formulera ett resonemang – med en riktig tentafråga som startpunkt.</p><div class="note"><strong>Andra lärosätens material.</strong> Samlingen nedan består av Lunds original-PDF:er. Den är övningsmaterial och visar inte vad som kommer på Umeås examination. Studenters svar är inte officiella facit.</div><h2>Börja med filosofins historia</h2><p>I häftet publicerat HT 2026: filosofins historia på PDF-sidorna 1–4. I HT 2025: sidorna 1–4. Läs alltid tentans egna instruktioner.</p><ol class="steps"><li><span>Välj en fråga som hör till ett område du läst i din egen kurs.</span></li><li><span>Skriv först utan stöd: förklara tesen, återge ett argument och pröva en invändning.</span></li><li><span>Kontrollera mot föreläsning och originaltext. Spara vilka begrepp du behöver repetera.</span></li></ol><h2>31 häften · Originalkällor</h2><p class="small">Inventering från 29 september 2026. Publiceringstermin är inte alltid tentadatum. Samma tenta kan förekomma i flera häften. Länkarna kräver internet.</p><div class="tablewrap"><table><thead><tr><th>Ämne och publicering</th><th>Original</th><th>Sidor</th></tr></thead><tbody>${exams.map(e=>`<tr><td>${e.file.includes('FPRA')?'Praktisk filosofi':'Teoretisk filosofi'}<br><small>${esc(e.term)}</small></td><td><a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.label)}</a></td><td>${e.pages}</td></tr>`).join('')}</tbody></table></div><p class="small">Den befintliga lokala tentasamlingen innehåller nedladdade kopior; här länkas till universitetets original.</p>`;
}
function sources() {
  return `<h1>Källor & läsning</h1><p class="lead">Börja i kursmaterialet. Använd guiden för att förstå och repetera.</p><div class="grid"><article class="card"><h2>Filosofins historia</h2><p>13 föreläsnings-PDF:er ligger bakom de 12 områdena. Läs originaltexterna tillsammans med förklaringarna.</p><a href="https://www.canvas.umu.se/courses/21314" target="_blank" rel="noopener">Öppna kursen i Canvas →</a><p class="small">Kenny: Västerlandets filosofi. Norman: The Moral Philosophers. Följ kursens aktuella läsanvisningar.</p></article><article class="card"><h2>Kritiskt tänkande</h2><p>8 föreläsnings-PDF:er. Gör egna försök på kursens övningar innan du läser tillhörande facit.</p><a href="https://www.canvas.umu.se/courses/21315" target="_blank" rel="noopener">Öppna kursen i Canvas →</a><p class="small">Björnsson, Kihlbom & Ullholm: Argumentationsanalys. Hansson: Verktygslära för filosofer. Även kursartiklar om retorik och logik.</p></article></div><h2>Vad underlaget visar</h2><p>Källhänvisningen under varje område anger föreläsning och PDF-sidor. Guidens egna exempel och frågor är skrivna för repetition. Sanningsvärdestabellen är kompletterande studiestöd.</p><p>Lokalt kursarkiv sparat 31 augusti 2026; innehållet genomgånget för denna guide 30 september 2026. Datum, examinationer och senare ändringar har inte nykontrollerats i Canvas. Guiden visar därför inga aktuella deadlines.</p><h2>Originaltexter att läsa med extra omsorg</h2><ul><li>Platon: Theaitetos. Följ kursens utdrag och skilj dialogens prövade förslag från ett färdigt svar.</li><li>Descartes: hela Meditations/Betraktelser för gruppövningen enligt arkivet. En introduktion eller de första två meditationerna ersätter inte hela läsningen.</li><li>Hume: kursens utdrag om moral. Förklara både känslans och förnuftets roller.</li></ul><h2>Det tidigare studieatlaset</h2><p>De tidigare filosofporträtten, snabbtesten och strukturövningarna finns kvar.</p><div class="actions"><a href="index.html">Historieatlaset →</a><a href="critical.html">Övningar i argumentstruktur →</a></div><h2>Om dina markeringar</h2><p>Självskattningen lagras lokalt i denna webbläsare. Den skickas inte till någon server och ändrar inga uppgifter i Canvas. Den äldre appens markeringar ligger kvar separat.</p><button id="export-progress">Spara en kopia av självskattningen</button>`;
}
function render(focus = true) {
  if(timeMapCleanup){timeMapCleanup();timeMapCleanup=null;}
  const t = topics.find(t=>t.id===current);
  content.innerHTML = t ? topicPage(t) : current === 'time-map' ? timeMapPage() : current === 'practice' ? practice() : current === 'glossary' ? glossary() : current === 'exams' ? examPage() : current === 'sources' ? sources() : courseNames[current] ? coursePage(current) : home();
  if(current === 'time-map')timeMapCleanup=mountTimeMap(content,timeMapData,mapLand);
  document.title = `${t?.title || titles[current]} · Filosofi A`;
  nav.querySelectorAll('[data-page]').forEach(b=>{const active=b.dataset.page===current;b.classList.toggle('active',active);if(active){b.setAttribute('aria-current','page');const details=b.closest('details');if(details)details.open=true;}else b.removeAttribute('aria-current');});
  progress();
  if(focus){content.focus({preventScroll:true});window.scrollTo({top:0});}
}
function navigate(id) {
  const next = titles[id] || topics.some(t=>t.id===id) ? id : 'home';
  results.hidden=true;
  nav.classList.remove('expanded');
  document.getElementById('menu-toggle').setAttribute('aria-expanded','false');
  if(location.hash !== '#'+next) location.hash=next;
  else {current=next;render();}
}
function rate(key,value) {
  if(!questions.some(q=>q.key===key)||!['yes','part','no'].includes(value))return;
  if(ratings[key]===value)delete ratings[key];else ratings[key]=value;
  try{localStorage.setItem(storageKey,JSON.stringify(ratings));}catch{storageOK=false;}
  if(current==='practice'&&review){render(false);document.getElementById('question-count').setAttribute('tabindex','-1');document.getElementById('question-count').focus();}
  else {document.querySelectorAll(`[data-rate="${key}"]`).forEach(b=>b.setAttribute('aria-pressed',ratings[key]===b.dataset.value));progress();}
}
document.addEventListener('click',event=>{
  if(event.target.closest('.skip')){event.preventDefault();content.focus();content.scrollIntoView({block:'start'});return;}
  const b=event.target.closest('button');if(!b)return;
  if(b.dataset.page)navigate(b.dataset.page);
  if(b.dataset.practiceCourse){course=b.dataset.practiceCourse;topic='all';index=0;navigate('practice');}
  if(b.dataset.practiceTopic){topic=b.dataset.practiceTopic;course=topics.find(t=>t.id===topic).course;index=0;navigate('practice');}
  if(b.dataset.rate)rate(b.dataset.rate,b.dataset.value);
  if(b.id==='previous'||b.id==='next'){index+=b.id==='next'?1:-1;render(false);content.focus({preventScroll:true});}
  if(b.id==='menu-toggle'){const open=nav.classList.toggle('expanded');b.setAttribute('aria-expanded',open);}
  if(b.id==='export-progress'){const url=URL.createObjectURL(new Blob([JSON.stringify({version:1,ratings},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='filosofi-sjalvskattning.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
});
document.addEventListener('change',event=>{
  const e=event.target;
  if(e.id==='course-filter'){course=e.value;topic='all';index=0;render(false);document.getElementById(e.id).focus();}
  if(e.id==='topic-filter'){topic=e.value;index=0;render(false);document.getElementById(e.id).focus();}
  if(e.id==='review-only'){review=e.checked;index=0;render(false);document.getElementById(e.id).focus();}
  if(e.id==='operator'){operator=e.value;render(false);document.getElementById(e.id).focus();}
});
document.addEventListener('input',event=>{
  if(event.target.id==='term-search'){const start=event.target.selectionStart,end=event.target.selectionEnd;termQuery=event.target.value;render(false);const field=document.getElementById('term-search');field.focus();field.setSelectionRange(start,end);}
});
search.addEventListener('input',()=>{
  if(!search.value.trim()){results.hidden=true;return;}
  const matches=searchTopics(topics,search.value);
  results.innerHTML=matches.length?matches.map(t=>`<button data-page="${t.id}">${esc(t.title)}<small>${courseNames[t.course]}</small></button>`).join(''):'<p>Ingen träff. Prova ett kortare ord.</p>';
  results.hidden=false;
});
search.addEventListener('keydown',e=>{if(e.key==='Escape')results.hidden=true;if(['ArrowDown','Enter'].includes(e.key)&&!results.hidden){e.preventDefault();const b=results.querySelector('button');if(e.key==='Enter')b?.click();else b?.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.search-wrap'))results.hidden=true;});
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1).split('?')[0];current=titles[id]||topics.some(t=>t.id===id)?id:'home';render();});
const initial=location.hash.slice(1).split('?')[0];current=titles[initial]||topics.some(t=>t.id===initial)?initial:'home';render(false);
