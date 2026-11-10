/** NetLogo Tumor (Wilensky, 1998). Complete notices: NOTICE.md. */
import { Agent, Random, World, geometry, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface TumorParameters {
  seed: number;
  leaveTrail: boolean;
}
export const inputs: Inputs<TumorParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  leaveTrail: { kind: "boolean", default: true },
};
type Cell = Agent<{
  who: number;
  stem: boolean;
  age: number;
  metastatic: boolean;
  color: string;
  penDown: boolean;
}>;
export function create(options: Partial<TumorParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 103, y: 103, boundary: "hard" } as const;
  const world = World.create(space, { random });
  const cells = () => world.agents as readonly Cell[];
  let nextWho = 0;
  let cellCount = 2;
  let stopped = false;
  const trails: {
    from: { x: number; y: number };
    to: { x: number; y: number };
    color: string;
  }[] = [];
  const history: { tick: number; cellCount: number }[] = [];

  function forwardCell(cell: Cell, amount: number) {
    let remaining = amount;
    // Source fd attempts one unit at a time and abandons the remaining
    // distance at a hard edge. Public normalization owns boundary geometry.
    while (Math.abs(remaining) > 1e-12) {
      const distance = Math.sign(remaining) * Math.min(1, Math.abs(remaining));
      const direction = geometry.direction({ heading: cell.heading });
      const target = geometry.normalize(
        {
          x: cell.x + direction.x * distance,
          y: cell.y + direction.y * distance,
        },
        { space, endpoints: "half-open" },
      );
      if (!target) break;
      const from = { x: cell.x, y: cell.y };
      cell.move(distance);
      if (cell.penDown)
        trails.push({ from, to: { x: cell.x, y: cell.y }, color: cell.color });
      remaining -= distance;
    }
  }
  function hatch(parent: Cell) {
    const child = parent.copy();
    child.who = nextWho++;
    world.add(child);
    return child;
  }
  function setStem() {
    for (let index = 0; index < 2; index++) {
      const cell = Agent.create(
        {
          who: nextWho++,
          stem: true,
          age: 0,
          metastatic: index === 1,
          color: "#235ad0",
          penDown: false,
        },
        {
          position: { x: -25.5, y: 0 },
          orientation: {
            heading: random.number({ min: 0, max: 360, integer: true }),
          },
        },
      );
      world.add(cell);
      if (index === 1) cell.rotate(90 - cell.heading);
    }
  }
  function moveTransitionalCells(cell: Cell) {
    if (cell.stem) return;
    // Preserve source age-dependent shade as a detached source model color below.
    cell.color = cell.age < 20 ? "#d84b4b" : "#f3dcdc";
    forwardCell(cell, 1);
    if (cell.age < 6) {
      const child = hatch(cell);
      child.rotate(random.number() * 360);
      forwardCell(child, 1);
    }
  }
  function mitosis(cell: Cell) {
    if (!cell.stem) return;
    const child = hatch(cell);
    forwardCell(child, 1);
    child.color = "#d84b4b";
    child.stem = false;
    // Source tests the newborn who, so the who=1 branch is unreachable.
    child.age = child.who === 1 ? 16 : 0;
  }
  function death(cell: Cell) {
    if (
      !cell.stem &&
      ((!cell.metastatic && cell.age > 20) || (cell.metastatic && cell.age > 4))
    )
      cell.delete();
  }
  function evaluateParams() {
    cellCount = cells().length;
    stopped = cellCount <= 0;
  }
  function go() {
    for (const cell of random.sample(cells(), {
      count: cells().length,
      algorithm: "fisher-yates-descending",
    })) {
      cell.penDown = settings.leaveTrail;
      if (cell.who === 1 && cell.x < 25) forwardCell(cell, 1);
      cell.age++;
      moveTransitionalCells(cell);
      mitosis(cell);
      death(cell);
    }
  }
  function advance(count = 1) {
    stepCount(count);
    for (let index = 0; index < count; index++) {
      // evaluate-params is after tick, so an emptied model completes one go.
      if (stopped) break;
      run(world, go);
      evaluateParams();
      history.push({ tick: world.tick.value, cellCount });
      if (history.length > 1001) history.splice(1, 1);
    }
  }
  function killOriginalStemCell() {
    cells()
      .find((cell) => cell.who === 0)
      ?.delete();
  }
  function killMovingStemCell() {
    cells()
      .find((cell) => cell.who === 1)
      ?.delete();
  }
  function killTransitoryCells() {
    for (const cell of cells().filter((cell) => !cell.stem && cell.age < 10))
      cell.delete();
  }
  function setParameters(update: Partial<Pick<TumorParameters, "leaveTrail">>) {
    if (Object.keys(update).some((key) => key !== "leaveTrail"))
      throw new TypeError("Only leaveTrail is live.");
    settings = parameters(inputs, { ...settings, ...update });
  }
  function read() {
    return {
      tick: world.tick.value,
      width: 103,
      height: 103,
      parameters: { ...settings },
      cellCount,
      stopped,
      cells: cells().map((cell) => ({
        id: cell.id,
        who: cell.who,
        x: cell.x,
        y: cell.y,
        heading: cell.heading,
        stem: cell.stem,
        age: cell.age,
        metastatic: cell.metastatic,
        color: cell.color,
        indexedColor: cell.stem ? 105 : 15 + 0.25 * cell.age,
        size: 2,
      })),
      trails: trails.map((segment) => ({
        ...segment,
        from: { ...segment.from },
        to: { ...segment.to },
      })),
      history: history.map((point) => ({ ...point })),
    };
  }
  setStem();
  history.push({ tick: 0, cellCount });
  return {
    advance,
    read,
    setParameters,
    setStem,
    forwardCell,
    moveTransitionalCells,
    mitosis,
    death,
    evaluateParams,
    killOriginalStemCell,
    killMovingStemCell,
    killTransitoryCells,
    go,
  };
}
export const model = { title: "Tumor", inputs, create } satisfies Definition<
  TumorParameters,
  ReturnType<typeof create>
>;
