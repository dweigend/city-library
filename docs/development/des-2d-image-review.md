# Independent flat 2D scene image review

## Scope and method

This is a new independent visual review of the ten redesigned DES scenes and the eleventh elevator scene. It does not reuse the previous DES image approval. The inspector did not implement or refactor these scenes and did not perform the browser interactions.

The inspector opened all eleven accepted second-series reference PNGs from `output/imagegen/salabim-mockups-2d/` in the parent reference worktree. Their accepted direction is a flat charcoal scene with a small vocabulary of primitive shapes. Generated menus, duplicate playback controls, textured surfaces and inconsistent generated counts are excluded. Actual model observations determine the required entity counts and topology.

The current Vercel Web Interface Guidelines were fetched from their official raw source for this review. Image checks cover visual hierarchy, minimal controls, readable labels, responsive layout, clipping, overlap, theme contrast and shape/state distinctions. Keyboard behavior, accessible canvas descriptions, real playback, errors and disposal remain the separate browser review's evidence; screenshots cannot establish those behaviors or full accessibility compliance.

Images are inspected at original detail from unique original paths or SHA256-identical local copies. An initial viewer rendering appeared to omit office symbols in dark mode. Reopening identical bytes at original detail showed all symbols correctly; that observation was withdrawn without a source change or recapture requirement.

## Captured states independently inspected

All 44 primary PNGs in [the browser manifest](des-2d-browser-evidence/manifest.json) were opened and inspected: eleven entries, each at desktop/light, desktop/dark, narrow/light and narrow/dark. The manifest preserves each unique original browser path, portable repository path, SHA256 and PNG dimensions. The inspector also made 44 temporary copies and checked every copy against its manifest SHA256 before image inspection. Desktop CSS viewport is 1366 × 768 at DPR 2; the browser artifact service downsamples the desktop PNG to 1280 × 720. Narrow CSS viewport is 390 × 844 at DPR 2 and PNG is 780 × 1688. These are different capture and display dimensions, not a claim that the desktop CSS viewport was 1280 pixels wide.

| Scene | Inspected mechanism and actual state | Four-image result |
| --- | --- | --- |
| Civic office | At minute 1: two amber waiting dots, one service dot inside one clerk slot, no completed residents. | Accepted |
| EV charging | At minute 1: one queued rectangle and two occupied charger slots, no completed vehicles. | Accepted |
| Goods buffer | At minute 3: two stored squares in two bounded slots and one blocked square outside. | Accepted |
| Bus interchange | At minute 6: actual three-node graph and edge costs 2/3/8, one occupied berth and one waiting bus. | Accepted |
| Parcel logistics | At minute 2: one depot square, occupied van triangle and parcel marker on the actual Depot/East/West graph. | Accepted |
| Waste collection | At minute 3: six collection patches, eight remaining units, four truck units and zero delivered. | Accepted after annotation correction |
| Emergency dispatch | At minute 5: actual four-node access path, one completed, one waiting and one assigned call, one team triangle. | Accepted |
| Bike redistribution | At minute 2: three station rectangles with their actual 18 slots, four parked dots and two aboard, conserved total six. | Accepted |
| Water allocation | At minute 1: four district patches, six filled delivered units and six outlined unmet units; no invented households or hydraulic network. | Accepted |
| Machine maintenance | At minute 10: one waiting, one operational and one repairing machine; one assigned team triangle. | Accepted |
| Elevator | At second 10: six floor lines, two cars, three waiting floor dots, two riding cabin dots and one passenger already departed from the scene. | Accepted |

The scenes retain the requested flat primitive vocabulary and existing Lab shell. Their few labels identify topology, counts or state. They do not reproduce the generated menus, large faux NetLogo title, duplicate playback or decorative architecture. Shapes, filled/outlined slots, spatial grouping and status labels supplement semantic color. Secondary charts and ledgers remain secondary; wide ledger tables use the existing horizontal scroll region on narrow screens and are not forced into the scene.

## Finding and response

One confirmed visual finding: the original waste scene's `Depot · unloading` annotation extended into the first collection patch on the 390-pixel viewport and covered one load symbol. Desktop was clear. The coordinator committed `b3cb3b9`, shortening the annotation to `Depot` while retaining the actual unloading status in the accessible description. No model or scene entity count changed. Fresh affected captures were independently reopened in both viewport sizes and both themes. The shortened label is clear of the collection patches and their eight remaining units in all four. The final original names are `browser-screenshot-localhost-mw95ef7k-7140ad10.png`, `browser-screenshot-localhost-mw95efz4-a2a4973e.png`, `browser-screenshot-localhost-mw95egng-fa9aeec9.png` and `browser-screenshot-localhost-mw95ehbm-bfee2a35.png`; the manifest now points to these final captures. The finding is resolved.

The apparent blank dark-mode office image from the first viewer call was not a runtime finding: original-detail reopening of identical bytes displayed the correct dots and slot. Subsequent dark images were opened separately from their light equivalents to avoid the viewer's repeated-region rendering ambiguity.

## Acceptance and limits

**APPROVED — all eleven scenes across all four required variants.** The inspector opened 44 initial images and four corrected waste images, for 48 actual browser PNG inspections, plus all eleven accepted reference PNGs. All 44 final portable PNGs and original sources were checked against their manifest hashes after replacement. No unresolved visual finding remains in these captured states. This image review does not assert browser playback, keyboard, screen-reader behavior, lifecycle disposal, error-free execution or scientific calibration; those require their separate recorded checks. It does not review maximum-parameter states that were not captured, nor claim pixel identity with generated references whose counts and topology are illustrative.
