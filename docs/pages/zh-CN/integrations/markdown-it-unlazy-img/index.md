<script setup>
import packageJSON from '~/packages/markdown-it-unlazy-img/package.json'
</script>

# 懒加载模糊预览图 <Badge type="warning" :text="`Beta 测试 ${packageJSON.version}`" />

::: warning 🚧 施工中
很高兴见到你！但很抱歉，这个页面还在施工中，如果没有找到你感兴趣的信息，你可以先在侧边栏的导航中寻找你感兴趣的内容来开始阅读
:::

一个将图像标签包装并转换为使用 [blurhash](https://github.com/woltapp/blurhash) 和 [thumbhash](https://github.com/evanw/thumbhash) 这类模糊图片哈希算法以支持 [unlazy](https://github.com/johannschopplich/unlazy) 图像懒加载的 [`markdown-it`](https://github.com/markdown-it/markdown-it) 插件。

## 安装

通过运行以下命令将 `@nolebase/markdown-it-bi-unlazy-img` 安装到您的项目依赖项中：

::: code-group

```shell [@antfu/ni]
ni @nolebase/markdown-it-bi-unlazy-img -D
```

```shell [pnpm]
pnpm add @nolebase/markdown-it-bi-unlazy-img -D
```

```shell [npm]
npm install @nolebase/markdown-it-bi-unlazy-img -D
```

```shell [yarn]
yarn add @nolebase/markdown-it-bi-unlazy-img -D
```

:::
