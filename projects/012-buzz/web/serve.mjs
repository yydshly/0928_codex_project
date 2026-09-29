// Local research gallery only. All application interactions happen in Buzz.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{
  try {
    const route=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
    const target=path.resolve(root,'.'+(route==='/'?'/index.html':route));
    const relative=path.relative(root,target);
    if(relative.startsWith('..')||path.isAbsolute(relative)){res.writeHead(403);res.end();return;}
    const data=await fs.readFile(target);
    res.writeHead(200,{'Content-Type':types[path.extname(target)]??'application/octet-stream','Cache-Control':'no-store'});res.end(data);
  }catch{res.writeHead(404);res.end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Buzz research gallery: http://127.0.0.1:4173/#chinese'));
