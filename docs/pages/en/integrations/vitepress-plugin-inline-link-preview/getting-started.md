---
title: Inline Links Previewing
category: Inline Links Previewing
sidebarTitle: Getting Started
---

# Getting Started

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

<!--@include: @/pages/en/snippets/configure-tsconfig.md-->

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

### Add plugin-specific options into configurations of Vite

First of all, in VitePress's [**primary configuration file**](https://vitepress.dev/reference/site-config#config-resolution) (not this is not a **theme configuration file**, it's usually located at `docs/.vitepress/config.ts`, file paths and extensions may be vary), you need to supply some of the [Server-Side Rendering related options](https://vitejs.dev/guide/ssr.html#ssr-externals) in the root configuration object of [Vite](https://vitejs.dev).

Add the Inline Link Previewing plugin package name `@nolebase/vitepress-plugin-inline-link-preview` into the Vite options that required by VitePress to process this plugin:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

<!--@include: @/pages/en/snippets/configure-tsconfig.md-->

```typescript twoslash
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: { // [!code ++]
    optimizeDeps: { // [!code ++]
      exclude: [ // [!code ++]
        '@nolebase/vitepress-plugin-inline-link-preview/client', // [!code ++]
      ], // [!code ++]
    }, // [!code ++]
    ssr: { // [!code ++]
      noExternal: [ // [!code ++]
        // If there are other packages that need to be processed by Vite, you can add them here. // [!code hl]
        '@nolebase/vitepress-plugin-inline-link-preview', // [!code ++]
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
        '@nolebase/vitepress-plugin-inline-link-preview/client', // [!code ++]
        'vitepress' // [!code ++]
      ], // [!code ++]
    },
    ssr: { // [!code ++]
      noExternal: [ // [!code ++]
        // If there are other packages that need to be processed by Vite, you can add them here. // [!code hl]
        '@nolebase/vitepress-plugin-inline-link-preview', // [!code ++]
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

### Integrate with VitePress

Since the `InlineLinkPreviewElementTransform` plugin will transform the `[]()` link markup or `<a>` elements into the `<VPNolebaseInlineLinkPreview>` elements, you need to install the `VPNolebaseInlineLinkPreview` component into your VitePress theme in order to render the inline link previewing UI.

In VitePress's [**theme configuration file**](https://vitepress.dev/reference/default-theme-config#default-theme-config) (note that it's not a **configuration file**, it's usually located at `docs/.vitepress/theme/index.ts`, file paths and extensions may be vary), install the Vue plugins:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

<!--@include: @/pages/en/snippets/configure-tsconfig.md-->

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
    // other configurations...
  },
  enhanceApp({ app }) { // [!code ++]
    app.use(NolebaseInlineLinkPreviewPlugin) // [!code ++]
  }, // [!code ++]
}

export default Theme
```

:::

## Troubleshooting

### Encountered `Cannot find module ... or its corresponding type declarations` error?

<!--@include: @/pages/en/snippets/troubleshooting-cannot-find-module.md-->
