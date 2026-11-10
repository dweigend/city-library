import { Agent, World, run } from "city-library";
import type { Definition } from "../definition.ts";
import { validateStepCount } from "../parameters.ts";

/** Exogenous income and rent form an open monthly flow, not a closed economy. */
export function create() {
  const household = Agent.create({ balance: 1000, income: 2400, rent: 900 });
  const world = World.create();
  world.add(household);

  function settleMonth() {
    household.balance += household.income - household.rent;
  }

  return {
    household, world,
    advance(months = 1) {
      validateStepCount(months);
      run(world, settleMonth, months);
    },
    read() {
      return { tick: world.tick.value, balance: household.balance, income: household.income, rent: household.rent };
    },
  };
}

export const model = {
  title: "Household Budget",
  description: "One household's balance changes each month with income and rent.",
  inputs: {}, create,
} satisfies Definition<Record<string, never>, ReturnType<typeof create>>;
