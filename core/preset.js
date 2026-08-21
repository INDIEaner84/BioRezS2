/**
 * Preset / Program Import — P19 Preset-System
 * Unterstützt:
 *  - Spooky2 Preset TXT (List4=Frequenzprogramme, List2=Beschreibung, key="value")
 *  - Einfache Frequenzliste: "10, 17, 23, 40" oder "10=180, 20=180"
 *  - JSON Experiment
 * Liefert: {programs:[{code, description, duration, steps:[{f1,f2,duration,waveform}]}], raw}
 */
export function parsePresetText(text){
  const entries=new Map();
  // Spooky2 TXT: "Key"="Value"  (multiline quotes)
  const lines=text.split(/\r?\n/);
  let buf='', inQuote=false;
  for(let raw of lines){
    if(!raw.trim()) continue;
    if(raw.trim().startsWith('"') && !inQuote){
      buf=raw;
      if((raw.match(/"/g)||[]).length %2===1) { inQuote=true; continue; }
    } else if(inQuote){
      buf+='\n'+raw;
      if(raw.trim().endsWith('"')) inQuote=false; else continue;
    } else { buf=raw; }
    const m=buf.match(/^"([^"]+)"\s*=\s*"(.*)"\s*$/s);
    if(m){ entries.set(m[1], m[2]); }
    else {
      // Fallback: simple list without keys -> treat whole file as List4
      entries.set('__raw', text);
      break;
    }
    buf='';
  }
  // Extract programs
  const programs=[];
  const codes=[...entries.entries()].filter(([k])=> k.startsWith('List4')).map(([,v])=>v);
  const descs=[...entries.entries()].filter(([k])=> k.startsWith('List2')).map(([,v])=>v);
  if(codes.length){
    codes.forEach((code,i)=>{
      const desc=descs[i]||`Program ${i+1}`;
      programs.push({code, description:desc, steps:parseProgramCode(code)});
    });
  } else if(entries.has('__raw')){
    // Simple frequency list fallback
    const raw=entries.get('__raw');
    const steps=raw.split(/[,\n;]+/).map(s=>s.trim()).filter(Boolean).map(tok=>{
      // "10=180" or "10-20=180" or "10"
      const m=tok.match(/^([\d.]+)(?:-([\d.]+))?(?:\s*=\s*([\d.]+))?/);
      if(!m) return null;
      const f1=parseFloat(m[1]), f2=m[2]?parseFloat(m[2]):f1, dur=m[3]?parseFloat(m[3]):180;
      return {f1,f2,duration:dur, waveform:0};
    }).filter(Boolean);
    programs.push({code:raw.slice(0,200), description:'Imported List', steps});
  }
  const totalDuration=programs.reduce((a,p)=>a+p.steps.reduce((s,st)=>s+st.duration,0),0);
  return {entries, programs, totalDuration, raw:text};
}

export function parseProgramCode(code){
  // Code like "10=180,20=180,10-20=180" with optional A,W,L etc.
  const steps=[];
  let s=code, i=0;
  while(i<s.length){
    while(i<s.length && s[i]===' ') i++;
    if(i>=s.length) break;
    // parse f1
    let f1='', f2=null, dur=180, amp=null, wf=0;
    // read until = , - or end
    let num=''; while(i<s.length && /[\d.]/.test(s[i])){ num+=s[i++]; }
    if(num) f1=parseFloat(num);
    else { if(s[i]==='A'){ i++; let n=''; while(i<s.length && /[\d.]/.test(s[i])) n+=s[i++]; amp=parseFloat(n); continue; }
           if(s[i]==='W'){ i++; let n=''; while(i<s.length && /[\d.]/.test(s[i])) n+=s[i++]; wf=parseInt(n); continue; }
           i++; continue;
    }
    if(i<s.length && s[i]==='-'){ i++; let n=''; while(i<s.length && /[\d.]/.test(s[i])) n+=s[i++]; f2=parseFloat(n); }
    if(i<s.length && s[i]==='='){ i++; let n=''; while(i<s.length && /[\d.]/.test(s[i])) n+=s[i++]; dur=parseFloat(n); }
    if(f2===null) f2=f1;
    steps.push({f1,f2,duration:dur, amplitude:amp, waveform:wf});
    if(i<s.length && s[i]===',') i++;
  }
  return steps;
}

export function presetToExperiment(parsed, {name='Imported Preset'}={}){
  const exp={
    id:`EXP-${new Date().toISOString().slice(0,10)}-${Math.random().toString(36).slice(2,6).toUpperCase()}`,
    version:1,
    metadata:{created:new Date().toISOString(), software:'BioRezS2 v2.1', source:'Spooky2 Preset', name},
    programs: parsed.programs,
    totalDuration: parsed.totalDuration,
    signals: parsed.programs.flatMap(p=> p.steps.map(s=> ({freq:s.f1, freq2:s.f2, duration:s.duration, wave:['sine','square','sawtooth','custom'][s.waveform]||'sine'}))),
  };
  return exp;
}
