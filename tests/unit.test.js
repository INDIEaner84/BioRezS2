import { Generator, GeneratorBus } from '../core/generator.js';
import { SafetyLayer } from '../core/safety.js';
import { VirtualGenerator } from '../hardware/virtual.js';
import { calcStats } from '../analysis/statistics.js';
import { Experiment, SweepEngine } from '../core/experiment.js';
import { SignalComposer } from '../core/signal-composer.js';

function assert(cond, msg){ if(!cond) throw new Error(msg); }

let pass=0, fail=0;
function test(name, fn){
  try{ fn(); console.log(`✓ ${name}`); pass++; } catch(e){ console.error(`✗ ${name}: ${e.message}`); fail++; }
}

test('GeneratorBus add/list', ()=>{
  const bus=new GeneratorBus();
  bus.add(new Generator({id:1, name:'G1'}));
  bus.add(new Generator({id:2, name:'G2'}));
  assert(bus.list().length===2, 'bus size');
});

test('Safety limits block output', ()=>{
  const safety=new SafetyLayer();
  const g=new Generator({id:1, name:'G1'});
  g.channels[0].amplitude=30; // over 20
  const r=safety.check(g);
  assert(!r.ok, 'should block'); assert(!g.channels[0].output, 'output off');
});

test('Safety emergency stop', ()=>{
  const bus=new GeneratorBus(); bus.add(new Generator({id:1,name:'G1'}));
  const safety=new SafetyLayer(); safety.emergencyStop(bus);
  assert(safety.estop, 'estop');
});

test('VirtualGenerator sine', ()=>{
  const vg=new VirtualGenerator({id:1});
  const v=vg.generateSample({frequency:10, amplitude:5, waveform:'sine'}, 0.01);
  assert(Math.abs(v) <= 5, 'amp limit');
});

test('calcStats rms', ()=>{
  const s=calcStats([1,-1,1,-1]);
  assert(Math.abs(s.rms-1) < 0.01, 'rms');
  assert(Math.abs(s.mean) < 0.01, 'mean');
});

test('Sweep linear', ()=>{
  const sw=new SweepEngine({start:10, stop:100, duration:10, mode:'linear'});
  assert(sw.freqAt(5)===55, 'linear 55');
});

test('Sweep log', ()=>{
  const sw=new SweepEngine({start:10, stop:1000, duration:30, mode:'log'});
  const mid=sw.freqAt(15);
  assert(mid>90 && mid<110, 'log mid ~100');
});

test('SignalComposer equation', ()=>{
  const sc=new SignalComposer();
  sc.addSignal({wave:'sine', freq:10}); sc.addSignal({wave:'square', freq:17});
  assert(sc.equation().includes('s(t)'), 'eq');
});

test('Experiment versioning', ()=>{
  const exp=new Experiment({id:'TEST'});
  exp.save({safety:{armed:true}});
  assert(exp.version===2, 'version');
  assert(exp.exportJSON().includes("softwareVersion"), 'json');
});

console.log(`\n${pass} passed, ${fail} failed`);
if(fail) process.exit(1);
