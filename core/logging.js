/**
 * Logging + Audit Trail — P32 + P33
 * Non-blocking, ring buffer
 */
export class Logger {
  constructor(max=1000){ this.buffer=[]; this.max=max; }
  log({user='admin', generator, command, oldValue, newValue, result, error}){
    const entry={timestamp:new Date().toISOString(), user, generator, command, oldValue, newValue, result, error};
    this.buffer.push(entry);
    if(this.buffer.length>this.max) this.buffer.shift();
    // non-blocking: queueMicrotask
    queueMicrotask(()=>{});
    return entry;
  }
  tail(n=20){ return this.buffer.slice(-n); }
}
export class AuditTrail extends Logger {
  // specialized for experiment changes
}
