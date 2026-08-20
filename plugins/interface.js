/**
 * Plugin Interface — P27
 */
export class PluginInterface {
  constructor(type, id){ this.type=type; this.id=id; this.enabled=true; }
  async init(){}
  async shutdown(){}
}
export class GeneratorPlugin extends PluginInterface {
  constructor(id, opts={}){ super('generator', id); this.opts=opts; }
  // must implement: open(), close(), write(), read(), capabilities()
}
export class SensorPlugin extends PluginInterface {
  constructor(id, opts={}){ super('sensor', id); this.opts=opts; this.sampleRate=48000; }
  // must implement: readSamples(n), calibrate(), getUncertainty()
  async readSamples(n){ return Array.from({length:n},()=> (Math.random()*2-1)*0.1); }
}
export class MeasurementPlugin extends PluginInterface {
  constructor(id){ super('measurement', id); }
}
export class AnalysisPlugin extends PluginInterface {
  constructor(id){ super('analysis', id); }
}
export class ExportPlugin extends PluginInterface {
  constructor(id){ super('export', id); }
  async export(data, format){ return data; }
}
