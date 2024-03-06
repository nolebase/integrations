<p align="center">
  <img width="350" src="https://user-images.githubusercontent.com/19204772/193437443-b5e04990-9957-4339-a83c-72b33307dbff.png">
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-green.svg" /></a>
</p>

# [Nólëbase](https://github.com/nolebase/nolebase) 集成

[English](./README.md)

---

多元化的文档工程工具合集

> [Nólëbase](https://github.com/nolebase/nolebase) 是以 Nólëbase 为名，读作 nole-base，取自意为「知识」的昆雅语 nólë 和意为「基础」的英文 base，即「知识库」的开源知识库。

## 特点

- 🌟 简单易用
  - 简单易用，让作者少些操心，更何况写作本就耗时耗力，这些问题不应该成为限制您创造力的障碍。
- 🗿 跨平台
  - 不论是静态如 VitePress，Rspress，还是客户端优先如 Obsidian 和 Logseq，我们期望能够在不同的平台上为您提供近似甚至更好的体验。
- 🔮 丰富的功能
  - 通过「Nólëbase 集成」所提供的大量的功能、小部件、组件，填补笔记平台和工具之间的差距并优化整体体验。
- 🚀 写作优先
  - 从文档工程的角度出发，解决和简化若干 UX/DX 的问题和困境，旨在让创作者更好地专注于撰写文档、笔记、制作卡片以及 GTD。

## 快速开始

- [文档](https://nolebase-integrations.ayaka.io/): 在 README 中展示集成在 `markdown-it` 和 VitePress 中的效果和使用方法并不容易，为什么不试试使用我们使用 VitePress 生成的文档站点呢？
- [packages](./packages) 目录: 所有的集成都被保存在 `packages` 目录下，每个集成都是一个独立的包。你可以在每个包目录下找到对应的 README 来获取更多的细节。

如果你只是想使用集成，你可以使用下面的命令将你需要的集成安装到你的 VitePress 项目中：

```shell
pnpm i @nolebase/<integration-name> -D
```

如果你也使用 [`@antfu/ni`](https://github.com/antfu/ni)，也可以使用下面的命令来安装：

```shell
ni @nolebase/<integration-name> -D
```

要找到集成的名称，下面是一个我们当前支持的集成列表：

- [UnoCSS (Obsidian 插件)](https://github.com/nolebase/obsidian-plugin-unocss)
- [双向链接（`markdown-it` 插件）](./packages/markdown-it-bi-directional-links/README.md)
- [元素转换（`markdown-it` 插件）](./packages/markdown-it-element-transform/README.md)
- [阅读增强（VitePress 插件）](./packages/vitepress-plugin-enhanced-readabilities/README.md)
- [变更记录 及 文件历史（VitePress 插件）](./packages/vitepress-plugin-git-changelog/README.md)
- [行内链接预览（VitePress 插件）](./packages/vitepress-plugin-inline-link-preview/README.md)
- [闪烁高亮当前的目标标题（VitePress 插件）](./packages/vitepress-plugin-highlight-targeted-heading/README.md)
- [页面属性（VitePress 插件](./packages/vitepress-plugin-page-properties/README.md)

## 如何开发

- 对于一般情况下的纯 TypeScript / JavaScript 库而言：我们使用 [`unbuild`](https://github.com/unjs/unbuild) 和 [Vite](https://github.com/vitejs/vite) 来进行开发和构建。这意味着，在借助于 [`unbuild`](https://github.com/unjs/unbuild) 底层所使用的 [`jiti`](https://github.com/unjs/jiti) 的强大功能的加持下，无需配置 [Rollup](https://rollupjs.org/)，也无需使用 [Vite](https://github.com/vitejs/vite)，就能够监听本地文件的变化，并打包修改和开发的模块。
- 对于需要加载非 [Rollup](https://rollupjs.org/) 和 [Vite](https://github.com/vitejs/vite) 兼容的插件的库而言（比如 Vue UI 库）：我们依然会使用 [Vite](https://github.com/vitejs/vite) 来进行开发和构建，所以依然会涉及到本地文件的监听和打包。

我们可以直接运行下面的命令来监听和构建在 `packages` 目录下的所有项目打包后的文件：

```shell
pnpm run packages:stub
```

如果你也使用 [`@antfu/ni`](https://github.com/antfu/ni)，也可以使用下面的命令来实现相同的效果：

```shell
nr packages:stub
```

接下来你需要启动项目的 VitePress 文档来进行预览和开发，你可以使用下面的命令：

```shell
pnpm run docs:dev
```

如果你也使用 [`@antfu/ni`](https://github.com/antfu/ni)，也可以使用下面的命令来实现相同的效果：

```shell
nr docs:dev
```

## 如何构建

```shell
pnpm run packages:build
```

如果你也使用 [`@antfu/ni`](https://github.com/antfu/ni)，也可以使用下面的命令来实现相同的效果：

```shell
nr packages:build
```

如果要构建文档和预览站点，你可以使用下面的命令：

```shell
pnpm run docs:build
```

如果你也使用 [`@antfu/ni`](https://github.com/antfu/ni)，也可以使用下面的命令来实现相同的效果：

```shell
nr docs:build
```

### 用 ♥ 撰写
