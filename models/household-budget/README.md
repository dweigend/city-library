# Household Budget

How does a steady monthly surplus add up over a year? One household starts with a balance of 1000 units, earns 2400 and pays 900 rent every month. Each step settles one month, so the balance grows by 1500 per step and reaches 1000 + 12 × 1500 = 19000 after twelve steps.

Income and rent come from outside the model, and paid rent leaves it. This is an open flow, not a closed economy that conserves money. It is an original City Library teaching model with no upstream source to match.

## Use

Choose **Household Budget** in [Model Lab](../../ui/model-lab/README.md); the monitors show month, balance, income and rent. The model has no inputs.

From a script in the repository root:

```ts
import { create } from "./models/household-budget/model.ts";

const budget = create();
budget.advance(12);
console.log(budget.read()); // { tick: 12, balance: 19000, income: 2400, rent: 900 }
```

[model.ts](model.ts) owns the state and the `advance(months)` action; [ui.ts](ui.ts) binds it to the Lab. The public contract script [01-household-budget.ts](../../tests/public-contracts/city-simulation/01-household-budget.ts) asserts the twelve-month result.
