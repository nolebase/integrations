---
title: Enhanced Readabilities
category: Enhanced Readabilities
---

<script setup>
import packageJSON from '~/packages/vitepress-plugin-enhanced-readabilities/package.json'
</script>

# Enhanced Readabilities <Badge type="tip" :text="`v${packageJSON.version}`" />

## Demo

See the <span i-icon-park-outline:book-open text-red-400 /> button in the upper right corner on navigation bar? You can use your mouse to hover over it to see the supported features, click on the one you are interested in to see the effect!

::: warning Caution
The "**Layout Switch**" and "**Spotlight**" features of Enhanced Readabilities plugin are temporarily unavailable on screens on mobile devices, so if you're reading on mobile but still want to see the results, check out the video demo below.
:::

::: details Video demo
<video controls muted>
  <source src="./assets/demo-video-1.en.mov">
</video>
:::

## Why

I often find myself uncomfortable reading code blocks and other wide elements in VitePress-built sites, and this discomfort is often due to the presence of code blocks and elements in the body of the text that need to be scrolled through, even though shorter content is easier to read and scan, the scrolling can worse the reading experience entirely, so this plugin tries to solve this (and many more) problems from another angle.

### Problems solved

1. Expand the width of the content on a large screen, in order to better utilize the space to facilitate the reading of some of the oversized and wide code blocks and elements.
2. Users and readers may have dyslexia, widening the layout may not be conducive to read multiple lines of text, there may be a serial reading situation, so we need an in-line reading aid .
3. When reading languages that use spaces to separate words, such as English, we need a word-level reading aid, such as bionic reading. (In progress)

> These are just some of the issues I can think of that I've been able to address in my long hours of learning and using the plugin, and the plugin doesn't limit itself to working on these issues. You can also open a separate Issue in [GitHub](https://github.com/nolebase/integrations) to discuss problems you think might be solved and your ideas.

I know that this kind of functionality can be made into a browser plugin to cover a wide variety of different sites, but I think VitePress is clearly a better and faster testing playground, and since Nólëbase is based on VitePress, I wanted to make this plugin as part of an integration that would make it easy for me and everyone else to integrate it directly into the VitePress project and give it a try.

### Features included

1. Layout switch
2. Spotlight

## How to use

### Installation

> I can't wait, just tell me how to get it into my project!

You can install `@nolebase/vitepress-plugin-enhanced-readabilities` as one of your VitePress project dependencies with the following command:

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

### Integrate with VitePress

It consists two major steps to integrate the Enhanced Readabilities plugin into your VitePress project:

1. [Add plugin-specific options into configurations of Vite](#add-plugin-specific-options-into-configurations-of-vite)
2. [Add plugin into the Theme options of VitePress](#add-plugin-into-the-theme-options-of-vitepress)

#### Add plugin-specific options into configurations of Vite

First of all, in VitePress's [**primary configuration file**](https://vitepress.dev/reference/site-config#config-resolution) (not this is not a **theme configuration file**, it's usually located at `docs/.vitepress/config.ts`, file paths and extensions may be vary), you need to supply some of the [Server-Side Rendering related options](https://vitejs.dev/guide/ssr.html#ssr-externals) in the root configuration object of [Vite](https://vitejs.dev).

Add the Enhanced Readabilities plugin package name `@nolebase/vitepress-plugin-enhanced-readabilities` into the Vite options that required by VitePress to process this plugin:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

<!--@include: @/pages/en/snippets/configure-tsconfig.md-->

```typescript twoslash
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: { // [!code ++]
    optimizeDeps: { // [!code ++]
      exclude: [ // [!code ++]
        '@nolebase/vitepress-plugin-enhanced-readabilities/client', // [!code ++]
        'vitepress', // [!code ++]
        '@nolebase/ui', // [!code ++]
      ], // [!code ++]
    }, // [!code ++]
    ssr: { // [!code ++]
      noExternal: [ // [!code ++]
        // If there are other packages that need to be processed by Vite, you can add them here. // [!code hl]
        '@nolebase/vitepress-plugin-enhanced-readabilities', // [!code ++]
        '@nolebase/ui', // [!code ++]
      ], // [!code ++]
    }, // [!code ++]
  }, // [!code ++]
  lang: 'en',
  title: 'Site Name',
  themeConfig: {
    // rest of the options...
  }
  // rest of the options...
})
```

You might have configured the separated [Vite configuration file](https://vitejs.dev/config/) (e.g. `vite.config.ts`) if you are already mastered Vite. In this case, you could ignore the above configuration and add the following configuration to your Vite configuration file:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

<!--@include: @/pages/en/snippets/configure-tsconfig.md-->

```typescript twoslash
import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    optimizeDeps: {
      exclude: [ // [!code ++]
        '@nolebase/vitepress-plugin-enhanced-readabilities/client', // [!code ++]
        'vitepress', // [!code ++]
        '@nolebase/ui', // [!code ++]
      ], // [!code ++]
    },
    ssr: { // [!code ++]
      noExternal: [ // [!code ++]
        // If there are other packages that need to be processed by Vite, you can add them here. // [!code hl]
        '@nolebase/vitepress-plugin-enhanced-readabilities', // [!code ++]
        '@nolebase/ui', // [!code ++]
      ], // [!code ++]
    }, // [!code ++]
    plugins: [
      // other vite plugins...
    ],
    // other vite configurations...
  }
})
```

If you haven't configured any of the separated [Vite configuration file](https://vitejs.dev/config/) (e.g. `vite.config.ts`) before but still want to have a try with the above configuration, you can create a `vite.config.ts` file in the root directory of your VitePress project and add the above configuration to it. (Don't forget to install `vite` through your package manager as well!)

#### Add plugin into the Theme options of VitePress

In VitePress's [**theme configuration file**](https://vitepress.dev/reference/default-theme-config#default-theme-config) (note that it's not a **configuration file**, it's usually located at `docs/.vitepress/theme/index.ts`, file paths and extensions may be vary), import `@nolebase/vitepress-plugin-enhanced-readabilities` package and add it to the `Layout` section as a slot:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

<!--@include: @/pages/en/snippets/configure-tsconfig.md-->

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
      // A enhanced readabilities menu for wider screens
      'nav-bar-content-after': () => h(NolebaseEnhancedReadabilitiesMenu), // [!code ++]
      // A enhanced readabilities menu for narrower screens (usually smaller than iPad Mini)
      'nav-screen-content-after': () => h(NolebaseEnhancedReadabilitiesScreenMenu), // [!code ++]
    })
  },
  enhanceApp() {
    // other configurations...
  },
}

export default Theme
```

:::

::: warning VitePress style glitched?
You may notice a slight misalignment in the style of the navigation bar after integrating the navigation bar component with social links configured, this is because VitePress native social links component have a **negative 16 pixel right margin** as deviation by default.

You can fix this by adding the following style to the `.vitepress/theme/styles` directory or to the `main.css` style file under the `.vitepress/theme/styles` folder:

```css
.VPSocialLinks.VPNavBarSocialLinks.social-links {
  margin-right: 0;
}
```

If you don't have this file, you can create a `main.css` file and import this style file in the VitePress theme configuration file `.vitepress/theme/index.ts`:

```typescript
import './styles/main.css' // [!code ++]
```

:::

::: info Already have `h()` function being called after `nav-bar-content-after` or `nav-screen-content-after`?

If you have already configured other components for your `nav-bar-content-after` or `nav-screen-content-after`, you can work around this by rewriting them as arrays starting with `[` and ending with `]`, as in the following writeup:

```typescript
// Rest of the code...

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(OtherComponent), // Your other nav components // [!code --]
      'nav-bar-content-after': () => [ // [!code ++]
        h(OtherComponent), // Your other nav components // [!code ++]
        h(NolebaseEnhancedReadabilitiesMenu), // Enhanced Readabilities menu // [!code ++]
      ], // [!code ++]
      'nav-screen-content-after': () => h(OtherComponent), // Your other nav components // [!code --]
      'nav-screen-content-after': () => [ // [!code ++]
        h(OtherComponent), // Your other nav components // [!code ++]
        h(NolebaseEnhancedReadabilitiesScreenMenu), // Enhanced Readabilities menu for small screens // [!code ++]
      ], // [!code ++]
    })
  },
  enhanceApp({ app }) {
    // other configurations...
  },
}

export default Theme
```

:::

### Integrate on-demand

<!--@include: @/pages/en/snippets/configure-on-your-own-warning.md-->

The Enhanced Readabilities plugin exports the components it uses internally, so if you don't like the style and encapsulation of the default menu buttons, etc., you can use these components directly to freely configure your menu buttons:

#### Install as a Vue plugin

```typescript twoslash
import {
  NolebaseEnhancedReadabilitiesPlugin // [!code focus]
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css' // [!code ++]
```

If you are working on a VitePress and wanted to install it into Vue instance, you can do it like this:

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import { NolebaseEnhancedReadabilitiesPlugin } from '@nolebase/vitepress-plugin-enhanced-readabilities/client' // [!code ++]
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css' // [!code ++]

// Rest of the code...

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // Rest of the code...
  },
  enhanceApp({ app }) {
    app.use(NolebaseEnhancedReadabilitiesPlugin) // [!code ++]
  },
}

export default Theme
```

Of course you can also provide the relevant configuration directly when installing the plugin:

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import type { Options } from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import { NolebaseEnhancedReadabilitiesPlugin } from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css' // [!code ++]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // Rest of the code...
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

For more information on configuration, see [Configuration](#configuration).

#### Import layout switching components on demand

```typescript twoslash
import {
  LayoutSwitch,  // [!code focus]
  ScreenLayoutSwitch,  // [!code focus]
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
```

#### Import spotlight components on demand

```typescript twoslash
import {
  Spotlight,  // [!code focus]
  ScreenSpotlight, // [!code focus]
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
```

## Configuration

The Enhanced Readabilities plugin currently provides configuration options related to **Internationalization** and **Help Tooltip**.

### Configure in VitePress

Since VitePress doesn't provide more functionality for the default theme to extend the default theme configuration, it is not friendly to the type checking and maintenance of the configuration if we directly modify the major VitePress configuration object to provide options for the plugin.

Therefore we offer a way with [Vue's dependency injection](https://vuejs.org/api/composition-api-dependency-injection.html#injection) to provide options and configuration for the plugin:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import type { Options } from '@nolebase/vitepress-plugin-enhanced-readabilities/client' // [!code ++]
import { InjectionKey } from '@nolebase/vitepress-plugin-enhanced-readabilities/client' // [!code ++]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // Rest of the code...
  },
  enhanceApp({ app }) {
    // Rest of the code...

    app.provide(InjectionKey, { // [!code ++]
      // Configuration... // [!code ++]
    } as Options) // [!code ++]

    // Rest of the code...
  },
}
```

For more information on internationalization configuration, see [Internationalization](#internationalization).

### Options inside

::: details Complete configurable options

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

## Internationalization

::: warning Caution
The Enhanced Readabilities plugin does not use [vue-i18n](https://vue-i18n.intlify.dev/) as an i18n toolkit since most of VitePress probably uses [VitePress's internationalization features](https://vitepress.dev/guide/i18n) for internationalization, so it is impossible to override the fields of the localized text of the Enhanced Readabilities plugin with `vue-i18n`, but you can achieve it with the `locales` field in [Configuration](#configuration).
:::

The Enhanced Readabilities plugin supports internationalization by default, with English and Simplified Chinese as supported languages by default.

You can override the plugin's localized text through configuration, and before you start, you need to understand how VitePress is internationalized: [Internationalization of VitePress](https://vitepress.dev/guide/i18n). The Enhanced Readabilities plugin reads the VitePress language field by default, so you'll need to be careful to keep the internationalized language code the same as the VitePress language code when configuring it.

### Configure in VitePress

In the [Configuration](#configuration) section, we've learned how to provide configuration options for the Enhanced Readabilities plugin in VitePress, and we can configure internationalization by adding the `locales` field to the configuration options:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import type { Options } from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import { InjectionKey } from '@nolebase/vitepress-plugin-enhanced-readabilities/client'

// Rest of code...

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // Rest of code...
  },
  enhanceApp({ app }) {
    // Rest of code...

    app.provide(InjectionKey, {
      locales: { // i18n // [!code ++]
        'zh-CN': { // configure for Simplified Chinese // [!code ++]
          title: { // [!code ++]
            title: '阅读增强插件', // [!code ++]
          } // [!code ++]
        }, // [!code ++]
        'en': { // configure for English // [!code ++]
          title: { // [!code ++]
            title: 'Enhanced Readabilities Plugin', // [!code ++]
          } // [!code ++]
        } // [!code ++]
      } // [!code ++]
    } as Options)

    // Rest of code...
  },
}
```

### Locales options

::: details Complete internationalization field options

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

## Accessibility

The Enhanced Readabilities plugin provides accessibility support by default. You can override accessible labels (aria-label) via [Configuration](#configuration) in the same way as [Internationalization](#internationalization), see [Locales Options](#locales-options) for a description of what labels can be configured for accessibility.

## Problems? Let's Troubleshoot

### Encountered `Cannot find module ... or its corresponding type declarations` error?

<!--@include: @/pages/en/snippets/troubleshooting-cannot-find-module.md-->

### The requested module `vitepress` does not provide an export named `useData` or The requested module `vitepress` does not provide an export named `useRoute`

If you have already configured your VitePress that working properly, you might encounter the above error when you try to install and integrate the Enhanced Readabilities plugin for the first time.

This is part of the command output, use it as reference if you want:

```shell
build error:
file://Docs/dist/index.js:2
import { useData as Fe, withBase as tt, useRoute as nt } from "vitepress";
         ^^^^^^^
SyntaxError: The requested module 'vitepress' does not provide an export named 'useData'
    at ModuleJob._instantiate (node:internal/modules/esm/module_job:124:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:190:5)
```

However, it's ok if the error message is saying either `useData` or `useRoute`, you could still use some of the following steps to troubleshoot it and get some references.

Such errors are usually caused by the following reasons:

#### You are using an older version of VitePress (or incompatible)

You might have actually installed and used a old version of VitePress that didn't support the `useData` and `useRoute` composables long before.

To check this, you can check the version of VitePress by running the script `docs:dev` with the following command:

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

The output might look like this:

```shell
> @nolebase/integrations-docs@ docs:dev /nolebase/integrations/docs
> vitepress dev


  vitepress v1.0.0-rc.12

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

The line `vitepress v1.0.0-rc.12` indicates your VitePress version as `v1.0.0-rc.12`, by default, Nólëbase Integrations (include Enhanced Readabilities and the other integrations) requires at least `vitepress v1.0.0-beta.1`, if you are using some of the versions long before (e.g. alpha), you have to upgrade your VitePress to the nearest compatible version to resolve this issue.

#### You might missed the configurations in section [Add plugin-specific options into configurations of Vite](#add-plugin-specific-options-into-configurations-of-vite)

If you incautiously missed the configurations in section [Add plugin-specific options into configurations of Vite](#add-plugin-specific-options-into-configurations-of-vite), the reference to `vitepress` inside of the Enhanced Readabilities plugin might be broken or miss-processed when building your VitePress site. So you have to configure it accurately by following the section [Add plugin-specific options into configurations of Vite](#add-plugin-specific-options-into-configurations-of-vite) accordingly.

