# Evolution: refactoring and further development

This folder plans how City Library grows from a modeling core into a headless construction kit for city simulations and city-builder games. Only the parts marked **accepted** or **set by owner** are decisions. Everything else is a proposal or an input. [Architecture](../ARCHITECTURE.md), [PLAN](../../PLAN.md) and the other binding documents stay authoritative until a proposal is accepted through an explicit owner decision.

## Goal

City Library becomes a headless construction kit for **city simulations and city-builder games**, made for developers:

- a neutral core for agent-based modeling;
- city systems, such as economy or energy supply, built on top of the core;
- models and games composed from those parts.

It grows step by step.

## Status legend

Every page states its status in its first lines. Where a page mixes statuses, each section heading carries its own.

| Status | Meaning |
| --- | --- |
| **Accepted** (date) | The owner accepted the content as a binding target. Binding documents reference it. |
| **Set by owner** (date) | The owner stated it as a decision or principle. |
| **Proposal** | Worked out in planning sessions, not decided. May change or be dropped. |
| **Input** | Research or material from other repositories, threads or branches. It informs proposals; it approves nothing. |

## Pages

| Page | Owns | Status |
| --- | --- | --- |
| [Principles](principles.md) | Design principles, their consequences, simplification and growth rules, the model pattern, non-goals | Principles set by owner; rules proposal |
| [Layers and API](layers-and-api.md) | Layer model, script style, model/UI split, cohort agents, engine contracts for games | Proposal |
| [Structure](structure.md) | Target repository structure, import rules, duplication rule, migration order | **Accepted 2026-11-11** |
| [Roadmap](roadmap.md) | Phase sequence, work items, existing experiments, **the one list of open questions** | Sequence set by owner; rest proposal |
| [Refactoring](refactoring.md) | Removing the NetLogo/Mesa/Salabim history, neutral core naming, lighter process, work at risk | Proposal; inventory is input |
| [Cherry-picks](cherry-picks.md) | Single ideas from the `city_game` repository, grouped by phase and track | Input |
| [Research notes](research-notes.md) | Existing city-builder and urban simulation engines, typical subsystems | Input (unverified) |

The full API specification, including planned city systems and its own [open decisions](../agent-loom/api-table.md#open-decisions), lives in [docs/agent-loom](../agent-loom/README.md). These pages link to it instead of repeating it.

## Owner decisions

All binding decisions recorded in this folder, in date order.

| Date | Decision | Recorded in |
| --- | --- | --- |
| 2026-11-10 and 2026-11-11 | Principles 1–11 (the record does not split them by date) | [Principles](principles.md#the-principles) |
| 2026-11-10 | Phase sequence: library logic first, city library step by step, then games and 3D; generative design as a separate track | [Roadmap](roadmap.md#phase-sequence) |
| 2026-11-11 | Target repository structure, import rules, duplication rule and migration order | [Structure](structure.md) |
| 2026-11-11 | Terminology: the headless core is called "core"; no coined proper names; Agent Lab keeps its name until a replacement is decided | [Naming conventions](../NAMING_CONVENTIONS.md#language-and-vocabulary) |

The API specification applies two defaults that this folder follows: city system factories use `Name.create(options)`, and library objects use `observe()` while the model contract keeps `read()`. Both remain listed as [open decisions](../agent-loom/api-table.md#open-decisions) with their alternatives.

## Terminology

These pages follow the [naming conventions](../NAMING_CONVENTIONS.md). The headless modeling core is the **core**. "Agent Loom" was its earlier working title; it survives only in the folder name `docs/agent-loom/`, in historical records and in frozen evidence. **Agent Lab** is the browser application's current name; a descriptive rename, for example "Model Lab", is an [open question](roadmap.md#open-questions).

## Session record (input)

- 2026-11-10: initial inventory of the repository by small exploration agents (library, models/UI/tests, history footprint).
- 2026-11-10: web research on city-builder simulation cores by a small research agent. Most claims came from search snippets and are unverified; see [research notes](research-notes.md).
- 2026-11-10: architecture proposals by an Opus agent. The owner's principles later overrode parts of them; [principles](principles.md#what-the-principles-override) lists which.
- 2026-11-10: `city_game` read for single ideas; see [cherry-picks](cherry-picks.md).
- 2026-11-10/11: 15 city teaching models built in the worktree branch `t3/city-simulation-models` (uncommitted). Their lessons feed the [model pattern](principles.md#model-pattern) and [roadmap](roadmap.md#existing-experiments).
- 2026-11-11: independent structure analyses by Opus 5.5 and GPT-6 Astra; the owner accepted the result as the [structure](structure.md).
- 2026-11-11: read-only survey of all worktrees and old branches; see [work at risk](refactoring.md#work-at-risk) and the [guiding questions](roadmap.md#guiding-questions-from-old-branches-input).
