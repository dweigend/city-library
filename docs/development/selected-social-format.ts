/** Whitespace/readability follow-up; uses already cached tools without changing dependencies. */
import ts from "/home/david/.bun/install/cache/typescript@5.9.3@@@1/lib/typescript.js";
import prettier from "/tmp/bunx-1000-prettier@3.6.2/node_modules/prettier/index.mjs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";

const base = "eaa698aca573b0c47b3b0e93b56acee6a646decd";
const rows = await Bun.file("docs/development/selected-social-sources.json").json();
const hash = (text: string) => createHash("sha256").update(text).digest("hex");
function normalizedAST(source: string, path: string): string {
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  if (file.parseDiagnostics.length) throw new Error(`Parse failure: ${path}`);
  function visit(node: ts.Node): unknown {
    if (ts.isParenthesizedExpression(node) || ts.isParenthesizedTypeNode(node)) return visit(node.expression ?? node.type);
    const values: Record<string, unknown> = { kind: node.kind, flags: node.flags };
    for (const key of ["text", "escapedText", "operator", "isTypeOnly", "isExportEquals", "multiLine", "hasTrailingComma"]) {
      if (key === "multiLine" || key === "hasTrailingComma" || (key === "text" && ts.isSourceFile(node))) continue;
      const value = (node as unknown as Record<string, unknown>)[key];
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") values[key] = value;
    }
    values.children = [];
    ts.forEachChild(node, child => { (values.children as unknown[]).push(visit(child)); });
    return values;
  }
  return JSON.stringify(visit(file));
}
const records = [];
for (const row of rows) {
  const path = `experiments/${row.slug}/model.ts`;
  const before = execFileSync("git", ["show", `${base}:${path}`], { encoding: "utf8" });
  const after = await prettier.format(before, {
    filepath: path, parser: "typescript", printWidth: 88, tabWidth: 2,
    semi: true, singleQuote: true, trailingComma: "all",
  });
  const beforeAST = normalizedAST(before, path), afterAST = normalizedAST(after, path);
  if (beforeAST !== afterAST) { await Bun.write("/tmp/social-before-ast.json",beforeAST); await Bun.write("/tmp/social-after-ast.json",afterAST); throw new Error(`AST mismatch: ${path}`); }
  await Bun.write(path, after);
  records.push({ path, beforeSHA256: hash(before), afterSHA256: hash(after),
    normalizedASTSHA256: hash(beforeAST), normalizedASTEqual: true, formatIdempotent: after === await prettier.format(after, { filepath: path, parser: "typescript", printWidth: 88, tabWidth: 2, semi: true, singleQuote: true, trailingComma: "all" }),
    beforeLines: before.split("\n").length - 1, afterLines: after.split("\n").length - 1 });
}
await Bun.write("docs/development/selected-social-format-evidence/equivalence.json", JSON.stringify({
  base, formatter: "Prettier 3.6.2 (existing cache)", parser: "TypeScript 5.9.3 (existing cache)",
  normalization: "Ignore positions/comments/trivia, parenthesized expression/type wrappers, multiline and trailing-comma formatting metadata; retain syntax kinds, flags, names, literal values, operators, type-only/export-equals attributes and ordered children.",
  records,
}, null, 2) + "\n");
console.log(`Formatted ${records.length} models; all normalized ASTs identical.`);
