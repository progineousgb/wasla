# wasla

`wasla` turns a title into a URL slug. Arabic stays Arabic.

Pass a title to one function and get a slug you can put in a URL path. Latin letters are lowercased. Arabic letters are kept. Digits are kept. `مرحبا بالعالم` stays Arabic.

## What you get

- One function, `wasla(title, options?)`.
- The separator between words defaults to `-`.
- Alef forms `أ إ آ ٱ` fold to `ا`, and `ى` folds to `ي`.
- Tatweel and Arabic diacritics (tashkeel) are removed. `ة` stays `ة`.
- Spaces and dashes collapse into one separator. Separators are trimmed from both ends.
- No runtime dependencies.

## Install

Install from GitHub. wasla is not on npm.

```sh
npm install github:progineousgb/wasla
```

That installs the package and builds the JavaScript.

## Examples

```js
import wasla from "wasla";

wasla("Hello World");
wasla("Hello, مرحبا!");
wasla("مرحبا بالعالم");
```

Those calls return:

```text
hello-world
hello-مرحبا
مرحبا-بالعالم
```

## API

### `wasla(input, options?)`

`input` is a string, the title.

`options.separator` is an optional string. It is placed between words. The default is `"-"`.

```js
wasla("Hello World", { separator: "_" });
```

That call returns `hello_world`.

The return value is a string. An empty title, or a title made only of symbols, returns `""`.

## Limits

wasla is not a transliterator. It does not turn Arabic into Latin, and it does not translate a title into another language. A character that is not a letter, a digit, whitespace, or a dash is dropped. CamelCase is not split into words. `ة` is not rewritten as `ه`.
