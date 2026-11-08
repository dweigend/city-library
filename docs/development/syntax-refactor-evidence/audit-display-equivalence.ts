/** One-off source equivalence audit, run from the repository root with Bun.
 * Declaration capture deliberately erases heterogeneous types for inspection.
 * Real model factories and observations are unchanged; this does not mount a UI
 * and is not browser or scientific-parity acceptance. Temporary modules/results
 * are written only under the task-specific /tmp directory below.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
const root=process.cwd(), tmp='/tmp/city-library-catalog-display-equivalence'; mkdirSync(tmp,{recursive:true});
const files=execFileSync('git',['diff','--name-only','11d697f','--','experiments/*/ui.ts'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const captures:any[]=[];
(globalThis as any).__capture=(definition:any,spec:any)=>{captures.push({definition,spec});return {title:definition.title,mount(){throw Error('not mounted')}}};
let comparisons=0,observations=0;const cases:any[]=[];
for(const file of files){
 const versions=[];
 for(const version of ['old','new']){
  let source=version==='old'?execFileSync('git',['show',`11d697f:${file}`],{encoding:'utf8'}):readFileSync(file,'utf8');
  source=source.replace(/from (["'])city-library\1/g, 'from '+JSON.stringify(join(root,'index.ts')));
  source=source.replace(/\bdefineUI\(/g,'(globalThis as any).__capture(').replace(/(from\s+["'])(\.\.?\/[^"']+)(["'])/g,(_,a,b,c)=>a+resolve(dirname(join(root,file)),b)+c);
  const dest=join(tmp,file.split('/')[1]+'-'+version+'.ts'); writeFileSync(dest,source); const before=captures.length;await import(dest); if(captures.length!==before+1)throw Error('Unexpected capture '+file);versions.push(captures.at(-1));
 }
 const [old,next]=versions; const instance=next.definition.create(); const row={file,observations:0,monitors:old.spec.monitors?.length??0,steps:[] as string[]};
 try{
  for(let checkpoint=0;checkpoint<3;checkpoint++){
   if(checkpoint){try{instance.advance(checkpoint===1?1:9);row.steps.push('advanced')}catch(e){row.steps.push('precondition/failure: '+String(e));break}}
   const observation=instance.read();observations++;row.observations++;
   const a=old.spec.monitors??[],b=next.spec.monitors??[];if(a.length!==b.length)throw Error('Monitor count '+file);
   for(let i=0;i<a.length;i++){
    let va:any,vb:any,ea:any,eb:any;try{va=a[i].value(observation);va=a[i].format?a[i].format(va):String(va)}catch(e){ea=String(e)}try{vb=b[i].value(observation);vb=b[i].format?b[i].format(vb):String(vb)}catch(e){eb=String(e)}
    if(a[i].label!==b[i].label||va!==vb||ea!==eb)throw Error(JSON.stringify({file,checkpoint,label:a[i].label,va,vb,ea,eb}));comparisons++;
   }
  }
 }finally{instance.dispose?.()}
 cases.push(row);
}
const result={baseline:'11d697f',files:files.length,observations,comparisons,cases};writeFileSync(join(tmp,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({files:files.length,observations,comparisons,result:join(tmp,'result.json')}));
