---
title: Page properties
category: Page properties
tags:
  - Integrations/VitePress-Plugin
  - Integrations/VitePress-Plugin/Page-Properties
  - Markdown/frontmatter
progress: 85
url1: https://nolebase-integrations.ayaka.io/pages/en/
createdAt: 2024-01-23
updatedAt: 2024-01-23
---

<script setup>
import packageJSON from '~/packages/vitepress-plugin-page-properties/package.json'
</script>

# Page properties <Badge type="danger" :text="`Alpha ${packageJSON.version}`" />

Page properties was born from the heavily inspiration of Notion's page properties feature: render and edit frontmatter like a clean set of Notion-style properties.

## Why

Frontmatter often holds the most important metadata—status, created / updated date, owners, reading time—and yet it is usually hidden. Page properties surfaces that metadata right under the page title with a tidy layout and light editing experience during development.

## Features

<div grid="~ cols-[auto_1fr] gap-1" items-start my-1>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Display frontmatter as properties with icons and grouping</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Built-in property types: tags, datetime, progress, link, plain text</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Dynamic properties for words count and reading time, calculated during dev/build</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Per-locale schemas to match VitePress i18n setups</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Optional inline editor in dev mode so you can tweak frontmatter quickly</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Automatic insertion into markdown via the markdown section plugin</span>
</div>

## Installation

Install `@nolebase/vitepress-plugin-page-properties` to your project dependencies by running the following command:

::: code-group

```shell [@antfu/ni]
ni @nolebase/vitepress-plugin-page-properties -D
```

```shell [pnpm]
pnpm add @nolebase/vitepress-plugin-page-properties -D
```

```shell [npm]
npm install @nolebase/vitepress-plugin-page-properties -D
```

```shell [yarn]
yarn add @nolebase/vitepress-plugin-page-properties -D
```

:::

## Getting started

This plugin has two parts:

- **Vite plugins** to calculate dynamic data and inject the `<NolebasePageProperties />` section into every page.
- **Vue plugin** to register UI components and styles with your VitePress theme.

### Configure the Vite plugins

In your VitePress site config (or `vite.config.ts`), register both `PageProperties` and `PagePropertiesMarkdownSection`. The example below matches how this docs site wires it in `docs/vite.config.ts`:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

<!--@include: @/pages/en/snippets/configure-tsconfig.md-->

```ts twoslash
import { join } from 'node:path'
import { defineConfig } from 'vitepress'
import {
  PageProperties,
  PagePropertiesMarkdownSection,
} from '@nolebase/vitepress-plugin-page-properties/vite'

export default defineConfig({
  vite: {
    plugins: [
      PageProperties(),
      PagePropertiesMarkdownSection({
        excludes: [
          join('pages', 'en', 'index.md'),
          join('pages', 'zh-CN', 'index.md'),
        ],
      }),
    ],
  },
})
```

- `PageProperties()` calculates dynamic data (words count, reading time) from each markdown file.
- `PagePropertiesMarkdownSection()` injects the `<NolebasePageProperties />` block right after the first heading. Use `excludes` or `exclude()` when a page should opt out, or set `pageProperties: false` (or `nolebase.pageProperties: false`) in frontmatter for page-level opt-out.

### Register the UI plugin in your theme

Install the Vue plugin inside `docs/.vitepress/theme/index.ts` so the components and styles are available:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

<!--@include: @/pages/en/snippets/configure-tsconfig.md-->

```ts twoslash [docs/.vitepress/theme/index.ts]
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeConfig } from 'vitepress'
import {
  NolebasePagePropertiesPlugin,
} from '@nolebase/vitepress-plugin-page-properties/client'

import '@nolebase/vitepress-plugin-page-properties/client/style.css'

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // other layout options...
  },
  enhanceApp({ app }) {
    app.use(NolebasePagePropertiesPlugin({
      // Demo schema — adapt the keys to your own frontmatter
      properties: {
        'en': [
          { key: 'tags', type: 'tags', title: 'Tags' },
          { key: 'progress', type: 'progress', title: 'Progress' },
          { key: 'createdAt', type: 'datetime', title: 'Created at', formatAsFrom: true, dateFnsLocaleName: 'enUS' },
          { key: 'updatedAt', type: 'datetime', title: 'Updated at', formatAsFrom: true, dateFnsLocaleName: 'enUS' },
          { key: 'wordsCount', type: 'dynamic', title: 'Word count', options: { type: 'wordsCount' } },
          { key: 'readingTime', type: 'dynamic', title: 'Reading time', options: { type: 'readingTime', dateFnsLocaleName: 'enUS' } },
        ],
        'zh-CN': [
          { key: 'tags', type: 'tags', title: '标签' },
          { key: 'progress', type: 'progress', title: '进度' },
          { key: 'createdAt', type: 'datetime', title: '创建时间', formatAsFrom: true, dateFnsLocaleName: 'zhCN' },
          { key: 'updatedAt', type: 'datetime', title: '更新时间', formatAsFrom: true, dateFnsLocaleName: 'zhCN' },
          { key: 'wordsCount', type: 'dynamic', title: '字数', options: { type: 'wordsCount' } },
          { key: 'readingTime', type: 'dynamic', title: '阅读时间', options: { type: 'readingTime', dateFnsLocaleName: 'zhCN' } },
        ],
      },
    }))
  },
}
```

### Describe your properties schema

Define which frontmatter fields should appear, grouped by locale so that labels and date locales line up with your VitePress i18n. Property types supported:

- `tags`: array of strings rendered as tags, `omitEmpty?: boolean`
- `plain`: plain text, `omitEmpty?: boolean`
- `link`: URL value, `omitEmpty?: boolean`
- `progress`: number rendered as a progress bar, `omitEmpty?: boolean`
- `datetime`: ISO/Date value with `formatAsFrom?: boolean`, `dateFnsLocaleName?: LocaleName`, `format?: string`, `omitEmpty?: boolean`
- `dynamic`: calculated values. Options: `{ type: 'wordsCount' }` or `{ type: 'readingTime', dateFnsLocaleName?: LocaleName }`

The example below mirrors this site’s preset in `packages/unconfig-vitepress/src/plugins/nolebase/index.ts`:

```ts twoslash
import type { Property } from '@nolebase/vitepress-plugin-page-properties/client'

const pagePropertiesOptions = {
  properties: {
    'en': [
      { key: 'tags', type: 'tags', title: 'Tags' },
      { key: 'progress', type: 'progress', title: 'Progress' },
      { key: 'createdAt', type: 'datetime', title: 'Created at', formatAsFrom: true, dateFnsLocaleName: 'enUS' },
      { key: 'updatedAt', type: 'datetime', title: 'Updated at', formatAsFrom: true, dateFnsLocaleName: 'enUS' },
      { key: 'wordsCount', type: 'dynamic', title: 'Word count', options: { type: 'wordsCount' } },
      { key: 'readingTime', type: 'dynamic', title: 'Reading time', options: { type: 'readingTime', dateFnsLocaleName: 'enUS' } },
    ] satisfies Property<keyof any>[],
    'zh-CN': [
      { key: 'tags', type: 'tags', title: '标签' },
      { key: 'progress', type: 'progress', title: '进度' },
      { key: 'createdAt', type: 'datetime', title: '创建时间', formatAsFrom: true, dateFnsLocaleName: 'zhCN' },
      { key: 'updatedAt', type: 'datetime', title: '更新时间', formatAsFrom: true, dateFnsLocaleName: 'zhCN' },
      { key: 'wordsCount', type: 'dynamic', title: '字数', options: { type: 'wordsCount' } },
      { key: 'readingTime', type: 'dynamic', title: '阅读时间', options: { type: 'readingTime', dateFnsLocaleName: 'zhCN' } },
    ],
  },
}
```

- `tags`, `progress`, `datetime`, `link`, and `plain` pull values directly from frontmatter.
- `dynamic` properties (`wordsCount`, `readingTime`) read the calculated data provided by `PageProperties()` during dev/build.

### Use it in markdown

Add the fields you declared in the schema to your page frontmatter. The markdown section plugin will place the property list just beneath the first `#` heading.

```md
---
title: Page properties
tags:
  - Integrations/VitePress-Plugin
  - Markdown/frontmatter
progress: 85
createdAt: 2024-01-23
updatedAt: 2024-01-23
---

# Page properties

Your page content starts here...
```

During development the editor variant (`<NolebasePagePropertiesEditor />`) appears automatically so you can tweak values inline; in production only the read-only view renders.
