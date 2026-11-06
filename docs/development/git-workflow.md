# Git delivery workflow

These rules apply to City Library task delivery. Preserve concurrent work and the example-first delivery history. A scoped implementation request does not by itself authorize publication or merging; use the user's existing authorization for the requested delivery actions. Once commit/push/PR delivery is authorized, complete it without introducing another approval gate for those ordinary actions.

## Branches and ownership

- `main` changes through pull requests only. Merge into `main` requires explicit user approval for that merge; implementation or delivery authorization is not merge approval.
- Use a temporary integration branch to combine accepted task work. It is a staging point, not a replacement for `main` or permission to merge into it.
- Parallel implementation uses an owned task branch and worktree with a bounded assignment. Inspect branch/status and existing ownership before editing; preserve other owners' changes.
- Name task branches `feat/<topic>`, `fix/<topic>` or `docs/<topic>` according to scope. Keep commits atomic and write commit messages and repository content in English.
- Integrate with normal merges that preserve the example-first commits and their ordering. Do not squash away that evidence or rewrite shared history. Never force-push a shared branch.

## Deliver the requested scope

A delivered change is committed, pushed to its intended remote branch and represented by an up-to-date PR with an accurate title, description and validation record. Link each created, taken-over or pushed PR in T3 immediately using the full PR URL (`link_pull_request`, or `link_pull_requests` for a stack). Every stack layer must be linked. If linking fails, report the failure rather than claiming complete delivery.

Run meaningful checks for the change, including the project's required TypeScript/public-consumer and real-browser checks when applicable. Record only executed results and their limits. Before handoff, verify the branch, working-tree status, remote head and PR head/status; identify remaining local or concurrent work and pending checks/reviews. Do not claim delivery when a required commit, push, PR update or link is missing. Report concrete blockers and complete the authorized parts that remain possible.

This workflow does not grant broad automatic merge permission. Merging task work into an integration branch must stay within the coordinator's authorized integration scope. Do not merge into `main` without explicit user approval.

## Cleanup

Remove a task branch/worktree only after its required payload and evidence are integrated and verified, its checkout is clean, and its owner confirms there is no active task binding or resource that requires it. Preserve concurrent or unintegrated work. Follow the established consolidation/archive procedure where needed; cleanup is not a substitute for delivery.

## Enforced checks and local tooling

GitHub's active `Protect main delivery` ruleset requires PRs, resolved review conversations and the GitHub Actions checks `Library checks` and `Svelte build` against an up-to-date base. Force pushes and deletion of main are blocked. The approval count is zero for this individually maintained repository; agent review reports are not GitHub human approvals. The explicit user-authorization rule for merging still applies. Repository merges preserve commits; automatic branch deletion stays disabled to protect active T3 bindings.

The versioned `t3.json` defines a worktree default and Setup/Check/UI build actions. T3 project settings currently mirror these actions, use worktrees for new threads and keep automatic pull off; explicit project overrides take precedence over repository defaults. Worktree setup uses the frozen lockfile. Project Codex configuration lives in `.codex/config.toml`; Git policy remains here and in AGENTS.md, and the delivery skill lives in `.agents/skills/git-delivery/`. No credentials or machine-specific paths belong in those files.

Local repository Git settings use `pull.ff=only` and `push.default=simple`. These settings are not cloned with Git; configure them for each new clone if needed. Do not weaken conflicts or force-push to make delivery succeed.
