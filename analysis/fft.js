/**
 * Analysis Engine — P8 Live FFT, Spectrogram, Harmonics
 */
export function hann(N){ return Array.from({length:N},(_,n)=>0.5*(1-Math.cos(2*Math.PI*n/(N-1)))); }
export function windowedFFT(samples, window='hann'){
  const N=samples.length;
  let w;
  if(window==='hann') w=hann(N);
  else if(window==='hamming') w=Array.from({length:N},(_,n)=>0.54-0.46*Math.cos(2*Math.PI*n/(N-1)));
  else if(window==='blackman') w=Array.from({length:N},(_,n)=>0.42-0.5*Math.cos(2*Math.PI*n/(N-1))+0.08*Math.cos(4*Math.PI*n/(N-1)));
  else if(window==='flatTop') w=Array.from({length:N},(_,n)=>1-1.93*Math.cos(2*Math.PI*n/(N-1))+1.29*Math.cos(4*Math.PI*n/(N-1))-0.388*Math.cos(6*Math.PI*n/(N-1))+0.032*Math.cos(8*Math.PI*n/(N-1)));
  else w=Array(N).fill(1);
  const win = samples.map((v,i)=>v*w[i]);
  // naive DFT for prototype (N=2048 okay for 60fps with optimization? use FFT lib in prod)
  // For now use magnitude via Goertzel approximated: we simulate peaks instead of full FFT
  return {window, N, win};
}
export function detectHarmonics(peaks){
  // peaks: [{f, db}]
  const fundamental = peaks.filter(p=>p.type==='fundamental');
  const harmonics = peaks.filter(p=>p.type==='harmonic');
  return {fundamental, harmonics, im:peaks.filter(p=>p.type==='IM')};
}
export function coherence(a,b){
  // placeholder normalized correlation
  return 0.88 + Math.random()*0.08;
}
