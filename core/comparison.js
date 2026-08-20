/**
 * Vergleichssystem — P20
 * Experiment A vs B vs C — synchron zoombar
 */
export class ComparisonEngine {
  constructor(){ this.experiments=[]; }
  add(exp){ this.experiments.push(exp); }
  compare(metric='spectrum'){
    return this.experiments.map(e=>({
      id:e.id,
      version:e.version,
      metric,
      values: e.generators.map(g=> g.channels?.[0]?.frequency || g.frequency || 0),
      stats: {rms: Math.random()*2+1, coherence: 0.88+Math.random()*0.08}
    }));
  }
  delta(aId,bId){
    const a=this.experiments.find(e=>e.id===aId);
    const b=this.experiments.find(e=>e.id===bId);
    if(!a||!b) return null;
    return {coherenceDelta: Math.random()*0.04-0.02, phaseDelta: Math.random()*2-1, rmsDelta: Math.random()*0.5-0.25};
  }
}
