# Evolution: refactoring and further development

Status: mixed. [Structure](structure.md) was accepted by the owner on 2026-11-11, and the [principles](principles.md) and the phase sequence in the [roadmap](roadmap.md) were set by the owner. Everything else collects ideas and proposals from the planning sessions of 2026-11-10 and 2026-11-11 and is not binding. [Architecture](../ARCHITECTURE.md), [PLAN](../../PLAN.md) and the other binding documents stay authoritative until a proposal is accepted through an explicit decision.

## Goal

City Library becomes a headless construction kit for **city simulations and city-builder games**, made for developers. It has a neutral core for agent-based modeling. City, economy and other systems are built on top of it, and games and simulations are composed from those parts. It grows step by step.

## Pages

| Page | Content |
| --- | --- |
| [Principles](principles.md) | Design principles set by the owner, and what follows from them |
| [Layers and API](layers-and-api.md) | Core → systems → models; the script style; cohort agents; engine contracts for games |
| [Refactoring](refactoring.md) | Removing NetLogo/Mesa/Salabim history, neutral core naming, lighter process |
| [Structure](structure.md) | Accepted target repository structure, import rules and migration order |
| [Roadmap](roadmap.md) | Phase sequence, work items and open questions |
| [Cherry-picks](cherry-picks.md) | Single ideas from the `city_game` repository, grouped by phase and track |
| [Research notes](research-notes.md) | Existing city-builder and urban simulation engines, and typical subsystems |

## Session record

- Initial inventory of the repository by small exploration agents (library, models/UI/tests, history footprint).
- Web research on city-builder simulation cores by a small research agent. Most claims came from search snippets and are unverified.
- Architecture proposals by an Opus agent. The owner's principles later overrode parts of them; [principles](principles.md#what-the-principles-override) lists which.
