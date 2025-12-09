---
title: 页面属性
category: 页面属性
tags:
  - 集成/VitePress-插件
  - 集成/VitePress-插件/页面属性
  - Markdown/frontmatter
progress: 35
url1: https://nolebase-integrations.ayaka.io/pages/zh-CN/
createdAt: 2024-01-23
updatedAt: 2024-01-23
---

<script setup>
import packageJSON from '~/packages/vitepress-plugin-page-properties/package.json'
</script>

# 页面属性 <Badge type="danger" text="Alpha 测试" />

「页面属性」功能因受 Notion 页面属性的巨大启发而诞生：让 frontmatter 以一组简洁的属性形式展示、可编辑。

## 为什么

frontmatter 往往藏着最有用的元数据——状态、创建 / 更新时间、标签、阅读时长——却常被折叠。页面属性会把这些元数据放在标题下方，用简洁的布局和开发期的轻量编辑体验直接呈现。

## 功能

<div grid="~ cols-[auto_1fr] gap-1" items-start my-1>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>将 frontmatter 渲染成带图标的属性列表</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>内置属性类型：标签、日期时间、进度、链接、纯文本</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>动态属性支持字数与阅读时长，开发 / 构建阶段自动计算</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>按语言划分的属性配置，与 VitePress i18n 一致</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>开发环境自动切换到内联编辑器，便于微调 frontmatter</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Markdown Section 插件自动插入组件，无需手动引用</span>
</div>

## 安装

通过运行以下命令将 `@nolebase/vitepress-plugin-page-properties` 安装到您的项目依赖项中：

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

## 快速上手

插件由两部分组成：

- **Vite 插件**：计算动态数据并在每个页面注入 `<NolebasePageProperties />`。
- **Vue 插件**：在 VitePress 主题中注册组件与样式。

### 配置 Vite 插件

在 VitePress 站点配置（或 `vite.config.ts`）里同时注册 `PageProperties` 和 `PagePropertiesMarkdownSection`。下面的示例与本仓库 `docs/vite.config.ts` 的接入方式一致：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

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

- `PageProperties()` 会从每个 markdown 文件中计算动态数据（字数、阅读时长）。
- `PagePropertiesMarkdownSection()` 会在第一个标题后自动插入 `<NolebasePageProperties />`。需要跳过的页面可以用 `excludes` / `exclude()`，也可以在 frontmatter 里写 `pageProperties: false` 或 `nolebase.pageProperties: false`。

### 在主题里注册 UI 插件

在 `docs/.vitepress/theme/index.ts` 里安装 Vue 插件并引入样式：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

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
    // 其它布局配置...
  },
  enhanceApp({ app }) {
    app.use(NolebasePagePropertiesPlugin({
      // 示例配置，可按需改成你的 frontmatter 字段
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

### 描述属性 Schema

按语言声明希望展示的 frontmatter 字段，使标签、日期格式与 VitePress 的 i18n 设置一致。支持的属性类型：

- `tags`：字符串数组渲染为标签，`omitEmpty?: boolean`
- `plain`：纯文本，`omitEmpty?: boolean`
- `link`：链接字符串，`omitEmpty?: boolean`
- `progress`：数字渲染为进度条，`omitEmpty?: boolean`
- `datetime`：日期时间，带 `formatAsFrom?: boolean`、`dateFnsLocaleName?: LocaleName`、`format?: string`、`omitEmpty?: boolean`
- `dynamic`：动态计算。可选 `{ type: 'wordsCount' }` 或 `{ type: 'readingTime', dateFnsLocaleName?: LocaleName }`

下面的示例取自本仓库的预设（`packages/unconfig-vitepress/src/plugins/nolebase/index.ts`）：

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

- `tags`、`progress`、`datetime`、`link`、`plain` 会直接读取 frontmatter 值。
- `dynamic` 类型（`wordsCount`、`readingTime`）会读取 `PageProperties()` 计算出的结果。

### 在 Markdown 中使用

在 frontmatter 中写入你声明过的字段即可。Markdown Section 插件会把属性列表放在第一个 `#` 标题下方：

```md
---
title: 页面属性
tags:
  - 集成/VitePress-插件
  - Markdown/frontmatter
progress: 35
createdAt: 2024-01-23
updatedAt: 2024-01-23
---

# 页面属性

正文从这里开始……
```

开发环境会自动切换到编辑器版本（`<NolebasePagePropertiesEditor />`），方便直接调整 frontmatter；生产环境则只渲染只读视图。
