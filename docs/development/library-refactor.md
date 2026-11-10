# Library refactor verification

The library refactor preserves the root TypeScript API while making validation, calculations and state transitions easier to follow. All 89 source files at baseline `429fd627724b0db9fff4da9c81d45ebde4e07fbc` were assessed. Conforming files were kept; the only added module is `src/grid/algorithms/diffusion.ts`.

## Structure

Public functions describe the main flow. Private functions name meaningful validation or calculation steps. Guard clauses handle exceptional cases without wrapping the normal flow in nested branches. Documentation records inputs, defaults, units, ownership, errors and ordering where those contracts matter.

World admission validates the full batch before attaching components. Graph generators use discriminated internal configuration and separate planners. Grid owns validation and commit; its diffusion algorithm owns the numerical calculation. Statistics preserve input-order accumulation and sort only an owned buffer. Experiment helpers expose execution phases without moving their state ownership.

This work uses local adaptations of the existing implementation, not transferred external code or new dependencies. The refactor preserves the public assertions; the current main branch relocates examples into public contract tests. It adds no API expansion and does not claim scientific model acceptance.

## Executed checks

The coordinator ran the following against the combined refactor before integrating the newer main branch:

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

The configured headless Playwright MCP also passed the same 145 catalog smoke flows after its sandbox helper configuration was repaired. No page errors or rendered alerts were reported.

The referenced refactoring skills were absent during implementation. New private project workflows are now available under .agents/skills and discoverable through .claude/skills; Opus 5.5 confirmed automatic discovery and readability. Earlier work does not retroactively claim conformance with these new workflows.

The known experiment empty-axis overlap/default-key defect remains a separate behavior fix. Public StudyPhase variants and public export choices are preserved. Directory-level geometry dependencies were not treated as proof of runtime module cycles.


## Current-main integration

The newer main branch was merged without conflicts. It changes model/UI integration and moves examples into public contract tests; it does not overlap the library implementation changes. After integration, real-browser Setup, one-step, ten-step and Run/Pause checks passed for Flocking, Heat Diffusion, Diffusion on a Directed Network, DES Bus Interchange and Preferential Attachment. All five advanced during Run and reported no page errors or alerts.

The current full check and UI build are rerun separately; their result is recorded when completed. Earlier source reviews cover the refactor payload, not an independent review of unrelated main changes.
