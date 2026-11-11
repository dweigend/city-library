# City Water: final visual check of the outlet labels (N-WAT3)

Independent, read-only check, 2026-11-10. Worktree `t3-ad043594-efa84c79fbccafc6`, branch `t3/city-simulation-models`. I made no repository edits, started no browser and ran no checks myself.

## Verdict: APPROVED

The finding N-WAT3 (medium) is resolved. „Untreated 16“ belongs clearly to the orange outlet, and „Treated 120“ belongs clearly to the green outlet. No label is crossed or clipped. I found no new regression. Together with the 14 prior approvals in `revision-2-targeted-final-opus-review.md` and the separate approval of the Water mechanism in `revision-2-water-independent-recheck.md`, **the visual acceptance of all 15 models is complete**. The low-severity limits recorded earlier still apply.

## Evidence

**Code.** The only change I checked is in `models/city-water/ui.ts`, lines 76–80 and 99–100:
- Treated water: a vertical segment from (3.3, −0.9) to (3.3, −1.9). The label „Treated …“ sits at (3.3, −2.15), below the end of the segment.
- Untreated water: three segments. The first runs right from (3.9, −0.5) to (4.6, −0.5). The second runs up to (4.6, 1.1). The third runs left back to (3.3, 1.1). The label „Untreated …“ sits at (3.3, 1.55), above the end of the outlet.
- The two lanes do not share any coordinates. The label „Sewage“ at (3.1, 0.3) stays between the plant and the orange top lane. I did not check the headless model, because the task excluded it.

**Pixels.** I viewed all 8 PNGs in `ui/agent-lab/acceptance/screenshots/city-models/revision-2-water-outlet/` in full. I also enlarged a 2× crop of `saving-narrow-light`.

| Image | Result |
|---|---|
| saving narrow light/dark (780×1688 px, i.e. 390×844 at DPR 2) | The orange line runs right from the plant, up, then left. It ends at x ≈ 632 px, about 20–25 px below „Untreated 16“, which is centered over that end. The green line ends above „Treated 120“. Neither line crosses a label. The label „Untreated 16“ ends inside the canvas on the right. „Treated 120“ sits above the bottom edge of the canvas. Day 80, reservoir 120, „Days with a demand cut 44“. |
| saving desktop light/dark (2732×1536 px, i.e. 1366×768) | The same geometry with more space. „Untreated 16“ sits about 60 px (display) above the end of the orange line. „Sewage 136“ is clear of the label and the lines. The inputs read 0.6 and 0.15, and the monitor shows „Cutting demand“, cut 15 %, day 80. |
| default narrow/desktop, both themes | Untreated = 0, so the orange line has width 0 and is not drawn. This matches the rule that line width is proportional to volume. „Untreated 0“ stands alone, which is acceptable for a value of zero. The thin green line leads to „Treated 32“. Nothing crosses. Day 80, rule „Off (cut 0)“, shortage total 1200. |

**City / Sewage.** In the narrow view, „City 170/200“ and „Sewage 136“ are separated by a gap of only about 3–5 CSS px, and Sewage sits slightly higher. They do not overlap and both stay readable. Neither label changed in this edit (`City` at city.x−0.35, `Sewage` at plant.x−0.2), and the earlier review already recorded this as low. **It is not a new regression.** In the default case („City 40/200“ and „Sewage 32“) the gap is larger. On desktop, the gap is wide.

**Logs (read, not re-run).** `/tmp/city-water-final-label-typecheck.log` shows svelte-check with 0 errors and 0 warnings. `/tmp/city-water-final-label-build-ui.log` shows „✓ built in 1.64s“ plus the known chunk-size warning (>500 kB), which does not block.

## Limits

- I judged pixels only. I used no browser of my own, so I did not verify DOM, overflow or live interaction. The author reports using a real T3 preview with real clicks and input, as recorded in the manifest.
- The canvas background is dark in the light theme too. This is the existing renderer behavior and was already accepted earlier, so it is out of scope here.
- I did not run a full Vercel/WCAG audit, check contrast by measurement or look at other models.
- The low-severity findings already recorded (N-SEL1, E-CAP1, missing units, City/Sewage spacing, Materials, Mobility) remain open and are not part of this approval.
