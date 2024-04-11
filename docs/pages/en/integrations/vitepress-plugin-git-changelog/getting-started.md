# Getting started

## Installation

Install `@nolebase/vitepress-plugin-git-changelog` to your project dependencies by running the following command:

::: code-group

```shell [@antfu/ni]
ni @nolebase/vitepress-plugin-git-changelog -D
```

```shell [pnpm]
pnpm add @nolebase/vitepress-plugin-git-changelog -D
```

```shell [npm]
npm install @nolebase/vitepress-plugin-git-changelog -D
```

```shell [yarn]
yarn add @nolebase/vitepress-plugin-git-changelog -D
```

:::

## Usage

::: warning This is roughly the most complex one to configure with!

Please pay attentions to the following configurations and steps to get started with the Git-based page histories plugin. It is not quite simple as other plugins.

:::

It consists two major steps to integrate the Inline Links Previewing plugin into your VitePress project:

- [Configure Vite plugin](#configure-vite-plugin) (data fetching, logs aggregation)
- [Integrate with VitePress](#integrate-with-vitepress) (UI and components)

### Configure Vite plugin

#### Ensure `vite.config.ts` is created

If you understand what `vite.config.ts` is already and have created it, you can skip this preparation step and jump to the next step [Configure plugin in `vite.config.ts`](#configure-plugin-in-viteconfigts).

::: tip New to `vite.config.ts` is?

First of all, `vite.config.ts` is a configuration file for [Vite](https://vitejs.org), the build tool that VitePress is built on. It allows developers to build and transform the assets, content and data in the project.

Even though VitePress itself contains entire set of Vite options in its [**primary configuration file**](https://vitepress.dev/reference/site-config#config-resolution) (not this is not a **theme configuration file**, it's usually located at `docs/.vitepress/config.ts`, file paths and extensions may be vary), these options, and yet, the `vite.config.ts` are identical in terms of configurations.

However, due to the order of plugins it registered, it's not enough to transform the needed data and logs if we install the Git-based page histories plugin in this way.

:::

Therefore, please create a separated `vite.config.ts` file in the root directory of your VitePress project:

```shell
touch vite.config.ts
```

#### Configure plugin in `vite.config.ts`

In the standalone [Vite configuration file](https://vitejs.dev/config/) (e.g. `vite.config.ts`) file we have under our root directory, we need to import both `GitChangelog` (data fetcher), and `GitChangelogMarkdownSection` (widget embedder) the plugins and configure it properly:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

```typescript twoslash
import { join } from 'node:path'
import { defineConfig } from 'vite'
import { // [!code ++]
  GitChangelog, // [!code ++]
  GitChangelogMarkdownSection, // [!code ++]
} from '@nolebase/vitepress-plugin-git-changelog/vite' // [!code ++]

export default defineConfig(() => {
  return {
    plugins: [ // [!code ++]
      GitChangelog({ // [!code ++]
        // Fill in your repository URL here
        repoURL: () => 'https://github.com/nolebase/integrations', // [!code ++]
      }), // [!code ++]
      GitChangelogMarkdownSection(), // [!code ++]
    ]
    // other vite configurations...
  }
})
```

### Integrate with VitePress

Now, let's integrate the Git-based page histories UI widgets into your VitePress project.

In VitePress's [**theme configuration file**](https://vitepress.dev/reference/default-theme-config#default-theme-config) (note that it's not a **configuration file**, it's usually located at `docs/.vitepress/theme/index.ts`, file paths and extensions may be vary), install the Vue plugin and use the components:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

::: code-group

```typescript twoslash [docs/.vitepress/theme/index.ts]
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeConfig } from 'vitepress'
import { // [!code ++]
  NolebaseGitChangelogPlugin // [!code ++]
} from '@nolebase/vitepress-plugin-git-changelog/client' // [!code ++]

// If you are UnoCSS user, you don't need to import the styles manually,
// UnoCSS should be able to take care of it during build time.
import '@nolebase/vitepress-plugin-git-changelog/client/styles.css' // [!code ++]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // other configurations...
  },
  enhanceApp({ app }) {
    app.use(NolebaseGitChangelogPlugin)  // [!code ++]
  },
}

export default Theme
```

:::

::: info A little more about `.css` styles...

If you are not using or never configured UnoCSS, please import the styles manually:

```typescript twoslash [docs/.vitepress/theme/index.ts]
import '@nolebase/vitepress-plugin-git-changelog/client/styles.css' // [!code ++]
```

Since all Nolebase integrations follow the guideline of shipping both the original Vue SFC component files and the compiled and packaged CSS files (with the Vue SFC source files UnoCSS will be able to transpile and generate the required styles at build time), if you are a UnoCSS user you will always have a choice to:

1. either **Use UnoCSS to generate the styles for you and don't worry about the styles** or
2. either **Import the pre-compiled and packaged CSS files directly**.

It's up to you, depending on your preference and current configuration.

:::
