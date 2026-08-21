import { parsePresetText, presetToExperiment, parseProgramCode } from '../core/preset.js';
function assert(c,m){ if(!c) throw new Error(m); }
let p=0,f=0; function test(n,fn){ try{fn(); console.log(`✓ ${n}`); p++;} catch(e){ console.error(`✗ ${n}: ${e.message} ${e.stack}`); f++; } }
test('Simple list', ()=>{
  const pr=parsePresetText('10, 17, 23');
  assert(pr.programs.length===1, '1 program');
  assert(pr.programs[0].steps.length===3, '3 steps');
});
test('Program code with duration', ()=>{
  const steps=parseProgramCode('10=180,20=300,10-20=60');
  assert(steps[0].f1===10 && steps[0].duration===180, 'first');
  assert(steps[2].f1===10 && steps[2].f2===20, 'sweep');
});
test('Spooky2 TXT List4', ()=>{
  const txt='"List4"="10=180,20=180"\n"List2"="Test"\n';
  const pr=parsePresetText(txt);
  assert(pr.programs[0].code.includes('10=180'), 'code');
  const exp=presetToExperiment(pr);
  assert(exp.signals.length===2, 'signals');
});
console.log(`\n${p} passed, ${f} failed`);
if(f) process.exit(1);
