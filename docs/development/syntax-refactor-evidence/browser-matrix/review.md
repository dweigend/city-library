# Independent browser acceptance of the syntax extension

On 7 November 2026, the non-implementing reviewer ran the frozen `2dacc27` browser examples in real Chromium through T3 preview. The source checkpoint at the end was `1f48e05`. Only this evidence directory was written; no implementation, frozen examples or other browser tabs were changed.

## Executed checks

Both public adapters ran all five frozen browser checks at desktop 1366×900 CSS pixels and narrow 390×844 CSS pixels, each in light and dark appearance: **40 successful example flows across eight combinations**. The legacy fixtures loaded the actual production `styles.css`; fresh navigation separated the Svelte fixtures from that stylesheet. Page error/unhandled rejection listeners and `console.error` capture reported no errors. No combination had horizontal document overflow.

The flows cover scalar and union monitor formatting, public-observation named projections, cross-kind namespaced selection, shared IDs across views, explicit selection-dependent model actions, stale selection, restart, formatter failure/recovery, independent models and original-instance disposal safety. They use real factories; the collision fixture deliberately adapts only the sampled observation as described in its frozen contract.

Four additional captures show an inspected `cell` in both views and an inspected `agent` in narrow dark mode, for each host. The action availability, inspector kind and both canvas selected-ID labels agreed. All twelve saved PNGs were individually opened and inspected.

## Screenshot facts

| Capture group | Configured viewport | Actual saved PNG |
| --- | --- | --- |
| Desktop | 1366×900 CSS pixels | 1280×843 pixels; scaled by the T3 snapshot tool |
| Narrow | 390×844 CSS pixels | 780×1688 pixels at device pixel ratio 2 |

The ordinary `legacy-*` and `svelte-*` files show the same real Wealth-based named-projection task. The four `*-selected-*` files show the namespaced selection fixture. Legacy narrow results require normal vertical scrolling; there was no horizontal overflow. Desktop charts can extend below the viewport and were exercised by the frozen accessible chart assertions.

Inspected examples:

- [Svelte desktop light](svelte-desktop-light.png), [desktop dark](svelte-desktop-dark.png), [narrow light](svelte-narrow-light.png), [narrow dark](svelte-narrow-dark.png).
- [Legacy desktop light](legacy-desktop-light.png), [desktop dark](legacy-desktop-dark.png), [narrow light](legacy-narrow-light.png), [narrow dark](legacy-narrow-dark.png).
- [Svelte selected cell](svelte-desktop-light-selected-cell.png), [selected agent](svelte-narrow-dark-selected-agent.png).
- [Legacy selected cell](legacy-desktop-light-selected-cell.png), [selected agent](legacy-narrow-dark-selected-agent.png).

An initial visual impression of fewer dark-theme agents was checked against actual pixels and rejected: the narrow Svelte light PNG, dark PNG and live dark canvas each contained **13,323 exact `#355FA5` agent-color pixels**. No disappeared-agent regression was found. No source change was made for that impression.

## Scope and limits

**Scoped browser and inspected-image acceptance is granted for these five syntax-extension fixtures and recorded states.** This is not scientific model acceptance, a complete accessibility audit, a network trace or a main-merge approval. Catalog-wide scientific gates and the coordinator's production rich-flow, typecheck, public-consumer and full-suite results remain separate evidence.

The complete matrix, page/console arrays, selected IDs and screenshot dimensions are in [report.json](report.json). The review tab was closed; the coordinator's tab and development server were retained.
