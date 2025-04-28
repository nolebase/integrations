---
title: Enhanced <mark>
category: Enhanced <mark>
sidebarTitle: Enhanced &lt;mark&gt;
---

<script setup>
import packageJSON from '~/packages/vitepress-plugin-enhanced-mark/package.json'
</script>

# Enhanced `<mark>` <mark>elements</mark> <Badge type="tip" :text="`v${packageJSON.version}`" />

As an interesting little plugin, it adds a <mark>sliding animation</mark> to your `<mark>` highlighted elements.

::: info 🤔 Performance drop? No!

This plugin doesn't contain any JavaScript code, only one stylesheet is provided.

Therefore, it should be theoretically performant, and won't cause any page lag.

:::

## Features

<div grid="~ cols-[auto_1fr] gap-1" items-start my-1>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>No JavaScripts</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Stunning looking <mark>animations</mark></span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Multi-line supports</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Day / Night theme (Dark mode) supported</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Natively compatible with VitePress design</span>
</div>

## Take a look

It works like this:

Lorem ipsum dolor sit amet, <mark>consectetur adipiscing elit. Phasellus imperdiet augue ac est iaculis, sed laoreet leo sodales.</mark> Curabitur varius elit sed semper vehicula. Fusce luctus velit vel lacinia sagittis. Nullam sed nisl dictum augue accumsan placerat accumsan sed libero. Morbi aliquam felis id sem sollicitudin, <mark>sit amet convallis velit fermentum. Ut hendrerit leo sodales, placerat nibh ac, consequat purus.</mark> Integer turpis dui, viverra id nunc vestibulum, condimentum ultrices arcu.

Or in blockquotes:

> Lorem ipsum dolor sit amet, <mark>consectetur adipiscing elit. Phasellus imperdiet augue ac est iaculis, sed laoreet leo sodales.</mark> Curabitur varius elit sed semper vehicula. Fusce luctus velit vel lacinia sagittis. Nullam sed nisl dictum augue accumsan placerat accumsan sed libero. Morbi aliquam felis id sem sollicitudin, <mark>sit amet convallis velit fermentum. Ut hendrerit leo sodales, placerat nibh ac, consequat purus.</mark> Integer turpis dui, viverra id nunc vestibulum, condimentum ultrices arcu.

## Installation

Install `@nolebase/vitepress-plugin-enhanced-mark` to your project dependencies by running the following command:

::: code-group

```shell [@antfu/ni]
ni @nolebase/vitepress-plugin-enhanced-mark -D
```

```shell [pnpm]
pnpm add @nolebase/vitepress-plugin-enhanced-mark -D
```

```shell [npm]
npm install @nolebase/vitepress-plugin-enhanced-mark -D
```

```shell [yarn]
yarn add @nolebase/vitepress-plugin-enhanced-mark -D
```

:::

## Configuration

In VitePress's [**theme configuration file**](https://vitepress.dev/reference/default-theme-config#default-theme-config) (note that it's not a **configuration file**, it's usually located at `docs/.vitepress/theme/index.ts`, file paths and extensions may be vary), **import the enhanced mark style**:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

::: code-group

```typescript twoslash [.vitepress/theme/index.ts]
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeConfig } from 'vitepress'

import '@nolebase/vitepress-plugin-enhanced-mark/client/style.css' // [!code ++]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // other configurations...
  },
  enhanceApp({ app }) {
    // other configurations...
  },
}

export default Theme
```

:::
