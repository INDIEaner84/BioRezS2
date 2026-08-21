import { PluginSecurity } from '../plugins/security.js';
function assert(c,m){ if(!c) throw new Error(m); }
let p=0,f=0; function test(n,fn){ try{fn(); console.log(`✓ ${n}`); p++;} catch(e){ console.error(`✗ ${n}: ${e.message}`); f++; } }
test('Allowlist blocks unknown', ()=>{
  const sec=new PluginSecurity({allowlist:['virtual']});
  const res=sec.canLoad({id:'evil', type:'evil'});
  assert(!res.ok, 'blocked');
});
test('Capability negotiation', ()=>{
  const sec=new PluginSecurity();
  const r=sec.negotiate(['AM','FM'], ['AM','FM','PM']);
  assert(r.granted && r.ok.length===2,'granted');
  const r2=sec.negotiate(['AM','XYZ'], ['AM']);
  assert(!r2.granted && r2.missing.includes('XYZ'),'missing');
});
console.log(`\n${p} passed, ${f} failed`);
if(f) process.exit(1);
