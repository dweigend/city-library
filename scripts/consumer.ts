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
  await command(["bun", "consumer.ts"], directory);
  await writeFile(join(directory, "consumer.mjs"), await Bun.file(join(directory, "consumer.ts")).text());
  await command(["node", "consumer.mjs"], directory);
  await writeFile(join(directory, "tsconfig.json"), JSON.stringify({ compilerOptions: { strict: true, target: "ESNext", module: "Preserve", moduleResolution: "bundler", noEmit: true, types: [], lib: ["ESNext"] }, include: ["consumer.ts"] }));
  await command([resolve("node_modules/.bin/tsc"), "-p", "tsconfig.json"], directory);
  console.log("packed consumer: Bun, Node ESM and ambient-free TypeScript passed");
} finally { await rm(directory, { recursive: true, force: true }); }
