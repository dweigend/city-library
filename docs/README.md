# Documentation

Start with a model, change something and see what happens. These pages take you from running a model to writing your own with City Library's modular parts. If you are new, read the [project README](../README.md) first.

## New here

- [Your first model](first-model.md): write a small model, run it headless and step through it in Model Lab.
- [Run Model Lab](../ui/model-lab/README.md): choose a model, run it and change its parameters.
- [Concepts](concepts.md): headless models, one state owner, steps and ticks, explicit randomness.
- [Explore the models](../models/README.md): every model by topic.

## Build

- [Write a model and connect its UI](development/model-authoring.md)
- [Compose event-driven city models](development/des-feature-matrix.md), with [ten worked examples](development/des-examples.md)
- [Measurements, studies and event-driven city models](execution-studies/STATUS.md)

## Look up

- [What works today](development/coverage.md): available library operations and open gaps.
- [UI API](ui/README.md): `defineUI`, controls, monitors and views.
- [API specification](agent-loom/README.md): the whole City Library API, with the core, city systems, UI authoring and the model contract; every entry is marked delivered, target or planned.
- [Grids, layouts and parcels](grid-parcels/STATUS.md), their [target catalogue](grid-parcels/API.md) and the [finite quad contract](grid-parcels/QUAD-LAYOUTS-CONTRACT.md). That contract preserves historical signatures; the [current naming map](grid-parcels/STATUS.md) gives the executable calls.

The specifications include planned operations. Check [what works today](development/coverage.md), the public exports and the runnable examples before relying on one.

## Understand

- [Architecture](ARCHITECTURE.md): ownership, dependencies, module layout, time and randomness.
- [Target structure](evolution/structure.md): accepted target folders, import rules and migration order; files have not moved yet.
- [Domain and time semantics](agent-loom/terminology.md): distinctions that names must preserve.
- [UI design](DESIGN.md): what the interface is for and its binding rules.
- [Network visualization](decisions/network-visualization.md): why Model Lab renders graphs the way it does.

## Contribute

- [Work plan](../PLAN.md): next work, review policy and the example-first gate.
- [Evolution](evolution/README.md): the accepted [target structure](evolution/structure.md), the owner's [development sequence](evolution/roadmap.md), and non-binding brainstorming on refactoring and further development toward city systems and games.
- [Coding standards](CODING_STANDARDS.md) and [naming conventions](NAMING_CONVENTIONS.md).
- [Git delivery workflow](development/git-workflow.md).
- [Checks and development records](development/README.md): commands, target checks and where records live.
- [Models and public contract tests](development/examples-migration.md): where contract scripts and unmet targets live.
- [City authoring extension plan](development/example-first/PLAN.md) and [research integration guide](development/example-first/RESEARCH-INTEGRATION.md): active requirements for extending the city scripts.
- [Discrete-event composition contract](development/des-contract.md). The [Mesa/Salabim integration contracts](../CROSS-TRACK-CONTRACTS.md) still carry binding DES semantics alongside their integration history.
- [Model acceptance](development/model-acceptance.md): the gates a selected model passes, from source audit to independent review.

Library contracts are linked from [what works today](development/coverage.md), UI contracts from the [UI API](ui/README.md) and model-group contracts from the [model catalog](../models/catalog/README.md).

## Sources and evidence

These are records. Use them to trace a source or check a claim; the pages above describe the current system.

- [Model catalog](../models/catalog/README.md): selection, source snapshots, the acceptance ledger and shared acceptance records.
- [Model sources and scientific context](../models/catalog/research/README.md): research dossiers and publications.
- [Model reference sources](development/model-reference-sources.md): pinned sources behind adapted models.
- [UI acceptance record](../ui/model-lab/acceptance/README.md): browser checks for the shared UI.
