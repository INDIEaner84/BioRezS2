import { Calibration } from '../core/calibration.js';
function assert(c,m){ if(!c) throw new Error(m); }
let p=0,f=0; function test(n,fn){ try{fn(); console.log(`✓ ${n}`); p++;} catch(e){ console.error(`✗ ${n}: ${e.message}`); f++; } }
test('Calibration expired detection', ()=>{
  const c=new Calibration({phase:'expired'});
  assert(c.isExpired(), 'expired');
  const b=c.badge('calibrated');
  assert(b.label==='CAL','badge');
});
console.log(`\n${p} passed, ${f} failed`);
if(f) process.exit(1);
