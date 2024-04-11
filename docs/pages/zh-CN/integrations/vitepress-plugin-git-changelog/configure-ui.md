# 配置 UI 组件

基于 Git 的页面历史插件当前提供有关**国际化**和**贡献者**相关的配置选项。

## 在 VitePress 项目中配置

有两种方式可以配置内容：

- [在安装 Vue 插件的时候进行配置](#在安装-vue-插件的时候进行配置)
- [单独使用 Vue 的依赖注入的能力进行配置](#单独使用-vue-的依赖注入的能力进行配置)

### 在安装 Vue 插件的时候进行配置

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client' // [!code ++]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // Rest of the code...
  },
  enhanceApp({ app }) {
    // Rest of the code...

    app.use(NolebaseGitChangelogPlugin, { // [!code ++]
      // 把选项填写在这里吧... // [!code ++]
    }) // [!code ++]

    // Rest of the code...
  },
}
```

### 单独使用 Vue 的依赖注入的能力进行配置

由于 VitePress 对于默认主题没有提供更多关于主题配置的拓展的功能，从某种程度上来说，如果我们直接修改 VitePress 的配置文件为插件提供配置的话对类型检查和配置的维护并不友好，所以这里我们使用 [Vue 的依赖注入](https://vuejs.org/api/composition-api-dependency-injection.html#inject)来提供配置：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import { InjectionKey } from '@nolebase/vitepress-plugin-git-changelog/client' // [!code ++]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // 剩下的代码...
  },
  enhanceApp({ app }) {
    // 剩下的代码...

    app.provide(InjectionKey, { // [!code ++]
      // 配置... // [!code ++]
    }) // [!code ++]

    // 剩下的代码...
  },
}
```

### 选项 `mapContributors` - 为贡献者添加数据映射

配置选项中的 `mapContributors` 字段用于映射贡献者信息，可以用来将获取到的 Git 的日志信息中的包括名称和邮箱的贡献者信息映射为另一个贡献者。

如果我们假设有如下的 Git 日志：

```plaintext
commit 1
Author: John Doe <john.doe@example.com>
Date:   Fri Oct 1 12:00:00 2021 +0800

    Add a new feature

commit 2
Author: John Doe <john.doe@anothersite.com>

    Fix a bug
```

现在我们有两个来自同一个人的提交，只有电子邮件地址不同。在不进行任何配置的默认情况下，插件会将它们视为两个不同的贡献者。
这种情况通常是因为你或者其他贡献者更改了自己的电子邮件地址。

要解决这个问题，我们可以使用 `mapContributors` 选项：

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import { InjectionKey } from '@nolebase/vitepress-plugin-git-changelog/client' // [!code focus]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // Rest of the code...
  },
  enhanceApp({ app }) {
    // Rest of the code...

    app.provide(InjectionKey, { // [!code focus]
      mapContributors: [ // [!code focus]
        { // [!code focus]
          name: 'John Doe', // [!code focus]
          email: 'john.doe@example.com', // [!code focus]
          emailAliases: ['john.doe@anothersite.com'] // [!code focus]
        } // [!code focus]
      ] // [!code focus]
    }) // [!code focus]

    // Rest of the code...
  },
}
```

## 配置选项

::: details 完整的可以配置的选项

```typescript twoslash
interface SocialEntry {
  type: 'github' | 'twitter' | 'email' | string
  icon: string
  link: string
}

interface Locale extends Record<string, any> {
  /**
   * What to display when there are no logs
   */
  noLogs?: string
  /**
   * What to display when there are no contributors
   */
  noContributors?: string
  /**
   * What to display when the page was last edited
   */
  lastEdited?: string
  /**
   * The name of the locale to use for date-fns
   */
  lastEditedDateFnsLocaleName?: string
  /**
   * What to display when the user wants to view the full history
   */
  viewFullHistory?: string
  /**
   * What to display when the commit was committed
   */
  committedOn?: string
}
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
   *      noLogs: 'No recent changes',
   *      lastEdited: 'This page was last edited {{daysAgo}}',
   *      lastEditedDateFnsLocaleName: 'enUS',
   *      viewFullHistory: 'View full history',
   *      committedOn: ' on {{date}}',
   *    },
   *    'zh-CN': {
   *      noLogs: '暂无最近变更历史',
   *      lastEdited: '本页面最后编辑于 {{daysAgo}}',
   *      lastEditedDateFnsLocaleName: 'zhCN',
   *      viewFullHistory: '查看完整历史',
   *      committedOn: '于 {{date}} 提交',
   *     },
   *   }
   * }
   * ```
   */
  locales?: Record<string, Locale>
  mapContributors?: Array<{
    /**
     * The overriding display name of the contributor
     */
    name?: string
    /**
     * The overriding avatar of the contributor
     */
    avatar?: string
    /**
     * The overriding email of the contributor
     */
    email?: string
    /**
     * Whether to add a link to the contributor's profile
     */
    links?: SocialEntry[]
    /**
     * More names to be recognized as the same contributor.
     *
     * Useful when you changed your name or email address in the past.
     */
    nameAliases?: string[]
    /**
     * More emails to be recognized as the same contributor.
     *
     * Useful when you changed your email address in the past.
     */
    emailAliases?: string[]
  }>
}
```

:::

## 国际化

::: warning 注意
基于 Git 的页面历史插件并没有使用 [vue-i18n](https://vue-i18n.intlify.dev/) 来作为国际化的工具库，因为绝大多数 VitePress 可能是直接使用的 [VitePress 自带的国际化功能](https://vitepress.dev/guide/i18n) 来进行国际化的，所以基于 Git 的页面历史插件的本地化文案并不能通过 `vue-i18n` 来覆盖文案，但是你可以通过 [配置](#配置) 中的 `locales` 字段来覆盖本地化的文案。
:::

基于 Git 的页面历史插件默认提供了国际化的支持，默认支持了英文和简体中文。

你可以通过配置来对插件的本地化文案进行复写，在开始配置之前，你需要了解 VitePress 是如何进行国际化的：[VitePress 的国际化](https://vitepress.dev/guide/i18n)。基于 Git 的页面历史插件默认会读取 VitePress 的语言字段，所以你在配置的时候需要注意将国际化的语言代码与 VitePress 的语言代码保持一致。

### 如何在 VitePress 中进行配置

在 [配置](#配置) 章节中，我们已经了解到了如何在 VitePress 中为基于 Git 的页面历史插件提供配置选项，我们在配置选项中添加 `locales` 字段就可以配置国际化了：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import { InjectionKey } from '@nolebase/vitepress-plugin-inline-link-preview/client' // [!code ++]

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
/**
 * Locale
 */
interface Locale {
  /**
   * What to display when there are no logs
   */
  noLogs?: string
  /**
   * What to display when there are no contributors
   */
  noContributors?: string
  /**
   * What to display when the page was last edited
   */
  lastEdited?: string
  /**
   * The name of the locale to use for date-fns
   */
  lastEditedDateFnsLocaleName?: string
  /**
   * What to display when the user wants to view the full history
   */
  viewFullHistory?: string
  /**
   * What to display when the commit was committed
   */
  committedOn?: string
}
```

:::

## 无障碍

基于 Git 的页面历史插件默认提供了无障碍的支持，你可以通过 [配置](#配置) 来对无障碍的文案进行复写，使用方法和 [国际化](#国际化) 一样，有关无障碍有哪些文案可以配置，请参阅 [国际化字段选项](#国际化字段选项)。

## 更多自定义能力？

可以的，没问题。

::: danger 开始之前

默认情况下，`GitChangelog` Vite 插件会自动为您配置 `optimizeDeps` 和 `ssr` 选项。但是，如果您想要亲自导入 UI 小组件而不需要数据获取插件的话，则必须像这样手动配置 `optimizeDeps` 和 `ssr` 选项：

```typescript twoslash
import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    optimizeDeps: {
      include: [
        // @rive-app/canvas is a CJS/UMD module, so it needs to be included here
        // for Vite to properly bundle it.
        '@nolebase/vitepress-plugin-git-changelog > @nolebase/ui > @rive-app/canvas',
      ],
      exclude: [
        '@nolebase/vitepress-plugin-git-changelog/client',
      ],
    },
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-git-changelog',
        // @nolebase/ui required here as noExternal to avoid the following error:
        // TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".vue" for ...
        // Read more here: https://github.com/vuejs/vitepress/issues/2915
        // And here: https://stackblitz.com/edit/vite-gjz9zf?file=docs%2F.vitepress%2Fconfig.ts
        '@nolebase/ui',
      ],
    },
    // other vite configurations...
  }
})
```

:::

<!--@include: @/pages/zh-CN/snippets/configure-on-your-own-warning.md-->

基于 Git 的页面历史插件会导出内部使用的组件，所以如果你不喜欢默认组件的样式和封装，你可以创建自己的组件来代替它们。

### 作为 Vue 插件使用

```typescript twoslash
import {
  NolebaseGitChangelogPlugin // [!code focus]
} from '@nolebase/vitepress-plugin-git-changelog/client'
```

如果您正在使用 VitePress，并希望将其安装到 Vue 实例中，可以这样做：

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client' // [!code ++]

// Rest of the code...

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // Rest of the code...
  },
  enhanceApp({ app }) {
    app.use(NolebaseGitChangelogPlugin) // [!code ++]
  },
}
```

#### 按需导入页面历史组件

```typescript twoslash
import {
  NolebaseGitChangelog,  // [!code focus]
} from '@nolebase/vitepress-plugin-git-changelog/client'
```

#### 按需导入贡献者组件组件

```typescript twoslash
import {
  NolebaseGitContributors,  // [!code focus]
} from '@nolebase/vitepress-plugin-git-changelog/client'
```

