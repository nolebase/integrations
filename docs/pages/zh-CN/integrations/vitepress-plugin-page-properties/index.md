---
title: 页面属性
category: 页面属性
tags:
  - 集成/VitePress-插件
  - 集成/VitePress-插件/页面属性
  - Markdown/frontmatter
progress: 35
url1: https://nolebase-integrations.ayaka.io/pages/zh-CN/
createdAt: 2024-01-23
updatedAt: 2024-01-23
---

<script setup>
import packageJSON from '~/packages/vitepress-plugin-page-properties/package.json'
</script>

# 页面属性 <Badge type="danger" text="Alpha 测试" />

「页面属性」功能因受 Notion 页面属性的巨大启发而诞生。

## 安装

通过运行以下命令将 `@nolebase/vitepress-plugin-page-properties` 安装到您的项目依赖项中：

::: code-group

```shell [@antfu/ni]
ni @nolebase/vitepress-plugin-page-properties -D
```

```shell [pnpm]
pnpm add @nolebase/vitepress-plugin-page-properties -D
```

```shell [npm]
npm install @nolebase/vitepress-plugin-page-properties -D
```

```shell [yarn]
yarn add @nolebase/vitepress-plugin-page-properties -D
```

:::
