/** Reproducible renderer-only Chromium fixture; no selected model is substituted. */
import { resolve } from "node:path";
const root = resolve(import.meta.dir, "../..");
const entry = resolve(root, ".cache/spatial-segment-browser/entry.ts");
await Bun.write(entry, `import { mountCanvas } from ${JSON.stringify(resolve(root, "ui/views/canvas.ts"))};
const host=document.querySelector("#fixture")!;
const data={width:10,height:10,showLabels:false,
 cells:[{id:"land",x:0,y:0,color:"#ffffff"}],
 segments:[
 {from:{x:-3,y:0},to:{x:3,y:0},color:"#ff0000",width:4},
 {from:{x:0,y:-3},to:{x:0,y:3},color:"#00ff00",width:4},
 {from:{x:-3,y:-2},to:{x:3,y:-2},color:"#ffffff",width:0},
 {from:{x:-4,y:-4},to:{x:-4,y:-3}}],
 agents:[{id:"resident",x:0,y:0,color:"#0000ff",size:10}]};
let current=data;
const view=mountCanvas(host,id=>{document.querySelector("output")!.textContent=id;view.update(current,id)});
document.querySelector("#setup")!.addEventListener("click",()=>{current=data;view.update(current,null)});
document.querySelector("#empty")!.addEventListener("click",()=>{current={...data,cells:[],segments:[],agents:[]};view.update(current,null)});
view.update(current,null);
`);
const build = await Bun.build({ entrypoints: [entry], target: "browser", format: "esm" });
if (!build.success) throw new Error(build.logs.map(String).join("\n"));
const script = await build.outputs[0].text();
const html = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Spatial segment verification</title><link rel="stylesheet" href="/styles.css"><body><main style="max-width:700px;padding:16px"><button id="setup">Setup</button> <button id="empty">Clear view</button> <output aria-live="polite"></output><div id="fixture" style="max-width:672px;margin-top:16px"></div></main><script type="module" src="/fixture.js"></script></body></html>';
const server = Bun.serve({ hostname: "0.0.0.0", port: Number(process.env.CITY_SEGMENT_QA_PORT ?? 3122), fetch(request) {
 const path = new URL(request.url).pathname;
 if (path === "/fixture.js") return new Response(script, { headers: { "Content-Type": "text/javascript" } });
 if (path === "/styles.css") return new Response(Bun.file(resolve(root,"ui/agent-lab/styles.css")));
 return new Response(html, { headers: { "Content-Type": "text/html" } });
}});
console.log(`Spatial segment fixture: http://127.0.0.1:${server.port}`);
