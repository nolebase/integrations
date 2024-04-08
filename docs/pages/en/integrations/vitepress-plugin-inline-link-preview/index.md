<script setup>
import { PopupIframe } from '@nolebase/vitepress-plugin-inline-link-preview/client'
</script>

# Inline Links Previewing <Badge type="tip" text="v1.28.0" />

This VitePress plugin is an implementation that similar to Obsidian's link previewing functionalities.

::: info 🤗 Full interactive functionalities when previewing!

Any scrolling, clicking, and browsing abilities are supported when interacting with and trying out the preview popups below, and do not interfere with the external page.

:::

<div flex="~" justify-center>
  <div relative h-full min-h="[440px]" w-full max-w="[640px] <sm:100%">
    <a href="/pages/en/integrations/">How it looks when previewing Integrations page</a>
    <div
        flex="~ col"
        absolute top-0 z-1 m-0 overflow-hidden rounded-lg p-0
        border="3 solid $vp-c-divider"
        class="max-w-[100vw]"
        :style="{
          left: `0px`,
          top: `30px`,
          width: `100%`,
          maxWidth: `600px`,
          height: `400px`,
          maxHeight: `440px`,
        }"
        shadow="2xl"
      >
        <PopupIframe href="/pages/en/integrations/" />
      </div>
  </div>
</div>

Try to hover your cursor over this link, you will see a popup that shows the preview content of the link:

[[Bi-directional Links Example Page]]

## Features

<div grid="~ cols-[auto_1fr] gap-1" items-center my-1>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Better with <a href="/pages/zh-CN/integrations/markdown-it-bi-directional-links">Bi-directional Links</a></span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Preview any links</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Options to hide elements</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Automatically detect external links</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Natively compatible with VitePress design</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Follow the i18n regulations of Nolebase Integrations</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Best practices of a11y</span>
</div>

## Installation

Install `@nolebase/vitepress-plugin-inline-link-preview` to your project dependencies by running the following command:

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

## Usage

It consists two major steps to integrate the Inline Links Previewing plugin into your VitePress project:

- [Configure `markdown-it` plugin](#configure-markdown-it-plugin) (syntax and markup handling)
- [Integrate with VitePress](#integrate-with-vitepress) (UI and components)

### Configure `markdown-it` plugin

First of all, in VitePress's [**primary configuration file**](https://vitepress.dev/reference/site-config#config-resolution) (not this is not a **theme configuration file**, it's usually located at `docs/.vitepress/config.ts`, file paths and extensions may be vary), you need to register the essential `markdown-it` plugin that required:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

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
    // rest of the options...
  },
  markdown: { // [!code ++]
    config(md) { // [!code ++]
      // other markdown-it configurations... // [!code ++]
      md.use(InlineLinkPreviewElementTransform) // [!code ++]
    } // [!code ++]
  } // [!code ++]
  // rest of the options...
})
```

:::

Behind the scene, the `InlineLinkPreviewElementTransform` is a `markdown-it` plugin that directly transforms the `[]()` link markup `<a>` elements into the `<VPNolebaseInlineLinkPreview>` elements (which is a Vue component that renders the inline link previewing UI).

By default, this `markdown-it` plugin will transform all the `[]()` link markup or `<a>` elements that met the following conditions:

1. **DOES NOT CONTAIN** `header-anchor` in the class list.
2. **DOES NOT CONTAIN** `no-inline-link-preview` in the class list.
3. **DOES HAVE** `data-inline-link-preview="false"` attribute.

Therefore, for those `[]()` link markup and `<a>` elements you don't want to transform into `<VPNolebaseInlineLinkPreview>`, you either:

1. Add `no-inline-link-preview` to the class list.
2. Assign a `data-inline-link-preview` attribute with the value of `false`.

### Integrate with VitePress

Since the `InlineLinkPreviewElementTransform` plugin will transform the `[]()` link markup or `<a>` elements into the `<VPNolebaseInlineLinkPreview>` elements, you need to install the `VPNolebaseInlineLinkPreview` component into your VitePress theme in order to render the inline link previewing UI.

In VitePress's [**theme configuration file**](https://vitepress.dev/reference/default-theme-config#default-theme-config) (note that it's not a **configuration file**, it's usually located at `docs/.vitepress/theme/index.ts`, file paths and extensions may be vary), install the :

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

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
    // other configurations...
  },
  enhanceApp({ app }) { // [!code ++]
    app.use(NolebaseInlineLinkPreviewPlugin) // [!code ++]
  }, // [!code ++]
}

export default Theme
```

:::

## Configuration

The Inline Links Previewing plugin currently provides configuration options related to **Internationalization** and **Popup**.

### Configure in VitePress

Since VitePress doesn't provide more functionality for the default theme to extend the default theme configuration, it is not friendly to the type checking and maintenance of the configuration if we directly modify the major VitePress configuration object to provide options for the plugin.

Therefore we offer a way with [Vue's dependency injection](https://vuejs.org/api/composition-api-dependency-injection.html#injection) to provide options and configuration for the plugin:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

```typescript twoslash
import type { Theme as ThemeConfig } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import { InjectionKey } from '@nolebase/vitepress-plugin-inline-link-preview/client' // [!code ++]

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

For more information on internationalization configuration, see [Internationalization](#internationalization).

### Options inside

::: details Complete configurable options

```typescript twoslash
interface Locale extends Record<string, any> {
  /**
   * Popup options
   */
  popup?: {
    /**
     * The text to be shown when the popup is loading
     */
    loading?: string
    /**
     * The aria-label of the popup when the popup is loading
     */
    loadingAriaLabel?: string
    /**
     * The text to be shown when the popup is failed to load
     */
    openInCurrentPage?: string
    /**
     * The aria-label of the popup when the popup is failed to load
     */
    openInCurrentPageAriaLabel?: string
    /**
     * The aria-label of the iframe popup
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
   * The width and height of the popup of link preview
   */
  popupWidth?: number
  /**
   * The height of the popup of link preview
   */
  popupHeight?: number
  /**
   * Toggle previewAllHostNames to true to preview all host names.
   * When set to true, all the other options related to host names will be ignored, including
   * `handleShouldPreviewHostNames` option.
   *
   * @default false
   */
  previewAllHostNames?: boolean
  /**
   * Toggle `previewLocalHostName` to true to preview local (deployed location, or `window.location.host`) host name.
   *
   * @default true
   */
  previewLocalHostName?: boolean
  /**
   * The host names allowed to be previewed.
   * When specified, only the host names in this array that exact matched will be previewed.
   *
   * @default []
   */
  previewHostNamesAllowed?: string[]
  /**
   * The host names blocked to be previewed.
   * When specified, the host names in this array will that exact matched not be previewed.
   *
   * @default []
   */
  previewHostNamesBlocked?: string[]
  /**
   * Programmatically handle whether the host name should be previewed.
   * When specified, this function will be called to determine whether the host name should be previewed and before the `previewHostNamesAllowed` and `previewHostNamesBlocked` options.
   *
   * @param href The href of the link
   * @returns Whether the host name should be previewed
   * @default undefined
   */
  handleShouldPreviewHostNames?: (href: string) => boolean
  /**
   * The selectors of the elements to be hided inside of the iframe when the popup is opened.
   * This is useful when you have a lot of classes of customized elements that you don't want to be shown in the popup.
   */
  selectorsToBeHided?: string[]
  /**
   * Programmatically handle the iframe loaded event, you can use this handling function
   * to programmatically change the iframe content inside, e.g. add a class to the body element.
   * or hide some elements inside of the iframe.
   *
   * @param hostWindow The window object of the host window
   * @param element The iframe element
   * @returns Either a Promise that resolves when the handling is done or plain void
   * @default undefined
   */
  handleIframeLoaded?: (hostWindow: Window, element: HTMLIFrameElement) => Promise<void> | void
  /**
   * The selector of the element to be used as the teleport target of the popup.
   * By default, the popup will be appended to the body element since VitePress supports to
   * teleport elements to the body element only currently.
   *
   * @default 'body'
   */
  popupTeleportTargetSelector?: string
  /**
   * The delay of the popup after the mouse enter event of the link.
   *
   * @default 1000
   */
  popupDelay?: number
  /**
   * Internationalization options
   *
   * @example { 'zh-CN': { popup: { loading: '加载中...', loadingAriaLabel: '加载中' } }
   */
  locales?: Record<string, Locale>
}
```

:::

## Internationalization

::: warning Caution
The Inline Links Previewing plugin does not use [vue-i18n](https://vue-i18n.intlify.dev/) as an i18n toolkit since most of VitePress probably uses [VitePress's internationalization features](https://vitepress.dev/guide/i18n) for internationalization, so it is impossible to override the fields of the localized text of the Inline Links Previewing plugin with `vue-i18n`, but you can achieve it with the `locales` field in [Configuration](#configuration).
:::

The same as other VitePress plugins, Inline Links Previewing plugin supports internationalization by default, with English and Simplified Chinese as supported languages.

You can override the plugin's localized text through configuration, and before you start, you need to understand how VitePress is internationalized: [Internationalization of VitePress](https://vitepress.dev/guide/i18n). The Inline Links Previewing plugin reads the VitePress language field by default, so you'll need to be careful to keep the internationalized language code the same as the VitePress language code when configuring it.

### Configure in VitePress

In the [Configuration](#configuration) section, we've learned how to provide configuration options for the Inline Links Previewing plugin in VitePress, and we can configure internationalization by adding the `locales` field to the configuration options:

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

::: details Complete internationalization field options

```typescript twoslash
/**
 * Locale
 */
interface Locale {
  /**
   * Popup options
   */
  popup?: {
    /**
     * The text to be shown when the popup is loading
     */
    loading?: string
    /**
     * The aria-label of the popup when the popup is loading
     */
    loadingAriaLabel?: string
    /**
     * The text to be shown when the popup is failed to load
     */
    openInCurrentPage?: string
    /**
     * The aria-label of the popup when the popup is failed to load
     */
    openInCurrentPageAriaLabel?: string
    /**
     * The aria-label of the iframe popup
     */
    iframeAriaLabel?: string
  }
}
```

:::

## Accessibility

The Inline Links Previewing plugin provides accessibility support by default. You can override accessible labels (aria-label) via [Configuration](#configuration) in the same way as [Internationalization](#internationalization), see [Locales Options](#locales-options) for a description of what labels can be configured for accessibility.

## More customizations?

It is possible though.

<!--@include: @/pages/en/snippets/configure-on-your-own-warning.md-->

The Inline Links Previewing plugin exports the components it uses internally, so if you don't like the style and encapsulation of the default components, you can always create your own components and use them instead.

### Install as a Vue plugin

```typescript twoslash
import {
  NolebaseInlineLinkPreviewPlugin // [!code focus]
} from '@nolebase/vitepress-plugin-inline-link-preview/client'
```

If you are working on a VitePress and wanted to install it into Vue instance, you can do it like this:

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

#### Import popup iframe wrapper components on demand

```typescript twoslash
import {
  PopupIframe,  // [!code focus]
} from '@nolebase/vitepress-plugin-inline-link-preview/client'
```

After configured the plugin or component, you will need to customize how the `markdown-it` plugin transforms the `[]()` link markup or `<a>` elements into your custom components instead of the default ones.

### Customize the `markdown-it` plugin

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
