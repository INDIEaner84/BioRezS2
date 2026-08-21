/**
 * Calibration — P13
 * Jeder Generator/Sensor hat Calibration State
 */
export const CalStates = ['uncalibrated','calibrated','expired','unknown'];
export class Calibration {
  constructor({amplitude='calibrated', frequency='calibrated', phase='expired', offset='calibrated', sensor='uncalibrated', timestamp=new Date().toISOString(), reference='PTB 10MHz', uncertainty='±0.02%', status='calibrated'}={}){
    this.amplitude=amplitude; this.frequency=frequency; this.phase=phase; this.offset=offset; this.sensor=sensor;
    this.timestamp=timestamp; this.reference=reference; this.uncertainty=uncertainty; this.status=status;
  }
  isExpired(){ return this.status==='expired' || this.amplitude==='expired' || this.phase==='expired'; }
  badge(state){
    const map={calibrated:['cyan','CAL'], expired:['gold','EXP'], uncalibrated:['mag','UNCAL'], unknown:['','UNK']};
    const [c,l]=map[state]||['',''];
    return {color:c, label:l};
  }
  toJSON(){ return {...this}; }
}
