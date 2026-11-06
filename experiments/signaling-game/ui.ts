import { defineUI } from '../../ui/index.ts';
import { model } from './model.ts';
const binding=defineUI(model,{
 setup:[{field:'seed'},{field:'numberOfStates',label:'States'},{field:'numberOfSignals',label:'Signals'}],
 live:[{field:'printProbabilities',label:'Print probabilities',value:s=>s.parameters.printProbabilities,set:(m,v)=>m.setParameters({printProbabilities:Boolean(v)})}],
 source:{url:'https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Philosophy/Signaling%20Game.nlogox',label:'Original NetLogo model · Wilensky · CC BY-NC-SA 3.0'},
 complete:s=>s.stopped,actions:[{label:'Print probabilities',run:m=>{m.printProbabilities();}}],
 monitors:[{label:'Tick',value:s=>s.tick},{label:'Probability of success',value:s=>(100*s.probabilityOfSuccess).toFixed(2)+'%'},{label:'Correct',value:s=>s.timesCorrect},{label:'Wrong',value:s=>s.timesWrong},{label:'Success rate',value:s=>s.successRate===null?'—':(100*s.successRate).toFixed(2)+'%'}],
 views:[
 {type:'network',label:'Current signal',nodes:s=>[
 ...Array.from({length:s.parameters.numberOfStates},(_,i)=>({id:`state-${i}`,label:String.fromCharCode(65+i),color:s.lastRound?.state===i?'#56b9e9':'#267194',size:22,position:{x:i*75,y:0}})),
 ...Array.from({length:s.parameters.numberOfSignals},(_,i)=>({id:`signal-${i}`,label:String(i),color:s.lastRound?.signal===i?'#e658c8':'#8e3a7f',size:22,position:{x:i*75,y:160}})),
 {id:'sender',label:'Sender',color:'#c29d2e',position:{x:-50,y:80}},{id:'receiver',label:'Receiver',color:'#c29d2e',position:{x:200,y:80}}],
 edges:s=>s.lastRound?[
 {id:'observation-state',from:`state-${s.lastRound.state}`,to:'sender',directed:true},
 {id:'chosen-signal',from:'sender',to:`signal-${s.lastRound.signal}`,directed:true},
 {id:'observation-signal',from:`signal-${s.lastRound.signal}`,to:'receiver',directed:true},
 {id:'guessed-state',from:'receiver',to:`state-${s.lastRound.guess}`,directed:true,color:s.lastRound.correct?'#409b55':'#d83838'},]:[]},
 {type:'line',label:'Probability of success (%)',series:s=>[{label:'Probability',points:s.history.map(p=>({x:p.tick,y:100*p.probabilityOfSuccess}))}]},
 {type:'table',label:'Sender probabilities (%)',rows:s=>s.senderProbabilities.map((row,i)=>Object.fromEntries([['State',String.fromCharCode(65+i)],...row.map((v,j)=>[`Signal ${j}`,(100*v).toFixed(2)])]))},
 {type:'table',label:'Receiver probabilities (%)',rows:s=>s.receiverProbabilities.map((row,i)=>Object.fromEntries([['Signal',String(i)],...row.map((v,j)=>[`State ${String.fromCharCode(65+j)}`,(100*v).toFixed(2)])]))},
 {type:'table',label:'Printed output',rows:s=>s.output?s.output.split('\n').map(line=>({line})):[]},
 ]
});

export { model };
export const sourceMarker = 'selected-social-b02:signaling-game:399be72f527afb3d0e9ba27969d1a25e8a94364358aca2e707f0b01f24009bf5';

/** Public headless definition and provenance remain inspectable in the loaded binding. */
export const ui = { ...binding, model, sourceMarker };
