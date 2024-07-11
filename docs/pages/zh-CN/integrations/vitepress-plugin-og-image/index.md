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

### 为我的项目自定义的社交卡片

本插件采用 SVG 格式的模版为每个页面提供社交卡片（也叫做 OpenGraph image，通常在 Meta，X，Discord 发送链接时会被展示成一个图片卡片，你可以在 [Nuxt SEO Og image Examples](https://nuxtseo.com/og-image/getting-started/examples) 了解更多内容）的功能。

要使用 `buildEndGenerateOpenGraphImages`，您需要两样东西：

为实际部署的网站指定 `baseUrl`。

默认情况下，`@nolebase/vitepress-plugin-og-image` 会尝试搜索 [`/public` 目录](https://vitepress.dev/guide/asset-handling#the-public-directory) 下的 `og-template.svg` 文件，以渲染社交卡片图片。在构建模板的时候，需要注意，`@nolebase/vitepress-plugin-og-image` 插件将使用

- `{{category}}`
- `{{site_name}}`
- `{{site_description})`

预览标题：

- `{{line1}}`
- `{{line2}}`
- `{{line3}}`

作为模板变量。(很抱歉设计得不好，但我还没想出更好的主意来为用户和开发人员设计出足够灵活的东西，欢迎大家提出意见来和我一起改进它。)

如果你希望使用自己设计的社交卡片图片，可以使用 Figma、Adobe Illustrator 制作包含上述内容的文件，需要将你自定义的社交卡片图片模版命名为 `og-template.svg`，并将其放置在 VitePress 项目根目录下的 [`/public` 目录](https://vitepress.dev/guide/asset-handling#the-public-directory) 目录里。

当然，如果没有准备模板也不用担心无法使用这个插件，如果插件在 `public` 目录中找不到 `og-template.svg` 文件，则会使用插件自带的模版为页面生成社交卡片的图片。
