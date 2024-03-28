<script setup>
import { NuButton } from '@nolebase/ui'
</script>

# UI Components <Badge type="danger" text="Alpha" />

::: danger 🛑 This package is in Alpha stage.
This package is still in the Alpha stage, and it is not recommended to use it in production. The API may change in the future, and there may be bugs in the current version. Please use it with caution.
:::

::: warning 🚧 Constructing
Nice to meet you! But sorry, this page is still under construction. If you don’t find the information you are interested in, you can first find the content you are interested in in the navigation in the sidebar to start reading.
:::

## How to use

::: tip 🙋 Before install

Currently `@nolebase/ui` is still under development, and will be used by other [Nolebase Integrations](https://nolebase-integrations.ayaka.io) components now (such as [`vitepress-plugin-git-changelog`](/pages/en/integrations/vitepress-plugin-git-changelog/)). And those components and integrations of [Nolebase Integrations](https://nolebase-integrations.ayaka.io) will configure the needed options and settings to bundle and transform the underlying dependencies.

Therefore, if you would ever want to install `@nolebase/ui` as one of your dependencies, you would need to configure a few configurations before proceeding:

#### 1. Additional configurations for Vite

##### 1.1 For users who imported `<NuLazyTeleportRiveCanvas />` component

Since `<NuLazyTeleportRiveCanvas />` depends on `@rive-app/canvas`. If you also use Vite as your bundler, you will need to add the following configurations to your `vite.config.ts` file like this:

```typescript
export default defineConfig(() => {
  return {
    optimizeDeps: { // [!code ++]
      include: [ // [!code ++]
        // Add this line to your vite.config.ts's optimizeDeps.include array // [!code ++]
        '@nolebase/ui  @rive-app/canvas', // [!code ++]
      ], // [!code ++]
    }, // [!code ++]
  }
})
```

For more information about why configure this, please refer to the [Dep Optimization Options | Vite](https://vitejs.dev/config/dep-optimization-options.html#optimizedeps-exclude) documentation.

##### 1.2 For users who imported VitePress related components

If you are using VitePress, and imported components relies on VitePress, you will need to add the following configurations to your `vite.config.ts` file like this:

```typescript
export default defineConfig(() => {
  return {
    ssr: { // [!code ++]
      noExternal: [ // [!code ++]
        // Add this line to your vite.config.ts's ssr.noExternal array // [!code ++]
        '@nolebase/ui', // [!code ++]
      ], // [!code ++]
    }, // [!code ++]
  }
})
```

For more information about why configure this, please refer to the [Server-Side Rendering | Vite](https://vitejs.dev/guide/ssr.html#ssr-externals) documentation.

:::

### Installation

You can install `@nolebase/ui` as one of your Vue or VitePress project dependencies with the following command:

::: code-group

```shell [pnpm]
pnpm add @nolebase/ui -D
```

```shell [npm]
npm install @nolebase/ui -D
```

```shell [yarn]
yarn add @nolebase/ui -D
```

:::

## Buttons

<div>
  <NuButton>
    ABCD
  </NuButton>
</div>
