import { defineUI, netLogoColor } from '../../ui/index.ts';
import { model, type Strategy } from './model.ts';
const colors:Record<Strategy,string>={Random:'#399557',Piagetian:'#3675db',Vygotskiian:'#d83838','P-V':'#858585'};
const binding=defineUI(model,{
 setup:[{field:'seed'},{field:'numberOfPlayers',label:'Players'}],
 live:[
 {field:'strategy',value:s=>s.parameters.strategy,set:(m,v)=>m.setParameters({strategy:String(v) as Strategy})},
 {field:'attemptsPerRun',label:'Attempts per run',value:s=>s.parameters.attemptsPerRun,set:(m,v)=>m.setParameters({attemptsPerRun:Number(v)})},
 {field:'randomizeStrategyEachRun',label:'Randomize strategy each run',value:s=>s.parameters.randomizeStrategyEachRun,set:(m,v)=>m.setParameters({randomizeStrategyEachRun:Boolean(v)})},
 {field:'stopAfterEachRun',label:'Stop after each run',value:s=>s.parameters.stopAfterEachRun,set:(m,v)=>m.setParameters({stopAfterEachRun:Boolean(v)})},
 {field:'trails',value:s=>s.parameters.trails,set:(m,v)=>m.setParameters({trails:Boolean(v)})},
 {field:'zpd',label:'ZPD',value:s=>s.parameters.zpd,set:(m,v)=>m.setParameters({zpd:Number(v)})},
 {field:'vygotskiianNeighbors',label:'Vygotskiian neighbors',value:s=>s.parameters.vygotskiianNeighbors,set:(m,v)=>m.setParameters({vygotskiianNeighbors:Number(v)})},
 {field:'moveError',label:'Move error',value:s=>s.parameters.moveError,set:(m,v)=>m.setParameters({moveError:Number(v)})},
 ],
 source:{url:'https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Psychology/Piaget-Vygotsky%20Game.nlogox',label:'Original NetLogo model · Wilensky · CC BY-NC-SA 3.0'},
 complete:s=>s.stopped,
 monitors:[{label:'Tick',value:s=>s.tick},{label:'Attempt',value:s=>s.attempts},{label:'Strategy',value:s=>s.strategy},{label:'Mean distance',value:s=>s.meanScore.toFixed(3)}],
 views:[
 {type:'spatial',label:'Target throws',data:s=>({width:s.width,height:s.height,cells:s.cells.map(c=>({...c,color:c.target?colors[s.strategy]:netLogoColor(c.trailColor)})),agents:s.players.map(p=>({...p,size:8,shape:'triangle' as const,color:netLogoColor(p.color)}))})},
 {type:'line',label:'Average distance from target',series:s=>(['Random','Piagetian','Vygotskiian','P-V'] as const).map(strategy=>({label:strategy,color:colors[strategy],points:s.history.filter(p=>p.strategy===strategy&&p.attempt>0).map(p=>({x:p.attempt,y:p.meanScore}))}))},
 {type:'bar',label:'Strategy averages',series:s=>s.strategyAverages.map((a,i)=>({label:a.strategy,color:colors[a.strategy],points:a.mean===null?[]:[{x:i,y:a.mean}]}))},
 {type:'inspector',label:'Selected player',value:(s,id)=>s.players.find(p=>p.id===id)},
 ]
});

export { model };
export const sourceMarker = 'selected-social-b02:piaget-vygotsky-game:f0020ad932d3667cc9e5b710018366515484172bd10814aa4b1f2575f2db84c1';

/** Public headless definition and provenance remain inspectable in the loaded binding. */
export const ui = { ...binding, model, sourceMarker };
