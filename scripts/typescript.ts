import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const mode = Bun.argv[2];
if (!["declarations", "city-targets", "giant-component-targets", "targets"].includes(mode ?? "")) {
  throw new Error("Choose declarations, city-targets, giant-component-targets or targets.");
}

const files: string[] = [];
if (mode === "declarations") files.push("index.ts");
if (mode === "city-targets" || mode === "targets") {
  files.push("tests/targets/city-simulation/03-generative-quarter.ts");
}
if (mode === "giant-component-targets" || mode === "targets") {
  files.push(...new Bun.Glob("tests/targets/giant-component/*.ts").scanSync("."));
}

// TypeScript cannot combine --project with explicit entry files. This transient
// selection inherits every check from the sole maintained configuration.
const directory = await mkdtemp(join(process.cwd(), ".typescript-"));
try {
  const config = join(directory, "tsconfig.json");
  await writeFile(config, JSON.stringify({
    extends: resolve("tsconfig.json"),
    files: files.map(file => resolve(file)),
    include: [],
    exclude: [],
    ...(mode === "declarations" ? { compilerOptions: {
      noEmit: false,
      declaration: true,
      emitDeclarationOnly: true,
      rootDir: resolve("."),
      outDir: resolve("dist/types"),
      lib: ["ESNext"],
      types: [],
    } } : {}),
  }));
  const child = Bun.spawn(["node_modules/.bin/tsc", "-p", config], {
    stdout: "inherit", stderr: "inherit",
  });
  process.exitCode = await child.exited;
} finally {
  await rm(directory, { recursive: true, force: true });
}
