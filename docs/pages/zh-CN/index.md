---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: Nólëbase 集成
  text: 多元化的文档工程工具合集
  tagline: 为基于本地优先的知识库和静态生成器的文档工程提供更好的体验
  actions:
    - theme: brand
      text: 开始使用
      link: /pages/zh-CN/guide/getting-started
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/nolebase/integrations

features:
  - icon: 🚀
    title: 文档工程优先
    details: 从文档工程的角度出发，解决和简化若干 UX/DX 的问题和困境，旨在让创作者更好地专注于撰写文档、笔记、制作卡片以及 GTD。
  - icon: ⚖️
    title: 兼容并且好用
    details: 不论是静态如 VitePress，还是客户端优先如 Obsidian，「Nólëbase 集成」项目期望能够在不同的平台上提供近似甚至更好的体验。
  - icon: 🧩
    title: 拓展工具的边界
    details: 每个平台都有自己的优势和缺失的功能，但文档工程本来就耗时耗力。这些问题不应成为限制文档和知识编写与共享的障碍。使用「Nólëbase 集成」来扩展您的想象力吧。
---

<HomeContent>

## 集成列表

Nólëbase 集成项目提供多种不同的集成、插件、组件和库来方便在 [Obsidian](https://obsidian.md)，[VitePress](https://vitepress.dev) 和其他兼容 [Markdown It](https://github.com/markdown-it/markdown-it)、[Vite](https://vitejs.dev/) 和 [Vue](https://vuejs.org/) 的项目中使用我们预先封装好的各种花样繁多的功能。

<div class="grid gap-5 lg:grid-cols-2 max-w-172 lg:max-w-none mx-auto">

  <IntegrationCard type="markdown-it" title="双向链接" package="markdown-it-bi-directional-links" />

  <IntegrationCard type="markdown-it" title="元素转换" package="markdown-it-element-transform" />

  <IntegrationCard type="vitepress" title="阅读增强" package="vitepress-plugin-enhanced-readabilities" />

  <IntegrationCard type="vitepress" title="行内链接预览" package="vitepress-plugin-inline-link-preview" />

  <IntegrationCard type="vitepress" title="闪烁高亮当前的目标标题" package="vitepress-plugin-highlight-targeted-heading" />

  <IntegrationCard type="vitepress" title="变更日志 及 文件历史" package="vitepress-plugin-git-changelog" />

  <IntegrationCard type="obsidian" title="UnoCSS" package="obsidian-plugin-unocss" />

</div>

</HomeContent>
