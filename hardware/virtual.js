/**
 * VirtualGenerator — P6 Simulator mit kontrolliertem Rauschen/Drift/Jitter/Harmonics
 */
export class VirtualGenerator {
  constructor({id, jitterNs=12, driftHzPerHour=0.11, noiseFloorDb=-92, harmonicDb=-18}){
    this.id=id; this.jitterNs=jitterNs; this.driftHzPerHour=driftHzPerHour; this.noiseFloorDb=noiseFloorDb; this.harmonicDb=harmonicDb;
  }
  generateSample({frequency, amplitude, waveform='sine', phaseDeg=0, duty=50, offset=0}, t){
    const ph = phaseDeg*Math.PI/180;
    const jitter = (Math.random()-0.5)* this.jitterNs*1e-9 * 2*Math.PI*frequency*0.1;
    const drift = (this.driftHzPerHour/3600)*t*0.01;
    const f = frequency + drift;
    const p = 2*Math.PI*f*t + ph + jitter;
    let v=0;
    switch(waveform){
      case 'sine': v=amplitude*Math.sin(p); break;
      case 'square': v=amplitude*Math.sign(Math.sin(p)); break;
      case 'triangle': v=amplitude*(2/Math.PI)*Math.asin(Math.sin(p)); break;
      case 'sawtooth': v=amplitude*(2*(t*f - Math.floor(t*f+0.5))); break;
      case 'pulse': v=amplitude*((t*f %1) < duty/100 ? 1 : -1); break;
      case 'noise': v=amplitude*(Math.random()*2-1)*0.3; break;
      case 'dc': v=offset; break;
      default: v=amplitude*Math.sin(p);
    }
    // harmonics + clipping simulation
    if(waveform==='sine') v += 0.12*amplitude*Math.sin(2*p) + 0.06*amplitude*Math.sin(3*p);
    if(Math.abs(v) > amplitude*0.98) v = Math.sign(v)*amplitude*0.98; // soft clipping
    v += (Math.random()*2-1)* Math.pow(10, this.noiseFloorDb/20) * amplitude *0.1;
    return v + offset;
  }
}
