/** Original bipartite membership teaching example; no demographic or commuting inference. */
import { Agent, Graph, World, run, measurements, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface MembershipParameters {
  residents: number;
}

export const inputs: Inputs<MembershipParameters> = {
  residents: { kind: "number", default: 6, min: 2, max: 20, integer: true },
};

export function create(options: Partial<MembershipParameters> = {}) {
  const settings = parameters(inputs, options);
  const world = World.create();
  const residents = Array.from({ length: settings.residents }, (_, index) =>
    world.add(Agent.create({ label: `Resident ${index + 1}` })),
  );
  const householdA = { id: "household-a", label: "Household A", kind: "household" };
  const householdB = { id: "household-b", label: "Household B", kind: "household" };
  const workplaceA = { id: "workplace-a", label: "Workplace A", kind: "workplace" };
  const workplaceB = { id: "workplace-b", label: "Workplace B", kind: "workplace" };
  const places = [householdA, householdB, workplaceA, workplaceB];
  type Member = (typeof residents)[number] | (typeof places)[number];
  const membership = Graph.create<Member>();
  for (const member of [...residents, ...places]) {
    membership.nodes.add(member);
  }
  residents.forEach((resident, index) => {
    const firstGroup = index % 2 === 0;
    membership.edges.add({ from: resident, to: firstGroup ? householdA : householdB });
    membership.edges.add({ from: resident, to: firstGroup ? workplaceA : workplaceB });
  });
  const measure = measurements.define((graph: typeof membership) => ({
    memberships: graph.edges.size,
    householdA: graph.neighbors(householdA).length,
    workplaceA: graph.neighbors(workplaceA).length,
  }));
  const history = storage.history({ capacity: 120 });
  function record() {
    history.add({ tick: world.tick.value, values: measure.read(membership) });
  }
  function reassignResident(residentIndex: number) {
    // Public reassign validates the index; automatic steps use modulo population.
    const resident = residents[residentIndex]!;
    const workplace = membership.neighbors(resident).find(member => "kind" in member && member.kind === "workplace");
    const next = workplace === workplaceA ? workplaceB : workplaceA;
    // Setup gives every resident one workplace edge; this rule replaces only that edge.
    const edge = [...membership.edges].find(edge => edge.from === resident && edge.to === workplace)!;
    edge.delete();
    membership.edges.add({ from: resident, to: next });
  }
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let index = 0; index < count; index += 1) {
        run(world, () => {
          reassignResident(world.tick.value % residents.length);
        });
        record();
      }
    },
    reassign(residentIndex: number) {
      if (!Number.isSafeInteger(residentIndex) || residentIndex < 0 || residentIndex >= residents.length) {
        throw new RangeError("Unknown resident index.");
      }
      reassignResident(residentIndex);
    },
    read() {
      const nodes = [...residents, ...places].map(member => Object.freeze({
        id: member.id,
        label: member.label,
        kind: "kind" in member ? member.kind : "resident",
      }));
      const people = residents.map(resident => {
        const groups = membership.neighbors(resident);
        // Only the workplace edge is replaced; the single household edge remains.
        return Object.freeze({
          id: resident.id,
          label: resident.label,
          household: groups.find(member => "kind" in member && member.kind === "household")!.label,
          workplace: groups.find(member => "kind" in member && member.kind === "workplace")!.label,
        });
      });
      return Object.freeze({
        tick: world.tick.value,
        ...measure.read(membership),
        people: Object.freeze(people),
        nodes: Object.freeze(nodes),
        edges: Object.freeze([...membership.edges].map(edge => Object.freeze({
          id: edge.id,
          from: edge.from.id,
          to: edge.to.id,
        }))),
        history: history.samples,
        done: false,
      });
    },
  };
}

export const model = {
  title: "Workplace and Household Membership",
  description: "Illustrative canonical resident/place membership in one Graph; no demographic forecast.",
  inputs,
  create,
} satisfies Definition<MembershipParameters, ReturnType<typeof create>>;
