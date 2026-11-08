# Percolation source attribution and adaptation

Wilensky, U. (1998). *NetLogo Percolation model*. Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL. Original model: https://ccl.northwestern.edu/netlogo/models/Percolation

Copyright 1998 Uri Wilensky. Original and adapted model rules are licensed under [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/). Complete original Info, citation, grant, conversion and license notices remain unchanged in source.nlogox. Independent City Library/UI code retains its own licensing.

The archived NetLogo 7.0.4 source was retrieved 2026-11-05 from immutable Galapagos revision `90be931773fcf499049247a8aaa1aecbe003654c`, path `public/modelslib/Sample Models/Earth Science/Percolation.nlogox`, corresponding byte-for-byte to the pinned served catalog. SHA-256: `61523cdd4661611bdfb14fdb812c1c6601c9befb27a2ab0a1802766724062e3a`.

Implemented adaptations: readable headless TypeScript using public Grid/World/Random/run; centered Grid coordinates explicitly mapped to source column/row indices; additional seed/dimensions (odd target heights preserve checkerboard phase) and deterministic top-front fixture; Mulberry RNG and omitted order-independent/reset/y-test draws; detached bounded observations and shared UI. Preserve sequential repeated entry attempts from different parents, live porosity, hard x/wrapped y, pre-tick empty-front stop and bottom-to-top camera wrap. See the [grid model contract](../../docs/development/netlogo-grid-batch-contract.md), [source comparisons](../../evidence/development/selected-grid-batch-report.md) and [acceptance ledger](../catalog/progress.json). The source archive itself is unchanged.
