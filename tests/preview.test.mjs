import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import http from 'node:http';
test('loopback preview rejects private files and malformed paths without crashing',async t=>{
  const server=spawn(process.execPath,['scripts/preview.mjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:'0'}});
  t.after(()=>server.kill());
  const url=await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('Preview startup timed out')),5000);
    server.stdout.once('data',chunk=>{clearTimeout(timer);resolve(chunk.toString().trim());});
    server.once('error',e=>{clearTimeout(timer);reject(e);});
  });
  const port=new URL(url).port;
  const request=(path,method='GET')=>new Promise((resolve,reject)=>{
    http.request({host:'127.0.0.1',port,path,method},res=>{res.resume();res.on('end',()=>resolve(res.statusCode));}).on('error',reject).end();
  });
  assert.equal(await request('//%'),400);
  assert.equal(await request('/.git/config'),404);
  assert.equal(await request('/data/guide-topics.json'),404);
  assert.equal(await request('/guide.html','POST'),404);
  assert.equal(await request('/guide.html'),200);
  assert.equal(await request('/guide.html','HEAD'),200);
});
