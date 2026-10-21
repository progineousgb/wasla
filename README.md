# wasla

`wasla` turns a title into a URL slug. Arabic stays Arabic.

Pass a title to one function and get a slug you can put in a URL path. Latin letters are lowercased. Arabic letters are kept. Digits are kept. `\u0645\u0631\u062D\u0628\u0627 \u0628\u0627\u0644\u0639\u0627\u0644\u0645` stays Arabic.

Arabic text in this README is written as `\uXXXX` escape sequences so it reads the same in any editor or terminal. In JavaScript strings the escapes produce the same characters.

## What you get

- One function, `wasla(title, options?)`.
- The separator between words defaults to `-`.
- Alef forms `\u0623 \u0625 \u0622 \u0671` fold to `\u0627`, and `\u0649` folds to `\u064A`. `\u0629` and `\u0647` are kept apart. Persian `\u06CC` and `\u06A9` are kept as they are.
- Tatweel, tashkeel and Quranic marks are removed.
- Arabic presentation forms (U+FB50 to U+FEFF) and full-width Latin fold to their normal letters.
- Arabic-Indic digits `\u0660-\u0669` and Persian digits `\u06F0-\u06F9` are kept as written. They are not turned into `0-9`.
- Latin accents are kept and composed, so `é` stays `é` whether it was typed as one or two code points. They are not stripped to `e`.
- Invisible characters are removed: ZWJ, ZWNJ, LRM, RLM, bidi embeddings and isolates, and the BOM. This stops a slug from hiding reversed or invisible text.
- Spaces, dashes and punctuation such as `. / _ ,` split words. Apostrophes do not. Separators collapse into one and are trimmed from both ends.
- Running `wasla` on its own output returns the same slug.
- No runtime dependencies.

## Install

You need Node.js 18 or newer and git. wasla is not on npm, so you install it from GitHub. npm clones the repo and builds it during the install.

### Linux

Install Node.js from your package manager or from nodejs.org, then run this in your project folder:

```sh
node --version
npm install github:progineousgb/wasla
```

### macOS

Install Node.js with Homebrew (`brew install node`) or the installer from nodejs.org. Git ships with the Xcode command line tools (`xcode-select --install`). Then run:

```sh
npm install github:progineousgb/wasla
```

### Windows

Install Node.js and Git for Windows from their official sites. Open PowerShell or Command Prompt in your project folder and run:

```powershell
npm install github:progineousgb/wasla
```

Some newer npm versions ask you to approve install scripts. If the install warns about `prepare`, approve the `wasla` package so it can build.

### Working on wasla itself

```sh
git clone https://github.com/progineousgb/wasla.git
cd wasla
npm ci
npm run lint
npm test
```

These commands are the same on Linux, macOS and Windows.

## Examples

ES modules:

```js
import wasla from "wasla";

wasla("Hello World");
wasla("Hello, \u0645\u0631\u062D\u0628\u0627!");
wasla("\u0645\u0631\u062D\u0628\u0627 \u0628\u0627\u0644\u0639\u0627\u0644\u0645");
```

CommonJS works too:

```js
const { wasla } = require("wasla");
```

Those calls return:

```text
hello-world
hello-\u0645\u0631\u062D\u0628\u0627
\u0645\u0631\u062D\u0628\u0627-\u0628\u0627\u0644\u0639\u0627\u0644\u0645
```

## API

### `wasla(input, options?)`

`input` is a string, the title.

`options.separator` is placed between words. It must be one of `"-"`, `"_"`, `"."` or `"~"`, the characters that are safe in a URL path. The default is `"-"`. Anything else throws a `TypeError`.

`options.maxLength` is an optional limit in UTF-16 code units, the same unit as `string.length`. The cut never splits a letter from its marks or a surrogate pair, and a trailing separator is removed.

```js
wasla("Hello World", { separator: "_" });
```

That call returns `hello_world`.

The return value is a string. An empty title, or a title made only of symbols, returns `""`. A value that is not a string throws a `TypeError`.

Arabic and other non-Latin letters are not percent-encoded by wasla. Pass the slug through `encodeURIComponent` when you build a URL, or let your router do it.

## Limits

wasla is not a transliterator. It does not turn Arabic into Latin, and it does not translate a title into another language. A character that is not a letter, a digit, whitespace, or a dash is dropped. CamelCase is not split into words. `\u0629` is not rewritten as `\u0647`. wasla does not catch look-alike letters from different scripts, such as a Cyrillic `а` inside a Latin word. If slugs come from untrusted users and must be unique, compare them with a confusables check before you accept them.
