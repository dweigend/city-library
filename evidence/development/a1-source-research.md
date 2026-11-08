# A1 source research and implementation decision

The user explicitly requested research through the existing advisory agent. Research completed read-only on 5 November 2026 against city_game revision `08b3efb66d0f93d023f0b1deb762578552f7b819`. No old tests were executed, no source changed and no runtime code transferred. Source evidence is not target acceptance.

Research thread: <t3-thread://v2/cb5e98d1-f255-44ff-8175-d9cf75ded5d7/d5b597da-7daf-4f76-993e-cd71270dae20>.

## Findings and selected response

All paths below are relative to [the inspected source revision](https://github.com/dweigend/city_game/tree/08b3efb66d0f93d023f0b1deb762578552f7b819).

| Source | Finding | A1 response |
| --- | --- | --- |
| `netlogo-ts/src/lib/core/turtles.ts`: createTurtles, die, hatch | Creation attaches to World and draws heading; mutable numeric IDs, vars wrapper and non-idempotent deletion differ from the target. Hatch publishes before cloning. | New focused factories and private lifecycle; validate/copy before publishing; no draws or implicit ownership. |
| `netlogo-ts/src/lib/core/detached-clone.ts`: cloneDetached | structuredClone-based copying accepts SharedArrayBuffer and does not enforce exact finite-value, accessor, prototype, RegExp or framework-reference rules. | New supported-data traversal with memoized container and backing-buffer identity; descriptor validation before reading data. |
| `netlogo-ts/src/lib/core/world.ts`: membership, tick, resetTicks | Public registries/live AgentSet views and writable clock differ from canonical snapshot membership and protected Tick. No equivalent atomic detached membership API. | New single private membership path, complete batch preflight, snapshot arrays, protected World clock. |
| `netlogo-ts/src/lib/core/random.ts`: SeededRandom.next | Canonical Mulberry32 recurrence is useful algorithm evidence; old seed domain and state API differ. | Implement canonical arithmetic locally with exact fixed draws; no selected source-code transfer. |

## Useful scenarios, with conflicting expectations excluded

- `netlogo-ts/tests/core/agents.test.ts`: nested hatch independence and foreign-World identity rejection. Adapt the scenario to detached Agent.copy and direct properties; graph cleanup waits for Graph.
- `netlogo-ts/tests/core/contracts.test.ts`: tick overflow does not mutate clock.
- `netlogo-ts/tests/core/utilities.test.ts`: stream isolation and continuation; add exact numeric golden draws because two equally wrong implementations could agree.
- `netlogo-ts/tests/core/detached-clone.test.ts`: cycles, Map/Set aliases, view offsets and shared backing buffers. Target positive fixtures use ArrayBuffer; SharedArrayBuffer, NaN and Infinity become explicit negative cases.

These are scenario references. New target tests derive their expectations from the binding reference. No wholesale test or implementation transfer is selected.

## Additional boundaries carried into implementation

Reject callable thenables after invocation without tick; release execution locks even when reading then throws. Check every planned IEEE-754 tick increment before callbacks. Validate ownership and consume iterators before changing membership. Preserve valid constructor/__proto__ custom keys via own data descriptors. Reject getters without invoking them. Keep default x/y/heading readable despite movement being deferred.

## Provenance boundary

The advisory agent found no tracked conventional LICENSE/COPYING/NOTICE file or package license field establishing a source license. This work selects new focused code, not a source-code transfer. If a later slice adapts source code, record its actual origin, revisions, changes and applicable notices/rights separately. Do not infer a license from repository visibility.
