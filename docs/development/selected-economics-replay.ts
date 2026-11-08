/** Public-entry replay evidence; this records observations and does not replace frozen assertions. */
import { create as fruitWars } from "../../experiments/fruit-wars/model.ts";
import { create as orderBook } from "../../experiments/limited-order-book/model.ts";
import { create as biddingMarket } from "../../experiments/bidding-market/model.ts";
import { create as hotelling } from "../../experiments/hotellings-law/model.ts";
import { create as braess } from "../../experiments/braess-paradox/model.ts";
import { create as cashFlow } from "../../experiments/cash-flow/model.ts";
import { create as bankReserves } from "../../experiments/bank-reserves/model.ts";
import { create as basic } from "../../experiments/prisoners-dilemma-basic/model.ts";
import { create as iterated } from "../../experiments/prisoners-dilemma-two-person-iterated/model.ts";
import { create as elFarol } from "../../experiments/el-farol/model.ts";

interface Instance {
  advance(count: number): void;
  read(): unknown;
}
const scenarios: readonly {
  slug: string;
  create: () => Instance;
  steps: number;
}[] = [
  { slug: "fruit-wars", create: fruitWars, steps: 20 },
  { slug: "limited-order-book", create: orderBook, steps: 10 },
  { slug: "bidding-market", create: biddingMarket, steps: 100 },
  { slug: "hotellings-law", create: hotelling, steps: 10 },
  { slug: "braess-paradox", create: braess, steps: 800 },
  { slug: "cash-flow", create: cashFlow, steps: 30 },
  { slug: "bank-reserves", create: bankReserves, steps: 30 },
  { slug: "prisoners-dilemma-basic", create: basic, steps: 1 },
  {
    slug: "prisoners-dilemma-two-person-iterated",
    create: iterated,
    steps: 12,
  },
  { slug: "el-farol", create: elFarol, steps: 12 },
];

function observation(value: unknown) {
  const snapshot = value as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(snapshot)) {
    if (Array.isArray(item)) {
      result[`${key}Count`] = item.length;
      if (key === "stores" || key === "history" || key === "plotHistory") {
        result[key] = key === "stores" ? item : item.slice(-1);
      }
    } else if (key !== "aggressionHistograms") {
      result[key] = item;
    }
  }
  return result;
}

for (const scenario of scenarios) {
  const instance = scenario.create();
  const setup = observation(instance.read());
  instance.advance(scenario.steps);
  const progress = observation(instance.read());
  console.log(
    JSON.stringify({
      slug: scenario.slug,
      steps: scenario.steps,
      setup,
      progress,
    }),
  );
}
