import { fftReal, applyWindow } from '../analysis/fft-real.js';
import { uncertaintyFor, errorBar } from '../analysis/uncertainty.js';
function assert(c,m){ if(!c) throw new Error(m); }
let p=0,f=0; function test(n,fn){ try{fn(); console.log(`✓ ${n}`); p++;} catch(e){ console.error(`✗ ${n}: ${e.message}`); f++; } }
test('FFT 2048 sine 100Hz peak', ()=>{
  const N=2048, sr=48000, freq=100;
  const samples=Array.from({length:N},(_,i)=> Math.sin(2*Math.PI*freq*i/sr));
  const win=applyWindow(samples,'hann');
  const {mags,freqs}=fftReal(win);
  let maxI=0, maxV=-999; for(let i=1;i<N/2;i++) if(mags[i]>maxV){maxV=mags[i]; maxI=i;}
  const peakFreq=freqs[maxI];
  assert(Math.abs(peakFreq-freq)< 30, `peak ${peakFreq} vs ${freq}`);
});
test('Uncertainty calibrated high SNR', ()=>{
  const u=uncertaintyFor({type:'calibrated', snrDb:40});
  assert(u.confidence>0.9, 'high confidence');
  const e=errorBar(10, u.confidence);
  assert(e.lower<10 && e.upper>10, 'error bar');
});
console.log(`\n${p} passed, ${f} failed`);
if(f) process.exit(1);
