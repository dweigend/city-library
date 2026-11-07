import { geometry, type PlanarPolygon, type PlanarFeature, type PlanarGeometry, type PlanarXY } from '../../index.ts';
import data from '../../examples/planar-geometry-proposal/post-advisory-source-fixtures.json';
const feature=(geometry:PlanarGeometry):PlanarFeature=>({type:'Feature',geometry,properties:null});
const rectangle=(n:number):PlanarPolygon=>({type:'Polygon',coordinates:[[...Array.from({length:n-3},(_,x):PlanarXY=>[x,0]),[n-4,4],[0,4],[0,0]]]});
const russia:PlanarPolygon={type:'Polygon',coordinates:data.russiaLargest.coordinates as unknown as PlanarPolygon['coordinates']};
const westBank:PlanarPolygon={type:'Polygon',coordinates:data.westBank.coordinates as unknown as PlanarPolygon['coordinates']};
const canada:PlanarGeometry={type:'MultiPolygon',coordinates:data.canada.coordinates as unknown as Extract<PlanarGeometry,{type:'MultiPolygon'}>['coordinates']};
const cap=rectangle(2048),over=rectangle(2049);
const multi:PlanarGeometry={type:'MultiPoint',coordinates:Array.from({length:100001},()=>[2,3] as const)};
const cases:[string,()=>unknown][]=[
['Russia1282.contains',()=>geometry.contains(russia,data.russiaLargest.strictInterior)],
['Russia1282.bounds',()=>geometry.bounds([feature(russia)])],
['WestBank11.contains',()=>geometry.contains(westBank,data.westBank.strictInterior)],
['Canada3316in126.bounds',()=>geometry.bounds([feature(canada)])],
['rectangle2048.contains',()=>geometry.contains(cap,{x:1,y:1})],
['rectangle2049.bounds',()=>geometry.bounds([feature(over)])],
['MultiPoint100001.bounds',()=>geometry.bounds([feature(multi)])],
];
const results=cases.map(([name,run])=>{const samples=[];for(let i=0;i<7;i++){const start=performance.now();run();samples.push(performance.now()-start);}const sorted=[...samples].sort((a,b)=>a-b);return{name,samplesMs:samples,medianMs:sorted[3]};});
console.log(JSON.stringify({runtime:Bun.version,samplesPerCase:7,method:'sequential wall-clock performance.now; cold first sample retained; no timing acceptance threshold',results},null,2));
