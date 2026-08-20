/**
 * App Bootstrap — P9 Dashboard + P10 Experiment
 */
import { Generator, GeneratorBus } from '../../core/generator.js';
import { SafetyLayer } from '../../core/safety.js';
import { ClockArchitecture } from '../../core/clock.js';
import { VirtualGenerator } from '../../hardware/virtual.js';
import { SignalComposer } from '../../core/signal-composer.js';
import { Experiment } from '../../core/experiment.js';

export function bootstrap(){
  const bus=new GeneratorBus();
  [ {id:1,name:'G1 HELIOS',freq:10},{id:2,name:'G2 AETHER',freq:17},{id:3,name:'G3 NYX',freq:23},{id:4,name:'G4 ORION',freq:40},{id:5,name:'G5 VEGA',freq:100},{id:6,name:'G6 NEBULA',freq:1000}].forEach(c=>{
    const g=new Generator({id:c.id, name:c.name});
    g.channels[0].frequency=c.freq; g.channels[0].output=c.id!==6;
    bus.add(g);
  });
  const safety=new SafetyLayer();
  const clock=new ClockArchitecture();
  const composer=new SignalComposer();
  const exp=new Experiment({id:'EXP-2026-08-20-01'});
  const vg=new VirtualGenerator({id:1});
  console.log('[BioRez S2] Boot', {generators:bus.list().length, clock:clock.tick(), exp:exp.id});
  return {bus, safety, clock, composer, exp, vg};
}
