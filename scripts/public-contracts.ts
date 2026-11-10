const arguments_ = Bun.argv.slice(2);
const targets = arguments_.includes("--targets");
const city = arguments_.includes("--city");
const townscaper = arguments_.includes("--townscaper");
if (new Set(arguments_).size !== arguments_.length ||
    arguments_.some(argument => !["--city", "--townscaper", "--targets"].includes(argument)) ||
    (city && townscaper) || (townscaper && targets)) {
  throw new Error("Use --city, --townscaper, --targets or --city --targets.");
}

const patterns = targets
  ? ["tests/targets/*/[0-9][0-9]-*.ts"]
  : ["tests/public-contracts/*/[0-9][0-9]-*.ts", "tests/ui/*/[0-9][0-9]-*.ts"];
const contracts = patterns.flatMap(pattern => [...new Bun.Glob(pattern).scanSync()]).sort();
for (const path of contracts) {
  const group = path.split("/")[2];
  if (city && group !== "city-simulation") continue;
  if (townscaper && group !== "townscaper-grid") continue;
  const child = Bun.spawn(["bun", path], { stdout: "inherit", stderr: "inherit" });
  const exitCode = await child.exited;
  if (exitCode !== 0) throw new Error(`Public contract failed: ${path} (exit ${exitCode}, signal ${child.signalCode ?? "none"})`);
}
console.log(`Public contracts passed (${contracts.filter(path => (!city || path.includes('/city-simulation/')) && (!townscaper || path.includes('/townscaper-grid/'))).length} scripts).`);
