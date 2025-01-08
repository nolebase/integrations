---
title: 自动生成侧边栏
category: 自动生成侧边栏
---

<script setup>
import packageJSON from '~/packages/vitepress-plugin-sidebar/package.json'
</script>

# 自动生成侧边栏 <Badge type="tip" :text="`v${packageJSON.version}`" />

## 安装

通过运行以下命令将 `@nolebase/vitepress-plugin-sidebar` 安装到您的项目依赖项中：

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

## 使用

### 为 VitePress 配置

在 VitePress 的配置文件中（通常为 `docs/.vitepress/config.ts`，文件路径和拓展名也许会有区别），将 `@nolebase/vitepress-plugin-sidebar` 作为一个插件导入：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

```typescript twoslash
import { defineConfigWithTheme } from 'vitepress'
import { calculateSidebar } from '@nolebase/vitepress-plugin-sidebar' // [!code ++]

export default defineConfigWithTheme({
  lang: 'zh-CN',
  title: '网站名称', // 仅供参考，请不要直接复制
  description: '某些介绍', // 仅供参考，请不要直接复制
  themeConfig: {
    // 其他各种配置...
    sidebar: calculateSidebar([ // [!code ++]
      '笔记', // [!code ++]
      { folderName: '文章', separate: true }, // [!code ++]
    ]), // [!code ++]
  },
})
```

## 参数说明

### `calculateSidebar`

`calculateSidebar` 函数接受一个数组作为参数，数组中的每一项可以是一个字符串或者一个对象。不同的类型会有着不同的处理逻辑。让我们以下面的几种实际应用场景来说明。

首先需要指出的是，在配置参数中填写 `'笔记'` 和 `{ folderName: '笔记', separate: false }` 是完全等效的，所以，只书写字符串的配置，可以看作是 `{ folderName: '笔记', separate: false }` 的快捷简写。因此，如果不希望变换着类型写，可以都写成对象的形式。

另外，在几乎 100% 的情况下，我们都会按照与 Obsidian 和 [Nolebase](https://nolebase.ayaka.io) 的侧边栏结构和形式去生成侧边栏，所以在绝大多数情况下，只写字符串也不会有问题。

唯一的区别就是在于这个特殊的 `separate` 属性。当用户配置了 `separate: true` 之后，我们会生成 VitePress 所兼容和支持的多侧边栏，这使得「为不同的页面配置不同的侧边栏」变成可能。

说得更直白一些，如果你希望能够在 A 页面展示仅与 A 目录下相关的侧边栏，B 页面只展示 B 目录下的侧边栏，那么你就需要 `[{ folderName: 'A', separate: true }, { folderName: 'B', separate: true }]` 这样的配置。

另外需要注意的是，还有一些特殊的处理规则：

#### 首级忽略

如果参数中只填写了 `['笔记']` 这样的一个字符串的时候，会自动把 `笔记` 目录层级忽略掉，只保留 `笔记` 下的文件和目录。

#### 混合配置

如果既有 字符串配置 又有 `separate: true` 的配置，比如：

```typescript
calculateSidebar([
  '笔记',
  '短文',
  { folderName: '文章', separate: true },
])
```

那么，首级忽略 的规则将不再生效，取而代之的是，`'笔记'` 和 `'短文'` 会被作为目录的名称出现在访问路径为 `/` 下的页面，而 `文章` 会被作为一个独立的目录出现在访问路径为 `/文章/` 下的页面。

## 可选性配置

上述配置完成了自动生成侧边栏，考虑到您可能想要原生配置的[`collapse:false` 选项](https://vitepress.dev/zh/reference/default-theme-sidebar#collapsible-sidebar-groups)实现的**指定路径下首级文件夹自动展开**效果，可以继续尝试进行下述配置。

### 为 VitePress 配置

在 VitePress 的配置文件中（通常为 `docs/.vitepress/config.ts`，文件路径和拓展名也许会有区别）。

```ts [config.ts]
import { calculateSidebar } from '@nolebase/vitepress-plugin-sidebar' // [!code --]
import { calculateSidebar as originalCalculateSidebar } from "@nolebase/vitepress-plugin-sidebar" // [!code ++] 
//...
function calculateSidebarWithDefaultOpen(targets, base) { // [!code ++] 
  const result = originalCalculateSidebar(targets, base) // [!code ++] 
  if (Array.isArray(result)) { // [!code ++] 
    result.forEach(item => { // [!code ++] 
      item.collapsed = false  // [!code ++] 
    }) // [!code ++] 
  } else { // [!code ++] 
    Object.values(result).forEach(items => { // [!code ++] 
      items.forEach(item => { // [!code ++] 
        item.collapsed = false  // [!code ++] 
      }) // [!code ++] 
    }) // [!code ++] 
  } // [!code ++] 
  return result // [!code ++] 
} // [!code ++] 
//...
export default defineConfig({
  //...
})
```

### 修改sidebar配置

```ts [config.ts]
export default defineConfig({
  //...
  themeConfig: {
    //...
    sidebar: calculateSidebarWithDefaultOpen([ // [!code focus]
      { folderName: "A", separate: true },
      { folderName: "B", separate: true },
      //...
    ],''), //base参数根据自身具体配置 // [!code focus]
    //...
  }
}
```

::: details `base`是什么？

找到先前在`config.ts`文件中的引入`import { calculateSidebar as originalCalculateSidebar } from "@nolebase/vitepress-plugin-sidebar";`。

鼠标置于`calculateSidebar`上，左键单击进入`index.d.ts`文件，如下：

```ts{11-14} [index.d.ts]
interface ArticleTree {
    index: string;
    text: string;
    link?: string;
    lastUpdated?: number;
    collapsible?: boolean;
    collapsed?: boolean;
    items?: ArticleTree[];
    category?: string;
}
declare function calculateSidebar(targets?: Array<string | {
    folderName: string;
    separate: boolean;
}>, base?: string): ArticleTree[] | Record<string, ArticleTree[]>;

export { calculateSidebar };
```

观察到`calculateSidebar()`有两个参数`(target, base)`。

`targe`是在配置文件中传入的 字符串参数 或 对象参数。

`base`是你的vitepress项目配置的基路径，通常情况下为`' '`即可。
:::

注意到，侧边栏显示结果为**当前所配置的文件夹名路径下的内容**，并且路径下首级文件夹已经展开。

:::details 想要展开所有层级的文件夹至最末端文件？

可以尝试把 VitePress 的配置文件定义的函数修改如下：

```ts [config.ts]
function calculateSidebarWithDefaultOpen(targets, base) {
  const result = originalCalculateSidebar(targets, base)
  function setAllCollapsedFalse(items) {
    items.forEach(item => {
      item.collapsible = true
      item.collapsed = false
      if (item.items) {
        setAllCollapsedFalse(item.items)
      }
    })
  }
  if (Array.isArray(result)) {
    setAllCollapsedFalse(result)
  } else {
    Object.values(result).forEach(items => {
      setAllCollapsedFalse(items)
    })
  }
  return result
}
```
:::