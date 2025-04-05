---
title: 阅读增强
category: 阅读增强
---

<script setup>
import packageJSON from '~/packages/vitepress-plugin-enhanced-readabilities/package.json'
</script>

# 阅读增强 <Badge type="tip" :text="`v${packageJSON.version}`" />

## 效果演示

看到右上角的 <span i-icon-park-outline:book-open text-red-400 /> 按钮了吗？你可以使用鼠标悬浮在上面来看到支持的功能，点选一个你感兴趣的功能来看看效果吧！

::: warning 注意
阅读增强的「**布局切换**」和「**聚光灯**」功能在移动端暂时不可用，如果你正在使用移动端阅读但还是想要看看效果的话，不妨看看下面的视频演示。
:::

::: details 视频演示
<video controls muted>
  <source src="./assets/demo-video-1.zh-CN.mov">
</video>
:::

## 为什么

我经常会发现自己在 VitePress 构建的站点中阅读代码块和其他宽元素的内容时会很不舒服，而这样的不适往往是因为正文中有需要滚动阅读的代码块和元素导致的，即便从很多方面而言，较窄的内容方便阅读和扫视，但是需要进行滚动的阅读体验其实会因此会变的糟糕不堪，所以这个插件尝试从另一个角度上来试图解决这个（以及多个）问题。

### 解决了哪些问题

1. 在大屏幕上扩大内容的宽度，以便更好地利用空间方便阅读一些超大超宽的代码块和元素。
2. 用户和读者可能有阅读障碍，调宽布局的时候也许并不利于阅读多行的文本，可能会出现错行的情况，所以我们需要一个行内的阅读辅助功能。
3. 在阅读诸如英文等使用空格分隔单词的语言时，我们需要一个单词级别的阅读辅助功能，比如仿生阅读。（在做）

> 这些问题也只是我在漫长的学习和使用过程中能想到的能够解决的问题，这个插件并不会仅局限于着手解决这些问题，它还会尝试解决其他的问题，你也可以在 [GitHub](https://github.com/nolebase/integrations) 中开一个单独的 Issue 来讨论你觉得可能被解决的问题和你的想法。

我知道这样的功能可以制作成插件广泛应用于各种不同的网站，但我觉得 VitePress 显然是一个更好更快速的试验场，而且 Nólëbase 是基于 VitePress 进行发布的，我想把这个插件做出来作为集成的一部分方便我和大家直接集成到 VitePress 项目中用用试试看。

### 带来了什么功能

1. 布局切换
2. 聚光灯

## 如何使用

### 安装

> 我等不及了，快告诉我怎么弄到我的项目里！

你可以通过下面的命令将 `@nolebase/vitepress-plugin-enhanced-readabilities` 安装到你的项目依赖中：

::: code-group

```shell [pnpm]
pnpm add @nolebase/vitepress-plugin-enhanced-readabilities -D
```

```shell [npm]
npm install @nolebase/vitepress-plugin-enhanced-readabilities -D
```

```shell [yarn]
yarn add @nolebase/vitepress-plugin-enhanced-readabilities -D
```

:::

### 为 VitePress 配置

配置分为两个大步骤：

1. [添加 Vite 相关的配置](#添加-vite-相关的配置)
2. [添加 VitePress 主题相关的配置](#添加-vitepress-主题相关的配置)

#### 添加 Vite 相关的配置

首先，请在你的 VitePress [**核心配置文件**](https://vitepress.dev/reference/site-config#config-resolution) 中（注意不是**主题配置文件**，通常为 `docs/.vitepress/config.ts`，文件路径和拓展名也许会有区别）的根字段中添加 [Vite](https://vitejs.dev) 与 [SSR 服务端渲染相关](https://cn.vitejs.dev/config/ssr-options.html#ssr-external) 的配置。

将阅读增强的插件包 `@nolebase/vitepress-plugin-enhanced-readabilities` 添加到需要 VitePress 底层的 Vite 帮忙处理的依赖：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

```typescript twoslash
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: { // [!code ++]
    optimizeDeps: {
      exclude: [ // [!code ++]
        '@nolebase/vitepress-plugin-enhanced-readabilities/client', // [!code ++]
        'vitepress', // [!code ++]
        '@nolebase/ui', // [!code ++]
      ], // [!code ++]
    },
    ssr: { // [!code ++]
      noExternal: [ // [!code ++]
        // 如果还有别的依赖需要添加的话，并排填写和配置到这里即可 // [!code hl]
        '@nolebase/vitepress-plugin-enhanced-readabilities', // [!code ++]
        '@nolebase/ui', // [!code ++]
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
        '@nolebase/vitepress-plugin-enhanced-readabilities/client', // [!code ++]
        'vitepress' // [!code ++]
      ], // [!code ++]
    },
    ssr: { // [!code ++]
      noExternal: [ // [!code ++]
        // 如果还有别的依赖需要添加的话，并排填写和配置到这里即可 // [!code hl]
        '@nolebase/vitepress-plugin-enhanced-readabilities', // [!code ++]
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

#### 添加 VitePress 主题相关的配置

在 VitePress 的[**主题配置文件**](https://vitepress.dev/reference/default-theme-config#default-theme-config)中（注意不是**配置文件**，通常为 `docs/.vitepress/theme/index.ts`，文件路径和拓展名也许会有区别），**将 `@nolebase/vitepress-plugin-enhanced-readabilities` 导入，并且将其添加到 `Layout` 的拓展中**：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

::: code-group

```typescript twoslash [docs/.vitepress/theme/index.ts]
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeConfig } from 'vitepress'
import { // [!code ++]
  NolebaseEnhancedReadabilitiesMenu, // [!code ++]
  NolebaseEnhancedReadabilitiesScreenMenu, // [!code ++]
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client' // [!code ++]

import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css' // [!code ++]

import './styles/vars.css'
import './styles/main.css'


export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 为较宽的屏幕的导航栏添加阅读增强菜单
      'nav-bar-content-after': () => h(NolebaseEnhancedReadabilitiesMenu), // [!code ++]
      // 为较窄的屏幕（通常是小于 iPad Mini）添加阅读增强菜单
      'nav-screen-content-after': () => h(NolebaseEnhancedReadabilitiesScreenMenu), // [!code ++]
    })
  },
  enhanceApp() {
    // 其他的配置...
  },
}

export default Theme
```

:::

::: warning VitePress 导航栏样式异常？

你可能会在配置了社交链接的情况下发现在集成了导航栏组件之后导航栏的样式有些许的不对齐，这是因为 VitePress 原生的社交链接默认会有负的 16 个像素的右边距偏差。

你可以通过在 `.vitepress/theme/styles` 目录或者文件夹下面的 `main.css` 样式文件中添加下面的样式来解决这个问题：

```css
.VPSocialLinks.VPNavBarSocialLinks.social-links {
  margin-right: 0;
}
```

如果你没有这个文件的话，你可以创建一个 `main.css` 文件并且在 VitePress 的主题配置文件 `.vitepress/theme/index.ts` 中导入这个样式文件：

```typescript
import './styles/main.css' // [!code ++]
```

:::

::: info 已经配置过 `nav-bar-content-after` 或者 `nav-screen-content-after` 后面的 `h()` 函数的调用了？

如果你已经为你的 `nav-bar-content-after` 和 `nav-screen-content-after` 配置过了其他组件，你可以通过转写为以 `[` 开头和 `]` 结尾的数组来解决这样的问题，比如下面的写法：

```typescript
// 其他部分的代码...

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(OtherComponent), // 你的其他导航栏组件 // [!code --]
      'nav-bar-content-after': () => [ // [!code ++]
        h(OtherComponent), // 你的其他导航栏组件 // [!code ++]
        h(NolebaseEnhancedReadabilitiesMenu), // 阅读增强菜单 // [!code ++]
      ], // [!code ++]
      'nav-screen-content-after': () => h(OtherComponent), // 你的其他导航栏组件 // [!code --]
      'nav-screen-content-after': () => [ // [!code ++]
        h(OtherComponent), // 你的其他导航栏组件 // [!code ++]
        h(NolebaseEnhancedReadabilitiesScreenMenu), // 阅读增强移动端菜单 // [!code ++]
      ], // [!code ++]
    })
  },
  enhanceApp({ app }) {
    // 其他的配置...
  },
}

export default Theme
```

:::

### 自由配置

<!--@include: @/pages/zh-CN/snippets/configure-on-your-own-warning.md-->

阅读增强插件导出了它内部使用的组件，如果你不喜欢默认的菜单按钮的样式和封装等，你可以直接使用这些组件来自由配置你的菜单按钮。

#### 作为 Vue 插件进行安装

```typescript twoslash
import {
  NolebaseEnhancedReadabilitiesPlugin // [!code focus]
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css' // [!code ++]
```

如果是要给 VitePress 的 Vue 实例进行安装的话，你可以这样写：

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import { NolebaseEnhancedReadabilitiesPlugin } from '@nolebase/vitepress-plugin-enhanced-readabilities/client' // [!code ++]
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css' // [!code ++]

// 其他部分的代码...

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // 其他部分的代码...
  },
  enhanceApp({ app }) {
    app.use(NolebaseEnhancedReadabilitiesPlugin) // [!code ++]
  },
}

export default Theme
```

当然你也可以直接在安装插件的时候直接提供相关的配置：

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import type { Options } from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import { NolebaseEnhancedReadabilitiesPlugin } from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css' // [!code ++]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // 其他部分的代码...
  },
  enhanceApp({ app }) {
    app.use(NolebaseEnhancedReadabilitiesPlugin, {  // [!code ++]
      locales: {  // [!code ++]
        'zh-CN': {  // [!code ++]
          title: {  // [!code ++]
            title: '阅读增强插件',  // [!code ++]
          }  // [!code ++]
        },  // [!code ++]
        'en': {  // [!code ++]
          title: {  // [!code ++]
            title: 'Enhanced Readabilities Plugin',  // [!code ++]
          }  // [!code ++]
        }  // [!code ++]
      }  // [!code ++]
    } as Options) // [!code ++]
  },
}

export default Theme
```

有关配置的更多信息，请参阅 [配置](#配置)。

#### 按需导入布局切换组件

```typescript twoslash
import {
  LayoutSwitch,  // [!code focus]
  ScreenLayoutSwitch,  // [!code focus]
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
```

#### 按需导入聚光灯组件

```typescript twoslash
import {
  Spotlight,  // [!code focus]
  ScreenSpotlight, // [!code focus]
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
```

## 配置

阅读增强插件目前提供了与**国际化**和**帮助信息**相关的配置选项。

### 如何在 VitePress 中进行配置

由于 VitePress 对于默认主题没有提供更多关于主题配置的拓展的功能，从某种程度上来说，如果我们直接修改 VitePress 的配置文件为插件提供配置的话对类型检查和配置的维护并不友好，所以这里我们使用 [Vue 的依赖注入](https://vuejs.org/api/composition-api-dependency-injection.html#inject)来提供配置：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import type { Options } from '@nolebase/vitepress-plugin-enhanced-readabilities/client' // [!code ++]
import { InjectionKey } from '@nolebase/vitepress-plugin-enhanced-readabilities/client' // [!code ++]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // 其他部分的代码...
  },
  enhanceApp({ app }) {
    // 其他部分的代码...

    app.provide(InjectionKey, { // [!code ++]
      // 配置... // [!code ++]
    } as Options) // [!code ++]

    // 其他部分的代码...
  },
}
```

如果想要了解更多关于国际化配置的信息，请参阅 [国际化](#国际化)。

### 配置选项

::: details 完整的可以配置的选项

```typescript twoslash
import {
  SpotlightStyle,
  LayoutMode,
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import type {
  Locale,
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
// ---cut---
/**
 * Options
 */
export interface Options {
  /**
   * Internationalization configuration
   *
   * When configuring, please configure according to the language code configured in
   * VitePress internationalization configuration. In the following configuration, 'en'
   * and 'zh-CN' are the language codes configured in VitePress internationalization
   * configuration.
   *
   * @default undefined
   * @example
   * ```ts
   * {
   *  locales: {
   *    'en': {
   *      title: {
   *       title: 'Reading Mode',
   *      titleAriaLabel: 'Reading Mode',
   *    },
   *    'zh-CN': {
   *       title: {
   *         title: '阅读模式',
   *         titleAriaLabel: '阅读模式',
   *     },
   *   }
   * }
   * ```
   */
  locales?: Record<string, Locale>
  /**
   * Layout switch configuration
   */
  layoutSwitch?: {
    /**
     * Disable layout switch help tooltip
     *
     * @default false
     */
    disableHelp?: boolean
    /**
    * Disable Layout Switch animation
    */
    disableAnimation?: boolean,
    /**
     * Default mode for layout switch
     *
     * @default LayoutMode.Original (3)
     */
    defaultMode?: LayoutMode
    /**
     * Content layout max width slider configuration
     */
    contentLayoutMaxWidth?: {
      /**
       * Disable content layout max width help tooltip
       *
       * @default false
       */
      disableHelp?: boolean
      /**
       * Default percentage of content layout max width
       *
       * @default 100 (100%)
       */
      defaultMaxWidth?: number
      /**
      * Disable Layout Max Width animation
      */
      disableAnimation?: boolean,
    }
    /**
     * Page layout max width slider configuration
     */
    pageLayoutMaxWidth?: {
      /**
       * Disable page layout max width help tooltip
       *
       * @default false
       */
      disableHelp?: boolean
      /**
       * Default percentage of page layout max width
       *
       * @default 800 (80%)
       */
      defaultMaxWidth?: number
      /**
      * Disable Layout Max Width animation
      */
      disableAnimation?: boolean,
    }
  }
  /**
   * Spotlight configuration
   */
  spotlight?: {
    /**
     * Disable spotlight
     *
     * @default false
     */
    disabled?: boolean
    /**
     * Disable spotlight help tooltip
     *
     * @default false
     */
    disableHelp?: boolean
    /**
     * Spotlight hover block color
     *
     * @default 'rgb(240 197 52 / 10%)'
     */
    hoverBlockColor?: string
    /**
     * Default toggle for spotlight
     *
     * @default false
     */
    defaultToggle?: boolean
    /**
     * Default style for spotlight
     *
     * @default SpotlightStyle.Aside (2)
     */
    defaultStyle?: SpotlightStyle
  }
}
```

:::

## 国际化

::: warning 注意
阅读增强插件并没有使用 [vue-i18n](https://vue-i18n.intlify.dev/) 来作为国际化的工具库，因为绝大多数 VitePress 可能是直接使用的 [VitePress 自带的国际化功能](https://vitepress.dev/guide/i18n) 来进行国际化的，所以阅读增强插件的本地化文案并不能通过 `vue-i18n` 来覆盖文案，但是你可以通过 [配置](#配置) 中的 `locales` 字段来覆盖本地化的文案。
:::

阅读增强插件默认提供了国际化的支持，默认支持了英文和简体中文。

你可以通过配置来对插件的本地化文案进行复写，在开始配置之前，你需要了解 VitePress 是如何进行国际化的：[VitePress 的国际化](https://vitepress.dev/guide/i18n)。阅读增强插件默认会读取 VitePress 的语言字段，所以你在配置的时候需要注意将国际化的语言代码与 VitePress 的语言代码保持一致。

### 如何在 VitePress 中进行配置

在 [配置](#配置) 章节中，我们已经了解到了如何在 VitePress 中为阅读增强插件提供配置选项，我们在配置选项中添加 `locales` 字段就可以配置国际化了：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import type { Options } from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import { InjectionKey } from '@nolebase/vitepress-plugin-enhanced-readabilities/client'

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
        'zh-CN': { // 配置简体中文 // [!code ++]
          title: { // [!code ++]
            title: '阅读增强插件', // [!code ++]
          } // [!code ++]
        }, // [!code ++]
        'en': { // 配置英文 // [!code ++]
          title: { // [!code ++]
            title: 'Enhanced Readabilities Plugin', // [!code ++]
          } // [!code ++]
        } // [!code ++]
      } // [!code ++]
    } as Options)

    // 其他部分的代码...
  },
}
```

### 国际化字段选项

::: details 完整的国际化字段选项

```typescript twoslash
/**
 * Locale
 */
export interface Locale {
  /**
   * Title
   *
   * Used to configure the title of the menu located on the top-right corner of the page.
   */
  title?: {
    /**
     * Title text
     */
    title?: string
    /**
     * Title aria-label
     */
    titleAriaLabel?: string
  }
  /**
   * Layout switch configuration
   *
   * Used to configure the layout switch menu.
   */
  layoutSwitch?: {
    /**
     * Title text
     */
    title?: string
    /**
     * Title aria-label
     */
    titleAriaLabel?: string
    /**
     * Title descriptive help message
     */
    titleHelpMessage?: string
    /**
     * Title warning message for navigation menu in small screen
     */
    titleScreenNavWarningMessage?: string
    /**
     * Expand all option text
     */
    optionFullWidth?: string
    /**
     * Expand all option aria-label
     */
    optionFullWidthAriaLabel?: string
    /**
     * Expand all option help message
     */
    optionFullWidthHelpMessage?: string
    /**
     * Sidebar adjustable only option text
     */
    optionSidebarWidthAdjustableOnly?: string
    /**
     * Sidebar adjustable only option aria-label
     */
    optionSidebarWidthAdjustableOnlyAriaLabel?: string
    /**
     * Sidebar adjustable only option help message
     */
    optionSidebarWidthAdjustableOnlyHelpMessage?: string
    /**
     * Both width adjustable option text
     */
    optionBothWidthAdjustable?: string
    /**
     * Both width adjustable option aria-label
     */
    optionBothWidthAdjustableAriaLabel?: string
    /**
     * Both width adjustable option help message
     */
    optionBothWidthAdjustableHelpMessage?: string
    /**
     * Original option
     */
    optionOriginalWidth?: string
    /**
     * Original option aria-label
     */
    optionOriginalWidthAriaLabel?: string
    /**
     * Original option help message
     */
    optionOriginalWidthHelpMessage?: string

    /**
     * Content layout max width slider configuration
     */
    contentLayoutMaxWidth?: {
      /**
       * Title text
       */
      title?: string
      /**
       * Title aria-label
       */
      titleAriaLabel?: string
      /**
       * Title descriptive help message
       */
      titleHelpMessage?: string
      /**
       * Title warning message for navigation menu in small screen
       */
      titleScreenNavWarningMessage?: string
      /**
       * Content layout max width slider functionality title in help tooltip popup
       */
      slider?: string
      /**
       * Content layout max width slider functionality aria-label in help tooltip popup
       */
      sliderAriaLabel?: string
      /**
       * Content layout max width slider functionality descriptive help message in help tooltip popup
       */
      sliderHelpMessage?: string
    }
    /**
     * Page layout max width slider configuration
     */
    pageLayoutMaxWidth?: {
      /**
       * Title text
       */
      title?: string
      /**
       * Title aria-label
       */
      titleAriaLabel?: string
      /**
       * Title descriptive help message
       */
      titleHelpMessage?: string
      /**
       * Title warning message for navigation menu in small screen
       */
      titleScreenNavWarningMessage?: string
      /**
       * Page layout max width slider functionality title in help tooltip popup
       */
      slider?: string
      /**
       * Page layout max width slider functionality aria-label in help tooltip popup
       */
      sliderAriaLabel?: string
      /**
       * Page layout max width slider functionality descriptive help message in help tooltip popup
       */
      sliderHelpMessage?: string
    }
  }
  /**
   * Spotlight configuration
   */
  spotlight?: {
    /**
     * Title text
     */
    title?: string
    /**
     * Title aria-label
     */
    titleAriaLabel?: string
    /**
     * Title help message
     */
    titleHelpMessage?: string
    /**
     * Title warning message for navigation menu in small screen
     */
    titleScreenNavWarningMessage?: string
    /**
     * Option: On text
     */
    optionOn?: string
    /**
     * Option: On aria-label
     */
    optionOnAriaLabel?: string
    /**
     * Option: On help message
     */
    optionOnHelpMessage?: string
    /**
     * Option: Off text
     */
    optionOff?: string
    /**
     * Option: Off aria-label
     */
    optionOffAriaLabel?: string
    /**
     * Option: Off help message
     */
    optionOffHelpMessage?: string
    styles?: {
      /**
       * Title text
       */
      title?: string
      /**
       * Title aria-label
       */
      titleAriaLabel?: string
      /**
       * Title help message
       */
      titleHelpMessage?: string
      /**
       * Title warning message for navigation menu in small screen
       */
      titleScreenNavWarningMessage?: string
      /**
       * Option: Under text
       */
      optionUnder?: string
      /**
       * Option: Under aria-label
       */
      optionUnderAriaLabel?: string
      /**
       * Option: Under help message
       */
      optionUnderHelpMessage?: string
      /**
       * Option: Aside text
       */
      optionAside?: string
      /**
       * Option: Aside aria-label
       */
      optionAsideAriaLabel?: string
      /**
       * Option: Aside help message
       */
      optionAsideHelpMessage?: string
    }
  }
}
```

:::

## 无障碍

阅读增强插件默认提供了无障碍的支持，你可以通过 [配置](#配置) 来对无障碍的文案进行复写，使用方法和 [国际化](#国际化) 一样，有关无障碍有哪些文案可以配置，请参阅 [国际化字段选项](#国际化字段选项)。

## 遇到了问题？

### 遭遇了 `Cannot find module ... or its corresponding type declarations` 错误？

<!--@include: @/pages/zh-CN/snippets/troubleshooting-cannot-find-module.md-->

### 请求的模块 `vitepress` 没有提供名为 `useData` 的导出 或者 请求的模块 `vitepress` 没有提供名为 `useRoute` 的导出

如果你已经正确配置好了 VitePress，你可能会在首次配置阅读增强插件的时候遇到如下的问题：

错误信息：`The requested module 'vitepress' does not provide an export named 'useData'` 或者 `The requested module 'vitepress' does not provide an export named 'useRoute'`

完整的命令行报错：

```shell
build error:
file://Docs/dist/index.js:2
import { useData as Fe, withBase as tt, useRoute as nt } from "vitepress";
         ^^^^^^^
SyntaxError: The requested module 'vitepress' does not provide an export named 'useData'
    at ModuleJob._instantiate (node:internal/modules/esm/module_job:124:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:190:5)
```

无论是因为没有 `useData` 还是 `useRoute`，你都可以参考下面的步骤进行检查和参考。

这样的问题可能由几个因素导致：

#### VitePress 版本并不兼容

你也许真的使用了一个不支持 [`useData()`](https://vitepress.dev/reference/runtime-api#usedata) 函数或者 [`useRoute()`](https://vitepress.dev/reference/runtime-api#useroute) 功能的 VitePress 版本。

一般而言通过运行 VitePress 启动脚本 `docs:dev` 可以检查 VitePress 的版本：

::: code-group

```shell [pnpm]
pnpm docs:dev
```

```shell [npm]
npm run docs:dev
```

```shell [yarn]
yarn docs:dev
```

:::

运行之后结果应该是这样的：

```shell
> @nolebase/integrations-docs@ docs:dev /nolebase/integrations/docs
> vitepress dev


  vitepress v1.0.0-rc.12

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

这行 **vitepress v1.0.0-rc.12** 就是你的 VitePress 的版本号啦，Nólëbase 集成默认要求大于等于 `vitepress v1.0.0-beta.1` 这个版本，如果你的版本是 alpha 甚至更古老的版本，那么你需要升级 VitePress 到最新的版本。

#### 缺少了在章节 [添加 Vite 相关的配置](#添加-vite-相关的配置) 中的配置

如果你不小心跳过了章节 [添加 Vite 相关的配置](#添加-vite-相关的配置) 中的配置，那这将会导致阅读增强插件内部对于 VitePress 相关组件的引用在构建文档时无法被正确解析和处理。也正因为没有被处理到位，所以我们需要确保根据 [添加 Vite 相关的配置](#添加-vite-相关的配置) 中的配置来配置 VitePress。
