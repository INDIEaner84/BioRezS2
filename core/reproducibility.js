/**
 * Reproduzierbarkeit — P21
 * Jeder Lauf erzeugt vollständigen Record
 */
export function createReproRecord({experiment, bus, clock, env={}}){
  return {
    timestamp: new Date().toISOString(),
    softwareVersion: experiment.metadata?.software || 'BioRezS2 v2.1',
    hardware: bus.list().map(g=>({id:g.id, model:g.model, firmware:'1.0', calibration:g.calibration_state})),
    generatorSettings: bus.list().map(g=>g.toJSON()),
    signalDefinitions: experiment.signals,
    calibration: experiment.calibration,
    sensorConfiguration: {adc:'48k', window:'Hann', fft:2048},
    samplingConfiguration: {rate:48000, bits:16},
    environmentalMetadata: {temp:22, humidity:45, ...env},
    operator: experiment.metadata?.operator || 'admin',
    randomSeeds: {seed: Math.floor(Math.random()*1e9)},
    analysisConfiguration: experiment.analysis,
    clock: clock.tick(),
    results: experiment.results
  };
}
