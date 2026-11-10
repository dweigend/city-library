# Independent post-main integration image review

Status: APPROVED for the 64 final post-main images, with no blocking visual findings. Review date: 2026-11-09.

## Scope and method

This new review covers the consolidated `models/` layout and single Svelte host after normal merge `b5977bb`, with documentation baseline `1e97878`. The compatibility import is an alias to the same UI, not a second host. Prior image approvals pinned to `754e4cc` remain historical and are not reused as post-merge evidence.

I read the current DESIGN and development-artifact policy and fetched the current [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). Applicable visual criteria are readable content, contrast, visible focus, narrow layout, useful empty states and the project's minimal shared chrome. This is an independent image inspection, separate from implementation and browser execution.

Browser QA produced new captures through its isolated port 3231 session. I opened every reviewed original using `view_image` at original detail and independently compared original/local-copy bytes, SHA256 and PNG dimensions. Detailed paths, states and hashes remain local under `.local/development-archive/pr-main-integration/browser/manifest.json`; screenshots and transcripts are deliberately not versioned or promised in a fresh clone.

## Primary results

All 44 new primary images were actually inspected: eleven DES scenes × desktop CSS 1366×768/narrow CSS 390×844 × actual light/dark appearance. The backend produces desktop PNG 1280×720 and narrow PNG 780×1688; these are recorded separately from CSS dimensions. Narrow captures intentionally scroll the current results into view; viewport cropping above/below the captured area is not treated as missing content.

The office, EV and goods scenes retain correct supplied queue order, separate identified occupants and anonymous capacity, centered complete headings and singular `1 item`. Bus, parcel and emergency graphs preserve topology, weights and actual vehicle/team glyphs. Waste and water preserve discrete quantities and explicit units. Bike station stock plus transit stock matches the captured fleet total. Maintenance statuses and crew agree with monitors. Elevator cabin/floor dots agree with the three waiting/two riding/one arrived state. Canvas labels remain readable in both themes and sizes; tables use their existing horizontal scroll rather than document overflow.

The main catalog/search, shared controls and ordinary parameter forms use the consolidated shell. Flat scientific glyphs and source colors remain distinct from chrome. No blocking scene clipping, hidden capacity claim, topology loss or new visual overlap was identified in these primary captures. The inherited maintenance wording `1 repairs` is a nonblocking copy imperfection; this review requests no unrelated source change.

## Supplementary results

Twenty new supplementary images cover five cases in the same four viewport/theme combinations: retained office occupancy (three active claims against capacity one, with two excess units visible), Robby last-page range 201–243 of 243 and last index 242, valid Taxi probability/groups, fixed-scale heat grid, and the twelve-household recycling network. Retained capacity is explicit rather than hidden; paging labels and last rows fit; scientific heat colors and network labels remain intact.

The first two narrow Taxi supplements scrolled to charts instead of the intended AM/MD controls. Browser QA replaced only these two captures with new unique originals; I independently opened both corrected originals. AM/MD labels and controls are readable in both narrow themes, without a validation popup. Finding closed; no product source change was needed.

## Verdict and limits

All 64 final originals were actually inspected: 44 primary plus 20 supplementary. The final independent integrity check passed for all 64 unique original/local-copy pairs, their SHA256 values and PNG dimensions. The accepted local manifest SHA256 is `13699de3a11080ebc02f66d3ded511944c63adb91a957edaf1dc56146420ef02`. No previous-stage screenshot is reused and no blocking visual finding remains. This is a new post-merge image approval; it does not extend the old approval to unseen states. Images establish captured appearance and internal visual count consistency only. Model execution, live edits, selection/picking, keyboard behavior, resizing, disposal and error/rejection instrumentation belong to independent browser/source evidence. This review makes no blanket accessibility, screen-reader, contrast for arbitrary explicit palettes or scientific calibration claim.
