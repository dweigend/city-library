/** Stonedahl & Wilensky (2009), CC BY-NC-SA 3.0. Exact source/notices adjacent. */
import { Agent, Graph, Random, World, run, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  networkChoice: "Example 1" | "Example 2" | "Preferential Attachment";
  calculationMethod: "diffusion" | "random-surfer";
  dampingFactor: number;
  numberOfSurfers: number;
  watchSurfers: boolean;
  showPageRanks: boolean;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  networkChoice: {
    kind: "choice",
    default: "Example 1",
    options: ["Example 1", "Example 2", "Preferential Attachment"],
  },
  calculationMethod: {
    kind: "choice",
    default: "random-surfer",
    options: ["diffusion", "random-surfer"],
  },
  dampingFactor: { kind: "number", default: 0.85, min: 0, max: 1, step: 0.01 },
  numberOfSurfers: {
    kind: "number",
    default: 5,
    min: 1,
    max: 100,
    integer: true,
  },
  watchSurfers: { kind: "boolean", default: true },
  showPageRanks: { kind: "boolean", default: true },
};
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed }),
    world = World.add({ x: 21, y: 21, boundary: "hard" }, { random });
  type Page = Agent<{
    kind: "page";
    who: number;
    rank: number;
    newRank: number;
    visits: number;
    color: string;
  }>;
  type Surfer = Agent<{
    kind: "surfer";
    who: number;
    currentPage: Page | null;
    color: string;
  }>;
  const graph = Graph.add<Page, { traveledBy: number | null; color: string }>({
    edgeState: { traveledBy: null, color: "#8a8a8a" },
    selfLoops: true,
  });
  let nextWho = 0;
  const pages = () => [...graph.nodes],
    surfers = () =>
      world.agents.filter(
        (a) => (a as Page | Surfer).kind === "surfer",
      ) as Surfer[];
  const colors = [
    "#3975bc",
    "#d74343",
    "#e68a26",
    "#47a66a",
    "#d6b342",
    "#47a66a",
    "#9b67c4",
  ];
  function addPage(id: number) {
    const p = world.add(
      Agent.add(
        {
          kind: "page" as const,
          who: id,
          rank: 0,
          newRank: 0,
          visits: 0,
          color: colors[id] ?? "#9b67c4",
        },
        {
          position: {
            x: 21 * random.number() - 10.5,
            y: 21 * random.number() - 10.5,
          },
        },
      ),
    );
    graph.nodes.add(p);
    nextWho = Math.max(nextWho, id + 1);
    return p;
  }
  function addSurfer(currentPage: Page) {
    const p = world.add(
      Agent.add({
        kind: "surfer" as const,
        who: nextWho++,
        currentPage: null as Page | null,
        color: colors[Math.floor(random.number() * colors.length)]!,
      }),
    );
    p.currentPage = currentPage;
    return p;
  }
  function link(a: Page, b: Page) {
    graph.edges.add({ from: a, to: b, directed: true });
  }
  function createNetwork() {
    const ps: Array<Page | undefined> = [];
    if (settings.networkChoice === "Example 1") {
      for (let i = 0; i < 11; i++) ps[i] = addPage(i);
      const incoming: [[number, number[]], ...[number, number[]][]] = [
        [0, [3]],
        [1, [2, 3, 4, 5, 6, 7, 8]],
        [2, [1]],
        [3, [4]],
        [4, [5, 6, 7, 8, 9, 10]],
        [5, [4]],
      ];
      for (const [to, froms] of incoming)
        for (const from of froms) link(ps[from]!, ps[to]!);
    } else if (settings.networkChoice === "Example 2") {
      for (let i = 1; i <= 7; i++) ps[i] = addPage(i);
      const incoming: [[number, number[]], ...[number, number[]][]] = [
        [1, [2, 3, 5, 6]],
        [2, [1, 3, 4]],
        [3, [1, 4, 5]],
        [4, [1, 5]],
        [5, [1, 4, 6, 7]],
        [6, [5]],
        [7, [1]],
      ];
      for (const [to, froms] of incoming)
        for (const from of froms) link(ps[from]!, ps[to]!);
    } else {
      for (let i = 0; i < 100; i++) ps[i] = addPage(i);
      let pool = [ps[0]!, ps[1]!];
      for (const neighbor of pool) {
        if (random.number() < 0.5) link(ps[2]!, neighbor);
        else link(neighbor, ps[2]!);
      }
      pool = [ps[2]!, ps[2]!, ...pool];
      for (let i = 3; i < 100; i++) {
        let available = [...pool];
        for (let j = 0; j < 2; j++) {
          const neighbor = random.sample(available)[0]!;
          available = available.filter((n) => n !== neighbor);
          pool.unshift(neighbor);
          if (random.number() < 0.5) link(ps[i]!, neighbor);
          else link(neighbor, ps[i]!);
        }
        pool = [ps[i]!, ps[i]!, ...pool];
      }
    }
    for (const p of pages()) p.rank = 1 / graph.nodes.size;
  }
  createNetwork();
  const history: {
    tick: number;
    totalRank: number;
    maxRank: number;
    visits: number;
  }[] = [];
  function globals() {
    const summary = stats.describe(pages().map((p) => p.rank));
    return { totalRank: summary.sum, maxRank: summary.max! };
  }
  function record() {
    history.push({
      tick: world.tick.value,
      ...globals(),
      visits: pages().reduce((s, p) => s + p.visits, 0),
    });
    if (history.length > 1001) history.shift();
  }
  function diffuse() {
    for (const s of surfers()) s.delete();
    const ps = pages();
    for (const p of ps) p.newRank = 0;
    for (const p of random.sample(ps, { count: ps.length })) {
      const outgoing = graph.neighbors(p, { direction: "out" }),
        destinations = outgoing.length ? outgoing : ps;
      const share = p.rank / destinations.length;
      for (const target of destinations) target.newRank += share;
    }
    for (const p of ps)
      p.rank =
        (1 - settings.dampingFactor) / ps.length +
        settings.dampingFactor * p.newRank;
  }
  function surf() {
    const ps = pages();
    let ss = surfers();
    if (ss.length < settings.numberOfSurfers)
      for (let i = ss.length; i < settings.numberOfSurfers; i++)
        addSurfer(random.sample(ps)[0]!);
    ss = surfers();
    if (ss.length > settings.numberOfSurfers)
      for (const s of random.sample(ss, {
        count: ss.length - settings.numberOfSurfers,
      }))
        s.delete();
    for (const s of random.sample(surfers(), { count: surfers().length })) {
      const old = s.currentPage!;
      old.visits++;
      const draw = random.number(),
        outgoing = graph.neighbors(old, { direction: "out" });
      s.currentPage = random.sample(
        draw <= settings.dampingFactor && outgoing.length ? outgoing : ps,
      )[0]!;
      if (settings.watchSurfers) {
        const edge = graph.edges.between(old, s.currentPage, {
          direction: "out",
        })[0];
        if (edge) {
          edge.traveledBy = s.who;
          edge.color = s.color;
        }
      }
    }
    const total = ps.reduce((sum, p) => sum + p.visits, 0);
    for (const p of ps) p.rank = p.visits / total;
  }
  function go() {
    for (const e of graph.edges) {
      e.traveledBy = null;
      e.color = "#8a8a8a";
    }
    if (settings.calculationMethod === "diffusion") diffuse();
    else surf();
  }
  record();
  return {
    diffuse,
    surf,
    globals,
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        run(world, go);
        record();
      }
    },
    setParameters(patch: Partial<Omit<Parameters, "seed" | "networkChoice">>) {
      parameters(inputs, patch);
      if (Object.hasOwn(patch, "seed") || Object.hasOwn(patch, "networkChoice"))
        throw new TypeError("Network and seed are setup-only.");
      settings = parameters(inputs, { ...settings, ...patch });
    },
    setScenario(s: {
      pages: readonly { id: number; rank: number; visits?: number }[];
      edges: readonly { from: number; to: number }[];
      surfers?: readonly { currentPage: number }[];
    }) {
      if (
        !Array.isArray(s.pages) ||
        s.pages.length === 0 ||
        s.pages.some(
          (p) =>
            !Number.isSafeInteger(p.id) ||
            p.id < 0 ||
            !Number.isFinite(p.rank) ||
            p.rank < 0 ||
            (p.visits !== undefined &&
              (!Number.isSafeInteger(p.visits) || p.visits < 0)),
        ) ||
        new Set(s.pages.map((p) => p.id)).size !== s.pages.length ||
        s.pages.reduce((sum, p) => sum + p.rank, 0) <= 0
      )
        throw new RangeError(
          "Unique page ids, finite nonnegative ranks and integer visits required.",
        );
      const ids = new Set(s.pages.map((p) => p.id));
      if (
        !Array.isArray(s.edges) ||
        s.edges.some((e) => !ids.has(e.from) || !ids.has(e.to)) ||
        new Set(s.edges.map((e) => e.from + ":" + e.to)).size !==
          s.edges.length ||
        s.surfers?.some((p) => !ids.has(p.currentPage))
      )
        throw new RangeError(
          "Edges and surfers must reference scenario pages.",
        );
      graph.delete();
      for (const a of [...world.agents]) a.delete();
      nextWho = 0;
      const byId = new Map<number, Page>();
      for (const value of s.pages) {
        const p = addPage(value.id);
        p.rank = value.rank;
        p.visits = value.visits ?? 0;
        byId.set(value.id, p);
      }
      for (const e of s.edges) link(byId.get(e.from)!, byId.get(e.to)!);
      for (const value of s.surfers ?? [])
        addSurfer(byId.get(value.currentPage)!);
    },
    read() {
      const g = globals(),
        ss = surfers();
      return Object.freeze({
        tick: world.tick.value,
        parameters: settings,
        randomState: random.state,
        ...g,
        pages: Object.freeze(
          pages().map((p) =>
            Object.freeze({
              id: p.who,
              rank: p.rank,
              newRank: p.newRank,
              visits: p.visits,
              color: p.color,
              x: p.x,
              y: p.y,
              size: 0.2 + 4 * Math.sqrt(p.rank / g.totalRank),
              surferCount: ss.filter((s) => s.currentPage === p).length,
            }),
          ),
        ),
        edges: Object.freeze(
          [...graph.edges].map((e) =>
            Object.freeze({
              id: `${e.from.who}-${e.to.who}`,
              from: e.from.who,
              to: e.to.who,
              color: e.color,
              traveledBy: e.traveledBy,
            }),
          ),
        ),
        surfers: Object.freeze(
          ss.map((s) =>
            Object.freeze({
              id: s.who,
              currentPage: s.currentPage!.who,
              color: s.color,
            }),
          ),
        ),
        history: Object.freeze(history.map((h) => Object.freeze({ ...h }))),
      });
    },
  };
}
export const model = {
  title: "PageRank",
  description:
    "Directed rank diffusion and cumulative random-surfer visits. Stonedahl & Wilensky (2009), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
