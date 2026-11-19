// Loads a fixture page in Chromium, with a stub for chrome.storage.
const test = require("node:test");
const assert = require("node:assert");
const path = require("node:path");
const fs = require("node:fs");

let chromium;
try { ({ chromium } = require("playwright")); } catch (e) { /* skip below */ }

const skip = chromium ? false : "playwright is not installed";
const root = path.join(__dirname, "..");
const script = fs.readFileSync(path.join(root, "src/content.js"), "utf8");
const css = fs.readFileSync(path.join(root, "src/content.css"), "utf8");

test("hides and shows the label, keeps the title", { skip }, async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("file://" + path.join(__dirname, "fixture.html"));
  await page.addStyleTag({ content: css });
  await page.evaluate(() => {
    const listeners = [];
    window.__store = { enabled: true };
    window.chrome = { storage: {
      local: { get: (d, cb) => cb(window.__store) },
      onChanged: { addListener: (f) => listeners.push(f) }
    } };
    window.__fire = (v) => listeners.forEach((f) => f({ enabled: { newValue: v } }, "local"));
  });
  await page.evaluate(script);
  await page.waitForSelector("[data-rail-label]", { state: "attached" });

  assert.equal(await page.isVisible(".badge"), false, "label hidden when on");
  assert.equal(await page.isVisible("h1"), true, "title stays visible");
  assert.equal(await page.isVisible("#text"), true, "description stays visible");

  await page.evaluate(() => window.__fire(false));
  assert.equal(await page.isVisible(".badge"), true, "label visible when off");

  await page.evaluate(() => window.__fire(true));
  await page.evaluate(() => {
    const row = document.createElement("div");
    row.id = "late";
    row.innerHTML = "<span>AI-generated</span>";
    document.querySelector("#description").appendChild(row);
  });
  await page.waitForFunction(() => document.querySelector("#late")?.hasAttribute("data-rail-label"));
  assert.equal(await page.isVisible("#late"), false, "label added later is hidden");
  await browser.close();
});
