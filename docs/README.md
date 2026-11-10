# Documentation

Start with a model, change something and see what happens. These guides take you from running a model to writing your own with City Library’s modular parts.

## Find your way

| What you want to do | Read this |
| --- | --- |
| Understand the project | [City Library](../README.md) |
| Run a model | [Agent Lab](../ui/agent-lab/README.md) |
| Write a model and connect its UI | [Model authoring](development/model-authoring.md) |
| Compose event-driven city models | [DES capabilities](development/des-feature-matrix.md) and [ten examples](development/des-examples.md) |
| Look up UI bindings | [UI API](ui/README.md) |
| Understand ownership and dependencies | [Architecture](ARCHITECTURE.md) |
| Apply system-wide names | [Naming conventions](NAMING_CONVENTIONS.md) |
| Work on the interface | [UI design](DESIGN.md) |
| Look up the headless target API | [Agent Loom](agent-loom/README.md) |
| Check delivery scope and remaining work | [Work plan](../PLAN.md) |

## Contracts and sources

The API specifications include planned operations. Check their status notes, current public exports and runnable examples before using them.

Adapted models retain their [reference sources](development/model-reference-sources.md). The [model acceptance rules](development/model-acceptance.md) distinguish headless tests, source comparisons, browser behavior and independent review.

[Source records](../models/catalog/research/README.md) describe model assumptions and provenance. [Model acceptance ledger](../models/catalog/progress.json) supports model-level verification. Use these records to inspect a source or validate a claim; the guides and specifications describe the current system and its next goals.

For [planar layouts and parcels](grid-parcels/API.md), consult the [implementation ledger](grid-parcels/STATUS.md) and [finite quad contract](grid-parcels/QUAD-LAYOUTS-CONTRACT.md). The [city authoring plan](development/example-first/PLAN.md) separates working scripts from unmet targets.
