---
title: 滑块
category: UI
---

<script setup>
import { NuInputSlider } from '@nolebase/ui'
</script>

# 滑块 <Badge type="danger" text="Alpha" />

::: danger 🛑 此包仍处于 Alpha 测试阶段
此包仍处于 Alpha 测试阶段，不建议在生产中使用。未来 API 可能会发生变化，当前版本可能存在错误。请谨慎使用。
:::

## 示例

<NuInputSlider
  name="Slider"
  :min="1"
  :max="10000"
  :step="1"
  :formatter="(val) => `${Math.ceil(val / 100)}%`"
/>
