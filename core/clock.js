export class ClockArchitecture {
  constructor(){
    this.clocks={
      system:{source:'System Clock', accuracy:'±20 ppm', stability:'±0.1 ppm/h', drift:0},
      generator:{source:'10MHz REF', accuracy:'±0.02 ppm', stability:'±0.01 ppm/h', jitterNs:12},
      measurement:{source:'ADC 48k', accuracy:'±1 ppm', jitterNs:18},
      trigger:{source:'External Trig', latencyMs:10, compensated:true}
    };
  }
  tick(){ this.clocks.generator.drift += (Math.random()-0.5)*0.002; return this.clocks; }
}
