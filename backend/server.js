/**
 * Backend Mock — Control Plane / Data Plane / Analysis Plane
 * Kein echter Hardware-Zugriff, simuliert API §34
 * Run: node backend/server.js  (port 3001)
 */
import http from 'http';
import { Generator, GeneratorBus } from '../core/generator.js';
import { SafetyLayer } from '../core/safety.js';

const bus=new GeneratorBus();
[1,2,3,4,5,6].forEach(id=>{
  const g=new Generator({id, name:`G${id}`, model:'Virtual'});
  g.channels[0].frequency=10*id;
  bus.add(g);
});
const safety=new SafetyLayer();

const server=http.createServer((req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Content-Type','application/json');
  if(req.url==='/api/generators' && req.method==='GET'){
    return res.end(JSON.stringify(bus.list().map(g=>g.toJSON())));
  }
  if(req.url.startsWith('/api/generators/') && req.method==='POST'){
    let body=''; req.on('data',c=>body+=c); req.on('end',()=>{
      try{
        const patch=JSON.parse(body||'{}');
        const id=parseInt(req.url.split('/')[3]);
        const g=bus.get(id);
        if(!g) { res.statusCode=404; return res.end(JSON.stringify({error:'not found'})); }
        Object.assign(g.channels[0], patch);
        const chk=safety.check(g);
        if(!chk.ok){ g.channels[0].output=false; }
        res.end(JSON.stringify({ok:chk.ok, reason:chk.reason, generator:g.toJSON()}));
      } catch(e){ res.statusCode=400; res.end(JSON.stringify({error:e.message})); }
    });
    return;
  }
  if(req.url==='/api/health'){
    return res.end(JSON.stringify({cpu:42, dropped:0, version:'2.1'}));
  }
  res.statusCode=404; res.end(JSON.stringify({error:'not found'}));
});
const PORT=process.env.PORT||3001;
server.listen(PORT, ()=> console.log(`[Control API] http://localhost:${PORT} — mock`));
