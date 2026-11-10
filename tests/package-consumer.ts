import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
const directory = await mkdtemp(join(tmpdir(), "city-library-consumer-"));
async function command(args: string[], cwd: string) {
  const process = Bun.spawn(args, { cwd, stdout: "inherit", stderr: "inherit" });
  if (await process.exited !== 0) throw new Error(`Consumer command failed: ${args.join(" ")}`);
}
try {
  await mkdir(join(directory, "package"));
  await command(["bun", "pm", "pack", "--destination", join(directory, "package")], process.cwd());
  const archives = [...new Bun.Glob("*.tgz").scanSync(join(directory, "package"))];
  const archive = archives[0];
  if (!archive) throw new Error("Package archive missing.");
  await writeFile(join(directory, "package.json"), JSON.stringify({ private: true, type: "module", dependencies: { "city-library": `file:./package/${archive}` } }));
  await command(["bun", "install", "--ignore-scripts"], directory);
  await writeFile(join(directory, "consumer.ts"), `import {Agent,World,Random,Graph,run} from 'city-library';\nconst person=Agent.create({energy:10});const world=World.create();world.add(person);run(world,()=>{person.energy-=1},5);if(person.energy!==5||world.tick.value!==5)throw Error('consumer mismatch');const random=Random.create({seed:1});const saved=random.state;const picked=random.sample([person],{count:1});if(picked[0]!==person)throw Error('identity mismatch');random.state=saved;const copy=random.copy();if(random.number({min:0,max:10,integer:true})!==Math.floor(copy.number()*10))throw Error('uniform mismatch');const before=random.state;if(random.local(()=>random.number())!==random.copy().number())throw Error('local mismatch');if(JSON.stringify(random.state)!==JSON.stringify(before))throw Error('local mutated continuation');const graph=Graph.create();const neighbor={label:'other'};graph.nodes.add(person);graph.nodes.add(neighbor);const edge=graph.edges.add({from:person,to:neighbor});if(graph.neighbors(person)[0]!==neighbor)throw Error('graph identity mismatch');const holder=Agent.create({graph,edge});if(holder.copy().edge!==edge)throw Error('graph state copy mismatch');person.delete();if(graph.hasNode(person)||edge.alive)throw Error('graph lifecycle mismatch');\n`);
  await writeFile(join(directory, "consumer.ts"), `
import {Grid,stats,geometry} from 'city-library';
const spatial=World.create({x:3,y:3,boundary:'wrap'});
const traveler=Agent.create({kind:'traveler'},{position:{x:1,y:0}});
spatial.add(traveler);
traveler.move({by:{x:1}});
if(traveler.x!==-1)throw Error('packed spatial wrapping mismatch');
const grid=Grid.create({x:3,y:3,boundary:'wrap'},{state:{heat:0}});
spatial.add(grid);
const cell=grid.fieldAt(traveler);
if(!cell)throw Error('packed grid lookup mismatch');
if(grid.agentsAt(cell)[0]!==traveler)throw Error('packed occupancy mismatch');
cell.heat=8;
grid.diffuse('heat',{rate:1,neighborhood:'moore'});
if(grid.fields.reduce((sum,field)=>sum+field.heat,0)!==8)throw Error('packed diffusion mismatch');
if(stats.gini([0,10])!==0.5)throw Error('packed gini mismatch');
if(stats.histogram([0,1,2],{edges:[0,1,2]}).counts.join(',')!=='1,2')throw Error('packed histogram mismatch');
const summary=stats.describe([3,1,2],{sample:true});
if(summary.median!==2||summary.mean!==2||summary.variance!==1||summary.standardDeviation!==1||!Object.isFrozen(summary))throw Error('packed public summary mismatch');
const gaussian=Random.create({seed:1});const firstNormal=gaussian.number({distribution:'normal'});if(!Number.isFinite(firstNormal)||gaussian.state.continuation.gaussian===null)throw Error('packed normal cache mismatch');
const gaussianCopy=gaussian.copy();if(gaussian.number({distribution:'normal',mean:7,deviation:3})!==gaussianCopy.number({distribution:'normal',mean:7,deviation:3}))throw Error('packed Gaussian continuation mismatch');
const noDraw=JSON.stringify(gaussian.state);if(gaussian.number({distribution:'normal',mean:11,deviation:0})!==11||JSON.stringify(gaussian.state)!==noDraw)throw Error('packed normal zero deviation mismatch');
const forward=geometry.direction({heading:90});if(Math.abs(forward.x-1)>1e-12||Math.abs(forward.y)>1e-12)throw Error('packed direction mismatch');
const probed=geometry.normalize({x:3,y:0},{space:{x:5,y:5,boundary:'wrap'}});if(probed?.x!==-2)throw Error('packed normalize mismatch');
const mappedAffine=geometry.map({x:0,y:90},{from:[-180,180,-90,90],to:[-72.5,72.5,-36.5,36.5]});
if(mappedAffine.x!==0||mappedAffine.y!==36.25||!Object.isFrozen(mappedAffine))throw Error('packed affine map mismatch');
if(geometry.distance({x:2,y:0},{x:-2,y:0},{space:{x:5,y:5,boundary:'wrap'}})!==1)throw Error('packed field distance mismatch');
const components=Graph.create();
const ca=components.nodes.add({label:'a'}),cb=components.nodes.add({label:'b'}),cc=components.nodes.add({label:'c'});
components.edges.add({from:ca,to:cb,directed:true});
components.edges.add({from:cb,to:ca,directed:true});
components.edges.add({from:cb,to:cc,directed:true});
if(!components.connected()||components.connected({mode:'strong'}))throw Error('packed connectivity mismatch');
const parts=components.components({mode:'strong'});
if(parts.length!==2||parts[0][0]!==ca||parts[0][1]!==cb||parts[1][0]!==cc||!Object.isFrozen(parts[0]))throw Error('packed canonical component mismatch');
const blocks=Graph.create({parallel:true,selfLoops:true});
blocks.nodes.add(ca);blocks.nodes.add(cb);blocks.nodes.add(cc);
blocks.edges.add({from:ca,to:cb});blocks.edges.add({from:cb,to:cc});
if(blocks.components({mode:'biconnected'}).length!==2)throw Error('packed biconnected mismatch');
if(components.distances({from:ca}).get(cc)!==2||components.allDistances().get(cb)?.get(ca)!==1)throw Error('packed directed distances mismatch');
const distanceSummary=components.distanceSummary();
if(distanceSummary.reachablePairs!==4||distanceSummary.mean!==1.25||distanceSummary.diameter!==2||distanceSummary.radius!==0)throw Error('packed distance summary mismatch');
const signedGraph=Graph.create({edgeState:{weight:2}});
const signedA=signedGraph.nodes.add({}),signedB=signedGraph.nodes.add({}),signedC=signedGraph.nodes.add({});
signedGraph.edges.add({from:signedA,to:signedB,directed:true});signedGraph.edges.add({from:signedB,to:signedC,directed:true,state:{weight:-3}});
if(signedGraph.distances({from:signedA,cost:edge=>edge.weight,algorithm:'bellman-ford'}).get(signedC)!==-1)throw Error('packed signed distance mismatch');
const preciseGraph=Graph.create({edgeState:{weight:1}});
const preciseNodes=Array.from({length:4},()=>preciseGraph.nodes.add({}));
preciseGraph.edges.add({from:preciseNodes[0],to:preciseNodes[1],directed:true,state:{weight:1e16}});
preciseGraph.edges.add({from:preciseNodes[1],to:preciseNodes[2],directed:true});
preciseGraph.edges.add({from:preciseNodes[2],to:preciseNodes[3],directed:true});
if(preciseGraph.distances({from:preciseNodes[0],cost:edge=>edge.weight}).get(preciseNodes[3])!==1e16+2)throw Error('packed exact distance mismatch');
preciseGraph.edges.add({from:preciseNodes[2],to:preciseNodes[1],directed:true,state:{weight:-2}});
let preciseCycleRejected=false;
try{preciseGraph.distances({from:preciseNodes[0],cost:edge=>edge.weight,algorithm:'bellman-ford'});}catch(error){if(error instanceof RangeError)preciseCycleRejected=true;else throw error;}
if(!preciseCycleRejected)throw Error('packed hidden negative cycle not rejected');
const analysisGraph=Graph.create();
const analysisA=analysisGraph.nodes.add({}),analysisB=analysisGraph.nodes.add({});
analysisGraph.edges.add({from:analysisA,to:analysisB});
if(analysisGraph.analyze({measure:'degree'}).get(analysisA)!==1)throw Error('packed degree mismatch');
if(analysisGraph.analyze({measure:'closeness'}).get(analysisA)!==1)throw Error('packed closeness mismatch');
if(analysisGraph.analyze({measure:'betweenness'}).get(analysisA)!==0)throw Error('packed betweenness mismatch');
const packedEigen=analysisGraph.analyze({measure:'eigenvector'}).get(analysisA);
if(packedEigen===undefined||Math.abs(packedEigen-1/Math.sqrt(2))>1e-10)throw Error('packed eigenvector mismatch');
const packedRank=analysisGraph.analyze({measure:'pageRank'}).get(analysisA);
if(packedRank===undefined||Math.abs(packedRank-0.5)>1e-10)throw Error('packed PageRank mismatch');
const generatedGraph=Graph.create();
const generatedNodes=Array.from({length:3},()=>generatedGraph.nodes.add({}));
const generatedPath=generatedGraph.generate({kind:'path',nodes:generatedNodes,directed:true});
if(generatedPath.length!==2||generatedPath[0].from!==generatedNodes[0]||generatedPath[1].to!==generatedNodes[2]||!Object.isFrozen(generatedPath))throw Error('packed generator mismatch');
const copiedGenerated=generatedGraph.copy({direction:'reverse'});
const copiedEdges=[...copiedGenerated.edges];
if([...copiedGenerated.nodes][0]!==generatedNodes[0]||copiedEdges.length!==2||copiedEdges[0]===generatedPath[0]||copiedEdges[0].from!==generatedNodes[1]||copiedEdges[0].to!==generatedNodes[0])throw Error('packed independent copy mismatch');
copiedEdges[0].delete();
if(!generatedPath[0].alive||generatedGraph.edges.size!==2)throw Error('packed copy owner isolation mismatch');
const distributionConsumer=Random.create({seed:7});
if(distributionConsumer.number({distribution:'poisson',mean:5})!==1)throw Error('packed product Poisson mismatch');
const hormoneLife=distributionConsumer.number({distribution:'exponential',mean:2/Math.LN2});
if(!Number.isFinite(hormoneLife)||hormoneLife<0)throw Error('packed exponential mismatch');
const distributionTwin=distributionConsumer.copy();
if(distributionConsumer.number({distribution:'poisson',mean:150})!==distributionTwin.number({distribution:'poisson',mean:150}))throw Error('packed PTRS continuation mismatch');
if(!geometry.contains({type:'Polygon',coordinates:[[[0,0],[4,0],[4,4],[0,4],[0,0]]]},{x:2,y:2}))throw Error('packed exact containment mismatch');
const packedPlanarBounds=geometry.bounds([{type:'Feature',geometry:{type:'Point',coordinates:[1,2]},properties:null}]);
if(JSON.stringify(packedPlanarBounds)!=='[1,1,2,2]'||!Object.isFrozen(packedPlanarBounds))throw Error('packed pure bounds mismatch');
const packedNwGraph=Graph.create();
const packedNwNodes=Array.from({length:4},()=>packedNwGraph.nodes.add({}));
const packedNwEdges=packedNwGraph.generate({kind:'kleinberg',profile:'ordered-topology/1',nodes:packedNwNodes,shape:[2,2],clusteringExponent:0,directed:true,random:Random.create({seed:1})});
if(packedNwEdges.length!==7||packedNwEdges[4].from!==packedNwNodes[1]||packedNwEdges[4].to!==packedNwNodes[0])throw Error('packed pinned topology variant mismatch');

import {topology,type Layout} from 'city-library';
const packedLayout:Layout=topology.square({columns:2,rows:1});
const packedLayoutGrid=Grid.create({layout:packedLayout,state:{temperature:1}});
packedLayoutGrid.fields[0]!.temperature=3;
if(packedLayoutGrid.neighbors(packedLayoutGrid.fields[0]!)[0]!==packedLayoutGrid.fields[1])throw Error('packed layout neighbors mismatch');
if(packedLayoutGrid.fields[1]!.temperature!==1||packedLayoutGrid.fields[0]!.grid!==packedLayoutGrid)throw Error('packed canonical layout Field mismatch');
if('space' in packedLayoutGrid||'cellSize' in packedLayoutGrid||'diffuse' in packedLayoutGrid)throw Error('packed layout capabilities mismatch');
const packedHex=topology.hex({columns:3,rows:3});
if(packedHex.neighbors({cell:4}).length!==6)throw Error('packed hex adjacency mismatch');
const packedImported=topology.fromPolygons({polygons:packedLayout.cells.map(cell=>packedLayout.polygon({cell}))});
if(packedImported.cellAt({position:{x:1,y:0.5}})!==0)throw Error('packed layout tie mismatch');
const packedMerge=geometry.merge({layout:packedLayout,cells:[1,0]});
if(packedMerge.status!=='ok'||geometry.area({shape:packedMerge.shape})!==2||packedMerge.sourceCells.join(',')!=='1,0')throw Error('packed merge mismatch');
if(packedMerge.status==='ok'){
const packedSplit=geometry.split({shape:packedMerge.shape,point:{x:1,y:0},direction:{x:0,y:1}});
if(packedSplit.status!=='ok'||packedSplit.parts.reduce((sum,shape)=>sum+geometry.area({shape}),0)!==2)throw Error('packed split mismatch');
}
const packedLayoutWorld=World.create();packedLayoutWorld.add(packedLayoutGrid);
const packedWalker=Agent.create({label:'layout walker'},{position:{x:0.5,y:0.5}});packedLayoutWorld.add(packedWalker);
if(packedLayoutGrid.agentsAt(packedLayoutGrid.fields[0]!)[0]!==packedWalker)throw Error('packed layout occupancy mismatch');
packedWalker.move({to:{x:1.5,y:0.5}});
if(packedLayoutGrid.agentsAt(packedLayoutGrid.fields[0]!).length!==0||packedLayoutGrid.agentsAt(packedLayoutGrid.fields[1]!)[0]!==packedWalker)throw Error('packed layout movement mismatch');

const quadRandom=Random.create({seed:7});
const rawQuads=topology.quadrilaterals({rings:3,random:quadRandom});
const quadContinuation=JSON.stringify(quadRandom.state);
if(rawQuads.cells.length!==122)throw Error('packed finite quad count mismatch');
const quadArea=rawQuads.cells.reduce((sum,cell)=>sum+geometry.area({shape:rawQuads.polygon({cell})}),0);
if(Math.abs(quadArea-27*Math.sqrt(3)/2)>1e-10)throw Error('packed hex area mismatch');
const revisedQuads=topology.relax({layout:rawQuads,method:'squareTarget',iterations:4});
const zeroQuads=topology.relax({layout:rawQuads,method:'squareTarget',iterations:0});
if(revisedQuads===rawQuads||zeroQuads===rawQuads||zeroQuads.polygon({cell:0})===rawQuads.polygon({cell:0}))throw Error('packed quad revision identity mismatch');
if(JSON.stringify(quadRandom.state)!==quadContinuation)throw Error('packed relaxation consumed random stream');
for(const cell of rawQuads.cells){
if(JSON.stringify(revisedQuads.neighbors({cell}))!==JSON.stringify(rawQuads.neighbors({cell})))throw Error('packed quad incidence mismatch');
}
const quadBefore=Grid.create({layout:rawQuads,state:{population:0}});
quadBefore.fields[0]!.population=12;
const quadAfter=Grid.create({layout:revisedQuads,state:{population:0}});
for(const cell of rawQuads.cells)quadAfter.fields[cell]!.population=quadBefore.fields[cell]!.population;
if(quadAfter.fields[0]===quadBefore.fields[0]||quadAfter.fields[0]!.population!==12)throw Error('packed explicit quad Field copy mismatch');



`, { flag: "a" });
  await writeFile(join(directory, "summary-types.ts"), `import {stats,type Summary} from 'city-library';
function summaryTypeContract(){const summary:Summary=stats.describe([1,2,3],{sample:true});const median:number|undefined=summary.median;
// @ts-expect-error Public summary fields are readonly.
summary.sum=0;
return median;}
void summaryTypeContract;
`);
  await writeFile(join(directory, "grid-parcel-types.ts"), `import {Grid,World,Random,topology,type Layout,type LayoutGrid,type LayoutField,type PlanarGeometry} from 'city-library';
function layoutTypeContract(){
const layout:Layout=topology.hex({columns:2,rows:2});
const grid:LayoutGrid<{temperature:number}>=Grid.create({layout,state:{temperature:1}});
const field:LayoutField<{temperature:number}>=World.create().add(grid).fields[0]!;
field.temperature=2;
const owner:LayoutGrid<{temperature:number}>=field.grid;
const shape:PlanarGeometry=layout.polygon({cell:0});
const quads:Layout=topology.quadrilaterals({rings:1,random:Random.create({seed:7})});
const revised:Layout=topology.relax({layout:quads,method:'squareTarget',iterations:0});
const mixedFinite={rings:1,boundary:shape,random:Random.create({seed:7})};
// @ts-expect-error Finite and arbitrary-boundary options cannot be mixed through a variable.
topology.quadrilaterals(mixedFinite);
// @ts-expect-error The finite method requires an explicit canonical stream.
topology.quadrilaterals({rings:1});
// @ts-expect-error Lloyd remains a research contract.
topology.relax({layout:revised,method:'lloyd',iterations:1});
// @ts-expect-error Layout Grids do not have a uniform cell size.
grid.cellSize;
// @ts-expect-error Layout Grids do not have regular diffusion.
grid.diffuse('temperature');
// @ts-expect-error The Field retains typed direct state.
field.temperature='wrong';
// @ts-expect-error Field owner does not pretend to have a regular Space.
field.grid.space;
return [owner,shape];}void layoutTypeContract;
`);
  await writeFile(join(directory, "generator-types.ts"), `import {Graph,type GeneratorOptions,type Edge} from 'city-library';
function generatorTypeContract(){const graph=Graph.create<{name:string}>();const a=graph.nodes.add({name:'a'}),b=graph.nodes.add({name:'b'});const options:GeneratorOptions<{name:string}>={kind:'path',nodes:[a,b],directed:true};const result:readonly Edge<{name:string}>[]=graph.generate(options);
// @ts-expect-error Generated edge containers are readonly.
result.push(result[0]);return result;}void generatorTypeContract;
`);
  await writeFile(join(directory, "consumer.ts"), `
import {Agenda,Resource,Store,ServiceQueue,Signal,TimeWeighted,EventTrace} from 'city-library';
const eventAgenda=Agenda.create<{kind:string}>();
const eventWorld=World.create();eventWorld.add(eventAgenda);
eventAgenda.add({at:2,data:{kind:'arrival'}});
if(eventAgenda.next({until:10})?.at!==2)throw Error('packed causal first event');
eventAgenda.add({at:3,data:{kind:'service'}});
if(eventAgenda.next({until:10})?.at!==3||eventAgenda.time!==3)throw Error('packed causal successor');
if(eventAgenda.next({until:10})!==undefined||Number(eventAgenda.time)!==10||eventWorld.tick.value!==0)throw Error('packed empty horizon');
const packedOwner=Agent.create({kind:'resident'});
const packedResource=Resource.add<typeof packedOwner>({capacity:1});
const claim=packedResource.request({owner:packedOwner});
const waiting=packedResource.request({owner:packedOwner});
packedResource.release(claim);
if(waiting.status!=='granted'||packedResource.used!==1)throw Error('packed resource admission');
let blockedDeletion=false;try{packedOwner.delete()}catch{blockedDeletion=true}
if(!blockedDeletion)throw Error('packed resource lifecycle');
packedResource.cancel(waiting);packedOwner.delete();
const packedStore=Store.create<number>({capacity:1});
packedStore.put(1);const blockedPut=packedStore.put(2);
if(String(blockedPut.status)!=='waiting'||packedStore.take()!==1||String(blockedPut.status)!=='stored'||packedStore.get().value!==2)throw Error('packed store backpressure');
const packedQueue=ServiceQueue.add<number>({policy:'priority'});
packedQueue.add(1,{priority:2});packedQueue.add(2,{priority:-1});
if(packedQueue.take()!==2)throw Error('packed queue policy');
const packedSignal=Signal.create(false);const condition=packedSignal.wait(value=>value);packedSignal.set(true);
if(condition.status!=='satisfied')throw Error('packed condition');
const weighted=TimeWeighted.create({value:0});weighted.set({at:2,value:3});
if(weighted.read({until:5}).integral!==9)throw Error('packed time weighting');
const packedTrace=EventTrace.add<{kind:string}>({capacity:2});packedTrace.record({at:1,value:{kind:'a'}});packedTrace.record({at:1,value:{kind:'b'}});
if(packedTrace.read().length!==2)throw Error('packed equal-time event trace');
const gammaRandom=Random.create({seed:5});const gammaCopy=gammaRandom.copy();
if(gammaRandom.number({distribution:'gamma',shape:.7,rate:2})!==gammaCopy.number({distribution:'gamma',shape:.7,rate:2}))throw Error('packed gamma continuation');
import {measurements,storage,studies,twoPhase,continuous} from 'city-library';
const events=scheduledAgendaConsumer();
function scheduledAgendaConsumer(){const timeline=Agenda.create<string>();const owner=World.create();owner.add(timeline);timeline.add({at:2,data:'arrival'});const event=timeline.next({until:10});if(event?.at!==2||timeline.time!==2||owner.tick.value!==0||owner.agendas[0]!==timeline)throw Error('packed agenda ownership mismatch');const resource=Resource.add<object>({capacity:1});const claim=resource.request({owner:{}});resource.release(claim);if(resource.used!==0||claim.status!=='released')throw Error('packed resource mismatch');return timeline;}
void events;
const numeric=measurements.define((state:{energy:number})=>({energy:state.energy}));
const bounded=storage.history({capacity:1});
bounded.add({tick:0,values:numeric.read({energy:4})});
bounded.add({tick:1,values:{energy:3}});
if(bounded.samples.length!==1||bounded.samples[0]?.values.energy!==3)throw Error('packed history mismatch');
const scheduledWorld=World.create();
const scheduled=scheduledWorld.add(Agent.create({energy:2}));
scheduledWorld.activate([scheduled],({self})=>{self.energy+=1},{order:'fixed'});
if(scheduled.energy!==3||scheduledWorld.tick.value!==0)throw Error('packed activation mismatch');
twoPhase([scheduled],{compute:member=>member.energy*2,commit:(member,value)=>{member.energy=value}});
if(numeric.read(scheduled).energy!==6)throw Error('packed two-phase mismatch');
if(continuous.crossing({from:0,to:4,threshold:2,duration:2})?.elapsed!==1)throw Error('packed crossing mismatch');
const planned=studies.replicate(studies.design({axes:[{name:'demand',values:[1,2]}]}),[1]);
const study=studies.run({plan:planned,steps:2,create:()=>({world:World.create(),step(){}}),measure:()=>({value:2})});
if(study.outcomes.length!==2||studies.summarize(study,entry=>entry.samples.at(-1)?.measurement.value)[0]?.mean!==2)throw Error('packed study mismatch');
`, { flag: "a" });
  await command(["bun", "consumer.ts"], directory);
  // Preserve the TypeScript consumer contract while executing plain JavaScript in Node.
  const javascript = new Bun.Transpiler({ loader: "ts", target: "node" })
    .transformSync(await Bun.file(join(directory, "consumer.ts")).text());
  await writeFile(join(directory, "consumer.mjs"), javascript);
  await command(["node", "consumer.mjs"], directory);
  await writeFile(join(directory, "tsconfig.json"), JSON.stringify({ compilerOptions: { strict: true, target: "ESNext", module: "Preserve", moduleResolution: "bundler", noEmit: true, types: [], lib: ["ESNext"] }, include: ["consumer.ts", "summary-types.ts", "generator-types.ts", "grid-parcel-types.ts"] }));
  await command([resolve("node_modules/.bin/tsc"), "-p", "tsconfig.json"], directory);
  console.log("packed consumer: Bun, Node ESM and ambient-free TypeScript passed");
} finally { await rm(directory, { recursive: true, force: true }); }
