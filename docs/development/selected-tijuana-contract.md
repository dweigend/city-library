# Tijuana Bordertowns: frozen full public delivery contract

Prepared 6 November 2026. **COORDINATOR-FROZEN BEFORE RUNTIME. No target runtime exists at freeze.** The coordinator inspected the complete proposed contract, five scripts and helper, resolved native boundaries with additional executed source probes, and commits their hashes before delegating implementation. The earlier five-model CLEAR-only proposal is not this model's acceptance. This document introduces a model-specific authoring surface, not a new core API, generic checkpoint framework, independent approval or scientific validation.

## Source and evidence authority

The selected identity is `Curricular Models/Urban Suite/Urban Suite - Tijuana Bordertowns`. The unchanged [source](../../experiments/urban-suite-tijuana-bordertowns/source.nlogox) is NetLogo 7.0.4, SHA-256 `8cada3e3638c93704f5eefbba4e9aa3840c991e2d5ab711ea759c4b31aedcfb2`, pinned to Galapagos `90be931773fcf499049247a8aaa1aecbe003654c`. Copyright 2007 Uri Wilensky, CC BY-NC-SA 3.0; [NOTICE](../../experiments/urban-suite-tijuana-bordertowns/NOTICE.md) retains De Leon/Felsen/Wilensky and predecessor/course credits. Complete Procedures, Widgets, Info and the substantive ADD NODE widget command were read. The archive has no required external assets/extensions/includes. The existing scientific dossier is separate; no literature research was repeated.

Read the [phase/failure analysis](tijuana-deep-contract-analysis.md), then the [executed original-browser report](tijuana-reference-browser.md). The latter resolves several earlier open questions and supersedes predicted primitive outcomes: native seed1 completed naturally on CITYSCAPE call351, reset to0 and subsequently ran GO; native CLEAR changes RNG continuation without reseeding; negative patch radii, creation/sample counts, sparse errors and hard motion have concrete observed meanings. The coordinator also executed coincident FACE and fresh create/sprout heading probes: FACE retained heading123; fresh births had nonconstant integer headings. Those follow-up artifacts are coordinator-owned. No target seed is equated with native seed1.

## Core composition and state authority

Use one public World, attached hard Grid and explicit Random throughout the instance. Centers are x=-85..85, y=-57..57 (171x115); absolute native-compatible positions are lower-inclusive/upper-exclusive at -85.5/+85.5 and -57.5/+57.5. No geographic/currency/year conversion is invented. World.tick owns scientific time. Explicit public tick advance/reset implements the source preincrement and completion reset; do not wrap those actions in post-increment `run`.

Canonical Fields own the nine patch properties below. World membership owns the population; canonical Agents own kind, position/orientation, source birth ordinal and breed data. Migrant workplace and builder origin references remain canonical Agent/Field references internally. `occupied` is an intentionally stale **source cache**, not the Grid occupancy index. Reads, UI, tracing and history own no second population, topology, clock or generator. Transient activation/neighbor arrays contain canonical references only.

Use delivered public normal draws/cache continuation, geometry.direction/normalize/distance, Agent movement/orientation, Grid neighbors/diffusion/fieldAt/agentsAt and public summaries where appropriate. Ordinary equations, source predicates and the named source phases remain readable TypeScript composition. Reuse core implementations; do not embed another Random/geometry/grid/statistics engine or transpile NetLogo.

Target source scheduling is explicit: each actual source ask uses a fresh eligible canonical snapshot and public legacy-shuffle activation when actor order matters. Same-ask hatch children wait until a later ask; a child of another breed participates in a later breed ask in the same call. Skip entries already dead. Source create/sprout creates the whole requested batch before randomized initialization where `count builders` depends on the batch. Allocate birth ordinals across **all** breeds, including centers, nodes, rings and hatch children; CLEAR resets that source ordinal. Never parse framework IDs.

Fresh create/sprout headings use public uniform integers0..359 before explicit source heading changes. A hatch inherits heading. This is essential for a regularization builder whose nearest migrant is coincident: native FACE is then a no-op, preserving its random default orientation. Do not invent heading0/north or another angle at zero distance. Default color draws that are later overwritten may be omitted as a declared RNG/presentation adaptation; the target default color is0. The exact target draw schedule must be documented by implementation and retained by replay tests. No matched-engine random stream is promised.

## Exported model surface

The future `experiments/urban-suite-tijuana-bordertowns/model.ts` exports `inputs`, `create(options={})` and inert `model satisfies Definition<TijuanaParameters,TijuanaModel>`, together with these named types and the model boundary error class. All listed fields are required unless marked optional. Type aliases below define the closed shape; readonly applies recursively to input and detached read records.

```ts
import type { RandomState } from "city-library";

type VisualUpdate = "off" | "elevation" | "land value gradient" | "colonias"
  | "units with no water" | "units with no electricity";
interface TijuanaRules {
  maquiladoras: number; serviceCenters: number;
  migrationTicks: number; crossingTicks: number; buildingTicks: number;
  initDensity: number; coloniaSize: number; requiredCapital: number;
  carryingCapacity: number; visualUpdate: VisualUpdate;
  colorCode: boolean; cityGrowth: boolean;
}
interface TijuanaParameters extends TijuanaRules { seed: number }
type Origin = "oaxaca" | "jalisco" | "zacatecas" | "mexico";
interface TijuanaFieldInput {
  landValue: number;
  water: number | "0.0"; electricity: number | "0.0"; transport: number | "0.0";
  occupied: 0 | "no" | "maquiladora" | Origin;
  ctr: 0 | "+" | "p-i-lots";
  elevation: number; colonia: number; colorNumber: number;
}
interface TijuanaGlobals {
  values: number; weights: number; marginalValue: number; marginalWeight: number;
  crossed: number; maxCost: number; thirdPhase: 0 | "go" | "stop";
  setupDone: boolean;
}
interface TurtleInput {
  key: string; birthOrdinal: number; x: number; y: number; heading: number;
  size: number; colorNumber: number; shape: string; label: string | number;
  hidden: boolean; penDown: boolean; penSize: number;
}
type BuilderOriginInput = 0
  | { kind: "services"; keys: readonly string[] }
  | { kind: "field"; x: number; y: number };
type TijuanaAgentInput =
  | TurtleInput & { kind: "service-center" }
  | TurtleInput & { kind: "employment-center" }
  | TurtleInput & { kind: "ring" }
  | TurtleInput & { kind: "node" }
  | TurtleInput & { kind: "first-builder"; energy: number; weight: number;
      blockSize: number; tooClose: 0 | readonly string[]; origin: BuilderOriginInput }
  | TurtleInput & { kind: "second-builder"; energy: number;
      weight: number; origin: BuilderOriginInput }
  | TurtleInput & { kind: "third-builder"; energy: number;
      weight: number; origin: BuilderOriginInput }
  | TurtleInput & { kind: "migrant"; income: number; savings: number;
      livingExpenses: number; residentSince: number; origin: 0 | Origin;
      works: 0 | readonly string[] };
interface TijuanaScenario {
  mode: "ordinary" | "diagnostic";
  tick: number; parameters: TijuanaRules; globals: TijuanaGlobals;
  nextBirthOrdinal: number; cells: readonly TijuanaFieldInput[];
  agents: readonly TijuanaAgentInput[]; randomState: RandomState;
}
type BoundaryCode = "empty-mean" | "empty-max" | "empty-selection"
  | "invalid-sample-count" | "sample-shortage" | "numeric-type"
  | "zero-divisor" | "invalid-source-reference";
declare class TijuanaRuntimeError extends Error {
  readonly code: BoundaryCode;
  constructor(code: BoundaryCode, message: string);
}
interface ActionResult {
  status: "noop" | "guarded" | "advanced" | "ready";
  completed: number;
  message?: string;
}
interface TijuanaModel {
  clear(): void;
  advanceCityscape(count?: number): ActionResult;
  advance(count?: number): ActionResult;
  setRules(rules: Partial<TijuanaRules>): void;
  updateDisplay(): void;
  addNode(position: { x: number; y: number }): void;
  setScenario(scenario: TijuanaScenario): void;
  read(): TijuanaRead;
}
```

The declaration code is a proposed type contract, not an implementation/stub. Separate discriminated members ensure that every `Extract<TijuanaAgentInput,{kind:"third-builder"}>` and equivalent helper type must resolve correctly. The type names imported by `scenario.ts` are required exports. Runtime validation rejects variant-inappropriate properties rather than accepting a bag of optional breed data.

| Input | Default | Source bounds/step |
| --- | ---: | --- |
| seed |1|Target only, signed/unsigned32-bit integer; factory configuration, not setRules.|
| maquiladoras |8|Integer1..8.|
| serviceCenters |3|Integer1..3.|
| migrationTicks |3|Integer1..20.|
| crossingTicks |15|Integer1..20.|
| buildingTicks |6|.5..6, step.5; never coerce to integer.|
| initDensity |.7|.5..1, step.1.|
| coloniaSize |2|0..2, step.25.|
| requiredCapital |500|150..1200, step10.|
| carryingCapacity |6|Integer1..6.|
| visualUpdate |off|The exact six literals above.|
| colorCode |true|Boolean.|
| cityGrowth |false|Boolean.|

All rules remain editable without implicit reset/recolor; the source reads them at its next actual procedure site. Center/maquiladora count edits do not magically rebuild existing Agents, but later source adjustment/placement reads the current value. `setRules` rejects seed/unknown/accessor/nonplain/nonfinite/out-of-range/off-step values before writes. The configured seed may retain its supplied signed representation in parameters while the public Random normalizes it to uint32. Inputs and returned parameters are frozen.

## Action timing, errors and history

Construction creates a **cleared** instance: no Agents, all scientific patch properties0, colorNumber9.9, tick0, globals0/thirdPhase0/setupDonefalse, epoch0, empty successful-call history/traces and no failure. It does not hide a cityscape loop or draw initialization randomness. The helper's infrastructure defaults are different explicit diagnostic data, not runtime defaults.

`clear()` retains the same World/Grid/Random and Field IDs, deletes Agents, clears source caches/traces/history/failure/warnings, resets the one World tick and birth ordinal, and increments the observational epoch. It preserves controls and the **complete** Random continuation/cache. This no-draw CLEAR differs from the executed original patch-ask schedule and must be declared; no-reseed alone would not establish native equivalence.

Both advance methods accept the existing `stepCount` domain0..1,000,000. Count0 returns `{status:"noop",completed:0}` without evaluating guards or changing any read state. Invalid counts fail atomically. Before setup completion, GO returns guarded/completed0/message; once setup is complete, CITYSCAPE does likewise. Guard messages belong to the returned outcome/host and do not mutate `read()` (including history/failure/warnings), enabling the full snapshot purity assertion. A successful call returns advanced with the actual completed call count, or ready when that CITYSCAPE call completed economics/reset. Stop a batch at readiness; do not execute extra guards or add ticks for unused budget.

Every source CITYSCAPE/GO call advances **before** procedures. Preserve the complete call graph in the deep analysis: generate-cityscape still executes each cityscape call; helper STOP returns to the enclosing setup; job presence does not skip all later source phases; surviving second builders can participate again; .65 expansion/economics/reset can all occur in one call. Do not use an irreversible phase enum as the executable program. A ready GO has no successful empty-population/steady-state terminal rule: `done` remains false, and later empty max/mean may fail after tick advance.

Only explicitly implemented **native operation boundaries** throw `TijuanaRuntimeError` with a stable code and descriptive source-operation message. A normal TypeError, invariant assertion, unexpected public-library failure or programming error must propagate; never blanket-wrap unknown errors into the admissible source-error class. Input validation uses ordinary TypeError/RangeError and never records a scientific runtime failure. The natural five-seed script catches only TijuanaRuntimeError, so a programming error cannot silently become one seed's allowed outcome.

A scientific runtime failure keeps its preincrement, earlier writes/births/deaths/heading changes and consumed Random continuation/cache. Record a detached `lastFailure` with action (`cityscape`, `go`, `update-display` or `add-node`), current tick, epoch, boundary code and message; unexpected errors may be recorded with a separate `unexpected` code but must still propagate unchanged. Do not append a successful history record for a failed call. No rollback/retry from the beginning is implied. Invalid setters must preserve even an already partial failed snapshot exactly.

History records every completed CITYSCAPE/GO call independently of caller batching, with action, epoch, tickBefore, tickAfter, setupDone, all counts and seedMigrants. If history is bounded, preserve the first completed call plus at least the latest1000 completed calls (no synthetic setup record); never allow batching to change retained history. Reset completion increments epoch before recording its tickAfter0 record. Epoch describes reset segments; it is not an advancing scientific clock. Rules/display/node/guard/read actions do not append successful simulation calls. Clear and scenario replacement start a fresh history segment and empty history. `lastFailure` is null initially, after clear/scenario replacement, and after a later successful scientific call; pure reads/guards do not clear it.

## Closed fixture and detached read shapes

`setScenario` is an explicit **target-only diagnostic action**, not source UI, framework persistence or an alternate simulation. It requires every top-level property shown above and all fields of each discriminated variant. `cells` contains exactly19665 complete patch-data records in the same canonical Grid.fields/read.cells order; coordinates/IDs are not accepted from clients. There are no implicit field/rule/agent defaults inside the runtime. `scenario.ts` visibly expands its defaults into this complete shape before the public call.

Validate the whole request before mutation: exact own data keys, plain/null-prototype records, dense ordinary arrays without extra keys/accessors, finite numeric values, supported string/boolean variants, unique nonempty fixture keys, unique nonnegative safe birth ordinals, a safe nextBirthOrdinal greater than every admitted ordinal, safe nonnegative tick and valid rules. Signed energy/weight/income/savings/land/colonia/size remain admitted finite diagnostic values; do not clamp them or reject negative turtle size. Integer source counters/ordinals remain integer. penSize must be finite/nonnegative. Field origins must identify actual integer patch centers. Absolute Agent/node positions obey the observed half-open hard endpoints; heading is finite and normalized using public orientation operations. Numeric fields accept only their declared numeric domain or the exact industrial string"0.0", not arbitrary JS coercible objects/strings.

Resolve `works`, builder service keys and `tooClose` keys to the new canonical Agents only after all keys/kinds/references validate. Reject a missing key in **both** modes (script3 requires this), duplicate keys, a work reference to a non-employment-center, and a service-origin key to another breed. `mode:"ordinary"` additionally requires complete usable migrant work/service context when migrants exist; diagnostic mode may explicitly admit empty work/service context, explicit source-initial zero breed values, scientific/cache mismatch and unusual finite tail states. Neither mode proves a state naturally reachable. Both admit ordinary source cache lag and all structurally valid overlaps. The five scripts explicitly use diagnostic mode; their injected typed-utility and sparse states are never called natural trajectories.

Validate the existing public RandomState algorithm/revision/word/gaussian cache before any live change, with seed matching the configured Random seed after uint32 normalization. A temporary public Random copy may validate continuation without drawing; it is not a persistent second authority. On success restore the live continuation exactly, use public World tick reset/advance, replace Agents in supplied array order, install supplied globals/caches/fields/next ordinal, and resolve canonical references. Retain Field identities and configured factory seed. Clear observational traces/history/failure/warnings and start a new epoch; do not recompute land, expenses, occupancy, colony caches or ready flags. No injected native callback, arbitrary procedure, predetermined draw list or private RNG is allowed.

`read(): TijuanaRead` returns deeply frozen detached plain data:

```ts
type AgentReference = Readonly<{ id: string; birthOrdinal: number; alive: boolean }>;
type FieldRead = Readonly<TijuanaFieldInput & { id: string; x: number; y: number }>;
type TurtleRead = Readonly<Omit<TurtleInput, "key"> & { id: string }>;
type BuilderOriginRead = 0
  | Readonly<{ kind: "services"; agents: readonly AgentReference[] }>
  | Readonly<{ kind: "field"; id: string; x: number; y: number }>;
type TijuanaAgentRead =
  | TurtleRead & Readonly<{ kind: "service-center" }>
  | TurtleRead & Readonly<{ kind: "employment-center" }>
  | TurtleRead & Readonly<{ kind: "ring" }>
  | TurtleRead & Readonly<{ kind: "node" }>
  | TurtleRead & Readonly<{ kind: "first-builder"; energy: number; weight: number;
      blockSize: number; tooClose: 0 | readonly AgentReference[]; origin: BuilderOriginRead }>
  | TurtleRead & Readonly<{ kind: "second-builder"; energy: number; weight: number;
      origin: BuilderOriginRead }>
  | TurtleRead & Readonly<{ kind: "third-builder"; energy: number; weight: number;
      origin: BuilderOriginRead }>
  | TurtleRead & Readonly<{ kind: "migrant"; income: number; savings: number;
      livingExpenses: number; residentSince: number; origin: 0 | Origin;
      works: 0 | readonly AgentReference[] }>;
type TijuanaCounts = Readonly<{
  serviceCenters: number; employmentCenters: number;
  firstBuilders: number; secondBuilders: number; thirdBuilders: number;
  migrants: number; rings: number; nodes: number;
}>;
type ReporterReason = "empty-subset" | "zero-denominator" | null;
type TijuanaReports = Readonly<{
  savings: number | undefined; savingsNode: number | undefined;
  equippedPatchCount: number;
  noWaterPercent: number | undefined; noPowerPercent: number | undefined;
  unavailable: Readonly<{ savings: ReporterReason; savingsNode: ReporterReason;
    noWaterPercent: ReporterReason; noPowerPercent: ReporterReason }>;
}>;
type CompletedCall = Readonly<{
  action: "cityscape" | "go"; epoch: number; tickBefore: number; tickAfter: number;
  setupDone: boolean; counts: TijuanaCounts; seedMigrants: number;
}>;
type FailedCall = Readonly<{
  action: "cityscape" | "go" | "update-display" | "add-node";
  tick: number; epoch: number; code: BoundaryCode | "unexpected"; message: string;
}>;
type PenTrace = Readonly<{
  ordinal: number; birthOrdinal: number;
  from: Readonly<{ x: number; y: number }>; to: Readonly<{ x: number; y: number }>;
  colorNumber: number; width: number;
}>;
interface TijuanaRead {
  readonly width: 171; readonly height: 115; readonly tick: number; readonly epoch: number;
  readonly parameters: Readonly<TijuanaParameters>; readonly globals: Readonly<TijuanaGlobals>;
  readonly setupDone: boolean;
  readonly phase: "cleared" | "generating" | "seeding" | "expanding" | "ready";
  readonly cells: readonly FieldRead[]; readonly agents: readonly TijuanaAgentRead[];
  readonly counts: TijuanaCounts; readonly seedMigrants: number; readonly reports: TijuanaReports;
  readonly randomState: RandomState; readonly history: readonly CompletedCall[];
  readonly lastFailure: FailedCall | null; readonly warnings: readonly string[];
  readonly traces: readonly PenTrace[]; readonly done: false;
}
```

| Property | Closed meaning |
| --- | --- |
| width,height |171,115.|
| tick,epoch |The public World tick and observational reset-segment ordinal.|
| parameters,globals,setupDone |The complete parameters/globals above; top-level setupDone mirrors the same owned global, never another flag.|
| phase |Derived cleared/generating/seeding/expanding/ready summary only; never controls execution.|
| cells |Canonical-order `{id,x,y,...TijuanaFieldInput}` records.|
| agents |Discriminated live Agent records with canonical opaque id, birthOrdinal and all relevant Turtle/breed properties; fixture key omitted.|
| counts |Exactly serviceCenters,employmentCenters,firstBuilders,secondBuilders,thirdBuilders,migrants,rings,nodes.|
| seedMigrants |Count of migrants with size exactly.65.|
| reports |savings,savingsNode,equippedPatchCount,noWaterPercent,noPowerPercent and an unavailable-reason record with those four optional-valued reporter keys.|
| randomState |The unchanged public continuation including cached Gaussian.|
| history,lastFailure,warnings |Completed-call records, retained failure/null, and nonfatal source warning strings. Guards do not append warnings.|
| traces |Detached ordered pen segments specified below.|
| done |Always false; ready is not a GO terminal state.|

The current public cloneState/Agent.copy rejects deleted framework references. A source hatch can inherit a stale workplace reference without using it immediately; it must not acquire an unrelated core-copy failure. Compose the model birth through public Agent.add with its scalar source state/spatial options, then assign inherited canonical references through ordinary model property assignment where necessary. Preserve this compatibility boundary without changing the core copy contract, silently repairing the workplace or introducing a second population registry.

Agent references are detached `{id,birthOrdinal,alive}` records, computed from canonical references already held by live Agents. This applies to work lists, builder service origins and tooClose lists; input-only fixture keys do not escape. A source reference can outlive Agent deletion, so preserve source birth ordinal/liveness rather than replacing it with a random surviving job. Read field origins as `{kind:"field",id,x,y}`, service origins as `{kind:"services",agents:[references...]}`, or0 where the source is still uninitialized. Migrant origin remains0/the source origin string. Missing/dead work context raises an explicit error only when the source operation uses it. This does not require a historical population registry; these are projections of references, not another membership authority. The semantic helper normalizes both live and referenced-dead opaque IDs through birthOrdinal.

Reports use exact source subsets/units: savings means size.6 only; savingsNode means size.8 only; equipped patches have water2/electricity3; noWaterPercent counts patches with actual migrants and water10; noPowerPercent counts cached occupied other than no/maquiladora and electricity1. Both percentage denominators are equippedPatchCount*current initDensity; no clamp to100. Undefined empty means/zero-denominator percentages carry explicit unavailable reasons rather than throwing the whole read or fabricating0. No read invokes update-display, refreshes source caches, shuffles, draws, advances or writes.

Pen traces preserve the source presentation sequence separately from scientific ownership: each completed movement segment while penDown records `{ordinal,birthOrdinal,from:{x,y},to:{x,y},colorNumber,width}` using source patch units and current source pen state at that movement. No persistent opaque dead-Agent owner ID is stored. These immutable past positions are observations, not competing live positions. Keep ordered traces until CLEAR/scenario replacement; do not silently truncate a road or add extra domain motion from UI. If a bounded visual representation is later proposed, its dropping/aggregation policy needs an explicit documented decision. NODE placement has no invented road segment. For a diagnostic third builder initially penDownfalse, grow-city's fd.75 happens **before** source pen-down and therefore makes no first segment. Target default color adaptation can change first-stroke presentation and must be declared in its report.

## Source semantics that implementation must preserve

1. Topography uses sampled interior nuclei, explicit normal radii, source predicate snapshots and Moore diffusion. Validate the raw `n-of` count against0 and candidate size **before** truncating a nonnegative fraction. The coordinator verified list and AgentSet failures for1.9 requested from1 and.9 requested from0; neither becomes a successful truncated request. Negative counts and shortages fail at that operation. Public sample saturation is not native parity. Positive create/sprout counts have ceiling behavior and nonpositive counts create none. Source-rounded builder counts retain the stated rounding before creation.
2. Native round halves go toward positive infinity; preserve observed precision results and binary effects (-1.005->-1, .005->.01, 1.005->1, 2.675->2.68 at2 digits). Do not replace with unproved toFixed semantics. Signed random bounds use the observed ceil/floor integer domain and zero's no-draw branch. Normal tails are not resampled, clamped or made positive.
3. Negative **patch-set** radius queries use canonical self+Moore candidates filtered by ordinary squared distance<=radius squared, as established by the pinned engine binding; they do not become an unrestricted abs-radius disk. Positive radii use the appropriate actual patch/Agent candidates and public distance. General negative turtle-set radius behavior is not established by this probe and must not be guessed if a source call actually needs it.
4. Native jump outside the half-open world is a no-op. fd attempts unit segments plus its remainder; retain earlier successful segments. Compose public pure preflight and canonical moves, not core endpoint clipping or fabricated exceptions. Public Agent.rotate({towards:target}) already preserves heading on coincidence, matching the native probe; reuse that actual operation rather than inventing an angle or duplicate orientation adapter.
5. Native industrial utility strings remain strings and fail numeric get-costs if reached. Check the transport multiplication before assigning livingExpenses. Empty max/mean, empty selection/distance and modulo0 fail at their actual phase after earlier mutations. Do not let JS string concatenation, undefined, Infinity or `%0` NaN silently replace the source boundary.
6. Economics uses unrounded current max expenses inside sequential migrant activation, then draws/rounds income and expenses; affordability subtracts integer1 repeatedly, including potentially negative values. maxCost remains the earlier cache. Last-seed expansion/economics/reset is one setup call. Final setup only precision-rounds land: a universal nonnegative final landscape is not source-proven because surviving builders can write after earlier adjustment. Script2 distinguishes an untouched negative field from script5's explicit adjust diffusion/clamp branch. GO does not generally recompute every migrant's expenses. Growth recomputes destination migrant costs **before** replacing its infrastructure.
7. Display colonias changes scientific zeros to9.9 before ordered color predicates; no-water/power modes preserve unmatched colors. Rule editing does not update display. Explicit updateDisplay is target RNG-neutral, an admitted schedule difference from native color/patch asks. ADD NODE has its unconditional center mutation and nearest-node gradient, no fabricated population cap, graph or population-sized migration.
8. Preserve asymmetric regularization bounds and `(abs(land)-values)<.25`; cityGrowthfalse does not disable regularize. A new same-tick third builder is not rerun through earlier growth. Cached occupancy is not automatically repaired on every move/cross. Native inspectors select random examples; the later UI may use a deterministic inspector with a declared interaction adaptation, not scientific state writes.

## Five asserted proposals and fixed acceptance budget

| Script | Required work and assertions |
| --- | --- |
|01-natural-cityscape-and-replay.ts|Run all fixed target seeds1..5 with source widget defaults, each capped at3000 actual CITYSCAPE calls. Assert cleared/guard/input purity, first-call infrastructure/builders, observed jobs/.65 expansion/economics, at least one natural completed city, reset/affordability/finite rounded land (not an invented final nonnegative clamp), ready guard, actual first GO and same-identity no-draw CLEAR. Replay seed1 one-call chunks versus batches25, comparing every retained scientific/RNG/history/trace value after opaque identity normalization. Only declared native-boundary errors are admissible seed outcomes; unexpected errors fail.|
|02-final-seed-economics-and-reset.ts|Explicit native-matched one-seed diagnostic at tick25: blocked extra lots, exact distances10/5, unrounded maxCost42.53333333333333, rounded expenses42.53 minus integer affordability reductions, income/expense precision, radius3 colony subtraction, occupancy, same-call reset/readiness/history segment; an additional source-derived remote negative field remains negative after final precision.|
|03-migration-crossing-and-partial-errors.ts|One eligible adjacent destination; child inherits old parent data while parent resets/costs change, both earn/spend, distinct colony radii/cache timing. Final migrant crosses; next GO fails empty max after tick2. Invalid hard endpoint/missing work-key scenario validation preserves the partial snapshot atomically.|
|04-domain-display-and-node-intervention.ts|Explicit display mutation/color ordering and unmatched color memory, RNG/tick/read purity, nearest-node land gradient and excluded industrial/high-land neighbors, canonical Field IDs, invalid placement atomicity, and downstream colony difference from calling the scientific display action.|
|05-growth-reports-and-delayed-errors.ts|Asymmetric regularization site/predicate, random birth heading retained on coincident face, canonical field origin, a separate explicit adjust diffusion/clamp/industrial-fallback case, .5-period growth plus same-tick hatch, costs before utilities, source cache timing, exact monitor denominators/subsets, empty local ring mean after earlier cleanup, and string-utility failure after committed hatch.|

The five-seed/3000-call envelope is fixed **before runtime**. It is a target smoke acceptance condition, not a source termination theorem or statistically representative ensemble. A failed/stalled seed stays visible; do not silently retry with altered parameters/seed, fabricate readiness, or adjust this envelope after observing an inconvenient implementation. At least one complete natural lifecycle is mandatory, and the first-seed chunk replay must reproduce its actual success/error/stall result. The diagnostic four scripts cannot substitute for natural generation. If a correct implementation demonstrates a genuine conflict with this proposed envelope before freeze, bring that evidence to the coordinator; do not change it in runtime code.

No fake normal draw injection is authorized. Forcing a modulo-zero divisor requires an actual reproducible public Random continuation and the real preceding draw schedule (including first-phase-limit), so it is a later focused boundary test, not a private override in these scripts. Likewise preserve native sample shortage, negative tail, hard motion, creation/snapshot, repeated adjustment and reporter boundaries with focused behavior tests after implementation. These supplements do not reduce the five substantive tasks. Final target UI, actual paired Chromium evidence/screenshots, required independent Argon approval, build/consumer checks and all remaining selected models are separate acceptance work.

## Executed preparation checks

Executed by this contract task: full XML parsed; exact original SHA matched; nine sliders/six buttons counted; five asserted public scripts and the absent target module checked. Bun.Transpiler parsed/transpiled all six proposal/helper files without import resolution. `bun run typecheck` passed the existing four configured projects; these unregistered future-model proposals are **not** included, so no future-model type acceptance is claimed. Executing script01 failed as expected at the missing target model import, without a mock/stub. Proposed six-file SHA256SUMS and explicit new-file whitespace checks passed. No target runtime/tests/build/consumer/new browser/literature/independent review was executed by this task. SHA256SUMS remains a **proposed** manifest until the coordinator's freeze commit; it covers all five scripts and the author-only scenario helper.


## Coordinator freeze decision

Accepted before runtime on6November2026. The five fixed seeds1..5 and3000-call budget remain unchanged. Input/scenario/error/read semantics, source-default headings, native raw fractional shortage validation and canonical reference/trace ownership are explicit. The universal final nonnegative-land assumption was corrected before freeze because source completion only rounds; the separate genuine adjust clamp and untouched negative final-rounding assertions now distinguish the actual phases. No implementation exists or was used to choose these expectations. Expected missing-import failure remains honest; no public example has been accepted as executed yet.

Root verified all six final hashes and syntax after editorially changing proposal comments to frozen comments. All five substantive numbered scripts and their shared author-only helper are immutable acceptance contracts from this commit. Required independent Argon review remains quota-blocked; this is coordinator contract acceptance, not independent approval. Runtime implementation ownership is delegated only after the freeze commit. No source/target trajectory or empirical scientific equivalence is promised.


## Editorial type narrowing after example registration

When root registered the previously unregistered scripts in the regular dev TypeScript project, the compiler correctly required narrowing BuilderOriginRead's admitted0 variant before reading kind/id, and did not infer a third-builder subtype through a combined kind-and-id filter. The script now explicitly rejects0 at the already required Field-origin assertion and separates the pure kind/id filters. This preserves the exact expected source state and every scientific assertion; no model API, accepted value, budget or behavioral expectation changed. It is an editorial type correction, not weakening a frozen example or falsifying the public union. The updated hash records that correction. The initial registered typecheck/full check failed before this fix; earlier four-project passes did not include the unregistered future-model scripts.
