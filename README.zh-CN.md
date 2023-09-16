<p align="center">
  <img width="350" src="https://user-images.githubusercontent.com/19204772/193437443-b5e04990-9957-4339-a83c-72b33307dbff.png">
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-green.svg" /></a>
  <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img src="https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg" /></a>
</p>

# [Nólëbase](https://github.com/nolebase/nolebase) 集成

[English](./README.md)

---

多元化的文档工程工具合集

> [Nólëbase](https://github.com/nolebase/nolebase) 是以 Nólëbase 为名，读作 nole-base，取自意为「知识」的昆雅语 nólë 和意为「基础」的英文 base，即「知识库」的开源知识库。

## 特点

- 🚀 文档工程优先
  - 从文档工程的角度出发，解决和简化若干 UX/DX 的问题和困境，旨在让创作者更好地专注于撰写文档、笔记、制作卡片以及 GTD。
- ⚖️ 兼容并且好用
  - 不论是静态如 VitePress，Astro，还是客户端优先如 Obsidian 和 Logseq，「Nólëbase 集成」项目期望能够在不同的平台上提供近似甚至更好的体验。
- 🧩 拓展工具的边界
  - 每个平台都有他们的优势和缺失的功能，但是文档工程已经足够费时费力，这些问题不应该是撰写和分享文档和知识的阻碍，别被工具限制了你的想象力。

## 如何开发

项目使用 [`unbuild`](https://github.com/unjs/unbuild) 进行构建，借助于 [`jiti`](https://github.com/unjs/jiti) 的强大功能，我们无需再使用 [Rollup](https://rollupjs.org/) 去进行繁琐的配置后监听本地的文件变更来进行开发，我们可以直接运行下面的命令来输出我们的集成：

```shell
pnpm run packages:stub
```

如果你使用 [`@antfu/ni`](https://github.com/antfu/ni)，也可以使用下面的命令：

```shell
nr packages:stub
```

接下来你需要启动项目的 VitePress 文档来进行预览和开发，你可以使用下面的命令：

```shell
pnpm run docs:dev
```

如果你使用 [`@antfu/ni`](https://github.com/antfu/ni)，也可以使用下面的命令：

```shell
nr docs:dev
```

### 用 ♥ 撰写
