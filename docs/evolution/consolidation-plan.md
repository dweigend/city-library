# Consolidation plan: terms and contradictions

Status: **working plan set by the owner on 2026-11-11**. The orchestrator works through it step by step and ticks off each step with its result.

## Goal

One clear vocabulary across the library, the API specification, the scripts and the documentation, with every contradiction resolved. Following the [accepted structure](structure.md) and the [principles](principles.md), the system stays straightforward: no new concepts, no extra layers.

## Owner rules for terms

1. **Prefer the more universal, unopinionated verb.** `read` works for every read operation; avoid opinionated words such as `observe`.
2. **One verb per kind of operation.** Small nuances between functions do not get their own verbs. `add` and `delete` cover all membership and collection changes.
3. **Simple, consistent and understandable** in scripts, the library and the API structure.
4. **No coined proper names.** A part is named after what it is or does.

## Roles

| Role | Model | Task |
|---|---|---|
| Orchestrator | Claude (this session) | Sequence the work, decide by the owner rules, guard simplicity, commit locally |
| Read and analyse | GPT-6.1 Sol (Codex) | Inventories, contradiction lists, review of written changes |
| Write | Opus 5.5 | Edits to documentation and, where needed, code |

Every write step is reviewed by the other model family before it is accepted.

## Steps

| # | Step | Who | Done when |
|---|---|---|---|
| 1 | **Term inventory.** All verbs and nouns with competing synonyms in the public API (index.ts, ui/index.ts), the specification (docs/agent-loom, docs/ui), the binding docs and docs/evolution. For each: where it is used, whether it is delivered code or only docs, and a proposed canonical term under the owner rules. | GPT-6.1 Sol | Inventory file with counts and proposals |
| 2 | **Contradiction inventory.** Statements that contradict each other across docs/evolution, the binding docs and the specification. | GPT-6.1 Sol, in the same run as step 1 | Contradiction list with file:line |
| 3 | **Review the proposals.** Check that the canonical choices follow the owner rules and add no complexity; flag anything that would break delivered public API. | Opus 5.5 | Short review |
| 4 | **Decide the canonical vocabulary.** One table: kind of operation → term, with forbidden synonyms. Delivered public API that conflicts goes to step 7. | Orchestrator | Table fixed |
| 5 | **Apply it to the documentation.** NAMING_CONVENTIONS gets the table. The specification, binding docs and docs/evolution use only canonical terms. Every contradiction from step 2 is resolved, following the later owner decision. | Opus 5.5 | Diff ready |
| 6 | **Review the documentation diff.** Remaining synonyms, unresolved contradictions, stale content (checklist from the earlier audit), new complexity. | GPT-6.1 Sol | Clean, or findings fixed by Opus |
| 7 | **Align the delivered code.** Only where delivered public names contradict the vocabulary, as a recorded naming migration that preserves behaviour, assertions and random sequences, with `bun run typecheck` and `bun run check`. Skipped if nothing conflicts. | Opus 5.5 writes, GPT-6.1 Sol reviews | Checks green, or documented as not needed |
| 8 | **Independent final review.** AGENTS.md requires Gemini 3.8 Flash for substantial design work. | Gemini 3.8 Flash | Approved, or findings fixed |
| 9 | **Commit locally** and report. No push. | Orchestrator | Commit created |

## Progress

- [x] 1–2 Inventories (GPT-6.1 Sol: term and contradiction inventories)
- [x] 3 Review of the proposals (Opus: corrections; three code migrations found)
- [x] 4 Vocabulary decided (owner approved the code migrations, Model Lab, and Parcel → polygon now)
- [x] 5 Documentation applied (Opus)
- [x] 6 Documentation and code reviewed (GPT-6.1 Sol: code clean; one doc finding fixed by the orchestrator; target `findCycle` renamed to `cycle`)
- [x] 7 Code aligned (Opus: four renames; `bun run check` green, confirmed independently by GPT-6.1 Sol)
- [x] 8 Final review (Gemini 3.8 Flash: approve with changes; four small doc findings fixed by the orchestrator)
- [x] 9 Committed locally, not pushed
