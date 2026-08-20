/**
 * System Health — P31
 */
export class SystemHealth {
  constructor(){
    this.metrics={cpu:42, ram:68, gpu:31, latencyMs:4.2, temp:41.2, dropped:0, buffer:68};
  }
  sample(){
    this.metrics.cpu = 35 + Math.random()*20;
    this.metrics.ram = 60 + Math.random()*15;
    this.metrics.gpu = 25 + Math.random()*15;
    this.metrics.latencyMs = 3 + Math.random()*2;
    this.metrics.temp = 40 + Math.random()*3;
    this.metrics.dropped = Math.random()<0.98?0:1;
    return {...this.metrics, ts:new Date().toISOString()};
  }
}
