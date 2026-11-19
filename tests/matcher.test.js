const test = require("node:test");
const assert = require("node:assert");
const { isLabelText } = require("../src/content.js");

test("matches label text in several languages", () => {
  assert.ok(isLabelText("Altered or synthetic content"));
  assert.ok(isLabelText("  Contenuti alterati o sintetici "));
  assert.ok(isLabelText("AI-generated"));
});

test("ignores normal text and long text", () => {
  assert.ok(!isLabelText("A normal description line."));
  assert.ok(!isLabelText(""));
  assert.ok(!isLabelText("ai-generated " + "x".repeat(300)));
});
