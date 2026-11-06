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
  await writeFile(join(directory, "consumer.ts"), `import {Agent,World,Random,Graph,run} from 'city-library';\nconst person=Agent.add({energy:10});const world=World.add();world.add(person);run(world,()=>{person.energy-=1},5);if(person.energy!==5||world.tick.value!==5)throw Error('consumer mismatch');const random=Random.add({seed:1});const saved=random.state;const picked=random.sample([person],{count:1});if(picked[0]!==person)throw Error('identity mismatch');random.state=saved;const copy=random.copy();if(random.number({min:0,max:10,integer:true})!==Math.floor(copy.number()*10))throw Error('uniform mismatch');const before=random.state;if(random.local(()=>random.number())!==random.copy().number())throw Error('local mismatch');if(JSON.stringify(random.state)!==JSON.stringify(before))throw Error('local mutated continuation');const graph=Graph.add();const neighbor={label:'other'};graph.nodes.add(person);graph.nodes.add(neighbor);const edge=graph.edges.add({from:person,to:neighbor});if(graph.neighbors(person)[0]!==neighbor)throw Error('graph identity mismatch');const holder=Agent.add({graph,edge});if(holder.copy().edge!==edge)throw Error('graph state copy mismatch');person.delete();if(graph.hasNode(person)||edge.alive)throw Error('graph lifecycle mismatch');\n`);
  await writeFile(join(directory, "consumer.ts"), `
import {Grid,stats,type Summary} from 'city-library';
const spatial=World.add({x:3,y:3,boundary:'wrap'});
const traveler=Agent.add({kind:'traveler'},{position:{x:1,y:0}});
spatial.add(traveler);
traveler.move({by:{x:1}});
if(traveler.x!==-1)throw Error('packed spatial wrapping mismatch');
const grid=Grid.add({x:3,y:3,boundary:'wrap'},{state:{heat:0}});
spatial.add(grid);
const cell=grid.fieldAt(traveler);
if(!cell)throw Error('packed grid lookup mismatch');
if(grid.agentsAt(cell)[0]!==traveler)throw Error('packed occupancy mismatch');
cell.heat=8;
grid.diffuse('heat',{rate:1,neighborhood:'moore'});
if(grid.fields.reduce((sum,field)=>sum+field.heat,0)!==8)throw Error('packed diffusion mismatch');
if(stats.gini([0,10])!==0.5)throw Error('packed gini mismatch');
if(stats.histogram([0,1,2],{edges:[0,1,2]}).counts.join(',')!=='1,2')throw Error('packed histogram mismatch');
const summary:Summary=stats.describe([3,1,2],{sample:true});
if(summary.median!==2||summary.mean!==2||summary.variance!==1||summary.standardDeviation!==1||!Object.isFrozen(summary))throw Error('packed public summary mismatch');
const components=Graph.add();
const ca=components.nodes.add({label:'a'}),cb=components.nodes.add({label:'b'}),cc=components.nodes.add({label:'c'});
components.edges.add({from:ca,to:cb,directed:true});
components.edges.add({from:cb,to:ca,directed:true});
components.edges.add({from:cb,to:cc,directed:true});
if(!components.connected()||components.connected({mode:'strong'}))throw Error('packed connectivity mismatch');
const parts=components.components({mode:'strong'});
if(parts.length!==2||parts[0][0]!==ca||parts[0][1]!==cb||parts[1][0]!==cc||!Object.isFrozen(parts[0]))throw Error('packed canonical component mismatch');
const blocks=Graph.add({parallel:true,selfLoops:true});
blocks.nodes.add(ca);blocks.nodes.add(cb);blocks.nodes.add(cc);
blocks.edges.add({from:ca,to:cb});blocks.edges.add({from:cb,to:cc});
if(blocks.components({mode:'biconnected'}).length!==2)throw Error('packed biconnected mismatch');
`, { flag: "a" });
  await command(["bun", "consumer.ts"], directory);
  await writeFile(join(directory, "consumer.mjs"), await Bun.file(join(directory, "consumer.ts")).text());
  await command(["node", "consumer.mjs"], directory);
  await writeFile(join(directory, "tsconfig.json"), JSON.stringify({ compilerOptions: { strict: true, target: "ESNext", module: "Preserve", moduleResolution: "bundler", noEmit: true, types: [], lib: ["ESNext"] }, include: ["consumer.ts"] }));
  await command([resolve("node_modules/.bin/tsc"), "-p", "tsconfig.json"], directory);
  console.log("packed consumer: Bun, Node ESM and ambient-free TypeScript passed");
} finally { await rm(directory, { recursive: true, force: true }); }
