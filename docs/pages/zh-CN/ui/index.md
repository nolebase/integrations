<script setup>
import { NuButton } from '@nolebase/ui'
</script>

# UI 组件 <Badge type="danger" text="Alpha 测试" />

::: danger 🛑 此包仍处于 Alpha 测试阶段
此包仍处于 Alpha 测试阶段，不建议在生产中使用。未来 API 可能会发生变化，当前版本可能存在错误。请谨慎使用。
:::

::: warning 🚧 施工中
很高兴见到你！但很抱歉，这个页面还在施工中，如果没有找到你感兴趣的信息，你可以先在侧边栏的导航中寻找你感兴趣的内容来开始阅读
:::

## 如何开始

::: tip 🙋 安装前须知

目前 `@nolebase/ui` 仍在开发中，将被其他 [Nolebase Integrations](https://nolebase-integrations.ayaka.io) 组件使用（例如 [`vitepress-plugin-git-changelog`](/pages/en/integrations/vitepress-plugin-git-changelog/)），而这些 [Nolebase Integrations](https://nolebase-integrations.ayaka.io) 组件都会自动帮忙配置好依赖解析和依赖打包等复杂操作。如果你想把 `@nolebase/ui` 作为你的依赖项之一来安装并使用，就需要仿照其他 [Nolebase Integrations](https://nolebase-integrations.ayaka.io) 组件，对 Vite 进行配置：

#### 1. 针对 Vite 的额外配置

##### 1.1 对于导入了 `<NuLazyTeleportRiveCanvas />` 组件的用户

由于 `<NuLazyTeleportRiveCanvas />` 底层依赖于 `@rive-app/canvas`，如果您也使用 Vite 作为打包器和开发环境服务器，则需要像这样在 `vite.config.ts` 文件中添加以下配置：

```typescript
export default defineConfig(() => {
  return {
    optimizeDeps: { // [!code ++]
      include: [ // [!code ++]
        // 添加这一行到你的 vite.config.ts 的 optimizeDeps.include 数组中 // [!code ++]
        '@nolebase/ui  @rive-app/canvas', // [!code ++]
      ], // [!code ++]
    }, // [!code ++]
  }
})
```

有关为何要这样配置的更多信息，请参阅 [Dep Optimization Options | Vite](https://vitejs.dev/config/dep-optimization-options.html#optimizedeps-exclude) 文档。

##### 1.2 针对导入 VitePress 相关组件的用户

如果您使用的是 VitePress，且导入的组件依赖于 VitePress，则需要像这样在 `vite.config.ts` 文件中添加以下配置：

```typescript
export default defineConfig(() => {
  return {
    ssr: { // [!code ++]
      noExternal: [ // [!code ++]
        // 添加这一行到你的 vite.config.ts 的 ssr.noExternal 数组中 // [!code ++]
        '@nolebase/ui', // [!code ++]
      ], // [!code ++]
    }, // [!code ++]
  }
})
```

有关为何如此配置的更多信息，请参阅 [Server-Side Rendering | Vite](https://vitejs.dev/guide/ssr.html#ssr-externals) 文档。

:::

### 安装

您可以使用以下命令将 `@nolebase/ui` 安装为 Vue 或 VitePress 项目的依赖项之一：

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

## 按钮

<div>
  <NuButton>
    ABCD
  </NuButton>
</div>
