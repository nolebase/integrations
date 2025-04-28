---
title: Git-based page histories
category: Git-based page histories
sidebarTitle: Git-based page histories
---

<script setup>
import packageJSON from '~/packages/vitepress-plugin-git-changelog/package.json'
</script>

# Git-based page histories <Badge type="tip" :text="`v${packageJSON.version}`" />

## Why

Just like what [VueUse documentations site](https://vueuse.org/core/useStorage/#contributors) has, wouldn't a Git-based page histories be a great feature for your VitePress site?

> Documentations engineering is a process of continuous improvement.

Most advanced content management systems, like those used by operating systems and knowledge bases (e.g., Wikipedia, Notion, Confluence, Outline), track the timestamp of the last edit on files and pages. Documenting the evolution of your content is crucial—it informs users of the most recent updates and identifies the contributors responsible for those changes. Including a changelog and a list of contributors is essential for transparency and acknowledgment.

Enter the `@nolebase/vitepress-plugin-git-changelog` plugin. It's a tool that generates changelogs and contributor lists, seamlessly integrating them into your VitePress site.

It harnesses the robust capabilities of git—a staple for developers, technical writers, and documentation specialists—to maintain a comprehensive log of revisions.

No need to setup and pay for additional databases, preparing operating systems, or subscribe to online services. **Git logs are all you need.**

Curious to see this feature in use? Try click [Contributors](#contributors) and [File History](#file-history)! 🚀

## Features

<div grid="~ cols-[auto_1fr] gap-1" items-start my-1>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Git logs are all you need. No service fees, online databases, or additional setup required.</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Build-time generation of changelog and contributors sections</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Instantly fast and reliable</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Customizable to configure author name alias, email alias, display name mapping, etc.</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Natively compatible with VitePress design</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Follow the i18n guidelines of Nolebase Integrations</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Best practices of a11y</span>
</div>

## Live use cases?

Yes for sure!

- [Nólëbase](https://nolebase.ayaka.io/%E7%AC%94%E8%AE%B0/#%E8%B4%A1%E7%8C%AE%E8%80%85) (in Chinese)
- [CrashMC Documentation](https://crashmc.com/analyzer#contributors) (in Chinese)
- [Zotero Chinese Wiki](https://zotero-chinese.com/user-guide/#%E8%B4%A1%E7%8C%AE%E8%80%85) (in Chinese)
- [Vue Macros Documentation](https://vue-macros.dev/guide/getting-started.html#contributors) (in English)
- [ALT Gnome Wiki](https://alt-gnome.wiki/download.html#%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%8F-%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B8) (in Russian)
- [Shalo.DOCS](https://docs.shalotts.site/docs/01_introduction/#changelog) (in Russian)

## Installation

It is not that much easy and straightforward to install this plugin into your VitePress project. Luckily, we wrote good documentations! Please follow the steps under [Getting started](./getting-started) page.

## Configuration

Git-based page histories plugin comes with many options to customize, including contributors info, and display texts! To learn more, please read [Configuration](./configure-ui) page.
