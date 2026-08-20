/**
 * Measurement Feedback Layer — P14 + P15 Closed Loop
 */
import { SensorPlugin } from '../../plugins/interface.js';
export class ADCSensor extends SensorPlugin {
  constructor(id='adc0', {sampleRate=48000, bits=16, vRange=10}={}){
    super(id, {sampleRate, bits, vRange});
    this.sampleRate=sampleRate; this.bits=bits; this.vRange=vRange;
    this.noiseFloorDb=-92; this.jitterNs=18;
  }
  // Simulated acquisition from VirtualGenerator summed output
  acquire(bus, vg, durationSec=0.1){
    const n=Math.floor(this.sampleRate*durationSec);
    const t0=Date.now()/1000;
    return Array.from({length:n},(_,i)=>{
      const t=t0 + i/this.sampleRate;
      let v=0;
      for(const g of bus.list()){
        for(const ch of g.channels){
          if(!ch.output) continue;
          v+= vg.generateSample({frequency:ch.frequency, amplitude:ch.amplitude, waveform:ch.waveform, phaseDeg:ch.phase, duty:ch.duty, offset:ch.offset}, t);
        }
      }
      // ADC quantization
      const lsb=(2*this.vRange)/Math.pow(2,this.bits);
      v=Math.round(v/lsb)*lsb;
      v=Math.max(-this.vRange, Math.min(this.vRange, v));
      return v;
    });
  }
  getUncertainty(){
    return {type:'estimated', noiseFloor:this.noiseFloorDb, jitterNs:this.jitterNs, calibration:'calibrated', uncertainty:'±0.5% ±1LSB'};
  }
}
export class SensorRegistry {
  constructor(){ this.sensors=new Map(); }
  register(s){ this.sensors.set(s.id, s); }
  get(id){ return this.sensors.get(id); }
  list(){ return [...this.sensors.values()]; }
}
