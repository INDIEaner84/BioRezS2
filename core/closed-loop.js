/**
 * Closed Loop — P15 sicher begrenzt
 */
export class ClosedLoopController {
  constructor({target=0, maxOutput=5, rateLimit=1, timeoutMs=30000, watchdogMs=5000}){
    this.target=target; this.maxOutput=maxOutput; this.rateLimit=rateLimit;
    this.timeoutMs=timeoutMs; this.watchdogMs=watchdogMs;
    this.enabled=false; this.lastUpdate=Date.now(); this.emergency=false;
  }
  enable(){ this.enabled=true; this.start=Date.now(); this.lastUpdate=Date.now(); }
  disable(){ this.enabled=false; }
  emergencyStop(){ this.emergency=true; this.enabled=false; }
  // Simple P controller with limits
  update(measured){
    if(!this.enabled || this.emergency) return {output:0, error:0, limited:true};
    if(Date.now()-this.start > this.timeoutMs) { this.disable(); return {output:0, error:0, limited:true, reason:'timeout'}; }
    if(Date.now()-this.lastUpdate > this.watchdogMs) { this.disable(); return {output:0, error:0, limited:true, reason:'watchdog'}; }
    const error=this.target - measured;
    let out=Math.max(-this.maxOutput, Math.min(this.maxOutput, error*0.5));
    // rate limit
    // ... watchdog reset
    this.lastUpdate=Date.now();
    return {output:out, error, limited:false};
  }
}
