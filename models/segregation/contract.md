# Segregation model

Source: official served `assets/modelslib/Sample Models/Social Science/Segregation.nlogox`, retrieved 2026-11-05; archived unchanged in models/segregation/source.nlogox. Source identifies NetLogo 7.0.4. Copyright 1997 Uri Wilensky, CC BY-NC-SA 3.0; retain complete source notices. This is a TypeScript adaptation, not a NetLogo runtime.

## Public composition contract

`models/segregation/model.ts` exports `create`, `inputs`, `model`. Options: width/height default 51, integer 3..101; seed default 1 with existing reference bounds; density default 95, integer 50..99; similarWanted default 30, integer 0..100. Width/height/seed/density are setup-only. `setRules({similarWanted})` atomically validates, recomputes happiness and same-tick measurements. Existing public Agent, World, Grid and Random suffice; no core expansion is authorized by this slice without a separate example-first gate.

`read()` returns detached frozen snapshots: tick, width, height, parameters, residents (id, x, y, group blue/orange, happy, similarNearby, otherNearby, totalNearby), counts (population, unhappy), percentSimilar, percentUnhappy, done, stopReason, history, randomState. History retains setup plus latest 1000 completed ticks; interventions replace latest same-tick sample. Rendering consumes no RNG.

`setResidents([{x,y,group}, ...])` is an explicit deterministic fixture/intervention, analogous to Voting.setVotes. Require unique exact grid centers and valid groups; validate the entire input before mutation. It replaces residents, recomputes observations, preserves tick, and updates the same-tick history. Agent/World own membership and positions; no parallel writable occupancy state. `advance(count=1)` uses existing stepCount validation before any action.

## Source mechanisms

Setup visits patches in randomized order, with integer random(100)<density, then equal-probability blue/orange. Residents start with independent random integer headings. Toroidal Moore neighbors exclude the own cell. Happiness is similarNearby >= similarWanted*totalNearby/100; isolated residents are happy. Percent similar is the ratio of SUM similarNearby to SUM totalNearby, times 100, not the average of resident percentages.

Go stops before tick if all residents happy. Freeze unhappy membership before activation, shuffle it, and move each sequentially. For each attempt turn clockwise by random-float(360), advance random-float(10), repeat while another resident occupies the resulting cell, then snap to that cell center. Do not replace this walk with direct uniform empty-cell selection. Use public Grid occupancy and movement. Recompute all happiness only after all moves, then metrics, successful run tick and history. Preserve identity, groups and population across moves. Live threshold changes can restart a stopped state. Tick is not incremented for preflight stops.

## Explicit adaptations and bounds

Mulberry RNG and omitted display-only draws mean seeded trajectories differ from NetLogo. Neutral shared grid glyphs replace old/square-X visualizations; group color plus inspector happiness expose state. Empty population and zero neighbor denominator yield 0 metrics instead of the source division error. A full occupied grid with unhappy residents stops with `no-vacancy` before movement/tick rather than entering the source's unbounded recursion. Iterative random walk avoids JavaScript recursion depth; any safety budget must be explicit, reported, and must not silently select another relocation algorithm. No scientific equivalence is claimed from screenshots alone.

## Public examples

Public model scripts under `examples/segregation/` cover: setup/repeatability; known weighted neighbor metrics; terminal/intervention rules; movement invariants; validation and observation purity. Their syntax and expectations are frozen; runtime must satisfy them. These examples verify the model composition.
