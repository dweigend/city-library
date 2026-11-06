/** Source: Wilensky (2016), CC BY-NC-SA 3.0; exact source and attribution beside this file. */
import { Random, World, run } from 'city-library';
import type { Definition, Inputs } from '../definition.ts';
import { parameters, stepCount } from '../parameters.ts';
export interface SignalingParameters {seed:number;numberOfStates:number;numberOfSignals:number;printProbabilities:boolean}
export const inputs:Inputs<SignalingParameters>={seed:{kind:'number',default:1,min:-2147483648,max:4294967295,integer:true},numberOfStates:{kind:'number',default:2,min:2,max:8,integer:true},numberOfSignals:{kind:'number',default:2,min:2,max:8,integer:true},printProbabilities:{kind:'boolean',default:true}};
export function create(options:Partial<SignalingParameters>={}){
 let settings=parameters(inputs,options);const random=Random.add({seed:settings.seed}),world=World.add({random});
 const senderUrns=Array.from({length:settings.numberOfStates},()=>Array<number>(settings.numberOfSignals).fill(1));
 const receiverUrns=Array.from({length:settings.numberOfSignals},()=>Array<number>(settings.numberOfStates).fill(1));
 let timesCorrect=0,stopped=false,lastRound:Readonly<{state:number;signal:number;guess:number;correct:boolean}>|null=null,output='';
 const history:Readonly<{tick:number;probabilityOfSuccess:number;timesCorrect:number;timesWrong:number}>[]=[];
 // Counts are the model's canonical urn state, not a second agent/graph population.
 function probabilities(urns:readonly (readonly number[])[]){return urns.map(row=>{const n=row.reduce((a,b)=>a+b,0);return row.map(v=>v/n);});}
 function probability(){const send=probabilities(senderUrns),receive=probabilities(receiverUrns);return send.reduce((total,row,s)=>total+row.reduce((sum,v,g)=>sum+v*receive[g]![s]!,0),0)/settings.numberOfStates;}
 function pick(row:readonly number[]){let choice=Math.floor(random.number()*row.reduce((a,b)=>a+b,0));for(let i=0;i<row.length;i++){choice-=row[i]!;if(choice<0)return i;}throw new Error('Urn selection invariant.');}
 function print(){
  const format=(values:readonly (string|number)[])=>values.map(v=>String(typeof v==='number'?Math.floor(v+0.5):v).padStart(4)).join('  ');
  const table=(rowLabels:readonly string[],columnLabels:readonly string[],rows:number[][])=>[
   format(['',...columnLabels]),format(['',...columnLabels.map(()=>'---')]),
   ...probabilities(rows).map((row,i)=>format([rowLabels[i]!+' :',...row.map(p=>p*100)]))
  ].join('\n');
  const states=Array.from({length:settings.numberOfStates},(_,i)=>String.fromCharCode(65+i)),signals=Array.from({length:settings.numberOfSignals},(_,i)=>String(i));
  output='Sender probabilities:\n'+table(states,signals,senderUrns)+'\n\nReceiver probabilities:\n'+table(signals,states,receiverUrns);return output;
 }

 function record(){history.push(Object.freeze({tick:world.tick.value,probabilityOfSuccess:probability(),timesCorrect,timesWrong:world.tick.value-timesCorrect}));if(history.length>1001)history.splice(1,1);}
 record();
 return {
  advance(count=1){stepCount(count);if(count===0)return;stopped=false;for(let i=0;i<count;i++){
   if(probability()>0.99){stopped=true;break;}
   run(world,()=>{const state=Math.floor(random.number()*settings.numberOfStates),signal=pick(senderUrns[state]!),guess=pick(receiverUrns[signal]!);const correct=guess===state;lastRound=Object.freeze({state,signal,guess,correct});
    if(correct){senderUrns[state]![signal]=senderUrns[state]![signal]!+1;receiverUrns[signal]![state]=receiverUrns[signal]![state]!+1;timesCorrect++;}
    if(settings.printProbabilities)print();
   });record();
  }},
  printProbabilities(){return print();},
  setParameters(p:Partial<Pick<SignalingParameters,'printProbabilities'>>){parameters(inputs,p);if(Reflect.ownKeys(p).some(k=>k!=='printProbabilities'))throw new TypeError('Only printing is live.');settings=parameters(inputs,{...settings,...p});},
  read(){return Object.freeze({tick:world.tick.value,parameters:settings,stopped,probabilityOfSuccess:probability(),timesCorrect,timesWrong:world.tick.value-timesCorrect,successRate:world.tick.value===0?null:timesCorrect/world.tick.value,lastRound,output,
   senderUrns:Object.freeze(senderUrns.map(row=>Object.freeze([...row]))),receiverUrns:Object.freeze(receiverUrns.map(row=>Object.freeze([...row]))),senderProbabilities:Object.freeze(probabilities(senderUrns).map(row=>Object.freeze(row))),receiverProbabilities:Object.freeze(probabilities(receiverUrns).map(row=>Object.freeze(row))),history:Object.freeze([...history]),randomState:random.state});}
 };
}
export const model={title:'Signaling Game',description:'Two-sided urn reinforcement learns shared signals. Wilensky (2016), CC BY-NC-SA 3.0.',inputs,create} satisfies Definition<SignalingParameters,ReturnType<typeof create>>;
