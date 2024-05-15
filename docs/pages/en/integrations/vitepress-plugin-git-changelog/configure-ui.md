# Configuration

The Git-based page histories plugin currently provides configuration options related to **Internationalization** and **Contributors** section.

## Configure in VitePress

There are two ways to configure.

- [Supply options when installing the Vue plugin](#supply-options-when-installing-the-vue-plugin).
- [Supply options with Vue's dependency injection](#supply-options-with-vues-dependency-injection).

### Supply options when installing the Vue plugin

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

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
      // Configuration... // [!code ++]
    }) // [!code ++]

    // Rest of the code...
  },
}
```

### Supply options with Vue's dependency injection

Since VitePress doesn't provide more functionality for the default theme to extend the default theme configuration, it is not friendly to the type checking and maintenance of the configuration if we directly modify the major VitePress configuration object to provide options for the plugin.

Therefore we offer a way with [Vue's dependency injection](https://vuejs.org/api/composition-api-dependency-injection.html#injection) to provide options and configuration for the plugin:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import { InjectionKey } from '@nolebase/vitepress-plugin-git-changelog/client' // [!code ++]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // Rest of the code...
  },
  enhanceApp({ app }) {
    // Rest of the code...

    app.provide(InjectionKey, { // [!code ++]
      // Configuration... // [!code ++]
    }) // [!code ++]

    // Rest of the code...
  },
}
```

### Option `mapAuthors` - Map contributors' information

The `mapAuthors` field in the configuration options is used to map the contributors' information. You can provide the `mapAuthors` field in the configuration options to map the contributors' information, including the display name, avatar, email, social links, and aliases.

Let's say we have these logs:

```plaintext
commit 1
Author: John Doe <john.doe@example.com>
Date:   Fri Oct 1 12:00:00 2021 +0800

    Add a new feature

commit 2
Author: John Doe <john.doe@anothersite.com>

    Fix a bug
```

We now have two commits from the same person, with only the email address is different. By default, the plugin will treat them as two different contributors.
Such case happens when you changed your name or email address in the past.

To solve this, you can provide the `mapAuthors` field in the configuration options to map the contributors' information:

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
      mapAuthors: [ // [!code focus]
        { // [!code focus]
          name: 'John Doe', // [!code focus]
          username: 'john_doe', // [!code focus]
          mapByEmailAliases: ['john.doe@anothersite.com'] // [!code focus]
        } // [!code focus]
      ] // [!code focus]
    }) // [!code focus]

    // Rest of the code...
  },
}
```

## Options inside

::: warning Deprecating warning

We have changed the structure of locales config since `2.0.0-rc14`, and the old structure will be deprecated in the next major version. Please update your configuration according to the new structure. For migration guides, see [Migrate from v1 to v2](/pages/en/releases/migrations/v1-to-v2).

:::

::: details Complete configurable options

```typescript twoslash
interface SocialEntry {
  type: 'github' | 'twitter' | 'email' | string
  icon: string
  link: string
}

interface Locale extends Record<string, any> {
  /**
   * The changelog section configuration
   */
  changelog?: {
    /**
     * The title of the changelog section
     */
    title?: string
    /**
     * What to display when there are no logs
     */
    noData?: string
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
  /**
   * The contributors section configuration
   */
  contributors?: {
    /**
     * The title of the contributors section
     */
    title?: string
    /**
     * What to display when there are no contributors
     */
    noData?: string
  }
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
   *      changelog: {
   *        title: 'Changelog',
   *        noData: 'No recent changes',
   *        lastEdited: 'This page was last edited {{daysAgo}}',
   *        lastEditedDateFnsLocaleName: 'enUS',
   *        viewFullHistory: 'View full history',
   *        committedOn: ' on {{date}}',
   *      }
   *    },
   *    'zh-CN': {
   *       changelog: {
   *         title: '页面历史'
   *         noData: '暂无最近变更历史',
   *         lastEdited: '本页面最后编辑于 {{daysAgo}}',
   *         lastEditedDateFnsLocaleName: 'zhCN',
   *         viewFullHistory: '查看完整历史',
   *         committedOn: '于 {{date}} 提交',
   *       }
   *     },
   *   }
   * }
   * ```
   */
  locales?: Record<string, Locale>
  mapAuthors?: Array<{
    /**
     * The overriding display name of the contributor
     */
    name?: string
    /**
     * The overriding GitHub, GitLab, Gitea username of the contributor
     */
    username?: string
    /**
     * The overriding avatar of the contributor
     */
    avatar?: string
    /**
     * Whether to add a link to the contributor's profile
     */
    links?: string | SocialEntry[]
    /**
     * More names to be recognized as the same contributor.
     *
     * Useful when you changed your name or email address in the past.
     */
    mapByNameAliases?: string[]
    /**
     * More emails to be recognized as the same contributor.
     *
     * Useful when you changed your email address in the past.
     */
    mapByEmailAliases?: string[]
  }>
}
```

:::

For more information on internationalization configuration, see [Internationalization](#internationalization).

## Internationalization

::: warning Caution
The Git-based page histories plugin does not use [vue-i18n](https://vue-i18n.intlify.dev/) as an i18n toolkit since most of VitePress probably uses [VitePress's internationalization features](https://vitepress.dev/guide/i18n) for internationalization, so it is impossible to override the fields of the localized text of the Git-based page histories plugin with `vue-i18n`, but you can achieve it with the `locales` field in [Configuration](#configuration).
:::

The same as other VitePress plugins, Git-based page histories plugin supports internationalization by default, with English and Simplified Chinese as supported languages.

You can override the plugin's localized text through configuration, and before you start, you need to understand how VitePress is internationalized: [Internationalization of VitePress](https://vitepress.dev/guide/i18n). The Git-based page histories plugin reads the VitePress language field by default, so you'll need to be careful to keep the internationalized language code the same as the VitePress language code when configuring it.

### Configure in VitePress

In the [Configuration](#configuration) section, we've learned how to provide configuration options for the Git-based page histories plugin in VitePress, and we can configure internationalization by adding the `locales` field to the configuration options:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import { InjectionKey } from '@nolebase/vitepress-plugin-inline-link-preview/client' // [!code ++]

// Rest of code...

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // Rest of code...
  },
  enhanceApp({ app }) {
    // Rest of code...

    app.provide(InjectionKey, { // [!code ++]
      locales: { // i18n // [!code ++]
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
    }) // [!code ++]

    // Rest of code...
  },
}
```

### Locales options

::: warning Deprecating warning

We have changed the structure of locales config since `2.0.0-rc14`, and the old structure will be deprecated in the next major version. Please update your configuration according to the new structure. For migration guides, see [Migrate from v1 to v2](/pages/en/releases/migrations/v1-to-v2).

:::

::: details Complete internationalization field options

```typescript twoslash
/**
 * Locale
 */
interface Locale {
  /**
   * The changelog section configuration
   */
  changelog?: {
    /**
     * The title of the changelog section
     */
    title?: string
    /**
     * What to display when there are no logs
     */
    noData?: string
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
  /**
   * The contributors section configuration
   */
  contributors?: {
    /**
     * The title of the contributors section
     */
    title?: string
    /**
     * What to display when there are no contributors
     */
    noData?: string
  }
}
```

:::

## Accessibility

The Git-based page histories plugin provides accessibility support by default. You can override accessible labels (aria-label) via [Configuration](#configuration) in the same way as [Internationalization](#internationalization), see [Locales Options](#locales-options) for a description of what labels can be configured for accessibility.

## More customizations?

It is possible though.

<!--@include: @/pages/en/snippets/configure-on-your-own-warning.md-->

The Git-based page histories plugin exports the components it uses internally, so if you don't like the style and encapsulation of the default components, you can always create your own components and use them instead.

::: danger Before you start

By default, the `GitChangelog` plugin for Vite will automatically configure the `optimizeDeps` and `ssr` options for you. However, if you just want the UI widget without the data fetching plugin, you must configure the `optimizeDeps` and `ssr` options manually like this:

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

### Install as a Vue plugin

```typescript twoslash
import {
  NolebaseGitChangelogPlugin // [!code focus]
} from '@nolebase/vitepress-plugin-git-changelog/client'
```

If you are working on a VitePress and wanted to install it into Vue instance, you can do it like this:

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

export default Theme
```

#### Import changelog components on demand

```typescript twoslash
import {
  NolebaseGitChangelog,  // [!code focus]
} from '@nolebase/vitepress-plugin-git-changelog/client'
```

#### Import contributors components on demand

```typescript twoslash
import {
  NolebaseGitContributors,  // [!code focus]
} from '@nolebase/vitepress-plugin-git-changelog/client'
```
