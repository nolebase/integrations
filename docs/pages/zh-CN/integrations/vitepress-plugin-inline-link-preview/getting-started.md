---
title: 行内链接预览
category: 行内链接预览
sidebarTitle: 快速上手
---

# 快速上手

## 安装

通过运行以下命令将 `@nolebase/vitepress-plugin-inline-link-preview` 安装到您的项目依赖项中：

::: code-group

```shell [@antfu/ni]
ni @nolebase/vitepress-plugin-inline-link-preview -D
```

```shell [pnpm]
pnpm add @nolebase/vitepress-plugin-inline-link-preview -D
```

```shell [npm]
npm install @nolebase/vitepress-plugin-inline-link-preview -D
```

```shell [yarn]
yarn add @nolebase/vitepress-plugin-inline-link-preview -D
```

:::

## 用法

将行内链接预览插件集成到 VitePress 项目中包括两个主要步骤：

1. [配置 `markdown-it` 插件](#配置-markdown-it-插件)（语法转换与数据处理相关配置）
2. [添加 VitePress 主题相关的配置](#添加-vitepress-主题相关的配置)（UI 显示相关配置）

### 配置 `markdown-it` 插件

首先，请在你的 VitePress [**核心配置文件**](https://vitepress.dev/reference/site-config#config-resolution) 中（注意不是**主题配置文件**，通常为 `docs/.vitepress/config.ts`，文件路径和拓展名也许会有区别）的根字段中，注册所需的 `markdown-it` 插件：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

::: code-group

```typescript twoslash
import { defineConfig } from 'vitepress'
import { // [!code ++]
  InlineLinkPreviewElementTransform // [!code ++]
} from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it' // [!code ++]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en',
  title: 'Site Name',
  themeConfig: {
    // 剩余的选项...
  },
  markdown: { // [!code ++]
    config(md) { // [!code ++]
      // 其他 markdown-it 配置... // [!code ++]
      md.use(InlineLinkPreviewElementTransform) // [!code ++]
    } // [!code ++]
  } // [!code ++]
  // 剩余的选项...
})
```

在幕后，`InlineLinkPreviewElementTransform` 是一个 `markdown-it` 插件，可直接将 `[]()` 链接语法与 `<a>` 元素转换为 `<VPNolebaseInlineLinkPreview>` 元素（也就是行内链接预览组件）。

默认情况下，该 `markdown-it` 插件将转换所有符合以下条件的 `[]()` 链接语法或 `<a>` 元素：

1. **不包含** `header-anchor` 类。
2. **不包含**`no-inline-link-preview` 类。
3. **具有** `data-inline-link-preview="false"` 属性。

因此，对于那些你不想转换成 `<VPNolebaseInlineLinkPreview>` 的 `[]()` 链接标记和 `<a>` 元素，你可以：

1. 在类列表中添加 `no-inline-link-preview`。
2. 为标签添加一个 `data-inline-link-preview` 属性，并设置值为 `false`。

### 添加 Vite 相关配置

首先，请在你的 VitePress [**核心配置文件**](https://vitepress.dev/reference/site-config#config-resolution) 中（注意不是**主题配置文件**，通常为 `docs/.vitepress/config.ts`，文件路径和拓展名也许会有区别）的根字段中添加 [Vite](https://vitejs.dev) 与 [SSR 服务端渲染相关](https://cn.vitejs.dev/config/ssr-options.html#ssr-external) 的配置。

将行内链接预览的插件包 `@nolebase/vitepress-plugin-inline-link-preview` 添加到需要 VitePress 底层的 Vite 帮忙处理的依赖：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

```typescript twoslash
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: { // [!code ++]
    optimizeDeps: {
      exclude: [ // [!code ++]
        '@nolebase/vitepress-plugin-inline-link-preview/client', // [!code ++]
      ], // [!code ++]
    },
    ssr: { // [!code ++]
      noExternal: [ // [!code ++]
        // 如果还有别的依赖需要添加的话，并排填写和配置到这里即可 // [!code hl]
        '@nolebase/vitepress-plugin-inline-link-preview', // [!code ++]
      ], // [!code ++]
    }, // [!code ++]
  }, // [!code ++]
  lang: 'zh-CN',
  title: '网站标题',
  themeConfig: {
    // 其他的配置...
  }
  // 其他的配置...
})
```

如果你很厉害，为 VitePress 的文档站点配置了分离和单独的 [Vite 配置文件](https://vitejs.dev/config/)（比如 `vite.config.ts`），那你也可以省略上面的配置，直接在 Vite 的配置文件中添加下面的配置：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

```typescript twoslash
import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    optimizeDeps: {
      exclude: [ // [!code ++]
        '@nolebase/vitepress-plugin-inline-link-preview/client', // [!code ++]
        'vitepress' // [!code ++]
      ], // [!code ++]
    },
    ssr: { // [!code ++]
      noExternal: [ // [!code ++]
        // 如果还有别的依赖需要添加的话，并排填写和配置到这里即可 // [!code hl]
        '@nolebase/vitepress-plugin-inline-link-preview', // [!code ++]
      ], // [!code ++]
    }, // [!code ++]
    plugins: [
      // 其他 Vite 插件配置...
    ],
    // 其他的配置...
  }
})

```

如果你在没有单独配置过 [Vite 配置文件](https://vitejs.dev/config/)（比如 `vite.config.ts`）的情况下想要直接复制上面的代码的话，只需要在 VitePress 站点所在的地方新建一个 `vite.config.ts` 即可，不过也记得还需要通过包管理器安装一下 `vite` 哦。

### 添加 VitePress 主题相关的配置

在 VitePress 的[**主题配置文件**](https://vitepress.dev/reference/default-theme-config#default-theme-config)中（注意不是**配置文件**，通常为 `docs/.vitepress/theme/index.ts`，文件路径和拓展名也许会有区别），**将行内链接预览插件的组件注册到 VitePress 主题中**：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

::: code-group

```typescript twoslash [.vitepress/theme/index.ts]
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeConfig } from 'vitepress'
import { // [!code ++]
  NolebaseInlineLinkPreviewPlugin, // [!code ++]
} from '@nolebase/vitepress-plugin-inline-link-preview/client' // [!code ++]

import '@nolebase/vitepress-plugin-inline-link-preview/client/style.css' // [!code ++]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // 其他配置...
  },
  enhanceApp({ app }) { // [!code ++]
    app.use(NolebaseInlineLinkPreviewPlugin) // [!code ++]
  }, // [!code ++]
}

export default Theme
```

:::

## 错误排查

### 遭遇了 `Cannot find module ... or its corresponding type declarations` 错误？

<!--@include: @/pages/zh-CN/snippets/troubleshooting-cannot-find-module.md-->
