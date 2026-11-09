# Fire source attribution and adaptation

Wilensky, U. (1997). *NetLogo Fire model*. Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL. Original model: https://ccl.northwestern.edu/netlogo/models/Fire

Copyright 1997 Uri Wilensky. Original and adapted model rules are licensed under [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/). Complete original Info, citation, grant, conversion and license notices remain unchanged in source.nlogox. Independent City Library/UI code retains its own licensing.

The archived NetLogo 7.0.4 source was retrieved 2026-11-05 from immutable Galapagos revision `90be931773fcf499049247a8aaa1aecbe003654c`, path `public/modelslib/Sample Models/Earth Science/Fire.nlogox`, corresponding byte-for-byte to the pinned served catalog. SHA-256: `0a2420e463481fb2cd7791aacdc068735db0d900c14d3fece0a93a085246b171`.

Implemented adaptations: readable headless TypeScript using public Grid/World/Random/run and canonical field-owned fire/ember phases instead of stationary turtles; explicit seed/dimensions and deterministic forest fixture; Mulberry RNG, omitted order-independent/display draws; zero-initial-tree percentage guard; detached bounded observations and shared UI. Preserve source left-edge ignition accounting, four-neighbor snapshot propagation and complete ember lifetime before stopping. See the [grid model contract](../../docs/development/netlogo-grid-batch-contract.md), [source comparisons](../catalog/acceptance/selected-grid-batch-report.md) and [acceptance ledger](../catalog/progress.json). The source archive itself is unchanged.
