# Agent Lab author examples

Status: author contracts frozen before their runtime implementation on 5 November 2026. Runtime delivery and independent approval are separate.

## Small headless definition contract

`experiments/definition.ts` exports only types: `Definition<P,M>`, `Inputs<P>` and `Input<T>`. An entry exports `model` as a plain object satisfying `Definition`, plus an ordinary exported `create` factory. No mandatory defineModel function, scheduler, registry or runtime validation engine is introduced.

Each input is a plain descriptor. Numeric descriptors contain `kind: "number"`, `default` and optional `min`, `max`, `step`, `integer`; booleans contain `kind: "boolean"` and `default`; choices contain `kind: "choice"`, `default`, `options`; text contains `kind: "text"` and `default`. The factory must use these same defaults/constraints and owns runtime validation and cross-field rules. This is not the planned live-property `Input` API.

## Lab public contracts

`experiments/preferential-attachment/model.ts`: `model.create({seed?})`, canonical default seed 1; instance `advance(steps = 1)` and `read()`. Required observations: `tick`, `nodeCount`, `edgeCount`, `nodes` in creation order (each has `id`, `degree`), `edges` (each has `id`, `from`, `to`), `randomState`. Setup has two nodes/one edge/tick zero. Each successful step adds exactly one node and one edge. Invalid/nonfinite/negative/fractional step count rejects before effects.

`experiments/voting/model.ts`: `model.create({width?, height?, seed?, changeVote?, awardCloseCallsToLoser?})`; defaults 151 x 151, seed 1, both rules false. Instance methods `advance(steps = 1)`, `setVotes(readonly number[])`, `setRules({changeVote?, awardCloseCallsToLoser?})`, `read()`. Observations include `tick`, `cells` in Grid order (each `id`, `x`, `y`, `vote`), `counts: {zero,one}`, `done`, `history: readonly {tick,zero,one}[]`, `randomState`, `parameters`.

`setVotes` validates complete length and binary values before effects, preserves tick/RNG and invalidates terminal status for reevaluation. It replaces the latest same-tick history observation, including the initial tick-zero sample; it creates no duplicate tick. `setRules` is a validated no-clock/no-RNG intervention and reopens terminal checking. Creation records tick zero. After a changed step, run commits its tick before recording; a stable no-change call sets done without invoking run, drawing randomness or adding a sample. Bounded advance stops at that point. All input validation occurs even when terminal. Snapshots remain detached after later changes. No new behavior is retrofitted into frozen legacy factories.

## Expansion phases and required closure

| Phase | Author tasks | Public operation closure |
| --- | --- | --- |
| Lab | Independent seeded entry; detached observations; successful-step/failure protocol; atomic voting interventions and terminal behavior; synchronous voting and runtime rules | Existing Agent/World/Random/run plus the two experiment entry contracts above |
| Spatial | Independent optional spaces; movement and hard boundaries; wrapped perception; spatial copy and birth/death activation snapshot; context conflicts and detached observations | `World.add(Space, options?)`, `Agent.add(state,{position,orientation})`, `move` numeric/by/to, `rotate`, `distanceTo`, `neighbors`, copy/delete, World membership, run |
| Grid | Field identity/independent state; lookup and degenerate neighborhoods; simultaneous diffusion; canonical explicit-source occupancy; caller-authored synchronous update | `Grid.add`, `fields`, field `grid/x/y`, `fieldAt`, `neighbors`, `diffuse`, `agentsAt`; spatial Agent construction/movement for occupancy |

The synchronous-vote composition in the Grid phase is an explicitly caller-defined tie-flip rule. The separate Lab Voting scripts define the NetLogo-specific close-call and tie rules. Do not conflate their outcomes.

## Initial executed evidence

- `bun run typecheck`: passed against the existing configured project includes. The new example folders were not yet in those includes; this is not a claim that new absent APIs typecheck.
- `bunx tsc --ignoreConfig --noEmit --strict --target ESNext --module Preserve --moduleResolution bundler --allowImportingTsExtensions --skipLibCheck experiments/definition.ts`: passed. An initial invocation without `--ignoreConfig` was rejected by TypeScript 7 with TS5112; the corrected invocation is the evidence above.
- Every one of the 15 scripts below was invoked individually with `bun run <path>` before runtime delivery.
- Lab 03 passed using real existing public Agent/World/run operations. Lab 01/02/04/05 failed as expected because the public experiment entry modules do not exist.
- All five Spatial scripts failed as expected because spatial World/Agent construction is not delivered.
- All five Grid scripts failed as expected because `Grid` is not exported.
- No mocks, runtime stubs, disabled assertions or private library imports were introduced. No browser evidence is claimed for these headless author scripts.

## Frozen SHA-256 fingerprints

Implementation must satisfy these examples without weakening their syntax or expected results. Substantive changes require the project's explicit change process.

| File | SHA-256 |
| --- | --- |
| `experiments/definition.ts` | `7f03e146a91ef8f15cb798f5c54536bc2e51db1fa24d2d2886082f5be9602455` |
| `examples/lab/01-headless-network-entry.ts` | `ab83ae65ab1f88620527c670e973ba54ab3b2c445e3f9164dbdca1799ce32e98` |
| `examples/lab/02-detached-observations.ts` | `97117db2d6c84f01122b926fe3c9eb4d0b4b0d2d394ad369ce6d2d97efb8aad8` |
| `examples/lab/03-successful-step-protocol.ts` | `4c6d56d33d63fbbf401a938a65fdde0cdbd9bd9b8f222b5b3bd1543daa4e39a2` |
| `examples/lab/04-voting-interventions-and-stop.ts` | `88f785515b13a7d52efd732e2b6bba6d581b8f8d1cb852f013bc3fe8337cf330` |
| `examples/lab/05-synchronous-voting-and-rules.ts` | `e1a028398bb1418b37178bceab309f048ac8a10d135332330d479cb9151f2bb9` |
| `examples/spatial/01-independent-space.ts` | `78abf14fc012ed6ce6ee9183592c5b807be4000bf73c1b1694254d66947a77ee` |
| `examples/spatial/02-movement-and-boundaries.ts` | `15abd0abee24744d9e62a5284767ac92601ae6019b5dfbcd9bf59c7bedcc584a` |
| `examples/spatial/03-perception.ts` | `6228351f62f48082db8af48e2513e316a67007a501d0455aa600252ea8ac9bb0` |
| `examples/spatial/04-copy-and-lifecycle.ts` | `d76ce0e12bcf66b0ef3f32b3bba66b0fa4f1ca296af10441790609496b96e01b` |
| `examples/spatial/05-context-and-observation.ts` | `bcc44122de94d43ead20a6b9ca7ee76018a21c98a67a5d94b7f7589a4d1fb6d1` |
| `examples/grid/01-field-identities.ts` | `a1e08ece48cc60031223e2bfe96d445e51b0788e8ba88eb2879a842230192184` |
| `examples/grid/02-neighborhood-and-wrapping.ts` | `76183d924a08de8ee08158b7d98cb2adcaa4fa2aeedf1b96ff51056672973b12` |
| `examples/grid/03-synchronous-diffusion.ts` | `31c15ff43e5726334d06f4452dd0fa7189e5f182b5bcd4940be9ad8888fe6b61` |
| `examples/grid/04-canonical-occupancy.ts` | `2f4a891690f92cea99ded2b4abc750cdfcc64e09ff2e7cfb5aaeeb050e4e2543` |
| `examples/grid/05-synchronous-vote-composition.ts` | `7a4469f83b8a8ec1c35ab25c870de5182e93df46ae468acf4fdb456803d1f28c` |
