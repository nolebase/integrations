<p align="center">
  <img width="350" src="https://user-images.githubusercontent.com/19204772/193437443-b5e04990-9957-4339-a83c-72b33307dbff.png">
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-green.svg" /></a>
  <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img src="https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg" /></a>
</p>

# [Nólëbase](https://github.com/nolebase/nolebase) 插件

[English](./README.md)

---

> [Nólëbase](https://github.com/nolebase/nolebase) 是以 Nólëbase 为名，读作 nole-base，取自意为「知识」的昆雅语 nólë 和意为「基础」的英文 base，即「知识库」的开源知识库。

## 特点

- 完善的文档
  - 搭配用法和示例文档，以及详尽的说明，专注于用户体验和开发体验，让你的事情更快地完成。
- 多平台兼容
  - 不论是 VitePress，Astro，还是 Obsidian 和 Logseq，我们希望我们的文档工程能在多个平台上得到相似的体验。
- 丰富的功能
  - 每个平台都有他们的优势和缺失的功能，我们希望能够拓宽他们的功能，让他们更加强大，更加易用。

## 如何开发

项目使用 [`unbuild`](https://github.com/unjs/unbuild) 进行构建，借助于 [`jiti`](https://github.com/unjs/jiti) 的强大功能，我们无需再使用 [Rollup](https://rollupjs.org/) 去进行繁琐的配置后监听本地的文件变更来进行开发，我们可以直接运行下面的命令来输出我们的插件：

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
