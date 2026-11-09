# Independent Flat-Scene and Elevator Design, Transfer, and Source Review

**Reviewer:** Independent Antigravity reviewer (`gemini-3.8-flash`, high reasoning), distinct from the implementation authors, model/UI refactoring authors, native Codex reviewer, and browser/image reviewers.  
**Review Scope:** Commits `362dce2..1f994d5` on branch `feat/salabim-concepts` (including corrective commits `1e5849c`, `1e6b6a3`, and `b3cb3b9`), covering:
- Additive spatial UI schema: `rectangle`, `diamond`, `extent: { width, height }`, `filled`, `stroke`, `strokeWidth`, `SpatialLabel`, `SpatialData.description`, `SpatialData.labels`, and the central `scientificPalette`.
- Common UI host validation (`spatial-data.ts`), geometry/picking (`spatial-geometry.ts`), canvas lifecycle and rendering (`canvas.ts`) across both adapters (`ui/compose.ts` and `ui/svelte/compose.ts`).
- Ten existing discrete-event simulation (DES) spatial scene projections (`experiments/des-*/scene.ts` and `ui.ts`).
- Eleventh headless elevator simulation model (`experiments/des-elevator/model.ts`) and its spatial scene projection (`experiments/des-elevator/ui.ts`).
- Verification of example-first delivery history, absence of parallel renderers/DSLs/clocks, read purity, and numerical boundary guards.

---

## 1. Executive Summary & Findings Disposition

| Area | Status | Notes / Disposition |
| :--- | :--- | :--- |
| **Example-First Gate** | **Verified** | Public contract scripts (`examples/ui-des-scenes/01..05` in `362dce2` and `examples/des-elevator/01..05` in `e90eccb`) were committed prior to runtime implementations (`f40fc4e` and `48a4349`). |
| **Architecture & Boundaries** | **Verified** | Headless domain logic in `city-library`; thin UI views; single state authority; no competing simulation clock, secondary scheduler, or parallel scene DSL. |
| **Observation Purity** | **Verified** | All 11 scene projections are pure functions mapping detached observation records to `SpatialData`; no mutation of simulation state, Agenda, or RNG. |
| **Elevator Model Invariants** | **Verified** | Canonical `Agent` entities; floor/direction `ServiceQueue` queues; car `Resource` capacity authority; alight-before-board ordering; persistent full/opposite calls; deterministic oldest-call dispatch; bounded Agenda event budget. |
| **Finding: Canvas WebIDL Buffer Wrapping** | **Resolved (`1e5849c`)** | `prepareBuffer` initially permitted finite aspect ratios whose rounded dimensions exceeded WebIDL `unsigned long` ($2^{32}-1$), wrapping to 0 in DOM canvas. Resolved by wiring `validateBufferDimensions` in `canvas.ts` before DOM mutation or state publication. |
| **Finding: Stale Mixed-Nearest Fallback Wording** | **Resolved (`1f994d5`)** | Contract text updated to accurately specify that mixed rectangle/diamond scenes use reverse-painter-order bounding hits exclusively, without legacy nearest fallback. |
| **Finding: Narrow Scene Label Overlap** | **Resolved (`b3cb3b9`)** | Waste collection depot label simplified to prevent overlap on narrow viewports, maintaining unloading state in accessible description. |
| **Scope Verdict** | **APPROVED** | Source-code, architectural, and transfer contracts are fully met. (Browser flows and screenshot inspections remain separate independent gates.) |

---

## 2. Example-First Delivery & Architectural Conformance

### 2.1 Chronological Example-First Delivery
Inspection of git commit history verifies strict adherence to the project's example-first delivery gate:
1. `362dce2` (2026-11-09 10:32:42 UTC) committed the five public authoring contract scripts (`examples/ui-des-scenes/01-residents-and-clerks.ts` through `05-picking-and-disposal.ts`) and the contract document `docs/development/des-2d-ui-contract.md`.
2. `e90eccb` (2026-11-09 10:32:42 UTC) committed the five public elevator model contract scripts (`examples/des-elevator/01-single-trip.ts` through `05-validation-arrivals-and-budget.ts`) and `docs/development/des-elevator-contract.md`.
3. Subsequent commits (`f40fc4e`, `ce91be4`, `48a4349`, etc.) implemented the runtime features against these frozen assertions without weakening or bypassing expected behavior.

### 2.2 System Architecture & Separation of Concerns
- **Headless Domain Core:** Domain simulation logic resides entirely within `city-library` primitives (`World`, `Agent`, `ServiceQueue`, `Resource`, `Agenda`). The new elevator model (`experiments/des-elevator/model.ts`) is completely decoupled from UI or DOM constructs.
- **Thin UI Views:** The UI layer (`ui/views/canvas.ts`, `ui/compose.ts`, and `ui/svelte/compose.ts`) acts strictly as a presentation projection and interaction router. UI controls write to simulation instances exclusively through public domain actions (`addPassenger()`, `advance()`, etc.).
- **No Competing Infrastructure:** There is no second simulation clock or browser timer (e.g. `setInterval` or `requestAnimationFrame` driving simulation steps); the simulation advances strictly via explicit `advance(steps)` calls.
- **No Parallel Scene DSL:** No custom drawing callbacks or vector scene graph engines were introduced. Rendering is performed through the unified `mountCanvas` renderer using standard declarative `SpatialData` structures.
- **Central Scientific Palette:** Semantic colors are centralized in `ui/palette/scientific.ts` as a frozen constant (`neutral: #e5e7eb`, `waiting: #fbbf24`, `active: #2dd4bf`, `completed: #86efac`, `unavailable: #9ca3af`). All 11 scene projections consume this single source of truth rather than declaring local ad-hoc colors.

---

## 3. Detailed Review of the Spatial 2D UI Extensions

### 3.1 Additive Schema & Validation (`ui/definition.ts`, `ui/views/spatial-data.ts`)
- **Shapes & Extent:** Added `rectangle` and `diamond` to `SpatialAgent.shape`. Added `extent: { width: number, height: number }` for diagram-unit rectangle sizing.
- **Mutual Exclusivity:** `spatial-data.ts` enforces that `extent` is valid only for `rectangle` shapes and is mutually exclusive with CSS-pixel `size`.
- **Outlines & Fills:** Added `filled` (boolean, default true), `stroke` (string), and `strokeWidth` (number $\ge 0$). Invisible zero-width strokes are explicitly handled.
- **Annotations & Descriptions:** `SpatialLabel` defines nonselectable centered text annotations (`labels`). `SpatialData.description` provides an accessible plain-text summary that populates the canvas `aria-label` and fallback text.
- **Input Validation Integrity:** `validateCanvasData` validates the entire data structure recursively before state mutation. Nonfinite numbers or values outside bounds reject with `RangeError`; type mismatches or accessor properties reject with `TypeError`.

### 3.2 Geometry, Picking & Lifetime (`ui/views/spatial-geometry.ts`, `ui/views/canvas.ts`)
- **Unified Projection:** Coordinate conversion (`canvasPoint`), symbol sizing (`symbolDiameter`, `symbolDimensions`), and rotation (`symbolRotation`) are extracted into `spatial-geometry.ts` and shared between rendering, validation, and hit testing.
- **Subpixel Floor:** Preserves the legacy 2-buffer-pixel minimum for CSS-sized symbols on low-DPI displays.
- **Picking Behavior:**
  - In mixed diagrams containing `rectangle` or `diamond` shapes, picking tests visible rotated bounds in reverse painter order (so foreground passenger dots on cabins remain selectable). Unhit clicks in mixed diagrams return no selection and explicitly do not fall back to legacy nearest tolerance.
  - Legacy scenes containing only `circle` or `triangle` shapes strictly preserve their original nearest-agent selection tolerance ($< 2$ units).
- **Lifecycle & Coalescing:** `mountCanvas` wraps resize updates in a coalesced `requestAnimationFrame`. `dispose()` cancels pending animation frames, disconnects `ResizeObserver`, removes DOM listeners, and removes DOM elements, preventing stale frames or memory leaks.

---

## 4. Elevator Simulation Model & Lifecycle Review (`experiments/des-elevator/model.ts`)

### 4.1 Upstream Transfer & Deviations
The elevator implementation is a synthetic discrete-event model adapted from Salabim concepts, tailored for deterministic teaching in Agent Loom:
- Avoids upstream bugs identified in `docs/research/des-elevator-sources.md` (e.g. parameter mismatches, batched entry delays charged to non-boarding visitors, and resetting passenger arrival age on full car visits).
- Uses discrete adjacent-floor travel events rather than continuous position interpolation.

### 4.2 Entity & Capacity Ownership
- **Canonical Agents:** Passengers and cars are registered as canonical `Agent` instances in the `World`.
- **Floor Queue Ownership:** Waiting passengers are held strictly in per-floor, per-direction `ServiceQueue<Passenger>` instances.
- **Resource Ownership:** Car capacity is owned exclusively by `Resource<Passenger>({ capacity })`. A resource request is created only upon completed boarding (`car.seats.request({ owner })`), returning a granted ticket stored in `car.claims`. Occupied seats are derived solely from `car.seats.used`. There is no duplicated counter or secondary queue.
- **Reservation vs. Capacity:** Floor line reservations (`line.reservedBy`) indicate dispatch intent only; they never claim seats in advance or remove waiting passengers from queues.

### 4.3 Dispatch, Ties, and Movement Policy
- **Oldest-First Dispatch:** Idle cars select the globally oldest unreserved waiting call (`oldestCall`) across lines by comparing passenger admission numbers (`number`). Ties are broken deterministically by passenger admission order, then car number.
- **Alight-Before-Board Invariant:** When a car arrives at a floor stop, alighting passengers disembark sequentially (`alightNext`), each taking `transferTime`. Freed `Resource` capacity is released before any waiting passenger can begin boarding (`boardNext`).
- **Full-Car & Directional Persistence:** If a car reaches full capacity (`car.seats.available === 0`), waiting passengers remain in the queue with their original arrival sequence and age unchanged. Opposite-direction queues remain untouched.
- **Adjacent-Floor Movement:** Travel proceeds one floor at a time via `travelTime` events scheduled on the Agenda.

### 4.4 Determinism, Budgets, and Disposal
- **Agenda Timings & Absence of Polling:** Idle cars have no polling events. New passenger calls immediately evaluate idle cars and schedule explicit Agenda visit events.
- **Safety Budget:** `maxEventsPerStep` limits the maximum number of Agenda dispatches per World tick. Exceeding the bound throws `RangeError("Elevator event budget exhausted.")` inside `run()`, aborting the step without completing the tick and preserving partial state for inspection.
- **Idempotent Disposal:** `dispose()` cancels all pending Agenda handles, empties queues, releases granted Resource claims, and deletes passenger and car Agents. Subsequent write or advance calls throw `TypeError`. Subsequent `read()` calls return a detached final snapshot with `pendingEvents: 0`.

---

## 5. Review of the Ten DES Scene Projections

Every scene projection was evaluated for entity count fidelity, structural topology, and observation read purity:
1. **Civic Office (`experiments/des-civic-office/scene.ts`):** Visualizes residents waiting in queue, individual clerk service slots (neutral outlines), and active consultations (teal). Projections accurately reflect queue and clerk states.
2. **Goods Buffer (`experiments/des-goods-buffer/scene.ts`):** Accurately renders bounded storage slots, active stored crates, blocked producer puts, and collected deliveries.
3. **EV Charging (`experiments/des-ev-charging/scene.ts`):** Visualizes charging bays, vehicles by state (waiting, charging, completed, cancelled), and priority triangles for high-priority vehicles.
4. **Bus Interchange (`experiments/des-bus-interchange/scene.ts`):** Renders the weighted network route with transit progress, passenger stop queues, and bus positions.
5. **Parcel Logistics (`experiments/des-parcel-logistics/scene.ts`):** Outlines depot storage slots, parcels in queue, van travel along network edges, and delivered parcels by destination.
6. **Waste Collection (`experiments/des-waste-collection/scene.ts`):** Maps 6 collection patches with discrete waste units, truck carried load slots, and depot unloading status.
7. **Emergency Dispatch (`experiments/des-emergency-dispatch/scene.ts`):** Renders 4-node access graph, diamond calls by priority, assigned response teams, and available idle teams.
8. **Bike Redistribution (`experiments/des-bike-redistribution/scene.ts`):** Conserves total bike population across station slots and redistribution van cargo slots.
9. **Water Allocation (`experiments/des-water-allocation/scene.ts`):** Represents 4 district patches with discrete allocation unit squares; preserves supply conservation.
10. **Machine Maintenance (`experiments/des-machine-maintenance/scene.ts`):** Visualizes 3 machine status blocks (operational, repairing, waiting) and assigned/idle repair teams.

All 10 scenes preserve read purity: projections never mutate simulation instances, never dispatch Agenda events, and never invoke pseudo-random number generators.

---

## 6. Detailed Analysis of Findings & Corrective Commits

### 6.1 Finding 1 (Resolved): Canvas WebIDL Buffer Dimension Overflow & Wrapping
- **Issue Description:** In `ui/views/canvas.ts`, `prepareBuffer` calculates candidate buffer dimensions `width` and `height` based on scene aspect ratio. An extreme input ratio (e.g. `width: 1, height: 2**32`) produced a finite rounded height of $4,294,967,296$. In browser environments, assigning this value to `HTMLCanvasElement.height` (a WebIDL `unsigned long`) wraps modulo $2^{32}$ to 0. This resulted in an unrenderable 0-height canvas while discarding the previous valid scene.
- **Independent Verification:** Although `validateBufferDimensions` existed in `ui/views/spatial-geometry.ts` and had test coverage, it was initially not invoked within `canvas.ts`.
- **Disposition:** Root resolved this defect in commit `1e5849c` (`fix(ui): reject canvas dimensions that wrap DOM integer bounds`). `validateBufferDimensions(buffer)` is now called in `prepareBuffer` prior to DOM assignment and prior to updating `latest` state. Values outside $[1, 2^{32}-1]$ immediately throw `RangeError`, preserving the prior valid canvas projection. Tested by `test("buffer dimensions reject DOM unsigned-long wrapping before publication")`.

### 6.2 Finding 2 (Resolved): Stale Mixed-Diagram Selection Documentation
- **Issue Description:** Early contract drafts suggested that picking misses in mixed diagrams might fall back to the nearest agent within a 2-unit tolerance.
- **Disposition:** Commit `1f994d5` aligned documentation with implementation: unhit clicks in mixed diagrams containing `rectangle` or `diamond` shapes strictly do not fall back to nearest legacy tolerance.

### 6.3 Finding 3 (Resolved): Label Overlap in Narrow Waste Scene
- **Issue Description:** In narrow viewports, the multi-word label `Depot · unloading` overlapped adjacent collection patch boundaries.
- **Disposition:** Commit `b3cb3b9` shortened the label to `Depot` while preserving the full dynamic state (`unloading` vs `available`) in `SpatialData.description`.

---

## 7. Executed Independent Test Verifications

The following focused verification suites were executed directly by this reviewer:

1. **Kernel & Adversarial Suites:**
   ```sh
   bun test tests/ui-des-scene-kernel.test.ts tests/des-elevator-adversarial.test.ts tests/des-scene-parity.test.ts tests/des-scenes-a.test.ts tests/des-scenes-b.test.ts
   ```
   **Result:** 31 tests passed, 0 failed, 515,603 assertions (352 ms).  
   *Covers:* Normal/subpixel/rotated geometry, triangle/diamond hit testing, WebIDL unsigned-long wrapping rejection, detached read purity, elevator zero-duration chains, safety event budgets, opposite/full queue preservation, and all 11 scene parity checks.

2. **Public Authoring Regression Suites:**
   ```sh
   bun test tests/ui-authoring.test.ts tests/ui-authoring-next.test.ts
   ```
   **Result:** 12 tests passed, 0 failed, 55 assertions (736 ms).  
   *Covers:* Normalization immutability, descriptor boundaries, error isolation, session restarts, and scalar formatting.

3. **Frozen Example Scripts (Example-First Gates):**
   - Elevator scripts (`examples/des-elevator/01-single-trip.ts` through `05-validation-arrivals-and-budget.ts`): All 5 executed headlessly and passed (exit code 0).
   - Spatial UI scripts (`examples/ui-des-scenes/01-residents-and-clerks.ts` through `05-picking-and-disposal.ts`): All 5 executed headlessly and passed (exit code 0).

---

## 8. Final Review Verdict

- **Findings & Defect Resolution:** All identified findings (WebIDL buffer integer wrapping, stale documentation, and narrow label collision) have been addressed through verified commits (`1e5849c`, `1f994d5`, `b3cb3b9`).
- **Boundary Distinction:** This review covers design, transfer fidelity, contract adherence, and source-code integrity. As required by project standards, visual screenshot inspection (44 browser images) and interactive browser flow validation (11 flows) remain separate, ongoing evaluation gates. Prior DES phase approvals do not substitute for this new UI.
- **Verdict:** **APPROVED** for the full scope of commits `362dce2..1f994d5` and corrective commits through `b3cb3b9` on `feat/salabim-concepts`.
