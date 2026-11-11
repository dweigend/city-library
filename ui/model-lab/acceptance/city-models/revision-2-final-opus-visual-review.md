# Independent final visual review – Revision 2 visual fixes (15 city models)

Reviewer: a fresh Claude Opus 5.5 instance acting as a review subagent. It is not the implementer. Date: 2026-11-10.
Worktree: `/home/david/.t3/worktrees/city-library/t3-ad043594-efa84c79fbccafc6`, branch `t3/city-simulation-models` (uncommitted shared files).

**Read-only review.** No repository files were changed and nothing was committed. No subagents or delegations were used. This is the only report, and it is saved in `/tmp`. Discussion is in German, as `AGENTS.md` requires; the report language follows the brief.

Prior reports (`revision-2-opus-visual-review.md`, `revision-2-gemini-mechanism-review.md`, revision-1 approvals, `opus-5-5-review.md`) remain **historical**. They are not approval of this state, and this report does not replace them. Author responses (`revision-2-visual-fixes.md`) were treated as claims and checked against pixels and the live app.

---

## 1. What I read

- `AGENTS.md` (worktree), the previous independent visual review `ui/agent-lab/acceptance/city-models/revision-2-opus-visual-review.md`, and the author responses `revision-2-visual-fixes.md`, including the "Open limits" section.
- The manifest `revision-2-visual-fixes-manifest.json`. A script checked it: 87 runs, 276 file entries, all unique, exactly matching the 276 PNGs in the folder. There are no extra or missing files.
- Skills read as actual files:
  - `/home/david/.codex/skills/frontend-design/SKILL.md`
  - `/home/david/.codex/skills/frontend-design-shadcn-svelte/SKILL.md`
  - `/home/david/.codex/skills/shadcn-svelte/SKILL.md` (first 60 lines, the rules section)
  - `/home/david/.codex/skills/web-design-guidelines/SKILL.md`
  - The Vercel guideline source was fetched read-only (`raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`, 191 lines) into my scratchpad.
  - Applied criteria: legible labels at every viewport, no overflow, state not by color alone, sensible number formats, and theme parity. This is **not** a full Vercel or accessibility audit.
- Targeted source checks:
  - `ui/agent-lab/app.css:26`: `--view-selected: #fbbf24`.
  - `ui/palette/scientific.ts:4`: `waiting: "#fbbf24"`.
  - Users of `scientificPalette.waiting`: `models/city-finance/ui.ts:6` (repair bar), `models/city-economy/ui.ts:5` (vacancy outline), `models/city-housing/ui.ts:87` (under-construction outline), Mobility queue, Water trigger, Services "full", and the Air vehicle.
- Not read again in full: `docs/development/city-model-research.md`, `docs/DESIGN.md` and `docs/ARCHITECTURE.md`. Their mechanism and scientific basis were approved in the separate Gemini review. I read the models' scene titles, legends and scene descriptions in the browser. **The changed water saving-day measure (L-WAT1) needs its own targeted mechanism re-check, which this visual review does not replace.**

## 2. Logs (read, not rerun)

From `/tmp/claude-1000/-home-david--t3-worktrees-city-library-t3-ad043594-efa84c79fbccafc6/9d3262ec-9bb1-400b-a5ac-dca8cd7079d2/scratchpad/`:

- `visual-fixes-check.log` (457 lines, mtime 2026-11-10 19:12:08 UTC):
  - typecheck "1852 FILES 0 ERRORS 0 WARNINGS"
  - " 0 fail"
  - packed consumer "Bun, Node ESM and ambient-free TypeScript passed"
  - last line `check exit 0`
  - The word "failed"/"failure" appears only in test names or expected-error output (lines 21, 102, 154, 244), not as a failure.
- `visual-fixes-build-ui.log` (187 lines, 19:12:10): `✓ built in 1.64s`, `build:ui exit 0`, and only the existing chunk-size advisory (>500 kB).
- I did **not** rerun `bun run check` or `build:ui`; the brief said not to rerun the full suite needlessly. The logs predate my browser session. The dev server served the current worktree, and the browser results match the screenshots.

## 3. Image inspection (all 276 as pixels)

Method: no OCR and no downscaled contact sheets for judgment. I used ImageMagick `montage` with **`-geometry +3+3` (no scaling, 1:1 pixels)** to tile images by size class into 85 pages, each at most about 1.2 MP and labelled with the file name. Every page was opened with the image viewer.

- 1022-px element images: 2 per page.
- 503-px element images: 2×3 per page.
- 366-px narrow elements: 3×2 per page.
- 390×844 narrow viewports: 3 per page.

All 32 desktop viewports at 1366×768 were opened individually at native size.

Crops at 3–4× nearest-neighbour zoom were made where in doubt:

- Mobility narrow intervention and overflow
- Energy charging desktop and default narrow
- Water intervention narrow
- Stormwater intervention narrow
- Materials intervention narrow
- Population sidebar against the chart, plus the before-image for comparison

Coverage was checked by script. The 85 pages contain the 244 non-viewport images; together with the 32 viewports that makes 276 of 276. Inventory per model, as files in the folder:

| Model | Files |
| --- | --- |
| Population | 17 |
| Housing | 19 |
| Land Use | 21 |
| Daily Activities | 23 |
| Mobility | 22 |
| Economy | 16 |
| Services | 14 |
| Energy | 20 |
| Water | 13 |
| Stormwater | 22 (incl. infiltration/retention) |
| Heat | 18 (incl. night) |
| Air/Noise | 18 |
| Biodiversity | 19 |
| Materials | 17 |
| Finance | 17 |

## 4. Own live browser check (real browser, own tab)

- `preview_status` beforehand showed no tab. I opened **my own background tab** (`reuseExistingTab=false`, `open=false`) on `localhost:3101`, used it only for this review, and **closed it at the end with `t3_preview_close`**.
- Actions were real `preview_act` clicks on Setup, "10 steps", "1 step", "Parameters" and the canvas, real typing with `clear` plus Tab, and the Home key.
- **Limitation:** to save time I advanced 9 single hours in Energy and 70 quarter-hours in Daily with a DOM `button.click()` loop inside `preview_evaluate`. These were the same buttons but not pointer events. All parameter entries and Setup used real clicks or keys.

| Flow | Viewport / theme | Result |
| --- | --- | --- |
| Energy charging, day 2 09:00–10:00 | 390×844 light | Table: solar+wind 11.5 = demand 6.0 + battery in 4.0 + curtailed 1.5; stored 6.3; check 0.0. Matches the author's desktop image. **New:** in narrow the flow label "4.0" sits on the "Battery" label and the vertical line runs through "Battery"; "6.0" sits on the yellow line. Narrow was **not** captured by the author for this state. |
| Energy discharge, day 2 18:00–19:00 | 390×844 dark | 12.0 = 2.0 + battery out 4.0 + 5.0 + unmet 1.0; stored 0.0; check 0.0. Matches `city-energy-default-narrow-dark`. "out 4.0" fills the box edge to edge. |
| Mobility queue overflow (walking path 30, typed and read back as `aria-invalid=false`), minute 12 | 390×844 light | Main road "15 queued", 12 squares plus "+3"; bypass 3; monitor 18 queued. Matches. Narrow label collision reproduced: "10 min · 10 driving" crossed by the line and car symbols; "12 min · 3 driving" and "3 queued" overlap each other and the blue line. `scrollWidth` 390, so no horizontal overflow. |
| Daily early close (close 17 typed after Setup, Tab) | 390×844 dark | Day 1 20:00: 0 done · 6 missed, red rings, red "Missed" bar. Matches. **Observation:** "Errands missed today 6" already shows at **02:30**, long before the errand times. This is a plan judgement ("does not fit"), not an event that has happened. |
| Finance worst-first, year 20, canvas focus + Home | 1366×768 light | Without selection all 12 assets are red and asset-3 has "+500" amber. **After Home** asset-1 (0.30, poor, "Late repair: Yes") **loses its red outline and gets the amber selection outline**. Confirms X-SEL. |

Not checked live: Household Energy Demand, Housing construction, Water/Stormwater interactions, screen reader, mobile user agent (only the CSS viewport was resized), the Run button and its animation.

---

## 5. Disposition of every earlier M/L finding

Legend: **Fixed** = verified in pixels (and live where noted). **Partial** = core fixed, residual remains. **Open** = not fixed.

| Finding | Status | Evidence / remark |
| --- | --- | --- |
| **M-FIN1** Finance: repair hidden under red outline | **Fixed (core)** | `city-finance-default-desktop-light-element-0`: asset-3 red outline **and** amber "+500". Intervention: "+450" and "+50" on two assets. Live reproduced. Residual: X-SEL (selection replaces red with the same amber). |
| **L-FIN2** Finance narrow labels touching | **Fixed** | `city-finance-*-narrow-*-element-0`: labels have spacing; title not at the edge. |
| **M-MOB1** Mobility: queue outside the scene, cars invisible | **Fixed (core)** | `city-mobility-intervention-desktop-dark-element-0`: 12 squares inside; `queue-overflow-*`: "+3"; pale outlined triangles visible on every route color. Residual: N-MOB2 (narrow labels) and an unlabelled queue-to-link mapping (low). |
| **M-ENE1** Energy: scene does not balance | **Fixed** | `city-energy-default-desktop-light-element-0/1`, `charging-*-element-0/1`, intervention `-element-0/1`: every flow is labelled, the battery flow and stock are separated, and the balance table check is 0.0. Live reproduced for both directions. |
| **M-ENE2** Energy narrow: labels burst boxes | **Partial** | Default and intervention narrow: names above, amounts inside, heat split into 3 boxes, no crossing of box edges, but "out 4.0" fills the box edge to edge. **Live narrow charging:** "4.0" collides with "Battery" (see N-ENE3). |
| **M-DAY1** Daily: result not visible | **Fixed** | All three runs at day 1 20:00. `early-close-*`: 0/6 with red rings, red bar and inspector "Missed: services close at 17:00". Live reproduced. Residual N-DAY3 (semantics of "missed" before the event). |
| **M-DAY2** Daily narrow: overlaps | **Fixed (essentially)** | `city-daily-activities-*-narrow-*-element-0`, `commute-narrow-light-element-0`: labels above or below the boxes; "Local shops" and "Services" are free; the clock is in the corner. Residual low: thin route lines run through "Middle"/"Near" in narrow, and the home dots melt into a cluster. |
| **M-EVD1** Unequal times | **Fixed** | Manifest `clock`, viewports and monitors: all pairs at the same time. Heat adds a night pair at 04:00; Stormwater adds infiltration and retention at hour 10; Land Use and Habitat use one-factor runs plus a labelled combination. |
| **M-ECO1** Economy: desired hides employed | **Fixed** | `city-economy-default-desktop-light-element-1`: orange shows only where it diverges, and the title explains this; gap bars in `-element-2` (3 and 1); intervention gap is 0. |
| **L-POP1** Population: migration on the axis | **Fixed** | `city-population-*-element-1`: bars from 0, migration 10 visible. Million: migration invisible at a scale of 40,000 (honest). |
| **L-HOU1** Housing axis label | **Fixed** | `default-desktop-light-element-1`, `bids-narrow-dark-element-1`: "Bid or rent"; the unit is in the title. |
| **L-HOU2** Housing construction/displacement, empty canvas | **Fixed (core)** | `construction-*-element-0`: 3 amber construction outlines, a diamond and "9 free sites". Residual: about a quarter of the canvas is still empty below the searching row (cosmetic), and X-SEL (selection uses the same amber outline as "under construction"). |
| **L-LAN1** Land Use amber on orange, edge series, two factors | **Fixed** | `change-year-narrow-light-element-0`: white diamonds visible; edge series violet; one-factor runs `corridor-*` plus labelled `combined-*`. Residual low: selection amber on orange is weakly contrasted, and the inspector label reads "areaHa". |
| **L-SER1** Services hub labels and bar colors | **Fixed** | Labels below the hub; bars in map colors; "Daily requests" side by side. Residual: grouped-bar offset (R4). |
| **L-WAT1** Water saving days and narrow labels | **Fixed in the view, mechanism needs re-check** | Monitors read "Off (cut 0)" and "Days with a demand cut 0", and the trigger line shows only when a cut is set. Residual R1 (narrow sewage label). |
| **L-LBL1** Setup labels | **Fixed for the named models; partial overall** | Energy, Water, Heat, Housing, Employment and Land Use have explicit units. Still auto-generated Title Case: Mobility "Initial Trips", Daily "Household Count", Population "Initial Population", Biodiversity "Initial Occupancy / Dispersal Rate / Extinction Rate". Low. |
| **L-STO1** Stormwater basin label, runoff crossing, counterfactuals | **Fixed** | Runoff lanes below the plots; basin label above; infiltration 8.32 and retention 0.00 in tables. Residual low in narrow intervention: "80%" touches the rain dashes and "Overflow 29.5" touches the right canvas edge. |
| **L-HEA1** Heat subtle colors, shade band | **Fixed** | "+10.4 K vs air" line; band with a light outline and width proportional to the shade share; night pair present. |
| **L-AIR1** Air narrow table, zero box | **Fixed** | `table-narrow-light-element-4` and `-table-right-4` are identical, all 4 headers fit, and the 0.0 box has an outline. |
| **L-BIO1** Habitat km legend, contour, two factors | **Fixed** | The title explains the map, values and outline; one-factor runs plus labelled combination. Residual low: bridge and stepping stone have a green outline although "green = West"; bar-chart labels are thinned, so the stepping-stone bar cannot be named. |
| **L-MAT1** Materials narrow overflow, saturation | **Partial** | The saturation marker "> scale 5,000,000 kg" plus triangle is good (`materials-large-desktop-light-element-0`). **But** in narrow, "120/120" and "160/160" still cross the left and right borders of the Collected box (`city-materials-{default-narrow-dark,intervention-narrow-light}-element-0`, 4× crop). The author's "wider box" claim does not hold at 390 px. |
| **L-GEN1** Sticky bar over figures, empty histogram | **Fixed** | No figure is covered; the histogram has data (`mobility-1000-trips-*-element-3`). Residual capture artifact: in population desktop elements, the sidebar input borders show at the left edge (see N-POP2). |
| **L-GEN2** Zero series on the axis, exponent formatting | **Partial (as stated by the author)** | "≈ 0 (< 1e-6)" verified. Line series at 0 still lie on the axis, for example Water "Saved/Shortage", Materials-large flows, and Mobility "Walk/cycle 0". This is a shared renderer decision and is accepted as a residual (R3). |

## 6. Assessment of the author's known residuals (with severity)

| # | Residual | Severity | Justification |
| --- | --- | --- | --- |
| R1 | Water: "Sewage 136" right edge; untreated line crosses the label | **Low** | `city-water-intervention-narrow-light-element-0` (4× crop): the orange line runs through "136", which stays legible. The untreated line leaves without a target toward the right edge, and "Untreated 16" sits apart from it (desktop too). It does not change the reading of the second-order effect. Recommendation: put the label at the line end and leave space for the line. |
| R2 | Energy: "4.0" near the battery | **Desktop low; narrow medium (→ N-ENE3)** | Desktop charging (`charging-desktop-light-element-0`, crop): "4.0" sits beside the line, and the vertical line runs through "Battery". **Live in narrow light** the "4.0" lies directly on "Battery", producing a "Bat4.0tery" collision, and "6.0" overlaps the yellow line. This is exactly the problem class of M-ENE2, in an uncaptured state. |
| R3 | Plots: minimum or zero series hidden on the axis | **Low** | Shared renderer property. It is honest, but series at 0 cannot be seen. In this set it only hides 0 values; no positive value is hidden. Recommendation: in the shared renderer, add y-padding or draw zero series above the axis. |
| R4 | Grouped-bar offset | **Low** | Services "Households by services received" and Daily "Errands" place bars at the slot edge, away from their label (`services-*-element-1`, `daily-*-element-1`). The colors and legend resolve it, but in narrow the relationship gets weak. Recommendation: in the shared renderer, use one series per category or a stacked bar. |
| R5 | Finance: host selection amber versus repair amber | **Medium (cross-cutting → X-SEL)** | It is identical in hex: `--view-selected #fbbf24` = `scientificPalette.waiting #fbbf24`. Live: the selected asset-1 **loses its red "poor" outline** and shows amber, which the legend defines as repair amber. The same collision exists in **Housing** (amber outline = "under construction", while the header says 0 building; `housing-default-desktop-light-element-0`, `-intervention-desktop-dark-element-0`) and **Economy** (amber outline = "open vacancies"; Firm 1 is framed amber in `economy-*-desktop-*-element-0`). Daily (amber ring versus "yellow school") and Land Use (amber on orange) are weaker cases. It appears only after selection or keyboard focus, which is why it is Medium and not High. Fix: a shared selection channel that is not a semantic model color (for example a white or dashed double outline or an offset focus ring), or keep the semantic outline and draw selection additively. Shared host decision. |

## 7. New findings from this review

**Medium**

- **X-SEL** (see R5): the host selection color is identical to the semantic amber in Finance, Housing and Economy. Selection overwrites state outlines (Finance "poor") or produces false state readings (Housing "under construction", Economy "vacancy"). Evidence: three captured screenshot pairs plus the live Finance test.
- **N-MOB2 Mobility narrow labels**:
  - `city-mobility-{default-narrow-dark,intervention-narrow-light,queue-overflow-narrow-light,1000-trips-narrow-dark}-element-0` plus live.
  - Route labels are crossed by route lines and car symbols, "12 min · 3 driving" and "3 queued" overlap each other, and "1 queued" lies on the blue line.
  - Values stay just legible; this is the same class as M-ENE2 and M-DAY2.
  - Desktop is clean.
  - Fix: route summaries in narrow outside the polygons, or with a background halo, and the two lines with more line spacing.
- **N-ENE3 Energy narrow charging state**: live at 390×844 light, "4.0" lies on "Battery" (see R2). It was not captured because the charging state exists only in desktop. Fix: put the flow label beside the vertical line at the height of the line's midpoint, or move "Battery" down by one label height. Then capture narrow charging as well.

**Low**

- **N-DAY3** Daily: with close 17:00, "Errands missed today 6" and the red rings already show at 02:30, not only after 17:00. Semantically this is "does not fit today", not "missed". The legend "red ring: errand missed today" overstates it. Fix: label it "errand can't fit today" or count it only after the close time.
- **N-DAY4** Daily "Where residents are": "At work" (blue) and "At school" (yellow) both equal 6 between 08:00 and 14:00. Yellow is on top, so blue is invisible and the chart suggests nobody is at work until 14:00. This is the same class as M-ECO1, but not in a core chart. Fix: a title note as in Economy, or a stacked area.
- **N-MAT2** Materials "Daily flows": "Collected" is hidden under "Generated" until day 10 (both 100). A title note as in Economy would be enough.
- **N-WAT2** Water "Daily demand…": "Supplied" (dark blue) and "Inflow" (light blue) are similar hues, which is weak in dark. Low.
- **N-FIN3** Finance intervention: an asset labelled "0.40" has a red outline ("below 0.4"), presumably 0.398 rounded. Fix: 3 decimals, or "< 0.4" in the inspector.
- **N-POP2** Population desktop: the sidebar inputs end at about x=325 and touch the y-axis title "Residents" (gap about 0 px). It also appears in the old image, so it is a pre-existing host layout issue. Element captures show the input edges at the left border.
- **N-GEN3** Mixed decimal separators in the same form: typed values show "0.4"/"0.15", default values "0,5"/"0,05" (Heat, Water, Finance). This is pre-existing host and locale behavior.
- **N-GEN4** Inspector keys are sometimes raw: "areaHa" (Land Use); "employees", "vacancies" and "balance" in lower case (Economy).

## 8. Verdict per model (visual effectiveness only, within the scope checked)

Common questions: Does the scene show the causal mechanism? Are states, quantities and units legible? Is the same-time comparison meaningful? Are there artifacts? Is the color use fit for purpose without decorative realism?

| Model | Verdict | Justification |
| --- | --- | --- |
| Population | **Approved** (low: N-POP2 host, L-LBL1 label) | Pyramid and bar flows clear; pulse 100 visible as an orange spike; million scale legible. |
| Housing | **Conditionally approved** (X-SEL medium; empty canvas low) | Rent 731→900, lower incomes housed, middle incomes displaced; construction and displacement shown. Selection amber contradicts "0 building". |
| Land Use | **Approved** (low: amber on orange selection, "areaHa") | One factor per run; edge, patches and fragmentation clear; diamonds for conversion. |
| Daily Activities | **Approved with conditions (low)**: blocker M-DAY1/2 fixed; N-DAY3/N-DAY4 low | Result 6/0, 6/0 at 7 h travel, and 0/6 equal-time and visible; inspector. Live reproduced. |
| Mobility | **Conditionally approved; M-MOB1 fixed, N-MOB2 (medium, narrow) should be fixed before final acceptance** | Queue, "+n" and cars are now visible; insight capacity 10 → 100 % cars, wait barely shorter; histogram with data. In narrow the route labels collide. |
| Economy | **Conditionally approved** (X-SEL medium) | M-ECO1 fixed; feedback equation and gap bars clear. Selection amber looks like a vacancy. |
| Services | **Approved** (low: R4) | Too far versus full shown by shape; hub label free; bars in map colors. |
| Energy | **Conditionally approved; M-ENE1 fixed, M-ENE2 partial, N-ENE3 (medium, narrow charging) should be fixed** | The balance is now complete and reproduced live (both flow directions). In narrow charging the battery labels collide; "out 4.0" fills the box. |
| Water | **Visually approved** (low: R1, N-WAT2). **Mechanism change L-WAT1 needs an independent re-check** | Monitors are honest; trigger line only when a cut is set; untreated 16 visible as a side effect. |
| Stormwater | **Approved** (low: narrow edge proximity) | Double storm against a full basin, infiltration 8.3 and retention 0.0 at the same time; balance tables. |
| Heat | **Approved** | Fixed scale, Δ against air, proportional shade band, day and night pair. |
| Air and Noise | **Approved** | Unchanged strong scene; narrow table fits; 0-box outline. |
| Habitat | **Approved** (low: green outline for non-West patches, thinned bar labels) | One-factor runs: stepping stone 0.525, enlarge east 0.524, bridge removed 0.451, combination labelled. |
| Materials | **Conditionally approved; L-MAT1 partial** (low: narrow "120/120"/"160/160" crossing the box) | Bottleneck 120/120, branching, over-scale marker are good. The narrow label overflow remains despite the author's claim. |
| Finance | **Conditionally approved; M-FIN1 fixed, X-SEL (medium) remains** | Repair visible; preventive versus worst-first (0.63/0.16, 7000/20100, same cash) carries the insight strongly. The selected asset loses its red state. |

**Visual faithfulness without decorative realism:** all 15 scenes stay schematic and tied to the mechanism (boxes, flows, symbols, fixed scales). Colors are fit for purpose apart from the semantic double use of `#fbbf24` (X-SEL). No scene presents realism that the models do not contain.

## 9. Overall verdict

**Not "all fixed".** The four previously blocked models are no longer blocked in their core findings:

- M-FIN1, M-MOB1, M-ENE1 and M-DAY1/2 are verified in pixels and reproduced live.
- M-EVD1 and M-ECO1 are fixed.
- All L findings are fixed or reduced to low residuals, except L-MAT1 (partial) and L-LBL1 (partial).

These meaningful issues remain before an unrestricted visual acceptance:

1. **X-SEL (medium, cross-cutting, shared host/palette):** the selection color is identical to semantic amber (Finance, Housing, Economy). Finance and Housing deliver false or hidden states after selection.
2. **N-MOB2 (medium, narrow):** Mobility route labels overlap each other and are crossed by lines and symbols.
3. **N-ENE3 (medium, narrow, uncaptured state):** in the Energy charging hour, "4.0" sits on "Battery". This was not covered by the author's evidence.
4. **L-MAT1 partial (low):** narrow Collected value crosses the box borders.

Recommendation: fix items 2–4 at model level (ui.ts only) and decide item 1 as a shared host or palette decision, or document it explicitly as a known limit. Then recapture the affected narrow images (Mobility, Energy charging narrow, Materials narrow, plus one selection image each for Finance, Housing and Economy) and have them independently re-inspected. The other 11 models are visually approved or approved with low conditions, within the scope checked.

## 10. Scope and limits of this approval

- Visual effectiveness and legibility only. No scientific, physical or calibration review. The **water saving-day contract change** is outside this approval and needs a targeted mechanism re-check.
- No screen-reader or full WCAG/Vercel audit. Contrasts were judged visually, not measured.
- The browser check used my own tab with a CSS viewport resize, not a mobile user agent. Some advances were made with a DOM click loop (see section 4).
- `bun run check` and `build:ui` were **not** run by me; I relied on reading the logs.
- Host Enter fix: not rechecked here (historical approval in `revision-2-opus-visual-review.md`); the `host-live-enter-*` images were not part of the 276.
- The 147 pre-fix images were only used for the comparison crop in N-POP2; they are not evidence of this state.
