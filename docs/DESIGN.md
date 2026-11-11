# UI design

Model Lab should help you ask a question, change a parameter and see what happened. The interface should leave room for the model, while keeping controls and scientific meaning clear.

Shared components and defaults keep each model declaration short. [Architecture](ARCHITECTURE.md) covers ownership and dependencies; [PLAN](../PLAN.md) tracks unfinished work.

Use the system-wide [naming conventions](NAMING_CONVENTIONS.md) for component names, UI actions and model vocabulary.

In the accepted [target structure](evolution/structure.md), today's `ui/` becomes `ui-web/`, which will later also hold game UI components. A later `ui-3d/` will hold Three.js presentation. Both follow the binding rules below; no files have moved yet.

## Binding UI system rules

Use this system across all Svelte components, models and screens. [PLAN](../PLAN.md) tracks remaining UI work.

- **Minimal UI:** give every visible element a clear purpose in a user task; remove anything unnecessary. Preserve accessible names, essential labels, actionable errors and required attribution. Prefer a smaller surface over additional explanation or decoration.
- **Shared stack and component precedence:** use Svelte, strict TypeScript, Tailwind and shadcn-svelte for the Svelte UI. Use standard shadcn-svelte components first. Create a custom component only when a concrete requirement cannot be met by their composition; use Bits UI for the required interaction primitives. Do not introduce a parallel component system.
- **Encapsulated styling:** no CSS declarations, inline styles or style blocks in HTML or `.svelte` files. Keep required custom CSS in separate component-owned stylesheet files. Keep styling and layout encapsulated in shared components; model scripts and application consumers select their public properties and variants rather than styling their internals. Standard component markup and Tailwind classes remain part of the shared component implementation.
- **Small global stylesheet:** `app.css` has at most 100 physical lines, including comments, imports and blank lines. It contains only required framework imports, system tokens and essential global defaults. Do not evade the limit through minification or additional global override stylesheets. Component-specific rules belong to their owning components.
- **One fixed visual system:** define system-wide colors, font families, typography sizes/weights, spacing, radii and control sizes once. Components consume semantic tokens and shared variants. No local literal colors, arbitrary typography, model-specific UI themes or one-off overrides. Supported light/dark palettes belong to the same fixed system. Scientific data colors use a centrally defined palette, separate from UI chrome.
- **Encapsulated modules:** each module has one responsibility and a small explicit typed public contract. Hide implementation details. Consumers do not reach into private files, DOM structure, renderer internals or component styles. Domain state retains its single headless owner; UI changes it only through defined actions.
- **Simple public authoring API:** `models/<slug>/ui.ts` scripts use the public TypeScript UI API and remain short, declarative and easy to read. They bind model inputs, public actions, observations and views. They contain no framework lifecycle wiring, DOM construction, styling or duplicated controls. Shared infrastructure owns rendering, playback and cleanup. Freeze readable public examples before changing the authoring contract; do not invent a replacement API during implementation.
- **KISS:** choose the simplest composition that fulfills the current accepted task. Avoid competing state owners, configuration layers, wrappers and abstractions without a demonstrated need.
- **YAGNI:** add only capabilities required by the current working slice. No speculative extension systems, unused components, future settings or empty scaffolding. Add components when used, rather than installing the complete catalog.
- **Browser and independent screenshot gate:** every UI implementation change requires real-browser interaction checks and captured, visually inspected screenshots of affected states at desktop (at least 1366×768) and narrow (390×844) sizes, including supported light/dark themes. An independent subagent must inspect the actual screenshots and review them against these rules; the implementing agent's self-review is insufficient. Record screenshot paths, checked flows, findings and responses separately from independent approval. Fix findings and repeat affected browser checks and screenshot review before acceptance. A browser or reviewer blocker leaves acceptance open; source inspection cannot substitute. Existing requirements for Antigravity `gemini-3.8-flash` review of substantial design/transfer work remain in force.

Every affected UI flow needs current browser evidence and independent screenshot review. Source inspection alone does not establish visual acceptance.

## Binding UI authoring rules

Follow the [coding standards](CODING_STANDARDS.md) and these rules for public UI APIs, documentation and implementation. Readability takes priority over brevity. The shared UI provides opinionated design defaults for rapid prototyping; authors customize only when needed.

- **Default first:** omission means defined, useful default behavior. Prepare shared defaults before requiring model-specific configuration.
- **Flat first:** ordinary models use no builder chains, additional configuration layers or nested layout trees.
- **One normal syntax:** provide one ordinary authoring form, not a collection of competing shorthand forms.
- **Customize at the affected entry:** a special label or presentation belongs directly beside its binding.
- **Place functions for readability:** keep short projections inline; give longer functions descriptive names and place them below the UI description.

The [UI reference](ui/api-reference.md) defines the implemented readable-authoring contract. Array control declarations remain supported syntax. Future extensions still need the example-first gate; preserve accepted examples, headless contracts and the single domain-state owner. UI changes state only through public model actions.

## Binding UI API documentation

The [UI specification](ui/README.md), [API table](ui/api-table.md) and [API reference](ui/api-reference.md) define the shared authoring contract. Planned operations must be labelled as planned. Current acceptance and review limits belong in [PLAN](../PLAN.md).
