import { Experiment } from '../core/experiment.js';
import { ComparisonEngine } from '../core/comparison.js';
import { SystemHealth } from '../core/health.js';
import { createReproRecord } from '../core/reproducibility.js';
import { Generator, GeneratorBus } from '../core/generator.js';
import { ClockArchitecture } from '../core/clock.js';

function assert(c,m){ if(!c) throw new Error(m); }
let pass=0,fail=0;
function test(n,fn){ try{fn(); console.log(`✓ ${n}`); pass++;} catch(e){ console.error(`✗ ${n}: ${e.message}`); fail++; } }

test('Comparison A vs B', ()=>{
  const eng=new ComparisonEngine();
  eng.add(new Experiment({id:'A', generators:[{frequency:10}]}));
  eng.add(new Experiment({id:'B', generators:[{frequency:20}]}));
  const res=eng.compare('spectrum');
  assert(res.length===2, '2 exps');
  const d=eng.delta('A','B');
  assert(typeof d.coherenceDelta==='number','delta');
});

test('Health sample', ()=>{
  const h=new SystemHealth();
  const m=h.sample();
  assert(m.cpu>30 && m.cpu<60, 'cpu');
  assert(typeof m.ts==='string','ts');
});

test('Repro record completeness', ()=>{
  const bus=new GeneratorBus(); bus.add(new Generator({id:1,name:'G1'}));
  const exp=new Experiment({id:'EXP-1'});
  const clock=new ClockArchitecture();
  const rec=createReproRecord({experiment:exp, bus, clock});
  assert(rec.timestamp && rec.softwareVersion && rec.hardware && rec.randomSeeds, 'fields');
});

console.log(`\n${pass} passed, ${fail} failed`);
if(fail) process.exit(1);
