/**
 * Experiment Engine — P10 Versioned, Reproducible
 */
export class Experiment {
  constructor({id, metadata={}, generators=[], signals=[], sync={}, sequence=[], measurement={}, calibration={}, safety={}, analysis={}}){
    this.id=id || `EXP-${new Date().toISOString().slice(0,10)}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
    this.version=1;
    this.metadata={created: new Date().toISOString(), software:'BioRezS2 v2.1', ...metadata};
    this.generators=generators; this.signals=signals; this.sync=sync;
    this.sequence=sequence; this.measurement=measurement; this.calibration=calibration;
    this.safety=safety; this.analysis=analysis;
    this.results=null; this.provenance=[];
    this.history=[{version:1, ts:new Date().toISOString(), change:'created'}];
  }
  snapshot(){
    return {
      timestamp:new Date().toISOString(),
      softwareVersion:this.metadata.software,
      hardware:this.generators.map(g=>({id:g.id, model:g.model, firmware:'1.0'})),
      generatorSettings:this.generators,
      signalDefinitions:this.signals,
      calibration:this.calibration,
      sensor:this.measurement,
      sampling:{rate:48000, window:'Hann', fft:2048},
      provenance:this.provenance,
      results:this.results
    };
  }
  save(patch, user='admin'){
    this.version++;
    Object.assign(this, patch);
    this.history.push({version:this.version, ts:new Date().toISOString(), user, patch:JSON.stringify(patch).slice(0,200)});
    this.provenance.push({from:'Experiment', to:`v${this.version}`, ts:new Date().toISOString(), user});
    return this.snapshot();
  }
  exportJSON(){ return JSON.stringify(this.snapshot(), null, 2); }
  exportCSV(samples){
    const header='t,amplitude\n';
    return header + samples.map((v,i)=>`${(i/48000).toFixed(6)},${v.toFixed(6)}`).join('\n');
  }
}
export class Sequencer {
  constructor(steps=[]){ this.steps=steps; this.t=0; this.running=false; }
  add(step){ this.steps.push(step); }
  // step: {at, duration, action}
  tick(dt){
    if(!this.running) return;
    this.t+=dt;
    for(const s of this.steps){ if(Math.abs(this.t - s.at) < dt) s.action?.(s); }
  }
  play(){ this.running=true; this.t=0; }
  stop(){ this.running=false; }
}
export class SweepEngine {
  constructor({start=10, stop=1000, duration=30, mode='log'}){
    this.start=start; this.stop=stop; this.duration=duration; this.mode=mode;
  }
  freqAt(t){
    const u=Math.min(1, t/this.duration);
    if(this.mode==='linear') return this.start + (this.stop-this.start)*u;
    if(this.mode==='log') return this.start * Math.pow(this.stop/this.start, u);
    if(this.mode==='exp') return this.start + (this.stop-this.start)*(Math.exp(u*3)-1)/(Math.exp(3)-1);
    return this.start;
  }
}
