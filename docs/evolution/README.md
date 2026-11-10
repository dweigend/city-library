# Evolution: refactoring and further development

Status: **brainstorming**. These pages collect ideas and proposals from the planning session of 2026-11-10. They are not binding. [Architecture](../ARCHITECTURE.md), [PLAN](../../PLAN.md) and the other binding documents stay authoritative until a proposal is accepted through an explicit decision.

## Goal

City Library becomes a headless construction kit for **city simulations and city-builder games**, made for developers. It has a neutral core for agent-based modeling. City, economy and other systems are built on top of it, and games and simulations are composed from those parts. It grows step by step.

## Pages

| Page | Content |
| --- | --- |
| [Principles](principles.md) | Design principles set by the owner, and what follows from them |
| [Layers and API](layers-and-api.md) | Core → systems → models; the script style; cohort agents; engine contracts for games |
| [Refactoring](refactoring.md) | Removing NetLogo/Mesa/Salabim history, neutral core naming, lighter process |
| [Roadmap](roadmap.md) | Proposed slices and open questions |
| [Research notes](research-notes.md) | Existing city-builder and urban simulation engines, and typical subsystems |

## Session record

- Initial inventory of the repository by small exploration agents (library, models/UI/tests, history footprint).
- Web research on city-builder simulation cores by a small research agent. Most claims came from search snippets and are unverified.
- Architecture proposals by an Opus agent. The owner's principles later overrode parts of them; [principles](principles.md#what-the-principles-override) lists which.
