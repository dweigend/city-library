# Workplace and Household Membership

How do you keep track of who lives where and works where? Residents, households and workplaces are nodes in one network. Every resident has exactly one household link and one workplace link. Each step moves one resident, in turn, to the other workplace; you can also call `reassign` for a specific resident. Residents keep their identity through every move.

## Use

Choose **Workplace and Household Membership** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/workplace-household-membership/model.ts";

const town = create({ residentCount: 6 });
town.advance(1);
const { membershipCount, workplaceAMemberCount } = town.read();
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `residentCount` | `6` | integer; ≥ 2; ≤ 20 | Number of residents |

## Actions and observations

`advance()` reassigns the next resident; `reassign(index)` moves a chosen resident. `read()` reports `membershipCount`, member counts for household A and workplace A, the residents, the network `nodes` and `edges` and a bounded `history`.

## Sources and limits

An original City Library teaching model with invented numbers. The [scenario description](../../docs/execution-studies/models.md) lists its assumptions, units and asserted behavior; the mechanism checks are in [spatial-models.test.ts](../../tests/spatial-models.test.ts) and [social-projection.test.ts](../../tests/social-projection.test.ts). Passing them shows that the mechanism works as described, not that the model describes real demographics.
