---
title: Asciinema 播放器
category: UI
---

<script setup>
import { NuAsciinemaPlayer } from '@nolebase/ui-asciinema'
</script>

# Asciinema 播放器

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

## 安装

运行以下命令，将 `@nolebase/ui-asciinema` 安装到项目依赖项中：

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

## 用法

```js
// vite.config.ts
export default defineConfig({
  ssr: {
    noExternal: [
      // If there are other packages that need to be processed by Vite, you can add them here.
      '@nolebase/ui-asciinema',
    ],
  },
})
```

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

## 致谢

- [NARKOZ/go-nyancat: Nyancat in your terminal](https://github.com/NARKOZ/go-nyancat)
- [klange/nyancat: Nyancat in your terminal, rendered through ANSI escape sequences. This is the source for the Debian package `nyancat`.](https://github.com/klange/nyancat)
- [休息一下，看看彩虹貓囉！ Take a break at the Linux command line with Nyan Cat - HackMD](https://hackmd.io/@brlin/SkJi-KlWV/https%3A%2F%2Fhackmd.io%2FG1PDyxHYRjyE8UYewYePvQ?type=book)
