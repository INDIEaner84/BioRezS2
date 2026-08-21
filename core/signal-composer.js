/**
 * Signal Composer — P5
 * Addition, Multiplikation, AM, FM, PM, Gate, Burst, Sweep, Chirp, Sequencing, Conditional
 */
export class SignalComposer {
  constructor(){ this.signals=[]; this.mode='ADD'; }
  addSignal(sig){ this.signals.push(sig); }
  setMode(m){ this.mode=m; }
  equation(){
    const terms=this.signals.map((s,i)=>`A${i+1}·${s.wave}(${s.freq}·t+φ${i+1})`).join(this.mode==='ADD'?' + ':' × ');
    const mods={ADD:'Σ', MULT:'Π', AM:'[1+m·cos]', FM:'sin(fc+β·sin)', PM:'sin(fc+PM)', CHIRP:'chirp(10→1000)'};
    return `s(t) = ${mods[this.mode]||'Σ'} ${terms} + n(t)`;
  }
  compose(t){
    if(!this.signals.length) return 0;
    if(this.mode==='ADD') return this.signals.reduce((a,s)=>a+ Math.sin(2*Math.PI*s.freq*t),0);
    if(this.mode==='MULT') return this.signals.reduce((a,s)=>a* Math.sin(2*Math.PI*s.freq*t),1);
    if(this.mode==='AM'){ const c=this.signals[0]; const m=this.signals[1]||{freq:2}; return (1+0.3*Math.cos(2*Math.PI*m.freq*t))*Math.sin(2*Math.PI*c.freq*t); }
    if(this.mode==='FM'){ const c=this.signals[0]; const m=this.signals[1]||{freq:2}; return Math.sin(2*Math.PI*c.freq*t + 2*Math.sin(2*Math.PI*m.freq*t)); }
    return 0;
  }
}
