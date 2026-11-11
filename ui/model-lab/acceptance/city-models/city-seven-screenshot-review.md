# Independent screenshot review

Reviewed 2026-11-10. Reviewer inspected the actual 28 PNGs with view_image, independently of implementation. docs/DESIGN.md and web-design-guidelines skill were read; current Vercel rules were retrieved successfully via curl from https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md. Only screenshot QA is claimed. No interaction, keyboard, focus, screen-reader, model correctness or scientific validation was performed. This is not Antigravity substantial-design approval. No repository file was changed.

## Findings requiring correction or fresh evidence

- P1, city-stormwater, models/city-stormwater/ui.ts:38-50: all four captures clip Outlet/Overflow labels at the right canvas edge. Plot labels and the reservoir label are obscured by the subsequently drawn water rectangle. Shorten/reposition labels or move details into monitor/inspector; reserve label margin and render overlay labels last. Evidence: /tmp/city-stormwater-narrow-light.png, /tmp/city-stormwater-narrow-dark.png, /tmp/city-stormwater-desktop-light.png, /tmp/city-stormwater-desktop-dark.png.
- P1, evidence readiness: /tmp/city-daily-activities-desktop-light.png, /tmp/city-energy-desktop-light.png, /tmp/city-water-desktop-light.png and /tmp/city-materials-desktop-light.png have an empty network area and visibly washed-out/disabled controls. Other theme/size captures show graphs. Wait for async renderer/import readiness and settled theme/layout before recapturing; these four images cannot establish working rendered acceptance.
- P1, selected-model readability: the selected model text is nearly black against black in desktop-dark captures for city-land-use, city-daily-activities, city-energy, city-water and city-materials. This is visible evidence of failed readability, but could reflect transient capture timing rather than persistent styles. Reproduce with settled theme and fix shared select foreground if persistent. Narrow-dark controls are readable.
- P1, city-water narrow graph: /tmp/city-water-narrow-dark.png shows microscopic labels, whereas narrow-light shows normal-sized labels and suppresses some central labels. Neither establishes a consistently readable complete process diagram. Check resize/refit after settling and provide a compact vertical arrangement or another shared presentation that preserves labels. models/city-water/ui.ts:32-41 declares the fixed horizontal coordinates.
- P2, network labels: city-energy screenshots with a populated graph omit Electricity demand and Heat demand labels; city-materials populated screenshots omit Reused and Disposed labels. The endpoint meaning is not readable from these diagrams. models/city-energy/ui.ts:18-24 and models/city-materials/ui.ts:30 declare these views. Supply stable positions/spacing or an inspector/table that makes every endpoint identifiable; check actual settled renderer collision handling. Evidence: /tmp/city-energy-desktop-dark.png, /tmp/city-energy-narrow-light.png, /tmp/city-materials-desktop-dark.png, /tmp/city-materials-narrow-light.png.
- P2, city-land-use duplicates setup Residential/Commercial Demand and live Residential/Commercial target controls in desktop screenshots, with identical values and no visible timing distinction. docs/DESIGN.md forbids duplicated controls. Omit explicit setup duplicates if the existing API derives setup from live bindings, or clearly resolve the intended single-control contract. Evidence: /tmp/city-land-use-desktop-light.png.
- P2, city-energy table: raw camelCase API keys appear as column headers and the wide one-row table is clipped behind a horizontal container. Present a compact metric/value table with readable labels instead. Evidence: /tmp/city-energy-narrow-light.png and /tmp/city-energy-narrow-dark.png; models/city-energy/ui.ts:48. Table body is almost invisible in desktop-dark, another reason to recapture settled themes and verify shared table foreground.
- Evidence issue, horizontal size: city-daily-activities-narrow-dark, city-energy-narrow-light/dark and city-water-narrow-dark full-page captures are roughly 1034px wide although the visible layout occupies only the left 390px. Verify document.scrollWidth against viewport after renderer/theme settles; resolve any actual horizontal overflow. This finding does not by itself identify whether capture timing or application layout owns the extra width.

## Per-model assessment

- city-land-use: parcel labels, protected markers, monitors and chart are readable at both sizes. Acceptance remains open for duplicate controls, dark desktop selected-model text, and missing settled full chart in desktop-dark capture.
- city-daily-activities: narrow graph and dark desktop graph readable; chart uses useful units. Desktop-light graph evidence is blank. Narrow time chart omits some category tick labels (Work/Services), so ensure values remain identifiable through a shared accessible table/inspector.
- city-energy: chart units and totals understandable; diagram endpoints/table/readiness issues above remain. Yellow battery line on white is weak; choose a centrally defined higher-contrast data color.
- city-water: chart/monitor units clear, but narrow diagram sizing and readiness issues remain.
- city-stormwater: chart readable and units clear, but clipped/overlaid diagram labels block acceptance.
- city-biodiversity: all four screenshots show readable habitat labels, values, monitors and axes without visible clipping; no model-specific screenshot blocker found. Desktop-light controls look washed out, so use settled capture protocol for shared chrome before overall acceptance.
- city-materials: flow charts and totals readable; graph endpoint/readiness issues remain. Yellow generated series on white is weak; choose a central higher-contrast palette entry.

## Screenshot inventory


city-land-use:
- /tmp/city-land-use-desktop-light.png
- /tmp/city-land-use-narrow-light.png
- /tmp/city-land-use-desktop-dark.png
- /tmp/city-land-use-narrow-dark.png

city-daily-activities:
- /tmp/city-daily-activities-desktop-light.png
- /tmp/city-daily-activities-narrow-light.png
- /tmp/city-daily-activities-desktop-dark.png
- /tmp/city-daily-activities-narrow-dark.png

city-energy:
- /tmp/city-energy-desktop-light.png
- /tmp/city-energy-narrow-light.png
- /tmp/city-energy-desktop-dark.png
- /tmp/city-energy-narrow-dark.png

city-water:
- /tmp/city-water-desktop-light.png
- /tmp/city-water-narrow-light.png
- /tmp/city-water-desktop-dark.png
- /tmp/city-water-narrow-dark.png

city-stormwater:
- /tmp/city-stormwater-desktop-light.png
- /tmp/city-stormwater-narrow-light.png
- /tmp/city-stormwater-desktop-dark.png
- /tmp/city-stormwater-narrow-dark.png

city-biodiversity:
- /tmp/city-biodiversity-desktop-light.png
- /tmp/city-biodiversity-narrow-light.png
- /tmp/city-biodiversity-desktop-dark.png
- /tmp/city-biodiversity-narrow-dark.png

city-materials:
- /tmp/city-materials-desktop-light.png
- /tmp/city-materials-narrow-light.png
- /tmp/city-materials-desktop-dark.png
- /tmp/city-materials-narrow-dark.png

No independent acceptance is granted yet for the batch. Resolve confirmed visual findings, repeat affected browser checks/captures after readiness, and request a fresh independent review.
