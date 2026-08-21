export function calcStats(samples){
  const n=samples.length;
  const mean = samples.reduce((a,b)=>a+b,0)/n;
  const variance = samples.reduce((a,b)=>a+(b-mean)**2,0)/n;
  const std = Math.sqrt(variance);
  const rms = Math.sqrt(samples.reduce((a,b)=>a+b*b,0)/n);
  const peak = Math.max(...samples.map(Math.abs));
  const pp = Math.max(...samples)-Math.min(...samples);
  const crest = peak / (rms||1);
  const sum3 = samples.reduce((a,b)=>a+Math.pow((b-mean)/ (std||1),3),0)/n;
  const sum4 = samples.reduce((a,b)=>a+Math.pow((b-mean)/ (std||1),4),0)/n;
  return {mean, variance, std, rms, peak, pp, crest, kurtosis:sum4, skewness:sum3};
}
export function thd(fundamentalDb, harmonicDbs){
  const fund = Math.pow(10, fundamentalDb/20);
  const harm = Math.sqrt(harmonicDbs.reduce((a,db)=>a+Math.pow(10, db/10),0));
  return (harm/fund)*100;
}
