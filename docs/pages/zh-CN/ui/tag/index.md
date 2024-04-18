<script setup>
import { NuTag } from '@nolebase/ui'
</script>

# 标签 <Badge type="danger" text="Alpha" />

::: danger 🛑 此包仍处于 Alpha 测试阶段
此包仍处于 Alpha 测试阶段，不建议在生产中使用。未来 API 可能会发生变化，当前版本可能存在错误。请谨慎使用。
:::

::: warning 🚧 施工中
很高兴见到你！但很抱歉，这个页面还在施工中，如果没有找到你感兴趣的信息，你可以先在侧边栏的导航中寻找你感兴趣的内容来开始阅读
:::

## 多状态

### 普通状态

<div class="my-2 flex gap-2">
  <NuTag :tag="{ content: '标签内容' }" />
  <NuTag :tag="{ content: '标签内容 1' }" />
  <NuTag :tag="{ content: '标签内容 2' }" />
  <NuTag :tag="{ content: '标签内容 3' }" />
</div>

### 编辑状态

<div class="my-2 flex gap-2">
  <NuTag :tag="{ content: '标签内容' }" :editing="true" />
  <NuTag :tag="{ content: '标签内容 1' }" :editing="true" />
  <NuTag :tag="{ content: '标签内容 2' }" :editing="true" />
  <NuTag :tag="{ content: '标签内容 3' }" :editing="true" />
</div>
