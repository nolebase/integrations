---
title: 行内链接预览
category: 行内链接预览
sidebarTitle: 行内链接预览
---

<script setup>
import packageJSON from '~/packages/vitepress-plugin-inline-link-preview/package.json'
import { PopupIframe } from '@nolebase/vitepress-plugin-inline-link-preview/client'
</script>

# 行内链接预览 <Badge type="tip" :text="`v${packageJSON.version}`" />

这个 VitePress 插件实现了类似 Obsidian 的链接预览功能。

## 功能支持

<div grid="~ cols-[auto_1fr] gap-1" items-start my-1>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>与<a href="/pages/zh-CN/integrations/markdown-it-bi-directional-links/">双向链接</a>一起搭配更佳</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>预览任何页面</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>隐藏页面内元素</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>智能判断浮床位置</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>自动判断外链</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>原生与 VitePress 样式兼容</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>遵循 Nolebase Integrations 国际化规范标准</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>无障碍最佳实践</span>
</div>

## 一览效果

::: info 试一试

在与下面的预览弹出窗口进行交互和尝试时，任何的滚动、点击和浏览能力都是支持的，而且不会干扰到外部的页面。

<div relative h-full min-h="[440px] <sm:[480px]" w-full max-w="[640px] <sm:100%">
  <a href="/pages/zh-CN/integrations/">集成</a>
  <div
    flex="~ col"
    absolute z-1 m-0 overflow-hidden rounded-lg p-0
    top="[30px] <sm:[60px]" left-0
    w-full max-w="[100vw]"
    h="[400px]" max-h="[440px]"
    shadow="2xl" border="1 solid $vp-c-divider"
  >
    <PopupIframe href="/pages/zh-CN/integrations/" />
  </div>
</div>

注意哦，**在预览时也支持完整的交互能力**！🤗

:::

::: info 想要自己触发看看？

没问题！尝试把鼠标/光标悬停在这个链接上，你会看到一个弹窗，展示了链接的预览内容：

[[双向链接示例页面]] 👈 试试看悬浮

:::

## 安装

安装到 VitePress 是非常简单容易的，请移步至[快速上手](./getting-started)阅读试试看吧！

## 配置

行内链接预览插件提供很多配置选项，允许你自定义包括浮床大小，弹窗延迟，甚至是显示文案！有关如何配置以及具体的配置信息，请移步至[配置](./configuration)。
