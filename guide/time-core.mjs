export const TIME_DOMAINS = {all:[-650,1900],ancient:[-650,200],modern:[1500,1900]};
export function yearOrdinal(year) {return year > 0 ? year - 1 : year;}
export function ordinalYear(value) {return value >= 0 ? value + 1 : value;}
export function formatYear(year) {return year < 0 ? `${Math.abs(year)} f.Kr.` : `${year} e.Kr.`;}
export function timePeople(people, year, earlier = false) {return people.filter(p => p.birth <= year && (earlier || p.death >= year));}
export function timeChapter(chapters, year) {return chapters.find(c => c.start <= year && c.end >= year);}
export function timeGroups(people, distance = 0) {
  const groups = [];
  for(const p of people) {
    const point=mapPoint(p.place.lon,p.place.lat);
    const group=groups.find(g=>{const q=mapPoint(g.lon,g.lat);return Math.hypot(point.x-q.x,point.y-q.y)<=distance;});
    if(group){group.people.push(p);group.name=[...new Set(group.people.map(p=>p.place.name))].join(' · ');}
    else groups.push({key:`${p.place.lat.toFixed(2)},${p.place.lon.toFixed(2)}`,...p.place,people:[p]});
  }
  return groups;
}
export function mapPoint(lon,lat) {return {x:(lon+13)/49*900,y:(60-lat)/28*660};}
export function lifePosition(person, range) {
  const [start,end] = range.map(yearOrdinal);
  const left = Math.max(start, yearOrdinal(person.birth));
  const right = Math.min(end, yearOrdinal(person.death));
  if(right < left)return null;
  return {left:(left-start)/(end-start)*100,width:Math.max(.35,(right-left)/(end-start)*100)};
}
export function parseTimeState(hash, data) {
  const params = new URLSearchParams(hash.split('?')[1] || '');
  const rawYear = Number(params.get('year') || -400);
  const year = Number.isInteger(rawYear) && rawYear !== 0 ? Math.max(-650,Math.min(1900,rawYear)) : -400;
  const domain = Object.hasOwn(TIME_DOMAINS,params.get('range')) ? params.get('range') : 'all';
  const person = data.people.find(p=>p.id===params.get('person') && p.birth<=year);
  return {year,domain:year<TIME_DOMAINS[domain][0]||year>TIME_DOMAINS[domain][1]?'all':domain,earlier:params.get('earlier')==='1',person:person?.id||null,city:null};
}
export function validateTimeMap(data, topics) {
  const validYear = y => Number.isInteger(y) && y !== 0 && y>=-650 && y<=1900;
  const sourceOK = s => typeof s.title === 'string' && s.title.length>0 && /^https:\/\//.test(s.url);
  const ids = new Set();
  for(const p of data.people) {
    if(!/^[a-z0-9-]+$/.test(p.id)||ids.has(p.id))throw new Error('Invalid map person ID');
    ids.add(p.id);
    if(!validYear(p.birth)||!validYear(p.death)||p.birth>=p.death||!validYear(p.focusYear)||p.focusYear<p.birth||p.focusYear>p.death)throw new Error('Invalid lifespan: '+p.id);
    if(!topics.some(t=>t.id===p.topic))throw new Error('Unknown topic: '+p.id);
    for(const field of ['name','idea','change'])if(typeof p[field]!=='string'||!p[field].trim())throw new Error('Missing person text');
    if(typeof p.approximate!=='boolean'||!p.place.name||!p.place.note||!Number.isFinite(p.place.lat)||!Number.isFinite(p.place.lon)||p.place.lat<32||p.place.lat>60||p.place.lon< -13||p.place.lon>36)throw new Error('Invalid place: '+p.id);
    if(!p.sources?.length||!p.sources.every(sourceOK))throw new Error('Missing person source');
  }
  for(const c of data.chapters)if(!validYear(c.start)||!validYear(c.end)||c.start>c.end||!validYear(c.focusYear)||c.focusYear<c.start||c.focusYear>c.end||!c.title||!c.summary||!c.question)throw new Error('Invalid chapter');
  for(let y=-650;y<=1900;y++)if(y!==0&&data.chapters.filter(c=>c.start<=y&&c.end>=y).length!==1)throw new Error('Chapter gap or overlap: '+y);
  for(const l of data.links)if(!ids.has(l.from)||!ids.has(l.to)||l.from===l.to||!['teacher','response','comparison'].includes(l.kind)||!validYear(l.year)||!l.label||!l.note||!l.sources?.length||!l.sources.every(sourceOK))throw new Error('Invalid intellectual link');
}
