# UI design

This document owns the binding UI design and implementation rules for Agent Lab. [System architecture](ARCHITECTURE.md) owns module boundaries, dependency direction, state ownership, headless contracts and domain layout. [PLAN](../PLAN.md) owns sequencing and acceptance status.

## Binding UI system rules

The user-defined rules below govern the Svelte UI migration and every subsequent UI slice. They are mandatory without per-model, per-screen or per-component exceptions. Recording them does not establish migration completion or authorize additional product features.

- **Minimal UI:** critically justify every visible element, text, button, heading and container against an actual user task. Remove anything unnecessary. Preserve accessible names, essential labels, actionable errors and required attribution. Prefer a smaller surface over additional explanation or decoration.
- **Shared stack and component precedence:** use Svelte, strict TypeScript, Tailwind and shadcn-svelte for the migrated UI. Use standard shadcn-svelte components first. Create a custom component only when a concrete requirement cannot be met by their composition; use Bits UI for the required interaction primitives. Do not introduce a parallel component system.
- **Encapsulated styling:** no CSS declarations, inline styles or style blocks in HTML or `.svelte` files. Keep required custom CSS in separate component-owned stylesheet files. Keep styling and layout encapsulated in shared components; experiment scripts and application consumers select their public properties and variants rather than styling their internals. Standard component markup and Tailwind classes remain part of the shared component implementation.
- **Small global stylesheet:** `app.css` has at most 100 physical lines, including comments, imports and blank lines. It contains only required framework imports, system tokens and essential global defaults. Do not evade the limit through minification or additional global override stylesheets. Component-specific rules belong to their owning components.
- **One fixed visual system:** define system-wide colors, font families, typography sizes/weights, spacing, radii and control sizes once. Components consume semantic tokens and shared variants. No local literal colors, arbitrary typography, model-specific UI themes or one-off overrides. Supported light/dark palettes belong to the same fixed system. Scientific data colors use a centrally defined palette, separate from UI chrome.
- **Encapsulated modules:** each module has one responsibility and a small explicit typed public contract. Hide implementation details. Consumers do not reach into private files, DOM structure, renderer internals or component styles. Domain state retains its single headless owner; UI changes it only through defined actions.
- **Simple public authoring API:** `experiments/<slug>/ui.ts` scripts use the public TypeScript UI API and remain short, declarative and easy to read. They bind model inputs, public actions, observations and views. They contain no framework lifecycle wiring, DOM construction, styling or duplicated controls. Shared infrastructure owns rendering, playback and cleanup. Freeze readable public examples before changing the authoring contract; do not invent a replacement API during implementation.
- **KISS:** choose the simplest composition that fulfills the current accepted task. Avoid competing state owners, configuration layers, wrappers and abstractions without a demonstrated need.
- **YAGNI:** add only capabilities required by the current working slice. No speculative extension systems, unused components, future settings or empty scaffolding. Add components when used, rather than installing the complete catalog.
- **Browser and independent screenshot gate:** every UI implementation change requires real-browser interaction checks and captured, visually inspected screenshots of affected states at desktop (at least 1366×768) and narrow (390×844) sizes, including supported light/dark themes. An independent subagent must inspect the actual screenshots and review them against these rules; the implementing agent's self-review is insufficient. Record screenshot paths, checked flows, findings and responses separately from independent approval. Fix findings and repeat affected browser checks and screenshot review before acceptance. A browser or reviewer blocker leaves acceptance open; source inspection cannot substitute. Existing requirements for Antigravity `gemini-3.8-flash` review of substantial design/transfer work remain in force.

The existing UI is not claimed to satisfy these rules. Migration evidence must demonstrate compliance; historical browser evidence does not establish acceptance of the migrated implementation.

## Binding UI authoring rules

The following user-defined rules are mandatory for public UI API design, documentation and subsequent implementation, including the Svelte migration. Readability takes priority over brevity. The shared UI provides opinionated design defaults for rapid prototyping; authors customize only when needed.

- **Default first:** omission means defined, useful default behavior. Prepare shared defaults before requiring experiment-specific configuration.
- **Flat first:** ordinary experiments use no builder chains, additional configuration layers or nested layout trees.
- **One normal syntax:** provide one ordinary authoring form, not a collection of competing shorthand forms.
- **Customize at the affected entry:** a special label or presentation belongs directly beside its binding.
- **Place functions for readability:** keep short projections inline; give longer functions descriptive names and place them below the UI description.

These are binding design rules, not a declaration that proposed syntax is available or frozen. Concrete simplified syntax remains a design candidate until explicitly agreed and frozen through the example-first gate. Preserve existing accepted examples and headless model contracts; domain state has one owner and UI changes it only through public model actions. Recording these rules does not authorize runtime changes or establish migration acceptance.

## Binding UI API documentation

The [UI specification](ui/README.md), [API table](ui/api-table.md) and [API reference](ui/api-reference.md) jointly define the shared UI authoring contract, subject to the binding authoring rules above. Source availability and unfrozen design candidates are explicitly distinguished; documentation introduces no runtime change. Independent Antigravity review is open because the attempted review failed due to provider quota.
