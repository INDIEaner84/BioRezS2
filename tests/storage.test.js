import { StorageManager } from '../core/storage.js';
import { Experiment } from '../core/experiment.js';
function assert(c,m){ if(!c) throw new Error(m); }
let p=0,f=0; function test(n,fn){ try{fn(); console.log(`✓ ${n}`); p++;} catch(e){ console.error(`✗ ${n}: ${e.message}`); f++; } }
test('Storage version limit', ()=>{
  const sm=new StorageManager({maxVersions:2});
  const exp=new Experiment({id:'E1'});
  exp.history=[1,2,3,4];
  sm.saveExperiment(exp);
  assert(exp.history.length===2, 'trimmed');
});
test('Samples limit', ()=>{
  const sm=new StorageManager({maxSamples:100});
  assert(!sm.checkLimits(200).ok, 'exceeded');
  assert(sm.checkLimits(50).ok, 'ok');
});
console.log(`\n${p} passed, ${f} failed`);
if(f) process.exit(1);
