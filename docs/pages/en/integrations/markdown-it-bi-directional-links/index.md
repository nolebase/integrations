---
title: Bi-directional Links
category: Bi-directional Links
---

<script setup>
import packageJSON from '~/packages/markdown-it-bi-directional-links/package.json'
</script>

# Bi-directional Links <Badge type="tip" :text="`v${packageJSON.version}`" />

**Bi-directional links** (also known as internal links), and another concept you may know and hear about [WikiLinks](https://en.wikipedia.org/wiki/Help:Link), holds a important place in the document engineering area. It is usually used to quickly establish a connection (or link) from one page to another page, and widely used in Wiki pages such as [Wikipedia](https://wikipedia.org), and now days popular tools such as [Obsidian](https://obsidian.md/) and [Logseq](https://logseq.com/).

This plugin is a fully featured compatible implementation version of [Obsidian](https://obsidian.md)'s [internal links](https://help.obsidian.md/Linking+notes+and+files/Internal+links), it follows two rules:

1. A page's file name (without extension) can be used as a link target, for example: `[[Bi-directional Links Example Page]]` will be parsed as a link to the globally unique `Bi-directional Links Example Page.md` file.
2. A link target can be an absolute path, for example: `[[Some Folder/Bi-directional Links Example Page]]` will be parsed as a link to `Some Folder/Bi-directional Links Example Page.md`, usually appears when you have multiple files with the same name.

## Features

<div grid="~ cols-[auto_1fr] gap-1" items-start my-1>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Basic syntax</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Able to handle hash tags <code>#</code></span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Able to handle query strings <code>?</code></span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Images</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Images size</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Custom text</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Custom HTML attributes</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Same name pages</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Absolute path</span>
</div>

## How it looks like

Basic: [[Bi-directional Links Example Page]]

Custom text: [[Bi-directional Links Example Page|Custom Text]]

Compatible to modify the HTML attributes [[Bi-directional Links Example Page|Custom Attrs]]{style="color: red;"}

Obsidian same name pages: [[pages/en/integrations/markdown-it-bi-directional-links/same-name/Bi-directional Links Example Same Name Page|Bi-directional Links Example Same Name Page]] 和 [[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Same Name Page|Bi-directional Links Example Same Name Page]]

Absolute Path: [[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page]]

Images are supported:

![[foxtail field.jpg]]

Audio is not a concern either:

![[Applause.mp3]]

Video is even less of a problem:

![[Big rabbit came out of the hutch.mp4]]

## Installation

It is easy and straightforward to install the Bi-directional links plugin into your VitePress project, please follow the steps under [Getting started](./getting-started) page!

## Syntax and markups

You can discover more syntaxes and features in the [Syntax](./syntax).
