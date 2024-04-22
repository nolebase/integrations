<script setup>
import { NuAsciinemaPlayer } from '@nolebase/ui'
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

Install `@nolebase/ui` and `asciinema-player` to your project dependencies by running the following command:

::: code-group

```shell [@antfu/ni]
ni @nolebase/ui asciinema-player
```

```shell [pnpm]
pnpm add @nolebase/ui asciinema-player
```

```shell [npm]
npm install @nolebase/ui asciinema-player
```

```shell [yarn]
yarn add @nolebase/ui asciinema-player
```

:::

## Usage

```vue
<script setup>
import { NuAsciinemaPlayer } from '@nolebase/ui'
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
