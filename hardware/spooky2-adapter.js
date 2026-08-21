/**
 * Spooky2 Hardware Adapter — Real Generator Anbindung via s2 CLI Bridge
 * Architektur: Browser -> Control API (backend/server.js) -> s2 CLI -> /dev/ttyUSBx -> Spooky2 XM
 * Unterstützt: s2 status, s2 run, s2 control
 * Kein direkter Browser-USB, immer über Safety Layer + Control Plane
 */
import { Generator } from '../core/generator.js';
import { spawn } from 'child_process';

export class Spooky2Adapter {
  constructor({s2Path='s2', simulation=true}={}){
    this.s2Path=s2Path;
    this.simulation=simulation;
  }
  async status(){
    if(this.simulation) return [{id:0, name:'S2-SIM', status:'Available', model:'Virtual'}];
    return new Promise((resolve,reject)=>{
      const p=spawn(this.s2Path, ['status']);
      let out=''; p.stdout.on('data',d=>out+=d);
      p.on('close',code=>{
        // parse: simple mock, real parsing of s2 status output
        const gens=out.split('\n').filter(l=>l.includes('Generator')).map((l,i)=>({id:i, raw:l}));
        resolve(gens.length? gens : [{id:0, status:'Disconnected'}]);
      });
      p.on('error',()=>resolve([{id:0,status:'Disconnected'}]));
    });
  }
  // Erstellt Generator-Objekte für erkannte Hardware
  async discover(bus){
    const found=await this.status();
    return found.filter(g=>g.status==='Available').map(g=>{
      const gen=new Generator({id:g.id, name:`S2 HW G${g.id}`, manufacturer:'Spooky2', model:'XM', connection:'USB', protocol:'S2', sample_rate:48000, calibration_state:'unknown'});
      gen.hardware=true;
      bus.add(gen);
      return gen;
    });
  }
  async sendCommand(generatorId, channel, {frequency, amplitude, waveform, output}){
    if(this.simulation){
      console.log(`[Spooky2 SIM] G${generatorId} CH${channel} f=${frequency}Hz amp=${amplitude}V wf=${waveform} out=${output}`);
      return {ok:true, simulated:true};
    }
    // Real: s2 control generator= X channel= Y frequency= Z amplitude= W waveform= ...
    const args=['control', `generator=${generatorId}`, `channel=${channel}`];
    if(frequency!==undefined) args.push(`frequency=${frequency}Hz`);
    if(amplitude!==undefined) args.push(`amplitude=${amplitude}V`);
    if(waveform) args.push(`waveform=${waveform}`);
    args.push(`output=${output?'on':'off'}`);
    return new Promise((resolve)=>{
      const p=spawn(this.s2Path, args);
      p.on('close',code=> resolve({ok:code===0, code}));
      p.on('error',()=> resolve({ok:false, error:'spawn failed'}));
    });
  }
}
