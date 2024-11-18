---
title: Breadcrumbs
category: Breadcrumbs
---

<script setup>
import packageJSON from '~/packages/vitepress-plugin-breadcrumbs/package.json'
</script>

# Breadcrumbs <Badge type="tip" :text="`v${packageJSON.version}`" />

## Installation

Install `@nolebase/vitepress-plugin-breadcrumbs` to your project dependencies by running the following command:

::: code-group

```shell [@antfu/ni]
ni @nolebase/vitepress-plugin-breadcrumbs
```

```shell [pnpm]
pnpm add @nolebase/vitepress-plugin-breadcrumbs
```

```shell [npm]
npm install @nolebase/vitepress-plugin-breadcrumbs
```

```shell [yarn]
yarn add @nolebase/vitepress-plugin-breadcrumbs
```

```shell [bun]
bun install @nolebase/vitepress-plugin-breadcrumbs
```

:::

## Configuration

### Integrate with VitePress

In the VitePress configuration file (usually `docs/.vitepress/config.ts`, the file path and extension may be different), import `@nolebase/vitepress-plugin-breadcrumbs`, and put it into `transformPageData` function:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

<!--@include: @/pages/en/snippets/configure-tsconfig.md-->

```typescript twoslash
import { defineConfig } from 'vitepress'
import { generateBreadcrumbsData } from '@nolebase/vitepress-plugin-breadcrumbs' // [!code ++]

export default defineConfig({
  // Other configurations...
  transformPageData(pageData, context) { // [!code ++]
    generateBreadcrumbsData(pageData, context) // [!code ++]
  }, // [!code ++]
})

```

Then please add the Breadcrumbs plugin package name `@nolebase/vitepress-plugin-breadcrumbs` into the Vite options that required by VitePress to process this plugin:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

<!--@include: @/pages/en/snippets/configure-tsconfig.md-->

```typescript twoslash
// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: { // [!code ++]
    optimizeDeps: { // [!code ++]
      exclude: [ // [!code ++]
        '@nolebase/vitepress-plugin-breadcrumbs/client' // [!code ++]
      ] // [!code ++]
    }, // [!code ++]
    ssr: { // [!code ++]
      noExternal: [ // [!code ++]
        // If there are other packages that need to be processed by Vite, you can add them
        '@nolebase/vitepress-plugin-breadcrumbs' // [!code ++]
      ]// [!code ++]
    } // [!code ++]
  }, // [!code ++]
  // Other configurations...
})
```

### Add plugin into the Theme options of VitePress

In VitePress's [**theme configuration file**](https://vitepress.dev/reference/default-theme-config#default-theme-config) (note that it's not a **configuration file**, it's usually located at `docs/.vitepress/theme/index.ts`, file paths and extensions may be vary), import `@nolebase/vitepress-plugin-breadcrumbs` package and add it to the `Layout` section as a slot:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

<!--@include: @/pages/en/snippets/configure-tsconfig.md-->

::: code-group

```typescript twoslash [docs/.vitepress/theme/index.ts]
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'

import { NolebaseBreadcrumbs } from '@nolebase/vitepress-plugin-breadcrumbs/client' // [!code ++]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // Add breadcrumb above document
      'doc-before': () => h(NolebaseBreadcrumbs), // [!code ++]
    })
  }
}

export default Theme
```

:::

## Use custom breadcrumbs component

If you don't like the style or other something of default breadcrumb component, you can create your own component, this plugin will inject breadcrumb data into `frontmatter` of the page, so you can use breadcrumb data like this:

```vue
<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()

console.log(frontmatter.breadcrumbs)
// and do something other...
</script>

<template>
  <div>
    <!-- ui of your own component -->
  </div>
</template>
```

The `breadcrumbs` property is an array:

```typescript
type Breadcrumbs = {
  title: string
  link: string
}[]
```

If there isn't a `index.md` in the directory, the `link` will be an empty string `""`
