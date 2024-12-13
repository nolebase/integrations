---
title: 懒加载模糊预览图
category: 懒加载模糊预览图
---

<script setup>
import packageJSON from '~/packages/markdown-it-unlazy-img/package.json'
</script>

# 懒加载模糊预览图 <Badge type="tip" :text="`v${packageJSON.version}`" />

一个将图像标签包装并转换为使用 [blurhash](https://github.com/woltapp/blurhash) 和 [thumbhash](https://github.com/evanw/thumbhash) 这类模糊图片哈希算法以支持 [unlazy](https://github.com/johannschopplich/unlazy) 图像懒加载的 [`markdown-it`](https://github.com/markdown-it/markdown-it) 插件。

## 安装

通过运行以下命令将 `@nolebase/markdown-it-unlazy-img` 安装到您的项目依赖项中：

::: code-group

```shell [@antfu/ni]
ni @nolebase/markdown-it-unlazy-img -D
```

```shell [pnpm]
pnpm add @nolebase/markdown-it-unlazy-img -D
```

```shell [npm]
npm install @nolebase/markdown-it-unlazy-img -D
```

```shell [yarn]
yarn add @nolebase/markdown-it-unlazy-img -D
```

:::

## 配置

### 为 VitePress 配置

在 VitePress 的配置文件中（通常为 `docs/.vitepress/config.ts`，文件路径和拓展名也许会有区别），将 `@nolebase/markdown-it-unlazy-img` 作为一个插件导入，并将其作为 `markdown` 选项的 `markdown-it` 插件使用：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

```typescript
import { defineConfigWithTheme } from 'vitepress'
import { UnlazyImages } from '@nolebase/markdown-it-unlazy-img' // [!code ++]

export default defineConfigWithTheme({
  lang: 'zh-CN',
  title: '网站名称', // 仅供参考，请不要直接复制
  description: '某些介绍', // 仅供参考，请不要直接复制
  themeConfig: {
    // 其他各种配置...
  },
  markdown: {
    config: (md) => {
      md.use(md.use(UnlazyImages(), { // [!code ++]
        imgElementTag: 'NolebaseUnlazyImg', // [!code ++]
      }) // [!code ++]
    },
  },
})
```

### 自由配置

<!--@include: @/pages/zh-CN/snippets/configure-on-your-own-warning.md-->

在 [`markdown-it`](https://github.com/markdown-it/markdown-it) 的实例可被访问的地方先使用 `import` 语句将本插件导入到文件中：

```typescript
import { UnlazyImages } from '@nolebase/markdown-it-unlazy-img' // [!code ++]
```

然后使用 `markdown-it` 实例的 `use()` 函数将导入后的 `UnlazyImages` 作为插件使用，：

```typescript
import type { MarkdownIt } from 'markdown-it'
let markdownIt = null as MarkdownIt
// ---cut---
import { UnlazyImages } from '@nolebase/markdown-it-unlazy-img' // [!code ++]

// 中间剩余的其他代码...

// @noErrors
markdownIt.use(UnlazyImages(), { // [!code ++]
  imgElementTag: 'NolebaseUnlazyImg', // [!code ++]
}) // [!code ++]
```
