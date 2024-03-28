# Rive Canvas (Lazy Teleport) <Badge type="danger" text="Alpha" />

::: danger 🛑 This package is still in the Alpha test stage.
This package is still in the Alpha test stage and is not recommended for use in production. The API may change in the future, and there may be errors in the current version. Please use it with caution.
:::

## Introduce

Rive Canvas is a very special component. Unlike regular components, regular components refer to components in other Vue components in the form of direct `<ComponentName />`, while Rive Canvas (Lazy Teleport) introduces [Rive](https://rive.app/) animation into the page by adding specific tags to HTML with the `<NuLazyTeleportRiveCanvas />` component referenced elsewhere.

### When will such components need to be used?

1. For VitePress or other static generators, not every document and frontmatter parameter supports rendering as a Vue component. If the Vue component is inserted directly in `v-html`, it cannot be rendered. You need to use a component such as Rive Canvas (Lazy Teleport) to introduce Rive animation through a placeholder HTML tag until the page is loaded.
2. If you also use static generators like Astro and Rspress, you may find that inserting Vue components in Markdown is not supported. At this time, you can also use Rive Canvas (Lazy Teleport) Such a component.

## Example

<div flex flex-row items-center>
  <div w-20 h-20>
    <span class="rive-canvas" data-rive-canvas="true" data-rive-src="/icons/star-emoji-animated.riv"></span>
  </div>

  <div w-20 h-20>
    <span class="rive-canvas" data-rive-canvas="true" data-rive-src="/icons/crystall-ball-emoji-animated.riv"></span>
  </div>

  <div w-20 h-20>
    <span class="rive-canvas" data-rive-canvas="true" data-rive-src="/icons/rocket-emoji-animated.riv"></span>
  </div>
</div>

## Usage

### Register as a global component

First, you need to import the `NuLazyTeleportRiveCanvas` component in the Vue component and then register it as a global component:

```ts twoslash
import type { App } from 'vue'
let app = null as unknown as App
// ---cut---
import { NuLazyTeleportRiveCanvas } from '@nolebase/ui';

app.component('NuLazyTeleportRiveCanvas', NuLazyTeleportRiveCanvas);
```

### Configure Vite

Since `<NuLazyTeleportRiveCanvas />` depends on `@rive-app/canvas`. If you also use Vite as your bundler and development environment server, you need to add the following configuration to your `vite.config.ts` file like this:

```ts twoslash
import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    optimizeDeps: { // [!code ++]
      include: [ // [!code ++]
        // 添加这一行到你的 vite.config.ts 的 optimizeDeps.include 数组中 // [!code ++]
        '@nolebase/ui  @rive-app/canvas', // [!code ++]
      ], // [!code ++]
    }, // [!code ++]
  }
})
```

> For more information about why configure this, please refer to the [Dep Optimization Options | Vite](https://vitejs.dev/config/dep-optimization-options.html#optimizedeps-exclude) documentation.

Also, for [Rive](https://rive.app/), the file format [`.riv`](https://help.rive.app/runtimes/loading-assets) used by [Rive](https://rive.app/) is not the default file format supported by Vite. The file format used by [Rive]() [`.riv`]() is also not the default file format supported by Vite, so you may need to add the following configuration:

```ts twoslash
// .vitepress/config.ts
import { defineConfig } from 'vite'

export default defineConfig(() => {
  return { // [!code ++]
    assetsInclude: [ // [!code ++]
      '**/*.riv', // [!code ++]
    ], // [!code ++]
  } // [!code ++]
})
```

> For more information about why configure this, please refer to the [Shared Options | Vite](https://vitejs.dev/config/shared-options.html#assetsinclude) documentation.

### Import and use in entry file

Then add the `<NuLazyTeleportRiveCanvas />` component in the entry file (`App.vue`):

```vue twoslash
<script setup lang="ts">
import { NuLazyTeleportRiveCanvas } from '@nolebase/ui' // [!code ++]
</script>

<template>
  <NuLazyTeleportRiveCanvas /><!-- [!code ++] -->
</template>
```

Or add `<NuLazyTeleportRiveCanvas />` component into `layout-top` slot you can specify in `theme/index.ts` of VitePress:

```ts twoslash
// .vitepress/theme/index.ts
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { NuLazyTeleportRiveCanvas } from '@nolebase/ui'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => [ // [!code ++]
        h(NuLazyTeleportRiveCanvas) // [!code ++]
      ] // [!code ++]
    })
  }
}
```

### Adding placeholder elements for Rive Canvas in HTML will render the placeholder tag of Canvas

Next, wherever raw HTML rendering (`v-html`) is supported, just add the following attribute to the tag that is expected to be rendered as a Canvas:

- `class="rive-canvas"`
- `data-rive-canvas="true"`
- `data-rive-src="<rive file path>"`

::: warning Attention

Since Rive Canvas (Lazy Teleport) is introduced via HTML tags, any [`.riv` Rive files](https://help.rive.app/runtimes/loading-assets) referenced by Rive Canvas (Lazy Teleport) will not be automatically processed by Vite, so you will need to manually place the Rive file in a location such as `public` folder. automatically processed by Vite, so you'll need to manually place the Rive file in a folder such as `public` and fill in the `data-rive-src` attribute with the correct path.

:::

For example:

```html
<span
  class="rive-canvas"
  data-rive-canvas="true"
  data-rive-src="/icons/star-emoji-animated.riv"
></span>
```

## Customization

### Adjust the size

By default, Rive Canvas creates a 500 x 500 canvas. You can customize the size of the canvas by adding the two attributes:

- `data-rive-canvas-props-canvas-width`
- `data-rive-canvas-props-canvas-width`

<div flex flex-row w-full>
  <div flex flex-col items-center w-full>
    <div w-20 h-20>
      <span class="rive-canvas" data-rive-canvas="true" data-rive-src="/icons/star-emoji-animated.riv" data-rive-canvas-props-canvas-width="25" data-rive-canvas-props-canvas-height="25"></span>
    </div>
    <span text-sm>Low resolution with <code>25</code> x <code>25</code></span>
  </div>
  <div flex flex-col items-center w-full>
    <div w-20 h-20>
      <span class="rive-canvas" data-rive-canvas="true" data-rive-src="/icons/star-emoji-animated.riv" data-rive-canvas-props-canvas-width="1000" data-rive-canvas-props-canvas-height="1000"></span>
    </div>
    <span text-sm>Ultra high resolution with <code>1000</code> x <code>1000</code></span>
  </div>
</div>

```html
<span
  class="rive-canvas"
  data-rive-canvas="true"
  data-rive-src="/icons/star-emoji-animated.riv"
  data-rive-canvas-props-canvas-width="25"
  data-rive-canvas-props-canvas-height="25"
>
</span>
```

## References

### Props

### `data-rive-canvas-props-canvas-width`

The width of the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) itself.

Description: It can be understood as the resolution, which is independent of the CSS width. The size of this value will affect the resolution of the animation rendered on the canvas, but at the same time, if the set value is too large, it will cause the rendering performance of the animation to decrease.

Default value: `500`

### `data-rive-canvas-props-canvas-height`

The height of the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) itself.

Description: It can be understood as the resolution, which is independent of the CSS height. The size of this value will affect the resolution of the animation rendered on the canvas, but at the same time, if the set value is too large, it will cause the rendering performance of the animation to decrease.

Default value: `500`

### `data-rive-canvas-props-width`

The CSS `min-width` of the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas).

Description: This value will affect the CSS width of the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas), but will not affect the resolution of the animation rendered on the canvas. It can be adjusted according to the requirements of different locations. Just treat it as a normal CSS [`min-width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width) property.

Default value: `16px`

### `data-rive-canvas-props-height`

The CSS `min-height` of the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas).

Description: This value will affect the CSS height of the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas), but will not affect the resolution of the animation rendered on the canvas. It can be adjusted according to the requirements of different locations. Just treat it as a normal CSS [`min-height`](https://developer.mozilla.org/en-US/docs/Web/CSS/width) property.

Default value: `16px`

### `data-rive-canvas-props-padding-top`

The CSS [`padding-top`](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top) of the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas).

Description: Generally speaking, the rendering of [Rive](https://rive.app/) and [Lottie](https://lottiefiles.com/) animations should be full-screen, which means that in most cases, the animation will occupy the entire canvas. However, if you need to add some extra space around the animation, you can adjust it with this attribute.

Default value: `4px`

### `data-rive-canvas-props-padding-bottom`

The CSS [`padding-bottom`](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom) of the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas).

Description: Generally speaking, the rendering of [Rive](https://rive.app/) and [Lottie](https://lottiefiles.com/) animations should be full-screen, which means that in most cases, the animation will occupy the entire canvas. However, if you need to add some extra space around the animation, you can adjust it with this attribute.

Default value: `4px`

### `data-rive-canvas-props-padding-left`

The CSS [`padding-left`](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left) of the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas).

Description: Generally speaking, the rendering of [Rive](https://rive.app/) and [Lottie](https://lottiefiles.com/) animations should be full-screen, which means that in most cases, the animation will occupy the entire canvas. However, if you need to add some extra space around the animation, you can adjust it with this attribute.

Default value: `4px`

### `data-rive-canvas-props-padding-right`

The CSS [`padding-right`](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-right) of the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas).

Description: Generally speaking, the rendering of [Rive](https://rive.app/) and [Lottie](https://lottiefiles.com/) animations should be full-screen, which means that in most cases, the animation will occupy the entire canvas. However, if you need to add some extra space around the animation, you can adjust it with this attribute.

Default value: `4px`

## Annotation

The cute animated emojis are [Animated Emoji](https://blog.emojipedia.org/telegrams-animated-emoji-set/) authored by wonderful Telegram team.

These Emoji can be directly downloaded by dragging the Emoji from Telegram into the browser. However, the downloaded file is a file with the extension `.tgs`, but fortunately, the community has powerful contributors who have made a TGS to [Lottie](https://lottiefiles.com/) conversion tool [Lottie/TGS Editor](https://michielp1807.github.io/lottie-editor/#/editor), which can be imported by importing the `.tgs` file, then export it as a [Lottie](https://lottiefiles.com/) [`.json` file](https://lottiefiles.com/tools/lottie-json-to-optimized-lottie-json), and then convert the Lottie `.json` file to a Rive `.riv` file through the Rive online editor.

::: tip Fun fact
In fact, the [`.tgs` ](https://core.telegram.org/stickers#creating-animations) file is a `.zip` compression format derived from the AE plugin [bodymovin](https://github.com/bodymovin/bodymovin-extension) over Telegram's fork based on the original one. There's actually a Lottie JSON file inside, which is why converting through [Lottie/TGS Editor](https://michielp1807.github.io/lottie-editor/#/editor) is possible.
:::

If you want to know which Animated Emoji are available, you can check them out through [Animated Telemoji - Telegram](https://telegram-animated-emojis.vercel.app/) or [Animated Emoji Pack](https://t.me/addstickers/AnimatedEmoji).

Of course, everyone loves cute Emoji, and [Microsoft's Fluent Emoji](https://github.com/microsoft/fluentui-emoji) is also a very interesting Emoji. Someone has also made an [animated version of the Emoji](https://github.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis) for them. You can check them out through the [Animated Fluent Emojis - Microsoft](https://animated-fluent-emoji.vercel.app/) list.

[^1]: <https://github.com/LottieFiles/tgskit/issues/2#issuecomment-1220326893>
