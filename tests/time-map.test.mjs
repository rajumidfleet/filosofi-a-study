import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {yearOrdinal,ordinalYear,formatYear,timePeople,timeChapter,timeGroups,mapPoint,lifePosition,parseTimeState,validateTimeMap} from '../guide/time-core.mjs';
const data=JSON.parse(readFileSync(new URL('../data/time-map.json',import.meta.url)));
const topics=JSON.parse(readFileSync(new URL('../data/guide-topics.json',import.meta.url)));
test('historical slider crosses BCE/CE without year zero, reversibly',()=>{
  assert.equal(ordinalYear(yearOrdinal(-1)+1),1);
  assert.equal(ordinalYear(yearOrdinal(1)-1),-1);
  for(let y=-650;y<=1900;y++)if(y!==0)assert.equal(ordinalYear(yearOrdinal(y)),y);
  assert.equal(formatYear(-400),'400 f.Kr.');assert.equal(formatYear(1700),'1700 e.Kr.');
});
test('lifetimes include both endpoints; earlier mode excludes unborn people',()=>{
  const people=[{birth:-10,death:10},{birth:11,death:50},{birth:-50,death:-11}];
  assert.deepEqual(timePeople(people,10),[people[0]]);
  assert.deepEqual(timePeople(people,-10),[people[0]]);
  assert.deepEqual(timePeople(people,10,true),[people[0],people[2]]);
  assert.deepEqual(lifePosition({birth:-50,death:50},[-10,10]),{left:0,width:100});
  assert.equal(lifePosition(people[1],[-10,10]),null);
});
test('shared URL validates date, range, and person instead of trusting input',()=>{
  assert.equal(parseTimeState('#time-map?year=0',data).year,-400);
  assert.equal(parseTimeState('#time-map?year=NaN&range=__proto__',data).domain,'all');
  assert.equal(parseTimeState('#time-map?year=99999',data).year,1900);
  assert.equal(parseTimeState('#time-map?year=-99999',data).year,-650);
  assert.equal(parseTimeState('#time-map?year=-400&person=kant',data).person,null);
  assert.equal(parseTimeState('#time-map?year=-400&range=modern',data).domain,'all');
  const state=parseTimeState('#time-map?year=1780&range=modern&person=kant&earlier=1',data);
  assert.equal(state.person,'kant');assert.equal(state.domain,'modern');assert.equal(state.earlier,true);
});
test('co-located people group and regional coordinates project consistently',()=>{
  const athens=data.people.filter(p=>['sokrates','platon'].includes(p.id));
  assert.equal(timeGroups(athens).length,1);assert.equal(timeGroups(athens)[0].people.length,2);
  const ionia=data.people.filter(p=>['thales','herakleitos'].includes(p.id));
  assert.equal(timeGroups(ionia,36).length,1);assert.match(timeGroups(ionia,36)[0].name,/Miletos.*Efesos/);
  assert.deepEqual(mapPoint(-13,60),{x:0,y:0});assert.deepEqual(mapPoint(36,32),{x:900,y:660});
});
test('source data is complete and the course selection gap is explicit',()=>{
  validateTimeMap(data,topics);
  assert.match(timeChapter(data.chapters,1000).summary,/saknas personkort/i);
  for(const mutation of [d=>d.people[0].death=0,d=>d.people[0].topic='missing',d=>d.people[0].place.lon=100,d=>d.people[0].sources=[],d=>d.chapters.pop(),d=>d.links[0].to='unknown']){
    const bad=structuredClone(data);mutation(bad);assert.throws(()=>validateTimeMap(bad,topics));
  }
});
