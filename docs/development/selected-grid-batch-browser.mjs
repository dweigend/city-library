/** Optional author browser check. Uses an externally installed Playwright; no package dependency. */
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const { chromium } = await import(process.env.CITY_LIBRARY_PLAYWRIGHT_PATH ?? "playwright");
const browser = await chromium.launch({
  executablePath: process.env.CITY_LIBRARY_CHROMIUM_PATH,
  headless: true,
  args: ["--no-sandbox"],
});
const evidence = new URL("./selected-grid-batch-evidence/", import.meta.url);
const observations = { browser: browser.version(), errors: [], gestures: [] };
async function initialize(page) {
  page.on("pageerror", error => observations.errors.push(error.message));
  await page.goto("http://localhost:3111/?experiment=life");
  await page.locator('input[name="width"]').fill("5");
  await page.locator('input[name="height"]').fill("5");
  await page.locator('select[name="initialization"]').selectOption("blank");
  await page.getByRole("button", { name: "Setup", exact: true }).click();
  await page.getByRole("button", { name: "Draw cells", exact: true }).click();
}
async function values(page) {
  return page.locator(".monitors").evaluate(element => {
    const items = [...element.children].map(node => node.textContent);
    return Object.fromEntries(items.filter((_, i) => i % 2 === 0).map((key, i) => [key, Number(items[i * 2 + 1])]));
  });
}
async function point(page, x, y) {
  const canvas = page.locator("canvas.world");
  await canvas.scrollIntoViewIfNeeded();
  const rect = await canvas.boundingBox();
  return { x: rect.x + (x + 2.5) / 5 * rect.width, y: rect.y + (2.5 - y) / 5 * rect.height };
}
try {
  const desktop = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
  const page = await desktop.newPage();
  await initialize(page);
  const a = await point(page, 0, 0), b = await point(page, 1, 0), c = await point(page, 2, 0);
  await page.mouse.move(a.x, a.y); await page.mouse.down();
  await page.mouse.move(b.x, b.y, { steps: 6 }); await page.mouse.move(c.x, c.y, { steps: 6 });
  await page.mouse.move(b.x, b.y, { steps: 6 }); await page.mouse.up();
  assert.equal((await values(page)).Living, 3);
  observations.gestures.push({ device: "mouse", action: "paint across living cell without toggling", ...(await values(page)) });
  await page.screenshot({ path: new URL("life-target-trusted-paint.png", evidence).pathname });
  await page.mouse.move(c.x, c.y); await page.mouse.down();
  await page.mouse.move(a.x, a.y, { steps: 12 }); await page.mouse.up();
  assert.equal((await values(page)).Living, 0);
  observations.gestures.push({ device: "mouse", action: "erase entire stroke", ...(await values(page)) });
  await page.mouse.move(a.x, a.y); await page.mouse.down();
  await page.mouse.move(a.x, a.y - 500, { steps: 12 }); await page.mouse.up();
  const afterRelease = (await values(page)).Living;
  await page.mouse.move(c.x, c.y, { steps: 12 });
  assert.equal((await values(page)).Living, afterRelease);
  observations.gestures.push({ device: "mouse", action: "release outside canvas ends gesture", ...(await values(page)) });
  await page.getByRole("button", { name: "Setup", exact: true }).click();
  await page.getByRole("button", { name: "Draw cells", exact: true }).click();
  await page.locator("canvas.world").focus();
  await page.keyboard.press("Home"); await page.keyboard.press("Enter");
  await page.keyboard.press("ArrowRight"); await page.keyboard.press("Space");
  assert.equal((await values(page)).Living, 2);
  assert.equal((await values(page)).Tick, 0);
  await page.locator('input[name="live-foreground"]').fill("#00ff00");
  await page.locator('input[name="live-foreground"]').dispatchEvent("change");
  const pixel = () => page.locator("canvas.world").evaluate(canvas => [...canvas.getContext("2d").getImageData(canvas.width * .1, canvas.height * .9, 1, 1).data]);
  assert.deepEqual(await pixel(), [102, 15, 64, 255]);
  await page.getByRole("button", { name: "Recolor", exact: true }).click();
  assert.deepEqual(await pixel(), [0, 255, 0, 255]);
  observations.gestures.push({ device: "keyboard", action: "Home Enter ArrowRight Space plus delayed recolor", ...(await values(page)) });
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true, colorScheme: "dark" });
  const touchPage = await mobile.newPage();
  await initialize(touchPage);

  const start = await point(touchPage, 0, 0), end = await point(touchPage, 2, 0);
  const cdp = await mobile.newCDPSession(touchPage);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: start.x, y: start.y }] });
  for (let i = 1; i <= 12; i++) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: start.x + (end.x - start.x) * i / 12, y: start.y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  assert.equal((await values(touchPage)).Living, 3);
  observations.gestures.push({ device: "touch", action: "trusted touch stroke", ...(await values(touchPage)) });
  await touchPage.screenshot({ path: new URL("life-target-trusted-touch.png", evidence).pathname, fullPage: true });
  await cdp.detach();
  const tapPage = await mobile.newPage();
  await initialize(tapPage);
  const tapPoint = await point(tapPage, 0, 0);
  await tapPage.touchscreen.tap(tapPoint.x, tapPoint.y);
  assert.equal((await values(tapPage)).Living, 1);
  await tapPage.getByRole("button", { name: "Toggle selected cell", exact: true }).tap();
  assert.equal((await values(tapPage)).Living, 0);
  observations.gestures.push({ device: "touch", action: "tap alternative changes selected cell in fresh touch page", ...(await values(tapPage)) });
  assert.deepEqual(observations.errors, []);
  console.log(JSON.stringify(observations, null, 2));
  await writeFile(new URL("trusted-interactions.json", evidence), JSON.stringify(observations, null, 2) + "\n");
} finally { await browser.close(); }
