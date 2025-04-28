---
title: 缩略图模糊哈希生成
category: 缩略图模糊哈希生成
sidebarTitle: 缩略图模糊哈希生成
---

<script setup>
import packageJSON from '~/packages/vitepress-plugin-thumbnail-hash/package.json'
</script>

# 缩略图模糊哈希生成 <Badge type="tip" :text="`v${packageJSON.version}`" />

为什么要使用缩略图？在渲染大型文档的页面时，如果没有缩略图、blurhash 或 thumbhash 辅佐优化图像的话，浏览器将尝试加载原始图像，加载可能会导致巨大的性能问题，加载后甚至导致页面布局抖动、闪烁和重绘，从而最终导致不佳的用户体验。

我们通过将 Thumbhash 算法集成到 VitePress 站点中解决了这个问题：

::: info 试试看与下面的 Thumbhash 预览组件互动，看看它是如何工作的！

可以替换成你的图片，或尝试编辑生成后的 Thumbhash base64。

:::

<ThumbhashPreview
  thumbhash-text="选择图片以生成 Thumbhash"
  apply-thumbhash-text="应用生成的 Thumbhash"
  click-to-upload-text="点击上传图片"
  copy-to-clipboard-text="复制到剪贴板"
  clear-input-thumbhash-text="清空已输入的 Thumbhash"
  input-thumbhash-placeholder="输入 base64 编码的 Thumbhash..."
  preview-thumbhash-text="输入 Thumbhash 以预览"
  demo-image-url="/thumbhash-test-image.jpg"
/>

生成的 Thumbhash base64 将如下所示：

```plaintext
HikOLYh4eXepiHecd/d3eoaAdwh4
```

如果你有与 VitePress 连接的数据库或 CMS，可以将 Thumbhash base64 存储到数据库中，并在你的 VitePress 站点中使用它进行图像渲染。
它小到几乎没有存储压力，快到可以在你的 VitePress 站点中快速渲染。

## 功能

<div grid="~ cols-[auto_1fr] gap-1" items-start my-1>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>由 unlazy 提供底层技术实现</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>支持 JPEG、PNG、WebP 的 Thumbhash 生成</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>图像加载时平滑的动画过渡</span>
</div>

## 安装

安装是非常简单容易的，请移步至[快速上手](./getting-started)阅读试试看吧！
