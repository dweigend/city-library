# Source-backed distance overlap and unresolved shared contract

Root requested this check before runtime distance implementation. Existing public geometry.distance accepts only XY/XYZ spatial Position under Space; stats exposes histogram/gini/describe. No public sequence-mismatch/Hamming or arbitrary-dimensional vector distance contract is present in the binding API reference/table or implemented exports.

The two source equations are materially different:

- Simple Genetic Algorithm hamming-distance counts differing binary loci divided by source world-width. Diversity sums that fraction over unordered genome pairs and divides by floor(N²/4).
- Robby chromosome-distance does NOT compare mismatching genes. It computes Euclidean distance of seven **allele counts**, then source display scaling9/(273*sqrt(2)/10), clipped9. Two different strategies with the same action frequencies have zero distance. Source243 genes versus divider273 and pre-mutation allele counts are explicit source quirks.

Thus there is no shared normalized mismatch calculation between these two sources. A generic primitive may be useful beyond B18, but its name, empty/unequal sequence handling, equality policy and supported item types are unresolved. This branch will not invent an API or implement a generic replacement privately. Root decides whether a new shared bounded primitive is needed or the binary genotype and allele-distance formulas remain source-specific public compositions. Existing frozen model export hammingDistance(a,b) must be preserved and can delegate to any root-approved public primitive.

Five asserted public mechanism scenarios for the root's capability freeze (using the already frozen MODEL public import, not naming an invented core API):

```ts
import assert from 'node:assert/strict';
import { hammingDistance } from '../../experiments/simple-genetic-algorithm/model.ts';
assert.equal(hammingDistance([0,0,1,1],[0,0,1,1]), 0);
assert.equal(hammingDistance([0,0,1,1],[1,1,0,0]), 1);
assert.equal(hammingDistance([0,0,1,1],[0,1,0,1]), .5);
assert.equal(hammingDistance([1],[0]), 1);
assert.equal(hammingDistance([0,1,0],[0,1,1]), 1/3);
```

Proposed error cases to resolve at root: empty sequence (undefined fraction), different lengths, nonbinary inputs for the model-facing export, non-array iterable support for a generic primitive, nonprimitive equality and nonfinite values. This branch has not frozen these as a new core API. No expanded shared capability is claimed.

## Resolved coordinator decision

The parent resolved this boundary in `docs/development/selected-computing-distance-decision.md`: retain the frozen public model export as a source-specific binary-genotype equation. There is no second demonstrated consumer and no core expansion. Accept readonly dense nonempty equal-length binary arrays; reject empty/unequal/sparse/nonbinary/nonfinite inputs without mutation. All five scientific cases and invalid cases are executed in tests/selected-computing-network.test.ts. This decision is implementation coordination, not independent approval.
