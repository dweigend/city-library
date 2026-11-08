# Catalog integration reconciliation

This record distinguishes integrated files from model acceptance. The integrated catalog has 125 paired model/UI entries. Twenty evolutionary and molecular/disease entries were already present while their implementation milestones remained false. Their implementation evidence now points directly to their model and UI modules. Source, contract, headless, browser, baseline and review milestones for these entries are unchanged.

## Crystallization example correction

The [original authorization record](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/materials-approved-correction.md) records explicit user agreement on 6 November 2026 to change only the frozen example's numFrozen expectation from 1 to 0 at temperature 390/tick 1. The original source fixture already returned 0. That record reports all five approved scripts and focused tests passing; the [retained integration report](selected-materials-integration.md) explicitly supersedes its older pending statements.

On 8 November 2026, the integrated runtime from `eafa568` (with documentation-only follow-ups through `b44a92e`) passed the full `bun run check`: all registered public examples, 619 tests, type checks, build and packed consumers. The ledger therefore records the Crystallization headless gate as complete. No runtime, UI or accepted assertion was changed during this reconciliation. Scientific parity and independent model approval remain separate; Crystallization's reviewed milestone stays false. The unrelated Blood Sugar example discrepancy remains unresolved.
