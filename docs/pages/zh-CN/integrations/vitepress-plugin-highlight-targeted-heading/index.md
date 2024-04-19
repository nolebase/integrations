<script setup>
import packageJSON from '~/packages/vitepress-plugin-highlight-targeted-heading/package.json'
</script>

# 闪烁高亮当前的目标标题 <Badge type="tip" :text="`v${packageJSON.version}`" />

## 效果演示

可以试着点击下面的两个链接，然后观察标题部分发生的变化：

- [跨页面高亮目标标题](/pages/zh-CN/guide/getting-started.html#getting-started)
- [页面内高亮目标标题](#如何使用)

<video controls muted>
  <source src="./assets/demo-video-1.zh-CN.mov">
</video>

当我们点击右侧的大纲进行导览的时候会有黄色的闪烁块在标题元素周围闪烁。

## 为什么

当今的文档网站都会支持读取 [URL 中传递的 Hash ID](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash) 然后滚动页面直至 Hash ID 选中的元素出现或出现在靠上的位置上，这个功能通常以用户点击标题左侧或右侧的 anchor 图标，或者是点击了右侧可交互和可选择的大纲列表中的元素为触发条件。

然而绝大多数的文档网站的目标标题都不会在点击后高亮和指示当前高亮的标题行在哪里。

::: info 目标标题是什么？这样的功能是如何工作的？

当点击右侧大纲内的链接或者直接点击标题左侧的链接按钮的时候，注意观察地址栏中的变化。

你会发现 URL 中会出现一个 `#` 符号，后面跟着一个 ID，这个 ID 就是目标标题的 ID。

这里说的目标标题的 ID 其实就是 HTML 元素的 ID，所以理论上不光是可以要求框架和浏览器配合着去滚动标题元素到视窗内，也可以是其他有效的带有匹配得上 HTML ID 的元素。

这样的元素可以通过按下 <kbd>F12</kbd> 打开开发者工具，然后在控制台中输入

```js
document.querySelector('#为什么')
```

来查找到，这段代码将会返回一个 HTML 元素，这个元素就是我们说的「目标标题」。

:::

为什么会需要高亮呢？

1. 一个屏幕中出现了好几个标题的时候，用户点击了其中一个标题，然后页面滚动到了标题所在的位置，但是用户并不知道当前的标题在哪里，这个时候用户就需要自行寻找标题，这个过程是非常不友好的，因为用户需要重新阅读视口内的内容并自行寻找到他们希望寻找的标题。
2. 对于文档末尾有多个标题的时候，点击右侧的大纲将不会发生页面的滚动动画，用户，作为读者自然也就无法通过一个固定的「看窗口顶部的标题来寻找和定位标题」的可重复行为模式来学习如何寻找标题。

这个时候能够指示和高亮察觉不到的标题高亮就是一件非常重要的事情，这个插件就是因此而诞生的。

## 怎么安装和配置

### 安装

你可以通过下面的命令将 `@nolebase/vitepress-plugin-highlight-targeted-heading` 安装到 VitePress 项目的依赖中：

::: code-group

```shell [pnpm]
pnpm add @nolebase/vitepress-plugin-highlight-targeted-heading -D
```

```shell [npm]
npm install @nolebase/vitepress-plugin-highlight-targeted-heading -D
```

```shell [yarn]
yarn add @nolebase/vitepress-plugin-highlight-targeted-heading -D
```

:::

### 为 VitePress 配置

配置分为两个大步骤：

- [闪烁高亮当前的目标标题 ](#闪烁高亮当前的目标标题-)
  - [效果演示](#效果演示)
  - [为什么](#为什么)
  - [怎么安装和配置](#怎么安装和配置)
    - [安装](#安装)
    - [为 VitePress 配置](#为-vitepress-配置)
      - [添加 Vite 相关的配置](#添加-vite-相关的配置)
      - [添加 VitePress 主题相关的配置](#添加-vitepress-主题相关的配置)
  - [如何使用](#如何使用)

#### 添加 Vite 相关的配置

首先，请在你的 VitePress [**核心配置文件**](https://vitepress.dev/reference/site-config#config-resolution) 中（注意不是**主题配置文件**，通常为 `docs/.vitepress/config.ts`，文件路径和拓展名也许会有区别）的根字段中添加 [Vite](https://vitejs.dev) 与 [SSR 服务端渲染相关](https://cn.vitejs.dev/config/ssr-options.html#ssr-external) 的配置。

将高亮插件包 `@nolebase/vitepress-plugin-highlight-targeted-heading` 添加到需要 VitePress 底层的 Vite 帮忙处理的依赖：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

```typescript twoslash
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: { // [!code ++]
    ssr: { // [!code ++]
      noExternal: [ // [!code ++]
        // 如果还有别的依赖需要添加的话，并排填写和配置到这里即可 // [!code hl]
        '@nolebase/vitepress-plugin-highlight-targeted-heading', // [!code ++]
      ], // [!code ++]
    }, // [!code ++]
  }, // [!code ++]
  lang: 'zh-CN',
  title: '网站标题',
  themeConfig: {
    // 其他的配置...
  }
  // 其他的配置...
})
```

如果你很厉害，为 VitePress 的文档站点配置了分离和单独的 [Vite 配置文件](https://vitejs.dev/config/)（比如 `vite.config.ts`），那你也可以省略上面的配置，直接在 Vite 的配置文件中添加下面的配置：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

```typescript twoslash
import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    ssr: { // [!code ++]
      noExternal: [ // [!code ++]
        // 如果还有别的依赖需要添加的话，并排填写和配置到这里即可 // [!code hl]
        '@nolebase/vitepress-plugin-highlight-targeted-heading', // [!code ++]
      ], // [!code ++]
    }, // [!code ++]
    optimizeDeps: {
      exclude: ['vitepress'],
    },
    plugins: [
      // 其他 Vite 插件配置...
    ],
    // 其他的配置...
  }
})

```

如果你在没有单独配置过 [Vite 配置文件](https://vitejs.dev/config/)（比如 `vite.config.ts`）的情况下想要直接复制上面的代码的话，只需要在 VitePress 站点所在的地方新建一个 `vite.config.ts` 即可，不过也记得还需要通过包管理器安装一下 `vite` 哦。

#### 添加 VitePress 主题相关的配置

在 VitePress 的[**主题配置文件**](https://vitepress.dev/reference/default-theme-config#default-theme-config)中（注意不是**配置文件**，通常为 `docs/.vitepress/theme/index.ts`，文件路径和拓展名也许会有区别），将 `@nolebase/vitepress-plugin-highlight-targeted-heading` 导入，并且将其添加到 `Layout` 的拓展中：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

::: code-group

```typescript twoslash [docs/.vitepress/theme/index.ts]

import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeConfig } from 'vitepress'

import {  // [!code ++]
  NolebaseHighlightTargetedHeading,  // [!code ++]
} from '@nolebase/vitepress-plugin-highlight-targeted-heading/client' // [!code ++]

import '@nolebase/vitepress-plugin-highlight-targeted-heading/client/style.css' // [!code ++]*

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
​    return h(DefaultTheme.Layout, null, {
      // 其他的配置...
      'layout-top': () => [ // [!code ++]
        h(NolebaseHighlightTargetedHeading), // [!code ++]
      ], // [!code ++]
​    })
  },
  enhanceApp() {
​    // 其他的配置...
  },
}

export default Theme
```

:::

就是这么多了，接下来已经可以使用了！

## 如何使用

现在再次构建或者打开 VitePress 的开发服务器，你将可以观测到，只要是 URL 中的 `#` 有对应的 ID 的元素的时候，下面的情况都会生效：

- 直接点击标题左侧的链接按钮
- 直接点击右侧大纲部分中的链接
- 首次加载含有 `#` 的 URL

就是这么多了，祝撰写愉快！

## 错误排查

### 遭遇了 `Cannot find module ... or its corresponding type declarations` 错误？

<!--@include: @/pages/zh-CN/snippets/troubleshooting-cannot-find-module.md-->
