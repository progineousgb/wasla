const assert = require("node:assert/strict");
const { test } = require("node:test");
test("CommonJS require works", () => {
  const m = require("../dist/cjs/index.js");
  assert.equal(m.wasla("Hello World"), "hello-world");
  assert.equal(m.default("Hello World"), "hello-world");
});
