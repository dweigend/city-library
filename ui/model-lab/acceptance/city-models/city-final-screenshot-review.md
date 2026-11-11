# Independent final screenshot recheck

Reviewed 2026-11-10. All 36 actual images were inspected using view_image: nine models × desktop/narrow × light/dark. Image paths follow `/tmp/<slug>-<desktop|narrow>-<light|dark>-final.png`. Read docs/DESIGN.md and the prior settled review. The current Vercel Web Interface Guidelines were retrieved successfully and read from `/tmp/city-final-vercel-guidelines.md`.

This is independent visual evidence review only. No browser interactions, keyboard/focus behavior, accessibility tree, numerical mechanism or scientific validation were tested in this review. No source edits were made. This is not Antigravity substantial-design approval. Screenshot acceptance below covers only these recorded default tick-11 states.

## Remaining blocking findings

1. **P1 — blank dark spatial captures in services and stormwater.** Both desktop-dark and narrow-dark final screenshots contain an entirely empty spatial canvas, while their light screenshots show the expected scene. Concrete evidence: `/tmp/city-services-desktop-dark-final.png`, `/tmp/city-services-narrow-dark-final.png`, `/tmp/city-stormwater-desktop-dark-final.png`, `/tmp/city-stormwater-narrow-dark-final.png`. Determine whether theme-change rendering is incomplete or broken, fix/wait for actual scene readiness and recapture. The screenshot alone does not establish the runtime cause. These captures cannot establish dark-mode acceptance.
2. **P1 — dark land-use captures lose nearly all parcel labels.** Colored parcels render, but R/C/G and protection labels disappear except the final P at upper right. Evidence: `/tmp/city-land-use-desktop-dark-final.png`, `/tmp/city-land-use-narrow-dark-final.png`. Light captures have all labels. Restore complete text rendering before recapture; do not accept color alone as the scientific key.
3. **P1 — dark desktop heat capture loses all block text.** `/tmp/city-heat-desktop-dark-final.png` shows a solid red block region with no Sealed/Mixed/Planted temperatures. Light desktop and both narrow captures show the text. Resolve rendering/readiness and recapture this state. The uniform red itself matches the declared temperature threshold and is not a defect.

These are new capture/rendering blockers, separate from the earlier label-layout findings. Their cause may be a theme-change drawing race; that is an inference requiring browser investigation, not established by static images.

## Confirmed fixes and per-model screenshot result

| Model | Actual reviewed result | Screenshot acceptance |
| --- | --- | --- |
| city-services | Light labels H1–H4 and West/East are separate, readable and inside canvas at both widths. Dark scene entirely absent. | Open for dark captures. |
| city-stormwater | Light Overflow/Outlet fully fit at narrow; basin no longer covers text. Discharged series now brown and readable on white. Dark scene entirely absent. | Open for dark captures. |
| city-water | Tall two-column process layout shows all eight labels at both widths/themes; figures remain in monitors and chart views. | Approved for all four supplied states. |
| city-land-use | Duplicated desktop setup/live demand controls removed; light map complete and readable. Dark map loses label text. | Open for dark captures. |
| city-energy | All six network node labels visible; two-column Flow/kWh table readable; battery series darkened. Table has intentional internal vertical scrolling after nine visible rows, with no horizontal ambiguity in the captured rows. | Approved for all four supplied states, table scroll interaction not tested. |
| city-daily-activities | All graph labels readable. Cumulative-time table names all five activities and values at both widths/themes. | Approved for all four supplied states. |
| city-finance | Latest annual-flow table names revenue, services, maintenance and wear with values. Main charts and monitors readable at both widths/themes. | Approved for all four supplied states. |
| city-materials | Tall preset makes all six pathway labels and numbers visible; generated line now brown/readable on white. | Approved for all four supplied states. |
| city-heat | Mixed line now brown/readable on white; all three labels fit on narrow. Desktop-dark block labels absent. | Open for desktop-dark capture. |

No extra blank page width is visible in these screenshots. This observation is not an independent DOM overflow measurement. No new label overlap/clipping blocker remains in the light captures. Approval of five models above does not establish every UI flow, broad accessibility compliance or scientific validity.

## Exact inspected image inventory

- `/tmp/city-services-desktop-light-final.png`
- `/tmp/city-services-desktop-dark-final.png`
- `/tmp/city-services-narrow-light-final.png`
- `/tmp/city-services-narrow-dark-final.png`
- `/tmp/city-stormwater-desktop-light-final.png`
- `/tmp/city-stormwater-desktop-dark-final.png`
- `/tmp/city-stormwater-narrow-light-final.png`
- `/tmp/city-stormwater-narrow-dark-final.png`
- `/tmp/city-water-desktop-light-final.png`
- `/tmp/city-water-desktop-dark-final.png`
- `/tmp/city-water-narrow-light-final.png`
- `/tmp/city-water-narrow-dark-final.png`
- `/tmp/city-land-use-desktop-light-final.png`
- `/tmp/city-land-use-desktop-dark-final.png`
- `/tmp/city-land-use-narrow-light-final.png`
- `/tmp/city-land-use-narrow-dark-final.png`
- `/tmp/city-energy-desktop-light-final.png`
- `/tmp/city-energy-desktop-dark-final.png`
- `/tmp/city-energy-narrow-light-final.png`
- `/tmp/city-energy-narrow-dark-final.png`
- `/tmp/city-daily-activities-desktop-light-final.png`
- `/tmp/city-daily-activities-desktop-dark-final.png`
- `/tmp/city-daily-activities-narrow-light-final.png`
- `/tmp/city-daily-activities-narrow-dark-final.png`
- `/tmp/city-finance-desktop-light-final.png`
- `/tmp/city-finance-desktop-dark-final.png`
- `/tmp/city-finance-narrow-light-final.png`
- `/tmp/city-finance-narrow-dark-final.png`
- `/tmp/city-materials-desktop-light-final.png`
- `/tmp/city-materials-desktop-dark-final.png`
- `/tmp/city-materials-narrow-light-final.png`
- `/tmp/city-materials-narrow-dark-final.png`
- `/tmp/city-heat-desktop-light-final.png`
- `/tmp/city-heat-desktop-dark-final.png`
- `/tmp/city-heat-narrow-light-final.png`
- `/tmp/city-heat-narrow-dark-final.png`
