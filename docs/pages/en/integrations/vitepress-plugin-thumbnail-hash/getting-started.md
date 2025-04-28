---
title: Thumbnail hashing for images
category: Thumbnail hashing for images
sidebarTitle: Getting Started
---

# Getting started

## Installation

Install `@nolebase/vitepress-plugin-thumbnail-hash` to your project dependencies by running the following command:

::: code-group

```shell [@antfu/ni]
ni @nolebase/vitepress-plugin-thumbnail-hash -D
```

```shell [pnpm]
pnpm add @nolebase/vitepress-plugin-thumbnail-hash -D
```

```shell [npm]
npm install @nolebase/vitepress-plugin-thumbnail-hash -D
```

```shell [yarn]
yarn add @nolebase/vitepress-plugin-thumbnail-hash -D
```

:::

## Usage

It consists two major steps to integrate the Inline Links Previewing plugin into your VitePress project:

- [Configure Vite plugin](#configure-vite-plugin) (data fetching, logs aggregation)
- [Integrate with VitePress](#integrate-with-vitepress-theme) (UI and components)

### Configure Vite plugin

There are two ways to integrate the Thumbnail hashing for images Vite plugin into your VitePress project:

1. [**Recommended**: Use the `vite` option in VitePress's primary configuration file (usually located at `docs/.vitepress/config.ts`, file paths and extensions may be vary)](#configure-vite-plugin-in-vitepresss-config-file)
2. [Create a separated Vite configuration file (e.g. `vite.config.ts`) in the root directory of your VitePress project](#configure-vite-plugin-in-a-separated-vite-configuration-file)

#### Configure Vite plugin in VitePress's config file

In VitePress's [**primary configuration file**](https://vitepress.dev/reference/site-config#config-resolution) (not this is not a **theme configuration file**, it's usually located at `docs/.vitepress/config.ts`, file paths and extensions may be vary), we need to import `ThumbnailHashImages` and configure it properly:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

<!--@include: @/pages/en/snippets/configure-tsconfig.md-->

```typescript twoslash
import { defineConfig } from 'vitepress'
import { // [!code ++]
  ThumbnailHashImages, // [!code ++]
} from '@nolebase/vitepress-plugin-thumbnail-hash/vite' // [!code ++]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: { // [!code ++]
    plugins: [ // [!code ++]
      ThumbnailHashImages(), // [!code ++]
    ],
  }, // [!code ++]
  lang: 'en',
  title: 'Site Name',
  themeConfig: {
    // rest of the options...
  }
  // rest of the options...
})
```

#### Configure Vite plugin in a separated Vite configuration file

##### Ensure `vite.config.ts` is created

If you understand what `vite.config.ts` is already and have created it, you can skip this preparation step and jump to the next step [Configure plugin in `vite.config.ts`](#configure-plugin-in-viteconfigts).

::: tip New to `vite.config.ts` is?

First of all, `vite.config.ts` is a configuration file for [Vite](https://vitejs.org), the build tool that VitePress is built on. It allows developers to build and transform the assets, content and data in the project.

VitePress itself contains entire set of Vite options in its [**primary configuration file**](https://vitepress.dev/reference/site-config#config-resolution) (not this is not a **theme configuration file**, it's usually located at `docs/.vitepress/config.ts`, file paths and extensions may be vary), these options, and yet, the `vite.config.ts` are identical in terms of configurations.

:::

Therefore, please create a separated `vite.config.ts` file in the root directory of your VitePress project:

::: tip Where is the root directory of VitePress project?

VitePress project's root directory is where the parent directory of `.vitepress` directory is.

For example:

```shell
.
├── docs
│   ├── .vitepress
│   │   ├── config.ts
│   │   └── theme
│   │       └── index.ts
│   └── README.md
```

In this case, the root directory is `docs`.

```shell
.
├── .vitepress
│   ├── config.ts
│   └── theme
│       └── index.ts
└── README.md
```

In this case, the root directory is `./`.

:::

```shell
touch vite.config.ts
```

##### Configure plugin in `vite.config.ts`

In the standalone [Vite configuration file](https://vitejs.dev/config/) (e.g. `vite.config.ts`) file we have under our root directory, we need to import `ThumbnailHashImages` and configure it properly:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

<!--@include: @/pages/en/snippets/configure-tsconfig.md-->

```typescript twoslash
import { join } from 'node:path'
import { defineConfig } from 'vite'
import { // [!code ++]
  ThumbnailHashImages, // [!code ++]
} from '@nolebase/vitepress-plugin-thumbnail-hash/vite' // [!code ++]

export default defineConfig(() => {
  return {
    plugins: [ // [!code ++]
      ThumbnailHashImages(), // [!code ++]
    ]
    // other vite configurations...
  }
})
```

### Integrate with VitePress theme

Now, let's integrate the Thumbnail hashing for images UI widgets into your VitePress project.

In VitePress's [**theme configuration file**](https://vitepress.dev/reference/default-theme-config#default-theme-config) (note that it's not a **configuration file**, it's usually located at `docs/.vitepress/theme/index.ts`, file paths and extensions may be vary), install the Vue plugin and use the components:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

::: code-group

```typescript twoslash [docs/.vitepress/theme/index.ts]
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeConfig } from 'vitepress'
import { // [!code ++]
  NolebaseUnlazyImg, // [!code ++]
} from '@nolebase/vitepress-plugin-thumbnail-hash/client' // [!code ++]

import '@nolebase/vitepress-plugin-thumbnail-hash/client/style.css' // [!code ++]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // other configurations...
  },
  enhanceApp({ app }) {
    app.component('NolebaseUnlazyImg', NolebaseUnlazyImg)  // [!code ++]
  },
}

export default Theme
```

:::

## What's next?

In order to show and use the needed thumbnail hashes for VitePress pages. Take a look at another plugin called [`markdown-it-unlazy-img`](../markdown-it-unlazy-img/) too.

## Troubleshooting

### Encountered `Cannot find module ... or its corresponding type declarations` error?

<!--@include: @/pages/en/snippets/troubleshooting-cannot-find-module.md-->
