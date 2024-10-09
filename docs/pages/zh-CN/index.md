---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: Nólëbase 集成
  text: 多元化的文档工程工具合集
  tagline: 为基于本地优先的知识库和静态生成器的文档工程提供更好的体验
  image:
    src: /logo-day.png
  actions:
    - theme: brand
      text: 开始使用
      link: /pages/zh-CN/guide/getting-started
    - theme: alt
      text: 加入 Discord 服务器
      link: https://discord.gg/XuNFDcDZGj
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/nolebase/integrations

features:
  - icon: <span class="rive-canvas" data-rive-canvas="true" data-rive-src="/icons/star-emoji-animated.riv"></span>
    title: 简单易用
    details: 简单易用，让作者少些操心，更何况写作本就耗时耗力，这些问题不应该成为限制您创造力的障碍。
  - icon: <span class="rive-canvas" data-rive-canvas="true" data-rive-src="/icons/easter-island-statue-emoji-animated.riv"></span>
    title: 跨平台
    details: 不论是静态如 VitePress，Rspress，还是客户端优先如 Obsidian 和 Logseq，我们期望能够在不同的平台上为您提供近似甚至更好的体验。
  - icon: <span class="rive-canvas" data-rive-canvas="true" data-rive-src="/icons/crystall-ball-emoji-animated.riv"></span>
    title: 丰富的功能
    details: 通过「Nólëbase 集成」所提供的大量的功能、小部件、组件，填补笔记平台和工具之间的差距并优化整体体验。
  - icon: <span class="rive-canvas" data-rive-canvas="true" data-rive-src="/icons/rocket-emoji-animated.riv"></span>
    title: 写作优先
    details: 从文档工程的角度出发，解决和简化若干 UX/DX 的问题和困境，旨在让创作者更好地专注于撰写文档、笔记、制作卡片以及 GTD。
---

<script setup>
import biDirectionalLinksPackageJSON from '~/packages/markdown-it-bi-directional-links/package.json'
import elementTransform from '~/packages/markdown-it-element-transform/package.json'
import unlazyImg from '~/packages/markdown-it-unlazy-img/package.json'
import enhancedReadabilities from '~/packages/vitepress-plugin-enhanced-readabilities/package.json'
import inlineLinkPreview from '~/packages/vitepress-plugin-inline-link-preview/package.json'
import highlightTargetedHeading from '~/packages/vitepress-plugin-highlight-targeted-heading/package.json'
import gitChangelog from '~/packages/vitepress-plugin-git-changelog/package.json'
import enhancedMark from '~/packages/vitepress-plugin-enhanced-mark/package.json'
import thumbnailHash from '~/packages/vitepress-plugin-thumbnail-hash/package.json'
</script>

<HomeContent>

## 集成列表

Nólëbase 集成项目提供多种不同的集成、插件、组件和库来方便在 [Obsidian](https://obsidian.md)，[VitePress](https://vitepress.dev) 和其他兼容 [Markdown It](https://github.com/markdown-it/markdown-it)、[Vite](https://vitejs.dev/) 和 [Vue](https://vuejs.org/) 的项目中使用我们预先封装好的各种花样繁多的功能。

<div class="grid gap-5 lg:grid-cols-2 max-w-172 lg:max-w-none mx-auto">
  <IntegrationCard type="markdown-it" title="双向链接" package="markdown-it-bi-directional-links">
    <template v-slot:badge>
      <Badge type="tip" :text="`v${biDirectionalLinksPackageJSON.version}`" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="markdown-it" title="元素转换" package="markdown-it-element-transform">
    <template v-slot:badge>
      <Badge type="tip" :text="`v${elementTransform.version}`" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="markdown-it" title="懒加载模糊缩略图" package="markdown-it-unlazy-img">
    <template v-slot:badge>
      <Badge type="tip" :text="`v${unlazyImg.version}`" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="vitepress" title="阅读增强" package="vitepress-plugin-enhanced-readabilities">
    <template v-slot:badge>
      <Badge type="tip" :text="`v${enhancedReadabilities.version}`" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="vitepress" title="行内链接预览" package="vitepress-plugin-inline-link-preview">
    <template v-slot:badge>
      <Badge type="tip" :text="`v${inlineLinkPreview.version}`" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="vitepress" title="闪烁高亮当前的目标标题" package="vitepress-plugin-highlight-targeted-heading">
    <template v-slot:badge>
      <Badge type="tip" :text="`v${highlightTargetedHeading.version}`" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="vitepress" title="基于 Git 的页面历史" package="vitepress-plugin-git-changelog">
    <template v-slot:badge>
      <Badge type="tip" :text="`v${gitChangelog.version}`" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="vitepress" title="<meta> 页面元信息生成" package="vitepress-plugin-meta">
    <template v-slot:title>
      <code>&lt;meta&gt;</code> 页面元信息生成
    </template>
    <template v-slot:badge>
      <Badge type="warning" text="Beta 测试" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="vitepress" title="预览图片（社交媒体卡片）生成" package="vitepress-plugin-og-image">
    <template v-slot:badge>
      <Badge type="warning" text="Beta 测试" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="vitepress" title="页面属性" package="vitepress-plugin-page-properties">
    <template v-slot:badge>
      <Badge type="danger" text="Alpha 测试" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="vitepress" title="<mark> 元素增强" package="vitepress-plugin-enhanced-mark">
    <template v-slot:title>
      <code>&lt;mark&gt;</code> 元素增强
    </template>
    <template v-slot:badge>
      <Badge type="tip" :text="`v${enhancedMark.version}`" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="vitepress" title="缩略图模糊哈希生成" package="vitepress-plugin-thumbnail-hash">
    <template v-slot:badge>
      <Badge type="tip" :text="`v${thumbnailHash.version}`" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="obsidian" title="UnoCSS" package="obsidian-plugin-unocss">
    <template v-slot:badge>
      <Badge type="warning" text="Beta 测试" />
    </template>
  </IntegrationCard>
</div>

</HomeContent>
