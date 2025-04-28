---
title: Git-based page histories
category: Git-based page histories
sidebarTitle: Configure UI
---

# Configuration

::: danger Deprecating the `mapAuthors` field for UI component options

We migrated the `mapAuthors` configuration to [configure Vite plugins](./configure-vite-plugins#option-mapauthors---map-contributors-information).

For specific migration information, see [Migrating from v2 to v3](/pages/en/releases/migrations/v2-to-v3).

:::

The Git-based page histories plugin currently provides configuration options related to **Internationalization** and **UI** section.

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

## Options inside

::: warning Deprecating warning

We have changed the structure of locales config since `2.0.0`, and the old structure will be deprecated in the next major version. Please update your configuration according to the new structure. For migration guides, see [Migrate from v1 to v2](/pages/en/releases/migrations/v1-to-v2).

:::

::: details Complete configurable options

```typescript twoslash
import type { Locale } from '@nolebase/vitepress-plugin-git-changelog/client'
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
   *         title: '页面历史',
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
  /**
   * Number of commit hash letters to display
   *
   * @default 7
   */
  numCommitHashLetters?: number
  /**
   * Whether to display the relative time of the commit
   * in the format as 'x days ago' or 'x hours ago'
   */
  commitsRelativeTime?: boolean
  /**
   * Whether to hide the changelog h2 header
   */
  hideChangelogHeader?: boolean
  /**
   * Whether to hide the changelog "No changes" text when there are no changes
   */
  hideChangelogNoChangesText?: boolean
  /**
   * Whether to hide the contributors h2 header
   */
  hideContributorsHeader?: boolean
  /**
   * Whether to hide the sort by button
   */
  hideSortBy?: boolean
  /**
   *  Whether to display authors of commits right inside of commit line
   */
  displayAuthorsInsideCommitLine?: boolean
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

We have changed the structure of locales config since `2.0.0`, and the old structure will be deprecated in the next major version. Please update your configuration according to the new structure. For migration guides, see [Migrate from v1 to v2](/pages/en/releases/migrations/v1-to-v2).

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

## Adding Contributors for Specific Pages

In certain situations, Git records may miss some contributors. To address this issue, we provide a Front Matter key that allows you to supplement author information for specific pages.

You can add missing contributor information in the Front Matter of the Markdown file using the following format:

```md
---
authors: ['author1', 'author2']
---

<!-- body -->
```

These contributors will be merged with the authors retrieved from Git.

Please note that the contributors specified here will not go through the `mapAuthorsByNameAlias` data mapping of the [Vite plugin `mapAuthors` option](./configure-vite-plugins.md#option-mapauthors-map-contributors-information). Therefore, you need to use the `name` attribute values from the `mapAuthors` array for each author. Otherwise, the contributor will be considered an independent author.

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
