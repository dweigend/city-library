import { expect, test } from "bun:test";
import { extract, sourceBlockers, widgetCounts } from "../models/catalog/sources.ts";

test("catalog counts only direct widgets and retains all code notice blocks", () => {
  expect(widgetCounts('<note><![CDATA[<plotfile>.pdf <plotfile>.jpg]]></note><plot><setup></setup><pen><update>plot 1</update></pen></plot><chooser><choice/></chooser><button/>')).toEqual({ note: 1, plot: 1, chooser: 1, button: 1 });
  const metadata = extract('<model><code><![CDATA[;; Copyright: 2011, J.C. Thiele\n\nto setup\nend\n\n; Public Domain:\n; To the extent possible under law, Uri Wilensky has waived all\n; copyright and related or neighboring rights to this model.]]></code><info></info><widgets></widgets></model>');
  expect(metadata.licenseNotice).toContain('J.C. Thiele');
  expect(metadata.licenseNotice).toContain('Public Domain');
  expect(metadata.licenseNotice).toContain('neighboring rights');
  expect(sourceBlockers({ extensions: ['sr'], includes: '"helpers.nls"', mechanismSignals: ['files'] })).toHaveLength(3);
  expect(sourceBlockers({ extensions: [], includes: null, mechanismSignals: ['grid'] })).toEqual([]);
});

test("capture refuses to overwrite the accepted snapshot before network access", async () => {
  const before = await Bun.file('models/catalog/inventory.json').text();
  const child = Bun.spawn(['bun', 'models/catalog/sources.ts', 'capture'], { stdout: 'pipe', stderr: 'pipe' });
  expect(await child.exited).not.toBe(0);
  expect(await new Response(child.stderr).text()).toContain('Snapshot already exists');
  expect(await Bun.file('models/catalog/inventory.json').text()).toBe(before);
});
