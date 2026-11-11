# City simulation models

These fifteen original teaching models each ask one question about a city and answer it with a small, visible mechanism. They run headlessly through City Library's public APIs and have declarative Model Lab bindings. Inputs are synthetic: the models are meant to produce insight under stated rules, not calibrated forecasts. The models are independent; there is no coupled city engine or shared city state.

## Current revision status

This section is the single place for the current status of all fifteen models. Model READMEs, contracts and evidence files link here instead of stating their own acceptance.

| Item | Status |
| --- | --- |
| Revision | Revision 2 of all fifteen models, 2026-11-10, implemented by Claude Opus 5.5 after the user authorized a research-led rework. |
| Research basis | [Research brief](city-model-research.md) written before the rework; the [mechanism table](#explore-a-model) states what was implemented. |
| Review that triggered it | [Opus 5.5 review](../../ui/model-lab/acceptance/city-models/opus-5-5-review.md) (findings M1–M3, L1–L7); author responses in [revision-2 responses](../../ui/model-lab/acceptance/city-models/revision-2-author-responses.md). |
| Contracts | Four revised public scripts per model under `tests/public-contracts/city-*/`, written before each runtime change. Revision-1 scripts and contracts are archived byte-for-byte under `models/<slug>/evidence/revision-1-contracts/`. |
| Freeze evidence | Self-reported: there are no freeze commits. Pre-runtime and current SHA-256 hashes are in each model's `evidence/checks.md`; they show file integrity, not an independently verified order of work. Revision 1 recorded no pre-implementation hashes for Air and Noise; none were reconstructed. The revision-1 Materials getter-annotation exception is preserved in its archive. |
| Shell checks | See [verification](#verification-revision-2). |
| Browser evidence | [Browser acceptance record](../../ui/model-lab/acceptance/city-models/README.md): 276-image revision, followed by [60 targeted correction images](../../ui/model-lab/acceptance/city-models/revision-2-final-rest-fixes.md) and [eight final Water images](../../ui/model-lab/acceptance/city-models/revision-2-water-outlet-fix.md). Each image set has a manifest; earlier captures remain historical. |
| Independent acceptance | **Approved for the bounded teaching-model scope.** The [Gemini mechanism review](../../ui/model-lab/acceptance/city-models/revision-2-gemini-mechanism-review.md) and [Water contract recheck](../../ui/model-lab/acceptance/city-models/revision-2-water-independent-recheck.md) approve the domain mechanisms and source transfer. The [targeted Opus review](../../ui/model-lab/acceptance/city-models/revision-2-targeted-final-opus-review.md) approves fourteen visualizations; the [final Water visual approval](../../ui/model-lab/acceptance/city-models/revision-2-water-final-visual-approval.md) closes the fifteenth. Earlier findings, author responses and review limits remain recorded. Low-severity renderer, annotation, locale and capture limits remain; this is not calibration, coupled-city or full accessibility acceptance. |

## Explore a model

Run `bun run dev` and choose a model; Model Lab sets it up automatically. Use **Run**/**Pause** to advance it and **Reload** to set it up again with changed setup values. To compare exact time points, call `advance(stepCount)` headlessly and read the observation, as in [model acceptance](model-acceptance.md). Each README explains the question, mechanism, what to try and limits; each `contract.md` records exact rules and expected values.

| Model | Question | Mechanism | Reference (inspiration only) |
| --- | --- | --- | --- |
| [Population and Households](../../models/city-population/README.md) | How does a migration pulse shape later births, deaths and household demand? | Age cohorts, two mortality bands, integer deaths by carried remainder and largest-remainder allocation, immigration pulse | Leslie 1945 |
| [Housing Market](../../models/city-housing/README.md) | Allowance or new homes: who gets housed, who is displaced? | Income-ranked bids, vacancy-driven posted rent, displacement, three-month construction pipeline | Rosenthal 2014 |
| [Land Use Change](../../models/city-land-use/README.md) | Compact or dispersed growth; corridor or scattered protection? | Demand targets, face-neighbor location score, equal-area protection plans, green-patch and urban-edge measures | Batty and Xie 1994 |
| [Daily Activities](../../models/city-daily-activities/README.md) | Which errands still fit into a day? | 15-minute plans, distance-based travel time, opening hours, missed errands | Hägerstrand 1970 |
| [Urban Mobility](../../models/city-mobility/README.md) | Wider road or better walking route? | Queue-aware mode and route choice over FIFO capacity links during a morning peak | Braess et al. 2005 (no paradox claimed) |
| [Urban Employment](../../models/city-economy/README.md) | How deep does a demand shock cut, and how slowly does it recover? | Local spending feedback, instant dismissal, limited hiring, lost orders | Gualdi et al. 2015 |
| [Neighborhood Services](../../models/city-services/README.md) | One central facility or two distributed ones? | Nearest-first allocation with trip limit and finite capacity; full versus too far | Luo and Wang 2003 |
| [Urban Energy Supply](../../models/city-energy/README.md) | More solar, more storage or shifted demand? | Solar day, evening peak, battery power/energy limits, import limit, flexible demand | Denholm and Margolis 2016 |
| [Water and Wastewater](../../models/city-water/README.md) | Save early and little, or ration late and hard? | Reservoir through a dry spell with a storage-triggered savings rule; separate treatment limit | Draper and Lund 2004 |
| [Urban Stormwater](../../models/city-stormwater/README.md) | Infiltration or retention, for one storm and for two? | Storm pulses, soil store with declining infiltration, throttled basin and overflow | US EPA SWMM manuals |
| [Urban Heat](../../models/city-heat/README.md) | When do shade and watering help, by day and at night? | Per-block energy budget with heat capacity, day/night drivers, evapotranspiration water use | Oke 1982 |
| [Air and Noise Exposure](../../models/city-air-noise/README.md) | Less traffic, more ventilation or more distance? | Wind-driven box corridor and energetic sound addition with receptor distance | Berkowicz 2000; CNOSSOS-EU 2012 |
| [Urban Habitat Connectivity](../../models/city-biodiversity/README.md) | Stepping stone or larger patch? How much does permeability matter? | Expected occupancy with distance-kernel colonization and area-dependent extinction | Hanski 1998 |
| [Urban Material Cycles](../../models/city-materials/README.md) | Does recycling clear a festival backlog? | Waste pulse, finite collection, reuse/recycling/disposal, uncollected stock | Kennedy et al. 2007 |
| [Municipal Finance](../../models/city-finance/README.md) | Does repair order matter? What does deferral cost? | Twelve wearing assets, late repairs at double cost, worst-first versus preventive priority | Madanat and Ben-Akiva 1994 |

## Public examples and reuse

Every live action in these fifteen models follows one rule, implemented once by `updateParameters` in `models/parameters.ts`: omitted record keys keep their values, an explicitly supplied `undefined` throws `TypeError` (scalar actions included), and the complete candidate is validated before any assignment. Setup validation through `parseParameters` is unchanged for all other models.

Models reuse public World/run, Grid, Resource, measurements, twoPhase, continuous and history capabilities. Mobility still uses Graph for its free-flow route check; Biodiversity no longer uses Graph because its all-pairs distance kernel needs no edges. All scenes use the existing spatial view (cells, rectangles, segments, labels) and the central palette; no new library API, view type or dependency was introduced. A separate [shared-host correction](../../ui/model-lab/acceptance/city-models/revision-2-host-enter.md) keeps Enter in a live field from reloading the model; it changes no model rule. Interval-flow charts start at the first completed step, while stock charts include the setup sample.

## Verification (revision 2)

Shell checks run by the implementing agent on 2026-11-10 after the mechanism rework:

| Command | Result |
| --- | --- |
| `bun run typecheck` | 1852 files, 0 errors, 0 warnings |
| 60 city scripts run one by one (`bun tests/public-contracts/city-*/0*.ts`) | 60 passed |
| `bun test models/city-* tests/public-contracts/city-* models/parameters.test.ts` | 73 passed, 0 failed, 89 370 expectations |
| `bun run check` | passed: typecheck, 848 tests (797 384 expectations), migration check, 352 public scripts, library build, packed Bun/Node/TypeScript consumer |
| `bun run build:ui` | passed; Vite reports its existing large-chunk warning |

The coordinator repeated `bun run check` after the shared-host Enter correction: 848 tests (797384 expectations), 352 public scripts, migration, library build and packed consumers passed; TypeScript/Svelte reported zero errors and warnings. The post-correction `bun run build:ui` passed with the existing large-chunk warning. Logs are `/tmp/city-revision2-integration-check.log` and `/tmp/city-revision2-integration-ui-build.log`. These are executed integration checks, separate from independent model and screenshot review.

Each revised mechanism was also derived independently in a scratch calculator before its runtime was written; exact contract values come from those derivations. Two values (Heat, Air and Noise) were mistranscribed from rounded calculator output and corrected before acceptance, as recorded in the model evidence.

The coordinator repeated the full check after the final shared-selection and label corrections: 848 tests (797384 expectations), 352 public scripts, migration, library build and packed consumer passed (`/tmp/city-final-rest-fixes-check.log`); the UI build passed (`/tmp/city-final-rest-fixes-build-ui.log`). The subsequent Water-only segment/label adjustment passed typecheck and UI build (`/tmp/city-water-final-label-{typecheck,build-ui}.log`) and its eight images were independently approved.

Browser evidence and its successive correction sets are described separately in the [browser acceptance record](../../ui/model-lab/acceptance/city-models/README.md#revision-2-browser-evidence). Shell checks do not establish visual acceptance.

## Revision 1 (historical)

The earlier implementation passed `bun run check` with 835 tests and 352 public scripts and `bun run build:ui` on 2026-11-10, and the Antigravity `gemini-3.8-flash` [final review](../../ui/model-lab/acceptance/city-models/final-independent-review.md) approved it. Those results describe revision 1 and remain as historical baseline; they are not acceptance of revision 2. Per-model `evidence/checks.md` files keep the original implementation reports above their revision-2 sections.
