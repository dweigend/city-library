/** Adapted from NetLogo Preferential Attachment, Uri Wilensky (2005).
 * Source commit bf0626a89358b48494066862843a91f36f2556cf; CC BY-NC-SA 3.0.
 * https://ccl.northwestern.edu/netlogo/models/PreferentialAttachment
 * Changes: typed headless composition, detached measurements, independent view layout.
 */
import { Agent, Graph, Random, World, run, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface AttachmentParameters {
  seed: number;
}
export const inputs: Inputs<AttachmentParameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
};
export function create(options: Partial<AttachmentParameters> = {}) {
  const settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const world = World.add({ random });
  const graph = Graph.add<Agent<{ label: string }>>();
  function addNode() {
    const node = Agent.add({ label: `Node ${graph.nodes.size + 1}` });
    graph.nodes.add(node);
    world.add(node);
    return node;
  }
  graph.edges.add({ from: addNode(), to: addNode() });
  let latestEdgeId = [...graph.edges][0]!.id;
  return {
    advance(count = 1) {
      stepCount(count);
      run(
        world,
        () => {
          const edge = random.sample(graph.edges)[0]!;
          const partner = random.sample([edge.from, edge.to])[0]!;
          const added = graph.edges.add({ from: addNode(), to: partner });
          latestEdgeId = added.id;
        },
        count,
      );
    },
    read() {
      const nodes = [...graph.nodes].map((node) =>
        Object.freeze({
          id: node.id,
          label: node.label,
          degree: graph.neighbors(node).length,
        }),
      );
      const edges = [...graph.edges].map((edge) =>
        Object.freeze({
          id: edge.id,
          from: edge.from.id,
          to: edge.to.id,
          latest: edge.id === latestEdgeId,
        }),
      );
      const degrees = nodes.map((node) => node.degree);
      const maximum = Math.max(...degrees);
      const histogram = stats.histogram(degrees, {
        edges: Array.from({ length: maximum + 1 }, (_, i) => i + 0.5),
      });
      const distribution = histogram.counts.map((count, index) =>
        Object.freeze({ degree: index + 1, count }),
      );
      return Object.freeze({
        tick: world.tick.value,
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: Object.freeze(nodes),
        edges: Object.freeze(edges),
        distribution: Object.freeze(distribution),
        logDistribution: Object.freeze(
          distribution
            .filter((point) => point.count > 0)
            .map((point) =>
              Object.freeze({
                x: Math.log10(point.degree),
                y: Math.log10(point.count),
              }),
            ),
        ),
        randomState: random.state,
        done: false,
      });
    },
  };
}
export const model = {
  title: "Preferential Attachment",
  description:
    "A growing network with degree-proportional attachment. Adapted from Uri Wilensky (2005), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<AttachmentParameters, ReturnType<typeof create>>;
