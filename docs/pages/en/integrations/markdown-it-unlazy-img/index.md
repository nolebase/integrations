<script setup>
import packageJSON from '~/packages/markdown-it-unlazy-img/package.json'
</script>

# Lazy loading blurred thumbnails <Badge type="warning" :text="`Beta v${packageJSON.version}`" />

::: warning 🚧 Constructing
Nice to meet you! But sorry, this page is still under construction. If you don’t find the information you are interested in, you can first find the content you are interested in in the navigation in the sidebar to start reading.
:::

A [`markdown-it`](https://github.com/markdown-it/markdown-it) plugin wraps and transforms image tags to support [unlazy](https://github.com/johannschopplich/unlazy) lazy loading with [blurhash](https://github.com/woltapp/blurhash), [thumbhash](https://github.com/evanw/thumbhash) encoding, and more.

## Installation

Install `@nolebase/markdown-it-unlazy-img` to your project dependencies by running the following command:

::: code-group

```shell [@antfu/ni]
ni @nolebase/markdown-it-unlazy-img -D
```

```shell [pnpm]
pnpm add @nolebase/markdown-it-unlazy-img -D
```

```shell [npm]
npm install @nolebase/markdown-it-unlazy-img -D
```

```shell [yarn]
yarn add @nolebase/markdown-it-unlazy-img -D
```

:::
