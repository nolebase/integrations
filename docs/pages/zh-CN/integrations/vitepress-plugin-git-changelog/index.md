---
title: 基于 Git 的页面历史
category: 基于 Git 的页面历史
sidebarTitle: 基于 Git 的页面历史
---

<script setup>
import packageJSON from '~/packages/vitepress-plugin-git-changelog/package.json'
</script>

# 基于 Git 的页面历史 <Badge type="tip" :text="`v${packageJSON.version}`" />

## 为什么

就如同 [VueUse 文档](https://vueuse.org/core/useStorage/#contributors) 一样，能够在 VitePress 站点中添加一个基于 Git 的页面历史记录功能应该是一个很棒的功能吧？

> 文档工程是一个持续改进的过程。

大多数先进的操作系统、内容管理系统和知识库（例如，Wikipedia、Notion、Confluence、Outline）都会跟踪文件和页面的最后编辑时间戳。
记录文档内容的变更与修改是至关重要的：它通过界面的方式让用户得以了解最近的更新，识别贡献者，并了解页面的演变，因此，包含一个变更日志和贡献者列表对于透明度和认可是至关重要的。

这就是 `@nolebase/vitepress-plugin-git-changelog` 插件的作用。它是一个工具，可以生成变更日志和贡献者列表，并将它们无缝地集成到您的 VitePress 站点中。

它利用了开发人员、技术撰写人员和文档工程师的必备工具之一 Git 作为基础，以生成与之相关的「页面历史」。

无需为云上数据库，服务器设置和支付额外费用。**Git 日志就是您所需要的一切。**

想要看看这个功能是如何运作的吗？请尝试点击 [贡献者](#contributors) 和 [文件历史](#file-history) 吧！🚀

## 功能

<div grid="~ cols-[auto_1fr] gap-1" items-start my-1>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Git 日志就是您所需要的一切。无需额外的服务费用、在线数据库或额外配置。</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>在构建时生成页面历史和贡献者章节</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>即时快速可靠</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>支持配置作者名称别名、电子邮件别名、昵称映射等自定义选项</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>原生与 VitePress 样式兼容</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>遵循 Nolebase Integrations 国际化规范标准</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>无障碍最佳实践</span>
</div>

## 实际应用案例？

当然有！

- [Nólëbase](https://nolebase.ayaka.io/%E7%AC%94%E8%AE%B0/#%E8%B4%A1%E7%8C%AE%E8%80%85)（中文）
- [CrashMC 文档](https://crashmc.com/analyzer#contributors)（中文）
- [Zotero 中文文档](https://zotero-chinese.com/user-guide/#%E8%B4%A1%E7%8C%AE%E8%80%85)（中文）
- [Vue Macros 文档](https://vue-macros.dev/zh-CN/guide/getting-started.html)（中文）
- [ALT Gnome Wiki](https://alt-gnome.wiki/download.html#%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%8F-%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B8) （俄语）
- [Shalo.DOCS](https://docs.shalotts.site/docs/01_introduction/#changelog)（俄语）

## 安装

将此插件安装到您的 VitePress 项目中并不是一件那么简单和直接的事情。幸运的是，我们写了很好的文档！请按照 [入门指南](./getting-started) 页面的步骤进行操作。

## 配置

基于 Git 的页面历史插件带有许多选项可供自定义，包括贡献者信息和显示文案！要了解更多，请阅读 [配置](./configure-ui) 页面。
