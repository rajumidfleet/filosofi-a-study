export function conceptIndex(topics, extra = []) {
  return [...topics.flatMap(t=>t.terms.map(([name,definition])=>({name,definition,topic:t.id,title:t.title,course:t.course,aliases:[]}))),...extra.map(g=>({...g,title:topics.find(t=>t.id===g.topic).title}))].sort((a,b)=>a.name.localeCompare(b.name,'sv')||a.title.localeCompare(b.title,'sv'));
}
export function conceptWords(query) {
  return query.toLocaleLowerCase('sv').normalize('NFC').replace(/[^\p{L}\p{N}\s-]/gu,' ').trim().split(/\s+/).filter(w=>w&&!['vad','är','ett','en','betyder','förklara','menas','med','kan','jag','hitta'].includes(w));
}
export function searchConcepts(entries, query='', course='all', letter='all') {
  const words=conceptWords(query);
  const rank=g=>words.length && [g.name,...g.aliases].some(n=>n.toLocaleLowerCase('sv')===words.join(' ')) ? 0 : 1;
  return entries.filter(g=>(course==='all'||g.course===course)&&(letter==='all'||g.name.toLocaleUpperCase('sv').startsWith(letter))&&words.every(w=>[g.name,g.definition,g.title,...g.aliases].join(' ').toLocaleLowerCase('sv').normalize('NFC').includes(w))).sort((a,b)=>rank(a)-rank(b)||a.name.localeCompare(b.name,'sv')||a.title.localeCompare(b.title,'sv'));
}
