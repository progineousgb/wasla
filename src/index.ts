export interface WaslaOptions {
  /** Placed between words. One of "-", "_", ".", "~". Default "-". */
  separator?: string;
  /** Maximum length in UTF-16 code units. The cut never splits a grapheme. */
  maxLength?: number;
}

const ALLOWED_SEPARATORS = new Set(["-", "_", ".", "~"]);

function normalizeArabic(input: string): string {
  return input
    .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627")
    .replace(/\u0649/g, "\u064A")
    .replace(/\u0640/g, "")
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, "");
}

// Letters, digits and combining marks (needed for scripts such as Devanagari).
// Format characters (\p{Cf}: ZWJ, ZWNJ, LRM, RLM, bidi embeddings, isolates, BOM)
// are not word characters and are never emitted.
const WORD = /[\p{L}\p{M}\p{Nd}]/u;
const APOSTROPHE = /['\u2019\u02BC]/u;
const FORMAT = /\p{Cf}/u;

function cut(slug: string, maxLength: number, separator: string): string {
  if (slug.length <= maxLength) return slug;
  let out = "";
  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  for (const { segment } of segmenter.segment(slug)) {
    if (out.length + segment.length > maxLength) break;
    out += segment;
  }
  while (out.endsWith(separator)) out = out.slice(0, -separator.length);
  return out;
}

export function wasla(input: string, options?: WaslaOptions): string {
  if (typeof input !== "string") {
    throw new TypeError(`wasla: expected a string, got ${input === null ? "null" : typeof input}`);
  }
  const separator = options?.separator ?? "-";
  if (!ALLOWED_SEPARATORS.has(separator)) {
    throw new TypeError('wasla: separator must be one of "-", "_", ".", "~"');
  }
  const maxLength = options?.maxLength;
  if (maxLength !== undefined && !(Number.isInteger(maxLength) && maxLength >= 0)) {
    throw new TypeError("wasla: maxLength must be a non-negative integer");
  }

  // NFKC folds Arabic presentation forms (U+FB50-U+FEFF), full-width Latin and
  // ligatures to their base letters, and composes Latin accents (e + U+0301 -> é).
  const normalized = normalizeArabic(
    input.normalize("NFKC").replace(/\u0130/g, "i"),
  )
    .toLowerCase()
    .normalize("NFC");

  const words: string[] = [];
  let word = "";
  for (const character of normalized) {
    if (WORD.test(character)) {
      word += character;
    } else if (FORMAT.test(character) || APOSTROPHE.test(character)) {
      // drop silently, do not split the word
    } else if (word.length > 0) {
      words.push(word);
      word = "";
    }
  }
  if (word.length > 0) words.push(word);

  const slug = words.join(separator);
  return maxLength === undefined ? slug : cut(slug, maxLength, separator);
}

export default wasla;
