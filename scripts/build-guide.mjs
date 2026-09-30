import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFile(path.join(root,p),'utf8');
const topics = JSON.parse(await read('data/guide-topics.json'));
const exams = JSON.parse(await read('data/exams.json'));
const ids = new Set();
for (const t of topics) {
  if (!/^[a-z0-9-]+$/.test(t.id) || ids.has(t.id) || !['historia','kritiskt'].includes(t.course)) throw new Error('Invalid topic: '+t.id);
  ids.add(t.id);
  for (const field of ['title','subtitle','intro','source','example','trap']) if(typeof t[field] !== 'string' || !t[field].trim()) throw new Error('Missing '+field+' in '+t.id);
  for (const field of ['facts','flow','steps']) if(!Array.isArray(t[field]) || t[field].length<2 || t[field].some(v=>typeof v!=='string')) throw new Error('Invalid '+field);
  for (const field of ['questions','terms']) if(!Array.isArray(t[field]) || !t[field].length || t[field].some(v=>!Array.isArray(v)||v.length!==2||v.some(x=>typeof x!=='string'||!x.trim()))) throw new Error('Invalid '+field);
}
for(const e of exams) if(new URL(e.url).origin!=='https://www.fil.lu.se' || !Number.isInteger(e.pages))throw new Error('Invalid exam source');
// Escape less-than characters so even future quoted HTML cannot end the script.
const json = x => JSON.stringify(x).replace(/</g,'\\u003c');
const core = (await read('guide/core.mjs')).replace(/^export /gm,'');
const app = (await read('guide/app.mjs')).replace(/^import .*;\n/,'').replace('/* GUIDE_TOPICS */ []',()=>json(topics)).replace('/* GUIDE_EXAMS */ []',()=>json(exams));
const css = await read('guide/styles.css');
const output = (await read('guide/shell.html')).replace('/* GUIDE_STYLES */',()=>css).replace('/* GUIDE_SCRIPT */',()=>core+'\n'+app);
await writeFile(path.join(root,'guide.html'),output);
console.log(`Built guide.html: ${topics.length} topics, ${topics.reduce((n,t)=>n+t.questions.length,0)} questions`);
