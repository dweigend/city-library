# Binding Agent Loom target — phase one

Accepted by the user on 5 November 2026. The complete general Agent Loom core is the first development phase of City Library, implemented incrementally in this repository.

- [API table](api-table.html): complete operation/type inventory and compact contracts.
- [API reference](api-reference.html): detailed contracts and usage examples.
- [Work plan](../../PLAN.md): delivery sequence, progress and acceptance evidence.
- [Architecture](../DESIGN.md): ownership, dependency and implementation boundaries.

## Authority and completion

Both HTML documents are binding target definitions for phase one. Their signatures, defaults, units, results, mutations, errors, ownership, lifecycle and examples guide the new implementation. They are frozen source copies, not evidence that their APIs already exist. City Library currently exports no capabilities; the HTML examples are not yet executable against this repository.

The full target covers World, Agent, Grid, Field, Graph, Node, Edge, Random, Input, stats, geometry, Agenda, experiments, storage, limits, and Exports and shared types. These are the table's 16 areas, spanning City Library's Simulation, Spatial Structures, Graphs, and Data & Experiments areas. They do not create a second engine or require 16 packages.

Deliver small slices against these contracts. Track every target operation/type and its evidence before claiming completion. Work postponed to another slice remains unfinished target scope; compatibility features, codecs, advanced algorithms and continuation must not silently disappear. Do not treat the earlier historical function catalog or prototype exports as additional requirements.

If the table, reference, examples or local architecture conflict, record the exact passages and the affected operation before implementing it. Do not invent missing behavior, silently choose a conflicting interpretation, rename the API or weaken the target. Seek an explicit decision for a substantive contract change and retain the original source copies. Later explicit user decisions supersede this baseline and must be recorded separately.

## New implementation and historical evidence

Build the runtime anew here. Old `city_game` code, tests and advisory threads may help locate algorithms, edge cases and known failures; they do not define the new runtime or override this target. Evaluate relevant candidates and external libraries, retain notices for any adopted code, and verify behavior through City Library's public API. No runtime import may depend on the old checkout.

The advisory thread supplied by the user offers search assistance, not an implementation or approval: <t3-thread://v2/cb5e98d1-f255-44ff-8175-d9cf75ded5d7/d5b597da-7daf-4f76-993e-cd71270dae20>.

## Frozen source identity

Source repository: [city_game](https://github.com/dweigend/city_game), branch `t3/complete-agent-loom-api-spec`, revision `08b3efb66d0f93d023f0b1deb762578552f7b819`. Source-relative directory: `docs/agent-loom/`. The inspected source worktree was clean on 5 November 2026.

| Local file | Bytes | SHA-256 |
| --- | --- | --- |
| `api-table.html` | 202684 | `5b9b2c48c590f743b801fab47b618622d31272e8f1faed69efe3a34a70b16f11` |
| `api-reference.html` | 254280 | `35c9e984cee837f629cf2a67efaf031fff1b9cdfaf71c5f379dbbbea2d1bfc64` |

Both files are copied byte for byte. Their styles are inline; the table's relative file links point only to the adjacent reference. The reference has no relative file dependencies. Keep the pair together; accessing the historical worktree is not required to read the target. Integrity and link checks establish documentation preservation, not runtime, browser or scientific validity.

## Adoption verification

Independent review on 5 November 2026 by Antigravity `gemini-4-argon` found no blocking issues. The reviewer verified byte identity and hashes, all 16 table areas (309 operation/type rows), 1081 local HTML links/fragments and 23 local Markdown links/anchors. Typecheck and whitespace checks passed. The retained 3 November inspection in DESIGN and the 5 November adoption refer to distinct historical checkpoints; this was informational, with no correction required.

This review accepts documentation adoption only, not runtime implementation. Review evidence: <t3-thread://v2/cb5e98d1-f255-44ff-8175-d9cf75ded5d7/thread:delegated-task:command%3Amcp%3A727936d3-c33f-48e5-9e8f-2795dcf917fd%3Adelegate-task%3A97fa11f8-f5f4-4514-8c43-f5cd4b2a5bf3>.
