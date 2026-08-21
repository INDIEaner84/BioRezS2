/**
 * Safety Layer — P11
 * Vor Hardware-Ausgabe. Bei Überschreitung -> OUTPUT OFF
 */
export class SafetyLayer {
  constructor(limits={amp:[0,20], freq:[0.01,1e6], duty:[1,99], dc:[-1,1], duration:3600, temp:70}){
    this.limits=limits; this.armed=true; this.watchdogMs=5000; this.lastOk=Date.now();
    this.estop=false; this.violations=[];
  }
  check(gen){
    if(this.estop) return {ok:false, reason:'EMERGENCY STOP'};
    const v=[];
    for(const ch of gen.channels){
      if(ch.amplitude < this.limits.amp[0] || ch.amplitude > this.limits.amp[1]) v.push(`G${gen.id} CH${ch.channel} amplitude ${ch.amplitude}V out of range`);
      if(ch.frequency < this.limits.freq[0] || ch.frequency > this.limits.freq[1]) v.push(`G${gen.id} CH${ch.channel} freq ${ch.frequency}Hz out of range`);
      if(ch.duty < this.limits.duty[0] || ch.duty > this.limits.duty[1]) v.push(`G${gen.id} CH${ch.channel} duty ${ch.duty}%`);
      if(ch.offset < this.limits.dc[0] || ch.offset > this.limits.dc[1]) v.push(`G${gen.id} offset`);
    }
    if(v.length){ this.violations.push(...v); gen.channels.forEach(c=>c.output=false); return {ok:false, reason:v.join('; ')}; }
    this.lastOk=Date.now();
    return {ok:true};
  }
  emergencyStop(bus){
    this.estop=true;
    if(bus) bus.list().forEach(g=>g.channels.forEach(c=>c.output=false));
  }
  reset(){ this.estop=false; this.violations=[]; }
  watchdogCheck(){ return (Date.now()-this.lastOk) < this.watchdogMs; }
}
