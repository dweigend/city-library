# Working instructions

- Discuss work in German; write repository content and commits in English.
- Check branch/status and preserve concurrent work. Keep README and its approved diagram stable unless the task requires changes. Never commit secrets or dependencies.
- Use [README.md](README.md) for orientation, [PLAN.md](PLAN.md) for scope, sequence and acceptance, and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for architecture, contracts and source context, plus [docs/DESIGN.md](docs/DESIGN.md) for UI design rules. Read relevant sections before changing their subject; follow their decisions rather than historical experiments. Flag unresolved contracts instead of inventing APIs.
- Use strict TypeScript and the existing Bun workflow. Build only the smallest useful capability; follow PLAN’s implementation-slice acceptance checklist, including reuse/provenance, public examples, documentation and authorized independent reviews.
- Run `bun run typecheck` for TypeScript changes and relevant behavior/public-consumer checks. Browser flows require real-browser verification. Report only executed checks; distinguish proposals, source evidence and verified target behavior when updating PLAN.
- Follow the project-wide [binding architecture rules](docs/ARCHITECTURE.md#binding-architecture-rules): keep domain logic headless and framework-independent, UI thin and separate, dependencies directed toward core contracts, and domain state under one owner. Every domain function must be accessible through a public TypeScript API; UI changes state only through defined actions/functions. Apply these constraints to every implementation slice.
- Follow the [binding domain layout and extension rules](docs/ARCHITECTURE.md#binding-domain-layout-and-extension-rules). Keep domain kernels, algorithms and variants separate; preserve the phase-one API when adding explicit variants. Prepared directories are user-requested scaffolding, not delivered modules; add source files and exports only with working slices.

- Follow the [binding UI system rules](docs/DESIGN.md#binding-ui-system-rules): minimal Svelte/shadcn-svelte UI, Bits UI only for necessary custom interactions, encapsulated modules/styles, simple public `ui.ts` authoring, one fixed token system, `app.css` at most 100 physical lines, KISS and YAGNI. Every UI change requires real-browser checks, screenshots and an independent subagent screenshot review; no exceptions.

## Implementation coordination

- Follow PLAN's [example-first delivery gate](PLAN.md#example-first-delivery-gate): write four or five asserted public example scripts per expansion phase before runtime implementation. Preserve their accepted syntax and expectations; fix implementations rather than weakening examples. Clean public API design takes priority over implementation convenience.
- Delegate runtime implementation to scoped subagents or implementation threads; the coordinating agent owns sequencing, integration and evidence. Preserve concurrent work.
- Use Antigravity `gemini-4-argon` for independent review of substantial design or transfer work. Confirm provider/model availability; do not substitute silently. Record findings and responses separately from independent approval.
- Consult `gpt-6-astra` with high reasoning only for tasks requiring deep logical analysis, not routine implementation or review.
