# Working instructions

- Discuss work in German; write repository content and commits in English.
- Check branch/status; preserve concurrent work, README and its approved diagram unless the task requires changes. Never commit secrets or dependencies.
- Read relevant sections of [README](README.md) (orientation), [PLAN](PLAN.md) (scope, sequence, acceptance), [ARCHITECTURE](docs/ARCHITECTURE.md) (architecture, contracts, source context) and [DESIGN](docs/DESIGN.md) (UI only) before changes. Follow current decisions over historical experiments; flag unresolved contracts instead of inventing APIs.
- Use strict TypeScript and Bun. Deliver the smallest useful slice with PLAN's reuse/provenance, public examples, documentation and authorized independent reviews. Run `bun run typecheck` for TypeScript changes and relevant behavior/public-consumer checks. Report executed checks only; distinguish proposals, source evidence and verified target behavior in PLAN.
- Follow [architecture rules](docs/ARCHITECTURE.md#binding-architecture-rules): headless, framework-independent domain logic; thin, separate UI; dependencies toward core contracts; one domain-state owner. Expose every domain function through public TypeScript APIs; UI writes only through defined actions/functions.
- Follow [domain layout](docs/ARCHITECTURE.md#binding-domain-layout-and-extension-rules): separate kernels, algorithms and explicit variants; preserve phase-one APIs. Prepared directories are scaffolding, not delivered modules; add source/exports only with working slices.
- Follow [UI rules](docs/DESIGN.md#binding-ui-system-rules) without exceptions: minimal Svelte/shadcn-svelte, Bits UI for necessary custom interactions, encapsulated modules/components, external CSS, fixed system tokens, `app.css` ≤100 physical lines, simple public `ui.ts` scripts, KISS/YAGNI. Test every UI change in a real browser, capture screenshots and have an independent subagent inspect them; resolve findings before acceptance.

## Implementation coordination

- Follow PLAN's [example-first gate](PLAN.md#example-first-delivery-gate): freeze four or five asserted public scripts per expansion phase before runtime work. Preserve accepted syntax/expectations; fix implementations, never weaken examples. Clean public API design takes priority over implementation convenience.
- The coordinator orchestrates sequencing, integration and evidence; scoped subagents or implementation threads perform implementation. Preserve concurrent work.
- Use Antigravity `gemini-4-argon` for independent substantial design/transfer reviews. Confirm provider/model availability; never substitute silently. Record findings/responses separately from independent approval.
- Consult `gpt-6-astra` with high reasoning only for deep logical analysis, never routine implementation/review.
