# Documentation

Start with the task you want to do. [PLAN](../PLAN.md) owns current progress and acceptance; historical reports describe their recorded checkpoint, not every later change.

| Task | Start here |
| --- | --- |
| Run an experiment | [Agent Lab](../ui/agent-lab/README.md) |
| Write or understand a model | [Model authoring](development/model-authoring.md) |
| Bind controls and views | [UI specification](ui/README.md), [API table](ui/api-table.md), [reference](ui/api-reference.md) |
| Understand ownership and dependencies | [System architecture](ARCHITECTURE.md) |
| Change UI components or styling | [UI design](DESIGN.md) |
| Look up domain contracts | [Agent Loom](agent-loom/README.md), [API reference](agent-loom/api-reference.md), [terminology](agent-loom/terminology.md) |
| Review delivered work | [Consolidation report](development/consolidation-report.md), [coverage inventory](development/coverage.md) |
| Review model comparison requirements | [Model acceptance](development/netlogo-model-acceptance.md), [catalog progress](../experiments/catalog/progress-summary.json) |

## Evidence and history

The consolidation report links integration checks, donor records and unresolved acceptance gates. Per-model evidence must distinguish headless behavior, source comparison, browser behavior and independent review. A screenshot or a passing build establishes only the behavior it actually checks.

The original four-model Lab replacement is recorded in [refactor evidence](development/agent-lab-evidence.md); its source adaptations are described in [reference provenance](development/netlogo-reference-sources.md). Older slice assignments remain useful historical records. Use current commands and priorities from the Lab guide and PLAN rather than treating old status prose as today's defaults.
