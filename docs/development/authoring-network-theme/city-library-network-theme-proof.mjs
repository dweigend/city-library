import { chromium } from '/home/david/.local/share/codex-playwright-mcp/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const stage=process.argv[2]??'before';
const root='/home/david/.t3/worktrees/city-library/experiment-netlogo-web-catalog';
const browser=await chromium.launch({executablePath:'/home/david/.local/share/codex-playwright-browsers/chromium-1247/chrome-linux64/chrome',headless:true,args:['--no-sandbox']});
const result={stage,root,records:[],pageErrors:[],startedAt:new Date().toISOString()};
try {
 for(const width of [1366,390]) {
  const context=await browser.newContext({viewport:{width,height:width===1366?768:844},deviceScaleFactor:1,colorScheme:'light'});
  try {
   const page=await context.newPage();page.on('pageerror',error=>result.pageErrors.push({width,message:error.message}));
   const settle=async()=>{await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await page.waitForTimeout(150);};
   const setup=async()=>{await page.goto('http://127.0.0.1:3110/?experiment=preferential-attachment');await page.getByRole('button',{name:'Setup',exact:true}).click();await page.locator('.model-network').waitFor();await page.getByRole('button',{name:'10 steps',exact:true}).click();await settle();};
   const capture=async(name)=>{
    const metrics=await page.evaluate(async root=>{
     const element=document.querySelector('.model-network'),cy=element._cyreg.cy;
     const {readRendererTheme}=await import('/@fs/'+root+'/ui/svelte/views/theme.ts');
     const resolved=readRendererTheme(element);
     const probe=document.createElement('canvas');probe.width=probe.height=1;const ctx=probe.getContext('2d');
     const rgba=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data];};
     return {mediaDark:matchMedia('(prefers-color-scheme:dark)').matches,width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth,expectedLabel:rgba(resolved.muted),actualLabel:rgba(cy.nodes()[0].style('color')),background:rgba(getComputedStyle(element).backgroundColor),labelColors:[...new Set(cy.nodes().map(node=>node.style('color')))],nodeColors:[...new Set(cy.nodes().map(node=>node.data('color')))],nodes:cy.nodes().length,edges:cy.edges().length,monitor:[...document.querySelectorAll('dd')].slice(0,3).map(dd=>dd.textContent)};
    },root);
    const linear=v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;};
    const luminance=rgb=>rgb.slice(0,3).map(linear).reduce((sum,value,i)=>sum+value*[.2126,.7152,.0722][i],0);
    const a=luminance(metrics.actualLabel),b=luminance(metrics.background);metrics.contrast=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);metrics.matches=metrics.actualLabel.join(',')===metrics.expectedLabel.join(',');
    const screenshot=`/tmp/city-library-network-theme-${stage}-${width}-${name}.png`;await page.screenshot({path:screenshot});const png=await fs.readFile(screenshot);metrics.png=[png.readUInt32BE(16),png.readUInt32BE(20)];
    result.records.push({width,name,...metrics,screenshot});
   };
   await setup();await capture('fresh-light');
   await page.emulateMedia({colorScheme:'dark'});await settle();await capture('live-dark');
   await setup();await capture('fresh-dark');
   await page.emulateMedia({colorScheme:'light'});await settle();await capture('live-light');
  }finally{await context.close();}
 }
}finally{await browser.close();await fs.writeFile(`/tmp/city-library-network-theme-${stage}.json`,JSON.stringify(result,null,2));}
console.log(JSON.stringify(result));
if(stage==='after'&&(result.pageErrors.length||result.records.some(record=>!record.matches||record.contrast<4.5||record.overflow)))process.exitCode=1;
