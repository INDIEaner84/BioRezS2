/**
 * Generator Abstraction — P3 Hardware Abstraction
 * Unified Interface für alle Generator-Typen
 */
export const Waveforms = ['sine','square','triangle','sawtooth','pulse','arbitrary','dc','noise','sweep'];
export const CalibrationStates = ['uncalibrated','calibrated','expired','unknown'];

export class Generator {
  constructor({id, name, manufacturer='S2', model='Virtual', connection='virtual', protocol='sim', capabilities={}, sample_rate=48000, clock_source='internal', output_channels=2, amplitude_range=[0,20], frequency_range=[0.01, 1e6], phase_resolution=0.1, waveform_types=Waveforms, modulation_capabilities=['AM','FM','PM'], calibration_state='calibrated', safety_limits={amp:20, freq:[0.01,1e6], duty:[1,99]}}){
    this.id=id; this.name=name; this.manufacturer=manufacturer; this.model=model;
    this.connection=connection; this.protocol=protocol; this.capabilities=capabilities;
    this.sample_rate=sample_rate; this.clock_source=clock_source; this.output_channels=output_channels;
    this.amplitude_range=amplitude_range; this.frequency_range=frequency_range;
    this.phase_resolution=phase_resolution; this.waveform_types=waveform_types;
    this.modulation_capabilities=modulation_capabilities;
    this.calibration_state=calibration_state; this.safety_limits=safety_limits;
    // runtime state per channel
    this.channels = Array.from({length:output_channels},(_,i)=>({
      channel:i, output:false, frequency:10*(i+1), amplitude:5, waveform:'sine', phase:0, duty:50, offset:0
    }));
    this.sync=false; this.phaseLock=false;
  }
  setChannel(ch, patch){
    const c=this.channels[ch]; if(!c) throw new Error('channel not found');
    Object.assign(c, patch);
    return c;
  }
  toJSON(){ return {id:this.id,name:this.name,manufacturer:this.manufacturer,model:this.model,connection:this.connection,protocol:this.protocol,capabilities:this.capabilities,sample_rate:this.sample_rate,clock_source:this.clock_source,output_channels:this.output_channels,amplitude_range:this.amplitude_range,frequency_range:this.frequency_range,phase_resolution:this.phase_resolution,waveform_types:this.waveform_types,modulation_capabilities:this.modulation_capabilities,calibration_state:this.calibration_state,safety_limits:this.safety_limits,channels:this.channels}; }
}

export class GeneratorBus {
  constructor(){ this.generators=new Map(); this.groups=new Map(); this.listeners=[]; }
  add(gen){ this.generators.set(gen.id, gen); this.emit('add',gen); return gen; }
  remove(id){ const g=this.generators.get(id); this.generators.delete(id); this.emit('remove',g); }
  get(id){ return this.generators.get(id); }
  list(){ return [...this.generators.values()]; }
  createGroup(name, ids){ this.groups.set(name, ids); this.emit('group', {name,ids}); }
  on(cb){ this.listeners.push(cb); }
  emit(type, data){ this.listeners.forEach(cb=>cb(type,data)); }
}
