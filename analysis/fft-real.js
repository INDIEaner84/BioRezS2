/**
 * Real FFT — P8 Live FFT mit echtem DFT (Cooley-Tukey iterativ)
 * Ersetzt Simulation durch echte Analyse, 48kHz, 2048 Punkte
 */
export function fftReal(samples){
  const N=samples.length;
  // Bit reversal
  let j=0;
  const re=[...samples], im=new Array(N).fill(0);
  for(let i=1;i<N;i++){
    let bit=N>>1;
    for(; j&bit; bit>>=1) j^=bit;
    j^=bit;
    if(i<j){ [re[i],re[j]]=[re[j],re[i]]; [im[i],im[j]]=[im[j],im[i]]; }
  }
  for(let len=2; len<=N; len<<=1){
    const ang=2*Math.PI/len * -1;
    const wlenRe=Math.cos(ang), wlenIm=Math.sin(ang);
    for(let i=0;i<N;i+=len){
      let wRe=1,wIm=0;
      for(let k=0;k<len/2;k++){
        const uRe=re[i+k], uIm=im[i+k];
        const vRe=re[i+k+len/2]*wRe - im[i+k+len/2]*wIm;
        const vIm=re[i+k+len/2]*wIm + im[i+k+len/2]*wRe;
        re[i+k]=uRe+vRe; im[i+k]=uIm+vIm;
        re[i+k+len/2]=uRe-vRe; im[i+k+len/2]=uIm-vIm;
        const tRe=wRe*wlenRe - wIm*wlenIm;
        const tIm=wRe*wlenIm + wIm*wlenRe;
        wRe=tRe; wIm=tIm;
      }
    }
  }
  // magnitude in dBFS
  const mags=re.map((r,i)=> 20*Math.log10(Math.hypot(r,im[i])/N + 1e-12));
  const freqs=re.map((_,i)=> i*48000/N);
  return {re,im,mags,freqs};
}
export function applyWindow(samples, type='hann'){
  const N=samples.length;
  const win = type==='hann'? samples.map((v,i)=> v*0.5*(1-Math.cos(2*Math.PI*i/(N-1)))) 
    : type==='hamming'? samples.map((v,i)=> v*(0.54-0.46*Math.cos(2*Math.PI*i/(N-1))))
    : samples;
  return win;
}
