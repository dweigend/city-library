const arguments_ = Bun.argv.slice(2);
const targets = arguments_.includes("--targets");
const city = arguments_.includes("--city");
const quadLayouts = arguments_.includes("--quad-layouts");
if (new Set(arguments_).size !== arguments_.length ||
    arguments_.some(argument => !["--city", "--quad-layouts", "--targets"].includes(argument)) ||
    (city && quadLayouts) || (quadLayouts && targets)) {
  throw new Error("Use --city, --quad-layouts, --targets or --city --targets.");
}
const examples = [...new Bun.Glob("examples/*/[0-9][0-9]-*.ts").scanSync()].sort();
let executedCount = 0;
for (const path of examples) {
  const phase = path.split("/")[1];
  if (city && phase !== "city-simulation") continue;
  if (quadLayouts && phase !== "quad-layouts") continue;
  const target = phase === "giant-component" || path === "examples/city-simulation/03-generative-quarter.ts";
  if (target && !targets) continue;
  executedCount += 1;
  const child = Bun.spawn(["bun", path], { stdout: "inherit", stderr: "inherit" });
  const exitCode = await child.exited;
  if (exitCode !== 0) throw new Error(`Example failed: ${path} (exit ${exitCode}, signal ${child.signalCode ?? "none"})`);
}

if (executedCount === 0) throw new Error("No examples matched the requested capability.");
