<script setup>
import packageJSON from '~/packages/vitepress-plugin-og-image/package.json'
</script>

# 预览图片（社交媒体卡片）生成 <Badge type="warning" :text="`Beta 测试 ${packageJSON.version}`" />

::: warning 🚧 施工中
很高兴见到你！但很抱歉，这个页面还在施工中，如果没有找到你感兴趣的信息，你可以先在侧边栏的导航中寻找你感兴趣的内容来开始阅读
:::

内容施工中，敬请期待！

## 安装

通过运行以下命令将 `@nolebase/vitepress-plugin-og-image` 安装到您的项目依赖项中：

::: code-group

```shell [@antfu/ni]
ni @nolebase/vitepress-plugin-og-image -D
```

```shell [pnpm]
pnpm add @nolebase/vitepress-plugin-og-image -D
```

```shell [npm]
npm install @nolebase/vitepress-plugin-og-image -D
```

```shell [yarn]
yarn add @nolebase/vitepress-plugin-og-image -D
```

:::

## 如何使用

### 启用自定义的社交卡片

本插件采用可缩放向量图形（svg）格式的模版为博文页面提供社交卡片功能。如果你希望使用自己设计的社交卡片，需要将你自定义的社交卡片模版命名为 `og-template.svg` 并将其放置在项目根目录下的 `public` 目录里。如果插件在 `public` 目录中找不到 `og-template.svg` 文件，则会使用插件自带的模版为博文页面生成社交卡片。
