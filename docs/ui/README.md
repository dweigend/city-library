# UI API specification

This is the binding authoring contract for City Library's shared UI layer. Read the [API table](api-table.md) for signatures and availability, then the [API reference](api-reference.md) for behavior and examples.

Apply the shared [coding standards](../CODING_STANDARDS.md), including the requirement that model and UI scripts read as self-explanatory examples of good code.

## Priorities

1. Readability comes first. An ordinary `ui.ts` reads as a flat description using normal typed TypeScript objects.
2. Defaults come first. The shared UI supplies controls, labels, layout, colors and lifecycle behavior wherever the contract defines a default.
3. Customization comes second. Add a local override only for a concrete need; keep model actions explicit and presentation separate from domain rules.

These priorities are normative for future UI work. They do not make a proposed operation available in an existing runtime.

## Status and authority

The table and reference jointly define the UI contract. Availability labels distinguish the current `main` API, additions in `experiment/netlogo-web-catalog`, and target behavior requiring implementation. Experimental source evidence is not a release or browser-acceptance claim. The UI is not exported by the headless `city-library` package; examples use repository UI imports.

The [design rules](../DESIGN.md) and [Agent Loom terminology](../agent-loom/terminology.md) remain binding. The UI owns presentation and host scheduling; models own domain state, validation and model time. On the experimental branch, `docs/ARCHITECTURE.md` owns the extracted system architecture. Internal Svelte components, renderer options and private DOM structures are not an experiment-author API.

When documentation and implementation differ, record the gap and fix the implementation against the accepted contract. Do not silently change examples or claim a target is delivered. New runtime slices follow the [example-first delivery gate](../../PLAN.md#example-first-delivery-gate), including four or five asserted public scripts before implementation, relevant type/behavior checks and real-browser acceptance for affected flows. API changes require an explicit design decision; substantive changes to accepted example syntax require user agreement.

## Related documentation

- [Agent Lab usage](../../ui/agent-lab/README.md): running the application and adding an entry.
- [Refactor assignment](../development/agent-lab-refactor.md): application boundaries and discovery.
- [Agent Loom specification](../agent-loom/README.md): headless domain API, a separate contract.

The UI specification was commissioned on 6 November 2026 alongside terminology normalization, catalog development, the Svelte migration and the `ui.ts` readability discussion. Proposed syntax is identified separately from source-confirmed behavior. Independent review findings and responses are recorded separately from delivery evidence.

## Verification and independent review

Author source inspection covered both checkout APIs. The documentation-only change adds no runtime behavior and changes no accepted examples. Local Markdown links/anchors, API ID uniqueness and whitespace are checked separately from runtime acceptance.

The independent Antigravity `gemini-4-argon` review attempted on 6 November 2026 failed before producing findings because the provider quota was exhausted. No independent approval exists; no substitute reviewer was used. The requested binding status comes from the user instruction and does not imply independent review acceptance. Independent review remains open.
