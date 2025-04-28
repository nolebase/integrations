---
title: 缩略图模糊哈希生成
category: 缩略图模糊哈希生成
sidebarTitle: 快速上手
---

# 配置 Vite 插件

## 安装

通过运行以下命令将 `@nolebase/vitepress-plugin-thumbnail-hash` 安装到您的项目依赖项中：

::: code-group

```shell [@antfu/ni]
ni @nolebase/vitepress-plugin-thumbnail-hash -D
```

```shell [pnpm]
pnpm add @nolebase/vitepress-plugin-thumbnail-hash -D
```

```shell [npm]
npm install @nolebase/vitepress-plugin-thumbnail-hash -D
```

```shell [yarn]
yarn add @nolebase/vitepress-plugin-thumbnail-hash -D
```

:::

## 使用

将缩略图模糊哈希生成插件集成到您的 VitePress 项目中包括两个主要步骤：

- [配置 Vite 插件](#配置-vite-插件)（数据获取、日志聚合）
- [与 VitePress 集成](#与-vitepress-主题集成)（UI 和组件）

### 配置 Vite 插件

有两种将缩略图模糊哈希生成 Vite 插件集成到您的 VitePress 项目中的方法：

1. [**推荐**：在 VitePress 的主要配置文件中使用 `vite` 选项（通常位于 `docs/.vitepress/config.ts`，文件路径和扩展名可能会有所不同）](#在-vitepress-的配置文件中配置-vite-插件)
2. [在 VitePress 项目的根目录中创建一个单独的 Vite 配置文件（例如 `vite.config.ts`）](#在单独的-vite-配置文件中配置-vite-插件)

#### 在 VitePress 的配置文件中配置 Vite 插件

请在你的 VitePress [**核心配置文件**](https://vitepress.dev/reference/site-config#config-resolution) 中（注意不是**主题配置文件**，通常为 `docs/.vitepress/config.ts`，文件路径和拓展名也许会有区别）的根字段中添加 [Vite](https://vitejs.dev) 选项，并导入并配置 `ThumbnailHashImages` 插件：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

```typescript twoslash
import { defineConfig } from 'vitepress'
import { // [!code ++]
  ThumbnailHashImages, // [!code ++]
} from '@nolebase/vitepress-plugin-thumbnail-hash/vite' // [!code ++]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: { // [!code ++]
    plugins: [ // [!code ++]
      ThumbnailHashImages(), // [!code ++]
    ],
  }, // [!code ++]
  lang: 'en',
  title: 'Site Name',
  themeConfig: {
    // rest of the options...
  }
  // rest of the options...
})
```

#### 在单独的 Vite 配置文件中配置 Vite 插件

##### 确保已创建 `vite.config.ts`

如果您已经了解 `vite.config.ts` 是什么并且已经创建了它，您可以跳过此准备步骤，直接跳转到下一步[在 `vite.config.ts` 中配置插件](#在-viteconfigts-中配置插件)。

::: tip 首次接触 `vite.config.ts`？

首先，`vite.config.ts` 是一个为 [Vite](https://vitejs.org) 构建工具的配置文件。VitePress 是基于 Vite 构建的，它允许开发人员构建和转换项目中的资产、内容和数据。

VitePress 本身包含了整套 Vite 选项的配置在其[**主要配置文件**](https://vitepress.dev/reference/site-config#config-resolution)中（这不是一个**主题配置文件**，通常位于 `docs/.vitepress/config.ts`，文件路径和扩展名可能会有所不同），这些选项与 `vite.config.ts` 在配置方面是相同的。

:::

因此，请在您的 VitePress 项目的根目录中创建一个单独的 `vite.config.ts` 文件：

::: tip 哪里是 VitePress 项目的根目录？

VitePress 项目的根目录是 `.vitepress` 目录的父目录。

例如，如果您的 VitePress 项目的目录结构如下所示：

```shell
.
├── docs
│   ├── .vitepress
│   │   ├── config.ts
│   │   └── theme
│   │       └── index.ts
│   └── README.md
```

在这种情况下，根目录是 `docs`。

```shell
.
├── .vitepress
│   ├── config.ts
│   └── theme
│       └── index.ts
└── README.md
```

在这种情况下，根目录是 `./`。

:::

```shell
touch vite.config.ts
```

##### 在 `vite.config.ts` 中配置插件

在位于项目根目录的独立的 [Vite 配置文件](https://vitejs.dev/config/)（也就是 `vite.config.ts` 中），我们需要导入 `ThumbnailHashImages` 插件并进行正确配置：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

```typescript twoslash
import { join } from 'node:path'
import { defineConfig } from 'vite'
import { // [!code ++]
  ThumbnailHashImages, // [!code ++]
} from '@nolebase/vitepress-plugin-thumbnail-hash/vite' // [!code ++]

export default defineConfig(() => {
  return {
    plugins: [ // [!code ++]
      ThumbnailHashImages(), // [!code ++]
    ]
    // other vite configurations...
  }
})
```

### 与 VitePress 主题集成

现在，让我们将缩略图模糊哈希生成插件集成到您的 VitePress 项目中。

在 VitePress 的[**主题配置文件**](https://vitepress.dev/reference/default-theme-config#default-theme-config)（请注意，这与上面提及的**配置文件**并非是一个文件，主题配置文件通常位于 `docs/.vitepress/theme/index.ts`，文件路径和扩展名可能会有所不同），安装 Vue 插件并使用组件：

<!--@include: @/pages/zh-CM/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

::: code-group

```typescript twoslash [docs/.vitepress/theme/index.ts]
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeConfig } from 'vitepress'
import { // [!code ++]
  NolebaseUnlazyImg, // [!code ++]
} from '@nolebase/vitepress-plugin-thumbnail-hash/client' // [!code ++]

import '@nolebase/vitepress-plugin-thumbnail-hash/client/style.css' // [!code ++]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // other configurations...
  },
  enhanceApp({ app }) {
    app.component('NolebaseUnlazyImg', NolebaseUnlazyImg)  // [!code ++]
  },
}

export default Theme
```

:::

## 接下来？

为了显示和使用 VitePress 页面所需的缩略图模糊哈希。请查看另一个我们提供的名为 [`markdown-it-unlazy-img`](../markdown-it-unlazy-img/) 的插件。

## 错误排查

### 遭遇了 `Cannot find module ... or its corresponding type declarations` 错误？

<!--@include: @/pages/zh-CN/snippets/troubleshooting-cannot-find-module.md-->
