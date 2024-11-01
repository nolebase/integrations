<script setup>
import packageJSON from '~/packages/vitepress-plugin-sidebar/package.json'
</script>

# Auto Sidebar <Badge type="tip" :text="`v${packageJSON.version}`" />

## Installation

Install `@nolebase/vitepress-plugin-sidebar` to your project dependencies by running the following command:

::: code-group

```shell [@antfu/ni]
ni @nolebase/vitepress-plugin-sidebar -D
```

```shell [pnpm]
pnpm add @nolebase/vitepress-plugin-sidebar -D
```

```shell [npm]
npm install @nolebase/vitepress-plugin-sidebar -D
```

```shell [yarn]
yarn add @nolebase/vitepress-plugin-sidebar -D
```

:::

## Configuration

### Integrate with VitePress

In the VitePress configuration file (usually `docs/.vitepress/config.ts`, the file path and extension may be different), import `@nolebase/markdown-it-bi-directional-links` as a plugin, and use it as a `markdown-it` plugin in the `markdown` option:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

```typescript twoslash
import { defineConfigWithTheme } from 'vitepress'
import { calculateSidebar } from '@nolebase/vitepress-plugin-sidebar' // [!code ++]

export default defineConfigWithTheme({
  lang: 'en',
  title: 'Site name', // For reference only, please do not copy directly
  description: 'Description', // For reference only, please do not copy directly
  themeConfig: {
    // Other configurations...
    sidebar: calculateSidebar([ // [!code ++]
      'Notes', // [!code ++]
      { folderName: 'Articles', separate: true }, // [!code ++]
    ]), // [!code ++]
  },
})
```

## Options

### `calculateSidebar`

The `calculateSidebar` function takes an array of items as arguments, each item in the array can be a `string` or an `object`. Different types will have different processing logic. Let's take the following practical scenarios to illustrate.

First of all, it should be noted that filling in `'Notes'` and `{ folderName: 'Notes', separate: false }` in the configuration parameter is exactly equivalent, so a string-only configuration can be seen as a shortcut for `{ folderName: 'notes', separate: false }`.

Therefore, if you don't want to change types, you can write them all as objects.

Also, in almost 100% of cases, we generate sidebars with the same structure and form as Obsidian and [Nolebase](https://nolebase.ayaka.io), so in most cases, writing only strings will not be a problem.

The only difference is the special `separate` attribute. When the user configures `separate: true`, we generate as many sidebars as VitePress is compatible with and supports, which makes it possible to *configure different sidebars for different pages*.

To put it more bluntly, if you want to be able to show sidebars on page A that are only relevant to the A directory, and on page B that are only relevant to the B directory, then you would need a configuration like `[{ folderName: 'A', separate: true }, { folderName: 'B', separate: true }]`.

Also note that there are some special handling rules:

#### Top-level ignored

If the parameter is filled with a string like `['notes']`, the `notes' directory level will be automatically ignored, and only files and directories under `notes' will be preserved.

#### Mixin

If you have both a string configuration and a `separate: true` configuration, for example:

```typescript
calculateSidebar([
  'Notes',
  'Tweets', .
  { folderName: 'Articles', separate: true },
])
```

Then the first-level ignore rule will no longer be in effect, and instead `'Notes'` and `'Tweets'` will appear as directory names on pages accessed under `/`, and `'Articles'` will appear as a separate directory on pages accessed under `/articles/`.
