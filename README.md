# sanitize-markdown

> Lean and configurable allowlist-oriented HTML sanitizer

---

> ⚠️ **A temporary fork of https://github.com/bevacqua/insane while https://github.com/bevacqua/insane/issues/16 is pending** ⚠️

---

Works well in browsers, as its footprint size is very small _(around **~2kb** gzipped)_. API inspired by [`sanitize-html`][1] _(which is around **100kb** gzipped)_.

## Install

```shell
npm install sanitize-markdown --save
```

## Usage

```js
sanitizeMarkdown('<div>foo<span>bar</span></div>', { allowedTags: ['div'] })
// <- '<div>foo</div>'
```

Contrary to similar sanitizers, `sanitize-markdown` drops the whole tree of descendants for elements that aren't allowed tags.

## API

### `sanitizeMarkdown(html, options?, strict?)`

- `html` can be an arbitrary HTML string
- `options` are detailed below
- `strict` means that `options` won't be based off of [sanitizeMarkdown.defaults](#defaults) if set to `true`

The parser takes into account that some elements can be self-closing. For safety reasons the sanitizer will only accept a valid URL for `background`, `base`, `cite`, `href`, `longdesc`, `src`, and `usemap` elements. **"Valid URL"** means that it begins with either `#`, `/`, or any of `options.allowedSchemes` _(followed by `:`)_.

### `options`

[Sensible defaults](#defaults) are provided. You can override specific options as needed.

#### `allowedSchemes`

Defaults to `['http', 'https', 'mailto']`.

#### `allowedTags`

An array of tags that you'll allow in the resulting HTML.

##### Example

> Only allow spans, discarding the rest of elements.

```js
sanitizeMarkdown('<div>foo</div><span>bar</span>', {
  allowedTags: ['span']
});
// <- '<span>bar</span>'
```

#### `allowedAttributes`

An object describing the attributes you'll allow for each individual tag name.

##### `allowedAttributes` Example

> Only allow spans, and only allow those spans to have an `id` _(discarding the rest of their attributes)_.

```js
sanitizeMarkdown('<span id="bar" class="super">bar</span>', {
  allowedTags: ['span'],
  allowedAttributes: { span: ['id'] }
});
// <- '<span id="bar">bar</span>'
```

#### `allowedClasses`

If `'class'` is listed as an allowed attribute, every single class will be allowed. If you don't list `'class'` as an allowed attribute, you can provide a class allowlist per tag name.

##### `allowedClasses` Example

> Only allow spans to have `super` or `bad` class names, discarding the rest of them.

```js
sanitizeMarkdown('<span class="super mean and bad">bar</span>', {
  allowedTags: ['span'],
  allowedClasses: { span: ['super', 'bad'] }
});
// <- '<span class="super bad">bar</span>'
```

#### `filter`

Takes a `function(token)` that allows you to do additional validation beyond exact tag name and attribute matching. The `token` object passed to your filter contains the following properties.

- `tag` is the lowercase tag name of the element
- `attrs` is an object containing _every_ attribute in the element, **including** those that may not be in the allowlist

If you return a falsy value the element and all of its descendants will not be included in the output. Note that you are allowed to change the `attrs`, and even add new ones, transforming the output.

##### `filter` Example

> Require that `<span>` elements have an `aria-label` value.

```js
function filter (token) {
  return token.tag !== 'span' || token.attrs['aria-label'];
}
sanitizeMarkdown('<span aria-label="a foo">foo</span><span>bar</span>', {
  allowedTags: ['span'],
  allowedAttributes: { span: ['aria-label'] },
  filter: filter
});
// <- '<span aria-label="a foo">foo</span>'
```

#### `transformText`

Takes a `function(text)` that allows you to modify text content in HTML elements. Runs for every piece of text content. The returned value is used instead of the original text contents.

## Defaults

The default configuration is used if you don't provide any. This object is available at `sanitizeMarkdown.defaults`. You are free to manipulate the defaults themselves.

```json
{
  "allowedAttributes": {
    "a": ["href", "name", "target"],
    "iframe": ["allowfullscreen", "frameborder", "src"],
    "img": ["src"]
  },
  "allowedClasses": {},
  "allowedSchemes": ["http", "https", "mailto"],
  "allowedTags": [
    "a", "article", "b", "blockquote", "br", "caption", "code", "del", "details", "div", "em",
    "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "img", "ins", "kbd", "li", "main", "ol",
    "p", "pre", "section", "span", "strike", "strong", "sub", "summary", "sup", "table",
    "tbody", "td", "th", "thead", "tr", "u", "ul"
  ],
  "filter": null,
  "transformText": null
}
```

## License

MIT

[1]: https://github.com/punkave/sanitize-html
