---
title: Auto Sidebar
category: Auto Sidebar
---

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

In the VitePress configuration file (usually `docs/.vitepress/config.ts`, the file path and extension may be different), import `@nolebase/vitepress-plugin-sidebar` as a plugin:

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

## Optional configuration
The above configuration completes the automatic generation of a sidebar that displays all Level 1 folders.  Considering that you might want the `collapse:false` that is, the **automatically expands** mode, do as follows.
### Modify the source code of the plugin
Follow the path of `node_modules/@nolebase/vitepress-plugin-sidebar/dist/index.d.ts` to find the file and modify the code as follows.
```typescript
interface ArticleTree {
    index: string;
    text: string;
    link?: string;
    lastUpdated?: number;
    collapsible?: true;
    collapsed?: boolean;  //true-->boolean // [!code focus]
    items?: ArticleTree[];
    category?: string;
}
declare function calculateSidebar(targets?: Array<string | {
    folderName: string;
    separate: boolean;
}>, base?: string): ArticleTree[] | Record<string, ArticleTree[]>;

export { calculateSidebar };
```
### Integrate with VitePress: Expand the Level 1 folder
In the VitePress configuration file (usually `docs/.vitepress/config.ts`, the file path and extension may be different), add **the highlight content** to the file.
```ts{1,5-19}
import { calculateSidebar as originalCalculateSidebar } from "@nolebase/vitepress-plugin-sidebar"; 

...

function calculateSidebarWithDefaultOpen(targets, base) {
  const result = originalCalculateSidebar(targets, base);
  if (Array.isArray(result)) {
    result.forEach(item => {
      item.collapsed = false; 
    });
  } else {
    Object.values(result).forEach(items => {
      items.forEach(item => {
        item.collapsed = false; 
      });
    });
  }
  return result;
}

...

export default defineConfig({
  ...
})
```

:::details Want to expand folders at all levels?
Try modifying the functions defined in the VitePress configuration file as follows
```ts
function calculateSidebarWithDefaultOpen(targets, base) {
  const result = originalCalculateSidebar(targets, base);
  function setAllCollapsedFalse(items) {
    items.forEach(item => {
      item.collapsible = true; 
      item.collapsed = false;
  
      if (item.items) {
        setAllCollapsedFalse(item.items);
      }
    });
  }
  if (Array.isArray(result)) {
    setAllCollapsedFalse(result);
  } else {
    Object.values(result).forEach(items => {
      setAllCollapsedFalse(items);
    });
  }
  return result;
}
```
:::

### Modify the sidebar configuration
```ts
export default defineConfig({
  ...
  themeConfig: {
    ...
    sidebar: calculateSidebarWithDefaultOpen([ // [!code focus]
      { folderName: "folderName", separate: true },
      { folderName: "folderName", separate: true },
      ...
    ],''), //Set the 'base' parameter based on your requirements // [!code focus]
    ...
  }
}
```
Refresh the front page and see that all the Level 1 directories have been expanded.