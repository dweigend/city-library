import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "../../..");
const baseline = "43dd95076d6b8b9e0df7adc904a024cf0209255d";
const oldTag = "nw-web", newTag = "nw-web-topology/1";
const cache = `${process.env.HOME}/.bun/install/cache`;
const formatter = `${cache}/@biomejs/cli-linux-x64@2.6.4@@@1/biome`;
const parser = `${cache}/monaco-editor@0.56.0@@@1/esm/vs/languages/features/typescript/lib/typescriptServices.js`;
const { typescript: ts } = await import(parser);
const sha = (value: string | Uint8Array) => createHash("sha256").update(value).digest("hex");
const folder = "examples/nw-generator-variants-proposal";
const paths = [...new Bun.Glob("*.ts").scanSync(resolve(root, folder))].sort().map(file => `${folder}/${file}`);
assert.equal(paths.length, 5);

function tokens(text: string) {
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard, text);
  const result: { kind: number; text: string; pos: number; end: number }[] = [];
  const templates: number[] = [];
  for (let kind = scanner.scan(); kind !== ts.SyntaxKind.EndOfFileToken; kind = scanner.scan()) {
    if (kind === ts.SyntaxKind.TemplateHead) templates.push(0);
    else if (templates.length && kind === ts.SyntaxKind.OpenBraceToken) templates[templates.length - 1]!++;
    else if (templates.length && kind === ts.SyntaxKind.CloseBraceToken) {
      if (templates.at(-1) === 0) {
        kind = scanner.reScanTemplateToken(false);
        if (kind === ts.SyntaxKind.TemplateTail) templates.pop();
      } else templates[templates.length - 1]!--;
    }
    if (kind === ts.SyntaxKind.WhitespaceTrivia || kind === ts.SyntaxKind.NewLineTrivia) continue;
    result.push({ kind, text: scanner.getTokenText(), pos: scanner.getTokenPos(), end: scanner.getTextPos() });
  }
  return result;
}
function normalizedAST(text: string, path: string) {
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  assert.equal(source.parseDiagnostics.length, 0);
  function visit(node: any): unknown {
    const children: unknown[] = [];
    ts.forEachChild(node, (child: any) => { children.push(visit(child)); });
    const literal = ts.isStringLiteral(node) && (node.text === oldTag || node.text === newTag);
    return {
      kind: ts.SyntaxKind[node.kind],
      operator: node.operator,
      isTypeOnly: node.isTypeOnly,
      leaf: children.length ? undefined : literal ? "<profile-tag>" : node.getText(source),
      children,
    };
  }
  return JSON.stringify(visit(source));
}

const rows = [];
const prepared: { path: string; text: string }[] = [];
for (const path of paths) {
  const original = Bun.spawnSync(["git", "show", `${baseline}:${path}`], { cwd: root });
  assert.equal(original.exitCode, 0);
  const before = original.stdout.toString(), current = await Bun.file(resolve(root, path)).text();
  const expected = before.replaceAll(`"${oldTag}"`, `"${newTag}"`);
  let after = current;
  if (process.argv.includes("--write")) {
    assert.equal(current, before, `Refuse to overwrite concurrent edits: ${path}`);
    const formatted = Bun.spawnSync([formatter, "format", "--stdin-file-path", path, "--indent-style=space", "--indent-width=2", "--line-width=100", "--trailing-commas=none", "--arrow-parentheses=as-needed", "--quote-properties=preserve"], { cwd: root, stdin: Buffer.from(expected) });
    assert.equal(formatted.exitCode, 0, formatted.stderr.toString());
    after = formatted.stdout.toString();
    // Preserve original punctuation too: Biome may remove optional trailing
    // commas or add optional trailing type-member semicolons when wrapping.
    const wanted = tokens(expected), actual = tokens(after);
    const edits: { pos: number; end: number; text: string }[] = [];
    const closing = new Set([ts.SyntaxKind.CloseBraceToken, ts.SyntaxKind.CloseBracketToken, ts.SyntaxKind.CloseParenToken]);
    let i = 0, j = 0;
    const same = (a: typeof wanted[number] | undefined, b: typeof wanted[number] | undefined) => a?.kind === b?.kind && a?.text === b?.text;
    while (i < wanted.length || j < actual.length) {
      if (same(wanted[i], actual[j])) { i++; j++; continue; }
      if (wanted[i]?.kind === ts.SyntaxKind.CommaToken && closing.has(wanted[i + 1]?.kind) && same(wanted[i + 1], actual[j])) {
        edits.push({ pos: actual[j - 1]!.end, end: actual[j - 1]!.end, text: "," }); i++; continue;
      }
      if (actual[j]?.kind === ts.SyntaxKind.SemicolonToken && closing.has(actual[j + 1]?.kind) && same(wanted[i], actual[j + 1])) {
        edits.push({ pos: actual[j]!.pos, end: actual[j]!.end, text: "" }); j++; continue;
      }
      throw new Error(`Unexpected formatter token change in ${path}: ${JSON.stringify({ wanted: wanted[i], actual: actual[j] })}`);
    }
    for (const edit of edits.sort((a, b) => b.pos - a.pos)) after = after.slice(0, edit.pos) + edit.text + after.slice(edit.end);
  }
  const beforeAST = normalizedAST(before, path), afterAST = normalizedAST(after, path);
  assert.equal(afterAST, beforeAST, `Normalized AST changed in ${path}`);
  const expectedTokens = tokens(expected).map(({ kind, text }) => [kind, text]);
  const afterTokens = tokens(after).map(({ kind, text }) => [kind, text]);
  assert.deepEqual(afterTokens, expectedTokens, `Non-whitespace/comment/token change in ${path}`);
  const tagChanges = before.split(`"${oldTag}"`).length - 1;
  assert.equal(after.split(`"${oldTag}"`).length - 1, 0);
  assert.equal(after.split(`"${newTag}"`).length - 1, tagChanges);
  rows.push({ path, tagChanges, beforeSHA256: sha(before), afterSHA256: sha(after), normalizedASTSHA256: sha(beforeAST), beforeAfterNormalizedASTEqual: true, exactNonWhitespaceTokensAndCommentsMatchAfterTagReplacement: true, beforeLines: before.trimEnd().split("\n").length, afterLines: after.trimEnd().split("\n").length });
  prepared.push({ path, text: after });
}
if (process.argv.includes("--write")) for (const item of prepared) await Bun.write(resolve(root, item.path), item.text);
const result = { status: "passed", scope: "Formatting and explicit profile-tag replacement only; not API freeze/runtime acceptance", baselineCommit: baseline, formatter: { name: "Biome", version: "2.6.4", sha256: sha(new Uint8Array(await Bun.file(formatter).arrayBuffer())) }, parser: { name: "Existing cached Monaco TypeScript services", version: ts.version }, files: rows };
await Bun.write(resolve(import.meta.dir, "comparison.json"), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify({ status: result.status, files: rows.length, tagChanges: rows.reduce((sum, row) => sum + row.tagChanges, 0), normalizedASTsEqual: true, exactTokensAndCommentsPreservedExceptTag: true }));
