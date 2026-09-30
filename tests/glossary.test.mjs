import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {conceptIndex,conceptWords,searchConcepts} from '../guide/glossary-core.mjs';
const topics=JSON.parse(readFileSync(new URL('../data/guide-topics.json',import.meta.url)));
const extra=JSON.parse(readFileSync(new URL('../data/extra-concepts.json',import.meta.url)));
const entries=conceptIndex(topics,extra);
test('index keeps contextual meanings, every course term, and Swedish ordering',()=>{
 assert.equal(conceptIndex(topics).length,112);assert.equal(entries.length,114);
 assert.equal(searchConcepts(entries,'logos').filter(g=>g.name==='Logos').length,2);
 assert.deepEqual(entries.map(g=>g.name),entries.map(g=>g.name).sort((a,b)=>a.localeCompare(b,'sv')));
});
test('axiom is found by name, simple questions and aliases',()=>{
 for(const q of ['axiom','Vad är ett AXIOM?','vad är en axiom','axiomet','grundantagande']) assert.equal(searchConcepts(entries,q)[0].name,'Axiom');
 for(const q of ['hylomorfism','hyloformism','hylomorphism']) assert.equal(searchConcepts(entries,q)[0].name,'Hylomorfism');
 assert.deepEqual(conceptWords('Vad betyder a priori?'),['a','priori']);
 assert.equal(searchConcepts(entries,'a priori')[0].name,'A priori');
 assert(searchConcepts(entries,'HA\u030aLLBARHET').some(g=>g.name==='Hållbarhet'));
});
test('course and initial filters compose with search and fail safely',()=>{
 assert(searchConcepts(entries,'','historia','A').every(g=>g.course==='historia'&&g.name.startsWith('A')));
 assert.equal(searchConcepts(entries,'axiom','historia').length,0);
 assert.equal(searchConcepts(entries,'axiom','all','B').length,0);
 assert.equal(searchConcepts(entries,'<script>alert(1)</script>').length,0);
 assert.equal(searchConcepts(entries,'thisworddoesnotexist').length,0);
 assert.equal(searchConcepts(entries,'  ').length,114);
});
