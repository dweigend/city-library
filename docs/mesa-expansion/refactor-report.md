# Ten city model scripts: feedback, refactor and verification

The ten Mesa model/UI pairs now expose their rules, observations and visual projections more clearly. No domain equation, state owner, seed, draw order, observation key or model clock was changed. Two explicit presentation corrections accompany the refactor: finite UIs bind their existing done observation to completion, and crossing renders each road coordinate once.

## Independent feedback before edits

Both requested fresh reviews read all twenty files at `215b13f0d75de67f1d15774035d98e7bc8359956`. Codex `gpt-6-astra` used `reasoningEffort: high`; Antigravity `gemini-3.8-flash` used `thinking_level: high`. Read their original [Astra](refactor-feedback-astra.md) and [Gemini](refactor-feedback-gemini.md) reports separately from the [implementation decisions](refactor-decisions.md).

Astra found one medium UI completion omission and ten model-specific reasons to retain established mechanisms. Gemini identified compressed flow, unnamed presentation values, assertion noise and duplicate road cells. Its medium Graph-assertion concern was addressed with the established invariant, not silent Unassigned observations. Pixel statistics and contrast samples in its report do not establish general WCAG compliance. Fresh image inspection is recorded separately.

The immutable baseline was captured before edits; implementation began only after both reviews and capture were complete. Three scoped implementation workers then changed disjoint script batches. The implementation commit is `95a5dc8f5e9769b72b7fedb3c79ba35217914236`. No shared UI/runtime/palette/canvas/CSS, reference model, README, approved diagram, public library or dependency changed. The parallel DES visualization task retains exclusive ownership of shared UI.

## Changes in each pair

| Model | model.ts | ui.ts |
| --- | --- | --- |
| [neighborhood-heat-intervention](../../experiments/neighborhood-heat-intervention/model.ts) | Named the western-half shade condition and mean exchange, expanded execution and detached field observations. The exact left-associative arithmetic remains. | [Projection](../../experiments/neighborhood-heat-intervention/ui.ts): Named fixed-scale and hatch values; retained actual Grid coordinates, public heatMap/heatColor and the 0–30 index domain. |
| [household-energy-demand](../../experiments/household-energy-demand/model.ts) | Expanded execution, measurements and observations; explained the completed demand hour and kW-hour integration. | [Projection](../../experiments/household-energy-demand/ui.ts): Typed house-outline coordinates replace assertion noise; named load palette, glyph sizing and display columns. |
| [residential-occupancy](../../experiments/residential-occupancy/model.ts) | Made release, stop checks, recording and observation fields explicit; retained Resource tickets and capacity-before-settings validation. | [Projection](../../experiments/residential-occupancy/ui.ts): Named slot/status-queue geometry and colors; bound done to complete so terminal playback stops. |
| [pedestrian-crossing-phases](../../experiments/pedestrian-crossing-phases/model.ts) | Named the fixed activation snapshot and kept compute/commit transitions visible; expanded terminal loop and read. | [Projection](../../experiments/pedestrian-crossing-phases/ui.ts): Named stages, signal/road colors and cohort spacing; generated one effective cell per coordinate; bound done to complete. |
| [solar-battery-microgrid](../../experiments/solar-battery-microgrid/model.ts) | Renamed raw to unconstrainedEnergyKwh; expanded crossing, execution and observations. Crossing still precedes clipping. | [Projection](../../experiments/solar-battery-microgrid/ui.ts): Named gauge resolution and status colors; documented that fixed label descriptors are annotations, not domain agents. |
| [stormwater-retention](../../experiments/stormwater-retention/model.ts) | Renamed raw to unconstrainedVolumeM3; expanded crossing/advance and detached catchment observations without changing drainage order. | [Projection](../../experiments/stormwater-retention/ui.ts): Named basin resolution, catchment offset and flow colors; preserved actual catchment geometry and aggregate gauge. |
| [urban-tree-watering](../../experiments/urban-tree-watering/model.ts) | Expanded record/advance/read/live action; priority watering and subsequent fixed loss remain adjacent and separate. | [Projection](../../experiments/urban-tree-watering/ui.ts): Named trunk geometry, water-marker orientation and fixed dry/moist colors; preserved allocation markers and moisture scale. |
| [household-recycling-behavior](../../experiments/household-recycling-behavior/model.ts) | Documented the nonempty ring invariant; named adoptionProbability and explained mandatory draws even at zero probability; expanded read/advance. | [Projection](../../experiments/household-recycling-behavior/ui.ts): Named ring radius and palette; retained deterministic view-only positions and real Graph edges. |
| [zoning-scenario-comparison](../../experiments/zoning-scenario-comparison/model.ts) | Extracted local createReplication to expose per-seed state/RNG ownership; expanded plan execution, outcomes and terminal summaries. | [Projection](../../experiments/zoning-scenario-comparison/ui.ts): Named panel/slot geometry and colors; documented aggregate slots/cap reconstruction; bound done to complete. |
| [workplace-household-membership](../../experiments/workplace-household-membership/model.ts) | Named four canonical places instead of array offsets; expanded edge replacement and observations; explained the two-edge invariant without fallback states. | [Projection](../../experiments/workplace-household-membership/ui.ts): Named three columns, spacing, sizes and relation colors; preserved real membership edges and stable view-only positions. |

## Representative exact source excerpts

These excerpts come from the actual baseline and implementation, rather than reconstructed pseudocode.

### Explicit interval execution

Before:

```ts
    advance(count = 1) {
      stepCount(count);
      for (let index = 0; index < count; index += 1) {
        if (tickets.every(ticket => ticket.status === "released")) break;
        run(world, step); record();
      }
    },
    moveOut,
```

After:

```ts
    advance(count = 1) {
      stepCount(count);
      for (let index = 0; index < count; index += 1) {
        if (tickets.every(ticket => ticket.status === "released")) {
          break;
        }
        run(world, step);
        record();
      }
    },
    moveOut,
```

### Seed continuation at zero adoption probability

Before:

```ts
        const share = peers.filter(peer => peer.recycling).length / peers.length;
        return random.number() < settings.influence * share;
      },
```

After:

```ts
        const share = peers.filter(peer => peer.recycling).length / peers.length;
        const adoptionProbability = settings.influence * share;
        // Non-adopters draw even at zero probability, preserving seeded continuation.
        return random.number() < adoptionProbability;
      },
```

### Canonical workplace identity

Before:

```ts
    const next = workplace === places[2] ? places[3]! : places[2]!;
    const edge = [...membership.edges].find(edge => edge.from === resident && edge.to === workplace)!;
    edge.delete();
```

After:

```ts
    const next = workplace === workplaceA ? workplaceB : workplaceA;
    // Setup gives every resident one workplace edge; this rule replaces only that edge.
    const edge = [...membership.edges].find(edge => edge.from === resident && edge.to === workplace)!;
    edge.delete();
```

### Typed house outline

Before:

```ts
function houseOutline(x: number, y: number) {
  const corners = [
    [-0.35, -0.3], [0.35, -0.3], [0.35, 0.2], [0, 0.45], [-0.35, 0.2], [-0.35, -0.3],
  ];
  return corners.slice(1).map((point, index) => ({
    from: { x: x + corners[index]![0]!, y: y + corners[index]![1]! },
    to: { x: x + point[0]!, y: y + point[1]! },
  }));
}
```

After:

```ts
function houseOutline(x: number, y: number) {
  // The closed outline has a fixed first point and typed coordinate pairs.
  const [first, ...remaining] = houseCorners;
  let previous: readonly [number, number] = first;
  return remaining.map(point => {
    const segment = {
      from: { x: x + previous[0], y: y + previous[1] },
      to: { x: x + point[0], y: y + point[1] },
    };
    previous = point;
    return segment;
  });
}
```

## Executed verification

- `bun run typecheck`: passed; Svelte diagnostics 0 errors, 0 warnings.
- `bun test tests/mesa*.test.ts`: 72 passed, 0 failed, 520 assertions. This includes the new focused crossing-cell regression; the existing frozen assertions were preserved.
- Every script in `examples/mesa-measurements/*.ts`, `examples/mesa-dynamics/*.ts`, and `examples/mesa-attachment/*.ts`: all 14 passed.
- `CITY_LIBRARY_UI_RUNTIME=svelte bun run build:ui:svelte`: passed in 1.74 s. The existing large-chunk advisory remains; no dependency or bundling change was made.
- Immutable baseline replay: 32 cases / 64 independent instances at 0/1/3/10/30/130, seeds 0/17/4294967293 for seeded models, live actions, invalid inputs and detached reads. All domain observations and opaque IDs are exact. The strict command intentionally reports exactly two crossing projection differences. The separate last-write-per-coordinate comparison passes 32/32, including all remaining values. See [baseline method](refactor-baseline-capture.md) and both replay summaries.
- The scope changes scripts only. The expensive unchanged full check/build/consumer chain was not repeated; the earlier 707-test full run belongs to the earlier delivery and is not reported as a new result here.

The [independent post-refactor source/behavior check](refactor-independent-check.md) approves the actual `215b13f → 95a5dc8` diff and independently reran 42 focused tests / 392 assertions plus both replay comparisons. It found no new blocker. It also identified the explicit crossing view-selection/keyboard delta, which is recorded in the decisions. This native check is separate from the requested pre-refactor Astra/Gemini feedback and makes no browser approval claim.

Fresh browser and actual-image inspection are separate evidence records. Their final results are added after completion rather than inferred from earlier acceptance.

## Limits

These are synthetic teaching models, not calibrated planning forecasts. Observable seed continuation and identity have been compared over the stated cases, not a hidden RNG-state serialization guarantee. Schematic positions remain view-only. No formal WCAG/screenreader certification is claimed. No publication, push, pull request or main merge is authorized or performed.
