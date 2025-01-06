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
上述配置完成了自动生成侧边栏，效果为显示所有第一层级文件夹。考虑到你可能想要原生配置的`collapse:false`即**自动展开**模式，不妨按照如下操作。
### 修改插件源代码
按照`node_modules/@nolebase/vitepress-plugin-sidebar/dist/index.d.ts`路径找到文件，修改代码如下。
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
### 为 VitePress 配置展开第一层级文件夹
在 VitePress 的配置文件中（通常为 `docs/.vitepress/config.ts`，文件路径和拓展名也许会有区别），将**高亮内容**添加到文件中。
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

:::details 想要展开所有层级的文件夹？
可以尝试把 VitePress 的配置文件定义的函数修改如下
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

### 修改sidebar配置
```ts
export default defineConfig({
  ...
  themeConfig: {
    ...
    sidebar: calculateSidebarWithDefaultOpen([ // [!code focus]
      { folderName: "folderName", separate: true },
      { folderName: "folderName", separate: true },
      ...
    ],''), //base参数根据自身具体配置 // [!code focus]
    ...
  }
}
```
刷新前端页面，可以看到所有第一层级目录已经展开。