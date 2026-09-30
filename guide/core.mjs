export const courseNames = {historia: 'Filosofins historia', kritiskt: 'Kritiskt tänkande'};
export const storageKey = 'filosofi-a-guide-v1';
export function esc(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
}
export function questionList(topics) {
  return topics.flatMap(t => t.questions.map(([q, a], i) => ({q, a, key: `${t.id}-${i}`, topic: t.id, title: t.title, course: t.course})));
}
export function readRatings(raw, questions) {
  let parsed;
  try { parsed = JSON.parse(raw || '{}'); } catch { return {}; }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
  return Object.fromEntries(questions.filter(q => ['yes','part','no'].includes(parsed[q.key])).map(q => [q.key, parsed[q.key]]));
}
export function selectQuestions(questions, course, topic, review, ratings) {
  return questions.filter(q => (course === 'all' || q.course === course) && (topic === 'all' || q.topic === topic) && (!review || ratings[q.key] !== 'yes'));
}
export function searchTopics(topics, query, course = 'all') {
  const words = query.trim().toLocaleLowerCase('sv').split(/\s+/).filter(Boolean);
  return topics.filter(t => (course === 'all' || t.course === course) && words.every(w => [t.title,t.subtitle,t.intro,...t.facts,...t.terms.flat()].join(' ').toLocaleLowerCase('sv').includes(w)));
}
export function truthRows(operator) {
  if (!['and','or','implies'].includes(operator)) throw new Error('Unknown operator');
  return [[true,true],[true,false],[false,true],[false,false]].map(([p,q]) => ({p,q,result: operator === 'and' ? p && q : operator === 'or' ? p || q : !p || q}));
}
