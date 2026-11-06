const phases = {
  "selected-probability": ["01-birthdays", "02-galton-box", "03-binomial-rabbits", "04-three-doors", "05-stochastic-patchwork"],
  probes: ["01-forward-vectors", "02-wrap-and-hard-endpoints", "03-three-dimensional-context", "04-nonmutating-agent-sensor", "05-validation-and-detachment"],
  distances: ["01-unbounded-measurement", "02-mixed-wrapping", "03-xyz-and-dimension-errors", "04-canonical-field-proximity", "05-finite-validation-and-purity"],
  normal: ["01-affine-normal", "02-cache-and-continuation", "03-zero-and-validation", "04-local-and-reseed", "05-overflow-and-existing-uniform"],
  summary: ["01-population-and-median", "02-sample-and-empty", "03-single-pass-and-detachment", "04-invalid-and-overflow", "05-domain-report-composition"],
  "ui-color": ["01-source-anchors", "02-floor-quantization", "03-source-cycle-wrap", "04-detached-field-projection", "05-invalid-and-large-inputs"],
  "selected-urban-feedback": ["01-positive-powers-and-normalization", "02-positive-moore-wrap", "03-path-source-setup-and-disturb", "04-cells-snapshot-and-strict-age", "05-defaults-isolation-and-atomic-fixtures"],
  "selected-urban": ["01-awareness-contact-and-expiry", "02-pollution-phases-and-stop", "03-recycling-order-and-energy", "04-defaults-isolation-and-validation", "05-live-seeking-and-cap"],
  "netlogo-grid-batch": ["01-life-synchronous-blinker", "02-fire-front-and-embers", "03-percolation-stop-and-wrap", "04-atomic-inputs-and-drawing", "05-defaults-and-isolation"],
  a1: ["01-energy-model", "02-independent-worlds", "03-membership-lifecycle", "04-copy-and-custom-state", "05-execution-errors"],
  a2a: ["01-seeded-draws", "02-population-selection", "03-stream-continuation", "04-local-randomness", "05-resource-exchange"],
  a5a: ["01-structure-and-identity", "02-direction-and-representation", "03-lifecycle-and-state", "04-synchronous-diffusion", "05-bridges-change-outcomes"],
  lab: ["01-headless-network-entry", "02-detached-observations", "03-successful-step-protocol", "04-voting-interventions-and-stop", "05-synchronous-voting-and-rules"],
  spatial: ["01-independent-space", "02-movement-and-boundaries", "03-perception", "04-copy-and-lifecycle", "05-context-and-observation"],
  grid: ["01-field-identities", "02-neighborhood-and-wrapping", "03-synchronous-diffusion", "04-canonical-occupancy", "05-synchronous-vote-composition"],
  stats: ["01-histogram-boundaries", "02-gini-known-values", "03-invalid-measurements", "04-independent-observation", "05-detached-distributions"],
  segregation: ["01-setup", "02-neighbor-metrics", "03-terminal-intervention", "04-movement", "05-validation-purity"],
  occupancy: ["01-live-movement-order", "02-canonical-lifecycle", "03-grid-reattachment", "04-source-and-boundaries", "05-observation-purity"],
  connectivity: ["01-weak-merge-lifecycle", "02-directed-strong-parts", "03-biconnected-overlap", "04-empty-and-invalid", "05-canonical-pure-observation"],
  "selected-network": ["01-directed-staging", "02-rewire-and-no-links", "03-virus-phase-and-stop", "04-atomic-fixtures", "05-defaults-and-isolation"],
};
for (const [phase, examples] of Object.entries(phases)) {
  for (const example of examples) {
    const process = Bun.spawn(["bun", `examples/${phase}/${example}.ts`], { stdout: "inherit", stderr: "inherit" });
    if (await process.exited !== 0) throw new Error(`Example failed: ${phase}/${example}`);
  }
}
