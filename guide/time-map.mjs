import {esc} from './core.mjs';
import {TIME_DOMAINS,yearOrdinal,ordinalYear,formatYear,timePeople,timeChapter,timeGroups,mapPoint,lifePosition,parseTimeState} from './time-core.mjs';

export function timeMapPage() {
  return `<div class="eyebrow">Filosofins historia · Tid, plats och idéer</div><h1>Följ tanken genom tiden.</h1><p class="lead">Dra i tidsreglaget. Se vilka som levde samtidigt, var de hör hemma och hur deras frågor och svar hänger ihop.</p><div id="time-map-app"></div>`;
}

export function mountTimeMap(root, data, land) {
  const host=root.querySelector('#time-map-app');
  const state=parseTimeState(location.hash,data);
  let timer=null, zoom=1, panX=0, panY=0, drag=null, dragged=false;
  const peopleById=new Map(data.people.map(p=>[p.id,p]));
  const relationshipNames={teacher:'Lärare och elev',response:'Idémässigt gensvar',comparison:'Pedagogisk jämförelse'};
  const landPath=land.rings.map(ring=>ring.map(([lon,lat],i)=>{const p=mapPoint(lon,lat);return `${i?'L':'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`;}).join('')+'Z').join('');
  const chapterButtons=data.chapters.map(c=>`<button data-era="${esc(c.id)}">${esc(c.title)}</button>`).join('');
  host.innerHTML=`<section class="time-console" aria-label="Välj tid"><div class="time-console-head"><div><label for="time-year">Valt år</label><output id="time-year-label" for="time-year"></output></div><div class="time-playback"><button id="time-back" aria-label="Gå tio år bakåt">−10 år</button><button id="time-play" class="primary" aria-pressed="false">▶ Spela</button><button id="time-forward" aria-label="Gå tio år framåt">+10 år</button></div></div><input id="time-year" type="range" min="-650" max="1899" step="1" aria-label="År på tidskartan" aria-describedby="time-help"><div id="time-scale" class="time-scale"></div><div class="time-options"><label>Tidsutsnitt <select id="time-domain"><option value="all">Hela tidslinjen</option><option value="ancient">Antiken</option><option value="modern">1500–1900</option></select></label><label class="time-check"><input type="checkbox" id="time-earlier"> Visa även tidigare personer</label><label>Gå till person <select id="time-person"><option value="">Välj filosof…</option>${data.people.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label></div><p id="time-help" class="mini">Dra reglaget eller använd piltangenterna för ett år i taget. Spela flyttar tio år per steg. Historisk tideräkning saknar år noll.</p></section><div class="era-shortcuts" aria-label="Hoppa till ett avsnitt">${chapterButtons}</div><section id="time-era" class="time-era" aria-live="polite"></section><div class="time-explorer"><section class="time-map-card" aria-label="Geografisk karta"><div class="time-map-heading"><div><h2>Platserna bakom idéerna</h2><p id="time-count" class="small" aria-live="polite"></p></div><div class="map-tools"><button id="map-zoom-in" aria-label="Zooma in kartan">+</button><button id="map-zoom-out" aria-label="Zooma ut kartan">−</button><button id="map-reset">Återställ</button></div></div><div class="geo-frame" id="geo-frame"><div class="geo-stage" id="geo-stage"><svg viewBox="0 0 900 660" aria-label="Kustlinjer i Europa och östra Medelhavet" role="img" class="geo-base"><rect width="900" height="660" fill="#e4eff0"/>${[40,50,60].map(lat=>`<path d="M0 ${mapPoint(0,lat).y}H900" class="geo-grid"/>`).join('')}${[0,10,20,30].map(lon=>`<path d="M${mapPoint(lon,0).x} 0V660" class="geo-grid"/>`).join('')}<path d="${landPath}" class="geo-land"/><text x="80" y="445" class="sea-label">Atlanten</text><text x="355" y="630" class="sea-label">Medelhavet</text></svg><svg viewBox="0 0 900 660" id="geo-links" class="geo-links" aria-hidden="true"></svg><div id="geo-markers"></div></div></div><div class="map-legend"><span><i class="dot alive"></i> Lever vid valt år</span><span><i class="dot earlier"></i> Tidigare person</span><span>Tal = personer vid samma eller närliggande orter</span></div><p class="mini map-caption">Punkterna visar utvalda platser ur personernas liv, inte deras exakta vistelseort vid reglagets år. Stadslägen och äldre årtal är ungefärliga. Dra kartan för att panorera.</p><p class="mini map-attribution">Kustlinjer: <a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noopener">Natural Earth</a>. Nutida kustkonturer, inga historiska statsgränser.</p></section><aside class="time-person-panel"><div id="time-place-list"></div><div id="time-profile"></div></aside></div><section class="life-section"><div class="time-section-heading"><div><h2>Vem levde samtidigt?</h2><p class="small">Varje band visar ett livsspann. Klicka på ett namn för att gå till personens tid.</p></div><span id="life-range-label" class="tag"></span></div><div class="life-chart"><div class="life-ruler"><span>Person</span><div id="life-ticks"></div></div><div id="life-rows"></div></div></section><details class="time-source-note"><summary>Hur ska kartan läsas?</summary><p>Det här är en tidskarta över ett urval i din kurs, inte över hela världens filosofi. Perioderna är pedagogiska indelningar med överlappande idéer. Ett livsspann innebär inte att alla personens idéer redan var formulerade. Platserna är fasta biografiska knutpunkter, så en punkt flyttar sig inte med personens resor.</p><p>Idélinjerna skiljer lärarrelationer från gensvar och jämförelser. De visar inte resvägar, och ett gensvar kräver inte att personerna möttes. Källor för datum, platser och samband finns i personkortet. Uppspelningen stannar när du lämnar vyn.</p></details>`;
  const get=id=>host.querySelector('#'+id);
  const slider=get('time-year');
  function shareState(){
    const params=new URLSearchParams({year:state.year,range:state.domain});
    if(state.earlier)params.set('earlier','1');
    if(state.person)params.set('person',state.person);
    history.replaceState(null,'','#time-map?'+params);
  }
  function stop(){if(timer){clearInterval(timer);timer=null;}get('time-play').textContent='▶ Spela';get('time-play').setAttribute('aria-pressed','false');}
  function setYear(year,share=true){
    const [lo,hi]=TIME_DOMAINS[state.domain];
    state.year=Math.max(lo,Math.min(hi,year));
    state.city=null;
    update();if(share)shareState();
  }
  function selectPerson(id){
    const p=peopleById.get(id);if(!p)return;
    stop();state.person=id;state.city=null;
    if(p.focusYear<TIME_DOMAINS[state.domain][0]||p.focusYear>TIME_DOMAINS[state.domain][1])state.domain=p.focusYear<200?'ancient':'modern';
    setYear(p.focusYear);
  }
  function sourcesHTML(sources){return sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>`).join(' · ');}
  function profile(person){
    if(!person)return `<div class="time-empty"><span aria-hidden="true">φ</span><h3>Ingen person i urvalet lever då.</h3><p>Filosofins historia fortsätter ändå. Välj ett annat år eller visa även tidigare personer.</p></div>`;
    const connections=data.links.filter(l=>l.from===person.id||l.to===person.id);
    return `<article class="time-profile"><div class="section-label">${person.death<state.year?'Tidigare tänkare':'Lever vid valt år'}</div><h2>${esc(person.name)}</h2><p class="person-years">${person.approximate?'Cirka ':''}${formatYear(person.birth)} – ${formatYear(person.death)}</p><p class="person-place">⌖ ${esc(person.place.name)}</p><p class="mini">${esc(person.place.note)}</p><h3>Den centrala tanken</h3><p>${esc(person.idea)}</p><h3>Vad förändras?</h3><p>${esc(person.change)}</p><button class="primary" data-page="${person.topic}">Läs kursavsnittet →</button>${connections.length?`<h3>Samtal över tid</h3><ul class="idea-connections">${connections.map(l=>{const other=peopleById.get(l.from===person.id?l.to:l.from);return `<li><span class="connection-kind">${relationshipNames[l.kind]}</span><button data-map-person="${other.id}">${esc(other.name)} →</button><p><strong>${esc(l.label)}.</strong> ${esc(l.note)}</p><small>${l.approximate?'Cirka ':''}${formatYear(l.year)}${l.year>state.year?' · senare än valt år':''}</small><details><summary>Källa till sambandet</summary><p>${sourcesHTML(l.sources)}</p></details></li>`;}).join('')}</ul>`:''}<details class="person-sources"><summary>Biografiska källor</summary><p>${sourcesHTML(person.sources)}</p></details></article>`;
  }
  function updateTransform(){get('geo-stage').style.transform=`translate(${panX}px,${panY}px) scale(${zoom})`;}
  function grouped(people){return timeGroups(people, Math.max(36,44*900/get('geo-frame').getBoundingClientRect().width));}
  function update(){
    const active=document.activeElement;
    const focusKey=active && host.contains(active) ? ['data-map-city','data-select-person','data-map-person'].find(k=>active.hasAttribute(k)) : null;
    const focusValue=focusKey ? active.getAttribute(focusKey) : null;
    const range=TIME_DOMAINS[state.domain];
    slider.min=yearOrdinal(range[0]);slider.max=yearOrdinal(range[1]);slider.value=yearOrdinal(state.year);slider.setAttribute('aria-valuetext',formatYear(state.year));
    get('time-year-label').textContent=formatYear(state.year);
    get('time-domain').value=state.domain;get('time-earlier').checked=state.earlier;
    get('time-scale').innerHTML=`<span>${formatYear(range[0])}</span><span>${formatYear(range[1])}</span>`;
    get('time-back').disabled=state.year===range[0];get('time-forward').disabled=state.year===range[1];
    const chapter=timeChapter(data.chapters,state.year);
    get('time-era').innerHTML=`<div><span class="section-label">${formatYear(chapter.start)} – ${formatYear(chapter.end)}</span><h2>${esc(chapter.title)}</h2><p>${esc(chapter.summary)}</p></div><div class="era-question"><span>Frågan att följa</span><strong>${esc(chapter.question)}</strong></div>`;
    host.querySelectorAll('[data-era]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.era===chapter.id));
    const visible=timePeople(data.people,state.year,state.earlier);
    if(!visible.some(p=>p.id===state.person))state.person=visible.find(p=>p.death>=state.year)?.id||visible[0]?.id||null;
    const selected=peopleById.get(state.person);
    const groups=grouped(visible);
    const city=groups.find(g=>g.key===state.city)||groups.find(g=>g.people.some(p=>p.id===state.person));
    get('time-person').value=state.person||'';
    get('time-count').textContent=`${timePeople(data.people,state.year).length} levande i urvalet · ${groups.length} platser visas`;
    get('geo-markers').innerHTML=groups.map(g=>{const {x,y}=mapPoint(g.lon,g.lat);const alive=g.people.some(p=>p.death>=state.year);return `<button class="geo-marker ${alive?'is-alive':'is-earlier'} ${city?.key===g.key?'is-selected':''}" style="left:${(x/900*100).toFixed(2)}%;top:${(y/660*100).toFixed(2)}%" data-map-city="${esc(g.key)}" aria-label="${esc(g.name)}: ${g.people.map(p=>esc(p.name)).join(', ')}" aria-pressed="${city?.key===g.key}"><span class="pin-number">${g.people.length}</span><span class="pin-name">${esc(g.name)}</span></button>`;}).join('');
    const lines=data.links.filter(l=>timeGroups([peopleById.get(l.from),peopleById.get(l.to)],1).length>1&&l.year<=state.year&&(l.from===state.person||l.to===state.person)&&visible.some(p=>p.id===l.from)&&visible.some(p=>p.id===l.to));
    get('geo-links').innerHTML=lines.map(l=>{const a=groups.find(g=>g.people.some(p=>p.id===l.from)),b=groups.find(g=>g.people.some(p=>p.id===l.to));if(a===b)return '';const p=mapPoint(a.lon,a.lat),q=mapPoint(b.lon,b.lat);return `<path d="M${p.x},${p.y} Q${(p.x+q.x)/2},${Math.min(p.y,q.y)-60} ${q.x},${q.y}" class="idea-line ${l.kind}"><title>${esc(l.label)}</title></path>`;}).join('');
    get('time-place-list').innerHTML=city?`<div class="time-place-list"><h3>${esc(city.name)}</h3><p class="mini">${city.people.length} ${city.people.length===1?'person':'personer'} i denna grupp</p><div>${city.people.map(p=>`<button data-select-person="${p.id}" aria-pressed="${p.id===state.person}">${esc(p.name)}</button>`).join('')}</div></div>`:'';
    get('time-profile').innerHTML=profile(selected);
    get('life-range-label').textContent=`${formatYear(range[0])} – ${formatYear(range[1])}`;
    const ticks=Array.from({length:5},(_,i)=>ordinalYear(Math.round(yearOrdinal(range[0])+(yearOrdinal(range[1])-yearOrdinal(range[0]))*i/4)));
    get('life-ticks').innerHTML=ticks.map(y=>`<span>${formatYear(y)}</span>`).join('');
    const cursor=(yearOrdinal(state.year)-yearOrdinal(range[0]))/(yearOrdinal(range[1])-yearOrdinal(range[0]))*100;
    get('life-rows').innerHTML=data.people.map(p=>{const pos=lifePosition(p,range);if(!pos)return '';const alive=p.birth<=state.year&&p.death>=state.year;return `<div class="life-row ${alive?'is-alive':''} ${p.id===state.person?'is-selected':''}"><button data-map-person="${p.id}" aria-label="${esc(p.name)}, ${formatYear(p.birth)} till ${formatYear(p.death)}">${esc(p.name)}</button><div class="life-track"><span class="life-band ${p.birth>state.year?'future':''}" style="left:${pos.left}%;width:${pos.width}%" title="${p.approximate?'Cirka ':''}${formatYear(p.birth)} – ${formatYear(p.death)}"></span><i class="life-cursor" style="left:${cursor}%"></i></div></div>`;}).join('');
    updateTransform();
    if(focusKey){const replacement=[...host.querySelectorAll('['+focusKey+']')].find(e=>e.getAttribute(focusKey)===focusValue);replacement?.focus({preventScroll:true});}
  }
  const controller=new AbortController(), listenerOptions={signal:controller.signal};
  host.addEventListener('input',e=>{if(e.target===slider){stop();setYear(ordinalYear(Number(slider.value)),false);}},listenerOptions);
  host.addEventListener('change',e=>{
    if(e.target===slider)shareState();
    if(e.target.id==='time-domain'){stop();state.domain=e.target.value;setYear(state.year);}
    if(e.target.id==='time-earlier'){state.earlier=e.target.checked;update();shareState();}
    if(e.target.id==='time-person')selectPerson(e.target.value);
  },listenerOptions);
  host.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(dragged){dragged=false;return;}
    if(b.id==='time-play'){
      if(timer){stop();return;}
      if(state.year===TIME_DOMAINS[state.domain][1])setYear(TIME_DOMAINS[state.domain][0]);
      b.textContent='Ⅱ Pausa';b.setAttribute('aria-pressed','true');
      timer=setInterval(()=>{setYear(ordinalYear(yearOrdinal(state.year)+10));if(state.year===TIME_DOMAINS[state.domain][1])stop();},650);
    }
    if(b.id==='time-back'||b.id==='time-forward'){stop();setYear(ordinalYear(yearOrdinal(state.year)+(b.id==='time-forward'?10:-10)));}
    if(b.dataset.era){stop();const c=data.chapters.find(c=>c.id===b.dataset.era);state.domain=c.focusYear<200?'ancient':c.focusYear>=1500?'modern':'all';setYear(c.focusYear);}
    if(b.dataset.mapPerson)selectPerson(b.dataset.mapPerson);
    if(b.dataset.selectPerson){stop();state.person=b.dataset.selectPerson;update();shareState();}
    if(b.dataset.mapCity){stop();state.city=b.dataset.mapCity;const g=grouped(timePeople(data.people,state.year,state.earlier)).find(g=>g.key===state.city);state.person=g.people[0].id;update();shareState();}
    if(['map-zoom-in','map-zoom-out','map-reset'].includes(b.id)){if(b.id==='map-reset'){zoom=1;panX=0;panY=0;}else{zoom=Math.max(1,Math.min(3,zoom+(b.id === 'map-zoom-in' ? .5 : -.5)));if(zoom===1){panX=0;panY=0;}}updateTransform();}
  },listenerOptions);
  const frame=get('geo-frame');
  frame.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;drag={x:e.clientX,y:e.clientY,panX,panY};dragged=false;frame.setPointerCapture(e.pointerId);},listenerOptions);
  frame.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>4)dragged=true;const bounds=frame.getBoundingClientRect();panX=Math.max(-bounds.width/2,Math.min(bounds.width/2,drag.panX+dx));panY=Math.max(-bounds.height/2,Math.min(bounds.height/2,drag.panY+dy));updateTransform();},listenerOptions);
  const endDrag=()=>{drag=null;setTimeout(()=>{dragged=false;},0);};
  frame.addEventListener('pointerup',endDrag,listenerOptions);frame.addEventListener('pointercancel',endDrag,listenerOptions);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();},listenerOptions);
  update();
  return ()=>{stop();controller.abort();};
}
