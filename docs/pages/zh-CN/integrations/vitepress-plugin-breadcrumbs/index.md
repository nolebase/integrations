---
title: 面包屑导航
category: 面包屑导航
---

<script setup>
import packageJSON from '~/packages/vitepress-plugin-breadcrumbs/package.json'
</script>

# 面包屑导航 <Badge type="tip" :text="`v${packageJSON.version}`" />

## 安装

你可以通过下面的指令将 `@nolebase/vitepress-plugin-breadcrumbs` 安装到你的项目依赖中：

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

## 使用

### 为 VitePress 配置

在 VitePress 的配置文件中（通常为 `docs/.vitepress/config.ts`，文件路径和拓展名也许会有区别），从 `@nolebase/vitepress-plugin-breadcrumbs` 导入 `generateBreadcrumbsData` 并且将它放置到 `transformPageData` 函数中：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

```typescript twoslash
import { defineConfig } from 'vitepress'
import { generateBreadcrumbsData } from '@nolebase/vitepress-plugin-breadcrumbs/vitepress' // [!code ++]

export default defineConfig({
  // 其它各种配置...
  transformPageData(pageData, context) { // [!code ++]
    generateBreadcrumbsData(pageData, context) // [!code ++]
  }, // [!code ++]
})

```

将面包屑导航的插件包 `@nolebase/vitepress-plugin-breadcrumbs` 添加到需要 VitePress 底层的 Vite 帮忙处理的依赖：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

```typescript twoslash
import { defineConfig } from 'vitepress'

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
        // 如果还有别的依赖需要添加的话，并排填写和配置到这里即可
        '@nolebase/vitepress-plugin-breadcrumbs' // [!code ++]
      ]// [!code ++]
    } // [!code ++]
  }, // [!code ++]
  // 其它的配置
})
```

### 添加 VitePress 主题相关的配置

在 VitePress 的[**主题配置文件**](https://vitepress.dev/reference/default-theme-config#default-theme-config)中（注意不是**配置文件**，通常为 `docs/.vitepress/theme/index.ts`，文件路径和拓展名也许会有区别），**将 `@nolebase/vitepress-plugin-breadcrumbs` 导入，并且将其添加到 `Layout` 的拓展中**：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

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
      // 将面包屑导航组件添加到文档上方
      'doc-before': () => h(NolebaseBreadcrumbs), // [!code ++]
    })
  }
}

export default Theme
```

:::

## 使用自定义的面包屑导航插件

如果你不喜欢默认的面包屑导航组件的样式或者别的东西，你可以创建一个自己的足迹，插件会将生成的面包屑数据注入到页面的 `frontmatter` 中去，所以你可以这样使用它：

```vue
<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()

console.log(frontmatter.breadcrumbs)
// 做一些其它的事情
</script>

<template>
  <div>
    <!-- 你自己的组件 UI -->
  </div>
</template>
```

`breadcrumbs` 属性是一个数组：

```typescript
type Breadcrumbs = {
  title: string
  link: string
}[]
```

如果某个文件夹中不存在 `index.md` ，`link` 属性将会是空字符串 `""`
