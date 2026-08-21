import { buildReportHTML } from '../core/pdf-report.js';
import { sampleRealHealth } from '../frontend/js/health-real.js';
function assert(c,m){ if(!c) throw new Error(m); }
let p=0,f=0; function test(n,fn){ try{fn(); console.log(`✓ ${n}`); p++;} catch(e){ console.error(`✗ ${n}: ${e.message}`); f++; } }
test('PDF report contains generators', ()=>{
  const html=buildReportHTML({exp:{id:'EXP-1', version:2, metadata:{software:'v2.1'}, snapshot:()=>'{}'}, bus:{list:()=>[ {id:1,name:'G1',channels:[{frequency:10,amplitude:5}],calibration_state:'calibrated'} ]}, stats:{rms:1.2,thd:1.8}, provenance:{experiment:'EXP-1', uncertainty:{confidence:0.92}}});
  assert(html.includes('EXP-1') && html.includes('G1'), 'content');
});
test('Health real numeric', ()=>{
  global.performance={now:()=>1234, memory:{usedJSHeapSize: 100*1048576}};
  const h=sampleRealHealth();
  assert(parseFloat(h.cpu)>0, 'cpu');
  assert(h.ts, 'ts');
});
console.log(`\n${p} passed, ${f} failed`);
if(f) process.exit(1);
