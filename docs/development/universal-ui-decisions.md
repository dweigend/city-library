# UI authoring decisions

Use one flat `defineUI(model, spec)` description and reuse the existing Svelte session, controls and renderers. `ui/index.ts` is the public entry; `ui/svelte/index.ts` preserves import compatibility and delegates to that same implementation. The headless package does not import UI code.

## Explicit writes with useful defaults

A common `change(instance, changes)` action removes repeated single-field forwarding. Each edit is descriptor-decoded and supplies one own key; a field's local `set` overrides it. No action is guessed and no model property is assigned directly. Keep short named domain setters explicit where a shared default would obscure them.

`UISpec` remains an extendable interface for existing explicit-set declarations. `ChangeUISpec` describes the required common-write variant. These are typed variants of the same flat call, not competing authoring languages. Legacy live arrays remain compatibility records with their required setters; they do not acquire the common write default. The [UI reference](../ui/api-reference.md#live) owns exact behavior and errors.

## Presentation facts stay distinct

`collectionDiagram` returns ordinary `SpatialData`, using the existing canvas and shared layout defaults. Identified items, anonymous counts and capacities are separate row variants. Supplied order must come from the model; the projection never reconstructs a Resource queue by filtering an admission ledger. Capacity does not assign a person to a desk or seat, and retained excess remains visible. Decorations can opt out of selection without losing their visual meaning.

Keep physical grids, route topology and the elevator's floor/shaft geometry in their existing spatial projections. There is no new view type, scene DSL, generic coordinate framework or widget per domain. The [collection reference](../ui/api-reference.md#collection-diagrams) owns the data contract.

## Preserve scientific meaning

Keep readable history maps, explicit source color formulas, NetLogo compatibility conversion and stated normalization domains. Do not replace them with encounter-order categories, automatic per-frame scales or guessed physical units. Synthetic water allocation remains allocation units, not hydraulic volume. A formatter changes text, not observations.

Charts keep default colors associated with unique series labels during a mounted view; explicit colors win and duplicate labels preserve positional fallback. Tables expose all projected rows through bounded pages. Neither feature changes model data or creates entity identities.

## Provenance and acceptance

The original two-model design comparison and example-first decisions are preserved in the [pre-consolidation decision record](https://github.com/dweigend/city-library/blob/754e4cc0bb1afb5b417aeda1d918d3b654c8c85f/docs/development/universal-ui-decisions.md). The five live-authoring and five collection scripts preceded runtime implementation; path changes preserve their executable assertions. [Historical acceptance](universal-ui-evidence.md) is distinct from [current main integration](pr-main-integration.md).
