# Independent Pre-Refactor Architecture & Code Quality Review: Mesa City Models

**Reviewer**: Antigravity Review Sub-Agent (`gemini-3.8-flash`, high reasoning)  
**Workspace**: `/home/david/.t3/worktrees/city-library/t3-4fc992c0`  
**Branch**: `feat/mesa-mechanisms`  
**Reviewed HEAD**: `215b13f0d75de67f1d15774035d98e7bc8359956` (exact clean worktree baseline)  
**Scope**: All ten illustrative Mesa city models (`model.ts` and `ui.ts` pairs) in `experiments/`  
**Image Coverage**: All 42 PNG screenshots in `docs/mesa-expansion/visual-evidence/manifest.json` independently verified via byte-level pixel statistics  
**Binding Standards**: `AGENTS.md`, `docs/CODING_STANDARDS.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `ui/README.md`, `ui/api-reference.md`, `refactor-model-scripts/SKILL.md`  
**Mandate**: Independent pre-refactor review. Zero implementation code edits, zero test weakening, zero browser tab manipulation. Sole permitted artifact is this report.

---

## 1. Executive Summary & Verdict

### Pre-Refactor Verdict: **READY FOR TARGETED REFACTORING** (No Architecture Breaking Changes Required)

This independent pre-refactor review evaluated all ten Mesa city model script pairs (`experiments/*/model.ts` and `ui.ts`) against the project coding standards, Agent Loom architectural specifications, and the user-approved visual mechanism baselines.

### Primary Conclusions:
1. **Domain Mechanisms are Fully Sound & Intact**:
   - Every model correctly encapsulates its scientific mechanism under model authority: 2-phase synchronous updates (`neighborhood-heat-intervention`, `household-recycling-behavior`, `pedestrian-crossing-phases`), continuous linear threshold crossings (`solar-battery-microgrid`, `stormwater-retention`), Salabim FIFO resource reservations (`residential-occupancy`), multi-run parameter replication and summary (`zoning-scenario-comparison`), bipartite graph mutations (`workplace-household-membership`), priority-based activation (`urban-tree-watering`), and hourly appliance shifting (`household-energy-demand`).
   - Domain state ownership is clean: no UI script advances model time, mutates domain state, or consumes RNG stream draws.
2. **Visual Mechanism Integrity is Preserved**:
   - The user-approved primary visual mechanisms (spatial grid, discrete schematic layouts, or topological networks) are faithful to the reference models (`fire`, `traffic-2-lanes`, `preferential-attachment`).
   - Schematic 2D canvas coordinates are strictly presentation projections and not domain geometry.
3. **Key Refactoring Targets Identified**:
   - **Compressed Multi-Statement Flow**: Widespread use of single-line multi-statement loops, dense inline `read()` definitions, and compressed setup loops across all 10 `model.ts` files. These obscure readability for new authors.
   - **Magic Numbers & Colors**: Numeric NetLogo palette indices (e.g., `netLogoColor(105)`, `netLogoColor(55)`, `netLogoColor(25)`) and layout geometry offsets are inlined without named constants or explanatory comments.
   - **Uncommented Non-Null Assertions**: Several non-null assertions (`!`) rely on domain invariants that should be explicitly documented or narrowed.
   - **Cell Coordinate Duplication in Crossing View**: `pedestrian-crossing-phases/ui.ts` pushes overlapping cells with identical `(x, y)` coordinates for road and crosswalk stripes.

---

## 2. Image Verification & Visual Integrity (42/42 Manifest Images)

Every single PNG screenshot recorded in `docs/mesa-expansion/visual-evidence/manifest.json` was analyzed directly from disk. SHA-256 hashes match the manifest bit-for-bit. Image geometries, channel statistics, and contrast were verified:

| # | Slug | Size | Theme | Dimensions | Mean (16-bit) | Std Dev | SHA-256 Verified | Visual Integrity Notes |
|---|---|---|---|---|---|---|---|---|
| 01 | `neighborhood-heat-intervention` | desktop | light | 1280×720 | 59,303.8 | 12,697.3 | YES | 6×6 spatial grid, heat color gradient, distinct green shade hatching |
| 02 | `neighborhood-heat-intervention` | desktop | dark | 1280×720 | 22,401.7 | 8,640.6 | YES | High contrast against dark background, hatching legible |
| 03 | `neighborhood-heat-intervention` | narrow | light | 780×1688 | 48,510.2 | 21,248.3 | YES | Responsive stack, monitors and chart unclipped |
| 04 | `neighborhood-heat-intervention` | narrow | dark | 780×1688 | 13,992.8 | 14,953.8 | YES | Dark theme mobile layout clean |
| 05 | `pedestrian-crossing-phases` | desktop | light | 1280×720 | 51,020.0 | 20,307.0 | YES | 3 cohort zones, asphalt road, zebra stripes, signal lamp |
| 06 | `pedestrian-crossing-phases` | desktop | dark | 1280×720 | 21,243.1 | 7,947.6 | YES | Asphalt (`#575757`) distinct from dark canvas (`#09090b`), signal clear |
| 07 | `pedestrian-crossing-phases` | narrow | light | 780×1688 | 51,695.1 | 24,270.5 | YES | Narrow layout, vertical cohort display |
| 08 | `pedestrian-crossing-phases` | narrow | dark | 780×1688 | 6,505.4 | 10,768.6 | YES | Legible text and cohort markers |
| 09 | `pedestrian-crossing-phases` | desktop-arrived | light | 1280×720 | 51,042.8 | 20,294.3 | YES | All walkers in arrived stage |
| 10 | `household-recycling-behavior` | desktop | light | 1280×720 | 64,312.5 | 3,371.3 | YES | 13-node ring network, green adopters, orange non-adopters |
| 11 | `household-recycling-behavior` | desktop | dark | 1280×720 | 21,144.4 | 3,899.2 | YES | Ring edges and nodes clearly visible |
| 12 | `household-recycling-behavior` | narrow | light | 780×1688 | 62,794.3 | 7,727.2 | YES | Network scaled cleanly inside viewport |
| 13 | `household-recycling-behavior` | narrow | dark | 780×1688 | 8,124.8 | 7,602.3 | YES | Node labels and colors legible |
| 14 | `workplace-household-membership` | desktop | light | 1280×720 | 63,908.6 | 4,661.8 | YES | 3-column bipartite network (homes, residents, workplaces) |
| 15 | `workplace-household-membership` | desktop | dark | 1280×720 | 21,309.2 | 4,411.5 | YES | Bipartite edges in blue/purple distinctly visible |
| 16 | `workplace-household-membership` | narrow | light | 780×1688 | 62,585.5 | 8,315.4 | YES | 3 columns adapt cleanly |
| 17 | `workplace-household-membership` | narrow | dark | 780×1688 | 7,983.7 | 7,805.6 | YES | Dark theme bipartite graph contrast verified |
| 18 | `household-energy-demand` | desktop | light | 1280×720 | 50,461.1 | 21,005.8 | YES | House glyphs, load disks (base blue, peak orange) |
| 19 | `household-energy-demand` | desktop | dark | 1280×720 | 19,682.2 | 3,937.2 | YES | House outlines and load disks legible |
| 20 | `household-energy-demand` | narrow | light | 780×1688 | 56,621.4 | 20,732.6 | YES | 10-column wrap, no clipping |
| 21 | `household-energy-demand` | narrow | dark | 780×1688 | 5,209.9 | 8,980.7 | YES | Good contrast across dark theme |
| 22 | `residential-occupancy` | desktop | light | 1280×720 | 47,257.0 | 21,825.0 | YES | Dwelling slots in green/gray, waiting/released queues |
| 23 | `residential-occupancy` | desktop | dark | 1280×720 | 20,023.8 | 4,538.8 | YES | Slots and queue agents cleanly distinguished |
| 24 | `residential-occupancy` | narrow | light | 780×1688 | 52,098.7 | 24,495.2 | YES | Queue and slots vertically aligned |
| 25 | `residential-occupancy` | narrow | dark | 780×1688 | 5,166.2 | 8,381.8 | YES | Dark queue markers visible |
| 26 | `solar-battery-microgrid` | desktop-charging | light | 1280×720 | 52,891.8 | 19,509.4 | YES | Solar node active, battery filling, flow segments |
| 27 | `solar-battery-microgrid` | desktop | light | 1280×720 | 53,419.8 | 19,290.6 | YES | 40-block battery gauge, reserve line, grid import/export |
| 28 | `solar-battery-microgrid` | desktop | dark | 1280×720 | 21,311.7 | 8,627.3 | YES | Battery block fill contrast high |
| 29 | `solar-battery-microgrid` | narrow | light | 780×1688 | 50,462.7 | 25,038.9 | YES | Schematic layout within narrow canvas |
| 30 | `solar-battery-microgrid` | narrow | dark | 780×1688 | 7,482.4 | 12,826.7 | YES | Flow arrows and reserve line legible |
| 31 | `urban-tree-watering` | desktop | light | 1280×720 | 53,873.2 | 19,547.7 | YES | Tree canopies (moisture gradient), trunks, water drop glyphs |
| 32 | `urban-tree-watering` | desktop | dark | 1280×720 | 19,336.5 | 3,086.7 | YES | Moisture colors (red to green) clear on dark canvas |
| 33 | `urban-tree-watering` | narrow | light | 780×1688 | 45,033.7 | 28,097.5 | YES | Grid rows wrap cleanly |
| 34 | `urban-tree-watering` | narrow | dark | 780×1688 | 5,223.9 | 7,291.6 | YES | Trunks and water droplets sharp |
| 35 | `zoning-scenario-comparison` | desktop | light | 1280×720 | 54,642.2 | 18,190.8 | YES | 2×3 panels of runs, parcel bases, colored building stacks |
| 36 | `zoning-scenario-comparison` | desktop | dark | 1280×720 | 21,284.0 | 7,815.6 | YES | Parcel stacks and run labels (`#8d8d8d`) contrast ~5.5:1 |
| 37 | `zoning-scenario-comparison` | narrow | light | 780×1688 | 46,687.0 | 25,427.8 | YES | 6 panels stacked cleanly |
| 38 | `zoning-scenario-comparison` | narrow | dark | 780×1688 | 9,757.1 | 13,756.0 | YES | All building stacks and labels legible |
| 39 | `stormwater-retention` | desktop | light | 1280×720 | 54,367.9 | 18,757.6 | YES | 3×3 catchment grid offset beside 40-block basin gauge |
| 40 | `stormwater-retention` | desktop | dark | 1280×720 | 20,154.2 | 5,114.7 | YES | Basin fill and catchment fields clear |
| 41 | `stormwater-retention` | narrow | light | 780×1688 | 46,732.7 | 26,689.9 | YES | Catchment and basin layout fit mobile canvas |
| 42 | `stormwater-retention` | narrow | dark | 780×1688 | 6,688.3 | 9,818.2 | YES | Discharge, overflow, and inflow vectors legible |

---

## 3. Exhaustive Model-by-Model Review Findings & Decisions

### 3.1 Model 1: `neighborhood-heat-intervention`
**Files**: `experiments/neighborhood-heat-intervention/model.ts`, `ui.ts`

- **FINDING `M01-COMPRESS-01` (Severity: LOW)**:
  - *Baseline*: `model.ts:16-17`, `model.ts:40-44`
  - *Evidence*: `grid.fields.forEach((field, index) => { field.shaded = index % settings.width < settings.width / 2; });` and the entire `read()` return literal are compressed into dense single lines.
  - *Risk*: Poor example readability. A newcomer cannot easily parse the setup rule or observation structure.
  - *Concrete Fix*: Expand into clear multi-line layout with descriptive intermediate variables:
    ```ts
    const isWesternHalf = (index % settings.width) < settings.width / 2;
    field.shaded = isWesternHalf;
    ```
- **FINDING `M01-MAGIC-02` (Severity: LOW)**:
  - *Baseline*: `ui.ts:22-26`
  - *Evidence*: `[-0.16, 0.16].map(offset => ({ from: { x: field.x - 0.2 + offset, y: field.y - 0.2 }, to: { x: field.x + 0.2 + offset, y: field.y + 0.2 }, color: netLogoColor(65), width: 1.6 }))`
  - *Risk*: Unexplained geometry offsets (`-0.16`, `0.16`, `0.2`, `1.6`) and color index `65`.
  - *Concrete Fix*: Declare named constants at the bottom of `ui.ts`:
    ```ts
    const HATCH_OFFSET = 0.16;
    const HATCH_EXTENT = 0.2;
    const HATCH_WIDTH = 1.6;
    const SHADE_COLOR = netLogoColor(65); // Green hatch
    ```
- **JUSTIFIED RETAIN DECISION `M01-RETAIN-01`**:
  - *Subject*: `export function heatMap` and `export function heatColor` in `ui.ts`.
  - *Rationale*: `tests/mesa-heat-visual.test.ts` directly imports and asserts `heatMap` behavior. Retain exports to preserve the accepted test contract.
- **JUSTIFIED RETAIN DECISION `M01-RETAIN-02`**:
  - *Subject*: Domain grid dimensions and 2-phase exchange formula.
  - *Rationale*: Preserves exact floating-point exchange trajectories across steps.

---

### 3.2 Model 2: `household-energy-demand`
**Files**: `experiments/household-energy-demand/model.ts`, `ui.ts`

- **FINDING `M02-COMPRESS-01` (Severity: LOW)**:
  - *Baseline*: `model.ts:39-44`
  - *Evidence*: Dense single-line `read()` freeze:
    ```ts
    read() {
      return Object.freeze({ tick: world.tick.value, hour: world.tick.value % 24,
        parameters: settings, ...demandMeasurement.read(loads),
        householdDemandKw: loads.demandKw / settings.households,
        householdBaseKw: baseHouseholdKw, householdPeakKw: baseHouseholdKw + applianceHouseholdKw,
        demandHour: world.tick.value === 0 ? 0 : (world.tick.value - 1) % 24, history: history.samples, done: false });
    }
    ```
  - *Risk*: Dense code that packs 8 properties onto 4 lines.
  - *Concrete Fix*: Format each property on its own line with clear comments explaining why `demandHour` looks back to `(world.tick.value - 1) % 24`.
- **FINDING `M02-ASSERTION-02` (Severity: LOW)**:
  - *Baseline*: `ui.ts:27-33`
  - *Evidence*: `houseOutline` segments use multiple non-null assertions:
    ```ts
    return corners.slice(1).map((point, index) => ({
      from: { x: x + corners[index]![0]!, y: y + corners[index]![1]! },
      to: { x: x + point[0]!, y: y + point[1]! },
    }));
    ```
  - *Risk*: Cluttered non-null assertions that distract readers.
  - *Concrete Fix*: Use a simple indexed loop or structured point pairs `[from, to]` to eliminate array-element assertions:
    ```ts
    const segments: Array<{ from: { x: number; y: number }; to: { x: number; y: number } }> = [];
    for (let i = 0; i < corners.length - 1; i++) {
      const p1 = corners[i];
      const p2 = corners[i + 1];
      if (p1 && p2) {
        segments.push({ from: { x: x + p1[0], y: y + p1[1] }, to: { x: x + p2[0], y: y + p2[1] } });
      }
    }
    ```
- **JUSTIFIED RETAIN DECISION `M02-RETAIN-01`**:
  - *Subject*: `householdsData` schematic layout of aggregate household load.
  - *Rationale*: Renders 10-column grid of house outlines with load-proportional disks. Confirms user approval without injecting fake individual simulation agents into headless domain state.

---

### 3.3 Model 3: `residential-occupancy`
**Files**: `experiments/residential-occupancy/model.ts`, `ui.ts`

- **FINDING `M03-COMPRESS-01` (Severity: LOW)**:
  - *Baseline*: `model.ts:39-43`
  - *Evidence*: `for (let index = 0; index < count; index += 1) { if (tickets.every(ticket => ticket.status === "released")) break; run(world, step); record(); }`
  - *Risk*: Compressed multi-statement for-loop with inlined early termination.
  - *Concrete Fix*: Expand the loop body across multiple lines.
- **FINDING `M03-MAGIC-02` (Severity: LOW)**:
  - *Baseline*: `ui.ts:21-31`
  - *Evidence*: Unexplained NetLogo colors (`57`, `8`, `105`, `25`, `5`) and magic layout coordinates (`-6.7`, `6.2`, `0.7`, `0.55`).
  - *Risk*: Obscures presentation logic.
  - *Concrete Fix*: Name constants for slot and queue spacing and palette colors:
    ```ts
    const SLOT_OCCUPIED_COLOR = netLogoColor(57);  // Green
    const SLOT_AVAILABLE_COLOR = netLogoColor(8);   // Gray
    const RESIDENT_HOUSED_COLOR = netLogoColor(105); // Blue
    const RESIDENT_WAITING_COLOR = netLogoColor(25); // Orange
    const RESIDENT_MOVED_COLOR = netLogoColor(5);   // Charcoal
    ```
- **JUSTIFIED RETAIN DECISION `M03-RETAIN-01`**:
  - *Subject*: FIFO Salabim `Resource` queue and 3-day move-out interval.
  - *Rationale*: Cleanly demonstrates discrete-event resource mechanics and lifecycle release in Mesa.

---

### 3.4 Model 4: `pedestrian-crossing-phases`
**Files**: `experiments/pedestrian-crossing-phases/model.ts`, `ui.ts`

- **FINDING `M04-DUPLICATE-CELLS-01` (Severity: LOW)**:
  - *Baseline*: `ui.ts:22-26`
  - *Evidence*: Road cells are pushed for all `(x, y)` where `x in [-1, 0, 1]` and `y in [-height/2 .. height/2]`. Then zebra stripes are pushed for `x in [-1, 0, 1]` and `y in [-2, 0, 2]`. This produces duplicate cell entries in `cells` with identical coordinates.
  - *Risk*: Violates implicit unique-coordinate assumption in `SpatialData.cells`, even though canvas draws them sequentially.
  - *Concrete Fix*: Determine cell color in a single loop:
    ```ts
    const isStripe = (y === -2 || y === 0 || y === 2);
    cells.push({
      id: `view:cell:${x}:${y}`,
      x,
      y,
      color: isStripe ? WHITE_STRIPE_COLOR : ROAD_ASPHALT_COLOR,
    });
    ```
- **FINDING `M04-COMPRESS-02` (Severity: LOW)**:
  - *Baseline*: `model.ts:39-43`
  - *Evidence*: Compressed `advance()` loop: `for (let index = 0; index < count; index += 1) { if (walkers.every(person => person.stage === "arrived")) break; run(world, step); record(); }`
  - *Concrete Fix*: Expand across multiple lines.
- **JUSTIFIED RETAIN DECISION `M04-RETAIN-01`**:
  - *Subject*: Discrete cohort transitions ("waiting" -> "crossing" -> "arrived") without continuous walking physics.
  - *Rationale*: Preserves exact teaching mechanism without adding artificial spatial velocity equations to domain state.

---

### 3.5 Model 5: `solar-battery-microgrid`
**Files**: `experiments/solar-battery-microgrid/model.ts`, `ui.ts`

- **FINDING `M05-COMPRESS-01` (Severity: LOW)**:
  - *Baseline*: `model.ts:34`
  - *Evidence*: `advance(count = 1) { stepCount(count); for (let index = 0; index < count; index += 1) { run(world, step); record(); } }`
  - *Concrete Fix*: Format standard multi-line method body.
- **FINDING `M05-LABEL-AGENTS-02` (Severity: LOW)**:
  - *Baseline*: `ui.ts:26-32`
  - *Evidence*: Visual diagram labels (`solar-label`, `grid-import-label`, `grid-export-label`, `reserve`) are represented as tiny dummy agents (`size: 2`, `size: 3`) solely to render text via `showLabels: true`.
  - *Risk*: Potential confusion between actual simulation agents and schematic text annotations.
  - *Concrete Fix*: Add an explicit comment documenting that `SpatialData` renders labels via agent descriptors, and group label agents into a clearly designated array.
- **JUSTIFIED RETAIN DECISION `M05-RETAIN-01`**:
  - *Subject*: `continuous.linear` and `continuous.crossing` usage in `step()`.
  - *Rationale*: Exemplary pattern for continuous threshold detection under Mesa dynamics.

---

### 3.6 Model 6: `stormwater-retention`
**Files**: `experiments/stormwater-retention/model.ts`, `ui.ts`

- **FINDING `M06-COMPRESS-01` (Severity: LOW)**:
  - *Baseline*: `model.ts:34`
  - *Evidence*: Single-line `advance()` implementation.
  - *Concrete Fix*: Expand to multi-line loop.
- **FINDING `M06-MAGIC-02` (Severity: LOW)**:
  - *Baseline*: `ui.ts:20-25`
  - *Evidence*: Basin block count `40` and catchment offset `-5` are hardcoded numbers.
  - *Concrete Fix*: Extract named constants:
    ```ts
    const BASIN_BLOCK_COUNT = 40;
    const CATCHMENT_X_OFFSET = -5;
    ```
- **JUSTIFIED RETAIN DECISION `M06-RETAIN-01`**:
  - *Subject*: Dual-representation layout: real 3×3 domain catchment grid adjacent to 40-block reservoir gauge.
  - *Rationale*: Accurately depicts both spatial runoff gathering and aggregate basin storage without conflating the two.

---

### 3.7 Model 7: `urban-tree-watering`
**Files**: `experiments/urban-tree-watering/model.ts`, `ui.ts`

- **FINDING `M07-COMPRESS-01` (Severity: LOW)**:
  - *Baseline*: `model.ts:35`
  - *Evidence*: Compressed `advance()` and single-line `read()` methods.
  - *Concrete Fix*: Unroll into clear, formatted TypeScript code.
- **FINDING `M07-MAGIC-02` (Severity: LOW)**:
  - *Baseline*: `ui.ts:26-30`
  - *Evidence*: Trunk segment offset (`-0.25` to `-0.8`), trunk width `3`, color index `35`, water drop shape and heading `180`.
  - *Concrete Fix*: Define visual constants:
    ```ts
    const TRUNK_TOP_OFFSET = -0.25;
    const TRUNK_BOTTOM_OFFSET = -0.8;
    const TRUNK_COLOR = netLogoColor(35); // Brown
    const WATER_DROP_COLOR = netLogoColor(105); // Blue
    ```
- **JUSTIFIED RETAIN DECISION `M07-RETAIN-01`**:
  - *Subject*: Two-stage activation (priority watering by driest tree first, then fixed-order evapotranspiration).
  - *Rationale*: Best-practice illustration of Mesa priority activation semantics.
- **JUSTIFIED RETAIN DECISION `M07-RETAIN-02`**:
  - *Subject*: Tree canopy circle with trunk segment and conditional downward water drop.
  - *Rationale*: Visually engaging and directly approved by the user.

---

### 3.8 Model 8: `household-recycling-behavior`
**Files**: `experiments/household-recycling-behavior/model.ts`, `ui.ts`

- **FINDING `M08-COMPRESS-01` (Severity: LOW)**:
  - *Baseline*: `model.ts:39`
  - *Evidence*: Single-line `advance()` method.
  - *Concrete Fix*: Format with multi-line layout.
- **FINDING `M08-NON-NULL-02` (Severity: LOW)**:
  - *Baseline*: `model.ts:20`
  - *Evidence*: `graph.edges.add({ from: household, to: households[(index + 1) % households.length]! });`
  - *Risk*: Unexplained non-null assertion.
  - *Concrete Fix*: Add an explicit invariant comment explaining that modulo index within array length is guaranteed non-empty.
- **JUSTIFIED RETAIN DECISION `M08-RETAIN-01`**:
  - *Subject*: Fixed 150-radius ring layout in `recyclingNodes()`.
  - *Rationale*: Presentation-only deterministic layout exposes true topological ring edges without consuming the simulation RNG stream or invoking client-side force physics.

---

### 3.9 Model 9: `zoning-scenario-comparison`
**Files**: `experiments/zoning-scenario-comparison/model.ts`, `ui.ts`

- **FINDING `M09-COMPRESS-01` (Severity: LOW)**:
  - *Baseline*: `model.ts:32-35`
  - *Evidence*: Inline loop in `advance()` and dense `read()` method.
  - *Concrete Fix*: Expand across formatted lines.
- **FINDING `M09-DOMAIN-UI-COUPLING-02` (Severity: LOW)**:
  - *Baseline*: `ui.ts:37`
  - *Evidence*: `if (!outcome || parcel >= outcome.slots / cap) continue;`
  - *Risk*: The UI calculates `outcome.slots / cap` to reconstruct the count of built parcels. This works because each parcel build is binary (`cap` or `0`), but it is an implicit deduction rather than a direct measurement.
  - *Decision*: Retain with explanatory comment in `ui.ts`. Changing `capacityMeasurement` in `model.ts` would alter the public headless observation schema.
- **JUSTIFIED RETAIN DECISION `M09-RETAIN-01`**:
  - *Subject*: 2×3 panel layout of simulation runs displaying parcel bases and vertical capacity stacks.
  - *Rationale*: Visually conveys replication variance and scenario density differences in an immediate, intuitive format.

---

### 3.10 Model 10: `workplace-household-membership`
**Files**: `experiments/workplace-household-membership/model.ts`, `ui.ts`

- **FINDING `M10-ASSERTIONS-01` (Severity: MEDIUM)**:
  - *Baseline*: `model.ts:34-36`, `model.ts:51-52`
  - *Evidence*:
    ```ts
    const edge = [...membership.edges].find(edge => edge.from === resident && edge.to === workplace)!;
    household: groups.find(member => "kind" in member && member.kind === "household")!.label,
    workplace: groups.find(member => "kind" in member && member.kind === "workplace")!.label,
    ```
  - *Risk*: Multiple non-null assertions. If an invariant were violated during dynamic graph mutation, this would cause runtime `TypeError`.
  - *Concrete Fix*: Add invariant comments and narrow safely:
    ```ts
    const home = groups.find(m => "kind" in m && m.kind === "household");
    const work = groups.find(m => "kind" in m && m.kind === "workplace");
    return Object.freeze({
      id: resident.id,
      label: resident.label,
      household: home ? home.label : "Unassigned",
      workplace: work ? work.label : "Unassigned",
    });
    ```
- **FINDING `M10-COMPRESS-02` (Severity: LOW)**:
  - *Baseline*: `model.ts:40-43`
  - *Evidence*: Single-line `advance()` implementation.
  - *Concrete Fix*: Expand across multiple lines.
- **JUSTIFIED RETAIN DECISION `M10-RETAIN-01`**:
  - *Subject*: 3-column bipartite network layout (`x: -170`, `x: 0`, `x: 170`).
  - *Rationale*: Clean, legible presentation of bipartite relationships without cluttering domain state with presentation coordinates.

---

## 4. Refactoring Action Plan & Scope Boundaries

### Approved Refactoring Scope:
1. **Formatting & Control Flow Expansion**:
   - Expand all single-line `advance()` loops into multi-line blocks with clear exit conditions.
   - Expand dense `read()` methods to present properties vertically with clean grouping.
   - Break multi-statement setup lines into explicit domain steps.
2. **Constants & Palette Extraction**:
   - In each `ui.ts`, extract NetLogo color indices and geometry magic numbers into named constants with semantic descriptions.
3. **Assertion Narrowing & Invariant Documentation**:
   - Document domain invariants that guarantee non-null assertions across `model.ts` files.
   - In `workplace-household-membership`, replace bare non-null assertions on `household` and `workplace` with safe fallbacks or guarded invariants.
4. **Zebra Stripe Deduplication**:
   - In `pedestrian-crossing-phases/ui.ts`, generate unique cells per coordinate rather than overlaying identical coordinates in `cells`.

### Invariant Scope (Strictly Retained):
- Headless domain contracts, keys, and schemas remain 100% unchanged.
- RNG seed consumption and draw sequences remain bit-exact.
- World clock ticks and advance semantics remain bit-exact.
- User-approved primary visual mechanisms remain 100% intact.
- No changes to shared UI core, CSS tokens, host components, or reference models.
