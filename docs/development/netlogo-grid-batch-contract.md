# Fire, Life and Percolation composition contracts

Prepared 2026-11-05 for the next bounded catalog batch. **Pre-runtime proposal and source audit only:** no model implementation, target behavior, browser acceptance or independent approval is claimed here. The coordinator must review and freeze these five asserted public model scripts before delegating runtime. No new core API is proposed.

## Canonical sources and provenance

Each exact basename has one match in the pinned 550-row served catalog. Variants such as Fire Simple, Life Turtle-Based and Percolation 3D are separate rows and are not covered by this batch.

| Experiment | Exact served row | Archived SHA-256 |
| --- | --- | --- |
| fire | Sample Models/Earth Science/Fire | 0a2420e463481fb2cd7791aacdc068735db0d900c14d3fece0a93a085246b171 |
| life | Sample Models/Computer Science/Cellular Automata/Life | fa55f68a3f00b9aba56b384954db875e6d3b55ea318384eecae0561c36892802 |
| percolation | Sample Models/Earth Science/Percolation | 61523cdd4661611bdfb14fdb812c1c6601c9befb27a2ab0a1802766724062e3a |

All three immutable originals were downloaded from Galapagos revision `90be931773fcf499049247a8aaa1aecbe003654c`, using each inventory row's `galapagos.url`, and matched against its captured SHA-256 before archiving unchanged as `experiments/<slug>/source.nlogox`. They identify NetLogo 7.0.4. Source notices remain complete. Fire: Copyright 1997 Uri Wilensky. Life and Percolation: Copyright 1998 Uri Wilensky. All three adapted model rule sets carry CC BY-NC-SA 3.0 and original citations; see each NOTICE.md. This is not a license grant for the independent library or UI.

## Common public model surface and ownership

Each `experiments/<slug>/model.ts` exports `create`, `inputs` and `model`, following the existing `Definition` and canonical `parameters` descriptors. Instances provide `advance(count = 1)` and detached, frozen `read()`. Validate the entire count through the existing `stepCount` helper before acting. `run` owns successful ticks; a preflight stop adds no tick or RNG draw. Observations never consume RNG. Initial-plus-latest-1000 completed-step histories use the existing bounded model convention, without claiming generic History delivery.

Common setup options: `seed = 1` using existing seed bounds; integer `width`/`height` with the source defaults below. Width/height bounds are 3..301, except Percolation width is 3..300 and its height is odd 3..301 (step 2). These extra size controls are declared target adaptations. Grid owns topology, fields and their state; optional stationary Fire Agents own their own phase/fade state if that representation is used. Do not create a second writable occupancy/field copy. Use public `Grid`, `Random`, `World`, `run` and, if needed for Fire, `Agent`. No private deep imports or model-local topology/RNG library.

Every read includes `tick`, `width`, `height`, `parameters`, `cells`, `history`, `randomState` and `done`. `cells` use stable Grid field IDs and canonical centered `x`/`y`; order is Grid.fields order (x fastest, from lowest y). Extra source `column` and `row` indices, where supplied, start at 0. Return frozen cell records and arrays. Coordinate mapping belongs to the model's explicit source-origin adaptation; grid lookup/wrapping belongs to public Grid.

The factory validates all options before constructing simulation state. Fixture setters materialize and validate the complete array before mutation, reject wrong types/lengths/sparse entries/accessors as appropriate, and preserve RNG continuation. A failed setter leaves scientific state, tick, history and RNG unchanged. All setters below are public headless actions, never UI assignment to returned snapshots.

## Fire

Source widgets: 251×251 hard-boundary view (`pxcor/pycor -125..125`); setup and forever go; setup-only density 0..99 integer percent, default 57; monitor `(burned-trees / initial-trees) * 100`. There are no source plots. Add explicit target single-step/batch controls through the shared host.

Setup makes independent trees with `random-float(100) < density`, then ignites **every** patch in the left column, even if it had no tree. `ignite` sets the patch black, creates one red fire and increments burned count, but setup subsequently resets `burned-trees` to 0. `initial-trees` is the number of remaining green patches **after left-column ignition**, so the left column is excluded from both initial trees and cumulative burned trees. Source has no wrapping.

Go first stops only when there are neither fires nor embers. Freeze the old fires at phase start. Each old fire ignites current green face-neighbors (north/east/south/west), then becomes an ember. Newly created fires are not activated until the following go. Every ember, including old fires just converted in this go, loses 0.3 NetLogo color units. Starting from red=15, it dies once color <11.5, which is after 12 fade phases; its underlying patch retains the final color. Newly ignited fires do **not** fade in their birth go. Finally tick. A step that removes the last ember still increments tick; the next call preflight-stops. Do not end the model when propagation ceases but embers remain.

`FireParameters` adds `density`; defaults width/height 251. A fixture action `setForest(trees: readonly boolean[])` supplies one tree flag per field, reinitializes that terrain, applies the source's unconditional left-column ignition, resets tick and counters/history to a fresh setup, and preserves the current RNG continuation. This is an explicit deterministic setup intervention, not source UI behavior. It leaves density and other settings unchanged.

Read additionally exposes `initialTrees`, `burnedTrees`, `percentBurned`, and `counts: {trees, fires, embers}`. Cells expose `status: "empty" | "tree" | "fire" | "ember" | "burned"` and numeric `emberColor` where relevant to presentation. Freeze source phase membership; do not allow chains to cross several tree columns in one tick. Optional field-stage representation may replace stationary turtle identities only if phase/fade/reporters and terminal timing remain identical and that representation change is documented.

Adaptations: Mulberry RNG; omit order-independent ask shuffles and display-only turtle heading draws; percentBurned=0 when initialTrees=0 rather than source division failure. A new run is reproducible per target seed, not an identical NetLogo seeded trajectory. Preserve fade lifetime; color appearance may use shared UI palette instead of exact NetLogo color interpolation.

## Life

Source widgets: 101×101 torus (`pxcor/pycor -50..50`); setup-blank, setup-random, draw-cells forever toggle, go-once/go-forever, recolor; initial-density 0..100 percent in steps of 0.1, default 35; foreground NetLogo color 123, background 79; density monitor is the **fraction** living/count, not a percentage. Colors are view-only: they do not affect the rules.

The factory adds `initialDensity` and `initialization: "random" | "blank"`, default random. Blank creates all-dead cells; random independently uses `random-float(100) < initialDensity`. Go first captures every old Moore-neighbor living count, then updates all cells simultaneously. Exactly 3 neighbors means living; exactly 2 retains its old state; any other count means dead. Own cell excluded. Tick always increments, including an empty board, still life or oscillator. There is **no source terminal rule**. `done` is therefore always false; the host may pause execution without inventing scientific completion.

`setCells(living: readonly boolean[])` atomically replaces one flag per cell at the current tick and replaces the latest same-tick history sample. `setCell(position: {x:number;y:number}, living: boolean)` is a public single-cell drawing action requiring an exact in-bounds field center; it preserves tick/RNG and updates the same-tick sample. Read exposes `counts: {living, dead}`, `density` as living/(width*height), and each cell's `living` flag. Initializer/density are setup-only. Fixed-point detection must not suppress successful Life ticks.

Adaptations: Mulberry and omission of order-independent setup/ask shuffles. Source drawing's gesture latch (one press chooses paint or erase from the first cell, retaining that mode until release) and foreground/background/recolor controls require explicit shared UI intents. **The existing selection-only canvas is not proof those widgets are delivered.** This batch establishes the headless actions; source-equivalent brush/presentation controls remain a named host/UI contract and browser acceptance item, not silently omitted parity. A thin UI may offer selected-cell birth/death as an explicitly declared interim interaction, but this cannot be described as equivalent drag drawing.

## Percolation

Source widgets: 150×221 view with source coordinates x=0..149/y=0..220, x hard and y wrapped; setup/forever go; live porosity 0..99 in steps of 0.5, default 60.5; historical plots `total-oil` and red count in current-row. The rectangular default must not be shrunk. Centered Grid coordinates are translated explicitly to source column/row indices for checkerboard parity and readout. Odd target heights preserve the source's even-numbered top row and checkerboard phase across top/bottom replacement.

Setup makes brown soil where `(column + row) mod 2 = 1`, gray rock elsewhere. The current row is the top row. Mark odd-column top patches red (oil front), totalOil=0, tick=0. Source is not a static pre-sampled porous mask: it retries probabilistic entry as the spill arrives.

Go preflight-stops if the current row has no red cells. Freeze that row's red membership, shuffle it, and visit each sequentially. For each red cell, visit its existing southwest/southeast neighbors in randomized order. When a target is still brown soil, draw `random-float(100) < porosity`; success changes it to red immediately. If two parents share the same target, a failed first attempt leaves brown soil and permits a second parent's new draw; success prevents later draws for that cell. **Do not stage a single independent trial per destination or precompute a fixed permeability field.** Then mark the parent black and increment totalOil once. Advance current-row down by one.

After percolation, if current-row has reached the bottom row, copy the entire bottom row's current colors one row down through y-wrap to the top row; reset every row below the top to its original checkerboard; move current-row down again through wrap to top. Thus bottom-front oil is moved to top **before** it is ever activated at bottom; camera depth continues even though displayed row resets. Preserve cumulative totalOil. Finally tick. No x wrapping or diagonal skip over hard edges. Source one-of used to inspect the current-row y-coordinate and order-independent resets may be omitted as irrelevant RNG draws, explicitly documented.

`setRules({porosity})` validates against the canonical live descriptor, preserves tick/RNG and does not create oil or resurrect an empty front. `setFront(columns: readonly number[])` is a deterministic setup fixture: require unique, in-range odd integer columns, reset soil/rocks, top front, totalOil, tick and history, preserving settings/RNG. It allows an empty initial front. Read exposes `currentRow` in source 0-based indices, `totalOil`, `counts: {front}`, and cells with `column`, `row`, `kind: "soil" | "rock" | "oil" | "saturated"` plus canonical x/y. `done` means the current row has no oil; final successful extinction go still contributes one tick. History records totalOil and front count after completed steps/wrap.

## Five pre-runtime public scripts

1. `01-life-synchronous-blinker.ts`: three-cell blinker rotates synchronously and returns in two ticks, with observation/RNG purity; empty Life still ticks.
2. `02-fire-front-and-embers.ts`: a two-tree corridor advances one column per tick, excludes setup ignitions from counters, and stops at tick 14 only after the final ember expires.
3. `03-percolation-stop-and-wrap.ts`: porosity zero dies after one completed step; a tiny fixed-seed 99% case reaches wrap with cumulative totalOil=3 and moves bottom front to top.
4. `04-atomic-inputs-and-drawing.ts`: all three reject invalid full fixtures atomically; Life drawing is a public same-tick action; invalid live porosity leaves state unchanged.
5. `05-defaults-and-isolation.ts`: exact source dimensions/defaults/topology-dependent setup counts, repeatability without IDs, independent model instances and detached observations.

The tiny Percolation wrap fixture uses seed 42: an executed probe of public Mulberry Random confirmed its first 50 draws are all below 0.99 (maximum 0.8820588334929198). Source setup has no scientifically effective randomness; target fixture preserves seed continuation. The two tiny steps need fewer than 50 draws under the specified phase shuffles. This establishes a deterministic target example without promising NetLogo trajectory identity.

Executed preparation evidence: exact immutable downloads and SHA-256 checks for all three sources; read Procedures/Widgets/Info and license sections. Public Random seed probe above executed. The first public example is expected to fail with a missing model module before implementation. Source archives do not establish browser behavior or runtime acceptance. No extension/include/asset dependency appears in these three archived models; Life's drawing/recolor host behavior remains explicit UI work.
