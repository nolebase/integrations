---
title: 双向链接
category: 双向链接
sidebarTitle: 快速上手
---

# 快速上手

## 安装

通过下面的命令将 `@nolebase/markdown-it-bi-directional-links` 安装到你的项目依赖中：

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

## 配置

### 为 VitePress 配置

在 VitePress 的配置文件中（通常为 `docs/.vitepress/config.ts`，文件路径和拓展名也许会有区别），将 `@nolebase/markdown-it-bi-directional-links` 作为一个插件导入，并将其作为 `markdown` 选项的 `markdown-it` 插件使用：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

```typescript
import { defineConfigWithTheme } from 'vitepress'
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links' // [!code ++]

export default defineConfigWithTheme({
  lang: 'zh-CN',
  title: '网站名称', // 仅供参考，请不要直接复制
  description: '某些介绍', // 仅供参考，请不要直接复制
  themeConfig: {
    // 其他各种配置...
  },
  markdown: {
    config: (md) => {
      md.use(BiDirectionalLinks()) // [!code ++]
    },
  },
})
```

### 自由配置

<!--@include: @/pages/zh-CN/snippets/configure-on-your-own-warning.md-->

在 [`markdown-it`](https://github.com/markdown-it/markdown-it) 的实例可被访问的地方先使用 `import` 语句将双向链接插件导入到文件中：

```typescript
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links' // [!code ++]
```

然后使用 `markdown-it` 实例的 `use()` 函数将导入后的 `MarkdownItBiDirectionalLinks` 作为插件使用，并配置一个包含有 `dir` 字段的对象，这个所谓的 `dir` 字段通常可以直接通过 `import` 语句导入来自 `process` 或者 `node:process` 包内的 `cwd()` 函数来获取：

```typescript
import type { MarkdownIt } from 'markdown-it'
let markdownIt = null as MarkdownIt
// ---cut---
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'

// 中间剩余的其他代码...

// @noErrors
markdownIt.use(BiDirectionalLinks()) // [!code ++]
```

### 配置选项

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
   * Excludes files added from `includePatterns` from being searched if it matches at least one of these patterns.
   *
   * @default '_*, dist, node_modules'
   */
  excludesPatterns?: string[]
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
  /**
   * Generate an error link or a link to a specific page when no matched file is found.
   *
   * When you use this option, you should define a css style for
   * `.nolebase-route-link-invalid` to distinguish the invalid link
   * from the normal link. Such as:
   * `a.nolebase-route-link-invalid { color: red; opacity: 0.6; }`
   *
   * @default false
   */
  stillRenderNoMatched?: boolean
  /**
   * Force a relative path instead of an absolute path
   *
   * @default false
   */
  isRelativePath?: boolean
}
```
