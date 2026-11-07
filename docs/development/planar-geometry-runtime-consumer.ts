import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const root = process.cwd();
const directory = await mkdtemp(join(tmpdir(), 'planar-runtime-'));
console.log('Evidence directory:', directory);
async function run(args: string[], cwd = root) {
  const child = Bun.spawn(args, { cwd, stdout: 'inherit', stderr: 'inherit' });
  if (await child.exited !== 0) throw Error(`Failed: ${args.join(' ')}`);
}
// Check frozen examples separately: script03 currently reports two TS2352 JSON casts.
await mkdir(join(directory, 'archives'));
await run(['bun', 'pm', 'pack', '--destination', join(directory, 'archives')]);
const archive = [...new Bun.Glob('*.tgz').scanSync(join(directory, 'archives'))][0]!;
await mkdir(join(directory, 'consumer/node_modules/city-library'), { recursive: true });
await run(['tar', '-xzf', join(directory, 'archives', archive), '--strip-components=1', '-C', join(directory, 'consumer/node_modules/city-library')]);
const consumer = join(directory, 'consumer');
await writeFile(join(consumer, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
const runtime = `import {geometry} from 'city-library';
const polygon={type:'Polygon',coordinates:[[[0,0],[8,0],[8,8],[0,8],[0,0]],[[2,2],[6,2],[6,6],[2,6],[2,2]]]};
const features=[{type:'Feature',geometry:polygon,properties:null}];
if(!geometry.contains(polygon,{x:1,y:1})||geometry.contains(polygon,{x:3,y:3})||!geometry.contains(polygon,{x:2,y:3})||geometry.contains(polygon,{x:2,y:3},{boundary:'exclude'}))throw Error('packed containment mismatch');
const bounds=geometry.bounds(features);if(JSON.stringify(bounds)!=='[0,8,0,8]'||!Object.isFrozen(bounds))throw Error('packed bounds mismatch');
if(geometry.bounds([])!==undefined)throw Error('packed empty mismatch');
const m=Number.MAX_VALUE;if(geometry.bounds([{type:'Feature',geometry:{type:'Point',coordinates:[-m,m]},properties:null}])[0]!==-m)throw Error('packed extreme mismatch');
console.log('packed planar runtime passed');
`;
await writeFile(join(consumer, 'consumer.mjs'), runtime);
await run(['bun', 'consumer.mjs'], consumer);
await run(['node', 'consumer.mjs'], consumer);
await writeFile(join(consumer, 'types.ts'), `import { geometry, type Bounds, type PlanarXY, type PlanarPolygon, type PlanarGeometry, type PlanarJson, type PlanarFeature, type PlanarDataset } from 'city-library';
const xy:PlanarXY=[0,0]; const polygon:PlanarPolygon={type:'Polygon',coordinates:[[xy,[1,0],[0,1],xy]]};
const shape:PlanarGeometry=polygon;const json:PlanarJson={a:[null,true,1,'x']};
const feature:PlanarFeature={type:'Feature',geometry:shape,properties:{json}};
const dataset:PlanarDataset={features:[feature],coordinateSystem:{crs:'caller',units:'caller'}};
const bounds:Bounds|undefined=geometry.bounds(dataset);const result:boolean=geometry.contains(polygon,{x:0,y:0},{boundary:undefined});
// @ts-expect-error Strict XY tuples exclude XYZ.
const xyz:PlanarXY=[0,0,0];
// @ts-expect-error Public feature arrays are readonly.
dataset.features.push(feature);
// @ts-expect-error Contains accepts Polygon only.
geometry.contains({type:'Point',coordinates:xy},{x:0,y:0});
// @ts-expect-error Boundary policy is closed.
geometry.contains(polygon,{x:0,y:0},{boundary:'nearest'});
void [bounds,result,xyz];
`);
await writeFile(join(consumer, 'tsconfig.json'), JSON.stringify({ compilerOptions: { strict: true, noEmit: true, types: [], lib: ['ESNext'], target: 'ESNext', module: 'Preserve', moduleResolution: 'bundler', skipLibCheck: false }, include: ['types.ts'] }));
await run([resolve('node_modules/.bin/tsc'), '-p', 'tsconfig.json'], consumer);
console.log('actual archive: Bun / Node ESM / ambient-free TS passed; no dependency installation');
