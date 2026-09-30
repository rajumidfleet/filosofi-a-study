import http from 'node:http';
import path from 'node:path';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const allowed=new Set(['guide.html','index.html','critical.html','styles.css','critical.css','app.js','critical.js']);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
const port=Number(process.env.PORT||61614);
const server=http.createServer(async(req,res)=>{
  let file;
  try { file=new URL(req.url,'http://localhost').pathname.slice(1)||'guide.html'; }
  catch { res.writeHead(400);res.end();return; }
  if(!['GET','HEAD'].includes(req.method)||!allowed.has(file)){res.writeHead(404);res.end();return;}
  try{const body=await readFile(path.join(root,file));res.writeHead(200,{'Content-Type':types[path.extname(file)],'Content-Length':body.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:body);}catch{res.writeHead(404);res.end();}
}).listen(port,'127.0.0.1',()=>console.log(`http://127.0.0.1:${server.address().port}/guide.html`));
