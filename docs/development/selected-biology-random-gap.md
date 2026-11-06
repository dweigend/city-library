# Source-backed B07 Random dependency request

Blood Sugar Regulation cannot use the delivered uniform/normal closure alone. Its exact archived `source.nlogox`, `make-liver`, calls `random-poisson 150`; setup and `adjust-hormones` call `random-exponential (2 / ln 2)`. Original public source reporters implement binomial as a Bernoulli sum; that is a named model procedure, not a request for a new binomial primitive.

The binding existing contract is `docs/agent-loom/api-reference.md#complete-distributions`: `random.number({ distribution: "exponential" | "poisson", mean?: number })`. Standard exponential uses `-mean*log(1-U)`; mean0 no draw. Standard Poisson range[0,100000], product loop below30 and transformed rejection otherwise; mean0 no draw. Existing continuation stays authoritative. No private model distribution implementation is authorized.

Four complete asserted public author scenarios for the parent to freeze as a separate core phase (not additional B07 batch scripts):

```ts
import assert from "node:assert/strict";
import { Random } from "city-library";
// 1. Exponential transform, mean zero draw purity and independent streams.
const a = Random.add({ seed: 7 }); const b = a.copy();
assert.equal(a.number({ distribution: "exponential", mean: 0 }), 0);
assert.equal(a.number({ distribution: "exponential", mean: 2 / Math.LN2 }), -(2 / Math.LN2) * Math.log(1 - b.number()));
assert.equal(a.number(), b.number());
// 2. Zero Poisson purity and integer support at actual liver mean.
const c = Random.add({ seed: 8 }); const d = c.copy();
assert.equal(c.number({ distribution: "poisson", mean: 0 }), 0);
assert.equal(c.number(), d.number());
for (let i = 0; i < 792; i++) { const n = c.number({ distribution: "poisson", mean: 150 }); assert.ok(Number.isSafeInteger(n) && n >= 0); }
// 3. Copy continuation through both algorithm branches and hormones.
const e = c.copy();
for (const mean of [1, 29.9, 30, 150]) assert.equal(c.number({ distribution: "poisson", mean }), e.number({ distribution: "poisson", mean }));
assert.equal(c.number({ distribution: "exponential", mean: 2 / Math.LN2 }), e.number({ distribution: "exponential", mean: 2 / Math.LN2 }));
// 4. Rejection before draw and isolation from normal cache.
const f = c.copy();
assert.throws(() => c.number({ distribution: "poisson", mean: -1 }), RangeError);
assert.throws(() => c.number({ distribution: "exponential", mean: -1 }), RangeError);
assert.equal(c.number(), f.number());
assert.equal(c.number({ distribution: "normal" }), f.number({ distribution: "normal" }));
```

These are contract proposals returned to the parent, not executed passing checks or authorization to edit shared code here. Other nine models continue independently. Independent approval remains pending.
