import assert from "node:assert/strict";
import { describe, it } from "node:test";
import wasla from "../dist/index.js";

describe("wasla edge cases", () => {
  it("strips Quranic marks, hamza above and superscript alef", () => {
    assert.equal(wasla("علىٰ"), "علي");
    assert.equal(wasla("\u0645\u06D6\u0631"), "مر");
  });
  it("keeps ة and ه distinct, and Persian ی and ک as they are", () => {
    assert.equal(wasla("مكتبه مكتبة"), "مكتبه-مكتبة");
    assert.equal(wasla("یک"), "یک");
  });
  it("keeps Arabic-Indic and Persian digits", () => {
    assert.equal(wasla("عدد ٠١٢٣٤٥٦٧٨٩ ۱۲۳"), "عدد-٠١٢٣٤٥٦٧٨٩-۱۲۳");
  });
  it("folds Arabic presentation forms and full-width Latin", () => {
    assert.equal(wasla("\uFEE3\uFEAE\uFEA3\uFE92\uFE8E"), "مرحبا");
    assert.equal(wasla("\uFEFB"), "لا");
    assert.equal(wasla("ＡＢＣ"), "abc");
  });
  it("treats composed and decomposed accents the same", () => {
    assert.equal(wasla("Cafe\u0301"), wasla("Café"));
    assert.equal(wasla("Cafe\u0301"), "café");
  });
  it("keeps combining marks of other scripts", () => {
    assert.equal(wasla("नमस्ते"), "नमस्ते");
  });
  it("removes bidi controls, ZWJ, ZWNJ, LRM, RLM and BOM", () => {
    const out = wasla("\uFEFFevil\u202Egnp.exe a\u2066b\u2069 x\u200Fy m\u200Dn ی\u200Cک");
    assert.doesNotMatch(out, /\p{Cf}/u);
    assert.equal(out, "evilgnp-exe-ab-xy-mn-یک");
  });
  it("splits on punctuation such as dots, slashes and underscores", () => {
    assert.equal(wasla("v1.2.3"), "v1-2-3");
    assert.equal(wasla("a/b"), "a-b");
    assert.equal(wasla("foo_bar"), "foo-bar");
    assert.equal(wasla("don't stop"), "dont-stop");
  });
  it("handles Unicode whitespace", () => {
    assert.equal(wasla("a\u00A0b\u3000c\td\ne"), "a-b-c-d-e");
  });
  it("drops emoji including ZWJ sequences", () => {
    assert.equal(wasla("I 😀 👨‍👩‍👧 dogs"), "i-dogs");
  });
  it("lowercases Turkish İ to plain i", () => {
    assert.equal(wasla("İstanbul"), "istanbul");
  });
  it("throws a clear TypeError on non-string input", () => {
    for (const v of [null, undefined, 1, {}, []]) assert.throws(() => wasla(v), /expected a string/);
  });
  it("rejects unsafe separators", () => {
    for (const s of ["/", "", "a", " ", "?"]) assert.throws(() => wasla("a b", { separator: s }), TypeError);
  });
  it("is idempotent for every separator", () => {
    for (const separator of ["-", "_", ".", "~"]) {
      for (const x of ["Hello World", "مَرْحَبًا بالعالم", "v1.2 é ﻻ", " --a__b-- "]) {
        const once = wasla(x, { separator });
        assert.equal(wasla(once, { separator }), once);
      }
    }
  });
  it("output survives encodeURIComponent round trip and has no reserved characters", () => {
    for (const x of ["Hello, مرحبا!", "a/b?c#d&e", "x%20y"]) {
      const s = wasla(x);
      assert.doesNotMatch(s, /[\/?#%&\s]/);
      assert.equal(decodeURIComponent(encodeURIComponent(s)), s);
    }
  });
  it("maxLength never splits a grapheme or surrogate pair and trims the separator", () => {
    assert.equal(wasla("hello world", { maxLength: 6 }), "hello");
    assert.equal(wasla("नमस्ते", { maxLength: 4 }), "नम");
    const s = wasla("a\u{20000}b", { maxLength: 2 });
    assert.equal(s, "a");
    assert.throws(() => wasla("a", { maxLength: -1 }), TypeError);
  });
  it("is linear on long pathological input", () => {
    const t = Date.now();
    wasla("- ".repeat(200000) + "مَ".repeat(200000) + "\u202E".repeat(200000));
    assert.ok(Date.now() - t < 2000);
  });
});
