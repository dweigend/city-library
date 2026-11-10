# Library refactor verification

The library refactor preserves the root TypeScript API while making validation, calculations and state transitions easier to follow. All 89 source files at baseline `429fd627724b0db9fff4da9c81d45ebde4e07fbc` were assessed. Conforming files were kept; the only added module is `src/grid/algorithms/diffusion.ts`.

## Structure

Public functions describe the main flow. Private functions name meaningful validation or calculation steps. Guard clauses handle exceptional cases without wrapping the normal flow in nested branches. Documentation records inputs, defaults, units, ownership, errors and ordering where those contracts matter.

World admission validates the full batch before attaching components. Graph generators use discriminated internal configuration and separate planners. Grid owns validation and commit; its diffusion algorithm owns the numerical calculation. Statistics preserve input-order accumulation and sort only an owned buffer. Experiment helpers expose execution phases without moving their state ownership.

This work uses local adaptations of the existing implementation, not transferred external code or new dependencies. Public examples and their assertions remain unchanged. It adds no API expansion and does not claim scientific model acceptance.

## Executed checks

The coordinator ran the following against the combined working tree:

| Command | Result |
| --- | --- |
| `bun install --frozen-lockfile` | Passed; tracked lockfile unchanged |
| `bun run check` | Passed: typecheck, 723 tests across 83 files, public examples, build and packed consumer |
| `bun run build:ui` | Passed; bundle-size advisory remains |
| `bun run build` followed by `bun run consumer` | Passed; Bun, Node ESM and ambient-free TypeScript consumers |
| `git diff --check` | Passed |

Author comparisons against the baseline and focused checks are additional evidence, not proof for all inputs. Their test counts overlap and are not added to the full-suite count.

## Independent review

Separate Opus 5.5 reviewers accepted all three implementation packages without code blockers. Gemini 3.8 Flash also accepted all three packages without blockers. Small documentation findings were corrected: Resource release errors, caller terminology, experiment tick semantics and empty-axis limitations, component ordering, rewiring draws and cost units.

The reviews cover source and focused checks. They do not certify browser behavior or authorize a merge.

## Remaining acceptance limits

All 145 Lab entries were opened in shared T3 Chromium using this checkout's dedicated development server. Setup and one step passed for 144 entries; Tijuana passed custom Setup/Cityscape step (normal GO is intentionally disabled during generation). Additional checks covered multi-step execution, Run/Pause, reset, narrow controls and browser execution of topology/statistics. Desktop and narrow Flocking screenshots were inspected. This is smoke coverage, not complete parameter, long-run or scientific acceptance.

The headless Playwright MCP sandbox startup issue is resolved. A follow-up stat confirmed root:root ownership and mode 4755; Chromium successfully opened about:blank through the configured MCP and closed cleanly. The retried sudo command still required authentication, so the permission change is not attributed to that command. The catalog-wide checks above ran in shared T3 Chromium; the follow-up MCP check establishes browser startup only.

The referenced refactoring skills were absent during implementation. New private project workflows are now available under .agents/skills and discoverable through .claude/skills; Opus 5.5 confirmed automatic discovery and readability. Earlier work does not retroactively claim conformance with these new workflows.

The known experiment empty-axis overlap/default-key defect remains a separate behavior fix. Public StudyPhase variants and public export choices are preserved. Directory-level geometry dependencies were not treated as proof of runtime module cycles.


## Configured Playwright MCP catalog verification

After the sandbox helper repair, the configured headless Chromium MCP repeated the complete 145-entry catalog smoke check against this checkout on port 32189. All 144 standard Setup/one-step flows and the Tijuana Setup/Cityscape-step flow passed. No pageerror events or rendered alerts were reported. Detailed results are in browser-mcp-results.json beside the temporary consolidated report. The final page console had no errors or warnings. This is browser smoke coverage, not long-run or scientific acceptance. An initial batch-accumulation attempt failed because tool-call globals were not retained; it was corrected and rerun, and is excluded from the success count.
