---
title: 基于 Git 的页面历史
category: 基于 Git 的页面历史
sidebarTitle: 快速上手
---

# 快速上手

## 安装

通过运行以下命令将 `@nolebase/vitepress-plugin-git-changelog` 安装到您的项目依赖项中：

::: code-group

```shell [@antfu/ni]
ni @nolebase/vitepress-plugin-git-changelog -D
```

```shell [pnpm]
pnpm add @nolebase/vitepress-plugin-git-changelog -D
```

```shell [npm]
npm install @nolebase/vitepress-plugin-git-changelog -D
```

```shell [yarn]
yarn add @nolebase/vitepress-plugin-git-changelog -D
```

:::

## 使用

::: warning 这是配置最复杂的插件之一！

请注意以下配置和步骤，以开始使用基于 Git 的页面历史插件。与其他插件相比，这并不是那么简单。

:::

将基于 Git 的页面历史插件集成到您的 VitePress 项目中包括两个主要步骤：

- [配置 Vite 插件](#配置-vite-插件)（数据获取、日志聚合）
- [与 VitePress 集成](#与-vitepress-主题集成)（UI 和组件）

### 配置 Vite 插件

有两种将基于 Git 的页面历史 Vite 插件集成到您的 VitePress 项目中的方法：

1. [**推荐**：在 VitePress 的主要配置文件中使用 `vite` 选项（通常位于 `docs/.vitepress/config.ts`，文件路径和扩展名可能会有所不同）](#在-vitepress-的配置文件中配置-vite-插件)
2. [在 VitePress 项目的根目录中创建一个单独的 Vite 配置文件（例如 `vite.config.ts`）](#在单独的-vite-配置文件中配置-vite-插件)

#### 在 VitePress 的配置文件中配置 Vite 插件

请在你的 VitePress [**核心配置文件**](https://vitepress.dev/reference/site-config#config-resolution) 中（注意不是**主题配置文件**，通常为 `docs/.vitepress/config.ts`，文件路径和拓展名也许会有区别）的根字段中添加 [Vite](https://vitejs.dev) 选项，并导入并配置 `GitChangelog`（数据获取）和 `GitChangelogMarkdownSection`（小部件嵌入）插件：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

```typescript twoslash
import { defineConfig } from 'vitepress'
import { // [!code ++]
  GitChangelog, // [!code ++]
  GitChangelogMarkdownSection, // [!code ++]
} from '@nolebase/vitepress-plugin-git-changelog/vite' // [!code ++]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: { // [!code ++]
    plugins: [ // [!code ++]
      GitChangelog({ // [!code ++]
        // 填写在此处填写您的仓库链接
        repoURL: () => 'https://github.com/nolebase/integrations', // [!code ++]
      }), // [!code ++]
      GitChangelogMarkdownSection(), // [!code ++]
    ],
  }, // [!code ++]
  lang: 'zh-CN',
  title: '站点名称',
  themeConfig: {
    // rest of the options...
  }
  // rest of the options...
})
```

#### 在单独的 Vite 配置文件中配置 Vite 插件

##### 确保已创建 `vite.config.ts`

如果您已经了解 `vite.config.ts` 是什么并且已经创建了它，您可以跳过此准备步骤，直接跳转到下一步[在 `vite.config.ts` 中配置插件](#在-viteconfigts-中配置插件)。

::: tip 首次接触 `vite.config.ts`？

首先，`vite.config.ts` 是一个为 [Vite](https://vitejs.org) 构建工具的配置文件。VitePress 是基于 Vite 构建的，它允许开发人员构建和转换项目中的资产、内容和数据。

尽管 VitePress 本身包含了整套 Vite 选项的配置在其[**主要配置文件**](https://vitepress.dev/reference/site-config#config-resolution)中（这不是一个**主题配置文件**，通常位于 `docs/.vitepress/config.ts`，文件路径和扩展名可能会有所不同），这些选项与 `vite.config.ts` 在配置方面是相同的。

然而，由于插件注册的顺序，如果我们以这种方式安装基于 Git 的页面历史插件，它将无法转换所需的数据和日志。

:::

因此，请在您的 VitePress 项目的根目录中创建一个单独的 `vite.config.ts` 文件：

::: tip 哪里是 VitePress 项目的根目录？

VitePress 项目的根目录是 `.vitepress` 目录的父目录。

例如，如果您的 VitePress 项目的目录结构如下所示：

```shell
.
├── docs
│   ├── .vitepress
│   │   ├── config.ts
│   │   └── theme
│   │       └── index.ts
│   └── README.md
```

在这种情况下，根目录是 `docs`。

```shell
.
├── .vitepress
│   ├── config.ts
│   └── theme
│       └── index.ts
└── README.md
```

在这种情况下，根目录是 `./`。

:::

```shell
touch vite.config.ts
```

##### 在 `vite.config.ts` 中配置插件

在位于项目根目录的独立的 [Vite 配置文件](https://vitejs.dev/config/)（也就是 `vite.config.ts` 中），我们需要导入 `GitChangelog`（数据获取）和 `GitChangelogMarkdownSection`（小部件嵌入）插件并进行正确配置：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

```typescript twoslash
import { join } from 'node:path'
import { defineConfig } from 'vite'
import { // [!code ++]
  GitChangelog, // [!code ++]
  GitChangelogMarkdownSection, // [!code ++]
} from '@nolebase/vitepress-plugin-git-changelog/vite' // [!code ++]

export default defineConfig(() => {
  return {
    plugins: [ // [!code ++]
      GitChangelog({ // [!code ++]
        // 填写在此处填写您的仓库链接
        repoURL: () => 'https://github.com/nolebase/integrations', // [!code ++]
      }), // [!code ++]
      GitChangelogMarkdownSection(), // [!code ++]
    ]
    // 其他 Vite 配置...
  }
})
```

### 与 VitePress 主题集成

现在，让我们将基于 Git 的页面历史 UI 小部件集成到您的 VitePress 项目中。

在 VitePress 的[**主题配置文件**](https://vitepress.dev/reference/default-theme-config#default-theme-config)（请注意，这与上面提及的**配置文件**并非是一个文件，主题配置文件通常位于 `docs/.vitepress/theme/index.ts`，文件路径和扩展名可能会有所不同），安装 Vue 插件并使用组件：

<!--@include: @/pages/zh-CM/snippets/details-colored-diff.md-->

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

::: code-group

```typescript twoslash [docs/.vitepress/theme/index.ts]
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeConfig } from 'vitepress'
import { // [!code ++]
  NolebaseGitChangelogPlugin // [!code ++]
} from '@nolebase/vitepress-plugin-git-changelog/client' // [!code ++]

import '@nolebase/vitepress-plugin-git-changelog/client/style.css' // [!code ++]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // 其他配置
  },
  enhanceApp({ app }) {
    app.use(NolebaseGitChangelogPlugin)  // [!code ++]
  },
}

export default Theme
```

:::

### 何时生成 Git 页面历史信息？配置部署工具与 CI/CD

::: tip 什么是 CI/CD？

通常使用基于 Git 的页面历史插件的文档都会使用 [GitHub Actions](https://github.com/features/actions) 或者 [GitLab 的 CI/CD Pipelines](https://docs.gitlab.com/ee/ci/yaml/) 在推送文档变更提交之后自动化在云端构建文档，而不是在需要构建的时候指引用户手动执行命令并且进行复杂的构建流程。你可以在 VitePress 官方的 [Platform Guides - VitePress](https://vitepress.dev/guide/deploy#platform-guides) 文档中阅读有关的更多信息。

像是 [GitHub Actions](https://github.com/features/actions) 和 [GitLab 的 CI/CD Pipelines](https://docs.gitlab.com/ee/ci/yaml/) 这样的与提交相关且具备自动化构建的工具，就是「[CI/CD（持续集成/持续部署](https://zh.wikipedia.org/wiki/CI/CD)）」中的 [CD（Continuous Deployment）](https://zh.wikipedia.org/wiki/%E6%8C%81%E7%BA%8C%E9%83%A8%E7%BD%B2)的一环。

当然上面列举的两大 Git 代码托管平台所自带的 CI/CD 能力只是冰山一角，事实上市面上也有其他的工具可以参考：

- [Netlify 的构建 hook](https://docs.netlify.com/configure-builds/build-hooks/)
- [Cloudflare Pages 的 Git 集成](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Vercel 的 GitHub 集成](https://vercel.com/docs/deployments/git/vercel-for-github)
- [CircleCI](https://circleci.com/)

上述平台和能力都是 CI/CD 的体现，他们允许用户在推送文档之后自动根据预先配置的命令和文档处理流水线进行静态网站的生成。

CI/CD 会运行在一个独立的服务器环境中，所有的构建流程，构建命令，还有环境都是在独立的、可复现的环境中进行的。

每当我们通过 `git` 命令或者 Git 客户端提交文档更新，或者提交的文档修改的 Pull Request 合并的时候，将会产生一个「commit（提交）」事件，一般 CI/CD 会根据这样的「commit」事件生成一个与所触发构建的「commit」相关的构建环境。

:::

CI/CD 与 Git 提交相关，而基于 Git 的页面历史又依赖于 Git 提交，所以在使用 CI/CD 这样的工具的时候，我们需要在使用之前进行检查和配置以确保 Git 日志的获取是全量或者定量的，否则将会出现没有办法正确获取 Git 日志的情况。

#### 在 [GitHub Actions](https://github.com/features/actions) 上进行构建

在与 Github Actions 一同使用的时候，我们只需要在 `actions/checkout` 的 `with` 参数中添加 `fetch-depth: 0` 的配置就可以确保在 CI/CD 环境中获取的 Git 日志是包含全部信息的了：

```yaml
name: Build Docs

on:
  push:
    branches:
      - 'main'

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - name: 拉取代码 # [!code focus]
        uses: actions/checkout@v4 # [!code focus]
        with: # [!code focus]
          fetch-depth: 0 # [!code focus]

      # ... 其他的步骤
```

#### 在 Netlify 上进行构建

Netlify 默认情况在 CI/CD 构建期间是能获取到全部 Git 日志的。

#### 在 Cloudflare Pages 上进行构建

Cloudflare Pages 自带的 CI/CD 流水线功能内部是不包含全部 Git 日志信息的，唯一的解决办法是先在 GitHub Actions 或者 GitLab CI/CD Pipelines 的受控环境中进行构建，然后再通过 Cloudflare 官方的 [`wrangler`](https://developers.cloudflare.com/workers/wrangler/install-and-update/) 工具部署构建产物。

比如参考使用 Cloudflare 官方维护的 GitHub Actions 插件 [`pages-action`](https://github.com/cloudflare/pages-action) 搭配在[在 GitHub Actions 上进行构建](#在-github-actions-上进行构建) 所介绍的 `fetch-depth: 0` 参数配置即可实现获取 Git 日志的能力。

#### 在 Vercel 上进行构建

在 Vercel 自带的 CI/CD 环境中，默认情况下是无法获取到全部 Git 日志信息的[^1]，通过设置环境变量 `VERCEL_DEEP_CLONE=true` 可以获取完整的 Git 提交信息。*需要注意的是这个环境变量不是稳定的公开 API，将在未来某个时间删除[^2]。*

还有一个更稳定但是稍复杂的解决的办法是先在 GitHub Actions 或者 GitLab CI/CD Pipelines 的受控环境中进行构建，然后再通过 Vercel 官方的 [`vercel` CLI 工具](https://vercel.com/docs/cli)进行部署。

## 错误排查

### 遭遇了 `Cannot find module ... or its corresponding type declarations` 错误？

<!--@include: @/pages/zh-CN/snippets/troubleshooting-cannot-find-module.md-->

[^1]: [Access git logs in build process · vercel/vercel · Discussion #4101](https://github.com/vercel/vercel/discussions/4101)

[^2]: [To tell Vercel to deep clone by setting an env var to VERCEL_DEEP_CLONE=1 · vercel/turborepo · Discussion #800](https://github.com/vercel/turborepo/discussions/800#discussioncomment-2730849)
