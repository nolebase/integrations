---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: Nólëbase Integrations
  text: A collection of diverse documentation engineering tools
  tagline: "For a better experience of documentation engineering based on local-first knowledge base and static site generator"
  actions:
    - theme: brand
      text: Get Started
      link: /pages/en/guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/nolebase/integrations

features:
  - icon: 🚀
    title: Documentation Engineering First
    details: From the perspective of documentation engineering, solve and simplify some UX/DX problems, aiming to let creators focus on writing documents, notes, making cards and GTD!
  - icon: ⚖️
    title: Compatible and Easy to Use
    details: Whether it is static-first like VitePress, or client-first like Obsidian, the "Nólëbase Integrations" project hopes to provide a similar or even better experience across different platforms.
  - icon: 🧩
    title: Rich Features
    details: Each platform has its own advantages and missing functions, but the documentation engineering is already time-consuming and labor-intensive. These issues should not be obstacles to restrict the writing and sharing of documents and knowledge. Expand your imagination far beyond with Nólëbase Integrations.
---

<HomeContent>

## Integrations List

Nólëbase Integrations project provides a variety of integrations, plugins, components and libraries to facilitate the use of our pre-packaged variety of features in [Obsidian](https://obsidian.md), [VitePress](https://vitepress.dev) and other projects compatible with [Markdown It](https://github.com/markdown-it/markdown-it), [Vite](https://vitejs.dev/) and [Vue](https://vuejs.org/).

<div class="grid gap-5 lg:grid-cols-2 max-w-172 lg:max-w-none mx-auto">

  <IntegrationCard type="markdown-it" title="Bi-Directional Links" package="markdown-it-bi-directional-links" />

  <IntegrationCard type="markdown-it" title="Elements Transformation" package="markdown-it-element-transform" />

  <IntegrationCard type="vitepress" title="Enhanced Readabilities" package="vitepress-plugin-enhanced-readabilities" />

  <IntegrationCard type="vitepress" title="Inline Link Previewing" package="vitepress-plugin-inline-link-preview" />

  <IntegrationCard type="vitepress" title="Blinking highlight targeted heading" package="vitepress-plugin-highlight-targeted-heading" />

  <IntegrationCard type="vitepress" title="Changelog & File history" package="vitepress-plugin-git-changelog" />

  <IntegrationCard type="obsidian" title="UnoCSS" package="obsidian-plugin-unocss" />

</div>

</HomeContent>

