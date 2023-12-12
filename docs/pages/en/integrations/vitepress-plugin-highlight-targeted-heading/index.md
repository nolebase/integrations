# Blinking highlight targeted heading

## Demo

<video controls muted>
  <source src="./assets/demo-video-1.en.mov">
</video>

When we click on the outline on the right to navigate, there will be a yellow blinking block flashing around the targeted title element.

## Why

Today's documentation websites will support reading the [Hash ID passed in the URL](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash) and then scrolling the page until the Hash ID selected element appears or appears at the top position. This function is usually triggered by the user clicking the anchor icon on the left or right of the title, or clicking the interactive and selectable outline list on the right.

However, most of the targeted title elements of the documentation website will not highlight and indicate where the currently highlighted title line is after clicking.

::: info What is the targeted title? How does this feature work?

When you click on the link in the outline on the right or directly click the link button on the left of the title, pay attention to the changes in the address bar.

You will find that there is a `#` symbol in the URL, followed by an ID, which is the ID of the targeted title.

The ID of the targeted title mentioned here is actually the ID of the HTML element, so in theory, not only can the framework and the browser be required to scroll the title element into the viewport, but also other valid elements with matching HTML IDs.

This kind of element can be found by pressing <kbd>F12</kbd> to open the developer tool, and then enter

```js
document.querySelector('#why')
```

in the console to find it. This code will return an HTML element, which is what we call the "targeted title".

:::

Why do you need to highlight?

1. When user clicks one of the titles, the page scrolls to the position where the title is located, but the user does not know where the current title is due to the fact that there are several titles on the screen.
2. When user clocks one of the titles, the page is already at the bottom of the page, and the user cannot learn how to find the title by a fixed "look at the top of the viewport to find and locate the title" repeatable behavior pattern. Such scenario is even more critical when several titles appear at the end of the document.

At this time, being able to indicate and highlight the title that cannot be noticed is a very important thing, and this integration was born because of this.

## How to install and configure

### Install

You can install `@nolebase/vitepress-highlight-targeted-heading` to the dependencies of the VitePress project with the following command:

::: code-group

```shell [pnpm]
pnpm add @nolebase/vitepress-highlight-targeted-heading
```

```shell [npm]
npm install @nolebase/vitepress-highlight-targeted-heading
```

```shell [yarn]
yarn add @nolebase/vitepress-highlight-targeted-heading
```

:::

### Configure for VitePress

In VitePress's [**theme configuration file**](https://vitepress.dev/reference/default-theme-config#default-theme-config) (note that it's not a **configuration file**, it's usually located at `docs/.vitepress/theme/index.ts`, file paths and extensions may be vary), import `@nolebase/vitepress-plugin-enhanced-readabilities` import and add it to the `Layout` extension:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

::: code-group

```typescript [docs/.vitepress/theme/index.ts]
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeConfig } from 'vitepress'
import {  // [!code ++]
  NolebaseHighlightTargetedHeading,  // [!code ++]
} from '@nolebase/vitepress-plugin-highlight-targeted-heading' // [!code ++]

import '@nolebase/vitepress-plugin-highlight-targeted-heading/dist/style.css' // [!code ++]*

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // other configurations...
      'layout-top': () => [ // [!code ++]
        h(NolebaseHighlightTargetedHeading), // [!code ++]
      ], // [!code ++]
    })
  },
  enhanceApp() {
    // other configurations...
  },
}

export default Theme
```

:::

That's it, it is usable now 🎉.

## How to use

Now build or open the VitePress development server again, you will be able to observe that as long as there is an element with a corresponding ID in the `#` in the URL, the following situations will take effect:

- Click the link button on the left of the title directly
- Click the link in the outline on the right directly
- The URL containing `#` is loaded for the first time

That's all, happy writing!
