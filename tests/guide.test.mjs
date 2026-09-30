import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {esc,questionList,readRatings,selectQuestions,searchTopics,truthRows} from '../guide/core.mjs';
const topics=JSON.parse(readFileSync(new URL('../data/guide-topics.json',import.meta.url)));
const qs=questionList(topics);
test('both complete course outlines have source attribution and unique questions',()=>{
  assert.equal(topics.filter(t=>t.course==='historia').length,12);
  assert.equal(topics.filter(t=>t.course==='kritiskt').length,8);
  assert.equal(new Set(qs.map(q=>q.key)).size,qs.length);
  assert(topics.every(t=>t.source.includes('.pdf')));
});
test('storage recovery ignores malformed, outdated and unsafe keys',()=>{
  for(const value of ['oops','null','[]','0'])assert.deepEqual(readRatings(value,qs),{});
  assert.deepEqual(readRatings(JSON.stringify({[qs[0].key]:'yes',obsolete:'yes',[qs[1].key]:'invalid'}),qs),{[qs[0].key]:'yes'});
});
test('review filter isolates course and topic, retaining unanswered questions',()=>{
  const first=qs[0];const ratings={[first.key]:'yes'};
  const result=selectQuestions(qs,first.course,first.topic,true,ratings);
  assert(result.length>0);assert(result.every(q=>q.course===first.course&&q.topic===first.topic&&q.key!==first.key));
  assert.equal(selectQuestions(qs,'all','all',false,ratings).length,qs.length);
  assert.equal(selectQuestions(qs,'kritiskt',first.topic,false,{}).length,0);
});
test('search supports Swedish, multiple words, concepts and empty results',()=>{
  assert(searchTopics(topics,'HÅLLBARHET','kritiskt').length>0);
  assert(searchTopics(topics,'Descartes').length>0);
  assert.equal(searchTopics(topics,'thisworddoesnotexist').length,0);
  assert.equal(searchTopics(topics,'').length,20);
  assert(searchTopics(topics,'satslogik sann').some(t=>t.id==='satslogik'));
});
test('material implication differs from converse; disjunction is inclusive',()=>{
  assert.deepEqual(truthRows('implies').map(r=>r.result),[true,false,true,true]);
  assert.deepEqual(truthRows('and').map(r=>r.result),[true,false,false,false]);
  assert.deepEqual(truthRows('or').map(r=>r.result),[true,true,true,false]);
  assert.throws(()=>truthRows('invalid'));
});
test('all untrusted text characters are escaped',()=>{assert.equal(esc('<img a="x" b=\'y\'>&'),'&lt;img a=&quot;x&quot; b=&#39;y&#39;&gt;&amp;');});
test('built guide is standalone and has no placeholders or injected source tags',()=>{
  const html=readFileSync(new URL('../guide.html',import.meta.url),'utf8');
  assert(!html.includes('GUIDE_'));assert(!html.includes("from './core.mjs'"));
  assert.equal((html.match(/<script\b/g)||[]).length,1);
  assert(html.includes('Filosofins historia'));assert(html.includes('Kritiskt tänkande'));
});
