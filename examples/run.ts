const arguments_ = Bun.argv.slice(2);
const targets = arguments_.includes("--targets");
const city = arguments_.includes("--city");
const townscaper = arguments_.includes("--townscaper");
if (new Set(arguments_).size !== arguments_.length ||
    arguments_.some(argument => !["--city", "--townscaper", "--targets"].includes(argument)) ||
    (city && townscaper) || (townscaper && targets)) {
  throw new Error("Use --city, --townscaper, --targets or --city --targets.");
}
const examples = [...new Bun.Glob("examples/*/[0-9][0-9]-*.ts").scanSync()].sort();
for (const path of examples) {
  const phase = path.split("/")[1];
  if (city && phase !== "city-simulation") continue;
  if (townscaper && phase !== "townscaper-grid") continue;
  const target = phase === "giant-component" || path === "examples/city-simulation/03-generative-quarter.ts";
  if (target && !targets) continue;
  const child = Bun.spawn(["bun", path], { stdout: "inherit", stderr: "inherit" });
  const exitCode = await child.exited;
  if (exitCode !== 0) throw new Error(`Example failed: ${path} (exit ${exitCode}, signal ${child.signalCode ?? "none"})`);
}
