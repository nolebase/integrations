# Bi-directional Links <Badge type="tip" text="v1.27.2" />

## Introduction

**Bi-directional links** (also known as internal links), and another concept you may know and hear about [WikiLinks](https://en.wikipedia.org/wiki/Help:Link), holds a important place in the document engineering area. It is usually used to quickly establish a connection (or link) from one page to another page, and widely used in Wiki pages such as [Wikipedia](https://wikipedia.org), and now days popular tools such as [Obsidian](https://obsidian.md/) and [Logseq](https://logseq.com/).

This plugin is a fully featured compatible implementation version of [Obsidian](https://obsidian.md)'s [internal links](https://help.obsidian.md/Linking+notes+and+files/Internal+links), it follows two rules:

1. A page's file name (without extension) can be used as a link target, for example: `[[Bi-directional Links Example Page]]` will be parsed as a link to the globally unique `Bi-directional Links Example Page.md` file.
2. A link target can be an absolute path, for example: `[[Some Folder/Bi-directional Links Example Page]]` will be parsed as a link to `Some Folder/Bi-directional Links Example Page.md`, usually appears when you have multiple files with the same name.

## Demo

::: info Syntax supporting matrix

<div grid="~ cols-[auto_1fr] gap-1" items-center my-1>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Basic syntax</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Able to handle hash tags <code>#</code></span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Able to handle query strings <code>?</code></span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Images</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Custom text</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Custom HTML attributes</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Same name pages</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Absolute path</span>
</div>

You can discover more syntaxes and features in the [Syntax](/pages/en/integrations/markdown-it-bi-directional-links/syntax).
:::

Basic: [[Bi-directional Links Example Page]]

Custom text: [[Bi-directional Links Example Page|Custom Text]]

Compatible to modify the HTML attributes [[Bi-directional Links Example Page|Custom Attrs]]{style="color: red;"}

Obsidian same name pages: [[pages/en/integrations/markdown-it-bi-directional-links/same-name/Bi-directional Links Example Same Name Page|Bi-directional Links Example Same Name Page]] 和 [[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Same Name Page|Bi-directional Links Example Same Name Page]]

Absolute Path: [[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page]]

Images are supported:

![[foxtail field.jpg]]

## Installation

Install `@nolebase/markdown-it-bi-directional-links` to your project dependencies by running the following command:

::: code-group

```shell [pnpm]
pnpm add @nolebase/markdown-it-bi-directional-links -D
```

```shell [npm]
npm install @nolebase/markdown-it-bi-directional-links -D
```

```shell [yarn]
yarn add @nolebase/markdown-it-bi-directional-links -D
```

:::

## Configuration

### Integrate with VitePress

In the VitePress configuration file (usually `docs/.vitepress/config.ts`, the file path and extension may be different), import `@nolebase/markdown-it-bi-directional-links` as a plugin, and use it as a `markdown-it` plugin in the `markdown` option:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

```typescript twoslash
import { cwd } from 'node:process' // [!code ++]
import { defineConfigWithTheme } from 'vitepress'
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links' // [!code ++]

export default defineConfigWithTheme({
  lang: 'en',
  title: 'Site name', // For reference only, please do not copy directly
  description: 'Description', // For reference only, please do not copy directly
  themeConfig: {
    // Other configurations...
  },
  markdown: {
    config: (md) => {
      md.use(BiDirectionalLinks({ // [!code ++]
        dir: cwd(), // [!code ++]
      })) // [!code ++]
    },
  },
})
```

### Integrate on-demand

<!--@include: @/pages/en/snippets/configure-on-your-own-warning.md-->

Import this plugin into the file where you can access the [`markdown-it`](https://github.com/markdown-it/markdown-it) instance, and use it as a `markdown-it` plugin:

```typescript twoslash
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links' // [!code ++]
```

Then you need to use the `use()` member methods from the `markdown-it` instance to use this plugin.
With a options object that contains a `dir` field which is the root directory of your project supplied, the value for `dir` field can be obtained through `cwd()` function call that imported from either `process` or `node:process`:

```typescript twoslash
import type { MarkdownIt } from 'markdown-it'
let markdownIt = null as MarkdownIt
// ---cut---
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links' // [!code ++]
import { cwd } from 'node:process' // [!code ++]

// Rest of the code...
// @noErrors
markdownIt.use(BiDirectionalLinks({ // [!code ++]
  dir: cwd() // [!code ++]
})) // [!code ++]
```
