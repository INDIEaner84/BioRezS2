/**
 * Storage & Limits — P14 Production Hardening, long-running experiments
 */
export class StorageManager {
  constructor({maxVersions=100, maxExperiments=50, maxSamples=48000*60*10}={}){
    this.maxVersions=maxVersions; this.maxExperiments=maxExperiments; this.maxSamples=maxSamples;
    this.db=new Map(); // in-mem, später IndexedDB
  }
  saveExperiment(exp){
    if(this.db.size >= this.maxExperiments){
      const oldest=[...this.db.keys()][0];
      this.db.delete(oldest);
    }
    // version limit per experiment
    if(exp.history && exp.history.length > this.maxVersions){
      exp.history = exp.history.slice(-this.maxVersions);
    }
    this.db.set(exp.id, exp);
    return {ok:true, stored:exp.id, remaining:this.maxExperiments - this.db.size};
  }
  checkLimits(samplesLength){
    if(samplesLength > this.maxSamples) return {ok:false, reason:`storage limit ${this.maxSamples} samples exceeded`};
    return {ok:true};
  }
  exportAll(){ return JSON.stringify([...this.db.values()], null, 2); }
}
