# Life source attribution and proposed adaptation

Wilensky, U. (1998). *NetLogo Life model*. Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL. Original model: https://ccl.northwestern.edu/netlogo/models/Life

Copyright 1998 Uri Wilensky. Original and adapted model rules are licensed under [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/). Complete original Info, citation, credit, grant and license notices remain unchanged in source.nlogox. Independent City Library/UI code retains its own licensing.

The archived NetLogo 7.0.4 source was retrieved 2026-11-05 from immutable Galapagos revision `90be931773fcf499049247a8aaa1aecbe003654c`, path `public/modelslib/Sample Models/Computer Science/Cellular Automata/Life.nlogox`, corresponding byte-for-byte to the pinned served catalog. SHA-256: `fa55f68a3f00b9aba56b384954db875e6d3b55ea318384eecae0561c36892802`.

Proposed changes, pending implementation: readable headless TypeScript using public Grid/World/Random/run; explicit seed/dimensions/random-or-blank setup and deterministic full/single-cell interventions; Mulberry RNG, omitted order-independent shuffles; detached bounded observations and shared UI. Preserve synchronous Moore rules, fractional density and unconditional successful Life ticks. Original brush-latch/recolor interactions require explicit shared host/UI work and are not claimed delivered by headless setters. See docs/development/netlogo-grid-batch-contract.md. No implementation or target acceptance is claimed by this source archive.
