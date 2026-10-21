import assert from "node:assert/strict";
import { describe, it } from "node:test";
import wasla, { wasla as namedWasla } from "../dist/index.js";

describe("wasla", () => {
  it("lowercases a latin title and joins words with a dash", () => {
    assert.equal(wasla("Hello World"), "hello-world");
  });

  it("keeps Arabic letters in a mixed title", () => {
    assert.equal(wasla("Hello, مرحبا!"), "hello-مرحبا");
  });

  it("keeps an Arabic sentence in Arabic", () => {
    assert.equal(wasla("مرحبا بالعالم"), "مرحبا-بالعالم");
  });

  it("removes Arabic diacritics", () => {
    assert.equal(wasla("مَرْحَبًا"), "مرحبا");
    assert.equal(
      wasla("\u0645\u064F\u062D\u064E\u0645\u0651\u064E\u062F\u064C"),
      "\u0645\u062D\u0645\u062F",
    );
  });

  it("folds alef forms to bare alef", () => {
    assert.equal(wasla("أحمد إبراهيم آدم"), "احمد-ابراهيم-ادم");
    assert.equal(wasla("\u0671\u0633\u0645"), "\u0627\u0633\u0645");
  });

  it("maps alef maksura to yeh", () => {
    assert.equal(wasla("مصطفى"), "مصطفي");
    assert.equal(wasla("على"), "علي");
  });

  it("removes tatweel inside a word", () => {
    assert.equal(wasla("\u0645\u0640\u0631\u062D\u0640\u0628\u0627"), "مرحبا");
  });

  it("keeps teh marbuta", () => {
    assert.equal(wasla("مكتبة"), "مكتبة");
    assert.equal(wasla("القاهرة"), "القاهرة");
  });

  it("collapses repeated spaces", () => {
    assert.equal(wasla("Hello    World"), "hello-world");
  });

  it("collapses repeated dashes and spaces", () => {
    assert.equal(wasla("Hello   ---   World"), "hello-world");
  });

  it("uses a custom separator", () => {
    assert.equal(wasla("Hello World", { separator: "_" }), "hello_world");
    assert.equal(wasla("مرحبا بالعالم", { separator: "_" }), "مرحبا_بالعالم");
  });

  it("returns an empty string for empty or symbols-only input", () => {
    assert.equal(wasla(""), "");
    assert.equal(wasla("!!!"), "");
    assert.equal(wasla("---"), "");
    assert.equal(wasla("   "), "");
    assert.equal(wasla("؟!؟"), "");
  });

  it("trims separators from the ends", () => {
    assert.equal(wasla("  --Hello--  "), "hello");
  });

  it("keeps digits", () => {
    assert.equal(wasla("Part 2"), "part-2");
    assert.equal(wasla("عدد ٢"), "عدد-٢");
  });

  it("drops symbols instead of spelling them", () => {
    assert.equal(wasla("I ♥ Dogs"), "i-dogs");
  });

  it("lowercases accented Latin letters without transliterating them", () => {
    assert.equal(wasla("Café Menu"), "café-menu");
  });

  it("does not split camelCase", () => {
    assert.equal(wasla("fooBar"), "foobar");
  });

  it("exports the same function as the default and the named export", () => {
    assert.equal(namedWasla, wasla);
    assert.equal(namedWasla("Hello World"), "hello-world");
  });
});
