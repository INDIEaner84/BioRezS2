/**
 * Plugin Security — P27
 * Sandboxing + Allowlist + Capability Negotiation
 */
export class PluginSecurity {
  constructor({allowlist=['virtual','adc','csv','json'], maxPlugins=20}={}){
    this.allowlist=new Set(allowlist);
    this.maxPlugins=maxPlugins;
    this.loaded=new Map();
  }
  canLoad(plugin){
    if(this.loaded.size >= this.maxPlugins) return {ok:false, reason:'max plugins exceeded'};
    if(!this.allowlist.has(plugin.type) && !this.allowlist.has(plugin.id)) return {ok:false, reason:`plugin ${plugin.id} not in allowlist`};
    return {ok:true};
  }
  load(plugin){
    const chk=this.canLoad(plugin);
    if(!chk.ok) throw new Error(chk.reason);
    this.loaded.set(plugin.id, plugin);
    return {ok:true, id:plugin.id};
  }
  // capability negotiation
  negotiate(requested, available){
    const ok=requested.filter(c=> available.includes(c));
    const missing=requested.filter(c=> !available.includes(c));
    return {ok, missing, granted: missing.length===0};
  }
}
