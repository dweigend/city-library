# Selected-model acceptance and baseline reports

A port should preserve the mechanism that makes a model worth exploring. NetLogo is the functional baseline for the selected 200 models. Every selected model needs source records, headless checks, real Chromium comparisons and independent review. Keep the evidence in Git so readers can trace results to the model and settings that produced them.

## Binding selection and evidence

The current [selection guide](../../experiments/catalog/selection/selection.md) explains the fixed 200-model scope. Its JSON and CSV source manifests remain under `experiments/catalog/selection`; `browser-catalog.json` supplies the pinned browser inventory. The immutable selection Markdown and `SHA256SUMS` are retained under `evidence/catalog/selection`, with [location metadata](../../evidence/locations.json) resolving original checksum paths. Membership, rationale, tags, source paths and order remain unchanged. Topic groups do not set implementation order; audited dependencies do. The 350 unselected rows remain in `inventory.json` with outside-current-scope status.

progress.json owns evidence-backed delivery milestones. Run `bun scripts/netlogo-progress.ts verify` and `report` after updates. Each selected path has selected, source-audited, contract-frozen, implemented, headless-verified, browser-verified, baseline-compared, research-verified and reviewed milestones with repository evidence links. A completed flag requires actual evidence; pending selection-task labels never erase established implementation evidence. Historical source/browser evidence is retained with its basis and limitations, and refreshed before current final acceptance where marked. Source-only inspection cannot establish browser or baseline completion.

## Per-model scientific research

Scientific research is a separate per-model task, carried out by a scoped research subagent for each selected model. Research dossiers for all 200 models are available under `docs/research/netlogo-web/`. Correct their sources and access limitations when new evidence calls for it. A change in implementation order does not require repeating unchanged research.

For each of the 200 canonical paths, provide an English 100–160-word scientific framing covering question, mechanism, assumptions, limitations and relation to the specific NetLogo original. Supply **exactly three distinct verified scientific publications**, each with authors, title, year, venue, DOI or stable primary URL, specific relevance and verification evidence. Prefer the original foundation, method/mechanism and relevant empirical application/validation or critical extension when appropriate; relevance takes priority over a rigid source mix. NetLogo model provenance is additional and does not count as one of the three publications. Never invent citations or DOIs. Declare abstract-only/paywalled access and do not infer scientific validation from porting. All reports, publication metadata and verification evidence remain versioned, with separate per-model research tracking.

## Per-model baseline comparison

Pin and archive the exact served NetLogo model, SHA-256, upstream revision and complete notices. Audit Procedures, Widgets, Info and any includes/assets/extensions before freezing contracts. Record and verify:

1. Initialization, default parameters, dimensions, topology and initial counts/state.
2. Equations/procedures, information available at each phase, activation and update order, births/deaths and RNG use.
3. Setup-only/live parameter effects, relevant drawing/actions and validation/adaptations.
4. Boundaries, terminal conditions, preflight versus completed-step stops and tick accounting.
5. Reporter/plot meaning, units, current distributions versus histories, missing/zero quantities and measurement purity.
6. Relevant interactive behavior: Setup/Reset, Step, Play/Pause and model-specific controls present in each system.

Run the concrete original in real Chromium as well as the City Library target. Capture paired reference/target setup and progressed screenshots at declared settings and actual observed ticks, plus appropriate desktop/mobile target states and interactions. State each actual viewport/version/source hash/seed policy. Reports must contain observed results, comparison conclusions, explicit differences, console/runtime errors and any checks that could not run. Store final reports and small targeted image evidence in Git, not only temporary paths. Source snapshots and procedure reading complement executed browser evidence; they do not replace it.

Pixel equivalence is not required. Different UI, improved interaction and architecture are encouraged while preserving functional meaning. Every material functional deviation needs its reason and evidence. Deterministic equations and invariants should be tested exactly where possible. Different RNG algorithms/call order imply different stochastic trajectories; compare appropriate mechanisms/invariants and justified outcomes, never invent seed identity. Scientific distribution equivalence needs an actual justified study if claimed.

If the reference cannot run, record the concrete error/environment and leave baseline-compared pending. If target browser automation cannot run, record the blocker and leave browser-verified pending. Complex selected models remain scope; no generic replacement simulation, stub, silent omission or source-only acceptance.

## Report shape

Each model report may be a focused section in a batch report if links remain unambiguous. Include canonical selected path and experiment slug; source revision/hash/license; headless public contract and procedures; deviations; executed shell commands/results; reference setup/progress settings and observed values with images; target setup/progress settings and observed values with images; parameter/control/terminal checks; mobile/theme checks; console/runtime findings; comparison conclusion and remaining work; independent review decision and separately recorded author responses. Link the report from its row and the batch issue/PR/commits.

No status implies another: source audit is not runtime acceptance, passing shell checks is not browser verification, screenshots are not scientific proof, and author remediation is not independent approval. Completion means every required milestone for all selected 200 is evidenced, with no unresolved final-acceptance blocker.
