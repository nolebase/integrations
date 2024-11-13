# @nolebase/vitepress-plugin-breadcrumbs

A VitePress plugin that adds breadcrumbs to your documentation.

## Get started

Install:

```shell
pnpm install @nolebase/vitepress-plugin-breadcrumbs
# or use bun
bun install @nolebase/vitepress-plugin-breadcrumbs
```

Generate breadcrumbs data when build your pages in `.vitepress/config.ts`:

```typescript
import { generateBreadcrumbsData } from '@nolebase/vitepress-plugin-breadcrumbs'
import { defineConfig } from 'vitepress'

export default defineConfig({
  // other config...
  transformPageData(pageData, context) {
    generateBreadcrumbsData(pageData, context)
    // other transforming...
  },
  // other config...
})

```
Add default breadcrumb vue component to each page in `.vitepress/theme/index.ts`:
```typescript
import type { Theme as ThemeConfig } from 'vitepress'
import { NolebaseBreadcrumbs } from '@nolebase/vitepress-plugin-breadcrumbs/client'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // add breadcrumb above document
      'doc-before': () => h(NolebaseBreadcrumbs),
    })
  },
  enhanceApp({ app }) {
    app.provide<Options>(InjectionKey, {
      spotlight: {
        defaultToggle: true
      }
    })
  }
}

export default Theme

```
Add this plugin to `noExternal` and `exclude` properties when building:

```typescript
export default defineConfig({
  vite: {
    optimizeDeps: {
      exclude: [
        '@nolebase/vitepress-plugin-breadcrumbs/client'
      ]
    },
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-breadcrumbs'
      ]
    }
  },
  // other config...
})
```

## Use custom breadcrumb component

If you don't like the style or other something of default breadcrumb component, you can create your own component, this plugin will inject breadcrumb data into frontmatter of the page, so you can use breadcrumb data like this:

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
