<script setup>
import { PopupIframe } from '@nolebase/vitepress-plugin-inline-link-preview/client'
</script>

# 行内链接预览 <Badge type="tip" text="v1.28.0" />

这个 VitePress 插件实现了类似 Obsidian 的链接预览功能。

::: info 🤗 在预览时也支持完整的交互能力！

在与下面的预览弹出窗口进行交互和尝试时，任何的滚动、点击和浏览能力都是支持的，而且不会干扰到外部的页面。

:::

<div relative min-h="[440px]" min-w="[620px]">
  <a href="/pages/zh-CN/integrations/">集成</a>
  <div
      flex="~ col"
      absolute top-0 z-1 m-0 overflow-hidden rounded-lg p-0
      border="1 solid $vp-c-divider"
      class="max-w-[100vw]"
      :style="{
        left: `0px`,
        top: `30px`,
        width: `600px`,
        height: `400px`,
      }"
      shadow="2xl"
    >
      <PopupIframe href="/pages/zh-CN/integrations/" />
    </div>
</div>

尝试把光标悬停在这个链接上，你会看到一个弹窗，展示了链接的预览内容：

[[双向链接示例页面]]

## 特性

<div grid="~ cols-[auto_1fr] gap-1" items-center my-1>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>与<a href="/pages/zh-CN/integrations/markdown-it-bi-directional-links">双向链接</a>一起搭配更佳</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>预览任何页面</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>隐藏页面内元素</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>智能判断外链</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>原生与 VitePress 样式兼容</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>遵循 Nolebase Integrations 国际化规范标准</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>无障碍最佳实践</span>
</div>

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

### 添加 VitePress 主题相关的配置

在 VitePress 的[**主题配置文件**](https://vitepress.dev/reference/default-theme-config#default-theme-config)中（注意不是**配置文件**，通常为 `docs/.vitepress/theme/index.ts`，文件路径和拓展名也许会有区别），**将行内链接预览插件的组件注册到 VitePress 主题中**：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

::: code-group

```typescript twoslash [.vitepress/theme/index.ts]
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeConfig } from 'vitepress'
import { // [!code ++]
  NolebaseInlineLinkPreviewPlugin, // [!code ++]
} from '@nolebase/vitepress-plugin-inline-link-preview/client' // [!code ++]

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

## 配置

行内链接预览插件目前提供了与**国际化**和**预览弹窗**相关的配置选项。

### 如何在 VitePress 中进行配置

由于 VitePress 对于默认主题没有提供更多关于主题配置的拓展的功能，从某种程度上来说，如果我们直接修改 VitePress 的配置文件为插件提供配置的话对类型检查和配置的维护并不友好，所以这里我们使用 [Vue 的依赖注入](https://vuejs.org/api/composition-api-dependency-injection.html#inject)来提供配置：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import { InjectionKey } from '@nolebase/vitepress-plugin-inline-link-preview/client' // [!code ++]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // 其他部分的代码...
  },
  enhanceApp({ app }) {
    // 其他部分的代码...

    app.provide(InjectionKey, { // [!code ++]
      // 配置... // [!code ++]
    }) // [!code ++]

    // 其他部分的代码...
  },
}
```

如果想要了解更多关于国际化配置的信息，请参阅 [国际化](#国际化)。

### 配置选项

::: details 完整的可以配置的选项

```typescript twoslash
interface Locale extends Record<string, any> {
  /**
   * 弹窗文案
   */
  popup?: {
    /**
     * 弹窗加载中的文案
     */
    loading?: string
    /**
     * 弹窗加载中的文案的 aria-label
     */
    loadingAriaLabel?: string
    /**
     * 弹窗加载失败的文案
     */
    openInCurrentPage?: string
    /**
     * 弹窗加载失败的文案的 aria-label
     */
    openInCurrentPageAriaLabel?: string
    /**
     * iframe 弹窗的 aria-label
     */
    iframeAriaLabel?: string
  }
}
// ---cut---
/**
 * Options
 */
export interface Options {
  /**
   * 链接预览的宽度
   */
  popupWidth?: number
  /**
   * 链接预览的高度
   */
  popupHeight?: number
  /**
   * 是否预览所有的 host name
   *
   * 当设置为 true 时，所有与 host name 相关的选项都会被忽略，包括 `handleShouldPreviewHostNames` 选项。
   *
   * @default false
   */
  previewAllHostNames?: boolean
  /**
   * 设置为 true 时，预览本地（部署位置，或 `window.location.host`）主机名。
   *
   * @default true
   */
  previewLocalHostName?: boolean
  /**
   * 允许预览的主机名。
   * 当指定时，只有在此数组中的主机名才会被预览。
   *
   * @default []
   */
  previewHostNamesAllowed?: string[]
  /**
   * 阻止预览的主机名。
   * 当指定时，此数组中的主机名将不会被预览。
   *
   * @default []
   */
  previewHostNamesBlocked?: string[]
  /**
   * 程序化处理是否应该预览主机名。
   *
   * 当指定时，此函数将被调用以确定是否应该预览主机名，并在 `previewHostNamesAllowed` 和 `previewHostNamesBlocked` 选项之前。
   *
   * @param href 链接
   * @returns 是否应该预览主机名
   * @default undefined
   */
  handleShouldPreviewHostNames?: (href: string) => boolean
  /**
   * 用于在弹窗打开时隐藏 iframe 中的元素的选择器。
   * 当你有很多自定义元素的类不想在弹窗中显示时，这个选项会很有用。
   */
  selectorsToBeHided?: string[]
  /**
   * 程序化处理 iframe 加载事件，你可以使用这个处理函数来程序化地改变 iframe 内容，
   * 比如给 body 元素添加一个类，或者隐藏 iframe 中的一些元素。
   *
   * @param hostWindow 原窗口的 window 对象
   * @param element iframe 元素
   * @returns 支持 Promise
   * @default undefined
   */
  handleIframeLoaded?: (hostWindow: Window, element: HTMLIFrameElement) => Promise<void> | void
  /**
   * 弹窗在生成的时候所指向的目标元素的选择器。
   *
   * 默认情况下，弹窗会被附加到 body 元素上，因为 VitePress 目前只支持将元素传送到 body 元素。
   *
   * @default 'body'
   */
  popupTeleportTargetSelector?: string
  /**
   * 预览弹窗的延迟时间
   *
   * @default 1000
   */
  popupDelay?: number
  /**
   * 本地化
   *
   * @example { 'zh-CN': { popup: { loading: '加载中...', loadingAriaLabel: '加载中' } }
   */
  locales?: Record<string, Locale>
}
```

:::

## 国际化

::: warning 注意
行内链接预览插件并没有使用 [vue-i18n](https://vue-i18n.intlify.dev/) 来作为国际化的工具库，因为绝大多数 VitePress 可能是直接使用的 [VitePress 自带的国际化功能](https://vitepress.dev/guide/i18n) 来进行国际化的，所以行内链接预览插件的本地化文案并不能通过 `vue-i18n` 来覆盖文案，但是你可以通过 [配置](#配置) 中的 `locales` 字段来覆盖本地化的文案。
:::

行内链接预览插件默认提供了国际化的支持，默认支持了英文和简体中文。

你可以通过配置来对插件的本地化文案进行复写，在开始配置之前，你需要了解 VitePress 是如何进行国际化的：[VitePress 的国际化](https://vitepress.dev/guide/i18n)。行内链接预览插件默认会读取 VitePress 的语言字段，所以你在配置的时候需要注意将国际化的语言代码与 VitePress 的语言代码保持一致。

### 如何在 VitePress 中进行配置

在 [配置](#配置) 章节中，我们已经了解到了如何在 VitePress 中为行内链接预览插件提供配置选项，我们在配置选项中添加 `locales` 字段就可以配置国际化了：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import { InjectionKey } from '@nolebase/vitepress-plugin-inline-link-preview/client'

// 其他部分的代码...

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // 其他部分的代码...
  },
  enhanceApp({ app }) {
    // 其他部分的代码...

    app.provide(InjectionKey, {
      locales: { // 配置国际化 // [!code ++]
        'zh-CN': { // configure for Simplified Chinese // [!code ++]
          popup: { // [!code ++]
            loading: '加载中...', // [!code ++]
            loadingAriaLabel: '加载中', // [!code ++]
          } // [!code ++]
        }, // [!code ++]
        'en': { // configure for English // [!code ++]
          popup: { // [!code ++]
            loading: 'Loading...', // [!code ++]
            loadingAriaLabel: 'Loading', // [!code ++]
          } // [!code ++]
        } // [!code ++]
      } // [!code ++]
    })

    // 其他部分的代码...
  },
}
```

### 国际化字段选项

::: details 完整的国际化字段选项

```typescript twoslash
interface Locale extends Record<string, any> {
  /**
   * 弹窗文案
   */
  popup?: {
    /**
     * 弹窗加载中的文案
     */
    loading?: string
    /**
     * 弹窗加载中的文案的 aria-label
     */
    loadingAriaLabel?: string
    /**
     * 弹窗加载失败的文案
     */
    openInCurrentPage?: string
    /**
     * 弹窗加载失败的文案的 aria-label
     */
    openInCurrentPageAriaLabel?: string
    /**
     * iframe 弹窗的 aria-label
     */
    iframeAriaLabel?: string
  }
}
```

:::

## 无障碍

行内链接预览插件默认提供了无障碍的支持，你可以通过 [配置](#配置) 来对无障碍的文案进行复写，使用方法和 [国际化](#国际化) 一样，有关无障碍有哪些文案可以配置，请参阅 [国际化字段选项](#国际化字段选项)。

## 更多自定义能力？

可以的，没问题。

<!--@include: @/pages/zh-CN/snippets/configure-on-your-own-warning.md-->

行内链接预览插件会导出内部使用的组件，所以如果你不喜欢默认组件的样式和封装，你可以创建自己的组件来代替它们。

### 作为 Vue 插件使用

```typescript twoslash
import {
  NolebaseInlineLinkPreviewPlugin // [!code focus]
} from '@nolebase/vitepress-plugin-inline-link-preview/client'
```

如果您正在使用 VitePress，并希望将其安装到 Vue 实例中，可以这样做：

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import { NolebaseInlineLinkPreviewPlugin } from '@nolebase/vitepress-plugin-inline-link-preview/client' // [!code ++]

// Rest of the code...

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // Rest of the code...
  },
  enhanceApp({ app }) {
    app.use(NolebaseInlineLinkPreviewPlugin) // [!code ++]
  },
}

export default Theme
```

#### 按需导入弹出式 iframe 封装组件

```typescript twoslash
import {
  PopupIframe,  // [!code focus]
} from '@nolebase/vitepress-plugin-inline-link-preview/client'
```

配置插件或组件后，您需要自定义 `markdown-it` 插件如何将 `[]()` 链接标记或 `<a>` 元素转换为您的自定义组件，而不是默认的 `<VPNolebaseInlineLinkPreview>` 组件。

### 自定义 `markdown-it` 插件

```typescript twoslash
import { defineConfig } from 'vitepress'

import {
  InlineLinkPreviewElementTransform, // [!code focus]
} from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it'

export default defineConfig({
  lang: 'en',
  title: 'Site Name',
  themeConfig: {
    // rest of the options...
  },
  markdown: {
    config(md) {
      // other markdown-it configurations...
      md.use(InlineLinkPreviewElementTransform, { tag: 'YourComponentName' }) // [!code focus]
    }
  }
})
```
