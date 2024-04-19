<script setup>
import packageJSON from '~/packages/vitepress-plugin-enhanced-mark/package.json'
</script>

# `<mark>` <mark>元素增强</mark> <Badge type="tip" :text="`v${packageJSON.version}`" />

这是一个很有意思的小插件，为你的 `<mark>` 高亮元素添加<mark>展开划过</mark>的小动画。

## 功能

<div grid="~ cols-[auto_1fr] gap-1" items-start my-1>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>无 JavaScripts</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>炒鸡好看的<mark>动画</mark></span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>多行文本也支持</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>亮/暗色主题（暗色模式）适配</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>原生与 VitePress 样式兼容</span>
</div>

::: info 🤔 Performance drop? No!

This plugin doesn't contain any JavaScript code, only one stylesheet is provided.

Therefore, it should be theoretically performant, and won't cause any page lag.

:::

## 一览效果

它看起来将会是这样的：

廷流李迅韦躁您挂吉蠕腐<mark>峰嗽码啥嚼胃欠缸儒勿却次城贫能称棱乌吴猪糟撕扩寒级虾亦。</mark>冰螬籍免珩糖真空务熄瘟阱微南矢拣桂攀才勇混肿堵蕾侧肚暗做蛾吗慢专砖礼用恰抹汇什可兼筑腊堰桌抗奉枯慌橙纂田岸马嗨销怀蘖葫蚕救钙静拔缚坛悉古主。<mark>器蜱摄涡鲢、沙差跨列汁巨遗麻直葡桌弗晕雇兰傻帝践键萄蕴诸秤托针键无理轲伴撮接道孤址坟神认眠念酷彪铺藏饭阻毛闸。腕钴填靳凝迎荸浑水界染防黑畔、臂炕传绞夏蕨党运器蓟阻外妙蹲悉橙。</mark>绘饵定音！

或者在引用块中：

> 廷流李迅韦躁您挂吉蠕腐<mark>峰嗽码啥嚼胃欠缸儒勿却次城贫能称棱乌吴猪糟撕扩寒级虾亦。</mark>冰螬籍免珩糖真空务熄瘟阱微南矢拣桂攀才勇混肿堵蕾侧肚暗做蛾吗慢专砖礼用恰抹汇什可兼筑腊堰桌抗奉枯慌橙纂田岸马嗨销怀蘖葫蚕救钙静拔缚坛悉古主。<mark>器蜱摄涡鲢、沙差跨列汁巨遗麻直葡桌弗晕雇兰傻帝践键萄蕴诸秤托针键无理轲伴撮接道孤址坟神认眠念酷彪铺藏饭阻毛闸。腕钴填靳凝迎荸浑水界染防黑畔、臂炕传绞夏蕨党运器蓟阻外妙蹲悉橙。</mark>绘饵定音！

## 安装

通过运行以下命令将 `@nolebase/vitepress-plugin-enhanced-mark` 安装到您的项目依赖项中：

::: code-group

```shell [@antfu/ni]
ni @nolebase/vitepress-plugin-enhanced-mark -D
```

```shell [pnpm]
pnpm add @nolebase/vitepress-plugin-enhanced-mark -D
```

```shell [npm]
npm install @nolebase/vitepress-plugin-enhanced-mark -D
```

```shell [yarn]
yarn add @nolebase/vitepress-plugin-enhanced-mark -D
```

:::

## 配置

在 VitePress 的[**主题配置文件**](https://vitepress.dev/reference/default-theme-config#default-theme-config)中（注意不是**配置文件**，通常为 `docs/.vitepress/theme/index.ts`，文件路径和拓展名也许会有区别），**将 `<mark>` 元素增强插件所提供的样式表更新到 VitePress 主题中**：

<!--@include: @/pages/zh-CN/snippets/details-colored-diff.md-->

::: code-group

```typescript twoslash [.vitepress/theme/index.ts]
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeConfig } from 'vitepress'

import '@nolebase/vitepress-plugin-enhanced-mark/client/style.css' // [!code ++]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // 其他配置...
  },
  enhanceApp({ app }) {
    // 其他配置...
  },
}

export default Theme
```

:::

