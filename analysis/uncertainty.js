/**
 * Uncertainty Modell — P24
 */
export function uncertaintyFor({type='estimated', calibration='calibrated', snrDb=38}){
  const map={
    calibrated: {confidence:0.95, label:'CALIBRATED', color:'#00f0ff'},
    estimated: {confidence:0.82, label:'ESTIMATED', color:'#ffc857'},
    simulated: {confidence:0.65, label:'SIMULATED', color:'#ff2e93'},
    derived: {confidence:0.75, label:'DERIVED', color:'#7a00ff'},
    measurement: {confidence:0.92, label:'MEASUREMENT', color:'#00ff9d'}
  };
  const base=map[type]||map.estimated;
  const adj = Math.min(0.98, base.confidence + (snrDb-30)*0.005);
  return {...base, confidence:adj, snrDb, calibration};
}
export function errorBar(value, confidence){
  const err = value*(1-confidence)*0.5;
  return {value, lower:value-err, upper:value+err, confidence};
}
