# Rive Canvas（懒 Teleport） <Badge type="danger" text="Alpha" />

::: danger 🛑 此包仍处于 Alpha 测试阶段
此包仍处于 Alpha 测试阶段，不建议在生产中使用。未来 API 可能会发生变化，当前版本可能存在错误。请谨慎使用。
:::

## 介绍

Rive Canvas（懒 Teleport）是一种极为特殊的组件，和常规的组件不同，常规的组件使用直接的 `<ComponentName />` 的形式在其他的 Vue 组件中引用组件，而 Rive Canvas（懒 Teleport）则是通过在 HTML 中添加特定的标签，搭配其他地方引用的 `<NuLazyTeleportRiveCanvas />` 组件，来实现在页面中引入 [Rive](https://rive.app/) 动画。

### 什么时候会需要使用到这样的组件？

1. 对于 VitePress 或者其他静态生成器而言，并不是每个文档和 frontmatter 的参数都是支持渲染为 Vue 组件的，如果直接在 `v-html` 中插入 Vue 组件，是无法渲染的，这时候就需要使用到 Rive Canvas（懒 Teleport）这样的组件，通过一个占位符 HTML 标签，等到页面加载完成后再引入 Rive 动画。
2. 如果你也使用像是 Astro 和 Rspress 这样的静态生成器，你可能会发现在 Markdown 中插入 Vue 组件是不被支持的，这时候也可以使用 Rive Canvas（懒 Teleport）这样的组件。

## 示例

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

## 用法

### 注册为全局组件

首先需要在 Vue 组件中引入 `NuLazyTeleportRiveCanvas` 组件，然后注册为全局组件：

```ts twoslash
import type { App } from 'vue'
let app = null as unknown as App
// ---cut---
import { NuLazyTeleportRiveCanvas } from '@nolebase/ui';

app.component('NuLazyTeleportRiveCanvas', NuLazyTeleportRiveCanvas);
```

### 配置 Vite

由于 `<NuLazyTeleportRiveCanvas />` 底层依赖于 `@rive-app/canvas`，如果您也使用 Vite 作为打包器和开发环境服务器，则需要像这样在 `vite.config.ts` 文件中添加以下配置：

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

> 有关为何要这样配置的更多信息，请参阅 [Dep Optimization Options | Vite](https://vitejs.dev/config/dep-optimization-options.html#optimizedeps-exclude) 文档。

另外，对于 [Rive](https://rive.app/) 而言，[Rive](https://rive.app/) 所使用的文件格式 [`.riv`](https://help.rive.app/runtimes/loading-assets) 也并不是 Vite 所支持的默认文件格式，所以你可能还需要添加以下配置：

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

> 有关为何要这样配置的更多信息，请参阅 [Shared Options | Vite](https://vitejs.dev/config/shared-options.html#assetsinclude) 文档。

### 在入点添加组件

然后在入点（`App.vue`）中添加 `<NuLazyTeleportRiveCanvas />` 组件：

```vue twoslash
<script setup lang="ts">
import { NuLazyTeleportRiveCanvas } from '@nolebase/ui' // [!code ++]
</script>

<template>
  <NuLazyTeleportRiveCanvas /><!-- [!code ++] -->
</template>
```

或者 VitePress 的 `theme/index.ts` 的 `layout-top` 插槽中添加 `<NuLazyTeleportRiveCanvas />` 组件：

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

### 在 HTML 中添加 Rive Canvas 会渲染 Canvas 的占位符标签

接下来，在任何一个支持 HTML 原始渲染的地方，为期望渲染为 Canvas 的标签添加以下属性即可：

- `class="rive-canvas"`
- `data-rive-canvas="true"`
- `data-rive-src="<rive 文件路径>"`

::: warning 注意
由于 Rive Canvas（懒 Teleport）是通过 HTML 标签来引入的，所以任何 Rive Canvas（懒 Teleport）所引用的 [`.riv` Rive 文件](https://help.rive.app/runtimes/loading-assets)都无法自动地被 Vite 所处理，所以你需要手动将 Rive 文件放置到诸如 `public` 文件夹中，并在 `data-rive-src` 属性中填写正确的路径。
:::

比如这样：

```html
<span
  class="rive-canvas"
  data-rive-canvas="true"
  data-rive-src="/icons/star-emoji-animated.riv"
></span>
```

## 自定义

### 调整大小

默认情况下，Rive Canvas 会创建一个 500 x 500 的画布。你可以通过添加

- `data-rive-canvas-props-canvas-width`
- `data-rive-canvas-props-canvas-width`

这两个属性来自定义画布的大小。

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

## 参考

### 参数

<br>

#### `data-rive-canvas-props-canvas-width`

含义：[`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) 本身的宽度。

介绍：可以理解为分辨率，与 CSS 宽度无关，这个数值的大小会影响到画布上渲染的动画的分辨率，但与此同时如果设置的数值过大，会导致动画的渲染性能下降。

默认值：`500`

#### `data-rive-canvas-props-canvas-height`

含义：[`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) 本身的高度。

介绍：可以理解为分辨率，与 CSS 高度无关，这个数值的大小会影响到画布上渲染的动画的分辨率，但与此同时如果设置的数值过大，会导致动画的渲染性能下降。

默认值：`500`

#### `data-rive-canvas-props-width`

含义：[`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) 的 CSS `min-width`。

介绍：这个数值会影响到 [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) 的 CSS 宽度，但不会影响到画布上渲染的动画的分辨率。可以根据不同位置的需求来调整。当作是普通的 CSS 的 [`min-width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width) 属性就好了。

默认值：`16px`

#### `data-rive-canvas-props-height`

含义：[`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) 的 CSS `min-height`。

介绍：这个数值会影响到 [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) 的 CSS 高度，但不会影响到画布上渲染的动画的分辨率。可以根据不同位置的需求来调整。当作是普通的 CSS 的 [`min-height`](https://developer.mozilla.org/en-US/docs/Web/CSS/width) 属性就好了。

默认值：`16px`

#### `data-rive-canvas-props-padding-top`

含义：[`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) 的 CSS [`padding-top`](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top)。

介绍：通常而言，Rive 和 Lottie 动画的渲染应该是全画幅的，意味着绝大多数情况下，动画都会占满整个画布。但是，如果你需要在动画周围添加一些额外的空白，可以通过这个属性来调整。

默认值：`4px`

#### `data-rive-canvas-props-padding-bottom`

含义：[`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) 的 CSS [`padding-bottom`](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom)。

介绍：通常而言，Rive 和 Lottie 动画的渲染应该是全画幅的，意味着绝大多数情况下，动画都会占满整个画布。但是，如果你需要在动画周围添加一些额外的空白，可以通过这个属性来调整。

默认值：`4px`

#### `data-rive-canvas-props-padding-left`

含义：[`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) 的 CSS [`padding-left`](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left)。

介绍：通常而言，Rive 和 Lottie 动画的渲染应该是全画幅的，意味着绝大多数情况下，动画都会占满整个画布。但是，如果你需要在动画周围添加一些额外的空白，可以通过这个属性来调整。

默认值：`4px`

#### `data-rive-canvas-props-padding-right`

含义：[`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) 的 CSS [`padding-right`](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-right)。

介绍：通常而言，Rive 和 Lottie 动画的渲染应该是全画幅的，意味着绝大多数情况下，动画都会占满整个画布。但是，如果你需要在动画周围添加一些额外的空白，可以通过这个属性来调整。

默认值：`4px`

## 注解

在本篇文档中所使用的是来自 Telegram 的 [Animated Emoji](https://blog.emojipedia.org/telegrams-animated-emoji-set/)。

这些 Emoji 可以通过直接拖动 Telegram 中的 Emoji 到浏览器中直接下载。不过下载到的文件是拓展名为 `.tgs` 的文件，好在社区有厉害的伙伴给制作了 TGS 到 [Lottie](https://lottiefiles.com/) 的转换工具 [Lottie/TGS Editor](https://michielp1807.github.io/lottie-editor/#/editor)，可以通过导入 `.tgs` 文件，然后导出为 [Lottie](https://lottiefiles.com/) 的 [`.json` 文件](https://lottiefiles.com/tools/lottie-json-to-optimized-lottie-json)，再将 Lottie `.json` 文件通过 Rive 的线上编辑器转换为 Rive 的 `.riv` 文件。

::: tip 有趣的事实
其实 [`.tgs` ](https://core.telegram.org/stickers#creating-animations) 文件是 Telegram 基于 bodymovin 所制作的 AE 插件 [bodymovin](https://github.com/bodymovin/bodymovin-extension) Fork 和修改而来的 `.zip` 压缩格式[^1]，内部其实就是 Lottie JSON 文件，这也是为什么可以通过 [Lottie/TGS Editor](https://michielp1807.github.io/lottie-editor/#/editor) 来转换的原因。
:::

如果你想要了解都有哪些 Animated Emoji，可以通过 [Animated Telemoji - Telegram](https://telegram-animated-emojis.vercel.app/) 或者 [Animated Emoji Pack](https://t.me/addstickers/AnimatedEmoji) 来查看。

当然，可爱的 Emoji 大家都喜欢，[Microsoft 的 Fluent Emoji](https://github.com/microsoft/fluentui-emoji) 也是非常有趣的 Emoji，也有人为他们制作了[动画版本的 Emoji](https://github.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis)，你可以通过 [Animated Fluent Emojis - Microsoft](https://animated-fluent-emoji.vercel.app/) 列表查看。

[^1]: <https://github.com/LottieFiles/tgskit/issues/2#issuecomment-1220326893>
