export interface WaslaOptions {
  separator?: string;
}

function normalizeArabic(input: string): string {
  return input
    .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627")
    .replace(/\u0649/g, "\u064A")
    .replace(/\u0640/g, "")
    .replace(/[\u064B-\u065F\u0670]/g, "");
}

function isWordCharacter(character: string): boolean {
  return /[\p{L}\p{Nd}]/u.test(character);
}

function isGap(character: string): boolean {
  return /[\s\u002D\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/u.test(character);
}

export function wasla(input: string, options?: WaslaOptions): string {
  const separator = options?.separator ?? "-";
  const normalized = normalizeArabic(input).toLowerCase();
  const words: string[] = [];
  let word = "";

  for (const character of normalized) {
    if (isWordCharacter(character)) {
      word += character;
      continue;
    }

    if (isGap(character) && word.length > 0) {
      words.push(word);
      word = "";
    }
  }

  if (word.length > 0) {
    words.push(word);
  }

  return words.join(separator);
}

export default wasla;
