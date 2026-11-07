# Branch cleanup — 7 November 2026

GitHub now has two branches: `main` and `experiment/netlogo-web-catalog`. The thirteen superseded donor PRs were closed without merging, and their remote branches were deleted atomically with explicit expected-head leases. PR #4 remains the integration PR. No merge into main was performed.

Every deleted head remains available on GitHub through its existing `archive/20261106-consolidation-01/*` tag. Two independent read-only subagents verified those exact heads against the consolidation evidence and checked preservation before cleanup. The [operation record](branch-cleanup-20261107.json) records the refs, hashes and PR numbers.

The three local branches and worktrees remain: `main`, the integration branch and the bound coordination branch. The coordination owner still needs its worktree. Both main heads and all sixteen pre-existing main WIP files were verified unchanged.

## Archived donor branches

| Deleted branch | Closed PR | Published archive tag |
| --- | --- | --- |
| `experiment/planar-contains-bounds` | #33 | `archive/20261106-consolidation-01/experiment-planar-contains-bounds` |
| `experiment/selected-biology-b07` | #30 | `archive/20261106-consolidation-01/experiment-selected-biology-b07` |
| `experiment/selected-cellular-b19` | #14 | `archive/20261106-consolidation-01/experiment-selected-cellular-b19` |
| `experiment/selected-computing-b18` | #16 | `archive/20261106-consolidation-01/experiment-selected-computing-b18` |
| `experiment/selected-disease-gene-b09` | #35 | `archive/20261106-consolidation-01/experiment-selected-disease-gene-b09` |
| `experiment/selected-ecology-b06` | #18 | `archive/20261106-consolidation-01/experiment-selected-ecology-b06` |
| `experiment/selected-economics-b03` | #26 | `archive/20261106-consolidation-01/experiment-selected-economics-b03` |
| `experiment/selected-evolution-b08` | #31 | `archive/20261106-consolidation-01/experiment-selected-evolution-b08` |
| `experiment/selected-grid-batch` | #6 | `archive/20261106-consolidation-01/experiment-selected-grid-batch` |
| `experiment/selected-materials-b11` | #23 | `archive/20261106-consolidation-01/experiment-selected-materials-b11` |
| `experiment/selected-probability-b17` | #11 | `archive/20261106-consolidation-01/experiment-selected-probability-b17` |
| `experiment/selected-social-b02` | #22 | `archive/20261106-consolidation-01/experiment-selected-social-b02` |
| `experiment/selected-transport-b04` | #27 | `archive/20261106-consolidation-01/experiment-selected-transport-b04` |

## Verification and limits

Remote branch refs, archive heads and closed/unmerged PR states were read back from GitHub. Local main and WIP hashes were checked again after deletion. This operation changes Git references and records evidence; no runtime or browser tests were needed or run. The existing scientific, documentation and pre-main acceptance gates still apply. Historical consolidation reports describe their original checkpoints.
