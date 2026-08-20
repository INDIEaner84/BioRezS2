/**
 * API Mock — P34
 * GET /api/generators, POST /api/generators/:id/config etc.
 * WebSocket Live via EventTarget
 */
export class MockAPI extends EventTarget {
  constructor(bus){
    super(); this.bus=bus; this.wsConnected=true;
  }
  getGenerators(){ return this.bus.list().map(g=>g.toJSON()); }
  getGenerator(id){ return this.bus.get(id)?.toJSON(); }
  postConfig(id, patch){
    const g=this.bus.get(id); if(!g) throw new Error('not found');
    Object.assign(g, patch);
    this.dispatchEvent(new CustomEvent('update', {detail:{id, patch}}));
    return {ok:true, provenance:{ts:new Date().toISOString(), generator:id, patch}};
  }
  start(id){ const g=this.bus.get(id); if(g) g.channels.forEach(c=>c.output=true); return {ok:true}; }
  stop(id){ const g=this.bus.get(id); if(g) g.channels.forEach(c=>c.output=false); return {ok:true}; }
  // WebSocket mock
  stream(cb){ setInterval(()=> cb({t:Date.now(), samples:Array.from({length:256},()=>Math.random()*2-1)}), 32); }
}
