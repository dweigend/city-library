import { describe, expect, test } from "bun:test";
import { create as ecosystem } from "../models/crispr-ecosystem/model.ts";
import { create as epidemic } from "../models/epidem-basic/model.ts";
import { create as travel } from "../models/epidem-travel-and-control/model.ts";
import { create as geneSwitch } from "../models/genevo-1-genetic-switch/model.ts";
import {
  create as synthesis,
  complementaryMRNABase,
  mrnaStringFromDNAString,
  whichProteinForThisCodon,
} from "../models/dna-protein-synthesis/model.ts";

describe("B09 source mechanisms and exact public boundaries", () => {
  test("epiDEM Basic excludes same patch, uses neighbor patches, and recovers the infected snapshot only", () => {
    const model = epidemic({
      seed: 3,
      initialPeople: 50,
      infectionChance: 100,
      averageRecoveryTime: 1,
      recoveryChance: 100,
    });
    const [source, sameField, adjacent] = model.world.agents as unknown as {
      infected: boolean;
      cured: boolean;
      susceptible: boolean;
      infectionLength: number;
      recoveryTime: number;
      move(options: { to: { x: number; y: number } }): void;
    }[];
    for (const person of model.world.agents as unknown as {
      infected: boolean;
      cured: boolean;
    }[]) {
      person.infected = false;
      person.cured = true;
    }
    source!.infected = true;
    source!.cured = false;
    source!.move({ to: { x: 0, y: 0 } });
    sameField!.cured = false;
    sameField!.move({ to: { x: 0, y: 0 } });
    adjacent!.cured = false;
    adjacent!.move({ to: { x: 1, y: 0 } });
    model.infect(model.world.agents[0] as Parameters<typeof model.infect>[0]);
    expect(sameField!.infected).toBe(false);
    expect(adjacent!.infected).toBe(true);
    source!.infectionLength = 1;
    source!.recoveryTime = 1;
    model.maybeRecover(
      model.world.agents[0] as Parameters<typeof model.maybeRecover>[0],
    );
    expect(source!.cured).toBe(true);
    expect(source!.infected).toBe(false);
  });

  test("epiDEM controlled recovery terminates before future ticks and snapshots are detached", () => {
    const model = epidemic({
      seed: 22,
      initialPeople: 200,
      infectionChance: 0,
      recoveryChance: 100,
      averageRecoveryTime: 1,
    });
    const count = model.read().infectedCount;
    expect(count).toBeGreaterThan(0);
    model.advance(20);
    expect(model.read().infectedCount).toBe(0);
    expect(model.read().curedCount).toBe(count);
    expect(model.read().tick).toBeLessThanOrEqual(4);
    const before = model.read();
    model.read().agents.splice(0);
    expect(model.read()).toEqual(before);
    model.advance();
    expect(model.read().tick).toBe(before.tick);
    expect(() => model.advance(-1)).toThrow(RangeError);
  });

  test("travel source all-inoculated logarithm error retains phase state and zero tick", () => {
    const model = travel({
      seed: 51,
      initialPeople: 100,
      initialAmbulance: 2,
      infectionChance: 0,
      recoveryChance: 100,
      averageRecoveryTime: 1,
      inoculationChance: 100,
    });
    expect(model.read().agents.filter((p) => p.ambulance)).toHaveLength(2);
    expect(model.read().agents.filter((p) => p.susceptible)).toHaveLength(0);
    expect(() => model.advance()).toThrow("Source R0 logarithm");
    expect(model.read().tick).toBe(0);
    expect(model.read().agents).toHaveLength(102);
  });

  test("travel static contacts use canonical people and ambulances join afterward", () => {
    const model = travel({
      seed: 5,
      edges: true,
      initialPeople: 100,
      initialAmbulance: 4,
    });
    const ids = new Set(
      model
        .read()
        .agents.filter((p) => !p.ambulance)
        .map((p) => p.id),
    );
    for (const edge of model.graph.edges) {
      expect(ids.has(edge.from.id)).toBe(true);
      expect(ids.has(edge.to.id)).toBe(true);
      expect(model.world.agents.includes(edge.from)).toBe(true);
      expect(model.world.agents.includes(edge.to)).toBe(true);
    }
    const person = model.world.agents[0] as Parameters<
      typeof model.hospitalize
    >[0];
    model.hospitalize(person);
    expect(person.hospitalized).toBe(true);
    expect(person.y).toBe(0);
    expect(Math.abs(person.x)).toBe(6);
    model.unisolate(person);
    expect(person.hospitalized).toBe(false);
  });

  test("CRISPR extinction stops without food or clock mutations; active food stays bounded", () => {
    const stopped = ecosystem({ initialBacteria: 10, initialViruses: 0 });
    const food = stopped.read().cells.map((f) => f.foodEnergy);
    stopped.advance(10);
    expect(stopped.read().tick).toBe(0);
    expect(stopped.read().stopped).toBe(true);
    expect(stopped.read().cells.map((f) => f.foodEnergy)).toEqual(food);
    const active = ecosystem({
      seed: 43,
      initialBacteria: 20,
      initialViruses: 20,
      infectionChance: 0,
    });
    active.advance(4);
    expect(active.read().tick).toBe(4);
    expect(
      active
        .read()
        .cells.every((f) => f.foodEnergy >= 0 && f.foodEnergy <= 100),
    ).toBe(true);
  });

  test("CRISPR replication kills canonical host and creates nineteen children plus parent", () => {
    const model = ecosystem({ seed: 9, initialBacteria: 1, initialViruses: 1 });
    const host = model.world.agents.find(
      (p) => "breed" in p && p.breed === "bacterium",
    ) as Parameters<typeof model.replicate>[1];
    const virus = model.world.agents.find(
      (p) => "breed" in p && p.breed === "virus",
    ) as Parameters<typeof model.replicate>[0];
    model.replicate(virus, host);
    expect(host.alive).toBe(false);
    expect(model.read().bacteriaCount).toBe(0);
    expect(model.read().virusCount).toBe(20);
    expect(
      model
        .read()
        .agents.filter((p) => p.breed === "virus")
        .every((p) => p.x === virus.x && p.y === virus.y),
    ).toBe(true);
  });

  test("GenEvo energy accounting, synthesis cost and division follow explicit source thresholds", () => {
    const model = geneSwitch({
      seed: 32,
      rnapNumber: 0,
      lacINumber: 1,
      lactose: false,
      glucose: false,
    });
    model.advance(10);
    expect(model.read().energy).toBeCloseTo(999.9, 9);
    model.setParameters({ glucose: true });
    model.advance();
    expect(model.read().energy).toBeCloseTo(1009.89, 9);
    model.synthesizeProteins();
    expect(model.read().energy).toBeCloseTo(909.89, 9);
    expect(model.read().lacYCount).toBe(5);
    expect(model.read().lacZCount).toBe(5);
    model.divideCell();
    expect(model.read().energy).toBeCloseTo(454.945, 9);
    expect(model.read().divisionNumber).toBe(1);
  });

  test("GenEvo natural glucose growth divides and dead-energy stop does not tick", () => {
    const model = geneSwitch({
      seed: 1,
      rnapNumber: 0,
      lacINumber: 1,
      lactose: false,
      glucose: true,
    });
    model.advance(102);
    expect(model.read().divisionNumber).toBe(1);
    expect(model.read().tick).toBe(102);
    const dying = geneSwitch({
      seed: 1,
      rnapNumber: 0,
      lacINumber: 1,
      lactose: false,
      glucose: false,
    });
    dying.setInitialVariables([
      "#976939",
      0.001,
      0,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
    ]);
    dying.setParameters({ levelSpace: false });
    dying.advance();
    expect(dying.read().stopped).toBe(true);
    expect(dying.read().tick).toBe(0);
    expect(dying.read().energy).toBeLessThan(0);
    expect(dying.read().message).toContain("dead");
  });

  test("DNA source complement, overlapping starts and stop exclusion remain explicit", () => {
    expect(mrnaStringFromDNAString("ATGC")).toBe("UACG");
    expect(complementaryMRNABase("U")).toBe("A");
    expect(complementaryMRNABase("x")).toBe("");
    expect(whichProteinForThisCodon("AUG")).toBe("Met");
    expect(() => whichProteinForThisCodon("ATG")).toThrow(RangeError);
    const short = synthesis({ initialDNAString: "1 short gene" });
    expect(short.read().originalGenes.map((p) => p.code)).toEqual(["ATGTGG"]);
    const nested = synthesis({ initialDNAString: "2 nested genes" });
    expect(nested.read().originalGenes).toHaveLength(2);
  });

  test("DNA event gates, complete translation and unique protein retention across replication", () => {
    const model = synthesis({ seed: 52, initialDNAString: "1 short gene" });
    model.translate("original");
    model.releaseProtein("original");
    model.advance();
    expect(model.read().proteins).toHaveLength(0);
    model.transcribe("original");
    model.advance();
    model.releaseMRNA("original");
    model.advance(40);
    expect(model.read().mrnas.every((p) => p.released)).toBe(true);
    model.translate("original");
    model.advance();
    model.releaseProtein("original");
    model.advance();
    expect(model.read().proteins.map((p) => p.value)).toEqual(["-Met-Trp"]);
    model.setParameters({ mutationType: "insertion", nucleotidesAffected: 1 });
    model.replicateDNA();
    expect(model.read().duplicateDNAString).toHaveLength(13);
    expect(model.read().proteins).toHaveLength(1);
    const before = model.read();
    model.read().originalGenes.splice(0);
    model.read().agents.splice(0);
    expect(model.read()).toEqual(before);
  });

  test("DNA no-gene instructions and source mutation bounds remain observable", () => {
    const model = synthesis({ initialDNAString: "no genes (short strand)" });
    model.transcribe("original");
    model.advance();
    expect(model.read().message).toContain("no genes");
    expect(model.read().originalGenes).toHaveLength(0);
    model.nextInstruction();
    expect(model.read().currentInstruction).toBe(2);
    model.previousInstruction();
    expect(model.read().currentInstruction).toBe(1);
    const empty = synthesis({
      initialDNAString: "from user-created-code",
      userCreatedCode: "",
    });
    expect(() => empty.replicateDNA()).toThrow(RangeError);
    expect(empty.read().tick).toBe(0);
  });
});
