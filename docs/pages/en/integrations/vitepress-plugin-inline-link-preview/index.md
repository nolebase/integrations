<script setup>
import { PopupIframe } from '@nolebase/vitepress-plugin-inline-link-preview/client'
</script>

# Inline Links Previewing <Badge type="tip" text="v1.28.0" />

This VitePress plugin is an implementation that similar to Obsidian's link previewing functionalities.

## Features

<div grid="~ cols-[auto_1fr] gap-1" items-center my-1>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Better with <a href="/pages/zh-CN/integrations/markdown-it-bi-directional-links/">Bi-directional Links</a></span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Preview any links</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Options to hide elements</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Smart popup positioning</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Automatically detect external links</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Natively compatible with VitePress design</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Follow the i18n guidelines of Nolebase Integrations</span>
  <span i-icon-park-outline:check-one text="green-600" />
  <span>Best practices of a11y</span>
</div>

## Take a look in live!

::: info Try it out

Any scrolling, clicking, and browsing abilities are supported when interacting with and trying out the preview popups below, and do not interfere with the external page.

<div relative h-full min-h="[440px] <sm:[480px]" w-full max-w="[640px] <sm:100%">
  How it looks when previewing <a href="/pages/en/integrations/">Integrations</a>  page
  <div
      flex="~ col"
      absolute z-1 m-0 overflow-hidden rounded-lg p-0
      top="[30px] <sm:[60px]" left-0
      w-full max-w="[100vw]"
      h="[400px]" max-h="[440px]"
      shadow="2xl" border="1 solid $vp-c-divider"
    >
      <PopupIframe href="/pages/en/integrations/" />
    </div>
</div>

Notice how **full interactive functionalities** it is when previewing! 🤗

:::

::: info Want to trigger the popup by yourself?

No problem! Try to hover your cursor over this link, you will see a popup that shows the preview content of the link:

[[Bi-directional Links Example Page]] 👈 Try hovering this.

:::

## Installation

It is easy and straightforward to install the Inline Links Previewing plugin into your VitePress project, please follow the steps under [Getting started](./getting-started) page!

## Configuration

Inline Links Previewing plugin comes with many options to customize, including sizes of popup window, delay when hovering, and even the display text! To learn more, please read [Configuration](./configuration) page.
