const arguments_ = Bun.argv.slice(2);
const targets = arguments_.includes("--targets");
const city = arguments_.includes("--city");
const quadLayouts = arguments_.includes("--quad-layouts");
if (new Set(arguments_).size !== arguments_.length ||
    arguments_.some(argument => !["--city", "--quad-layouts", "--targets"].includes(argument)) ||
    (city && quadLayouts) || (quadLayouts && targets)) {
  throw new Error("Use --city, --quad-layouts, --targets or --city --targets.");
}

const patterns = targets
  ? ["tests/targets/*/[0-9][0-9]-*.ts"]
  : ["tests/public-contracts/*/[0-9][0-9]-*.ts", "tests/ui/*/[0-9][0-9]-*.ts"];
const contracts = patterns.flatMap(pattern => [...new Bun.Glob(pattern).scanSync()]).sort();
let executedCount = 0;
for (const path of contracts) {
  const group = path.split("/")[2];
  if (city && group !== "city-simulation") continue;
  if (quadLayouts && group !== "quad-layouts") continue;
  executedCount += 1;
  const child = Bun.spawn(["bun", path], { stdout: "inherit", stderr: "inherit" });
  const exitCode = await child.exited;
  if (exitCode !== 0) throw new Error(`Public contract failed: ${path} (exit ${exitCode}, signal ${child.signalCode ?? "none"})`);
}
console.log(`Public contracts passed (${contracts.filter(path => (!city || path.includes('/city-simulation/')) && (!quadLayouts || path.includes('/quad-layouts/'))).length} scripts).`);

if (executedCount === 0) throw new Error("No public contracts matched the requested capability.");
