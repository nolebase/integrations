---
title: Integrations
category: Index
sidebarCollapsed: false
---

<script setup>
import sidebarPackageJSON from '~/packages/vitepress-plugin-sidebar/package.json'
import biDirectionalLinksPackageJSON from '~/packages/markdown-it-bi-directional-links/package.json'
import breadcrumbsPackageJSON from '~/packages/vitepress-plugin-breadcrumbs/package.json'
import elementTransform from '~/packages/markdown-it-element-transform/package.json'
import unlazyImg from '~/packages/markdown-it-unlazy-img/package.json'
import enhancedReadabilities from '~/packages/vitepress-plugin-enhanced-readabilities/package.json'
import index from '~/packages/vitepress-plugin-index/package.json'
import inlineLinkPreview from '~/packages/vitepress-plugin-inline-link-preview/package.json'
import highlightTargetedHeading from '~/packages/vitepress-plugin-highlight-targeted-heading/package.json'
import gitChangelog from '~/packages/vitepress-plugin-git-changelog/package.json'
import enhancedMark from '~/packages/vitepress-plugin-enhanced-mark/package.json'
import thumbnailHash from '~/packages/vitepress-plugin-thumbnail-hash/package.json'
</script>

# Integrations

Welcome to the integrations section of the documentation!

Nólëbase Integrations project provides a variety of integrations, plugins, components and libraries to facilitate the use of our pre-packaged variety of features in [Obsidian](https://obsidian.md), [VitePress](https://vitepress.dev) and other projects compatible with [Markdown It](https://github.com/markdown-it/markdown-it), [Vite](https://vitejs.dev/) and [Vue](https://vuejs.org/).

## Integrations List

<IntegrationCard type="markdown-it" title="Bi-Directional Links" package="markdown-it-bi-directional-links">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${biDirectionalLinksPackageJSON.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="markdown-it" title="Elements Transformation" package="markdown-it-element-transform">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${elementTransform.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="markdown-it" title="Lazy loading blurred thumbnails" package="markdown-it-unlazy-img">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${unlazyImg.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="Auto Sidebar" package="vitepress-plugin-sidebar">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${sidebarPackageJSON.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="Breadcrumbs" package="vitepress-plugin-breadcrumbs">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${breadcrumbsPackageJSON.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="Enhanced Readabilities" package="vitepress-plugin-enhanced-readabilities">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${enhancedReadabilities.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="Index page" package="vitepress-plugin-index">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${index.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="Inline Link Previewing" package="vitepress-plugin-inline-link-preview">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${inlineLinkPreview.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="Blinking highlight targeted heading" package="vitepress-plugin-highlight-targeted-heading">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${highlightTargetedHeading.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="Git-based page histories" package="vitepress-plugin-git-changelog">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${gitChangelog.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="Page <meta> metadata generation" package="vitepress-plugin-og-image">
  <template v-slot:title>
    Page <code>&lt;meta&gt;</code> metadata generation
  </template>
  <template v-slot:badge>
    <Badge type="warning" text="Beta" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="Previewing image (social media card) generation" package="vitepress-plugin-og-image">
  <template v-slot:badge>
    <Badge type="warning" text="Beta" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="Page properties" package="vitepress-plugin-page-properties">
  <template v-slot:badge>
    <Badge type="danger" text="Alpha" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="Enhanced <mark> elements" package="vitepress-plugin-enhanced-mark">
  <template v-slot:title>
    Enhanced <code>&lt;mark&gt;</code> elements
  </template>
  <template v-slot:badge>
    <Badge type="tip" :text="`v${enhancedMark.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="vitepress" title="Thumbnail hashing for images" package="vitepress-plugin-thumbnail-hash">
  <template v-slot:badge>
    <Badge type="tip" :text="`v${thumbnailHash.version}`" />
  </template>
</IntegrationCard>

<br />

<IntegrationCard type="obsidian" title="UnoCSS" package="obsidian-plugin-unocss">
  <template v-slot:badge>
    <Badge type="warning" text="Beta" />
  </template>
</IntegrationCard>

<br />
