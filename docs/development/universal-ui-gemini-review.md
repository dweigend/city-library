# Independent Universal UI Design, Transfer, and Source Code Review

**Evaluator:** Independent Reviewer (`gemini-3.8-flash`, high reasoning), operating as an isolated review agent distinct from feature implementation authors, migration/refactoring authors, native Codex reviewers, and browser/image QA agents.  
**Repository Worktree:** `/home/david/.t3/worktrees/city-library/t3-4aa89a8c`  
**Git Branch / Commit Range:** `feat/salabim-concepts`  
- **Baseline Commit:** `a78bd2359e7a12ac537be131ca8d3023c4b718eb` (Universal UI baseline capture and 146-model audit origin)  
- **Inspected HEAD:** `c125e39a09c23c2fed68089decc5d92f337823b4` ("docs: reconcile universal UI contracts and all 146 migration decisions")  
- **Key Intervening Source & Corrective Commits:**  
  - `6a6c6b757e79c53c4fe6322ad4e3e3b75a13c9bb` (Phase A frozen contracts: live changes and stable chart colors)  
  - `3b6254b17a1f592d37c8701540fe3ff23b9d0319` (Chart default color lifetime preservation)  
  - `1e434c0e27c1cf09886a11700688c3a1ae87e41b` (Phase A runtime: explicit change action fallback)  
  - `9de6da81699742fc7d62758117ea7e9f390098f9` (Phase B frozen contracts: pure collections and complete table inspection)  
  - `ab0b708cf67d4aa333333b2bf8876bc29fc34f78` (Phase B runtime: collectionDiagram projection helper)  
  - `f806d2df200a72c1c68383f98246e45f9bf3bf09` (Table 200-row paging and complete inspection)  
  - `8f538917e7c805eb3eb6e7d69e46a7ce32fef872` (DES collection scene migrations: office, EV charging, goods buffer)  
  - `0875b8ea792515e0fc21e053f3170669bfe662f5` (Nonselectable spatial decoration typing)  
  - `bbfd5ee7d605c3c0efbe36c6a287950c7fc01a93` (Clarity refactoring of collection item and capacity rules)  
  - `f91b27e82ca85a7903f10558c85d5109a83b2bd9` (Fix: eliminate reactive circular feedback in Svelte table page effect)  
  - `f8143bdd6d1c9c013c0cc7f1ee2ba7f5b3b2fd40` (Fix: copy own data descriptors to detach validated arrays before collection mapping)  
  - `0254bb2ef8b3372c3d0ffc9269bb12f8fc739ba6` (Independent test suite: 36 tests / 322,342 assertions)  
  - `b1051eb33c5e828a2a7587849e7cb2876bf7d8b5` (Selection refactor: exclude PSO highlight and Vision FOV overlays from entity picking)  
  - `434978b2b3d79e0fa110ad8dbb18d766ca320e3e` (Fix: center collection headings within shared canvas bounds)  
  - `819f5ff9526b8b92ce676eec056b8f69683de679` (Fix: restore extensible `UISpec` interface and introduce `ChangeUISpec`)  
  - `17bb7e0a2ca7503fc71efbf3d13543ce79f532a7` (Native source review approval)  

---

## 1. Executive Summary & Findings Disposition

| Review Area | Status | Technical Assessment / Verification Finding |
| :--- | :--- | :--- |
| **User Goal & Architecture** | **VERIFIED** | Provides a single unified fast-prototype UI authoring API reusing existing modules (`normalizeAuthoring`, `mountCanvas`, `scientificPalette`, Svelte/shadcn controls). Zero parallel renderers, zero scene DSLs, zero domain simulation clocks, and zero new core UI dependencies in `city-library`. |
| **Phase A: Live Writes** | **VERIFIED** | Introduces `change(instance, changes)` fallback (`LiveChanges<P> = Partial<P>`). Descriptor decoding validates single own-key dispatch; local `set` takes precedence. Pre-Setup edits remain inert draft updates. Consolidated 483 forwarding setters across 82 UI bindings with whole-program AST equivalence proof. |
| **Phase A: Chart Lifetime** | **VERIFIED** | Default series colors keyed stably by unique label throughout mounted view lifetime. Explicit series colors always take precedence; duplicate labels maintain positional fallback; state cleanly resets on view disposal/remount. |
| **Phase B: Pure Collections** | **VERIFIED** | `collectionDiagram` produces standard `SpatialData`. Disjoint row kinds (`items`, `count`, `capacity`) strictly separate real identified entities from aggregate quantities. Preserves model-owned queue order, never manufactures artificial slot/seat assignments, and leaves excess capacity visible. |
| **Phase B: Complete Table Inspection** | **VERIFIED** | Complete inspection via host-owned 200-row paging with accessible previous/next controls, range/total labels, first-record column ordering, and empty-state handling. Paging never mutates model data or creates entity IDs. |
| **Model Immutability & Parity** | **VERIFIED** | 145 simulation models are 100% byte-identical to baseline. Exactly one approved observation field was added (`waitingResidents` directly from `Resource.waiting` in `experiments/des-civic-office/model.ts`). 98 exposed RNG models sampled across 294 snapshots (steps 0, 1, 3) are byte-identical. |
| **Finding: Interface Extensibility Regression** | **RESOLVED (`819f5ff`)** | Initial type alias broke downstream `interface ExtendedSpec extends UISpec<P, M>` (TS2312). Restored `UISpec` as an extendable interface with required `set`; added `ChangeUISpec` for required `change`; united them via `AuthoringSpec` under flat `defineUI`. Verified via compile-only regressions and external consumer. |
| **Finding: Svelte Table Effect Feedback** | **RESOLVED (`f91b27e`)** | Reactive circular dependency where table paging effect read and wrote `rows` state. Fixed by reading `rows(value)` into local `projectedRows` before assigning reactive state. |
| **Finding: Inherited Array Hook Poisoning** | **RESOLVED (`f8143bd`)** | Array subclasses overriding `map`, iterators, or `Symbol.species` could alter or erase identified items during normalization. Corrected by copying own property descriptors into plain arrays before processing. Verified by adversarial regression. |
| **Finding: Collection Heading Canvas Alignment** | **RESOLVED (`434978b`)** | Collection labels originally hardcoded `x: left`, causing misalignment on centered canvases. Corrected to `x: 0` (center-anchored within diagram bounds) without global canvas shifts. |
| **Finding: Overlay Selection Pollution** | **RESOLVED (`b1051eb`)** | PSO best-position highlight and Vision FOV overlays previously captured mouse clicks and nearest queries. Setting `selectable: false` excludes them from picking while retaining rendering order and formula geometry. |
| **Delivery Gate Integrity** | **VERIFIED** | Phase A (`6a6c6b7`) and Phase B (`9de6da8`) public authoring contracts were frozen in git before runtime implementations (`1e434c0`, `ab0b708`). Editorial type renames did not weaken expectations or relax test assertions. |
| **Overall Scope Verdict** | **APPROVED** | **APPROVED for Design, Contract Transfer, and Source Code Scope.** (Browser interactions, live viewports, and screenshot visual acceptance remain separate independent gates.) |

---

## 2. Public Type Compatibility Correction (`819f5ff`)

### 2.1 The Issue
The initial Phase A implementation defined `UISpec` as a discriminated type alias:
```ts
// Initial definition breaking downstream interface extension:
export type UISpec<P extends object, M extends ModelInstance> = UISpecBase<P, M> & (
  | { readonly change: (model: M, changes: LiveChanges<P>) => void; readonly live?: KeyedLive<P, M, true>; }
  | { readonly change?: undefined; readonly live?: readonly LegacyLiveField<P, M>[] | KeyedLive<P, M>; }
);
```
Downstream consumers extending `UISpec` with standard TypeScript syntax:
```ts
interface ExtendedSpec extends UISpec<Parameters, Instance> { marker?: string; }
```
failed compilation with `TS2312: An interface can only extend an object type or intersection of object types with statically known members.`

### 2.2 The Solution
In commit `819f5ff9526b8b92ce676eec056b8f69683de679`, the authoring types were cleanly separated into two distinct interfaces:
1. **`UISpec<P, M>`**: Restored as an extendable interface representing the baseline contract with required field setters when `live` is specified without a common write action.
2. **`ChangeUISpec<P, M>`**: Exported interface representing the new authoring form with a required `change: (model: M, changes: LiveChanges<P>) => void` action and optional per-field `set` overrides.
3. **`AuthoringSpec<P, M>`**: Internal union type alias `UISpec<P, M> | ChangeUISpec<P, M>` used internally by `defineUI` and `normalizeAuthoring`.

Both `ui/index.ts` and `ui/svelte/index.ts` export `UISpec` and `ChangeUISpec`. The flat public authoring call syntax `defineUI(model, { change, live, ... })` is completely preserved. The four `NoInfer` and monitor overloads in `ui/compose.ts` and `ui/svelte/compose.ts` remain intact, providing compile-time type inference without requiring explicit type parameters from authors.

### 2.3 Frozen Contract & Test Editorial Amendments
To maintain strict type safety, four newly frozen positive examples in `examples/ui-live-changes/` (`01-shared-change.ts`, `02-binding-override.ts`, `03-groups-labels-enabled.ts`, `04-drafts-errors-and-legacy.ts`) and two tests in `tests/universal-ui-adversarial.test.ts` had their explicit type annotations updated from `UISpec` to `ChangeUISpec`.

The reviewer verified that:
- Only type import specifiers and type annotation identifiers were changed.
- Object structures, runtime values, callback logic, assertions, and negative compile-time tests (`@ts-expect-error`) remained byte-identical.
- `examples/ui-live-changes/SHA256SUMS` and `README.md` were updated with explicit documentation of the type correction.
- A dedicated compile-only regression file (`tests/universal-live-changes.types.ts`) was added, verifying both `interface ExtendedSpec extends UISpec` and `interface ExtendedChangeSpec extends ChangeUISpec`.

---

## 3. Concrete Implementation Fixes & Architectural Safety

### 3.1 Svelte Table Paging Reactive Feedback (`f91b27e`)
In `ui/svelte/views/View.svelte`, the reactive effect monitoring view updates previously executed:
```svelte
if (current.type === "table") {
  rows = current.rows(value);
  page = tablePage(rows, untrack(() => page)).page;
}
```
Because `rows` is a reactive Svelte state signal, passing `rows` directly to `tablePage` inside the effect created a cyclic dependency hazard. Commit `f91b27e` decoupled the computation:
```svelte
if (current.type === "table") {
  const projectedRows = current.rows(value);
  page = tablePage(projectedRows, untrack(() => page)).page;
  rows = projectedRows;
}
```
This ensures `tablePage` computes paging against a plain local array `projectedRows` before assigning the reactive `rows` signal, eliminating circular re-triggering.

### 3.2 Detaching Validated Arrays Against Inherited Hook Poisoning (`f8143bd`)
In `ui/views/collections.ts`, collection rows and items could be supplied as subclassed arrays or objects with inherited prototype modifications. If a caller supplied an `Array` subclass overriding `map`, `[Symbol.iterator]`, or `Symbol.species`, the normalization pipeline could execute untrusted prototype code or produce an empty collection.

Commit `f8143bd` implemented a robust boundary defense:
```ts
function array(value: unknown, name: string): readonly unknown[] {
  if (!Array.isArray(value)) throw new TypeError(`${name} must be an array.`);
  const descriptors = new Map<PropertyKey, PropertyDescriptor>();
  for (const key of Reflect.ownKeys(value)) descriptors.set(key, Object.getOwnPropertyDescriptor(value, key)!);
  const length: number = descriptors.get("length")!.value;
  for (const [key, descriptor] of descriptors) {
    if (!("value" in descriptor)) throw new TypeError(`${name} cannot contain accessors.`);
    if (key !== "length" && (typeof key !== "string" || !/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= length))
      throw new TypeError(`${name} cannot contain extra properties.`);
  }
  const detached: unknown[] = [];
  for (let index = 0; index < length; index++) {
    const descriptor = descriptors.get(String(index));
    if (!descriptor) throw new TypeError(`${name} cannot contain holes.`);
    detached.push(descriptor.value);
  }
  return detached;
}
```
By snapshotting own property descriptors into a private Map and extracting indexed data descriptors directly, normalization bypasses all inherited getters, methods, iterators, and constructor/species hooks. This was independently tested and verified via `tests/universal-ui-adversarial.test.ts` ("inherited array methods, iterators and species cannot erase identified items").

### 3.3 Center-Anchoring Collection Headings (`434978b`)
In `ui/views/collections.ts`, collection row headings were originally anchored at `x: left`. On canvases with centered spatial projection, this positioned headings against the left bounding box edge while items flowed from the center. Commit `434978b` updated the label x-coordinate:
```ts
for (const [line, text] of headings[index]!.entries()) labels.push({ x: 0, y: top - line * layout.labelLine, text });
```
This anchors labels symmetrically at $x = 0$ within the diagram's local coordinate system without altering global canvas coordinate transforms or affecting other spatial view types.

### 3.4 Nonselectable Presentation Overlays (`b1051eb`)
In `experiments/particle-swarm-optimization/ui.ts` and `experiments/vision-evolution/ui.ts`, visual overlays were rendered into the spatial scene graph:
- PSO rendered a `highlight` circle for the swarm's global best position.
- Vision Evolution rendered `fov-${a.id}` arcs representing agent vision fields.

Previously, these presentation glyphs inherited default selectability (`selectable: true`), capturing pointer clicks, bounding-box hits, and nearest-agent keyboard queries, effectively preventing users from selecting the real agents underneath.

Commit `b1051eb` added `selectable: false` to both overlays:
- PSO: `highlight` has `selectable: false`.
- Vision Evolution: `fov-${a.id}` has `selectable: false`.

The geometry, position, size, formulas, colors, and painter order are strictly preserved; only interaction selection routing is corrected.

---

## 4. Model Invariants, RNG Determinism, and Migration Scope

### 4.1 Minimal Model Delta
Out of all 146 registered models across the repository, exactly one model file was modified:
- `experiments/des-civic-office/model.ts`: Added `waitingResidents: readonly Resident[]` to the observation snapshot, populated directly from `this.clerks.waiting` (Resource FIFO queue).
- All other 145 model implementation files have zero changes and match baseline commit `a78bd23` byte-for-byte.

### 4.2 Exact RNG Determinism & Observation Parity
- **98 Exposed-RNG Models:** Across 294 discrete capture snapshots (steps 0, 1, and 3), all random number generator states (`randomState`) are 100% byte-identical to baseline.
- **146 Observation Records:** All observation fields match baseline captures exactly. When excluding the single approved `waitingResidents` field in Civic Office, observation output across all 146 models is 100% byte-identical.
- **Refactoring AST Proof:** Whole-program AST analysis verified that across all 82 migrated UI files (consolidating 483 repetitive forwarding setters into `change`), the ASTs are identical to baseline except for the common writer consolidation and the two explicit `selectable: false` overlay flags.

### 4.3 Scene Helpers & Boundary Integrity
Three DES models were migrated to use `collectionDiagram`:
1. `experiments/des-civic-office/scene.ts`: Replaced ad-hoc layout with `collectionDiagram` displaying waiting residents (supplied order), in-service residents, completed residents, and clerk capacity.
2. `experiments/des-ev-charging/scene.ts`: Replaced ad-hoc layout with `collectionDiagram` displaying waiting vehicles (priority diamond order), active charging sessions, completed vehicles, cancelled vehicles, and charger capacity.
3. `experiments/des-goods-buffer/scene.ts`: Replaced ad-hoc layout with `collectionDiagram` displaying Store buffer contents, accepted stock, and blocked puts.

Other complex spatial scenes (such as Elevator, Traffic Grid, Bus Route, Disease Solo) retain their domain-specific geometry, physical coordinates, and custom topologies without forced homogenization.

---

## 5. Reviewer Executed Verification & Independent Evidence

The reviewer directly executed the following suite of focused verification checks in `/home/david/.t3/worktrees/city-library/t3-4aa89a8c`:

### 5.1 Focused Behavior & Adversarial Test Suite
```sh
bun test tests/universal-ui-adversarial.test.ts tests/universal-live-changes.test.ts \
  tests/universal-collections.test.ts tests/ui-chart-authoring.test.ts \
  tests/ui-des-scene-kernel.test.ts tests/des-scenes-a.test.ts tests/des-scene-parity.test.ts
```
**Result:** **43 passed, 0 failed, 322,395 assertions** (Duration: 392ms).

### 5.2 Public Example Acceptance Scripts
All ten public frozen contract scripts were executed headlessly:
- `examples/ui-live-changes/01-shared-change.ts` through `05-stable-chart-colors.ts`: All 5 passed with exit code 0.
- `examples/ui-collections/01-store-items.ts` through `05-complete-table-inspection.ts`: All 5 passed with exit code 0.

### 5.3 Static Type Checking
- `bunx tsc --noEmit -p examples/ui-live-changes/tsconfig.json`: Passed with 0 errors.
- `bunx tsc --noEmit -p examples/ui-collections/tsconfig.json`: Passed with 0 errors (including intentional negative assertions).
- `bunx tsc --noEmit -p tsconfig.dev.json`: Passed with 0 errors (including `universal-live-changes.types.ts`).
- `bun run typecheck`: Passed with 0 errors across all workspaces and packages:
  - `tsc --noEmit` (Core library): Passed.
  - `tsc -p tsconfig.dev.json`: Passed.
  - `tsc -p tsconfig.ui.json`: Passed.
  - `tsc -p tsconfig.ui-examples.json`: Passed.
  - `tsc -p tsconfig.vite.json`: Passed.
  - `bun run check:ui:svelte` (`svelte-check`): **0 errors, 0 warnings**.

### 5.4 Production Svelte UI Build
```sh
bun run build:ui:svelte
```
**Result:** Passed with exit code 0 in 556ms (producing optimized client bundle in `agent-lab-output/svelte/`).

### 5.5 Standalone Public UI Consumer Outside Repository
Executed external consumer test (`/tmp/universal-ui-consumer/consumer.ts`) verifying that an independent client importing `defineUI`, `collectionDiagram`, `UISpec`, and `ChangeUISpec`:
- Operates in ambient-free TypeScript and Node/Bun ESM.
- Remains completely inert without DOM or simulation initialization.
- Validates both legacy interface extension and new common write interfaces.
**Result:** Passed with exit code 0.

---

## 6. Scope Boundaries & Retained Limits

To ensure strict engineering and scientific integrity:
1. **Pre-existing Domain Debt Retained:** Taxi Cabs (`experiments/taxi-cabs/ui.ts`) continues to compute histogram bins in UI code from detached trip observations. This pre-existing architectural debt was intentionally retained and documented rather than risking formula or RNG drift during UI refactoring.
2. **No Claim of Scientific Recalibration:** This review approves UI authoring ergonomics, typing contracts, and presentation fidelity. It does not certify empirical real-world validity or domain calibration of simulation models.
3. **Continuation & State Serialization:** Models with unexposed RNG state or closure-captured variables remain unexposed; no general serialization or resume-from-arbitrary-step guarantee is made.
4. **Separation of QA Gates:** Browser catalog smoke tests (146 setups/steps), interactive live edit flows (82 instances), 11 DES deep interactive sessions, and 44 visual screenshot inspections are verified as part of the coordinator's separate QA evidence (`docs/development/universal-ui-browser-evidence/`). This source review confirms architectural safety and code correctness; it does not substitute for browser/visual sign-off.
5. **Prior Reviews:** Previous approvals for discrete-event simulation (e.g. `docs/development/des-gemini-final-review.md`) do not cover this universal UI expansion.

---

## 7. Final Verdict

**APPROVED for Design, Contract Transfer, and Source Code Scope.**

The universal UI implementation at HEAD `c125e39a09c23c2fed68089decc5d92f337823b4` satisfies all architectural, typing, safety, and parity contracts:
- Public type extensibility is preserved via `UISpec` and `ChangeUISpec`.
- Live parameter writes are clean, deterministic, and single-key dispatched.
- Collection diagrams strictly respect entity identity, queue order, and capacity truth without inventing slot assignments.
- Reactive feedback loops, array prototype vulnerabilities, and overlay selection hazards have been definitively fixed and verified with regression tests.
- Model state and RNG determinism across all 146 models are fully preserved.
