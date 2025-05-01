---
title: 双向链接
category: 双向链接
sidebarTitle: 双向链接
---

<script setup>
import packageJSON from '~/packages/markdown-it-bi-directional-links/package.json'
</script>

# 双向链接 <Badge type="tip" :text="`v${packageJSON.version}`" />

**双向链接** （也被称之为内部链接，英文 Bi-directional links 和 Internal links），和也许你也了解和听说过另一个有关的概念 [WikiLinks](https://en.wikipedia.org/wiki/Help:Link)，在文档工程中有着非常重要的地位，它通常用于快速的建立一个页面到另一个页面的连接（或者链接），在 [Wikipedia](https://wikipedia.org) 这样的 Wiki 框架中，以及现在所流行的 [Obsidian](https://obsidian.md/) 和 [Logseq](https://logseq.com/) 中都被广泛使用。

这个插件是 [Obsidian](https://obsidian.md) 的[内部链接](https://help.obsidian.md/Linking+notes+and+files/Internal+links)的全功能兼容实现版本，它遵循两条规则：

1. 一个页面的文件名称（不包含扩展名）可以作为一个链接的目标，例如：`[[双向链接示例页面]]` 将会被解析为一个指向全局唯一的 `双向链接示例页面.md` 文件的链接。
2. 一个链接的目标可以是一个绝对路径，例如：`[[某个文件夹/双向链接示例页面]]` 将会被解析为一个指向 `某个文件夹/双向链接示例页面.md` 的链接，通常出现在你有多个同名文件的时候。

## 功能支持

<div grid="~ cols-[auto_1fr] gap-1" items-start my-1>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>基本语法</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>支持处理 hash tags <code>#</code></span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>支持处理 query strings <code>?</code></span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>图片双链</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>图片尺寸</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>自定义文案</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>自定义 HTML 属性</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>同名文件语法</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>绝对路径语法</span>
</div>

## 渲染效果

基本形式：[[双向链接示例页面]]

自定义文案：[[双向链接示例页面|自定义文案]]

兼容自定义属性：[[双向链接示例页面|自定义属性]]{style="color: red;"}

Obsidian 同名页面：[[pages/zh-CN/integrations/markdown-it-bi-directional-links/same-name/双向链接示例同名页面|双向链接示例同名页面]] 和 [[pages/zh-CN/integrations/markdown-it-bi-directional-links/双向链接示例同名页面|双向链接示例同名页面]]

绝对路径：[[pages/zh-CN/integrations/markdown-it-bi-directional-links/双向链接示例页面]]

图片也支持的：

![[一片 狗尾草.jpg]]

音频也不在话下：

![[鼓掌声.mp3]]

视频更是没有问题：

![[大兔子从兔窝中钻出.mp4]]

## 安装

安装是非常简单容易的，请移步至[快速上手](./getting-started)阅读试试看吧！

## 语法和标记

你可以在 [语法](./syntax) 页面中发现更多的语法和特性。
