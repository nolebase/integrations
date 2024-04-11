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

In VitePress's [**theme configuration file**](https://vitepress.dev/reference/default-theme-config#default-theme-config) (note that it's not a **configuration file**, it's usually located at `docs/.vitepress/theme/index.ts`, file paths and extensions may be vary), install the Vue plugins:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

::: code-group

```typescript twoslash [.vitepress/theme/index.ts]
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeConfig } from 'vitepress'
import { // [!code ++]
  NolebaseInlineLinkPreviewPlugin, // [!code ++]
} from '@nolebase/vitepress-plugin-inline-link-preview/client' // [!code ++]

// If you are UnoCSS user, you don't need to import the styles manually,
// UnoCSS should be able to take care of it during build time.
import '@nolebase/vitepress-plugin-inline-link-preview/client/styles.css' // [!code ++]

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

::: info A little more about `.css` styles...

If you are not using or never configured UnoCSS, please import the styles manually:

```typescript twoslash [docs/.vitepress/theme/index.ts]
import '@nolebase/vitepress-plugin-inline-link-preview/client/styles.css' // [!code ++]
```

Since all Nolebase integrations follow the guideline of shipping both the original Vue SFC component files and the compiled and packaged CSS files (with the Vue SFC source files UnoCSS will be able to transpile and generate the required styles at build time), if you are a UnoCSS user you will always have a choice to:

1. either **Use UnoCSS to generate the styles for you and don't worry about the styles** or
2. either **Import the pre-compiled and packaged CSS files directly**.

It's up to you, depending on your preference and current configuration.

:::
