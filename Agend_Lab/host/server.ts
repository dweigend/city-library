import { fileURLToPath } from "node:url";

const configuredPort = process.env.CITY_LIBRARY_UI_PORT ?? "3100";
if (!/^\d+$/.test(configuredPort)) throw new RangeError("CITY_LIBRARY_UI_PORT must be an integer port.");
const port = Number(configuredPort);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new RangeError("CITY_LIBRARY_UI_PORT must be between 1 and 65535.");
}

const build = await Bun.build({
  entrypoints: [fileURLToPath(new URL("../ui/app.ts", import.meta.url))],
  target: "browser",
  format: "esm",
  minify: false,
});
if (!build.success) throw new AggregateError(build.logs, "UI bundle failed.");
const bundle = build.outputs[0];
if (!bundle) throw new Error("UI bundle was not produced.");
const html = await Bun.file(new URL("../index.html", import.meta.url)).text();
const javascript = await bundle.text();
const stylesheet = await Bun.file(new URL("../ui/styles.css", import.meta.url)).text();
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

const server = Bun.serve({
  hostname: process.env.CITY_LIBRARY_UI_HOST ?? "127.0.0.1",
  port,
  fetch(request) {
    const { pathname } = new URL(request.url);
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { ...headers, Allow: "GET, HEAD" } });
    }
    if (pathname === "/") {
      return new Response(request.method === "HEAD" ? null : html, {
        headers: { ...headers, "Content-Type": "text/html; charset=utf-8" },
      });
    }
    if (pathname === "/styles.css") {
      return new Response(request.method === "HEAD" ? null : stylesheet, {
        headers: { ...headers, "Content-Type": "text/css; charset=utf-8" },
      });
    }
    if (pathname === "/app.js") {
      return new Response(request.method === "HEAD" ? null : javascript, {
        headers: { ...headers, "Content-Type": "text/javascript; charset=utf-8" },
      });
    }
    if (pathname === "/favicon.ico") return new Response(null, { status: 204, headers });
    return new Response("Not found", { status: 404, headers });
  },
});
console.log(`Agent model test: ${server.url}`);
