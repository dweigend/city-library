/** Execute the unchanged frozen Muscle tail separately after Blood's blocked assertion. */
import { resolve } from "node:path";
const path = "examples/selected-biology/03-homeostasis-and-exercise.ts";
const source = await Bun.file(path).text();
const start = source.indexOf("const tissue = muscle(");
if (start < 0) throw new Error("Frozen Muscle section is missing.");
const imports = `import assert from "node:assert/strict";\nimport { create as muscle } from ${JSON.stringify(resolve("experiments/muscle-development/model.ts"))};\n`;
const compiled = new Bun.Transpiler({ loader: "ts" }).transformSync(imports + source.slice(start));
await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
console.log("Unchanged frozen Muscle tail passed separately; full script03 remains blocked.");
