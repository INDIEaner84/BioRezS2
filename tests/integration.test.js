import { Generator, GeneratorBus } from '../core/generator.js';
import { SafetyLayer } from '../core/safety.js';
import { ADCSensor } from '../hardware/sensors/adc.js';
import { VirtualGenerator } from '../hardware/virtual.js';
import { calcStats } from '../analysis/statistics.js';
import { Experiment } from '../core/experiment.js';
import { ClosedLoopController } from '../core/closed-loop.js';
import { provenanceRecord } from '../core/export.js';

function assert(c,m){ if(!c) throw new Error(m); }
let pass=0,fail=0;
function test(n,fn){ try{fn(); console.log(`✓ ${n}`); pass++;} catch(e){ console.error(`✗ ${n}: ${e.message}`); fail++; } }

test('UI->API->Virtual->Measurement->Analysis integration', ()=>{
  const bus=new GeneratorBus();
  const g=new Generator({id:1, name:'G1'}); g.channels[0].frequency=40; g.channels[0].amplitude=5; g.channels[0].output=true;
  bus.add(g);
  const safety=new SafetyLayer(); assert(safety.check(g).ok, 'safety');
  const vg=new VirtualGenerator({id:1});
  const adc=new ADCSensor();
  const samples=adc.acquire(bus, vg, 0.02);
  assert(samples.length===960, 'samples 960');
  const stats=calcStats(samples);
  assert(stats.rms>0, 'rms');
  const exp=new Experiment({generators:bus.list(), signals:[{freq:40}]});
  const rec=provenanceRecord(exp, {sensor:'adc0', rate:48000}, {id:'ana1', config:{fft:2048}});
  assert(rec.experiment===exp.id, 'provenance');
});

test('Closed Loop respects limits', ()=>{
  const ctrl=new ClosedLoopController({target:2, maxOutput:1, timeoutMs:1000});
  ctrl.enable();
  const r=ctrl.update(0);
  assert(Math.abs(r.output) <=1, 'maxOutput');
  ctrl.emergencyStop();
  const r2=ctrl.update(0);
  assert(r2.limited && r2.output===0, 'e-stop');
});

console.log(`\n${pass} passed, ${fail} failed`);
if(fail) process.exit(1);
