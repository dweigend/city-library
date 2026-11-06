---
name: git-delivery
description: Deliver authorized City Library changes through owned branches, commits, pushes and linked pull requests, or reconcile an incomplete delivery handoff. Use for Git delivery requests, not ordinary read-only code review.
---

# Git delivery

Read [the project Git workflow](../../../docs/development/git-workflow.md) before delivery. It owns branch/ownership rules, preserved example-first history, verification, PR linking and cleanup.

Determine the requested scope and existing authorization from the conversation. A scoped request does not create extra publication or merge authority. When commit/push/PR delivery is already authorized, carry it through without adding approval gates for those actions. Explicit user approval remains required to merge into `main`.

Inspect branch/status and preserve concurrent work. Run the meaningful checks required for the change, deliver the authorized commit/push/PR updates, link every affected PR in T3 immediately, and verify local/remote/PR state before reporting completion. Report missing actions or blockers precisely. Do not rewrite shared history or clean up another owner's active worktree.
