import { defineUI } from '../../ui/index.ts';
import { model } from './model.ts';
const binding=defineUI(model,{
 complete:s=>Boolean(s.diagnostic),
 setup:[{field:'seed'},{field:'number'},{field:'memory'},{field:'strategiesPerAgent',label:'Strategies per agent'}],
 live:[{field:'colorBy',label:'Color by',value:s=>s.parameters.colorBy,set:(m,v)=>m.setParameters({colorBy:String(v) as 'choice'|'success'})}],
 source:{url:'https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Minority%20Game.nlogox',label:'Original NetLogo model · Wilensky · CC BY-NC-SA 3.0'},
 monitors:[{label:'Tick',value:s=>s.tick},{label:'History',value:s=>s.fullHistory.join('')},{label:'Minority',value:s=>s.minority},{label:'Average score',value:s=>s.avgScore.toFixed(3)},{label:'Movement',value:s=>s.diagnostic??'Active'}],
 views:[
  {type:'spatial',label:'Players',data:s=>({width:s.width,height:s.height,agents:s.agents.map(a=>({...a,heading:90,size:5,shape:'triangle' as const,color:s.parameters.colorBy==='choice'?(a.choice===0?'#e13b3b':'#3675db'):a.score>s.avgScore+(s.stdevScore??0)?'#e13b3b':a.score<s.avgScore-(s.stdevScore??0)?'#3675db':'#399557'}))})},
  {type:'line',label:'Scores',series:s=>[{label:'Maximum',color:'#d83838',points:s.scoreHistory.map(p=>({x:p.tick,y:p.maxScore}))},{label:'Minimum',color:'#3675db',points:s.scoreHistory.map(p=>({x:p.tick,y:p.minScore}))},{label:'Average',color:'#399557',points:s.scoreHistory.map(p=>({x:p.tick,y:p.avgScore}))}]},
  {type:'bar',label:'Success histogram',series:s=>[{label:'Players',points:s.successHistogram.counts.map((count,i)=>({x:(s.successHistogram.edges[i]!+s.successHistogram.edges[i+1]!)/2,y:count}))}]},
  {type:'line',label:'Success rate',series:s=>[{label:'Maximum',color:'#d83838',points:s.scoreHistory.filter(p=>p.tick>0).map(p=>({x:p.tick,y:p.maxRate!}))},{label:'Minimum',color:'#3675db',points:s.scoreHistory.filter(p=>p.tick>0).map(p=>({x:p.tick,y:p.minRate!}))},{label:'Average',color:'#399557',points:s.scoreHistory.filter(p=>p.tick>0).map(p=>({x:p.tick,y:p.avgRate!}))}]},
  {type:'line',label:'Number picking zero',series:s=>[{label:'Zero',color:'#399557',points:s.scoreHistory.map(p=>({x:p.tick,y:p.zeroCount}))}]},
  {type:'inspector',label:'Selected player',value:(s,id)=>{const a=s.agents.find(a=>a.id===id);return a?{who:a.who,choice:a.choice,score:a.score,currentStrategy:a.currentStrategy}:undefined;}},
 ]
});

export { model };
export const sourceMarker = 'selected-social-b02:minority-game:5da641101e48d2ca325cfffa3f1bdaf27708152b628ab5504a95a2798a53e1a1';

/** Public headless definition and provenance remain inspectable in the loaded binding. */
export const ui = { ...binding, model, sourceMarker };
