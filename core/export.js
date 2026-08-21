/**
 * Data Export — P22 + Provenance P23 + Uncertainty P24
 */
export function toCSV(header, rows){
  return [header.join(','), ...rows.map(r=>r.join(','))].join('\n');
}
export function toJSON(data){ return JSON.stringify(data, null, 2); }
export function toWAVHeader(sampleRate=48000, bits=16, channels=1, samples=0){
  return `WAV ${sampleRate}Hz ${bits}bit ${channels}ch ${samples} samples (header stub)`;
}
export function provenanceRecord(exp, measurement, analysis){
  return {
    result: analysis,
    analysis: {id: analysis?.id, config: analysis?.config},
    measurement: {sensor: measurement?.sensor, rate: measurement?.rate},
    signal: exp.signals,
    generator: exp.generators,
    experiment: exp.id,
    configuration: exp.snapshot(),
    uncertainty: {type: 'estimated', confidence: 0.92, noiseFloor: '-92 dB'},
    timestamp: new Date().toISOString()
  };
}
