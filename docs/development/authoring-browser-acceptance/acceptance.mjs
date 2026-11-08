import { chromium } from '/home/david/.local/share/codex-playwright-mcp/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const root='/home/david/.t3/worktrees/city-library/experiment-netlogo-web-catalog';
const base='http://127.0.0.1:3110';
const browser=await chromium.launch({executablePath:'/home/david/.local/share/codex-playwright-browsers/chromium-1247/chrome-linux64/chrome',headless:true,args:['--no-sandbox']});
const result={checkpoint:'1b0eb18 plus active authoring runtime/catalog WIP on 6 November 2026',startedAt:new Date().toISOString(),method:'Separate real Chromium context, DPR1, frozen browser harness plus public defineUI fixtures; no mock DOM/model',hosts:[],errors:[]};
try {
 const context=await browser.newContext({viewport:{width:1366,height:768},deviceScaleFactor:1,colorScheme:'light'});
 try {
  const page=await context.newPage();let phase='boot';page.on('pageerror',e=>result.errors.push({phase,message:e.message,stack:e.stack}));
  await page.goto(base);await page.getByRole('button',{name:'Setup',exact:true}).waitFor();
  await page.evaluate(()=>{document.getElementById('app')?.remove();const section=document.createElement('section');section.id='authoring-acceptance';document.body.append(section);});
  for(const host of ['legacy','svelte']) {
   await page.evaluate(async({root,host})=>{
     document.getElementById('acceptance-legacy-css')?.remove();
     if(host==='legacy')await new Promise((resolve,reject)=>{const link=document.createElement('link');link.id='acceptance-legacy-css';link.rel='stylesheet';link.href='/@fs/'+root+'/ui/agent-lab/styles.css';link.onload=resolve;link.onerror=reject;document.head.append(link);});
    },{root,host});
    phase=host+':harness';const record={host,harness:null,fixtures:[],screenshots:[]};result.hosts.push(record);
   try {
    record.harness=await page.evaluate(async({root,host})=>{
     const {runBrowserChecks}=await import('/@fs/'+root+'/examples/ui-authoring/browser-harness.ts');
     return await runBrowserChecks(document.getElementById('authoring-acceptance'),host);
    },{root,host});
   }catch(e){record.harness={error:String(e)};}
   for(const failureKind of ['running-render-error','running-format-error']) {
    phase=host+':'+failureKind;
    try {
     const recovery=await page.evaluate(async({root,host,failureKind})=>{
      window.__authoringFixture?.dispose();const container=document.getElementById('authoring-acceptance');container.replaceChildren();
      const bind=(await import('/@fs/'+root+(host==='legacy'?'/ui/index.ts':'/ui/svelte/index.ts'))).defineUI;
      const {model}=await import('/@fs/'+root+'/experiments/wealth-distribution/model.ts');
      const {settle,button}=await import('/@fs/'+root+'/examples/ui-authoring/assertions.ts');
      let instance;const tracked={...model,create(options){instance=model.create({...options,seed:31,people:2});return instance;}};
      const spec={setup:[],monitors:[{label:'Tick',value:s=>s.tick,...(failureKind==='running-format-error'?{format:value=>{if(value===1)throw Error('Running formatter failure');return String(value);}}:{})}],views:failureKind==='running-render-error'?[{type:'bar',label:'Running renderer',series:s=>s.tick===1?[{label:'Bad',points:[{x:0,y:0},{x:'mixed',y:0}]}]:[{label:'Good',points:[{x:'Actual tick',y:s.tick}]}]}]:[]};
      const mounted=bind(tracked,spec).mount(container);window.__authoringFixture=mounted;await settle(container);button(container,'Setup').click();await settle(container);button(container,'Run').click();await new Promise(r=>setTimeout(r,350));await settle(container);
      const failure=container.innerText;const stoppedTick=instance.read().tick;await new Promise(r=>setTimeout(r,350));
      if(instance.read().tick!==stoppedTick||stoppedTick!==1)throw Error('Failure did not stop at tick1');
      if(!failure.includes(failureKind==='running-render-error'?'mix numeric':'Running formatter failure'))throw Error('Primary failure lost');
      button(container,'Setup').click();await settle(container);await settle(container);
      if(instance.read().tick!==0)throw Error('Restart did not recover tick0');
      if(container.querySelector('[role=alert],[data-state=error]'))throw Error('Restart retained error: '+container.innerText);
      if(button(container,'Run').disabled)throw Error('Recovered playback remained disabled');
      return {kind:failureKind,stoppedTick,recoveredTick:instance.read().tick,primaryError:failure};
     },{root,host,failureKind});record.fixtures.push(recovery);
    }catch(e){record.fixtures.push({kind:failureKind,error:String(e)});}
   }
   for(const kind of ['grouped','grouped-nonzero','empty','numeric-negative','mixed','duplicate','format-error']){
    phase=host+':'+kind;
    try {
     const probe=await page.evaluate(async({root,host,kind})=>{
      window.__authoringFixture?.dispose();
      const container=document.getElementById('authoring-acceptance');container.replaceChildren();
      const bind=(await import('/@fs/'+root+(host==='legacy'?'/ui/index.ts':'/ui/svelte/index.ts'))).defineUI;
      const {model}=await import('/@fs/'+root+'/experiments/wealth-distribution/model.ts');
      const {settle,button}=await import('/@fs/'+root+'/examples/ui-authoring/assertions.ts');
      let instance;
      const tracked={...model,create(options){instance=model.create({...options,seed:31,people:2});return instance;}};
      const common={setup:[],monitors:[{label:'Tick',value:s=>s.tick}],views:[]};
      const series=s=>{const origin=s.cells.find(c=>c.x===0&&c.y===0),west=s.cells.find(c=>c.x===-1&&c.y===0);
       if(kind==='grouped-nonzero'){const sw=s.cells.find(c=>c.x===-1&&c.y===-1),ne=s.cells.find(c=>c.x===1&&c.y===1);return [{label:'X',points:[{x:'Southwest',y:sw.x},{x:'Northeast',y:ne.x}]},{label:'Y',points:[{x:'Southwest',y:sw.y},{x:'Northeast',y:ne.y}]}];}
       if(kind==='empty')return [{label:'Empty',points:[]}];
       if(kind==='mixed')return [{label:'X',points:[{x:origin.x,y:origin.x}]},{label:'Y',points:[{x:'Origin',y:origin.y}]}];
       if(kind==='duplicate')return [{label:'Duplicate',points:[{x:'Origin',y:origin.x},{x:'Origin',y:origin.y}]}];
       if(kind==='numeric-negative')return [{label:'Numeric coordinates',points:[{x:west.x,y:west.x},{x:origin.x,y:origin.x}]}];
       return [{label:'X',points:[{x:'Origin',y:origin.x},{x:'West',y:west.x}]},{label:'Y',points:[{x:'Origin',y:origin.y}]}];
      };
      const spec=kind==='format-error'?{...common,monitors:[{label:'Gini',value:s=>s.gini,format:()=>{throw Error('Intentional formatter failure');}}]}:
       {...common,views:[{type:'bar',label:kind==='grouped'?'Actual field coordinates':kind,xAxis:{label:'Sample field'},yAxis:{label:'Coordinate',unit:'world units'},series}]};
      const mounted=bind(tracked,spec).mount(container);window.__authoringFixture=mounted;
      await settle(container);button(container,'Setup').click();await settle(container);await settle(container);
      const svg=container.querySelector('svg[role="img"]');
      const bars=[...(svg?.querySelectorAll('rect')??[])].map(e=>Object.fromEntries(['x','y','width','height'].map(k=>[k,Number(e.getAttribute(k))])));
      const errors=[...container.querySelectorAll('[role="alert"],[data-state="error"]')].map(e=>e.textContent);
      const text=container.innerText;
      if(['mixed','duplicate','format-error'].includes(kind)){
       const expected=kind==='mixed'?'mix numeric':kind==='duplicate'?'Duplicate category':'Intentional formatter failure';
       if(!text.includes(expected))throw Error('Expected caught host error missing: '+expected+' actual '+text);
       if(instance.read().tick!==0)throw Error('Rejected presentation advanced model');
      }else{
       if(!svg)throw Error('Missing rendered chart');
       const accessible=svg.getAttribute('aria-label')+' '+svg.textContent;
       for(const label of ['Sample field','Coordinate (world units)'])if(!accessible.includes(label))throw Error('Missing axis '+label);
       if(kind==='grouped'){
        if(bars.length!==3)throw Error('Missing series slot imputed or sample dropped');
        if(bars[0].x+bars[0].width>bars[2].x+1e-8)throw Error('Grouped series overlap');
        if(!(bars[1].height>0))throw Error('Negative bar clipped');
        if(!accessible.includes('West')||!accessible.includes('-1')||!accessible.includes('y 0'))throw Error('Signed/zero category not accessible');
       }
       if(kind==='grouped-nonzero'){if(bars.length!==4||bars[0].x+bars[0].width>bars[2].x+1e-8||!(bars[0].height>0)||!(bars[1].height>0))throw Error('Nonzero signed grouping failed');}
       if(kind==='empty'&&bars.length!==0)throw Error('Empty chart invented bars');
       if(kind==='numeric-negative'&&!(bars[0].height>0))throw Error('Legacy negative bar clipped');
      }
      return {kind,tick:instance?.read().tick,bars,text,errors,accessible:svg?.getAttribute('aria-label')};
     },{root,host,kind});
     record.fixtures.push(probe);
     if(['grouped','grouped-nonzero','format-error'].includes(kind))for(const [width,height]of [[1366,768],[390,844]])for(const colorScheme of ['light','dark']){
      await page.setViewportSize({width,height});await page.emulateMedia({colorScheme});await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(200);
      const path=`/tmp/city-library-authoring-acceptance-${host}-${kind}-${width}-${colorScheme}.png`;
      const png=await page.screenshot({path,scale:'css'});const metrics=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollY}));
      if(png.readUInt32BE(16)!==width||png.readUInt32BE(20)!==height)throw Error('Screenshot dimensions mismatch');
      record.screenshots.push({kind,path,width,height,colorScheme,pngWidth:png.readUInt32BE(16),pngHeight:png.readUInt32BE(20),metrics});
     }
    }catch(e){record.fixtures.push({kind,error:String(e)});}
   }
  }
  await page.evaluate(()=>window.__authoringFixture?.dispose());
 }finally{await context.close();}
}finally{await browser.close();await fs.writeFile('/tmp/city-library-authoring-acceptance.json',JSON.stringify(result,null,2)+'\n');}
console.log(JSON.stringify({hosts:result.hosts.map(h=>({host:h.host,harness:h.harness,fixtures:h.fixtures.map(f=>({kind:f.kind,error:f.error})),screenshots:h.screenshots.length})),pageErrors:result.errors},null,2));
if(result.errors.length||result.hosts.some(h=>h.harness?.error||h.fixtures.some(f=>f.error)))process.exitCode=1;
