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
      // @ts-expect-error unmatched type for VitePress, ref https://github.com/nolebase/integrations/pull/228 [!code ++]
      md.use(BiDirectionalLinks()) // [!code ++]
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

// Rest of the code...
// @noErrors
markdownIt.use(BiDirectionalLinks()) // [!code ++]
```

### Configuration options

```typescript twoslash
interface BiDirectionalLinksOptions {
  /**
   * The directory to search for bi-directional links.
   *
   * @default cwd() - Current working directory
   */
  dir?: string
  /**
   * The base directory joined as href for bi-directional links.
   *
   * @default '/'
   */
  baseDir?: string
  /**
   * The glob patterns to search for bi-directional linked files.
   *
   * @default '*.md, *.png, *.jpg, *.jpeg, *.gif, *.svg, *.webp, *.ico, *.bmp, *.tiff, *.apng, *.avif, *.jfif, *.pjpeg, *.pjp, *.png, *.svg, *.webp, *.xbm'
   */
  includesPatterns?: string[]
  /**
   * Whether to include debugging logs.
   *
   * @default false
   */
  debug?: boolean
  /**
   * Whether to exclude the warning when no matched file is found.
   *
   * @default false
   */
  noNoMatchedFileWarning?: boolean
}
```
