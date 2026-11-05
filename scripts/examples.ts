const phases = {
  a1: ["01-energy-model", "02-independent-worlds", "03-membership-lifecycle", "04-copy-and-custom-state", "05-execution-errors"],
  a2a: ["01-seeded-draws", "02-population-selection", "03-stream-continuation", "04-local-randomness", "05-resource-exchange"],
  a5a: ["01-structure-and-identity", "02-direction-and-representation", "03-lifecycle-and-state", "04-synchronous-diffusion", "05-bridges-change-outcomes"],
};
for (const [phase, examples] of Object.entries(phases)) {
  for (const example of examples) {
    const process = Bun.spawn(["bun", `examples/${phase}/${example}.ts`], { stdout: "inherit", stderr: "inherit" });
    if (await process.exited !== 0) throw new Error(`Example failed: ${phase}/${example}`);
  }
}
