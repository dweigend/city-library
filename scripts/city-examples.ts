const arguments_ = Bun.argv.slice(2);
const validArguments = arguments_.length === 0 || arguments_.join() === "--targets";
if (!validArguments) throw new Error("Use no arguments or --targets.");

const examples = [
  "01-household-budget",
  "02-neighborhood-heat",
  "04-scarce-resource",
  "05-shared-machine",
];
if (arguments_.length > 0) examples.push("03-generative-quarter");

for (const example of examples) {
  const process = Bun.spawn(["bun", `examples/city-simulation/${example}.ts`], {
    stdout: "inherit",
    stderr: "inherit",
  });
  if (await process.exited !== 0) throw new Error(`City example failed: ${example}`);
}
