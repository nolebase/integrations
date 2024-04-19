---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: Nólëbase Integrations
  text: A collection of diverse documentation engineering tools
  tagline: "For a better experience of documentation engineering based on local-first knowledge base and static site generator"
  image:
    src: /logo-day.png
  actions:
    - theme: brand
      text: Get Started
      link: /pages/en/guide/getting-started
    - theme: alt
      text: Join Discord server
      link: https://discord.gg/XuNFDcDZGj
    - theme: alt
      text: View on GitHub
      link: https://github.com/nolebase/integrations

features:
  - icon: <span class="rive-canvas" data-rive-canvas="true" data-rive-src="/icons/star-emoji-animated.riv"></span>
    title: Easy to use
    details: Easy and less caring about toolings. Writing is already time-consuming and labor-intensive. These issues should not be obstacles to restrict your creativity.
  - icon: <span class="rive-canvas" data-rive-canvas="true" data-rive-src="/icons/easter-island-statue-emoji-animated.riv"></span>
    title: Cross-platform
    details: Whether it is static-first like VitePress and Rspress, or client-first like Obsidian and Logseq, we hope to deliver the similar or even better experience across different platforms.
  - icon: <span class="rive-canvas" data-rive-canvas="true" data-rive-src="/icons/crystall-ball-emoji-animated.riv"></span>
    title: Rich Features
    details: Expand your imagination far beyond with Nólëbase Integrations with loads of features, widgets, components to fill the gap between note-taking platforms while improving.
  - icon: <span class="rive-canvas" data-rive-canvas="true" data-rive-src="/icons/rocket-emoji-animated.riv"></span>
    title: Writing First
    details: From the perspective of documentation engineering, solve and simplify some UX/DX problems, aiming to let creators focus on writing documents, notes, making cards and GTD!
---

<HomeContent>

## Integrations List

Nólëbase Integrations project provides a variety of integrations, plugins, components and libraries to facilitate the use of our pre-packaged variety of features in [Obsidian](https://obsidian.md), [VitePress](https://vitepress.dev) and other projects compatible with [Markdown It](https://github.com/markdown-it/markdown-it), [Vite](https://vitejs.dev/) and [Vue](https://vuejs.org/).

<div class="grid gap-5 lg:grid-cols-2 max-w-172 lg:max-w-none mx-auto">
  <IntegrationCard type="markdown-it" title="Bi-Directional Links" package="markdown-it-bi-directional-links">
    <template v-slot:badge>
      <Badge type="tip" text="v2.0.0-rc8" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="markdown-it" title="Elements Transformation" package="markdown-it-element-transform">
    <template v-slot:badge>
      <Badge type="tip" text="v2.0.0-rc8" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="markdown-it" title="Lazy loading blurred thumbnails" package="markdown-it-unlazy-img">
    <template v-slot:badge>
      <Badge type="warning" text="Beta" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="vitepress" title="Enhanced Readabilities" package="vitepress-plugin-enhanced-readabilities">
    <template v-slot:badge>
      <Badge type="tip" text="v2.0.0-rc8" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="vitepress" title="Inline Link Previewing" package="vitepress-plugin-inline-link-preview">
    <template v-slot:badge>
      <Badge type="tip" text="v2.0.0-rc8" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="vitepress" title="Blinking highlight targeted heading" package="vitepress-plugin-highlight-targeted-heading">
    <template v-slot:badge>
      <Badge type="tip" text="v2.0.0-rc8" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="vitepress" title="Git-based page histories" package="vitepress-plugin-git-changelog">
    <template v-slot:badge>
      <Badge type="tip" text="v2.0.0-rc8" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="vitepress" title="Previewing image (social media card) generation" package="vitepress-plugin-og-image">
    <template v-slot:badge>
      <Badge type="warning" text="Beta" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="vitepress" title="Page properties" package="vitepress-plugin-page-properties">
    <template v-slot:badge>
      <Badge type="danger" text="Alpha" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="vitepress" title="Enhanced <mark> elements" package="vitepress-plugin-enhanced-mark">
    <template v-slot:title>
      Enhanced <code>&lt;mark&gt;</code> elements
    </template>
    <template v-slot:badge>
      <Badge type="tip" text="v2.0.0-rc8" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="vitepress" title="Thumbnail hashing for images" package="vitepress-plugin-thumbnail-hash">
    <template v-slot:badge>
      <Badge type="warning" text="Beta" />
    </template>
  </IntegrationCard>

  <IntegrationCard type="obsidian" title="UnoCSS" package="obsidian-plugin-unocss">
    <template v-slot:badge>
      <Badge type="warning" text="Beta" />
    </template>
  </IntegrationCard>
</div>

</HomeContent>

