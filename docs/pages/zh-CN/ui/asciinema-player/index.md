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

Add the package to Vite's `ssr.noExternal` configuration. Without this, your site may not build. (Ref: [Vite's `ssr.noExternal` config docs](https://vitejs.dev/guide/ssr.html#ssr-externals).)

```ts
// vite.config.ts
export default defineConfig({
  ssr: {
    noExternal: [
      "@nolebase/ui-asciinema",
    ],
  },
})
```

Then import `NuAsciinemaPlayer` and asciinema-player's stylesheet in your Vue file. (Ref: [asciinema-player's styling docs](https://docs.asciinema.org/manual/player/quick-start/#npm-package).)

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

### VitePress

Instead of configuring Vite's `ssr.noExternal` in a `vite.config.ts`, you can configure it in the VitePress `vite` config. (Ref: [VitePress's Vite configuration docs](https://vitepress.dev/reference/site-config#vite).)

```ts
// **/.vitepress/config.ts
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

If the component is only used by a few pages, it's recommended to explicitly import it and the asciinema-player stylesheet where they are used. This allows them to be properly code-split and only loaded when the relevant pages are shown:

- Markdown

    ```html
    <script setup>
    // somewhere.md
    import { NuAsciinemaPlayer } from '@nolebase/ui-asciinema'
    import 'asciinema-player/dist/bundle/asciinema-player.css'
    </script>

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
    ```

- Vue

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

If the component is going to be used on most of the pages, it and the asciinema-player stylesheet can be registered globally by customizing the VitePress Vue app instance.

```ts
// **/.vitepress/theme/index.ts
import { NuAsciinemaPlayer } from "@nolebase/ui-asciinema";
import "asciinema-player/dist/bundle/asciinema-player.css";

export default {
  enhanceApp({ app, router, siteData }) {
    app.component("NuAsciinemaPlayer", NuAsciinemaPlayer);
  }
}
```

- Markdown

    ```html
    <!-- somewhere.md -->

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
    ```

- Vue

    ```vue
    <!-- somewhere.vue -->

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

Ref: [VitePress Registering Global Components docs](https://vitepress.dev/guide/extending-default-theme#registering-global-components).

## Options

Refer to [asciinema.d.ts](https://github.com/nolebase/integrations/blob/main/packages/ui-asciinema/src/asciinema.d.ts).

## 致谢

- [NARKOZ/go-nyancat: Nyancat in your terminal](https://github.com/NARKOZ/go-nyancat)
- [klange/nyancat: Nyancat in your terminal, rendered through ANSI escape sequences. This is the source for the Debian package `nyancat`.](https://github.com/klange/nyancat)
- [休息一下，看看彩虹貓囉！ Take a break at the Linux command line with Nyan Cat - HackMD](https://hackmd.io/@brlin/SkJi-KlWV/https%3A%2F%2Fhackmd.io%2FG1PDyxHYRjyE8UYewYePvQ?type=book)
