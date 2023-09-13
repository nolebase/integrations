# 双向链接

## 如何使用

通过下面的命令将 `@nolebase/markdown-it-bi-directional-links` 安装到你的项目依赖中：

::: code-group

```shell [pnpm]
pnpm add @nolebase/markdown-it-bi-directional-links
```

```shell [npm]
npm install @nolebase/markdown-it-bi-directional-links
```

```shell [yarn]
yarn add @nolebase/markdown-it-bi-directional-links
```

:::

然后先在 [`markdown-it`](https://github.com/markdown-it/markdown-it) 的实例可被访问的地方先使用 `import` 语句将双向链接插件导入到文件中：

```typescript
import MarkdownItBiDirectionalLinks from '@nolebase/markdown-it-bi-directional-links' // [!code  ++]
```

然后使用 `markdown-it` 实例的 `use()` 函数将导入后的 `MarkdownItBiDirectionalLinks` 作为插件使用：

```typescript
import MarkdownItBiDirectionalLinks from '@nolebase/markdown-it-bi-directional-links'

// 中间剩余的其他代码...

markdownIt.use(MarkdownItBiDirectionalLinks()) // [!code  ++]
```

在 `MarkdownItBiDirectionalLinks()` 函数中，你需要提供一个必填的选项对象，该对象中的 `dir` 字段通常可以直接通过 `import` 语句导入 `process` 或者 `node:process` 之后的 `cwd()` 函数来获取：

```typescript
import MarkdownItBiDirectionalLinks from '@nolebase/markdown-it-bi-directional-links'

// 中间剩余的其他代码...

markdownIt.use(MarkdownItBiDirectionalLinks({
  dir: process.cwd() // [!code  ++]
}))
```

## 用法示例

```markdown
[[双向链接目标页面的文件名称]]
```

## 效果演示

[[双向链接示例页面]]
