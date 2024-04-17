# 元素转换 <Badge type="tip" text="v2.0.0-rc5" />

这是一个面向高级用户的低级插件，旨在用于转换 `markdown-it` 的 [Token](https://markdown-it.github.io/markdown-it/#Token) 以执行诸如「替换元素」、「添加属性」等任务。

::: warning 在开始之前

此插件主要是 [行内链接预览](/pages/zh-CN/integrations/vitepress-plugin-inline-link-preview/) 的辅助工具 `markdown-it` 插件，用于将所有 `<a>` 元素转换为 `<VPNolebaseInlineLinkPreview>` 组件。

当直接使用此插件时，您可能会在转换 [Token](https://markdown-it.github.io/markdown-it/#Token) 和元素后与 VitePress 或 Vue markdown 插件集成时遇到诸如 `Invalid tag` 或 `Element missing end tag` 等错误，
或者与不兼容转换后元素的其他 `markdown-it` 插件集成时遇到错误。请在了解 `markdown-it` 的 [Token API](https://markdown-it.github.io/markdown-it/#Token) 如何工作后使用它。

:::

## 安装

通过运行以下命令将 `@nolebase/markdown-it-bi-element-transform` 安装到您的项目依赖项中：

::: code-group

```shell [@antfu/ni]
ni @nolebase/markdown-it-bi-element-transform -D
```

```shell [pnpm]
pnpm add @nolebase/markdown-it-bi-element-transform -D
```

```shell [npm]
npm install @nolebase/markdown-it-bi-element-transform -D
```

```shell [yarn]
yarn add @nolebase/markdown-it-bi-element-transform -D
```

:::

## 用法

::: tip 对开发者的建议

在学习和调试时，我们建议在项目中加入 [`vite-plugin-inspect`](https://github.com/antfu/vite-plugin-inspect)。它允许你检查 Vite 插件、Markdown 转换的中间状态。安装后可以通过访问 [](http://localhost:5173/__inspect/)，检查项目的模块和转换堆栈。

请查看 [`vite-plugin-inspect` docs](https://github.com/antfu/vite-plugin-inspect) 中的安装说明。

<picture>
  <source srcset="./assets/vite-plugin-inspect-screenshot-day-theme.png" media="(prefers-color-scheme: light)">
  <source srcset="./assets/vite-plugin-inspect-screenshot-night-theme.png" media="(prefers-color-scheme: dark)">
  <img src="./assets//vite-plugin-inspect-screenshot-day-theme.png" alt="vite-plugin-inspect 截图" />
</picture>

:::

### 更改元素的标签

这里有段示例代码，我们可以用它作为参考：

```ts twoslash
import MarkdownIt from 'markdown-it'
let markdownIt: MarkdownIt = null as unknown as MarkdownIt
// ---cut---
import { ElementTransform } from '@nolebase/markdown-it-element-transform'

markdownIt.use(ElementTransform, (() => {
  // 在闭包函数内部定义变量，以便在多个 Token 之间共享状态
  // 此处由于我们需要修改两个 Token（link_open（链接开标签），link_close（链接闭标签）），所以我们需要一个变量来跟踪下一个 Token 是否需要转换
  let transformNextLinkCloseToken = false

  return {
    transform(token) {
      switch (token.type) {
        case 'link_open':
          // 可以进行一些条件判断，以决定是否转换 Token
          // 比如此处的：如果是标题锚点，则不转换，因为标题锚点链接和普通链接处理方法可能会有所不同
          if (token.attrGet('class') !== 'header-anchor') {
            // 修改 Token 的标签
            token.tag = '你的组件名'
            // 设置标记以便在下一个 Token 中转换
            transformNextLinkCloseToken = true
          }
          break
        case 'link_close':
          // 如果标记为 true，则转换 Token
          if (transformNextLinkCloseToken) {
            // 修改 Token 的标签
            token.tag = '你的组件名'
            // 还原标记
            transformNextLinkCloseToken = false
          }

          break
      }
    },
  }
})())
```

### 用于添加属性

在很多情况下都会有希望为元素添加更多属性的需求。

比如：

1. 为所有 `<a>` 元素添加 `target="_blank"` 和 `rel="noopener noreferrer"`。
2. 为所有 `<span>` 元素添加内联样式。
3. 为元素添加更多的类。

#### 为链接添加 `target="_blank"` 和 `rel="noopener noreferrer"`

```ts twoslash
import MarkdownIt from 'markdown-it'
let markdownIt: MarkdownIt = null as unknown as MarkdownIt
// ---cut---
import { ElementTransform } from '@nolebase/markdown-it-element-transform'

markdownIt.use(ElementTransform, (() => {
  return {
    transform(token) {
      if (token.type === 'link_open') {
        token.attrSet('target', '_blank')
        token.attrSet('rel', 'noopener noreferrer')
      }
    },
  }
})())
```

#### 添加内联样式

```ts twoslash
import MarkdownIt from 'markdown-it'
let markdownIt: MarkdownIt = null as unknown as MarkdownIt
// ---cut---
import { ElementTransform } from '@nolebase/markdown-it-element-transform'

markdownIt.use(ElementTransform, (() => {
  return {
    transform(token) {
      if (token.type === 'span') {
        token.attrSet('style', 'color: red;')
      }
    },
  }
})())
```

#### 为元素添加更多的类

```ts twoslash
import MarkdownIt from 'markdown-it'
let markdownIt: MarkdownIt = null as unknown as MarkdownIt
// ---cut---
import { ElementTransform } from '@nolebase/markdown-it-element-transform'

markdownIt.use(ElementTransform, (() => {
  return {
    transform(token) {
      if (token.type === 'span') {
        const existingClasses = token.attrGet('class') || ''
        token.attrSet('class', existingClasses + ' my-custom-class')
      }
    },
  }
})())
```

## 替代品？

### [jeffbski/markdown-it-modify-token](https://github.com/jeffbski/markdown-it-modify-token)

是的，这个插件的功能与 [jeffbski/markdown-it-modify-token](https://github.com/jeffbski/markdown-it-modify-token) 完全相同。
我们之所以有自己的实现，是因为我们在实现之前并不知道该插件的存在。

如果你喜欢，请随意使用替代方案。😋
