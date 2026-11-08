# Indexed canonical occupancy queries

This performance slice implements the existing `grid.agentsAt(field)` contract efficiently for World-owned grids. There is no new public API, new positional state or writable occupancy collection. The binding reference requires canonical references, duplicate-free first-source ordering, validation of the complete source and position-derived occupancy. Existing explicit-source and detached behavior remains unchanged.

## Ownership and lifecycle

Agent spatial coordinates remain the only position authority; World remains the membership authority. An internal derived Grid index may observe canonical movement, admission, detachment and deletion through private lifecycle coordination. It must release listeners on Grid detachment and rebuild when attached to another World. Failed movement/admission/deletion must leave queries consistent with actual canonical state. Detach preserves Agent identity; copy starts detached and enters queries only after admission. Grid creation or queries cannot move an Agent, change World time, consume RNG or alter public iteration ordering.

Implicit queries use current World insertion order. An Agent moving away and back cannot reorder it. Reattaching an already attached member cannot reorder it. Detach and re-add places it at the new World insertion position. Returned arrays are frozen snapshots of live canonical references. An explicit source always overrides World membership, including source-order, duplicates, foreign agents and invalid-input semantics. Grid boundaries/cell sizes/2D and 3D behavior remain as specified. A World without Space may contain mixed dimensions: implicit queries must still reject any dimension mismatch, even if that Agent is outside the requested cell or deleted only after a previously failed query.

Five asserted scripts below are frozen before runtime handoff. They cover movement/order, admission/deletion/copy, Grid detachment/reattachment, source override/boundaries/dimensional failure, and observation/RNG purity. They exercise only existing public contracts. Relevant pre-existing spatial and Grid examples remain accepted unchanged.

## Performance and model application

Segregation may use implicit occupancy because its World contains exactly its resident population and membership does not change during relocation. The frozen unhappy activation snapshot still controls who moves; occupancy must see preceding moves immediately. Compare identical seeded trajectories before/after the optimization using positions/groups/happiness, counters/history and RNG continuation, excluding process-local IDs. Measure actual default setup and first-step latency; do not assert wall-clock timing as scientific correctness. No uniform empty-cell shortcut or source-rule change is permitted.
