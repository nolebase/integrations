---
title: 自 v1 迁移至 v2
category: 迁移
---

# 自 `v1` 迁移至 `v2`

将版本更新为 `v2` 的主要目标是：

1. 更新 VitePress 至 `1.0.0`.
2. 确保所有集成，插件和模块和模块都遵循相同的代码结构、命名规则和导入/导出模式。

因此

1. 所有更新的集成，插件和模块将不再与 VitePress RC 版本兼容。
2. 所有更新的集成，插件和模块都将遵循以下规定：
   - 如果是 Vue 组件、Vue 插件、客户端代码、样式等，导出的入口文件为 `{packageName}/client`。
   - 如果是 i18n 模块，则导出入口文件为 `{packageName}/locales`。
   - 如果是 VitePress 专用插件（如构建钩子、"buildEnd"、"transformHTML "等），则导出入口文件为 `{packageName}/vitepress`。
   - 如果是 markdown-it 插件，则导出入口文件为 `{packageName}/markdown-it` 。
   - 如果是 Vite 插件，则导出入口文件为 `{packageName}/vite`。
3. 所有更新的集成，插件和模块都将遵循 Nolebase 集成，插件和模块的 i18n 指南。
4. 所有更新的集成，插件和模块都将尝试复用 `@nolebase/ui` 集成，插件和模块中的 Vue 组件。

由于将会引入破坏性改动，但是有迁移指南，迁移工作量较小。

## 行内链接预览

在 `@nolebase/vitepress-plugin-inline-link-preview` 插件中有一些破坏性更改。

1. 不再需要使用 `@nolebase/markdown-it-element-transform` 包进行标签转换，新的 `@nolebase/vitepress-plugin-inline-link-preview/markdown-it` 插件将导出所需的专用 markdown-it 插件。
2. 按照新结构，新的 `@nolebase/vitepress-plugin-inline-link-preview/client` 将导出用于行内链接预览的 Vue 组件，而不是直接从包根目录导入。

### 移除 `@nolebase/markdown-it-element-transform`

```json
{
  "devDependencies": {
    "@nolebase/markdown-it-element-transform": "^1.28.0" // [!code --]
  }
}
```

你可以执行以下步骤删除 `@nolebase/markdown-it-element-transform` 包：

::: code-group

```shell [@antfu/ni]
nun @nolebase/markdown-it-element-transform
```

```shell [pnpm]
pnpm uninstall @nolebase/markdown-it-element-transform
```

```shell [yarn]
yarn remove @nolebase/markdown-it-element-transform
```

```shell [npm]
npm uninstall @nolebase/markdown-it-element-transform
```

:::

### 更新 VitePress 配置，以使用从 `@nolebase/vitepress-plugin-inline-link-preview/markdown-it` 导出的新 markdown-it 插件

你现在可以使用

```ts
import { defineConfig } from 'vitepress'
import { InlineLinkPreviewElementTransform } from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it' // [!code ++]

export default defineConfig({
  // ...
  markdown: {
    // ...
    config: (md) => {
      md.use(InlineLinkPreviewElementTransform) // [!code ++]
    },
  },
})
```

替代以前使用的 `@nolebase/markdown-it-element-transform`。

完整变更

::: code-group

```ts [.vitepress/config.ts]
import { defineConfig } from 'vitepress'
import { ElementTransform } from '@nolebase/markdown-it-element-transform'
import type { Options as ElementTransformOptions } from '@nolebase/markdown-it-element-transform' // [!code --]
import { InlineLinkPreviewElementTransform } from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it' // [!code ++]

export default defineConfig({
  // ...
  markdown: {
    // ...
    config: (md) => {
      md.use(ElementTransform, (() => {// [!code --]
        let transformNextLinkCloseToken = false// [!code --]
        // [!code --]
        return { // [!code --]
          transform(token) { // [!code --]
            switch (token.type) { // [!code --]
              case 'link_open': // [!code --]
                if (token.attrGet('class') !== 'header-anchor') { // [!code --]
                  token.tag = 'VPNolebaseInlineLinkPreview'// [!code --]
                  transformNextLinkCloseToken = true // [!code --]
                }
                // [!code --]
                break // [!code --]
              case 'link_close': // [!code --]
                if (transformNextLinkCloseToken) { // [!code --]
                  token.tag = 'VPNolebaseInlineLinkPreview' // [!code --]
                  transformNextLinkCloseToken = false // [!code --]
                } // [!code --]
                // [!code --]
                break // [!code --]
            } // [!code --]
          }, // [!code --]
        } as ElementTransformOptions // [!code --]
      })()) // [!code --]

      md.use(InlineLinkPreviewElementTransform) // [!code ++]
    },
  },
})
```

:::

### 更新 VitePress 主题配置，以使用从 `@nolebase/vitepress-plugin-inline-link-preview/client` 导出的新 Vue 组件

由于现在所有 Vue 组件都是从 `client` 入口文件导出的，因此现在可以使用

```ts
import {
  NolebaseInlineLinkPreviewPlugin,
} from '@nolebase/vitepress-plugin-inline-link-preview' // [!code --]
} from '@nolebase/vitepress-plugin-inline-link-preview/client' // [!code ++]
```

来替换以前的 `@nolebase/vitepress-plugin-inline-link-preview`。

样式也是一样的需要更新修改为从 `client` 导入：

```ts
import '@nolebase/vitepress-plugin-inline-link-preview/dist/style.css' // [!code --]
import '@nolebase/vitepress-plugin-inline-link-preview/client/style.css' // [!code ++]
```

## 阅读增强

在 `@nolebase/vitepress-plugin-enhanced-readabilities` 插件中有一些破坏性更改。

1. 按照新的结构，新的 `@nolebase/vitepress-plugin-enhanced-readabilities/client` 将导出阅读增强的 Vue 组件，而不是直接从包根目录导入。

### 更新 VitePress 主题配置，以使用从 `@nolebase/vitepress-plugin-enhanced-readabilities/client` 导出的新 Vue 组件

由于现在所有 Vue 组件都是从 `client` 入口文件导出的，因此现在可以使用

```ts
import {
  InjectionKey as NolebaseEnhancedReadabilitiesInjectionKey,
  LayoutMode as NolebaseEnhancedReadabilitiesLayoutMode,
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities'  // [!code --]
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'  // [!code ++]
```

来替换以前的 `@nolebase/vitepress-plugin-enhanced-readabilities`。

样式也是一样的需要更新修改为从 `client` 导入：

```ts
import '@nolebase/vitepress-plugin-enhanced-readabilities/dist/style.css'  // [!code --]
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'  // [!code ++]
```

## 闪烁高亮当前的目标标题

在 `@nolebase/vitepress-plugin-highlight-targeted-heading` 插件中有一些破坏性更改。

1. 按照新的结构，新的 `@nolebase/vitepress-plugin-highlight-targeted-heading/client` 将导出用于高亮目标标题的 Vue 组件，而不是直接从包根目录导入。

### 更新 VitePress 主题配置，以使用从 `@nolebase/vitepress-plugin-highlight-targeted-heading/client` 导出的新 Vue 组件

由于现在所有 Vue 组件都是从 `client` 入口文件导出的，因此现在可以使用

```ts
import {
  NolebaseHighlightTargetedHeading,
} from '@nolebase/vitepress-plugin-highlight-targeted-heading' // [!code --]
} from '@nolebase/vitepress-plugin-highlight-targeted-heading/client' // [!code ++]
```

来替换以前的 `@nolebase/vitepress-plugin-highlight-targeted-heading`。

样式也是一样的需要更新修改为从 `client` 导入：

```ts
import '@nolebase/vitepress-plugin-highlight-targeted-heading/dist/style.css' // [!code --]
import '@nolebase/vitepress-plugin-highlight-targeted-heading/client/style.css' // [!code ++]
```

## 基于 Git 的页面历史

### UI 配置

1. `mapContributors` 现在已经被废弃，请使用对书写作者更为中立的 `mapAuthors`；
2. `nameAliases` 现在已经被废弃，请使用更清晰，并与其他插件保持一致的 `mapByNameAliases`；
3. `emailAliases` 现在已经被废弃，请使用更清晰，并与其他插件保持一致的 `mapByEmailAliases`；
4. 添加了新的 `username` 字段映射，以便更好地支持 GitHub 头像；
5. 原先的 Vite 插件 `GitChangelogMarkdownSection` 中的 `locales` 已经不再需要配置了，迁移到了 UI 配置的 `locales` 下的
	1. `changelog.title`
	2. `contributors.title`；
6. 为了能更好的结构化组织 i18n 的各字段，原先的
	1. `noLogs` i18n 配置变更为了 `changelog.noData`
	2. `noContributors` i18n 配置变更为了 `contributors.noData`
	3. `lastEdited` i18n 配置变更为了 `lastEdited`
	4. `lastEditedDateFnsLocaleName` 配置变更为了 `changelog.lastEditedDateFnsLocaleName`
	5. `viewFullHistory` i18n 配置变更为了 `changelog.viewFullHistory`
	6. `committedOn` i18n 配置变更为了 `changelog.committedOn`

### `Vite` 配置

1. 不再需要为 `GitChangelogMarkdownSection` 配置 `locales` 字段了，全部的国际化 i18n 配置都已经迁移到了 UI 配置中。
2. `includeDirs` 和 `includeExtensions` 已被弃用并合并到 `include` 中，配置时，可以使用带有 `!` 作为否定的 glob 匹配模式。
3. 如果最终会被渲染的文件所对应的页面文件位于 VitePress 根目录（即 `.vitepress`所在目录）之外，**请将 `cwd`（当前工作目录）配置为页面文件的父目录**。(例如，在 Monorepo 中，如果需要读取 `docs/` 以外的文件，则需要将 `cwd` 设置为 Monorepo 的根目录，而不是 VitePress 的根目录）。
4. 不再需要配置 `rewritePaths`，因此 `rewritePaths` 已被弃用，可以安全删除。
5. `rewritePathsBy` 模式应配置为针对文件系统路径，而不是 URL 路由路径。

## 预览图片（社交媒体卡片）生成

在 `@nolebase/vitepress-plugin-og-image` 插件中有一些破坏性更改。

1. 按照新的结构，新的 `@nolebase/vitepress-plugin-og-image/vitepress` 将导出 VitePress 专用插件，而不是从包根目录直接导入。

### 更新 VitePress 配置，以使用从 `@nolebase/vitepress-plugin-og-image/vitepress` 导出的新 VitePress 专用插件

你现在可以使用

```ts
import { buildEndGenerateOpenGraphImages } from '@nolebase/vitepress-plugin-og-image' // [!code --]
import { buildEndGenerateOpenGraphImages } from '@nolebase/vitepress-plugin-og-image/vitepress' // [!code ++]
```

来替换以前使用的 `@nolebase/vitepress-plugin-og-image`。

## 结论

1. 按照新结构重写所有导入路径。
2. 删除不再需要的旧包。

就是这样！除去这些以外，从 `v1` 迁移到 `v2` 应当不再有其他破坏性更改。

> 我们改进了代码结构、命名规则、导入/导出模式，使 Nolebase 生态系统中的包更加一致。

祝您写作愉快！🎉

我们在 `v3` 迁移指南中见！👋
