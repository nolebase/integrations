---
title: Lazy loading blurred thumbnails
category: Lazy loading blurred thumbnails
---

<script setup>
import packageJSON from '~/packages/markdown-it-unlazy-img/package.json'
</script>

# Lazy loading blurred thumbnails <Badge type="tip" :text="`v${packageJSON.version}`" />

A [`markdown-it`](https://github.com/markdown-it/markdown-it) plugin wraps and transforms image tags to support [unlazy](https://github.com/johannschopplich/unlazy) lazy loading with [blurhash](https://github.com/woltapp/blurhash), [thumbhash](https://github.com/evanw/thumbhash) encoding, and more.

## Installation

Install `@nolebase/markdown-it-unlazy-img` to your project dependencies by running the following command:

::: code-group

```shell [@antfu/ni]
ni @nolebase/markdown-it-unlazy-img -D
```

```shell [pnpm]
pnpm add @nolebase/markdown-it-unlazy-img -D
```

```shell [npm]
npm install @nolebase/markdown-it-unlazy-img -D
```

```shell [yarn]
yarn add @nolebase/markdown-it-unlazy-img -D
```

:::

## Configuration

### Integrate with VitePress

In the VitePress configuration file (usually `docs/.vitepress/config.ts`, the file path and extension may be different), import `@nolebase/markdown-it-unlazy-img` as a plugin, and use it as a `markdown-it` plugin in the `markdown` option:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

```typescript
import { defineConfigWithTheme } from 'vitepress'
import { UnlazyImages } from '@nolebase/markdown-it-unlazy-img' // [!code ++]

export default defineConfigWithTheme({
  lang: 'en',
  title: 'Site name', // For reference only, please do not copy directly
  description: 'Description', // For reference only, please do not copy directly
  themeConfig: {
    // Other configurations...
  },
  markdown: {
    config: (md) => {
      md.use(UnlazyImages(), { // [!code ++]
        imgElementTag: 'NolebaseUnlazyImg', // [!code ++]
      }) // [!code ++]
    },
  },
})
```

### Integrate on-demand

<!--@include: @/pages/en/snippets/configure-on-your-own-warning.md-->

Import this plugin into the file where you can access the [`markdown-it`](https://github.com/markdown-it/markdown-it) instance, and use it as a `markdown-it` plugin:

```typescript
import { UnlazyImages } from '@nolebase/markdown-it-unlazy-img' // [!code ++]
```

Then you need to use the `use()` member methods from the `markdown-it` instance to use this plugin:

```typescript
import MarkdownIt from 'markdown-it'
let markdownIt: MarkdownIt = null as unknown as MarkdownIt
// ---cut---
import { UnlazyImages } from '@nolebase/markdown-it-unlazy-img' // [!code ++]

// Rest of the code...
// @noErrors
markdownIt.use(UnlazyImages(), { // [!code ++]
  imgElementTag: 'NolebaseUnlazyImg', // [!code ++]
}) // [!code ++]
```
