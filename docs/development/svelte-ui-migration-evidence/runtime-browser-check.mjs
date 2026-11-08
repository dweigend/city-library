import { writeFile } from 'node:fs/promises';
const evidence='/home/david/.t3/worktrees/city-library/experiment-netlogo-web-catalog/docs/development/svelte-ui-migration-evidence';
const target=await (await fetch('http://127.0.0.1:9311/json/new?about:blank',{method:'PUT'})).json();
const socket=new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
let seq=0; const pending=new Map();const exceptions=[];
socket.addEventListener('message',event=>{const data=JSON.parse(event.data);if(data.method==='Runtime.exceptionThrown')exceptions.push(data.params.exceptionDetails);if(data.id&&pending.has(data.id)){const {resolve,reject}=pending.get(data.id);pending.delete(data.id);if(data.error)reject(new Error(JSON.stringify(data.error)));else resolve(data.result);}});
function send(method,params={}){return new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});}
async function evaluate(expression){const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));return result.result.value;}
async function until(expression){for(let i=0;i<150;i++){if(await evaluate(expression))return;await new Promise(r=>setTimeout(r,100));}throw new Error('Timeout: '+expression);}
async function frame(){await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');}
async function click(expression){const rect=await evaluate(`(()=>{const el=${expression};if(!el)throw Error('Missing target');el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...rect});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...rect});await frame();}
async function fill(selector,text){await evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});el.focus();el.select();})()`);await send('Input.insertText',{text});await frame();}
const button=name=>`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(name)})`;
const states=[];const checks=[];
async function capture(name,width,height,theme){await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:theme}]});await frame();await new Promise(r=>setTimeout(r,220));await evaluate('scrollTo(0,0)');const result=await send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});const png=Buffer.from(result.data,'base64');const path=`${evidence}/runtime-${name}.png`;await writeFile(path,png);const state=await evaluate(`({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,theme:matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light',model:new URL(location.href).searchParams.get('experiment'),modern:!!document.querySelector('.lab-workbench'),monitors:document.querySelector('.lab-monitors')?.innerText??'',pending:document.querySelector('button[type=submit]')?.textContent,overflow:document.documentElement.scrollWidth>innerWidth})`);states.push({path,png_width:png.readUInt32BE(16),png_height:png.readUInt32BE(20),state});}
try{
await send('Page.enable');await send('Runtime.enable');await send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url:'http://127.0.0.1:3102/?experiment=virus-on-a-network'});
await until(`document.querySelector('.lab-workbench') && document.querySelector('input[name=numberOfNodes]')`);
await capture('desktop-light-empty',1366,768,'light');
await click(`document.querySelector('button[type=submit]')`);
await until(`document.querySelector('.lab-monitors')?.textContent.includes('Tick')`);
await click(button('10 steps'));
const tick=await evaluate(`document.querySelector('.lab-monitors dd').textContent`);if(tick!=='10')throw Error('Expected Tick10 got'+tick);checks.push('Setup Virus and ten steps -> Tick10');
await capture('desktop-light-initialized',1366,768,'light');
await fill('input[name=numberOfNodes]','200');
await until(`document.querySelector('button[type=submit]').textContent==='Restart with changes'`);
const counts=await evaluate(`[...document.querySelectorAll('.lab-monitors dd')].slice(1).reduce((n,el)=>n+Number(el.textContent),0)`);if(counts!==150)throw Error('Pending draft changed active count'+counts);checks.push('Nodes draft200 preserves active150; pending restart visible');
await capture('desktop-light-pending',1366,768,'light');await capture('desktop-dark-pending',1366,768,'dark');
await click(button('Run'));await until(`Number(document.querySelector('.lab-monitors dd').textContent)>10`);await click(button('Pause'));
const paused=await evaluate(`document.querySelector('.lab-monitors dd').textContent`);await new Promise(r=>setTimeout(r,350));const later=await evaluate(`document.querySelector('.lab-monitors dd').textContent`);if(paused!==later)throw Error('Pause did not stop tick');checks.push('Run advances and Pause stops subsequent ticks');
await click(`document.querySelector('button[type=submit]')`);const restarted=await evaluate(`[...document.querySelectorAll('.lab-monitors dd')].slice(1).reduce((n,el)=>n+Number(el.textContent),0)`);if(restarted!==200)throw Error('Restart did not apply Nodes200');checks.push('Explicit restart applies Nodes200');
await fill('input[name=spreadChance]','7');await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await frame();const live=await evaluate(`document.querySelector('input[name=spreadChance]').value`);if(live!=='7')throw Error('Live change did not persist');checks.push('Live numeric edit7 committed by keyboard blur');
await fill('input[type=search]','Anisogamy');await click(`document.querySelector('.lab-chooser [data-slot=select-trigger]')`);await until(`document.querySelector('[data-slot=select-item]')`);await click(`document.querySelector('[data-slot=select-item]')`);await until(`new URL(location.href).searchParams.get('experiment')==='anisogamy' && document.querySelector('.lab-workbench')`);checks.push('Search and keyboard-accessible catalog select switches model; URL updated');
await capture('narrow-light-empty',390,844,'light');await click(`document.querySelector('button[type=submit]')`);await click(button('10 steps'));await capture('narrow-light-initialized',390,844,'light');await capture('narrow-dark-initialized',390,844,'dark');await click(button('Parameters'));await capture('narrow-dark-parameters',390,844,'dark');
await capture('desktop-dark-anisogamy',1366,768,'dark');
const overflow=states.filter(s=>s.state.overflow);if(overflow.length)throw Error('Horizontal overflow '+overflow.map(s=>s.path).join(','));
if(exceptions.length)throw Error('Browser exceptions '+JSON.stringify(exceptions));
await writeFile(`${evidence}/runtime-browser-capture.json`,JSON.stringify({captured_at:new Date().toISOString(),method:'Isolated Chromium CDP fallback after preview captures returned1280x720 regardless viewport and configured Playwright MCP SUID sandbox launch failed; actual trusted mouse/key interactions',checks,exceptions,states},null,2)+'\n');
console.log(JSON.stringify({checks,exceptions,states},null,2));
}finally{await send('Page.close').catch(()=>{});socket.close();}
