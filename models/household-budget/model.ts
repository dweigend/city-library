import { Agent, World, run } from "city-library";
import type { Definition } from "../definition.ts";
import { stepCount } from "../parameters.ts";

/** Exogenous income and rent form an open monthly flow, not a closed economy. */
export function create() {
  const household = Agent.add({ balance: 1000, income: 2400, rent: 900 });
  const world = World.add();
  world.add(household);

  function settleMonth() {
    household.balance += household.income - household.rent;
  }

  return {
    household, world,
    advance(months = 1) {
      stepCount(months);
      run(world, settleMonth, months);
    },
    read() {
      return { tick: world.tick.value, balance: household.balance, income: household.income, rent: household.rent };
    },
  };
}

export const model = {
  title: "Household Budget",
  description: "Monthly external income and rent change one household's balance.",
  inputs: {}, create,
} satisfies Definition<Record<string, never>, ReturnType<typeof create>>;
