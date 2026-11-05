import { Agent, Random, type RandomState } from "city-library";

function typeContracts() {
  const random = Random.add();
  const person = Agent.add({ energy: 1 });
  const selected = random.sample([person], { weight: (agent) => agent.energy });
  const energy: number = selected[0]!.energy;
  const checkpoint: RandomState = random.state;
  random.state = checkpoint;
  const copied: RandomState = random.copy().state;
  const value: number = random.local(() => random.number({ min: 1, max: 3, integer: true }));
  // @ts-expect-error State metadata is readonly to callers.
  checkpoint.seed = 9;
  // @ts-expect-error Algorithm is immutable.
  random.algorithm = "other";
  // @ts-expect-error Deferred entropy construction is not advertised.
  Random.add({ seed: "random" });
  // @ts-expect-error Deferred distribution overload is not advertised.
  random.number({ distribution: "normal" });
  // @ts-expect-error Deferred raw variants are not advertised.
  random.raw({ kind: "int32" });
  return [energy, copied, value];
}
void typeContracts;
