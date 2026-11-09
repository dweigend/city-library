# Segregation attribution and changes

Adapted from Wilensky, U. (1997), *NetLogo Segregation model*, Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL. Original: https://ccl.northwestern.edu/netlogo/models/Segregation

Copyright 1997 Uri Wilensky. The adapted model rules and archived model are licensed under [Creative Commons Attribution-NonCommercial-ShareAlike 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/). The complete original Info, citation and license notices remain in `source.nlogox`.

Source retrieved 2026-11-05 from the official NetLogo Web asset URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Segregation.nlogox . It identifies NetLogo 7.0.4. SHA-256: `b8d983db7d7aa68e4a1ac847ef69620e7e2bc017ccaaff472a9c1f881e89eb8a`.

Changes: ordinary typed TypeScript procedures compose public City Library Agent/World/Grid/Random operations. Mulberry RNG replaces NetLogo RNG; display-only draws are omitted, so exact seeded trajectories differ. Random walk relocation remains sequential and happiness updates follow the complete movement phase. The source recursion is iterative. Setup dimensions and seed are explicit additional options. Density remains setup-only; live similarity changes recompute happiness immediately. Empty/isolated populations produce finite zero-denominator metrics. Full occupied unhappy configurations report `no-vacancy` and stop before tick rather than search indefinitely. Read-only observations and initial-plus-latest-1000-tick history are detached. Deterministic resident replacement is an explicit public fixture/intervention. Shared colored cells and the selected-resident inspector replace the source shape chooser; happiness remains available numerically and in inspection. Rendering and inspection consume no model randomness.

No new generic library implementation or NetLogo transpiler is embedded in this model. Existing City Library and shared UI code retain their own repository licensing; this notice does not relicense those independent components.
