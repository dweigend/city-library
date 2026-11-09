# Independent social-visual refactor

This pass independently reviewed the five social model/UI visual corrections in the shared `feat/mesa-mechanisms` worktree. The implementing worker handed over the files before this pass. No shared renderer, component, CSS, library contract, dependency or reference model was changed.

## Preparation and scope

The review applied both local refactoring skills with their complete shared workflow/decision references, `docs/CODING_STANDARDS.md`, the current UI design and public view contracts, and the frontend-design/shadcn-svelte instructions. Current Vercel Web Interface Guidelines were fetched into `/tmp/mesa-social-refactor-web-guidelines.md` on 2026-11-09. Fire, Traffic 2 Lanes and Preferential Attachment were read as existing projection references, not edited or treated as permission to introduce local theme literals.

The five entries are Residential Occupancy, Pedestrian Crossing Phases, Household Recycling Behavior, Zoning Scenario Comparison and Workplace/Household Membership. Existing public spatial/network primitives now form their primary views; charts, inspectors and the remaining zoning summary table support those visuals.

## Finding and correction

The zoning UI inferred pending-run capacity using `baseCap + (run >= 3 ? 2 : 0)` and selected colors by `run < 3`. That duplicated the model's scenario offset and replication grouping in presentation. A future plan change could therefore display a different scenario from the actual study.

The headless model now returns detached frozen `runPlan` records selected from the existing `experiments.replicate` plan: run ID, scenario ID and capacity. The UI reads those records for pending capacity labels, scenario color grouping and vertical headroom. This adds observation metadata only. Scenario design, seeds, study execution, measurements, stopping, completed outcomes and World ticks are unchanged. A focused regression reorders planned records to ensure the projection reads their actual capacities rather than guessing index boundaries.

## Retained decisions

- Resource tickets remain the sole source of waiting/granted/released occupancy. Schematic dwelling positions illustrate allocation counts; they do not invent domain dwelling identities or store a second allocation map.
- Crossing positions map the existing discrete waiting/crossing/arrived stages to a schematic road. They do not claim continuous walking motion. Signal color reads the observed phase.
- Recycling ring positions are deterministic presentation geometry. Node color/size read actual adoption; graph edges retain the model's original references. The UI consumes no Random draws.
- Household/workplace columns are presentation coordinates, not commute paths. The actual Graph edges continue to change through the public reassignment action. Place IDs are explicit model keys; Agent IDs remain opaque and are preserved.
- The spatial layout helpers remain cohesive named projections. No shared abstraction or new view API is justified by these distinct mechanisms. Existing palette functions supply data colors; no host or theme override was added.

## Executed checks

- `bun test tests/mesa-social-visuals.test.ts tests/mesa-models.test.ts tests/mesa-occupancy.test.ts`: **26 passed, 0 failed, 178 assertions**.
- `bun run typecheck`: **passed**, including Svelte **0 errors, 0 warnings**.
- Headless comparison against the original `4427227` captures for all five models at boundaries **0, 1, 3, 10, 30**: every pre-existing observation key and value matched exactly, including IDs; additive observation keys were permitted. No ID normalization was needed in this pass.
- `git diff --check`: passed.

This is independent source/refactor evidence. It does not establish that labels, colors or mechanisms are understandable in rendered desktop/narrow light/dark states. The coordinator owns the actual browser interactions, screenshot captures and separate independent image review. No browser tab was opened or controlled by this pass, and no commits were made.
