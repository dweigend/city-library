/** Repressilator 1D (Wilensky, 2020). Source phases retained; see NOTICE.md. */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface RepressilatorParameters {
  seed: number;
  initialTF0s: number;
  initialTF1s: number;
  initialTF2s: number;
  tfsPerMRNA: number;
  maxTFSynergy: number;
  mrnaDecayProb: number;
  tfBindProb: number;
  tfUnbindProb: number;
  tfDecayProb: number;
  signalTFBindProb: number;
  signalTFUnbindProb: number;
  signalDecayProb: number;
}
export const inputs: Inputs<RepressilatorParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  initialTF0s: { kind: "number", default: 0, min: 0, max: 200, integer: true },
  initialTF1s: { kind: "number", default: 0, min: 0, max: 200, integer: true },
  initialTF2s: { kind: "number", default: 0, min: 0, max: 200, integer: true },
  tfsPerMRNA: { kind: "number", default: 2, min: 0, max: 10 },
  maxTFSynergy: { kind: "number", default: 4, min: 0, max: 4 },
  mrnaDecayProb: { kind: "number", default: 0.25, min: 0, max: 1 },
  tfBindProb: { kind: "number", default: 0.975, min: 0, max: 1 },
  tfUnbindProb: { kind: "number", default: 0.355, min: 0, max: 1 },
  tfDecayProb: { kind: "number", default: 0.1, min: 0, max: 1 },
  signalTFBindProb: { kind: "number", default: 0.75, min: 0, max: 1 },
  signalTFUnbindProb: { kind: "number", default: 0.1, min: 0, max: 1 },
  signalDecayProb: { kind: "number", default: 0.2, min: 0, max: 1 },
};
type Molecule = Agent<{
  breed: "tf" | "mrna";
  geneId: number;
  inhibitsGeneId: number;
  age: number;
  bound: boolean;
  boundToSignal: boolean;
}>;
export function create(options: Partial<RepressilatorParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const space = { x: 3, y: 1, boundary: "wrap" } as const;
  const world = World.add(space, { random });
  const grid = Grid.add(space, {
    state: { geneId: 0, inhibitedByGeneId: 0, inhibited: false },
  });
  world.add(grid);
  for (const field of grid.fields) {
    field.geneId = field.x + 1;
    field.inhibitedByGeneId = getTFDNAIsInhibitedBy(field.geneId);
  }
  const signal = world.add(
    Agent.add(
      { bound: false, on: true, wasOn: true, intervalStart: 0 },
      { position: { x: 1.425, y: -0.39 } },
    ),
  );
  let completedSignalOnLength = 0;
  let completedSignalOffLength = 0;
  const signalOnLengths: number[] = [];
  const signalOffLengths: number[] = [];
  const history: {
    tick: number;
    tf0: number;
    tf1: number;
    tf2: number;
    mrna0: number;
    mrna1: number;
    mrna2: number;
    signal: number;
  }[] = [];
  const molecules = () =>
    (world.agents as readonly Molecule[]).filter(
      (agent) => agent.id !== signal.id,
    );
  const tfs = () => molecules().filter((agent) => agent.breed === "tf");
  const mrnas = () => molecules().filter((agent) => agent.breed === "mrna");
  const shuffled = <T>(values: readonly T[]) =>
    random.sample(values, {
      count: values.length,
      compatibility: "legacy-shuffle",
    });
  const integer = (upper: number) =>
    random.number({ min: 0, max: upper, integer: true });
  const colors = ["#b97143", "#a586d2", "#4c9f86"];
  function getDNATFInhibits(geneId: number) {
    return (geneId + 1) % 3;
  }
  function getTFDNAIsInhibitedBy(geneId: number) {
    return (geneId + 2) % 3;
  }
  function countOtherMRNAsSamePatch(molecule: Molecule) {
    return mrnas().filter(
      (other) =>
        other !== molecule && grid.fieldAt(other) === grid.fieldAt(molecule),
    ).length;
  }
  function countOtherTFsSameColorSamePatch(molecule: Molecule) {
    return tfs().filter(
      (other) =>
        other !== molecule &&
        other.geneId === molecule.geneId &&
        grid.fieldAt(other) === grid.fieldAt(molecule),
    ).length;
  }
  function setTFPosition(tf: Molecule) {
    const field = grid.fieldAt(tf)!;
    const columnWidth = 1 / 3 - 0.075;
    const x =
      field.x +
      (field.geneId - 1) / 3 +
      random.number() * columnWidth -
      0.5 * columnWidth;
    const y = 0.305 - ((countOtherTFsSameColorSamePatch(tf) * 0.075) % 0.63);
    tf.move({ to: { x, y } });
  }
  function initializeTF(geneId: number, x: number, y: number) {
    const tf = world.add(
      Agent.add(
        {
          breed: "tf" as const,
          geneId,
          inhibitsGeneId: getDNATFInhibits(geneId),
          age: 0,
          bound: false,
          boundToSignal: false,
        },
        { position: { x, y }, orientation: { heading: 0 } },
      ),
    );
    setTFPosition(tf);
    return tf;
  }
  function initializeMRNA(geneId: number) {
    const molecule = world.add(
      Agent.add(
        {
          breed: "mrna" as const,
          geneId,
          inhibitsGeneId: 0,
          age: 0,
          bound: false,
          boundToSignal: false,
        },
        {
          position: { x: geneId - 1, y: 0 },
          orientation: { heading: -45 + integer(90) },
        },
      ),
    );
    const x =
      geneId - 1.425 + ((countOtherMRNAsSamePatch(molecule) * 0.24) % 0.85);
    molecule.move({ to: { x, y: 0.38 + random.number() * 0.045 } });
    return molecule;
  }
  function tfCanInhibitGeneHere(tf: Molecule) {
    return tf.inhibitsGeneId === grid.fieldAt(tf)!.geneId;
  }
  function tfCanBindGeneHere(tf: Molecule) {
    return (
      !tf.bound && !grid.fieldAt(tf)!.inhibited && tfCanInhibitGeneHere(tf)
    );
  }
  function tfCanBindSignal(tf: Molecule) {
    return !signal.bound && !tf.bound && tf.geneId === 2;
  }
  function bindTF(tf: Molecule) {
    if (tfCanBindGeneHere(tf)) {
      tf.bound = true;
      const field = grid.fieldAt(tf)!;
      field.inhibited = true;
      tf.move({ to: { x: field.x - 0.3, y: -0.4 } });
      tf.rotate(-tf.heading);
    }
  }
  function bindTFToSignal(tf: Molecule) {
    if (tfCanBindSignal(tf)) {
      tf.boundToSignal = true;
      signal.bound = true;
      tf.move({ to: { x: signal.x, y: signal.y } });
      tf.rotate(-tf.heading);
    }
  }
  function unbindTF(tf: Molecule) {
    if (tf.bound) {
      tf.bound = false;
      grid.fieldAt(tf)!.inhibited = false;
      setTFPosition(tf);
    }
  }
  function unbindTFFromSignal(tf: Molecule) {
    if (tf.boundToSignal) {
      tf.boundToSignal = false;
      signal.bound = false;
      setTFPosition(tf);
    }
  }
  function bindTFs() {
    for (const tf of shuffled(tfs().filter(tfCanBindGeneHere))) {
      const denominator = Math.max(
        settings.maxTFSynergy,
        countOtherTFsSameColorSamePatch(tf),
      );
      if (denominator === 0)
        throw new RangeError("Source division by zero in TF binding synergy.");
      if (random.number() < settings.tfBindProb ** (1 / denominator))
        bindTF(tf);
    }
    for (const tf of shuffled(tfs().filter(tfCanBindSignal)))
      if (random.number() < settings.signalTFBindProb) bindTFToSignal(tf);
  }
  function moveTFs() {
    for (const tf of shuffled(
      tfs().filter((tf) => !tf.bound && !tf.boundToSignal),
    )) {
      tf.move({ to: { x: tf.x + integer(3), y: tf.y } });
      tf.rotate(-45 + integer(90) - tf.heading);
    }
  }
  function unbindTFs() {
    for (const tf of shuffled(tfs().filter((tf) => tf.bound)))
      if (random.number() < settings.tfUnbindProb) unbindTF(tf);
    for (const tf of shuffled(tfs().filter((tf) => tf.boundToSignal)))
      if (random.number() < settings.signalTFUnbindProb) unbindTFFromSignal(tf);
  }
  function degradeTFs() {
    for (const tf of shuffled(tfs()))
      if (random.number() < settings.tfDecayProb) {
        unbindTF(tf);
        unbindTFFromSignal(tf);
        tf.delete();
      }
  }
  function degradeMRNAs() {
    for (const molecule of shuffled(mrnas()))
      if (random.number() < settings.mrnaDecayProb) molecule.delete();
  }
  function nMRNAsProduced() {
    return random.number({ distribution: "poisson", mean: 1 });
  }
  function nTFsProduced() {
    return random.number({
      distribution: "poisson",
      mean: settings.tfsPerMRNA,
    });
  }
  function produceMRNAs() {
    for (const gene of shuffled(
      grid.fields.filter((field) => !field.inhibited),
    )) {
      const count = nMRNAsProduced();
      for (let index = 0; index < count; index++) initializeMRNA(gene.geneId);
    }
  }
  function produceTFs() {
    for (const molecule of shuffled(mrnas())) {
      const count = nTFsProduced();
      for (let index = 0; index < count; index++)
        initializeTF(grid.fieldAt(molecule)!.geneId, molecule.x, molecule.y);
    }
  }
  function shouldSignalBeOn() {
    return (
      !signal.bound ||
      (signal.on && random.number() < 1 - settings.signalDecayProb)
    );
  }
  function updateSignal() {
    if (world.tick.value > 0) signal.wasOn = signal.on;
    signal.on = shouldSignalBeOn();
    if (world.tick.value === 0) signal.wasOn = signal.on;
    completedSignalOnLength = 0;
    completedSignalOffLength = 0;
    if (signal.wasOn && !signal.on) {
      completedSignalOnLength = world.tick.value - signal.intervalStart;
      signal.intervalStart = world.tick.value;
      signalOnLengths.push(completedSignalOnLength);
    }
    if (!signal.wasOn && signal.on) {
      completedSignalOffLength = world.tick.value - signal.intervalStart;
      signal.intervalStart = world.tick.value;
      signalOffLengths.push(completedSignalOffLength);
    }
  }
  function meanOnDuration() {
    return signalOnLengths.length
      ? signalOnLengths.reduce((sum, length) => sum + length, 0) /
          signalOnLengths.length
      : 0;
  }
  function meanOffDuration() {
    return signalOffLengths.length
      ? signalOffLengths.reduce((sum, length) => sum + length, 0) /
          signalOffLengths.length
      : 0;
  }
  function harmonicMean(a: number, b: number) {
    return a + b > 0 ? (2 * a * b) / (a + b) : 0;
  }
  function onOffHarmonicMean() {
    return harmonicMean(meanOnDuration(), meanOffDuration());
  }
  function onOffOptimFcn22() {
    if (signalOffLengths.length < 20) return 0;
    if (meanOnDuration() < 2 || meanOffDuration() < 2)
      return Math.min(meanOnDuration(), meanOffDuration());
    return onOffHarmonicMean();
  }
  function onOffOptimFcn1() {
    return meanOnDuration() < 2 || meanOffDuration() < 2
      ? 0
      : onOffHarmonicMean();
  }
  function record() {
    const tfCounts = [0, 1, 2].map(
      (geneId) => tfs().filter((tf) => tf.geneId === geneId).length,
    );
    const mrnaCounts = [0, 1, 2].map(
      (geneId) =>
        mrnas().filter((molecule) => molecule.geneId === geneId).length,
    );
    history.push({
      tick: world.tick.value,
      tf0: tfCounts[0]!,
      tf1: tfCounts[1]!,
      tf2: tfCounts[2]!,
      mrna0: mrnaCounts[0]!,
      mrna1: mrnaCounts[1]!,
      mrna2: mrnaCounts[2]!,
      signal: Number(signal.on),
    });
    if (history.length > 2001) history.shift();
  }
  function go() {
    run(
      world,
      () => {
        bindTFs();
        moveTFs();
        unbindTFs();
        degradeTFs();
        degradeMRNAs();
        for (const tf of shuffled(tfs())) tf.age++;
        produceMRNAs();
        produceTFs();
        updateSignal();
      },
      1,
    );
    record();
  }
  function advance(count = 1) {
    stepCount(count);
    for (let index = 0; index < count; index++) go();
  }
  function setParameters(
    update: Partial<
      Omit<
        RepressilatorParameters,
        "seed" | "initialTF0s" | "initialTF1s" | "initialTF2s"
      >
    >,
  ) {
    if (
      Object.keys(update).some((key) =>
        ["seed", "initialTF0s", "initialTF1s", "initialTF2s"].includes(key),
      )
    )
      throw new TypeError("Setup parameters require a new model.");
    settings = parameters(inputs, { ...settings, ...update });
  }
  function read() {
    return {
      tick: world.tick.value,
      width: 3,
      height: 1,
      parameters: { ...settings },
      stopped: false,
      tfCounts: [0, 1, 2].map(
        (geneId) => tfs().filter((tf) => tf.geneId === geneId).length,
      ),
      mrnaCounts: [0, 1, 2].map(
        (geneId) =>
          mrnas().filter((molecule) => molecule.geneId === geneId).length,
      ),
      genes: grid.fields.map((field) => ({
        id: field.id,
        geneId: field.geneId,
        inhibitedByGeneId: field.inhibitedByGeneId,
        inhibited: field.inhibited,
        x: field.x,
        y: field.y,
        color: colors[field.geneId]!,
      })),
      agents: [
        ...molecules().map((molecule) => ({
          id: molecule.id,
          breed: molecule.breed as string,
          geneId: molecule.geneId,
          x: molecule.x,
          y: molecule.y,
          heading: molecule.heading,
          age: molecule.age,
          bound: molecule.bound,
          boundToSignal: molecule.boundToSignal,
          size: molecule.bound ? 0.1 : 0.15,
          color: colors[molecule.geneId]!,
        })),
        {
          id: signal.id,
          breed: "signal",
          geneId: 2,
          x: signal.x,
          y: signal.y,
          heading: 0,
          age: 0,
          bound: signal.bound,
          boundToSignal: false,
          size: 0.1,
          color: signal.on ? "#73bd25" : "#111111",
        },
      ],
      signalOn: signal.on,
      signalBound: signal.bound,
      completedSignalOnLength,
      completedSignalOffLength,
      signalOnLengths: [...signalOnLengths],
      signalOffLengths: [...signalOffLengths],
      meanOnDuration: meanOnDuration(),
      meanOffDuration: meanOffDuration(),
      onOffHarmonicMean: onOffHarmonicMean(),
      history: history.map((point) => ({ ...point })),
    };
  }
  for (const [geneId, count] of [
    settings.initialTF0s,
    settings.initialTF1s,
    settings.initialTF2s,
  ].entries())
    for (let index = 0; index < count; index++)
      initializeTF(geneId, geneId - 1, 0);
  record();
  return {
    read,
    advance,
    go,
    setParameters,
    initializeTF,
    initializeMRNA,
    setTFPosition,
    bindTFs,
    bindTF,
    bindTFToSignal,
    moveTFs,
    unbindTFs,
    unbindTF,
    unbindTFFromSignal,
    degradeTFs,
    degradeMRNAs,
    produceMRNAs,
    produceTFs,
    updateSignal,
    shouldSignalBeOn,
    tfCanBindGeneHere,
    tfCanBindSignal,
    tfCanInhibitGeneHere,
    getDNATFInhibits,
    getTFDNAIsInhibitedBy,
    countOtherMRNAsSamePatch,
    countOtherTFsSameColorSamePatch,
    nMRNAsProduced,
    nTFsProduced,
    meanOnDuration,
    meanOffDuration,
    harmonicMean,
    onOffHarmonicMean,
    onOffOptimFcn22,
    onOffOptimFcn1,
  };
}
export const model: Definition<
  RepressilatorParameters,
  ReturnType<typeof create>
> = {
  title: "Repressilator 1D",
  description:
    "Cyclic transcription-factor inhibition and a stochastic molecular signal.",
  inputs,
  create,
};
