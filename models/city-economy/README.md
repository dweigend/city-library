# Urban Employment

A city's firms sell partly to outside customers and partly to their own workers. When outside orders fall, jobs go, local spending drops and more jobs go. This model shows that spiral and asks a second question: does the recovery take as long as the decline when firms fire fast but hire slowly? One step is one month; all amounts are synthetic.

## The mechanism

Thirty households and three firms. Each month:

1. Orders = outside orders + what employed households planned to spend (40 % of last month's wage).
2. Firms want one job per 10 units of orders. Above that target they dismiss workers at once; below it each firm hires at most `hiringLimit` people per month.
3. Firms can only sell what their workers produce. Orders they cannot serve are lost.
4. Wages go to the employed, who plan next month's spending.

Total cash only changes by what outside customers pay, so the money balance can be checked every month.

One demand-feedback loop and asymmetric employment adjustment produce a multiplier and slow recovery. This model does not establish a tipping point. The [scientific sources dossier](../../docs/scientific-sources.md) records the reference and adaptation limits.

```ts
import { model } from "./model.ts";

const city = model.create();
city.setExternalDemand(30);
city.advance(6);
console.log(city.read().employedCount); // 5, down from 15
city.setExternalDemand(90);
city.advance(5);
console.log(city.read().cumulativeLostOrders); // 52
```

## What to try

- **Demand shock:** lower *Outside orders* from 90 to 30 for six months, then restore it. Employment falls from 15 to 5 within four months, more than the outside loss alone because local spending falls too. With one hire per firm and month, the recovery takes five months and 48 orders go unserved during recovery. Including the four lost during the shock, the cumulative total is 52.
- **Faster hiring:** repeat with *Hires per firm per month* at 10. The decline is identical, but the recovery takes four months and loses only 6 orders.
- Raise *Spending fraction* in setup to see a stronger multiplier. Above 0.5 whole jobs can stop the adjustment one or two jobs early (see the contract).

## What you see

- **Firms and households:** each firm's filled slots are workers, amber outlines open vacancies. Households are colored by employer; gray outlines are unemployed. The bottom line shows next month's orders.
- **Employment and desired jobs:** employment is drawn on top; where only its line is visible, both are equal.
- **Hiring gap:** open vacancies (desired minus employed jobs) at the end of each month; with fast hiring the bars stay at zero.
- **Orders, sales and lost orders:** per completed month; the setup month has no flows.

## Limits

No prices, stock, savings choices, credit or bankruptcy. Firms may go into debt. Households cannot move away or find work outside the city.

See the [contract](contract.md) for exact rules and expected values and the [evidence](evidence/checks.md) for executed checks and revision history. Public scripts: `tests/public-contracts/city-economy/`.
