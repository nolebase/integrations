# Getting started

## Installation

Install `@nolebase/markdown-it-bi-directional-links` to your project dependencies by running the following command:

::: code-group

```shell [@antfu/ni]
ni @nolebase/markdown-it-bi-directional-links -D
```

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
import MarkdownIt from 'markdown-it'
let markdownIt: MarkdownIt = null as unknown as MarkdownIt
// ---cut---
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links' // [!code ++]
import { cwd } from 'node:process' // [!code ++]

// Rest of the code...
// @noErrors
markdownIt.use(BiDirectionalLinks({ // [!code ++]
  dir: cwd() // [!code ++]
})) // [!code ++]
```
