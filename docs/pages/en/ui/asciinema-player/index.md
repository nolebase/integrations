---
title: Asciinema Player
category: UI
---

<script setup>
import { NuAsciinemaPlayer } from '@nolebase/ui-asciinema'
</script>

# Asciinema Player

<NuAsciinemaPlayer
  src="/asciinema/test-nyancat.cast"
  :preload="true"
  :cols="400"
  :rows="40"
  :auto-play="true"
  :controls="true"
  :terminal-font-size="'12px'"
  :loop="true"
/>

## Installation

Install `@nolebase/ui-asciinema` to your project dependencies by running the following command:

::: code-group

```shell [@antfu/ni]
ni @nolebase/ui-asciinema
```

```shell [pnpm]
pnpm add @nolebase/ui-asciinema
```

```shell [npm]
npm install @nolebase/ui-asciinema
```

```shell [yarn]
yarn add @nolebase/ui-asciinema
```

:::

## Usage

Add the package to Vite's `ssr.noExternal` configuration. Without this, your site may not build.

```ts
// vite.config.ts
export default defineConfig({
  vite: {
    ssr: {
      noExternal: [
        "@nolebase/ui-asciinema",
      ],
    },
  },
})
```

Refs:

- [VitePress's Vite configuration docs](https://vitepress.dev/reference/site-config#vite)
- [Vite's `ssr.noExternal` config docs](https://vitejs.dev/guide/ssr.html#ssr-externals)

```vue
<script setup>
// somewhere.vue
import { NuAsciinemaPlayer } from '@nolebase/ui-asciinema'
import 'asciinema-player/dist/bundle/asciinema-player.css'
</script>

<template>
  <NuAsciinemaPlayer
    src="/asciinema/test-nyancat.cast"
    :preload="true"
    :cols="400"
    :rows="40"
    :auto-play="true"
    :controls="true"
    :terminal-font-size="'12px'"
    :loop="true"
  />
</template>
```

## Acknowledgements

- [NARKOZ/go-nyancat: Nyancat in your terminal](https://github.com/NARKOZ/go-nyancat)
- [klange/nyancat: Nyancat in your terminal, rendered through ANSI escape sequences. This is the source for the Debian package `nyancat`.](https://github.com/klange/nyancat)
- [休息一下，看看彩虹貓囉！ Take a break at the Linux command line with Nyan Cat - HackMD](https://hackmd.io/@brlin/SkJi-KlWV/https%3A%2F%2Fhackmd.io%2FG1PDyxHYRjyE8UYewYePvQ?type=book)
