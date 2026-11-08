const examples = [
  "01-finite-hex-refinement",
  "02-square-target-first-step",
  "03-validation-and-failure",
  "04-continuation-and-revisions",
  "05-explicit-grid-state-copy",
];

for (const example of examples) {
  const child = Bun.spawn(["bun", `examples/townscaper-grid/${example}.ts`], {
    stdout: "inherit",
    stderr: "inherit",
  });
  if (await child.exited !== 0) throw new Error(`Townscaper example failed: ${example}`);
}
