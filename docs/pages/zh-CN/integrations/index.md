---
title: 集成
category: 索引
sidebarCollapsed: false
---

<script setup>
import sidebarPackageJSON from '~/packages/vitepress-plugin-sidebar/package.json'
import biDirectionalLinksPackageJSON from '~/packages/markdown-it-bi-directional-links/package.json'
import elementTransform from '~/packages/markdown-it-element-transform/package.json'
import unlazyImg from '~/packages/markdown-it-unlazy-img/package.json'
import enhancedReadabilities from '~/packages/vitepress-plugin-enhanced-readabilities/package.json'
import index from '~/packages/vitepress-plugin-inline-link-preview/package.json'
import inlineLinkPreview from '~/packages/vitepress-plugin-inline-link-preview/package.json'
import highlightTargetedHeading from '~/packages/vitepress-plugin-highlight-targeted-heading/package.json'
import gitChangelog from '~/packages/vitepress-plugin-git-changelog/package.json'
import enhancedMark from '~/packages/vitepress-plugin-enhanced-mark/package.json'
import thumbnailHash from '~/packages/vitepress-plugin-thumbnail-hash/package.json'
</script>

# 集成

欢迎来到集成页面！

Nólëbase 集成项目提供多种不同的集成、插件、组件和库来方便在 [Obsidian](https://obsidian.md)，[VitePress](https://vitepress.dev) 和其他兼容 [Markdown It](https://github.com/markdown-it/markdown-it)、[Vite](https://vitejs.dev/) 和 [Vue](https://vuejs.org/) 的项目中使用我们预先封装好的各种花样繁多的功能。

## 集成列表

<IntegrationCard type="markdown-it" title="双向链接" package="markdown-it-bi-directional-links">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${biDirectionalLinksPackageJSON.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="markdown-it" title="元素转换" package="markdown-it-element-transform">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${elementTransform.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="markdown-it" title="懒加载模糊缩略图" package="markdown-it-unlazy-img">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${unlazyImg.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="自动生成侧边栏" package="vitepress-plugin-sidebar">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${sidebarPackageJSON.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="阅读增强" package="vitepress-plugin-enhanced-readabilities">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${enhancedReadabilities.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="索引页" package="vitepress-plugin-index">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${index.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="行内链接预览" package="vitepress-plugin-inline-link-preview">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${inlineLinkPreview.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="闪烁高亮当前的目标标题" package="vitepress-plugin-highlight-targeted-heading">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${highlightTargetedHeading.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="基于 Git 的页面历史" package="vitepress-plugin-git-changelog">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${gitChangelog.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="页面 <meta> 元信息生成" package="vitepress-plugin-meta">
  <template v-slot:title>
    页面 <code>&lt;meta&gt;</code> 元信息生成
  </template>
  <template v-slot:badge>
    <Badge type="warning" text="Beta 测试" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="预览图片（社交媒体卡片）生成" package="vitepress-plugin-og-image">
  <template v-slot:badge>
    <Badge type="warning" text="Beta 测试" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="页面属性" package="vitepress-plugin-page-properties">
  <template v-slot:badge>
    <Badge type="danger" text="Alpha 测试" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="<mark> 元素增强" package="vitepress-plugin-enhanced-mark">
  <template v-slot:title>
    <code>&lt;mark&gt;</code> 元素增强
  </template>
  <template v-slot:badge>
    <Badge type="tip" :text="`v${enhancedMark.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="缩略图模糊哈希生成" package="vitepress-plugin-thumbnail-hash">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${thumbnailHash.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="obsidian" title="UnoCSS" package="obsidian-plugin-unocss">
  <template v-slot:badge>
    <Badge type="warning" text="Beta 测试" />
  </template>
</IntegrationCard>

<br />
