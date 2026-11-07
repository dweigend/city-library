import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "../../..");
const temporary = await mkdtemp(join(tmpdir(), "city-library-nw-topology-"));
const steps: { command: string[]; exitCode: number; stdout: string; stderr: string }[] = [];
async function command(args: string[], cwd: string) {
  const process = Bun.spawn(args, { cwd, stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, exitCode] = await Promise.all([new Response(process.stdout).text(), new Response(process.stderr).text(), process.exited]);
  steps.push({ command: args, exitCode, stdout, stderr });
  if (exitCode) throw new Error(`Packed topology check failed: ${args.join(" ")}`);
}
const program = `
import assert from 'node:assert/strict';
import {Graph,Random} from 'city-library';
const profile='nw-web-topology/1';
function setup(n){const graph=Graph.add();const nodes=Array.from({length:n},(_,index)=>graph.nodes.add({index}));return{graph,nodes};}
const pairs=edges=>edges.map(e=>[e.from.index,e.to.index]);
const k=setup(6),kr=Random.add({seed:1}),kc=kr.copy();for(let i=0;i<6;i++)kc.number();
assert.deepEqual(pairs(k.graph.generate({kind:'kleinberg',profile,nodes:k.nodes,shape:[3,2],clusteringExponent:2,random:kr})),[[0,1],[0,3],[1,2],[1,4],[2,5],[3,4],[4,5],[2,4],[3,5]]);
assert.deepEqual(kr.state,kc.state);
const p=setup(6),pr=Random.add({seed:7}),pc=pr.copy();for(let i=0;i<14;i++)pc.number();
assert.deepEqual(pairs(p.graph.generate({kind:'preferential',profile,nodes:p.nodes,links:2,directed:true,random:pr})),[[0,1],[0,2],[1,2],[3,0],[3,2],[4,1],[4,2],[5,0],[5,1]]);
assert.deepEqual(pr.state,pc.state);
const w=setup(4),wr=Random.add({seed:7}),wc=wr.copy();for(let i=0;i<11;i++)wc.number();
const edges=w.graph.generate({kind:'smallWorld',profile,nodes:w.nodes,neighborsPerSide:1,probability:1,directed:true,random:wr});
assert.deepEqual(pairs(edges),[[0,1],[1,3],[2,3],[3,0]]);assert.deepEqual(wr.state,wc.state);assert(Object.isFrozen(edges));
const wheel=setup(4);assert.deepEqual(pairs(wheel.graph.generate({kind:'wheel',profile,nodes:wheel.nodes,directed:true})),[[0,1],[1,2],[2,0],[0,3],[1,3],[2,3]]);
const grid=setup(4);assert.deepEqual(pairs(grid.graph.generate({kind:'lattice',profile,nodes:grid.nodes,shape:[2,2],wrap:true,directed:true})),[[0,1],[0,2],[1,3],[2,3]]);
const invalid=setup(4);
assert.throws(()=>invalid.graph.generate({kind:'smallWorld',nodes:invalid.nodes,neighbors:2,probability:0,directed:true,random:Random.add()}),TypeError);
assert.throws(()=>invalid.graph.generate({kind:'preferential',nodes:invalid.nodes,links:1,directed:undefined,random:Random.add()}),TypeError);
assert.throws(()=>invalid.graph.generate({kind:'wheel',profile:undefined,nodes:invalid.nodes}),TypeError);
assert.equal(invalid.graph.generate({kind:'lattice',nodes:invalid.nodes,shape:[2,2],wrap:true,directed:true}).length,8);
console.log('packed profile edition1: all five real branches, portable ledgers, readonly results and legacy rejection PASS');
`;
try {
  await mkdir(join(temporary, "archive"));
  await command(["bun", "pm", "pack", "--destination", join(temporary, "archive")], root);
  const archive = [...new Bun.Glob("*.tgz").scanSync(join(temporary, "archive"))][0]!;
  await writeFile(join(temporary, "package.json"), JSON.stringify({ private: true, type: "module", dependencies: { "city-library": `file:./archive/${archive}` } }));
  await command(["bun", "install", "--ignore-scripts"], temporary);
  await writeFile(join(temporary, "runtime.mjs"), program);
  await writeFile(join(temporary, "consumer.ts"), `import {Graph,Random,type GeneratorOptions,type Edge} from 'city-library';
type N={index:number};const graph=Graph.add<N>();const nodes=Array.from({length:6},(_,index)=>graph.nodes.add({index}));
const profile='nw-web-topology/1';
const options:GeneratorOptions<N>={kind:'kleinberg',profile,nodes,shape:[3,2],clusteringExponent:2,random:Random.add()};
const edges:readonly Edge<N>[] = graph.generate(options);void edges;
function legacy(kind:'path'|'cycle'|'star'|'wheel'|'complete'|'tree',selected:readonly N[]){return graph.generate({kind,nodes:selected,directed:true});}
function narrowed(value:GeneratorOptions<N>):number|undefined{return value.kind==='tree'?value.branching:undefined;}
const tree:GeneratorOptions<N>={kind:'tree',nodes,branching:3};void tree;void legacy;void narrowed;
const pa:GeneratorOptions<N>={kind:'preferential',profile,nodes,links:2,directed:true,random:Random.add()};void pa;
const ws:GeneratorOptions<N>={kind:'smallWorld',profile,nodes,neighborsPerSide:1,probability:0,directed:true,random:Random.add()};void ws;
`);
  await writeFile(join(temporary, "tsconfig.json"), JSON.stringify({ compilerOptions: { strict: true, noEmit: true, skipLibCheck: true, target: "ESNext", module: "Preserve", moduleResolution: "bundler", types: [], lib: ["ESNext"] }, include: ["consumer.ts"] }));
  await command([join(root, "node_modules/.bin/tsc"), "-p", "tsconfig.json"], temporary);
  await command(["bun", "runtime.mjs"], temporary);
  await command(["node", "runtime.mjs"], temporary);
  await writeFile(join(import.meta.dir, "packed-profile.json"), JSON.stringify({ status: "passed", scope: "Headless explicit topology profile only", steps }, null, 2) + "\n");
  console.log(JSON.stringify({ status: "passed", steps: steps.map(step => ({ command: step.command[0], exitCode: step.exitCode })) }));
} finally {
  await rm(temporary, { recursive: true, force: true });
}
