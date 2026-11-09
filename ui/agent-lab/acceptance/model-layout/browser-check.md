# Model layout browser verification

Executed against the integrated worktree with `bun run dev`, after model discovery and tooling moved to their owners. This checks repository layout integration, not scientific model equivalence.

- Real shared Chromium offered 125 model options with no discovery errors.
- Anisogamy: Setup showed tick 0, Run advanced, Pause stopped, then one step completed (tick 33 observed).
- Model chooser switched to Life; URL retained the compatible `experiment=life` query, old state was replaced, Run was disabled until Setup.
- Life: Setup then 10 steps showed tick 10, Living 2288 and Density 0.2243. No model alert was present.
- Search for Fire produced exactly Fire and Fireflies; Escape dismissed the chooser.
- Captured desktop 1366×768 CSS and narrow 390×844 CSS states in light and dark. Narrow document had no horizontal overflow. Screenshot tooling may scale bitmap dimensions independently of the CSS viewport.
- Visible selection labels now use Model. The URL query remains compatible with existing links.

The first immediate theme-transition captures had inconsistent text colors. Recaptures waited for two animation frames after theme changes; computed foreground/background tokens were checked. See [independent screenshot review](screenshot-review.md) for findings and recheck, and the four adjacent PNGs for actual rendered output. Browser checks do not claim complete accessibility or all-model behavioral acceptance.
