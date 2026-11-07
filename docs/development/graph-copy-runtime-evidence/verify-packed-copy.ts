import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// Author verification tooling only; consumers import the real packed library.
const root = resolve(import.meta.dir, "../../..");
const temporary = await mkdtemp(join(tmpdir(), "city-library-copy-consumer-"));
const steps: { command: string[]; exitCode: number; stdout: string; stderr: string }[] = [];
async function command(args: string[], cwd: string) {
  const process = Bun.spawn(args, { cwd, stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, exitCode] = await Promise.all([new Response(process.stdout).text(), new Response(process.stderr).text(), process.exited]);
  steps.push({ command: args, exitCode, stdout, stderr });
  if (exitCode) throw new Error(`Packed copy verification failed: ${args.join(" ")}`);
}
const program = `
import assert from 'node:assert/strict';
import { Agent, Graph, Random, World } from 'city-library';
const random=Random.add({seed:31}),world=World.add({random});
const source=Graph.add({parallel:true,edgeState:{nested:{values:[1]},refs:[]}});
const a=world.add(Agent.add({name:'a'})),b=world.add(Agent.add({name:'b'})),c=world.add(Agent.add({name:'c'}));
for(const node of [a,b,c])source.nodes.add(node);
const first=source.edges.add({from:a,to:b,directed:true,key:'7'});
source.edges.add({from:b,to:c,directed:true,key:'0'});
first.refs=[source,first];
const before=random.state;
const copied=source.copy({direction:'reverse'}),edges=[...copied.edges];
assert.deepEqual([...copied.nodes],[a,b,c]);
assert.notEqual(edges[0],first);assert.equal(edges[0].from,b);assert.equal(edges[0].to,a);
assert.equal(edges[0].key,'7');assert.equal(edges[0].graph,copied);assert.equal(edges[0].path,undefined);
assert.deepEqual(edges[0].refs,[source,first]);
edges[0].nested.values.push(2);assert.deepEqual(first.nested.values,[1]);
assert.equal(copied.distances({from:c}).get(a),2);assert.equal(copied.analyze({measure:'degree'}).get(b),1);
const again=copied.copy({nodes:[b,a],direction:'undirected'});
assert.deepEqual([...again.nodes],[a,b]);assert.equal(again.edges.size,1);
again.delete();assert.equal(copied.nodes.size,3);
copied.delete({edgesOnly:true});assert.equal(source.edges.size,2);
assert.equal(copied.generate({kind:'path',nodes:[a,b,c]}).length,2);
b.delete();assert.equal(source.edges.size,0);assert.equal(copied.edges.size,0);
assert.equal(world.agents.length,2);assert.equal(world.tick.value,0);assert.deepEqual(random.state,before);
console.log('packed Graph.copy: canonical nodes, fresh edges, state/keys/direction, full receiver and lifecycle PASS');
`;
try {
  await mkdir(join(temporary, "archive"));
  await command(["bun", "pm", "pack", "--destination", join(temporary, "archive")], root);
  const archive = [...new Bun.Glob("*.tgz").scanSync(join(temporary, "archive"))][0]!;
  await writeFile(join(temporary, "package.json"), JSON.stringify({ private: true, type: "module", dependencies: { "city-library": `file:./archive/${archive}` } }));
  await command(["bun", "install", "--ignore-scripts"], temporary);
  await writeFile(join(temporary, "runtime.mjs"), program);
  await writeFile(join(temporary, "consumer.ts"), `import { Graph, type Edge } from 'city-library';
type Node={id:number};type State={value:number};
const graph=Graph.add<Node,State>({edgeState:{value:1}});
const a=graph.nodes.add({id:1}),b=graph.nodes.add({id:2});
const edge=graph.edges.add({from:a,to:b,directed:true});
const copied:Graph<Node,State>=graph.copy({nodes:[b,a,a],edges:[edge],direction:'reverse'});
const edges:readonly Edge<Node,State>[]=[...copied.edges];
const distance:number|undefined=copied.distances({from:b}).get(a);
void edges;void distance;
`);
  await writeFile(join(temporary, "tsconfig.json"), JSON.stringify({ compilerOptions: { strict: true, target: "ESNext", module: "Preserve", moduleResolution: "bundler", noEmit: true, skipLibCheck: true, types: [], lib: ["ESNext"] }, include: ["consumer.ts"] }));
  await command([join(root, "node_modules/.bin/tsc"), "-p", "tsconfig.json"], temporary);
  await command(["bun", "runtime.mjs"], temporary);
  await command(["node", "runtime.mjs"], temporary);
  await writeFile(join(import.meta.dir, "packed-copy.json"), JSON.stringify({ status: "passed", steps }, null, 2) + "\n");
  console.log(JSON.stringify({ status: "passed", scope: "Fresh local package: strict declarations, Bun source condition, Node ESM bundle", steps: steps.map(step => ({ command: step.command[0], exitCode: step.exitCode })) }));
} finally {
  await rm(temporary, { recursive: true, force: true });
}
